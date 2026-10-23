import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const load=name=>readFile(new URL(name,root),'utf8');
const html=await load('index.html');
const app=await load('assets/app.v3415.js');
const shared=await load('assets/reference-shell.v3415.css');
const upstream=await load('assets/vulkan-layout.v1412.css');
test('Vulkan 1.4.12 global search SVG and upstream clear behavior are reused',()=>{
 assert.match(html,/class="search-clear-button global-search-clear is-hidden" id="globalSearchClear"/);
 assert.match(html,/M7 7l10 10M17 7 7 17/);
 assert.match(app,/function syncGlobalSearchClear\(/);
 assert.match(app,/button\.classList\.toggle\('is-hidden',isEmpty\)/);
 assert.match(app,/button\.setAttribute\('aria-hidden',String\(isEmpty\)\)/);
 assert.match(app,/globalSearchTimer=setTimeout\(\(\)=>render\(\),90\)/);
 assert.match(upstream,/\.search-clear-button\.is-hidden/);
 assert.match(shared,/\.search-box \.global-search-clear:focus-visible/);
});
test('There is one Vulkan-matched search action with no extra hero Refresh button',()=>{
 assert.doesNotMatch(html,/id="refreshButton"/);
 assert.doesNotMatch(app,/\$\('refreshButton'\)/);
});
test('Reports carry original Vulkan copy-icon paths, keyboard access and safe touch hold',()=>{
 assert.match(app,/M9 8h10v12H9z M5 4h10v4 M5 4v12h4/);
 assert.match(app,/function bindReportLongPress\(row,id\)/);
 assert.match(app,/suppressClick=true;reportQuickMenu\(id,row\)/);
 assert.match(app,/e\.stopImmediatePropagation\(\)/);
 assert.match(app,/e\.key==='ContextMenu'/);
 assert.match(app,/e\.shiftKey&&e\.key==='F10'/);
 assert.match(app,/e\.key==='Enter'\|\|e\.key===' '/);
 assert.match(app,/tabIndex:'0','aria-label':'View report '/);
 assert.doesNotMatch(app,/tabIndex:'0',role:'button','aria-label':'View report '/);
});
