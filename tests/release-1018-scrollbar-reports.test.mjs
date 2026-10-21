import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=load('index.html'), js=load('assets/app.v1028.js'), css=load('assets/parity.v1028.css'), rules=load('rules/PROJECT_RULES.md'), ref=load('assets/vulkan-layout.v1412.css');
test('pinned Vulkan source is preserved, final OpenCL style is versioned',()=>{
 assert.ok(html.indexOf('vulkan-layout.v1412.css')<html.indexOf('site.v1028.css'));
 assert.ok(html.indexOf('site.v1028.css')<html.indexOf('parity.v1028.css'));
 assert.match(rules,/Database 3\.0\.28/);
 assert.match(ref,/\.table-scroll-thumb\{position:absolute/);
});
test('reference navigation buttons and directional scrolling controls share the same DOM structure',()=>{
 assert.equal((html.match(/class="nav-button(?: active)?" data-view="/g)||[]).length,11);
 assert.match(html,/nav-scroll-button nav-scroll-left/);
 assert.match(html,/nav-scroll-button nav-scroll-right/);
 assert.match(css,/\.main-nav \.nav-button/);
});
test('all custom scrollbar targets cover neutral resting and green hover without corrupting error semantics',()=>{
 for(const name of ['.table-scroll-thumb','.table-scroll-track','.table-scroll-button','.viewport-scrollbar-thumb','#viewportScrollbarThumb'])assert.ok(css.includes(name),name);
 assert.match(css,/\.viewport-scrollbar \.viewport-scrollbar-thumb,#viewportScrollbarThumb\{background:linear-gradient\(180deg,#575962,#767984\)!important/);
 assert.match(css,/\.table-scroll-thumb,\.table-scroll-shell \.table-scroll-thumb\{[^}]*#565961/);
 assert.match(css,/:root\{[^}]*--red:#ff8f98/);
 assert.match(css,/--accent2:#85d18b/);
});
test('Reports table faithfully exposes reversible reference-style disclosure headers without false query states',()=>{
 for(const k of ['function reportDisclosureHeader(','function toggleReportDisclosure(','function reportSubmittedParts(','aria-expanded','submitted-expanded','vendor-expanded','type-expanded','report-id-copy'])assert.ok(js.includes(k),k);
 assert.match(js,/return \[\['Date',date\.toISOString\(\)\.slice/);
 assert.match(js,/\.addEventListener\('click',event=>\{if\(!event\.target\.closest\('button,a,input,select,\[role="button"\]'\)\)openReport\(id\)\}\)/);
 assert.match(js,/\['newest','Submission date — newest first'\]/);
 assert.match(js,/\[25,50,100\]/);
});
test('Worker contract and canonical browser sync are unchanged by presentation-only work',()=>{
 assert.match(js,/api\('\/v1\/sync'\)/);
 assert.match(js,/setInterval\(\(\)=>update\(\),10000\)/);
 assert.match(js,/function semanticComparisonLeaves\(report\)/);
 const worker=load('worker/src/index.js');assert.match(worker,/export const DATABASE_RELEASE_VERSION = '3\.0\.28'/);
 assert.match(worker,/legacy307 \? '3\.0\.7' : '3\.0\.8'/);
});
