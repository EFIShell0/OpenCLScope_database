import {readdirSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const suites=['tests','worker/tests'];
const files=suites.flatMap(folder=>readdirSync(resolve(root,folder)).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>resolve(root,folder,name)));
if(files.length===0)process.exit(2);
const result=spawnSync(process.execPath,['--test',...files],{cwd:root,stdio:'inherit'});
process.exit(result.status??1);
