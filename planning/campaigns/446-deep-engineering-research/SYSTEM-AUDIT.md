# System Audit — Autonomous Ix Engineering Infrastructure

Date: 2026-08-17 · Upstream baseline: `8be5f110a5a072767e04dc108e79c539d1bab0f9`

Read-only inventory of the local engineering system before this campaign's
extensions, per the campaign §4 requirement (AUDIT → GAP ANALYSIS → EXTENSION).

## Repositories

| Repo | Local path | Role |
|---|---|---|
| Alot1z/Ix-remap (fork of ix-infrastructure/Ix) | `E:/E-github-repos/Ix-remap` | Domain A: engineering/implementation |
| Ix-findings | `E:/E-github-repos/Ix-findings` | Domain B: evidence/knowledge |
| ix-infrastructure/Ix (upstream) | remote `origin` in Ix-remap | Domain C: read-only |

## Fork-side agent system (`.agents/`, on fork main `de05223`)

- **13 agent definitions**: ix-orchestrator, ix-upstream-auditor, ix-pr-reviewer,
  ix-git-reviewer, ix-archaeologist, ix-commit-miner, ix-contribution-miner,
  ix-documentation-reviewer, ix-final-reviewer, ix-ix-findings-reviewer,
  ix-security-reviewer, ix-session-closeout, ix-test-auditor.
- **5 prompts**: session-startup, session-closeout, upstream-walkthrough,
  adversarial-multi-agent-review, fork-sync-and-contribution-gate.
- **6 skills**: authorization-check, ix-contribution-lifecycle, ix-findings-review,
  ix-pr-review, ix-session-closeout, ix-upstream-audit.

Strengths: standing-authorization decision tree (permission-asking is a failure
mode); upstream read-only boundary; contribution-lifecycle skill with states;
session closeout discipline.

## Ix-findings knowledge system

- `knowledge/build-knowledge.mjs` — canonical graph (entities/relationships) from
  the planning registries (findings, evidence, suggestions, decisions) + identity
  registry + GitHub mirror. Output: `knowledge/*.json` + quality report.
- `knowledge/freshness-gate.mjs` + `.test.mjs` — fails closed when the manifest
  `live_baseline.upstream_head` drifts from live GitHub; regression-covered.
- `knowledge/build-github-mirror.mjs`, `knowledge/ui-compat-adapter.mjs`,
  `knowledge/purged-sha-audit.mjs`, `knowledge/query-knowledge.mjs`.
- `planning/phase-c/capture-github.mjs` — live GitHub capture; `prTargets` now
  includes the historical campaign PRs (434–448, 455) so merged/closed PRs stay
  recoverable (prior-session fix, retained).
- `planning/pages/` — explorer: `build-public.mjs`, `validate-public.mjs`,
  `verify-live.mjs`; entity pages with kv() renderer (numeric-field fix retained).
- Registries: `planning/findings/registry.json` (24 findings, mixed CRLF/LF —
  surgical text edits required), `planning/evidence/registry.json` (31 records),
  suggestions, decisions.
- Findings F-014/16/17/19 carry `live_upstream_verification` blocks (E-031
  evidence record) from the prior live-verification pass — retained and consistent
  with this campaign's fresh results.

## What is missing (gaps addressed by this campaign)

1. **No reusable reproduction harness.** Probes were built ad hoc per session and
   discarded with the worktrees. **Fix:** `repro/` harness in the fork
   (fixtures + `probe.mjs` with in-batch/cross-batch modes and `--expect
   bug|fixed`) — committed and pushed on `campaign/446-repro-harness`.
2. **No per-finding durable root-cause documents** — only the audit doc's
   summaries. **Fix:** this campaign's ROOT-CAUSES + REGRESSION-MATRIX +
   RELATED-RISK-ANALYSIS docs.
3. **No campaign memory structure.** **Fix:** `planning/campaigns/446-deep-engineering-research/`.
4. **Probe-validity trap** (heredoc backslash collapse) is documented in the
   audit doc but not mechanized. **Fix:** harness reads fixtures from disk
   (write_file-created, byte-verified), never inline strings.

## Workflow gaps observed (not fixed this campaign)

- Ix CLI/backend released artifacts lag upstream (`ix-memory-layer:latest` and the
  installed CLI contain no #446-era ingestion code) — a faithful upstream
  reproduction requires building core-ingestion from the target SHA. The harness
  documents this; a future "build-at-SHA" CI step could automate it.
- The shared local backend accumulates fixture workspaces (no scoped reset exposed
  by the CLI; `ix reset` is global) — residue must be disclosed, not wiped.

## Extension decision

Only the reproduction harness was added (solves demonstrated gap #1). No existing
mechanism was replaced; the phase-C retention fix, freshness gate, and explorer
fixes from prior sessions were verified present and consistent.
