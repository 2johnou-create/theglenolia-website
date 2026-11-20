import { STAGE_NAMES } from '../../public/assets/plant-portal/stages.js';

export function mountFarmAtlas({api,run,reload}) {
  const by = id => document.getElementById(id);
  const rowSelect = by('atlas-row'), countInput = by('atlas-count');
  const plantSelect = by('atlas-plant'), stageSelect = by('atlas-stage');
  const countDrafts = new Map(), stageDrafts = new Map(), selectedByRow = new Map();
  let rows = [], plants = [];

  for (const [index,title] of STAGE_NAMES.entries()) {
    stageSelect.add(new Option((index + 1) + ' · ' + title, String(index + 1)));
  }

  const row = () => rows.find(record => record.row === Number(rowSelect.value));
  const plant = () => plants.find(record => record.key === plantSelect.value);
  function syncButtons() {
    const r = row(), p = plant();
    by('save-atlas-row').disabled = !r || !countInput.validity.valid || countInput.valueAsNumber === r.enabledCount;
    by('save-atlas-stage').disabled = !p || Number(stageSelect.value) === p.stage;
  }

  function describeCount() {
    const r = row();
    if (!r) return;
    const value = countInput.valueAsNumber;
    let summary = r.enabledCount + ' of ' + r.capacity + ' positions visible. Set 0 to keep the coffee lane empty.';
    if (!countInput.validity.valid) summary = 'Enter a whole number from 0 to ' + r.capacity + '.';
    else if (value > r.enabledCount) summary = 'New positions start at soil preparation. Restored positions keep their previous stage.';
    else if (value < r.enabledCount) summary = 'Positions after ' + value + ' will leave the map. Field records will be kept.';
    by('atlas-row-change').textContent = summary;
    syncButtons();
  }

  function previewStage() {
    const p = plant(), stage = Number(stageSelect.value);
    if (!p || !Number.isInteger(stage) || !STAGE_NAMES[stage - 1]) return;
    by('atlas-stage-art').src = 'https://theglenolia.com.au/assets/plant-portal/stages/stage-' + stage + '.webp';
    by('atlas-stage-art').hidden = false;
    by('atlas-stage-hint').textContent = stage === 1 ?
      'The public map shows prepared soil here. Schools can choose the plant once a later stage is set.' :
      'The public map shows this illustration for ' + p.label + '.';
    syncButtons();
  }
  by('atlas-stage-art').addEventListener('error',() => { by('atlas-stage-art').hidden = true; });

  function renderPlant() {
    by('atlas-stage-result').textContent = '';
    const p = plant();
    by('atlas-no-plants').hidden = Boolean(p);
    by('atlas-stage-fields').hidden = !p;
    if (p) {
      selectedByRow.set(p.row,p.key);
      const draft = stageDrafts.get(p.key);
      stageSelect.value = String(draft ? draft.value : p.stage);
      previewStage();
    }
    syncButtons();
  }
  function renderRow() {
    by('atlas-row-result').textContent = '';
    const r = row();
    if (!r) return;
    countInput.max = String(r.capacity);
    const draft = countDrafts.get(r.row);
    countInput.value = String(draft ? draft.value : r.enabledCount);
    const members = plants.filter(p => p.row === r.row);
    plantSelect.replaceChildren(...members.map(p => new Option(p.label + ' · Position ' + p.position,p.key)));
    const preferred = selectedByRow.get(r.row);
    if (members.some(p => p.key === preferred)) plantSelect.value = preferred;
    describeCount();
    renderPlant();
  }

  function refresh(next) {
    const previousRow = rowSelect.value;
    rows = Array.isArray(next.rows) ? next.rows : [];
    plants = next.plants;
    // Retain edits to independent records on refresh. A stale revision must be reread.
    for (const [id,draft] of countDrafts) {
      if (rows.find(r => r.row === id)?.revision !== draft.revision) countDrafts.delete(id);
    }
    for (const [key,draft] of stageDrafts) {
      if (plants.find(p => p.key === key)?.revision !== draft.revision) stageDrafts.delete(key);
    }
    by('atlas-missing').hidden = rows.length > 0;
    by('atlas-editor').hidden = !rows.length;
    rowSelect.replaceChildren(...rows.map(r => new Option('Row ' + r.row + ' · ' + r.enabledCount + ' visible',String(r.row))));
    if (rows.some(r => String(r.row) === previousRow)) rowSelect.value = previousRow;
    renderRow();
  }

  rowSelect.addEventListener('change',renderRow);
  plantSelect.addEventListener('change',renderPlant);
  countInput.addEventListener('input',() => {
    by('atlas-row-result').textContent = '';
    const r = row(); if (!r) return;
    if (countInput.valueAsNumber === r.enabledCount) countDrafts.delete(r.row);
    else countDrafts.set(r.row,{revision:r.revision,value:countInput.value});
    describeCount();
  });
  stageSelect.addEventListener('change',() => {
    by('atlas-stage-result').textContent = '';
    const p = plant(); if (!p) return;
    if (Number(stageSelect.value) === p.stage) stageDrafts.delete(p.key);
    else stageDrafts.set(p.key,{revision:p.revision,value:Number(stageSelect.value)});
    previewStage();
  });

  by('atlas-row-form').addEventListener('submit',event => {
    event.preventDefault();
    const r = row(), count = countInput.valueAsNumber;
    if (!r || !countInput.reportValidity() || !Number.isInteger(count) || count === r.enabledCount) return;
    run(async () => {
      await api('/row',{row:r.row,enabledCount:count,revision:r.revision});
      countDrafts.delete(r.row);
      if (count > r.enabledCount) selectedByRow.set(r.row,'r' + r.row + '-p' + (r.enabledCount + 1));
      await reload('Row ' + r.row + ' saved with ' + count + (count === 1 ? ' visible position.' : ' visible positions.'),by('atlas-row-result'));
    });
  });
  by('atlas-stage-form').addEventListener('submit',event => {
    event.preventDefault();
    const p = plant(), stage = Number(stageSelect.value);
    if (!p || !STAGE_NAMES[stage - 1] || stage === p.stage) return;
    run(async () => {
      await api('/stage',{key:p.key,stage,revision:p.revision});
      stageDrafts.delete(p.key);
      await reload('Stage ' + stage + ' saved for ' + p.label + ' in Row ' + p.row + '.',by('atlas-stage-result'));
    });
  });

  function openPlant(p) {
    if (!p || !plants.some(item => item.key === p.key)) return;
    selectedByRow.set(p.row,p.key);
    rowSelect.value = String(p.row);
    renderRow();
  }
  return {refresh,syncButtons,openPlant,hasChanges:() => countDrafts.size > 0 || stageDrafts.size > 0};
}
