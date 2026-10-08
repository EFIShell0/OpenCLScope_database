import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker,{validateSubmission} from '../src/index.js';
import {PLATFORM_KEYS,DEVICE_KEYS} from '../src/query-manifest.js';
const fixture=JSON.parse(readFileSync(new URL('./complete-report.json',import.meta.url),'utf8'));
const clone=value=>structuredClone(value);

function fullProducer(value,versionName='0.12.4',versionCode=1204){
  const current=clone(value);
  current.application.versionName=versionName;current.application.versionCode=versionCode;current.technicalReport.appVersion=versionName;
  const fill=(rows,keys)=>{const by=new Map(rows.map(row=>[row.name,row]));return [...keys].map(name=>by.get(name)||{name,value:'',status:'unavailable',code:-30})};
  for(const platform of current.technicalReport.platforms){platform.properties=fill(platform.properties,PLATFORM_KEYS);for(const device of platform.devices)device.properties=fill(device.properties,DEVICE_KEYS)}
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
test('fixture from actual host native mock is complete and values have explicit states',()=>{assert.deepEqual(validateSubmission(fixture),{ok:true,reason:'ok'});const d=fixture.technicalReport.platforms[0].devices[0];assert.equal(d.properties.length,120);assert.equal(d.imageFormats.length,18);assert(d.properties.some(p=>p.status==='unavailable'));assert.equal(fixture.technicalReport.platforms[0].properties.length,8)});
test('end-to-end POST → GET list/detail → duplicate ID with server timestamp and pagination',async()=>{const e=env(),jobs=[];let r=await post(e,fixture,{waitUntil:p=>jobs.push(p)});assert.equal(r.status,201);const accepted=await r.json();assert.match(accepted.id,/^[a-f0-9]{64}$/);assert.match(accepted.submittedAt,/Z$/);assert.equal(accepted.status,'accepted');assert.equal(jobs.length,0);const list=await(await get(e,'/v1/reports?limit=50')).json();assert.equal(list.reports.length,1);assert.equal(list.reports[0].device_name,'Mock OpenCL GPU');const detail=await(await get(e,'/v1/reports/'+accepted.id)).json();assert.deepEqual(detail.technicalReport,fixture.technicalReport);assert.equal(detail.id,accepted.id);assert.equal(detail.submittedAt,accepted.submittedAt);r=await post(e,fixture);assert.equal(r.status,200);assert.deepEqual(await r.json(),{id:accepted.id,submittedAt:accepted.submittedAt,status:'duplicate'});const sync=await(await get(e,'/v1/sync')).json();assert.equal(sync.reportCount,1);assert.equal(sync.latestReportId,accepted.id)});
test('reject wrong producer / incomplete state / missing query / fake flags / bad IDs and origins',async()=>{for(const edit of [p=>p.application.packageName='com.efishell.vulkanscope',p=>p.application.versionCode=100,p=>p.collection.status='collecting',p=>p.collection.source='imported',p=>p.technicalReport.platforms[0].devices[0].properties.pop(),p=>p.technicalReport.platforms[0].deviceEnumerationStatus='error',p=>p.device.serialNumber='secret',p=>p.technicalReport.platforms[0].devices[0].properties[0].status='supported']){const p=clone(fixture);edit(p);const r=await post(env(),p);assert.equal(r.status,400,JSON.stringify(await r.text()))}const e=env();assert.equal((await worker.fetch(req('/v1/reports','POST',fixture,{'origin':'https://attacker.invalid'}),e,{})).status,403);assert.equal((await get(e,'/v1/reports/abc')).status,400);assert.equal((await get(e,'/v1/reports?limit=900')).status,400);assert.equal((await get(e,'/v1/reports?beforeId=abc')).status,400);assert.equal((await worker.fetch(req('/v1/health','POST',fixture),e,{})).status,405);assert.equal((await worker.fetch(req('/v1/reports','POST','{}',{'content-type':'text/plain'}),e,{})).status,415)});
test('false support boolean is valid scalar evidence and negative mutation is caught without false positive',()=>{const p=clone(fixture);const value=p.technicalReport.platforms[0].devices[0].properties.find(x=>x.name==='CL_DEVICE_AVAILABLE');value.status='available';value.value='false';value.code=0;assert.equal(validateSubmission(p).ok,true);value.status='unsupported';assert.equal(validateSubmission(p).ok,false)});
test('chunked complete payload roundtrips, and missing durable chunk fails closed',async()=>{const p=clone(fixture),extensions=Array.from({length:2500},(_,i)=>`cl_vendor_example_${String(i).padStart(4,'0')}`);p.technicalReport.platforms[0].devices[0].extensions=extensions;p.technicalReport.platforms[0].devices[0].properties.find(row=>row.name==='CL_DEVICE_EXTENSIONS').value=extensions.join(' ');assert.equal(validateSubmission(p).ok,true);const e=env();const create=await post(e,p);assert.equal(create.status,201,await create.clone().text());const id=(await create.json()).id;assert(e.DB.chunks.get(id)?.length>1);const restored=await get(e,'/v1/reports/'+id);assert.equal(restored.status,200);assert.deepEqual((await restored.json()).technicalReport,p.technicalReport);e.DB.chunks.get(id).pop();assert.equal((await get(e,'/v1/reports/'+id)).status,500)});
test('snapshot job dispatch only after a fresh committed report and configured secret',async()=>{const e=env();e.SNAPSHOT_GITHUB_TOKEN='secret';e.SNAPSHOT_GITHUB_OWNER='org';e.SNAPSHOT_GITHUB_REPO='repo';e.SNAPSHOT_GITHUB_WORKFLOW='pages.yml';e.SNAPSHOT_GITHUB_REF='main';const tasks=[];const nativeFetch=globalThis.fetch;globalThis.fetch=async()=>new Response(null,{status:204});try{let r=await post(e,fixture,{waitUntil:p=>tasks.push(p)});assert.equal(r.status,201);assert.equal(tasks.length,1);await Promise.all(tasks);r=await post(e,fixture,{waitUntil:p=>tasks.push(p)});assert.equal(r.status,200);assert.equal(tasks.length,1)}finally{globalThis.fetch=nativeFetch}});

test('current v0.12.4 producer accepted, prior producers remain accepted with exact version-specific query contracts, mismatches fail closed',async()=>{
  const current=fullProducer(fixture);
  assert.deepEqual(validateSubmission(current),{ok:true,reason:'ok'});
  const prior123=fullProducer(fixture,'0.12.3',1203);
  assert.deepEqual(validateSubmission(prior123),{ok:true,reason:'ok'});
  const prior121=fullProducer(fixture,'0.12.1',1201);
  assert.deepEqual(validateSubmission(prior121),{ok:true,reason:'ok'});
  const prior120=fullProducer(fixture,'0.12.0',1200);
  assert.deepEqual(validateSubmission(prior120),{ok:true,reason:'ok'});
  const prior111=fullProducer(fixture,'0.11.1',1101);
  assert.deepEqual(validateSubmission(prior111),{ok:true,reason:'ok'});
  const prior110=fullProducer(fixture,'0.11.0',1100);
  assert.deepEqual(validateSubmission(prior110),{ok:true,reason:'ok'});
  const prior103=fullProducer(fixture,'0.10.3',1003);
  assert.deepEqual(validateSubmission(prior103),{ok:true,reason:'ok'});
  const prior102=fullProducer(fixture,'0.10.2',1002);
  assert.deepEqual(validateSubmission(prior102),{ok:true,reason:'ok'});
  const prior101=fullProducer(fixture,'0.10.1',1001);
  assert.deepEqual(validateSubmission(prior101),{ok:true,reason:'ok'});
  const priorPoint=fullProducer(fixture,'0.8.1',801);
  assert.deepEqual(validateSubmission(priorPoint),{ok:true,reason:'ok'});
  const priorFull=fullProducer(fixture,'0.8.0',800);
  assert.deepEqual(validateSubmission(priorFull),{ok:true,reason:'ok'});
  for (const [versionName,versionCode] of [['0.2.0',200],['0.3.0',300],['0.4.0',400],['0.5.0',500],['0.6.0',600],['0.6.1',601],['0.7.0',700]]) {
    const prior=clone(fixture);prior.application.versionName=versionName;prior.application.versionCode=versionCode;prior.technicalReport.appVersion=versionName;
    assert.deepEqual(validateSubmission(prior),{ok:true,reason:'ok'});
  }
  const db=env();const created=await post(db,current);
  assert.equal(created.status,201,await created.clone().text());
  const id=(await created.json()).id;
  assert.equal((await get(db,'/v1/reports/'+id)).status,200);
  const mismatch=clone(current);mismatch.technicalReport.appVersion='0.5.0';
  assert.equal(validateSubmission(mismatch).ok,false);
  assert.equal((await post(env(),mismatch)).status,400);
  const badCode=clone(current);badCode.application.versionCode=700;
  assert.equal(validateSubmission(badCode).ok,false);
  assert.equal((await post(env(),badCode)).status,400);
});

test('scheduled retry dispatches only when configured published snapshot is stale',async()=>{
  const e=env();e.SNAPSHOT_GITHUB_TOKEN='secret';e.SNAPSHOT_GITHUB_OWNER='EFIShell0';e.SNAPSHOT_GITHUB_REPO='OpenCLScope_database';e.SNAPSHOT_GITHUB_WORKFLOW='pages.yml';e.SNAPSHOT_GITHUB_REF='main';e.SNAPSHOT_PAGES_URL='https://efishell0.github.io/OpenCLScope_database';
  const nativeFetch=globalThis.fetch;
  try{
    await post(e,fixture);
    const id=[...e.DB.reports.keys()][0];
    let dispatches=0;
    globalThis.fetch=async url=>{
      if(String(url).includes('/data/index.json'))return new Response(JSON.stringify({schemaVersion:1,reportCount:1,reports:[{id}]}));
      dispatches++;return new Response(null,{status:204});
    };
    await worker.scheduled({},e);
    assert.equal(dispatches,0);
    globalThis.fetch=async url=>{
      if(String(url).includes('/data/index.json'))return new Response(JSON.stringify({schemaVersion:1,reportCount:0,reports:[]}));
      dispatches++;return new Response(null,{status:204});
    };
    await worker.scheduled({},e);
    assert.equal(dispatches,1);
  }finally{globalThis.fetch=nativeFetch}
});
