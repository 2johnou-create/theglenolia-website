import test from 'node:test';
import assert from 'node:assert/strict';
import {GLENORIE,sydneyState,moonPhasePath} from './programme-time.js';

const state=(time,locale='en-AU')=>sydneyState(new Date(time),locale);
test('fixed Glenorie town coordinates are used without visitor geolocation',()=>{
  assert.deepEqual(GLENORIE,{latitude:-33.60,longitude:151.01});
});

test('summer Sydney daytime/night-time use AEDT independently of UTC calendar date',()=>{
  const noon=state('2026-01-15T01:00:00Z');
  assert.equal(noon.hour,12);assert.equal(noon.isDay,true);
  const evening=state('2026-01-15T11:00:00Z');
  assert.equal(evening.hour,22);assert.equal(evening.isDay,false);
  const beforeDawn=state('2026-01-14T16:00:00Z');
  assert.equal(beforeDawn.hour,3);assert.equal(beforeDawn.isDay,false);
  assert.match(beforeDawn.formatted,/15 Jan 2026/);
});

test('winter Sydney daytime/night-time use AEST, with late afternoon already dark',()=>{
  const noon=state('2026-06-15T02:00:00Z');
  assert.equal(noon.hour,12);assert.equal(noon.isDay,true);
  const evening=state('2026-06-15T10:00:00Z');
  assert.equal(evening.hour,20);assert.equal(evening.isDay,false);
  const sunsetPassed=state('2026-06-15T07:30:00Z');
  assert.equal(sunsetPassed.hour,17);assert.equal(sunsetPassed.isDay,false);
});

test('the October 2026 daylight-saving jump skips 02:00 without changing the night scene',()=>{
  const before=state('2026-10-03T15:59:59Z'),after=state('2026-10-03T16:00:00Z');
  assert.equal(before.hour,1);assert.equal(after.hour,3);
  assert.equal(before.isDay,false);assert.equal(after.isDay,false);
  assert.match(before.formatted,/01:59:59/);assert.match(after.formatted,/03:00:00/);
  assert.equal(new Date(after.iso)-new Date(before.iso),1000);
});

test('the April 2026 daylight-saving return repeats the local 02 hour while absolute time advances',()=>{
  const before=state('2026-04-04T15:59:59Z'),after=state('2026-04-04T16:00:00Z');
  assert.equal(before.hour,2);assert.equal(after.hour,2);
  assert.equal(before.isDay,false);assert.equal(after.isDay,false);
  assert.match(before.formatted,/02:59:59/);assert.match(after.formatted,/02:00:00/);
  assert.equal(new Date(after.iso)-new Date(before.iso),1000);
});

test('English, Traditional Chinese and Japanese show the same instant/day scene with readable localized clocks',()=>{
  const time='2026-10-17T01:05:09Z';
  for(const locale of ['en-AU','zh-Hant','ja']){
    const result=state(time,locale);
    assert.equal(result.hour,12);assert.equal(result.isDay,true);assert.equal(result.iso,'2026-10-17T01:05:09.000Z');
    assert.match(result.formatted,/12:05:09/);assert.ok(result.formatted.includes('2026'));
    assert.equal(result.formatted.includes('Invalid'),false);
  }
});

test('visitor/device timezone cannot shift the Sydney scene clock',()=>{
  const previous=process.env.TZ;
  try {
    process.env.TZ='America/Los_Angeles';
    assert.equal(state('2026-01-15T01:00:00Z').hour,12);
    assert.equal(state('2026-01-15T01:00:00Z').isDay,true);
    process.env.TZ='Asia/Tokyo';
    assert.equal(state('2026-06-15T10:00:00Z').hour,20);
    assert.equal(state('2026-06-15T10:00:00Z').isDay,false);
  } finally {if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
});

test('an invalid clock instant fails visibly rather than returning a misleading day/night state',()=>{
  assert.throws(()=>sydneyState(new Date('invalid')));
});

test('analogue hands show Sydney time with the hour and minute hands between markers',()=>{
  const result=state('2026-10-17T01:05:09Z');
  assert.equal(result.minute,5);assert.equal(result.second,9);
  assert.ok(Math.abs(result.angles.hour-2.575)<1e-9);
  assert.ok(Math.abs(result.angles.minute-30.9)<1e-9);
  assert.equal(result.angles.second,54);
  for(const instant of ['2026-10-16T13:00:00Z','2026-10-17T01:00:00Z'])assert.equal(state(instant).angles.hour,0);
  const end=state('2026-10-17T12:59:59Z');
  assert.ok(end.angles.hour>359.99&&end.angles.hour<360);
  assert.equal(end.angles.minute,359.9);assert.equal(end.angles.second,354);
});

test('dial hands follow both Sydney daylight-saving transitions without a device-time offset',()=>{
  const forward=state('2026-10-03T16:00:00Z'),backward=state('2026-04-04T16:00:00Z');
  assert.deepEqual(forward.angles,{hour:90,minute:0,second:0});
  assert.deepEqual(backward.angles,{hour:60,minute:0,second:0});
  for(const locale of ['en-AU','zh-Hant','ja'])assert.deepEqual(state('2026-10-17T01:05:09Z',locale).angles,{hour:2.575,minute:30.9,second:54});
});

test('sun and moon follow the Glenorie horizon even outside a simple daytime-hour range',()=>{
  const summer=state('2026-01-15T09:00:00Z'),winter=state('2026-06-15T07:00:00Z');
  assert.equal(summer.hour,20);assert.equal(summer.isDay,true);
  assert.equal(winter.hour,17);assert.equal(winter.isDay,false);
});

test('localized visible dates contain no digital time while accessible time remains precise',()=>{
  for(const locale of ['en-AU','zh-Hant','ja']){
    const result=state('2026-10-17T01:05:09Z',locale);
    assert.equal(result.dateLabel.includes(':'),false);
    assert.ok(result.dateLabel.includes('2026'));
    assert.match(result.formatted,/12:05:09/);
    assert.ok(result.moonPhase>=0&&result.moonPhase<1);
  }
});

test('moon phase paths cover new, quarter, full and waning phases without invalid SVG values',()=>{
  assert.equal(moonPhasePath(0),moonPhasePath(1));
  assert.notEqual(moonPhasePath(.25),moonPhasePath(.75));
  assert.notEqual(moonPhasePath(0),moonPhasePath(.5));
  for(const phase of [0,.00001,.24999,.25,.49999,.5,.50001,.75,.99999,1]){
    const path=moonPhasePath(phase);
    assert.match(path,/^M24 12 A12 12/);assert.ok(path.endsWith(' Z'));
    assert.doesNotMatch(path,/NaN|Infinity|undefined/);
  }
  assert.equal(moonPhasePath(NaN),'');
});
