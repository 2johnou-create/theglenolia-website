import test from 'node:test';
import assert from 'node:assert/strict';
import {createCharacterTap,pickCharacter,wavePose,waveDuration,placeGreeting} from './programme-hello.js';

const pointer=(id,x,y,timeStamp,extra={})=>({pointerId:id,clientX:x,clientY:y,timeStamp,button:0,isPrimary:true,...extra});
const actor=(id,hitX,hitY,depth=0,extra={})=>({id,department:'cafe',hitX,hitY,depth,visible:true,...extra});
function freeze(value){
  if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}
  return value;
}
function inside(position,size){
  assert.ok(Number.isFinite(position.x)&&Number.isFinite(position.y));
  assert.ok(position.x>=12&&position.y>=12,'greeting must retain its canvas inset');
  assert.ok(position.x+size.bubbleWidth<=size.width-12,'greeting overflows right edge');
  assert.ok(position.y+size.bubbleHeight<=size.height-12,'greeting overflows bottom edge');
}
const overlaps=(position,size,clock)=>position.x<clock.right+8&&position.x+size.bubbleWidth>clock.left-8&&position.y<clock.bottom+8&&position.y+size.bubbleHeight>clock.top-8;

test('a primary tap returns client coordinates despite pointer capture or offset coordinates',()=>{
  const tap=createCharacterTap();
  const down=freeze(pointer(7,310,220,1000,{offsetX:2,offsetY:3}));
  const up=freeze(pointer(7,313,222,1120,{offsetX:999,offsetY:999}));
  tap.down(down);
  assert.deepEqual(tap.up(up),{x:313,y:222});
});

test('small finger jitter remains a tap',()=>{
  const tap=createCharacterTap();
  tap.down(pointer(1,100,100,0));tap.move(pointer(1,107,104,50));
  assert.deepEqual(tap.up(pointer(1,107,104,100)),{x:107,y:104});
});

test('a drag that returns to its starting point cannot become a greeting',()=>{
  const tap=createCharacterTap();
  tap.down(pointer(1,100,100,0));tap.move(pointer(1,100,111,40));tap.move(pointer(1,100,100,80));
  assert.equal(tap.up(pointer(1,100,100,100)),null);
});

test('an out-of-range release is rejected even if no move event was delivered',()=>{
  const tap=createCharacterTap();
  tap.down(pointer(1,0,0,0));assert.equal(tap.up(pointer(1,10,0,100)),null);
});

test('long presses and invalid elapsed time do not trigger a greeting',()=>{
  const tap=createCharacterTap();
  for(const elapsed of [651,2000,-1,NaN]){
    tap.down(pointer(1,10,20,1000));assert.equal(tap.up(pointer(1,10,20,1000+elapsed)),null);
  }
  tap.down(pointer(1,10,20,1000));assert.deepEqual(tap.up(pointer(1,10,20,1650)),{x:10,y:20});
});

test('right and middle mouse buttons are not taps',()=>{
  for(const button of [1,2]){
    const tap=createCharacterTap();tap.down(pointer(1,10,20,0,{button}));
    assert.equal(tap.up(pointer(1,10,20,100,{button})),null);
  }
});

test('a secondary touch cannot greet when the primary finger began outside the canvas',()=>{
  const tap=createCharacterTap();
  tap.down(pointer(2,100,100,0,{isPrimary:false}));
  assert.equal(tap.up(pointer(2,100,100,100,{isPrimary:false})),null);
});

test('multi-touch cancels the entire gesture in either release order',()=>{
  for(const releases of [[1,2],[2,1]]){
    const tap=createCharacterTap();
    tap.down(pointer(1,100,100,0));tap.down(pointer(2,150,100,10,{isPrimary:false}));
    for(const id of releases)assert.equal(tap.up(pointer(id,id===1?100:150,100,100,{isPrimary:id===1})),null);
    tap.down(pointer(3,90,80,200));assert.deepEqual(tap.up(pointer(3,90,80,300)),{x:90,y:80});
  }
});

test('pointercancel and explicit reset clear gestures without poisoning the next tap',()=>{
  const tap=createCharacterTap();
  tap.down(pointer(1,10,20,0));tap.cancel(pointer(1,10,20,50));assert.equal(tap.up(pointer(1,10,20,100)),null);
  tap.down(pointer(2,10,20,200));tap.reset();assert.equal(tap.up(pointer(2,10,20,300)),null);
  tap.down(pointer(3,30,40,400));assert.deepEqual(tap.up(pointer(3,30,40,500)),{x:30,y:40});
});

test('an unrelated pointer release cannot activate the pending primary tap',()=>{
  const tap=createCharacterTap();tap.down(pointer(1,10,20,0));
  assert.equal(tap.up(pointer(9,10,20,30)),null);assert.equal(tap.up(pointer(1,10,20,100)),null);
});

test('picking targets body coordinates in CSS pixels rather than the thought-bubble anchor',()=>{
  const person=actor('planner',120,180,.2,{x:120,y:110});
  assert.equal(pickCharacter([person],120,180),person);
  assert.equal(pickCharacter([person],120,110),null);
  assert.equal(pickCharacter([person],148,180),person);
  assert.equal(pickCharacter([person],148.01,180),null);
});

test('hidden and nonfinite projected actors cannot intercept another character',()=>{
  const valid=actor('visible',50,80,.6);
  const people=[actor('hidden',50,80,-.8,{visible:false}),actor('nan',NaN,80,-.9),actor('infinite',50,Infinity,-.9),valid];
  assert.equal(pickCharacter(people,50,80),valid);
  assert.equal(pickCharacter(people,NaN,80),null);
  assert.equal(pickCharacter([],50,80),null);
});

test('the nearest body target wins, with camera depth resolving an overlap tie',()=>{
  const distantCentre=actor('farther-on-screen',105,100,-.9),nearCentre=actor('closer-on-screen',101,100,.8);
  assert.equal(pickCharacter([distantCentre,nearCentre],100,100),nearCentre);
  const back=actor('back',95,100,.7),front=actor('front',105,100,.1);
  assert.equal(pickCharacter([back,front],100,100),front);
  assert.equal(pickCharacter([front,back],100,100),front);
});

test('picking does not reorder or mutate actor projections and metadata',()=>{
  const people=freeze([actor('second',120,180,.3,{route:{index:2},lighting:{duty:'away'}}),actor('first',100,180,.1)]);
  const before=JSON.stringify(people);
  assert.equal(pickCharacter(people,100,180)?.id,'first');
  assert.equal(JSON.stringify(people),before);
});

test('the wave starts and ends gently and expires instead of looping',()=>{
  assert.ok(waveDuration>0&&waveDuration<=3);
  assert.equal(wavePose(0).amount,0);
  assert.ok(wavePose(.3).amount>.95);
  assert.ok(wavePose(waveDuration-.001).amount<.0001);
  assert.equal(wavePose(waveDuration),null);assert.equal(wavePose(waveDuration+20),null);
});

test('wave poses remain finite and bounded throughout the whole greeting',()=>{
  for(let i=0;i<1000;i++){
    const pose=wavePose(waveDuration*i/1000);
    assert.ok(pose&&[pose.amount,pose.lift,pose.sway].every(Number.isFinite));
    assert.ok(pose.amount>=0&&pose.amount<=1);
    assert.ok(pose.lift>=-Math.PI&&pose.lift<=0);
    assert.ok(Math.abs(pose.sway)<=.6);
    assert.ok(pose.arm===0||pose.arm===1);
  }
  for(const invalid of [-1,NaN,Infinity,-Infinity])assert.equal(wavePose(invalid),null);
});

test('manual pause and reduced motion suppress waving at every stage',()=>{
  for(const elapsed of [0,.1,.5,waveDuration-.1]){
    assert.equal(wavePose(elapsed,{paused:true}),null);
    assert.equal(wavePose(elapsed,{reduced:true}),null);
    assert.equal(wavePose(elapsed,{paused:true,reduced:true}),null);
  }
});

test('greeting keeps the switching, watering and measuring hand free',()=>{
  for(const activity of ['switching','watering','measuring']){
    const pose=wavePose(.7,{activity});assert.equal(pose.arm,0);assert.ok(pose.sway<0);
  }
  for(const activity of ['planning','writing','walking','checking','resting','lunch','selecting']){
    const pose=wavePose(.7,{activity});assert.equal(pose.arm,1);assert.ok(pose.sway>0);
  }
});

test('wave presentation leaves the supplied actor and route metadata unchanged',()=>{
  const options=freeze({activity:'switching',paused:false,reduced:false,route:{index:1,wait:.7},lighting:{department:'cafe',occupants:2,reserved:'planner'}});
  const before=JSON.stringify(options);assert.equal(wavePose(.7,options).arm,0);
  assert.equal(JSON.stringify(options),before);
});

test('greetings stay inside mobile and desktop canvas bounds at every corner',()=>{
  for(const size of [{width:375,height:440,bubbleWidth:280,bubbleHeight:180},{width:960,height:600,bubbleWidth:320,bubbleHeight:190}]){
    for(const anchor of [{x:0,y:0},{x:size.width,y:0},{x:0,y:size.height},{x:size.width,y:size.height},null])inside(placeGreeting(anchor,size),size);
  }
});

test('a greeting is placed below the clock when there is enough vertical room',()=>{
  const clock={left:10,top:10,right:138,bottom:90},size={width:375,height:440,bubbleWidth:280,bubbleHeight:180,clock};
  const position=placeGreeting({x:60,y:100},size);inside(position,size);assert.equal(overlaps(position,size,clock),false);
});

test('a greeting uses available side space when a tall card cannot fit below the clock',()=>{
  const clock={left:12,top:12,right:152,bottom:108},size={width:600,height:300,bubbleWidth:180,bubbleHeight:220,clock};
  const position=placeGreeting({x:80,y:100},size);inside(position,size);assert.equal(overlaps(position,size,clock),false);
});

test('placement does not mutate a projected anchor, canvas measurements or clock bounds',()=>{
  const anchor=freeze({x:50,y:90}),size=freeze({width:375,height:440,bubbleWidth:280,bubbleHeight:180,clock:{left:10,top:10,right:138,bottom:90}});
  const before=JSON.stringify({anchor,size});placeGreeting(anchor,size);assert.equal(JSON.stringify({anchor,size}),before);
});
