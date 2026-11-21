import {all, dateValue, fail, id, json, keys, nowISO, text, SECURITY, digest} from './education-common.mjs';
import {currentSydneyDate} from './education-workspace.mjs';

const positionPattern=/^r(?:[1-9]|1[0-2])-p(?:[1-9]|1[0-9])$/;
const varietyId=/^[a-z0-9-]{1,80}$/;
const traitOptions={
 stature:['Compact','Tall'],leafTip:['Green','Bronze','Green or bronze'],
 beanSize:['Below average','Average','Large','Very large'],yieldPotential:['Low','Medium','High','Very high'],
 firstFruit:['Year 2','Year 3','Year 4'],ripening:['Early','Average','Late','Very late'],
 rust:['Susceptible','Intermediate resistance','Highly resistant'],nutrition:['Low','Medium','High','Very high']
};
export async function varietyRoutes(request,db,path,body) {
  if(path==='/plants/varieties' && request.method==='GET') {
    const varieties=await all(db.prepare('SELECT id,name,source_url AS sourceUrl,identity_note AS note,traits FROM edu_coffee_varieties ORDER BY name'));
    const positions=await all(db.prepare(`SELECT a.plant_key AS key,a.row_num AS row,a.position,a.stage,a.revision,
      p.id AS plantingId,p.variety_id AS varietyId,v.name AS variety,p.planted_on AS plantedOn,
      (SELECT app.id FROM edu_plant_applications app WHERE app.plant_key=a.plant_key AND app.status IN ('active','cooling','offered') LIMIT 1) AS applicationId,
      (SELECT app.school_name FROM edu_plant_applications app WHERE app.plant_key=a.plant_key AND app.status IN ('active','cooling','offered') LIMIT 1) AS schoolName
      FROM edu_atlas_positions a JOIN edu_atlas_rows r ON r.row_num=a.row_num
      LEFT JOIN edu_coffee_plantings p ON p.plant_key=a.plant_key AND p.ended_at IS NULL
      LEFT JOIN edu_coffee_varieties v ON v.id=p.variety_id
      WHERE a.position<=r.enabled_count ORDER BY a.row_num,a.position`));
    return json({varieties,positions});
  }
  if(path==='/plants/varieties/history' && request.method==='GET') {
    const key=new URL(request.url).searchParams.get('key');
    if(!positionPattern.test(key||''))fail(400,'invalid_field');
    const history=await all(db.prepare(`SELECT p.id,p.planted_on AS plantedOn,p.recorded_at AS recordedAt,p.ended_at AS endedAt,
      p.replacement_reason AS reason,v.name,
      (SELECT json_group_array(stage) FROM edu_stage_photo_archive WHERE planting_id=p.id) AS archivedStages
      FROM edu_coffee_plantings p JOIN edu_coffee_varieties v ON v.id=p.variety_id
      WHERE p.plant_key=? ORDER BY p.recorded_at DESC,p.id DESC`).bind(key));
    return json({history:history.map(p=>({...p,archivedStages:JSON.parse(p.archivedStages)}))});
  }
  if(path==='/plants/varieties/archive' && request.method==='GET') {
    const u=new URL(request.url),key=u.searchParams.get('key'),planting=u.searchParams.get('planting'),stage=Number(u.searchParams.get('stage'));
    if(!positionPattern.test(key||'') || !/^[a-z0-9-]{1,120}$/i.test(planting||'') || !Number.isInteger(stage) || stage<1 || stage>10)fail(400,'invalid_field');
    const row=await db.prepare(`SELECT a.photo_mime,a.photo_bytes FROM edu_stage_photo_archive a JOIN edu_coffee_plantings p ON p.id=a.planting_id WHERE p.plant_key=? AND p.id=? AND a.stage=?`).bind(key,planting,stage).first();
    if(!row)fail(404,'not_found');
    return new Response(Array.isArray(row.photo_bytes)?Uint8Array.from(row.photo_bytes):row.photo_bytes,{headers:{...SECURITY,'Content-Type':row.photo_mime,'Content-Security-Policy':"default-src 'none'; sandbox"}});
  }
  if(path==='/plants/varieties' && request.method==='POST') {
    const b=keys(body,['id','name','sourceUrl','note','traits']);
    const name=text(b.name,120),source=b.sourceUrl?text(b.sourceUrl,500):null,note=text(b.note||'',500,{empty:true});
    if(source){let url;try{url=new URL(source);}catch{fail(400,'invalid_field');}if(url.protocol!=='https:')fail(400,'invalid_field');}
    const key=b.id || id();if(typeof key!=='string'||!varietyId.test(key))fail(400,'invalid_field');
    const raw=keys(b.traits||{},Object.keys(traitOptions)),traits={};
    for(const [field,value] of Object.entries(raw)){if(value && !traitOptions[field].includes(value))fail(400,'invalid_field');if(value)traits[field]=value;}
    const prior=await db.prepare('SELECT name FROM edu_coffee_varieties WHERE id=?').bind(key).first();
    if(prior && prior.name!==name && await db.prepare('SELECT 1 FROM edu_coffee_plantings WHERE variety_id=? LIMIT 1').bind(key).first())fail(409,'variety_name_locked');
    const stamp=nowISO();
    await db.prepare(`INSERT INTO edu_coffee_varieties(id,name,source_url,identity_note,traits,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,source_url=excluded.source_url,
      identity_note=excluded.identity_note,traits=excluded.traits,updated_at=excluded.updated_at`).bind(key,name,source,note,JSON.stringify(traits),stamp,stamp).run();
    return json({ok:true,id:key});
  }
  if(path==='/plants/varieties/assign' && request.method==='POST') {
    const b=keys(body,['requestId','varietyId','positions','plantedOn','newStage','expectedRevisions']),stamp=nowISO(),staff=request.headers.get('X-Glenolia-Staff-Email')||'farm_staff';
    if(!/^[0-9a-f-]{36}$/i.test(b.requestId||'') || typeof b.varietyId!=='string'||!varietyId.test(b.varietyId) || !Array.isArray(b.positions) || !b.positions.length || b.positions.length>228 ||
      new Set(b.positions).size!==b.positions.length || b.positions.some(p=>typeof p!=='string'||!positionPattern.test(p)) || !Number.isInteger(b.newStage) || b.newStage<1 || b.newStage>10 || !b.expectedRevisions || b.positions.some(p=>!Number.isInteger(b.expectedRevisions[p])))fail(400,'invalid_field');
    const date=dateValue(b.plantedOn);if(date>currentSydneyDate(new Date()))fail(400,'future_observation');
    const fingerprint=await digest(JSON.stringify([b.varietyId,date,b.newStage,b.positions.slice().sort().map(p=>[p,b.expectedRevisions[p]])]));
    const previous=await db.prepare('SELECT fingerprint,plant_count AS count FROM edu_coffee_bulk_requests WHERE request_id=?').bind(b.requestId).first();
    if(previous){if(previous.fingerprint!==fingerprint)fail(409,'request_conflict');return json({ok:true,count:previous.count});}
    if(!await db.prepare('SELECT id FROM edu_coffee_varieties WHERE id=?').bind(b.varietyId).first())fail(404,'not_found');
    const selection=await all(db.prepare(`SELECT a.plant_key AS key,a.revision,p.variety_id AS varietyId FROM edu_atlas_positions a
      JOIN edu_atlas_rows r ON r.row_num=a.row_num
      LEFT JOIN edu_coffee_plantings p ON p.plant_key=a.plant_key AND p.ended_at IS NULL
      WHERE a.position<=r.enabled_count AND a.plant_key IN (${b.positions.map(()=>'?').join(',')})`).bind(...b.positions));
    if(selection.length!==b.positions.length || selection.some(p=>p.revision!==b.expectedRevisions[p.key]))fail(409,'atlas_changed');
    if(selection.some(p=>p.varietyId))fail(409,'planting_exists');
    // D1 batch is atomic. The unique current-planting index rejects concurrent assignment.
    const requests=[db.prepare('INSERT INTO edu_coffee_bulk_requests(request_id,fingerprint,plant_count,created_at) VALUES(?,?,?,?)').bind(b.requestId,fingerprint,selection.length,stamp)];
    for(const p of selection){
      requests.push(db.prepare(`INSERT INTO edu_coffee_plantings(id,plant_key,variety_id,planted_on,recorded_at,recorded_by)
        VALUES(?,(SELECT a.plant_key FROM edu_atlas_positions a JOIN edu_atlas_rows r ON r.row_num=a.row_num WHERE a.plant_key=? AND a.position<=r.enabled_count AND a.revision=?),?,?,?,?)`).bind(id(),p.key,b.expectedRevisions[p.key],b.varietyId,date,stamp,staff));
      requests.push(db.prepare('UPDATE edu_atlas_positions SET stage=?,revision=revision+1 WHERE plant_key=? AND revision=?').bind(b.newStage,p.key,b.expectedRevisions[p.key]));
    }
    try{await db.batch(requests);}catch(error){
      const saved=await db.prepare('SELECT fingerprint,plant_count AS count FROM edu_coffee_bulk_requests WHERE request_id=?').bind(b.requestId).first();
      if(saved && saved.fingerprint===fingerprint)return json({ok:true,count:saved.count});
      fail(409,'planting_changed');
    }
    return json({ok:true,count:selection.length});
  }
  if(path==='/plants/varieties/replace' && request.method==='POST') {
    const b=keys(body,['requestId','key','expectedPlantingId','expectedApplicationId','varietyId','plantedOn','reason','removed','replanted','reviewed','newStage','expectedRevision']);
    if(!/^[0-9a-f-]{36}$/i.test(b.requestId||'') || !positionPattern.test(b.key||'') ||
       typeof b.expectedPlantingId!=='string' || !varietyId.test(b.varietyId||'') ||
       b.removed!==true || b.replanted!==true || !Number.isInteger(b.newStage) || b.newStage<1 || b.newStage>10 || !Number.isInteger(b.expectedRevision))fail(400,'invalid_field');
    const reason=text(b.reason,500),date=dateValue(b.plantedOn),staff=request.headers.get('X-Glenolia-Staff-Email')||'farm_staff';
    if(date>currentSydneyDate(new Date()))fail(400,'future_observation');
    const duplicate=await db.prepare('SELECT old_planting_id AS oldId,new_planting_id AS newId,application_id AS applicationId,new_stage AS newStage FROM edu_plant_replacement_reviews WHERE request_id=?').bind(b.requestId).first();
    if(duplicate){
      const existing=await db.prepare('SELECT plant_key,variety_id,planted_on FROM edu_coffee_plantings WHERE id=?').bind(duplicate.newId).first();
      const old=await db.prepare('SELECT replacement_reason FROM edu_coffee_plantings WHERE id=?').bind(duplicate.oldId).first();
      if(duplicate.oldId!==b.expectedPlantingId || existing?.plant_key!==b.key || existing?.variety_id!==b.varietyId || existing?.planted_on!==date || old?.replacement_reason!==reason || duplicate.newStage!==b.newStage || (duplicate.applicationId||null)!==(b.expectedApplicationId||null))fail(409,'request_conflict');
      return json({ok:true});
    }
    const current=await db.prepare(`SELECT p.id,p.variety_id AS varietyId,v.stage,v.revision,
      (SELECT id FROM edu_plant_applications a WHERE a.plant_key=p.plant_key AND a.status IN ('active','cooling','offered') LIMIT 1) AS applicationId
      FROM edu_coffee_plantings p JOIN edu_atlas_positions v ON v.plant_key=p.plant_key WHERE p.plant_key=? AND p.ended_at IS NULL`).bind(b.key).first();
    if(!current || current.id!==b.expectedPlantingId || current.revision!==b.expectedRevision || (current.applicationId||null)!==(b.expectedApplicationId||null))fail(409,'planting_changed');
    if(current.applicationId && b.reviewed!==true)fail(400,'adoption_review_required');
    if(!await db.prepare('SELECT id FROM edu_coffee_varieties WHERE id=?').bind(b.varietyId).first())fail(404,'not_found');
    const at=nowISO(),newId=id();
    const closed= db.prepare(`UPDATE edu_coffee_plantings SET ended_at=?,ended_by=?,replacement_reason=?
      WHERE id=? AND ended_at IS NULL AND COALESCE((SELECT id FROM edu_plant_applications a WHERE a.plant_key=edu_coffee_plantings.plant_key
      AND a.status IN ('active','cooling','offered') LIMIT 1),'')=? AND EXISTS (SELECT 1 FROM edu_atlas_positions WHERE plant_key=? AND revision=?)`).bind(at,staff,reason,current.id,current.applicationId||'',b.key,b.expectedRevision);
    const archived=db.prepare(`INSERT OR IGNORE INTO edu_stage_photo_archive(planting_id,stage,photo_mime,photo_bytes,recorded_at,recorded_by)
      SELECT ?,stage,photo_mime,photo_bytes,recorded_at,recorded_by FROM edu_plant_stage_photos
      WHERE plant_key=? AND EXISTS(SELECT 1 FROM edu_coffee_plantings WHERE id=? AND ended_at=? AND ended_by=?)`).bind(current.id,b.key,current.id,at,staff);
    const clear=db.prepare(`DELETE FROM edu_plant_stage_photos WHERE plant_key=? AND EXISTS
      (SELECT 1 FROM edu_coffee_plantings WHERE id=? AND ended_at=? AND ended_by=?)`).bind(b.key,current.id,at,staff);
    const create=db.prepare('INSERT INTO edu_coffee_plantings(id,plant_key,variety_id,planted_on,recorded_at,recorded_by) VALUES(?,?,?,?,?,?)').bind(newId,b.key,b.varietyId,date,at,staff);
    const stage=db.prepare('UPDATE edu_atlas_positions SET stage=?,revision=revision+1 WHERE plant_key=? AND revision=?').bind(b.newStage,b.key,b.expectedRevision);
    const blank=db.prepare(`INSERT INTO edu_plant_field_profiles(scope_key,plant_key,revision,snapshot,recorded_at,recorded_by,planting_id)
      SELECT p.plant_key,p.plant_key,COALESCE((SELECT MAX(revision) FROM edu_plant_field_profiles WHERE scope_key=p.plant_key),0)+1,'{}',?,?,?
      FROM edu_plants p WHERE p.plant_key=?`).bind(at,staff,newId,b.key);
    const review=db.prepare(`INSERT INTO edu_plant_replacement_reviews(request_id,old_planting_id,new_planting_id,application_id,removed_confirmed,replanted_confirmed,adoption_reviewed,adoption_outcome,recorded_at,recorded_by,old_stage,new_stage)
      VALUES(?,?,?,?,1,1,?,?,?,?,?,?)`).bind(b.requestId,current.id,newId,current.applicationId||null,current.applicationId?1:0,current.applicationId?'continue':null,at,staff,current.stage,b.newStage);
    try{const result=await db.batch([closed,archived,clear,create,stage,blank,review]);if(!result[0].meta.changes)fail(409,'planting_changed');}
    catch(error){if(error.status)throw error;fail(409,'planting_changed');}
    return json({ok:true});
  }
  fail(405,'method');
}
