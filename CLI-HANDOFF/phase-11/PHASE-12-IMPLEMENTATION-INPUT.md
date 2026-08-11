# PHASE 12 — IMPLEMENTATION INPUT (consumed from Phase 11)

**Produced:** 2026-08-11 · Phase 11 STATUS: COMPLETE (read-only reconciliation).

## What Phase 11 actually delivered (evidence)

- **#385/#349 fixes verified Class A**: PRs #352 (install.ps1 short TEMP),
  #386 (ix.cmd diagnosis), #392 (upgrade under IX_HOME) — all merged
  upstream. PR #395 (space-in-path test) open as the final verification
  piece. Issues remain open (admin backlog) but fixes are on main.
  Evidence IDs E-014 and E-015 to be recorded in the evidence registry
  on the next ledger JSON update.
- **Candidate regeneration**: 20 candidates audited against live state.
  CAND-001..CAND-007 + CAND-020 = BLOCKED (compass source / #393 gate).
  CAND-006 = DEFERRED (Chromium+Compass). CAND-019 = PARTIAL (ix mcp
  docs done). CAND-008..CAND-018 need per-item reclassification (some
  RESOLVED_UPSTREAM, some IMPLEMENTED_ON_FORK).
- **Plugin alignment**: UNVERIFIED — `openai/ix-codex-plugin` 404.
- **No code changes, no upstream mutations.**

## Contribution packet table for Phase 12

| Packet | Branch | Status | Gate |
|---|---|---|---|
| **ix mcp** (#219) | `Alot1z/Ix:feat/ix-mcp` @ `66fa5f5` | PACKET READY (hardened, E2E'd) | User authorization to submit PR |
| **ix remap** (#393) | `Alot1z/Ix:feat/ix-remap-hardening` @ `1497596` | PR ALREADY OPEN upstream | Maintainer review (josephismikhail) |
| **compass F-key** | (no branch) | PACKET READY, BLOCKED | Source access (fork 404) |
| **compass delayed-data** | (no branch) | PACKET READY, BLOCKED | Source access (fork 404) |
| **ix docs** | On fork branches (ix-mcp/remap) | PARTIAL (ix mcp done; remap in PR #393) | None — docs live with their features |

## Submission trigger table (one-line commands)

```
# ix mcp — DO NOT RUN without user authorization
gh pr create --repo ix-infrastructure/Ix \
  --title "feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools (#219)" \
  --body-file pr-packets/ix-mcp/PR-BODY.md \
  --head Alot1z:feat/ix-mcp --base main

# ix remap — ALREADY OPEN (#393); no command needed.

# compass F-key — BLOCKED (no fork). When fork exists:
gh pr create --repo ix-infrastructure/system-compass \
  --title "feat(keyboard): add F key for fit-to-viewport" \
  --body-file pr-packets/compass-f-key/README.md \
  --head Alot1z:feat/f-key-fit-view --base main

# compass delayed-data — BLOCKED (no fork). When fork exists:
gh pr create --repo ix-infrastructure/system-compass \
  --title "fix(fit): recover from placeholder zoom after delayed data load" \
  --body-file pr-packets/compass-delayed-data/README.md \
  --head Alot1z:fix/delayed-data-fit-recovery --base main
```

## Remaining non-contribution work (Phase 12 / beyond)

1. **Phase 9 close-out**: cross-platform matrix, performance methodology,
   MCP Inspector + Cursor/OpenCode + claude re-check.
2. **F-013 + CAND-006**: needs Chromium + running Compass.
3. **Fork-main sync**: PAT `workflow` scope gate.
4. **Candidate JSON refresh**: per-item reclassification of
   CAND-008..CAND-018.
5. **Evidence registry update**: E-014 (#385 fix), E-015 (#349 fix).
6. **Plugin alignment**: locate the new ix-codex-plugin repo, if it still
   exists.

## Authorization state unchanged

- Fork push + ledger: AUTHORIZED.
- PR submission: explicitly user-gated — every trigger command above
  requires the user to say "submit."
- Upstream mutation: PROHIBITED forever.
- Protected: Ix `b038c46`, ix-compass-dist `396426b`, Ix-remap `1497596`.

## Live-state note for Phase 12 controller

Re-verify: PR #393 review state (may have reviews by then), #219 state,
upstream main SHA, fork branch list, and whether the ix-codex-plugin repo
has resurfaced at a new URL.
