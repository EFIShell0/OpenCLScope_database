import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const [app,css,html,rules,worker]=await Promise.all(['assets/app.v1020.js','assets/site.v1015.css','index.html','rules/PROJECT_RULES.md','worker/src/index.js'].map(x=>readFile(new URL(x,root),'utf8')));
const getParser=()=>runInNewContext(`${app.slice(app.indexOf('function parseFavoriteImport('),app.indexOf('function renderSettingsFavorites('))};parseFavoriteImport`,{validComparisonId:id=>typeof id==='string'&&/^[a-f0-9]{64}$/.test(id)});
test('3.0.26 preserves the pinned OpenCL report producer and integrity gate',()=>{
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.0\.26'/);
 assert.match(worker,/versionName!==acceptedVersion/);
 assert.match(worker,/validateStoredReport/);
 assert.match(html,/app\.v1020\.js\?v=1020/);
 assert.match(html,/site\.v1015\.css\?v=1015/);
 assert.match(rules,/Database 3\.0\.26/);
});
test('Compare pinned header can be minimized and respects accessibility',()=>{
 assert.match(app,/compare-sticky-shell/);assert.match(app,/compareMinimized:false/);
 assert.match(app,/aria-expanded/);assert.match(app,/stickyBody\.hidden=state\.compareMinimized\|\|mobileAuto/);assert.match(app,/compareMobilePinnedExpanded/);
 assert.match(css,/position:sticky;top:70px/);assert.match(css,/prefers-reduced-motion/);
});
test('Compare route requires exact report ID pair and does not add a report',()=>{
 const code=app.slice(app.indexOf('function validComparisonId('),app.indexOf('function makeDownload('));
 const fn=runInNewContext(`${code};({validComparisonId,compareRoute})`,{text:x=>String(x),state:{compareA:'a'.repeat(64),compareB:'b'.repeat(64),view:'compare'},history:{replaceState(){}},location:{hash:''}});
 assert.equal(fn.validComparisonId('a'.repeat(64)),true);
 assert.equal(fn.validComparisonId('A'.repeat(64)),false);
 assert.equal(fn.validComparisonId('x'.repeat(64)),false);
 assert.equal(fn.compareRoute(),'#compare/'+'a'.repeat(64)+'/'+'b'.repeat(64));
 assert.match(app,/#compare\\\//);
});
test('Compare exports all matching complete report evidence with no unsupported synthesis',()=>{
 assert.match(app,/baselineReportId:state\.compareA/);assert.match(app,/targetReportId:state\.compareB/);
 assert.match(app,/state\.reports\.has\(state\.compareA\)/);
 assert.match(app,/records\.map\(r=>/);assert.match(app,/baselineReported:r\.hasA/);
 assert.match(app,/compareExportRecords\(matched,'json'\)/);
 assert.match(app,/compareExportRecords\(matched,'txt'\)/);
});
test('Favorites import enforces explicit schema, report hashes, count, and deduplication',()=>{
 const parse=getParser();const a='a'.repeat(64);const b='b'.repeat(64);
 assert.deepEqual([...parse(JSON.stringify({schema:'openclscope-favorites-v1',ids:[a,b,a]}))],[a,b]);
 for(const item of [{schema:'wrong',ids:[a]},{schema:'openclscope-favorites-v1',ids:['bad']},{schema:'openclscope-favorites-v1',ids:Array(301).fill(a)},{schema:'openclscope-favorites-v1',ids:'oops'}])assert.throws(()=>parse(JSON.stringify(item)));
 assert.throws(()=>parse('{invalid'));
});
test('Favorites import is bounded, merge-only, and session-first',()=>{
 assert.match(app,/file\.size>65536/);assert.match(app,/new Set\(\[\.\.\.state\.favorites,\.\.\.ids\]\)\.size>300/);
 assert.match(app,/ids\.forEach\(id=>state\.favorites\.add\(id\)\)/);
 assert.match(app,/if\(!rememberLocalState\)return/);
 assert.match(app,/input\.onchange=async/);
 assert.doesNotMatch(app,/localStorage\.setItem\('.*favorites-backup/i);
});
test('Report context menu includes visible button and long press cancellation',()=>{
 assert.match(app,/More actions for report/);assert.match(app,/bindReportLongPress\(row,id\)/);
 assert.match(app,/pointerType==='mouse'/);assert.match(app,/Math\.abs\(e\.clientX-startX\)>9/);
 assert.match(app,/600\)/);assert.match(app,/if\(e\.key==='Escape'\)/);
 assert.match(app,/Copy report ID/);assert.match(app,/Compare as baseline/);
});
