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
const ready = async () => {
  for (let i = 0; i < 40; i++) {
    const ok = await ev(`document.readyState === "complete" && (!!document.querySelector("#index.on") || (!!document.querySelector("#reader.on") && document.querySelector("#body").children.length > 3))`).catch(() => false);
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
  await ready(); await sleep(250);
}
async function shot(name) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  const f = path.join(OUT, `${name}.png`);
  await writeFile(f, Buffer.from(data, "base64"));
  console.log(`  📷 ${f}`);
}
/** 画面上でいちばん上に見えているブロック番号（app.js と同じ定義） */
const firstVisible = () => ev(`(() => { const els = document.querySelector("#body").children, top = document.querySelector("#bar").offsetHeight + 6;
  for (let i = 0; i < els.length; i++) if (els[i].getBoundingClientRect().bottom > top) return i; return els.length - 1; })()`);

const results = [];
const check = (name, cond, detail = "") => { results.push({ name, ok: !!cond }); console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`); };

try {
  /* ---------- 見た目（スマホ実寸 390px・明るい配色） ---------- */
  console.log("見た目: スマホ 390×844");
  await device(390, 844, true); await scheme("light");
  await goto("#/", { reload: true }); await ev("localStorage.clear(); true");
  await goto("#/", { reload: true }); await shot("sp-index");
  await goto("#/ch01"); await shot("sp-reader");
  await goto("#/ch01/s7"); await sleep(200); await shot("sp-appendix");
  await goto("#/ch09/s1"); await ev(`document.querySelector("#body pre").scrollIntoView({block:"center"}); true`); await sleep(200); await shot("sp-code");
  await goto("#/ch01/top"); await ev(`document.querySelector("#setBtn").click(); true`); await sleep(200); await shot("sp-settings");
  await ev(`document.querySelector("#scrim").click(); document.querySelector("#tocBtn").click(); true`); await sleep(200); await shot("sp-toc");
  await ev(`document.querySelector("#scrim").click(); document.querySelector("[data-th=sepia]").click(); document.querySelector("[data-font=serif]").click();
    for (let i = 0; i < 4; i++) document.querySelector('[data-fs="1"]').click(); true`); await sleep(300); await shot("sp-sepia-serif-22px");
  await ev(`document.querySelector("[data-th=dark]").click(); true`); await sleep(200); await shot("sp-dark");
  await ev(`document.querySelector("[data-th=auto]").click(); document.querySelector("[data-font=sans]").click(); for (let i = 0; i < 4; i++) document.querySelector('[data-fs="-1"]').click(); true`);

  console.log("見た目: PC 1280×900");
  await device(1280, 900, false);
  await goto("#/"); await shot("pc-index");
  await goto("#/ch05/s3"); await ev(`document.querySelector("#body pre").scrollIntoView({block:"center"}); true`); await sleep(200); await shot("pc-code");
  await goto("#/ch01/s7"); await sleep(200); await shot("pc-appendix");
  await ev(`document.querySelector("#tocBtn").click(); true`); await sleep(200); await shot("pc-toc");
  await ev(`document.querySelector("#scrim").click(); true`);
  await scheme("dark"); await goto("#/ch02"); await shot("pc-dark-reader"); await scheme("light");

  /* ---------- 挙動 ---------- */
  console.log("挙動");
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
  await ev(`document.querySelector('[data-fs="-1"]').click(); true`); await sleep(200);
  check("先頭で文字サイズを変えても表題が見えたまま", (await ev("scrollY")) < 5, `scrollY=${await ev("scrollY")}`);
  await ev(`document.querySelector('[data-fs="1"]').click(); document.querySelector("#body").children[60].scrollIntoView({block:"start"}); true`); await sleep(400);

  await goto("#/");
  check("一覧に「前回の続き」が出る", !(await ev(`document.querySelector("#resume").hidden`)) && /%/.test(await ev(`document.querySelector("#resS").textContent`)),
    await ev(`document.querySelector("#resS").textContent`));
  check("一覧の話に読了率が出る", /%/.test(await ev(`document.querySelector('.item[href="#/ch01"] .meta').textContent`)));

  const saved = await ev(`JSON.parse(localStorage.getItem("dxn:pos:ch01")).i`);
  await goto("#/ch01", { reload: true }); await sleep(300);
  const restored = await firstVisible();
  check("再読み込み後に保存した段落へ戻る", Math.abs(restored - saved) <= 1, `保存=${saved} 復元=${restored}`);

  await goto("#/ch01/s3"); await sleep(200);
  const top = await ev(`document.getElementById("s3").getBoundingClientRect().top`);
  check("目次から章へ飛ぶとヘッダーの下に見出しが来る", top >= 48 && top <= 80, `top=${Math.round(top)}`);
  check("章への直リンクは #/ch01 に置き換わる", (await ev("location.hash")) === "#/ch01", await ev("location.hash"));

  await ev(`document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); true`); await ready(); await sleep(200);
  check("→ キーで次の話へ", (await ev("location.hash")) === "#/ch02" && (await ev(`document.querySelector("#rTitle").textContent`)) === "二つの登山靴");

  await ev(`scrollTo(0, document.documentElement.scrollHeight); true`); await sleep(400);
  check("最後まで読むと読了になる", (await ev(`JSON.parse(localStorage.getItem("dxn:pos:ch02")).done`)) === true);
  await goto("#/");
  check("一覧に読了が出る", /読了/.test(await ev(`document.querySelector('.item[href="#/ch02"] .meta').textContent`)));

  await device(390, 844, true); await goto("#/ch01/s7"); await sleep(200);
  const stacked = await ev(`getComputedStyle(document.querySelector("#body tbody tr")).display`);
  check("スマホでは付録の表がカードに積まれる", stacked === "block", `tr.display=${stacked}`);
  const overflow = await ev(`document.documentElement.scrollWidth <= innerWidth`);
  check("スマホで横にはみ出さない", overflow, `scrollWidth ok=${overflow}`);
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
console.log(ng.length ? `検証 NG（${ng.length} 件）` : `検証 OK（${results.length} 件）・画像: ${OUT}`);
process.exit(ng.length ? 1 : 0);
