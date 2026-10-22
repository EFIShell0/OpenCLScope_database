import {readFile,readdir} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {DATABASE_RELEASE_VERSION} from '../worker/src/index.js';
const site=resolve(process.argv[2]||'_site');
const allowed=new Set(['assets','data','registry','licenses','index.html','config.js']);
const files=[];
async function walk(path){
 for(const entry of await readdir(path,{withFileTypes:true})){
  const full=resolve(path,entry.name);
  if(entry.isSymbolicLink())throw Error(`Symlink in Pages artifact: ${full}`);
  if(entry.isDirectory())await walk(full);
  else if(entry.isFile())files.push(relative(site,full).replaceAll('\\','/'));
  else throw Error(`Invalid Pages entry: ${full}`);
 }
}
await walk(site);
for(const path of files){
 const parts=path.split('/');
 if(!allowed.has(parts[0])||parts.some(p=>p==='..'||p==='.'||p.startsWith('.')))throw Error(`Nonpublic file in Pages: ${path}`);
}
for(const essential of ['index.html','config.js','data/index.json','data/snapshot.json','data/release.json']){
 if(!files.includes(essential))throw Error(`Missing published file: ${essential}`);
}
const index=JSON.parse(await readFile(resolve(site,'data/index.json'),'utf8'));
const preload=JSON.parse(await readFile(resolve(site,'data/snapshot.json'),'utf8'));
const marker=JSON.parse(await readFile(resolve(site,'data/release.json'),'utf8'));
if(marker.schemaVersion!==2||typeof marker.releaseReady!=='boolean'||marker.cacheKey!=='3402'||index.databaseReleaseVersion!==DATABASE_RELEASE_VERSION||preload.databaseReleaseVersion!==DATABASE_RELEASE_VERSION||marker.databaseVersion!==DATABASE_RELEASE_VERSION||index.generatedAt!==preload.generatedAt||marker.generatedAt!==index.generatedAt)throw Error('Published index/release identity mismatch');
if(!Array.isArray(index.reports)||index.reportCount!==index.reports.length||preload.reportCount!==index.reportCount||!Array.isArray(preload.reports)||preload.preloadedReportCount!==preload.reports.length)throw Error('Published index/preload incomplete');
const html=await readFile(resolve(site,'index.html'),'utf8');
if(!html.includes(marker.appJs+'?')||!html.includes(marker.siteCss+'?')||!files.includes(marker.appJs)||!files.includes(marker.siteCss)||!html.includes(marker.parityCss+'?')||!html.includes(marker.bootstrapJs+'?')||!files.includes(marker.parityCss)||!files.includes(marker.bootstrapJs))throw Error('Published frontend/release marker mismatch');
console.log(`PASS: audited ${files.length} public Pages files, Database ${DATABASE_RELEASE_VERSION}`);
