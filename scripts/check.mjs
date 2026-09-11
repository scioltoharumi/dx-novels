/**
 * ビルド結果の不変条件を検査する。壊れた変換を公開しないための門番。
 * deploy.yml では build のあとに実行し、落ちたらデプロイしない。
 *
 *   node scripts/check.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { CONTENT, DIST } from "./build.mjs";

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };

const md = (await readdir(CONTENT)).filter(f => /\.md$/i.test(f));
const manifest = JSON.parse(await readFile(path.join(DIST, "data", "manifest.json"), "utf8"));
ok(manifest.items.length === md.length, `一覧の話数 ${manifest.items.length} が原稿 ${md.length} 件と一致しない`);

for (const it of manifest.items) {
  const j = JSON.parse(await readFile(path.join(DIST, "data", `${it.id}.json`), "utf8"));
  ok(j.html.length > 0, `${it.id}: 本文が空`);
  ok(!/<script/i.test(j.html), `${it.id}: script が混入している`);

  // コードブロックの中は原稿どおりで良いので除外してから、Markdown 記号の取りこぼしを探す
  const text = j.html.replace(/<pre[\s\S]*?<\/pre>/g, "").replace(/<[^>]+>/g, "");
  ok(!/\*\*|```/.test(text), `${it.id}: 未変換の Markdown 記号（** または \`\`\`）が本文に残っている`);
  // 「　#alerts に…」のような本文（全角スペース＋#）は見出しではないので、見出し構文（# と空白）だけを見る
  ok(!/^(#{1,4}\s|\||>)/m.test(text), `${it.id}: 未変換の行頭記号（# | >）が本文に残っている`);
  ok(!/^\s*-{3,}\s*$/m.test(text), `${it.id}: 未変換の区切り線が本文に残っている`);
  ok(!/&(?!amp;|lt;|gt;|quot;|#\d+;)/.test(j.html.replace(/<pre[\s\S]*?<\/pre>/g, "")), `${it.id}: エスケープされていない & がある`);

  const ids = j.sections.map(s => s.id);
  ok(ids.length >= 1, `${it.id}: 章が1つも検出されない`);
  ok(new Set(ids).size === ids.length, `${it.id}: 章 id が重複`);
  for (const s of j.sections) ok(j.html.includes(`id="${s.id}"`), `${it.id}: 章 ${s.id}「${s.title}」の見出しが本文にない`);

  const src = await readFile(path.join(CONTENT, it.file), "utf8");
  const heads = src.replace(/```[\s\S]*?```/g, "").split(/\r?\n/).filter(l => /^#{2,4}\s/.test(l)).length;
  ok(heads === j.sections.length, `${it.id}: 見出し数が原稿 ${heads} と変換 ${j.sections.length} で食い違う`);

  ok(it.chars > 500, `${it.id}: 文字数が少なすぎる（${it.chars}）`);
  ok(it.title && !/改稿版/.test(it.title), `${it.id}: タイトルに版名が残っている（${it.title}）`);
  ok(it.blocks === (j.html.match(/^<(p|h[23]|div|blockquote|pre|ul|ol)\b/gm) || []).length,
    `${it.id}: ブロック数 ${it.blocks} と本文の要素数が食い違う（読書位置の復元がずれる）`);
}

const html = await readFile(path.join(DIST, "index.html"), "utf8");
ok(html.includes("__MANIFEST__=") && !html.includes("{{"), "index.html の埋め込み（{{…}}）が未完了");
ok(/name="robots"\s+content="noindex/.test(html), "index.html に noindex が無い");
ok(html.includes(`app.js?v=`) && html.includes(`style.css?v=`), "index.html の app.js / style.css に版パラメータが無い");

if (fails.length) {
  console.error(`検査 NG（${fails.length} 件）`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log(`検査 OK: ${manifest.items.length} 話・版 ${manifest.version}`);
