/* DX小説リーダー。ビルド不要・依存ゼロ。
 * 画面は index（一覧）と reader（本文）の2つで、location.hash で切り替える。
 *   #/            一覧
 *   #/ch01        本文（この端末で保存した位置から再開）
 *   #/ch01/s3     本文の 3 番目の見出しへ
 *   #/ch01/top    本文の先頭へ
 * 保存するのは localStorage だけ（表示設定・最後に開いた話・話ごとの読書位置）。サーバーは持たない。
 */
(() => {
"use strict";

const M = window.__MANIFEST__ || { items: [], v: "" };
const ITEMS = M.items;
const V = M.v;
const $ = s => document.querySelector(s);
const root = document.documentElement;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const K = { prefs: "dxn:prefs", last: "dxn:last", pos: id => "dxn:pos:" + id };

const label = it => `第${it.num}話`;
const fmt = n => n.toLocaleString("ja-JP");
const mins = chars => Math.max(1, Math.round(chars / 600));   // 黙読 600字/分の目安
const pct = p => p.done ? 100 : Math.min(99, Math.round((p.i || 0) / Math.max(1, (p.n || 1) - 1) * 100));

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
  const idx = ITEMS.indexOf(it), prev = ITEMS[idx - 1], next = ITEMS[idx + 1];
  const card = (x, cls, k) => x
    ? `<a class="nb ${cls}" href="#/${x.id}"><span class="k">${k}</span><span class="t">${esc(x.title)}</span></a>`
    : `<span class="nb off ${cls}"><span class="k">${cls === "prev" ? "最初の話です" : "最後の話です"}</span></span>`;
  $("#nav").innerHTML =
    card(prev, "prev", "← 前の話") +
    `<a class="nb home" href="#/"><span class="k">一覧へ</span></a>` +
    card(next, "next", "次の話 →");
}

function renderToc(it, sections) {
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
  const it = ITEMS.find(x => x.id === id);
  if (cur === id) { jump(sec, false); if (sec) history.replaceState(null, "", "#/" + id); return; }

  cur = id; curData = null; lastIdx = -1;
  switchView("reader");
  $("#rNum").textContent = label(it);
  $("#rTitle").textContent = it.title;
  $("#rTopic").textContent = it.topic;
  $("#rMeta").textContent = `約${fmt(it.chars)}字 ・ 読了まで約${mins(it.chars)}分`;
  $("#barTitle").textContent = `${label(it)}　${it.title}`;
  document.title = `${it.title} — DX小説`;
  body.innerHTML = '<p class="loading">読み込み中…</p>';
  renderNav(it);
  renderToc(it, it.sections);
  scrollTo(0, 0);

  let data;
  try { data = await loadData(id); }
  catch (e) {
    if (cur !== id) return;
    body.innerHTML = `<p class="err">本文を読み込めませんでした（${esc(e.message)}）。<a href="#/${id}" data-reload>再読み込み</a></p>`;
    body.querySelector("[data-reload]").onclick = () => location.reload();
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

/* ---------- 一覧 ---------- */
function showIndex() {
  cur = null; curData = null;
  switchView("index");
  document.title = "DX小説";

  const last = LS.get(K.last);
  const lastIt = last && ITEMS.find(x => x.id === last.id);
  const res = $("#resume");
  if (lastIt) {
    const p = LS.get(K.pos(lastIt.id), {});
    res.hidden = false;
    res.href = `#/${lastIt.id}`;
    $("#resT").textContent = `${label(lastIt)}　${lastIt.title}`;
    $("#resS").textContent = p.done ? "読み終えています。もう一度読む →"
      : p.n && p.i > 0 ? `${pct(p)}% まで読みました。続きから →` : "最初から読む →";
  } else res.hidden = true;

  $("#list").innerHTML = ITEMS.map(it => {
    const p = LS.get(K.pos(it.id), {});
    const pc = p.n ? pct(p) : 0;
    const state = p.done ? "done" : pc > 0 ? "doing" : "";
    const tail = p.done ? " ・ 読了" : pc > 0 ? ` ・ ${pc}%` : "";
    return `<a class="item ${state}" href="#/${it.id}">
      <span class="num">${it.num}</span>
      <span class="main">
        <span class="t">${esc(it.title)}</span>
        <span class="topic">${esc(it.topic)}</span>
        <span class="meta">約${fmt(it.chars)}字 ・ 約${mins(it.chars)}分 ・ ${it.sections.length}章${tail}</span>
        <span class="pbar"><i style="width:${p.done ? 100 : pc}%"></i></span>
      </span></a>`;
  }).join("");
  scrollTo(0, 0);
}

function switchView(name) {
  closeSheets();
  bar.classList.remove("hide");
  $("#index").classList.toggle("on", name === "index");
  $("#reader").classList.toggle("on", name === "reader");
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
$("#toc").addEventListener("click", e => { if (e.target.closest("a")) closeSheets(); });

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
  h = h.replace(/^#\/?/, "");
  const [id, sec] = h.split("/");
  if (id && ITEMS.some(x => x.id === id)) showReader(id, sec || "");
  else { if (h) history.replaceState(null, "", "#/"); showIndex(); }
}

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
applyPrefs(false);
addEventListener("hashchange", route);
route();
})();
