import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const app=readFileSync(new URL('assets/app.v3415.js',root),'utf8');
const part=app.slice(app.indexOf('function comparisonStableValue('),app.indexOf('function validComparisonId('));
const {semanticComparisonLeaves}=runInNewContext(part+';({semanticComparisonLeaves})',{text:v=>v==null?'':String(v),Map,Set,JSON,Object,Array});
const prop=(name,value,status='available',code=0)=>({name,value,status,code});
const fmt=(n='CL_RGBA',t='CL_UNORM_INT8')=>({order:n,dataType:t,orderValue:4277,typeValue:4306});
const device=(properties=[prop('CL_DEVICE_AVAILABLE',false)],formats=[fmt()])=>({name:'Same GPU',vendor:'Real vendor',type:'GPU',version:'OpenCL 3.0',driverVersion:'driver',profile:'FULL_PROFILE',properties,extensions:['cl_khr_fp16'],imageFormats:[{imageType:'CL_MEM_OBJECT_IMAGE2D',flags:'CL_MEM_READ_ONLY',status:'available',code:0,formats}]});
const report=devices=>({platforms:[{name:'Same platform',vendor:'Real vendor',version:'OpenCL 3.0',profile:'FULL_PROFILE',deviceEnumerationStatus:'available',deviceEnumerationCode:0,properties:[],extensions:['cl_khr_icd'],devices}]});
const canonical=m=>JSON.stringify([...m].sort(([a],[b])=>a.localeCompare(b)));
test('duplicate devices with the same identity preserve all values independently of list ordering',()=>{
 const x=report([device([prop('CL_DEVICE_MAX_CLOCK_FREQUENCY',0)]),device([prop('CL_DEVICE_MAX_CLOCK_FREQUENCY',600)])]);
 const y=report([...x.platforms[0].devices].reverse());
 assert.equal(canonical(semanticComparisonLeaves(x)),canonical(semanticComparisonLeaves(y)));
 const key=[...semanticComparisonLeaves(x).keys()].find(k=>k.endsWith('/ Property / CL_DEVICE_MAX_CLOCK_FREQUENCY'));
 assert.match(semanticComparisonLeaves(x).get(key),/600/);assert.match(semanticComparisonLeaves(x).get(key),/0/);
 y.platforms[0].devices.pop();assert.notEqual(canonical(semanticComparisonLeaves(x)),canonical(semanticComparisonLeaves(y)));
});
test('duplicate image format pairs and groups are retained and comparison is order independent',()=>{
 const a=report([device([prop('X','1')],[fmt(),fmt(),fmt('CL_R','CL_FLOAT')])]);
 const b=structuredClone(a);b.platforms[0].devices[0].imageFormats[0].formats.reverse();
 assert.equal(canonical(semanticComparisonLeaves(a)),canonical(semanticComparisonLeaves(b)));
 b.platforms[0].devices[0].imageFormats[0].formats.pop();assert.notEqual(canonical(semanticComparisonLeaves(a)),canonical(semanticComparisonLeaves(b)));
 const c=structuredClone(a);c.platforms[0].devices[0].imageFormats.push(structuredClone(c.platforms[0].devices[0].imageFormats[0]));
 assert.notEqual(canonical(semanticComparisonLeaves(a)),canonical(semanticComparisonLeaves(c)));
});
test('query state, numeric code and literal false/zero/null/unknown remain distinguishable',()=>{
 const m=val=>semanticComparisonLeaves(report([device([prop('CL_DEVICE_AVAILABLE',val)])]));
 const different=[false,0,null,'false',undefined].map(v=>canonical(m(v)));
 assert.equal(new Set(different).size,different.length);
 const e=report([device([prop('CL_DEVICE_AVAILABLE',false,'error',-5)])]);
 assert.notEqual(canonical(m(false)),canonical(semanticComparisonLeaves(e)));
 assert.match(canonical(semanticComparisonLeaves(e)),/error/);
});
test('Compare offers clickable counts, status filters and source navigation with safe unmodified backend',()=>{
 for(const token of ['compareChange','Filter comparison change type','compare-summary-filter','Open baseline report','Open target report','baselineReportId:state.compareA','targetReportId:state.compareB','state.compareChange===\'All\'','compareExportRecords(matched,\'json\')'])assert.ok(app.includes(token),token);
 const html=readFileSync(new URL('index.html',root),'utf8');
 assert.match(html,/app\.v3415\.js\?v=3415/);assert.match(html,/site\.v3415\.css\?v=3415/);
 const css=readFileSync(new URL('assets/site.v3415.css',root),'utf8');assert.match(css,/\.compare-summary-filter\[aria-pressed=/);
 const worker=readFileSync(new URL('worker/src/index.js',root),'utf8');assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.4\.15'/);
 assert.match(worker,/versionName!==acceptedVersion/);
});
