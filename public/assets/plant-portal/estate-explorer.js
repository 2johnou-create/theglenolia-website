// The directory and the illustrated map remain usable while WebGL and its textures load.
export function mountEstateExplorer({assets, inspect, leave, jump, hover, ready, attribution}){
  const by=id=>document.getElementById(id), app=by('row-app'),scroll=by('world-scroll'),surface=by('world-surface');
  const pins=by('world-pins'),list=by('directory-rows'),card=by('plant-card'),originalParent=card.parentElement;
  const thin=()=>surface.clientWidth<670;
  const step=144;
  let rows=[],records=new Map(),row=1,page=0,focused=null,preference=null,renderer=null,loading=false,requested=false,userFlat=false;
  let paused=matchMedia('(prefers-reduced-motion: reduce)').matches, near=false,available=false,positions=new Map(),keyboardKey=null;
  const observer=new IntersectionObserver(events=>{near=events[0].isIntersecting;if(near)load();},{rootMargin:'420px'});
  observer.observe(by('estate-workspace'));
  function showWorld(){
    scroll.hidden=false;app.dataset.world='ready';by('world-card-slot').append(card);
    available=true;by('world-fallback').hidden=true;by('view-toggle').hidden=false;by('view-toggle').textContent='Use illustrated map';
    scroll.scrollTop=(row-1)*step;renderer.data(records);renderer.navigate(row,page,focused,true);directory();ready();
  }
  function showFlat(failed){
    available=false;scroll.hidden=true;delete app.dataset.world;originalParent.append(card);
    by('view-toggle').textContent='Use 3D map';by('view-toggle').hidden=failed;
    by('world-fallback').hidden=!failed;directory();ready();jump(row);
  }
  async function load(){
    if(!near||!rows.length||requested||loading||userFlat)return;
    requested=true;loading=true;
    try{
      const module=await import(assets+'/estate-world.js');
      renderer=await module.createAtlasWorld({assets,canvas:by('world-canvas'),project,contextLost(){
        renderer?.destroy();renderer=null;leave();showFlat(true);
      }});
      renderer.pause(paused);if(!userFlat)showWorld();
    }catch{showFlat(true);}
    finally{loading=false;}
  }
  const motionPref=matchMedia('(prefers-reduced-motion: reduce)');
  motionPref.addEventListener('change',e=>{paused=e.matches;renderer?.pause(paused);navigation();});
  function pin(plant){
    const btn=document.createElement('button');btn.type='button';btn.className='world-pin';btn.dataset.plantKey=plant.key;
    const id='P'+((plant.row-1)*19+plant.position);
    const text=document.createElement('span'),v=document.createElement('small');
    text.textContent=id;v.textContent=plant.variety||'Variety unrecorded';
    btn.append(text,v);
    if(plant.adoptionStatus){btn.dataset.adoption=plant.adoptionStatus;const school=document.createElement('small');school.textContent=attribution(plant);btn.append(school);}
    btn.title=[id,plant.variety,plant.adoptedBy].filter(Boolean).join(' · ');
    btn.setAttribute('aria-label',[id,plant.variety,'Row '+plant.row,plant.adoptedBy||plant.adoptionStatus].filter(Boolean).join(', '));
    btn.addEventListener('click',()=>{keyboardKey=plant.key;inspect(plant);});
    btn.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!focused)hover(plant);});
    btn.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
      const values=[...records.values()].filter(p=>p.row===plant.row),i=values.findIndex(p=>p.key===plant.key);
      const next=values[i+(e.key==='ArrowLeft'?-1:1)];
      if(!next)return;e.preventDefault();keyboardKey=next.key;
      if(thin())page=Math.floor((next.position-1)/6);
      renderer.navigate(row,page,null,true);navigation();requestAnimationFrame(()=>positions.get(next.key)?.focus({preventScroll:true}));
    });
    return btn;
  }
  const rowSigns=new Map();
  function project(coords,width,height,rowLabels){
    const visibleRows=new Set(rowLabels.map(r=>r.row));
    for(const [id,sign] of rowSigns)sign.hidden=!visibleRows.has(id);
    for(const r of rowLabels){
      let sign=rowSigns.get(r.row);
      if(!sign){sign=document.createElement('span');sign.className='field-row-sign';sign.textContent='Row '+r.row;rowSigns.set(r.row,sign);surface.append(sign);}
      sign.hidden=r.x<2||r.x>width-35||r.y<3||r.y>height-16;
      sign.style.left=r.x+'px';sign.style.top=r.y+'px';
    }
    const visible=new Set();
    for(const {key,x,y,focused:close} of coords){
      const el=positions.get(key),p=records.get(key);
      if(!el||x<8||x>width-8||y<8||y>height-12)continue;
      visible.add(key);el.hidden=false;el.style.left=x.toFixed(1)+'px';el.style.top=y.toFixed(1)+'px';
      el.classList.toggle('labelled',close||key===preference||!!p.adoptionStatus||p.position===1||p.position%5===0);
      el.classList.toggle('close-pin',close);
    }
    for(const [key,el] of positions)if(!visible.has(key))el.hidden=true;
    const tabKey=visible.has(keyboardKey)?keyboardKey:[...visible].find(k=>records.get(k).row===row)||visible.values().next().value;
    for(const [key,el] of positions)el.tabIndex=key===tabKey?0:-1;
  }
  function navigation(){
    const count=rows.find(r=>r.row===row)?.enabledCount||0;
    by('world-area').textContent=row<=2?'School pilot':'Autumn 2027 plan';
    by('world-row').textContent='Row '+row;
    by('world-back').hidden=!focused;
    by('world-pan').hidden=!available||!thin()||!!focused||count<=6;
    by('world-range').textContent=(page*6+1)+'–'+Math.min(count,page*6+6);
    by('world-prev').disabled=page===0;by('world-next').disabled=(page+1)*6>=count;
    by('world-pause').setAttribute('aria-label',paused?'Play farm animation':'Pause farm animation');
    by('world-pause').textContent=paused?'▷':'Ⅱ';
  }
  function directory(){
    const future=row>2;by('pilot-area').setAttribute('aria-pressed',String(!future));
    by('planned-area').setAttribute('aria-pressed',String(future));
    by('pilot-area').disabled=by('planned-area').disabled=!rows.length;
    by('future-invite').hidden=future||!rows.length;
    const area=future?'planned':'pilot';
    if(list.dataset.area!==area||list.children.length!==rows.filter(r=>(r.row>2)===future).length){
      list.replaceChildren();list.dataset.area=area;
      for(const r of rows.filter(r=>(r.row>2)===future)){
        const b=document.createElement('button');b.type='button';b.textContent='Row '+r.row;b.dataset.row=String(r.row);b.onclick=()=>visit(r.row);list.append(b);
      }
    }
    for(const b of list.children)b.setAttribute('aria-pressed',String(Number(b.dataset.row)===row));
    const n=rows.find(r=>r.row===row)?.enabledCount;
    by('directory-summary').textContent=n===undefined?'Planting register unavailable.':n?('Row '+row+' · '+n+(n===1?' enabled position.':' enabled positions.')):future?'Row '+row+' is planned for autumn 2027. The magnolias are here. Coffee planting is still to come.':'This row has no enabled coffee positions.';
    navigation();
  }
  function data(nextRows,nextPlants){
    rows=nextRows;records=nextPlants;
    const frag=document.createDocumentFragment();positions=new Map();
    for(const [key,p] of records){const el=pin(p);el.hidden=true;positions.set(key,el);frag.append(el);}
    pins.replaceChildren(frag);
    if(!records.has(focused))focused=null;
    page=Math.min(page,Math.max(0,Math.ceil((rows.find(r=>r.row===row)?.enabledCount||0)/6)-1));
    renderer?.data(records);renderer?.navigate(row,page,focused,true);directory();load();
  }
  function setRow(next){
    if(next!==row){row=next;page=0;focused=null;directory();}
    if(available&&Math.round(scroll.scrollTop/step)+1!==next)scroll.scrollTop=(next-1)*step;
    renderer?.navigate(row,page,focused);
  }
  function visit(next){
    if(!rows.length)return;
    userScrollUntil=0;leave();jump(next);setRow(next);
  }
  function select(p){
    focused=p.key;row=p.row;keyboardKey=p.key;page=thin()?Math.floor((p.position-1)/6):0;
    renderer?.navigate(row,page,focused);directory();
  }
  function unselect(){if(focused){focused=null;renderer?.navigate(row,page,null);navigation();}}
  function prefer(key){preference=key;for(const [k,b] of positions)b.setAttribute('aria-pressed',String(k===key));}
  let userScrollUntil=0;
  function markScroll(){userScrollUntil=performance.now()+1100;}
  for(const event of ['wheel','touchmove'])scroll.addEventListener(event,markScroll,{passive:true});
  scroll.addEventListener('pointerdown',e=>{if(e.target===scroll)markScroll();});
  scroll.addEventListener('keydown',e=>{if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key))markScroll();});
  scroll.addEventListener('scroll',()=>{
    if(!available||!rows.length)return;
    const next=Math.min(12,1+Math.round(scroll.scrollTop/step));
    if(next!==row){
      if(performance.now()>userScrollUntil){scroll.scrollTop=(row-1)*step;return;}
      leave();jump(next);
    }
  },{passive:true});
  by('world-prev').onclick=()=>{page--;renderer.navigate(row,page,null,true);navigation();};
  by('world-next').onclick=()=>{page++;renderer.navigate(row,page,null,true);navigation();};
  by('world-back').onclick=()=>{leave();by('row-jump').focus({preventScroll:true});};
  by('world-pause').onclick=()=>{paused=!paused;renderer?.pause(paused);navigation();};
  by('future-invite').onclick=()=>visit(3);
  by('pilot-area').onclick=()=>visit(1);by('planned-area').onclick=()=>visit(3);
  by('view-toggle').onclick=()=>{leave();userFlat=available;if(userFlat)showFlat(false);else if(renderer)showWorld();else load();};
  new ResizeObserver(navigation).observe(surface);
  return {data,setRow,select,unselect,prefer,get enabled(){return available;},restore(key){positions.get(key)?.focus({preventScroll:true});}};
}
