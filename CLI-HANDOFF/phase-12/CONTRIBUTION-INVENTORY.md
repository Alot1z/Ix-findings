# CONTRIBUTION INVENTORY — Pre-Submission Gate (Phase 12)

**Date:** 2026-08-11 · **Status:** READY FOR USER REVIEW

Every live contribution produced by the Phase 0–12 ladder, with its exact
branch/SHA, packet path, status, and the one-line command that would submit
it. **None of these commands has been run.** They are triggers for the user
to fire when ready.

---

## Active Contributions

| # | Contribution | Branch / PR | SHA | Packet | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | **ix mcp** (#219) | `Alot1z/Ix:feat/ix-mcp` | `66fa5f5` | `pr-packets/ix-mcp/` | **PREPARED** | 5 commits, 749/2 tests, hardened (line cap, tree-kill, protocol matrix), real-client E2E (Codex 0.143.0). Diff: 21 files, +2472 vs fork main. |
| 2 | **ix remap** (#393) | `Alot1z/Ix:feat/ix-remap-hardening` | `1497596` | N/A (PR open) | **OPEN UPSTREAM** | PR #393 open/mergeable, 0 reviews, review requested from `josephismikhail`. No packet needed — the PR IS the submission. |
| 3 | **compass F-key** | — | — | `pr-packets/compass-f-key/` | **BLOCKED** | Specification complete (8/8 drop-in items). No source access — `Alot1z/system-compass` 404. |
| 4 | **compass delayed-data** | — | — | `pr-packets/compass-delayed-data/` | **BLOCKED** | Investigation complete (7/7 items). No source access. |

## Superseded / Historical (not live)

| # | Contribution | Resolution |
|---|---|---|
| S1 | #376 version mismatch | Fixed + merged: PR #391 (compass version comparison) |
| S2 | #371 patches dead code | Fixed + merged: PR #390 (register patches command) |
| S3 | F-008 version-series mismatch | RESOLVED_UPSTREAM (PR #391) |
| S4 | F-009 patches command registration | RESOLVED_UPSTREAM (PR #390) |

---

## Submission Triggers

### Trigger 1 — ix mcp (#219)

```bash
# DO NOT RUN without explicit user authorization.
gh pr create \
  --repo ix-infrastructure/Ix \
  --title "feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools (#219)" \
  --body-file pr-packets/ix-mcp/PR-BODY.md \
  --head Alot1z:feat/ix-mcp \
  --base main
```

### Trigger 2 — ix remap (#393)

No command needed — PR #393 is **already open** upstream. If review requests
changes, implement on `Alot1z/Ix:feat/ix-remap-hardening` and push; the PR
auto-updates.

### Trigger 3 — compass F-key (BLOCKED)

```bash
# Only when: Alot1z/system-compass fork exists and feat/f-key-fit-view is pushed.
gh pr create \
  --repo ix-infrastructure/system-compass \
  --title "feat(keyboard): add F key for fit-to-viewport" \
  --body-file pr-packets/compass-f-key/README.md \
  --head Alot1z:feat/f-key-fit-view \
  --base main
```

### Trigger 4 — compass delayed-data (BLOCKED)

```bash
# Only when: Alot1z/system-compass fork exists and fix/delayed-data-fit-recovery is pushed.
gh pr create \
  --repo ix-infrastructure/system-compass \
  --title "fix(fit): recover from placeholder zoom after delayed data load" \
  --body-file pr-packets/compass-delayed-data/README.md \
  --head Alot1z:fix/delayed-data-fit-recovery \
  --base main
```

---

## Pre-Submission Checklist

Before running any trigger, verify:
- [ ] Fork branch HEAD matches the SHA in the packet.
- [ ] Full test suite is green (re-run `npm test` in ix-cli).
- [ ] `tsc --noEmit` and `eslint` are clean.
- [ ] PR body has no stale references (SHAs, issue numbers, test counts).
- [ ] User has explicitly authorized the submission.

## Post-Submission

- Add the PR to `CLI-HANDOFF/PR-MATRIX.md`.
- Record the PR number in the corresponding packet README.
- Notify the author of linked issues (e.g., @josephismikhail for #219).
