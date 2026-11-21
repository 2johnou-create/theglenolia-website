import test from 'node:test';
import assert from 'node:assert/strict';
import { plantWorkshopManifest, servePlantWorkshop } from '../plant-workshops.mjs';

const origin = 'https://class.example.test';
const request = (method='GET') => new Request(origin+'/api/plants/workshops/leaf-detectives.pdf',{method});
function servingAsset(type='application/pdf') {
  const seen=[];
  const env={ASSETS:{fetch:async req=>{
    seen.push([new URL(req.url).pathname,req.method]);
    return new Response(req.method==='HEAD'?null:'%PDF-example',{headers:{'Content-Type':type,'Content-Length':'12'}});
  }}};
  return {env,seen};
}

test('each classroom pack links to its allowlisted protected downloadable PDF',async()=>{
  const {env,seen}=servingAsset();
  assert.equal(new Set(plantWorkshopManifest.map(w=>w.id)).size,3);
  for(const pack of plantWorkshopManifest) {
    assert.equal(pack.pages,4);
    assert.equal(pack.downloadUrl,'/api/plants/workshops/'+pack.id+'.pdf');
    const response=await servePlantWorkshop(request(),env,pack.id);
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal(response.headers.get('Content-Disposition'),'attachment; filename="The-Glenolia-'+pack.id+'.pdf"');
    assert.equal(await response.text(),'%PDF-example');
    assert.deepEqual(seen.at(-1),['/private/classroom-workshops/'+pack.id+'.pdf','GET']);
  }
  const head=await servePlantWorkshop(request('HEAD'),env,'leaf-detectives');
  assert.deepEqual(seen.at(-1),['/private/classroom-workshops/leaf-detectives.pdf','HEAD']);
  assert.equal(await head.text(),'');
});

test('unexpected identifiers, mutations and missing PDF content cannot substitute a different asset',async()=>{
  const {env,seen}=servingAsset();
  await assert.rejects(servePlantWorkshop(request(),env,'../other-record'),{code:'not_found'});
  await assert.rejects(servePlantWorkshop(request('POST'),env,'leaf-detectives'),{code:'method'});
  assert.equal(seen.length,0);
  await assert.rejects(servePlantWorkshop(request(),servingAsset('text/html').env,'leaf-detectives'),{code:'file_temporarily_unavailable'});
});
