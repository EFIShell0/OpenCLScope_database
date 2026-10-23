import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const code=read('assets/app.v3415.js'),style=read('assets/parity.v3415.css'),vulkan=read('assets/vulkan-layout.v1412.css');
test('Vulkan distribution chart DOM architecture is reused without hard-coded red palette',()=>{
 for(const part of ['class:\'donut-chart\'','class:\'donut-track\'','class:`donut-segment chart-stroke-','class:\'donut-center\'','class:\'chart-legend\'','class:`chart-swatch chart-fill-','class:\'distribution-card stats-chart\'','class:\'stats-charts distribution-grid\''])assert.ok(code.includes(part),part);
 for(const rule of ['.distribution-card','.donut-chart','.donut-track','.chart-legend','.chart-swatch','.distribution-grid'])assert.ok(vulkan.includes(rule),'Reference selector '+rule);
 for(let n=0;n<8;n++)assert.ok(style.includes('.stats-charts .chart-stroke-'+n+'{stroke:'),'Green OpenCL-only categorical palette '+n);
 assert.ok(!code.includes("const palette=['#3dae2b'"),'Legacy custom donut renderer remains');
});
test('Donut groups have exact counts, bounded Other grouping and non-misleading denominators',()=>{
 const model=code.match(/function statsDistribution\(values\)\{[^\n]*\}/)?.[0];
 assert.ok(model);
 const fn=vm.runInNewContext(model+';statsDistribution',{text:v=>v===undefined?'':String(v)});
 const samples=['Adreno','Mali','Mali','Mali','PowerVR',undefined,'Adreno'];
 const distribution=fn(samples);
 assert.equal(distribution.reduce((total,row)=>total+row.count,0),samples.length);
 assert.equal(distribution[0].label,'Mali');
 assert.equal(distribution[0].count,3);
 assert.ok(code.includes('data.slice(cut-1).reduce((sum,item)=>sum+item.count,0)'));
 assert.ok(code.includes('denominator?100*item.count/denominator:0'));
});
test('Only uniquely dominant query status receives highlighted numeric label',()=>{
 assert.match(code,/distribution\.filter\(x=>x\.count===largest\)\.length===1/);
 assert.match(code,/stats-bar stats-state-\$\{tag\}\$\{uniqueDominant/);
 assert.ok(style.includes('stats-bar:not(.is-dominant)'));
 for(const status of ['available','unavailable','not_applicable','unknown','error'])assert.ok(style.includes('stats-state-'+status+'.is-dominant'));
});
test('Extension reset changes its own state instead of clearing Statistics',()=>{
 const begin=code.indexOf('function renderExtensionCoverage()'),end=code.indexOf('function renderImageFormatCoverage()');
 const section=code.slice(begin,end>begin?end:begin+11000);
 assert.match(code,/state\.extensionEvidenceState='all';state\.extensionSearch='';state\.page=0;renderExtensionCoverage\(\)/);
 assert.ok(!section.includes("state.statisticsSliceLimit=8"),'Wrong reset state used inside Extensions');
});
