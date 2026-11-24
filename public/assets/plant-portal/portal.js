import { mountEstateExplorer } from './estate-explorer.js?v=3d-only';
import { installFarmWeather } from './farm-weather.js';
import { STAGE_NAMES } from './stages.js';
import { setPlantIllustration } from './plant-illustration.js';
import { mountGrowthGuide } from './growth-guide.js';

const byId = id => document.getElementById(id);
const main = byId('main');
const explorer = byId('row-app');
const card = byId('plant-card');
const dialog = byId('plant-dialog');
const listTrigger = byId('plant-list');
const listControls = byId('list-controls');
const listStatus = byId('list-status');
const jumpList = byId('row-jump');
const dialogRows = byId('list-row');
const assets = main.dataset.atlasAssets;
const preferenceKey = 'glenolia.atlas.preference';
const canRequest = plant => plant && !plant.adoptionStatus && plant.stage !== 1 && ['available','unverified'].includes(plant.status);
mountGrowthGuide({guide:byId('stage-guide'),list:byId('stage-plates'),details:byId('stage-detail'),assets});
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
let preferred = readPreference();
let active = null;
let mode = '';
let selectedFromList = false;
let currentRow = 1;
let lastDrawn = null;
let fetching = false;
const atlas = mountEstateExplorer({
  assets,
  inspect:(plant,keyboard)=>showPosition(plant,keyboard),
  hover:plant=>{ if (!active || mode === 'hover') inspect(plant,'hover'); },
  leave:()=>dismiss(), jump:setRow, attribution:shortAttribution
});

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

function setRow(row) {
  currentRow = row;
  jumpList.value = String(row);
  atlas.setRow(row);
}

function notice(message = '', retry = false) {
  byId('map-message').textContent = message;
  byId('retry-map').hidden = !retry;
  byId('map-notice').hidden = !message;
}
function updatePreference() {
  atlas.prefer(preferred);
  const choice = register.get(preferred);
  const back = byId('return-selected');
  back.hidden = !canRequest(choice);
  if (!back.hidden) {
    back.textContent = '↩ ' + label(choice);
    back.setAttribute('aria-label', 'Return to ' + label(choice));
  }
}
function inspect(plant, nextMode, focus = false) {
  if (!plant) return;
  active = plant;
  mode = nextMode;
  if (mode !== 'hover') { setRow(plant.row); atlas.select(plant); }
  const selected = plant.key === preferred;
  card.hidden = false;
  card.dataset.mode = selected && nextMode !== 'hover' ? 'selected' : nextMode;
  card.dataset.key = plant.key;
  card.dataset.stage = String(plant.stage);
  byId('card-kind').textContent = (selected ? 'Class preference' : 'Planting position') + ' · Row ' + plant.row;
  byId('plant-title').textContent = label(plant);
  byId('plant-variety').textContent = plant.variety || 'Variety not recorded';
  setPlantIllustration(byId('card-image'), assets + '/stages', plant.stage, plant);
  const photoToggle=byId('card-photo-toggle'),photo=byId('card-photo');
  photoToggle.hidden=!plant.stagePhoto;
  photoToggle.setAttribute('aria-pressed','false');
  if(plant.stagePhoto) {
    photo.src=new URL('/api/plants/stage-photo/'+plant.key,main.dataset.mapUrl).href;
    photo.alt='Real photograph of '+label(plant)+' at its current stage';
  } else photo.removeAttribute('src');

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
  if (focus) {
    card.scrollIntoView({block:'nearest',behavior:'instant'});
    (request.hidden ? byId('plant-title') : request).focus({preventScroll:true});
  }
}
byId('card-photo-toggle').addEventListener('click',event=>{
  const button=event.currentTarget,shown=button.getAttribute('aria-pressed')==='true';
  button.setAttribute('aria-pressed',String(!shown));
  button.setAttribute('aria-label',shown?'Show real plant photograph':'Show plant illustration');
});
function dismiss(restoreFocus = false) {
  if (!active) return;
  const previous = active.key;
  const returnToList = selectedFromList;
  atlas.unselect();
  active = null;
  mode = '';
  selectedFromList = false;
  card.hidden = true;
  card.removeAttribute('data-key');
  if (restoreFocus && (returnToList || !atlas.restore(previous))) listTrigger.focus();
}
document.addEventListener('pointerdown', event => {
  if (active && !event.target.closest('#plant-card,[data-plant-key],#return-selected,#world-surface,#estate-directory')) dismiss();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && active && !dialog.open) { event.preventDefault(); dismiss(true); }
});
byId('close-card').onclick = event => dismiss(event.detail === 0);
byId('select-plant').onclick = () => {
  if (!canRequest(active)) return;
  savePreference(active.key);
  updatePreference();
  inspect(active,'pinned',true);
  byId('selection-live').textContent = label(active) + ' selected as your class preference.';
};
function showPosition(plant, focus = false, fromList = false) {
  if (!plant) return;
  selectedFromList = fromList;
  inspect(plant,'pinned',focus);
}
byId('return-selected').onclick = () => showPosition(register.get(preferred),true);
jumpList.onchange = () => { dismiss(); setRow(Number(jumpList.value)); };

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
function rebuildDialog() {
  const options = byId('list-options');
  options.replaceChildren();
  for (const plant of register.values()) {
    if (plant.row !== Number(dialogRows.value)) continue;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = label(plant)+(plant.variety ? ' · '+plant.variety : ''); btn.dataset.listKey = plant.key;
    btn.setAttribute('aria-pressed',String(plant.key === preferred));
    if (plant.adoptionStatus) {
      btn.dataset.adoption = plant.adoptionStatus;
      const caption = document.createElement('small');
      caption.textContent = adoptionText(plant);
      btn.append(caption);
    }
    btn.setAttribute('aria-label',[label(plant),plant.variety,STAGE_NAMES[plant.stage-1],adoptionText(plant)].filter(Boolean).join(', '));
    btn.onclick = () => { dialog.close(); showPosition(plant,true,true); };
    options.append(btn);
  }
  const count = options.children.length;
  listStatus.textContent = count
    ? count + (count === 1 ? ' plant' : ' plants') + ' in Row ' + dialogRows.value + '.'
    : (Number(dialogRows.value)>2 ? 'Planned for autumn 2027. ' : '') + 'No coffee plants are listed in this row.';
}
listTrigger.onclick = () => {
  dismiss();
  if (rows.some(r => r.row === currentRow)) dialogRows.value = String(currentRow);
  if (rows.length) rebuildDialog();
  dialog.showModal();
  if (rows.length) dialogRows.focus();
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
    result.set(plant.key,{key:plant.key,row:plant.row,position:plant.position,stage:plant.stage,status:plant.status,adoptionStatus,adoptedBy,variety:typeof plant.variety==='string' ? plant.variety.trim().slice(0,120) : '',stagePhoto:plant.stagePhoto===true});
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
    button.textContent = label(plant) + (plant.variety ? ' · '+plant.variety : '') + ' · ' + adoptionText(plant);
    button.onclick = () => {
      if (atlas.enabled) byId('world-scroll').scrollIntoView({block:'center',behavior:'instant'});
      showPosition(plant,true);
    };
    const item = document.createElement('li'); item.append(button); list.append(item);
  }
}
function draw(layout,result) {
  const prev = active?.key;
  const prevMode = mode;
  const previousFromList = selectedFromList;
  const focusedKey = document.activeElement?.closest('[data-plant-key]')?.dataset.plantKey;
  const focusedList = document.activeElement?.dataset.listKey;
  const focusOnCard = card.contains(document.activeElement);
  const prevListRow = dialogRows.value;
  dismiss(); rows = layout; register = result;
  const lost = Boolean(preferred && !canRequest(register.get(preferred)));
  if (lost) savePreference(null);
  atlas.data(rows,register);
  jumpList.replaceChildren(); dialogRows.replaceChildren();
  for (const row of rows) {
    const choice = new Option('Row '+row.row+(row.row>2 && !row.enabledCount?' · Planned':''), String(row.row));
    jumpList.add(choice);
    dialogRows.add(new Option(choice.textContent, String(row.row)));
  }
  setRow(rows[currentRow-1] ? currentRow : 1);
  updatePreference();
  listControls.hidden = false;
  byId('list-apply').hidden = false;
  showAdoptions();
  if (dialog.open) {
    if (rows.some(r => String(r.row) === prevListRow)) dialogRows.value = prevListRow;
    rebuildDialog();
    const previousButton = [...byId('list-options').children].find(b=>b.dataset.listKey===focusedList);
    if (focusedList) (previousButton || dialogRows).focus({preventScroll:true});
  }
  if ((focusedKey && !atlas.restore(focusedKey)) || (focusOnCard && !register.has(prev))) {
    jumpList.focus({preventScroll:true});
  }
  if (prev && register.has(prev) && prevMode !== 'hover') {
    selectedFromList = previousFromList;
    inspect(register.get(prev),prevMode,focusOnCard);
  }
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
    dismiss();
    lastDrawn = null; rows=[]; register.clear(); jumpList.replaceChildren();
    atlas.data(rows,register);
    showAdoptions();
    for (const link of main.querySelectorAll('a.hero-marker[data-preview]')) link.hidden = true;
    updatePreference();
    if (listControls.contains(document.activeElement)) byId('close-list').focus();
    listControls.hidden = true;
    byId('list-apply').hidden = false;
    listStatus.textContent = 'The planting register is unavailable. Your school can still apply without choosing a plant.';
    notice('The planting register could not be loaded. You can still register your school without a preference.',true);
  } finally { clearTimeout(timeout); fetching=false; jumpList.disabled=!rows.length; }
}
byId('retry-map').onclick = refresh;
installFarmWeather(main.dataset.weatherUrl);
jumpList.disabled=true; listTrigger.hidden=false;
explorer.hidden=false; refresh();
window.addEventListener('pageshow',refresh);
window.addEventListener('focus',refresh);
document.addEventListener('visibilitychange',()=>{ if (!document.hidden) refresh(); });
window.setInterval(refresh,60000);
