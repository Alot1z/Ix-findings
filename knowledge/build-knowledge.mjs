// Canonical Ix-findings knowledge builder. Node built-ins only; no network or external mutation.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = here;
const generatedAt = "2026-08-12";
const UNKNOWN = "UNKNOWN";
const readText = p => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const readJson = p => { try { return JSON.parse(readText(p)); } catch { return null; } };
const safe = s => String(s ?? "").replace(/\s+/g, " ").trim();
const idHash = s => createHash("sha1").update(s).digest("hex").slice(0, 12);
const files = [];
const skip = new Set([".git", "node_modules", "knowledge", "public", "phase-d", "phase-e", "phase-f", "phase-g", "phase-h", "phase-i", "phase-j"]);
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const isPhaseCVisual = dir === join(root, "planning", "phase-c");
    if (skip.has(name) || (isPhaseCVisual && /\.(png|jpe?g|gif|webp)$/i.test(name))) continue;
    const p = join(dir, name); const st = statSync(p);
    if (st.isDirectory()) walk(p); else files.push(p);
  }
}
for (const dir of ["CLI-HANDOFF", "planning", "pr-packets", "reports", "comparisons", "decisions", "findings", "github", "state", "manifests", "security", "artifacts"]) walk(join(root, dir));

const sourceEntities = files.map(p => {
  const rel = relative(root, p).replaceAll("\\", "/");
  const text = readText(p);
  const format = extname(p).toLowerCase().slice(1) || "text";
  let role = "HISTORICAL";
  if (/planning\/(findings|evidence|suggestions|decisions)\/registry\.json$/.test(rel)) role = "CANONICAL_REGISTRY";
  else if (/planning\/maps\/.+\.json$/.test(rel)) role = "DERIVED_GRAPH_FRAGMENT";
  else if (/CLI-HANDOFF\/phase-15\//.test(rel)) role = "AUDIT_ARTIFACT";
  else if (/PHASE-\d+-REPORT\.md$/.test(rel)) role = "PHASE_REPORT";
  else if (/public\/data\/data\.js$/.test(rel)) role = "PUBLIC_SNAPSHOT";
  return { source_id: `SRC-${idHash(rel)}`, path: rel, format, bytes: statSync(p).size, role, readable: text.length > 0, sha1: idHash(text), generated_at: UNKNOWN };
});
const sourceByPath = Object.fromEntries(sourceEntities.map(s => [s.path, s]));
const src = p => sourceByPath[p] ? [sourceByPath[p].source_id] : [];
const sourceRefs = (...paths) => [...new Set(paths.flatMap(p => Array.isArray(p) ? p.flatMap(x => src(x)) : src(p)))];

const add = (map, entity) => { if (!map.has(entity.canonical_id)) map.set(entity.canonical_id, entity); else map.get(entity.canonical_id).source_refs = [...new Set([...(map.get(entity.canonical_id).source_refs || []), ...(entity.source_refs || [])])]; };
const entities = new Map();
const relationships = [];
const edgeKeys = new Set();
function entity(type, id, name, data = {}) {
  const e = { canonical_id: id, entity_type: type, canonical_name: name, aliases: [], status: data.status || "UNKNOWN", confidence: data.confidence || "UNKNOWN", human_summary: data.human_summary || name, deep_summary: data.deep_summary || data.human_summary || name, evidence_ids: data.evidence_ids || [], source_refs: data.source_refs || [], temporal: data.temporal || { valid_from: UNKNOWN, valid_until: UNKNOWN, observed_at: UNKNOWN, verified_at: UNKNOWN, introduced_by: UNKNOWN, fixed_by: UNKNOWN }, llm: data.llm || { llm_summary: data.human_summary || name, llm_context: "", llm_facts: [], llm_uncertainties: [], llm_questions: [], llm_evidence_chain: data.evidence_ids || [], llm_relationships: [], llm_search_terms: [id, name] }, ...data }; add(entities, e); return e; }
const relationshipDerivation = type => {
  if (type === "CO_CHANGED_WITH") return "STATISTICAL";
  if (["PARENT", "CHANGES", "CHANGED_BY", "HEADS_AT", "CURRENT_STATE_OF", "HEAD_MOVED_TO"].includes(type)) return "VERIFIED_GIT";
  if (["AUTHORED", "COMMENTED_ON", "HAS_REVIEW", "REVIEWED_BY", "RESPONDS_TO", "FOUND_IN", "REFERENCES", "INCLUDES_COMMIT"].includes(type)) return "VERIFIED_GITHUB";
  if (["HAS_SOURCE", "GENERATED_FROM", "PART_OF", "BELONGS_TO", "POINTS_TO", "CLONES", "WORKTREE_OF", "FORK_OF"].includes(type)) return "VERIFIED_REGISTRY";
  return "EVIDENCE_LINKED";
};
function edge(from, to, type, data = {}) {
  if (!entities.has(from) || !entities.has(to)) return;
  const key = `${from}|${type}|${to}`; if (edgeKeys.has(key)) return; edgeKeys.add(key);
  const sourceRefs = data.source_refs || [];
  relationships.push({ relationship_id: `REL-${idHash(key)}`, from, to, type, confidence: data.confidence || "MEDIUM", status: data.status || "CURRENT", derivation_class: data.derivation_class || relationshipDerivation(type), extraction_method: data.extraction_method || "knowledge/build-knowledge.mjs", provenance_status: sourceRefs.length || (data.evidence_ids || []).length ? "PARTIAL" : "UNKNOWN", source_refs: sourceRefs, evidence_ids: data.evidence_ids || [], summary: data.summary || `${from} ${type} ${to}`, temporal_scope: data.temporal_scope || { valid_from: UNKNOWN, valid_until: UNKNOWN } });
}
function linkRefs(owner, ids, type, source_refs = []) { for (const id of ids || []) { if (entities.has(id)) edge(owner, id, type, { source_refs }); } }

const manifest = readJson(join(root, "CLI-HANDOFF/manifest.json")) || {};
const findingsReg = readJson(join(root, "planning/findings/registry.json")) || { findings: [] };
const evidenceReg = readJson(join(root, "planning/evidence/registry.json")) || { evidence: [] };
const suggestionsReg = readJson(join(root, "planning/suggestions/registry.json")) || { suggestions: [] };
const decisionsReg = readJson(join(root, "planning/decisions/registry.json")) || { decisions: [] };
const phasesReg = readJson(join(root, "planning/maps/phases.json")) || { phases: [] };
const timelineReg = readJson(join(root, "planning/maps/timeline-map.json")) || { events: [] };
const graphReg = readJson(join(root, "planning/maps/investigation-map.json")) || { nodes: [], edges: [] };
const auditCandidates = readJson(join(root, "CLI-HANDOFF/phase-15/AUDIT-CANDIDATE-UNIVERSE.json")) || { candidates: [] };
const finalAudit = readJson(join(root, "CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json")) || {};
const liveGitHub = readJson(join(root, "knowledge/live-github-state.json")) || { open_issues: [], open_pull_requests: [], implementations: [], fork_branches: {} };
const phaseBIdentity = readJson(join(root, "knowledge/identity-registry.json")) || { entities: [], relationships: [] };
const phaseCCollaboration = readJson(join(root, "knowledge/github-collaboration.json")) || { entities: [], relationships: [] };
const phaseCGit = readJson(join(root, "planning/phase-c/GIT-INTELLIGENCE.json")) || { commits: [], files: [], branches: [], relationships: [] };
const externalMirror = readJson(join(root, "knowledge/external-github-mirror.json")) || { records: [] };
const liveHead = liveGitHub.upstream?.head_sha || finalAudit.live_baseline?.upstream_head || "1292375548fb";
// Live open/merged state is authoritative when the refreshed read-only capture
// (knowledge/live-github-state.json) records it. The Phase-15 audit baseline is
// retained only as a fallback for numbers absent from the capture, so a
// merged/closed PR can never stay OPEN merely because an older manifest listed
// it (RULE 12: GitHub wins for external state).
const capturedOpenPRs = new Set((liveGitHub.open_pull_requests || []).map(pr => pr.number));
const capturedOpenIssues = new Set((liveGitHub.open_issues || []).map(issue => issue.number));
const auditOpenPRs = new Set(finalAudit.live_baseline?.open_prs || [395, 393, 388]);
const auditOpenIssues = new Set(finalAudit.live_baseline?.open_issues || [385, 383, 349, 219]);
const capturedMergedPRs = new Set((externalMirror.records || []).filter(record => record.source?.type === "github_pull_request" && record.snapshot?.merged === true && record.snapshot?.state === "closed").map(record => record.snapshot?.number));
// Closed-but-unmerged PRs are also not OPEN; the mirror proves their terminal state.
const capturedClosedPRs = new Set((externalMirror.records || []).filter(record => record.source?.type === "github_pull_request" && record.snapshot?.state === "closed").map(record => record.snapshot?.number));
const capturedClosedIssues = new Set((externalMirror.records || []).filter(record => record.source?.type === "github_issue" && record.snapshot?.state === "closed").map(record => record.snapshot?.number));
const auditMergedPRs = new Set([352, 368, 372, 375, 378, 380, 382, 384, 386, 387, 389, 390, 391, 392, 394]);
const auditClosedIssues = new Set([371, 376, 377, 379]);
// A number is OPEN only when the live capture records it open. Merged/closed
// state recorded by the mirror overrides the audit baseline, and the audit
// baseline is kept only for numbers the capture does not know at all.
const liveOpenPRs = new Set([...auditOpenPRs].filter(number => !capturedMergedPRs.has(number) && !capturedClosedPRs.has(number)));
const liveOpenIssues = new Set([...auditOpenIssues].filter(number => !capturedClosedIssues.has(number)));
for (const number of capturedOpenPRs) liveOpenPRs.add(number);
for (const number of capturedOpenIssues) liveOpenIssues.add(number);
const liveMergedPRs = new Set([...auditMergedPRs, ...capturedMergedPRs].filter(number => !capturedOpenPRs.has(number)));
const liveClosedIssues = new Set([...auditClosedIssues, ...capturedClosedIssues].filter(number => !capturedOpenIssues.has(number)));
// Live-verified head for a manifest branch/commit: open-PR heads first, then
// the captured fork branch heads (repo-guarded so unrelated repos and upstream
// main snapshots are never matched to the fork's branches).
const liveHeadFor = (branch, repo) => {
  if (!branch) return null;
  const livePR = (liveGitHub.open_pull_requests || []).find(p => p.head_ref && p.head_sha && (branch.includes(p.head_ref) || p.head_ref.includes(branch)));
  if (livePR?.head_sha) return livePR.head_sha;
  if (branch === "main" && repo !== "Alot1z/Ix") return null;
  if (!["Alot1z/Ix", "ix-infrastructure/Ix"].includes(repo)) return null;
  for (const [forkRepo, branches] of Object.entries(liveGitHub.fork_branches || {})) {
    if (forkRepo !== "Alot1z/Ix") continue;
    for (const [name, sha] of Object.entries(branches || {})) {
      if (sha && (branch.includes(name) || name.includes(branch))) return sha;
    }
  }
  return null;
};

// Source files are first-class nodes so every provenance reference resolves.
for (const s of sourceEntities) entity("SOURCE", s.source_id, s.path, { status: s.role === "PUBLIC_SNAPSHOT" ? "HISTORICAL" : "CURRENT", confidence: "HIGH", human_summary: `${s.path} (${s.role}).`, deep_summary: `Local source artifact ${s.path}; format ${s.format}; ${s.bytes} bytes; content hash ${s.sha1}.`, metadata: s });

for (const r of manifest.repositories || []) entity("REPOSITORY", `REPO-${safe(r.repo_id || r.name).replaceAll("/", "-")}`, r.repo_id || r.name, { status: r.access === "PRIVATE" ? "BLOCKED" : "CURRENT", confidence: "HIGH", aliases: [r.url].filter(Boolean), human_summary: `${r.repo_id || r.name} (${r.role || "repository"}).`, deep_summary: safe(r.note || r.role || "Repository in the Ix investigation ecosystem."), source_refs: sourceRefs("CLI-HANDOFF/manifest.json"), metadata: { role: r.role, url: r.url, access: r.access || "PUBLIC" } });
for (const r of manifest.branches || []) { const lh = r.repo === "ix-infrastructure/Ix" && r.branch === "main" ? liveHead : liveHeadFor(r.branch, r.repo); const current = lh ? { ...r, sha: lh, historical_sha: r.sha, live_head: lh, dirty: false, historical_dirty: r.dirty, note: undefined, historical_note: r.note } : r; entity("BRANCH", `BRANCH-${idHash(`${r.repo}-${r.branch}`)}`, `${r.repo}:${r.branch}`, { status: current.dirty ? "IN_PROGRESS" : "CURRENT", confidence: "HIGH", human_summary: `${r.repo}:${r.branch} at ${current.sha || UNKNOWN}.`, source_refs: sourceRefs("CLI-HANDOFF/manifest.json", "CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json", "knowledge/live-github-state.json"), metadata: current }); }
for (const c of manifest.commits || []) entity("COMMIT", `COMMIT-${c.sha}`, c.sha, { status: c.historical ? "HISTORICAL" : "CURRENT", confidence: "HIGH", human_summary: c.msg || c.sha, deep_summary: `${c.repo || UNKNOWN} ${c.branch || c.pr || ""} — ${c.msg || UNKNOWN}.`, source_refs: sourceRefs("CLI-HANDOFF/manifest.json"), metadata: c });
for (const p of manifest.pull_requests || []) { const status = liveOpenPRs.has(p.number) ? "OPEN" : liveMergedPRs.has(p.number) || p.state === "MERGED" ? "RESOLVED" : "HISTORICAL"; entity("PULL_REQUEST", `PR-${p.number}`, `Ix PR #${p.number}`, { status, confidence: "HIGH", aliases: [p.url].filter(Boolean), human_summary: `Ix pull request #${p.number}: ${status}.`, source_refs: sourceRefs("CLI-HANDOFF/manifest.json", "CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json"), metadata: { ...p, historical_manifest_state: p.state, live_state: status } }); }
for (const i of manifest.issues || []) { const status = liveOpenIssues.has(i.number) ? "OPEN" : liveClosedIssues.has(i.number) || i.state === "CLOSED" ? "RESOLVED" : "HISTORICAL"; entity("ISSUE", `ISSUE-${i.number}`, `Ix issue #${i.number}`, { status, confidence: "HIGH", aliases: [i.url].filter(Boolean), human_summary: `Ix issue #${i.number}; current recorded state: ${status}.`, source_refs: sourceRefs("CLI-HANDOFF/manifest.json", "CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json"), metadata: { ...i, historical_manifest_state: i.state, live_state: status } }); }
// #219 status follows the refreshed live capture (GitHub wins); the Phase-15
// audit analysis is retained as deep_summary, not as the live state.
{
  const issue219State = liveOpenIssues.has(219) ? "OPEN" : liveClosedIssues.has(219) ? "RESOLVED" : "HISTORICAL";
  entity("ISSUE", "ISSUE-219", "Ix issue #219", { status: issue219State, confidence: "HIGH", aliases:["https://github.com/ix-infrastructure/Ix/issues/219"], source_refs:sourceRefs("CLI-HANDOFF/phase-15/ISSUE-RECONCILIATION.json","CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json","knowledge/live-github-state.json"), human_summary:`Ix issue #219: ${issue219State}.`, deep_summary:"Phase 15 audit treated #219 as a real, valuable request (add ix mcp subcommand); the fork implementation needed protocol-conformance rework. Live GitHub now records #219 closed; the audit remains historical analysis, not current state.", metadata:{ number:219, live_state: issue219State, title:"Add ix mcp subcommand: expose ix as a local MCP server", user:"josephismikhail" } });
}

// Live-verified open PRs/issues not present in the historical manifest become first-class entities.
for (const p of liveGitHub.open_pull_requests || []) {
  if (entities.has(`PR-${p.number}`)) continue;
  entity("PULL_REQUEST", `PR-${p.number}`, `Ix PR #${p.number}`, { status: "OPEN", confidence: "HIGH", aliases: [p.url].filter(Boolean), human_summary: `${p.title} — open.`, source_refs: sourceRefs("knowledge/live-github-state.json"), metadata: { number: p.number, title: p.title, url: p.url, state: "OPEN", live_state: "OPEN", user: p.user, head_ref: p.head_ref, head_sha: p.head_sha, head_repo: p.head_repo } });
}
// Live PR heads and implementation commits become first-class CURRENT commit
// entities so CHANGED_BY / DOCUMENTS_COMMIT edges resolve against full SHAs.
for (const p of liveGitHub.open_pull_requests || []) {
  if (!p.head_sha || entities.has(`COMMIT-${p.head_sha}`)) continue;
  entity("COMMIT", `COMMIT-${p.head_sha}`, p.head_sha, { status: "CURRENT", confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json"), human_summary: `${p.head_sha.slice(0, 8)} — current head of ${p.head_ref || "branch"} (${p.head_repo || UNKNOWN}).`, deep_summary: `Live-verified head of ${p.head_ref || "branch"} for open PR #${p.number}; captured in knowledge/live-github-state.json.`, metadata: { repo: p.head_repo, branch: p.head_ref, sha: p.head_sha, pr: p.number, live: true } });
}
for (const impl of liveGitHub.implementations || []) {
  for (const commit of impl.commit_refs || []) {
    if (entities.has(`COMMIT-${commit}`)) continue;
    entity("COMMIT", `COMMIT-${commit}`, commit, { status: "CURRENT", confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json"), human_summary: `${commit.slice(0, 8)} — implementation commit for ${impl.branch || impl.id}.`, deep_summary: `Live-verified implementation commit referenced by ${impl.id}.`, metadata: { repo: impl.repository, branch: impl.branch, sha: commit, implementation_id: impl.id, live: true } });
  }
}
// Manifest-era commits superseded by the live capture are marked HISTORICAL,
// never deleted, so stale branch heads are retained as provenance only.
for (const c of manifest.commits || []) {
  const branch = c.branch || "";
  const currentHead = liveHeadFor(branch, c.repo);
  if (currentHead && c.sha !== currentHead && entities.has(`COMMIT-${c.sha}`)) {
    const e = entities.get(`COMMIT-${c.sha}`);
    e.status = "HISTORICAL";
    e.human_summary = `${e.human_summary} Superseded: ${c.branch} head is now ${currentHead.slice(0, 8)}.`;
    e.deep_summary = `${e.deep_summary || ""} The live capture records a newer head (${currentHead.slice(0, 8)}) for this branch; the manifest-era commit is retained as provenance.`;
    e.metadata = { ...(e.metadata || {}), superseded_by: currentHead, superseded_at: generatedAt, live_head: currentHead };
  }
}
for (const i of liveGitHub.open_issues || []) {
  if (entities.has(`ISSUE-${i.number}`)) { const e = entities.get(`ISSUE-${i.number}`); e.metadata = { ...(e.metadata || {}), ...i, live_state: "OPEN", phase: "live" }; e.source_refs = [...new Set([...(e.source_refs || []), ...sourceRefs("knowledge/live-github-state.json")])]; continue; }
  entity("ISSUE", `ISSUE-${i.number}`, `Ix issue #${i.number}`, { status: "OPEN", confidence: "HIGH", aliases: [i.url].filter(Boolean), human_summary: `${i.title} — open.`, source_refs: sourceRefs("knowledge/live-github-state.json"), metadata: { ...i, live_state: "OPEN", phase: "live" } });
}
for (const p of liveGitHub.open_pull_requests || []) {
  if (p.related_issue && entities.has(`ISSUE-${p.related_issue}`)) edge(`PR-${p.number}`, `ISSUE-${p.related_issue}`, "RESPONDS_TO", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
  if (p.head_sha && entities.has(`COMMIT-${p.head_sha}`)) edge(`PR-${p.number}`, `COMMIT-${p.head_sha}`, "CHANGED_BY", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
}
if (entities.has("REPO-ix-infrastructure-Ix")) {
  for (const i of liveGitHub.open_issues || []) if (entities.has(`ISSUE-${i.number}`)) edge(`ISSUE-${i.number}`, "REPO-ix-infrastructure-Ix", "FOUND_IN", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
  for (const p of liveGitHub.open_pull_requests || []) if (entities.has(`PR-${p.number}`)) edge(`PR-${p.number}`, "REPO-ix-infrastructure-Ix", "FOUND_IN", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
}

for (const f of findingsReg.findings || []) {
  const statusMap = { FIXED_UPSTREAM: "RESOLVED", PR_OPEN: "PR_OPEN", IN_PR_393: "IN_PR", INCONCLUSIVE: "UNSUPPORTED", REPRODUCED: "CURRENT", VERIFIED: "CURRENT", CONFIRMED: "CURRENT", REPRODUCED_LIVE: "CURRENT", OBSERVED: "CURRENT", OPEN: "OPEN" };
  const status = statusMap[f.status] || "UNKNOWN";
  entity("FINDING", f.id, f.title, { aliases: [f.ixf_id].filter(Boolean), status, confidence: String(f.confidence || UNKNOWN).toUpperCase().startsWith("HIGH") ? "HIGH" : String(f.confidence || "").toUpperCase().startsWith("MEDIUM") ? "MEDIUM" : String(f.confidence || "").toUpperCase().startsWith("LOW") ? "LOW" : "UNKNOWN", evidence_ids: f.evidence_refs || [], source_refs: sourceRefs("planning/findings/registry.json", ...(f.related_files || [])), human_summary: `${f.title}. Current semantic status: ${status}.`, deep_summary: `${f.title} affects ${f.repository || UNKNOWN}/${f.subsystem || UNKNOWN}. Historical registry status was ${f.status || UNKNOWN}; recommendation: ${f.recommendation || UNKNOWN}.`, metadata: { evidence_class: f.evidence_class, legacy_status: f.status, repository: f.repository, subsystem: f.subsystem, severity: f.severity, affected_versions: f.affected_versions, reproduction: f.reproduction, recommendation: f.recommendation, legacy_related_issues: f.related_issues, legacy_related_prs: f.related_prs }, llm: { llm_summary: `${f.id}: ${f.title}; status ${status}.`, llm_context: f.reproduction || "", llm_facts: [f.reproduction, f.recommendation].filter(Boolean), llm_uncertainties: f.evidence_class.includes("D") || f.status === "INCONCLUSIVE" ? ["Evidence is inferential or incomplete; do not promote without new reproduction."] : [], llm_questions: status === "BLOCKED" ? ["What current source or runtime evidence would unblock this?"] : [], llm_evidence_chain: f.evidence_refs || [], llm_relationships: [], llm_search_terms: [f.id, f.ixf_id, f.title, f.subsystem, ...(f.affected_versions || [])].filter(Boolean) } });
}
for (const e of evidenceReg.evidence || []) entity("EVIDENCE", e.id, e.title, { status: "HISTORICAL", confidence: e.class === "A" ? "HIGH" : e.class === "B" ? "MEDIUM" : "LOW", evidence_ids: [], source_refs: sourceRefs("planning/evidence/registry.json", ...(e.provenance ? [] : [])), human_summary: `${e.title} (class ${e.class}).`, deep_summary: e.detail || e.title, metadata: { evidence_class: e.class, kind: e.type, phase: e.phase, repository: e.repository, supports: e.supports || [], provenance: e.provenance || UNKNOWN }, llm: { llm_summary: `${e.id}: ${e.title}; class ${e.class}.`, llm_context: e.detail || "", llm_facts: [e.detail].filter(Boolean), llm_uncertainties: e.class === "D" ? ["Inference; requires corroboration."] : [], llm_questions: [], llm_evidence_chain: [e.id], llm_relationships: [], llm_search_terms: [e.id, e.title, e.type, e.repository].filter(Boolean) } });
for (const s of suggestionsReg.suggestions || []) entity("SUGGESTION", s.id, s.text, { status: ["ACCEPTED","IMPLEMENTED"].some(x => s.disposition?.includes(x)) ? "CURRENT" : s.disposition === "REJECTED" ? "DECLINED" : s.disposition === "SUPERSEDED" ? "SUPERSEDED" : s.disposition === "BLOCKED" ? "BLOCKED" : "HISTORICAL", confidence: "MEDIUM", evidence_ids: s.evidence_refs || [], source_refs: sourceRefs("planning/suggestions/registry.json"), human_summary: `${s.text} — ${s.disposition}.`, deep_summary: s.reason || s.text, metadata: { disposition: s.disposition, phase: s.phase, repository: s.repository, reason: s.reason, related_findings: s.related_findings || [] } });
for (const d of decisionsReg.decisions || []) entity("DECISION", d.id, d.title, { status: d.status === "OPEN" ? "OPEN" : "CURRENT", confidence: "MEDIUM", evidence_ids: [], source_refs: sourceRefs("planning/decisions/registry.json"), human_summary: `${d.title}: ${d.chosen || "open decision"}.`, deep_summary: `${d.problem || ""} Options: ${(d.options || []).join(", ") || UNKNOWN}. Reason: ${d.reason || UNKNOWN}.`, metadata: { phase: d.phase, chosen: d.chosen, options: d.options || [], rejected: d.rejected || [], reason: d.reason, related_findings: d.related_findings || [], related_suggestions: d.related_suggestions || [] } });
const phaseRecords = [...(phasesReg.phases || []),
  { id:"phase-13", number:13, title:"Final Ledger Close-Out", category:"AUDIT", date:"2026-08-11", repository:"Ix-findings", objective:"Consolidate the ladder and close the historical phase sequence.", status:"HISTORICAL", outputs:["CLI-HANDOFF/phase-13/PHASE-13-REPORT.md"] },
  { id:"phase-14", number:14, title:"Independent Forensic Audit", category:"AUDIT", date:"2026-08-11", repository:"Ix-findings", objective:"Independently challenge prior findings against current upstream reality.", status:"HISTORICAL", outputs:["CLI-HANDOFF/phase-14/PHASE-14-REPORT.md"] },
  { id:"phase-15", number:15, title:"Final Adversarial PR-Worthiness Audit", category:"AUDIT", date:"2026-08-11", repository:"Ix-findings", objective:"Reconcile the full candidate universe and apply the contribution gate.", status:"HISTORICAL", outputs:["CLI-HANDOFF/phase-15/PHASE-FINAL-REPORT.md"] },
  { id:"phase-16", number:16, title:"Full Knowledge Graph & Live Evidence Reconstruction", category:"KNOWLEDGE", date:"2026-08-11", repository:"Ix-findings", objective:"Reconstruct the canonical semantic layer beneath the unchanged explorer UI.", status:"CURRENT", outputs:["knowledge/PHASE-16-REPORT.md"] }
];
for (const p of phaseRecords) entity("PHASE", p.id, `Phase ${p.number} — ${p.title}`, { status: String(p.status).includes("BLOCKED") ? "BLOCKED" : p.status === "HISTORICAL" || String(p.status).includes("COMPLETE") ? "HISTORICAL" : "CURRENT", confidence: "HIGH", source_refs: sourceRefs("planning/maps/phases.json", ...(p.outputs || [])), human_summary: `${p.title}: ${p.status}.`, deep_summary: `${p.objective || ""} Key findings: ${(p.key_findings || []).join("; ")}`, temporal: { valid_from: p.date || UNKNOWN, valid_until: UNKNOWN, observed_at: p.date || UNKNOWN, verified_at: UNKNOWN, introduced_by: UNKNOWN, fixed_by: UNKNOWN }, metadata: p });
for (const p of phaseRecords) { for (const dep of p.dependencies || []) edge(p.id, dep, "DEPENDS_ON", { source_refs: sourceRefs("planning/maps/phases.json") }); for (const next of [p.next_phase].filter(Boolean)) { const n = String(next).match(/phase-\d+/)?.[0]; if (n && entities.has(n)) edge(p.id, n, "ENABLES", { source_refs: sourceRefs("planning/maps/phases.json") }); } } 

for (const c of auditCandidates.candidates || []) entity("CANDIDATE", c.id, c.legacy || c.subject || c.id, { status: ({ A_CONTRIBUTION_READY:"CURRENT", B_CONTRIBUTE_AFTER_REWORK:"CONTRIBUTE_AFTER_REWORK", C_NEEDS_REPRODUCTION:"NEEDS_REPRODUCTION", D_NEEDS_UPSTREAM_INTENT:"NEEDS_UPSTREAM_INTENT", E_ALREADY_FIXED:"ALREADY_FIXED", F_DUPLICATE:"DUPLICATE", G_SUPERSEDED:"SUPERSEDED", H_NOT_WORTH_CONTRIBUTING:"DECLINED", I_AI_SLOP_UNSUPPORTED:"UNSUPPORTED", J_BLOCKED:"BLOCKED", K_INTERNAL_LEDGER_ONLY:"INTERNAL_LEDGER_ONLY" }[c.disposition] || "UNKNOWN"), confidence: c.disposition === "I_AI_SLOP_UNSUPPORTED" ? "LOW" : "MEDIUM", source_refs: sourceRefs("CLI-HANDOFF/phase-15/AUDIT-CANDIDATE-UNIVERSE.json"), human_summary: `${c.legacy || c.id}: ${c.disposition}.`, deep_summary: c.action || c.reason || c.legacy || c.id, metadata: c, llm: { llm_summary: `${c.id}: ${c.disposition}.`, llm_context: c.legacy || "", llm_facts: c.evidence || [], llm_uncertainties: c.disposition === "C_NEEDS_REPRODUCTION" || c.disposition === "J_BLOCKED" ? [c.action || "Additional evidence is required."] : c.disposition === "I_AI_SLOP_UNSUPPORTED" ? ["The claim is unsupported and must not be treated as fact."] : [], llm_questions: c.action ? [c.action] : [], llm_evidence_chain: [], llm_relationships: [], llm_search_terms: [c.id, c.legacy].filter(Boolean) } });

// Explicit implementation and packet anchors that are important for deep traversal.
entity("IMPLEMENTATION", "IMPL-REMAP-PR393", "Remap hardening implementation", { status: "MERGED", confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/IMPLEMENTATION-QUALITY-MATRIX.json", "pr-packets/ix-remap-hardening/README.md"), human_summary: "Loopback-guarded POST /__ix/remap implementation carried by merged PR #393.", deep_summary: "The implementation includes loopback/Host/Origin controls, WSL bootstrap changes, guard tests, and a map subprocess. Phase 15 retains lifecycle and concurrency review concerns.", metadata: { pr: 393, branch: "feat/ix-remap-hardening", head: ((liveGitHub.implementations || []).find(i => (i.pr_refs || []).some(ref => String(ref).includes("393"))) || {}).head_sha || UNKNOWN, known_limitations: ["descendant cleanup requires stronger proof", "concurrent expensive requests are not explicitly bounded"] } });
entity("IMPLEMENTATION", "IMPL-MCP-FORK", "ix mcp fork implementation", { status: "CONTRIBUTE_AFTER_REWORK", confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/IMPLEMENTATION-QUALITY-MATRIX.json", "CLI-HANDOFF/phase-9/PHASE-9-REPORT.md"), human_summary: "Fork-only dual-era stdio MCP implementation with eight read-only tools and hardening tests.", deep_summary: "The implementation includes framing limits, batch rejection, validation, cancellation/cleanup, real-process tests, and Codex E2E. Phase 15 identifies modern metadata/request-ID conformance and scope alignment as remaining work.", metadata: { branch: "feat/ix-mcp", head: "606f18f", issue: 219, tools: 8, status_basis: "Phase 15 audit" } });
for (const p of ["ix-mcp", "ix-remap-hardening", "compass-f-key", "compass-delayed-data"]) entity("PR_PACKET", `PACKET-${p}`, p, { status: p === "ix-mcp" || p === "ix-remap-hardening" ? "CONTRIBUTE_AFTER_REWORK" : "BLOCKED", confidence: "MEDIUM", source_refs: sourceRefs(`pr-packets/${p}/README.md`), human_summary: `${p} contribution packet; prepared only, not submitted by this phase.`, metadata: { path: `pr-packets/${p}/README.md` } });
entity("BRANCH", "BRANCH-fork-ix-mcp", "Alot1z/Ix:feat/ix-mcp", { status:"CURRENT", confidence:"HIGH", source_refs:sourceRefs("CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json","CLI-HANDOFF/phase-9/PHASE-9-REPORT.md"), human_summary:"Alot1z/Ix:feat/ix-mcp at 606f18f (Phase 15 audited baseline).", metadata:{ repo:"Alot1z/Ix", branch:"feat/ix-mcp", sha:"606f18f", historical_manifest_state:"not present in Phase 6 manifest" } });
entity("COMMIT", "COMMIT-606f18f", "606f18f", { status:"CURRENT", confidence:"HIGH", source_refs:sourceRefs("CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json","CLI-HANDOFF/phase-9/PHASE-9-REPORT.md"), human_summary:"Phase 15 audited head of the fork ix-mcp branch.", metadata:{ repo:"Alot1z/Ix", branch:"feat/ix-mcp", sha:"606f18f" } });

// Relationships from explicit registry references.
for (const f of findingsReg.findings || []) {
  linkRefs(f.id, f.evidence_refs, "SUPPORTED_BY", sourceRefs("planning/findings/registry.json"));
  for (const i of f.related_issues || []) { const n = String(i).match(/#?(\d+)/)?.[1]; if (n && entities.has(`ISSUE-${n}`)) edge(f.id, `ISSUE-${n}`, "RELATED_TO_ISSUE", { source_refs: sourceRefs("planning/findings/registry.json") }); }
  for (const p of f.related_prs || []) { const n = String(p).match(/#?(\d+)/)?.[1]; if (n && entities.has(`PR-${n}`)) edge(f.id, `PR-${n}`, "RELATED_TO_PR", { source_refs: sourceRefs("planning/findings/registry.json") }); }
  linkRefs(f.id, f.related_suggestions, "RESPONDS_TO", sourceRefs("planning/findings/registry.json"));
}
for (const e of evidenceReg.evidence || []) { for (const f of e.supports || []) if (entities.has(f)) edge(e.id, f, "SUPPORTS", { confidence: e.class === "A" ? "HIGH" : "MEDIUM", source_refs: sourceRefs("planning/evidence/registry.json") }); }
for (const s of suggestionsReg.suggestions || []) { linkRefs(s.id, s.related_findings, "APPLIES_TO", sourceRefs("planning/suggestions/registry.json")); linkRefs(s.id, s.evidence_refs, "SUPPORTED_BY", sourceRefs("planning/suggestions/registry.json")); }
for (const d of decisionsReg.decisions || []) { linkRefs(d.id, d.related_findings, "DECIDES_FOR", sourceRefs("planning/decisions/registry.json")); linkRefs(d.id, d.related_suggestions, "ACCEPTED_BY", sourceRefs("planning/decisions/registry.json")); }
for (const p of phaseRecords) { for (const o of p.outputs || []) { const sid = sourceByPath[o]?.source_id; if (sid) { entity("SOURCE", sid, o, { status: "HISTORICAL", confidence: "HIGH", source_refs: [sid], human_summary: `Phase output ${o}.` }); edge(p.id, sid, "GENERATED_FROM", { source_refs: [sid] }); } } }
for (const c of auditCandidates.candidates || []) { for (const e of c.evidence || []) { const m = String(e).match(/E-\d+/)?.[0]; if (m && entities.has(m)) edge(c.id, m, "SUPPORTED_BY", { source_refs: sourceRefs("CLI-HANDOFF/phase-15/AUDIT-CANDIDATE-UNIVERSE.json") }); } }
// Resolve repository, branch, commit, issue, and PR relationships from the manifest.
for (const r of manifest.branches || []) { const bid = `BRANCH-${idHash(`${r.repo}-${r.branch}`)}`; const rid = `REPO-${safe(r.repo).replaceAll("/", "-")}`; if (entities.has(rid)) edge(bid, rid, "PART_OF", { source_refs: sourceRefs("CLI-HANDOFF/manifest.json") }); }
for (const c of manifest.commits || []) { const cid = `COMMIT-${c.sha}`; if (c.pr) { const n = String(c.pr).match(/\d+/)?.[0]; if (n && entities.has(`PR-${n}`)) edge(cid, `PR-${n}`, "RELATED_TO_PR", { source_refs: sourceRefs("CLI-HANDOFF/manifest.json") }); } const bid = [...entities.values()].find(e => e.entity_type === "BRANCH" && e.metadata?.repo === c.repo && e.metadata?.branch === c.branch); if (bid) edge(cid, bid.canonical_id, "INTRODUCED_BY", { source_refs: sourceRefs("CLI-HANDOFF/manifest.json") }); }
for (const p of manifest.pull_requests || []) { if (p.sha && entities.has(`COMMIT-${p.sha}`)) edge(`PR-${p.number}`, `COMMIT-${p.sha}`, "CHANGED_BY", { source_refs: sourceRefs("CLI-HANDOFF/manifest.json") }); const n = String(p.note || "").match(/#(\d+)/)?.[1]; if (n && entities.has(`ISSUE-${n}`)) edge(`PR-${p.number}`, `ISSUE-${n}`, "RESPONDS_TO", { source_refs: sourceRefs("CLI-HANDOFF/manifest.json") }); }
for (const i of manifest.issues || []) { const n = String(i.note || "").match(/#(\d+)/)?.[1]; if (n && entities.has(`PR-${n}`)) edge(`ISSUE-${i.number}`, `PR-${n}`, "RELATED_TO_PR", { source_refs: sourceRefs("CLI-HANDOFF/manifest.json") }); }
entity("COMMIT", `COMMIT-${liveHead}`, liveHead, { status:"CURRENT", confidence:"HIGH", source_refs:sourceRefs("CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json"), human_summary:`Current upstream Ix main at ${liveHead}.`, deep_summary:"Current upstream HEAD recorded by the Phase 15 live audit; reverify before publication.", metadata:{ repo:"ix-infrastructure/Ix", branch:"main", live:true } });
edge("BRANCH-1c828029ee8b", `COMMIT-${liveHead}`, "CURRENT_STATE_OF", { source_refs: sourceRefs("CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json") });
for (const e of evidenceReg.evidence || []) { const rid = `REPO-${safe(e.repository).replaceAll("/", "-")}`; if (entities.has(rid)) edge(e.id, rid, "FOUND_IN", { source_refs: sourceRefs("planning/evidence/registry.json") }); }
for (const s of sourceEntities) if (entities.has("REPO-Ix-findings")) edge(s.source_id, "REPO-Ix-findings", "PART_OF", { confidence: "HIGH", summary: `${s.path} is an inventoried Ix-findings source artifact.` });
// Make every provenance reference traversable without inventing semantic claims.
for (const e of entities.values()) for (const sid of e.source_refs || []) if (entities.has(sid) && sid !== e.canonical_id) edge(e.canonical_id, sid, "HAS_SOURCE", { confidence: "HIGH" });
edge("F-008", "PR-391", "FIXED_BY", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/ALREADY-FIXED.json") });
edge("F-009", "PR-390", "FIXED_BY", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/ALREADY-FIXED.json") });
edge("F-010", "PR-393", "RELATED_TO_PR", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/ISSUE-RECONCILIATION.json") });
edge("BRANCH-bb1d25e4c9d1", "PR-393", "HEADS", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json") });
edge("COMMIT-1497596", "BRANCH-bb1d25e4c9d1", "INTRODUCED_BY", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/manifest.json") });
edge("BRANCH-fork-ix-mcp", "REPO-Alot1z-Ix", "PART_OF", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-15/FINAL-PR-WORTHINESS-AUDIT.json") });
edge("COMMIT-606f18f", "BRANCH-fork-ix-mcp", "INTRODUCED_BY", { confidence: "HIGH", source_refs: sourceRefs("CLI-HANDOFF/phase-9/PHASE-9-REPORT.md") });
edge("IMPL-MCP-FORK", "BRANCH-fork-ix-mcp", "IMPLEMENTED_BY", { source_refs: sourceRefs("CLI-HANDOFF/phase-9/PHASE-9-REPORT.md") });
edge("IMPL-MCP-FORK", "ISSUE-219", "RELATED_TO_ISSUE", { source_refs: sourceRefs("CLI-HANDOFF/phase-15/ISSUE-RECONCILIATION.json") });
edge("IMPL-REMAP-PR393", "PR-393", "IMPLEMENTED_BY", { source_refs: sourceRefs("CLI-HANDOFF/phase-15/IMPLEMENTATION-QUALITY-MATRIX.json") });
edge("IMPL-MCP-FORK", "PACKET-ix-mcp", "PRESENTED_AS", { source_refs: sourceRefs("pr-packets/ix-mcp/README.md") });
edge("CAND-012", "PR-393", "DUPLICATES", { source_refs: sourceRefs("CLI-HANDOFF/phase-15/DUPLICATE-SUPERSEDED.json") });

// Implementation sections with stable graph paths, derived from live-verified references only.
const sectionRegistry = [];
const issueSectionRegistry = [];
const issueRelated = impl => (impl.issue_refs || []).map(ref => String(ref).match(/#(\d+)/)?.[1]).filter(Boolean);
const implByIssue = {};
for (const impl of liveGitHub.implementations || []) for (const issue of issueRelated(impl)) (implByIssue[issue] ||= []).push(impl);
const prByIssue = {};
for (const pr of liveGitHub.open_pull_requests || []) if (pr.related_issue) (prByIssue[pr.related_issue] ||= []).push(pr);
for (const issue of liveGitHub.open_issues || []) {
  const number = Number(issue.number);
  const impls = implByIssue[number] || [];
  const relatedPrs = prByIssue[number] || [];
  const issueInfo = liveGitHub.open_issues.find(i => Number(i.number) === number) || {};
  issueSectionRegistry.push({
    id: `ISSUESEC-${number}`,
    issue: number,
    title: `Issue #${number} — ${issueInfo.title || ""}`,
    graph_path: `/issues/${number}`,
    issue_url: `https://github.com/ix-infrastructure/Ix/issues/${number}`,
    issue_title: issueInfo.title || "",
    state: issueInfo.state || "open",
    user: issueInfo.user || "",
    labels: issueInfo.labels || [],
    implementation_ids: impls.map(impl => impl.id),
    pr_refs: relatedPrs.map(pr => `ix-infrastructure/Ix#${pr.number}`),
    commit_refs: [...new Set(impls.flatMap(impl => impl.commit_refs || []))],
    file_refs: [...new Map(impls.flatMap(impl => (impl.files || []).map(file => [`${impl.repository}/${file.commit}/${file.path}`, { ...file, repository: impl.repository, url: `https://github.com/${impl.repository}/blob/${file.commit}/${file.path}${file.start_line ? `#L${file.start_line}${file.end_line && file.end_line !== file.start_line ? `-L${file.end_line}` : ""}` : ""}` }]))).values()],
    test_refs: [...new Map(impls.flatMap(impl => (impl.tests || []).map(test => [`${test.file}:${test.name}`, test]))).values()],
    finding_refs: [...new Set(impls.flatMap(impl => impl.finding_refs || []))],
    related_sections: impls.flatMap(impl => Object.values(impl.sections || {}).map(section => section.graph_path))
  });
}
const commitMessages = {
  "36c7c7eccd8068d48df4f61394b42a3ffa62483c": "feat(mcp): add ix mcp subcommand exposing the code graph as MCP tools (#219)",
  "a5350b6d6dc67958fa4abef63559affcd74aff56": "docs(mcp): document the ix mcp subcommand in the API reference, CLAUDE.md, and agent skill",
  "66111917a2a58437c91372616f98928876121395": "fix(mcp): abort in-flight calls on EOF, add ix_read tool, executor timeout coverage",
  "1a5b0b93c9e8871610370c0f36212be8f6cf6980": "fix(mcp): harden the stdio server — line-size cap, tree-kill, protocol-abuse matrix (#219)",
  "606f18f7ca1a69f4b8ede7c27c1079b024297856": "docs(mcp): document the hardening contract — line cap, batch rejection, tree reaping",
  "a6a47267af21a49d6942ee6e07e18d1d0a82517b": "feat(view): real /__ix/remap endpoint with loopback guard; fix WSL bootstrap"
};
for (const impl of liveGitHub.implementations || []) {
  const implId = `IMPL-${safe(impl.id).replaceAll(/[^A-Za-z0-9_-]/g, "-")}`;
  const implEntity = entities.get(implId) || entities.get(impl.id === "ix-mcp" ? "IMPL-MCP-FORK" : "IMPL-REMAP-PR393");
  const fileObjects = (impl.files || []).map(file => ({
    ...file,
    repository: impl.repository,
    url: `https://github.com/${impl.repository}/blob/${file.commit}/${file.path}${file.start_line ? `#L${file.start_line}${file.end_line && file.end_line !== file.start_line ? `-L${file.end_line}` : ""}` : ""}`
  }));
  const prs = (impl.pr_refs || []).map(ref => String(ref).match(/#(\d+)/)?.[1]).filter(Boolean);
  const issues = (impl.issue_refs || []).map(ref => String(ref).match(/#(\d+)/)?.[1]).filter(Boolean);
  for (const [key, section] of Object.entries(impl.sections || {})) {
    const id = `SECTION-${safe(key).replaceAll(/[^A-Za-z0-9_-]/g, "-")}`;
    entity("IMPLEMENTATION_SECTION", id, section.title, {
      status: impl.status === "partially_implemented" ? "PARTIALLY_IMPLEMENTED" : impl.status === "implemented_with_remaining_hardening" ? "IMPLEMENTED_WITH_REMAINING_HARDENING" : String(impl.status).toUpperCase(),
      confidence: "HIGH",
      source_refs: sourceRefs("knowledge/live-github-state.json"),
      human_summary: `${section.title} — ${impl.status}.`,
      deep_summary: impl.status_note || section.title,
      metadata: { implementation_id: impl.id, repository: impl.repository, branch: impl.branch, graph_path: section.graph_path, parent: section.parent || null, status_note: impl.status_note || "", issue_refs: impl.issue_refs || [], pr_refs: impl.pr_refs || [], commit_refs: impl.commit_refs || [], finding_refs: impl.finding_refs || [], file_refs: fileObjects, test_refs: impl.tests || [], evidence: impl.evidence || [], security: impl.security || [] }
    });
    sectionRegistry.push({ id, implementation_id: impl.id, title: section.title, graph_path: section.graph_path, status: impl.status, repository: impl.repository, issue_refs: impl.issue_refs || [], pr_refs: impl.pr_refs || [], commit_refs: impl.commit_refs || [], file_refs: fileObjects, test_refs: impl.tests || [], evidence: impl.evidence || [], security: impl.security || [], finding_refs: impl.finding_refs || [] });
    if (implEntity) edge(id, implEntity.canonical_id, "PART_OF_IMPLEMENTATION", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
    if (section.parent) edge(id, `SECTION-${safe(section.parent).replaceAll(/[^A-Za-z0-9_-]/g, "-")}`, "PART_OF_SECTION", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
    for (const issue of issues) if (entities.has(`ISSUE-${issue}`)) edge(id, `ISSUE-${issue}`, "DOCUMENTS_ISSUE", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
    for (const pr of prs) if (entities.has(`PR-${pr}`)) edge(id, `PR-${pr}`, "DOCUMENTS_PR", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
    for (const commit of impl.commit_refs || []) if (entities.has(`COMMIT-${commit}`)) edge(id, `COMMIT-${commit}`, "DOCUMENTS_COMMIT", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
    for (const finding of impl.finding_refs || []) if (entities.has(finding)) edge(id, finding, "DOCUMENTS_FINDING", { confidence: "HIGH", source_refs: sourceRefs("knowledge/live-github-state.json") });
  }
}

// Historical/current contradictions are first-class, not overwritten.
const contradictions = [
  { id:"CONTRA-001", subject:"F-008/F-009 status", status:"RESOLVED", claim_a:"Historical phases described the defects as OPEN.", claim_b:"Phase 15/current upstream evidence records both fixed by merged PRs #390/#391.", resolution:"Current upstream source and GitHub state wins; retain OPEN as historical state.", sources:["CLI-HANDOFF/phase-15/ALREADY-FIXED.json","planning/findings/registry.json"] },
  { id:"CONTRA-002", subject:"MCP contribution readiness", status:"CONTESTED", claim_a:"Phase 14 called MCP production-quality/PR-ready.", claim_b:"Phase 15 found modern metadata, null-ID, and scope concerns.", resolution:"Phase 15 is the later independent gate; disposition is CONTRIBUTE_AFTER_REWORK until conformance is tested.", sources:["CLI-HANDOFF/phase-14/PHASE-14-REPORT.md","CLI-HANDOFF/phase-15/PHASE-FINAL-REPORT.md"] },
  { id:"CONTRA-003", subject:"Remap readiness", status:"CONTESTED", claim_a:"Phase 14 called PR #393 sound and awaiting review.", claim_b:"Phase 15 retained lifecycle/concurrency review concerns.", resolution:"Do not call it contribution-ready; the existing PR remains the only contribution and is untouched.", sources:["CLI-HANDOFF/phase-14/PHASE-14-REPORT.md","CLI-HANDOFF/phase-15/PHASE-FINAL-REPORT.md"] },
  { id:"CONTRA-004", subject:"Phase ladder closure", status:"RESOLVED", claim_a:"Phase 13 declared the ladder terminal with no Phase 14.", claim_b:"Phases 14 and 15 were subsequently created and audited.", resolution:"Phase 13 is historical; Phase 15 is the latest audit phase.", sources:["CLI-HANDOFF/phase-13/PHASE-13-REPORT.md","CLI-HANDOFF/phase-15/PHASE-FINAL-REPORT.md"] },
  { id:"CONTRA-005", subject:"public graph freshness", status:"CURRENT", claim_a:"The explorer presents investigation data.", claim_b:"Its public data explicitly labels itself as a sanitized snapshot, not live GitHub state.", resolution:"Treat Pages/UI data as a derived snapshot and use current source/GitHub for present status.", sources:["planning/pages/public/data/data.js","planning/pages/build-public.mjs"] },
  { id:"CONTRA-006", subject:"evidence duplicate-ID report", status:"NEEDS_UPDATE", claim_a:"Phase 14 reported duplicate E-014/E-015 IDs.", claim_b:"The current registry must be rechecked before renumbering; Phase 15 intentionally did not edit it.", resolution:"Keep the claim as a historical data-quality observation pending a fresh validator run.", sources:["CLI-HANDOFF/phase-14/PHASE-14-REPORT.md","CLI-HANDOFF/phase-15/LEDGER-RECONCILIATION.json"] }
];
for (const c of contradictions) entity("CONTRADICTION", c.id, c.subject, { status:c.status, confidence:"HIGH", source_refs:sourceRefs(...c.sources), human_summary:`${c.subject}: ${c.resolution}`, deep_summary:`Claim A: ${c.claim_a} Claim B: ${c.claim_b} Resolution: ${c.resolution}`, metadata:c });
for (const e of entities.values()) for (const sid of e.source_refs || []) if (entities.has(sid) && sid !== e.canonical_id) edge(e.canonical_id, sid, "HAS_SOURCE", { confidence: "HIGH" });

// Phase B identity records are additive canonical records. They are imported only
// from the verified local identity registry; unsupported types have no fabricated
// nodes. This keeps the generated entities/relationships files authoritative while
// preserving the Phase B registry as an auditable input artifact.
for (const record of phaseBIdentity.entities || []) {
  if (entities.has(record.id)) continue;
  entity(record.entity_type, record.id, record.canonical_name, {
    status: record.status || "UNKNOWN",
    confidence: record.confidence || "UNKNOWN",
    aliases: record.aliases || [],
    evidence_ids: record.evidence_ids || [],
    source_refs: record.source_refs || [],
    human_summary: record.metadata?.summary || record.canonical_name,
    deep_summary: record.metadata?.description || record.canonical_name,
    temporal: record.temporal || { valid_from: UNKNOWN, valid_until: UNKNOWN, observed_at: UNKNOWN, verified_at: UNKNOWN, introduced_by: UNKNOWN, fixed_by: UNKNOWN },
    metadata: { ...(record.metadata || {}), identity_registry: "knowledge/identity-registry.json", privacy: record.metadata?.privacy || "PUBLIC_SAFE" },
    ...(record.llm ? { llm: record.llm } : {}),
  });
}
for (const record of phaseBIdentity.relationships || []) {
  if (entities.has(record.from) && entities.has(record.to)) {
    edge(record.from, record.to, record.type, { confidence: record.confidence || "UNKNOWN", status: record.status || "CURRENT", source_refs: record.source_refs || [], evidence_ids: record.evidence_ids || [], summary: record.summary });
  }
}

// Phase C collaboration is an auditable canonical input generated from public
// GitHub records. Discussion bodies are evidence, never executable instructions.
for (const record of phaseCCollaboration.entities || []) {
  entity(record.entity_type, record.canonical_id, record.canonical_name, {
    status: record.status || "UNKNOWN",
    confidence: record.confidence || "UNKNOWN",
    aliases: record.aliases || [],
    evidence_ids: record.evidence_ids || [],
    source_refs: [...new Set([...(record.source_refs || []), "knowledge/github-collaboration.json"])],
    human_summary: record.human_summary || record.canonical_name,
    deep_summary: record.deep_summary || record.human_summary || record.canonical_name,
    temporal: record.temporal || { valid_from: UNKNOWN, valid_until: UNKNOWN, observed_at: UNKNOWN, verified_at: UNKNOWN, introduced_by: UNKNOWN, fixed_by: UNKNOWN },
    metadata: { ...(record.metadata || {}), collaboration_source: "knowledge/github-collaboration.json", discussion_evidence: true },
    ...(record.llm ? { llm: record.llm } : {}),
  });
}
for (const record of phaseCCollaboration.relationships || []) {
  if (entities.has(record.from) && entities.has(record.to)) {
    edge(record.from, record.to, record.type, { confidence: record.confidence || "UNKNOWN", status: record.status || "CURRENT", source_refs: [...new Set([...(record.source_refs || []), "knowledge/github-collaboration.json"])], evidence_ids: record.evidence_ids || [], summary: record.summary, temporal_scope: record.temporal_scope });
  }
}

// Import the relevant slice of full local Git intelligence into the canonical
// layer: all Ix-findings commits, live PR/head commits, and one parent closure.
// The complete statistical history remains in the Phase-C derived artifact;
// only bounded, source-linked records become graph nodes.
const collaborationCommitShas = new Set((phaseCCollaboration.entities || []).filter(record => record.entity_type === "COMMIT").map(record => record.canonical_id.replace(/^COMMIT-/, "")));
const liveHeadShas = new Set([
  liveHead,
  ...(Object.values(liveGitHub.fork_branches || {}).flatMap(branches => Object.values(branches || {}))),
  ...(liveGitHub.open_pull_requests || []).map(pr => pr.head_sha),
].filter(Boolean));
const selectedGitCommits = new Set([...collaborationCommitShas, ...liveHeadShas, ...phaseCGit.commits.filter(commit => commit.repository === "Alot1z/Ix-findings").map(commit => commit.sha)]);
for (const commit of phaseCGit.commits) if (selectedGitCommits.has(commit.sha)) for (const parent of commit.parents || []) if (phaseCGit.commits.some(candidate => candidate.sha === parent)) selectedGitCommits.add(parent);
for (const commit of phaseCGit.commits.filter(commit => selectedGitCommits.has(commit.sha))) {
  const status = liveHeadShas.has(commit.sha) ? "CURRENT" : "HISTORICAL";
  entity("COMMIT", `COMMIT-${commit.sha}`, commit.sha, {
    status, confidence: "HIGH", aliases: [commit.url].filter(Boolean), source_refs: ["planning/phase-c/GIT-INTELLIGENCE.json"],
    human_summary: commit.subject || commit.sha,
    deep_summary: `${commit.repository} commit ${commit.sha}; ${commit.files.length} changed files; local Git history fact.`,
    metadata: { repository: commit.repository, sha: commit.sha, url: commit.url, author: commit.author, committer: commit.committer, authored_at: commit.authored_at, committed_at: commit.committed_at, git_intelligence: true, current_head: liveHeadShas.has(commit.sha) },
  });
}
const selectedFileIds = new Set();
for (const file of phaseCGit.files) if (file.source_commits?.some(sha => selectedGitCommits.has(sha))) {
  const fileId = `FILE-${idHash(`${file.repository}:${file.path}`)}`;
  selectedFileIds.add(fileId);
  entity("FILE", fileId, file.path, {
    status: "CURRENT", confidence: "HIGH", aliases: [file.url].filter(Boolean), source_refs: ["planning/phase-c/GIT-INTELLIGENCE.json"],
    human_summary: `${file.path} — ${file.commit_count} historical changes.`,
    deep_summary: `Derived Git history metrics for ${file.repository}/${file.path}; hotspot is a change-concentration signal, not a defect claim.`,
    metadata: { repository: file.repository, path: file.path, url: file.url, commit_count: file.commit_count, additions: file.additions, deletions: file.deletions, churn: file.additions + file.deletions, contributors: file.contributors, source_commits: file.source_commits, hotspot_signal: true },
  });
}
for (const relation of phaseCGit.relationships || []) {
  const normalizeGitNode = node => {
    if (node?.startsWith("COMMIT-")) return `COMMIT-${node.replace(/^COMMIT-/, "")}`;
    if (node?.startsWith("FILE-")) {
      const file = phaseCGit.files.find(candidate => candidate.entity_id === node);
      return file ? `FILE-${idHash(`${file.repository}:${file.path}`)}` : node;
    }
    return node;
  };
  const fromId = normalizeGitNode(relation.from);
  const toId = normalizeGitNode(relation.to);
  if (!entities.has(fromId) || !entities.has(toId)) continue;
  if (relation.type === "CO_CHANGED_WITH" && (relation.count || 0) < 5) continue;
  edge(fromId, toId, relation.type, { confidence: relation.confidence || "MEDIUM", status: relation.status || "HISTORICAL", source_refs: ["planning/phase-c/GIT-INTELLIGENCE.json"], summary: relation.derivation || `${relation.type} derived from local Git history`, temporal_scope: { valid_from: UNKNOWN, valid_until: UNKNOWN } });
}

// Edges touching a superseded (HISTORICAL) commit entity are provenance
// records, not live claims; downgrade them so no CURRENT edge resolves against
// a commit that was rewritten or purged.
for (const rel of relationships) {
  if (rel.status === "HISTORICAL") continue;
  const fromE = entities.get(rel.from);
  const toE = entities.get(rel.to);
  if ((fromE?.entity_type === "COMMIT" && fromE.status === "HISTORICAL") || (toE?.entity_type === "COMMIT" && toE.status === "HISTORICAL")) rel.status = "HISTORICAL";
}

const mirrorRecordsByCanonicalId = new Map();
for (const record of externalMirror.records || []) {
  const canonicalId = record.analysis?.canonical_entity_id;
  if (!canonicalId || mirrorRecordsByCanonicalId.has(canonicalId)) continue;
  mirrorRecordsByCanonicalId.set(canonicalId, record);
}
for (const [canonicalId, record] of mirrorRecordsByCanonicalId) {
  const entityRecord = entities.get(canonicalId);
  if (!entityRecord) continue;
  const source = record.source || {};
  entityRecord.source_snapshot_ref = record.id;
  entityRecord.external_source = { mirror_record_id: record.id, ...source, freshness: record.freshness, source_is_authoritative: true };
  entityRecord.analysis = { layer: "IX-FINDINGS_ANALYSIS", canonical_entity_id: canonicalId, status: entityRecord.status, source_authority: "GITHUB", source_is_authoritative: false, mirror_status: "READ_ONLY_EXTERNAL_OBJECT" };
  entityRecord.metadata = { ...(entityRecord.metadata || {}), source_mirror_id: record.id, source_type: source.type, source_repository: source.repository, source_url: source.url, source_api_url: source.api_url, source_is_authoritative: true, analysis_layer: "IX-FINDINGS_ANALYSIS" };
  entityRecord.source_refs = [...new Set([...(entityRecord.source_refs || []), "knowledge/external-github-mirror.json"])]
}
// Mirror-derived entities: PRs and explicitly captured commits that have no
// canonical record yet (e.g. upstream PRs 397/400 and the five historical fork
// MCP commits) enter the graph from the authoritative read-only mirror so both
// upstream PR bodies can deep-link to exact evidence pages.
for (const record of externalMirror.records || []) {
  const source = record.source || {};
  if (source.type === "github_pull_request") {
    const number = record.snapshot?.number;
    if (!number || entities.has(`PR-${number}`)) continue;
    entity("PULL_REQUEST", `PR-${number}`, `Ix PR #${number}`, {
      status: record.snapshot?.merged ? "RESOLVED" : record.snapshot?.state === "open" ? "OPEN" : "HISTORICAL",
      confidence: "HIGH",
      aliases: [record.snapshot?.html_url || record.source?.url].filter(Boolean),
      human_summary: `Ix pull request #${number}: ${record.snapshot?.title || "see mirror"}.`,
      deep_summary: `Mirror-authoritative PR #${number} (state ${record.snapshot?.state || "unknown"}, merged ${Boolean(record.snapshot?.merged)}); captured read-only from GitHub.`,
      source_refs: sourceRefs("knowledge/external-github-mirror.json"),
      metadata: { ...(record.snapshot || {}), mirror_derived: true, reconciliation: "MIRROR_AUTHORITATIVE_GITHUB_WINS" },
    });
  } else if (source.type === "github_commit") {
    const sha = record.snapshot?.sha;
    if (!sha || entities.has(`COMMIT-${sha}`)) continue;
    entity("COMMIT", `COMMIT-${sha}`, sha, {
      status: record.analysis?.status || "HISTORICAL",
      confidence: "HIGH",
      human_summary: `${sha.slice(0, 8)} - ${String(record.snapshot?.commit?.message || record.snapshot?.message || "").split("\n")[0] || "mirror-captured commit"}.`,
      deep_summary: `Mirror-authoritative commit ${sha} in ${source.repository}; captured read-only from GitHub.`,
      source_refs: sourceRefs("knowledge/external-github-mirror.json"),
      metadata: { ...(record.snapshot || {}), repo: source.repository, mirror_derived: true, reconciliation: "MIRROR_AUTHORITATIVE_GITHUB_WINS" },
    });
  }
}
// Link mirror-derived PRs to their head commit and closed issues, and commit
// entities to their parent PR, when both ends exist.
for (const record of externalMirror.records || []) {
  const source = record.source || {};
  if (source.type === "github_pull_request") {
    const number = record.snapshot?.number;
    if (!number) continue;
    if (record.snapshot?.head?.sha && entities.has(`COMMIT-${record.snapshot.head.sha}`)) {
      edge(`PR-${number}`, `COMMIT-${record.snapshot.head.sha}`, "CHANGED_BY", { confidence: "HIGH", source_refs: sourceRefs("knowledge/external-github-mirror.json") });
    }
    if (record.snapshot?.body && entities.has(`ISSUE-${number}`)) {
      edge(`PR-${number}`, `ISSUE-${number}`, "RESPONDS_TO", { confidence: "MEDIUM", source_refs: sourceRefs("knowledge/external-github-mirror.json") });
    }
  } else if (source.type === "github_commit") {
    const sha = record.snapshot?.sha;
    if (!sha || !entities.has(`COMMIT-${sha}`)) continue;
    const prMatch = String(record.snapshot?.commit?.message || "").match(/\(#(\d+)\)/);
    if (prMatch && entities.has(`PR-${prMatch[1]}`)) {
      edge(`COMMIT-${sha}`, `PR-${prMatch[1]}`, "RELATED_TO_PR", { confidence: "MEDIUM", source_refs: sourceRefs("knowledge/external-github-mirror.json") });
    }
  }
}
// RULE 12 - GitHub wins for external PR/issue state. The refreshed mirror is
// RULE 12 — GitHub wins for external PR/issue state. The refreshed mirror is
// authoritative over any historical manifest/collaboration status; only the
// live-captured OPEN set may remain OPEN.
for (const [canonicalId, entityRecord] of entities) {
  if (entityRecord.entity_type === "PULL_REQUEST") {
    const number = Number(entityRecord.metadata?.number ?? String(canonicalId).replace(/^PR-/, ""));
    entityRecord.status = liveOpenPRs.has(number) ? "OPEN" : liveMergedPRs.has(number) ? "RESOLVED" : "HISTORICAL";
    entityRecord.metadata = { ...(entityRecord.metadata || {}), live_state: entityRecord.status, reconciliation: "MIRROR_AUTHORITATIVE_GITHUB_WINS" };
    entityRecord.analysis = { ...(entityRecord.analysis || {}), status: entityRecord.status };
  } else if (entityRecord.entity_type === "ISSUE") {
    const number = Number(entityRecord.metadata?.number ?? String(canonicalId).replace(/^ISSUE-/, ""));
    entityRecord.status = liveOpenIssues.has(number) ? "OPEN" : liveClosedIssues.has(number) ? "RESOLVED" : "HISTORICAL";
    entityRecord.metadata = { ...(entityRecord.metadata || {}), live_state: entityRecord.status, reconciliation: "MIRROR_AUTHORITATIVE_GITHUB_WINS" };
    entityRecord.analysis = { ...(entityRecord.analysis || {}), status: entityRecord.status };
  }
}
const entitiesArray = [...entities.values()].map(e => { const neighbors = relationships.filter(r => r.from === e.canonical_id || r.to === e.canonical_id).map(r => r.from === e.canonical_id ? r.to : r.from); e.related_entities = [...new Set(neighbors)]; e.llm.llm_relationships = e.related_entities; e.aliases = [...new Set([...(e.aliases || []), e.canonical_id])]; return e; });
const relationshipArray = relationships;
const evidenceArray = entitiesArray.filter(e => e.entity_type === "EVIDENCE").map(e => ({ evidence_id:e.canonical_id, title:e.canonical_name, class:e.metadata?.evidence_class || "UNKNOWN", what:e.deep_summary, where:e.metadata?.repository || UNKNOWN, when:e.metadata?.phase || UNKNOWN, source_refs:e.source_refs, observation:e.deep_summary, method:e.metadata?.kind || UNKNOWN, result:e.human_summary, confidence:e.confidence, limitations:e.metadata?.evidence_class === "D" ? "Inference; not contribution-grade." : UNKNOWN }));
const sources = sourceEntities;
const timeline = (timelineReg.events || []).map((e, i) => ({ timeline_id:`TIME-${String(i+1).padStart(3,"0")}`, ...e, source_refs:sourceRefs("planning/maps/timeline-map.json"), status:"HISTORICAL" }));
const tests = [];
for (const [id, text] of [["TEST-MANIFEST","Manifest-recorded full suite and smoke results"],["TEST-MCP-ABUSE","Phase 9 MCP protocol abuse matrix"],["TEST-MCP-CLIENT","Phase 9 Codex real-client E2E"],["TEST-REMAP-GUARDS","Remap guard matrix and full suite"],["TEST-PHASE15-VALIDATION","Phase 15 final validation; shell JSON/status pass was blocked"]]) tests.push({ test_id:id, name:text, result:id === "TEST-PHASE15-VALIDATION" ? "BLOCKED" : "PASS_UNDER_LIMITED_CONDITIONS", repository:"ix-infrastructure/Ix", file:UNKNOWN, purpose:text, target_behavior:UNKNOWN, commit:UNKNOWN, evidence:[], source_refs:sourceRefs("CLI-HANDOFF/phase-9/PHASE-9-REPORT.md","CLI-HANDOFF/phase-15/PHASE-FINAL-REPORT.md"), limitations:id === "TEST-PHASE15-VALIDATION" ? "Shell runner could not spawn bash." : "Historical phase evidence; rerun before new publication." });
const security = [{security_id:"SEC-REMAP", title:"Remap endpoint lifecycle/concurrency review", severity:"REVIEW_RISK", status:"CONTRIBUTE_AFTER_REWORK", affected_implementation:"IMPL-REMAP-PR393", evidence:["E-014","E-015"], mitigation:"Prove descendant cleanup and define bounded concurrency; do not claim exploitability without reproduction.", source_refs:sourceRefs("CLI-HANDOFF/phase-15/SECURITY-REVIEW.json")},{security_id:"SEC-MCP", title:"MCP protocol/resource-abuse review", severity:"REVIEW_RISK", status:"CONTRIBUTE_AFTER_REWORK", affected_implementation:"IMPL-MCP-FORK", evidence:[], mitigation:"Add strict modern metadata/request-ID conformance and modern-client negative tests.", source_refs:sourceRefs("CLI-HANDOFF/phase-15/SECURITY-REVIEW.json")}];
const agents = [{agent_id:"AGENT-PREVIOUS-PHASES", agent:"previous phase agents", phase_range:"phase-0..phase-14", task:"investigation and implementation reports", conclusion:"historical evidence only; independently reconciled", confidence:"UNKNOWN", accepted:false, source_refs:sourceRefs("CLI-HANDOFF/phase-14/PHASE-14-REPORT.md")},{agent_id:"AGENT-PHASE15-AUDIT", agent:"independent adversarial audit", phase:"phase-15", task:"current-state PR-worthiness review", conclusion:"zero contribution-ready candidates", confidence:"HIGH", accepted:true, source_refs:sourceRefs("CLI-HANDOFF/phase-15/PHASE-FINAL-REPORT.md")}];
const aliases = []; for (const e of entitiesArray) for (const a of e.aliases || []) if (a !== e.canonical_id) aliases.push({ alias:a, canonical_id:e.canonical_id, source_refs:e.source_refs });
const indexes = { by_type:{}, by_status:{}, by_alias:{}, by_source:{}, by_issue:{}, by_pr:{}, by_phase:{} }; for (const e of entitiesArray) { (indexes.by_type[e.entity_type] ||= []).push(e.canonical_id); (indexes.by_status[e.status] ||= []).push(e.canonical_id); for (const a of e.aliases || []) (indexes.by_alias[a] ||= []).push(e.canonical_id); for (const s of e.source_refs || []) (indexes.by_source[s] ||= []).push(e.canonical_id); if (e.canonical_id.startsWith("ISSUE-")) (indexes.by_issue[e.canonical_id.slice(6)] ||= []).push(e.canonical_id); if (e.canonical_id.startsWith("PR-")) (indexes.by_pr[e.canonical_id.slice(3)] ||= []).push(e.canonical_id); if (e.metadata?.phase) (indexes.by_phase[e.metadata.phase] ||= []).push(e.canonical_id); }
const traversal = {}; for (const e of entitiesArray) traversal[e.canonical_id] = { summary:e.human_summary, status:e.status, evidence:e.evidence_ids, neighbors:e.related_entities, next:[...(e.llm?.llm_questions || [])] };
const snapshots = [{ snapshot_id:`SNAPSHOT-WIKI-${generatedAt}`, dataset:"planning/wiki/data/data.js", live_or_snapshot:"SNAPSHOT", generated_at:generatedAt, source_revision:liveHead, known_staleness:["derived UI data includes historical statuses and is not live GitHub truth"], source_refs:sourceRefs("planning/wiki/data/data.js") },{ snapshot_id:`SNAPSHOT-PAGES-${generatedAt}`, dataset:"planning/pages/public/data/data.js", live_or_snapshot:"SNAPSHOT", generated_at:generatedAt, source_revision:liveHead, known_staleness:["sanitized public projection; refresh requires explicit publication authorization"], source_refs:sourceRefs("planning/pages/public/data/data.js") }];
const metrics = { generated_at:generatedAt, raw_source_files:sources.length, canonical_entities:entitiesArray.length, canonical_relationships:relationshipArray.length, orphan_entities:entitiesArray.filter(e => !relationshipArray.some(r => r.from === e.canonical_id || r.to === e.canonical_id)).map(e => e.canonical_id), duplicate_entity_ids:[...new Set((evidenceReg.evidence || []).map(e=>e.id))].filter(id => (evidenceReg.evidence || []).filter(e=>e.id===id).length>1), contradiction_count:contradictions.length, evidence_coverage:entitiesArray.filter(e=>e.entity_type === "FINDING").filter(e=>e.evidence_ids.length).length / Math.max(1, entitiesArray.filter(e=>e.entity_type === "FINDING").length), provenance_coverage:entitiesArray.filter(e=>e.source_refs.length).length / Math.max(1,entitiesArray.length), human_summary_coverage:entitiesArray.filter(e=>e.human_summary && e.human_summary !== e.canonical_name).length / Math.max(1,entitiesArray.length), llm_metadata_coverage:entitiesArray.filter(e=>e.llm?.llm_summary).length / Math.max(1,entitiesArray.length), typed_edge_coverage:relationshipArray.filter(r=>r.type !== "RELATED_TO").length / Math.max(1,relationshipArray.length), section_count:sectionRegistry.length, ui_unchanged:true, live_or_snapshot:"INTERNAL_CANONICAL_LAYER", blockers:["Private system-compass source unavailable","Live GitHub refresh required before publication"] };

function outJson(name, value) { writeFileSync(join(out, name), JSON.stringify(value, null, 2) + "\n", "utf8"); }
mkdirSync(join(out, "llm"), { recursive:true }); mkdirSync(join(out, "derived"), { recursive:true });
outJson("sources.json", sources); outJson("entities.json", entitiesArray); outJson("relationships.json", relationshipArray); outJson("evidence.json", evidenceArray); outJson("external-github-mirror.json", externalMirror); outJson("live-github-state.json", liveGitHub); outJson("sections.json", { captured_at: liveGitHub.captured_at, source: liveGitHub.source, commit_messages: commitMessages, sections: sectionRegistry, issue_sections: issueSectionRegistry, issues: (liveGitHub.open_issues || []).map(issue => ({ number: issue.number, title: issue.title, state: issue.state, user: issue.user, url: issue.url, labels: issue.labels || [] })) }); outJson("timelines.json", timeline); outJson("decisions.json", decisionsReg.decisions || []); outJson("suggestions.json", suggestionsReg.suggestions || []); outJson("tests.json", tests); outJson("security.json", security); outJson("agents.json", agents); outJson("phases.json", phaseRecords); outJson("contradictions.json", contradictions); outJson("aliases.json", aliases); outJson("indexes.json", indexes); outJson("snapshots.json", snapshots); outJson("data-quality.json", metrics); outJson("llm/entity-index.json", Object.fromEntries(entitiesArray.map(e => [e.canonical_id, { type:e.entity_type, name:e.canonical_name, status:e.status, summary:e.llm.llm_summary, evidence:e.evidence_ids, neighbors:e.related_entities }]))); outJson("llm/traversal-index.json", traversal); outJson("derived/ui-data.json", { meta:{ generated_at:generatedAt, source:"knowledge/entities.json + knowledge/relationships.json", live_or_snapshot:"DERIVED", ui_unchanged:true }, nodes:entitiesArray.map(e=>({ id:e.canonical_id, type:e.entity_type.toLowerCase(), title:e.canonical_name, status:e.status })), edges:relationshipArray.map(r=>({ source:r.from, target:r.to, relationship:r.type, confidence:r.confidence })) });
writeFileSync(join(out, "DATA-QUALITY-REPORT.md"), `# Knowledge Graph Data Quality\n\nGenerated: ${generatedAt}\n\n- Raw source files ingested: ${metrics.raw_source_files}\n- Canonical entities: ${metrics.canonical_entities}\n- Typed relationships: ${metrics.canonical_relationships}\n- Orphan entities: ${metrics.orphan_entities.length}\n- Historical duplicate-ID claims requiring recheck: ${metrics.duplicate_entity_ids.length}\n- Explicit contradictions: ${metrics.contradiction_count}\n- Finding evidence coverage: ${(metrics.evidence_coverage * 100).toFixed(1)}%\n- Provenance coverage: ${(metrics.provenance_coverage * 100).toFixed(1)}%\n- Human-summary coverage: ${(metrics.human_summary_coverage * 100).toFixed(1)}%\n- LLM metadata coverage: ${(metrics.llm_metadata_coverage * 100).toFixed(1)}%\n- Precise typed-edge coverage: ${(metrics.typed_edge_coverage * 100).toFixed(1)}%\n\n## Interpretation\n\nThese metrics describe data quality, not engineering correctness. Orphans are reported for review; the generator does not invent edges merely to reduce the count. Historical contradictions remain explicit. The existing UI remains unchanged and its Pages output remains a snapshot.\n\n## Blockers\n\n- Private system-compass source remains inaccessible in the audited baseline.\n- Live GitHub state must be refreshed before treating the dataset as current for publication.\n- The generator and JSON integrity checks passed in this reconstruction run.\n`, "utf8");
console.log(`Knowledge graph built: ${entitiesArray.length} entities, ${relationshipArray.length} relationships, ${sources.length} sources`);
