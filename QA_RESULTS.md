# OpenCLScope Database 3.0.32 — QA

- Source: user Library OpenCLScope Database 3.0.31 + public GitHub release workflow architecture.
- Windows CSS hash failure reproduced: original LF SHA-256 `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b`, CRLF SHA-256 `b6e958cd79392be724347f56b944534914f08d3c30fb6092a76665a3b1d9bbc4`.
- Git `.gitattributes` now pins LF text checkouts and raw registry assets; simulated Windows-like `core.autocrlf=true` checkout retains canonical CSS digest.
- Compare test now tolerates CRLF source function boundaries without bypassing report semantics.
- Local regression results: 148/148 PASS (tests + Worker), Python release gate PASS; Pages allowlist audit 306 entries PASS; deterministic ZIP digest PASS.
- Current producer remains OpenCLScope 3.0.11/30011. Existing full historical report reads unchanged; Worker/D1/registry byte contracts unchanged.
- Github-hosted Windows CI, GitHub Release and live Cloudflare deployment remain unexecuted and must be verified after user push.
