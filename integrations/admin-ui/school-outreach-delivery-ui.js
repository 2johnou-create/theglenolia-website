import {singleSchoolAddress} from '../school-outreach.mjs';
import {sydneyInstant,sydneyDateTime} from '../school-outreach-time.mjs';

const route='/school-outreach/delivery';
const errors={
  delivery_unavailable:'Direct delivery is temporarily unavailable. The invitation can still be opened in Gmail.',
  request_changed:'This confirmation has already been used for a different invitation. Go back and review again.',
  delivery_exists:'This school address already has a pending invitation. Check Delivery history.',
  invalid_delivery:'Check the school, recipient and subject.',
  permission_required:'Confirm the school asked for or agreed to the invitation.',
  invalid_sydney_time:'Choose a future Sydney date and time. At daylight saving changes, choose a time outside the missing or repeated hour.',
  cannot_cancel:'This invitation has already moved to delivery. Refresh the history to check its status.'
};
const phaseText={
  queued:'Scheduled',sending:'Sending',accepted:'Accepted by Brevo',failed:'Send failed',
  needs_review:'Delivery needs review',cancelled:'Cancelled'
};
function element(tag,text,cls){
  const node=document.createElement(tag);
  if(text!==undefined)node.textContent=text;
  if(cls)node.className=cls;
  return node;
}
async function request(path,body){
  const response=await fetch(route+path,body===undefined?{cache:'no-store'}:{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)
  });
  const result=await response.json().catch(()=>null);
  if(!response.ok||!result)throw Error(errors[result?.error]||'The request could not be confirmed. Check Delivery history before trying again.');
  return result;
}
function outcome(item){
  if(item.phase==='queued'){
    const time=sydneyDateTime(item.dueAt);
    return item.reason==='rate_limited'?'Brevo asked us to try again. The next attempt is at '+time+'.':'Scheduled for '+time+'.';
  }
  if(item.phase==='failed')return 'Brevo rejected the send. Check your Brevo account before sending again.';
  if(item.phase==='needs_review')return 'Brevo acceptance could not be confirmed. Check Brevo before sending again.';
  return ({
    sending:'Delivery is being processed.',
    accepted:'Brevo accepted the email for delivery.',
    cancelled:'The scheduled send was cancelled.'
  })[item.phase];
}
export function installInvitationDelivery(readDraft){
  const $=id=>document.getElementById(id);
  const dialog=$('delivery-review'),permission=$('confirm-permission'),confirm=$('confirm-delivery'),back=$('close-review');
  const reviewStatus=$('review-status'),sendNotice=$('send-notice'),list=$('delivery-list'),listStatus=$('delivery-list-status');
  const when=$('send-at'),reviewNow=$('review-now'),reviewSchedule=$('review-schedule'),refreshButton=$('refresh-deliveries');
  let snapshot=null,busy=false,loadSerial=0;
  function saveFailure(error){sendNotice.textContent=error.message;}
  function renderDeliveries(items){
    list.replaceChildren();
    listStatus.textContent=items.length?'':'No invitations have been sent or scheduled.';
    for(const item of items){
      const row=element('li'),description=element('div'),flag=element('span',phaseText[item.phase],'delivery-phase');
      flag.dataset.phase=item.phase;
      description.append(element('strong',item.school),element('p',item.recipient+' · '+item.subject,'quiet'));
      if(item.scheduledFor&&(item.phase!=='queued'||item.reason==='rate_limited'))description.append(element('p','Scheduled for '+sydneyDateTime(sydneyInstant(item.scheduledFor)),'quiet'));
      description.append(element('p',outcome(item),'quiet'));
      const actions=element('div',undefined,'actions');actions.append(flag);
      if(item.phase==='queued'){
        const cancel=element('button','Cancel send','button');cancel.type='button';
        cancel.setAttribute('aria-label','Cancel send to '+item.school+' at '+item.recipient);
        cancel.addEventListener('click',async()=>{
          cancel.disabled=true;
          try{
            await request('/cancel',{id:item.id});
            await refresh();
            refreshButton.focus();
          }catch(error){listStatus.textContent=error.message;}
          finally{cancel.disabled=false;}
        });
        actions.append(cancel);
      }
      if(item.phase==='needs_review'||item.phase==='failed'){
        const brevo=element('a','Open Brevo ↗');
        brevo.href='https://app.brevo.com/';brevo.target='_blank';brevo.rel='noopener';
        actions.append(brevo);
      }
      row.append(description,actions);list.append(row);
    }
  }
  async function refresh(){
    const serial=++loadSerial;
    try{
      const data=await request('');
      if(serial!==loadSerial)return;
      reviewNow.disabled=reviewSchedule.disabled=!data.ready;
      if(!data.ready)sendNotice.textContent=errors.delivery_unavailable;
      else if(sendNotice.textContent===errors.delivery_unavailable)sendNotice.textContent='';
      renderDeliveries(data.deliveries);
    }catch(error){
      if(serial!==loadSerial)return;
      if(!list.children.length)sendNotice.textContent=errors.delivery_unavailable;
      listStatus.textContent='Delivery history is temporarily unavailable.';
    }
  }
  function openReview(schedule){
    sendNotice.textContent='';
    const {school,recipient,subject,body}=readDraft();
    if(!singleSchoolAddress(recipient)||!subject||subject.length>180){
      sendNotice.textContent=errors.invalid_delivery;
      $('recipient').focus();return;
    }
    const local=schedule?when.value:null,ms=schedule?sydneyInstant(local):null;
    if(schedule&&(!ms||ms<=Date.now())){
      sendNotice.textContent=errors.invalid_sydney_time;when.focus();return;
    }
    snapshot={id:crypto.randomUUID(),schoolId:school.id,recipient,subject,scheduledFor:local};
    const fields=$('review-fields');
    fields.replaceChildren();
    for(const [label,value] of Object.entries({
      School:school.name,Recipient:recipient,Subject:subject,
      From:'info@theglenolia.com.au', 'Reply to':'john@theglenolia.com.au',Send:schedule?sydneyDateTime(ms):'Now'
    }))fields.append(element('dt',label),element('dd',value));
    $('review-message').textContent=body;
    $('review-text').open=false;
    permission.checked=false;confirm.disabled=true;reviewStatus.textContent='';
    confirm.textContent=schedule?'Schedule email':'Send email now';
    dialog.showModal();
  }
  reviewNow.addEventListener('click',()=>openReview(false));
  reviewSchedule.addEventListener('click',()=>openReview(true));
  permission.addEventListener('change',()=>{confirm.disabled=busy||!permission.checked;});
  back.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  confirm.addEventListener('click',async()=>{
    if(busy||!snapshot||!permission.checked)return;
    busy=true;confirm.disabled=permission.disabled=back.disabled=true;
    reviewStatus.textContent=snapshot.scheduledFor?'Scheduling…':'Sending to Brevo…';
    try{
      const {delivery}=await request('',{...snapshot,permitted:true});
      dialog.close();
      sendNotice.textContent=outcome(delivery);
      await refresh();
    }catch(error){reviewStatus.textContent=error.message;}
    finally{
      busy=false;permission.disabled=back.disabled=false;confirm.disabled=!permission.checked;
    }
  });
  refreshButton.addEventListener('click',refresh);
  window.addEventListener('focus',refresh);
  refresh();
}
