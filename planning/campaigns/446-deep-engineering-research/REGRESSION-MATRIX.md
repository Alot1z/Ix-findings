# Regression Matrix — semantic coverage and results

Produced by the `repro/` harness (fork `campaign/446-repro-harness`, HEAD
`31296fc`), run against upstream main `8be5f110` and against main + all four
historical fixes applied.

Legend: ✅ assertion held · ❌ assertion failed · — not applicable to that state.

## In-batch (single `resolveEdges` call over all fixture files)

| Case | Category | Upstream main (expect=bug) | Main + fixes (expect=fixed) |
|---|---|---|---|
| F-019-same | same-line siblings, PHP | ✅ bug present (no IMPORTS) | ✅ fixed (IMPORTS@0.9) |
| F-019-multi | multi-line control | ✅ control (IMPORTS@0.9) | ✅ control (IMPORTS@0.9) |
| F-014-C6 | global use + block | ✅ bug present (CALLS@0.9) | ✅ fixed (no CALLS; IMPORTS kept) |
| F-016-X1 | renamed import → method | ✅ bug present (EXTENDS M.Base) | ✅ fixed (no EXTENDS) |
| F-016-X2 | renamed import → real export | ✅ control (EXTENDS Base) | ✅ control (EXTENDS Base) |
| F-017-Y1 | configured binding → method | ✅ bug present (EXTENDS W.Base) | ✅ fixed (no EXTENDS) |
| F-017-Y2 | configured → real export | ✅ control (EXTENDS Base) | ✅ control (EXTENDS Base) |
| F-020 | single-char guard (pre-existing) | ✅ signature present | ✅ signature present (unchanged) |
| **Total** | | **8/8** | **8/8** |

## Cross-batch (provider via `buildGlobalResolutionIndex`, consumer alone)

| Case | Upstream main (expect=bug) | Main + fixes (expect=fixed) |
|---|---|---|
| F-019-same | ✅ bug present | ✅ fixed |
| F-019-multi | ✅ control | ✅ control |
| F-014-C6 | ✅ bug present | ✅ fixed |
| F-020 | ✅ signature | ✅ signature |
| **Total** | **4/4** | **4/4** |

## PHP scope / declaration coverage (from this campaign + original audit)

| Scope layout | Declarations | Result |
|---|---|---|
| global only, global `use` | class | resolves (FQCN map built — no mixed scope) |
| one unbraced namespace | class | resolves (F-019 multi control) |
| one braced namespace + global `use` | class | **wrong CALLS on main; fixed by 0a7d97f** (F-014) |
| two+ braced blocks | any | FQCN map skipped (`phpNamespaceBlocks > 1`) — conservative |
| block `use` + global code (C8), decoy (D), unbraced (E) | class | same wrong-edge family, fixed by 0a7d97f (original audit) |
| `declare(strict_types=1)` + namespace | class | positive control — no over-skip (original audit) |

## Resolution-predicate coverage

| Predicate | F-014 | F-016 | F-017 | F-019 |
|---|---|---|---|---|
| CALLS | wrong edge on main / removed by fix | — | — | single-char suppressed (F-020); multi-char resolves (qkey `A.User` artifact — related risk #1) |
| IMPORTS | legitimate edge preserved | correct | correct | false negative on main / restored |
| EXTENDS | — | wrong `M.Base` / fixed | wrong `W.Base` / fixed (needs both guards) | — |
| REFERENCES | — | — | — | single-char suppressed (F-020) |

## Adversarial controls run this campaign

- Positive controls: multi-line PHP sibling (F-019-multi), real-export renamed
  import in-batch and configured (X2, Y2) — all resolve at 0.9 in both states.
- Negative/orthogonal: F-020 signature unchanged by the fixes (proves the four
  guards don't alter unrelated query-layer behavior); X4 pre-existing legacy
  member-binding unchanged (documented, out of scope).
- Full core-ingestion suite: **39 failed / 319 passed on clean main == 39 / 319 on
  main + fixes** — identical, so the four fixes introduce **zero** test
  regressions. The 39 failures (SAS grammar ×33, Scala snapshot ×2, Rust ×1,
  parseFile snapshot ×3, integration ×1) are environmental grammar/snapshot drift
  (Node-26/tree-sitter versions), unrelated to the resolution machinery.

## Semantic invariants (campaign §18) — status

| Invariant | Enforced by | Verified |
|---|---|---|
| A PHP sibling declaration must not become the semantic child of another sibling solely because their source ranges overlap on a line | f577492 (FQCN membership) | ✅ in-batch + cross-batch |
| A renamed import must resolve according to the imported symbol | cba11a3 (plain-key guard) | ✅ X1/X2 |
| A configured binding must not widen resolution into unrelated provider members | f9274cc + cba11a3 | ✅ Y1/Y2 |
| Global imports must not override lexical namespace semantics | 0a7d97f (`phpMixedScope`) | ✅ C6 + IMPORTS-preserved |
| Removing a false CALLS edge must not remove the legitimate IMPORTS edge | 0a7d97f | ✅ C6 (IMPORTS@0.9 kept) |
| PHP type qualified keys must not be container-artifacted | **NOT YET ENFORCED** | ❌ related risk #1 (qkey `A.User`) |
