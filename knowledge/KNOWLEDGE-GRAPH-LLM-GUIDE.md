# LLM Guide — Ix-findings Knowledge Graph

## Dataset identity

Read `knowledge/llm/manifest.json` first, then `knowledge/ontology.json`. The canonical semantic records are in `entities.json`, `relationships.json`, and `evidence.json`. `indexes.json` and `llm/traversal-index.json` are accelerators, not independent truth.

## Traversal algorithm

1. Resolve the user’s identifier through `aliases.json` and `indexes.json`.
2. Load the canonical entity.
3. Read `status`, `confidence`, `temporal`, `source_refs`, `evidence_ids`, and `llm.uncertainties`.
4. Traverse only typed relationships whose endpoints exist.
5. Prefer current upstream evidence over historical reports when resolving state.
6. Preserve contested statements in `contradictions.json`.
7. Stop when the next edge has insufficient evidence; report the blocker instead of inventing a link.

Typical traversals:

- `F-009 → ISSUE-371 → PR-390 → current upstream observation → resolved status`.
- `PR-393 → branch/remap implementation → remap endpoint → guard tests → Phase 15 review concerns`.
- `AUDIT-CAND-001 → MCP branch → protocol evidence → Phase 15 after-rework disposition`.
- `F-006 → delayed-data reproduction → artifact/runtime evidence → Compass source blocker`.

## Evidence discipline

Evidence class A is direct but still scoped to what the source proves. B is reproducible artifact/runtime evidence. C is a reconstruction supported by multiple observations. D is inference and must remain explicitly uncertain. A report, agent, or model is provenance, not evidence by itself.

## Status discipline

`CURRENT`, `HISTORICAL`, `RESOLVED`, `BLOCKED`, `CONTESTED`, and `UNSUPPORTED` are semantic states. Do not collapse `PR_OPEN` into `FIXED`, and do not collapse an open GitHub issue into an active code defect without current source/reproduction evidence.

## AI-slop defenses

Treat impressive terminology, stale counts, unsupported root causes, inaccessible-source claims, speculative security concerns, and inherited “ready” labels as risk signals. Check `ai_slop_risk`, `supporting_evidence`, and `contradiction_ids`. If evidence is missing, answer `NEEDS_REPRODUCTION`, `BLOCKED`, or `UNSUPPORTED`.

## LLM fields

Each significant canonical entity has:

- `llm_summary`: concise factual orientation;
- `llm_facts`: directly supported facts;
- `llm_uncertainties`: concrete unresolved limits;
- `llm_questions`: actionable next questions;
- `llm_evidence_chain`: evidence IDs in traversal order;
- `llm_relationships`: typed neighbor IDs;
- `llm_search_terms`: supported aliases and technical terms.

Do not add generic filler. Unknown values must remain `UNKNOWN`.
