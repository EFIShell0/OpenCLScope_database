import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('assets/app.v3409.js'),html=read('index.html'),css=read('assets/report-detail.v3409.css');
const marker=JSON.parse(read('data/release.json'));
test('Report detail reuses upstream hero, identity, tabs and evidence panels without Vulkan-only tabs',()=>{
 for(const name of ['detail-hero-v126','detail-hero-head','detail-identity-grid','detail-identity-card','detail-report-id-row','detail-section-intro','detail-evidence-stack','detail-evidence-panel'])assert.ok(app.includes(name)&&css.includes(name),name);
 assert.ok(css.includes('.detail-tabs')&&app.includes("$('detailTabs')"));
 assert.match(app,/const tabs=\['Overview','Platforms','Devices','Properties','Features','Memory','Formats','Extensions','Profiles','Raw report'\]/);
 assert.ok(!app.includes("'Diagnostics','Raw JSON'") && !app.includes("'Surface','Display & HDR'"));
 assert.match(app,/if\(tab==='Overview'\)entries.push\(\{title:'Collection diagnostics'/);
});
test('Report details preserve canonical ID, export actions, source query semantics and safe text nodes',()=>{
 for(const name of ['navigator.clipboard.writeText(String(r.id))','detailReportCounts(report)','reportPanel(entry)','showDetailContent()',"downloadCompleteReport(state.detail,'txt')","downloadCompleteReport(state.detail,'html')","downloadCompleteReport(state.detail,'json')"] )assert.ok(app.includes(name),name);
 assert.match(app,/const values=node\('div',\{class:'kv-grid detail-kv-grid'\}/);
 assert.match(app,/node\('code',\{\},text\(value\)\),status&&status!=='available'\?tag\(status\):null/);
 assert.match(app,/if\(tab==='Raw JSON'\|\|tab==='Raw report'\)/);
});
test('New report detail stylesheet is served last and monitored at deploy',()=>{
 assert.equal(marker.reportDetailCss,'assets/report-detail.v3409.css');
 assert.ok(html.indexOf('assets/report-detail.v3409.css')>html.indexOf('assets/reference-shell.v3409.css'));
 assert.match(read('tools/build_pages_artifact.mjs'),/release\.reportDetailCss/);
 assert.match(read('tools/verify_published_snapshot.mjs'),/marker\.reportDetailCss/);
 assert.match(read('assets/release-bootstrap.v3409.js'),/m\.reportDetailCss/);
 assert.ok(!css.includes('rgba(255,92,102,.12)'));
});
