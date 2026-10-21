import {readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const roots=['tests','worker/tests'];
const names=[];
for(const folder of roots){
  for(const name of await readdir(resolve(folder))){
    if(name.endsWith('.test.mjs'))names.push(resolve(folder,name));
  }
}
names.sort();
if(!names.length)throw Error('Refusing to run empty regression suite');
const result=spawnSync(process.execPath,['--test',...names],{stdio:'inherit',env:process.env});
if(result.error)throw result.error;
process.exit(result.status??1);
