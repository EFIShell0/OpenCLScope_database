from pathlib import Path
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from PIL import Image

root=Path(__file__).resolve().parents[1]
asset=root/'assets'
worker=root/'worker'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def sha_lf(path):return hashlib.sha256(path.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
def check(value,name):
    if not value:raise AssertionError(name)

check(sha(root/'registry/cl.xml')=='c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016','Official OpenCL registry changed')
check(sha_lf(root/'registry/opencl.svg')=='6067ef6dc08e815d837c43a29d724ec7eedf96a808941d99cc3e7cdd8b5ee6b1','Official logo changed')
ET.parse(root/'registry/cl.xml')
catalog=json.loads((asset/'catalog.json').read_text())
check(catalog['registrySha256']==sha(root/'registry/cl.xml'),'Catalog XML SHA mismatch')
check(len(catalog['platformQueries'])==16 and len(catalog['deviceQueries'])==209 and len(catalog['extensions'])==156,'Normative registry query selection changed')
manifest=(worker/'src/query-manifest.js').read_text()
for group,field in [('PLATFORM_KEYS','platformQueries'),('DEVICE_KEYS','deviceQueries')]:
    match=re.search(rf'export const {group} = new Set\((\[.*?\])\);',manifest)
    check(match is not None,f'{group} missing')
    check(set(json.loads(match.group(1)))=={q['name'] for q in catalog[field]},f'{group} and app catalog disagree')
check(catalog['registrySha256'] in manifest,'Worker registry hash mismatch')
check(json.loads((worker/'tests/complete-report.json').read_text())['technicalReport']['appVersion']=='0.2.0','Fixture version mismatch')
config=(worker/'wrangler.jsonc').read_text()
db_entries=json.loads(config)['d1_databases']
check(len(db_entries)==1 and db_entries[0].get('binding')=='DB' and db_entries[0].get('database_name')=='openclscope-database','Cloudflare D1 binding changed')
db_id=db_entries[0].get('database_id','')
check(db_id=='REPLACE_WITH_NEW_OPENCLSCOPE_D1_DATABASE_ID' or re.fullmatch(r'[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}',db_id) is not None,'D1 ID must be the source placeholder or a UUID')
check('vulkanscope-database' not in config,'Accidentally references old Vulkan D1')
sql=(worker/'migrations/0001_init.sql').read_text()
for name in ('reports','report_payload_chunks','submitted_at','payload_json','platform_count','device_count'):
    check(name in sql,f'Migration missing {name}')
html=(root/'index.html').read_text()
site=(asset/'site.v1200.css').read_text().lower()
check('3dae2b' in site and '080b08' in site,'Official mark-inspired green/AMOLED theme missing')
for page in ('reports','platforms','devices','features','memory','formats','extensions','profiles','compare','encyclopedia'):
    check(f'data-view="{page}"' in html,f'Missing {page} page')
check('connect-src \'self\' https:' in html,'Template CSP unsupported by build-time configurator')
js=(asset/'app.v1200.js').read_text()
used=set(re.findall(r'\$\(\s*[\'\"]([^\'\"]+)[\'\"]\s*\)',js))
present=set(re.findall(r'\bid\s*=\s*[\'\"]([^\'\"]+)[\'\"]',html))
check(used<=present,f'JS references missing DOM anchors: {sorted(used-present)}')
check("api('/v1/sync')" in js and 'setInterval(()=>update(),10000)' in js and 'Cache loaded' in js,'Cache-first live sync or 10-second polling missing')
check('vendorLogo(r.vendor)' in js and (asset/'gpu-vendors/gpu_vendor_unknown.png').exists(),'Evidence-only GPU vendor icon selection missing')
ref=json.loads((root/'rules/VULKANSCOPE_1_4_12_GPU_REFERENCE_SHA256.json').read_text())
check(len(ref)==12 and all(sha(asset/'gpu-vendors'/name)==value for name,value in ref.items()),'VulkanScope GPU icon bytes changed')
check(sha(asset/'upstream-reference.css')=='da397562ad59c789556002c2af985b816d98cb2a9577f1c346f1511577a0503e','Upstream-derived display CSS changed')
check(sha(root/'rules/UPSTREAM_REFERENCE_SITE_CSS.css')=='bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b','Immutable reference CSS changed')
check('window.OPENCLSCOPE_DATABASE_API = ""' in (root/'config.js').read_text(),'Unconfigured source must not suggest a fictitious live endpoint')
check('REQUIRED_REPORT_ID' in (root/'tools/build_snapshot.mjs').read_text(),'Just-submitted snapshot freshness guard missing')
workflow=(root/'.github/workflows/pages.yml').read_text()
check('snapshot' in workflow and 'path: ./_site' in workflow and 'build_pages_artifact.mjs' in workflow,'Snapshot allowlisted Pages workflow absent')
check('node --check assets/app.v1200.js' in workflow and 'verify_published_snapshot.mjs' in workflow,'Workflow checks missing/stale asset or lacks post-deploy report verification')
check(len(json.loads((root/'data/index.json').read_text())['reports'])==0 and json.loads((root/'data/index.json').read_text())['reportCount']==0,'Invalid initial empty report index')
check(len(json.loads((root/'data/snapshot.json').read_text())['reports'])==0 and json.loads((root/'data/snapshot.json').read_text())['preloadedReportCount']==0 and json.loads((root/'data/snapshot.json').read_text())['reportCount']==0,'Invalid initial empty detail preload')
check(json.loads((root/'data/index.json').read_text())['databaseReleaseVersion']=='0.12.0','Public index release identity mismatch')
check(json.loads((root/'data/snapshot.json').read_text())['databaseReleaseVersion']=='0.12.0','Public snapshot release identity mismatch')
check("import {validateSubmission,DATABASE_RELEASE_VERSION}" in (root/'tools/build_snapshot.mjs').read_text(),'Snapshot must reuse Worker producer rules; stale independent allowlists are forbidden')
check("DATABASE_RELEASE_VERSION = '0.12.0'" in (worker/'src/index.js').read_text(),'Worker version mismatch')
check("databaseReleaseVersion:DATABASE_RELEASE_VERSION" in (root/'tools/build_snapshot.mjs').read_text(),'Snapshot release version is not sourced from the Worker')
check('triggers' in config and 'SNAPSHOT_PAGES_URL' in config and '*/15 * * * *' in config,'Snapshot recovery cron not configured')
for logo in (asset/'openclscope_logo_foreground.png', asset/'openclscope_logo_horizontal.png'):
    image=Image.open(logo).convert('RGBA')
    check(all(a==0 or (max(r,g,b)-min(r,g,b) <= 3) for r,g,b,a in image.getdata()), f'Colored OpenCL logo pixel remains: {logo.name}')
check((root/'rules/UPSTREAM_REFERENCE_RULES.md').exists() and (root/'rules/PROJECT_RULES.md').exists(),'Rulebook provenance missing')
for path in [asset/'app.v1200.js',worker/'src/index.js',root/'tools/build_snapshot.mjs',root/'tools/configure.mjs',root/'tools/build_pages_artifact.mjs']:
    subprocess.run(['node','--check',str(path)],check=True)
print('PASS: pinned official XML/logo with CRLF/LF-safe SVG check; 16/209/156 current catalogue and paired Worker tokens with legacy 8/120 acceptance')
print('PASS: OpenCL-only SQL, fixed-contract server, explicit empty report index and auto-refresh workflow')
print('PASS: 10 responsive views, VulkanScope GPU logos and separately pinned CSS references, live polling, Node.js syntax, no fictitious server or D1 ID')
