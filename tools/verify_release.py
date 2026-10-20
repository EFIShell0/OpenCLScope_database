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
check(len(catalog['platformQueries'])==16 and len(catalog['deviceQueries'])==211 and len(catalog['extensions'])==156,'Normative registry query selection changed')
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
site=(asset/'site.v1015.css').read_text().lower()
check('3dae2b' in site and '--bg:#000' in site,'Official mark-inspired green/AMOLED theme missing')
for page in ('reports','platforms','devices','features','memory','formats','extensions','profiles','compare','statistics','encyclopedia'):
    check(f'data-view="{page}"' in html,f'Missing {page} page')
check('connect-src \'self\' https:' in html,'Template CSP unsupported by build-time configurator')
js=(asset/'app.v1017.js').read_text()
used=set(re.findall(r'\$\(\s*[\'\"]([^\'\"]+)[\'\"]\s*\)',js))
present=set(re.findall(r'\bid\s*=\s*[\'\"]([^\'\"]+)[\'\"]',html))
dynamic=set(re.findall(r"\bid\s*:\s*['\"]([^'\"]+)['\"]",js))
check(used<=present|dynamic,f'JS references missing DOM anchors: {sorted(used-present-dynamic)}')
check("api('/v1/sync')" in js and 'setInterval(()=>update(),10000)' in js and 'Cache loaded' in js,'Cache-first live sync or 10-second polling missing')
check('vendorLogo(r.vendor)' in js and (asset/'gpu-vendors/gpu_vendor_unknown.png').exists(),'Evidence-only GPU vendor icon selection missing')
ref=json.loads((root/'rules/VULKANSCOPE_1_4_12_GPU_REFERENCE_SHA256.json').read_text())
check(len(ref)==12 and all(sha(asset/'gpu-vendors'/name)==value for name,value in ref.items()),'VulkanScope GPU icon bytes changed')
check(sha(asset/'upstream-reference.css')=='da397562ad59c789556002c2af985b816d98cb2a9577f1c346f1511577a0503e','Upstream-derived display CSS changed')
check(sha(root/'rules/UPSTREAM_REFERENCE_SITE_CSS.css')=='bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b','Immutable reference CSS changed')
check('window.OPENCLSCOPE_DATABASE_API = ""' in (root/'config.js').read_text(),'Unconfigured source must not suggest a fictitious live endpoint')
check('REQUIRED_REPORT_ID' in (root/'tools/build_snapshot.mjs').read_text(),'Just-submitted snapshot freshness guard missing')
check("['assets','data','registry','licenses']" in (root/'tools/build_pages_artifact.mjs').read_text(),'Allowed local license files missing from Pages artifact')
check("'licenses/**'" in (root/'.github/workflows/pages.yml').read_text(),'License changes would not publish to Pages')
check(all((root/'licenses'/f'{name}.md').is_file() for name in ('wrangler','sharp','esbuild','workerd','nodejs','python')),'Local license documents missing')
workflow=(root/'.github/workflows/pages.yml').read_text()
check('snapshot' in workflow and 'path: ./_site' in workflow and 'build_pages_artifact.mjs' in workflow,'Snapshot allowlisted Pages workflow absent')
check('node --check assets/app.v1017.js' in workflow and 'verify_published_snapshot.mjs' in workflow,'Workflow checks missing/stale asset or lacks post-deploy report verification')
check(len(json.loads((root/'data/index.json').read_text())['reports'])==0 and json.loads((root/'data/index.json').read_text())['reportCount']==0,'Invalid initial empty report index')
check(len(json.loads((root/'data/snapshot.json').read_text())['reports'])==0 and json.loads((root/'data/snapshot.json').read_text())['preloadedReportCount']==0 and json.loads((root/'data/snapshot.json').read_text())['reportCount']==0,'Invalid initial empty detail preload')
check(json.loads((root/'data/index.json').read_text())['databaseReleaseVersion']=='3.0.23','Public index release identity mismatch')
check(json.loads((root/'data/snapshot.json').read_text())['databaseReleaseVersion']=='3.0.23','Public snapshot release identity mismatch')
release_marker=json.loads((root/'data/release.json').read_text())
check(release_marker['databaseVersion']=='3.0.23' and release_marker['appJs']=='assets/app.v1017.js' and release_marker['siteCss']=='assets/site.v1015.css','Release marker does not match current versioned frontend')
check(release_marker['generatedAt']==json.loads((root/'data/index.json').read_text())['generatedAt'],'Snapshot and release marker timestamps differ')
check(json.loads((root/'data/snapshot.json').read_text()).get('skippedInvalidContractIds')==[],'Initial published archive exclusions must be empty')
check('skippedInvalidContractIds' in (root/'tools/build_snapshot.mjs').read_text(),'Snapshot verified archival exclusions missing')
check("import {validateStoredReport,DATABASE_RELEASE_VERSION}" in (root/'tools/build_snapshot.mjs').read_text(),'Snapshot must validate legacy records separately from new submissions; stale independent allowlists are forbidden')
worker_source=(worker/'src/index.js').read_text()
submit_section=worker_source.split('export function validateSubmission(p, legacy307=false) {',1)[1].split('function validHistoricalReport(',1)[0]
check("p.application.versionName!==acceptedVersion" in submit_section and 'p.application.versionCode!==acceptedCode' in submit_section,'Minimum new submission version is not enforced')
check('validReport(p.technicalReport,p.application.versionName,legacy307)' in submit_section,'Complete OpenCL technical report validation bypassed')
check('function validateHistoricalSubmission(' in worker_source and 'export function validateStoredReport(' in worker_source,'Historical report snapshot validation missing')
check('validateStoredReport(bare)' in (root/'tools/build_snapshot.mjs').read_text(),'Published existing reports rejected by new-upload version gate')
check('function semanticComparisonLeaves(report)' in js and 'semanticComparisonLeaves(a.technicalReport)' in js,'Canonical semantic OpenCL compare missing')
check('completeReportText(report)' in js and "downloadCompleteReport(state.detail,'txt')" in js and 'id="downloadTxt"' in html,'TXT export parity missing')
check('completeReportHtml(report)' in js and "downloadCompleteReport(state.detail,'html')" in js and 'id="downloadHtml"' in html,'HTML export parity missing')
check('id="navScrollLeft"' in html and 'id="navScrollRight"' in html and 'id="clearFilters"' in html,'Reference navigation/filter controls missing')
check('id="pageLimit"' in html and 'state.pageSize' in js,'Page limit selector missing')
check("DATABASE_RELEASE_VERSION = '3.0.23'" in (worker/'src/index.js').read_text(),'Worker version mismatch')
check("databaseReleaseVersion:DATABASE_RELEASE_VERSION" in (root/'tools/build_snapshot.mjs').read_text(),'Snapshot release version is not sourced from the Worker')
check('triggers' in config and 'SNAPSHOT_PAGES_URL' in config and '*/15 * * * *' in config,'Snapshot recovery cron not configured')
for logo in (asset/'openclscope_logo_foreground.png', asset/'openclscope_logo_horizontal.png'):
    image=Image.open(logo).convert('RGBA')
    check(all(a==0 or (max(r,g,b)-min(r,g,b) <= 3) for r,g,b,a in image.getdata()), f'Colored OpenCL logo pixel remains: {logo.name}')
check((root/'rules/UPSTREAM_REFERENCE_RULES.md').exists() and (root/'rules/PROJECT_RULES.md').exists(),'Rulebook provenance missing')
for path in [asset/'app.v1017.js',worker/'src/index.js',root/'tools/build_snapshot.mjs',root/'tools/configure.mjs',root/'tools/build_pages_artifact.mjs']:
    subprocess.run(['node','--check',str(path)],check=True)
print('PASS: pinned official XML/logo; 16/211 only for approved 3.0.3; prior submissions denied')
print('PASS: OpenCL-only SQL, fixed-contract server, explicit empty report index and auto-refresh workflow')
print('PASS: 11 responsive views, VulkanScope GPU logos and separately pinned CSS references, live polling, Node.js syntax, no fictitious server or D1 ID')
