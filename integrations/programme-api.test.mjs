import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import seed from '../programme-content.json' with {type:'json'};
import {handleAdmin} from './admin-worker.mjs';
import {handleRequest} from './newsletter-worker.mjs';
import {handlePublicProgramme} from './programme-public.mjs';
import {normaliseForecast,getWeather} from './programme-weather.mjs';

const owner='john@theglenolia.com.au';
const access={access:{aud:'programme-test-audience',getIdentity:async()=>({email:owner})}};
const millis=Date.parse('2026-10-17T00:37:00Z');
const iso=time=>new Date(time).toISOString();
function database() {
  const sqlite=new DatabaseSync(':memory:');
  const migrations=readdirSync(new URL('./migrations/',import.meta.url)).filter(name=>/^00[3456]-.*\.sql$/.test(name)).sort();
  for(const file of ['admin-schema.sql',...migrations.map(name=>'migrations/'+name)])sqlite.exec(readFileSync(new URL('./'+file,import.meta.url),'utf8'));
  // Public baseline references are real IDs, but the isolated DB uses tiny
  // synthetic image bytes instead of importing website marketing photography.
  const picture=Uint8Array.from(Buffer.from('UklGRh4AAABXRUJQVlA4TBEAAAAvAYAAAAdQwqb1rf+BiOh/AAA=','base64'));
  const media=sqlite.prepare('INSERT INTO programme_media (image_id,department,mime,width,height,byte_length,sha256,bytes,created_at,created_by,first_published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  for(const [department,value]of Object.entries(seed.initial.departments))for(const image of value.snapshots||[])media.run(image.imageId,department,'image/webp',2,3,picture.length,'a'.repeat(64),picture,'2026-10-20T00:00:00Z',owner,'2026-10-20T00:00:00Z');
  const queries=[];
  const db={prepare(sql){queries.push(sql);const statement=sqlite.prepare(sql);let values=[];return {bind(...args){values=args;return this;},async first(){return statement.get(...values)||null;},async all(){return {results:statement.all(...values)};},async run(){return this._run();},_run(){return {meta:{changes:Number(statement.run(...values).changes)}};}};},async batch(statements){sqlite.exec('BEGIN IMMEDIATE');try{const result=statements.map(s=>s._run());sqlite.exec('COMMIT');return result;}catch(error){sqlite.exec('ROLLBACK');throw error;}}};
  return {db,sqlite,queries};
}
function fakeAI(onRun){return {async run(model,options){const input=JSON.parse(options.messages.find(message=>message.role==='user').content);assert.ok(Array.isArray(input.entries));onRun?.(model,input);return {response:{entries:input.entries.map(({id,text})=>({id,zh:'備註：'+text,ja:'内容：'+text}))}};}};}
const adminEnv=db=>({DB:db,AI:fakeAI(),ACCESS_AUD:'programme-test-audience',ADMIN_EMAIL:owner});
function adminRequest(path='/api/programme',{method='GET',body,origin='https://admin.example',headers={}}={}) {
  return new Request('https://admin.example'+path,{method,headers:{...(method==='POST'?{'Content-Type':'application/json',Origin:origin}:{}),...headers},body:body===undefined?undefined:typeof body==='string'?body:JSON.stringify(body)});
}
const publicRequest=(path='/public/programme',method='GET',body)=>new Request('https://api.example'+path,{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
const save=(env,programme,revision=0)=>handleAdmin(adminRequest('/api/programme/save',{method:'POST',body:{programme,expectedRevision:revision}}),env,access);
const publish=(env,revision)=>handleAdmin(adminRequest('/api/programme/publish',{method:'POST',body:{expectedRevision:revision}}),env,access);
function forecast(now=millis) {
  const row=time=>({time:iso(time),data:{instant:{details:{air_temperature:21.26,wind_speed:5,wind_from_direction:270,cloud_area_fraction:72}},next_1_hours:{summary:{symbol_code:'lightrainshowers_day'},details:{precipitation_amount:1.2}}}});
  return {type:'Feature',geometry:{type:'Point',coordinates:[151.01,-33.60,100]},properties:{meta:{updated_at:iso(now-15*60000),units:{air_temperature:'celsius',wind_speed:'m/s',wind_from_direction:'degrees',cloud_area_fraction:'%',precipitation_amount:'mm'}},timeseries:[row(now-4*3600000),row(now-3600000),row(now-10*60000),row(now+3600000)]}};
}
function provider(data=forecast(),now=millis,{status=200,expires=now+30*60000,modified=iso(now-15*60000),headers={}}={}) {
  return new Response(status===304?null:JSON.stringify(data),{status,headers:{'Content-Type':'application/json',Expires:new Date(expires).toUTCString(),'Last-Modified':new Date(modified).toUTCString(),...headers}});
}
function cached(sqlite,body,{fetchedAt=millis,expiresAt=millis-1,refreshUntil=0,modified=iso(millis-15*60000)}={}) {
  sqlite.prepare('INSERT OR REPLACE INTO programme_weather (id,payload,expires_at,modified,fetched_at,refresh_until) VALUES (1,?,?,?,?,?)').run(JSON.stringify(body),expiresAt,modified,fetchedAt,refreshUntil);
}

test('anonymous, forged-header, wrong audience and non-owner requests cannot read or change programme admin',async()=>{
  const {db,sqlite}=database(),env=adminEnv(db);
  for(const path of ['/api/programme','/api/programme/save','/api/programme/publish','/api/programme/preview-translations']){
    for(const method of ['GET','POST']){
      const request=()=>adminRequest(path,{method,...(method==='POST'?{body:{programme:seed.initial,expectedRevision:0}}:{}),headers:{'Cf-Access-Authenticated-User-Email':owner,'Cf-Access-Jwt-Assertion':'forged'}});
      for(const ctx of [{},{access:{...access.access,aud:'wrong-app'}},{access:{...access.access,getIdentity:async()=>({email:'someone@example.com'})}},{access:{...access.access,getIdentity:async()=>{throw Error('not authenticated');}}}]){
        assert.equal((await handleAdmin(request(),env,ctx)).status,403);
      }
    }
  }
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
});

test('missing or malformed owner email configuration and Access identities fail closed',async()=>{
  const {db,queries}=database();
  for(const [configuredOwner,identity] of [[undefined,{}],['',{email:''}],['  ',{email:'  '}],[null,{email:null}],[123,{email:123}],[owner,{}],[owner,{email:''}],[owner,{email:42}]]){
    const env={...adminEnv(db),ADMIN_EMAIL:configuredOwner};
    const ctx={access:{...access.access,getIdentity:async()=>identity}};
    const response=await handleAdmin(adminRequest(),env,ctx);
    assert.equal(response.status,403);assert.equal((await response.json()).error,'owner_required');
  }
  assert.equal(queries.length,0);
});

test('authenticated cross-origin and missing-origin writes are denied before touching programme storage',async()=>{
  const {db,sqlite}=database(),env=adminEnv(db);
  for(const origin of ['https://foreign.example','null','']){
    const response=await handleAdmin(adminRequest('/api/programme/save',{method:'POST',origin,body:{programme:seed.initial,expectedRevision:0}}),env,access);
    assert.equal(response.status,403);assert.equal((await response.json()).error,'origin');
  }
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_audit').get().n,0);
});

test('owner editor works without Brevo and exposes no-store state while public endpoint never sees drafts',async()=>{
  const {db,sqlite}=database(),env=adminEnv(db);
  for(const department of Object.values(seed.initial.departments))for(const image of department.snapshots||[]){
    const response=await handleRequest(publicRequest('/public/programme/images/'+image.imageId),{DB:db});
    assert.equal(response.status,200);assert.equal(response.headers.get('Content-Type'),'image/webp');
  }
  const first=await handleAdmin(adminRequest(),env,access);
  assert.equal(first.status,200);assert.equal(first.headers.get('Cache-Control'),'no-store');
  assert.equal((await first.json()).revision,0);
  const edit=structuredClone(seed.initial);
  for(const language of ['en','zh','ja']){
    edit.departments.workshops.translations[language].now='Private draft '+language;
    edit.departments.workshops.translations[language].done=['Confirmed meeting '+language];
  }
  edit.coffee.heightCm=22;
  const saved=await save(env,edit);assert.equal(saved.status,200);assert.equal((await saved.json()).revision,1);
  const baseline=await handleRequest(publicRequest(),{DB:db});
  assert.equal(baseline.status,200);assert.equal(baseline.headers.get('Access-Control-Allow-Origin'),'*');
  assert.equal(baseline.headers.has('Access-Control-Allow-Credentials'),false);
  const before=await baseline.json();assert.equal(before.coffee.heightCm,20);
  assert.equal(JSON.stringify(before).includes('Private draft'),false);
  assert.equal((await publish(env,1)).status,200);
  const live=await (await handleRequest(publicRequest(),{DB:db})).json();
  assert.equal(live.coffee.heightCm,22);
  assert.equal(live.departments.workshops.translations.en.now,'Private draft en');
  assert.equal(live.departments.workshops.translations.zh.now,'備註：Private draft en');
  assert.equal(live.departments.workshops.translations.ja.now,'内容：Private draft en');
  assert.deepEqual(Object.keys(live).sort(),['coffee','departments','publishedAt','updatedAt','version']);
  assert.ok(live.publishedAt);assert.equal(JSON.stringify(live).includes(owner),false);
  assert.equal(JSON.stringify(live).includes('expectedRevision'),false);
  assert.deepEqual(sqlite.prepare('SELECT action FROM programme_audit ORDER BY id').all().map(r=>r.action),['save','publish']);
});

test('stale, malformed, oversize and incomplete programme edits never publish through the HTTP boundary',async()=>{
  const {db}=database(),env=adminEnv(db);
  assert.equal((await save(env,seed.initial)).status,200);
  assert.equal((await save(env,seed.initial,0)).status,409);
  assert.equal((await publish(env,0)).status,409);
  assert.equal((await handleAdmin(adminRequest('/api/programme/save',{method:'POST',body:'{'}),env,access)).status,400);
  assert.equal((await handleAdmin(adminRequest('/api/programme/save',{method:'POST',body:'x'.repeat(45000)}),env,access)).status,400);
  const invalid=structuredClone(seed.initial);invalid.departments.cafe.translations.en.now='';
  assert.equal((await save(env,invalid,1)).status,200);
  assert.equal((await publish(env,2)).status,400);
  const unsafe=structuredClone(seed.initial);unsafe.departments.local.translations.en.now='<script>alert(1)</script>';
  assert.equal((await save(env,unsafe,2)).status,400);
  assert.equal((await (await handleRequest(publicRequest(),{DB:db})).json()).coffee.heightCm,20);
});

test('anonymous public routes are GET-only, ignore injected query fields and cannot route to admin',async()=>{
  const {db,sqlite}=database(),env=adminEnv(db);
  const edit=structuredClone(seed.initial);edit.departments.local.translations.en.now='Not yet public.';
  assert.equal((await save(env,edit)).status,200);
  const base=await (await handleRequest(publicRequest(),{DB:db})).json();
  const query='/public/programme?draft=true&revision=999&actor='+encodeURIComponent(owner)+'&sql='+encodeURIComponent("'; DELETE FROM programme_state;--")+'&payload='+'x'.repeat(65000);
  const response=await handleRequest(publicRequest(query),{DB:db});
  assert.equal(response.status,200);assert.deepEqual(await response.json(),base);
  for(const method of ['POST','PUT','PATCH','DELETE','OPTIONS','HEAD']){
    const denied=await handleRequest(publicRequest('/public/programme',method,method==='HEAD'?undefined:{draft:true}),{DB:db});
    assert.equal(denied.status,405);assert.equal(denied.headers.get('Allow'),'GET');
  }
  assert.equal((await handleRequest(publicRequest('/api/programme'),{DB:db})).status,403);
  assert.equal(await handlePublicProgramme(publicRequest('/unrelated'),{DB:db}),null);
  assert.equal(sqlite.prepare('SELECT revision FROM programme_state').get().revision,1);
});

test('public API reports unavailable bindings/storage cleanly without exposing infrastructure details',async()=>{
  for(const env of [{},{DB:{prepare(){throw Error('private database id and actor');}}}]){
    const response=await handleRequest(publicRequest(),env);
    assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'temporarily_unavailable'});
  }
});

test('weather normalizes MET units and chooses the newest eligible current point without selecting an hour ahead',()=>{
  const data=forecast(),weather=normaliseForecast(data,millis);
  assert.equal(weather.validAt,iso(millis-10*60000));assert.equal(weather.temperatureC,21.3);
  assert.equal(weather.windKmh,18);assert.equal(weather.windDirection,270);
  assert.equal(weather.rainNextHourMm,1.2);assert.equal(weather.condition,'rain');assert.equal(weather.cloud,72);
  assert.equal(weather.location.name,'Glenorie');assert.equal(weather.estimated,true);
  assert.equal(weather.source,'MET Norway');assert.match(weather.licence,/creativecommons\.org\/licenses\/by\/4\.0/);
  const unordered=forecast();unordered.properties.timeseries.reverse();assert.equal(normaliseForecast(unordered,millis).validAt,weather.validAt);
});

test('weather rejects missing/incorrect units, bad measurements and stale or invalid provider times',()=>{
  const mutations=[
    p=>p.properties.meta.updated_at='not a timestamp',
    p=>p.properties.meta.updated_at=iso(millis-24*3600000-1),
    p=>p.properties.meta.updated_at=iso(millis+5*60000+1),
    p=>p.properties.timeseries=[],
    p=>p.properties.timeseries.forEach(r=>r.time='invalid'),
    p=>p.properties.timeseries.forEach(r=>r.time=iso(millis-4*3600000)),
    p=>p.properties.timeseries.forEach(r=>r.time=iso(millis+3600000)),
    p=>p.properties.timeseries.forEach(r=>r.data.instant.details.air_temperature=NaN),
    p=>p.properties.meta.units.air_temperature='fahrenheit',
    p=>p.properties.meta.units.wind_speed='km/h',
    p=>delete p.properties.meta.units,
    p=>p.properties.timeseries.forEach(r=>r.data.instant.details.cloud_area_fraction=Infinity),
    p=>p.properties.timeseries.forEach(r=>r.data.instant.details.wind_from_direction=NaN),
  ];
  for(const mutate of mutations){const data=forecast();mutate(data);assert.throws(()=>normaliseForecast(data,millis),undefined,mutate.toString());}
});

test('weather uses fixed Glenorie coordinates/identifying UA and honors provider expiry without another request',async()=>{
  const {db}=database();let calls=0;
  const fetcher=async(url,options)=>{calls++;assert.equal(new URL(url).hostname,'api.met.no');assert.equal(new URL(url).searchParams.get('lat'),'-33.60');assert.equal(new URL(url).searchParams.get('lon'),'151.01');assert.match(options.headers['User-Agent'],/TheGlenolia\/1\.0.*info@theglenolia\.com\.au/);assert.ok(options.signal);return provider();};
  const first=await getWeather(db,fetcher,millis);assert.equal(first.stale,false);
  const cachedValue=await getWeather(db,fetcher,millis+29*60000);
  assert.equal(calls,1);assert.equal(cachedValue.stale,false);assert.equal(cachedValue.fetchedAt,iso(millis));
});

test('304 revalidation retains the model, sends If-Modified-Since and uses the new expiry',async()=>{
  const {db,sqlite}=database(),body=normaliseForecast(forecast(),millis);
  const modified='Sat, 17 Oct 2026 00:22:00 GMT';cached(sqlite,body,{modified});let calls=0;
  const fetcher=async(url,options)=>{calls++;assert.equal(options.headers['If-Modified-Since'],modified);return provider(null,millis,{status:304,expires:millis+45*60000});};
  const first=await getWeather(db,fetcher,millis);assert.equal(first.temperatureC,21.3);assert.equal(first.stale,false);
  assert.equal((await getWeather(db,fetcher,millis+44*60000)).temperatureC,21.3);assert.equal(calls,1);
});

test('provider failure backs off shared requests and serves only a bounded stale weather snapshot',async()=>{
  const {db,sqlite}=database(),body=normaliseForecast(forecast(),millis);cached(sqlite,body);let calls=0;
  const failed=async()=>{calls++;return provider({},millis,{status:429});};
  const first=await getWeather(db,failed,millis);assert.equal(first.stale,true);
  assert.equal((await getWeather(db,failed,millis+4*60000)).stale,true);assert.equal(calls,1);
  await getWeather(db,failed,millis+5*60000);assert.equal(calls,2);
  const freshDb=database();let coldCalls=0;const noWeather=async()=>{coldCalls++;throw Error('provider unreachable');};
  assert.equal(await getWeather(freshDb.db,noWeather,millis),null);
  assert.equal(await getWeather(freshDb.db,noWeather,millis+4*60000),null);assert.equal(coldCalls,1);
});

test('shared refresh lock permits a single upstream request across parallel clients',async()=>{
  const {db,sqlite}=database(),body=normaliseForecast(forecast(),millis);cached(sqlite,body);
  let release,started,requests=0;
  const gate=new Promise(resolve=>release=resolve),opening=new Promise(resolve=>started=resolve);
  const fetcher=async()=>{requests++;started();await gate;return provider();};
  const first=getWeather(db,fetcher,millis);await opening;
  const others=await Promise.all(Array.from({length:12},()=>getWeather(db,fetcher,millis)));
  assert.equal(requests,1);assert.ok(others.every(value=>value.stale));
  release();assert.equal((await first).stale,false);assert.equal(requests,1);
});

test('cache cannot claim fresh weather beyond six-hour fetch or 24-hour model bounds, or from invalid/future model time',async()=>{
  for(const patch of [
    {fetchedAt:millis-6*3600000-1},
    {modelUpdatedAt:iso(millis-24*3600000-1)},
    {modelUpdatedAt:'invalid'},
    {modelUpdatedAt:iso(millis+6*60000)},
  ]){
    const {db,sqlite}=database(),body={...normaliseForecast(forecast(),millis),...(patch.modelUpdatedAt?{modelUpdatedAt:patch.modelUpdatedAt}:{})};
    cached(sqlite,body,{fetchedAt:patch.fetchedAt??millis,expiresAt:millis+60000});
    assert.equal(await getWeather(db,async()=>{throw Error('must honor provider Expires');},millis),null,JSON.stringify(patch));
  }
});

test('public weather failures are explicit and query parameters cannot alter upstream location',async()=>{
  const {db}=database();let endpoint;
  const response=await handleRequest(publicRequest('/public/weather?lat=0&lon=0&draft=true'),{DB:db},async url=>{endpoint=url;return provider(forecast(Date.now()),Date.now());});
  assert.equal(response.status,200);assert.equal(new URL(endpoint).searchParams.get('lat'),'-33.60');assert.equal(new URL(endpoint).searchParams.get('lon'),'151.01');
  const failed=await handleRequest(publicRequest('/public/weather'),{DB:database().db},async()=>new Response('{}',{status:503}));
  assert.equal(failed.status,503);assert.deepEqual(await failed.json(),{error:'temporarily_unavailable'});
});

test('an older forecast point is marked stale on the first fetch as well as subsequent cached reads',async()=>{
  const {db}=database(),data=forecast();
  data.properties.timeseries=data.properties.timeseries.slice(0,2);
  data.properties.timeseries[0].time=iso(millis-150*60000);
  data.properties.timeseries[1].time=iso(millis-120*60000);
  const first=await getWeather(db,async()=>provider(data),millis);
  assert.equal(first.stale,true);
  assert.equal((await getWeather(db,async()=>{throw Error('must use cache');},millis+1000)).stale,true);
});


test('unchanged English and structured observation updates publish without an AI binding',async()=>{
  const {db}=database(),env={...adminEnv(db),AI:undefined},document=structuredClone(seed.initial);
  document.departments.cafe.status='developing';document.coffee.heightCm=23;
  document.departments.cafe.translations.zh.now='';document.departments.cafe.translations.ja.next='';
  assert.equal((await save(env,document)).status,200);assert.equal((await publish(env,1)).status,200);
  const publicData=await (await handleRequest(publicRequest(),{DB:db})).json();
  assert.equal(publicData.coffee.heightCm,23);assert.equal(publicData.departments.cafe.status,'developing');
  assert.deepEqual(publicData.departments.cafe.translations,seed.initial.departments.cafe.translations);
});

test('changed English without an AI binding preserves the private draft and previous publication',async()=>{
  const {db,sqlite}=database(),env={...adminEnv(db),AI:undefined},document=structuredClone(seed.initial);
  document.departments.cafe.translations.en.now='A new English update';
  assert.equal((await save(env,document)).status,200);
  const response=await publish(env,1);assert.equal(response.status,503);
  const state=await (await handleAdmin(adminRequest(),env,access)).json();
  assert.equal(state.draft.departments.cafe.translations.en.now,'A new English update');assert.equal(state.publishedRevision,0);
  assert.deepEqual(state.published,seed.initial);assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM programme_audit WHERE action='publish'").get().n,0);
});

test('English-only publishing translates only the changed department and ignores caller target text',async()=>{
  const {db}=database(),env=adminEnv(db),document=structuredClone(seed.initial),seen=[];
  env.AI=fakeAI((model,input)=>seen.push(input));
  document.departments.cafe.translations.en.now='A new café note';document.departments.cafe.translations.zh.now='Stale client target';document.departments.cafe.translations.ja.now='Unrelated client target';
  assert.equal((await save(env,document)).status,200);assert.equal((await publish(env,1)).status,200);
  assert.ok(seen.length>0);assert.ok(seen.every(input=>input.entries.every(entry=>entry.id.startsWith('cafe.'))));
  const state=await (await handleAdmin(adminRequest(),env,access)).json();
  assert.equal(state.draft.departments.cafe.translations.en.now,'A new café note');
  assert.equal(state.draft.departments.cafe.translations.zh.now,'備註：A new café note');assert.equal(state.draft.departments.cafe.translations.ja.now,'内容：A new café note');
  assert.deepEqual(state.draft.departments.workshops,seed.initial.departments.workshops);
  const calls=seen.length;assert.equal((await publish(env,1)).status,200);assert.equal(seen.length,calls);
});

test('malformed or unavailable translation never partially publishes a language',async()=>{
  for(const AI of [{async run(){throw Error('provider quota or timeout private detail');}},{async run(model,options){const {entries}=JSON.parse(options.messages.find(message=>message.role==='user').content);return {response:{entries:entries.map(({id})=>({id,zh:'中文新內容'}))}};}}]){
    const {db,sqlite}=database(),env={...adminEnv(db),AI},document=structuredClone(seed.initial);document.departments.cafe.translations.en.now='New private draft';
    assert.equal((await save(env,document)).status,200);const before=await (await handleAdmin(adminRequest(),env,access)).json();
    const response=await publish(env,1);assert.ok([502,503].includes(response.status));
    const after=await (await handleAdmin(adminRequest(),env,access)).json();assert.deepEqual(after,before);
    assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM programme_audit WHERE action='publish'").get().n,0);
    const publicData=await (await handleRequest(publicRequest(),{DB:db})).json();assert.equal(publicData.departments.cafe.translations.en.now,seed.initial.departments.cafe.translations.en.now);
    assert.equal(JSON.stringify(publicData).includes('provider quota or timeout private detail'),false);
  }
});


test('translation preview leaves programme state private and publication reuses its validated cache pair',async()=>{
  const {db,sqlite}=database(),env=adminEnv(db),document=structuredClone(seed.initial);let calls=0;
  env.AI=fakeAI(()=>calls++);document.departments.cafe.translations.en.now='An English update to preview';
  const preview=await handleAdmin(adminRequest('/api/programme/preview-translations',{method:'POST',body:{programme:document,expectedRevision:0}}),env,access);
  assert.equal(preview.status,200);const candidate=(await preview.json()).programme;
  assert.equal(candidate.departments.cafe.translations.zh.now,'備註：An English update to preview');
  assert.equal(candidate.departments.cafe.translations.ja.now,'内容：An English update to preview');
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_audit').get().n,0);
  const before=await (await handleRequest(publicRequest(),{DB:db})).json();assert.deepEqual(before.departments,seed.initial.departments);
  assert.equal((await save(env,document)).status,200);
  const stale=await handleAdmin(adminRequest('/api/programme/preview-translations',{method:'POST',body:{programme:document,expectedRevision:0}}),env,access);assert.equal(stale.status,409);
  const beforePublish=calls;env.AI=undefined;assert.equal((await publish(env,1)).status,200);assert.equal(calls,beforePublish);
  const current=await (await handleRequest(publicRequest(),{DB:db})).json();assert.deepEqual(current.departments,candidate.departments);
  assert.equal(JSON.stringify(current).includes('translation_cache'),false);assert.equal(JSON.stringify(current).includes('cache_key'),false);
});

test('reviewed-English preview needs no AI and cannot accept caller actor/provider fields',async()=>{
  const {db,sqlite}=database(),env={...adminEnv(db),AI:undefined};
  const accepted=await handleAdmin(adminRequest('/api/programme/preview-translations',{method:'POST',body:{programme:seed.initial,expectedRevision:0}}),env,access);assert.equal(accepted.status,200);
  for(const extra of [{actor:'someone@example.com'},{translate:'trust this client function'},{AI:{ready:true}}]){
    const rejected=await handleAdmin(adminRequest('/api/programme/preview-translations',{method:'POST',body:{programme:seed.initial,expectedRevision:0,...extra}}),env,access);assert.equal(rejected.status,400);
  }
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
});
