export const plantInfo='https://theglenolia.com.au/plant-portal/';
export const signup='https://glenolia-education.theglenolia.workers.dev/#plant';
export const sender='john@theglenolia.com.au';
const root='https://theglenolia.com.au';
const footer='The Glenolia · 1435 Old Northern Road, Glenorie NSW 2157';
const phone='1300 70 11 55';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

export function schoolInvitation(school){
  const subject='A coffee plant for '+school.name+' to follow';
  const intro='I’m John Ou from The Glenolia, a farm in Glenorie. I’d like to invite '+school.name+' to join our free school coffee plant pilot.';
  const classActivity=school.level==='Secondary'
    ? 'Students can follow an individual coffee plant in our magnolia orchard, compare dated grower observations and use the student workbook to investigate growth and growing conditions.'
    : 'Students can follow an individual coffee plant in our magnolia orchard through farmer photos and updates. Teachers can use printable workbooks and activities, and send class questions to the farm.';
  const apply='An interested teacher can apply with a school email. We give nearby schools priority and offer a plant after review, subject to availability.';
  const forward='Could you please pass this to the teacher who looks after science, STEM or sustainability? I’d be happy to answer any questions.';
  const greeting='Hello '+school.name+' team,';
  const stop='If you’d prefer no further emails about the pilot, please reply and let me know.';
  const body=[greeting,intro,classActivity,apply,'Apply for your class: '+signup,'Explore the pilot: '+plantInfo,forward,'Kind regards,\nJohn Ou\nProgram Director and Head of Coffee\n'+footer+'\n'+sender+' · '+phone,stop].join('\n\n');

  const paragraph=(line)=>'<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#3b332d">'+esc(line)+'</p>';
  const fragment=`<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background:#f5f1e8"><tr><td align="center" style="padding:16px 9px">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;background:#fffdf8;border:1px solid #d9dfd0">
    <tr><td align="center" style="padding:20px;background:#f5f1e8"><img width="116" alt="THE GLENOLIA" style="display:block;height:auto;border:0" src="${root}/assets/email/logo-compact.png"></td></tr>
    <tr><td><img width="600" alt="Two farm workers among the magnolia rows at The Glenolia" style="display:block;width:100%;max-width:600px;height:auto;border:0" src="${root}/assets/plant-portal/orchard-share.jpg"></td></tr>
    <tr><td style="padding:27px 24px">
      <p style="margin:0 0 8px;font:700 11px/1.4 Arial,sans-serif;letter-spacing:1.5px;color:#2f4a3c">FREE SCHOOL PILOT · GLENORIE</p>
      <h1 style="margin:0 0 20px;font:normal 32px/1.16 Georgia,serif;color:#2f4a3c">Follow a coffee plant<br>with your class</h1>
      ${paragraph(greeting)}${paragraph(intro)}${paragraph(classActivity)}${paragraph(apply)}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:18px 0 12px"><tr><td bgcolor="#2f4a3c" style="border-radius:4px"><a href="${signup}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 19px;background:#2f4a3c;color:#fffdf8;font:700 15px/1.3 Arial,sans-serif;text-decoration:none;border-radius:4px">Apply for your class</a></td></tr></table>
      <p style="font:14px/1.5 Arial,sans-serif;margin:0 0 23px"><a href="${plantInfo}" target="_blank" rel="noopener" style="color:#2f4a3c">Explore the Plant Portal</a></p>
      ${paragraph(forward)}
      <p style="margin:0;font:16px/1.6 Arial,sans-serif;color:#3b332d">Kind regards,<br><strong>John Ou</strong><br>Program Director and Head of Coffee</p>
    </td></tr>
    <tr><td style="padding:18px 24px;background:#e7ebdf;color:#2f4a3c;font:13px/1.55 Arial,sans-serif">
      <strong>The Glenolia</strong><br>1435 Old Northern Road, Glenorie NSW 2157<br><a style="color:#2f4a3c" href="mailto:${sender}">${sender}</a> · <a style="color:#2f4a3c" href="tel:+611300701155">${phone}</a><br><br>${esc(stop)}
    </td></tr>
  </table></td></tr></table>`;
  const html='<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+esc(subject)+'</title></head><body style="margin:0">'+fragment+'</body></html>';
  return {subject,body,html,fragment};
}

export function singleSchoolAddress(value){
  return typeof value==='string'&&value.length<=254&&/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(value);
}
export function composeGmail(email,draft){
  if(!singleSchoolAddress(email))return null;
  const query=new URLSearchParams({authuser:sender,view:'cm',fs:'1',to:email,su:draft.subject,body:draft.body});
  return 'https://mail.google.com/mail/?'+query;
}
