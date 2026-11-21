import {STAGE_NAMES} from '../../public/assets/plant-portal/stages.js';
export function mountVarieties({api,run,today,reload}) {
  const get=id=>document.getElementById(id), selected=new Set();
  let data=null,requestId=null;
  const traits=['stature','leafTip','beanSize','yieldPotential','firstFruit','ripening','rust','nutrition'];
  const label=p=>'P'+((p.row-1)*19+p.position);
  get('variety-stage').replaceChildren(...STAGE_NAMES.map((name,index)=>new Option((index+1)+' · '+name,String(index+1))));get('variety-stage').value='2';
  function chooseOptions(){
    const edit=get('variety-edit'),choice=get('variety-choice'),existing=edit.value,chosen=choice.value;
    edit.replaceChildren(new Option('Add a variety',''),...data.varieties.map(v=>new Option(v.name,v.id)));
    choice.replaceChildren(...data.varieties.map(v=>new Option(v.name,v.id)));
    if(data.varieties.some(v=>v.id===existing))edit.value=existing;
    if(data.varieties.some(v=>v.id===chosen))choice.value=chosen;
    editForm();
  }
  function editForm(){
    const item=data.varieties.find(v=>v.id===get('variety-edit').value);
    get('variety-name').value=item?.name||'';get('variety-url').value=item?.sourceUrl||'';get('variety-note').value=item?.note||'';
    const values=item?JSON.parse(item.traits||'{}'):{};for(const field of traits)get('catalogue-'+field).value=values[field]||'';
  }
  function render(){
    const row=Number(get('variety-row').value), container=get('variety-positions');
    container.replaceChildren();
    for(const p of data.positions.filter(p=>p.row===row)){
      const item=document.createElement('label'),input=document.createElement('input'),copy=document.createElement('span');
      input.type='checkbox';input.value=p.key;input.checked=selected.has(p.key);
      copy.textContent=label(p)+(p.variety?' · '+p.variety:' · empty');
      input.addEventListener('change',()=>{input.checked?selected.add(p.key):selected.delete(p.key);requestId=null;summary();});
      item.append(input,copy);container.append(item);
    }
    summary();
  }
  function summary(){
    const plants=data.positions.filter(p=>selected.has(p.key));
    get('variety-selection').textContent=plants.length?plants.length+' selected · '+plants.map(label).join(', '):'No positions selected.';
  }
  async function load(){
    const previous=get('variety-row').value;
    get('variety-status').textContent='Loading varieties…';
    try{
      data=await api('/varieties');chooseOptions();
      const rows=[...new Set(data.positions.map(p=>p.row))];
      get('variety-row').replaceChildren(...rows.map(row=>new Option('Row '+row,String(row))));
      if(rows.includes(Number(previous)))get('variety-row').value=previous;
      get('variety-date').value ||= today();get('variety-date').max=today();
      get('variety-status').textContent='';render();
    }catch(e){get('variety-status').textContent=e.message;}
  }
  get('variety-edit').addEventListener('change',editForm);
  get('variety-catalogue-form').addEventListener('submit',event=>{
    event.preventDefault();
    run(async()=>{
      await api('/varieties',{id:get('variety-edit').value||undefined,name:get('variety-name').value,sourceUrl:get('variety-url').value,note:get('variety-note').value,traits:Object.fromEntries(traits.map(field=>[field,get('catalogue-'+field).value]))});
      await load();get('variety-status').textContent='Variety saved.';
    });
  });
  get('variety-row').addEventListener('change',render);
  get('variety-select-row').addEventListener('click',()=>{
    for(const p of data.positions)if(p.row===Number(get('variety-row').value)&&!p.plantingId)selected.add(p.key);
    requestId=null;render();
  });
  get('variety-assign').addEventListener('click',()=>{
    const plants=data.positions.filter(p=>selected.has(p.key)),variety=data.varieties.find(v=>v.id===get('variety-choice').value),date=get('variety-date').value;
    if(!plants.length||!variety||!date){get('variety-status').textContent='Choose a variety, planting date and positions.';return;}
    if(plants.some(p=>p.plantingId)){get('variety-status').textContent='Existing plantings need a separate replacement review. Select empty positions for this action.';return;}
    if(!window.confirm('Assign '+variety.name+' to '+plants.map(label).join(', ')+'?\nPlanting date: '+date+'\nStage: '+STAGE_NAMES[Number(get('variety-stage').value)-1]))return;
    requestId ||= crypto.randomUUID();
    run(async()=>{await api('/varieties/assign',{requestId,varietyId:variety.id,positions:plants.map(p=>p.key),expectedRevisions:Object.fromEntries(plants.map(p=>[p.key,p.revision])),newStage:Number(get('variety-stage').value),plantedOn:date});
      selected.clear();requestId=null;await reload();await load();get('variety-status').textContent='Saved '+plants.length+' planting'+(plants.length===1?'':'s')+'.';});
  });
  get('variety-history').addEventListener('click',()=>{
    const plants=data.positions.filter(p=>selected.has(p.key));
    if(plants.length!==1){get('variety-status').textContent='Select one position to see its history.';return;}
    const p=plants[0];
    run(async()=>{
      const result=await api('/varieties/history?key='+encodeURIComponent(p.key)),box=get('variety-status');
      box.replaceChildren();
      for(const entry of result.history){
        const article=document.createElement('article'),heading=document.createElement('h4'),detail=document.createElement('p');
        heading.textContent=entry.name+(entry.endedAt?' · Previous planting':' · Current planting');
        detail.textContent=(entry.plantedOn?'Planted '+entry.plantedOn:'Planting date not recorded')+(entry.reason?' · '+entry.reason:'');
        article.append(heading,detail);
        for(const stage of entry.archivedStages){
          const link=document.createElement('a');link.textContent='View archived stage '+stage+' photo';link.target='_blank';link.rel='noopener';
          link.href='/api/education/plants/varieties/archive?key='+encodeURIComponent(p.key)+'&planting='+encodeURIComponent(entry.id)+'&stage='+stage;article.append(link);
        }
        box.append(article);
      }
      if(!result.history.length)box.textContent='No planting has been recorded for '+label(p)+'.';
    });
  });
  get('variety-replace').addEventListener('click',()=>{
    const plants=data.positions.filter(p=>selected.has(p.key)),variety=data.varieties.find(v=>v.id===get('variety-choice').value),date=get('variety-date').value;
    if(plants.length!==1||!plants[0].plantingId||!variety||!date){get('variety-status').textContent='Select one existing position, a variety and planting date.';return;}
    const p=plants[0];
    const panel=document.createElement('form'),heading=document.createElement('h4'),description=document.createElement('p'),reason=document.createElement('textarea');
    heading.textContent='Replace '+label(p);description.textContent=p.variety+' → '+variety.name+' · '+date+(p.schoolName?' · School: '+p.schoolName:'');
    reason.required=true;reason.maxLength=500;reason.placeholder='Reason for removal and replanting';
    const reasonLabel=document.createElement('label');reasonLabel.textContent='Reason';reasonLabel.append(reason);
    function check(copy){const l=document.createElement('label'),i=document.createElement('input');i.type='checkbox';i.required=true;l.append(i,document.createTextNode(copy));panel.append(l);return i;}
    const stageLabel=document.createElement('label'),stage=document.createElement('select');
    stageLabel.textContent='Stage of the replacement';stage.replaceChildren(...STAGE_NAMES.map((name,index)=>new Option((index+1)+' · '+name,String(index+1))));stage.value='2';stageLabel.append(stage);
    panel.append(heading,description,reasonLabel,stageLabel);
    const removed=check(' I confirm the earlier tree was removed.');
    const replanted=check(' I confirm the replacement was planted.');
    const reviewed=p.applicationId?check(' I reviewed the school adoption and confirm the school will continue with this replacement.'):null;
    const note=document.createElement('p');note.textContent='This creates a new planting. The earlier planting and its history remain archived. The change cannot be undone.';
    const submit=document.createElement('button');submit.type='submit';submit.textContent='Confirm replacement';
    const cancel=document.createElement('button');cancel.type='button';cancel.className='quiet';cancel.textContent='Cancel';cancel.onclick=()=>panel.remove();
    panel.addEventListener('input',()=>{requestId=null;});
    panel.append(note,submit,cancel);get('variety-status').replaceChildren(panel);reason.focus();
    panel.addEventListener('submit',event=>{
      event.preventDefault();if(!window.confirm('Confirm permanent replacement of '+label(p)+'?'))return;
      requestId ||= crypto.randomUUID();
      run(async()=>{
        await api('/varieties/replace',{requestId,key:p.key,expectedPlantingId:p.plantingId,expectedApplicationId:p.applicationId||null,varietyId:variety.id,plantedOn:date,newStage:Number(stage.value),expectedRevision:p.revision,reason:reason.value,removed:removed.checked,replanted:replanted.checked,reviewed:reviewed?.checked||false});
        selected.clear();requestId=null;await reload();await load();get('variety-status').textContent='Replacement recorded for '+label(p)+'.';
      });
    });
  });
  return load;
}
