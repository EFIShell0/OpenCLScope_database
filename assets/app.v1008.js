if(typeof window!=='undefined'&&window.__OPENCLSCOPE_COMPATIBLE__===false){throw new Error('Unsupported browser for OpenCLScope Database 3.0.14');}
'use strict';
const API = String(window.OPENCLSCOPE_DATABASE_API || '').trim().replace(/\/$/,'');
const PAGE = 25;
const $ = id=>document.getElementById(id);
const state = {rows:[],reports:new Map(),cursor:null,view:'reports',page:0,query:'',vendor:'',version:'',status:'',sort:'newest',detail:null,detailTab:'Overview',favorites:new Set(),favoritesOnly:false,device:'',driver:'',manufacturer:'',model:'',platform:'',submittedAge:'',remote:false,seen:new Set(),catalog:null,compareA:'',compareB:'',differencesOnly:true,syncBusy:false,syncToken:"",snapshotCount:0,pageSize:25,encyclopedia:null,encyclopediaCategory:'All',compareKind:'All',detailQuery:'',detailStatus:'',detailPage:0,detailPageSize:25,statisticsSliceLimit:8,statisticsExtensionScope:'both',statisticsNamespace:'all',statisticsMinimum:0,statisticsSearch:'',compareMinimized:false,compareSort:'evidence-asc',compareMobilePinnedExpanded:false};
const panes={reports:['REPORTS','Latest submissions','Complete, explicitly shared technical reports'],platforms:['PLATFORMS','OpenCL platforms','Platform-reported versions, vendors and extensions'],devices:['DEVICES','Compute devices','Device identity, driver and capability evidence'],features:['FEATURES','Features and support','Canonical OpenCL property states, never inferred'],memory:['MEMORY','Memory & limits','Runtime-reported memory and SVM properties'],formats:['IMAGE FORMATS','Image formats','Actual clGetSupportedImageFormats query results'],extensions:['EXTENSIONS','Extensions','Runtime-enumerated device and platform extension names'],profiles:['PROFILES','Profiles','Informational checklist, not certification'],compare:['COMPARE','Compare reports','Compare exact values and query states'],encyclopedia:['ENCYCLOPEDIA','OpenCL registry','Bundled Khronos cl.xml reference tokens, not runtime support evidence'],statistics:['STATISTICS','Report statistics','Report-backed device, API and query-state distributions (loaded detail evidence only)']};
function safeStorageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function safeStorageSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function text(value){return value===null||value===undefined?'':String(value)}
function node(tag,attrs={},...children){const isSvg=['svg','path','circle','rect','title','line','polyline','polygon','ellipse','g','defs','clipPath'].includes(tag);const e=isSvg?document.createElementNS('http://www.w3.org/2000/svg',tag):document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='class'){if(isSvg)e.setAttribute('class',v);else e.className=v;}else if(k==='title')e.title=v;else if(k==='disabled')e.disabled=!!v;else if(k==='value')e.value=v;else if(k.startsWith('aria-'))e.setAttribute(k,v);else if(k==='onclick')e.addEventListener('click',v);else if(k==='onchange')e.addEventListener('change',v);else if(k==='oninput')e.addEventListener('input',v);else if(k==='dataset')for(const [name,value] of Object.entries(v))e.dataset[name]=value;else e.setAttribute(k,v)}for(const child of children.flat()){if(child instanceof Node)e.append(child);else if(child!==null&&child!==undefined)e.append(document.createTextNode(String(child)))}return e}
function empty(){return node('div',{class:'no-result'},'No matching report-backed data. Missing query results are not treated as unsupported.')}
function tag(status){const key=['available','supported','unavailable','error','unsupported','unknown','not_applicable'].includes(status)?status:'unknown';return node('span',{class:`status-tag ${key}`},status==='not_applicable'?'NOT APPLICABLE':key.toUpperCase())}
function card(title,rows=[],subtitle='',badge=''){const box=node('article',{class:'tech-card'},node('h3',{},title));if(subtitle)box.append(node('p',{},subtitle));if(badge)box.append(tag(badge));const dl=node('dl',{class:'tech-values'});for(const [key,value,status] of rows){const dd=node('dd',{},status&&status!=='available'?tag(status):node('code',{},text(value)));dl.append(node('div',{class:'tech-row'},node('dt',{},key),dd))}if(rows.length)box.append(dl);return box}
function notice(message){$('status').textContent=message}
function banner(message,kind=''){const b=$('networkBanner');b.hidden=!message;b.dataset.kind=kind;$('networkStatusTitle').textContent=kind==='warning'?'Connection notice':'Network status';$('networkStatusMessage').textContent=message||'';$('networkStatusBadge').textContent=kind==='warning'?'OFFLINE / CACHE':'ONLINE'}
function versionTuple(v){return (text(v).match(/\d+/g)||[]).map(Number)}
function compareVersions(a,b){const x=versionTuple(a),y=versionTuple(b);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d}return 0}
function vendorLogo(v){const t=text(v).toLowerCase();const logos=[['qualcomm','qualcomm'],['adreno','qualcomm'],['imagination','imagination'],['powervr','imagination'],['nvidia','nvidia'],['amd','amd'],['advanced micro','amd'],['intel','intel'],['samsung','samsung'],['broadcom','broadcom'],['vivante','vivante'],['verisilicon','vsi'],['huawei','huawei'],['hisilicon','huawei']];if(t==='arm'||t.startsWith('arm ')||t.includes('arm limited'))return'assets/gpu-vendors/gpu_vendor_arm.png';const found=logos.find(([name])=>t.includes(name));return`assets/gpu-vendors/gpu_vendor_${found?found[1]:'unknown'}.png`}
function reportRow(r){const model=text(r.model||'Unreported model');const vendor=regional.vendor?text(r.vendor||'Unknown vendor')+' · ':'';
 const info=node('div',{},node('h3',{},r.device_name||'Unreported device'),node('p',{},vendor+model),node('p',{class:'id'},r.id));
 if(regional.deviceType&&r.device_type)info.append(node('p',{},'OpenCL device type: '+r.device_type));
 const submission=node('div',{class:'report-extra'},node('strong',{},r.platform_name||'Unknown platform'));
 if(regional.submitted)submission.append(node('p',{},humanDate(r.submitted_at)));
 submission.append(node('p',{},`${r.platform_count} platform(s) · ${r.device_count} device(s)`));
 return node('article',{class:'report-row'},node('img',{src:vendorLogo(r.vendor),alt:`${r.vendor||'Unknown vendor'} logo`,loading:'lazy'}),info,node('div',{class:'report-extra'},node('strong',{},r.opencl_version||'Unknown OpenCL'),node('p',{},r.driver_version||'Unknown driver')),submission,node('button',{onclick:()=>openReport(r.id)},'View report →'))}
function humanDate(iso){return formatReportDate(iso)}
function summary(report){const t=report?.technicalReport;if(!t||!Array.isArray(t.platforms))return null;const primary=t.platforms.flatMap(p=>p.devices.map(d=>({p,d})))[0];return {id:report.id,submitted_at:report.submittedAt,schema_version:1,device_name:primary?.d?.name||'',device_type:primary?.d?.type||'',vendor:primary?.d?.vendor||'',platform_name:primary?.p?.name||'',opencl_version:primary?.d?.version||'',driver_version:primary?.d?.driverVersion||'',app_version:report?.application?.versionName||'',manufacturer:report?.device?.manufacturer||'',model:report?.device?.model||'',platform_count:t.platforms.length,device_count:t.platforms.reduce((n,p)=>n+p.devices.length,0)}}
function addRows(rows){for(const raw of rows||[]){const r=raw?.technicalReport?summary(raw):raw;if(!r||!/^[a-f0-9]{64}$/.test(text(r.id)))continue;if(!state.seen.has(r.id)){state.rows.push(r);state.seen.add(r.id)}if(raw.technicalReport)state.reports.set(r.id,raw)}state.rows.sort((a,b)=>(b.submitted_at||'').localeCompare(a.submitted_at||'')||b.id.localeCompare(a.id));populateFilters();metrics()}
function populateFilters(){for(const [id,key,label] of [['vendorFilter','vendor','All vendors'],['versionFilter','opencl_version','All versions'],['deviceFilter','device_name','All devices'],['driverFilter','driver_version','All drivers'],['manufacturerFilter','manufacturer','All manufacturers'],['modelFilter','model','All Android models'],['platformFilter','platform_name','All platforms']]){const select=$(id),current=select.value;select.replaceChildren(node('option',{value:''},label));const names=[...new Set(state.rows.map(r=>text(r[key])).filter(Boolean))].sort(key==='opencl_version'?compareVersions:(a,b)=>a.localeCompare(b));for(const value of names)select.append(node('option',{value},value));select.value=names.includes(current)?current:'';if(select.closest('.custom-select'))refreshCustomSelect(select)}}
function metrics(){const count=state.rows.length,full=state.reports.size,devices=[...state.reports.values()].reduce((n,r)=>n+(r.technicalReport.platforms||[]).reduce((k,p)=>k+p.devices.length,0),0),platforms=[...state.reports.values()].reduce((n,r)=>n+r.technicalReport.platforms.length,0);const metrics=[['Indexed reports',count],['Fully loaded reports',full],['Enumerated platforms',platforms],['Enumerated devices',devices],['Registry query tokens',state.catalog?(state.catalog.platformQueries.length+state.catalog.deviceQueries.length):'—']];$('metrics').replaceChildren(...metrics.map(([title,value])=>node('div',{class:'metric-tile'},node('small',{},title),node('strong',{},value))))}
function filteredRows(){let rows=state.rows.filter(r=>!state.favoritesOnly||state.favorites.has(r.id)).filter(r=>!state.vendor||r.vendor===state.vendor).filter(r=>!state.version||r.opencl_version===state.version).filter(r=>!state.device||r.device_name===state.device).filter(r=>!state.driver||r.driver_version===state.driver).filter(r=>!state.manufacturer||r.manufacturer===state.manufacturer).filter(r=>!state.model||r.model===state.model).filter(r=>!state.platform||r.platform_name===state.platform).filter(r=>{if(!state.submittedAge)return true;const date=Date.parse(r.submitted_at||'');return Number.isFinite(date)&&date<=Date.now()&&date>=Date.now()-Number(state.submittedAge)*86400000});const query=state.query.toLowerCase().trim();if(query)rows=rows.filter(r=>[r.id,r.device_name,r.vendor,r.platform_name,r.opencl_version,r.driver_version,r.manufacturer,r.model,r.app_version].some(v=>text(v).toLowerCase().includes(query)));if(state.sort==='oldest')rows=[...rows].sort((a,b)=>(a.submitted_at||'').localeCompare(b.submitted_at||'')||a.id.localeCompare(b.id));if(state.sort==='device')rows=[...rows].sort((a,b)=>text(a.device_name).localeCompare(text(b.device_name))||b.id.localeCompare(a.id));return rows}
function profiles(d){const checks=[['Device available','CL_DEVICE_AVAILABLE','true'],['Compiler available','CL_DEVICE_COMPILER_AVAILABLE','true'],['Compute units present','CL_DEVICE_MAX_COMPUTE_UNITS','positive'],['Image support','CL_DEVICE_IMAGE_SUPPORT','true'],['Linker available','CL_DEVICE_LINKER_AVAILABLE','true'],['Sub-group forward progress','CL_DEVICE_SUB_GROUP_INDEPENDENT_FORWARD_PROGRESS','true'],['Non-uniform work-groups','CL_DEVICE_NON_UNIFORM_WORK_GROUP_SUPPORT','true'],['Work-group collectives','CL_DEVICE_WORK_GROUP_COLLECTIVE_FUNCTIONS_SUPPORT','true'],['SVM capability bits','CL_DEVICE_SVM_CAPABILITIES','positive']];return checks.map(([label,key,expected])=>{const p=d.properties.find(row=>row.name===key);const v=p?.status==='available'?p.value:null;const num=v===null?null: v.startsWith('0x')?Number.parseInt(v.slice(2),16):Number(v);const result=v===null?'unknown':expected==='true'?(v==='true'?'supported':'unsupported'):(Number.isFinite(num)?(num>0?'supported':'unsupported'):'unknown');return {label,key,value:v,result}})}
function recordEntries(kind){const entries=[];const eligible=new Set(filteredRows().map(r=>r.id));for(const [id,r]of state.reports){if(!eligible.has(id))continue;const t=r.technicalReport;for(const p of t.platforms){const pd=`${p.name||'Platform'} · ${id.slice(0,10)}`;if(kind==='platforms')entries.push({title:p.name,subtitle:pd,fields:[['Vendor',p.vendor],['Version',p.version],['Profile',p.profile],['Extensions',p.extensions.length],['Devices',p.devices.length],['Enumeration',p.deviceEnumerationStatus]]});if(kind==='extensions')for(const ext of p.extensions)entries.push({title:ext,subtitle:`Platform · ${pd}`,fields:[['Scope','platform'],['Raw name',ext]]});for(const d of p.devices){const dd=`${d.name} · ${pd}`;if(kind==='devices')entries.push({title:d.name,subtitle:pd,fields:[['Vendor',d.vendor],['Type',d.type],['OpenCL version',d.version],['Driver',d.driverVersion],['Profile',d.profile],['Properties',d.properties.length],['Extensions',d.extensions.length]]});if(kind==='extensions')for(const ext of d.extensions)entries.push({title:ext,subtitle:`Device · ${dd}`,fields:[['Scope','device'],['Raw name',ext]]});if(kind==='profiles'){const checks=profiles(d);entries.push({title:d.name,subtitle:pd,fields:[['Met',checks.filter(c=>c.result==='supported').length],['Unmet',checks.filter(c=>c.result==='unsupported').length],['Unknown',checks.filter(c=>c.result==='unknown').length],...checks.map(c=>[c.label,c.value||'Not available',c.result])]})}if(kind==='formats')for(const g of d.imageFormats)entries.push({title:g.imageType,subtitle:`${g.flags} · ${dd}`,state:g.status,fields:[['Image type',g.imageType],['Access',g.flags],['OpenCL code',g.code],['Format pairs',g.formats.length],...g.formats.map((f,i)=>[`Pair ${i+1}`,`${f.order} / ${f.dataType}`])]});if(['features','memory'].includes(kind))for(const prop of d.properties){if(kind==='features'&&!/(SUPPORT|CAPABILITIES|AVAILABLE|FP_CONFIG|VERSION)/.test(prop.name))continue;if(kind==='memory'&&!/(MEM|CACHE|ALLOC|SVM)/.test(prop.name))continue;entries.push({title:prop.name,subtitle:dd,state:prop.status,fields:[['Exact name',prop.name],['Value',prop.value||'(none)',prop.status],['OpenCL code',prop.code]]})}}}}return entries}

function technicalEvidenceTable(entries){
 const head=node('thead',{},node('tr',{},...['OpenCL™ capability','Reported device / platform','State','Reported values'].map(v=>node('th',{scope:'col'},v))));
 const body=node('tbody',{},...entries.map(e=>{
  const details=node('details',{class:'evidence-details'},node('summary',{},`${e.fields.length} reported fields`),node('dl',{class:'evidence-fields'},...e.fields.map(pair=>node('div',{},node('dt',{},pair[0]),node('dd',{},pair[1])))));
  const row=node('tr',{class:'evidence-table-row'},node('td',{},node('strong',{},e.title)),node('td',{class:'evidence-subtitle'},e.subtitle),node('td',{},node('span',{class:'status-tag '+(e.state||'unknown')},e.state||'Recorded')),node('td',{},details));
  const data={name:e.title,baselineReported:false,targetReported:false,row:[e.title,e.subtitle,e.state||'Recorded',...e.fields.map(([k,v])=>`${k}: ${String(v??'')}`)].join('\n')};
  const more=node('button',{type:'button',class:'evidence-more','aria-label':'Evidence actions for '+e.title},'⋯');more.onclick=()=>evidenceQuickMenu(data,more);
  row.lastChild.append(more);bindEvidenceLongPress(row,data);return row;
 }));
 return node('div',{class:'table-wrap evidence-table-wrap'},node('table',{class:'evidence-table'},head,body));
}
function renderCards(entries){const query=state.query.toLowerCase().trim();let matched=entries.filter(e=>(!state.status||e.state===state.status)&&(!query||[e.title,e.subtitle,...e.fields.flat().map(text)].join(' ').toLowerCase().includes(query)));const total=matched.length;const pageCount=Math.max(1,Math.ceil(total/state.pageSize));state.page=Math.min(state.page,pageCount-1);matched=matched.slice(state.page*state.pageSize,(state.page+1)*state.pageSize);const grid=technicalEvidenceTable(matched);$('contentView').replaceChildren(total?grid:empty());pager(total)}
function pager(total,remote=true){const count=Math.max(1,Math.ceil(total/state.pageSize));$('pageCounter').textContent=`/ ${count} · ${total} entries`;const number=$('pageNumber');if(document.activeElement!==number){number.value=String(Math.min(state.page+1,count));}number.max=String(count);number.dataset.total=String(total);number.disabled=count<=1;$('previousPage').disabled=state.page===0;$('nextPage').disabled=state.page>=count-1;$('pager').hidden=false;$('fetchNext').hidden=!remote||!API||!state.cursor}
function setFavoriteFilterLabel(){const b=$('favoritesButton');if(!b)return;b.replaceChildren(databaseSvgIcon('profiles'),node('span',{},state.favoritesOnly?'Favorites only':'Favorites'))}
let activeReportMenu=null;
function closeReportMenu(){if(!activeReportMenu)return;const info=activeReportMenu;activeReportMenu=null;info.panel.remove();document.removeEventListener('pointerdown',info.outside,true);document.removeEventListener('keydown',info.keyboard,true);document.removeEventListener('wheel',info.scroll,true);document.removeEventListener('touchmove',info.scroll,true);if(info.restore?.isConnected)info.restore.focus({preventScroll:true})}
function reportQuickMenu(id,anchor){
 closeReportMenu();if(!validComparisonId(id))return;
 const restore=document.activeElement instanceof HTMLElement?document.activeElement:anchor;
 const panel=node('div',{class:'report-quick-menu',role:'menu','aria-label':'Report quick actions'});
 const action=(label,callback)=>{const b=node('button',{type:'button',role:'menuitem'},label);b.onclick=()=>{closeReportMenu();callback()};panel.append(b)};
 action('View report',()=>openReport(id));
 action(state.favorites.has(id)?'Remove favorite':'Add favorite',()=>{if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);saveFavoritePreferences();renderSettingsFavorites();render()});
 action('Copy report ID',async()=>{try{await navigator.clipboard.writeText(id);notice('Report ID copied.')}catch{notice('Clipboard unavailable.')}});
 action('Compare as baseline',()=>{state.compareA=id;state.view='compare';state.page=0;rememberCompareRoute();location.hash=compareRoute();render()});
 action('Compare as target',()=>{state.compareB=id;state.view='compare';state.page=0;rememberCompareRoute();location.hash=compareRoute();render()});
 document.body.append(panel);const rect=anchor?.getBoundingClientRect?.()||{left:12,bottom:80};const width=220;panel.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';panel.style.top=Math.max(8,Math.min(rect.bottom+4,window.innerHeight-panel.offsetHeight-8))+'px';
 const outside=e=>{if(!panel.contains(e.target))closeReportMenu()};const keyboard=e=>{if(e.key==='Escape'){e.preventDefault();closeReportMenu()}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const buttons=[...panel.querySelectorAll('button')];const i=buttons.indexOf(document.activeElement);buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus()}};const scroll=()=>closeReportMenu();
 activeReportMenu={panel,outside,keyboard,scroll,restore};document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',keyboard,true);document.addEventListener('wheel',scroll,{passive:true,capture:true});document.addEventListener('touchmove',scroll,{passive:true,capture:true});panel.querySelector('button')?.focus({preventScroll:true});
}
async function copyEvidenceText(value,label){
 try{await navigator.clipboard.writeText(String(value??''));notice(`${label} copied.`)}catch{notice('Clipboard unavailable. You can select the visible evidence.')}
}
function evidenceQuickMenu(data,anchor){
 closeReportMenu();
 const restore=document.activeElement instanceof HTMLElement?document.activeElement:anchor;
 const panel=node('div',{class:'report-quick-menu',role:'menu','aria-label':'Evidence quick actions'});
 const action=(label,value)=>{const button=node('button',{type:'button',role:'menuitem'},label);button.onclick=()=>{closeReportMenu();copyEvidenceText(value,label)};panel.append(button)};
 action('Copy evidence name',data.name);
 if(data.baselineReported)action('Copy baseline value',data.baseline);
 if(data.targetReported)action('Copy target value',data.target);
 action('Copy evidence row',data.row);
 document.body.append(panel);
 const rect=anchor.getBoundingClientRect(),width=220;
 panel.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';
 panel.style.top=Math.max(8,Math.min(rect.bottom+4,window.innerHeight-panel.offsetHeight-8))+'px';
 const outside=e=>{if(!panel.contains(e.target))closeReportMenu()};
 const keyboard=e=>{if(e.key==='Escape'){e.preventDefault();closeReportMenu()}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const buttons=[...panel.querySelectorAll('button')];const i=buttons.indexOf(document.activeElement);buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus()}};
 const scroll=()=>closeReportMenu();
 activeReportMenu={panel,outside,keyboard,scroll,restore};
 document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',keyboard,true);
 document.addEventListener('wheel',scroll,{passive:true,capture:true});document.addEventListener('touchmove',scroll,{passive:true,capture:true});
 panel.querySelector('button')?.focus({preventScroll:true});
}
function bindEvidenceLongPress(row,data){
 let timer=0,startX=0,startY=0,suppressClick=false;
 const cancel=()=>{if(timer)clearTimeout(timer);timer=0};
 row.addEventListener('contextmenu',e=>{if(e.target.closest('button,a,input,select,summary'))return;e.preventDefault();evidenceQuickMenu(data,row)});
 row.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.button!==0||e.target.closest('button,a,input,select,summary'))return;startX=e.clientX;startY=e.clientY;cancel();timer=setTimeout(()=>{timer=0;suppressClick=true;evidenceQuickMenu(data,row)},600)});
 row.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-startX)>9||Math.abs(e.clientY-startY)>9)cancel()});
 row.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false}},true);
 for(const event of ['pointerup','pointercancel','pointerleave'])row.addEventListener(event,cancel);
}
function bindReportLongPress(row,id){let timer=0,startX=0,startY=0;const cancel=()=>{if(timer)clearTimeout(timer);timer=0};row.addEventListener('contextmenu',e=>{if(e.target.closest('button,a,input,select'))return;e.preventDefault();reportQuickMenu(id,row)});row.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.button!==0||e.target.closest('button,a,input,select'))return;startX=e.clientX;startY=e.clientY;cancel();timer=setTimeout(()=>{timer=0;reportQuickMenu(id,row)},600)});row.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-startX)>9||Math.abs(e.clientY-startY)>9)cancel()});for(const event of ['pointerup','pointercancel','pointerleave'])row.addEventListener(event,cancel)}
function reportTableRow(r){
 const id=text(r.id),title=text(r.device_name||'Unreported device'),vendor=text(r.vendor||'Unreported vendor');
 const metadata=node('div',{class:'table-device'},node('img',{src:vendorLogo(r.vendor),alt:vendor+' logo',loading:'lazy'}),node('div',{},node('strong',{},title),node('small',{},vendor+' · '+text(r.model||'Unreported model'))));
 const date=node('span',{class:'table-datetime'},regional.submitted?humanDate(r.submitted_at):'Hidden in preferences');
 const favourite=node('button',{class:'table-favorite','aria-label':state.favorites.has(id)?'Remove favorite':'Add favorite',title:'Favorite',type:'button'},state.favorites.has(id)?'★':'☆');
 favourite.onclick=()=>{if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);saveFavoritePreferences();renderSettingsFavorites();render()};
 const open=node('button',{class:'table-open',type:'button','aria-label':'Open report '+id.slice(0,12)},databaseSvgIcon('reports','action-icon'),node('span',{},'View report'));open.onclick=()=>openReport(id);
 const reportId=node('button',{class:'table-report-id',title:id,'aria-label':'Copy report ID '+id,type:'button'},databaseSvgIcon('properties','action-icon'),node('span',{},id.slice(0,12)+'…'));
 reportId.onclick=async()=>{try{await navigator.clipboard.writeText(id);notice('Report ID copied.')}catch{notice('Clipboard unavailable. Select the ID in the report details.')}};
 const more=node('button',{class:'table-more','aria-label':'More actions for report '+id.slice(0,12),type:'button'},'⋯');more.onclick=()=>reportQuickMenu(id,more);const row=node('tr',{class:'report-table-row'},node('td',{class:'submitted-cell'},date),node('td',{},metadata),node('td',{},node('span',{class:'table-api'},text(r.opencl_version||'Unreported'))),node('td',{class:'table-driver'},text(r.driver_version||'Unreported')),node('td',{},text(r.platform_name||'Unreported')),node('td',{class:'table-report-id-cell'},reportId),node('td',{},node('div',{class:'table-row-actions'},favourite,open,more)));bindReportLongPress(row,id);return row;
}
function renderReports(){
 const rows=filteredRows();state.page=Math.min(state.page,Math.max(0,Math.ceil(rows.length/state.pageSize)-1));
 const visible=rows.slice(state.page*state.pageSize,(state.page+1)*state.pageSize);
 if(!visible.length){$('contentView').replaceChildren(empty());pager(rows.length);return}
 const head=node('thead',{},node('tr',{},...['Submitted','GPU / device','OpenCL™ API','Driver version','Platform','Report ID','Actions'].map(label=>node('th',{scope:'col'},label))));
 const table=node('table',{class:'reports-table opencl-reports-table'},head,node('tbody',{},...visible.map(reportTableRow)));
 $('contentView').replaceChildren(node('div',{class:'table-wrap reports-table-wrap'},table));pager(rows.length);
}
function semanticComparisonLeaves(report){
  const out=new Map(),identityCounts=new Map();
  const unique=key=>{const seen=identityCounts.get(key)||0;identityCounts.set(key,seen+1);return seen?`${key} [${seen+1}]`:key};
  const record=(key,value)=>out.set(key,value===null?'null':text(value));
  const props=(rows,key)=>{for(const q of rows||[])record(`${key} / ${q.name}`,`${q.status} · ${q.code} · ${q.value}`)};
  const extensions=(list,key)=>{for(const ext of new Set(list||[]))record(`${key} / ${ext}`,'Enumerated')};
  for(const p of report?.platforms||[]){
    const platform=unique(`Platform: ${p.name} · ${p.vendor}`);
    record(`${platform} / Version`,p.version);record(`${platform} / Profile`,p.profile);
    record(`${platform} / Device discovery`,`${p.deviceEnumerationStatus} · ${p.deviceEnumerationCode}`);
    props(p.properties,`${platform} / Property`);extensions(p.extensions,`${platform} / Extension`);
    for(const d of p.devices||[]){
      const device=unique(`${platform} / Device: ${d.name} · ${d.vendor} · ${d.type}`);
      for(const [name,value] of [['OpenCL version',d.version],['Driver',d.driverVersion],['Profile',d.profile]])record(`${device} / ${name}`,value);
      props(d.properties,`${device} / Property`);extensions(d.extensions,`${device} / Extension`);
      for(const g of d.imageFormats||[]){
        const group=`${device} / Image formats: ${g.imageType} · ${g.flags}`;
        record(`${group} / State`,`${g.status} · ${g.code}`);
        for(const format of g.formats||[])record(`${group} / ${format.order} · ${format.dataType}`,`${format.orderValue} · ${format.typeValue}`);
      }
    }
  }
  return out;
}
function validComparisonId(id){return /^[a-f0-9]{64}$/.test(text(id))}
function compareRoute(){return validComparisonId(state.compareA)&&validComparisonId(state.compareB)&&state.compareA!==state.compareB?`#compare/${state.compareA}/${state.compareB}`:'#compare'}
function rememberCompareRoute(){if(state.view!=='compare')return;try{history.replaceState(null,'',compareRoute())}catch{}}
function restoreCompareRoute(){const m=/^#compare\/([a-f0-9]{64})\/([a-f0-9]{64})$/.exec(location.hash);if(!m)return false;state.compareA=m[1];state.compareB=m[2];state.view='compare';state.page=0;return true}
function makeDownload(name,content,mime){const url=URL.createObjectURL(new Blob([content],{type:mime}));const link=node('a',{href:url,download:name});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function compareExportRecords(records,format){
 if(!validComparisonId(state.compareA)||!validComparisonId(state.compareB)||!state.reports.has(state.compareA)||!state.reports.has(state.compareB))return;
 const base={schema:'openclscope-comparison-v1',baselineReportId:state.compareA,targetReportId:state.compareB,filters:{category:state.compareKind,differencesOnly:state.differencesOnly,search:state.query,sort:state.compareSort},entries:records.map(r=>({name:r.key,category:r.category,change:r.status,baselineReported:r.hasA,targetReported:r.hasB,baseline:r.hasA?r.baseline:null,target:r.hasB?r.target:null}))};
 const filename=`OpenCLScope-Compare-${state.compareA.slice(0,12)}-${state.compareB.slice(0,12)}.${format}`;
 if(format==='json'){makeDownload(filename,JSON.stringify(base,null,2)+'\n','application/json;charset=utf-8');return}
 const line=row=>row.map(v=>String(v??'').replace(/\t/g,' ').replace(/\r?\n/g,' ')).join('\t');
 const data=[`OpenCLScope comparison | baseline ${state.compareA} | target ${state.compareB}`,`Category: ${state.compareKind} | Differences only: ${state.differencesOnly} | Search: ${state.query} | Sort: ${state.compareSort}`,'',line(['Canonical evidence','Category','Change','Baseline present','Target present','Baseline','Target']),...base.entries.map(e=>line([e.name,e.category,e.change,e.baselineReported,e.targetReported,e.baseline,e.target]))].join('\n')+'\n';
 makeDownload(filename,data,'text/plain;charset=utf-8');
}
function compareSelect(label,id,current,items){const control=node('select',{id});control.append(node('option',{value:''},'Select report'));for(const report of items)control.append(node('option',{value:report.id},`${report.device_name} · ${report.id.slice(0,12)}`));if(validComparisonId(current)&&!items.some(r=>r.id===current))control.append(node('option',{value:current},`Report ${current.slice(0,12)}… (not in loaded index)`));control.value=current;control.addEventListener('change',()=>{state[id]=control.value;state.page=0;rememberCompareRoute();renderCompare()});return node('label',{},label,control)}
function sortComparisonRecords(records,mode='evidence-asc'){
 const orders={Added:0,Removed:1,Changed:2,Unchanged:3};
 const collator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});
 const compareText=(a,b)=>collator.compare(String(a??''),String(b??''));
 const compare=(a,b)=>{
  switch(mode){
   case 'evidence-desc':return compareText(b.key,a.key);
   case 'change':return orders[a.status]-orders[b.status]||compareText(a.key,b.key);
   case 'category':return compareText(a.category,b.category)||compareText(a.key,b.key);
   case 'baseline':return Number(!a.hasA)-Number(!b.hasA)||compareText(a.baseline,b.baseline)||compareText(a.key,b.key);
   case 'target':return Number(!a.hasB)-Number(!b.hasB)||compareText(a.target,b.target)||compareText(a.key,b.key);
   default:return compareText(a.key,b.key);
  }
 };
 return [...records].sort(compare);
}
function compareCategory(key){if(key.includes(' / Image formats: '))return 'Image formats';if(key.includes(' / Extension / '))return 'Extensions';if(key.includes(' / Device: '))return 'Devices';return 'Platforms'}
let comparePinFrame=0;
function syncComparePinned(){
 const shell=$('compareStickyShell'),placeholder=$('compareStickyPlaceholder');
 if(!shell||!placeholder||state.view!=='compare'||state.detail){return}
 const box=placeholder.parentElement,rect=box.getBoundingClientRect(),mobile=window.matchMedia('(max-width:760px)').matches,top=mobile?60:70;
 const pin=rect.top<top&&rect.bottom>top+shell.offsetHeight+24;
 shell.classList.toggle('is-pinned',pin);
 if(!pin)state.compareMobilePinnedExpanded=false;
 const mobileAuto=pin&&mobile&&!state.compareMobilePinnedExpanded&&!state.compareMinimized;
 const stickyBody=shell.querySelector('#compareStickyBody'),toggle=shell.querySelector('.compare-minimize');
 if(stickyBody)stickyBody.hidden=state.compareMinimized||mobileAuto;
 shell.classList.toggle('mobile-pin-compact',mobileAuto);
 const collapsed=state.compareMinimized||mobileAuto;
 if(toggle){toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?'Expand comparison header':'Minimize comparison header');toggle.textContent=collapsed?'Expand controls ▾':'Minimize controls ▴'}
 if(pin){placeholder.style.height=shell.offsetHeight+'px';const x=box.getBoundingClientRect();shell.style.width=x.width+'px';shell.style.left='0px';shell.style.top='0px';const basis=shell.getBoundingClientRect();shell.style.left=(x.left-basis.left)+'px';shell.style.top=(top-basis.top)+'px'}
 else{placeholder.style.height='0';shell.style.removeProperty('left');shell.style.removeProperty('width');shell.style.removeProperty('top')}
}
function queueComparePinned(){if(comparePinFrame)return;comparePinFrame=requestAnimationFrame(()=>{comparePinFrame=0;syncComparePinned()})}
function renderCompare(){
 const items=state.rows;
 const head=node('div',{class:'compare-selector'},compareSelect('Baseline','compareA',state.compareA,items),compareSelect('Target','compareB',state.compareB,items));
 const swap=node('button',{class:'primary-action',type:'button',onclick:()=>{const a=state.compareA;state.compareA=state.compareB;state.compareB=a;state.page=0;rememberCompareRoute();renderCompare()}},'Swap reports');
 const toggle=node('label',{class:'compare-toggle'},node('input',{type:'checkbox',id:'diffToggle'}),' Differences only');
 toggle.firstChild.checked=state.differencesOnly;
 toggle.firstChild.addEventListener('change',e=>{state.differencesOnly=e.target.checked;state.page=0;renderCompare()});
 const kinds=['All','Platforms','Devices','Extensions','Image formats'];
 const type=node('select',{'aria-label':'Compare evidence category'},...kinds.map(k=>node('option',{value:k},k)));type.value=state.compareKind;
 type.onchange=()=>{state.compareKind=type.value;state.page=0;renderCompare()};
 const sort=node('select',{'aria-label':'Comparison result sorting'},...[
  ['evidence-asc','Evidence A–Z'],['evidence-desc','Evidence Z–A'],['change','Change type'],['category','Evidence category'],['baseline','Baseline value'],['target','Target value']
 ].map(([value,label])=>node('option',{value},label)));
 sort.value=state.compareSort;
 sort.onchange=()=>{state.compareSort=sort.value;state.page=0;renderCompare()};
 const tools=node('div',{class:'compare-toolbar'},node('label',{},'Category',type),node('label',{},'Sort results',sort),toggle,swap);
 const pinButton=node('button',{class:'primary-action compare-minimize',type:'button','aria-controls':'compareStickyBody','aria-expanded':String(!state.compareMinimized),'aria-label':state.compareMinimized?'Expand comparison header':'Minimize comparison header'},state.compareMinimized?'Expand controls ▾':'Minimize controls ▴');
 pinButton.onclick=()=>{const pinnedMobile=sticky.classList.contains('is-pinned')&&window.matchMedia('(max-width:760px)').matches;
  if(pinnedMobile&&!state.compareMinimized)state.compareMobilePinnedExpanded=!state.compareMobilePinnedExpanded;
  else{state.compareMinimized=!state.compareMinimized;state.compareMobilePinnedExpanded=false}
  sticky.classList.toggle('minimized',state.compareMinimized);
  queueComparePinned();syncComparePinned()};
 const share=node('button',{class:'primary-action',type:'button'},'Copy compare link');share.disabled=!(validComparisonId(state.compareA)&&validComparisonId(state.compareB)&&state.compareA!==state.compareB);
 share.onclick=async()=>{const link=location.origin+location.pathname+compareRoute();try{await navigator.clipboard.writeText(link);notice('Comparison link copied.')}catch{notice('Clipboard unavailable; copy the comparison URL from the address bar.')}};
 const stickyBody=node('div',{id:'compareStickyBody',class:'compare-sticky-body'},head,node('p',{class:'evidence-note'},'Exact submitted OpenCL query identity, state and values; a missing property is unknown, not unsupported.'),tools);
 stickyBody.hidden=state.compareMinimized;
 const sticky=node('section',{class:'compare-sticky-shell'+(state.compareMinimized?' minimized':''),id:'compareStickyShell'},node('div',{class:'compare-sticky-top'},node('strong',{},'Compare · Baseline / Target'),node('div',{class:'compare-sticky-actions'},share,pinButton)),stickyBody);
 const box=node('div',{class:'compare-workspace'},node('div',{id:'compareStickyPlaceholder',class:'compare-sticky-placeholder','aria-hidden':'true'}),sticky);
 $('contentView').replaceChildren(box);queueComparePinned();
 if(!state.compareA||!state.compareB){box.append(node('p',{class:'settings-empty'},'Choose two submitted reports to compare their complete technical evidence.'));pager(0,false);return}
 if(state.compareA===state.compareB){box.append(node('p',{class:'settings-empty'},'Choose two different reports to compare.'));pager(0,false);return}
 const a=state.reports.get(state.compareA),b=state.reports.get(state.compareB);
 if(!a||!b){
  const load=node('button',{class:'primary-action',type:'button',onclick:async()=>{load.disabled=true;try{await Promise.all([loadReport(state.compareA),loadReport(state.compareB)]);renderCompare()}catch(e){notice('Comparison reports unavailable: '+e.message);load.disabled=false}}},'Load both full reports');
  box.append(node('p',{class:'evidence-note'},'Complete reports are retrieved on explicit request; no missing values are guessed.'),load);pager(0,false);return;
 }
 const x=semanticComparisonLeaves(a.technicalReport),y=semanticComparisonLeaves(b.technicalReport),keys=[...new Set([...x.keys(),...y.keys()])].sort();
 const counts={Added:0,Removed:0,Changed:0,Unchanged:0};
 const records=keys.map(k=>{const status=!x.has(k)?'Added':!y.has(k)?'Removed':x.get(k)===y.get(k)?'Unchanged':'Changed';counts[status]++;return {key:k,status,category:compareCategory(k),baseline:x.get(k),target:y.get(k),hasA:x.has(k),hasB:y.has(k)}});
 const summary=node('div',{class:'compare-summary'},...Object.entries(counts).map(([kind,count])=>node('div',{class:'compare-summary-item'},node('small',{},kind),node('strong',{},String(count)))));
 stickyBody.append(summary);
 const q=state.query.trim().toLowerCase();const matched=sortComparisonRecords(records.filter(r=>(!state.differencesOnly||r.status!=='Unchanged')&&(state.compareKind==='All'||r.category===state.compareKind)&&(!q||[r.key,r.baseline,r.target,r.status].some(v=>text(v).toLowerCase().includes(q)))),state.compareSort);
 const exports=node('div',{class:'compare-export-actions'},node('span',{class:'evidence-note'},'Export uses only the two fully loaded selected reports; filtered records across all pages.'),node('button',{class:'primary-action',type:'button',onclick:()=>compareExportRecords(matched,'json')},'Export JSON'),node('button',{class:'primary-action',type:'button',onclick:()=>compareExportRecords(matched,'txt')},'Export TXT'));box.append(exports);
 const pages=Math.max(1,Math.ceil(matched.length/state.pageSize));state.page=Math.min(state.page,pages-1);
 const rows=matched.slice(state.page*state.pageSize,(state.page+1)*state.pageSize);
 const table=node('table',{class:'compare-evidence-table'},node('thead',{},node('tr',{},...['Canonical evidence','Change','Baseline','Target','Actions'].map(v=>node('th',{scope:'col'},v)))),node('tbody',{},...rows.map(r=>{const row=node('tr',{},node('td',{class:'compare-evidence-key'},r.key),node('td',{},node('span',{class:'compare-change '+r.status.toLowerCase()},r.status)),node('td',{},r.hasA?text(r.baseline):'Not reported'),node('td',{},r.hasB?text(r.target):'Not reported'),node('td',{},node('button',{type:'button',class:'evidence-more','aria-label':'Evidence actions for '+r.key},'⋯')));const data={name:r.key,baselineReported:r.hasA,targetReported:r.hasB,baseline:r.baseline,target:r.target,row:[r.key,r.status,r.hasA?r.baseline:'Not reported',r.hasB?r.target:'Not reported'].join('\t')};row.querySelector('.evidence-more').onclick=()=>evidenceQuickMenu(data,row.querySelector('.evidence-more'));bindEvidenceLongPress(row,data);return row})));
 box.append(node('p',{class:'evidence-note'},`${matched.length} matching fields · ${keys.length} canonical fields checked`));
 box.append(rows.length?node('div',{class:'table-wrap compare-evidence-wrap'},table):empty());pager(matched.length,false);queueComparePinned();
}
function statsDistribution(values){const counts=new Map();for(const value of values){const key=text(value).trim()||'Unreported';counts.set(key,(counts.get(key)||0)+1)}return [...counts].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label))}
function statsDonut(title,data,denominator,unit){
 const cut=Math.min(12,Math.max(3,state.statisticsSliceLimit)),items=data.length>cut?[...data.slice(0,cut-1),{label:`Other (${data.length-cut+1} groups)`,count:data.slice(cut-1).reduce((n,d)=>n+d.count,0)}]:data;
 const palette=['#3dae2b','#7dcb62','#78a67d','#b5e48c','#4dbd9d','#bfd1aa','#78a84a','#a9ddca'];
 const circumference=2*Math.PI*50;
 const circle=node('svg',{viewBox:'0 0 160 160',class:'stats-donut-svg',role:'img','aria-label':`${title}: ${denominator} ${unit} across ${data.length} groups`},node('circle',{cx:'80',cy:'80',r:'50',fill:'none',stroke:'#28372c','stroke-width':'22'}));
 let offset=0;
 for(let i=0;i<items.length;i++){
  const count=items[i].count,segment=denominator?circumference*count/denominator:0;
  if(segment>0){const arc=node('circle',{cx:'80',cy:'80',r:'50',fill:'none',stroke:palette[i%palette.length],'stroke-width':'22','stroke-dasharray':`${Math.max(0,segment-0.7)} ${circumference}`,'stroke-dashoffset':String(-offset),transform:'rotate(-90 80 80)'});arc.append(node('title',{},`${items[i].label}: ${count}/${denominator}`));circle.append(arc)}
  offset+=segment;
 }
 circle.append(node('text',{x:'80',y:'75','text-anchor':'middle',class:'stats-donut-total'},String(denominator)),node('text',{x:'80',y:'95','text-anchor':'middle',class:'stats-donut-unit'},unit));
 const legend=node('div',{class:'stats-donut-legend'});
 for(let i=0;i<items.length;i++){
  const item=items[i],percentage=denominator?100*item.count/denominator:0;
  legend.append(node('div',{class:'stats-donut-legend-row'},node('span',{class:'stats-donut-swatch',style:`background:${palette[i%palette.length]}`}),node('span',{class:'stats-donut-label'},item.label),node('strong',{},String(item.count)),node('span',{class:'stats-donut-percentage'},`${percentage.toFixed(1)}%`)));
 }
 return node('section',{class:'stats-chart stats-donut-panel'},node('h3',{},databaseSvgIcon('trends'),node('span',{},title)),node('div',{class:'stats-donut-content'},circle,legend),node('p',{class:'evidence-note'},`Denominator: ${denominator} loaded ${unit}; each ${unit==='reports'?'report':unit==='platforms'?'platform':'device'} contributes exactly once.`));
}
function renderStatistics(){
 const eligible=new Set(filteredRows().map(r=>r.id));
 const reports=[...state.reports.values()].filter(r=>r?.technicalReport?.platforms&&eligible.has(r.id));
 const loaded=reports.length,devices=[],platforms=[],states=new Map(),extensionCounts=new Map();
 let propertyCount=0;
 const addStatus=value=>states.set(value||'unknown',(states.get(value||'unknown')||0)+1);
 for(const report of reports){
  const platformNames=new Set(),deviceNames=new Set();
  for(const platform of report.technicalReport.platforms){
   platforms.push({platform,report});
   for(const name of platform.extensions||[])if(typeof name==='string')platformNames.add(name);
   for(const q of platform.properties||[]){propertyCount++;addStatus(q.status)}
   for(const device of platform.devices||[]){
    devices.push({device,platform,report});
    for(const name of device.extensions||[])if(typeof name==='string')deviceNames.add(name);
    for(const q of device.properties||[]){propertyCount++;addStatus(q.status)}
   }
  }
  const names=state.statisticsExtensionScope==='platform'?platformNames:state.statisticsExtensionScope==='device'?deviceNames:new Set([...platformNames,...deviceNames]);
  for(const name of names)extensionCounts.set(name,(extensionCounts.get(name)||0)+1);
 }
 const coverage=node('section',{class:'stats-coverage'},
  card('Indexed reports',[['Published index',state.rows.length],['Full report details loaded',state.reports.size],['Still not loaded',Math.max(0,state.rows.length-state.reports.size)]],'Index summaries are not complete technical evidence.'),
  card('Filtered evidence coverage',[['Matching report index',eligible.size],['Loaded full reports used',loaded],['Unloaded report details excluded',Math.max(0,eligible.size-loaded)]],'All charts use the loaded, filtered report subset only.'),
  card('Loaded technical evidence',[['Platforms',platforms.length],['Devices',devices.length],['Property query rows',propertyCount]],'Property states are raw observations, not inferred feature support.')
 );
 const controls=node('section',{class:'stats-filter-controls','aria-label':'Statistics chart controls'});
 const selection=(label,options,current,handler)=>{const select=node('select',{'aria-label':label},...options.map(([value,textLabel])=>node('option',{value},textLabel)));select.value=String(current);select.addEventListener('change',()=>handler(select.value));return node('label',{},node('span',{},label),select)};
 controls.append(
  selection('Donut detail',[[5,'Up to 5 slices'],[8,'Up to 8 slices'],[12,'Up to 12 slices']],state.statisticsSliceLimit,v=>{state.statisticsSliceLimit=Number(v);renderStatistics()}),
  selection('Extension scope',[['both','Device + platform'],['device','Device extensions'],['platform','Platform extensions']],state.statisticsExtensionScope,v=>{state.statisticsExtensionScope=v;renderStatistics()}),
  selection('Extension namespace',[['all','All namespaces'],['khr','cl_khr_*'],['ext','cl_ext_*'],['vendor','Other / vendor namespaces']],state.statisticsNamespace,v=>{state.statisticsNamespace=v;renderStatistics()}),
  selection('Minimum extension frequency',[[0,'Any coverage'],[10,'10%+'],[25,'25%+'],[50,'50%+'],[75,'75%+'],[90,'90%+']],state.statisticsMinimum,v=>{state.statisticsMinimum=Number(v);renderStatistics()})
 );
 const search=node('input',{type:'search',placeholder:'Extension name…','aria-label':'Search extension frequency',value:state.statisticsSearch});
 search.addEventListener('input',e=>{state.statisticsSearch=e.target.value;renderStatistics();const replacement=document.querySelector('input[aria-label="Search extension frequency"]');if(replacement){replacement.focus();replacement.setSelectionRange(e.target.selectionStart,e.target.selectionStart)}});
 controls.append(node('label',{},node('span',{},'Extension search'),search));
 const charts=node('div',{class:'stats-charts stats-donut-grid'});
 if(loaded){
  charts.append(
   statsDonut('GPU vendor distribution',statsDistribution(devices.map(x=>x.device.vendor)),devices.length,'devices'),
   statsDonut('OpenCL device versions',statsDistribution(devices.map(x=>x.device.version)),devices.length,'devices'),
   statsDonut('OpenCL device types',statsDistribution(devices.map(x=>x.device.type)),devices.length,'devices'),
   statsDonut('Android manufacturers',statsDistribution(reports.map(r=>r.device?.manufacturer)),loaded,'reports'),
   statsDonut('OpenCL platforms',statsDistribution(platforms.map(x=>x.platform.name)),platforms.length,'platforms')
  );
 }
 const distribution=[...states].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label));
 const stateSection=node('section',{class:'stats-chart stats-status-panel'},node('h3',{},'OpenCL property query states'),node('p',{class:'evidence-note'},`Denominator: ${propertyCount} queried property rows across loaded reports. Available does not prove an API feature is supported.`));
 if(propertyCount){const max=Math.max(...distribution.map(x=>x.count));for(const row of distribution){const track=node('div',{class:'stats-bar-track',role:'meter','aria-label':`${row.label}: ${row.count} query rows`,'aria-valuemin':'0','aria-valuemax':String(max),'aria-valuenow':String(row.count)},node('span',{class:'stats-bar-fill'}));track.firstChild.style.width=`${100*row.count/max}%`;stateSection.append(node('div',{class:'stats-bar'},node('span',{class:'stats-bar-label'},row.label),track,node('strong',{class:'stats-bar-value'},`${row.count} · ${(row.count*100/propertyCount).toFixed(1)}%`)))}}
 else stateSection.append(node('p',{},'No fully loaded reports in the selected index filters.'));
 const entries=[...extensionCounts].map(([name,count])=>({name,count,percent:loaded?100*count/loaded:0})).filter(x=>(state.statisticsNamespace==='all'||(state.statisticsNamespace==='vendor'?!x.name.startsWith('cl_khr_')&&!x.name.startsWith('cl_ext_'):x.name.startsWith('cl_'+state.statisticsNamespace+'_')))&&x.percent>=state.statisticsMinimum&&x.name.toLowerCase().includes(state.statisticsSearch.toLowerCase().trim())).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
 const top=entries.slice(0,100),head=node('thead',{},node('tr',{},...['Reported extension','Reports','Share of loaded reports'].map(x=>node('th',{scope:'col'},x))));
 const extensionTable=node('table',{class:'evidence-table stats-extension-table'},head,node('tbody',{},...top.map(x=>node('tr',{},node('td',{class:'code'},x.name),node('td',{},String(x.count)),node('td',{},`${x.percent.toFixed(1)}%`)))));
 const extSection=node('section',{class:'stats-chart stats-extension-panel'},node('h3',{},'Extension frequency'),node('p',{class:'evidence-note'},`Found ${entries.length} matching extension names across ${loaded} loaded reports. Each extension is counted at most once per report. Scope: ${state.statisticsExtensionScope}. Extensions overlap, so these percentages must not be shown as slices of a pie.`),top.length?node('div',{class:'table-wrap stats-extension-table-wrap'},extensionTable):node('p',{class:'settings-empty'},'No matching extension evidence.'),entries.length>100?node('p',{class:'evidence-note'},`Showing 100 of ${entries.length} matching names.`):null);
 $('contentView').replaceChildren(coverage,controls,charts,loaded?stateSection:node('p',{class:'settings-empty'},'Open a complete indexed report to populate statistics.'),extSection);
 pager(0,false);
}
function renderCatalog(){
 const data=state.encyclopedia;
 if(!data||!Array.isArray(data.entries)){
  $('contentView').replaceChildren(node('p',{class:'settings-empty'},'The official OpenCL registry reference is unavailable. No runtime support is inferred.'));
  pager(0,false);return;
 }
 const categories=['All',...new Set(data.entries.map(e=>e.category).filter(Boolean))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
 const select=node('select',{'aria-label':'Reference category'},...categories.map(category=>node('option',{value:category},category)));select.value=state.encyclopediaCategory;
 select.onchange=()=>{state.encyclopediaCategory=select.value;state.page=0;renderCatalog()};
 const q=state.query.trim().toLowerCase();
 const matches=data.entries.filter(e=>(state.encyclopediaCategory==='All'||e.category===state.encyclopediaCategory)&&(!q||[e.name,e.category,e.definition,e.detail].some(v=>text(v).toLowerCase().includes(q))));
 const pages=Math.max(1,Math.ceil(matches.length/state.pageSize));state.page=Math.min(state.page,pages-1);
 const shown=matches.slice(state.page*state.pageSize,(state.page+1)*state.pageSize);
 const counts=new Map();for(const entry of data.entries)counts.set(entry.category,(counts.get(entry.category)||0)+1);
 const overview=node('div',{class:'encyclopedia-counters'},...['Command','Type','Extension','Token'].map(category=>node('div',{class:'encyclopedia-counter'},node('span',{},category),node('strong',{},String(counts.get(category)||0)))));
 const tools=node('div',{class:'encyclopedia-tools'},node('label',{},'Category',select),node('span',{class:'evidence-note'},`${matches.length} matching reference entries · ${data.entries.length} registry entries`));
 const rows=shown.map(e=>node('article',{class:'encyclopedia-entry'},node('div',{class:'encyclopedia-entry-head'},node('strong',{},e.name),node('span',{class:'encyclopedia-kind'},e.category)),node('p',{},e.definition||'Registry entry'),e.detail?node('details',{},node('summary',{},'Official registry metadata'),node('p',{},e.detail)):null));
 $('contentView').replaceChildren(node('div',{class:'encyclopedia-screen'},node('p',{class:'evidence-note'},'Registry relationships and symbol registration are reference metadata. They never replace evidence collected from a selected OpenCL device.'),overview,tools,shown.length?node('div',{class:'encyclopedia-results'},...rows):empty()));
 pager(matches.length,false);
}
function render(){const [eyebrow,title,desc]=panes[state.view];$('viewEyebrow').textContent=eyebrow;$('viewTitle').textContent=title;ensureWorkspaceHeadingIcon();$('viewDescription').textContent=desc;$('heroWorkspaceEyebrow').textContent=eyebrow;$('heroWorkspaceTitle').textContent=title;$('heroWorkspaceDescription').textContent=desc;for(const btn of document.querySelectorAll('[data-view]')){btn.classList.toggle('active',btn.dataset.view===state.view);btn.setAttribute('aria-current',btn.dataset.view===state.view?'page':'false');btn.setAttribute('aria-selected',String(btn.dataset.view===state.view))}const selectedWorkspace=document.querySelector('[data-view="'+state.view+'"]');if(selectedWorkspace){const nav=$('mainNav');const bounds=selectedWorkspace.getBoundingClientRect(),clip=nav.getBoundingClientRect();if(bounds.left<clip.left+6||bounds.right>clip.right-6){const dest=nav.scrollLeft+(bounds.left+bounds.width/2)-(clip.left+clip.width/2);nav.scrollTo({left:Math.max(0,dest),behavior:document.body.classList.contains('reduce-motion')?'instant':'smooth'})}}$('filterPanel').hidden=state.view==='compare'||state.view==='encyclopedia';closeCustomSelects();$('clearFilters').hidden=!(state.query||state.vendor||state.version||state.device||state.driver||state.status||state.sort!=='newest'||state.manufacturer||state.model||state.platform||state.submittedAge);$('globalSearchClear').hidden=!state.query;$('stateFilter').closest('.filter-control').hidden=!['features','memory','formats','platforms','devices','profiles','extensions'].includes(state.view);$('sortFilter').closest('.filter-control').hidden=state.view!=='reports';for(const id of ['vendorFilter','versionFilter','deviceFilter','driverFilter','manufacturerFilter','modelFilter','platformFilter','submissionAgeFilter'])$(id).closest('.filter-control').hidden=false;$('pager').hidden=state.view==='compare';if(state.view==='reports')return renderReports();if(state.view==='compare')return renderCompare();if(state.view==='statistics')return renderStatistics();if(state.view==='encyclopedia')return renderCatalog();renderCards(recordEntries(state.view));$('fetchNext').hidden=state.view!=='reports'}
async function api(path,opts={}){if(!API)throw Error('The database API is not configured; the published snapshot remains read-only.');const url=new URL(path,API+'/');if(url.origin!==new URL(API).origin||url.protocol!=='https:')throw Error('Invalid configured HTTPS API endpoint');const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),18000);try{const r=await fetch(url,{...opts,signal:controller.signal,cache:'no-store'});const value=await r.json();if(!r.ok)throw Error(`${r.status} · ${value.error||'API request failed'}`);return value}finally{clearTimeout(timer)}}
async function loadReport(id){if(!/^[a-f0-9]{64}$/.test(id))throw Error('Report ID must contain 64 lowercase SHA-256 characters.');if(state.reports.has(id))return state.reports.get(id);const report=await api(`/v1/reports/${id}`);if(report.id!==id||!report.technicalReport)throw Error('Report ID or schema did not match');state.reports.set(id,report);addRows([report]);return report}
function rowProps(rows){return rows.map(row=>[row.name,row.status==='available'?(row.value===null||row.value===undefined||row.value===''?'(empty)':row.value):`OpenCL ${row.code}`,row.status])}
function technicalCards(r,tab){const t=r.technicalReport;const entries=[];for(const p of t.platforms){if(tab==='Platforms')entries.push({title:p.name,subtitle:`Platform #${p.index+1}`,fields:[['Vendor',p.vendor],['API',p.version],['Profile',p.profile],['Enumerated extensions',p.extensions.length],['Device query',p.deviceEnumerationStatus],['Extension consistency',p.extensionAudit?.status||'Historical report'],['Common device extensions',p.extensionAudit?.commonDeviceExtensions?.length??'Not recorded'],['Missing platform declarations',p.extensionAudit?.missingFromPlatform?.length??'Not recorded'],...rowProps(p.properties)]});if(tab==='Extensions')entries.push({title:p.name,subtitle:'PLATFORM EXTENSIONS',fields:p.extensions.map(x=>[x,'Enumerated','available'])});if(tab==='Extensions'&&p.extensionAudit){const a=p.extensionAudit;entries.push({title:p.name+' · consistency',subtitle:'INDEPENDENT PLATFORM AND DEVICE EVIDENCE',state:a.status,fields:[['State',a.status],['Versioned evidence',a.versionedEvidence],['Devices checked',a.checkedDevices],['Common device extensions',a.commonDeviceExtensions.join(', ')],['Missing platform advertisements',a.missingFromPlatform.join(', ')],['Platform-only declarations (informational)',a.platformOnly.join(', ')],['Platform versioned differences',a.platformVersionedMismatch.join(', ')],['Device versioned differences',a.deviceVersionedMismatch.join(', ')],['Meaning','API success does not imply platform extension advertisement']]})};for(const d of p.devices){const prefix=`${p.name} · ${d.name}`;if(tab==='Devices')entries.push({title:d.name,subtitle:p.name,fields:[['Vendor',d.vendor],['Type',d.type],['OpenCL',d.version],['Driver',d.driverVersion],['Profile',d.profile],['Extensions',d.extensions.length],['Properties',d.properties.length]]});if(tab==='Properties')entries.push({title:d.name,subtitle:p.name,fields:rowProps(d.properties)});if(tab==='Features')entries.push({title:d.name,subtitle:p.name,fields:rowProps(d.properties.filter(prop=>/(SUPPORT|CAPABILITIES|AVAILABLE|FP_CONFIG|VERSION)/.test(prop.name)))});if(tab==='Memory')entries.push({title:d.name,subtitle:p.name,fields:rowProps(d.properties.filter(prop=>/(MEM|CACHE|ALLOC|SVM)/.test(prop.name)))});if(tab==='Extensions')entries.push({title:d.name,subtitle:'DEVICE EXTENSIONS',fields:d.extensions.map(x=>[x,'Enumerated','available'])});if(tab==='Formats')for(const g of d.imageFormats)entries.push({title:g.imageType,subtitle:`${g.flags} · ${prefix}`,state:g.status,fields:[['State',g.status],['OpenCL code',g.code],['Pair count',g.formats.length],...g.formats.map((f,i)=>[`Pair ${i+1}`,`${f.order} / ${f.dataType} (${f.orderValue}, ${f.typeValue})`])]});if(tab==='Profiles')entries.push({title:d.name,subtitle:p.name,fields:profiles(d).map(c=>[`${c.label} · ${c.key}`,c.value||'Query unavailable',c.result])})}}return entries}
function showDetail(){const r=state.detail;if(!r)return;document.getElementById('workspace').hidden=true;$('detailView').hidden=false;const t=r.technicalReport;const pd=t.platforms.flatMap(p=>p.devices.map(d=>({p,d})))[0];$('detailHeader').replaceChildren(node('div',{class:'detail-hero'},node('p',{class:'eyebrow'},'COMPLETE TECHNICAL REPORT'),node('h2',{},pd?.d?.name||'OpenCL device'),node('p',{},`${pd?.p?.name||'Unreported platform'} · ${pd?.d?.vendor||'Unknown vendor'} · ${pd?.d?.version||'Unknown OpenCL'}`),node('p',{},`Submitted: ${humanDate(r.submittedAt)}`),node('p',{class:'id'},r.id),node('p',{},`${t.platforms.length} platforms · ${t.platforms.reduce((n,p)=>n+p.devices.length,0)} devices · Registry ${r.registrySha256}`)));$('favoriteToggle').textContent=state.favorites.has(r.id)?'★ Favorited':'☆ Favorite';const tabs=['Overview','Platforms','Devices','Features','Properties','Memory','Formats','Extensions','Profiles','Diagnostics','Raw JSON'];$('detailTabs').setAttribute('role','tablist');$('detailContent').setAttribute('role','tabpanel');$('detailContent').id='detailContent';$('detailTabs').replaceChildren(...tabs.map(tab=>node('button',{class:tab===state.detailTab?'active':'',role:'tab','aria-controls':'detailContent',tabIndex:tab===state.detailTab?'0':'-1','aria-selected':String(tab===state.detailTab),onclick:()=>{state.detailTab=tab;state.detailQuery='';state.detailStatus='';state.detailPage=0;location.hash=`reports/${r.id}/${encodeURIComponent(tab)}`;showDetailContent()}},databaseSvgIcon(({Overview:'reports',Platforms:'instance',Devices:'devices',Features:'features',Properties:'properties',Memory:'memory',Formats:'formats',Extensions:'extensions',Profiles:'profiles',Diagnostics:'limits','Raw JSON':'properties'})[tab]||'reports'),node('span',{},tab))));let toolbar=$('detailEvidenceToolbar');if(!toolbar){toolbar=node('div',{class:'detail-evidence-toolbar',id:'detailEvidenceToolbar'},node('label',{},'Search evidence',node('input',{type:'search',placeholder:'Query name or reported value','aria-label':'Search report evidence'})),node('label',{},'Status',node('select',{'aria-label':'Report evidence status'},...['','available','not_applicable','unavailable','error','unknown'].map(k=>node('option',{value:k},k||'All')))));$('detailContent').before(toolbar);toolbar.querySelector('input').addEventListener('input',e=>{state.detailQuery=e.target.value;state.detailPage=0;showDetailContent()});toolbar.querySelector('select').addEventListener('change',e=>{state.detailStatus=e.target.value;state.detailPage=0;showDetailContent()})}const tabButtons=[...$('detailTabs').querySelectorAll('[role=tab]')];$('detailTabs').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const current=tabButtons.indexOf(document.activeElement);if(current<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabButtons.length-1:(current+(e.key==='ArrowRight'?1:-1)+tabButtons.length)%tabButtons.length;tabButtons[next].focus();tabButtons[next].click()};showDetailContent()}
function detailEvidenceRows(report,tab){
 const rows=[];
 for(const p of report.technicalReport.platforms){
  const all=[{scope:`Platform · ${p.name}`,queries:p.properties},...(p.devices||[]).map(d=>({scope:`${p.name} · ${d.name}`,queries:d.properties}))];
  if(['Properties','Features','Memory'].includes(tab))for(const group of all)for(const q of group.queries||[]){
   if(tab==='Features'&&!/(SUPPORT|CAPABILITIES|AVAILABLE|FP_CONFIG|VERSION)/.test(q.name))continue;
   if(tab==='Memory'&&!/(MEM|CACHE|ALLOC|SVM)/.test(q.name))continue;
   rows.push({title:q.name,subtitle:group.scope,state:q.status,fields:[['Reported value',q.status==='available'?(q.value===undefined||q.value===null?'':q.value):'No successful runtime value',q.status],['Query status',q.status],['OpenCL return code',q.code]]});
  }
  if(tab==='Formats')for(const d of p.devices||[])for(const g of d.imageFormats||[]){
   rows.push({title:`${g.imageType} · ${g.flags}`,subtitle:`${p.name} · ${d.name}`,state:g.status,fields:[['State',g.status],['OpenCL code',g.code],['Format pairs',g.formats.length],...(g.formats||[]).map((f,i)=>[`Pair ${i+1}`,`${f.order} / ${f.dataType} (${f.orderValue}, ${f.typeValue})`])]});
  }
 }
 return rows;
}
function showDetailContent(){
 const r=state.detail;if(!r)return;
 for(const b of $('detailTabs').children){const active=b.textContent===state.detailTab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.setAttribute('tabindex',active?'0':'-1')}
 const tab=state.detailTab,t=r.technicalReport;
 const filterable=['Properties','Features','Memory','Formats'].includes(tab);
 let toolbar=$('detailEvidenceToolbar');
 if(toolbar){toolbar.hidden=!filterable;toolbar.querySelector('input').value=state.detailQuery;toolbar.querySelector('select').value=state.detailStatus;}
 if(tab==='Raw JSON'){$('detailContent').replaceChildren(node('pre',{class:'raw-text'},JSON.stringify(r,null,2)));return}
 let entries=[];
 if(tab==='Overview')entries=[{title:'Complete report',subtitle:'Authoritative submission',fields:[['Producer',r.application.name+' '+r.application.versionName],['Application ID',r.application.packageName],['Android',`API ${r.device.androidApi} · ${r.device.manufacturer} ${r.device.model}`],['State',r.collection.status],['Collected epoch ms',t.collectedAtEpochMs],['Loader',t.loader],['Duration',`${(t.durationMs/1000).toFixed(3)} s (${t.durationMs} ms)`],['Platforms',t.platforms.length],['Devices',t.platforms.reduce((n,p)=>n+p.devices.length,0)]]}];
 else if(tab==='Diagnostics')entries=[{title:'Collection diagnostics',subtitle:t.message,fields:[['Collection status',t.status],['Native error code',t.errorCode],['Elapsed',`${(t.durationMs/1000).toFixed(3)} s (${t.durationMs} ms)`],['Reported source',r.collection.source],['Property available',t.platforms.reduce((n,p)=>n+[...p.properties,...p.devices.flatMap(d=>d.properties)].filter(x=>x.status==='available').length,0)],['Property unavailable',t.platforms.reduce((n,p)=>n+[...p.properties,...p.devices.flatMap(d=>d.properties)].filter(x=>x.status==='unavailable').length,0)],['Property error',t.platforms.reduce((n,p)=>n+[...p.properties,...p.devices.flatMap(d=>d.properties)].filter(x=>x.status==='error').length,0)]]}];
 else entries=filterable?detailEvidenceRows(r,tab):technicalCards(r,tab);
 if(!filterable){$('detailContent').replaceChildren(...(entries.length?entries.map(e=>card(e.title,e.fields,e.subtitle,e.state)):[empty()]));return}
 const query=state.detailQuery.toLowerCase().trim();
 const matched=entries.filter(e=>(!state.detailStatus||e.state===state.detailStatus)&&(!query||[e.title,e.subtitle,...e.fields.flat().map(text)].join(' ').toLowerCase().includes(query)));
 const pages=Math.max(1,Math.ceil(matched.length/state.detailPageSize));state.detailPage=Math.min(state.detailPage,pages-1);
 const shown=matched.slice(state.detailPage*state.detailPageSize,(state.detailPage+1)*state.detailPageSize);
 const previous=node('button',{type:'button','aria-label':'Previous evidence page'},'‹');previous.disabled=state.detailPage===0;
 previous.onclick=()=>{state.detailPage--;showDetailContent()};
 const next=node('button',{type:'button','aria-label':'Next evidence page'},'›');next.disabled=state.detailPage>=pages-1;
 next.onclick=()=>{state.detailPage++;showDetailContent()};
 const input=node('input',{type:'number',min:'1',max:String(pages),value:String(state.detailPage+1),'aria-label':'Evidence page number'});
 input.onchange=()=>{const n=Number.parseInt(input.value,10);if(Number.isSafeInteger(n)){state.detailPage=Math.min(pages,Math.max(1,n))-1};showDetailContent()};
 const limits=node('select',{'aria-label':'Evidence page size'},...[25,50,100].map(n=>node('option',{value:String(n)},String(n))));limits.value=String(state.detailPageSize);
 limits.onchange=()=>{state.detailPageSize=Number(limits.value);state.detailPage=0;showDetailContent()};
 const pagination=node('div',{class:'detail-evidence-pager'},node('span',{},`${matched.length} matching records`),previous,input,node('span',{},`/ ${pages}`),next,node('label',{},'Page size',limits));
 $('detailContent').replaceChildren(shown.length?technicalEvidenceTable(shown):empty(),pagination);
}
async function openReport(id){try{notice('Loading complete technical report…');const r=await loadReport(id);state.detail=r;state.detailTab='Overview';state.detailQuery='';state.detailStatus='';state.detailPage=0;showDetail();location.hash=`reports/${encodeURIComponent(id)}/Overview`;notice('')}catch(error){notice(`Cannot load report: ${error.message}`)}}
async function openHash(){const match=location.hash.match(/^#reports\/([a-f0-9]{64})(?:\/([^/?#]+))?$/);if(!match)return;try{const tab=decodeURIComponent(match[2]||'Overview');state.detail=await loadReport(match[1]);state.detailTab=['Overview','Platforms','Devices','Features','Properties','Memory','Formats','Extensions','Profiles','Diagnostics','Raw JSON'].includes(tab)?tab:'Overview';showDetail()}catch(error){notice(error.message)}}
function back(){state.detail=null;$('detailView').hidden=true;$('workspace').hidden=false;location.hash=state.view;render()}
async function update(force=false){
  if(!API){banner('Published snapshot only · production API is not configured','warning');return}
  if(state.syncBusy||(!force&&document.hidden))return;
  if(navigator.onLine===false){banner('Offline · cached reports remain available','warning');return}
  state.syncBusy=true;
  try{
    const sync=await api('/v1/sync');
    if(!Number.isSafeInteger(sync.reportCount)||sync.reportCount<0||typeof sync.latestReportId!=='string')throw Error('Invalid live sync response');
    const same=state.rows.length===sync.reportCount && (!sync.latestReportId||state.seen.has(sync.latestReportId));
    if(!force&&same){state.remote=true;state.syncToken=sync.syncToken;$('sourceBadge').textContent=`Cache loaded · Live current · ${state.rows.length} reports`;banner('');return}
    const was=state.rows.length,latest=[];
    let cursor=null,first=true,complete=false;
    for(let page=0;page<2000;page++){
      const suffix=cursor?`&beforeSubmittedAt=${encodeURIComponent(cursor.submittedAt)}&beforeId=${cursor.id}`:'';
      const result=await api(`/v1/reports?limit=50${suffix}`);
      if(!Array.isArray(result.reports)||result.reports.length>50)throw Error('Invalid live report list');
      if(first){state.cursor=result.nextCursor;first=false}
      const overlap=result.reports.some(r=>state.seen.has(r.id));
      latest.push(...result.reports);
      cursor=result.nextCursor;
      if(overlap||!cursor){complete=true;break}
    }
    if(!complete)throw Error('Report index exceeded live sync traversal limit');
    addRows(latest);
    state.remote=true;state.syncToken=sync.syncToken;
    $('sourceBadge').textContent=`Live synced · ${state.rows.length} indexed reports`;
    banner('');
    if(state.rows.length>was)notice(`${state.rows.length-was} new report(s) available · ${new Date().toLocaleTimeString()}`);
    else if(force)notice(`Live database checked · ${new Date().toLocaleTimeString()}`);
    render();
  }catch(error){banner('Live API unavailable · published cache remains available','warning');notice(`Live sync failed: ${error.message}`)}
  finally{state.syncBusy=false}
}
async function loadNext(){if(!state.cursor||!API)return;try{const p=new URLSearchParams({limit:'50',beforeSubmittedAt:state.cursor.submittedAt,beforeId:state.cursor.id});const result=await api(`/v1/reports?${p}`);state.cursor=result.nextCursor;addRows(result.reports);notice(`Loaded ${state.rows.length} report summaries; detail loads only when selected.`);render()}catch(error){notice(error.message)}}
function bind(){document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{backWithoutHash();state.view=b.dataset.view;state.page=0;location.hash=state.view;render()}));function backWithoutHash(){state.detail=null;$('detailView').hidden=true;$('workspace').hidden=false}window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#reports/'))openHash();else if(restoreCompareRoute()){backWithoutHash();render()}else if(panes[location.hash.slice(1)]){backWithoutHash();state.view=location.hash.slice(1);state.page=0;render()}});$('globalSearch').addEventListener('input',e=>{state.query=e.target.value;state.page=0;render()});$('globalSearchClear').onclick=()=>{$('globalSearch').value='';state.query='';state.page=0;render()};$('clearFilters').onclick=clearWorkspaceFilters;for(const [id,key] of [['vendorFilter','vendor'],['versionFilter','version'],['deviceFilter','device'],['driverFilter','driver'],['manufacturerFilter','manufacturer'],['modelFilter','model'],['platformFilter','platform'],['submissionAgeFilter','submittedAge'],['stateFilter','status'],['sortFilter','sort']])$(id).addEventListener('change',e=>{state[key]=e.target.value;state.page=0;render()});$('pageLimit').value=String(state.pageSize);$('pageLimit').onchange=e=>{const value=Number(e.target.value);if(![25,50,100].includes(value))return;state.pageSize=value;state.page=0;try{saveFavoritePreferences()}catch{}render()};$('refreshButton').onclick=()=>update(true);$('fetchNext').onclick=loadNext;$('previousPage').onclick=()=>{state.page=Math.max(0,state.page-1);render()};$('nextPage').onclick=()=>{state.page++;render()};const pageField=$('pageNumber');function commitPage(){const max=Math.max(1,Math.ceil(Number(pageField.dataset.total||0)/state.pageSize));const parsed=Number.parseInt(pageField.value,10);state.page=(Number.isSafeInteger(parsed)?Math.min(max,Math.max(1,parsed)):state.page+1)-1;pageField.blur();render()}pageField.addEventListener('focus',()=>pageField.select());pageField.addEventListener('change',commitPage);pageField.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commitPage()}if(e.key==='Escape'){e.preventDefault();pageField.blur();render()}});$('lookupButton').onclick=()=>openReport($('reportIdInput').value.trim().toLowerCase());$('reportIdInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('lookupButton').click()});$('favoritesButton').onclick=()=>{state.favoritesOnly=!state.favoritesOnly;$('favoritesButton').setAttribute('aria-pressed',String(state.favoritesOnly));setFavoriteFilterLabel();render()};$('detailBack').onclick=back;$('favoriteToggle').onclick=()=>{if(!state.detail)return;const id=state.detail.id;if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);saveFavoritePreferences();renderSettingsFavorites();$('favoriteToggle').textContent=state.favorites.has(id)?'★ Favorited':'☆ Favorite'};$('copyLink').onclick=async()=>{if(!state.detail)return;try{await navigator.clipboard.writeText(location.href);notice('Report link copied.')}catch{notice('Clipboard unavailable. Copy the report URL from the address bar.')}};$('downloadReport').onclick=()=>downloadCompleteReport(state.detail,'json');$('downloadTxt').onclick=()=>downloadCompleteReport(state.detail,'txt');$('downloadHtml').onclick=()=>downloadCompleteReport(state.detail,'html');$('settingsButton').onclick=openSettings;$('closeSettings').onclick=closeSettings;$('settingsBackdrop').onclick=closeSettings;installSettingsPreferences();window.addEventListener('scroll',queueComparePinned,{passive:true});window.addEventListener('resize',queueComparePinned,{passive:true});document.addEventListener('keydown',e=>{const dialog=$('licenseViewerDialog');if(dialog&&!dialog.hidden){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeDependencyLicense();return}if(e.key==='Tab'){const close=$('licenseViewerClose');e.preventDefault();close.focus();return}return}const drawer=$('settingsDrawer');if(!drawer.hidden){if(e.key==='Escape'){e.preventDefault();closeSettings();return}if(e.key==='Tab'){const focusable=[...drawer.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(x=>x.getClientRects().length&&!x.closest('[hidden]'));if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}},true);} 
function completeReportText(report){
  const t=report?.technicalReport;
  if(!t||!Array.isArray(t.platforms))throw Error('Complete OpenCL evidence is unavailable');
  const lines=['OpenCLScope technical report',`Report ID: ${text(report.id)}`,`Submitted: ${text(report.submittedAt)}`,`Application: ${text(report.application?.name)} ${text(report.application?.versionName)} (${text(report.application?.versionCode)})`,`Package: ${text(report.application?.packageName)}`,`Collection source: ${text(report.collection?.source)}`,`Schema: ${text(t.schema)}`,`Collector status: ${text(t.status)}`,`Duration: ${text(t.durationMs)} ms`,`Collector: ${text(t.message)}`,''];
  const prop=p=>`${text(p.name)}: ${text(p.value)} [${text(p.status)}; ${text(p.code)}]`;
  for(const p of t.platforms){
    lines.push(`=== Platform ${text(p.index)}: ${text(p.name)} ===`,`Vendor: ${text(p.vendor)}`,`Version: ${text(p.version)}`,`Profile: ${text(p.profile)}`,`Device discovery: ${text(p.deviceEnumerationStatus)} (${text(p.deviceEnumerationCode)})`,'Platform properties');
    for(const q of p.properties||[])lines.push(prop(q));
    lines.push('Platform extensions',...(p.extensions||[]),'');if(p.extensionAudit){const a=p.extensionAudit;lines.push('Platform/device extension consistency',`Status: ${text(a.status)}`,`Versioned evidence: ${text(a.versionedEvidence)}`,`Devices checked: ${text(a.checkedDevices)}`,`Common device extensions: ${(a.commonDeviceExtensions||[]).join(', ')}`,`Missing platform advertisements: ${(a.missingFromPlatform||[]).join(', ')}`,`Platform-only declarations (informational): ${(a.platformOnly||[]).join(', ')}`,`Platform versioned differences: ${(a.platformVersionedMismatch||[]).join(', ')}`,`Device versioned differences: ${(a.deviceVersionedMismatch||[]).join(', ')}`,'API success and declared extension support are separate evidence','')}
    for(const d of p.devices||[]){
      lines.push(`=== Device ${text(d.index)}: ${text(d.name)} ===`,`Vendor: ${text(d.vendor)}`,`OpenCL version: ${text(d.version)}`,`Driver: ${text(d.driverVersion)}`,`Profile: ${text(d.profile)}`,`Type: ${text(d.type)}`,'Device properties');
      for(const q of d.properties||[])lines.push(prop(q));
      lines.push('Device extensions',...(d.extensions||[]),'Image formats');
      for(const q of d.imageFormats||[]){
        lines.push(`${text(q.imageType)} | ${text(q.flags)}: ${text(q.status)} (${text(q.code)})`);
        for(const f of q.formats||[])lines.push(`  ${text(f.order)} / ${text(f.dataType)} [${text(f.orderValue)}, ${text(f.typeValue)}]`);
      }
      lines.push('');
    }
  }
  return lines.join('\n')+'\n';
}
function completeReportHtml(report){
  const plain=completeReportText(report);
  const escaped=plain.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OpenCLScope complete technical report</title><style>body{background:#000;color:#f2f8f1;font:16px system-ui;margin:auto;max-width:1100px;padding:24px}h1{color:#7ed96c}pre{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55;padding:16px;border:1px solid #314434;border-radius:18px;background:#101611}</style></head><body><h1>OpenCLScope technical report</h1><pre>${escaped}</pre></body></html>`;
}
function downloadCompleteReport(report,kind){
  if(!report?.technicalReport)return;
  const encoded=kind==='txt'?completeReportText(report):kind==='html'?completeReportHtml(report):JSON.stringify(report,null,2);
  const mime=kind==='txt'?'text/plain':kind==='html'?'text/html':'application/json';
  const blob=new Blob([encoded],{type:`${mime};charset=utf-8`});
  const url=URL.createObjectURL(blob);
  const a=node('a',{href:url,download:`OpenCLScope-${report.id}.${kind}`});
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function bindNavigationScroll(){
  const viewport=$('mainNav'),left=$('navScrollLeft'),right=$('navScrollRight');
  if(!viewport||!left||!right)return;
  const update=()=>{const max=Math.max(0,viewport.scrollWidth-viewport.clientWidth);left.disabled=viewport.scrollLeft<=1;right.disabled=viewport.scrollLeft>=max-1;$('navEdgeLeft').classList.toggle('visible',!left.disabled);$('navEdgeRight').classList.toggle('visible',!right.disabled)};
  left.addEventListener('click',()=>viewport.scrollBy({left:-Math.max(140,viewport.clientWidth*.65),behavior:document.body.classList.contains('reduce-motion')?'instant':'smooth'}));
  right.addEventListener('click',()=>viewport.scrollBy({left:Math.max(140,viewport.clientWidth*.65),behavior:document.body.classList.contains('reduce-motion')?'instant':'smooth'}));
  viewport.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(viewport);
  requestAnimationFrame(update);
}
function clearWorkspaceFilters(){
  state.vendor='';state.version='';state.device='';state.driver='';state.manufacturer='';state.model='';state.platform='';state.submittedAge='';state.status='';state.sort='newest';state.query='';state.page=0;
  for(const id of ['vendorFilter','versionFilter','deviceFilter','driverFilter','manufacturerFilter','modelFilter','platformFilter','submissionAgeFilter','stateFilter'])$(id).value='';
  $('sortFilter').value='newest';$('globalSearch').value='';render();
}
const ICON_PATHS={reports:'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5',devices:'M9 3h6v3h3v3h3v6h-3v3h-3v3H9v-3H6v-3H3V9h3V6h3z M9 9h6v6H9z',versions:'M12 3a9 9 0 1 0 9 9 M12 7v5l3 2',properties:'M4 6h6 M14 6h6 M10 4v4 M4 12h10 M18 12h2 M16 10v4 M4 18h2 M10 18h10 M8 16v4',limits:'M4 18L18 4l2 2L6 20z M10 14l-2-2 M13 11l-2-2 M16 8l-2-2',features:'M5 4h14v16H5z M8 8l2 2 4-4 M8 15h8',formats:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',memory:'M5 5c0-2 14-2 14 0v14c0 2-14 2-14 0z M5 5c0 2 14 2 14 0 M5 12c0 2 14 2 14 0',queues:'M5 6h14 M5 12h14 M5 18h14 M3 6h.01 M3 12h.01 M3 18h.01',surface:'M3 5h18v12H3z M8 21h8 M12 17v4',display:'M3 4h18v12H3z M8 20h8 M12 16v4 M7 8h10 M7 12h6',extensions:'M8 3h4v4h3a3 3 0 1 1 0 6h-3v4h-4v3a3 3 0 1 1-6 0v-3H4v-4h4V8a3 3 0 1 1 0-5z',instance:'M12 3l8 4-8 4-8-4z M4 12l8 4 8-4 M4 17l8 4 8-4',profiles:'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12l2 2 4-5',portability:'M5 7h10 M11 3l4 4-4 4 M19 17H9 M13 13l-4 4 4 4',trends:'M4 19V9 M10 19V5 M16 19v-7 M3 19h18',encyclopedia:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 10v6 M12 7h.01',compare:'M4 7h12 M12 3l4 4-4 4 M20 17H8 M12 13l-4 4 4 4'};
const SETTINGS_ICON_PATHS={favorites:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',preferences:'M4 6h6 M14 6h6 M10 4v4 M4 12h10 M18 12h2 M16 10v4 M4 18h2 M10 18h10 M8 16v4',internet:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M3 12h18 M12 3c-3 4-3 14 0 18 M12 3c3 4 3 14 0 18',information:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 10v6 M12 7h.01'};
function setReferenceIcon(el,path,cls='nav-icon'){
 if(!el||!path)return;const svg=node('svg',{class:cls,viewBox:'0 0 24 24','aria-hidden':'true'});svg.append(node('path',{d:path}));el.replaceChildren(svg);
}
function databaseSvgIcon(key,cls='nav-icon'){const shape=ICON_PATHS[key]||ICON_PATHS.reports;const svg=node('svg',{class:cls,viewBox:'0 0 24 24','aria-hidden':'true'});svg.append(node('path',{d:shape}));return svg}
function installSettingsCategoryIcons(){for(const el of document.querySelectorAll('.settings-category-icon'))setReferenceIcon(el,SETTINGS_ICON_PATHS[el.dataset.icon],'settings-tab-svg')}
function ensureWorkspaceHeadingIcon(){const heading=$('viewTitle');if(!heading)return;const map={reports:'reports',platforms:'instance',devices:'devices',features:'features',memory:'memory',formats:'formats',extensions:'extensions',profiles:'profiles',compare:'compare',encyclopedia:'encyclopedia',statistics:'trends'};const p=ICON_PATHS[map[state.view]];if(!p)return;const svg=node('svg',{class:'workspace-heading-icon',viewBox:'0 0 24 24','aria-hidden':'true'});svg.append(node('path',{d:p}));heading.prepend(svg)}
function installIcons(){installSettingsCategoryIcons();const map={reports:'reports',platforms:'instance',devices:'devices',features:'features',memory:'memory',formats:'formats',extensions:'extensions',profiles:'profiles',compare:'compare',encyclopedia:'encyclopedia',statistics:'trends'};for(const b of document.querySelectorAll('[data-view]')){const shape=ICON_PATHS[map[b.dataset.view]];if(!shape)continue;const svg=node('svg',{class:'nav-icon',viewBox:'0 0 24 24','aria-hidden':'true'});svg.append(node('path',{d:shape}));b.classList.add('nav-button');b.prepend(svg)}}

let settingsRestoreFocus=null;
function openSettings(){setSettingsCategory(settingsActiveCategory);refreshSettingsInformation();settingsRestoreFocus=document.activeElement;$('settingsBackdrop').hidden=false;$('settingsDrawer').hidden=false;document.body.classList.add('settings-open');$('settingsButton').setAttribute('aria-expanded','true');$('closeSettings').focus()}
function closeSettings(){const drawer=$('settingsDrawer');if(drawer.hidden)return;drawer.hidden=true;$('settingsBackdrop').hidden=true;document.body.classList.remove('settings-open');$('settingsButton').setAttribute('aria-expanded','false');(settingsRestoreFocus||$('settingsButton')).focus()}
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCustomSelects();closeSettings()}if(event.key==='Tab'&&!$('settingsDrawer').hidden){const focusable=[...$('settingsDrawer').querySelectorAll('button:not(:disabled),input:not(:disabled),a[href],select:not(:disabled)')].filter(e=>e.getClientRects().length);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
function closeCustomSelects(){for(const w of document.querySelectorAll('.custom-select')){const menu=w.querySelector('.custom-select-menu'),button=w.querySelector('.custom-select-button');if(menu)menu.hidden=true;w.classList.remove('open');if(button)button.setAttribute('aria-expanded','false')}}
function refreshCustomSelect(select){const wrapper=select.closest('.custom-select');if(!wrapper)return;const button=wrapper.querySelector('.custom-select-button'),menu=wrapper.querySelector('.custom-select-menu');if(!button||!menu)return;const display=button.querySelector('.custom-select-label');const selected=select.selectedOptions[0];display.textContent=selected?selected.textContent:'Select filter';menu.replaceChildren();for(const option of select.options){const item=node('button',{type:'button',class:'custom-select-option'+(option.value===select.value?' selected':''),role:'option','aria-selected':String(option.value===select.value)},node('span',{},option.textContent),node('span',{class:'selected-mark'},option.value===select.value?'✓':''));item.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));closeCustomSelects();button.focus()};menu.append(item)}}
function installCustomSelects(){for(const select of $('filterPanel').querySelectorAll('select')){if(select.closest('.custom-select'))continue;const wrap=node('span',{class:'custom-select'});select.parentNode.insertBefore(wrap,select);wrap.append(select);select.tabIndex=-1;const button=node('button',{type:'button',class:'custom-select-button','aria-haspopup':'listbox','aria-expanded':'false','aria-label':select.getAttribute('aria-label')||select.parentElement.textContent.trim()||'Filter'},node('span',{class:'custom-select-label'},''));const arrow=node('svg',{class:'custom-select-chevron',viewBox:'0 0 24 24','aria-hidden':'true'});arrow.append(node('path',{d:'m6 9 6 6 6-6'}));button.append(arrow);const menu=node('div',{class:'custom-select-menu',role:'listbox'});menu.hidden=true;wrap.append(button,menu);button.onclick=()=>{const open=menu.hidden;closeCustomSelects();menu.hidden=!open;button.setAttribute('aria-expanded',String(open));wrap.classList.toggle('open',open);if(open){menu.querySelector('.selected')?.focus()}};button.onkeydown=e=>{if(['ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();button.click()}if(e.key==='Escape'){e.preventDefault();closeCustomSelects()}};menu.addEventListener('keydown',e=>{const opts=[...menu.querySelectorAll('.custom-select-option')];const current=opts.indexOf(document.activeElement);let index=e.key==='Home'?0:e.key==='End'?opts.length-1:e.key==='ArrowDown'?(current+1)%opts.length:e.key==='ArrowUp'?(current+opts.length-1)%opts.length:-1;if(index>=0){e.preventDefault();opts[index].focus()}else if(e.key==='Escape'){e.preventDefault();closeCustomSelects();button.focus()}});select.addEventListener('change',()=>refreshCustomSelect(select));refreshCustomSelect(select)}document.addEventListener('pointerdown',e=>{if(!e.target.closest('.custom-select'))closeCustomSelects()})}
function installViewportControls(){const up=$('pageScrollUp'),down=$('pageScrollDown'),rail=$('viewportScrollbar'),thumb=$('viewportScrollbarThumb'),track=$('viewportScrollbarTrack'),railUp=$('viewportScrollbarUp'),railDown=$('viewportScrollbarDown');const scrolling=()=>document.scrollingElement||document.documentElement;const metrics=()=>{const el=scrolling(),viewport=Math.max(1,el.clientHeight||innerHeight),height=Math.max(viewport,el.scrollHeight),max=Math.max(0,height-viewport),y=Math.min(max,Math.max(0,el.scrollTop));return{viewport,height,max,y}};const scrollToValue=(y,animate=true)=>window.scrollTo({top:Math.max(0,y),behavior:animate&&!document.body.classList.contains('reduce-motion')?'smooth':'auto'});const step=dir=>{const m=metrics();scrollToValue(m.y+dir*Math.max(120,m.viewport*.72))};up.onclick=()=>scrollToValue(0);down.onclick=()=>scrollToValue(metrics().max);railUp.onclick=()=>step(-1);railDown.onclick=()=>step(1);track.setAttribute('role','presentation');thumb.setAttribute('role','scrollbar');thumb.setAttribute('aria-orientation','vertical');thumb.setAttribute('aria-label','Page position');thumb.tabIndex=0;function sync(){const m=metrics(),visible=m.max>2,top=m.y<=2,bottom=m.y>=m.max-2;rail.classList.toggle('is-scrollable',visible);rail.classList.toggle('at-top',top);rail.classList.toggle('at-bottom',bottom);rail.dataset.endpoint=top?'top':bottom?'bottom':'middle';rail.setAttribute('aria-hidden',visible?'false':'true');rail.hidden=!visible;up.disabled=top;down.disabled=bottom;railUp.disabled=top;railDown.disabled=bottom;up.setAttribute('aria-disabled',String(top));down.setAttribute('aria-disabled',String(bottom));railUp.setAttribute('aria-disabled',String(top));railDown.setAttribute('aria-disabled',String(bottom));const trackHeight=Math.max(1,track.clientHeight),thumbHeight=Math.min(trackHeight,Math.max(46,trackHeight*(m.viewport/m.height))),travel=Math.max(0,trackHeight-thumbHeight);thumb.style.height=`${thumbHeight}px`;thumb.style.top='0';thumb.style.transform=`translateY(${m.max?(m.y/m.max)*travel:0}px)`;thumb.dataset.travel=String(travel);thumb.setAttribute('aria-valuemin','0');thumb.setAttribute('aria-valuemax',String(Math.round(m.max)));thumb.setAttribute('aria-valuenow',String(Math.round(m.y)));thumb.setAttribute('aria-valuetext',`${Math.round(m.max?(m.y/m.max)*100:0)}%`)}let drag=null;track.addEventListener('pointerdown',e=>{if(e.target===thumb)return;const rect=track.getBoundingClientRect(),mid=thumb.getBoundingClientRect().top+thumb.offsetHeight/2;step(e.clientY<mid?-1:1)});thumb.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const m=metrics();drag={pointerId:e.pointerId,startY:e.clientY,startScroll:m.y,max:m.max,travel:Number(thumb.dataset.travel)||0};thumb.setPointerCapture?.(e.pointerId);rail.classList.add('is-dragging')});thumb.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointerId||!drag.travel)return;scrollToValue(Math.min(drag.max,Math.max(0,drag.startScroll+(e.clientY-drag.startY)*(drag.max/drag.travel))),false)});const stop=e=>{if(!drag||e.pointerId!==drag.pointerId)return;drag=null;rail.classList.remove('is-dragging');try{thumb.releasePointerCapture?.(e.pointerId)}catch{}};thumb.addEventListener('pointerup',stop);thumb.addEventListener('pointercancel',stop);thumb.addEventListener('keydown',e=>{const m=metrics(),fine=Math.max(48,m.viewport*.1),page=Math.max(240,m.viewport*.72),val={ArrowUp:m.y-fine,ArrowDown:m.y+fine,PageUp:m.y-page,PageDown:m.y+page,Home:0,End:m.max}[e.key];if(val!==undefined){e.preventDefault();scrollToValue(Math.min(m.max,Math.max(0,val)))}});window.addEventListener('scroll',sync,{passive:true});window.addEventListener('resize',sync);if(typeof ResizeObserver!=='undefined')new ResizeObserver(sync).observe(document.body);requestAnimationFrame(sync)}


const REGIONAL_DEFAULTS={submitted:true,vendor:true,deviceType:false,mode:'auto',country:'auto',date:'auto',clock:'auto',timeZone:'auto',season:'auto',compact:false,motion:false};
const regional={...REGIONAL_DEFAULTS};
const COUNTRY_CODES=Object.freeze('AD,AE,AF,AG,AI,AL,AM,AO,AQ,AR,AS,AT,AU,AW,AX,AZ,BA,BB,BD,BE,BF,BG,BH,BI,BJ,BL,BM,BN,BO,BQ,BR,BS,BT,BV,BW,BY,BZ,CA,CC,CD,CF,CG,CH,CI,CK,CL,CM,CN,CO,CR,CU,CV,CW,CX,CY,CZ,DE,DJ,DK,DM,DO,DZ,EC,EE,EG,EH,ER,ES,ET,FI,FJ,FK,FM,FO,FR,GA,GB,GD,GE,GF,GG,GH,GI,GL,GM,GN,GP,GQ,GR,GS,GT,GU,GW,GY,HK,HM,HN,HR,HT,HU,ID,IE,IL,IM,IN,IO,IQ,IR,IS,IT,JE,JM,JO,JP,KE,KG,KH,KI,KM,KN,KP,KR,KW,KY,KZ,LA,LB,LC,LI,LK,LR,LS,LT,LU,LV,LY,MA,MC,MD,ME,MF,MG,MH,MK,ML,MM,MN,MO,MP,MQ,MR,MS,MT,MU,MV,MW,MX,MY,MZ,NA,NC,NE,NF,NG,NI,NL,NO,NP,NR,NU,NZ,OM,PA,PE,PF,PG,PH,PK,PL,PM,PN,PR,PS,PT,PW,PY,QA,RE,RO,RS,RU,RW,SA,SB,SC,SD,SE,SG,SH,SI,SJ,SK,SL,SM,SN,SO,SR,SS,ST,SV,SX,SY,SZ,TC,TD,TF,TG,TH,TJ,TK,TL,TM,TN,TO,TR,TT,TV,TW,TZ,UA,UG,UM,US,UY,UZ,VA,VC,VE,VG,VI,VN,VU,WF,WS,YE,YT,ZA,ZM,ZW,XK'.split(','));
const COUNTRY_PRIMARY_TIME_ZONES=Object.freeze({"AD":"Europe/Andorra","AE":"Asia/Dubai","AF":"Asia/Kabul","AG":"America/Antigua","AI":"America/Anguilla","AL":"Europe/Tirane","AM":"Asia/Yerevan","AO":"Africa/Luanda","AQ":"Antarctica/McMurdo","AR":"America/Argentina/Buenos_Aires","AS":"Pacific/Pago_Pago","AT":"Europe/Vienna","AU":"Australia/Sydney","AW":"America/Aruba","AX":"Europe/Mariehamn","AZ":"Asia/Baku","BA":"Europe/Sarajevo","BB":"America/Barbados","BD":"Asia/Dhaka","BE":"Europe/Brussels","BF":"Africa/Ouagadougou","BG":"Europe/Sofia","BH":"Asia/Bahrain","BI":"Africa/Bujumbura","BJ":"Africa/Porto-Novo","BL":"America/St_Barthelemy","BM":"Atlantic/Bermuda","BN":"Asia/Brunei","BO":"America/La_Paz","BQ":"America/Kralendijk","BR":"America/Sao_Paulo","BS":"America/Nassau","BT":"Asia/Thimphu","BV":"UTC","BW":"Africa/Gaborone","BY":"Europe/Minsk","BZ":"America/Belize","CA":"America/Toronto","CC":"Indian/Cocos","CD":"Africa/Kinshasa","CF":"Africa/Bangui","CG":"Africa/Brazzaville","CH":"Europe/Zurich","CI":"Africa/Abidjan","CK":"Pacific/Rarotonga","CL":"America/Santiago","CM":"Africa/Douala","CN":"Asia/Shanghai","CO":"America/Bogota","CR":"America/Costa_Rica","CU":"America/Havana","CV":"Atlantic/Cape_Verde","CW":"America/Curacao","CX":"Indian/Christmas","CY":"Asia/Nicosia","CZ":"Europe/Prague","DE":"Europe/Berlin","DJ":"Africa/Djibouti","DK":"Europe/Copenhagen","DM":"America/Dominica","DO":"America/Santo_Domingo","DZ":"Africa/Algiers","EC":"America/Guayaquil","EE":"Europe/Tallinn","EG":"Africa/Cairo","EH":"Africa/El_Aaiun","ER":"Africa/Asmara","ES":"Europe/Madrid","ET":"Africa/Addis_Ababa","FI":"Europe/Helsinki","FJ":"Pacific/Fiji","FK":"Atlantic/Stanley","FM":"Pacific/Pohnpei","FO":"Atlantic/Faroe","FR":"Europe/Paris","GA":"Africa/Libreville","GB":"Europe/London","GD":"America/Grenada","GE":"Asia/Tbilisi","GF":"America/Cayenne","GG":"Europe/Guernsey","GH":"Africa/Accra","GI":"Europe/Gibraltar","GL":"America/Nuuk","GM":"Africa/Banjul","GN":"Africa/Conakry","GP":"America/Guadeloupe","GQ":"Africa/Malabo","GR":"Europe/Athens","GS":"Atlantic/South_Georgia","GT":"America/Guatemala","GU":"Pacific/Guam","GW":"Africa/Bissau","GY":"America/Guyana","HK":"Asia/Hong_Kong","HM":"UTC","HN":"America/Tegucigalpa","HR":"Europe/Zagreb","HT":"America/Port-au-Prince","HU":"Europe/Budapest","ID":"Asia/Jakarta","IE":"Europe/Dublin","IL":"Asia/Jerusalem","IM":"Europe/Isle_of_Man","IN":"Asia/Kolkata","IO":"Indian/Chagos","IQ":"Asia/Baghdad","IR":"Asia/Tehran","IS":"Atlantic/Reykjavik","IT":"Europe/Rome","JE":"Europe/Jersey","JM":"America/Jamaica","JO":"Asia/Amman","JP":"Asia/Tokyo","KE":"Africa/Nairobi","KG":"Asia/Bishkek","KH":"Asia/Phnom_Penh","KI":"Pacific/Tarawa","KM":"Indian/Comoro","KN":"America/St_Kitts","KP":"Asia/Pyongyang","KR":"Asia/Seoul","KW":"Asia/Kuwait","KY":"America/Cayman","KZ":"Asia/Almaty","LA":"Asia/Vientiane","LB":"Asia/Beirut","LC":"America/St_Lucia","LI":"Europe/Vaduz","LK":"Asia/Colombo","LR":"Africa/Monrovia","LS":"Africa/Maseru","LT":"Europe/Vilnius","LU":"Europe/Luxembourg","LV":"Europe/Riga","LY":"Africa/Tripoli","MA":"Africa/Casablanca","MC":"Europe/Monaco","MD":"Europe/Chisinau","ME":"Europe/Podgorica","MF":"America/Marigot","MG":"Indian/Antananarivo","MH":"Pacific/Majuro","MK":"Europe/Skopje","ML":"Africa/Bamako","MM":"Asia/Yangon","MN":"Asia/Ulaanbaatar","MO":"Asia/Macau","MP":"Pacific/Saipan","MQ":"America/Martinique","MR":"Africa/Nouakchott","MS":"America/Montserrat","MT":"Europe/Malta","MU":"Indian/Mauritius","MV":"Indian/Maldives","MW":"Africa/Blantyre","MX":"America/Mexico_City","MY":"Asia/Kuala_Lumpur","MZ":"Africa/Maputo","NA":"Africa/Windhoek","NC":"Pacific/Noumea","NE":"Africa/Niamey","NF":"Pacific/Norfolk","NG":"Africa/Lagos","NI":"America/Managua","NL":"Europe/Amsterdam","NO":"Europe/Oslo","NP":"Asia/Kathmandu","NR":"Pacific/Nauru","NU":"Pacific/Niue","NZ":"Pacific/Auckland","OM":"Asia/Muscat","PA":"America/Panama","PE":"America/Lima","PF":"Pacific/Tahiti","PG":"Pacific/Port_Moresby","PH":"Asia/Manila","PK":"Asia/Karachi","PL":"Europe/Warsaw","PM":"America/Miquelon","PN":"Pacific/Pitcairn","PR":"America/Puerto_Rico","PS":"Asia/Gaza","PT":"Europe/Lisbon","PW":"Pacific/Palau","PY":"America/Asuncion","QA":"Asia/Qatar","RE":"Indian/Reunion","RO":"Europe/Bucharest","RS":"Europe/Belgrade","RU":"Europe/Moscow","RW":"Africa/Kigali","SA":"Asia/Riyadh","SB":"Pacific/Guadalcanal","SC":"Indian/Mahe","SD":"Africa/Khartoum","SE":"Europe/Stockholm","SG":"Asia/Singapore","SH":"Atlantic/St_Helena","SI":"Europe/Ljubljana","SJ":"Arctic/Longyearbyen","SK":"Europe/Bratislava","SL":"Africa/Freetown","SM":"Europe/San_Marino","SN":"Africa/Dakar","SO":"Africa/Mogadishu","SR":"America/Paramaribo","SS":"Africa/Juba","ST":"Africa/Sao_Tome","SV":"America/El_Salvador","SX":"America/Lower_Princes","SY":"Asia/Damascus","SZ":"Africa/Mbabane","TC":"America/Grand_Turk","TD":"Africa/Ndjamena","TF":"Indian/Kerguelen","TG":"Africa/Lome","TH":"Asia/Bangkok","TJ":"Asia/Dushanbe","TK":"Pacific/Fakaofo","TL":"Asia/Dili","TM":"Asia/Ashgabat","TN":"Africa/Tunis","TO":"Pacific/Tongatapu","TR":"Europe/Istanbul","TT":"America/Port_of_Spain","TV":"Pacific/Funafuti","TW":"Asia/Taipei","TZ":"Africa/Dar_es_Salaam","UA":"Europe/Kyiv","UG":"Africa/Kampala","UM":"Pacific/Wake","US":"America/New_York","UY":"America/Montevideo","UZ":"Asia/Tashkent","VA":"Europe/Vatican","VC":"America/St_Vincent","VE":"America/Caracas","VG":"America/Tortola","VI":"America/St_Thomas","VN":"Asia/Ho_Chi_Minh","VU":"Pacific/Efate","WF":"Pacific/Wallis","WS":"Pacific/Apia","YE":"Asia/Aden","YT":"Indian/Mayotte","ZA":"Africa/Johannesburg","ZM":"Africa/Lusaka","ZW":"Africa/Harare","XK":"Europe/Belgrade"});
const REGIONS=Object.fromEntries(COUNTRY_CODES.map(code=>{let lang='en';try{lang=new Intl.Locale('und-'+code).maximize().language||'en'}catch{}return[code,[lang+'-'+code,COUNTRY_PRIMARY_TIME_ZONES[code]||'UTC']]}));
let rememberLocalState=false;
function saveFavoritePreferences(){
 if(!rememberLocalState)return;
 const content={favorites:[...state.favorites],regional,pageSize:state.pageSize};
 safeStorageSet('openclscopeRememberedState',JSON.stringify(content));
}
function restoreRememberedPreferences(){
 const raw=safeStorageGet('openclscopeRememberedState');if(!raw)return;
 try{const value=JSON.parse(raw);if(!value||typeof value!=='object')return;
 rememberLocalState=true;
 if(Array.isArray(value.favorites))state.favorites=new Set(value.favorites.filter(v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v)).slice(0,300));
 if([25,50,100].includes(value.pageSize))state.pageSize=value.pageSize;
 for(const [key,allowed] of Object.entries({mode:['auto','country','manual'],country:['auto',...Object.keys(REGIONS)],date:['auto','dmy','mdy','ymd','long'],clock:['auto','12','24'],season:['auto','standard','daylight']}))if(allowed.includes(value.regional?.[key]))regional[key]=value.regional[key];
 if(typeof value.regional?.timeZone==='string'&&value.regional.timeZone.length<80)regional.timeZone=value.regional.timeZone;
 for(const field of ['submitted','vendor','deviceType'])if(typeof value.regional?.[field]==='boolean')regional[field]=value.regional[field];
 regional.compact=value.regional?.compact===true;regional.motion=value.regional?.motion===true;
 }catch{}
}
function formatReportDate(iso,clockOnly=false){
 if(!iso)return'Unknown date';const d=iso instanceof Date?iso:new Date(iso);if(Number.isNaN(d.getTime()))return text(iso);
 let locale=undefined,timeZone=undefined,dateMode=regional.date,hourCycle=regional.clock;
 if(regional.mode==='country'&&REGIONS[regional.country]){[locale,timeZone]=REGIONS[regional.country];dateMode='auto';hourCycle='auto'}
 if(regional.mode==='manual'&&regional.timeZone!=='auto')timeZone=regional.timeZone;
 if(regional.mode==='auto'){dateMode='auto';hourCycle='auto'}
 const options=clockOnly?{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZoneName:'short'}:{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'};
 if(!clockOnly&&(dateMode==='dmy'||dateMode==='mdy'||dateMode==='ymd')){options.month='2-digit';options.day='2-digit'}
 if(!clockOnly&&dateMode==='long')options.month='short';
 if(hourCycle==='12')options.hour12=true;if(hourCycle==='24')options.hour12=false;
 if(timeZone)options.timeZone=timeZone;
 let displayDate=d, forcedOffset='';
 if(regional.mode==='manual'&&regional.season!=='auto'&&timeZone){
  const offset=day=>{const item=new Intl.DateTimeFormat('en-US',{timeZone,timeZoneName:'shortOffset'}).formatToParts(day).find(p=>p.type==='timeZoneName')?.value||'';const m=/^(?:GMT|UTC)([+-])(\d{1,2})(?::(\d{2}))?$/.exec(item);return item==='GMT'||item==='UTC'?0:m?(m[1]==='-'?-1:1)*(+m[2]*60+(+m[3]||0)):null};
  try{const year=d.getUTCFullYear(),jan=offset(new Date(Date.UTC(year,0,15))),jul=offset(new Date(Date.UTC(year,6,15)));if(jan!==null&&jul!==null){const minutes=regional.season==='standard'?Math.min(jan,jul):Math.max(jan,jul);displayDate=new Date(d.getTime()+minutes*60000);options.timeZone='UTC';delete options.timeZoneName;forcedOffset=' UTC'+(minutes<0?'-':'+')+String(Math.floor(Math.abs(minutes)/60)).padStart(2,'0')+':'+String(Math.abs(minutes)%60).padStart(2,'0')}}catch{}
 }
 const actual=()=>new Intl.DateTimeFormat(locale,options).formatToParts(displayDate);
 try{
  if(!clockOnly&&dateMode!=='auto'){
   const parts=actual(),get=type=>parts.find(p=>p.type===type)?.value||'';
   const date=dateMode==='ymd'?[get('year'),get('month'),get('day')].join('-'):dateMode==='mdy'?[get('month'),get('day'),get('year')].join('/'):dateMode==='dmy'?[get('day'),get('month'),get('year')].join('/'):get('day')+' '+get('month')+' '+get('year');
   const clock=get('hour')+':'+get('minute')+(get('second')?':'+get('second'):'');
   return [date,clock,get('dayPeriod'),get('timeZoneName')+forcedOffset].filter(Boolean).join(' ');
  }
  return new Intl.DateTimeFormat(locale,options).format(displayDate)+forcedOffset;
 }catch{return new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(d)}
}
function parseFavoriteImport(raw){
 const value=JSON.parse(raw);
 if(!value||typeof value!=='object'||Array.isArray(value)||value.schema!=='openclscope-favorites-v1'||!Array.isArray(value.ids)||value.ids.length>300)throw Error('Invalid or oversized favorites backup');
 if(value.ids.some(id=>!validComparisonId(id)))throw Error('Favorites backup contains an invalid report ID');
 return [...new Set(value.ids)];
}
function renderSettingsFavorites(){
 const host=$('settingsFavorites');if(!host)return;host.replaceChildren();
 const toolRow=node('div',{class:'favorite-transfer-tools'});
 const exportBtn=node('button',{class:'primary-action',type:'button'},'Export favorites');exportBtn.disabled=!state.favorites.size;
 exportBtn.onclick=()=>makeDownload('OpenCLScope-Favorites.json',JSON.stringify({schema:'openclscope-favorites-v1',ids:[...state.favorites].sort()},null,2)+'\n','application/json;charset=utf-8');
 const importBtn=node('button',{class:'primary-action',type:'button'},'Import favorites');
 const input=node('input',{type:'file',accept:'.json,application/json','aria-label':'Select favorites backup',class:'favorite-import-file'});input.hidden=true;
 importBtn.onclick=()=>input.click();
 input.onchange=async()=>{const file=input.files?.[0];input.value='';if(!file)return;try{if(file.size>65536)throw Error('Backup exceeds the 64 KiB safety limit');const ids=parseFavoriteImport(await file.text());if(new Set([...state.favorites,...ids]).size>300)throw Error('Maximum 300 favorites');const old=state.favorites.size;ids.forEach(id=>state.favorites.add(id));saveFavoritePreferences();renderSettingsFavorites();render();notice(`Imported ${state.favorites.size-old} new local favorites. They are ${rememberLocalState?'saved in this browser':'session-only'}.`)}catch(error){notice('Favorites import rejected: '+error.message)}};
 toolRow.append(exportBtn,importBtn,input);host.append(toolRow,node('p',{class:'evidence-note'},'Backup contains report IDs only, not report contents. Import merges into this browser; persistence requires Remember on this device.'));
 if(!state.favorites.size){host.append(node('div',{class:'settings-empty'},'No favorite reports yet.'));return}
 for(const id of state.favorites){const r=state.rows.find(row=>row.id===id);const container=node('div',{class:'settings-favorite-item'});
 const open=node('button',{type:'button',class:'settings-favorite-open'},node('strong',{},r?.device_name||'Report not in the current index'),node('span',{},id.slice(0,12)+'…'));
 open.onclick=()=>{closeSettings();openReport(id)};
 const remove=node('button',{type:'button',class:'settings-favorite-remove','aria-label':'Remove favorite'},'×');remove.onclick=()=>{state.favorites.delete(id);saveFavoritePreferences();renderSettingsFavorites();if(state.detail?.id===id)$('favoriteToggle').textContent='☆ Favorite';render()};
 container.append(open,remove);host.append(container);
 }
}
let settingsActiveCategory='favorites';
function setSettingsCategory(category){settingsActiveCategory=category;for(const tab of document.querySelectorAll('[data-settings-category]')){const active=tab.dataset.settingsCategory===category;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1}
 for(const panel of document.querySelectorAll('[data-settings-panel]')){const active=panel.dataset.settingsPanel===category;panel.hidden=!active;if(active&&!document.body.classList.contains('reduce-motion')&&typeof panel.animate==='function'){panel.getAnimations().forEach(a=>a.cancel());panel.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'cubic-bezier(.2,.8,.2,1)'})}}
 if(category==='favorites')renderSettingsFavorites();if(category==='internet'){refreshSettingsInformation();loadNetworkObservation(false)}if(category==='information')renderSettingsInformation()}
function updateSettingsClock(){if(!$('settingsLocalClock'))return;$('settingsLocalClock').textContent=formatReportDate(new Date(),true);$('settingsLocalTimezone').textContent=Intl.DateTimeFormat().resolvedOptions().timeZone||'Browser local time';}
let networkObservation=null,networkObservationError='',networkBusy=false,networkLastAt=0;
function settingsInfoRow(label,value){return node('div',{class:'settings-info-row'},node('span',{},label),node('strong',{},text(value)||'Not observed'))}
function maskedIp(label,value,family){const row=node('div',{class:'settings-info-row settings-info-address'},node('span',{},label));if(!value){row.append(node('strong',{},'Not observed on this request'));return row}const valueNode=node('strong',{class:family==='IPv6'?'network-ipv6':'network-ipv4'},'••••••••');const reveal=node('button',{class:'ip-reveal',type:'button','aria-pressed':'false','aria-label':'Show '+label},'Show');let revealed=false;reveal.onclick=()=>{revealed=!revealed;valueNode.textContent=revealed?text(value):'••••••••';reveal.textContent=revealed?'Hide':'Show';reveal.setAttribute('aria-label',(revealed?'Hide ':'Show ')+label);reveal.setAttribute('aria-pressed',String(revealed))};row.append(node('div',{class:'ip-action'},valueNode,reveal));return row}
function renderNetworkInfo(){const host=$('networkInfo');if(!host)return;host.replaceChildren();const summary=node('div',{class:'settings-network-summary'},node('strong',{},navigator.onLine===false?'Offline':'Browser online'),node('small',{},'Request-scoped connection observations. IP values are masked until Show is selected.'));host.append(summary);const refresh=node('button',{type:'button',class:'network-refresh'},networkBusy?'Checking connection…':'Refresh network details');refresh.disabled=networkBusy;refresh.onclick=()=>loadNetworkObservation(true);host.append(refresh);if(networkBusy&&!networkObservation){host.append(node('p',{},'Reading current connection…'));return}if(networkObservationError)host.append(node('p',{class:'settings-message settings-message-warning'},networkObservationError));if(!networkObservation){host.append(node('p',{},API?'Select Refresh to read Cloudflare request information. No IP address is saved to reports.':'Production API is not configured. Set OPENCLSCOPE_DATABASE_API in the Pages deployment to enable live IP information.'));return}const n=networkObservation;const grid=node('div',{class:'settings-info-grid'},settingsInfoRow('Connection used',n.accessFamily),maskedIp('Active address',n.activeAddress,n.accessFamily),maskedIp('IPv4',n.ipv4?.address,'IPv4'),maskedIp('IPv6',n.ipv6?.address,'IPv6'),maskedIp('Pseudo IPv4',n.pseudoIPv4,'IPv4'));for(const [label,key] of [['Country','country'],['Region','region'],['City','city'],['Continent','continent'],['Network / ASN organization','asOrganization'],['ASN','asn'],['Cloudflare edge','colo'],['HTTP','httpProtocol'],['TLS','tlsVersion'],['TLS cipher','tlsCipher'],['Client TCP RTT','clientTcpRtt'],['Client QUIC RTT','clientQuicRtt'],['Server time','serverTime']])grid.append(settingsInfoRow(label,n[key]));grid.append(settingsInfoRow('DNS resolver','Not observable from this site request'),settingsInfoRow('Browser language',navigator.language||'Unknown'),settingsInfoRow('Effective network class',navigator.connection?.effectiveType||'Not exposed'),settingsInfoRow('Data saver',navigator.connection?.saveData===true?'On':navigator.connection?.saveData===false?'Off':'Not exposed'));host.append(grid,node('p',{class:'settings-help'},'Country, region and IP information are observations from this HTTP request, not information stored in reports. Unobserved address families are not invented. IPv4 is orange and IPv6 is green. Browser network class is an estimate, not Wi-Fi/FTTH technology.'))}
async function loadNetworkObservation(force=false){if(networkBusy||(!force&&Date.now()-networkLastAt<30000))return;if(!API||navigator.onLine===false){networkObservationError=!API?'Production API is not configured.':'Browser is offline.';renderNetworkInfo();return}networkBusy=true;networkObservationError='';renderNetworkInfo();try{const fresh=await api('/v1/network-info');if(fresh.networkInfoVersion!==1)throw Error('Unexpected network response');networkObservation=fresh;networkLastAt=Date.now()}catch(error){networkObservationError='Network observation failed: '+text(error.message).slice(0,160)}finally{networkBusy=false;renderNetworkInfo()}}
const SETTINGS_DEPENDENCIES=[
 {scope:'Browser runtime',name:'OpenCLScope Database frontend',version:'3.0.14',license:'First-party project code',purpose:'Local HTML, CSS and vanilla JavaScript. No third-party browser framework, remote font, analytics or advertising script is bundled.',source:'This release'},
 {scope:'Development / deployment',name:'Wrangler',version:'4.130.0',license:'MIT OR Apache-2.0',purpose:'Cloudflare Worker development and deployment CLI. Not sent to the browser.',source:'worker/package.json',file:'wrangler'},
 {scope:'Toolchain component',name:'sharp',version:'0.35.4',license:'Apache-2.0',purpose:'Pinned toolchain override for Cloudflare development tooling; not a Pages runtime dependency.',source:'worker/package.json override',file:'sharp'},
 {scope:'Toolchain component',name:'esbuild',version:'Resolved by Wrangler 4.130.0',license:'MIT',purpose:'Transitive JS build helper; this project does not pin its resolved transitive version.',source:'Wrangler toolchain dependency',file:'esbuild'},
 {scope:'Worker runtime / tooling',name:'workerd',version:'Resolved by Wrangler 4.130.0',license:'Apache-2.0',purpose:'Cloudflare Workers runtime used by development and managed deployment.',source:'Wrangler toolchain dependency',file:'workerd'},
 {scope:'Database service',name:'Cloudflare D1',version:'Managed service',license:'Service · not a bundled library',purpose:'SQLite-compatible public report storage; no report values are simulated or preloaded as samples.',source:'worker/wrangler.jsonc'},
 {scope:'Browser runtime',name:'Web Platform APIs',version:'Browser-provided',license:'Platform APIs',purpose:'Fetch, Intl, URL, Web Animations, Storage and DOM; available capabilities depend on the browser.',source:'Browser implementation'},
 {scope:'Tests / release tooling',name:'Node.js standard library',version:'Runtime-provided',license:'MIT and bundled notices',purpose:'Core Node.js modules for build and tests; no independent npm runtime package.',source:'Node.js runtime',file:'nodejs'},
 {scope:'Tests / release tooling',name:'Python standard library',version:'Python 3 runtime-provided',license:'Python Software Foundation License',purpose:'Standard-library tooling for package integrity, source checks and release generation.',source:'Python runtime',file:'python'}
];
const SETTINGS_LICENSE_FILES=new Set(SETTINGS_DEPENDENCIES.map(item=>item.file).filter(Boolean));
let licenseReturnFocus=null;
function closeDependencyLicense(){const dialog=$('licenseViewerDialog'),backdrop=$('licenseViewerBackdrop');if(!dialog||dialog.hidden)return;dialog.classList.remove('open');backdrop.classList.remove('open');dialog.hidden=true;backdrop.hidden=true;document.body.classList.remove('license-viewer-open');if(licenseReturnFocus?.isConnected)licenseReturnFocus.focus();licenseReturnFocus=null}
function initDependencyLicense(){if($('licenseViewerDialog'))return;const backdrop=node('div',{id:'licenseViewerBackdrop',class:'license-viewer-backdrop',hidden:''});const dialog=node('section',{id:'licenseViewerDialog',class:'license-viewer-dialog',role:'dialog','aria-modal':'true','aria-labelledby':'licenseViewerTitle',hidden:''},node('div',{class:'license-viewer-head'},node('div',{},node('span',{class:'eyebrow'},'LICENSE DOCUMENT'),node('h2',{id:'licenseViewerTitle'},'License'),node('p',{id:'licenseViewerSource'},'')),node('button',{type:'button',class:'settings-close',id:'licenseViewerClose','aria-label':'Close license document'},node('svg',{viewBox:'0 0 24 24','aria-hidden':'true'},node('path',{d:'M6 6l12 12M18 6 6 18'})))),node('div',{class:'license-viewer-body'},node('pre',{id:'licenseViewerText'},'')));
 document.body.append(backdrop,dialog);$('licenseViewerClose').onclick=closeDependencyLicense;backdrop.onclick=closeDependencyLicense;
}
async function openDependencyLicense(file,name){if(!SETTINGS_LICENSE_FILES.has(file))return;initDependencyLicense();licenseReturnFocus=document.activeElement;const dialog=$('licenseViewerDialog');$('licenseViewerTitle').textContent=name+' license';$('licenseViewerSource').textContent='licenses/'+file+'.md';$('licenseViewerText').textContent='Loading license…';dialog.hidden=false;$('licenseViewerBackdrop').hidden=false;dialog.classList.add('open');$('licenseViewerBackdrop').classList.add('open');document.body.classList.add('license-viewer-open');$('licenseViewerClose').focus();try{const res=await fetch('./licenses/'+file+'.md',{cache:'no-store',credentials:'same-origin'});if(!res.ok)throw Error('HTTP '+res.status);const body=await res.text();if(body.length>524288)throw Error('Oversized document');if(!dialog.hidden)$('licenseViewerText').textContent=body}catch{if(!dialog.hidden)$('licenseViewerText').textContent='The local license document could not be loaded.'}}
function renderSettingsInformation(){const host=$('settingsInformation');if(!host)return;const note=node('div',{class:'khronos-independence-notice independence-notice-card',role:'note'},node('span',{class:'independence-info-icon','aria-hidden':'true'},node('svg',{viewBox:'0 0 24 24'},node('circle',{cx:'12',cy:'12',r:'9'}),node('path',{d:'M12 10v6 M12 7h.01'}))),node('span',{},'OpenCLScope is independent and is not affiliated with the Khronos Group or an official Khronos Group project.'));
 const summary=node('div',{class:'settings-release-summary'},...[["Database release","3.0.14"],["Frontend dependencies","0 third-party runtime libraries"],["Worker direct npm dependencies","Wrangler 4.130.0 · development only"]].map(([k,v])=>node('div',{},node('span',{},k),node('strong',{},v))));
 const explanation=node('p',{class:'settings-information-note'},'Only components declared by this repository or supplied by the browser/service are listed. Transitive toolchain versions are not invented. Local Markdown documents reproduce the corresponding pinned reference license notices. These packages are not bundled into the Pages frontend.');
 const cards=node('div',{class:'settings-library-list'});
 for(const item of SETTINGS_DEPENDENCIES){const card=node('article',{class:'settings-library-card'},node('div',{class:'settings-library-head'},node('div',{},node('span',{},item.scope),node('h4',{},item.name)),node('span',{class:'settings-library-license'},item.license)),node('dl',{},...[["Version",item.version],["Purpose",item.purpose],["Source / declaration",item.source]].map(([a,b])=>node('div',{},node('dt',{},a),node('dd',{},b)))));if(item.file){const button=node('button',{type:'button',class:'settings-license-read'},node('svg',{viewBox:'0 0 24 24','aria-hidden':'true'},node('path',{d:'M6 3h9l3 3v15H6z M14 3v4h4 M9 11h6 M9 15h6'})),node('span',{},'Read license (.md)'));button.onclick=()=>openDependencyLicense(item.file,item.name);card.append(node('div',{class:'settings-library-actions'},button))}cards.append(card)}
 host.replaceChildren(note,summary,explanation,cards,node('p',{class:'trademark-note settings-message'},'OpenCL™ and the OpenCL logo are trademarks of The Khronos Group Inc.'));
}
function browserCapability(label,value){return settingsInfoRow(label,value?'Available':'Unavailable')}
function renderBrowserInformation(){const target=$('browserInfo');if(!target)return;const userAgent=navigator.userAgent||'Not exposed';const agent=/EdgA?\/(\d+[\d.]*)/.exec(userAgent)||/Firefox\/(\d+[\d.]*)/.exec(userAgent)||/Chrome\/(\d+[\d.]*)/.exec(userAgent)||/Version\/(\d+[\d.]*)/.exec(userAgent);const browser=agent?(userAgent.includes('Edg/')||userAgent.includes('EdgA/')?'Microsoft Edge':userAgent.includes('Firefox/')?'Firefox':userAgent.includes('Chrome/')?'Google Chrome':'Safari'):'Unknown browser';const version=agent?.[1]||'Not exposed';const zone=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Not exposed'}catch{return'Not exposed'}})();const rows=[['Browser',browser+' '+version],['User agent',userAgent],['Platform',navigator.userAgentData?.platform||navigator.platform||'Not exposed'],['Languages',Array.isArray(navigator.languages)?navigator.languages.join(', '):navigator.language||'Not exposed'],['Time zone',zone],['Online',navigator.onLine===false?'No':'Yes'],['Cookies',navigator.cookieEnabled?'Enabled':'Disabled'],['Do Not Track',navigator.doNotTrack==='1'?'Enabled':navigator.doNotTrack==='0'?'Disabled':'Not exposed'],['Maximum touch points',Number.isFinite(navigator.maxTouchPoints)?String(navigator.maxTouchPoints):'Not exposed'],['Logical CPU cores',Number.isFinite(navigator.hardwareConcurrency)?String(navigator.hardwareConcurrency):'Not exposed'],['Viewport',window.innerWidth+' × '+window.innerHeight+' CSS px'],['Screen size',screen?.width&&screen?.height?screen.width+' × '+screen.height+' CSS px':'Not exposed'],['Pixel ratio',String(window.devicePixelRatio||1)],['Data persistence',rememberLocalState?'Opted in':'Session only'],['Indexed reports',String(state.snapshotCount||0)]];
 const flags=[['Secure context',window.isSecureContext],['Service Worker','serviceWorker'in navigator],['WebAssembly',typeof WebAssembly==='object'],['WebGPU','gpu'in navigator],['WebGL 2 API','WebGL2RenderingContext'in window],['Web Animations',typeof Element.prototype.animate==='function'],['ResizeObserver',typeof ResizeObserver!=='undefined'],['Local storage',(()=>{try{return !!window.localStorage}catch{return false}})()]];
 target.replaceChildren(node('div',{class:'settings-browser-summary settings-browser-summary-text'},node('strong',{},browser+' '+version),node('small',{},'Local browser observations')),node('div',{class:'settings-browser-subhead'},'Runtime & identity'),node('div',{class:'settings-info-grid settings-browser-grid'},...rows.map(([k,v])=>settingsInfoRow(k,v))),node('div',{class:'settings-browser-subhead'},'Web platform capabilities'),node('div',{class:'settings-info-grid settings-browser-grid'},...flags.map(([k,v])=>browserCapability(k,v))),node('p',{class:'settings-help'},'Browser details are read from local Web APIs. They are not attached to OpenCLScope reports and are not stored in D1. Unknown or unavailable capabilities are not inferred.'));
}
function refreshSettingsInformation(){updateSettingsClock();renderNetworkInfo();renderBrowserInformation()}

function syncRegionalSettingsControls(){for(const [id,key] of [['settingsRegionalMode','mode'],['settingsRegionalCountry','country'],['settingsRegionalDateFormat','date'],['settingsRegionalClock','clock'],['settingsRegionalTimeZone','timeZone'],['settingsRegionalSeason','season']]){
 const el=$(id);if(!el)continue;el.value=regional[key];if(!el.value&&el.options.length)el.selectedIndex=0;
 const enabled=(key==='mode')||(regional.mode==='country'&&key==='country')||(regional.mode==='manual'&&!['country','mode'].includes(key));el.disabled=!enabled;}
 $('compactMode').checked=regional.compact;$('reduceMotion').checked=regional.motion;
 for(const [id,key]of [['settingsSubmittedDefault','submitted'],['settingsVendorDefault','vendor'],['settingsTypeDefault','deviceType']])$(id).checked=regional[key];
 document.body.classList.toggle('compact',regional.compact);document.body.classList.toggle('reduce-motion',regional.motion);
 $('settingsRememberLocalState').checked=rememberLocalState;
 $('settingsStorageStatus').textContent=rememberLocalState?'Saved locally in this browser; not in the Database.':'Session-only preferences. Enable Remember on this device to persist.';
 $('settingsFavoritesPersistence').textContent=rememberLocalState?'Favorites are remembered only in this browser.':'Favorites are session-only until Remember on this device is enabled.';
 $('settingsRegionalPreview').textContent='Preview: '+formatReportDate(new Date());
}

let activeConfirm=null;
function confirmDestructive(message,action){
 if(activeConfirm)return;
 const dialog=$('destructiveConfirmDialog'),backdrop=$('destructiveConfirmBackdrop'),accept=$('destructiveConfirmAccept'),cancel=$('destructiveConfirmCancel');
 const previous=document.activeElement;
 $('destructiveConfirmTitle').textContent='Confirm action';$('destructiveConfirmMessage').textContent=message;
 dialog.hidden=false;backdrop.hidden=false;
 function close(run){if(!activeConfirm)return;activeConfirm=null;dialog.hidden=true;backdrop.hidden=true;document.removeEventListener('keydown',onKey,true);accept.onclick=null;cancel.onclick=null;backdrop.onclick=null;if(previous?.isConnected)previous.focus();if(run)action()}
 function onKey(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(false)}else if(e.key==='Tab'){const first=cancel,last=accept;if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}
 activeConfirm={close};cancel.onclick=()=>close(false);accept.onclick=()=>close(true);backdrop.onclick=()=>close(false);
 document.addEventListener('keydown',onKey,true);cancel.focus();
}
function installSettingsPreferences(){
 const country=$('settingsRegionalCountry');
 const display=(()=>{try{return new Intl.DisplayNames(['en'],{type:'region'})}catch{return null}})();
 country.replaceChildren(node('option',{value:'auto'},'Browser / system region'),...COUNTRY_CODES.map(code=>({code,name:display?.of(code)||code})).sort((a,b)=>a.name.localeCompare(b.name)).map(v=>node('option',{value:v.code},v.name+' ('+v.code+')')));
 const zones=$('settingsRegionalTimeZone');const known=['UTC'];try{known.push(...Intl.supportedValuesOf('timeZone'))}catch{known.push(...Object.values(REGIONS).map(v=>v[1]))}
 for(const zone of [...new Set(known)])if(zone!=='UTC')zones.append(node('option',{value:zone},zone));
 for(const tab of document.querySelectorAll('[data-settings-category]')){tab.onclick=()=>setSettingsCategory(tab.dataset.settingsCategory);tab.onkeydown=e=>{const tabs=[...document.querySelectorAll('[data-settings-category]')],idx=tabs.indexOf(tab);const next=e.key==='ArrowRight'||e.key==='ArrowDown'?(idx+1)%tabs.length:e.key==='ArrowLeft'||e.key==='ArrowUp'?(idx+tabs.length-1)%tabs.length:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;if(next!==null){e.preventDefault();tabs[next].focus();setSettingsCategory(tabs[next].dataset.settingsCategory)}}}
 for(const [id,key] of [['settingsRegionalMode','mode'],['settingsRegionalCountry','country'],['settingsRegionalDateFormat','date'],['settingsRegionalClock','clock'],['settingsRegionalTimeZone','timeZone'],['settingsRegionalSeason','season']])$(id).onchange=e=>{regional[key]=e.target.value;if(key==='mode'&&regional.mode==='manual')regional.country='auto';if(key==='mode'&&regional.mode==='country'&&regional.country==='auto'){const lang=navigator.language?.split('-')[1]?.toUpperCase();regional.country=REGIONS[lang]?lang:'auto'}syncRegionalSettingsControls();saveFavoritePreferences();render()};
 for(const [id,key] of [['settingsSubmittedDefault','submitted'],['settingsVendorDefault','vendor'],['settingsTypeDefault','deviceType']])$(id).onchange=e=>{regional[key]=e.target.checked;saveFavoritePreferences();render()};
 for(const [id,key,klass] of [['compactMode','compact','compact'],['reduceMotion','motion','reduce-motion']])$(id).onchange=e=>{regional[key]=e.target.checked;document.body.classList.toggle(klass,regional[key]);saveFavoritePreferences()};
 $('settingsRememberLocalState').onchange=e=>{rememberLocalState=e.target.checked;if(rememberLocalState)saveFavoritePreferences();else{try{localStorage.removeItem('openclscopeRememberedState')}catch{}}syncRegionalSettingsControls();renderSettingsFavorites()};
 $('settingsClearSavedData').onclick=()=>confirmDestructive('Clear saved browser data? This removes local Favorites and preferences. It never deletes reports.',()=>{
 state.favorites.clear();Object.assign(regional,REGIONAL_DEFAULTS);rememberLocalState=false;state.pageSize=25;state.page=0;
 try{for(const key of ['openclscopeRememberedState','openclscopeFavorites','openclscope-compact','openclscope-reduce-motion','openclscope-page-limit'])localStorage.removeItem(key)}catch{}
 $('pageLimit').value='25';syncRegionalSettingsControls();renderSettingsFavorites();render()});
 syncRegionalSettingsControls();setSettingsCategory('favorites');
}
setInterval(()=>{if(!$('settingsDrawer').hidden&&!document.querySelector('[data-settings-panel="internet"]')?.hidden)updateSettingsClock()},1000);
window.addEventListener('focus',updateSettingsClock);document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateSettingsClock()});

async function start(){
  restoreRememberedPreferences();
  installIcons();bind();bindNavigationScroll();
  installCustomSelects();installViewportControls();$('runtimeStatus').textContent=API?`Configured API: ${API}`:'API URL is not configured. Published snapshot remains available.';
  const results=await Promise.allSettled([
    fetch('./data/index.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Missing published index');return r.json()}),
    fetch('./data/snapshot.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Missing published snapshot');return r.json()}),
    fetch('./assets/catalog.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Missing registry');return r.json()}),
    fetch('./assets/encyclopedia.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Missing encyclopedia');return r.json()})
  ]);
  const index=results[0].status==='fulfilled'?results[0].value:{reports:[]},snapshot=results[1].status==='fulfilled'?results[1].value:{reports:[]};
  state.catalog=results[2].status==='fulfilled'?results[2].value:null;
  state.encyclopedia=results[3].status==='fulfilled'?results[3].value:null;
  if(index.schemaVersion===1&&Array.isArray(index.reports)){addRows(index.reports);state.snapshotCount=index.reportCount||0}
  if(snapshot.schemaVersion===1&&Array.isArray(snapshot.reports)&&snapshot.databaseReleaseVersion===index.databaseReleaseVersion&&snapshot.generatedAt===index.generatedAt&&snapshot.reportCount===index.reportCount)addRows(snapshot.reports);
  $('sourceBadge').textContent=`Cache loaded · ${state.rows.length} reports · ${state.reports.size} full`;
  $('databaseLoading').hidden=true;$('pageProgress').hidden=true;metrics();notice(index.generatedAt?`Cached published snapshot · ${humanDate(index.generatedAt)}`:'No reports in the published snapshot yet.');render();
  if(location.hash.startsWith('#reports/'))await openHash();else if(restoreCompareRoute())render();else if(panes[location.hash.slice(1)]){state.view=location.hash.slice(1);render()}
  if(API){await update();setInterval(()=>update(),10000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)update()});window.addEventListener('online',()=>update())}
  else banner('Published snapshot only · production API is not configured','warning');
  window.addEventListener('offline',()=>banner('Offline · cached reports remain available','warning'));
}
start().catch(error=>{$('databaseLoading').hidden=true;$('pageProgress').hidden=true;notice(`Unable to start Database: ${error.message}`)});


function updateTableScroller(w){const s=w?.querySelector('.table-wrap'),t=w?.querySelector('.table-scroll-track'),thumb=w?.querySelector('.table-scroll-thumb'),l=w?.querySelector('.table-scroll-left'),r=w?.querySelector('.table-scroll-right'),le=w?.querySelector('.table-edge-left'),re=w?.querySelector('.table-edge-right');if(!s||!t||!thumb||!l||!r)return;const max=Math.max(0,s.scrollWidth-s.clientWidth),overflow=max>2,atStart=s.scrollLeft<=2,atEnd=s.scrollLeft>=max-2;w.classList.toggle('scrollable',overflow);l.disabled=!overflow||atStart;r.disabled=!overflow||atEnd;le?.classList.toggle('visible',overflow&&!atStart);re?.classList.toggle('visible',overflow&&!atEnd);const tw=t.clientWidth||1,ratio=Math.min(1,s.clientWidth/Math.max(1,s.scrollWidth)),ww=Math.max(34,Math.round(tw*ratio)),range=Math.max(0,tw-ww),pos=max?Math.round(range*(s.scrollLeft/max)):0;thumb.style.width=`${ww}px`;thumb.style.transform=`translateX(${pos}px)`;thumb.setAttribute('aria-valuenow',String(Math.round(max?s.scrollLeft/max*100:0)))}
function enhanceTableScroller(s){if(!s||s.dataset.scrollEnhanced==='1')return;s.dataset.scrollEnhanced='1';const w=document.createElement('div');w.className='table-scroll-shell';s.parentNode.insertBefore(w,s);w.appendChild(s);w.insertAdjacentHTML('beforeend',`<div class="table-edge table-edge-left" aria-hidden="true"></div><div class="table-edge table-edge-right" aria-hidden="true"></div><div class="table-scroll-controls"><button type="button" class="table-scroll-button table-scroll-left" aria-label="Scroll table left"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button><div class="table-scroll-track" role="scrollbar" aria-label="Horizontal table position" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"><div class="table-scroll-thumb"></div></div><button type="button" class="table-scroll-button table-scroll-right" aria-label="Scroll table right"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button></div>`);const l=w.querySelector('.table-scroll-left'),r=w.querySelector('.table-scroll-right'),t=w.querySelector('.table-scroll-track'),thumb=w.querySelector('.table-scroll-thumb');const step=dir=>s.scrollBy({left:dir*Math.max(180,Math.round(s.clientWidth*.72)),behavior:'smooth'});l.onclick=()=>step(-1);r.onclick=()=>step(1);let raf=0;s.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;updateTableScroller(w)})},{passive:true});s.addEventListener('wheel',e=>{if(s.scrollWidth<=s.clientWidth)return;if(e.shiftKey&&Math.abs(e.deltaY)>0){e.preventDefault();s.scrollLeft+=e.deltaY}},{passive:false});t.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1)}else if(e.key==='Home'){e.preventDefault();s.scrollTo({left:0,behavior:'smooth'})}else if(e.key==='End'){e.preventDefault();s.scrollTo({left:s.scrollWidth,behavior:'smooth'})}});t.addEventListener('pointerdown',e=>{e.preventDefault();t.setPointerCapture?.(e.pointerId);const rect=t.getBoundingClientRect(),tw=rect.width||1,thumbW=thumb.getBoundingClientRect().width,range=Math.max(1,tw-thumbW),max=Math.max(0,s.scrollWidth-s.clientWidth);const set=x=>{const p=Math.max(0,Math.min(range,x-rect.left-thumbW/2));s.scrollLeft=max*(p/range)};set(e.clientX);const move=ev=>set(ev.clientX),up=ev=>{t.releasePointerCapture?.(ev.pointerId);t.removeEventListener('pointermove',move);t.removeEventListener('pointerup',up);t.removeEventListener('pointercancel',up)};t.addEventListener('pointermove',move);t.addEventListener('pointerup',up);t.addEventListener('pointercancel',up)});requestAnimationFrame(()=>updateTableScroller(w))}
function enhanceTableScrollers(root=document){root.querySelectorAll?.('.table-wrap:not([data-scroll-enhanced="1"])').forEach(enhanceTableScroller)}
const tableObserver=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('.table-wrap'))enhanceTableScroller(n);enhanceTableScrollers(n)}});tableObserver.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('resize',()=>document.querySelectorAll('.table-scroll-shell').forEach(updateTableScroller),{passive:true});

