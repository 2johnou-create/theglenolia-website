import { installFarmWeather } from './farm-weather.js';
import { STAGE_NAMES } from './stages.js';
import { setPlantIllustration, stageIllustrationFile } from './plant-illustration.js';

const byId = id => document.getElementById(id);
const main = byId('main');
const explorer = byId('row-app');
const card = byId('plant-card');
const dialog = byId('plant-dialog');
const jumpList = byId('row-jump');
const dialogRows = byId('list-row');
const markerLayer = byId('atlas-plants');
const assets = main.dataset.atlasAssets;
const ns = 'http://www.w3.org/2000/svg';
const mobileCard = matchMedia('(max-width:760px),(pointer:coarse)');
const smallArt = matchMedia('(max-width:620px)');
const preferenceKey = 'glenolia.atlas.preference';
const svg = (name, attributes, value) => {
  const node = document.createElementNS(ns, name);
  for (const [key, val] of Object.entries(attributes)) node.setAttribute(key, val);
  if (value !== undefined) node.textContent = value;
  return node;
};
const canRequest = plant => plant && !plant.adoptionStatus && plant.stage !== 1 && ['available','unverified'].includes(plant.status);
function showIllustrationSet() {
  const list = byId('stage-plates');
  const choice = byId('stage-set').value;
  if (!byId('stage-guide').open || list.dataset.set === choice) return;
  list.replaceChildren(...STAGE_NAMES.map((name,index) => {
    const li = document.createElement('li');
    const drawing = new Image(70,79);
    drawing.alt = ''; drawing.src = assets + '/stages/' + stageIllustrationFile(index+1, Number(choice));
    const caption = document.createElement('span');
    caption.textContent = (index+1) + '. ' + name;
    li.append(drawing,caption);
    return li;
  }));
  list.dataset.set = choice;
}
byId('stage-guide').addEventListener('toggle',showIllustrationSet);
byId('stage-set').addEventListener('change',showIllustrationSet);
function readPreference() {
  try { return sessionStorage.getItem(preferenceKey); } catch { return null; }
}
function savePreference(value) {
  preferred = value;
  try {
    if (value) sessionStorage.setItem(preferenceKey, value);
    else sessionStorage.removeItem(preferenceKey);
  } catch { /* The map also works when browser storage is unavailable. */ }
}
let register = new Map();
let rows = [];
let markers = new Map();
let preferred = readPreference();
let active = null;
let mode = '';
let currentRow = 1;
let explicitRow = null;
let pendingScroll = false;
let rovingKey = null;
let hideTimer = 0;
let lastMouse = null;
let dismissedAt = null;
let restoringFocus = false;
let lastDrawn = null;
let fetching = false;
const viewport = byId('atlas-viewport');
const frame = byId('atlas-frame');
const picture = byId('estate-art');
const mobileSource = byId('mobile-art');
let artCheck = 0;
let initialView = true;
let previousMapWidth = 0;
let previousMapTop = 0;

function showArtState(state) {
  frame.dataset.artState = state;
  byId('art-notice').hidden = state === 'ready';
  byId('retry-art').hidden = state !== 'error';
  byId('art-message').textContent = state === 'error'
    ? 'The orchard illustration could not be loaded. You can still explore positions in the plant list.'
    : 'Loading the orchard illustration…';
  jumpList.disabled = !rows.length || state !== 'ready';
  if (state === 'ready' && initialView) {
    initialView = false;
    // Start in the pilot lanes; the hillside at the top is still reachable.
    viewport.scrollTop = frame.clientWidth * .04;
    explicitRow = currentRow;
  }
  if (state === 'ready') scrollChanged();
  if (active) positionCard();
}
async function checkArtwork() {
  const check = ++artCheck;
  if (!picture.complete || !picture.currentSrc) { showArtState('loading'); return; }
  if (!picture.naturalWidth) { showArtState('error'); return; }
  // A cached earlier candidate can briefly survive a viewport change.
  const file = smallArt.matches ? mobileSource.getAttribute('srcset') : picture.getAttribute('src');
  if (picture.currentSrc !== new URL(file,document.baseURI).href) { showArtState('loading'); return; }
  try {
    await picture.decode();
    if (check === artCheck) showArtState('ready');
  } catch {
    if (check === artCheck) showArtState('error');
  }
}
picture.addEventListener('load',checkArtwork);
picture.addEventListener('error',() => { ++artCheck; showArtState('error'); });
smallArt.addEventListener('change',() => {
  ++artCheck; showArtState('loading');
  requestAnimationFrame(checkArtwork);
});
byId('retry-art').onclick = () => {
  ++artCheck; showArtState('loading');
  const source = smallArt.matches ? mobileSource : picture;
  const attr = smallArt.matches ? 'srcset' : 'src';
  const url = new URL(source.getAttribute(attr),document.baseURI);
  url.searchParams.set('retry',String(Date.now()));
  source.setAttribute(attr,url.href);
};

function label(plant) { return 'P' + ((plant.row - 1) * 19 + plant.position); }
function adoptionText(plant) {
  if (plant.adoptionStatus === 'cooling')
    return (plant.adoptedBy || 'School adoption') + ' · Release pending';
  if (plant.adoptionStatus === 'adopted')
    return plant.adoptedBy ? 'Adopted by ' + plant.adoptedBy : 'Adopted by a school';
  return '';
}
function describe(plant) {
  if (plant.adoptionStatus) return adoptionText(plant) + (plant.adoptionStatus === 'cooling'
    ? '. This plant stays reserved during the five-working-day withdrawal period.' : '.');
  if (plant.stage === 1) return 'The farm is preparing this position for planting.';
  if (plant.status === 'available') return 'Field-verified and open for a school request.';
  if (plant.status === 'unavailable') return 'This plant is currently unavailable for a school request.';
  return 'You can request this position. The farmer will confirm the physical plant before allocation.';
}

// World coordinates register coffee positions to the illustrated rows between the magnolias.
function rootPoint(row, position) {
  const t = (position - 1) / 18;
  if (row <= 2) {
    const x = (row === 1 ? 148 : 110) + 1407 * t + 14 * Math.sin(Math.PI * t);
    const y = row === 1 ? 471 - .177 * x : 720 - .185 * x;
    return [x * 1000 / 1672, y * 1000 / 1672];
  }
  return [88 + 837 * t, 654 + (row - 3) * 174 - 151 * t];
}
function rowLabelPoint(row) {
  // Use the far headland for the row names so the full pilot is visible together.
  return [986,row === 1 ? 88 : row === 2 ? 233 : 470 + (row - 3) * 174];
}
function setRow(row) {
  currentRow = row;
  jumpList.value = String(row);
}
function jump(row, worldY = rootPoint(row,10)[1]) {
  explicitRow = row;
  setRow(row);
  if (frame.dataset.artState !== 'ready') return;
  viewport.scrollTo({top:worldY * frame.clientWidth / 1000 - viewport.clientHeight * .45, behavior:'instant'});
  previousMapWidth = frame.clientWidth;
  previousMapTop = viewport.scrollTop;
}
function readScroll() {
  pendingScroll = false;
  if (!rows.length || !frame.clientWidth || frame.dataset.artState !== 'ready') return;
  // Preserve the place in the drawing on rotation, including when the browser
  // clamps the old pixel scroll offset to a shorter image during the resize.
  if (previousMapWidth && previousMapWidth !== frame.clientWidth) {
    viewport.scrollTop = previousMapTop * frame.clientWidth / previousMapWidth;
  }
  previousMapWidth = frame.clientWidth;
  previousMapTop = viewport.scrollTop;
  const scale = frame.clientWidth / 1000;
  const start = viewport.scrollTop / scale;
  const end = (viewport.scrollTop + viewport.clientHeight) / scale;
  if (explicitRow === null) {
    const line = start + Math.min(84,(end-start) * .45);
    let nearest = rows[0].row, distance = Infinity;
    for (const {row} of rows) {
      const difference = Math.abs(rowLabelPoint(row)[1] - line);
      if (difference < distance) { nearest = row; distance = difference; }
    }
    const bottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1;
    setRow(bottom ? rows[rows.length-1].row : nearest);
  }
  // Tab moves on from empty lanes instead of pulling the map back to the pilot.
  const inView = plant => {
    if (!plant) return false;
    const y = rootPoint(plant.row,plant.position)[1];
    return y >= start && y <= end;
  };
  if (!inView(register.get(rovingKey))) {
    const first = [...register.values()].find(inView);
    setRoving(first?.key);
  }
  if (active && markers.has(active.key)) {
    const box = markers.get(active.key).getBoundingClientRect();
    const clip = viewport.getBoundingClientRect();
    if (box.bottom < Math.max(0,clip.top) || box.top > Math.min(innerHeight,clip.bottom)) dismiss();
    else positionCard();
  }
}
function scrollChanged() { if (!pendingScroll) { pendingScroll = true; requestAnimationFrame(readScroll); } }
function manualScroll() { explicitRow = null; }
for (const name of ['wheel','touchmove','pointerdown']) viewport.addEventListener(name,manualScroll,{passive:true});
viewport.addEventListener('keydown',event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
  const step = Math.max(1,viewport.clientHeight*.9);
  const offsets = {ArrowUp:-40,ArrowDown:40,PageUp:-step,PageDown:step,Home:-viewport.scrollHeight,End:viewport.scrollHeight};
  const offset = event.key === ' ' ? (event.shiftKey ? -step : step) : offsets[event.key];
  if (offset === undefined) return;
  manualScroll();
  const next = Math.max(0,Math.min(viewport.scrollHeight-viewport.clientHeight,viewport.scrollTop + offset));
  if (Math.abs(next-viewport.scrollTop) < 1) return;
  event.preventDefault(); viewport.scrollTop = next;
});
viewport.addEventListener('scroll',scrollChanged,{passive:true});
window.addEventListener('scroll',scrollChanged,{passive:true});
window.addEventListener('resize',scrollChanged,{passive:true});

function notice(message = '', retry = false) {
  byId('map-message').textContent = message;
  byId('retry-map').hidden = !retry;
  byId('map-notice').hidden = !message;
}
function updatePreference() {
  const choice = register.get(preferred);
  const back = byId('return-selected');
  back.hidden = !canRequest(choice);
  if (!back.hidden) {
    back.textContent = '↩ ' + label(choice);
    back.setAttribute('aria-label', 'Return to ' + label(choice));
  }
  for (const [key, marker] of markers) marker.setAttribute('aria-pressed', String(key === preferred));
}
function setRoving(key) {
  if (rovingKey && markers.has(rovingKey)) markers.get(rovingKey).setAttribute('tabindex','-1');
  rovingKey = key;
  if (markers.has(key)) markers.get(key).setAttribute('tabindex','0');
}
function positionCard() {
  if (!active || mobileCard.matches) return;
  const marker = markers.get(active.key);
  if (!marker) return;
  const box = (frame.dataset.artState === 'ready' ? marker : byId('plant-list')).getBoundingClientRect();
  const left = box.right + card.offsetWidth + 12 <= innerWidth ? box.right + 5 : box.left - card.offsetWidth - 5;
  card.style.left = Math.max(8, Math.min(left,innerWidth - card.offsetWidth - 8)) + 'px';
  const bar = explorer.querySelector('.atlas-tools').getBoundingClientRect();
  const topEdge = bar.top <= 1 ? Math.max(8,bar.bottom + 6) : 8;
  card.style.top = Math.max(topEdge, Math.min(box.top - .2 * card.offsetHeight,innerHeight - card.offsetHeight - 8)) + 'px';
}
function inspect(plant, nextMode, focus = false) {
  if (!plant) return;
  clearTimeout(hideTimer);
  if (active) markers.get(active.key)?.removeAttribute('data-preview');
  active = plant;
  mode = nextMode;
  if (mode !== 'hover') { explicitRow = plant.row; setRow(plant.row); }
  markers.get(plant.key)?.setAttribute('data-preview','');
  const selected = plant.key === preferred;
  card.hidden = false;
  card.dataset.mode = selected && nextMode !== 'hover' ? 'selected' : nextMode;
  card.dataset.key = plant.key;
  card.dataset.stage = String(plant.stage);
  byId('card-kind').textContent = (selected ? 'Class preference' : 'Planting position') + ' · Row ' + plant.row;
  byId('plant-title').textContent = label(plant);
  const farmerLink = byId('farmer-update');
  const farmerUrl = new URL(byId('farmer-login').href);
  farmerUrl.searchParams.set('plant',plant.key);
  farmerLink.href = farmerUrl.href;
  farmerLink.textContent = 'Farmer · Update ' + label(plant);
  setPlantIllustration(byId('card-image'), assets + '/stages', plant.stage, plant);
  byId('stage-title').textContent = STAGE_NAMES[plant.stage - 1];
  byId('stage-number').textContent = 'Stage ' + plant.stage + ' of 10';
  card.querySelector('.height').hidden = plant.stage === 1;
  card.querySelector('.cohort').hidden = plant.stage === 1 || plant.row > 2 || (plant.row === 2 && plant.position > 8);
  byId('plant-status').textContent = describe(plant);
  const select = byId('select-plant'), request = byId('request');
  select.hidden = selected || !canRequest(plant);
  select.textContent = 'Select ' + label(plant);
  request.hidden = !selected || !canRequest(plant);
  if (!request.hidden) request.href = main.dataset.teacher + '?prefer=' + plant.key;
  else request.removeAttribute('href');
  positionCard();
  if (focus) (select.hidden ? (request.hidden ? byId('close-card') : request) : select).focus({preventScroll:true});
}
function dismiss(restoreFocus = false) {
  clearTimeout(hideTimer);
  if (!active) return;
  const previous = active.key;
  markers.get(previous)?.removeAttribute('data-preview');
  active = null;
  mode = '';
  card.hidden = true;
  card.removeAttribute('data-key');
  dismissedAt = lastMouse;
  if (restoreFocus && markers.has(previous)) {
    setRoving(previous);
    restoringFocus = true;
    markers.get(previous).focus({preventScroll:true});
    restoringFocus = false;
  }
}
function delayDismiss() {
  clearTimeout(hideTimer);
  if (mode !== 'hover') return;
  hideTimer = setTimeout(() => {
    const marker = active && markers.get(active.key);
    if (mode === 'hover' && marker && !card.matches(':hover') && !card.contains(document.activeElement)
        && !marker.matches(':hover') && marker !== document.activeElement) dismiss();
  },220);
}
function trackMouse(event) {
  if (event.pointerType !== 'mouse') return;
  lastMouse = [event.clientX,event.clientY];
  if (dismissedAt && Math.hypot(lastMouse[0]-dismissedAt[0],lastMouse[1]-dismissedAt[1]) > 3) dismissedAt = null;
}
document.addEventListener('pointermove',trackMouse,{capture:true,passive:true});
document.addEventListener('pointerdown',trackMouse,{capture:true,passive:true});
document.addEventListener('pointerdown', event => {
  if (active && !event.target.closest('#plant-card,[data-plant-key],#return-selected')) dismiss();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && active && !dialog.open) { event.preventDefault(); dismiss(true); }
});
card.addEventListener('pointerenter', () => clearTimeout(hideTimer));
card.addEventListener('pointerleave',delayDismiss);
card.addEventListener('focusout',delayDismiss);
byId('close-card').onclick = event => dismiss(event.detail === 0);
byId('select-plant').onclick = () => {
  if (!canRequest(active)) return;
  savePreference(active.key);
  setRoving(active.key);
  updatePreference();
  inspect(active,'pinned',true);
  byId('selection-live').textContent = label(active) + ' selected as your class preference.';
};
function showPosition(plant, focus = false) {
  if (!plant) return;
  const y = rootPoint(plant.row,plant.position)[1];
  setRoving(plant.key);
  jump(plant.row,y);
  // A teacher can open the list from the toolbar before the map has entered the page viewport.
  const mark = markers.get(plant.key)?.getBoundingClientRect();
  if (frame.dataset.artState === 'ready' && mark && (mark.top < 0 || mark.bottom > innerHeight))
    viewport.scrollIntoView({block:'center',behavior:'instant'});
  inspect(plant,'pinned',focus);
}
byId('return-selected').onclick = () => showPosition(register.get(preferred),true);
jumpList.onchange = () => { dismiss(); jump(Number(jumpList.value)); };

const textMeasure = document.createElement('canvas').getContext('2d');
function shortAttribution(plant) {
  const name = plant.adoptedBy || (plant.adoptionStatus === 'cooling' ? 'Pending' : 'Adopted');
  if (!textMeasure) return name.length > 7 ? name.slice(0,6) + '…' : name;
  textMeasure.font = 'bold 9px Arial';
  const fits = text => textMeasure.measureText(text).width <= 40;
  if (fits(name)) return name;
  const compact = name.replace(/\bPublic School\b/i,'PS').replace(/\bHigh School\b/i,'HS')
    .replace(/\bPrimary School\b/i,'PS').replace(/\bSecondary College\b/i,'SC');
  if (fits(compact)) return compact;
  const words = name.split(/[^\p{L}\p{N}]+/u).filter(w=>w && !/^(the|and|of|for)$/i.test(w));
  const initials = words.map(w=>[...w][0]).join('').toUpperCase();
  if (words.length > 1 && fits(initials)) return initials;
  let short = '';
  for (const glyph of name) {
    if (textMeasure.measureText(short+glyph+'…').width > 40) break;
    short += glyph;
  }
  return short.trimEnd()+'…';
}
function markerFor(plant) {
  const [x,y] = rootPoint(plant.row,plant.position);
  const width = 52 - (plant.position - 1) * .25, height = width * 288 / 256;
  const g = svg('g', {class:'coffee-marker','data-plant-key':plant.key,'data-stage':plant.stage,
    transform:'translate(' + x + ' ' + y + ')',role:'button',tabindex:'-1','aria-pressed':'false',
    'aria-label':[label(plant),'Row '+plant.row,STAGE_NAMES[plant.stage-1],adoptionText(plant)].filter(Boolean).join(', ')});
  const drawing = svg('image',{x:-width/2,y:-height*.8993,width,height,'pointer-events':'none'});
  setPlantIllustration(drawing, assets + '/stages', plant.stage, plant);
  g.append(drawing);
  g.append(svg('rect',{class:'plant-hit',x:-20,y:-31,width:40,height:49,rx:5,fill:'transparent'}));
  g.append(svg('rect',{class:'tag-bg',x:-17,y:1,width:34,height:16,rx:6}));
  g.append(svg('text',{class:'plant-id',x:0,y:13,'text-anchor':'middle'},label(plant)));
  if (plant.adoptionStatus) {
    g.dataset.adoption = plant.adoptionStatus;
    g.append(svg('text',{class:'plant-attribution',x:0,y:26,'text-anchor':'middle'},shortAttribution(plant)));
    g.append(svg('title',{},label(plant)+' · '+adoptionText(plant)));
  }
  function peek(event) {
    if (event.pointerType === 'mouse' && !dismissedAt && (!active || mode === 'hover') && active?.key !== plant.key) inspect(plant,'hover');
  }
  g.addEventListener('pointerenter',peek);
  g.addEventListener('pointermove',peek);
  g.addEventListener('pointerleave',delayDismiss);
  g.addEventListener('focus',() => { if (!restoringFocus && (!active || mode === 'hover')) inspect(plant,'hover'); });
  g.addEventListener('blur',delayDismiss);
  g.addEventListener('click',() => { setRoving(plant.key); inspect(plant,'pinned'); });
  g.addEventListener('keydown',event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inspect(plant,'pinned',true); return; }
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!step) return;
    event.preventDefault();
    const keys = [...register.keys()];
    const target = register.get(keys[Math.min(keys.length - 1, Math.max(0, keys.indexOf(plant.key) + step))]);
    jump(target.row,rootPoint(target.row,target.position)[1]);
    setRoving(target.key);
    markers.get(target.key).focus({preventScroll:true});
    inspect(target,'hover');
  });
  return g;
}

function rebuildDialog() {
  const options = byId('list-options');
  options.replaceChildren();
  for (const plant of register.values()) {
    if (plant.row !== Number(dialogRows.value)) continue;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = label(plant); btn.dataset.listKey = plant.key;
    btn.setAttribute('aria-pressed',String(plant.key === preferred));
    if (plant.adoptionStatus) {
      btn.dataset.adoption = plant.adoptionStatus;
      const caption = document.createElement('small');
      caption.textContent = adoptionText(plant);
      btn.append(caption);
    }
    btn.setAttribute('aria-label',[label(plant),STAGE_NAMES[plant.stage-1],adoptionText(plant)].filter(Boolean).join(', '));
    btn.onclick = () => { dialog.close(); showPosition(plant,true); };
    options.append(btn);
  }
}
byId('plant-list').onclick = () => {
  dismiss();
  if (rows.some(r => r.row === currentRow && r.enabledCount > 0)) dialogRows.value = String(currentRow);
  rebuildDialog(); dialog.showModal(); dialogRows.focus();
};
byId('close-list').onclick = () => dialog.close();
dialogRows.onchange = rebuildDialog;

function validate(data) {
  if (!Array.isArray(data.rows) || data.rows.length !== 12 || !Array.isArray(data.plants)) throw new Error('Missing farm layout');
  const layout = [...data.rows].sort((a,b) => a.row-b.row);
  for (const [i,row] of layout.entries()) {
    if (row.row !== i+1 || row.capacity !== 19 || !Number.isInteger(row.enabledCount) || row.enabledCount < 0 || row.enabledCount > row.capacity) throw new Error('Invalid row');
  }
  const sorted = [...data.plants].sort((a,b) => a.row-b.row || a.position-b.position);
  const result = new Map();
  for (const plant of sorted) {
    const row = layout[plant.row-1];
    if (!row || row.row !== plant.row || !Number.isInteger(plant.position) || plant.position < 1 || plant.position > row.enabledCount ||
        plant.key !== 'r'+plant.row+'-p'+plant.position || result.has(plant.key) || !Number.isInteger(plant.stage) ||
        plant.stage < 1 || plant.stage > STAGE_NAMES.length || !['available','unavailable','unverified','preparing'].includes(plant.status)) throw new Error('Invalid position');
    const adoptionStatus = ['adopted','cooling'].includes(plant.adoptionStatus) ? plant.adoptionStatus : null;
    const adoptedBy = adoptionStatus && typeof plant.adoptedBy === 'string' ? plant.adoptedBy.trim().slice(0,160) : '';
    result.set(plant.key,{key:plant.key,row:plant.row,position:plant.position,stage:plant.stage,status:plant.status,adoptionStatus,adoptedBy});
  }
  if (result.size !== layout.reduce((total,r) => total+r.enabledCount,0)) throw new Error('Incomplete farm layout');
  return {layout,result};
}
function showAdoptions() {
  const adopted = [...register.values()].filter(plant=>plant.adoptionStatus);
  byId('map-adoption-key').hidden = !adopted.length;
  const section = byId('school-register'), list = byId('school-register-list');
  section.hidden = !adopted.length;
  byId('school-register-title').textContent = 'School adoptions ('+adopted.length+')';
  list.replaceChildren();
  for (const plant of adopted) {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.adoption = plant.adoptionStatus;
    button.textContent = label(plant) + ' · ' + adoptionText(plant);
    button.onclick = () => {
      viewport.scrollIntoView({block:'center',behavior:'instant'});
      showPosition(plant,true);
    };
    const item = document.createElement('li'); item.append(button); list.append(item);
  }
}
function draw(layout,result) {
  const prev = active?.key;
  const prevMode = mode;
  const focusedKey = document.activeElement?.closest('[data-plant-key]')?.dataset.plantKey;
  const focusedList = document.activeElement?.dataset.listKey;
  const focusOnCard = card.contains(document.activeElement);
  const prevRoving = rovingKey;
  const prevListRow = dialogRows.value;
  dismiss(); rows = layout; register = result; markers = new Map();
  const lost = Boolean(preferred && !canRequest(register.get(preferred)));
  if (lost) savePreference(null);
  const rowNames = byId('atlas-row-labels');
  rowNames.replaceChildren(); jumpList.replaceChildren(); dialogRows.replaceChildren();
  for (const row of rows) {
    const [x,y] = rowLabelPoint(row.row);
    rowNames.append(svg('text',{x,y,class:'atlas-label'},'Row '+row.row));
    const state = row.enabledCount ? row.enabledCount + (row.enabledCount === 1 ? ' POSITION' : ' POSITIONS') : (row.row > 2 ? 'PLANNED' : 'NO POSITIONS');
    rowNames.append(svg('text',{x,y:y+13,class:'atlas-state'},state));
    const choice = new Option('Row '+row.row, String(row.row));
    jumpList.add(choice);
    if (row.enabledCount) dialogRows.add(new Option('Row '+row.row, String(row.row)));
  }
  setRow(rows[currentRow-1] ? currentRow : 1);
  const fragment = document.createDocumentFragment();
  // Draw the far end first, keeping larger foreground crowns above their neighbours.
  for (const plant of [...register.values()].sort((a,b)=>a.row-b.row || b.position-a.position)) {
    const marker = markerFor(plant); markers.set(plant.key,marker); fragment.append(marker);
  }
  markerLayer.replaceChildren(fragment);
  setRoving(register.has(prevRoving) ? prevRoving : (preferred || register.keys().next().value));
  updatePreference();
  byId('plant-list').disabled = !register.size;
  showAdoptions();
  if (dialog.open) {
    if (!register.size) dialog.close();
    else {
      if (rows.some(r => String(r.row) === prevListRow && r.enabledCount)) dialogRows.value = prevListRow;
      rebuildDialog();
      const previousButton = [...byId('list-options').children].find(b=>b.dataset.listKey===focusedList);
      (previousButton || dialogRows).focus({preventScroll:true});
    }
  }
  if (focusedKey && markers.has(focusedKey)) {
    restoringFocus = true; markers.get(focusedKey).focus({preventScroll:true}); restoringFocus = false;
  } else if (focusedKey || (focusOnCard && !register.has(prev))) {
    jumpList.focus({preventScroll:true});
  }
  if (prev && register.has(prev) && prevMode !== 'hover') inspect(register.get(prev),prevMode,focusOnCard);
  main.querySelectorAll('a.hero-marker[data-preview]').forEach(link => {
    const plant = register.get('r1-p'+link.dataset.preview);
    link.hidden = !plant;
    link.setAttribute('aria-label',plant ? 'Explore '+label(plant)+' in Row 1' : 'Explore the estate atlas');
  });
  if (lost) notice('Your previous plant preference is no longer open. Explore another position or apply without a preference.');
  else if (!register.size) notice('The farmer has no planting positions open on the map yet. Your school can still apply.');
  else notice();
}
main.querySelectorAll('a.hero-marker[data-preview]').forEach(link => link.addEventListener('click',event => {
  const plant = register.get('r1-p'+link.dataset.preview);
  if (!plant) return;
  event.preventDefault();
  explorer.querySelector('.atlas-tools').scrollIntoView({block:'start',behavior:'instant'});
  showPosition(plant,true);
}));

async function refresh() {
  if (fetching || document.hidden) return;
  fetching = true;
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(),9000);
  try {
    const response = await fetch(main.dataset.mapUrl,{credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',signal:controller.signal});
    if (!response.ok) throw new Error('Unavailable');
    const {layout,result} = validate(await response.json());
    const signature = JSON.stringify([layout,[...result.values()]]);
    if (signature !== lastDrawn) { draw(layout,result); lastDrawn=signature; }
  } catch {
    dismiss(); if (dialog.open) dialog.close();
    lastDrawn = null; rows=[]; register.clear(); markers.clear(); markerLayer.replaceChildren();
    byId('atlas-row-labels').replaceChildren(); jumpList.replaceChildren();
    showAdoptions();
    for (const link of main.querySelectorAll('a.hero-marker[data-preview]')) link.hidden = true;
    updatePreference(); byId('plant-list').disabled=true;
    notice('The planting register could not be loaded. You can still register your school without a preference.',true);
  } finally { clearTimeout(timeout); fetching=false; jumpList.disabled=!rows.length || frame.dataset.artState !== 'ready'; }
}
byId('retry-map').onclick = refresh;
installFarmWeather(main.dataset.weatherUrl);
jumpList.disabled=true; explorer.hidden=false; checkArtwork(); refresh();
window.addEventListener('pageshow',refresh);
window.addEventListener('focus',refresh);
document.addEventListener('visibilitychange',()=>{ if (!document.hidden) refresh(); });
window.setInterval(refresh,60000);
