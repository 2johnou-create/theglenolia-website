import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Original, illustrative toy surface wildlife and farm vehicles.
// These props make no claim about equipment, species or utilities at the farm.
const clamp=(value,min=0,max=1)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):min;
const finiteTime=value=>Number.isFinite(value)?Math.max(0,value)%86400:0;
const up=new THREE.Vector3(0,1,0);

export function createFarmLife({width=30,depth=24,groundY=.43,seed=38119,heightAt,vehicleOffsetX=0}={}) {
  if(!Number.isFinite(width)||width<8||width>80||!Number.isFinite(depth)||depth<8||depth>80||!Number.isFinite(groundY)||!Number.isInteger(seed))throw new TypeError('Farm life requires finite dimensions, ground and an integer seed');
  if(heightAt!==undefined&&typeof heightAt!=='function')throw new TypeError('heightAt must be a function');
  if(!Number.isFinite(vehicleOffsetX)||Math.abs(vehicleOffsetX)>width*.30)throw new TypeError('Vehicle route offset must stay inside the landscape');
  const root=new THREE.Group();root.name='Illustrative farm life';
  const sx=width/30,sz=depth/24,scale=Math.min(sx,sz),geometries=new Set(),materials=new Set();
  let disposed=false,random=seed>>>0;
  const rand=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random/4294967296;};
  const geometry=g=>{geometries.add(g);return g;};
  const material=(color,roughness=.75,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness,...extra});materials.add(m);return m;};
  const M={green:material(0x2f4a3c,.57),ivory:material(0xf5f1e8,.65),sage:material(0xd9dfd0),copper:material(0xb57b5a,.64),ink:material(0x3b332d,.77),rubber:material(0x292b27,.94),metal:material(0x7d8780,.38,{metalness:.46}),glass:material(0xa7beb2,.17,{transparent:true,opacity:.56,depthWrite:false}),skin:material(0xad8062),animal:material(0x877d6c,.96),earth:material(0x796448,.98),sand:material(0xb0a284,.95),deep:material(0x4a4035,1),bird:material(0x4b5148,.85)};
  const boxGeo=geometry(new THREE.BoxGeometry(1,1,1)),ballGeo=geometry(new THREE.SphereGeometry(1,12,8)),cylGeo=geometry(new THREE.CylinderGeometry(1,1,1,12));
  function group(parent,x=0,y=0,z=0,name=''){const g=new THREE.Group();g.position.set(x,y,z);g.name=name;parent.add(g);return g;}
  function mesh(parent,g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
  function box(parent,w,h,d,m,x=0,y=0,z=0){const o=mesh(parent,boxGeo,m,x,y,z);o.scale.set(w,h,d);return o;}
  function ball(parent,a,b,c,m,x=0,y=0,z=0){const o=mesh(parent,ballGeo,m,x,y,z);o.scale.set(a,b,c);return o;}
  function cyl(parent,r,h,m,x=0,y=0,z=0){const o=mesh(parent,cylGeo,m,x,y,z);o.scale.set(r,h,r);return o;}
  function beam(parent,a,b,r,m){const p=new THREE.Vector3(...a),d=new THREE.Vector3(...b).sub(p),o=cyl(parent,r,d.length(),m);o.position.copy(p.addScaledVector(d,.5));o.quaternion.setFromUnitVectors(up,d.normalize());return o;}
  function batch(parent){
    parent.updateMatrixWorld(true);const inverse=new THREE.Matrix4().copy(parent.matrixWorld).invert(),parts=new Map(),old=[];
    parent.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const key=o.material.uuid;if(!parts.has(key))parts.set(key,{material:o.material,geos:[]});const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));parts.get(key).geos.push(g);old.push(o);});
    old.forEach(o=>o.removeFromParent());
    for(const part of parts.values()){const merged=mergeGeometries(part.geos,false);part.geos.forEach(g=>g.dispose());if(merged)mesh(parent,geometry(merged),part.material);}
  }
  function ground(x,z){const y=heightAt?.(x,z);return Number.isFinite(y)?y:groundY;}

  // Open-cab tractor, separate crop trailer, treaded tyres, hubs and a driver.
  const tractor=group(root,0,groundY,0,'Tractor and crop trailer');tractor.scale.setScalar(scale);
  const body=group(tractor);
  box(body,1.05,.20,2.15,M.ink,0,.45,0);box(body,.93,.61,1.10,M.green,0,.89,.63);
  box(body,1.01,.12,1.23,M.sage,0,1.23,.62);box(body,.96,.47,.06,M.ink,0,.89,1.21);
  for(let i=0;i<7;i++)box(body,.67,.024,.024,M.metal,0,.70+i*.058,1.25);
  for(const s of[-1,1]){ball(body,.095,.095,.045,M.ivory,s*.35,1.10,1.26);box(body,.13,.09,.27,M.copper,s*.58,.55,.08);box(body,.22,.055,.42,M.metal,s*.65,.62,-.40);}
  const exhaust=cyl(body,.045,.69,M.ink,-.28,1.58,.47);cyl(body,.064,.07,M.metal,-.28,1.96,.47);
  box(body,.69,.13,.52,M.ink,0,.93,-.49);box(body,.64,.41,.13,M.ink,0,1.15,-.77);
  for(const s of[-1,1]){box(body,.11,.95,.08,M.green,s*.57,1.21,-.85);box(body,.11,.95,.08,M.green,s*.57,1.21,-.05);box(body,.41,.10,1.15,M.green,s*.61,.91,-.46);}
  box(body,1.42,.09,1.22,M.ivory,0,1.72,-.46);
  const steering=mesh(body,geometry(new THREE.TorusGeometry(.19,.022,5,14)),M.ink,0,1.23,-.02);steering.rotation.x=.85;
  beam(body,[0,.83,-.05],[0,1.24,-.02],.025,M.metal);
  box(body,.33,.39,.25,M.ivory,0,1.15,-.45);ball(body,.15,.18,.145,M.skin,0,1.51,-.45);
  cyl(body,.19,.055,M.copper,0,1.67,-.45);cyl(body,.125,.10,M.copper,0,1.73,-.45);
  for(const s of[-1,1]){beam(body,[s*.14,1.27,-.45],[s*.16,1.19,-.05],.048,M.ivory);beam(body,[s*.11,.99,-.45],[s*.19,.71,-.06],.055,M.green);}
  beam(body,[0,.42,-1.03],[0,.43,-1.65],.045,M.metal);
  box(body,1.30,.12,1.66,M.green,0,.49,-2.22);box(body,1.34,.08,1.77,M.metal,0,.40,-2.22);
  for(const s of[-1,1]){box(body,.075,.47,1.76,M.copper,s*.65,.77,-2.22);box(body,1.36,.47,.075,M.copper,0,.77,-2.22+s*.85);}
  for(let i=0;i<8;i++){const x=(i%2-.5)*.54,z=-2.70+Math.floor(i/2)*.31;box(body,.43,.24,.26,M.sage,x,.68,z);ball(body,.15,.12,.15,M.green,x,.85,z);}
  batch(body);
  // Wheel assemblies are instanced, with a real tread profile and rotating hubs.
  const wheelBuilder=new THREE.Group();const torus=geometry(new THREE.TorusGeometry(.36,.13,8,18));torus.rotateY(Math.PI/2);mesh(wheelBuilder,torus,M.rubber);
  for(let i=0;i<18;i++){const a=i*Math.PI/9,o=box(wheelBuilder,.29,.07,.15,M.rubber,0,Math.cos(a)*.47,Math.sin(a)*.47);o.rotation.x=a;}
  batch(wheelBuilder);const tyreGeometry=wheelBuilder.children[0].geometry;
  const hubGeometry=geometry(new THREE.CylinderGeometry(.24,.24,.30,12));hubGeometry.rotateZ(Math.PI/2);
  const wheels=new THREE.InstancedMesh(tyreGeometry,M.rubber,6),hubs=new THREE.InstancedMesh(hubGeometry,M.sage,6);wheels.name='Six rotating farm-vehicle tyres';hubs.name='Farm-vehicle wheel hubs';wheels.castShadow=hubs.castShadow=true;tractor.add(wheels,hubs);
  const wheelPositions=[[-.61,.48,-.57,.95],[.61,.48,-.57,.95],[-.58,.37,.80,.74],[.58,.37,.80,.74],[-.65,.36,-2.25,.72],[.65,.36,-2.25,.72]];

  // A second, hand-operated farm vehicle remains on the nursery perimeter.
  const handcart=group(root,width*.39,groundY,-depth*.20,'Nursery utility handcart');handcart.scale.setScalar(scale);handcart.rotation.y=-.4;
  box(handcart,.67,.10,1.01,M.green,0,.43,0);box(handcart,.08,.31,1.02,M.copper,-.35,.62,0);box(handcart,.08,.31,1.02,M.copper,.35,.62,0);box(handcart,.72,.31,.08,M.copper,0,.62,-.48);
  for(const s of[-1,1]){beam(handcart,[s*.24,.39,-.25],[s*.33,.04,-.48],.027,M.metal);beam(handcart,[s*.25,.40,.29],[s*.33,.72,.94],.028,M.green);}
  const cartWheel=cyl(handcart,.25,.12,M.rubber,0,.26,.32);cartWheel.rotation.z=Math.PI/2;cyl(handcart,.08,.14,M.metal,0,.26,.32).rotation.z=Math.PI/2;
  for(let i=0;i<3;i++){cyl(handcart,.11,.21,M.copper,(i-1)*.19,.58,-.03);ball(handcart,.12,.11,.10,M.green,(i-1)*.19,.73,-.03);}
  batch(handcart);

  const animals=[];
  for(let i=0;i<3;i++){
    const animal=group(root,0,0,0,i===2?'Tiny illustrative echidna':'Tiny burrowing animal '+(i+1));animal.scale.setScalar(scale*(i===2?.85:1));
    ball(animal,.27,.20,.39,M.animal,0,.22,0);ball(animal,.21,.18,.24,M.animal,0,.30,.31);ball(animal,.12,.085,.12,M.ink,0,.28,.51);
    for(const s of[-1,1]){ball(animal,.055,.07,.055,M.animal,s*.14,.46,.28);ball(animal,.022,.025,.016,M.ink,s*.15,.35,.46);for(const z of[-.20,.22])ball(animal,.075,.09,.10,M.ink,s*.18,.08,z);}
    if(i===2)for(let j=0;j<20;j++){const a=j*2.4,r=.12+rand()*.16;const spine=mesh(animal,geometry(new THREE.ConeGeometry(.022,.14,4)),M.sand,Math.cos(a)*r,.30+rand()*.10,Math.sin(a)*r-.07);spine.rotation.z=Math.cos(a)*.7;spine.rotation.x=Math.sin(a)*.7;}
    batch(animal);animals.push(animal);
  }
  const holes=group(root,0,0,0,'Small illustrative burrow entrances');
  for(const [x,z]of[[-width*.41,depth*.36],[-width*.36,depth*.40]]){
    const h=ball(holes,.30*scale,.012,.23*scale,M.deep,x,ground(x,z)+.015,z);h.rotation.y=-.5;
    for(let i=0;i<4;i++){const a=i*Math.PI/2;ball(holes,.12*scale,.055*scale,.09*scale,M.earth,x+Math.cos(a)*.30*scale,ground(x,z)+.04,z+Math.sin(a)*.23*scale);}
  }
  batch(holes);
  const digDirt=new THREE.InstancedMesh(ballGeo,M.earth,12);digDirt.name='Burrowing soil crumbs';digDirt.castShadow=true;root.add(digDirt);

  // Birds use just two draw calls, including their independent moving wings.
  const birdBodyBuilder=new THREE.Group();ball(birdBodyBuilder,.10,.09,.20,M.bird);const tail=box(birdBodyBuilder,.13,.025,.18,M.bird,0,0,-.20);tail.rotation.x=.2;ball(birdBodyBuilder,.075,.07,.07,M.bird,0,.055,.16);batch(birdBodyBuilder);
  const birds=new THREE.InstancedMesh(birdBodyBuilder.children[0].geometry,M.bird,7),birdWings=new THREE.InstancedMesh(boxGeo,M.bird,14);birds.name='Seven little flying birds';birdWings.name='Independently flapping bird wings';root.add(birds,birdWings);
  const phases=Array.from({length:7},()=>rand()*Math.PI*2);
  // A small illustrative utility aircraft flies high above the toy landscape.
  const aircraft=group(root,0,0,0,'Illustrative passing utility aircraft');aircraft.scale.setScalar(scale);
  ball(aircraft,.19,.20,.83,M.ivory);box(aircraft,2.05,.055,.48,M.green,0,.04,.03);box(aircraft,.78,.045,.26,M.sage,0,.10,-.66);box(aircraft,.045,.43,.24,M.green,0,.29,-.64);
  ball(aircraft,.155,.13,.30,M.glass,0,.18,.17);cyl(aircraft,.12,.09,M.copper,0,0,.85).rotation.x=Math.PI/2;batch(aircraft);
  const propeller=group(aircraft,0,0,.93,'Small plane propeller');box(propeller,.82,.035,.025,M.ink);box(propeller,.035,.82,.025,M.ink);batch(propeller);

  const temp=new THREE.Object3D(),position=new THREE.Vector3(),quaternion=new THREE.Quaternion(),rotation=new THREE.Euler();
  const state={wind:0,rain:0,flood:0,panic:0,active:false};
  function update(t,{wind=0,rain=0,flood=0,panic=0,active=false,reducedMotion=false}={}){
    if(disposed)return;
    const time=reducedMotion?0:finiteTime(t),w=clamp(wind,0,120),r=clamp(rain,0,20),f=clamp(flood),p=clamp(panic),chaos=Boolean(active);
    Object.assign(state,{wind:w,rain:r,flood:f,panic:p,active:chaos});
    const phase=time*(.075+p*.10),x=.55*sx*Math.cos(phase),z=7.6*sz*Math.sin(phase),heading=Math.atan2(-.55*sx*Math.sin(phase),7.6*sz*Math.cos(phase));
    const vehicleX=vehicleOffsetX+x*(1-p),vehicleZ=z*(1-p)+depth*.37*p;
    tractor.position.set(vehicleX,ground(vehicleX,vehicleZ)+f*.04,vehicleZ);tractor.rotation.set(0,heading*(1-p)+Math.PI*p,Math.sin(time*3.1)*p*.025);
    handcart.position.y=ground(handcart.position.x,handcart.position.z)+Math.sin(time*1.7)*f*.08;handcart.rotation.z=Math.sin(time*2.3)*p*.035;
    for(let i=0;i<wheelPositions.length;i++){const [wx,wy,wz,s]=wheelPositions[i];temp.position.set(wx,wy,wz);temp.rotation.set(-time*(1+p)*2.5,0,0);temp.scale.setScalar(s);temp.updateMatrix();wheels.setMatrixAt(i,temp.matrix);hubs.setMatrixAt(i,temp.matrix);}wheels.instanceMatrix.needsUpdate=hubs.instanceMatrix.needsUpdate=true;
    for(let i=0;i<animals.length;i++){
      const a=animals[i],clock=time*(.37+p*1.8)+i*2.3,normalX=width*(-.41+i*.39)+(i===1?.7:Math.sin(clock)*.25)*sx,normalZ=depth*(i===1?.39:.36)+Math.cos(clock)*.24*sz;
      const targetX=(i-1)*1.05*sx,targetZ=depth*.39;
      const dig=i===0&&!chaos?Math.max(0,Math.sin(time*.36)-.30)*1.30:0;
      const px=normalX*(1-p)+targetX*p,pz=normalZ*(1-p)+targetZ*p;
      a.position.set(px,ground(px,pz)+Math.abs(Math.sin(clock*7))*.035*scale-.40*scale*dig+f*.08,pz);
      a.rotation.set(dig*.34,Math.atan2(Math.cos(clock),-Math.sin(clock))*(1-p)+Math.PI*p,Math.sin(clock*6)*p*.04);a.visible=dig<.92||chaos;
    }
    for(let i=0;i<12;i++){const a=i*2.399+time*.5,burst=reducedMotion?0:Math.max(0,Math.sin(time*.36)-.20),radius=(.25+((i+time*.8)%5)*.10)*scale;temp.position.set(-width*.41+Math.cos(a)*radius,groundY+burst*(.06+(i%3)*.05)*scale,depth*.36+Math.sin(a)*radius*.7);temp.rotation.set(a,a*.3,0);temp.scale.set(.035*scale,.025*scale,.04*scale);temp.updateMatrix();digDirt.setMatrixAt(i,temp.matrix);}digDirt.instanceMatrix.needsUpdate=true;digDirt.visible=!chaos;
    for(let i=0;i<7;i++){
      const a=time*(.16+p*.22)+phases[i],rx=width*(.24+p*.13),rz=depth*(.24+p*.12),py=groundY+(3.1+i*.16+p*.55)*scale;
      position.set(Math.cos(a)*rx,py+Math.sin(a*2)*.20*scale,Math.sin(a)*rz);rotation.set(Math.sin(a*2)*.03,Math.atan2(-Math.sin(a)*rx,Math.cos(a)*rz),Math.sin(a)*(.12+p*.2));quaternion.setFromEuler(rotation);
      temp.position.copy(position);temp.quaternion.copy(quaternion);temp.scale.setScalar(scale);temp.updateMatrix();birds.setMatrixAt(i,temp.matrix);
      for(const side of[-1,1]){const flap=Math.sin(time*(8+p*6)+i)*.60;temp.position.set(side*.22*scale,0,0).applyQuaternion(quaternion).add(position);temp.quaternion.copy(quaternion);temp.rotateZ(side*flap);temp.scale.set(.30*scale,.025*scale,.16*scale);temp.updateMatrix();birdWings.setMatrixAt(i*2+(side===1?1:0),temp.matrix);}
    }birds.instanceMatrix.needsUpdate=birdWings.instanceMatrix.needsUpdate=true;
    const planePhase=time*.040+1.4;aircraft.position.set(Math.cos(planePhase)*width*.32,groundY+(5.6+Math.sin(planePhase)*.3)*scale,Math.sin(planePhase)*depth*.30);aircraft.rotation.set(0,Math.atan2(-Math.sin(planePhase)*width*.32,Math.cos(planePhase)*depth*.30),Math.sin(planePhase)*(.12+p*.20));propeller.rotation.z=time*25;
    root.updateMatrixWorld(true);
  }
  update(0);
  const stats={meshes:0,drawCalls:0,triangles:0,tractors:1,trailers:1,utilityCarts:1,animals:3,birds:7,aircraft:1,illustrative:true};
  root.traverse(o=>{if(!o.isMesh)return;stats.meshes++;stats.drawCalls+=Array.isArray(o.material)?o.material.length:1;stats.triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);});
  const bounds=new THREE.Box3(new THREE.Vector3(-width/2,groundY-.5*scale,-depth/2),new THREE.Vector3(width/2,groundY+6.8*scale,depth/2));
  return {root,update,stats,bounds,getState:()=>({...state}),dispose(){if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.removeFromParent();}};
}
