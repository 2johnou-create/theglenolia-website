import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function seeded(seed) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const cube = new THREE.BoxGeometry(1, 1, 1);
const pebble = new THREE.IcosahedronGeometry(1, 1);
const cylinders = new Map();
const colours = new Map();
const up = new THREE.Vector3(0, 1, 0);
function material(colour) {
  if (!colours.has(colour)) colours.set(colour, new THREE.MeshLambertMaterial({color: colour, side: THREE.DoubleSide}));
  return colours.get(colour);
}
function group(parent, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}
function part(parent, geometry, colour, x, y, z, w=1, h=1, d=1) {
  const mesh = new THREE.Mesh(geometry, material(colour));
  mesh.position.set(x,y,z);
  mesh.scale.set(w,h,d);
  parent.add(mesh);
  return mesh;
}
function box(p,x,y,z,w,h,d,c) { return part(p,cube,c,x,y,z,w,h,d); }
function ell(p,x,y,z,w,h,d,c) { return part(p,pebble,c,x,y,z,w,h,d); }
function cylinder(p,x,y,z,top,bottom,h,c,sides=12) {
  const ratio = Math.round(top/bottom*100)/100;
  const key = ratio+'/'+sides;
  if (!cylinders.has(key)) cylinders.set(key,new THREE.CylinderGeometry(ratio,1,1,sides));
  return part(p,cylinders.get(key),c,x,y,z,bottom,h,bottom);
}
function rod(p,start,end,r,c,base=r) {
  const a=new THREE.Vector3(...start), b=new THREE.Vector3(...end), direction=b.clone().sub(a);
  const mid=a.addScaledVector(direction,.5);
  const mesh=cylinder(p,mid.x,mid.y,mid.z,r,base,direction.length(),c,7);
  mesh.quaternion.setFromUnitVectors(up,direction.normalize());
  return mesh;
}

// One draw call for an entire painted model. Keep leaves double-sided, and bake
// colour onto each face so new catalogue stages don't multiply material passes.
let leafPaint,soilPaint;
export async function loadPlantMaterials(assets) {
  const loader=new THREE.TextureLoader();
  const [leaves,earth]=await Promise.all(['leaf','earth'].map(name=>loader.loadAsync(assets+'/world/'+name+'.webp')));
  for(const texture of [leaves,earth])texture.colorSpace=THREE.SRGBColorSpace;
  leafPaint=new THREE.MeshBasicMaterial({map:leaves,vertexColors:true,alphaTest:.28,side:THREE.DoubleSide});
  soilPaint=new THREE.MeshBasicMaterial({map:earth,vertexColors:true,alphaTest:.24,side:THREE.DoubleSide});
}
const paint = new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
function bake(group) {
  group.updateMatrixWorld(true);
  const batches=new Map();
  group.traverse(object=>{
    if (!object.isMesh) return;
    const source=object.geometry;
    const geometry=source.index ? source.toNonIndexed() : source.clone();
    geometry.applyMatrix4(object.matrixWorld);
    const coating=object.userData.coating||paint;
    if(coating===paint)geometry.deleteAttribute('uv');
    const count=geometry.attributes.position.count, rgb=new Float32Array(count*3);
    const colour=object.material.color, tints=geometry.getAttribute('color');
    for(let i=0;i<count;i++) {
      rgb[i*3]=colour.r*(tints?.getX(i)??1);
      rgb[i*3+1]=colour.g*(tints?.getY(i)??1);
      rgb[i*3+2]=colour.b*(tints?.getZ(i)??1);
    }
    geometry.setAttribute('color',new THREE.BufferAttribute(rgb,3));
    if(!batches.has(coating))batches.set(coating,[]);
    batches.get(coating).push(geometry);
  });
  const model=new THREE.Group();
  for(const [coating,parts] of batches){
    const merged=mergeGeometries(parts);
    model.add(new THREE.Mesh(merged,coating));
    for(const piece of parts)piece.dispose();
  }
  return model.children.length===1?model.children[0]:model;
}

function leafBlade() {
  const vertices=[], indices=[], tints=[],uvs=[];
  for(let i=0;i<=12;i++){
    const t=i/12, width=.155*(1+.07*Math.sin(t*22));
    const height=.19*Math.sin(t*2.8)+.042*t;
    for(let j=-1;j<=1;j++){
      vertices.push(t*.62,height-Math.abs(j)*width*.27,j*width);
      uvs.push(t,(j+1)/2);
      const v=j===0?1:(j<0?.88:.97);
      tints.push(v,v,v);
    }
    if(i){const a=(i-1)*3;indices.push(a,a+1,a+3,a+1,a+4,a+3,a+1,a+2,a+4,a+2,a+5,a+4);}
  }
  const b=new THREE.BufferGeometry();b.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  b.setAttribute('color',new THREE.Float32BufferAttribute(tints,3));b.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));b.setIndex(indices);b.computeVertexNormals();
  return b;
}
const leaf=leafBlade();
function leafPair(parent,x,y,z,size,angle,young){
  for(let side=0;side<2;side++){
    const p=group(parent,x,y,z);p.rotation.y=angle+side*Math.PI;p.rotation.z=young?.23:-.06;p.scale.setScalar(size);
    const painted=part(p,leaf,young?'#eeedaf':side?'#d4e6b8':'#e4ecc9',0,0,0);
    painted.userData.coating=leafPaint;
  }
}
const grassBlade=new THREE.BufferGeometry();
grassBlade.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.05,0,0,.05,.44,.65,.01],3));
grassBlade.computeVertexNormals();
const soilSurface=new THREE.PlaneGeometry(1.25,1.25,8,8);soilSurface.rotateX(-Math.PI/2);
// The slightly uneven lip is modelled in earth rather than drawn into the grass.
const earthRim=new THREE.TorusGeometry(.54,.026,6,54);
earthRim.rotateX(Math.PI/2);
const rimPoints=earthRim.attributes.position;
for(let i=0;i<rimPoints.count;i++){
  const x=rimPoints.getX(i), z=rimPoints.getZ(i), angle=Math.atan2(z,x);
  const irregular=1+.015*Math.sin(5*angle)+.012*Math.sin(9*angle+.7);
  rimPoints.setXYZ(i,x*irregular,rimPoints.getY(i)*.68,z*irregular);
}
earthRim.computeVertexNormals();
const coffeeModels=new Map();
export function coffeeModel(stage,variant) {
  const key=stage+'/'+variant;
  if(coffeeModels.has(key)) return coffeeModels.get(key).clone();
  const root=new THREE.Group(), random=seeded(701+variant*53), turn=random()*Math.PI;
  // The slight offsets are illustrative. They never encode a field measurement.
  for(let i=0;i<23;i++){
    const a=random()*Math.PI*2, r=Math.sqrt(random())*.48, s=.01+random()*.036;
    ell(root,Math.cos(a)*r,.041,Math.sin(a)*r,s,s*.48,s*.74,i%3?'#bf9570':'#987353');
  }
  const soil=part(root,soilSurface,'#f7eddd',0,.049,0);soil.userData.coating=soilPaint;
  soil.rotation.y=turn;
  const outerLip=part(root,earthRim,'#997756',0,.063,0,1.03,1,1.03);
  outerLip.rotation.y=turn;
  const sandRim=part(root,earthRim,'#d7ae77',0,.077,0,.992,1,.992);
  sandRim.rotation.y=turn;
  for(let i=0;i<12;i++){
    const a=random()*Math.PI*2,r=.56+random()*.6,x=Math.cos(a)*r,z=Math.sin(a)*r;
    for(let j=0;j<3;j++){
      const blade=part(root,grassBlade,j%2?'#b4c18a':'#91aa74',x,.003,z,.12,.18,.075);
      blade.rotation.y=a+j*2.1;blade.rotation.z=.6+random()*.42;
    }
  }
  if(stage===1){
    cylinder(root,.025,.064,0,.21,.18,.013,'#85674f',17);
  }else{
    const height=[0,0,.63,1.04,1.46,1.86,2,2.04,2.08,2.08,2.08][stage]*(.94+variant*.018);
    const lean=(random()-.5)*.20;
    rod(root,[0,.035,0],[lean,height,0],stage>3?.026:.014,stage>3?'#897657':'#69824f',stage>3?.066:.028);
    if(stage<=3){
      const pairs=stage===2?3:5;
      for(let i=0;i<pairs;i++){const t=(i+1)/(pairs+.35);
        leafPair(root,lean*t,height*t,0,(i===pairs-1?.50:.88)*(1+variant*.025),turn+i*1.44,i===pairs-1);}
    }else{
      const levels=stage===4?3:5;
      for(let i=0;i<levels;i++){
        const t=.26+.69*i/levels, reach=(1-.58*t)*(stage===4?.78:1.15);
        const angle=turn+i*1.7;
        for(let side=0;side<2;side++){
          const branch=group(root,lean*t,height*t,0);branch.rotation.y=angle+side*Math.PI;
          rod(branch,[0,0,0],[reach,.17,0],.013,'#7a8056',.031);
          for(let j=1;j<=3;j++)leafPair(branch,reach*j/3,.17*j/3,0,.52+.09*(3-j),1.1+j*.13,j===3&&i===levels-1);
          if(stage>=6)for(let j=0;j<4;j++){const x=.14+j*.105;
            if(stage===6)ell(branch,x,.061,.057,.039,.064,.039,'#d8dea3');
            else if(stage===7){for(let p=0;p<5;p++){const a=p*Math.PI*2/5;ell(branch,x+Math.cos(a)*.066,.075,.07+Math.sin(a)*.066,.056,.027,.048,'#fff6da');}
              ell(branch,x,.103,.07,.024,.019,.024,'#dac776');}
            else {const cherry=stage===8?'#779957':stage===10?'#a54338':['#8fa151','#c3824c','#b84e3d'][(j+i+side)%3];
              ell(branch,x,.012,.064,.059,.076,.055,cherry);ell(branch,x+.052,.022,-.056,.054,.071,.052,cherry);}
          }
        }
      }
      leafPair(root,lean,height,0,.50,turn,true);
    }
  }
  const model=bake(root);coffeeModels.set(key,model);return model.clone();
}

// The foreground gate uses real rails, slats, hardware and post end-grain.
export function timberGate() {
  const g=new THREE.Group(), z=10.28, left=-26.55;
  const gateWidth=3.65, spans=[gateWidth,2.35,2.35,2.35,2.35];
  let x=left;
  for (let i=0;i<=spans.length;i++) {
    box(g,x,.55,z,.23,1.12,.24,'#97764e');
    box(g,x-.046,.57,z+.122,.064,1.03,.014,'#d3ac75');
    box(g,x,.995,z+.14,.23,.038,.035,'#786247');
    box(g,x,1.126,z,.232,.047,.24,'#ebca92');
    if(i===spans.length)break;
    const width=spans[i];
    for (const y of [.30,.78]) {
      box(g,x+width/2,y,z-.023,width,.126,.106,'#b18b61');
      box(g,x+width/2,y+.047,z+.036,width*.98,.02,.015,'#e5c693');
      box(g,x+width/2,y-.058,z+.033,width*.99,.017,.012,'#806b51');
      for(const end of [.17,width-.17])ell(g,x+end,y,z+.059,.024,.024,.014,'#625b50');
    }
    x+=width;
  }
  for (const px of [left+.18,left+gateWidth-.18]) box(g,px,.54,z,.125,.85,.137,'#ac8558');
  const diagonal=box(g,left+gateWidth/2,.53,z-.094,gateWidth-.27,.138,.10,'#ae8658');
  diagonal.rotation.z=.155;
  for (const y of [.30,.78]) {
    box(g,left+.29,y,z+.11,.51,.07,.032,'#727776');
    box(g,left+.12,y,z+.12,.063,.14,.063,'#474d49');
    ell(g,left+.46,y,z+.136,.023,.022,.012,'#48483e');
  }
  box(g,left+gateWidth-.04,.67,z+.15,.39,.052,.036,'#606460');
  return bake(g);
}
