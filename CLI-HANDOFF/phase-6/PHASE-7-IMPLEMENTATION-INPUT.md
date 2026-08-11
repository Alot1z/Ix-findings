# Phase 7 — Implementation Input

**Phase 6 → Phase 7 handoff · 2026-08-11**

---

## 1. Phase 6 outcome (what is now true)

| Item | State |
|---|---|
| Remap contribution | **SUBMITTED — PR #393 OPEN** (`feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap`), head `1497596` (base `ffe21f0`), 4 files +251/−10, suite 730/732, merge-tree clean. **Not merged.** |
| PACK-371 (F-009) | **SUPERSEDED** by upstream PR #390 (patches registration). **Do not submit.** |
| CONTRIB-376 (F-008) | **SUPERSEDED** by upstream PR #391 (compass version series). **Do not submit.** |
| GitHub Pages | **DEPLOYED** — https://alot1z.github.io/Ix-findings/ (workflow runs success; sanitized public projection; evidence 28, graph 162/133, PR #393 shown). |
| Upstream | `ffe21f0` (3 commits past Phase 5's `5488741`: #375/#378/#389 merged). |
| Fork main | `5488741` — **3 commits behind** upstream. |
| Fork remap branch | `1497596` (pushed). |
| Ix protected worktree | `b038c46` / 14 dirty — **untouched**. |
| ix-compass-dist | `396426b` / 3 dirty — **untouched**. |

## 2. Remaining engineering candidates

| ID | Description | Evidence | Current state | Dependencies | Risk | Readiness | Auth req | Proposed next action |
|---|---|---|---|---|---|---|---|---|
| CAND-006 | Playwright delayed-data reproduction against public ix-compass-dist (optional) | Phase 2/3 | OPEN (optional) | none | low | ready | none (local) | Run repro if Phase 7 includes browser work; otherwise keep optional |
| CAND-019 | Ix documentation scope (docs/api/README.md etc.) | Phase 3 | OPEN | none | low | needs scoping | none (local) | Scope + implement locally |
| F-key (F-001..F-004) | Compass f-key fit-to-viewport (system-compass) | Phase 2/3 packets | **BLOCKED** | system-compass access | — | blocked | system-compass access (user) | Await access authorization |
| Delayed-data (F-006/F-007) | Compass delayed-data blank (system-compass) | Phase 2/3 packets | **BLOCKED** | system-compass access | — | blocked | system-compass access (user) | Await access authorization |
| F-013 etc. | Any remaining system-compass source findings | Phase 2 | BLOCKED | access | — | blocked | access | Await access |
| CONTRIB-376 follow-up | Verify remaining gap with maintainers + close/annotate issue #376 (code already fixed upstream; PR #391 open) | Phase 5/6 | **NEEDS DECISION** | maintainer interaction | low | prepared | maintainer contact authorization | If Phase 7 authorizes issue actions, comment on #376 noting the upstream fix + PR #391; otherwise leave |

## 3. Unresolved Ix findings

- **F-009 (patches dead code)**: resolved-by-upstream (PR #390 open). Monitor; do not duplicate.
- **F-008 (version-series mismatch)**: resolved-by-upstream (PR #391 open). Issue #376 hygiene remains.
- **F-010/F-011/F-012 (remap)**: addressed by PR #393 (open). Await merge; no further action unless #393 is closed unmerged.
- **F-001..F-007, F-013**: system-compass blocked.

## 4. PR / issue / deployment states to track

- PR **#393** (ours, remap): track for CI result + merge. If `mergeable_state` stays `blocked` due to a missing required check, no action needed from us (CI runs on the fork head; upstream will review).
- PRs **#390/#391/#392/#388**: upstream; not ours. Do not touch.
- Issue **#371**: cross-referenced to #390. Do not touch unless authorized.
- Issue **#376**: cross-referenced to #391. Open; 0 comments. Needs maintainer annotation (authorized action only).
- Pages **https://alot1z.github.io/Ix-findings/**: live. Workflow auto-redeploys on `planning/**`, manifest, or pr-packets changes to master.

## 5. Protected / do-not-touch

- `E:/E-github-repos/Ix` — `feat/ix-agent-skill` @ `b038c46`, 14 dirty. **NEVER modify.**
- `E:/E-github-repos/ix-compass-dist` — `main` @ `396426b`, 3 dirty. **NEVER modify.**
- `E:/E-github-repos/Ix-remap` — branch now `1497596` (pushed); backup refs `backup-c021b52`, `backup-a05e740`. Preserve.
- Upstream `ix-infrastructure/Ix` — read-only.
- system-compass — private; no access attempts.

## 6. Authorization gates for Phase 7 (defaults)

| Gate | Default | Required for |
|---|---|---|
| PR merge | NOT authorized | merging #393 (only if upstream asks/authorizes) |
| Issue actions | NOT authorized | commenting/closing #371/#376 |
| Maintainer contact | NOT authorized | any outreach |
| System-compass access | BLOCKED | F-key/delayed work |
| Further Pages changes | authorized for regenerable data updates (workflow already live) | content refresh |
| Upstream push | PROHIBITED forever | n/a |

## 7. Exact next implementation order (Phase 7)

1. **Verify PR #393 CI result** (read-only). If green, leave for upstream review. If red, inspect failure (locally reproducible fixes only; no commit to upstream).
2. **Monitor #390/#391** (read-only). If either closes unmerged, re-open the superseded packets (PACK-371 / CONTRIB-376) as live candidates.
3. **Local optional work**: CAND-006 repro, CAND-019 docs scoping — no authorization needed.
4. **If the user authorizes issue actions**: annotate issue #376 (fixed upstream, PR #391) and #371 (PR #390) with the verified facts; do not close without maintainer confirmation.
5. **Reconcile fork main** (`5488741` → `ffe21f0`, 3 commits) only if a future fork-based contribution requires it; otherwise leave.
6. **Knowledge-ledger hygiene**: keep manifest/data.js/standalone/public in sync whenever upstream state changes; the Pages workflow does this automatically on push.

## 8. Phase 7 objective (recommended)

> **Verify and steward the submitted work**: confirm PR #393 is healthy (or fix locally if CI fails), track the two upstream supersession PRs, and advance only authorization-free local candidates (CAND-006/CAND-019) — while keeping every protected worktree and the upstream untouched.
