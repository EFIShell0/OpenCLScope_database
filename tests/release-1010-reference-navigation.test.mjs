import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {publishSnapshot} from '../tools/build_snapshot.mjs';
const read=name=>readFile(new URL('../'+name,import.meta.url),'utf8');

test('VulkanScope-style navigation cancels obsolete transitions, respects reduced motion and keeps exact OpenCL report routes',async()=>{
 const app=await read('assets/app.v3415.js');
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
  assert.equal(marker.databaseVersion,'3.4.15');
  assert.equal(marker.generatedAt,result.index.generatedAt);
  assert.equal(marker.appJs,'assets/app.v3415.js');
  assert.equal(marker.siteCss,'assets/site.v3415.css');
  assert.equal(result.index.reportCount,0);
  const worker=await read('worker/src/index.js');
  assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.4\.15'/);
  assert.match(worker,/3\.0\.10/);
 }finally{await rm(folder,{recursive:true,force:true})}
});

test('one bounded deployment verifier drives release notices without a duplicate frontend poll',async()=>{
 const app=await read('assets/app.v3415.js');
 const boot=await read('assets/release-bootstrap.v3415.js');
 assert.match(app,/openclscope:published-release-ready/);
 assert.match(app,/function showPublishedReleaseNotice\(remote\)/);
 assert.match(boot,/cache:'no-store'/);
 assert.match(boot,/releaseReady===true/);
 assert.match(boot,/announcedRemote!==pendingRemote/);
 assert.doesNotMatch(app,/checkPublishedRelease\(/);
 assert.doesNotMatch(app,/db-update-modal/);
});

test('new report toast and cache failures are honestly labeled, dismissible and do not create source data',async()=>{
 const app=await read('assets/app.v3415.js');
 assert.match(app,/new indexed report/);
 assert.match(app,/class:'db-new-report-notice'/);
 assert.match(app,/function showNewReportNotice\(count\)/);
 assert.match(app,/state\.rows\.length>was/);
 assert.match(app,/if\(!indexReady\|\|!snapshotReady\)banner/);
 assert.ok(!app.includes('fetch(`/v1/reports/${id}`,{method:\'POST\''));
});
