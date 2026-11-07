import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {fitDioramaCamera} from '../../src/progress/diorama-renderer.js';

const bounds=new THREE.Box3(new THREE.Vector3(-15,-2.2,-12),new THREE.Vector3(15,7.4,12));
function projected(camera,box){const out=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])out.push(new THREE.Vector3(x,y,z).project(camera));return out;}
for(const [width,height]of [[320,520],[390,600],[768,620],[1440,650]]){
  test(`diorama fits all model corners at ${width}x${height}`,()=>{
    const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,150);camera.position.set(23,24,27);
    const target=new THREE.Vector3(0,1.4,0),before=target.clone(),position=camera.position.clone();
    assert.equal(fitDioramaCamera(camera,{target},bounds,width,height),true);
    for(const p of projected(camera,bounds)){assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1);assert.ok(p.z>-1&&p.z<1);}
    assert.deepEqual(target,before);assert.deepEqual(camera.position,position);
  });
}
test('a department focus fits a tall local model without borrowing the whole world bounds',()=>{
 const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,150),target=new THREE.Vector3(6,1,-4);camera.position.copy(target).add(new THREE.Vector3(17,18,20));
 const local=new THREE.Box3(new THREE.Vector3(2,.4,-7),new THREE.Vector3(10,5,-1));
 fitDioramaCamera(camera,{target},local,390,600);
 for(const p of projected(camera,local))assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1);
 assert.ok(camera.right-camera.left<20);
});
test('perspective fit expands a portrait view without being clipped by an old distance cap',()=>{
 const camera=new THREE.PerspectiveCamera(33,1,.1,200);camera.position.set(22,20,25);const controls={target:new THREE.Vector3(0,1.4,0),maxDistance:30};
 fitDioramaCamera(camera,controls,bounds,390,600);
 for(const p of projected(camera,bounds))assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1);
 assert.ok(camera.position.distanceTo(controls.target)<=controls.maxDistance);
});
test('invalid or zero-sized models cannot corrupt a working camera',()=>{
 const camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,150);camera.position.set(1,1,1);const controls={target:new THREE.Vector3()};
 assert.equal(fitDioramaCamera(camera,controls,new THREE.Box3(),390,600),false);
 assert.equal(fitDioramaCamera(camera,controls,bounds,0,600),false);
 assert.ok(camera.projectionMatrix.elements.every(Number.isFinite));
});
