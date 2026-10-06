CREATE TABLE IF NOT EXISTS reports (
 id TEXT PRIMARY KEY CHECK(length(id)=64),
 submitted_at TEXT NOT NULL,
 schema_version INTEGER NOT NULL CHECK(schema_version=1),
 device_name TEXT NOT NULL,
 vendor TEXT NOT NULL,
 platform_name TEXT NOT NULL,
 opencl_version TEXT NOT NULL,
 driver_version TEXT NOT NULL,
 manufacturer TEXT NOT NULL,
 model TEXT NOT NULL,
 platform_count INTEGER NOT NULL,
 device_count INTEGER NOT NULL,
 payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reports_submitted_id ON reports(submitted_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS idx_reports_device ON reports(device_name);
CREATE INDEX IF NOT EXISTS idx_reports_vendor ON reports(vendor);
CREATE INDEX IF NOT EXISTS idx_reports_version ON reports(opencl_version);
CREATE TABLE IF NOT EXISTS report_payload_chunks (
 report_id TEXT NOT NULL,
 chunk_index INTEGER NOT NULL,
 payload_chunk TEXT NOT NULL CHECK(length(CAST(payload_chunk AS BLOB)) <= 1000000),
 PRIMARY KEY(report_id,chunk_index),
 FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE
);
