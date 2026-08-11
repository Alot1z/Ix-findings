# Ix-findings — Canonical Evidence Ledger

Investigation, forensic audit, and contribution workspace for the
[Ix](https://github.com/ix-infrastructure/Ix) / Compass ecosystem.

**→ [Knowledge Explorer (live)](https://alot1z.github.io/Ix-findings/)** ← interactive graph, 15 findings, 30 evidence items, 165-node investigation map.

**Initiated:** 2026-08-10 · **Latest phase:** 14 (independent forensic audit, 2026-08-11)

## Purpose

This repository is the **canonical evidence ledger** for the Ix / Compass investigation.
Every claim is evidence-classified (T1–T5), every reproduction is documented, and every
contribution packet is self-contained. Nothing is fabricated.

## Quick Links

| Resource | Location |
|---|---|
| **Knowledge Explorer** | [alot1z.github.io/Ix-findings](https://alot1z.github.io/Ix-findings/) |
| **Master Report** | [`planning/final/MASTER-REPORT.md`](planning/final/MASTER-REPORT.md) |
| **Latest Phase Report** | [`CLI-HANDOFF/phase-14/PHASE-14-REPORT.md`](CLI-HANDOFF/phase-14/PHASE-14-REPORT.md) |
| **Contribution Inventory** | [`CLI-HANDOFF/phase-12/CONTRIBUTION-INVENTORY.md`](CLI-HANDOFF/phase-12/CONTRIBUTION-INVENTORY.md) |
| **Upstream (Ix)** | [ix-infrastructure/Ix](https://github.com/ix-infrastructure/Ix) |
| **Upstream PRs** | [#393 remap](https://github.com/ix-infrastructure/Ix/pull/393) · [#395 space-in-path](https://github.com/ix-infrastructure/Ix/pull/395) · [#388 brew](https://github.com/ix-infrastructure/Ix/pull/388) |
| **Fork (MCP)** | [`Alot1z/Ix:feat/ix-mcp`](https://github.com/Alot1z/Ix/tree/feat/ix-mcp) (PR-ready, awaiting user go-ahead) |

## Findings (15 total · Phase 14 audit)

| ID | Title | Evidence | Status |
|----|-------|----------|--------|
| F-001 | Keyboard handler invariant across 4 releases | T2 | Source-gated |
| F-002 | F/f genuinely unbound in all releases | T2 | Source-gated |
| F-003 | KeyboardHelp byte-identical, no F entry | T2 | Source-gated |
| F-004 | Fit math constants invariant | T2 | Source-gated |
| F-005 | #57 one-shot fit latch → keyed refit | T1+T2 | Source-gated |
| F-006 | Delayed-data blank (P1 severity) | T3 | Source-gated |
| F-007 | Region rollup timing-dependent | T3 | Medium confidence |
| F-008 | Version-series mismatch in upgrade (#376) | T1 | **Fixed upstream** — PR #391 |
| F-009 | patches command dead/unregistered (#371) | T1 | **Fixed upstream** — PR #390 |
| F-010 | Loopback-hardened /__ix/remap endpoint | T1 | **PR #393 open** (0 reviews) |
| F-011 | WSL bootstrap fix | T1 | In PR #393 |
| F-012 | Dead node_ok removal | T1 | In PR #393 |
| F-013 | Zoom multiplier discrepancy | T5 | Inconclusive — drop from active |
| N-001 | Evidence registry duplicate IDs | T1 | Open — trivial fix |
| N-002 | Fork-main 7 commits behind upstream | T1 | Open — sync when convenient |

## Contributions

| Contribution | Status | Blocker |
|---|---|---|
| **ix mcp** (8 tools, dual-era MCP server) | PR-ready on fork | User go-ahead to submit |
| **ix remap** (/__ix/remap endpoint) | PR #393 open | Maintainer review |
| **Compass F-key** | Spec complete | Source access (forks 404) |
| **Compass delayed-data** | Investigation complete | Source access |

## Evidence Classes

| Tier | Name | Criteria |
|------|------|----------|
| **T1** | Direct source evidence | Source inspected; merged PR diff; live GitHub API data |
| **T2** | Reproducible artifact/runtime | Released tarball, browser runtime, byte comparison, repeatable experiment |
| **T3** | Reproducible behavioral evidence | Live reproduction, deterministic conditions, measurable output |
| **T4** | Historical/documentary | Release notes, issue discussions, commit messages |
| **T5** | Inference/speculation | Plausible but not directly verified — not implementation-ready |

## Repository Structure

```
Ix-findings/
├── CLI-HANDOFF/              ← Phase reports + handoff prompts (phases 0–14)
├── planning/                 ← Canonical registries + knowledge graph
│   ├── findings/             ← Finding registry (F-001..N-002)
│   ├── evidence/             ← Evidence registry (E-001..E-030)
│   ├── suggestions/          ← Suggestion registry (33 items)
│   ├── decisions/            ← Decision registry (14 items)
│   ├── maps/                 ← Graph data, phases, timelines, repositories
│   ├── pages/                ← GitHub Pages build pipeline + public/
│   ├── wiki/                 ← Knowledge explorer shell (data.js, index.html, assets)
│   └── final/                ← MASTER-REPORT.md, EXECUTIVE-SUMMARY.md
├── pr-packets/               ← Self-contained contribution packets
│   ├── ix-mcp/               ← MCP server (issue #219)
│   ├── ix-remap-hardening/   ← /__ix/remap endpoint (PR #393)
│   ├── compass-f-key/        ← F-key fit view (source-gated)
│   └── compass-delayed-data/ ← Delayed-data blank (source-gated)
├── comparisons/              ← Historical Compass reconstruction (Phase 5)
├── github/                   ← GitHub issue/PR context
└── manifests/                ← Legacy index files
```

## Key Constraints

- **Never fabricate** source access, GitHub activity, usernames, PR numbers, or technical facts
- **Never expose** personal filesystem paths, credentials, tokens, or private information
- **Keep Compass changes separate** from Ix changes — different repos, different PRs
- **Classify all evidence** — T1 (source) through T5 (inference)
- **Do not push or open PRs** to upstream without explicit authorization
- **Commit message footers** ("Generated with Codebuff") auto-stripped by local git hook
