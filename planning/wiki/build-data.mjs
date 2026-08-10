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
const contribGate = {
  candidates: [
    { id: "CONTRIB-remap", repo: "ix-infrastructure/Ix", branch: "feat/ix-remap-hardening", sha: "c021b52", status: "READY", title: "Remap hardening — loopback-guarded /__ix/remap endpoint + WSL bootstrap fix", files: 4, tests: "656/2 + 10 guard tests", packet: "pr-packets/ix-remap-hardening/README.md", blocker: null, nextAction: "Open PR against ix-infrastructure/Ix:main (requires authorization)" },
    { id: "CONTRIB-agent", repo: "ix-infrastructure/Ix", branch: "feat/ix-agent-skill", sha: "b038c46", status: "IN DEVELOPMENT", title: "Agent skill with Compass patch — active development, 14 dirty files", files: "14 uncommitted", tests: null, packet: null, blocker: "Active development — PR #368 already merged (patched version stripped per reviewer)", nextAction: "Complete overhaul, then separate PR if warranted" },
    { id: "CONTRIB-376", repo: "ix-infrastructure/Ix", branch: null, sha: null, status: "BLOCKED", title: "Fix version-series mismatch (#376) — stamp dist version not Ix version", files: "1 (.github/workflows/release.yml)", tests: "Spec ready", packet: "pr-packets/ix-376-version-mismatch/README.md", blocker: "Needs maintainer direction on approach (Option A vs B)", nextAction: "Discuss with KageBinary after remap PR establishes credibility" },
    { id: "CONTRIB-371", repo: "ix-infrastructure/Ix", branch: null, sha: null, status: "BLOCKED", title: "Fix dead patches command (#371) — register or delete", files: "1-2", tests: "Spec ready", packet: null, blocker: "Needs OSS vs Pro decision from maintainer", nextAction: "Ask maintainer in context of remap PR" },
    { id: "CONTRIB-fkey", repo: "system-compass", branch: null, sha: null, status: "BLOCKED", title: "F-key fit-to-viewport — keyboard exposure of existing 0-key fit", files: "~4 (~93 lines)", tests: "15 test spec ready", packet: "pr-packets/compass-f-key/README.md", blocker: "system-compass source access (D-014)", nextAction: "Request access from KageBinary" },
    { id: "CONTRIB-delayed", repo: "system-compass", branch: null, sha: null, status: "BLOCKED", title: "Fix delayed-data blank — rollup timing + zoom floor", files: "unknown", tests: "Reproduction confirmed", packet: "pr-packets/compass-delayed-data/README.md", blocker: "system-compass source access", nextAction: "Investigate source when access granted" },
  ]
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
