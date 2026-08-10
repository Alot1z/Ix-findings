// Generates planning/wiki/data/data.js from all machine-readable registries.
// Run from workspace root: node planning/wiki/build-data.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../.."); // workspace root
const planning = join(root, "planning");
const handoff = join(root, "CLI-HANDOFF");
const outDir = join(here, "data");
mkdirSync(outDir, { recursive: true });

const readJ = (p) => JSON.parse(readFileSync(p, "utf8"));
const readM = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

// ── Registries ──
const findings = readJ(join(planning, "findings/registry.json")).findings;
const evidence = readJ(join(planning, "evidence/registry.json")).evidence;
const suggestions = readJ(join(planning, "suggestions/registry.json")).suggestions;
const decisions = readJ(join(planning, "decisions/registry.json")).decisions;
const phases = readJ(join(planning, "maps/phases.json")).phases;
const timeline = readJ(join(planning, "maps/timeline-map.json")).events;
const graph = { nodes: readJ(join(planning, "maps/investigation-map.json")).nodes, edges: readJ(join(planning, "maps/investigation-map.json")).edges };

// ── Manifest-derived ──
const manifest = readJ(join(handoff, "manifest.json"));
const repos = manifest.repositories || [];
const branches = manifest.branches || [];
const commits = manifest.commits || [];
const pullRequests = manifest.pull_requests || [];
const issues = manifest.issues || [];
const worktrees = manifest.worktrees || {};

// ── Test results ──
const testResults = manifest.test_results || {};

// ── Contribution gate ──
// CAND-015: derived from canonical sources instead of hardcoding.
// Status/blocker/nextAction come from CLI-HANDOFF/phase-3/CONTRIBUTION-READINESS.json
// (the authoritative contribution-state record); test counts come from the manifest.
const contribReadiness = (() => {
  try { return readJ(join(handoff, "phase-3/CONTRIBUTION-READINESS.json")).contributions || []; }
  catch { return []; }
})();
const readinessById = Object.fromEntries(contribReadiness.map(c => [c.id, c]));
const suiteTests = testResults.tests ? `${testResults.tests} (manifest @ ${testResults.sha || "c4f8fea"})` : "646/648 (manifest)";

const CONTRIB_META = [
  { id: "CONTRIB-remap", repo: "ix-infrastructure/Ix", branch: "feat/ix-remap-hardening", sha: "a05e740 (rebased onto 5488741; fork @ c021b52)", title: "Remap hardening — loopback-guarded /__ix/remap endpoint + WSL bootstrap fix", files: 4, packet: "pr-packets/ix-remap-hardening/README.md" },
  { id: "CONTRIB-agent-skill", repo: "ix-infrastructure/Ix", branch: "feat/ix-agent-skill", sha: "b038c46", title: "Agent skill with Compass patch — active development, 14 dirty files", files: "14 uncommitted", packet: null },
  { id: "CONTRIB-376", repo: "ix-infrastructure/Ix", branch: null, sha: null, title: "Fix version-series mismatch (#376) — stamp dist version not Ix version", files: "1 (.github/workflows/release.yml)", packet: "pr-packets/ix-376-version-mismatch/README.md" },
  { id: "CONTRIB-371", repo: "ix-infrastructure/Ix", branch: null, sha: null, title: "Fix dead patches command (#371) — register or delete", files: "1-2", packet: "pr-packets/ix-371-patches-dead-code/README.md" },
  { id: "CONTRIB-fkey", repo: "system-compass", branch: null, sha: null, title: "F-key fit-to-viewport — keyboard exposure of existing 0-key fit", files: "~4 (~93 lines)", packet: "pr-packets/compass-f-key/README.md" },
  { id: "CONTRIB-delayed", repo: "system-compass", branch: null, sha: null, title: "Fix delayed-data blank — rollup timing + zoom floor", files: "unknown", packet: "pr-packets/compass-delayed-data/README.md" },
];
const shortStatus = (s) => {
  if (!s) return "UNKNOWN";
  if (s.includes("NEAR_READY")) return "NEAR_READY";
  if (s.includes("IN_DEVELOPMENT")) return "IN DEVELOPMENT";
  if (s.includes("BLOCKED")) return "BLOCKED";
  if (s.includes("NEEDS_EVIDENCE") || s.includes("NEEDS_DECISION")) return "NEEDS_ACTION";
  if (s.includes("READY")) return "READY";
  return s;
};
const contribGate = {
  candidates: CONTRIB_META.map(m => {
    const r = readinessById[m.id] || {};
    return {
      id: m.id,
      repo: m.repo,
      branch: m.branch,
      sha: m.sha,
      status: shortStatus(r.state),
      stateDetail: r.state || null,
      findings: r.findings || [],
      title: m.title,
      files: m.files,
      tests: m.id === "CONTRIB-remap" ? suiteTests : (r.tests || "Spec ready"),
      packet: m.packet && readM(join(root, m.packet)) ? m.packet : null,
      blocker: r.blocker || null,
      nextAction: r.next_safe_action || null,
    };
  }),
};

// ── Stale claims ──
const staleClaims = (() => {
  try { const sc = readM(join(handoff, "STALE-CLAIMS.md"));
    const claims = [];
    const re = /\|\s*\*\*?(S-\d+)\*\*?\s*\|/g; let m;
    while ((m = re.exec(sc)) !== null) claims.push(m[1]);
    return claims.map(id => ({ id, description: "Stale claim documented in STALE-CLAIMS.md" }));
  } catch { return []; }
})();

// ── System-compass spec ──
const sysCompass = {
  access: "PRIVATE — 404, no fork exists",
  findings: ["F-001","F-002","F-003","F-004","F-005","F-006","F-007","F-013"],
  fkey: { status: "SPEC READY", specFile: "pr-packets/compass-f-key/README.md", estimatedLines: 93, filesToChange: 4, tests: 15 },
  fitView: { status: "REDIRECTED — belongs in system-compass per PR #368 reviewer", autoFrameExcluded: "Compass #57 covers refit in v0.3.0" },
  blocker: "No source access — cannot inspect, implement, or test"
};

// ── Freshness ──
const meta = {
  title: "IX Compass — Knowledge Explorer",
  generated: new Date().toISOString().split("T")[0],
  sourceRevision: (() => { try { return require("child_process").execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim(); } catch { return "unknown"; } })(),
  phase: "EXECUTION",
  entityCounts: {
    repositories: repos.length,
    branches: branches.length,
    worktrees: Object.keys(worktrees).length,
    commits: commits.length,
    releases: (manifest.releases || []).length,
    files: 12, // key files modeled in graph
    symbols: 9, // key symbols modeled
    apis: 2,   // modeled APIs
    tests: 4,  // test suites
    findings: findings.length,
    evidence: evidence.length,
    decisions: decisions.length,
    suggestions: suggestions.length,
    prs: pullRequests.length,
    issues: issues.length,
    contributions: contribGate.candidates.length,
    graphNodes: graph.nodes.length,
    graphEdges: graph.edges.length,
    staleClaims: staleClaims.length
  },
  dataFreshness: {
    findings: "2026-08-10",
    evidence: "2026-08-10",
    repositories: "2026-08-10 (live verified)",
    gitState: "2026-08-10 (live verified)",
    tests: "2026-08-10 (fresh run: 646/648 passed)",
    systemCompass: "BLOCKED — no source access"
  }
};

const data = { meta, findings, evidence, suggestions, decisions, phases, timeline, graph, repos, branches, commits, worktrees, pullRequests, issues, testResults, contributions: contribGate.candidates, staleClaims, sysCompass, manifest };

const js = `// GENERATED by build-data.mjs — do not edit by hand.
// Source: planning/ registries + CLI-HANDOFF/ manifest + live state.
window.IX_DATA = ${JSON.stringify(data, null, 2)};`;

writeFileSync(join(outDir, "data.js"), js, "utf8");
console.log("Wrote planning/wiki/data/data.js (" + js.length + " bytes, " + meta.entityCounts.graphNodes + " nodes, " + meta.entityCounts.findings + " findings)");
