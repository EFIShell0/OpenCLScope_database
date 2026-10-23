import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=src('index.html');
const app=src('assets/app.v3415.js');
const ref=src('assets/upstream-reference.css');
const release=JSON.parse(src('data/release.json'));

test('Settings category help and informational icons preserve the upstream shared structure',()=>{
 assert.match(html,/id="settingsFavoritesPersistence"[^>]*><span class="settings-message-icon"/);
 assert.match(html,/id="settingsFavoritesPersistenceText"/);
 assert.match(html,/data-settings-panel="preferences"[^>]*><section class="settings-section"><div class="settings-section-head"><div><h3>Preferences<\/h3>/);
 for(const text of ['Expand the Submitted column by default.','Expand the Vendor column by default.','Expand the Type column by default.','Manual keeps Country / region locked to browser/system','Clear saved browser data'])assert.ok(html.includes(text),text);
 assert.match(html,/class="settings-clear-data" id="settingsClearSavedData"[^>]*><svg/);
 assert.match(html,/class="settings-privacy-note settings-message settings-message-info"><span class="settings-message-icon"/);
 assert.match(app,/\$\('settingsFavoritesPersistenceText'\)\.textContent=/);
 assert.ok(!app.includes("$('settingsFavoritesPersistence').textContent="));
});

test('Settings Information derives the published database version rather than an obsolete literal',()=>{
 assert.equal(release.databaseVersion,'3.4.15');
 assert.match(app,/\[\["Database release",DATABASE_RELEASE_VERSION\]/);
 assert.ok(!app.includes('[["Database release","3.0.19"]'));
 assert.match(src('worker/src/index.js'),/DATABASE_RELEASE_VERSION = '3\.4\.15'/);
});

test('The upstream mask UI remains private before click, exposes on click and re-masks on timer',()=>{
 const source=app.slice(app.indexOf('function maskedIp('),app.indexOf('function networkPanelVisible(',app.indexOf('function maskedIp(')));
 const timers=[];
 const node=(tag,attrs={},...children)=>{
  const classes=new Set(String(attrs.class||'').split(/\s+/));
  const item={tag,attrs:{...attrs},children, classList:{replace(oldValue,newValue){classes.delete(oldValue);classes.add(newValue)},contains(value){return classes.has(value)}},
   append(...x){item.children.push(...x)},replaceChildren(...x){item.children=x},setAttribute(k,v){item.attrs[k]=v}};
  let value=children.filter(x=>typeof x==='string').join('');
  Object.defineProperty(item,'textContent',{get(){return value},set(x){value=x}});
  return item;
 };
 const ctx={node,text:String,NETWORK_REVEAL_MS:15000,setTimeout(f,ms){timers.push({f,ms});return timers.length},clearTimeout(){}};
 vm.runInNewContext(source,ctx,{timeout:500});
 const row=ctx.maskedIp('IPv4 address','198.51.100.77','IPv4');
 const control=row.children[1];
 const value=control.children[1].children[0];
 const reveal=control.children[2];
 assert.equal(value.textContent,'••••••••');
 assert.equal(reveal.attrs['aria-pressed'],'false');
 assert.equal(reveal.children[0].tag,'svg');
 assert.equal(control.classList.contains('is-masked'),true);
 assert.equal(ref.includes('.network-address-toggle'),true);
 reveal.onclick();
 assert.equal(value.textContent,'198.51.100.77');
 assert.equal(reveal.attrs['aria-pressed'],'true');
 assert.equal(control.classList.contains('is-revealed'),true);
 assert.equal(timers.at(-1).ms,15000);
 timers.at(-1).f();
 assert.equal(value.textContent,'••••••••');
 assert.equal(reveal.attrs['aria-pressed'],'false');
 assert.equal(control.classList.contains('is-masked'),true);
});
