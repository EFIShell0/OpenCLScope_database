import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('3.4.14 rulebook mandates identical applicable VulkanScope UI and no surplus visible copy',async()=>{
 const rules=await read('rules/PROJECT_RULES.md');
 assert.match(rules,/Mandatory exact VulkanScope Database 1\.4\.12 reference fidelity/);
 assert.match(rules,/Do not add, remove, paraphrase, reorder or duplicate/);
 assert.match(rules,/Quality and parity gate/);
 assert.match(rules,/Strict OpenCL-only exception/);
});
test('Native VulkanScope settings SVG geometry and loading shell remain visible with real progress',async()=>{
 const [html,app,css]=await Promise.all([read('index.html'),read('assets/app.v3414.js'),read('assets/reference-shell.v3414.css')]);
 for(const path of ['M12 3.35 14.67 8.76','M4 7h10 M18 7h2','M4 9a12 12 0 0 1 16 0','M12 10v7 M12 7h.01'])assert.ok(html.includes(path),path);
 for(const cls of ['database-loading-halo','database-loading-spinner','database-loading-track','databaseLoadingProgress'])assert.ok(html.includes(cls),cls);
 assert.match(app,/startupSettled\*25/);assert.match(css,/\.database-loading-spinner span/);
 assert.match(html,/reference-shell\.v3414\.css\?v=3414/);
 assert.doesNotMatch(css,/#ff626c|#ff8990|#ff7a82|#a92b34/i);
});
test('All deployed release-readiness paths verify new shared CSS before advancing',async()=>{
 const [marker,boot,build,pages,audit,verify]=await Promise.all([read('data/release.json').then(JSON.parse),read('assets/release-bootstrap.v3414.js'),read('tools/build_snapshot.mjs'),read('tools/build_pages_artifact.mjs'),read('tools/audit_pages_artifact.mjs'),read('tools/verify_published_snapshot.mjs')]);
 assert.equal(marker.shellCss,'assets/reference-shell.v3414.css');
 for(const x of [boot,build,pages,audit,verify])assert.match(x,/shellCss/);
});
