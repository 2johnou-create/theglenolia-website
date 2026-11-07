import test from 'node:test';
import assert from 'node:assert/strict';
import {createScenePlayback} from './scene-playback.js';
test('selecting weather resumes a manual pause instead of leaving a static active game',()=>{
  const p=createScenePlayback();assert.equal(p.paused,false);p.pause(true);assert.equal(p.paused,true);assert.equal(p.reason,'manual');
  p.requestAnimation();assert.equal(p.paused,false);assert.equal(p.reason,'playing');
  p.pause(true);assert.equal(p.paused,true);p.pause(false);assert.equal(p.paused,false);
});
test('reduced motion stays the default but explicit scene play is available without changing the preference',()=>{
  let preference=true;const p=createScenePlayback(()=>preference);assert.equal(p.paused,true);assert.equal(p.reason,'reduced');
  p.requestAnimation();assert.equal(p.paused,true,'weather alone must not bypass the preference');
  p.pause(false);assert.equal(p.paused,false);assert.equal(p.reduced,false);assert.equal(preference,true);
  p.requestAnimation();assert.equal(p.paused,false,'new tool retains the visitor’s explicit scene play');
  p.preferenceChanged();assert.equal(p.paused,true);assert.equal(p.reduced,true);
  preference=false;p.preferenceChanged();assert.equal(p.paused,false);
});
test('manual pause remains effective after an explicit reduced-motion play override',()=>{
  const p=createScenePlayback(()=>true);p.pause(false);assert.equal(p.paused,false);p.pause(true);assert.equal(p.paused,true);assert.equal(p.reason,'manual');
  p.requestAnimation();assert.equal(p.paused,true);assert.equal(p.reason,'reduced');
});
