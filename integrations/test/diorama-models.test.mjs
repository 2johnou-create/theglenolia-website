import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createDioramaTerrain} from '../../src/progress/diorama-terrain.js';
import {createCafeProps} from '../../src/progress/diorama-cafe.js';

const physical={width:25.4,depth:18,groundY:.43,pads:[
  {x:-6,z:.3,w:9.5,d:9.5},
  {x:4,z:-.2,w:10,d:12},
  {x:.4,z:0,w:2.6,d:15},
]};
const programme={width:30,depth:24,groundY:.43,pads:[
  {x:-6.2,z:-4.2,w:9,d:7.2},
  {x:6.3,z:-4.2,w:9,d:7.2},
  {x:-6.3,z:4.7,w:9,d:7.2},
  {x:6.3,z:4.7,w:9,d:7.2},
]};

function close(actual,expected,message,tolerance=1e-6){
  assert.ok(Math.abs(actual-expected)<=tolerance,`${message}: expected ${expected}, received ${actual}`);
}
function cleanup(root){
  const geometries=new Set(),materials=new Set(),textures=new Set();
  root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
}
function measuredBudget(root){
  let triangles=0,draws=0;
  root.traverse(o=>{if(!o.isMesh)return;draws+=Array.isArray(o.material)?o.material.length:1;triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);});
  return {triangles,draws};
}
function assertFiniteModel(root){
  root.updateMatrixWorld(true);
  root.traverse(o=>{
    assert.ok(o.matrixWorld.elements.every(Number.isFinite),`${o.name||o.type} has a finite world transform`);
    if(!o.isMesh)return;
    for(const [name,attribute]of Object.entries(o.geometry.attributes)){
      for(const value of attribute.array)assert.ok(Number.isFinite(value),`${o.name}: finite ${name}`);
    }
    if(o.isInstancedMesh)for(const value of o.instanceMatrix.array)assert.ok(Number.isFinite(value),`${o.name}: finite instance transform`);
  });
}

for(const [name,config]of [['physical development',physical],['programme',programme]]){
  test(`${name} terrain retains requested dimensions and level pads`,t=>{
    const terrain=createDioramaTerrain(config);t.after(()=>cleanup(terrain.root));
    const top=terrain.root.getObjectByName('Fine contoured meadow surface');
    assert.ok(top?.isMesh,'The actual terrain surface is present');
    const size=new THREE.Box3().setFromObject(top).getSize(new THREE.Vector3());
    close(size.x,config.width,'Terrain width');close(size.z,config.depth,'Terrain depth');
    const lowerLayer=terrain.root.getObjectByName('Exposed illustrative earth layer 1');
    close(new THREE.Box3().setFromObject(lowerLayer).min.y,config.groundY-2.6,'Cutaway base level');
    for(const pad of config.pads)for(const sx of[-1,0,1])for(const sz of[-1,0,1]){
      close(terrain.heightAt(pad.x+sx*pad.w/2,pad.z+sz*pad.d/2),config.groundY,'Pad corner/edge/centre',1e-9);
    }
    terrain.update(2,{wind:20,rain:1});assertFiniteModel(terrain.root);
    const budget=measuredBudget(terrain.root);
    assert.ok(budget.triangles<220000,'Real geometry stays below the terrain triangle allowance');
    assert.ok(budget.draws<20,'Instancing and batching stay below the terrain draw allowance');
  });
}

test('terrain rejects invalid dimensions and pads before building a scene',()=>{
  for(const options of [
    {width:NaN},{width:Infinity},{width:0},{depth:-1},{depth:'24'},
    {groundY:NaN},{groundY:Infinity},{pads:null},{pads:Array(21).fill({x:0,z:0,w:1,d:1})},
    {pads:[{x:0,z:0,w:0,d:1}]},{pads:[{x:Infinity,z:0,w:1,d:1}]},
    {pads:[{x:0,z:0,w:1}]},
  ])assert.throws(()=>createDioramaTerrain(options),TypeError);
});

test('malformed time, wind and rain readings cannot produce nonfinite render state',t=>{
  const terrain=createDioramaTerrain(physical);t.after(()=>cleanup(terrain.root));
  // Use Three's actual standard shader configuration to inspect the numerical
  // uniforms supplied to the wind modifiers. This is not a WebGL shader test.
  const shaders=[],materials=new Set();
  terrain.root.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);});
  for(const material of materials){
    const shader={vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader,uniforms:THREE.UniformsUtils.clone(THREE.ShaderLib.standard.uniforms)};
    material.onBeforeCompile(shader);shaders.push(shader);
  }
  for(const reading of [
    {time:NaN,wind:NaN,rain:NaN},
    {time:Infinity,wind:Infinity,rain:-Infinity},
    {time:-Infinity,wind:'unavailable',rain:'unavailable'},
    {time:undefined,wind:undefined,rain:undefined},
    {time:5,wind:-100,rain:-1},
    {time:8,wind:1e12,rain:1},
  ]){
    terrain.update(reading.time,{wind:reading.wind,rain:reading.rain});
    for(const shader of shaders)for(const uniform of Object.values(shader.uniforms)){
      if(typeof uniform.value==='number')assert.ok(Number.isFinite(uniform.value),'Numerical shader uniforms remain finite');
    }
    for(const material of materials)assert.ok(Number.isFinite(material.roughness)&&material.roughness>=0&&material.roughness<=1,'Material roughness remains valid');
  }
  assertFiniteModel(terrain.root);
});

test('the same terrain seed produces the same geometry and placement',t=>{
  const first=createDioramaTerrain({...physical,seed:4711}),second=createDioramaTerrain({...physical,seed:4711});
  t.after(()=>{cleanup(first.root);cleanup(second.root);});
  const meshes=root=>{const list=[];root.traverse(o=>{if(o.isMesh)list.push(o);});return list;};
  const a=meshes(first.root),b=meshes(second.root);assert.equal(a.length,b.length);
  for(let i=0;i<a.length;i++){
    assert.deepEqual(a[i].geometry.attributes.position.array,b[i].geometry.attributes.position.array,'Terrain geometry is deterministic');
    if(a[i].isInstancedMesh)assert.deepEqual(a[i].instanceMatrix.array,b[i].instanceMatrix.array,'Vegetation and stone placement is deterministic');
  }
});

test('cafe and garden contain local static geometry and relocate independently without preview actors',t=>{
  const props=createCafeProps({heightAt:()=>.43,includeActors:false});t.after(()=>cleanup(props.root));
  assert.equal(props.stats.characters,0);
  assert.ok(props.cafeRoot?.isGroup&&props.gardenRoot?.isGroup);
  for(const component of [props.cafeRoot,props.gardenRoot]){
    const box=new THREE.Box3().setFromObject(component);assert.equal(box.isEmpty(),false,'Returned components retain real geometry');
    const local=box.clone().applyMatrix4(new THREE.Matrix4().copy(component.matrixWorld).invert());
    assert.ok(local.min.x<0&&local.max.x>0&&local.min.z<0&&local.max.z>0,'Component geometry is centred in its own local coordinates');
    component.traverse(o=>{if(o.isMesh)assert.equal(o.parent,component,'Actor-free scenery is batched directly under its movable component');});
  }
  const beforeCafe=new THREE.Box3().setFromObject(props.cafeRoot),beforeGarden=new THREE.Box3().setFromObject(props.gardenRoot);
  props.cafeRoot.position.add(new THREE.Vector3(10,2,-3));props.root.updateMatrixWorld(true);
  const afterCafe=new THREE.Box3().setFromObject(props.cafeRoot),afterGarden=new THREE.Box3().setFromObject(props.gardenRoot);
  close(afterCafe.min.x-beforeCafe.min.x,10,'Cafe X translation');close(afterCafe.min.y-beforeCafe.min.y,2,'Cafe Y translation');close(afterCafe.min.z-beforeCafe.min.z,-3,'Cafe Z translation');
  close(afterGarden.min.distanceTo(beforeGarden.min),0,'Garden stays in place');close(afterGarden.max.distanceTo(beforeGarden.max),0,'Garden extents stay in place');
  props.update(0);props.update(30);assertFiniteModel(props.root);
});
