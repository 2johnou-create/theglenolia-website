import test from 'node:test';
import assert from 'node:assert/strict';
import {plantLearning} from '../plant-learning.mjs';
import {STAGE_NAMES} from '../../public/assets/plant-portal/stages.js';
import {withdrawalReleaseAt} from '../nsw-working-days.mjs';

test('every field stage has sourced guidance and a distinct class observation prompt', () => {
  assert.deepEqual(plantLearning.stages.map(item=>item.name), STAGE_NAMES);
  assert.equal(plantLearning.source.authors,'David Peasley and Jos Webber');
  assert.match(plantLearning.source.url,/^https:\/\/agrifutures\.com\.au\//);
  assert.equal(new Set(plantLearning.stages.map(item=>item.question)).size,10);
  for (const [index,stage] of plantLearning.stages.entries()) {
    assert.equal(stage.stage,index+1);
    for (const key of ['name','lookFor','next','primary','secondary','question','pages']) {
      assert.equal(typeof stage[key],'string');
      assert.ok(stage[key].length>5,key);
    }
    assert.match(stage.pages,/pp\. \d+\.\d+/);
  }
});

const windows = [
  ['ordinary Friday', '2026-11-20T16:42:13.874+11:00','2026-11-27T05:42:13.874Z'],
  ['Saturday request skips the weekend', '2026-11-21T08:00:00+11:00','2026-11-26T21:00:00.000Z'],
  ['local date differs from UTC date', '2026-11-22T14:00:00Z','2026-11-29T14:00:00.000Z'],
  ['Christmas, substitute Boxing Day, New Year', '2026-12-23T18:00:00+11:00','2027-01-04T07:00:00.000Z'],
  ['Australia Day', '2027-01-22T09:30:00+11:00','2027-01-31T22:30:00.000Z'],
  ['Easter weekend and daylight saving end', '2026-04-01T03:30:00+11:00','2026-04-09T17:30:00.000Z'],
  ['additional Anzac Day in NSW', '2026-04-24T09:00:00+10:00','2026-05-03T23:00:00.000Z'],
  ['additional Anzac Day in 2027', '2027-04-23T09:00:00+10:00','2027-05-02T23:00:00.000Z'],
  ['bank holiday is a farm working day', '2026-07-31T11:00:00+10:00','2026-08-07T01:00:00.000Z'],
  ['daylight saving begins and Labour Day', '2026-10-02T02:30:00+10:00','2026-10-11T15:30:00.000Z'],
  ['Christmas/Boxing Day 2027 both have substitute weekdays','2027-12-20T15:00:00+11:00','2027-12-29T04:00:00.000Z']
];
for(const [label,input,expected] of windows) test('withdrawal deadline: '+label,()=>assert.equal(withdrawalReleaseAt(input),expected));

test('ambiguous or invalid timestamp cannot cause early release',()=>{
  for (const input of ['2026-11-20','bad',null]) {
    assert.throws(()=>withdrawalReleaseAt(input),RangeError);
  }
});

test('2028 follows statutory Easter, Australia Day, and a weekend New Year across years',()=>{
  assert.equal(withdrawalReleaseAt('2027-12-31T11:00:00+11:00'),'2028-01-10T00:00:00.000Z');
  assert.equal(withdrawalReleaseAt('2028-01-24T11:00:00+11:00'),'2028-02-01T00:00:00.000Z');
  assert.equal(withdrawalReleaseAt('2028-04-13T11:00:00+10:00'),'2028-04-24T01:00:00.000Z');
});

test('every 2026 and 2027 start agrees with the published statewide calendars',()=>{
  const fixed = new Set([
    '2026-01-01','2026-01-26','2026-04-03','2026-04-06','2026-04-27','2026-06-08','2026-10-05','2026-12-25','2026-12-28',
    '2027-01-01','2027-01-26','2027-03-26','2027-03-29','2027-04-26','2027-06-14','2027-10-04','2027-12-27','2027-12-28','2028-01-03'
  ]);
  const DAY = 86400000;
  const dateKey = ms=>new Date(ms).toISOString().slice(0,10);
  // Noon UTC falls on the same civil date at Glenorie throughout both years.
  for (let start=Date.UTC(2026,0,1,12); start<=Date.UTC(2027,11,31,12); start+=DAY) {
    let cursor = start;
    let count = 0;
    while(count<5) {
      cursor+=DAY;
      const weekday=new Date(cursor).getUTCDay();
      if (weekday!==0 && weekday!==6 && !fixed.has(dateKey(cursor))) count++;
    }
    assert.equal(withdrawalReleaseAt(start).slice(0,10),dateKey(cursor),dateKey(start));
  }
});
