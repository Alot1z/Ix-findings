import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const mirrorPath = resolve(root, "knowledge/external-github-mirror.json");
if (!existsSync(mirrorPath)) throw new Error("Current external mirror is missing");
const mirror = JSON.parse(readFileSync(mirrorPath, "utf8"));
const version = String(mirror.snapshot_version || mirror.generated_at || "unknown").replace(/[^A-Za-z0-9_.-]/g, "_");
const dir = resolve(root, "planning/phase-e/source-snapshots");
mkdirSync(dir, { recursive: true });
const archive = resolve(dir, `${version}.json`);
if (!existsSync(archive)) copyFileSync(mirrorPath, archive);
const manifestPath = resolve(root, "planning/phase-e/SNAPSHOT-MANIFEST.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { schema_version: "phase-e.snapshot-manifest.v1", snapshots: [] };
if (!manifest.snapshots.some(item => item.snapshot_version === (mirror.snapshot_version || mirror.generated_at))) manifest.snapshots.push({ snapshot_version: mirror.snapshot_version || mirror.generated_at, file: `planning/phase-e/source-snapshots/${version}.json`, source: mirror.source_capture, archived_at: new Date().toISOString() });
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({ archived: archive.replace(root.replaceAll("\\", "/") + "/", ""), snapshot_version: mirror.snapshot_version || mirror.generated_at, known_snapshots: manifest.snapshots.length }, null, 2));
