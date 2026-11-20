import { all, dateValue, digest, fail, id, json, keys, nowISO, rate, SECURITY, text } from './education-common.mjs';
import { currentSydneyDate } from './education-workspace.mjs';
import { IMAGE_MAX_BYTES, normaliseProgrammeImage, ProgrammeMediaError } from './programme-media.mjs';

const fieldPosition = /^r([12])-p([1-9]|1[0-9])$/;
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
  a.preferred_key AS preferredKey,a.plant_key AS plantKey,a.status,a.created_at AS createdAt`;
const ownerAccess = `a.teacher_id=? AND EXISTS (
  SELECT 1 FROM edu_memberships m JOIN edu_schools s ON s.id=m.school_id
  WHERE m.school_id=a.workspace_id AND m.user_id=a.teacher_id AND m.active=1 AND s.status<>'suspended')`;
const activeAccess = `SELECT a.plant_key FROM edu_plant_applications a WHERE ${ownerAccess} AND a.status='active'`;

async function inventory(db, staff=false) {
  const rows = await all(db.prepare(`SELECT p.plant_key,p.tag,p.available,a.status
    FROM edu_plants p LEFT JOIN edu_plant_applications a ON a.plant_key=p.plant_key AND a.status IN ('offered','active')`));
  const records = new Map(rows.map(row => [row.plant_key,row]));
  return Array.from({length:38}, (_,index) => {
    const key = 'r'+(1+Math.floor(index/19))+'-p'+(1+index%19);
    const plant = records.get(key);
    let status = 'unverified';
    if (plant) status = plant.status ? (staff ? plant.status : 'unavailable') : (plant.available ? 'available' : 'unavailable');
    return { ...position(key), status, ...(staff ? {tag:plant?.tag ?? null} : {}) };
  });
}
export async function publicPlantMap(request,env) {
  const origin = request.headers.get('Origin');
  const headers = { Vary:'Origin', ...(origin === 'https://theglenolia.com.au' ? {'Access-Control-Allow-Origin':origin} : {}) };
  return json({plants:await inventory(env.EDU_DB)}, 200, headers);
}
async function journal(db,plantKey,photoPrefix,actorId=null) {
  const scope=actorId ? ' AND plant_key IN ('+activeAccess+')' : '';
  const rows=await all(db.prepare(`SELECT id,observed_on AS observedOn,note,created_at AS createdAt,photo_mime AS mime
    FROM edu_plant_updates WHERE plant_key=? AND withdrawn=0${scope} ORDER BY observed_on DESC,created_at DESC,id DESC`)
    .bind(plantKey,...(actorId ? [actorId] : [])));
  return rows.map(({ mime,...row }) => ({ ...row, photoUrl:mime ? photoPrefix+row.id : null }));
}
async function photo(db,updateId,actorId=null) {
  const scope=actorId ? ' AND plant_key IN ('+activeAccess+')' : '';
  const row=await db.prepare('SELECT photo_mime,photo_bytes FROM edu_plant_updates WHERE id=? AND withdrawn=0 AND photo_mime IS NOT NULL'+scope)
    .bind(uuid(updateId),...(actorId ? [actorId] : [])).first();
  if (!row) fail(404,'photo_not_found');
  const bytes=Array.isArray(row.photo_bytes) ? Uint8Array.from(row.photo_bytes) : row.photo_bytes;
  return new Response(bytes,{headers:{...SECURITY,'Content-Type':row.photo_mime,'Content-Security-Policy':"default-src 'none'; sandbox",'X-Robots-Tag':'noindex, nofollow'}});
}
async function myPlant(db,actor) {
  const application=await db.prepare(`SELECT ${applicationFields} FROM edu_plant_applications a
    WHERE ${ownerAccess} ORDER BY (a.status<>'declined') DESC,a.created_at DESC,a.id DESC LIMIT 1`).bind(actor.id).first();
  if (application?.status!=='active') return json({application,updates:[],questions:[]});
  const updates=await journal(db,application.plantKey,'/api/plants/photos/',actor.id);
  const questions=await all(db.prepare(`SELECT q.id,q.question,q.answer,q.created_at AS createdAt FROM edu_plant_questions q
    JOIN edu_plant_applications a ON a.id=q.application_id WHERE a.id=? AND ${ownerAccess} AND a.status='active' ORDER BY q.created_at DESC`).bind(application.id,actor.id));
  return json({application,updates,questions});
}
const ok=()=>json({ok:true});
async function apply(db,actor,body) {
  const b=keys(body,['schoolName','suburb','schoolType','preferredKey','consent']);
  if (b.consent!==true) fail(400,'consent_required');
  const school=text(b.schoolName,160), suburb=text(b.suburb,100);
  if (!['primary','high','combined','other'].includes(b.schoolType)) fail(400,'invalid_field');
  const key=b.preferredKey==null ? null : position(b.preferredKey).key;
  // Availability and one-current-application are evaluated on the same write.
  const result=await db.prepare(`INSERT INTO edu_plant_applications(id,teacher_id,workspace_id,school_name,suburb,school_type,preferred_key,created_at)
    SELECT ?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM edu_plants WHERE plant_key=? AND available=0)
    AND NOT EXISTS (SELECT 1 FROM edu_plant_applications WHERE plant_key=? AND status IN ('offered','active'))
    ON CONFLICT(teacher_id) WHERE status <> 'declined' DO NOTHING`)
    .bind(id(),actor.id,actor.schoolId,school,suburb,b.schoolType,key,nowISO(),key,key).run();
  if (result.meta.changes) return ok();
  const exists=await db.prepare("SELECT id FROM edu_plant_applications WHERE teacher_id=? AND status<>'declined'").bind(actor.id).first();
  fail(409,exists ? 'school_application_exists' : 'plant_unavailable');
}
async function accept(db,actor,body) {
  const {applicationId,plantKey}=keys(body,['applicationId','plantKey']);
  const key=position(plantKey).key;
  const result=await db.prepare(`UPDATE edu_plant_applications AS a SET status='active',accepted_at=COALESCE(accepted_at,?)
    WHERE id=? AND plant_key=? AND ${ownerAccess} AND status IN ('offered','active')`).bind(nowISO(),uuid(applicationId),key,actor.id).run();
  if (!result.meta.changes) fail(409,'offer_unavailable');
  return ok();
}
async function question(db,actor,body) {
  const b=keys(body,['applicationId','requestId','question','consent']);
  if (b.consent!==true) fail(400,'consent_required');
  const app=uuid(b.applicationId), req=uuid(b.requestId), note=text(b.question,800);
  const existing=await db.prepare(`SELECT q.question FROM edu_plant_questions q JOIN edu_plant_applications a ON a.id=q.application_id
    WHERE q.id=? AND a.id=? AND ${ownerAccess} AND a.status='active'`).bind(req,app,actor.id).first();
  if (existing) { if (existing.question!==note) fail(409,'request_conflict'); return ok(); }
  if (!await rate(db,'plant-question:'+actor.id,12,3600000)) fail(429,'question_limit');
  const result=await db.prepare(`INSERT INTO edu_plant_questions(id,application_id,question,created_at)
    SELECT ?,a.id,?,? FROM edu_plant_applications a WHERE a.id=? AND ${ownerAccess} AND a.status='active'`)
    .bind(req,note,nowISO(),app,actor.id).run();
  if (!result.meta.changes) fail(403,'plant_access_required');
  return ok();
}
export async function teacherPlantRoutes(request,env,path,actor,body) {
  const db=env.EDU_DB;
  if (request.method==='GET') {
    if (path==='/api/plants/me') return myPlant(db,actor);
    if (path==='/api/plants/classroom') {
      const application=await db.prepare(`SELECT a.plant_key AS plantKey,a.school_type AS schoolType,a.status
        FROM edu_plant_applications a WHERE ${ownerAccess} AND a.status='active'`).bind(actor.id).first();
      const updates=application ? await journal(db,application.plantKey,'/api/plants/photos/',actor.id) : [];
      return json({application,updates});
    }
    if (path.startsWith('/api/plants/photos/')) return photo(db,path.slice('/api/plants/photos/'.length),actor.id);
  } else if (request.method==='POST') {
    if (path==='/api/plants/apply') return apply(db,actor,body);
    if (path==='/api/plants/accept') return accept(db,actor,body);
    if (path==='/api/plants/question') return question(db,actor,body);
  }
  fail(404,'not_found');
}

async function dashboard(db,farmer) {
  const plants=await inventory(db,true);
  if (farmer) return json({role:'farmer',plants,applications:[],questions:[]});
  const applications=await all(db.prepare(`SELECT ${applicationFields},u.email FROM edu_plant_applications a
    JOIN edu_users u ON u.id=a.teacher_id ORDER BY a.created_at DESC`));
  const questions=await all(db.prepare(`SELECT id,application_id AS applicationId,question,answer,created_at AS createdAt
    FROM edu_plant_questions ORDER BY (answer IS NULL) DESC,created_at DESC`));
  return json({role:'owner',plants,applications,questions});
}
async function verify(db,body) {
  const b=keys(body,['key','tag']),p=position(b.key),tag=text(b.tag,60);
  try {
    await db.prepare('INSERT INTO edu_plants(plant_key,row_num,position,tag,verified_at) VALUES(?,?,?,?,?) ON CONFLICT(plant_key) DO NOTHING')
      .bind(p.key,p.row,p.position,tag,nowISO()).run();
  } catch (error) {
    if (/UNIQUE constraint failed: edu_plants.tag/.test(error.message)) fail(409,'tag_in_use');
    throw error;
  }
  const saved=await db.prepare('SELECT tag FROM edu_plants WHERE plant_key=?').bind(p.key).first();
  if (!saved || saved.tag.toLowerCase()!==tag.toLowerCase()) fail(409,'plant_already_verified');
  return ok();
}
async function availability(db,body) {
  const b=keys(body,['key','available']),p=position(b.key);
  if (typeof b.available!=='boolean') fail(400,'invalid_field');
  const result=await db.prepare(`UPDATE edu_plants SET available=? WHERE plant_key=? AND NOT EXISTS (
    SELECT 1 FROM edu_plant_applications a WHERE a.plant_key=edu_plants.plant_key AND status IN ('offered','active'))`)
    .bind(Number(b.available),p.key).run();
  if (!result.meta.changes) fail(409,'plant_unavailable');
  return ok();
}
async function review(db,body) {
  const b=keys(body,['applicationId','decision','plantKey']),app=uuid(b.applicationId),at=nowISO();
  if (!['offer','decline','withdraw'].includes(b.decision)) fail(400,'invalid_field');
  if (b.decision==='withdraw') {
    const result=await db.prepare(`UPDATE edu_plant_applications SET status='pending',plant_key=NULL,decided_at=NULL
      WHERE id=? AND status='offered'`).bind(app).run();
    if (!result.meta.changes) fail(409,'application_changed');
    return ok();
  }
  if (b.decision==='decline') {
    const result=await db.prepare(`UPDATE edu_plant_applications SET status='declined',decided_at=?
      WHERE id=? AND status='pending'`).bind(at,app).run();
    if (!result.meta.changes) fail(409,'application_changed');
    return ok();
  }
  const p=position(b.plantKey);
  const result=await db.prepare(`UPDATE edu_plant_applications SET status='offered',plant_key=?,decided_at=?
    WHERE id=? AND status='pending' AND EXISTS (SELECT 1 FROM edu_plants WHERE plant_key=? AND available=1)
    AND NOT EXISTS (SELECT 1 FROM edu_plant_applications WHERE plant_key=? AND status IN ('offered','active'))`)
    .bind(p.key,at,app,p.key,p.key).run();
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
async function publishUpdate(db,body) {
  const b=keys(body,['key','observedOn','note','requestId','photo']),p=position(b.key),req=uuid(b.requestId);
  const observed=dateValue(b.observedOn),at=nowISO();
  if (observed>currentSydneyDate(new Date(at))) fail(400,'future_observation');
  const note=text(b.note??'',1200,{empty:true}),picture=cleanPhoto(b.photo);
  if (!note && !picture) fail(400,'invalid_field');
  const fingerprint=await digest(JSON.stringify([p.key,observed,note,b.photo?.mime??null,b.photo?.base64??null]));
  const result=await db.prepare(`INSERT INTO edu_plant_updates(id,plant_key,observed_on,note,created_at,photo_mime,photo_bytes,request_hash)
    SELECT ?,plant_key,?,?,?,?,?,? FROM edu_plants WHERE plant_key=? ON CONFLICT(id) DO NOTHING`)
    .bind(req,observed,note,at,picture?.mime??null,picture?.bytes.buffer??null,fingerprint,p.key).run();
  if (!result.meta.changes) {
    const old=await db.prepare('SELECT request_hash,withdrawn FROM edu_plant_updates WHERE id=?').bind(req).first();
    if (!old) fail(404,'plant_not_verified');
    if (old.withdrawn) fail(409,'update_withdrawn');
    if (old.request_hash!==fingerprint) fail(409,'request_conflict');
  }
  return ok();
}
async function withdraw(db,body) {
  const {updateId}=keys(body,['updateId']);
  const result=await db.prepare("UPDATE edu_plant_updates SET withdrawn=1,note='',photo_mime=NULL,photo_bytes=NULL WHERE id=?").bind(uuid(updateId)).run();
  if (!result.meta.changes) fail(404,'update_not_found');
  return ok();
}
async function answer(db,body) {
  const {questionId,answer:raw}=keys(body,['questionId','answer']),answer=text(raw,800);
  const result=await db.prepare('UPDATE edu_plant_questions SET answer=?,answered_at=COALESCE(answered_at,?) WHERE id=? AND (answer IS NULL OR answer=?)')
    .bind(answer,nowISO(),uuid(questionId),answer).run();
  if (!result.meta.changes) {
    const exists=await db.prepare('SELECT id FROM edu_plant_questions WHERE id=?').bind(questionId).first();
    fail(exists?409:404,exists?'answer_changed':'question_not_found');
  }
  return ok();
}

// Only the Access-verified admin service creates the role header on its signed binding request.
export async function staffPlantRoutes(request,env,path,body) {
  const db=env.EDU_DB,farmer=request.headers.get('X-Glenolia-Plant-Role')==='farmer';
  if (request.method==='GET') {
    if (path==='/plants/dashboard') return dashboard(db,farmer);
    if (path==='/plants/journal') return json({updates:await journal(db,position(new URL(request.url).searchParams.get('key')).key,'/api/education/plants/photos/')});
    if (path.startsWith('/plants/photos/')) return photo(db,path.slice('/plants/photos/'.length));
  } else if (request.method==='POST') {
    if (path==='/plants/verify') return verify(db,body);
    if (path==='/plants/availability') return availability(db,body);
    if (path==='/plants/update') return publishUpdate(db,body);
    if (path==='/plants/withdraw-update') return withdraw(db,body);
    if (farmer) fail(403,'owner_required');
    if (path==='/plants/review') return review(db,body);
    if (path==='/plants/answer') return answer(db,body);
  }
  fail(404,'not_found');
}
