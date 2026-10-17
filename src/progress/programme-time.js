import SunCalc from 'suncalc';
export const GLENORIE={latitude:-33.60,longitude:151.01};
export function sydneyState(date=new Date(),locale='en-AU') {
  const options={timeZone:'Australia/Sydney'};
  const hour=Number(new Intl.DateTimeFormat('en-GB',{...options,hour:'2-digit',hourCycle:'h23'}).format(date));
  return {isDay:SunCalc.getPosition(date,GLENORIE.latitude,GLENORIE.longitude).altitude>-.833*Math.PI/180,hour,
    formatted:new Intl.DateTimeFormat(locale,{...options,year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(date),
    iso:date.toISOString()};
}
