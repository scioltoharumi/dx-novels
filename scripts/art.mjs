/**
 * 絵の発注書を作る。meta/ の内容から「どのファイルを、どの形で、何を描いて置くか」を1枚にまとめる。
 *
 *   node scripts/art.mjs        → meta/ART_BRIEF.md を書き出し、不足している絵を一覧する
 *
 * 画像は site/img/ の下に、ここで指定した名前で置けばよい。置いて push すれば自動で反映される。
 * 拡張子は .jpg / .jpeg / .png / .webp のどれでもよい。
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, META, SITE, PALETTE } from "./build.mjs";

const IMG_EXT = ["jpg", "jpeg", "png", "webp"];
const found = (dir, base) => IMG_EXT.map(e => path.join(SITE, "img", dir, `${base}.${e}`)).find(existsSync);
const foundRoot = base => IMG_EXT.map(e => path.join(SITE, "img", `${base}.${e}`)).find(existsSync);
const rel = f => path.relative(ROOT, f).replace(/\\/g, "/");

const series = JSON.parse(await readFile(path.join(META, "series.json"), "utf8"));
const chars = JSON.parse(await readFile(path.join(META, "characters.json"), "utf8"));
const novels = [];
for (let i = 1; i <= 99; i++) {
  const id = `ch${String(i).padStart(2, "0")}`;
  const f = path.join(META, "novels", `${id}.json`);
  if (existsSync(f)) novels.push(JSON.parse(await readFile(f, "utf8")));
}
const color = i => PALETTE[i % PALETTE.length];

const rows = [];
const key = foundRoot("key");
rows.push({ kind: "キービジュアル", file: "site/img/key.jpg", shape: "横長 16:9（1920×1080 目安）", have: !!key,
  what: `${series.title}のトップに敷く1枚。${series.tagline}`,
  prompt: "神田の雑居ビルの四階、窓の小さい小部屋。三枚のモニターの青白い光。机に空の串が立った缶。手前に開いたノートとペン。人物は入れないか、後ろ姿のシルエット程度。落ち着いた青緑の色調、写実寄り、夜。" });

novels.forEach((n, i) => {
  const f = found("covers", n.id);
  rows.push({ kind: `表紙 ${n.id}`, file: `site/img/covers/${n.id}.jpg`, shape: "縦長 2:3（1200×1800 目安）", have: !!f,
    what: `第${i + 1}話「${n.title || n.id}」 ${n.catch}`,
    prompt: `${n.catch} テーマは${(n.themes || []).join("・")}。題名の文字は入れない（アプリ側で重ねない設計だが、絵だけで成立させる）。基調色は ${color(i)}。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。キーワード: ${(n.keywords || []).slice(0, 5).join("、")}。` });
});

for (const c of chars.characters) {
  const f = found("characters", c.id);
  rows.push({ kind: `肖像 ${c.id}`, file: `site/img/characters/${c.id}.jpg`, shape: "正方形 1:1（800×800 目安・顔から胸まで）", have: !!f,
    what: `${c.name}（${c.reading || "読み未設定"}） ${c.oneLiner}`, prompt: c.imagePrompt || "" });
}

const miss = rows.filter(r => !r.have);
const md = `# 絵の発注書（自動生成）

\`node scripts/art.mjs\` が \`meta/\` から書き出す。手で編集しても次回の実行で上書きされるので、
直すときは \`meta/characters.json\` の \`imagePrompt\` か \`meta/series.json\` を直す。

## 置き方

1. 下の表の **ファイル** の名前で \`site/img/\` の下に置く（拡張子は jpg / png / webp のどれでもよい）
2. \`git add . && git commit && git push\`

置いていない絵は、色と題名・姓の一文字による自動の代替表示になる。**一部だけ置いてもよい。**
絵があるものだけ差し替わる。

## 状況

| 種別 | 用意済み | 未 |
|---|---|---|
| キービジュアル | ${rows.filter(r => r.kind === "キービジュアル" && r.have).length} | ${rows.filter(r => r.kind === "キービジュアル" && !r.have).length} |
| 表紙 | ${rows.filter(r => r.kind.startsWith("表紙") && r.have).length} | ${rows.filter(r => r.kind.startsWith("表紙") && !r.have).length} |
| 肖像 | ${rows.filter(r => r.kind.startsWith("肖像") && r.have).length} | ${rows.filter(r => r.kind.startsWith("肖像") && !r.have).length} |

---

${rows.map(r => `### ${r.kind}${r.have ? "　✅ 用意済み" : ""}

- **ファイル**: \`${r.file}\`
- **形**: ${r.shape}
- **何の絵か**: ${r.what}

\`\`\`
${r.prompt}
\`\`\`
`).join("\n")}
`;

await writeFile(path.join(META, "ART_BRIEF.md"), md, "utf8");
console.log(`meta/ART_BRIEF.md を書き出しました（${rows.length} 枚ぶん）`);
console.log(`  用意済み ${rows.length - miss.length} / 未 ${miss.length}`);
if (miss.length) {
  console.log("  未のファイル:");
  for (const r of miss) console.log("    " + r.file);
}
