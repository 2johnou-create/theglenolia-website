import {all, fail, json, keys, nowISO, secureEqual, SECURITY} from './education-common.mjs';
import {STAGE_NAMES} from '../public/assets/plant-portal/stages.js';

export const PRIVACY_VERSION = 'plant-privacy-2026-11-21';
export const EDUCATION_VERSION = 'educational-use-2026-11-21';
const terms = "p.privacy_version=? AND p.education_version=?";
const enabledMember = "NOT EXISTS(SELECT 1 FROM edu_memberships x WHERE x.school_id=m.org_id AND x.user_id=m.user_id AND x.active=0)";
const activeMembers = `FROM edu_plant_applications a
 JOIN edu_plant_organisations o ON o.id=a.workspace_id JOIN edu_schools s ON s.id=o.id AND s.status<>'suspended'
 JOIN edu_plant_members m ON m.org_id=o.id JOIN edu_users u ON u.id=m.user_id AND u.disabled=0
 JOIN edu_teacher_preferences p ON p.user_id=m.user_id`;
const monthFormat = new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'});

export async function teacherPreferences(db,userId){
 const p=await db.prepare('SELECT privacy_version,education_version,immediate,monthly FROM edu_teacher_preferences WHERE user_id=?').bind(userId).first();
 return {privacyVersion:PRIVACY_VERSION,educationVersion:EDUCATION_VERSION,
  required:p?.privacy_version!==PRIVACY_VERSION||p?.education_version!==EDUCATION_VERSION,
  immediate:!!p?.immediate,monthly:!!p?.monthly};
}
export async function requireTeacherConsent(db,userId){
 if((await teacherPreferences(db,userId)).required)fail(403,'teacher_consent_required');
}
export async function preferencesRoute(request,env,actor,body){
 const db=env.EDU_DB;
 if(request.method==='POST'){
  keys(body,['privacy','education','immediate','monthly']);
  if(body.privacy!==true||body.education!==true||typeof body.immediate!=='boolean'||typeof body.monthly!=='boolean')fail(400,'required_consents');
  await db.prepare(`INSERT INTO edu_teacher_preferences(user_id,privacy_version,education_version,immediate,monthly,updated_at,source)
   VALUES(?,?,?,?,?,?,'teacher') ON CONFLICT(user_id) DO UPDATE SET privacy_version=excluded.privacy_version,
   education_version=excluded.education_version,immediate=excluded.immediate,monthly=excluded.monthly,updated_at=excluded.updated_at,source='teacher'`)
   .bind(actor.id,PRIVACY_VERSION,EDUCATION_VERSION,+body.immediate,+body.monthly,nowISO()).run();
 }else if(request.method!=='GET')fail(405,'method');
 return json(await teacherPreferences(db,actor.id));
}

async function stopToken(env,userId,kind){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SESSION_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('plant-email-stop:v1:'+kind+':'+userId));
 return Array.from(new Uint8Array(signature),v=>v.toString(16).padStart(2,'0')).join('');
}
async function stopPath(env,userId,kind){
 return '/email/stop/'+kind+'/'+userId+'/'+await stopToken(env,userId,kind);
}
export async function unsubscribeRoute(request,env,path){
 const match=/^\/email\/stop\/(immediate|monthly)\/([a-f0-9-]{36})\/([a-f0-9]{64})$/.exec(path);
 if(!match||!env.SESSION_KEY||!secureEqual(match[3],await stopToken(env,match[2],match[1])))return json({error:'not_found'},404);
 const [,kind,uid]=match;
 const description=kind==='monthly'?'monthly plant summaries':'farmer update emails';
 if(!['GET','HEAD','POST'].includes(request.method))fail(405,'method');
 const posted=request.method==='POST';
 if(posted){
  await env.EDU_DB.prepare("UPDATE edu_teacher_preferences SET "+kind+"=0,source='email_unsubscribe',updated_at=? WHERE user_id=? AND "+kind+"=1").bind(nowISO(),uid).run();
 }
 const title=posted?'Your preference is saved':'Stop '+description+'?';
 const content=posted?'You have unsubscribed from '+description+'. You can manage your other choices in the teacher portal.':
  'You can keep using your class journal. This changes only your '+description+'.';
 return new Response(request.method==='HEAD'?null:`<!doctype html><html lang="en-AU"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | The Glenolia</title><style>body{margin:0;background:#f5f1e8;color:#3b332d;font:1.05rem/1.65 system-ui}main{max-width:34rem;margin:10vh auto;padding:2rem}h1{font:2.3rem Georgia;color:#2f4a3c}button{background:#2f4a3c;color:white;border:0;padding:1rem 1.5rem;border-radius:.4rem;font:inherit}a{color:#2f4a3c}</style><main><p>THE GLENOLIA</p><h1>${title}</h1><p>${content}</p>${posted?'<a href="/#plant-preferences">Teacher email settings</a>':'<form method="post"><button>Stop '+description+'</button></form>'}</main></html>`,{headers:{...SECURITY,'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"}});
}

function periodFor(now){
 const parts=Object.fromEntries(monthFormat.formatToParts(new Date(now)).map(x=>[x.type,x.value]));
 if(parts.day==='01' && Number(parts.hour)<9)return null;
 return new Date(Date.UTC(+parts.year,+parts.month-2,1)).toISOString().slice(0,7);
}
function monthEnd(period){
 const [year,month]=period.split('-').map(Number);
 // Sydney's offset at local midnight at the start of the following month.
 const midnightUtc=Date.UTC(year,month,1);
 const parts=Object.fromEntries(monthFormat.formatToParts(new Date(midnightUtc)).map(x=>[x.type,x.value]));
 return {endDay:new Date(midnightUtc).toISOString().slice(0,10),cutoff:new Date(midnightUtc-Number(parts.hour)*3600000).toISOString()};
}
export async function enqueueMonthly(db,now){
 const period=periodFor(now);
 if(!period || await db.prepare('SELECT period FROM edu_plant_mail_periods WHERE period=?').bind(period).first())return;
 const seconds=Math.floor(now/1000);
 const {cutoff}=monthEnd(period);
 await db.batch([
  db.prepare(`INSERT OR IGNORE INTO edu_plant_mail_outbox(id,kind,user_id,reference,application_id,run_after,changed_at)
   SELECT 'monthly:'||?||':'||o.id||':'||u.id,'monthly',u.id,?,o.id,?,? ${activeMembers}
   WHERE a.status='active' AND ${enabledMember} AND p.monthly=1 AND ${terms} AND a.accepted_at<? AND m.joined_at<?
   AND (SELECT h.monthly FROM edu_teacher_consent_history h WHERE h.user_id=u.id AND h.changed_at<? ORDER BY h.id DESC LIMIT 1)=1
   AND NOT EXISTS (SELECT 1 FROM edu_plant_mail_periods WHERE period=?) GROUP BY o.id,u.id`)
   .bind(period,period,seconds,seconds,PRIVACY_VERSION,EDUCATION_VERSION,cutoff,cutoff,cutoff,period),
  db.prepare('INSERT OR IGNORE INTO edu_plant_mail_periods(period,queued_at) VALUES(?,?)').bind(period,new Date(now).toISOString())
 ]);
}
function displayPlant(key){
 const [,r,n]=/^r(\d+)-p(\d+)$/.exec(key);
 return 'P'+((Number(r)-1)*19+Number(n));
}
async function payload(env,job,now){
 const db=env.EDU_DB;
 if(job.kind==='invite'){
  const i=await db.prepare(`SELECT i.email,o.name FROM edu_plant_invitations i JOIN edu_plant_organisations o ON o.id=i.org_id
   JOIN edu_schools s ON s.id=o.id AND s.status<>'suspended' WHERE i.id=? AND i.status='pending' AND i.expires_at>?`)
   .bind(job.reference,new Date(now).toISOString()).first();
  return i?{kind:'invite',email:i.email,organisation:i.name}:null;
 }
 const pref=job.kind==='monthly'?'monthly':'immediate';
 const common=` a.status='active' AND ${enabledMember} AND u.id=? AND p.${pref}=1 AND ${terms}`;
 const select=`SELECT u.email,o.id AS orgId,o.name AS organisation,a.plant_key,v.stage`;
 const from=activeMembers+' JOIN edu_atlas_positions v ON v.plant_key=a.plant_key';
 let data;
 if(job.kind==='update'){
  const row=await db.prepare(`${select},f.observed_on ${from} JOIN edu_plant_updates f ON f.plant_key=a.plant_key
   WHERE ${common} AND a.id=? AND f.id=? AND f.withdrawn=0`)
   .bind(job.user_id,PRIVACY_VERSION,EDUCATION_VERSION,job.application_id,job.reference).first();
  if(!row)return null;
  data={kind:'update',orgId:row.orgId,applicationId:job.application_id,email:row.email,organisation:row.organisation,plant:displayPlant(row.plant_key),stage:STAGE_NAMES[row.stage-1],observedOn:row.observed_on};
 }else{
  const start=job.reference+'-01',{endDay,cutoff}=monthEnd(job.reference);
  const rows=await all(db.prepare(`${select},(SELECT COUNT(*) FROM edu_plant_updates f WHERE f.plant_key=a.plant_key AND f.withdrawn=0 AND f.observed_on>=? AND f.observed_on<?) AS total
   ${from} WHERE ${common} AND o.id=? AND a.accepted_at<? AND m.joined_at<? ORDER BY v.row_num,v.position`)
   .bind(start,endDay,job.user_id,PRIVACY_VERSION,EDUCATION_VERSION,job.application_id,cutoff,cutoff));
  if(!rows.length)return null;
  data={kind:'monthly',orgId:rows[0].orgId,email:rows[0].email,organisation:rows[0].organisation,period:job.reference,
   plants:rows.map(r=>({plant:displayPlant(r.plant_key),stage:STAGE_NAMES[r.stage-1],updates:r.total}))};
 }
 return {...data,unsubscribePath:await stopPath(env,job.user_id,pref)};
}

export async function processPlantMail(env,now=Date.now()){
 const db=env.EDU_DB,seconds=Math.floor(now/1000);
 await enqueueMonthly(db,now);
 // After a crash the provider might already have accepted a message. Retain its record for review.
 const stale=await db.prepare("UPDATE edu_plant_mail_outbox SET state='review',changed_at=? WHERE state='sending' AND changed_at<?").bind(seconds,seconds-900).run();
 if(stale.meta?.changes)console.warn('Plant email delivery needs reconciliation');
 const due=await all(db.prepare("SELECT * FROM edu_plant_mail_outbox WHERE state='pending' AND run_after<=? ORDER BY run_after,id LIMIT 4").bind(seconds));
 for(const job of due){
  const claim=await db.prepare("UPDATE edu_plant_mail_outbox SET state='sending',attempts=attempts+1,changed_at=? WHERE id=? AND state='pending' AND run_after<=?").bind(seconds,job.id,seconds).run();
  if(!claim.meta?.changes)continue;
  let state='review',next=seconds;
  try{
   const message=await payload(env,job,now);
   if(!message)state='cancelled';
   else if(!env.MAILER || !env.MAIL_SECRET){state='pending';next+=900;}
   else {
    const response=await env.MAILER.fetch(new Request('https://internal/internal/education/plant-message',{method:'POST',
     headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.MAIL_SECRET},
     body:JSON.stringify({...message,jobId:job.id,origin:env.APP_ORIGIN}),signal:AbortSignal.timeout(15000)}));
    if(response.ok)state='sent';
    else if(response.status===429 && job.attempts<7){state='pending';next+=Math.min(3600,300*2**job.attempts);}
   }
  }catch{ /* Network ambiguity is retained for operator review. */ }
  await db.prepare("UPDATE edu_plant_mail_outbox SET state=?,changed_at=?,run_after=? WHERE id=? AND state='sending'").bind(state,seconds,next,job.id).run();
  if(state==='review')console.warn('Plant email needs delivery review',job.kind);
 }
 return due.length;
}
