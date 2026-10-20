import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root = new URL('../',import.meta.url);
const html = await readFile(new URL('index.html',root),'utf8');
const js = await readFile(new URL('assets/app.v1017.js',root),'utf8');
const css = await readFile(new URL('assets/site.v1015.css',root),'utf8');

test('Report page has explicit editable bounded page field with usable navigation controls',()=>{
 for(const id of ['pageNumber','previousPage','nextPage','pageCounter','pageLimit','vendorFilter','versionFilter','stateFilter','sortFilter','globalSearch'])
   assert.match(html,new RegExp(`id="${id}"`),id);
 const field=html.match(/<input[^>]*id="pageNumber"[^>]*>/)?.[0]||'';
 assert.match(field,/type="number"/);assert.match(field,/min="1"/);
 assert.match(js,/pageField\.addEventListener\('keydown'/);
 assert.match(js,/pageField\.addEventListener\('change',commitPage\)/);
 assert.match(js,/Math\.min\(max,Math\.max\(1,parsed\)\)/);
 assert.match(js,/\$\('pageNumber'\)/);
});

test('Settings Close is contained with an SVG cross, not a free text link',()=>{
 const close=html.match(/<button[^>]*id="closeSettings"[^>]*>[\s\S]*?<\/button>/)?.[0]||'';
 assert.match(close,/<svg[^>]*(?:viewBox|viewbox)="0 0 24 24"/);
 assert.match(css,/\.settings-top button\{/);
});

test('About has VulkanScope-styled warning and restrained captions',()=>{
 assert.match(js, /independence-notice-card/);
 assert.match(js,/trademark-note settings-message/);
 assert.match(css,/\.db-settings \.independence-notice/);
 assert.match(css, /--bg:\s*#000\b/);
});

test('All filter and page sizes remain wired alongside complete report exports',()=>{
 for(const value of [25,50,100])assert.match(html,new RegExp(`value="${value}"`));
 assert.match(js,/downloadCompleteReport\(state.detail,'txt'\)/);
 assert.match(js,/downloadCompleteReport\(state.detail,'html'\)/);
 assert.match(js,/pageField\.dataset\.total/);
});
