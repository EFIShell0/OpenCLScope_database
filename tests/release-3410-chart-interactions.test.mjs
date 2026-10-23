import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const app=readFileSync(new URL('../assets/app.v3415.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/report-detail.v3415.css',import.meta.url),'utf8');
const upstream=readFileSync(new URL('../assets/vulkan-layout.v1412.css',import.meta.url),'utf8');
const matcher=app.slice(app.indexOf('function statisticsMatchesCohort('),app.indexOf('function statsDonut('));
const match=vm.runInNewContext(matcher+'\nstatisticsMatchesCohort',{text:value=>value===null||value===undefined?'':String(value)});
const report={device:{manufacturer:'Samsung'},technicalReport:{platforms:[{name:'Mobile OpenCL',devices:[{vendor:'Qualcomm',version:'OpenCL 3.0',type:'GPU'},{vendor:'Qualcomm',version:'OpenCL 3.0',type:'GPU'}]}]}};
test('VulkanScope charts filter only real report-derived vendor, API, device, platform and manufacturer cohorts',()=>{
 for(const [dimension,value] of [['vendor','Qualcomm'],['version','OpenCL 3.0'],['type','GPU'],['manufacturer','Samsung'],['platform','Mobile OpenCL']])assert.equal(match(report,{dimension,value}),true,dimension);
 for(const [dimension,value] of [['vendor','ARM'],['version','OpenCL 2.0'],['type','CPU'],['manufacturer','Google'],['platform','Unknown'],['unknown','Qualcomm']])assert.equal(match(report,{dimension,value}),false,dimension);
 assert.equal(match(report,null),true);
 assert.equal(match({technicalReport:{platforms:[]}}, {dimension:'vendor',value:'Unreported'}),false);
});
test('Donut slice, legend and keyboard activation match upstream interactions with no fake Other cohort',()=>{
 const a=app.slice(app.indexOf('function statsDonut('),app.indexOf('function renderStatistics()'));
 for(const part of ["role:'button'","'aria-pressed'","class:`chart-filter-button",'segment.addEventListener(\'keydown\'','chartDimension:dimension','if(event.key===\'Enter\'||event.key===\' \'','const interactive=!item.other&&!!dimension'])assert.ok(a.includes(part),part);
 for(const selector of ['.donut-interactive','.chart-filter-button','.is-selected'])assert.ok(upstream.includes(selector),selector);
 assert.ok(css.includes('statistics-cohort-filter'));
});
test('Population coverage separates not-loaded full reports from loaded reports excluded by selected cohort',()=>{
 const section=app.slice(app.indexOf('function renderStatistics()'),app.indexOf('function renderCatalog()'));
 assert.match(section,/const availableReports=\[\.\.\.state\.reports\.values\(\)\]/);
 assert.match(section,/unloadedReportDetails=Math\.max\(0,eligible\.size-availableReports\.length\)/);
 assert.match(section,/statisticsMatchesCohort\(r,state\.statisticsChartFilter\)/);
 assert.match(section,/\['Unloaded report details excluded',unloadedReportDetails\]/);
 assert.ok(!section.includes('Math.max(0,eligible.size-loaded)'));
 const names=section.match(/statsDonut\('/g)||[];
 assert.equal(names.length,8);
 assert.match(section,/\[\.\.\.extensionCounts\]/);
});
