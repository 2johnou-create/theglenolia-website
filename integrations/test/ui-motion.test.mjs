import test from 'node:test';
import assert from 'node:assert/strict';
import {entryPlan,markerFrames,createAnimator} from '../../src/ui-motion.js';

test('entrances are bounded for a large filtered result set',()=>{
  const plan=entryPlan(1000);
  assert.equal(plan.length,8);
  assert.ok(Math.max(...plan.map(step=>step.duration+step.delay))<=455);
});
test('the active marker maps current visual bounds into the new box',()=>{
  assert.deepEqual(markerFrames({x:10,y:80,width:100,height:40},{x:150,y:20,width:200,height:40}),[
    {transform:'translate(10px, 80px) scale(0.5, 1)'},
    {transform:'translate(150px, 20px) scale(1, 1)'}
  ]);
  assert.equal(markerFrames({}, {width:0,height:40}),null);
});
function element(){
  const animations=[];
  return {animations,animate(frames,timing){let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no;});const animation={frames,timing,finished,cancelled:false,cancel(){this.cancelled=true;reject(new Error('cancelled'));},resolve};animations.push(animation);return animation;},getClientRects(){return [{}];}};
}
test('retargeting cancels the old motion and keeps only the latest owner',async()=>{
  const el=element(),motion=createAnimator(()=>true);
  const first=motion.animate(el,[],{duration:300});
  const latest=motion.animate(el,[],{duration:100});
  assert.equal(first.cancelled,true);assert.equal(latest.cancelled,false);assert.equal(motion.size,1);
  await Promise.resolve();assert.equal(motion.size,1);
  latest.resolve();await Promise.resolve();assert.equal(motion.size,0);
});
test('reduced motion and preference changes leave immediate final content',()=>{
  let allow=false;const el=element(),motion=createAnimator(()=>allow);
  motion.enter([el]);assert.equal(el.animations.length,0);
  allow=true;motion.enter([el]);assert.equal(motion.size,1);
  allow=false;motion.settle();assert.equal(el.animations[0].cancelled,true);assert.equal(motion.size,0);
  assert.equal(el.animations[0].timing.fill,'none');
});
