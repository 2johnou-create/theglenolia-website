import assert from 'node:assert/strict';
import test from 'node:test';
import {eligiblePlantPreferences,plantPosition} from '../../public/teachers/teacher-ui.js';

test('teacher preferences and historical assignments use stable atlas identifiers',()=>{
  assert.equal(plantPosition('r1-p19'),'P19 · Row 1');
  assert.equal(plantPosition('r2-p2'),'P21 · Row 2');
  assert.equal(plantPosition('r2-p19'),'P38 · Row 2');
  assert.equal(plantPosition('r12-p19'),'P228 · Row 12');
  for(const key of [null,1,'','r0-p1','r13-p1','r01-p1','r2-p0','r3-p20','r2-p01','r2-p2/']){
    assert.equal(plantPosition(key),null);
  }
});

test('school preferences include only enabled planted positions that can take a request',()=>{
  const plant=(row,position,stage,status)=>({key:'r'+row+'-p'+position,row,position,stage,status});
  const map={
    rows:[{row:3,enabledCount:7},{row:4,enabledCount:0}],
    plants:[
      plant(3,1,2,'unverified'),plant(3,2,10,'available'),plant(3,3,1,'available'),
      plant(3,4,4,'unavailable'),plant(3,5,11,'available'),plant(3,6,2,'unrecognised'),
      {...plant(3,7,3,'available'),key:'r3-p5'},plant(3,8,3,'available'),plant(4,1,3,'available'),
      plant(5,1,3,'available'),null
    ]
  };
  assert.deepEqual(eligiblePlantPreferences(map).map(p=>p.key),['r3-p1','r3-p2']);
  map.rows[0].enabledCount=1;
  assert.deepEqual(eligiblePlantPreferences(map).map(p=>p.key),['r3-p1']);
  for(const missing of [null,{},[],{plants:map.plants},{rows:[]}]){
    assert.deepEqual(eligiblePlantPreferences(missing),[]);
  }
});
