# Deploy OpenCLScope Database 0.1.0

This project cannot be live merely by creating a ZIP: Cloudflare/D1 and GitHub Pages must be configured with accounts owned by the deployer. Use a **new** D1 database and a **new** Pages repository; do not bind or overwrite VulkanScope Database tables.

## 1. Cloudflare API and D1

From the extracted Database project, in `worker/`:

```bash
npm install
npx wrangler login
npx wrangler d1 create openclscope-database
```

Copy the D1 UUID returned by the last command into the `database_id` property in `worker/wrangler.jsonc`, replacing the sentinel `REPLACE_WITH_NEW_OPENCLSCOPE_D1_DATABASE_ID` (do not change `binding: "DB"`). Update `ALLOWED_ORIGIN` if the actual Pages site is not hosted at the indicated origin. The origin is *protocol and host only*, not a repository subpath. Update `SNAPSHOT_GITHUB_OWNER`, `SNAPSHOT_GITHUB_REPO`, `SNAPSHOT_GITHUB_WORKFLOW` and `SNAPSHOT_GITHUB_REF` to your actual new repository/branch.

```bash
npm run test
npx wrangler d1 migrations apply openclscope-database --remote
npx wrangler secret put SNAPSHOT_GITHUB_TOKEN
npx wrangler deploy
```

Provide a scoped GitHub token with Actions/workflow dispatch permission for the **new database repository**. Wrangler writes the secret to your Cloudflare account; do not write it into any source file. Copy the actual `https://...workers.dev` URL returned on deploy and check `GET /v1/health`.

## 2. Pages repository

Commit the **contents** of the `OpenCLScope-Database-0.1.0` root to a new GitHub repository on the configured branch. Enable Settings → Pages → Source **GitHub Actions**. Set GitHub repository variable `OPENCLSCOPE_DATABASE_API` to the actual deployed Worker HTTPS origin (no trailing path). If host or repository name changes, update `ALLOWED_ORIGIN` in Worker and deploy again. The production `tools/configure.mjs` injects this exact API URL in `config.js` and restricts the browser CSP connect-src to the same origin; source defaults remain deliberately empty.

Run the Pages workflow once manually with mode `snapshot` and blank `report_id` to publish the initial empty site. The workflow validates code and catalog, configures the real fixed URL, downloads the full published D1 report index and a bounded full-report preload, and deploys the rebuilt static site. On first **new** report the Worker dispatches the same workflow with the report ID so it is required to appear in the generated index before deployment. If GitHub token/workflow vars are unconfigured, reports may store in D1 successfully but no automatic Pages refresh can happen; `/v1/health` exposes the configured snapshot flag.

## 3. Pair Android 0.2.0

Build the **separate** `OpenCLScope-0.2.0` source with these real URLs, substituting YOUR actual values:

```powershell
.\gradlew.bat :app:assembleDebug -PopenclscopeDatabaseApiUrl=https://YOUR-ACTUAL-WORKER.workers.dev -PopenclscopeDatabaseWebUrl=https://YOUR-USERNAME.github.io/OpenCLScope_database
```

No startup report upload occurs. Press **Reports & Database → Submit complete report** and confirm after collecting a complete live OpenCL report. The server returns a SHA-256 ID and authoritative UTC timestamp. Public GET list/ID work separately. If the Worker returns HTTP 400, read the JSON error `Invalid OpenCLScope report [reason]` and compare schema, producer version, registry SHA, complete 8/120 keys and live/complete status; never silently omit failed query rows to satisfy the backend.

## 4. Reproducible checks

```bash
python3 tools/verify_release.py
node --test worker/tests/*.test.mjs
node --test tests/*.test.mjs
```

For a deployed production environment, also test a real Android native report on each intended ABI, then confirm the Worker public ID is readable, `/v1/sync` increases, GitHub Actions dispatch runs and Pages index includes that specific ID. These **live tests are not claimed executed** by the source ZIP creator.
