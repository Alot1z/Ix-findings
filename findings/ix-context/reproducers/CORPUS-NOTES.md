# Phase-8 Reproduction Corpus — Notes

Two states compared:

| State | Branch | Read-side validator | Cases passed |
|---|---|---|---|
| A | `origin/main` `8be5f110` | absent (`as SavedInvestigation`) | 5/9 |
| B | fork `feat/audit-read-side-investigation-validation` `76134e2` (= + #455) | `contextBundleSchema.safeParse(parsed.bundle)` | 9/9 |

Corpus covers:

1. `0_valid_envelope_and_body`: control; both states accept.
2. `1_envelope_ok_bundle_entities_string`: tampered `bundle.entities = "not-an-array"` — fails on origin/main, refused on fork.
3. `2_truncated_json`: both refuse (envelope check, no JSON, never reaches bundle check).
4. `3_envelope_v2_with_empty_body`: both refuse (envelope "ix-investigation/2" != "ix-investigation/1", envelope check fires first).
5. `4_envelope_ok_body_null`: both refuse (envelope check fires on `!parsed.bundle`).
6. `5_envelope_ok_bundle_missing_entities`: tampered — fails on origin/main, refused on fork.
7. `6_envelope_ok_bundle_completely_wrong_shape`: tampered — fails on origin/main, refused on fork.
8. `7_envelope_ok_bundle_via_symlink_outside_tree`: tampered shape via symlink to outside-tree file — fails on origin/main, refused on fork.
   - IMPORTANT: on fork, the rejection here is shape-driven, not realpath-driven. If a hostile party forged a shape-correct `ix-investigation/1` envelope + valid bundle at the outside path, BOTH states would still accept (loadInvestigation does not realpath-resolve).
   - That is a complementary concern outside #455; see `IX-CONTEXT-ARCHITECTURE.md` §4 (potential invariants not upheld).
9. `8_e2e_resume_smoke`: smoke test — bundle has array entities — both accept.

## Conclusion

PR #455 closes the read-side bundle validation gap in `loadInvestigation`. The
corpus is the empirical proof. Reproductions are stored in
`reproducers/ci-output/`.

The corpus also surfaces a complementary observation (case 7 detail): the
loader does not realpath-resolve, so a hostile file whose shape *does* match
the contract but lives outside `IX_HOME/investigations` would still flow
through. This is a separate hardening question, OUT OF SCOPE for #455; this
campaign records it as a candidate for a follow-up audit, but does not
implement a fix (effect would require either canonical realpath checks or
a cleaner separation of envelope and bundle; needs scope justification).
