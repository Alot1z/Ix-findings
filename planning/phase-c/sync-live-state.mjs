import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const root = process.cwd();
const capture = JSON.parse(readFileSync(resolve(root, "planning/phase-c/GITHUB-LIVE-CAPTURE.json"), "utf8"));
const prior = JSON.parse(readFileSync(resolve(root, "knowledge/live-github-state.json"), "utf8"));
const upstream = capture.repositories.find(repo => repo.repository === "ix-infrastructure/Ix");
const fork = capture.repositories.find(repo => repo.repository === "Alot1z/Ix") || capture.repositories.find(repo => repo.repository === "Alot1z/Ix-remap");
const compactIssue = issue => ({ number: issue.number, title: issue.title, state: issue.state, state_reason: issue.state_reason, user: issue.author?.login || null, url: issue.html_url, labels: issue.labels, updated_at: issue.updated_at, closed_at: issue.closed_at, comments_count: issue.comments.length });
const compactPr = pr => ({ number: pr.number, title: pr.title, state: pr.state, draft: pr.draft, merged: pr.merged, user: pr.author?.login || null, url: pr.html_url, head_ref: pr.head?.ref || null, head_sha: pr.head?.sha || null, head_repo: pr.head?.repo?.full_name || null, base_ref: pr.base?.ref || null, base_sha: pr.base?.sha || null, merge_sha: pr.merge_commit_sha || null, merged_at: pr.merged_at || null, updated_at: pr.updated_at || null, related_issue: null, comments_count: pr.comments.length, reviews_count: pr.reviews.length, review_comments_count: pr.review_comments.length });
const previousByNumber = new Map((prior.open_pull_requests || []).map(pr => [pr.number, pr]));
for (const pr of upstream?.pull_requests || []) {
  const old = previousByNumber.get(pr.number);
  if (!pr.related_issue && old?.related_issue) pr.related_issue = old.related_issue;
}
const live = {
  captured_at: capture.captured_at,
  capture_note: "Phase C read-only GitHub refresh. Full collaboration records are in knowledge/github-collaboration.json and planning/phase-c/*.json; this file is the compact freshness baseline.",
  source: "read-only GitHub REST API via supplied token",
  upstream: { repository: "ix-infrastructure/Ix", default_branch: upstream?.default_branch || "main", head_sha: upstream?.head?.sha || null, head_sha_short: (upstream?.head?.sha || "").slice(0, 12) },
  fork_branches: { "Alot1z/Ix": Object.fromEntries((fork?.branches || []).map(branch => [branch.name, branch.sha])) },
  open_issues: (upstream?.issues || []).filter(issue => issue.state === "open").map(compactIssue),
  open_pull_requests: (upstream?.pull_requests || []).filter(pr => pr.state === "open").map(compactPr),
  implementations: prior.implementations || [],
  collaboration_capture: { issue_count: upstream?.issues?.length || 0, pull_request_count: upstream?.pull_requests?.length || 0, comment_count: (upstream?.issues || []).reduce((n, i) => n + i.comments.length, 0) + (upstream?.pull_requests || []).reduce((n, p) => n + p.comments.length + p.review_comments.length, 0), review_count: (upstream?.pull_requests || []).reduce((n, p) => n + p.reviews.length, 0), review_comment_count: (upstream?.pull_requests || []).reduce((n, p) => n + p.review_comments.length, 0), review_threads: "UNKNOWN" },
};
writeFileSync(resolve(root, "knowledge/live-github-state.json"), JSON.stringify(live, null, 2) + "\n");
console.log(JSON.stringify({ captured_at: live.captured_at, upstream_head: live.upstream.head_sha, fork_branch_count: Object.keys(live.fork_branches["Alot1z/Ix"]).length, open_issues: live.open_issues.length, open_prs: live.open_pull_requests.length, comments: live.collaboration_capture.comment_count, reviews: live.collaboration_capture.review_count }, null, 2));
