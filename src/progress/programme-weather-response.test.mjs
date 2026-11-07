import test from 'node:test';
import assert from 'node:assert/strict';
import {effectiveProgrammeWeather,createWeatherEvacuation} from './programme-weather-response.js';
test('play overlays wind and rain without changing actual clock or live weather source',()=>{
  const real={hour:22,isDay:false,wind:8,rain:0,cloud:.3,weatherCode:0};const original=structuredClone(real);
  const merged=effectiveProgrammeWeather(real,{active:true,wind:90,rain:24,snow:0});
  assert.deepEqual(real,original);assert.equal(merged.hour,22);assert.equal(merged.isDay,false);assert.equal(merged.wind,90);assert.equal(merged.rain,24);
  assert.deepEqual(effectiveProgrammeWeather(real,{active:false,wind:90,rain:24}),real);
});
test('staff run only on their existing paths, freeze when paused and restore their normal routine',()=>{
  const spec=[{id:'grower',route:[{x:0,z:0},{x:2,z:0},{x:2,z:2},{x:0,z:2}]}];
  const normal=[{x:0,z:0,index:0,face:0,activity:'watering',moving:false,seated:false}];const original=structuredClone(normal);
  const evac=createWeatherEvacuation(spec),game={active:true,panic:1,flood:1};let result;
  for(let i=0;i<300;i++){result=evac.update(normal,game,.1);const {x,z}=result[0];assert(x>=0&&x<=2&&z>=0&&z<=2);assert(x===0||x===2||z===0||z===2);assert(Number.isFinite(result[0].face));}
  const frozen=evac.update(normal,game,.1,{paused:true});assert.deepEqual(evac.update(normal,game,.1,{paused:true}),frozen);assert.equal(frozen[0].activity,'running-for-cover');assert.equal(frozen[0].y,.98);
  assert.deepEqual(normal,original);assert.deepEqual(evac.update(normal,{active:false},.1),normal.map(s=>({...s,emergency:false})));
  const restarted=evac.update(normal,game,0);assert.equal(restarted[0].x,0);assert.equal(restarted[0].z,0);
});
test('invalid or stalled deltas cannot fling staff off the path',()=>{
  const e=createWeatherEvacuation([{id:'a',route:[{x:0,z:0},{x:1,z:0}]}]),normal=[{x:0,z:0,index:0,face:0}];
  for(const dt of [NaN,Infinity,-100,1e9]){const [s]=e.update(normal,{active:true,panic:.8},dt);assert(s.x>=0&&s.x<=1);assert.equal(s.z,0);}
  e.reset();assert.equal(e.update(normal,{active:true,panic:1},0)[0].x,0);
});
