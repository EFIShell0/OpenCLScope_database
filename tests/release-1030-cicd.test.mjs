import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const workflow=load('.github/workflows/pages.yml');
const html=load('index.html');
const app=load('assets/app.v1030.js');
const worker=load('worker/src/index.js');

test('GitHub production path runs Windows checks, build, tagged Release, then Pages deployment',()=>{
  for(const job of ['windows-tooling:','build:','release:','deploy:','snapshot-refresh:'])assert.ok(workflow.includes('  '+job),job);
  assert.match(workflow,/needs: windows-tooling/);
  assert.match(workflow,/needs: build/);
  assert.match(workflow,/needs: \[build, release\]/);
  assert.match(workflow,/gh release create/);
  assert.match(workflow,/gh release upload/);
  assert.match(workflow,/FOUND.*GITHUB_SHA/);
  assert.match(workflow,/tools\/package_release\.py dist/);
  assert.match(workflow,/tools\/audit_pages_artifact\.mjs _site/);
  assert.match(workflow,/tools\/verify_published_snapshot\.mjs/);
  assert.match(workflow,/contents: write/);
  assert.match(workflow,/v3\.0\.30/);
  assert.ok(!workflow.includes('wrangler deploy'),'GitHub Pages deploy cannot silently deploy Worker');
});

test('Snapshot-only dispatch is independently gated on required SHA-256 evidence',()=>{
  const snapshot=workflow.slice(workflow.indexOf('  snapshot-refresh:'));
  assert.match(snapshot,/inputs\.mode == 'snapshot'/);
  assert.match(snapshot,/\^\[a-f0-9\]\{64\}\$/);
  assert.match(snapshot,/REQUIRED_REPORT_ID: \$\{\{ inputs\.report_id \}\}/);
  assert.match(snapshot,/verify_published_snapshot\.mjs/);
  assert.ok(!snapshot.includes('gh release create'),'A new report must never create GitHub Release');
});

test('Main pagination uses the upstream page-jump component with strict page validation',()=>{
  for(const id of ['pageJumpGo','pageNumber','pageCounter','previousPage','nextPage'])assert.ok(html.includes('id="'+id+'"'));
  assert.match(html,/class="page-jump"/);
  assert.match(html,/class="page-jump-go"/);
  assert.match(app,/\$\('pageJumpGo'\)\.addEventListener\('click',commitPage\)/);
  assert.ok(app.includes("/^[1-9]\\d*$/.test(raw)"));
  assert.ok(app.includes('!Number.isSafeInteger(parsed)||parsed>max'));
  assert.ok(!app.includes('Math.min(max,Math.max(1,parsed))'),'Never silently clamp incorrect pages');
});

test('Release identity does not modify OpenCL admission, D1 schema or historical read rules',()=>{
  assert.match(worker,/DATABASE_RELEASE_VERSION = '3\.0\.30'/);
  assert.match(worker,/3\.0\.9/);
  assert.match(worker,/30009/);
  assert.match(worker,/validateStoredReport/);
  assert.match(html,/New submissions: OpenCLScope 3\.0\.9 only/);
  assert.match(load('tools/package_release.py'),/ZIP_DEFLATED/);
  assert.match(load('tools/package_release.py'),/EXCLUDE_DIRS/);
  assert.match(load('tools/audit_pages_artifact.mjs'),/Nonpublic file in Pages/);
});
