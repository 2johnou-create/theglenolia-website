import test from 'node:test';
import assert from 'node:assert/strict';
import {programmeMediaOrigin,validSnapshots,snapshotImageURL,snapshotItems} from './programme-snapshots.js';

const ids=Array.from({length:5},(_,i)=>`12345678-1234-4abc-8def-${String(i+1).padStart(12,'0')}`);
const sample=(index=0)=>({imageId:ids[index],kind:'concept',capturedOn:'',translations:{
 en:{caption:'A little of what is taking shape.',alt:'A product presentation on an ivory background.'},
 zh:{caption:'籌備中的小片段。',alt:'暖象牙白背景上的產品示意圖。'},
 ja:{caption:'準備のひとこま。',alt:'アイボリー背景の商品イメージ。'}
}});
const changed=edit=>{const item=sample();edit(item);return [item];};
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};

test('legacy publications may omit snapshots, while empty galleries remain valid',()=>{
 assert.equal(validSnapshots(undefined),true);assert.equal(validSnapshots([]),true);
 for(const language of ['en','zh','ja']){
  assert.deepEqual(snapshotItems(undefined,language),[]);assert.deepEqual(snapshotItems([],language),[]);
 }
 for(const value of [null,false,0,'',{},sample()])assert.equal(validSnapshots(value),false);
});

test('one to four distinct published snapshots are valid, but five or duplicate IDs are rejected',()=>{
 for(let count=1;count<=4;count++)assert.equal(validSnapshots(Array.from({length:count},(_,i)=>sample(i))),true);
 assert.equal(validSnapshots(Array.from({length:5},(_,i)=>sample(i))),false);
 assert.equal(validSnapshots([sample(),sample()]),false);
 assert.equal(validSnapshots([null]),false);assert.equal(validSnapshots([[]]),false);
});

test('image URLs always use the fixed public media endpoint and strict lowercase UUIDv4',()=>{
 assert.equal(programmeMediaOrigin,'https://glenolia-newsletter.theglenolia.workers.dev');
 assert.equal(snapshotImageURL(ids[0]),programmeMediaOrigin+'/public/programme/images/'+ids[0]);
 for(const id of [undefined,null,0,ids[0].toUpperCase(),ids[0].replace('-4abc-','-1abc-'),ids[0].replace('-8def-','-7def-'),
  ids[0]+'?download=1',ids[0]+'#other',' '+ids[0],ids[0]+'\n','../'+ids[0],'/'+ids[0],
  'https://example.com/'+ids[0],'//example.com/'+ids[0],'javascript:alert(1)','data:image/png;base64,AAAA',encodeURIComponent('../'+ids[0])]){
  assert.throws(()=>snapshotImageURL(id),/Invalid published image ID/);
  assert.equal(validSnapshots(changed(item=>{item.imageId=id;})),false);
 }
});

test('non-string image IDs cannot be accepted through coercion or crash validation',()=>{
 for(const imageId of [{toString:()=>ids[0]},JSON.parse('{"toString":"not callable"}'),[ids[0]]]){
  assert.equal(validSnapshots(changed(item=>{item.imageId=imageId;})),false);
  assert.deepEqual(snapshotItems(changed(item=>{item.imageId=imageId;}),'en'),[]);
  assert.throws(()=>snapshotImageURL(imageId),/Invalid published image ID/);
 }
});

test('arbitrary URLs and unpublished or private properties are not part of public snapshot metadata',()=>{
 for(const extra of [{url:'https://example.com/image.jpg'},{src:'javascript:alert(1)'},{storageKey:'private/original.jpg'},{ownerEmail:'owner@example.com'},{approved:true}]){
  const items=changed(item=>Object.assign(item,extra));assert.equal(validSnapshots(items),false);assert.deepEqual(snapshotItems(items,'en'),[]);
 }
 const injected=sample();Object.defineProperty(injected,'__proto__',{value:{url:'https://example.com/'},enumerable:true});
 assert.equal(validSnapshots([injected]),false);
 for(const key of ['imageId','kind','capturedOn','translations'])assert.equal(validSnapshots(changed(item=>{delete item[key];})),false);
});

test('the only supported snapshot kinds are actual photos and illustrative concepts',()=>{
 for(const kind of ['photo','concept'])assert.equal(validSnapshots(changed(item=>{item.kind=kind;})),true);
 for(const kind of ['Photo','image','render','',null,{},0])assert.equal(validSnapshots(changed(item=>{item.kind=kind;})),false);
});

test('capture dates may be omitted with an empty value or use a real calendar day',()=>{
 for(const capturedOn of ['','2026-10-20','2024-02-29','2000-02-29'])assert.equal(validSnapshots(changed(item=>{item.capturedOn=capturedOn;})),true);
 for(const capturedOn of ['2026-02-29','2026-04-31','1900-02-29','2026-13-01','2026-00-01','2026-10-00','2026-1-02','20-10-2026','2026-10-20T00:00:00Z','2026-10-20 ','today',null,0,{}]){
  assert.equal(validSnapshots(changed(item=>{item.capturedOn=capturedOn;})),false);
 }
});

test('every snapshot requires exactly English, Traditional Chinese and Japanese translations',()=>{
 for(const language of ['en','zh','ja'])assert.equal(validSnapshots(changed(item=>{delete item.translations[language];})),false);
 for(const translations of [null,[],{},'text'])assert.equal(validSnapshots(changed(item=>{item.translations=translations;})),false);
 assert.equal(validSnapshots(changed(item=>{item.translations.fr={caption:'texte',alt:'image'};})),false);
 assert.equal(validSnapshots(changed(item=>{item.translations['zh-Hant']=item.translations.zh;delete item.translations.zh;})),false);
});

test('localized entries require only caption and meaningful alternative text',()=>{
 for(const language of ['en','zh','ja']){
  assert.equal(validSnapshots(changed(item=>{item.translations[language].caption='';})),true);
  for(const field of ['caption','alt']){
   assert.equal(validSnapshots(changed(item=>{delete item.translations[language][field];})),false);
   for(const value of [null,0,{},[]])assert.equal(validSnapshots(changed(item=>{item.translations[language][field]=value;})),false);
  }
  for(const alt of ['',' \n\t '])assert.equal(validSnapshots(changed(item=>{item.translations[language].alt=alt;})),false);
  assert.equal(validSnapshots(changed(item=>{item.translations[language].url='https://example.com/';})),false);
 }
});

test('caption and alternative text limits count Unicode characters rather than UTF-16 units',()=>{
 assert.equal(validSnapshots(changed(item=>{item.translations.zh.caption='花'.repeat(120);item.translations.ja.alt='🌱'.repeat(160);})),true);
 assert.equal(validSnapshots(changed(item=>{item.translations.en.caption='🌱'.repeat(121);})),false);
 assert.equal(validSnapshots(changed(item=>{item.translations.zh.alt='花'.repeat(161);})),false);
});

test('localized text rejects markup and unsafe control characters without banning normal punctuation',()=>{
 for(const field of ['caption','alt']){
  for(const text of ['<img src=x onerror=alert(1)>','word>word','a\u0000b','a\u0008b','a\u000bb','a\u001fb','a\u007fb']){
   assert.equal(validSnapshots(changed(item=>{item.translations.en[field]=text;})),false);
  }
 }
 assert.equal(validSnapshots(changed(item=>{item.translations.en.caption='Magnolia & coffee — “a little hello.”\nA new line.';})),true);
});

test('projection returns only safe metadata and the requested localized text',()=>{
 const items=[sample(),{...sample(1),kind:'photo',capturedOn:'2026-10-20'}];
 for(const language of ['en','zh','ja'])assert.deepEqual(snapshotItems(items,language),items.map(item=>({
  imageId:item.imageId,kind:item.kind,capturedOn:item.capturedOn,url:programmeMediaOrigin+'/public/programme/images/'+item.imageId,
  caption:item.translations[language].caption,alt:item.translations[language].alt
 })));
 for(const language of ['en-AU','zh-Hant','fr','',null,undefined,{}])assert.deepEqual(snapshotItems(items,language),[]);
});

test('invalid metadata rejects the whole projection instead of partially showing a gallery',()=>{
 const items=[sample(),sample(1)];items[1].translations.ja.alt='';
 assert.equal(validSnapshots(items),false);assert.deepEqual(snapshotItems(items,'en'),[]);
});

test('validation and localization never mutate a published snapshot or share its nested data',()=>{
 const items=freeze([sample(),sample(1)]),before=JSON.stringify(items);
 assert.equal(validSnapshots(items),true);
 const projected=snapshotItems(items,'zh');assert.equal(JSON.stringify(items),before);
 assert.notEqual(projected,items);assert.notEqual(projected[0],items[0]);
 projected[0].caption='changed';projected.push({});assert.equal(JSON.stringify(items),before);
 assert.equal(snapshotItems(items,'zh')[0].caption,items[0].translations.zh.caption);
});
