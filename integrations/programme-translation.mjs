import OpenCC from 'opencc-js/cn2t';
import {ProgrammeError,departmentIds} from './programme-store.mjs';
import {translationSystemPrompt} from './programme-translation-prompt.mjs';
// Initialise once per isolate, rather than rebuilding dictionaries per request.
const traditional=OpenCC.Converter({from:'cn',to:'t'});
export const translationModel='@cf/qwen/qwen3-30b-a3b-fp8';
const promptVersion='glenolia-programmes-en-v3-editor';
const names=['THE GLENOLIA','The Glenolia','John Ou','Dr Justin','Glenorie','IPR107','NR25','Marsellesa','Paraíso'];
const own=(v,k)=>Object.hasOwn(v,k),plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const bad=()=>new ProgrammeError(502,'translation_invalid');
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
 const entries=translationEntries(changed);
 return {messages:[{role:'system',content:system},{role:'user',content:JSON.stringify({entries:entries.map(({id,text})=>({id,text:maskText(text).text}))})}],response_format:{type:'json_schema',json_schema:{type:'object',properties:{entries:{type:'array',minItems:entries.length,maxItems:entries.length,items:{type:'object',properties:{id:{type:'string',enum:entries.map(e=>e.id)},zh:{type:'string'},ja:{type:'string'}},required:['id','zh','ja'],additionalProperties:false}}},required:['entries'],additionalProperties:false}},stream:false,max_tokens:6000,temperature:.1};
}
function maskText(source){
 const values=[],escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const pattern=new RegExp(names.slice().sort((a,b)=>b.length-a.length).map(escape).join('|')+'|\\d+(?:[.,]\\d+)*(?:\\s?(?:km/h|cm|mm|°C|%))?','gu');
 const text=source.replace(pattern,value=>{let n=values.length,label='';do{label=String.fromCharCode(65+n%26)+label;n=Math.floor(n/26)-1;}while(n>=0);const token='__GLEN_'+label+'__';values.push({token,value});return token;});
 return {text,values};
}
function unmaskText(source,result){
 if(typeof result!=='string')throw bad();
 const {values}=maskText(source);
 if((result.match(/__GLEN_[A-Z]+__/gu)||[]).length!==values.length)throw bad();
 for(const {token,value}of values){if(count(result,token)!==1)throw bad();result=result.replace(token,value);}
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
function validateText(source,target,language,maximum){
 if(typeof target!=='string')throw bad();
 const result=(language==='zh'?traditional(target):target).normalize('NFC').trim();
 if(!result||[...result].length>maximum||/[<>\u0000-\u001f\u007f]/u.test(result)||/(?:[a-z][a-z\d+.-]*:\/\/|https?:|javascript:|data:|www\.|\/\/|\b(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}(?:\b|\/))/iu.test(result))throw bad();
 if(!sameNumbers(source,result))throw bad();
 for(const name of names)if(count(source,name)!==count(result,name))throw bad();
 for(const unit of ['cm','mm','km/h','%','°C']){const re=new RegExp('(?<![A-Za-z])'+unit.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z])','gu');if((source.match(re)||[]).length!==(result.match(re)||[]).length)throw bad();}
 let prose=source;for(const name of names)prose=prose.replaceAll(name,'');
 prose=prose.replace(/\d+(?:[.,]\d+)*/gu,'').replace(/(?:cm|mm|km\/h|°C)/g,'').replace(/\b(?:and|or)\b/gi,'');
 if(/[A-Za-z]{3}/u.test(prose)&&!/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}/u.test(result)&&source.trim()!=='A place to grow and gather.')throw bad();
 if(language==='zh'&&/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(result))throw bad();
 if(language==='zh'&&/John Ou\s+(?:is\s+)?lead(?:s|ing)?\b[\s\S]*\b(?:with|alongside)\b[\s\S]*consultants?/iu.test(source)&&/共同主導|共同領導/u.test(result))throw bad();
 return result;
}
export function validateTranslationResult(changed,value,{masked=false}={}){
 const entries=translationEntries(changed);
 if(!plain(value)||Object.keys(value).join(',')!=='entries'||!Array.isArray(value.entries)||value.entries.length!==entries.length)throw bad();
 const byId=new Map();
 for(const e of value.entries){if(!plain(e)||Object.keys(e).sort().join(',')!=='id,ja,zh'||typeof e.id!=='string'||byId.has(e.id))throw bad();byId.set(e.id,e);}
 const output={};
 for(const id of departmentIds)if(own(changed,id))output[id]={zh:{now:'',next:'',done:[]},ja:{now:'',next:'',done:[]}};
 for(const e of entries){const translated=byId.get(e.id);if(!translated)throw bad();const[id,field,index]=e.id.split('.');for(const lang of ['zh','ja']){const raw=masked?unmaskText(e.text,translated[lang]):translated[lang],text=validateText(e.text,raw,lang,e.maximum);if(field==='done')output[id][lang].done[Number(index)]=text;else output[id][lang][field]=text;}}
 return output;
}
function parseResult(result){
 if(result?.choices){if(result.choices.length!==1||result.choices[0].finish_reason==='length')throw bad();result=result.choices[0].message?.content;}
 else if(plain(result)&&own(result,'response'))result=result.response;
 if(typeof result==='string'){if(result.length>30000)throw bad();try{return JSON.parse(result);}catch{throw bad();}}
 return result;
}
async function cacheKey(changed){const canonical=JSON.stringify({model:translationModel,prompt:promptVersion,entries:translationEntries(changed)});return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical)))].map(n=>n.toString(16).padStart(2,'0')).join('');}
async function claimAttempt(DB,now){
 const day=Math.floor(now/86400000)*86400000;
 let r;try{r=await DB.prepare('INSERT INTO programme_translation_attempts (id,created_at) SELECT ?,? WHERE (SELECT COUNT(*) FROM programme_translation_attempts WHERE created_at>=?)<6 AND (SELECT COUNT(*) FROM programme_translation_attempts WHERE created_at>=?)<20').bind(crypto.randomUUID(),now,now-60000,day).run();}catch{throw unavailable();}
 if(Number(r?.meta?.changes)!==1)throw new ProgrammeError(429,'translation_limit');
}
async function infer(AI,input,deadline){
 let timer;try{return await Promise.race([AI.run(translationModel,input),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new ProgrammeError(503,'translation_unavailable')),Math.max(1,deadline-Date.now()));})]);}catch(e){if(e instanceof ProgrammeError)throw e;throw unavailable();}finally{clearTimeout(timer);}
}
/** Only authenticated admin calls this. Cache holds paired public-note translations. */
export async function translateDepartmentNotes(changed,{AI,DB,now=Date.now()}={}){
 const key=await cacheKey(changed);
 if(!DB?.prepare)throw unavailable();
 let cached;try{cached=await DB.prepare('SELECT translations_json,created_at FROM programme_translation_cache WHERE cache_key=?').bind(key).first();}catch{throw unavailable();}
 if(cached&&Number(cached.created_at)>now-30*86400000&&Number(cached.created_at)<=now){try{return validateTranslationResult(changed,JSON.parse(cached.translations_json));}catch{/* Never trust invalid cache contents. */}}
 if(!AI?.run)throw unavailable();
 const input=translationRequest(changed),deadline=Date.now()+45000;
 for(let attempt=0;attempt<2;attempt++){
  await claimAttempt(DB,now);
  const raw=await infer(AI,input,deadline);
  let output,result;
  try{result=parseResult(raw);validateTranslationResult(changed,result,{masked:true});}catch(e){if(attempt===0){input.messages[0].content+='\nA prior output failed validation. Preserve every reserved token exactly once per entry in both languages, along with all proper names, numerals and units; use complete natural Traditional Chinese/Japanese and the exact JSON schema and IDs.';continue;}throw e;}
  const editor=structuredClone(input),drafts=new Map(result.entries.map(e=>[e.id,e]));
  editor.messages[0].content+='\nFINAL BILINGUAL EDITOR: Each user entry contains the exact English source plus draft zh and ja. Check both drafts against that English and correct any meaning, sequence, qualification, vegetarian-policy or natural-language problem. Keep planned vs completed and every reserved token. Prefer natural concise local public wording; never add or infer facts. Return only the same entries JSON schema with corrected zh/ja.';
  editor.messages[1].content=JSON.stringify({entries:JSON.parse(input.messages[1].content).entries.map(e=>({...e,zh:drafts.get(e.id).zh,ja:drafts.get(e.id).ja}))});
  await claimAttempt(DB,now);
  const edited=await infer(AI,editor,deadline);
  try{output=validateTranslationResult(changed,parseResult(edited),{masked:true});}catch(e){if(attempt===0){input.messages[0].content+='\nThe final editor output failed validation. Keep all reserved tokens and the exact entry structure.';continue;}throw e;}
  try{await DB.batch([DB.prepare('INSERT OR REPLACE INTO programme_translation_cache (cache_key,translations_json,created_at) VALUES (?,?,?)').bind(key,JSON.stringify({entries:translationEntries(changed).map(({id})=>{const[d,f,i]=id.split('.');return{id,zh:f==='done'?output[d].zh.done[Number(i)]:output[d].zh[f],ja:f==='done'?output[d].ja.done[Number(i)]:output[d].ja[f]};})}),now),DB.prepare('DELETE FROM programme_translation_cache WHERE created_at<? OR cache_key NOT IN (SELECT cache_key FROM programme_translation_cache ORDER BY created_at DESC LIMIT 100)').bind(now-30*86400000),DB.prepare('DELETE FROM programme_translation_attempts WHERE created_at<?').bind(now-86400000)]);}catch{throw unavailable();}
  return output;
 }
 throw bad();
}
