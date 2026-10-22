import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const app=readFileSync(join(root,'assets/app.v3411.js'),'utf8');
const html=readFileSync(join(root,'index.html'),'utf8');
const rules=readFileSync(join(root,'rules/PROJECT_RULES.md'),'utf8');
const start=app.indexOf('function propertyCoverageModel(){');
const end=app.indexOf('function renderCoverageView(kind){',start);
assert.ok(start>0&&end>start);
const source=app.slice(start,end);
const A='a'.repeat(64),B='b'.repeat(64);
const prop=(name,value,status='available')=>({name,value,status,code:0});
function evaluate(reports){
 const context={state:{reports:new Map(reports),rows:reports.map(([id])=>({id}))},filteredRows(){return this.state.rows},text:v=>v==null?'':String(v)};
 context.filteredRows=()=>context.state.rows;
 vm.runInNewContext(source,context);
 return context.propertyCoverageModel();
}
test('Video-observed Properties workspace exists and matches the report-backed navigation and pager',()=>{
 assert.match(html,/data-view="properties"[^>]*>Properties<\/button>/);
 assert.match(app,/function propertyCoverageModel\(/);
 assert.match(app,/if\(kind==='properties'\)return propertyCoverageModel\(\)/);
 assert.match(app,/\['features','memory','properties','formats'\]/);
 assert.match(app,/openEvidenceModal\(/);
 assert.match(rules,/Database 3\.4\.11 — video-observed Properties workspace parity/);
});
test('Platform and device property denominators stay separate; missing query is Unknown',()=>{
 const mk=(platformProperties,deviceProperties)=>({technicalReport:{platforms:[{name:'OpenCL Platform',properties:platformProperties,devices:[{name:'Compute GPU',properties:deviceProperties}]}]}});
 const model=evaluate([[A,mk([prop('CL_PLATFORM_VENDOR','V')],[prop('CL_DEVICE_AVAILABLE',false)])],[B,mk([], [prop('CL_DEVICE_AVAILABLE',0)])]]);
 const vendor=model.items.find(item=>item.name==='CL_PLATFORM_VENDOR');
 const availability=model.items.find(item=>item.name==='CL_DEVICE_AVAILABLE');
 assert.ok(vendor&&availability);
 assert.equal(vendor.total,2);
 assert.equal(vendor.counts.available,1);
 assert.equal(vendor.counts.unknown,1);
 assert.equal(vendor.missing,1);
 assert.equal(availability.total,2);
 assert.equal(availability.counts.available,2);
 assert.equal(availability.counts.unknown,0);
 assert.equal(availability.values.size,2);
 assert.equal(availability.values.get('false'),1);
 assert.equal(availability.values.get('0'),1);
 assert.equal(model.loadedReports,2);
 assert.equal(model.loadedDevices,4);
});
test('Query error remains Error and never becomes an invented support verdict',()=>{
 const id='c'.repeat(64);
 const result=evaluate([[id,{technicalReport:{platforms:[{name:'P',properties:[],devices:[{name:'D',properties:[{name:'CL_DEVICE_MAX_COMPUTE_UNITS',value:null,status:'error',code:-30}]}]}]}}]]);
 const row=result.items.find(item=>item.name==='CL_DEVICE_MAX_COMPUTE_UNITS');
 assert.equal(row.counts.error,1);
 assert.equal(row.counts.available,0);
 assert.equal(row.values.size,0);
 assert.equal(row.rows[0].code,-30);
});
