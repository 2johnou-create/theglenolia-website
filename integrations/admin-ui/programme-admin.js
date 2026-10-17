(() => {
 const $=id=>document.getElementById(id),ids=['cafe','coffee','workshops','local'],langs=['en','zh','ja'];
 const names={cafe:'Café & farm experiences',coffee:'Coffee growing',workshops:'Hands-on workshops',local:'Local connections'};
 const state={record:null,department:'cafe',language:'en',dirty:false,busy:false};
 function message(text){$('programme-message').textContent=text;}
 async function api(path,body){
  const r=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  if(!r.headers.get('Content-Type')?.includes('application/json'))throw Error('Please sign in again.');
  const data=await r.json();
  if(!r.ok)throw Error(({changed_elsewhere:'Another session changed this update. Reload before saving.',invalid_programme:'Check the short notes in all three languages, dates and plant fields. Completed milestones must have matching translations.',programme_unavailable:'Programme storage is temporarily unavailable.'})[data.error]||'The update could not be completed.');
  return data;
 }
 function capture(){
  if(!state.record)return;
  const d=state.record.draft.departments[state.department],c=d.translations[state.language];
  d.status=$('programme-stage').value;c.now=$('programme-now').value.trim();c.next=$('programme-next').value.trim();c.done=$('programme-done').value.split('\n').map(s=>s.trim()).filter(Boolean);
  const p=state.record.draft.coffee;
  p.seedStage=$('plant-seed-stage').value;p.trialStage=$('plant-trial-stage').value;p.heightCm=Number($('plant-height').value);p.observedOn=$('plant-observed').value;
 }
 function preview(){
  const target=$('programme-preview');target.replaceChildren();
  for(const language of langs){
   const section=document.createElement('section');section.lang={en:'en-AU',zh:'zh-Hant',ja:'ja'}[language];
   const heading=document.createElement('h3');heading.textContent={en:'English',zh:'繁體中文',ja:'日本語'}[language];section.append(heading);
   for(const id of ids){const c=state.record.draft.departments[id].translations[language],article=document.createElement('article'),h=document.createElement('h4');h.textContent=names[id];article.append(h);for(const [label,value] of [['Working on',c.now],['Next',c.next],['Done',c.done.join(' · ')||'No completed milestone reported']]){const p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=label+': ';p.append(strong,document.createTextNode(value));article.append(p);}section.append(article);}target.append(section);
  }
 }
 function paint(){
  const r=state.record,d=r.draft.departments[state.department],c=d.translations[state.language];
  $('programme-department').value=state.department;$('programme-language').value=state.language;
  $('programme-stage').value=d.status;$('programme-now').value=c.now;$('programme-next').value=c.next;$('programme-done').value=c.done.join('\n');
  const p=r.draft.coffee;$('plant-fields').hidden=state.department!=='coffee';$('plant-seed-stage').value=p.seedStage;$('plant-trial-stage').value=p.trialStage;$('plant-height').value=p.heightCm;$('plant-observed').value=p.observedOn;
  $('programme-revision').textContent='Draft revision '+r.revision+' · '+(r.publishedAt?'Published '+new Date(r.publishedAt).toLocaleString('en-AU',{timeZone:'Australia/Sydney'}):'Website baseline: '+r.published.updatedAt);
  $('programme-confirmation').hidden=true;preview();
 }
 const disabledBeforeRequest=new Map();
 function busy(value){
  state.busy=value;
  if(value){
   const controls=[...$('programme-form').querySelectorAll('input, textarea, select, button'),$('programme-reload')];
   for(const control of controls){disabledBeforeRequest.set(control,control.disabled);control.disabled=true;}
  }else{
   for(const [control,wasDisabled] of disabledBeforeRequest)control.disabled=wasDisabled;
   disabledBeforeRequest.clear();
  }
 }
 async function run(fn){if(state.busy)return;busy(true);try{await fn();}catch(e){message(e.message);}finally{busy(false);}}
 async function load(){state.record=await api('/api/programme');state.dirty=false;$('programme-form').hidden=false;paint();message('Draft and published notes loaded. Only published notes appear on the public website.');}
 $('programme-tab').onclick=()=>{
  for(const id of ['subscribers','editions','programme'])$(id).hidden=id!=='programme';
  for(const id of ['subscribers-tab','editions-tab','programme-tab'])$(id).setAttribute('aria-pressed',String(id==='programme-tab'));
  if(!state.record)run(load);
 };
 $('programme-department').onchange=()=>{capture();state.department=$('programme-department').value;paint();};
 $('programme-language').onchange=()=>{capture();state.language=$('programme-language').value;paint();};
 $('programme-form').oninput=event=>{if(!['programme-department','programme-language'].includes(event.target.id)){state.dirty=true;$('programme-confirmation').hidden=true;}};
 $('programme-form').onsubmit=event=>{event.preventDefault();run(async()=>{
  capture();const result=await api('/api/programme/save',{programme:state.record.draft,expectedRevision:state.record.revision});
  state.record=result;state.dirty=false;paint();message('Draft saved. Review all three language versions below, then publish when ready.');
 });};
 $('programme-publish').onclick=()=>{
  if(state.dirty){message('Save your draft before publishing.');return;}
  preview();$('programme-confirmation').hidden=false;$('programme-confirm-publish').focus();
 };
 $('programme-cancel-publish').onclick=()=>{$('programme-confirmation').hidden=true;$('programme-publish').focus();};
 $('programme-confirm-publish').onclick=()=>run(async()=>{
  if(state.dirty)throw Error('Save your draft before publishing.');
  state.record=await api('/api/programme/publish',{expectedRevision:state.record.revision});paint();message('Published. Visitors will see these notes within about one minute.');
 });
 $('programme-reload').onclick=()=>{if(state.dirty){message('Save your draft before reloading.');return;}run(load);};
 window.addEventListener('beforeunload',e=>{if(state.dirty){e.preventDefault();e.returnValue='';}});
 if(location.hash==='#programmes')$('programme-tab').click();
})();
