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

function fence(parent, x, z, bays) {
  for (let i = 0; i <= bays; i++) {
    const post = x + i * 1.6;
    box(parent, post, .44, z, .12, .86, .12, '#ab9271');
    if (i < bays) {
      for (const height of [.31, .64]) box(parent, post + .8, height, z, 1.61, .074, .07, '#d3be92');
    }
  }
}

function wheel(parent, x, y, z, radius) {
  const tyre = cylinder(parent, x, y, z, radius, radius, .22, '#5c6262', 16);
  tyre.rotation.x = Math.PI / 2;
  const hub = cylinder(parent, x, y, z + (z > 0 ? .125 : -.125), radius * .54, radius * .54, .045, '#c09964', 14);
  hub.rotation.x = Math.PI / 2;
  for (let i = 0; i < 11; i++) {
    const angle = i * Math.PI * 2 / 11;
    const tread = box(parent, x + radius * .98 * Math.cos(angle), y + radius * .98 * Math.sin(angle), z,
      .12, .065, .23, '#616767');
    tread.rotation.z = angle + Math.PI / 2;
  }
}

function hoop(parent, x, y, z, radius, tube, colour) {
  return part(parent, new THREE.TorusGeometry(radius, tube, 6, 20), colour, x, y, z);
}

function tractor(parent) {
  const body = group(parent, -24.35, .05, 3.4);
  body.rotation.y = .22;
  body.scale.setScalar(1.07);
  for (const side of [-1, 1]) {
    wheel(body, -.60, .57, side * .55, .56);
    wheel(body, .85, .34, side * .46, .33);
    box(body, -.55, 1.02, side * .53, .9, .07, .34, '#80a99a');
    ell(body, 1.075, 1.10, side * .26, .085, .064, .072, '#ffebb0');
  }
  box(body, .08, .58, 0, 2, .20, .60, '#6a796b');
  box(body, .49, .90, 0, 1.15, .56, .69, '#80a99a');
  box(body, 1.07, .91, 0, .06, .40, .55, '#a7beb1');
  for (let i = -2; i <= 2; i++) box(body, 1.109, .90, i * .089, .032, .29, .021, '#536b62');
  box(body, -.46, 1.04, 0, .42, .11, .38, '#74695e');
  box(body, -.68, 1.2, 0, .07, .28, .38, '#74695e');
  rod(body, [-.07,.97,0], [-.19,1.29,0], .032, '#5c726c');
  hoop(body, -.20, 1.31, 0, .15, .025, '#5b6562').rotation.y = 1;
  cylinder(body, .64, 1.40, -.16, .042, .055, .50, '#66776d');
}

function workerAndBarrow() {
  const worker = new THREE.Group();
  worker.position.set(-23.63, .04, 7.18);
  cylinder(worker, 0, .76, 0, .17, .14, .50, '#b98568', 8);
  ell(worker, 0, 1.13, 0, .122, .156, .115, '#b98f72');
  cylinder(worker, 0, 1.25, 0, .27, .27, .035, '#c8af79');
  cylinder(worker, 0, 1.30, 0, .14, .17, .12, '#d5c08c');
  for (const side of [-1, 1]) {
    rod(worker, [side*.101,.52,0], [side*.14,.10,side*.07], .072, '#718695');
    box(worker, side*.14, .08, side*.07+.04, .15, .12, .22, '#786e5a');
    rod(worker, [side*.16,.94,0], [side*.23,.62,.14], .047, '#c19376');
  }
  const barrow = new THREE.Group();
  barrow.position.set(-22.82,.05,6.8);
  barrow.rotation.y = .42;
  box(barrow, 0, .54, 0, .76, .24, .47, '#b47d65');
  wheel(barrow, .37, .23, 0, .21);
  for (const z of [-.18,.18]) {
    rod(barrow, [-.77,.61,z], [.25,.39,z], .027, '#807560');
    rod(barrow, [-.25,.41,z], [-.32,.04,z], .024, '#807560');
  }
  return {worker:bake(worker), barrow:bake(barrow)};
}

function waterTank(parent) {
  const tank = group(parent, -24.7,.04,-7.5);
  cylinder(tank, 0, .77, 0, .88, .89, 1.53, '#9cb3ad', 32);
  for (let i=0;i<10;i++) hoop(tank,0,.13+i*.14,0,.88,.022,'#879f97').rotation.x=Math.PI/2;
  cylinder(tank, 0, 1.62, 0, .38, .91, .21, '#b9c7b9', 32);
  cylinder(tank, .13, 1.74, 0, .22, .22, .06, '#7d8e80', 24);
  rod(tank, [.86,.31,0], [1.14,.31,0], .051, '#8e9b98');
  rod(tank, [1.13,.31,0], [1.13,.12,0], .054, '#8e9b98');
  box(tank, 1.13, .42, 0, .24, .04, .04, '#b98165');
}

function workbench(parent) {
  const bench = group(parent,-24.8,0,-2.35);
  bench.rotation.y=-.23;
  for (const x of [-.85,.85]) for (const z of [-.31,.31]) box(bench,x,.46,z,.085,.90,.085,'#ae9276');
  for (let j=0;j<4;j++) box(bench,0,.91,-.32+j*.20,2.06,.11,.18,'#c0a581');
  for (let j=0;j<3;j++) {
    cylinder(bench,-.59+j*.32,1.1,0,.14,.08,.27,'#c58a71');
    cylinder(bench,-.59+j*.32,1.245,0,.113,.113,.008,'#756e58');
  }
  for (const x of [.40,.62]) {
    rod(bench,[x,.06,.68],[x+.21,1.45,.15],.023,'#ae9276');
    box(bench,x,.11,.67,.11,.15,.044,'#798982');
  }
}

export function farmEquipment() {
  const root=new THREE.Group();
  fence(root,-26.2,10.18,6);
  fence(root,15.9,-10.1,6);
  tractor(root);
  waterTank(root);
  workbench(root);
  for (let i=0;i<4;i++) hoop(root,-25.15,.065+i*.031,7.5,.46-i*.055,.035,'#82998a').rotation.x=Math.PI/2;
  for (let i=0;i<3;i++) {
    const crate=group(root,24,.07,1.1+i*1.1);
    crate.rotation.y=.2;
    for(const x of [-.56,.56]) for(const z of [-.31,.31]) box(crate,x,.21,z,.067,.42,.067,'#8b7969');
    for(let j=0;j<3;j++) {
      for(const z of [-.32,.32]) box(crate,0,.09+j*.13,z,1.15,.09,.05,'#bc9c78');
      box(crate,0,.05,-.2+j*.2,1.13,.06,.18,'#ae9276');
    }
  }
  return {equipment:bake(root), ...workerAndBarrow()};
}
