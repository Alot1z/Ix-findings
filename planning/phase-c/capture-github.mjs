import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = resolve(root, "planning/phase-c");
const tokenFile = process.env.GITHUB_TOKEN_FILE;
if (!tokenFile) throw new Error("GITHUB_TOKEN_FILE must point to the read-only GitHub token file");
const token = readFileSync(tokenFile, "utf8").trim();
if (!token) throw new Error("GitHub token file is empty");
const capturedAt = new Date().toISOString();
const errors = [];
const requestLog = [];

const compactUser = user => user ? {
  login: user.login || null,
  id: user.id || null,
  type: user.type || null,
  html_url: user.html_url || null,
} : null;
const compactRepo = repo => repo ? {
  id: repo.id || null,
  full_name: repo.full_name || null,
  name: repo.name || null,
  owner: compactUser(repo.owner),
  html_url: absoluteUrl(repo.html_url),
  api_url: absoluteUrl(repo.url),
  description: repo.description || null,
  visibility: repo.visibility || null,
  default_branch: repo.default_branch || null,
  private: Boolean(repo.private),
  fork: Boolean(repo.fork),
  parent: repo.parent?.full_name || null,
  source: repo.source?.full_name || null,
  created_at: repo.created_at || null,
  updated_at: repo.updated_at || null,
  pushed_at: repo.pushed_at || null,
  topics: Array.isArray(repo.topics) ? repo.topics : [],
  language: repo.language || null,
  license: repo.license ? { key: repo.license.key || null, name: repo.license.name || null, url: absoluteUrl(repo.license.url) } : null,
  watchers_count: repo.watchers_count ?? null,
  stargazers_count: repo.stargazers_count ?? null,
  forks_count: repo.forks_count ?? null,
  open_issues_count: repo.open_issues_count ?? null,
} : null;
const compactLabel = label => typeof label === "string" ? label : label?.name || null;
const absoluteUrl = value => typeof value === "string" && /^https?:\/\//.test(value) ? value : null;
const unique = values => [...new Set((values || []).filter(Boolean))];

async function api(path, { paginate = false, accept = "application/vnd.github+json" } = {}) {
  const base = `https://api.github.com/${path.replace(/^\//, "")}`;
  if (!paginate) {
    requestLog.push(base);
    const response = await fetch(base, { headers: { Accept: accept, Authorization: `Bearer ${token}`, "User-Agent": "Ix-findings-phase-c-read-only" } });
    const text = await response.text();
    if (!response.ok) throw new Error(`${response.status} ${response.statusText} ${path}: ${text.slice(0, 300)}`);
    return JSON.parse(text);
  }
  const values = [];
  for (let page = 1; page <= 20; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${base}${separator}per_page=100&page=${page}`;
    requestLog.push(url);
    const response = await fetch(url, { headers: { Accept: accept, Authorization: `Bearer ${token}`, "User-Agent": "Ix-findings-phase-c-read-only" } });
    const text = await response.text();
    if (!response.ok) throw new Error(`${response.status} ${response.statusText} ${path}: ${text.slice(0, 300)}`);
    const json = JSON.parse(text);
    if (!Array.isArray(json)) return json;
    values.push(...json);
    if (json.length < 100) break;
  }
  return values;
}
async function safe(label, fn, fallback) {
  try { return await fn(); } catch (error) { errors.push({ label, message: error.message }); return fallback; }
}
const issueTargets = [57, 219, 349, 371, 374, 376, 377, 379, 383, 385];
const prTargets = [358, 362, 365, 366, 368, 372, 373, 375, 378, 380, 382, 384, 386, 387, 388, 389, 390, 391, 392, 393, 395, 397, 400, 401];
const repoTargets = ["ix-infrastructure/Ix", "Alot1z/Ix", "Alot1z/Ix-remap", "Alot1z/Ix-findings"];
const commitTargets = {
  "Alot1z/Ix-remap": [
    "74b848c83a0d547069660615dddcf1ea0ad0749c",
    "0d99ae0f1866367c3fbc9bbcc16f0add2dd4dd57",
    "869b64df3357a8370c4c85c9a1fa2b553b899e24",
    "36c7c7eccd8068d48df4f61394b42a3ffa62483c",
    "1a5b0b93c9e8871610370c0f36212be8f6cf6980",
  ],
};


function normalizeIssue(repo, issue, comments = []) {
  return {
    repository: repo,
    number: issue.number,
    node_id: issue.node_id || null,
    title: issue.title || "",
    body: issue.body || "",
    state: issue.state || "unknown",
    state_reason: issue.state_reason || null,
    author: compactUser(issue.user),
    html_url: absoluteUrl(issue.html_url),
    api_url: absoluteUrl(issue.url),
    labels: (issue.labels || []).map(compactLabel).filter(Boolean),
    milestone: issue.milestone ? { number: issue.milestone.number, title: issue.milestone.title, html_url: absoluteUrl(issue.milestone.html_url) } : null,
    created_at: issue.created_at || null,
    updated_at: issue.updated_at || null,
    closed_at: issue.closed_at || null,
    comments_count: issue.comments ?? comments.length,
    locked: Boolean(issue.locked),
    comments,
    source: "OFFICIAL_GITHUB_FACT",
  };
}
function normalizeComment(repo, parentType, parentNumber, comment, kind = "ISSUE_COMMENT") {
  const body = comment.body || "";
  return {
    id: comment.id,
    node_id: comment.node_id || null,
    repository: repo,
    parent_type: parentType,
    parent_number: parentNumber,
    kind,
    author: compactUser(comment.user || comment.author),
    body,
    html_url: absoluteUrl(comment.html_url),
    api_url: absoluteUrl(comment.url),
    created_at: comment.created_at || null,
    updated_at: comment.updated_at || null,
    commit_id: comment.commit_id || null,
    path: comment.path || null,
    line: comment.line ?? null,
    start_line: comment.start_line ?? null,
    side: comment.side || null,
    in_reply_to_id: comment.in_reply_to_id ?? null,
    diff_hunk: comment.diff_hunk || null,
    content_classification: "DISCUSSION_EVIDENCE_UNTRUSTED",
    source: "OFFICIAL_GITHUB_FACT",
  };
}
function normalizeReview(repo, prNumber, review) {
  return {
    id: review.id,
    node_id: review.node_id || null,
    repository: repo,
    pr_number: prNumber,
    author: compactUser(review.user),
    state: review.state || "UNKNOWN",
    body: review.body || "",
    html_url: absoluteUrl(review.html_url),
    submitted_at: review.submitted_at || null,
    commit_id: review.commit_id || null,
    content_classification: "DISCUSSION_EVIDENCE_UNTRUSTED",
    source: "OFFICIAL_GITHUB_FACT",
  };
}
function normalizePr(repo, pr, extra = {}) {
  return {
    repository: repo,
    number: pr.number,
    node_id: pr.node_id || null,
    title: pr.title || "",
    body: pr.body || "",
    state: pr.state || "unknown",
    draft: Boolean(pr.draft),
    merged: Boolean(pr.merged),
    author: compactUser(pr.user),
    html_url: absoluteUrl(pr.html_url),
    api_url: absoluteUrl(pr.url),
    head: pr.head ? { ref: pr.head.ref, sha: pr.head.sha, repo: compactRepo(pr.head.repo) } : null,
    base: pr.base ? { ref: pr.base.ref, sha: pr.base.sha, repo: compactRepo(pr.base.repo) } : null,
    merge_commit_sha: pr.merge_commit_sha || null,
    merged_at: pr.merged_at || null,
    closed_at: pr.closed_at || null,
    created_at: pr.created_at || null,
    updated_at: pr.updated_at || null,
    labels: (pr.labels || []).map(compactLabel).filter(Boolean),
    milestone: pr.milestone ? { number: pr.milestone.number, title: pr.milestone.title, html_url: absoluteUrl(pr.milestone.html_url) } : null,
    requested_reviewers: (pr.requested_reviewers || []).map(compactUser),
    requested_teams: (pr.requested_teams || []).map(team => ({ id: team.id, name: team.name, slug: team.slug, html_url: absoluteUrl(team.html_url) })),
    commits_count: pr.commits ?? extra.commits?.length ?? null,
    changed_files_count: pr.changed_files ?? extra.files?.length ?? null,
    additions: pr.additions ?? null,
    deletions: pr.deletions ?? null,
    changed_files: extra.files || [],
    commits: extra.commits || [],
    comments: extra.comments || [],
    reviews: extra.reviews || [],
    review_comments: extra.review_comments || [],
    timeline: extra.timeline || [],
    source: "OFFICIAL_GITHUB_FACT",
  };
}
function normalizeFile(file, repo, prNumber) {
  return {
    repository: repo,
    pr_number: prNumber,
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    blob_url: absoluteUrl(file.blob_url),
    raw_url: absoluteUrl(file.raw_url),
    contents_url: absoluteUrl(file.contents_url),
    patch: file.patch || null,
  };
}
function normalizeCommit(commit) {
  return {
    sha: commit.sha,
    html_url: absoluteUrl(commit.html_url),
    api_url: absoluteUrl(commit.url),
    author: compactUser(commit.author),
    committer: compactUser(commit.committer),
    message: commit.commit?.message || "",
    parents: (commit.parents || []).map(parent => ({ sha: parent.sha, html_url: absoluteUrl(parent.html_url) })),
    tree_sha: commit.commit?.tree?.sha || null,
    authored_at: commit.commit?.author?.date || null,
    committed_at: commit.commit?.committer?.date || null,
  };
}

async function captureRepo(repo) {
  const metadata = await safe(`${repo}:metadata`, () => api(`repos/${repo}`), null);
  if (!metadata) return { repository: repo, error: true, issues: [], pull_requests: [] };
  const defaultBranch = metadata.default_branch;
  const head = await safe(`${repo}:head`, () => api(`repos/${repo}/commits/${encodeURIComponent(defaultBranch)}`), null);
  const branches = await safe(`${repo}:branches`, () => api(`repos/${repo}/branches`, { paginate: true }), []);
  const targetedCommits = await Promise.all((commitTargets[repo] || []).map(sha => safe(`${repo}:commit:${sha}`, () => api(`repos/${repo}/commits/${sha}`), null)));
  const capturedCommits = targetedCommits.filter(Boolean).map(normalizeCommit);
  const releases = await safe(`${repo}:releases`, () => api(`repos/${repo}/releases`, { paginate: true }), []);
  const tags = await safe(`${repo}:tags`, () => api(`repos/${repo}/tags`, { paginate: true }), []);
  const allIssues = await safe(`${repo}:issues`, () => api(`repos/${repo}/issues?state=all&sort=updated`, { paginate: true }), []);
  const allPrs = allIssues.filter(item => item.pull_request).map(item => item.number);
  const issueNumbers = unique([...issueTargets.filter(n => allIssues.some(i => i.number === n && !i.pull_request)), ...allIssues.filter(i => !i.pull_request && i.state === "open").map(i => i.number)]).slice(0, 100);
  const prNumbers = unique([...prTargets.filter(n => allPrs.includes(n)), ...allPrs.filter(n => allIssues.find(i => i.number === n)?.state === "open")]).slice(0, 100);
  const issues = [];
  for (const number of issueNumbers) {
    const detail = await safe(`${repo}:issue:${number}`, () => api(`repos/${repo}/issues/${number}`), null);
    if (!detail || detail.pull_request) continue;
    const comments = await safe(`${repo}:issue-comments:${number}`, () => api(`repos/${repo}/issues/${number}/comments`, { paginate: true }), []);
    issues.push(normalizeIssue(repo, detail, comments.map(c => normalizeComment(repo, "ISSUE", number, c))));
  }
  const pull_requests = [];
  for (const number of prNumbers) {
    const detail = await safe(`${repo}:pr:${number}`, () => api(`repos/${repo}/pulls/${number}`), null);
    if (!detail) continue;
    const [comments, reviews, reviewComments, commits, files, timeline] = await Promise.all([
      safe(`${repo}:pr-comments:${number}`, () => api(`repos/${repo}/issues/${number}/comments`, { paginate: true }), []),
      safe(`${repo}:reviews:${number}`, () => api(`repos/${repo}/pulls/${number}/reviews`, { paginate: true }), []),
      safe(`${repo}:review-comments:${number}`, () => api(`repos/${repo}/pulls/${number}/comments`, { paginate: true }), []),
      safe(`${repo}:commits:${number}`, () => api(`repos/${repo}/pulls/${number}/commits`, { paginate: true }), []),
      safe(`${repo}:files:${number}`, () => api(`repos/${repo}/pulls/${number}/files`, { paginate: true }), []),
      safe(`${repo}:timeline:${number}`, () => api(`repos/${repo}/issues/${number}/timeline`, { paginate: true, accept: "application/vnd.github+json, application/vnd.github.mockingbird-preview+json" }), []),
    ]);
    pull_requests.push(normalizePr(repo, detail, {
      comments: comments.map(c => normalizeComment(repo, "PULL_REQUEST", number, c, "PR_COMMENT")),
      reviews: reviews.map(r => normalizeReview(repo, number, r)),
      review_comments: reviewComments.map(c => normalizeComment(repo, "PULL_REQUEST", number, c, "REVIEW_COMMENT")),
      commits: commits.map(normalizeCommit),
      files: files.map(file => normalizeFile(file, repo, number)),
      timeline: timeline.map(event => ({
        id: event.id || null,
        event: event.event || null,
        actor: compactUser(event.actor),
        created_at: event.created_at || null,
        commit_id: event.commit_id || null,
        issue: event.issue?.number || null,
        source_url: absoluteUrl(event.url),
      })),
    }));
  }
  return {
    repository: repo,
    metadata: compactRepo(metadata),
    captured_at: capturedAt,
    default_branch: defaultBranch,
    head: head ? normalizeCommit(head) : null,
    branches: branches.map(branch => ({ name: branch.name, protected: Boolean(branch.protected), sha: branch.commit?.sha || null, url: absoluteUrl(branch._links?.html?.href) })),
    releases: releases.map(release => ({ id: release.id, tag_name: release.tag_name, name: release.name, draft: release.draft, prerelease: release.prerelease, created_at: release.created_at, published_at: release.published_at, html_url: absoluteUrl(release.html_url), author: compactUser(release.author) })),
    tags: tags.map(tag => ({ name: tag.name, sha: tag.commit?.sha || null, url: absoluteUrl(tag.commit?.url) })),
    issues,
    pull_requests,
    captured_commits: capturedCommits,
  };
}

const authenticated_user = await safe("authenticated-user", () => api("user"), null);
const repositories = [];
for (const repo of repoTargets) repositories.push(await captureRepo(repo));
const upstream = repositories.find(repo => repo.repository === "ix-infrastructure/Ix");
const fork = repositories.find(repo => repo.repository === "Alot1z/Ix") || repositories.find(repo => repo.repository === "Alot1z/Ix-remap");
const findings = repositories.find(repo => repo.repository === "Alot1z/Ix-findings");
const prior = JSON.parse(readFileSync(resolve(root, "knowledge/live-github-state.json"), "utf8"));

const mapIssues = repos => repos.flatMap(repo => repo.issues || []);
const mapPrs = repos => repos.flatMap(repo => repo.pull_requests || []);
const allIssues = mapIssues(repositories);
const allPrs = mapPrs(repositories);
const priorIssueMap = new Map((prior.open_issues || []).map(issue => [`ix-infrastructure/Ix#${issue.number}`, issue]));
const priorPrMap = new Map((prior.open_pull_requests || []).map(pr => [`ix-infrastructure/Ix#${pr.number}`, pr]));
const priorHeads = Object.fromEntries(Object.entries(prior.fork_branches || {}).flatMap(([repo, branches]) => Object.entries(branches || {}).map(([branch, sha]) => [`${repo}:${branch}`, sha])));
const affected = [];
const classify = (oldValue, newValue, unchangedLabel = "UNCHANGED") => oldValue == null ? "CURRENT" : oldValue === newValue ? unchangedLabel : "STALE";
if (prior.upstream?.head_sha !== upstream?.head?.sha) affected.push({ entity_id: `REPO-${upstream?.repository || "ix-infrastructure-Ix"}`, kind: "UPSTREAM_HEAD", previous: prior.upstream?.head_sha || null, current: upstream?.head?.sha || null, status: "STALE" });
for (const branch of fork?.branches || []) {
  const old = priorHeads[`${fork.repository}:${branch.name}`] || priorHeads[`Alot1z/Ix:${branch.name}`];
  if (old !== branch.sha) affected.push({ entity_id: `BRANCH-${fork.repository}:${branch.name}`, kind: "BRANCH_HEAD", previous: old || null, current: branch.sha || null, status: old ? "STALE" : "CURRENT" });
}
for (const pr of allPrs) {
  const key = `${pr.repository}#${pr.number}`;
  const old = priorPrMap.get(key) || (pr.repository === "Alot1z/Ix" ? priorPrMap.get(`ix-infrastructure/Ix#${pr.number}`) : null);
  const oldSha = old?.head_sha || null;
  if (!old || oldSha !== pr.head?.sha || old.state !== pr.state) affected.push({ entity_id: `PR-${pr.number}`, kind: "PULL_REQUEST", previous_head: oldSha, current_head: pr.head?.sha || null, previous_state: old?.state || null, current_state: pr.state, status: old ? "STALE" : (pr.state === "open" ? "CURRENT" : "HISTORICAL") });
  if (old && (old.comments_count || 0) !== pr.comments.length) affected.push({ entity_id: `PR-${pr.number}`, kind: "COMMENTS", previous_count: old.comments_count || 0, current_count: pr.comments.length, status: "STALE" });
}
for (const issue of allIssues) {
  const key = `${issue.repository}#${issue.number}`;
  const old = priorIssueMap.get(key);
  if (!old || old.state !== issue.state) affected.push({ entity_id: `ISSUE-${issue.number}`, kind: "ISSUE_STATE", previous_state: old?.state || null, current_state: issue.state, status: old ? "STALE" : (issue.state === "open" ? "CURRENT" : "HISTORICAL") });
  if (old && (old.comments_count || 0) !== issue.comments.length) affected.push({ entity_id: `ISSUE-${issue.number}`, kind: "COMMENTS", previous_count: old.comments_count || 0, current_count: issue.comments.length, status: "STALE" });
}
const currentSnapshot = {
  schema_version: "phase-c.github-capture.v1",
  captured_at: capturedAt,
  source: "GitHub REST API, read-only, authenticated account metadata only",
  authenticated_user: compactUser(authenticated_user),
  repositories,
  affected_entities: affected,
  errors,
  request_count: requestLog.length,
  review_threads: { status: "UNKNOWN", reason: "REST capture includes review comments but not GraphQL resolved/unresolved thread state" },
};
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "GITHUB-LIVE-CAPTURE.json"), JSON.stringify(currentSnapshot, null, 2) + "\n");
// Keep the canonical collaboration graph separate from the raw source capture.
// Phase-E consumers read GITHUB-LIVE-CAPTURE.json and never overwrite the graph.

const currentIssues = allIssues.filter(i => i.repository === "ix-infrastructure/Ix");
const currentPrs = allPrs.filter(p => p.repository === "ix-infrastructure/Ix");
const comments = [...allIssues.flatMap(i => i.comments), ...allPrs.flatMap(p => [...p.comments, ...p.review_comments])];
const reviews = allPrs.flatMap(p => p.reviews);
writeFileSync(join(outDir, "ISSUE-INGESTION.json"), JSON.stringify({ generated_at: capturedAt, source: currentSnapshot.source, repositories: repositories.map(r => r.repository), issues: currentIssues, issue_count: currentIssues.length, comments_count: currentIssues.reduce((n, i) => n + i.comments.length, 0) }, null, 2) + "\n");
writeFileSync(join(outDir, "PR-INGESTION.json"), JSON.stringify({ generated_at: capturedAt, source: currentSnapshot.source, pull_requests: currentPrs, pull_request_count: currentPrs.length }, null, 2) + "\n");
writeFileSync(join(outDir, "COMMENT-INGESTION.json"), JSON.stringify({ generated_at: capturedAt, source: currentSnapshot.source, comments, count: comments.length, classification: "DISCUSSION_EVIDENCE_UNTRUSTED", privacy: "PUBLIC_REPOSITORY_FIELDS_ONLY" }, null, 2) + "\n");
writeFileSync(join(outDir, "REVIEW-INGESTION.json"), JSON.stringify({ generated_at: capturedAt, source: currentSnapshot.source, reviews, review_comments: allPrs.flatMap(p => p.review_comments), count: reviews.length, review_comment_count: allPrs.reduce((n, p) => n + p.review_comments.length, 0), review_threads: currentSnapshot.review_threads }, null, 2) + "\n");
writeFileSync(join(outDir, "PERSON-MODEL.json"), JSON.stringify({ generated_at: capturedAt, source: currentSnapshot.source, people: [...new Map([
  compactUser(authenticated_user),
  ...allIssues.map(i => i.author),
  ...allPrs.map(p => p.author),
  ...allPrs.flatMap(p => [...p.reviews.map(r => r.author), ...p.comments.map(c => c.author), ...p.review_comments.map(c => c.author), ...p.commits.flatMap(c => [c.author, c.committer])]),
].filter(Boolean).map(person => [person.login, person])).values()], roles: "Signals only; OWNER/MAINTAINER require repository metadata or repeated evidence." }, null, 2) + "\n");
console.log(JSON.stringify({ captured_at: capturedAt, repositories: repositories.map(r => ({ repository: r.repository, issues: r.issues?.length || 0, prs: r.pull_requests?.length || 0 })), comments: comments.length, reviews: reviews.length, review_comments: allPrs.reduce((n, p) => n + p.review_comments.length, 0), affected_entities: affected.length, errors: errors.length, requests: requestLog.length }, null, 2));
