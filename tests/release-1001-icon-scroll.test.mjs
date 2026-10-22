import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const load=path=>readFile(new URL(path,root),'utf8');
const bytes=path=>readFile(new URL(path,root));
const app=await load('assets/app.v3409.js'),css=await load('assets/site.v3409.css'),html=await load('index.html');

test('Horizontal page logo restored and OpenCL tab favicon is on black',async()=>{
 const site=await bytes('assets/openclscope_logo_horizontal.png');assert.ok(site.length>1000);
 assert.match(html,/<a[^>]+class="brand"[^>]*><img[^>]*src="assets\/openclscope_logo_horizontal\.png"/);
 assert.match(html,/<link href="assets\/opencl_tab_black_64\.png" rel="icon"/);
 assert.match(html,/class="database-loading-logo" src="assets\/openclscope_logo_horizontal\.png"/);
 assert.doesNotMatch(html,/class="brand"[^>]*><img src="assets\/openclscope_title_master_black\.png"/);
});
test('Generated icons use SVG XML namespace rather than invisible HTML unknown elements',()=>{
 assert.match(app,/document\.createElementNS\('http:\/\/www\.w3\.org\/2000\/svg',tag\)/);
 assert.match(app,/if\(isSvg\)e\.setAttribute\('class',v\)/);
 assert.match(app,/svg\.append\(node\('path'/);
 assert.match(app,/installIcons\(\)/);
 const broken=app.replace("document.createElementNS('http://www.w3.org/2000/svg',tag)","document.createElement(tag)");
 assert.doesNotMatch(broken,/document\.createElementNS\('http:\/\/www\.w3\.org\/2000\/svg',tag\)/);
});

test('Native VulkanScope table controls are ported with pointer dragging and keyboard arrows',()=>{
 for(const f of ['function updateTableScroller(','function enhanceTableScroller(','function enhanceTableScrollers(','className=\'table-scroll-shell\'','class="table-scroll-controls"','aria-orientation="horizontal"','t.setPointerCapture?.(e.pointerId)','e.key===\'ArrowLeft\'','e.key===\'Home\'','e.key===\'End\''])assert.ok(app.includes(f),f);
 assert.match(app,/class:'table-wrap reports-table-wrap'/);
 assert.match(app,/class:'table-wrap evidence-table-wrap'/);
 for(const rule of ['.table-scroll-shell.scrollable .table-scroll-controls','.table-scroll-shell .table-scroll-track','.table-scroll-shell .table-scroll-thumb','.table-scroll-shell .table-edge-left','.table-scroll-shell .table-edge-right'])assert.ok(css.includes(rule),rule);
});

test('Viewport scrollbar tracks thumb drag, keyboard and true source status',()=>{
 for(const fragment of ["thumb.setAttribute('role','scrollbar')","thumb.setPointerCapture?.(e.pointerId)","thumb.addEventListener('pointermove'","thumb.addEventListener('keydown'","thumb.setAttribute('aria-valuenow'","rail.classList.toggle('at-top'", "rail.classList.toggle('at-bottom'"])assert.ok(app.includes(fragment),fragment);
});

test('Complete OpenCL report evidence remains gated at application 3.0.9',async()=>{
 const worker=await load('worker/src/index.js');
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.4\.9'/);
 assert.match(worker,/p\.application\.versionName!==acceptedVersion/);
 assert.match(worker,/p\.application\.versionCode!==acceptedCode/);
 assert.match(html,/assets\/app\.v3409\.js\?v=3409/);
});
