import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const app=readFileSync(new URL('assets/app.v1028.js',root),'utf8');
const html=readFileSync(new URL('index.html',root),'utf8');
const start=app.indexOf('const REPORT_SORT_OPTIONS=');
const end=app.indexOf('function profiles(',start);
const helpers=app.slice(app.indexOf('function text('),app.indexOf('function vendorLogo('));
const context=vm.createContext({Intl});
vm.runInContext(helpers+'\n'+app.slice(start,end),context);
const sort=vm.runInContext('sortReportSummaries',context);
const options=vm.runInContext('REPORT_SORT_OPTIONS',context);
const sample=[
 {id:'b',submitted_at:'2026-10-20T12:00:00Z',device_name:'GPU 10',driver_version:'Driver 2.9',opencl_version:'OpenCL 2.2',app_version:'3.0.8',vendor:'Zulu',platform_name:'P2'},
 {id:'a',submitted_at:'2026-10-18T12:00:00Z',device_name:'GPU 2',driver_version:'Driver 2.10',opencl_version:'OpenCL 3.0',app_version:'3.0.11',vendor:'Alpha',platform_name:'P1'},
 {id:'c',submitted_at:'2026-10-20T12:00:00Z',device_name:'GPU 1',driver_version:'Driver 2.8',opencl_version:'OpenCL 1.2',app_version:'3.0.7',vendor:'Zed',platform_name:'P3'}
];
const ids=mode=>sort(sample,mode).map(x=>x.id).join('');
test('Reports sort uses numeric-aware versions with explicit stable timestamp/id ties',()=>{
 assert.equal(ids('newest'),'bca');
 assert.equal(ids('oldest'),'abc');
 assert.equal(ids('driver-desc'),'abc');
 assert.equal(ids('api-desc'),'abc');
 assert.equal(ids('device'),'cab');
 assert.equal(ids('device-desc'),'bac');
 assert.equal(ids('app-desc'),'abc');
 assert.equal(ids('vendor-asc'),'acb');
 assert.equal(ids('platform-desc'),'cba');
});
test('Every report sort value exists in toolbar and native authoritative filter',()=>{
 assert.equal(options.length,14);
 for(const [mode] of options)assert.ok(html.includes('value="'+mode+'"'),'Missing native filter: '+mode);
 assert.match(app,/\.\.\.REPORT_SORT_OPTIONS\.map/);
 assert.match(app,/rows\.length\?`Showing/);
 assert.match(app,/replaceChildren\(bar,node\('div',\{class:'table-wrap reports-table-wrap'\},table\)\)/);
});
test('Reference-style disclosure icon and post-transition scroll bar refresh are bound',()=>{
 assert.ok(app.includes("node('path',{d:'M5 7h14 M5 12h14 M5 17h14'})"));
 assert.match(app,/reveal\.addEventListener\('transitionend',\(\)=>updateTableScroller\(shell\)/);
});
