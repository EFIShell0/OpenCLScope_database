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

def allowed(path):
    rel = path.relative_to(ROOT)
    if path.is_symlink():
        raise ValueError(f'Release refuses a symlink: {rel}')
    if any(part in EXCLUDE_DIRS for part in rel.parts):
        return False
    if path.name in EXCLUDE_FILES or path.suffix.lower() in EXCLUDE_EXTENSIONS:
        return False
    if path.name.startswith(('.env.', '.dev.vars.', 'wrangler-account')):
        return False
    if path.name.endswith(('.zip','.zip.sha256')):
        return False
    if len(rel.parts)>1 and rel.parts[0] not in ALLOW_DIRS:
        return False
    return path.is_file()

def package(out_dir,verify_existing=False):
    marker=json.loads((ROOT/'data/release.json').read_text(encoding='utf-8'))
    version=marker['databaseVersion']
    if version!='3.4.14':
        raise ValueError('Unexpected database version')
    paths=sorted((p for p in ROOT.rglob('*') if p.is_file() and allowed(p)),key=lambda p:p.relative_to(ROOT).as_posix())
    if len(paths)<400 or not any(x.relative_to(ROOT).as_posix()=='.github/workflows/pages.yml' for x in paths):
        raise ValueError('Incomplete release source')
    target=Path(out_dir)
    target.mkdir(parents=True,exist_ok=True)
    archive=target/f'OpenCLScope-Database-{version}.zip'
    if not verify_existing:
        with ZipFile(archive,'w',compression=ZIP_DEFLATED,compresslevel=9) as z:
            for source in paths:
                relative=source.relative_to(ROOT).as_posix()
                info=ZipInfo(relative,date_time=(2026,1,1,0,0,0))
                info.compress_type=ZIP_DEFLATED
                info.external_attr=0o100644<<16
                z.writestr(info,source.read_bytes(),compress_type=ZIP_DEFLATED,compresslevel=9)
    with ZipFile(archive) as z:
        if z.testzip() is not None:
            raise ValueError('ZIP CRC mismatch')
        if z.namelist()!=[p.relative_to(ROOT).as_posix() for p in paths]:
            raise ValueError('ZIP manifest differs from source')
        for source in paths:
            if hashlib.sha256(z.read(source.relative_to(ROOT).as_posix())).digest()!=hashlib.sha256(source.read_bytes()).digest():
                raise ValueError(f'Unexpected ZIP content: {source.name}')
    digest=hashlib.sha256(archive.read_bytes()).hexdigest()
    sha=target/(archive.name+'.sha256')
    value=f'{digest}  {archive.name}\n'
    if verify_existing:
        if sha.read_text(encoding='utf-8')!=value:
            raise ValueError('ZIP manifest mismatch')
    else:
        sha.write_text(value,encoding='utf-8')
    print(f'PASS: {archive.name}: {len(paths)} verified source files, SHA-256 {digest}')

if __name__=='__main__':
    if len(sys.argv) not in (2,3) or (len(sys.argv)==3 and sys.argv[2]!='--verify-existing'):
        raise SystemExit('Usage: python tools/package_release.py <output-dir> [--verify-existing]')
    package(sys.argv[1],len(sys.argv)==3)
