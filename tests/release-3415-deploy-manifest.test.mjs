import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,copyFile,readFile,writeFile,rm,unlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {publishSnapshot} from '../tools/build_snapshot.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const rootMarker=JSON.parse(await readFile(join(root,'data/release.json'),'utf8'));
const emptyAPI=async (url,init)=>{
  assert.equal(new URL(url).pathname,'/v1/reports');
  assert.equal(init.method,'GET');
  return new Response(JSON.stringify({reports:[],nextCursor:null}),{status:200,headers:{'content-type':'application/json'}});
};
const run=(dir,file,...args)=>spawnSync(process.execPath,[file,...args],{cwd:dir,encoding:'utf8',timeout:15000});

test('production snapshot release retains all checked-in frontend references, and Pages staging/audit accepts it',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'openclscope-3415-deploy-'));
  try{
    for(const folder of ['assets','data','registry','licenses','worker/src','tools'])
      await cp(join(root,folder),join(dir,folder),{recursive:true});
    for(const file of ['index.html','config.js'])await copyFile(join(root,file),join(dir,file));
    const built=await publishSnapshot('https://api.example.test',dir,emptyAPI);
    assert.equal(built.index.reportCount,0);
    const marker=JSON.parse(await readFile(join(dir,'data/release.json'),'utf8'));
    assert.equal(marker.releaseReady,true);
    assert.equal(marker.generatedAt,built.index.generatedAt);
    for(const [key,value] of Object.entries(rootMarker)){
      if(key==='releaseReady'||key==='generatedAt')continue;
      assert.deepEqual(marker[key],value,`publisher must keep ${key}`);
    }
    assert.equal(marker.controlsCss,'assets/reference-controls.v3415.css');
    let result=run(dir,'tools/build_pages_artifact.mjs');
    assert.equal(result.status,0,`production Pages stage failed: ${result.stderr}`);
    result=run(dir,'tools/audit_pages_artifact.mjs','_site');
    assert.equal(result.status,0,`production Pages audit failed: ${result.stderr}`);
    const published=JSON.parse(await readFile(join(dir,'_site/data/release.json'),'utf8'));
    assert.deepEqual(published,marker);
    // The exact GitHub Actions #702 incident: a ready marker without controlsCss
    // must refuse publication instead of producing a half-ready website.
    await writeFile(join(dir,'data/release.json'),JSON.stringify((({controlsCss,...rest})=>rest)(marker)));
    result=run(dir,'tools/build_pages_artifact.mjs');
    assert.notEqual(result.status,0,'missing controlsCss must fail closed');
    assert.match(result.stderr,/Release marker and published frontend references are inconsistent/);
    await writeFile(join(dir,'data/release.json'),JSON.stringify(marker));
    // Even with the correct manifest, a missing CSS file must block deploy.
    await unlink(join(dir,marker.controlsCss));
    result=run(dir,'tools/build_pages_artifact.mjs');
    assert.notEqual(result.status,0,'missing CSS asset must fail closed');
    assert.match(result.stderr,/ENOENT/);
  }finally{await rm(dir,{recursive:true,force:true});}
});
