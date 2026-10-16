import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker,{validateSubmission} from '../src/index.js';
import {PLATFORM_KEYS,DEVICE_KEYS_1016} from '../src/query-manifest.js';
const originalFixture=JSON.parse(readFileSync(new URL('./complete-report.json',import.meta.url),'utf8'));
const clone=value=>structuredClone(value);

function fullProducer(value,versionName='1.0.19',versionCode=10019){
  const current=clone(value);
  current.application.versionName=versionName;current.application.versionCode=versionCode;current.technicalReport.appVersion=versionName;
  const fill=(rows,keys)=>{const by=new Map(rows.map(row=>[row.name,row]));return [...keys].map(name=>by.get(name)||{name,value:'',status:'unavailable',code:-30})};
  for(const platform of current.technicalReport.platforms){platform.properties=fill(platform.properties,PLATFORM_KEYS);for(const device of platform.devices)device.properties=fill(device.properties,DEVICE_KEYS_1016)}
  return current;
}
class MockDatabase {
  constructor(){this.reports=new Map();this.chunks=new Map()}
  prepare(sql){const db=this;return {async first(){if(sql.includes("COUNT(*)"))return {total:db.reports.size};if(sql.includes("SELECT id,submitted_at FROM reports ORDER"))return [...db.reports.values()].sort(sortRows)[0]||null;throw Error("Unhandled direct first "+sql)},bind(...args){return {
    async first(){if(sql.includes('COUNT(*)'))return {total:db.reports.size};if(sql.includes('SELECT id,submitted_at FROM reports ORDER'))return [...db.reports.values()].sort(sortRows)[0]||null;if(sql.includes('SELECT submitted_at FROM reports WHERE id='))return db.reports.get(args[0])||null;if(sql.includes('SELECT id,submitted_at,payload_json FROM reports WHERE id='))return db.reports.get(args[0])||null;throw Error('Unhandled first '+sql)},
    async all(){if(sql.includes('FROM report_payload_chunks'))return {results:(db.chunks.get(args[0])||[]).sort((a,b)=>a.chunk_index-b.chunk_index)};if(sql.includes('FROM reports')){let rows=[...db.reports.values()].sort(sortRows);if(sql.includes('WHERE submitted_at<'))rows=rows.filter(r=>r.submitted_at<args[0]||(r.submitted_at===args[1]&&r.id<args[2]));return {results:rows.slice(0,args.at(-1))}}throw Error('Unhandled all '+sql)},
    async run(){if(sql.startsWith('INSERT OR IGNORE INTO reports')){if(db.reports.has(args[0]))return {meta:{changes:0}};const keys=['id','submitted_at','schema_version','device_name','vendor','platform_name','opencl_version','driver_version','manufacturer','model','platform_count','device_count','payload_json'];db.reports.set(args[0],Object.fromEntries(keys.map((key,i)=>[key,args[i]])));return {meta:{changes:1}}}if(sql.startsWith('INSERT OR IGNORE INTO report_payload_chunks')){const [report_id,chunk_index,payload_chunk]=args;const rows=db.chunks.get(report_id)||[];if(rows.some(r=>r.chunk_index===chunk_index))return {meta:{changes:0}};rows.push({chunk_index,payload_chunk});db.chunks.set(report_id,rows);return {meta:{changes:1}}}throw Error('Unhandled run '+sql)}
  }}}}
  async batch(items){const savedReports=new Map(this.reports),savedChunks=new Map([...this.chunks].map(([id,rows])=>[id,[...rows]]));try{const result=[];for(const item of items)result.push(await item.run());return result}catch(error){this.reports=savedReports;this.chunks=savedChunks;throw error}}
}
const sortRows=(a,b)=>b.submitted_at.localeCompare(a.submitted_at)||b.id.localeCompare(a.id);
const env=()=>({DB:new MockDatabase(),ALLOWED_ORIGIN:'https://efishell0.github.io'});
function req(path,method='GET',body=null,headers={}){return new Request('https://api.example.test'+path,{method,headers:body===null?headers:{'content-type':'application/json',...headers},body:body===null?undefined:typeof body==='string'?body:JSON.stringify(body)})}
const get=(e,path)=>worker.fetch(req(path),e,{});
async function post(e,data,ctx={}){return worker.fetch(req('/v1/reports','POST',data),e,ctx)}
const fixture=fullProducer(originalFixture);
test('1.0.19/10019 is the only new submission producer; older versions and unknown futures fail closed',async()=>{
 assert.deepEqual(validateSubmission(fixture),{ok:true,reason:'ok'});
 for(const [v,c] of [['0.2.0',200],['0.12.10',1210],['0.30.29',3029],['1.0.0',10000],['1.0.14',10014],['1.0.15',10015],['1.0.16',10016],['1.0.17',10017],['1.0.18',10018],['1.0.20',10020]]){
  const older=fullProducer(originalFixture,v,c);
  assert.equal(validateSubmission(older).ok,false,v);
  assert.equal((await post(env(),older)).status,400,v);
 }
 for(const mutate of [p=>p.application.versionCode=10018,p=>p.technicalReport.appVersion='1.0.18',p=>p.application.versionName='1.0.18',p=>p.collection.source='imported',p=>p.collection.status='partial',p=>p.technicalReport.status='partial',p=>p.technicalReport.platforms[0].devices[0].properties.pop(),p=>p.device.androidApi=1]){
  const p=clone(fixture);mutate(p);assert.equal(validateSubmission(p).ok,false);
 }
});
test('complete 16/210 report accepted, duplicate ID stable, stored report and paginated list remain readable',async()=>{
 const e=env(),ctx=[];
 const first=await post(e,fixture,{waitUntil:x=>ctx.push(x)});assert.equal(first.status,201,await first.clone().text());
 const item=await first.json();assert.match(item.id,/^[a-f0-9]{64}$/);
 const again=await post(e,fixture);assert.equal(again.status,200);
 assert.equal((await again.json()).id,item.id);
 assert.equal((await get(e,`/v1/reports/${item.id}`)).status,200);
 const list=await get(e,'/v1/reports?limit=1');assert.equal(list.status,200);assert.equal((await list.json()).reports.length,1);
 const missing=await get(e,`/v1/reports/${'a'.repeat(64)}`);assert.equal(missing.status,404);
});
test('real false and zero values and blank successful C version are valid evidence, missing mandatory evidence is not',()=>{
 const p=clone(fixture),props=p.technicalReport.platforms[0].devices[0].properties;
 const available=props.find(row=>row.name==='CL_DEVICE_AVAILABLE');available.status='available';available.code=0;available.value='false';
 const c=props.find(row=>row.name==='CL_DEVICE_OPENCL_C_VERSION');assert.ok(c);c.status='available';c.code=0;c.value='';
 assert.deepEqual(validateSubmission(p),{ok:true,reason:'ok'});
 c.status='error';c.code=-30;assert.equal(validateSubmission(p).ok,true);
 props.pop();assert.equal(validateSubmission(p).ok,false);
});
test('schema, provenance, registry SHA, sensitive data and query shape always fail closed',async()=>{
 for(const mutate of [p=>p.schemaVersion=2,p=>p.registrySha256='0'.repeat(64),p=>p.application.packageName='com.efishell.vulkanscope',p=>p.imei='secret',p=>p.collection.source='imported',p=>p.technicalReport.platforms[0].properties.pop(),p=>p.technicalReport.platforms[0].devices[0].properties[0].name='CL_NOT_REAL',p=>p.technicalReport.platforms[0].devices[0].properties[1].name=p.technicalReport.platforms[0].devices[0].properties[0].name]){
  const p=clone(fixture);mutate(p);assert.equal(validateSubmission(p).ok,false);assert.equal((await post(env(),p)).status,400);
 }
});
test('GET, sync and health remain independent of new producer minimum',async()=>{
 const e=env();
 for(const endpoint of ['/v1/health','/v1/sync','/v1/reports?limit=25']){
  const response=await get(e,endpoint);assert.equal(response.status,200,endpoint);
 }
});
