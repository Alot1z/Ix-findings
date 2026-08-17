# Campaign Memory — 446 Deep Engineering Research

## Identity

- Campaign: `446-deep-engineering-research`
- Dates: 2026-08-17 (continuation of the 2026-08-15 audit and 2026-08-17
  live-verification passes)
- Upstream baseline: `8be5f110a5a072767e04dc108e79c539d1bab0f9` (verified fresh
  at capture)
- Fork baseline: Ix-remap `fork/main` `de05223`; harness branch
  `campaign/446-repro-harness` HEAD `31296fc`

## Goal

Determine what is true today about F-014/F-016/F-017/F-019, understand the
architecture, verify/improve the historical fixes, discover related bugs, and
leave the engineering system more capable — without any upstream write.

## What was done

1. **System audit** → `SYSTEM-AUDIT.md`. Inventoried fork agents/skills
   (13 agents, 6 skills incl. authorization-check + contribution-lifecycle),
   Ix-findings knowledge pipeline (build-knowledge, freshness gate with tests,
   phase-C capture with historical prTargets, explorer with validate/verify-live),
   registries. Gaps: no reusable reproducer; no per-finding root-cause docs; no
   campaign memory; probe-validity trap not mechanized.
2. **Freshness**: upstream `main` = `8be5f110` matches manifest baseline — fresh.
3. **Reproduction harness** (fork, `campaign/446-repro-harness`): fixtures +
   `repro/probe.mjs` (in-batch + cross-batch modes, `--expect bug|fixed`, JSON
   output) + README. File-based fixtures (write_file, byte-verified) to defeat
   the heredoc backslash trap.
4. **Fresh runs**: upstream main `8be5f110` — 8/8 in-batch, 4/4 cross-batch
   (all four bugs live, controls correct). Main + all four fixes — 8/8, 4/4
   (all fixed, controls preserved, F-020 signature unchanged).
5. **Test gate**: core-ingestion suite — 39 failed / 319 passed on clean main
   **identical** to the fixed state (environmental grammar/snapshot drift, not
   the fixes; zero regression).
6. **Root causes** → `ROOT-CAUSES-F-014-F-016-F-017-F-019.md`.
7. **Related-bug discovery** → `RELATED-RISK-ANALYSIS.md`: **confirmed new
   related bug #1** (same-line PHP siblings leak the container artifact into
   graph qualified keys: `CALLS@0.9 qkey=A.User`); **confirmed data gap #2**
   (TS public-name extractor omits plain named exports; the plain-key guard is
   load-bearing for TS); pre-existing member-matching sites re-documented.
8. **Contribution decision** → `CONTRIBUTION-DECISION.md`: no duplicate (only
   open PR #455, unrelated); all four CONTRIBUTE_NOW; F-017 requires both guards
   on merged main; recommended destination = new upstream PR(s) against main.
9. **Draft communication** → `DRAFTS.md` (per-PR drafts, not posted).

## Key results

| Finding | Live on 8be5f110 | Historical fix | Verified on main | Notes |
|---|---|---|---|---|
| F-014 | YES | 0a7d97f | YES | CALLS removed, IMPORTS kept |
| F-019 | YES | f577492 | YES | in-batch + cross-batch |
| F-016 | YES | cba11a3 | YES | X2 control preserved |
| F-017 | YES | f9274cc | YES **only with cba11a3** | merged-code unification |
| F-020 | present (pre-existing) | none | n/a | single-char guard |

## What Alot1z actually contributed

- Upstream: `5efd8f18` via #448 (grouped PHP `use` imports) — the only Alot1z
  commit merged upstream.
- Fork-only: 0a7d97f, f577492, cba11a3, f9274cc + infra fixes — never merged.
- Research: registry updates (live_upstream_verification, E-031), this campaign's
  docs, the harness. Maintainer code (Hiro-Chiba/KageBinary #443–447) is
  maintainer code.

## System improvements delivered

- Fork `campaign/446-repro-harness` — reusable harness (fixtures + runner +
  docs) addressing the demonstrated "probes are rebuilt from scratch every
  session" gap.
- Ix-findings campaign docs (7 files) making the campaign reconstructable without
  conversation history.

## Unresolved questions / future work

- Related bug #1 (PHP container-qkey leak) — minimal fix direction: strip the
  container artifact from PHP type qkeys (mirrors f577492); not implemented this
  campaign (kept as documented finding + invariant gap).
- Data gap #2 (TS exportPublicNames) — decide whether the extractor should
  capture named class/const/function exports (behavioral change for renamed
  imports; currently the guarded fallback is load-bearing).
- Whether maintainers will engage (no replies to the earlier campaign comments
  on #443/#445/#446 as of this date).
- A "build-at-SHA + run harness" CI/script step to automate freshness
  verification (released CLI/backend artifacts lag upstream).

## Safety

- Upstream writes: **none** (no comments, no PRs, no branch pushes, no issue
  edits).
- No history rewritten; no commits amended (0a7d97f/f577492/cba11a3/f9274cc
  untouched); harness branch pushed fast-forward only.
- Released-tooling limitation disclosed (installed CLI/backend are pre-#446);
  all current-upstream claims carry SHA `8be5f110`.
