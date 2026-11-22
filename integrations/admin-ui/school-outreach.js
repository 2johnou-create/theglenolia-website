import directory from './school-outreach-directory.json';
import { installInvitationDelivery } from './school-outreach-delivery-ui.js';
import { composeGmail, schoolInvitation } from '../school-outreach.mjs';

const $=id=>document.getElementById(id);
const names=$('schools'), recipient=$('recipient'), subject=$('subject'), gmail=$('open-gmail');
const search=$('school-search'), filter=$('school-filter'), message=$('notify');
let selected=directory.schools[0], draft;

function el(tag,text){
  const node=document.createElement(tag);
  node.textContent=text;
  return node;
}
function filteredSchools(){
  const query=search.value.trim().toLowerCase(), scope=filter.value;
  return directory.schools.filter(school=>{
    const matches=(school.name+' '+school.suburb).toLowerCase().includes(query);
    return matches&&(scope==='all'||(scope==='first'?school.first:school.level===scope));
  });
}
function highlightSchool(){
  for(const button of names.querySelectorAll('button')){
    button.setAttribute('aria-pressed',String(button.dataset.id===selected.id));
  }
}
function renderDirectory(){
  const schools=filteredSchools();
  names.replaceChildren();
  $('school-total').textContent=schools.length===0?'No matching schools.':schools.length+(schools.length===1?' school':' schools');
  for(const school of schools){
    const row=el('li',''),button=el('button','');
    button.dataset.id=school.id;button.type='button';
    button.append(el('strong',school.name),el('span',school.suburb+' · '+school.level));
    button.addEventListener('click',()=>{
      selectSchool(school);
      if(matchMedia('(max-width:760px)').matches){
        const heading=$('school-name');heading.tabIndex=-1;heading.focus();
      }
    });
    row.append(button);names.append(row);
  }
  highlightSchool();
}
function updateComposeLink(){
  const address=recipient.value.trim();
  $('office-note').textContent=address&&address.toLowerCase()===selected.email.toLowerCase()
    ?'Published general enquiries address.'
    :address?'Address entered for this invitation.':'Call the office or use its contact page for the right address.';
  const link=composeGmail(address,{...draft,subject:subject.value.trim()||draft.subject});
  if(link){gmail.href=link;gmail.removeAttribute('aria-disabled');}
  else{gmail.removeAttribute('href');gmail.setAttribute('aria-disabled','true');}
}
function selectSchool(school){
  selected=school;draft=schoolInvitation(school);
  $('school-name').textContent=school.name;
  $('school-meta').textContent=school.suburb+' · '+school.level;
  $('school-source').href=school.source;
  const phone=$('school-phone');
  phone.href='tel:+61'+school.phone.replaceAll(' ','').slice(1);
  phone.textContent=school.phone;
  recipient.value=school.email;
  recipient.placeholder=school.email?'':'Enter a contact confirmed by the school';
  subject.value=draft.subject;
  $('body-text').value=draft.body;
  $('preview').srcdoc=draft.html;
  message.textContent='';
  highlightSchool();updateComposeLink();
}
recipient.addEventListener('input',updateComposeLink);
subject.addEventListener('input',updateComposeLink);
search.addEventListener('input',renderDirectory);
filter.addEventListener('change',renderDirectory);
$('checked').textContent='Verified '+new Date(directory.checked+'T12:00:00Z').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric',timeZone:'Australia/Sydney'});

$('copy-styled').addEventListener('click',async()=>{
  try{
    await navigator.clipboard.write([new ClipboardItem({
      'text/html':new Blob([draft.fragment],{type:'text/html'}),
      'text/plain':new Blob([draft.body],{type:'text/plain'})
    })]);
    message.textContent='Styled eDM copied. Paste into the message body in Gmail.';
  }catch{
    message.textContent='Formatted copy is unavailable in this browser. Open Gmail with the plain message, or download the HTML.';
  }
});
$('copy-plain').addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(draft.body);message.textContent='Plain-text message copied.';
  }catch{
    const field=$('body-text');field.focus();field.select();message.textContent='Text selected. Use your keyboard’s copy shortcut.';
  }
});
$('download-html').addEventListener('click',()=>{
  const file=new Blob([draft.html],{type:'text/html;charset=utf-8'});
  const link=document.createElement('a'), url=URL.createObjectURL(file);
  link.href=url;link.download='The-Glenolia-'+selected.id+'-invitation.html';
  link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
selectSchool(selected);renderDirectory();
installInvitationDelivery(()=>({school:selected,recipient:recipient.value.trim(),subject:subject.value.trim()||draft.subject,body:draft.body}));
