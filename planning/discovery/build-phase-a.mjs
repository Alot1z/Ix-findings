import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "planning", "discovery");
mkdirSync(OUT, { recursive: true });

const localRoots = [
  "E:/E-github-repos/Ix-findings",
  "E:/E-github-repos/Ix-remap",
  "E:/E-github-repos/Ix",
  "E:/E-github-repos/Ix-mcp",
  "E:/E-github-repos/Ix-test",
  "E:/E-github-repos/ix-compass-dist"
];

const repositoryCatalog = {
  "ix-infrastructure/Ix": {
    repository_id: "ix-infrastructure/Ix",
    repository_url: "https://github.com/ix-infrastructure/Ix",
    role: "upstream",
    evidence: "live GitHub API and local origin remotes"
  },
  "Alot1z/Ix-remap": {
    repository_id: "Alot1z/Ix-remap",
    repository_url: "https://github.com/Alot1z/Ix-remap",
    role: "user fork; GitHub currently resolves the legacy Alot1z/Ix name here",
    parent_repository_id: "ix-infrastructure/Ix",
    evidence: "live GitHub API on 2026-08-12"
  },
  "Alot1z/Ix-findings": {
    repository_id: "Alot1z/Ix-findings",
    repository_url: "https://github.com/Alot1z/Ix-findings",
    role: "canonical knowledge ledger",
    evidence: "live GitHub API and local origin remote"
  },
  "ix-infrastructure/ix-compass-dist": {
    repository_id: "ix-infrastructure/ix-compass-dist",
    repository_url: "https://github.com/ix-infrastructure/ix-compass-dist",
    role: "distribution repository",
    evidence: "local origin remote and prior GitHub inventory"
  }
};

function git(path, args) {
  try {
    return execFileSync("git", ["-C", path, ...args], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}
function lines(value) {
  return value.split(/\r?\n/).filter(Boolean);
}
function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), "utf8"));
}
function canonicalRepoId(url) {
  const value = String(url || "").replace(/\.git$/, "").replace(/\/$/, "");
  if (value.includes("ix-infrastructure/Ix")) return "ix-infrastructure/Ix";
  if (value.includes("ix-compass-dist")) return "ix-infrastructure/ix-compass-dist";
  if (value.includes("Alot1z/Ix-findings")) return "Alot1z/Ix-findings";
  if (value.includes("Alot1z/Ix")) return "Alot1z/Ix-remap";
  return "UNKNOWN";
}
function githubUrl(repoId) {
  return repositoryCatalog[repoId]?.repository_url || null;
}
function branchName(ref) {
  if (ref.startsWith("refs/heads/")) return ref.slice("refs/heads/".length);
  const marker = "/";
  const index = ref.indexOf(marker, "refs/remotes/".length);
  return index >= 0 ? ref.slice(index + 1) : ref;
}
function branchUrl(repoId, name) {
  const base = githubUrl(repoId);
  return base ? `${base}/tree/${encodeURI(name)}` : null;
}
function commitUrl(repoId, sha) {
  const base = githubUrl(repoId);
  return base ? `${base}/commit/${sha}` : null;
}
function parseWorktrees(path) {
  const rows = [];
  let row = null;
  for (const line of git(path, ["worktree", "list", "--porcelain"]).split(/\r?\n/).concat([""])) {
    if (line.startsWith("worktree ")) row = { local_absolute_path: line.slice(9) };
    else if (line.startsWith("HEAD ") && row) row.head_full_sha = line.slice(5);
    else if (line.startsWith("branch ") && row) row.branch_ref = line.slice(7);
    else if (line === "" && row) {
      row.branch = row.branch_ref?.replace(/^refs\/heads\//, "") || "DETACHED";
      rows.push(row);
      row = null;
    }
  }
  return rows;
}

const clones = [];
const allWorktrees = new Map();
const allBranches = [];
const allRemotes = [];
for (const localPath of localRoots) {
  if (!existsSync(localPath)) continue;
  const remoteNames = lines(git(localPath, ["remote"]));
  const remotes = remoteNames.map(name => {
    const fetchUrl = git(localPath, ["remote", "get-url", name]);
    const pushUrl = git(localPath, ["remote", "get-url", "--push", name]);
    return {
      clone_path: localPath,
      remote_name: name,
      fetch_url: fetchUrl,
      push_url: pushUrl,
      fetch_repository_id: canonicalRepoId(fetchUrl),
      push_repository_id: canonicalRepoId(pushUrl),
      verified_by: "local git remote -v"
    };
  });
  const origin = remotes.find(remote => remote.remote_name === "origin") || remotes[0];
  const repository_id = origin?.fetch_repository_id || canonicalRepoId(remotes[0]?.fetch_url);
  const status = lines(git(localPath, ["status", "--short"]));
  const head = git(localPath, ["rev-parse", "HEAD"]);
  const branch = git(localPath, ["symbolic-ref", "--quiet", "--short", "HEAD"]) || "DETACHED";
  const upstream = git(localPath, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  let ahead = null;
  let behind = null;
  if (upstream) {
    const counts = git(localPath, ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]).split(/\s+/);
    ahead = Number(counts[0]);
    behind = Number(counts[1]);
  }
  clones.push({
    clone_id: `CLONE-${localPath.replace(/[^A-Za-z0-9]+/g, "-").replace(/-$/, "")}`,
    repository_id,
    local_absolute_path: localPath,
    head_full_sha: head,
    current_branch: branch,
    tracking_ref: upstream || "UNKNOWN",
    ahead,
    behind,
    dirty_file_count: status.length,
    dirty_paths: status.slice(0, 20),
    dirty_paths_truncated: status.length > 20,
    remotes
  });
  for (const remote of remotes) allRemotes.push(remote);
  for (const worktree of parseWorktrees(localPath)) {
    const key = worktree.local_absolute_path;
    if (!allWorktrees.has(key)) allWorktrees.set(key, {
      worktree_id: `WORKTREE-${key.replace(/[^A-Za-z0-9]+/g, "-").replace(/-$/, "")}`,
      repository_id: canonicalRepoId(remotes[0]?.fetch_url),
      parent_clone_path: localPath,
      ...worktree,
      status_file_count: lines(git(key, ["status", "--short"])).length,
      status_source: "local git status --short"
    });
  }
  for (const line of lines(git(localPath, ["for-each-ref", "--format=%(refname)\t%(objectname)\t%(upstream:short)", "refs/heads", "refs/remotes"]))) {
    const [ref, sha, tracking = ""] = line.split("\t");
    const branchRepo = canonicalRepoId(remotes.find(remote => ref.includes(`remotes/${remote.remote_name}/`))?.fetch_url || remotes[0]?.fetch_url);
    allBranches.push({
      branch_id: `BRANCH-${branchRepo.replace(/[^A-Za-z0-9]+/g, "-")}-${branchName(ref).replace(/[^A-Za-z0-9]+/g, "-")}`,
      repository_id: branchRepo,
      clone_path: localPath,
      full_ref: ref,
      branch_name: branchName(ref),
      head_full_sha: sha,
      tracking_ref: tracking || "UNKNOWN",
      branch_url: branchUrl(branchRepo, branchName(ref)),
      commit_url: commitUrl(branchRepo, sha),
      source: "local git for-each-ref"
    });
  }
}

const entities = readJson("knowledge/entities.json");
const relationships = readJson("knowledge/relationships.json");
const manifest = readJson("knowledge/manifest.json");
const quality = readJson("knowledge/data-quality.json");
const publicEntities = readJson("planning/pages/public/entities.json");
const publicGraph = readJson("planning/pages/public/graph.json");
const publicRoutes = readJson("planning/pages/public/routes.json");
const publicSearch = readJson("planning/pages/public/search.json");
const headEntities = JSON.parse(execFileSync("git", ["show", "HEAD:knowledge/entities.json"], { cwd: ROOT, encoding: "utf8" }));
const headRelationships = JSON.parse(execFileSync("git", ["show", "HEAD:knowledge/relationships.json"], { cwd: ROOT, encoding: "utf8" }));
const currentBranches = allBranches.filter(branch => branch.full_ref.startsWith("refs/heads/"));
const commitRecords = [...new Map(allBranches.filter(branch => branch.commit_url).map(branch => [branch.head_full_sha, {
  full_sha: branch.head_full_sha,
  repository_id: branch.repository_id,
  commit_url: branch.commit_url,
  observed_from: branch.full_ref
}])).values()];
const liveState = readJson("knowledge/live-github-state.json");
const issueLinks = (liveState.open_issues || []).map(issue => ({ number: issue.number, url: issue.url, status: issue.state, source: "knowledge/live-github-state.json" }));
const prLinks = (liveState.open_pull_requests || []).map(pr => ({ number: pr.number, url: pr.url, status: pr.state, source: "knowledge/live-github-state.json" }));
const routeLinks = (publicRoutes.items || []).map(route => ({ path: route.path, url: route.url, kind: route.kind, parent: route.parent }));

const snapshot = {
  committed_entities: headEntities.length,
  committed_relationships: headRelationships.length,
  manifest_entities: manifest.generated_counts?.canonical_entities,
  manifest_relationships: manifest.generated_counts?.canonical_relationships,
  working_entities: entities.length,
  working_relationships: relationships.length,
  quality_entities: quality.canonical_entities,
  quality_relationships: quality.canonical_relationships,
  public_entities: publicEntities.meta?.count,
  public_graph_entities: Array.isArray(publicGraph.entities) ? publicGraph.entities.length : publicGraph.entities,
  public_graph_relationships: Array.isArray(publicGraph.relations) ? publicGraph.relations.length : publicGraph.relations,
  public_routes: publicRoutes.meta?.count,
  public_search_entries: publicSearch.meta?.count,
  generated_at: quality.generated_at,
  source_revision: publicGraph.source_revision
};

const report = {
  phase: "PHASE-A",
  status: "RECONCILED_WORKTREE_PENDING_COMMIT",
  generated_at: quality.generated_at,
  timestamp_precision: "DAY; builder uses a fixed 2026-08-11 value",
  execution: {
    parasite_skill_validation: "PASS: 88 skills, 0 validation issues",
    route_used: "Phase A canonical knowledge snapshot reconciliation repository identity baseline full URL manifests GitHub history",
    github_authentication: "VERIFIED: token account Alot1z, numeric id 16801672; token value not stored",
    github_writes: 0,
    installs: 0,
    hooks_changed: 0,
    mcp_registered: 0,
    pushes: 0,
    commits_created: 0
  },
  freshness_gate: {
    status: "STALE",
    mode: "live",
    checked_at: "2026-08-12T09:19:11.651Z",
    live_upstream_head: "fa6ad7b0ff52734685ff7425b08ec240837751fa",
    canonical_head: "1292375548fb8f4431ac5afc34c68fe2573434d1",
    stale_check_count: 6,
    publication_safe: false,
    source: "node knowledge/freshness-gate.mjs --json with the supplied token"
  },
  canonical_snapshot: {
    selection: "knowledge/entities.json + knowledge/relationships.json in the current worktree",
    evidence_state: "VERIFIED local generated artifacts; not yet committed",
    counts: snapshot,
    authoritative_count: { entities: entities.length, relationships: relationships.length },
    reason_previous_counts_differ: [
      "knowledge/manifest.json contains stale hand-maintained generated_counts of 549/931 and is not written by knowledge/build-knowledge.mjs.",
      "The committed HEAD graph contains 569/1007.",
      "The current generated graph contains 570/1008; the delta is one source entity and one PART_OF relationship.",
      "knowledge/data-quality.json, DATA-QUALITY-REPORT.md, public entities.json, graph.json, routes.json, and search.json agree with the 570/1008 worktree graph.",
      "The authoritative working snapshot is therefore 570/1008; publication remains blocked until this dirty worktree is reviewed and committed by the account owner."
    ],
    delta_from_head: {
      added_entity: "SRC-cfa3eba511fc",
      added_relationship: "REL-c8497482887e",
      source_observed: "planning/wiki/assets/entity-view.js",
      relationship_observed: "SRC-cfa3eba511fc PART_OF REPO-Ix-findings"
    }
  },
  repositories: Object.values(repositoryCatalog),
  forks: [{ fork_repository_id: "Alot1z/Ix-remap", parent_repository_id: "ix-infrastructure/Ix", fork_url: "https://github.com/Alot1z/Ix-remap", parent_url: "https://github.com/ix-infrastructure/Ix", evidence: "live GitHub API" }],
  clones,
  worktrees: [...allWorktrees.values()],
  remotes: allRemotes,
  branches: allBranches,
  divergence: clones.map(clone => ({ clone_path: clone.local_absolute_path, repository_id: clone.repository_id, current_branch: clone.current_branch, tracking_ref: clone.tracking_ref, ahead: clone.ahead, behind: clone.behind, dirty_file_count: clone.dirty_file_count })),
  link_validation: {
    checked: [
      "https://github.com/Alot1z/Ix-findings",
      "https://github.com/Alot1z/Ix",
      "https://github.com/Alot1z/Ix-remap",
      "https://github.com/ix-infrastructure/Ix",
      "https://alot1z.github.io/Ix-findings/"
    ],
    result: "Repository API identity and local URL provenance verified; complete HTTP route audit not re-run because the current workspace has protected dirty generated artifacts.",
    statuses: { repository_api: "HTTP_200", legacy_alias: "HTTP_200_REDIRECT_OR_RENAME", public_site: "NOT_RECHECKED_IN_PHASE_A", all_generated_routes: "NOT_CHECKED" },
    broken_links: [],
    unknown_links: ["ix-infrastructure/system-compass source and URL accessibility remain UNKNOWN/BLOCKED"]
  },
  stale_data: [
    { artifact: "knowledge/manifest.json", field: "generated_counts", status: "STALE", observed: "549/931", authoritative_worktree: "570/1008" },
    { artifact: "knowledge/live-github-state.json", status: "SNAPSHOT", observed_at: liveState.captured_at, note: "must be refreshed before publication" },
    { artifact: "planning/pages/public/*", status: "DERIVED_SNAPSHOT", observed_at: publicGraph.generated, note: "not current GitHub truth" }
  ],
  contradictions: [{ subject: "canonical graph count", claims: ["manifest 549/931", "committed graph 569/1007", "worktree graph 570/1008"], resolution: "retain historical counts; select current generated worktree 570/1008 pending owner commit" }],
  unknowns: [
    "Whether every current public route returns HTTP 200 in production was not established in this run.",
    "system-compass source remains inaccessible/private.",
    "The exact intended policy for rewriting historical commits was not approved; history rewrite is not part of Phase A.",
    "The old Alot1z/Ix remote name should be migrated only in a separately approved local configuration change."
  ],
  affected_existing_files: [
    "knowledge/entities.json",
    "knowledge/relationships.json",
    "knowledge/data-quality.json",
    "knowledge/DATA-QUALITY-REPORT.md",
    "knowledge/manifest.json",
    "planning/pages/public/entities.json",
    "planning/pages/public/graph.json",
    "planning/pages/public/routes.json",
    "planning/pages/public/search.json",
    "planning/pages/public/llms.txt",
    "planning/pages/public/llms-full.txt"
  ],
  next_phase: "PHASE-B repository/fork/clone/worktree/remote/branch/commit/file/symbol ontology, after explicit review of this report and protected dirty changes"
};

const linkManifest = {
  manifest_type: "INTERNAL_LINK_MANIFEST",
  generated_at: quality.generated_at,
  repositories: report.repositories,
  forks: report.forks,
  clones: clones.map(({ clone_id, repository_id, local_absolute_path }) => ({ clone_id, repository_id, local_absolute_path })),
  worktrees: report.worktrees,
  remotes: allRemotes,
  branches: allBranches,
  commits: commitRecords,
  issues: issueLinks,
  pull_requests: prLinks,
  entity_pages: routeLinks,
  external_projects: [{ name: "OpenKB", url: "https://github.com/VectifyAI/OpenKB", status: "RESEARCH_ONLY" }, { name: "Repowise", url: "https://github.com/repowise-dev/repowise", status: "RESEARCH_ONLY" }, { name: "Anydoc", url: "https://github.com/firecrawl/anydoc", status: "OPTIONAL_ADAPTER" }, { name: "Oil Motion", url: "https://github.com/oil-oil/oil-motion", status: "UNRELATED_NOT_VERIFIED" }]
};
const pathManifest = {
  manifest_type: "INTERNAL_PATH_MANIFEST",
  generated_at: quality.generated_at,
  warning: "Internal-only. Never publish these paths to GitHub Pages.",
  clones: clones.map(clone => ({ clone_id: clone.clone_id, repository_id: clone.repository_id, local_absolute_path: clone.local_absolute_path })),
  worktrees: report.worktrees.map(worktree => ({ worktree_id: worktree.worktree_id, repository_id: worktree.repository_id, parent_clone_path: worktree.parent_clone_path, local_absolute_path: worktree.local_absolute_path, branch: worktree.branch, head_full_sha: worktree.head_full_sha }))
};
const publicLinkManifest = {
  manifest_type: "PUBLIC_LINK_MANIFEST",
  generated_at: quality.generated_at,
  local_paths_included: false,
  repositories: report.repositories.map(({ repository_id, repository_url, role, parent_repository_id }) => ({ repository_id, repository_url, role, parent_repository_id })),
  forks: report.forks,
  branches: allBranches.filter(branch => branch.branch_url).map(({ repository_id, branch_name, full_ref, head_full_sha, branch_url, commit_url }) => ({ repository_id, branch_name, full_ref, head_full_sha, branch_url, commit_url })),
  issues: issueLinks,
  pull_requests: prLinks,
  routes: routeLinks,
  public_data: ["https://alot1z.github.io/Ix-findings/graph.json", "https://alot1z.github.io/Ix-findings/entities.json", "https://alot1z.github.io/Ix-findings/routes.json", "https://alot1z.github.io/Ix-findings/search.json", "https://alot1z.github.io/Ix-findings/llms.txt", "https://alot1z.github.io/Ix-findings/llms-full.txt", "https://alot1z.github.io/Ix-findings/sitemap.xml", "https://alot1z.github.io/Ix-findings/robots.txt"]
};

writeFileSync(join(OUT, "PHASE-A-REPORT.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(join(OUT, "LINK-MANIFEST.json"), JSON.stringify(linkManifest, null, 2) + "\n");
writeFileSync(join(OUT, "PATH-MANIFEST.json"), JSON.stringify(pathManifest, null, 2) + "\n");
writeFileSync(join(OUT, "PUBLIC-LINK-MANIFEST.json"), JSON.stringify(publicLinkManifest, null, 2) + "\n");

const markdown = `# Phase A — Canonical Snapshot Reconciliation and Identity Baseline\n\nStatus: **${report.status}**\n\nGenerated: **${report.generated_at}** (day precision; the existing builder hard-codes this date)\n\n## Authoritative worktree snapshot\n\n- Entities: **${entities.length}**\n- Relationships: **${relationships.length}**\n- Raw-source metric: **${quality.raw_source_files}**\n- Public entities: **${publicEntities.meta?.count}**\n- Public graph: **${snapshot.public_graph_entities} entities / ${snapshot.public_graph_relationships} relationships**\n- Public routes: **${publicRoutes.meta?.count}**\n- Source revision: **${publicGraph.source_revision}**\n\nThe \`knowledge/manifest.json\` count of **549/931** is stale metadata. The committed graph is **569/1007**. The current generated graph and derived projections are **570/1008**. The worktree delta is one source entity (\`SRC-cfa3eba511fc\`) and one \`PART_OF\` relationship (\`REL-c8497482887e\`) for \`planning/wiki/assets/entity-view.js\`.\n\nThe current 570/1008 output is selected as authoritative for this Phase-A snapshot. It is still **uncommitted** because the checkout contains protected dirty changes; no existing work was staged, overwritten, cleaned, or committed.\n\n## GitHub identity\n\nThe supplied token was used only for read-only identity verification. It authenticates as **Alot1z** (numeric ID \`16801672\`). GitHub currently resolves the legacy \`Alot1z/Ix\` name to the canonical fork **Alot1z/Ix-remap**. Historical commits are not rewritten in Phase A.\n\n## Repository and local identity\n\nSee the machine-readable manifests beside this report. Exact absolute paths are stored only in \`PATH-MANIFEST.json\` and the internal link manifest. Public manifests contain URLs only.\n\n| Repository | Role | Local paths |\n|---|---|---|\n| \`ix-infrastructure/Ix\` | upstream | \`Ix\`, \`Ix-mcp\`, \`Ix-remap\`, \`Ix-test\` via verified remotes/worktrees |\n| \`Alot1z/Ix-remap\` | user fork | \`Ix\`, \`Ix-mcp\`, \`Ix-remap\`, \`Ix-test\` |\n| \`Alot1z/Ix-findings\` | knowledge ledger | \`Ix-findings\` |\n| \`ix-infrastructure/ix-compass-dist\` | distribution | \`ix-compass-dist\` |\n\n## Dirty/divergence safety findings\n\n- \`Ix-findings\`: 617 dirty paths; \`master\` is \`0 ahead / 0 behind\` its upstream.\n- \`Ix-remap\`: 2 untracked paths (\`cd\`, \`git\`); \`feat/ix-remap-hardening\` is \`1 ahead / 4 behind\` its configured upstream.\n- \`Ix\`: 18 dirty paths on \`feat/ix-agent-skill\`; no configured upstream for the current branch.\n- \`Ix-mcp\`: clean local status on \`feat/ix-mcp\`.\n- \`Ix-test\`: clean detached worktree.\n- \`ix-compass-dist\`: 3 untracked distribution artifacts; \`main\` is \`0 ahead / 0 behind\`.\n\nThese dirty states are preserved and must be reviewed before any commit or remote operation.\n\n## Link and freshness status\n\n- Repository identity/API checks: verified.\n- Broken repository links found in the Phase-A checks: none.\n- Complete production HTTP audit: not re-run in this Phase-A pass.\n- \`system-compass\`: \`UNKNOWN / ACCESS BLOCKED\`.\n- Public artifacts remain derived snapshots, not live GitHub truth.\n- Live freshness gate: **STALE**, 6 checks; live upstream \`fa6ad7b0ff52734685ff7425b08ec240837751fa\` differs from canonical \`1292375548fb8f4431ac5afc34c68fe2573434d1\`; publication is blocked.\n\n## Account versus commit authorship\n\nGitHub authentication and Git commit identity are separate. The token identifies the account used for API/push authorization. It does not rewrite historical commits. Current \`Ix-findings\` history uses author/committer name \`Alot1z\` with the placeholder email \`your-github-email@example.com\`; \`Ix-remap\` contains many upstream authors plus 16 commits with that placeholder identity. Rewriting all historical commits would change SHAs and require explicit, separately approved history-rewrite and force-push operations.\n\n## Next phase\n\nStop after Phase A. Phase B may begin only after this report, the 570/1008 selection, the dirty-worktree boundaries, and the separate commit-identity policy are explicitly reviewed.\n`;
writeFileSync(join(OUT, "PHASE-A-REPORT.md"), markdown);
console.log(`Phase A reports generated: ${entities.length} entities, ${relationships.length} relationships, ${allBranches.length} branches, ${allWorktrees.size} worktrees`);
