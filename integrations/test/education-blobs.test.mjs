import test from 'node:test';
import assert from 'node:assert/strict';
import {pdfResponse} from '../education-resources.mjs';

// Wire-format fixture: full upload/structural checks have separate real-PDF tests.
const bytes=Uint8Array.from([...new TextEncoder().encode('%PDF-1.4\n'),0,255,44,13,10,...new TextEncoder().encode('%%EOF\n')]);
const request=new Request('https://education.example.test/api/resources/wire-pack/pdf');
const resource={id:'wire-pack',version:2};
function environment(value,size=bytes.length){return {EDU_DB:{prepare(){return {bind(){return this;},async first(){return {pdf_blob:value,pdf_size:size,pdf_key:null};}};}},ASSETS:{fetch(){throw Error('A stored BLOB must not request a static asset.');}}};}

test('production D1 number arrays download as exact binary PDF bytes',async()=>{
 const response=await pdfResponse(request,environment(Array.from(bytes)),resource,null);
 assert.deepEqual(new Uint8Array(await response.arrayBuffer()),bytes);
 assert.equal(response.headers.get('Content-Type'),'application/pdf');
 assert.equal(response.headers.get('Cache-Control'),'no-store');
 assert.match(response.headers.get('Content-Disposition'),/wire-pack-v2\.pdf/);
});

test('local typed arrays, ArrayBuffers and offset views keep the same binary bytes',async()=>{
 const padded=new Uint8Array(bytes.length+10);padded.set(bytes,5);
 for(const value of [bytes,bytes.buffer,new DataView(padded.buffer,5,bytes.length)]){
  const response=await pdfResponse(request,environment(value),resource,null);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()),bytes);
 }
});

test('corrupt or mismatched stored BLOB representations fail closed',async()=>{
 for(const [value,size]of [[Array.from(bytes),bytes.length+1],[[...Array.from(bytes),256],bytes.length+1],[[...Array.from(bytes),-1],bytes.length+1],[[...Array.from(bytes),0.5],bytes.length+1],['37,80,68,70',10],[new Uint8Array([37,80,68,70,0]),5],[bytes,2097153]]){
  await assert.rejects(pdfResponse(request,environment(value,size),resource,null),e=>e.status===503&&e.message==='file_temporarily_unavailable');
 }
});
