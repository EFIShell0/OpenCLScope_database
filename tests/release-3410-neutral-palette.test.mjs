import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const load=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const shell=load('assets/reference-shell.v3415.css');
const parity=load('assets/parity.v3415.css');
const html=load('index.html');
const rules=load('rules/PROJECT_RULES.md');
test('final shared shell contains no upstream burgundy decorative scrollbar or button palette',()=>{
 for(const color of ['#7a3034','#b54a4f','#92393e','#d65c60','#8f5058','#623840','#ff7b84','#ad5a65','#7b4149','#1b1213','#281619','#100c0d'])assert.ok(!shell.toLowerCase().includes(color),color);
 assert.match(shell,/\.table-scroll-thumb\{background:linear-gradient\(90deg,#4b4c56,#70717e\)/);
 assert.match(shell,/\.viewport-scrollbar-thumb\{[^}]*background:linear-gradient\(180deg,#575962,#767984\)/);
 assert.match(shell,/\.viewport-scrollbar-thumb:hover,[^{]*\{background:linear-gradient\(180deg,#4b8855,#376e41\)/);
});
test('native scrollbar colors and shared select/repository surfaces remain neutral',()=>{
 assert.match(parity,/html\{scrollbar-color:#585b64 #151619!important\}/);
 assert.match(parity,/\*::-webkit-scrollbar-thumb\{background:#585b64!important/);
 assert.match(parity,/\.custom-select-menu\{background:rgba\(18,18,21,\.98\)!important;border-color:#34353b!important\}/);
 assert.match(parity,/\.repo-icon\{background:#222228!important/);
 assert.match(parity,/rgba\(61,174,43,\.19\),transparent 34%/);
});
test('immutable Vulkan reference and independent OpenCL release are preserved',()=>{
 const original=readFileSync(new URL('../rules/UPSTREAM_REFERENCE_SITE_CSS.css',import.meta.url));
 assert.equal(createHash('sha256').update(original).digest('hex'),'bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b');
 for(const path of ['assets/site.v3415.css','assets/parity.v3415.css','assets/reference-shell.v3415.css'])assert.ok(html.includes(path+'?v=3415'),path);
 assert.match(rules,/## Database 3\.4\.11/);
 assert.match(load('worker/src/index.js'),/DATABASE_RELEASE_VERSION = '3\.4\.15'/);
 assert.match(load('worker/src/index.js'),/3\.4\.0/);
 assert.match(load('tools/reconcile_repository.py'),/stale_color_assets = stale_shell \+ stale_bootstrap/);
});
