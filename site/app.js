/* DX小説リーダー。ビルド不要・依存ゼロ。location.hash で画面を切り替える。
 *   #/                    トップ（表紙棚）
 *   #/about               あらすじ・世界観（舞台・歩み・各話のあらすじ）
 *   #/synopsis/ch01       各話のあらすじ
 *   #/characters          登場人物一覧と相関図
 *   #/characters/rino     人物詳細
 *   #/ch01                本文（この端末で保存した位置から再開）
 *   #/ch01/s3 ・ #/ch01/top   本文の見出しへ ・ 先頭へ
 * 一覧・本文に要るものは index.html に埋め込み（__MANIFEST__）、あらすじ・人物は data/meta.json を必要になったとき読む。
 * 保存するのは localStorage だけ（表示設定・最後に開いた話・話ごとの読書位置）。
 */
(() => {
"use strict";

const M = window.__MANIFEST__ || { items: [], v: "", series: null };
const ITEMS = M.items;
const V = M.v;
const SERIES = M.series || {};
const $ = s => document.querySelector(s);
const root = document.documentElement;
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const K = { prefs: "dxn:prefs", last: "dxn:last", pos: id => "dxn:pos:" + id };

const byId = id => ITEMS.find(x => x.id === id);
const label = it => `第${it.num}話`;
const fmt = n => Number(n || 0).toLocaleString("ja-JP");
const mins = chars => Math.max(1, Math.round(chars / 600));   // 黙読 600字/分の目安
const pct = p => p.done ? 100 : Math.min(99, Math.round((p.i || 0) / Math.max(1, (p.n || 1) - 1) * 100));
const IMP = { main: "主要", sub: "準主要", cameo: "登場" };

/* ---------- 表示設定 ---------- */
const DEF = { fs: 18, lh: 1.95, font: "sans", theme: "auto" };
const prefs = Object.assign({}, DEF, LS.get(K.prefs, {}));

function applyPrefs(save = true) {
  root.style.setProperty("--fs", prefs.fs + "px");
  root.style.setProperty("--lh", String(prefs.lh));
  root.style.setProperty("--font", prefs.font === "serif" ? "var(--serif)" : "var(--sans)");
  if (prefs.theme === "auto") root.removeAttribute("data-theme"); else root.dataset.theme = prefs.theme;
  $("#fsV").textContent = prefs.fs;
  $("#lhV").textContent = prefs.lh.toFixed(2);
  document.querySelectorAll("[data-font]").forEach(b => b.classList.toggle("on", b.dataset.font === prefs.font));
  document.querySelectorAll("[data-th]").forEach(b => b.classList.toggle("on", b.dataset.th === prefs.theme));
  if (save) LS.set(K.prefs, prefs);
}

/* ---------- あらすじ・人物のデータ（必要になったとき1回だけ読む） ---------- */
let META = null, metaPromise = null;
function loadMeta() {
  if (META) return Promise.resolve(META);
  if (!metaPromise) {
    metaPromise = fetch(`data/meta.json?v=${encodeURIComponent(V)}`)
      .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(j => {
        j.characters = j.characters || []; j.groups = j.groups || []; j.novels = j.novels || {};
        j.charById = Object.fromEntries(j.characters.map(c => [c.id, c]));
        j.groupById = Object.fromEntries(j.groups.map(g => [g.id, g]));
        META = j; return j;
      })
      .catch(e => { metaPromise = null; throw e; });
  }
  return metaPromise;
}

/* ---------- 共通の部品 ---------- */
const initial = name => (name || "?").replace(/\s+/g, "")[0] || "?";
/** 所属の行。グループ名と所属が同じときは繰り返さない（「ヤマビコ・ヤマビコ・社長」を防ぐ） */
const affLine = (c, g) => [(g || {}).name, c.affiliation, c.title]
  .filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(" ・ ");
const short = (s, n) => (s || "").length > n ? s.slice(0, n - 1) + "…" : (s || "");
const nameOf = id => id === "narration" ? "地の文" : (META && META.charById[id] ? META.charById[id].name : id);
const chips = arr => (arr || []).map(t => `<span class="chip">${esc(t)}</span>`).join("");
const paras = txt => String(txt || "").split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join("");
const kv = rows => (rows || []).length ? `<table class="kv">${rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>` : "";
const errHTML = e => `<p class="err">読み込めませんでした（${esc(e.message)}）。<button type="button" class="btn sm ghost" data-reload>再読み込み</button></p>`;
const groupColor = c => (META && META.groupById[c.group] || {}).color || "var(--accent)";

function coverHTML(it, cls = "") {
  if (it.cover) return `<span class="cover ${cls}" style="--c:${it.color}"><img src="${esc(it.cover)}" alt="${esc(it.title)}" loading="lazy"></span>`;
  return `<span class="cover ph ${cls}" style="--c:${it.color}"><span class="v">${esc(it.title)}</span><span class="n">${String(it.num).padStart(2, "0")}</span></span>`;
}
function avatarHTML(c, cls = "") {
  const color = groupColor(c);
  if (c.portrait) return `<span class="av ${cls}" style="--c:${color}"><img src="${esc(c.portrait)}" alt="${esc(c.name)}" loading="lazy"></span>`;
  return `<span class="av ph ${cls}" style="--c:${color}" aria-label="${esc(c.name)}">${esc(initial(c.name))}</span>`;
}
function navHTML(prev, next, hrefOf, homeHref, homeLabel, titleOf, kind) {
  const card = (x, cls, k) => x
    ? `<a class="nb ${cls}" href="${hrefOf(x)}"><span class="k">${k}</span><span class="t">${esc(titleOf(x))}</span></a>`
    : `<span class="nb off ${cls}"><span class="k">${cls === "prev" ? `最初の${kind}です` : `最後の${kind}です`}</span></span>`;
  return `<nav class="nav">${card(prev, "prev", `← 前の${kind}`)}<a class="nb home" href="${homeHref}"><span class="k">${homeLabel}</span></a>${card(next, "next", `次の${kind} →`)}</nav>`;
}
const footHTML = () => `<footer class="foot">版 ${esc(M.version || "")}</footer>`;

/* ---------- 画面の切り替え ---------- */
const VIEWS = ["home", "about", "synopsis", "characters", "character", "reader"];
function switchView(name, tab) {
  closeSheets();
  VIEWS.forEach(v => $("#" + v).classList.toggle("on", v === name));
  $("#topnav").hidden = name === "reader";
  document.querySelectorAll("#topnav [data-tab]").forEach(a => a.classList.toggle("on", a.dataset.tab === tab));
  bar.classList.remove("hide");
  if (name !== "reader") { cur = null; curData = null; }
}

/* ---------- トップ ---------- */
function showHome() {
  switchView("home", "home");
  document.title = SERIES.title || "DX小説";
  const total = ITEMS.reduce((s, x) => s + x.chars, 0);
  $("#heroKicker").textContent = SERIES.kicker || `連作小説 ・ 全${ITEMS.length}話`;
  $("#heroTitle").textContent = SERIES.title || "DX小説";
  $("#heroTag").textContent = SERIES.tagline || "";
  $("#heroLead").textContent = SERIES.lead || "";
  if (M.key) { $("#hero").style.setProperty("--key", `url("${M.key}")`); $("#hero").classList.add("img"); }

  const last = LS.get(K.last), lastIt = last && byId(last.id);
  const lp = lastIt ? LS.get(K.pos(lastIt.id), {}) : {};
  $("#heroCta").innerHTML =
    (lastIt && !lp.done ? `<a class="btn" href="#/${lastIt.id}">続きから読む</a>` : `<a class="btn" href="#/${ITEMS[0] ? ITEMS[0].id : ""}">第1話から読む</a>`) +
    `<a class="btn ghost" href="#/about">あらすじ</a><a class="btn ghost" href="#/characters">登場人物</a>`;

  const res = $("#resume");
  if (lastIt) {
    res.hidden = false; res.href = `#/${lastIt.id}`;
    $("#resT").textContent = `${label(lastIt)}　${lastIt.title}`;
    $("#resS").textContent = lp.done ? "読み終えています。もう一度読む →"
      : lp.n && lp.i > 0 ? `${pct(lp)}% まで読みました。続きから →` : "最初から読む →";
  } else res.hidden = true;

  $("#listSub").textContent = `全${ITEMS.length}話 ・ 約${fmt(total)}字`;
  $("#list").innerHTML = ITEMS.map(bookCard).join("");
  scrollTo(0, 0);
}

function bookCard(it) {
  const p = LS.get(K.pos(it.id), {}), pc = p.n ? pct(p) : 0;
  const state = p.done ? "done" : pc > 0 ? "doing" : "";
  const tail = p.done ? "読了" : pc > 0 ? `${pc}%` : "未読";
  return `<article class="book ${state}" data-id="${it.id}" style="--c:${it.color}">
    <a class="cv" href="#/${it.id}" aria-label="${esc(it.title)}を読む">${coverHTML(it)}</a>
    <div class="bk">
      <div class="no">${label(it)}</div>
      <a class="t" href="#/${it.id}">${esc(it.title)}</a>
      <div class="catch">${esc(it.catch || it.topic)}</div>
      <div class="chips">${chips(it.themes)}</div>
      <div class="meta">約${fmt(it.chars)}字 ・ 約${mins(it.chars)}分 ・ ${it.sections.length}章 ・ <b>${tail}</b></div>
      <span class="pbar"><i style="width:${p.done ? 100 : pc}%"></i></span>
      <div class="acts"><a class="btn sm" href="#/${it.id}">${pc > 0 && !p.done ? "続きを読む" : "読む"}</a><a class="btn sm ghost" href="#/synopsis/${it.id}">あらすじ</a></div>
    </div></article>`;
}

/* ---------- あらすじ・世界観 ---------- */
async function showAbout() {
  switchView("about", "about");
  document.title = `あらすじ・世界観 — ${SERIES.title || "DX小説"}`;
  const main = $("#aboutMain");
  main.innerHTML = `<p class="loading">読み込み中…</p>`;
  scrollTo(0, 0);
  let meta;
  try { meta = await loadMeta(); } catch (e) { main.innerHTML = errHTML(e); return; }
  const s = meta.series || SERIES, w = s.world || {};
  const cast = meta.characters.filter(c => c.importance !== "cameo");
  main.innerHTML = `
    <header class="ph-head"><div class="kicker">あらすじ・世界観</div><h1>${esc(s.title || "DX小説")}</h1><p class="lead">${esc(s.lead || "")}</p></header>
    ${w.setting || (w.company || []).length ? `<section><h2 class="sec">舞台</h2><div class="prose">${paras(w.setting)}</div>${kv(w.company)}</section>` : ""}
    ${(s.timeline || []).length ? `<section><h2 class="sec">${esc(s.timelineTitle || "歩み")}</h2><ol class="tl">${s.timeline.map(t => {
      const it = byId(t.novel);
      return `<li style="--c:${it ? it.color : "var(--accent)"}"><div class="tl-h">${it ? `<a href="#/synopsis/${it.id}">${label(it)}　${esc(it.title)}</a>` : ""}${t.period ? `<span class="tl-p">${esc(t.period)}</span>` : ""}</div><div class="tl-b">${esc(t.event)}</div></li>`;
    }).join("")}</ol></section>` : ""}
    <section><h2 class="sec">各話のあらすじ</h2><div class="syn-list">${ITEMS.map(it => {
      const n = meta.novels[it.id];
      return `<a class="syn-card" href="#/synopsis/${it.id}" style="--c:${it.color}">${coverHTML(it, "sm")}<span class="sb"><span class="no">${label(it)}</span><span class="t">${esc(it.title)}</span><span class="catch">${esc(n ? n.catch : it.topic)}</span><span class="d">${esc(n ? n.synopsis : "あらすじは準備中")}</span></span></a>`;
    }).join("")}</div></section>
    ${cast.length ? `<section><h2 class="sec">登場人物</h2><div class="avatars">${cast.map(c => `<a class="avl" href="#/characters/${c.id}">${avatarHTML(c)}<span>${esc(c.name)}</span></a>`).join("")}</div><p style="margin-top:14px"><a class="btn ghost sm" href="#/characters">人物一覧と相関図 →</a></p></section>` : ""}
    ${footHTML()}`;
}

/* ---------- 各話のあらすじ ---------- */
async function showSynopsis(id) {
  const it = byId(id);
  switchView("synopsis", "about");
  document.title = `${it.title} のあらすじ — ${SERIES.title || "DX小説"}`;
  const main = $("#synMain");
  main.innerHTML = `<p class="loading">読み込み中…</p>`;
  scrollTo(0, 0);
  let meta;
  try { meta = await loadMeta(); } catch (e) { main.innerHTML = errHTML(e); return; }
  const n = meta.novels[id];
  const idx = ITEMS.indexOf(it), prev = ITEMS[idx - 1], next = ITEMS[idx + 1];
  const p = LS.get(K.pos(id), {}), pc = p.n ? pct(p) : 0;
  const cast = (n ? n.cast || [] : []).map(c => ({ ...c, ch: meta.charById[c.id] })).filter(c => c.ch);
  main.innerHTML = `
    <div class="syn-hero" style="--c:${it.color}">
      ${coverHTML(it, "lg")}
      <div class="sh-in">
        <div class="kicker">${label(it)}${n && n.period ? ` ・ ${esc(n.period)}` : ""}</div>
        <h1>${esc(it.title)}</h1>
        ${n && n.catch ? `<p class="catch">${esc(n.catch)}</p>` : ""}
        <p class="tag">${esc(n && n.tagline ? n.tagline : it.topic)}</p>
        <div class="chips">${chips(it.themes)}</div>
        <div class="cta"><a class="btn" href="#/${id}">${p.done ? "もう一度読む" : pc > 0 ? `続きから読む（${pc}%）` : "本文を読む"}</a><span class="meta">約${fmt(it.chars)}字 ・ 約${mins(it.chars)}分 ・ ${it.sections.length}章</span></div>
      </div>
    </div>
    ${!n ? `<p class="muted" style="margin-top:24px">この話のあらすじは準備中です。</p>` : `
    <section><h2 class="sec">あらすじ</h2><div class="prose">${paras(n.synopsis)}</div></section>
    ${(n.lessons || []).length ? `<section><h2 class="sec">この話で覚える仕組み</h2><div class="lessons">${n.lessons.map(l => `<div class="lesson"><div class="lt"><b>${esc(l.term)}</b><span class="arr">⇄</span><span>${esc(l.formal)}</span></div><div class="lp">${esc(l.point)}</div></div>`).join("")}</div></section>` : ""}
    ${cast.length ? `<section><h2 class="sec">登場人物</h2><div class="castlist">${cast.map(c => `<a class="castcard imp-${c.importance}" href="#/characters/${c.id}">${avatarHTML(c.ch)}<span class="cb"><span class="cn">${esc(c.ch.name)}<small>${esc([c.ch.affiliation, c.ch.title].filter(Boolean).join(" ・ "))}</small></span><span class="cr">${esc(c.role)}</span></span></a>`).join("")}</div></section>` : ""}
    ${(n.chapters || []).length ? `<section><h2 class="sec">章ごとのあらすじ</h2><details class="spoiler"><summary>ネタバレを含みます。開いて読む</summary><ol class="chap">${n.chapters.map(c => `<li><a class="ct" href="#/${id}/${c.id}">${esc(c.title)}</a><p>${esc(c.summary)}</p></li>`).join("")}</ol></details></section>` : ""}
    ${n.full ? `<section><h2 class="sec">結末まで</h2><details class="spoiler"><summary>ネタバレを含みます。開いて読む</summary><div class="prose">${paras(n.full)}</div></details></section>` : ""}
    ${(n.quotes || []).length ? `<section><h2 class="sec">語録</h2><div class="quotes">${n.quotes.map(q => `<blockquote class="q"><p>${esc(q.text)}</p><footer>${q.who && q.who !== "narration" && meta.charById[q.who] ? `<a href="#/characters/${q.who}">${esc(nameOf(q.who))}</a>` : esc(nameOf(q.who || "narration"))}${q.context ? ` ・ ${esc(q.context)}` : ""}</footer></blockquote>`).join("")}</div></section>` : ""}
    ${(n.keywords || []).length || (n.newSystems || []).length ? `<section class="two-col">${(n.keywords || []).length ? `<div><h2 class="sec">キーワード</h2><div class="chips">${chips(n.keywords)}</div></div>` : ""}${(n.newSystems || []).length ? `<div><h2 class="sec">この話で入った仕組み</h2><ul class="plain">${n.newSystems.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}</section>` : ""}
    ${n.companyState ? `<section><h2 class="sec">この話の終わりのヤマビコ</h2><div class="prose state">${paras(n.companyState)}</div></section>` : ""}`}
    ${navHTML(prev, next, x => `#/synopsis/${x.id}`, "#/about", "あらすじ一覧", x => x.title, "話")}
    ${footHTML()}`;
}

/* ---------- 登場人物一覧 ---------- */
let charFilter = "all";
async function showCharacters() {
  switchView("characters", "characters");
  document.title = `登場人物 — ${SERIES.title || "DX小説"}`;
  const main = $("#charsMain");
  main.innerHTML = `<p class="loading">読み込み中…</p>`;
  scrollTo(0, 0);
  let meta;
  try { meta = await loadMeta(); } catch (e) { main.innerHTML = errHTML(e); return; }
  const s = meta.series || {};
  main.innerHTML = `
    <header class="ph-head"><div class="kicker">登場人物</div><h1>${esc(s.castTitle || "ヤマビコの人びと")}</h1><p class="lead">${esc(s.castLead || "")}</p></header>
    <div class="filters" id="chFilters"><button type="button" data-g="all">すべて</button>${meta.groups.map(g => `<button type="button" data-g="${g.id}" style="--c:${g.color}">${esc(g.name)}</button>`).join("")}</div>
    <div class="people" id="chGrid"></div>
    ${relmapHTML(meta)}
    ${footHTML()}`;
  const render = () => {
    const list = meta.characters.filter(c => charFilter === "all" || c.group === charFilter);
    $("#chGrid").innerHTML = list.map(c => personCard(c, meta)).join("") || `<p class="muted">該当する人物がいません。</p>`;
    document.querySelectorAll("#chFilters button").forEach(b => b.classList.toggle("on", b.dataset.g === charFilter));
  };
  document.querySelectorAll("#chFilters button").forEach(b => b.onclick = () => { charFilter = b.dataset.g; render(); });
  if (!meta.groups.some(g => g.id === charFilter)) charFilter = "all";
  render();
}

function personCard(c, meta) {
  const g = meta.groupById[c.group] || {};
  const novels = (c.novels || []).map(n => byId(n.id)).filter(Boolean);
  return `<a class="person imp-${c.importance}" href="#/characters/${c.id}" style="--c:${g.color || "var(--accent)"}">
    ${avatarHTML(c, "lg")}
    <span class="pb">
      <span class="pn">${esc(c.name)}<small>${esc(c.reading || "")}</small></span>
      <span class="pa">${esc(affLine(c, g))}</span>
      <span class="po">${esc(c.oneLiner || "")}</span>
      <span class="pdots">${novels.map(it => `<i style="--c:${it.color}" title="${esc(label(it) + " " + it.title)}">${it.num}</i>`).join("")}</span>
    </span></a>`;
}

/** 相関図。主要を内側の輪、準主要を外側の輪に並べ、relations を線で結ぶ */
function relmapHTML(meta) {
  const main = meta.characters.filter(c => c.importance === "main");
  const sub = meta.characters.filter(c => c.importance === "sub");
  const nodes = main.concat(sub);
  if (nodes.length < 3) return "";
  const idx = Object.fromEntries(nodes.map((c, i) => [c.id, i]));

  const W = 760, H = 760, cx = W / 2, cy = H / 2;
  const ring = (n, i, R, rot) => {
    const a = -Math.PI / 2 + rot + i / n * Math.PI * 2;
    return [+(cx + R * Math.cos(a)).toFixed(1), +(cy + R * Math.sin(a)).toFixed(1)];
  };
  // 内側は主要のみ（外側と角度をずらして重なりを避ける）。sub が無ければ1輪に落とす
  const rIn = sub.length ? 155 : 260, rOut = 305;
  const pos = nodes.map((c, i) => i < main.length
    ? ring(main.length, i, rIn, Math.PI / main.length)
    : ring(sub.length, i - main.length, rOut, 0));

  const seen = new Set(), edges = [];
  for (const c of nodes) for (const r of (c.relations || [])) {
    if (!(r.to in idx) || r.to === c.id) continue;
    const key = [c.id, r.to].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key); edges.push({ a: idx[c.id], b: idx[r.to], how: r.how });
  }
  const lines = edges.map(e =>
    `<line x1="${pos[e.a][0]}" y1="${pos[e.a][1]}" x2="${pos[e.b][0]}" y2="${pos[e.b][1]}"><title>${esc(nodes[e.a].name)} — ${esc(nodes[e.b].name)}${e.how ? `：${esc(e.how)}` : ""}</title></line>`).join("");

  const circles = nodes.map((c, i) => {
    const [x, y] = pos[i], color = groupColor(c), R = i < main.length ? 30 : 23;
    const face = c.portrait
      ? `<clipPath id="cp-${esc(c.id)}"><circle cx="${x}" cy="${y}" r="${R - 2}"/></clipPath><image href="${esc(c.portrait)}" x="${x - R + 2}" y="${y - R + 2}" width="${(R - 2) * 2}" height="${(R - 2) * 2}" clip-path="url(#cp-${esc(c.id)})" preserveAspectRatio="xMidYMid slice"/>`
      : `<text class="ini" x="${x}" y="${y}" dy=".36em" style="font-size:${i < main.length ? 24 : 18}px">${esc(initial(c.name))}</text>`;
    const lab = short(c.name.replace(/\s+/g, ""), 7);
    return `<a href="#/characters/${esc(c.id)}" aria-label="${esc(c.name)}"><g class="node${i < main.length ? " m" : ""}"><circle cx="${x}" cy="${y}" r="${R}" fill="${color}"/>${face}<text class="lab" x="${x}" y="${y + R + 17}">${esc(lab)}<title>${esc(c.name)}</title></text></g></a>`;
  }).join("");

  const legend = meta.groups.map(g => `<span class="lg"><i style="background:${g.color}"></i>${esc(g.name)}</span>`).join("");
  return `<section><h2 class="sec">相関図</h2>
    <p class="muted small">内側が主要人物、外側が準主要。線に触れると関係が出ます。人物を押すと詳細へ。<span class="sp-only">図は横にスクロールできます。</span></p>
    <div class="legend">${legend}</div>
    <div class="relwrap"><svg class="relmap" viewBox="0 0 ${W} ${H}" role="img" aria-label="人物相関図">${lines}${circles}</svg></div></section>`;
}

/* ---------- 人物詳細 ---------- */
async function showCharacter(id) {
  switchView("character", "characters");
  const main = $("#charMain");
  main.innerHTML = `<p class="loading">読み込み中…</p>`;
  scrollTo(0, 0);
  let meta;
  try { meta = await loadMeta(); } catch (e) { main.innerHTML = errHTML(e); return; }
  const c = meta.charById[id];
  if (!c) { main.innerHTML = `<p class="err" style="margin-top:24px">その人物は見つかりません。<a href="#/characters">人物一覧へ</a></p>`; return; }
  document.title = `${c.name} — 登場人物 — ${SERIES.title || "DX小説"}`;
  const g = meta.groupById[c.group] || {};
  const list = meta.characters, i = list.indexOf(c), prev = list[i - 1], next = list[i + 1];
  const novels = (c.novels || []).map(n => ({ ...n, it: byId(n.id) })).filter(n => n.it);
  const rels = (c.relations || []).map(r => ({ ...r, ch: meta.charById[r.to] })).filter(r => r.ch);
  for (const o of list) for (const r of (o.relations || []))          // 相手側にだけ書かれた関係も拾う
    if (r.to === c.id && o.id !== c.id && !rels.some(x => x.ch.id === o.id)) rels.push({ to: o.id, how: r.how, ch: o });
  main.innerHTML = `
    <div class="ch-hero" style="--c:${g.color || "var(--accent)"}">
      ${avatarHTML(c, "xl")}
      <div class="sh-in">
        <div class="kicker">${esc(affLine(c, g))}</div>
        <h1>${esc(c.name)}<small>${esc(c.reading || "")}</small></h1>
        <p class="tag">${esc(c.oneLiner || "")}</p>
        <div class="chips"><span class="chip">${IMP[c.importance] || ""}</span>${novels.map(n => `<a class="chip" href="#/synopsis/${n.it.id}" title="${esc(n.it.title)}">${label(n.it)}</a>`).join("")}</div>
      </div>
    </div>
    ${(c.profile || []).length || (c.traits || []).length ? `<section class="two-col">
      ${(c.profile || []).length ? `<div><h2 class="sec">プロフィール</h2>${kv(c.profile)}</div>` : ""}
      ${(c.traits || []).length ? `<div><h2 class="sec">人物像</h2><ul class="plain">${c.traits.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
    </section>` : ""}
    ${(c.appearance || []).length ? `<section><h2 class="sec">外見・持ち物・癖</h2><ul class="plain">${c.appearance.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
    ${rels.length ? `<section><h2 class="sec">関係</h2><div class="rels">${rels.map(r => `<a class="rel" href="#/characters/${r.ch.id}">${avatarHTML(r.ch)}<span><b>${esc(r.ch.name)}</b><small>${esc(r.how || "")}</small></span></a>`).join("")}</div></section>` : ""}
    ${novels.length ? `<section><h2 class="sec">登場する話</h2><ol class="tl">${novels.map(n => `<li style="--c:${n.it.color}"><div class="tl-h"><a href="#/synopsis/${n.it.id}">${label(n.it)}　${esc(n.it.title)}</a><span class="badge">${IMP[n.importance] || ""}</span></div><div class="tl-b">${n.role ? `<p><b>${esc(n.role)}</b></p>` : ""}${n.arc ? `<p>${esc(n.arc)}</p>` : ""}<a class="btn sm ghost" href="#/${n.it.id}">この話を読む</a></div></li>`).join("")}</ol></section>` : ""}
    ${(c.quotes || []).length ? `<section><h2 class="sec">語録</h2><div class="quotes">${c.quotes.map(q => { const it = byId(q.novel); return `<blockquote class="q"><p>${esc(q.text)}</p><footer>${it ? `<a href="#/synopsis/${it.id}">${label(it)}　${esc(it.title)}</a>` : ""}${q.context ? ` ・ ${esc(q.context)}` : ""}</footer></blockquote>`; }).join("")}</div></section>` : ""}
    ${navHTML(prev, next, x => `#/characters/${x.id}`, "#/characters", "人物一覧", x => x.name, "人物")}
    ${footHTML()}`;
}

/* ---------- 本文 ---------- */
let cur = null;        // 表示中の話 id
let curData = null;    // その本文
const cache = new Map();
const body = $("#body"), bar = $("#bar"), prog = $("#prog");

async function loadData(id) {
  if (cache.has(id)) return cache.get(id);
  const r = await fetch(`data/${id}.json?v=${encodeURIComponent(V)}`);
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = await r.json();
  cache.set(id, j);
  return j;
}

/** 画面上でいちばん上に見えているブロックの番号（ブロックは文書順なので二分探索できる） */
function firstVisible() {
  const els = body.children;
  if (!els.length) return 0;
  const top = bar.offsetHeight + 6;
  let lo = 0, hi = els.length - 1, ans = els.length - 1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (els[m].getBoundingClientRect().bottom > top) { ans = m; hi = m - 1; } else lo = m + 1;
  }
  return ans;
}

/** プログラムからのスクロール。ヘッダーの自動隠しが「下へスクロールした」と誤解しないよう基準点も揃える */
function settle() { lastY = Math.max(0, scrollY); }
function scrollToBlock(i) {
  const el = body.children[i];
  if (el) el.scrollIntoView({ block: "start" });
  settle();
}

/** 表示設定を変えても、いま読んでいる段落が画面から逃げないようにする。
 *  戻すのは同期で行う（rAF 待ちにすると、＋を連打したとき2回目の計測が崩れた位置を拾う）。
 *  先頭付近（表題が見えている）では戻さない。戻すと表題が画面外へ飛ぶ */
function withPos(fn) {
  const i = curData && scrollY > 40 ? firstVisible() : -1;
  fn();
  if (i >= 0) scrollToBlock(i);
}

function jump(sec, initial) {
  if (sec === "top") { scrollTo(0, 0); settle(); return; }
  if (sec) {
    const el = document.getElementById(sec);
    if (el) { el.scrollIntoView({ block: "start" }); settle(); return; }
  }
  if (initial) {
    const p = LS.get(K.pos(cur));
    if (p && p.i > 0 && !p.done) { scrollToBlock(p.i); return; }
  }
  scrollTo(0, 0); settle();
}

function renderNav(it) {
  const idx = ITEMS.indexOf(it);
  $("#nav").outerHTML = navHTML(ITEMS[idx - 1], ITEMS[idx + 1], x => `#/${x.id}`, "#/", "一覧へ", x => x.title, "話").replace('<nav class="nav">', '<nav class="nav" id="nav" aria-label="前後の話">');
}

function renderToc(it, sections) {
  $("#tocLinks").innerHTML = `<a href="#/synopsis/${it.id}">あらすじ</a><a href="#/characters">登場人物</a>`;
  $("#tocSec").innerHTML =
    `<a href="#/${it.id}/top">冒頭</a>` +
    sections.map(s => `<a href="#/${it.id}/${s.id}">${esc(s.title)}</a>`).join("");
  $("#tocAll").innerHTML = ITEMS.map(x =>
    `<a href="#/${x.id}" class="${x.id === it.id ? "on" : ""}"><span class="n">${x.num}</span><span>${esc(x.title)}<small>${esc(x.topic)}</small></span></a>`
  ).join("");
}

function prefetchNext(it) {
  const next = ITEMS[ITEMS.indexOf(it) + 1];
  if (!next) return;
  const go = () => loadData(next.id).catch(() => {});
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 4000 }); else setTimeout(go, 1500);
}

async function showReader(id, sec) {
  const it = byId(id);
  if (cur === id) { jump(sec, false); if (sec) history.replaceState(null, "", "#/" + id); return; }

  switchView("reader");
  cur = id; curData = null; lastIdx = -1;
  $("#rNum").textContent = label(it);
  $("#rTitle").textContent = it.title;
  $("#rTopic").textContent = it.topic;
  $("#rMeta").textContent = `約${fmt(it.chars)}字 ・ 読了まで約${mins(it.chars)}分`;
  $("#rLinks").innerHTML = `<a href="#/synopsis/${id}">あらすじ</a><a href="#/characters">登場人物</a>`;
  $("#barTitle").textContent = `${label(it)}　${it.title}`;
  document.title = `${it.title} — ${SERIES.title || "DX小説"}`;
  body.innerHTML = '<p class="loading">読み込み中…</p>';
  renderNav(it);
  renderToc(it, it.sections);
  scrollTo(0, 0);

  let data;
  try { data = await loadData(id); }
  catch (e) {
    if (cur !== id) return;
    body.innerHTML = errHTML(e);
    return;
  }
  if (cur !== id) return;                      // 読み込み中に別の話へ移った
  curData = data;
  body.innerHTML = data.html;
  LS.set(K.last, { id, at: Date.now() });
  requestAnimationFrame(() => {
    jump(sec, true);
    if (sec) history.replaceState(null, "", "#/" + id);   // 見出しへの直リンクは、再読み込み時に保存位置へ戻れるよう消す
    prefetchNext(it);
  });
}

/* ---------- スクロール：ヘッダーの自動隠し・進捗・読書位置 ---------- */
let ticking = false, lastY = 0, lastIdx = -1;
const SHOW_AT_TOP = 80, DELTA = 6;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    if (!cur) return;
    const y = Math.max(0, scrollY), d = y - lastY;
    if (Math.abs(d) > DELTA) {
      bar.classList.toggle("hide", !(y < SHOW_AT_TOP || d < 0) && !sheetOpen());
      lastY = y;
    }
    const max = root.scrollHeight - innerHeight;
    prog.style.width = (max > 0 ? clamp(y / max * 100, 0, 100) : 0) + "%";
    if (!curData) return;
    const i = firstVisible(), atEnd = max - y < 40;
    if (i !== lastIdx || atEnd) {
      lastIdx = i;
      const p = LS.get(K.pos(cur), {});
      LS.set(K.pos(cur), { i, n: body.children.length, done: !!(p.done || atEnd), at: Date.now() });
    }
  });
}
addEventListener("scroll", onScroll, { passive: true });

/* ---------- パネル ---------- */
const SHEETS = ["toc", "settings"];
const sheetOpen = () => SHEETS.some(n => !$("#" + n).hidden);
function openSheet(n) { closeSheets(); $("#" + n).hidden = false; $("#scrim").hidden = false; bar.classList.remove("hide"); }
function closeSheets() { SHEETS.forEach(n => { $("#" + n).hidden = true; }); $("#scrim").hidden = true; }
const toggleSheet = n => ($("#" + n).hidden ? openSheet(n) : closeSheets());

$("#scrim").onclick = closeSheets;
document.querySelectorAll("[data-close]").forEach(b => b.onclick = closeSheets);
$("#tocBtn").onclick = () => toggleSheet("toc");
$("#setBtn").onclick = () => toggleSheet("settings");
$("#setBtnTop").onclick = () => toggleSheet("settings");
$("#toc").addEventListener("click", e => { if (e.target.closest("a")) closeSheets(); });
document.addEventListener("click", e => { if (e.target.closest("[data-reload]")) location.reload(); });

document.querySelectorAll("[data-fs]").forEach(b => b.onclick = () =>
  withPos(() => { prefs.fs = clamp(prefs.fs + Number(b.dataset.fs), 14, 32); applyPrefs(); }));
document.querySelectorAll("[data-lh]").forEach(b => b.onclick = () =>
  withPos(() => { prefs.lh = Math.round(clamp(prefs.lh + Number(b.dataset.lh) * 0.1, 1.4, 2.6) * 100) / 100; applyPrefs(); }));
document.querySelectorAll("[data-font]").forEach(b => b.onclick = () =>
  withPos(() => { prefs.font = b.dataset.font; applyPrefs(); }));
document.querySelectorAll("[data-th]").forEach(b => b.onclick = () => { prefs.theme = b.dataset.th; applyPrefs(); });

addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target instanceof Element && e.target.closest("input,textarea,select,button")) return;
  if (e.key === "Escape") { closeSheets(); return; }
  if (!cur || sheetOpen()) return;
  const idx = ITEMS.findIndex(x => x.id === cur);
  if (e.key === "ArrowLeft" && ITEMS[idx - 1]) location.hash = "#/" + ITEMS[idx - 1].id;
  else if (e.key === "ArrowRight" && ITEMS[idx + 1]) location.hash = "#/" + ITEMS[idx + 1].id;
  else if (e.key === "t") openSheet("toc");
});

/* ---------- ルーティング ---------- */
function route() {
  let h = "";
  try { h = decodeURIComponent(location.hash); } catch { h = location.hash; }
  const [a, b] = h.replace(/^#\/?/, "").split("/");
  if (!a) showHome();
  else if (a === "about") showAbout();
  else if (a === "synopsis" && byId(b)) showSynopsis(b);
  else if (a === "characters") (b ? showCharacter(b) : showCharacters());
  else if (byId(a)) showReader(a, b || "");
  else { history.replaceState(null, "", "#/"); showHome(); }
}

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
applyPrefs(false);
addEventListener("hashchange", route);
route();
})();
