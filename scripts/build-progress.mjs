import {build} from 'esbuild';
import {copyFile,readdir,unlink} from 'node:fs/promises';
import {restoreProgressCompatibility} from './progress-compat.mjs';
// A small self-hosted interface layer, independent of the lazy 3D module graph.
await build({entryPoints:['src/ui-motion.js'],outfile:'dist/ui-motion.js',bundle:true,format:'iife',minify:true,target:['safari16','chrome110','firefox110'],legalComments:'none'});
// Avoid publishing stale chunks after a local rebuild.
for (const name of await readdir('dist/assets/progress')) {
  if (name.endsWith('.js') || name.endsWith('.js.LEGAL.txt')) await unlink('dist/assets/progress/'+name);
}
await build({entryPoints:['src/progress/progress.js','src/progress/home-world.js','src/progress/programmes.js'],outdir:'dist/assets/progress',bundle:true,splitting:true,format:'esm',minify:true,target:['safari16','chrome110','firefox110'],entryNames:'[name]',chunkNames:'[name]-[hash]',legalComments:'linked',metafile:false});
await copyFile('node_modules/three/LICENSE','dist/assets/progress/THREE-LICENSE.txt');

await copyFile('node_modules/suncalc/LICENSE','dist/assets/progress/SUNCALC-LICENSE.txt');
// Cached HTML or module entries may still refer to either previous release's
// hashed lazy chunks. Restore only byte-verified, closed compatibility graphs.
await restoreProgressCompatibility('dist/assets/progress','compat/progress');

// A separate lazy bundle keeps the 3D school atlas off the landing-page critical path.
await build({entryPoints:['src/atlas/world.js'],outfile:'dist/assets/plant-portal/estate-world.js',
  bundle:true,format:'esm',minify:true,target:['safari16','chrome110','firefox110'],legalComments:'linked'});
await copyFile('node_modules/three/LICENSE','dist/assets/plant-portal/THREE-LICENSE.txt');
