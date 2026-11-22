import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {handleAdmin} from '../admin-worker.mjs';
import {runSchoolInvitations,schoolDeliveryRequest} from '../school-outreach-delivery.mjs';
import {sydneyInstant} from '../school-outreach-time.mjs';

const base='https://glenolia-admin.theglenolia.workers.dev';
const route='/school-outreach/delivery';
const dueTime='2027-03-18T10:00';
const due=Date.parse('2027-03-17T23:00:00Z');
const start=due-60000;
const json=(status,body)=>Response.json(body,{status});
function fixture(t){
  const sql=new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../migrations/007-school-invitation-delivery.sql',import.meta.url),'utf8'));
  t.after(()=>sql.close());
  const db={prepare(query){
    const statement=sql.prepare(query),wrapped=(args=[])=>({
      bind:(...values)=>wrapped(values),
      async first(){return statement.get(...args)||null;},
      async all(){return {results:statement.all(...args)};},
      async run(){return {meta:{changes:Number(statement.run(...args).changes)}};}
    });
    return wrapped();
  }};
  const requests=[];
  const provider=async(url,options)=>{
    requests.push({url,body:JSON.parse(options.body)});
    return json(201,{messageId:'fake-provider-id'});
  };
  const env={DB:db,SENDING_READY:'true',BREVO_API_KEY:'fictional-in-tests',ACCESS_AUD:'fake-aud',ADMIN_EMAIL:'owner@example.test'};
  const send=(draft,fetcher=provider,stamp=start)=>schoolDeliveryRequest(env,'POST','send',draft,json,fetcher,stamp);
  const finish=(draft,overrides={})=>({
    id:crypto.randomUUID(),schoolId:'glenorie',recipient:'office@example.test',subject:'A classroom invitation',
    scheduledFor:dueTime,permitted:true,...draft,...overrides
  });
  const stored=id=>sql.prepare('SELECT * FROM school_invitation_deliveries WHERE id=?').get(id);
  return {env,provider,requests,send,finish,stored,sql};
}
test('Sydney local dates use daylight saving, and reject skipped, repeated and invalid times',()=>{
  assert.equal(sydneyInstant(dueTime),due);
  assert.equal(sydneyInstant('2027-06-10T09:15'),Date.parse('2027-06-09T23:15:00Z'));
  for(const local of ['2027-04-04T02:20','2027-10-03T02:20','2027-02-29T08:00','2027-09-01T24:00','2027-09-01T03:00Z','2027-09-01T03:75']){
    assert.equal(sydneyInstant(local),null,local);
  }
});

test('Send now dispatches a single reviewed message and replays the same review safely',async t=>{
  const f=fixture(t),payload=f.finish({scheduledFor:null});
  const response=await f.send(payload);
  assert.equal(response.status,201);
  assert.equal((await response.json()).delivery.phase,'accepted');
  assert.equal(f.requests.length,1);
  const [{url,body}]=f.requests;
  assert.equal(url,'https://api.brevo.com/v3/smtp/email');
  assert.deepEqual(body.to,[{email:'office@example.test'}]);
  assert.equal(body.replyTo.email,'john@theglenolia.com.au');
  assert.equal(body.sender.email,'info@theglenolia.com.au');
  assert.equal(body.subject,payload.subject);
  assert.ok(body.htmlContent.includes('#plant'));
  assert.ok(body.textContent.includes('https://theglenolia.com.au/plant-portal/'));
  assert.equal(body.headers.idempotencyKey,payload.id);
  assert.equal((await f.send(payload)).status,200);
  assert.equal((await f.send({...payload,subject:'Different subject'})).status,409);
  assert.equal(f.requests.length,1);
});

test('scheduled email waits until due and overlapping scheduler ticks send only once',async t=>{
  const f=fixture(t),payload=f.finish();
  const response=await f.send(payload);
  assert.equal((await response.json()).delivery.phase,'queued');
  assert.equal((await f.send(f.finish())).status,409);
  await runSchoolInvitations(f.env,f.provider,due-1);
  assert.equal(f.requests.length,0);
  await Promise.all([runSchoolInvitations(f.env,f.provider,due),runSchoolInvitations(f.env,f.provider,due)]);
  assert.equal(f.requests.length,1);
  assert.equal(f.stored(payload.id).phase,'accepted');
});
test('cancelled records never send, and immediate or scheduled delivery cannot be created without specific consent',async t=>{
  const f=fixture(t),payload=f.finish();
  for(const bad of [{permitted:false},{recipient:'a@example.test,b@example.test'},{subject:'Bad\nBcc: test'},{scheduledFor:'2001-01-01T00:00'},{scheduledFor:'2027-03-17T00:00'}]){
    assert.equal((await f.send({...payload,...bad})).status,400);
  }
  await f.send(payload);
  const cancel=await schoolDeliveryRequest(f.env,'POST','cancel',{id:payload.id},json,f.provider,start+1);
  assert.equal((await cancel.json()).delivery.phase,'cancelled');
  await runSchoolInvitations(f.env,f.provider,due+5*60000);
  assert.equal(f.requests.length,0);
  assert.equal(f.stored(payload.id).phase,'cancelled');
});
test('transport failures are visible, and uncertain deliveries do not resend',async t=>{
  const f=fixture(t);
  const timeout=f.finish({scheduledFor:null});
  await f.send(timeout,async()=>{throw Error('network connection interrupted');});
  assert.equal(f.stored(timeout.id).phase,'needs_review');
  await runSchoolInvitations(f.env,f.provider,start+600000);
  assert.equal(f.requests.length,0);
  assert.equal((await f.send(f.finish({scheduledFor:null}))).status,409);
  const rejected=f.finish({recipient:'other@example.test',scheduledFor:null});
  await f.send(rejected,async()=>json(403,{message:'fake rejection'}));
  assert.equal(f.stored(rejected.id).phase,'failed');
  const interrupted=f.finish({recipient:'third@example.test'});
  await f.send(interrupted);
  f.sql.prepare("UPDATE school_invitation_deliveries SET phase='sending',updated_at=? WHERE id=?").run(start,interrupted.id);
  await runSchoolInvitations(f.env,f.provider,start+3*60000);
  assert.equal(f.stored(interrupted.id).phase,'needs_review');
  assert.equal(f.requests.length,0);
});
test('a rate-limited attempt queues for later rather than dispatching early',async t=>{
  const f=fixture(t),payload=f.finish({scheduledFor:null});
  await f.send(payload,async()=>json(429,{}));
  assert.equal(f.stored(payload.id).phase,'queued');
  await runSchoolInvitations(f.env,f.provider,start+5*60000-1);
  assert.equal(f.requests.length,0);
  await runSchoolInvitations(f.env,f.provider,start+5*60000);
  assert.equal(f.requests.length,1);
  assert.equal(f.stored(payload.id).phase,'accepted');
});
test('delivery list and writes are owner-only with same-origin POSTs',async t=>{
  const f=fixture(t),req=(path,origin,body)=>new Request(base+path,{
    method:body?'POST':'GET',headers:body?{Origin:origin,'Content-Type':'application/json'}:{},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  const context=email=>({access:{aud:f.env.ACCESS_AUD,getIdentity:async()=>({email})}});
  assert.equal((await handleAdmin(req(route),f.env,{},f.provider)).status,403);
  assert.equal((await handleAdmin(req(route),f.env,context('someone@example.test'),f.provider)).status,403);
  assert.equal((await handleAdmin(req(route,'https://outside.example',f.finish()),f.env,context(f.env.ADMIN_EMAIL),f.provider)).status,403);
  const reply=await handleAdmin(req(route),f.env,context(f.env.ADMIN_EMAIL),f.provider);
  assert.equal(reply.status,200);assert.deepEqual((await reply.json()).deliveries,[]);
  assert.equal(f.requests.length,0);
});
