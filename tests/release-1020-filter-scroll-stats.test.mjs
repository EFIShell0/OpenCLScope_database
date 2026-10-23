import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name,root),'utf8');
const html=read('index.html');
const app=read('assets/app.v3415.js');
const css=read('assets/parity.v3415.css');
test('filters use upstream heading-side grouped layout with authoritative selects',()=>{
 const section=html.indexOf('id="workspace"'),heading=html.indexOf('class="section-heading"',section),filters=html.indexOf('id="filterPanel"',section),lookup=html.indexOf('class="lookup-deck"',section);
 assert.ok(section>=0&&heading<section+250&&heading<filters&&filters<lookup);
 assert.match(html,/id="filterPanel"/);
 assert.match(html,/reference-filter-grid/);
 assert.match(read('assets/reference-controls.v3415.css'),/\.reference-filter-family/);
 assert.match(app,/\$\('filterPanel'\)\.hidden=\['reports','compare','encyclopedia'\]/);
});
test('table track remains present, disabled without overflow, and reports actual scroll pixels',()=>{
 assert.match(css,/#workspace>\.db-content \.table-scroll-controls\{display:flex!important/);
 assert.match(app,/const max=Math\.max\(0,s\.scrollWidth-s\.clientWidth\)/);
 assert.match(app,/thumb\.setAttribute\('aria-valuenow',String\(Math\.round\(max\?s\.scrollLeft\/max\*100:0\)\)\)/);
 assert.match(app,/l\.disabled=!overflow\|\|atStart;r\.disabled=!overflow\|\|atEnd/);
 assert.match(css,/#viewportScrollbar\[hidden\]\{display:none!important/);
 assert.match(app,/node\('tr',\{class:'reports-empty-row'/);
 assert.match(app,/replaceChildren\(bar,node\('div',\{class:'table-wrap reports-table-wrap'\},table\)\)/);
});
test('statistics denominators use all loaded query rows rather than category maximum',()=>{
 assert.match(app,/100\*row\.count\/propertyCount/);
 assert.doesNotMatch(app,/100\*row\.count\/max/);
 assert.match(app,/'aria-valuemax':String\(propertyCount\)/);
 assert.match(app,/state\.statisticsSliceLimit=8;state\.statisticsExtensionScope='both'/);
 assert.match(css,/\.stats-status-panel \.stats-bar-value\{min-width:95px/);
});
test('immutable Vulkan reference remains present and original OpenCL reports are unmodified',()=>{
 assert.match(html,/assets\/vulkan-layout\.v1412\.css/);
 assert.match(html,/assets\/parity\.v3415\.css\?v=3415/);
 assert.match(app,/const DATABASE_RELEASE_VERSION = '3\.4\.15'/);
});
