# Issue #385 — `ix upgrade` breaks Windows CLI when upgrading from 0.8.1 to 0.9.1

**URL:** https://github.com/ix-infrastructure/Ix/issues/385  
**Author:** RMA1313 (community)  
**Opened:** 2026-08-10 · **Status:** **OPEN** — fixed on `main`, awaiting reporter confirmation  
**Labels:** bug · **Comments:** 2 · **Evidence Class:** Class B (reproduced runtime report) + Class A (fix verified in source)

## Summary

After `ix upgrade` from 0.8.1 → 0.9.1 on Windows, the `~\.ix\bin\ix.cmd` wrapper
pointed at a CLI path that no longer existed; `ix` failed until reinstall.

## Root cause (from maintainer comments, verified against `main`)

Three independent changes touch this; KageBinary traced the forward path end to
end on `main` (2026-08-11):

1. The release archive carries `ix.cmd` at its top level (`release.yml:309`).
2. `install.ps1` collapses the top level into flat `$IX_HOME\cli\`, which is why
   `%~dp0..\cli\ix.cmd` resolves (introduced by #346 in v0.9.0).
3. `ix upgrade` re-derives the same layout — staging + wrapper regeneration are
   part of #386 (`ix.cmd` self-diagnosis) and #392 (stage downloads under
   `IX_HOME` instead of `TEMP`).

## Resolution status

- **FIXED ON `main`** (merged: #386, #392; related: #346, #391). PR #395
  (KageBinary) adds a test covering an `IX_HOME` containing a space.
- Issue deliberately left **open** — it is a *reporter* confirmation issue
  (RMA1313 needs to run the fixed path), not an actionable engineering item.
- **Not actionable by us** — no upstream PRs allowed per standing constraint;
  fix already exists.

## Relationship to our work

Directly in the domain of F-008 (#376 version-series / upgrade) and the
Windows/installer findings (F-011/F-012 territory). Our upgrade analysis
(F-008) was fixed upstream by #391; #385 exercises the same subsystem on a
different axis (wrapper path regeneration). Catalogue only; no action.
