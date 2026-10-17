// Fixed town-area point; no visitor location is collected or sent upstream.
export const location = {name:'Glenorie',latitude:-33.60,longitude:151.01};
const source='https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=-33.60&lon=151.01';
const maxAge=6*3600000;
const modelAge=24*3600000;

export function normaliseForecast(data,now=Date.now()) {
  const units=data?.properties?.meta?.units;
  if(units?.air_temperature!=='celsius'||units?.wind_speed!=='m/s'||units?.precipitation_amount!=='mm')throw Error('weather_units');
  const times=data?.properties?.timeseries;
  if(!Array.isArray(times))throw Error('weather_data');
  const eligible=times.filter(t=>Number.isFinite(Date.parse(t.time))&&Date.parse(t.time)<=now+300000&&Date.parse(t.time)>now-3*3600000).sort((a,b)=>Date.parse(b.time)-Date.parse(a.time));
  const row=eligible[0],details=row?.data?.instant?.details,next=row?.data?.next_1_hours;
  if(!details||!Number.isFinite(details.air_temperature)||details.air_temperature< -90||details.air_temperature>65||!Number.isFinite(details.wind_speed)||details.wind_speed<0||details.wind_speed>150||!next||!Number.isFinite(next.details?.precipitation_amount)||next.details.precipitation_amount<0||next.details.precipitation_amount>500)throw Error('weather_data');
  if(details.cloud_area_fraction!==undefined&&!Number.isFinite(details.cloud_area_fraction)||details.wind_from_direction!==undefined&&!Number.isFinite(details.wind_from_direction))throw Error('weather_data');
  const symbol=next.summary?.symbol_code||'unknown';
  const condition=/thunder/.test(symbol)?'thunderstorm':/snow|sleet/.test(symbol)?'snow':/rain/.test(symbol)?'rain':/fog/.test(symbol)?'fog':/cloud/.test(symbol)?'cloudy':/clear|fair/.test(symbol)?'clear':'unknown';
  const updated=Date.parse(data.properties.meta?.updated_at);
  if(!Number.isFinite(updated)||now-updated>modelAge||updated>now+300000)throw Error('weather_old');
  return {location,source:'MET Norway',sourceUrl:'https://api.met.no/',licence:'https://creativecommons.org/licenses/by/4.0/',modelUpdatedAt:new Date(updated).toISOString(),validAt:row.time,temperatureC:Math.round(details.air_temperature*10)/10,windKmh:Math.round(details.wind_speed*3.6),windDirection:details.wind_from_direction??null,rainNextHourMm:Math.max(0,next.details.precipitation_amount),cloud:Math.max(0,Math.min(100,details.cloud_area_fraction??50)),condition,symbol,estimated:true};
}

function served(row,now,stale=false) {
  if(!row?.payload||!Number.isFinite(row.fetched_at)||now-row.fetched_at>maxAge||row.fetched_at>now+300000)return null;
  try {
    const body=JSON.parse(row.payload),updated=Date.parse(body.modelUpdatedAt),valid=Date.parse(body.validAt);
    if(!Number.isFinite(updated)||!Number.isFinite(valid)||now-updated>modelAge||updated>now+300000||valid>now+300000||![body.temperatureC,body.windKmh,body.rainNextHourMm,body.cloud].every(Number.isFinite))return null;
    return {...body,fetchedAt:new Date(row.fetched_at).toISOString(),stale:stale||now-valid>90*60000};
  }catch{return null;}
}

export async function getWeather(db,fetcher=fetch,now=Date.now()) {
  await db.prepare('INSERT OR IGNORE INTO programme_weather (id) VALUES (1)').run();
  let row=await db.prepare('SELECT * FROM programme_weather WHERE id=1').first();
  if(row.expires_at>now)return served(row,now,false);
  const lock=await db.prepare('UPDATE programme_weather SET refresh_until=? WHERE id=1 AND refresh_until<=?').bind(now+12000,now).run();
  if(!lock.meta.changes)return served(row,now,true);
  try {
    const headers={'User-Agent':'TheGlenolia/1.0 (https://theglenolia.com.au; info@theglenolia.com.au)','Accept':'application/json'};
    if(row.modified)headers['If-Modified-Since']=row.modified;
    const response=await fetcher(source,{headers,signal:AbortSignal.timeout(8000)});
    const expires=Date.parse(response.headers.get('Expires'));
    // Never re-query before the provider's expiry; fall back to a 15-minute cache.
    const next=Number.isFinite(expires)&&expires>now?expires:now+15*60000;
    if(response.status===304&&row.payload){
      await db.prepare('UPDATE programme_weather SET expires_at=?,refresh_until=0 WHERE id=1').bind(next).run();
      return served(row,now,false);
    }
    if(!response.ok||Number(response.headers.get('Content-Length'))>1048576)throw Error('weather_provider');
    const value=normaliseForecast(await response.json(),now);
    await db.prepare('UPDATE programme_weather SET payload=?,expires_at=?,modified=?,fetched_at=?,refresh_until=0 WHERE id=1').bind(JSON.stringify(value),next,response.headers.get('Last-Modified'),now).run();
    return {...value,fetchedAt:new Date(now).toISOString(),stale:now-Date.parse(value.validAt)>90*60000};
  } catch {
    await db.prepare('UPDATE programme_weather SET refresh_until=? WHERE id=1').bind(now+5*60000).run();
    return served(row,now,true);
  }
}
