import {createHash} from 'node:crypto';
import {writeFile,rename,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {validateSubmission,DATABASE_RELEASE_VERSION} from '../worker/src/index.js';

const ID=/^[a-f0-9]{64}$/;
const MAX_INDEX=100000;
const MAX_FULL=60;
const MAX_SNAPSHOT=24*1024*1024;
function sorted(value,depth=0){
  if(depth>32)throw Error('Snapshot report depth exceeded');
  if(Array.isArray(value))return '['+value.map(v=>sorted(v,depth+1)).join(',')+']';
  if(value!==null&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+sorted(value[k],depth+1)).join(',')+'}';
  return JSON.stringify(value);
}
function verifyEnvelope(full,id){
  if(!full||full.id!==id||full.schemaVersion!==1||typeof full.submittedAt!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/.test(full.submittedAt))throw Error(`Incorrect report identity/schema: ${id}`);
  const bare={...full};delete bare.id;delete bare.submittedAt;
  if(!validateSubmission(bare).ok)throw Error(`Invalid producer or report contract in published detail: ${id}`);
  if(createHash('sha256').update(sorted(bare)).digest('hex')!==id)throw Error(`Payload SHA-256 mismatch: ${id}`);
  return full;
}
function verifyIndexRow(row){
  if(!row||!ID.test(row.id)||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/.test(row.submitted_at))throw Error('Invalid index row returned by API');
}
async function getJson(api,path,fetchImpl){
  const response=await fetchImpl(`${api}${path}`,{method:'GET',headers:{accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`API ${path} returned ${response.status}`);
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength>18*1024*1024)throw Error(`API ${path} exceeded response bound`);
  return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function collectSnapshot(api,fetchImpl=fetch,options={}){
  const maxIndex=options.maxIndex||MAX_INDEX;
  const maxFull=options.maxFull||MAX_FULL;
  const maxBytes=options.maxBytes||MAX_SNAPSHOT;
  const rows=[],ids=new Set();let cursor=null,previous=null;
  for(let page=0;page<Math.ceil(maxIndex/50)+1;page++){
    const suffix=cursor?`&beforeSubmittedAt=${encodeURIComponent(cursor.submittedAt)}&beforeId=${cursor.id}`:'';
    const data=await getJson(api,`/v1/reports?limit=50${suffix}`,fetchImpl);
    if(!Array.isArray(data.reports)||data.reports.length>50)throw Error('API page shape or length is invalid');
    if(data.reports.length===0){if(data.nextCursor)throw Error('Non-empty cursor on empty page');cursor=null;break}
    for(const row of data.reports){
      verifyIndexRow(row);
      if(ids.has(row.id))throw Error('Duplicate report in ordered index');
      ids.add(row.id);
      if(previous&&(row.submitted_at>previous.submitted_at||(row.submitted_at===previous.submitted_at&&row.id>=previous.id)))throw Error('Report index order is invalid');
      previous=row;rows.push(row);
    }
    if(rows.length>maxIndex)throw Error('Index limit reached; release refused rather than silently truncating public data');
    const next=data.nextCursor;
    if(next&&(!ID.test(next.id)||!next.submittedAt||!rows.some(r=>r.id===next.id&&r.submitted_at===next.submittedAt)))throw Error('Invalid cursor returned by API');
    cursor=next;
    if(!cursor)break;
    if(page===Math.ceil(maxIndex/50))throw Error('Index traversal limit exceeded');
  }
  if(cursor)throw Error('Database report index was not fully retrieved');
  const featured=[],featuredIds=new Set();let used=Buffer.byteLength('{"schemaVersion":1,"reports":[]}'),omittedForSize=0;
  const expected=options.requireId;
  if(expected&&!rows.some(r=>r.id===expected))throw Error('Just-submitted report is missing from published index');
  if(expected){
    const required=verifyEnvelope(await getJson(api,`/v1/reports/${expected}`,fetchImpl),expected);
    const bytes=Buffer.byteLength(JSON.stringify(required))+1;
    if(used+bytes>maxBytes)throw Error('Just-submitted report exceeds snapshot preload limit');
    featured.push(required);featuredIds.add(expected);used+=bytes;
  }
  for(let i=0;i<Math.min(rows.length,maxFull);i+=4){
    const batch=await Promise.all(rows.slice(i,i+4).filter(r=>!featuredIds.has(r.id)).map(async r=>verifyEnvelope(await getJson(api,`/v1/reports/${r.id}`,fetchImpl),r.id)));
    for(const value of batch){
      const size=Buffer.byteLength(JSON.stringify(value))+1;
      if(used+size>maxBytes){omittedForSize++;continue}
      used+=size;featured.push(value);featuredIds.add(value.id);
    }
  }
  const generatedAt=new Date().toISOString();
  const index={schemaVersion:1,databaseReleaseVersion:DATABASE_RELEASE_VERSION,generatedAt,reportCount:rows.length,reports:rows,nextCursor:null};
  const snapshot={schemaVersion:1,databaseReleaseVersion:DATABASE_RELEASE_VERSION,generatedAt,reportCount:rows.length,preloadedReportCount:featured.length,omittedForSize,reports:featured};
  if(Buffer.byteLength(JSON.stringify(snapshot))>maxBytes)throw Error('Final snapshot exceeded size cap');
  if(expected&&!snapshot.reports.some(r=>r.id===expected))throw Error('Just-submitted report is missing from required snapshot preload');
  return {index,snapshot};
}
export async function publishSnapshot(api,out,fetchImpl=fetch,options={}){
  const result=await collectSnapshot(api,fetchImpl,options);
  const folder=resolve(out,'data');await mkdir(folder,{recursive:true});
  const suffix=`.${process.pid}.tmp`;
  const entries=[['index.json',result.index],['snapshot.json',result.snapshot]];
  for(const [filename,payload] of entries)await writeFile(join(folder,filename+suffix),JSON.stringify(payload));
  for(const [filename]of entries)await rename(join(folder,filename+suffix),join(folder,filename));
  return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const api=String(process.env.OPENCLSCOPE_DATABASE_API||'').trim().replace(/\/$/,'');
  if(!/^https:\/\/[A-Za-z0-9.-]+(?::443)?$/.test(api))throw Error('OPENCLSCOPE_DATABASE_API must be an already deployed fixed HTTPS origin');
  const requireId=String(process.env.REQUIRED_REPORT_ID||'').trim();
  if(requireId&&!ID.test(requireId))throw Error('Invalid required snapshot report ID');
  const result=await publishSnapshot(api,process.cwd(),fetch,{requireId});
  process.stdout.write(`Snapshot: ${result.index.reportCount} indexed, ${result.snapshot.preloadedReportCount} full; omitted for size: ${result.snapshot.omittedForSize}\n`);
}
