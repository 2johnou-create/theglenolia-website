// Run after build-admin.mjs and private resource preparation, before deploying education.
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdir,writeFile,cp} from 'node:fs/promises';
import {educationJs,educationCss} from './admin-assets.mjs';

const directory=new URL('./education-assets/',import.meta.url);
const revision=createHash('sha256').update(educationJs+educationCss).digest('hex').slice(0,12);
const html=execFileSync(process.env.PYTHON||'python3',['-c',[
  "import sys;sys.path.insert(0,'scripts')",
  "from teachers_markup import portal_html",
  "print(portal_html(illustration_base='/assets/education').replace('https://theglenolia.com.au/assets/logos/','/assets/logos/'))"
].join('\n')],{cwd:new URL('../',import.meta.url),encoding:'utf8'})
  .replace('teacher-ui.js"','teacher-ui.js?v='+revision+'"').replace('teacher-ui.css"','teacher-ui.css?v='+revision+'"');
await mkdir(new URL('teachers/',directory),{recursive:true});
await Promise.all([
  cp(new URL('../public/assets/education/plant-library/',import.meta.url),new URL('assets/education/plant-library/',directory),{recursive:true}),
  writeFile(new URL('teachers/teacher-ui.js',directory),educationJs),
  writeFile(new URL('teachers/teacher-ui.css',directory),educationCss),
  writeFile(new URL('index.html',directory),html)
]);
console.log('Prepared the private teacher entry and styles, revision '+revision+'.');
