/**
 * 見た目と挙動の検証。ヘッドレス Edge/Chrome を DevTools プロトコルで直接動かす（Playwright 不要・依存ゼロ）。
 *
 *   npm run serve            （別ターミナルで。既定 http://127.0.0.1:8000）
 *   node scripts/shot.mjs    → スクリーンショットを書き出し、挙動の検査を PASS/FAIL で出す
 *
 * 環境変数: BASE_URL（配信元）, SHOT_DIR（出力先）, BROWSER_EXE（ブラウザの実行ファイル）
 *
 * なぜ --screenshot 引数ではなくこの方法か:
 *   Edge の --screenshot はスクロール後の領域を描かず、ページ途中（付録の表など）を撮ると真っ黒になる。
 *   また幅 500px 未満に縮められない。DevTools 経由なら 390px の実寸で、任意の位置・操作後の画面が撮れる。
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

// この検証はブラウザを1つ丸ごと起動する。空きメモリが足りないと、
// エラーも出さずに途中で落ちる（外から kill される）ので、先に知らせる。
const freeGB = os.freemem() / 1024 ** 3;
if (freeGB < 1.5) {
  console.warn(`⚠ 空きメモリが ${freeGB.toFixed(2)} GB しかありません。`);
  console.warn("  途中で無言のまま止まることがあります。残っているブラウザを終了してから実行してください:");
  console.warn("  Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force");
}

const BASE = (process.env.BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const OUT = process.env.SHOT_DIR || path.join(os.tmpdir(), "dx-novels-shots");
const EXE = process.env.BROWSER_EXE || [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium",
].find(existsSync);
if (!EXE) { console.error("ブラウザが見つかりません。BROWSER_EXE で指定してください"); process.exit(2); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
const PORT = 9300 + Math.floor(Math.random() * 600);
const PROFILE = path.join(os.tmpdir(), `dxn-shot-${process.pid}`);

class CDP {
  constructor(url) {
    this.ws = new WebSocket(url); this.id = 0; this.pending = new Map(); this.handlers = [];
    this.ws.addEventListener("message", e => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method) this.handlers.forEach(h => h(m));
    });
  }
  open() { return new Promise((res, rej) => { this.ws.addEventListener("open", res, { once: true }); this.ws.addEventListener("error", rej, { once: true }); }); }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }
  on(fn) { this.handlers.push(fn); }
  close() { this.ws.close(); }
}

/* ---------- 起動 ---------- */
await mkdir(OUT, { recursive: true });
const proc = spawn(EXE, [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--no-first-run",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, "about:blank",
], { stdio: "ignore" });

let wsUrl = null;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    const page = list.find(t => t.type === "page");
    if (page) wsUrl = page.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await sleep(250);
}
if (!wsUrl) { proc.kill(); console.error("ブラウザに接続できませんでした"); process.exit(2); }

const cdp = new CDP(wsUrl);
await cdp.open();
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
const errors = [];
cdp.on(m => {
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map(a => a.value ?? a.description).join(" "));
});

const ev = async expr => {
  const r = await cdp.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error("evaluate: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
};
/** 画面が描き終わるまで待つ。あらすじ・人物は meta.json を取りに行くので「読み込み中…」が消えるのを待つ */
const ready = async () => {
  for (let i = 0; i < 60; i++) {
    const ok = await ev(`(() => {
      const v = document.querySelector(".view.on"); if (!v) return false;
      if (document.readyState !== "complete") return false;
      if (v.querySelector(".loading")) return false;
      if (v.id === "reader") return document.querySelector("#body").children.length > 3;
      return v.textContent.trim().length > 10;   // エラー表示（「その人物は見つかりません」）も「用意できた」とみなす
    })()`).catch(() => false);
    if (ok) return;
    await sleep(150);
  }
  throw new Error("ページが用意できない");
};
const device = (w, h, mobile) => cdp.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
const scheme = v => cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: v }] });
async function goto(hash, { reload = false } = {}) {
  if (reload) {
    await cdp.send("Page.navigate", { url: "about:blank" }); await sleep(100);
    await cdp.send("Page.navigate", { url: `${BASE}/${hash}` });
  } else {
    const same = await ev(`location.origin === ${JSON.stringify(new URL(BASE).origin)}`).catch(() => false);
    if (same) await ev(`location.hash = ${JSON.stringify(hash)}; true`);
    else await cdp.send("Page.navigate", { url: `${BASE}/${hash}` });
  }
  await ready(); await sleep(280);
}
async function shot(name) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(OUT, `${name}.png`), Buffer.from(data, "base64"));
}
/** 画面上でいちばん上に見えているブロック番号（app.js と同じ定義） */
const firstVisible = () => ev(`(() => { const els = document.querySelector("#body").children, top = document.querySelector("#bar").offsetHeight + 6;
  for (let i = 0; i < els.length; i++) if (els[i].getBoundingClientRect().bottom > top) return i; return els.length - 1; })()`);

const results = [];
const check = (name, cond, detail = "") => { results.push({ name, ok: !!cond }); console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`); };

try {
  /* ---------- 見た目（スマホ実寸 390px） ---------- */
  console.log("見た目: スマホ 390×844");
  await device(390, 844, true); await scheme("light");
  await goto("#/", { reload: true }); await ev("localStorage.clear(); true");
  await goto("#/", { reload: true }); await shot("sp-home");
  await ev(`scrollTo(0, 560); true`); await sleep(250); await shot("sp-home-shelf");
  await goto("#/about"); await shot("sp-about");
  await ev(`document.querySelectorAll(".sec")[1]?.scrollIntoView(); true`); await sleep(250); await shot("sp-about-timeline");
  await goto("#/synopsis/ch01"); await shot("sp-synopsis");
  await ev(`document.querySelectorAll("details.spoiler").forEach(d => d.open = true); document.querySelectorAll(".sec")[2]?.scrollIntoView(); true`); await sleep(250); await shot("sp-synopsis-cast");
  await goto("#/characters"); await shot("sp-characters");
  await ev(`document.querySelector(".relwrap")?.scrollIntoView(); true`); await sleep(250); await shot("sp-relmap");
  await goto("#/characters/akaumi"); await shot("sp-character");
  await ev(`scrollTo(0, 700); true`); await sleep(250); await shot("sp-character-2");
  await goto("#/ch01"); await shot("sp-reader");
  await goto("#/ch01/s7"); await sleep(200); await shot("sp-appendix");
  await goto("#/ch09/s1"); await ev(`document.querySelector("#body pre").scrollIntoView({block:"center"}); true`); await sleep(200); await shot("sp-code");
  await goto("#/ch01/top"); await ev(`document.querySelector("#setBtn").click(); true`); await sleep(250); await shot("sp-settings");
  await ev(`document.querySelector("#scrim").click(); document.querySelector("#tocBtn").click(); true`); await sleep(250); await shot("sp-toc");
  await ev(`document.querySelector("#scrim").click(); document.querySelector("[data-th=sepia]").click(); document.querySelector("[data-font=serif]").click();
    for (let i = 0; i < 4; i++) document.querySelector('[data-fs="1"]').click(); true`); await sleep(300); await shot("sp-sepia-serif-22px");
  await ev(`document.querySelector("[data-th=dark]").click(); true`); await sleep(200); await shot("sp-dark");
  await goto("#/"); await shot("sp-home-dark");
  await ev(`document.querySelector("#setBtnTop").click(); document.querySelector("[data-th=auto]").click(); document.querySelector("[data-font=sans]").click();
    for (let i = 0; i < 4; i++) document.querySelector('[data-fs="-1"]').click(); document.querySelector("#scrim").click(); true`);

  console.log("見た目: PC 1280×900");
  await device(1280, 900, false);
  await goto("#/"); await shot("pc-home");
  await ev(`scrollTo(0, 520); true`); await sleep(250); await shot("pc-home-shelf");
  await goto("#/about"); await shot("pc-about");
  await goto("#/synopsis/ch07"); await shot("pc-synopsis");
  await ev(`document.querySelectorAll("details.spoiler").forEach(d => d.open = true); true`); await sleep(250);
  await ev(`scrollTo(0, 900); true`); await sleep(250); await shot("pc-synopsis-2");
  await goto("#/characters"); await shot("pc-characters");
  await ev(`document.querySelector(".relwrap").scrollIntoView({block:"center"}); true`); await sleep(300); await shot("pc-relmap");
  await goto("#/characters/rino"); await shot("pc-character");
  await goto("#/ch05/s3"); await ev(`document.querySelector("#body pre").scrollIntoView({block:"center"}); true`); await sleep(200); await shot("pc-code");
  await goto("#/ch01/s7"); await sleep(200); await shot("pc-appendix");
  await scheme("dark"); await goto("#/characters"); await shot("pc-characters-dark"); await scheme("light");

  /* ---------- 挙動：本文 ---------- */
  console.log("挙動: 本文");
  await device(390, 844, true);
  await goto("#/", { reload: true }); await ev("localStorage.clear(); true");
  await goto("#/ch01", { reload: true });

  await ev(`document.querySelector("#body").children[60].scrollIntoView({block:"start"}); true`); await sleep(400);
  const pos = await ev(`JSON.parse(localStorage.getItem("dxn:pos:ch01") || "null")`);
  check("読書位置がブロック番号で保存される", pos && Math.abs(pos.i - 60) <= 1, `i=${pos && pos.i}`);
  check("下スクロールでヘッダーが隠れる", await ev(`document.querySelector("#bar").classList.contains("hide")`));
  await ev(`scrollBy(0, -200); true`); await sleep(300);
  check("上スクロールでヘッダーが戻る", !(await ev(`document.querySelector("#bar").classList.contains("hide")`)));

  const before = await firstVisible();
  await ev(`document.querySelector("#setBtn").click(); document.querySelector('[data-fs="1"]').click(); document.querySelector('[data-fs="1"]').click(); true`); await sleep(400);
  const after = await firstVisible();
  check("文字サイズを変えても読んでいた段落が残る", Math.abs(after - before) <= 1, `${before} → ${after}`);
  check("文字サイズが保存される", (await ev(`JSON.parse(localStorage.getItem("dxn:prefs")).fs`)) === 20);
  check("設定変更の位置合わせでヘッダーが隠れない", !(await ev(`document.querySelector("#bar").classList.contains("hide")`)));
  await ev(`document.querySelector("#scrim").click(); true`);
  await goto("#/ch01/top"); await sleep(200);
  await ev(`document.querySelector("#setBtn").click(); document.querySelector('[data-fs="-1"]').click(); document.querySelector("#scrim").click(); true`); await sleep(250);
  check("先頭で文字サイズを変えても表題が見えたまま", (await ev("scrollY")) < 5, `scrollY=${await ev("scrollY")}`);
  await ev(`document.querySelector("#body").children[60].scrollIntoView({block:"start"}); true`); await sleep(400);

  const saved = await ev(`JSON.parse(localStorage.getItem("dxn:pos:ch01")).i`);
  await goto("#/ch01", { reload: true }); await sleep(300);
  check("再読み込み後に保存した段落へ戻る", Math.abs((await firstVisible()) - saved) <= 1, `保存=${saved}`);

  await goto("#/ch01/s3"); await sleep(200);
  const top = await ev(`document.getElementById("s3").getBoundingClientRect().top`);
  check("目次から章へ飛ぶとヘッダーの下に見出しが来る", top >= 48 && top <= 80, `top=${Math.round(top)}`);
  check("章への直リンクは #/ch01 に置き換わる", (await ev("location.hash")) === "#/ch01");

  await ev(`document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); true`); await ready(); await sleep(200);
  check("→ キーで次の話へ", (await ev("location.hash")) === "#/ch02" && (await ev(`document.querySelector("#rTitle").textContent`)) === "二つの登山靴");
  await ev(`scrollTo(0, document.documentElement.scrollHeight); true`); await sleep(400);
  check("最後まで読むと読了になる", (await ev(`JSON.parse(localStorage.getItem("dxn:pos:ch02")).done`)) === true);

  /* ---------- 挙動：トップ・あらすじ・人物 ---------- */
  console.log("挙動: あらすじ・人物");
  await goto("#/");
  check("トップに「前回の続き」が出る", !(await ev(`document.querySelector("#resume").hidden`)));
  check("作品棚に全10話が並ぶ", (await ev(`document.querySelectorAll("#list .book").length`)) === 10);
  check("読了の話に読了が出る", /読了/.test(await ev(`document.querySelector('.book[data-id="ch02"] .meta').textContent`)));
  // 表紙は画像があれば img、無ければ色＋縦書きの題名。どちらの経路も壊れていないことを見る
  const cover = await ev(`(() => { const el = document.querySelector('.book[data-id="ch01"] .cover');
    const img = el.querySelector("img"); return img ? "img:" + img.getAttribute("src") : "ph:" + (el.querySelector(".v")?.textContent || ""); })()`);
  check("表紙が画像か、題名の代替表示で描かれる", cover === "ph:三つの売上" || /^img:img\/covers\/ch01\./.test(cover), cover);
  if (/^img:/.test(cover)) {
    check("表紙の画像が実際に読み込めている",
      await ev(`(() => { const i = document.querySelector('.book[data-id="ch01"] .cover img'); return i.complete && i.naturalWidth > 0; })()`));
  }

  await goto("#/about");
  check("あらすじページに年表が10件出る", (await ev(`document.querySelectorAll("#aboutMain .tl li").length`)) === 10);
  check("あらすじページに各話のあらすじカードが10件出る", (await ev(`document.querySelectorAll("#aboutMain .syn-card").length`)) === 10);
  check("あらすじカードに本文が入っている", (await ev(`document.querySelector("#aboutMain .syn-card .d").textContent.length`)) > 60);

  await goto("#/synopsis/ch01");
  check("各話あらすじに登場人物が出る", (await ev(`document.querySelectorAll("#synMain .castcard").length`)) >= 5);
  check("章ごとのあらすじが本文の章数と一致する", (await ev(`document.querySelectorAll("#synMain .chap li").length`)) === (await ev(`__MANIFEST__.items.find(x=>x.id==="ch01").sections.length`)));
  check("結末までがネタバレ折りたたみになっている", (await ev(`document.querySelectorAll("#synMain details.spoiler").length`)) === 2 && !(await ev(`document.querySelector("#synMain details.spoiler").open`)));
  check("語録が出る", (await ev(`document.querySelectorAll("#synMain .quotes .q").length`)) >= 5);
  check("覚える仕組みが出る", (await ev(`document.querySelectorAll("#synMain .lesson").length`)) >= 5);
  await ev(`document.querySelector('#synMain .castcard[href="#/characters/rino"]').click(); true`); await ready(); await sleep(250);
  check("あらすじの人物カードから人物詳細へ飛べる", (await ev("location.hash")) === "#/characters/rino" && (await ev(`document.querySelector("#charMain h1").textContent`)).includes("佐伯"));

  await goto("#/characters");
  const total = await ev(`document.querySelectorAll("#chGrid .person").length`);
  check("人物一覧が全員出る", total >= 20, `${total}人`);
  check("相関図が描かれる", (await ev(`document.querySelectorAll(".relmap .node").length`)) >= 15);
  check("相関図のノードが円の中に収まっている",
    await ev(`[...document.querySelectorAll(".relmap .node circle")].every(c => {
      const x = +c.getAttribute("cx"), y = +c.getAttribute("cy"), r = +c.getAttribute("r");
      return x - r >= 0 && y - r >= 0 && x + r <= 760 && y + r <= 760; })`));
  check("相関図の線に関係の説明が付く", (await ev(`document.querySelector(".relmap line title").textContent.length`)) > 10);
  await ev(`document.querySelector('#chFilters [data-g="outside"]').click(); true`); await sleep(250);
  const filtered = await ev(`document.querySelectorAll("#chGrid .person").length`);
  check("所属で絞り込める", filtered > 0 && filtered < total, `社外 ${filtered}人 / 全${total}人`);
  await ev(`document.querySelector('#chFilters [data-g="all"]').click(); true`); await sleep(200);

  await goto("#/characters/akaumi");
  check("人物詳細に登場する話が出る", (await ev(`document.querySelectorAll("#charMain .tl li").length`)) === 10);
  check("人物詳細に語録が出る", (await ev(`document.querySelectorAll("#charMain .quotes .q").length`)) >= 3);
  check("人物詳細に関係が出る", (await ev(`document.querySelectorAll("#charMain .rel").length`)) >= 3);
  check("人物詳細に外見が出る（絵の材料）", (await ev(`document.querySelectorAll("#charMain .plain li").length`)) >= 5);
  await ev(`document.querySelector('#charMain .tl a[href^="#/synopsis/"]').click(); true`); await ready(); await sleep(250);
  check("人物詳細からあらすじへ飛べる", /^#\/synopsis\//.test(await ev("location.hash")));

  await goto("#/characters/nobody-xyz"); await sleep(300);
  check("居ない人物 id でも壊れない", /見つかりません/.test(await ev(`document.querySelector("#charMain").textContent`)));
  await goto("#/no-such-page", { reload: true });
  check("知らない URL はトップに戻る", (await ev("location.hash")) === "#/" && (await ev(`!!document.querySelector("#home.on")`)));

  /* ---------- レイアウト ---------- */
  console.log("挙動: レイアウト");
  for (const [name, hash] of [["トップ", "#/"], ["あらすじ", "#/about"], ["各話あらすじ", "#/synopsis/ch07"], ["人物一覧", "#/characters"], ["人物詳細", "#/characters/rino"], ["本文", "#/ch01"]]) {
    await device(390, 844, true); await goto(hash);
    check(`スマホで横にはみ出さない（${name}）`, await ev(`document.documentElement.scrollWidth <= innerWidth + 1`),
      `scrollWidth=${await ev("document.documentElement.scrollWidth")}`);
  }
  await device(390, 844, true); await goto("#/ch01/s7"); await sleep(200);
  check("スマホでは付録の表がカードに積まれる", (await ev(`getComputedStyle(document.querySelector("#body tbody tr")).display`)) === "block");
  await device(1280, 900, false); await goto("#/ch01/s7"); await sleep(200);
  check("PC では付録の表が表のまま", (await ev(`getComputedStyle(document.querySelector("#body tbody tr")).display`)) === "table-row");

  check("コンソールにエラーが出ていない", errors.length === 0, errors.slice(0, 3).join(" | "));
} catch (e) {
  console.error("検証中にエラー:", e.message);
  results.push({ name: "実行", ok: false });
} finally {
  cdp.close(); proc.kill();
  await sleep(300);
  await rm(PROFILE, { recursive: true, force: true }).catch(() => {});
}

const ng = results.filter(r => !r.ok);
console.log(ng.length ? `検証 NG（${ng.length} 件 / 全${results.length} 件）` : `検証 OK（${results.length} 件）・画像: ${OUT}`);
process.exit(ng.length ? 1 : 0);
