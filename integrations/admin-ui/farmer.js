import {mountVarieties} from './varieties.js';
import {mountRecognitionFiles} from './recognition-files.js';
import {plantThreadsPanel} from '../../public/teachers/plant-threads-ui.js';
import {prepareFieldPhoto} from './photo-preparation.js';
import {mountFieldReport} from './field-report.js';
import {mountFarmAtlas} from './farm-atlas.js';
import {STAGE_NAMES} from '../../public/assets/plant-portal/stages.js';
import {setPlantIllustration} from '../../public/assets/plant-portal/plant-illustration.js';
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const base = '/api/education/plants';
  const statuses = {unverified:'Needs a field check',available:'Available for schools',unavailable:'Held at the farm',offered:'Offered to a school',active:'School following',cooling:'Withdrawal cooling period'};
  const applicationStatuses = {pending:'Awaiting review',offered:'Awaiting teacher acceptance',active:'School following',declined:'Declined',cooling:'Withdrawal cooling period',released:'Adoption ended',cancelled:'Cancelled'};
  const drafts = new Map();
  const fieldStageDrafts = new Map();
  let treeKey = new URL(location.href).searchParams.get('plant') || '';
  let dashboard = null, journalVersion = 0, reading = false, writing = false;
  const atlas = mountFarmAtlas({api,run,reload});
  const fieldReport = mountFieldReport({api,run,today});
  const openVarieties = mountVarieties({api,run,today,reload});

  function message(text, focus = false) {
    $('notice').textContent = text;
    if (text && focus) $('notice').focus();
  }

  function today() {
    const parts = new Intl.DateTimeFormat('en-AU', {timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    return ['year','month','day'].map(key => parts.find(part => part.type === key).value).join('-');
  }
  function displayDate(value) {
    if (!value) return '';
    const date = new Date(value?.length === 10 ? value + 'T12:00:00Z' : value);
    return Number.isFinite(date.getTime()) ? date.toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric',timeZone:'Australia/Sydney'}) : '';
  }
  function farmTime(timestamp) {
    if (!timestamp) return '';
    const time = new Date(timestamp);
    return Number.isFinite(time.getTime()) ? new Intl.DateTimeFormat('en-AU', {
      timeZone:'Australia/Sydney', day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'
    }).format(time) : '';
  }
  function position(plant) { return 'Row ' + plant.row + ' · ' + (plant.label || 'Plant ' + plant.position); }
  function name(plant) { return position(plant) + (plant.tag ? ' · ' + plant.tag : ''); }
  function plant(key) { return dashboard?.plants.find(item => item.key === key) || dashboard?.archivedPlants?.find(item => item.key === key); }
  function selected() { return plant(treeKey); }
  function draft(key) {
    if (!drafts.has(key)) drafts.set(key,{date:today(),note:'',blob:null,url:'',requestId:null});
    return drafts.get(key);
  }
  function clearPhoto(d) {
    if (d.url) URL.revokeObjectURL(d.url);
    d.url = ''; d.blob = null; d.requestId = null;
  }
  function dirty() { return fieldReport.hasChanges() || atlas.hasChanges() || fieldStageDrafts.size > 0 || [...drafts.values()].some(d => d.note.trim() || d.blob); }
  window.addEventListener('beforeunload', event => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } });

  const knownErrors = {
    field_report_changed:'Another farmer changed these growing conditions. Load saved records to review the latest version.', invalid_soil_ph:'Enter a measured pH between 0 and 14.',
    atlas_changed:'Another staff member changed the atlas. Refresh the farm workspace and check the latest values.',
    row_in_use:'A position in this range is offered or assigned to a school. Keep that position visible.',
    position_hidden:'This position is now hidden. Refresh the farm workspace and choose a visible position.',
    plant_in_use:'This plant is offered or assigned to a school. Choose a planted stage.',
    origin:'Please reopen the protected farm workspace.', access_required:'Your staff session expired. Sign in again in another tab, then retry.',
    owner_required:'Your account cannot manage school applications.',changed_elsewhere:'Another staff member changed this record. Refresh the farm workspace.',
    tag_in_use:'That tag is already registered. Check the physical tag and position.',
    plant_unavailable:'This plant is no longer available. Refresh and choose another.',plant_already_verified:'This position already has a tag. Refresh the register.',application_changed:'This application has already changed. Refresh the school requests.',
    invalid_date:'Choose today or an earlier observation date.',duplicate_tag:'That tag is already registered at another position.',
    invalid_photo:'Choose a different plant photograph and try again.',invalid_update:'Add a field note or a plant photograph.',
    invalid_image:'This photo could not be read. Choose another photo.',future_observation:'Choose today or an earlier date.',image_too_large:'Choose a smaller photo.',plant_not_verified:'Verify the physical tag in the plant register first.',variety_name_locked:'This variety is already used. Keep its name or add a new variety.',planting_exists:'An existing planting needs a replacement review.',planting_changed:'The planting changed. Refresh the farm workspace and check the tree before continuing.',answer_changed:'Another reply is already saved. Refresh the school requests.',update_withdrawn:'This update has already been withdrawn.',request_conflict:'This draft differs from an update already saved. Check previous updates before posting another.'
  };
  async function api(path, body) {
    let response;
    try {
      response = await fetch(base + path, {method:body ? 'POST' : 'GET',credentials:'same-origin',cache:'no-store',
        headers:body ? {'Content-Type':'application/json'} : {},body:body ? JSON.stringify(body) : undefined,
        signal:AbortSignal.timeout(45000)});
    } catch { throw Error('Connection interrupted. Keep this page open and retry.'); }
    if (!response.headers.get('Content-Type')?.includes('application/json')) throw Error('Please sign in again in another tab, then retry here.');
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 409) { $('retry').textContent = 'Refresh farm workspace'; $('retry').hidden = false; }
      throw Error(knownErrors[data.error] || (response.status === 409 ? 'This record has changed. Refresh to check the latest details.' :
      response.status === 403 ? 'This action needs an authorised staff account.' : response.status === 400 ? 'Check the field details and try again.' :
      'The farm service is unavailable. Keep this page open and retry.'));
    }
    return data;
  }

  const openSchoolFiles=mountRecognitionFiles(api);
  function showTab(focus = false) {
    let tab = location.hash.slice(1);
    if (!['register','requests','update','atlas','messages','school-files','varieties'].includes(tab) || (tab === 'requests' && dashboard?.role === 'farmer')) tab = 'update';
    for (const id of ['update','requests','register','atlas','messages','school-files','varieties']) $(id).hidden = !dashboard || id !== tab;
    for (const link of document.querySelectorAll('nav a')) {
      if (link.hash === '#' + tab) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
      link.hidden = link.hash === '#requests' && dashboard?.role === 'farmer';
    }
    if (dashboard && tab==='school-files') openSchoolFiles();
    if (dashboard && tab==='varieties') openVarieties();
    if (dashboard && tab==='messages' && !$('farmer-threads').firstElementChild) {
      $('farmer-threads').append(plantThreadsPanel({staff:true,api:(path,body)=>api(path.slice('/plants'.length),body)}));
    }
    if (focus && dashboard) $(tab + '-heading').focus();
  }
  window.addEventListener('hashchange', () => { message(''); showTab(true); });

  function option(value, label) { return new Option(label,value); }
  function updateSelectors() {
    const registerChoice = $('field-position').value;
    const groups = new Map();
    for (const item of dashboard.plants) {
      const label = 'Row ' + item.row;
      if (!groups.has(label)) groups.set(label,[]);
      groups.get(label).push(item);
    }
    if (dashboard.archivedPlants?.length) groups.set('Hidden from atlas',dashboard.archivedPlants);
    const options = [option('','Choose a tree…')];
    for (const [label,items] of groups) {
      const group = element('optgroup'); group.label = label;
      group.append(...items.map(p => option(p.key,p.label + (p.tag ? ' · ' + p.tag : ' · tag needed'))));
      options.push(group);
    }
    $('update-plant').replaceChildren(...options);
    $('field-position').replaceChildren(...dashboard.plants.map(item => option(item.key,position(item))));
    if (dashboard.plants.some(p => p.key === registerChoice)) $('field-position').value = registerChoice;
    $('empty-field').hidden = groups.size > 0;
    $('tree-picker').hidden = !groups.size;
    for (const [key,pending] of fieldStageDrafts) {
      if (plant(key)?.revision !== pending.revision) fieldStageDrafts.delete(key);
    }
    atlas.refresh(dashboard); renderRegister(); renderTree();
    if (treeKey && !selected()) {
      $('find-result').textContent = 'That tree is unavailable. Choose a tree from the register.';
    }
  }

  function chooseTree(key) {
    if (writing || !plant(key)) return;
    treeKey = key;
    const url = new URL(location.href);
    url.searchParams.set('plant',key);
    window.history.replaceState(null,'',url);
    $('quick-tag').value = ''; $('find-tree-input').value = ''; $('find-result').textContent = '';
    $('field-stage-result').textContent = ''; $('posted-result').hidden = true;
    $('field-stage-panel').open = false; $('date-options').open = false; $('history').open = false;
    message(''); renderTree(); loadHistory();
    $('tree-id').focus({preventScroll:true});
  }

  $('find-tree').addEventListener('submit',event => {
    event.preventDefault();
    const query = $('find-tree-input').value.trim().toLowerCase();
    const printed = query.match(/^p?\s*0*([1-9]\d*)$/);
    const plants = [...dashboard.plants,...(dashboard.archivedPlants || [])];
    const matches = plants.filter(p => (printed && p.label === 'P'+printed[1]) || p.tag?.toLowerCase() === query);
    if (matches.length === 1) { chooseTree(matches[0].key); return; }
    $('find-result').textContent = matches.length ? 'More than one match. Choose the tree by row.' : 'No matching tree. Check its ID or browse by row.';
    $('find-tree-input').focus();
  });
  $('update-plant').addEventListener('change',() => {
    if ($('update-plant').value) chooseTree($('update-plant').value);
    else $('update-plant').value = treeKey;
  });

  function renderTree() {
    const p = selected();
    fieldReport.selectTree(p);
    $('update-plant').value = p?.key || '';
    $('tree-work').hidden = !p; $('tree-picker').open = !p;
    $('picker-label').textContent = p ? 'Change tree' : 'Choose a tree';
    if (!p) { $('update-form').hidden = true; $('quick-verify').hidden = true; $('history').hidden = true; return; }
    const verified = p.status !== 'unverified', visible = dashboard.plants.includes(p);
    $('quick-verify').hidden = verified; $('update-form').hidden = !verified; $('history').hidden = !verified;
    $('tree-id').textContent = p.label;
    $('tree-place').textContent = ['Row ' + p.row + ' · Position ' + p.position,p.tag ? 'Tag ' + p.tag : null,!visible ? 'Hidden from atlas' : null].filter(Boolean).join(' · ');
    $('quick-tag-label').textContent = 'Physical tag for ' + p.label;
    $('field-art').hidden = !STAGE_NAMES[p.stage-1];
    if (!$('field-art').hidden) setPlantIllustration($('field-art'),'https://theglenolia.com.au/assets/plant-portal/stages',p.stage,p);
    $('field-stage-panel').hidden = !visible || !dashboard.rows?.length;
    $('field-stage-current').textContent = STAGE_NAMES[p.stage-1] || '';
    $('field-stage').value = String(fieldStageDrafts.get(p.key)?.value || p.stage);
    syncFieldStage();
    if (verified) renderDraft();
  }

  $('quick-verify').addEventListener('submit',event => {
    event.preventDefault();
    const p = selected(), tag = $('quick-tag').value.trim();
    if (!p || p.status !== 'unverified' || !tag) return;
    run(async () => {
      await api('/verify',{key:p.key,tag});
      $('quick-tag').value = '';
      await reload(p.label + ' verified. You can now post a field update.');
    });
  });
  for (const [index,title] of STAGE_NAMES.entries()) $('field-stage').add(option(String(index+1),(index+1)+' · '+title));
  function syncFieldStage() {
    const p = selected();
    $('save-field-stage').disabled = !p || Number($('field-stage').value) === p.stage;
  }
  $('field-stage').addEventListener('change',() => {
    const p = selected();
    if (!p) return;
    const value = Number($('field-stage').value);
    if (value === p.stage) fieldStageDrafts.delete(p.key);
    else fieldStageDrafts.set(p.key,{revision:p.revision,value});
    $('field-stage-result').textContent = ''; syncFieldStage();
  });
  $('field-stage-form').addEventListener('submit',event => {
    event.preventDefault();
    const p = selected(), pending = p && fieldStageDrafts.get(p.key);
    if (!pending || !STAGE_NAMES[pending.value-1]) return;
    run(async () => {
      await api('/stage',{key:p.key,stage:pending.value,revision:pending.revision});
      fieldStageDrafts.delete(p.key);
      await reload('Stage saved for '+p.label+'.',$('field-stage-result'));
    });
  });
  function renderRegister() {
    const item = plant($('field-position').value);
    $('register-form').hidden = !item; $('register-empty').hidden = Boolean(item);
    if (!item) return;
    const verified = item.status !== 'unverified';
    $('register-state').textContent = item.stage === 1 ? 'Soil preparation' : (statuses[item.status] || item.status);
    $('tag-hint').textContent = item.stage === 1 ? 'You can tag this position while preparing the soil. School offers require a planted stage.' : 'Verify the tag before offering this plant to a school.';
    $('tag-fields').hidden = verified; $('field-tag').required = !verified;
    $('manage-tag').hidden = !verified; $('tag-description').textContent = verified ? 'Field tag · ' + item.tag : '';
    $('availability').hidden = item.stage === 1 || !['available','unavailable'].includes(item.status);
    $('availability').textContent = item.status === 'available' ? 'Hold at farm' : 'Make available to schools';
  }
  function renderDraft() {
    const p = selected();
    if (!p) return;
    const visible = dashboard.plants.includes(p);
    const d = draft(p.key);
    $('update-note').value = d.note; $('observed-on').value = d.date; $('observed-on').max = today();
    $('post-update').textContent = 'Post update to ' + p.label;
    $('school-visibility').textContent = !visible ? 'This position is hidden from the public atlas. Notes and photos stay in its journal.' :
      ['active','cooling'].includes(p.status) ? 'The school can read this update when you post.' : 'Its class can read these observations once a teacher accepts the plant.';
    $('preview-date').textContent = d.date === today() ? 'today' : displayDate(d.date);
    $('photo-review').hidden = !d.url;
    if (d.url) $('preview-photo').src = d.url; else $('preview-photo').removeAttribute('src');
    $('preview-photo').hidden = !d.url; $('remove-photo').hidden = !d.url;
  }
  function captureDraft() {
    if (!selected()) return;
    const d = draft(selected().key), note = $('update-note').value, date = $('observed-on').value;
    if (d.date !== date || d.note !== note) { d.requestId = null; $('posted-result').hidden = true; }
    d.note = note; d.date = date;
    $('preview-date').textContent = date === today() ? 'today' : displayDate(date);
  }
  $('update-note').addEventListener('input',captureDraft); $('observed-on').addEventListener('input',captureDraft);
  $('observed-on').addEventListener('invalid',() => { $('date-options').open = true; });
  $('field-position').addEventListener('change',() => { $('field-tag').value = ''; renderRegister(); });
  $('remove-photo').addEventListener('click',() => { clearPhoto(draft(selected().key)); renderDraft(); $('library-file').focus(); });
  $('remove-stage-photo').addEventListener('click',()=>{
    const tree=selected();if(!tree || !window.confirm('Remove the public stage photo for '+tree.label+'?'))return;
    run(async()=>{await api('/stage-photo',{key:tree.key,stage:tree.stage,expectedPlantingId:tree.plantingId,remove:true});
      $('stage-photo-result').textContent='Public stage photo removed for '+tree.label+'.';});
  });
  $('stage-photo-form').addEventListener('submit',event=>{
    event.preventDefault();const tree=selected(),file=$('stage-photo').files[0];
    if(!tree || tree.status==='unverified' || !file)return;
    run(async()=>{
      $('stage-photo-result').textContent='Preparing photo…';
      const image=await prepareFieldPhoto(file,true);
      await api('/stage-photo',{key:tree.key,stage:tree.stage,expectedPlantingId:tree.plantingId,photo:{mime:image.type,base64:await base64(image)}});
      $('stage-photo').value='';
      $('stage-photo-result').textContent='Stage photo published for '+tree.label+'.';
    });
  });


  function element(tag, text, cls) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  }
  function action(label, fn, cls) {
    const b = element('button',label,cls); b.type = 'button'; b.addEventListener('click',fn); return b;
  }
  async function run(operation) {
    if (writing) return;
    writing = true;
    const enabled = [...document.querySelectorAll('main input,main button,main select,main textarea')].filter(control => !control.disabled);
    for (const control of enabled) control.disabled = true;
    $('main').setAttribute('aria-busy','true');
    try { await operation(); }
    catch (error) { message(error.message,true); }
    finally { for (const control of enabled) control.disabled = false; $('main').removeAttribute('aria-busy'); writing = false; atlas.syncButtons(); syncFieldStage(); }
  }
  function formLabel(text, control) {
    const label = element('label',text); label.htmlFor = control.id; return label;
  }
  function requestedPosition(key) {
    if (!key) return 'Open to any plant';
    const preferred = plant(key);
    if (preferred) return 'Preference · ' + position(preferred);
    const match = /^r(\d+)-p(\d+)$/.exec(key);
    return match ? 'Preference · Row ' + match[1] + ', position ' + match[2] + ' (hidden from atlas)' : 'Previously selected position';
  }
  function schoolDetails(box, application) {
    const org = application.organisation;
    if (org) {
      const details = element('details',null,'school-profile');
      details.append(element('summary','Organisation details'));
      if (org.address) details.append(element('p',org.address));
      if (org.logoUrl && /^\/api\/education\/plants\/organisation-logo\/[\da-f-]{36}$/i.test(org.logoUrl)) {
        const logo = element('img',null,'school-logo');
        logo.src=org.logoUrl; logo.alt=(org.name || 'School')+' logo'; logo.loading='lazy'; details.append(logo);
      }
      box.append(details);
    }
    if (Number.isInteger(application.schoolSlotCount)) {
      const active = application.activeTreeCount || 0;
      box.append(element('p',active+' adopted or cooling · '+application.schoolSlotCount+' of 3 places in use','hint'));
    }
    if (application.reason) {
      box.append(element('h4','Why the school needs this tree'),element('p',application.reason));
    }
    if (application.withdrawalReason) {
      box.append(element('h4','Reason for withdrawal'),element('p',application.withdrawalReason));
    }
    if (application.status === 'cooling' && application.releaseAt) {
      box.append(element('p','Reserved until '+farmTime(application.releaseAt),'field-state'));
    }
  }
  function renderRequests() {
    const cards = [];
    if (dashboard.role === 'farmer') { $('adoption-events').replaceChildren(); $('applications').replaceChildren(); return; }
    const available = dashboard.plants.filter(item => item.status === 'available' && item.stage !== 1);
    for (const application of dashboard.applications) {
      const box = element('article',null,'request'), assigned = plant(application.plantKey);
      box.append(element('p',applicationStatuses[application.status] || application.status,'eyebrow'),element('h3',application.schoolName),
        element('p',[application.suburb,application.schoolType,application.email].filter(Boolean).join(' · ')),
        element('p',assigned ? 'Plant · ' + name(assigned) : requestedPosition(application.preferredKey),'hint'));
      schoolDetails(box,application);
      if (application.status === 'pending') {
        const choose = element('select'); choose.id = 'offer-' + application.id;
        choose.append(option('','Choose a verified plant'), ...available.map(item => option(item.key,name(item))));
        if (available.some(item => item.key === application.preferredKey)) choose.value = application.preferredKey;
        box.append(formLabel('Offer a plant',choose),choose);
        const controls = element('div',null,'actions');
        const offer = action('Offer plant',() => {
          if (!choose.value) { choose.setCustomValidity('Choose an available plant.'); choose.reportValidity(); return; }
          run(async () => { await api('/review',{applicationId:application.id,decision:'offer',plantKey:choose.value}); await reload('Plant offered. The teacher can accept it in their portal.'); });
        });
        choose.addEventListener('change',() => choose.setCustomValidity('')); offer.disabled = !available.length;
        controls.append(offer,action('Decline application',() => {
          if (!window.confirm('Decline the application from ' + application.schoolName + '?')) return;
          run(async () => { await api('/review',{applicationId:application.id,decision:'decline'}); await reload('Application declined.'); });
        },'quiet')); box.append(controls);
        if (!available.length) box.append(element('p','Verify a field tag or release a held plant to make an offer.','hint'));
      }
      if (application.status === 'offered') {
        box.append(action('Withdraw offer',() => {
          if (!window.confirm('Return this offer from ' + application.schoolName + ' to the review queue?')) return;
          run(async () => {
            await api('/review',{applicationId:application.id,decision:'withdraw'});
            await reload('Offer withdrawn. The school application is back in review.');
          });
        },'quiet'));
      }
      cards.push(box);
    }
    const schoolNames = new Map(dashboard.applications.map(a => [a.orgId,a.organisation?.name || a.schoolName]));
    const events = (dashboard.events || []).map(event => {
      const line=element('li');
      const title=event.action.replaceAll('_',' ');
      const p=plant(event.plantKey);
      line.append(element('strong',title.charAt(0).toUpperCase()+title.slice(1)),
        element('p',[schoolNames.get(event.orgId),p ? position(p) : null,farmTime(event.createdAt)].filter(Boolean).join(' · '),'hint'));
      if(event.reason) line.append(element('p',event.reason));
      return line;
    });
    $('adoption-history').hidden = !events.length;
    $('adoption-events').replaceChildren(...events);
    $('applications').replaceChildren(...(cards.length ? cards : [element('p','No school applications yet.','quiet-state')]));
  }

  $('register-form').addEventListener('submit',event => {
    event.preventDefault(); const p = plant($('field-position').value), tag = $('field-tag').value.trim();
    if (!p || p.status !== 'unverified' || !tag) return;
    run(async () => {
      await api('/verify',{key:p.key,tag}); $('field-tag').value = '';
      await reload('Field tag verified. You can now post an update for ' + position(p) + '.');
    });
  });
  $('field-observe').addEventListener('click',() => {
    const p = plant($('field-position').value);
    if (!p || p.status === 'unverified') return;
    chooseTree(p.key); location.hash = 'update';
  });
  $('availability').addEventListener('click',() => {
    const p = plant($('field-position').value); if (!p) return;
    const available = p.status === 'unavailable';
    run(async () => { await api('/availability',{key:p.key,available}); await reload(available ? 'Plant is available for school offers.' : 'Plant held at the farm.'); });
  });

  $('next-tree').addEventListener('click',() => chooseTree($('next-tree').dataset.key));

  function photoPath(value) {
    if (typeof value !== 'string' || !value.startsWith(base + '/')) return null;
    const url = new URL(value,location.origin);
    return url.origin === location.origin && url.pathname.startsWith(base + '/') ? url.href : null;
  }
  function observationConditions(update, p) {
    const weather = update.weather;
    const info = element('details',null,'observation-log');
    info.append(element('summary','Observation log'));
    const stamp = farmTime(weather?.loggedAt || update.createdAt);
    const place = weather?.location?.name || 'Glenorie';
    info.append(element('p',[place,position(p),stamp].filter(Boolean).join(' · '),'hint'));
    if (!weather) {
      info.append(element('p','No weather snapshot for this entry.','hint'));
      return info;
    }
    const current=weather.current;
    if (current) {
      const readings = [[current.temperatureC,' °C'],[current.humidityPct,'% humidity'],[current.windKmh,' km/h wind']]
        .filter(([value])=>Number.isFinite(value)).map(([value,unit])=>value+unit);
      if (readings.length) {
        info.append(element('p',readings.join(' · ')),
          element('p',[current.source,farmTime(current.validAt),current.stale?'Last available reading':''].filter(Boolean).join(' · '),'hint'));
      }
    } else {
      info.append(element('p','Regional weather was unavailable when this entry was logged.','hint'));
    }
    const daily = weather.observedDay, rain=weather.rainfall;
    if (daily && Number.isFinite(daily.rainfallMm)) {
      info.append(element('p','Observation-day rainfall · '+daily.rainfallMm+' mm · '+displayDate(daily.day)+' · '+daily.source,'hint'));
    } else if (rain && Number.isFinite(rain.mm)) {
      info.append(element('p','Latest daily rainfall · '+rain.mm+' mm · '+displayDate(rain.day)+' · '+rain.source,'hint'));
    } else {
      info.append(element('p','Daily rainfall was unavailable for this entry.','hint'));
    }
    return info;
  }
  async function loadHistory() {
    const version = ++journalVersion, p = selected(), list = $('history-list');
    list.replaceChildren();
    if (!p || p.status === 'unverified' || !$('history').open) return;
    list.append(element('p','Loading updates…'));
    try {
      const {updates} = await api('/journal?key=' + encodeURIComponent(p.key));
      if (version !== journalVersion) return;
      const rows = updates.map(update => {
        const row = element('article',null,'log-entry'); row.append(element('h3',(update.previousPlanting?'Previous planting · ':'')+displayDate(update.observedOn)));
        if (update.note) row.append(element('p',update.note));
        if (photoPath(update.photoUrl)) {
          const image = element('img'); image.src = photoPath(update.photoUrl); image.alt = 'Field photograph of ' + name(p); image.loading = 'lazy'; row.append(image);
        }
        row.append(observationConditions(update,p));
        if (update.withdrawn) row.append(element('p','Withdrawn from classroom view','field-state'));
        else row.append(action('Withdraw update',() => {
          if (!window.confirm('Remove this observation and its photograph from the class journal?')) return;
          run(async () => { await api('/withdraw-update',{updateId:update.id}); await loadHistory(); message('Update withdrawn from the journal.',true); });
        },'text'));
        return row;
      });
      list.replaceChildren(...(rows.length ? rows : [element('p','No observations recorded yet.','hint')]));
    } catch (error) { if (version === journalVersion) list.replaceChildren(element('p',error.message),action('Retry history',loadHistory,'quiet')); }
  }
  $('history').addEventListener('toggle',loadHistory);

  async function choosePhoto(input) {
    const f = input.files[0], p = selected(); if (!f || !p) return;
    input.value = ''; const d = draft(p.key);
    await run(async () => {
      message('Preparing your photograph…');
      const blob = await prepareFieldPhoto(f, true);
      clearPhoto(d); d.blob = blob; d.url = URL.createObjectURL(blob); $('posted-result').hidden = true; renderDraft(); message('Photo ready for '+p.label+'.');
    });
  }
  for (const id of ['camera-file','library-file']) $(id).addEventListener('change',() => choosePhoto($(id)));
  function base64(blob) {
    return new Promise((resolve,reject) => { const reader = new FileReader(); reader.onerror = () => reject(Error('Please select the photograph again.'));
      reader.onload = () => resolve(reader.result.slice(reader.result.indexOf(',') + 1)); reader.readAsDataURL(blob); });
  }
  $('update-form').addEventListener('submit',event => {
    event.preventDefault(); const p = selected(); if (!p || p.status === 'unverified') return; captureDraft(); const d = draft(p.key);
    if (!d.note.trim() && !d.blob) { message('Add a field note or a photograph.'); $('update-note').focus(); return; }
    run(async () => {
      message('Posting your observation…'); d.requestId ||= crypto.randomUUID();
      const body = {key:p.key,expectedPlantingId:p.plantingId,observedOn:d.date,note:d.note.trim(),requestId:d.requestId};
      if (d.blob) body.photo = {mime:d.blob.type,base64:await base64(d.blob)};
      await api('/update',body);
      clearPhoto(d); drafts.delete(p.key); renderDraft(); await loadHistory();
      const index = dashboard.plants.findIndex(item => item.key === p.key);
      const next = index >= 0 ? dashboard.plants[index+1] : null;
      $('posted-message').textContent = 'Update posted to '+p.label+'.';
      $('next-tree').hidden = !next;
      $('next-tree').dataset.key = next?.key || '';
      $('next-tree').textContent = next ? 'Next tree · '+next.label : '';
      message(''); $('posted-result').hidden = false; $('posted-message').focus();
    });
  });

  async function reload(success, localResult = null) {
    if (reading) return; reading = true;
    try {
      const next = await api('/dashboard');
      if (!Array.isArray(next.plants) || !Array.isArray(next.applications) || !Array.isArray(next.questions)) throw Error('The farm workspace could not load. Retry in a moment.');
      dashboard = next; updateSelectors(); renderRequests(); showTab(); $('retry').hidden = true;
      $('retry').textContent = 'Retry loading';
      $('main').querySelector('nav').hidden = false;
      if (next.role === 'farmer') { const home = document.querySelector('header a'); home.href = '/plants'; home.setAttribute('aria-label','The Glenolia farm workspace'); }
      await loadHistory();
      if (localResult) { message(''); localResult.textContent = success; }
      else message(success || '',Boolean(success));
    } catch (error) {
      message((success ? success + ' ' : '') + error.message,true); $('retry').hidden = false;
    } finally { reading = false; }
  }
  $('retry').addEventListener('click',() => reload());
  showTab(); reload();
})();
