import {PLATFORM_KEYS, DEVICE_KEYS, LEGACY_PLATFORM_KEYS, LEGACY_DEVICE_KEYS, REGISTRY_SHA256} from './query-manifest.js';

export const DATABASE_RELEASE_VERSION = '0.12.52';
const RELEASE = DATABASE_RELEASE_VERSION;
const MAX_BODY = 18 * 1024 * 1024;
const MAX_REPORT = 16 * 1024 * 1024;
const INLINE_BYTES = 100000;
const PAGE_MAX = 50;
const validId = id => /^[a-f0-9]{64}$/.test(id);
const isObj = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const text = value => typeof value === 'string' ? value : '';
const statuses = new Set(['available','unavailable','error','not_applicable','unknown']);
const sensitive = /^(?:imei|meid|imsi|android[ _-]?id|serial(?:number)?|mac(?:address)?|ip(?:address)?|password|token|access[ _-]?key|account(?:id)?|email|phone|latitude|longitude|location|advertising[ _-]?id|private[ _-]?path)$/i;
function hasSensitive(value, depth = 0) {
  if (depth > 32) return true;
  if (Array.isArray(value)) return value.some(v => hasSensitive(v,depth+1));
  if (isObj(value)) return Object.entries(value).some(([key,v]) => sensitive.test(key) || hasSensitive(v,depth+1));
  return false;
}
function stable(value, depth = 0) {
  if (depth > 32) throw new Error('Depth limit');
  if (Array.isArray(value)) return '['+value.map(v => stable(v,depth+1)).join(',')+']';
  if (isObj(value)) return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stable(value[k],depth+1)).join(',')+'}';
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  throw new Error('Unserializable value');
}
const utf8 = value => new TextEncoder().encode(value).byteLength;
async function digest(value) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
function hasExactly(value, keys) {
  return isObj(value) && Object.keys(value).length===keys.length && keys.every(key=>own(value,key));
}
function validCapability(row) {
  return isObj(row) && hasExactly(row,['name','value','status','code']) && typeof row.name==='string' && row.name.length>0 && row.name.length<=110 && typeof row.value==='string' && row.value.length<=131200 && statuses.has(row.status) && Number.isInteger(row.code) && row.code>=-1000000 && row.code<=1000000 && (row.status==='available' ? row.code===0 : row.value==='');
}
function validatesProperties(rows, keys) {
  if (!Array.isArray(rows) || rows.length!==keys.size) return false;
  const names = new Set();
  for (const row of rows) {
    if (!validCapability(row) || !keys.has(row.name) || names.has(row.name)) return false;
    names.add(row.name);
  }
  return true;
}
function validateExtensions(value) {
  return Array.isArray(value) && value.length<=4096 && value.every(v=>typeof v==='string' && /^[A-Za-z0-9_.+-]{1,160}$/.test(v)) && new Set(value).size===value.length;
}
function validImageGroups(groups) {
  if (!Array.isArray(groups) || groups.length>24) return false;
  const unique=new Set();
  for (const group of groups) {
    if (!hasExactly(group,['imageType','flags','status','code','formats']) || typeof group.imageType!=='string' || typeof group.flags!=='string' || group.imageType.length>80 || group.flags.length>80 || !statuses.has(group.status) || !Number.isInteger(group.code) || !Array.isArray(group.formats) || group.formats.length>1024) return false;
    const key=group.imageType+'|'+group.flags;
    if (unique.has(key)) return false;
    unique.add(key);
    if (group.status!=='available' && group.formats.length!==0) return false;
    if (group.status==='available' && group.code!==0) return false;
    if (!group.formats.every(f=>hasExactly(f,['order','dataType','orderValue','typeValue']) && typeof f.order==='string' && typeof f.dataType==='string' && f.order.length<=80 && f.dataType.length<=80 && Number.isSafeInteger(f.orderValue) && f.orderValue>=0 && Number.isSafeInteger(f.typeValue) && f.typeValue>=0)) return false;
  }
  return true;
}
function validReport(t, producerVersion) {
  const platformKeys = (producerVersion === '0.8.0' || producerVersion === '0.8.1' || producerVersion === '0.9.0' || producerVersion === '0.10.0' || producerVersion === '0.10.1' || producerVersion === '0.10.2' || producerVersion === '0.10.3' || producerVersion === '0.11.0' || producerVersion === '0.11.1' || producerVersion === '0.12.0' || producerVersion === '0.12.1' || producerVersion === '0.12.2' || producerVersion === '0.12.3' || producerVersion === '0.12.4' || producerVersion === '0.12.5' || producerVersion === '0.12.6' || producerVersion === '0.12.7' || producerVersion === '0.12.8' || producerVersion === '0.12.9' || producerVersion === '0.12.10' || producerVersion === '0.30.0' || producerVersion === '0.30.1' || producerVersion === '0.30.2' || producerVersion === '0.30.3' || producerVersion === '0.30.4' || producerVersion === '0.30.5' || producerVersion === '0.30.6' || producerVersion === '0.30.7' || producerVersion === '0.30.8' || producerVersion === '0.30.9' || producerVersion === '0.30.10' || producerVersion === '0.30.11' || producerVersion === '0.30.12' || producerVersion === '0.30.13' || producerVersion === '0.30.14' || producerVersion === '0.30.15' || producerVersion === '0.30.16' || producerVersion === '0.30.17' || producerVersion === '0.30.18' || producerVersion === '0.30.19' || producerVersion === '0.30.20' || producerVersion === '0.30.21' || producerVersion === '0.30.22' || producerVersion === '0.30.23' || producerVersion === '0.30.24' || producerVersion === '0.30.25' || producerVersion === '0.30.26' || producerVersion === '0.30.27' || producerVersion === '0.30.28' || producerVersion === '0.30.29' || producerVersion === '1.0.0' || producerVersion === '1.0.1' || producerVersion === '1.0.2' || producerVersion === '1.0.3' || producerVersion === '1.0.4' || producerVersion === '1.0.5' || producerVersion === '1.0.6' || producerVersion === '1.0.7' || producerVersion === '1.0.8' || producerVersion === '1.0.9' || producerVersion === '1.0.10' || producerVersion === '1.0.11' || producerVersion === '1.0.12' || producerVersion === '1.0.13' || producerVersion === '1.0.14') ? PLATFORM_KEYS : LEGACY_PLATFORM_KEYS;
  const deviceKeys = (producerVersion === '0.8.0' || producerVersion === '0.8.1' || producerVersion === '0.9.0' || producerVersion === '0.10.0' || producerVersion === '0.10.1' || producerVersion === '0.10.2' || producerVersion === '0.10.3' || producerVersion === '0.11.0' || producerVersion === '0.11.1' || producerVersion === '0.12.0' || producerVersion === '0.12.1' || producerVersion === '0.12.2' || producerVersion === '0.12.3' || producerVersion === '0.12.4' || producerVersion === '0.12.5' || producerVersion === '0.12.6' || producerVersion === '0.12.7' || producerVersion === '0.12.8' || producerVersion === '0.12.9' || producerVersion === '0.12.10' || producerVersion === '0.30.0' || producerVersion === '0.30.1' || producerVersion === '0.30.2' || producerVersion === '0.30.3' || producerVersion === '0.30.4' || producerVersion === '0.30.5' || producerVersion === '0.30.6' || producerVersion === '0.30.7' || producerVersion === '0.30.8' || producerVersion === '0.30.9' || producerVersion === '0.30.10' || producerVersion === '0.30.11' || producerVersion === '0.30.12' || producerVersion === '0.30.13' || producerVersion === '0.30.14' || producerVersion === '0.30.15' || producerVersion === '0.30.16' || producerVersion === '0.30.17' || producerVersion === '0.30.18' || producerVersion === '0.30.19' || producerVersion === '0.30.20' || producerVersion === '0.30.21' || producerVersion === '0.30.22' || producerVersion === '0.30.23' || producerVersion === '0.30.24' || producerVersion === '0.30.25' || producerVersion === '0.30.26' || producerVersion === '0.30.27' || producerVersion === '0.30.28' || producerVersion === '0.30.29' || producerVersion === '1.0.0' || producerVersion === '1.0.1' || producerVersion === '1.0.2' || producerVersion === '1.0.3' || producerVersion === '1.0.4' || producerVersion === '1.0.5' || producerVersion === '1.0.6' || producerVersion === '1.0.7' || producerVersion === '1.0.8' || producerVersion === '1.0.9' || producerVersion === '1.0.10' || producerVersion === '1.0.11' || producerVersion === '1.0.12' || producerVersion === '1.0.13' || producerVersion === '1.0.14') ? DEVICE_KEYS : LEGACY_DEVICE_KEYS;
  if (!hasExactly(t,['schema','appVersion','collectedAtEpochMs','status','message','loader','errorCode','durationMs','platforms'])) return false;
  if (t.schema!==1 || t.appVersion!==producerVersion || t.status!=='ok' || !Number.isSafeInteger(t.collectedAtEpochMs) || t.collectedAtEpochMs<=0 || !Number.isInteger(t.durationMs) || t.durationMs<0 || t.durationMs>3600000 || t.errorCode!==0 || typeof t.message!=='string' || t.message.length>512 || typeof t.loader!=='string' || t.loader.length>512 || !Array.isArray(t.platforms) || t.platforms.length<1 || t.platforms.length>64) return false;
  let total=0;
  for (let p=0;p<t.platforms.length;p++) {
    const platform=t.platforms[p];
    if (!hasExactly(platform,['index','name','vendor','version','profile','extensions','properties','devices','deviceEnumerationStatus','deviceEnumerationCode'])) return false;
    if (platform.index!==p || !['name','vendor','version','profile'].every(key=>typeof platform[key]==='string' && platform[key].length<=1024) || !platform.name || !platform.version || !validateExtensions(platform.extensions) || !validatesProperties(platform.properties,platformKeys)) return false;
    if (!Array.isArray(platform.devices) || platform.devices.length>64 || !['available','no_devices'].includes(platform.deviceEnumerationStatus) || !Number.isInteger(platform.deviceEnumerationCode) || (platform.deviceEnumerationStatus==='available' ? platform.deviceEnumerationCode!==0 : (platform.deviceEnumerationCode!==-1 || platform.devices.length!==0))) return false;
    for (let d=0;d<platform.devices.length;d++) {
      const device=platform.devices[d];
      if (!hasExactly(device,['index','name','vendor','version','driverVersion','profile','type','extensions','properties','imageFormats'])) return false;
      if (device.index!==d || !['name','vendor','version','driverVersion','profile','type'].every(key=>typeof device[key]==='string' && device[key].length<=1024) || !device.name || !device.version || !device.driverVersion || !validateExtensions(device.extensions) || !validatesProperties(device.properties,deviceKeys) || !validImageGroups(device.imageFormats)) return false;
      total++;
    }
  }
  return total>0 && total<=64;
}
export function validateSubmission(p) {
  if (!hasExactly(p,['schemaVersion','application','device','collection','registrySha256','technicalReport']) || p.schemaVersion!==1 || p.registrySha256!==REGISTRY_SHA256 || hasSensitive(p)) return {ok:false,reason:'envelope'};
  if (!hasExactly(p.application,['name','packageName','versionName','versionCode']) || p.application.name!=='OpenCLScope' || p.application.packageName!=='com.efishell.openclscope' || !((p.application.versionName==='0.2.0' && p.application.versionCode===200) || (p.application.versionName==='0.3.0' && p.application.versionCode===300) || (p.application.versionName==='0.4.0' && p.application.versionCode===400) || (p.application.versionName==='0.5.0' && p.application.versionCode===500) || (p.application.versionName==='0.6.0' && p.application.versionCode===600) || (p.application.versionName==='0.6.1' && p.application.versionCode===601) || (p.application.versionName==='0.7.0' && p.application.versionCode===700) || (p.application.versionName==='0.8.0' && p.application.versionCode===800) || (p.application.versionName==='0.8.1' && p.application.versionCode===801) || (p.application.versionName==='0.9.0' && p.application.versionCode===900) || (p.application.versionName==='0.10.0' && p.application.versionCode===1000) || (p.application.versionName==='0.10.1' && p.application.versionCode===1001) || (p.application.versionName==='0.10.2' && p.application.versionCode===1002) || (p.application.versionName==='0.10.3' && p.application.versionCode===1003) || (p.application.versionName==='0.11.0' && p.application.versionCode===1100) || (p.application.versionName==='0.11.1' && p.application.versionCode===1101) || (p.application.versionName==='0.12.0' && p.application.versionCode===1200) || (p.application.versionName==='0.12.1' && p.application.versionCode===1201) || (p.application.versionName==='0.12.2' && p.application.versionCode===1202) || (p.application.versionName==='0.12.3' && p.application.versionCode===1203) || (p.application.versionName==='0.12.4' && p.application.versionCode===1204) || (p.application.versionName==='0.12.5' && p.application.versionCode===1205) || (p.application.versionName==='0.12.6' && p.application.versionCode===1206) || (p.application.versionName==='0.12.7' && p.application.versionCode===1207) || (p.application.versionName==='0.12.8' && p.application.versionCode===1208) || (p.application.versionName==='0.12.9' && p.application.versionCode===1209) || (p.application.versionName==='0.12.10' && p.application.versionCode===1210) || (p.application.versionName==='0.30.0' && p.application.versionCode===3000) || (p.application.versionName==='0.30.1' && p.application.versionCode===3001) || (p.application.versionName==='0.30.2' && p.application.versionCode===3002) || (p.application.versionName==='0.30.3' && p.application.versionCode===3003) || (p.application.versionName==='0.30.4' && p.application.versionCode===3004) || (p.application.versionName==='0.30.5' && p.application.versionCode===3005) || (p.application.versionName==='0.30.6' && p.application.versionCode===3006) || (p.application.versionName==='0.30.7' && p.application.versionCode===3007) || (p.application.versionName==='0.30.8' && p.application.versionCode===3008) || (p.application.versionName==='0.30.9' && p.application.versionCode===3009) || (p.application.versionName==='0.30.10' && p.application.versionCode===3010) || (p.application.versionName==='0.30.11' && p.application.versionCode===3011) || (p.application.versionName==='0.30.12' && p.application.versionCode===3012) || (p.application.versionName==='0.30.13' && p.application.versionCode===3013) || (p.application.versionName==='0.30.14' && p.application.versionCode===3014) || (p.application.versionName==='0.30.15' && p.application.versionCode===3015) || (p.application.versionName==='0.30.16' && p.application.versionCode===3016) || (p.application.versionName==='0.30.17' && p.application.versionCode===3017) || (p.application.versionName==='0.30.18' && p.application.versionCode===3018) || (p.application.versionName==='0.30.19' && p.application.versionCode===3019) || (p.application.versionName==='0.30.20' && p.application.versionCode===3020) || (p.application.versionName==='0.30.21' && p.application.versionCode===3021) || (p.application.versionName==='0.30.22' && p.application.versionCode===3022) || (p.application.versionName==='0.30.23' && p.application.versionCode===3023) || (p.application.versionName==='0.30.24' && p.application.versionCode===3024) || (p.application.versionName==='0.30.25' && p.application.versionCode===3025) || (p.application.versionName==='0.30.26' && p.application.versionCode===3026) || (p.application.versionName==='0.30.27' && p.application.versionCode===3027) || (p.application.versionName==='0.30.28' && p.application.versionCode===3028) || (p.application.versionName==='0.30.29' && p.application.versionCode===3029) || (p.application.versionName==='1.0.0' && p.application.versionCode===10000) || (p.application.versionName==='1.0.1' && p.application.versionCode===10001) || (p.application.versionName==='1.0.2' && p.application.versionCode===10002) || (p.application.versionName==='1.0.3' && p.application.versionCode===10003) || (p.application.versionName==='1.0.4' && p.application.versionCode===10004) || (p.application.versionName==='1.0.5' && p.application.versionCode===10005) || (p.application.versionName==='1.0.6' && p.application.versionCode===10006) || (p.application.versionName==='1.0.7' && p.application.versionCode===10007) || (p.application.versionName==='1.0.8' && p.application.versionCode===10008) || (p.application.versionName==='1.0.9' && p.application.versionCode===10009) || (p.application.versionName==='1.0.10' && p.application.versionCode===10010) || (p.application.versionName==='1.0.11' && p.application.versionCode===10011) || (p.application.versionName==='1.0.12' && p.application.versionCode===10012) || (p.application.versionName==='1.0.13' && p.application.versionCode===10013) || (p.application.versionName==='1.0.14' && p.application.versionCode===10014)) || !Number.isSafeInteger(p.application.versionCode)) return {ok:false,reason:'producer'};
  if (!hasExactly(p.device,['manufacturer','model','androidApi']) || !['manufacturer','model'].every(key=>typeof p.device[key]==='string' && p.device[key].length<=120) || !Number.isInteger(p.device.androidApi) || p.device.androidApi<31 || p.device.androidApi>200) return {ok:false,reason:'device'};
  if (!hasExactly(p.collection,['status','source']) || p.collection.status!=='complete' || p.collection.source!=='live') return {ok:false,reason:'collection'};
  if (!validReport(p.technicalReport,p.application.versionName)) return {ok:false,reason:'technical_report'};
  return {ok:true,reason:'ok'};
}
function cors(origin, allowed) {
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','vary':'Origin','access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'Content-Type'};
  if (origin && allowed && origin===allowed) headers['access-control-allow-origin']=origin;
  return headers;
}
const response = (body,status,origin,allowed,extra={})=>new Response(JSON.stringify(body),{status,headers:{...cors(origin,allowed),...extra}});
async function readBody(request) {
  const declared=Number(request.headers.get('content-length')||0);
  if (declared>MAX_BODY) throw Object.assign(new Error('Request too large'),{status:413});
  if (!request.body) throw Object.assign(new Error('Empty request'),{status:400});
  const reader=request.body.getReader();
  const parts=[];let length=0;
  try {
    for (;;) {
      const {value,done}=await reader.read();if(done)break;
      length+=value.byteLength;
      if (length>MAX_BODY) throw Object.assign(new Error('Request too large'),{status:413});
      parts.push(value);
    }
  } finally {reader.releaseLock()}
  const bytes=new Uint8Array(length);let offset=0;
  for (const part of parts) {bytes.set(part,offset);offset+=part.byteLength}
  try {return new TextDecoder('utf-8',{fatal:true}).decode(bytes)} catch {throw Object.assign(new Error('Invalid UTF-8'),{status:400})}
}
function split(value) {
  const pieces=[];
  for(let i=0;i<value.length;) {
    let end=Math.min(i+48000,value.length);
    const last=value.charCodeAt(end-1);
    if (end<value.length && last>=0xD800 && last<=0xDBFF) end--;
    pieces.push(value.slice(i,end));i=end;
  }
  return pieces;
}
async function loadPayload(db,row) {
  if (!row.payload_json.startsWith('@chunks:')) return row.payload_json;
  const count=Number(row.payload_json.slice(8));
  if (!Number.isInteger(count)||count<1||count>400) throw Error('Invalid stored chunk manifest');
  const {results}=await db.prepare('SELECT chunk_index,payload_chunk FROM report_payload_chunks WHERE report_id=? ORDER BY chunk_index').bind(row.id).all();
  if (results.length!==count || results.some((c,i)=>c.chunk_index!==i)) throw Error('Incomplete report payload');
  return results.map(c=>c.payload_chunk).join('');
}
const pageQuery='SELECT id,submitted_at,schema_version,device_name,vendor,platform_name,opencl_version,driver_version,manufacturer,model,platform_count,device_count FROM reports';
const snapshotReady=env=>Boolean(env?.SNAPSHOT_GITHUB_TOKEN && env?.SNAPSHOT_GITHUB_OWNER && env?.SNAPSHOT_GITHUB_REPO && env?.SNAPSHOT_GITHUB_WORKFLOW && env?.SNAPSHOT_GITHUB_REF);
async function dispatchSnapshot(env,id,submittedAt) {
  if (!snapshotReady(env)) return;
  const {SNAPSHOT_GITHUB_TOKEN:token,SNAPSHOT_GITHUB_OWNER:owner,SNAPSHOT_GITHUB_REPO:repo,SNAPSHOT_GITHUB_WORKFLOW:workflow,SNAPSHOT_GITHUB_REF:ref}=env;
  const url=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`;
  const body=JSON.stringify({ref,inputs:{mode:'snapshot',report_id:id,submitted_at:submittedAt}});
  for(let attempt=0;attempt<3;attempt++) {
    try {
      const result=await fetch(url,{method:'POST',headers:{'content-type':'application/json','accept':'application/vnd.github+json','authorization':`Bearer ${token}`,'user-agent':'OpenCLScope-Database/0.12.7'},body});
      if(result.ok) return;
      if(result.status>=400 && result.status<500 && result.status!==429) throw Error('Snapshot dispatcher authorization failed');
    } catch(error) {if(attempt===2) throw error}
  }
  throw Error('Snapshot dispatcher failed');
}
export default {
  async fetch(request,env,ctx) {
    const origin=request.headers.get('origin')||'',allowed=text(env.ALLOWED_ORIGIN).trim();
    if(origin && (!allowed || origin!==allowed)) return response({error:'Origin forbidden'},403,'',allowed);
    const url=new URL(request.url),method=request.method;
    if(method==='OPTIONS') return new Response(null,{status:204,headers:cors(origin,allowed)});
    try {
      if(url.pathname==='/v1/health'&&method==='GET') return response({status:'ok',databaseReleaseVersion:RELEASE,schemaVersion:1,minimumProducer:'OpenCLScope 0.2.0',snapshotAutomation:{configured:snapshotReady(env)}},200,origin,allowed);
      if(url.pathname==='/v1/sync'&&method==='GET') {
        const count=await env.DB.prepare('SELECT COUNT(*) AS total FROM reports').first();
        const latest=await env.DB.prepare('SELECT id,submitted_at FROM reports ORDER BY submitted_at DESC,id DESC LIMIT 1').first();
        return response({reportCount:count?.total||0,latestReportId:latest?.id||'',latestSubmittedAt:latest?.submitted_at||'',syncToken:`${count?.total||0}:${latest?.submitted_at||''}:${latest?.id||''}`},200,origin,allowed);
      }
      if(url.pathname==='/v1/reports'&&method==='GET') {
        const limitRaw=url.searchParams.get('limit')??'50';
        if(!/^\d{1,2}$/.test(limitRaw)||Number(limitRaw)<1) return response({error:'Invalid limit'},400,origin,allowed);
        const limit=Math.min(Number(limitRaw),PAGE_MAX),before=url.searchParams.get('beforeSubmittedAt'),id=url.searchParams.get('beforeId');
        if(Boolean(before)!==Boolean(id) || (before&&(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(before)||!validId(id)))) return response({error:'Invalid cursor'},400,origin,allowed);
        const query=before ? env.DB.prepare(`${pageQuery} WHERE submitted_at<? OR (submitted_at=? AND id<?) ORDER BY submitted_at DESC,id DESC LIMIT ?`).bind(before,before,id,limit) : env.DB.prepare(`${pageQuery} ORDER BY submitted_at DESC,id DESC LIMIT ?`).bind(limit);
        const {results}=await query.all();const last=results.length===limit?results.at(-1):null;
        return response({databaseReleaseVersion:RELEASE,reports:results,nextCursor:last?{submittedAt:last.submitted_at,id:last.id}:null},200,origin,allowed);
      }
      if(url.pathname.startsWith('/v1/reports/')&&method==='GET') {
        const id=url.pathname.slice('/v1/reports/'.length);
        if(!validId(id))return response({error:'Invalid ID'},400,origin,allowed);
        const row=await env.DB.prepare('SELECT id,submitted_at,payload_json FROM reports WHERE id=?').bind(id).first();
        if(!row)return response({error:'Report not found'},404,origin,allowed);
        const canonical=await loadPayload(env.DB,row);
        if(await digest(canonical)!==id)return response({error:'Report integrity check failed'},500,origin,allowed);
        const value=JSON.parse(canonical);
        value.id=id;value.submittedAt=row.submitted_at;
        return response(value,200,origin,allowed);
      }
      if(url.pathname==='/v1/reports'&&method==='POST') {
        if((request.headers.get('content-type')||'').split(';')[0].trim().toLowerCase()!=='application/json') return response({error:'Content-Type must be application/json'},415,origin,allowed);
        let input;
        try {input=JSON.parse(await readBody(request))} catch(error) {return response({error:error.status===413?'Report exceeds size limit':error.status===400?'Invalid UTF-8 or empty body':'Invalid JSON'},error.status||400,origin,allowed)}
        const validation=validateSubmission(input);
        if(!validation.ok)return response({error:`Invalid OpenCLScope report [${validation.reason}]`},400,origin,allowed);
        let canonical;
        try {canonical=stable(input)} catch{return response({error:'Invalid report depth or value'},400,origin,allowed)}
        if(utf8(canonical)>MAX_REPORT)return response({error:'Report exceeds 16 MiB'},413,origin,allowed);
        const id=await digest(canonical),existing=await env.DB.prepare('SELECT submitted_at FROM reports WHERE id=?').bind(id).first();
        if(existing)return response({id,submittedAt:existing.submitted_at,status:'duplicate'},200,origin,allowed);
        const now=new Date().toISOString(),r=input.technicalReport;
        const primary=r.platforms.flatMap(p=>p.devices.map(d=>({p,d})))[0];
        const chunks=utf8(canonical)>INLINE_BYTES?split(canonical):[];
        const statement=env.DB.prepare('INSERT OR IGNORE INTO reports(id,submitted_at,schema_version,device_name,vendor,platform_name,opencl_version,driver_version,manufacturer,model,platform_count,device_count,payload_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,now,1,primary.d.name,primary.d.vendor,primary.p.name,primary.d.version,primary.d.driverVersion,input.device.manufacturer,input.device.model,r.platforms.length,r.platforms.reduce((sum,p)=>sum+p.devices.length,0),chunks.length?`@chunks:${chunks.length}`:canonical);
        const result=chunks.length ? await env.DB.batch([statement,...chunks.map((chunk,i)=>env.DB.prepare('INSERT OR IGNORE INTO report_payload_chunks(report_id,chunk_index,payload_chunk) VALUES(?,?,?)').bind(id,i,chunk))]) : [await statement.run()];
        const inserted=Number(result[0]?.meta?.changes||0)>0;
        const stored=await env.DB.prepare('SELECT submitted_at FROM reports WHERE id=?').bind(id).first();
        if(inserted && ctx?.waitUntil && snapshotReady(env))ctx.waitUntil(dispatchSnapshot(env,id,stored.submitted_at).catch(error=>console.error('Snapshot refresh failed',String(error))));
        return response({id,submittedAt:stored.submitted_at,status:inserted?'accepted':'duplicate'},inserted?201:200,origin,allowed);
      }
      if(['/v1/health','/v1/sync','/v1/reports'].includes(url.pathname)||url.pathname.startsWith('/v1/reports/')) return response({error:'Method not allowed'},405,origin,allowed,{'allow':url.pathname==='/v1/reports'?'GET, POST, OPTIONS':'GET, OPTIONS'});
      return response({error:'Not found'},404,origin,allowed);
    } catch(error) {console.error('OpenCLScope database request failed',String(error));return response({error:'Internal server error'},500,origin,allowed)}
  },
  async scheduled(_event,env) {
    if(!snapshotReady(env))return;
    const site=text(env.SNAPSHOT_PAGES_URL).trim();
    if(!site)return;
    const url=new URL(site);
    if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!/^https:\/\/[^\s]+$/.test(site))throw Error('Invalid snapshot Pages URL');
    const latest=await env.DB.prepare('SELECT id,submitted_at FROM reports ORDER BY submitted_at DESC,id DESC LIMIT 1').first();
    if(!latest)return;
    const count=await env.DB.prepare('SELECT COUNT(*) AS total FROM reports').first();
    let published=false;
    try {
      const indexUrl=new URL(`${url.pathname.replace(/\/$/,'')}/data/index.json`,url.origin);
      const response=await fetch(indexUrl,{redirect:'error',headers:{accept:'application/json','cache-control':'no-cache'},signal:AbortSignal.timeout(12000)});
      if(response.ok){
        const data=await response.json();
        published=data.schemaVersion===1&&data.reportCount===count.total&&Array.isArray(data.reports)&&data.reports.some(r=>r.id===latest.id);
      }
    }catch(error){console.error('Snapshot published-index check failed',String(error))}
    if(!published)await dispatchSnapshot(env,latest.id,latest.submitted_at);
  }
};
