# Issue #383 — Codex hooks and CLI subprocess calls fail on native Windows

**URL:** https://github.com/ix-infrastructure/Ix/issues/383  
**Author:** tept-creator (community)  
**Opened:** 2026-08-10 · **Status:** **RESOLVED** — both causes fixed in `ix-codex-plugin`  
**Labels:** none · **Comments:** 1 · **Evidence Class:** Class B (runtime report) + Class A (fixes verified)

## Summary

The official Codex integration installs on native Windows and the CLI/backend
work, but the installed Codex hooks cannot execute (two independent causes).

## Resolution (maintainer comment 2026-08-11)

KageBinary confirmed **both** causes are covered in the separate plugin repo
`ix-infrastructure/ix-codex-plugin` (mirrored as ix-codex-plugin#22, because
GitHub closing keywords do not work across repositories):

| cause | fix |
|---|---|
| `/bin/sh -lc` in all five `hooks.json` commands | ix-codex-plugin#20 (closed) |
| `subprocess` not consulting `PATHEXT` for `ix.CMD` | ix-codex-plugin#19 (closed) |

Neither alone is enough — #19's fix lives in `common.py`; until #20 lands the
hooks still launch through `/bin/sh`.

## Current state (2026-08-11, API-verified)

- ix-codex-plugin is **public**; #19 and #20 both **closed/merged**.
- Plugin still has open items: #16 (fix(mcp): invoke the ix CLI for every
  tool), #17 (fix(installer): preserve valid hook config TOML) — out of scope
  for the Ix ledger (different repo, different ownership model).
- **Not actionable in `ix-infrastructure/Ix`** — no code change needed here.

## Relationship to our work

Informational. Shows the ecosystem split (Ix CLI vs ix-codex-plugin) and that
the Codex surface is maintained in a separate repo. No Ix finding affected.
