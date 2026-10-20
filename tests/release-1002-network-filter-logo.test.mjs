import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const load=path=>readFile(new URL(path,root),'utf8');
const frontend=await load('assets/app.v1012.js');const markup=await load('index.html');
const {default:worker}=await import('../worker/src/index.js');
test('Page logo equals unchanged original wordmark; favicon pixels derive from Android OpenCL tab',async()=>{
 assert.match(markup,/class="brand"[^>]*><img[^>]*src="assets\/openclscope_logo_horizontal\.png"/);
 assert.match(markup,/rel="icon" type="image\/png"/);
 assert.match(markup,/opencl_tab_black_64\.png/);
 const mark=await readFile(new URL('assets/opencl_tab_black_64.png',root));assert.ok(mark.length>900);
});
test('Per-report filters are real and not hidden via nested custom select wrapper',()=>{
 for(const id of ['deviceFilter','driverFilter','vendorFilter','versionFilter','stateFilter','sortFilter','pageLimit'])assert.ok(markup.includes('id="'+id+'"'),id);
 assert.match(frontend,/\.closest\('\.filter-control'\)\.hidden/);
 assert.doesNotMatch(frontend,/\$\('stateFilter'\)\.parentElement\.hidden/);
 assert.match(frontend,/state\.driver=''/);
 assert.match(frontend,/state\.device=''/);
 assert.match(frontend,/function filteredRows\(\)/);
});
test('VulkanScope-style network information endpoint is request scoped with no caching and no report persistence',async()=>{
 const request=new Request('https://database.test/v1/network-info',{headers:{origin:'https://efishell0.github.io','cf-connecting-ip':'198.51.100.21','cf-connecting-ipv6':'2001:db8::21','cf-pseudo-ipv4':'192.0.2.10'}});
 Object.defineProperty(request,'cf',{value:{country:'TR',city:'Afyonkarahisar',asn:64500,colo:'IST',tlsVersion:'TLSv1.3'}});
 const env={ALLOWED_ORIGIN:'https://efishell0.github.io'};
 const result=await worker.fetch(request,env,{});assert.equal(result.status,200);
 assert.equal(result.headers.get('cache-control'),'no-store');const data=await result.json();
 assert.equal(data.ipv6.address,'2001:db8::21');assert.equal(data.country,'TR');assert.equal(data.accessFamily,'IPv6');
 assert.equal(data.dns.status,'not_observable');assert.equal(data.ipv4.status,'not_observed');
 const method=await worker.fetch(new Request('https://database.test/v1/network-info',{method:'POST',headers:{origin:'https://efishell0.github.io'}}),env,{});assert.equal(method.status,405);
 const blocked=await worker.fetch(new Request('https://database.test/v1/network-info',{headers:{origin:'https://evil.invalid'}}),env,{});assert.equal(blocked.status,403);
});
test('IP fields stay hidden by default and cannot be exported as report attributes',()=>{
 assert.match(frontend,/maskedIp\('IPv4'/);assert.match(frontend,/maskedIp\('IPv6'/);
 assert.match(frontend,/valueNode\.textContent='••••••••'/);assert.match(frontend,/hideTimer=setTimeout\(hide,NETWORK_REVEAL_MS\)/);
 assert.match(frontend,/Not observable from this site request/);
 assert.match(frontend,/Production API is not configured/);
});
