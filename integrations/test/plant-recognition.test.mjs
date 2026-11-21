import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {constants,deflateRawSync,inflateSync} from 'node:zlib';
import {recognitionRoute} from '../plant-recognition.mjs';
import {indexedPng} from '../recognition-png.mjs';

const id='b581bf6d-8a70-4da0-b292-8bafe45585fe';
function fixture(){
 const data=new DatabaseSync(':memory:');
 data.exec(`CREATE TABLE edu_schools(id TEXT PRIMARY KEY,status TEXT);
 CREATE TABLE edu_memberships(school_id TEXT,user_id TEXT,active INTEGER);
 CREATE TABLE edu_plant_members(org_id TEXT,user_id TEXT);
 CREATE TABLE edu_plant_organisations(id TEXT PRIMARY KEY,name TEXT);
 CREATE TABLE edu_plant_applications(id TEXT PRIMARY KEY,workspace_id TEXT,school_name TEXT,plant_key TEXT,accepted_at TEXT,status TEXT,release_at TEXT);
 INSERT INTO edu_schools VALUES ('a','active');INSERT INTO edu_plant_members VALUES ('a','teacher');INSERT INTO edu_plant_organisations VALUES ('a','Original school');
 `);
 data.exec(readFileSync(new URL('../plant-recognition-schema.sql',import.meta.url),'utf8'));
 data.prepare("INSERT INTO edu_plant_applications VALUES(?,'a','Original school','r2-p2',NULL,'offered',NULL)").run(id);
 const db={prepare(q){return {bind(...v){return{first:()=>data.prepare(q).get(...v),run:()=>({meta:data.prepare(q).run(...v)})};},all(){return {results:data.prepare(q).all()};}};}};
 const env={EDU_DB:db};const get=(file,actor='teacher')=>{
  const base=actor?'/api/plants/recognition':'/plants/recognition';
  return recognitionRoute(new Request('https://test.invalid'+base+(file?'/'+id+'/'+file:'?applicationId='+id)),env,base+(file?'/'+id+'/'+file:''),actor?{id:actor}:null);
 };
 return {data,get,activate:()=>data.prepare("UPDATE edu_plant_applications SET status='active',accepted_at='2026-11-01T18:00:00Z' WHERE id=?").run(id)};
}
test('acceptance freezes the issued school name, permanent tree, date, and graphic edition across archived adoptions',async(t)=>{
 const {data,get,activate}=fixture();t.after(()=>data.close());
 await assert.rejects(get('certificate.pdf'),e=>e.status===404);
 activate();data.exec("UPDATE edu_plant_organisations SET name='Another name'");
 const first=await (await get(null)).json();assert.equal(first.award.schoolName,'Original school');assert.equal(first.award.plantLabel,'P21');assert.equal(first.award.files.length,5);
 const captions=await get('captions.txt');assert.match(captions.headers.get('content-disposition'),/attachment/);
 const bytes=await captions.text();assert.match(bytes,/Original school/);assert.match(bytes,/2 November 2026/);
 assert.equal(await (await get('captions.txt')).text(),bytes);assert.equal(data.prepare('SELECT count(*) AS n FROM edu_plant_award_files').get().n,1);
 await assert.rejects(get('captions.txt','outsider'),e=>e.status===404);
 data.exec("UPDATE edu_plant_applications SET status='cooling',release_at='2000-01-01'");await assert.rejects(get('captions.txt'),e=>e.status===404);
 const archive=await (await get(null,null)).json();assert.equal(archive.awards[0].status,'released');assert.equal(await (await get('captions.txt',null)).text(),bytes);
 await assert.rejects(get('other.png',null),e=>e.status===404);
});
test('indexed personalisation preserves all static and dynamic pixels and validates the combined Adler check at its wrap boundary',()=>{
 function checksum(bytes){let a=1,b=0;for(const x of bytes){a=(a+x)%65521;b=(b+a)%65521;}return [a,b];}
 // This prefix forces the first Adler component to zero.
 const prefix=Buffer.from([...Array(256).fill(255),240]),mid=Buffer.alloc(75723,171),suffix=Buffer.from([21,56,100]);
 assert.equal(checksum(prefix)[0],0);
 const encoded=indexedPng(200,380,{top:checksum(prefix),bottom:checksum(suffix),bottomLength:suffix.length,palette:Array(768).fill(0)},
  deflateRawSync(prefix,{finishFlush:constants.Z_SYNC_FLUSH}),mid,deflateRawSync(suffix));
 const bytes=Buffer.from(encoded);let at=8;
 while(at<bytes.length){const len=bytes.readUInt32BE(at);if(bytes.toString('ascii',at+4,at+8)==='IDAT'){
  assert.deepEqual(inflateSync(bytes.subarray(at+8,at+8+len)),Buffer.concat([prefix,mid,suffix]));return;
 }at+=len+12;}
 assert.fail('PNG has no image data');
});
