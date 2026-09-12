# 絵の発注書（自動生成）

`npm run art` が `meta/` から書き出す。**このファイルを手で直しても次の実行で消える。**
直すのは次の場所。

| 直したいもの | 直す場所 |
|---|---|
| 画風・構図・禁止事項 | `meta/art.json` の `style` / `portraitComposition` / `coverComposition` / `keyComposition` / `avoid` |
| 個人の見た目・年齢・性別 | `meta/art.json` の `portraits.<id>` |
| 人物そのもの（名前・所属・紹介文） | `meta/characters.json` |

## 置き方

1. 下の **ファイル** の名前で `site/img/` の下に置く（拡張子は jpg / png / webp のどれでもよい）
2. `git add . && git commit && git push`

置いていない絵は、色と題名・姓の一文字による自動の代替表示のままになる。**一部だけ置いてもよい。**

## 肖像の作り方（ここが肝心）

肖像は **正方形で作って、アプリ側が円形に切り抜いて表示する**。表示は 44px（一覧の小）／64px（人物カード）／128px（人物ページの見出し）／48px（相関図）の4サイズ。

- **四隅は切り落とされる。** 顔と小物は中央に寄せる
- **頭の上に余白を1割。** 詰めると円の縁で頭頂が切れる
- **背景は無地の単色だけ。** 室内や小物を描くと、円に切られて意味不明な断片になる
- **44px でも見分けがつくこと。** 髪型・眼鏡・髭・服の色で差を付ける
- 25人を**同じ画風で**揃える。1人ずつ別々に作るなら、最初の1枚を参照画像にするか、同じシード・同じスタイル指定を使い回す

## 性別について

原稿で性別が明記されているのは 柳（五十代の男性）・川辺（三十代の女性）・熊谷（六十三歳の男性）の3人だけで、作中に「彼」「彼女」は一度も出てこない。他は口調・立場・年齢から推した提案なので、違うと思ったら portraits の gender を書き換えて `npm run art` をやり直す。

| 原文で明記 | 人物 |
|---|---|
| 明記あり | 柳・熊谷・川辺 |
| 提案（変更可） | 佐伯 梨乃・赤海 慧・早瀬・三上 剛・大河内・岡崎・橘・志村・高梨・森田・田中・桐山・佐藤・真田・西村・小野・野村・吉田・小川・会長・証券会社の年上のほう・証券会社の年下のほう |

## 状況

| 種別 | 枚数 | 用意済み | 未 |
|---|---|---|---|
| キービジュアル | 1 | 0 | 1 |
| 表紙 | 10 | 0 | 10 |
| 肖像 | 25 | 0 | 25 |

---

## キービジュアル

- **ファイル**: `site/img/key.jpg`
- **形**: 横長 16:9（1920×1080 以上）
- **誰・何**: DX小説 のトップの背景に薄く敷く1枚。社長の「先月の売上、どれくらい伸びた？」から、三年が始まった。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

神田の雑居ビルの四階にある、窓の小さな薄暗い小部屋。机に三枚のモニターが並び、黒い画面が青白く光っている。机の端に、空の串が何本も立った缶。手前に開いたノートとペン。人物は描かないか、椅子の背に見える後ろ姿のシルエット程度にとどめる。夜。落ち着いた青緑の色調。

横長 16:9（1920×1080 以上）。トップの見出しの背後に薄く敷くので、中央から左に情報を置かず、全体を暗めに落ち着かせる。文字は描かない。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

A dim small room on the fourth floor of a cramped multi-tenant building in Kanda, Tokyo, with one small window. Three monitors side by side on the desk, their black screens glowing pale blue. At the edge of the desk, a can holding many empty food skewers. In the foreground, an open notebook and a pen. Either no people at all, or at most a silhouette of someone's back over a chair. Night. Muted blue-green palette.

Landscape 16:9 (1920x1080 or larger). It sits faintly behind the site's headline, so keep the center-left area free of important detail and keep the overall image dark and calm. No text.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch01

- **ファイル**: `site/img/covers/ch01.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第1話「ch01」 同じ会社、同じ月の「売上」が、三つある。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第1話「ch01」の表紙。この話の芯は「同じ会社、同じ月の「売上」が、三つある。」。扱う題材は BI・データレイク・DWH・データマート。象徴として使えるモチーフ: こめかみ、平熱、体温、からあげ棒、串の缶。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #3b6ea5。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 1, "ch01". The core of this episode: 同じ会社、同じ月の「売上」が、三つある。 Subject matter: BI, データレイク, DWH, データマート. Motifs that can be used symbolically: こめかみ, 平熱, 体温, からあげ棒, 串の缶. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #3b6ea5.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch02

- **ファイル**: `site/img/covers/ch02.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第2話「ch02」 同じ靴が、五か所で五つの名前を持っていた。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第2話「ch02」の表紙。この話の芯は「同じ靴が、五か所で五つの名前を持っていた。」。扱う題材は MDM・マスタデータ管理・名寄せ・ゴールデンレコード・データオーナー。象徴として使えるモチーフ: 二つの登山靴、名前が五つある子供、本当の最新、靴紐、からあげ棒。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #4f8a5b。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 2, "ch02". The core of this episode: 同じ靴が、五か所で五つの名前を持っていた。 Subject matter: MDM, マスタデータ管理, 名寄せ, ゴールデンレコード, データオーナー. Motifs that can be used symbolically: 二つの登山靴, 名前が五つある子供, 本当の最新, 靴紐, からあげ棒. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #4f8a5b.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch03

- **ファイル**: `site/img/covers/ch03.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第3話「ch03」 ログインできる≠何でも見られる。十二本の鍵を一本に寄せる秋

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第3話「ch03」の表紙。この話の芯は「ログインできる≠何でも見られる。十二本の鍵を一本に寄せる秋」。扱う題材は 認証認可・SSO・ゼロトラスト・SAML・OAuth・OIDC。象徴として使えるモチーフ: 赤海の二行、当たりましたか、からあげ棒、印鑑と印影、三回の往復（六回移動）。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #b5842a。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 3, "ch03". The core of this episode: ログインできる≠何でも見られる。十二本の鍵を一本に寄せる秋 Subject matter: 認証認可, SSO, ゼロトラスト, SAML, OAuth・OIDC. Motifs that can be used symbolically: 赤海の二行, 当たりましたか, からあげ棒, 印鑑と印影, 三回の往復（六回移動）. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #b5842a.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch04

- **ファイル**: `site/img/covers/ch04.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第4話「ch04」 テレビ放映まで一か月半。一つのタップは、どこを通って注文になるのか

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第4話「ch04」の表紙。この話の芯は「テレビ放映まで一か月半。一つのタップは、どこを通って注文になるのか」。扱う題材は ネットワーク・DNS・TLS・AWS VPC・CDN。象徴として使えるモチーフ: 電話帳（郵便局ではない）、二次会の数字、テントで数えるな、六万五千、去年のカレンダー。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #6b6bb5。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 4, "ch04". The core of this episode: テレビ放映まで一か月半。一つのタップは、どこを通って注文になるのか Subject matter: ネットワーク, DNS, TLS, AWS VPC, CDN. Motifs that can be used symbolically: 電話帳（郵便局ではない）, 二次会の数字, テントで数えるな, 六万五千, 去年のカレンダー. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #6b6bb5.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch05

- **ファイル**: `site/img/covers/ch05.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第5話「ch05」 五十倍が来る前に、サーバーを牛にし、クリックを正本にする

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第5話「ch05」の表紙。この話の芯は「五十倍が来る前に、サーバーを牛にし、クリックを正本にする」。扱う題材は クラウドインフラ・IaC・コンテナ。象徴として使えるモチーフ: 牛（ペットと家畜）、弁当箱（近い）、造成（当たった）、#2 は消えたのではなく増えた、正本と写し。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #2a8a8a。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 5, "ch05". The core of this episode: 五十倍が来る前に、サーバーを牛にし、クリックを正本にする Subject matter: クラウドインフラ, IaC, コンテナ. Motifs that can be used symbolically: 牛（ペットと家畜）, 弁当箱（近い）, 造成（当たった）, #2 は消えたのではなく増えた, 正本と写し. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #2a8a8a.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch06

- **ファイル**: `site/img/covers/ch06.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第6話「ch06」 「システムを入れろ」の裏にある痛みを、現場で数えるところから始める

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第6話「ch06」の表紙。この話の芯は「「システムを入れろ」の裏にある痛みを、現場で数えるところから始める」。扱う題材は 業務改革構想・要件定義・SaaS 選定・システム開発・本番切替。象徴として使えるモチーフ: 天気、右の枠、九割、からあげ棒の角度、請求書に載りますか。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #b5563b。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 6, "ch06". The core of this episode: 「システムを入れろ」の裏にある痛みを、現場で数えるところから始める Subject matter: 業務改革構想, 要件定義, SaaS 選定, システム開発, 本番切替. Motifs that can be used symbolically: 天気, 右の枠, 九割, からあげ棒の角度, 請求書に載りますか. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #b5563b.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch07

- **ファイル**: `site/img/covers/ch07.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第7話「ch07」 黒字なのに、現金がない。三枚の表がつながり、三社の経理が一つになる。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第7話「ch07」の表紙。この話の芯は「黒字なのに、現金がない。三枚の表がつながり、三社の経理が一つになる。」。扱う題材は 財務・シェアードサービス・月次決算・内部統制・監査。象徴として使えるモチーフ: 会計上は、相殺後、三つ、星印、晴れの日の傘。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #8a6d3b。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 7, "ch07". The core of this episode: 黒字なのに、現金がない。三枚の表がつながり、三社の経理が一つになる。 Subject matter: 財務, シェアードサービス, 月次決算, 内部統制, 監査. Motifs that can be used symbolically: 会計上は, 相殺後, 三つ, 星印, 晴れの日の傘. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #8a6d3b.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch08

- **ファイル**: `site/img/covers/ch08.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第8話「ch08」 何でも入る箱は、何を入れたか忘れる——ERP か、八つ目の箱か

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第8話「ch08」の表紙。この話の芯は「何でも入る箱は、何を入れたか忘れる——ERP か、八つ目の箱か」。扱う題材は ERP・生産管理・Fit to Standard・原価計算・統制と証跡。象徴として使えるモチーフ: 何でも入る箱、六秒、からあげ棒、体温、ハコデン。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #7a5c9e。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 8, "ch08". The core of this episode: 何でも入る箱は、何を入れたか忘れる——ERP か、八つ目の箱か Subject matter: ERP, 生産管理, Fit to Standard, 原価計算, 統制と証跡. Motifs that can be used symbolically: 何でも入る箱, 六秒, からあげ棒, 体温, ハコデン. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #7a5c9e.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch09

- **ファイル**: `site/img/covers/ch09.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第9話「ch09」 作ることには終わりがある。運用には、終わりがない。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第9話「ch09」の表紙。この話の芯は「作ることには終わりがある。運用には、終わりがない。」。扱う題材は 運用保守・ITSM・インシデント管理・変更管理・SRE。象徴として使えるモチーフ: 四つの札、一つの窓口、見ます、今、買っていいか、お問い合わせありがとうございます。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #c0392b。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 9, "ch09". The core of this episode: 作ることには終わりがある。運用には、終わりがない。 Subject matter: 運用保守, ITSM, インシデント管理, 変更管理, SRE. Motifs that can be used symbolically: 四つの札, 一つの窓口, 見ます, 今、買っていいか, お問い合わせありがとうございます. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #c0392b.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch10

- **ファイル**: `site/img/covers/ch10.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第10話「ch10」 システムは全部動いていた。それでも、靴は一足も出なかった

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

第10話「ch10」の表紙。この話の芯は「システムは全部動いていた。それでも、靴は一足も出なかった」。扱う題材は BCP・事業継続・DR・BIA・訓練。象徴として使えるモチーフ: 二週間分の靴、付箋とプレート、保険、祈り、四つ。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #3b7fa5。

縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。画風は肖像と揃える。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Cover art for episode 10, "ch10". The core of this episode: システムは全部動いていた。それでも、靴は一足も出なかった Subject matter: BCP, 事業継続, DR, BIA, 訓練. Motifs that can be used symbolically: 二週間分の靴, 付箋とプレート, 保険, 祈り, 四つ. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #3b7fa5.

Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Match the portrait art style.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 rino

- **ファイル**: `site/img/characters/rino.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 佐伯 梨乃（さえき りの）／株式会社ヤマビコ ・ 経営企画室 ・ 経営企画室長（第7話〜）
- 「先月の売上は？」に一つの数字で答えられなかった入社二年目。三年かけて、会社の数字と仕組みを一本に通していく。
- **年齢**: 20代半ば　**性別**: 女性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

20代半ばの日本人女性。黒髪のミディアムボブで毛先が少し外に跳ね、前髪あり。細面で目が大きめ。白いブラウスの上に濃紺のカーディガン、首から社員証のストラップ。胸の高さに小さなメモ帳を持ち、角だけが見えている。まだ自信はないが引かない、少し眉の寄った生真面目な表情。背景は淡い青灰色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her mid-20s. Black medium bob with slightly flicked ends and a fringe. Slender face, fairly large eyes. White blouse under a navy cardigan, employee ID lanyard around the neck. Holding a small notepad at chest height, only its corner visible. Earnest expression with slightly knitted brows — not yet confident, but not backing down. Pale blue-grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 akaumi

- **ファイル**: `site/img/characters/akaumi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 赤海 慧（あかうみ けい）／社外 ・ 夜座コンサルティング ・ シニアコンサルタント
- ヤマビコ四階の小部屋に常駐する外部の技術者。振り向かずに答え、褒めるときだけ、からあげ棒を差し出す。
- **年齢**: 30代半ば　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

30代半ばの日本人男性。伸びた黒髪が無造作、無精髭、目の下にはっきりした隈。痩せ型で頬がこけている。色褪せたチャコールグレーのパーカー。顔のすぐ横に、串に刺したコンビニのからあげ棒を一本持っている。表情はほぼ無いが、目つきだけが鋭い。背景は濃いめの灰青色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his mid-30s. Overgrown messy black hair, stubble, pronounced dark circles under the eyes. Lean, hollow-cheeked. Faded charcoal-grey hoodie. Holding a convenience-store fried chicken skewer right beside his face. Almost no expression, but a sharp gaze. Deep grey-blue background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 hayase

- **ファイル**: `site/img/characters/hayase.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 早瀬（はやせ）／株式会社ヤマビコ ・ 経営企画室 → 受注システム担当
- 「当たりましたか」が口癖の新人。英語をそのまま訳しただけのとき、なぜかよく当たる。
- **年齢**: 20代前半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

20代前半の日本人男性、新入社員。黒髪の短髪をきちんと整え、生え際がはっきりしている。細身で肌つや良く、丸みのある顔。真新しい白いシャツに水色の細いネクタイ。片手を軽く挙げて、指先が肩の高さにある。目を見開いた、まっすぐで屈託のない表情。背景は明るいクリーム色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his early 20s, a new hire. Neatly cut short black hair with a clean hairline. Slim, clear-skinned, softly rounded face. Brand-new white shirt with a slim light-blue tie. One hand slightly raised, fingertips at shoulder height. Wide-open eyes, direct and untroubled expression. Bright cream background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 mikami

- **ファイル**: `site/img/characters/mikami.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 三上 剛（みかみ つよし）／株式会社ヤマビコ ・ 営業部 ・ 営業部長
- 資料を見ずに、こめかみを叩いて数字を答える営業部長。名前が付くと機嫌がよくなる。
- **年齢**: 50代前半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

50代前半の日本人男性、営業部長。白髪の混じった短髪、角張った顔、恰幅がよく首が太い。水色のワイシャツの袖をまくり、ネクタイは緩めて第一ボタンを外している。人差し指を自分のこめかみに当てて軽く叩く仕草。口を開けて笑う、声の大きそうな自信満々の表情。背景は温かみのあるベージュ。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his early 50s, a sales director. Short hair greying at the temples, square face, heavy build, thick neck. Light-blue dress shirt with sleeves rolled up, tie loosened, top button undone. Index finger tapping his own temple. Mouth open in a laugh, loud and supremely confident. Warm beige background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 okochi

- **ファイル**: `site/img/characters/okochi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 大河内（おおこうち）／株式会社ヤマビコ ・ 社長
- 例え話が例えになっていない社長。それでも半分くらいは、なぜか当たってしまう。
- **年齢**: 60代前半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

60代前半の日本人男性、中小企業の社長。白髪を後ろに撫でつけ、額が広い。柔らかい丸顔で目尻に深い笑い皺。ベージュのジャケットにノーネクタイの白シャツ。肩の高さにコーヒーカップを持っている。人懐こく、少し無責任そうな笑顔。背景は淡い山吹色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his early 60s, president of a small company. White hair swept back, high forehead. Soft round face with deep laugh lines at the eyes. Beige jacket over an open-collar white shirt. Holding a coffee cup at shoulder height. Genial, faintly irresponsible smile. Pale amber background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 okazaki

- **ファイル**: `site/img/characters/okazaki.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 岡崎（おかざき）／株式会社ヤマビコ ・ 総務・情報システム
- 総務と情シスを兼ねる人。「わかりました」は本当にわかっていて、本当にやる。
- **年齢**: 30代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

30代後半の日本人。総務と情シスを兼ねる、目立たない人。黒髪をきちんと横分けにし、特徴の少ない穏やかな顔立ち。グレーのシャツの胸ポケットにボールペンが三本挿さっている。控えめに口の端だけで微笑む。言いにくいことを言う前の、少し息を吸った表情。背景は薄い灰緑色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese person in their late 30s, handling both general affairs and IT. Black hair in a neat side part, unremarkable calm features. Grey shirt with three ballpoint pens in the breast pocket. A restrained smile at the corner of the mouth. The look of someone who has just drawn breath to say something awkward. Pale grey-green background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 tachibana

- **ファイル**: `site/img/characters/tachibana.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 橘（たちばな）／株式会社ヤマビコ ・ 経理部 → シェアードサービスセンター ・ SSC長（第7話〜）
- 「会計上は」が口癖の経理。眼鏡を押し上げたら、それは戦闘態勢の合図。
- **年齢**: 30代後半　**性別**: 女性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

30代後半の日本人女性、経理。黒髪を後ろできっちりまとめ、細い銀縁の眼鏡。輪郭も目つきもシャープ。白シャツの上に濃紺のベスト。人差し指と中指で眼鏡のブリッジを押し上げる仕草。感情を出さない、理詰めで隙のない表情。背景は濃いめのスレートブルー。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her late 30s, an accountant. Black hair pulled back tightly, thin silver-rimmed glasses. Sharp jawline and sharp eyes. White shirt under a navy vest. Pushing the bridge of her glasses up with index and middle finger. Unemotional, airtight, logical expression. Deep slate-blue background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 shimura

- **ファイル**: `site/img/characters/shimura.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 志村（しむら）／株式会社ヤマビコ ・ 商品部
- 商品のことなら何でも知っていて、何でも話す。靴紐の話は、三十分のうち二十分。
- **年齢**: 40代前半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

40代前半の日本人男性、商品部。少しくせのある黒髪、日に焼けた肌、人の良さそうな丸い目。オリーブ色のフリースベストの下にチェックのシャツ。首に登山靴の丸紐を一本かけている。今まさに長い話を始めようとしている、嬉しそうに口を開いた表情。背景は柔らかいオリーブ色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his early 40s, product department. Slightly wavy black hair, tanned skin, kind round eyes. Olive fleece vest over a checked shirt. A round hiking bootlace draped around his neck. Mouth already open, delighted, about to launch into a long story. Soft olive background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 takanashi

- **ファイル**: `site/img/characters/takanashi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 高梨（たかなし）／株式会社ヤマビコ ・ EC・API 開発 ・ エンジニア
- 気弱そうに見えて、コードを書いているときだけ別人になるエンジニア。
- **年齢**: 30代前半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

30代前半の日本人男性、エンジニア。前髪が少し長く目にかかる黒髪、痩せ型、色白。グレーのパーカーに黒いTシャツ。眉を八の字に下げ、口を small に結んだ、何も起きていないのに謝りそうな表情。少しうつむき加減だが目線はこちら。背景は淡いグレー。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his early 30s, a software engineer. Black hair with a fringe falling slightly into his eyes, thin build, pale skin. Grey hoodie over a black T-shirt. Eyebrows angled down in the middle, mouth held small — the face of someone about to apologize though nothing has gone wrong. Head slightly lowered but eyes on the viewer. Pale grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 morita

- **ファイル**: `site/img/characters/morita.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 森田（もりた）／株式会社ヤマビコ ・ マーケティング部
- 「見たほうが早い」と言ってノートパソコンを開き、そのたびに電池が切れる。
- **年齢**: 30代半ば　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

30代半ばの日本人男性、マーケティング。明るい茶色に染めた短髪を軽く立て、細身。からし色のカジュアルジャケットに白いインナー。肩の高さに白い充電ケーブルを一本つまんで持ち上げている。眉を上げて口角を曲げた、困りながら笑っている表情。背景はくすんだ黄土色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his mid-30s, marketing. Short hair dyed light brown and lightly spiked, slim build. Mustard casual jacket over a white tee. Pinching a white charging cable, holding it up at shoulder height. Eyebrows raised, mouth crooked — laughing while visibly troubled. Muted ochre background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 tanaka

- **ファイル**: `site/img/characters/tanaka.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 田中（たなか）／株式会社ヤマビコ ・ 営業部（第1話の終わりに定年退職）
- 二十年ぶん、五か所のデータを一人で突き合わせてきた「売上管理_最新_v37_修正版.xlsx」の人。
- **年齢**: 50代後半　**性別**: 女性 — 提案（原稿に記載なし。語尾を伸ばす話し方と「高梨くん」の呼び方から）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

50代後半の日本人女性、営業部のベテラン。白髪の混じった短めのパーマ髪。老眼鏡を鼻先まで下げてかけ、レンズの上から見ている。えんじ色のカーディガン。胸の高さに湯呑みを両手で持つ。照れくさそうに目を細めた、穏やかで満足そうな表情。背景は薄いモスグリーン。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her late 50s, a veteran of the sales department. Short permed hair greying throughout. Reading glasses slipped down to the tip of her nose, looking over the top of the lenses. Deep maroon cardigan. Holding a teacup in both hands at chest height. Eyes crinkled, bashful, calm and quietly satisfied. Pale moss-green background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kiriyama

- **ファイル**: `site/img/characters/kiriyama.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 桐山（きりやま）／株式会社ヤマビコ ・ 開発
- 表紙に「赤海語録」と書いたノートを持ち歩く開発者。深夜二時には、何も書かない。
- **年齢**: 20代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

20代後半の日本人男性、開発者。黒いくせ毛が跳ねている。黒縁の丸眼鏡。無地の黒いTシャツ。胸の高さに大学ノートとペンを構え、今から書き留めようとしている。好奇心で目が輝き、口元が少し笑っている表情。背景は落ち着いた紫紺。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his late 20s, a developer. Black curly hair sticking out. Round black-rimmed glasses. Plain black T-shirt. Holding a notebook and pen ready at chest height, about to write something down. Eyes bright with curiosity, a small smile at the mouth. Muted violet-navy background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 sato

- **ファイル**: `site/img/characters/sato.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 佐藤（さとう）／ヤマビコグループ ・ 埼玉倉庫 → ヤマビコロジ ・ 社長（第7話〜）
- 倉庫の人。「それ、請求書に載ります？」と唐突に聞き、やがてグループ会社の社長になる。
- **年齢**: 40代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

40代後半の日本人男性、物流倉庫の責任者。短く刈った黒髪、日に焼けた肌、健康的で骨太な顔立ち。濃紺の作業着の上衣、襟元から白いTシャツ。胸の高さに名刺を一枚、両手で差し出している。まっすぐで飾らない、少し硬い真面目な表情。背景は落ち着いた深緑。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his late 40s, head of a distribution warehouse. Closely cropped black hair, tanned skin, healthy solid features. Navy work jacket with a white tee at the collar. Offering a business card with both hands at chest height. Direct, unadorned, slightly stiff and earnest. Muted deep-green background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 yanagi

- **ファイル**: `site/img/characters/yanagi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 柳（やなぎ）／ヤマビコグループ ・ ライズ・フットウェア 長野工場 ・ 工場長
- 六秒で答える工場長。言いにくいことも、地震の日も、六秒。
- **年齢**: 五十代　**性別**: 男性 — 原文明記（五十代の男性）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

五十代の日本人男性、靴工場の工場長。白髪の混じった短い角刈り、深い縦皺の刻まれた四角い顔、日に焼けた肌。グレーの作業着に襟付きのインナー。口を真一文字に結んでいる。余計なことを言わない、必要なだけ見返す静かな目。背景は濃い鼠色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his 50s, manager of a shoe factory. Short crew cut greying at the sides, square face with deep vertical lines, weathered skin. Grey work uniform over a collared inner shirt. Mouth set in a straight line. Quiet eyes that look back exactly as much as needed and no more. Dark grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kumagai

- **ファイル**: `site/img/characters/kumagai.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 熊谷（くまがい）／ヤマビコグループ ・ ライズ・フットウェア 経理 → シェアードサービスセンター
- 六十三歳。紙の伝票を持って新幹線で来る。「一円も、間違えてない」
- **年齢**: 63歳　**性別**: 男性 — 原文明記（六十三歳の男性）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

63歳の日本人男性、工場の経理。白髪を七三に整え、痩せた頬、細い銀縁の眼鏡。白いワイシャツの上に黒い事務用ベスト、腕には黒いアームカバー。胸に紙の伝票の束を大事そうに抱えている。誇りと少しの寂しさが同居した、姿勢を正した表情。背景は温かみのある灰茶色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man aged 63, factory accountant. White hair in a neat side part, gaunt cheeks, thin silver-rimmed glasses. White dress shirt under a black office vest, black sleeve protectors on his forearms. Clutching a bundle of paper vouchers to his chest as if precious. Posture straightened; pride and a trace of loneliness together. Warm grey-brown background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kawabe

- **ファイル**: `site/img/characters/kawabe.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 川辺（かわべ）／社外 ・ オーダーリンク社（受注 SaaS） ・ 導入担当
- 充電器を四本持ってくる SaaS の導入担当。営業スマイルなのに、目が笑っていない。
- **年齢**: 三十代　**性別**: 女性 — 原文明記（三十代の女性）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

三十代の日本人女性、SaaS ベンダーの導入担当。黒髪を後ろで低くまとめ、前髪を横に流している。整った顔立ち、薄い化粧。濃紺のスーツに白いインナー。きれいに口角を上げた完璧な営業スマイル。ただし目だけがまったく笑っていない。背景は明るいグレー。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her 30s, implementation lead at a SaaS vendor. Black hair in a low bun, fringe swept to the side. Neat features, light makeup. Navy suit with a white blouse. A perfect sales smile with the corners of the mouth precisely raised — but the eyes are not smiling at all. Light grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 sanada

- **ファイル**: `site/img/characters/sanada.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 真田（さなだ）／社外 ・ 社F（生産管理専業パッケージ） ・ 導入担当
- 「四十社、全部そうやりました」と数で語り、無理な要求はそのまま断る。
- **年齢**: 40代前半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

40代前半の日本人男性、生産管理パッケージの導入担当。黒髪の角刈りに近い短髪、地味で頑丈そうな顔立ち。飾り気のないグレーのスーツに白シャツ、無地のネクタイ。表情はまったく変わらず、断るときも同じ顔。まっすぐな視線。背景は薄いスチールグレー。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his early 40s, implementation lead for a production-control package. Black hair in a near crew cut, plain and sturdy features. Unadorned grey suit, white shirt, plain tie. Expression entirely unchanging — the same face he wears when refusing a request. Level gaze. Pale steel-grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 nishimura

- **ファイル**: `site/img/characters/nishimura.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 西村（にしむら）／株式会社ヤマビコ ・ サービスデスク（一次対応）
- 小部屋に入るたび「お問い合わせありがとうございます」と言ってしまう。八年の癖。
- **年齢**: 20代後半　**性別**: 女性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

20代後半の日本人女性、サービスデスク。黒髪のショートボブ、細いヘッドセットのマイクが口元の横に伸びている。水色のシャツ。感じのよい、よく通る声が想像できる自然な微笑み。丁寧で機敏な印象。背景は明るい水色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her late 20s, service desk. Short black bob, a slim headset with the boom mic reaching toward the corner of her mouth. Light-blue shirt. A natural, pleasant smile from which a clear carrying voice can be imagined. Polite and quick. Bright pale-blue background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 ono

- **ファイル**: `site/img/characters/ono.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 小野（おの）／社外 ・ 監査法人 ・ 公認会計士
- 監査法人の会計士。持っている言葉は「証跡」と「統制」の二つ。
- **年齢**: 30代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

30代後半の日本人男性、公認会計士。黒髪をきっちり整え、太めの黒縁眼鏡。細面で表情が動かない。黒に近い濃色のスーツ、白シャツ、地味なネクタイ。口を閉じたまま相手を見ている。硬質で静かな印象。背景はごく薄い灰色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his late 30s, a certified public accountant. Black hair neatly groomed, thick black-rimmed glasses. Narrow face, immobile expression. Near-black dark suit, white shirt, sober tie. Watching the viewer with his mouth closed. Hard-edged and quiet. Very pale grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 nomura

- **ファイル**: `site/img/characters/nomura.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 野村（のむら）／ヤマビコグループ ・ ヤマビコロジ 経理（パート）→ シェアードサービスセンター
- 「会計上は」を復唱するようになった SSC のパート。付けなくていい場面も、わかってきた。
- **年齢**: 40代後半　**性別**: 女性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

40代後半の日本人女性、経理事務。黒髪を肩で切り揃え、耳にかけている。ベージュの事務用ベストに白いブラウス。柔らかく落ち着いた、少し控えめな微笑み。背景は淡いベージュ。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her late 40s, accounting clerk. Black hair cut at the shoulders, tucked behind one ear. Beige office vest over a white blouse. A soft, settled, slightly reserved smile. Pale beige background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 yoshida

- **ファイル**: `site/img/characters/yoshida.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 吉田（よしだ）／株式会社ヤマビコ ・ 営業事務（パート）
- 顧客コードは覚えられない。「山岳会の名前で探せないと、困ります」
- **年齢**: 40代後半　**性別**: 女性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

40代後半の日本人女性、営業事務のパート。黒髪を後ろで一つに束ね、後れ毛が少し。水色の事務用ベストに白いブラウス。眉を少し下げ、口を横に結んだ、困っているが不機嫌ではない表情。背景は淡い水色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her late 40s, part-time sales clerk. Black hair tied back in one bunch with a few loose strands. Light-blue office vest over a white blouse. Eyebrows slightly lowered, mouth set sideways — troubled but not displeased. Pale sky-blue background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 ogawa

- **ファイル**: `site/img/characters/ogawa.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 小川（おがわ）／株式会社ヤマビコ ・ 営業事務（パート）
- 「その FAX、まだ取ってあります。見ますか」
- **年齢**: 50代前半　**性別**: 女性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

50代前半の日本人女性、営業事務のパート。白髪の混じった短髪パーマ。ピンクがかったベージュの事務服。胸の高さに薄い紙の綴りを持っている。悪びれない、ごく自然な表情。背景は淡い桜色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese woman in her early 50s, part-time sales clerk. Short permed hair with grey mixed in. Pinkish-beige office uniform. Holding a thin bound stack of paper at chest height. An entirely unselfconscious, natural expression. Pale blossom-pink background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kaicho

- **ファイル**: `site/img/characters/kaicho.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 会長（かいちょう）／社外 ・ 杉並山岳会 ・ 会長
- 杉並山岳会の会長。法人の顧客として、注文の向こう側に名前が出る。
- **年齢**: 60代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

60代後半の日本人男性、山岳会の会長。深く日に焼けた顔、短い白髪と白い顎髭、目尻の皺が深い。えんじ色のフリースジャケット。豪快で人望のありそうな笑顔。背景は落ち着いた山吹色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his late 60s, chairman of a mountaineering club. Deeply tanned face, short white hair and a white beard, deep crow's feet. Deep-red fleece jacket. A broad, well-liked, hearty smile. Muted amber background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 shoken_senior

- **ファイル**: `site/img/characters/shoken_senior.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 証券会社の年上のほう（読み未設定）／社外 ・ 主幹事候補の証券会社 引受審査部
- 引受審査部。ERP の会社名より、三十ページの説明書のほうが読みやすいと正直に言う。
- **年齢**: 40代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

40代後半の日本人男性、証券会社の引受審査部。髪をきちんと整え、落ち着いた濃紺のスーツに控えめなネクタイ。年齢相応の皺。相手の話を静かに聞いている、穏やかだが値踏みする目。わずかに口角が上がりかけている。背景は落ち着いた紺灰色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his late 40s, underwriting review at a securities firm. Neatly groomed hair, sober navy suit, restrained tie. Age-appropriate lines. Listening quietly — calm eyes that are nonetheless appraising. The corner of his mouth just beginning to lift. Muted navy-grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 shoken_junior

- **ファイル**: `site/img/characters/shoken_junior.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 証券会社の年下のほう（読み未設定）／社外 ・ 主幹事候補の証券会社 引受審査部
- 引受審査部。三上の「SAP。強い」には、答えなかった。
- **年齢**: 20代後半　**性別**: 男性 — 提案（原稿に記載なし）

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
日本のビジネス書の挿絵に近い、線のはっきりした半写実のデジタルイラスト。アニメ絵に寄せず、劇画にもしない。細く均一な輪郭線、平らな塗りに影は一段だけ、グラデーションは最小限。色は中彩度・低コントラストで、肌は自然な色。正面からの柔らかい光で、強い影を作らない。全員を同じ画風・同じ描き込み量・同じ線の太さで揃える。

20代後半の日本人男性、証券会社の若手。短く整えた黒髪、濃紺のスーツに白シャツ、細いネクタイ。表情をまったく変えない、硬い顔。背景は薄い紺灰色。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は無地の単色のみ（部屋・家具・小物・模様は描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。44 ピクセルまで縮めても誰か分かるよう、髪型・眼鏡・髭・服の色で個人差をはっきり付ける。

文字・ロゴ・透かし・署名を入れない。背景に室内や風景を描かない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
Clean semi-realistic digital illustration in the style of Japanese business-book editorial art. Not anime, not photorealistic. Thin even outlines, flat shading with a single shadow step, minimal gradients. Muted mid-saturation palette, low contrast, natural skin tones. Soft frontal light, no harsh shadows. All portraits must share the same art style, level of detail, and line weight.

Japanese man in his late 20s, a junior at a securities firm. Short neat black hair, navy suit, white shirt, slim tie. A stiff face that does not change at all. Pale navy-grey background.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: a single flat solid color only — no rooms, furniture, objects, or patterns. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. The character must remain identifiable when scaled down to 44 pixels, so differentiate strongly by hairstyle, glasses, facial hair, and clothing color.

No text, logos, watermarks, or signatures. No interior or landscape background. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

