/* IX Compass — Knowledge Explorer. Reads window.IX_DATA. */
(function(){
"use strict";
const D = window.IX_DATA;
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

/* Base path of the app. GitHub Pages serves the repo under /Ix-findings, while
 * local previews and file:// serve at root. 404.html pre-injects IX_BASE;
 * otherwise derive it from this script's own URL so canonical navigation to
 * physical pages works in every serving context. Exposed for later assets. */
const BASE = (function(){
  if (typeof window.IX_BASE === "string" && window.IX_BASE) return window.IX_BASE;
  const src = document.currentScript && document.currentScript.src;
  if (src) { try { return new URL(src).pathname.replace(/\/assets\/wiki\.js$/, ""); } catch (e) {} }
  return "";
})();
window.IX_BASE = BASE;

const TYPE_COLOR = {
  phase:"#5aa8ff", repository:"#e0b25a", branch:"#c9a96a", commit:"#8a9bb0", worktree:"#7fd0c0",
  issue:"#e06a6a", pr:"#e07a5a", pr_packet:"#ff9d5c", finding:"#5fd0a8",
  evidence:"#7fd0ff", decision:"#b48ae0", suggestion:"#8fd0c0", person:"#d8c8a0",
  release:"#ff9944", artifact:"#ffbb66", file:"#8899cc", symbol:"#99bbee", api:"#aaccee", test:"#88cc88",
  stale_claim:"#ee6666", contribution:"#ffaa44"
};
const ECLASS = {A:["A","◼"],B:["B","◈"],C:["C","△"],D:["D","○"]};
const ECLASS_MEAN = {A:"source",B:"artifact/runtime",C:"reconstruction",D:"inference"};

function ec(id){ return '<span class="eclass '+id+'" data-g="'+ECLASS[id][1]+'" title="'+ECLASS[id][0]+': '+ECLASS_MEAN[id]+'">'+ECLASS[id][0]+'</span>'; }
function disp(x){ return '<span class="disposition '+(x||'').toLowerCase()+'">'+(x||'')+'</span>'; }
function sts(x){ const c=String(x||'').toLowerCase(); let k=''; if(c.includes('pr_ready')||c.includes('ready'))k=' pr-ready'; else if(c.includes('open')||c.includes('block'))k=' open'; else if(c.includes('repro')||c.includes('confirm')||c.includes('verified'))k=' reproduced'; return '<span class="badge-status'+k+'">'+(x||'')+'</span>'; }

const FINDINGS = Object.fromEntries((D.findings||[]).map(f=>[f.id,f]));
const EVIDENCE = Object.fromEntries((D.evidence||[]).map(e=>[e.id,e]));
const SUGGS = Object.fromEntries((D.suggestions||[]).map(s=>[s.id,s]));
const DECS = Object.fromEntries((D.decisions||[]).map(d=>[d.id,d]));
const PHASES = Object.fromEntries((D.phases||[]).map(p=>[p.id,p]));
const GRAPH = D.graph || {nodes:[],edges:[]};
const NODES = Object.fromEntries(GRAPH.nodes.map(n=>[n.id,n]));
const REPOS = D.repos || [];
const BRANCHES = D.branches || [];
const COMMITS = D.commits || [];
const WORKTREES = D.worktrees || {};
const PRS = D.pullRequests || [];
const ISSUES = D.issues || [];
const CONTRIBS = D.contributions || [];
const STALE = D.staleClaims || [];
const TESTS = D.testResults || {};
const SYSCOMPASS = D.sysCompass || {};

let currentView = "overview";
function setView(v){ currentView=v; document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v)); render(); }
function renderBreadcrumb(){
  const b=$('#breadcrumb'); b.innerHTML='';
  const n={overview:"Overview",map:"Investigation Map",repos:"Repositories",worktrees:"Worktrees",branches:"Branches",commits:"Commits",releases:"Releases",findings:"Findings",evidence:"Evidence",tests:"Tests",prs:"PRs",issues:"Issues",contributions:"Contributions",suggestions:"Suggestions",decisions:"Decisions",stale:"Stale Claims",syscompass:"System-Compass",timeline:"Timeline",compass:"Compass History",phases:"Phases",security:"Security",about:"About"}[currentView]||currentView;
  const h=el('span','crumb','IX Compass'); h.onclick=()=>setView('overview'); b.append(h);
  b.append(el('span','sep',' / '));
  b.append(el('span','crumb active',n));
}
// Physical-link nav items (category pages) have no data-view; only buttons
// with a data-view switch views in-page. Anchors navigate to their real page.
document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#drawer-close').onclick=closeDrawer;

const content=$('#content');
function openDrawer(title,body){ $('#drawer-title').textContent=title; $('#drawer-body').innerHTML=''; $('#drawer-body').append(body); $('#drawer').classList.add('open'); }
function closeDrawer(){ $('#drawer').classList.remove('open'); }
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});

function chip(label,id,type){ const a=el('a','link',''); a.textContent=label; a.onclick=e=>{e.stopPropagation();openEntity(id,type);}; return a; }
function relList(ids,type){ if(!ids||!ids.length)return el('span','faint','none'); const w=el('span','rel'); ids.forEach(id=>w.append(chip(id,id,type))); return w; }
function kv(t,v){ return '<p><span class="faint">'+t+':</span> '+(v!=null?v:'—')+'</p>'; }
function sec(t,n){ const w=el('div'); w.append(el('h3','',t)); w.append(n); return w; }

/* Canonical-page navigation — mirrors the generator's entityUrl() so a click
 * lands on the physical canonical page: sections, issues, and PRs have their
 * own routes; every other entity resolves to /entities/<slug>/ (+ data.json). */
const KNOWN_IDS = new Set([
  ...GRAPH.nodes.map(n => n.id),
  ...(D.sections || []).map(s => s.id),
  ...(D.issueSections || []).map(s => "ISSUE-" + s.issue),
  ...(D.pullRequests || []).map(p => "PR-" + p.number),
]);
function slugOf(id){ return String(id || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "entity"; }
function canonicalUrlOf(id){
  const sec = (D.sections || []).find(s => s.id === id);
  if (sec) return BASE + String(sec.graph_path || "").replace(/\/+$/, "");
  const iss = (D.issueSections || []).find(s => "ISSUE-" + s.issue === id);
  if (iss) return BASE + String(iss.graph_path || "").replace(/\/+$/, "");
  if (id === "issues") return BASE + "/issues";
  const pr = (D.sections || []).map(s => { const m = String(s.graph_path || "").match(/^\/prs\/(\d+)/); return m ? { id: "PR-" + m[1], p: s.graph_path } : null; }).find(x => x && x.id === id);
  if (pr) return BASE + String(pr.p || "").replace(/\/+$/, "");
  return BASE + "/entities/" + slugOf(id);
}
/* Search results use display ids (PR#393, bare SHAs, repo names) that differ
 * from canonical entity ids; normalize before resolving, and fall back to the
 * drawer when an id has no canonical page. */
function resolveEntityId(id, type){
  let x = String(id || "");
  if (/^PR#\d+$/.test(x)) x = x.replace(/^PR#/, "PR-");
  else if (type === "commit" && x && x.indexOf("COMMIT-") !== 0) x = "COMMIT-" + x;
  else if (type === "repository" && x && x.indexOf("REPO-") !== 0) x = "REPO-" + x.split("/").join("-");
  return x;
}
function openCanonical(id, type){
  const rid = resolveEntityId(id, type);
  if (KNOWN_IDS.has(rid)) { window.location.href = canonicalUrlOf(rid); return true; }
  openEntity(id, type);
  return false;
}

function openEntity(id,type){
  type=type||(NODES[id]&&NODES[id].type);
  let body;
  if(FINDINGS[id])body=findBody(FINDINGS[id]);
  else if(EVIDENCE[id])body=evidBody(EVIDENCE[id]);
  else if(SUGGS[id])body=sugBody(SUGGS[id]);
  else if(DECS[id])body=decBody(DECS[id]);
  else if(PHASES[id])body=phaseBody(PHASES[id]);
  else if(NODES[id])body=nodeBody(NODES[id]);
  else body=el('p','muted','No detail for '+id);
  openDrawer(id,body);
}

function findBody(f){
  const w=el('div');
  w.append(el('p','',ec(f.evidence_class.split('+')[0])+' '+sts(f.status)+' <span class="tag">'+f.repository+'</span>'));
  w.append(el('p','muted',(f.ixf_id?('alias '+f.ixf_id+' · '):'')+'confidence '+f.confidence+(f.severity?' · severity '+f.severity:'')));
  w.append(el('p','',kv('Subsystem',f.subsystem)+kv('Affected',(f.affected_versions||[]).join(', '))));
  w.append(sec('Reproduction',el('p','',f.reproduction||'—')));
  w.append(sec('Evidence',relList(f.evidence_refs,'evidence')));
  w.append(sec('Issues',relList(f.related_issues,'issue')));
  w.append(sec('PRs',relList(f.related_prs,'pr_packet')));
  w.append(sec('Suggestions',relList(f.related_suggestions,'suggestion')));
  w.append(sec('Recommendation',el('p','',f.recommendation)));
  return w;
}
function evidBody(e){
  const w=el('div');
  w.append(el('p','',ec(e.class)+' <span class="tag">'+e.kind+'</span> <span class="tag">'+(e.repository||'')+'</span>'));
  w.append(el('p','',e.detail||''));
  w.append(sec('Supports',relList(e.supports,'finding')));
  return w;
}
function sugBody(s){
  const w=el('div');
  w.append(el('p','',disp(s.disposition)+' <span class="tag">'+s.repository+'</span>'));
  w.append(el('p','',s.text));
  w.append(sec('Reason',el('p','',s.reason||'—')));
  w.append(sec('Evidence',relList(s.evidence_refs,'evidence')));
  w.append(sec('Findings',relList(s.related_findings,'finding')));
  return w;
}
function decBody(d){
  const w=el('div');
  w.append(el('p','',sts(d.status)+' <span class="tag">'+(d.dec_alias||'')+'</span>'));
  w.append(el('p','',d.title));
  w.append(el('p','',kv('Problem',d.problem)+kv('Chosen',d.chosen||'<span class="faint">pending</span>')+kv('Reason',d.reason)));
  w.append(sec('Findings',relList(d.related_findings,'finding')));
  return w;
}
function phaseBody(p){
  const w=el('div');
  w.append(el('p','',sts(p.status)+' <span class="tag">'+p.category+'</span>'));
  w.append(el('p','',p.objective||''));
  w.append(sec('Findings',el('div','',(p.key_findings||[]).map(k=>'<p>· '+k+'</p>').join(''))));
  return w;
}
function nodeBody(n){
  const w=el('div');
  const meta=Object.entries(n).filter(([k])=>!['id','type','title'].includes(k)).map(([k,v])=>kv(k,typeof v==='object'?JSON.stringify(v):v)).join('');
  w.append(el('p','',meta||'no metadata'));
  return w;
}

/* ── render dispatch ── */
function render(){
  content.innerHTML=''; content.scrollTop=0;
  renderBreadcrumb();
  const v=currentView;
  if(v==='overview')renderOverview();
  else if(v==='map')renderMap();
  else if(v==='repos')renderRepos();
  else if(v==='worktrees')renderWorktrees();
  else if(v==='branches')renderBranches();
  else if(v==='commits')renderCommits();
  else if(v==='releases')renderReleases();
  else if(v==='findings')renderFindings();
  else if(v==='evidence')renderEvidence();
  else if(v==='tests')renderTests();
  else if(v==='prs')renderPRs();
  else if(v==='issues')renderIssues();
  else if(v==='contributions')renderContributions();
  else if(v==='suggestions')renderSuggestions();
  else if(v==='decisions')renderDecisions();
  else if(v==='stale')renderStale();
  else if(v==='syscompass')renderSysCompass();
  else if(v==='timeline')renderTimeline();
  else if(v==='compass')renderCompass();
  else if(v==='phases')renderPhases();
  else if(v==='security')renderSecurity();
  else if(v==='about')renderAbout();
}

/* ── overview ── */
function renderOverview(){
  const m=D.meta||{};
  content.append(el('h1','','IX Compass — Knowledge Explorer'));
  content.append(el('p','lede','Investigation knowledge base, evidence model, and contribution intelligence for the Ix / Compass ecosystem. '+(m.entityCounts?.findings||13)+' findings · '+(m.entityCounts?.graphNodes||290)+' graph nodes · '+(m.entityCounts?.evidence||28)+' evidence items.'));
  content.append(el('p','muted','Generated '+m.generated+' from revision '+m.sourceRevision+'. Local preview. No network required.'));

  content.append(el('h2','','EXECUTION STATE'));
  const st=el('table','','<thead><tr><th>Repository</th><th>Branch</th><th>SHA</th><th>State</th></tr></thead><tbody></tbody>');
  [
    ['ix-infrastructure/Ix','feat/ix-agent-skill','b038c46','14 dirty — PROTECTED'],
    ['ix-infrastructure/Ix (remap)','feat/ix-remap-hardening','c021b52','Clean, pushed to fork ✅'],
    ['ix-infrastructure/Ix (test)','origin/main','c4f8fea','Clean, 646/648 passed ✅'],
    ['Alot1z/Ix (fork)','main','c4f8fea','SYNCHRONIZED ✅'],
    ['ix-compass-dist','main','396426b','Clean'],
    ['system-compass','—','—','PRIVATE — 404 ⛔'],
    ['Ix-findings','master',m.sourceRevision||'—','Published ✅']
  ].forEach(r=>st.querySelector('tbody').append(el('tr','',r.map((c,i)=>i===0?'<td class="code">'+c+'</td>':'<td>'+c+'</td>').join(''))));
  content.append(st);

  content.append(el('h2','','QUICK NAVIGATION'));
  const g=el('div','grid');
  [
    ['✦ Findings', '13 findings (F-001–F-013) with evidence chains', 'findings'],
    ['▤ Repositories', '5 repos with fork relationships and live state', 'repos'],
    ['⇄ Contributions', '6 contribution candidates with readiness', 'contributions'],
    ['⌗ Graph', '~290 nodes, ~240 edges — interactive D3 force layout', 'map'],
    ['◷ Timeline', 'Chronological investigation timeline', 'timeline'],
    ['◐ System-Compass', 'Access status, F-key spec, contribution blockers', 'syscompass'],
    ['✓ Tests', 'Fresh test results: 646/648 passed @ c4f8fea', 'tests'],
    ['⚠ Stale Claims', '8 known discrepancies discovered and documented', 'stale']
  ].forEach(c=>{ const card=el('div','card phase-card'); card.onclick=()=>setView(c[2]); card.append(el('h3','',c[0])); card.append(el('p','muted',c[1])); g.append(card); });
  content.append(g);

  // Every knowledge category has a physical canonical page — link them here
  // so the root exposes the full hierarchy (spec: no category exists only as
  // an SPA hash view).
  content.append(el('h2','','KNOWLEDGE CATEGORIES'));
  const cat=el('div','grid');
  [
    ['Findings', '/findings/', (m.entityCounts?.findings||0)+' findings'],
    ['Evidence', '/evidence/', (m.entityCounts?.evidence||0)+' evidence items'],
    ['Repositories', '/repositories/', (D.repos||[]).length+' repositories'],
    ['Commits', '/commits/', (COMMITS.length||0)+' commits'],
    ['Pull Requests', '/prs/', (PRS.length||0)+' PRs'],
    ['Issues', '/issues/', (ISSUES.length||0)+' issues'],
    ['Timeline', '/timeline/', 'chronological events'],
    ['Phases', '/phases/', (PHASES.length||0)+' phases'],
    ['Decisions', '/decisions/', (DECS.length||0)+' decisions'],
    ['Suggestions', '/suggestions/', (SUGGS.length||0)+' suggestions'],
    ['Files', '/files/', 'verified file references'],
    ['Investigation Map', '/map/', 'interactive graph'],
    ['Entities', '/entities/', 'full entity index'],
    ['Contributions', '/contributions/', (D.contributions||[]).length+' contributions']
  ].forEach(c=>{ const card=el('a','card phase-card',''); card.href=BASE+c[1]; card.append(el('h3','',c[0])); card.append(el('p','muted',c[2])); cat.append(card); });
  content.append(cat);
}

/* ── repositories ── */
function renderRepos(){
  content.append(el('h1','','Repositories'));
  content.append(el('p','lede','All repositories in the investigation ecosystem. Click for detail.'));
  const g=el('div','grid'); content.append(g);
  (REPOS.length?REPOS:[
    {repo_id:"ix-infrastructure/Ix",role:"upstream",url:"https://github.com/ix-infrastructure/Ix",note:"Primary Ix CLI"},
    {repo_id:"Alot1z/Ix",role:"fork",url:"https://github.com/Alot1z/Ix",fork_of:"ix-infrastructure/Ix",note:"User fork — synced 2026-08-10"},
    {repo_id:"ix-infrastructure/ix-compass-dist",role:"distribution",url:"https://github.com/ix-infrastructure/ix-compass-dist",note:"Distribution — DO NOT MODIFY"},
    {repo_id:"ix-infrastructure/system-compass",role:"source",access:"PRIVATE",note:"Compass UI source — blocked"},
    {repo_id:"Alot1z/Ix-findings",role:"investigation",url:"https://github.com/Alot1z/Ix-findings",note:"This investigation ledger"}
  ]).forEach(r=>{
    const card=el('div','card');
    card.append(el('h3','',(r.repo_id||r.name)+' <span class="tag">'+(r.role||r.access||'')+'</span>'));
    card.append(el('p','muted',r.note||r.url||(r.access==='PRIVATE'?'⚠ PRIVATE — 404':'')||''));
    if(r.fork_of)card.append(el('p','faint','Fork of '+r.fork_of));
    g.append(card);
  });
  content.append(el('h2','','Branch Matrix'));
  const bt=el('table','','<thead><tr><th>Branch</th><th>Repo</th><th>SHA</th><th>State</th></tr></thead><tbody></tbody>');
  BRANCHES.forEach(b=>bt.querySelector('tbody').append(el('tr','','<td class="code">'+b.branch+'</td><td>'+b.repo+'</td><td class="code">'+(b.sha||'—')+'</td><td>'+(b.sync||b.dirty||b.note||'—')+'</td>')));
  content.append(bt);
}

/* ── worktrees ── */
function renderWorktrees(){
  content.append(el('h1','','Worktrees'));
  content.append(el('p','lede','All Git worktrees across the investigation ecosystem.'));
  const ws=typeof WORKTREES==='object'&&!Array.isArray(WORKTREES)?Object.entries(WORKTREES).map(([k,v])=>({name:k,...(typeof v==='object'?v:{sha:v})})):[];
  if(!ws.length){
    const entries=[
      {name:'primary',path:'E:/E-github-repos/Ix',branch:'feat/ix-agent-skill',sha:'b038c46',dirty:14,note:'PROTECTED — active development'},
      {name:'remap',path:'E:/E-github-repos/Ix-remap',branch:'feat/ix-remap-hardening',sha:'c021b52',ahead:1,dirty:0,note:'Pushed to fork — PR-ready'},
      {name:'test',path:'E:/E-github-repos/Ix-test',branch:'detached HEAD',sha:'c4f8fea',dirty:0,note:'Clean test baseline — 646/648 passed'}
    ];
    entries.forEach(w=>{
      const card=el('div','card');
      card.append(el('h3','',w.name+' <span class="tag">'+w.branch+'</span>'));
      card.append(el('p','',kv('Path','[local]')+kv('SHA',w.sha||'—')+kv('State',w.dirty===0?'Clean':'Dirty: '+w.dirty+' files')+(w.ahead?' / Ahead: '+w.ahead:'')));
      card.append(el('p','muted',w.note||''));
      content.append(card);
    });
  }
}

/* ── branches ── */
function renderBranches(){
  content.append(el('h1','','Branches'));
  const t=el('table','','<thead><tr><th>Branch</th><th>Repo</th><th>SHA</th><th>Status</th></tr></thead><tbody></tbody>');
  BRANCHES.forEach(b=>{
    const tr=el('tr','','<td class="code">'+b.branch+'</td><td>'+b.repo+'</td><td class="code">'+(b.sha||'—')+'</td><td>'+(b.sync||b.note||(b.dirty?'Dirty: '+b.dirty:''))+'</td>');
    t.querySelector('tbody').append(tr);
  });
  content.append(t);
}

/* ── commits ── */
function renderCommits(){
  content.append(el('h1','','Commits'));
  const t=el('table','','<thead><tr><th>SHA</th><th>Repo</th><th>Branch/PR</th><th>Message</th></tr></thead><tbody></tbody>');
  COMMITS.forEach(c=>{
    t.querySelector('tbody').append(el('tr','','<td class="code">'+(c.sha||'')+'</td><td>'+(c.repo||'')+'</td><td>'+(c.branch||c.pr||'')+'</td><td>'+(c.msg||'')+'</td>'));
  });
  content.append(t);
}

/* ── releases ── */
function renderReleases(){
  content.append(el('h1','','Releases'));
  content.append(el('p','lede','Compass distribution releases from ix-compass-dist.'));
  const t=el('table','','<thead><tr><th>Tag</th><th>Date</th><th>SHA256 (first 16)</th></tr></thead><tbody></tbody>');
  [
    ['v0.1.0','2026-03-28','19bc427d0eca77b2…'],
    ['v0.1.1','2026-03-29','74e56488c5daf970…'],
    ['v0.2.0','2026-06-08','863583084c91719f…'],
    ['v0.3.0','2026-08-09','7ed6cc82fe58b3ad…']
  ].forEach(r=>t.querySelector('tbody').append(el('tr','',r.map((c,i)=>i?'<td class="code">'+c+'</td>':'<td>'+c+'</td>').join(''))));
  content.append(t);
}

/* ── tests ── */
function renderTests(){
  content.append(el('h1','','Tests'));
  content.append(el('p','lede','Fresh test results from the latest upstream Ix code.'));
  const card=el('div','card');
  if(TESTS.sha){
    card.append(el('h3','','Upstream @ '+TESTS.sha+' ('+TESTS.date+')'));
    card.append(el('p','',kv('Vitest',TESTS.vitest||'—')+kv('Tests',TESTS.tests||'—')+kv('Smoke',TESTS.smoke||'—')+kv('TypeScript',TESTS.tsc||'—')+kv('ESLint',TESTS.eslint||'—')));
  } else {
    card.append(el('h3','','Upstream @ c4f8fea (2026-08-10)'));
    card.append(el('p','',kv('Vitest','49 passed, 1 skipped (50 files)')+kv('Tests','646 passed, 2 skipped (648 total)')+kv('Smoke','passed')+kv('TypeScript','clean')+kv('ESLint','0 errors, 38 warnings')));
  }
  content.append(card);
}

/* ── PRs ── */
function renderPRs(){
  content.append(el('h1','','Pull Requests'));
  const t=el('table','','<thead><tr><th>#</th><th>Title</th><th>State</th><th>SHA</th></tr></thead><tbody></tbody>');
  PRS.forEach(p=>t.querySelector('tbody').append(el('tr','','<td class="code">#'+(p.number||'')+'</td><td>'+(p.title||p.url) +'</td><td>'+(p.state||'')+'</td><td class="code">'+(p.sha||'—')+'</td>')));
  content.append(t);
}

/* ── issues ── */
function renderIssues(){
  content.append(el('h1','','Issues'));
  const t=el('table','','<thead><tr><th>#</th><th>Title</th><th>Finding</th><th>Access</th></tr></thead><tbody></tbody>');
  ISSUES.forEach(i=>t.querySelector('tbody').append(el('tr','','<td class="code">#'+(i.number||'')+'</td><td>'+(i.title||i.url)+'</td><td>'+(i.finding||'—')+'</td><td>'+(i.access||'public')+'</td>')));
  content.append(t);
}

/* ── contributions ── */
function renderContributions(){
  content.append(el('h1','','Contribution Intelligence'));
  content.append(el('p','lede','Every candidate contribution with readiness status, blocker, and next safe action.'));
  CONTRIBS.forEach(c=>{
    const card=el('div','card');
    card.append(el('h3','',c.title+' '+sts(c.status)));
    card.append(el('p','',kv('Repo',c.repo)+kv('Branch',c.branch||'—')+kv('SHA',c.sha||'—')+kv('Files',c.files||'—')+kv('Tests',c.tests||'—')));
    if(c.blocker)card.append(el('p','warn','⛔ Blocker: '+c.blocker));
    card.append(el('p','ok','→ Next: '+(c.nextAction||'—')));
    if(c.packet)card.append(el('p','faint','Packet: '+c.packet));
    content.append(card);
  });
}

/* ── stale claims ── */
function renderStale(){
  content.append(el('h1','','Stale Claims'));
  content.append(el('p','lede','Known discrepancies between earlier investigation reports and live-verified state.'));
  STALE.forEach(s=>{
    const card=el('div','card');
    card.append(el('h3','',s.id));
    card.append(el('p','',s.description||''));
    content.append(card);
  });
}

/* ── system-compass ── */
function renderSysCompass(){
  content.append(el('h1','','System-Compass'));
  content.append(el('p','lede','Current knowledge about the private system-compass repository.'));
  const card=el('div','card');
  card.append(el('h3','','Access: '+SYSCOMPASS.access));
  card.append(el('p','warn','⛔ Source access is BLOCKED. All 7 system-compass findings (F-001–F-007, F-013) are Class B or D — verified from artifacts, not source.'));
  card.append(el('p','',kv('Affected findings',(SYSCOMPASS.findings||[]).join(', '))));
  content.append(card);

  content.append(el('h2','','F-Key Specification'));
  const fk=el('div','card');
  fk.append(el('h3','',sts('SPEC READY')+' F-key: Keyboard exposure of fit-to-viewport'));
  if(SYSCOMPASS.fkey){
    fk.append(el('p','',kv('Estimated lines',SYSCOMPASS.fkey.estimatedLines)+kv('Files',SYSCOMPASS.fkey.filesToChange)+kv('Tests',SYSCOMPASS.fkey.tests)));
    fk.append(el('p','muted','2-line code change: add case "f"/"F" to keyboard handler + KeyboardHelp entry. Reuses existing 0-key fit callback.'));
  }
  content.append(fk);

  content.append(el('h2','','Auto-Frame — EXCLUDED'));
  content.append(el('p','ok','✓ Compass #57 already covers canvas-change refit in v0.3.0. Auto-frame would duplicate existing behavior. F-key PR scope is keyboard exposure only (D-005).'));
}

/* ── findings ── */
function renderFindings(){
  content.append(el('h1','','Findings'));
  content.append(el('p','lede','Filter by evidence class or status.'));
  const state={cls:[],st:'all'};
  const chips=el('div','filters'); content.append(chips);
  const table=el('table','','<thead><tr><th>ID</th><th>Title</th><th>Class</th><th>Repo</th><th>Severity</th><th>Status</th></tr></thead><tbody></tbody>');
  content.append(table);
  ['A','B','C','D'].forEach(cl=>{const c=el('button','chip');c.textContent='class '+cl;c.onclick=()=>{state.cls=state.cls.includes(cl)?state.cls.filter(x=>x!==cl):[...state.cls,cl];draw();};chips.append(c);});
  ['PR_READY','OPEN','REPRODUCED','CONFIRMED','VERIFIED','OBSERVED','IN_REMAP_PR'].forEach(s=>{const c=el('button','chip');c.textContent=s.toLowerCase();c.onclick=()=>{state.st=state.st===s?'all':s;draw();};chips.append(c);});
  function draw(){
    chips.querySelectorAll('.chip').forEach(c=>{if(c.dataset){}else c.classList.toggle('on',c.textContent===state.st||state.cls.includes(c.textContent.replace('class ','')))});
    table.querySelector('tbody').innerHTML='';
    D.findings.forEach(f=>{
      const base=f.evidence_class.split('+')[0];
      if(state.cls.length && !state.cls.includes(base))return;
      if(state.st!=='all'&& !String(f.status).toLowerCase().includes(state.st.toLowerCase()))return;
      const tr=el('tr','','<td class="code">'+f.id+'</td><td>'+f.title+'</td><td>'+ec(base)+(f.evidence_class.includes('+')?' +':'')+'</td><td>'+f.repository+'</td><td>'+(f.severity||'—')+'</td><td>'+sts(f.status)+'</td>');
      tr.onclick=()=>openEntity(f.id,'finding');
      table.querySelector('tbody').append(tr);
    });
  }
  draw();
}

/* ── evidence ── */
function renderEvidence(){
  content.append(el('h1','','Evidence'));
  const t=el('table','','<thead><tr><th>ID</th><th>Item</th><th>Class</th><th>Kind</th><th>Supports</th></tr></thead><tbody></tbody>');
  content.append(t);
  D.evidence.forEach(e=>{
    const tr=el('tr','','<td class="code">'+e.id+'</td><td>'+e.title+'</td><td>'+ec(e.class)+'</td><td>'+e.kind+'</td><td>'+(e.supports||[]).join(' · ')+'</td>');
    tr.onclick=()=>openEntity(e.id,'evidence');
    t.querySelector('tbody').append(tr);
  });
}

/* ── timeline ── */
function renderTimeline(){
  content.append(el('h1','','Timeline'));
  const tl=el('div','tl'); content.append(tl);
  (D.timeline||[]).slice().sort((a,b)=>a.date<b.date?-1:1).forEach(e=>{
    const it=el('div','tl-item '+(e.type||''));
    it.append(el('div','tl-date',e.date));
    it.append(el('div','tl-title',e.title));
    it.append(el('div','tl-meta',(e.repo||'')+(e.category?' · '+e.category:'')));
    tl.append(it);
  });
}

/* ── compass history ── */
function renderCompass(){
  content.append(el('h1','','Compass History'));
  const rows=[
    ['Keyboard switch','same','same','same','same'],
    ['KeyboardHelp','same','same','same','same'],
    ['F/f binding','none','none','none','none'],
    ['Fit math','same','same','same','same'],
    ['Fit lifecycle','latch','latch','latch','keyed refit (#57)'],
    ['Delayed-data','present','present','present','present'],
    ['Source maps','none','none','none','none']
  ];
  const t=el('table','','<thead><tr><th>Area</th><th>v0.1.0</th><th>v0.1.1</th><th>v0.2.0</th><th>v0.3.0</th></tr></thead><tbody></tbody>');
  rows.forEach(r=>t.querySelector('tbody').append(el('tr','',r.map((c,i)=>i?'<td class="code">'+c+'</td>':'<td>'+c+'</td>').join(''))));
  content.append(t);
}

/* ── phases ── */
function renderPhases(){
  content.append(el('h1','','Phases'));
  const g=el('div','grid'); content.append(g);
  D.phases.forEach(p=>{
    const card=el('div','card phase-card');
    card.onclick=()=>openEntity(p.id,'phase');
    card.append(el('div','cat',p.category+' · '+p.status));
    card.append(el('h3','',p.number+' — '+p.title));
    card.append(el('p','muted',(p.objective||'').slice(0,120)+'…'));
    g.append(card);
  });
}

/* ── suggestions ── */
function renderSuggestions(){
  content.append(el('h1','','Suggestions'));
  ['ACCEPTED','DEFERRED','REJECTED','SUPERSEDED'].forEach(ds=>{
    const set=D.suggestions.filter(s=>s.disposition===ds);
    if(!set.length)return;
    content.append(el('h2','',ds+' ('+set.length+')'));
    const t=el('table','','<thead><tr><th>ID</th><th>Suggestion</th><th>Repo</th><th>Reason</th></tr></thead><tbody></tbody>');
    set.forEach(s=>{const tr=el('tr','','<td class="code">'+s.id+'</td><td>'+s.text+'</td><td>'+s.repository+'</td><td>'+s.reason+'</td>');tr.onclick=()=>openEntity(s.id,'suggestion');t.querySelector('tbody').append(tr);});
    content.append(t);
  });
}

/* ── decisions ── */
function renderDecisions(){
  content.append(el('h1','','Decisions'));
  const decided=D.decisions.filter(d=>String(d.status).startsWith('DECIDED'));
  const open=D.decisions.filter(d=>d.status==='OPEN');
  content.append(el('h2','','Decided ('+decided.length+')'));
  const t=el('table','','<thead><tr><th>ID</th><th>Decision</th><th>Chosen</th></tr></thead><tbody></tbody>');
  decided.forEach(d=>{const tr=el('tr','','<td class="code">'+d.id+'</td><td>'+d.title+'</td><td>'+d.chosen+'</td>');tr.onclick=()=>openEntity(d.id,'decision');t.querySelector('tbody').append(tr);});
  content.append(t);
  if(open.length){
    content.append(el('h2','','Open ('+open.length+')'));
    const ot=el('table','','<thead><tr><th>ID</th><th>Decision</th><th>Recommended</th></tr></thead><tbody></tbody>');
    open.forEach(d=>{const tr=el('tr','','<td class="code">'+d.id+'</td><td>'+d.title+'</td><td>'+d.reason+'</td>');tr.onclick=()=>openEntity(d.id,'decision');ot.querySelector('tbody').append(tr);});
    content.append(ot);
  }
}

/* ── security ── */
function renderSecurity(){
  content.append(el('h1','','Security'));
  content.append(el('h2','','/__ix/remap Guard Matrix'));
  const g=el('table','','<thead><tr><th>Check</th><th>Result</th></tr></thead><tbody></tbody>');
  [['Loopback bind','127.0.0.1 ✓'],['Host whitelist','localhost/127.0.0.1/[::1] ✓'],['DNS-rebinding','403 ✓'],['Cross-site CSRF','403 ✓'],['Malformed Origin','403 ✓']].forEach(r=>g.querySelector('tbody').append(el('tr','','<td>'+r[0]+'</td><td class="ok">'+r[1]+'</td>')));
  content.append(g);
}

/* ── about ── */
function renderAbout(){
  content.append(el('h1','','About'));
  content.append(el('p','lede','IX Compass Knowledge Explorer — generated from machine-readable registries. Works fully offline (file://, no server, no network).'));
  const m=D.meta||{};
  content.append(el('h2','','Data Freshness'));
  content.append(el('p','','Generated: '+m.generated+' · Revision: '+m.sourceRevision+' · '+m.entityCounts?.findings+' findings · '+m.entityCounts?.graphNodes+' graph nodes · '+m.entityCounts?.evidence+' evidence'));
  content.append(el('h2','','Privacy'));
  content.append(el('p','muted','No real filesystem paths, credentials, tokens, or private source exposed. Public maintainer handles retained as needed for contribution context.'));
}

/* ── map view ── */
function renderMap(){
  content.append(el('h1','','Investigation Map'));
  content.append(el('p','lede','Drag to pan, wheel to zoom, click a node to open its canonical page. '+(GRAPH.nodes||[]).length+' nodes, '+(GRAPH.edges||[]).length+' edges.'));
  const mw=el('div',''); mw.id='map-wrap';
  const legend=el('div','map-legend');
  [['finding','Finding'],['evidence','Evidence'],['repository','Repo'],['commit','Commit'],['issue','Issue'],['pr','PR'],['phase','Phase']].forEach(([t,l])=>{legend.append(el('span','map-key','<span class="dot" style="background:'+(TYPE_COLOR[t]||'#888')+'\"></span>'+l));});
  mw.append(legend);
  mw.append(el('div','map-hint','drag=pan · wheel=zoom · click=open page · dblclick=centre'));
  mw.append(el('div','map-ncount',(GRAPH.nodes||[]).length+' nodes · '+(GRAPH.edges||[]).length+' edges'));
  content.append(mw);

  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg'); svg.id='graph';
  const vp=document.createElementNS(NS,'g'); vp.id='viewport';
  const zedge=document.createElementNS(NS,'g'); zedge.id='zedge';
  const znode=document.createElementNS(NS,'g'); znode.id='znode';
  vp.append(zedge,znode); svg.append(vp);
  mw.append(svg);
  const W=mw.clientWidth,H=mw.clientHeight;

  const nodes=GRAPH.nodes||[], edges=GRAPH.edges||[];
  const order=['person','repository','branch','commit','worktree','issue','pr','pr_packet','phase','decision','suggestion','evidence','finding','test','release'];
  const cols={};order.forEach((t,i)=>cols[t]=i);
  const perCol={};nodes.forEach(n=>{perCol[n.type]=(perCol[n.type]||0)+1;});
  const colW=Math.max(150,W*0.9/order.length);
  const counts={},pos={};
  nodes.forEach(n=>{
    const c=cols[n.type]??order.length;
    const i=counts[n.type]=(counts[n.type]||0)+1;
    pos[n.id]={x:colW*(c+0.5),y:H*(i/((perCol[n.type]||1)+1))+(c%2?14:-14)};
  });
  let bx=Infinity,by=Infinity,Bx=-Infinity,By=-Infinity;
  Object.values(pos).forEach(p=>{if(p.x<bx)bx=p.x;if(p.x>Bx)Bx=p.x;if(p.y<by)by=p.y;if(p.y>By)By=p.y;});
  const pad=48;bx-=pad;by-=pad;Bx+=pad;By+=pad;
  svg.setAttribute('viewBox',[bx,by,Bx-bx,By-by].join(' '));
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.setAttribute('width','100%'); svg.setAttribute('height',Math.max(320,H)+'px');

  edges.forEach(e=>{
    const a=pos[e.source],b=pos[e.target]; if(!a||!b)return;
    const l=document.createElementNS(NS,'line');
    l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y);
    l.setAttribute('class','edge');l.dataset.s=e.source;l.dataset.t=e.target;
    zedge.append(l);
  });
  const nodesEl={};
  nodes.forEach(n=>{
    const p=pos[n.id]; if(!p)return;
    const g=document.createElementNS(NS,'g');g.setAttribute('class','node');g.dataset.id=n.id;
    const r=n.type==='finding'?8:(n.type==='evidence'?6:(n.type==='phase'?7:5));
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',r);
    c.setAttribute('fill',TYPE_COLOR[n.type]||'#8899aa');
    g.append(c);
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',p.x+r+3);t.setAttribute('y',p.y+3);
    t.textContent=n.title.length>50?n.title.slice(0,47)+'…':n.title;
    g.append(t);
    g.onclick=()=>{ window.location.href = canonicalUrlOf(n.id); };
    g.onmouseenter=()=>{ Graph.nodes.forEach(n2=>{const g2=nodesEl[n2.id];if(g2)g2.classList.toggle('dim',n2.id!==n.id&&!edges.some(e=>(e.source===n.id&&e.target===n2.id)||(e.target===n.id&&e.source===n2.id)));});zedge.querySelectorAll('line').forEach(l=>l.classList.toggle('focus',l.dataset.s===n.id||l.dataset.t===n.id));};
    g.onmouseleave=()=>{Graph.nodes.forEach(n2=>{const g2=nodesEl[n2.id];if(g2)g2.classList.remove('dim');});zedge.querySelectorAll('line').forEach(l=>l.classList.remove('focus'));};
    g.ondblclick=resetTransform;
    znode.append(g);nodesEl[n.id]=g;
  });

  let tx=0,ty=0,scale=1;
  function apply(){svg.querySelector('#viewport').setAttribute('transform','translate('+tx+','+ty+') scale('+scale+')');}
  let drag=null;
  svg.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ox:tx,oy:ty};svg.classList.add('dragging');});
  window.addEventListener('pointermove',e=>{if(!drag)return;tx=drag.ox+(e.clientX-drag.x);ty=drag.oy+(e.clientY-drag.y);apply();});
  window.addEventListener('pointerup',()=>{drag=null;svg.classList.remove('dragging');});
  svg.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(0.2,Math.min(4,scale*(e.deltaY<0?1.12:0.89)));apply();},{passive:false});
  function resetTransform(){tx=16;ty=16;scale=1;apply();}
  resetTransform();
}

/* ── search ── */
const searchEl=$('#search');
function doSearch(q){
  q=q.trim().toLowerCase(); if(!q)return;
  const results=[];
  const add=(id,type,label,extra)=>{if(results.length<50)results.push({id,type,label,extra});};
  D.findings.forEach(f=>{if((f.id+' '+f.title+' '+f.repository).toLowerCase().includes(q))add(f.id,'finding',f.title,f.status);});
  D.evidence.forEach(e=>{if((e.id+' '+e.title+' '+e.kind).toLowerCase().includes(q))add(e.id,'evidence',e.title,e.class);});
  D.suggestions.forEach(s=>{if((s.id+' '+s.text).toLowerCase().includes(q))add(s.id,'suggestion',s.text.slice(0,80),s.disposition);});
  D.decisions.forEach(d=>{if((d.id+' '+d.title).toLowerCase().includes(q))add(d.id,'decision',d.title,d.status);});
  D.phases.forEach(p=>{if((p.id+' '+p.title+(p.objective||'')).toLowerCase().includes(q))add(p.id,'phase',p.title);});
  COMMITS.forEach(c=>{if((c.sha||'').toLowerCase().startsWith(q)||(c.msg||'').toLowerCase().includes(q))add(c.sha||c.pr,'commit',c.msg||'',c.repo);});
  BRANCHES.forEach(b=>{if((b.branch||'').toLowerCase().includes(q)||(b.sha||'').toLowerCase().startsWith(q))add(b.branch,'branch',b.repo||'',b.sha);});
  PRS.forEach(p=>{if(('#'+p.number).includes(q)||(p.title||'').toLowerCase().includes(q))add('PR#'+p.number,'pr',p.title||'',p.state);});
  CONTRIBS.forEach(c=>{if(c.title.toLowerCase().includes(q))add(c.id,'contribution',c.title,c.status);});
  STALE.forEach(s=>{if(s.id.toLowerCase().includes(q))add(s.id,'stale_claim',s.description||'');});
  REPOS.forEach(r=>{if((r.repo_id||r.name||'').toLowerCase().includes(q))add(r.repo_id||r.name,'repository',r.role||r.note||'');});

  const w=el('div','');
  w.append(el('h2','','Search: '+q+' ('+results.length+' results)'));
  if(!results.length)w.append(el('p','muted','No matches.'));
  results.forEach(r=>{
    const a=el('a','link','');a.textContent=r.id+' — '+r.label+(r.extra?' ['+r.extra+']':'');a.style.display='block';a.style.marginBottom='6px';
    a.onclick=()=>openCanonical(r.id,r.type);
    w.append(a);
  });
  content.innerHTML=''; content.append(w);
}
searchEl.addEventListener('input',()=>{const q=searchEl.value;if(q.trim())doSearch(q);else render();});
searchEl.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();doSearch(searchEl.value);}});

render();

/* Deep-link bridge — exposes the minimal app API to assets/sections.js. */
window.IX_APP = { setView, render, openEntity, content, closeDrawer };
})();
