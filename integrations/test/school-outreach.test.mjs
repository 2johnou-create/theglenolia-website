import assert from 'node:assert/strict';
import test from 'node:test';
import { handleAdmin } from '../admin-worker.mjs';
import { composeGmail, schoolInvitation, signup } from '../school-outreach.mjs';
import { contactsCSV } from '../school-outreach-contacts.mjs';
import directory from '../admin-ui/school-outreach-directory.json' with {type:'json'};

const origin='https://glenolia-admin.theglenolia.workers.dev';
const env={ACCESS_AUD:'test-audience',ADMIN_EMAIL:'owner@example.test',FARMER_EMAILS:'farmer@example.test'};
const ctx=email=>({access:{aud:'test-audience',getIdentity:async()=>({email})}});
const address=(path, options)=>new Request(origin+path,options);

test('office directory has unique schools, sources and accurate coverage of email contacts',()=>{
  const {schools}=directory;
  assert.equal(new Set(schools.map(s=>s.id)).size,schools.length);
  assert.equal(new Set(schools.filter(s=>s.email).map(s=>s.email)).size,14);
  assert.equal(schools.filter(s=>s.first).length,7);
  assert.equal(schools.filter(s=>!s.email).length,3);
  assert.ok(schools.every(s=>s.source.startsWith('https://')&&/^02 \d{4} \d{4}$/.test(s.phone)));
  assert.equal(contactsCSV().trim().split('\r\n').length,18);
});

test('email template personalises each audience and retains both the programme and school application links',()=>{
  const primary=schoolInvitation({name:'Sample Primary School',level:'Primary'});
  const secondary=schoolInvitation({name:'Example & Associates',level:'Secondary'});
  assert.match(primary.body,/printable workbooks/);
  assert.match(secondary.body,/compare dated grower observations/);
  assert.ok(primary.html.includes('href="'+signup+'"'));
  assert.ok(primary.html.includes('href="https://theglenolia.com.au/plant-portal/"'));
  assert.ok(primary.html.includes('If you’d prefer no further emails'));
  assert.ok(secondary.html.includes('Example &amp; Associates'));
  const email='office@example.test';
  const compose=new URL(composeGmail(email,secondary));
  assert.equal(compose.origin,'https://mail.google.com');
  assert.equal(compose.searchParams.get('to'),email);
  assert.equal(compose.searchParams.get('su'),secondary.subject);
  assert.equal(compose.searchParams.get('body'),secondary.body);
  assert.equal(compose.searchParams.get('bcc'),null);
  for(const malformed of ['',email+',second@example.test',email+'\r\nBcc:b@example.test',email+'?cc=b@example.test']){
    assert.equal(composeGmail(malformed,secondary),null);
  }
});

test('school invitations and CSV use the exact owner Access gate and offer no send endpoint',async()=>{
  for(const path of ['/school-outreach/','/school-outreach/app.js','/school-outreach/styles.css','/school-outreach/contact-list.csv']){
    for(const denied of [{},ctx('farmer@example.test'),ctx('other@example.test')]){
      assert.equal((await handleAdmin(address(path),env,denied)).status,403);
    }
    const authorized=await handleAdmin(address(path),env,ctx(env.ADMIN_EMAIL));
    assert.equal(authorized.status,200);
    assert.equal(authorized.headers.get('cache-control'),'no-store');
    assert.equal(authorized.headers.get('x-robots-tag'),'noindex, nofollow');
  }
  for(const path of ['/school-outreach/','/school-outreach/send']){
    const response=await handleAdmin(address(path,{method:'POST',headers:{Origin:origin}}),env,ctx(env.ADMIN_EMAIL));
    assert.equal(response.status,405);
  }
});
