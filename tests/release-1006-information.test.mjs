import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../assets/app.v3409.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/site.v3409.css',import.meta.url),'utf8');
test('Information cards use real declared versions and leave producer and technical collection intact',()=>{for(const name of ['Wrangler','sharp','esbuild','workerd','Cloudflare D1','Web Platform APIs'])assert.ok(src.includes("name:'"+name+"'"));assert.match(src,/version:'4\.130\.0'/);assert.match(src,/version:'0\.35\.4'/);assert.match(src,/version:'Resolved by Wrangler 4\.130\.0'/);assert.match(src,/renderSettingsInformation/);assert.match(html,/id="settingsInformation" class="settings-information"/);});
test('License viewer only reads allowlisted local Markdown and retains focus and Escape behavior',()=>{assert.ok(src.includes("SETTINGS_LICENSE_FILES.has(file)"));assert.ok(src.includes("fetch('./licenses/'+file+'.md'"));assert.ok(src.includes("body.length>524288"));assert.ok(src.includes("closeDependencyLicense()"));assert.ok(src.includes("licenseReturnFocus.focus()"));assert.match(css,/license-viewer-dialog/)});
test('Settings preserves active category and traps keyboard focus',()=>{assert.match(src,/setSettingsCategory\(settingsActiveCategory\)/);assert.match(src,/e\.key==='Escape'/);assert.match(src,/e\.key==='Tab'/);assert.match(src,/renderBrowserInformation/);assert.match(html,/data-settings-panel="information"/)});

test('License documents are published through the allowlist-only Pages workflow',()=>{const build=readFileSync(new URL('../tools/build_pages_artifact.mjs',import.meta.url),'utf8');const workflow=readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');assert.match(build,/\['assets','data','registry','licenses'\]/);assert.match(workflow,/branches: \[main\]/);});
