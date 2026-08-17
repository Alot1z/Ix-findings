// Reproduction: ix context --resume / --diff when a saved investigation's
// envelope is intact but the bundle body has been tampered.

import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// We'll re-use the publicly-exported buildBundle to forge a valid bundle, then
// inspect what saveInvestigation/loadInvestigation do with a tampered file.

import {
  buildBundle,
  saveInvestigation,
  loadInvestigation,
  diffInvestigations,
} from "./src/cli/commands/context.js";

import type { EntityFacts, ConflictReport, DecisionReport, IntentReport } from "./src/client/types.js";
import type { GraphEdge, GraphNode, ScoredClaim } from "./src/client/types.js";

function makeFacts(overrides: Partial<EntityFacts> = {}): EntityFacts {
  return {
    id: "entity-1", name: "Widget", kind: "class",
    members: [], memberCount: 0, callerCount: 1, calleeCount: 1,
    dependentCount: 0, importerCount: 0, downstreamDependents: 1, downstreamDepth: 1,
    topCallers: [], topDependents: [], historyLength: 1, introducedRev: 1,
    stale: false, diagnostics: [], ...overrides,
  };
}

const home = mkdtempSync(join(tmpdir(), "ix-repro-"));
process.env.IX_HOME = home;
console.log(`IX_HOME = ${home}`);

console.log("\n=== SCENARIO 1: well-formed investigation ===");
const bundle = buildBundle({
  resolved: { id: "entity-1", name: "Widget", kind: "class", resolutionMode: "exact" },
  facts: makeFacts(),
  context: {
    claims: [], conflicts: [], decisions: [], intents: [],
    nodes: [], edges: [],
    metadata: { query: "Widget", seedEntities: ["entity-1"], hopsExpanded: 0, asOfRev: 1 },
  },
  provenance: {},
  budgets: { maxEntities: 50, maxRelationships: 100, maxEvidence: 25, maxChars: 12000 },
});
saveInvestigation("well-formed", bundle);
const path = join(home, "investigations", "well-formed.json");
console.log(`Created: ${path}`);
const okLoad = loadInvestigation("well-formed");
console.log(`loadInvestigation("well-formed") => ${okLoad ? "OK" : "REFUSED"}`);

console.log("\n=== SCENARIO 2: tampered body, valid envelope (the gap #455 closes) ===");
const raw = JSON.parse(readFileSync(path, "utf8"));
console.log(`Original envelope: schema=${raw.schema}, id=${raw.id}`);
console.log(`Original bundle.entities is ${typeof raw.bundle.entities} = "${JSON.stringify(raw.bundle.entities).slice(0,40)}..."`);
raw.bundle.entities = "not-an-array"; // tamper body, leave envelope intact
writeFileSync(path, JSON.stringify(raw, null, 2));
console.log(`Tampered: bundle.entities is now "${raw.bundle.entities}"`);
console.log(`Envelope still valid? schema="${raw.schema}", bundle truthy=${!!raw.bundle}`);

const suspectLoad = loadInvestigation("well-formed");
console.log(`loadInvestigation("well-formed") on tampered file => ${suspectLoad ? "ACCEPTED (BUG)" : "REFUSED"}`);

if (suspectLoad) {
  console.log("\nDemonstrating the rendered resume output:");
  console.log("  bundle.target.name =", suspectLoad.bundle.target?.name);
  console.log("  bundle.entities   =", suspectLoad.bundle.entities);
  console.log("  bundle.freshness  =", JSON.stringify(suspectLoad.bundle.freshness));
  
  // Try a --diff path: name is re-resolved against backend
  try {
    const fresh = buildBundle({
      resolved: { id: "entity-1", name: "Widget", kind: "class", resolutionMode: "exact" },
      facts: makeFacts(),
      context: {
        claims: [], conflicts: [], decisions: [], intents: [],
        nodes: [], edges: [],
        metadata: { query: "Widget", seedEntities: ["entity-1"], hopsExpanded: 0, asOfRev: 1 },
      },
      provenance: {},
      budgets: { maxEntities: 50, maxRelationships: 100, maxEvidence: 25, maxChars: 12000 },
    });
    const diff = diffInvestigations(suspectLoad, fresh);
    console.log("  diff rejected? schema:", diff);
    console.log(`  diff isError-ish: schema=${diff.schema} (no schema-version mismatch)`);
  } catch (e: any) {
    console.log("  diff threw:", e.message);
  }
}

console.log("\n=== Cleanup ===");
rmSync(home, { recursive: true, force: true });
console.log("removed", home);
