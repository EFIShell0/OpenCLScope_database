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
 assert.match(html,/vulkan-layout\.v1412\.css\?v=1008/);
 assert.match(html,/site\.v1028\.css\?v=1027/);
 assert.doesNotMatch(html,/<link[^>]*upstream-reference\.css/);
});
test('Windows checkout preserves the reference hash without making CI Linux-only',async()=>{
 const attributes=await read('.gitattributes');
 for(const extension of ['css','js','mjs','json','yml','py'])assert.ok(attributes.includes(`*.${extension} text eol=lf`),extension);
 assert.ok(attributes.includes('registry/cl.xml -text'));
 assert.ok(attributes.includes('registry/opencl.svg -text'));
 const css=await bytes('assets/vulkan-layout.v1412.css');
 assert.equal(css.includes(Buffer.from('\r\n')),false,'CRLF checkout would change official reference SHA-256');
 const crlf=Buffer.from(css.toString('utf8').replace(/\r?\n/g,'\r\n'),'utf8');
 assert.equal(createHash('sha256').update(crlf).digest('hex'),'b6e958cd79392be724347f56b944534914f08d3c30fb6092a76665a3b1d9bbc4');
});
test('Original page wordmark and exact application CL tab icon have separate assets',async()=>{
 const html=await read('index.html');
 assert.match(html,/<a[^>]*class="brand"[^>]*><img[^>]*src="assets\/openclscope_logo_horizontal\.png"/);
 assert.match(html,/<link href="assets\/opencl_tab_black_64\.png" rel="icon"/);
 assert.match(html,/class="database-loading-logo" src="assets\/openclscope_logo_horizontal\.png"/);
 const icon=await bytes('assets/opencl_tab_black_64.png');assert.ok(icon.length>800);
 assert.doesNotMatch(html,/<link href="assets\/openclscope_title_master_black\.png" rel="icon"/);
});
test('Every OpenCL primary workspace has the corresponding VulkanScope SVG path',async()=>{
 const js=await read('assets/app.v1028.js');
 for(const view of ['reports','platforms','devices','features','memory','formats','extensions','profiles','compare','encyclopedia','statistics'])assert.match(js,new RegExp(`${view}:'(?:reports|instance|devices|features|memory|formats|extensions|profiles|compare|encyclopedia|trends)'`));
 assert.match(js,/installSettingsCategoryIcons\(\)/);
 assert.match(js,/ensureWorkspaceHeadingIcon\(\)/);
 assert.match(js,/databaseSvgIcon\(/);
});
test('Report table, statistics and comparison preserve evidence and semantics',async()=>{
 const js=await read('assets/app.v1028.js');const css=await read('assets/site.v1028.css');
 for(const needle of ['function reportTableRow(',"node('table',{class:'reports-table opencl-reports-table '",'function renderStatistics()','function semanticComparisonLeaves(','Not reported'])assert.ok(js.includes(needle),needle);
 for(const needle of ['.reports-table-wrap','.opencl-reports-table','.stats-charts','.compare-evidence-table','.table-favorite','.table-report-id'])assert.ok(css.includes(needle),needle);
 assert.match(js,/navigator\.clipboard\.writeText\(id\)/);
});
test('New submissions require current exact OpenCL producer, database release identity 3.0.32',async()=>{
 const worker=await read('worker/src/index.js'),html=await read('index.html');
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.0\.32'/);
 assert.match(worker,/p\.application\.versionName!==acceptedVersion/);
 assert.match(worker,/p\.application\.versionCode!==acceptedCode/);
 assert.match(worker,/3\.0\.11/);
 assert.match(html,/OpenCLScope Database 3\.0\.32/);
});
