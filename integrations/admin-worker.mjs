import programmeSeed from '../programme-content.json' with {type:'json'};
import {fetchProgramme,saveProgramme,publishProgramme} from './programme-store.mjs';
import seeds from './editions.json' with {type:'json'};
import {languages,renderEmail,monthEndSchedule} from './email-render.mjs';
import {html,css,js,programmeJs} from './admin-assets.mjs';
import {runOwnerNotifications} from './owner-notifications.mjs';
const localeKeys={'en-AU':'EN','zh-Hant':'ZH',ja:'JA'};
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8'}});
const validId=id=>/^20\d{2}-(0[1-9]|1[0-2])$/.test(id);
const positive=value=>Number.isSafeInteger(Number(value))&&Number(value)>0;
const string=(s,n)=>typeof s==='string'&&s.trim().length>0&&s.length<=n;
export function validateEdition(e){
 if(!e||!validId(e.id)||e.scheduledAt!==monthEndSchedule(e.id)||!['shoot','workshop','basket'].includes(e.image)||!['coffee','partners'].includes(e.cta)||!e.locales||Object.keys(e.locales).length!==3)return false;
 return languages.every(l=>{const c=e.locales[l];return c&&string(c.subject,150)&&string(c.preview,220)&&string(c.kicker,80)&&string(c.title,160)&&string(c.intro,2000)&&string(c.cta,100)&&string(c.closing,2000)&&Array.isArray(c.sections)&&c.sections.length===2&&c.sections.every(s=>string(s.title,160)&&string(s.body,2000));});
}
const runtimeFetch=(...args)=>globalThis.fetch(...args);
async function brevo(env,path,options={},fetcher=runtimeFetch){
 const response=await fetcher('https://api.brevo.com/v3'+path,{...options,redirect:'manual',headers:{'api-key':env.BREVO_API_KEY,Accept:'application/json','Content-Type':'application/json'},signal:AbortSignal.timeout(15000)});
 if(!response.ok){console.warn('Glenolia email provider returned HTTP',response.status);throw new Error('provider');}
 return response.status===204?{}:response.json();
}
async function getEdition(env,id){
 const row=await env.DB.prepare('SELECT payload, revision FROM editions WHERE id = ?').bind(id).first();
 return row?{edition:JSON.parse(row.payload),revision:row.revision}:{edition:structuredClone(seeds.find(e=>e.id===id)),revision:0};
}
async function phases(env,id){return (await env.DB.prepare('SELECT language, brevo_id, phase FROM campaigns WHERE edition_id = ?').bind(id).all()).results;}
async function readJson(request){
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return null;
 const reader=request.body?.getReader();if(!reader)return null;let size=0,parts=[];
 try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>40000){await reader.cancel();return null;}parts.push(value);}const data=new Uint8Array(size);let offset=0;for(const p of parts){data.set(p,offset);offset+=p.byteLength;}return JSON.parse(new TextDecoder().decode(data));}catch{return null;}
}
export async function scheduleEdition(env,id,saved,fetcher=runtimeFetch,{background=false}={}){
  if(env.SENDING_READY!=='true'||!positive(env.BREVO_SENDER_ID)||languages.some(l=>!positive(env['BREVO_LIST_'+localeKeys[l]])))return json(503,{error:'sending_not_ready'});
  if(new Date(saved.edition.scheduledAt).getTime()<Date.now()+(background?60000:300000))return json(400,{error:'schedule_in_past'});
  const maximum=Number(env.MAX_RECIPIENTS||250);if(!positive(maximum)||maximum>10000)return json(503,{error:'sending_not_ready'});
  // Refuse audiences that exceed the configured send allowance or contain contacts
  // without recorded consent/language. The four lists are dedicated to this DOI flow.
  let total=0;const seen=new Set(),eligibleByLanguage={};
  for(const language of languages){
   const list=Number(env['BREVO_LIST_'+localeKeys[language]]);
   const audience=await brevo(env,`/contacts/lists/${list}/contacts?limit=500&offset=0`,{},fetcher);
   if(Number(audience.count)>500)return json(409,{error:'audience_limit'});
   eligibleByLanguage[language]=0;
   for(const c of audience.contacts||[]){if(c.emailBlacklisted)continue;if(c.attributes?.LANGUAGE!==language||c.attributes?.CONSENT_VERSION!=='2026-10-12-v1'||!c.attributes?.CONSENT_AT||seen.has(c.email.toLowerCase()))return json(409,{error:'audience_needs_review'});seen.add(c.email.toLowerCase());total++;eligibleByLanguage[language]++;}
  }
  if(total>maximum)return json(409,{error:'audience_limit'});
  const statuses=await phases(env,id);
  if(statuses.some(c=>!['scheduled','awaiting_audience'].includes(c.phase)))return json(409,{error:'provider_needs_review'});
  for(const language of languages){
   if(statuses.some(c=>c.language===language&&c.phase==='scheduled'))continue;
   const now=new Date().toISOString(),pending=statuses.find(c=>c.language===language&&c.phase==='awaiting_audience');
   if(!eligibleByLanguage[language]){
    if(!pending)await env.DB.prepare("INSERT OR IGNORE INTO campaigns (edition_id,language,phase,updated_at) VALUES (?,?,'awaiting_audience',?)").bind(id,language,now).run();
    continue;
   }
   const lock=pending?await env.DB.prepare("UPDATE campaigns SET phase='creating',updated_at=? WHERE edition_id=? AND language=? AND phase='awaiting_audience'").bind(now,id,language).run():await env.DB.prepare("INSERT OR IGNORE INTO campaigns (edition_id,language,phase,updated_at) SELECT ?,?,'creating',? WHERE NOT EXISTS (SELECT 1 FROM editions WHERE id=? AND revision<>?)").bind(id,language,now,id,saved.revision).run();
   if(!lock.meta.changes)return json(409,{error:'already_scheduling'});
   let result;
   try{
    const c=saved.edition.locales[language];
    result=await brevo(env,'/emailCampaigns',{method:'POST',body:JSON.stringify({name:`THE GLENOLIA ${id} ${language}`,sender:{id:Number(env.BREVO_SENDER_ID)},subject:c.subject,previewText:c.preview,htmlContent:renderEmail(saved.edition,language),recipients:{listIds:[Number(env['BREVO_LIST_'+localeKeys[language]])]},replyTo:'info@theglenolia.com.au',scheduledAt:saved.edition.scheduledAt,mirrorActive:false})},fetcher);
    if(!positive(result.id))throw new Error('provider');
    // Retain the provider ID before verification, so a network interruption can
    // be reconciled in Brevo without creating another campaign.
    await env.DB.prepare("UPDATE campaigns SET brevo_id=?,updated_at=? WHERE edition_id=? AND language=?").bind(result.id,new Date().toISOString(),id,language).run();
    let check=await brevo(env,`/emailCampaigns/${result.id}?excludeHtmlContent=true`,{},fetcher);
    const exact=()=>new Date(check.scheduledAt).getTime()===new Date(saved.edition.scheduledAt).getTime()&&check.sendAtBestTime!==true&&check.recipients?.lists?.length===1&&Number(check.recipients.lists[0])===Number(env['BREVO_LIST_'+localeKeys[language]]);
    if(!exact())throw new Error('provider');
    if(check.status==='draft'){
     await brevo(env,`/emailCampaigns/${result.id}/status`,{method:'PUT',body:JSON.stringify({status:'queued'})},fetcher);
     check=await brevo(env,`/emailCampaigns/${result.id}?excludeHtmlContent=true`,{},fetcher);
    }
    if(check.status!=='queued'||!exact())throw new Error('provider');
   }catch{
    await env.DB.prepare("UPDATE campaigns SET phase='needs_review',updated_at=? WHERE edition_id=? AND language=?").bind(new Date().toISOString(),id,language).run();
    // An unknown provider outcome is never blindly retried: it could send twice.
    return json(502,{error:'provider_needs_review'});
   }
   await env.DB.prepare("UPDATE campaigns SET brevo_id=?,phase='scheduled',updated_at=? WHERE edition_id=? AND language=?").bind(result.id,new Date().toISOString(),id,language).run();
  }
  return json(200,{status:'scheduled',scheduledAt:saved.edition.scheduledAt,campaigns:await phases(env,id)});
}
export async function handleAdmin(request,env,ctx,fetcher=runtimeFetch){
 // Runtime-provided Access identity; never trust caller-supplied email/JWT headers.
 if(!env.ACCESS_AUD||!ctx?.access||ctx.access.aud!==env.ACCESS_AUD)return json(403,{error:'access_required'});
 let identity;try{identity=await ctx.access.getIdentity();}catch{return json(403,{error:'access_required'});}
 const configuredOwner=env.ADMIN_EMAIL,identityEmail=identity?.email;
 if(typeof configuredOwner!=='string'||!configuredOwner.trim()||typeof identityEmail!=='string'||!identityEmail.trim()||identityEmail.toLowerCase()!==configuredOwner.toLowerCase())return json(403,{error:'owner_required'});
 const url=new URL(request.url),path=url.pathname;
 if(request.method==='POST'&&request.headers.get('Origin')!==url.origin)return json(403,{error:'origin'});
 if(!['GET','POST'].includes(request.method))return json(405,{error:'method'});
 const csp="default-src 'none'; script-src 'self'; style-src 'self'; img-src https://theglenolia.com.au; font-src https://theglenolia.com.au; connect-src 'self'; frame-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
 if(request.method==='GET'&&['/','/admin.css','/admin.js','/programme-admin.js'].includes(path))return new Response(path==='/'?html:path==='/admin.css'?css:path==='/programme-admin.js'?programmeJs:js,{headers:{...headers,'Content-Type':path==='/'?'text/html; charset=utf-8':path==='/admin.css'?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Content-Security-Policy':csp}});
 if(path==='/api/session'&&request.method==='GET')return json(200,{email:identity.email,sendingReady:env.SENDING_READY==='true',ownerNotificationsEnabled:env.OWNER_NOTIFICATIONS_ENABLED==='true'});
 if(['/api/programme','/api/programme/save','/api/programme/publish'].includes(path)){
  if(!env.DB)return json(503,{error:'programme_unavailable'});
  try{
   const options={actor:identity.email,initial:programmeSeed.initial};
   if(path==='/api/programme'&&request.method==='GET')return json(200,await fetchProgramme(env.DB,programmeSeed.initial));
   const body=await readJson(request);if(!body)return json(400,{error:'invalid'});
   if(path==='/api/programme/save'&&request.method==='POST')return json(200,await saveProgramme(env.DB,body,options));
   if(path==='/api/programme/publish'&&request.method==='POST')return json(200,await publishProgramme(env.DB,{...options,expectedRevision:body.expectedRevision}));
   return json(405,{error:'method'});
  }catch(error){return json(error.status||503,{error:error.code||'programme_unavailable'});}
 }
 if(!env.BREVO_API_KEY||!env.DB||!positive(env.BREVO_LIST_ID))return json(503,{error:'not_connected'});
 try{
  if(path==='/api/subscribers'&&request.method==='GET'){
   const offset=Number(url.searchParams.get('offset')||0);
   if(!Number.isSafeInteger(offset)||offset<0||offset>100000)return json(400,{error:'offset'});
   const result=await brevo(env,`/contacts/lists/${Number(env.BREVO_LIST_ID)}/contacts?limit=50&offset=${offset}&sort=desc`,{},fetcher);
   const notifications=env.OWNER_NOTIFICATIONS_ENABLED==='true'?{enabled:true,owner:env.ADMIN_EMAIL,review:Number((await env.DB.prepare("SELECT COUNT(*) AS count FROM owner_notifications WHERE phase='needs_review'").first()).count)}:{enabled:false};
   return json(200,{count:result.count,offset,notifications,contacts:(result.contacts||[]).map(c=>({email:c.email,firstName:c.attributes?.FIRSTNAME||'',language:c.attributes?.LANGUAGE||'',interests:c.attributes?.INTERESTS||'',consentAt:c.attributes?.CONSENT_AT||'',status:c.emailBlacklisted?'Unsubscribed':c.attributes?.CONSENT_VERSION==='2026-10-12-v1'?'Subscribed':'Review consent'}))});
  }
  if(path==='/api/editions'&&request.method==='GET'){
   const rows=(await env.DB.prepare('SELECT id FROM editions').all()).results;
   const ids=[...new Set([...seeds.map(e=>e.id),...rows.map(e=>e.id)])].sort();
   const editions=[];for(const id of ids){const item=await getEdition(env,id);editions.push({...item,campaigns:await phases(env,id)});}
   return json(200,{editions});
  }
  const route=path.match(/^\/api\/(editions|preview)\/(20\d{2}-(?:0[1-9]|1[0-2]))(?:\/(save|schedule))?$/);
  if(!route)return json(404,{error:'not_found'});
  const [,kind,id,action]=route;
  const saved=await getEdition(env,id);
  if(kind==='preview'&&request.method==='GET'&&!action){
   const language=url.searchParams.get('language')||'en-AU';if(!saved.edition||!languages.includes(language))return json(404,{error:'not_found'});
   return new Response(renderEmail(saved.edition,language,{preview:true}),{headers:{...headers,'X-Frame-Options':'SAMEORIGIN','Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; img-src https://theglenolia.com.au; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'"}});
  }
  if(kind!=='editions'||request.method!=='POST')return json(404,{error:'not_found'});
  const body=await readJson(request);if(!body)return json(400,{error:'invalid'});
  if(action==='save'){
   if(!validateEdition(body.edition)||body.edition.id!==id||!Number.isSafeInteger(body.revision))return json(400,{error:'invalid'});
   if((await phases(env,id)).length)return json(409,{error:'already_scheduled'});
   const now=new Date().toISOString();
   const result=body.revision===0?await env.DB.prepare('INSERT OR IGNORE INTO editions (id,payload,revision,updated_at) SELECT ?,?,1,? WHERE NOT EXISTS (SELECT 1 FROM campaigns WHERE edition_id=?)').bind(id,JSON.stringify(body.edition),now,id).run():await env.DB.prepare('UPDATE editions SET payload=?, revision=revision+1, updated_at=? WHERE id=? AND revision=? AND NOT EXISTS (SELECT 1 FROM campaigns WHERE edition_id=?)').bind(JSON.stringify(body.edition),now,id,body.revision,id).run();
   return result.meta.changes?json(200,{revision:body.revision+1}):json(409,{error:'changed_elsewhere'});
  }
  if(action!=='schedule'||!saved.edition||body.revision!==saved.revision)return json(409,{error:'changed_elsewhere'});
  return scheduleEdition(env,id,saved,fetcher);
 }catch(error){console.warn('Glenolia admin request failed',error?.name||'Error');return json(502,{error:'service_unavailable'});}
}
export async function runScheduler(env,fetcher=runtimeFetch,now=Date.now()){
 // Only an owner's explicit scheduling action creates campaign rows. Seed drafts
 // are never enrolled by the timer. Unknown provider outcomes stay locked.
 const ids=(await env.DB.prepare('SELECT DISTINCT edition_id FROM campaigns').all()).results;
 const results=[];
 for(const {edition_id:id} of ids){
  const saved=await getEdition(env,id);if(!saved.edition)continue;
  const current=await phases(env,id),due=new Date(saved.edition.scheduledAt).getTime();
  if(due<=now){
   await env.DB.prepare("UPDATE campaigns SET phase='no_audience',updated_at=? WHERE edition_id=? AND phase='awaiting_audience'").bind(new Date(now).toISOString(),id).run();
   continue;
  }
  if(current.some(c=>!['scheduled','awaiting_audience'].includes(c.phase)))continue;
  let result;try{result=await scheduleEdition(env,id,saved,fetcher,{background:true});}catch{results.push({edition:id,status:502,error:'provider_unavailable'});continue;}
  const data=await result.json();
  if(['audience_limit','audience_needs_review'].includes(data.error)){
   // Stop an already queued campaign if later list growth or consent changes
   // make the owner's configured allowance unsafe. Resuming requires review.
   for(const c of current.filter(c=>c.phase==='scheduled')){
    try{const remote=await brevo(env,`/emailCampaigns/${c.brevo_id}?excludeHtmlContent=true`,{},fetcher);
     if(remote.status==='queued')await brevo(env,`/emailCampaigns/${c.brevo_id}/status`,{method:'PUT',body:JSON.stringify({status:'suspended'})},fetcher);
     await env.DB.prepare("UPDATE campaigns SET phase='paused_review',updated_at=? WHERE edition_id=? AND language=?").bind(new Date(now).toISOString(),id,c.language).run();
    }catch{await env.DB.prepare("UPDATE campaigns SET phase='needs_review',updated_at=? WHERE edition_id=? AND language=?").bind(new Date(now).toISOString(),id,c.language).run();}
   }
  }
  results.push({edition:id,status:result.status,error:data.error||null});
 }
 return results;
}
export default {fetch(request,env,ctx){return handleAdmin(request,env,ctx);},scheduled(controller,env,ctx){
 ctx.waitUntil(Promise.allSettled([
  runScheduler(env).then(results=>console.log('Glenolia schedule check',JSON.stringify(results))),
  runOwnerNotifications(env).then(result=>console.log('Glenolia owner notification check',JSON.stringify(result)))
 ]).then(results=>{for(const r of results)if(r.status==='rejected')console.warn('Glenolia background check failed');}));
}};
