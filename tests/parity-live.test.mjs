import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {collectSnapshot} from '../tools/build_snapshot.mjs';
import {validateSubmission,DATABASE_RELEASE_VERSION} from '../worker/src/index.js';
import {PLATFORM_KEYS,DEVICE_KEYS,DEVICE_KEYS_1016} from '../worker/src/query-manifest.js';
const fixture=JSON.parse(await readFile(new URL('../worker/tests/complete-report.json',import.meta.url),'utf8'));
const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
function extensionAudit(p,legacy307=false){const unique=a=>[...new Set(a)].sort();const diff=(a,b)=>unique(a.filter(v=>!b.includes(v)));const common=p.devices.reduce((v,d,i)=>i?v.filter(x=>d.extensions.includes(x)):unique(d.extensions),[]);const missing=diff(common,p.extensions),only=diff(p.extensions,common);return {status:missing.length||(legacy307&&only.length)?'inconsistent':'consistent',versionedEvidence:'incomplete',checkedDevices:p.devices.length,commonDeviceExtensions:common,missingFromPlatform:missing,platformOnly:only,platformVersionedMismatch:[],deviceVersionedMismatch:[]}}
function upgrade(version='3.0.8',code=30008){
  const value=structuredClone(fixture);value.application.versionName=version;value.application.versionCode=code;value.technicalReport.appVersion=version;
  const fill=(rows,keys)=>{const by=new Map(rows.map(r=>[r.name,r]));return [...keys].map(key=>by.get(key)||{name:key,value:'',status:'unavailable',code:-30})};
  for(const p of value.technicalReport.platforms){p.properties=fill(p.properties,PLATFORM_KEYS);for(const d of p.devices)d.properties=fill(d.properties,['1.0.21','1.0.22','1.0.23','3.0.1','3.0.3','3.0.4','3.0.5','3.0.7','3.0.8'].includes(version)?DEVICE_KEYS_1016:DEVICE_KEYS)}
  if(version==='3.0.8'||version==='3.0.7')for(const p of value.technicalReport.platforms)p.extensionAudit=extensionAudit(p,version==='3.0.7');
  return value;
}
function report(value,time='2026-10-08T05:00:00.000Z'){
  return {...value,id:createHash('sha256').update(canonical(value)).digest('hex'),submittedAt:time};
}
function mockServer(reports){
  return async uri=>{
    const url=new URL(uri);let value;
    if(url.pathname==='/v1/reports'){
      const rows=reports.map(v=>({id:v.id,submitted_at:v.submittedAt}));
      value={reports:rows,nextCursor:null};
    }else value=reports.find(v=>url.pathname.endsWith('/'+v.id))??{error:'missing'};
    return new Response(JSON.stringify(value),{status:value.error?404:200,headers:{'content-type':'application/json'}});
  };
}
test('freshest application producer shares Worker and snapshot validation; ID preloaded',async()=>{
  const latest=upgrade();assert.deepEqual(validateSubmission(latest),{ok:true,reason:'ok'});
  const entry=report(latest);const result=await collectSnapshot('https://example.net',mockServer([entry]),{requireId:entry.id});
  assert.equal(result.index.databaseReleaseVersion,DATABASE_RELEASE_VERSION);
  assert.equal(result.snapshot.databaseReleaseVersion,DATABASE_RELEASE_VERSION);
  assert.equal(result.index.reportCount,1);assert.equal(result.snapshot.reports[0].id,entry.id);
});
test('historical producer accepted; unknown producer and poisoned published report rejected',async()=>{
  const past=report(upgrade('0.12.1',1201));assert.equal((await collectSnapshot('https://example.net',mockServer([past]))).index.reportCount,1);
  const future=report(upgrade('0.99.9',9999));const archived=await collectSnapshot('https://example.net',mockServer([future]));assert.equal(archived.index.reportCount,1);assert.deepEqual(archived.snapshot.skippedInvalidContractIds,[future.id]);assert.equal(archived.snapshot.preloadedReportCount,0);await assert.rejects(()=>collectSnapshot('https://example.net',mockServer([future]),{requireId:future.id}),/pinned stored-report contract/);
  const tampered=structuredClone(past);tampered.technicalReport.platforms[0].devices[0].name='Forged';await assert.rejects(()=>collectSnapshot('https://example.net',mockServer([tampered])),/SHA-256 mismatch/);
});
test('snapshot publication requires exact new report detail and no false success',async()=>{
  const entry=report(upgrade());await assert.rejects(()=>collectSnapshot('https://example.net',mockServer([entry]),{requireId:'f'.repeat(64)}),/missing/);
  const invalid=structuredClone(entry);invalid.application.versionCode=1;
  await assert.rejects(()=>collectSnapshot('https://example.net',mockServer([invalid])),/SHA-256 mismatch/);
});
test('workflow references existing versioned site asset, post-deploy verification and API snapshot',async()=>{
  const src=await readFile(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
  assert.match(src,/node --check assets\/app\.v1028\.js/);
  assert.doesNotMatch(src,/app\.v0701\.js/);
  assert.match(src,/verify_published_snapshot\.mjs/);
  assert.match(src,/build_snapshot\.mjs/);
  const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html,/assets\/app\.v1028\.js/);
});

test('cache-first browser code checks sync token before querying index and polls only when visible',async()=>{
  const js=await readFile(new URL('../assets/app.v1028.js',import.meta.url),'utf8');
  assert.match(js,/fetch\('\.\/data\/index\.json'/);
  assert.match(js,/const sync=await api\('\/v1\/sync'\)/);
  assert.match(js,/if\(!force&&same\)/);
  assert.match(js,/document\.hidden/);
  assert.match(js,/setInterval\(\(\)=>update\(\),10000\)/);
  assert.match(js,/vendorLogo\(r\.vendor\)/);
  assert.match(js,/published cache remains available/);
});

test('first publish has complete zero-report index/preload schema with no fabricated records',async()=>{
  const index=JSON.parse(await readFile(new URL('../data/index.json',import.meta.url),'utf8'));
  const snapshot=JSON.parse(await readFile(new URL('../data/snapshot.json',import.meta.url),'utf8'));
  assert.equal(index.reportCount,0);assert.deepEqual(index.reports,[]);
  assert.equal(snapshot.reportCount,0);assert.equal(snapshot.preloadedReportCount,0);assert.deepEqual(snapshot.reports,[]);
});
