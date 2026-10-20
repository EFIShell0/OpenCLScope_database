# VulkanScope Database 1.4.12 versus OpenCLScope Database 3.0.13

## Reference and scope

Source basis: the user-provided/available VulkanScope Database 1.4.12 reference, OpenCLScope Database 3.0.12 source, and immutable `rules/PROJECT_RULES.md`. This is stage five, **not** a claim of full app parity. Vulkan-only physical-device/surface/queue/HDR semantics are excluded from the OpenCL web UI; OpenCL properties use only canonical OpenCL evidence.

## Differences closed this stage

| Shared behavior | Reference mechanism | OpenCL 3.0.12 difference | 3.0.13 correction |
|---|---|---|---|
| Compare sticky panel | VulkanScope dynamically pins a compare header with minimized state | Scrolling hid selector and filters | Dynamic pin/placeholder with viewport-relative geometry and collapse/expand, tested at 1440/390 |
| Two-report URL | `#compare/<id>/<id>` style route | No shareable identity route | Strict 64-hex pair restoration, route state and copy link; explicit load remains required |
| Comparison export | Explicit per-view controls | No filtered comparison export | Bounded local-only JSON and TXT export of all matching semantic records, not just current page |
| Local favorites transfer | Controlled browser state actions | Could save or clear but not import/export IDs | Explicit JSON backup/merge, schema/size/count/ID verification, opt-in persistence preserved |
| Report context actions | Reference supports report selection / contextual gestures | No visible more actions, context/long-press | More-actions button, pointer long-press, context menu and keyboard navigation; no server mutations |

## Evidence integrity and remaining differences

- New report POSTs still require exact OpenCLScope 3.0.8/30008. Legacy complete reports remain historical GET data. All raw OpenCL query names, values, states and image-format pairs remain unchanged.
- The comparison is semantic, not a raw-report diff; identity normalization collapses equivalent keys for display. Users can still download the original canonical report separately.
- Import operates **only** on local favorite report IDs; it does not import/upload report payloads. Invalid input leaves current favorites unchanged.
- Pixel-perfect VulkanScope equality remains **unverified**. Compare's rich per-section sort and specialized chart cards, some import/export dialogues outside Favorites, fine-grained hover/scroll thumb animations and other long-press interactions on unrelated screens are still not fully matched.
- Cloudflare Worker/D1/Pages, GitHub Actions, physical Android reports and app compilation were not exercised. Browser tests used only in-memory markup and local test-only report fixtures; they do not confirm live publication or hardware capabilities.
