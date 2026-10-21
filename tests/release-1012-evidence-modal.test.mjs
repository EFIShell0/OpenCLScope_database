import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const [app,css,html,compare]=await Promise.all(['assets/app.v1020.js','assets/site.v1015.css','index.html','FULL_VULKAN_DESIGN_COMPARISON_3.0.18.md'].map(read));
test('Evidence drilldown reuses per-record exact facts with 10/25/50 page size, status and optional source report',()=>{
 for(const expected of ['function openEvidenceModal(entry,trigger)','function renderEvidenceModalPage()','function closeEvidenceModal()','function ensureEvidenceModal()','evidenceModalFields=Array.isArray(entry.fields)?entry.fields:[]','evidenceModalReportId=validComparisonId(entry.reportId)?entry.reportId', 'openReport(id)','evidenceModalPage*evidenceModalPageSize','[10,25,50]','aria-modal','aria-labelledby','evidence-modal-launch'])assert.ok(app.includes(expected),expected);
 assert.match(app,/rows\.push\(\{reportId:report\.id,title:/);
 assert.match(app,/entries\.push\(\{reportId:id,title:/);
 assert.ok(!app.includes('innerHTML=template.innerHTML'));
 assert.match(css,/\.evidence-modal\[hidden\]/);
 assert.match(css,/@media\(max-width:620px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('Keyboard focus/overlay, status filtering and SVG namespace remain correctly constrained',()=>{
 for(const expected of ['evidenceModalReturnFocus=trigger','focus({preventScroll:true})','if(e.key===\'Escape\')','e.shiftKey&&document.activeElement===first','closeEvidenceModal();const r=state.detail','closeEvidenceModal();try','!statusView&&state.status',"['features','memory','formats'].includes(state.view)","'clipPath','text','tspan'"])assert.ok(app.includes(expected),expected);
 assert.match(app,/e\.state\?tag\(e\.state\):node\('span',\{class:'evidence-recorded'\},'Recorded'\)/);
 assert.match(app,/prop\.value===null\|\|prop\.value===undefined\?'\(none\)':prop\.value/);
 assert.match(html,/app\.v1020\.js\?v=1020/);
 assert.match(html,/site\.v1015\.css\?v=1015/);
});
test('3.0.18 stage documents remaining gaps instead of claiming upstream parity or live deployment',()=>{
 assert.match(compare,/stage 9/i);
 assert.match(compare,/Remaining gaps/);
 assert.match(compare,/NOT been established/);
});
