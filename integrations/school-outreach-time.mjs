const sydney='Australia/Sydney';
const localTime=new Intl.DateTimeFormat('en-AU',{timeZone:sydney,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const readable=new Intl.DateTimeFormat('en-AU',{timeZone:sydney,weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
function parts(ms){
  const result=Object.fromEntries(localTime.formatToParts(ms).map(p=>[p.type,p.value]));
  return result.year+'-'+result.month+'-'+result.day+'T'+result.hour+':'+result.minute;
}
export function sydneyInstant(local){
  if(typeof local!=='string'||!/^20\d\d-\d\d-\d\dT\d\d:\d\d$/.test(local))return null;
  const wall=Date.parse(local+':00Z');
  if(!Number.isFinite(wall)||new Date(wall).toISOString().slice(0,16)!==local)return null;
  // Check each offset in use around this date. Two matching instants mean the
  // clock repeats this minute at the end of daylight saving.
  const probes=[wall-36*3600000,wall+36*3600000];
  const offsets=new Set(probes.map(ms=>Date.parse(parts(ms)+':00Z')-ms));
  const matches=[...offsets].map(offset=>wall-offset).filter(ms=>parts(ms)===local);
  return matches.length===1?matches[0]:null;
}
export const sydneyDateTime=ms=>readable.format(ms);
