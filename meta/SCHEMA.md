# meta/ — あらすじ・登場人物のデータ

`content/` の原稿から抽出した、あらすじページと登場人物ページの元データ。ビルド（`scripts/build.mjs`）が読み、
`site/dist/data/meta.json` にまとめて配信する。手で直してよい（直したら push すれば反映される）。

```
meta/
├── SCHEMA.md            本書
├── series.json          シリーズ全体（世界観・会社・年表）
├── characters.json      登場人物マスタ（プロフィール。話ごとの役割は novels/ から集める）
├── novels/chNN.json     話ごとのあらすじ・章別あらすじ・登場人物の役割・語録・学ぶ仕組み
├── art.json             絵の指定（画風・構図・禁止事項・人物ごとの見た目）
└── ART_BRIEF.md         絵の発注書。`npm run art` が生成する。手で編集しない
```

文体は **常体（だ・である）・三人称・現在形中心**。台詞の引用は原文ママ。

---

## novels/chNN.json

```jsonc
{
  "id": "ch01",                       // content/ のファイル名の番号と一致させる
  "catch": "一文のキャッチコピー（20〜40字。ネタバレなし）",
  "tagline": "サブコピー（40〜70字。何を覚える話かが分かる）",
  "period": "物語内の時期（例: 1年目・12月〜翌年6月。原稿に根拠がなければ null）",
  "synopsis": "ネタバレなしのあらすじ（200〜300字）",
  "full": "ネタバレありの全体あらすじ（500〜800字。結末まで）",
  "chapters": [                       // 原稿の ## 見出しと同じ順・同じ数。付録も含める
    { "id": "s1", "title": "第一章　三つの売上", "summary": "章のあらすじ（150〜250字。付録は 30〜60字）" }
  ],
  "themes": ["BI", "データレイク", "DWH"],              // ファイル名の（ ）から。3〜5個
  "lessons": [                                          // 付録の表から、話の核になるもの 5〜8個
    { "term": "物語での呼び方", "formal": "正式名称", "point": "何が分かるかを一文で（40〜80字）" }
  ],
  "cast": [                                             // この話に出る人物。importance 順
    {
      "id": "rino",                   // characters.json の id。既知の人物は下の一覧の id を使う
      "importance": "main",           // main（物語を動かす）| sub（要所で出る）| cameo（名前が出る程度）
      "role": "この話での立場・役割（40〜80字）",
      "arc": "この話での変化・見せ場・印象的な行動（80〜150字）"
    }
  ],
  "castFacts": [                                        // 人物マスタを作るための材料。原稿に根拠のあることだけ
    {
      "id": "rino",
      "name": "佐伯梨乃",             // 原稿での表記（姓名が分かれば姓名。片方しか出なければその片方）
      "reading": "さえき りの",       // 原稿にルビ等の根拠がなければ最も自然な読みを入れ readingGuessed を true に
      "readingGuessed": true,
      "affiliation": "株式会社ヤマビコ 経営企画室",   // 所属（会社と部署）
      "title": "",                    // 肩書き（社長・営業部長など。無ければ ""）
      "facts": ["入社二年目", "営業事務から経営企画室に異動して三か月"],     // 年次・経歴・家族など
      "appearance": ["三枚のモニターに向かっている", "串の缶が机にある"],   // 外見・持ち物・癖。絵を描くための材料
      "traits": ["例え話が例えになっていない", "反射で返事をする"],          // 性格・話し方・口癖
      "relations": [ { "to": "akaumi", "how": "教わる側。四階の小部屋に通う" } ]
    }
  ],
  "quotes": [                                           // 印象的な台詞・地の文 5〜8個。原文ママ・60字以内
    { "who": "okochi", "text": "売上ってのはな、会社の体温みたいなもんだ", "context": "月曜の朝礼後の廊下で梨乃に（30〜60字）" }
  ],
  "keywords": ["こめかみ", "平熱", "六十回"],           // 印象的なモチーフ・繰り返される言葉 5〜10個
  "newSystems": ["S3（データレイク）", "Snowflake（DWH）", "dbt", "Power BI"],   // この話で導入・登場した仕組み
  "companyState": "この話の終わりでヤマビコの仕組み・組織がどうなったか（100〜200字）",
  "companyStateTitle": "この話の終わりの大鳥グループ"   // 省略可。番外編など舞台が別の会社のとき、見出しを変える
}
```

### 既知の人物 id（castFacts / cast / quotes で使う）

| id | 人物 | 手がかり |
|---|---|---|
| rino | 佐伯梨乃 | 経営企画室。語り手に近い主人公 |
| okochi | 大河内 | 社長。例え話 |
| mikami | 三上 | 営業部長。こめかみ |
| morita | 森田 | マーケティング |
| tanaka | 田中 | Excel の人 |
| akaumi | 赤海 | 四階の小部屋。夜座の人 |
| hayase | 早瀬 | 新人。「当たりましたか」 |
| okazaki | 岡崎 | |
| shimura | 志村 | |
| tachibana | 橘 | |
| takanashi | 高梨 | |
| kiriyama | 桐山 | 「赤海語録」 |
| yanagi | 柳 | |
| sato | 佐藤 | 社長と呼ばれる |
| kumagai | 熊谷 | |
| kawabe | 川辺 | |
| nishimura | 西村 | |
| sanada | 真田 | |
| kaicho | 会長 | 名前が出ればその姓で id を付け直してよい（例: 会長の姓が出たら `kaicho` のまま name に姓を入れる） |
| minato | 湊 早紀 | 番外編。大鳥ビジネスサービスの入金消込チームのリーダー |
| saginuma | 鷺沼 | 番外編。夜座コンサルティング。「どこで生まれましたか」 |
| koga | 古賀 | 番外編。入金消込二十八年。「癖です」 |
| kurihara | 栗原 | 番外編。社長の「AI で」を数える |
| makabe | 真壁 | 番外編。大鳥ビジネスサービス社長 |
| tojo | 東條 | 番外編。大鳥 HD 内部監査室長 |
| hatori / otake / sawai / udagawa / hinata | 羽鳥 / 大竹 / 沢井 / 宇田川 / 日向 | 番外編。大鳥グループ各社の業務オーナー |

- 一覧に無い人物は **ローマ字の小文字 id** を新設する（例: `yamada`）。姓が同じ別人がいる場合は `sato2` ではなく所属で区別できる id にする（例: `sato_maruka`）
- 「佐藤花子」のようにデータの例として出てくる名前、「客」「営業」のような一般名詞は人物にしない
- 会社・製品（ライズ・丸嘉・オーダーリンク等）は人物ではない。`newSystems` や `keywords` に入れる

---

## characters.json（人物マスタ）

```jsonc
{
  "groups": [ { "id": "yamabiko", "name": "株式会社ヤマビコ", "color": "#3b6ea5" } ],
  "characters": [
    {
      "id": "rino", "name": "佐伯 梨乃", "reading": "さえき りの",
      "group": "yamabiko", "affiliation": "経営企画室", "title": "",
      "importance": "main",                       // シリーズ全体での重み
      "oneLiner": "一文の紹介（40〜70字）",
      "profile": [["入社", "二年目（第1話時点）"], ["前職", "営業事務"]],
      "traits": ["…"], "appearance": ["…"],
      "relations": [ { "to": "akaumi", "how": "…" } ]
    }
  ]
}
```

話ごとの役割（`cast`）と語録（`quotes`）は novels/ から自動で集めるので、ここには書かない。
**絵の指示はここではなく `art.json` に書く**（物語のデータと制作のデータを混ぜないため）。

---

## art.json（絵の指定）

```jsonc
{
  "style":               { "ja": "画風。25人ぶんを同じ絵柄に揃えるための指定", "en": "…" },
  "portraitComposition": { "ja": "肖像の構図。円形に切り抜く前提の指定", "en": "…" },
  "coverComposition":    { "ja": "表紙の構図", "en": "…" },
  "keyComposition":      { "ja": "キービジュアルの構図", "en": "…" },
  "avoid":               { "ja": "全部に共通の禁止事項", "en": "…" },
  "genderPolicy": "性別の扱いについての注記",
  "portraits": {
    "rino": {
      "age": "20代半ば",
      "gender": "female | male | unspecified",
      "genderSource": "原文明記（…）| 提案（原稿に記載なし）",
      "ja": "その人の見た目だけを書く（100〜200字）。画風と構図は style / portraitComposition が付くので繰り返さない",
      "en": "同じ内容の英語"
    }
  }
}
```

- `npm run art` が `style` + 個別 + `*Composition` + `avoid` を連結して、貼り付けられるプロンプトにする
- **原稿で性別が明記されているのは 柳・川辺・熊谷 の3人だけ。** 他は `genderSource` に「提案」と書いてあるので、変えてよい
- 人物を足したら `portraits` にも足す。忘れると `npm test` が注意を出す

---

## series.json

```jsonc
{
  "title": "平熱", "subtitle": "株式会社ヤマビコの三年", "tagline": "…", "lead": "…（100〜200字）",
  "world": { "company": [["社名", "株式会社ヤマビコ"], ["業種", "…"]], "setting": "…" },
  "timeline": [ { "novel": "ch01", "period": "…", "event": "…（40〜80字）" } ]
}
```

---

## 画像の置き場（後日追加。無ければ自動の代替表示になる）

| 用途 | パス | 形 |
|---|---|---|
| 表紙 | `site/img/covers/chNN.jpg`（png / webp も可） | 縦長 2:3（例 1200×1800） |
| 肖像 | `site/img/characters/<id>.jpg` | 正方形（例 800×800、顔〜胸） |
| キービジュアル | `site/img/key.jpg` | 横長 16:9（例 1920×1080） |

置いて push すれば、ビルドが存在を検出して差し替える。
