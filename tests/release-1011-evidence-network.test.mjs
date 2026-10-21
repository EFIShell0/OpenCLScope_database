import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=name=>readFile(new URL('../'+name,import.meta.url),'utf8');

test('Network data stays request-scoped with bounded auto-refresh and no persisted IP evidence',async()=>{
 const app=await read('assets/app.v1030.js'),rules=await read('rules/PROJECT_RULES.md');
 for(const token of ['NETWORK_REFRESH_MS=60000','NETWORK_STALE_MS=120000','NETWORK_REVEAL_MS=15000','function networkPanelVisible()','syncNetworkInfoAutoRefresh()','stopNetworkInfoAutoRefresh()','networkObservationError','Previous observation','Last observation · refresh failed','hideTimer=setTimeout(hide,NETWORK_REVEAL_MS)'])assert.ok(app.includes(token),token);
 assert.match(app,/settingsActiveCategory==='internet'/);
 assert.match(app,/document\.visibilityState!=='hidden'/);
 assert.match(app,/networkPanelVisible\(\)\)void loadNetworkObservation\(true\)/);
 assert.match(app,/if\(category!=='internet'\)renderNetworkInfo\(\)/);
 assert.match(app,/stopNetworkInfoAutoRefresh\(\);drawer\.hidden=true/);
 assert.ok(!app.includes('safeStorageSet(\'networkObservation\''));
 assert.match(rules,/No observed network property may be attached to or synthesized as a technical GPU report/);
});

test('Report detail accordions are controlled, cancelable, keyboard-accessible and motion-aware',async()=>{
 const app=await read('assets/app.v1030.js'),css=await read('assets/site.v1030.css');
 for(const token of ['function detailAccordionCard(entry,expandedInitially=false)','aria-expanded','currentAnimation?.cancel()','current!==token','prefers-reduced-motion: reduce','detailAccordionCard(e,tab==='])assert.ok(app.includes(token),token);
 assert.match(css,/\.detail-accordion-trigger:focus-visible/);
 assert.match(css,/\.detail-accordion-panel\[hidden\]/);
 assert.match(app,/if\(tab==='Raw JSON'\)/);
 assert.match(app,/downloadCompleteReport\(state\.detail/);
});
