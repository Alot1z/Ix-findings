# GRAPH-RECONCILIATION.md — Graph Count Reconciliation

**Phase 2 · Generated 2026-08-10 · Evidence: `planning/maps/investigation-map.json`, `CLI-HANDOFF/manifest.json`, `CLI-HANDOFF/GRAPH-AUDIT.md`, Git history**

---

## Authoritative Current Counts

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Graph nodes | **152** | `planning/maps/investigation-map.json` (live parse) | CONFIRMED |
| Graph edges | **136** | same file | CONFIRMED |
| Evidence (registry) | **25** | `planning/evidence/registry.json` | CONFIRMED |
| Evidence (graph nodes) | **28** | graph node-type count | CONFIRMED (different metric) |
| Findings | 13 | `planning/findings/registry.json` | CONFIRMED |
| Decisions | 14 | `planning/decisions/registry.json` | CONFIRMED |
| Suggestions | 33 | `planning/suggestions/registry.json` | CONFIRMED |

---

## Historical Evolution

| Stage | Nodes | Edges | Evidence nodes | Source |
|---|---|---|---|---|
| Legacy v1 map | 58 | 46 | — | `planning/maps/legacy/investigation-map-v1.json` |
| Initial commit (`daff6f9`) | **152** | **136** | 28 | `git show daff6f9:planning/maps/investigation-map.json` |
| Current (`HEAD` 2355308) | **152** | **136** | 28 | live file parse |

**The graph has contained 152 nodes / 136 edges since the very first commit.** It was never 290/240 in the graph file.

---

## Root Cause of the 290/240 Claim (C-001, C-002)

- `CLI-HANDOFF/manifest.json` v4.0.0 claims `graph.nodes: 290, graph.edges: 240` with status "EXPANDED - test worktree, fresh results, fork gap confirmed".
- `CLI-HANDOFF/GRAPH-AUDIT.md` documents an expansion narrative: "Before (Desktop) 108", "After (Phase 7-10) ~270", "After (Master Execution) ~290" and ~215 → ~240 edges.
- **The expansion was never written back to `investigation-map.json`.** The graph file remained 152/136 through every commit (`daff6f9` → `2355308`).
- Therefore: **290/240 is a documented-but-never-materialized aspirational state.** The manifest copied the GRAPH-AUDIT narrative instead of parsing the actual graph file.

**Resolution:** authoritative count is 152/136. The manifest (C-001/C-002) must be regenerated from the actual graph file, and GRAPH-AUDIT.md must distinguish "documented target" from "actual file state".

---

## Root Cause of the 28-vs-25 Evidence Claim (C-003)

Two different metrics were conflated:

1. **Registry records:** 25 (E-001..E-025) — the authoritative evidence database.
2. **Graph nodes of type `evidence`:** 28 (E-001..E-028).

The 3 extra graph nodes are **phantom** — present in the graph, absent from the registry:

| Node | Title | Content overlap |
|---|---|---|
| E-026 | oss.ts PRO_COMMANDS list | overlaps E-018 (#371 source analysis) |
| E-027 | upgrade.ts isNewer implementation | overlaps E-017 (#376 source analysis) |
| E-028 | ix-cli actual version v0.6.1 | overlaps E-019 (git divergence numbers) |

**Resolution:** the registry (25) is authoritative. The 3 phantom graph nodes should either be deleted from the graph or promoted to real registry records — the graph and registry must agree (CAND-002).

---

## Relationship (Edge) Reconciliation

- Edge schema: `{source, target, relationship}` — 136 edges, 42 distinct relationship types.
- Largest types: `supported_by` (18), `produced` (13), `precedes` (13), `defines` (9), `sourced_from` (6), `originates_from` (5).
- **8 dangling edges detected** (endpoint does not resolve to a node ID):
  - `D-001 --implements-> S-002`, `D-002 --implements-> S-001`, `D-005 --implements-> S-007`, `D-006 --implements-> S-008` — suggestion nodes for S-001/S-002/S-007/S-008 are absent from the graph while decisions reference them.
  - `S-034..S-037 --found_in-> file-GIT-STATE.md / file-manifest.json` — the file nodes do not exist in the graph with those IDs.
  - **These are genuine graph-quality defects to repair in a later phase** (Phase 2 is reconciliation only).

---

## Contradiction Register Status

| ID | Claim A | Claim B | Phase 2 Resolution | Status |
|---|---|---|---|---|
| C-001 | Graph 290 nodes | Actual 152 | Manifest inherited un-materialized GRAPH-AUDIT narrative | RESOLVED (explained) |
| C-002 | Graph 240 edges | Actual 136 | same | RESOLVED (explained) |
| C-003 | Evidence 28 | Actual 25 | Graph counts 28 evidence *nodes*; registry has 25 *records*; 3 phantoms | RESOLVED (explained) |
| C-004 | CLI-HANDOFF authoritative | IX-INVESTIGATION-HANDOFF exists (empty, locked) | Both exist; old dir empty | STILL OPEN (fs lock) |
| C-005 | Ix-findings clean | 3 uncommitted files | 2 wiki files modified + untracked phase-2 dir | STILL OPEN (working tree) |
| C-006 | FREEBUFF-CLI-PROMPT.md present | Should be renamed | Present; branding cleanup incomplete | STILL OPEN |
| C-007 | PR #376 exists | GitHub returns 404 on pulls/376 | **#376 is an ISSUE, not a PR** (verified) | RESOLVED |
| C-008 | PR #371 exists | GitHub returns 404 on pulls/371 | **#371 is an ISSUE, not a PR** (verified) | RESOLVED |

---

## Graph Gaps Identified (for later phases — not added here)

- PRs #373, #375, #378, #380, #382 and issues #377, #379 verified live but **absent from the graph and PR-MATRIX** (CAND-003).
- `pr` node set in graph is {#358, #362, #365, #366, #368, #372} — predates Phase 2 discoveries.
- No edge models `fixes` (PR #375 → issue #374) yet.
- No system-compass source-level edges possible until access (BLOCKED, not fabricated).
- **8 dangling edges** (4 decision→suggestion `implements` edges to absent suggestion nodes; 4 stale-claim→file `found_in` edges to absent file nodes) — recorded for later-phase repair (CAND-009).
