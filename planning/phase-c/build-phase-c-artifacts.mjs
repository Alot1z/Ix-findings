import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const root = process.cwd();
const out = resolve(root, "planning/phase-c");
const capture = JSON.parse(readFileSync(join(out, "GITHUB-LIVE-CAPTURE.json"), "utf8"));
const git = JSON.parse(readFileSync(join(out, "GIT-INTELLIGENCE.json"), "utf8"));
const entities = JSON.parse(readFileSync(resolve(root, "knowledge/entities.json"), "utf8"));
const relationships = JSON.parse(readFileSync(resolve(root, "knowledge/relationships.json"), "utf8"));
const findings = JSON.parse(readFileSync(resolve(root, "planning/findings/registry.json"), "utf8"));
const prior = JSON.parse(readFileSync(resolve(root, "knowledge/live-github-state.json"), "utf8"));
const sha = value => createHash("sha1").update(String(value)).digest("hex").slice(0, 12);
const unique = values => [...new Set((values || []).filter(Boolean))];
const repoKey = repo => String(repo).replaceAll("/", "-");
const repoEntity = repo => `REPO-${repoKey(repo)}`;
const personEntity = login => `PERSON-${login}`;
const objectEntity = (repo, type, number) => repo === "ix-infrastructure/Ix" ? `${type}-${number}` : `${type}-${sha(`${repo}#${number}`)}`;
const source = "planning/phase-c/GITHUB-LIVE-CAPTURE.json";
const fullUrlPattern = /https?:\/\/github\.com\/([^/]+\/[^/]+)\/(issues|pull|commit|blob|tree)\/([^\s)#]+)/g;
const referencesFromText = text => {
  const refs = [];
  for (const match of String(text || "").matchAll(fullUrlPattern)) refs.push({ repository: match[1], kind: match[2], value: match[3], url: match[0].replace(/[.,;]+$/, "") });
  return refs;
};
const canonicalById = new Map(entities.map(entity => [entity.canonical_id, entity]));
const oldPrs = new Map((prior.open_pull_requests || []).map(pr => [pr.number, pr]));
const oldIssues = new Map((prior.open_issues || []).map(issue => [issue.number, issue]));
const upstream = capture.repositories.find(repo => repo.repository === "ix-infrastructure/Ix");
const allIssues = (upstream?.issues || []);
const allPrs = (upstream?.pull_requests || []);
const freshness = {
  generated_at: capture.captured_at,
  source,
  canonical_before_phase_c: { upstream_head: "1292375548fb8f4431ac5afc34c68fe2573434d1", entity_count: entities.length, relationship_count: relationships.length },
  live: { upstream_head: upstream?.head?.sha || null, fork_heads: Object.fromEntries((capture.repositories.find(repo => repo.repository === "Alot1z/Ix")?.branches || []).map(branch => [branch.name, branch.sha])), captured_at: capture.captured_at },
  classification_policy: { CURRENT: "newly observed live fact or still current", UNCHANGED: "same compared value", STALE: "canonical fact differs from live fact", SUPERSEDED: "old object replaced by an explicitly newer object", HISTORICAL: "retained past state", UNKNOWN: "insufficient evidence" },
  affected_entities: capture.affected_entities.map(item => ({ ...item, ...(item.status === "CURRENT" && item.kind === "PULL_REQUEST" && item.current_state !== "open" ? { status: "HISTORICAL" } : {}), ...(item.status === "CURRENT" && item.kind === "ISSUE_STATE" && item.current_state !== "open" ? { status: "HISTORICAL" } : {}) })),
  unchanged_entities: [],
  historical_entities: [],
};
const affectedIds = new Set(freshness.affected_entities.map(item => item.entity_id));
for (const pr of allPrs) {
  const old = oldPrs.get(pr.number);
  if (!affectedIds.has(`PR-${pr.number}`) && old && old.head_sha === pr.head?.sha && old.state === pr.state && (old.comments_count || 0) === pr.comments.length) freshness.unchanged_entities.push(`PR-${pr.number}`);
}
for (const issue of allIssues) {
  const old = oldIssues.get(issue.number);
  if (!affectedIds.has(`ISSUE-${issue.number}`) && old && old.state === issue.state && (old.comments_count || 0) === issue.comments.length) freshness.unchanged_entities.push(`ISSUE-${issue.number}`);
}
for (const affected of freshness.affected_entities) {
  if (affected.kind === "PULL_REQUEST" && affected.previous_head && affected.current_head && affected.previous_head !== affected.current_head) {
    freshness.historical_entities.push({ old: `COMMIT-${affected.previous_head}`, new: `COMMIT-${affected.current_head}`, relationship: "HEAD_MOVED_TO", status: "SUPERSEDED", evidence: source });
  }
}
freshness.summary = { affected_count: freshness.affected_entities.length, unchanged_count: freshness.unchanged_entities.length, historical_transition_count: freshness.historical_entities.length, stale_check: freshness.affected_entities.some(item => item.status === "STALE") ? "STALE" : "PASS" };
writeFileSync(join(out, "FRESHNESS-DELTA.json"), JSON.stringify(freshness, null, 2) + "\n");

const canonicalEntities = [];
const canonicalRelationships = [];
const addEntity = entity => { if (!canonicalEntities.some(existing => existing.canonical_id === entity.canonical_id)) canonicalEntities.push(entity); };
const addRel = relationship => { const key = `${relationship.from}|${relationship.type}|${relationship.to}`; if (!canonicalRelationships.some(existing => `${existing.from}|${existing.type}|${existing.to}` === key)) canonicalRelationships.push({ relationship_id: `REL-${sha(key)}`, confidence: "HIGH", status: "CURRENT", source_refs: [source], temporal_scope: { valid_from: relationship.observed_at || capture.captured_at, valid_until: null }, ...relationship }); };
const personSet = new Map();
const ensurePerson = person => {
  if (!person?.login) return null;
  const id = personEntity(person.login); personSet.set(person.login, id);
  addEntity({ canonical_id: id, entity_type: "PERSON", canonical_name: person.login, aliases: [person.html_url].filter(Boolean), status: "CURRENT", confidence: "HIGH", human_summary: `GitHub user ${person.login}; activity signals are captured separately from ownership claims.`, deep_summary: `Public GitHub identity ${person.login}. No private profile metadata is ingested.`, evidence_ids: [], source_refs: [source], temporal: { valid_from: null, valid_until: null, observed_at: capture.captured_at, verified_at: capture.captured_at }, llm: { llm_summary: `GitHub user ${person.login}.`, llm_context: "Public identity and relevant collaboration activity only.", llm_facts: [], llm_uncertainties: ["Maintainer/owner status is not inferred from activity alone."], llm_questions: [], llm_evidence_chain: [], llm_relationships: [], llm_search_terms: [person.login] }, metadata: { login: person.login, github_url: person.html_url, github_id: person.id, public_only: true } });
  return id;
};
const ensureRepo = repo => { const id = repoEntity(repo); if (canonicalById.has(id)) addEntity(canonicalById.get(id)); else addEntity({ canonical_id: id, entity_type: "REPOSITORY", canonical_name: repo, aliases: [`https://github.com/${repo}`], status: "CURRENT", confidence: "HIGH", human_summary: `${repo} repository.`, deep_summary: "Repository verified by GitHub REST metadata.", evidence_ids: [], source_refs: [source], metadata: { repository: repo, url: `https://github.com/${repo}` } }); return id; };
const ensureCommit = (repo, commit) => {
  if (!commit?.sha) return null;
  const id = `COMMIT-${commit.sha}`;
  addEntity({ canonical_id: id, entity_type: "COMMIT", canonical_name: commit.sha, aliases: [commit.html_url].filter(Boolean), status: "CURRENT", confidence: "HIGH", human_summary: `${commit.message.split("\\n")[0] || commit.sha}`, deep_summary: `${repo} commit ${commit.sha}; full message and parent/file provenance are in Phase-C Git intelligence.`, evidence_ids: [], source_refs: [source, "planning/phase-c/GIT-INTELLIGENCE.json"], metadata: { repository: repo, sha: commit.sha, url: commit.html_url, author: commit.author, committer: commit.committer, authored_at: commit.authored_at, committed_at: commit.committed_at, provenance_class: "OFFICIAL_GITHUB_FACT" } });
  addRel({ from: id, to: ensureRepo(repo), type: "COMMIT_IN_REPOSITORY", confidence: "HIGH" });
  for (const parent of commit.parents || []) {
    const parentId = `COMMIT-${parent.sha}`;
    if (!canonicalEntities.some(existing => existing.canonical_id === parentId)) addEntity({ canonical_id: parentId, entity_type: "COMMIT", canonical_name: parent.sha, aliases: [parent.html_url].filter(Boolean), status: "HISTORICAL", confidence: "HIGH", human_summary: `Parent commit ${parent.sha}.`, deep_summary: `GitHub-verified parent SHA of ${id}; full commit record was not required for this PR capture.`, evidence_ids: [], source_refs: [source], metadata: { repository: repo, sha: parent.sha, url: parent.html_url, parent_only: true } });
    addRel({ from: id, to: parentId, type: "PARENT", confidence: "HIGH", status: "HISTORICAL" });
  }
  return id;
};
const comments = [];
const reviews = [];
for (const issue of allIssues) {
  const id = objectEntity(issue.repository, "ISSUE", issue.number); const repoId = ensureRepo(issue.repository); const authorId = ensurePerson(issue.author);
  addEntity({ canonical_id: id, entity_type: "ISSUE", canonical_name: `Issue #${issue.number} — ${issue.title}`, aliases: [issue.html_url].filter(Boolean), status: issue.state === "open" ? "OPEN" : issue.state === "closed" ? "RESOLVED" : "UNKNOWN", confidence: "HIGH", human_summary: `${issue.title} — ${issue.state}.`, deep_summary: issue.body || issue.title, evidence_ids: [], source_refs: [source], temporal: { valid_from: issue.created_at, valid_until: issue.closed_at, observed_at: issue.updated_at, verified_at: capture.captured_at }, metadata: { repository: issue.repository, number: issue.number, url: issue.html_url, labels: issue.labels, milestone: issue.milestone, state: issue.state, state_reason: issue.state_reason, historical_state_preserved: true, discussion_evidence: true } });
  addRel({ from: id, to: repoId, type: "FOUND_IN", confidence: "HIGH" });
  if (authorId) addRel({ from: authorId, to: id, type: "AUTHORED", confidence: "HIGH" });
  for (const comment of issue.comments || []) {
    const commentId = `COMMENT-${issue.repository.replaceAll("/", "-")}-issue-${issue.number}-${comment.id}`; const commentAuthor = ensurePerson(comment.author);
    comments.push(comment);
    addEntity({ canonical_id: commentId, entity_type: "ISSUE_COMMENT", canonical_name: `Issue #${issue.number} comment ${comment.id}`, aliases: [comment.html_url].filter(Boolean), status: "HISTORICAL", confidence: "HIGH", human_summary: `Discussion comment on issue #${issue.number}.`, deep_summary: comment.body || "(empty comment)", evidence_ids: [], source_refs: [source], temporal: { valid_from: comment.created_at, valid_until: comment.updated_at, observed_at: comment.updated_at || comment.created_at, verified_at: capture.captured_at }, metadata: { repository: issue.repository, issue: issue.number, url: comment.html_url, content_classification: comment.content_classification, public_only: true } });
    addRel({ from: commentId, to: id, type: "COMMENTED_ON", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at });
    if (commentAuthor) addRel({ from: commentAuthor, to: commentId, type: "AUTHORED", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at });
    for (const ref of referencesFromText(comment.body)) {
      if (ref.kind === "issues") addRel({ from: commentId, to: objectEntity(ref.repository, "ISSUE", Number(ref.value.split(/[/?#]/)[0])), type: "REFERENCES", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at });
      if (ref.kind === "pull") addRel({ from: commentId, to: objectEntity(ref.repository, "PR", Number(ref.value.split(/[/?#]/)[0])), type: "REFERENCES", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at });
    }
  }
}
for (const pr of allPrs) {
  const id = objectEntity(pr.repository, "PR", pr.number); const repoId = ensureRepo(pr.repository); const authorId = ensurePerson(pr.author);
  const status = pr.merged ? "RESOLVED" : pr.state === "open" ? "OPEN" : pr.state === "closed" ? "HISTORICAL" : "UNKNOWN";
  addEntity({ canonical_id: id, entity_type: "PULL_REQUEST", canonical_name: `PR #${pr.number} — ${pr.title}`, aliases: [pr.html_url].filter(Boolean), status, confidence: "HIGH", human_summary: `${pr.title} — ${status}.`, deep_summary: pr.body || pr.title, evidence_ids: [], source_refs: [source], temporal: { valid_from: pr.created_at, valid_until: pr.merged_at || pr.closed_at, observed_at: pr.updated_at, verified_at: capture.captured_at }, metadata: { repository: pr.repository, number: pr.number, url: pr.html_url, state: pr.state, draft: pr.draft, merged: pr.merged, head_ref: pr.head?.ref, head_sha: pr.head?.sha, head_repo: pr.head?.repo?.full_name, base_ref: pr.base?.ref, base_sha: pr.base?.sha, merge_sha: pr.merge_commit_sha, changed_files_count: pr.changed_files_count, additions: pr.additions, deletions: pr.deletions, discussion_evidence: true } });
  addRel({ from: id, to: repoId, type: "FOUND_IN", confidence: "HIGH" });
  if (authorId) addRel({ from: authorId, to: id, type: "AUTHORED", confidence: "HIGH" });
  const headId = ensureCommit(pr.repository, pr.commits.find(commit => commit.sha === pr.head?.sha) || { sha: pr.head?.sha, html_url: `https://github.com/${pr.repository}/commit/${pr.head?.sha}`, message: `Current head of PR #${pr.number}`, parents: [], author: null, committer: null, authored_at: null, committed_at: null });
  if (headId) addRel({ from: id, to: headId, type: "HEADS_AT", confidence: "HIGH" });
  for (const commit of pr.commits || []) {
    const commitId = ensureCommit(pr.repository, commit); if (commitId) addRel({ from: id, to: commitId, type: "INCLUDES_COMMIT", confidence: "HIGH" });
    for (const file of pr.changed_files || []) { const fileId = `FILE-${sha(`${pr.repository}:${file.filename}`)}`; addEntity({ canonical_id: fileId, entity_type: "FILE", canonical_name: file.filename, aliases: [file.blob_url, file.raw_url].filter(Boolean), status: "CURRENT", confidence: "HIGH", human_summary: `${file.filename} changed by PR #${pr.number}.`, deep_summary: `${file.status}; +${file.additions}/-${file.deletions}; exact lines unavailable unless supplied by GitHub.`, evidence_ids: [], source_refs: [source], temporal: { valid_from: pr.created_at, valid_until: null, observed_at: pr.updated_at, verified_at: capture.captured_at }, metadata: { repository: pr.repository, path: file.filename, pr: pr.number, blob_url: file.blob_url, raw_url: file.raw_url, status: file.status, additions: file.additions, deletions: file.deletions, line_precision: "FILE_LEVEL" } }); addRel({ from: commitId, to: fileId, type: "CHANGES", confidence: "HIGH" }); }
  }
  for (const comment of pr.comments || []) {
    const commentId = `COMMENT-${pr.repository.replaceAll("/", "-")}-pr-${pr.number}-${comment.id}`; const commentAuthor = ensurePerson(comment.author); comments.push(comment);
    addEntity({ canonical_id: commentId, entity_type: "PR_COMMENT", canonical_name: `PR #${pr.number} comment ${comment.id}`, aliases: [comment.html_url].filter(Boolean), status: "HISTORICAL", confidence: "HIGH", human_summary: `Discussion comment on PR #${pr.number}.`, deep_summary: comment.body || "(empty comment)", evidence_ids: [], source_refs: [source], temporal: { valid_from: comment.created_at, valid_until: comment.updated_at, observed_at: comment.updated_at || comment.created_at, verified_at: capture.captured_at }, metadata: { repository: pr.repository, pr: pr.number, url: comment.html_url, content_classification: comment.content_classification, public_only: true } });
    addRel({ from: commentId, to: id, type: "COMMENTED_ON", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at }); if (commentAuthor) addRel({ from: commentAuthor, to: commentId, type: "AUTHORED", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at });
    for (const ref of referencesFromText(comment.body)) if (ref.kind === "issues" || ref.kind === "pull") addRel({ from: commentId, to: objectEntity(ref.repository, ref.kind === "issues" ? "ISSUE" : "PR", Number(ref.value.split(/[/?#]/)[0])), type: "REFERENCES", confidence: "HIGH", status: "HISTORICAL", observed_at: comment.created_at });
  }
  for (const review of pr.reviews || []) {
    const reviewId = `REVIEW-${pr.repository.replaceAll("/", "-")}-pr-${pr.number}-${review.id}`; const reviewAuthor = ensurePerson(review.author); reviews.push(review);
    addEntity({ canonical_id: reviewId, entity_type: "REVIEW", canonical_name: `Review ${review.id} on PR #${pr.number}`, aliases: [review.html_url].filter(Boolean), status: "HISTORICAL", confidence: "HIGH", human_summary: `${review.state} review on PR #${pr.number}.`, deep_summary: review.body || `${review.state} review`, evidence_ids: [], source_refs: [source], temporal: { valid_from: review.submitted_at, valid_until: null, observed_at: review.submitted_at, verified_at: capture.captured_at }, metadata: { repository: pr.repository, pr: pr.number, url: review.html_url, state: review.state, commit_id: review.commit_id, content_classification: review.content_classification } });
    addRel({ from: id, to: reviewId, type: "HAS_REVIEW", confidence: "HIGH" }); if (reviewAuthor) addRel({ from: reviewAuthor, to: id, type: "REVIEWED_BY", confidence: "HIGH", status: "HISTORICAL", observed_at: review.submitted_at });
  }
  for (const reviewComment of pr.review_comments || []) {
    const commentId = `COMMENT-${pr.repository.replaceAll("/", "-")}-review-${pr.number}-${reviewComment.id}`; const commentAuthor = ensurePerson(reviewComment.author); comments.push(reviewComment);
    addEntity({ canonical_id: commentId, entity_type: "REVIEW_COMMENT", canonical_name: `Review comment ${reviewComment.id} on PR #${pr.number}`, aliases: [reviewComment.html_url].filter(Boolean), status: "HISTORICAL", confidence: "HIGH", human_summary: `Inline review comment on PR #${pr.number}.`, deep_summary: reviewComment.body || "(empty review comment)", evidence_ids: [], source_refs: [source], temporal: { valid_from: reviewComment.created_at, valid_until: reviewComment.updated_at, observed_at: reviewComment.updated_at || reviewComment.created_at, verified_at: capture.captured_at }, metadata: { repository: pr.repository, pr: pr.number, url: reviewComment.html_url, path: reviewComment.path, line: reviewComment.line, start_line: reviewComment.start_line, commit_id: reviewComment.commit_id, content_classification: reviewComment.content_classification } });
    addRel({ from: reviewIdFor(pr, reviewComment), to: commentId, type: "HAS_COMMENT", confidence: "MEDIUM", status: "HISTORICAL", observed_at: reviewComment.created_at }); addRel({ from: commentId, to: id, type: "COMMENTS_ON", confidence: "HIGH", status: "HISTORICAL", observed_at: reviewComment.created_at }); if (commentAuthor) addRel({ from: commentAuthor, to: commentId, type: "AUTHORED", confidence: "HIGH", status: "HISTORICAL", observed_at: reviewComment.created_at });
  }
}
function reviewIdFor(pr, comment) { return `REVIEW-${pr.repository.replaceAll("/", "-")}-pr-${pr.number}-${comment.in_reply_to_id || "thread"}`; }
const ensureTransitionCommit = (commitId, status, repository) => {
  if (!commitId || canonicalEntities.some(existing => existing.canonical_id === commitId)) return;
  const fullSha = commitId.replace(/^COMMIT-/, "");
  addEntity({ canonical_id: commitId, entity_type: "COMMIT", canonical_name: fullSha, aliases: [`https://github.com/${repository}/commit/${fullSha}`], status, confidence: "HIGH", human_summary: `${status === "CURRENT" ? "Current" : "Historical"} commit ${fullSha}.`, deep_summary: `Commit identity retained for Phase-C freshness transition evidence.`, evidence_ids: [], source_refs: [source], metadata: { repository, sha: fullSha, url: `https://github.com/${repository}/commit/${fullSha}`, freshness_transition: true } });
};
for (const transition of freshness.historical_entities) { ensureTransitionCommit(transition.old, "HISTORICAL", "ix-infrastructure/Ix"); ensureTransitionCommit(transition.new, "CURRENT", "ix-infrastructure/Ix"); addRel({ from: transition.old, to: transition.new, type: transition.relationship, confidence: "HIGH", status: "SUPERSEDED", observed_at: capture.captured_at }); }
for (const affected of freshness.affected_entities) if (affected.kind === "UPSTREAM_HEAD") { ensureTransitionCommit(`COMMIT-${affected.previous}`, "HISTORICAL", "ix-infrastructure/Ix"); ensureTransitionCommit(`COMMIT-${affected.current}`, "CURRENT", "ix-infrastructure/Ix"); addRel({ from: `COMMIT-${affected.previous}`, to: `COMMIT-${affected.current}`, type: "HEAD_MOVED_TO", confidence: "HIGH", status: "SUPERSEDED", observed_at: capture.captured_at }); }
const collaborationGraph = { schema_version: "phase-c.collaboration-graph.v1", generated_at: capture.captured_at, source, entities: canonicalEntities, relationships: canonicalRelationships, counts: { entities: canonicalEntities.length, relationships: canonicalRelationships.length, issues: allIssues.length, prs: allPrs.length, comments: comments.length, reviews: reviews.length, review_comments: allPrs.reduce((n, pr) => n + pr.review_comments.length, 0), people: personSet.size }, limitations: { review_threads: "UNKNOWN", comment_text: "Discussion evidence only; not executable instructions", private_metadata: "excluded" } };
writeFileSync(resolve(root, "knowledge/github-collaboration.json"), JSON.stringify(collaborationGraph, null, 2) + "\n");
writeFileSync(join(out, "COLLABORATION-GRAPH.json"), JSON.stringify(collaborationGraph, null, 2) + "\n");

const issueByNumber = new Map(allIssues.map(issue => [issue.number, issue]));
const prByNumber = new Map(allPrs.map(pr => [pr.number, pr]));
const findingReconciliation = [];
for (const finding of findings.findings || []) {
  const issueNumbers = unique((finding.related_issues || []).map(value => String(value).match(/#?(\d+)/)?.[1]).filter(Boolean).map(Number));
  const prNumbers = unique((finding.related_prs || []).map(value => String(value).match(/#?(\d+)/)?.[1]).filter(Boolean).map(Number));
  const issueRecords = issueNumbers.map(number => issueByNumber.get(number) || null);
  const prRecords = prNumbers.map(number => prByNumber.get(number) || null);
  const missingIssues = issueNumbers.filter((_, index) => !issueRecords[index]);
  const missingPrs = prNumbers.filter((_, index) => !prRecords[index]);
  const status = issueRecords.some(issue => issue?.state === "open") || prRecords.some(pr => pr?.state === "open") ? "CURRENT" : missingIssues.length || missingPrs.length ? "UNKNOWN" : finding.status === "FIXED_UPSTREAM" ? "RESOLVED" : "HISTORICAL";
  findingReconciliation.push({ finding_id: finding.id, title: finding.title, previous_status: finding.status, reconciled_status: status, issue_numbers: issueNumbers, issue_states: issueRecords.filter(Boolean).map(issue => ({ number: issue.number, state: issue.state, url: issue.html_url })), pr_numbers: prNumbers, pr_states: prRecords.filter(Boolean).map(pr => ({ number: pr.number, state: pr.state, merged: pr.merged, head_sha: pr.head?.sha, url: pr.html_url })), missing_issues: missingIssues, missing_prs: missingPrs, evidence_policy: "GitHub state changes do not rewrite the finding ledger; they create reconciliation evidence.", source_refs: ["planning/findings/registry.json", source] });
}
writeFileSync(join(out, "FINDING-GITHUB-RECONCILIATION.json"), JSON.stringify({ generated_at: capture.captured_at, source, findings: findingReconciliation, summary: { total: findingReconciliation.length, current: findingReconciliation.filter(f => f.reconciled_status === "CURRENT").length, resolved: findingReconciliation.filter(f => f.reconciled_status === "RESOLVED").length, unknown: findingReconciliation.filter(f => f.reconciled_status === "UNKNOWN").length } }, null, 2) + "\n");

const temporalEvents = [];
for (const issue of allIssues) {
  temporalEvents.push({ entity_id: objectEntity(issue.repository, "ISSUE", issue.number), event: issue.state === "open" ? "OPEN" : "CLOSED", at: issue.updated_at || issue.closed_at, source_url: issue.html_url, provenance_class: "OFFICIAL_GITHUB_FACT" });
  for (const comment of issue.comments || []) temporalEvents.push({ entity_id: `COMMENT-${issue.repository.replaceAll("/", "-")}-issue-${issue.number}-${comment.id}`, event: "COMMENTED", at: comment.created_at, source_url: comment.html_url, provenance_class: "OFFICIAL_GITHUB_FACT" });
}
for (const pr of allPrs) {
  const id = objectEntity(pr.repository, "PR", pr.number);
  temporalEvents.push({ entity_id: id, event: pr.state === "open" ? "OPEN" : pr.merged ? "MERGED" : "CLOSED", at: pr.merged_at || pr.closed_at || pr.updated_at, source_url: pr.html_url, head_sha: pr.head?.sha, provenance_class: "OFFICIAL_GITHUB_FACT" });
  for (const review of pr.reviews || []) temporalEvents.push({ entity_id: id, event: "REVIEWED", at: review.submitted_at, source_url: review.html_url, reviewer: review.author?.login, review_state: review.state, provenance_class: "OFFICIAL_GITHUB_FACT" });
  for (const comment of [...(pr.comments || []), ...(pr.review_comments || [])]) temporalEvents.push({ entity_id: id, event: "COMMENTED", at: comment.created_at, source_url: comment.html_url, commenter: comment.author?.login, provenance_class: "OFFICIAL_GITHUB_FACT" });
}
writeFileSync(join(out, "TEMPORAL-GITHUB-STATE.json"), JSON.stringify({ generated_at: capture.captured_at, source, events: temporalEvents.sort((a, b) => String(a.at).localeCompare(String(b.at))), state_policy: "Current and historical events are retained; no state overwrite." }, null, 2) + "\n");

const incremental = {
  schema_version: "phase-c.incremental-sync.v1",
  generated_at: capture.captured_at,
  source,
  event_types: {
    new_commit: { source_event: "commit observed", affected_entity_ids: ["COMMIT:<full_sha>", "BRANCH:<repo>:<branch>", "FILE:<repo>:<path>"], affected_relationships: ["PARENT", "CHANGES", "HEADS_AT", "CO_CHANGED_WITH"], projections: ["entity", "graph", "search", "llm", "routes"], validation: ["full_sha", "parent_integrity", "file_url"] },
    new_issue: { source_event: "issue created", affected_entity_ids: ["ISSUE:<repo>:<number>", "PERSON:<login>"], affected_relationships: ["AUTHORED", "FOUND_IN"], projections: ["issue_entity", "graph", "search", "llm", "sitemap"] },
    new_pr: { source_event: "pull request opened", affected_entity_ids: ["PR:<repo>:<number>", "PERSON:<login>", "COMMIT:<head_sha>"], affected_relationships: ["AUTHORED", "HEADS_AT", "RESPONDS_TO"], projections: ["pr_entity", "graph", "search", "llm", "sitemap"] },
    new_comment: { source_event: "issue/PR comment created", affected_entity_ids: ["COMMENT:<id>", "ISSUE/PR:<id>", "PERSON:<login>"], affected_relationships: ["COMMENTED_ON", "AUTHORED", "REFERENCES"], projections: ["commenting_entity", "parent_entity", "graph", "llm"] },
    new_review: { source_event: "review submitted", affected_entity_ids: ["REVIEW:<id>", "PR:<id>", "PERSON:<login>"], affected_relationships: ["HAS_REVIEW", "REVIEWED_BY"], projections: ["pr_entity", "review_entity", "graph", "llm"] },
    changed_pr_head: { source_event: "PR head SHA changed", affected_entity_ids: ["PR:<number>", "COMMIT:<old_sha>", "COMMIT:<new_sha>", "FILE:<changed>"], affected_relationships: ["HEADS_AT", "HEAD_MOVED_TO", "CHANGES"], projections: ["pr_entity", "commit_entities", "graph", "freshness", "search", "llm"] },
    merged_pr: { source_event: "PR merged", affected_entity_ids: ["PR:<number>", "COMMIT:<merge_sha>", "ISSUE:<linked>"], affected_relationships: ["MERGED_AS", "RESOLVES", "HISTORICAL_STATE"], projections: ["pr_entity", "issue_entity", "graph", "timeline", "freshness"] },
    closed_issue: { source_event: "issue closed/reopened", affected_entity_ids: ["ISSUE:<number>"], affected_relationships: ["STATE_TRANSITION"], projections: ["issue_entity", "graph", "timeline", "freshness", "search", "llm"] },
  },
  execution_contract: ["capture source event read-only", "resolve deterministic entity IDs", "append temporal evidence", "rebuild affected relationships", "regenerate only affected projections", "run link/privacy/graph/LLM validation", "fail closed on missing or conflicting identity"],
  no_hooks_or_webhooks: true,
};
writeFileSync(join(out, "INCREMENTAL-SYNC-DESIGN.json"), JSON.stringify(incremental, null, 2) + "\n");

const discussionQuality = [];
for (const item of [...allIssues, ...allPrs]) {
  const texts = [{ type: item.pull_requests ? "ISSUE" : "PR", id: item.number, body: item.body, url: item.html_url }, ...(item.comments || []).map(comment => ({ type: comment.kind, id: comment.id, body: comment.body, url: comment.html_url })), ...(item.reviews || []).map(review => ({ type: "REVIEW", id: review.id, body: review.body, url: review.html_url }))];
  for (const text of texts) {
    const claims = [];
    if (/root cause|therefore|proves|guarantee|secure|vulnerab/i.test(text.body || "")) claims.push("CLAIM_REQUIRES_SOURCE_CORROBORATION");
    if (/ignore previous|system message|instructions|run this command|secret|token/i.test(text.body || "")) claims.push("PROMPT_INJECTION_OR_OPERATIONAL_INSTRUCTION_REVIEW");
    if (claims.length) discussionQuality.push({ type: text.type, id: text.id, url: text.url, flags: claims, policy: "Flag for review; do not treat discussion text as executable or authoritative source code." });
  }
}
writeFileSync(join(out, "DISCUSSION-QUALITY.json"), JSON.stringify({ generated_at: capture.captured_at, source, records: discussionQuality, count: discussionQuality.length }, null, 2) + "\n");
console.log(JSON.stringify({ generated_at: capture.captured_at, canonical_entities: canonicalEntities.length, canonical_relationships: canonicalRelationships.length, freshness_affected: freshness.affected_entities.length, findings: findingReconciliation.length, temporal_events: temporalEvents.length, discussion_flags: discussionQuality.length }, null, 2));
