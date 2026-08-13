// Repeatable purged-SHA audit for the canonical knowledge layer.
//
// Commits physically purged from the local clones (see knowledge/purged-commits.json)
// must never appear in a live/current position anywhere in the canonical graph or
// the live GitHub capture. This audit fails when a purged SHA shows up as:
//   1. a live-status entity's metadata (outside labeled provenance keys) or summary;
//   2. a non-HISTORICAL relationship endpoint;
//   3. a live-capture field — implementation file refs, implementation head/commit
//      refs, open-PR heads, or captured fork-branch heads;
//   4. a COMMIT-<purged> entity that is not HISTORICAL (or absent).
// Labeled provenance (historical_sha, superseded_at, historical_note, ...) and
// HISTORICAL records are deliberately exempt: they document what existed, not
// what is current.
//
// Pure function — no file I/O. The freshness gate feeds it the canonical
// entities/relationships and the live capture; the deterministic tests feed it
// fixtures. Run the gate with `node knowledge/freshness-gate.mjs` and the
// deterministic cases with `node knowledge/freshness-gate.test.mjs`.

export const PROVENANCE_KEYS = new Set([
  "historical_sha", "superseded_at", "historical_manifest_state", "historical_dirty",
  "historical_note", "legacy_status", "legacy_related_issues", "legacy_related_prs", "provenance",
  "historical", "manifest_sha", "old_sha", "pre_strip_sha",
]);

export const LIVE_STATUSES = new Set([
  "CURRENT", "OPEN", "PR_OPEN", "IMPLEMENTED", "CONTRIBUTE_AFTER_REWORK", "IN_PROGRESS",
]);

export function auditPurgedShas({ entities = [], relationships = [], live = {}, purgedShas = [] } = {}) {
  const problems = [];
  const add = (id, message) => problems.push({ id, message });
  const isPurged = value => Boolean(value && purgedShas.some(p => String(value).includes(p)));

  // 1) Live-status entities: purged SHAs in metadata (non-provenance) or summaries.
  for (const entity of entities) {
    if (!LIVE_STATUSES.has(entity.status)) continue;
    const meta = entity.metadata || {};
    for (const [key, value] of Object.entries(meta)) {
      if (PROVENANCE_KEYS.has(key)) continue;
      if (isPurged(value)) add(`entity:${entity.canonical_id}:${key}`, `live entity ${entity.canonical_id} [${entity.status}] holds a purged SHA in metadata.${key}`);
    }
    const summaries = `${entity.human_summary || ""} ${entity.deep_summary || ""}`;
    if (isPurged(summaries)) add(`entity:${entity.canonical_id}:summary`, `live entity ${entity.canonical_id} [${entity.status}] mentions a purged SHA in its summary`);
  }

  // 2) Relationships referencing a purged SHA must be HISTORICAL.
  for (const rel of relationships) {
    if (rel.status === "HISTORICAL") continue;
    if (isPurged(rel.from) || isPurged(rel.to)) {
      const id = rel.relationship_id || `${rel.from}-${rel.type}-${rel.to}`;
      add(`rel:${id}`, `relationship ${rel.from} -${rel.type}-> ${rel.to} references a purged SHA and is not HISTORICAL`);
    }
  }

  // 3) Live capture fields.
  for (const impl of live.implementations || []) {
    for (const file of impl.files || []) {
      if (isPurged(file.commit)) add(`impl:${impl.id}:file`, `implementation ${impl.id} file ref ${file.path} pins purged commit ${file.commit}`);
    }
    if (isPurged(impl.head_sha)) add(`impl:${impl.id}:head`, `implementation ${impl.id} head_sha is a purged commit (${impl.head_sha})`);
    for (const ref of impl.commit_refs || []) {
      if (isPurged(ref)) add(`impl:${impl.id}:commit_ref`, `implementation ${impl.id} commit_ref lists purged commit ${ref}`);
    }
  }
  for (const pr of live.open_pull_requests || []) {
    if (isPurged(pr.head_sha)) add(`pr:${pr.number}:head`, `open PR #${pr.number} head_sha is a purged commit (${pr.head_sha})`);
  }
  for (const [repo, branches] of Object.entries(live.fork_branches || {})) {
    for (const [branch, sha] of Object.entries(branches || {})) {
      if (isPurged(sha)) add(`branch:${repo}:${branch}`, `fork branch ${repo}:${branch} head is a purged commit (${sha})`);
    }
  }

  // 4) COMMIT-<purged> graph entities must be HISTORICAL (or absent).
  const commitStatus = new Map(entities.filter(entity => entity.entity_type === "COMMIT").map(entity => [entity.canonical_id, entity.status]));
  for (const p of purgedShas) {
    if (String(p).length < 7) continue;
    const status = commitStatus.get(`COMMIT-${p}`);
    if (status && status !== "HISTORICAL") {
      add(`commit:${p}`, `COMMIT-${p} entity status is ${status}; purged commits must be HISTORICAL, not ${status}`);
    }
  }

  return { problems, count: problems.length };
}
