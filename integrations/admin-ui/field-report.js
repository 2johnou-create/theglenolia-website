const names = ['variety','soil','soilPh','growerFocus','plantedOn','condition'];
const labels = {variety:'Variety',soil:'Soil',soilPh:'pH',growerFocus:'Classroom focus',plantedOn:'Planted',condition:'Condition'};

export function mountFieldReport({api,run,today}) {
  const get = id=>document.getElementById(id);
  const panel = get('agronomy'), selector=get('ag-scope'), controls=get('ag-controls'), status=get('ag-result');
  const records = new Map();
  let selectedTree=null, key='farm', loadVersion=0;
  function record(scope=key) {
    if (!records.has(scope)) records.set(scope,{saved:null,edited:null,baseRevision:null,feed:null});
    return records.get(scope);
  }
  function scopeLabel(scope=key) {return scope==='farm'?'the whole farm':selectedTree?.label || 'this tree';}
  function selectTree(tree) {
    const next=tree && tree.status!=='unverified' ? tree : null;
    if (selectedTree?.key===next?.key && selector.options.length && get('ag-scope-hint').textContent) return;
    selectedTree=next;
    const options=next ? [new Option(next.label+' only',next.key)] : [];
    options.push(new Option('Whole farm','farm'));
    selector.replaceChildren(...options);
    switchScope(selector.value);
  }
  function switchScope(scope) {
    key=scope; ++loadVersion;
    get('ag-scope-hint').textContent=key==='farm'
      ? 'These records appear as farm-wide information in every class journal. Enter only details that apply across the farm.'
      : 'These records apply to '+scopeLabel()+'. Leave a growing condition blank to use the farm default.';
    get('ag-save').textContent='Save conditions for '+scopeLabel();
    get('ag-feed-save').textContent='Record fertiliser for '+scopeLabel();
    controls.disabled=true; status.textContent='';get('ag-reload').hidden=true;
    if(panel.open) void load();
  }
  async function load() {
    const scope=key, version=++loadVersion, state=record(scope);
    controls.disabled=true;status.textContent='Loading records…';get('ag-reload').hidden=true;
    try {
      const saved=await api('/field-report?key='+encodeURIComponent(scope));
      if (version!==loadVersion || key!==scope) return;
      state.saved=saved;
      const stale=state.edited && state.baseRevision!==saved.revision;
      status.textContent=stale ? 'Growing conditions have changed. Load saved records to replace your unsaved conditions.' : '';
      controls.disabled=false;
      get('ag-reload').hidden=!stale;
      render(state);
    } catch(error) {
      if (version!==loadVersion || key!==scope) return;
      status.textContent=error.message;get('ag-reload').hidden=false;
    }
  }
  function render(state) {
    const values=state.edited || state.saved.values;
    for (const name of names) get('ag-'+name).value=values[name] ?? '';
    const inherited=state.saved.inherited || {};
    get('ag-inherited').textContent=Object.entries(inherited).filter(([,v])=>v!=null)
      .map(([name,value])=>labels[name]+' · '+value).join(' / ');
    if (get('ag-inherited').textContent) get('ag-inherited').prepend('Farm defaults · ');
    get('ag-plantedOn').max=today();get('ag-feed-date').max=today();
    get('ag-feed-date').value=state.feed?.observedOn || today();
    get('ag-feed-note').value=state.feed?.description || '';
    const history=get('ag-feed-history');history.replaceChildren();
    if (!state.saved.fertiliserHistory.length) {
      const empty=document.createElement('p');empty.className='hint';empty.textContent='No fertiliser entries recorded for '+scopeLabel()+'.';history.append(empty);
    }
    for (const event of state.saved.fertiliserHistory) {
      const entry=document.createElement('article'),line=document.createElement('p');
      line.textContent=event.observedOn+' · '+event.description;
      const detail=document.createElement('details'), summary=document.createElement('summary');
      summary.textContent='Correct this entry';
      const form=document.createElement('form'),label=document.createElement('label'),reason=document.createElement('input'),button=document.createElement('button');
      label.textContent='Reason for withdrawing';reason.required=true;reason.maxLength=300;label.append(reason);
      button.type='submit';button.className='quiet';button.textContent='Withdraw entry';
      const originalKey=key;
      form.addEventListener('submit',e=>{e.preventDefault(); if (key!==originalKey || !reason.value.trim()) return;
        run(async()=>{await api('/fertiliser',{key:originalKey,id:event.id,action:'withdraw',reason:reason.value.trim()});
          if (key===originalKey) {await load(); if (!controls.disabled) status.textContent='Entry withdrawn. You can record a corrected entry.';}
        });
      });
      form.append(label,button);detail.append(summary,form);entry.append(line,detail);history.append(entry);
    }
  }
  panel.addEventListener('toggle',()=>{if (panel.open) void load();});
  selector.addEventListener('change',()=>switchScope(selector.value));
  get('ag-reload').addEventListener('click',()=>{
    const state=record();
    if (state.edited && !window.confirm('Replace unsaved growing conditions for '+scopeLabel()+' with the saved version?')) return;
    state.edited=null;state.baseRevision=null;void load();
  });
  get('ag-profile-form').addEventListener('input',()=>{
    const state=record();if(!state.saved)return;
    state.baseRevision??=state.saved.revision;
    state.edited=Object.fromEntries(names.map(name=>{
      const raw=get('ag-'+name).value.trim();
      return [name,raw===''?null:name==='soilPh'?Number(raw):raw];
    }));
  });
  get('ag-profile-form').addEventListener('submit',event=>{
    event.preventDefault();const scope=key,state=record();
    if (!state.edited) {status.textContent='There are no changes to save.';return;}
    run(async()=>{
      try {await api('/field-report',{key:scope,revision:state.baseRevision,values:state.edited});}
      catch(error){if(key===scope)get('ag-reload').hidden=false;throw error;}
      state.edited=null;state.baseRevision=null;
      if(key===scope){await load(); if(!controls.disabled)status.textContent='Growing conditions saved for '+scopeLabel()+'.';}
    });
  });
  get('ag-feed-form').addEventListener('input',()=>{
    const state=record();state.feed={description:get('ag-feed-note').value,observedOn:get('ag-feed-date').value,id:crypto.randomUUID()};
  });
  get('ag-feed-form').addEventListener('submit',event=>{
    event.preventDefault();const scope=key,state=record();
    if (!state.feed?.description.trim())return;
    run(async()=>{
      await api('/fertiliser',{key:scope,...state.feed});
      state.feed=null;
      if(key===scope){await load();if(!controls.disabled)status.textContent='Fertiliser entry saved for '+scopeLabel()+'.';}
    });
  });
  return {selectTree,hasChanges:()=>[...records.values()].some(r=>r.edited || r.feed?.description.trim())};
}
