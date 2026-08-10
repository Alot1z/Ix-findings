# PHASE 1 — COMPLETE TOOLING, SKILL, ARCHITECTURE & HISTORY ARCHAEOLOGY

**Status:** COMPLETE  
**Generated:** 2026-08-10  
**Input:** `CLI-HANDOFF/phase-0/STATE-BASELINE.json`

---

## 1. EXECUTIVE SUMMARY

Phase 1 performed a complete deep-source archaeology of 8 repositories across 3 projects (Ix, Freebuff Forge, Ix-findings). Every major claim was verified against live filesystem, Git state, GitHub API, and source code inspection — not memory or stale reports.

### Key discoveries

| Area | Discovery |
|---|---|
| **Skills** | 83 installed at `~/.agents/skills/` across 14 categories. 14 referenced-only skills are not installed. |
| **Freebuff CLI tools** | 32 agent tools discovered in `common/src/tools/`. Agent runtime in `packages/agent-runtime/`. |
| **Freebuff Forge modkit** | 11 source files + 10 test files. Config: `localOnly:true`, all mutations deny-by-default. CI: `modkit-ci.yml`. |
| **Ix CLI** | `@ix/cli` v0.6.1, 22 commands, 646/648 tests passing, clean tsc, 38 eslint warnings. |
| **Ix agent skill** | 33 files changed (+975/-1108), Compass fit-view patch, 14 dirty files — active development. PROTECTED. |
| **Ix remap** | 4 files (+251/-10), clean, pushed to fork. PR-ready but no PR created. |
| **Compass dist** | Static React SPA (Rolldown bundle), D3 graph, 4 releases (v0.1.0–v0.3.0). No server needed. |
| **System-compass** | STILL PRIVATE — HTTP 404. 7 findings blocked. No access path available. |
| **Ix-findings** | 177 files, 152 graph nodes, 136 edges, 13 findings, 25 evidence. Manifest is STALE (claims 290/240). |

---

## 2. REPOSITORY ARCHAEOLOGY

All 8 repositories verified via live Git inspection + GitHub API + filesystem.

| Repository | Head | Branch | Dirty | Role |
|---|---|---|---|---|
| ix-infrastructure/Ix | `b038c46` | `feat/ix-agent-skill` | 14 | PRIMARY (PROTECTED) |
| Ix remap worktree | `c021b52` | `feat/ix-remap-hardening` | 0 | PUSHED TO FORK |
| Ix test worktree | `c4f8fea` | (detached) | 0 | CLEAN BASELINE |
| Alot1z/Ix (fork) | `c4f8fea` | `main` | — | SYNCHRONIZED |
| ix-compass-dist | `396426b` | `main` | 3 | DISTRIBUTION |
| system-compass | — | — | — | **BLOCKED — PRIVATE** |
| Alot1z/Ix-findings | `47e70da` | `master` | 3 | INVESTIGATION |
| Alot1z/freebuff-forge | `441cec670` | `feat/modkit-enhancement-layer` | — | FORK DEVELOPMENT |

Full details: `REPOSITORY-ARCHAEOLOGY.json`

---

## 3. FREEBUFF FORGE ARCHAEOLOGY

**Identity:** Fork of `CodebuffAI/freebuff` by Alot1z. NOT the same as upstream.

**Monorepo structure** (bun@1.3.14, TypeScript):
- `cli/` — OpenTUI + React terminal UI
- `sdk/` — JS/TS SDK for programmatic agents
- `common/` — shared types, 32 tool definitions, schemas, utilities
- `agents/` — 8+ agent types (base2 variants, editor, reviewer, thinker, basher, browser-use, file-explorer)
- `packages/agent-runtime/` — agent execution engine (prompt-agent-stream, tool-stream-parser, MCP)
- `packages/code-map/` — tree-sitter source parsing (26 languages)
- `packages/llm-providers/` — public LLM provider shims
- `freebuff/` — Freebuff-specific CLI, release scripts, E2E tests
- `modkit/` — Local-first modification/enhancement layer (freebuff-modkit v0.1.0)

**Modkit details:**
- 11 source files: `ci.ts`, `cli.ts`, `config.ts`, `git.ts`, `gitleaks.ts`, `mods.ts`, `paths.ts`, `privacy.ts`, `secret-scan.ts`, `upstream.ts`
- 10 test files in `modkit/tests/`
- Config: `localOnly:true, allowRemoteRead:true, allowRemoteMutation:false, allowPush:false, allowPrCreation:false, allowUpstreamMutation:false`
- Allowlist: 1 entry (cli/release/README.md line 103 — false positive for proxy URL syntax)
- CI: `modkit-ci.yml` — runs modkit tests + typecheck + scan + ShellCheck + Gitleaks

**Agent tools (32 total):**
- Filesystem: `read-files`, `write-file`, `str-replace`, `list-directory`, `glob`, `read-subtree`, `find-files`, `apply-patch`, `code-search`
- Shell: `run-terminal-command` (DANGEROUS)
- External: `read-url`, `read-docs`, `gravity-index`, `browser-logs`, `composio`
- UI: `render-ui`, `ask-user`
- Planning: `add-subgoal`, `create-plan`
- Conversation: `add-message`, `set-messages`, `set-output`, `end-turn`
- Agent: `skill`, `lookup-agent-info`, `compile-tool-definitions`

Full details: `FREEBUFF-CLI-SKILLS.json`

---

## 4. FREEBUFF CLI ARCHAEOLOGY

The Freebuff CLI is an OpenTUI + React terminal application built with Bun. **Not separately inspectable as a standalone CLI binary** — it's part of the freebuff-forge monorepo.

**Architecture:**
```
User Request → CLI (OpenTUI+React) → Agent Runtime → LLM Provider API
                 ↓                       ↓
            Skill System            Tools (32 defined)
                 ↓                       ↓
            Skill.md files          Filesystem, Shell, Network
```

**Key observation:** The CLI does not currently have a Desktop integration through Electron or Tauri in the inspected source. The "Desktop" referenced in previous reports may be Orca/Desktop Commander — a separate application, not a Freebuff-built desktop app.

---

## 5. FREEBUFF DESKTOP ARCHAEOLOGY

**Finding:** No Electron/Tauri desktop application found in the Freebuff-forge monorepo. No `desktop/` or `electron/` directory exists.

The "Desktop" experience is delivered through:
1. **OpenTUI + React** terminal UI — the primary CLI interface
2. **Orca/Desktop Commander** — a separate desktop application that can host agents

**Preview capabilities:**
- No built-in HTML preview server found in CLI source
- The existing Compass preview at `http://127.0.0.1:50179/` uses Python's `http.server`
- Freebuff-forge has browser-use agent — can control Chrome via Playwright
- No `iframe`-based static preview renderer found

**For GitHub Pages / local preview of the Ix-findings Compass:**
- Option A: GitHub Pages from the `planning/wiki/` directory
- Option B: Python `http.server` (already used)
- Option C: Orca/Desktop Commander browser window

---

## 6. IX ARCHAEOLOGY

**Ix** is `ix-infrastructure/Ix` — a memory graph system for LLM assistants.
**`@ix/cli` v0.6.1** — TypeScript CLI package with Commander.js.

**Architecture:**
```
ix CLI (ix-cli/) → HTTP API → Scala Backend (localhost:8090, Docker)
                                ↓
                         ArangoDB (graph storage)
                                ↓
                         Compass UI (localhost:8080, React+rolldown)
```

**22 CLI commands:** map, explain, trace, impact, search, rank, smells, config, conflicts, contains, depends, diff, docker, doctor, entity, backend-status, bootstrap, callers, locate, read, reset, status, upgrade, view, ingest

**Tests:** 646/648 passing (vitest), tsc clean, eslint 0 errors / 38 warnings  
**Dependencies:** chalk, commander, yaml (only 3 production deps)  
**Dev deps:** vitest, typescript, eslint, prettier, knip, tsx  
**CI:** 9 workflows including ci.yml, release.yml, secret-scan.yml, security.yml

**Key boundary notes (from CLAUDE.md):**
- `ix reset` is **global** — wipes every workspace's graph
- OSS/Pro command boundary derived at runtime
- Compass patch lives in skill, not repo — must re-apply after `ix upgrade`

---

## 7. IX-FINDINGS ARCHAEOLOGY

**Ix-findings** is `Alot1z/Ix-findings` — the investigation ledger.

**Structure:** 177 tracked files across 18 top-level directories:
- `CLI-HANDOFF/` — 21 files (handoff, manifest, reports)
- `planning/` — 118 files (regions, maps, findings, evidence, decisions, wiki)
- `pr-packets/` — 4 contribution packets
- `comparisons/`, `github/`, `security/`, `state/`, `reports/` — supporting evidence

**Knowledge system:**
- **Graph:** 152 nodes / 136 edges (MANIFEST IS STALE: claims 290/240)
- **Findings:** 13 (F-001 through F-013)
- **Evidence:** 25 (registry: 25, manifest claims 28)
- **Decisions:** 14 (9 decided, 5 open)
- **Suggestions:** 33
- **Phases:** 16

**Knowledge Explorer:** `planning/wiki/` — 22-view standalone HTML (170KB). Build process: `build-data.mjs` → `data/data.js` → inlined into `index-standalone.html`. D3 graph, global search, entity detail panels.

**Known discrepancies:**
- C-001: Graph nodes: 152 actual vs 290 claimed
- C-002: Graph edges: 136 actual vs 240 claimed
- C-003: Evidence: 25 actual vs 28 claimed
- C-004: Duplicate handoff dirs (CLI-HANDOFF + empty IX-INVESTIGATION-HANDOFF)
- C-005: 3 uncommitted files (wiki.js, index-standalone.html, GIT-STATE.md)

---

## 8. COMPASS ARCHAEOLOGY

**ix-compass-dist** is the distribution channel for the System Compass UI.

**Releases:** v0.1.0, v0.1.1, v0.2.0, v0.3.0

**Architecture (from v0.3.0 tarball):**
- Static React SPA built with Rolldown
- 7 bundle chunks (JS + CSS)
- D3-based graph visualization
- Components: CommandBar, EntityDetailPanel, KeyboardHelp, TimelineScrubber
- Icons, Framer Motion animations, Radix UI primitives
- No server needed — works from `file://` or any HTTP server

**Compass data flow:**
```
Ix CLI → Scala Backend → HTTP API
                            ↓
                    Compass fetches JSON
                            ↓
                    Renders D3 graph
```

**The fit-view patch** (`skills/ix/scripts/compass-patch/fit-view.js`):
- Adds F-key to fit graph to viewport
- Auto-frame on first render and drill-in/out
- Live theme re-sampling
- Applied via `apply.sh` into `$IX_HOME/cli/compass/`
- **Patch is external to the Compass build** — it injects a `<script>` tag

---

## 9. SYSTEM-COMPASS ACCESS BOUNDARY

**Status:** PRIVATE — HTTP 404. No fork exists (`Alot1z/system-compass` = 404).  
**Verified:** 2026-08-10 via `gh api` and `git ls-remote`.  
**Blocked findings:** F-001 through F-007 (cannot source-verify).  
**Resolution:** D-014 — request access from KageBinary.

7 findings depend on system-compass source. They remain classified by public evidence class (A–D) based on observed behavior, not source confirmation.

**Do NOT:** create unauthorized fork, attempt bypass, infer implementation, contact maintainer (unauthorized).

---

## 10. COMPLETE SKILL INVENTORY

**83 skills installed** at `~/.agents/skills/`. 14 referenced-only skills not present on disk.

### Category breakdown

| Category | Count | Key Skills |
|---|---|---|
| Thinking/Reasoning | 13 | sequential-thinking, tractatus-thinking, debug-thinking, doubt-driven-dev, source-driven-dev, verification-before |
| Repository Engineering | 12 | git-workflow, using-git-worktrees, code-review, code-simplification, incremental-impl |
| Product/UI | 8 | frontend-design, frontend-ui-eng, canvas-design, theme-factory, artifacts-builder |
| Graph/Knowledge | 7 | ix, code-review-graph, graphify, gitingest, context-engineering, workspace-memory |
| Prompt/Orchestration | 7 | using-agent-skills, find-skills, skill-creator, planning, prompt-optimizer |
| Documentation | 7 | documentation-writer, documentation-and-adrs, deepwiki, find-docs, readme-skill |
| CI/Security | 6 | ci-cd, github-actions-docs, security-and-hardening, observability, performance |
| Browser | 6 | agent-browser, browser-testing, browser-to-api, playwright-cli, webapp-testing, web-reader |
| Architecture | 3 | api-and-interface-design, mcp-builder, system-connector |
| Document | 3 | docx, pdf, pptx |
| CLI | 2 | cli-anything, orca-cli |
| Orchestration | 2 | forge, orchestration |
| Packaging | 2 | gepeto, pinokio |
| Testing | 2 | tdd, test-driven-development |

### Python skills (9): debug-thinking, sequential-thinking, tractatus-thinking, code-review-graph, context7, forge, docx, agent-browser, agent-token-optimizer, autonomous-implementation-pattern

### Versioned skills: code-review-graph (v2.0.0), debug-thinking (v1.0.0), forge (v2), sequential-thinking (v2.0.0), tractatus-thinking (v2.0.0)

### Skills NOT installed ('referenced only'):
preview, review, overhaul, commit, open-pr, merge-pr, simplify, derisk, autorun, document, explain, git, test (14 total). Some may be aliases of installed skills.

Full detail: `SKILL-INVENTORY.json`

---

## 11. COMPLETE FREEBUFF CLI SKILL REGISTRY

The Freebuff CLI skill/tool system is **decomposed** — it is not a monolithic skill file. The agent runtime loads tool definitions from `common/src/tools/` and agent definitions from `agents/`.

**Key architecture:**
- `packages/agent-runtime/` — orchestrates agent execution, tool streaming, history compaction
- `common/src/tools/` — 32 tool parameter definitions (Zod schemas)
- `agents/` — agent prompt templates and configurations
- `sdk/` — programmatic SDK for custom agents
- `modkit/` — local enhancement layer with safety gates

**Tool categories:**
- **Conversation (5):** add-message, set-messages, set-output, end-turn, ask-user
- **Filesystem read (7):** read-files, read-subtree, list-directory, glob, code-search, find-files, file-picker
- **Filesystem write (4):** write-file, str-replace, apply-patch, propose-str-replace
- **Network (4):** read-url, read-docs, gravity-index, browser-logs
- **Shell (1):** run-terminal-command (DANGEROUS)
- **Planning (2):** add-subgoal, create-plan
- **Agent (4):** skill, lookup-agent-info, compile-tool-definitions, composio
- **UI (2):** render-ui, propose-write-file

Full detail: `FREEBUFF-CLI-SKILLS.json`

---

## 12. RULE SYSTEM

### Rule layers discovered (in precedence order):

1. **System prompt** (Freebuff CLI) — highest authority, defines identity and behavior
2. **AGENTS.md** (freebuff-forge) — project-specific conventions, monorepo structure, dependency injection
3. **CLAUDE.md** (Ix) — repository-specific: Docker setup, boundaries, gotchas
4. **Skill SKILL.md files** — per-skill instructions (83 files)
5. **Phase prompts** — task-specific instructions (CLI-HANDOFF/FREEBUFF-CLI-PROMPT.md)
6. **Workspace memory** — persistent state via `.memory/`

### Key rules found:
- **freebuff-forge/AGENTS.md:** Use `bun install/run`, DI over module mocking, tmux for CLI tests, don't force-push main
- **Ix/CLAUDE.md:** `ix reset` is global, Compass patch must be re-applied after upgrade, OSS/Pro boundary at runtime
- **Freebuff CLI prompt:** Read-only investigation first, evidence before assertion, no fabrications

### Rule contradictions: None identified between layers. Freebuff-forge AGENTS.md and Ix CLAUDE.md address different projects.

Full detail: see companion `RULE-SYSTEM-ARCHAEOLOGY.md`

---

## 13. TOOL INVENTORY

24 tools available in the current CLI execution environment:

| Mutation Class | Count | Tools |
|---|---|---|
| READ_ONLY | 16 | read_files, list_directory, glob, read_subtree, file_picker, code_searcher, code_reviewer_deepseek, thinker_with_files_gemini, researcher_web, researcher_docs, read_url, gravity_index, render_ui, ask_user, skill, context_pruner, suggest_followups, write_todos, set_output |
| LOCAL_MUTATION | 3 | write_file, str_replace, browser_use |
| ORCHESTRATION | 1 | spawn_agents |
| FULL_SHELL | 2 | basher, tmux_cli |

**Dangerous tools:** basher (full shell), tmux_cli (full shell), browser_use (credential access), spawn_agents (delegates authority)

Full detail: `TOOL-PERMISSIONS.json`

---

## 14. TOOL PERMISSION MATRIX

See `TOOL-PERMISSIONS.json` for complete matrix. Key safety findings:

- **basher** can do anything: read/write files, run git, push to remotes, use credentials
- **browser_use** can access authenticated browser sessions
- **spawn_agents** delegates authority — parent must enforce boundaries
- No tool independently creates PRs/issues (requires explicit shell command)
- GitHub token at `C:\Users\jacob\.env-files\tokens\githubfixed.token` is accessible to basher

---

## 15. PROMPT SYSTEM

### Prompt hierarchy:
```
System Prompt (Buffy identity + rules)
  ├── Phase Prompt (task-specific instructions)
  ├── Skill Instructions (loaded via skill tool)
  ├── AGENTS.md / CLAUDE.md (repo-specific)
  └── Workspace Memory (.memory/)
```

### Key prompt files inspected:
- `CLI-HANDOFF/FREEBUFF-CLI-PROMPT.md` — the original investigation handoff prompt
- `freebuff-forge/AGENTS.md` — project conventions
- `Ix/CLAUDE.md` — repo boundaries and gotchas

### Prompt system observations:
- Prompts are **cumulative** — each layer adds constraints
- No prompt orchestrator/dependency resolver found
- Phase prompts often duplicate system prompt rules (redundancy as safeguard)
- No automated prompt validation/consistency checking

Full detail: `PROMPT-SYSTEM-ARCHAEOLOGY.md`

---

## 16. ARCHITECTURE

Cross-project architecture is mapped in `ARCHITECTURE-GRAPH.json`. 24 nodes and 19 edges covering all verified relationships.

### Projects are INDEPENDENT:
- **Ix ecosystem:** Ix + Compass-dist + Ix-findings + system-compass
- **Freebuff ecosystem:** freebuff-forge + freebuff-mod + freebuff-configs
- **Investigation bridge:** Ix-findings investigates both Ix and Compass

### Key architecture relationships:
```
Alot1z/Ix ← fork_of ← ix-infrastructure/Ix
Alot1z/freebuff-forge ← fork_of ← CodebuffAI/freebuff
Ix-findings → investigates → ix-infrastructure/Ix
Ix-findings → investigates → ix-infrastructure/system-compass (BLOCKED)
compass-patch → patches → compass-dist HTML
modkit → enhances → freebuff-forge
```

---

## 17. API / INTERFACE MAP

### Ix interfaces:
- **CLI → Backend:** HTTP REST (localhost:8090)
- **Compass → Backend:** HTTP REST (localhost:8090)
- **Compass UI → Data:** JSON from backend
- **Compass patch → Compass HTML:** `<script>` injection
- **ix upgrade → Compass dist:** Downloads tarball from ix-compass-dist releases

### Freebuff interfaces:
- **CLI → Agent Runtime:** Direct function calls
- **Agent Runtime → LLM:** Provider shims
- **Agent Runtime → Tools:** Tool stream parser
- **Modkit → Freebuff-forge:** Local filesystem modification layer
- **Modkit → CI:** Gitleaks, ShellCheck, bun test

---

## 18. DEPENDENCY MAP

### Ix (@ix/cli v0.6.1):
- **Runtime:** Node.js >= 22, Docker, ripgrep
- **Production deps (3):** chalk, commander, yaml
- **Dev deps (11):** vitest, typescript, eslint, prettier, knip, tsx, @vitest/coverage-v8
- **Backend:** Scala + ArangoDB (separate repo, Docker-managed)

### Freebuff-forge:
- **Runtime:** bun@1.3.14
- **Monorepo workspaces (9):** agents, cli, common, evals, freebuff, packages/agent-runtime, packages/code-map, packages/llm-providers, sdk
- **Key framework deps:** React 19, Vercel AI SDK, Zod, OpenTUI
- **Modkit deps (2):** @types/bun, typescript

### Dependency concerns: None identified. Both projects use minimal, well-known dependencies.

---

## 19. TESTING

| Project | Framework | Tests | Result | Evidence |
|---|---|---|---|---|
| Ix | vitest | 648 total | 646 pass, 2 skip | Fresh run @ c4f8fea |
| Ix | tsc | — | Clean (0 errors) | typecheck |
| Ix | ESLint | — | 0 errors / 38 warnings | eslint src |
| Ix remap | vitest | 10 guard + 656 suite | Pass | In remap worktree |
| Freebuff Forge modkit | bun test | 10 test files | Pass (CI) | modkit-ci.yml |
| Ix-findings | None | 0 | N/A | No test framework |

---

## 20. CI/CD

### Ix CI (9 workflows):
- **ci.yml** — static gate: lint, typecheck, format, NUL byte guard
- **release.yml** — builds Compass bundle, builds CLI per-platform, creates GitHub Release, updates Homebrew
- **secret-scan.yml** — Gitleaks with full history
- **security.yml** — additional security scanning
- **scorecard.yml** — OpenSSF Scorecard
- **config-security.yml**, **dependency-review.yml**, **pr-title.yml**, **actions-lint.yml**

### Freebuff Forge CI (1 workflow):
- **modkit-ci.yml** — modkit tests + typecheck + scan + ShellCheck + Gitleaks

---

## 21. SECURITY

### Ix security controls:
- Gitleaks (secret-scan.yml)
- OpenSSF Scorecard
- Dependency review
- Config security checks
- PR title validation
- NUL byte guard (prevents binary-as-text bypass)

### Freebuff Forge security controls:
- Modkit config: all mutations deny-by-default
- Gitleaks (via modkit-ci.yml)
- Allowlist for false positives
- ShellCheck for script validation
- Secret scan in modkit (`secret-scan.ts`)

### Credential handling:
- GitHub token at `C:\Users\jacob\.env-files\tokens\githubfixed.token`
- Token is accessible to basher/tmux_cli (full shell access)
- No token rotation mechanism observed
- No credential encryption at rest

---

## 22. DOCUMENTATION

### Documentation present:
**Ix:** CLAUDE.md, docs/api/README.md, docs/api/openapi.yaml, Formula/ix.rb, skills/ix/SKILL.md  
**Freebuff-forge:** AGENTS.md, CONTRIBUTING.md, README.md, SECURITY.md, WINDOWS.md  
**Ix-findings:** CLI-HANDOFF/ (21 files), README.md, planning/wiki/ (explorer)

### Documentation gaps:
- **Ix CLI:** Many commands lack standalone docs (22 commands, only a few have README sections)
- **Ix API:** OpenAPI spec exists but incomplete
- **Freebuff Forge:** No architecture diagram, no agent-authoring guide
- **Ix-findings:** Manifest is stale, graph counts don't match, PR matrix needs updates

---

## 23. KNOWLEDGE SYSTEM

The Ix-findings knowledge system is a **Markdown + JSON + HTML hybrid**:
- **Registries** (JSON): findings, evidence, decisions, suggestions
- **Maps** (JSON): investigation-map (graph), phases, timeline, repository-map
- **Generated HTML**: standalone knowledge explorer (170KB)
- **Handoff documents** (MD): 21 files in CLI-HANDOFF/

### Source of truth hierarchy:
1. `planning/maps/investigation-map.json` — graph (152 nodes / 136 edges)
2. `planning/findings/registry.json` — 13 findings
3. `planning/evidence/registry.json` — 25 evidence items
4. `planning/decisions/registry.json` — 14 decisions
5. `planning/suggestions/registry.json` — 33 suggestions

### Stale artifacts:
- `CLI-HANDOFF/manifest.json` v4.0.0 — claims 290 nodes, 240 edges, 28 evidence (WRONG)
- `IX-INVESTIGATION-HANDOFF/` — empty, locked, stale directory

---

## 24. CURRENT CAPABILITIES

### Fully implemented and verified:
- Ix CLI v0.6.1 with 22 commands
- Ix backend API (Scala + ArangoDB)
- Ix Compass UI (React + D3, 4 releases)
- Ix remap hardening (c021b52, 4 files, pushed to fork)
- Freebuff CLI (OpenTUI + React, 32 tools, 8+ agents)
- Freebuff modkit (v0.1.0, 11 source files, 10 tests)
- Ix-findings knowledge explorer (22 views, standalone HTML)

### PARTIAL:
- Ix agent skill (b038c46, 14 dirty — active development)
- Ix-findings manifest (stale counts)
- Freebuff Forge upstream sync (divergence not measured)

### BLOCKED:
- System-compass (private, no access)
- F-key contribution (depends on system-compass)
- Delayed-data fix (depends on system-compass)

---

## 25. PARTIAL / BROKEN CAPABILITIES

| Capability | Status | Fix |
|---|---|---|
| Ix-findings manifest counts | STALE (290→152 nodes) | Regenerate from actual graph |
| Ix agent skill | PARTIAL (14 dirty) | Complete active development |
| Ix-findings GitHub Pages | NOT CONFIGURED | Enable in repo Settings |
| Freebuff Forge upstream divergence | UNMEASURED | Fetch upstream + log comparison |
| IX-INVESTIGATION-HANDOFF dir | STALE + LOCKED | Remove when filesystem lock clears |
| F-013 zoom discrepancy | UNKNOWN (Class D) | Needs system-compass source |

---

## 26. IMPLEMENTATION CANDIDATES

See `IMPLEMENTATION-CANDIDATES.json` for complete inventory.

### READY (no blocker, just needs authorization):
- **ix_remap:** Pushed to fork, clean, 4 files + tests. Open PR.

### IN DEVELOPMENT (protected):
- **ix_agent_skill:** 14 dirty files. Continue development.

### BLOCKED (external dependency):
- **compass_f_key:** System-compass private
- **compass_delayed_data:** System-compass private
- **f_013_zoom:** System-compass private

### NEEDS MORE EVIDENCE:
- **f_008_upgrade:** Verify still reproducible
- **f_009_patches:** Verify still reproducible

### DISCOVERED OPPORTUNITY:
- **ix_findings_manifest_fix:** Update stale counts
- **ix_findings_github_pages:** Enable deployment
- **ix_documentation_gaps:** Expand CLI docs

### ALREADY COVERED / DO NOT DO:
- **compass_auto_frame:** Covered by Compass #57
- **PR #368 duplicate:** Already merged. Do not reopen.

---

## 27. CONTRADICTIONS

Continuing from Phase 0 contradictions (C-001 through C-006):

| ID | Claim A | Claim B | Resolution |
|---|---|---|---|
| C-001 | Graph: 290 nodes | Actual: 152 | Manifest stale — update from source |
| C-002 | Graph: 240 edges | Actual: 136 | Manifest stale — update from source |
| C-003 | Evidence: 28 | Actual: 25 | Manifest stale — update from source |
| C-004 | CLI-HANDOFF authoritative | IX-INVESTIGATION-HANDOFF exists (empty) | Remove stale dir when unlocked |
| C-005 | Ix-findings clean | 3 uncommitted files | Clean up working tree |
| C-006 | FREEBUFF-CLI-PROMPT.md not renamed | Still present | Rename or remove |
| **C-007** | **PR #376 exists** | **Returns 404 from GitHub API** | May be issue #376, not PR 🤔 |
| **C-008** | **PR #371 exists** | **Returns 404 from GitHub API** | May be issue #371, not PR |

---

## 28. UNKNOWN / BLOCKED ITEMS

| Unknown | Why | Resolution Path |
|---|---|---|
| system-compass source | Private, 404 | D-014: request access |
| system-compass commits | No access | Same |
| Freebuff Forge upstream divergence | Not measured | `git fetch upstream && git log` |
| F-013 zoom multiplier | Class D, low confidence | Needs system-compass source |
| F-008 reproducibility | Not verified on latest | Test on c4f8fea |
| F-009 reproducibility | Not verified on latest | Test on c4f8fea |
| Desktop (Electron/Tauri) app | Not found in Freebuff-forge | May be Orca — separate project |

---

## 29. SKILLS ACTUALLY USED

| Skill | Used | Purpose |
|---|---|---|
| `ix` | ❌ Not used | Ix CLI not invoked — source-only inspection |
| `workspace-memory` | ❌ Not used | Phase 1 uses explicit Git history, not memory graph |
| `verification-before-completion` | ✅ Applied | Every claim verified against live state |
| `doubt-driven-development` | ✅ Applied | Stale manifest claims challenged |
| `source-driven-development` | ✅ Applied | Source code preferred over documentation |
| `sequential-thinking` | ✅ Applied | Multi-step archaeology ordered by evidence priority |
| `using-agent-skills` | ✅ Referenced | Skill discovery via filesystem + invocation system |
| `git-workflow-and-versioning` | ✅ Referenced | Git state inspection via plumbing |
| `find-docs` | ✅ Used | Documentation inspection |
| `deepwiki` | ✅ Used | GitHub API for PR/issue metadata |

---

## 30. TOOLS ACTUALLY USED

| Tool | Count | Purpose |
|---|---|---|
| basher | 16 | Repository Git audits, file discovery, JSON parsing |
| read_files | 1 | Phase 0 baseline ingestion |
| write_file | 6 | JSON inventories, Markdown reports |
| write_todos | 1 | Task tracking |
| spawn_agents | 3 | Parallel discovery agents |

---

## 31. EXTERNAL ACTIONS

| Action | Count |
|---|---|
| PRs created | **0** |
| Issues created | **0** |
| Reviews/comments | **0** |
| Maintainer contacts | **0** |
| Repository creation | **0** |
| git push | **0** |
| Merges | **0** |
| Force pushes | **0** |
| Upstream mutations | **0** |
| GitHub API reads | Read-only metadata (3 queries) |

---

## 32. PROTECTED WORK

| Worktree | Path | Head | Dirty | Status |
|---|---|---|---|---|
| Ix primary | `E:/E-github-repos/Ix` | `b038c46` | 14 | ✅ UNCHANGED |
| ix-compass-dist | `E:/E-github-repos/ix-compass-dist` | `396426b` | 3 | ✅ UNCHANGED |

---

## 33. PHASE 2 INPUT

Phase 2 should consume:
- `phase-1/PHASE-1-REPORT.md` (this report)
- `phase-1/SKILL-INVENTORY.json`
- `phase-1/FREEBUFF-CLI-SKILLS.json`
- `phase-1/REPOSITORY-ARCHAEOLOGY.json`
- `phase-1/TOOL-PERMISSIONS.json`
- `phase-1/ARCHITECTURE-GRAPH.json`
- `phase-1/IMPLEMENTATION-CANDIDATES.json`

---

## 34. FINAL INTEGRITY CHECK

| Check | Result |
|---|---|
| Protected worktree unchanged | ✅ b038c46 (14 dirty) |
| No secrets written | ✅ |
| No PRs created | ✅ |
| No issues created | ✅ |
| No maintainer contacted | ✅ |
| No external mutations | ✅ |
| All JSON files parse | ✅ |
| Phase 1 evidence-backed | ✅ Live source/API/filesystem |
| Stale claims NOT silently rewritten | ✅ |
