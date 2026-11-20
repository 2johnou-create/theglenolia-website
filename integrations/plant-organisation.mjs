import {all,emailValue,fail,id,json,keys,nowISO,revision,SECURITY,text,uuid} from './education-common.mjs';
import {withdrawalReleaseAt} from './nsw-working-days.mjs';

// Programme membership is independent of access to school planning/evidence records.
export const orgMember = `SELECT m.org_id FROM edu_plant_members m JOIN edu_schools s ON s.id=m.org_id
 WHERE m.user_id=? AND s.status<>'suspended' AND NOT EXISTS(SELECT 1 FROM edu_memberships x
 WHERE x.school_id=m.org_id AND x.user_id=m.user_id AND x.active=0)`;
export const masterWhere = `master_id=? AND id IN (${orgMember})`;
export const openStates="'pending','offered','active','cooling'";
const ok=()=>json({ok:true});
const atSql="strftime('%Y-%m-%dT%H:%M:%fZ','now')";
export function longReason(input,code='invalid_field') {
 if(typeof input!=='string'||input.trim().length<10)fail(400,code);
 return text(input,1200);
}
export async function releaseDueAdoptions(db,at=nowISO()){
 const expired=await db.prepare("SELECT 1 FROM edu_plant_applications WHERE status='cooling' AND release_at<=? LIMIT 1").bind(at).first();
 if(expired)await db.prepare("UPDATE edu_plant_applications SET status='released',released_at=release_at,changed_by='automatic' WHERE status='cooling' AND release_at<=?").bind(at).run();
}
const orgSelect=`SELECT o.id,o.name,o.suburb,o.school_type AS schoolType,o.address,o.public_name AS publicName,o.revision,
 (o.master_id=?) AS isMaster,(o.logo_bytes IS NOT NULL) AS hasLogo FROM edu_plant_organisations o WHERE o.id IN (${orgMember})`;
export async function orgDetails(db,actorId,requested){
 const list=await all(db.prepare(orgSelect+' ORDER BY isMaster DESC,o.name,o.id').bind(actorId,actorId));
 for(const o of list){
  o.isMaster=Boolean(o.isMaster);o.publicName=Boolean(o.publicName);
  o.logoUrl=o.hasLogo?'/api/plants/organisation/logo/'+o.id+'?v='+o.revision:null;delete o.hasLogo;
 }
 const selected=requested ? list.find(o=>o.id===requested):list[0];
 if(requested&&!selected)fail(404,'organisation_not_found');
 const incomingInvitations=await all(db.prepare(`SELECT i.id,o.id AS orgId,o.name AS schoolName,i.expires_at AS expiresAt FROM edu_plant_invitations i
 JOIN edu_plant_organisations o ON o.id=i.org_id JOIN edu_schools s ON s.id=o.id
 JOIN edu_users u ON u.email=i.email WHERE u.id=? AND u.disabled=0 AND i.status='pending' AND s.status<>'suspended'
 AND i.expires_at>? ORDER BY i.created_at DESC`).bind(actorId,nowISO()));
 let members=[],invitations=[],events=[];
 if(selected){
  if(selected.isMaster){
   members=await all(db.prepare(`SELECT u.id,u.name,u.email,(o.master_id=u.id) AS isMaster FROM edu_plant_members m
    JOIN edu_users u ON u.id=m.user_id JOIN edu_plant_organisations o ON o.id=m.org_id
    WHERE m.org_id=? AND o.id IN (${orgMember}) AND o.master_id=? ORDER BY isMaster DESC,u.name,u.id`).bind(selected.id,actorId,actorId));
   members=members.map(m=>({...m,isMaster:!!m.isMaster}));
   invitations=await all(db.prepare(`SELECT i.id,i.email,i.expires_at AS expiresAt FROM edu_plant_invitations i JOIN edu_plant_organisations o ON o.id=i.org_id
     WHERE o.id=? AND o.id IN (${orgMember}) AND o.master_id=? AND i.status='pending' AND i.expires_at>? ORDER BY i.created_at DESC`).bind(selected.id,actorId,actorId,nowISO()));
   events=await all(db.prepare(`SELECT e.action,e.created_at AS createdAt,e.plant_key AS plantKey,e.application_id AS applicationId,e.reason
     FROM edu_plant_events e JOIN edu_plant_organisations o ON o.id=e.org_id WHERE o.id=? AND o.id IN (${orgMember}) AND o.master_id=? ORDER BY e.id DESC LIMIT 100`).bind(selected.id,actorId,actorId));
  }
 }
 return {organisations:list.map(({id,name,isMaster})=>({id,name,isMaster})),organisation:selected||null,members,invitations,incomingInvitations,events};
}
function requireChange(r,code='master_required'){if(!r.meta.changes)fail(code==='master_required'?403:409,code);}
export async function loadLogo(db,orgId,actorId=null){
 const row=await db.prepare('SELECT logo_bytes,logo_mime FROM edu_plant_organisations WHERE id=? AND logo_bytes IS NOT NULL'+
   (actorId?' AND id IN ('+orgMember+')':'')).bind(uuid(orgId),...(actorId?[actorId]:[])).first();
 if(!row)fail(404,'logo_not_found');
 return new Response(Array.isArray(row.logo_bytes)?Uint8Array.from(row.logo_bytes):row.logo_bytes,{headers:{...SECURITY,'Content-Type':row.logo_mime,'Content-Security-Policy':"default-src 'none'; sandbox",'X-Robots-Tag':'noindex, nofollow'}});
}
export async function saveOrgLogo(db,actor,b,image){
 const o=uuid(b.orgId);
 requireChange(await db.prepare(`UPDATE edu_plant_organisations SET logo_mime=?,logo_bytes=?,revision=revision+1,changed_by=? WHERE id=? AND ${masterWhere}`)
    .bind(image?.mime??null,image?.bytes.buffer??null,actor.id,o,actor.id,actor.id).run());
 return ok();
}
export async function orgRoutes(db,path,actor,body){
 const uid=actor.id;
 if(path==='/api/plants/organisation'){
  const b=keys(body,['orgId','name','address','publicName','revision']);
  if(typeof b.publicName!=='boolean')fail(400,'invalid_field');
  try{
   requireChange(await db.prepare(`UPDATE edu_plant_organisations SET name=?,address=?,public_name=?,revision=revision+1,changed_by=? WHERE id=? AND revision=? AND ${masterWhere}`)
    .bind(text(b.name,160).normalize('NFKC').replace(/\s+/g,' '),text(b.address,300),Number(b.publicName),uid,uuid(b.orgId),revision(b.revision),uid,uid).run(),'organisation_changed');
  }catch(e){if(/edu_plant_school_address|edu_plant_school_names/.test(e.message))fail(409,'school_already_registered');throw e;}
  return ok();
 }
 if(path==='/api/plants/invite'){
  const b=keys(body,['orgId','email']),o=uuid(b.orgId),email=emailValue(b.email),at=nowISO();
  if(email===actor.email)fail(409,'member_exists');
  const date=new Date(Date.parse(at)+7*86400000).toISOString();
  const results=await db.batch([
   db.prepare(`UPDATE edu_plant_invitations SET status='expired',changed_by='automatic' WHERE org_id=? AND email=? AND status='pending' AND expires_at<=? AND org_id IN(SELECT id FROM edu_plant_organisations WHERE ${masterWhere})`).bind(o,email,at,uid,uid),
   db.prepare(`INSERT INTO edu_plant_invitations(id,org_id,email,status,created_at,expires_at,changed_by)
    SELECT ?,id,?,'pending',?,?,? FROM edu_plant_organisations o WHERE id=? AND ${masterWhere}
    AND NOT EXISTS(SELECT 1 FROM edu_plant_members m JOIN edu_users u ON u.id=m.user_id WHERE m.org_id=o.id AND u.email=?)
    AND (SELECT COUNT(*) FROM edu_plant_invitations i WHERE i.org_id=o.id AND i.created_at>=?)<40
    ON CONFLICT(org_id,email) WHERE status='pending' DO NOTHING`)
   .bind(id(),email,at,date,uid,o,uid,uid,email,new Date(Date.parse(at)-86400000).toISOString())
  ]);
  if(!results[1].meta.changes){
   const master=await db.prepare(`SELECT id FROM edu_plant_organisations WHERE id=? AND ${masterWhere}`).bind(o,uid,uid).first();
   if(!master)fail(403,'master_required');
   const pending=await db.prepare("SELECT id FROM edu_plant_invitations WHERE org_id=? AND email=? AND status='pending' AND expires_at>?").bind(o,email,at).first();
   if(!pending){
    const member=await db.prepare('SELECT 1 FROM edu_plant_members m JOIN edu_users u ON u.id=m.user_id WHERE m.org_id=? AND u.email=?').bind(o,email).first();
    fail(member?409:429,member?'member_exists':'invitation_limit');
   }
  }
  return ok();
 }
 if(path==='/api/plants/invite/accept'||path==='/api/plants/invite/decline'){
  const b=keys(body,['invitationId']),dest=path.endsWith('accept')?'accepted':'declined';
  const result=await db.prepare(`UPDATE edu_plant_invitations SET status=?,changed_by=? WHERE id=? AND status='pending'
   AND expires_at>? AND email=(SELECT email FROM edu_users WHERE id=? AND disabled=0)
   AND EXISTS(SELECT 1 FROM edu_schools s WHERE s.id=org_id AND s.status<>'suspended')`).bind(dest,uid,uuid(b.invitationId),nowISO(),uid).run();
  if(!result.meta.changes){
   if(!await db.prepare('SELECT id FROM edu_plant_invitations WHERE id=? AND status=? AND changed_by=? AND email=?').bind(b.invitationId,dest,uid,actor.email).first())fail(409,'invitation_unavailable');
  }
  return ok();
 }
 if(path==='/api/plants/invite/revoke'){
  const b=keys(body,['orgId','invitationId']);
  requireChange(await db.prepare(`UPDATE edu_plant_invitations SET status='revoked',changed_by=? WHERE id=? AND org_id=? AND status='pending' AND org_id IN (SELECT id FROM edu_plant_organisations WHERE ${masterWhere})`).bind(uid,uuid(b.invitationId),uuid(b.orgId),uid,uid).run(),'invitation_unavailable');
  return ok();
 }
 if(path==='/api/plants/transfer'){
  const b=keys(body,['orgId','userId','reason']),to=uuid(b.userId),note=text(b.reason??'',1200,{empty:true});
  requireChange(await db.prepare(`UPDATE edu_plant_organisations SET master_id=?,changed_by=?,transfer_note=?,revision=revision+1
  WHERE id=? AND ${masterWhere} AND master_id<>? AND EXISTS(SELECT 1 FROM edu_plant_members m JOIN edu_users u ON u.id=m.user_id
    WHERE m.org_id=edu_plant_organisations.id AND u.id=? AND u.disabled=0 AND u.verified_at IS NOT NULL AND
    NOT EXISTS(SELECT 1 FROM edu_memberships x WHERE x.school_id=m.org_id AND x.user_id=u.id AND x.active=0))`).bind(to,uid,note,uuid(b.orgId),uid,uid,to,to).run(),'invalid_transfer');
  return ok();
 }
 if(path==='/api/plants/member/remove'){
  const b=keys(body,['orgId','userId']);
  requireChange(await db.prepare(`DELETE FROM edu_plant_members WHERE org_id=? AND user_id=? AND user_id<>? AND org_id IN(SELECT id FROM edu_plant_organisations WHERE ${masterWhere})`).bind(uuid(b.orgId),uuid(b.userId),uid,uid,uid).run());
  return ok();
 }
 if(path==='/api/plants/withdraw'||path==='/api/plants/withdraw/cancel'){
  const cancel=path.endsWith('/cancel'),b=keys(body,cancel?['applicationId']:['applicationId','reason']),applicationId=uuid(b.applicationId),at=nowISO();
  const owned=`id=? AND workspace_id IN(SELECT id FROM edu_plant_organisations WHERE ${masterWhere})`;
  if(cancel){
   requireChange(await db.prepare(`UPDATE edu_plant_applications SET status='active',release_at=NULL,withdrawal_reason=NULL,changed_by=? WHERE ${owned} AND status='cooling' AND release_at>?`)
       .bind(uid,applicationId,uid,uid,at).run(),'withdrawal_unavailable');
  }else{
   const reason=longReason(b.reason);
   const releaseAt=withdrawalReleaseAt(at);
   const changed=await db.prepare(`UPDATE edu_plant_applications SET status='cooling',release_at=?,withdrawal_reason=?,changed_by=? WHERE ${owned} AND status='active'`)
       .bind(releaseAt,reason,uid,applicationId,uid,uid).run();
   if(!changed.meta.changes && !await db.prepare(`SELECT id FROM edu_plant_applications WHERE ${owned} AND status='cooling' AND withdrawal_reason=?`).bind(applicationId,uid,uid,reason).first())fail(409,'withdrawal_unavailable');
  }
  return ok();
 }
 return null;
}
