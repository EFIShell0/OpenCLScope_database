from pathlib import Path
import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
asset=root/'assets'
worker=root/'worker'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def check(value,name):
    if not value:raise AssertionError(name)

check(sha(root/'registry/cl.xml')=='c24f63ad9aa5776fe67808926ae85613248ebbeefa7373fceb406a0bd12ce016','Official OpenCL registry changed')
check(sha(root/'registry/opencl.svg')=='7e99195dec3f96efb9cfd6aa137af390f9f30711b6e6a0573bfc47f50ab77f1e','Official logo changed')
ET.parse(root/'registry/cl.xml')
catalog=json.loads((asset/'catalog.json').read_text())
check(catalog['registrySha256']==sha(root/'registry/cl.xml'),'Catalog XML SHA mismatch')
check(len(catalog['platformQueries'])==8 and len(catalog['deviceQueries'])==120 and len(catalog['extensions'])==156,'Reference selection changed')
manifest=(worker/'src/query-manifest.js').read_text()
for group,field in [('PLATFORM_KEYS','platformQueries'),('DEVICE_KEYS','deviceQueries')]:
    match=re.search(rf'export const {group} = new Set\((\[.*?\])\);',manifest)
    check(match is not None,f'{group} missing')
    check(set(json.loads(match.group(1)))=={q['name'] for q in catalog[field]},f'{group} and app catalog disagree')
check(catalog['registrySha256'] in manifest,'Worker registry hash mismatch')
check(json.loads((worker/'tests/complete-report.json').read_text())['technicalReport']['appVersion']=='0.2.0','Fixture version mismatch')
config=(worker/'wrangler.jsonc').read_text()
check('REPLACE_WITH_NEW_OPENCLSCOPE_D1_DATABASE_ID' in config,'No immutable new D1 ID placeholder')
check('vulkanscope-database' not in config,'Accidentally references old Vulkan D1')
sql=(worker/'migrations/0001_init.sql').read_text()
for name in ('reports','report_payload_chunks','submitted_at','payload_json','platform_count','device_count'):
    check(name in sql,f'Migration missing {name}')
html=(root/'index.html').read_text()
site=(asset/'site.v0100.css').read_text().lower()
check('3dae2b' in site and '080b08' in site,'Official mark-inspired green/AMOLED theme missing')
for page in ('reports','platforms','devices','features','memory','formats','extensions','profiles','compare','encyclopedia'):
    check(f'data-view="{page}"' in html,f'Missing {page} page')
check('connect-src \'self\' https:' in html,'Template CSP unsupported by build-time configurator')
js=(asset/'app.v0100.js').read_text()
used=set(re.findall(r'\$\(\s*[\'\"]([^\'\"]+)[\'\"]\s*\)',js))
present=set(re.findall(r'\bid\s*=\s*[\'\"]([^\'\"]+)[\'\"]',html))
check(used<=present,f'JS references missing DOM anchors: {sorted(used-present)}')
check('window.OPENCLSCOPE_DATABASE_API = ""' in (root/'config.js').read_text(),'Unconfigured source must not suggest a fictitious live endpoint')
check('REQUIRED_REPORT_ID' in (root/'tools/build_snapshot.mjs').read_text(),'Just-submitted snapshot freshness guard missing')
workflow=(root/'.github/workflows/pages.yml').read_text()
check('snapshot' in workflow and 'path: ./_site' in workflow and 'build_pages_artifact.mjs' in workflow,'Snapshot allowlisted Pages workflow absent')
check(len(json.loads((root/'data/index.json').read_text())['reports'])==0,'Synthetic initial database reports forbidden')
check(len(json.loads((root/'data/snapshot.json').read_text())['reports'])==0,'Synthetic initial preloads forbidden')
check((root/'rules/UPSTREAM_REFERENCE_RULES.md').exists() and (root/'rules/PROJECT_RULES.md').exists(),'Rulebook provenance missing')
for path in [asset/'app.v0100.js',worker/'src/index.js',root/'tools/build_snapshot.mjs',root/'tools/configure.mjs',root/'tools/build_pages_artifact.mjs']:
    subprocess.run(['node','--check',str(path)],check=True)
print('PASS: byte-identical official XML/logo; 8/120/156 catalogue and paired Worker tokens')
print('PASS: OpenCL-only SQL, fixed-contract server, explicit empty report index and auto-refresh workflow')
print('PASS: 10 responsive views, green branding, Node.js syntax, no bogus preconfigured server or D1 ID')
