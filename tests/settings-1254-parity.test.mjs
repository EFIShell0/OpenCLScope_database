import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp,cp,mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const html=await read('index.html'),js=await read('assets/app.v1028.js');

test('VulkanScope Settings parity: four real categories with regional fields, clock and favorites',()=>{
 for(const cat of ['favorites','preferences','internet','information']){
  assert.match(html,new RegExp(`data-settings-category="${cat}"`));
  assert.match(html,new RegExp(`data-settings-panel="${cat}"`));
 }
 for(const id of ['settingsLocalClock','settingsLocalTimezone','settingsFavorites','settingsRememberLocalState','settingsRegionalMode','settingsRegionalCountry','settingsRegionalDateFormat','settingsRegionalClock','settingsRegionalTimeZone','settingsRegionalSeason','settingsRegionalPreview','settingsClearSavedData','settingsSubmittedDefault','settingsVendorDefault','settingsTypeDefault','networkInfo','browserInfo'])assert.ok(html.includes(`id="${id}"`),id);
 for(const fn of ['renderSettingsFavorites','setSettingsCategory','updateSettingsClock','refreshSettingsInformation','syncRegionalSettingsControls','installSettingsPreferences','formatReportDate'])assert.ok(js.includes(`function ${fn}(`));
});
test('Browser storage requires explicit Remember on this device (session-only default)',()=>{
 assert.match(js,/let rememberLocalState=false/);
 assert.match(js,/if\(!rememberLocalState\)return/);
 assert.match(js,/function restoreRememberedPreferences\(/);
 assert.match(js,/state\.favorites\.clear\(\)/);
 assert.doesNotMatch(js,/safeStorageSet\('openclscopeFavorites'/);
 assert.doesNotMatch(js,/safeStorageSet\('openclscope-page-limit'/);
});
test('Timestamp presentation does not rewrite report chronology',()=>{
 assert.match(js,/function humanDate\(iso\)\{return formatReportDate\(iso\)\}/);
 assert.match(js,/state\.rows\.sort\(\(a,b\)=>\(b\.submitted_at/);
 assert.match(js,/new Intl\.DateTimeFormat/);
});
test('Legacy tests are diagnosed and preserved in the repository',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'opencl-test-inventory-'));
 try{
  await mkdir(join(temp,'tools'));await mkdir(join(temp,'tests'));
  await cp(new URL('tools/reconcile_repository.py',root),join(temp,'tools/reconcile_repository.py'));
  const testFiles=['export-and-pagination.test.mjs','parity-live.test.mjs','release-1254-gate.test.mjs','reports-controls-parity.test.mjs','snapshot.test.mjs','vulkan-1412-visual-parity.test.mjs','settings-1254-parity.test.mjs','release-1000-visual-contract.test.mjs','release-1001-icon-scroll.test.mjs','release-1002-network-filter-logo.test.mjs','release-1003-reference-parity.test.mjs','release-1004-rich-views.test.mjs','release-1006-statistics.test.mjs','release-1006-information.test.mjs','release-1008-interactions.test.mjs','release-1008-sort-and-evidence.test.mjs','release-1010-reference-navigation.test.mjs','release-1011-evidence-network.test.mjs','release-1012-evidence-modal.test.mjs','release-1013-query-coverage.test.mjs','release-1014-format-coverage.test.mjs','release-1015-extension-coverage.test.mjs','release-1016-compare-duplicates.test.mjs','release-1017-visual-rebase.test.mjs','release-1018-scrollbar-reports.test.mjs','release-1019-reports-sorting.test.mjs','release-1020-filter-scroll-stats.test.mjs','release-1028-statistics-parity.test.mjs'];
  for(const name of testFiles)await writeFile(join(temp,'tests',name),'test content');
  const run=args=>spawnSync('python3',['-B','tools/reconcile_repository.py',...args],{cwd:temp,encoding:'utf8'});
  assert.equal(run(['--check']).status,0);
  await writeFile(join(temp,'tests','release-1204-old.test.mjs'),'archived test contents');
  assert.notEqual(run(['--check']).status,0);
  assert.equal(run(['--apply']).status,0);
  assert.equal(run(['--check']).status,0);
  assert.equal(await readFile(join(temp,'rules/legacy_tests/release-1204-old.test.mjs'),'utf8'),'archived test contents');
 }finally{await rm(temp,{recursive:true,force:true})}
});
