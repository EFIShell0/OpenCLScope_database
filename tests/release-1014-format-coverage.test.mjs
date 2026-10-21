import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const app=read('assets/app.v1028.js'),css=read('assets/site.v1028.css'),html=read('index.html');
const begin=app.indexOf('function imageFormatCoverageModel(){');
const end=app.indexOf('function renderImageFormatCoverage(){');
assert.ok(begin>0&&end>begin);
const functionText=app.slice(begin,end);
const ids=['a'.repeat(64),'b'.repeat(64),'c'.repeat(64)];
const group=(imageType,flags,status,formats=[],code=0)=>({imageType,flags,status,formats,code});
const format=(order,dataType,orderValue,typeValue)=>({order,dataType,orderValue,typeValue});
const report=(id,devices)=>({id,technicalReport:{platforms:[{name:'Platform',devices:devices.map(([name,imageFormats])=>({name,imageFormats}))}]}});
const model=(selected,all)=>{
 const state={rows:selected.map(id=>({id})),reports:new Map(all.map(record=>[record.id,record]))};
 const sandbox={state,filteredRows:()=>state.rows,text:value=>value===null||value===undefined?'':String(value),Set,Map};
 runInNewContext(functionText,sandbox);
 return sandbox.imageFormatCoverageModel();
};
test('Image format aggregation counts distinct devices, not reports or duplicate format items',()=>{
 const pair=format('CL_RGBA','CL_UNORM_INT8',4277,4306);
 const a=report(ids[0],[['A',[group('CL_MEM_OBJECT_IMAGE2D','CL_MEM_READ_WRITE','available',[pair,pair])]],['B',[group('CL_MEM_OBJECT_IMAGE2D','CL_MEM_READ_WRITE','available',[])]]]);
 const b=report(ids[1],[['C',[group('CL_MEM_OBJECT_IMAGE2D','CL_MEM_READ_WRITE','unavailable',[],-30)]]]);
 const x=model(ids,[a,b]);
 assert.equal(x.loadedDevices,3);assert.equal(x.loadedReports,2);assert.equal(x.indexedReports,3);
 assert.equal(x.groups.length,1);const g=x.groups[0];
 assert.equal(g.total,3);assert.equal(g.counts.available,2);assert.equal(g.counts.unavailable,1);assert.equal(g.counts.unknown,0);
 assert.equal(g.pairs.size,1);assert.equal([...g.pairs.values()][0].reported,1);
 assert.equal(g.rows.find(y=>y.device==='B').formats.length,0);
});
test('Missing group is Unknown; errors and not-applicable remain distinct',()=>{
 const a=report(ids[0],[['A',[group('CL_MEM_OBJECT_IMAGE1D','CL_MEM_READ_ONLY','available',[])]],['B',[]]]);
 const b=report(ids[1],[['C',[group('CL_MEM_OBJECT_IMAGE1D','CL_MEM_READ_ONLY','not_applicable',[])]],['D',[group('CL_MEM_OBJECT_IMAGE1D','CL_MEM_READ_ONLY','error',[],-5)]]]);
 const x=model(ids.slice(0,2),[a,b]);const g=x.groups[0];
 assert.equal(g.total,4);assert.equal(g.counts.available,1);assert.equal(g.counts.unknown,1);assert.equal(g.missing,1);assert.equal(g.counts.not_applicable,1);assert.equal(g.counts.error,1);
 assert.equal(g.pairs.size,0);assert.equal(g.rows.find(r=>r.device==='B').recorded,false);
 assert.equal(g.rows.find(r=>r.device==='C').status,'not_applicable');
});
test('Exact numeric format pairs are not mixed just because display names agree',()=>{
 const a=report(ids[0],[
  ['A',[group('IMAGE2D','READ','available',[format('RGBA','INT',1,2),format('RGBA','INT',3,4)])]],
  ['B',[group('IMAGE2D','READ','available',[format('RGBA','INT',1,2)])]]
 ]);
 const x=model(ids.slice(0,1),[a]),g=x.groups[0];
 assert.equal(g.pairs.size,2);assert.deepEqual([...g.pairs.values()].map(p=>p.reported).sort(),[1,2]);
 assert.equal(g.rows[1].pairKeys.size,1);
});
test('New grouped format view is accessible and version coherent without fake support claims',()=>{
 for(const term of ['renderImageFormatCoverage()','formatDisplay','formatMinimum','formatSearch','imageFormatCoverageModel()','pair.reported/g.queried','Missing groups are Unknown','state.view===\'formats\'','openEvidenceModal','row.reportId','pager(total,false)'])assert.ok(app.includes(term),term);
 assert.match(css,/\.format-coverage-table/);
 assert.match(html,/assets\/app\.v1028\.js\?v=1027/);assert.match(html,/assets\/site\.v1028\.css\?v=1027/);
 assert.doesNotMatch(app,/IMAGE2D_SUPPORTED_BY_DRIVER/);
});
