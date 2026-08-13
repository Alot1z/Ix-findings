# Living GitHub Engineering Knowledge Graph — Discovery Report

> Status: DISCOVERY ONLY — no implementation performed. Prepared for approval.
> Classification per spec §28: each section separates **Observed** (what exists),
> **Derived** (reliable inference), **Proposed** (what to build), **Unknown** (needs
> more investigation). Everything here is grounded in evidence gathered 2026-08-12.

---

## 0. Method & evidence

This report was produced with parasite-skill as the execution layer (routing +
capability discovery) and read-only investigation of:

- The installed parasite-skill ecosystem (`~/.agents/skills/`, registry, ecosystem.json)
- Local clones: `Ix` (fork of `ix-infrastructure/Ix`), `Ix-mcp`, `Ix-remap`, `Ix-test`, `ix-compass-dist`, `Ix-findings`
- The existing Ix-findings canonical knowledge layer (`knowledge/*.json`, ontology, freshness gate, LLM corpus)
- Live GitHub API (`gh`): `oil-oil/oil-motion`, `ix-infrastructure/Ix`
- Web research: OpenKB, Repowise, Anydoc

**No commits, pushes, PRs, issues, or GitHub writes were performed.**

---

## 1. Repository inventory

### Verified (via local clones + GitHub API)

| Repo | Role | URL | Branch observed | Evidence |
|---|---|---|---|---|
| ix-infrastructure/Ix | upstream source | github.com/ix-infrastructure/Ix | main | `gh repo view` |
| Alot1z/Ix | user fork | github.com/Alot1z/Ix | feat/ix-agent-skill | `git remote -v` (fork), branch |
| Ix-mcp (worktree) | fork worktree | — | feat/ix-mcp | `git remote -v` |
| Ix-remap (worktree) | fork worktree | — | feat/ix-remap-hardening | `git remote -v` |
| Ix-test (worktree) | fork worktree | — | — | `git remote -v` |
| ix-infrastructure/ix-compass-dist | distribution | github.com/ix-infrastructure/ix-compass-dist | main | `git remote -v` |
| Alot1z/Ix-findings | investigation ledger + knowledge base | github.com/Alot1z/Ix-findings | master | local clone, published site |
| oil-oil/oil-motion | spec-listed start point | github.com/oil-oil/oil-motion | main | `gh repo view` (Python, "interactive web animations") |

### Possible (derived, not yet verified)

- `ix-infrastructure/system-compass` — referenced in Ix-findings data as PRIVATE/404; not confirmed accessible.
- Any other repos reachable via cross-links in Ix issues/PRs/comments (not yet enumerated).

**UNKNOWN:** the exact upstream relationship of `oil-oil/oil-motion` to the IX/Compass
ecosystem. It is Python and describes web animations; nothing in the local IX evidence
references it. Per spec §4, the ecosystem list must be derived from repository evidence,
not assumed — this requires cross-reference mining of Ix issues/PRs/docs.

---

## 2. Repository relationship map

### Verified

- `Alot1z/Ix` is a **fork** of `ix-infrastructure/Ix` (verified via `git remote`).
- `Ix-mcp`, `Ix-remap`, `Ix-test` are worktrees/branches of the same fork (verified via remotes).
- `ix-compass-dist` is a separate upstream repo (not a fork of Ix).
- `Ix-findings` is an independent ledger repo (investigation + published knowledge site).

### Derived

- The IX ecosystem is fork-centric: one upstream + one user fork + multiple feature
  branches/worktrees — exactly the shape where cross-branch and cross-repo
  relationship mining matters (a PR on `feat/ix-mcp` references commits on the fork
  that exist on no other branch).

### Proposed

A `REPOSITORY --FORK_OF--> REPOSITORY`, `BRANCH --PART_OF--> REPOSITORY`,
`BRANCH --DERIVED_FROM--> BRANCH` subgraph (already partially present in the 34-type
ontology, see §6).

---

## 3. Current architecture (IX tooling)

### Observed (local clone of ix-infrastructure/Ix)

```
ix-infrastructure/Ix/
  AGENTS.md, CLAUDE.md, CONTRIBUTING.md, SECURITY.md, LICENSE
  core-ingestion/     ← ingestion layer
  ix-cli/             ← CLI
  scripts/            ← bootstrap (bash + powershell)
  skills/             ← agent skills
  tasks/
  dist/
  docker-compose.standalone.yml  ← ArangoDB standalone backend
  package.json        ← Node package
  homebrew/ Formula
```

### Observed (ix skill, installed via parasite-skill)

- tree-sitter parsing across **26 languages**; persistent symbol/call/import graph
  stored in a local backend (**ArangoDB via Docker**).
- CLI surface: `ix map / explain / trace / impact / search / rank / smells`.
- Skill contract: structural, graph-backed answers (callers/callees/imports/blast
  radius/hotspots); explicitly NOT for prose/history questions.

### Derived

- The project already has a working **code-level** graph engine (Ix) and a separate
  **knowledge-level** graph (Ix-findings). The two are complementary: Ix = live
  structure; Ix-findings = semantic/provenance layer over the ecosystem.

### Proposed

Use Ix as one ingestion capability (code structure) feeding the knowledge graph,
not as the graph itself — per the spec's §8 boundary.

---

## 4. Git/GitHub data inventory

### Observed (Ix-findings knowledge layer)

- `knowledge/entities.json` — **570 entities**, fields: `canonical_id, entity_type,
  canonical_name, aliases, status, confidence, human_summary, deep_summary,
  evidence_ids, source_refs, temporal, llm, metadata, related_entities`.
- `knowledge/relationships.json` — **1008 typed relationships**, fields:
  `relationship_id, from, to, type, confidence (HIGH/MEDIUM/LOW/UNKNOWN), status
  (CURRENT/HISTORICAL), source_refs, evidence_ids`.
- `knowledge/evidence.json`, `contradictions.json`, `decisions.json`, `phases.json`,
  `aliases.json`, `indexes.json`, `agents.json`, `sources.json`.
- `knowledge/ontology.json` — **34 entity types**, **50 relationship types**,
  evidence classes, status values, confidence values, temporal model, entity and
  relationship contracts, source-of-truth and privacy rules.
- `knowledge/freshness-gate.mjs` + `purged-sha-audit.mjs` — live-GitHub freshness
  gate and purged-SHA audit (repeatable, CI-wired).
- `knowledge/llm/` — `manifest.json`, `entity-index.json`, `traversal-index.json`;
  `KNOWLEDGE-GRAPH-LLM-GUIDE.md` defines a traversal algorithm.
- Temporal model: `valid_from, valid_until, observed_at, verified_at, introduced_by,
  fixed_by`; rule: *never infer an exact date or current state from an undated
  historical artifact*.

### Observed (published site)

- `planning/pages/public/` — 584 routes, 555 entity pages + `data.json`, `llms.txt`,
  `llms-full.txt` (structured `ENTITY` blocks), `graph.json`, `sitemap.xml`,
  `robots.txt`, 19 JSON indexes; `verify-live.mjs` smoke test; Pages workflow with
  build → validate → deploy → verify jobs.

### Derived

The canonical knowledge model already implements most of the spec's §5–§8 demands:
typed entities/relationships, provenance (`source_refs`, `evidence_ids`), confidence
classes, temporal states, contradictions, and an LLM-queryable corpus. The gap is
**depth of GitHub collaboration data** (comments, reviews, discussions), **git
intelligence** (co-change, ownership, hotspots), and **incremental sync**.

---

## 5. Existing documentation

### Observed

- `knowledge/KNOWLEDGE-GRAPH-README.md`, `KNOWLEDGE-GRAPH-LLM-GUIDE.md`,
  `DATA-QUALITY-REPORT.md`, `PHASE-16-REPORT.md`, `knowledge/manifest.json`.
- `planning/` — per-domain docs: `overview/`, `git/`, `github/`, `maps/` (JSON maps),
  `phases/`, `findings/`, `evidence/`, `decisions/`, `suggestions/`, `security/`,
  `repositories/`, `final/` (MASTER-REPORT, EXECUTIVE-SUMMARY, AI-BRIEFING-PROMPT,
  FINAL-DECISIONS, NEXT-ACTIONS, REMAINING-BLOCKERS).
- Upstream `ix-infrastructure/Ix` docs: README, CLAUDE.md, SECURITY.md, CONTRIBUTING.md, docs/.

### Proposed

Consolidate these into the "GitHub-native" documentation pages the spec wants
(`/architecture`, `/decisions`, `/stale`, `/conflicts` …), generated from the
canonical model — not hand-maintained copies.

---

## 6. Existing graph/knowledge infrastructure

### Observed (Ix-findings canonical layer)

- **Entity types (34):** REPOSITORY, PROJECT, COMPONENT, FEATURE, BUG, FINDING,
  OBSERVATION, HYPOTHESIS, EVIDENCE, REPRODUCTION, TEST, SECURITY_FINDING,
  CANDIDATE, SUGGESTION, DECISION, IMPLEMENTATION, COMMIT, BRANCH, ISSUE,
  PULL_REQUEST, REVIEW, COMMENT, RELEASE, VERSION, ARTIFACT, SPECIFICATION,
  DOCUMENT, AGENT_ANALYSIS, PHASE, PR_PACKET, BLOCKER, CONTRADICTION, SOURCE, UNKNOWN.
- **Relationship types (50):** FOUND_IN, AFFECTS, OBSERVED_IN, REPRODUCED_BY,
  SUPPORTED_BY, CONTRADICTED_BY, DERIVED_FROM, EVIDENCED_BY, IMPLEMENTED_BY,
  FIXED_BY, INTRODUCED_BY, REMOVED_BY, CHANGED_BY, SUPERSEDES, SUPERSEDED_BY,
  DUPLICATES, DUPLICATED_BY, BLOCKED_BY, DEPENDS_ON, ENABLES, REQUIRES,
  RELATED_TO_ISSUE, RELATED_TO_PR, RELATED_TO_COMMIT, REFERENCES, RESPONDS_TO,
  DISCUSSED_IN, REVIEWED_BY, TESTED_BY, VALIDATED_BY, REJECTED_BY, ACCEPTED_BY,
  DEFERRED_BY, DISCOVERED_IN, ANALYZED_IN, APPLIES_TO, AFFECTS_VERSION,
  AFFECTS_REPOSITORY, AFFECTS_COMPONENT, PART_OF, GENERATED_FROM,
  DERIVED_FROM_ARTIFACT, PRESENTED_AS, SNAPSHOT_OF, CURRENT_STATE_OF,
  HISTORICAL_STATE_OF, HAS_ALIAS, HAS_SOURCE, HAS_EVIDENCE, HAS_RELATIONSHIP.
- **Confidence:** HIGH / MEDIUM / LOW / UNKNOWN.
- **Status:** CURRENT / HISTORICAL (plus per-entity status values).

### Gap analysis (derived)

The ontology already covers the spec's schema demands (spec §9's node/edge lists
map onto it almost 1:1). Missing/weak areas:

| Spec demand | Current state | Gap |
|---|---|---|
| Person / Team / ownership | no PERSON entity type | add PERSON, AUTHORED_BY, OWNED_BY, REVIEWED_BY(person) |
| Co-change analysis | no CO_CHANGED_WITH | derive from git history |
| Hotspots / smells | Ix CLI produces them | not ingested into knowledge graph |
| Comments/reviews detail | COMMENT, REVIEW types exist | no review-comment granularity / threading |
| Releases/tags detail | RELEASE, VERSION exist | sparse |
| Incremental sync | freshness gate only | no event-driven partial updates |

---

## 7. Existing agent infrastructure

### Observed (parasite-skill ecosystem — execution layer)

- **88 skills** installed under `~/.agents/skills/`, registered in
  `~/.agents/skills/.parasite-skill/registry.json`.
- **Relevant skill inventory** (full 88-skill list captured in `ecosystem.json`):
  - Repository/code analysis: `ix`, `understand`, `code-review-graph`, `knip`,
    `gitingest`, `graphify`, `improve-codebase-architecture`, `source-driven-development`
  - Git/GitHub: `git-workflow-and-versioning`, `github-stars-manager`,
    `github-actions-docs`, `using-git-worktrees`, `research`
  - Documentation/knowledge: `documentation-writer`, `documentation-and-adrs`,
    `readme-skill`, `api-docs-skill`, `web-reader`, `find-docs`, `deepwiki`, `context7`
  - Verification/review/security: `verification-before-completion`,
    `code-review-and-quality`, `security-and-hardening`, `debug-thinking`,
    `doubt-driven-development`, `test-driven-development`, `tdd`
  - Planning/build: `spec-driven-development`, `writing-plans`,
    `planning-and-task-breakdown`, `incremental-implementation`,
    `brainstorming`, `api-and-interface-design`, `system-connector`, `mcp-builder`,
    `ci-cd-and-automation`, `observability-and-instrumentation`
  - Thinking: `tractatus-thinking`, `sequential-thinking`, `debug-thinking`,
    `context-engineering`, `stop-slop`
  - Multimodal: `qwen-mm-plugins` (+ core/api) — **not used in this phase** (per user instruction)
- **23 skill-sets**, **13 clients installed** (Claude Code, Codex, OpenCode, …),
  **0 MCP servers registered**, **5 rule files**, **0 extensions**.

### Observed (agent integration surfaces)

- `parasite-skill` CLI: scan/route/plan/validate/refs/wikis/link/sets/agents/export;
  upstream documents `tools list|describe|run|run-batch|dry-run|audit|verify` and
  `agents` profiles — **UNKNOWN** whether the locally installed build exposes the
  `tools`/`agents` subcommands (not exercised this phase; `--help` inspection pending).

### Derived

- The execution substrate is mature and broad. For this project the high-value
  reuse set is: `ix` (code graph), `code-review-graph` (symbols), `understand`,
  `gitingest` (corpus dump), `github-stars-manager` (GitHub state), `research`
  (external projects), `documentation-writer`/`readme-skill` (doc generation),
  `verification-before-completion` (gates), `security-and-hardening` (prompt-injection
  hardening), `spec-driven-development` + `writing-plans` (the phases of this project).

---

## 8. Existing hooks/MCP/skills relevant to the target

### Observed

- No MCP servers are currently registered in any client config (per ecosystem.json).
- The `ix` skill requires a local backend (ArangoDB/Docker) — a heavy but real
  capability.
- `mcp-builder` and `system-connector` skills exist for building MCP bridges.

### Proposed (see §15–§17)

An MCP server exposing the canonical knowledge graph (query/traverse/search/provenance)
is the single highest-value agent interface, mirroring Repowise's "10 task-shaped MCP
tools" but backed by the Ix-findings canonical model.

---

## 9. Findings/commits/PRs/comments model

### Observed

- FINDING, EVIDENCE, HYPOTHESIS, OBSERVATION, DECISION, SUGGESTION, CANDIDATE,
  BLOCKER, CONTRADICTION are first-class entity types with `source_refs`,
  `evidence_ids`, `human_summary`, `deep_summary`, `llm.uncertainties`, `confidence`,
  `status`, `temporal`.
- COMMIT, BRANCH, ISSUE, PULL_REQUEST, REVIEW, COMMENT exist as types with typed
  relations (RELATED_TO_ISSUE/PR/COMMIT, DISCUSSED_IN, RESPONDS_TO, REVIEWED_BY).
- `contradictions.json` preserves contested statements rather than resolving them.

### Derived

The spec's §6 demand ("my findings are first-class knowledge") is already largely
met. The missing piece is **comment/review body capture at scale** and
**author/ownership attribution** (PERSON entities).

---

## 10. External project research

### OpenKB (VectifyAI/OpenKB) — researched via web

- **Observed:** "Open LLM Knowledge Base"; ships a SKILL.md so agents can read the
  compiled wiki (Claude Code: `/plugin`); two layers: wiki foundation (compiles and
  maintains knowledge) + generators (query/chat/Skill Factory). Karpathy "LLM wiki"
  lineage: compile once → keep current as sources are added → cross-references.
- **Adopt:** the *compile-once, cross-reference, stale-removal* philosophy (already
  mirrored in Ix-findings' freshness gate and LLM guide).
- **Reject:** wholesale import — Ix-findings has a stronger typed-ontology +
  provenance model than a markdown wiki.

### Repowise (repowise-dev/repowise) — researched via web

- **Observed:** indexes a codebase into four intelligence layers — dependency graph
  (tree-sitter, 14 languages, two-tier file/symbol), git history, auto-generated
  documentation, architectural decisions; ~10 task-shaped MCP tools; self-hosted;
  ownership maps, dead-code detection, hotspots, C4 views; auto-sync + hooks.
- **Adopt:** the *four-layer indexing + MCP tool surface + auto-sync hooks* pattern;
  the two-tier (file → symbol) dependency graph.
- **Adapt:** replace its proprietary/graph store with the Ix-findings canonical JSON
  model (self-hosted, no SaaS); reuse its MCP *shapes* not its code.
- **Risk:** Repowise is young (recent activity); its docs/wiki generation may be
  LLM-heavy without the provenance discipline Ix-findings requires.

### Anydoc (firecrawl/anydoc) — researched via web

- **Observed:** Rust-based local document parser converting 14 formats (PDF, DOCX,
  PPTX, XLSX, ODT, RTF, EPUB, …) to clean Markdown; fast (ms-level); open source;
  embeddable via `/parse`.
- **Adopt:** as an optional ingestion adapter for non-code documents (specs, PDFs,
  Office files) into the knowledge layer. **Optional**, not core — the ecosystem's
  primary artifacts are code, git history, and GitHub objects, all already structured.

### Oil Motion (oil-oil/oil-motion)

- **Observed (live API):** Python repo, "Create smooth, responsive interactive web
  animations", default branch `main`. **No verified link to the IX/Compass ecosystem
  found in local evidence.**
- **UNKNOWN:** why the spec lists it as the start point. Pending cross-reference
  mining. Per §13, an ecosystem relationship may only be recorded if verified; if
  none is found, oil-motion stays out of the IX graph (execution context only).

---

## 11. Capability comparison matrix

| Requirement | Existing capability | Tool/skill | Evidence | Reuse | Custom needed |
|---|---|---|---|---|---|
| Repository mapping | Ix-findings REPOSITORY entities | knowledge graph + `gh` | 570 entities, maps/ | ✅ extend | — |
| Git history | COMMIT/BRANCH entities + freshness gate | knowledge layer, `git` | 1008 rels | ✅ extend | co-change derivation |
| GitHub issues | ISSUE entities, issuesIndex | knowledge layer, `gh` | issues/219… | ✅ | comment threading |
| PR analysis | PULL_REQUEST entities, PR_PACKET | knowledge layer | PR-393 | ✅ | review details |
| Comment analysis | COMMENT type | ontology | 34 types | ⚠️ shallow | review-comment capture |
| Code graph | Ix CLI (26 langs, ArangoDB) | `ix` skill | skill contract | ✅ | ingestion adapter |
| Architecture | COMPONENT/IMPLEMENTATION types | knowledge layer | AFFECTS_COMPONENT | ✅ | C4-style views |
| Documentation | generated site + LLM corpus | build-public.mjs | 584 routes | ✅ | GitHub-native pages |
| Graph generation | graph.json + entity pages | build pipeline | live 200s | ✅ | incremental |
| Search | search.json + in-page | build pipeline | verified | ✅ | agent-facing API |
| MCP | none registered | mcp-builder skill | 0 registered | ⚠️ | build MCP server |
| Verification | freshness gate, purged-SHA audit, validate-public, verify-live | 4 scripts | all passing | ✅ | event sync tests |
| Multimodal doc reading | qwen-mm-plugins | skill (core/api) | installed | ⚠️ optional | — (skipped per user) |

---

## 12. Proposed architecture (options, per spec §27)

### Option A — Extend the existing Ix-findings canonical layer (recommended)

Keep `knowledge/*.json` as the single source of truth. Add:
- PERSON/REVIEW_COMMENT entity types + AUTHORED_BY/CO_CHANGED_WITH/OWNED_BY edges
- a **Git intelligence module** (co-change, hotspots, ownership) fed by `git log`
  and Ix `rank/smells`
- a **GitHub collaboration ingestor** (issues/PRs/comments/reviews via `gh` API)
  that writes into the canonical layer incrementally
- an **MCP server** over the graph (query/traverse/search/provenance)
- GitHub-native docs pages generated from the model

**Pros:** zero new storage; builds on 570 entities / 1008 relations / provenance /
temporal / freshness that already exist; self-hosted by construction; incremental
updates are a natural extension of the freshness gate. **Cons:** JSON store needs
care for very large comment/co-change volumes.

### Option B — Relational DB + graph layer

Add SQLite/Postgres for bulk comment/review/co-change data, JSON stays as the
semantic layer. **Pros:** scales for high-volume collaboration data. **Cons:** two
stores to keep in sync; more moving parts; violates "no competing data models"
unless carefully layered.

### Option C — Graph DB (ArangoDB, reuse Ix backend)

Use the existing ArangoDB/Docker backend as the canonical store. **Pros:** real
traversal engine, scales. **Cons:** heavier ops; ties knowledge to the Ix runtime
backend; harder self-host story for read-only consumers.

### Option D — OpenKB-style compiled wiki + graph

Compile markdown wiki with cross-refs, plus the existing graph for structure.
**Cons:** two representations that can drift; the spec's §47 explicitly forbids
duplicate knowledge models.

### Option E — Repowise-style layered engine (adapt)

Adapt Repowise's four-layer + MCP pattern onto the Ix-findings model. **Pros:**
proven UX shapes. **Cons:** its doc/wiki generation is LLM-heavy and less
provenance-disciplined; integration effort similar to A with more external surface.

### Recommendation

**Option A** — extend the existing canonical layer — is the smallest architecture
that satisfies §17 (self-hosted), §47 (single knowledge model), §12 (incremental),
§6 (findings first-class). It reuses the largest verified asset base. Add MCP
(§18) and GitHub-native pages (§19) on top. Optional adapters: Anydoc for
documents, Repowise patterns for the MCP surface.

---

## 13. Proposed graph schema (delta over current ontology)

### New entity types

| Type | Purpose |
|---|---|
| PERSON | GitHub user/author/reviewer; keys: login, avatar, url |
| TEAM | org/team grouping |
| REVIEW_COMMENT | inline review comment (thread position) |
| DEPENDENCY | package/dependency node (repo → package) |
| HOTSPOT | derived metric node (file with churn × complexity) |
| CO_CHANGE_CLUSTER | derived node grouping files that change together |

### New relationship types

| Type | Purpose |
|---|---|
| AUTHORED_BY | commit/issue/PR/comment → PERSON |
| OWNED_BY | repo/component → PERSON/TEAM |
| REVIEWED_BY | PR → PERSON (reviewer) |
| CO_CHANGED_WITH | file ↔ file (co-change) |
| DEPENDS_ON_PACKAGE | repo → DEPENDENCY |
| REVERTED_BY / REVERTS | commit ↔ commit |
| CLOSES / FIXES_ISSUE | PR → ISSUE |
| DISCUSSED_IN_COMMENT | entity → COMMENT |
| MENTIONS | entity → PERSON/entity |

### Retention of current model

All 34 existing entity types and 50 relationship types are kept; new ones extend,
never replace. The entity/relationship contracts in `ontology.json` are updated with
the new types and their source-of-truth rules.

---

## 14. Proposed storage model

- **Canonical:** `knowledge/*.json` (unchanged, source of truth), extended with new
  collections: `people.json`, `reviews.json`, `cochange.json`, `dependencies.json`,
  `git-metrics.json`.
- **Derived:** existing `planning/pages/public/` build + new `knowledge/derived/`
  artifacts for metrics.
- **Bulk/large-volume (optional, Phase 10+):** if comments/co-change exceed JSON
  practicality, an append-only JSONL or SQLite sidecar *derived* from canonical —
  never a competing source of truth.
- **No new mandatory services.** ArangoDB stays only as the Ix CLI's own backend,
  not part of the knowledge pipeline (keeps self-hosting trivial: node + git + gh).

---

## 15. Proposed ingestion pipeline

```
GitHub events (gh API / webhooks, optional)        git log (per repo worktree)
        │                                                   │
        ▼                                                   ▼
GitHub collaboration ingestor                    Git intelligence module
(issues, PRs, comments, reviews,                 (commits, branches, merges,
 labels, milestones, linked objects)              co-change, ownership, hotspots)
        │                                                   │
        └──────────────┬────────────────────────────────────┘
                       ▼
              canonical knowledge layer
        (entities.json, relationships.json, …)
                       │
                       ▼
        build-knowledge.mjs → build-data.mjs → build-public.mjs
                       │
                       ▼
       published site + llms corpus + graph.json
                       │
                       ▼
        freshness gate + purged-SHA audit + validate-public + verify-live
```

- **Initial:** full ingestion (repos → git → GitHub objects → people → metrics).
- **Incremental:** per-event touch points; re-run gate to invalidate stale entities;
  affected pages regenerated, not a full rebuild (spec §12).

---

## 16. Proposed incremental synchronization model

- `knowledge/freshness-gate.mjs` already implements compare-and-fail against live
  GitHub state. Extend to a `sync` mode that:
  1. fetches changed GitHub objects since `observed_at` watermark;
  2. updates only affected entities/relationships (marking superseded ones
     HISTORICAL, never deleting);
  3. recomputes affected derived artifacts + affected pages;
  4. records the sync event in the timeline/manifest;
  5. re-runs the gate to prove freshness.
- Triggers: manual `node knowledge/sync.mjs`, optional post-push hook, optional
  scheduled run (GitHub Actions `schedule`), optional webhook endpoint (Phase 10+).

---

## 17. Proposed AI retrieval architecture

- **MCP server** (new, Phase 9): tools `graph.query`, `graph.traverse`,
  `graph.entity`, `graph.search`, `graph.provenance`, `graph.path` — backed by
  `query-knowledge.mjs` + indexes; deterministic JSON responses with
  answer/evidence/related/confidence/sources per spec §14.
- **LLM corpus:** extend `llms-full.txt` + indexes with people, reviews, co-change,
  dependencies; keep the traversal algorithm in the LLM guide current.
- **No vector DB in v1** (spec §22): lexical + graph traversal + metadata filtering
  covers the query set; semantic retrieval is an explicit Phase 14 experimental
  item with a comparison, not a default.

---

## 18. Proposed GitHub browsing experience

Generate, from the canonical model, GitHub-native pages under the existing site:
`/architecture`, `/decisions`, `/findings`, `/stale`, `/conflicts`, `/people`,
`/dependencies`, `/cochange`, `/timeline`, `/search` — each linking to canonical
GitHub objects (PR/issue/commit URLs already present in `source_refs`). Reuse the
existing `build-public.mjs` pipeline and entity-page renderer; add new view
generators only where the data demands it.

---

## 19. Proposed graph UX

- Reuse the existing map/entity-page UI; add the spec's modes as **filters/views**
  over the same canonical graph data: repository graph, change graph, decision
  graph, finding graph, contributor graph, timeline.
- Focus mode = existing neighborhood expansion + canonical-page navigation (already
  built). Add: typed-edge filtering, provenance panel on edge select, temporal
  slider (filter by `valid_from/valid_until`).

---

## 20. Proposed self-hosting architecture

- **Runtime:** Node ≥ 22 + git + `gh` CLI (token) + optional Docker only if using
  the Ix CLI's ArangoDB backend. Knowledge pipeline itself needs **no** Docker.
- **Storage:** local JSON in the repo (git-tracked, provenance-visible).
- **Docs ingestion (optional):** Anydoc local Rust binary for Office/PDF.
- **LLM providers:** none required for ingestion; only optional for doc summarization
  (bring-your-own key).
- **Mandatory external services: none.** `gh` API is the only network dependency
  (read-only), and it can be replaced by local `git` for repos without GitHub.

---

## 21. Security model (proposed)

- Treat GitHub issues/PRs/comments/READMEs as **untrusted input** (spec §24):
  ingestion never executes instructions found in content; prompt-injection scanning
  on ingested text (flag, don't execute); the `AGENTS.md` no-attribution and
  GitHub-write policies are already encoded in Ix-findings.
- Credentials: read-only GitHub token scoped to public repo access; never written
  into knowledge artifacts (existing secret-pattern validator already covers this).
- Output: public projection strips private/PRIVATE repos (existing sysCompass
  PRIVATE marker pattern), local paths, secrets — already enforced by
  `validate-public.mjs`.
- Verify with `security-and-hardening` skill during Phase 15.

---

## 22. Performance model (proposed)

- Target: initial index ≤ minutes per repo; incremental sync touches only changed
  objects; query latency < 50 ms for graph/traverse (JSON in memory); page rebuild
  only for affected routes.
- Measure: add timing counters to the sync/gate scripts; report in
  `DATA-QUALITY-REPORT.md`.

---

## 23. Testing strategy (proposed)

- Unit: extend `freshness-gate.test.mjs` pattern for new modules (git metrics,
  GitHub ingestor, MCP handlers).
- Integration: run the pipeline on the live fork, assert entity/relation counts and
  gate PASS; negative tests for stale/purged/contradictory data.
- E2E: `verify-live.mjs` extended to new pages; MCP tool contract tests.

---

## 24. Migration strategy (proposed)

- The canonical layer is additive: new collections + new ontology entries, zero
  schema rewrites. Existing entities/relationships remain valid. Rebuild derived
  artifacts once after Phase 2.

## 25. Rollback strategy (proposed)

- Every ingestion/sync is a git-tracked, additive change (HISTORICAL marking, no
  destructive deletes). Rollback = `git revert` of the sync commit + gate re-run.
- A full-knowledge snapshot tag (`knowledge/<n>`) per major sync for reproducibility.

---

## 26. Risks

| Risk | Mitigation |
|---|---|
| Comment/review volume explodes JSON | JSONL sidecar (Phase 10+), measured first |
| gh API rate limits during full ingest | paginated, watermark-based incremental sync |
| Co-change/hotspot metrics drift from truth | freshness gate + verified-by-commit refs |
| Ix CLI ArangoDB dependency for code graph | code graph is an optional ingestion path; fall back to tree-sitter-lite/git |
| Oil-motion ecosystem link unverified | stays out of graph until verified (spec §13) |
| Prompt injection via issue/PR content | untrusted-input scanning at ingest; no execution |

---

## 27. Unknowns (investigate before/within Phase 1)

1. `oil-oil/oil-motion` relationship to IX/Compass (if any).
2. Whether `ix-infrastructure/system-compass` is accessible and in-scope.
3. Whether the installed parasite-skill build exposes `tools`/`agents` subcommands
   (`--help` inspection).
4. Full cross-link inventory of Ix issues/PRs/docs (repo → repo links).
5. Volume of Ix comments/reviews (drives storage decision).
6. gh API token scope available for GitHub collaboration ingestion.

---

## 28. Open questions for the user

1. Confirm **Option A** (extend canonical layer) as the architecture.
2. Is `oil-oil/oil-motion` intended to be part of the IX/Compass graph, or was it a
   spec template artifact? (Determines Phase 1 scope.)
3. Scope of PERSON/ownership modeling: just contributors to the fork branches, or
   upstream maintainers too?
4. Is an MCP server (Phase 9) desired for Claude Code / Codex registration, and may
   it be registered in the local client configs?
5. OK to add a scheduled sync (GitHub Actions) and post-push hook, or manual sync only?

---

## 29. Alternatives considered

- Vector DB first (rejected: lexical+graph covers v1; §22 comparison deferred to
  Phase 14 experimental item).
- Graph DB canonical store (rejected for v1: ops weight vs. benefit; Option C).
- Full Repowise adoption (rejected: provenance discipline weaker; Option E).
- Full OpenKB adoption (rejected: markdown wiki weaker than typed ontology).

---

## 30. Recommended implementation phases (awaiting approval)

| Phase | Deliverable | Depends on |
|---|---|---|
| 0 | Baseline + full repo/GitHub inventory + cross-link mining | — |
| 1 | Git intelligence module (co-change, ownership, hotspots) | 0 |
| 2 | GitHub collaboration ingestor (issues/PRs/comments/reviews) | 0 |
| 3 | Ontology extension (PERSON, REVIEW_COMMENT, new edges) + rebuild | 1, 2 |
| 4 | Provenance hardening for new objects | 3 |
| 5 | Incremental sync engine (watermark + affected-page rebuild) | 1, 2 |
| 6 | GitHub-native docs pages + site regeneration | 3 |
| 7 | Search/index extensions (people, reviews, co-change) | 3 |
| 8 | MCP server over the graph | 3, 7 |
| 9 | Skills/hooks/AGENTS updates + optional post-push hook | 5, 8 |
| 10 | Staleness/conflict surface (existing + new detectors) | 3, 5 |
| 11 | Performance tuning + volume measurement | 5 |
| 12 | Security hardening + prompt-injection review | all |

Each phase will include: objectives, files/components affected, dependencies,
commands, tests, acceptance criteria, rollback — presented for approval before
execution (spec §29–§30).

---

## Final classification summary

- **Observed:** everything in §1, §3–§7, §10 (project research), §11 matrix.
- **Derived:** fork-centric ecosystem shape, gap analysis (§6), Option A fit.
- **Proposed:** §12–§25, §30.
- **Unknown / open:** §27–§28.
- **Not performed:** any write, GitHub action, or implementation.

Awaiting approval before Phase 0/1 execution.
