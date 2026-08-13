import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const outDir = resolve(root, "planning/phase-c");
mkdirSync(outDir, { recursive: true });
const hash = value => createHash("sha1").update(String(value)).digest("hex").slice(0, 16);
const safe = value => String(value || "").replaceAll("\\", "/");
const run = (cwd, args, fallback = "") => {
  try { return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 128 * 1024 * 1024 }); } catch { return fallback; }
};
const repos = [
  { id: "Alot1z/Ix-findings", path: root },
  { id: "ix-infrastructure/Ix", path: "E:/E-github-repos/Ix" },
  { id: "Alot1z/Ix-remap", path: "E:/E-github-repos/Ix-remap" },
  { id: "Alot1z/Ix-mcp", path: "E:/E-github-repos/Ix-mcp" },
  { id: "ix-infrastructure/ix-compass-dist", path: "E:/E-github-repos/ix-compass-dist" },
];
const capture = JSON.parse(readFileSync(resolve(root, "planning/phase-c/GITHUB-LIVE-CAPTURE.json"), "utf8"));
const githubReviewers = new Map((capture.repositories || []).flatMap(repo => (repo.pull_requests || []).flatMap(pr => [
  ...(pr.reviews || []).map(review => [review.author?.login, review.author]),
  ...(pr.comments || []).map(comment => [comment.author?.login, comment.author]),
].filter(([login]) => login)).map(([login, person]) => [login, person])));

function parseLog(repo) {
  const marker = "\x1e";
  const field = "\x1f";
  const text = run(repo.path, ["log", "--all", "--date=iso-strict", "--no-renames", `--format=COMMIT${marker}%H${field}%P${field}%an${field}%ae${field}%cn${field}%ce${field}%aI${field}%cI${field}%s${marker}`, "--numstat"]);
  const commits = [];
  for (const block of text.split(`COMMIT${marker}`).slice(1)) {
    const [header, ...statLines] = block.split(marker);
    if (!header) continue;
    const parts = header.trim().split(field);
    const [sha, parents = "", authorName, authorEmail, committerName, committerEmail, authoredAt, committedAt, subject] = parts;
    if (!/^[0-9a-f]{40}$/.test(sha)) continue;
    const files = statLines.flatMap(line => line.split(/\r?\n/).map(row => {
      const match = row.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
      if (!match) return null;
      return { additions: match[1] === "-" ? 0 : Number(match[1]), deletions: match[2] === "-" ? 0 : Number(match[2]), path: match[3] };
    }).filter(Boolean));
    commits.push({ sha, parents: parents.trim() ? parents.trim().split(/\s+/) : [], author: { name: authorName, email: authorEmail }, committer: { name: committerName, email: committerEmail }, authored_at: authoredAt, committed_at: committedAt, subject: subject || "", files });
  }
  return commits;
}
function branchRefs(repo) {
  return run(repo.path, ["for-each-ref", "--format=%(refname)\t%(objectname)\t%(symref)", "refs/heads", "refs/remotes"]).split(/\r?\n/).filter(Boolean).map(line => {
    const [ref, sha, symref] = line.split("\t");
    return { ref, name: ref.replace(/^refs\/(heads|remotes)\//, ""), sha, symref: symref || null, url: `https://github.com/${repo.id}/tree/${ref.replace(/^refs\/(heads|remotes)\/(origin|fork)\//, "")}` };
  });
}
function tags(repo) {
  return run(repo.path, ["for-each-ref", "--format=%(refname:short)\t%(objectname)", "refs/tags"]).split(/\r?\n/).filter(Boolean).map(line => { const [name, sha] = line.split("\t"); return { name, sha, url: `https://github.com/${repo.id}/releases/tag/${encodeURIComponent(name)}` }; });
}
function codeowners(repo) {
  const candidates = run(repo.path, ["ls-tree", "-r", "--name-only", "HEAD"]).split(/\r?\n/).filter(name => /(^|\/)CODEOWNERS$/i.test(name));
  const records = [];
  for (const path of candidates) {
    const content = run(repo.path, ["show", `HEAD:${path}`]);
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*(\S+)\s+(.+)$/);
      if (!match || match[1].startsWith("#")) continue;
      const owners = match[2].split(/\s+/).filter(token => token.startsWith("@")).map(token => token.replace(/^@/, ""));
      if (owners.length) records.push({ repository: repo.id, path_pattern: match[1], owners, source_path: path, source_ref: `https://github.com/${repo.id}/blob/HEAD/${path}` });
    }
  }
  return records;
}
const allCommits = [];
const allFiles = new Map();
const branchRecords = [];
const tagRecords = [];
const ownership = [];
const relationships = [];
const cochange = new Map();
const commitBySha = new Map();
for (const repo of repos.filter(r => existsSync(join(r.path, ".git")) || existsSync(join(r.path, ".git")))) {
  const commits = parseLog(repo);
  const branches = branchRefs(repo);
  const repoTags = tags(repo);
  const owners = codeowners(repo);
  branchRecords.push(...branches.map(branch => ({ ...branch, repository: repo.id, entity_id: `BRANCH-${hash(`${repo.id}:${branch.name}`)}` })));
  tagRecords.push(...repoTags.map(tag => ({ ...tag, repository: repo.id, entity_id: `TAG-${hash(`${repo.id}:${tag.name}`)}` })));
  ownership.push(...owners);
  for (const commit of commits) {
    const commitEntity = `COMMIT-${commit.sha}`;
    const record = { ...commit, repository: repo.id, entity_id: commitEntity, url: `https://github.com/${repo.id}/commit/${commit.sha}`, provenance_class: "LOCAL_GIT_FACT" };
    commitBySha.set(commit.sha, record);
    allCommits.push(record);
    for (const parent of commit.parents) relationships.push({ from: commitEntity, to: `COMMIT-${parent}`, type: "PARENT", confidence: "HIGH", method: "git-log-parent-list", source_commits: [commit.sha], observed_at: commit.committed_at, provenance_class: "LOCAL_GIT_FACT" });
    const revert = commit.subject.match(/revert(?:s|ed)?[^\n]*?\b([0-9a-f]{7,40})\b/i);
    if (revert) relationships.push({ from: commitEntity, to: `COMMIT-${revert[1]}`, type: "REVERTS", confidence: "MEDIUM", method: "commit-subject-token", source_commits: [commit.sha, revert[1]], observed_at: commit.committed_at, provenance_class: "LOCAL_GIT_FACT" });
    const fileIds = [];
    // Analyze source/configuration history, not generated public projections or
    // Phase-C output. Generated artifacts create noisy hotspots and can contain
    // abbreviated historical IDs that are not commit identities.
    for (const file of commit.files.filter(file => !/^(planning\/pages\/public|planning\/wiki\/data|knowledge\/|planning\/phase-|planning\/discovery)/.test(file.path))) {
      const fileKey = `${repo.id}:${file.path}`;
      const fileId = `FILE-${hash(fileKey)}`;
      fileIds.push(fileId);
      if (!allFiles.has(fileKey)) allFiles.set(fileKey, { entity_id: fileId, repository: repo.id, path: file.path, url: `https://github.com/${repo.id}/blob/HEAD/${file.path}`, commit_count: 0, additions: 0, deletions: 0, contributors: new Map(), source_commits: [] });
      const aggregate = allFiles.get(fileKey);
      aggregate.commit_count += 1; aggregate.additions += file.additions; aggregate.deletions += file.deletions; aggregate.source_commits.push(commit.sha);
      const author = commit.author.name || commit.author.email;
      aggregate.contributors.set(author, (aggregate.contributors.get(author) || 0) + 1);
      relationships.push({ from: commitEntity, to: fileId, type: "CHANGES", confidence: "HIGH", method: "git-log-numstat", source_commits: [commit.sha], additions: file.additions, deletions: file.deletions, observed_at: commit.committed_at, provenance_class: "LOCAL_GIT_FACT" });
    }
    for (let i = 0; i < fileIds.length; i += 1) for (let j = i + 1; j < fileIds.length; j += 1) {
      const pair = [fileIds[i], fileIds[j]].sort().join("|");
      const item = cochange.get(pair) || { from: fileIds[i], to: fileIds[j], type: "CO_CHANGED_WITH", count: 0, source_commits: [], observed_at: commit.committed_at };
      item.count += 1; item.source_commits.push(commit.sha); item.observed_at = commit.committed_at; cochange.set(pair, item);
    }
  }
}
for (const relationship of relationships) if (!commitBySha.has(relationship.to.replace(/^COMMIT-/, "")) && relationship.to.startsWith("COMMIT-")) relationship.status = "UNKNOWN_PARENT_NOT_PRESENT_IN_CAPTURE";
const files = [...allFiles.values()].map(file => ({ ...file, contributors: [...file.contributors.entries()].map(([name, count]) => ({ name, count })), source_commits: [...new Set(file.source_commits)] }));
const cochanged = [...cochange.values()].filter(item => item.count >= 2).map(item => ({ ...item, confidence: item.count >= 5 ? "MEDIUM" : "LOW", derivation: "same-commit-statistical-co-change; not a semantic dependency", source_commits: [...new Set(item.source_commits)] }));
const revertRelationships = relationships.filter(r => r.type === "REVERTS");
const hotspots = files.map(file => ({ entity_id: file.entity_id, repository: file.repository, path: file.path, metrics: { commit_frequency: file.commit_count, additions: file.additions, deletions: file.deletions, churn: file.additions + file.deletions, contributor_count: file.contributors.length, related_pr_count: 0, related_issue_count: 0, recent_activity: file.source_commits.slice(0, 10).length }, interpretation: "HOTSPOT_SIGNAL_ONLY", provenance: { method: "git-log-numstat-aggregate", source_commits: file.source_commits, confidence: "HIGH" } })).sort((a, b) => (b.metrics.churn + b.metrics.commit_frequency) - (a.metrics.churn + a.metrics.commit_frequency));
const githubPeople = [...githubReviewers.values()];
const ownershipModel = ownership.map(record => ({ ...record, evidence_type: "CODEOWNERS", role: "OWNER_SIGNAL", confidence: "HIGH", note: "CODEOWNERS is authoritative for this path-pattern signal; it does not prove organizational ownership outside the file." }));
for (const file of files) for (const contributor of file.contributors) ownershipModel.push({ repository: file.repository, path_pattern: file.path, owner: contributor.name, role: "CONTRIBUTOR_SIGNAL", confidence: contributor.count >= 3 ? "MEDIUM" : "LOW", evidence_type: "REPEATED_COMMIT_AUTHorship", commit_count: contributor.count, source_commits: file.source_commits });
for (const person of githubPeople) ownershipModel.push({ repository: "ix-infrastructure/Ix", owner: person.login, role: "REVIEWER_SIGNAL", confidence: "MEDIUM", evidence_type: "REVIEW_OR_COMMENT_ACTIVITY", source: "planning/phase-c/GITHUB-LIVE-CAPTURE.json" });
const userSignals = [];
for (const commit of allCommits.filter(c => c.author.name === "Alot1z" || c.committer.name === "Alot1z")) userSignals.push({ type: "COMMIT_AUTHORED_OR_COMMITTED", repository: commit.repository, sha: commit.sha, url: commit.url, identity_match: "LOCAL_NAME_ONLY", provenance_class: "LOCAL_GIT_IDENTITY_ONLY", note: "Email identity is not treated as verified account linkage." });
for (const repo of capture.repositories || []) for (const pr of repo.pull_requests || []) if (pr.author?.login === "Alot1z") userSignals.push({ type: "PR_AUTHORED", repository: repo.repository, number: pr.number, url: pr.html_url, identity_match: "OFFICIAL_GITHUB_LOGIN", provenance_class: "OFFICIAL_GITHUB_FACT" });
for (const repo of capture.repositories || []) for (const pr of repo.pull_requests || []) for (const comment of [...(pr.comments || []), ...(pr.review_comments || []), ...(pr.reviews || [])]) if (comment.author?.login === "Alot1z") userSignals.push({ type: comment.kind || (comment.state ? "REVIEW_AUTHORED" : "COMMENT_AUTHORED"), repository: repo.repository, pr: pr.number, id: comment.id, url: comment.html_url, identity_match: "OFFICIAL_GITHUB_LOGIN", provenance_class: "OFFICIAL_GITHUB_FACT" });
const output = {
  generated_at: new Date().toISOString(),
  source: "Local Git repositories; read-only git history and public GitHub review identities",
  repositories: repos.map(r => ({ repository: r.id, path: r.path, commit_count: allCommits.filter(c => c.repository === r.id).length })),
  commits: allCommits,
  files,
  branches: branchRecords,
  tags: tagRecords,
  relationships: [...relationships, ...cochanged],
  revert_relationships: revertRelationships,
  supersedes_relationships: [],
  cochange_relationships: cochanged,
  limitations: ["No verified rewrite/rebase relationship inferred from local history alone.", "Hotspots are signals, not defect claims.", "Ownership is evidence-backed signals, not a blanket OWNER assertion."],
};
writeFileSync(join(outDir, "GIT-INTELLIGENCE.json"), JSON.stringify(output, null, 2) + "\n");
writeFileSync(join(outDir, "HOTSPOT-ANALYSIS.json"), JSON.stringify({ generated_at: output.generated_at, source: output.source, hotspots, interpretation: "A hotspot indicates change concentration only; it is not evidence of bad architecture." }, null, 2) + "\n");
writeFileSync(join(outDir, "OWNERSHIP-MODEL.json"), JSON.stringify({ generated_at: output.generated_at, source: output.source, signals: ownershipModel, role_policy: { AUTHOR: "commit metadata", COMMITTER: "commit metadata", CONTRIBUTOR: "repeated commits", REVIEWER: "review/comment metadata", MAINTAINER: "UNKNOWN unless authoritative repository evidence", OWNER: "CODEOWNERS or explicit repository evidence only" } }, null, 2) + "\n");
writeFileSync(join(outDir, "USER-ACTIVITY.json"), JSON.stringify({ generated_at: output.generated_at, authenticated_login: capture.authenticated_user?.login || null, signals: userSignals, policy: "Do not equate a local name/email with an official GitHub account without GitHub-authoritative linkage." }, null, 2) + "\n");
console.log(JSON.stringify({ generated_at: output.generated_at, commits: allCommits.length, files: files.length, branches: branchRecords.length, tags: tagRecords.length, relationships: output.relationships.length, cochange: cochanged.length, hotspots: hotspots.length, ownership_signals: ownershipModel.length, user_signals: userSignals.length }, null, 2));
