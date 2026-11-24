import {secureEqual,readBody,emailValue,text,encode,digest,json,keys,dateValue,EducationError} from './education-common.mjs';
import {STAGE_NAMES} from '../public/assets/plant-portal/stages.js';
import {plantIllustration} from '../public/assets/plant-portal/plant-illustration.js';
import {TEACHER_MAIL_SENDER,TEACHER_LINK_VALID_MINUTES} from '../public/teachers/teacher-sign-in.js';

const origin='https://glenolia-education.theglenolia.workers.dev';
const logo='https://theglenolia.com.au/assets/email/logo-compact.png';
const help='info@theglenolia.com.au';
const office='1435 Old Northern Road, Glenorie NSW 2157';
const codeFormat=/^[0-9]{6}$/;
const secretFormat=/^[a-f0-9]{64}$/;
const dayFormat=new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'long',year:'numeric',timeZone:'Australia/Sydney'});
const monthFormat=new Intl.DateTimeFormat('en-AU',{month:'long',year:'numeric',timeZone:'Australia/Sydney'});

function button(label,href){
 return `<p style="margin:26px 0"><a href="${encode(href)}" style="background:#2F4A3C;color:#FFF;border-radius:5px;padding:14px 24px;text-decoration:none;display:inline-block;font-weight:600">${encode(label)}</a></p>`;
}
function frame(title,kicker,body,footer=''){
 return `<!doctype html><html lang="en-AU"><body style="margin:0;padding:24px 12px;background:#F5F1E8;color:#3B332D;font-family:Arial,sans-serif"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:590px;margin:auto;background:#fffdf8;border-top:5px solid #2F4A3C"><tr><td style="padding:28px"><img src="${logo}" width="200" alt="The Glenolia" style="display:block;max-width:65%;height:auto"><p style="color:#476451;letter-spacing:1.5px;font-size:12px;margin:30px 0 9px">${encode(kicker)}</p><h1 style="font:normal 32px/1.15 Georgia,serif;color:#2F4A3C;margin:0 0 22px">${encode(title)}</h1><div style="font-size:16px;line-height:1.6">${body}</div></td></tr><tr><td style="padding:20px 28px;background:#D9DFD0;color:#334137;font-size:13px;line-height:1.6">${footer}<p style="margin:8px 0 0">The Glenolia · ${office}<br><a style="color:#2F4A3C" href="mailto:${help}">${help}</a> · 1300 70 11 55</p></td></tr></table></body></html>`;
}
function signIn(body){
 keys(body,['email','name','token','code','origin']);
 const email=emailValue(body.email),name=text(body.name,80),code=body.code;
 if(!secretFormat.test(body.token)||code!==undefined && (typeof code!=='string'||!codeFormat.test(code)))throw Error('invalid');
 const link=origin+'/auth/verify#token='+body.token;
 const label=code?'Your teacher sign-in code':'Your teacher sign-in link';
 const copy=code?'Enter this code in the same browser where you asked to sign in. It expires in 15 minutes and works once.':'Open your sign-in link in this browser within 15 minutes.';
 const panel=code?`<p style="font:600 34px monospace;letter-spacing:6px;background:#F5F1E8;padding:14px 20px;color:#2F4A3C">${code}</p>`:'';
 const html=frame(label,'TEACHER WORKSPACE',`<p>Hello ${encode(name)},</p><p>${copy}</p>${panel}${code?`<p style="font-size:14px"><a style="color:#2F4A3C" href="${encode(link)}">Use the sign-in link instead</a></p>`:button('Sign in to your workspace',link)}`,'Your sign-in is private. If you did not request this message, you can ignore it.');
 return {email,name,identity:body.token,subject:'Your Glenolia teacher sign-in '+(code?'code':'link'),htmlContent:html,
  textContent:`Hello ${name},\n\n${label}${code?'\n'+code:''}\n${copy}\n\nSign-in link: ${link}\n\nIgnore this message if you did not request it.\nThe Glenolia · ${help}`};
}
function accessLink(body){
 keys(body,['email','purpose','token','origin']);
 const email=emailValue(body.email);
 if(!['setup','browser'].includes(body.purpose)||typeof body.token!=='string'||!secretFormat.test(body.token))throw Error('invalid');
 const setup=body.purpose==='setup';
 const title=setup?'Set up your Glenolia teacher password':'Confirm your browser for The Glenolia';
 const next=setup?'Verify your school email, then choose an eight-digit password. If you already use the portal, your school applications and journals stay with this email address.':'Confirm this browser, then enter your eight-digit password to finish signing in.';
 const expiry='This link is valid for '+TEACHER_LINK_VALID_MINUTES+' minutes. If you did not request it, you can ignore this email.';
 const link=origin+'/#teacher-access?token='+body.token;
 const label=setup?'Verify email and set password':'Confirm this browser';
 return {email,identity:'teacher-access:'+body.token,subject:title,
  htmlContent:frame(title,'TEACHER WORKSPACE','<p>'+next+'</p>'+button(label,link)+'<p>'+expiry+'</p>'),
  textContent:title+'\n\n'+next+'\n\n'+label+': '+link+'\n\n'+expiry};
}
function plantNumber(value){
 if(typeof value!=='string'||!/^P[1-9]\d{0,2}$/.test(value)||Number(value.slice(1))>228)throw Error('invalid');
 return value;
}
function stageValue(value){if(!STAGE_NAMES.includes(value))throw Error('invalid');return value;}
function specimenCard(plant,stage,detail){
 const n=Number(plant.slice(1))-1;
 const {file}=plantIllustration(STAGE_NAMES.indexOf(stage)+1,{row:Math.floor(n/19)+1,position:n%19+1});
 return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0;background:#F5F1E8"><tr><td width="86" align="center" style="padding:8px"><img alt="" width="64" height="72" src="https://theglenolia.com.au/assets/plant-portal/stages/${file}"></td><td style="padding:10px 14px 10px 0"><strong style="color:#2F4A3C">${plant} · ${encode(stage)}</strong><br><span style="font-size:14px">${encode(detail)}</span></td></tr></table>`;
}
function replyMessage(body){
 keys(body,['email','kind','jobId','origin','orgId','applicationId','threadId','plant','unsubscribePath']);
 const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
 if(![body.orgId,body.applicationId,body.threadId].every(id=>typeof id==='string'&&uuid.test(id)))throw Error('invalid');
 const identity=text(body.jobId,100),[kind,messageId,userId]=identity.split(':');
 if(kind!=='reply'||!uuid.test(messageId)||!uuid.test(userId)||identity!=='reply:'+messageId+':'+userId)throw Error('invalid');
 const stopPrefix='/email/stop/thread/'+body.threadId+'/'+userId+'/';
 if(typeof body.unsubscribePath!=='string'||!body.unsubscribePath.startsWith(stopPrefix)||!secretFormat.test(body.unsubscribePath.slice(stopPrefix.length)))throw Error('invalid');
 const email=emailValue(body.email),plant=plantNumber(body.plant);
 const unsubscribe=origin+body.unsubscribePath;
 const portal=origin+'/#plant?orgId='+body.orgId+'&applicationId='+body.applicationId+'&thread='+body.threadId;
 const title='The farmer replied about '+plant;
 const copy='There is a new reply in the conversation you follow about '+plant+'. Sign in to your school journal to read it or ask a follow-up question.';
 const footer='You followed this conversation in your plant journal. <a style="color:#2F4A3C" href="'+encode(unsubscribe)+'">Stop emails for this conversation</a>.';
 return {email,identity,subject:title+' · The Glenolia',unsubscribe,
  htmlContent:frame(title,'FROM THE FARMER','<p>'+copy+'</p>'+button('Read the reply',portal),footer),
  textContent:title+'\n\n'+copy+'\n\nRead the reply: '+portal+'\nStop emails for this conversation: '+unsubscribe+'\n\nThe Glenolia · '+office+' · '+help};
}
function plantMessage(body){
 if(body.kind==='reply')return replyMessage(body);
 const base=['email','kind','organisation','jobId','origin'];
 const kinds={invite:[],update:['plant','stage','observedOn','unsubscribePath','orgId','applicationId'],monthly:['plants','period','unsubscribePath','orgId']};
 if(!Object.hasOwn(kinds,body.kind))throw Error('invalid');
 keys(body,[...base,...kinds[body.kind]]);
 const email=emailValue(body.email),org=text(body.organisation,160),identity=text(body.jobId,170);
 if(!/^(invite|monthly|update):[a-zA-Z0-9:-]+$/.test(identity))throw Error('invalid');
 const preferences=origin+'/#plant-preferences';
 let portal=origin+'/#plant';
 if(body.kind!=='invite'){
  const validId=value=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
  if(!validId(body.orgId)||body.kind==='update'&&!validId(body.applicationId))throw Error('invalid');
  portal+='?orgId='+body.orgId+(body.kind==='update'?'&applicationId='+body.applicationId:'');
 }
 let title,kicker,bodyHtml,plain,cta,footer='',unsub='';
 if(body.kind==='invite'){
  title='You’re invited to the school plant journal';kicker='TEACHER INVITATION';
  plain=`${org} has invited you to follow its adopted coffee plants with other teachers. Sign in using this email address to review the invitation. Your own email preferences are yours to choose.`;
  bodyHtml='<p>'+encode(plain)+'</p>';cta='Review the invitation';
  footer='If this invitation was unexpected, you can leave it unanswered.';
 }else{
  const pref=body.kind==='update'?'immediate':'monthly';
  if(typeof body.unsubscribePath!=='string'||!new RegExp('^/email/stop/'+pref+'/[a-f0-9-]{36}/[a-f0-9]{64}$').test(body.unsubscribePath))throw Error('invalid');
  unsub=origin+body.unsubscribePath;
  footer=`You chose to receive ${pref==='monthly'?'monthly plant summaries':'farmer updates'} for your school. <a style="color:#2F4A3C" href="${encode(unsub)}">Stop these emails</a> · <a style="color:#2F4A3C" href="${preferences}">Email settings</a>`;
  if(body.kind==='update'){
   const plant=plantNumber(body.plant),stage=stageValue(body.stage),date=dayFormat.format(new Date(dateValue(body.observedOn)+'T12:00:00Z'));
   title='A new field note for '+plant;kicker='FROM THE FARMER';
   plain=`The farmer added an observation dated ${date} to ${org}’s journal for ${plant}. Current illustrated stage: ${stage}. Open the journal to see what changed, then compare it with the previous observation as a class.`;
   bodyHtml=`<p>The farmer added an observation for ${encode(org)}’s class plant.</p>${specimenCard(plant,stage,"Observed "+date)}<p>Open the journal and compare what you see with the previous field note.</p>`;cta='Read the field note';
  }else{
   if(typeof body.period!=='string'||!/^20\d{2}-(0[1-9]|1[0-2])$/.test(body.period)||!Array.isArray(body.plants)||body.plants.length<1||body.plants.length>3)throw Error('invalid');
   const month=monthFormat.format(new Date(body.period+'-15T12:00:00Z'));
   title=month+' in your plant journal';kicker='MONTHLY FIELD LETTER';
   const summaries=body.plants.map(p=>{
    keys(p,['plant','stage','updates']);
    if(!Number.isSafeInteger(p.updates)||p.updates<0)throw Error('invalid');
    return plantNumber(p.plant)+' · '+stageValue(p.stage)+' now · '+p.updates+' field '+(p.updates===1?'note':'notes')+' in '+month;
   });
   plain=org+'\n'+summaries.join('\n')+'\nClassroom prompt: choose one dated observation and describe the evidence you would collect next.';
   bodyHtml='<p>'+encode(org)+'</p>'+body.plants.map(p=>specimenCard(p.plant,p.stage,p.updates+' field '+(p.updates===1?'note':'notes')+' in '+month)).join('')+'<p>Classroom prompt · Choose one dated observation. What evidence would your class collect next?</p>';cta='Open the school journals';
  }
 }
 return {email,identity,subject:title+' · The Glenolia',unsubscribe:unsub,htmlContent:frame(title,kicker,bodyHtml+button(cta,portal),footer),
  textContent:title+'\n\n'+plain+'\n\n'+cta+': '+portal+(unsub?'\nStop these emails: '+unsub+'\nManage preferences: '+preferences:'')+'\n\nThe Glenolia · '+office+' · '+help};
}
export async function handleEducationMail(request,env,fetcher=globalThis.fetch){
 const path=new URL(request.url).pathname;
 if(!['/internal/education/sign-in','/internal/education/access-link','/internal/education/plant-message'].includes(path))return null;
 if(request.method!=='POST'||!env.EDUCATION_MAIL_SECRET||!secureEqual(request.headers.get('Authorization'),'Bearer '+env.EDUCATION_MAIL_SECRET))return json({error:'not_found'},404);
 if(!env.BREVO_API_KEY?.trim()||env.EDUCATION_ORIGIN!==origin)return json({error:'delivery_unavailable'},503);
 let message;
 try{
  const body=await readBody(request,path.endsWith('sign-in')?2048:4096);
  if(!body||body.origin!==origin)return json({error:'invalid'},400);
  message=path.endsWith('/access-link')?accessLink(body):path.endsWith('/sign-in')?signIn(body):plantMessage(body);
 }catch(error){return json({error:'invalid'},error instanceof EducationError&&error.status===413?413:400);}
 try{
  const headers={idempotencyKey:(await digest(message.identity)).slice(0,32)};
  if(message.unsubscribe){headers['List-Unsubscribe']='<'+message.unsubscribe+'>';headers['List-Unsubscribe-Post']='List-Unsubscribe=One-Click';}
  const response=await fetcher('https://api.brevo.com/v3/smtp/email',{method:'POST',redirect:'manual',
   headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({sender:{email:TEACHER_MAIL_SENDER,name:'The Glenolia'},to:[message.name?{email:message.email,name:message.name}:{email:message.email}],
    subject:message.subject,htmlContent:message.htmlContent,textContent:message.textContent,headers}),signal:AbortSignal.timeout(12000)});
  if(response.ok)return json({accepted:true});
  return json({error:'delivery_rejected'},path.endsWith('/plant-message')&&response.status===429?429:503);
 }catch{return json({error:'delivery_needs_review'},503);}
}
