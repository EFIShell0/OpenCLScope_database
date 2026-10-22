import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const app=readFileSync(new URL('assets/app.v3408.js',root),'utf8');
const slice=app.slice(app.indexOf('function extensionCoverageModel(){'),app.indexOf('function renderExtensionCoverage(){'));
const ids=['a'.repeat(64),'b'.repeat(64),'c'.repeat(64)];
const prop=(name,status,code=0)=>({name,status,code});
const d=(name,extensions,queryStatus='available')=>({name,extensions,properties:queryStatus===null?[]:[prop('CL_DEVICE_EXTENSIONS',queryStatus,-5)]});
const p=(name,extensions,devices,queryStatus='available')=>({name,extensions,devices,properties:queryStatus===null?[]:[prop('CL_PLATFORM_EXTENSIONS',queryStatus)]});
const report=(id,platforms)=>({id,technicalReport:{platforms}});
const model=(all,selected=ids,scope='device')=>{
 const state={extensionScope:scope,reports:new Map(all.map(r=>[r.id,r])),rows:selected.map(id=>({id}))};
 const sandbox={state,filteredRows:()=>state.rows,text:x=>x==null?'':String(x)};
 runInNewContext(slice,sandbox);
 return sandbox.extensionCoverageModel();
};
test('Device scoped frequency denominator counts devices not reports, no double count',()=>{
 const one=report(ids[0],[p('P',['cl_khr_icd'],[d('A',['cl_khr_fp16','cl_khr_fp16']),d('B',[])])]);
 const two=report(ids[1],[p('Q',['cl_khr_icd'],[d('C',['cl_khr_fp16'])])]);
 const out=model([one,two]);
 assert.equal(out.total,3);assert.equal(out.loadedReports,2);
 const fp16=out.items.find(x=>x.name==='cl_khr_fp16');assert.equal(fp16.counts.advertised,2);assert.equal(fp16.counts.not_listed,1);assert.equal(fp16.confirmed,3);
 assert.equal(out.items.some(x=>x.name==='cl_khr_icd'),false);
});
test('Failed or absent extension query is never interpreted as unsupported or advertised',()=>{
 const r=report(ids[0],[p('P',['cl_khr_icd'],[
  d('A',['cl_khr_fp16'],'available'),
  d('B',['cl_khr_fp16'],'error'),
  d('C',[],'unavailable'),
  d('D',[],null),
  d('E',[],'not_applicable'),
  d('F',[],'unknown')
 ])]);
 const out=model([r]);const f=out.items.find(x=>x.name==='cl_khr_fp16');
 assert.equal(f.total,6);assert.equal(f.counts.advertised,1);assert.equal(f.counts.error,1);assert.equal(f.counts.unavailable,1);assert.equal(f.counts.unknown,2);assert.equal(f.counts.not_applicable,1);assert.equal(f.counts.not_listed,0);
 assert.equal(f.rows.find(x=>x.device==='D').recorded,false);
});
test('Platform and device extension membership remain separate and source-linked',()=>{
 const r=report(ids[0],[p('P',['cl_khr_icd'],[d('GPU',['cl_khr_fp16'])])]);
 const platform=model([r],[ids[0]],'platform');assert.equal(platform.total,1);assert.equal(platform.items.length,1);assert.equal(platform.items[0].name,'cl_khr_icd');
 const both=model([r],[ids[0]],'both');assert.equal(both.total,2);const icd=both.items.find(x=>x.name==='cl_khr_icd');
 assert.equal(icd.counts.advertised,1);assert.equal(icd.counts.not_listed,1);assert.equal(icd.rows[0].reportId,ids[0]);
 assert.equal(model([r],[], 'both').total,0);
});
test('Coverage UI exposes appropriate filters and source report modal with no invented feature support',()=>{
 for(const term of ['renderExtensionCoverage()','extensionCoverageModel()','Extension scope','Extension namespace','Advertisement coverage','Advertisement state','Not listed is distinct from Unknown','openEvidenceModal','r.reportId','pager(total,false)'])assert.ok(app.includes(term),term);
 assert.ok(app.includes("if(state.view==='extensions')return renderExtensionCoverage()"));
 assert.doesNotMatch(slice,/status==='available'.*'supported'/);
 const css=readFileSync(new URL('assets/site.v3408.css',root),'utf8');const html=readFileSync(new URL('index.html',root),'utf8');
 assert.match(css,/\.extension-coverage-table/);assert.match(html,/assets\/app\.v3408\.js\?v=3408/);assert.match(html,/assets\/site\.v3408\.css\?v=3408/);
});
