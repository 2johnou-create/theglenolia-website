import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {ProgrammeError, fetchProgramme, fetchPublicProgramme, normaliseProgramme, validateProgramme, saveProgramme, publishProgramme, trialStages, seedStages} from './programme-store.mjs';

const actor='john@theglenolia.com.au', now='2026-10-17T14:30:00.000Z';
function initial() {
  return {version:1,updatedAt:'2026-10-17',departments:Object.fromEntries(['cafe','coffee','workshops','local'].map(id=>[id,{status:id==='coffee'?'trialling':'planning',translations:Object.fromEntries(['en','zh','ja'].map(language=>[language,{now:id+' preparations are being reviewed.',next:'The next confirmed step will be shared.',done:[]}]))}])),coffee:{seedVarieties:['IPR107','NR25','Marsellesa'],seedStage:'seed',trialName:'Paraíso',trialStage:'seedling',heightCm:20,observedOn:'2026-10-17'}};
}
function database() {
  const sqlite=new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('./migrations/003-programme.sql',import.meta.url),'utf8'));
  const queries=[];
  const db={prepare(sql){
    queries.push(sql);
    const stmt=sqlite.prepare(sql);let values=[];
    return {bind(...args){values=args;return this;},async first(){return stmt.get(...values)||null;},async all(){return {results:stmt.all(...values)};},async run(){return this._run();},_run(){return {meta:{changes:Number(stmt.run(...values).changes)}};}};
  },async batch(statements){
    sqlite.exec('BEGIN IMMEDIATE');
    try {const results=statements.map(s=>s._run());sqlite.exec('COMMIT');return results;}
    catch(error){sqlite.exec('ROLLBACK');throw error;}
  }};
  return {db,sqlite,queries,audit:()=>sqlite.prepare('SELECT action,revision,published_revision,actor,created_at FROM programme_audit ORDER BY id').all().map(row=>({...row}))};
}
const expectError=(status,code)=>(error)=>error instanceof ProgrammeError&&error.status===status&&error.code===code;
const save=(db,programme,expectedRevision=0,options={})=>saveProgramme(db,{programme,expectedRevision},{actor,now,initial:initial(),...options});
const publish=(db,expectedRevision=1,options={})=>publishProgramme(db,{expectedRevision,actor,now,initial:initial(),...options});

test('empty storage uses only the reviewed baseline and never writes on a read',async()=>{
  const {db,sqlite,queries}=database(), baseline=initial();
  const state=await fetchProgramme(db,baseline);
  assert.equal(state.revision,0);assert.equal(state.publishedRevision,0);
  assert.deepEqual(state.draft,baseline);assert.deepEqual(state.published,baseline);
  state.draft.departments.cafe.translations.en.now='A local edit';
  assert.notEqual(state.published.departments.cafe.translations.en.now,'A local edit');
  const publicData=await fetchPublicProgramme(db,baseline);
  assert.deepEqual(Object.keys(publicData).sort(),['coffee','departments','publishedAt','updatedAt','version']);
  assert.equal(publicData.publishedAt,null);assert.equal(publicData.coffee.heightCm,20);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM programme_state').get().n,0);
  assert.ok(queries.every(sql=>sql.startsWith('SELECT')));
});

test('new draft edits stay private until the exact saved revision is published',async()=>{
  const {db,audit,queries}=database(), draft=initial();
  draft.departments.cafe.translations.en.now='Private proposal for a future café.';
  const saved=await save(db,draft);
  assert.equal(saved.revision,1);assert.equal(saved.publishedRevision,0);
  assert.equal(saved.draft.departments.cafe.translations.en.now,draft.departments.cafe.translations.en.now);
  const publicBefore=await fetchPublicProgramme(db,initial());
  assert.notEqual(publicBefore.departments.cafe.translations.en.now,draft.departments.cafe.translations.en.now);
  const published=await publish(db);
  assert.equal(published.publishedRevision,1);
  const publicAfter=await fetchPublicProgramme(db);
  assert.equal(publicAfter.departments.cafe.translations.en.now,draft.departments.cafe.translations.en.now);
  assert.equal(publicAfter.publishedAt,now);assert.equal(publicAfter.updatedAt,'2026-10-18');
  assert.deepEqual(audit().map(x=>x.action),['save','publish']);
  assert.ok(audit().every(x=>x.actor===actor&&x.created_at===now));
  assert.equal(JSON.stringify(publicAfter).includes(actor),false);
  assert.equal(JSON.stringify(publicAfter).includes('revision'),false);
  assert.equal(JSON.stringify(publicAfter).includes('draft'),false);
  assert.ok(queries.at(-1).startsWith('SELECT published_json,published_at'));
});

test('a later draft keeps the existing public release intact and clearing content is allowed in drafts',async()=>{
  const {db}=database();await save(db,initial());await publish(db);
  const second=(await fetchProgramme(db)).draft;
  second.departments.workshops.translations.en.now='';
  second.departments.workshops.translations.en.next='';
  second.departments.workshops.translations.en.done=['  '];
  second.coffee.observedOn='';
  const result=await save(db,second,1);
  assert.equal(result.revision,2);assert.equal(result.publishedRevision,1);
  assert.deepEqual(result.draft.departments.workshops.translations.en.done,[]);
  assert.equal(result.draft.coffee.observedOn,'');
  assert.notEqual((await fetchPublicProgramme(db)).departments.workshops.translations.en.now,'');
  await assert.rejects(publish(db,2),expectError(400,'invalid_programme'));
  assert.equal((await fetchPublicProgramme(db)).publishedAt,now);
});

test('all three translations and aligned completed items are required before publication',async()=>{
  const {db}=database(), draft=initial();
  draft.departments.local.translations.ja.next='';
  await save(db,draft);await assert.rejects(publish(db),expectError(400,'invalid_programme'));
  const complete=initial();
  complete.departments.local.translations.en.done=['A planning meeting was held.'];
  assert.equal(validateProgramme(complete),true);
  assert.equal(validateProgramme(complete,{complete:true}),false);
  for(const language of ['en','zh','ja'])complete.departments.local.translations[language].done=['A planning meeting was held.'];
  assert.equal(validateProgramme(complete,{complete:true}),true);
});

test('simultaneous first saves and stale updates cannot overwrite another editor or create false audits',async()=>{
  const {db,audit}=database(), a=initial(), b=initial();
  a.departments.cafe.status='developing';b.departments.cafe.status='ready';
  const result=await Promise.allSettled([save(db,a),save(db,b)]);
  assert.equal(result.filter(r=>r.status==='fulfilled').length,1);
  assert.ok(result.find(r=>r.status==='rejected').reason instanceof ProgrammeError);
  assert.equal(result.find(r=>r.status==='rejected').reason.status,409);
  assert.equal(audit().length,1);
  await assert.rejects(save(db,b,0),expectError(409,'changed_elsewhere'));
  assert.equal((await fetchProgramme(db)).draft.departments.cafe.status,'developing');
  await save(db,b,1);await assert.rejects(save(db,a,1),expectError(409,'changed_elsewhere'));
  assert.equal(audit().length,2);assert.equal((await fetchProgramme(db)).revision,2);
});

test('publishing is idempotent and simultaneous publication never adds duplicate audit records',async()=>{
  const {db,audit}=database();await save(db,initial());
  const results=await Promise.allSettled([publish(db),publish(db)]);
  assert.ok(results.some(r=>r.status==='fulfilled'));
  for(const r of results.filter(r=>r.status==='rejected'))assert.equal(r.reason.status,409);
  assert.equal(audit().filter(x=>x.action==='publish').length,1);
  const before=await fetchPublicProgramme(db);
  await publish(db,1,{now:'2026-10-20T00:00:00Z'});
  assert.deepEqual(await fetchPublicProgramme(db),before);
  assert.equal(audit().filter(x=>x.action==='publish').length,1);
});

test('a draft saved during a publication race prevents publishing unreviewed content',async()=>{
  const {db,audit}=database();await save(db,initial());
  const batch=db.batch.bind(db);let changed=false;
  db.batch=async statements=>{
    if(!changed){changed=true;const replacement=initial();replacement.departments.cafe.translations.en.now='A new private draft';await save(db,replacement,1);}
    return batch(statements);
  };
  await assert.rejects(publish(db,1),expectError(409,'changed_elsewhere'));
  assert.equal((await fetchProgramme(db)).revision,2);
  assert.notEqual((await fetchPublicProgramme(db)).departments.cafe.translations.en.now,'A new private draft');
  assert.equal(audit().filter(x=>x.action==='publish').length,0);
});

test('audit failure rolls the state change back in the same transaction',async()=>{
  const {db,sqlite,audit}=database();await save(db,initial());
  sqlite.exec("CREATE TRIGGER reject_audit BEFORE INSERT ON programme_audit BEGIN SELECT RAISE(ABORT,'audit unavailable'); END;");
  const revised=initial();revised.coffee.heightCm=25;
  await assert.rejects(save(db,revised,1),expectError(503,'programme_unavailable'));
  assert.equal((await fetchProgramme(db)).revision,1);
  assert.equal((await fetchProgramme(db)).draft.coffee.heightCm,20);
  await assert.rejects(publish(db),expectError(503,'programme_unavailable'));
  assert.equal((await fetchProgramme(db)).publishedRevision,0);
  assert.equal(audit().length,1);
});

test('validation rejects field injection, missing departments/locales, HTML, URLs and excessive copy',()=>{
  const mutations=[
    p=>p.departments.cafe.extra='ignored?',
    p=>p.departments.extras={status:'ready'},
    p=>delete p.departments.local,
    p=>delete p.departments.cafe.translations.ja,
    p=>p.departments.cafe.translations.en.extra='not allowed',
    p=>p.departments.cafe.translations.en.now='<img src=x onerror=alert(1)>',
    p=>p.departments.cafe.translations.en.next='See https://external.example/path',
    p=>p.departments.cafe.translations.en.now='Visit cafe.example for details',
    p=>p.departments.cafe.translations.en.now='Check www.example.xyz',
    p=>p.departments.cafe.translations.en.now='x'.repeat(281),
    p=>p.departments.cafe.translations.en.done=['x'.repeat(121)],
    p=>p.departments.cafe.translations.en.done=['a','b','c','d','e'],
    p=>p.departments.cafe.status='operating',
    p=>p.coffee.seedVarieties=['IPR107','NR25','Different cultivar'],
    p=>p.coffee.trialName='Another trial',
    p=>p.coffee.seedStage='finished',
    p=>p.coffee.trialStage='complete',
    p=>p.coffee.heightCm=-1,
    p=>p.coffee.heightCm=301,
    p=>p.coffee.heightCm='20',
    p=>p.coffee.heightCm=NaN,
    p=>p.coffee.observedOn='2026-02-30',
    p=>p.updatedAt='today',
    p=>p.owner='john@theglenolia.com.au',
  ];
  assert.equal(validateProgramme(initial(),{complete:true}),true);
  for(const mutate of mutations){const document=initial();mutate(document);assert.equal(validateProgramme(document),false,mutate.toString());}
  for(const stage of trialStages){const document=initial();document.coffee.trialStage=stage;assert.equal(validateProgramme(document),true);}
  for(const height of [0,20,20.5,300]){const document=initial();document.coffee.heightCm=height;assert.equal(validateProgramme(document),true);}
  const unicode=initial();unicode.departments.cafe.translations.zh.now='綠'.repeat(280);assert.equal(validateProgramme(unicode),true);
  unicode.departments.cafe.translations.zh.now+='綠';assert.equal(validateProgramme(unicode),false);
});

test('invalid input, revision and metadata never write; missing translations cannot be injected through publish',async()=>{
  const {db,audit}=database();
  for(const expectedRevision of [-1,0.5,'0',null])await assert.rejects(saveProgramme(db,{programme:initial(),expectedRevision},{actor,now}),expectError(400,'invalid_programme'));
  await assert.rejects(saveProgramme(db,{programme:initial(),expectedRevision:0,extra:true},{actor,now}),expectError(400,'invalid_programme'));
  await assert.rejects(saveProgramme(db,{programme:initial(),expectedRevision:0},{actor:'',now}),expectError(400,'invalid_programme'));
  await assert.rejects(saveProgramme(db,{programme:initial(),expectedRevision:0},{actor,now:'not a date'}),expectError(400,'invalid_programme'));
  assert.equal(audit().length,0);
  await assert.rejects(publish(db,0),expectError(409,'save_before_publish'));
});

test('unavailable database, missing publication and corrupt rows fail closed without draft fallback',async()=>{
  const {db,sqlite}=database();
  await assert.rejects(fetchProgramme(db),expectError(503,'programme_unavailable'));
  await assert.rejects(fetchPublicProgramme(db),expectError(503,'programme_unavailable'));
  for(const broken of [null,{prepare(){throw Error('private database detail');}}]){
    await assert.rejects(fetchPublicProgramme(broken,initial()),expectError(503,'programme_unavailable'));
    await assert.rejects(save(broken,initial()),expectError(503,'programme_unavailable'));
  }
  await saveProgramme(db,{programme:initial(),expectedRevision:0},{actor,now});
  await assert.rejects(fetchPublicProgramme(db),expectError(503,'programme_unavailable'));
  const noBatch={prepare:db.prepare};
  await assert.rejects(save(noBatch,initial(),1),expectError(503,'programme_unavailable'));
  sqlite.exec("UPDATE programme_state SET published_json='invalid private data'");
  await assert.rejects(fetchPublicProgramme(db,initial()),expectError(503,'programme_unavailable'));
});

test('read projection never includes unrecognized stored fields or silently repairs poisoned publication',async()=>{
  const {db,sqlite}=database();await save(db,initial());await publish(db);
  const poisoned=initial();poisoned.actor=actor;
  sqlite.prepare('UPDATE programme_state SET published_json=?').run(JSON.stringify(poisoned));
  await assert.rejects(fetchPublicProgramme(db,initial()),expectError(503,'programme_unavailable'));
  const changed=initial();changed.departments.cafe.translations.en.now='  Thoughtful preparations.  ';
  assert.equal(normaliseProgramme(changed).departments.cafe.translations.en.now,'Thoughtful preparations.');
});


test('the reviewed public seed document satisfies the same publish boundary',()=>{
  const seed=JSON.parse(readFileSync(new URL('../programme-content.json',import.meta.url),'utf8')).initial;
  assert.equal(validateProgramme(seed,{complete:true}),true);
  assert.deepEqual(seed.coffee.seedVarieties,['IPR107','NR25','Marsellesa']);
  assert.equal(seed.coffee.seedStage,'seed');assert.equal(seed.coffee.trialName,'Paraíso');
  assert.equal(seed.coffee.trialStage,'seedling');assert.equal(seed.coffee.heightCm,20);
});


test('the three-variety seed group can publish every growing stage and skip optional grafting',async()=>{
  assert.deepEqual(seedStages,trialStages);
  assert.equal(seedStages.length,8);
  for(const stage of seedStages){const document=initial();document.coffee.seedStage=stage;assert.equal(validateProgramme(document,{complete:true}),true,stage);}
  const {db}=database();let revision=0;
  for(const stage of ['seed','germinating','seedling','growing','flowering','cherries','harvest']){
    const document=initial();document.coffee.seedStage=stage;
    const saved=await save(db,document,revision);revision=saved.revision;
    await publish(db,revision);
    const published=await fetchPublicProgramme(db);
    assert.equal(published.coffee.seedStage,stage);
    assert.deepEqual(published.coffee.seedVarieties,['IPR107','NR25','Marsellesa']);
    assert.equal(published.coffee.trialStage,'seedling');
    assert.equal(published.coffee.heightCm,20);
  }
});
