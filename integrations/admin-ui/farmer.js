import {prepareFieldPhoto} from './photo-preparation.js';
import {mountFarmAtlas} from './farm-atlas.js';
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const base = '/api/education/plants';
  const statuses = {unverified:'Needs a field check',available:'Available for schools',unavailable:'Held at the farm',offered:'Offered to a school',active:'School following',cooling:'Withdrawal cooling period'};
  const applicationStatuses = {pending:'Awaiting review',offered:'Awaiting teacher acceptance',active:'School following',declined:'Declined',cooling:'Withdrawal cooling period',released:'Adoption ended',cancelled:'Cancelled'};
  const drafts = new Map();
  let dashboard = null, journalVersion = 0, reading = false, writing = false;
  const atlas = mountFarmAtlas({api,run,reload});

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
  function selected() { return plant($('update-plant').value); }
  function draft(key) {
    if (!drafts.has(key)) drafts.set(key,{date:today(),note:'',blob:null,url:'',requestId:null});
    return drafts.get(key);
  }
  function clearPhoto(d) {
    if (d.url) URL.revokeObjectURL(d.url);
    d.url = ''; d.blob = null; d.requestId = null;
  }
  function dirty() { return atlas.hasChanges() || [...drafts.values()].some(d => d.note.trim() || d.blob); }
  window.addEventListener('beforeunload', event => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } });

  const knownErrors = {
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
    invalid_image:'This photo could not be read. Choose another photo.',future_observation:'Choose today or an earlier date.',image_too_large:'Choose a smaller photo.',plant_not_verified:'Verify the physical tag in the plant register first.',answer_changed:'Another reply is already saved. Refresh the school requests.',update_withdrawn:'This update has already been withdrawn.',request_conflict:'This draft differs from an update already saved. Check previous updates before posting another.'
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

  function showTab(focus = false) {
    let tab = location.hash.slice(1);
    if (!['register','requests','update','atlas'].includes(tab) || (tab === 'requests' && dashboard?.role === 'farmer')) tab = 'update';
    for (const id of ['update','requests','register','atlas']) $(id).hidden = !dashboard || id !== tab;
    for (const link of document.querySelectorAll('nav a')) {
      if (link.hash === '#' + tab) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
      link.hidden = link.hash === '#requests' && dashboard?.role === 'farmer';
    }
    if (focus && dashboard) $(tab + '-heading').focus();
  }
  window.addEventListener('hashchange', () => { message(''); showTab(true); });

  function option(value, label) { return new Option(label,value); }
  function updateSelectors() {
    const previous = $('update-plant').value, registerChoice = $('field-position').value;
    const verified = dashboard.plants.filter(item => item.status !== 'unverified');
    const hidden = dashboard.archivedPlants || [];
    const updateOptions = verified.map(item => option(item.key,name(item)));
    if (hidden.length) {
      const archived = element('optgroup'); archived.label = 'Hidden from atlas';
      archived.append(...hidden.map(item => option(item.key,name(item))));
      updateOptions.push(archived);
    }
    $('update-plant').replaceChildren(...updateOptions);
    if ([...verified,...hidden].some(item => item.key === previous)) $('update-plant').value = previous;
    $('field-position').replaceChildren(...dashboard.plants.map(item => option(item.key,position(item))));
    if (dashboard.plants.some(p => p.key === registerChoice)) $('field-position').value = registerChoice;
    const hasFieldRecord = verified.length > 0 || hidden.length > 0;
    $('empty-field').hidden = hasFieldRecord; $('update-form').hidden = !hasFieldRecord;
    $('history').hidden = !hasFieldRecord;
    atlas.refresh(dashboard); renderRegister(); renderDraft();
  }
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
    const visible = dashboard.plants.some(item => item.key === p.key);
    $('update-atlas').hidden = !dashboard.rows?.length || !visible;
    const d = draft(p.key);
    $('update-note').value = d.note; $('observed-on').value = d.date; $('observed-on').max = today();
    $('preview-plant').textContent = name(p);
    $('school-visibility').textContent = !visible ? 'This position is hidden from the public atlas. Notes and photos stay in its journal.' :
      p.status === 'active' ? 'Its teacher can see the update as soon as you post.' : 'Its class can read these observations once a teacher accepts the plant.';
    $('preview-date').textContent = displayDate(d.date);
    $('preview-note').textContent = d.note.trim() || (d.url ? '' : 'Your field note or photograph will appear here.');
    if (d.url) $('preview-photo').src = d.url; else $('preview-photo').removeAttribute('src');
    $('preview-photo').hidden = !d.url; $('remove-photo').hidden = !d.url;
  }
  function captureDraft() {
    if (!selected()) return;
    const d = draft(selected().key), note = $('update-note').value, date = $('observed-on').value;
    if (d.date !== date || d.note !== note) d.requestId = null;
    d.note = note; d.date = date;
    $('preview-date').textContent = displayDate(date);
    $('preview-note').textContent = note.trim() || (d.url ? '' : 'Your field note or photograph will appear here.');
  }
  $('update-note').addEventListener('input',captureDraft); $('observed-on').addEventListener('input',captureDraft);
  $('update-plant').addEventListener('change',() => { renderDraft(); loadHistory(); });
  $('field-position').addEventListener('change',() => { $('field-tag').value = ''; renderRegister(); });
  $('update-atlas').addEventListener('click',() => atlas.openPlant(selected()));
  $('remove-photo').addEventListener('click',() => { clearPhoto(draft(selected().key)); renderDraft(); $('library-file').focus(); });

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
    finally { for (const control of enabled) control.disabled = false; $('main').removeAttribute('aria-busy'); writing = false; atlas.syncButtons(); }
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
    const cards = [], inbox = [];
    if (dashboard.role === 'farmer') { $('adoption-events').replaceChildren(); $('questions').replaceChildren(); $('applications').replaceChildren(); return; }
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
    for (const item of dashboard.questions) {
      const box = element('article',null,'request'), app = dashboard.applications.find(a => a.id === item.applicationId);
      box.append(element('p',app?.schoolName || 'School question','eyebrow'),element('p',item.question));
      if (item.answer) box.append(element('p','Farm reply · ' + item.answer,'hint'));
      else {
        const form = element('form'), field = element('textarea'); field.id = 'answer-' + item.id; field.required = true; field.maxLength = 800; field.rows = 2;
        const button = element('button','Send private reply'); button.type = 'submit';
        form.append(formLabel('Private reply to the class',field),field,button);
        form.addEventListener('submit',e => { e.preventDefault();
          if (!field.value.trim()) { field.focus(); return; }
          run(async () => { await api('/answer',{questionId:item.id,answer:field.value.trim()}); await reload('Reply saved in the class portal.'); });
        }); box.append(form);
      }
      inbox.push(box);
    }
    $('applications').replaceChildren(...(cards.length ? cards : [element('p','No school applications yet.','quiet-state')]));
    $('questions').replaceChildren(...(inbox.length ? inbox : [element('p','No class questions yet.','quiet-state')]));
  }

  $('register-form').addEventListener('submit',event => {
    event.preventDefault(); const p = plant($('field-position').value), tag = $('field-tag').value.trim();
    if (!p || p.status !== 'unverified' || !tag) return;
    run(async () => {
      await api('/verify',{key:p.key,tag}); $('field-tag').value = '';
      await reload('Field tag verified. You can now post an update for ' + position(p) + '.');
      if (plant(p.key)?.status !== 'unverified') { $('update-plant').value = p.key; renderDraft(); }
    });
  });
  $('field-observe').addEventListener('click',() => {
    const p = plant($('field-position').value);
    if (!p || p.status === 'unverified') return;
    $('update-plant').value = p.key; renderDraft(); loadHistory(); location.hash = 'update';
  });
  $('availability').addEventListener('click',() => {
    const p = plant($('field-position').value); if (!p) return;
    const available = p.status === 'unavailable';
    run(async () => { await api('/availability',{key:p.key,available}); await reload(available ? 'Plant is available for school offers.' : 'Plant held at the farm.'); });
  });

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
    if (!p || !$('history').open) return;
    list.append(element('p','Loading updates…'));
    try {
      const {updates} = await api('/journal?key=' + encodeURIComponent(p.key));
      if (version !== journalVersion) return;
      const rows = updates.map(update => {
        const row = element('article',null,'log-entry'); row.append(element('h3',displayDate(update.observedOn)));
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
      clearPhoto(d); d.blob = blob; d.url = URL.createObjectURL(blob); renderDraft(); message('Photo ready. Check your class preview.');
    });
  }
  for (const id of ['camera-file','library-file']) $(id).addEventListener('change',() => choosePhoto($(id)));
  function base64(blob) {
    return new Promise((resolve,reject) => { const reader = new FileReader(); reader.onerror = () => reject(Error('Please select the photograph again.'));
      reader.onload = () => resolve(reader.result.slice(reader.result.indexOf(',') + 1)); reader.readAsDataURL(blob); });
  }
  $('update-form').addEventListener('submit',event => {
    event.preventDefault(); captureDraft(); const p = selected(); if (!p) return; const d = draft(p.key);
    if (!d.note.trim() && !d.blob) { message('Add a field note or a photograph.'); $('update-note').focus(); return; }
    run(async () => {
      message('Posting your observation…'); d.requestId ||= crypto.randomUUID();
      const body = {key:p.key,observedOn:d.date,note:d.note.trim(),requestId:d.requestId};
      if (d.blob) body.photo = {mime:d.blob.type,base64:await base64(d.blob)};
      await api('/update',body);
      clearPhoto(d); drafts.delete(p.key); renderDraft(); await loadHistory();
      message('Posted to the journal for ' + name(p) + '.',true);
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
