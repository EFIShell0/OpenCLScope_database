import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url);
const app=readFileSync(new URL('assets/app.v3404.js',root),'utf8');
const css=readFileSync(new URL('assets/site.v3404.css',root),'utf8');
const rules=readFileSync(new URL('rules/PROJECT_RULES.md',root),'utf8');
const worker=readFileSync(new URL('worker/src/index.js',root),'utf8');
const pure=app.slice(app.indexOf('function sortComparisonRecords('),app.indexOf('function compareCategory('));
const {sortComparisonRecords}=runInNewContext(pure+';({sortComparisonRecords})',{Intl});
const rows=[
 {key:'Z',status:'Unchanged',category:'Devices',baseline:'10',target:'8',hasA:true,hasB:true},
 {key:'A',status:'Changed',category:'Platforms',baseline:'3',target:'9',hasA:true,hasB:true},
 {key:'B',status:'Added',category:'Extensions',target:'1',hasA:false,hasB:true},
 {key:'C',status:'Removed',category:'Image formats',baseline:'4',hasA:true,hasB:false},
 {key:'A2',status:'Changed',category:'Platforms',baseline:'3',target:'9',hasA:true,hasB:true}
];
function names(mode){return [...sortComparisonRecords(rows,mode)].map(x=>x.key).join(',')}
test('six compare sorting modes are deterministic and do not alter originals',()=>{
 assert.equal(names('evidence-asc'),'A,A2,B,C,Z');
 assert.equal(names('evidence-desc'),'Z,C,B,A2,A');
 assert.equal(names('change'),'B,C,A,A2,Z');
 assert.equal(names('category'),'Z,B,C,A,A2');
 assert.equal(names('baseline'),'A,A2,C,Z,B');
 assert.equal(names('target'),'B,Z,A,A2,C');
 assert.equal(rows[0].key,'Z');assert.equal(rows[2].hasA,false);
});
test('explicit filtering happens before sort, and full ordered matches are exported',()=>{
 assert.match(app,/sortComparisonRecords\(records\.filter/);
 assert.match(app,/compareExportRecords\(matched,'json'\)/);
 assert.match(app,/compareExportRecords\(matched,'txt'\)/);
 assert.match(app,/sort:state\.compareSort/);
 assert.match(app,/state\.page=0;renderCompare\(\)/);
});
test('context menu works on compare and evidence rows with no server writes',()=>{
 assert.match(app,/function evidenceQuickMenu\(data,anchor\)/);
 assert.match(app,/Copy evidence name/);
 assert.match(app,/Copy baseline value/);
 assert.match(app,/Copy target value/);
 assert.match(app,/Copy evidence row/);
 assert.match(app,/function bindEvidenceLongPress\(row,data\)/);
 assert.match(app,/closest\('button,a,input,select,summary'\)/);
 assert.match(app,/Math\.abs\(e\.clientX-startX\)>9/);
 assert.match(app,/if\(e\.key==='Escape'\)/);
 assert.match(css,/\.evidence-more:focus-visible/);
 assert.doesNotMatch(app.slice(app.indexOf('function evidenceQuickMenu('),app.indexOf('function bindReportLongPress(')),/fetch\(|api\(|localStorage\.setItem/);
});
test('3.4.0 remains a source-compatible database version; producer is 3.4.0',()=>{
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.4\.4'/);
 assert.match(worker,/versionName!==acceptedVersion/);
 assert.match(rules,/Database 3\.2\.0/);
 assert.match(rules,/3\.0\.11 \/ 30011/);
});
