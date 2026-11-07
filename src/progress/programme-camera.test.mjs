import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {applyProgrammeCameraFrame} from './programme-world.js';

const offset=new THREE.Vector3(27,29,32);
const departments={cafe:[-6.2,1,-4.2],coffee:[6.3,1,-4.2],workshops:[-6.3,1,4.7],local:[6.3,1,4.7]};
const whole=new THREE.Box3(new THREE.Vector3(-15,-2.17,-12),new THREE.Vector3(15,7,12));
const boundsFor=id=>{if(id==='all')return whole;const [x,,z]=departments[id];return new THREE.Box3(new THREE.Vector3(x-4.6,-.05,z-3.8),new THREE.Vector3(x+4.6,id==='coffee'?5.4:4.3,z+3.8));};
function assertContained(camera,bounds,label){
  for(const x of[bounds.min.x,bounds.max.x])for(const y of[bounds.min.y,bounds.max.y])for(const z of[bounds.min.z,bounds.max.z]){
    const p=new THREE.Vector3(x,y,z).project(camera);
    assert.ok(Math.abs(p.x)<=1+1e-8&&Math.abs(p.y)<=1+1e-8,`${label}: corner ${x},${y},${z} projects to ${p.x},${p.y}`);
  }
}
function setup(){const camera=new THREE.OrthographicCamera(-16,16,12,-12,.1,150),controls={target:new THREE.Vector3(0,1.05,0)};camera.position.copy(controls.target).add(offset);camera.lookAt(controls.target);camera.updateMatrixWorld(true);return{camera,controls};}

test('programme focus keeps all corners framed throughout all→department, department→department and reset transitions',()=>{
  for(const [width,height]of[[1280,650],[390,490],[768,600]]){
    const {camera,controls}=setup();
    applyProgrammeCameraFrame(camera,controls,null,whole,width,height,{padding:1.08,resetZoom:true});
    for(const next of['cafe','coffee','workshops','local','cafe','all']){
      const target=new THREE.Vector3(...(departments[next]||[0,1.05,0]));
      const frame={from:camera.position.clone(),to:target.clone().add(offset),fromTarget:controls.target.clone(),toTarget:target};
      for(const p of[0,.25,.5,.75,1]){
        applyProgrammeCameraFrame(camera,controls,{...frame,amount:1-(1-p)**3},boundsFor(next),width,height,{padding:next==='all'?1.08:1.12,resetZoom:false});
        assertContained(camera,boundsFor(next),`${width}×${height} ${next} at ${p}`);
      }
    }
  }
});

test('orbit orientation refits department bounds without retaining the previous off-centre frustum',()=>{
  for(const [width,height]of[[1280,650],[390,490]])for(const id of Object.keys(departments)){
    const {camera,controls}=setup();controls.target.set(...departments[id]);
    for(const [theta,phi]of[[0,.48],[.8,.8],[1.7,1.25],[-2.4,.65]]){
      camera.position.copy(new THREE.Vector3().setFromSpherical(new THREE.Spherical(offset.length(),phi,theta))).add(controls.target);
      applyProgrammeCameraFrame(camera,controls,null,boundsFor(id),width,height,{padding:1.12,resetZoom:false});
      assertContained(camera,boundsFor(id),`${id} orbit ${theta},${phi}`);
    }
  }
});

test('continuous framing preserves an intentional user zoom; explicit reset restores overview zoom',()=>{
  const {camera,controls}=setup();camera.zoom=1.7;
  applyProgrammeCameraFrame(camera,controls,null,boundsFor('coffee'),390,490,{padding:1.12,resetZoom:false});
  assert.equal(camera.zoom,1.7);
  controls.target.set(0,1.05,0);camera.position.copy(controls.target).add(offset);
  applyProgrammeCameraFrame(camera,controls,null,whole,390,490,{padding:1.08,resetZoom:true});
  assert.equal(camera.zoom,1);assertContained(camera,whole,'reset overview');
});
