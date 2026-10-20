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
})

def check(apply=False):
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
    stale = sorted(p for p in outdated if p.name not in ('app.v1009.js','site.v1008.css'))
    if stale and not apply:
        print('FAIL: stale outdated browser assets: '+', '.join(p.name for p in stale),file=sys.stderr)
        return 1
    if stale:
        for old in stale:
            latest = ROOT/'assets'/('app.v1009.js' if old.name.startswith('app.') else 'site.v1008.css')
            if not latest.exists():
                print('FAIL: missing new replacement for '+old.name,file=sys.stderr)
                return 1
            old.unlink()
            print('Removed old browser cache artifact: '+old.name)
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
