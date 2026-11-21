export function mountRecognitionFiles(api) {
 const panel=document.getElementById('school-files'),search=document.getElementById('school-files-search'),list=document.getElementById('school-files-list');
 let awards=[],ready=false,loading=false;
 function draw(){
  const term=search.value.trim().toLowerCase();
  const matches=awards.filter(a=>(a.schoolName+' '+a.plantLabel).toLowerCase().includes(term));
  list.replaceChildren();
  for(const a of matches){
   const card=document.createElement('details'),label=document.createElement('summary');
   label.textContent=a.schoolName+' · '+a.plantLabel+(a.status==='released'?' · Archived':a.status==='cooling'?' · Release pending':'');
   card.append(label);
   const links=document.createElement('ul');
   for(const f of a.files){
    const li=document.createElement('li'),link=document.createElement('a');
    link.href=f.url;link.textContent=f.label+' · '+f.format;link.download='';li.append(link);links.append(li);
   }
   card.append(links);list.append(card);
  }
  if(!matches.length)list.textContent=term?'No matching school or tree.':'School files appear here when a teacher accepts a tree.';
 }
 async function open(){
  if(panel.hidden||loading)return;
  if(ready){draw();return;}
  loading=true;list.textContent='Loading school files…';
  try{awards=(await api('/recognition')).awards;ready=true;draw();}
  catch(error){list.textContent=error.message;const retry=document.createElement('button');retry.type='button';retry.textContent='Try again';retry.addEventListener('click',open);list.append(retry);}
  finally{loading=false;}
 }
 search.addEventListener('input',draw);
 return open;
}
