import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {staffPlantRoutes} from '../plant-portal.mjs';
import {historicalSummary,normaliseDaily,publicPlantWeather,snapshotForUpdate} from '../plant-weather.mjs';

const knownTime=Date.parse('2026-11-20T22:20:00Z'); // Sat 21 Nov, 09:20 Sydney
const field={key:'r2-p2',row:2,position:2};
const day=86400000;
const address='https://glenolia-education.workers.dev/api/plants/weather';
function database(t) {
  const sql=new DatabaseSync(':memory:');
  t.after(()=>sql.close());
  sql.exec(readFileSync(new URL('../plant-weather-schema.sql',import.meta.url),'utf8'));
  return {sql,async batch(stmts){sql.exec('BEGIN');try{const results=[];for(const st of stmts)results.push(await st.run());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}},prepare(query){
    const stmt=sql.prepare(query);
    return {args:[],bind(...args){return {...this,args};},async run(){return {meta:{changes:Number(stmt.run(...this.args).changes)}};},async first(){return stmt.get(...this.args);},async all(){return {results:stmt.all(...this.args)};}};
  }};
}
const asDate=n=>new Date(n).toISOString().slice(0,10);
const asTs=s=>Date.parse(s+'T12:00:00Z');
function mockData(day,rain=1) {
  return {date:day,variables:[['daily_rain',rain],['min_temp',12],['max_temp',24]].map(([variable_code,value])=>({source:25,variable_code,value}))};
}
function envFor(t,failRequests=false) {
  const env={EDU_DB:database(t),calls:[],async WEATHER_FETCH(input,options){
    const u=new URL(input);env.calls.push({u,options});
    if(failRequests) return new Response(null,{status:503});
    if(u.host==='api.met.no')return Response.json({properties:{meta:{updated_at:new Date(knownTime-3e5).toISOString(),units:{air_temperature:'celsius',relative_humidity:'%',wind_speed:'m/s',precipitation_amount:'mm'}},
      timeseries:[{time:new Date(knownTime-20*6e4).toISOString(),data:{instant:{details:{air_temperature:22.9,relative_humidity:75,wind_speed:5}},next_1_hours:{details:{precipitation_amount:.2}}}}]}}
      ,{headers:{'Expires':new Date(knownTime+18e5).toUTCString()}});
    assert.equal(u.host,'www.longpaddock.qld.gov.au');
    const dateParam=k=>u.searchParams.get(k).replace(/^(....)(..)(..)$/,'$1-$2-$3');
    const start=asTs(dateParam('start')),end=asTs(dateParam('finish'));
    const data=[];
    for(let i=start;i<=end;i+=day)data.push(mockData(asDate(i),asDate(i)==='2026-11-20'?0:1));
    return Response.json({location:{latitude:-33.60,longitude:151.00},data});
  }};
  return env;
}
test('public Glenorie weather separates the next-hour forecast from real daily zero rain and previous 14 full days',async t=>{
  const env=envFor(t),req=new Request(address,{headers:{Origin:'https://theglenolia.com.au'}});
  const res=await publicPlantWeather(req,env,knownTime),v=await res.json();
  assert.equal(res.headers.get('Access-Control-Allow-Origin'),'https://theglenolia.com.au');
  assert.equal(v.current.humidityPct,75);assert.equal(v.current.windKmh,18);
  assert.equal(v.current.rainNextHourMm,.2);assert.equal(v.history.latestRainfallMm,0);
  assert.deepEqual([v.history.from,v.history.to,v.history.days],['2026-11-07','2026-11-20',14]);
  assert.equal(v.history.meanTemperatureC,18);assert.equal(v.history.meanRainfallMm,.93);
  const again=await publicPlantWeather(new Request(address,{headers:{Origin:'https://another.example'}}),env,knownTime+1000);
  assert.equal(again.headers.get('Access-Control-Allow-Origin'),null);
  assert.equal(env.calls.length,2);
  const query=env.calls.find(c=>c.u.host.includes('longpaddock')).u;
  assert.equal(query.searchParams.get('comment'),'RXN');
  assert.equal(query.searchParams.get('lon'),'151.00');
});

test('fortnight excludes climatological normals, does not fabricate missing days, and dates each available average',()=>{
  const start=asTs('2026-11-04'),end=asTs('2026-11-20');
  const data=[];
  for(let i=start;i<=end;i+=day)data.push(mockData(asDate(i),0));
  data.at(-1).variables.find(x=>x.variable_code==='max_temp').source=75;
  const grid={location:{latitude:-33.60,longitude:151.00},data};
  const good=normaliseDaily(grid,'2026-11-04','2026-11-20');
  const v=historicalSummary(good,'2026-11-20');
  assert.equal(v.meanTemperatureC,18);assert.equal(v.temperatureTo,'2026-11-19');
  assert.equal(v.meanRainfallMm,0);assert.equal(v.rainfallTo,'2026-11-20');
  const broken=historicalSummary(good.filter(d=>d.day!=='2026-11-10'),'2026-11-20');
  assert.equal(broken.meanTemperatureC,null);assert.equal(broken.meanRainfallMm,null);assert.equal(broken.days,13);
  assert.throws(()=>normaliseDaily({...grid,location:{latitude:10,longitude:10}},'2026-11-04','2026-11-20'));
  assert.throws(()=>normaliseDaily({...grid,data:[data[0],data[0]]},'2026-11-04','2026-11-20'));
});
test('submission snapshots fix location and timestamp; backdated observation uses its own daily interval and provider outage leaves explicit gaps',async t=>{
  const env=envFor(t),at=new Date(knownTime).toISOString();
  const record=JSON.parse(await snapshotForUpdate(env,field,'2026-09-16',at));
  assert.equal(record.loggedAt,at);assert.equal(record.timeZone,'Australia/Sydney');
  assert.deepEqual(record.location,{name:'The Glenolia, Glenorie',plantKey:'r2-p2',row:2,position:2});
  assert.equal(record.observedDay.day,'2026-09-16');assert.equal(record.observedDay.rainfallMm,1);
  assert.equal(record.rainfall.day,'2026-11-20');assert.equal(record.rainfall.mm,0);
  assert.equal(record.current.humidityPct,75);assert.equal(env.calls.length,3);
  // This site's "field location" never sends a staff/member coordinate nor personal data to a provider.
  assert.ok(env.calls.every(c=>!c.u.href.includes('r2-p2')));
  const empty=envFor(t,true);
  const gap=JSON.parse(await snapshotForUpdate(empty,field,'2026-11-21',at));
  assert.equal(gap.current,null);assert.equal(gap.rainfall,null);assert.equal(gap.observedDay,null);assert.equal(gap.location.plantKey,field.key);
  await publicPlantWeather(new Request(address),empty,knownTime+500);
  assert.equal(empty.calls.length,2);
});

test('retrying a farmer post freezes its first time, plot and weather atomically; a legacy note retains its missing weather',async t=>{
  const env=envFor(t),db=env.EDU_DB,reqId=crypto.randomUUID();
  db.sql.exec(`CREATE TABLE edu_coffee_plantings(id TEXT,plant_key TEXT,ended_at TEXT);
  CREATE TABLE edu_plants(plant_key TEXT PRIMARY KEY);
  CREATE TABLE edu_plant_updates(id TEXT PRIMARY KEY,plant_key TEXT,observed_on TEXT,note TEXT,created_at TEXT,
    photo_mime TEXT,photo_bytes BLOB,request_hash TEXT,posted_by TEXT,withdrawn_by TEXT,withdrawn_at TEXT,withdrawn INTEGER DEFAULT 0,planting_id TEXT);
  INSERT INTO edu_plants VALUES('r2-p2');
  INSERT INTO edu_plant_updates(id,plant_key,observed_on,note,created_at) VALUES('legacy','r2-p2','2026-01-01','Original note','2026-01-01T01:12:00Z')`);
  const action=(path,method,body)=>staffPlantRoutes(new Request(address+'?key=r2-p2',{method,headers:{'X-Glenolia-Plant-Role':'farmer'}}),env,'/plants/'+path,body);
  const body={key:'r2-p2',observedOn:'2026-01-02',note:'An original field observation',requestId:reqId};
  assert.equal((await action('update','POST',body)).status,200);
  const first=db.sql.prepare('SELECT payload FROM edu_plant_weather_logs WHERE update_id=?').get(reqId).payload;
  const calls=env.calls.length;
  assert.equal((await action('update','POST',body)).status,200);
  assert.equal(env.calls.length,calls);
  assert.equal(db.sql.prepare('SELECT COUNT(*) AS n FROM edu_plant_weather_logs').get().n,1);
  assert.equal(db.sql.prepare('SELECT payload FROM edu_plant_weather_logs WHERE update_id=?').get(reqId).payload,first);
  const journal=await (await action('journal','GET',null)).json();
  assert.equal(journal.updates[0].weather.loggedAt,journal.updates[0].createdAt);
  assert.equal(journal.updates[0].weather.location.plantKey,'r2-p2');
  assert.equal(journal.updates[0].weather.observedDay.day,body.observedOn);
  assert.equal(journal.updates[1].weather,null);
  assert.equal((await action('withdraw-update','POST',{updateId:reqId})).status,200);
  assert.equal((await (await action('journal','GET',null)).json()).updates.length,1);
  assert.equal(db.sql.prepare('SELECT payload FROM edu_plant_weather_logs WHERE update_id=?').get(reqId).payload,first);
});
