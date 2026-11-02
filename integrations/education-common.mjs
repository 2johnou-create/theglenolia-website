export class EducationError extends Error {constructor(status,code){super(code);this.status=status;this.code=code;}}
export const fail=(status,code)=>{throw new EducationError(status,code);};
export const SECURITY={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Cross-Origin-Resource-Policy':'same-origin'};
export const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...SECURITY,'Content-Type':'application/json; charset=utf-8',...extra}});
export const nowISO=()=>new Date().toISOString();
export const id=()=>crypto.randomUUID();
export const stages=new Set(['ES1','S1','S2','S3','S4','S5','S6']);
export const modes=new Set(['classroom','school_grounds','field','indoor','home']);
export const levels=new Set(['not_observed','starting','developing','secure','extending']);
export const text=(value,max=500,{empty=false}={})=>{if(typeof value!=='string'||value.length>max||(!empty&&!value.trim()))fail(400,'invalid_field');return value.trim();};
export const emailValue=value=>{const s=text(value,254).toLowerCase();if(!/^[a-z0-9.!#$%&'*+\/=\?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(s)||/[\r\n]/.test(s))fail(400,'invalid_email');return s;};
export const keys=(obj,allowed)=>{if(!obj||typeof obj!=='object'||Array.isArray(obj)||Object.keys(obj).some(k=>!allowed.includes(k)))fail(400,'invalid_fields');return obj;};
export const uuid=value=>{if(typeof value!=='string'||!/^[a-f0-9-]{36}$/.test(value))fail(404,'not_found');return value;};
export const resourceId=value=>{if(typeof value!=='string'||!/^[a-z0-9][a-z0-9-]{1,79}$/.test(value))fail(404,'not_found');return value;};
export const stageValue=value=>{if(!stages.has(value))fail(400,'invalid_stage');return value;};
export const dateValue=value=>{if(typeof value!=='string'||!/^20\d\d-\d\d-\d\d$/.test(value)||Number.isNaN(Date.parse(value+'T12:00:00Z'))||new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value)fail(400,'invalid_date');return value;};
export const revision=value=>{if(!Number.isSafeInteger(value)||value<1)fail(400,'invalid_revision');return value;};
export const encode=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const secureEqual=(a,b)=>{if(typeof a!=='string'||typeof b!=='string'||!a.length||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;};
export const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');
export const digest=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),n=>n.toString(16).padStart(2,'0')).join('');
export const cookie=(request,name)=>{const all=request.headers.get('Cookie')||'';const pairs=all.split(';').map(s=>s.trim());const values=pairs.filter(s=>s.startsWith(name+'='));if(values.length!==1)return '';const v=values[0].slice(name.length+1);return /^[a-f0-9]{64}$/.test(v)?v:'';};
export const sessionCookie=(value,seconds=28800)=>`__Host-glenolia-edu=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`;
export const browserCookie=(value,seconds=1200)=>`__Host-glenolia-login=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`;
export async function readBody(request,max=131072){
 if(request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()!=='application/json')fail(415,'json_required');
 const reader=request.body?.getReader();if(!reader)fail(400,'invalid_body');let size=0,parts=[];
 for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();fail(413,'too_large');}parts.push(value);}
 const all=new Uint8Array(size);let at=0;for(const p of parts){all.set(p,at);at+=p.length;}
 try{return JSON.parse(new TextDecoder().decode(all));}catch{fail(400,'invalid_json');}
}
export function sameOrigin(request){const url=new URL(request.url);if(request.headers.get('Origin')!==url.origin)fail(403,'origin_required');const site=request.headers.get('Sec-Fetch-Site');if(site&&site!=='same-origin'&&site!=='none')fail(403,'origin_required');}
export async function rate(db,key,limit,periodMs,now=Date.now()){
 const period=Math.floor(now/periodMs);const row=await db.prepare('INSERT INTO edu_rate_limits(key,period,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN period=excluded.period THEN count+1 ELSE 1 END,period=excluded.period RETURNING count').bind(key,period).first();return row.count<=limit;
}
export const all=async stmt=>(await stmt.all()).results||[];
export async function audit(db,actor,action,object,school=null){await db.prepare('INSERT INTO edu_audit(id,actor_id,school_id,action,object_id,created_at) VALUES(?,?,?,?,?,?)').bind(id(),actor,school,action,object,nowISO()).run();}
export async function loadActor(request,env,{required=true}={}){
 const raw=cookie(request,'__Host-glenolia-edu');if(!raw){if(required)fail(401,'sign_in_required');return null;}
 const hash=await digest(raw),now=Date.now();const row=await env.EDU_DB.prepare('SELECT s.hash,s.school_id,s.expires_at,s.last_seen,u.id,u.email,u.name,u.disabled FROM edu_sessions s JOIN edu_users u ON u.id=s.user_id WHERE s.hash=?').bind(hash).first();
 if(!row||row.disabled||row.expires_at<=now||row.last_seen<now-1800000){if(required)fail(401,'session_expired');return null;}
 const memberships=await all(env.EDU_DB.prepare("SELECT m.school_id,m.role,m.can_assess,s.name,s.kind,s.status,s.evidence_enabled,s.agreement_reference,s.retention_days FROM edu_memberships m JOIN edu_schools s ON s.id=m.school_id WHERE m.user_id=? AND m.active=1 AND s.status<>'suspended' ORDER BY s.kind,s.name").bind(row.id));
 const membership=memberships.find(m=>m.school_id===row.school_id);if(!membership){if(required)fail(403,'membership_revoked');return null;}
 if(now-row.last_seen>60000)await env.EDU_DB.prepare('UPDATE edu_sessions SET last_seen=? WHERE hash=?').bind(now,hash).run();
 return {id:row.id,email:row.email,name:row.name,sessionHash:hash,csrf:await digest('csrf:'+raw+':'+env.SESSION_KEY),schoolId:membership.school_id,school:membership,memberships};
}
const schoolDTO=m=>({id:m.school_id,name:m.name,kind:m.kind,status:m.status,role:m.role,evidenceEnabled:!!m.evidence_enabled,canAssess:!!m.can_assess,retentionDays:m.retention_days});
export const publicActor=a=>a?{user:{id:a.id,name:a.name,email:a.email},csrf:a.csrf,school:schoolDTO(a.school),memberships:a.memberships.map(schoolDTO)}: {user:null};
export const requireCSRF=(request,actor)=>{sameOrigin(request);if(!secureEqual(request.headers.get('X-CSRF'),actor.csrf))fail(403,'csrf_required');};
export function evidenceGate(actor){if(actor.school.kind!=='school'||actor.school.status!=='approved'||!actor.school.evidence_enabled||!actor.school.agreement_reference||!actor.school.can_assess)fail(403,'school_evidence_approval_required');}
export async function ownGroup(db,actor,groupId){
 uuid(groupId);const g=await db.prepare('SELECT * FROM edu_groups WHERE id=? AND school_id=? AND (owner_id=? OR EXISTS(SELECT 1 FROM edu_group_teachers t WHERE t.group_id=edu_groups.id AND t.school_id=edu_groups.school_id AND t.user_id=?))').bind(groupId,actor.schoolId,actor.id,actor.id).first();if(!g)fail(404,'group_not_found');return g;
}
export const confirmUpdated=result=>{if(!result.meta?.changes)fail(409,'changed_elsewhere');};
