# Ix-findings — Central Evidence Repository

Investigation, reconstruction, security audit, and PR preparation workspace for the
Ix / Compass ecosystem.

**Initiated:** 2026-08-10  
**Status:** Active  
**Git:** Local only (not yet pushed to GitHub)

## Purpose

This repository is the **canonical evidence ledger** for the Ix / Compass investigation.
Every claim is evidence-classified (A/B/C/D), every reproduction is documented, and every
PR packet is self-contained. Nothing is fabricated.

## Finding ID System

All tracked findings use IDs formatted as `IXF-###`. See `manifests/findings-index.json`
for the machine-readable index. Each finding records: ID, title, repository, evidence
class, confidence, reproduction steps, affected versions, related issues/PRs, and status.

## Repository Structure

```
Ix-findings/
├── README.md                  ← You are here
├── .gitignore                 ← Excludes extracted artifacts
│
├── manifests/                 ← Machine-readable indexes
│   ├── artifact-sha256.json   ← SHA256 hashes for all 4 Compass releases
│   ├── investigation-index.json ← Finding metadata + maintainer data
│   └── findings-index.json    ← Finding ID registry
│
├── state/                     ← Per-phase state reports
│   ├── phase-0-audit.md       ← Initial repository topology audit
│   ├── phase-1-sync-report.md ← Fork synchronization
│   ├── phase-2-remap-report.md ← Remap finalization
│   └── phase-6-f-key-gate.md  ← Source-access gate determination
│
├── repositories/              ← Repository architecture
│   └── repository-map.md      ← Complete ecosystem map (Phase 8)
│
├── comparisons/               ← Historical reconstruction (Phase 5)
│   ├── historical-matrix.md   ← Full behavioral matrix v0.1.0–v0.3.0
│   ├── keyboard/
│   │   └── reconstruction.md  ← Keyboard handler + KeyboardHelp analysis
│   ├── camera-fit/
│   │   ├── reconstruction.md  ← Fit math, #57 lifecycle, zoom contract
│   │   └── delayed-data-investigation.md ← Deep runtime probe (Phase 7)
│   └── releases/
│       └── timeline.md        ← Release history + evidence class map
│
├── findings/                  ← Security + historical audit (Phase 4)
│   ├── phase-4-audit.md       ← Full security + historical audit
│   ├── proven/                ← Class A/B findings
│   ├── reconstructed/         ← Class C findings
│   ├── security/              ← Security-specific findings
│   └── tech-debt/             ← Technical debt register
│
├── security/                  ← Security findings
│   └── findings.md            ← Security analysis
│
├── github/                    ← GitHub history context
│   ├── maintainer-context.md  ← Verified identities, open PRs/issues
│   └── issues/
│       ├── 371/README.md      ← patches command dead/unregistered
│       ├── 374/README.md      ← Cross-batch JS/TS call resolution
│       ├── 376/README.md      ← Version series mismatch (upgrade.ts)
│       ├── 379/README.md      ← --kind ambiguity
│       └── 381/README.md      ← PHP receiver types lost
│
├── pr-packets/                ← PR preparation packets
│   ├── ix-remap-hardening/
│   │   └── README.md          ← Loopback-hardened /__ix/remap (PR-ready)
│   ├── compass-f-key/
│   │   └── README.md          ← F-key fit view (spec, blocked on source)
│   ├── compass-delayed-data/
│   │   └── README.md          ← Delayed-data blank (investigation, blocked)
│   └── ix-376-version-mismatch/
│       └── README.md          ← Version series mismatch in upgrade (ready)
│
├── reproductions/             ← Reproduction scripts/notes
│   ├── delayed-data/          ← Phase 7 live probing results
│   ├── f-key/                 ← F-key PoC notes
│   ├── keyboard/              ← Keyboard handler verification
│   └── fit/                   ← Fit math verification
│
├── decisions/                 ← Architectural decisions
│   └── log.md                 ← Decision log
│
└── reports/                   ← Consolidated reports
    └── phase-summaries.md     ← Per-phase executive summaries
```

## Finding Quick-Reference

| ID | Title | Repo | Class | Status |
|----|-------|------|-------|--------|
| IXF-001 | Keyboard handler invariant across 4 releases | system-compass | B | Reproduced |
| IXF-002 | F/f genuinely unbound in all releases | system-compass | B | Reproduced |
| IXF-003 | KeyboardHelp byte-identical, no F entry | system-compass | B | Verified |
| IXF-004 | Fit math constants invariant | system-compass | B | Verified |
| IXF-005 | #57 one-shot fit latch → keyed refit (v0.2.0→v0.3.0) | system-compass | A | Confirmed |
| IXF-006 | Delayed-data blank (rollup timing + refit gap) | system-compass | B | Reproduced live |
| IXF-007 | Region rollup timing-dependent | system-compass | B | Observed |
| IXF-008 | Version series mismatch in upgrade (#376) | Ix | A | **Resolved upstream** — #391 merged 2026-08-11 |
| IXF-009 | patches command dead/unregistered (#371) | Ix | A | **Resolved upstream** — #390 merged 2026-08-11 |
| IXF-010 | Loopback-hardened /__ix/remap endpoint | Ix | A | **PR #393 open** (CI green, awaiting review) |
| IXF-011 | WSL bootstrap fix | Ix | A | In remap PR #393 (open) |
| IXF-012 | Dead node_ok removal | Ix | A | In remap PR #393 (open) |

## Evidence Classes

| Class | Name | Criteria |
|-------|------|----------|
| **A** | Direct source evidence | Source inspected; or authoritative release notes from maintainer |
| **B** | Reproducible artifact/runtime | Released artifact, browser runtime, byte comparison, repeatable experiment |
| **C** | Strongly corroborated reconstruction | Multiple independent observations, not source-verified |
| **D** | Inference/speculation | Plausible but insufficiently established |

## Authorization Gates

| Gate | Ix remap | Compass F-key | Compass delayed-data |
|------|----------|---------------|---------------------|
| Source access | N/A (public) | ❌ Blocked | ❌ Blocked |
| Implementation | ✅ Complete | ❌ Blocked | ❌ Blocked |
| Tests | ✅ 730 passing (rebased base) | Spec only | Spec only |
| Branch pushed | ✅ `feat/ix-remap-hardening` @ `1497596` | ❌ | ❌ |
| PR opened | ✅ **#393** (open, CI green) | ❌ | ❌ |
| Merged | ❌ awaiting review | ❌ | ❌ |

> **Reconciliation (2026-08-11):** Ix findings F-008/F-009 were fixed upstream
> by the maintainers (PRs #391/#390, both merged); the remap PR #393 is open.
> See `state/phase-7-upstream-reconciliation-2026-08-11.md`.

> **Phase 8 (2026-08-11):** issue #219 (`ix mcp`) implemented on the fork —
> `Alot1z/Ix:feat/ix-mcp` @ `863b3fd` (8 read-only MCP tools, dual-era protocol,
> 39 tests, suite green). Pushed; PR packet prepared at
> `pr-packets/ix-mcp/` — **submission to upstream is a user gate** (standing
> rule: no upstream PRs without explicit authorization).

## Key Constraints

- **Never fabricate** source access, GitHub activity, usernames, PR numbers, or technical facts
- **Never expose** personal filesystem paths, credentials, tokens, or private information
- **Keep Compass changes separate** from Ix changes — different repos, different PRs
- **Classify all evidence** — A (source), B (artifact/runtime), C (reconstruction), D (inference)
- **Do not push or open PRs** without explicit authorization
