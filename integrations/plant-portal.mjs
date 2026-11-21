import {varietyRoutes} from './plant-varieties.mjs';
import {recognitionRoute} from './plant-recognition.mjs';
import {plantThreadRoute} from './plant-threads.mjs';
import {teacherFieldReport,staffFieldReport} from './plant-field-report.mjs';
import {snapshotForUpdate} from './plant-weather.mjs';
import { all, dateValue, digest, fail, id, json, keys, nowISO, rate, revision, SECURITY, text } from './education-common.mjs';
import {orgDetails,orgMember,masterWhere,openStates,longReason,orgRoutes,saveOrgLogo,loadLogo,releaseDueAdoptions} from './plant-organisation.mjs';
import {plantLearning} from './plant-learning.mjs';
import { currentSydneyDate } from './education-workspace.mjs';
import { IMAGE_MAX_BYTES, normaliseProgrammeImage, ProgrammeMediaError } from './programme-media.mjs';

const fieldPosition = /^r([1-9]|1[0-2])-p([1-9]|1[0-9])$/;
const uuid = value => {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)) fail(400, 'invalid_id');
  return value;
};
function position(key) {
  if (typeof key !== 'string' || !fieldPosition.test(key)) fail(400, 'invalid_plant');
  const [,row,number] = fieldPosition.exec(key);
  return { key, row:Number(row), position:Number(number) };
}
const applicationFields = `a.id,a.school_name AS schoolName,a.suburb,a.school_type AS schoolType,
  a.preferred_key AS preferredKey,a.plant_key AS plantKey,a.status,a.created_at AS createdAt,a.workspace_id AS orgId,
  a.reason,a.release_at AS releaseAt,a.withdrawal_reason AS withdrawalReason,a.released_at AS releasedAt,
  (SELECT stage FROM edu_atlas_positions WHERE plant_key=COALESCE(a.plant_key,a.preferred_key)) AS stage`;
const memberAccess = 'a.workspace_id IN ('+orgMember+')';
const ownerAccess = `a.workspace_id IN (SELECT id FROM edu_plant_organisations WHERE ${masterWhere})`;
const activeAccess = `SELECT a.plant_key FROM edu_plant_applications a WHERE ${memberAccess}
 AND (a.status='active' OR (a.status='cooling' AND a.release_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')))`;

const rowCapacity = 19;
const visiblePositions = `SELECT v.plant_key FROM edu_atlas_positions v JOIN edu_atlas_rows r USING(row_num)
  WHERE v.position<=r.enabled_count`;
const plantedPositions = visiblePositions+' AND v.stage>1';
async function inventory(db, staff=false) {
  await releaseDueAdoptions(db);
  // One read snapshot keeps each row's count consistent with its stage records.
  const slots = await all(db.prepare(`SELECT r.row_num,r.enabled_count,r.revision AS row_revision,
    v.plant_key,v.position,v.stage,v.revision,p.tag,p.available,a.status AS allocation,CASE WHEN o.public_name=1 THEN o.name END AS adopted_by,
    (SELECT cp.id FROM edu_coffee_plantings cp WHERE cp.plant_key=v.plant_key AND cp.ended_at IS NULL) AS current_planting,
    COALESCE((SELECT cv.name FROM edu_coffee_plantings cp JOIN edu_coffee_varieties cv ON cv.id=cp.variety_id WHERE cp.plant_key=v.plant_key AND cp.ended_at IS NULL),
             (SELECT json_extract(snapshot,'$.variety') FROM edu_plant_field_profiles WHERE scope_key=v.plant_key ORDER BY revision DESC LIMIT 1)) AS variety,
    EXISTS(SELECT 1 FROM edu_plant_stage_photos sp WHERE sp.plant_key=v.plant_key AND sp.stage=v.stage) AS has_stage_photo
    FROM edu_atlas_rows r JOIN edu_atlas_positions v USING(row_num)
    LEFT JOIN edu_plants p ON p.plant_key=v.plant_key
    LEFT JOIN edu_plant_applications a ON a.plant_key=v.plant_key AND a.status IN ('offered','active','cooling')
    LEFT JOIN edu_plant_organisations o ON o.id=a.workspace_id
    ORDER BY r.row_num,v.position`));
  const rows=[], plants=[], archivedPlants=[];
  for (const slot of slots) {
    const row = slot.row_num;
    if (slot.position===1) rows.push({row,enabledCount:slot.enabled_count,capacity:rowCapacity,
      ...(staff ? {revision:slot.row_revision} : {})});
    const visible = slot.position<=slot.enabled_count;
    if (!visible && !(staff && slot.tag)) continue;
    let status = 'unverified';
    if (slot.tag) status = slot.allocation ? (staff ? slot.allocation : 'unavailable') : (slot.available ? 'available' : 'unavailable');
    if (!staff && slot.stage===1) status='preparing';
    const adoption = !staff && ['active','cooling'].includes(slot.allocation)
      ? {adoptionStatus:slot.allocation==='active'?'adopted':'cooling',...(slot.adopted_by?{adoptedBy:slot.adopted_by}:{})} : {};
    const plant = {key:slot.plant_key,row,position:slot.position,label:'P'+((row-1)*rowCapacity+slot.position),
      stage:slot.stage,status,...(slot.variety ? {variety:slot.variety} : {}),...(slot.has_stage_photo ? {stagePhoto:true} : {}),...adoption,...(staff ? {revision:slot.revision,tag:slot.tag,plantingId:slot.current_planting||null} : {})};
    (visible ? plants : archivedPlants).push(plant);
  }
  return {rows,plants,...(staff ? {archivedPlants} : {})};
}
export async function publicPlantMap(request,env) {
  const origin = request.headers.get('Origin');
  const headers = { Vary:'Origin', ...(origin === 'https://theglenolia.com.au' ? {'Access-Control-Allow-Origin':origin} : {}) };
  return json(await inventory(env.EDU_DB), 200, headers);
}
export async function publicStagePhoto(request,env) {
  const key=position(new URL(request.url).pathname.split('/').at(-1)).key;
  const row=await env.EDU_DB.prepare(`SELECT sp.photo_mime,sp.photo_bytes FROM edu_plant_stage_photos sp
    JOIN edu_atlas_positions v ON v.plant_key=sp.plant_key AND v.stage=sp.stage
    JOIN edu_atlas_rows r ON r.row_num=v.row_num WHERE sp.plant_key=? AND v.position<=r.enabled_count`).bind(key).first();
  if(!row)fail(404,'not_found');
  const bytes=Array.isArray(row.photo_bytes)?Uint8Array.from(row.photo_bytes):row.photo_bytes;
  return new Response(bytes,{headers:{...SECURITY,'Content-Type':row.photo_mime,'Cache-Control':'public, max-age=60','Cross-Origin-Resource-Policy':'cross-origin','X-Content-Type-Options':'nosniff'}});
}
async function saveStagePhoto(db,body,staffId) {
  const b=keys(body,['key','stage','photo','remove','expectedPlantingId']),p=position(b.key);
  const stage=boundedInt(b.stage,1,10);
  const current=await db.prepare('SELECT id FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NULL').bind(p.key).first();
  if(b.expectedPlantingId!==undefined && (current?.id||null)!==(b.expectedPlantingId||null))fail(409,'planting_changed');
  if(b.expectedPlantingId===undefined && await db.prepare('SELECT 1 FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NOT NULL').bind(p.key).first())fail(409,'planting_changed');
  if(b.remove===true){
    await db.prepare("DELETE FROM edu_plant_stage_photos WHERE plant_key=? AND stage=? AND COALESCE((SELECT id FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NULL),'')=?").bind(p.key,stage,p.key,current?.id||'').run();
    const latest=await db.prepare('SELECT id FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NULL').bind(p.key).first();
    if((latest?.id||null)!==(current?.id||null))fail(409,'planting_changed');
    return ok();
  }
  const picture=cleanPhoto(b.photo);
  if(!picture)fail(400,'invalid_image');
  const saved=await db.prepare(`INSERT INTO edu_plant_stage_photos(plant_key,stage,photo_mime,photo_bytes,recorded_at,recorded_by)
    SELECT plant_key,?,?,?,?,? FROM edu_plants WHERE plant_key=? AND EXISTS (SELECT 1 FROM edu_atlas_positions WHERE plant_key=? AND stage=?) AND COALESCE((SELECT id FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NULL),'')=?
    ON CONFLICT(plant_key,stage) DO UPDATE SET photo_mime=excluded.photo_mime,photo_bytes=excluded.photo_bytes,
    recorded_at=excluded.recorded_at,recorded_by=excluded.recorded_by`)
    .bind(stage,picture.mime,picture.bytes.buffer,nowISO(),staffId,p.key,p.key,stage,p.key,current?.id||'').run();
  if(!saved.meta.changes)fail(409,'atlas_changed');
  return ok();
}
async function journal(db,plantKey,photoPrefix,actorId=null) {
  const scope=actorId ? ' AND plant_key IN ('+activeAccess+')' : '';
  const rows=await all(db.prepare(`SELECT id,observed_on AS observedOn,note,created_at AS createdAt,photo_mime AS mime,
    EXISTS(SELECT 1 FROM edu_coffee_plantings current WHERE current.plant_key=edu_plant_updates.plant_key AND current.ended_at IS NULL
      AND (edu_plant_updates.planting_id IS NULL OR edu_plant_updates.planting_id<>current.id)
      AND EXISTS(SELECT 1 FROM edu_coffee_plantings old WHERE old.plant_key=current.plant_key AND old.ended_at IS NOT NULL)) AS previousPlanting,
    (SELECT payload FROM edu_plant_weather_logs WHERE update_id=edu_plant_updates.id) AS weatherJson
    FROM edu_plant_updates WHERE plant_key=? AND withdrawn=0${scope} ORDER BY observed_on DESC,created_at DESC,id DESC`)
    .bind(plantKey,...(actorId ? [actorId] : [])));
  return rows.map(({ mime,weatherJson,previousPlanting,...row }) => ({ ...row,...(previousPlanting?{previousPlanting:true}:{}), weather:weatherJson ? JSON.parse(weatherJson) : null, photoUrl:mime ? photoPrefix+row.id : null }));
}
async function photo(db,updateId,actorId=null) {
  const scope=actorId ? ' AND plant_key IN ('+activeAccess+')' : '';
  const row=await db.prepare('SELECT photo_mime,photo_bytes FROM edu_plant_updates WHERE id=? AND withdrawn=0 AND photo_mime IS NOT NULL'+scope)
    .bind(uuid(updateId),...(actorId ? [actorId] : [])).first();
  if (!row) fail(404,'photo_not_found');
  const bytes=Array.isArray(row.photo_bytes) ? Uint8Array.from(row.photo_bytes) : row.photo_bytes;
  return new Response(bytes,{headers:{...SECURITY,'Content-Type':row.photo_mime,'Content-Security-Policy':"default-src 'none'; sandbox",'X-Robots-Tag':'noindex, nofollow'}});
}
async function myPlant(db,actor,url) {
  await releaseDueAdoptions(db);
  const requested=url.searchParams.get('applicationId'),orgRequest=url.searchParams.get('orgId');
  let orgId=orgRequest;
  if(requested){
    const resolved=await db.prepare(`SELECT a.workspace_id AS orgId FROM edu_plant_applications a WHERE a.id=? AND ${memberAccess}`).bind(uuid(requested),actor.id).first();
    if(!resolved || (orgId && resolved.orgId!==orgId))fail(404,'application_not_found');
    orgId=resolved.orgId;
  }
  const profile=await orgDetails(db,actor.id,orgId);
  const applications=profile.organisation ? await all(db.prepare(`SELECT ${applicationFields} FROM edu_plant_applications a WHERE a.workspace_id=? AND ${memberAccess}
    ORDER BY CASE a.status WHEN 'active' THEN 0 WHEN 'cooling' THEN 1 WHEN 'offered' THEN 2 WHEN 'pending' THEN 3 ELSE 4 END,a.created_at DESC,a.id DESC`)
      .bind(profile.organisation.id,actor.id)):[];
  const application=(requested?applications.find(a=>a.id===requested):applications[0]) || null;
  const result={...profile,applications,application,updates:[],questions:[]};
  if(!application || !['active','cooling'].includes(application.status)) return json(result);
  result.updates=await journal(db,application.plantKey,'/api/plants/photos/',actor.id);
  result.questions=await all(db.prepare(`SELECT q.id,q.question,q.answer,q.created_at AS createdAt FROM edu_plant_questions q
    JOIN edu_plant_applications a ON a.id=q.application_id WHERE a.id=? AND ${memberAccess} AND a.status IN('active','cooling') ORDER BY q.created_at DESC`).bind(application.id,actor.id));
  return json(result);
}
const ok=()=>json({ok:true});
async function apply(db,actor,body) {
  const b=keys(body,['schoolName','suburb','schoolType','preferredKey','consent','orgId','requestId','reason','publicName','address']);
  if(b.consent!==true)fail(400,'consent_required');
  if(b.publicName!==undefined&&typeof b.publicName!=='boolean')fail(400,'invalid_field');
  const orgId=b.orgId?uuid(b.orgId):actor.schoolId,appId=b.requestId?uuid(b.requestId):id();
  const key=b.preferredKey==null?null:position(b.preferredKey).key,at=nowISO();
  await releaseDueAdoptions(db,at);
  const org=await db.prepare(`SELECT o.id,o.name,o.suburb,o.school_type AS schoolType,o.master_id AS masterId,
    (SELECT COUNT(*) FROM edu_plant_applications WHERE workspace_id=o.id AND status IN(${openStates})) AS slots
    FROM edu_plant_organisations o WHERE o.id=? AND o.id IN(${orgMember})`).bind(orgId,actor.id).first();
  if((b.orgId&&!org)||(org&&org.masterId!==actor.id))fail(403,'master_required');
  const reason=b.reason?longReason(b.reason,'additional_reason_required'):'';
  if(b.requestId){
    const existing=await db.prepare('SELECT workspace_id,teacher_id,preferred_key,reason FROM edu_plant_applications WHERE id=?').bind(appId).first();
    if(existing){
      if(existing.workspace_id===orgId&&existing.teacher_id===actor.id&&existing.preferred_key===key&&existing.reason===reason)return ok();
      fail(409,'request_conflict');
    }
  }
  if(org?.slots>=3)fail(409,'plant_school_limit');
  if(org?.slots && !b.orgId)fail(409,'school_application_exists');
  if(org?.slots && (!reason||!b.requestId))fail(400,'additional_reason_required');
  const school=org?.name || text(b.schoolName,160).normalize('NFKC').replace(/\s+/g,' '),suburb=org?.suburb || text(b.suburb,100).normalize('NFKC').replace(/\s+/g,' '),type=org?.schoolType || b.schoolType;
  if(!['primary','high','combined','other'].includes(type))fail(400,'invalid_field');
  const address=text(b.address??'',300,{empty:true});
  const eligible=`(? IS NULL OR ? IN (${plantedPositions})) AND NOT EXISTS(SELECT 1 FROM edu_plants WHERE plant_key=? AND available=0)
    AND NOT EXISTS(SELECT 1 FROM edu_plant_applications WHERE plant_key=? AND status IN('offered','active','cooling'))`;
  const statements=[];
  if(!org){
   statements.push(db.prepare(`INSERT INTO edu_plant_organisations(id,master_id,name,suburb,school_type,address,public_name,created_at,changed_by)
     SELECT s.id,?,?,?,?,?,?,?,? FROM edu_schools s JOIN edu_memberships m ON m.school_id=s.id
     WHERE s.id=? AND s.status<>'suspended' AND m.user_id=? AND m.active=1 AND ${eligible}
     ON CONFLICT(id) DO NOTHING`).bind(actor.id,school,suburb,type,address,Number(!!b.publicName),at,actor.id,orgId,actor.id,key,key,key,key));
  }
  statements.push(db.prepare(`INSERT INTO edu_plant_applications(id,teacher_id,workspace_id,school_name,suburb,school_type,preferred_key,reason,created_at)
    SELECT ?,?,o.id,o.name,o.suburb,o.school_type,?,?,? FROM edu_plant_organisations o WHERE o.id=? AND ${masterWhere} AND ${eligible}
    AND (?<>'' OR NOT EXISTS(SELECT 1 FROM edu_plant_applications a WHERE a.workspace_id=o.id AND a.status IN(${openStates})))
    ON CONFLICT(id) DO NOTHING`).bind(appId,actor.id,key,reason,at,orgId,actor.id,actor.id,key,key,key,key,reason));
  try{
    const result=await db.batch(statements);
    if(result.at(-1).meta.changes)return ok();
  }catch(e){
    if(String(e.message).includes('plant_school_limit'))fail(409,'plant_school_limit');
    if(/edu_plant_school_address|edu_plant_school_names/.test(e.message))fail(409,'school_already_registered');
    throw e;
  }
  const found=await db.prepare('SELECT id FROM edu_plant_applications WHERE id=? AND teacher_id=? AND workspace_id=? AND reason=? AND preferred_key IS ?')
    .bind(appId,actor.id,orgId,reason,key).first();
  if(found&&b.requestId)return ok();
  fail(409,'plant_unavailable');
}
async function accept(db,actor,body) {
  const {applicationId,plantKey}=keys(body,['applicationId','plantKey']);
  const key=position(plantKey).key;
  const result=await db.prepare(`UPDATE edu_plant_applications AS a SET status='active',accepted_at=COALESCE(accepted_at,?),changed_by=?
    WHERE id=? AND plant_key=? AND ${ownerAccess} AND status IN ('offered','active')`).bind(nowISO(),actor.id,uuid(applicationId),key,actor.id,actor.id).run();
  if (!result.meta.changes) fail(409,'offer_unavailable');
  return ok();
}
async function question(db,actor,body) {
  const b=keys(body,['applicationId','requestId','question','consent']);
  if (b.consent!==true) fail(400,'consent_required');
  const app=uuid(b.applicationId), req=uuid(b.requestId), note=text(b.question,800);
  const existing=await db.prepare(`SELECT q.question FROM edu_plant_questions q JOIN edu_plant_applications a ON a.id=q.application_id
    WHERE q.id=? AND a.id=? AND ${memberAccess} AND a.status IN('active','cooling')`).bind(req,app,actor.id).first();
  if (existing) { if (existing.question!==note) fail(409,'request_conflict'); return ok(); }
  if (!await rate(db,'plant-question:'+actor.id,12,3600000)) fail(429,'question_limit');
  const result=await db.prepare(`INSERT INTO edu_plant_questions(id,application_id,question,created_at,submitted_by)
    SELECT ?,a.id,?,?,? FROM edu_plant_applications a WHERE a.id=? AND ${memberAccess} AND a.status IN('active','cooling')`)
    .bind(req,note,nowISO(),actor.id,app,actor.id).run();
  if (!result.meta.changes) fail(403,'plant_access_required');
  return ok();
}
export async function teacherPlantRoutes(request,env,path,actor,body) {
  if(path==='/api/plants/recognition'||path.startsWith('/api/plants/recognition/'))return recognitionRoute(request,env,path,actor);
  const db=env.EDU_DB;
  if(path==='/api/plants/threads'||path.startsWith('/api/plants/threads/'))return plantThreadRoute(request,db,path.slice('/api/plants'.length),{userId:actor.id},body);
  if (request.method==='GET') {
    const url=new URL(request.url);
    if(path==='/api/plants/field-report')return teacherFieldReport(db,actor,url.searchParams.get('applicationId'));
    if(path==='/api/plants/learning')return json(plantLearning);
    if(path==='/api/plants/me')return myPlant(db,actor,url);
    if(path.startsWith('/api/plants/organisation/logo/'))return loadLogo(db,path.split('/').at(-1),actor.id);
    if(path==='/api/plants/classroom') {
      await releaseDueAdoptions(db);
      const appId=url.searchParams.get('applicationId');
      const application=await db.prepare(`SELECT a.id,a.plant_key AS plantKey,a.school_type AS schoolType,a.status,(SELECT stage FROM edu_atlas_positions WHERE plant_key=a.plant_key) AS stage FROM edu_plant_applications a
        WHERE ${memberAccess} AND a.status IN('active','cooling') AND (? IS NULL OR a.id=?) ORDER BY a.created_at DESC,a.id DESC LIMIT 1`)
        .bind(actor.id,appId,appId).first();
      const updates=application ? await journal(db,application.plantKey,'/api/plants/photos/',actor.id) : [];
      return json({application,updates});
    }
    if (path.startsWith('/api/plants/photos/')) return photo(db,path.slice('/api/plants/photos/'.length),actor.id);
  } else if (request.method==='POST') {
    if (path==='/api/plants/apply') return apply(db,actor,body);
    if (path==='/api/plants/accept') return accept(db,actor,body);
    if (path==='/api/plants/question') {await releaseDueAdoptions(db);return question(db,actor,body);}
    if(path==='/api/plants/organisation/logo'){
      const b=keys(body,['orgId','logo']);
      if(!Object.hasOwn(b,'logo'))fail(400,'invalid_field');
      const image=cleanPhoto(b.logo);
      if(image&&(image.width>512||image.height>512))fail(400,'invalid_image');
      return saveOrgLogo(db,actor,b,image);
    }
    const managed=await orgRoutes(db,path,actor,body);if(managed)return managed;
  }
  fail(404,'not_found');
}

async function dashboard(db,farmer) {
  const atlas=await inventory(db,true);
  if (farmer) return json({role:'farmer',...atlas,applications:[],questions:[]});
  const records=await all(db.prepare(`SELECT ${applicationFields},u.email,o.name AS orgName,o.address,o.public_name AS publicName,
    (o.logo_bytes IS NOT NULL) AS hasLogo,(SELECT COUNT(*) FROM edu_plant_applications p WHERE p.workspace_id=a.workspace_id AND p.status IN(${openStates})) AS schoolSlotCount,
    (SELECT COUNT(*) FROM edu_plant_applications p WHERE p.workspace_id=a.workspace_id AND p.status IN('active','cooling')) AS activeTreeCount
    FROM edu_plant_applications a JOIN edu_plant_organisations o ON o.id=a.workspace_id JOIN edu_users u ON u.id=o.master_id ORDER BY a.created_at DESC`));
  const applications=records.map(({orgName,address,publicName,hasLogo,...a})=>({...a,organisation:{id:a.orgId,name:orgName,address,publicName:!!publicName,
    logoUrl:hasLogo?'/api/education/plants/organisation-logo/'+a.orgId:null}}));
  const events=await all(db.prepare('SELECT org_id AS orgId,application_id AS applicationId,plant_key AS plantKey,action,actor_id AS actorId,related_user_id AS relatedUserId,reason,created_at AS createdAt FROM edu_plant_events ORDER BY id DESC LIMIT 250'));
  const questions=await all(db.prepare(`SELECT id,application_id AS applicationId,question,answer,created_at AS createdAt
    FROM edu_plant_questions ORDER BY (answer IS NULL) DESC,created_at DESC`));
  return json({role:'owner',...atlas,applications,questions,events});
}
async function verify(db,body) {
  const b=keys(body,['key','tag']),p=position(b.key),tag=text(b.tag,60);
  try {
    await db.prepare(`INSERT INTO edu_plants(plant_key,row_num,position,tag,verified_at)
      SELECT ?,?,?,?,? WHERE ? IN (${visiblePositions}) ON CONFLICT(plant_key) DO NOTHING`)
      .bind(p.key,p.row,p.position,tag,nowISO(),p.key).run();
  } catch (error) {
    if (/UNIQUE constraint failed: edu_plants.tag/.test(error.message)) fail(409,'tag_in_use');
    throw error;
  }
  const saved=await db.prepare('SELECT tag FROM edu_plants WHERE plant_key=?').bind(p.key).first();
  if (!saved) fail(409,'position_hidden');
  if (saved.tag.toLowerCase()!==tag.toLowerCase()) fail(409,'plant_already_verified');
  return ok();
}
function boundedInt(value,min,max) {
  if (!Number.isInteger(value) || value<min || value>max) fail(400,'invalid_field');
  return value;
}

async function saveRow(db,body) {
  const b=keys(body,['row','enabledCount','revision']);
  const row=boundedInt(b.row,1,12),count=boundedInt(b.enabledCount,0,rowCapacity),version=revision(b.revision);
  const result=await db.prepare(`UPDATE edu_atlas_rows SET enabled_count=?,revision=revision+1
    WHERE row_num=? AND revision=? AND enabled_count<>? AND NOT EXISTS (
      SELECT 1 FROM edu_atlas_positions v JOIN edu_plant_applications a ON a.plant_key=v.plant_key
      WHERE v.row_num=? AND v.position>? AND a.status IN ('offered','active','cooling'))`).bind(count,row,version,count,row,count).run();
  if (result.meta.changes) return ok();
  const current=await db.prepare('SELECT enabled_count,revision FROM edu_atlas_rows WHERE row_num=?').bind(row).first();
  if (current?.enabled_count===count && (current.revision===version || current.revision===version+1)) return ok();
  if (current?.revision!==version) fail(409,'atlas_changed');
  fail(409,'row_in_use');
}

async function saveStage(db,body) {
  const b=keys(body,['key','stage','revision']),p=position(b.key);
  const stage=boundedInt(b.stage,1,10),version=revision(b.revision);
  const result=await db.prepare(`UPDATE edu_atlas_positions SET stage=?,revision=revision+1
    WHERE plant_key=? AND revision=? AND stage<>? AND plant_key IN (${visiblePositions}) AND
    (?<>1 OR NOT EXISTS (SELECT 1 FROM edu_plant_applications WHERE plant_key=? AND status IN ('offered','active','cooling')))`)
    .bind(stage,p.key,version,stage,stage,p.key).run();
  if (result.meta.changes) return ok();
  const current=await db.prepare(`SELECT stage,revision FROM edu_atlas_positions
    WHERE plant_key=? AND plant_key IN (${visiblePositions})`).bind(p.key).first();
  if (!current) fail(409,'position_hidden');
  if (current.stage===stage && (current.revision===version || current.revision===version+1)) return ok();
  if (current.revision!==version) fail(409,'atlas_changed');
  fail(409,'plant_in_use');
}

async function availability(db,body) {
  const b=keys(body,['key','available']),p=position(b.key);
  if (typeof b.available!=='boolean') fail(400,'invalid_field');
  const result=await db.prepare(`UPDATE edu_plants SET available=? WHERE plant_key=? AND NOT EXISTS (
    SELECT 1 FROM edu_plant_applications a WHERE a.plant_key=edu_plants.plant_key AND status IN ('offered','active','cooling'))`)
    .bind(Number(b.available),p.key).run();
  if (!result.meta.changes) fail(409,'plant_unavailable');
  return ok();
}
async function review(db,body,staffId) {
  const b=keys(body,['applicationId','decision','plantKey']),app=uuid(b.applicationId),at=nowISO();
  if (!['offer','decline','withdraw'].includes(b.decision)) fail(400,'invalid_field');
  if (b.decision==='withdraw') {
    const result=await db.prepare(`UPDATE edu_plant_applications SET status='pending',plant_key=NULL,decided_at=NULL,changed_by=?
      WHERE id=? AND status='offered'`).bind(staffId,app).run();
    if (!result.meta.changes) fail(409,'application_changed');
    return ok();
  }
  if (b.decision==='decline') {
    const result=await db.prepare(`UPDATE edu_plant_applications SET status='declined',decided_at=?,changed_by=?
      WHERE id=? AND status='pending'`).bind(at,staffId,app).run();
    if (!result.meta.changes) fail(409,'application_changed');
    return ok();
  }
  const p=position(b.plantKey);
  const result=await db.prepare(`UPDATE edu_plant_applications SET status='offered',plant_key=?,decided_at=?,changed_by=?
    WHERE id=? AND status='pending' AND ? IN (${plantedPositions})
    AND EXISTS (SELECT 1 FROM edu_plants WHERE plant_key=? AND available=1)
    AND NOT EXISTS (SELECT 1 FROM edu_plant_applications WHERE plant_key=? AND status IN ('offered','active','cooling'))`)
    .bind(p.key,at,staffId,app,p.key,p.key,p.key).run();
  if (!result.meta.changes) fail(409,'plant_unavailable');
  return ok();
}
function cleanPhoto(value) {
  if (value==null) return null;
  const {mime,base64}=keys(value,['mime','base64']);
  if (typeof base64!=='string'||!base64.length) fail(400,'invalid_image');
  if (base64.length>Math.ceil(IMAGE_MAX_BYTES/3)*4) fail(413,'image_too_large');
  if (!/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(base64)) fail(400,'invalid_image');
  try {
    return normaliseProgrammeImage(Uint8Array.from(atob(base64),c=>c.charCodeAt(0)),mime);
  } catch (error) {
    if (error instanceof ProgrammeMediaError) fail(error.status,error.code);
    throw error;
  }
}
async function publishUpdate(env,body,staffId) {
  const db=env.EDU_DB;
  const b=keys(body,['key','observedOn','note','requestId','photo','expectedPlantingId']),p=position(b.key),req=uuid(b.requestId);
  const observed=dateValue(b.observedOn),at=nowISO();
  if (observed>currentSydneyDate(new Date(at))) fail(400,'future_observation');
  const note=text(b.note??'',1200,{empty:true}),picture=cleanPhoto(b.photo);
  if (!note && !picture) fail(400,'invalid_field');
  const fingerprint=await digest(JSON.stringify([p.key,observed,note,b.photo?.mime??null,b.photo?.base64??null]));
  const existing=()=>db.prepare('SELECT request_hash,withdrawn FROM edu_plant_updates WHERE id=?').bind(req).first();
  function confirmRetry(old) {
    if (!old) fail(404,'plant_not_verified');
    if (old.withdrawn) fail(409,'update_withdrawn');
    if (old.request_hash!==fingerprint) fail(409,'request_conflict');
  }
  const previous=await existing();
  if (previous) { confirmRetry(previous); return ok(); }
  if (!await db.prepare('SELECT 1 FROM edu_plants WHERE plant_key=?').bind(p.key).first()) fail(404,'plant_not_verified');
  const current=await db.prepare('SELECT id FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NULL').bind(p.key).first();
  if(b.expectedPlantingId!==undefined && (current?.id||null)!==(b.expectedPlantingId||null))fail(409,'planting_changed');
  if(b.expectedPlantingId===undefined && await db.prepare('SELECT 1 FROM edu_coffee_plantings WHERE plant_key=? AND ended_at IS NOT NULL').bind(p.key).first())fail(409,'planting_changed');
  const log=await snapshotForUpdate(env,p,observed,at);
  const [result]=await db.batch([
    db.prepare(`INSERT INTO edu_plant_updates(id,plant_key,observed_on,note,created_at,photo_mime,photo_bytes,request_hash,posted_by,planting_id)
      SELECT ?,plant_key,?,?,?,?,?,?,?,(SELECT id FROM edu_coffee_plantings cp WHERE cp.plant_key=edu_plants.plant_key AND cp.ended_at IS NULL) FROM edu_plants WHERE plant_key=? AND COALESCE((SELECT id FROM edu_coffee_plantings WHERE plant_key=edu_plants.plant_key AND ended_at IS NULL),'')=? ON CONFLICT(id) DO NOTHING`)
      .bind(req,observed,note,at,picture?.mime??null,picture?.bytes.buffer??null,fingerprint,staffId,p.key,current?.id||''),
    db.prepare(`INSERT OR IGNORE INTO edu_plant_weather_logs(update_id,payload)
      SELECT id,? FROM edu_plant_updates WHERE id=? AND request_hash=? AND created_at=?`).bind(log,req,fingerprint,at)
  ]);
  if (!result.meta.changes) {
    const saved=await existing();if(saved)confirmRetry(saved);else fail(409,'planting_changed');
  }
  return ok();
}
async function withdraw(db,body,staffId) {
  const {updateId}=keys(body,['updateId']);
  const result=await db.prepare("UPDATE edu_plant_updates SET withdrawn=1,withdrawn_by=COALESCE(withdrawn_by,?),withdrawn_at=COALESCE(withdrawn_at,?) WHERE id=?").bind(staffId,nowISO(),uuid(updateId)).run();
  if (!result.meta.changes) fail(404,'update_not_found');
  return ok();
}
async function answer(db,body,staffId) {
  const {questionId,answer:raw}=keys(body,['questionId','answer']),answer=text(raw,800);
  const result=await db.prepare('UPDATE edu_plant_questions SET answer=?,answered_at=COALESCE(answered_at,?),answered_by=COALESCE(answered_by,?) WHERE id=? AND (answer IS NULL OR answer=?)')
    .bind(answer,nowISO(),staffId,uuid(questionId),answer).run();
  if (!result.meta.changes) {
    const exists=await db.prepare('SELECT id FROM edu_plant_questions WHERE id=?').bind(questionId).first();
    fail(exists?409:404,exists?'answer_changed':'question_not_found');
  }
  return ok();
}

// Only the Access-verified admin service creates the role header on its signed binding request.
export async function staffPlantRoutes(request,env,path,body) {
  if(path==='/plants/recognition'||path.startsWith('/plants/recognition/'))return recognitionRoute(request,env,path);
  if(path==='/plants/varieties'||path.startsWith('/plants/varieties/'))return varietyRoutes(request,env.EDU_DB,path,body);
  if(path==='/plants/field-report'||path==='/plants/fertiliser')return staffFieldReport(request,env.EDU_DB,path,body);
  const db=env.EDU_DB,farmer=request.headers.get('X-Glenolia-Plant-Role')==='farmer';
  if(path==='/plants/threads'||path.startsWith('/plants/threads/'))return plantThreadRoute(request,db,path.slice('/plants'.length),{staffId:request.headers.get('X-Glenolia-Staff-Email')||'farm_staff'},body);
  if (request.method==='GET') {
    if(path.startsWith('/plants/organisation-logo/')){
      if(farmer)fail(403,'owner_required');
      return loadLogo(db,path.split('/').at(-1));
    }
    if (path==='/plants/dashboard') return dashboard(db,farmer);
    if (path==='/plants/journal') return json({updates:await journal(db,position(new URL(request.url).searchParams.get('key')).key,'/api/education/plants/photos/')});
    if (path.startsWith('/plants/photos/')) return photo(db,path.slice('/plants/photos/'.length));
  } else if (request.method==='POST') {
    if (path==='/plants/row') return saveRow(db,body);
    if (path==='/plants/stage') return saveStage(db,body);
    if (path==='/plants/stage-photo') return saveStagePhoto(db,body,request.headers.get('X-Glenolia-Staff-Email')||'farm_staff');
    if (path==='/plants/verify') return verify(db,body);
    if (path==='/plants/availability') return availability(db,body);
    if (path==='/plants/update') return publishUpdate(env,body,request.headers.get('X-Glenolia-Staff-Email')||'farm_staff');
    if (path==='/plants/withdraw-update') return withdraw(db,body,request.headers.get('X-Glenolia-Staff-Email')||'farm_staff');
    if (farmer) fail(403,'owner_required');
    if (path==='/plants/review') {await releaseDueAdoptions(db);return review(db,body,request.headers.get('X-Glenolia-Staff-Email')||'farm_owner');}
    if (path==='/plants/answer') return answer(db,body,request.headers.get('X-Glenolia-Staff-Email')||'farm_owner');
  }
  fail(404,'not_found');
}
