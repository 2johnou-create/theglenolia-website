// Optional small API for the static site. Provision and verify its bindings before enabling registration.
const locales = { 'en-AU': ['EN', ''], 'zh-Hant': ['ZH', 'zh-hant/'], ja: ['JA', 'ja/'] };
const allowedInterests = new Set(['opening', 'coffee', 'workshops', 'local']);
const consentVersion = '2026-10-12-v1';
const baseOrigin = 'https://theglenolia.com.au';
const json = (status, body, origin) => new Response(JSON.stringify(body), {status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':origin,'Vary':'Origin','X-Content-Type-Options':'nosniff'}});

export async function handleRequest(request, env, fetcher = fetch) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = (env.ALLOWED_ORIGINS || baseOrigin).split(',').map(x=>x.trim());
  if (!origin || !allowedOrigins.includes(origin)) return json(403, {error:'origin'}, baseOrigin);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}});
  if (request.method !== 'POST' || new URL(request.url).pathname !== '/subscribe') return json(404,{error:'not_found'},origin);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json(415,{error:'content_type'},origin);
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID || !env.RATE_LIMITER || !env.RECIPIENT_LIMITER) return json(503,{error:'not_ready'},origin);
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  try {
    const rate = await env.RATE_LIMITER.limit({key:ip});
    if (!rate.success) return json(429,{error:'rate_limit'},origin);
  } catch { return json(503,{error:'not_ready'},origin); }
  let payload;
  try {
    if (!request.body) return json(400,{error:'invalid'},origin);
    const reader=request.body.getReader(); let parts=[],size=0;
    for (;;) { const {done,value}=await reader.read(); if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();return json(413,{error:'size'},origin);}parts.push(value); }
    const joined=new Uint8Array(size);let at=0;for(const part of parts){joined.set(part,at);at+=part.byteLength;}
    payload=JSON.parse(new TextDecoder().decode(joined));
  } catch { return json(400,{error:'invalid'},origin); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json(400,{error:'invalid'},origin);
  const {email,firstName='',language,interests=[],consent,website='',consentVersion:version}=payload;
  if (website) return json(400,{error:'invalid'},origin);
  if (typeof email !== 'string' || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || consent !== true || version !== consentVersion || !locales[language] || typeof firstName !== 'string' || firstName.length>80 || !Array.isArray(interests) || interests.length>4 || interests.some(x=>!allowedInterests.has(x))) return json(400,{error:'invalid'},origin);
  const [locale,prefix]=locales[language];
  const template=Number(env['BREVO_TEMPLATE_'+locale]);const list=Number(env.BREVO_LIST_ID);
  if (!Number.isSafeInteger(template) || template<1 || !Number.isSafeInteger(list) || list<1) return json(503,{error:'not_ready'},origin);
  try {
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(email.trim().toLowerCase()));
    const recipientKey=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
    const recipientRate=await env.RECIPIENT_LIMITER.limit({key:recipientKey});
    if (!recipientRate.success) return json(429,{error:'rate_limit'},origin);
    const response=await fetcher('https://api.brevo.com/v3/contacts/doubleOptinConfirmation',{method:'POST',redirect:'error',headers:{'api-key':env.BREVO_API_KEY,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:email.trim(),includeListIds:[list],templateId:template,redirectionUrl:baseOrigin+'/'+prefix+'confirmed/',contactPixelTrackingConsent:false,attributes:{FIRSTNAME:firstName.trim(),LANGUAGE:language,INTERESTS:[...new Set(interests)].join(','),CONSENT_AT:new Date().toISOString(),CONSENT_VERSION:version}}),signal:AbortSignal.timeout(10000)});
    // Never report success unless the provider accepted the confirmation request.
    if (!response.ok) return json(502,{error:'provider'},origin);
    return json(200,{status:'confirmation_sent'},origin);
  } catch { return json(502,{error:'provider'},origin); }
}
export default {fetch(request, env) { return handleRequest(request, env); }};
