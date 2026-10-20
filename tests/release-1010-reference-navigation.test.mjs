import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publishSnapshot} from '../tools/build_snapshot.mjs';
const read=name=>readFile(new URL('../'+name,import.meta.url),'utf8');

test('VulkanScope-style navigation cancels obsolete transitions, respects reduced motion and keeps exact OpenCL report routes',async()=>{
 const app=await read('assets/app.v1019.js');
 for(const x of ['navigationTransitionToken','workspacePositions','function navigateWorkspace(view,writeRoute=true)','if(token!==navigationTransitionToken)return','function reducedAnimation()','prefers-reduced-motion','function syncWorkspaceTitle()','function restoreCompareRoute()','function openHash()'])assert.ok(app.includes(x),x);
 assert.match(app,/navigateWorkspace\(b\.dataset\.view\)/);
 assert.match(app,/navigateWorkspace\(location\.hash\.slice\(1\),false\)/);
 assert.match(app,/animation\.finished\.then\(commit\)/);
 assert.ok(!app.includes('Vulkan physical device'), 'No invented Vulkan capability');
});

test('release marker is generated together with coherent verified snapshot and never changes producer gate',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'opencl316-snapshot-'));
 try{
  const f=async url=>({ok:true,arrayBuffer:async()=>new TextEncoder().encode(JSON.stringify({reports:[],nextCursor:null})).buffer});
  const result=await publishSnapshot('https://example.invalid',folder,f);
  const marker=JSON.parse(await readFile(join(folder,'data/release.json'),'utf8'));
  assert.equal(marker.databaseVersion,'3.0.25');
  assert.equal(marker.generatedAt,result.index.generatedAt);
  assert.equal(marker.appJs,'assets/app.v1019.js');
  assert.equal(marker.siteCss,'assets/site.v1015.css');
  assert.equal(result.index.reportCount,0);
  const worker=await read('worker/src/index.js');
  assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.0\.25'/);
  assert.match(worker,/3\.0\.8/);
 }finally{await rm(folder,{recursive:true,force:true})}
});

test('update marker is same-origin, bounded, version-gated and checks both published asset types before prompting',async()=>{
 const app=await read('assets/app.v1019.js');
 for(const x of ["'3.0.25'",'release.json?_=',"cache:'no-store'",'raw.length>4096','^assets/${kind}','compareVersions(remote,DATABASE_RELEASE_VERSION)<=0','js.headers.get(\'content-type\')','css.headers.get(\'content-type\')','showPublishedReleasePrompt(remote)','document.hidden'])assert.ok(app.includes(x),x);
 assert.match(app,/location\.replace\(url\.toString\(\)\)/);
 const body=app.split('function publishedAssetName(name,kind){')[1].split('\nasync function checkPublishedRelease')[0].trim().replace(/}\s*$/,'');
 assert.ok(body);
 const valid=new Function('name','kind',body);
 assert.equal(valid('assets/app.v1019.js','app'),true);
 assert.equal(valid('assets/site.v1015.css','site'),true);
 for(const invalid of ['https://other.test/app.v1.js','../../app.v1.js','assets/app.v1011.css','assets/app.v1.js?redirect=1','assets/app.v1.js/extra'])assert.equal(valid(invalid,'app'),false,invalid);
});

test('new report toast and cache failures are honestly labeled, dismissible and do not create source data',async()=>{
 const app=await read('assets/app.v1019.js');
 assert.match(app,/new indexed report/);
 assert.match(app,/class:'db-new-report-notice'/);
 assert.match(app,/function showNewReportNotice\(count\)/);
 assert.match(app,/state\.rows\.length>was/);
 assert.match(app,/if\(!indexReady\|\|!snapshotReady\)banner/);
 assert.ok(!app.includes('fetch(`/v1/reports/${id}`,{method:\'POST\''));
});
