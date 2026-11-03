import {json,fail,keys,text,emailValue,uuid,id,nowISO,all,resourceId,stageValue,revision,confirmUpdated,audit} from './education-common.mjs';
import {listResources} from './education-resources.mjs';
import {ownerHandoff} from './education-auth.mjs';
const availability=v=>{if(!['public','teacher','selected'].includes(v))fail(400,'invalid_availability');return v;};
const bool=v=>{if(typeof v!=='boolean')fail(400,'invalid_boolean');return v?1:0;};
async function ownerUser(db,email){let u=await db.prepare('SELECT * FROM edu_users WHERE email=?').bind(email).first();if(!u){const stamp=nowISO();await db.prepare("INSERT OR IGNORE INTO edu_users(id,email,name,requested_school,created_at,verified_at) VALUES(?,?,'John Ou','',?,?)").bind(id(),email,stamp,stamp).run();u=await db.prepare('SELECT * FROM edu_users WHERE email=?').bind(email).first();}return u;}
function validatePack(p){
 if(!p||typeof p!=='object'||Array.isArray(p))fail(400,'invalid_resource');resourceId(p.id);text(p.title,180);stageValue(p.stage);text(p.summary,2000);text(p.question,500);if(!Number.isInteger(p.term)||p.term<1||p.term>4)fail(400,'invalid_term');
 const fields=['id','title','stage','years','term','question','summary','outcomes','learningIntentions','successCriteria','equipment','safety','adjustments','lessons','fieldAlternative','classroomAlternative','homeAlternative','studentSheets','rubric','teacherMisconceptions','characterPrompts','sources','image','storyScenes','language','status','kind','curriculumNote','version','availability','pdfAvailable','pdfUrl','htmlUrl','publishedAt','revision'];keys(p,fields);
 if(p.storyScenes!==undefined){
  if(!Array.isArray(p.storyScenes)||p.storyScenes.length>6)fail(400,'invalid_story_scenes');
  const placements=new Set();
  for(const scene of p.storyScenes){
   if(!scene||typeof scene!=='object'||Array.isArray(scene))fail(400,'invalid_story_scene');
   keys(scene,['sceneId','placement','question','character']);
   if(!/^sl(?:0[1-9]|[12][0-9]|3[0-9]|40)$/.test(scene.sceneId)||!['opening','lesson-1','lesson-2','lesson-3','lesson-4','reflection'].includes(scene.placement)||placements.has(scene.placement))fail(400,'invalid_story_scene');
   placements.add(scene.placement);if(scene.question!==undefined)text(scene.question,500);if(scene.character!==undefined&&!['Pip','Milla','Dot','Together'].includes(scene.character))fail(400,'invalid_story_character');
  }
 }
 if(!Array.isArray(p.lessons)||p.lessons.length>12||!Array.isArray(p.studentSheets)||p.studentSheets.length>12||!Array.isArray(p.rubric)||p.rubric.length>12)fail(400,'invalid_resource_structure');
 const serialized=JSON.stringify(p);if(serialized.length>125000||serialized.includes('\u0000'))fail(413,'resource_too_large');
 for(const s of p.sources||[]){const u=typeof s==='string'?s:s.url;if(u){let url;try{url=new URL(u);}catch{fail(400,'invalid_source_url');}if(url.protocol!=='https:'||url.username||url.password)fail(400,'invalid_source_url');}}
 return p;
}
export async function staffRoutes(request,env,path,body){
 const db=env.EDU_DB,method=request.method,actor=env.ADMIN_EMAIL;const owner=await ownerUser(db,actor);
 if(path==='/dashboard'&&method==='GET'){
  const schools=await all(db.prepare("SELECT s.*,(SELECT COUNT(*) FROM edu_memberships m WHERE m.school_id=s.id AND m.active=1) teacherCount,(SELECT COUNT(*) FROM edu_groups g WHERE g.school_id=s.id) groupCount FROM edu_schools s WHERE kind='school' ORDER BY created_at DESC"));
  const teachers=await all(db.prepare('SELECT id,email,name,requested_school,created_at,verified_at,disabled FROM edu_users ORDER BY created_at DESC LIMIT 1000'));
  const memberships=await all(db.prepare('SELECT * FROM edu_memberships'));for(const u of teachers)u.memberships=memberships.filter(m=>m.user_id===u.id);
  const interests=await all(db.prepare('SELECT i.*,u.email,u.name AS teacher_name,s.name AS school_name FROM edu_interests i JOIN edu_users u ON u.id=i.user_id LEFT JOIN edu_schools s ON s.id=i.school_id ORDER BY i.created_at DESC LIMIT 500'));
  return json({schools,teachers,resources:await listResources(db,null,{staff:true}),interests,counts:{schools:schools.length,teachers:teachers.length},scope:'Owner-only school administration. No learner evidence is shown here.'});
 }
 if(path==='/owner-workspace'&&method==='POST'){keys(body,[]);return json({url:await ownerHandoff(env,actor,owner.name)});}
 if(path==='/schools'&&method==='POST'){
  const b=keys(body,['name','ownerEmail']),name=text(b.name,160),email=emailValue(b.ownerEmail||actor),u=await db.prepare('SELECT id FROM edu_users WHERE email=? AND disabled=0').bind(email).first();if(!u)fail(409,'teacher_must_sign_in_first');const sid=id();await db.batch([db.prepare("INSERT INTO edu_schools(id,name,kind,owner_id,status,created_at) VALUES(?,?,'school',?,'pending',?)").bind(sid,name,u.id,nowISO()),db.prepare("INSERT INTO edu_memberships(school_id,user_id,role,can_assess) VALUES(?,?,'coordinator',0)").bind(sid,u.id)]);await audit(db,actor,'school_created',sid,sid);return json({schoolId:sid},201);
 }
 const sr=path.match(/^\/schools\/([a-f0-9-]{36})$/);
 if(sr&&method==='POST'){
  const b=keys(body,['name','status','evidenceEnabled','agreementReference','retentionDays','expectedRevision']),s=await db.prepare("SELECT * FROM edu_schools WHERE id=? AND kind='school'").bind(sr[1]).first();if(!s)fail(404,'school_not_found');if(!['pending','approved','suspended'].includes(b.status))fail(400,'invalid_status');const enabled=bool(b.evidenceEnabled),agreement=text(b.agreementReference||'',300,{empty:!enabled});const retention=Number(b.retentionDays||90);if(!Number.isInteger(retention)||retention<7||retention>730)fail(400,'invalid_retention');if(enabled&&(b.status!=='approved'||agreement.length<8))fail(400,'agreement_required');
  confirmUpdated(await db.prepare('UPDATE edu_schools SET name=?,status=?,evidence_enabled=?,agreement_reference=?,retention_days=?,approved_at=?,approved_by=?,revision=revision+1 WHERE id=? AND revision=?').bind(text(b.name,160),b.status,enabled,agreement,retention,b.status==='approved'?nowISO():null,b.status==='approved'?actor:null,s.id,revision(b.expectedRevision)).run());
  if(b.status==='suspended')await db.prepare('DELETE FROM edu_sessions WHERE school_id=?').bind(s.id).run();await audit(db,actor,enabled?'school_evidence_enabled':'school_updated',s.id,s.id);return json({schoolId:s.id,revision:b.expectedRevision+1});
 }
 if(path==='/memberships'&&method==='POST'){
  const b=keys(body,['schoolId','userId','role','canAssess','active']),sid=uuid(b.schoolId),uid=uuid(b.userId);if(!['teacher','coordinator'].includes(b.role))fail(400,'invalid_role');const active=bool(b.active),assess=bool(b.canAssess);
  if(!await db.prepare("SELECT id FROM edu_schools WHERE id=? AND kind='school'").bind(sid).first()||!await db.prepare('SELECT id FROM edu_users WHERE id=? AND disabled=0').bind(uid).first())fail(404,'membership_target_not_found');
  await db.prepare('INSERT INTO edu_memberships(school_id,user_id,role,can_assess,active) VALUES(?,?,?,?,?) ON CONFLICT(school_id,user_id) DO UPDATE SET role=excluded.role,can_assess=excluded.can_assess,active=excluded.active').bind(sid,uid,b.role,assess,active).run();if(!active||!assess)await db.prepare('DELETE FROM edu_sessions WHERE user_id=? AND school_id=?').bind(uid,sid).run();await audit(db,actor,active?'membership_granted':'membership_revoked',uid,sid);return json({saved:true});
 }
 const detail=path.match(/^\/resources\/([a-z0-9-]+)$/);
 if(detail&&method==='GET'){
  const rid=resourceId(detail[1]),r=await db.prepare('SELECT * FROM edu_resources WHERE id=?').bind(rid).first();if(!r)fail(404,'resource_not_found');const versions=await all(db.prepare('SELECT version,payload,pdf_key,pdf_size,published_at,created_at,review_note FROM edu_resource_versions WHERE resource_id=? ORDER BY version DESC').bind(rid));const draft=versions.find(v=>!v.published_at)||versions[0],published=versions.find(v=>v.version===r.published_version);
  return json({resource:r,draft:draft?{...JSON.parse(draft.payload),version:draft.version,pdfAvailable:!!draft.pdf_key||draft.pdf_size>0}:null,published:published?JSON.parse(published.payload):null,versions:versions.map(v=>({version:v.version,pdfAvailable:!!v.pdf_key||v.pdf_size>0,publishedAt:v.published_at,reviewNote:v.review_note})),grants:await all(db.prepare('SELECT school_id,user_id FROM edu_resource_grants WHERE resource_id=?').bind(rid))});
 }
 if(path==='/resources/save'&&method==='POST'){
  const b=keys(body,['resource','expectedRevision','availability']),p=validatePack(b.resource),rid=p.id,stamp=nowISO(),editToken=id(),avail=availability(b.availability||'teacher');const expected=b.expectedRevision;if(!Number.isSafeInteger(expected)||expected<0)fail(400,'invalid_revision');const max=await db.prepare('SELECT COALESCE(MAX(version),0) n FROM edu_resource_versions WHERE resource_id=?').bind(rid).first(),v=max.n+1;
  const payload=JSON.stringify({...p,availability:avail,language:'en'});let statements;
  if(expected===0)statements=[db.prepare("INSERT OR IGNORE INTO edu_resources(id,title,stage,term,availability,status,updated_at,last_edit_token) VALUES(?,?,?,?,?,'draft',?,?)").bind(rid,p.title,p.stage,p.term,avail,stamp,editToken)];
  else statements=[db.prepare('UPDATE edu_resources SET revision=revision+1,updated_at=?,last_edit_token=? WHERE id=? AND revision=?').bind(stamp,editToken,rid,expected)];
  statements.push(db.prepare('INSERT INTO edu_resource_versions(resource_id,version,payload,created_at,actor) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM edu_resources WHERE id=? AND last_edit_token=?)').bind(rid,v,payload,stamp,actor,rid,editToken));const results=await db.batch(statements);confirmUpdated(results[0]);confirmUpdated(results[1]);await audit(db,actor,'resource_draft_saved',rid);return json({resourceId:rid,version:v,revision:expected+1},201);
 }
 const pdf=path.match(/^\/resources\/([a-z0-9-]+)\/pdf$/);
 if(pdf&&method==='POST'){
  const b=keys(body,['version','pdfBase64']),rid=resourceId(pdf[1]),v=revision(b.version),r=await db.prepare('SELECT published_at FROM edu_resource_versions WHERE resource_id=? AND version=?').bind(rid,v).first();if(!r)fail(404,'resource_version_not_found');if(r.published_at)fail(409,'published_file_immutable');const encoded=text(b.pdfBase64,2900000).replace(/^data:application\/pdf;base64,/,'');let bytes;try{const raw=atob(encoded);if(raw.length>2097152)fail(413,'pdf_too_large');bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);}catch(e){if(e?.status)throw e;fail(400,'invalid_pdf');}
  try{const {validateStaticPDF}=await import('./education-pdf.mjs');await validateStaticPDF(bytes);}catch{fail(400,'pdf_requires_safe_static_copy');}
  await db.prepare('UPDATE edu_resource_versions SET pdf_blob=?,pdf_size=?,pdf_key=NULL WHERE resource_id=? AND version=? AND published_at IS NULL').bind(bytes.buffer,bytes.length,rid,v).run();await audit(db,actor,'resource_pdf_uploaded',rid);return json({uploaded:true,bytes:bytes.length,notice:'Static-file checks are not a malware or accessibility certification. Check rights, content and accessible alternatives before publishing.'});
 }
 const pub=path.match(/^\/resources\/([a-z0-9-]+)\/(publish|withdraw)$/);
 if(pub&&method==='POST'){
  const rid=resourceId(pub[1]);
  if(pub[2]==='withdraw'){const b=keys(body,['expectedRevision']);confirmUpdated(await db.prepare("UPDATE edu_resources SET status='withdrawn',revision=revision+1,updated_at=? WHERE id=? AND revision=?").bind(nowISO(),rid,revision(b.expectedRevision)).run());await audit(db,actor,'resource_withdrawn',rid);return json({withdrawn:true,revision:b.expectedRevision+1});}
  const b=keys(body,['version','expectedRevision','availability','schoolIds','teacherIds','reviewNote']),v=revision(b.version),expected=revision(b.expectedRevision),avail=availability(b.availability),note=text(b.reviewNote,1500);const row=await db.prepare('SELECT payload FROM edu_resource_versions WHERE resource_id=? AND version=?').bind(rid,v).first();if(!row)fail(404,'resource_version_not_found');const p=validatePack(JSON.parse(row.payload));
  const schoolIds=b.schoolIds||[],teacherIds=b.teacherIds||[];if(!Array.isArray(schoolIds)||!Array.isArray(teacherIds)||schoolIds.length+teacherIds.length>200)fail(400,'invalid_grants');if(avail==='selected'&&!schoolIds.length&&!teacherIds.length)fail(400,'grant_required');for(const sid of schoolIds){uuid(sid);if(!await db.prepare("SELECT id FROM edu_schools WHERE id=? AND kind='school' AND status='approved'").bind(sid).first())fail(400,'approved_school_required');}for(const uid of teacherIds){uuid(uid);if(!await db.prepare('SELECT id FROM edu_users WHERE id=? AND disabled=0').bind(uid).first())fail(400,'verified_teacher_required');}
  const editToken=id(),stamp=nowISO(),steps=[db.prepare("UPDATE edu_resources SET title=?,stage=?,term=?,availability=?,published_version=?,status='published',updated_at=?,revision=revision+1,last_edit_token=? WHERE id=? AND revision=?").bind(p.title,p.stage,p.term,avail,v,stamp,editToken,rid,expected),db.prepare('UPDATE edu_resource_versions SET published_at=COALESCE(published_at,?),review_note=? WHERE resource_id=? AND version=? AND EXISTS(SELECT 1 FROM edu_resources WHERE id=? AND last_edit_token=?)').bind(stamp,note,rid,v,rid,editToken),db.prepare('DELETE FROM edu_resource_grants WHERE resource_id=? AND EXISTS(SELECT 1 FROM edu_resources WHERE id=? AND last_edit_token=?)').bind(rid,rid,editToken)];
  for(const sid of new Set(schoolIds))steps.push(db.prepare('INSERT INTO edu_resource_grants(resource_id,school_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM edu_resources WHERE id=? AND last_edit_token=?)').bind(rid,sid,rid,editToken));for(const uid of new Set(teacherIds))steps.push(db.prepare('INSERT INTO edu_resource_grants(resource_id,user_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM edu_resources WHERE id=? AND last_edit_token=?)').bind(rid,uid,rid,editToken));const result=await db.batch(steps);confirmUpdated(result[0]);await audit(db,actor,'resource_published',rid);return json({published:true,version:v,revision:expected+1});
 }
 const ir=path.match(/^\/interests\/([a-f0-9-]{36})$/);if(ir&&method==='POST'){const b=keys(body,['status']);if(!['new','contacted','closed'].includes(b.status))fail(400,'invalid_status');confirmUpdated(await db.prepare('UPDATE edu_interests SET status=? WHERE id=?').bind(b.status,ir[1]).run());return json({saved:true});}
 return null;
}
