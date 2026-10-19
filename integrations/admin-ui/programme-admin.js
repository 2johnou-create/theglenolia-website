(() => {
 const $=id=>document.getElementById(id),ids=['cafe','coffee','workshops','local'],langs=['en','zh','ja'];
 const names={cafe:'Café & farm experiences',coffee:'Coffee growing',workshops:'Hands-on workshops',local:'Local connections'};
 const imageIdPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
 const state={record:null,department:'cafe',dirty:false,busy:false,preview:null};
 const errors={
  changed_elsewhere:'Another session changed this update. Copy any unsaved English notes, then reload this page before trying again.',
  invalid_programme:'Check the English notes, image descriptions and dates, completed items and plant fields for all four areas. Your notes remain in the editor.',
  programme_unavailable:'Programme storage is temporarily unavailable. Your notes remain in the editor.',
  translation_unavailable:'Automatic translation is temporarily unavailable. Your English notes remain in the editor and the public website is unchanged. Please try again shortly.',
  translation_failed:'Translation could not be completed. Your English notes remain in the editor and the public website is unchanged. Try again shortly.',
  translation_invalid:'The translated content could not be validated. Your English notes remain in the editor and the previous public version is unchanged. Please try again.',
  translation_busy:'A translation is already in progress. Your English notes remain in the editor and the public website is unchanged. Wait a moment and try again.',
  translation_limit:'The translation limit has been reached. Your English notes remain in the editor and the public website is unchanged. Try again later.',
  invalid_image:'This image could not be accepted. Choose a JPEG, PNG or WebP image and try again. Your draft is unchanged.',
  invalid_department:'Choose a programme area before adding an image. Your notes remain in the editor.',
  invalid_image_reference:'An attached image could not be found for this area. Reload the saved draft and add the image again. Your notes remain in the editor.',
  image_storage_limit:'Image storage is full. Your notes remain in the editor. Please contact the site administrator before adding another image.',
  image_too_large:'This image is too large. Choose a smaller image and try again. Your notes remain in the editor.',
  programme_image_unavailable:'Image storage is temporarily unavailable. Your notes remain in the editor; please try again.',
 };
 function message(text){$('programme-message').textContent=text;}
 async function api(path,body){
  let response;try{response=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(60000)});}catch(error){if(['TimeoutError','AbortError'].includes(error.name))throw Error('The request took too long. Your notes remain in the editor. Check the saved version in another admin tab before trying again.');throw error;}
  if(!response.headers.get('Content-Type')?.includes('application/json'))throw Error('Please sign in again. Your notes remain in the editor.');
  const data=await response.json();
  if(!response.ok){
   const failure=data.translationFailure,language={zh:'Traditional Chinese',ja:'Japanese'}[failure?.language],department=names[failure?.entryId?.split('.')[0]],field={now:'Working on',next:'Next milestone',caption:'image caption',alt:'image description'}[failure?.entryId?.split('.').at(-1)],reason={length:'too long',terminology:'product wording',numbers:'number check',names:'name check',units:'measurement check',language:'language check',attribution:'attribution check',shape:'response format',text:'missing text',empty:'missing text',unsafe:'unsupported text'}[failure?.reason];
   const detail=data.error==='translation_invalid'&&language&&department&&field&&reason?' '+department+' · '+language+' '+field+': '+reason+'.':'';
   throw Error((errors[data.error]||'The update could not be completed. Your notes remain in the editor.')+detail);
  }
  return data;
 }
 function capture(){
  if(!state.record)return;
  const department=state.record.draft.departments[state.department],english=department.translations.en;
  department.status=$('programme-stage').value;
  english.now=$('programme-now').value.trim().normalize('NFC');english.next=$('programme-next').value.trim().normalize('NFC');english.done=$('programme-done').value.split('\n').map(line=>line.trim().normalize('NFC')).filter(Boolean);
  for(const row of $('programme-images').querySelectorAll('[data-programme-image]')){
   const snapshot=(department.snapshots||[]).find(item=>item.imageId===row.dataset.programmeImage);if(!snapshot)continue;
   snapshot.kind=row.querySelector('[data-image-kind]').value;snapshot.capturedOn=row.querySelector('[data-image-date]').value;
   snapshot.translations.en={caption:row.querySelector('[data-image-caption]').value.trim().normalize('NFC'),alt:row.querySelector('[data-image-alt]').value.trim().normalize('NFC')};
  }
  const coffee=state.record.draft.coffee;
  coffee.seedStage=$('plant-seed-stage').value;coffee.trialStage=$('plant-trial-stage').value;coffee.heightCm=Number($('plant-height').value);coffee.observedOn=$('plant-observed').value;
 }
 function sourceKey(programme){
  const coffee=programme.coffee||{};
  return JSON.stringify({departments:ids.map(id=>{const department=programme.departments[id],english=department.translations.en;return[id,department.status,english.now,english.next,english.done,(department.snapshots||[]).map(item=>[item.imageId,item.kind,item.capturedOn,item.translations.en.caption,item.translations.en.alt])];}),coffee:[coffee.seedVarieties,coffee.seedStage,coffee.trialName,coffee.trialStage,coffee.heightCm,coffee.observedOn]});
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
    for(const snapshot of programme.departments[id].snapshots||[]){
     const imageCopy=snapshot.translations[language],figure=document.createElement('figure'),image=document.createElement('img');image.src=imagePath(snapshot.imageId);image.alt=imageCopy.alt;image.loading='lazy';figure.append(image);
     if(imageCopy.caption){const caption=document.createElement('figcaption');caption.textContent=imageCopy.caption;figure.append(caption);}
     const alternative=document.createElement('p');alternative.className='small';alternative.textContent='Image description: '+(imageCopy.alt||'Add an English image description before publishing.');figure.append(alternative);article.append(figure);
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
  $('programme-confirmation').hidden=true;renderImages();renderPreview();
 }
 function imagePath(imageId){return '/api/programme/images/'+encodeURIComponent(imageId);}
 function field(labelText,control){const label=document.createElement('label');label.append(document.createTextNode(labelText),control);return label;}
 function renderImages(){
  const target=$('programme-images');target.replaceChildren();
  const snapshots=state.record?.draft.departments[state.department].snapshots||[];
  $('programme-image-count').textContent=snapshots.length+' of 4 images · '+names[state.department];
  $('programme-image-files').disabled=state.busy||snapshots.length>=4;
  $('programme-image-empty').hidden=Boolean(snapshots.length);
  for(const [index,snapshot] of snapshots.entries()){
   const row=document.createElement('article');row.className='programme-image-editor';row.dataset.programmeImage=snapshot.imageId;
   const preview=document.createElement('div');preview.className='programme-image-preview';const image=document.createElement('img');image.src=imagePath(snapshot.imageId);image.alt=snapshot.translations.en.alt||'Private draft image '+(index+1);image.loading='lazy';image.decoding='async';preview.append(image);
   const badge=document.createElement('span');badge.textContent='Private preview';preview.append(badge);row.append(preview);
   const content=document.createElement('div');content.className='programme-image-fields';const heading=document.createElement('h3');heading.textContent='Image '+(index+1);content.append(heading);
   const kind=document.createElement('select');kind.dataset.imageKind='';for(const [value,label] of [['photo','Progress photo'],['concept','Product or design image']]){const option=document.createElement('option');option.value=value;option.textContent=label;kind.append(option);}kind.value=snapshot.kind;
   const date=document.createElement('input');date.type='date';date.dataset.imageDate='';date.value=snapshot.capturedOn||'';
   const meta=document.createElement('div');meta.className='programme-image-meta';meta.append(field('Image type',kind),field('Photo date · optional',date));content.append(meta);
   const caption=document.createElement('input');caption.dataset.imageCaption='';caption.maxLength=120;caption.value=snapshot.translations.en.caption;content.append(field('Caption · English, optional',caption));
   const alt=document.createElement('textarea');alt.dataset.imageAlt='';alt.maxLength=160;alt.rows=2;alt.value=snapshot.translations.en.alt;content.append(field('Image description · English, required to publish',alt));
   const actions=document.createElement('div');actions.className='programme-image-actions';
   for(const [label,action,disabled] of [['Move up','up',index===0],['Move down','down',index===snapshots.length-1],['Remove','remove',false]]){
    const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent=label;button.dataset.imageAction=action;button.setAttribute('aria-label',label+' image '+(index+1));button.disabled=state.busy||disabled;
    button.onclick=()=>{if(state.busy)return;capture();const current=state.record.draft.departments[state.department].snapshots,at=current.findIndex(item=>item.imageId===snapshot.imageId);if(at<0)return;
     if(action==='remove')current.splice(at,1);else{const to=at+(action==='up'?-1:1);if(to<0||to>=current.length)return;[current[at],current[to]]=[current[to],current[at]];}
     state.dirty=true;$('programme-confirmation').hidden=true;invalidatePreview();renderImages();message('Image changes are in your English draft. Save the draft to keep them; publish when ready. The public page is unchanged.');
     const rows=[...$('programme-images').querySelectorAll('[data-programme-image]')],nextRow=action==='remove'?rows[Math.min(at,rows.length-1)]:rows.find(item=>item.dataset.programmeImage===snapshot.imageId),nextButton=nextRow?.querySelector('[data-image-action="'+action+'"]');
     (nextButton&&!nextButton.disabled?nextButton:nextRow?.querySelector('[data-image-action="remove"]')||$('programme-image-files')).focus();
    };actions.append(button);
   }
   content.append(actions);row.append(content);target.append(row);
  }
 }
 async function optimiseImage(file){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20*1024*1024)throw Error('Choose a JPEG, PNG or WebP image under 20 MB. Your notes remain in the editor.');
  const url=URL.createObjectURL(file),image=new Image();
  try{
   image.src=url;await image.decode();const width=image.naturalWidth,height=image.naturalHeight;
   if(!width||!height||width*height>60000000)throw Error('Choose an image smaller than 60 megapixels. Your notes remain in the editor.');
   const scale=Math.min(1,1600/Math.max(width,height)),canvas=document.createElement('canvas');let edgeScale=scale;
   for(let pass=0;pass<5;pass++){
    canvas.width=Math.max(1,Math.round(width*edgeScale));canvas.height=Math.max(1,Math.round(height*edgeScale));
    const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Image preparation is unavailable in this browser. Try a different browser.');
    context.fillStyle='#F5F1E8';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
    for(const quality of [.84,.72,.6,.48]){
     let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
     if(blob?.type!=='image/webp')blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
     if(blob&&['image/webp','image/jpeg'].includes(blob.type)&&blob.size<=307200)return blob;
    }
    edgeScale*=.78;
   }
   throw Error('This image could not be reduced below 300 KB. Choose a simpler or smaller image. Your notes remain in the editor.');
  }catch(error){if(error.name==='EncodingError')throw Error('This image could not be opened. Choose a different JPEG, PNG or WebP image. Your notes remain in the editor.');throw error;}
  finally{URL.revokeObjectURL(url);}
 }
 async function uploadImage(blob,department){
  let response;try{response=await fetch('/api/programme/images/upload?department='+encodeURIComponent(department),{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':blob.type},body:blob,signal:AbortSignal.timeout(25000)});}catch(error){if(['TimeoutError','AbortError'].includes(error.name))throw Error('The image upload took too long. Your notes remain in the editor. Please try adding the image again.');throw error;}
  if(!response.headers.get('Content-Type')?.includes('application/json'))throw Error('Please sign in again. Your notes remain in the editor.');
  const result=await response.json();if(!response.ok)throw Error(errors[result.error]||'The image could not be uploaded. Your notes remain in the editor.');
  if(typeof result.image?.imageId!=='string'||!imageIdPattern.test(result.image.imageId)||result.image.department!==department||!['image/webp','image/jpeg'].includes(result.image.mime)||!Number.isInteger(result.image.width)||result.image.width<1||result.image.width>1600||!Number.isInteger(result.image.height)||result.image.height<1||result.image.height>1600||!Number.isInteger(result.image.byteLength)||result.image.byteLength<1||result.image.byteLength>307200)throw Error('The image upload could not be verified. Your notes remain in the editor.');
  return result.image;
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
   if(state.record)renderImages();
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
 function checkEnglish(saved=true){
  const note=saved?'Your English draft is saved privately.':'Your English draft remains in the editor.';
  for(const id of ids){
   const english=state.record.draft.departments[id].translations.en;
   if(!english.now.trim()||!english.next.trim())throw Error('Add Working on and Next milestone for '+names[id]+' before translating. '+note);
   if((state.record.draft.departments[id].snapshots||[]).some(snapshot=>!snapshot.translations.en.alt.trim()))throw Error('Add an English image description for each image in '+names[id]+' before translating. '+note);
  }
 }
 $('programme-tab').onclick=()=>{
  for(const id of ['subscribers','editions','programme'])$(id).hidden=id!=='programme';
  for(const id of ['subscribers-tab','editions-tab','programme-tab'])$(id).setAttribute('aria-pressed',String(id==='programme-tab'));
  if(!state.record)run(load);
 };
 $('programme-department').onchange=()=>{capture();state.department=$('programme-department').value;paint();};
 $('programme-image-files').onchange=()=>{
  const files=[...$('programme-image-files').files];$('programme-image-files').value='';if(!files.length||state.busy)return;
  capture();const department=state.department,snapshots=state.record.draft.departments[department].snapshots??=[];
  if(files.length>4-snapshots.length){message('Choose up to '+(4-snapshots.length)+' more images for this area. Your draft is unchanged.');return;}
  run(async()=>{let added=0;try{
   for(const [index,file] of files.entries()){
    message('Preparing image '+(index+1)+' of '+files.length+'…');const blob=await optimiseImage(file);message('Uploading image '+(index+1)+' of '+files.length+' privately…');const asset=await uploadImage(blob,department);
    snapshots.push({imageId:asset.imageId,kind:'photo',capturedOn:'',translations:Object.fromEntries(langs.map(language=>[language,{caption:'',alt:''}]))});added++;state.dirty=true;invalidatePreview();
   }
   $('programme-confirmation').hidden=true;renderImages();message(added+' image'+(added===1?'':'s')+' added privately. Add an English image description, then save your draft. Nothing is public until you publish.');
  }catch(error){renderImages();throw Error((added?added+' image'+(added===1?'':'s')+' added privately. ':'')+error.message);}});
 };
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
   capture();checkEnglish(false);state.preview=null;renderPreview();$('programme-confirmation').hidden=true;message('Preparing a private translation preview…');
   const programme=structuredClone(state.record.draft),key=sourceKey(programme);
   const result=await api('/api/programme/preview-translations',{programme,expectedRevision:state.record.revision});
   if(!result.programme||!ids.every(id=>langs.every(language=>{
    const department=result.programme.departments?.[id],copy=department?.translations?.[language];return typeof copy?.now==='string'&&typeof copy?.next==='string'&&Array.isArray(copy?.done)&&copy.done.every(line=>typeof line==='string')&&(department.snapshots||[]).every(snapshot=>typeof snapshot.translations?.[language]?.caption==='string'&&typeof snapshot.translations?.[language]?.alt==='string');
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
