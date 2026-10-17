import SunCalc from 'suncalc';
export const GLENORIE={latitude:-33.60,longitude:151.01};
const zone={timeZone:'Australia/Sydney'};
const partsFormat=new Intl.DateTimeFormat('en-GB',{...zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
const formats=new Map();
function localFormats(locale){
  if(!formats.has(locale))formats.set(locale,{
    full:new Intl.DateTimeFormat(locale,{...zone,year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}),
    date:new Intl.DateTimeFormat(locale,{...zone,year:'numeric',month:'short',day:'numeric'}),
  });
  return formats.get(locale);
}

// A symbolic Southern Hemisphere phase, not an observer-angle sky projection.
export function moonPhasePath(phase){
  if(!Number.isFinite(phase))return '';
  const p=((phase%1)+1)%1,cos=Math.cos(p*Math.PI*2),outer=p<.5?0:1;
  const radius=Number((Math.abs(cos)*12).toFixed(5));
  return `M24 12 A12 12 0 0 ${outer} 24 36 A${radius} 12 0 0 ${cos>=0?1-outer:outer} 24 12 Z`;
}
export function sydneyState(date=new Date(),locale='en-AU') {
  const parts=Object.fromEntries(partsFormat.formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
  const {hour,minute,second}=parts,format=localFormats(locale);
  return {isDay:SunCalc.getPosition(date,GLENORIE.latitude,GLENORIE.longitude).altitude>-.833*Math.PI/180,hour,minute,second,
    angles:{hour:(hour%12)*30+minute/2+second/120,minute:minute*6+second/10,second:second*6},
    moonPhase:SunCalc.getMoonIllumination(date).phase,
    dateLabel:format.date.format(date),formatted:format.full.format(date),
    iso:date.toISOString()};
}
