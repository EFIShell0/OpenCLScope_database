import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const read=async path=>readFile(new URL(path,root),'utf8');
const bytes=async path=>readFile(new URL(path,root));
test('VulkanScope Database 1.4.12 exact geometry source pinned, loaded only once',async()=>{
 const css=await bytes('assets/vulkan-layout.v1412.css');
 assert.equal(createHash('sha256').update(css).digest('hex'),'bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b');
 const html=await read('index.html');
 assert.match(html,/vulkan-layout\.v1412\.css\?v=1001/);
 assert.match(html,/site\.v1001\.css\?v=1001/);
 assert.doesNotMatch(html,/<link[^>]*upstream-reference\.css/);
});
test('Official Android 1.0.19 black app logo is the browser title artwork',async()=>{
 const html=await read('index.html');
 assert.match(html,/openclscope_title_master_black\.png"[^>]*rel="icon"/);
 assert.match(html,/openclscope_title_master_black\.png/);
 const icon=await bytes('assets/openclscope_title_master_black.png');
 assert.ok(icon.length>1000);
 assert.ok(icon.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
});
test('Every OpenCL primary workspace has the corresponding VulkanScope SVG path',async()=>{
 const js=await read('assets/app.v1001.js');
 for(const view of ['reports','platforms','devices','features','memory','formats','extensions','profiles','compare','encyclopedia','statistics'])assert.match(js,new RegExp(`${view}:'(?:reports|instance|devices|features|memory|formats|extensions|profiles|compare|encyclopedia|trends)'`));
 assert.match(js,/installSettingsCategoryIcons\(\)/);
 assert.match(js,/ensureWorkspaceHeadingIcon\(\)/);
 assert.match(js,/databaseSvgIcon\(/);
});
test('Report table, statistics and comparison preserve evidence and semantics',async()=>{
 const js=await read('assets/app.v1001.js');const css=await read('assets/site.v1001.css');
 for(const needle of ['function reportTableRow(',"node('table',{class:'reports-table opencl-reports-table'}",'function renderStatistics()','function semanticComparisonLeaves(','UNKNOWN / not reported'])assert.ok(js.includes(needle),needle);
 for(const needle of ['.reports-table-wrap','.opencl-reports-table','.stats-charts','.compare-row','.table-favorite','.table-report-id'])assert.ok(css.includes(needle),needle);
 assert.match(js,/navigator\.clipboard\.writeText\(id\)/);
});
test('New submissions strictly require OpenCLScope 1.0.19, database release identity 1.0.1',async()=>{
 const worker=await read('worker/src/index.js'),html=await read('index.html');
 assert.match(worker,/DATABASE_RELEASE_VERSION = '1\.0\.1'/);
 assert.match(worker,/p\.application\.versionName!=='1\.0\.19'/);
 assert.match(worker,/p\.application\.versionCode!==10019/);
 assert.match(html,/OpenCLScope Database 1\.0\.1/);
});
