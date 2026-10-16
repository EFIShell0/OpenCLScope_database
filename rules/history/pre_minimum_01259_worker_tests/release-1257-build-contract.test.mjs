import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateSubmission,DATABASE_RELEASE_VERSION} from '../src/index.js';
import {PLATFORM_KEYS,DEVICE_KEYS_1016} from '../src/query-manifest.js';
const pristine=JSON.parse(readFileSync(new URL('./complete-report.json',import.meta.url),'utf8'));
function versioned(version,code){
  const x=structuredClone(pristine);x.application.versionName=version;x.application.versionCode=code;x.technicalReport.appVersion=version;
  const p=x.technicalReport.platforms[0];const d=p.devices[0];
  const fill=(rows,keys)=>{const by=new Map(rows.map(r=>[r.name,r]));return [...keys].map(name=>by.get(name)??{name,value:'',status:'unavailable',code:-30})};
  p.properties=fill(p.properties,PLATFORM_KEYS);d.properties=fill(d.properties,DEVICE_KEYS_1016);
  return x;
}
test('1.0.19 uses identical 16 + 210 query manifest, 1.0.18/1.0.17/1.0.16 preserved',()=>{
  assert.equal(DATABASE_RELEASE_VERSION,'0.12.59');
  assert.equal(PLATFORM_KEYS.size,16);assert.equal(DEVICE_KEYS_1016.size,210);
  for(const [name,code] of [['1.0.19',10019],['1.0.18',10018],['1.0.17',10017],['1.0.16',10016]])assert.equal(validateSubmission(versioned(name,code)).ok,true);
  const p=versioned('1.0.19',10019);
  const mismatch=structuredClone(p);mismatch.application.versionCode=10016;assert.equal(validateSubmission(mismatch).ok,false);
  const missing=structuredClone(p);missing.technicalReport.platforms[0].devices[0].properties.pop();assert.equal(validateSubmission(missing).ok,false);
  const partial=structuredClone(p);partial.technicalReport.status='partial';assert.equal(validateSubmission(partial).ok,false);
  const empty=structuredClone(p);const c=empty.technicalReport.platforms[0].devices[0].properties.find(r=>r.name==='CL_DEVICE_OPENCL_C_VERSION');c.status='available';c.value='';c.code=0;assert.equal(validateSubmission(empty).ok,true);
});
