# Phase 1 — Contradiction Register

Continues from Phase 0 contradictions (C-001 through C-006).

| ID | Claim A | Claim B | Source A | Source B | Status | Resolution |
|----|---------|---------|----------|----------|--------|------------|
| C-001 | Graph: 290 nodes | Actual: 152 | manifest.json v4.0.0 | investigation-map.json | UNRESOLVED | Manifest stale |
| C-002 | Graph: 240 edges | Actual: 136 | manifest.json v4.0.0 | investigation-map.json | UNRESOLVED | Manifest stale |
| C-003 | Evidence: 28 items | Actual: 25 | manifest.json v4.0.0 | evidence registry | UNRESOLVED | Manifest stale |
| C-004 | CLI-HANDOFF authoritative | IX-INVESTIGATION-HANDOFF exists | Filesystem | Filesystem | UNRESOLVED | Old dir empty but locked |
| C-005 | Ix-findings clean | 3 uncommitted files | Previous report | git status | UNRESOLVED | Need to commit |
| C-006 | FREEBUFF-CLI-PROMPT.md present | Should be CLI-PROMPT.md | Filesystem | Branding cleanup plan | UNRESOLVED | Pending rename |
| C-007 | PR #376 exists | GitHub API returns 404 | Ix-findings PR matrix | gh api repos/ix-infrastructure/Ix/pulls/376 | UNRESOLVED | Likely issue #376, not PR |
| C-008 | PR #371 exists | GitHub API returns 404 | Ix-findings PR matrix | gh api repos/ix-infrastructure/Ix/pulls/371 | UNRESOLVED | Likely issue #371, not PR |

All newly discovered contradictions derive from stale manifest data or PR/issue number ambiguity. None contradict live Git state.
