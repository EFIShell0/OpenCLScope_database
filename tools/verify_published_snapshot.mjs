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
    if(index.schemaVersion!==1||index.databaseReleaseVersion!=='0.12.0'||!Array.isArray(index.reports)||index.reports.length!==index.reportCount)throw Error('Published index schema, count or release mismatch');
    if(required&&!index.reports.some(r=>r.id===required))throw Error('Triggered report not yet visible in published Pages index');
    const snapshotResponse=await fetch(new URL('data/snapshot.json',base),{headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!snapshotResponse.ok)throw Error(`Pages preload HTTP ${snapshotResponse.status}`);
    const snapshot=await snapshotResponse.json();
    if(snapshot.databaseReleaseVersion!==index.databaseReleaseVersion||snapshot.generatedAt!==index.generatedAt||snapshot.reportCount!==index.reportCount||snapshot.preloadedReportCount!==snapshot.reports.length)throw Error('Pages preload does not match published index');
    if(required&&!snapshot.reports.some(r=>r.id===required))throw Error('Triggered report not in published preload');
    process.stdout.write(`PASS: published Pages snapshot indexed ${index.reportCount} reports; triggering report ${required||'(none)'} verified\n`);
    process.exit(0);
  }catch(err){last=String(err);if(i<11)await sleep(3000)}
}
throw Error(`Published Pages snapshot verification failed: ${last}`);
