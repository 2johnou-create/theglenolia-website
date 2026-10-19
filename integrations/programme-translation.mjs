import OpenCC from 'opencc-js/cn2t';
import {ProgrammeError,departmentIds} from './programme-store.mjs';
import {validImageId} from './programme-media.mjs';
import {translationSystemPrompt} from './programme-translation-prompt.mjs';
// Initialise once per isolate, rather than rebuilding dictionaries per request.
const traditional=OpenCC.Converter({from:'cn',to:'t'});
export const translationModel='@cf/qwen/qwen3-30b-a3b-fp8';
const promptVersion='glenolia-programmes-en-v6-product-editor';
const snapshotPromptVersion='glenolia-snapshots-v7-entry-objects';
const names=['THE GLENOLIA','The Glenolia','John Ou','Dr Justin','Glenorie','IPR107','NR25','Marsellesa','Paraíso','Magnolia'];
const own=(v,k)=>Object.hasOwn(v,k),plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const bad=(reason='shape')=>{const error=new ProgrammeError(502,'translation_invalid');error.reason=reason;return error;};
const unavailable=()=>new ProgrammeError(503,'translation_unavailable');
export function translationEntries(changed){
 if(!plain(changed)||!Object.keys(changed).length||Object.keys(changed).some(id=>!departmentIds.includes(id)))throw bad();
 const entries=[];
 for(const id of departmentIds)if(own(changed,id)){
  const c=changed[id];if(!plain(c)||Object.keys(c).sort().join(',')!=='done,next,now'||!Array.isArray(c.done)||c.done.length>4)throw bad();
  for(const field of ['now','next'])entries.push({id:id+'.'+field,text:c[field],maximum:280});
  c.done.forEach((text,i)=>entries.push({id:id+'.done.'+i,text,maximum:120}));
 }
 if(entries.some(e=>typeof e.text!=='string'||!e.text.trim()||[...e.text].length>e.maximum))throw bad();
 return entries;
}
const system=translationSystemPrompt;
export function translationRequest(changed){
 return requestForEntries(translationEntries(changed));
}
function requestForEntries(entries){
 return {messages:[{role:'system',content:system},{role:'user',content:JSON.stringify({entries:entries.map(({id,text})=>({id,text:maskText(text).text}))})}],response_format:{type:'json_schema',json_schema:{type:'object',properties:{entries:{type:'array',minItems:entries.length,maxItems:entries.length,items:{type:'object',properties:{id:{type:'string',enum:entries.map(e=>e.id)},zh:{type:'string'},ja:{type:'string'}},required:['id','zh','ja'],additionalProperties:false}}},required:['entries'],additionalProperties:false}},stream:false,max_tokens:entries.length>24?10000:6000,temperature:.1};
}
function maskText(source){
 const values=[],escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const pattern=new RegExp(names.slice().sort((a,b)=>b.length-a.length).map(escape).join('|')+'|\\d+(?:[.,]\\d+)*(?:\\s?(?:km/h|cm|mm|mL|°C|%))?','gu');
 const text=source.replace(pattern,value=>{let n=values.length,label='';do{label=String.fromCharCode(65+n%26)+label;n=Math.floor(n/26)-1;}while(n>=0);const token='__GLEN_'+label+'__';values.push({token,value});return token;});
 return {text,values};
}
function unmaskText(source,result){
 if(typeof result!=='string')throw bad('reserved_tokens');
 const {values}=maskText(source);
 if((result.match(/__GLEN_[A-Z]+__/gu)||[]).length!==values.length)throw bad('reserved_tokens');
 for(const {token,value}of values){if(count(result,token)!==1)throw bad('reserved_tokens');result=result.replace(token,value);}
 return result;
}
function tokens(value){return(value.match(/\d+(?:[.,]\d+)*/gu)||[]).sort();}
function sameNumbers(source,result){
 const remaining=tokens(result);for(const token of tokens(source)){const i=remaining.indexOf(token);if(i<0)return false;remaining.splice(i,1);}
 // Natural localization may write an English month/count word as a numeral.
 const words={january:1,jan:1,february:2,feb:2,march:3,mar:3,april:4,apr:4,may:5,june:6,jun:6,july:7,jul:7,august:8,aug:8,september:9,sep:9,sept:9,october:10,oct:10,november:11,nov:11,december:12,dec:12,zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12};
 const allowed=(source.toLowerCase().match(/\b[a-z]+\b/g)||[]).filter(w=>own(words,w)).map(w=>String(words[w]));
 for(const token of remaining){const i=allowed.indexOf(token);if(i<0)return false;allowed.splice(i,1);}return true;
}
const count=(s,t)=>s.split(t).length-1;
const productGlossary=[
 {source:/\broom\s+(?:and|&)\s+linen\s+sprays?\b/iu,zh:'空間與織品香氛噴霧',ja:'ルーム＆リネンスプレー',badZh:/香氛房間|[牀床]單噴霧/u,badJa:/香りの部屋|布団スプレー|リネンスプレイ/u},
 {source:/\baroma\s+diffusers?\b/iu,zh:'擴香',ja:'アロマディフューザー',badZh:/香氣擴散器/u,badJa:/香りを拡散する機械/u},
 {source:/\bfragrance\s+sprays?\b/iu,zh:'香氛噴霧',ja:'フレグランススプレー',badZh:/香氣噴灑器/u,badJa:/香りの噴射器/u},
 {source:/\bwarm\s+ivory\b/iu,zh:'暖象牙白',ja:'温かみのあるアイボリー'},
 {source:/\bvisitor\s+details\b/iu,zh:'到訪資訊',ja:'来訪のご案内',badZh:/實務細節/u,badJa:/実務的な詳細/u},
];
function validateText(source,target,language,maximum,{editorial=true,imageDescription=false}={}){
 if(typeof target!=='string')throw bad('text');
 const result=(language==='zh'?traditional(target):target).normalize('NFC').trim();
 if(!result)throw bad('empty');if([...result].length>maximum)throw bad('length');
 if(/[<>\u0000-\u001f\u007f]/u.test(result)||/(?:[a-z][a-z\d+.-]*:\/\/|https?:|javascript:|data:|www\.|\/\/|\b(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}(?:\b|\/))/iu.test(result))throw bad('unsafe');
 if(editorial)for(const term of productGlossary)if(term.source.test(source)&&term[language==='zh'?'badZh':'badJa']?.test(result.normalize('NFKC')))throw bad('terminology');
 if(editorial&&imageDescription&&/\b(?:fragrance\s+spray|room\s+(?:and|&)\s+linen\s+spray)s?\b/iu.test(source)&&!/\breeds?\b/iu.test(source)&&/リード|擴香[棒枝]|\breeds?\b/iu.test(result))throw bad('added_object');
 if(!sameNumbers(source,result))throw bad('numbers');
 for(const name of names)if(count(source,name)!==count(result,name))throw bad('names');
 for(const unit of ['cm','mm','mL','km/h','%','°C']){const re=new RegExp('(?<![A-Za-z])'+unit.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z])','gu');if((source.match(re)||[]).length!==(result.match(re)||[]).length)throw bad('units');}
 let prose=source;for(const name of names)prose=prose.replaceAll(name,'');
 prose=prose.replace(/\d+(?:[.,]\d+)*/gu,'').replace(/(?:cm|mm|mL|km\/h|°C)/g,'').replace(/\b(?:and|or)\b/gi,'');
 if(/[A-Za-z]{3}/u.test(prose)&&!/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u.test(result)&&source.trim()!=='A place to grow and gather.')throw bad('language');
 if(language==='zh'&&/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(result))throw bad('language');
 if(language==='zh'&&/John Ou\s+(?:is\s+)?lead(?:s|ing)?\b[\s\S]*\b(?:with|alongside)\b[\s\S]*consultants?/iu.test(source)&&/共同主導|共同領導/u.test(result))throw bad('attribution');
 return result;
}
function validateEntryResult(entries,value,{masked=false,editorial=true}={}){
 if(!plain(value)||Object.keys(value).join(',')!=='entries'||!Array.isArray(value.entries)||value.entries.length!==entries.length)throw bad();
 const byId=new Map();
 for(const e of value.entries){if(!plain(e)||Object.keys(e).sort().join(',')!=='id,ja,zh'||typeof e.id!=='string'||byId.has(e.id))throw bad();byId.set(e.id,e);}
 return {entries:entries.map(e=>{const translated=byId.get(e.id);if(!translated)throw bad();const output={id:e.id};for(const lang of ['zh','ja']){try{const raw=masked?unmaskText(e.text,translated[lang]):translated[lang];output[lang]=validateText(e.text,raw,lang,e.maximum,{editorial,imageDescription:e.id.includes('.snapshot.')&&e.id.endsWith('.alt')});}catch(error){if(error?.code==='translation_invalid'){error.entryId=e.id;error.language=lang;}throw error;}}return output;})};
}
export function validateTranslationResult(changed,value,options={}){
 const entries=translationEntries(changed),flat=validateEntryResult(entries,value,options),output={};
 for(const id of departmentIds)if(own(changed,id))output[id]={zh:{now:'',next:'',done:[]},ja:{now:'',next:'',done:[]}};
 for(const e of flat.entries){const[id,field,index]=e.id.split('.');for(const lang of ['zh','ja']){if(field==='done')output[id][lang].done[Number(index)]=e[lang];else output[id][lang][field]=e[lang];}}
 return output;
}
export function snapshotTranslationEntries(value){
 if(!Array.isArray(value)||!value.length||value.length>32)throw bad();const ids=new Set();
 return value.map(entry=>{
  if(!plain(entry)||Object.keys(entry).sort().join(',')!=='id,maximum,text'||typeof entry.id!=='string')throw bad();
  const [department,kind,imageId,field,...extra]=entry.id.split('.'),maximum=field==='caption'?120:160;
  if(!departmentIds.includes(department)||kind!=='snapshot'||!validImageId(imageId)||!['caption','alt'].includes(field)||extra.length||ids.has(entry.id)||entry.maximum!==maximum||typeof entry.text!=='string'||!entry.text.trim()||[...entry.text].length>maximum)throw bad();
  ids.add(entry.id);return {id:entry.id,text:entry.text,maximum};
 });
}
function parseResult(result){
 if(result?.choices){if(result.choices.length!==1||result.choices[0].finish_reason==='length')throw bad();result=result.choices[0].message?.content;}
 else if(plain(result)&&own(result,'response'))result=result.response;
 if(typeof result==='string'){if(result.length>30000)throw bad();try{return JSON.parse(result);}catch{throw bad();}}
 return result;
}
async function cacheKey(entries,purpose){const canonical=JSON.stringify({model:translationModel,prompt:purpose==='snapshots'?snapshotPromptVersion:promptVersion,purpose,entries});return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical)))].map(n=>n.toString(16).padStart(2,'0')).join('');}
async function claimAttempt(DB,now){
 const day=Math.floor(now/86400000)*86400000;
 let r;try{r=await DB.prepare('INSERT INTO programme_translation_attempts (id,created_at) SELECT ?,? WHERE (SELECT COUNT(*) FROM programme_translation_attempts WHERE created_at>=?)<6 AND (SELECT COUNT(*) FROM programme_translation_attempts WHERE created_at>=?)<20').bind(crypto.randomUUID(),now,now-60000,day).run();}catch{throw unavailable();}
 if(Number(r?.meta?.changes)!==1)throw new ProgrammeError(429,'translation_limit');
}
async function infer(AI,input,deadline){
 let timer;try{return await Promise.race([AI.run(translationModel,input),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new ProgrammeError(503,'translation_unavailable')),Math.max(1,deadline-Date.now()));})]);}catch(e){if(e instanceof ProgrammeError)throw e;throw unavailable();}finally{clearTimeout(timer);}
}
/** Shared cache, quota and bilingual review for allowlisted public text only. */
async function translateEntries(entries,{AI,DB,now=Date.now(),deadline=Date.now()+45000}={},purpose='notes'){
 const key=await cacheKey(entries,purpose);
 if(!DB?.prepare)throw unavailable();
 let cached;try{cached=await DB.prepare('SELECT translations_json,created_at FROM programme_translation_cache WHERE cache_key=?').bind(key).first();}catch{throw unavailable();}
 if(cached&&Number(cached.created_at)>now-30*86400000&&Number(cached.created_at)<=now){try{return validateEntryResult(entries,JSON.parse(cached.translations_json));}catch{/* Invalid cache contents are never reused. */}}
 if(!AI?.run)throw unavailable();
 const input=requestForEntries(entries);
 if(purpose==='snapshots')input.messages[0].content+='\nThese are brief status-picture captions and accessible image descriptions. Translate only the supplied English; never infer what an image shows. Preserve whether a picture is a concept and any stated date or early-stage qualification.';
 for(let attempt=0;attempt<2;attempt++){
  if(Date.now()>=deadline)throw unavailable();await claimAttempt(DB,now);
  const raw=await infer(AI,input,deadline);
  let output,result;
  try{result=parseResult(raw);validateEntryResult(entries,result,{masked:true,editorial:false});}catch(e){if(attempt===0){input.messages[0].content+='\nA prior output failed validation. Preserve every reserved token exactly once per entry in both languages, along with all proper names, numerals and units; use complete natural Traditional Chinese/Japanese and the exact JSON schema and IDs.';continue;}throw e;}
  const editor=structuredClone(input),drafts=new Map(result.entries.map(e=>[e.id,e]));
  editor.messages[0].content+='\nFINAL BILINGUAL EDITOR: Each user entry contains the exact English source plus draft zh and ja. Check both drafts against that English and correct any meaning, sequence, qualification, vegetarian-policy or natural-language problem. Keep planned vs completed and every reserved token. Prefer natural concise local public wording; never add or infer facts. Return only the same entries JSON schema with corrected zh/ja.';
  editor.messages[1].content=JSON.stringify({entries:JSON.parse(input.messages[1].content).entries.map(e=>({...e,zh:drafts.get(e.id).zh,ja:drafts.get(e.id).ja}))});
  if(Date.now()>=deadline)throw unavailable();await claimAttempt(DB,now);
  const edited=await infer(AI,editor,deadline);
  try{output=validateEntryResult(entries,parseResult(edited),{masked:true});}catch(e){if(attempt===0){input.messages[0].content+='\nThe final editor output failed validation. Keep all reserved tokens and the exact entry structure.';continue;}throw e;}
  try{await DB.batch([DB.prepare('INSERT OR REPLACE INTO programme_translation_cache (cache_key,translations_json,created_at) VALUES (?,?,?)').bind(key,JSON.stringify(output),now),DB.prepare('DELETE FROM programme_translation_cache WHERE created_at<? OR cache_key NOT IN (SELECT cache_key FROM programme_translation_cache ORDER BY created_at DESC LIMIT 100)').bind(now-30*86400000),DB.prepare('DELETE FROM programme_translation_attempts WHERE created_at<?').bind(now-86400000)]);}catch{throw unavailable();}
  return output;
 }
 throw bad();
}
export async function translateDepartmentNotes(changed,env){
 const result=await translateEntries(translationEntries(changed),env,'notes');
 return validateTranslationResult(changed,result);
}
export async function translateSnapshotNotes(changed,env){return translateEntries(snapshotTranslationEntries(changed),env,'snapshots');}
