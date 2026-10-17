import seed from '../programme-content.json' with {type:'json'};
import {fetchPublicProgramme} from './programme-store.mjs';
import {getWeather} from './programme-weather.mjs';

const headers={'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=60','Referrer-Policy':'no-referrer'};
export async function handlePublicProgramme(request,env,fetcher=fetch) {
  const url=new URL(request.url);
  if(!['/public/programme','/public/weather'].includes(url.pathname))return null;
  if(request.method!=='GET')return new Response(JSON.stringify({error:'method'}),{status:405,headers:{...headers,Allow:'GET'}});
  if(!env.DB)return new Response(JSON.stringify({error:'temporarily_unavailable'}),{status:503,headers});
  try {
    const data=url.pathname==='/public/weather'?await getWeather(env.DB,fetcher):await fetchPublicProgramme(env.DB,seed.initial);
    if(!data)throw Error('unavailable');
    return new Response(JSON.stringify(data),{headers});
  } catch {return new Response(JSON.stringify({error:'temporarily_unavailable'}),{status:503,headers});}
}
