/**
 * content/*.md → site/dist/
 *
 *   index.html          一覧と本文（1枚の HTML。location.hash で画面を切り替える）
 *   app.js, style.css   site/ からコピー
 *   data/manifest.json  話の一覧（本文は含まない）
 *   data/<id>.json      1話ぶんの本文（HTML 化済み）
 *   version.txt         配信中の版（コミットハッシュ＋時刻）
 *
 * 原稿の約束ごと（README 参照）:
 *   - ファイル名の先頭の数字が話の順番。例: ch01_三つの売上（BI・DWH）_改稿版.md
 *   - 1行目の「# 見出し」がタイトル。「（改稿版）」のような版名は表示から外す
 *   - ファイル名の（ ）の中身をテーマとして一覧に添える
 *   - 「## 見出し」が章。目次はこれで作る
 */
import { readdir, readFile, writeFile, mkdir, rm, copyFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const CONTENT = path.join(ROOT, "content");
export const SITE = path.join(ROOT, "site");
export const DIST = path.join(SITE, "dist");

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

/** ファイル名から 番号・テーマ・仮タイトル を取り出す */
export function metaFromName(name) {
  const base = name.replace(/\.md$/i, "");
  const num = (base.match(/^\D*?(\d+)/) || [])[1];
  const topic = (base.match(/[（(]([^）)]+)[）)]/) || [])[1] || "";
  const fileTitle = base
    .replace(/^\D*?\d+[_\-\s]*/, "")
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[_\-\s]*改稿版.*$/, "")
    .replace(/[_\-\s]+$/, "");
  return { num: num ? Number(num) : null, topic, fileTitle };
}

const stripEdition = t => t.replace(/\s*[（(]\s*改稿版\s*[）)]\s*$/, "").trim();

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

export async function build() {
  const files = (await readdir(CONTENT)).filter(f => /\.md$/i.test(f)).sort();
  if (files.length === 0) throw new Error(`原稿がありません: ${CONTENT}`);

  const items = [];
  for (const [idx, file] of files.entries()) {
    const md = await readFile(path.join(CONTENT, file), "utf8");
    const m = metaFromName(file);
    const p = parseMarkdown(md);
    const num = m.num ?? 1000 + idx;
    const id = m.num != null ? `ch${String(num).padStart(2, "0")}` : `n${idx + 1}`;
    const title = stripEdition(p.title || m.fileTitle || base(file));
    const chars = [...md.replace(/^#.*$/gm, "").replace(/```[\s\S]*?```/g, "").replace(/\s+/g, "")].length;
    items.push({ id, num, title, topic: m.topic, chars, blocks: p.blocks, sections: p.sections, file, html: p.html });
  }
  items.sort((a, b) => a.num - b.num || a.file.localeCompare(b.file, "ja"));
  const dup = items.map(x => x.id).filter((x, i, a) => a.indexOf(x) !== i);
  if (dup.length) throw new Error(`話の番号が重複しています: ${dup.join(", ")}（ファイル名の先頭の数字を直してください）`);

  const ver = version();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(path.join(DIST, "data"), { recursive: true });

  for (const it of items) {
    const { html, ...meta } = it;
    await writeFile(path.join(DIST, "data", `${it.id}.json`), JSON.stringify({ ...meta, html }));
  }
  const manifest = {
    v: ver.v, version: ver.label,
    items: items.map(({ html, ...meta }) => meta),
  };
  await writeFile(path.join(DIST, "data", "manifest.json"), JSON.stringify(manifest));

  const tpl = await readFile(path.join(SITE, "index.html"), "utf8");
  const html = tpl
    .replace(/\{\{MANIFEST\}\}/g, JSON.stringify(manifest).replace(/</g, "\\u003c"))
    .replace(/\{\{VERSION\}\}/g, esc(ver.label))
    .replace(/\{\{V\}\}/g, encodeURIComponent(ver.v));
  await writeFile(path.join(DIST, "index.html"), html);
  for (const f of ["app.js", "style.css"]) await copyFile(path.join(SITE, f), path.join(DIST, f));
  await writeFile(path.join(DIST, "version.txt"), ver.label);
  await writeFile(path.join(DIST, ".nojekyll"), "");

  const total = items.reduce((s, x) => s + x.chars, 0);
  console.log(`版 ${ver.label}`);
  for (const it of items) console.log(`  ${it.id}  ${it.title}（${it.topic}）  ${it.chars.toLocaleString()}字 / ${it.sections.length}章`);
  console.log(`${items.length} 話・合計 ${total.toLocaleString()} 字 → ${path.relative(ROOT, DIST)}`);
  return manifest;
}

const base = f => f.replace(/\.md$/i, "");

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch(e => { console.error(e.message); process.exit(1); });
}
