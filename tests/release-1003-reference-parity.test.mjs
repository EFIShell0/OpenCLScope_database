import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=async file=>readFile(new URL('../'+file,import.meta.url),'utf8');
const [html,app,css,compat,worker,rule]=await Promise.all(['index.html','assets/app.v3415.js','assets/site.v3415.css','assets/browser-compat.v1006.js','worker/src/index.js','rules/PROJECT_RULES.md'].map(read));
test('Reference-style browser guard and network-independent fallback are structurally wired',()=>{
 for(const id of ['browserCompatibilityGate','browserDetected','browserRequirement','browserCompatibilityReason','appRoot'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/browser-compat\.v1006\.js\?v=3415/);
 assert.match(app,/__OPENCLSCOPE_COMPATIBLE__===false/);
 assert.match(compat,/window\.__OPENCLSCOPE_COMPATIBLE__=ok/);
 assert.doesNotMatch(compat,/VulkanScope|__VULKANSCOPE/);
});
test('Reference-style confirm is wired to real local-state deletion, not an inert button',()=>{
 for(const id of ['destructiveConfirmDialog','destructiveConfirmBackdrop','destructiveConfirmCancel','destructiveConfirmAccept'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(app,/function confirmDestructive\(/);
 assert.match(app,/activeConfirm=\{close\}/);
 assert.match(app,/e\.key==='Escape'/);
 assert.match(app,/e\.shiftKey&&document\.activeElement===first/);
 assert.match(app,/settingsClearSavedData'\)\.onclick=\(\)=>confirmDestructive/);
 assert.doesNotMatch(app,/\bconfirm\(/);
});
test('Additional filters are backed by exact indexed metadata, not inferred GPU facts',()=>{
 for(const id of ['manufacturerFilter','modelFilter','platformFilter','submissionAgeFilter'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(app,/state\.manufacturer/);
 assert.match(app,/r\.platform_name===state\.platform/);
 assert.match(app,/Number\.isFinite\(date\)/);
 assert.match(app,/r\.manufacturer===state\.manufacturer/);
 assert.match(app,/r\.model===state\.model/);
 assert.match(app,/submittedAge/);
 assert.match(html,/value="not_applicable"/);
});
test('Frontend caches are versioned, while pinned VulkanScope layout is a separate unmodified source',()=>{
 assert.match(html,/site\.v3415\.css\?v=3415/);
 assert.match(html,/app\.v3415\.js\?v=3415/);
 assert.match(html,/vulkan-layout\.v1412\.css\?v=3415/);
 assert.match(css,/#3DAE2B/i);
 assert.match(rule,/Database 3\.2\.0/);
});
test('New database release never invents a newer app producer or loosens old evidence contracts',()=>{
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.4\.15'/);
 assert.match(worker,/predecessor311 \? '3\.0\.11' : predecessor312 \? '3\.0\.12' : predecessor313 \? '3\.0\.13' : predecessor314 \? '3\.0\.14' : predecessor315 \? '3\.1\.0' : predecessor320 \? '3\.2\.0' : '3\.4\.0'/);
 assert.match(worker,/predecessor311 \? 30011 : predecessor312 \? 30012 : predecessor313 \? 30013 : predecessor314 \? 30014 : predecessor315 \? 30100 : predecessor320 \? 30200 : 30400/);
 assert.match(worker,/validateStoredReport/);
 assert.match(worker,/CL_PLATFORM_/);
});
