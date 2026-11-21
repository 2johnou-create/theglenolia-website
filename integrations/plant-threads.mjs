import {all,fail,json,keys,nowISO,rate,text,uuid} from './education-common.mjs';
import {orgMember} from './plant-organisation.mjs';

const current=`s.status<>'suspended' AND (a.status='active' OR
 (a.status='cooling' AND a.release_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')))`;
const apps='edu_plant_applications a JOIN edu_schools s ON s.id=a.workspace_id';
const threads='edu_plant_questions q JOIN edu_plant_applications a ON a.id=q.application_id JOIN edu_schools s ON s.id=a.workspace_id';
const byNewest='ORDER BY m.created_at DESC,m.rowid DESC';
const size=30;

function pageIndex(value){
 if(value==null || value==='')return 0;
 if(!/^\d{1,15}$/.test(value))fail(400,'invalid_page');
 return Number(value);
}

async function readThreads(db,url,userId){
 const appId=userId?uuid(url.searchParams.get('applicationId')):null;
 const filter=userId?` AND a.id=? AND a.workspace_id IN (${orgMember})`:'';
 const bindings=userId?[appId,userId]:[];
 if(userId && !await db.prepare(`SELECT 1 FROM ${apps} WHERE ${current}${filter}`).bind(...bindings).first())
  fail(404,'application_not_found');
 const common=`FROM ${threads} WHERE ${current}${filter}`;
 const tid=url.searchParams.get('threadId');
 if(tid){
  const follow=userId?'EXISTS(SELECT 1 FROM edu_plant_thread_follows f WHERE f.thread_id=q.id AND f.user_id=? AND f.following=1)':'0';
  const item=await db.prepare(`SELECT q.id,q.question,q.created_at AS createdAt,a.plant_key AS plantKey,${follow} AS following ${common} AND q.id=?`)
   .bind(...(userId?[userId]:[]),...bindings,uuid(tid)).first();
  if(!item)fail(404,'thread_not_found');
  const before=pageIndex(url.searchParams.get('before'));
  // rowid is a stable, per-insert cursor, including same-timestamp messages.
  const rows=await all(db.prepare(`SELECT m.id,m.side,m.body,m.created_at AS createdAt,m.rowid AS cursor
    FROM edu_plant_thread_messages m WHERE m.thread_id=? AND (?=0 OR m.rowid<?)
    AND EXISTS(SELECT 1 ${common} AND q.id=m.thread_id) ORDER BY m.rowid DESC LIMIT ?`)
   .bind(tid,before,before,...bindings,size+1));
  const more=rows.length>size;
  const messages=rows.slice(0,size).reverse();
  return json({thread:{...item,following:!!item.following},messages,nextBefore:more?messages[0].cursor:null});
 }
 const offset=pageIndex(url.searchParams.get('offset'));
 const rows=await all(db.prepare(`SELECT q.id,q.question,q.created_at AS createdAt,a.plant_key AS plantKey,
   COALESCE((SELECT m.created_at FROM edu_plant_thread_messages m WHERE m.thread_id=q.id ${byNewest} LIMIT 1),q.created_at) AS lastAt,
   COALESCE((SELECT m.side FROM edu_plant_thread_messages m WHERE m.thread_id=q.id ${byNewest} LIMIT 1),'school') AS lastSide
   ${common} ORDER BY lastAt DESC,q.id DESC LIMIT ? OFFSET ?`).bind(...bindings,size+1,offset));
 return json({threads:rows.slice(0,size),nextOffset:rows.length>size?offset+size:null});
}

async function openThread(db,userId,b){
 keys(b,['applicationId','requestId','question','consent','follow']);
 const app=uuid(b.applicationId),id=uuid(b.requestId),question=text(b.question,800),at=nowISO();
 if(b.consent!==true || typeof b.follow!=='boolean')fail(400,'consent_required');
 const authorised=`FROM ${apps} WHERE a.id=? AND ${current} AND a.workspace_id IN (${orgMember})`;
 const prior=await db.prepare(`SELECT q.question FROM ${threads} WHERE q.id=? AND a.id=? AND ${current} AND q.submitted_by=? AND a.workspace_id IN (${orgMember})`).bind(id,app,userId,userId).first();
 if(prior){
  if(prior.question!==question)fail(409,'request_conflict');
  return json({threadId:id});
 }
 if(!await rate(db,'plant-question:'+userId,12,3600000))fail(429,'question_limit');
 const [created]=await db.batch([
  db.prepare(`INSERT INTO edu_plant_questions(id,application_id,question,created_at,submitted_by)
   SELECT ?,a.id,?,?,? ${authorised} ON CONFLICT(id) DO NOTHING`).bind(id,question,at,userId,app,userId),
  db.prepare(`INSERT INTO edu_plant_thread_follows(thread_id,user_id,following,changed_at)
   SELECT q.id,?,?,? FROM ${threads} WHERE q.id=? AND a.id=? AND q.submitted_by=? AND q.question=? AND ${current} AND a.workspace_id IN (${orgMember})
   ON CONFLICT(thread_id,user_id) DO NOTHING`).bind(userId,+b.follow,at,id,app,userId,question,userId)
 ]);
 if(!created.meta.changes){
  const retry=await db.prepare(`SELECT q.question FROM ${threads} WHERE q.id=? AND a.id=? AND q.submitted_by=? AND ${current} AND a.workspace_id IN (${orgMember})`).bind(id,app,userId,userId).first();
  if(!retry)fail(404,'application_not_found');
  if(retry.question!==question)fail(409,'request_conflict');
 }
 return json({threadId:id});
}

async function reply(db,userId,staffId,b){
 keys(b,['applicationId','threadId','requestId','body','consent']);
 const tid=uuid(b.threadId),id=uuid(b.requestId),body=text(b.body,800),side=userId?'school':'farm',author=userId||staffId;
 if(userId && b.consent!==true)fail(400,'consent_required');
 const filter=userId?` AND a.id=? AND a.workspace_id IN (${orgMember})`:'';
 const args=userId?[uuid(b.applicationId),userId]:[];
 const allowed=`FROM ${threads} WHERE q.id=? AND ${current}${filter}`;
 const prior=()=>db.prepare(`SELECT m.body FROM edu_plant_thread_messages m WHERE m.id=? AND m.thread_id=? AND m.side=? AND m.actor_id=?
  AND EXISTS(SELECT 1 ${allowed})`).bind(id,tid,side,author,tid,...args).first();
 const old=await prior();
 if(old){if(old.body!==body)fail(409,'request_conflict');return json({threadId:tid});}
 if(userId && !await rate(db,'plant-question:'+userId,12,3600000))fail(429,'question_limit');
 const inserted=await db.prepare(`INSERT INTO edu_plant_thread_messages(id,thread_id,side,body,actor_id,created_at)
 SELECT ?,q.id,?,?,?,? ${allowed} ON CONFLICT(id) DO NOTHING`).bind(id,side,body,author,nowISO(),tid,...args).run();
 if(!inserted.meta.changes){const seen=await prior();if(!seen)fail(404,'thread_not_found');if(seen.body!==body)fail(409,'request_conflict');}
 return json({threadId:tid});
}

async function follow(db,userId,b){
 keys(b,['applicationId','threadId','follow']);
 if(typeof b.follow!=='boolean')fail(400,'invalid_field');
 const result=await db.prepare(`INSERT INTO edu_plant_thread_follows(thread_id,user_id,following,changed_at)
 SELECT q.id,?,?,? FROM ${threads} WHERE q.id=? AND a.id=? AND ${current} AND a.workspace_id IN (${orgMember})
 ON CONFLICT(thread_id,user_id) DO UPDATE SET following=excluded.following,changed_at=excluded.changed_at`)
 .bind(userId,+b.follow,nowISO(),uuid(b.threadId),uuid(b.applicationId),userId).run();
 if(!result.meta.changes)fail(404,'thread_not_found');
 return json({following:b.follow});
}

export async function plantThreadRoute(request,db,path,{userId,staffId},body){
 if(path==='/threads' && request.method==='GET')return readThreads(db,new URL(request.url),userId);
 if(request.method==='POST'){
  if(path==='/threads/open' && userId)return openThread(db,userId,body);
  if(path==='/threads/reply')return reply(db,userId,staffId,body);
  if(path==='/threads/follow' && userId)return follow(db,userId,body);
 }
 fail(404,'not_found');
}
