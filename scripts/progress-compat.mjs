import {readFile,readdir,copyFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const filename=/^(?:chunk|world|programme-world)-[A-Z0-9]{8}\.js(?:\.LEGAL\.txt)?$/;
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
const imports=text=>[...text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']/g)].map(match=>match[1]);

// Only frozen, previously published content-hashed modules belong here. Keep
// every old import graph closed, and never replace the freshly built bundle.
export async function readProgressCompatibility(sourceDirectory) {
  const manifest=JSON.parse(await readFile(path.join(sourceDirectory,'manifest.json'),'utf8'));
  if(manifest.schemaVersion!==1||!Array.isArray(manifest.releases)||manifest.releases.length<1||manifest.releases.length>2)throw Error('Invalid progress compatibility release manifest');
  const files=new Map(),commits=new Set();
  for(const release of manifest.releases){
    if(!/^[a-f0-9]{40}$/.test(release.commit)||commits.has(release.commit)||!Array.isArray(release.files)||!release.files.length||release.files.length>16)throw Error('Invalid progress compatibility release');
    commits.add(release.commit);const releaseNames=new Set();
    for(const entry of release.files){
      if(!filename.test(entry.name)||releaseNames.has(entry.name)||!/^[a-f0-9]{64}$/.test(entry.sha256)||!Number.isSafeInteger(entry.bytes)||entry.bytes<1||entry.bytes>1024*1024)throw Error('Invalid progress compatibility file');
      releaseNames.add(entry.name);
      const bytes=await readFile(path.join(sourceDirectory,entry.name));
      if(bytes.length!==entry.bytes||digest(bytes)!==entry.sha256)throw Error('Progress compatibility content mismatch: '+entry.name);
      const previous=files.get(entry.name);
      if(previous&&!previous.bytes.equals(bytes))throw Error('Conflicting progress compatibility releases');
      files.set(entry.name,{name:entry.name,bytes,sha256:entry.sha256});
    }
    for(const name of releaseNames){
      if(!name.endsWith('.js'))continue;
      const text=files.get(name).bytes.toString('utf8');
      for(const specifier of imports(text)){
        if(!specifier.startsWith('./')||!filename.test(specifier.slice(2))||!releaseNames.has(specifier.slice(2)))throw Error('Unclosed progress compatibility import: '+name+' -> '+specifier);
      }
      const legal=text.match(/please see ([A-Za-z0-9.-]+\.LEGAL\.txt)/);
      if(legal&&!releaseNames.has(legal[1]))throw Error('Missing progress compatibility license: '+name);
    }
  }
  if(files.size>24||[...files.values()].reduce((sum,file)=>sum+file.bytes.length,0)>3*1024*1024)throw Error('Progress compatibility allowance exceeded');
  for(const name of await readdir(sourceDirectory))if(name!=='manifest.json'&&!files.has(name))throw Error('Unlisted progress compatibility file: '+name);
  return {manifest,files};
}

export async function restoreProgressCompatibility(outputDirectory,sourceDirectory) {
  const {files}=await readProgressCompatibility(sourceDirectory),pending=[];
  for(const file of files.values()){
    const output=path.join(outputDirectory,file.name);
    try{
      const existing=await readFile(output);
      if(!existing.equals(file.bytes))throw Error('Compatibility bundle conflicts with fresh build: '+file.name);
    }catch(error){if(error.code==='ENOENT')pending.push({file,output});else throw error;}
  }
  for(const {file,output} of pending)await copyFile(path.join(sourceDirectory,file.name),output,constants.COPYFILE_EXCL);
  return [...files.keys()];
}
