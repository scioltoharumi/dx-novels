/**
 * 絵の発注書を作る。meta/art.json の画風・構図と、meta/ の物語データを組み合わせて、
 * そのまま画像生成に貼れるプロンプトを1枚にまとめる。
 *
 *   node scripts/art.mjs        → meta/ART_BRIEF.md を書き出し、不足している絵を一覧する
 *
 * 画像は site/img/ の下に、ここで指定した名前で置けばよい。置いて push すれば自動で反映される。
 * 拡張子は .jpg / .jpeg / .png / .webp のどれでもよい。
 *
 * 直すところ:
 *   画風・構図・禁止事項   → meta/art.json の style / *Composition / avoid
 *   個人の見た目・年齢・性別 → meta/art.json の portraits.<id>
 *   人物そのもの（名前・所属・紹介文）→ meta/characters.json
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, META, SITE, PALETTE } from "./build.mjs";

const IMG_EXT = ["svg", "jpg", "jpeg", "png", "webp"];
const found = (dir, base) => IMG_EXT.map(e => path.join(SITE, "img", dir, `${base}.${e}`)).find(existsSync);
const foundRoot = base => IMG_EXT.map(e => path.join(SITE, "img", `${base}.${e}`)).find(existsSync);

const art = JSON.parse(await readFile(path.join(META, "art.json"), "utf8"));
const series = JSON.parse(await readFile(path.join(META, "series.json"), "utf8"));
const chars = JSON.parse(await readFile(path.join(META, "characters.json"), "utf8"));
const groupName = Object.fromEntries((chars.groups || []).map(g => [g.id, g.name]));
const novels = [];
for (let i = 1; i <= 99; i++) {
  const id = `ch${String(i).padStart(2, "0")}`;
  const f = path.join(META, "novels", `${id}.json`);
  if (existsSync(f)) novels.push(JSON.parse(await readFile(f, "utf8")));
}
const color = i => PALETTE[i % PALETTE.length];

/** 画風＋個別＋構図＋禁止 を1つの貼り付け用ブロックにする */
const block = (lang, body, composition) => [
  art.style[lang], body, art[composition][lang], art.avoid[lang],
].filter(Boolean).join("\n\n");

const rows = [];

/* ---- キービジュアル ---- */
rows.push({
  kind: "キービジュアル", id: "key", file: "site/img/key.jpg",
  shape: "横長 16:9（1920×1080 以上）", have: !!foundRoot("key"),
  what: `${series.title} のトップの背景に薄く敷く1枚。${series.tagline}`,
  ja: block("ja", "神田の雑居ビルの四階にある、窓の小さな薄暗い小部屋。机に三枚のモニターが並び、黒い画面が青白く光っている。机の端に、空の串が何本も立った缶。手前に開いたノートとペン。人物は描かないか、椅子の背に見える後ろ姿のシルエット程度にとどめる。夜。落ち着いた青緑の色調。", "keyComposition"),
  en: block("en", "A dim small room on the fourth floor of a cramped multi-tenant building in Kanda, Tokyo, with one small window. Three monitors side by side on the desk, their black screens glowing pale blue. At the edge of the desk, a can holding many empty food skewers. In the foreground, an open notebook and a pen. Either no people at all, or at most a silhouette of someone's back over a chair. Night. Muted blue-green palette.", "keyComposition"),
});

/* ---- 表紙 ---- */
novels.forEach((n, i) => {
  const c = color(i);
  const body = `第${i + 1}話「${n.title || n.id}」の表紙。この話の芯は「${n.catch}」。扱う題材は ${(n.themes || []).join("・")}。象徴として使えるモチーフ: ${(n.keywords || []).slice(0, 5).join("、")}。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は ${c}。`;
  const bodyEn = `Cover art for episode ${i + 1}, "${n.title || n.id}". The core of this episode: ${n.catch} Subject matter: ${(n.themes || []).join(", ")}. Motifs that can be used symbolically: ${(n.keywords || []).slice(0, 5).join(", ")}. Setting: the office, warehouse, or factory of a small Japanese company. Base color: ${c}.`;
  rows.push({
    kind: `表紙 ${n.id}`, id: n.id, file: `site/img/covers/${n.id}.jpg`,
    shape: "縦長 2:3（1200×1800 以上）", have: !!found("covers", n.id),
    what: `第${i + 1}話「${n.title || n.id}」 ${n.catch}`,
    ja: block("ja", body, "coverComposition"), en: block("en", bodyEn, "coverComposition"),
  });
});

/* ---- 肖像 ---- */
const missingPortrait = [];
for (const c of chars.characters) {
  const p = art.portraits[c.id];
  if (!p) { missingPortrait.push(c.id); continue; }
  const where = [groupName[c.group], c.affiliation, c.title].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i).join(" ・ ");
  rows.push({
    kind: `肖像 ${c.id}`, id: c.id, file: `site/img/characters/${c.id}.jpg`,
    shape: "正方形 1:1（1024×1024 以上・円形に切り抜いて使う）", have: !!found("characters", c.id),
    what: `${c.name}（${c.reading || "読み未設定"}）／${where}`,
    note: `${c.oneLiner}\n- **年齢**: ${p.age}　**性別**: ${p.gender === "female" ? "女性" : p.gender === "male" ? "男性" : "未指定"} — ${p.genderSource}${p.tell ? `\n- **見分けどころ**: ${p.tell}` : ""}`,
    ja: block("ja", p.ja, "portraitComposition"), en: block("en", p.en, "portraitComposition"),
  });
}

const kinds = k => rows.filter(r => r.kind.startsWith(k));
const md = `# 絵の発注書（自動生成）

\`npm run art\` が \`meta/\` から書き出す。**このファイルを手で直しても次の実行で消える。**
直すのは次の場所。

| 直したいもの | 直す場所 |
|---|---|
| 画風・構図・禁止事項 | \`meta/art.json\` の \`style\` / \`portraitComposition\` / \`coverComposition\` / \`keyComposition\` / \`avoid\` |
| 個人の見た目・年齢・性別 | \`meta/art.json\` の \`portraits.<id>\` |
| 人物そのもの（名前・所属・紹介文） | \`meta/characters.json\` |

## 置き方

1. 下の **ファイル** の名前で \`site/img/\` の下に置く（拡張子は jpg / png / webp のどれでもよい）
2. \`git add . && git commit && git push\`

置いていない絵は、色と題名・姓の一文字による自動の代替表示のままになる。**一部だけ置いてもよい。**

## 全体の考え方

${art.concept}

## 肖像の作り方（ここが肝心）

肖像は **正方形で作って、アプリ側が円形に切り抜いて表示する**。表示は 44px（一覧の小）／48px（相関図）／64px（人物カード）／128px（人物ページの見出し）の4サイズ。

- **四隅は切り落とされる。** 顔と小物は中央に寄せる
- **頭の上に余白を1割。** 詰めると円の縁で頭頂が切れる
- **背景は紙の白のまま。** 室内や小物を描くと、円に切られて意味不明な断片になる
- **色が使えない。** 髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさで差を付ける
- 25人を**同じペンの太さ・同じハッチングの密度で**揃える。1人ずつ作るなら、最初の1枚を参照画像に使うか、同じシード・同じスタイル指定を使い回す

### 見分けどころの一覧（白黒で25人を取り違えないための対照表）

| 人物 | 年齢 | 見分けどころ |
|---|---|---|
${chars.characters.filter(c => art.portraits[c.id]).map(c => `| ${c.name} | ${art.portraits[c.id].age} | ${art.portraits[c.id].tell || "—"} |`).join("\n")}

${(() => {
  const pick = key => chars.characters.filter(c => art.portraits[c.id]?.[key]).map(c => `${c.name}（${art.portraits[c.id][key]}）`);
  const g = pick("glasses"), b = pick("beard");
  return [
    `**眼鏡はこの ${g.length} 人だけ。** ${g.join(" / ")}　—— 形が違うので取り違えないこと。ほかの ${chars.characters.length - g.length} 人に眼鏡をかけさせない。`,
    `**髭はこの ${b.length} 人だけ。** ${b.join(" / ")}　—— ほかの人物に髭を生やさない。`,
    `残りは髪のかたち・襟のかたち・服の明度（白／中間／濃い）で分ける。**同じ組み合わせの人を二人作らない。**`,
  ].join("\n\n");
})()}

## 性別について

${art.genderPolicy}

| 原文で明記 | 人物 |
|---|---|
| 明記あり | ${chars.characters.filter(c => art.portraits[c.id]?.genderSource?.startsWith("原文")).map(c => c.name).join("・")} |
| 提案（変更可） | ${chars.characters.filter(c => art.portraits[c.id] && !art.portraits[c.id].genderSource?.startsWith("原文")).map(c => c.name).join("・")} |

## 状況

| 種別 | 枚数 | 用意済み | 未 |
|---|---|---|---|
| キービジュアル | ${kinds("キービジュアル").length} | ${kinds("キービジュアル").filter(r => r.have).length} | ${kinds("キービジュアル").filter(r => !r.have).length} |
| 表紙 | ${kinds("表紙").length} | ${kinds("表紙").filter(r => r.have).length} | ${kinds("表紙").filter(r => !r.have).length} |
| 肖像 | ${kinds("肖像").length} | ${kinds("肖像").filter(r => r.have).length} | ${kinds("肖像").filter(r => !r.have).length} |

---

${rows.map(r => `## ${r.kind}${r.have ? "　✅ 用意済み" : ""}

- **ファイル**: \`${r.file}\`
- **形**: ${r.shape}
- **誰・何**: ${r.what}
${r.note ? `- ${r.note}\n` : ""}
<details><summary>日本語プロンプト（貼り付け用）</summary>

\`\`\`text
${r.ja}
\`\`\`

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

\`\`\`text
${r.en}
\`\`\`

</details>
`).join("\n---\n\n")}
`;

await writeFile(path.join(META, "ART_BRIEF.md"), md, "utf8");
const miss = rows.filter(r => !r.have);
console.log(`meta/ART_BRIEF.md を書き出しました（${rows.length} 枚ぶん）`);
console.log(`  用意済み ${rows.length - miss.length} / 未 ${miss.length}`);
if (missingPortrait.length) console.log(`  ⚠ meta/art.json の portraits に指定が無い人物: ${missingPortrait.join(", ")}`);
if (miss.length) {
  console.log("  未のファイル:");
  for (const r of miss) console.log("    " + r.file);
}
