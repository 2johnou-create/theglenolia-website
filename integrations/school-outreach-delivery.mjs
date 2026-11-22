import directory from './admin-ui/school-outreach-directory.json' with {type:'json'};
import {schoolInvitation, sender as replyEmail, singleSchoolAddress} from './school-outreach.mjs';
import {sydneyInstant} from './school-outreach-time.mjs';

export const fromEmail='info@theglenolia.com.au';
const endpoint='https://api.brevo.com/v3/smtp/email';
const uuid=/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/;
const ready=env=>Boolean(env.DB&&env.SENDING_READY==='true'&&env.BREVO_API_KEY);
const fetchDefault=(...args)=>globalThis.fetch(...args);
const fieldNames=new Set(['id','schoolId','recipient','subject','scheduledFor','permitted']);
const definitiveFailures=new Set([400,401,402,403,404,422,429]);
const get=(db,id)=>db.prepare('SELECT * FROM school_invitation_deliveries WHERE id=?').bind(id).first();
const dto=row=>({id:row.id,school:row.school_name,recipient:row.recipient,subject:row.subject,
  scheduledFor:row.scheduled_for,dueAt:row.due_at,updatedAt:row.updated_at,phase:row.phase,reason:row.reason});

async function deliver(env,id,fetcher,now){
  const db=env.DB;
  const claim=await db.prepare("UPDATE school_invitation_deliveries SET phase='sending', updated_at=?, attempts=attempts+1 WHERE id=? AND phase='queued' AND due_at<=?")
    .bind(now,id,now).run();
  if(!claim.meta.changes)return;
  const item=await get(db,id);
  let phase='needs_review', reason='unconfirmed_provider_response', messageId=null;
  try{
    const response=await fetcher(endpoint,{
      method:'POST',redirect:'manual',signal:AbortSignal.timeout(12000),
      headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({
        sender:{email:fromEmail,name:'The Glenolia'},
        replyTo:{email:replyEmail,name:'John Ou'},
        to:[{email:item.recipient}],subject:item.subject,htmlContent:item.html_content,textContent:item.text_content,
        headers:{idempotencyKey:item.id},tags:['school-plant-invitation','school-invite-'+item.id]
      })
    });
    const data=await response.json().catch(()=>({}));
    if(response.ok&&typeof data.messageId==='string'&&data.messageId){
      phase='accepted'; reason=null; messageId=data.messageId;
    }else if(response.status===400&&data.code==='duplicate_parameter'&&/idempotency/i.test(data.message||'')){
      phase='accepted'; reason=null;
    }else if(definitiveFailures.has(response.status)){
      phase=response.status===429&&item.attempts<3?'queued':'failed';
      reason=response.status===429?'rate_limited':'provider_rejected';
    }
  }catch{
    // Delivery is ambiguous after a timeout or disconnect. Preserve the record for review.
  }
  if(phase==='queued'){
    await db.prepare("UPDATE school_invitation_deliveries SET phase='queued',due_at=?,reason=?,updated_at=? WHERE id=? AND phase='sending'")
      .bind(now+5*60000,reason,Date.now(),id).run();
  }else{
    await db.prepare("UPDATE school_invitation_deliveries SET phase=?,message_id=?,reason=?,updated_at=? WHERE id=? AND phase='sending'")
      .bind(phase,messageId,reason,Date.now(),id).run();
  }
}
export async function runSchoolInvitations(env,fetcher=fetchDefault,now=Date.now()){
  if(!ready(env))return;
  const db=env.DB;
  await db.prepare("UPDATE school_invitation_deliveries SET phase='needs_review',reason='unconfirmed_provider_response',updated_at=? WHERE phase='sending' AND updated_at<?")
    .bind(now,now-2*60000).run();
  const {results}=await db.prepare("SELECT id FROM school_invitation_deliveries WHERE phase='queued' AND due_at<=? ORDER BY due_at,id LIMIT 10")
    .bind(now).all();
  const outcomes=await Promise.allSettled(results.map(row=>deliver(env,row.id,fetcher,now)));
  if(outcomes.some(result=>result.status==='rejected'))throw Error('school_invitation_queue_error');
}
function sameDelivery(row,requested){
  return row.school_id===requested.schoolId&&row.recipient===requested.recipient&&row.subject===requested.subject&&row.scheduled_for===requested.scheduledFor;
}
export async function schoolDeliveryRequest(env,method,action,body,json,fetcher=fetchDefault,now=Date.now()){
  const db=env.DB;
  if(!db)return json(503,{error:'delivery_unavailable'});
  if(action==='list'&&method==='GET'){
    const {results}=await db.prepare(`SELECT id,school_name,recipient,subject,scheduled_for,due_at,phase,updated_at,reason
      FROM school_invitation_deliveries ORDER BY phase IN ('queued','sending') DESC,
      CASE WHEN phase IN ('queued','sending') THEN due_at END,updated_at DESC LIMIT 100`).all();
    return json(200,{ready:ready(env),from:fromEmail,replyTo:replyEmail,deliveries:results.map(dto)});
  }
  if(method!=='POST')return json(405,{error:'method'});
  if(action==='cancel'){
    if(!body||Object.keys(body).length!==1||typeof body.id!=='string'||!uuid.test(body.id))return json(400,{error:'invalid_delivery'});
    await db.prepare("UPDATE school_invitation_deliveries SET phase='cancelled',updated_at=? WHERE id=? AND phase='queued'").bind(now,body.id).run();
    const cancelled=await get(db,body.id);
    if(cancelled?.phase==='cancelled')return json(200,{delivery:dto(cancelled)});
    return json(cancelled?409:404,{error:cancelled?'cannot_cancel':'not_found'});
  }
  if(!ready(env))return json(503,{error:'delivery_unavailable'});
  if(!body||Array.isArray(body)||Object.keys(body).some(key=>!fieldNames.has(key)))return json(400,{error:'invalid_delivery'});
  if(body.permitted!==true)return json(400,{error:'permission_required'});
  const school=directory.schools.find(row=>row.id===body.schoolId);
  const subject=typeof body.subject==='string'?body.subject.trim():'';
  const recipient=typeof body.recipient==='string'?body.recipient.trim().toLowerCase():'';
  if(!school||typeof body.id!=='string'||!uuid.test(body.id)||!singleSchoolAddress(recipient)||!subject||subject.length>180||/[\x00-\x1f\x7f]/.test(body.subject))
    return json(400,{error:'invalid_delivery'});
  const scheduledFor=body.scheduledFor;
  let row=await get(db,body.id);
  const request={schoolId:school.id,recipient,subject,scheduledFor};
  if(row){
    if(!sameDelivery(row,request))return json(409,{error:'request_changed'});
    return json(200,{delivery:dto(row)});
  }
  const due=scheduledFor===null?now:sydneyInstant(scheduledFor);
  if(due===null||scheduledFor!==null&&due<=now)return json(400,{error:'invalid_sydney_time'});
  const draft=schoolInvitation(school,subject);
  const inserted=await db.prepare(`INSERT OR IGNORE INTO school_invitation_deliveries
    (id,school_id,school_name,recipient,subject,html_content,text_content,scheduled_for,due_at,phase,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,'queued',?,?)`)
    .bind(body.id,school.id,school.name,recipient,subject,draft.html,draft.body,scheduledFor,due,now,now).run();
  if(!inserted.meta.changes){
    row=await get(db,body.id);
    if(row&&sameDelivery(row,request))return json(200,{delivery:dto(row)});
    return json(409,{error:row?'request_changed':'delivery_exists'});
  }
  if(scheduledFor===null)await deliver(env,body.id,fetcher,now);
  return json(201,{delivery:dto(await get(db,body.id))});
}
