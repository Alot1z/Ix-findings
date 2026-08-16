# knowledge.md — Ix Investigation & Contribution Environment

Durable repository/domain knowledge for the Ix audit-and-contribution workflow.
Companion to `AGENTS.md` (operational rules). This file answers **what the
environment IS**; `AGENTS.md` answers **what agents MUST DO**; the `knowledge/`
directory holds the machine-readable knowledge graph; `planning/findings/`
holds the findings registry.

**Last updated:** 2026-08-16 (final-orchestrator era: F-021 published as PR #448)

---

## 1. Repositories

| Repo | URL | Role | Writes allowed |
|---|---|---|---|
| upstream Ix | `https://github.com/ix-infrastructure/Ix` | Canonical product source | NEVER (fetch only) |
| fork Ix-remap | `https://github.com/Alot1z/Ix-remap` | Personal fork — push target; carries fork-local infra (`.agents/`, `AGENTS.md`, `knowledge.md`, `planning/`, `validation/`) on `main` | YES (fork only, never force-push) |
| Ix-findings | `https://github.com/Alot1z/Ix-findings` | Canonical evidence ledger + published knowledge explorer (this repo) | YES (this repo only) |
| RavelScope | local `E:\E-github-repos\RavelScope` | Everything + Ghidra binary toolchain | **UNAVAILABLE** for TS/tree-sitter analysis |

## 2. What Ix is

Ix is a codebase-intelligence product: a tree-sitter parser/classifier
(`core-ingestion/`, 26 languages), a TypeScript CLI (`ix-cli/`), an agent
skill (`skills/ix/`), and a backend (Docker image; ArangoDB on
127.0.0.1:8529, Memory Layer on 127.0.0.1:8090). The pipeline that matters
for the PR audits:

```
source → tree-sitter AST → entities → containers → local indexes
      → global/index → resolveEdges → graph edges → queries
```

Language-specific resolution lives in `core-ingestion/src/queries.ts`
(tree-sitter query patterns per language) and `core-ingestion/src/index.ts`
(handlers: `phpTypeFqcn`, `phpFqcnToTypes`, `importedPhpType`,
`normalizeCapturedImport`, `findEnclosing`, `collectPhpNamespaces`).

### Durable product invariants (verified, cost hours)

- **`ix reset` is GLOBAL** — takes no workspace_id and wipes every workspace's
  graph. Only `/v1/reset/workspace` is scoped; the CLI does not expose it.
- **OSS↔Pro command boundary is runtime-derived**: `main.ts` snapshots
  `ossCmdNames` after `registerOssCommands()`; the Pro probe diffs against it.
- **`ix patches` is OSS, not Pro** (#371) — registered in `oss.ts`; on a Kartr
  install OSS registers first and wins silently.
- **`ix upgrade` wipes `~/.ix/cli/compass`**; re-extracted only by re-running
  the installer. `IX_SKIP_COMPASS=1` skips that in `bootstrap.sh`.
- **Windows path trap:** Git Bash `/tmp` ≠ Windows `C:\tmp` — node/python
  cannot read files Git Bash wrote to `/tmp`. Use project-relative paths.
- After any code change: `ix map --silent` re-ingests.

## 3. Kage — clarification

**There is no separate "Kage" system.** "Kage" is the handle of the upstream
maintainer **KageBinary** (COLLABORATOR on ix-infrastructure/Ix; other
contributors: josephismikhail CODE_OWNER, Hiro-Chiba, TannerTorrey3).
Do not invent a "Kage workflow" or "Kage tooling" — the person, not a tool.

## 4. Findings ledger

- **Registry:** `planning/findings/registry.json` (canonical), plus
  `registry.md`, `PR-AUDIT-2026-08-15.md`, and by-status/by-evidence-class
  views. The file is **CRLF** — preserve line endings.
- **IDs:** `F-###` are the planning-layer canonical IDs; `ixf_id` is the 1:1
  alias used by the earlier ledger. `N-###` are non-finding notes.
  Never create a duplicate ID; never renumber.
- **Statuses used:** `REPRODUCED`, `VERIFIED`, `FIXED_FORK` (fix exists
  fork-side, not merged), `PR_OPEN`, `UPSTREAM_PR`, `PRE_EXISTING`, `OPEN`,
  `AUDITED`.
- **Evidence classes (registry v2 note):** A=source, B=artifact/runtime,
  C=reconstruction, D=inference.
- **Surgical-update rule:** insert fields/records only; do not reserialize the
  whole file, do not change line endings, do not create formatting churn.
  Verify JSON parses and IDs remain unique after every edit.

## 5. The 2026-08-15/16 PR-audit era

### PR landscape (live 2026-08-16)

Hiro-Chiba opened the originals; KageBinary consolidated them into his own
branches carrying Hiro-Chiba's commits (authorship preserved):

| Hiro-Chiba original | KageBinary consolidation |
|---|---|
| #434 renamed-type-imports | **#443** (default-import guard) — head `eab1075` |
| #436/#426 mcp error cap | **#444** (bounded failure reason) — head `1f49d9f` |
| #440 tsconfig module resolution | **#445** (authority + security hardening) — head `adc97c1` |
| #442 php namespace resolution | **#446** (clause-scoping + DoS hardening) — head `83b9be4` |

Plus **#447** (ingest-dir confinement, head `6233b49`, KageBinary) and
**#448** (our grouped-`use` fix, open). Upstream `main` = `043bc68`.
**#442 is a strict prefix of #446.** All heads unchanged since 2026-08-16.

### Findings F-014..F-021 and the five published contributions

| Finding | Bug (reproducer essence) | Class | Fix commit (parent) | Communication |
|---|---|---|---|---|
| F-014 (high) | #446: global `use Vendor\Thing;` + `namespace A { class Thing {} }` → wrong high-confidence `CALLS @0.9` across the global↔namespace boundary | REGRESSION by #446 | `0a7d97f` (parent = #446 head `83b9be4`); parser-level `phpMixedScope` guard | #446 comment `5303306410` |
| F-019 (medium) | #446: two same-line sibling classes; FQCN map drops the container-carrying one → `NONE` (in-batch + cross-batch) | REGRESSION by #446 (same-line container artifact pre-existing; #446's `entity.container` FQCN guard made it a false negative) | `f577492` (parent `0a7d97f`); drop `entity.container` from `phpTypeFqcn` filtering | #446 comment `5305054642` |
| F-016 (high) | #443: `import { Base as LocalBase }` fallback binds to provider member `M.Base` → wrong `EXTENDS @0.9` | REGRESSION by #443 | `cba11a3` (parent = #443 head `eab1075`); require plain qualified key in fallback | #443 comment `5305054711` |
| F-017 (high) | #445: same via configured `@core` mapping path → wrong `EXTENDS/REFERENCES @0.9` | REGRESSION by #445 | `f9274cc` (parent = #445 head `adc97c1`) | #445 comment `5305054778` |
| F-021 (medium) | main: grouped `use Vendor\{A, B};` captures zero IMPORTS (query only matched `(namespace_use_clause (qualified_name))`; grouped members are bare `name` under `namespace_use_group`) | PRE-EXISTING, independently actionable | `5efd8f1` (parent = main `043bc68`); capture `@import.prefix` + `@import.clause`, take the **first** `name` child (never the alias) | **PR #448** (open) |

Fixes are fork-side, parent-aligned to current PR heads, and linked from the
PR threads — maintainer action is cherry-pick (or merge #448). All four
existing-PR fixes are committed to `Alot1z/Ix-remap` branches
(`fix/446-namespace-scope-boundary`, `fix/443-renamed-import-member-guard`,
`fix/445-renamed-import-member-guard`; F-021 on `fix/php-grouped-use-imports`).

### Recorded but not contributed

- **F-015 (medium, PRE_EXISTING):** #446 C7 — block-scoped `use` leaking into
  global code via legacy stem fallback. Deliberately excluded from `0a7d97f`;
  needs namespace-aware bare-name fallback.
- **F-020 (low, OPEN):** single-char symbol names lose CALLS/REFERENCES in all
  languages (generic length guards in `index.ts`, e.g. `callee.length <= 1`).
  Deliberate noise filter; relaxing is a design decision — future query layer.
- **F-018 (informational):** #446's parser-level `phpNamespaceBlocks` guard —
  upstream implementation, validated (fixtures in fork `validation/`).
- **N-003 (informational):** #444 and #447 audited, no defect.

### Duplicate-fix doctrine (the 83b9be4 vs 0701040 case)

When an upstream PR already fixes a bug (parser-level metadata), a fork
entity-inference alternative (`0701040`) is **independent-validation evidence
only** — never a competing PR. Preserve the branch as provenance.

### Comment-consolidation example

#446 originally had three Alot1z comments; consolidated into one
(`5299980806`). Multiple comments on one object are a smell.

## 6. Contribution lifecycle (encoded fully in AGENTS.md)

```
DISCOVER → RECOVER CONTEXT → CHECK LIVE UPSTREAM → SEARCH DUPLICATES
→ REPRODUCE → CLASSIFY → ASSESS PR-WORTHINESS → ADVERSARIAL TEST
→ VERIFY COMMIT → PUBLISH FORK → VERIFY REMOTE → UPDATE FINDINGS
→ CHECK PR COMMUNICATION → COMMENT OR OPEN PR → VERIFY COMMUNICATION
→ FINAL REPORT
```

Classification vocabulary: CURRENT REGRESSION · CURRENT PRE-EXISTING BUG ·
HISTORICAL REGRESSION ALREADY FIXED · DUPLICATE / ALREADY BEING FIXED ·
FALSE POSITIVE · INFORMATIONAL · LOW VALUE / NOT WORTH CONTRIBUTING ·
NEW ADDITIVE BUG.

## 7. Tool availability (honest, as of 2026-08-16)

| Tool | Status | Notes |
|---|---|---|
| `gh` CLI (authenticated Alot1z) | AVAILABLE | live PR/issue/comment verification |
| `git` + worktrees | AVAILABLE | differential builds per state |
| `vitest` / `tsc` | AVAILABLE | core-ingestion suites (resolveEdges, queries.php, patchBuilder) |
| Ix CLI binary | AVAILABLE | `ix map`, `ix explain`, … |
| Ix backend / graph | UNAVAILABLE | Docker daemon down — no graph queries; never fake them |
| Ix subagents (`.agents/`) | UNAVAILABLE (as spawned processes) | definitions exist on fork `main`; no spawn mechanism here — applying a methodology manually is NOT an independent agent run |
| RavelScope | UNAVAILABLE | binary toolchain (Everything + Ghidra); not usable for TS/tree-sitter; differential builds + probes are the strongest verification |

## 8. Lessons that cost hours (do not re-learn)

- **Live state always wins** — re-fetch `origin` and re-query the PR API
  before any decision; a SHA from an old audit is a hypothesis, not a fact.
- **Previous-agent reports are evidence, not truth** — re-verify every claim;
  a technically correct commit is not publishable unless the bug is live.
- **PHP fixture discipline** — namespace backslashes die in shell heredocs and
  inline `python -c` strings; write fixtures with write_file and inspect the
  literal bytes before trusting results.
- **Backticks inside template literals break query strings** — a backtick in a
  comment inside a tree-sitter query template literal terminates it silently;
  the build then fails with a masked error and the query silently matches nothing.
- **Same-line sibling AST artifact** — `findEnclosing` uses inclusive line
  ranges, so a same-line sibling can falsely appear "contained". Always test
  same-line vs multi-line variants.
- **Empty dirs are untracked** — `planning/` with no files disappears from git
  status; use `git ls-tree` to check what a branch actually tracks.
- **No attribution footers** in commits/comments/PRs (both repos' AGENTS.md).
- **Registry is CRLF** — a naive reserializer rewrites every line; use
  surgical Python inserts and verify the diff is tiny.

## 9. Historical infrastructure map (recovery notes)

- Ix-remap `planning/` (58 files: `AI-ENGINEERING-STATE.md`, `audit/` phases,
  decisions, findings, comments, fork history) lives on the **local-only
  branch `clean-rebuild`** (tip `554546e`) — never pushed, fully intact.
  Nothing was deleted in any branch (git history: no `D` records; the only
  renames were `IX-INVESTIGATION-HANDOFF/` → `CLI-HANDOFF/` in Ix-findings).
- The fork's live `main` carries the persistent agent system: `.agents/`
  (13 agents, 5 prompts, 4 skills), `AGENTS.md`, `knowledge.md`,
  `validation/` — pushed at `b2cabd6`.
- Durable lessons from `AI-ENGINEERING-STATE.md` (execution-logic correction,
  commit-target rule, duplicate-fix doctrine, collaborator role) are
  consolidated into this file and `AGENTS.md`.
- **2026-08-16:** `planning/AI-ENGINEERING-STATE.md` (blob `2126d26c`) and a
  new `planning/README.md` were restored onto fork `main` (the agent system
  persists session state to that path; its absence broke handoffs). The
  57-file `planning/audit/` tree stays historical on `clean-rebuild`.

## 10. Knowledge graph maintenance (Ix-findings)

The `knowledge/` directory is the canonical machine-readable knowledge layer;
`planning/pages/public/` and `planning/wiki/data/` are derived from it.

- **Regenerate:** `node knowledge/build-knowledge.mjs` then
  `node planning/wiki/build-data.mjs && node planning/pages/build-public.mjs`.
- **Validate:** `node planning/pages/validate-public.mjs`;
  freshness gate: `node knowledge/freshness-gate.mjs` (fails when a
  manifest-era commit entity is CURRENT but superseded by the live head).
- **Tracked:** both source data (`knowledge/*.json`) and derived output
  (`planning/pages/public/`, `planning/wiki/data/`) are committed; CI watches
  `knowledge/` so knowledge-layer changes validate and deploy.
- **Discipline:** regenerate only with a clear reason; inspect the diff for
  unrelated churn; commit derived data in its own commit. `live-github-state.json`
  is captured live — regenerating rewrites it, so a refresh is a real state
  change, not a no-op. Do not commit regenerated output you did not generate
  and verify.
- As of 2026-08-16 an uncommitted regeneration (49 files, +6855/−2431)
  from a prior session sits in the working tree; a dedicated refresh commit
  is a valid follow-up once its diff is reviewed for unrelated churn.

## 11. Agent system (Ix-remap fork)

Fork `main` carries `.agents/`: 13 specialist agents (`agents/`), 5 workflow
prompts (`prompts/`), 5 skills (`skills/`). Responsibilities: archaeology,
commit/contribution mining, PR review, security, git, test audit, upstream
audit, findings review, final review, session closeout, orchestration.

- `ix-orchestrator` owns the end-to-end session cycle and handoff format.
- `ix-contribution-lifecycle` (added 2026-08-16) is the deterministic
  DISCOVER → … → FINAL REPORT pipeline; invoke it instead of reconstructing
  the workflow. `AGENTS.md` (this repo) remains the mandatory rules layer;
  `knowledge.md` the context layer.
- Skills persist session state to `planning/AI-ENGINEERING-STATE.md`
  (restored 2026-08-16); findings evidence lives here in the registry.
- Agent upgrades follow the self-upgrade rule: evidence-based, minimal,
  isolated commits, reversible, non-destructive.
