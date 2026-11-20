import {getWeather,location} from './programme-weather.mjs';
import {currentSydneyDate} from './education-workspace.mjs';
import {json} from './education-common.mjs';

const timeZone='Australia/Sydney';
const licenceUrl='https://creativecommons.org/licenses/by/4.0/';
const climate={source:'Queensland SILO',sourceUrl:'https://www.longpaddock.qld.gov.au/silo/'};
const grid={latitude:-33.60,longitude:151.00};
const period='Daily area rainfall estimate, 24 hours to 9 am on the reporting date';
const hour=3600000;
const offset=(date,days)=>new Date(Date.parse(date+'T12:00:00Z')+days*86400000).toISOString().slice(0,10);
const round=value=>Math.round(value*100)/100;

// SILO's 75 is a long-term climatic normal. Never present it as recent weather.
export function normaliseDaily(data,from,to) {
  if (data?.location?.latitude!==grid.latitude || data?.location?.longitude!==grid.longitude || !Array.isArray(data.data)) {
    throw Error('invalid_climate_grid');
  }
  const days=new Map();
  for (const record of data.data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date) || record.date<from || record.date>to || !Array.isArray(record.variables)) continue;
    if (days.has(record.date)) throw Error('duplicate_climate_date');
    const metric=(code,min,max)=>{
      const item=record.variables.find(v=>v.variable_code===code);
      return item && [0,15,25,35].includes(item.source) && Number.isFinite(item.value) && item.value>=min && item.value<=max ? item.value : null;
    };
    let minTemperatureC=metric('min_temp',-20,40), maxTemperatureC=metric('max_temp',-9,54);
    if (minTemperatureC!==null && maxTemperatureC!==null && minTemperatureC>maxTemperatureC) {
      minTemperatureC=null; maxTemperatureC=null;
    }
    days.set(record.date,{day:record.date,minTemperatureC,maxTemperatureC,rainfallMm:metric('daily_rain',0,1300)});
  }
  return [...days.values()].sort((a,b)=>a.day.localeCompare(b.day));
}

function climateRequest(from,to) {
  const url=new URL('https://www.longpaddock.qld.gov.au/cgi-bin/silo/DataDrillDataset.php');
  url.search=new URLSearchParams({lat:grid.latitude.toFixed(2),lon:grid.longitude.toFixed(2),start:from.replaceAll('-',''),finish:to.replaceAll('-',''),
    format:'json',comment:'RXN',username:'info@theglenolia.com.au',password:'apirequest'});
  return url.href;
}

async function dailySeries(db,fetcher,from,to,key,now) {
  await db.prepare('INSERT OR IGNORE INTO edu_plant_climate_cache(cache_key) VALUES(?)').bind(key).run();
  const row=await db.prepare('SELECT * FROM edu_plant_climate_cache WHERE cache_key=?').bind(key).first();
  const cached=()=>{ try { return JSON.parse(row.payload)||[]; } catch { return []; } };
  const cacheLife=key==='fortnight' ? 6*hour : 7*24*hour;
  if(row.through_date===to && now-row.fetched_at<cacheLife && row.payload) return cached();
  const lock=await db.prepare('UPDATE edu_plant_climate_cache SET refresh_until=? WHERE cache_key=? AND refresh_until<=?').bind(now+10000,key,now).run();
  if(!lock.meta.changes) return cached();
  try {
    const r=await fetcher(climateRequest(from,to),{headers:{Accept:'application/json','User-Agent':'TheGlenolia/1.0 (https://theglenolia.com.au; info@theglenolia.com.au)'},signal:AbortSignal.timeout(3200)});
    if(!r.ok || Number(r.headers.get('Content-Length'))>100000) throw Error('climate_unavailable');
    const data=normaliseDaily(await r.json(),from,to);
    if(!data.length) throw Error('climate_unavailable');
    await db.prepare('UPDATE edu_plant_climate_cache SET payload=?,through_date=?,fetched_at=?,refresh_until=0 WHERE cache_key=?')
      .bind(JSON.stringify(data),to,now,key).run();
    return data;
  } catch {
    await db.prepare('UPDATE edu_plant_climate_cache SET refresh_until=? WHERE cache_key=?').bind(now+5*60000,key).run();
    return cached();
  }
}

export function historicalSummary(data,yesterday) {
  const valid=new Map(data.map(d=>[d.day,d]));
  const from=offset(yesterday,-13);
  const range=Array.from({length:14},(_,i)=>valid.get(offset(from,i)));
  function series(meanMetric) {
    // Some recent days have provisional or climatological values. Find a genuine
    // full fortnight and expose its own dates rather than counting missing days.
    for(let lag=0;lag<=3;lag++){
      const end=offset(yesterday,-lag),start=offset(end,-13);
      const values=Array.from({length:14},(_,i)=>{const d=valid.get(offset(start,i));return d ? meanMetric(d) : null;});
      if(values.every(Number.isFinite)) return {mean:round(values.reduce((a,b)=>a+b,0)/14),from:start,to:end};
    }
    return {mean:null,from:null,to:null};
  }
  const temp=series(d=>Number.isFinite(d.minTemperatureC)&&Number.isFinite(d.maxTemperatureC)?(d.minTemperatureC+d.maxTemperatureC)/2:null);
  const rain=series(d=>d.rainfallMm);
  const latestRain=range.filter(d=>Number.isFinite(d?.rainfallMm)).at(-1);
  return {...climate,from,to:yesterday,days:range.filter(d=>Number.isFinite(d?.rainfallMm) || Number.isFinite(d?.maxTemperatureC)).length,
    meanTemperatureC:temp.mean,temperatureFrom:temp.from,temperatureTo:temp.to,
    meanRainfallMm:rain.mean,rainfallFrom:rain.from,rainfallTo:rain.to,
    latestRainfallMm:latestRain?.rainfallMm??null,latestRainfallDay:latestRain?.day??null,
    grid,period,temperatureMethod:'Mean of daily minimum/maximum midpoints'};
}

async function readContext(env,at,observedOn=null) {
  const date=currentSydneyDate(new Date(at)),to=offset(date,-1),from=offset(to,-16);
  const fetcher=env.WEATHER_FETCH || fetch;
  const oldDay=observedOn && observedOn<from;
  const [weather,windowData,extra]=await Promise.all([
    getWeather(env.EDU_DB,fetcher,at,3200).catch(()=>null),
    dailySeries(env.EDU_DB,fetcher,from,to,'fortnight',at).catch(()=>[]),
    oldDay ? dailySeries(env.EDU_DB,fetcher,observedOn,observedOn,'day:'+observedOn,at).catch(()=>[]) : []
  ]);
  let current=null;
  if(weather && at-Date.parse(weather.validAt)<=6*hour) {
    const {temperatureC,windKmh,rainNextHourMm,source,sourceUrl,validAt,modelUpdatedAt,stale}=weather;
    current={temperatureC,humidityPct:weather.humidityPct??null,windKmh,rainNextHourMm,validAt,modelUpdatedAt,stale,source,sourceUrl,
      method:'Glenorie-area model estimate'};
  }
  const history=historicalSummary(windowData,to);
  const daily=(oldDay?extra:windowData).find(d=>d.day===observedOn);
  return {current,history,observedDay:daily?{...daily,...climate,grid,period}:null};
}

export async function publicPlantWeather(request,env,now=Date.now()) {
  const {current,history}=await readContext(env,now);
  const cors=request.headers.get('Origin')==='https://theglenolia.com.au'?{'Access-Control-Allow-Origin':'https://theglenolia.com.au'}:{};
  return json({timeZone,location,current,history,licenceUrl},200,{...cors,'Vary':'Origin','Cache-Control':'public, max-age=180'});
}

export async function snapshotForUpdate(env,plant,observedOn,loggedAt) {
  const {current,history,observedDay}=await readContext(env,Date.parse(loggedAt),observedOn);
  const rainfall=history.latestRainfallDay ? {...climate,mm:history.latestRainfallMm,day:history.latestRainfallDay,grid,period}:null;
  return JSON.stringify({loggedAt,timeZone,location:{name:'The Glenolia, Glenorie',plantKey:plant.key,row:plant.row,position:plant.position},
    current,rainfall,observedDay,licenceUrl});
}
