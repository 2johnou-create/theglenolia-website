import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createFarmLife} from '../../src/progress/farm-life.js';

function assertFinite(root){
  root.updateMatrixWorld(true);
  root.traverse(o=>{
    assert.ok(o.matrixWorld.elements.every(Number.isFinite),`${o.name||o.type}: finite transform`);
    if(o.isInstancedMesh)assert.ok(o.instanceMatrix.array.every(Number.isFinite),`${o.name}: finite instances`);
    if(o.isMesh)for(const attr of Object.values(o.geometry.attributes))assert.ok(attr.array.every(Number.isFinite),`${o.name}: finite geometry`);
  });
}
function transforms(root){const values=[];root.traverse(o=>{values.push(...o.matrixWorld.elements);if(o.isInstancedMesh)values.push(...o.instanceMatrix.array);});return values;}

test('farm life adds two farm-vehicle types, wildlife and underground activity within a modest real geometry budget',t=>{
  const life=createFarmLife();t.after(()=>life.dispose());
  assert.equal(life.stats.tractors,1);assert.equal(life.stats.trailers,1);assert.equal(life.stats.utilityCarts,1);
  assert.equal(life.stats.animals,3);assert.equal(life.stats.birds,7);assert.equal(life.stats.aircraft,1);assert.equal(life.stats.worms,3);
  let draws=0,triangles=0;life.root.traverse(o=>{if(o.isMesh){draws++;triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);}});
  assert.equal(life.stats.drawCalls,draws);assert.ok(draws<=45,`Added draw allowance: ${draws}`);assert.ok(triangles<35000);
  assert.ok(life.root.getObjectByName('Flowing underground water'));assertFinite(life.root);
});

test('soil window is optional and toggles independently without moving vehicles or rewriting terrain',t=>{
  const life=createFarmLife();t.after(()=>life.dispose());const window=life.root.getObjectByName('Optional underground activity window'),tractor=life.root.getObjectByName('Tractor and crop trailer');
  assert.equal(window.visible,false);const before=tractor.matrixWorld.clone();
  life.setUnderground(true);assert.equal(window.visible,true);assert.equal(life.getState().underground,true);
  life.setUnderground(false);assert.equal(window.visible,false);assert.deepEqual(tractor.matrixWorld.elements,before.elements);
});

test('normal animation returns exactly after weather chaos and groundwater responds visibly',t=>{
  const life=createFarmLife();t.after(()=>life.dispose());life.setUnderground(true);life.update(32);const normal=transforms(life.root),tractor=life.root.getObjectByName('Tractor and crop trailer'),before=tractor.position.clone(),water=life.root.getObjectByName('Illustrative rising groundwater'),waterHeight=water.scale.y;
  life.update(32,{active:true,wind:110,rain:15,flood:1,panic:1});assert.ok(tractor.position.distanceTo(before)>1);assert.ok(water.scale.y>waterHeight*2);assert.ok(life.getState().active);assertFinite(life.root);
  life.update(32);assert.deepEqual(transforms(life.root),normal,'Returning to normal has no accumulated storm offset');assert.deepEqual(life.getState(),{underground:true,wind:0,rain:0,flood:0,panic:0,active:false});
});

test('all animation and exposed flight bounds remain finite across time and malformed weather',t=>{
  const life=createFarmLife();t.after(()=>life.dispose());life.setUnderground(true);
  for(const time of[0,10,100,86400,1e30,NaN,Infinity,-100])for(const env of[{}, {active:true,wind:150,rain:30,flood:1,panic:1},{wind:NaN,rain:Infinity,flood:'bad',panic:-Infinity}]){
    life.update(time,env);assertFinite(life.root);const bounds=new THREE.Box3().setFromObject(life.root);
    assert.ok(life.bounds.containsBox(bounds),`Declared framing bounds contain all animated geometry at ${time}`);
  }
});

test('same seed/time creates identical props and reduced-motion poses remain still',t=>{
  const a=createFarmLife({seed:14}),b=createFarmLife({seed:14});t.after(()=>{a.dispose();b.dispose();});
  a.update(19);b.update(19);assert.deepEqual(transforms(a.root),transforms(b.root));
  a.update(7,{reducedMotion:true,panic:.7,active:true});const first=transforms(a.root);a.update(300,{reducedMotion:true,panic:.7,active:true});assert.deepEqual(transforms(a.root),first);
});

test('dimension scaling and height callback work for the physical farm footprint too',t=>{
  const life=createFarmLife({width:25.4,depth:18,groundY:.43,heightAt:()=>.75});t.after(()=>life.dispose());life.setUnderground(true);
  for(const time of[0,20,100]){life.update(time);assertFinite(life.root);const b=new THREE.Box3().setFromObject(life.root);assert.ok(b.min.x>=-25.4/2-.4&&b.max.x<=25.4/2+.4);assert.ok(b.min.z>=-18/2-.4&&b.max.z<=18/2+.95);}
  assert.equal(life.root.getObjectByName('Tractor and crop trailer').position.y,.75);
});

test('physical fleet route stays clear of the existing cafe wall, plan board and coffee rows for a complete circuit',t=>{
  const life=createFarmLife({width:25.4,depth:18,vehicleOffsetX:-1.9});t.after(()=>life.dispose());
  const tractor=life.root.getObjectByName('Tractor and crop trailer');
  // World extents come from the existing physical farm layout, not this helper.
  // The whole fleet box must clear them, making this conservative for diagonal poses.
  const obstacles=[
    ['cafe left wall',new THREE.Box3(new THREE.Vector3(.42,.5,-4.90),new THREE.Vector3(.58,3.6,.90))],
    ['plan board',new THREE.Box3(new THREE.Vector3(-.425,.43,-5.97),new THREE.Vector3(.925,2.6,-5.83))],
    ['coffee rows',new THREE.Box3(new THREE.Vector3(-9.2,.4,-3),new THREE.Vector3(-3.68,2,3.4))],
  ];
  for(let seconds=0;seconds<84;seconds+=.20){
    life.update(seconds);const fleet=new THREE.Box3().setFromObject(tractor);
    for(const [name,obstacle]of obstacles)assert.equal(fleet.intersectsBox(obstacle),false,`${name} at ${seconds}`);
  }
});

test('invalid geometry configuration rejects before a partial scene is created',()=>{
  for(const config of[{width:NaN},{depth:Infinity},{width:0},{depth:2},{groundY:NaN},{seed:1.5},{heightAt:3},{vehicleOffsetX:NaN},{vehicleOffsetX:10}])assert.throws(()=>createFarmLife(config),TypeError);
});

test('dispose is idempotent and subsequent updates do not touch disposed buffers',()=>{
  const life=createFarmLife();const old=transforms(life.root);life.dispose();life.dispose();life.update(8,{panic:1,active:true});assert.deepEqual(transforms(life.root),old);
});
