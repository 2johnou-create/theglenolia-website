import { bands, interests, packs, stories, topics, monthlyActivity, monthlyModes } from './plant-library-data.js';

const make=(tag,text,cls)=>{
  const node=document.createElement(tag);
  if(text)node.textContent=text;
  if(cls)node.className=cls;
  return node;
};
function link(text,href,secondary=false){
  const a=make('a',text,'edu-button'+(secondary?' edu-button-secondary':''));
  a.href=href;return a;
}
function button(text,secondary=false){
  const b=make('button',text,'edu-button'+(secondary?' edu-button-secondary':''));
  b.type='button';return b;
}
function labelControl(text,control){
  const wrapper=make('div',null,'class-label'),label=make('label',text);
  control.id='class-'+text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
  label.htmlFor=control.id;
  wrapper.append(label,control);return wrapper;
}
function picker(values,selected,placeholder){
  const control=make('select');
  const list=placeholder?[['',placeholder],...Object.entries(values)]:Object.entries(values);
  for(const [key,label] of list){
    const option=make('option',label);
    option.value=key;control.append(option);
  }
  if(selected&&Object.hasOwn(values,selected))control.value=selected;
  return control;
}
function status(){
  const node=make('p',null,'class-status');
  node.setAttribute('role','status');return node;
}
function art(base,name){
  const image=make('img');
  image.src=base+'/'+name+'.webp';image.alt='';image.loading='lazy';
  return image;
}
function operate(control,statusLine,operation){
  return async ()=>{
    control.disabled=true;
    statusLine.textContent='Saving…';
    try{await operation();}
    catch(error){statusLine.textContent=error.message||'Please try again.';}
    finally{control.disabled=false;}
  };
}
export function libraryHref(organisation,application,settings=false){
  const query=new URLSearchParams();
  if(organisation)query.set('orgId',organisation);
  if(application)query.set('applicationId',application);
  if(settings)query.set('setup','1');
  return '#plant-library'+(query.size?'?'+query:'');
}
export function classroomWelcome({api,href}){
  const box=make('aside',null,'class-welcome');
  api('/plants/class-library').then(({profile})=>{
    if(profile||!box.isConnected)return;
    const message=make('div');
    message.append(make('h2','Set up your classroom'),make('p','Choose a year group and what you’d like to teach.'));
    const skip=button('Skip for now',true),notice=status(),actions=make('div',null,'class-actions');
    skip.addEventListener('click',operate(skip,notice,async ()=>{
      await api('/plants/class-library/preferences',{band:'',interests:[],skipped:true});
      message.replaceChildren(make('p','You can update your choices any time in the Classroom library.'));
      actions.replaceChildren(link('Classroom library',href.replace(/[?&]setup=1$/,''),true));notice.textContent='';
      actions.querySelector('a').focus();
    }));
    actions.append(link('Set up my class',href),skip);
    box.append(message,actions,notice);
    // The existing journal stays usable if classroom preferences are temporarily unavailable.
  }).catch(()=>{});
  return box;
}
function setupForm(profile,api,onSave){
  const form=make('form',null,'class-form'),band=picker(bands,profile?.band,'Any year group');
  const choices=make('fieldset'),checks=new Map();
  choices.append(make('legend','What would you like to use?'));
  for(const [key,label] of Object.entries(interests)){
    const checkbox=make('input');checkbox.type='checkbox';checkbox.checked=profile?.interests.includes(key)||false;
    checks.set(key,checkbox);
    const row=make('label',null,'class-option');row.append(checkbox,make('span',label));choices.append(row);
  }
  const save=button('Save and see my resources'),notice=status();save.type='submit';
  form.append(labelControl('Which year group are you teaching?',band),choices,make('p','Choose as many as you like. Seed packs and visits can be discussed with the farm.','edu-small'),save,notice);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    operate(save,notice,async ()=>{
      const picked=[...checks].filter(([,c])=>c.checked).map(([key])=>key);
      const response=await api('/plants/class-library/preferences',{band:band.value,interests:picked,skipped:false});
      onSave(response.profile);
    })();
  });
  return form;
}
function feedbackForm(profile,feedback,api){
  const form=make('form',null,'class-form');
  const band=picker(bands,feedback?.band||profile?.band,'Choose a year group');
  const topic=picker(Object.fromEntries(Object.entries(topics).map(([k,v])=>[k,v.title])),feedback?.topic,'Choose a topic');
  const format=picker(interests,feedback?.format||profile?.interests[0],'Choose a format');
  for(const x of [band,topic,format])x.required=true;
  const send=button('Save my vote'),notice=status();send.type='submit';
  if(feedback)notice.textContent='Your vote for this month is saved. You can change it below.';
  form.append(labelControl('Year group',band),labelControl('Topic',topic),labelControl('Format you’d use',format),send,notice);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    operate(send,notice,async ()=>{
      await api('/plants/class-library/feedback',{band:band.value,topic:topic.value,format:format.value});
      notice.textContent='Saved. You can change this month’s vote any time.';
    })();
  });
  return form;
}
function card(item,download,base){
  const article=make('article',null,'class-card'),body=make('div'),meta=[item.type,item.range,item.pages?item.pages+' pages':null].filter(Boolean);
  const a=link('Download PDF',download,true);
  a.setAttribute('aria-label','Download '+item.title+' PDF');a.download='';
  body.append(make('p',meta.join(' · '),'class-meta'),make('h3',item.title),make('p',item.desc),a);
  article.append(art(base,item.art),body);return article;
}
export function classroomLibrary({data,api,artBase,application,plantLabel,backHref,showSetup,journalHref}){
  let {profile,monthly,feedback}=data;
  const page=make('div',null,'plant-panel class-library');
  const header=make('header',null,'class-header'),intro=make('div');
  const back=make('a','← Plant Portal','edu-back');back.href=backHref;
  intro.append(back,make('h1','Classroom library'),make('p',application?'Teach with '+plantLabel+' from the school’s farm journal.':'Explore free activities while your school chooses a plant.'));
  header.append(intro,art(artBase,'classroom'));
  const content=make('div');
  page.append(header,content);
  const download=id=>'/api/plants/class-library/'+id+'.pdf'+(application?'?applicationId='+encodeURIComponent(application.id):'');
  function render(expand,announce=false){
    const settings=make('details',null,'class-box'),settingsLabel=make('summary',profile&&!profile.skipped?'My classroom preferences':'Set up my classroom');
    settings.open=expand;settings.append(settingsLabel,setupForm(profile,api,saved=>{
      profile=saved;
      if(location.hash.endsWith('setup=1'))history.replaceState(null,'',location.hash.replace(/[?&]setup=1$/,''));
      render(false,true);
    }));
    const section=make('section'),title=make('h2','Ready to teach'),toolbar=make('div',null,'class-toolbar'),grid=make('div',null,'class-card-grid'),filter=picker(bands,profile?.band,'All year groups');
    const selection=make('div',null,'class-actions');
    if(application)selection.append(link('Open '+plantLabel+' journal',journalHref,true));
    toolbar.append(labelControl('Student year group',filter),selection);
    section.append(title,toolbar,grid);
    function populate(){
      const match=item=>!item.band||!filter.value||item.band===filter.value;
      const sortKey=item=>item.id==='teacher-handbook'?0:item.band?1:profile?.interests.includes(item.id==='seed-lab'?'seeds':'visit')?2:3;
      grid.replaceChildren(...packs.filter(match).sort((a,b)=>sortKey(a)-sortKey(b)).map(item=>card(item,download(item.id),artBase)));
    }
    filter.addEventListener('change',populate);populate();
    const explore=make('details',null,'class-box');
    explore.append(make('summary','Seeds, plants and farm visits'),make('p','Use the seed tray activity with school supplies. To discuss future seeds, plants or an orchard visit, send the farm a workshop enquiry.'),link('Discuss a workshop','#visit',true));
    if(profile?.interests.some(value=>['seeds','visit'].includes(value)))explore.open=true;
    const colours=make('section'),colourTitle=make('h2','Free story colouring books'),colourGrid=make('div',null,'class-card-grid');
    colourTitle.tabIndex=-1;
    colours.append(colourTitle,make('p','Three print-and-colour pages per story for Kindergarten to Year 2.'),colourGrid);
    for(const story of stories){
      const item={...story,type:'Story colouring',pages:3,desc:story.lines[0]};
      colourGrid.append(card(item,'/assets/education/plant-library/'+story.id+'.pdf',artBase));
    }
    if(profile?.interests.includes('colouring')){
      const colourShortcut=button('Go to colouring books',true);
      colourShortcut.addEventListener('click',()=>{colourTitle.scrollIntoView({block:'start'});colourTitle.focus({preventScroll:true});});
      selection.append(colourShortcut);
    }
    const newContent=make('section'),monthlyGrid=make('div',null,'class-card-grid'),suggest=make('details',null,'class-box');
    suggest.append(make('summary','Vote for next month’s activity'),feedbackForm(profile,feedback,api));
    newContent.append(make('h2','Monthly classroom activities'),make('p',monthly.length?'A short activity shaped by teacher feedback.':'Vote for a topic to help choose the next activity.'));
    if(monthly.length){
      for(const row of monthly){
        const topic=monthlyActivity(row.topic,row.month);
        monthlyGrid.append(card({title:topic.title,type:row.month,range:bands[row.band],pages:1,desc:topic.question,art:topic.art},download('monthly-'+row.month),artBase));
      }
      newContent.append(monthlyGrid);
    }
    newContent.append(suggest);
    const saved=announce?make('p','Classroom preferences saved.','class-status'):null;
    content.replaceChildren(settings,...(saved?[saved]:[]),section,explore,colours,newContent);
    if(announce){title.tabIndex=-1;title.focus();}
  }
  render(showSetup);return page;
}

export function classroomEditor({data,api}){
  const section=make('div',null,'class-library'),{draft,votes}=data,topic=monthlyActivity(draft.topic,draft.month);
  section.append(make('h1','Monthly classroom activity'),make('p','The first daily run in a new Sydney calendar month prepares a draft from the previous month’s votes.'));
  const preview=make('section',null,'class-box');
  preview.append(make('h2',topic.title),make('p',draft.month+' · '+(bands[draft.band]||'All year groups')+' · '+interests[draft.format]),
    make('p',topic.plan),make('p',monthlyModes[draft.format]),make('p',topic.question),make('p',topic.secondary));
  const interaction=make('p',draft.published_at?'Published to the teacher library.':'Draft for review.','class-status');
  interaction.setAttribute('role','status');
  if(!draft.published_at){
    const publish=button('Publish reviewed activity');
    publish.addEventListener('click',operate(publish,interaction,async()=>{
      await api('/classroom-monthly',{month:draft.month});publish.hidden=true;
      interaction.textContent='Published to the teacher library.';
    }));
    preview.append(publish);
  }
  section.append(preview,interaction,make('h2','Teacher requests'),make('p','Topic votes for '+data.previousMonth));
  const list=make('ul');
  for(const vote of votes)list.append(make('li',topics[vote.topic].title+' · '+vote.total));
  if(!votes.length)list.append(make('li','No topic votes received for this month.'));
  section.append(list,make('h3','Saved workshop interests'));
  const formats=make('ul');
  for(const [key,count] of Object.entries(data.interests))formats.append(make('li',interests[key]+' · '+count));
  section.append(formats);return section;
}
