# OpenCLScope™ Database 3.0.32

OpenCL™ report-backed database with the pinned VulkanScope Database 1.4.12 UI reference, retained data/Worker contracts and unchanged official Khronos registry. This is not an official Khronos application.

## Paired native build hotfix

OpenCLScope Android 3.0.11 / 30011 is the only new report producer. Stored complete 3.0.10, 3.0.9, 3.0.8 and 3.0.7 records are still verified under their own strict historical contracts for GET and snapshot. No automatic upload or fabricated GPU evidence has been introduced. Worker 3.0.32 must be deployed before submission from Android 3.0.11.

Run `python -B tools/verify_release.py` and `node --test tests/*.test.mjs worker/tests/*.test.mjs` locally. The source verification passed, with 146/146 tests. Cloudflare deployment and physical-device behavior were not tested in this environment.

`DEPLOY_COMMANDS_POWERSHELL.txt` includes publishing commands. The user is responsible for credentials and deployment.
