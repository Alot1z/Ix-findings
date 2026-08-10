# PHASE 2 — COMPLETE KNOWLEDGE, EVIDENCE & CROSS-PROJECT RECONCILIATION

**Status: COMPLETE**  
**Generated: 2026-08-10**  
**Method: live filesystem + Git + GitHub API + registry/graph parsing — every material claim verified against primary evidence**

---

## 1. STATUS

**COMPLETE.** All reconciliation objectives met. No blocker prevents Phase 2 completion; the system-compass source-access blocker is documented as a real external boundary, not a phase failure.

---

## 2. EXECUTIVE RESULT

Phase 2 produced the authoritative cross-project knowledge model for the investigation workspace. Key outcomes:

1. **Graph count discrepancy fully explained**: the graph has been **152 nodes / 136 edges since the initial commit**; the manifest's 290/240 claim was inherited from a GRAPH-AUDIT.md expansion *narrative* that was never written into the graph file.
2. **"28 evidence" explained**: the graph carries 28 evidence **nodes** (3 phantom: E-026/027/028); the registry has 25 **records** — registry is authoritative.
3. **PR/issue corrections**: **#371 and #376 are ISSUES, not PRs** (C-007/C-008 RESOLVED via GitHub API).
4. **New discoveries**: PRs #375 (fixes #374), #378, #380, #382 and issues #377, #379 verified live — absent from graph and PR-MATRIX.
5. **All 13 findings classified**; all 25 evidence reconciled; all 33 suggestions and 14 decisions audited.
6. **Protected work verified unchanged** across all worktrees.

---

## 3. KNOWLEDGE MODEL

See `KNOWLEDGE-MODEL.json` — entity classes (project, repository, fork, branch, worktree, commit, release, file, symbol, API, finding, evidence, issue, PR, decision, suggestion, contribution, test, phase, artifact, security-control, CI-workflow) with deterministic IDs, authority tiers (T1–T5), and a 15-type relationship model. Graph: 152 nodes / 136 edges (authoritative).

---

## 4. FINDINGS (13)

| Finding | Repo | Class | Reconciled status | Confidence |
|---|---|---|---|---|
| F-001 Keyboard handler invariant | system-compass | B | ACTIVE | HIGH |
| F-002 F/f unbound | system-compass | B | ACTIVE | HIGH |
| F-003 KeyboardHelp no F | system-compass | B | ACTIVE | HIGH |
| F-004 Fit math invariant | system-compass | B | ACTIVE | HIGH |
| F-005 #57 fit latch→keyed refit | system-compass | A+B | **RESOLVED** (covered by #57) | CONFIRMED |
| F-006 Delayed-data blank | system-compass | B+C | ACTIVE | HIGH |
| F-007 Rollup timing | system-compass | B | ACTIVE | MEDIUM |
| F-008 ix upgrade version mismatch | Ix | A | ACTIVE (issue #376 OPEN) | CONFIRMED |
| F-009 patches dead code | Ix | A | ACTIVE (issue #371 OPEN) | CONFIRMED |
| F-010 Loopback-hardened remap | Ix | A | PARTIALLY_RESOLVED (branch pushed, no PR) | CONFIRMED |
| F-011 WSL bootstrap fix | Ix | A | PARTIALLY_RESOLVED (in remap) | CONFIRMED |
| F-012 node_ok removal | Ix | A | PARTIALLY_RESOLVED (in remap) | CONFIRMED |
| F-013 Zoom ×1.25 vs ×1.1 | system-compass | D | BLOCKED | LOW |

**Correction:** F-005 reclassified RESOLVED — auto-frame must NOT be re-added (#57 covers it; S-032/S-033 SUPERSEDED).

---

## 5. EVIDENCE (25)

Authoritative count **25** (registry). All 25 verified current. Class breakdown: A=9, B=13, C=1 (E-025), plus release-note A (E-008). The 28 claim = graph node count including 3 phantom nodes (E-026/027/028, content overlapping E-017/E-018/E-019). Full record in `EVIDENCE-RECONCILIATION.json`.

---

## 6. SUGGESTIONS (33)

| Reconciled | Count | IDs |
|---|---|---|
| IMPLEMENTED | 12 | S-001..S-006, S-008..S-012, S-016 |
| PARTIALLY_IMPLEMENTED | 1 | S-015 |
| STILL_VALID | 4 | S-013, S-014, S-018, S-020 |
| BLOCKED | 3 | S-007, S-017, S-019 |
| DECLINED (was REJECTED) | 11 | S-021..S-031 |
| SUPERSEDED | 2 | S-032, S-033 |

---

## 7. DECISIONS (14)

- **CURRENT (9):** D-001..D-009 — all verified against live state (worktree exists, branch based on origin/main, evidence classes applied, fork synced).
- **OPEN (5):** D-010 (Compass port location), D-011 (Compass PR scope), D-012 (no-map chip timing), D-013 (stopgap patch fate), D-014 (system-compass access path — requires user decision).
- None superseded or reversed.

---

## 8. CONTRADICTIONS

| ID | Resolution | Status |
|---|---|---|
| C-001 | Manifest inherited un-materialized graph expansion | RESOLVED |
| C-002 | same | RESOLVED |
| C-003 | 28 = graph evidence *nodes*; 25 = registry *records*; 3 phantoms | RESOLVED |
| C-004 | both handoff dirs exist; old is empty & locked | OPEN (fs lock) |
| C-005 | 2 wiki files modified + untracked phase-2 dir | OPEN |
| C-006 | FREEBUFF-CLI-PROMPT.md still present | OPEN |
| C-007 | **#376 is an ISSUE, not a PR** (API-verified) | RESOLVED |
| C-008 | **#371 is an ISSUE, not a PR** (API-verified) | RESOLVED |

---

## 9. GRAPH

- Authoritative: **152 nodes / 136 edges** (unchanged since `daff6f9`).
- Legacy v1: 58/46. Manifest claim 290/240 never existed in the file.
- 42 relationship types. **8 dangling edges found** (endpoint validation): 4 decision→suggestion `implements` edges (D-001→S-002, D-002→S-001, D-005→S-007, D-006→S-008) referencing absent suggestion nodes; 4 stale-claim→file `found_in` edges (S-034..S-037) referencing absent file nodes. Recorded for later-phase repair (CAND-009).
- Gaps for later phases: PRs #373/#375/#378/#380/#382, issues #377/#379 not yet in graph (CAND-003).

---

## 10. COMPASS

- Current explorer: `planning/wiki/` — static, data generated by `build-data.mjs` into `data/data.js`, inlined into standalone HTML (~170 KB). 22 views.
- Data contract for a future Compass documented (query surface: search/getEntity/getRelated/getEvidence/... — Phase 2 defines the contract; UI rebuild is a later phase).
- GitHub Pages feasibility: **YES** (see `GITHUB-PAGES-FEASIBILITY.md`) — requires sanitization profile before deployment (CAND-008, NEEDS_DECISION).

---

## 11. SYSTEM-COMPASS

Private (HTTP 404), no fork, source unavailable — unchanged. 8 findings mapped to it (F-001..F-007, F-013); F-005 RESOLVED via #57. Contribution scopes (F-key, delayed-data) prepared as specs; auto-frame explicitly excluded. No access requested, no fork created, no source fabricated. See `SYSTEM-COMPASS-KNOWLEDGE.md`.

---

## 12. FREEBUFF / FORGE

- `Alot1z/freebuff-forge` @ `441cec670` on `feat/modkit-enhancement-layer`, **clean**, remotes origin + upstream(CodebuffAI/freebuff).
- **No Ix findings map to Freebuff** — separate project (NO_RELATIONSHIP). Modkit enhancement layer is Freebuff-only work.
- Freebuff CLI/agents/tools/modkit fully inventoried in Phase 1 (`FREEBUFF-CLI-SKILLS.json`); no new Phase 2 findings.

---

## 13. CANDIDATE WORK

11 evidence-backed candidates (`CANDIDATE-WORK.json`): 7 READY (manifest fix, phantom-node reconciliation, PR/issue graph update, PR-MATRIX fix, GRAPH-AUDIT fix, graph enrichment, dangling-edge repair), 3 NEEDS_EVIDENCE (PACK-371, Playwright delayed-data, F-008/F-009 reproduction), 1 NEEDS_DECISION (GitHub Pages). Speculative items explicitly excluded.

---

## 14. CONTRIBUTION READINESS

| Candidate | State | Blocker | Next safe action |
|---|---|---|---|
| remap hardening (c021b52) | **READY** | user authorization only | push exists; open PR upon explicit go-ahead |
| ix-376 (F-008) | NEAR_READY | reproduction on current main | fresh test in Ix-test |
| patches dead-code (F-009) | NEEDS_EVIDENCE | no packet; check PR #372 overlap | prepare PACK-371 |
| compass F-key | BLOCKED | system-compass access | user decision on D-014 |
| compass delayed-data | BLOCKED | system-compass access | optional Playwright repro on public dist |
| agent-skill (b038c46) | IN_DEVELOPMENT | 14 dirty, PROTECTED | continue development |

No contribution is marked READY beyond the already-pushed remap branch; nothing was submitted.

---

## 15. UNKNOWNS

| Unknown | Why | Resolution |
|---|---|---|
| system-compass source/architecture | private 404 | D-014 access decision |
| #58/#59 contents | private repo | same |
| F-013 zoom cause | Class D inference | source or dedicated experiment |
| PR #372 vs patches registration | not inspected post-merge | read diff |
| Freebuff Forge upstream divergence | not measured | fetch upstream + log compare (U-003) |

---

## 16. BLOCKERS

| Blocker | Impact |
|---|---|
| B-001 system-compass private | 8 findings source-unverifiable; F-key/delayed contributions blocked |
| B-002 no Alot1z/system-compass fork | no contribution preparation path |
| B-005 old handoff dir locked | dangling empty dir remains |

---

## 17. PROTECTED WORK (verified unchanged)

| Worktree | Head | Dirty | Phase 2 changed? |
|---|---|---|---|
| Ix primary (`feat/ix-agent-skill`) | `b038c46` | 14 | **NO** |
| Ix-remap (`feat/ix-remap-hardening`) | `c021b52` | 0 | **NO** |
| Ix-test | `c4f8fea` | 0 | **NO** |
| ix-compass-dist | `396426b` | 3 (pre-existing untracked tarballs) | **NO** |
| freebuff-forge | `441cec670` | 0 | **NO** |

---

## 18. SKILLS USED

| Skill | Used | Purpose |
|---|---|---|
| source-driven-development | ✅ | registry/graph/API over reports |
| verification-before-completion | ✅ | every count/state re-verified live |
| doubt-driven-development | ✅ | challenged 290/240 and 28-evidence claims to root cause |
| sequential-thinking | ✅ | contradiction → graph → PRs → contributions ordering |
| git-workflow-and-versioning | ✅ | git show/status/log plumbing |
| find-docs / deepwiki | ✅ (GitHub API) | PR/issue live metadata |

---

## 19. TOOLS USED

| Tool | Purpose |
|---|---|
| read_files | Phase 0/1 input ingestion |
| basher | live git/GitHub/registry parsing (protected read-only) |
| write_file | JSON model + reports |
| write_todos | task tracking |
| spawn_agents | parallel evidence gathering |

---

## 20. EXTERNAL ACTIONS

```
PRs created: 0
Issues created: 0
Reviews submitted: 0
Comments submitted: 0
Maintainers contacted: 0
Repositories created: 0
Merges performed: 0
Force pushes: 0
Upstream mutations: 0
GitHub Pages deployments: 0
git push: 0 (Phase 2 itself; Ix-findings commit below is local-published to the user's own repo)
```

GitHub API reads: read-only metadata only (PRs/issues/repos). No mutations.

---

## 21. FILES CREATED

| File | Type |
|---|---|
| `CLI-HANDOFF/phase-2/KNOWLEDGE-MODEL.json` | machine-readable |
| `CLI-HANDOFF/phase-2/FINDING-RECONCILIATION.json` | machine-readable |
| `CLI-HANDOFF/phase-2/EVIDENCE-RECONCILIATION.json` | machine-readable |
| `CLI-HANDOFF/phase-2/SUGGESTION-RECONCILIATION.json` | machine-readable |
| `CLI-HANDOFF/phase-2/DECISION-RECONCILIATION.json` | machine-readable |
| `CLI-HANDOFF/phase-2/CONTRIBUTION-CORRELATION.json` | machine-readable |
| `CLI-HANDOFF/phase-2/CROSS-PROJECT-MAP.json` | machine-readable |
| `CLI-HANDOFF/phase-2/CANDIDATE-WORK.json` | machine-readable |
| `CLI-HANDOFF/phase-2/GRAPH-RECONCILIATION.md` | report |
| `CLI-HANDOFF/phase-2/GITHUB-PAGES-FEASIBILITY.md` | report |
| `CLI-HANDOFF/phase-2/SYSTEM-COMPASS-KNOWLEDGE.md` | report |
| `CLI-HANDOFF/phase-2/PHASE-2-REPORT.md` | this report |

---

## 22. INTEGRITY CHECKS

| Check | Result |
|---|---|
| All 8 JSON artifacts parse | ✅ (node JSON.parse) |
| No secrets/tokens in phase-2 files | ✅ |
| Protected worktrees unchanged | ✅ (5 worktrees verified) |
| No external mutation | ✅ |
| Phase 0/1 files preserved | ✅ |
| Registry/graph counts match recorded | ✅ |

---

## 23. PHASE 3 INPUT

Phase 3 must consume:

```text
CLI-HANDOFF/phase-2/KNOWLEDGE-MODEL.json
CLI-HANDOFF/phase-2/FINDING-RECONCILIATION.json
CLI-HANDOFF/phase-2/EVIDENCE-RECONCILIATION.json
CLI-HANDOFF/phase-2/SUGGESTION-RECONCILIATION.json
CLI-HANDOFF/phase-2/DECISION-RECONCILIATION.json
CLI-HANDOFF/phase-2/CONTRIBUTION-CORRELATION.json
CLI-HANDOFF/phase-2/CROSS-PROJECT-MAP.json
CLI-HANDOFF/phase-2/CANDIDATE-WORK.json
CLI-HANDOFF/phase-2/GRAPH-RECONCILIATION.md
CLI-HANDOFF/phase-2/GITHUB-PAGES-FEASIBILITY.md
CLI-HANDOFF/phase-2/SYSTEM-COMPASS-KNOWLEDGE.md
CLI-HANDOFF/phase-2/PHASE-2-REPORT.md
```

Plus preserved Phase 0/1 artifacts. Do not delete prior phase records.
