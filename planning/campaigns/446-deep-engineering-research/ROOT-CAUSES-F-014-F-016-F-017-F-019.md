# Root Causes — F-014 / F-016 / F-017 / F-019

Upstream SHA verified against: `8be5f110a5a072767e04dc108e79c539d1bab0f9`
(core-ingestion `src/index.ts` line numbers refer to this SHA).

All four are **regressions introduced by the #443/#445/#446 PR chain** (the
machinery they added is absent from base `043bc68`) and **still live on current
main**. Verified by the `repro/` harness (8/8 in-batch, 4/4 cross-batch) and
confirmed end-to-end through the CLI + backend graph.

---

## F-014 — Cross-namespace-scope false edge (PR #446)

**Symptom.** A file mixing a *global* `use` with a namespace block (or a
block-scoped `use` with global code) gets a confident `CALLS@0.9` edge across the
scope boundary to the *imported* symbol, when the call actually refers to a
locally declared symbol.

**Reproducer (C6).**
```php
// main.php
<?php use Vendor\Thing;
namespace A {
    class Thing {}
    function f() { new Thing(); }
}
```
Observed: `CALLS@0.9` (+ `IMPORTS@0.9`) to `Vendor/Thing.php`. Expected: `new Thing()`
is `A\Thing` (same file) — no cross-file CALLS.

**Mechanism.**
1. `collectPhpNamespaces` records unbraced namespace spans + a count of
   `namespace_definition` nodes (`phpNamespaceBlocks`, index.ts:2927).
2. `resolveEdges` builds the per-file FQCN import map only when
   `(phpNamespaceBlocks ?? 0) > 1` is false (index.ts:3444) — the guard counts
   **blocks only; the global scope is never counted**.
3. The consumer's `use Vendor\Thing` populates `phpFqcnImportsByLocal` (index.ts:3507)
   with local `thing` → FQCN `vendor\thing`.
4. `new Thing()` inside the block resolves via `importedPhpType` (index.ts:4137)
   → `phpFqcnToTypes['vendor\thing']` → `Vendor/Thing.php` → `CALLS@0.9`.

The same-file-definition guard (index.ts:4352) does not suppress it because the
constructor-call relationship carries the import binding, so
`rel.importBinding !== true && sameScopeDefines(...)` is false.

**Why global+namespace is fundamentally different from 2+ namespace blocks.** The
block-count guard was designed for *multi-block* files (PSR-12 rare). A global
scope + one block is 1 block — invisible to the count — yet the lexical rules are
identical to the multi-block case: a `use` binds only within its scope.

**Historical fix classification: `0a7d97f` = ARCHITECTURALLY PREFERRED (correct).**
Adds `phpMixedScope` on the same single parser walk (global-scope `use` or
declaration seen) and skips the FQCN map for such files (index.ts:3490). Verified
against current main: removes the wrong CALLS edge while keeping the legitimate
IMPORTS edge (the semantic invariant in campaign §18). Not over-broad: a file
with only global code and a global `use` still resolves (the map is built when
`phpMixedScope` is absent).

**Untested boundary (documented, not a bug).** The fix skips the whole per-file
map for mixed files — conservative (false negative rather than false positive).
A namespace-aware bare-name fallback would restore more, but is a broader change
(#446-C7-class; rejected in the original audit for that reason).

---

## F-019 — Same-line sibling PHP types dropped from the FQCN index (PR #446)

**Symptom.** Two sibling declarations on one line — `class A {} class B {}` —
make `B` disappear from the FQCN index; `use Vendor\Package\B; new B()` resolves
to nothing (false negative) where base `043bc68` emitted `IMPORTS@0.9`.

**Mechanism.**
1. `findEnclosing` uses **inclusive line ranges**: B's span `[1,1]` is inside A's
   span `[1,1]`, so `B.container = A` (observed in parse: `B:class container=A`).
   This artifact is **pre-existing** (identical on `043bc68`).
2. #446's `phpTypeFqcn` (index.ts:2984) and `ambiguousPhpTypeNames` (2994) exclude
   any PHP entity carrying a `container` — treating the artifact as evidence that
   the type is nested.
3. PHP types (class/interface/trait/enum) **cannot nest**, so a container on one is
   always a same-line artifact. The guard dropped `B` from `phpFqcnToTypes`
   (index.ts:3605-3613) → `importedPhpType` returns zero entries → no edge.

**Historical fix classification: `f577492` = CORRECT (sufficient on every path).**
Drops the container check with a comment explaining PHP types can't nest. All
producers (`buildGlobalResolutionIndex` PHP section, `resolveEdges` merged
builder) and the consumer (`importedPhpType`) share the single `phpTypeFqcn` /
`ambiguousPhpTypeNames` pair, so removing the check fixes in-batch **and**
cross-batch (verified: 4/4 cross-batch assertions). The CLI builds the global
index per run in memory — no serialized cache, so no stale-index path.

**Related risk (this campaign, confirmed — see RELATED-RISK-ANALYSIS #1).** The
same-line artifact also leaks into the *qualified key*: `qualifiedKey()` /
`patch-builder.entityQKey` (index.ts:2969, patch-builder.ts:200) key the entity
`A.User`, and the restored `CALLS@0.9` edge references qkey `A.User` — wrong
identity for a top-level PHP class.

---

## F-016 — Renamed-import fallback binds to provider members (PR #443)

**Symptom.** `import { Base as LocalBase } from "./m"` where `m.ts` has only
`export class M { Base() {} }` emits `EXTENDS@0.9` with `dstQualifiedKey =
M.Base` — a method that can never be a module export.

**Mechanism.**
1. The renamed-import fallback (index.ts:4393-4397): when the provider's
   public-name map misses `binding.imported`, fall back to *any* symbol in the
   provider file (`fileHasSymbol`).
2. `fileHasSymbol` is the set of **all** entity names in the file, including
   container'd members (methods). A method named `Base` satisfies the fallback.
3. `bestQKey` (index.ts:3000) then picks `M.Base`, and the edge is emitted at 0.9.
4. The pre-fix `'default'` guard (merged code, index.ts:4395) covers only the
   sentinel `'default'` — not arbitrary member names.

**Historical fix classification: `cba11a3` = CORRECT (minimal, scope-level).**
Requires a **plain (unqualified) qualified key** — `fileQKeys.get(fp)
?.get(imported)?.includes(imported) === true` — restricting the fallback to
top-level symbols. Verified against current main: X1 no edge, X2 (real export)
still resolves. The unified rule is the architectural point: *import bindings
must never resolve to container'd members* (campaign §18).

**X4 note.** Non-renamed `import { Base }` binding to a method still emits the
edge via the legacy stem path — **pre-existing** (identical on base `fef671c`),
out of #443 scope, documented in the original audit.

---

## F-017 — Configured-binding path binds to provider members (PR #445)

**Symptom.** With a tsconfig `paths` mapping `@core → worker.ts` where `worker.ts`
has only `export class W { Base() {} }`, `import { Base as LocalBase } from
"@core"` emits `EXTENDS@0.9` with `dstQualifiedKey = W.Base`.

**Mechanism.** Identical member-binding defect to F-016, via the *configured*
path: the `configuredBindingTargets` block (index.ts:4369-4375) matched
`fileHasSymbol.get(providerFiles[0])?.has(binding.imported)` without requiring a
plain key.

**Historical fix classification: `f9274cc` = CORRECT on the PR head (adc97c1),
INCOMPLETE on merged main.** The pre-merge code resolved configured bindings only
through the configured block, so guarding it sufficed. After the merge, #443's
`fileHasSymbol` fallback was **unified into the same `publicMatches` loop**
(index.ts:4393-4397), so a configured binding whose configured-block guard
declines then falls through to the fallback — where the member can still match.
**On merged main, Y1 requires BOTH `f9274cc` (configured block) and `cba11a3`
(fallback).** Verified: f9274cc alone → Y1 still wrong; both → Y1 fixed, Y2
control preserved.

**Unified resolution model (F-016/F-017).** Both are one root cause — "a
resolution path matches a *name* against a provider file's symbol table without
requiring the symbol to be at the scope the name is bound at". The plain-qualified
key requirement is the single correct guard; it must be applied at **every** name→
provider-file match site (configured block + fallback). F-016 and F-017 are the
same defect reached via two entry points that the merge made sequential.

---

## F-020 (context) — single-char names lose CALLS/REFERENCES

Pre-existing (base==head), all languages. Generic length guards (index.ts:2643
`callee.length <= 1`, 2843 `typeName.length <= 1`) drop single-char symbols.
Design decision, not a #446 change. Verified still present on `8be5f110`
(control `User` emits REFERENCES+CALLS@0.5; `B` emits none). Status: OPEN, low.

## Classification summary

| Finding | Introduced by | Live on main? | Historical fix | Fix class | Fix verified on main? |
|---|---|---|---|---|---|
| F-014 | #446 | YES | 0a7d97f | ARCHITECTURALLY PREFERRED | YES (CALLS gone, IMPORTS kept) |
| F-019 | #446 | YES | f577492 | CORRECT | YES (in-batch + cross-batch) |
| F-016 | #443 | YES | cba11a3 | CORRECT | YES |
| F-017 | #445 | YES | f9274cc | CORRECT on PR head / INCOMPLETE on merged main | YES only with cba11a3+f9274cc |
