// Repeatable, read-only freshness gate for the canonical graph and derived snapshots.
// Default mode uses the GitHub CLI for public API reads. --fixture supports deterministic tests.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_REPO = "ix-infrastructure/Ix";
const DEFAULT_SNAPSHOT_FILES = [
  "planning/wiki/data/data.js",
  "planning/pages/public/data/data.js",
];

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const setOf = values => new Set((values || []).map(value => Number(value)));
const sorted = values => [...values].sort((a, b) => a - b);
const sameSet = (a, b) => a.size === b.size && [...a].every(value => b.has(value));
const short = value => String(value || "").slice(0, 12).toLowerCase();
const shaMatches = (expected, actual) => Boolean(expected && actual && (short(expected) === short(actual) || short(expected).startsWith(short(actual)) || short(actual).startsWith(short(expected))));
const parseRepo = url => String(url || "").match(/github\.com\/([^/]+\/[^/]+)/)?.[1] || DEFAULT_REPO;

function canonicalState(root = ROOT) {
  const knowledge = join(root, "knowledge");
  const manifest = readJson(join(knowledge, "manifest.json"));
  const phaseManifest = readJson(join(root, "CLI-HANDOFF/manifest.json")) || {};
  const liveCapture = readJson(join(root, "knowledge/live-github-state.json")) || {};
  const entities = readJson(join(knowledge, "entities.json"));
  const snapshots = readJson(join(knowledge, "snapshots.json"));
  const branches = entities.filter(entity => entity.entity_type === "BRANCH");
  const prs = entities.filter(entity => entity.entity_type === "PULL_REQUEST");
  const issues = entities.filter(entity => entity.entity_type === "ISSUE");
  const main = branches.find(entity => entity.metadata?.repo === DEFAULT_REPO && entity.metadata?.branch === "main");
  const ixPrs = prs.filter(entity => parseRepo(entity.metadata?.url) === DEFAULT_REPO);
  const ixIssues = issues.filter(entity => parseRepo(entity.metadata?.url) === DEFAULT_REPO);
  return {
    manifest,
    entities,
    snapshots,
    repository: DEFAULT_REPO,
    defaultBranch: "main",
    canonicalHead: main?.metadata?.sha || manifest.live_baseline?.upstream_head,
    canonicalOpenPRs: setOf(ixPrs.filter(entity => entity.status === "OPEN").map(entity => entity.metadata?.number)),
    canonicalOpenIssues: setOf(ixIssues.filter(entity => entity.status === "OPEN").map(entity => entity.metadata?.number)),
    knownPRs: new Map(ixPrs.map(entity => [Number(entity.metadata?.number), entity])),
    knownIssues: new Map(ixIssues.map(entity => [Number(entity.metadata?.number), entity])),
    baselineHead: manifest.live_baseline?.upstream_head,
    baselineOpenPRs: setOf(manifest.live_baseline?.open_prs),
    baselineOpenIssues: setOf(manifest.live_baseline?.open_issues),
    // Manifest-era commit records (phase snapshot) and the live capture's PR
    // heads, used by the superseded-commit check below.
    phaseManifestCommits: phaseManifest.commits || [],
    liveCapturePRs: liveCapture.open_pull_requests || [],
    commitEntityStatus: new Map(entities.filter(entity => entity.entity_type === "COMMIT").map(entity => [entity.canonical_id, entity.status])),
  };
}

function readSnapshotMeta(root, paths = DEFAULT_SNAPSHOT_FILES) {
  return paths.filter(path => existsSync(join(root, path))).map(path => {
    const text = readFileSync(join(root, path), "utf8");
    try {
      const match = text.match(/window\.IX_DATA = ([\s\S]*);\s*$/);
      const data = JSON.parse(match?.[1] || "null");
      return { dataset: path, generated_at: data?.meta?.generated, source_revision: data?.meta?.sourceRevision, parse_error: null };
    } catch (error) {
      return { dataset: path, generated_at: null, source_revision: null, parse_error: error.message };
    }
  });
}

function ghJson(endpoint, paginate = false) {
  const args = ["api", endpoint, "--header", "Accept: application/vnd.github+json"];
  if (paginate) args.push("--paginate", "--slurp");
  const output = execFileSync("gh", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const parsed = JSON.parse(output);
  return paginate ? parsed.flat() : parsed;
}

export function fetchLiveState() {
  const repo = ghJson(`repos/${DEFAULT_REPO}`);
  const commit = ghJson(`repos/${DEFAULT_REPO}/commits/${repo.default_branch}`);
  const pullRequests = ghJson(`repos/${DEFAULT_REPO}/pulls?state=open&per_page=100`, true);
  const issues = ghJson(`repos/${DEFAULT_REPO}/issues?state=open&per_page=100`, true);
  return {
    repository: DEFAULT_REPO,
    defaultBranch: repo.default_branch,
    head: commit.sha,
    openPRs: setOf(pullRequests.map(pr => pr.number)),
    openIssues: setOf(issues.filter(issue => !issue.pull_request).map(issue => issue.number)),
    fetchedAt: new Date().toISOString(),
    source: "GitHub API via gh api (read-only)",
  };
}

// Hermetic CI fallback: when the GitHub API is unreachable (e.g. GitHub Actions
// runner without a usable token), compare the canonical graph against the last
// live-verified capture committed as knowledge/live-github-state.json instead of
// failing the build. The authoritative live check still runs whenever gh is
// authenticated (local runs, maintainer pre-publish gate).
const BASELINE_FILE = "knowledge/live-github-state.json";

export function baselineLiveState(root = ROOT) {
  const path = join(root, BASELINE_FILE);
  if (!existsSync(path)) return null;
  const baseline = readJson(path);
  const upstream = baseline.upstream || {};
  return {
    repository: upstream.repository || DEFAULT_REPO,
    defaultBranch: upstream.default_branch || "main",
    head: upstream.head_sha,
    openPRs: setOf((baseline.open_pull_requests || []).map(pr => pr.number)),
    openIssues: setOf((baseline.open_issues || []).map(issue => issue.number)),
    fetchedAt: baseline.captured_at || new Date().toISOString(),
    source: "captured baseline knowledge/live-github-state.json (live API unavailable)",
  };
}

function diffSet(expected, actual) {
  return {
    missing: sorted([...expected].filter(value => !actual.has(value))),
    unexpected: sorted([...actual].filter(value => !expected.has(value))),
  };
}

function check(checks, id, ok, details, severity = "STALE") {
  checks.push({ id, ok, severity: ok ? "INFO" : severity, details });
}

export function compareFreshness(canonical, live, snapshotMeta = [], options = {}) {
  const checks = [];
  const baselinePrs = diffSet(canonical.baselineOpenPRs, live.openPRs);
  const baselineIssues = diffSet(canonical.baselineOpenIssues, live.openIssues);
  const graphPrs = diffSet(canonical.canonicalOpenPRs, live.openPRs);
  const graphIssues = diffSet(canonical.canonicalOpenIssues, live.openIssues);
  const knownPrsMissing = sorted([...live.openPRs].filter(number => !canonical.knownPRs.has(number)));
  const knownIssuesMissing = sorted([...live.openIssues].filter(number => !canonical.knownIssues.has(number)));

  check(checks, "repository", live.repository === canonical.repository, `expected ${canonical.repository}, observed ${live.repository}`);
  check(checks, "default-branch", live.defaultBranch === canonical.defaultBranch, `expected ${canonical.defaultBranch}, observed ${live.defaultBranch}`);
  check(checks, "canonical-head", shaMatches(canonical.canonicalHead, live.head), `canonical ${canonical.canonicalHead || "UNKNOWN"}, live ${live.head || "UNKNOWN"}`);
  check(checks, "manifest-head", shaMatches(canonical.baselineHead, live.head), `manifest ${canonical.baselineHead || "UNKNOWN"}, live ${live.head || "UNKNOWN"}`);
  check(checks, "manifest-open-prs", baselinePrs.missing.length === 0 && baselinePrs.unexpected.length === 0, `missing ${baselinePrs.missing.join(",") || "none"}; unexpected ${baselinePrs.unexpected.join(",") || "none"}`);
  check(checks, "manifest-open-issues", baselineIssues.missing.length === 0 && baselineIssues.unexpected.length === 0, `missing ${baselineIssues.missing.join(",") || "none"}; unexpected ${baselineIssues.unexpected.join(",") || "none"}`);
  check(checks, "graph-open-prs", graphPrs.missing.length === 0 && graphPrs.unexpected.length === 0, `missing ${graphPrs.missing.join(",") || "none"}; unexpected ${graphPrs.unexpected.join(",") || "none"}`);
  check(checks, "graph-open-issues", graphIssues.missing.length === 0 && graphIssues.unexpected.length === 0, `missing ${graphIssues.missing.join(",") || "none"}; unexpected ${graphIssues.unexpected.join(",") || "none"}`);
  check(checks, "graph-pr-coverage", knownPrsMissing.length === 0, `live open PRs absent from canonical graph: ${knownPrsMissing.join(",") || "none"}`);
  check(checks, "graph-issue-coverage", knownIssuesMissing.length === 0, `live open issues absent from canonical graph: ${knownIssuesMissing.join(",") || "none"}`);

  // Manifest-era commits must not be presented as CURRENT when the live
  // capture records a newer head for the same branch. The canonical builder
  // reconciles these to HISTORICAL; if any remain CURRENT, the graph is
  // presenting a superseded commit as the live state.
  for (const c of canonical.phaseManifestCommits || []) {
    const branch = c.branch || "";
    if (!branch) continue;
    const livePR = (canonical.liveCapturePRs || []).find(p => p.head_ref && (branch.includes(p.head_ref) || p.head_ref.includes(branch)));
    const currentHead = livePR?.head_sha;
    if (!currentHead || c.sha === currentHead) continue;
    const entityStatus = canonical.commitEntityStatus.get(`COMMIT-${c.sha}`);
    if (!entityStatus) continue;
    check(checks, `superseded-commit:${c.sha}`, entityStatus !== "CURRENT", `commit ${c.sha} entity status is ${entityStatus}; live capture records ${currentHead.slice(0, 8)} as head of ${branch} — superseded manifest-era commits must be HISTORICAL, not CURRENT`);
  }

  for (const snapshot of snapshotMeta) {
    check(checks, `snapshot-parse:${snapshot.dataset}`, !snapshot.parse_error, snapshot.parse_error || "parsed");
    check(checks, `snapshot-head:${snapshot.dataset}`, shaMatches(live.head, snapshot.source_revision), `snapshot ${snapshot.source_revision || "UNKNOWN"}, live ${live.head || "UNKNOWN"}`);
    if (options.maxAgeHours != null && snapshot.generated_at) {
      const ageHours = (Date.now() - Date.parse(`${snapshot.generated_at}T00:00:00Z`)) / 3_600_000;
      check(checks, `snapshot-age:${snapshot.dataset}`, Number.isFinite(ageHours) && ageHours <= options.maxAgeHours, `age ${Math.round(ageHours * 10) / 10}h, limit ${options.maxAgeHours}h`);
    }
  }
  for (const snapshot of canonical.snapshots || []) {
    check(checks, `snapshot-record:${snapshot.dataset}`, shaMatches(live.head, snapshot.source_revision), `record ${snapshot.source_revision || "UNKNOWN"}, live ${live.head || "UNKNOWN"}`);
  }

  const stale = checks.filter(result => !result.ok);
  const liveOutput = { ...live, openPRs: sorted(live.openPRs), openIssues: sorted(live.openIssues) };
  return {
    gate: stale.length === 0 ? "PASS" : "STALE",
    checked_at: live.fetchedAt || new Date().toISOString(),
    repository: canonical.repository,
    live: liveOutput,
    canonical: {
      head: canonical.canonicalHead,
      baseline_head: canonical.baselineHead,
      open_prs: sorted(canonical.canonicalOpenPRs),
      open_issues: sorted(canonical.canonicalOpenIssues),
    },
    snapshots: snapshotMeta,
    checks,
    stale_count: stale.length,
    policy: {
      publication_must_stop_on_stale: true,
      network: "read-only GitHub API lookup",
      external_mutations: 0,
    },
  };
}

export function runGate({ root = ROOT, fixture, snapshotPaths = DEFAULT_SNAPSHOT_FILES, maxAgeHours } = {}) {
  const canonical = canonicalState(root);
  const fixtureState = fixture ? readJson(resolve(root, fixture)) : null;
  const degraded = { mode: "live", live_check_error: null };
  let live;
  if (fixtureState) {
    live = { ...fixtureState, openPRs: setOf(fixtureState.openPRs), openIssues: setOf(fixtureState.openIssues) };
  } else {
    try {
      live = fetchLiveState();
    } catch (error) {
      const baseline = baselineLiveState(root);
      if (!baseline) throw error;
      live = baseline;
      degraded.mode = "degraded-baseline";
      degraded.live_check_error = error.message;
    }
  }
  const snapshots = readSnapshotMeta(root, snapshotPaths);
  const report = compareFreshness(canonical, live, snapshots, { maxAgeHours });
  report.mode = degraded.mode;
  report.live_check_error = degraded.live_check_error;
  return report;
}

function printHuman(report) {
  console.log(`Freshness gate: ${report.gate}`);
  console.log(`Mode: ${report.mode}`);
  if (report.live_check_error) console.log(`Live API unavailable (${report.live_check_error}); checked against captured baseline.`);
  console.log(`Repository: ${report.repository}`);
  console.log(`Live head: ${report.live.head || "UNKNOWN"}`);
  console.log(`Open PRs: ${sorted(report.live.openPRs).join(", ") || "none"}`);
  console.log(`Open issues: ${sorted(report.live.openIssues).join(", ") || "none"}`);
  for (const result of report.checks) console.log(`${result.ok ? "ok" : "STALE"} ${result.id}: ${result.details}`);
  if (report.gate !== "PASS") console.log("Publication must stop until canonical data and derived snapshots are regenerated or reconciled.");
}

function args(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--json") result.json = true;
    else if (arg === "--fixture") result.fixture = argv[++index];
    else if (arg === "--max-age-hours") result.maxAgeHours = Number(argv[++index]);
    else if (arg === "--snapshot") (result.snapshotPaths ||= []).push(argv[++index]);
    else if (arg === "--help" || arg === "-h") result.help = true;
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = args(process.argv.slice(2));
  if (options.help) {
    console.log("Usage: node knowledge/freshness-gate.mjs [--json] [--fixture FILE] [--snapshot FILE] [--max-age-hours N]");
    process.exit(0);
  }
  try {
    const report = runGate(options);
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else printHuman(report);
    process.exit(report.gate === "PASS" ? 0 : 2);
  } catch (error) {
    const report = { gate: "UNAVAILABLE", error: error.message, policy: { publication_must_stop_on_unavailable: true, external_mutations: 0 } };
    if (options.json) console.log(JSON.stringify(report, null, 2));
    else console.error(`Freshness gate unavailable: ${error.message}`);
    process.exit(3);
  }
}
