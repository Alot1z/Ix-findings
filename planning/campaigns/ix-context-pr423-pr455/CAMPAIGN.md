# Ix-Context PR #423 / #455 — Autonomous Engineering Campaign

## Executive Summary

The Alot1z autonomous audit campaign excavated the Ix-context subsystem
introduced by PR #423 and the open follow-up PR #455. The campaign:

1. **Reconstructed the lineage** of #423: 7 Alot1z-authored commits + 2
   maintainer (KageBinary) review-time corrections, all squashed into
   merge commit `85152eb` on upstream main.
2. **Independently reproduced #455** with a 9-case corpus. Empirical proof:
   - origin/main `8be5f110` (no fix): **5/9 cases pass, 4 cases FAIL** on
     tampered-but-envelope-correct retrieved investigations.
   - fork `76134e22` (with #455 applied): **9/9 cases pass**.
3. **Mapped the architecture** (`IX-CONTEXT-ARCHITECTURE.md`), the validation
   parity matrix (`IX-CONTEXT-VALIDATION-MATRIX.md`), and reviewed every
   boundary phase (9-19).
4. **Implemented in Ix-remap** a clean forward-port of #455 with three
   regression tests on a dedicated feature branch.
5. **Triaged** every previously-suggested candidate task (A–H) with explicit
   scope firewall and decision record.
6. **Recorded** durable evidence in `Alot1z/Ix-findings` (this repo) under
   `findings/ix-context/` and `planning/campaigns/ix-context-pr423-pr455/`.

## Capture Metadata

| Field | Value |
|---|---|
| Captured timestamp | 2026-08-17T20:42:00+02:00 |
| Repository | Alot1z/Ix-remap (fork, writable) |
| Branch | feat/audit-read-side-investigation-validation |
| Fork SHA | 76134e22e0ecec1d0af1203e845f31c4b78f22c7 |
| Upstream SHA | 8be5f110a5a072767e04dc108e79c539d1bab0f9 (= `origin/main`) |
| #423 merge SHA | 85152eb9895ebe7a9062f2067cd582da3b6eeb1a |
| #455 head SHA | 084faae83245774db3fdaebfc7361c50281a55e7 |
| #455 base SHA | 4a88a654de10efdd88335f7966b5553a41cd7ded (= `origin/main~5`) |
| #455 merge committed | NO; branch `origin/fix/validate-saved-investigation` exists and tracks it |
| #455 author | josephismikhail (josephismikhail) |

## Lineage (Phase 5)

### A. Original Alot1z commits (PR #423 contribution)

| SHA | Date | Title |
|---|---|---|
| 99b8940 | 2026-08-14 00:06 +0200 | feat(context): deterministic bounded context bundles via `ix context` |
| 815afea | 2026-08-14 00:13 +0200 | feat(context): expose ix_context over MCP and support JSON export |
| aa3b4ea | 2026-08-14 00:14 +0200 | docs(agent): document the ix context command in skills |
| e22d233 | 2026-08-14 00:19 +0200 | feat(context): resumable investigation state with deltas |
| c8ec21e | 2026-08-14 01:27 +0200 | fix(context): harden ix context correctness and MCP contract |
| b1decee | 2026-08-14 01:38 +0200 | fix(context): remove TOCTOU race in --out write and guard EISDIR check |
| 0c4c89f | 2026-08-14 01:42 +0200 | fix(context): resolve CodeQL findings on bundle persistence paths |

### B. Maintainer corrections (PR #423 review-time, pre-merge)

| SHA | Date | Title | Author |
|---|---|---|---|
| 49ff98b | 2026-08-13 17:39 -0700 | fix(context): save investigations under IX_HOME/investigations | KageBinary |
| 06471f6 | 2026-08-13 18:53 -0700 | fix(context): give each bundle entity its own staleness | KageBinary |

49ff98b bugs fixed:
- `investigationDir` split-arm: with `IX_HOME` set, investigations landed loose
  beside `config.yaml`/`bin/`/`cli/`. Tests had the wrong-path bug encoded
  in their fixtures.
- `sanitizeId` passed `[A-Za-z0-9._-]` through, allowing leading dots; with
  `IX_HOME = $HOME`, `--save .version-check` overwrote the upgrade cache.
- Three ix_context MCP tests stubbed partial bundles; `outputSchema` validation
  by the SDK rejected them but the tests asserted only on argv and went green.

06471f6 bugs fixed:
- `buildBundle` stamped `facts.stale` (target's) onto every entity AND onto
  bundle.provenance.stale; an untouched dep reported stale whenever the
  target was. The bundle-level `freshness` is correct (target), but
  `entities[].stale` requires a per-entity answer.
- Stale probe pre-budgeting: pre-fix, `isFileStale` re-parsed the baseline
  per call; the probe ran before slicing by `maxEntities`, exploding the cost
  to N cache parses. Factored `createStaleProbe` and ran the probe post-slicing.

### C. Final merged #423 state

Squash merge `85152eb` contains the union of A + B. 10 files changed,
+1628/-19 lines. Public surface: `ix context [target] [--kind/--path/--pick/...
--max-*/--format/--out/--save/--resume/--diff]`. MCP tool name `ix_context`
with `outputSchema = contextBundleSchema`.

### D. Later relevant changes

- cffd7b5 / #422: MCP tool annotations + structured output (Alot1z).
- 1c77e8c / #414: `ix home` is created before saving config
  (Hiro-Chiba, unrelated to ix-context).
- ee5aa78 / #424: contain `ix read` to workspace roots (KageBinary,
  unrelated to ix-context).
- 3bc7d2a / #438: validate pick options consistently (Hiro-Chiba,
  unrelated to ix-context).
- 043bc68 / #438: validate pick options (same; pick affects context).
- 084faae / #455: VALIDATE SAVED INVESTIGATION ON READ (Joseph Mikhail;
  open on `fix/validate-saved-investigation`, base `4a88a65`, head `084faae`).

## Architecture (Phase 6–7) summary

See `findings/ix-context/architecture/IX-CONTEXT-ARCHITECTURE.md`. The
trust map shows:

- Writes (`--out`, `--save`): bundle passes `safeParse(BUNDLE_SCHEMA)` before
  temp+rename. ✓
- Reads (`loadInvestigation`): envelope check only on origin/main; safeParse
  on the bundle body is the gap.
- Render (`--resume` JSON/text), `--diff` (re-resolves bundle.target.name
  against the backend), MCP `ix_context` output (SDK-validated against
  the outputSchema): each path uses the loaded bundle which on origin/main
  is the un-validated cast.

The validation parity in `IX-CONTEXT-VALIDATION-MATRIX.md` formalises the
read/write/mutate/render/export/import/MCP coverage.

## #455 Reproduction (Phase 8)

See `findings/ix-context/reproducers/`. Corpus of 9 cases:

1. valid envelope + valid body — control
2. envelope ok + entities string (tampered body)
3. truncated JSON
4. forward-compat envelope v2
5. envelope ok + body null
6. envelope ok + missing entities
7. envelope ok + bundle wholly wrong shape
8. envelope ok + symlink to outside-tree file
9. resume smoke (bundle has array entities)

Result matrix:

| # | case | expected | origin/main observed | fork observed |
|---|---|---|---|---|
| 0 | valid envelope + body | accepted | accepted (PASS) | accepted (PASS) |
| 1 | envelope ok + entities string | rejected | **accepted (FAIL)** | rejected (PASS) |
| 2 | truncated JSON | rejected | rejected (PASS) | rejected (PASS) |
| 3 | envelope v2 + empty body | rejected | rejected (PASS) | rejected (PASS) |
| 4 | envelope ok + body null | rejected | rejected (PASS) | rejected (PASS) |
| 5 | envelope ok + missing entities | rejected | **accepted (FAIL)** | rejected (PASS) |
| 6 | envelope ok + wrong shape | rejected | **accepted (FAIL)** | rejected (PASS) |
| 7 | envelope ok + symlinked body | rejected | **accepted (FAIL)** | rejected (PASS) |
| 8 | resume smoke | accepted | accepted (PASS) | accepted (PASS) |

**5/9 on origin/main, 9/9 on fork.**

The 4 FAIL cases on origin/main are exactly the read-side validator gap
that #455 closes. Case 7 also surfaces a complementary observation: the
loader does NOT realpath-resolve; today #455's `safeParse` happens to
catch it because the symlink target's body shape is wrong, but a hostile
shape-correct body at the outside-tree file would still flow through.
Documented as a follow-up observation, **out of scope for #455**, **not
implemented in this campaign** (would require canonical-realpath check
or version-aware separation; needs scope justification).

## Trust Audit (Phase 9)

Inside `ix-cli/src/cli/commands/context.ts`:

| Site | Trust | Status |
|---|---|---|
| `as SavedInvestigation` in `loadInvestigation` | cast-only | fixed in fork; gap remains on origin/main |
| `as NodeJS.ErrnoException` in --out EISDIR | catch-site narrowing | harmless (catch-block local) |
| `as Record<string, unknown>` in `asRecord` | generic wrapping helper | harmless (read-only structural) |

Outside scope (other Ix su
