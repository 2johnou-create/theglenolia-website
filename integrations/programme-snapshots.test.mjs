import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import publishedSource from '../programme-content.json' with {type:'json'};
import {handleAdmin} from './admin-worker.mjs';
import {handleRequest} from './newsletter-worker.mjs';
import {fetchProgramme,fetchPublicProgramme,saveProgramme,publishProgramme,prepareProgrammeTranslations,normaliseProgramme} from './programme-store.mjs';
import {uploadProgrammeImage,IMAGE_LIMITS} from './programme-media.mjs';
import {translateSnapshotNotes,snapshotTranslationEntries} from './programme-translation.mjs';
// Attachment lifecycle starts from a legacy document without pictures. The
// separate API suite seeds public-baseline image IDs with synthetic media rows.
const seed={initial:structuredClone(publishedSource.initial)};
for(const department of Object.values(seed.initial.departments))delete department.snapshots;
const picture=Uint8Array.from(Buffer.from('UklGRh4AAABXRUJQVlA4TBEAAAAvAYAAAAdQwqb1rf+BiOh/AAA=','base64'));
const owner='john@theglenolia.com.au',time='2026-10-20T00:00:00.000Z';
const access={access:{aud:'pictures-test',getIdentity:async()=>({email:owner})}};
function database(){
 const sqlite=new DatabaseSync(':memory:');
 const migrations=readdirSync(new URL('./migrations/',import.meta.url)).filter(n=>/^00[3456]-.*\.sql$/.test(n)).sort();
 for(const file of ['admin-schema.sql',...migrations.map(n=>'migrations/'+n)])sqlite.exec(readFileSync(new URL('./'+file,import.meta.url),'utf8'));
 const queries=[];
 const db={prepare(sql){queries.push(sql);const statement=sqlite.prepare(sql);let values=[];return {bind(...args){values=args;return this;},async first(){const result=statement.get(...values)||null;if(result?.bytes)result.bytes=Array.from(result.bytes);return result;},async all(){return {results:statement.all(...values)};},async run(){return this._run();},_run(){return {meta:{changes:Number(statement.run(...values).changes)}};}};},async batch(statements){sqlite.exec('BEGIN IMMEDIATE');try{const result=statements.map(s=>s._run());sqlite.exec('COMMIT');return result;}catch(error){sqlite.exec('ROLLBACK');throw error;}}};
 return {db,sqlite,queries};
}
const glossaryEcho=(text,language)=>text.replace(/room\s+(?:and|&)\s+linen\s+spray/gi,language==='zh'?'空間與織品香氛噴霧':'ルーム＆リネンスプレー').replace(/aroma diffuser/gi,language==='zh'?'擴香':'アロマディフューザー').replace(/fragrance spray/gi,language==='zh'?'香氛噴霧':'フレグランススプレー').replace(/warm ivory/gi,language==='zh'?'暖象牙白':'温かみのあるアイボリー').replace(/visitor details/gi,language==='zh'?'到訪資訊':'来訪のご案内');
function ai(onRun){return {async run(model,input){const entries=JSON.parse(input.messages[1].content).entries;onRun?.(entries,input);return {response:{entries:entries.map(({id,text})=>({id,zh:'圖說：'+glossaryEcho(text,'zh'),ja:'写真：'+glossaryEcho(text,'ja')}))}};}};}
const environment=(db,AI=ai())=>({DB:db,AI,ACCESS_AUD:'pictures-test',ADMIN_EMAIL:owner});
const admin=(path,method='GET',body,headers={})=>new Request('https://admin.example'+path,{method,headers:{...(method==='POST'?{Origin:'https://admin.example','Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:body instanceof Uint8Array?body:typeof body==='string'?body:JSON.stringify(body)});
const publicRequest=(path,method='GET')=>new Request('https://api.example'+path,{method});
const uploadRequest=(department='cafe',bytes=picture,headers={})=>admin('/api/programme/images/upload?department='+department,'POST',bytes,{'Content-Type':'image/webp',...headers});
async function upload(env,department='cafe'){const response=await handleAdmin(uploadRequest(department),env,access);assert.equal(response.status,201);return (await response.json()).image;}
function snapshot(imageId,overrides={}){return {imageId,kind:'photo',capturedOn:'2026-10-20',translations:{en:{caption:'A preparation snapshot.',alt:'Coffee packaging beside a cup.'},zh:{caption:'stale client caption',alt:'stale client alt'},ja:{caption:'stale client caption',alt:'stale client alt'}},...overrides};}
const programmeWith=(imageId,department='cafe')=>{const p=structuredClone(seed.initial);p.departments[department].snapshots=[snapshot(imageId)];return p;};
const options={actor:owner,now:time,initial:seed.initial};
const save=(db,programme,expectedRevision=0)=>saveProgramme(db,{programme,expectedRevision},options);
const translated=entries=>({entries:entries.map(({id,text})=>({id,zh:'照片：'+text,ja:'写真：'+text}))});
const publish=(db,expectedRevision=1,extra={})=>publishProgramme(db,{...options,expectedRevision,translateSnapshots:async entries=>translated(entries),...extra});
const stateRows=sqlite=>({state:sqlite.prepare('SELECT * FROM programme_state').all(),audit:sqlite.prepare('SELECT * FROM programme_audit').all(),media:sqlite.prepare('SELECT image_id,first_published_at FROM programme_media ORDER BY image_id').all()});

test('uploads and private image reads require trusted owner Access; foreign origins cannot upload',async()=>{
 const {db,queries}=database(),env=environment(db);
 for(const ctx of [{},{access:{...access.access,aud:'wrong'}},{access:{...access.access,getIdentity:async()=>({email:'other@example.com'})}}]){
  assert.equal((await handleAdmin(uploadRequest(),env,ctx)).status,403);
  assert.equal((await handleAdmin(admin('/api/programme/images/00000000-0000-4000-8000-000000000001'),env,ctx)).status,403);
 }
 for(const origin of ['https://evil.example','null',''])assert.equal((await handleAdmin(uploadRequest('cafe',picture,{Origin:origin}),env,access)).status,403);
 assert.equal(queries.length,0);
});

test('owner upload derives technical metadata, returns exact private bytes and does not create a draft or public asset',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env);
 assert.match(image.imageId,/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/);
 assert.deepEqual({...image,imageId:'ID',previewUrl:'URL'},{imageId:'ID',department:'cafe',mime:'image/webp',width:2,height:3,byteLength:picture.length,previewUrl:'URL'});
 assert.equal(image.previewUrl,'/api/programme/images/'+image.imageId);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_audit').get().n,0);
 const privateResponse=await handleAdmin(admin(image.previewUrl),env,access);
 assert.equal(privateResponse.status,200);assert.equal(privateResponse.headers.get('Cache-Control'),'no-store');
 assert.deepEqual(new Uint8Array(await privateResponse.arrayBuffer()),picture);
 const missing=await handleRequest(publicRequest('/public/programme/images/'+image.imageId),{DB:db});
 assert.equal(missing.status,404);assert.equal(missing.headers.get('Cache-Control'),'no-store');
 assert.deepEqual(await missing.json(),{error:'not_found'});
 assert.equal(JSON.stringify(await fetchPublicProgramme(db,seed.initial)).includes(image.imageId),false);
});

test('binary upload rejects invalid MIME, body lengths, departments, duplicate query keys and unsupported methods',async()=>{
 const {db,sqlite}=database(),env=environment(db);
 const bad=[uploadRequest('not-real'),uploadRequest('cafe',picture,{'Content-Type':'image/png'}),uploadRequest('cafe',new Uint8Array()),uploadRequest('cafe',picture,{'Content-Length':'307201'}),uploadRequest('cafe',new Uint8Array(307201)),admin('/api/programme/images/upload?department=cafe&department=local','POST',picture,{'Content-Type':'image/webp'}),admin('/api/programme/images/upload?department=cafe&url=https://evil.example','POST',picture,{'Content-Type':'image/webp'})];
 for(const request of bad)assert.ok([400,413].includes((await handleAdmin(request,env,access)).status));
 assert.equal((await handleAdmin(admin('/api/programme/images/upload?department=cafe'),env,access)).status,405);
 assert.equal((await handleAdmin(admin('/api/programme/images/not-a-uuid'),env,access)).status,404);
 for(const method of ['POST','HEAD','PUT','OPTIONS'])assert.equal((await handleRequest(publicRequest('/public/programme/images/00000000-0000-4000-8000-000000000001',method),{DB:db})).status,405);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_media').get().n,0);
});

test('only exact publication exposes images and paired translations; public metadata contains no private upload fields',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env),p=programmeWith(image.imageId);
 await save(db,p);assert.equal((await handleRequest(publicRequest('/public/programme/images/'+image.imageId),{DB:db})).status,404);
 const saved=await publish(db);
 assert.equal(saved.publishedRevision,1);
 const live=await fetchPublicProgramme(db),entry=live.departments.cafe.snapshots[0];
 assert.deepEqual(Object.keys(entry).sort(),['capturedOn','imageId','kind','translations']);
 assert.equal(entry.translations.en.alt,p.departments.cafe.snapshots[0].translations.en.alt);
 assert.equal(entry.translations.zh.alt,'照片：Coffee packaging beside a cup.');
 assert.equal(entry.translations.ja.alt,'写真：Coffee packaging beside a cup.');
 assert.equal(JSON.stringify(live).includes('stale client'),false);assert.equal(JSON.stringify(live).includes(owner),false);
 const response=await handleRequest(publicRequest('/public/programme/images/'+image.imageId+'?draft=true&sql=DROP'),{DB:db});
 assert.equal(response.status,200);assert.match(response.headers.get('Cache-Control'),/immutable/);assert.equal(response.headers.get('Content-Type'),'image/webp');
 assert.deepEqual(new Uint8Array(await response.arrayBuffer()),picture);
 assert.equal(sqlite.prepare('SELECT first_published_at FROM programme_media').get().first_published_at,time);
});

test('legacy omitted snapshots preserve the current draft, explicit empty removes references after publish, and old public bytes remain immutable',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env);await save(db,programmeWith(image.imageId));await publish(db);
 const legacy=structuredClone(seed.initial);legacy.coffee.heightCm=21;
 const retained=await save(db,legacy,1);assert.equal(retained.draft.departments.cafe.snapshots[0].imageId,image.imageId);
 await publish(db,2,{translateSnapshots:()=>{throw Error('unchanged text must reuse reviewed pair');}});
 const cleared=structuredClone(retained.draft);cleared.departments.cafe.snapshots=[];
 await save(db,cleared,2);assert.equal((await fetchPublicProgramme(db)).departments.cafe.snapshots.length,1);
 await publish(db,3);assert.deepEqual((await fetchPublicProgramme(db)).departments.cafe.snapshots,[]);
 assert.equal((await handleRequest(publicRequest('/public/programme/images/'+image.imageId),{DB:db})).status,200);
 assert.throws(()=>sqlite.prepare('UPDATE programme_media SET bytes=? WHERE image_id=?').run(picture,image.imageId),/immutable/);
 assert.throws(()=>sqlite.prepare('DELETE FROM programme_media WHERE image_id=?').run(image.imageId),/retain/);
 assert.throws(()=>sqlite.prepare('UPDATE programme_media SET first_published_at=NULL WHERE image_id=?').run(image.imageId),/retain/);
});

test('unknown or cross-department media references cannot be saved or published',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env,'coffee');
 await assert.rejects(save(db,programmeWith(image.imageId,'cafe')),e=>e.code==='invalid_image_reference'&&e.status===400);
 await assert.rejects(save(db,programmeWith('00000000-0000-4000-8000-000000000001')),e=>e.code==='invalid_image_reference');
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_audit').get().n,0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
});

test('snapshot schema bounds, unique department ownership and safe text are enforced without silently dropping fields',()=>{
 const id='00000000-0000-4000-8000-000000000001';
 const mutations=[p=>p.departments.cafe.snapshots[0].imageId='../../secret',p=>p.departments.cafe.snapshots[0].imageUrl='https://evil.example',p=>p.departments.cafe.snapshots[0].kind='actual-approved',p=>p.departments.cafe.snapshots[0].capturedOn='2026-02-30',p=>p.departments.cafe.snapshots[0].translations.en.caption='x'.repeat(121),p=>p.departments.cafe.snapshots[0].translations.en.alt='x'.repeat(161),p=>p.departments.cafe.snapshots[0].translations.en.alt='<svg onload=alert(1)>',p=>p.departments.cafe.snapshots[0].translations.en.caption='https://evil.example',p=>p.departments.cafe.snapshots.push(...Array.from({length:4},()=>snapshot(id))),p=>p.departments.local.snapshots=[snapshot(id)],p=>delete p.departments.cafe.snapshots[0].translations.ja];
 for(const mutation of mutations){const p=programmeWith(id);mutation(p);assert.throws(()=>normaliseProgramme(p));}
 const p=programmeWith(id);p.departments.cafe.snapshots[0].capturedOn='';assert.equal(normaliseProgramme(p).departments.cafe.snapshots[0].capturedOn,'');
});

test('blank alt may be saved privately but cannot publish, while empty captions require no inference',async()=>{
 const {db}=database(),env=environment(db),image=await upload(env),p=programmeWith(image.imageId);
 p.departments.cafe.snapshots[0].translations.en.alt='';await save(db,p);await assert.rejects(publish(db),e=>e.code==='invalid_programme');
 p.departments.cafe.snapshots[0].translations.en.alt='A cup.';p.departments.cafe.snapshots[0].translations.en.caption='';await save(db,p,1);
 let fields;
 const result=await publish(db,2,{translateSnapshots:async entries=>{fields=entries.map(e=>e.id);return translated(entries);}});
 assert.equal(fields.length,1);assert.match(fields[0],/\.alt$/);for(const lang of ['en','zh','ja'])assert.equal(result.published.departments.cafe.snapshots[0].translations[lang].caption,'');
});

test('translation failures preserve private draft, old publication, image privacy and audit atomically',async()=>{
 for(const provider of [undefined,async()=>{throw Error('provider down');},async entries=>({entries:entries.map(({id})=>({id,zh:'valid',ja:''}))})]){
  const {db,sqlite}=database(),env=environment(db),image=await upload(env);await save(db,programmeWith(image.imageId));const before=stateRows(sqlite);
  await assert.rejects(publish(db,1,{translateSnapshots:provider}),e=>/^translation_/.test(e.code));
  assert.deepEqual(stateRows(sqlite),before);assert.equal((await handleRequest(publicRequest('/public/programme/images/'+image.imageId),{DB:db})).status,404);
 }
});

test('a concurrent English save during snapshot inference prevents stale publication and image promotion',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env);await save(db,programmeWith(image.imageId));
 await assert.rejects(publish(db,1,{translateSnapshots:async entries=>{const changed=(await fetchProgramme(db)).draft;changed.coffee.heightCm=24;await save(db,changed,1);return translated(entries);}}),e=>e.code==='changed_elsewhere');
 assert.equal((await fetchProgramme(db)).revision,2);assert.equal((await fetchProgramme(db)).publishedRevision,0);
 assert.equal(sqlite.prepare('SELECT first_published_at FROM programme_media').get().first_published_at,null);
 assert.deepEqual(sqlite.prepare('SELECT action FROM programme_audit ORDER BY id').all().map(r=>r.action),['save','save']);
});

test('a failing image promotion rolls back publication and audit rather than leaking only the public metadata',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env);await save(db,programmeWith(image.imageId));const before=stateRows(sqlite);
 sqlite.exec("CREATE TRIGGER reject_promote BEFORE UPDATE OF first_published_at ON programme_media BEGIN SELECT RAISE(ABORT,'promotion unavailable'); END;");
 await assert.rejects(publish(db),e=>e.code==='programme_unavailable');assert.deepEqual(stateRows(sqlite),before);
});

test('media existence is gated inside the same SQL transaction even if an asset disappears after validation',async()=>{
 const {db,sqlite}=database(),env=environment(db),image=await upload(env);await save(db,programmeWith(image.imageId));const batch=db.batch.bind(db);let once=true;
 db.batch=async statements=>{if(once){once=false;sqlite.prepare('DELETE FROM programme_media WHERE image_id=?').run(image.imageId);}return batch(statements);};
 await assert.rejects(publish(db),e=>e.code==='changed_elsewhere');
 assert.equal((await fetchProgramme(db)).publishedRevision,0);assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM programme_audit WHERE action='publish'").get().n,0);
});

test('preview is private, leaves programme state unchanged and publication reuses the typed bilingual cache',async()=>{
 const {db,sqlite}=database();let calls=0;const env=environment(db,ai(()=>calls++)),image=await upload(env),p=programmeWith(image.imageId);
 const request=()=>admin('/api/programme/preview-translations','POST',{programme:p,expectedRevision:0});
 const before=stateRows(sqlite),preview=await handleAdmin(request(),env,access);assert.equal(preview.status,200);assert.equal(calls,2);
 assert.deepEqual(stateRows(sqlite),before);assert.equal((await handleRequest(publicRequest('/public/programme/images/'+image.imageId),{DB:db})).status,404);
 assert.equal((await handleAdmin(admin('/api/programme/save','POST',{programme:p,expectedRevision:0}),env,access)).status,200);
 assert.equal((await handleAdmin(admin('/api/programme/publish','POST',{expectedRevision:1}),{...env,AI:undefined},access)).status,200);
 assert.equal(calls,2);assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_translation_attempts').get().n,2);
});

test('only changed English snapshot fields reach inference and reviewed paired text survives unrelated metadata changes',async()=>{
 const id='00000000-0000-4000-8000-000000000001',published=programmeWith(id);
 published.departments.cafe.snapshots[0].translations.zh={caption:'已審核圖說',alt:'已審核描述'};published.departments.cafe.snapshots[0].translations.ja={caption:'確認済み説明',alt:'確認済み代替文'};
 const edit=structuredClone(published);edit.departments.cafe.snapshots[0].translations.en.caption='Updated caption.';edit.departments.cafe.snapshots[0].kind='concept';
 let requested;
 const candidate=await prepareProgrammeTranslations(edit,{published,initial:seed.initial,translateSnapshots:async entries=>{requested=entries;entries[0].text='attempt to mutate source';return translated(entries);}});
 assert.equal(requested.length,1);assert.match(requested[0].id,/\.caption$/);
 assert.equal(candidate.departments.cafe.snapshots[0].translations.en.caption,'Updated caption.');
 assert.equal(candidate.departments.cafe.snapshots[0].translations.zh.alt,'已審核描述');assert.equal(candidate.departments.cafe.snapshots[0].kind,'concept');
});

test('atomic upload quota prevents concurrent overflow and retains published or current-draft assets during orphan cleanup',async()=>{
 const {db,sqlite}=database();const requests=await Promise.allSettled(Array.from({length:IMAGE_LIMITS.unpublished+4},()=>uploadProgrammeImage(db,uploadRequest(),{department:'cafe',actor:owner,now:time})));
 assert.equal(requests.filter(r=>r.status==='fulfilled').length,IMAGE_LIMITS.unpublished);
 assert.ok(requests.filter(r=>r.status==='rejected').every(r=>r.reason.code==='image_storage_limit'));
 const ids=requests.filter(r=>r.status==='fulfilled').map(r=>r.value.imageId);await save(db,programmeWith(ids[0]));
 sqlite.prepare('UPDATE programme_media SET created_at=?').run('2020-01-01T00:00:00.000Z');
 sqlite.prepare('UPDATE programme_media SET first_published_at=? WHERE image_id=?').run(time,ids[1]);
 await uploadProgrammeImage(db,uploadRequest(),{department:'cafe',actor:owner,now:time});
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_media').get().n,3);
 assert.ok(sqlite.prepare('SELECT 1 FROM programme_media WHERE image_id=?').get(ids[0]));assert.ok(sqlite.prepare('SELECT 1 FROM programme_media WHERE image_id=?').get(ids[1]));
});

test('total immutable media quota also bounds previously published assets',async()=>{
 const {db,sqlite}=database();const insert=sqlite.prepare('INSERT INTO programme_media (image_id,department,mime,width,height,byte_length,sha256,bytes,created_at,created_by,first_published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
 for(let n=0;n<IMAGE_LIMITS.total;n++)insert.run(crypto.randomUUID(),'cafe','image/webp',2,3,picture.length,'a'.repeat(64),picture,time,owner,time);
 await assert.rejects(uploadProgrammeImage(db,uploadRequest(),{department:'cafe',actor:owner,now:time}),e=>e.code==='image_storage_limit');
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_media').get().n,IMAGE_LIMITS.total);
});

test('typed snapshot translations preserve 100 mL product facts, reject altered units and share existing model quota/cache',async()=>{
 const {db}=database(),id='00000000-0000-4000-8000-000000000001',entries=[{id:'cafe.snapshot.'+id+'.alt',text:'A 100 mL bottle.',maximum:160}];let calls=0;
 const env={DB:db,AI:ai(()=>calls++)};const result=await translateSnapshotNotes(entries,env);assert.equal(calls,2);assert.match(result.entries[0].zh,/100 mL/);
 assert.deepEqual(await translateSnapshotNotes(entries,{DB:db}),result);assert.equal(calls,2);
 for(const mutate of [v=>v[0].maximum=280,v=>v[0].id='cafe.now',v=>v.push({...v[0]}),v=>v[0].text='']){const v=structuredClone(entries);mutate(v);assert.throws(()=>snapshotTranslationEntries(v));}
 const fresh=database();await assert.rejects(translateSnapshotNotes(entries,{DB:fresh.db,AI:{run:async(model,input)=>({response:{entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'圖說：'+text.replace(/__GLEN_[A-Z]+__/g,'100 mm'),ja:'写真：'+text.replace(/__GLEN_[A-Z]+__/g,'100 mm')}))}})}}));
});

test('admin uses a route-specific 128 KiB metadata ceiling and image previews add only self/blob to CSP',async()=>{
 const {db}=database(),env=environment(db);
 const html=await handleAdmin(admin('/'),env,access);assert.match(html.headers.get('Content-Security-Policy'),/img-src 'self' blob: https:\/\/theglenolia\.com\.au/);
 const programme=structuredClone(seed.initial);for(const department of Object.values(programme.departments))department.snapshots=[];
 const json=JSON.stringify({programme,expectedRevision:0});
 assert.equal((await handleAdmin(admin('/api/programme/save','POST',json+' '.repeat(45000)),env,access)).status,200);
 assert.equal((await handleAdmin(admin('/api/programme/save','POST',json+' '.repeat(131072)),env,access)).status,400);
 const emailEnv={...env,BREVO_API_KEY:'test',BREVO_LIST_ID:1};
 assert.equal((await handleAdmin(admin('/api/editions/2026-10/save','POST',' '.repeat(40001)),emailEnv,access)).status,400);
});


test('Magnolia product identity is protected in both localized image descriptions',async()=>{
 const {db}=database(),id='00000000-0000-4000-8000-000000000001',entries=[{id:'cafe.snapshot.'+id+'.alt',text:'Magnolia Fragrance Spray, 100 mL.',maximum:160}];
 const result=await translateSnapshotNotes(entries,{DB:db,AI:ai()});
 for(const language of ['zh','ja']){assert.match(result.entries[0][language],/Magnolia/);assert.match(result.entries[0][language],/100 mL/);}
 const fresh=database();await assert.rejects(translateSnapshotNotes(entries,{DB:fresh.db,AI:{run:async(model,input)=>({response:{entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'圖說：'+text.replace('__GLEN_A__','木蘭'),ja:'写真：'+text.replace('__GLEN_A__','モクレン')}))}})}}),error=>error.code==='translation_invalid');
});


test('owner-only translation diagnostics identify a failed field without exposing model text or changing publication',async()=>{
 const {db,sqlite}=database(),p=structuredClone(seed.initial);p.departments.cafe.translations.en.now='Magnolia room and linen spray is in preparation.';
 const env=environment(db,{async run(model,input){return {response:{entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'籌備：'+text.replace('room and linen spray','空間與織品香氛噴霧'),ja:'準備：'+text.replace('room and linen spray','香りの部屋と布団スプレー')}))}};}});
 await save(db,p);const before=stateRows(sqlite);
 const request=()=>admin('/api/programme/preview-translations','POST',{programme:p,expectedRevision:1});
 const response=await handleAdmin(request(),env,access);assert.equal(response.status,502);
 const body=await response.json();assert.deepEqual(body,{error:'translation_invalid',translationFailure:{entryId:'cafe.now',language:'ja',reason:'terminology'}});
 assert.equal(JSON.stringify(body).includes('布団'),false);assert.deepEqual(stateRows(sqlite),before);
 const anonymous=await handleAdmin(request(),env,{});assert.equal(anonymous.status,403);assert.equal(JSON.stringify(await anonymous.json()).includes('translationFailure'),false);
 const publicData=await (await handleRequest(publicRequest('/public/programme'),{DB:db})).json();assert.equal(JSON.stringify(publicData).includes('translationFailure'),false);
});


test('snapshot alt cannot borrow diffuser reeds from a neighboring spray description',async()=>{
 const id='00000000-0000-4000-8000-000000000001',entries=[{id:'cafe.snapshot.'+id+'.alt',text:'Marketing image of the Magnolia Fragrance Spray 100 mL bottle on warm ivory.',maximum:160}];
 for(const language of ['zh','ja']){
  const {db}=database();
  await assert.rejects(translateSnapshotNotes(entries,{DB:db,AI:{run:async(model,input)=>({response:{entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'圖片：'+glossaryEcho(text,'zh')+(language==='zh'?'與擴香枝':''),ja:'商品イメージ：'+glossaryEcho(text,'ja')+(language==='ja'?'とリード':'' )}))}})}}),error=>error.code==='translation_invalid'&&error.reason==='added_object'&&error.entryId===entries[0].id&&error.language===language);
 }
 const {db}=database();let calls=0;
 const result=await translateSnapshotNotes(entries,{DB:db,AI:{run:async(model,input)=>{calls++;return {response:{entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'圖片：'+glossaryEcho(text,'zh'),ja:'商品イメージ：'+glossaryEcho(text,'ja')+(calls===1?'とリード':'')}))}};}}});
 assert.equal(calls,2,'editor repairs the generation before final factual validation');assert.equal(result.entries[0].ja.includes('リード'),false);
});

test('diffuser alt retains reeds when its own English source names them',async()=>{
 const {db}=database(),id='00000000-0000-4000-8000-000000000001',entries=[{id:'cafe.snapshot.'+id+'.alt',text:'Magnolia Aroma Diffuser 200 mL bottle and reeds on warm ivory.',maximum:160}];
 const result=await translateSnapshotNotes(entries,{DB:db,AI:{run:async(model,input)=>({response:{entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'商品圖：'+glossaryEcho(text,'zh').replace('reeds','擴香枝'),ja:'商品イメージ：'+glossaryEcho(text,'ja').replace('reeds','リード')}))}})}});
 assert.match(result.entries[0].ja,/リード/);assert.match(result.entries[0].zh,/擴香枝/);
});
