import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// An original planning miniature. Its clock, characters and growth previews never
// establish the real work, attendance, planting or programme status of the farm.
const palette = {green:0x2F4A3C, ivory:0xF5F1E8, copper:0xB57B5A, sage:0xD9DFD0, ink:0x3B332D};
const departments = {cafe:[-6.2,1,-4.2], coffee:[6.3,1,-4.2], workshops:[-6.3,1,4.7], local:[6.3,1,4.7]};
const growthStages = ['seed','germinating','seedling','grafting','growing','flowering','cherries','harvest'];
const up = new THREE.Vector3(0,1,0);
const geometries = new Map();
const materials = new Map();
const unitBox = new THREE.BoxGeometry(1,1,1);
const sphere = new THREE.SphereGeometry(1,10,7);
const leafShape = new THREE.SphereGeometry(1,8,5);
const unitCylinder = new THREE.CylinderGeometry(1,1,1,10);
const capsule = new THREE.CapsuleGeometry(1,1,3,8);
function material(colour='green',opacity=1) {
  const key=colour+opacity;
  if (!materials.has(key)) materials.set(key,new THREE.MeshStandardMaterial({color:palette[colour],roughness:.88,metalness:0,transparent:opacity<1,opacity}));
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
    geometries.set(key,new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.06,bevelThickness:.04,bevelSegments:1,steps:1,curveSegments:5}));
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
  const foliage=new THREE.InstancedMesh(leafShape,material('green'),count),temp=new THREE.Object3D();
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
function pergola(parent,x,z,w=6.5,d=5.2,roof=false) {
  const g=group(parent,x,.43,z);
  for (const a of [-1,1]) for (const b of [-1,1]) box(g,.13,3.2,.13,'copper',a*(w/2),1.6,b*(d/2));
  for (const a of [-1,1]) box(g,w+.2,.16,.15,'green',0,3.23,a*d/2);
  for (let i=0;i<7;i++) box(g,.09,.10,d+.22,'copper',-w/2+i*w/6,3.35,0);
  if (roof) {const canopy=box(g,w+.3,.06,d+.3,'sage',0,3.45,0);canopy.material=material('sage',.32);canopy.castShadow=false;}
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
function character(parent,{id,department,shirt='green',hat=false,route,offset=0,speed=.8}) {
  const root=group(parent,route[0].x,.43,route[0].z),body=group(root),head=group(body,0,1.63,0);
  mesh(body,capsule,shirt,0,1.06,0).scale.set(.20,.24,.19);
  box(body,.32,.40,.08,'sage',0,1.01,.18);
  ball(head,.255,.28,.24,'ivory');
  for(const side of [-1,1]) ball(head,.018,.026,.015,'ink',side*.082,.02,.225);
  ball(head,.035,.037,.03,'copper',0,-.025,.235);
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
function updateActor(actor,delta,time,environment) {
  const night=!environment.isDay,isLunch=environment.hour>=11.5&&environment.hour<13.5;
  const station=actor.route[actor.index];
  if(actor.wait>0){
    actor.wait=Math.max(0,actor.wait-delta*(night?.35:1));actor.activity=night?'resting':station.activity==='resting'&&isLunch?'lunch':station.activity;
    actor.root.rotation.y=angleTowards(actor.root.rotation.y,station.face,delta*7);
  } else {
    const next=(actor.index+1)%actor.route.length,target=actor.route[next],dx=target.x-actor.root.position.x,dz=target.z-actor.root.position.z,distance=Math.hypot(dx,dz),step=delta*actor.speed*(night?.35:1);
    actor.activity='walking';
    if(distance<=step){actor.root.position.set(target.x,.43,target.z);actor.index=next;actor.wait=target.hold;actor.activity=night?'resting':target.activity;}
    else {actor.root.position.x+=dx/distance*step;actor.root.position.z+=dz/distance*step;actor.root.rotation.y=angleTowards(actor.root.rotation.y,Math.atan2(dx,dz),delta*9);}
  }
  const moving=actor.activity==='walking',resting=['resting','lunch'].includes(actor.activity),seated=resting&&station.activity==='resting'&&actor.wait>0,phase=time*6*actor.speed;
  actor.body.position.y=moving?Math.abs(Math.sin(phase))*.035:Math.sin(time*1.4+actor.offset)*.008;
  actor.body.rotation.z=moving?Math.sin(phase)*.018:0;
  actor.head.rotation.y=resting?Math.sin(time*.5+actor.offset)*.08:Math.sin(time*.7+actor.offset)*.035;
  actor.legs.forEach((leg,i)=>{leg.hip.rotation.x=seated?-1.35:moving?Math.sin(phase+i*Math.PI)*.43:0;leg.knee.rotation.x=seated?1.4:moving?Math.max(0,-Math.sin(phase+i*Math.PI))*.5:0;});
  actor.arms.forEach((arm,i)=>{arm.rotation.set(moving?Math.sin(phase+(i?0:Math.PI))*.3:resting&&!seated?-.15:-.8,0,resting?(i?-.12:.12):0);});
  const writing=['writing','planning'].includes(actor.activity),measuring=actor.activity==='measuring',watering=actor.activity==='watering',selecting=actor.activity==='selecting';
  actor.clipboard.visible=writing;actor.pencil.visible=writing;actor.watering.visible=watering;actor.sample.visible=selecting;actor.ruler.visible=measuring;actor.lunch.visible=actor.activity==='lunch';
  if(writing){actor.arms[1].rotation.x=-1.1+Math.sin(time*3+actor.offset)*.09;actor.arms[0].rotation.x=-.95;}
  if(measuring){actor.arms[0].rotation.x=-1.15;actor.arms[1].rotation.x=-1.1+Math.sin(time*.8)*.08;}
  if(watering){actor.arms[1].rotation.x=-.7+Math.sin(time*1.3)*.09;actor.watering.rotation.z=-.35;}
  if(selecting){actor.arms[0].rotation.x=-1.2+Math.sin(time*.8)*.10;actor.arms[1].rotation.x=-.5;}
}
function buildMiniature(scene,requestRender) {
  const root=new THREE.Group();scene.add(root);const windPlants=[],lamps=[],actors=[];
  rounded(root,27.8,20.3,.5,'copper',-.48,1.2);rounded(root,27.8,20.3,.14,'sage',.08,1.2);rounded(root,27.4,19.9,.08,'ivory',.31,1.1);
  // Furniture and walls stay inside the four islands. Travel follows the open lanes.
  rounded(root,2.7,18.9,.035,'copper',.42,.4);rounded(root,25.8,2.3,.035,'copper',.425,.4);
  for(const [id,[x,,z]] of Object.entries(departments)){const floor=rounded(root,8.2,6.7,.055,id==='coffee'?'sage':'ivory',.43,.7);floor.position.set(x,.43,z);}
  for(const x of [-11.9,11.9])for(const z of [-8.5,8.5])windPlants.push(shadeTree(root,x,z,z<0?1.15:.92));
  for(let i=0;i<15;i++){const x=-12.5+i*1.8;box(root,.075,.65,.075,'ivory',x,.79,-9.1);if(i<14)box(root,1.8,.065,.055,'copper',x+.9,.94,-9.1);}

  // Café and farm programme planning: an open dollhouse, with plans rather than a service queue.
  const cafe=pergola(root,-6.2,-4.2,6.9,5.2);
  box(cafe,6.9,1.1,.12,'sage',0,.58,-2.6);box(cafe,.12,2.5,5.2,'ivory',-3.45,1.3,0);
  box(cafe,6.9,.18,.14,'green',0,2.8,-2.6);planningBoard(root,-8.45,-5.7,.12);
  const cafeTable=table(root,-6.5,-3.35,3.5,1.4);paper(cafeTable,0,1.055,0,1.55,.9);box(cafeTable,1.25,.018,.018,'sage',0,1.07,0);box(cafeTable,.018,.018,.7,'copper',-.25,1.07,0);mug(cafeTable,1.2,1.1,.25);
  const layout=group(cafeTable,-.05,1.10,-.05);box(layout,.40,.19,.30,'sage',-.35,.09,0);box(layout,.25,.035,.5,'green',.3,.025,.02);
  const shelf=group(cafe,-2.3,.1,-1.1);box(shelf,1.5,.9,.7,'ivory',0,.45,0);box(shelf,1.6,.08,.8,'green',0,.94,0);for(const x of [-.35,.15,.5])mug(shelf,x,1.07,.05);

  // Coffee nursery: seed trays and small plants remain the initial illustrative state.
  pergola(root,6.25,-4.2,6.9,5.2,true);
  const nursery=table(root,7.7,-5.2,3.2,1.3,1.0);tray(nursery,-.7,1.11,0,1.2,.8);
  for(const x of [.25,.8,1.3])windPlants.push(smallPlant(nursery,x,.1,.22,1.06));
  const seedBench=table(root,7.6,-3.5,2.5,1.1,.92);tray(seedBench,-.45,1.02,0,.85,.65);paper(seedBench,.65,1.02,0,.6,.65);
  const growthHolder=group(root,4.5,.57,-4.4);cylinder(root,1.05,.17,'ivory',4.5,.52,-4.4);
  const plantData={seedStage:'seed',trialStage:'seedling',heightCm:20},growthCache=new Map();
  let growth='actual',growthRoot=actualPlants(plantData);growthHolder.add(growthRoot);
  planningBoard(root,9.35,-5.95,-.15);
  for(const z of [-5.9,-5.25,-4.6])windPlants.push(smallPlant(root,3.5,z,.25));

  // Hands-on workshops: a practice table, journals, sample pots and seating.
  pergola(root,-6.25,4.6,6.9,5.0);
  const work=table(root,-6.2,4.25,4.1,1.7,1.02);paper(work,-1,1.10,0,.95,.65);paper(work,.3,1.10,.12,.8,.55);
  for(const x of [.9,1.35])smallPlant(work,x,-.1,.19,1.08);
  for(const x of [-7.2,-5.3])stool(root,x,5.7);
  planningBoard(root,-8.65,6.0,.12);const tools=table(root,-8.5,3.25,1.2,1.1,.83);tray(tools,0,.93,0,.85,.6);

  // Local connections: choosing growers, makers and product presentation samples.
  const local=pergola(root,6.3,4.6,6.9,5.0);box(local,6.9,.65,.13,'sage',0,.35,2.5);
  const selection=table(root,6.3,4.25,4.2,1.6,1.02);paper(selection,-1.25,1.1,0,.9,.65);
  for(let i=0;i<4;i++){const x=-.25+i*.60;cylinder(selection,.15,.28,'sage',x,1.25,.15);cylinder(selection,.165,.05,'copper',x,1.42,.15);box(selection,.17,.11,.02,'ivory',x,1.25,.30);}
  const crate=group(root,8.75,.44,6.35);box(crate,1.3,.55,1.05,'copper',0,.28,0);for(let i=0;i<3;i++)box(crate,1.32,.045,1.07,'ivory',0,.13+i*.18,0);box(crate,1.1,.035,.8,'sage',0,.57,0);
  const swatches=table(root,3.9,6.1,1.25,1.0,.80);for(let i=0;i<3;i++)box(swatches,.6,.035,.5,['ivory','green','sage'][i],0,.89+i*.06,0).rotation.y=.12*i;
  planningBoard(root,9.15,6.6,-.2);

  // Break benches sit in the lanes; routes stop at their front, with room to pass.
  bench(root,-1.7,3.0,Math.PI/2);bench(root,2.25,-2.1,-Math.PI/2);bench(root,-3.2,.85);bench(root,3.2,.85);bench(root,1.2,7.7,-Math.PI/2);
  const lunchTable=table(root,0,7.7,1.4,.9,.7);mug(lunchTable,-.28,.84,.1);box(lunchTable,.40,.03,.32,'ivory',.25,.80,0);box(lunchTable,.30,.06,.22,'sage',.25,.85,0);
  for(const [x,z] of [[-1.45,-8.2],[1.45,8.25],[-11.2,1.45],[11.2,-1.45]]){
    beam(root,[x,.43,z],[x,3.5,z],.035,'ink');const lantern=cylinder(root,.18,.27,'ivory',x,3.28,z);lantern.material=new THREE.MeshStandardMaterial({color:palette.ivory,emissive:palette.ivory,emissiveIntensity:0,roughness:.8});lamps.push(lantern.material);
  }
  const routes=[
    {id:'cafe-planner',department:'cafe',shirt:'green',speed:.83,route:[point(-6.5,-2.25,17,'planning',Math.PI),point(-6.5,-1.25),point(-1.7,-1.25),point(-1.7,2.45,9,'resting',Math.PI/2),point(-1.7,-1.25),point(-6.5,-1.25)]},
    {id:'cafe-measurer',department:'cafe',shirt:'ivory',offset:6,speed:.72,route:[point(-3.4,-4.8,14,'measuring',-Math.PI/2),point(-3.4,-1.25),point(-1.2,-1.25),point(-1.2,-7.7,8,'writing',Math.PI),point(-1.2,-1.25),point(-3.4,-1.25)]},
    {id:'coffee-grower',department:'coffee',shirt:'sage',hat:true,speed:.75,offset:3,route:[point(7.5,-2.35,18,'watering',Math.PI),point(7.5,-1.25),point(2.25,-1.25),point(2.25,-2.1,9,'resting',-Math.PI/2),point(2.25,-1.25),point(7.5,-1.25)]},
    {id:'workshop-maker',department:'workshops',shirt:'copper',speed:.78,offset:8,route:[point(-6.2,3.05,19,'writing',0),point(-6.2,1.3),point(-3.2,.85,10,'resting',0),point(-6.2,1.3)]},
    {id:'local-selector',department:'local',shirt:'green',speed:.80,offset:5,route:[point(6.3,3.05,18,'selecting',0),point(6.3,1.3),point(3.2,.85,10,'resting',0),point(6.3,1.3)]},
    {id:'garden-helper',department:'coffee',shirt:'copper',hat:true,speed:.76,offset:1,route:[point(1.4,5.5,4,'planning',Math.PI/2),point(1.4,7.7),point(1.2,7.7,12,'resting',-Math.PI/2),point(1.4,7.7),point(1.4,-.2),point(-1.4,-.2),point(-1.4,-7.7,7,'measuring',0),point(-1.4,-.2),point(1.4,-.2)]},
  ];
  for(const spec of routes)actors.push(character(root,spec));

  const base=document.querySelector('meta[name=site-base]')?.content||'';
  const texture=new THREE.TextureLoader().load(base+'/assets/email/logo-compact.png',requestRender,undefined,()=>{});texture.colorSpace=THREE.SRGBColorSpace;
  box(root,2.08,1.10,.08,'ivory',-6.2,2.7,-6.78);
  for(const x of [-6.85,-5.55])beam(root,[x,3.66,-6.80],[x,3.24,-6.80],.018,'copper');
  const logo=new THREE.Mesh(new THREE.PlaneGeometry(1.85,.94),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));logo.position.set(-6.2,2.7,-6.72);root.add(logo);
  batchStatic(root,new Set([...windPlants,growthHolder,...actors.map(actor=>actor.root)]));
  function refreshGrowth(stage){
    if(stage===growth&&growthHolder.children.length)return;
    growth=stage;growthHolder.remove(growthRoot);
    if(stage==='actual')growthRoot=actualPlants(plantData);
    else {if(!growthCache.has(stage))growthCache.set(stage,coffeeDisplay(stage));growthRoot=growthCache.get(stage);}
    growthHolder.add(growthRoot);
  }
  return {
    root,actors,lamps,
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

export function createProgrammeWorld(canvas,{onError,onReady,onActors}={}) {
  let renderer;
  try {renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});} catch(error) {onError?.(error);return null;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<600?1.25:1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-16,16,12,-12,.1,150),controls=new OrbitControls(camera,canvas);
  controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.075;controls.enableZoom=false;controls.minPolarAngle=.48;controls.maxPolarAngle=1.25;controls.rotateSpeed=.5;canvas.style.touchAction='pan-y pinch-zoom';
  const ambient=new THREE.HemisphereLight(palette.ivory,palette.sage,2.7),sun=new THREE.DirectionalLight(palette.ivory,3.2),fill=new THREE.DirectionalLight(palette.ivory,.9);scene.add(ambient,sun,fill);
  sun.position.set(-15,25,18);fill.position.set(18,12,-16);sun.castShadow=true;sun.shadow.mapSize.set(window.innerWidth<600?1024:1536,window.innerWidth<600?1024:1536);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,far:75});sun.shadow.normalBias=.06;sun.shadow.bias=-.00015;sun.shadow.radius=4;
  sun.shadow.camera.updateProjectionMatrix();
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.11}));floor.rotation.x=-Math.PI/2;floor.position.y=-.54;floor.receiveShadow=true;scene.add(floor);
  let dirty=true,manualPaused=false,visible=true,disposed=false,ready=false,frame=0,time=0,last=0,lastRendered=0,lastShadow=0,focus=null;
  const osMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const reduced=()=>document.documentElement.dataset.reduceMotion==='true'||osMotion.matches;
  const isPaused=()=>manualPaused||reduced();
  const environment={isDay:true,hour:12,weatherCode:0,rain:0,wind:6,cloud:.15};
  const model=buildMiniature(scene,()=>{dirty=true;});
  const sky=group(scene),clouds=[];
  for(let i=0;i<3;i++){const cloud=group(sky,-8+i*8,5.7+(i%2)*.4,-6.4-(i%2)*.6);for(let j=0;j<4;j++)ball(cloud,.85+j%2*.35,.40+j%2*.13,.45,'ivory',(j-1.5)*.9,Math.sin(j)*.2,Math.cos(j)*.16);clouds.push(cloud);}
  const moon=ball(sky,.43,.43,.43,'ivory',-12.2,4.9,-4);moon.material=new THREE.MeshBasicMaterial({color:palette.ivory});moon.visible=false;
  const sunDisc=ball(sky,.45,.45,.45,'copper',-12.2,4.9,-4);sunDisc.material=new THREE.MeshBasicMaterial({color:palette.copper});
  const starsGeometry=new THREE.BufferGeometry(),starPositions=new Float32Array(21*3);
  // A shallow band behind the miniature keeps the toy sky inside the wide overview.
  for(let i=0;i<21;i++){const across=-8+(i*7.13)%16,rise=(i*1.79)%1.1;starPositions[i*3]=across*.764-rise*.367;starPositions[i*3+1]=6+rise*.823;starPositions[i*3+2]=-7-across*.645-rise*.435;}
  starsGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));const stars=new THREE.Points(starsGeometry,new THREE.PointsMaterial({color:palette.ivory,size:1.8,sizeAttenuation:false,transparent:true,opacity:.9}));stars.visible=false;sky.add(stars);
  const rainCount=180,rainPositions=new Float32Array(rainCount*6),rainSeeds=[];
  for(let i=0;i<rainCount;i++)rainSeeds.push({x:-13+(i*4.771)%26,z:-9+(i*7.713)%18,y:(i*3.733)%11,speed:4.5+(i%5)*.35});
  const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));const rain=new THREE.LineSegments(rainGeometry,new THREE.LineBasicMaterial({color:palette.sage,transparent:true,opacity:.5}));rain.visible=false;rain.frustumCulled=false;scene.add(rain);
  const projected=new THREE.Vector3(),origin=new THREE.Vector3(),cameraOffset=new THREE.Vector3(27,29,32);
  let tween=null;
  function dimensions(){return{width:Math.max(1,canvas.parentElement.clientWidth),height:Math.max(1,canvas.parentElement.clientHeight)};}
  function resize(){
    if(disposed)return;const {width,height}=dimensions(),aspect=width/height,half=focus?Math.max(5.2,10.7/aspect/2):Math.max(11.3,36/aspect/2);
    camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(width,height,false);dirty=true;renderer.shadowMap.needsUpdate=true;
  }
  function moveCamera(next,animate=true){
    focus=departments[next]?next:null;const target=new THREE.Vector3(...(focus?departments[focus]:[0,1.05,0]));
    const nextPosition=target.clone().add(cameraOffset);
    if(animate&&!reduced()){tween={from:camera.position.clone(),to:nextPosition,fromTarget:controls.target.clone(),toTarget:target,started:performance.now()};}
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
    ambient.intensity=environment.isDay?2.7-cloud*.7:1.2;sun.intensity=environment.isDay?3.2-cloud*1.65:.42;fill.intensity=environment.isDay?.9:.45;
    sun.position.set(Math.sin((environment.hour-12)/12*Math.PI)*22,environment.isDay?20:14,18);
    renderer.toneMappingExposure=environment.isDay?1.08:.88;floor.material.opacity=environment.isDay?.11:.13;
    model.lamps.forEach(m=>{m.emissiveIntensity=environment.isDay?.05:1.65;});
    moon.visible=stars.visible=!environment.isDay;sunDisc.visible=environment.isDay&&cloud<.65;clouds.forEach((c,i)=>{c.visible=cloud>.16||i===0;c.scale.setScalar(.75+cloud*.6);});
    rain.visible=wet;rain.material.opacity=Math.min(.6,.22+environment.rain*.08)*darkness;
    canvas.dataset.environment=environment.isDay?'day':'night';canvas.dataset.weather=wet?'rain':cloud>.65?'cloudy':'clear';renderer.shadowMap.needsUpdate=true;dirty=true;
  }
  function projectActors(){
    const {width,height}=dimensions();
    onActors?.(model.actors.map(actor=>{actor.root.getWorldPosition(origin);projected.copy(origin);projected.y+=2.15;projected.project(camera);return{id:actor.id,department:actor.department,activity:actor.activity,x:(projected.x*.5+.5)*width,y:(-.5*projected.y+.5)*height,visible:projected.z>-1&&projected.z<1&&Math.abs(projected.x)<.93&&Math.abs(projected.y)<.90};}));
  }
  function animateWeather(){
    const breeze=Math.min(1,environment.wind/35),sway=.01+breeze*.035;
    model.windPlants.forEach((p,i)=>{p.rotation.z=Math.sin(time*.65+i*1.37)*sway;p.rotation.x=Math.cos(time*.5+i)*sway*.35;});
    clouds.forEach((cloud,i)=>{cloud.position.x=-8+i*8+Math.sin(time*.035+i)*(.25+breeze*.6);});
    if(rain.visible){for(let i=0;i<rainCount;i++){const p=rainSeeds[i],y=10.8-((time*p.speed+p.y)%10.3),x=p.x+Math.sin(time*.15+i)*.2,drift=breeze*.15,j=i*6;rainPositions[j]=x;rainPositions[j+1]=y;rainPositions[j+2]=p.z;rainPositions[j+3]=x+drift;rainPositions[j+4]=y-.25;rainPositions[j+5]=p.z+.025;}rainGeometry.attributes.position.needsUpdate=true;}
  }
  const onControl=()=>{dirty=true;};controls.addEventListener('change',onControl);
  const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);
  const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)dirty=true;},{rootMargin:'120px'});visibilityObserver.observe(canvas.parentElement);
  const onPreference=()=>{dirty=true;canvas.dataset.paused=String(isPaused());};osMotion.addEventListener('change',onPreference);
  const preferenceObserver=new MutationObserver(onPreference);preferenceObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduce-motion']});
  const onVisibility=()=>{last=0;if(!document.hidden)dirty=true;};document.addEventListener('visibilitychange',onVisibility);
  const onContextLost=event=>{event.preventDefault();manualPaused=true;onError?.(new Error('WebGL context lost'));};canvas.addEventListener('webglcontextlost',onContextLost);
  const onKey=event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;event.preventDefault();tween=null;
    if(event.key==='Home'){reset();return;}const delta=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(delta);
    if(event.key==='ArrowLeft')s.theta-=.13;if(event.key==='ArrowRight')s.theta+=.13;if(event.key==='ArrowUp')s.phi=Math.max(.48,s.phi-.07);if(event.key==='ArrowDown')s.phi=Math.min(1.25,s.phi+.07);
    camera.position.copy(new THREE.Vector3().setFromSpherical(s).add(controls.target));controls.update();dirty=true;
  };canvas.addEventListener('keydown',onKey);
  const onPointer=()=>{tween=null;};canvas.addEventListener('pointerdown',onPointer,{passive:true});
  function loop(now){
    if(disposed)return;requestAnimationFrame(loop);if(!visible||document.hidden){last=0;return;}if(now-lastRendered<1000/30)return;
    const delta=last?Math.min((now-last)/1000,.1):0;last=now;lastRendered=now;const paused=isPaused();if(!paused)time+=delta;
    if(tween){const p=Math.min(1,(now-tween.started)/650),ease=1-Math.pow(1-p,3);camera.position.lerpVectors(tween.from,tween.to,ease);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,ease);dirty=true;if(p===1)tween=null;}
    controls.update();
    if(!paused||dirty){
      model.actors.forEach(a=>updateActor(a,paused?0:delta,time,environment));animateWeather();
      if(now-lastShadow>750){renderer.shadowMap.needsUpdate=true;lastShadow=now;}
      renderer.render(scene,camera);projectActors();dirty=false;canvas.dataset.rendered='true';canvas.dataset.paused=String(paused);
      if(!ready){ready=true;canvas.dispatchEvent(new Event('worldready'));onReady?.();}
      if(++frame%20===0){canvas.dataset.frames=String(frame);canvas.dataset.drawCalls=String(renderer.info.render.calls);}
    }
  }
  reset();setEnvironment({});canvas.dataset.growthStage='actual';requestAnimationFrame(loop);
  return {
    pause(value){manualPaused=Boolean(value);canvas.dataset.paused=String(isPaused());dirty=true;},
    reset,
    focusDepartment(id){moveCamera(id,true);},
    setEnvironment,
    setGrowthStage(stage){if(!growthStages.includes(stage)&&stage!=='actual')return false;model.setGrowth(stage);canvas.dataset.growthStage=stage;renderer.shadowMap.needsUpdate=true;dirty=true;return true;},
    setPlantData(data){model.setPlantData(data);renderer.shadowMap.needsUpdate=true;dirty=true;},
    get paused(){return isPaused();},
    get scene(){return scene;},
    dispose(){disposed=true;observer.disconnect();visibilityObserver.disconnect();preferenceObserver.disconnect();osMotion.removeEventListener('change',onPreference);document.removeEventListener('visibilitychange',onVisibility);canvas.removeEventListener('keydown',onKey);canvas.removeEventListener('pointerdown',onPointer);canvas.removeEventListener('webglcontextlost',onContextLost);controls.dispose();renderer.dispose();},
  };
}
