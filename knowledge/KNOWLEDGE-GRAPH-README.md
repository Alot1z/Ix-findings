# Ix-findings Knowledge Graph

This directory is the canonical semantic layer beneath the existing Ix / Compass explorer. It improves provenance, status reconciliation, typed relationships, temporal history, uncertainty, and LLM traversal without redesigning the explorer UI.

## What is canonical?

`knowledge/entities.json` and `knowledge/relationships.json` are the normalized graph model generated from the complete local evidence universe. Registries, phase artifacts, reports, GitHub manifests, packets, and generated snapshots remain source records with provenance; they are not silently deleted or rewritten.

The source order is:

1. Current upstream source, tests, and live GitHub state.
2. Direct runtime, artifact, and source evidence.
3. The normalized `knowledge/` model.
4. Historical phase artifacts and reports.
5. Derived UI and Pages snapshots.

The current upstream baseline takes precedence when it conflicts with an older report. The older statement remains available as historical evidence and may produce a `CONTRADICTION` record.

## How to inspect one finding

Start with a finding such as `F-009` or `F-010`:

1. Find the entity in `entities.json`.
2. Follow its `evidence_ids` into `evidence.json`.
3. Follow typed edges in `relationships.json` to issues, PRs, commits, tests, phases, and decisions.
4. Read `temporal` and `status_history` before calling it current.
5. Read `llm.uncertainties` and `llm.questions`; these are explicit limits, not filler.

For example, F-009 should connect to issue #371, the historical dead-registration evidence, the upstream fixing PR #390, the current `oss.ts` observation, and the Phase 15 reconciliation that classifies it as resolved.

## Evidence classes

- **A** — direct source or authoritative GitHub/maintainer evidence.
- **B** — reproducible runtime or artifact evidence.
- **C** — corroborated reconstruction.
- **D** — inference/speculation. D-level material is never promoted to fact automatically.

## Current versus historical

A fixed finding is not erased. It has a historical observation showing when the defect existed and a current state showing the upstream fix. `valid_until`, `fixed_by`, `observed_at`, and `verified_at` are `UNKNOWN` when the source does not establish them.

The Pages explorer remains a sanitized snapshot. Its `data.js` is a presentation projection and is not the source of truth for current GitHub state.

## Regeneration

Run `node knowledge/build-knowledge.mjs` from the repository root. The generator uses only Node built-ins, scans all relevant local artifacts, preserves source references, writes only under `knowledge/`, and emits validation metrics. It does not push, deploy, open PRs, comment on issues, or modify implementation repositories.

## Offline query CLI

The graph can be explored without network access:

```text
node knowledge/query-knowledge.mjs show F-009
node knowledge/query-knowledge.mjs trace "PR #393" --depth=2
node knowledge/query-knowledge.mjs path F-009 "PR #390"
node knowledge/query-knowledge.mjs search patches
node knowledge/query-knowledge.mjs readiness mcp
node knowledge/query-knowledge.mjs ask "is ix mcp ready?"
```

Add `--json` for machine-readable output and `--include-sources` when provenance-file nodes should be included in traversal. The readiness query is intentionally conservative: it reports the Phase 15 disposition and its blockers rather than treating a prepared packet or green historical tests as submission approval.

## Explorer compatibility adapter

`knowledge/ui-compat-adapter.mjs` is the read-only seam between the canonical graph and the existing explorer contract. `planning/wiki/build-data.mjs` and `planning/pages/build-public.mjs` now consume this adapter, which maps canonical entity types and typed relationships into the existing `window.IX_DATA` shape. The adapter does not write to canonical files, perform network requests, or change `planning/wiki/index.html`, `planning/wiki/assets/wiki.js`, or the CSS/UI interactions.

Regenerate the projections with:

```text
node knowledge/build-knowledge.mjs
node planning/wiki/build-data.mjs
node planning/pages/build-public.mjs
node planning/pages/validate-public.mjs
```

The internal explorer may show provenance nodes from the canonical graph; the public builder still applies its allowlist and excludes worktrees, the raw manifest, and private Compass narrative. Both projections remain derived snapshots, not current GitHub truth.

## Graph sections and deep links

`knowledge/sections.json` is the machine-readable registry of implementation sections. Each section has a stable `graph_path` (`/mcp/implementation/stdio`, `/prs/393/security`), the issue/PR/commit references, exact file and line references with GitHub blob URLs, tests, evidence, and security notes.

The published explorer exposes every section at an arbitrary-depth URL:

```text
https://alot1z.github.io/Ix-findings/mcp/implementation/stdio
https://alot1z.github.io/Ix-findings/prs/393/remap
```

GitHub Pages serves `404.html` for unknown paths, so any depth resolves to the same single-page app and re-routes through `assets/sections.js` (hash router). There is no nesting-depth limit and no per-route implementation. The registry is generated from live-verified data only; `knowledge/live-github-state.json` records the captured GitHub state and exact source references.

## Freshness gate

Before reviewing or publishing a derived snapshot, compare the canonical graph and both explorer projections with live upstream state:

```text
node knowledge/freshness-gate.mjs
node knowledge/freshness-gate.mjs --json
node planning/pages/validate-public.mjs
```

The gate performs read-only GitHub API reads through `gh api` and checks the upstream default branch/head, open PR and issue sets, canonical graph coverage, derived snapshot revisions, and the records in `knowledge/snapshots.json`. It exits `0` only when fresh, `2` when stale, and `3` when live state cannot be read **and no baseline exists**. `validate-public.mjs` runs the gate by default; `--skip-freshness` is explicitly offline structural validation and is not publication approval. Use `--fixture FILE` to make the comparison deterministic in tests without network access. The built-in deterministic checks can be run with `node knowledge/freshness-gate.test.mjs`.

The gate also enforces **superseded-commit staleness**: any manifest-era commit entity (`CLI-HANDOFF/manifest.json` `commits`) still marked `CURRENT` in the canonical graph while the live capture (`knowledge/live-github-state.json`) records a newer head for the same branch fails the gate. The canonical builder reconciles such commits to `HISTORICAL`; if any remain `CURRENT`, the graph is presenting a superseded commit as live state and publication must stop. Example observed check: `superseded-commit:1497596` must be `HISTORICAL` once the live head of `feat/ix-remap-hardening` is `d676a948`.

**Degraded mode (hermetic CI).** When the GitHub API is unreachable — e.g. a GitHub Actions runner without a usable token — the gate falls back to comparing the canonical graph against the last live-verified capture committed as `knowledge/live-github-state.json`. This run is reported as `Mode: degraded-baseline` with the API error surfaced, and still fails closed if the committed graph drifts from that capture. It is a consistency check, not a freshness check: the authoritative live comparison always runs when `gh` is authenticated (local/pre-publish runs). The report's `mode` field distinguishes `live` from `degraded-baseline`.

## Privacy

The internal layer may contain local provenance paths so the investigation is reproducible. Do not publish it directly. Use the existing allowlist-based Pages builder for any public projection and retain the snapshot label.

## Quality rules

- Never infer a defect from a stale manifest alone.
- Never turn plausibility into fact.
- Never hide a contradiction by overwriting one source.
- Never invent inaccessible Compass source details.
- Never treat a green test suite as proof of complete correctness.
- Never treat a prepared PR packet as a submitted contribution.
