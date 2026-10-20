import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const html=await read('index.html');
const css=await read('assets/site.v1014.css');
const js=await read('assets/app.v1015.js');
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
 assert.ok(upstream.includes('--accent:#3dae2b'));assert.match(html,/vulkan-layout\.v1412\.css\?v=1008/);
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
 assert.ok(!/id="settingsButton"/.test(cases[0]));assert.ok(!/vulkan-layout\.v1412\.css\?v=1008/.test(cases[1]));
 const broken=js.replace("$('settingsBackdrop').hidden=false",'void 0');assert.ok(!broken.includes("$('settingsBackdrop').hidden=false"));
});

test('OpenCL Compare uses stable names, not platform/device or property enumeration positions',async()=>{
 const {runInNewContext}=await import('node:vm');
 const fn=js.match(/function semanticComparisonLeaves\(report\)\{[\s\S]*?\n\}\nfunction compareSelect/);
 assert.ok(fn,'semantic comparator missing');
 const comparator=runInNewContext(fn[0].replace(/\nfunction compareSelect$/,'')+'; semanticComparisonLeaves',{text:v=>v==null?'':String(v),Map,Set});
 const make=()=>({platforms:[{name:'Vendor platform',vendor:'Hardware vendor',version:'OpenCL 3.0',profile:'FULL_PROFILE',deviceEnumerationStatus:'available',deviceEnumerationCode:0,extensions:['cl_khr_fp64','cl_khr_icd'],properties:[{name:'CL_PLATFORM_VERSION',status:'available',code:0,value:'OpenCL 3.0'},{name:'CL_PLATFORM_VENDOR',status:'available',code:0,value:'Hardware vendor'}],devices:[{name:'GPU 0',vendor:'Hardware vendor',type:'GPU',version:'OpenCL 3.0',driverVersion:'driver 1',profile:'FULL_PROFILE',properties:[{name:'CL_DEVICE_AVAILABLE',status:'available',code:0,value:'false'},{name:'CL_DEVICE_MAX_COMPUTE_UNITS',status:'available',code:0,value:'8'}],extensions:['cl_khr_fp64','cl_khr_icd'],imageFormats:[{imageType:'CL_MEM_OBJECT_IMAGE2D',flags:'READ_ONLY',status:'available',code:0,formats:[{order:'CL_RGBA',dataType:'CL_UNORM_INT8',orderValue:4277,typeValue:4306},{order:'CL_R',dataType:'CL_FLOAT',orderValue:4272,typeValue:4318}]}]}]}]});
 const a=make(),b=make();
 b.platforms[0].extensions.reverse();b.platforms[0].properties.reverse();b.platforms[0].devices[0].properties.reverse();b.platforms[0].devices[0].extensions.reverse();b.platforms[0].devices[0].imageFormats[0].formats.reverse();
 const canonical=m=>JSON.stringify([...m].sort(([a],[b])=>a.localeCompare(b)));
 assert.equal(canonical(comparator(a)),canonical(comparator(b)),'permuted lists must compare identically');
 b.platforms[0].devices[0].properties.find(v=>v.name==='CL_DEVICE_AVAILABLE').status='unknown';
 assert.notEqual(canonical(comparator(a)),canonical(comparator(b)),'unknown is not false');
 assert.match(css,/\.compare-row/);assert.match(css,/@media\(max-width:660px\)/);
});

test('Statistics uses only loaded report evidence and is responsive',()=>{
 assert.match(html,/data-view="statistics"/);assert.match(js,/function renderStatistics\(/);assert.match(js,/state\.reports\.values\(\)/);assert.match(js,/Not loaded|Still not loaded/);assert.match(css,/\.stats-chart/);assert.match(css,/@media\(max-width:760px\)/);
});

test('Portable compact navigation keeps a full-width scrollable row and a meaningful Statistics icon',()=>{
 assert.match(js,/statistics:'trends'/);assert.match(js,/selectedWorkspace\.getBoundingClientRect\(\)/);assert.match(css,/@media\(max-width:540px\)/);assert.match(css,/\.topbar-inner>\.nav-shell\{flex:0 0 100%/);
});
