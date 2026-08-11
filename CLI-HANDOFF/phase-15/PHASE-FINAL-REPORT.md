# Phase 15 — Final Adversarial PR-Worthiness Audit

**Date:** 2026-08-11  
**Status:** PARTIALLY COMPLETE — evidence gate complete; final shell-based validation and ledger push blocked by the runner failing to spawn `bash.exe`.  
**Operating mode:** Read-only investigation. No upstream or GitHub mutation.

## 1. Executive conclusion

The previous Phase 14 verdict was too optimistic. The MCP branch is substantial and promising, but it is **not contribution-ready** under the current MCP 2026-07-28 specification: the reviewed server accepts requests without required modern `_meta` fields and accepts `null` request IDs, while the official specification requires per-request protocol metadata and string/integer IDs. Its eight read-only tools are also narrower than issue #219's stated curated read/write proposal. It should be **CONTRIBUTE-AFTER-REWORK**, not “PR-ready.”

PR #393 is a useful focused contribution and remains open, but it also should not be called fully ready without a targeted lifecycle/security re-review. The endpoint runs a privileged map process; the reviewed disconnect path kills the direct child but does not demonstrate whole-process-tree cleanup, and concurrent requests are not explicitly bounded. It is **CONTRIBUTE-AFTER-REWORK** while the existing PR remains untouched.

No candidate passed every contribution gate. That is the correct adversarial result.

## 2. Live upstream baseline

Directly verified from live GitHub pages/raw source:

- `ix-infrastructure/Ix` `main` is at `1292375548fb` (`fix(upgrade): stage downloads under IX_HOME, not TEMP (#392)`).
- Open PRs are **#395**, **#393**, and **#388**.
- Open issues are **#385**, **#383**, **#349**, and **#219**.
- Current upstream `oss.ts` imports and calls `registerPatchesCommand` and omits `patches` from `PRO_COMMANDS`.
- Current upstream `upgrade.ts` contains `CompassStamp` provenance handling and the `shouldOfferCompassUpgradeFor` decision path.
- `@ix/cli` current package version is `0.9.2`.
- `Alot1z/Ix:feat/ix-mcp` currently lists five commits ending at `606f18f`.
- PR #393 is still open and its public conversation still contains old Codebuff footer text in previously posted material. The local hook/rewrite did not and cannot remove already-published conversation text.
- Ix-findings Pages/public data exists as a generated, sanitized **snapshot**, not a live view of GitHub.

## 3. Previous candidate universe

The full Phase 3 CAND-001…CAND-020 universe was consumed, along with Phase 8–14 reports, contribution packets, findings, evidence, suggestions, decisions, live issue/PR pages, and current upstream source. The normalized mapping is in `AUDIT-CANDIDATE-UNIVERSE.json`.

The old “READY” label was treated as historical evidence, not as a gate result.

## 4. New candidate universe and dispositions

### Promoted to contribution-ready

**None.**

### Contribute after rework

- **AUDIT-CAND-001 / MCP:** Correct modern metadata and request-ID semantics, clarify legacy compatibility, test against a standards-conforming client/Inspector, and resolve the mismatch between issue #219’s requested surface and the eight-tool implementation.
- **AUDIT-CAND-002 / remap:** Bound concurrent expensive remaps, define process-tree cleanup on disconnect, and add native-platform lifecycle tests. Existing PR #393 is not altered.

### Needs reproduction

- **AUDIT-CAND-005 / issue #383:** Native-Windows Codex hook and Python subprocess failure. The issue body is concrete, but no independent native-Windows run or current owning-plugin source audit was completed.
- **CAND-019:** Documentation gap. The Phase 1 inventory is not enough to define a current, maintainer-valued scope.
- **CAND-006/F-006/F-007:** Compass delayed-data and rollup claims require current source/runtime access. The private source/forks remain inaccessible.

### Already fixed upstream

- **F-008 / #376:** fixed by #391; current `upgrade.ts` confirms provenance-aware comparison.
- **F-009 / #371:** fixed by #390; current `oss.ts` confirms registration.
- `CAND-005`, `CAND-010`, `CAND-016`, and `CAND-018` are not new contribution work.

### Duplicate or superseded

- CAND-012 is subsumed by the existing open PR #393.
- CAND-020 duplicates the wiki-fix candidate CAND-014.
- S-032/S-033 are superseded by Compass #57 / the v0.3.0 keyed refit.

### Not worth contributing

Fork-main synchronization, Freebuff-forge divergence tracking, a standalone version-series documentation PR, and internal graph/manifest maintenance do not provide a current Ix upstream contribution.

### AI-slop/unsupported

F-013 remains unsupported: it is a T5 visual inference without source or instrumentation. Phase 14’s “zero AI slop” conclusion was too broad because it treated the presence of honest caveats as sufficient; the actual contribution recommendation still over-promoted MCP and remap without checking the newest protocol/security evidence.

## 5. MCP assessment

**Verdict: GOOD_WITH_CHANGES / NOT PR-READY.**

Strengths independently confirmed from the fork source and public commit history:

- structured argument validation and no shell interpolation;
- newline-delimited stdio framing;
- line-size cap and resynchronization;
- output limits, timeouts, cancellation hooks, and tree-kill for executor paths;
- real-process tests and a Codex smoke record.

Blocking concerns from the authoritative MCP 2026-07-28 specification:

1. The spec says every modern request carries required `io.modelcontextprotocol/protocolVersion` and `clientCapabilities` in `_meta`; the reviewed server only conditionally validates a protocol-version value and accepts missing metadata.
2. The spec says requests must use string or integer IDs and must not use `null`; the reviewed type and validation path permit `null` and respond using it.
3. The server claims modern stateless behavior but also retains a legacy connection-oriented initialize path; this can be valid only with explicit era detection and conformance tests, not merely a comment.
4. Issue #219 describes a broader curated read + write surface; eight read-only tools are a reasonable first slice but require explicit upstream scope agreement rather than being presented as a complete implementation.

Required next evidence: official-client/Inspector run, metadata and null-ID negative tests, queued-cancellation test, and an updated packet with exact protocol scope.

## 6. F-009 assessment

F-009 is **resolved**, not open. Current upstream raw `oss.ts` contains `registerPatchesCommand(program)` and no longer lists `patches` in `PRO_COMMANDS`. PR #390 records merge and regression tests. Do not implement or submit the old packet.

## 7. Remap assessment

PR #393 remains a meaningful contribution candidate, not a new submission target. The source-level design is coherent: `POST /__ix/remap`, explicit loopback binding, Host/Origin checks, source-layer implementation, WSL routing correction, and guard tests. But the contribution gate fails until process lifecycle and concurrency claims are tightened. The reviewed code’s disconnect path calls `child.kill()` rather than demonstrating descendant cleanup, and multiple requests can begin expensive map operations. Those are review questions, not proven exploitable remote vulnerabilities; the endpoint is loopback-only. No comment or push was made.

## 8. Compass assessment

F-key and delayed-data packets are useful evidence/specification artifacts, but no current Compass source is accessible. Do not create implementation claims, branches, issues, or PRs from compiled artifact archaeology. The work is **BLOCKED** and internal until source access and maintainer intent exist.

## 9. Pages assessment

The Ix-findings explorer is an internal/public-ledger deliverable. Its generated `data.js` explicitly labels the data as a sanitized snapshot and includes historical counts/relationships. It is not an upstream Ix contribution and must not be treated as live GitHub truth. No Pages deployment or publication occurred in this phase.

## 10. Issue reconciliation

- #219: current and valuable; scope/modern protocol contract needs clarification.
- #383: current, concrete, needs native-Windows reproduction and plugin ownership/source mapping.
- #385: remains open pending affected-machine confirmation despite merged recovery/staging fixes.
- #349: remains open pending reporter confirmation; #352/#392/#395 provide incremental evidence, not proof of complete closure.
- #371/#376: closed/resolved by #390/#391.

## 11. Finding and ledger reconciliation

No historical evidence was deleted or rewritten. Proposed statuses are recorded in `LEDGER-RECONCILIATION.json`; canonical registries were not edited during the audit. The new phase-15 audit artifacts are the only local writes made by this turn.

Important data-quality caution: the existing public README/Pages projection still says MCP is “PR-ready” and lists Phase 14-era statuses. That is now a stale claim relative to this audit and should be updated in a separate authorized ledger-maintenance change, not silently changed here.

## 12. Security and privacy

- No credentials or tokens were recorded.
- The public PR #393 conversation still contains previously posted Codebuff footer text; this is a publication-history issue. No attempt was made to delete or comment because forbidden.
- Public Pages remains allowlist-based and snapshot-labeled; raw manifests/local paths must not be published.
- No vulnerability was manufactured: the MCP/remap items are review risks tied to concrete source/spec behavior.

## 13. Explicitly prohibited actions not performed

PRs: 0  
Issues: 0  
Reviews: 0  
Comments: 0  
Maintainer contacts: 0  
Upstream commits: 0  
Upstream pushes: 0  
Upstream merges: 0  
Fork PRs: 0  
Pages deployments: 0

## 14. Protected work

The prior protected states were not mutated by this audit. The shell runner failure prevented a final CLI status comparison, so the result is reported as “not re-verified by CLI in the final gate,” not falsely claimed as clean. No implementation repository was edited.

## 15. New discoveries

1. Official MCP 2026-07-28 requires per-request metadata and non-null request IDs; the fork implementation’s permissive validation does not enforce both.
2. PR #393’s public conversation still contains the old Codebuff footer despite cleaned fork commit messages.
3. Current upstream source directly disproves the old F-009 dead-registration claim.
4. Current Pages data is a snapshot with source revision `8285409`, not a live GitHub projection.

## 16. Recommendation from a clean start

### Tier 1 — clearly worth doing

1. Rework the existing MCP branch to a demonstrably conformant, explicitly scoped implementation, then rerun independent client tests. Do not submit until that gate passes.
2. Review PR #393’s child lifecycle and concurrent-remap behavior, then let the existing upstream review process decide; do not create a second PR.

### Tier 2 — potentially worth doing

1. Reproduce #383 on native Windows and identify the owning plugin repository.
2. Keep the Ix-findings graph/data validator and snapshot pipeline maintained internally.
3. Revisit Compass only if source access and maintainer intent change.

### Tier 3 — do not spend time on now

Do not prepare #371/#376 patches, do not sync the fork merely for hygiene, do not contribute Freebuff-forge tracking, do not implement Compass from compiled artifacts, and do not pursue F-013 without instrumentation.

## 17. Remaining blockers and authorization

- MCP rework is local/fork work only; any later push or PR submission requires explicit authorization.
- PR #393 already exists; any branch update requires explicit authorization and should follow maintainer review.
- Native Windows reproduction requires the environment.
- Compass requires source access/maintainer intent.
- Any Ix-findings canonical-ledger update or push should be a separate authorized maintenance step.

## Final adversarial result

**No contribution-ready candidates.** The correct next action is not to open a PR; it is to correct the MCP protocol contract, tighten remap lifecycle evidence, and independently reproduce the open Windows issue before asking for any upstream submission authorization.
