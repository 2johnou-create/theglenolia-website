import * as THREE from 'three';

// Original illustrative landscape, not a survey or a representation of the
// property's actual levels, geology, vegetation or approved development plan.
const HALF_X = 9, HALF_Z = 7, CORNER = .6;
const clamp = THREE.MathUtils.clamp;
const smooth = (a, b, x) => { const t = clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };

function randomSource(seed = 11871) {
  let n = seed >>> 0;
  return () => { n = (Math.imul(n,1664525)+1013904223)>>>0; return n/4294967296; };
}
function hash(x,z) {
  const n = Math.sin(x*127.1+z*311.7)*43758.5453123;
  return n-Math.floor(n);
}
function noise(x,z) {
  const ix=Math.floor(x), iz=Math.floor(z), u=smooth(0,1,x-ix), v=smooth(0,1,z-iz);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix,iz),hash(ix+1,iz),u),THREE.MathUtils.lerp(hash(ix,iz+1),hash(ix+1,iz+1),u),v);
}
function plateau(x,z,cx,cz,hx,hz,transition=.65) {
  const distance=Math.max(Math.abs(x-cx)-hx,Math.abs(z-cz)-hz);
  return 1-smooth(0,transition,distance);
}


function extentAtZ(z) {
  const q=Math.max(0,Math.abs(z)-(HALF_Z-CORNER));
  return q>0?HALF_X-CORNER+Math.sqrt(Math.max(0,CORNER*CORNER-q*q)):HALF_X;
}
function inside(x,z,margin=0) {
  if(Math.abs(z)>HALF_Z-margin)return false;
  return Math.abs(x)<extentAtZ(z)-margin;
}

function noiseTexture(size,seed,colour=false) {
  const rand=randomSource(seed), pixels=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    const coarse=noise(x/19,y/19), fine=rand(), n=clamp(.63+.23*coarse+.14*fine,0,1), i=(y*size+x)*4;
    pixels[i]=Math.round(n*255); pixels[i+1]=Math.round(n*(colour?.985:1)*255);pixels[i+2]=Math.round(n*(colour?.94:1)*255);pixels[i+3]=255;
  }
  const texture=new THREE.DataTexture(pixels,size,size,THREE.RGBAFormat);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;
  if(colour)texture.colorSpace=THREE.SRGBColorSpace;
  return texture;
}
function geometry(positions,indices,colours,uvs) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  if(indices)g.setIndex(indices);
  if(colours)g.setAttribute('color',new THREE.Float32BufferAttribute(colours,3));
  if(uvs)g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  g.computeVertexNormals();g.computeBoundingSphere();return g;
}
function leafGeometry() {
  const p=[], uv=[], ids=[], rows=5;
  for(let i=0;i<=rows;i++) {
    const t=i/rows, width=Math.sin(Math.PI*t)**.78*.48;
    for(let j=0;j<3;j++) {const side=j-1;p.push(side*width,.12*Math.sin(Math.PI*t)-Math.abs(side)*.085*Math.sin(Math.PI*t),t-.18);uv.push(j/2,t);}
  }
  for(let i=0;i<rows;i++)for(let j=0;j<2;j++){const a=i*3+j;ids.push(a,a+3,a+1,a+1,a+3,a+4);}
  return geometry(p,ids,null,uv);
}
function grassGeometry() {
  // Two crossed curved blades, rather than a camera-facing billboard plane.
  return geometry([
    -.028,0,0,.028,0,0,.015,.45,.025,.07,.78,.07,
    0,0,-.025,0,0,.025,-.025,.37,.015,-.07,.66,.06,
  ],[0,1,2,0,2,3,4,6,5,4,7,6]);
}

export function createDioramaTerrain({width=30,depth=24,groundY=.43,pads=[],seed=11871}={}) {
  if(!Number.isFinite(width)||width<10||width>80||!Number.isFinite(depth)||depth<8||depth>80||!Number.isFinite(groundY))throw new TypeError('Invalid diorama terrain dimensions');
  if(!Array.isArray(pads)||pads.length>20)throw new TypeError('Invalid diorama terrain pads');
  const scaleX=width/18,scaleZ=depth/14,BOTTOM=groundY-2.6;
  const cleanPads=pads.map(p=>{if(!p||!['x','z','w','d'].every(k=>Number.isFinite(p[k]))||p.w<=0||p.d<=0)throw new TypeError('Invalid diorama terrain pad');return {x:p.x/scaleX,z:p.z/scaleZ,hx:p.w/scaleX/2,hz:p.d/scaleZ/2};});
  const integerSeed=Number.isFinite(seed)?seed>>>0:11871;
  function reserved(x,z,margin=.12){return cleanPads.some(p=>Math.abs(x-p.x)<p.hx+margin&&Math.abs(z-p.z)<p.hz+margin);}
  function heightAt(x,z){
    x=clamp(x,-HALF_X,HALF_X);z=clamp(z,-HALF_Z,HALF_Z);
    const hill=.30*Math.exp(-((x+6.7)**2/6+(z+5.4)**2/3.8))+.23*Math.exp(-((x-6.5)**2/5+(z+4.8)**2/7))+1.72*Math.exp(-((x-6.4)**2/6.2+(z+5.6)**2/2.7));
    let h=groundY+hill+.16*(noise(x*.34,z*.34)-.35)+.075*(noise(x*1.1,z*1.1)-.5)+.025*(noise(x*4.1,z*4.1)-.5);
    for(const p of cleanPads)h=THREE.MathUtils.lerp(h,groundY,plateau(x,z,p.x,p.z,p.hx,p.hz,.55));
    return h;
  }
  const root=new THREE.Group();root.name='Original illustrative planted terrain';
  const rand=randomSource(integerSeed), dummy=new THREE.Object3D(), colour=new THREE.Color();
  const groundBump=noiseTexture(128,881);groundBump.repeat.set(11,9);
  const soilBump=noiseTexture(128,234);soilBump.repeat.set(13,3);
  const groundMat=new THREE.MeshStandardMaterial({color:0xf9f5ed,vertexColors:true,roughness:.98,metalness:0,bumpMap:groundBump,bumpScale:.08});
  const cutMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:1,bumpMap:soilBump,bumpScale:.10});
  const rockMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:false,roughness:.94,bumpMap:soilBump,bumpScale:.035,flatShading:true});
  const grassMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,side:THREE.DoubleSide});
  const barkMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.96,bumpMap:soilBump,bumpScale:.055});
  const leafMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.83,side:THREE.DoubleSide});
  const flowerMat=new THREE.MeshStandardMaterial({color:0xf5f1e8,roughness:.75});
  const windUniform={value:.45},timeUniform={value:0};
  function windMaterial(mat,amount) {
    mat.onBeforeCompile=shader=>{
      shader.uniforms.uLandscapeTime=timeUniform;shader.uniforms.uLandscapeWind=windUniform;
      shader.vertexShader='uniform float uLandscapeTime;\nuniform float uLandscapeWind;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat phase = instanceMatrix[3].x * .83 + instanceMatrix[3].z * .71;\ntransformed.x += sin(uLandscapeTime * 1.8 + phase + position.y) * uLandscapeWind * ${amount.toFixed(3)} * max(position.y,position.z*.6);\ntransformed.z += cos(uLandscapeTime * 1.3 + phase) * uLandscapeWind * ${(amount*.55).toFixed(3)} * max(position.y,position.z*.6);\n#endif`);
    };
    mat.customProgramCacheKey=()=>`glenolia-landscape-wind-${amount}`;
  }
  windMaterial(leafMat,.10);windMaterial(grassMat,.13);

  // A continuous softly varied surface with dense, subtle vertex colouring.
  const nx=144,nz=112,p=[],c=[],uv=[],ids=[];
  const fieldA=new THREE.Color(0x7d8c57),fieldB=new THREE.Color(0x969d6a),earth=new THREE.Color(0xa99b7c);
  for(let j=0;j<=nz;j++) {
    const z=-HALF_Z+j/nz*HALF_Z*2,ex=extentAtZ(z);
    for(let i=0;i<=nx;i++) {
      const x=(-1+i/nx*2)*ex,y=heightAt(x,z), n=noise(x*.8,z*.8), fine=noise(x*7,z*7);
      p.push(x,y,z);uv.push(x/18,z/14);
      colour.copy(fieldA).lerp(fieldB,n*.8).lerp(earth,Math.max(0,noise(x*1.3+20,z*1.3)-.58)*.38);
      const gradient=Math.hypot(heightAt(x+.12,z)-heightAt(x-.12,z),heightAt(x,z+.12)-heightAt(x,z-.12))/.24;
      const rockFace=smooth(.28,.85,gradient)*smooth(groundY+.27,groundY+.92,y);
      colour.lerp(new THREE.Color(0x918b76),rockFace*.88);
      colour.multiplyScalar(.94+fine*.13);c.push(colour.r,colour.g,colour.b);
    }
  }
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i;ids.push(a,a+nx+1,a+1,a+1,a+nx+1,a+nx+2);}
  const land=new THREE.Mesh(geometry(p,ids,c,uv),groundMat);land.name='Fine contoured meadow surface';land.receiveShadow=true;root.add(land);

  // Continuous stone/earth strata follow the exact same rounded perimeter.
  const edge=[],segments=96;
  for(let i=0;i<=segments;i++)edge.push([-8.4+16.8*i/segments,-7]);
  for(let i=1;i<=segments;i++){const z=-7+14*i/segments;edge.push([extentAtZ(z),z]);}
  for(let i=1;i<=segments;i++)edge.push([8.4-16.8*i/segments,7]);
  for(let i=1;i<segments;i++){const z=7-14*i/segments;edge.push([-extentAtZ(z),z]);}
  const strata=[{col:0xaaa28e},{col:0xa59a82},{col:0xb7ac95},{col:0xa9987d},{col:0x71644c}];
  function layerBoundary(k,x,z,h){
    if(k===0)return BOTTOM;
    if(k===5)return h;
    if(k===4)return h-.17-.035*noise(x*2.4,z*2.4);
    return [BOTTOM,groundY-1.91,groundY-1.32,groundY-.71][k]+Math.sin(x*.61+z*.43+k*.8)*.13+Math.sin(x*1.7-z*.8+k*2.6)*.05+(noise(x*.65+k*11,z*.7)-.5)*.11;
  }
  for(let layer=0;layer<strata.length;layer++) {
    const spec=strata[layer],pos=[],cols=[],tex=[],ix=[];
    for(let i=0;i<=edge.length;i++) {
      const [x,z]=edge[i%edge.length],h=heightAt(x,z);
      const lo=layerBoundary(layer,x,z,h),hi=layerBoundary(layer+1,x,z,h);
      for(const [y,k]of [[lo,0],[hi,1]]){
        pos.push(x,y,z);tex.push(i/edge.length*8,(y+1.7)/3);
        colour.set(spec.col).multiplyScalar(.88+noise(x*3.9+layer*8,z*3.9+y*2)*.20);cols.push(colour.r,colour.g,colour.b);
      }
      if(i<edge.length){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2);}
    }
    const side=new THREE.Mesh(geometry(pos,ix,cols,tex),cutMat);side.name=`Exposed illustrative earth layer ${layer+1}`;side.receiveShadow=true;side.castShadow=true;root.add(side);
  }
  const bottomShape=new THREE.Shape();edge.forEach(([x,z],i)=>i?bottomShape.lineTo(x,-z):bottomShape.moveTo(x,-z));bottomShape.closePath();
  const bottom=new THREE.Mesh(new THREE.ShapeGeometry(bottomShape),new THREE.MeshStandardMaterial({color:0xb4aa93,roughness:1}));bottom.rotation.x=Math.PI/2;bottom.position.y=BOTTOM;root.add(bottom);

  // A gently curving gravel walk visually connects the two study areas.
  const pathCurves=[
    new THREE.CatmullRomCurve3([new THREE.Vector3(-8.75,0,.18),new THREE.Vector3(-4.5,0,-.10),new THREE.Vector3(0,0,.18),new THREE.Vector3(4.5,0,-.16),new THREE.Vector3(8.75,0,.18)]),
    new THREE.CatmullRomCurve3([new THREE.Vector3(.13,0,-6.75),new THREE.Vector3(-.15,0,-3.4),new THREE.Vector3(.15,0,0),new THREE.Vector3(-.11,0,3.4),new THREE.Vector3(.13,0,6.75)])
  ];
  const pathPts=[],pathPositions=[],pathColours=[],pathUvs=[],pathIndices=[],pathSide=[];
  for(const pathCurve of pathCurves){
    const pts=pathCurve.getPoints(144),offset=pathPositions.length/3,clear=[];
    for(let i=0;i<pts.length;i++){
      const pt=pts[i],tangent=pathCurve.getTangent(i/(pts.length-1)),normal=new THREE.Vector3(-tangent.z,0,tangent.x).normalize();
      pathPts.push(pt);pathSide.push(normal);clear.push(!reserved(pt.x,pt.z,.70));
      for(let j=0;j<3;j++){
        const k=(j-1)*(.43+.035*Math.sin(i*.11)),x=pt.x+normal.x*k,z=pt.z+normal.z*k;
        pathPositions.push(x,heightAt(x,z)+.024,z);pathUvs.push(j/2,i/12);
        colour.set(0xc9bea4).multiplyScalar(.93+noise(x*5,z*5)*.1);pathColours.push(colour.r,colour.g,colour.b);
      }
    }
    for(let i=0;i<pts.length-1;i++)if(clear[i]&&clear[i+1])for(let j=0;j<2;j++){const a=offset+i*3+j;pathIndices.push(a,a+1,a+3,a+1,a+4,a+3);}
  }
  const pathMat=new THREE.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:1,bumpMap:groundBump,bumpScale:.045});
  const walk=new THREE.Mesh(geometry(pathPositions,pathIndices,pathColours,pathUvs),pathMat);walk.name='Curved fine-gravel connecting path';walk.receiveShadow=true;root.add(walk);
  function distanceToPath(x,z) {let best=100;for(let i=0;i<pathPts.length;i+=5)best=Math.min(best,Math.hypot(pathPts[i].x-x,pathPts[i].z-z));return best;}

  const rockGeometry=new THREE.IcosahedronGeometry(1,1);
  const stones=[];
  // Pebbles along the gravel edges, plus retained stone on the nursery terrace.
  for(let i=2;i<pathPts.length-2;i+=2){for(const sign of[-1,1]){const pt=pathPts[i],n=pathSide[i],x=pt.x+n.x*sign*(.50+rand()*.10),z=pt.z+n.z*sign*(.50+rand()*.10);if(reserved(x,z,.2))continue;stones.push({x,z,y:heightAt(x,z)+.025,sx:.035+rand()*.035,sy:.025+rand()*.02,sz:.045+rand()*.05});}}
  for(let i=0;i<90;i++){
    const x=(rand()-.5)*17.5,z=(rand()-.5)*13.3;
    if(reserved(x,z,.35)||distanceToPath(x,z)<1||!inside(x,z,.2))continue;
    if(Math.abs(x)>6.2||Math.abs(z)>4.2)stones.push({x,z,y:heightAt(x,z)+.04,sx:.12+rand()*.36,sy:.10+rand()*.22,sz:.10+rand()*.32});
  }
  // Broken angular outcrops sit in the rear hillside, with smaller embedded
  // inclusions interrupting the otherwise continuous exposed strata.
  for(let i=0;i<28;i++){
    const x=4.45+rand()*3.5,z=-5.25+rand()*1.8;
    if(reserved(x,z,.4))continue;
    stones.push({x,z,y:heightAt(x,z)+.035,sx:.22+rand()*.34,sy:.15+rand()*.24,sz:.15+rand()*.30});
  }
  for(let i=0;i<56;i++){
    const side=i%4,t=rand(),y=BOTTOM+.3+rand()*1.90;
    const x=side<2?-7.95+t*15.9:(side===2?-8.96:8.96),z=side<2?(side===0?-6.97:6.97):-5.95+t*11.9;
    stones.push({x,z,y,sx:.055+rand()*.12,sy:.04+rand()*.09,sz:.045+rand()*.10});
  }
  const rocks=new THREE.InstancedMesh(rockGeometry,rockMat,stones.length);rocks.name='Varied pebbles and dry-stacked terrace stone';
  const stoneColors=[0x837c6b,0x9a8d76,0x7a7d70,0xa89b82];
  stones.forEach((s,i)=>{dummy.position.set(s.x,s.y,s.z);dummy.rotation.set(rand()*.8,rand()*Math.PI,rand()*.7);dummy.scale.set(s.sx,s.sy,s.sz);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);colour.set(stoneColors[Math.floor(rand()*stoneColors.length)]).multiplyScalar(.82+rand()*.24);rocks.setColorAt(i,colour);});rocks.castShadow=true;rocks.receiveShadow=true;root.add(rocks);

  // Each tree has tapering branched timber and hundreds of separate curved
  // leaf blades. All trunks/branches share one draw, all foliage another.
  const treePoints=[[-7.8,-5.9,.88],[-6.8,-5.25,1.18],[-5.55,-6.1,.72],[-4.35,-5.75,.89],[-1.75,-5.9,.94],[4.2,-5.9,.72],[6.1,-5.7,1.18],[7.75,-5.85,.69],[7.15,-4.35,.86],[-8.0,-2.7,.91],[-7.55,-1.25,.64],[-7.7,5.85,.78],[-6.6,5.35,.61],[.8,5.9,.69],[6.5,5.75,.93],[7.7,4.95,.64],[8.0,.2,.75]].filter(([x,z,s])=>!reserved(x,z,s*.85));
  const branches=[],leafRecords=[];
  function addBranch(a,b,r1,r2){branches.push({a,b,r1,r2});}
  for(const [x,z,scale]of treePoints){
    const ground=heightAt(x,z),h=(2.6+rand()*.7)*scale,lean=(rand()-.5)*.28;
    const base=new THREE.Vector3(x,ground,z),fork=new THREE.Vector3(x+lean,ground+h*.60,z+.08),top=new THREE.Vector3(x+lean*.7,ground+h,z-.05);
    addBranch(base,fork,.105*scale,.07*scale);addBranch(fork,top,.07*scale,.027*scale);
    const crowns=[{x:top.x,y:top.y-.04,z:top.z,r:.83*scale}];
    for(let j=0;j<4;j++){
      const a=j*Math.PI*.5+rand()*.9,r=(.58+rand()*.3)*scale;
      const end=new THREE.Vector3(x+Math.cos(a)*r,ground+h*(.76+rand()*.16),z+Math.sin(a)*r);
      addBranch(fork,end,.052*scale,.016*scale);crowns.push({x:end.x,y:end.y+.04,z:end.z,r:.64*scale});
    }
    for(const crown of crowns)for(let j=0;j<43;j++){
      const a=rand()*Math.PI*2,b=Math.acos(rand()*2-1),rr=Math.cbrt(rand())*crown.r;
      leafRecords.push({x:crown.x+Math.sin(b)*Math.cos(a)*rr,y:crown.y+Math.cos(b)*rr*.62,z:crown.z+Math.sin(b)*Math.sin(a)*rr,s:.25+rand()*.22,rot:rand()*Math.PI*2,tilt:(rand()-.5)*1.5,type:0});
    }
  }
  const barkGeometry=new THREE.CylinderGeometry(.6,1,1,9,1),trunks=new THREE.InstancedMesh(barkGeometry,barkMat,branches.length);trunks.name='Tapered branching shade-tree trunks';
  const up=new THREE.Vector3(0,1,0),direction=new THREE.Vector3();
  branches.forEach((b,i)=>{direction.copy(b.b).sub(b.a);dummy.position.copy(b.a).add(b.b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,direction.clone().normalize());dummy.scale.set(b.r1,direction.length(),b.r1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);colour.set(0x9b8970).multiplyScalar(.9+rand()*.18);trunks.setColorAt(i,colour);});trunks.castShadow=true;trunks.receiveShadow=true;root.add(trunks);

  // Loose shrub groups and ground-cover, with real spaces between foliage.
  const shrubCenters=[];
  for(let i=0;i<95;i++){
    const x=(rand()-.5)*17.3,z=(rand()-.5)*12.9;
    if(!inside(x,z,.4)||reserved(x,z,.4)||distanceToPath(x,z)<.92)continue;
    if(Math.abs(x)<6.3&&Math.abs(z)<4.3&&rand()<.80)continue;
    shrubCenters.push({x,z,y:heightAt(x,z),s:.18+rand()*.28});
  }
  for(const shrub of shrubCenters)for(let j=0;j<38;j++){
    const a=rand()*Math.PI*2,r=Math.sqrt(rand())*shrub.s;
    leafRecords.push({x:shrub.x+Math.cos(a)*r,y:shrub.y+.06+rand()*shrub.s*.9,z:shrub.z+Math.sin(a)*r,s:.14+rand()*.12,rot:a,tilt:-.6+rand()*1.2,type:1});
  }
  const leafMesh=new THREE.InstancedMesh(leafGeometry(),leafMat,leafRecords.length);leafMesh.name='Individual curved canopy and garden leaves';
  const leafColors=[0x29472f,0x3d5939,0x526a42,0x5c7448,0x355240];
  leafRecords.forEach((l,i)=>{dummy.position.set(l.x,l.y,l.z);dummy.rotation.set(l.tilt,l.rot,(rand()-.5)*.8);dummy.scale.set(l.s*.48,l.s,l.s);dummy.updateMatrix();leafMesh.setMatrixAt(i,dummy.matrix);colour.set(leafColors[Math.floor(rand()*leafColors.length)]).multiplyScalar(.89+rand()*.19);leafMesh.setColorAt(i,colour);});leafMesh.castShadow=true;leafMesh.receiveShadow=true;root.add(leafMesh);

  // Meadow blades are sparse on the level study areas and richer at the edges.
  const blades=[];
  for(let i=0;i<7200;i++){
    const x=(rand()-.5)*17.8,z=(rand()-.5)*13.8;
    if(!inside(x,z,.16)||reserved(x,z,.18)||distanceToPath(x,z)<.76)continue;
    if(noise(x*1.6+9,z*1.6)<.25)continue;
    blades.push({x,z,y:heightAt(x,z),s:.09+rand()*.20});
  }
  const grass=new THREE.InstancedMesh(grassGeometry(),grassMat,blades.length);grass.name='Fine native-style meadow texture';
  blades.forEach((b,i)=>{dummy.position.set(b.x,b.y+.008,b.z);dummy.rotation.set(0,rand()*Math.PI*2,0);dummy.scale.set(b.s,b.s,b.s);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);colour.set(rand()>.75?0x9ca16c:0x637b4e).multiplyScalar(.85+rand()*.3);grass.setColorAt(i,colour);});grass.receiveShadow=true;grass.castShadow=false;root.add(grass);

  const blossoms=[];
  shrubCenters.forEach((s,i)=>{if(i%5!==0)return;for(let j=0;j<5;j++){const a=rand()*Math.PI*2;blossoms.push([s.x+Math.cos(a)*s.s*.7,s.y+s.s*.7,s.z+Math.sin(a)*s.s*.7]);}});
  const flowers=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.027,0),flowerMat,blossoms.length);flowers.name='Restrained pale garden blossoms';
  blossoms.forEach(([x,y,z],i)=>{dummy.position.set(x,y,z);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();flowers.setMatrixAt(i,dummy.matrix);});root.add(flowers);

  root.scale.set(scaleX,1,scaleZ);root.updateMatrixWorld(true);
  const stats={meshes:0,drawCalls:0,triangles:0,treeCount:treePoints.length,individualLeaves:leafRecords.length,grassTufts:blades.length,rockCount:stones.length,illustrative:true,width,depth,groundY,padCount:cleanPads.length,seed:integerSeed};
  root.traverse(o=>{if(o.isMesh){stats.meshes++;stats.drawCalls+=Array.isArray(o.material)?o.material.length:1;const g=o.geometry;stats.triangles+=(g.index?g.index.count:g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}});
  return {
    root,heightAt:(worldX,worldZ)=>heightAt(worldX/scaleX,worldZ/scaleZ),stats,
    update(seconds,weather={}) {
      timeUniform.value=Number.isFinite(seconds)?seconds:0;
      const value=Number(weather.wind??.45);windUniform.value=clamp(Number.isFinite(value)?(value>2?value/35:value):.45,0,1.8);
      const wet=Number(weather.rain??0)>0;
      groundMat.roughness=wet?.74:.98;groundMat.color.setScalar(wet?.82:1);
      pathMat.roughness=wet?.58:1;pathMat.color.setScalar(wet?.82:1);
      cutMat.color.setScalar(wet?.90:1);
    },
  };
}
