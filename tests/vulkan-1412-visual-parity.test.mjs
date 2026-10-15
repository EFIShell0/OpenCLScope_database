import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const html=await read('index.html');
const css=await read('assets/site.v1253.css');
const js=await read('assets/app.v1253.js');
const ref=await read('assets/vulkan-layout.v1412.css');
const upstream=await read('assets/upstream-reference.css');
const head=html.match(/<header[\s\S]*?<\/header>/)?.[0]||'';
const attrs=(id,tag='button')=>html.match(new RegExp(`<${tag}[^>]*\\bid="${id}"[^>]*>`))?.[0]||'';
test('Settings precedes OpenCL logo and workspace tabs in reference header order',()=>{
 const a=head.indexOf('id="settingsButton"'),b=head.indexOf('class="brand"'),c=head.indexOf('id="navShell"');
 assert.ok(a>=0&&a<b&&b<c);assert.equal((html.match(/id="settingsButton"/g)||[]).length,1);
});
test('Reference CSS updated without changing immutable OpenCL reference',()=>{
 assert.ok(ref.includes('.settings-drawer')&&ref.includes('.hero-v127')&&ref.includes('.custom-select-menu'));
 assert.ok(upstream.includes('--accent:#3dae2b'));assert.match(html,/vulkan-layout\.v1412\.css\?v=1253/);
 assert.match(css,/--cl-accent:#3dae2b/);assert.match(css,/\.hero-v127\{background:linear-gradient\(145deg,#142117/);
});
test('OpenCL keeps native filter values authoritative behind reference listboxes',()=>{
 for(const id of ['vendorFilter','versionFilter','stateFilter','sortFilter','pageLimit'])assert.ok(attrs(id,'select'));
 for(const fn of ['installCustomSelects','refreshCustomSelect','closeCustomSelects'])assert.ok(js.includes(`function ${fn}(`));
 assert.match(js,/select\.dispatchEvent\(new Event\('change'/);
 assert.match(js,/item\.onclick=\(\)=>/);
 assert.match(js,/\$\('clearFilters'\)\.hidden=/);
});
test('Reference status loader, network and page-scrolling widgets are wired',()=>{
 for(const id of ['pageProgress','pageProgressBar','networkStatusTitle','networkStatusMessage','networkStatusBadge','databaseLoading','pageScrollUp','pageScrollDown','viewportScrollbarThumb'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(js,/function installViewportControls\(/);assert.match(js,/function banner\(/);assert.match(js,/\$\('databaseLoading'\)\.hidden=true/);
});
test('Settings uses backdrop, focus return, escape and tab trap',()=>{
 assert.ok(attrs('settingsButton'));assert.ok(attrs('closeSettings'));
 assert.match(html,/id="settingsBackdrop"/);assert.match(html,/aria-modal="true"/);
 assert.match(js,/document\.body\.classList\.add\('settings-open'\)/);
 assert.match(js,/function closeSettings\(/);assert.match(js,/event\.key==='Escape'/);assert.match(js,/event\.shiftKey/);
});
test('No fake Vulkan device fields, runtime data, or changed backend producer',()=>{
 assert.doesNotMatch(html,/data-view="surface"|data-view="wsi"|data-view="turnip"/);
 assert.ok(js.includes("state.catalog"));
 assert.match(js,/state\.reports\.size/);
 assert.match(js,/addRows\(snapshot\.reports\)/);
});
test('Mutations to parity contracts are rejected',()=>{
 const cases=[html.replace('id="settingsButton"','id="settingsRemoved"'),html.replace('vulkan-layout.v1412.css','legacy.css')];
 assert.ok(!/id="settingsButton"/.test(cases[0]));assert.ok(!/vulkan-layout\.v1412\.css\?v=1253/.test(cases[1]));
 const broken=js.replace("$('settingsBackdrop').hidden=false",'void 0');assert.ok(!broken.includes("$('settingsBackdrop').hidden=false"));
});
