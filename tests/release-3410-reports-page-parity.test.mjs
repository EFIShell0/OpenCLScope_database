import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../assets/app.v3411.js',import.meta.url),'utf8');
const upstream=readFileSync(new URL('../rules/UPSTREAM_REFERENCE_RULES.md',import.meta.url),'utf8');
const rules=readFileSync(new URL('../rules/PROJECT_RULES.md',import.meta.url),'utf8');
test('VulkanScope Reports toolbar options have one authoritative report pager without altering other views',()=>{
 assert.match(js,/pageSize:25,reportPageSize:25/);
 assert.match(js,/const rows=filteredRows\(\),reportSize=state\.reportPageSize/);
 assert.match(js,/Math\.ceil\(rows\.length\/reportSize\)/);
 assert.match(js,/rows\.slice\(state\.page\*reportSize,\(state\.page\+1\)\*reportSize\)/);
 assert.match(js,/\.\.\.\[10,25,50\]\.map\(value=>node\('option'/);
 assert.match(js,/state\.reportPageSize=Number\(limitControl\.value\);state\.page=0;render\(\)/);
 assert.doesNotMatch(js,/state\.pageSize=Number\(limitControl\.value\)/);
 assert.match(js,/\$\('sortFilter'\)\.closest\('\.filter-control'\)\.hidden=true/);
 assert.match(js,/\$\('pageLimit'\)\.closest\('\.filter-control'\)\.hidden=state\.view==='reports'/);
 assert.match(js,/state\.view==='reports'\?state\.reportPageSize:state\.pageSize/g);
 assert.match(html,/id="pageNumber"/);
 assert.match(rules,/## Database 3\.4\.6/);
 assert.ok(upstream.length>1000);
});
test('Release assets and marker remain cache coherent',()=>{
 for(const path of ['assets/app.v3411.js?v=3411','assets/site.v3411.css?v=3411','assets/parity.v3411.css?v=3411','assets/reference-shell.v3411.css?v=3411','assets/release-bootstrap.v3411.js?v=3411'])assert.ok(html.includes(path),path);
 const marker=JSON.parse(readFileSync(new URL('../data/release.json',import.meta.url),'utf8'));
 assert.equal(marker.databaseVersion,'3.4.11');assert.equal(marker.cacheKey,'3411');assert.equal(marker.releaseReady,false);
});
