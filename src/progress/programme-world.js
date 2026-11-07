import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createDioramaTerrain} from './diorama-terrain.js';
import {createCafeProps} from './diorama-cafe.js';
import {createDetailedProgrammeProps} from './programme-detailed-props.js';
import {createDioramaFinish,fitDioramaCamera} from './diorama-renderer.js';
import {createProgrammeNightBehavior,departmentLightStations} from './programme-night.js';
import {createCharacterTap,pickCharacter,wavePose,waveDuration} from './programme-hello.js';

// Apply the camera pose and its framing together. A frustum fitted to the old
// OrbitControls target cannot be reused after that target moves during focus.
export function applyProgrammeCameraFrame(camera,controls,frame,bounds,width,height,options={}) {
  if(frame){camera.position.lerpVectors(frame.from,frame.to,frame.amount);controls.target.lerpVectors(frame.fromTarget,frame.toTarget,frame.amount);}
  return fitDioramaCamera(camera,controls,bounds,width,height,options);
}

// An original planning miniature. Its clock, characters and growth previews never
// establish the real work, attendance, planting or programme status of the farm.
const palette = {green:0x2F4A3C, ivory:0xF5F1E8, copper:0xB57B5A, sage:0xD9DFD0, ink:0x3B332D};
const departments = {cafe:[-6.2,1,-4.2], coffee:[6.3,1,-4.2], workshops:[-6.3,1,4.7], local:[6.3,1,4.7]};
const growthStages = ['seed','germinating','seedling','grafting','growing','flowering','cherries','harvest'];
const up = new THREE.Vector3(0,1,0);
const geometries = new Map();
const materials = new Map();
const unitBox = new THREE.BoxGeometry(1,1,1);
const sphere = new THREE.SphereGeometry(1,18,12);
function curvedLeafGeometry(){
  const p=[],uv=[],indices=[];
  for(let i=0;i<=7;i++){const t=i/7,w=Math.sin(t*Math.PI)**.8;for(const side of[-1,0,1]){p.push(side*w,Math.sin(t*Math.PI)*(.18-Math.abs(side)*.14),t*2);uv.push((side+1)/2,t);}}
  for(let i=0;i<7;i++)for(let j=0;j<2;j++){const a=i*3+j;indices.push(a,a+3,a+1,a+1,a+3,a+4);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
const leafShape=curvedLeafGeometry();
const unitCylinder = new THREE.CylinderGeometry(1,1,1,16);
const capsule = new THREE.CapsuleGeometry(1,1,4,12);
function material(colour='green',opacity=1) {
  const key=colour+opacity;
  if (!materials.has(key)) materials.set(key,new THREE.MeshStandardMaterial({color:palette[colour],roughness:colour==='ivory'?.52:colour==='copper'?.70:.78,metalness:0,transparent:opacity<1,opacity}));
  return materials.get(key);
}
function group(parent,x=0,y=0,z=0) {const g=new THREE.Group();g.position.set(x,y,z);parent?.add(g);return g;}
function mesh(parent,geometry,colour,x=0,y=0,z=0) {const m=new THREE.Mesh(geometry,material(colour));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(parent,w,h,d,colour,x=0,y=0,z=0) {const m=mesh(parent,unitBox,colour,x,y,z);m.scale.set(w,h,d);return m;}
function ball(parent,xr,yr,zr,colour,x=0,y=0,z=0) {const m=mesh(parent,sphere,colour,x,y,z);m.scale.set(xr,yr,zr);return m;}
function cylinder(parent,r,h,colour,x=0,y=0,z=0) {const m=mesh(parent,unitCylinder,colour,x,y,z);m.scale.set(r,h,r);return m;}
function beam(parent,a,b,r,colour='copper') {
  const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),delta=q.clone().sub(p);
  const m=cylinder(parent,r,delta.length(),colour);m.position.copy(p.add(q).multiplyScalar(.5));m.quaternion.setFromUnitVectors(up,delta.normalize());return m;
}
function rounded(parent,w,d,depth,colour,y=0,r=.35) {
  const key=[w,d,depth,r].join(':');
  if (!geometries.has(key)) {
    const s=new THREE.Shape(),x=-w/2,z=-d/2;
    s.moveTo(x+r,z);s.lineTo(x+w-r,z);s.quadraticCurveTo(x+w,z,x+w,z+r);s.lineTo(x+w,z+d-r);s.quadraticCurveTo(x+w,z+d,x+w-r,z+d);s.lineTo(x+r,z+d);s.quadraticCurveTo(x,z+d,x,z+d-r);s.lineTo(x,z+r);s.quadraticCurveTo(x,z,x+r,z);
    geometries.set(key,new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.06,bevelThickness:.04,bevelSegments:2,steps:1,curveSegments:7}));
  }
  const m=mesh(parent,geometries.get(key),colour,0,y,0);m.rotation.x=-Math.PI/2;return m;
}
function table(parent,x,z,w=2.9,d=1.3,h=.98) {
  const g=group(parent,x,.43,z);box(g,w,.12,d,'copper',0,h,0);
  for (const a of [-1,1]) for (const b of [-1,1]) box(g,.09,h,.09,'green',a*(w/2-.18),h/2,b*(d/2-.15));
  return g;
}
function paper(parent,x,y,z,w=.8,d=.55) {return box(parent,w,.018,d,'ivory',x,y,z);}
function mug(parent,x,y,z) {
  cylinder(parent,.095,.15,'ivory',x,y,z);
  const handle=mesh(parent,new THREE.TorusGeometry(.055,.018,5,9),'copper',x+.105,y,z);handle.rotation.y=Math.PI/2;
}
function pot(parent,x,z,scale=.6,y=.43) {
  const g=group(parent,x,y,z);cylinder(g,.32*scale,.42*scale,'copper',0,.21*scale,0);
  cylinder(g,.35*scale,.07*scale,'copper',0,.42*scale,0);cylinder(g,.29*scale,.025,'ink',0,.45*scale,0);return g;
}
function leaves(parent,height=1,count=14) {
  const leafMaterial=material('green').clone();leafMaterial.side=THREE.DoubleSide;leafMaterial.roughness=.55;const foliage=new THREE.InstancedMesh(leafShape,leafMaterial,count),temp=new THREE.Object3D();
  for (let i=0;i<count;i++) {
    const level=Math.floor(i/2),angle=i%2*Math.PI+level*.8,spread=(.16+(count/2-level)*.018)*height;
    temp.position.set(Math.cos(angle)*spread,(.22+level/Math.max(1,Math.ceil(count/2)-1)*.70)*height,Math.sin(angle)*spread);
    temp.rotation.set(.2,-angle+Math.PI/2,.18);temp.scale.set(.10*height,.032*height,.22*height);temp.updateMatrix();foliage.setMatrixAt(i,temp.matrix);
  }
  foliage.castShadow=true;parent.add(foliage);return foliage;
}
function smallPlant(parent,x,z,height=.28,y=.43) {
  const p=pot(parent,x,z,.58,y),plant=group(p,0,.28,0);
  beam(plant,[0,0,0],[0,height,0],.012,'copper');leaves(plant,height/.8,6);return plant;
}
function stool(parent,x,z) {
  cylinder(parent,.33,.11,'sage',x,1.1,z);
  for (let i=0;i<3;i++) {const a=i*2*Math.PI/3;beam(parent,[x+Math.sin(a)*.21,.48,z+Math.cos(a)*.21],[x+Math.sin(a)*.17,1.07,z+Math.cos(a)*.17],.035,'copper');}
}
function bench(parent,x,z,rotation=0) {
  const g=group(parent,x,.43,z);g.rotation.y=rotation;
  box(g,1.45,.13,.55,'sage',0,.69,0);box(g,1.45,.48,.08,'green',0,.99,-.27);
  for (const a of [-1,1]) box(g,.08,.65,.35,'copper',a*.54,.32,0);return g;
}
function tray(parent,x,y,z,w=1.0,d=.65) {
  const g=group(parent,x,y,z);box(g,w,.10,d,'sage');
  for (let i=0;i<6;i++) {const sx=(i%3-1)*w*.26,sz=(Math.floor(i/3)-.5)*d*.42;cylinder(g,.07,.04,'ink',sx,.065,sz);ball(g,.028,.017,.04,'copper',sx,.095,sz);}
  return g;
}
function planningBoard(parent,x,z,rotation=0) {
  const g=group(parent,x,.43,z);g.rotation.y=rotation;
  for (const side of [-1,1]) beam(g,[side*.72,0,0],[side*.65,2.35,0],.04,'copper');
  box(g,1.9,1.25,.10,'green',0,1.95,0);box(g,1.7,1.05,.025,'ivory',0,1.95,.07);
  for (let i=0;i<4;i++) {box(g,.45,.02,.02,'sage',-.42,2.24-i*.16,.09);box(g,.55,.025,.02,'copper',.35,2.24-i*.16,.09);}
  return g;
}
function chair(parent,x,z,rotation=0) {
  const g=group(parent,x,.43,z);g.rotation.y=rotation;
  box(g,.58,.10,.56,'sage',0,.58,0);box(g,.58,.57,.07,'green',0,.90,-.25);
  for(const a of [-1,1])for(const b of [-1,1])box(g,.055,.56,.055,'copper',a*.23,.28,b*.21);
  return g;
}
function soilBed(parent,x,z,w,d) {
  const g=group(parent,x,.43,z);box(g,w,.22,d,'copper',0,.11,0);box(g,w-.16,.045,d-.16,'ink',0,.23,0);
  for(const a of [-1,1])box(g,w+.05,.08,.11,'ivory',0,.26,a*d/2);
  for(const a of [-1,1])box(g,.11,.08,d,'ivory',a*w/2,.26,0);
  return g;
}
function productShelf(parent,x,z,w=2.65) {
  const g=group(parent,x,.43,z);box(g,w,2.5,.07,'sage',0,1.30,-.28);
  for(const side of [-1,1])box(g,.10,2.65,.62,'green',side*w/2,1.33,0);
  for(const h of [.20,1.00,1.8,2.62])box(g,w+.1,.09,.68,'copper',0,h,0);
  return g;
}
function giftBox(parent,x,y,z,w=.55,h=.40,d=.45,colour='ivory') {
  const g=group(parent,x,y,z);box(g,w,h,d,colour,0,h/2,0);box(g,w+.03,.06,d+.03,colour,0,h+.03,0);
  box(g,.06,h+.07,d+.045,'green',0,(h+.07)/2,0);box(g,w+.04,.015,.055,'green',0,h+.07,0);
  for(const side of [-1,1]){const ribbon=ball(g,.11,.035,.065,'copper',side*.085,h+.11,0);ribbon.rotation.z=side*.25;}
  return g;
}
function shadeTree(parent,x,z,size=1) {
  const g=group(parent,x,.43,z);beam(g,[0,0,0],[.08,2.5*size,0],.12*size);
  const crown=group(g,0,2.3*size,0),instanced=new THREE.InstancedMesh(sphere,material('green'),5),temp=new THREE.Object3D();
  for(let i=0;i<5;i++){const a=i*2.3;temp.position.set(Math.sin(a)*.5*size,Math.cos(a)*.3*size,Math.cos(a)*.4*size);temp.scale.set(.7*size,.65*size,.65*size);temp.updateMatrix();instanced.setMatrixAt(i,temp.matrix);}
  instanced.castShadow=true;crown.add(instanced);return crown;
}
function coffeeDisplay(stage,heightCm) {
  const root=new THREE.Group(),bed=pot(root,0,0,1.2,0),plant=group(bed,0,.56,0);
  root.userData.windPlants=stage==='seed'?[]:[plant];
  // These friendly marks belong to the pot, not to the native identity artwork.
  for (const x of [-.095,.095]) ball(bed,.025,.033,.014,'ink',x,.30,.385);
  const smile=mesh(bed,new THREE.TorusGeometry(.052,.011,4,10,Math.PI),'ink',0,.24,.392);smile.rotation.z=Math.PI;
  for (let i=0;i<3;i++){const seed=ball(plant,.065,.04,.09,'copper',-.16+i*.16,.015,.12);seed.rotation.y=i*.6;box(plant,.009,.006,.10,'ink',-.16+i*.16,.054,.12);}
  if(stage==='seed')return root;
  if(stage==='germinating'){const stem=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(0,.24,0),new THREE.Vector3(.09,.34,0),new THREE.Vector3(.16,.26,0)]);mesh(plant,new THREE.TubeGeometry(stem,8,.014,5,false),'copper');ball(plant,.065,.04,.09,'copper',.16,.27,0);return root;}
  const height=Number.isFinite(heightCm)?Math.max(.08,Math.min(4,heightCm/100)):stage==='seedling'?.55:stage==='grafting'?1.0:1.9;
  beam(plant,[0,0,0],[0,height,0],stage==='seedling'?.018:.033);
  leaves(plant,height*.95,stage==='seedling'?8:18);
  if(stage==='grafting'){cylinder(plant,.055,.14,'ivory',0,.56,0);beam(plant,[0,.53,0],[.16,.92,.03],.018,'copper');leaves(group(plant,.14,.67,.03),.3,4);}
  if(['flowering','cherries','harvest'].includes(stage)) {
    for(let i=0;i<12;i++){const a=i*2.4,x=Math.cos(a)*.24,z=Math.sin(a)*.24,y=.5+(i%5)*.21;
      if(stage==='flowering'){const flower=group(plant,x,y,z);for(let j=0;j<5;j++){const p=j*Math.PI*2/5;ball(flower,.045,.022,.06,'ivory',Math.sin(p)*.06,0,Math.cos(p)*.06);}ball(flower,.028,.025,.028,'copper');}
      else if(stage==='cherries'||i%3===0){ball(plant,.075,.09,.075,'copper',x,y,z);ball(plant,.06,.08,.06,'copper',x+.09,y-.04,z);}
    }
  }
  if(stage==='harvest'){const crate=group(root,.8,.06,.1);box(crate,.65,.3,.5,'copper',0,.16,0);for(let i=0;i<7;i++)ball(crate,.075,.06,.075,'copper',Math.sin(i*2.4)*.2,.34+(i%2)*.05,Math.cos(i*2.4)*.13);}
  return root;
}
function actualPlants(data) {
  const pair=new THREE.Group(),seed=coffeeDisplay(data.seedStage),trial=coffeeDisplay(data.trialStage,data.heightCm);
  seed.position.x=-.46;trial.position.x=.46;pair.add(seed,trial);
  pair.userData.windPlants=[...seed.userData.windPlants,...trial.userData.windPlants];return pair;
}
function batchActorPart(part){
  part.updateMatrixWorld(true);const inverse=part.matrixWorld.clone().invert(),byMaterial=new Map(),remove=[];
  part.traverse(o=>{if(!o.isMesh)return;const key=o.material.uuid;if(!byMaterial.has(key))byMaterial.set(key,{material:o.material,geometries:[]});const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(inverse.clone().multiply(o.matrixWorld));byMaterial.get(key).geometries.push(g);remove.push(o);});
  for(const {material,geometries:items}of byMaterial.values()){const geometry=mergeGeometries(items,false);items.forEach(g=>g.dispose());if(geometry){const combined=new THREE.Mesh(geometry,material);combined.castShadow=combined.receiveShadow=true;part.add(combined);}}
  remove.forEach(o=>o.removeFromParent());
}
function character(parent,{id,department,shirt='green',hat=false,route,offset=0,speed=.8}) {
  const root=group(parent,route[0].x,.43,route[0].z),body=group(root),head=group(body,0,1.63,0);
  mesh(body,capsule,shirt,0,1.06,0).scale.set(.20,.24,.19);
  box(body,.32,.40,.08,'sage',0,1.01,.18);
  const skin=new THREE.MeshStandardMaterial({color:['coffee-grower','local-selector'].includes(id)?0xb88961:['workshop-maker','cafe-measurer'].includes(id)?0xe0b68d:0xc89d78,roughness:.82});
  ball(head,.255,.28,.24,'ivory').material=skin;for(const side of[-1,1])ball(head,.043,.066,.044,'ivory',side*.245,-.015,0).material=skin;
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.26,18,10,0,Math.PI*2,0,Math.PI*.49),material('ink'));hair.position.set(0,.025,-.018);head.add(hair);
  for(const side of [-1,1]) ball(head,.018,.026,.015,'ink',side*.082,.02,.225);
  ball(head,.035,.037,.03,'copper',0,-.025,.235).material=skin;
  const mouth=mesh(head,new THREE.TorusGeometry(.042,.008,4,10,Math.PI),'ink',0,-.082,.232);mouth.rotation.z=Math.PI;
  cylinder(head,hat?.35:.265,.045,'copper',0,.235,0);cylinder(head,hat?.20:.245,hat?.19:.09,'copper',0,hat?.33:.27,0);
  const arms=[],legs=[];
  for(const side of [-1,1]) {
    const arm=group(body,side*.245,1.29,0);mesh(arm,capsule,shirt,0,-.19,0).scale.set(.065,.16,.065);ball(arm,.075,.078,.075,'ivory',0,-.37,0);arms.push(arm);
    const leg=group(body,side*.11,.69,0),shin=group(leg,0,-.28,0);box(leg,.13,.3,.14,'ink',0,-.14,0);box(shin,.13,.27,.14,'ink',0,-.14,0);box(shin,.17,.11,.27,'ink',0,-.3,.055);legs.push({hip:leg,knee:shin});
  }
  const tools=group(body),clipboard=group(tools,0,1.11,.43);clipboard.rotation.x=.25;box(clipboard,.49,.035,.35,'green');paper(clipboard,0,.023,0,.44,.30);
  const pencil=group(arms[1],0,-.36,.04);beam(pencil,[0,0,-.12],[0,0,.14],.012,'copper');
  const watering=group(arms[1],0,-.39,.1);cylinder(watering,.15,.25,'sage',0,0,0);beam(watering,[0,.02,0],[.28,.08,.24],.035,'copper');
  const handle=mesh(watering,new THREE.TorusGeometry(.10,.018,5,10),'green',0,.15,0);handle.rotation.y=Math.PI/2;
  const sample=group(arms[0],0,-.35,.1);cylinder(sample,.10,.20,'sage');cylinder(sample,.11,.035,'copper',0,.11,0);
  const ruler=group(arms[1],0,-.36,.03);box(ruler,.65,.04,.06,'ivory');for(let i=0;i<5;i++)box(ruler,.01,.045,.05,'ink',-.25+i*.1,0,.01);
  const lunch=group(body,0,1.01,.42);box(lunch,.30,.07,.25,'ivory');box(lunch,.27,.03,.23,'green',0,.045,0);box(lunch,.30,.06,.25,'ivory',0,.09,0);
  batchActorPart(head);legs.forEach(leg=>batchActorPart(leg.knee));
  return {id,department,root,body,head,arms,legs,tools,clipboard,pencil,watering,sample,ruler,lunch,route,offset,speed,index:0,distance:0,wait:Math.max(0,route[0].hold-offset),activity:route[0].activity||'planning',anchor:new THREE.Vector3(),lastAngle:0};
}
function point(x,z,hold=0,activity='walking',face=0){return{x,z,hold,activity,face};}
function angleTowards(current,target,amount){let d=(target-current+Math.PI)%(Math.PI*2);if(d<0)d+=Math.PI*2;d-=Math.PI;return current+d*Math.min(1,amount);}
function batchStatic(root,dynamicRoots) {
  // Keep independently moving parts separate; batch the fixed scenery by material.
  root.updateMatrixWorld(true);const batches=new Map(),remove=[];
  root.traverse(object=>{
    if(!object.isMesh||object.isInstancedMesh||Array.isArray(object.material)||object.material.map)return;
    let ancestor=object;while(ancestor&&ancestor!==root){if(dynamicRoots.has(ancestor))return;ancestor=ancestor.parent;}
    const key=object.material.uuid+':'+object.castShadow+':'+object.receiveShadow;
    if(!batches.has(key))batches.set(key,{material:object.material,shadow:object.castShadow,receive:object.receiveShadow,geometries:[]});
    const geometry=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();geometry.applyMatrix4(object.matrixWorld);batches.get(key).geometries.push(geometry);remove.push(object);
  });
  for(const batch of batches.values()){
    const geometry=mergeGeometries(batch.geometries,false);batch.geometries.forEach(g=>g.dispose());
    if(geometry){const combined=new THREE.Mesh(geometry,batch.material);combined.castShadow=batch.shadow;combined.receiveShadow=batch.receive;root.add(combined);}
  }
  remove.forEach(object=>object.removeFromParent());
}
function updateActor(actor,state,delta,time) {
  actor.root.position.set(state.x,.43,state.z);actor.index=state.index;actor.wait=state.wait;actor.activity=state.activity;actor.lightAction=state.lightAction;
  actor.root.rotation.y=angleTowards(actor.root.rotation.y,state.face,actor.poseReady?delta*9:1);actor.poseReady=true;
  const moving=state.moving,resting=['resting','lunch'].includes(actor.activity),seated=state.seated,phase=time*6*actor.speed;
  actor.body.position.y=moving?Math.abs(Math.sin(phase))*.035:Math.sin(time*1.4+actor.offset)*.008;
  actor.body.rotation.z=moving?Math.sin(phase)*.018:0;
  actor.head.rotation.y=resting?Math.sin(time*.5+actor.offset)*.08:Math.sin(time*.7+actor.offset)*.035;
  actor.legs.forEach((leg,i)=>{leg.hip.rotation.x=seated?-1.35:moving?Math.sin(phase+i*Math.PI)*.43:0;leg.knee.rotation.x=seated?1.4:moving?Math.max(0,-Math.sin(phase+i*Math.PI))*.5:0;});
  actor.arms.forEach((arm,i)=>{arm.rotation.set(moving?Math.sin(phase+(i?0:Math.PI))*.3:resting&&!seated?-.15:-.8,0,resting?(i?-.12:.12):0);});
  const writing=['writing','planning','checking'].includes(actor.activity),measuring=actor.activity==='measuring',watering=actor.activity==='watering',selecting=actor.activity==='selecting';
  actor.clipboard.visible=writing;actor.pencil.visible=writing;actor.watering.visible=watering;actor.sample.visible=selecting;actor.ruler.visible=measuring;actor.lunch.visible=actor.activity==='lunch';
  if(writing){actor.arms[1].rotation.x=-1.1+Math.sin(time*3+actor.offset)*.09;actor.arms[0].rotation.x=-.95;}
  if(measuring){actor.arms[0].rotation.x=-1.15;actor.arms[1].rotation.x=-1.1+Math.sin(time*.8)*.08;}
  if(watering){actor.arms[1].rotation.x=-.7+Math.sin(time*1.3)*.09;actor.watering.rotation.z=-.35;}
  if(selecting){actor.arms[0].rotation.x=-1.2+Math.sin(time*.8)*.10;actor.arms[1].rotation.x=-.5;}
  if(actor.activity==='switching'){actor.arms[1].rotation.x=-1.72+Math.sin(time*4)*.05;actor.arms[0].rotation.x=-.18;actor.head.rotation.x=-.04;}
  else actor.head.rotation.x=actor.activity==='checking'?.11:0;
}
function buildMiniature(scene,requestRender) {
  const root=new THREE.Group();scene.add(root);const windPlants=[],lamps=[],workLights=[],actors=[];
  const pads=Object.values(departments).map(([x,,z])=>({x,z,w:8.2,d:6.8}));
  // The established actor routes and light stations keep the same level ground.
  pads.push({x:0,z:0,w:4.7,d:21},{x:0,z:0,w:27,d:3.1});
  const terrain=createDioramaTerrain({width:30,depth:24,groundY:.43,pads});root.add(terrain.root);
  const detailed=createCafeProps({heightAt:()=>.43,includeActors:false});
  detailed.cafeRoot.position.set(-6.2,.45,-4.95);detailed.cafeRoot.scale.setScalar(1.35);
  detailed.gardenRoot.position.set(7.3,.43,-4.9);detailed.gardenRoot.scale.setScalar(1.16);
  root.add(detailed.root);
  const learning=createDetailedProgrammeProps({groundY:.43});root.add(learning.root);
  // Small, legible gravel lanes connect the roofless departmental study areas.
  const gravel=new THREE.MeshStandardMaterial({color:0xbeb091,roughness:.98});rounded(root,2.6,20.5,.025,'copper',.425,.35).material=gravel;rounded(root,27.5,2.35,.025,'copper',.43,.35).material=gravel;
  const growthHolder=group(root,4.1,.57,-4.4);cylinder(root,.90,.17,'ivory',4.1,.52,-4.4);
  const plantData={seedStage:'seed',trialStage:'seedling',heightCm:20},growthCache=new Map();
  let growth='actual',growthRoot=actualPlants(plantData);growthHolder.add(growthRoot);

  // Break benches sit in the lanes; routes stop at their front, with room to pass.
  bench(root,-1.7,3.0,Math.PI/2);bench(root,2.25,-2.1,-Math.PI/2);bench(root,-3.2,.85);bench(root,3.2,.85);bench(root,1.2,7.7,-Math.PI/2);
  const lunchTable=table(root,0,7.7,1.4,.9,.7);mug(lunchTable,-.28,.84,.1);box(lunchTable,.40,.03,.32,'ivory',.25,.80,0);box(lunchTable,.30,.06,.22,'sage',.25,.85,0);
  for(const [x,z] of [[-1.45,-8.2],[1.45,8.25],[-11.2,1.45],[11.2,-1.45]]){
    beam(root,[x,.43,z],[x,3.5,z],.035,'ink');const lantern=cylinder(root,.18,.27,'ivory',x,3.28,z);lantern.material=new THREE.MeshStandardMaterial({color:palette.ivory,emissive:palette.ivory,emissiveIntensity:0,roughness:.8});lamps.push(lantern.material);
  }
  // Four independent, small work pools supplement the always-on night lane lamps.
  // The lights remain in the renderer at intensity zero rather than recompiling shaders.
  const glowGeometry=new THREE.CircleGeometry(1,28);
  for(const [id,station] of Object.entries(departmentLightStations)) {
    const stand=group(root,station.x,.43,station.z),direction=station.approach.face===0?1:-1;
    cylinder(stand,.22,.065,'ink',0,.035,0);beam(stand,[0,.07,0],[0,3.22,0],.038,'green');
    beam(stand,[0,3.20,0],[0,3.20,direction*.68],.035,'copper');
    cylinder(stand,.25,.08,'green',0,3.21,direction*.68);
    beam(stand,[0,1.43,0],[0,1.43,-direction*.22],.025,'copper');box(stand,.23,.35,.14,'sage',0,1.43,-direction*.22);
    const dynamicRoot=group(root,station.x,.43,station.z);
    const bulbMaterial=material('ivory').clone();bulbMaterial.emissive.setHex(palette.ivory);bulbMaterial.emissiveIntensity=0;
    const bulb=ball(dynamicRoot,.19,.095,.19,'ivory',0,3.12,direction*.68);bulb.material=bulbMaterial;
    const button=box(dynamicRoot,.09,.11,.025,'ivory',0,1.43,-direction*.305);button.material=bulbMaterial;
    const light=new THREE.PointLight(palette.ivory,0,7.2,1.4);light.position.set(0,2.95,direction*.68);light.castShadow=false;dynamicRoot.add(light);
    const glowMaterial=new THREE.MeshBasicMaterial({color:palette.ivory,transparent:true,opacity:0,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending});
    for(const radius of [2.6,1.7,.85]){const glow=new THREE.Mesh(glowGeometry,glowMaterial);glow.rotation.x=-Math.PI/2;glow.position.set(0,.115,direction*.68);glow.scale.setScalar(radius);glow.renderOrder=1;dynamicRoot.add(glow);}
    workLights.push({id,light,bulbMaterial,glowMaterial,dynamicRoot});
  }
  const routes=[
    {id:'cafe-planner',department:'cafe',shirt:'green',speed:.83,route:[point(-6.5,-2.25,17,'planning',Math.PI),point(-6.5,-1.25),point(-1.7,-1.25),point(-1.7,2.45,9,'resting',Math.PI/2),point(-1.7,-1.25),point(-6.5,-1.25)]},
    {id:'cafe-measurer',department:'cafe',shirt:'ivory',offset:6,speed:.72,route:[point(-3.4,-4.8,14,'measuring',-Math.PI/2),point(-3.4,-1.25),point(-1.2,-1.25),point(-1.2,-7.7,8,'writing',Math.PI),point(-1.2,-1.25),point(-3.4,-1.25)]},
    {id:'coffee-grower',department:'coffee',shirt:'sage',hat:true,speed:.75,offset:3,route:[point(7.5,-2.35,18,'watering',Math.PI),point(7.5,-1.25),point(2.25,-1.25),point(2.25,-2.1,9,'resting',-Math.PI/2),point(2.25,-1.25),point(7.5,-1.25)]},
    {id:'workshop-maker',department:'workshops',shirt:'copper',speed:.78,offset:8,route:[point(-6.2,3.05,19,'writing',0),point(-6.2,1.3),point(-3.2,.85,10,'resting',0),point(-6.2,1.3)]},
    {id:'local-selector',department:'local',shirt:'green',speed:.80,offset:5,route:[point(6.3,3.05,18,'selecting',0),point(6.3,1.3),point(3.2,.85,10,'resting',0),point(6.3,1.3)]},
    {id:'garden-helper',department:'coffee',lightParticipant:false,shirt:'copper',hat:true,speed:.76,offset:1,route:[point(1.4,5.5,4,'planning',Math.PI/2),point(1.4,7.7),point(1.2,7.7,12,'resting',-Math.PI/2),point(1.4,7.7),point(1.4,-.2),point(-1.4,-.2),point(-1.4,-7.7,7,'measuring',0),point(-1.4,-.2),point(1.4,-.2)]},
  ];
  for(const spec of routes)actors.push(character(root,spec));
  const behavior=createProgrammeNightBehavior(routes);

  const base=document.querySelector('meta[name=site-base]')?.content||'';
  const texture=new THREE.TextureLoader().load(base+'/assets/email/logo-compact.png',requestRender,undefined,()=>{});texture.colorSpace=THREE.SRGBColorSpace;
  box(root,2.08,1.10,.08,'ivory',-6.2,1.9,-7.50);
  const logo=new THREE.Mesh(new THREE.PlaneGeometry(1.85,.94),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));logo.position.set(-6.2,1.9,-7.45);root.add(logo);
  batchStatic(root,new Set([terrain.root,detailed.root,learning.root,...windPlants,growthHolder,...actors.map(actor=>actor.root),...workLights.map(lamp=>lamp.dynamicRoot)]));
  root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root);
  root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh)o.geometry.computeBoundingBox();});
  function refreshGrowth(stage){
    if(stage===growth&&growthHolder.children.length)return;
    growth=stage;growthHolder.remove(growthRoot);
    if(stage==='actual')growthRoot=actualPlants(plantData);
    else {if(!growthCache.has(stage))growthCache.set(stage,coffeeDisplay(stage));growthRoot=growthCache.get(stage);}
    growthHolder.add(growthRoot);
  }
  return {
    root,actors,lamps,workLights,behavior,bounds,terrain,growthHolder,
    get windPlants(){return [...windPlants,...growthRoot.userData.windPlants];},
    setGrowth(stage){if(!growthStages.includes(stage)&&stage!=='actual')return;refreshGrowth(stage);},
    setPlantData(next={}){
      if(growthStages.includes(next.seedStage))plantData.seedStage=next.seedStage;
      if(growthStages.includes(next.trialStage))plantData.trialStage=next.trialStage;
      if(Number.isFinite(Number(next.heightCm)))plantData.heightCm=Math.max(1,Math.min(400,Number(next.heightCm)));
      if(growth==='actual'){growth='';refreshGrowth('actual');}
    },
    get growth(){return growth;},
  };
}

export function createProgrammeWorld(canvas,{onError,onReady,onActors,onHello}={}) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});} catch(error) {onError?.(error);return null;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<600?1.25:1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-16,16,12,-12,.1,150),controls=new OrbitControls(camera,canvas);
  controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.075;controls.enableZoom=true;controls.minZoom=.65;controls.maxZoom=2.2;controls.minPolarAngle=.48;controls.maxPolarAngle=1.25;controls.rotateSpeed=.5;canvas.style.touchAction='pan-y pinch-zoom';
  const finish=createDioramaFinish(renderer,scene,camera,{mobile:window.innerWidth<600});
  const ambient=new THREE.HemisphereLight(0xe9f0e5,0x8e735b,.65),sun=new THREE.DirectionalLight(0xffedd9,3.5),fill=new THREE.DirectionalLight(0xe8edf0,.32);scene.add(ambient,sun,fill);
  sun.position.set(-15,25,18);fill.position.set(18,12,-16);sun.castShadow=true;sun.shadow.mapSize.set(window.innerWidth<600?1536:2048,window.innerWidth<600?1536:2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,far:75});sun.shadow.normalBias=.028;sun.shadow.bias=-.00015;sun.shadow.radius=4;
  sun.shadow.camera.updateProjectionMatrix();
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.17}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.2;floor.receiveShadow=true;scene.add(floor);
  let dirty=true,manualPaused=false,visible=true,disposed=false,ready=false,frame=0,time=0,last=0,lastRendered=0,lastShadow=0,focus=null;
  const osMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const reduced=()=>document.documentElement.dataset.reduceMotion==='true'||osMotion.matches;
  const isPaused=()=>manualPaused||reduced();
  const environment={isDay:true,hour:12,weatherCode:0,rain:0,wind:6,cloud:.15};
  const model=buildMiniature(scene,()=>{dirty=true;});
  // The live analogue HUD already provides the sun/moon and weather symbols.
  // Keep the landscape clear of decorative solids that could intersect trees;
  // cloud cover still changes the real-time lighting, with rain and night stars.
  const sky=group(scene);
  const starsGeometry=new THREE.BufferGeometry(),starPositions=new Float32Array(21*3);
  // Restrained night stars sit behind the landscape and respect scene depth.
  for(let i=0;i<21;i++){const across=-8+(i*7.13)%16,rise=(i*1.79)%1.1;starPositions[i*3]=across*.764-rise*.367;starPositions[i*3+1]=6+rise*.823;starPositions[i*3+2]=-7-across*.645-rise*.435;}
  starsGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));const stars=new THREE.Points(starsGeometry,new THREE.PointsMaterial({color:palette.ivory,size:1.8,sizeAttenuation:false,transparent:true,opacity:.9}));stars.visible=false;sky.add(stars);
  const rainCount=180,rainPositions=new Float32Array(rainCount*6),rainSeeds=[];
  for(let i=0;i<rainCount;i++)rainSeeds.push({x:-13+(i*4.771)%26,z:-9+(i*7.713)%18,y:(i*3.733)%11,speed:4.5+(i%5)*.35});
  const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));const rain=new THREE.LineSegments(rainGeometry,new THREE.LineBasicMaterial({color:palette.sage,transparent:true,opacity:.5}));rain.visible=false;rain.frustumCulled=false;scene.add(rain);
  const projected=new THREE.Vector3(),origin=new THREE.Vector3(),cameraOffset=new THREE.Vector3(27,29,32);
  const raycaster=new THREE.Raycaster(),tap=createCharacterTap();
  let tween=null,greeting=null,actorPositions=[],lastSight=-Infinity;
  function hasSight(actor){
    actor.head.getWorldPosition(origin);projected.copy(origin).project(camera);
    raycaster.setFromCamera({x:projected.x,y:projected.y},camera);
    const first=raycaster.intersectObject(model.root,true).find(hit=>{
      if(hit.object.material?.opacity<.4)return false;
      let parent=hit.object;while(parent){if(!parent.visible)return false;parent=parent.parent;}return true;
    });
    let object=first?.object;while(object){if(object===actor.root)return true;object=object.parent;}return false;
  }
  function greet(id){
    const actor=model.actors.find(actor=>actor.id===id)||model.actors.find(actor=>actor.department===id);
    if(!actor)return null;
    greeting=isPaused()?null:{id:actor.id,started:time};
    if(greeting)canvas.dataset.greetingActor=actor.id;else delete canvas.dataset.greetingActor;dirty=true;
    return {id:actor.id,department:actor.department};
  }
  function dimensions(){return{width:Math.max(1,canvas.parentElement.clientWidth),height:Math.max(1,canvas.parentElement.clientHeight)};}
  function refitCamera(resetZoom=false,frame=null){
    const {width,height}=dimensions(),centre=focus?new THREE.Vector3(...departments[focus]):null;
    const bounds=centre?new THREE.Box3(new THREE.Vector3(centre.x-4.6,-.05,centre.z-3.8),new THREE.Vector3(centre.x+4.6,4.3,centre.z+3.8)):model.bounds;
    if(focus==='coffee')bounds.expandByObject(model.growthHolder);
    return applyProgrammeCameraFrame(camera,controls,frame,bounds,width,height,{padding:focus?1.12:1.08,resetZoom});
  }
  function resize(){
    if(disposed)return;const {width,height}=dimensions();refitCamera(true);finish.resize(width,height);dirty=true;renderer.shadowMap.needsUpdate=true;
  }
  function moveCamera(next,animate=true){
    focus=departments[next]?next:null;const target=new THREE.Vector3(...(focus?departments[focus]:[0,1.05,0]));
    const nextPosition=target.clone().add(cameraOffset);
    if(animate&&!isPaused()){tween={from:camera.position.clone(),to:nextPosition,fromTarget:controls.target.clone(),toTarget:target,started:performance.now()};}
    else {tween=null;camera.position.copy(nextPosition);controls.target.copy(target);controls.update();}
    canvas.dataset.department=focus||'all';resize();dirty=true;
  }
  function reset(){moveCamera(null,false);}
  function setEnvironment(next={}) {
    for(const key of ['hour','rain','wind','cloud','weatherCode']) if(Number.isFinite(Number(next[key])))environment[key]=Number(next[key]);
    environment.hour=Math.max(0,Math.min(24,environment.hour));environment.rain=Math.max(0,environment.rain);environment.wind=Math.max(0,Math.min(120,environment.wind));environment.cloud=Math.max(0,Math.min(1,environment.cloud>1?environment.cloud/100:environment.cloud));
    if(typeof next.isDay==='boolean')environment.isDay=next.isDay;
    else if(next.hour!==undefined)environment.isDay=environment.hour>=6&&environment.hour<19;
    const darkness=environment.isDay?1:.25,cloud=environment.cloud,wet=environment.rain>0||environment.weatherCode>=51;
    ambient.intensity=environment.isDay?.65+cloud*.10:.28;sun.intensity=environment.isDay?3.5-cloud*2.0:.48;fill.intensity=environment.isDay?.32:.20;scene.environmentIntensity=environment.isDay?.40:.10;
    sun.position.set(Math.sin((environment.hour-12)/12*Math.PI)*22,environment.isDay?20:14,18);
    renderer.toneMappingExposure=environment.isDay?1.08:.88;floor.material.opacity=environment.isDay?.17:.15;
    model.lamps.forEach(m=>{m.emissiveIntensity=environment.isDay?.05:1.65;});
    stars.visible=!environment.isDay;
    rain.visible=wet;rain.material.opacity=Math.min(.6,.22+environment.rain*.08)*darkness;
    canvas.dataset.environment=environment.isDay?'day':'night';canvas.dataset.weather=wet?'rain':cloud>.65?'cloudy':'clear';renderer.shadowMap.needsUpdate=true;dirty=true;
  }
  function projectActors(){
    const {width,height}=dimensions();
    const checkSight=isPaused()||performance.now()-lastSight>500;
    actorPositions=model.actors.map(actor=>{
      actor.root.getWorldPosition(origin);const position=origin.clone();projected.copy(position);projected.y+=2.15;projected.project(camera);
      const x=(projected.x*.5+.5)*width,y=(-.5*projected.y+.5)*height,depth=projected.z;
      const inFrame=projected.z>-1&&projected.z<1&&Math.abs(projected.x)<.93&&Math.abs(projected.y)<.90;
      if(checkSight)actor.inSight=inFrame&&hasSight(actor);
      projected.copy(position);projected.y+=1.1;projected.project(camera);
      return {id:actor.id,department:actor.department,activity:actor.activity,lightAction:actor.lightAction||null,x,y,hitX:(projected.x*.5+.5)*width,hitY:(-.5*projected.y+.5)*height,depth,visible:inFrame&&Boolean(actor.inSight)};
    });
    if(checkSight)lastSight=performance.now();
    onActors?.(actorPositions);
  }
  function animateWeather(){
    model.terrain.update(time,{wind:environment.wind,rain:environment.rain>0||environment.weatherCode>=51?1:0});
    const breeze=Math.min(1,environment.wind/35),sway=.01+breeze*.035;
    model.windPlants.forEach((p,i)=>{p.rotation.z=Math.sin(time*.65+i*1.37)*sway;p.rotation.x=Math.cos(time*.5+i)*sway*.35;});
    if(rain.visible){for(let i=0;i<rainCount;i++){const p=rainSeeds[i],y=10.8-((time*p.speed+p.y)%10.3),x=p.x+Math.sin(time*.15+i)*.2,drift=breeze*.15,j=i*6;rainPositions[j]=x;rainPositions[j+1]=y;rainPositions[j+2]=p.z;rainPositions[j+3]=x+drift;rainPositions[j+4]=y-.25;rainPositions[j+5]=p.z+.025;}rainGeometry.attributes.position.needsUpdate=true;}
  }
  let cameraFitNeeded=false;
  const onControl=()=>{cameraFitNeeded=true;dirty=true;};controls.addEventListener('change',onControl);
  const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);
  const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)dirty=true;},{rootMargin:'120px'});visibilityObserver.observe(canvas.parentElement);
  const onPreference=()=>{if(isPaused())tween=null;dirty=true;canvas.dataset.paused=String(isPaused());};osMotion.addEventListener('change',onPreference);
  const preferenceObserver=new MutationObserver(onPreference);preferenceObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduce-motion']});
  const onVisibility=()=>{last=0;tap.reset();if(!document.hidden)dirty=true;};document.addEventListener('visibilitychange',onVisibility);
  const onContextLost=event=>{event.preventDefault();manualPaused=true;onError?.(new Error('WebGL context lost'));};canvas.addEventListener('webglcontextlost',onContextLost);
  const onKey=event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;event.preventDefault();tween=null;
    if(event.key==='Home'){reset();return;}const delta=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(delta);
    if(event.key==='ArrowLeft')s.theta-=.13;if(event.key==='ArrowRight')s.theta+=.13;if(event.key==='ArrowUp')s.phi=Math.max(.48,s.phi-.07);if(event.key==='ArrowDown')s.phi=Math.min(1.25,s.phi+.07);
    camera.position.copy(new THREE.Vector3().setFromSpherical(s).add(controls.target));controls.update();dirty=true;
  };canvas.addEventListener('keydown',onKey);
  const onPointer=event=>{tween=null;tap.down(event);};
  const onPointerMove=event=>tap.move(event);
  const onPointerCancel=event=>tap.cancel(event);
  const onPointerUp=event=>{
    const point=tap.up(event);if(!point)return;
    const hud=canvas.parentElement.querySelector('.programme-clock-hud')?.getBoundingClientRect();
    if(hud&&point.x>=hud.left&&point.x<=hud.right&&point.y>=hud.top&&point.y<=hud.bottom)return;
    const bounds=canvas.getBoundingClientRect(),actor=pickCharacter(actorPositions,point.x-bounds.left,point.y-bounds.top);
    const modelActor=actor&&model.actors.find(item=>item.id===actor.id);
    if(modelActor&&hasSight(modelActor)){const hello=greet(modelActor.id);onHello?.(hello);}
  };
  canvas.addEventListener('pointerdown',onPointer,{passive:true,capture:true});
  canvas.addEventListener('pointermove',onPointerMove,{passive:true,capture:true});
  canvas.addEventListener('pointercancel',onPointerCancel,{passive:true,capture:true});
  canvas.addEventListener('pointerup',onPointerUp,{passive:true,capture:true});
  function loop(now){
    if(disposed)return;requestAnimationFrame(loop);if(!visible||document.hidden){last=0;return;}if(now-lastRendered<1000/30)return;
    const delta=last?Math.min((now-last)/1000,.1):0;last=now;lastRendered=now;const paused=isPaused();if(!paused)time+=delta;
    if(tween&&!paused){const p=Math.min(1,(now-tween.started)/650),ease=1-Math.pow(1-p,3);refitCamera(false,{...tween,amount:ease});dirty=true;if(p===1)tween=null;}
    const controlsChanged=controls.update();
    if(controlsChanged||cameraFitNeeded){cameraFitNeeded=false;refitCamera(false);dirty=true;}
    if(!paused||dirty){
      const routine=model.behavior.advance(delta,environment,{paused,reduced:reduced()});
      model.actors.forEach((actor,i)=>updateActor(actor,routine.actors[i],paused?0:delta,time));
      if(greeting){
        const actor=model.actors.find(actor=>actor.id===greeting.id),elapsed=time-greeting.started;
        const pose=wavePose(elapsed,{paused,reduced:reduced(),activity:actor.activity});
        if(pose){
          const arm=actor.arms[pose.arm];arm.rotation.x=THREE.MathUtils.lerp(arm.rotation.x,pose.lift,pose.amount);arm.rotation.z=THREE.MathUtils.lerp(arm.rotation.z,pose.sway,pose.amount);
          if(pose.arm===1)actor.pencil.visible=false;
          const toward=Math.atan2(camera.position.x-actor.root.position.x,camera.position.z-actor.root.position.z)-actor.root.rotation.y;
          actor.head.rotation.y=THREE.MathUtils.clamp(angleTowards(0,toward,1),-.5,.5)*pose.amount;
        }
        if(paused||elapsed>=waveDuration){greeting=null;delete canvas.dataset.greetingActor;}
      }
      model.workLights.forEach((lamp,i)=>{const level=routine.lights[i].level;lamp.light.intensity=14*level;lamp.bulbMaterial.emissiveIntensity=1.9*level;lamp.glowMaterial.opacity=.027*level;});
      animateWeather();
      if(now-lastShadow>750){renderer.shadowMap.needsUpdate=true;lastShadow=now;}
      finish.render();projectActors();dirty=false;canvas.dataset.rendered='true';canvas.dataset.paused=String(paused);
      if(frame===0||frame%20===0||paused){canvas.dataset.litDepartments=routine.lights.filter(light=>light.level>.08).map(light=>light.id).join(',');canvas.dataset.actorActions=JSON.stringify(Object.fromEntries(model.actors.map(actor=>[actor.id,actor.activity])));}
      if(!ready){ready=true;canvas.dispatchEvent(new Event('worldready'));onReady?.();}
      if(++frame%20===0){canvas.dataset.frames=String(frame);canvas.dataset.drawCalls=String(renderer.info.render.calls);}
    }
  }
  reset();setEnvironment({});canvas.dataset.growthStage='actual';requestAnimationFrame(loop);
  return {
    pause(value){manualPaused=Boolean(value);if(isPaused())tween=null;canvas.dataset.paused=String(isPaused());dirty=true;},
    reset,
    greet,
    clearGreeting(){greeting=null;delete canvas.dataset.greetingActor;dirty=true;},
    focusDepartment(id){moveCamera(id,true);},
    setEnvironment,
    setGrowthStage(stage){if(!growthStages.includes(stage)&&stage!=='actual')return false;model.setGrowth(stage);canvas.dataset.growthStage=stage;if(focus==='coffee')resize();renderer.shadowMap.needsUpdate=true;dirty=true;return true;},
    setPlantData(data){model.setPlantData(data);if(focus==='coffee')resize();renderer.shadowMap.needsUpdate=true;dirty=true;},
    get paused(){return isPaused();},
    get scene(){return scene;},
    dispose(){disposed=true;observer.disconnect();visibilityObserver.disconnect();preferenceObserver.disconnect();osMotion.removeEventListener('change',onPreference);document.removeEventListener('visibilitychange',onVisibility);canvas.removeEventListener('keydown',onKey);canvas.removeEventListener('pointerdown',onPointer,true);canvas.removeEventListener('pointermove',onPointerMove,true);canvas.removeEventListener('pointercancel',onPointerCancel,true);canvas.removeEventListener('pointerup',onPointerUp,true);canvas.removeEventListener('webglcontextlost',onContextLost);model.workLights.forEach(lamp=>{lamp.bulbMaterial.dispose();lamp.glowMaterial.dispose();});controls.dispose();finish.dispose();renderer.dispose();},
  };
}
