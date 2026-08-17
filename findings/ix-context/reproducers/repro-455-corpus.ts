// Phase-8 reproduction harness for #455 (read-side schema validation gap)
import {
  buildBundle,
  saveInvestigation,
  loadInvestigation,
} from "./src/cli/commands/context.js";

import type { EntityFacts } from "./src/client/types.js";
import { mkdtempSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const home = mkdtempSync(join(tmpdir(), "ix-repro-corpus-"));
process.env.IX_HOME = home;
const investigationsDir = () => join(home, "investigations");

function makeFacts(overrides: Partial<EntityFacts> = {}): EntityFacts {
  return {
    id: "entity-1", name: "Widget", kind: "class",
    members: ["render"], memberCount: 1, callerCount: 1, calleeCount: 1,
    dependentCount: 0, importerCount: 0, downstreamDependents: 1, downstreamDepth: 1,
    topCallers: ["App"], topDependents: ["App"],
    historyLength: 1, introducedRev: 1, stale: false, diagnostics: [],
    ...overrides,
  };
}

function makeBundle() {
  return buildBundle({
    resolved: { id: "entity-1", name: "Widget", kind: "class", resolutionMode: "exact" },
    facts: makeFacts(),
    context: {
      claims: [], conflicts: [], decisions: [], intents: [],
      nodes: [], edges: [],
      metadata: { query: "Widget", seedEntities: ["entity-1"], hopsExpanded: 0, asOfRev: 1 },
    },
    provenance: { sourceType: "source", extractor: "tree-sitter", observedAt: "2026-01-01T00:00:00Z" },
    asOfRev: undefined, depth: undefined,
    budgets: { maxEntities: 50, maxRelationships: 100, maxEvidence: 25, maxChars: 12000 },
  });
}

interface CaseResult {
  case: string;
  expected: "accepted" | "rejected";
  observed: "accepted" | "rejected";
  pass: boolean;
  detail?: string;
}

const results: CaseResult[] = [];
function record(c: string, expected: "accepted" | "rejected", loadResult: unknown, detail?: string) {
  const observed = loadResult === undefined ? "rejected" : "accepted";
  results.push({ case: c, expected, observed, pass: expected === observed, detail });
}

// 0: valid envelope + valid body
saveInvestigation("control", makeBundle());
const r0 = loadInvestigation("control");
record("0_valid_envelope_and_body", "accepted", r0);

// 1: tampered bundle body, envelope intact
const path = join(investigationsDir(), "control.json");
const raw = JSON.parse(readFileSync(path, "utf8"));
raw.bundle.entities = "not-an-array";
writeFileSync(path, JSON.stringify(raw, null, 2), "utf8");
const r1 = loadInvestigation("control");
record("1_envelope_ok_bundle_entities_string", "rejected", r1);

// 2: malformed JSON (truncated)
mkdirSync(investigationsDir(), { recursive: true });
const p2 = join(investigationsDir(), "truncated.json");
writeFileSync(p2, '{"schema":"ix-investigation/1","id":"x', "utf8");
record("2_truncated_json", "rejected", loadInvestigation("truncated"));

// 3: forward-compat envelope (v2)
const p3 = join(investigationsDir(), "v2.json");
writeFileSync(p3, JSON.stringify({
  schema: "ix-investigation/2",
  id: "v2", savedAt: new Date().toISOString(),
  bundle: {},
}), "utf8");
record("3_envelope_v2_with_empty_body", "rejected", loadInvestigation("v2"));

// 4: envelope ok, body null
const p4 = join(investigationsDir(), "nobundle.json");
writeFileSync(p4, JSON.stringify({
  schema: "ix-investigation/1",
  id: "nobundle", savedAt: new Date().toISOString(),
  bundle: null,
}), "utf8");
record("4_envelope_ok_body_null", "rejected", loadInvestigation("nobundle"));

// 5: envelope ok, body missing required field
const b5: Record<string, unknown> = JSON.parse(JSON.stringify(makeBundle()));
delete b5.entities;
const p5 = join(investigationsDir(), "missing-entities.json");
writeFileSync(p5, JSON.stringify({
  schema: "ix-investigation/1",
  id: "missing-entities", savedAt: new Date().toISOString(),
  bundle: b5,
}), "utf8");
record("5_envelope_ok_bundle_missing_entities", "rejected", loadInvestigation("missing-entities"));

// 6: bundle wholly wrong shape
const p6 = join(investigationsDir(), "legacy.json");
writeFileSync(p6, JSON.stringify({
  schema: "ix-investigation/1",
  id: "legacy", savedAt: new Date().toISOString(),
  bundle: { foo: 1, bar: 2 },
}), "utf8");
record("6_envelope_ok_bundle_completely_wrong_shape", "rejected", loadInvestigation("legacy"));

// 7: hostile id + symlink outside investigations dir
mkdirSync(join(home, "fake"), { recursive: true });
const fake = join(home, "fake", "evil.json");
writeFileSync(fake, JSON.stringify({
  schema: "ix-investigation/1",
  id: "evil", savedAt: new Date().toISOString(),
  bundle: { foo: 1 },
}), "utf8");
const symlinkedId = "fake-evil";
const target = join(investigationsDir(), `${symlinkedId}.json`);
if (existsSync(target)) rmSync(target);
symlinkSync(fake, target);
record("7_envelope_ok_bundle_via_symlink_outside_tree", "rejected", loadInvestigation("fake-evil"),
  "symlink inside investigations dir pointing to file outside: loader does NOT realpath-resolve; without safeParse, body flows through");

// 8: --diff scenario lite
saveInvestigation("e2e", makeBundle());
const ok = loadInvestigation("e2e");
let okResult: "accepted" | "rejected" = "rejected";
if (ok && Array.isArray(ok.bundle.entities)) okResult = "accepted";
record("8_e2e_resume_smoke", "accepted", okResult);

console.log("\n=== ORIGIN/MAIN BASELINE — no #455 ===\n");
for (const r of results) {
  const mark = r.pass ? "PASS" : "FAIL";
  console.log(`${mark}  case=${r.case.padEnd(40)} expected=${r.expected.padEnd(9)} observed=${r.observed.padEnd(9)}${r.detail ? "  // " + r.detail : ""}`);
}
const failures = results.filter(r => !r.pass);
console.log(`\n${results.length - failures.length}/${results.length} pass`);

rmSync(home, { recursive: true, force: true });
delete process.env.IX_HOME;
