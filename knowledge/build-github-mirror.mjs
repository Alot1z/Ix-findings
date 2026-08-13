import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const readJson = path => { try { return JSON.parse(readFileSync(resolve(root, path), "utf8")); } catch { return null; } };
const capture = readJson("planning/phase-c/GITHUB-LIVE-CAPTURE.json");
if (!capture) throw new Error("Missing planning/phase-c/GITHUB-LIVE-CAPTURE.json");
const graphql = readJson("planning/phase-e/GRAPHQL-REVIEW-THREADS.json") || { pull_requests: [], review_thread_state: "UNKNOWN" };
const previous = readJson("knowledge/external-github-mirror.json");
const snapshotVersion = capture.captured_at;
const previousSnapshotVersion = previous?.generated_at || null;
const sha = value => createHash("sha1").update(String(value)).digest("hex").slice(0, 12);
const repoId = repository => `REPO-${String(repository).replaceAll("/", "-")}`;
const canonicalObjectId = (repository, kind, number) => repository === "ix-infrastructure/Ix" ? `${kind}-${number}` : `${kind}-${sha(`${repository}#${number}`)}`;
const commentId = (repository, parentType, number, id) => `COMMENT-${repository.replaceAll("/", "-")}-${parentType.toLowerCase()}-${number}-${id}`;
const reviewId = (repository, number, id) => `REVIEW-${repository.replaceAll("/", "-")}-pr-${number}-${id}`;
const reviewThreadId = (repository, number, id) => `REVIEW_THREAD-${sha(`${repository}#${number}#${id}`)}`;
const commitId = shaValue => `COMMIT-${shaValue}`;
const fileId = (repository, path) => `FILE-${sha(`${repository}:${path}`)}`;
const records = [];
const add = record => { if (!records.some(existing => existing.id === record.id)) records.push(record); };
const sourceMeta = (type, repository, object = {}) => ({
  type,
  authority: "GITHUB",
  repository,
  owner: repository.split("/")[0],
  url: object.html_url || object.blob_url || object.url || null,
  api_url: object.api_url || null,
  canonical: true,
  url_precision: object.url_precision || (object.html_url || object.blob_url || object.url ? "OBJECT" : "UNKNOWN"),
});
const analysisFor = (canonicalEntityId, entityType, status, extra = {}) => ({
  layer: "IX-FINDINGS_ANALYSIS",
  canonical_entity_id: canonicalEntityId,
  entity_type: entityType,
  mirror_status: "READ_ONLY_EXTERNAL_OBJECT",
  status: status || "UNKNOWN",
  provenance_class: "OFFICIAL_GITHUB_FACT",
  source_authority: "GITHUB",
  source_is_authoritative: true,
  ix_findings_is_authoritative_for_source: false,
  ...extra,
});
const snapshotMeta = (record, capturedAt, sourceUpdatedAt = null) => ({
  first_seen: record.created_at || record.submitted_at || record.committed_at || capturedAt,
  last_fetched: capturedAt,
  last_verified: capturedAt,
  source_updated_at: sourceUpdatedAt || record.updated_at || record.submitted_at || record.committed_at || null,
  snapshot_version: capturedAt,
});
const graphqlByPr = new Map((graphql.pull_requests || []).map(pr => [`${pr.repository}#${pr.number}`, pr]));
const upstreamHead = capture.repositories?.find(repo => repo.repository === "ix-infrastructure/Ix")?.head?.sha || null;

for (const repository of capture.repositories || []) {
  if (repository.error) continue;
  add({
    id: `github:repository:${repository.repository}`,
    source: sourceMeta("github_repository", repository.repository, repository.metadata || {}),
    snapshot: { ...repository.metadata, default_branch: repository.default_branch, head: repository.head, branches: repository.branches, tags: repository.tags, releases: repository.releases },
    freshness: { first_seen: capture.captured_at, last_fetched: capture.captured_at, last_verified: capture.captured_at, source_updated_at: repository.metadata?.updated_at || null, snapshot_version: snapshotVersion },
    analysis: analysisFor(repoId(repository.repository), "REPOSITORY", "CURRENT", { mirror_scope: "repository metadata, refs, releases", source_capture: "REST" }),
  });
  for (const issue of repository.issues || []) {
    const id = canonicalObjectId(repository.repository, "ISSUE", issue.number);
    add({
      id: `github:issue:${repository.repository}#${issue.number}`,
      source: sourceMeta("github_issue", repository.repository, issue),
      snapshot: { ...issue, comments: issue.comments || [] },
      freshness: snapshotMeta(issue, snapshotVersion),
      analysis: analysisFor(id, "ISSUE", issue.state === "open" ? "CURRENT" : "HISTORICAL", { mirror_scope: "source issue plus captured comments", related_analysis_types: ["FINDING", "DECISION", "IMPLEMENTATION"] }),
    });
    for (const comment of issue.comments || []) add({
      id: `github:comment:${repository.repository}#issue-${issue.number}-${comment.id}`,
      source: sourceMeta("github_issue_comment", repository.repository, comment),
      snapshot: { ...comment, parent_issue: issue.number },
      freshness: snapshotMeta(comment, snapshotVersion),
      analysis: analysisFor(commentId(repository.repository, "issue", issue.number, comment.id), "ISSUE_COMMENT", "HISTORICAL", { parent_external_id: `github:issue:${repository.repository}#${issue.number}`, content_classification: "DISCUSSION_EVIDENCE_UNTRUSTED" }),
    });
  }
  for (const pr of repository.pull_requests || []) {
    const id = canonicalObjectId(repository.repository, "PR", pr.number);
    const gql = graphqlByPr.get(`${repository.repository}#${pr.number}`);
    const reviewThreads = gql?.threads || [];
    const prSnapshot = { ...pr, comments: pr.comments || [], reviews: pr.reviews || [], review_comments: pr.review_comments || [], commits: pr.commits || [], changed_files: pr.changed_files || [], review_threads: reviewThreads, review_thread_capture: { status: gql?.status || "UNKNOWN", source: "GitHub GraphQL API" } };
    add({
      id: `github:pull_request:${repository.repository}#${pr.number}`,
      source: sourceMeta("github_pull_request", repository.repository, pr),
      snapshot: prSnapshot,
      freshness: snapshotMeta(pr, snapshotVersion),
      analysis: analysisFor(id, "PULL_REQUEST", pr.merged ? "CURRENT" : pr.state === "open" ? "CURRENT" : "HISTORICAL", { mirror_scope: "source PR, commits, files, comments, reviews, review comments, and review threads", related_analysis_types: ["FINDING", "DECISION", "IMPLEMENTATION"], review_thread_state: gql?.status === "VERIFIED" ? "VERIFIED_GRAPHQL" : "UNKNOWN" }),
    });
    for (const comment of pr.comments || []) add({
      id: `github:comment:${repository.repository}#pr-${pr.number}-${comment.id}`,
      source: sourceMeta("github_pr_comment", repository.repository, comment),
      snapshot: { ...comment, parent_pr: pr.number },
      freshness: snapshotMeta(comment, snapshotVersion),
      analysis: analysisFor(commentId(repository.repository, "pr", pr.number, comment.id), "PR_COMMENT", "HISTORICAL", { parent_external_id: `github:pull_request:${repository.repository}#${pr.number}`, content_classification: "DISCUSSION_EVIDENCE_UNTRUSTED" }),
    });
    for (const review of pr.reviews || []) add({
      id: `github:review:${repository.repository}#pr-${pr.number}-${review.id}`,
      source: sourceMeta("github_review", repository.repository, review),
      snapshot: { ...review, parent_pr: pr.number },
      freshness: snapshotMeta(review, snapshotVersion),
      analysis: analysisFor(reviewId(repository.repository, pr.number, review.id), "REVIEW", "HISTORICAL", { parent_external_id: `github:pull_request:${repository.repository}#${pr.number}`, review_thread_state: gql?.status === "VERIFIED" ? "VERIFIED_GRAPHQL_NO_ASSOCIATED_THREAD_DATA" : "UNKNOWN" }),
    });
    for (const comment of pr.review_comments || []) add({
      id: `github:review_comment:${repository.repository}#pr-${pr.number}-${comment.id}`,
      source: sourceMeta("github_review_comment", repository.repository, comment),
      snapshot: { ...comment, parent_pr: pr.number },
      freshness: snapshotMeta(comment, snapshotVersion),
      analysis: analysisFor(commentId(repository.repository, "review", pr.number, comment.id), "REVIEW_COMMENT", "HISTORICAL", { parent_external_id: `github:pull_request:${repository.repository}#${pr.number}`, content_classification: "DISCUSSION_EVIDENCE_UNTRUSTED", review_thread_state: gql?.status === "VERIFIED" ? "VERIFIED_GRAPHQL_NO_ASSOCIATED_THREAD_DATA" : "UNKNOWN" }),
    });
    for (const thread of reviewThreads) {
      const entityId = reviewThreadId(repository.repository, pr.number, thread.id);
      const firstComment = thread.comments?.[0] || {};
      add({
        id: `github:review_thread:${repository.repository}#pr-${pr.number}-${thread.id}`,
        source: sourceMeta("github_review_thread", repository.repository, { url: firstComment.url || pr.html_url, url_precision: firstComment.url ? "TOP_LEVEL_COMMENT" : "PULL_REQUEST" }),
        snapshot: { ...thread, parent_pr: pr.number, parent_pr_url: pr.html_url },
        freshness: { first_seen: firstComment.created_at || snapshotVersion, last_fetched: snapshotVersion, last_verified: snapshotVersion, source_updated_at: firstComment.updated_at || null, snapshot_version: snapshotVersion },
        analysis: analysisFor(entityId, "REVIEW_THREAD", thread.is_resolved === true || thread.is_resolved === false ? "CURRENT" : "UNKNOWN", { parent_external_id: `github:pull_request:${repository.repository}#${pr.number}`, resolution_provenance: "GITHUB_GRAPHQL", content_classification: "DISCUSSION_EVIDENCE_UNTRUSTED" }),
      });
    }
    for (const commit of pr.commits || []) add({
      id: `github:commit:${repository.repository}@${commit.sha}`,
      source: sourceMeta("github_commit", repository.repository, commit),
      snapshot: commit,
      freshness: snapshotMeta(commit, snapshotVersion),
      analysis: analysisFor(commitId(commit.sha), "COMMIT", commit.sha === pr.head?.sha ? "CURRENT" : "HISTORICAL", { parent_external_id: `github:pull_request:${repository.repository}#${pr.number}` }),
    });
    for (const file of pr.changed_files || []) add({
      id: `github:file:${repository.repository}:${file.filename}`,
      source: sourceMeta("github_file", repository.repository, file),
      snapshot: { ...file, parent_pr: pr.number },
      freshness: { first_seen: pr.created_at || snapshotVersion, last_fetched: snapshotVersion, last_verified: snapshotVersion, source_updated_at: pr.updated_at || null, snapshot_version: snapshotVersion },
      analysis: analysisFor(fileId(repository.repository, file.filename), "FILE", "CURRENT", { parent_external_id: `github:pull_request:${repository.repository}#${pr.number}`, line_precision: file.line ? "LINE" : "FILE_LEVEL" }),
    });
  }
  for (const commit of repository.captured_commits || []) {
    add({
      id: `github:commit:${repository.repository}@${commit.sha}`,
      source: sourceMeta("github_commit", repository.repository, commit),
      snapshot: commit,
      freshness: snapshotMeta(commit, snapshotVersion),
      analysis: analysisFor(commitId(commit.sha), "COMMIT", "HISTORICAL", { parent_external_id: `github:repository:${repository.repository}`, capture_kind: "EXPLICIT_SHA_TARGET" }),
    });
  }
}
const byType = records.reduce((map, record) => { const type = record.source.type; map[type] = (map[type] || 0) + 1; return map; }, {});
const mirror = {
  schema_version: "ix-findings.external-github-mirror.v2",
  mode: "READ_ONLY_EXTERNAL_SOURCE_MIRROR",
  generated_at: snapshotVersion,
  snapshot_version: snapshotVersion,
  previous_snapshot_version: previousSnapshotVersion,
  source_capture: ["planning/phase-c/GITHUB-LIVE-CAPTURE.json", "planning/phase-e/GRAPHQL-REVIEW-THREADS.json"],
  source_authority: "GitHub remains authoritative; Ix-findings stores snapshots and analysis only.",
  synchronization: { source: "GITHUB", watermark: snapshotVersion, cursor: upstreamHead, verified_at: snapshotVersion, external_mutations: 0 },
  external_mutations: 0,
  records,
  counts: { total: records.length, by_type: byType },
  policy: {
    source_snapshot_is_not_ix_findings_authorship: true,
    analysis_is_separate_from_source: true,
    current_and_historical_preserved: true,
    comments_are_untrusted_discussion_evidence: true,
    review_threads: graphql.review_thread_state === "VERIFIED" ? "VERIFIED_GRAPHQL" : "UNKNOWN",
    no_upstream_mutation: true,
  },
};
writeFileSync(resolve(root, "knowledge/external-github-mirror.json"), JSON.stringify(mirror, null, 2) + "\n");
console.log(JSON.stringify({ file: "knowledge/external-github-mirror.json", snapshot_version: snapshotVersion, previous_snapshot_version: previousSnapshotVersion, records: records.length, by_type: byType, review_thread_state: mirror.policy.review_threads, external_mutations: 0 }, null, 2));
