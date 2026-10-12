const endpoint='https://api.brevo.com/v3';
const labels={'en-AU':'English','zh-Hant':'Traditional Chinese',ja:'Japanese'};
const interests={opening:'Opening news',coffee:'Coffee growing',workshops:'Workshops',local:'Local community'};
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ready=env=>env.OWNER_NOTIFICATIONS_ENABLED==='true'&&env.SENDING_READY==='true'&&env.ADMIN_EMAIL==='john@theglenolia.com.au'&&env.BREVO_API_KEY&&env.DB&&Number.isSafeInteger(Number(env.BREVO_LIST_ID))&&Number(env.BREVO_LIST_ID)>0;
const eligible=c=>typeof c.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)&&!c.emailBlacklisted&&Object.hasOwn(labels,c.attributes?.LANGUAGE)&&c.attributes?.CONSENT_VERSION==='2026-10-12-v1'&&Number.isFinite(Date.parse(c.attributes?.CONSENT_AT));
async function keyFor(email){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(email.trim().toLowerCase()));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');}
export function renderOwnerNotification(contact){
 const a=contact.attributes||{},language=labels[a.LANGUAGE]||a.LANGUAGE||'Not supplied';
 const selected=String(a.INTERESTS||'').split(',').filter(Boolean).map(i=>interests[i]||i).join(', ')||'Not supplied';
 const rows=[['Email',contact.email],['Name',a.FIRSTNAME||'Not supplied'],['Language',language],['Interests',selected]];
 const textContent='A new person has confirmed their newsletter subscription on The Glenolia website.\n\n'+rows.map(([label,value])=>label+': '+value).join('\n')+'\n\nView subscribers: https://theglenolia.com.au/admin/\n\nThis is a private owner notification. Replying to this email does not contact the subscriber.';
 const htmlContent=`<!doctype html><html lang="en-AU"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#F5F1E8;color:#3B332D;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 12px"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:auto"><tr><td style="padding:24px 20px"><img src="https://theglenolia.com.au/assets/email/logo-compact.png" alt="THE GLENOLIA" width="190" style="max-width:100%;height:auto"><p style="color:#2F4A3C;font-size:12px;letter-spacing:2px;margin-top:32px">OUR GROWING COMMUNITY</p><h1 style="font-family:Georgia,serif;font-weight:400;font-size:30px;line-height:1.2;color:#2F4A3C">A new subscriber.</h1><p style="font-size:16px;line-height:1.6">A new person has confirmed their newsletter subscription on The Glenolia website.</p></td></tr><tr><td style="padding:20px;background:#D9DFD0">${rows.map(([label,value])=>`<p style="margin:0 0 16px;font-size:15px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word"><strong>${escape(label)}</strong><br>${escape(value)}</p>`).join('')}</td></tr><tr><td style="padding:28px 20px"><a href="https://theglenolia.com.au/admin/" style="display:inline-block;padding:14px 22px;background:#2F4A3C;color:#F5F1E8;text-decoration:none;font-size:15px">View subscribers ↗</a><p style="font-size:12px;line-height:1.6;margin-top:24px">This is a private owner notification. Replying to this email does not contact the subscriber.</p></td></tr></table></td></tr></table></body></html>`;
 return {subject:'The Glenolia · New confirmed newsletter subscriber',htmlContent,textContent};
}
async function contacts(env,fetcher){
 const found=new Map();let offset=0,count;
 do{
  const response=await fetcher(`${endpoint}/contacts/lists/${Number(env.BREVO_LIST_ID)}/contacts?limit=500&offset=${offset}&sort=asc`,{redirect:'manual',headers:{'api-key':env.BREVO_API_KEY,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('notification_audience_unavailable');
  const data=await response.json();count=Number(data.count);
  if(!Number.isSafeInteger(count)||count<0||count>10000||!Array.isArray(data.contacts))throw Error('notification_audience_invalid');
  for(const c of data.contacts)if(eligible(c))found.set(c.email.trim().toLowerCase(),c);
  offset+=data.contacts.length;
  if(!data.contacts.length&&offset<count)throw Error('notification_audience_incomplete');
 }while(offset<count);
 return [...found.values()];
}
export async function runOwnerNotifications(env,fetcher=(...args)=>globalThis.fetch(...args),now=Date.now(),{baseline=false}={}){
 if(!ready(env))return {enabled:false};
 const summary={enabled:true,baseline:0,attempted:0,accepted:0,waiting:0,review:0},audience=await contacts(env,fetcher);
 for(const contact of audience){
  const key=await keyFor(contact.email),id=crypto.randomUUID(),iso=new Date(now).toISOString();
  const inserted=await env.DB.prepare('INSERT OR IGNORE INTO owner_notifications (subscriber_key,phase,request_id,detected_at) VALUES (?,?,?,?)').bind(key,baseline?'baseline':'pending',id,iso).run();
  if(baseline){summary.baseline+=inserted.meta.changes;continue;}
  const row=await env.DB.prepare('SELECT * FROM owner_notifications WHERE subscriber_key=?').bind(key).first();
  if(['sent','baseline','needs_review'].includes(row.phase)){if(row.phase==='needs_review')summary.review++;continue;}
  if(summary.attempted>=20){summary.waiting++;continue;}
  // The provider's duplicate key expires. Reconcile uncertain results rather
  // than risk sending the owner a second message after that protection expires.
  if(row.first_attempt_at!==null&&now-row.first_attempt_at>=10*60*1000&&row.phase==='sending'){
   await env.DB.prepare("UPDATE owner_notifications SET phase='needs_review',reason='uncertain_send' WHERE subscriber_key=? AND phase='sending'").bind(key).run();summary.review++;continue;
  }
  const lock=await env.DB.prepare("UPDATE owner_notifications SET phase='sending',first_attempt_at=COALESCE(first_attempt_at,?),last_attempt_at=? WHERE subscriber_key=? AND (phase='pending' OR (phase='sending' AND last_attempt_at<?))").bind(now,now,key,now-60000).run();
  if(!lock.meta.changes){summary.waiting++;continue;}
  summary.attempted++;
  try{
   const response=await fetcher(endpoint+'/smtp/email',{method:'POST',redirect:'manual',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({sender:{email:'info@theglenolia.com.au',name:'The Glenolia'},to:[{email:env.ADMIN_EMAIL,name:'John Ou'}],...renderOwnerNotification(contact),headers:{idempotencyKey:row.request_id}}),signal:AbortSignal.timeout(15000)});
   const data=await response.json().catch(()=>({}));
   if(response.ok&&typeof data.messageId==='string'&&data.messageId.length>0){
    await env.DB.prepare("UPDATE owner_notifications SET phase='sent',message_id=?,reason=NULL WHERE subscriber_key=?").bind(data.messageId,key).run();summary.accepted++;
   }else if(response.status===400&&data.code==='duplicate_parameter'&&/idempotency/i.test(data.message||'')){
    await env.DB.prepare("UPDATE owner_notifications SET phase='sent',reason='provider_duplicate_prevented' WHERE subscriber_key=?").bind(key).run();summary.accepted++;
   }else if([400,401,402,403,429].includes(response.status)){
    // An explicit rejection did not accept the email. Retry on a later scan;
    // quota/auth failures do not block confirmations or monthly campaign checks.
    await env.DB.prepare("UPDATE owner_notifications SET phase='pending',first_attempt_at=NULL,reason=? WHERE subscriber_key=?").bind('provider_http_'+response.status,key).run();summary.waiting++;break;
   }else{summary.waiting++;}
  }catch{summary.waiting++;}
 }
 return summary;
}
