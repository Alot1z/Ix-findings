# PR Plan — Compass delayed-data blank

**Verdict: NEW ISSUE (then PR) — SOURCE-BLOCKED; investigation packet ready**

| Field | Value |
|---|---|
| Repository | ix-infrastructure/system-compass (private) |
| Branch | not created |
| Evidence | E-009 (3 reproductions), E-012 (rollup timing), F-006, F-007 |
| Scope | fix the self-referential refit (zoomed-rect measurement) and/or rollup decision timing — exact shape needs source |
| Dependencies | source access; maintainer decision whether in scope for #57 |
| Blockers | **system-compass source access** |
| Reviewers | @KageBinary |
| Historical refs | system-compass#57 (the fix this gap survives), v0.3.0 release notes |
| Mentions | @KageBinary recommended |

## Recommended flow

1. File as an issue (or comment on #57) with the reproduction table — the A/B
   evidence is deterministic and self-contained.
2. Optionally attach the investigation packet
   (`../pr-packets/compass-delayed-data/README.md`) as the write-up.
3. Fix PR once maintainers scope it.

## Do NOT

- Fold into the F-key PR (D-006, S-023).
- Claim the mechanism (C1: zoomed-rect self-reference) as fact — it needs
  source confirmation.
