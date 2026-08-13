/* Canonical entity page renderer — physical /entities/<slug>/ pages.
 * Reads window.IX_ENTITY (the canonical entity id) and window.IX_DATA.
 * Reuses the existing explorer styling (cards, links, faint labels); no layout
 * or design changes — this is a data-presentation seam for generated routes. */
(function () {
"use strict";
const D = window.IX_DATA;
const content = document.getElementById("content");
const id = window.IX_ENTITY;
if (!D || !id || !content) return;
const BASE = window.IX_BASE || "";
const nodes = (D.graph && D.graph.nodes) || [];
const edges = (D.graph && D.graph.edges) || [];
const node = nodes.find(n => n.id === id) || null;

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const kv = (label, value) => {
  const p = el("p");
  const s = el("span", "faint", label + ": ");
  p.append(s);
  if (typeof value === "string") p.append(document.createTextNode(value));
  else if (value && value.nodeType) p.append(value);
  return p;
};
const mirror = (D.externalMirror?.records || []).find(record => record.analysis?.canonical_entity_id === id) || null;
const externalLink = (url, label) => {
  const a = el("a", "ext", label || url || "Open on GitHub");
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  return a;
};
const sourceBody = text => { const pre = el("pre", "source-body"); pre.textContent = text || "(empty)"; return pre; };
const discussion = (title, rows) => {
  if (!rows || !rows.length) return null;
  const wrap = el("div", "source-discussion"); wrap.append(el("h3", "", title));
  rows.forEach(row => {
    const card = el("div", "card");
    card.append(kv("Author", row.author?.login || row.user?.login || "UNKNOWN"));
    card.append(kv("Timestamp", row.created_at || row.submitted_at || "UNKNOWN"));
    if (row.html_url) card.append(kv("GitHub", externalLink(row.html_url, "Open on GitHub")));
    if (row.state) card.append(kv("State", row.state));
    if (row.body) card.append(sourceBody(row.body));
    if (row.path) card.append(kv("File", row.path + (row.line ? ":" + row.line : "")));
    wrap.append(card);
  });
  return wrap;
};
const sourcePanel = () => {
  if (!mirror) return null;
  const panel = el("div", "card source-panel"); panel.append(el("h2", "", "SOURCE — GITHUB (AUTHORITATIVE)"));
  panel.append(kv("Source type", mirror.source?.type || "UNKNOWN"));
  panel.append(kv("Repository", mirror.source?.repository || "UNKNOWN"));
  panel.append(kv("Source URL", externalLink(mirror.source?.url, mirror.source?.url || "UNKNOWN")));
  panel.append(kv("Snapshot version", mirror.freshness?.snapshot_version || "UNKNOWN"));
  panel.append(kv("Last fetched", mirror.freshness?.last_fetched || "UNKNOWN"));
  if (mirror.snapshot?.title) panel.append(kv("Title", mirror.snapshot.title));
  if (mirror.snapshot?.state) panel.append(kv("Source state", mirror.snapshot.state));
  if (mirror.snapshot?.body) panel.append(el("h3", "", "Source body"), sourceBody(mirror.snapshot.body));
  for (const [label, rows] of [["Comments", mirror.snapshot?.comments], ["Reviews", mirror.snapshot?.reviews], ["Review comments", mirror.snapshot?.review_comments]]) { const block = discussion(label, rows); if (block) panel.append(block); }
  const analysis = el("div", "card analysis-panel"); analysis.append(el("h2", "", "IX-FINDINGS ANALYSIS (SEPARATE LAYER)"));
  analysis.append(kv("Analysis status", mirror.analysis?.status || "UNKNOWN"));
  analysis.append(kv("Canonical entity", mirror.analysis?.canonical_entity_id || id));
  analysis.append(kv("Authority", "Ix-findings analysis is not authoritative for the GitHub object."));
  panel.append(analysis);
  return panel;
};
// Same canonical URL resolution as the generator: sections and issues first,
// PR sections second, everything else /entities/<slug>.
function urlOf(other) {
  const sec = (D.sections || []).find(s => s.id === other);
  if (sec) return BASE + sec.graph_path;
  const iss = (D.issueSections || []).find(s => "ISSUE-" + s.issue === other);
  if (iss) return BASE + iss.graph_path;
  if (other === "issues") return BASE + "/issues";
  const pr = (D.sections || []).map(s => {
    const m = String(s.graph_path || "").match(/^\/prs\/(\d+)/);
    return m ? { id: "PR-" + m[1], p: s.graph_path } : null;
  }).find(x => x && x.id === other);
  if (pr) return BASE + pr.p;
  return BASE + "/entities/" + String(other).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const titleOf = other => (nodes.find(n => n.id === other) || {}).title || other;

// Breadcrumb.
const crumb = document.getElementById("breadcrumb");
if (crumb) {
  crumb.innerHTML = "";
  const home = el("span", "crumb", "IX Compass");
  home.onclick = () => { window.location.href = BASE + "/"; };
  crumb.append(home);
  crumb.append(el("span", "sep", " / "));
  crumb.append(el("span", "crumb active", node ? (node.title || id) : id));
}

content.innerHTML = "";
content.scrollTop = 0;
content.append(el("h1", "", node ? node.title : id));
content.append(el("p", "muted", (node ? node.type : "entity") + (node && node.status ? " · " + node.status : "")));

// Metadata fields carried by the public graph node.
if (node) {
  for (const key of ["category", "phase", "repository", "number", "url", "author", "commit", "merged_at", "disposition", "class", "repo"]) {
    if (node[key] !== undefined && node[key] !== null && node[key] !== "") content.append(kv(key, node[key]));
  }
}

const sourceContext = sourcePanel();
if (sourceContext) content.append(sourceContext);

// Relationships (outgoing and incoming).
const related = edges.filter(e => e.source === id || e.target === id);
if (related.length) {
  content.append(el("h2", "", "Relationships (" + related.length + ")"));
  const w = el("div");
  related.forEach(e => {
    const outgoing = e.source === id;
    const other = outgoing ? e.target : e.source;
    const p = el("p", "rel");
    p.append(el("span", "faint", (outgoing ? "→ " : "← ") + e.relationship + " "));
    const a = el("a", "link", titleOf(other));
    a.href = urlOf(other);
    p.append(a);
    w.append(p);
  });
  content.append(w);
} else {
  content.append(el("h2", "", "Relationships"));
  content.append(el("p", "muted", "No recorded relationships for this entity."));
}

// Machine representation + navigation.
const nav = el("p");
const dataLink = el("a", "link", "data.json — machine-readable record");
const here = String(location.pathname).replace(BASE, "").replace(/\/index\.html$/, "").replace(/\/+$/, "");
dataLink.href = (here ? BASE + here : BASE) + "/data.json";
nav.append(dataLink);
nav.append(document.createTextNode(" · "));
const home = el("a", "ext", "Open explorer overview");
home.href = BASE + "/";
nav.append(home);
content.append(nav);
})();
