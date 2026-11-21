// The authenticated school journal and farmer inbox share this conversation view.
const clock=new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'});
const dom=(name,copy,style)=>{
  const node=document.createElement(name);
  if(copy!=null)node.textContent=copy;
  if(style)node.className=style;
  return node;
};
function action(copy,fn,primary=false){
  const b=dom('button',copy,primary?'edu-button':'edu-button edu-button-secondary quiet');
  b.type='button';b.addEventListener('click',fn);return b;
}
function tick(copy){
  const line=dom('label',null,'thread-check'),input=dom('input');input.type='checkbox';line.append(input,document.createTextNode(copy));
  return {line,input};
}
function treeName(key){
  const m=/^r(\d+)-p(\d+)$/.exec(key);
  return m?'P'+((Number(m[1])-1)*19+Number(m[2])):'Class plant';
}

export function plantThreadsPanel({applicationId,api,threadId,staff=false}){
  const box=dom('section',null,'plant-message-panel');
  if(!staff)box.id='plant-conversation';
  const heading=dom('h2',staff?'Class conversations':'Ask the farmer');heading.tabIndex=-1;
  const status=dom('p',null,'thread-status');status.setAttribute('role','status');
  const actions=dom('div',null,'thread-actions'),summary=dom('div'),detail=dom('div'),composer=dom('div');
  const refresh=action('Refresh',()=>sync(true));
  if(!staff)actions.append(action('Ask a new question',()=>compose(true),true));
  actions.append(refresh);
  box.append(heading,dom('p',staff?'Reply privately to a class about its tree.':'Only your school’s teachers and the farm team can read these messages.'),actions,status,summary,detail,composer);
  let selected=threadId || (!staff && new URLSearchParams(location.hash.split('?')[1]||'').get('thread')) || '';
  let focusLinkedThread=Boolean(selected);
  let offset=0,before=0,seenList='',seenThread='',generation=0,poll=null,composing=null;
  const drafts=new Map();
  const path=extra=>{
    const qs=new URLSearchParams();
    if(!staff)qs.set('applicationId',applicationId);
    for(const [k,v] of Object.entries(extra))if(v)qs.set(k,v);
    return '/plants/threads?'+qs;
  };
  function say(text){status.textContent=text;}
  function reset(){
    generation++;seenList='';seenThread='';composing=null;summary.replaceChildren();detail.replaceChildren();composer.replaceChildren();
  }
  function back(){
    focusLinkedThread=false;selected='';before=0;previousPages.length=0;reset();sync();heading.focus();
  }
  function choose(id){
    focusLinkedThread=false;selected=id;before=0;previousPages.length=0;reset();sync();heading.focus();
  }
  const previousPages=[];
  function setPage(n){
    offset=n;seenList='';sync();
  }
  function listView(data){
    const fingerprint=JSON.stringify(data);
    if(fingerprint===seenList)return;
    seenList=fingerprint;summary.replaceChildren();
    if(!data.threads.length)summary.append(dom('p','No conversations yet.','edu-muted'));
    const list=dom('ul',null,'thread-list');
    for(const t of data.threads){
      const li=dom('li'),open=action(t.question,()=>choose(t.id));
      const label=t.lastSide==='school'?'Awaiting farmer reply':'Farmer replied';
      li.append(dom('small',treeName(t.plantKey)+' · '+label+' · '+clock.format(new Date(t.lastAt))),open);
      list.append(li);
    }
    if(data.threads.length)summary.append(list);
    const nav=dom('div',null,'thread-actions');
    if(offset)nav.append(action('Newer conversations',()=>setPage(Math.max(0,offset-30))));
    if(data.nextOffset!=null)nav.append(action('Earlier conversations',()=>setPage(data.nextOffset)));
    if(nav.childNodes.length)summary.append(nav);
  }
  async function followThread(input,id){
    input.disabled=true;const value=input.checked;
    try{
      await api('/plants/threads/follow',{applicationId,threadId:id,follow:value});
      say(value?'Email replies turned on for this conversation.':'Email replies turned off for this conversation.');
      seenThread='';await sync();
    }catch(e){input.checked=!value;say(e.message);}
    finally{input.disabled=false;}
  }
  function threadView(data){
    const signature=JSON.stringify(data);
    if(seenThread===signature)return;
    const focused=detail.contains(document.activeElement)?document.activeElement.dataset.threadFocus:null;
    seenThread=signature;detail.replaceChildren();
    const t=data.thread,header=dom('div',null,'thread-actions');
    const all=action('All conversations',back);all.dataset.threadFocus='back';header.append(all);
    if(!staff){
      const f=tick('Email me when the farmer replies');f.input.checked=t.following;f.input.dataset.threadFocus='follow';
      f.input.addEventListener('change',()=>followThread(f.input,t.id));header.append(f.line);
    }
    detail.append(header,dom('h3',treeName(t.plantKey)+' · Class question'),dom('p',t.question,'thread-body'),dom('small',clock.format(new Date(t.createdAt))));
    const nav=dom('div',null,'thread-actions');
    if(data.nextBefore!=null)nav.append(action('Earlier messages',()=>{previousPages.push(before);before=data.nextBefore;seenThread='';sync();}));
    if(before)nav.append(action('Newer messages',()=>{before=previousPages.pop()||0;seenThread='';sync();}));
    if(nav.childNodes.length)detail.append(nav);
    for(const m of data.messages){
      const entry=dom('article',null,'thread-message '+(m.side==='farm'?'from-farm':'from-school'));
      entry.append(dom('strong',m.side==='farm'?'Farmer':'School'),dom('small',clock.format(new Date(m.createdAt))),dom('p',m.body,'thread-body'));detail.append(entry);
    }
    if(!data.messages.length)detail.append(dom('p','Awaiting a reply from the farm.','edu-muted'));
    const reply=action(staff?'Reply to the class':'Ask a follow-up',()=>compose(false),true);
    reply.dataset.threadFocus='reply';detail.append(reply);
    if(focused)detail.querySelector('[data-thread-focus="'+focused+'"]')?.focus({preventScroll:true});
  }
  async function sync(manual=false){
    const current=++generation,target=selected;
    try{
      const data=await api(path(target?{threadId:target,before}:{offset}));
      if(current!==generation || !box.isConnected)return;
      if(target){
        threadView(data);
        if(focusLinkedThread && active()){focusLinkedThread=false;heading.focus();}
      }else listView(data);
      if(manual)say('Conversation refreshed.');
    }catch(e){
      if(current!==generation || !box.isConnected)return;
      if([401,403,404].includes(e.status)){
        reset();selected='';drafts.clear();say('This conversation is no longer available to this account.');
        if(target)summary.append(action('All conversations',back));
      }else say('Messages could not be refreshed. Your draft is still here. Try Refresh.');
    }
  }
  function compose(isNew){
    if(!isNew&&!selected)return;
    const thread=selected,key=isNew?'new':thread;
    if(composing===key){composer.querySelector('textarea')?.focus();return;}
    composing=key;
    const d=drafts.get(key)||{value:'',requestId:crypto.randomUUID(),follow:false,consent:false};
    drafts.set(key,d);composer.replaceChildren();
    const form=dom('form',null,'thread-form'),label=dom('label',isNew?'Your class question':staff?'Your reply to the class':'Your follow-up question');
    const body=dom('textarea');body.maxLength=800;body.rows=3;body.required=true;body.value=d.value;label.append(body);
    form.append(label);
    body.addEventListener('input',()=>{d.value=body.value;d.requestId=crypto.randomUUID();});
    if(!staff){
      const consent=tick('I have left out student names and personal details.');consent.input.required=true;consent.input.checked=d.consent;
      consent.input.addEventListener('change',()=>d.consent=consent.input.checked);form.append(consent.line);
      if(isNew){
        const follow=tick('Email me when the farmer replies');follow.input.checked=d.follow;
        follow.input.addEventListener('change',()=>d.follow=follow.input.checked);form.append(follow.line);
      }
    }
    const buttons=dom('div',null,'thread-actions'),send=dom('button',isNew?'Send question':'Send reply','edu-button');
    send.type='submit';const cancel=action('Close',()=>{composing=null;composer.replaceChildren();heading.focus();});
    buttons.append(send,cancel);form.append(buttons);composer.append(form);body.focus();
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(send.disabled||!form.reportValidity())return;
      if(!d.value.trim()){body.focus();return;}
      const fields=[...form.querySelectorAll('button,input,textarea')];fields.forEach(n=>n.disabled=true);
      const request=isNew?{applicationId,requestId:d.requestId,question:d.value.trim(),consent:d.consent,follow:d.follow}:
        {...(staff?{}:{applicationId,consent:d.consent}),threadId:thread,requestId:d.requestId,body:d.value.trim()};
      try{
        const saved=await api('/plants/threads/'+(isNew?'open':'reply'),request);
        drafts.delete(key);if(!box.isConnected)return;
        choose(saved.threadId);say(isNew?'Question sent to the farm.':'Reply sent.');
      }catch(err){say(err.message);fields.forEach(n=>n.disabled=false);}
    });
  }
  function active(){return box.isConnected && !box.closest('[hidden]') && document.visibilityState!=='hidden';}
  function schedule(){
    clearTimeout(poll);
    poll=setTimeout(async()=>{
      if(!box.isConnected)return;
      if(active() && !before)await sync();
      schedule();
    },25000);
  }
  // Parent assembles the section before attaching it to its final page.
  setTimeout(()=>{if(box.isConnected){sync();schedule();}},0);
  return box;
}
