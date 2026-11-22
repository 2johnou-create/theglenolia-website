import directory from './admin-ui/school-outreach-directory.json' with {type:'json'};

export function contactsCSV(){
  const cell=value=>'"'+String(value).replaceAll('"','""')+'"';
  const rows=[['School','Suburb','Level','Office phone','Published office email','Official source','Suggested first round','Verified Sydney date'],
    ...directory.schools.map(school=>[school.name,school.suburb,school.level,school.phone,school.email,school.source,school.first?'Yes':'',directory.checked])];
  return '\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
