# OpenCLScope Database 3.4.5 — QA

- Baseline: complete OpenCLScope Database 3.4.4 ZIP, immutable VulkanScope Database 1.4.12 source.
- Native Vulkan CSS SHA-256: `bd5957461701439a7655c652b4e560cb84b7cc0163f202a257e019c2c468181b` (unchanged).
- `registry/cl.xml` sha pinned through `tools/verify_release.py` (unchanged).
- Frontend + Worker Node test runner: **170/170 pass** (167 original, 3 new source regression tests).
- `tools/reconcile_repository.py --check`: PASS.
- `tools/verify_release.py`: PASS.
- Chromium isolation, 1440×900 and 390×844: SVG search-clear behavior, focus/aria state, 90ms debounced render, Reports row Enter, Shift+F10/Escape, copy icon, touch hold suppress-click, no JavaScript errors and no horizontal viewport overscroll: PASS.
- Synthetic QA report summary existed only in browser memory and was not saved to `data/index.json` or `data/snapshot.json`.
- Staged GitHub Actions pipeline preserved: `windows-tooling → build → release → deploy`, separate `snapshot-refresh` (source inspection only).
- Real GitHub Actions, Cloudflare Worker/D1, full populated Vulkan-vs-OpenCL pixel parity: NOT TESTED.

## Caution

Source tests and isolated DOM interaction tests do not prove all screens, source text, animations or controls identical to VulkanScope. Publish only after reviewing the Git diff and successful CI on the real repository.
