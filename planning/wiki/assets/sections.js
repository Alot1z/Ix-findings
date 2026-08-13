/* Graph section router — hash-based, depth-agnostic, reuses existing explorer styling. */
(function(){
"use strict";
const SECTIONS = (window.IX_DATA && window.IX_DATA.sections) || [];
const ISSUE_SECTIONS = (window.IX_DATA && window.IX_DATA.issueSections) || [];
const COMMIT_MSGS = (window.IX_DATA && window.IX_DATA.sectionMeta && window.IX_DATA.sectionMeta.commit_messages) || {};
const MIRROR = (window.IX_DATA && window.IX_DATA.externalMirror) || { records: [] };
const BASE = window.IX_BASE || "";
const byPath = {};
SECTIONS.forEach(s => { byPath[s.graph_path] = s; });
ISSUE_SECTIONS.forEach(s => { byPath[s.graph_path] = s; });

/* ── hierarchy navigation: parent / siblings / children ──
 * Derived from graph_path segments so every page — however deep — links back
 * up, sideways, and down. Covers both section and issue-section trees. */
const ALL_SECTIONS = SECTIONS.concat(ISSUE_SECTIONS);
const byParent = {};
ALL_SECTIONS.forEach(s => {
  const segs = String(s.graph_path || "").split("/").filter(Boolean);
  const parent = "/" + segs.slice(0, -1).join("/");
  (byParent[parent] = byParent[parent] || []).push(s);
});
function parentOf(section){
  const segs = String(section.graph_path || "").split("/").filter(Boolean);
  if (!segs.length) return null;
  const parent = "/" + segs.slice(0, -1).join("/");
  if (parent === "/") return { label: "Overview", href: BASE + "/" };
  if (parent === "/issues") return { label: "Open issues", href: BASE + "/issues" };
  const p = byPath[parent];
  if (p) return { label: p.title || parent, href: BASE + parent };
  return { label: "Overview", href: BASE + "/" };
}
function siblingsOf(section){
  const segs = String(section.graph_path || "").split("/").filter(Boolean);
  const parent = "/" + segs.slice(0, -1).join("/");
  return (byParent[parent] || []).filter(s => s !== section);
}
function childrenOf(section){
  return byParent[String(section.graph_path || "")] || [];
}
function navChip(label, href){
  const a = document.createElement("a"); a.className = "link"; a.href = href; a.textContent = label;
  return a;
}
function navList(items){
  const w = document.createElement("span"); w.className = "rel";
  if (!items || !items.length) { w.append(document.createTextNode("none")); return w; }
  items.forEach(it => w.append(navChip(it.label, it.href)));
  return w;
}
function navBlock(section){
  const w = document.createElement("div"); w.className = "card";
  const h3 = document.createElement("h3"); h3.textContent = "Navigation";
  w.append(h3);
  const parent = parentOf(section);
  const siblings = siblingsOf(section);
  const children = childrenOf(section);
  if (parent) w.append(kv("Parent", navChip(parent.label, parent.href)));
  if (siblings.length) w.append(kv("Siblings", navList(siblings.map(s => ({ label: s.title || s.graph_path, href: BASE + s.graph_path })))));
  if (children.length) w.append(kv("Children", navList(children.map(s => ({ label: s.title || s.graph_path, href: BASE + s.graph_path })))));
  if (!parent && !siblings.length && !children.length) w.append(kv("Above", "— top-level page"));
  return w;
}
function setBreadcrumb(chain){
  // chain: [{label, href?}] — the last item is the current (active) page.
  const b = document.getElementById("breadcrumb");
  if (!b) return;
  b.innerHTML = "";
  chain.forEach((c, i) => {
    if (i) b.append(Object.assign(document.createElement("span"), { className: "sep", textContent: " / " }));
    const s = document.createElement("span");
    s.className = "crumb" + (i === chain.length - 1 ? " active" : "");
    if (c.href) { const a = document.createElement("a"); a.href = c.href; a.textContent = c.label; s.append(a); }
    else s.textContent = c.label;
    b.append(s);
  });
}
function sectionBreadcrumb(section){
  const segs = String(section.graph_path || "").split("/").filter(Boolean);
  const chain = [{ label: "IX Compass", href: BASE + "/" }];
  let acc = "";
  segs.forEach((seg, i) => {
    acc += "/" + seg;
    const node = byPath[acc];
    const linkable = (node || acc === "/issues") && i < segs.length - 1;
    // Ancestors use their path segment (sidebar convention; titles can repeat
    // across levels), the current page keeps its full title.
    const label = i === segs.length - 1 ? (node ? node.title : seg) : seg;
    chain.push({ label, href: linkable ? BASE + acc : null });
  });
  setBreadcrumb(chain);
}
function renderIssuesIndex(){
  const app = window.IX_APP;
  if (!app) return;
  const content = app.content;
  content.innerHTML = "";
  content.scrollTop = 0;
  const h1 = document.createElement("h1"); h1.textContent = "Open issues";
  content.append(h1);
  const list = (window.IX_DATA.issuesIndex || []);
  if (!list.length) { content.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "No open issues recorded." })); return; }
  setBreadcrumb([{ label: "IX Compass", href: BASE + "/" }, { label: "Open issues", href: null }]);
  list.forEach(issue => {
    const card = document.createElement("div"); card.className = "card";
    const h3 = document.createElement("h3"); h3.textContent = "#" + issue.number + " — " + (issue.title || "");
    card.append(h3);
    const a = linkifyGitHubUrl("https://github.com/ix-infrastructure/Ix/issues/" + issue.number, "GitHub issue");
    card.append(a);
    const link = document.createElement("a"); link.className = "link"; link.href = BASE + "/issues/" + issue.number; link.textContent = "Graph page";
    card.append(link);
    content.append(card);
  });
}

function cleanHash(){
  let h = location.hash.replace(/^#\/?/, "");
  h = h.replace(/\/+$/, "");
  return h.split("/").filter(Boolean);
}
function currentSection(){
  const parts = cleanHash();
  if (parts.length === 0) return null;
  for (let depth = parts.length; depth >= 1; depth--) {
    const path = "/" + parts.slice(0, depth).join("/");
    if (byPath[path]) return byPath[path];
  }
  return null;
}
function linkifyGitHubUrl(url, label){
  const a = document.createElement("a");
  a.href = url; a.target = "_blank"; a.rel = "noopener";
  a.textContent = label || url; a.className = "ext";
  return a;
}
function urlFromFile(file){
  if (file.url) return file.url;
  const range = file.start_line ? `#L${file.start_line}${file.end_line && file.end_line !== file.start_line ? "-L" + file.end_line : ""}` : "";
  return "https://github.com/" + file.repository + "/blob/" + (file.commit || "main") + "/" + file.path + range;
}
function chipList(rows, makeLabel, makeHref, emptyText){
  const w = document.createElement("div");
  w.className = "rel";
  if (!rows || !rows.length) { w.append(document.createTextNode(emptyText || "none")); return w; }
  rows.forEach(row => {
    const a = document.createElement("a");
    a.className = "link"; a.target = "_blank"; a.rel = "noopener";
    a.textContent = makeLabel(row);
    if (makeHref) a.href = makeHref(row);
    w.append(a);
  });
  return w;
}
function kv(label, valueNode){
  const p = document.createElement("p");
  const s = document.createElement("span"); s.className = "faint"; s.textContent = label + ": ";
  p.append(s);
  if (typeof valueNode === "string") p.append(document.createTextNode(valueNode));
  else if (valueNode) p.append(valueNode);
  return p;
}
function mirrorForCanonical(id){
  return (MIRROR.records || []).find(record => record.analysis && record.analysis.canonical_entity_id === id) || null;
}
function sourceLink(url, label){
  return url ? linkifyGitHubUrl(url, label || url) : document.createTextNode("UNKNOWN");
}
function sourceBody(text){
  const pre = document.createElement("pre");
  pre.className = "source-body";
  pre.textContent = text || "(empty)";
  return pre;
}
function sourceDiscussion(title, rows){
  const w = document.createElement("div");
  if (!rows || !rows.length) return w;
  const h = document.createElement("h4"); h.textContent = title; w.append(h);
  rows.forEach(row => {
    const card = document.createElement("div"); card.className = "card source-discussion";
    const header = document.createElement("p");
    header.append(document.createTextNode((row.author?.login || row.user?.login || "UNKNOWN") + " · " + (row.created_at || row.submitted_at || "UNKNOWN") + " "));
    if (row.html_url) header.append(sourceLink(row.html_url, "Open on GitHub"));
    card.append(header);
    if (row.state) card.append(kv("Review state", row.state));
    if (row.body) card.append(sourceBody(row.body));
    if (row.path) card.append(kv("File", row.path + (row.line ? ":" + row.line : "")));
    w.append(card);
  });
  return w;
}
function snapshotReviewThreadState(record){
  return record?.snapshot?.review_thread_capture?.status || record?.analysis?.review_thread_state || "UNKNOWN";
}
function externalSourcePanel(canonicalId){
  const record = mirrorForCanonical(canonicalId);
  if (!record) return null;
  const w = document.createElement("div"); w.className = "card source-panel";
  const h = document.createElement("h3"); h.textContent = "SOURCE — GITHUB (AUTHORITATIVE)"; w.append(h);
  w.append(kv("Source type", record.source?.type || "UNKNOWN"));
  w.append(kv("Repository", record.source?.repository || "UNKNOWN"));
  w.append(kv("Source URL", sourceLink(record.source?.url, record.source?.url || "Open on GitHub")));
  w.append(kv("Snapshot version", record.freshness?.snapshot_version || "UNKNOWN"));
  w.append(kv("Last fetched", record.freshness?.last_fetched || "UNKNOWN"));
  w.append(kv("Source updated", record.freshness?.source_updated_at || "UNKNOWN"));
  w.append(kv("Review-thread capture", snapshotReviewThreadState(record)));
  const snapshot = record.snapshot || {};
  if (snapshot.title) w.append(kv("Title", snapshot.title));
  if (snapshot.state) w.append(kv("Current source state", snapshot.state));
  if (snapshot.body) { const bodyTitle = document.createElement("h4"); bodyTitle.textContent = "Source body"; w.append(bodyTitle, sourceBody(snapshot.body)); }
  if (snapshot.head) { w.append(kv("Head branch", snapshot.head.ref || "UNKNOWN")); w.append(kv("Head SHA", snapshot.head.sha || "UNKNOWN")); }
  if (snapshot.base) w.append(kv("Base branch", snapshot.base.ref || "UNKNOWN"));
  if (snapshot.merge_commit_sha) w.append(kv("Merge commit", snapshot.merge_commit_sha));
  if (snapshot.commits?.length) w.append(kv("Source commits", String(snapshot.commits.length)));
  if (snapshot.changed_files?.length) w.append(kv("Changed files", String(snapshot.changed_files.length)));
  w.append(sourceDiscussion("Comments", snapshot.comments));
  w.append(sourceDiscussion("Reviews", snapshot.reviews));
  w.append(sourceDiscussion("Review comments", snapshot.review_comments));
  const analysis = document.createElement("div"); analysis.className = "card analysis-panel";
  const ah = document.createElement("h3"); ah.textContent = "IX-FINDINGS ANALYSIS (SEPARATE LAYER)"; analysis.append(ah);
  analysis.append(kv("Analysis status", record.analysis?.status || "UNKNOWN"));
  analysis.append(kv("Canonical entity", record.analysis?.canonical_entity_id || "UNKNOWN"));
  analysis.append(kv("Authority", "Ix-findings analysis is not authoritative for the GitHub object."));
  analysis.append(kv("Mirror policy", "Read-only snapshot; source changes are recorded as new freshness/history state."));
  w.append(analysis);
  return w;
}
function sectionBody(section){
  const w = document.createElement("div");
  w.append(document.createElement("h3"), document.createTextNode(section.title));
  const prNumber = (section.pr_refs || []).map(ref => String(ref).match(/#(\d+)/)?.[1]).find(Boolean);
  const sourcePanel = prNumber ? externalSourcePanel(`PR-${prNumber}`) : null;
  if (sourcePanel) w.append(sourcePanel);
  w.append(navBlock(section));
  w.append(kv("Status", section.status || "unknown"));
  w.append(kv("Repository", section.repository || ""));
  w.append(kv("Graph path", section.graph_path || ""));
  if (section.issue_refs && section.issue_refs.length) w.append(kv("Issues", chipList(section.issue_refs, ref => ref, ref => "https://github.com/" + ref.replace("#", "/issues/"))));
  if (section.pr_refs && section.pr_refs.length) w.append(kv("PRs", chipList(section.pr_refs, ref => ref, ref => "https://github.com/" + ref.replace("#", "/pull/"))));
  if (section.commit_refs && section.commit_refs.length) w.append(kv("Commits", chipList(section.commit_refs, sha => sha.slice(0, 7) + (COMMIT_MSGS[sha] ? " — " + COMMIT_MSGS[sha].slice(0, 60) : ""), sha => "https://github.com/" + section.repository + "/commit/" + sha)));
  if (section.file_refs && section.file_refs.length) {
    w.append(kv("Files", chipList(section.file_refs, file => file.path + (file.symbol ? " — " + file.symbol : ""), file => urlFromFile(file))));
  }
  if (section.test_refs && section.test_refs.length) w.append(kv("Tests", chipList(section.test_refs, t => t.name || t.file, t => t.file ? "https://github.com/" + section.repository + "/blob/" + (section.commit_refs && section.commit_refs[0]) + "/" + t.file + (t.start_line ? "#L" + t.start_line : "") : undefined)));
  if (section.evidence && section.evidence.length) w.append(kv("Evidence", section.evidence.join(" · ")));
  if (section.security && section.security.length) w.append(kv("Security", section.security.join(" · ")));
  if (section.finding_refs && section.finding_refs.length) w.append(kv("Findings", section.finding_refs.join(" · ")));
  const related = SECTIONS.filter(other => other.graph_path !== section.graph_path && other.implementation_id === section.implementation_id);
  if (related.length) w.append(kv("Related sections", chipList(related, r => r.graph_path, r => BASE + "/#" + r.graph_path)));
  w.append(kv("Live graph", linkifyGitHubUrl((window.IX_DATA.meta && window.IX_DATA.meta.html_url) ? window.IX_DATA.meta.html_url : "https://alot1z.github.io/Ix-findings/", "Ix-findings explorer")));
  return w;
}
function issueBody(section){
  const w = document.createElement("div");
  w.append(document.createElement("h3"), document.createTextNode(section.issue_title || section.title));
  const sourcePanel = externalSourcePanel(`ISSUE-${section.issue}`);
  if (sourcePanel) w.append(sourcePanel);
  w.append(navBlock(section));
  w.append(kv("Issue", linkifyGitHubUrl(section.issue_url, "ix-infrastructure/Ix#" + section.issue)));
  w.append(kv("State", section.state || "open"));
  if (section.user) w.append(kv("Author", section.user));
  if (section.labels && section.labels.length) w.append(kv("Labels", section.labels.join(" · ")));
  if (section.related_sections && section.related_sections.length) {
    w.append(kv("Graph sections", chipList(section.related_sections, p => p, p => BASE + "/" + p.replace(/^\//, ""))));
  }
  if (section.pr_refs && section.pr_refs.length) w.append(kv("PRs", chipList(section.pr_refs, ref => ref, ref => "https://github.com/" + ref.replace("#", "/pull/"))));
  if (section.commit_refs && section.commit_refs.length) w.append(kv("Commits", chipList(section.commit_refs, sha => sha.slice(0, 7), sha => "https://github.com/ix-infrastructure/Ix/commit/" + sha)));
  if (section.file_refs && section.file_refs.length) w.append(kv("Files", chipList(section.file_refs, file => file.path, file => urlFromFile(file))));
  if (section.test_refs && section.test_refs.length) w.append(kv("Tests", section.test_refs.map(t => t.name || t.file).join(" · ")));
  if (section.finding_refs && section.finding_refs.length) w.append(kv("Findings", section.finding_refs.join(" · ")));
  if (!(section.related_sections || []).length) {
    w.append(kv("Implementation", "no verified implementation mapped to this issue"));
  }
  return w;
}
function renderExternalView(view){
  const app = window.IX_APP;
  if (!app || !view?.canonical_id) return false;
  const record = mirrorForCanonical(view.canonical_id);
  const content = app.content;
  content.innerHTML = "";
  content.scrollTop = 0;
  const title = view.title || `${view.canonical_id} ${view.subsection || ""}`;
  const h1 = document.createElement("h1"); h1.textContent = title; content.append(h1);
  const source = externalSourcePanel(view.canonical_id);
  if (source) content.append(source);
  const snapshot = record?.snapshot || {};
  const block = document.createElement("div"); block.className = "card";
  const heading = document.createElement("h2"); heading.textContent = String(view.subsection || "").replace(/-/g, " "); block.append(heading);
  const rows = view.subsection === "comments" ? [...(snapshot.comments || []), ...(snapshot.review_comments || [])]
    : view.subsection === "reviews" ? snapshot.reviews || []
    : view.subsection === "review-threads" ? snapshot.review_threads || []
    : view.subsection === "files" ? snapshot.changed_files || []
    : view.subsection === "commits" ? snapshot.commits || []
    : view.subsection === "timeline" ? snapshot.timeline || [] : [];
  if (["comments", "reviews", "review-threads", "files", "commits", "timeline"].includes(view.subsection)) {
    if (!rows.length) block.append(kv("Result", "No source records were captured for this subsection."));
    rows.forEach(row => {
      const card = document.createElement("div"); card.className = "card";
      const label = row.title || row.filename || row.path || row.event || row.id || "Source record";
      const h = document.createElement("h3"); h.textContent = label; card.append(h);
      if (row.author?.login || row.author) card.append(kv("Author", row.author?.login || row.author));
      if (row.created_at || row.submitted_at) card.append(kv("Timestamp", row.created_at || row.submitted_at));
      if (row.state) card.append(kv("State", row.state));
      if (row.is_resolved !== undefined) card.append(kv("Resolved", row.is_resolved ? "true" : "false"));
      if (row.html_url || row.url || row.blob_url) card.append(kv("GitHub", sourceLink(row.html_url || row.url || row.blob_url, "Open on GitHub")));
      if (row.body) card.append(sourceBody(row.body));
      if (row.comments?.length) card.append(sourceDiscussion("Thread comments", row.comments));
      if (row.sha) card.append(kv("SHA", row.sha));
      if (row.commit_sha) card.append(kv("Commit", row.commit_sha));
      if (row.path) card.append(kv("File", row.path + (row.line ? ":" + row.line : "")));
      block.append(card);
    });
  } else if (view.subsection === "conversation") {
    if (snapshot.body) block.append(sourceBody(snapshot.body));
    block.append(sourceDiscussion("Comments", snapshot.comments));
    block.append(sourceDiscussion("Reviews", snapshot.reviews));
    block.append(sourceDiscussion("Review comments", snapshot.review_comments));
  } else if (view.subsection === "analysis") {
    block.append(kv("Layer", "IX-FINDINGS_ANALYSIS"));
    block.append(kv("Status", record?.analysis?.status || "UNKNOWN"));
    block.append(kv("Canonical entity", view.canonical_id));
    block.append(kv("Authority", "Ix-findings owns this analysis; GitHub remains authoritative for the source object."));
    const related = (window.IX_DATA.graph?.edges || []).filter(edge => edge.source === view.canonical_id || edge.target === view.canonical_id);
    if (related.length) block.append(kv("Graph relationships", related.map(edge => `${edge.source === view.canonical_id ? "→" : "←"} ${edge.relationship}`).join(" · ")));
  } else if (view.subsection === "relationships") {
    const related = (window.IX_DATA.graph?.edges || []).filter(edge => edge.source === view.canonical_id || edge.target === view.canonical_id);
    if (!related.length) block.append(kv("Relationships", "No canonical relationships recorded."));
    related.forEach(edge => block.append(kv(edge.relationship, edge.source === view.canonical_id ? edge.target : edge.source)));
  }
  content.append(block);
  const parent = view.path?.split("/").slice(0, -1).join("/") || (view.canonical_id.startsWith("ISSUE-") ? `/issues/${view.canonical_id.slice(6)}` : `/prs/${view.canonical_id.slice(3)}`);
  setBreadcrumb([{label:"IX Compass",href:BASE+"/"},{label: parent.replace(/^\//, ""),href:BASE+parent},{label:title}]);
  return true;
}
function renderSection(){
  const section = currentSection();
  const app = window.IX_APP;
  if (!app) return;
  const content = app.content;
  if (!section) {
    const path = cleanHash().join("/") || "unknown";
    content.innerHTML = "";
    const h1 = document.createElement("h1"); h1.textContent = "Graph section not found";
    content.append(h1);
    const p = document.createElement("p"); p.className = "muted";
    p.textContent = "No section registered for /" + path + ". Sections are generated from the canonical dataset.";
    content.append(p);
    const a = document.createElement("a"); a.className = "ext"; a.href = BASE + "/#";
    a.textContent = "Open explorer overview";
    content.append(a);
    return;
  }
  content.innerHTML = "";
  content.scrollTop = 0;
  const h1 = document.createElement("h1"); h1.textContent = section.title;
  content.append(h1);
  if (section.issue !== undefined) content.append(issueBody(section));
  else content.append(sectionBody(section));
  sectionBreadcrumb(section);
}
function handleHash(){
  const parts = cleanHash();
  if (parts.length === 0) return false;
  if (parts.join("/") === "issues") { renderIssuesIndex(); return true; }
  const section = currentSection();
  if (section) { renderSection(); return true; }
  return false;
}
function renderPath(path){
  const key = (path || "").replace(/^\/+/, "").replace(/\/+$/, "");
  if (!key) return false;
  const app = window.IX_APP;
  if (key === "issues") { if (app) { renderIssuesIndex(); return true; } }
  const found = SECTIONS.concat(ISSUE_SECTIONS).find(s => s.graph_path.replace(/^\//, "") === key);
  if (!found) return false;
  window.location.hash = "#" + found.graph_path;
  if (app) { renderSection(); return true; }
  return false;
}
function init(){
  // Static generated category pages set window.IX_VIEW; render that SPA view.
  if (window.IX_VIEW && window.IX_APP && window.IX_APP.setView) {
    window.IX_APP.setView(window.IX_VIEW);
    return;
  }
  // Static generated sub-pages set window.IX_SECTION; render that section directly.
  if (window.IX_EXTERNAL_VIEW && renderExternalView(window.IX_EXTERNAL_VIEW)) return;
  if (window.IX_SECTION && renderPath(window.IX_SECTION)) return;
  // Render any hash deep-link present at load (/#/mcp, /#/issues/219, …), and
  // always listen for hash changes — including from the root page, which has
  // no hash at load and previously never registered this listener.
  handleHash();
  window.addEventListener("hashchange", () => handleHash() || window.IX_APP.render());
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
})();
