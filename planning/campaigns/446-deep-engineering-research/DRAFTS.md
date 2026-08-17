# Draft Communication (regenerated from fresh evidence) — DRAFT ONLY, NOT POSTED

Upstream SHA verified against: `8be5f110a5a072767e04dc108e79c539d1bab0f9`
All drafts: **not posted** — Level-3 authorization required (campaign §26).

---

## #446 thread — F-014 + F-019 (its own regressions)

Target: https://github.com/ix-infrastructure/Ix/pull/446 (merged 2026-08-16).

> Follow-up on #446: both regressions the audit identified are **still live on
> current main** (`8be5f110`, rebuilt from source; `resolveEdges` probes + CLI
> map/backend graph queries, 8/8 assertions in-batch and 4/4 cross-batch).
>
> **1. Cross-namespace-scope false edge (fork `0a7d97f`).** A file mixing a
> global `use` with a namespace block emits a wrong `CALLS@0.9` across the
> boundary:
> ```php
> // main.php
> <?php use Vendor\Thing;
> namespace A { class Thing {} function f() { new Thing(); } }
> ```
> Expected: `new Thing()` is `A\Thing` (same file). Actual on main: `CALLS@0.9`
> (and `IMPORTS@0.9`) to `Vendor/Thing.php`. The block-count guard
> (`phpNamespaceBlocks > 1`) never counts the global scope, so mixed-scope files
> still build the FQCN map. Fix `0a7d97f` (parser-level `phpMixedScope`) removes
> the wrong CALLS edge on main while keeping the legitimate IMPORTS edge.
>
> **2. Same-line sibling PHP types dropped from the FQCN index (fork `f577492`).**
> ```php
> // Vendor/Package/B.php
> <?php namespace Vendor\Package; class A {} class B {}   // one line
> // consumer: use Vendor\Package\B; new B();
> ```
> Expected `IMPORTS@0.9` to `B.php`; actual on main: **NONE**. `findEnclosing`'s
> inclusive line ranges falsely nest `B` inside `A` (pre-existing artifact), and
> #446's `phpTypeFqcn`/`ambiguousPhpTypeNames` `entity.container` guard drops the
> type. Fix `f577492` (PHP types can't nest — drop the container exclusion)
> restores `IMPORTS@0.9`, verified in-batch and cross-batch on main; multi-line
> control unaffected.
>
> Both commits cherry-pick cleanly onto current main and pass their positive
> controls. Do you intend to address these (cherry-pick, or an equivalent fix)?
>
> Fork commits:
> - F-014: https://github.com/Alot1z/Ix-remap/commit/0a7d97f6213e567bcd074ebe7fb41cd32b77e7c3
> - F-019: https://github.com/Alot1z/Ix-remap/commit/f577492219d9b0546df8996d6679784e3c465b99

---

## #443 thread — F-016 (its own regression)

Target: https://github.com/ix-infrastructure/Ix/pull/443 (merged 2026-08-16).

> Follow-up on #443: the renamed-import member-binding regression is **still live
> on current main** (`8be5f110`).
>
> ```ts
> // m.ts: export class M { Base() {} }
> // app.ts: import { Base as LocalBase } from "./m"; class D extends LocalBase {}
> ```
> Expected: no edge (a method can never be a module export). Actual on main:
> `EXTENDS@0.9` with qualified key `M.Base`. The `'default'`-sentinel guard does
> not cover other member names. Fix `cba11a3` (require a plain qualified key in
> the fallback) removes the edge on main; the real-export control still resolves
> at 0.9.
>
> Fork commit: https://github.com/Alot1z/Ix-remap/commit/cba11a3363b1fbe57819381f05490d2f395674cd

---

## #445 thread — F-017 (its own regression, with the merged-code nuance)

Target: https://github.com/ix-infrastructure/Ix/pull/445 (merged 2026-08-16).

> Follow-up on #445: the configured-binding member-binding regression is **still
> live on current main** (`8be5f110`) — and on the *merged* code the fix needs
> both guards.
>
> ```ts
> // tsconfig paths: "@core" → worker.ts ; worker.ts: export class W { Base() {} }
> // app.ts: import { Base as LocalBase } from "@core"; class D extends LocalBase {}
> ```
> Actual on main: `EXTENDS@0.9` with qualified key `W.Base`.
>
> Important nuance: the original fork fix `f9274cc` (plain-key requirement on the
> configured block) was verified on the PR head — but after the merge, #443's
> `fileHasSymbol` fallback was unified into the same `publicMatches` loop, so a
> configured binding whose configured-block guard declines falls through to the
> fallback and re-emits the member edge. **On current main the plain-key guard is
> needed on BOTH the configured block and the fallback** — i.e. `f9274cc` +
> `cba11a3` together (verified: pair fixes Y1, real-export control preserved;
> each alone does not).
>
> Fork commits (apply both for #445 on main):
> - https://github.com/Alot1z/Ix-remap/commit/f9274cc0870c65a496a5b983c814d9fed6a65c0f
> - https://github.com/Alot1z/Ix-remap/commit/cba11a3363b1fbe57819381f05490d2f395674cd

---

## Notes

- If the maintainers prefer a single new PR against `main` over cherry-picks, the
  four fixes (with F-017 as the two-guard pair) are contribution-ready with the
  harness regression suite + controls.
- No claim is made that anything is merged upstream; these are drafts pending
  explicit authorization.
