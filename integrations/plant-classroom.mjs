import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { all, fail, json, keys, nowISO, SECURITY } from './education-common.mjs';
import { currentSydneyDate } from './education-workspace.mjs';
import { teacherFieldReport } from './plant-field-report.mjs';
import { bands, interests, packs, topics, monthlyActivity, monthlyModes } from '../public/teachers/plant-library-data.js';

const isOption=(object,key)=>typeof key==='string'&&Object.hasOwn(object,key);
const stages=['Soil preparation','Tiny seedling','Leafy seedling','Young plant','Branching','Flower buds','Flowering','Green cherries','Ripening cherries','Ripe cherries'];
const monthKey=/^\d{4}-(?:0[1-9]|1[0-2])$/;
const monthNow=date=>currentSydneyDate(date).slice(0,7);

export async function classroomPreference(db,actor) {
  const saved=await db.prepare('SELECT band,interests,skipped FROM edu_plant_class_preferences WHERE user_id=?').bind(actor.id).first();
  return saved?{band:saved.band,interests:JSON.parse(saved.interests),skipped:!!saved.skipped}:null;
}
function previousMonth(month){
  const date=new Date(month+'-01T00:00:00Z');
  date.setUTCMonth(date.getUTCMonth()-1);
  return date.toISOString().slice(0,7);
}
async function interestTotals(db){
  const rows=await all(db.prepare("SELECT interests,COUNT(*) AS n FROM edu_plant_class_preferences WHERE skipped=0 GROUP BY interests"));
  const totals=Object.fromEntries(Object.keys(interests).map(key=>[key,0]));
  for(const row of rows)for(const key of JSON.parse(row.interests))totals[key]+=row.n;
  return totals;
}
export async function prepareClassroomMonth(db,date=new Date()){
  const month=monthNow(date);
  if(await db.prepare('SELECT 1 FROM edu_plant_class_monthly WHERE month=?').bind(month).first())return;
  const previous=previousMonth(month);
  const top=column=>db.prepare('SELECT '+column+' AS value, COUNT(*) AS n FROM edu_plant_class_feedback WHERE month=? GROUP BY '+column+' ORDER BY n DESC,value LIMIT 1').bind(previous).first();
  const [topic,band,format]=await Promise.all([top('topic'),top('band'),top('format')]);
  let formatChoice=format?.value;
  if(!formatChoice){
    const totals=Object.entries(await interestTotals(db)).sort((a,b)=>b[1]-a[1]);
    formatChoice=totals[0][1]>0?totals[0][0]:'workbook';
  }
  const fallback=Object.keys(topics)[(Number(month.slice(5))-1)%Object.keys(topics).length];
  await db.prepare('INSERT OR IGNORE INTO edu_plant_class_monthly(month,topic,band,format,votes,created_at) VALUES(?,?,?,?,?,?)')
    .bind(month,topic?.value||fallback,band?.value||'',formatChoice,topic?.n||0,date.toISOString()).run();
}
export async function staffClassroom(request,db,body){
  const month=monthNow();
  await prepareClassroomMonth(db);
  if(request.method==='POST'){
    const input=keys(body,['month']);
    if(input.month!==month)fail(409,'month_changed');
    await db.prepare('UPDATE edu_plant_class_monthly SET published_at=COALESCE(published_at,?) WHERE month=?').bind(nowISO(),month).run();
  }
  const totals=await interestTotals(db);
  const prior=previousMonth(month);
  const [draft,votes]=await Promise.all([
    db.prepare('SELECT * FROM edu_plant_class_monthly WHERE month=?').bind(month).first(),
    all(db.prepare('SELECT topic, COUNT(*) AS total FROM edu_plant_class_feedback WHERE month=? GROUP BY topic ORDER BY total DESC,topic').bind(prior))
  ]);
  return json({draft,votes,previousMonth:prior,interests:totals});
}

const curriculum={
  ES1:'NSW 2017 STe-1WS-S / 2024 STE-PQU-01',
  S1:'NSW 2017 ST1-1WS-S / 2024 ST1-DAT-01',
  S2:'NSW 2017 ST2-1WS-S / 2024 ST2-DAT-01',
  S3:'NSW 2017 ST3-1WS-S / 2024 Stage 3 Working scientifically',
  S4:'NSW Science 2023 SC4-WS-06',
  S5:'NSW Science 2023 SC5-WS-08'
};
function printable(value, max=102) {
  // The supplemental sheet uses a standard PDF font. The workbook itself embeds Noto.
  return Array.from(String(value??'').replace(/[\u0000-\u001f\u007f]/g,' '))
    .map(c=>c.codePointAt(0)<=255||'’‘–—•'.includes(c)?c:'?').join('').slice(0,max);
}
async function downloadHeaders(request,id,bytes) {
  return new Response(request.method==='HEAD'?null:bytes,{headers:{...SECURITY,
    'Content-Type':'application/pdf','Content-Length':String(bytes.length),
    'Content-Disposition':'attachment; filename="The-Glenolia-'+id+'.pdf"',
    'X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"sandbox; default-src 'none'; frame-ancestors 'none'"
  }});
}
async function printablePack(request,env,file,actor,applicationId,monthly){
  let report=null;
  if(applicationId)report=await (await teacherFieldReport(env.EDU_DB,actor,applicationId)).json();
  let doc;
  if(monthly)doc=await PDFDocument.create();
  else {
    const url=new URL('/assets/education/plant-library/'+file.id+'.pdf',request.url);
    const asset=await env.ASSETS.fetch(new Request(url));
    if(!asset.ok||!asset.headers.get('Content-Type')?.startsWith('application/pdf'))fail(503,'file_temporarily_unavailable');
    if(!report)return downloadHeaders(request,file.id,new Uint8Array(await asset.arrayBuffer()));
    doc=await PDFDocument.load(await asset.arrayBuffer());
  }
  const green=rgb(.184,.29,.235),ink=rgb(.23,.20,.18),sage=rgb(.86,.88,.82);
  const normal=await doc.embedFont(StandardFonts.Helvetica), head=await doc.embedFont(StandardFonts.TimesRoman);
  if(monthly){
    const topic=monthlyActivity(monthly.topic,monthly.month),page=doc.addPage([595.28,841.89]);
    const line=(value,y,size=12,font=normal)=>page.drawText(value,{x:48,y,size,font,color:ink,maxWidth:490,lineHeight:size*1.65});
    line('THE GLENOLIA  /  MONTHLY CLASSROOM ACTIVITY',775,10);
    line(topic.title,726,29,head);
    line(monthly.month+(monthly.band?'  |  Start with '+bands[monthly.band]:'  |  Adapt for your class'),690);
    line('25 minutes  |  A dated journal entry, paper and pencils',653);
    line(topic.plan,612);
    line(monthlyModes[monthly.format],553,10);
    line('Discuss',507,18,head);
    line(topic.question,480);
    line('Extend the investigation',443,18,head);
    line(topic.secondary,413);
    line('Our evidence and next observation',337,18,head);
    for(let y=300;y>=130;y-=32)page.drawLine({start:{x:48,y},end:{x:542,y},thickness:.6,color:sage});
    line('Use the farmer’s actual notes. Label classroom models separately.',111,10);
    line(curriculum[monthly.band]||'See the Teacher’s field handbook for NSW curriculum links.',93,9);
  }
  if(report){
    const {plant,fields,latestObservation}=report;
    const page=doc.getPage(0),stampY=monthly?41:42;
    page.drawRectangle({x:48,y:stampY,width:499,height:36,color:sage});
    const label=plant.label+'  |  '+(fields.variety?.value||'Variety unrecorded')+'  |  '+(stages[plant.stage-1]||'Stage unrecorded');
    page.drawText(printable(label,79),{x:57,y:stampY+21,size:10,font:normal,color:green,maxWidth:477});
    const date=latestObservation?.observedOn;
    const source=date?'Latest dated field note '+date:'Waiting for a dated field note. Use a classroom model and label it.';
    if(!monthly){
      const focus=plant.stage<=1?'Ground preparation':plant.stage<=4?'Visible plant features':plant.stage<=7?'Buds and flowers':'Coffee cherries';
      page.drawText('Start with '+focus.toLowerCase()+'. Tick off what you can verify in the journal.',
        {x:48,y:112,size:10,font:normal,color:green,maxWidth:499});
    }
    page.drawText(printable(source),{x:57,y:stampY+8,size:8,font:normal,color:ink,maxWidth:477});
  }
  if(monthly)doc.setTitle(monthlyActivity(monthly.topic,monthly.month).title+' | The Glenolia');
  return downloadHeaders(request,file.id,await doc.save());
}
export async function classroomRoutes(request,env,path,actor,body){
  const db=env.EDU_DB,method=request.method,url=new URL(request.url);
  if(path==='/api/plants/class-library'&&method==='GET'){
    const [profile,monthly,feedback]=await Promise.all([classroomPreference(db,actor),
      all(db.prepare('SELECT month,topic,band,format FROM edu_plant_class_monthly WHERE published_at IS NOT NULL AND month<=? ORDER BY month DESC LIMIT 12').bind(monthNow())),
      db.prepare('SELECT band,topic,format FROM edu_plant_class_feedback WHERE user_id=? AND month=?').bind(actor.id,monthNow()).first()]);
    return json({profile,monthly,feedback:feedback||null});
  }
  if(path==='/api/plants/class-library/preferences'&&method==='POST'){
    const b=keys(body,['band','interests','skipped']);
    if(typeof b.skipped!=='boolean'||(!b.skipped&&b.band!==''&&!isOption(bands,b.band))||
      !Array.isArray(b.interests)||b.interests.length>4||b.interests.some(v=>!isOption(interests,v)))fail(400,'invalid_field');
    const profile={band:b.skipped?'':b.band,interests:b.skipped?[]:[...new Set(b.interests)],skipped:b.skipped};
    await db.prepare(`INSERT INTO edu_plant_class_preferences(user_id,band,interests,skipped,updated_at) VALUES(?,?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET band=excluded.band,interests=excluded.interests,skipped=excluded.skipped,updated_at=excluded.updated_at`)
      .bind(actor.id,profile.band,JSON.stringify(profile.interests),Number(profile.skipped),nowISO()).run();
    return json({profile});
  }
  if(path==='/api/plants/class-library/feedback'&&method==='POST'){
    const b=keys(body,['band','topic','format']);
    if(!isOption(bands,b.band)||!isOption(topics,b.topic)||!isOption(interests,b.format))fail(400,'invalid_field');
    await db.prepare(`INSERT INTO edu_plant_class_feedback(user_id,month,band,topic,format) VALUES(?,?,?,?,?)
      ON CONFLICT(user_id,month) DO UPDATE SET band=excluded.band,topic=excluded.topic,format=excluded.format`)
      .bind(actor.id,monthNow(),b.band,b.topic,b.format).run();
    return json({saved:true});
  }
  const match=path.match(/^\/api\/plants\/class-library\/([a-z0-9-]+)\.pdf$/);
  if(match&&['GET','HEAD'].includes(method)){
    const id=match[1],app=url.searchParams.get('applicationId'),file=packs.find(item=>item.id===id);
    if(file)return printablePack(request,env,file,actor,app,null);
    if(id.startsWith('monthly-')&&monthKey.test(id.slice(8))){
      const monthly=await db.prepare('SELECT month,topic,band,format FROM edu_plant_class_monthly WHERE month=? AND month<=? AND published_at IS NOT NULL').bind(id.slice(8),monthNow()).first();
      if(monthly)return printablePack(request,env,{id},actor,app,monthly);
    }
  }
  fail(404,'not_found');
}
