import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const app=read('assets/app.v3415.js');
const html=read('index.html');
const upstream=readFileSync(resolve(root,'assets/vulkan-layout.v1412.css'));
const rules=read('rules/PROJECT_RULES.md');
const cut=app.slice(app.indexOf("const APP_TITLE='OpenCLScope Database'"),app.indexOf('function navigateWorkspace('));
function title(view,detail=null,tab='Overview'){
 const context={state:{view,detail,detailTab:tab},document:{title:''}};
 vm.runInNewContext(cut+'\nsyncWorkspaceTitle();',context,{timeout:500});
 return context.document.title;
}
test('Browser title uses upstream Reports/default, section and GPU detail conventions',()=>{
 assert.equal(title('reports'),'OpenCLScope Database');
 for(const page of ['platforms','devices','features','memory','formats','extensions','profiles','statistics','compare','encyclopedia']){
  const label=page[0].toUpperCase()+page.slice(1);
  assert.equal(title(page),`${label} - OpenCLScope Database`);
 }
 const report={technicalReport:{platforms:[{devices:[{name:'Adreno 830'}]}]}};
 assert.equal(title('reports',report,'Formats'),'Adreno 830 - Formats - OpenCLScope Database');
 assert.equal(title('reports',report,'Raw report'),'Adreno 830 - Raw report - OpenCLScope Database');
 assert.equal(title('reports',report,'Raw JSON'),'Adreno 830 - Raw report - OpenCLScope Database');
 assert.equal(title('reports',{technicalReport:{platforms:[]}}),'Report - Overview - OpenCLScope Database');
 assert.match(app,/function showDetailContent\(\)\{\s*syncWorkspaceTitle\(\)/);
 assert.match(app,/function render\(\)\{syncWorkspaceTitle\(\)/);
});
test('Favicon roles match Vulkan browser tabs, with OpenCL-owned icons',()=>{
 assert.match(html,/<title>OpenCLScope Database<\/title>/);
 assert.match(html,/rel="icon" sizes="64x64" type="image\/png"/);
 assert.match(html,/rel="shortcut icon" type="image\/x-icon"/);
 assert.match(html,/rel="apple-touch-icon" sizes="180x180"/);
 assert.ok(existsSync(resolve(root,'assets/opencl_tab_black.ico')));
 assert.ok(readFileSync(resolve(root,'assets/opencl_tab_black.ico')).length>1000);
});
test('Release root excludes historical QA/README and old audit files without altering pinned CSS',()=>{
 const rootFiles=readdirSync(root);
 assert.ok(!rootFiles.some(name=>/^README\.md$|^(?:QA_|COMPARISON_|FULL_VULKAN_DESIGN_COMPARISON_).*\.md$|^UI_.*\.tsv$|^FILE(?:S|_MANIFEST)_SHA256\.txt$/.test(name)));
 assert.ok(rootFiles.includes('changelog.md')&&rootFiles.includes('release.md'));
 assert.match(rules,/strict browser-title and ZIP root parity/);
 assert.equal(createHash('sha256').update(upstream).digest('hex'),'bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b');
});
