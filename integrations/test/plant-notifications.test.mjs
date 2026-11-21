import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {authRoutes} from '../education-auth.mjs';
import {handleEducationMail} from '../education-mailer.mjs';
import worker from '../education-worker.mjs';
import {processPlantMail,enqueueMonthly,teacherPreferences,preferencesRoute,unsubscribeRoute,PRIVACY_VERSION,EDUCATION_VERSION} from '../plant-notifications.mjs';

const origin='https://glenolia-education.theglenolia.workers.dev';
const relayEnv={EDUCATION_MAIL_SECRET:'test-mail-secret',BREVO_API_KEY:'test-only',EDUCATION_ORIGIN:origin};
function setup(t){
 const sql=new DatabaseSync(':memory:'); t.after(()=>sql.close());
 for(const name of ['education-schema','plant-schema','plant-atlas-schema','plant-adoption-schema','plant-notifications-schema','plant-threads-schema','plant-thread-mail-schema'])
  sql.exec('BEGIN;'+readFileSync(new URL('../'+name+'.sql',import.meta.url),'utf8')+';COMMIT;');
 const db={prepare(query){
  return {query,args:[],bind(...args){return {...this,args};},async first(){return sql.prepare(query).get(...this.args)||null;},
   async all(){return {results:sql.prepare(query).all(...this.args)};},async run(){const {changes}=sql.prepare(query).run(...this.args);return {meta:{changes:Number(changes)}};}};
 },async batch(statements){sql.exec('BEGIN');try{const values=[];for(const s of statements)values.push({meta:{changes:Number(sql.prepare(s.query).run(...s.args).changes)}});sql.exec('COMMIT');return values;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const emails=[],transport=[],uid=()=>crypto.randomUUID(),past='2026-01-01T05:00:00.000Z';
 const env={EDU_DB:db,SESSION_KEY:'test-session-only',MAIL_SECRET:'test-mail-secret',APP_ORIGIN:origin,MAILER:{async fetch(req){
  emails.push(await req.clone().json());
  return handleEducationMail(req,relayEnv,async(url,opts)=>{assert.equal(url,'https://api.brevo.com/v3/smtp/email');transport.push(JSON.parse(opts.body));return new Response('{}',{status:201});});
 }}};
 const user=(name)=>{const id=uid(),email=id+'@example.test';sql.prepare('INSERT INTO edu_users(id,email,name,created_at,verified_at) VALUES(?,?,?,?,?)').run(id,email,name,past,past);return {id,email};};
 const alice=user('Teacher A'),ben=user('Teacher B'),charlie=user('Teacher C'),org=uid();
 sql.prepare("INSERT INTO edu_schools(id,name,kind,owner_id,status,created_at) VALUES(?,'Example School','school',?,'approved',?)").run(org,alice.id,past);
 sql.prepare("INSERT INTO edu_plant_organisations(id,master_id,name,suburb,school_type,created_at) VALUES(?,?,'Example School','Glenorie','primary',?)").run(org,alice.id,past);
 for(const u of [ben,charlie])sql.prepare('INSERT INTO edu_plant_members VALUES(?,?,?)').run(org,u.id,past);
 const accept=(key)=>{const [,r,n]=/^r(\d+)-p(\d+)$/.exec(key);sql.prepare('INSERT INTO edu_plants(plant_key,row_num,position,tag,verified_at) VALUES(?,?,?,?,?)').run(key,+r,+n,'T'+key,past);
  const app=uid();sql.prepare("INSERT INTO edu_plant_applications(id,teacher_id,workspace_id,school_name,suburb,school_type,plant_key,status,created_at,accepted_at) VALUES(?,?,?,'Example School','Glenorie','primary',?,'active',?,?)").run(app,alice.id,org,key,past,past);return app;};
 const prefs=(u,i,m,date=past)=>sql.prepare("INSERT INTO edu_teacher_preferences VALUES(?,?,?,?,?,?,'fixture')").run(u.id,PRIVACY_VERSION,EDUCATION_VERSION,+i,+m,date);
 const update=(key,date)=>{const id=uid();sql.prepare("INSERT INTO edu_plant_updates(id,plant_key,observed_on,note,created_at,request_hash) VALUES(?,?,?,'Private field note',?,?)").run(id,key,date,date+'T04:00:00.000Z',id);return id;};
 const request=(path,body,cookie='')=>new Request(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)});
 return {sql,db,env,emails,transport,uid,alice,ben,charlie,org,prefs,accept,update,request};
}
test('six-digit educator login is email and browser bound, attempt-limited, one-off, expiring and absent from the stored verifier',async t=>{
 const f=setup(t),path='/api/auth/request',verify='/api/auth/verify';
 const login=async email=>{const res=await authRoutes(f.request(path,{email,consent:true}),f.env,path);assert.equal(res.status,202);return {cookie:res.headers.get('Set-Cookie').split(';')[0],code:f.emails.at(-1).code};};
 const check=(email,code,cookie)=>authRoutes(f.request(verify,{email,code},cookie),f.env,verify);
 const a=await login(f.alice.email);
 assert.match(a.code,/^\d{6}$/);assert.ok(f.transport[0].textContent.includes(a.code));assert.ok(f.transport[0].htmlContent.includes(a.code));
 const stored=f.sql.prepare('SELECT verifier,token_hash,attempts FROM edu_auth_codes').get();assert.equal(stored.verifier.length,64);assert.notEqual(stored.verifier,a.code);
 await assert.rejects(check(f.alice.email,a.code,''),e=>e.code==='invalid_or_expired_code');
 await assert.rejects(check(f.ben.email,a.code,a.cookie),e=>e.code==='invalid_or_expired_code');
 assert.equal(f.sql.prepare('SELECT attempts FROM edu_auth_codes').get().attempts,0);
 const ok=await check(f.alice.email,a.code,a.cookie);assert.equal(ok.status,200);assert.equal((await ok.json()).user.email,f.alice.email);
 await assert.rejects(check(f.alice.email,a.code,a.cookie),e=>e.code==='invalid_or_expired_code');
 const b=await login(f.ben.email),wrong=b.code==='000000'?'000001':'000000';
 for(let i=0;i<5;i++)await assert.rejects(check(f.ben.email,wrong,b.cookie),e=>e.code==='invalid_or_expired_code');
 await assert.rejects(check(f.ben.email,b.code,b.cookie),e=>e.code==='invalid_or_expired_code');
 const c=await login(f.charlie.email);f.sql.prepare('UPDATE edu_auth_tokens SET expires_at=0 WHERE email=?').run(f.charlie.email);
 await assert.rejects(check(f.charlie.email,c.code,c.cookie),e=>e.code==='invalid_or_expired_code');
});
test('consent choices are explicit, optional, separate, versioned and audited once per real change',async t=>{
 const f=setup(t);assert.deepEqual(await teacherPreferences(f.db,f.alice.id),{privacyVersion:PRIVACY_VERSION,educationVersion:EDUCATION_VERSION,required:true,immediate:false,monthly:false});
 const save=b=>preferencesRoute(f.request('/api/teacher/preferences',b),f.env,f.alice,b);
 await assert.rejects(save({privacy:true,education:false,immediate:true,monthly:true}),e=>e.code==='required_consents');
 const both={privacy:true,education:true,immediate:false,monthly:true};
 assert.deepEqual(await (await save(both)).json(),{privacyVersion:PRIVACY_VERSION,educationVersion:EDUCATION_VERSION,required:false,immediate:false,monthly:true});
 await save(both);await save({...both,immediate:true});assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM edu_teacher_consent_history').get().n,2);
});
test('the real five-minute scheduled Worker releases and archives a school withdrawal without visitor traffic',async t=>{
 const f=setup(t),id=f.accept('r1-p7');
 const due=new Date(Date.now()-60000).toISOString();
 f.sql.prepare("UPDATE edu_plant_applications SET status='cooling',release_at=?,withdrawal_reason='Teaching term has ended' WHERE id=?").run(due,id);
 let work;
 worker.scheduled({cron:'*/5 * * * *',scheduledTime:Date.now()},f.env,{waitUntil(p){work=p;}});
 await work;
 const row=f.sql.prepare('SELECT status,released_at,changed_by FROM edu_plant_applications WHERE id=?').get(id);
 assert.equal(row.status,'released');assert.equal(row.released_at,due);assert.equal(row.changed_by,'automatic');
 assert.equal(f.sql.prepare("SELECT COUNT(*) AS n FROM edu_plant_events WHERE application_id=? AND action='released'").get(id).n,1);
 assert.equal(f.emails.length,0);
});
test('farmer journal insert queues one update for each opted-in current teacher, respects opt-out/retraction, and no student material leaves the portal',async t=>{
 const f=setup(t);f.accept('r1-p7');f.prefs(f.alice,true,false);f.prefs(f.ben,true,false);f.prefs(f.charlie,false,true);
 const id=f.update('r1-p7','2026-11-20');
 assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM edu_plant_mail_outbox WHERE kind='update'").get().n,2);
 const now=Date.now()+1000;
 await Promise.all([processPlantMail(f.env,now),processPlantMail(f.env,now)]);
 assert.deepEqual(f.emails.filter(e=>e.kind==='update').map(m=>m.email).sort(),[f.alice.email,f.ben.email].sort());
 for(const sent of f.transport.filter(x=>x.subject.includes('field note'))){assert.ok(sent.subject.includes('P7'));assert.ok(sent.headers['List-Unsubscribe-Post']);assert.ok(!sent.htmlContent.includes('Private field note'));assert.equal(sent.to.length,1);}
 const stop=f.emails.find(e=>e.email===f.alice.email).unsubscribePath;
 const show=await unsubscribeRoute(new Request(origin+stop),f.env,stop);assert.ok((await show.text()).includes('<form'));assert.equal((await teacherPreferences(f.db,f.alice.id)).immediate,true);
 const stop2=stop.slice(0,-5)+'00000';assert.equal((await unsubscribeRoute(new Request(origin+stop2),f.env,stop2)).status,404);
 const u=f.update('r1-p7','2026-11-21');await unsubscribeRoute(new Request(origin+stop,{method:'POST'}),f.env,stop);
 assert.equal(f.sql.prepare("SELECT state FROM edu_plant_mail_outbox WHERE reference=? AND user_id=?").get(u,f.alice.id).state,'cancelled');
 f.sql.prepare('UPDATE edu_plant_updates SET withdrawn=1 WHERE id=?').run(u);
 await processPlantMail(f.env,now+2000);assert.equal(f.emails.filter(e=>e.kind==='update').length,2);assert.ok(id);
});
test('one prior-month digest per school and teacher begins at nine Sydney time, includes distinct plants/counts, and never enrolls new members retrospectively',async t=>{
 const f=setup(t);f.accept('r1-p1');f.accept('r2-p1');f.prefs(f.alice,false,true);f.prefs(f.ben,false,false);f.prefs(f.charlie,false,true,'2027-01-01T00:00:00.000Z');
 f.update('r1-p1','2026-12-11'); f.update('r2-p1','2026-11-30');
 await enqueueMonthly(f.db,Date.parse('2026-12-31T21:59:00Z'));
 assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM edu_plant_mail_periods").get().n,0);
 const when=Date.parse('2026-12-31T22:00:00Z');
 await Promise.all([processPlantMail(f.env,when),processPlantMail(f.env,when)]);await processPlantMail(f.env,when+3600000);
 const monthly=f.emails.filter(e=>e.kind==='monthly');assert.equal(monthly.length,1);assert.equal(monthly[0].email,f.alice.email);
 assert.deepEqual(monthly[0].plants.map(p=>[p.plant,p.updates]),[['P1',1],['P20',0]]);assert.equal(monthly[0].period,'2026-12');
});
test('invite delivery requires a pending unexpired invitation and passes a neutral portal link, never a membership grant',async t=>{
 const f=setup(t),now=Date.now()+1000;
 for(const status of ['pending','revoked']){
  const id=f.uid();f.sql.prepare("INSERT INTO edu_plant_invitations VALUES(?,?,?,'pending',?,?,?)").run(id,f.org,status+'@example.test',new Date().toISOString(),new Date(now+80000).toISOString(),f.alice.id);
  if(status!=='pending')f.sql.prepare("UPDATE edu_plant_invitations SET status='revoked' WHERE id=?").run(id);
 }
 await processPlantMail(f.env,now);const invites=f.emails.filter(e=>e.kind==='invite');assert.equal(invites.length,1);assert.equal(invites[0].email,'pending@example.test');
 assert.ok(f.transport[0].textContent.includes('/#plant'));assert.ok(!f.transport[0].headers['List-Unsubscribe']);
});
test('retry definite rate rejection with same job key and retain uncertain outcomes without duplicate delivery attempts',async t=>{
 const f=setup(t);f.accept('r1-p7');f.prefs(f.alice,true,false);const first=f.update('r1-p7','2026-11-21');
 const attempts=[];let status=429;
 f.env.MAILER={async fetch(r){attempts.push(await r.json());return new Response('{}',{status});}};
 const now=Math.floor(Date.now()/1000)*1000+1000;await processPlantMail(f.env,now);await processPlantMail(f.env,now+1000);
 assert.equal(attempts.length,1);status=202;await processPlantMail(f.env,now+310000);assert.equal(attempts.length,2);assert.equal(attempts[0].jobId,attempts[1].jobId);
 assert.equal(f.sql.prepare('SELECT state FROM edu_plant_mail_outbox WHERE reference=?').get(first).state,'sent');
 const next=f.update('r1-p7','2026-11-21');status=503;await processPlantMail(f.env,now+311000);await processPlantMail(f.env,now+3600000);
 assert.equal(attempts.length,3);assert.equal(f.sql.prepare('SELECT state FROM edu_plant_mail_outbox WHERE reference=?').get(next).state,'review');
});

function conversation(f,applicationId){
 const threadId=f.uid(),at=new Date().toISOString();
 f.sql.prepare('INSERT INTO edu_plant_questions(id,application_id,question,created_at,submitted_by) VALUES(?,?,?,?,?)')
  .run(threadId,applicationId,'Private question text',at,f.alice.id);
 const follow=(teacher,on=true)=>f.sql.prepare(`INSERT INTO edu_plant_thread_follows(thread_id,user_id,following,changed_at) VALUES(?,?,?,?)
  ON CONFLICT(thread_id,user_id) DO UPDATE SET following=excluded.following,changed_at=excluded.changed_at`).run(threadId,teacher.id,+on,new Date().toISOString());
 const post=(side='farm')=>{
  const id=f.uid();
  f.sql.prepare('INSERT INTO edu_plant_thread_messages(id,thread_id,side,body,actor_id,created_at) VALUES(?,?,?,?,?,?)')
   .run(id,threadId,side,'Private reply text',side==='farm'?'farmer@example.test':f.alice.id,new Date().toISOString());
  return id;
 };
 return {threadId,follow,post};
}
test('farmer replies notify only followers of the original active adoption, separately from general emails, without exporting private messages',async t=>{
 const f=setup(t),app=f.accept('r1-p7');
 f.prefs(f.alice,false,false);f.prefs(f.ben,true,true);f.prefs(f.charlie,false,false);
 const c=conversation(f,app),other=conversation(f,app);
 c.follow(f.alice);other.follow(f.charlie);
 c.post('school');const reply=c.post();
 const q=f.sql.prepare('SELECT user_id,reference FROM edu_plant_thread_mail_outbox').all();
 assert.deepEqual(q.map(x=>[x.user_id,x.reference]),[[f.alice.id,reply]]);
 const now=Date.now()+1000;
 await Promise.all([processPlantMail(f.env,now),processPlantMail(f.env,now)]);
 const sent=f.emails.filter(x=>x.kind==='reply');assert.equal(sent.length,1);assert.equal(sent[0].email,f.alice.email);
 assert.equal(sent[0].threadId,c.threadId);
 const email=f.transport.find(x=>x.subject.includes('replied about P7'));assert.ok(email);
 assert.ok(email.textContent.includes('/#plant?orgId='+f.org+'&applicationId='+app+'&thread='+c.threadId));
 assert.ok(email.headers['List-Unsubscribe-Post']);assert.ok(!JSON.stringify(email).includes('Private reply'));assert.ok(!JSON.stringify(email).includes('Private question'));assert.ok(!JSON.stringify(email).includes('farmer@example.test'));
 const migration=readFileSync(new URL('../plant-thread-mail-schema.sql',import.meta.url),'utf8');
 f.sql.exec(migration);await processPlantMail(f.env,now+1000);
 assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM edu_plant_thread_mail_outbox WHERE state='sent'").get().n,1);
});
test('signed per-thread unsubscribe confirms on GET and cancels only that follower and conversation, including pending jobs',async t=>{
 const f=setup(t),app=f.accept('r2-p2'),c=conversation(f,app),other=conversation(f,app);
 f.prefs(f.alice,true,true);f.prefs(f.ben,false,false);c.follow(f.alice);other.follow(f.alice);c.follow(f.ben);
 c.post();const now=Date.now()+1000;await processPlantMail(f.env,now);
 const stop=f.emails.find(x=>x.kind==='reply'&&x.email===f.alice.email).unsubscribePath;
 const shown=await unsubscribeRoute(new Request(origin+stop),f.env,stop);assert.equal(shown.status,200);assert.match(await shown.text(),/<form/);
 assert.equal((await unsubscribeRoute(new Request(origin+stop.replace(c.threadId,other.threadId)),f.env,stop.replace(c.threadId,other.threadId))).status,404);
 const next=c.post(),nextOther=other.post();
 assert.equal((await unsubscribeRoute(new Request(origin+stop,{method:'POST'}),f.env,stop)).status,200);
 assert.equal(f.sql.prepare('SELECT state FROM edu_plant_thread_mail_outbox WHERE reference=? AND user_id=?').get(next,f.alice.id).state,'cancelled');
 assert.equal(f.sql.prepare('SELECT state FROM edu_plant_thread_mail_outbox WHERE reference=? AND user_id=?').get(next,f.ben.id).state,'pending');
 assert.equal(f.sql.prepare('SELECT state FROM edu_plant_thread_mail_outbox WHERE reference=? AND user_id=?').get(nextOther,f.alice.id).state,'pending');
 assert.equal((await teacherPreferences(f.db,f.alice.id)).immediate,true);assert.equal((await teacherPreferences(f.db,f.alice.id)).monthly,true);
 c.post();await processPlantMail(f.env,now+2000);
 assert.equal(f.emails.filter(x=>x.email===f.alice.email&&x.threadId===c.threadId).length,1);
 assert.equal(f.emails.filter(x=>x.email===f.alice.email&&x.threadId===other.threadId).length,1);
});
test('withdrawal, revoked membership, disabled user and changed consent are rechecked before farmer-reply dispatch',async t=>{
 const f=setup(t),app=f.accept('r1-p7'),c=conversation(f,app);
 for(const u of [f.alice,f.ben,f.charlie]){f.prefs(u,false,false);c.follow(u);}
 const now=Date.now()+1500;
 f.sql.prepare("UPDATE edu_plant_applications SET status='cooling',withdrawal_reason='Test reason',release_at=? WHERE id=?").run(new Date(now+600000).toISOString(),app);
 const pending=c.post();
 f.sql.prepare('UPDATE edu_users SET disabled=1 WHERE id=?').run(f.ben.id);
 f.sql.prepare("UPDATE edu_teacher_preferences SET privacy_version='old' WHERE user_id=?").run(f.charlie.id);
 await processPlantMail(f.env,now);
 assert.deepEqual(f.emails.filter(x=>x.kind==='reply').map(x=>x.email),[f.alice.email]);
 assert.equal(f.sql.prepare("SELECT COUNT(*) n FROM edu_plant_thread_mail_outbox WHERE reference=? AND state='cancelled'").get(pending).n,2);
 const later=c.post();f.sql.prepare('DELETE FROM edu_plant_members WHERE user_id=? AND org_id=?').run(f.alice.id,f.org);
 await processPlantMail(f.env,now+1000);assert.equal(f.sql.prepare('SELECT state FROM edu_plant_thread_mail_outbox WHERE reference=?').get(later).state,'cancelled');
 f.sql.prepare('INSERT INTO edu_plant_members VALUES(?,?,?)').run(f.org,f.alice.id,new Date().toISOString());
 const last=c.post();await processPlantMail(f.env,now+650000);
 assert.equal(f.sql.prepare('SELECT state FROM edu_plant_thread_mail_outbox WHERE reference=?').get(last).state,'cancelled');
});
