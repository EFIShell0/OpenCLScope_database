import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const read=(p)=>readFile(new URL(p,root),'utf8');
const [app,html,css,worker,registry]=await Promise.all(['assets/app.v1019.js','index.html','assets/site.v1015.css','worker/src/index.js','assets/encyclopedia.json'].map(read));
const data=JSON.parse(registry);
test('Complete bundled OpenCL encyclopedia, not runtime support claims',()=>{
 assert.equal(data.entries.length,2002);
 assert.ok(data.entries.some(e=>e.category==='Command'&&e.name==='clGetDeviceInfo'));
 assert.ok(data.entries.some(e=>e.category==='Extension'&&e.name==='cl_khr_fp16'));
 for(const k of ['Command','Type','Extension','Token'])assert.ok(data.entries.some(e=>e.category===k));
 assert.match(app,/fetch\('\.\/assets\/encyclopedia\.json'/);
 assert.match(app,/Registry relationships and symbol registration are reference metadata/);
 assert.match(app,/state\.encyclopediaCategory/);
 assert.match(app,/node\('details'/);
 assert.match(app,/slice\(state\.page\*state\.pageSize/);
});
test('Compare classification never equates missing evidence with unsupported',()=>{
 const m=app.match(/function compareCategory\(key\)\{[^\n]*\}/);
 assert.ok(m);
 const classify=runInNewContext(m[0]+';compareCategory',{ });
 assert.equal(classify('Platform: P / Extension / cl_khr_fp16'),'Extensions');
 assert.equal(classify('Platform: P / Device: GPU / Property / CL_DEVICE_MAX_COMPUTE_UNITS'),'Devices');
 assert.equal(classify('Platform: P / Device: GPU / Image formats: IMAGE2D / State'),'Image formats');
 for(const state of ['Added','Removed','Changed','Unchanged'])assert.match(app,new RegExp(state));
 assert.match(app,/x\.has\(k\)/);assert.match(app,/y\.has\(k\)/);
 assert.match(app,/r\.hasA\?text\(r\.baseline\):'Not reported'/);
 assert.match(app,/state\.compareA===state\.compareB/);
});
test('Detail evidence provides category-scoped search, status states and bounded paging',()=>{
 for(const token of ['function detailEvidenceRows(',"['Properties','Features','Memory','Formats']",'state.detailPageSize','state.detailQuery','state.detailStatus','detailEvidenceToolbar','detail-evidence-pager'])assert.ok(app.includes(token),token);
 for(const status of ['available','not_applicable','unavailable','error','unknown'])assert.ok(app.includes("node('option',{value:k}"));
 assert.match(app,/state\.detailPage=Math\.min/);
 assert.match(app,/node\('pre',\{class:'raw-text'\},JSON\.stringify\(r,null,2\)\)/);
 assert.match(css,/\.detail-evidence-toolbar/);
});
test('Release 3.0.25 remains a UI-only producer lock',()=>{
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.0\.25'/);
 assert.match(worker,/legacy307 \? '3\.0\.7' : '3\.0\.8'/);
 assert.match(html,/app\.v1019\.js\?v=1019/);
 assert.match(html,/site\.v1015\.css\?v=1015/);
 assert.match(html,/browser-compat\.v1006\.js\?v=1008/);
 assert.match(app,/Full report details loaded/);
});
