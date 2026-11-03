import {fail,all,json,resourceId,encode,SECURITY} from './education-common.mjs';
export async function accessible(db,r,actor){
 if(!r||r.status!=='published'||!r.published_version)return false;
 if(r.availability==='public')return true;if(!actor)return false;if(r.availability==='teacher')return true;
 return !!await db.prepare('SELECT 1 AS ok FROM edu_resource_grants WHERE resource_id=? AND (user_id=? OR school_id=?) LIMIT 1').bind(r.id,actor.id,actor.schoolId).first();
}
export async function getResource(db,id,actor,{version=null,allowSummary=false}={}){
 resourceId(id);const r=await db.prepare('SELECT * FROM edu_resources WHERE id=?').bind(id).first();
 const allowed=await accessible(db,r,actor);
 if(!allowed){if(r?.status==='published'&&r.availability==='teacher'&&!actor)fail(401,'teacher_sign_in_required');fail(404,'resource_not_found');}
 const v=version===null?r.published_version:Number(version);if(!Number.isInteger(v)||v<1)fail(404,'resource_version_not_found');
 const row=await db.prepare('SELECT payload,version,pdf_key,pdf_size,published_at FROM edu_resource_versions WHERE resource_id=? AND version=? AND published_at IS NOT NULL').bind(id,v).first();if(!row)fail(404,'resource_version_not_found');
 const pack=JSON.parse(row.payload);return {...pack,id:r.id,title:pack.title,stage:pack.stage,term:pack.term,version:row.version,availability:r.availability,pdfAvailable:!!row.pdf_key||row.pdf_size>0,pdfUrl:`/api/resources/${r.id}/pdf?version=${row.version}`,htmlUrl:`/resource/${r.id}`,publishedAt:row.published_at,revision:r.revision};
}
export async function listResources(db,actor,{staff=false}={}){
 const rows=await all(db.prepare("SELECT r.*,v.payload,v.pdf_key,v.pdf_size,v.published_at FROM edu_resources r LEFT JOIN edu_resource_versions v ON v.resource_id=r.id AND v.version=r.published_version ORDER BY r.stage,r.term,r.id"));const result=[];
 for(const r of rows){
  if(!staff&&(r.status!=='published'||r.availability==='selected'&&!await accessible(db,r,actor)))continue;
  const p=r.payload?JSON.parse(r.payload):{};result.push({id:r.id,title:r.title,stage:r.stage,years:p.years||'',term:r.term,summary:p.summary||'',question:p.question||'',version:r.published_version,availability:r.availability,status:r.status,revision:r.revision,accessible:await accessible(db,r,actor),language:'en',lessonCount:p.lessons?.length||0,image:p.image||'welcome',outcomes:p.outcomes||[],modes:['classroom','school_grounds','field','indoor','home'],pdfAvailable:!!r.pdf_key||r.pdf_size>0,pdfUrl:`/api/resources/${r.id}/pdf?version=${r.published_version}`,htmlUrl:`/resource/${r.id}`,publishedAt:r.published_at});
 }return result;
}
export async function pdfResponse(request,env,resource,actor){
 const row=await env.EDU_DB.prepare('SELECT pdf_blob,pdf_key,pdf_size FROM edu_resource_versions WHERE resource_id=? AND version=?').bind(resource.id,resource.version).first();if(!row)fail(404,'file_not_found');let body;
 // D1 returns BLOBs as number arrays, while local SQLite returns typed arrays.
 // A number array passed directly to Response becomes comma-separated text.
 if(row.pdf_size>0&&row.pdf_blob){
  const value=row.pdf_blob;
  if(!Number.isSafeInteger(row.pdf_size)||row.pdf_size>2097152)fail(503,'file_temporarily_unavailable');
  if(Array.isArray(value)){
   if(value.length!==row.pdf_size||!value.every(n=>Number.isInteger(n)&&n>=0&&n<=255))fail(503,'file_temporarily_unavailable');
   body=Uint8Array.from(value);
  }else if(value instanceof ArrayBuffer)body=new Uint8Array(value);
  else if(ArrayBuffer.isView(value))body=new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
  else fail(503,'file_temporarily_unavailable');
  if(body.byteLength!==row.pdf_size||body.length<5||![37,80,68,70,45].every((b,i)=>body[i]===b))fail(503,'file_temporarily_unavailable');
 }
 else if(row.pdf_key&&/^\/private\/packs\/[a-z0-9-]+\/v\d+\.pdf$/.test(row.pdf_key)){
  const response=await env.ASSETS.fetch(new Request(new URL(row.pdf_key,request.url)));if(!response.ok)fail(503,'file_temporarily_unavailable');body=response.body;
 }else fail(404,'file_not_found');
 return new Response(body,{headers:{...SECURITY,'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="Glenolia-${resource.id}-v${resource.version}.pdf"`,'Content-Security-Policy':"sandbox; default-src 'none'; frame-ancestors 'none'"}});
}
const paragraphs=value=>(Array.isArray(value)?value:[value]).filter(Boolean).map(s=>`<p>${encode(typeof s==='string'?s:JSON.stringify(s))}</p>`).join('');
function storyMoment(pack,placement){
 const s=(pack.storyScenes||[]).find(s=>s.placement===placement);
 if(!s||!/^sl(?:0[1-9]|[12][0-9]|3[0-9]|40)$/.test(s.sceneId))return '';
 const label=!s.character||s.character==='Together'?'A thought to share':s.character+' asks';
 return `<figure class="story-moment"><img src="/assets/education/stories/${s.sceneId}.webp" alt="Illustrated learning moment" width="600" height="400"><figcaption>${encode(label)}${s.question?': '+encode(s.question):''}</figcaption></figure>`;
}
export function printableResource(pack,{studentOnly=false,selectedSections=[],instructions=''}={}){
 const sheets=pack.studentSheets||[],allowed=(s,i)=>!selectedSections.length||selectedSections.includes(s.id)||selectedSections.includes('studentSheets:'+s.id)||selectedSections.includes('studentSheets:'+i);
 let body=`<p class="kicker">THE GLENOLIA · ${encode(pack.stage)} · RESOURCE ${encode(pack.id)} · VERSION ${pack.version}</p><h1>${encode(pack.title)}</h1><p>${encode(pack.question)}</p>${instructions?'<aside>'+encode(instructions)+'</aside>':''}`;
 if(!studentOnly){body+=`${storyMoment(pack,'opening')}<h2>Learning intention</h2>${paragraphs(pack.learningIntentions)}<h2>Preparation and safe participation</h2>${paragraphs(pack.equipment)}${paragraphs(pack.safety)}<h2>Ways to participate</h2>${paragraphs(pack.adjustments)}`;for(const [i,lesson] of (pack.lessons||[]).entries())body+=`<section><h2>${encode(lesson.title)}</h2><p>${encode(lesson.duration)}</p>${storyMoment(pack,'lesson-'+(i+1))}<h3>Model</h3>${paragraphs(lesson.model)}<h3>Guided practice</h3>${paragraphs(lesson.guided)}<h3>Independent practice</h3>${paragraphs(lesson.independent)}<h3>Check and respond</h3>${paragraphs(lesson.checks)}<h3>Teacher guidance</h3>${paragraphs(lesson.answers)}</section>`;}
 if(studentOnly&&selectedSections.length)for(const [i,l] of (pack.lessons||[]).entries())if(selectedSections.includes(l.id)||selectedSections.includes('lessons:'+l.id)||selectedSections.includes('lessons:'+i))body+=`<section class="sheet"><h2>${encode(l.title)}</h2>${paragraphs(l.guided)}${paragraphs(l.independent)}${'<div class="write-line"></div>'.repeat(5)}</section>`;
 for(const s of sheets.filter(allowed))body+=`<section class="sheet"><h2>${encode(s.title)}</h2><p>Group / learner code: ____________________ &nbsp; Date: ______________</p>${paragraphs(s.prompt)}${(s.columns||s.tableColumns||[]).length?'<table><tr>'+(s.columns||s.tableColumns).map(c=>'<th>'+encode(c)+'</th>').join('')+'</tr>'+Array.from({length:4},()=>'<tr>'+(s.columns||s.tableColumns).map(()=>'<td>&nbsp;</td>').join('')+'</tr>').join('')+'</table>':''}${'<div class="write-line"></div>'.repeat(Math.min(12,Math.max(3,s.lines||5)))}${studentOnly?'':'<h3>Teacher answer guidance</h3>'+paragraphs(s.answerGuidance)}</section>`;
 return body;
}
export function printablePage(title,body,{nonce=''}={}){
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${encode(title)} | The Glenolia</title><style${nonce?' nonce="'+encode(nonce)+'"':''}>body{font:16px/1.65 Arial,sans-serif;background:#F5F1E8;color:#3B332D;margin:40px auto;padding:0 24px;max-width:920px}h1,h2,h3{color:#2F4A3C}h1,h2{font-family:Georgia,serif;font-weight:400}.kicker{font-size:12px}aside{padding:18px;background:#D9DFD0}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #2F4A3C;padding:12px;text-align:left}td{height:32px}.write-line{height:34px;border-bottom:1px solid #D9DFD0}section{margin:40px 0}.story-moment{margin:20px 0;break-inside:avoid}.story-moment img{display:block;width:360px;max-width:100%;height:auto}.story-moment figcaption{font-size:14px;color:#2F4A3C}.sheet{break-before:page}@media print{body{margin:0;padding:0;background:white;font-size:12pt}@page{size:A4;margin:18mm}h2,h3{break-after:avoid}tr{break-inside:avoid}.print-note{display:none}}</style></head><body><p class="print-note">Use your browser’s Print command to print or save a PDF. This private page is available only while your session and access remain valid.</p>${body}<footer><p>Teacher-led learning. Record the actual place, method and date. Programme evidence is not an official NESA grade or credential.</p></footer></body></html>`;
}
