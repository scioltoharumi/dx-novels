/**
 * content/*.md + meta/ → site/dist/
 *
 *   index.html          一覧・あらすじ・人物・本文（1枚の HTML。location.hash で画面を切り替える）
 *   app.js, style.css   site/ からコピー
 *   img/                site/img/ をそのままコピー（表紙・肖像・キービジュアル）
 *   data/manifest.json  話の一覧（本文は含まない）
 *   data/<id>.json      1話ぶんの本文（HTML 化済み）
 *   data/meta.json      あらすじ・登場人物（meta/ をまとめたもの）
 *   version.txt         配信中の版（コミットハッシュ＋時刻）
 *
 * 原稿の約束ごと（README 参照）:
 *   - ファイル名の先頭の数字が話の順番。例: ch01_三つの売上（BI・DWH）_改稿版.md
 *   - 1行目の「# 見出し」がタイトル。「（改稿版）」のような版名は表示から外す
 *   - ファイル名の（ ）の中身をテーマとして一覧に添える
 *   - 「## 見出し」が章。目次はこれで作る
 * meta/ の型は meta/SCHEMA.md。無くてもビルドは通る（あらすじ・人物のページが「準備中」になる）。
 */
import { readdir, readFile, writeFile, mkdir, rm, copyFile, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CONTENT = path.join(ROOT, "content");
export const META = path.join(ROOT, "meta");
export const SITE = path.join(ROOT, "site");
export const DIST = path.join(SITE, "dist");

/** 話ごとの色。表紙の代替表示・進捗バー・年表の点に使う。10色を順に割り当てる */
export const PALETTE = ["#3b6ea5", "#4f8a5b", "#b5842a", "#6b6bb5", "#2a8a8a", "#b5563b", "#8a6d3b", "#7a5c9e", "#c0392b", "#3b7fa5"];
const IMG_EXT = ["svg", "jpg", "jpeg", "png", "webp"];   // svg が先。同名があればベクターを優先する

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 行内の装飾。エスケープしてから太字・コード・リンクだけ置き換える */
function inline(s) {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return t;
}

function table(rows) {
  const cells = r => r.replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map(c => c.trim());
  const isSep = r => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(r);
  let head = null, body;
  if (rows.length >= 2 && isSep(rows[1])) { head = cells(rows[0]); body = rows.slice(2).map(cells); }
  else body = rows.filter(r => !isSep(r)).map(cells);
  const th = head ? `<thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead>` : "";
  // data-h はスマホでの縦積み表示（見出しを各セルの左に出す）に使う
  const tb = body.map(r =>
    `<tr>${r.map((c, j) => `<td${head ? ` data-h="${esc(head[j] || "")}"` : ""}>${inline(c)}</td>`).join("")}</tr>`
  ).join("");
  return `<div class="tbl"><table>${th}<tbody>${tb}</tbody></table></div>`;
}

/**
 * 小説向けの最小 Markdown 変換。
 * 段落は「1行＝1段落」（原稿が全段落を空行で区切っているため）。改行の連結はしない。
 */
export function parseMarkdown(md) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out = [], sections = [];
  let title = null, secN = 0, i = 0;

  while (i < lines.length) {
    const l = lines[i];

    if (/^```/.test(l)) {                                     // コードブロック（図表・年表など）
      const lang = l.slice(3).trim();
      const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      if (h[1].length === 1 && title === null) { title = h[2].trim(); i++; continue; }   // 最初の H1 はタイトル
      const lvl = Math.min(3, Math.max(2, h[1].length));
      const id = `s${++secN}`, t = h[2].trim();
      sections.push({ id, title: t });
      out.push(`<h${lvl} id="${id}">${inline(t)}</h${lvl}>`);
      i++; continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)) {              // --- は場面転換
      out.push('<div class="sep" role="separator">＊</div>'); i++; continue;
    }
    if (/^>/.test(l)) {                                        // 引用（ノートの書き付け）
      const paras = [[]];
      while (i < lines.length && /^>/.test(lines[i])) {
        const c = lines[i].replace(/^>\s?/, "");
        if (c.trim() === "") { if (paras[paras.length - 1].length) paras.push([]); }
        else paras[paras.length - 1].push(c);
        i++;
      }
      out.push(`<blockquote>${paras.filter(p => p.length).map(p => `<p>${p.map(inline).join("<br>")}</p>`).join("")}</blockquote>`);
      continue;
    }
    if (/^\|/.test(l)) {                                       // 表（付録の用語集）
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      out.push(table(rows)); continue;
    }
    if (/^\s*[-*+]\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      out.push(`<ul>${items.map(x => `<li>${inline(x)}</li>`).join("")}</ul>`); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      out.push(`<ol>${items.map(x => `<li>${inline(x)}</li>`).join("")}</ol>`); continue;
    }
    if (l.trim() === "") { i++; continue; }

    // 会話文（「 で始まる行）は括弧をぶら下げて揃える
    const cls = /^[「『（【]/.test(l) ? ' class="q"' : "";
    out.push(`<p${cls}>${inline(l)}</p>`);
    i++;
  }
  return { title, sections, blocks: out.length, html: out.join("\n") };
}

/** ファイル名から 番号・テーマ・仮タイトル を取り出す。
 *  ex01_… / 番外編01_… は番外編（本編の番号を持たず、本編のあとに並ぶ。id は ex01） */
export function metaFromName(name) {
  const base = name.replace(/\.md$/i, "");
  const extra = (base.match(/^(?:ex|番外編?)[_\-\s]*(\d+)/i) || [])[1];
  const num = extra ? null : (base.match(/^\D*?(\d+(?:\.\d+)?)/) || [])[1];   // 06 のほか 06.1 のような枝番も許す
  const topic = (base.match(/[（(]([^）)]+)[）)]/) || [])[1] || "";
  const fileTitle = base
    .replace(/^\D*?\d+(?:\.\d+)?[_\-\s]*/, "")
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[_\-\s]*改稿版.*$/, "")
    .replace(/[_\-\s]+$/, "");
  return { num: num ? Number(num) : null, extra: extra ? Number(extra) : null, topic, fileTitle };
}

/** 6 → ch06、6.1 → ch06-1（枝番は id に "-" で付ける。URL や data/ のファイル名に "." を出さない） */
export function idFromNum(num) {
  const [ip, fp] = String(num).split(".");
  return `ch${ip.padStart(2, "0")}${fp ? `-${fp}` : ""}`;
}

/** ファイル名から 並び順の番号・id・番外編の番号 を決める（build と art で同じ規則を使う） */
export function entryFromName(name, idx = 0) {
  const m = metaFromName(name);
  // 番外編は本編のあと（900 番台）に並べる。表示は app.js が「番外編」にする
  const num = m.extra != null ? 900 + m.extra : m.num ?? 1000 + idx;
  const id = m.extra != null ? `ex${String(m.extra).padStart(2, "0")}` : m.num != null ? idFromNum(num) : `n${idx + 1}`;
  return { ...m, num, id };
}

const stripEdition = t => t.replace(/\s*[（(]\s*改稿版\s*[）)]\s*$/, "").trim();
const splitTopic = t => t.split(/[・、,/／]/).map(s => s.trim()).filter(Boolean);

function version() {
  const run = cmd => execSync(cmd, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  let sha = (process.env.GITHUB_SHA || "").slice(0, 7), dirty = "";
  if (!sha) {
    try { sha = run("git rev-parse --short HEAD"); } catch { sha = "local"; }
    try { if (run("git status --porcelain")) dirty = "+"; } catch {}
  }
  const p = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  const stamp = `${g("year")}-${g("month")}-${g("day")} ${g("hour")}:${g("minute")}`;
  return { label: `${sha}${dirty}  ${stamp}`, v: `${sha}${dirty ? "x" : ""}-${stamp.replace(/\D/g, "")}` };
}

/** meta/ の JSON。無ければ fallback。壊れていれば止める（黙って空にすると気づけない） */
async function readJSON(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (e) {
    if (e.code === "ENOENT") return fallback;
    throw new Error(`${path.relative(ROOT, file)} を読めません: ${e.message}`);
  }
}

/** site/img/<dir>/<base>.(jpg|png|webp) があれば配信パスを返す */
function findImage(dir, base) {
  for (const ext of IMG_EXT) {
    if (existsSync(path.join(SITE, "img", dir, `${base}.${ext}`))) return `img/${dir}/${base}.${ext}`;
  }
  return null;
}

export async function build() {
  const files = (await readdir(CONTENT)).filter(f => /\.md$/i.test(f)).sort();
  if (files.length === 0) throw new Error(`原稿がありません: ${CONTENT}`);

  /* ---- 本文 ---- */
  const items = [];
  for (const [idx, file] of files.entries()) {
    const md = await readFile(path.join(CONTENT, file), "utf8");
    const m = entryFromName(file, idx);
    const p = parseMarkdown(md);
    const { num, id } = m;
    const title = stripEdition(p.title || m.fileTitle || file.replace(/\.md$/i, ""));
    const chars = [...md.replace(/^#.*$/gm, "").replace(/```[\s\S]*?```/g, "").replace(/\s+/g, "")].length;
    items.push({ id, num, extra: m.extra, title, topic: m.topic, chars, blocks: p.blocks, sections: p.sections, file, html: p.html });
  }
  items.sort((a, b) => a.num - b.num || a.file.localeCompare(b.file, "ja"));
  const dup = items.map(x => x.id).filter((x, i, a) => a.indexOf(x) !== i);
  if (dup.length) throw new Error(`話の番号が重複しています: ${dup.join(", ")}（ファイル名の先頭の数字を直してください）`);

  /* ---- あらすじ・人物（meta/） ---- */
  const series = await readJSON(path.join(META, "series.json"), null);
  const charDb = await readJSON(path.join(META, "characters.json"), { groups: [], characters: [] });
  const novels = {};
  for (const it of items) novels[it.id] = await readJSON(path.join(META, "novels", `${it.id}.json`), null);

  items.forEach((it, i) => {
    const n = novels[it.id];
    it.color = PALETTE[i % PALETTE.length];
    it.cover = findImage("covers", it.id);
    it.catch = n?.catch || "";
    it.tagline = n?.tagline || "";
    it.themes = (n?.themes && n.themes.length) ? n.themes : splitTopic(it.topic);
  });

  // 人物: プロフィールに、話ごとの役割と語録を novels/ から集めて足す
  const characters = (charDb.characters || []).map(c => {
    const appear = [], quotes = [];
    for (const it of items) {
      const n = novels[it.id];
      if (!n) continue;
      const cast = (n.cast || []).find(x => x.id === c.id);
      if (cast) appear.push({ id: it.id, importance: cast.importance || "sub", role: cast.role || "", arc: cast.arc || "" });
      for (const q of n.quotes || []) if (q.who === c.id) quotes.push({ novel: it.id, text: q.text, context: q.context || "" });
    }
    return { ...c, portrait: findImage("characters", c.id), novels: appear, quotes };
  });
  const meta = {
    series,
    groups: charDb.groups || [],
    characters,
    novels: Object.fromEntries(items.map(it => {
      const n = novels[it.id];
      if (!n) return [it.id, null];
      const { castFacts, ...rest } = n;       // castFacts は人物マスタを作るための材料。配信しない
      return [it.id, rest];
    })),
  };

  /* ---- 書き出し ---- */
  const ver = version();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, "data"), { recursive: true });

  for (const it of items) {
    const { html, ...rest } = it;
    await writeFile(path.join(DIST, "data", `${it.id}.json`), JSON.stringify({ ...rest, html }));
  }
  const keyImage = IMG_EXT.map(e => `key.${e}`).find(f => existsSync(path.join(SITE, "img", f)));
  const manifest = {
    v: ver.v, version: ver.label,
    series: series ? { title: series.title, subtitle: series.subtitle, tagline: series.tagline, lead: series.lead, kicker: series.kicker } : null,
    key: keyImage ? `img/${keyImage}` : null,
    items: items.map(({ html, ...rest }) => rest),
  };
  await writeFile(path.join(DIST, "data", "manifest.json"), JSON.stringify(manifest));
  await writeFile(path.join(DIST, "data", "meta.json"), JSON.stringify(meta));

  const tpl = await readFile(path.join(SITE, "index.html"), "utf8");
  const html = tpl
    .replace(/\{\{MANIFEST\}\}/g, JSON.stringify(manifest).replace(/</g, "\\u003c"))
    .replace(/\{\{VERSION\}\}/g, esc(ver.label))
    .replace(/\{\{TITLE\}\}/g, esc(series?.title || "作品集"))
    .replace(/\{\{V\}\}/g, encodeURIComponent(ver.v));
  await writeFile(path.join(DIST, "index.html"), html);
  for (const f of ["app.js", "style.css"]) await copyFile(path.join(SITE, f), path.join(DIST, f));
  if (existsSync(path.join(SITE, "img"))) await cp(path.join(SITE, "img"), path.join(DIST, "img"), { recursive: true });
  await writeFile(path.join(DIST, "version.txt"), ver.label);
  await writeFile(path.join(DIST, ".nojekyll"), "");

  const total = items.reduce((s, x) => s + x.chars, 0);
  const withMeta = items.filter(it => novels[it.id]).length;
  console.log(`版 ${ver.label}`);
  for (const it of items) console.log(`  ${it.id}  ${it.title}（${it.topic}）  ${it.chars.toLocaleString()}字 / ${it.sections.length}章${novels[it.id] ? "" : "  ※あらすじ未整備"}${it.cover ? "  表紙あり" : ""}`);
  console.log(`${items.length} 話・合計 ${total.toLocaleString()} 字・あらすじ ${withMeta}/${items.length} 話・人物 ${characters.length} 人（肖像 ${characters.filter(c => c.portrait).length}）→ ${path.relative(ROOT, DIST)}`);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch(e => { console.error(e.message); process.exit(1); });
}
