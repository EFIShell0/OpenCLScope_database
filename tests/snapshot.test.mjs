import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {collectSnapshot} from '../tools/build_snapshot.mjs';
const base=JSON.parse(await readFile(new URL('../worker/tests/complete-report.json',import.meta.url),'utf8'));
const sort=v=>Array.isArray(v)?`[${v.map(sort).join(',')}]`:v&&typeof v==='object'?`{${Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+sort(v[k])).join(',')}}`:JSON.stringify(v);
function item(i=0){const envelope=structuredClone(base);envelope.device.model='Mock Model '+i;const id=createHash('sha256').update(sort(envelope)).digest('hex');return {...envelope,id,submittedAt:`2026-10-04T12:00:${String(59-i).padStart(2,'0')}Z`}}
function endpoint(items){const rows=items.map(r=>({id:r.id,submitted_at:r.submittedAt,device_name:r.technicalReport.platforms[0].devices[0].name}));return async url=>{const parsed=new URL(url),path=parsed.pathname;let result;if(path==='/v1/reports'){let matching=rows;if(parsed.searchParams.has('beforeId')){const id=parsed.searchParams.get('beforeId'),at=parsed.searchParams.get('beforeSubmittedAt');matching=rows.filter(r=>r.submitted_at<at||(r.submitted_at===at&&r.id<id))}result={reports:matching.slice(0,50),nextCursor:matching.length>=50?{submittedAt:matching[49].submitted_at,id:matching[49].id}:null}}else{const id=path.split('/').at(-1);result=items.find(r=>r.id===id)||{error:'Missing'}}return new Response(JSON.stringify(result),{status:result.error?404:200,headers:{'content-type':'application/json'}})}}
test('complete snapshot has full index, checked JSON and no fabricated reports',async()=>{const items=Array.from({length:53},(_,i)=>item(i));const result=await collectSnapshot('https://api.example.com',endpoint(items),{requireId:items[49].id});assert.equal(result.index.reports.length,53);assert.equal(result.snapshot.reports.length,53);assert.equal(result.index.nextCursor,null);assert.equal(result.snapshot.preloadedReportCount,53);assert.equal(result.index.reports[52].id,items[52].id)});
test('deliberately corrupt detail payload rejected by digest',async()=>{const source=item();const fake=async url=>{const r=await endpoint([source])(url);if(new URL(url).pathname===`/v1/reports/${source.id}`){const wrong=structuredClone(source);wrong.device.model='Faked';return new Response(JSON.stringify(wrong))}return r};await assert.rejects(()=>collectSnapshot('https://api.example.com',fake),/SHA-256 mismatch/)});
test('missing just-submitted report blocks publication, unrelated valid report passes control',async()=>{const source=item();const result=await collectSnapshot('https://api.example.com',endpoint([source]),{requireId:source.id});assert.equal(result.index.reportCount,1);await assert.rejects(()=>collectSnapshot('https://api.example.com',endpoint([source]),{requireId:'a'.repeat(64)}),/missing/)});
test('snapshot size cap records omitted detail without hiding index records',async()=>{const items=[item(0),item(1)];const result=await collectSnapshot('https://api.example.com',endpoint(items),{maxBytes:1100});assert.equal(result.index.reportCount,2);assert.equal(result.snapshot.preloadedReportCount,0);assert.equal(result.snapshot.omittedForSize,2)});

test('historical record with a valid SHA-256 but invalid archival contract never becomes a featured full report',async()=>{
 const valid=item(1),invalid=item(0);
 // Recompute the digest: this is authentic content that fails the known
 // OpenCLScope producer allowlist, NOT a forgery or a hash mismatch.
 const damaged={...invalid,application:{...invalid.application,versionName:'9.9.9',versionCode:90909}};
 delete damaged.id;delete damaged.submittedAt;
 const invalidId=createHash('sha256').update(sort(damaged)).digest('hex');
 const archival={...damaged,id:invalidId,submittedAt:invalid.submittedAt};
 const originalWarn=console.warn,warnings=[];
 let snapshot;
 try{console.warn=(...args)=>warnings.push(args.join(' '));snapshot=await collectSnapshot('https://api.example.com',endpoint([archival,valid]));}
 finally{console.warn=originalWarn;}
 assert.equal(snapshot.index.reportCount,2,'keep every indexed row');
 assert.equal(snapshot.snapshot.preloadedReportCount,1,'do not preload invalid content');
 assert.deepEqual(snapshot.snapshot.skippedInvalidContractIds,[invalidId]);
 assert.equal(snapshot.snapshot.reports[0].id,valid.id);
 assert.ok(warnings.some(w=>w.includes(invalidId)),'publish explicit audit warning');
 await assert.rejects(()=>collectSnapshot('https://api.example.com',endpoint([archival,valid]),{requireId:invalidId}),/pinned stored-report contract/);
});

test('unrecognized legacy contract must never downgrade identity, digest, or API failure to an optional omission',async()=>{
 const valid=item(1),bad=item(0);
 const badHash={...bad,application:{...bad.application,versionName:'9.9.9'}};
 // Digest stays the old hash, so this MUST abort the complete publication.
 await assert.rejects(()=>collectSnapshot('https://api.example.com',endpoint([badHash,valid])),/Payload SHA-256 mismatch/);
 const missing=async url=>{if(new URL(url).pathname===`/v1/reports/${bad.id}`)return new Response('{}',{status:503});return endpoint([bad,valid])(url)};
 await assert.rejects(()=>collectSnapshot('https://api.example.com',missing),/returned 503/);
});
