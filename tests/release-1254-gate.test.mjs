import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {DATABASE_RELEASE_VERSION} from '../worker/src/index.js';
const root = new URL('../',import.meta.url);
const read = file=>readFile(new URL(file,root),'utf8');

test('Pages artifact and public verification derive release version from the Worker',async()=>{
  for(const file of ['tools/build_pages_artifact.mjs','tools/verify_published_snapshot.mjs']){
    const source=await read(file);
    assert.match(source,/import \{DATABASE_RELEASE_VERSION\} from '\.\.\/worker\/src\/index\.js'/);
    assert.match(source,/databaseReleaseVersion!==DATABASE_RELEASE_VERSION/);
    assert.doesNotMatch(source,/databaseReleaseVersion!=='0\.12\.7'/);
  }
  for(const file of ['data/index.json','data/snapshot.json']){
    const value=JSON.parse(await read(file));
    assert.equal(value.databaseReleaseVersion,DATABASE_RELEASE_VERSION);
  }
});

test('Pages artifact refuses an index/snapshot release mismatch (fail closed)',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'openclscope-pages-gate-'));
  try{
    for(const folder of ['tools','worker/src','data','assets','registry','licenses'])await mkdir(join(dir,folder),{recursive:true});
    for(const file of ['tools/build_pages_artifact.mjs','worker/src/index.js','worker/src/query-manifest.js','worker/package.json','index.html','config.js','data/index.json','data/snapshot.json','data/release.json','assets/app.v1015.js','assets/site.v1014.css']){
      const dest=join(dir,file);await copyFile(new URL(file,root),dest);
    }
    const run=()=>spawnSync(process.execPath,['tools/build_pages_artifact.mjs'],{cwd:dir,encoding:'utf8',timeout:12000});
    const index=JSON.parse(await read('data/index.json'));
    const broken={...index,databaseReleaseVersion:'0.12.7'};
    await writeFile(join(dir,'data/index.json'),JSON.stringify(broken));
    let result=run();assert.notEqual(result.status,0);assert.match(result.stderr,/Invalid static snapshot/);
    await writeFile(join(dir,'data/index.json'),JSON.stringify(index));
    result=run();assert.equal(result.status,0, result.stderr);
    const marker=JSON.parse(await read('data/release.json'));
    await writeFile(join(dir,'data/release.json'),JSON.stringify({...marker,databaseVersion:'3.0.99'}));
    result=run();assert.notEqual(result.status,0);assert.match(result.stderr,/Release marker and published frontend references are inconsistent/);
    await writeFile(join(dir,'data/release.json'),JSON.stringify(marker));
  }finally{await rm(dir,{recursive:true,force:true})}
});

test('Navigation, filters, default page size, and brand revisions are wired into current assets',async()=>{
  const html=await read('index.html'),js=await read('assets/app.v1015.js'),css=await read('assets/site.v1014.css');
  for(const id of ['navScrollLeft','navScrollRight','navEdgeLeft','navEdgeRight','clearFilters'])assert.ok(html.includes(`id="${id}"`));
  assert.match(js,/bindNavigationScroll\(\)/);
  assert.match(js,/\$\('clearFilters'\)\.onclick=clearWorkspaceFilters/);
  assert.match(js,/pageSize:25/);
  assert.match(html,/OpenCLScope Database 3\.0\.21/);
  assert.match(html,/app\.v1015\.js\?v=1015/);
  assert.match(css,/\.nav-scroll-button:disabled/);
  assert.doesNotMatch(html,/site\.v1204\.css/);
});
