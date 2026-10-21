import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const app=await read('assets/app.v1028.js');
const css=await read('assets/site.v1028.css');
const html=await read('index.html');
const functionText=app.slice(app.indexOf('function queryCoverageModel(kind){'),app.indexOf('function renderCoverageView(kind){'));
assert.ok(functionText.startsWith('function queryCoverageModel'));
const a='a'.repeat(64),b='b'.repeat(64),c='c'.repeat(64);
const p=(name,status,value,code=0)=>({name,status,value,code});
const report=(id,devices)=>({id,technicalReport:{platforms:[{name:'Platform 1',devices:devices.map(([name,props])=>({name,properties:props}))}]}});
const mk=(index,records)=>{
 const state={rows:index,reports:new Map(records.map(r=>[r.id,r]))};
 const ctx={state,filteredRows:()=>state.rows,text:value=>value===null||value===undefined?'':String(value),Set,Map};
 runInNewContext(functionText,ctx);
 return ctx.queryCoverageModel;
};
test('Aggregate OpenCL query coverage uses device-level loaded-only denominator and missing query is Unknown',()=>{
 const records=[report(a,[['Device A',[p('CL_DEVICE_IMAGE_SUPPORT','available','false'),p('CL_DEVICE_GLOBAL_MEM_SIZE','available','0')]],['Device B',[p('CL_DEVICE_IMAGE_SUPPORT','unavailable','')]]]),report(b,[['Device C',[p('CL_DEVICE_GLOBAL_MEM_SIZE','error','',-30)]]])];
 const get=mk([{id:a},{id:b},{id:c}],records);
 const features=get('features'),memory=get('memory');
 assert.equal(features.loadedDevices,3);assert.equal(features.loadedReports,2);assert.equal(features.indexedReports,3);
 const row=features.items.find(x=>x.name==='CL_DEVICE_IMAGE_SUPPORT');
 assert.equal(row.total,3);assert.equal(row.counts.available,1);assert.equal(row.counts.unavailable,1);assert.equal(row.counts.unknown,1);assert.equal(row.missing,1);
 assert.equal(row.values.get('false'),1);assert.equal(row.rows.find(x=>x.device==='Device C').recorded,false);
 const mem=memory.items.find(x=>x.name==='CL_DEVICE_GLOBAL_MEM_SIZE');
 assert.equal(mem.counts.available,1);assert.equal(mem.counts.error,1);assert.equal(mem.missing,1);assert.equal(mem.values.get('0'),1);
 assert.ok(!('supported' in mem.counts));assert.ok(!('unsupported' in mem.counts));
});
test('Out-of-index reports must not appear in coverage even if previously downloaded',()=>{
 const get=mk([{id:a}], [report(a,[['One',[p('CL_DEVICE_IMAGE_SUPPORT','available','true')]]]), report(b,[['Two',[p('CL_DEVICE_IMAGE_SUPPORT','unavailable','')]]])]);
 const x=get('features');assert.equal(x.loadedDevices,1);assert.equal(x.items[0].counts.available,1);assert.equal(x.items[0].counts.unavailable,0);
});
test('Evidence modal links are sourced per-device from canonical report IDs and names are DOM-escaped',()=>{
 for(const expected of ['sourceId','validComparisonId(sourceId)','openReport(sourceId)','function renderCoverageView(kind)','queryCoverageModel(kind)',"state.coverageDisplay==='coverage'",'Absent query evidence counts as Unknown',"['available','unavailable','not_applicable','unknown','error']"]){assert.ok(app.includes(expected),expected)}
 assert.match(app,/node\('td',\{class:'code'\},x\.name\)/);
 assert.match(css,/\.coverage-table/);assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(html,/app\.v1028\.js\?v=1027/);assert.match(html,/site\.v1028\.css\?v=1027/);
});
