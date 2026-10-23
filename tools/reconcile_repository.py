#!/usr/bin/env python3
from pathlib import Path
import sys
import hashlib

ROOT = Path(__file__).resolve().parents[1]
ACTIVE = frozenset({
    'export-and-pagination.test.mjs',
    'parity-live.test.mjs',
    'release-1254-gate.test.mjs',
    'reports-controls-parity.test.mjs',
    'snapshot.test.mjs',
    'vulkan-1412-visual-parity.test.mjs',
    'settings-1254-parity.test.mjs',
    'release-1000-visual-contract.test.mjs',
    'release-1001-icon-scroll.test.mjs',
    'release-1002-network-filter-logo.test.mjs',
    'release-1003-reference-parity.test.mjs',
    'release-1004-rich-views.test.mjs',
    'release-1006-statistics.test.mjs',
    'release-1006-information.test.mjs',
    'release-1008-interactions.test.mjs',
    'release-1008-sort-and-evidence.test.mjs',
    'release-1010-reference-navigation.test.mjs',
    'release-1011-evidence-network.test.mjs',
    'release-1012-evidence-modal.test.mjs',
    'release-1013-query-coverage.test.mjs',
    'release-1014-format-coverage.test.mjs',
    'release-1015-extension-coverage.test.mjs',
    'release-1016-compare-duplicates.test.mjs',
    'release-1017-visual-rebase.test.mjs',
    'release-1018-scrollbar-reports.test.mjs',
    'release-1019-reports-sorting.test.mjs',
    'release-1020-filter-scroll-stats.test.mjs',
    'release-1028-statistics-parity.test.mjs',
    'release-3405-boot-deploy.test.mjs',
    'release-3405-statistics-pager.test.mjs',
    'release-3405-nonblocking.test.mjs',
    'release-3405-shared-controls.test.mjs',
    'release-3405-strict-reference.test.mjs',
    'release-3411-video-properties.test.mjs',
    'release-3412-video-compare.test.mjs',
    'release-3413-video-control-parity.test.mjs',
    'release-3414-settings-reference.test.mjs','release-3415-deploy-manifest.test.mjs',
    'release-3410-reports-page-parity.test.mjs',
    'release-3410-neutral-palette.test.mjs',
    'release-3410-report-detail.test.mjs',
    'release-3410-browser-archive.test.mjs',
    'release-3410-chart-interactions.test.mjs',
})

# Immutable fingerprints of obsolete published root documentation from 3.4.8.
# Do not delete anything that has changed locally.
LEGACY_ROOT_FILES = {
    'COMPARISON_3.4.1.md': 'ad3b73275d2961f3a18ec0252c999fd79a796a5f80abb0f91b5d6becd8086b81',
    'COMPARISON_3.4.2.md': '15d8e98043143307528a0339f970c0a155880123d1133e708576b256f3d0409f',
    'COMPARISON_3.4.3.md': 'cb5034adeb8b0236475540d5e7dcc893630e503be2342a842526aad4332b50d6',
    'COMPARISON_3.4.4.md': 'e059566201ee4cad27d9f98d5d765689a64f7d725aa2221c53fd0c21298d2e06',
    'COMPARISON_3.4.5.md': '7856631294c85b4dada8c0bbaa9d694d40e1aff67791fcee42f31cab43bae94a',
    'COMPARISON_3.4.6.md': '18f52367d65279c1d6532fd7c8fc467f70722525ba43b8bceb84951a84463668',
    'COMPARISON_3.4.7.md': '788fca20ee90724bfc547c4aad25fc23d858947d347ca45c6878e63308b0fb05',
    'COMPARISON_3.4.8.md': '7767e01e3584be3cb1ff232ddc28d3352d9a4cdecf4553941631e60cb123c3f7',
    'DEPLOY_COMMANDS_POWERSHELL.txt': '521dee586188ce3dcb7a713f45a1332bc1e60234dc5668a97d11592298f086fe',
    'FILES_SHA256.txt': 'c3463cc16b28a389048ec364cd4816a7efc33a8f742d63adc4cddf33cb81e3b0',
    'FILE_MANIFEST_SHA256.txt': 'c3463cc16b28a389048ec364cd4816a7efc33a8f742d63adc4cddf33cb81e3b0',
    'FULL_VULKAN_DESIGN_COMPARISON_0.12.53.md': '2d3920e47946c79bf07ad6acd325f6700d010bb3104b7d80c14358d7775c2bfd',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.10.md': 'c42bd004fe78f86a60a3c0ddc1253d1e8c28556f92919a8f60bdaed49ecb5531',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.11.md': '1246ebbeedef741e38ae3d2678bcca437fe42f4accd1b15591d91bae3766525c',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.12.md': '5559ff7ba631eff4a4ffd5e5608b60a8803b41dd735c214c71f537b609509425',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.13.md': '45625dec3fc2d148715a6b7c2f531806e70c37103c0cb5e374b13a173b686bac',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.14.md': 'de660065f964ef680d1a2fdf4e79e5e913062872d962225e0d6100aa26d70e96',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.15.md': '1b54e255cc2fd18cc606b3c0c7beb974ce8ebd28a0593fa2d112a9dd8e2246d8',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.16.md': '4c7c50ec166686c6387bf90a73dda1b5d65f24fd83f370d00737e049ff5a557a',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.17.md': 'b23913aa1642575e81c39b2c8b34d2505d62dd93855db772d4a2e13a68f5b963',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.18.md': 'bff688b144717549513dac5044d0228a88b7e723dfb91b56aa0b3779cbbaecf2',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.19.md': '0e8cccc33176a1b57eeb6447aebe1bb90bb2e1d732005fd5be61a2224f87f611',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.20.md': 'd8e3e1e0fc8932974ce97aad5147783dacb29d97f398ec5f2ff2e79f5ad5bcf4',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.21.md': '5d35daac9bd0c04d86cab87462fdc4c6d3aca4e83ebfbe8f33e9a3a76707a7c7',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.22.md': '82acb7eacf0bcba82c578e6c8bd00493bb1bdbea96bd938c78ffd58704c57b81',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.23.md': 'c72055cfb13a8b8712644bc1d528cbcd9a54bed2aef98521db76e7008bc9cbcd',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.24.md': 'b8eea7843757a58ad803eaf4db403a0f0f624ba08f9c1a951d096232c701cac7',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.25.md': '1b9d43d0dc887c0662cb83e65f12052dfcdc80e3da9f3eec44219626c4f498c8',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.26.md': 'afb6fa17a3d4636b4fc312bf6ee3d9e526e144e166b787548029755a929abfeb',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.27.md': 'e468661aab2d1bc33d70be6a4de9d1bce135ff112068c281a3679b9521675b58',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.28.md': '5e30d4fdfbf364d2a76d668cf0a21d8fabacfb3caef32521ccf26156e3b65737',
    'FULL_VULKAN_DESIGN_COMPARISON_3.0.9.md': '38d9a2ac7efe10f766ac250f55b4ebfdd8e716067c029d2a6f65bee9250e0d23',
    'QA_3.4.1.md': 'c3586a1f2f31b923d460c3e69d0dd3bc1dfdaf65d6654b73354ccf8e54bba304',
    'QA_3.4.2.md': '20f4a0517d953e2a15ebeba474513c259c3c4dd22e8ea31c9fb78a68039cd6ba',
    'QA_3.4.3.md': 'd0ea519c3bec96031227760938eb4b9c10c51113de3cfb69934c75144709f3e9',
    'QA_3.4.4.md': 'fe1b66abb85de8ca9befd4e7051ae74a604f1fc914c01a81a3fd1e4cb992c73f',
    'QA_3.4.5.md': 'e52cc9debdefc86a0dc3dbb98e5aa4a6629cb5305feb388a91be4f31a952d021',
    'QA_3.4.6.md': 'c0ee0310d21e317e1e86f59f9a957bf18eaa73754be2c38ff0c9837167e97537',
    'QA_3.4.7.md': '0ba03595122e6d072216f6398ea3a4a9f0f2f74285116709454aa674403bc4e0',
    'QA_3.4.8.md': '4ae57807d841628fba25cde3b319555733a8fb30ff4a29ff8b0a24e1239e91a3',
    'QA_RESULTS.md': '778e7c53f3f2a4bf53c88cb0eff1fc44ee3761efeeea732a7af2a420a5bea3ac',
    'README.md': '68e36f24d17f9951be36c6852dcea3bbea5d81181824df987da610b9f481325c',
    'UI_CASCADE_DECLARATION_AUDIT_3.0.24.tsv': '703b431dfc1d25316a2e3ad4a647924024dd75c957d953a58ab766ea9686da48',
    'UI_SELECTOR_AUDIT_3.0.23.tsv': 'd68481335efd49462d1d7bd1d90c4b9a64045a4a9cff2dcebc344ddb7085b7c2',
}

def check(apply=False):
    leftover = [ROOT/name for name in LEGACY_ROOT_FILES if (ROOT/name).is_file()]
    if leftover and not apply:
        print('FAIL: obsolete release root documentation: '+', '.join(p.name for p in leftover),file=sys.stderr)
        print('Run reconcile_repository.py --apply; edited files are protected.',file=sys.stderr)
        return 1
    for obsolete in leftover:
        fingerprint = hashlib.sha256(obsolete.read_bytes()).hexdigest()
        if fingerprint != LEGACY_ROOT_FILES[obsolete.name]:
            print('FAIL: locally modified historical document protected: '+obsolete.name,file=sys.stderr)
            return 1
    for obsolete in leftover:
        obsolete.unlink()
        print('Removed verified obsolete root document: '+obsolete.name)
    tests = ROOT/'tests'
    existing = {p.name for p in tests.glob('*.test.mjs')}
    missing = sorted(ACTIVE - existing)
    unexpected = sorted(existing - ACTIVE)
    if missing:
        print('FAIL: required regression tests are missing: ' + ', '.join(missing), file=sys.stderr)
        return 1
    if unexpected:
        if not apply:
            print('FAIL: obsolete/unreviewed tests exist in tests/: ' + ', '.join(unexpected),file=sys.stderr)
            print('After extracting the release over your existing folder, run python -B tools/reconcile_repository.py --apply before committing.',file=sys.stderr)
            return 1
        archive = ROOT/'rules'/'legacy_tests'
        archive.mkdir(parents=True,exist_ok=True)
        for name in unexpected:
            source = tests/name
            destination = archive/name
            if destination.exists():
                print('FAIL: archive file already exists, refusing overwrite: '+str(destination),file=sys.stderr)
                return 1
            source.rename(destination)
            print('Archived legacy/unreviewed test without deleting: '+name)
    outdated = [p for stem,extension in (('app','js'),('site','css')) for p in (ROOT/'assets').glob(f'{stem}.v*.{extension}')]
    stale = sorted(p for p in outdated if p.name not in ('app.v3415.js','site.v3415.css'))
    if stale and not apply:
        print('FAIL: stale outdated browser assets: '+', '.join(p.name for p in stale),file=sys.stderr)
        return 1
    if stale:
        for old in stale:
            latest = ROOT/'assets'/('app.v3415.js' if old.name.startswith('app.') else 'site.v3415.css')
            if not latest.exists():
                print('FAIL: missing new replacement for '+old.name,file=sys.stderr)
                return 1
            old.unlink()
            print('Removed old browser cache artifact: '+old.name)
    stale_parity = sorted(p for p in (ROOT/'assets').glob('parity.v*.css') if p.name != 'parity.v3415.css')
    if stale_parity and not apply:
        print('FAIL: stale obsolete visual parity assets: '+', '.join(p.name for p in stale_parity),file=sys.stderr)
        return 1
    if stale_parity:
        if not (ROOT/'assets'/'parity.v3415.css').exists():
            print('FAIL: replacement parity.v3415.css missing',file=sys.stderr)
            return 1
        for old in stale_parity:
            old.unlink()
            print('Removed unreferenced previous parity asset: '+old.name)
    stale_shell = sorted(p for p in (ROOT/'assets').glob('reference-shell.v*.css') if p.name != 'reference-shell.v3415.css')
    stale_bootstrap = sorted(p for p in (ROOT/'assets').glob('release-bootstrap.v*.js') if p.name != 'release-bootstrap.v3415.js')
    stale_color_assets = stale_shell + stale_bootstrap
    if stale_color_assets and not apply:
        print('FAIL: stale release shell/bootstrap assets: '+', '.join(p.name for p in stale_color_assets),file=sys.stderr)
        return 1
    if stale_color_assets:
        if not (ROOT/'assets/reference-shell.v3415.css').is_file() or not (ROOT/'assets/release-bootstrap.v3415.js').is_file():
            print('FAIL: active replacement shell/bootstrap not available',file=sys.stderr)
            return 1
        for old in stale_color_assets:
            old.unlink()
            print('Removed superseded release shell/bootstrap asset: '+old.name)
    old_detail = sorted(path for path in (ROOT/'assets').glob('report-detail.v*.css') if path.name != 'report-detail.v3415.css')
    if old_detail and not apply:
        print('FAIL: stale report detail stylesheets: '+', '.join(path.name for path in old_detail),file=sys.stderr)
        return 1
    if old_detail:
        if not (ROOT/'assets/report-detail.v3415.css').is_file():
            print('FAIL: missing active report-detail stylesheet',file=sys.stderr)
            return 1
        for path in old_detail:
            path.unlink()
            print('Removed stale report detail stylesheet: '+path.name)
    old_controls = sorted(path for path in (ROOT/'assets').glob('reference-controls.v*.css') if path.name != 'reference-controls.v3415.css')
    if old_controls and not apply:
        print('FAIL: stale reference-control stylesheets: '+', '.join(path.name for path in old_controls),file=sys.stderr)
        return 1
    if old_controls:
        if not (ROOT/'assets/reference-controls.v3415.css').is_file():
            print('FAIL: missing active reference-control stylesheet',file=sys.stderr)
            return 1
        for path in old_controls:
            path.unlink()
            print('Removed stale reference-control stylesheet: '+path.name)
    stale_worker = {
        'release-1256-opencl-c-version.test.mjs':'fadda3d9d78cd6d43c109e1ad8da78ff01512f6ca4f8a07fa2edb35ce0b59477',
        'release-1257-build-contract.test.mjs':'92356928e701000afcf65de67a845a16544044e15cdbbfd71db12e78355ee2bd',
    }
    old_worker = ROOT/'worker'/'tests'
    leftovers = [old_worker/name for name in stale_worker if (old_worker/name).exists()]
    if leftovers and not apply:
        print('FAIL: older producer-admission regression tests remain: '+', '.join(x.name for x in leftovers),file=sys.stderr)
        return 1
    if leftovers:
        for old in leftovers:
            if hashlib.sha256(old.read_bytes()).hexdigest() != stale_worker[old.name]:
                print('FAIL: unexpected edits in legacy test: '+old.name,file=sys.stderr)
                return 1
        for old in leftovers:
            old.unlink()
            print('Removed duplicate archived legacy worker test: '+old.name)
    print(f'PASS: {len(ACTIVE)} active site test files; unexpected test files: 0')
    return 0

if __name__=='__main__':
    if sys.argv[1:] not in [[],['--check'],['--apply']]:
        print('Use --check or --apply',file=sys.stderr)
        sys.exit(2)
    sys.exit(check(sys.argv[1:]==['--apply']))
