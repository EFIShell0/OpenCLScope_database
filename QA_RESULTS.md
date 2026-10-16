# OpenCLScope Database 1.0.2 — QA (2026-10-16)

## Comparison
- Previous OpenCLScope Database 1.0.1, VulkanScope Database 1.4.12 full source, and Android OpenCLScope 1.0.19 `ic_opencl_tab.png` were inspected.
- The site header and splash use the original pre-1.0.1 horizontal wordmark. Favicons exclusively use the original CL tab mark with an opaque black square; the original PNG is included as `assets/opencl_tab_original.png`.
- The VulkanScope 1.4.12 request-scoped Cloudflare network-info projection is ported. A new GET `/v1/network-info` does not write a D1 report or log addresses. The frontend masks IPs until user selection, does not invent a second family or a DNS resolver, and explains missing production configuration.
- Custom select root cause: upstream CSS hides listboxes unless `.custom-select.open` is present, but 1.0.1 only changed `[hidden]`. Both the class and hidden states are synchronized. Actual report-driven Device/Driver listboxes were added and wired into report and aggregate evidence filtering.
- OpenCL brand accent color mismatch for decorative Vulkan-only red was corrected in local CSS. Existing pinned upstream table scrolling controls and source evidence are preserved.

## Executed
- Node `--test tests/*.test.mjs worker/tests/*.test.mjs`: **54/54 PASS**.
- `python -B tools/reconcile_repository.py --check`: PASS.
- `python -B tools/verify_release.py`: PASS.
- `node tools/build_pages_artifact.mjs`: PASS.
- Chromium (headless) 1440px, 390px and 320px: 11 SVG navigation icons, functional Device dropdown selection, Reports row, no JS errors, no page-level horizontal overflow. Mocked endpoint provided documentation-range network data: address hidden before Show and visible after. On 390px / 320px, right table arrow moved scrollLeft **0→238** / **0→188**.
- Worker unit regression: request-scoped `/v1/network-info` returns family-specific observation, 405 on unsupported method, 403 on forbidden Origin and no-cache header.

## Unverified or conditional
- Real Cloudflare Worker/D1, GitHub Pages deployment, public IP disclosure of a real visitor and screenshot parity against all VulkanScope screens: NOT TESTED.
- Production Pages requires the GitHub Actions repository variable `OPENCLSCOPE_DATABASE_API` to be set to the deployed Worker's HTTPS origin. Source `config.js` deliberately starts empty; `tools/configure.mjs` fills it at publish time and pins CSP.
- OpenCL schema 1 and exact 1.0.19/10019 new POST admission remain unchanged; historical report reads are preserved. No claim of full pixel-for-pixel VulkanScope equivalence.
