/* Ix / Compass investigation knowledge wiki — reads window.IX_DATA (data/data.js). */
(function(){
"use strict";
const D = window.IX_DATA;
const $ = (s)=>(document.querySelector(s));
const el = (tag,cls,html)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(html!=null)n.innerHTML=html;return n;};

const TYPE_COLOR = {
  phase:"#5aa8ff", repository:"#e0b25a", branch:"#c9a96a", commit:"#8a9bb0",
  issue:"#e06a6a", pr:"#e07a5a", pr_packet:"#ff9d5c", finding:"#5fd0a8",
  evidence:"#7fd0ff", decision:"#b48ae0", suggestion:"#8fd0c0", person:"#d8c8a0"
};
const ECLASS = {A:["A","◼"],B:["B","◈"],C:["C","△"],D:["D","○"]};
const ECLASS_MEAN = {A:"source",B:"artifact/runtime",C:"reconstruction",D:"inference"};

function eclass(id){return '<span class="eclass '+id+'" data-g="'+ECLASS[id][1]+'" title="'+ECLASS[id][0]+': '+ECLASS_MEAN[id]+'">'+ECLASS[id][0]+'</span>';}
function disp(x){return '<span class="disposition '+(x||'').toLowerCase()+'">'+(x||'')+'</span>';}
function status(x){const c=String(x||'').toLowerCase();let k='';if(c.includes('pr_ready')||c.includes('ready'))k=' pr-ready';else if(c.includes('open')||c.includes('block'))k=' open';else if(c.includes('repro')||c.includes('confirm')||c.includes('verified'))k=' reproduced';return '<span class="badge-status'+k+'">'+(x||'')+'</span>';}

const FINDINGS = Object.fromEntries(D.findings.map(f=>[f.id,f]));
const EVIDENCE = Object.fromEntries(D.evidence.map(e=>[e.id,e]));
const SUGGS = Object.fromEntries(D.suggestions.map(s=>[s.id,s]));
const DECS = Object.fromEntries(D.decisions.map(d=>[d.id,d]));
const PHASES = Object.fromEntries(D.phases.map(p=>[p.id,p]));
const GRAPH = D.graph;
const NODES = Object.fromEntries(GRAPH.nodes.map(n=>[n.id,n]));

/* ---------- navigation ---------- */
let currentView="map"; let crumbStack=[];
function setView(v){currentView=v;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));crumbStack=[];renderBreadcrumb();render();}
function pushCrumb(){crumbStack.push(currentView);}
function renderBreadcrumb(){
  const b=$('#breadcrumb');b.innerHTML='';
  const home=el('span','crumb','✳ home');home.onclick=()=>{crumbStack=[];$('#search').value='';render();};b.append(home);
  ['',currentView].forEach((c,i)=>{
    b.append(el('span','sep',' / '));
    const s=el('span','crumb',c||'overview');
    s.onclick=()=>{crumbStack=crumbStack.slice(0,i-1);render();};
    b.append(s);
  });
}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#drawer-close').onclick=closeDrawer;

const content=$('#content');
function openDrawer(title,body){$('#drawer-title').textContent=title;$('#drawer-body').innerHTML='';$('#drawer-body').append(body);$('#drawer').classList.add('open');}
function closeDrawer(){$('#drawer').classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});

function chip(label,id,type){const a=el('a','link','');a.textContent=label;a.onclick=()=>openEntity(id,type);return a;}
function relationList(ids,type){if(!ids||!ids.length)return el('span','faint','none');const w=el('span','rel');ids.forEach(id=>{w.append(chip(id,id,type||(NODES[id]?NODES[id].type:null)));});return w;}

function openEntity(id,type){
  type=type||(NODES[id]&&NODES[id].type);
  let body;
  if(FINDINGS[id])body=findBody(FINDINGS[id]);
  else if(EVIDENCE[id])body=evidBody(EVIDENCE[id]);
  else if(SUGGS[id])body=sugBody(SUGGS[id]);
  else if(DECS[id])body=decBody(DECS[id]);
  else if(PHASES[id])body=phaseBody(PHASES[id]);
  else if(NODES[id])body=nodeBody(NODES[id]);
  else body=el('p','muted','No record for '+id+'.');
  openDrawer(id,body);
  if(type==='finding'||type==='evidence'||type==='phase')pushCrumb();
}

function section(title,node){const w=el('div');w.append(el('h3','',title));w.append(node);return w;}
function kv(title,val){return '<p><span class="faint">'+title+':</span> '+(val??'—')+'</p>';}

function findBody(f){
  const w=el('div');
  w.append(el('p','',eclass(f.evidence_class.split('+')[0])+' '+status(f.status)+' <span class="tag">'+f.repository+'</span>'));
  w.append(el('p','muted',(f.ixf_id?('alias '+f.ixf_id+' · '):'')+'evidence '+(f.confidence?('· confidence '+f.confidence):'')+(f.severity?(' · severity '+f.severity):'')));
  w.append(el('p','',kv('Subsystem',f.subsystem)+kv('Affected versions',(f.affected_versions||[]).join(', '))+kv('Phases',(f.first_phase||'')+' → '+(f.latest_phase||''))));
  w.append(section('Reproduction',el('p','',f.reproduction||'—')));
  w.append(section('Supporting evidence',relationList(f.evidence_refs,'evidence')));
  w.append(section('Related issues',relationList(f.related_issues,'issue')));
  w.append(section('Related PRs',relationList(f.related_prs,'pr_packet')));
  w.append(section('Related suggestions',relationList(f.related_suggestions,'suggestion')));
  if(f.alternative)w.append(section('Alternative explanations',el('p','',f.alternative)));
  w.append(section('Recommendation',el('p','',f.recommendation)));
  w.append(section('Why this matters',el('p','muted','Traced from '+f.evidence_class+' evidence'+(f.evidence_refs?' ('+f.evidence_refs.join(', ')+')':'')+'. Full record: planning/findings/registry.md.')));
  return w;
}
function evidBody(e){
  const w=el('div');
  w.append(el('p','',eclass(e.class)+' <span class="tag">'+e.kind+'</span> <span class="tag">'+e.repository+'</span>'));
  w.append(el('p','',e.detail||''));
  w.append(section('Supports findings',relationList(e.supports,'finding')));
  w.append(section('Provenance',el('p','muted','Registered in '+e.phase+'. Canonical: planning/evidence/registry.md.')));
  return w;
}
function sugBody(s){
  const w=el('div');
  w.append(el('p','',disp(s.disposition)+' <span class="tag">'+s.repository+'</span> <span class="tag">'+s.phase+'</span>'));
  w.append(el('p','',s.text));
  w.append(section('Reason',el('p','',s.reason||'—')));
  w.append(section('Evidence cited',relationList(s.evidence_refs,'evidence')));
  w.append(section('Related findings',relationList(s.related_findings,'finding')));
  return w;
}
function decBody(d){
  const w=el('div');
  w.append(el('p','',status(d.status)+' <span class="tag">'+(d.dec_alias||'')+'</span>'));
  w.append(el('p','',d.title));
  w.append(el('p','',kv('Problem',d.problem)+kv('Options',(d.options||[]).join(' · '))+kv('Chosen',d.chosen||'<span class="faint">(pending)</span>')+kv('Rejected',(d.rejected||[]).join(' · '))+kv('Reason',d.reason)+kv('Consequences',d.consequences||'—')));
  w.append(section('Related findings',relationList(d.related_findings,'finding')));
  w.append(section('Related suggestions',relationList(d.related_suggestions,'suggestion')));
  return w;
}
function phaseBody(p){
  const w=el('div');
  w.append(el('p','',status(p.status)+' <span class="tag">'+p.category+'</span>'));
  w.append(el('p','',p.objective||''));
  w.append(section('Key findings',el('div','',(p.key_findings||[]).map(k=>'<p>· '+k+'</p>').join(''))));
  w.append(section('Outputs',el('p','',(p.outputs||[]).join(' · ')||'—')));
  w.append(section('Dependencies',el('p','',(p.dependencies||[]).join(' · ')||'—')));
  w.append(section('Next phase',el('p','',p.next_phase||'—')));
  return w;
}
function nodeBody(n){
  const w=el('div');
  const meta=Object.entries(n).filter(([k])=>!['id','type','title'].includes(k))
    .map(([k,v])=>kv(k,typeof v==='object'?JSON.stringify(v):v)).join('');
  w.append(el('p','',meta||el('span','faint','no metadata')));
  const inn=GRAPH.edges.filter(e=>e.target===n.id);
  const out=GRAPH.edges.filter(e=>e.source===n.id);
  if(inn.length){w.append(section('Incoming',relationList(inn.map(e=>e.source))));}
  if(out.length){w.append(section('Relationships out',el('p','',out.map(e=>'<span class="rel">'+e.source+' <span class="faint">'+e.relationship+'</span> '+e.target+'</span>').join(' '))));}
  return w;
}

/* ---------- render dispatch ---------- */
function render(){
  content.innerHTML='';
  content.scrollTop=0;
  const v=currentView;
  if(v==='map')renderMap();
  else if(v==='timeline')renderTimeline();
  else if(v==='repositories')renderRepos();
  else if(v==='phases')renderPhases();
  else if(v==='findings')renderFindings();
  else if(v==='evidence')renderEvidence();
  else if(v==='compass')renderCompass();
  else if(v==='prmap')renderPRMap();
  else if(v==='suggestions')renderSuggestions();
  else if(v==='decisions')renderDecisions();
  else if(v==='security')renderSecurity();
  else if(v==='about')renderAbout();
}

/* ---------- map view ---------- */
function renderMap(){
  content.append(el('h1','','Investigation Map'));
  content.append(el('p','lede','Every phase, repository, finding, evidence item, issue, PR, commit, decision, and suggestion as a node. Select a node to trace it; hover to highlight relationships. Drag to pan, wheel to zoom, double-click to centre.'));
  const host=el('div','','<div id="map-wrap"></div>');
  content.append(host);
  const mw=$('#map-wrap');
  const legend=el('div','map-legend');
  [['phase','Phase'],['repository','Repository'],['finding','Finding'],['evidence','Evidence'],['issue','Issue'],['pr','PR'],['pr_packet','Packet'],['commit','Commit'],['decision','Decision'],['suggestion','Suggestion'],['person','Person']].forEach(([t,l])=>{
    legend.append(el('span','map-key','<span class="dot" style="background:'+TYPE_COLOR[t]+'"></span>'+l));});
  mw.append(legend);
  mw.append(el('div','map-hint','drag = pan · wheel = zoom · click = detail · double-click = centre'));
  mw.append(el('div','map-ncount',GRAPH.nodes.length+' nodes · '+GRAPH.edges.length+' edges'));
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg');svg.id='graph';
  const vp=document.createElementNS(NS,'g');vp.id='viewport';
  const zedge=document.createElementNS(NS,'g');zedge.id='zedge';
  const znode=document.createElementNS(NS,'g');znode.id='znode';
  vp.append(zedge,znode);svg.append(vp);
  mw.append(svg);
  const W=mw.clientWidth,H=mw.clientHeight;

  const order=['person','repository','branch','commit','issue','pr','pr_packet','phase','decision','suggestion','evidence','finding'];
  const cols={};order.forEach((t,i)=>cols[t]=i);
  const perCol={};GRAPH.nodes.forEach(n=>{perCol[n.type]=(perCol[n.type]||0)+1;});
  const colW=Math.max(170,W*0.92/order.length);
  const counts={};const pos={};
  GRAPH.nodes.forEach(n=>{
    const c=cols[n.type]??order.length;
    const i=counts[n.type]=(counts[n.type]||0)+1;
    const total=perCol[n.type]||1;
    pos[n.id]={x:colW*(c+0.5), y:H*(i/(total+1))+(c%2?16:-16)};
  });
  let bx=Infinity,by=Infinity,Bx=-Infinity,By=-Infinity;
  Object.values(pos).forEach(p=>{if(p.x<bx)bx=p.x;if(p.x>Bx)Bx=p.x;if(p.y<by)by=p.y;if(p.y>By)By=p.y;});
  const pad=48;bx-=pad;by-=pad;Bx+=pad;By+=pad;
  svg.setAttribute('viewBox',[bx,by,Bx-bx,By-by].join(' '));
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.setAttribute('width','100%');
  svg.setAttribute('height',Math.max(320,mw.clientHeight)+'px');

  GRAPH.edges.forEach(e=>{
    const a=pos[e.source],b=pos[e.target];if(!a||!b)return;
    const l=document.createElementNS(NS,'line');
    l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y);
    l.setAttribute('class','edge');l.dataset.s=e.source;l.dataset.t=e.target;
    zedge.append(l);
  });
  const nodesEl={};
  GRAPH.nodes.forEach(n=>{
    const p=pos[n.id];if(!p)return;
    const g=document.createElementNS(NS,'g');g.setAttribute('class','node');g.dataset.id=n.id;
    const r=n.type==='finding'?8:(n.type==='evidence'?6:(n.type==='phase'?7:5));
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',r);
    c.setAttribute('fill',TYPE_COLOR[n.type]||'#8899aa');
    g.append(c);
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',p.x+r+3);t.setAttribute('y',p.y+3);t.textContent=n.title;
    g.append(t);
    g.onclick=()=>openEntity(n.id,n.type);
    g.onmouseenter=()=>focusNeighbors(n.id);
    g.onmouseleave=focusClear;
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

  function focusNeighbors(id){
    const set=new Set([id]);GRAPH.edges.forEach(e=>{if(e.source===id)set.add(e.target);if(e.target===id)set.add(e.source);});
    GRAPH.nodes.forEach(n=>{const g=nodesEl[n.id];if(g)g.classList.toggle('dim',!set.has(n.id));});
    zedge.querySelectorAll('line').forEach(l=>l.classList.toggle('focus',l.dataset.s===id||l.dataset.t===id));
  }
  function focusClear(){GRAPH.nodes.forEach(n=>{const g=nodesEl[n.id];if(g)g.classList.remove('dim');});zedge.querySelectorAll('line').forEach(l=>l.classList.remove('focus'));}
}

/* ---------- timeline ---------- */
function renderTimeline(){
  content.append(el('h1','','Timeline'));
  content.append(el('p','lede','Chronological investigation timeline. Filter by event type.'));
  const chips=el('div','filters');content.append(chips);
  let f='all';
  ['all','release','phase','github'].forEach(t=>{const c=el('button','chip'+(f===t?' on':''));c.textContent=t;c.onclick=()=>{f=t;chips.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x.textContent===f));draw();};chips.append(c);});
  const list=el('div','');content.append(list);
  function draw(){
    list.innerHTML='';
    D.timeline.filter(e=>f==='all'||e.type===f).slice().sort((a,b)=>a.date<b.date?-1:1).forEach(e=>{
      const it=el('div','tl-item '+e.type+(e.blocked?' blocked':''));
      it.append(el('div','tl-date',e.date));
      it.append(el('div','tl-title',e.title));
      it.append(el('div','tl-meta',(e.repo||'')+(e.category?(' · '+e.category):'')+(e.evidence?(' · '+e.evidence):'')));
      list.append(it);
    });
  }
  draw();
}

/* ---------- repositories ---------- */
function renderRepos(){
  content.append(el('h1','','Repositories'));
  content.append(el('p','lede','The five repositories, their state, and fork relationships.'));
  const grid=el('div','grid');content.append(grid);
  const cards=[
    {id:'repo-ix',t:'ix-infrastructure/Ix',s:'source · public',d:'The ix CLI. origin=upstream, fork=Alot1z/Ix. Two worktrees: feat/ix-agent-skill (13 uncommitted files) and feat/ix-remap-hardening (c021b52).'},
    {id:'repo-fork',t:'Alot1z/Ix',s:'fork · public',d:'fork/main @ 0437abf — 5 behind origin, not pushed. fork feat/ix-agent-skill @ 0c9087c (cleanup, not local).'},
    {id:'repo-dist',t:'ix-compass-dist',s:'distribution · public',d:'README-only release channel; tags v0.1.0–v0.3.0; artifacts are release assets; never modify (D-007).'},
    {id:'repo-sc',t:'system-compass',s:'source · PRIVATE',d:'The Compass UI source. Private/404 — no checkout. All Compass PR work blocked on access (D-014).'},
    {id:'repo-findings',t:'Ix-findings',s:'investigation · local',d:'This ledger + planning layer. Git-initialized, zero commits; commit pending review (S-015).'}
  ];
  cards.forEach(c=>{const card=el('div','card');card.onclick=()=>openEntity(c.id,'repository');card.append(el('h3','',c.t+' <span class="tag">'+c.s+'</span>'));card.append(el('p','muted',c.d));grid.append(card);});
  content.append(el('h2','','Branches · verified 2026-08-10'));
  const t=el('table','','<thead><tr><th>Branch</th><th>Repo</th><th>HEAD</th><th>vs origin/main</th><th>State</th></tr></thead><tbody></tbody>');
  [['main','repo-ix','c4f8fea','0 / 0','synced'],['feat/ix-agent-skill','repo-ix','b038c46','1 ahead, 10 behind','13 uncommitted files'],['feat/ix-remap-hardening','repo-ix','c021b52','1 ahead, 0 behind','PR-ready · NOT pushed'],['fork/main','repo-fork','0437abf','5 behind','not pushed'],['fork feat/ix-agent-skill','repo-fork','0c9087c','—','cleanup · not local'],['dist main','repo-dist','396426b','—','clean']]
    .forEach(r=>t.querySelector('tbody').append(el('tr','','<td class="code">'+r[0]+'</td><td>'+r[1]+'</td><td class="code">'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td>')));
  content.append(t);
}

/* ---------- phases ---------- */
function renderPhases(){
  content.append(el('h1','','Phase Explorer'));
  content.append(el('p','lede','Every investigation phase, independently openable.'));
  const grid=el('div','grid');content.append(grid);
  D.phases.slice().forEach(p=>{
    const card=el('div','card phase-card');
    card.onclick=()=>openEntity(p.id,'phase');
    card.append(el('div','cat',p.category+' · '+p.status));
    card.append(el('h3','',p.number+' — '+p.title));
    card.append(el('p','muted',(p.objective||'').slice(0,130)+'…'));
    grid.append(card);
  });
}

/* ---------- findings ---------- */
function renderFindings(){
  content.append(el('h1','','Findings'));
  content.append(el('p','lede','Filter by evidence class or status. Evidence class is shown by label + glyph + border — never colour alone.'));
  const state={cls:[],st:'all'};
  const chips=el('div','filters');content.append(chips);
  const table=el('table','','<thead><tr><th>ID</th><th>Title</th><th>Class</th><th>Repo</th><th>Severity</th><th>Status</th></tr></thead><tbody></tbody>');
  content.append(table);
  ['A','B','C','D'].forEach(cl=>{const c=el('button','chip');c.textContent='class '+cl;c.dataset.cls=cl;c.onclick=()=>{state.cls=state.cls.includes(cl)?state.cls.filter(x=>x!==cl):[...state.cls,cl];draw();};chips.append(c);});
  ['PR_READY','OPEN','REPRODUCED','CONFIRMED','VERIFIED','OBSERVED','IN_REMAP_PR'].forEach(s=>{const c=el('button','chip');c.textContent=s.toLowerCase();c.dataset.st=s.toLowerCase();c.onclick=()=>{state.st=state.st===s?'all':s;draw();};chips.append(c);});
  function draw(){
    chips.querySelectorAll('.chip').forEach(c=>{if(c.dataset.cls)c.classList.toggle('on',state.cls.includes(c.dataset.cls));else c.classList.toggle('on',state.st===c.dataset.st);});
    table.querySelector('tbody').innerHTML='';
    D.findings.forEach(f=>{
      const base=f.evidence_class.split('+')[0];
      if(state.cls.length && !state.cls.includes(base))return;
      if(state.st!=='all'&& !String(f.status).toLowerCase().includes(state.st))return;
      const tr=el('tr','','<td class="code">'+f.id+'</td><td>'+f.title+'</td><td>'+eclass(base)+(f.evidence_class.includes('+')?' +':'')+'</td><td>'+f.repository+'</td><td>'+(f.severity||'—')+'</td><td>'+status(f.status)+'</td>');
      tr.onclick=()=>openEntity(f.id,'finding');
      table.querySelector('tbody').append(tr);
    });
  }
  draw();
}

/* ---------- evidence ---------- */
function renderEvidence(){
  content.append(el('h1','','Evidence'));
  content.append(el('p','lede','Navigate Finding → Evidence → Reproduction → Result. Each item lists the findings it supports.'));
  const t=el('table','','<thead><tr><th>ID</th><th>Item</th><th>Class</th><th>Kind</th><th>Supports</th></tr></thead><tbody></tbody>');
  content.append(t);
  D.evidence.forEach(e=>{
    const tr=el('tr','','<td class="code">'+e.id+'</td><td>'+e.title+'</td><td>'+eclass(e.class)+'</td><td>'+e.kind+'</td><td>'+(e.supports||[]).join(' · ')+'</td>');
    tr.onclick=()=>openEntity(e.id,'evidence');
    t.querySelector('tbody').append(tr);
  });
}

/* ---------- compass ---------- */
function renderCompass(){
  content.append(el('h1','','Compass History'));
  content.append(el('p','lede','Behavioral comparison across v0.1.0 → v0.3.0. (A) = release notes, (B) = artifact/runtime.'));
  const rows=[
    ['Keyboard switch + guards','same','same','same','same'],
    ['KeyboardHelp array','same','same','same','same'],
    ['F/f binding','none','none','none','none'],
    ['Fit math + 9 constants','same','same','same','same'],
    ['Zoom contract (×1.1 / ×0.9 / 2.5)','same','same','same','same'],
    ['Fit lifecycle','latch','latch','latch','keyed refit (#57)'],
    ['Delayed-data blank','present','present','present','present'],
    ['Region rollup','—','—','timing-dep','timing-dep'],
    ['Bounded layout (gravity + cutoff)','—','—','—','✓ (A)'],
    ['Aggregation 1,471→33','—','—','—','✓ (A)'],
    ['Searchable roll-ups / breadcrumb collapse','—','—','—','✓ (A)'],
    ['Source maps','none','none','none','none']
  ];
  const t=el('table','','<thead><tr><th>Area</th><th>v0.1.0</th><th>v0.1.1</th><th>v0.2.0</th><th>v0.3.0</th></tr></thead><tbody></tbody>');
  rows.forEach(r=>t.querySelector('tbody').append(el('tr','',r.map((c,i)=>i?'<td class="code">'+c+'</td>':'<td>'+c+'</td>').join(''))));
  content.append(t);
  content.append(el('h2','','Releases'));
  const rt=el('table','','<thead><tr><th>Tag</th><th>Date</th><th>By</th><th>SHA256</th></tr></thead><tbody></tbody>');
  [['v0.1.0','2026-03-28','TannerTorrey3','19bc427d0eca77b2…'],['v0.1.1','2026-03-29','TannerTorrey3','74e56488c5daf970…'],['v0.2.0','2026-06-08','TannerTorrey3','863583084c91719f…'],['v0.3.0','2026-08-09','KageBinary','7ed6cc82fe58b3ad…']]
    .forEach(r=>rt.querySelector('tbody').append(el('tr','',r.map((c,i)=>i?'<td class="code">'+c+'</td>':'<td>'+c+'</td>').join(''))));
  content.append(rt);
}

/* ---------- PR / issue map ---------- */
function renderPRMap(){
  content.append(el('h1','','PR / Issue Map'));
  content.append(el('p','lede','Finding → issue → PR → branch → commit. Planned work is tagged; nothing has been opened.'));
  const chains=[
    ['F-010 → branch c021b52','feat/ix-remap-hardening','→ PR vs ix-infrastructure/Ix main','READY — authorization (D-009)','ok'],
    ['F-008 → Ix#376','(no branch)','→ PR (Option A)','packet ready — +maintainer direction','ok'],
    ['F-009 → Ix#371','(no branch)','→ decision OSS vs Pro','maintainer decision','warn'],
    ['F-001…F-005 → system-compass#57','feat/f-key-fit-view','→ PR vs system-compass main','SOURCE-BLOCKED (spec)','warn'],
    ['F-006/F-007 → #57 gap','(no branch)','→ issue then PR','SOURCE-BLOCKED (investigation)','warn']
  ];
  chains.forEach(c=>{const card=el('div','card');card.append(el('h3','',c[0]));card.append(el('p','muted',c[1]));card.append(el('p','',c[2]+' — <span class="'+c[4]+'">'+c[3]+'</span>'));content.append(card);});
  content.append(el('h2','','Issue → PR (existing, upstream)'));
  content.append(el('p','muted','Ix#374→#375 · Ix#379→#380 · Ix#381→#382 (Hiro-Chiba) — catalogued, out of scope. system-compass#57 → v0.3.0 (KageBinary).'));
}

/* ---------- suggestions ---------- */
function renderSuggestions(){
  content.append(el('h1','','AI Suggestions'));
  content.append(el('p','lede','Every recommendation with its disposition — accepted, deferred, rejected, superseded, blocked. Rejected and dangerous ones are recorded on purpose.'));
  ['ACCEPTED','DEFERRED','REJECTED','SUPERSEDED','BLOCKED'].forEach(ds=>{
    const set=D.suggestions.filter(s=>s.disposition===ds);
    content.append(el('h2','',ds+' ('+set.length+')'));
    const t=el('table','','<thead><tr><th>ID</th><th>Suggestion</th><th>Repo</th><th>Reason</th></tr></thead><tbody></tbody>');
    set.forEach(s=>{const tr=el('tr','','<td class="code">'+s.id+'</td><td>'+s.text+'</td><td>'+s.repository+'</td><td>'+s.reason+'</td>');tr.onclick=()=>openEntity(s.id,'suggestion');t.querySelector('tbody').append(tr);});
    content.append(t);
  });
}

/* ---------- decisions ---------- */
function renderDecisions(){
  content.append(el('h1','','Decisions'));
  content.append(el('p','lede','Decided decisions and open ones awaiting your call.'));
  const decided=D.decisions.filter(d=>String(d.status).startsWith('DECIDED'));
  const open=D.decisions.filter(d=>d.status==='OPEN');
  content.append(el('h2','','Decided ('+decided.length+')'));
  const t=el('table','','<thead><tr><th>ID</th><th>Decision</th><th>Chosen</th><th>Why</th></tr></thead><tbody></tbody>');
  decided.forEach(d=>{const tr=el('tr','','<td class="code">'+d.id+'</td><td>'+d.title+'</td><td>'+d.chosen+'</td><td>'+d.reason+'</td>');tr.onclick=()=>openEntity(d.id,'decision');t.querySelector('tbody').append(tr);});
  content.append(t);
  content.append(el('h2','','Open — your call ('+open.length+')'));
  const ot=el('table','','<thead><tr><th>ID</th><th>Decision</th><th>Recommended</th></tr></thead><tbody></tbody>');
  open.forEach(d=>{const tr=el('tr','','<td class="code">'+d.id+'</td><td>'+d.title+'</td><td>'+d.reason+'</td>');tr.onclick=()=>openEntity(d.id,'decision');ot.querySelector('tbody').append(tr);});
  content.append(ot);
}

/* ---------- security ---------- */
function renderSecurity(){
  content.append(el('h1','','Security'));
  content.append(el('p','lede','Endpoint guard matrix, repository posture, open items, and the privacy audit.'));
  content.append(el('h2','','/__ix/remap guard matrix'));
  const g=el('table','','<thead><tr><th>Check</th><th>Result</th><th></th></tr></thead><tbody></tbody>');
  [['Loopback bind','127.0.0.1'],['Host: localhost / 127.0.0.1 / [::1]','allowed'],['Host: DNS-rebinding','403'],['Origin: cross-site','403'],['Origin: non-loopback','403'],['Origin: malformed','403'],['Origin: absent (curl)','allowed'],['Origin: loopback','allowed'],['Client-disconnect reap','child killed'],['SPA fallback GET','200']]
    .forEach(r=>g.querySelector('tbody').append(el('tr','','<td>'+r[0]+'</td><td class="code">'+r[1]+'</td><td class="ok">✓</td>')));
  content.append(g);
  content.append(el('h2','','Open items'));
  const ot=el('table','','<thead><tr><th>Sev</th><th>Item</th><th>Status</th><th></th></tr></thead><tbody></tbody>');
  [['P0','0.0.0.0 bind','FIXED in remap branch','ok'],['P2','url.parse() / DEP0169','follow-up','warn'],['P2','localhost advertised vs 127.0.0.1','follow-up','warn'],['P3','stale visualizer bundle','watch','warn'],['P3','token format validation','hardening idea',''],['P3','curl|sh without hash','hardening idea','']]
    .forEach(r=>ot.querySelector('tbody').append(el('tr','','<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td class="'+(r[3]==='ok'?'ok':r[3]==='warn'?'warn':'')+'">'+(r[3]==='ok'?'✓':r[3]==='warn'?'!':'')+'</td>')));
  content.append(ot);
  content.append(el('h2','','Privacy audit'));
  const pt=el('table','','<thead><tr><th>Scan</th><th>Result</th><th></th></tr></thead><tbody></tbody>');
  [['Drive paths (C:\\Users, /home/, E:\\Users)','none'],['Raw E:\\E-github-repos paths','sanitized to placeholders'],['Emails','none'],['Credential prefixes / tokens','none (descriptive prose only)'],['.env / SSH keys / certs','none']]
    .forEach(r=>pt.querySelector('tbody').append(el('tr','','<td>'+r[0]+'</td><td>'+r[1]+'</td><td class="ok">✓</td>')));
  content.append(pt);
  content.append(el('p','muted','This wiki contains no real filesystem paths, no local usernames, no credentials. Public maintainer GitHub handles are retained (public, needed for mention context). See planning/security/privacy.md.'));
}

/* ---------- about ---------- */
function renderAbout(){
  content.append(el('h1','','About & Privacy'));
  content.append(el('p','lede','Interactive exploration of the Ix / Compass investigation — the planning layer of <strong>Ix-findings</strong>. Generated from the machine-readable registries; works fully offline (file://, no server, no network).'));
  content.append(el('h2','','Evidence classes'));
  const t=el('table','','<thead><tr><th>Class</th><th>Meaning</th><th></th></tr></thead><tbody></tbody>');
  [['A','Direct source evidence (or authoritative maintainer release notes)'],['B','Reproducible artifact / runtime evidence'],['C','Strongly corroborated reconstruction'],['D','Inference / speculation']]
    .forEach(r=>t.querySelector('tbody').append(el('tr','','<td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+eclass(r[0])+'</td>')));
  content.append(t);
  content.append(el('p','muted','Class is per-claim and never upgraded by repetition. The wiki distinguishes classes by label + glyph + border, not colour alone.'));
  content.append(el('h2','','Traceability'));
  content.append(el('p','lede','conclusion → finding (F-###) → evidence (E-###) → reproduction → artifact/source reference. Recommendations trace to suggestion (S-###) → evidence → decision (D-###) → action/deferral/rejection.'));
  content.append(el('h2','','Privacy'));
  content.append(el('p','lede','No real filesystem paths, no local usernames, no credentials, no private source. No remote operation was performed while building this (nothing pushed or opened). Full audit: planning/security/privacy.md.'));
  content.append(el('h2','','Data'));
  content.append(el('p','muted','Loaded from data/data.js (generated by build-data.mjs from planning/ registries). '+D.findings.length+' findings · '+D.evidence.length+' evidence · '+D.suggestions.length+' suggestions · '+D.decisions.length+' decisions · '+D.phases.length+' phases · '+D.graph.nodes.length+' graph nodes.'));
}

/* ---------- search ---------- */
const searchEl=$('#search');
function doSearch(q){
  q=q.trim().toLowerCase();if(!q)return;
  const results=[];
  D.findings.forEach(f=>{if((f.id+' '+f.title+' '+f.repository+' '+(f.ixf_id||'')).toLowerCase().includes(q))results.push({id:f.id,type:'finding',label:f.title});});
  D.evidence.forEach(e=>{if((e.id+' '+e.title+' '+e.kind+' '+(e.supports||[]).join(' ')).toLowerCase().includes(q))results.push({id:e.id,type:'evidence',label:e.title});});
  D.suggestions.forEach(s=>{if((s.id+' '+s.text+' '+s.repository).toLowerCase().includes(q))results.push({id:s.id,type:'suggestion',label:s.text.slice(0,70)});});
  D.decisions.forEach(d=>{if((d.id+' '+d.title+' '+(d.problem||'')).toLowerCase().includes(q))results.push({id:d.id,type:'decision',label:d.title});});
  D.phases.forEach(p=>{if((p.id+' '+p.title+' '+(p.objective||'')).toLowerCase().includes(q))results.push({id:p.id,type:'phase',label:p.title});});
  const w=el('div','');
  w.append(el('h2','','Search: '+q));
  if(!results.length)w.append(el('p','muted','No matches.'));
  results.slice(0,40).forEach(r=>{const a=el('a','link','');a.textContent=r.id+' — '+r.label;a.style.display='block';a.style.marginBottom='6px';a.onclick=()=>openEntity(r.id,r.type);w.append(a);});
  content.innerHTML='';content.append(w);
}
searchEl.addEventListener('input',()=>{const q=searchEl.value;if(q.trim())doSearch(q);else render();});
searchEl.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();doSearch(searchEl.value);}});

/* init */
render();
})();