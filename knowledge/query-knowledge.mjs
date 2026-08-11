#!/usr/bin/env node
// Offline Ix-findings knowledge graph query CLI. No network, package, or repository mutation.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(readFileSync(join(here, name), "utf8"));
const entities = read("entities.json");
const relationships = read("relationships.json");
const indexes = read("indexes.json");
const tests = read("tests.json");
const security = read("security.json");
const manifest = read("manifest.json");
const byId = new Map(entities.map(e => [e.canonical_id, e]));
const byAlias = new Map();
for (const e of entities) for (const alias of [e.canonical_id, ...(e.aliases || [])]) byAlias.set(String(alias).toLowerCase(), e.canonical_id);

const args = process.argv.slice(2);
const json = args.includes("--json");
const includeSources = args.includes("--include-sources");
const depthArg = args.find(a => a.startsWith("--depth="));
const depth = Math.max(0, Math.min(8, Number(depthArg?.split("=")[1] || 2)));
const cleanArgs = args.filter(a => a !== "--json" && a !== "--include-sources" && !a.startsWith("--depth="));
const command = cleanArgs.shift() || "help";
const input = cleanArgs.join(" ").trim();

const SOURCE_EDGE_TYPES = new Set(["HAS_SOURCE", "PART_OF"]);
const edgeAllowed = edge => includeSources || !SOURCE_EDGE_TYPES.has(edge.type);
const neighbors = id => relationships.filter(r => edgeAllowed(r) && (r.from === id || r.to === id)).map(r => ({ edge:r, id:r.from === id ? r.to : r.from }));
const displayEntity = e => ({ id:e.canonical_id, type:e.entity_type, name:e.canonical_name, status:e.status, confidence:e.confidence, summary:e.human_summary, deep_summary:e.deep_summary, evidence:e.evidence_ids || [], aliases:e.aliases || [], temporal:e.temporal, source_refs:e.source_refs || [], uncertainties:e.llm?.llm_uncertainties || [], questions:e.llm?.llm_questions || [] });
const sourceNames = ids => (ids || []).map(id => byId.get(id)?.canonical_name || id);

function resolve(raw) {
  const q = String(raw || "").trim();
  if (!q) return null;
  const direct = byAlias.get(q.toLowerCase());
  if (direct) return byId.get(direct);
  const upper = q.toUpperCase();
  const f = upper.match(/\bF[- ]?(\d{3})\b/);
  if (f && byId.has(`F-${f[1]}`)) return byId.get(`F-${f[1]}`);
  const issue = upper.match(/(?:ISSUE[ #:-]*)?(\d{2,4})\b/);
  if ((upper.includes("ISSUE") || upper.startsWith("#")) && issue && byId.has(`ISSUE-${issue[1]}`)) return byId.get(`ISSUE-${issue[1]}`);
  const pr = upper.match(/(?:PR|PULL REQUEST)[ #:-]*(\d{2,4})\b/);
  if (pr && byId.has(`PR-${pr[1]}`)) return byId.get(`PR-${pr[1]}`);
  const normalized = q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const candidates = entities.filter(e => `${e.canonical_name} ${(e.aliases || []).join(" ")}`.toLowerCase().replace(/[^a-z0-9]+/g, " ").includes(normalized));
  return candidates.length === 1 ? candidates[0] : null;
}

function search(term) {
  const q = String(term || "").toLowerCase();
  return entities.filter(e => [e.canonical_id, e.canonical_name, e.human_summary, e.deep_summary, e.status, ...(e.aliases || []), ...(e.llm?.llm_search_terms || []), e.metadata?.path || "", e.metadata?.title || ""].join(" ").toLowerCase().includes(q)).slice(0, 40).map(displayEntity);
}

function trace(start, maxDepth = depth) {
  const root = resolve(start);
  if (!root) return { error:`Could not resolve '${start}'.`, suggestions:search(start).slice(0, 8).map(e => e.id) };
  const seen = new Map([[root.canonical_id, 0]]);
  const queue = [root.canonical_id];
  const edges = [];
  while (queue.length) {
    const id = queue.shift(); const d = seen.get(id);
    if (d >= maxDepth) continue;
    for (const { edge, id:next } of neighbors(id)) {
      edges.push(edge);
      if (!seen.has(next)) { seen.set(next, d + 1); queue.push(next); }
    }
  }
  return { root:displayEntity(root), depth:maxDepth, nodes:[...seen.entries()].map(([id,d]) => ({ depth:d, ...displayEntity(byId.get(id)) })), edges:[...new Map(edges.map(e => [e.relationship_id, e])).values()] };
}

function shortestPath(fromRaw, toRaw) {
  const from = resolve(fromRaw), to = resolve(toRaw);
  if (!from || !to) return { error:"Both endpoints must resolve.", from:from?.canonical_id || null, to:to?.canonical_id || null };
  const previous = new Map([[from.canonical_id, null]]); const via = new Map(); const queue = [from.canonical_id];
  while (queue.length) {
    const id = queue.shift(); if (id === to.canonical_id) break;
    for (const { edge, id:next } of neighbors(id)) if (!previous.has(next)) { previous.set(next, id); via.set(next, edge); queue.push(next); }
  }
  if (!previous.has(to.canonical_id)) return { error:`No path from ${from.canonical_id} to ${to.canonical_id}.` };
  const ids = []; const edges = []; let at = to.canonical_id;
  while (at) { ids.unshift(at); if (via.has(at)) edges.unshift(via.get(at)); at = previous.get(at); }
  return { from:from.canonical_id, to:to.canonical_id, nodes:ids.map(id => displayEntity(byId.get(id))), edges };
}

function readiness(target) {
  const q = String(target || "").toLowerCase();
  if (!q.includes("mcp") && !q.includes("219")) return { error:"The readiness command currently supports 'mcp' or issue '219'." };
  const impl = byId.get("IMPL-MCP-FORK");
  const candidate = byId.get("AUDIT-CAND-001");
  const issue = byId.get("ISSUE-219");
  const branch = byId.get("BRANCH-fork-ix-mcp");
  const commit = byId.get("COMMIT-606f18f");
  const packet = byId.get("PACKET-ix-mcp");
  const contradiction = byId.get("CONTRA-002");
  const relatedTests = tests.filter(t => /MCP/i.test(`${t.test_id} ${t.name}`));
  const relatedSecurity = security.filter(s => /MCP/i.test(`${s.security_id} ${s.title} ${s.affected_implementation}`));
  const relatedEdges = relationships.filter(r => [impl?.canonical_id, candidate?.canonical_id, issue?.canonical_id, branch?.canonical_id, commit?.canonical_id, packet?.canonical_id].includes(r.from) || [impl?.canonical_id, candidate?.canonical_id, issue?.canonical_id, branch?.canonical_id, commit?.canonical_id, packet?.canonical_id].includes(r.to));
  return {
    question:"Is ix mcp ready for upstream contribution?",
    answer:"NO — CONTRIBUTE_AFTER_REWORK",
    current_state:{ candidate:displayEntity(candidate), implementation:displayEntity(impl), issue:displayEntity(issue), branch:displayEntity(branch), commit:displayEntity(commit), packet:displayEntity(packet) },
    why:[
      "The Phase 15 adversarial gate records zero contribution-ready candidates.",
      "The fork implementation is substantial and locally tested, but modern MCP metadata/request-ID conformance and exact issue scope still require rework.",
      "The prepared packet is not a submitted PR."
    ],
    blockers:[candidate?.metadata?.action, ...(candidate?.llm?.llm_uncertainties || []), ...(impl?.metadata?.known_limitations || []), ...(contradiction ? [contradiction.human_summary] : [])].filter(Boolean),
    evidence_chain:{entity_evidence:sourceNames([...(impl?.evidence_ids || []), ...(candidate?.evidence_ids || [])]), source_refs:sourceNames([...(impl?.source_refs || []), ...(candidate?.source_refs || [])]), tests:relatedTests, security:relatedSecurity},
    traversal:{nodes:[impl, candidate, issue, branch, commit, packet, contradiction].filter(Boolean).map(displayEntity), relationships:[...new Map(relatedEdges.map(e => [e.relationship_id,e])).values()]},
    next_actions:["Add strict modern metadata and non-null request-ID tests.","Clarify whether the upstream contribution is the eight read-only tools or the broader issue #219 scope.","Run a standards-conforming MCP client/Inspector interoperability pass.","Do not open or update an upstream PR without explicit authorization."]
  };
}

function printHuman(result) {
  if (result.error) { console.error(`Error: ${result.error}`); if (result.suggestions?.length) console.error(`Suggestions: ${result.suggestions.join(", ")}`); process.exitCode = 1; return; }
  if (result.answer) {
    console.log(result.answer);
    console.log(`\n${result.question}`);
    console.log(`\nCurrent candidate: ${result.current_state.candidate.id} — ${result.current_state.candidate.status}`);
    console.log(`Implementation: ${result.current_state.implementation.id} — ${result.current_state.implementation.status}`);
    console.log(`Issue: ${result.current_state.issue.id} — ${result.current_state.issue.status}`);
    console.log("\nWhy:"); for (const x of result.why) console.log(`- ${x}`);
    console.log("\nBlockers / limitations:"); for (const x of result.blockers) console.log(`- ${x}`);
    console.log("\nNext actions:"); for (const x of result.next_actions) console.log(`- ${x}`);
    console.log(`\nTraversal nodes: ${result.traversal.nodes.length}; relationships: ${result.traversal.relationships.length}`);
    return;
  }
  if (result.id && result.type) {
    console.log(`${result.id} — ${result.name}`);
    console.log(`Type: ${result.type} | Status: ${result.status} | Confidence: ${result.confidence}`);
    console.log(`\n${result.summary}`);
    console.log(`\n${result.deep_summary}`);
    if (result.evidence?.length) console.log(`\nEvidence: ${result.evidence.join(", ")}`);
    if (result.uncertainties?.length) console.log(`\nUncertainties: ${result.uncertainties.join("; ")}`);
    return;
  }
  if (result.root) {
    console.log(`${result.root.id} — ${result.root.name}`);
    console.log(`Type: ${result.root.type} | Status: ${result.root.status} | Confidence: ${result.root.confidence}`);
    console.log(`\n${result.root.summary}`);
    console.log(`\n${result.root.deep_summary}`);
    if (result.nodes) { console.log(`\nTraversal (${result.nodes.length} nodes, depth ${result.depth}):`); for (const n of result.nodes) console.log(`${"  ".repeat(n.depth)}- ${n.id} [${n.type}] ${n.status}: ${n.name}`); }
    return;
  }
  if (result.nodes && result.edges) { console.log(`Path: ${result.nodes.map(n => n.id).join(" -> ")}`); for (const e of result.edges) console.log(`  ${e.type}: ${e.summary}`); return; }
  if (Array.isArray(result)) { for (const e of result) console.log(`${e.id} [${e.type}] ${e.status} — ${e.name}`); return; }
  console.log(JSON.stringify(result, null, 2));
}

function help() {
  console.log(`Ix-findings offline knowledge CLI\n\nUsage:\n  node knowledge/query-knowledge.mjs show <id> [--json]\n  node knowledge/query-knowledge.mjs trace <id> [--depth=N] [--json]\n  node knowledge/query-knowledge.mjs path <from> <to> [--json]\n  node knowledge/query-knowledge.mjs search <term> [--json]\n  node knowledge/query-knowledge.mjs readiness mcp [--json]\n  node knowledge/query-knowledge.mjs ask \"question\" [--json]\n\nExamples:\n  show F-009\n  trace PR #393 --depth=2\n  path F-009 PR #390\n  readiness mcp\n  ask \"is ix mcp ready?\"`);
}

let result;
if (command === "show") result = (() => { const e = resolve(input); return e ? displayEntity(e) : { error:`Could not resolve '${input}'.`, suggestions:search(input).slice(0,8).map(e=>e.id) }; })();
else if (command === "trace") result = trace(input, depth);
else if (command === "path") {
  const match = input.match(/^(.+?)\s+((?:PR|ISSUE|PULL REQUEST)\s*#?\d+|(?:F|AUDIT-CAND|IMPL|PACKET|BRANCH|COMMIT)-\S+)$/i);
  result = match ? shortestPath(match[1], match[2]) : { error:"Path syntax: path <from-id> <to-id>; spaced forms such as 'PR #393' are supported." };
}
else if (command === "search") result = search(input);
else if (command === "readiness") result = readiness(input);
else if (command === "ask") result = /mcp|219/i.test(input) ? readiness("mcp") : /f[- ]?009|patches|371/i.test(input) ? trace("F-009", depth) : /pr\s*#?393|remap/i.test(input) ? trace("PR-393", depth) : search(input);
else { help(); process.exitCode = command === "help" ? 0 : 1; }
if (result !== undefined) json ? console.log(JSON.stringify(result, null, 2)) : printHuman(result);
