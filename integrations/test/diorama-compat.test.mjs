import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readProgressCompatibility,restoreProgressCompatibility} from '../../scripts/progress-compat.mjs';

const real=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../compat/progress');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function fixture(t,files={
  'world-AAAAAAAA.js':'import {value} from "./chunk-BBBBBBBB.js";export {value};',
  'chunk-BBBBBBBB.js':'export const value=1;',
}){
  const base=await mkdtemp(path.join(tmpdir(),'glenolia-compat-')),source=path.join(base,'source'),output=path.join(base,'output');
  t.after(()=>rm(base,{recursive:true,force:true}));await mkdir(source);await mkdir(output);
  const entries=[];
  for(const [name,text] of Object.entries(files)){const bytes=Buffer.from(text);await writeFile(path.join(source,name),bytes);entries.push({name,bytes:bytes.length,sha256:hash(bytes)});}
  const manifest={schemaVersion:1,releases:[{commit:'a'.repeat(40),files:entries}]};
  const save=()=>writeFile(path.join(source,'manifest.json'),JSON.stringify(manifest));await save();
  return {source,output,manifest,save};
}

test('both confirmed cached release graphs retain their exact bytes and complete imports',async()=>{
  const {manifest,files}=await readProgressCompatibility(real);
  assert.deepEqual(manifest.releases.map(release=>release.commit),['035dc6180ca0c93fc981b8e12a2e66615808af34','ade3691a17b927807af12377838aaa5594df8738']);
  assert.equal(files.size,11);assert.equal([...files.keys()].filter(name=>name.endsWith('.js')).length,9);
  assert.ok(files.has('world-LW2733AX.js'));assert.ok(files.has('programme-world-G3GQSV43.js'));
  assert.ok(files.has('world-SRIUL2U4.js'));assert.ok(files.has('programme-world-NXA6FNAG.js'));
  assert.ok([...files.values()].reduce((sum,file)=>sum+file.bytes.length,0)<2*1024*1024);
});

test('restoration keeps the original root URLs and accepts an identical current shared chunk',async t=>{
  const f=await fixture(t);await writeFile(path.join(f.output,'chunk-BBBBBBBB.js'),'export const value=1;');
  const restored=await restoreProgressCompatibility(f.output,f.source);assert.equal(restored.length,2);
  for(const entry of f.manifest.releases[0].files)assert.equal(hash(await readFile(path.join(f.output,entry.name))),entry.sha256);
});

test('compatibility never overwrites a fresh bundle or leaves partial copies on conflict',async t=>{
  const f=await fixture(t);await writeFile(path.join(f.output,'world-AAAAAAAA.js'),'fresh current bundle');
  await assert.rejects(restoreProgressCompatibility(f.output,f.source),/conflicts with fresh build/);
  assert.equal(await readFile(path.join(f.output,'world-AAAAAAAA.js'),'utf8'),'fresh current bundle');
  await assert.rejects(readFile(path.join(f.output,'chunk-BBBBBBBB.js')),error=>error.code==='ENOENT');
});

test('tampered bytes and missing transitive chunks are rejected before publication',async t=>{
  const corrupted=await fixture(t);await writeFile(path.join(corrupted.source,'chunk-BBBBBBBB.js'),'export const value=2;');
  await assert.rejects(readProgressCompatibility(corrupted.source),/content mismatch/);
  const missing=await fixture(t,{'world-AAAAAAAA.js':'import "./chunk-BBBBBBBB.js";'});
  await assert.rejects(readProgressCompatibility(missing.source),/Unclosed.*import/);
});

test('only bounded hashed modules can enter the compatibility archive',async t=>{
  const f=await fixture(t);f.manifest.releases[0].files[0].name='../progress.js';await f.save();
  await assert.rejects(readProgressCompatibility(f.source),/Invalid.*file/);
  const extra=await fixture(t);await writeFile(path.join(extra.source,'unlisted-private.txt'),'not published');
  await assert.rejects(readProgressCompatibility(extra.source),/Unlisted.*file/);
  const releases=await fixture(t);releases.manifest.releases.push(...structuredClone(releases.manifest.releases),...structuredClone(releases.manifest.releases));await releases.save();
  await assert.rejects(readProgressCompatibility(releases.source),/release manifest/);
});
