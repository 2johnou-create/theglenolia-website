import test from 'node:test';
import assert from 'node:assert/strict';
import {GLENORIE,sydneyState} from './programme-time.js';

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
