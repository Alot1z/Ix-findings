# PHASE 11 — ECOSYSTEM SECOND-ORDER RECONCILIATION

## STATUS
READY TO EXECUTE

## ROLE

You are executing **Phase 11** of the ladder — the discovery/reconciliation
phase of the second cycle. Phase 8–10 built and hardened the fork work; this
phase turns back to the **ecosystem**: verifying the maintainers' own fixes
for #385/#349 (so the ledger holds Class A proof of fix-on-main), studying the
ix-codex-plugin MCP alignment, executing the deferred local candidates
(CAND-006, CAND-019), and harvesting any new findings/candidates into the
registries.

Standing constraint (user, 2026-08-11): **NO PRs and NO commits to any
`ix-infrastructure/*` repository. External writes ONLY to `Alot1z/Ix`,
`Alot1z/system-compass`, `Alot1z/Ix-findings`.** Issue comments are NOT
authorized — the verification harnesses are evidence for a future authorized
comment, not an action.

---

# 0. AUTHORITATIVE INPUTS

- `github/issues/385/README.md` + `349/README.md` (fix claims to verify)
- `github/issues/383/README.md` + `github/issues/219/README.md` (plugin split)
- `CLI-HANDOFF/phase-7/PHASE-7-REPORT.md` (blocked fork sync, issue catalogue)
- `CLI-HANDOFF/phase-10/PHASE-11-IMPLEMENTATION-INPUT.md` (required)
- `planning/findings/registry.json`, `planning/evidence/registry.json`
- `CLI-HANDOFF/phase-2/` + `phase-3/` candidate inventories (CAND-006, CAND-019)
- Live source on the fork: `release.yml`, `install.ps1`, `ix-cmd`/launcher,
  `upgrade.ts` (the #385/#349 path)
- `planning/pages/` (the reproducible Pages pipeline)

---

# 1. CURRENT VERIFIED BASELINE

| Item | State |
|---|---|
| #385 fix-on-main claim | release.yml carries `ix.cmd` top-level; `install.ps1` collapses to `$IX_HOME\cli\`; `ix upgrade` re-derives layout (#386/#392) — **to be re-verified from source** |
| #349 fix-on-main claim | #352 moved scratch files to `$IX_HOME` (long-form USERPROFILE), off the 8.3-shortened TEMP path — **to be re-verified from source** |
| ix-codex-plugin | public; #19/#20 closed (PATHEXT + /bin/sh fixes); #16/#17 open (MCP tool invocation, installer TOML) |
| CAND-006 | Playwright delayed-data repro vs public ix-compass-dist — optional, ready |
| CAND-019 | Ix docs scope (`docs/api/README.md` etc.) — needs scoping |
| Protected | Ix `b038c46/14`; ix-compass-dist `396426b/3`; fork branches preserved |

---

# 2. UNIVERSAL RULES

Same mandatory block as Phase 8 (source-driven, verification-before-completion,
doubt-driven, no fabrication, privacy allowlist, tool safety). **Full skill
inventory applies (all 85, / prefixes — Phase 8 §2; copy into context).**

**Phase 11 emphasis:** `/source-driven-development` `/verification-before-completion`
`/doubt-driven-development` `/tractatus-thinking` `/sequential-thinking`
`/playwright-cli` `/browser-testing-with-devtools` `/documentation-writer`
`/code-review-graph` `/knip` `/stop-slop`

---

# 3. PHASE OBJECTIVES

1. **#385/#349 fix verification (Class A)** — build a read-only verification
   harness on the fork that proves the fix paths from source: release archive
   layout → install layout → upgrade re-derivation → wrapper resolution.
   Record evidence so a future authorized comment could cite it.
2. **Plugin MCP alignment study** — map ix-codex-plugin's MCP implementation
   vs our `ix mcp` (Phase 8): overlap, divergence, and the alignment story
   (one native subcommand vs plugin-side server); record as a planning note.
3. **CAND-006** — Playwright delayed-data reproduction against the public
   dist artifact (if a browser runtime is available; mark UNVERIFIED with the
   blocker otherwise).
4. **CAND-019** — scope and implement the docs work locally on the fork
   (`docs/api/README.md` coverage of `ix mcp` + `/__ix/remap`, CLAUDE.md
   consistency); commit to `Alot1z/Ix` (docs branch or `feat/ix-docs`).
5. **New candidate/finding harvest** — anything discovered becomes a
   candidate or finding with provenance (never fabricated); registry updates.
6. **Close-out** — `PHASE-11-REPORT.md` + `PHASE-12-IMPLEMENTATION-INPUT.md`.

---

# 4. AUTHORIZATION MODEL

| Action | State |
|---|---|
| Read-only verification harnesses | AUTHORIZED |
| Local Playwright runs | AUTHORIZED (local tooling) |
| Commit + push docs/verification artifacts to `Alot1z/Ix` | **AUTHORIZED** |
| Issue comments on #385/#349 (even with evidence) | **PROHIBITED** — evidence only |
| Upstream PRs / maintainer contact | PROHIBITED |
| Touch protected worktrees | PROHIBITED |

---

# 5. PROTECTED WORK

Ix `b038c46/14`; ix-compass-dist `396426b/3`; remap `1497596`; `feat/ix-mcp`;
upstream read-only.

---

# 6. IMPLEMENTATION PLAN (ordered)

## 6.1 #385/#349 verification harness (`reproductions/upgrade-verify/`)

1. From the fork, extract the release archive layout contract from
   `release.yml` (top-level `ix.cmd`), `install.ps1` (`$IX_HOME\cli\` collapse),
   and `upgrade.ts` (re-derivation + staging under IX_HOME, #392).
2. Build a deterministic script that simulates the 0.8.1→0.9.1→0.9.2 upgrade
   path on a temp IX_HOME (with a space in the path — covering #349 and #395's
   test intent), asserting the wrapper resolves at every step.
3. Run it; record pass/fail per step; the whole thing is Class A evidence of
   fix-on-main. Do NOT run the real installer against the real environment.
4. Output feeds the registry (`E-###` new evidence with provenance) and a
   future authorized comment — not posted now.

## 6.2 Plugin MCP alignment

1. Read `ix-codex-plugin` (public): its MCP server, tool definitions, #16/#17.
2. Write `planning/ix/ix-mcp-plugin-alignment.md`: comparison table (tools,
   transport, invocation model), overlap vs `ix mcp`, recommendation for the
   future (e.g., plugin could delegate to `ix mcp` when present).
3. No changes to the plugin repo (not in the allowed-write set).

## 6.3 CAND-006 / CAND-019

1. CAND-006: Playwright repro per the delayed-data packet, against the public
   v0.3.0 artifact; record results or UNVERIFIED + blocker.
2. CAND-019: scope docs on the fork (`docs/api/README.md`), implement, test
   (markdown lint / render), commit + push to `Alot1z/Ix`.

## 6.4 Harvest + close-out

1. New facts → candidates/findings/evidence with provenance; registry JSON
   valid.
2. `PHASE-11-REPORT.md` + `PHASE-12-IMPLEMENTATION-INPUT.md`; ledger commit
   + push.

---

# 7. VALIDATION PLAN

| Area | Checks |
|---|---|
| Harness | every assert has an independent expected value from source; runs recorded |
| Plugin study | claims cite the plugin repo files/PRs |
| CAND-006 | results or UNVERIFIED + blocker; no faked runs |
| Docs | render check; consistency with the actual CLI (`ix --help`) |
| Registries | JSON valid; new entries have provenance |
| Security | no tokens/paths; transcripts sanitized |

# 8. SECURITY / PRIVACY

- Verification harness uses synthetic fixtures + temp dirs only.
- No real user data, no secrets, no personal paths.

# 9. DELIVERABLES

- `reproductions/upgrade-verify/` harness + results
- `planning/ix/ix-mcp-plugin-alignment.md`
- CAND-006 result record; CAND-019 docs commit on the fork
- `CLI-HANDOFF/phase-11/PHASE-11-REPORT.md` + `PHASE-12-IMPLEMENTATION-INPUT.md`
- Registry/evidence updates; ledger commit + push

# 10. COMPLETION CRITERIA

□ harness ran with per-step evidence □ plugin alignment study written
□ CAND-006 resolved or honestly blocked □ CAND-019 done on the fork
□ new facts classified with provenance □ registries valid □ ledger pushed
□ protected work untouched □ zero upstream mutations □ zero unauthorized
comments

# 11. FAILURE / RECOVERY

- Harness step fails → investigate whether it is a harness bug or a real
  residual bug; if residual, THAT is a finding (record it — do not hide it).
- Playwright unavailable → UNVERIFIED + blocker; never fake a browser run.

# 12. PHASE 12 HANDOFF

`PHASE-12-IMPLEMENTATION-INPUT.md` must list every live contribution and its
packet: remap (#393 — open upstream), `ix mcp` (feat/ix-mcp — packet), docs
(feat/ix-docs), compass f-key (packet — blocked), delayed-data (packet —
blocked), plus the submission-trigger table (exact one-line user instructions).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END PHASE 11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
