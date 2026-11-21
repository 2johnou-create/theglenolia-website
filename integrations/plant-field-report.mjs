import {all, dateValue, fail, json, keys, nowISO, text, uuid} from './education-common.mjs';
import {orgMember} from './plant-organisation.mjs';
import {currentSydneyDate} from './education-workspace.mjs';

const fieldNames = ['variety','soil','soilPh','growerFocus','plantedOn','condition','stature','leafTip','beanSize','yieldPotential','firstFruit','ripening','rust','nutrition','varietySource'];
const profileColumns = 'scope_key AS key, revision, snapshot, recorded_at AS recordedAt';
const eventColumns = "id, observed_on AS observedOn, description, CASE WHEN scope_key='farm' THEN 'farm' ELSE 'plant' END AS scope";
const eventOrder = "observed_on DESC, CASE WHEN scope_key='farm' THEN 1 ELSE 0 END, created_at DESC, id DESC";
const positionKey = /^r(?:[1-9]|1[0-2])-p(?:[1-9]|1[0-9])$/;

function profileRecord(key,snapshot,recordedAt) {
  const {fieldDates={},...values}=JSON.parse(snapshot);
  return {key,values,fieldDates,recordedAt};
}
function resolvedFields(profiles) {
  const result = {};
  const tree=profiles.find(p=>p.key!=='farm'), farm=profiles.find(p=>p.key==='farm');
  const varietiesDiffer=tree?.values.variety && (!farm?.values.variety ||
    tree.values.variety.trim().toLocaleLowerCase()!==farm.values.variety.trim().toLocaleLowerCase());
  for (const field of fieldNames) {
    const allowFarm=!(fieldNames.slice(6).includes(field) && varietiesDiffer);
    const profile = profiles.find(p=>p.key!=='farm' && p.values[field] != null) ||
                    profiles.find(p=>allowFarm && p.key==='farm' && p.values[field] != null);
    result[field] = profile ? {value:profile.values[field],scope:profile.key==='farm'?'farm':'plant',recordedAt:profile.fieldDates[field] || profile.recordedAt} : null;
  }
  return result;
}
const currentProfiles = `SELECT ${profileColumns} FROM edu_plant_field_profiles p
 WHERE revision=(SELECT MAX(r.revision) FROM edu_plant_field_profiles r WHERE r.scope_key=p.scope_key)`;

export async function teacherFieldReport(db,actor,applicationId) {
  // One read snapshot ties the permanent tree and all school-visible records to this live grant.
  const row=await db.prepare(`SELECT v.plant_key AS key,v.row_num AS row,v.position,v.stage,
    fp.snapshot AS farmValues,fp.recorded_at AS farmAt,tp.snapshot AS treeValues,tp.recorded_at AS treeAt,
    (SELECT json_object('id',u.id,'observedOn',u.observed_on,'note',u.note) FROM edu_plant_updates u
      WHERE u.plant_key=v.plant_key AND u.withdrawn=0 ORDER BY u.observed_on DESC,u.created_at DESC,u.id DESC LIMIT 1) AS lastNote,
    (SELECT json_object('id',u.id,'observedOn',u.observed_on) FROM edu_plant_updates u
      WHERE u.plant_key=v.plant_key AND u.withdrawn=0 AND u.photo_mime IS NOT NULL ORDER BY u.observed_on DESC,u.created_at DESC,u.id DESC LIMIT 1) AS lastPhoto,
    (SELECT json_group_array(json_object('id',id,'observedOn',observedOn,'description',description,'scope',scope))
      FROM (SELECT ${eventColumns} FROM edu_plant_fertiliser WHERE withdrawn_at IS NULL AND scope_key IN ('farm',v.plant_key)
        ORDER BY ${eventOrder} LIMIT 25)) AS feedHistory
    FROM edu_plant_applications a JOIN edu_atlas_positions v ON v.plant_key=a.plant_key
    LEFT JOIN edu_plant_field_profiles fp ON fp.scope_key='farm'
      AND fp.revision=(SELECT MAX(r.revision) FROM edu_plant_field_profiles r WHERE r.scope_key='farm')
    LEFT JOIN edu_plant_field_profiles tp ON tp.scope_key=v.plant_key
      AND tp.revision=(SELECT MAX(r.revision) FROM edu_plant_field_profiles r WHERE r.scope_key=v.plant_key)
    WHERE a.id=? AND a.workspace_id IN (${orgMember}) AND
    (a.status='active' OR (a.status='cooling' AND a.release_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')))`).bind(uuid(applicationId),actor.id).first();
  if (!row) fail(404,'application_not_found');
  const {key,position,stage}=row;
  const plant={key,label:'P'+((row.row-1)*19+position),row:row.row,position,stage};
  const profiles=[];
  if(row.treeValues)profiles.push(profileRecord(key,row.treeValues,row.treeAt));
  if(row.farmValues)profiles.push(profileRecord('farm',row.farmValues,row.farmAt));
  const fertiliserHistory=JSON.parse(row.feedHistory);
  const latestPhoto=JSON.parse(row.lastPhoto);
  if(latestPhoto)latestPhoto.photoUrl='/api/plants/photos/'+latestPhoto.id;
  return json({plant,fields:resolvedFields(profiles),lastFertiliser:fertiliserHistory[0]||null,
    fertiliserHistory,latestObservation:JSON.parse(row.lastNote),latestPhoto});
}

async function scopeKey(db,key) {
  if (key==='farm') return key;
  if (typeof key!=='string' || !positionKey.test(key)) fail(400,'invalid_plant');
  if (!await db.prepare('SELECT 1 FROM edu_plants WHERE plant_key=?').bind(key).first()) fail(404,'plant_not_verified');
  return key;
}
async function staffReport(db,key) {
  await scopeKey(db,key);
  const [rows,events] = await Promise.all([
    all(db.prepare(currentProfiles+" AND scope_key IN ('farm',?)").bind(key)),
    all(db.prepare(`SELECT ${eventColumns} FROM edu_plant_fertiliser WHERE scope_key=? AND withdrawn_at IS NULL ORDER BY ${eventOrder} LIMIT 25`).bind(key))
  ]);
  const profiles=rows.map(row=>({...profileRecord(row.key,row.snapshot,row.recordedAt),revision:row.revision}));
  const profile=profiles.find(p=>p.key===key);
  return json({key,revision:profile?.revision || 0,values:profile?.values || {},
    inherited:key==='farm'?{}:profiles.find(p=>p.key==='farm')?.values || {},fertiliserHistory:events});
}
function nonFuture(value) {
  const date=dateValue(value);
  if (date>currentSydneyDate(new Date())) fail(400,'future_observation');
  return date;
}
function sanitiseFields(raw) {
  keys(raw,fieldNames);
  const clean={};
  for (const key of fieldNames) {
    const value=raw[key];
    if (value==null || value==='') {clean[key]=null; continue;}
    if (key==='soilPh') {
      if (typeof value!=='number' || !Number.isFinite(value) || value<0 || value>14) fail(400,'invalid_soil_ph');
      clean[key]=value;
    } else if (key==='plantedOn') clean[key]=nonFuture(value);
    else clean[key]=text(value,key==='variety'?120:500);
  }
  return clean;
}
async function saveProfile(db,body,staff) {
  const {key,revision,values}=keys(body,['key','revision','values']);
  await scopeKey(db,key);
  if (!Number.isSafeInteger(revision) || revision<0) fail(400,'invalid_revision');
  const at=nowISO();
  const row=await db.prepare('SELECT revision,snapshot,recorded_at AS recordedAt FROM edu_plant_field_profiles WHERE scope_key=? ORDER BY revision DESC LIMIT 1').bind(key).first();
  const previous=row && profileRecord(key,row.snapshot,row.recordedAt);
  const priorTraits=Object.fromEntries(fieldNames.slice(6).map(name=>[name,previous?.values[name] ?? null]));
  const clean=sanitiseFields({...priorTraits,...values});
  const same=profile=>fieldNames.every(field=>(profile.values[field]??null)===clean[field]);
  if(previous && same(previous) && (row.revision===revision || row.revision===revision+1))return json({ok:true,revision:row.revision});
  const fieldDates={};
  for(const field of fieldNames) {
    if(clean[field]!=null)fieldDates[field]=previous && previous.values[field]===clean[field]
      ? previous.fieldDates[field] || previous.recordedAt : at;
  }
  const snapshot=JSON.stringify({...clean,fieldDates});
  const saved=await db.prepare(`INSERT INTO edu_plant_field_profiles(scope_key,plant_key,revision,snapshot,recorded_at,recorded_by)
    SELECT ?,?,?,?, ?,? WHERE COALESCE((SELECT MAX(revision) FROM edu_plant_field_profiles WHERE scope_key=?),0)=?
    ON CONFLICT(scope_key,revision) DO NOTHING`).bind(key,key==='farm'?null:key,revision+1,snapshot,at,staff,key,revision).run();
  if (!saved.meta.changes) {
    const latest=await db.prepare('SELECT revision,snapshot FROM edu_plant_field_profiles WHERE scope_key=? ORDER BY revision DESC LIMIT 1').bind(key).first();
    if (latest?.revision!==revision+1 || !same(profileRecord(key,latest.snapshot,null))) fail(409,'field_report_changed');
  }
  return json({ok:true,revision:revision+1});
}
async function fertiliser(db,body,staff) {
  if (body?.action==='withdraw') {
    const {id,key,reason}=keys(body,['action','id','key','reason']);
    await scopeKey(db,key);
    const why=text(reason,300);
    const changed=await db.prepare('UPDATE edu_plant_fertiliser SET withdrawn_at=?,withdrawn_by=?,withdrawal_reason=? WHERE id=? AND scope_key=? AND withdrawn_at IS NULL').bind(nowISO(),staff,why,uuid(id),key).run();
    if (!changed.meta.changes && !await db.prepare('SELECT 1 FROM edu_plant_fertiliser WHERE id=? AND scope_key=? AND withdrawal_reason=?').bind(id,key,why).first()) fail(409,'fertiliser_changed');
    return json({ok:true});
  }
  const {id,key,observedOn,description}=keys(body,['id','key','observedOn','description']);
  await scopeKey(db,key);
  const note=text(description,500),date=nonFuture(observedOn);
  const saved=await db.prepare(`INSERT INTO edu_plant_fertiliser(id,scope_key,plant_key,observed_on,description,created_at,created_by)
    VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`).bind(uuid(id),key,key==='farm'?null:key,date,note,nowISO(),staff).run();
  if (!saved.meta.changes && !await db.prepare('SELECT 1 FROM edu_plant_fertiliser WHERE id=? AND scope_key=? AND observed_on=? AND description=? AND withdrawn_at IS NULL').bind(id,key,date,note).first()) fail(409,'request_conflict');
  return json({ok:true});
}
export async function staffFieldReport(request,db,path,body) {
  const staff=request.headers.get('X-Glenolia-Staff-Email')||'farm_staff';
  if (path==='/plants/field-report') {
    if(request.method==='GET')return staffReport(db,new URL(request.url).searchParams.get('key'));
    return saveProfile(db,body,staff);
  }
  if (path==='/plants/fertiliser' && request.method==='POST')return fertiliser(db,body,staff);
  fail(405,'method');
}
