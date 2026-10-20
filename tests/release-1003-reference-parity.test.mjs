import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=async file=>readFile(new URL('../'+file,import.meta.url),'utf8');
const [html,app,css,compat,worker,rule]=await Promise.all(['index.html','assets/app.v1019.js','assets/site.v1015.css','assets/browser-compat.v1006.js','worker/src/index.js','rules/PROJECT_RULES.md'].map(read));
test('Reference-style browser guard and network-independent fallback are structurally wired',()=>{
 for(const id of ['browserCompatibilityGate','browserDetected','browserRequirement','browserCompatibilityReason','appRoot'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/browser-compat\.v1006\.js\?v=1008/);
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
 assert.match(html,/site\.v1015\.css\?v=1015/);
 assert.match(html,/app\.v1019\.js\?v=1019/);
 assert.match(html,/vulkan-layout\.v1412\.css\?v=1008/);
 assert.match(css,/#3DAE2B/i);
 assert.match(rule,/Database 3\.0\.25/);
});
test('New database release never invents a newer app producer or loosens old evidence contracts',()=>{
 assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.0\.25'/);
 assert.match(worker,/legacy307 \? '3\.0\.7' : '3\.0\.8'/);
 assert.match(worker,/legacy307 \? 30007 : 30008/);
 assert.match(worker,/validateStoredReport/);
 assert.match(worker,/CL_PLATFORM_/);
});
