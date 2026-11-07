import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWeatherGame,createWeatherGameState,weatherGameTools} from './weather-game.js';

const empty={active:false,wind:0,rain:0,snow:0,flood:0,panic:0,lightning:0,cloud:0,elapsed:0,tool:null,target:{x:0,z:0},pour:0};
function bounded(s){
  for(const key of ['wind','rain','snow','flood','panic','lightning','cloud','elapsed','pour'])assert.ok(Number.isFinite(s[key])&&s[key]>=0,key);
  assert.ok(s.wind<=90&&s.rain<=24);
  for(const key of ['snow','flood','panic','lightning','cloud','pour'])assert.ok(s[key]<=1,key);
  assert.ok(Math.abs(s.target.x)<=12.5&&Math.abs(s.target.z)<=9.5);
}
function advance(game,seconds,options={}){for(let i=0;i<seconds*20;i++)game.update(.05,options);return game.getState();}

test('weather play is inactive by default and cannot activate through a real-time tick',()=>{
  const game=createWeatherGameState();assert.deepEqual(game.getState(),empty);
  for(let i=0;i<100;i++)assert.deepEqual(game.update(.1),empty);
  for(const tool of ['','rain','__proto__',undefined,{},'constructor'])assert.equal(game.trigger(tool),false);
  assert.deepEqual(game.getState(),empty);
});
test('each distinct tool takes effect immediately and repeated drops remain bounded',()=>{
  const game=createWeatherGameState();
  for(const tool of weatherGameTools){
    game.reset();const first=game.trigger(tool,{x:123,z:-123});
    assert.equal(first.tool,tool);assert.equal(first.active,true);bounded(first);
    if(tool==='bucket')assert.equal(first.pour,1);
    if(tool==='storm')assert.equal(first.rain,24);
    if(tool==='blizzard')assert.equal(first.snow,1);
    if(tool==='wind')assert.equal(first.rain,0);
    for(let i=0;i<200;i++){bounded(game.trigger(tool));bounded(game.update(.05));}
  }
});
test('pause freezes accumulated water, timer and storm; reduced motion removes the gentle bolt',()=>{
  const game=createWeatherGameState();game.trigger('storm');advance(game,4.9);
  const before=game.getState();assert.ok(before.lightning>0);
  for(let i=0;i<50;i++)assert.deepEqual(game.update(.1,{paused:true}),before);
  const still=game.update(.1,{reducedMotion:true});assert.equal(still.lightning,0);
  assert.equal(still.elapsed,before.elapsed);assert.equal(still.flood,before.flood);
  for(let i=0;i<50;i++)assert.deepEqual(game.update(.1,{reducedMotion:true}),still);
});
test('all weather recovers naturally and explicit reset exactly restores a clean world',()=>{
  const game=createWeatherGameState();
  for(const tool of weatherGameTools){
    game.trigger(tool);advance(game,90);assert.deepEqual(game.getState(),empty,tool);
    game.trigger(tool);advance(game,2);assert.deepEqual(game.reset(),empty);
    assert.deepEqual(game.reset(),empty);assert.deepEqual(game.update(.05),empty);
  }
});
test('people keep reacting to accumulated flooding until it drains, then the toy fully recovers',()=>{
  const game=createWeatherGameState();game.trigger('storm');
  let sawDrainingFlood=false;
  for(let i=0;i<1800;i++){
    const state=game.update(.05);
    if(state.elapsed>24&&state.flood>.15){sawDrainingFlood=true;assert.ok(state.panic>=state.flood*.8);}
  }
  assert.equal(sawDrainingFlood,true);assert.deepEqual(game.getState(),empty);
});
test('state snapshots are isolated and malformed elapsed/target inputs cannot corrupt the toy',()=>{
  const game=createWeatherGameState();game.trigger('bucket',{x:NaN,z:Infinity});
  const snapshot=game.getState();snapshot.target.x=999;snapshot.flood=999;
  assert.deepEqual(game.getState().target,{x:0,z:0});assert.equal(game.getState().flood,.31);
  const before=game.getState();for(const dt of [NaN,Infinity,-1])assert.deepEqual(game.update(dt),before);
  game.update(100000);assert.equal(game.getState().elapsed,.1);bounded(game.getState());
});
test('seeded storm evolution is deterministic and the lightning never strobes',()=>{
  const a=createWeatherGameState({seed:12}),b=createWeatherGameState({seed:12});a.trigger('storm');b.trigger('storm');
  let starts=0,wasLit=false,lastStart=-100;
  for(let i=0;i<1000;i++){
    const x=a.update(.05),y=b.update(.05);assert.deepEqual(x,y);bounded(x);
    const lit=x.lightning>.001;if(lit&&!wasLit){starts++;assert.ok(i*.05-lastStart>7);lastStart=i*.05;}wasLit=lit;
  }
  assert.ok(starts>=1&&starts<=4);
});
test('effect geometry stays finite, bounded and fixed in size through every tool and reset',()=>{
  const effect=createWeatherGame({seed:12});assert.equal(effect.root.visible,false);
  let renderables=0,vertices=0;
  effect.root.traverse(object=>{if(object.geometry){renderables++;vertices+=object.geometry.attributes.position.count;}});
  assert.ok(renderables<=20,renderables);assert.ok(vertices<15000,vertices);
  for(const tool of weatherGameTools){
    effect.trigger(tool,{x:12,z:-9});
    for(let i=0;i<25;i++)effect.update(.1);
    effect.root.updateMatrixWorld(true);
    effect.root.traverse(object=>{
      for(const value of object.matrixWorld.elements)assert.ok(Number.isFinite(value));
      for(const attr of Object.values(object.geometry?.attributes||{}))for(const value of attr.array)assert.ok(Number.isFinite(value));
      if(object.instanceMatrix)for(const value of object.instanceMatrix.array)assert.ok(Number.isFinite(value));
    });
    const bounds=new THREE.Box3().setFromObject(effect.root);
    assert.ok(bounds.min.x>=-18&&bounds.max.x<=18);
    assert.ok(bounds.min.y>=-2.5&&bounds.max.y<=8);
    assert.ok(bounds.min.z>=-14&&bounds.max.z<=14);
    assert.deepEqual(effect.reset(),empty);assert.equal(effect.root.visible,false);
  }
  effect.dispose();effect.dispose();assert.equal(effect.root.children.length,0);assert.equal(effect.trigger('storm'),false);
});
test('orthographic snow remains pixel-sized and the gentle storm bolt is actual visible geometry',()=>{
  const effect=createWeatherGame();effect.trigger('blizzard');
  const snow=effect.root.getObjectByName('Play snow flurries');
  assert.equal(snow.material.sizeAttenuation,false);assert.ok(snow.material.size>=3);
  assert.equal(snow.visible,true);assert.equal(snow.geometry.drawRange.count,620);
  const shader={fragmentShader:'#include <clipping_planes_fragment>'};snow.material.onBeforeCompile(shader);
  assert.match(shader.fragmentShader,/gl_PointCoord/);
  effect.trigger('storm');
  assert.equal(effect.root.getObjectByName('Draggable heavy weather clouds').material.color.getHex(),0x58615c);
  const bolt=effect.root.getObjectByName('Slow illustrated lightning bolt');assert.equal(bolt.isMesh,true);assert.equal(bolt.geometry.type,'TubeGeometry');
  for(let i=0;i<98;i++)effect.update(.05);
  assert.equal(bolt.visible,true);assert.ok(bolt.material.opacity>.25&&bolt.material.opacity<=.92);
  effect.update(0,{reducedMotion:true});assert.equal(bolt.visible,false);
  effect.dispose();
});
