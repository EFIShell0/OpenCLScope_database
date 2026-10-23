import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=src('index.html');
const js=src('assets/app.v3415.js');
const css=src('assets/reference-controls.v3415.css');
const marker=JSON.parse(src('data/release.json'));

test('the upstream page scrollbar arrow markup, role and status survive OpenCL branding',()=>{
 assert.match(html,/id="viewportScrollbarUp" class="viewport-scrollbar-arrow viewport-scrollbar-up"/);
 assert.match(html,/id="viewportScrollbarDown" class="viewport-scrollbar-arrow viewport-scrollbar-down"/);
 assert.match(html,/id="viewportScrollbarThumb" class="viewport-scrollbar-thumb" role="scrollbar" tabindex="0" aria-orientation="vertical" aria-label="Page scroll position"/);
 assert.match(js,/thumb\.tabIndex=visible\?0:-1/);
 assert.match(css,/\.viewport-scrollbar\.is-scrollable>\.viewport-scrollbar-track\{pointer-events:auto!important\}/);
});
test('grouped upstream filter family geometry preserves all authoritative OpenCL selects',()=>{
 assert.match(html,/class="filters reference-filter-grid"/);
 assert.equal((html.match(/class="filter-family reference-filter-family"/g)||[]).length,5);
 const ids=['vendorFilter','versionFilter','deviceFilter','driverFilter','manufacturerFilter','modelFilter','platformFilter','submissionAgeFilter','stateFilter','sortFilter','pageLimit'];
 for(const id of ids)assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1,id);
 assert.match(js,/\$\('filterPanel'\)\.hidden=\['reports','compare','encyclopedia'\]\.includes\(state\.view\)/);
 assert.match(css,/#workspace \.section-heading\{display:grid!important/);
});
test('last loaded control CSS neutralizes burgundy track/button overrides and is included in deployment readiness',()=>{
 assert.ok(html.indexOf('assets/report-detail.v3415.css')<html.indexOf('assets/reference-controls.v3415.css'));
 assert.match(css,/\.table-scroll-button\{border-color:#292a2f!important/);
 assert.match(css,/\.table-scroll-thumb\{background:linear-gradient\(90deg,#4b4c56,#70717e\)!important\}/);
 assert.match(css,/\.viewport-scrollbar-thumb\{background:linear-gradient\(180deg,#575962,#767984\)!important\}/);
 assert.equal(marker.controlsCss,'assets/reference-controls.v3415.css');
 assert.equal(marker.databaseVersion,'3.4.15');
 assert.match(src('tools/verify_published_snapshot.mjs'),/marker\.controlsCss/);
 assert.match(src('tools/audit_pages_artifact.mjs'),/marker\.controlsCss/);
 assert.match(src('assets/release-bootstrap.v3415.js'),/m\.controlsCss/);
 assert.match(src('worker/src/index.js'),/DATABASE_RELEASE_VERSION = '3\.4\.15'/);
 assert.match(src('worker/src/index.js'),/3\.4\.0/);
});
