import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {ProgrammeError,fetchPublicProgramme} from './programme-store.mjs';
import {translationModel,translationRequest,translationEntries,validateTranslationResult,translateDepartmentNotes} from './programme-translation.mjs';

const now=Date.parse('2026-10-17T01:00:00.000Z'),day=86400000;
const expectError=(status,code)=>(error)=>error instanceof ProgrammeError&&error.status===status&&error.code===code;
const changed=(suffix='')=>({coffee:{now:'John Ou is observing Paraíso seedlings around 20 cm tall.'+suffix,next:'Record the next confirmed observation.',done:[]}});
const plainResult=source=>({entries:translationEntries(source).map(({id,text})=>({id,zh:'籌備：'+text,ja:'準備：'+text}))});
const maskedResult=input=>({entries:JSON.parse(input.messages.find(m=>m.role==='user').content).entries.map(({id,text})=>({id,zh:'籌備：'+text,ja:'準備：'+text}))});
function fakeAI(respond=maskedResult){
 const calls=[];
 return {calls,async run(model,input){calls.push({model,input:structuredClone(input)});return respond(input,calls.length);}};
}
function database(t){
 const sqlite=new DatabaseSync(':memory:');
 for(const name of ['003-programme.sql','005-programme-translations.sql'])sqlite.exec(readFileSync(new URL('./migrations/'+name,import.meta.url),'utf8'));
 t.after(()=>sqlite.close());
 const queries=[];
 const db={prepare(sql){
  queries.push(sql);const statement=sqlite.prepare(sql);let values=[];
  return {bind(...args){values=args;return this;},async first(){return statement.get(...values)||null;},async all(){return {results:statement.all(...values)};},async run(){return this._run();},_run(){return {meta:{changes:Number(statement.run(...values).changes)}};}};
 },async batch(statements){
  sqlite.exec('BEGIN IMMEDIATE');
  try{const result=statements.map(s=>s._run());sqlite.exec('COMMIT');return result;}
  catch(error){sqlite.exec('ROLLBACK');throw error;}
 }};
 return {db,sqlite,queries,count:table=>sqlite.prepare('SELECT COUNT(*) AS n FROM '+table).get().n};
}

// Synthetic CJK-prefixed echoes exercise transport/masking/storage, not linguistic
// quality. Separate real-model evaluation is required for natural translations.
test('request masks proper names, repeated occurrences, numerals and units before model inference',()=>{
 const source={coffee:{now:'John Ou and John Ou observe Paraíso near Glenorie at 20 cm, 3 mm, 5 km/h, 50% and 18 °C.',next:'IPR107, NR25 and Marsellesa at THE GLENOLIA.',done:['The Glenolia and Dr Justin recorded 2026-10-17.']}};
 const request=translationRequest(source),payload=JSON.parse(request.messages[1].content);
 assert.equal(request.messages[0].role,'system');assert.match(request.messages[0].content,/sole factual authority/);
 assert.equal(request.stream,false);assert.equal(request.response_format.type,'json_schema');
 assert.deepEqual(payload.entries.map(e=>e.id),['coffee.now','coffee.next','coffee.done.0']);
 assert.equal(payload.entries[0].text.match(/__GLEN_[A-Z]+__/g).length,9);
 for(const term of ['John Ou','Paraíso','Glenorie','20 cm','3 mm','5 km/h','50%','18 °C'])assert.equal(payload.entries[0].text.includes(term),false,term);
 assert.equal(payload.entries[0].text.match(/__GLEN_A__/g).length,1);
 const output=validateTranslationResult(source,maskedResult(request),{masked:true});
 assert.equal(output.coffee.zh.now,'籌備：'+source.coffee.now);
 assert.equal(output.coffee.ja.done[0],'準備：'+source.coffee.done[0]);
 assert.equal(JSON.stringify(output).includes('__GLEN_'),false);
});

test('entries retain deterministic department/field/checklist identities without inventing empty completed items',()=>{
 const source={local:{now:'Review local interest.',next:'Confirm the next step.',done:['A first review was recorded.','A second review was recorded.']},cafe:{now:'Prepare the programme.',next:'Review details.',done:[]}};
 assert.deepEqual(translationEntries(source).map(e=>[e.id,e.maximum]),[['cafe.now',280],['cafe.next',280],['local.now',280],['local.next',280],['local.done.0',120],['local.done.1',120]]);
 const result=validateTranslationResult(source,plainResult(source));
 assert.deepEqual(result.cafe.zh.done,[]);assert.deepEqual(result.cafe.ja.done,[]);
 assert.equal(result.local.zh.done.length,2);
 assert.match(result.local.ja.done[0],/first/);assert.match(result.local.ja.done[1],/second/);
});

test('request input rejects invalid departments, incomplete entries and character/list overflows',()=>{
 const invalid=[null,{},[],{unknown:{now:'A',next:'B',done:[]}},
  {coffee:{now:'A',next:'B',done:[],extra:true}},
  {coffee:{now:'',next:'B',done:[]}},
  {coffee:{now:'A',next:null,done:[]}},
  {coffee:{now:'A',next:'B',done:['']}},
  {coffee:{now:'x'.repeat(281),next:'B',done:[]}},
  {coffee:{now:'A',next:'B',done:['x'.repeat(121)]}},
  {coffee:{now:'A',next:'B',done:['1','2','3','4','5']}}];
 for(const source of invalid)assert.throws(()=>translationRequest(source),expectError(502,'translation_invalid'));
});

test('Chinese is converted to Traditional while proper names, units and Japanese remain unchanged',()=>{
 const source={coffee:{now:'Paraíso seedlings are around 20 cm tall.',next:'Prepare a planting trial.',done:[]}};
 const result=validateTranslationResult(source,{entries:[{id:'coffee.now',zh:'Paraíso 幼苗约有 20 cm 高。',ja:'Paraísoの苗は高さ約20 cmです。'},{id:'coffee.next',zh:'筹备种植试验，关注发展。',ja:'栽培試験の準備を進めます。'}]});
 assert.equal(result.coffee.zh.now,'Paraíso 幼苗約有 20 cm 高。');
 assert.equal(result.coffee.zh.next,'籌備種植試驗，關注發展。');
 assert.equal(result.coffee.ja.next,'栽培試験の準備を進めます。');
});

test('Japanese Han-only labels and Latin proper-name lists are legitimate target text',()=>{
 const labels={cafe:{now:'Preparation.',next:'Confirmed.',done:[]}};
 const result=validateTranslationResult(labels,{entries:[{id:'cafe.now',zh:'籌備中',ja:'準備中'},{id:'cafe.next',zh:'已確認',ja:'確認済'}]});
 assert.equal(result.cafe.ja.now,'準備中');assert.equal(result.cafe.ja.next,'確認済');
 const names={coffee:{now:'IPR107, NR25, Marsellesa',next:'Paraíso',done:[]}};
 assert.equal(validateTranslationResult(names,{entries:[{id:'coffee.now',zh:'IPR107、NR25、Marsellesa',ja:'IPR107、NR25、Marsellesa'},{id:'coffee.next',zh:'Paraíso',ja:'Paraíso'}]}).coffee.ja.next,'Paraíso');
});

test('natural month and count localization may use Arabic numerals without losing source numerals',()=>{
 const source={cafe:{now:'Opening is targeted for September 2027.',next:'Review three proposed sessions.',done:[]}};
 const value={entries:[{id:'cafe.now',zh:'開幕目標是2027年9月。',ja:'2027年9月のオープンを目指しています。'},{id:'cafe.next',zh:'了解3場擬議活動。',ja:'提案中の3回の内容を確認します。'}]};
 assert.equal(validateTranslationResult(source,value).cafe.zh.next,'瞭解3場擬議活動。');
 value.entries[0].ja='2028年9月のオープンを目指しています。';
 assert.throws(()=>validateTranslationResult(source,value),expectError(502,'translation_invalid'));
});

test('Traditional prose containing contextual shared Han characters is not rejected by a character blacklist',()=>{
 const source={local:{now:'Do not interfere.',next:"Review the queen's note.",done:[]}};
 const value={entries:[{id:'local.now',zh:'不要干涉。',ja:'干渉しないでください。'},{id:'local.next',zh:'查看皇后的備註。',ja:'女王のメモを確認します。'}]};
 const output=validateTranslationResult(source,value);
 assert.equal(output.local.zh.now,'不要干涉。');assert.equal(output.local.zh.next,'查看皇后的備註。');
});

test('name-only lists may localize English conjunctions as punctuation without adding CJK prose',()=>{
 const source={coffee:{now:'IPR107 and NR25',next:'Paraíso',done:[]}};
 const result=validateTranslationResult(source,{entries:[{id:'coffee.now',zh:'IPR107、NR25',ja:'IPR107、NR25'},{id:'coffee.next',zh:'Paraíso',ja:'Paraíso'}]});
 assert.equal(result.coffee.zh.now,'IPR107、NR25');
});

test('lost or invented names, numerals and measurement units reject the whole paired translation',()=>{
 const source=changed();
 const mutations=[
  value=>value.entries[0].zh=value.entries[0].zh.replace('John Ou','John'),
  value=>value.entries[0].ja=value.entries[0].ja.replace('Paraíso','Paraiso'),
  value=>value.entries[0].zh=value.entries[0].zh.replace('20','21'),
  value=>value.entries[0].ja=value.entries[0].ja.replace('20 cm','20'),
  value=>value.entries[0].zh+=' John Ou',
  value=>value.entries[1].ja+=' 5',
 ];
 for(const mutate of mutations){const value=plainResult(source);mutate(value);assert.throws(()=>validateTranslationResult(source,value),expectError(502,'translation_invalid'));}
});

test('John leading with consultants cannot become co-leadership, while explicit joint leadership stays faithful',()=>{
 const source={coffee:{now:'John Ou is leading the trial with plantation consultants.',next:'Record the next observation.',done:[]}};
 const value={entries:[{id:'coffee.now',zh:'John Ou 主導試種，並與咖啡種植顧問共同推進。',ja:'John Ouが試験を主導し、栽培コンサルタントと協力しています。'},{id:'coffee.next',zh:'記錄下一次觀察。',ja:'次の観察を記録します。'}]};
 assert.match(validateTranslationResult(source,value).coffee.zh.now,/John Ou 主導/);
 for(const term of ['共同主導','共同領導']){
  const changedRole=structuredClone(value);changedRole.entries[0].zh='John Ou 與咖啡種植顧問'+term+'試種。';
  assert.throws(()=>validateTranslationResult(source,changedRole),expectError(502,'translation_invalid'));
 }
 const explicitlyJoint={coffee:{...source.coffee,now:'John Ou and plantation consultants jointly lead the trial.'}};
 value.entries[0].zh='John Ou 與咖啡種植顧問共同主導試種。';
 assert.match(validateTranslationResult(explicitlyJoint,value).coffee.zh.now,/共同主導/);
});

test('masked outputs reject lost, duplicated or unknown reserved tokens',()=>{
 const source=changed(),request=translationRequest(source);
 for(const mutate of [v=>v.entries[0].zh=v.entries[0].zh.replace('__GLEN_A__',''),v=>v.entries[0].ja+=' __GLEN_A__',v=>v.entries[0].ja=v.entries[0].ja.replace('__GLEN_A__','__GLEN_Z__')]){
  const value=maskedResult(request);mutate(value);
  assert.throws(()=>validateTranslationResult(source,value,{masked:true}),expectError(502,'translation_invalid'));
 }
});

test('extra, missing, duplicated or substituted field identities cannot change the requested document',()=>{
 const source=changed();
 const mutations=[v=>v.extra=true,v=>v.entries.push({...v.entries[0],id:'cafe.now'}),v=>v.entries.pop(),v=>v.entries[1].id=v.entries[0].id,v=>v.entries[1].id='coffee.done.0',v=>v.entries[0].extra=true,v=>delete v.entries[0].ja];
 for(const mutate of mutations){const value=plainResult(source);mutate(value);assert.throws(()=>validateTranslationResult(source,value),expectError(502,'translation_invalid'));}
 const reversed=plainResult(source);reversed.entries.reverse();
 assert.equal(validateTranslationResult(source,reversed).coffee.ja.now,'準備：'+source.coffee.now);
});

test('English-only prose, blank languages, Japanese in Chinese and unsafe output cannot be accepted',()=>{
 const source=changed();
 const mutations=[v=>v.entries[0].ja=source.coffee.now,v=>v.entries[1].zh=' ',v=>v.entries[1].zh='準備します',v=>v.entries[1].ja='<b>準備中</b>',v=>v.entries[1].zh='籌備\n消息',v=>v.entries[1].ja='確認 https://example.test',v=>v.entries[1].zh='備註：'+'文'.repeat(281)];
 for(const mutate of mutations){const value=plainResult(source);mutate(value);assert.throws(()=>validateTranslationResult(source,value),expectError(502,'translation_invalid'));}
});

test('successful inference uses the declared model, rehydrates both locales and reuses paired cache without AI or quota',async t=>{
 const {db,count,sqlite}=database(t),AI=fakeAI(),source=changed();
 const first=await translateDepartmentNotes(source,{AI,DB:db,now});
 assert.equal(AI.calls.length,2);assert.equal(AI.calls[0].model,translationModel);
 assert.match(AI.calls[1].input.messages[0].content,/FINAL BILINGUAL EDITOR/);
 assert.ok(JSON.parse(AI.calls[1].input.messages[1].content).entries.every(e=>typeof e.text==='string'&&typeof e.zh==='string'&&typeof e.ja==='string'));
 assert.equal(first.coffee.zh.now,'籌備：'+source.coffee.now);assert.equal(first.coffee.ja.now,'準備：'+source.coffee.now);
 assert.equal(count('programme_translation_cache'),1);assert.equal(count('programme_translation_attempts'),2);
 const cached=await translateDepartmentNotes(source,{DB:db,now:now+1});
 assert.deepEqual(cached,first);assert.equal(count('programme_translation_attempts'),2);
 const stored=JSON.parse(sqlite.prepare('SELECT translations_json FROM programme_translation_cache').get().translations_json);
 assert.ok(stored.entries.every(e=>typeof e.zh==='string'&&typeof e.ja==='string'));
 assert.equal(JSON.stringify(stored).includes('__GLEN_'),false);
});

test('a malformed generation is retried once and only a validated editor pair is cached',async t=>{
 const {db,count}=database(t),AI=fakeAI((input,n)=>n===1?{entries:[]}:maskedResult(input));
 await translateDepartmentNotes(changed(),{AI,DB:db,now});
 assert.equal(AI.calls.length,3);assert.match(AI.calls[1].input.messages[0].content,/prior output failed validation/i);
 assert.match(AI.calls[2].input.messages[0].content,/FINAL BILINGUAL EDITOR/);
 assert.equal(count('programme_translation_attempts'),3);assert.equal(count('programme_translation_cache'),1);
});

test('a second invalid result fails closed without caching either language',async t=>{
 const {db,count}=database(t),AI=fakeAI(()=>({entries:[]}));
 await assert.rejects(translateDepartmentNotes(changed(),{AI,DB:db,now}),expectError(502,'translation_invalid'));
 assert.equal(AI.calls.length,2);assert.equal(count('programme_translation_attempts'),2);assert.equal(count('programme_translation_cache'),0);
});

test('an invalid editor result retries the complete pipeline once before accepting the reviewed pair',async t=>{
 const {db,count}=database(t),AI=fakeAI((input,n)=>n===2?{entries:[]}:maskedResult(input));
 await translateDepartmentNotes(changed(),{AI,DB:db,now});
 assert.equal(AI.calls.length,4);assert.equal(count('programme_translation_attempts'),4);
 assert.match(AI.calls[2].input.messages[0].content,/final editor output failed validation/i);
 assert.equal(count('programme_translation_cache'),1);
});

test('two invalid editor results never cache a merely generated translation',async t=>{
 const {db,count}=database(t),AI=fakeAI((input,n)=>n%2===0?{entries:[]}:maskedResult(input));
 await assert.rejects(translateDepartmentNotes(changed(),{AI,DB:db,now}),expectError(502,'translation_invalid'));
 assert.equal(AI.calls.length,4);assert.equal(count('programme_translation_attempts'),4);
 assert.equal(count('programme_translation_cache'),0);
});

test('the final editor wording is returned and cached instead of the unreviewed generation',async t=>{
 const {db}=database(t),AI=fakeAI((input,n)=>{
  const value=maskedResult(input);
  if(n===2)for(const e of value.entries){e.zh=e.zh.replace('籌備：','核對：');e.ja=e.ja.replace('準備：','確認：');}
  return value;
 });
 const result=await translateDepartmentNotes(changed(),{AI,DB:db,now});
 assert.ok(result.coffee.zh.now.startsWith('核對：'));assert.ok(result.coffee.ja.now.startsWith('確認：'));
 assert.deepEqual(await translateDepartmentNotes(changed(),{DB:db,now:now+1}),result);
});

test('quota exhaustion between generation and review fails without caching an unreviewed pair',async t=>{
 const {db,sqlite,count}=database(t),AI=fakeAI();
 for(let i=0;i<5;i++)sqlite.prepare('INSERT INTO programme_translation_attempts VALUES (?,?)').run('previous-'+i,now);
 await assert.rejects(translateDepartmentNotes(changed(),{AI,DB:db,now}),expectError(429,'translation_limit'));
 assert.equal(AI.calls.length,1);assert.equal(count('programme_translation_attempts'),6);
 assert.equal(count('programme_translation_cache'),0);
});

test('valid response envelopes are parsed and truncated or non-JSON model responses never enter cache',async t=>{
 for(const envelope of [v=>({response:JSON.stringify(v)}),v=>({response:v}),v=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(v)}}]})]){
  const {db}=database(t),AI=fakeAI(input=>envelope(maskedResult(input)));
  const result=await translateDepartmentNotes(changed(),{AI,DB:db,now});assert.match(result.coffee.ja.now,/Paraíso/);
 }
 for(const response of ['not JSON','x'.repeat(30001),{choices:[{finish_reason:'length',message:{content:'{}'}}]}]){
  const {db,count}=database(t),AI=fakeAI(()=>response);
  await assert.rejects(translateDepartmentNotes(changed(),{AI,DB:db,now}),expectError(502,'translation_invalid'));
  assert.equal(AI.calls.length,2);assert.equal(count('programme_translation_cache'),0);
 }
});

test('missing AI or database and provider failures produce unavailable errors without false cache entries',async t=>{
 const {db,count}=database(t);
 await assert.rejects(translateDepartmentNotes(changed(),{DB:db,now}),expectError(503,'translation_unavailable'));
 assert.equal(count('programme_translation_attempts'),0);
 const AI=fakeAI();await assert.rejects(translateDepartmentNotes(changed(),{AI,now}),expectError(503,'translation_unavailable'));assert.equal(AI.calls.length,0);
 const failing=fakeAI(()=>{throw Error('provider unavailable');});
 await assert.rejects(translateDepartmentNotes(changed(),{AI:failing,DB:db,now}),expectError(503,'translation_unavailable'));
 assert.equal(failing.calls.length,1);assert.equal(count('programme_translation_cache'),0);
});

test('the editor shares the overall deadline rather than receiving a fresh forty-five seconds',async t=>{
 const {db,count}=database(t);let clock=now,settled=false;
 t.mock.timers.enable({apis:['setTimeout']});t.mock.method(Date,'now',()=>clock);
 const AI=fakeAI((input,n)=>{if(n===1){clock+=30000;return maskedResult(input);}return new Promise(()=>{});});
 const pending=translateDepartmentNotes(changed(),{AI,DB:db,now});
 pending.then(()=>{settled=true;},()=>{settled=true;});
 const rejected=assert.rejects(pending,expectError(503,'translation_unavailable'));
 for(let i=0;i<1000&&AI.calls.length<2;i++)await new Promise(resolve=>setImmediate(resolve));
 assert.equal(AI.calls.length,2);
 t.mock.timers.tick(14999);await Promise.resolve();assert.equal(settled,false);
 t.mock.timers.tick(1);await rejected;
 assert.equal(count('programme_translation_attempts'),2);assert.equal(count('programme_translation_cache'),0);
});

test('rolling allowance permits six model calls per minute and rejects a fourth translation pair before inference',async t=>{
 const {db,count}=database(t),AI=fakeAI();
 for(let i=0;i<3;i++)await translateDepartmentNotes(changed(' Note '+i+'.'),{AI,DB:db,now});
 await assert.rejects(translateDepartmentNotes(changed(' Fourth.'),{AI,DB:db,now:now+60000}),expectError(429,'translation_limit'));
 assert.equal(AI.calls.length,6);assert.equal(count('programme_translation_attempts'),6);
 await translateDepartmentNotes(changed(' After a minute.'),{AI,DB:db,now:now+60001});
 assert.equal(AI.calls.length,8);
});

test('daily allowance permits twenty uncached attempts and resets at the next UTC day',async t=>{
 const {db}=database(t),AI=fakeAI(),midnight=Math.floor(now/day)*day;
 for(let i=0;i<10;i++)await translateDepartmentNotes(changed(' Daily note '+i+'.'),{AI,DB:db,now:midnight+i*60001});
 await assert.rejects(translateDepartmentNotes(changed(' Daily over limit.'),{AI,DB:db,now:midnight+10*60001}),expectError(429,'translation_limit'));
 assert.equal(AI.calls.length,20);
 await translateDepartmentNotes(changed(' Next day.'),{AI,DB:db,now:midnight+day+1});assert.equal(AI.calls.length,22);
});

test('cached paired translations stay usable at quota while new content remains limited',async t=>{
 const {db}=database(t),AI=fakeAI(),source=changed();
 const first=await translateDepartmentNotes(source,{AI,DB:db,now});
 await translateDepartmentNotes(changed(' Second.'),{AI,DB:db,now});
 await translateDepartmentNotes(changed(' Third.'),{AI,DB:db,now});
 assert.deepEqual(await translateDepartmentNotes(source,{DB:db,now:now+1}),first);
 await assert.rejects(translateDepartmentNotes(changed(' Fourth.'),{AI,DB:db,now:now+1}),expectError(429,'translation_limit'));
 assert.equal(AI.calls.length,6);
});

test('cache expires at thirty days and future-dated rows are not trusted',async t=>{
 const {db,sqlite}=database(t),AI=fakeAI(),source=changed();
 const first=await translateDepartmentNotes(source,{AI,DB:db,now});
 assert.deepEqual(await translateDepartmentNotes(source,{DB:db,now:now+30*day-1}),first);
 await translateDepartmentNotes(source,{AI,DB:db,now:now+30*day});assert.equal(AI.calls.length,4);
 assert.equal(sqlite.prepare('SELECT created_at FROM programme_translation_cache').get().created_at,now+30*day);
 const later=now+30*day+60001;sqlite.prepare('UPDATE programme_translation_cache SET created_at=?').run(later+1);
 await translateDepartmentNotes(source,{AI,DB:db,now:later});assert.equal(AI.calls.length,6);
});

test('invalid cached JSON and cached translations with lost facts trigger fresh inference',async t=>{
 const lostFact=plainResult(changed());lostFact.entries[0].ja=lostFact.entries[0].ja.replace('20','21');
 for(const corrupt of ['not JSON',JSON.stringify({entries:[{id:'coffee.now',zh:'籌備',ja:'準備中'}]}),JSON.stringify(lostFact)]){
  const {db,sqlite}=database(t),AI=fakeAI(),source=changed();await translateDepartmentNotes(source,{AI,DB:db,now});
  sqlite.prepare('UPDATE programme_translation_cache SET translations_json=?').run(corrupt);
  const result=await translateDepartmentNotes(source,{AI,DB:db,now:now+1});
  assert.equal(AI.calls.length,4);assert.match(result.coffee.zh.now,/20 cm/);
 }
});

test('cache cleanup removes expired entries and retains no more than one hundred pairs',async t=>{
 const {db,sqlite,count}=database(t),insert=sqlite.prepare('INSERT INTO programme_translation_cache VALUES (?,?,?)');
 for(let i=0;i<105;i++)insert.run('recent-'+i,'{}',now-i*1000);
 insert.run('expired','{}',now-31*day);
 sqlite.prepare('INSERT INTO programme_translation_attempts VALUES (?,?)').run('old-attempt',now-day-1);
 await translateDepartmentNotes(changed(),{AI:fakeAI(),DB:db,now});
 assert.equal(count('programme_translation_cache'),100);
 assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM programme_translation_cache WHERE cache_key='expired'").get().n,0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_translation_cache WHERE created_at<?').get(now-30*day).n,0);
 assert.equal(sqlite.prepare("SELECT COUNT(*) AS n FROM programme_translation_attempts WHERE id='old-attempt'").get().n,0);
});

test('a database failure cannot create a partial paired cache or report successful translation',async t=>{
 const {db,sqlite,count}=database(t),AI=fakeAI();
 sqlite.exec("CREATE TRIGGER reject_translation_cache BEFORE INSERT ON programme_translation_cache BEGIN SELECT RAISE(ABORT,'cache unavailable'); END;");
 await assert.rejects(translateDepartmentNotes(changed(),{AI,DB:db,now}),expectError(503,'translation_unavailable'));
 assert.equal(AI.calls.length,2);assert.equal(count('programme_translation_attempts'),2);
 assert.equal(count('programme_translation_cache'),0);
});

test('translation caches and attempt ledgers never alter published programme data or expose private metadata',async t=>{
 const {db,sqlite,queries}=database(t),initial=JSON.parse(readFileSync(new URL('../programme-content.json',import.meta.url),'utf8')).initial;
 const before=await fetchPublicProgramme(db,initial);
 await translateDepartmentNotes(changed(),{AI:fakeAI(),DB:db,now});
 const after=await fetchPublicProgramme(db,initial);
 assert.deepEqual(after,before);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_audit').get().n,0);
 assert.equal(JSON.stringify(after).includes('cache_key'),false);assert.equal(JSON.stringify(after).includes('translation_attempts'),false);
 assert.ok(queries.filter(q=>/^(INSERT|UPDATE|DELETE)/.test(q)).every(q=>/programme_translation_(cache|attempts)/.test(q)));
});


const productSource=()=>({cafe:{now:'A 100 mL Magnolia room and linen spray and a 200 mL aroma diffuser are in preparation.',next:'Share visitor details.',done:['A fragrance spray on warm ivory.']}});
const productResult=()=>({entries:[
 {id:'cafe.now',zh:'Magnolia 空間與織品香氛噴霧 100 mL 與擴香 200 mL 正在籌備中。',ja:'Magnoliaの100 mLルーム＆リネンスプレーと200 mLアロマディフューザーを準備中です。'},
 {id:'cafe.next',zh:'分享到訪資訊。',ja:'来訪のご案内をお知らせします。'},
 {id:'cafe.done.0',zh:'暖象牙白背景中的香氛噴霧。',ja:'温かみのあるアイボリー背景のフレグランススプレー。'}
]});

test('product terminology is contextual, natural and retains all supplied Magnolia and mL facts',()=>{
 const source=productSource(),value=productResult(),result=validateTranslationResult(source,value);
 assert.match(result.cafe.zh.now,/空間與織品香氛噴霧/);assert.match(result.cafe.ja.now,/ルーム＆リネンスプレー/);
 const ampersand=productSource();ampersand.cafe.now=ampersand.cafe.now.replace('room and linen spray','room & linen spray');assert.doesNotThrow(()=>validateTranslationResult(ampersand,value));
 const ordinary={cafe:{now:'A room for conversation is being prepared.',next:'Review the next step.',done:[]}};
 assert.doesNotThrow(()=>validateTranslationResult(ordinary,{entries:[{id:'cafe.now',zh:'正在籌備交流空間。',ja:'会話を楽しむ部屋を準備中です。'},{id:'cafe.next',zh:'確認下一步。',ja:'次の段階を確認します。'}]}));
});

test('known literal product errors reject the entire paired result without enforcing one exact wording',()=>{
 const mutations=[
  r=>r.entries[0].zh=r.entries[0].zh.replace('空間與織品香氛噴霧','香氛房間與牀單噴霧'),
  r=>r.entries[0].ja=r.entries[0].ja.replace('ルーム＆リネンスプレー','香りの部屋と布団スプレー'),
  r=>r.entries[0].ja=r.entries[0].ja.replace('ルーム＆リネンスプレー','ルーム＆リネンスプレイ'),
  r=>r.entries[0].zh=r.entries[0].zh.replace('擴香','香氣擴散器'),
  r=>r.entries[0].ja=r.entries[0].ja.replace('アロマディフューザー','香りを拡散する機械'),
  r=>r.entries[1].zh=r.entries[1].zh.replace('到訪資訊','實務細節'),
  r=>r.entries[1].ja=r.entries[1].ja.replace('来訪のご案内','実務的な詳細'),
  r=>r.entries[2].zh=r.entries[2].zh.replace('香氛噴霧','香氣噴灑器'),
  r=>r.entries[2].ja=r.entries[2].ja.replace('フレグランススプレー','香りの噴射器'),
  r=>r.entries[0].ja+='香りの部屋。',
  r=>r.entries[0].zh+='床單噴霧。',
 ];
 for(const mutation of mutations){const value=productResult();mutation(value);assert.throws(()=>validateTranslationResult(productSource(),value),expectError(502,'translation_invalid'));}
});

test('generation and final editor receive the same approved product glossary and concise caption guidance',async t=>{
 const {db}=database(t),source=productSource();
 const localized=(text,language)=>text.replace(/room and linen spray/gi,language==='zh'?'空間與織品香氛噴霧':'ルーム＆リネンスプレー').replace(/aroma diffuser/gi,language==='zh'?'擴香':'アロマディフューザー').replace(/fragrance spray/gi,language==='zh'?'香氛噴霧':'フレグランススプレー').replace(/warm ivory/gi,language==='zh'?'暖象牙白':'温かみのあるアイボリー').replace(/visitor details/gi,language==='zh'?'到訪資訊':'来訪のご案内');
 const AI=fakeAI(input=>({entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'籌備：'+localized(text,'zh'),ja:'準備：'+localized(text,'ja')}))}));
 await translateDepartmentNotes(source,{AI,DB:db,now});assert.equal(AI.calls.length,2);
 for(const {input}of AI.calls){const prompt=input.messages[0].content;for(const term of ['空間與織品香氛噴霧','ルーム＆リネンスプレー','擴香','アロマディフューザー','香氛噴霧','フレグランススプレー','暖象牙白','温かみのあるアイボリー','到訪資訊','来訪のご案内','Magnolia','mL'])assert.ok(prompt.includes(term),term);assert.match(prompt,/Avoid redundant literal/);assert.match(prompt,/Never add promises/);}
 assert.match(AI.calls[1].input.messages[0].content,/FINAL BILINGUAL EDITOR/);
});


test('official English product names and natural typography variants remain valid in localized prose',()=>{
 const source={cafe:{now:'Magnolia Fragrance Spray on warm ivory.',next:'Review the Magnolia room and linen spray.',done:['Magnolia Aroma Diffuser.']}};
 const value={entries:[
  {id:'cafe.now',zh:'暖象牙白背景中的 Magnolia Fragrance Spray。',ja:'暖かなアイボリー背景に置いたMagnolia Fragrance Spray。'},
  {id:'cafe.next',zh:'了解 Magnolia 空間與織品香氛噴霧。',ja:'Magnoliaのルーム&リネンスプレーを確認します。'},
  {id:'cafe.done.0',zh:'Magnolia Aroma Diffuser 產品圖。',ja:'Magnolia Aroma Diffuserの商品イメージ。'}
 ]};
 assert.doesNotThrow(()=>validateTranslationResult(source,value));
 value.entries[1].ja=value.entries[1].ja.replace('&','＆');assert.doesNotThrow(()=>validateTranslationResult(source,value));
});

test('the bilingual editor can repair generation terminology before the final paired glossary guard',async t=>{
 const {db}=database(t),source={cafe:{now:'Magnolia room and linen spray.',next:'Review the next confirmed step.',done:[]}};
 const AI=fakeAI((input,n)=>({entries:JSON.parse(input.messages[1].content).entries.map(({id,text})=>({id,zh:'籌備：'+text.replace('room and linen spray','空間與織品香氛噴霧'),ja:'準備：'+text.replace('room and linen spray',n===1?'香りの部屋と布団スプレー':'ルーム&リネンスプレー')}))}));
 const output=await translateDepartmentNotes(source,{AI,DB:db,now});
 assert.equal(AI.calls.length,2,'generation reaches the editor instead of triggering a terminology retry');
 assert.match(output.cafe.ja.now,/ルーム&リネンスプレー/);assert.equal(output.cafe.ja.now.includes('布団'),false);
 const cached=await translateDepartmentNotes(source,{DB:db,now});assert.deepEqual(cached,output);
});
