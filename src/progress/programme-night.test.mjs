import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgrammeNightBehavior,departmentLightStations} from './programme-night.js';

const night={isDay:false,hour:22,rain:0,weatherCode:0};
const day={...night,isDay:true,hour:12};
const p=(x,z,hold=0,activity='walking',face=0)=>({x,z,hold,activity,face});
const spec=(id='cafe-planner',department='cafe',hold=2)=>({id,department,speed:2,route:[p(-6.5,-2.25,hold,'planning',Math.PI),p(-6.5,-1.25),p(-1.7,-1.25),p(-1.7,2.45,4,'resting'),p(-1.7,-1.25),p(-6.5,-1.25)]});
function run(behavior,seconds,environment=night,collect=()=>{}){for(let i=0;i<Math.round(seconds*20);i++)collect(behavior.advance(.05,environment),i*.05);}
const positions=snapshot=>snapshot.actors.map(({x,z,index,wait})=>({x,z,index,wait}));

test('paused initial night has a correct occupied lighting snapshot without moving',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  const before=positions(behavior.getSnapshot());
  const state=behavior.advance(0,night,{paused:true});
  assert.equal(state.lights.find(l=>l.id==='cafe').level,1);
  assert.equal(state.lights.find(l=>l.id==='coffee').level,0);
  assert.deepEqual(positions(state),before);
  assert.equal(state.actors[0].activity,'planning');
});
test('dawn and dusk settle lights at delta zero, preserving actor positions',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  run(behavior,3);const before=positions(behavior.getSnapshot());
  const lit=behavior.advance(0,day,{paused:true});assert.ok(lit.lights.every(l=>l.level===0));
  assert.deepEqual(positions(lit),before);
  const dark=behavior.advance(0,night,{paused:true});assert.equal(dark.lights[0].level,dark.lights[0].occupants>0?1:0);
  assert.deepEqual(positions(dark),before);
});
test('garden helper alone never occupies or illuminates the nursery',()=>{
  const helper={...spec('garden-helper','coffee'),lightParticipant:false};
  const behavior=createProgrammeNightBehavior([helper]);
  run(behavior,70,night,state=>assert.equal(state.lights.find(l=>l.id==='coffee').level,0));
});
test('night and wet-weather coffee work is inspection rather than watering, also while paused',()=>{
  const water={...spec('coffee-grower','coffee',20),route:[p(7.5,-2.35,20,'watering',Math.PI),p(7.5,-1.25),p(2.25,-1.25),p(2.25,-2.1,9,'resting'),p(2.25,-1.25),p(7.5,-1.25)]};
  const behavior=createProgrammeNightBehavior([water]);
  assert.equal(behavior.advance(0,night,{paused:true}).actors[0].activity,'checking');
  assert.equal(behavior.advance(0,day,{paused:true}).actors[0].activity,'watering');
  assert.equal(behavior.advance(0,{...day,rain:1},{paused:true}).actors[0].activity,'checking');
});
test('shared café never switches off while a colleague remains working',()=>{
  const behavior=createProgrammeNightBehavior([spec('cafe-planner','cafe',.1),spec('cafe-measurer','cafe',120)]);
  run(behavior,100,night,state=>{
    assert.equal(state.lights[0].on,true);assert.equal(state.lights[0].level,1);
    assert.equal(state.actors[1].activity,'planning');
  });
  assert.equal(behavior.getSnapshot().lights[0].switches,0);
});
test('a last departure visits the switch, uses afterglow, then a return switches on before work',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  let sawOff=false,sawOn=false,sawAfterglow=false,sawDim=false,firstSwitchAt=Infinity;
  run(behavior,100,night,(state,t)=>{
    const actor=state.actors[0],light=state.lights[0];
    if(actor.activity==='switching'){
      firstSwitchAt=Math.min(firstSwitchAt,t);assert.equal(actor.moving,false);
      assert.ok(Math.hypot(actor.x-departmentLightStations.cafe.approach.x,actor.z-departmentLightStations.cafe.approach.z)<1e-6);
      sawOff ||= actor.lightAction==='off';sawOn ||= actor.lightAction==='on';
    }
    sawAfterglow ||= !light.on&&light.afterglow>0&&light.level===1;
    sawDim ||= light.level>0&&light.level<1;
    if(actor.duty==='working')assert.ok(light.on,'work only resumes with its light switched on');
  });
  assert.ok(sawOff&&sawOn&&sawAfterglow&&sawDim);assert.ok(firstSwitchAt<30);
});
test('a pause during a switch detour is idempotent, with no timer or route drift',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  for(let i=0;i<1000&&!behavior.getSnapshot().actors[0].visit;i++)behavior.advance(.05,night);
  const before=behavior.getSnapshot();assert.ok(before.actors[0].visit);
  for(let i=0;i<30;i++)behavior.advance(.1,night,{paused:true});
  assert.deepEqual(behavior.getSnapshot(),before);
  behavior.advance(0,night);assert.deepEqual(behavior.getSnapshot(),before);
});
test('reduced motion freezes routes and settles a partial fade immediately',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  for(let i=0;i<3000;i++){
    const state=behavior.advance(.05,night);
    if(state.lights[0].level>0&&state.lights[0].level<1)break;
  }
  const before=behavior.getSnapshot();assert.ok(before.lights[0].level>0&&before.lights[0].level<1);
  const after=behavior.advance(.1,night,{reduced:true});assert.deepEqual(positions(after),positions(before));assert.equal(after.lights[0].level,after.lights[0].on?1:0);
  const settled=behavior.getSnapshot();behavior.advance(.1,night,{reduced:true});assert.deepEqual(behavior.getSnapshot(),settled);
});
test('reduced motion settles pending afterglow without a rebound on resume',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  for(let i=0;i<3000&&behavior.getSnapshot().lights[0].afterglow===0;i++)behavior.advance(.05,night);
  assert.ok(behavior.getSnapshot().lights[0].afterglow>0);
  const settled=behavior.advance(0,night,{reduced:true});assert.equal(settled.lights[0].afterglow,0);assert.equal(settled.lights[0].level,0);
  assert.equal(behavior.advance(.05,night).lights[0].level,0);
});

test('daylight during a visit returns along the detour rather than teleporting',()=>{
  const behavior=createProgrammeNightBehavior([spec()]);
  for(let i=0;i<1000&&!behavior.getSnapshot().actors[0].visit;i++)behavior.advance(.05,night);
  run(behavior,.3);const before=positions(behavior.getSnapshot());
  const atDawn=behavior.advance(0,day,{paused:true});assert.deepEqual(positions(atDawn),before);assert.equal(atDawn.actors[0].visit.phase,'back');
  let previous=atDawn.actors[0];
  run(behavior,5,day,state=>{const current=state.actors[0];assert.ok(Math.hypot(current.x-previous.x,current.z-previous.z)<=.101);previous={...current};assert.ok(state.lights.every(l=>l.level===0));});
});
test('occupancy and shared switching do not depend on actor iteration order',()=>{
  const specs=[spec('cafe-planner','cafe',.1),spec('cafe-measurer','cafe',14)];
  const a=createProgrammeNightBehavior(specs),b=createProgrammeNightBehavior([...specs].reverse());
  for(let i=0;i<2000;i++){
    const aa=a.advance(.05,night),bb=b.advance(.05,night);
    assert.equal(aa.lights[0].on,bb.lights[0].on);assert.equal(aa.lights[0].occupants,bb.lights[0].occupants);
  }
});
