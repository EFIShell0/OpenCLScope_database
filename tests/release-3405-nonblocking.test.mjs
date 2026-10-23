import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('Deployed version prompts never lock the page or steal keyboard focus',async()=>{
 const [app,css,html]=await Promise.all([read('assets/app.v3414.js'),read('assets/site.v3414.css'),read('index.html')]);
 assert.match(app,/class:'db-release-notice',role:'status'/);
 assert.match(app,/suppressedRemoteRelease===remote/);
 assert.match(app,/document\.body\.append\(box\);publishedReleaseNotice=box/);
 const noticeCode=app.split('function showPublishedReleaseNotice(remote){')[1].split('function showNewReportNotice(count){')[0];
 assert.doesNotMatch(noticeCode,/\.focus\(/);
 assert.doesNotMatch(app,/publishedReleasePrompt/);
 assert.doesNotMatch(app,/function checkPublishedRelease\(/);
 assert.doesNotMatch(app,/setInterval\(checkPublishedRelease/);
 assert.doesNotMatch(css,/\.db-update-modal\{/);
 assert.match(css,/\.db-release-notice\{/);
 assert.match(html,/id="settingsAutoReleaseReload" type="checkbox"/);
});
test('Automatic deployment reload needs user opt-in, is reversible, and retains route',async()=>{
 const [app,boot,rules]=await Promise.all([read('assets/app.v3414.js'),read('assets/release-bootstrap.v3414.js'),read('rules/PROJECT_RULES.md')]);
 assert.match(app,/\$\('settingsAutoReleaseReload'\)\.onchange/);
 assert.match(app,/\.enable\(\);else window\.__OPENCLSCOPE_RELEASE_UPDATE__\?\.disable\(\)/);
 assert.match(app,/syncReleasePreference\(\)/);
 assert.match(boot,/const enabled=\(\)=>/);
 assert.match(boot,/if\(enabled\(\)\)go\(marker\.databaseVersion\)/);
 assert.match(boot,/url\.hash=location\.hash/);
 assert.match(rules,/Automatic reload is only allowed after the visitor explicitly enables/);
});
test('App and stylesheet revisions are individually versioned for cache-safe GitHub Pages publication',async()=>{
 const [html,rawMarker]=await Promise.all([read('index.html'),read('data/release.json')]);
 const marker=JSON.parse(rawMarker);
 assert.equal(marker.databaseVersion,'3.4.14');
 assert.equal(marker.releaseReady,false);
 for(const p of [marker.appJs,marker.siteCss,marker.parityCss,marker.bootstrapJs]){
   assert.ok(html.includes(p+'?v=3414'),p);
   const bytes=await read(p);
   assert.ok(bytes.length>100,p);
 }
 assert.equal(marker.appJs,'assets/app.v3414.js');
 assert.equal(marker.siteCss,'assets/site.v3414.css');
});
