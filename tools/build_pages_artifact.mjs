import {cp,copyFile,mkdir,rm,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {DATABASE_RELEASE_VERSION} from '../worker/src/index.js';
const root=resolve('.');
const destination=join(root,'_site');
const index=JSON.parse(await readFile(join(root,'data/index.json'),'utf8'));
const snapshot=JSON.parse(await readFile(join(root,'data/snapshot.json'),'utf8'));
if(index.schemaVersion!==1||snapshot.schemaVersion!==1||index.databaseReleaseVersion!==DATABASE_RELEASE_VERSION||snapshot.databaseReleaseVersion!==DATABASE_RELEASE_VERSION||index.generatedAt!==snapshot.generatedAt||index.reportCount!==snapshot.reportCount||index.reportCount!==index.reports.length||snapshot.preloadedReportCount!==snapshot.reports.length||!Array.isArray(index.reports)||!Array.isArray(snapshot.reports))throw Error('Invalid static snapshot, Pages publication aborted');

const release=JSON.parse(await readFile(join(root,'data/release.json'),'utf8'));
const html=await readFile(join(root,'index.html'),'utf8');
if(release.databaseVersion!==DATABASE_RELEASE_VERSION||release.generatedAt!==index.generatedAt||!/^assets\/app\.v[0-9]+\.js$/.test(release.appJs)||!/^assets\/site\.v[0-9]+\.css$/.test(release.siteCss)||!html.includes(release.appJs+'?')||!html.includes(release.siteCss+'?'))throw Error('Release marker and published frontend references are inconsistent');
await Promise.all([release.appJs,release.siteCss].map(path=>readFile(join(root,path))));

// An excluded archive detail remains a public INDEX row, never a verified
// preload. Validate the exclusion list so a broken snapshot cannot hide data.
const excluded=snapshot.skippedInvalidContractIds;
const listed=new Set(index.reports.map(r=>r.id));
const verified=new Set(snapshot.reports.map(r=>r.id));
if(!Array.isArray(excluded)||excluded.length>60||new Set(excluded).size!==excluded.length||excluded.some(id=>!(/^[a-f0-9]{64}$/.test(id))||!listed.has(id)||verified.has(id)))throw Error('Invalid snapshot archival exclusion evidence');
await rm(destination,{recursive:true,force:true});
await mkdir(destination,{recursive:true});
for(const file of ['index.html','config.js'])await copyFile(join(root,file),join(destination,file));
for(const folder of ['assets','data','registry','licenses'])await cp(join(root,folder),join(destination,folder),{recursive:true});
process.stdout.write('Prepared allowlisted-only Pages artifact: index.html, config.js, assets/, data/, registry/, licenses/\n');
