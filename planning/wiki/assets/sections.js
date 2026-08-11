/* Graph section router — hash-based, depth-agnostic, reuses existing explorer styling. */
(function(){
"use strict";
const SECTIONS = (window.IX_DATA && window.IX_DATA.sections) || [];
const ISSUE_SECTIONS = (window.IX_DATA && window.IX_DATA.issueSections) || [];
const COMMIT_MSGS = (window.IX_DATA && window.IX_DATA.sectionMeta && window.IX_DATA.sectionMeta.commit_messages) || {};
const BASE = window.IX_BASE || "";
const byPath = {};
SECTIONS.forEach(s => { byPath[s.graph_path] = s; });
ISSUE_SECTIONS.forEach(s => { byPath[s.graph_path] = s; });
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
function sectionBody(section){
  const w = document.createElement("div");
  w.append(document.createElement("h3"), document.createTextNode(section.title));
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
  const found = SECTIONS.find(s => s.graph_path.replace(/^\//, "") === key);
  if (!found) return false;
  window.location.hash = "#" + found.graph_path;
  const app = window.IX_APP;
  if (app) { renderSection(); return true; }
  return false;
}
function init(){
  // Static generated sub-pages set window.IX_SECTION; render that section directly.
  if (window.IX_SECTION && renderPath(window.IX_SECTION)) return;
  if (!handleHash()) return;
  window.addEventListener("hashchange", () => handleHash() || window.IX_APP.render());
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
})();
