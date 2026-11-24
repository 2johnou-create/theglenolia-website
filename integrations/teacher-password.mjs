import {json,fail,readBody,keys,token,digest,cookie,sessionCookie,sameOrigin,rate,id,nowISO,publicActor,loadActor,secureEqual} from './education-common.mjs';
import {normaliseTeacherEmail,validTeacherPassword,commonTeacherPassword,TEACHER_LINK_VALID_MINUTES} from '../public/teachers/teacher-sign-in.js';

const DEVICE_COOKIE='__Host-glenolia-teacher-device';
const DEVICE_SECONDS=30*86400;
const LINK_DURATION=TEACHER_LINK_VALID_MINUTES*60_000;
const WAIT_SECONDS=90;
const secretPattern=/^[a-f0-9]{64}$/;
const encoder=new TextEncoder();
const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');

export function teacherDestination(value){
 if(typeof value==='string'){
  const [route,raw='']=value.split('?');
  if(route==='library')return 'library';
  if(['plant','plant-library','plant-preferences','plant-settings'].includes(route)){
   const params=new URLSearchParams(raw),safe=new URLSearchParams();
   for(const key of ['orgId','applicationId','thread']){
    const v=params.get(key);
    if(v&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(v))safe.set(key,v);
   }
   const prefer=params.get('prefer');
   if(prefer&&/^r(?:[1-9]|1[0-2])-p(?:[1-9]|1[0-9])$/.test(prefer))safe.set('prefer',prefer);
   if(route==='plant-library'&&params.get('setup')==='1')safe.set('setup','1');
   return route+(safe.size?'?'+safe:'');
  }
 }
 return 'plant';
}

async function passwordVerifier(password,salt,key){
 const pepper=await crypto.subtle.importKey('raw',encoder.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const material=await crypto.subtle.sign('HMAC',pepper,encoder.encode('glenolia-teacher-password-v1:'+password));
 const pbkdf=await crypto.subtle.importKey('raw',material,'PBKDF2',false,['deriveBits']);
 return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:encoder.encode(salt),iterations:100_000},pbkdf,256)));
}

async function passwordCredential(db,email){
 return db.prepare(`SELECT p.salt,p.verifier,u.id AS user_id FROM edu_users u
  JOIN edu_teacher_passwords p ON p.user_id=u.id WHERE u.email=? AND u.disabled=0`).bind(email).first();
}

async function openPasswordSession(request,env,userId,salt,deviceRaw,destination,now,issueDevice=false){
 const db=env.EDU_DB,stamp=nowISO(),schoolId=id(),session=token(),deviceHash=await digest(deviceRaw);
 // A verified address always retains its personal workspace and school memberships.
 await db.batch([
  db.prepare("INSERT OR IGNORE INTO edu_schools(id,kind,name,owner_id,status,created_at) VALUES(?,'personal','My planning workspace',?,'personal',?)").bind(schoolId,userId,stamp),
  db.prepare("INSERT OR IGNORE INTO edu_memberships(school_id,user_id,role,can_assess) SELECT id,?,'teacher',1 FROM edu_schools WHERE owner_id=? AND kind='personal'").bind(userId,userId)
 ]);
 const opened=await db.prepare(`INSERT INTO edu_sessions(hash,user_id,school_id,created_at,last_seen,expires_at)
  SELECT ?,p.user_id,s.id,?,?,? FROM edu_teacher_passwords p
  JOIN edu_users u ON u.id=p.user_id AND u.disabled=0
  JOIN edu_teacher_devices d ON d.user_id=p.user_id AND d.hash=? AND d.expires_at>?
  JOIN edu_schools s ON s.owner_id=p.user_id AND s.kind='personal'
  WHERE p.user_id=? AND p.salt=?`).bind(await digest(session),now,now,now+28800000,deviceHash,now,userId,salt).run();
 if(!opened.meta.changes)fail(401,'teacher_password_incorrect');
 const fake=new Request(request.url,{headers:{Cookie:'__Host-glenolia-edu='+session}});
 const actor=await loadActor(fake,env);
 const response=json({...publicActor(actor),passwordConfigured:true,destination},200,{'Set-Cookie':sessionCookie(session)});
 if(issueDevice)response.headers.append('Set-Cookie',`${DEVICE_COOKIE}=${deviceRaw}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DEVICE_SECONDS}`);
 return response;
}

async function issueAccessLink(env,{email,purpose,destination,passwordSalt=null},ipHash,now){
 if(!env.MAILER||!env.MAIL_SECRET)fail(503,'sign_in_temporarily_unavailable');
 const db=env.EDU_DB;
 if(!await rate(db,'teacher-link-ip:'+ipHash,12,3600000,now))fail(429,'try_later');
 const emailHash=await digest(email);
 const reserved=await db.prepare(`INSERT INTO edu_rate_limits(key,period,count) VALUES(?,?,1)
  ON CONFLICT(key) DO UPDATE SET period=excluded.period,count=1
  WHERE edu_rate_limits.period<=? RETURNING period`).bind('teacher-link:'+emailHash,now+WAIT_SECONDS*1000,now).first();
 if(!reserved)fail(429,'teacher_link_recent');
 const max=Number(env.MAX_AUTH_EMAILS_DAILY||20);
 if(!Number.isInteger(max)||max<1||max>25||!await rate(db,'daily-auth',max,86400000,now))fail(429,'daily_sign_in_allowance');
 const raw=token(),hash=await digest(raw);
 await db.prepare(`INSERT INTO edu_teacher_access_links(hash,email,purpose,destination,password_salt,created_at,expires_at)
  VALUES(?,?,?,?,?,?,?)`).bind(hash,email,purpose,destination,passwordSalt,now,now+LINK_DURATION).run();
 let response;
 try{
  response=await env.MAILER.fetch(new Request('https://internal/internal/education/access-link',{method:'POST',
   headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.MAIL_SECRET},
   body:JSON.stringify({email,purpose,token:raw,origin:env.APP_ORIGIN}),signal:AbortSignal.timeout(15000)}));
 }catch{
  await db.prepare("UPDATE edu_teacher_access_links SET mail_state='needs_review' WHERE hash=?").bind(hash).run();
  fail(503,'sign_in_temporarily_unavailable');
 }
 await db.prepare('UPDATE edu_teacher_access_links SET mail_state=? WHERE hash=?').bind(response.ok?'accepted':'rejected',hash).run();
 if(!response.ok)fail(503,'sign_in_temporarily_unavailable');
 return json({checkEmail:true},202);
}

async function verifiedLink(db,raw,now){
 if(typeof raw!=='string'||!secretPattern.test(raw))fail(400,'teacher_link_expired');
 const hash=await digest(raw);
 const link=await db.prepare(`SELECT l.* FROM edu_teacher_access_links l
  WHERE l.hash=? AND l.redeemed_by IS NULL AND l.expires_at>? AND l.mail_state='accepted'
  AND NOT EXISTS (SELECT 1 FROM edu_users u WHERE u.email=l.email AND u.disabled=1)`).bind(hash,now).first();
 if(!link)fail(400,'teacher_link_expired');
 return link;
}

async function redeemLink(request,env,link,password,now){
 const db=env.EDU_DB,claim=id(),deviceRaw=token(),deviceHash=await digest(deviceRaw);
 const setup=link.purpose==='setup';
 const credential=setup?null:await passwordCredential(db,link.email);
 const salt=setup?token():link.password_salt;
 if(!salt||!setup&&credential?.salt!==salt)fail(400,'teacher_link_expired');
 const verifier=await passwordVerifier(password,salt,env.SESSION_KEY);
 if(!setup&&!secureEqual(credential.verifier,verifier))fail(401,'teacher_password_incorrect');
 const matchingUser=`SELECT u.id FROM edu_users u JOIN edu_teacher_access_links l ON l.email=u.email
  WHERE l.hash=? AND l.redeemed_by=? AND u.disabled=0`;
 const statements=[db.prepare(`UPDATE edu_teacher_access_links SET redeemed_by=?
  WHERE hash=? AND redeemed_by IS NULL AND expires_at>? AND mail_state='accepted'
  AND NOT EXISTS (SELECT 1 FROM edu_users u WHERE u.email=edu_teacher_access_links.email AND u.disabled=1)
  AND (purpose='setup' OR EXISTS(SELECT 1 FROM edu_teacher_passwords p JOIN edu_users u ON u.id=p.user_id
   WHERE u.email=edu_teacher_access_links.email AND p.salt=edu_teacher_access_links.password_salt))`).bind(claim,link.hash,now)];
 if(setup){
  const stamp=nowISO();
  statements.push(
   db.prepare(`INSERT INTO edu_users(id,email,name,created_at,verified_at)
    SELECT ?,email,'Educator',?,? FROM edu_teacher_access_links WHERE hash=? AND redeemed_by=?
    ON CONFLICT(email) DO UPDATE SET verified_at=excluded.verified_at`).bind(id(),stamp,stamp,link.hash,claim),
   db.prepare(`INSERT INTO edu_teacher_passwords(user_id,salt,verifier,updated_at)
    SELECT authorised.id,?,?,? FROM (${matchingUser}) authorised WHERE 1
    ON CONFLICT(user_id) DO UPDATE SET salt=excluded.salt,verifier=excluded.verifier,updated_at=excluded.updated_at`).bind(salt,verifier,now,link.hash,claim),
   db.prepare(`DELETE FROM edu_teacher_devices WHERE user_id IN (${matchingUser})`).bind(link.hash,claim),
   db.prepare(`DELETE FROM edu_sessions WHERE user_id IN (${matchingUser})`).bind(link.hash,claim),
   db.prepare(`UPDATE edu_teacher_access_links SET redeemed_by=? WHERE email=? AND hash<>? AND redeemed_by IS NULL
    AND EXISTS(SELECT 1 FROM edu_teacher_access_links WHERE hash=? AND redeemed_by=?)`).bind(claim,link.email,link.hash,link.hash,claim)
  );
 }
 statements.push(db.prepare(`INSERT INTO edu_teacher_devices(hash,user_id,expires_at)
  SELECT ?,authorised.id,? FROM (${matchingUser}) authorised
  JOIN edu_teacher_passwords p ON p.user_id=authorised.id AND p.salt=?`).bind(deviceHash,now+DEVICE_SECONDS*1000,link.hash,claim,salt));
 const results=await db.batch(statements);
 if(!results[0].meta.changes||!results.at(-1).meta.changes)fail(400,'teacher_link_expired');
 const user=await db.prepare('SELECT id FROM edu_users WHERE email=? AND disabled=0').bind(link.email).first();
 return openPasswordSession(request,env,user.id,salt,deviceRaw,link.destination,now,true);
}

export async function teacherPasswordRoutes(request,env,path){
 const db=env.EDU_DB;
 if(path==='/api/auth/password-status'&&request.method==='GET'){
  const actor=await loadActor(request,env);
  return json({passwordConfigured:!!await db.prepare('SELECT 1 FROM edu_teacher_passwords WHERE user_id=?').bind(actor.id).first()});
 }
 if(request.method!=='POST'||!['/api/auth/password-email','/api/auth/password-login','/api/auth/password-link','/api/auth/password-redeem'].includes(path))return null;
 sameOrigin(request);
 const body=await readBody(request,4096),now=Date.now();
 const ipHash=await digest((request.headers.get('CF-Connecting-IP')||'unknown')+':'+env.SESSION_KEY);
 if(path==='/api/auth/password-email'){
  const b=keys(body,['email','emailConfirmation','destination','consent']);
  if(b.consent!==true)fail(400,'educator_confirmation_required');
  const email=normaliseTeacherEmail(b.email);
  if(!email)fail(400,'invalid_email');
  if(normaliseTeacherEmail(b.emailConfirmation)!==email)fail(400,'email_confirmation_mismatch');
  return issueAccessLink(env,{email,purpose:'setup',destination:teacherDestination(b.destination)},ipHash,now);
 }
 if(!await rate(db,'teacher-password-ip:'+ipHash,40,900000,now))fail(429,'try_later');
 if(path==='/api/auth/password-link'){
  const link=await verifiedLink(db,keys(body,['token']).token,now);
  return json({purpose:link.purpose,email:link.email});
 }
 if(path==='/api/auth/password-redeem'){
  const b=keys(body,['token','password','passwordConfirmation']);
  if(!validTeacherPassword(b.password))fail(400,'teacher_password_format');
  const link=await verifiedLink(db,b.token,now);
  if(link.purpose==='setup'&&b.passwordConfirmation!==b.password)fail(400,'teacher_password_mismatch');
  if(link.purpose==='setup'&&commonTeacherPassword(b.password))fail(400,'teacher_password_common');
  if(!await rate(db,'teacher-password-link:'+link.hash,5,900000,now))fail(429,'try_later');
  return redeemLink(request,env,link,b.password,now);
 }
 const b=keys(body,['email','password','destination']);
 const email=normaliseTeacherEmail(b.email);
 if(!email)fail(400,'invalid_email');
 if(!validTeacherPassword(b.password))fail(400,'teacher_password_format');
 const emailHash=await digest(email);
 if(!await rate(db,'teacher-password-account:'+emailHash,5,900000,now))fail(429,'try_later');
 const credential=await passwordCredential(db,email);
 const verifier=await passwordVerifier(b.password,credential?.salt||emailHash,env.SESSION_KEY);
 if(!credential||!secureEqual(credential.verifier,verifier))fail(401,'teacher_password_incorrect');
 const destination=teacherDestination(b.destination);
 const deviceRaw=cookie(request,DEVICE_COOKIE);
 const device=deviceRaw&&await db.prepare('SELECT 1 FROM edu_teacher_devices WHERE hash=? AND user_id=? AND expires_at>?')
  .bind(await digest(deviceRaw),credential.user_id,now).first();
 if(!device)return issueAccessLink(env,{email,purpose:'browser',destination,passwordSalt:credential.salt},ipHash,now);
 return openPasswordSession(request,env,credential.user_id,credential.salt,deviceRaw,destination,now);
}
