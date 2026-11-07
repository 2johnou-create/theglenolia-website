import test from 'node:test';
import assert from 'node:assert/strict';
import {weatherDropPoint} from './weather-game-ui.js';

test('dropping at the scene centre and corners produces bounded canvas coordinates',()=>{
  const rect={left:50,top:200,width:360,height:440};
  assert.deepEqual(weatherDropPoint(rect,230,420),{u:.5,v:.5});
  assert.deepEqual(weatherDropPoint(rect,50,200),{u:0,v:0});
  assert.deepEqual(weatherDropPoint(rect,410,640),{u:1,v:1});
});

test('a drag released over the toolbar or beyond the scene does not create weather',()=>{
  const rect={left:50,top:200,width:360,height:440};
  for(const [x,y] of [[49,420],[411,420],[230,199],[230,641]])assert.equal(weatherDropPoint(rect,x,y),null);
});

test('hidden or invalid scene dimensions cannot generate an accidental drop',()=>{
  for(const rect of [null,{left:0,top:0,width:0,height:440},{left:0,top:0,width:360,height:-1},{left:NaN,top:0,width:360,height:440}]){
    assert.equal(weatherDropPoint(rect,100,100),null);
  }
  assert.equal(weatherDropPoint({left:0,top:0,width:360,height:440},Infinity,100),null);
});

test('drop coordinates account for a scrolled scene and different phone/tablet widths',()=>{
  for(const width of [290,345,720,1132]){
    const rect={left:14,top:-80,width,height:445};
    const point=weatherDropPoint(rect,14+width*.75,142.5);
    assert.deepEqual(point,{u:.75,v:.5});
  }
});
