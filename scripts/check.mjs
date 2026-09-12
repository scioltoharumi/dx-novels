/**
 * ビルド結果の不変条件を検査する。壊れた変換を公開しないための門番。
 * deploy.yml では build のあとに実行し、落ちたらデプロイしない。
 *
 *   node scripts/check.mjs
 *
 * 方針: 原稿だけ足した（あらすじ未整備の）話があっても止めない。
 *       あらすじ・人物のデータが「ある」のに参照が壊れているときは止める。
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { CONTENT, DIST, ROOT } from "./build.mjs";

const fails = [], warns = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const warn = (cond, msg) => { if (!cond) warns.push(msg); };

const md = (await readdir(CONTENT)).filter(f => /\.md$/i.test(f));
const manifest = JSON.parse(await readFile(path.join(DIST, "data", "manifest.json"), "utf8"));
ok(manifest.items.length === md.length, `一覧の話数 ${manifest.items.length} が原稿 ${md.length} 件と一致しない`);

/* ---- 本文 ---- */
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
  ok(/^#[0-9a-f]{6}$/i.test(it.color || ""), `${it.id}: 色が割り当てられていない`);
}

/* ---- あらすじ・人物 ---- */
const meta = JSON.parse(await readFile(path.join(DIST, "data", "meta.json"), "utf8"));
const charIds = new Set(meta.characters.map(c => c.id));
const groupIds = new Set(meta.groups.map(g => g.id));
ok(new Set(meta.characters.map(c => c.id)).size === meta.characters.length, "人物 id が重複している");

for (const it of manifest.items) {
  const n = meta.novels[it.id];
  warn(!!n, `${it.id}: あらすじ（meta/novels/${it.id}.json）が無い。ページは「準備中」表示になる`);
  if (!n) continue;
  const j = JSON.parse(await readFile(path.join(DIST, "data", `${it.id}.json`), "utf8"));
  ok(n.catch && n.synopsis, `${it.id}: catch か synopsis が空`);
  ok((n.chapters || []).length === j.sections.length, `${it.id}: あらすじの章数 ${(n.chapters || []).length} が本文の見出し数 ${j.sections.length} と一致しない`);
  (n.chapters || []).forEach((c, i) => ok(c.id === j.sections[i]?.id, `${it.id}: chapters[${i}].id=${c.id} が本文の ${j.sections[i]?.id} と食い違う`));
  for (const c of n.cast || []) ok(charIds.has(c.id), `${it.id}: cast の人物 "${c.id}" が characters.json に無い`);
  for (const q of n.quotes || []) ok(q.who === "narration" || charIds.has(q.who), `${it.id}: quotes の人物 "${q.who}" が characters.json に無い`);
  for (const c of n.cast || []) ok(["main", "sub", "cameo"].includes(c.importance), `${it.id}: cast "${c.id}" の importance が不正（${c.importance}）`);
}
for (const c of meta.characters) {
  ok(c.name, `人物 ${c.id}: name が空`);
  ok(groupIds.has(c.group), `人物 ${c.id}: group "${c.group}" が groups に無い`);
  ok(["main", "sub", "cameo"].includes(c.importance), `人物 ${c.id}: importance が不正（${c.importance}）`);
  warn(c.novels.length >= 1, `人物 ${c.id}（${c.name}）: どの話の cast にも出てこない`);
  for (const r of c.relations || []) ok(charIds.has(r.to), `人物 ${c.id}: relations の相手 "${r.to}" が居ない`);
}
if (meta.series) {
  ok(meta.series.title, "series.json: title が空");
  for (const t of meta.series.timeline || []) ok(manifest.items.some(it => it.id === t.novel), `series.json: timeline の novel "${t.novel}" が無い`);
}

/* ---- 絵の発注データ（meta/art.json）。配信には載らないが、揃っていないと発注書に穴が開く ---- */
try {
  const art = JSON.parse(await readFile(path.join(ROOT, "meta", "art.json"), "utf8"));
  for (const k of ["style", "portraitComposition", "coverComposition", "keyComposition", "avoid"])
    ok(art[k] && art[k].ja && art[k].en, `art.json: ${k} の ja / en が揃っていない`);
  for (const c of meta.characters) {
    const p = (art.portraits || {})[c.id];
    warn(!!p, `art.json: 人物 ${c.id}（${c.name}）の肖像プロンプトが無い。npm run art で発注書に載らない`);
    if (!p) continue;
    ok(p.ja && p.en, `art.json: portraits.${c.id} の ja / en が揃っていない`);
    ok(["male", "female", "unspecified"].includes(p.gender), `art.json: portraits.${c.id} の gender が不正（${p.gender}）`);
    ok(p.age && p.genderSource, `art.json: portraits.${c.id} の age / genderSource が空`);
  }
  for (const id of Object.keys(art.portraits || {}))
    warn(meta.characters.some(c => c.id === id), `art.json: portraits の "${id}" に対応する人物が characters.json に無い`);
} catch (e) {
  if (e.code !== "ENOENT") fails.push(`meta/art.json を読めません: ${e.message}`);
}

/* ---- index.html ---- */
const html = await readFile(path.join(DIST, "index.html"), "utf8");
ok(html.includes("__MANIFEST__=") && !html.includes("{{"), "index.html の埋め込み（{{…}}）が未完了");
ok(/name="robots"\s+content="noindex/.test(html), "index.html に noindex が無い");
ok(html.includes(`app.js?v=`) && html.includes(`style.css?v=`), "index.html の app.js / style.css に版パラメータが無い");

for (const w of warns) console.warn("  注意: " + w);
if (fails.length) {
  console.error(`検査 NG（${fails.length} 件）`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log(`検査 OK: ${manifest.items.length} 話・人物 ${meta.characters.length} 人・版 ${manifest.version}${warns.length ? `（注意 ${warns.length} 件）` : ""}`);
