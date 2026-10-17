(() => {
 const $=id=>document.getElementById(id),ids=['cafe','coffee','workshops','local'],langs=['en','zh','ja'];
 const names={cafe:'Café & farm experiences',coffee:'Coffee growing',workshops:'Hands-on workshops',local:'Local connections'};
 const state={record:null,department:'cafe',dirty:false,busy:false,preview:null};
 const errors={
  changed_elsewhere:'Another session changed this update. Copy any unsaved English notes, then reload this page before trying again.',
  invalid_programme:'Check the English notes for all four areas, completed items, dates and plant fields.',
  programme_unavailable:'Programme storage is temporarily unavailable. Your notes remain in the editor.',
  translation_unavailable:'Automatic translation is temporarily unavailable. Your English notes remain in the editor and the public website is unchanged. Please try again shortly.',
  translation_failed:'Translation could not be completed. Your English notes remain in the editor and the public website is unchanged. Try again shortly.',
  translation_invalid:'The translated content could not be validated. Your English notes remain in the editor and the previous public version is unchanged. Please try again.',
  translation_busy:'A translation is already in progress. Your English notes remain in the editor and the public website is unchanged. Wait a moment and try again.',
  translation_limit:'The translation limit has been reached. Your English notes remain in the editor and the public website is unchanged. Try again later.',
 };
 function message(text){$('programme-message').textContent=text;}
 async function api(path,body){
  const response=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  if(!response.headers.get('Content-Type')?.includes('application/json'))throw Error('Please sign in again. Your notes remain in the editor.');
  const data=await response.json();
  if(!response.ok)throw Error(errors[data.error]||'The update could not be completed. Your notes remain in the editor.');
  return data;
 }
 function capture(){
  if(!state.record)return;
  const department=state.record.draft.departments[state.department],english=department.translations.en;
  department.status=$('programme-stage').value;
  english.now=$('programme-now').value.trim().normalize('NFC');english.next=$('programme-next').value.trim().normalize('NFC');english.done=$('programme-done').value.split('\n').map(line=>line.trim().normalize('NFC')).filter(Boolean);
  const coffee=state.record.draft.coffee;
  coffee.seedStage=$('plant-seed-stage').value;coffee.trialStage=$('plant-trial-stage').value;coffee.heightCm=Number($('plant-height').value);coffee.observedOn=$('plant-observed').value;
 }
 function sourceKey(programme){
  const coffee=programme.coffee||{};
  return JSON.stringify({departments:ids.map(id=>{const department=programme.departments[id],english=department.translations.en;return[id,department.status,english.now,english.next,english.done];}),coffee:[coffee.seedVarieties,coffee.seedStage,coffee.trialName,coffee.trialStage,coffee.heightCm,coffee.observedOn]});
 }
 function invalidatePreview(){
  state.preview=null;$('programme-preview').replaceChildren();
  $('programme-preview-status').textContent='English draft changed. Preview translations again or publish to create the updated language versions.';
 }
 function setPreview(programme,kind){
  state.preview={programme:structuredClone(programme),kind,key:sourceKey(state.record.draft)};
 }
 function renderPreview(){
  const saved=state.preview&&state.preview.key===sourceKey(state.record.draft)?state.preview:null;
  if(!saved)state.preview=null;
  const programme=saved?.programme||state.record.draft,languages=saved?langs:['en'];
  $('programme-preview-status').textContent=saved?.kind==='published'
   ?'Published versions. These English, Traditional Chinese and Japanese notes were released together.'
   :saved?'Private translation preview. It has not been saved or published; your English draft is unchanged.'
   :'English draft only. Traditional Chinese and Japanese are created when you preview translations or publish.';
  const target=$('programme-preview');target.replaceChildren();
  for(const language of languages){
   const section=document.createElement('section');section.lang={en:'en-AU',zh:'zh-Hant',ja:'ja'}[language];
   const heading=document.createElement('h3');heading.textContent={en:'English',zh:'繁體中文',ja:'日本語'}[language];section.append(heading);
   for(const id of ids){
    const copy=programme.departments[id].translations[language],article=document.createElement('article'),title=document.createElement('h4');title.textContent=names[id];article.append(title);
    for(const [label,value] of [['Working on',copy.now],['Next',copy.next],['Done',copy.done.join(' · ')||'No completed milestone reported']]){
     const paragraph=document.createElement('p'),strong=document.createElement('strong');strong.textContent=label+': ';paragraph.append(strong,document.createTextNode(value));article.append(paragraph);
    }
    section.append(article);
   }
   target.append(section);
  }
 }
 function paint(){
  const record=state.record,department=record.draft.departments[state.department],english=department.translations.en;
  $('programme-department').value=state.department;
  $('programme-stage').value=department.status;$('programme-now').value=english.now;$('programme-next').value=english.next;$('programme-done').value=english.done.join('\n');
  const coffee=record.draft.coffee;
  $('plant-fields').hidden=state.department!=='coffee';$('plant-seed-stage').value=coffee.seedStage;$('plant-trial-stage').value=coffee.trialStage;$('plant-height').value=coffee.heightCm;$('plant-observed').value=coffee.observedOn;
  $('programme-revision').textContent='Draft revision '+record.revision+' · '+(record.publishedAt?'Published '+new Date(record.publishedAt).toLocaleString('en-AU',{timeZone:'Australia/Sydney'}):'Website baseline: '+record.published.updatedAt);
  $('programme-confirmation').hidden=true;renderPreview();
 }
 const disabledBeforeRequest=new Map();
 function busy(value){
  state.busy=value;$('programme-form').setAttribute('aria-busy',String(value));
  if(value){
   const controls=[...$('programme-form').querySelectorAll('input, textarea, select, button'),$('programme-reload')];
   for(const control of controls){disabledBeforeRequest.set(control,control.disabled);control.disabled=true;}
  }else{
   for(const [control,wasDisabled] of disabledBeforeRequest)control.disabled=wasDisabled;
   disabledBeforeRequest.clear();
  }
 }
 async function run(fn){if(state.busy)return;busy(true);try{await fn();}catch(error){message(error.message);}finally{busy(false);}}
 async function load(){
  state.record=await api('/api/programme');state.dirty=false;state.preview=null;$('programme-form').hidden=false;paint();
  message('English draft loaded. Edit English only; publication creates Traditional Chinese and Japanese automatically. Only published notes appear on the website.');
 }
 async function saveDraft(force=false){
  capture();
  if(force||state.dirty||state.record.revision===0){
   state.record=await api('/api/programme/save',{programme:state.record.draft,expectedRevision:state.record.revision});state.dirty=false;
  }
  paint();
 }
 function checkEnglish(){
  for(const id of ids){
   const english=state.record.draft.departments[id].translations.en;
   if(!english.now.trim()||!english.next.trim())throw Error('Add Working on and Next milestone for '+names[id]+' before publishing. Your English draft is saved privately.');
  }
 }
 $('programme-tab').onclick=()=>{
  for(const id of ['subscribers','editions','programme'])$(id).hidden=id!=='programme';
  for(const id of ['subscribers-tab','editions-tab','programme-tab'])$(id).setAttribute('aria-pressed',String(id==='programme-tab'));
  if(!state.record)run(load);
 };
 $('programme-department').onchange=()=>{capture();state.department=$('programme-department').value;paint();};
 $('programme-form').oninput=event=>{
  if(event.target.id==='programme-department'||state.busy)return;
  state.dirty=true;$('programme-confirmation').hidden=true;invalidatePreview();
 };
 $('programme-form').onsubmit=event=>{event.preventDefault();run(async()=>{
  message('Saving English draft…');await saveDraft(true);
  message('English draft saved privately. Preview translations or publish when ready.');
 });};
 $('programme-translate-preview').onclick=()=>{
  if(!$('programme-form').reportValidity())return;
  run(async()=>{
   capture();state.preview=null;renderPreview();$('programme-confirmation').hidden=true;message('Preparing a private translation preview…');
   const programme=structuredClone(state.record.draft),key=sourceKey(programme);
   const result=await api('/api/programme/preview-translations',{programme,expectedRevision:state.record.revision});
   if(!result.programme||!ids.every(id=>langs.every(language=>{
    const copy=result.programme.departments?.[id]?.translations?.[language];return typeof copy?.now==='string'&&typeof copy?.next==='string'&&Array.isArray(copy?.done)&&copy.done.every(line=>typeof line==='string');
   }))||sourceKey(result.programme)!==key)throw Error(errors.translation_invalid);
   setPreview(result.programme,'translation');renderPreview();$('programme-review').open=true;
   message('Private translation preview ready. Your English draft has not been saved or published by this preview.');
  });
 };
 $('programme-publish').onclick=()=>{
  if(!$('programme-form').reportValidity())return;
  run(async()=>{
   message('Saving English draft before publication…');await saveDraft();checkEnglish();
   $('programme-review').open=true;$('programme-confirmation').hidden=false;
   message('Your English draft is saved. Confirm below to translate and publish all three language versions together.');
  }).then(()=>{if(!$('programme-confirmation').hidden)$('programme-confirm-publish').focus();});
 };
 $('programme-cancel-publish').onclick=()=>{$('programme-confirmation').hidden=true;$('programme-publish').focus();};
 $('programme-confirm-publish').onclick=()=>{
  const button=$('programme-confirm-publish'),label=button.textContent;
  run(async()=>{
   if(state.dirty)throw Error('Your English draft changed. Choose Publish public update again to save it first.');
   button.textContent='Translating and publishing…';message('Translating and publishing…');
   const record=await api('/api/programme/publish',{expectedRevision:state.record.revision});
   state.record=record;state.dirty=false;setPreview(record.published,'published');paint();$('programme-review').open=true;
   message('Published in English, Traditional Chinese and Japanese. Visitors will see the update within about one minute.');
  }).finally(()=>{button.textContent=label;});
 };
 $('programme-reload').onclick=()=>{if(state.dirty){message('Save your English draft before reloading. A translation preview does not save it.');return;}run(load);};
 window.addEventListener('beforeunload',event=>{if(state.dirty){event.preventDefault();event.returnValue='';}});
 if(location.hash==='#programmes')$('programme-tab').click();
})();
