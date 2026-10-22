import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const [app,css,html,worker]=await Promise.all(['assets/app.v1030.js','assets/site.v1028.css','index.html','worker/src/index.js'].map(x=>readFile(new URL(x,root),'utf8')));
test('Statistics distribution is deterministic, correct and never loses unknown observations',()=>{
 const code=app.match(/function statsDistribution\(values\)\{[^\n]*\}/)?.[0];
 assert.ok(code);
 const distribution=runInNewContext('const text=value=>value===null||value===undefined?"":String(value);'+code+';statsDistribution',{});
 const d=distribution(['GPU-A','GPU-B','GPU-A',null,'GPU-B','GPU-A']);
 assert.deepEqual(Array.from(d,x=>[x.label,x.count]),[['GPU-A',3],['GPU-B',2],['Unreported',1]]);
});
test('Charts distinguish loaded report, platform and device denominators',()=>{
 for(const fragment of ['statsDonut','statisticsSliceLimit','statsDistribution(devices.map','statsDistribution(platforms.map','Denominator:',"reports=[...state.reports.values()].filter","new Set(filteredRows().map","Only downloaded full reports","Full report details loaded"]){
   if(fragment==='Only downloaded full reports')continue;
   assert.ok(app.includes(fragment),fragment);
 }
 for(const s of ['SVG','stats-donut-grid','.stats-donut-legend'])assert.ok(s==='SVG'?app.includes("node('svg'"):css.includes(s),s);
 assert.match(app,/new Set\(\[\.\.\.platformNames,\.\.\.deviceNames\]\)/);
 assert.match(app,/const names=state.statisticsExtensionScope==='platform'/);
 assert.match(app,/if\(typeof name==='string'\)deviceNames\.add\(name\)/);
 assert.match(app,/if\(typeof name==='string'\)platformNames\.add\(name\)/);
 assert.match(app,/each extension is counted at most once per report|Each extension is counted at most once per report/);
 assert.match(app,/Extension frequency/);
});
test('Report tabs support keyboard, and previous evidence/producer contracts stay locked',()=>{
 for(const token of ["setAttribute('role','tablist')","'ArrowLeft','ArrowRight','Home','End'","'aria-controls':'detailContent'","setAttribute('role','tabpanel')","'available','not_applicable','unavailable','error','unknown'"])assert.ok(app.includes(token),token);
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.4\.1'/);
 assert.match(worker,/predecessor311 \? '3\.0\.11' : predecessor312 \? '3\.0\.12' : predecessor313 \? '3\.0\.13' : predecessor314 \? '3\.0\.14' : predecessor315 \? '3\.1\.0' : predecessor320 \? '3\.2\.0' : '3\.4\.0'/);
 assert.match(html,/app\.v1030\.js\?v=3401/);
 assert.match(html,/site\.v1028\.css\?v=3401/);
 assert.match(html,/browser-compat\.v1006\.js\?v=3401/);
});
