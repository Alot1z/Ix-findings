# Ix Contribution Campaign — Forensic Research Report

Date: 2026-08-17
Agent: Alot1z autonomous Ix engineering system
Evidence: live GitHub API via `gh` (all facts OBSERVED/VERIFIED on 2026-08-17), local git state, findings registry, explorer graph.

---

## Executive Summary

The Alot1z contribution campaign produced **one merged upstream PR (#448)** carrying Alot1z's exact commit (`5efd8f18`, grouped PHP `use` imports), **six audit-finding comments** on upstream PRs #443/#445/#446 (F-014, F-016, F-017, F-019 plus two multi-namespace cases), and **five fork fix branches** that were never merged upstream. The maintainers (Hiro-Chiba first, then KageBinary) independently implemented and merged their own consolidated fixes (#443-#447) for the same subsystems. **No maintainer ever replied to an Alot1z finding comment**, yet all PRs were merged within minutes on 2026-08-16T19:21–19:30Z. The audit's fork fixes (cba11a3, f9274cc, 0a7d97f, f577492, 0701040) remain fork-only; whether the F-014/F-016/F-017/F-019 bugs still reproduce on upstream `main` (8be5f110) is **UNVERIFIED** and requires live reproduction — the merged #446 still contains the flagged commit `83b9be42`.

## Contribution Timeline

| T | Date (UTC) | Event | Evidence |
|---|---|---|---|
| T0 | 2026-08-14 | Hiro-Chiba opens #434, #436, #440, #442 (renamed imports, MCP cap, tsconfig mapping, PHP namespace) | PR list |
| T1 | 2026-08-14 | KageBinary reviews those PRs; CodeQL bot posts DoS alerts on #440/#442 | comments |
| T2 | 2026-08-14/15 | KageBinary opens consolidated upstream PRs #443-#446 (guards/fixes on Hiro's commits) | PR list |
| T3 | 2026-08-15T04:04+02 | Fork commit 0701040 (multi-namespace guard, on top of upstream #446 branch) | local git |
| T4 | 2026-08-15T02:05 | Alot1z comment on #446: two multi-namespace cases | #446 comments |
| T5 | 2026-08-15T13:35 | Alot1z comment on #446: clarification re fork commits 13b7bf0/82aeb28 | #446 comments |
| T6 | 2026-08-15T17:05 | Alot1z comment on #446: global↔namespace boundary regression (F-014) | #446 comments |
| T7 | 2026-08-15T17:30+02 | Fork commit 0a7d97f (namespace-scope boundary fix) | local git |
| T8 | 2026-08-15T20:36/20:38+02 | Fork commits cba11a3 (#443 guard), f9274cc (#445 guard) | local git |
| T9 | 2026-08-16T01:02 | Alot1z comments on #443 (F-016), #445 (F-017), #446 (F-019) | comments |
| T10 | 2026-08-16T01:15+02 | Fork commit f577492 (same-line sibling FQCN fix) | local git |
| T11 | 2026-08-16T03:20+02 | Fork commit 5efd8f1 (grouped use imports, parent 043bc68) | local git |
| T12 | 2026-08-16 (day) | Alot1z opens **#448** from `Alot1z:fix/php-grouped-use-imports` | PR list |
| T13 | 2026-08-16T19:21–19:30 | KageBinary merges **#444, #443, #445, #447, #448, #446, #442, #436** in a batch; closes #434/#440 unmerged | PR list |
| T14 | 2026-08-16T19:30–19:31 | KageBinary posts "Landed on main" updates on #434/#436/#440 | comments |
| T15 | 2026-08-17 | Upstream main = 8be5f110; only open PR is #455 (josephismikhail) | PR list |

## PR Matrix (live state, 2026-08-17)

| PR | Author | Head repo | State | Merged at | Merged by | Files | +/- | Alot1z commits | Alot1z comments |
|---|---|---|---|---|---|---|---|---|---|
| #434 | Hiro-Chiba | Hiro-Chiba/Ix | closed (unmerged) | — | — | — | — | no | no |
| #436 | Hiro-Chiba | Hiro-Chiba/Ix | merged | 08-16T19:21:58 | KageBinary | — | — | no | no |
| #440 | Hiro-Chiba | Hiro-Chiba/Ix | closed (unmerged) | — | — | — | — | no | no |
| #442 | Hiro-Chiba | Hiro-Chiba/Ix | merged | 08-16T19:29:54 | KageBinary | — | — | no | no |
| #443 | KageBinary | ix-infrastructure/Ix | merged | 08-16T19:22:06 | — | 2 | +59/-1 | no | **1 (F-016)** |
| #444 | KageBinary | ix-infrastructure/Ix | merged | 08-16T19:21:52 | — | 3 | +117/-3 | no | no |
| #445 | KageBinary | ix-infrastructure/Ix | merged | 08-16T19:22:28 | — | 6 | +1094/-4 | no | **1 (F-017)** |
| #446 | KageBinary | ix-infrastructure/Ix | merged | 08-16T19:29:52 | — | 6 | +1061/-33 | no | **4 (F-014, F-019, multi-namespace ×2)** |
| #447 | KageBinary | ix-infrastructure/Ix | merged | 08-16T19:28:10 | — | 2 | +215/-5 | no | no |
| #448 | **Alot1z** | **Alot1z/Ix-remap** | merged | 08-16T19:26:29 | KageBinary | 4 | +113/-0 | **yes (5efd8f18)** | no |
| #455 | josephismikhail | — | open | — | — | — | — | no | no |

Merged campaign impact: **+2,659 / −46 across 6 PRs** (#443–#448).

## Commit Matrix (Alot1z)

| Commit | Branch (fork) | Parent | Date | Upstream? |
|---|---|---|---|---|
| 0701040 | fix/446-multi-namespace-guard | e786f20 (#446 commit) | 08-15T04:04+02 | **NO** |
| 0a7d97f | fix/446-namespace-scope-boundary | — | 08-15T17:30+02 | **NO** |
| cba11a3 | fix/443-renamed-import-member-guard | eab1075 (#443 head) | 08-15T20:36+02 | **NO** |
| f9274cc | fix/445-renamed-import-member-guard | adc97c1 (#445 head) | 08-15T20:38+02 | **NO** |
| f577492 | fix/446-namespace-scope-boundary | — | 08-16T01:15+02 | **NO** |
| **5efd8f18** | fix/php-grouped-use-imports | 043bc68 (main) | 08-16T03:20+02 | **YES — merged via #448** |

The fork fix branches were built **on top of the upstream PR branch heads** (parents e786f20/eab1075/adc97c1), i.e. the audit applied fixes to the PR code and pushed them as public fork branches. All five branches exist on `Alot1z/Ix-remap` (verified via ls-remote).

## Finding Matrix

| ID | Finding | Commented on | Status | Upstream disposition |
|---|---|---|---|---|
| F-014 | #446 global↔namespace scope-boundary regression | #446 (08-15T17:05) | FIXED_FORK | UNVERIFIED on main (fork fix 0a7d97f not merged) |
| F-016 | #443 renamed-import fallback binds to provider members | #443 (08-16T01:02) | FIXED_FORK | UNVERIFIED on main (fork fix cba11a3 not merged) |
| F-017 | #445 configured-binding path binds to provider members | #445 (08-16T01:02) | FIXED_FORK | UNVERIFIED on main (fork fix f9274cc not merged) |
| F-019 | #446 FQCN index drops same-line sibling PHP types | #446 (08-16T01:02) | FIXED_FORK | **OBSERVED still risky**: merged #446 contains the flagged commit 83b9be42; reproduction UNVERIFIED |
| F-020 | single-char symbol names lose edges | — | OPEN | No PR; still live (UNVERIFIED) |
| F-021 | grouped `use Vendor\{A,B};` captures zero IMPORTS | — (PR #448) | **FIXED_UPSTREAM** (updated 08-17) | **MERGED** via #448, exact commit 5efd8f18 |

## Comment / Communication Matrix

Alot1z posted **6 comments** total (all audit findings), zero replies received:

| PR | Alot1z comment | Classification |
|---|---|---|
| #443 | 08-16T01:02 — renamed-import fallback binds provider members | BUG_REPORT (F-016) |
| #445 | 08-16T01:02 — configured mapping binds provider members | BUG_REPORT (F-017) |
| #446 | 08-15T02:05 — two multi-namespace guard cases | EVIDENCE |
| #446 | 08-15T13:35 — clarification re fork commits 13b7bf0/82aeb28 | CLARIFICATION |
| #446 | 08-15T17:05 — global↔namespace boundary (F-014) | BUG_REPORT (F-014) |
| #446 | 08-16T01:02 — FQCN drops same-line siblings (F-019) | BUG_REPORT (F-019) |

Maintainer comments were addressed to **Hiro-Chiba** ("your commits keep their authorship", "Landed on main — your commit 819d67e…"). The CodeQL security bot posted DoS alerts on #440 (incomplete string escaping) and #442 (polynomial regex ReDoS) — both called "stale" by KageBinary after the fixes.

## Maintainer Reception

| Interaction | Classification |
|---|---|
| Alot1z findings on #443/#445/#446 | **NO RESPONSE** (no reply in any thread) |
| #448 (Alot1z PR) | **ACCEPTED + MERGED** (by KageBinary, 08-16T19:26) |
| Fork fix branches | **NOT INCORPORATED** (never referenced or cherry-picked) |
| Upstream fixes for same bugs | Implemented independently by Hiro-Chiba + KageBinary |

Inference discipline: silence is not rejection — but the fork fixes were demonstrably never merged (commit ancestry verified: upstream #443-447 heads contain only Hiro-Chiba + KageBinary commits).

## Notification Forensics

GitHub does not expose per-user notification records via the public API — the *receipt* of notifications is **NOT DETERMINABLE FROM AVAILABLE GITHUB DATA**. The evidence-supported **mechanisms** per PR:

| PR | Alot1z PR author? | Alot1z comment? | Alot1z commits in PR? | Fork branch head? | Mechanism | Confidence |
|---|---|---|---|---|---|---|
| #448 | **YES** | no | **YES (5efd8f18)** | **YES** | author + commit author + branch owner → notifications on merge/close/CI | HIGH (mechanism certain; receipt not observable) |
| #443 | no | **YES** | no | no | comment participation → thread subscription → merge notification | HIGH |
| #445 | no | **YES** | no | no | comment participation → thread subscription → merge notification | HIGH |
| #446 | no | **YES** | no | no | comment participation → thread subscription → merge notification | HIGH |
| #444/#447 | no | no | no | no | no mechanism found (watching/mention unobservable) | NOT DETERMINABLE |
| #434/#436/#440/#442 | no | no | no | no | no mechanism found | NOT DETERMINABLE |

Answers:
- **Did comments cause the notification?** YES for #443/#445/#446 (comment-author subscription — the batch merge at 08-16T19:22-29 triggered "merged" notifications). NO (no comment) for the rest.
- **Did commits cause the notification?** YES for #448 (Alot1z authored the sole commit + the PR). NO for #443-447 (no Alot1z commits upstream).
- **Commit authorship ≠ PR authorship ≠ notification causation** — the campaign's fork fixes (cba11a3 etc.) generated NO upstream notifications because they were never in an upstream PR.

## Technical Impact (merged, evidence = PR metadata)

| Dimension | Impact |
|---|---|
| Correctness | #443 renamed-import default guard; #445 module-mapping authority; #446 PHP namespace/clause scoping; #448 grouped-use imports |
| Security | #445 bounded/confined tsconfig reads + containment against the actually-opened file (symlink); #446 ReDoS bound + clause scoping; #447 discovery symlink-escape confinement — the campaign-era PRs carried the bulk of the security work, but it was authored by the maintainers, not Alot1z |
| Tests | Merged PRs carried regression tests; Alot1z's #448 added per-member capture, alias exclusion, and resolveEdges tests (fail-before on main, per PR body) |
| Architecture | All fixes reused existing query/index/resolver structure; no API changes |

Alot1z's measured upstream contribution: **1 PR merged (+113/-0, 4 files), 6 finding comments, 0 of the fork fixes merged.** The audit's value was diagnostic (F-014..F-021 documented a real class of namespace/import/indexing bugs); the merged code came from maintainer implementations.

## Agent-System Impact

| Capability | Before | After | Justification |
|---|---|---|---|
| Live PR verification | prose rule | mandatory gate | campaign showed live state changes hourly (all merges happened between captures) |
| Freshness gate | existed | **proven live**: it failed closed when upstream advanced (043bc68→8be5f110) mid-session | directly justified |
| Duplicate/comment discipline | prose | registry + governance | no duplicates occurred |
| Authorization routing | prose | `authorization-check` skill (this session) | directly justified |
| Explorer correctness | — | 2 defects found+fixed (numeric fields, finding statuses) | directly justified |
| Notification interpretation | absent | this forensics report | directly justified |

## Knowledge-Graph Status

Graph refreshed to live state (8be5f110, open PRs [455], open issues [425,429,433,439]); campaign PRs reconcile to RESOLVED (442-448) / HISTORICAL (434, 440); F-021 now RESOLVED. Freshness gate PASS, public validation PASS, freshness tests pass (incl. new manifest live_baseline regression). Registry surgical update: F-021 PR_OPEN→FIXED_UPSTREAM (merged 08-16, commit 5efd8f18, merge cf39184).

## Contribution Quality Scorecard

| Dimension | Score | Rationale |
|---|---|---|
| Technical correctness | 8/10 | F-021 fix merged as-is; findings precise (F-014/16/17/19 documented with reproducers) |
| Reproducer quality | 9/10 | compact valid fixtures; multi-state matrices |
| Regression testing | 8/10 | fail-before/pass-after discipline; #448 86/86 suites |
| Security awareness | 6/10 | audit tracked DoS/authority/symlink classes; no new security findings produced by Alot1z |
| Duplicate avoidance | 8/10 | #448 verified non-duplicate; no competing PR opened |
| Upstream awareness | 7/10 | #448 based on current main; fork fixes targeted PR branches |
| Communication | 6/10 | findings posted clearly but never followed up; no maintainer reply solicited |
| Documentation | 9/10 | registry + explorer + this report |
| Verification discipline | 9/10 | tool honesty; live-state checks; gates |
| Project value | 7/10 | 1 merged fix + diagnostic corpus; main fixes authored by maintainers |
| Agent-system maturity | 8/10 | self-upgraded governance + skills during the campaign |

## Missed / Open Items

- **F-014, F-016, F-017, F-019** — upstream `main` (8be5f110) reproduction **UNVERIFIED**; the merged #446 still contains flagged commit 83b9be42. Recommended: run the four reproducers against upstream main (requires Ix backend/build — UNAVAILABLE this session).
- **F-020** (single-char symbols) — OPEN, no PR, reproduction UNVERIFIED.
- Maintainer silence on findings — no action possible from this side.
- Fork main now trails upstream (~17 commits: the merged campaign code + dependabot) — fork is agent-infra-only, so no sync is required, but the invariant should be documented.

## Lessons Learned

- **Ix:** namespace/import/indexing resolution is a deep correctness surface; grouped-use and same-line constructs are real gaps.
- **GitHub:** comment participation subscribes the author to merge/close notifications; batch merges generate notification storms; commit authorship and PR authorship are separate notification triggers.
- **Engineering:** live upstream state changes faster than any snapshot — freshness gates must be the default, not a ceremony.
- **Agent:** findings without a follow-up ask get no reply; a merged PR with the author's exact commit is the strongest possible acceptance signal.
- **Governance:** keep fork fixes on PR-branch ancestry (already done), keep the authorization-check routing, keep notification claims at "mechanism, not receipt".

## Recommended Next Actions

- **P0** — Reproduce F-014/16/17/19 against upstream main 8be5f110 when the Ix backend is available; update the registry with the outcome (and F-020).
- **P1** — Document the fork-trails-upstream invariant in the fork knowledge.md; add a "campaign merged" entry to the PR-AUDIT.
- **P2** — Add an `alot1z-comment` + `merged` event capture to the phase-c capture (already extended prTargets).
- **P3** — Optional: reopen communication on F-014/F-016/F-017/F-019 only with fresh main reproduction evidence.

## Evidence Appendix

- Commands: `gh api repos/ix-infrastructure/Ix/pulls?...`, `/pulls/N/commits`, `/issues/N/comments`, `/pulls/N/comments`, `git ls-remote Alot1z/Ix-remap`, local `git log` on fork branches.
- SHAs: upstream main 8be5f110; merged PR heads 819d67e0/033181fb/7d834235/83079ff3/6233b498/5efd8f18; fork fixes cba11a3/f9274cc/0701040/0a7d97f/f577492/5efd8f1; #448 merge cf39184.
- Timestamps: all merge times 2026-08-16T19:21–19:30Z (KageBinary).
- Repos: ix-infrastructure/Ix (upstream, read-only), Alot1z/Ix-remap (fork), Alot1z/Ix-findings (this report).
- Tool availability: GitHub CLI + API AVAILABLE; Ix CLI/backend UNAVAILABLE (no live graph reproduction); RavelScope UNAVAILABLE (no structural tracing this session); subagents not spawned (direct analysis used).
- Evidence confidence: all PR/comment/commit facts OBSERVED via API; notification receipt NOT DETERMINABLE; upstream-bug reproduction UNVERIFIED.
