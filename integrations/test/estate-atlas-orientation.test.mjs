import assert from 'node:assert/strict';
import test from 'node:test';
import { OrthographicCamera, Vector3 } from 'three';
import { plantX, rowZ } from '../../src/atlas/orchard.js';
import { viewOffset } from '../../src/atlas/relief.js';
import { positionsPerView } from '../../public/assets/plant-portal/atlas-framing.js';

test('atlas camera projects all twelve rows down the screen and each position to the right', () => {
  const camera = new OrthographicCamera(-30,30,14,-14,.1,200);
  camera.position.copy(viewOffset);
  camera.lookAt(0,0,0);
  camera.updateMatrixWorld();
  const project = (r,p) => new Vector3(plantX(p),0,rowZ(r)).project(camera);
  for (let r=1;r<=12;r++) {
    for (let p=1;p<=19;p++) {
      const point=project(r,p);
      if(r<12) assert.ok(point.y>project(r+1,p).y, 'Row '+r+' precedes the next row');
      if(p<19) assert.ok(point.x<project(r,p+1).x, 'Positions progress to the right');
    }
  }
});

test('the same field positions can be paged on phones and in the closer desktop view', () => {
  assert.equal(positionsPerView(390,false),6);
  assert.equal(positionsPerView(390,true),6);
  assert.equal(positionsPerView(1000,false),10);
  assert.equal(positionsPerView(1000,true),19);
});
