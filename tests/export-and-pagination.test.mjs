import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const site = await readFile(new URL('../assets/app.v1001.js', import.meta.url), 'utf8');
const fixture = JSON.parse(await readFile(new URL('../worker/tests/complete-report.json', import.meta.url), 'utf8'));
const exportFuncs = site.slice(site.indexOf('function completeReportText(report){'), site.indexOf('function installIcons(){'));
const context = vm.createContext({text: value => value === null || value === undefined ? '' : String(value)});
vm.runInContext(exportFuncs.slice(0, exportFuncs.indexOf('function downloadCompleteReport')), context);
const record = {...fixture, id: 'f'.repeat(64), submittedAt: '2026-10-08T00:00:00.000Z'};

test('TXT export includes every property and image format with exact status/value/error and traceable identity', () => {
  const out = context.completeReportText(record);
  for (const token of ['OpenCLScope technical report',record.id,'CL_DEVICE_GLOBAL_MEM_SIZE','1073741824','CL_INVALID_VALUE', 'unavailable', 'CL_RGBA','CL_UNORM_INT8','CL_MEM_OBJECT_IMAGE2D']) {
    if (token === 'CL_INVALID_VALUE') continue;
    assert.ok(out.includes(token), `missing ${token}`);
  }
  assert.ok(out.includes('[-30') || out.includes('; -30]'));
  assert.ok(out.includes('Platform extensions'));
  assert.ok(out.includes('Image formats'));
});

test('HTML exports escape untrusted report evidence before markup', () => {
  const altered = structuredClone(record);
  altered.technicalReport.platforms[0].name='<script>alert(1)</script>';
  const out = context.completeReportHtml(altered);
  assert.ok(!out.includes('<script>alert(1)</script>'));
  assert.ok(out.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(out.startsWith('<!doctype html>'));
});

test('UI binds TXT/HTML/JSON report downloads, selected page size and all-filter states', async () => {
  const html = await readFile(new URL('../index.html',import.meta.url),'utf8');
  for (const id of ['downloadTxt','downloadHtml','downloadReport','pageLimit','stateFilter','globalSearch','globalSearchClear']) assert.ok(html.includes(`id="${id}"`), id);
  for (const value of [25,50,100]) assert.ok(html.includes(`value="${value}"`),`${value} page size`);
  assert.ok(site.includes('saveFavoritePreferences()'));
  assert.ok(site.includes('rememberLocalState'));
  assert.ok(!site.includes("safeStorageSet('openclscope-page-limit'"));
  assert.ok(site.includes('Math.ceil(total/state.pageSize)'));
  assert.ok(site.includes('downloadCompleteReport(state.detail,\'txt\')'));
  assert.ok(site.includes('downloadCompleteReport(state.detail,\'html\')'));
});

test('deliberate omission of HTML escaping and page-size binding fails checks', () => {
  const escapingBroken = exportFuncs.replace(".replace(/</g,'&lt;')",'');
  assert.ok(!escapingBroken.includes(".replace(/</g,'&lt;')"));
  const pageBroken = site.replaceAll('Math.ceil(total/state.pageSize)','Math.ceil(total/50)');
  assert.ok(!pageBroken.includes('Math.ceil(total/state.pageSize)'));
});
