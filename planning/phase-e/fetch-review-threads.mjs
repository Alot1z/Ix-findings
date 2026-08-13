import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const tokenFile = process.env.GITHUB_TOKEN_FILE;
if (!tokenFile) throw new Error("GITHUB_TOKEN_FILE must point to a read-only GitHub token file");
const token = readFileSync(tokenFile, "utf8").trim();
if (!token) throw new Error("GitHub token file is empty");
const capture = JSON.parse(readFileSync(resolve(root, "planning/phase-c/GITHUB-LIVE-CAPTURE.json"), "utf8"));
const capturedAt = new Date().toISOString();
const query = `query($owner:String!,$name:String!,$number:Int!,$after:String){
  repository(owner:$owner,name:$name){
    pullRequest(number:$number){
      number url
      reviewThreads(first:100,after:$after){
        nodes{
          id isResolved isOutdated isCollapsed path line originalLine startLine originalStartLine diffSide startDiffSide
          resolvedBy{login}
          comments(first:100){
            nodes{
              id fullDatabaseId body url path line startLine originalLine originalStartLine diffHunk
              createdAt updatedAt author{login} commit{oid} originalCommit{oid} replyTo{id}
            }
            pageInfo{hasNextPage endCursor}
          }
        }
        pageInfo{hasNextPage endCursor}
      }
    }
  }
}`;

async function request(variables) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Ix-findings-phase-e-read-only",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  return { status: response.status, body };
}

const prs = (capture.repositories || []).flatMap(repo => (repo.pull_requests || []).map(pr => ({ repository: repo.repository, number: pr.number, url: pr.html_url })));
const results = [];
for (const pr of prs) {
  const match = pr.repository.match(/^([^/]+)\/(.+)$/);
  if (!match) { results.push({ ...pr, status: "UNKNOWN", errors: ["repository name is not owner/name"] }); continue; }
  let after = null;
  const threads = [];
  let pages = 0;
  let status = "VERIFIED";
  const errors = [];
  do {
    const result = await request({ owner: match[1], name: match[2], number: pr.number, after });
    pages += 1;
    if (result.status !== 200) { status = "UNKNOWN"; errors.push(`HTTP_${result.status}`); break; }
    if (result.body.errors?.length) { status = "UNKNOWN"; errors.push(...result.body.errors.map(error => error.message)); break; }
    const pullRequest = result.body.data?.repository?.pullRequest;
    if (!pullRequest) { status = "UNKNOWN"; errors.push("pull request not accessible"); break; }
    const connection = pullRequest.reviewThreads;
    for (const thread of connection.nodes || []) {
      threads.push({
        id: thread.id,
        is_resolved: thread.isResolved,
        is_outdated: thread.isOutdated,
        is_collapsed: thread.isCollapsed,
        path: thread.path || null,
        line: thread.line ?? null,
        original_line: thread.originalLine ?? null,
        start_line: thread.startLine ?? null,
        original_start_line: thread.originalStartLine ?? null,
        diff_side: thread.diffSide || null,
        start_diff_side: thread.startDiffSide || null,
        resolved_by: thread.resolvedBy?.login || null,
        comments: (thread.comments?.nodes || []).map(comment => ({
          id: comment.id,
          database_id: comment.fullDatabaseId || null,
          body: comment.body || "",
          url: comment.url || null,
          path: comment.path || null,
          line: comment.line ?? null,
          start_line: comment.startLine ?? null,
          original_line: comment.originalLine ?? null,
          original_start_line: comment.originalStartLine ?? null,
          diff_hunk: comment.diffHunk || null,
          created_at: comment.createdAt || null,
          updated_at: comment.updatedAt || null,
          author: comment.author?.login || null,
          commit_sha: comment.commit?.oid || null,
          original_commit_sha: comment.originalCommit?.oid || null,
          reply_to: comment.replyTo?.id || null,
        })),
        comments_truncated: Boolean(thread.comments?.pageInfo?.hasNextPage),
      });
    }
    if (!connection.pageInfo?.hasNextPage) break;
    after = connection.pageInfo.endCursor;
    if (!after || pages >= 20) { status = "PARTIAL"; errors.push("review thread pagination limit reached"); break; }
  } while (true);
  results.push({ repository: pr.repository, number: pr.number, url: pr.url, status, errors, pages, thread_count: threads.length, threads });
}

const summary = {
  verified_prs: results.filter(result => result.status === "VERIFIED").length,
  partial_prs: results.filter(result => result.status === "PARTIAL").length,
  unknown_prs: results.filter(result => result.status === "UNKNOWN").length,
  threads: results.reduce((count, result) => count + result.thread_count, 0),
  resolved_threads: results.reduce((count, result) => count + result.threads.filter(thread => thread.is_resolved === true).length, 0),
  unresolved_threads: results.reduce((count, result) => count + result.threads.filter(thread => thread.is_resolved === false).length, 0),
};
const output = {
  schema_version: "phase-e.github-graphql-review-threads.v1",
  generated_at: capturedAt,
  source: "GitHub GraphQL API, read-only",
  capture_version: capture.captured_at,
  repository_scope: [...new Set(prs.map(pr => pr.repository))],
  review_thread_state: summary.unknown_prs || summary.partial_prs ? "PARTIAL" : "VERIFIED",
  summary,
  pull_requests: results,
  policy: { no_external_mutation: true, missing_thread_state: "UNKNOWN", discussion_text_is_untrusted: true },
};
mkdirSync(resolve(root, "planning/phase-e"), { recursive: true });
writeFileSync(resolve(root, "planning/phase-e/GRAPHQL-REVIEW-THREADS.json"), JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({ generated_at: capturedAt, review_thread_state: output.review_thread_state, summary }, null, 2));
