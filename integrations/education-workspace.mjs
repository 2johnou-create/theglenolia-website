import {json,fail,all,keys,text,id,nowISO,stageValue,dateValue,revision,resourceId,uuid,ownGroup,evidenceGate,modes,levels,confirmUpdated,audit,encode,token,SECURITY} from './education-common.mjs';
import {getResource,accessible,printablePage,printableResource} from './education-resources.mjs';
export function currentSydneyDate(value=new Date()){const p=Object.fromEntries(new Intl.DateTimeFormat('en',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(value).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
async function groupList(db,a){return all(db.prepare("SELECT g.*, (SELECT COUNT(*) FROM edu_assignments x WHERE x.school_id=g.school_id AND x.group_id=g.id) AS assignmentCount,(SELECT COUNT(*) FROM edu_learners l WHERE l.school_id=g.school_id AND l.group_id=g.id) AS learnerCount FROM edu_groups g WHERE g.school_id=? AND (g.owner_id=? OR EXISTS(SELECT 1 FROM edu_group_teachers t WHERE t.school_id=g.school_id AND t.group_id=g.id AND t.user_id=?)) ORDER BY g.created_at DESC").bind(a.schoolId,a.id,a.id));}
const groupDTO=g=>({id:g.id,name:g.name,stage:g.stage,status:g.status,revision:g.revision,assignmentCount:g.assignmentCount||0,learnerCount:g.learnerCount||0,createdAt:g.created_at,closedAt:g.closed_at});
async function workspace(db,a){
 const fav=await all(db.prepare('SELECT f.resource_id,r.* FROM edu_favourites f JOIN edu_resources r ON r.id=f.resource_id WHERE f.user_id=?').bind(a.id));const notes=await all(db.prepare('SELECT n.resource_id,n.note,n.revision,r.* FROM edu_remarks n JOIN edu_resources r ON r.id=n.resource_id WHERE n.user_id=?').bind(a.id));
 const favourites=[],remarks=[];for(const r of fav)if(await accessible(db,r,a))favourites.push(r.resource_id);for(const r of notes)if(await accessible(db,r,a))remarks.push({resourceId:r.resource_id,note:r.note,revision:r.revision});
 return {favourites,remarks,groups:(await groupList(db,a)).map(groupDTO)};
}
export async function groupDetail(db,a,g){
 const assignments=await all(db.prepare('SELECT x.*,r.title FROM edu_assignments x JOIN edu_resources r ON r.id=x.resource_id WHERE x.school_id=? AND x.group_id=? ORDER BY x.created_at').bind(a.schoolId,g.id));
 let canUseEvidence=true;try{evidenceGate(a);}catch{canUseEvidence=false;}
 const learners=canUseEvidence?await all(db.prepare('SELECT id,alias,created_at FROM edu_learners WHERE school_id=? AND group_id=? ORDER BY alias').bind(a.schoolId,g.id)):[];
 const observations=canUseEvidence?await all(db.prepare('SELECT * FROM edu_observations WHERE school_id=? AND group_id=? ORDER BY observed_on DESC').bind(a.schoolId,g.id)):[];
 return {group:groupDTO(g),canUseEvidence,assignments:assignments.map(x=>({id:x.id,resourceId:x.resource_id,title:x.title,version:x.version,instructions:x.instructions,selectedSections:JSON.parse(x.selected_sections),dueDate:x.due_date,printUrl:`/api/groups/${g.id}/assignments/${x.id}/print`})),learners,observations};
}
const printing=(body,title)=>{const nonce=token();return new Response(printablePage(title,body,{nonce}),{headers:{...SECURITY,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':`default-src 'none'; style-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`}});};
export async function workspaceRoutes(request,env,path,a,body){
 const db=env.EDU_DB,method=request.method;
 if(path==='/api/workspace'&&method==='GET')return json(await workspace(db,a));
 if(path==='/api/favourites'&&method==='POST'){
  const b=keys(body,['resourceId','saved']);resourceId(b.resourceId);await getResource(db,b.resourceId,a);if(typeof b.saved!=='boolean')fail(400,'invalid_saved');
  if(b.saved)await db.prepare('INSERT OR IGNORE INTO edu_favourites(user_id,resource_id,created_at) VALUES(?,?,?)').bind(a.id,b.resourceId,nowISO()).run();else await db.prepare('DELETE FROM edu_favourites WHERE user_id=? AND resource_id=?').bind(a.id,b.resourceId).run();return json({saved:b.saved});
 }
 if(path==='/api/remarks'&&method==='POST'){
  const b=keys(body,['resourceId','note','expectedRevision']);await getResource(db,resourceId(b.resourceId),a);const note=text(b.note,3000,{empty:true});if(!Number.isSafeInteger(b.expectedRevision)||b.expectedRevision<0)fail(400,'invalid_revision');let r;
  if(b.expectedRevision===0){if(!note)return json({revision:0});r=await db.prepare('INSERT OR IGNORE INTO edu_remarks(user_id,resource_id,note,updated_at) VALUES(?,?,?,?)').bind(a.id,b.resourceId,note,nowISO()).run();}
  else r=note?await db.prepare('UPDATE edu_remarks SET note=?,updated_at=?,revision=revision+1 WHERE user_id=? AND resource_id=? AND revision=?').bind(note,nowISO(),a.id,b.resourceId,b.expectedRevision).run():await db.prepare('DELETE FROM edu_remarks WHERE user_id=? AND resource_id=? AND revision=?').bind(a.id,b.resourceId,b.expectedRevision).run();
  confirmUpdated(r);return json({revision:note?b.expectedRevision+1:0,note});
 }
 if(path==='/api/groups'){
  if(method==='GET')return json({groups:(await groupList(db,a)).map(groupDTO)});
  if(method==='POST'){
   const b=keys(body,['name','stage']),gid=id(),stamp=nowISO();const count=await db.prepare('SELECT COUNT(*) n FROM edu_groups WHERE school_id=? AND owner_id=?').bind(a.schoolId,a.id).first();if(count.n>=50)fail(409,'group_allowance');
   const name=text(b.name,100),stage=stageValue(b.stage);await db.prepare('INSERT INTO edu_groups(id,school_id,owner_id,name,stage,created_at) VALUES(?,?,?,?,?,?)').bind(gid,a.schoolId,a.id,name,stage,stamp).run();await audit(db,a.id,'group_created',gid,a.schoolId);return json({group:groupDTO(await ownGroup(db,a,gid))},201);
  }
 }
 const route=path.match(/^\/api\/groups\/([a-f0-9-]{36})(?:\/(.*))?$/);
 if(route){const [,gid,action='']=route,g=await ownGroup(db,a,gid);
  if(!action&&method==='GET')return json(await groupDetail(db,a,g));
  if(action==='update'&&method==='POST'){
   const b=keys(body,['name','stage','status','expectedRevision']);if(!['active','closed'].includes(b.status))fail(400,'invalid_status');
   confirmUpdated(await db.prepare('UPDATE edu_groups SET name=?,stage=?,status=?,closed_at=?,revision=revision+1 WHERE id=? AND school_id=? AND revision=?').bind(text(b.name,100),stageValue(b.stage),b.status,b.status==='closed'?(g.closed_at||nowISO()):null,gid,a.schoolId,revision(b.expectedRevision)).run());return json({group:groupDTO(await ownGroup(db,a,gid))});
  }
  if(action==='assignments'&&method==='POST'){
   if(g.status!=='active')fail(409,'group_closed');const b=keys(body,['resourceId','version','selectedSections','instructions','dueDate']),p=await getResource(db,resourceId(b.resourceId),a,{version:b.version??null});
   const selected=b.selectedSections||[];const allowed=new Set([...(p.studentSheets||[]).flatMap((s,i)=>[s.id,'studentSheets:'+s.id,'studentSheets:'+i]),...(p.lessons||[]).flatMap((l,i)=>[l.id,'lessons:'+l.id,'lessons:'+i])]);
   if(!Array.isArray(selected)||selected.length>16||selected.some(s=>typeof s!=='string'||!allowed.has(s)))fail(400,'invalid_selection');
   const aid=id();await db.prepare('INSERT INTO edu_assignments(id,school_id,group_id,resource_id,version,instructions,selected_sections,due_date,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(aid,a.schoolId,gid,p.id,p.version,text(b.instructions||'',2000,{empty:true}),JSON.stringify([...new Set(selected)]),b.dueDate?dateValue(b.dueDate):null,a.id,nowISO()).run();return json({assignmentId:aid},201);
  }
  const ar=action.match(/^assignments\/([a-f0-9-]{36})\/(remove|print)$/);
  if(ar){const assignment=await db.prepare('SELECT * FROM edu_assignments WHERE id=? AND school_id=? AND group_id=?').bind(ar[1],a.schoolId,gid).first();if(!assignment)fail(404,'assignment_not_found');
   if(ar[2]==='print'&&method==='GET'){const p=await getResource(db,assignment.resource_id,a,{version:assignment.version});return printing(printableResource(p,{studentOnly:true,selectedSections:JSON.parse(assignment.selected_sections),instructions:assignment.instructions}),p.title+' · class handouts');}
   if(ar[2]==='remove'&&method==='POST'){keys(body,[]);const n=await db.prepare('SELECT COUNT(*) n FROM edu_observations WHERE assignment_id=? AND school_id=?').bind(assignment.id,a.schoolId).first();if(n.n)fail(409,'assignment_has_evidence');await db.prepare('DELETE FROM edu_assignments WHERE id=? AND school_id=? AND group_id=?').bind(assignment.id,a.schoolId,gid).run();return json({removed:true});}
  }
  if(action==='learners'&&method==='POST'){
   evidenceGate(a);if(g.status!=='active')fail(409,'group_closed');const b=keys(body,['alias']),alias=text(b.alias,24);if(!/^[A-Za-z0-9-]{1,24}$/.test(alias)||/^\d{8,}$/.test(alias))fail(400,'learner_code_required');
   const count=await db.prepare('SELECT COUNT(*) n FROM edu_learners WHERE school_id=? AND group_id=?').bind(a.schoolId,gid).first();if(count.n>=80)fail(409,'learner_allowance');const lid=id();await db.prepare('INSERT INTO edu_learners(id,school_id,group_id,alias,created_at) VALUES(?,?,?,?,?)').bind(lid,a.schoolId,gid,alias,nowISO()).run();return json({learner:{id:lid,alias}},201);
  }
  const lr=action.match(/^learners\/([a-f0-9-]{36})\/remove$/);
  if(lr&&method==='POST'){
   evidenceGate(a);keys(body,[]);const l=await db.prepare('SELECT id FROM edu_learners WHERE id=? AND school_id=? AND group_id=?').bind(lr[1],a.schoolId,gid).first();if(!l)fail(404,'learner_not_found');await db.batch([db.prepare('DELETE FROM edu_reports WHERE school_id=? AND group_id=?').bind(a.schoolId,gid),db.prepare('DELETE FROM edu_observations WHERE learner_id=? AND school_id=? AND group_id=?').bind(l.id,a.schoolId,gid),db.prepare('DELETE FROM edu_learners WHERE id=? AND school_id=? AND group_id=?').bind(l.id,a.schoolId,gid)]);await audit(db,a.id,'learner_removed',l.id,a.schoolId);return json({removed:true});
  }
  if(action==='observations'&&method==='POST'){
   evidenceGate(a);if(g.status!=='active')fail(409,'group_closed');const b=keys(body,['learnerId','assignmentId','criterion','level','evidence','feedback','mode','observedOn','id','expectedRevision']);
   const l=await db.prepare('SELECT id FROM edu_learners WHERE id=? AND school_id=? AND group_id=?').bind(uuid(b.learnerId),a.schoolId,gid).first();const assignment=await db.prepare('SELECT * FROM edu_assignments WHERE id=? AND school_id=? AND group_id=?').bind(uuid(b.assignmentId),a.schoolId,gid).first();if(!l||!assignment)fail(404,'learning_record_not_found');
   const p=await getResource(db,assignment.resource_id,a,{version:assignment.version}),criterion=text(b.criterion,200);if(!(p.rubric||[]).some(c=>c.criterion===criterion))fail(400,'criterion_not_in_assignment');if(!levels.has(b.level)||!modes.has(b.mode))fail(400,'invalid_observation');const date=dateValue(b.observedOn);if(date>currentSydneyDate())fail(400,'future_observation');
   const evidence=text(b.evidence||'',2000,{empty:b.level==='not_observed'}),feedback=text(b.feedback||'',2000,{empty:true}),oid=b.id?uuid(b.id):id(),stamp=nowISO();
   if(b.id)confirmUpdated(await db.prepare('UPDATE edu_observations SET level=?,evidence=?,feedback=?,mode=?,observed_on=?,teacher_id=?,updated_at=?,revision=revision+1 WHERE id=? AND school_id=? AND group_id=? AND learner_id=? AND assignment_id=? AND criterion=? AND revision=?').bind(b.level,evidence,feedback,b.mode,date,a.id,stamp,oid,a.schoolId,gid,l.id,assignment.id,criterion,revision(b.expectedRevision)).run());
   else await db.prepare('INSERT INTO edu_observations(id,school_id,group_id,learner_id,assignment_id,criterion,level,evidence,feedback,mode,observed_on,teacher_id,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(oid,a.schoolId,gid,l.id,assignment.id,criterion,b.level,evidence,feedback,b.mode,date,a.id,stamp).run();
   await audit(db,a.id,'observation_saved',oid,a.schoolId);return json({observationId:oid,revision:b.id?b.expectedRevision+1:1});
  }
 }
 if(path==='/api/reports'&&method==='POST'){
  evidenceGate(a);const b=keys(body,['groupId','learnerId']),g=await ownGroup(db,a,uuid(b.groupId));const detail=await groupDetail(db,a,g);if(b.learnerId&&!detail.learners.some(l=>l.id===b.learnerId))fail(404,'learner_not_found');const observations=b.learnerId?detail.observations.filter(o=>o.learner_id===b.learnerId):detail.observations;
  const rid=id(),stamp=nowISO(),snapshot={title:'Programme learning evidence',group:detail.group,school:a.school.name,learners:b.learnerId?detail.learners.filter(l=>l.id===b.learnerId):detail.learners,assignments:detail.assignments,observations,teacher:a.name,createdAt:stamp,limitations:'Teacher-recorded programme evidence, not an official grade or credential. Missing observations are not evidence of failure. Fieldwork records name the actual mode; a classroom task is not a farm visit.'};
  await db.prepare('INSERT INTO edu_reports(id,school_id,group_id,learner_id,snapshot,created_by,created_at) VALUES(?,?,?,?,?,?,?)').bind(rid,a.schoolId,g.id,b.learnerId||null,JSON.stringify(snapshot),a.id,stamp).run();await audit(db,a.id,'report_finalised',rid,a.schoolId);return json({reportId:rid,htmlUrl:'/api/reports/'+rid, csvUrl:'/api/reports/'+rid+'.csv'},201);
 }
 const rr=path.match(/^\/api\/reports\/([a-f0-9-]{36})(\.csv)?$/);
 if(rr&&method==='GET'){
  evidenceGate(a);const r=await db.prepare('SELECT * FROM edu_reports WHERE id=? AND school_id=?').bind(rr[1],a.schoolId).first();if(!r)fail(404,'report_not_found');await ownGroup(db,a,r.group_id);const s=JSON.parse(r.snapshot);if(rr[2]){
   const rows=[['Learner code','Resource/version','Criterion','Level','Evidence','Feedback','Mode','Observed on','Report created'],...s.observations.map(o=>[s.learners.find(l=>l.id===o.learner_id)?.alias||'',s.assignments.find(x=>x.id===o.assignment_id)?.resourceId+' v'+s.assignments.find(x=>x.id===o.assignment_id)?.version,o.criterion,o.level,o.evidence,o.feedback,o.mode,o.observed_on,s.createdAt])];
   const cell=v=>{const x=String(v??'');return '"'+(/^(?:[\s]*[=+@-]|[\t\r\n])/.test(x)?"'":'')+x.replaceAll('"','""')+'"';};return new Response('\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),{headers:{...SECURITY,'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="Glenolia-programme-evidence.csv"'}});
  }
  const table='<table><thead><tr><th>Learner code</th><th>Resource/version</th><th>Criterion</th><th>Observation and feedback</th></tr></thead><tbody>'+s.observations.map(o=>'<tr><td>'+encode(s.learners.find(l=>l.id===o.learner_id)?.alias||'')+'</td><td>'+encode(s.assignments.find(x=>x.id===o.assignment_id)?.resourceId||'')+' v'+encode(s.assignments.find(x=>x.id===o.assignment_id)?.version||'')+'</td><td>'+encode(o.criterion)+'<br>'+encode(o.level)+'</td><td>'+encode(o.evidence)+'<br>'+encode(o.feedback)+'<br>'+encode(o.mode)+' · '+encode(o.observed_on)+'</td></tr>').join('')+'</tbody></table>';
  return printing(`<p class="kicker">THE GLENOLIA · PRIVATE SCHOOL COPY</p><h1>${encode(s.title)}</h1><p>${encode(s.school)} · ${encode(s.group.name)} · ${encode(s.teacher)}</p><p>Finalised ${encode(s.createdAt)}. Immutable snapshot; later changes require a new report.</p><aside>${encode(s.limitations)}</aside>${table||'<p>No evidence recorded.</p>'}`,s.title);
 }
 if(path==='/api/interests'&&method==='POST'){
  const b=keys(body,['stage','mode','preferredTerm','approximateCount','message']);const count=Number(b.approximateCount);if(!Number.isSafeInteger(count)||count<1||count>500||!modes.has(b.mode))fail(400,'invalid_interest');const iid=id();await db.prepare('INSERT INTO edu_interests(id,user_id,school_id,stage,mode,preferred_term,approximate_count,message,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(iid,a.id,a.schoolId,stageValue(b.stage),b.mode,text(b.preferredTerm,80),count,text(b.message||'',2000,{empty:true}),nowISO()).run();return json({interestId:iid,message:'Your interest has been saved for the Glenolia team. No date is held and no visit is booked.'},201);
 }
 if(path==='/api/profile/export'&&method==='GET'){
  const data={exportedAt:nowISO(),user:{name:a.name,email:a.email},workspace:await workspace(db,a),groups:[]};for(const g of await groupList(db,a))data.groups.push(await groupDetail(db,a,g));return json(data,200,{'Content-Disposition':'attachment; filename="Glenolia-my-workspace.json"'});
 }
 return null;
}
