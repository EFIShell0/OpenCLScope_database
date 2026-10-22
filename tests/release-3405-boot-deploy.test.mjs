import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const baseMarker={schemaVersion:2,releaseReady:true,databaseVersion:'3.5.0',cacheKey:'3500',appJs:'assets/app.v3500.js',siteCss:'assets/site.v3500.css',parityCss:'assets/parity.v3500.css',shellCss:'assets/reference-shell.v3500.css',reportDetailCss:'assets/report-detail.v3500.css',bootstrapJs:'assets/release-bootstrap.v3500.js'};
async function testUpdate(marker,auto){
 const source=await read('assets/release-bootstrap.v3409.js');
 const requests=[],events=[],visits=[];
 const storage=new Map(auto?[['openclscope.autoReleaseReload','yes']]:[]);
 const fetch=async url=>{
  const name=String(url).split('?')[0].replace(/^\.\//,'');requests.push(name);
  const body=name==='data/release.json'?JSON.stringify(marker):name==='index.html'?['appJs','siteCss','parityCss','shellCss','reportDetailCss','bootstrapJs'].map(k=>`${marker[k]}?v=${marker.cacheKey}`).join(' '):name===marker.appJs?`const DATABASE_RELEASE_VERSION = '${marker.databaseVersion}'`:name===marker.bootstrapJs?`const LOCAL='${marker.databaseVersion}'`:name==='assets/browser-compat.v1006.js'?'OPENCLSCOPE'.repeat(100):'S'.repeat(1000);
  return {ok:true,text:async()=>body,json:async()=>JSON.parse(body)};
 };
 const listeners=new Map();
 const location={href:'https://example.test/db/index.html#reports',hash:'#reports',replace:url=>visits.push(url)};
 const window={dispatchEvent:e=>events.push(e.detail),addEventListener:(name,cb)=>listeners.set(name,cb)};
 const context={window,document:{hidden:false,addEventListener(){}},navigator:{onLine:true},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},fetch,location,URL,Date,Math,Promise,Error,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},setTimeout:()=>0,setInterval:()=>0};
 vm.runInNewContext(source,context);
 await new Promise(resolve=>setImmediate(resolve));
 const verified=await window.__OPENCLSCOPE_RELEASE_UPDATE__.check();
 return {verified,requests,events,visits,storage};
}
test('release marker stays not-ready before snapshot publication, and is ready in the snapshot builder',async()=>{
 const source=JSON.parse(await read('data/release.json'));
 assert.equal(source.releaseReady,false);
 assert.equal(source.cacheKey,'3409');
 const builder=await read('tools/build_snapshot.mjs');
 assert.match(builder,/releaseReady:true/);
 assert.match(builder,/cacheKey:'3409'/);
 const builderArtifact=await read('tools/build_pages_artifact.mjs');
 assert.match(builderArtifact,/release\.schemaVersion!==2/);
});
test('bootstrap rejects unfinished release without fetching any deployment assets',async()=>{
 const result=await testUpdate({...baseMarker,releaseReady:false},true);
 assert.equal(result.verified,false);
 assert.equal(result.visits.length,0);
 assert.equal(result.events.length,0);
 assert.ok(result.requests.every(path=>path==='data/release.json')); 
});
test('ready release prompts without consent and retains source view',async()=>{
 const result=await testUpdate(baseMarker,false);
 assert.equal(result.verified,true);
 assert.equal(result.visits.length,0);
 assert.equal(result.events[0].version,'3.5.0');
 assert.equal(result.events.length,1,'Only one update event per new version');
 assert.ok(result.requests.includes('index.html'));
});
test('consented automatic reload preserves page hash and confirms source assets',async()=>{
 const result=await testUpdate(baseMarker,true);
 assert.ok(result.verified===true||result.verified===undefined);
 assert.equal(result.visits.length,1);
 assert.match(result.visits[0],/#reports$/);
 assert.match(result.visits[0],/_release=3\.5\.0/);
 assert.ok(result.requests.includes('assets/release-bootstrap.v3500.js'));
});
test('VulkanScope-style multi-stage deployment and independent report dispatch remain gated',async()=>{
 const workflow=await read('.github/workflows/pages.yml');
 for(const name of ['windows-tooling:','build:','release:','deploy:','snapshot-refresh:','needs: windows-tooling','needs: [build, release]','node tools/verify_published_snapshot.mjs','node tools/audit_pages_artifact.mjs'])assert.ok(workflow.includes(name),name);
 assert.match(workflow,/inputs\.mode == 'snapshot'/);
 const css=await read('assets/parity.v3409.css');
 assert.match(css,/\.db-workspace \.filters\.filter-panel\{display:grid/);
 assert.doesNotMatch(css,/\.section-heading \.filters\.filter-panel\{display:grid/);
 assert.match(css,/\.hero-v127 \.hero-command-deck \.search-box\{border-color:#363c39!important/);
});
