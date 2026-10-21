import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file = name => readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=file('index.html');
const js=file('assets/app.v1030.js');
const patch=file('assets/parity.v1030.css');
const reference=file('assets/vulkan-layout.v1412.css');
const rules=file('rules/PROJECT_RULES.md');
test('parity corrections are the final local stylesheet after the pinned upstream and original OpenCL layers',()=>{
 const order=['assets/vulkan-layout.v1412.css','assets/site.v1030.css','assets/parity.v1030.css'];
 assert.ok(order.every(x=>html.includes(x)));
 assert.ok(order.map(x=>html.indexOf(x)).every((n,i,list)=>n>=0&&(i===0||n>list[i-1])));
 assert.match(html,/data-workspace="reports"/);
 assert.match(js,/\$\('databaseHero'\)\.dataset\.workspace=state\.view/);
 assert.match(reference,/\.hero-v127\{position:relative;overflow:hidden/);
 assert.match(rules,/Database 3\.0\.30/);
});
test('OpenCL green is decorative, neutral surfaces and semantic error state survive',()=>{
 assert.match(patch,/:root\{--bg:#09090a;--panel:#111113;--panel2:#161619;--line:#292a2f/);
 assert.match(patch,/--accent:#3dae2b/);
 assert.match(patch,/--red:#ff8f98;--redbg:#49171c/);
 assert.match(patch,/\.hero\.hero-v127\{background:linear-gradient/);
 assert.match(patch,/\.hero-v127 \.(?:hero-workspace-card|hero-v127-evidence)/);
 assert.doesNotMatch(patch,/\.status-tag\.error\s*\{/);
});
test('pagination is centered, bounded, and loads next remote page only for Reports',()=>{
 assert.match(js,/function pager\(total,remote=false\)/);
 const reports=js.split('function renderReports(){')[1].split('\nfunction comparisonStableValue',1)[0];
 assert.equal((reports.match(/pager\(rows\.length,true\)/g)||[]).length,1);
 assert.match(js,/number\.disabled=count<=1/);
 assert.match(patch,/\.pagination\{display:flex;align-items:center;justify-content:center/);
 assert.match(patch,/\.pagination\[hidden\]\{display:none!important\}/);
 assert.match(patch,/\.pagination button:disabled\{opacity/);
});
test('all workspace filters can wrap without crushing the title and obey hidden state',()=>{
 assert.match(patch,/\.section-heading\{display:grid;grid-template-columns:minmax\(0,1fr\)/);
 assert.match(patch,/\.section-heading \.filters\.filter-panel\{display:grid;grid-template-columns:repeat\(auto-fit/);
 assert.match(patch,/\.section-heading \.filters\.filter-panel\[hidden\],\.section-heading \.filters\.filter-panel \.filter-control\[hidden\]\{display:none!important\}/);
 assert.match(patch,/@media\(max-width:760px\)/);
 assert.match(patch,/\.db-content \.table-wrap,\.db-content \.coverage-table-wrap,\.db-content \.compare-evidence-wrap\{[^}]*overflow-x:auto/);
});
test('settings and evidence overlays preserve bounded viewport and keyboard semantics',()=>{
 assert.match(patch,/#settingsDrawer\.settings-drawer\{left:0!important;right:auto!important/);
 assert.match(patch,/body\.settings-open #settingsDrawer\.settings-drawer:not\(\[hidden\]\)/);
 assert.match(patch,/#settingsDrawer\.settings-drawer\[hidden\]\{display:none!important\}/);
 assert.match(js,/function closeSettings\(\)/);
 assert.match(js,/function closeEvidenceModal\(\)/);
 assert.match(patch,/@media\(prefers-reduced-motion:reduce\)/);
});
