import {DATABASE_RELEASE_VERSION} from '../worker/src/index.js';
import {setTimeout as sleep} from 'node:timers/promises';
const site=String(process.env.PUBLISHED_PAGES_URL||'').trim();
const api=String(process.env.OPENCLSCOPE_DATABASE_API||'').trim();
const required=String(process.env.REQUIRED_REPORT_ID||'').trim();
if(!/^https:\/\/[^\s/]+\//.test(site)||!/^https:\/\/[^\s/]+$/.test(api))throw Error('Production HTTPS URLs must be configured');
if(required&&!/^[a-f0-9]{64}$/.test(required))throw Error('Invalid required report ID');
const base=site.endsWith('/')?site:site+'/';
let last='';
for(let i=0;i<12;i++){
  try{
    const target=new URL('data/index.json',base);
    const response=await fetch(target,{headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw Error(`Pages index HTTP ${response.status}`);
    const index=await response.json();
    if(index.schemaVersion!==1||index.databaseReleaseVersion!==DATABASE_RELEASE_VERSION||!Array.isArray(index.reports)||index.reports.length!==index.reportCount)throw Error('Published index schema, count or release mismatch');
    if(required&&!index.reports.some(r=>r.id===required))throw Error('Triggered report not yet visible in published Pages index');
    const markerResponse=await fetch(new URL('data/release.json',base),{headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!markerResponse.ok)throw Error('Pages release marker unavailable');
    const marker=await markerResponse.json();
    if(marker.schemaVersion!==2||marker.releaseReady!==true||marker.databaseVersion!==DATABASE_RELEASE_VERSION||marker.cacheKey!=='3408'||marker.generatedAt!==index.generatedAt||marker.appJs!=='assets/app.v3408.js'||marker.bootstrapJs!=='assets/release-bootstrap.v3408.js'||marker.shellCss!=='assets/reference-shell.v3408.css')throw Error('Pages release readiness/identity mismatch');
    const stamp=encodeURIComponent(DATABASE_RELEASE_VERSION);
    const htmlResponse=await fetch(new URL(`index.html?_release_probe=${stamp}`,base),{cache:'no-store',headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!htmlResponse.ok)throw Error('Published Pages HTML unavailable');
    const html=await htmlResponse.text();
    if(!html.includes(`${marker.appJs}?v=${marker.cacheKey}`)||!html.includes(`${marker.siteCss}?v=${marker.cacheKey}`)||!html.includes(`${marker.parityCss}?v=${marker.cacheKey}`)||!html.includes(`${marker.shellCss}?v=${marker.cacheKey}`)||!html.includes(`${marker.reportDetailCss}?v=${marker.cacheKey}`)||!html.includes(`${marker.bootstrapJs}?v=${marker.cacheKey}`))throw Error('Pages HTML still points at an older release');
    for(const [filename,contract] of [[marker.appJs,`const DATABASE_RELEASE_VERSION = '${DATABASE_RELEASE_VERSION}'`],[marker.bootstrapJs,`const LOCAL='${DATABASE_RELEASE_VERSION}'`],[marker.siteCss,null],[marker.reportDetailCss,null],[marker.parityCss,null],[marker.shellCss,null]]){
      const response=await fetch(new URL(`${filename}?_release_probe=${stamp}`,base),{cache:'no-store',headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(12000)});
      const body=await response.text();
      if(!response.ok||(contract?!body.includes(contract):body.length<500))throw Error(`Published release asset is missing or stale: ${filename}`);
    }
    const snapshotResponse=await fetch(new URL('data/snapshot.json',base),{headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!snapshotResponse.ok)throw Error(`Pages preload HTTP ${snapshotResponse.status}`);
    const snapshot=await snapshotResponse.json();
    if(snapshot.databaseReleaseVersion!==index.databaseReleaseVersion||snapshot.generatedAt!==index.generatedAt||snapshot.reportCount!==index.reportCount||snapshot.preloadedReportCount!==snapshot.reports.length)throw Error('Pages preload does not match published index');
    const excluded=snapshot.skippedInvalidContractIds;
    if(!Array.isArray(excluded)||excluded.length>60||new Set(excluded).size!==excluded.length||excluded.some(id=>!(/^[a-f0-9]{64}$/.test(id))||!index.reports.some(r=>r.id===id)||snapshot.reports.some(r=>r.id===id)))throw Error('Published archive exclusion evidence is invalid');
    if(required&&!snapshot.reports.some(r=>r.id===required))throw Error('Triggered report not in published preload');
    process.stdout.write(`PASS: published Pages snapshot indexed ${index.reportCount} reports; triggering report ${required||'(none)'} verified\n`);
    process.exit(0);
  }catch(err){last=String(err);if(i<11)await sleep(3000)}
}
throw Error(`Published Pages snapshot verification failed: ${last}`);
