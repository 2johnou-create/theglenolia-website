import {classroomRoutes,prepareClassroomMonth,staffClassroom} from './plant-classroom.mjs';
import {plantWorkshopManifest,servePlantWorkshop} from './plant-workshops.mjs';
import {publicPlantWeather} from './plant-weather.mjs';
import {EducationError,json,fail,readBody,loadActor,requireCSRF,secureEqual,SECURITY,all,nowISO} from './education-common.mjs';
import {authRoutes} from './education-auth.mjs';
import {preferencesRoute, requireTeacherConsent, processPlantMail, unsubscribeRoute} from './plant-notifications.mjs';
import {releaseDueAdoptions} from './plant-organisation.mjs';
import {listResources,getResource,pdfResponse,printablePage,printableResource} from './education-resources.mjs';
import {workspaceRoutes} from './education-workspace.mjs';
import {staffRoutes} from './education-staff.mjs';
import {publicPlantMap,publicStagePhoto,teacherPlantRoutes,staffPlantRoutes} from './plant-portal.mjs';
const CSP="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://theglenolia.com.au; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
export async function handleEducation(request,env,ctx={}){
 const url=new URL(request.url),path=url.pathname;
 // All served asset names are ASCII. Reject alternate encodings rather than
 // letting the asset service decode a private path after our policy check.
 if(/[%\\]/.test(path)||path.includes('//'))return json({error:'not_found'},404);
 try{
  if(path.startsWith('/email/stop/'))return await unsubscribeRoute(request,env,path);
  if(path.startsWith('/private/')||path==='/private')return json({error:'not_found'},404);
  if(path.startsWith('/internal/admin/')){
   if(!env.STAFF_TOKEN||!secureEqual(request.headers.get('Authorization'),'Bearer '+env.STAFF_TOKEN))return json({error:'not_found'},404);
   if(!['GET','POST'].includes(request.method))return json({error:'method'},405);
   if(path==='/internal/admin/classroom-monthly')return await staffClassroom(request,env.EDU_DB,request.method==='POST'?await readBody(request,2048):null);
   if (path.startsWith('/internal/admin/plants/')) {
    const limit=['/internal/admin/plants/update','/internal/admin/plants/stage-photo'].includes(path) ? 420000 : 8192;
    const body=request.method==='POST' ? await readBody(request,limit) : null;
    return await staffPlantRoutes(request,env,path.slice('/internal/admin'.length),body);
   }
   const body=request.method==='POST'?await readBody(request,path.endsWith('/pdf')?3000000:131072):null;
   return await staffRoutes(request,env,path.slice('/internal/admin'.length),body)||json({error:'not_found'},404);
  }
  if(path.startsWith('/api/')){
   if(!env.EDU_DB||!env.SESSION_KEY||!env.APP_ORIGIN)fail(503,'portal_unavailable');
   if(!['GET','POST','HEAD'].includes(request.method))fail(405,'method');
   if(path==='/api/plants/weather'&&request.method==='GET')return await publicPlantWeather(request,env);
   if(path==='/api/plants/map'&&request.method==='GET')return await publicPlantMap(request,env);
   if(/^\/api\/plants\/stage-photo\/r(?:[1-9]|1[0-2])-p(?:[1-9]|1[0-9])$/.test(path)&&request.method==='GET')return await publicStagePhoto(request,env);
   const auth=await authRoutes(request,env,path);if(auth)return auth;
   if(path==='/api/resources'&&request.method==='GET'){
    const actor=await loadActor(request,env,{required:false}),headers=request.headers.get('Origin')==='https://theglenolia.com.au'?{'Access-Control-Allow-Origin':'https://theglenolia.com.au','Vary':'Origin'}:{};return json({resources:await listResources(env.EDU_DB,actor),stages:['ES1','S1','S2','S3','S4','S5','S6'],language:'en'},200,headers);
   }
   const resource=path.match(/^\/api\/resources\/([a-z0-9-]+)(?:\/(pdf|print))?$/);
   if(resource&&['GET','HEAD'].includes(request.method)){
    const actor=await loadActor(request,env,{required:false}),p=await getResource(env.EDU_DB,resource[1],actor,{version:url.searchParams.get('version')});
    if(resource[2]==='pdf'){const response=await pdfResponse(request,env,p,actor);return request.method==='HEAD'?new Response(null,{status:response.status,headers:response.headers}):response;}
    if(resource[2]==='print')return new Response(printablePage(p.title,printableResource(p)),{headers:{...SECURITY,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'"}});
    return json({resource:p});
   }
   const actor=await loadActor(request,env);if(request.method==='POST')requireCSRF(request,actor);const body=request.method==='POST'?await readBody(request,path==='/api/plants/organisation/logo'?420000:131072):null;
   if(path==='/api/teacher/preferences')return await preferencesRoute(request,env,actor,body);
   if(path.startsWith('/api/plants/')){
    await requireTeacherConsent(env.EDU_DB,actor.id);
    if(path==='/api/plants/class-library'||path.startsWith('/api/plants/class-library/'))return await classroomRoutes(request,env,path,actor,body);
    if(path==='/api/plants/workshops' && request.method==='GET') return json({workshops:plantWorkshopManifest});
    const workshop=path.match(/^\/api\/plants\/workshops\/([a-z0-9-]+)\.pdf$/);
    if(workshop && ['GET','HEAD'].includes(request.method)) return await servePlantWorkshop(request,env,workshop[1]);
    return await teacherPlantRoutes(request,env,path,actor,body);
   }
   return await workspaceRoutes(request,env,path,actor,body)||json({error:'not_found'},404);
  }
  if(!['GET','HEAD'].includes(request.method))return json({error:'method'},405);
  if(path==='/health')return json({service:'Glenolia education',ready:!!env.EDU_DB&&!!env.SESSION_KEY,language:'en'});
  const page=path==='/'||path==='/auth/verify'||/^\/resource\/[a-z0-9-]+\/?$/.test(path);
  const assetsRequest=page?new Request(new URL('/index.html',request.url),request):request;
  const response=await env.ASSETS.fetch(assetsRequest);const headers=new Headers(response.headers);
  for(const [k,v] of Object.entries(SECURITY))headers.set(k,v);headers.set('Content-Security-Policy',CSP);
  if(!page&&response.status===200&&/\.(?:webp|jpg|png|svg|woff2|css|js)$/.test(path))headers.set('Cache-Control','public, max-age=300');
  return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers});
 }catch(error){
  if(error instanceof EducationError)return json({error:error.code},error.status);
  if(/UNIQUE constraint|FOREIGN KEY constraint/i.test(error?.message||''))return json({error:'record_conflict'},409);
  console.warn('Education request failed',error?.name||'Error');return json({error:'service_temporarily_unavailable'},503);
 }
}
export async function purgeEducation(env,now=Date.now()){
 const db=env.EDU_DB,stamp=new Date(now).toISOString();
 const expired=await all(db.prepare("SELECT g.id,g.school_id FROM edu_groups g JOIN edu_schools s ON s.id=g.school_id WHERE g.status='closed' AND g.closed_at IS NOT NULL AND julianday(?) - julianday(g.closed_at) >= s.retention_days").bind(stamp));
 for(const g of expired)await db.batch([
  db.prepare('DELETE FROM edu_reports WHERE school_id=? AND group_id=?').bind(g.school_id,g.id),
  db.prepare('DELETE FROM edu_observations WHERE school_id=? AND group_id=?').bind(g.school_id,g.id),
  db.prepare('DELETE FROM edu_learners WHERE school_id=? AND group_id=?').bind(g.school_id,g.id)
 ]);
 await db.batch([db.prepare('DELETE FROM edu_sessions WHERE expires_at<? OR last_seen<?').bind(now,now-1800000),db.prepare('DELETE FROM edu_auth_tokens WHERE expires_at<?').bind(now-86400000),db.prepare("DELETE FROM edu_audit WHERE julianday(?) - julianday(created_at)>365").bind(stamp),db.prepare('DELETE FROM edu_rate_limits WHERE period<? AND key LIKE ?').bind(Math.floor(now/86400000)-7,'daily%')]);
 return {closedGroupsProcessed:expired.length};
}
export default {fetch:handleEducation,scheduled(controller,env,ctx){
 if(controller.cron==='15 14 * * *'){
  ctx.waitUntil(purgeEducation(env));
  ctx.waitUntil(prepareClassroomMonth(env.EDU_DB,new Date(controller.scheduledTime||Date.now())));
 }
 else ctx.waitUntil((async()=>{
  await releaseDueAdoptions(env.EDU_DB);
  await processPlantMail(env,controller.scheduledTime||Date.now());
 })());
}};
