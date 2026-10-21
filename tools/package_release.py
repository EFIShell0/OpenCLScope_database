#!/usr/bin/env python3
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
ALLOW_DIRS = {'.github', 'assets', 'data', 'docs', 'licenses', 'registry', 'rules', 'tests', 'tools', 'worker'}
EXCLUDE_DIRS = {'.git', '.wrangler', 'node_modules', '__pycache__', '.pytest_cache', '_site', 'dist', '.next', 'coverage', '.cache', 'tmp'}
EXCLUDE_FILES = {'.env', '.dev.vars', '.DS_Store', 'npm-debug.log', 'yarn-error.log'}
EXCLUDE_EXTENSIONS = {'.pem', '.key', '.p12', '.pfx', '.log', '.pyc', '.sqlite', '.db'}


def is_allowed(path):
    rel = path.relative_to(ROOT)
    if path.is_symlink():
        raise ValueError(f'Symbolic link cannot enter release archive: {rel}')
    if any(p in EXCLUDE_DIRS for p in rel.parts):
        return False
    if path.name in EXCLUDE_FILES or path.suffix.lower() in EXCLUDE_EXTENSIONS:
        return False
    if path.name.startswith('.env.') or path.name.startswith('.dev.vars.') or path.name.startswith('wrangler-account'):
        return False
    if path.parts[-1].endswith('.zip') or path.parts[-1].endswith('.zip.sha256'):
        return False
    if len(rel.parts) == 1:
        return True
    if rel.parts[0] not in ALLOW_DIRS:
        return False
    return path.is_file()


def release_files():
    return sorted((p for p in ROOT.rglob('*') if p.is_file() and is_allowed(p)), key=lambda p: p.relative_to(ROOT).as_posix())


def package(folder, verify_existing=False):
    marker = json.loads((ROOT/'data/release.json').read_text(encoding='utf-8'))
    version = marker['databaseVersion']
    assert version == '3.0.30', 'Unexpected version; update the package release gate'
    out = Path(folder)
    out.mkdir(parents=True, exist_ok=True)
    archive = out/f'OpenCLScope-Database-{version}.zip'
    files = release_files()
    assert len(files) > 400, 'Unexpectedly small release source tree'
    assert any(x.relative_to(ROOT).as_posix() == 'rules/PROJECT_RULES.md' for x in files)
    assert any(x.relative_to(ROOT).as_posix() == '.github/workflows/pages.yml' for x in files)
    if not verify_existing:
        with ZipFile(archive,'w',compression=ZIP_DEFLATED,compresslevel=9) as z:
            for p in files:
                arc = p.relative_to(ROOT).as_posix()
                info = ZipInfo(arc,date_time=(2026,1,1,0,0,0))
                info.compress_type = ZIP_DEFLATED
                info.external_attr = (0o100644 << 16)
                z.writestr(info,p.read_bytes(),compress_type=ZIP_DEFLATED,compresslevel=9)
    with ZipFile(archive) as z:
        assert z.testzip() is None, 'Corrupted archive'
        assert z.namelist() == [p.relative_to(ROOT).as_posix() for p in files], 'Release contents mismatch'
        for p in files:
            arc = p.relative_to(ROOT).as_posix()
            assert hashlib.sha256(z.read(arc)).digest() == hashlib.sha256(p.read_bytes()).digest(), f'Changed release source: {arc}'
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    sha = out/(archive.name+'.sha256')
    value = f'{digest}  {archive.name}\n'
    if verify_existing:
        assert sha.read_text() == value, 'Release archive hash manifest mismatch'
    else:
        sha.write_text(value,encoding='utf-8')
    print(f'PASS: {archive.name}: {len(files)} source files, SHA-256 {digest}')


if __name__ == '__main__':
    if len(sys.argv) not in (2,3) or (len(sys.argv)==3 and sys.argv[2] != '--verify-existing'):
        raise SystemExit('Usage: python tools/package_release.py <output-dir> [--verify-existing]')
    package(sys.argv[1],len(sys.argv)==3)
