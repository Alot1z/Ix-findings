# PHASE LADDER — Autonomous Workflow Roadmap (v2, 2026-08-11)

> The complete phase architecture for the Ix / Compass / Ix-findings ecosystem.
> Phases 0–6 executed (reports in `CLI-HANDOFF/phase-0..6`). Phase 7 executed
> (reconciliation, `CLI-HANDOFF/phase-7`). **Phases 8–13 are the full
> independent mega prompts** — grounded in the real repositories, designed to be
> executed by any agent, each self-contained and authorization-gated.
>
> Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
> `ix-infrastructure/*` repository. External writes ONLY to `Alot1z/Ix`,
> `Alot1z/system-compass` (does not exist — private upstream; do not fabricate),
> and `Alot1z/Ix-findings`.** Every prepared PR is submitted only on explicit
> user instruction.

| Phase | Title | Objective | Status |
|---|---|---|---|
| 0 | Complete existing-state reconciliation | Baseline every repo/worktree/remote | ✅ COMPLETE |
| 1 | Tooling, skill, architecture & history archaeology | Inventory tools, skills, history | ✅ COMPLETE |
| 2 | Knowledge, evidence & cross-project reconciliation | Findings/evidence/decisions graph | ✅ COMPLETE |
| 3 | Engineering opportunity, bug, enhancement & backlog analysis | Candidates CAND-001…CAND-020 | ✅ COMPLETE |
| 4 | Controlled implementation foundation | Graph repair, packets, gates | ✅ COMPLETE |
| 5 | Authorization-gated contribution & reproduction | Rebase, fork sync, supersessions | ✅ COMPLETE |
| 6 | Controlled external contribution & publication | Remap PR #393, Pages deploy | ✅ COMPLETE |
| 7 | Post-contribution stewardship & final reconciliation | #393 verified, supersessions merged, issues catalogued, ledger pushed | ✅ COMPLETE (`91f38cf`) |
| **8** | **`ix mcp` fork implementation (#219)** | **Design + build + register + test + push `feat/ix-mcp`** | **READY** |
| **9** | **`ix mcp` hardening, security & real-client verification** | **Adversarial tests, cross-platform, E2E with MCP clients** | **READY** |
| **10** | **Compass fork readiness & source-gated implementation** | **F-key/delayed-data spec-final; fork gate; implement if access** | **READY** (expected BLOCKED) |
| **11** | **Ecosystem second-order reconciliation** | **#385/#349 verification harnesses, plugin alignment, CAND-006/019, F-013** | **READY** |
| **12** | **Contribution packaging & pre-submission gate** | **Complete PR packets + review pass + submission triggers** | **READY** |
| **13** | **Final ledger close-out & master report** | **Master report, wiki/pages, final audit, archive** | **READY** |

## Phase family map (what each family does)

| Family | Phases | Character |
|---|---|---|
| Discovery/reconciliation | 0–2, 7, 11 | Read-only archaeology; registry truth |
| Analysis/backlog | 3, 11 | Candidate/finding classification |
| Implementation | 4, 8, 9, 10 | Build on the fork; test hard |
| Contribution | 5, 6, 12 | Push fork, package, gate |
| Publication | 6, 13 | Pages, master report |

## Transition rule (auto-continue)

After any phase completes, the **AUTONOMOUS NEXT-PHASE PROMPT GENERATOR** (from
the ChatGPT export) derives the next phase from the actual ending state — never
blindly increments. Phases 8–13 are pre-authored so the controller can also be
bypassed by direct instruction ("execute Phase N").

## The three standing invariants

1. **Evidence class discipline** — A (source) / B (artifact/runtime) /
   C (reconstruction) / D (inference). Never upgrade class by repetition.
2. **Verification before completion** — no claim of success without
   independent evidence; GitHub API for remote facts; live source for code
   facts.
3. **Authorization boundaries** — fork writes authorized; upstream writes
   prohibited; submissions require explicit user instruction; protected
   worktrees (`Ix b038c46/14`, `ix-compass-dist 396426b/3`) never touched.
