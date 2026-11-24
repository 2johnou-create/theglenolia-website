import {json,fail,readBody,keys,text,emailValue,token,digest,cookie,browserCookie,sessionCookie,sameOrigin,rate,id,nowISO,publicActor,loadActor,requireCSRF,secureEqual,all} from './education-common.mjs';
import {normaliseTeacherEmail,TEACHER_CODE_VALID_MS,TEACHER_CODE_RESEND_MS} from '../public/teachers/teacher-sign-in.js';
const generic='Check your inbox for a six-digit sign-in code. Enter it here within 15 minutes. Signing in does not subscribe you to email updates.';
function loginCode(){
 const value=new Uint32Array(1),limit=Math.floor(0x100000000/1000000)*1000000;
 do { crypto.getRandomValues(value); } while(value[0]>=limit);
 return String(value[0]%1000000).padStart(6,'0');
}
async function codeVerifier(hash,code,sessionKey){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(sessionKey),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('teacher-login:'+hash+':'+code))),v=>v.toString(16).padStart(2,'0')).join('');
}
async function consumeCode(request,env,body,now){
 const email=emailValue(body.email),browser=cookie(request,'__Host-glenolia-login');
 if(!browser||typeof body.code!=='string'||!/^\d{6}$/.test(body.code))fail(400,'invalid_or_expired_code');
 const challenge=await env.EDU_DB.prepare(`UPDATE edu_auth_codes SET attempts=attempts+1
  WHERE attempts<5 AND token_hash=(SELECT hash FROM edu_auth_tokens WHERE email=? AND browser_hash=? AND mail_state='accepted'
   ORDER BY created_at DESC,rowid DESC LIMIT 1) AND EXISTS(SELECT 1 FROM edu_auth_tokens t WHERE t.hash=token_hash AND t.used_at IS NULL AND t.expires_at>?)
  RETURNING token_hash,verifier`).bind(email,await digest(browser),now).first();
 if(!challenge||!secureEqual(challenge.verifier,await codeVerifier(challenge.token_hash,body.code,env.SESSION_KEY)))fail(400,'invalid_or_expired_code');
 return challenge.token_hash;
}
async function reserveCodeRequest(db,email,now){
 const key='email:'+await digest(email);
 const next=await db.prepare(`INSERT INTO edu_rate_limits(key,period,count) VALUES(?,?,1)
  ON CONFLICT(key) DO UPDATE SET period=excluded.period,count=1
  WHERE edu_rate_limits.period<=? RETURNING period`).bind(key,now+TEACHER_CODE_RESEND_MS,now).first();
 if(next)return 0;
 const current=await db.prepare('SELECT period FROM edu_rate_limits WHERE key=?').bind(key).first();
 return Math.max(1,Math.ceil((current.period-now)/1000));
}
export async function authRoutes(request,env,path){
 if(path==='/api/session'&&request.method==='GET')return json(publicActor(await loadActor(request,env,{required:false})));
 if(path==='/api/auth/request'&&request.method==='POST'){
  if(env.LEGACY_TEACHER_CODES!=='true')fail(410,'teacher_password_required');
  sameOrigin(request);const b=keys(await readBody(request,4096),['email','emailConfirmation','name','schoolName','role','consent','website','intent']);
  if(b.website||b.consent!==true)fail(400,'educator_confirmation_required');
  const email=normaliseTeacherEmail(b.email);
  if(!email)fail(400,'invalid_email');
  if(Object.hasOwn(b,'emailConfirmation')&&normaliseTeacherEmail(b.emailConfirmation)!==email)fail(400,'email_confirmation_mismatch');
  const name=text(b.name||'Educator',80),schoolName=text(b.schoolName||'',160,{empty:true});
  const now=Date.now(),ipKey=await digest((request.headers.get('CF-Connecting-IP')||'unknown')+env.SESSION_KEY);
  if(!await rate(env.EDU_DB,'ip:'+ipKey,8,3600000,now))fail(429,'try_later');
  const retryAfter=await reserveCodeRequest(env.EDU_DB,email,now);
  if(retryAfter)return json({error:'code_requested_recently'},429,{'Retry-After':String(retryAfter)});
  if(!env.MAILER||!env.MAIL_SECRET||!env.SESSION_KEY)fail(503,'sign_in_temporarily_unavailable');
  const max=Number(env.MAX_AUTH_EMAILS_DAILY||20);if(!Number.isInteger(max)||max<1||max>25||!await rate(env.EDU_DB,'daily-auth',max,86400000,now))fail(429,'daily_sign_in_allowance');
  const secret=token(),browser=cookie(request,'__Host-glenolia-login')||token(),hash=await digest(secret);
  const code=loginCode();
  await env.EDU_DB.batch([
   env.EDU_DB.prepare('INSERT INTO edu_auth_tokens(hash,browser_hash,email,name,school_name,created_at,expires_at) VALUES(?,?,?,?,?,?,?)').bind(hash,await digest(browser),email,name,schoolName,now,now+TEACHER_CODE_VALID_MS),
   env.EDU_DB.prepare('INSERT INTO edu_auth_codes(token_hash,verifier) VALUES(?,?)').bind(hash,await codeVerifier(hash,code,env.SESSION_KEY))
  ]);
  let response;try{response=await env.MAILER.fetch(new Request('https://internal/internal/education/sign-in',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.MAIL_SECRET},body:JSON.stringify({email,name,token:secret,code,origin:env.APP_ORIGIN}),signal:AbortSignal.timeout(15000)}));}catch{await env.EDU_DB.prepare("UPDATE edu_auth_tokens SET mail_state='needs_review' WHERE hash=?").bind(hash).run();fail(503,'sign_in_temporarily_unavailable');}
  if(!response.ok){await env.EDU_DB.prepare("UPDATE edu_auth_tokens SET mail_state='rejected' WHERE hash=?").bind(hash).run();fail(503,'sign_in_temporarily_unavailable');}
  await env.EDU_DB.prepare("UPDATE edu_auth_tokens SET mail_state='accepted' WHERE hash=?").bind(hash).run();
  const elapsed=Date.now()-now;
  return json({message:generic,expiresInSeconds:Math.max(1,Math.floor((TEACHER_CODE_VALID_MS-elapsed)/1000)),
   resendAfterSeconds:Math.max(0,Math.ceil((TEACHER_CODE_RESEND_MS-elapsed)/1000))},202,{'Set-Cookie':browserCookie(browser)});
 }
 if(path==='/api/auth/verify'&&request.method==='POST'){
  sameOrigin(request);const b=keys(await readBody(request,2048),['token','email','code']),now=Date.now();
  const byCode='code' in b || 'email' in b;
  if(byCode && 'token' in b)fail(400,'invalid_fields');
  if(!byCode&&!/^[a-f0-9]{64}$/.test(b.token||''))fail(400,'invalid_link');
  const hash=byCode?await consumeCode(request,env,b,now):await digest(b.token),row=await env.EDU_DB.prepare("SELECT * FROM edu_auth_tokens WHERE hash=? AND used_at IS NULL AND expires_at>? AND mail_state IN('accepted','owner_handoff')").bind(hash,now).first();
  const browser=cookie(request,'__Host-glenolia-login');
  if(!row||row.mail_state!=='owner_handoff'&&(!browser||!secureEqual(await digest(browser),row.browser_hash)))fail(400,'expired_or_different_browser');
  const used=await env.EDU_DB.prepare('UPDATE edu_auth_tokens SET used_at=? WHERE hash=? AND used_at IS NULL AND expires_at>?').bind(now,hash,now).run();if(!used.meta?.changes)fail(400,'link_already_used');
  const stamp=nowISO(),uid=id();await env.EDU_DB.prepare('INSERT INTO edu_users(id,email,name,requested_school,created_at,verified_at) VALUES(?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET verified_at=excluded.verified_at').bind(uid,row.email,row.name,row.school_name,stamp,stamp).run();
  const user=await env.EDU_DB.prepare('SELECT * FROM edu_users WHERE email=?').bind(row.email).first();if(user.disabled)fail(403,'account_unavailable');
  const sid=id();await env.EDU_DB.batch([
   env.EDU_DB.prepare("INSERT OR IGNORE INTO edu_schools(id,name,kind,owner_id,status,created_at) VALUES(?,'My planning workspace','personal',?,'personal',?)").bind(sid,user.id,stamp),
   env.EDU_DB.prepare("INSERT OR IGNORE INTO edu_memberships(school_id,user_id,role,can_assess) SELECT id,?,'teacher',1 FROM edu_schools WHERE owner_id=? AND kind='personal'").bind(user.id,user.id)
  ]);
  const school=await env.EDU_DB.prepare("SELECT id FROM edu_schools WHERE owner_id=? AND kind='personal'").bind(user.id).first(),raw=token();
  await env.EDU_DB.prepare('INSERT INTO edu_sessions(hash,user_id,school_id,created_at,last_seen,expires_at) VALUES(?,?,?,?,?,?)').bind(await digest(raw),user.id,school.id,now,now,now+28800000).run();
  const fake=new Request(request.url,{headers:{Cookie:'__Host-glenolia-edu='+raw}});const actor=await loadActor(fake,env);
  return json(publicActor(actor),200,{'Set-Cookie':sessionCookie(raw)});
 }
 if(path==='/api/logout'&&request.method==='POST'){
  const actor=await loadActor(request,env);requireCSRF(request,actor);await env.EDU_DB.prepare('DELETE FROM edu_sessions WHERE hash=?').bind(actor.sessionHash).run();return json({signedOut:true},200,{'Set-Cookie':sessionCookie('',0)});
 }
 if(path==='/api/school/select'&&request.method==='POST'){
  const actor=await loadActor(request,env);requireCSRF(request,actor);const b=keys(await readBody(request,2048),['schoolId']);if(!actor.memberships.some(m=>m.school_id===b.schoolId))fail(404,'school_not_found');
  await env.EDU_DB.prepare('UPDATE edu_sessions SET school_id=? WHERE hash=?').bind(b.schoolId,actor.sessionHash).run();return json(publicActor(await loadActor(request,env)));
 }
 return null;
}
export async function ownerHandoff(env,email,name='John Ou'){
 const secret=token(),now=Date.now();await env.EDU_DB.prepare("INSERT INTO edu_auth_tokens(hash,browser_hash,email,name,school_name,created_at,expires_at,mail_state) VALUES(?,'owner-access',?,?, '',?,?,'owner_handoff')").bind(await digest(secret),email,name,now,now+60000).run();return env.APP_ORIGIN+'/auth/verify#token='+secret;
}
