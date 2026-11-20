const zone = 'Australia/Sydney';
const clockDate = new Intl.DateTimeFormat('en-AU', {timeZone:zone, weekday:'short',day:'numeric',month:'short'});
const clockTime = new Intl.DateTimeFormat('en-AU', {timeZone:zone,hour:'numeric',minute:'2-digit',timeZoneName:'short'});
const analogueTime = new Intl.DateTimeFormat('en-AU', {timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const stamp = new Intl.DateTimeFormat('en-AU', {timeZone:zone, month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
const decimal = new Intl.NumberFormat('en-AU', {maximumFractionDigits:1});
const byId = id => document.getElementById(id);
const present = number => typeof number === 'number' && Number.isFinite(number);
const reading = (value,unit) => present(value) ? decimal.format(value) + unit : '—';

function showClock() {
  const now = new Date();
  const time = byId('farm-time');
  time.dateTime = now.toISOString();
  time.textContent = clockDate.format(now) + ' · ' + clockTime.format(now);
  const [hours,minutes] = analogueTime.format(now).split(':').map(Number);
  byId('clock-hour').style.transform = 'rotate(' + ((hours%12)*30+minutes*.5) + 'deg)';
  byId('clock-minute').style.transform = 'rotate(' + minutes*6 + 'deg)';
}
function day(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const time = new Date(value+'T12:00:00Z');
  return isNaN(time) ? '' : time.toLocaleDateString('en-AU',{timeZone:zone,day:'numeric',month:'short',year:'numeric'});
}
function range(from,to) {
  const a=day(from), b=day(to);
  return a && b ? ' (' + a + ' – ' + b + ')' : '';
}
function source(parent,title,value) {
  if (!value || !title) return;
  let url;
  try { url=new URL(value); } catch { return; }
  if (url.protocol !== 'https:') return;
  const link=document.createElement('a');
  link.textContent=title; link.href=url.href;
  if (parent.childNodes.length) parent.append(' · ');
  parent.append(link);
}
function showWeather(report, fetchFailed) {
  const current=report?.current, history=report?.history;
  for (const [id,value,unit] of [
    ['wx-temp',current?.temperatureC,' °C'],['wx-humidity',current?.humidityPct,' %'],
    ['wx-wind',current?.windKmh,' km/h'],['wx-rain',current?.rainNextHourMm,' mm'],
    ['wx-mean-temp',history?.meanTemperatureC,' °C'],['wx-mean-rain',history?.meanRainfallMm,' mm/day']
  ]) byId(id).textContent = reading(value,unit);
  const observation=current?.validAt ? new Date(current.validAt) : null;
  const time=observation && !isNaN(observation) ? ' for ' + stamp.format(observation) + ' (Sydney time)' : '';
  byId('wx-current-note').textContent=current
    ? 'Glenorie area forecast' + time + '. Rain is the forecast for the following hour.' + (current.stale || fetchFailed ? ' Showing the last available forecast.' : '')
    : 'The Glenorie area forecast is currently unavailable.';
  const tempPeriod=range(history?.temperatureFrom || history?.from,history?.temperatureTo || history?.to);
  const rainPeriod=range(history?.rainfallFrom || history?.from,history?.rainfallTo || history?.to);
  const details=[];
  if (present(history?.meanTemperatureC)) details.push('Average daily temperature'+ tempPeriod + '.');
  if (present(history?.meanRainfallMm)) details.push('Average daily rainfall'+rainPeriod+'.');
  if (!present(history?.meanTemperatureC) || !present(history?.meanRainfallMm))
    details.push('A dash means that a complete set of 14 daily readings is unavailable for that average.');
  if (present(history?.latestRainfallMm) && day(history.latestRainfallDay))
    details.push('Latest daily rainfall was '+reading(history.latestRainfallMm,' mm')+' on '+day(history.latestRainfallDay)+'.');
  byId('wx-history-note').textContent=details.join(' ');
  const links=byId('wx-source');links.replaceChildren();
  source(links,'MET Norway',current?.sourceUrl || 'https://api.met.no/weatherapi/locationforecast/2.0/documentation');
  source(links,'Queensland SILO',history?.sourceUrl || 'https://www.longpaddock.qld.gov.au/silo/');
  source(links,'CC BY 4.0',report?.licenceUrl || 'https://creativecommons.org/licenses/by/4.0/');
}
export function installFarmWeather(endpoint) {
  showClock();
  let report, loading=false, lastAttempt=0;
  async function refresh() {
    if (loading || document.hidden || Date.now()-lastAttempt<300000) return;
    lastAttempt=Date.now();loading=true;
    const controller = new AbortController();
    const cancel=setTimeout(()=>controller.abort(),15000);
    try {
      const response=await fetch(endpoint,{credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
      if (!response.ok) throw Error('Unavailable');
      const data=await response.json();
      if (data.timeZone !== zone) throw Error('Unexpected weather location');
      report=data;showWeather(report,false);
    } catch { showWeather(report,true); }
    finally {clearTimeout(cancel);loading=false;}
  }
  function resume(){if(!document.hidden){showClock();refresh();}}
  refresh();
  window.setInterval(()=>{if(!document.hidden)showClock();},15000);
  window.setInterval(refresh,300000);
  document.addEventListener('visibilitychange',resume);
  window.addEventListener('pageshow',resume);
}
