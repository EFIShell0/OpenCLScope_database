import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateSubmission} from '../src/index.js';
import {PLATFORM_KEYS, DEVICE_KEYS, DEVICE_KEYS_1016} from '../src/query-manifest.js';

function producer(version, code, names) {
  const report = JSON.parse(readFileSync(new URL('./complete-report.json', import.meta.url), 'utf8'));
  report.application.versionName = version;
  report.application.versionCode = code;
  report.technicalReport.appVersion = version;
  const platform = report.technicalReport.platforms[0];
  const device = platform.devices[0];
  const byPlatform = new Map(platform.properties.map(row => [row.name, row]));
  const byDevice = new Map(device.properties.map(row => [row.name, row]));
  platform.properties = [...PLATFORM_KEYS].map(name => byPlatform.get(name) ?? {name, status:'unavailable', code:-30, value:''});
  device.properties = [...names].map(name => byDevice.get(name) ?? {name, status:'unavailable', code:-30, value:''});
  return report;
}

test('1.0.16 requires 210 distinct query slots including legacy OpenCL C version', () => {
  assert.equal(DEVICE_KEYS.size, 209);
  assert.equal(DEVICE_KEYS_1016.size, 210);
  assert.equal(DEVICE_KEYS.has('CL_DEVICE_OPENCL_C_VERSION'), false);
  assert.equal(DEVICE_KEYS_1016.has('CL_DEVICE_OPENCL_C_VERSION'), true);
  const current = producer('1.0.16', 10016, DEVICE_KEYS_1016);
  assert.equal(validateSubmission(current).ok, true);
  const missing = structuredClone(current);
  missing.technicalReport.platforms[0].devices[0].properties = missing.technicalReport.platforms[0].devices[0].properties.filter(r => r.name !== 'CL_DEVICE_OPENCL_C_VERSION');
  assert.equal(validateSubmission(missing).ok, false);
  const wrongCode = structuredClone(current);
  wrongCode.application.versionCode = 10015;
  assert.equal(validateSubmission(wrongCode).ok, false);
  const unavailable = structuredClone(current);
  const version = unavailable.technicalReport.platforms[0].devices[0].properties.find(r => r.name === 'CL_DEVICE_OPENCL_C_VERSION');
  version.status = 'unavailable';version.value = '';version.code = -30;
  assert.equal(validateSubmission(unavailable).ok, true);
});

test('1.0.15 keeps its 209-query complete-report contract', () => {
  const old = producer('1.0.15', 10015, DEVICE_KEYS);
  assert.equal(validateSubmission(old).ok, true);
  const wrong = structuredClone(old);
  wrong.technicalReport.platforms[0].devices[0].properties.push({name:'CL_DEVICE_OPENCL_C_VERSION',status:'available',code:0,value:'OpenCL C 1.2'});
  assert.equal(validateSubmission(wrong).ok, false);
});
