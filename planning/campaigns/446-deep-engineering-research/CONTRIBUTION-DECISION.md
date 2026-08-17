# Contribution Decision — F-014 / F-016 / F-017 / F-019

Date: 2026-08-17 · Upstream SHA: `8be5f110a5a072767e04dc108e79c539d1bab0f9`

## Current upstream state

- The historical PRs **#443/#445/#446 are MERGED** (2026-08-16) and are therefore
  *provenance*, not the contribution destination.
- All four regressions are **still live on current main** (harness: 8/8 in-batch,
  4/4 cross-batch).
- **Duplicate check:** only open upstream PR is #455 (context-investigation state
  validation — unrelated). No merged commit after the campaign addresses any of
  the four paths. No issue references the findings. → **No duplicate, no
  competing work.**

## Historical fixes — classification (campaign §16)

| Finding | Historical fix | Class | Against current main |
|---|---|---|---|
| F-014 | 0a7d97f | A = correct & sufficient | verified fixes |
| F-019 | f577492 | A = correct & sufficient | verified fixes (in-batch + cross-batch) |
| F-016 | cba11a3 | A = correct & sufficient | verified fixes |
| F-017 | f9274cc | B = correct but incomplete (merged code) | **insufficient alone** — needs cba11a3 too |

**Implementation guidance for a future contribution:** keep the four historical
commits as-is; create NEW commits on top of current main. F-017's contribution
must be the **pair** (plain-key guard on the configured block AND on the unified
fallback) — a single commit covering both sites, or two commits, but never
f9274cc alone against main.

## Readiness scoring (decision support, not authorization)

| Criterion | F-014 | F-016 | F-017 | F-019 |
|---|---|---|---|---|
| Technical correctness | 9/10 | 9/10 | 9/10 | 9/10 |
| Reproducibility | 9 (harness) | 9 | 9 | 9 |
| Root-cause confidence | high | high | high | high |
| Test coverage | +controls | +controls | +controls | +controls, cross-batch |
| Architectural fit | minimal, parser-level | minimal, scope-level | minimal, two sites | minimal |
| Upstream freshness | 8be5f110 verified | same | same | same |
| Duplicate risk | none | none | none | none |
| Regression risk | low (IMPORTS kept) | low (X2 kept) | low (Y2 kept) | low (multi kept) |
| Security impact | none | none | none | none |
| Maintainer context | merged PR, no replies to prior comments | merged PR, no replies | merged PR, no replies | merged PR, no replies |

## Classification (campaign §24)

All four: **CONTRIBUTE_NOW** (individually mature; F-017 as the two-guard pair).
F-020: **NOT_WORTH_CONTRIBUTING** (pre-existing design decision, low value).

## Recommended destination

- **Not** the historical merged PR threads as the *primary* vehicle — they are
  closed; comments there reach the merged-PR thread only.
- **Recommended:** one new upstream PR against `ix-infrastructure/Ix` `main`
  (or two: PHP #446-fixes; TS #443/#445-fixes), carrying the four fixes as fresh
  commits with the harness-derived regression tests + controls, plus the F-017
  two-guard correction.
- Alternative (lower noise): individual follow-up comments on the merged threads
  with the fork commits for cherry-pick — appropriate only if the maintainers
  prefer cherry-picking to a new PR.

## Authorization status

**No upstream write is authorized.** This document and the DRAFTS.md are decision
support + draft-only communication. Any comment or PR requires explicit
Level-3 authorization (campaign §26).

## What Alot1z actually contributed (campaign §28 answer)

- Upstream: **exactly one** commit — `5efd8f18` (grouped PHP `use` imports,
  merged via #448, +113/−0). Verified in the campaign forensics.
- Fork-only (never merged): the four fix commits 0a7d97f, f577492, cba11a3,
  f9274cc + earlier infra fixes.
- Research/knowledge: this campaign's registry updates, E-031 evidence, harness,
  and reports. Maintainer code (Hiro-Chiba/KageBinary's #443–447) is never
  attributed to Alot1z.
