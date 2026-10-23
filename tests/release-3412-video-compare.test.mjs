import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const app=readFileSync(join(root,'assets/app.v3414.js'),'utf8');
const style=readFileSync(join(root,'assets/site.v3414.css'),'utf8');
const rules=readFileSync(join(root,'rules/PROJECT_RULES.md'),'utf8');
const start=app.indexOf('function comparisonEvidenceGroup(');
const end=app.indexOf('let comparePinFrame=',start);
assert.ok(start>0&&end>start);
const source=app.slice(start,end);
const text=value=>value==null?'':String(value);
const node=(tag,attrs={},...children)=>({tag,attrs,children:[...children],append(...items){this.children.push(...items)}});
const context={text,node,bindEvidenceLongPress(){},evidenceQuickMenu(){}};
vm.runInNewContext(source,context);
const group=context.comparisonEvidenceGroup;
const value=context.comparisonValueCell;
const render=context.renderComparisonSections;

test('Video Compare groups the canonical OpenCL queries, not Vulkan-specific fields',()=>{
 assert.equal(group('Platform: P / Extension / cl_khr_fp16'),'Extension · cl_khr_fp16');
 assert.equal(group('Platform: P / Device: GPU / Property / CL_DEVICE_IMAGE_SUPPORT'),'Properties · Device: GPU');
 assert.match(group('Platform: P / Device: GPU / Image formats: IMAGE2D · CL_MEM_READ_ONLY / State'),/^Image formats ·/);
 assert.match(rules,/Database 3\.4\.12 — video-observed Compare evidence cards/);
 assert.ok(!/VK_KHR_|Turnip|Surface capabilities/.test(source));
});
test('False and zero query values and Error remain exact; absent evidence means Unknown',()=>{
 const absent=value(undefined,false);
 assert.equal(absent.children[0].children[0],'Unknown');
 assert.equal(absent.children[1].children[0],'Not reported');
 for(const v of ['Status: "available" · Code: 0 · Value: false','Status: "available" · Code: 0 · Value: 0']){
  const model=value(v,true);
  assert.equal(model.children.at(-1).children[0],v);
  assert.equal(model.children[0].children[0],'available');
 }
 const err=value('Status: "error" · Code: -30 · Value: null',true);
 assert.equal(err.children[0].children[0],'error');
 assert.match(err.children[1].children[0],/-30/);
});
test('Grouped sections retain per-evidence actions, both report IDs and bounded result rows',()=>{
 const idA='a'.repeat(64),idB='b'.repeat(64);
 const entries=[{key:'Platform: P / Device: GPU / Property / CL_DEVICE_AVAILABLE',status:'Changed',category:'Devices',hasA:true,hasB:true,baseline:'Status: "available" · Code: 0 · Value: false',target:'Status: "available" · Code: 0 · Value: 0'},
 {key:'Platform: P / Extension / cl_khr_fp16',status:'Removed',category:'Extensions',hasA:true,hasB:false,baseline:'Enumerated'}];
 const view=render(entries,idA,idB);
 assert.equal(view.children.length,2);
 const first=view.children[0];
 assert.equal(first.tag,'section');
 const rows=first.children[1].children[0].children[1].children;
 assert.equal(rows.length,1);
 assert.equal(rows[0].children[1].children[0].children.at(-1).children[0],entries[0].baseline);
 assert.equal(rows[0].children[2].children[0].children.at(-1).children[0],entries[0].target);
 assert.match(app,/sortComparisonRecords\(records\.filter\(/);
 assert.match(app,/compareExportRecords\(matched,'json'\)/);
 assert.match(app,/pager\(matched\.length,false\)/);
 assert.match(style,/#contentView \.compare-workspace \.compare-section-overflow/);
 assert.match(style,/overflow-x:auto/);
});

test('Different GPU names still align matching OpenCL property tokens without ambiguous positional matching',()=>{
 const source=app.slice(app.indexOf('function comparisonStableValue('),app.indexOf('function validComparisonId('));
 const context={text,Map,Set,JSON,Object,Array};
 vm.runInNewContext(source,context);
 const mk=(name,val)=>({platforms:[{name:'P',vendor:'QUALCOMM',devices:[{name,vendor:'QUALCOMM',type:'GPU',properties:[{name:'CL_DEVICE_MAX_COMPUTE_UNITS',value:val,status:'available',code:0}],extensions:['cl_khr_fp16'],imageFormats:[]}],properties:[],extensions:[]} ]});
 const a=context.semanticComparisonLeaves(mk('Adreno 830',8)),b=context.semanticComparisonLeaves(mk('Adreno 610',16));
 const key=[...a.keys()].find(k=>k.endsWith(' / Property / CL_DEVICE_MAX_COMPUTE_UNITS'));
 assert.ok(key);
 assert.equal(b.has(key),true);
 assert.notEqual(a.get(key),b.get(key));
 assert.equal(a.has('Platform / Device: GPU / Name'),true);
 assert.notEqual(a.get('Platform / Device: GPU / Name'),b.get('Platform / Device: GPU / Name'));
 assert.equal(a.has('Platform / Device: GPU / Extension / cl_khr_fp16'),true);
 assert.equal(b.has('Platform / Device: GPU / Extension / cl_khr_fp16'),true);
});
