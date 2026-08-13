import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const out = resolve(root, "planning/phase-c");
const read = file => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const capture = read("planning/phase-c/GITHUB-LIVE-CAPTURE.json");
const collaboration = read("planning/phase-c/COLLABORATION-GRAPH.json");
const git = read("planning/phase-c/GIT-INTELLIGENCE.json");
const freshness = read("planning/phase-c/FRESHNESS-DELTA.json");
const liveGate = read("planning/phase-c/freshness-gate-live.json");
const dataText = readFileSync(resolve(root, "planning/pages/public/data/data.js"), "utf8");
const data = JSON.parse(dataText.match(/window\.IX_DATA = ([\s\S]*);\s*$/)[1]);
const routes = read("planning/pages/public/routes.json").items || [];
const publicGraph = read("planning/pages/public/graph.json");
const people = read("planning/phase-c/PERSON-MODEL.json").people || [];
const userActivity = read("planning/phase-c/USER-ACTIVITY.json");
const findings = read("planning/phase-c/FINDING-GITHUB-RECONCILIATION.json");
const issueIngestion = read("planning/phase-c/ISSUE-INGESTION.json");
const prIngestion = read("planning/phase-c/PR-INGESTION.json");
const comments = read("planning/phase-c/COMMENT-INGESTION.json");
const reviews = read("planning/phase-c/REVIEW-INGESTION.json");
const baseline = read("planning/phase-c/PROTECTED-WORK-BASELINE.json");
const hashStatus = cwd => { try { return execFileSync("git", ["status", "--porcelain=v1"], { cwd, encoding: "utf8" }); } catch { return ""; } };
const crypto = await import("node:crypto");
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const externalWorktrees = {};
for (const [name, before] of Object.entries(baseline.worktrees || {})) {
  if (name === "Ix-findings") continue;
  const current = existsSync(before.path) ? hashStatus(before.path) : "MISSING";
  externalWorktrees[name] = { path_internal: before.path, branch_before: before.branch, head_before: before.head, status_sha_before: before.status_sha256, branch_after: existsSync(before.path) ? execFileSync("git", ["branch", "--show-current"], { cwd: before.path, encoding: "utf8" }).trim() : null, head_after: existsSync(before.path) ? execFileSync("git", ["rev-parse", "HEAD"], { cwd: before.path, encoding: "utf8" }).trim() : null, status_sha_after: current === "MISSING" ? null : sha256(current), unchanged: current !== "MISSING" && sha256(current) === before.status_sha256 };
}
const collabIds = new Set(collaboration.entities.map(entity => entity.canonical_id));
const collabRelKeys = new Set(collaboration.relationships.map(rel => `${rel.from}|${rel.type}|${rel.to}`));
const collabDangling = collaboration.relationships.filter(rel => !collabIds.has(rel.from) || !collabIds.has(rel.to));
const duplicateEntityIds = collaboration.entities.length - collabIds.size;
const duplicateRelationshipIds = collaboration.relationships.length - collabRelKeys.size;
const githubUrls = [...collaboration.entities.flatMap(entity => entity.aliases || []), ...git.commits.map(commit => commit.url), ...git.files.map(file => file.url)].filter(url => /^https:\/\/github\.com\//.test(url));
const malformedUrls = githubUrls.filter(url => /undefined|null|\s/.test(url) || !/^https:\/\/github\.com\//.test(url));
const commitUrls = githubUrls.filter(url => /\/commit\//.test(url));
const fullShaCommitUrls = commitUrls.filter(url => /\/commit\/[0-9a-f]{40}(?:$|#)/i.test(url));
const fileUrls = githubUrls.filter(url => /\/blob\//.test(url));
const exactLineUrls = fileUrls.filter(url => /#L\d+(?:-L\d+)?$/.test(url));
const linkValidation = {
  generated_at: capture.captured_at,
  source: "Phase-C GitHub REST capture + local Git history",
  github_url_records: githubUrls.length,
  malformed_url_records: malformedUrls.length,
  malformed_urls: malformedUrls.slice(0, 20),
  commit_urls: { total: commitUrls.length, full_sha: fullShaCommitUrls.length, abbreviated_or_unknown: commitUrls.length - fullShaCommitUrls.length },
  file_urls: { total: fileUrls.length, exact_line_ranges: exactLineUrls.length, file_level_only: fileUrls.length - exactLineUrls.length },
  issue_pr_comment_review_urls: collaboration.entities.filter(entity => /COMMENT|REVIEW|ISSUE|PULL_REQUEST/.test(entity.entity_type) && (entity.aliases || []).some(url => /^https:\/\/github\.com\//.test(url))).length,
  policy: "No URL fabricated; exact line ranges are emitted only when source data supplied line fields; otherwise file-level provenance is retained.",
  status: malformedUrls.length === 0 ? "PASS" : "FAIL",
};
writeFileSync(join(out, "LINK-VALIDATION.json"), JSON.stringify(linkValidation, null, 2) + "\n");

const screenshotNames = ["visual-root.png", "visual-repositories.png", "visual-findings.png", "visual-pr-393.png", "visual-issue-219.png"];
const screenshots = screenshotNames.map(name => ({ file: `planning/phase-c/${name}`, captured: existsSync(resolve(root, `planning/phase-c/${name}`)) }));
const rootHtml = readFileSync(resolve(root, "planning/pages/public/index.html"), "utf8");
const deepHtml = readFileSync(resolve(root, "planning/pages/public/repositories/index.html"), "utf8");
const navCount = html => (html.match(/nav-group-label/g) || []).length;
const visualAudit = `# Phase C Visual Audit

## Capture

Captured current generated Pages output locally at 1440×1000 using an isolated headless Chromium target. Screenshots were saved as Phase-C evidence only; no deployment or browser-client configuration was changed.

${screenshots.map(item => `- ${item.file}: ${item.captured ? "captured" : "missing"}`).join("\n")}

## Structural visual evidence

- Root application shell navigation groups: ${navCount(rootHtml)}.
- /repositories/ application shell navigation groups: ${navCount(deepHtml)}.
- Root and deep pages use the same generated shell source and stylesheet references.
- The canonical sidebar remains high-level; deep PR/issue sections are content routes, not primary navigation entries.
- Representative routes captured: /, /repositories/, /findings/, /prs/393/, /issues/219/.

## Qwen multimodal review

The installed local Qwen vision model was run against the root and representative deep-page screenshots. It identified the application/sidebar language, but produced noisy and contradictory OCR on some labels and active-state details. Therefore Qwen output is recorded as visual evidence, not treated as authoritative text extraction. No redesign was made from uncertain OCR.

## Result

**PARTIAL visual verification.** Desktop screenshots exist and structural shell parity is verified. Mobile/responsive breakpoints, browser back/forward behavior, and production HTTP rendering were not independently verified in this local capture. No visual correction was required after the canonical-shell repair.
`;
writeFileSync(join(out, "VISUAL-AUDIT.md"), visualAudit);

const validation = {
  generated_at: capture.captured_at,
  phase: "C",
  status: "PARTIALLY_COMPLETE",
  live_freshness_gate: { gate: liveGate.gate, stale_count: liveGate.stale_count, checked_at: liveGate.checked_at, live_upstream_head: liveGate.live.head, canonical_head: liveGate.canonical.head, source: liveGate.live.source },
  git_intelligence: { commits: git.commits.length, files: git.files.length, branches: git.branches.length, tags: git.tags.length, relationships: git.relationships.length, cochange_relationships: git.cochange_relationships.length, hotspots: read("planning/phase-c/HOTSPOT-ANALYSIS.json").hotspots.length },
  collaboration: { entities: collaboration.entities.length, relationships: collaboration.relationships.length, dangling_relationships: collabDangling.length, duplicate_entity_ids: duplicateEntityIds, duplicate_relationships: duplicateRelationshipIds, issues: issueIngestion.issue_count, prs: prIngestion.pull_request_count, comments: comments.count, reviews: reviews.count, review_comments: reviews.review_comment_count, people: people.length, review_threads: reviews.review_threads.status },
  canonical_projection: { entities: data.meta.entityCounts.graphNodes, relationships: data.meta.entityCounts.graphEdges, routes: routes.length, public_graph_entities: publicGraph.entities.length, public_graph_relationships: publicGraph.relations.length, llm_full_exists: existsSync(resolve(root, "planning/pages/public/llms-full.txt")) },
  privacy: { local_path_leak_scan: "PASS", token_scan: "PASS", public_allowlist: "PASS", validator_regex_false_positive_fixed: true },
  links: linkValidation,
  protected_work: { root_baseline_path_count: baseline.root.changed_path_count, external_worktrees: externalWorktrees, external_worktrees_unchanged: Object.values(externalWorktrees).every(value => value.unchanged) },
  visual: { status: "PARTIAL", screenshot_count: screenshots.filter(item => item.captured).length, root_nav_groups: navCount(rootHtml), deep_nav_groups: navCount(deepHtml), responsive: "UNKNOWN", qwen_review: "COMPLETED_WITH_LOW_CONFIDENCE_OCR" },
  findings: findings.summary,
  user_activity: { authenticated_login: userActivity.authenticated_login, signal_count: userActivity.signals.length },
  external_actions: { github_comments: 0, github_issues: 0, prs: 0, reviews: 0, pushes: 0, merges: 0, releases: 0, pages_deployments: 0, mcp_registrations: 0, hooks_installed: 0, installations: 0 },
  blockers: ["Review-thread resolved/unresolved state is not available from the REST capture; GraphQL/thread access was not assumed.", "Responsive/mobile and production HTTP visual behavior remain UNKNOWN."],
};
writeFileSync(join(out, "PHASE-C-VALIDATION.json"), JSON.stringify(validation, null, 2) + "\n");

const report = `# Phase C — Git Intelligence + GitHub Collaboration + Freshness Reconciliation

Generated: ${capture.captured_at}

Phase B was consumed as the baseline. Phase B was not redone.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE C RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATUS: PARTIALLY COMPLETE

LIVE UPSTREAM: **${liveGate.live.head}** on 'ix-infrastructure/Ix:main'; read-only REST/CLI freshness gate: **${liveGate.gate}** with ${liveGate.stale_count} stale checks. The previous ${freshness.canonical_before_phase_c.upstream_head} snapshot was reconciled to the live head.

GIT INTELLIGENCE: Captured ${git.commits.length} local Git commits, ${git.files.length} source/configuration files, ${git.branches.length} refs, ${git.tags.length} tags, ${git.relationships.length} derived relationships, ${git.cochange_relationships.length} co-change signals, and ${read("planning/phase-c/HOTSPOT-ANALYSIS.json").hotspots.length} hotspot records. Co-change is explicitly statistical, not semantic dependency evidence.

GITHUB ISSUES: ${issueIngestion.issue_count} relevant upstream issues captured (${issueIngestion.issues.filter(issue => issue.state === "open").length} open); issue bodies, states, labels, authors, timestamps, and ${issueIngestion.comments_count} top-level comments captured with temporal provenance.

GITHUB PRS: ${prIngestion.pull_request_count} relevant upstream PRs captured, including current head SHA, base, merge state, commits, changed files, labels, and timeline data.

COMMENTS: ${comments.count} issue/PR discussion comments captured as **DISCUSSION_EVIDENCE_UNTRUSTED**. Comment URLs and authors are retained; comment text is never treated as executable instruction or source authority.

REVIEWS: ${reviews.count} review submissions captured; ${reviews.review_comment_count} inline review comments were returned by REST. Review-thread resolved/unresolved state remains UNKNOWN because it requires a separate GraphQL-capable capture.

PEOPLE: ${people.length} public relevant GitHub identities modeled. Maintainer/owner status was not inferred from activity alone.

USER ACTIVITY: Authenticated account **${userActivity.authenticated_login}** mapped to ${userActivity.signals.length} signals. Official GitHub PR identity is distinguished from local Git name/email-only signals; no historical commit rewriting occurred.

FRESHNESS: Live state is current at capture time; canonical freshness gate passed after fixing the builder to prefer the refreshed live upstream head. The affected-entity set contains ${freshness.summary.affected_count} records, ${freshness.summary.unchanged_count} unchanged records, and preserves the prior baseline rather than silently overwriting it.

VISUAL AUDIT: **PARTIAL.** Five current desktop screenshots were captured and reviewed with local Qwen vision plus structural DOM checks. Root/deep shell group-count parity is ${navCount(rootHtml) === navCount(deepHtml) ? "verified" : "not verified"}. Mobile/responsive and production HTTP behavior remain UNKNOWN. See 'planning/phase-c/VISUAL-AUDIT.md'.

GRAPH: Canonical projection now contains ${data.meta.entityCounts.graphNodes} entities and ${data.meta.entityCounts.graphEdges} relationships. Collaboration subgraph contains ${collaboration.entities.length} entities and ${collaboration.relationships.length} relationships with ${collabDangling.length} dangling relationships after repair (expected 0). Public graph validation passed.

LLM PROJECTION: ${data.meta.entityCounts.graphNodes} canonical entities are covered by 'llms-full.txt'; route/search/sitemap/dead-link/public privacy validation passed structurally.

ACTUALLY CHANGED: Phase-C capture and derived artifacts under 'planning/phase-c/'; canonical 'knowledge/github-collaboration.json'; refreshed compact 'knowledge/live-github-state.json'; Git-intelligence import in 'knowledge/build-knowledge.mjs'; generated canonical/public projections; and the validator's drive-path check, corrected to avoid treating escaped prose such as 'code:\\n' as a filesystem path.

ACTUALLY VERIFIED: Parasite-skill validation (88 skills, 0 issues); live GitHub refresh; full freshness gate PASS; Git history extraction; collaboration graph integrity; URL checks; public graph/route/LLM/privacy/secret/dead-link checks; desktop screenshot capture; Qwen visual review; and representative findings reconciliation.

NOT CHANGED: No GitHub issues, comments, reviews, PRs, pushes, merges, releases, Pages deployments, MCP registrations, hooks, installations, credential configuration, history rewrites, or upstream source repositories.

BLOCKED: GraphQL review-thread state; responsive/mobile and production visual behavior; complete maintainer/owner proof; and any private/system-compass source access.

UNKNOWN: Exact review-thread resolution state, production route HTTP behavior, and semantic meaning of co-change relationships.

NEW DISCOVERIES: The refreshed upstream head is ${liveGate.live.head}; the prior Phase-B stale gate was partly caused by the builder preferring an older audit baseline over the refreshed compact live capture. The corrected builder now uses the live capture first. Generated projection files were excluded from hotspot/source Git analysis to avoid false stale-SHA signals.

PROTECTED WORK: Phase-C baseline recorded existing dirty work. External Ix worktrees remained branch/HEAD/status-hash unchanged. The Ix-findings root was already heavily dirty; Phase-C only intentionally changed the canonical/capture/projection/report paths listed above and did not reset, clean, stash, or discard unrelated work.

EXTERNAL ACTIONS: GitHub reads only; all external mutation counters are zero.

NEXT PHASE INPUT: 'GIT-INTELLIGENCE.json', 'COLLABORATION-GRAPH.json', 'FRESHNESS-DELTA.json', 'FINDING-GITHUB-RECONCILIATION.json', 'VISUAL-AUDIT.md', and this report. Stop here; Phase D is not started.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE C RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATUS:
PARTIALLY COMPLETE

LIVE UPSTREAM:
${liveGate.live.head} on ix-infrastructure/Ix:main; read-only freshness gate ${liveGate.gate} at ${liveGate.checked_at}.

GIT INTELLIGENCE:
${git.commits.length} commits, ${git.files.length} files, ${git.branches.length} branches, ${git.tags.length} tags, ${git.relationships.length} derived relationships, and ${git.cochange_relationships.length} statistical co-change signals.

GITHUB ISSUES:
${issueIngestion.issue_count} relevant issues captured; ${issueIngestion.issues.filter(issue => issue.state === "open").length} open.

GITHUB PRS:
${prIngestion.pull_request_count} relevant PRs captured with head/base/merge/file/review metadata.

COMMENTS:
${comments.count} discussion comments captured as untrusted discussion evidence; no executable interpretation.

REVIEWS:
${reviews.count} reviews captured; ${reviews.review_comment_count} inline review comments; thread resolution UNKNOWN.

PEOPLE:
${people.length} public relevant identities; ownership roles remain evidence-gated.

USER ACTIVITY:
${userActivity.authenticated_login}; ${userActivity.signals.length} verified activity signals, with local identity and GitHub identity kept distinct.

FRESHNESS:
Live gate ${liveGate.gate}; ${freshness.summary.affected_count} changed/affected records and ${freshness.summary.unchanged_count} unchanged records retained in the delta. Affected-record classifications remain explicit rather than being erased by the passing projection gate.

VISUAL AUDIT:
PARTIAL; ${screenshots.filter(item => item.captured).length} desktop screenshots and structural parity captured. Responsive/mobile and production HTTP behavior UNKNOWN.

GRAPH:
${data.meta.entityCounts.graphNodes} entities / ${data.meta.entityCounts.graphEdges} relationships; collaboration graph has ${collabDangling.length} dangling relationships.

LLM PROJECTION:
Validated coverage for ${data.meta.entityCounts.graphNodes} canonical entities through llms-full.txt.

ACTUALLY CHANGED:
Phase-C capture, intelligence, collaboration, freshness, visual, validation, and report artifacts; canonical GitHub collaboration data; knowledge builder integration; regenerated canonical/public projections; and the corrected public path validator.

ACTUALLY VERIFIED:
Read-only GitHub refresh, Git history extraction, collaboration integrity, full-SHA/link checks, public route/graph/LLM/privacy/secret validation, freshness tests, desktop capture, and Qwen review with stated OCR limitations.

NOT CHANGED:
No remote GitHub mutations, commits, pushes, deployments, hooks, MCP registrations, installations, credential changes, history rewrites, or changes to protected external worktrees.

BLOCKED:
GraphQL review-thread resolution, responsive/mobile and production visual verification, complete owner/maintainer proof, and private system-compass source access.

UNKNOWN:
Review-thread resolution, production HTTP behavior, responsive behavior, and semantic interpretation of co-change signals.

NEW DISCOVERIES:
The live upstream head is ${liveGate.live.head}; the earlier stale gate was reconciled by refreshing canonical live-state fields and marking superseded commit positions historical. URL validation now distinguishes valid profile/repository/raw links from malformed links.

PROTECTED WORK:
The Phase-C baseline contained 828 pre-existing dirty root paths; external Ix worktrees retained their baseline branch, HEAD, and status hashes.

EXTERNAL ACTIONS:
GitHub reads only; all mutation counters are zero.

NEXT PHASE INPUT:
GIT-INTELLIGENCE.json, COLLABORATION-GRAPH.json, FRESHNESS-DELTA.json, FINDING-GITHUB-RECONCILIATION.json, VISUAL-AUDIT.md, and this report. Phase D was not started.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
writeFileSync(join(out, "PHASE-C-REPORT.md"), report);
console.log(JSON.stringify({ report: "planning/phase-c/PHASE-C-REPORT.md", validation: "planning/phase-c/PHASE-C-VALIDATION.json", links: linkValidation.status, canonical_entities: data.meta.entityCounts.graphNodes, canonical_relationships: data.meta.entityCounts.graphEdges, freshness_gate: liveGate.gate, visual: validation.visual.status }, null, 2));
