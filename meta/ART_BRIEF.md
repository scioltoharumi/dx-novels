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

## 全体の考え方

肖像は「単行本の巻頭に載っている、白黒の登場人物紹介ページの挿絵」。表紙とキービジュアルだけは色を使う（単行本もカバーは色、巻頭の人物紹介は白黒、という作りに合わせる）。

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
| 佐伯 梨乃 | 20代半ば | 外ハネのミディアムボブ＋社員証のストラップ |
| 赤海 慧 | 30代半ば | 無精髭＋目の下の隈＋顔の横のからあげ棒 |
| 早瀬 | 20代前半 | きっちりした短髪＋ネクタイの結び目＋挙げかけた手 |
| 三上 剛 | 50代前半 | 太い首＋開いた襟＋こめかみを叩く人差し指 |
| 大河内 | 60代前半 | 白髪のオールバック＋広い額＋肩の高さのコーヒーカップ |
| 岡崎 | 30代後半 | 七三分け＋胸ポケットのボールペン三本 |
| 橘 | 30代後半 | 後ろでまとめた髪＋細い楕円の銀縁眼鏡＋眼鏡を押し上げる指 |
| 志村 | 40代前半 | もじゃっとしたくせ毛＋首にかけた靴紐 |
| 高梨 | 30代前半 | 目にかかる長い前髪＋八の字の眉 |
| 森田 | 30代半ば | 軽く立てた短髪＋つまみ上げた充電ケーブル |
| 田中 | 50代後半 | 短いパーマの白髪＋鼻先まで下げた老眼鏡＋湯呑み |
| 桐山 | 20代後半 | 跳ねたくせ毛＋太い黒縁の丸眼鏡＋構えたノートとペン |
| 佐藤 | 40代後半 | 角張った頭の短い刈り込み＋作業着の立ち襟＋差し出した名刺 |
| 柳 | 五十代 | 白髪の角刈り＋真一文字の口＋胸の高さの古い電卓 |
| 熊谷 | 63歳 | 白髪の七三＋アームカバー＋胸に抱えた伝票の束 |
| 川辺 | 三十代 | 低いまとめ髪＋横に流した前髪＋目の笑っていない営業スマイル |
| 真田 | 40代前半 | 角刈り＋まったく動かない表情＋無地のネクタイ |
| 西村 | 20代後半 | ヘッドセットのマイクアーム（唯一の装備）＋ショートボブ |
| 小野 | 30代後半 | 太い黒縁の角眼鏡＋最も濃いスーツ＋動かない口元 |
| 野村 | 40代後半 | 肩で切り揃えた直毛を片耳にかける＋明るい事務ベスト |
| 吉田 | 40代後半 | 後ろで一つに束ねた髪＋後れ毛＋困り眉 |
| 小川 | 50代前半 | 白髪混じりの短いパーマ＋胸の高さの紙の綴り |
| 会長 | 60代後半 | 白い顎髭（25人で唯一）＋深く日に焼けた顔 |
| 証券会社の年上のほう | 40代後半 | こめかみの白髪＋濃いスーツ＋値踏みする穏やかな目 |
| 証券会社の年下のほう | 20代後半 | 若さと硬い無表情＋細いネクタイ |

眼鏡は5人（橘・田中・桐山・小野）。形を変えてあるので、**丸と角を取り違えないこと。**

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
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

神田の雑居ビルの四階にある、窓の小さな薄暗い小部屋。机に三枚のモニターが並び、黒い画面が青白く光っている。机の端に、空の串が何本も立った缶。手前に開いたノートとペン。人物は描かないか、椅子の背に見える後ろ姿のシルエット程度にとどめる。夜。落ち着いた青緑の色調。

**キービジュアルは色を使う。** 横長 16:9（1920×1080 以上）。トップの見出しの背後に薄く敷くので、中央から左に情報を置かず、全体を暗めに落ち着かせる。文字は描かない。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

A dim small room on the fourth floor of a cramped multi-tenant building in Kanda, Tokyo, with one small window. Three monitors side by side on the desk, their black screens glowing pale blue. At the edge of the desk, a can holding many empty food skewers. In the foreground, an open notebook and a pen. Either no people at all, or at most a silhouette of someone's back over a chair. Night. Muted blue-green palette.

THE KEY VISUAL USES COLOR. Landscape 16:9 (1920x1080 or larger). It sits faintly behind the site's headline, so keep the center-left area free of important detail and keep the overall image dark and calm. No text.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch01

- **ファイル**: `site/img/covers/ch01.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第1話「ch01」 同じ会社、同じ月の「売上」が、三つある。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第1話「ch01」の表紙。この話の芯は「同じ会社、同じ月の「売上」が、三つある。」。扱う題材は BI・データレイク・DWH・データマート。象徴として使えるモチーフ: こめかみ、平熱、体温、からあげ棒、串の缶。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #3b6ea5。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 1, "ch01". The core of this episode: 同じ会社、同じ月の「売上」が、三つある。 Subject matter: BI, データレイク, DWH, データマート. Motifs that can be used symbolically: こめかみ, 平熱, 体温, からあげ棒, 串の缶. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #3b6ea5.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch02

- **ファイル**: `site/img/covers/ch02.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第2話「ch02」 同じ靴が、五か所で五つの名前を持っていた。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第2話「ch02」の表紙。この話の芯は「同じ靴が、五か所で五つの名前を持っていた。」。扱う題材は MDM・マスタデータ管理・名寄せ・ゴールデンレコード・データオーナー。象徴として使えるモチーフ: 二つの登山靴、名前が五つある子供、本当の最新、靴紐、からあげ棒。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #4f8a5b。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 2, "ch02". The core of this episode: 同じ靴が、五か所で五つの名前を持っていた。 Subject matter: MDM, マスタデータ管理, 名寄せ, ゴールデンレコード, データオーナー. Motifs that can be used symbolically: 二つの登山靴, 名前が五つある子供, 本当の最新, 靴紐, からあげ棒. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #4f8a5b.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch03

- **ファイル**: `site/img/covers/ch03.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第3話「ch03」 ログインできる≠何でも見られる。十二本の鍵を一本に寄せる秋

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第3話「ch03」の表紙。この話の芯は「ログインできる≠何でも見られる。十二本の鍵を一本に寄せる秋」。扱う題材は 認証認可・SSO・ゼロトラスト・SAML・OAuth・OIDC。象徴として使えるモチーフ: 赤海の二行、当たりましたか、からあげ棒、印鑑と印影、三回の往復（六回移動）。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #b5842a。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 3, "ch03". The core of this episode: ログインできる≠何でも見られる。十二本の鍵を一本に寄せる秋 Subject matter: 認証認可, SSO, ゼロトラスト, SAML, OAuth・OIDC. Motifs that can be used symbolically: 赤海の二行, 当たりましたか, からあげ棒, 印鑑と印影, 三回の往復（六回移動）. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #b5842a.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch04

- **ファイル**: `site/img/covers/ch04.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第4話「ch04」 テレビ放映まで一か月半。一つのタップは、どこを通って注文になるのか

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第4話「ch04」の表紙。この話の芯は「テレビ放映まで一か月半。一つのタップは、どこを通って注文になるのか」。扱う題材は ネットワーク・DNS・TLS・AWS VPC・CDN。象徴として使えるモチーフ: 電話帳（郵便局ではない）、二次会の数字、テントで数えるな、六万五千、去年のカレンダー。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #6b6bb5。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 4, "ch04". The core of this episode: テレビ放映まで一か月半。一つのタップは、どこを通って注文になるのか Subject matter: ネットワーク, DNS, TLS, AWS VPC, CDN. Motifs that can be used symbolically: 電話帳（郵便局ではない）, 二次会の数字, テントで数えるな, 六万五千, 去年のカレンダー. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #6b6bb5.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch05

- **ファイル**: `site/img/covers/ch05.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第5話「ch05」 五十倍が来る前に、サーバーを牛にし、クリックを正本にする

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第5話「ch05」の表紙。この話の芯は「五十倍が来る前に、サーバーを牛にし、クリックを正本にする」。扱う題材は クラウドインフラ・IaC・コンテナ。象徴として使えるモチーフ: 牛（ペットと家畜）、弁当箱（近い）、造成（当たった）、#2 は消えたのではなく増えた、正本と写し。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #2a8a8a。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 5, "ch05". The core of this episode: 五十倍が来る前に、サーバーを牛にし、クリックを正本にする Subject matter: クラウドインフラ, IaC, コンテナ. Motifs that can be used symbolically: 牛（ペットと家畜）, 弁当箱（近い）, 造成（当たった）, #2 は消えたのではなく増えた, 正本と写し. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #2a8a8a.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch06

- **ファイル**: `site/img/covers/ch06.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第6話「ch06」 「システムを入れろ」の裏にある痛みを、現場で数えるところから始める

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第6話「ch06」の表紙。この話の芯は「「システムを入れろ」の裏にある痛みを、現場で数えるところから始める」。扱う題材は 業務改革構想・要件定義・SaaS 選定・システム開発・本番切替。象徴として使えるモチーフ: 天気、右の枠、九割、からあげ棒の角度、請求書に載りますか。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #b5563b。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 6, "ch06". The core of this episode: 「システムを入れろ」の裏にある痛みを、現場で数えるところから始める Subject matter: 業務改革構想, 要件定義, SaaS 選定, システム開発, 本番切替. Motifs that can be used symbolically: 天気, 右の枠, 九割, からあげ棒の角度, 請求書に載りますか. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #b5563b.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch07

- **ファイル**: `site/img/covers/ch07.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第7話「ch07」 黒字なのに、現金がない。三枚の表がつながり、三社の経理が一つになる。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第7話「ch07」の表紙。この話の芯は「黒字なのに、現金がない。三枚の表がつながり、三社の経理が一つになる。」。扱う題材は 財務・シェアードサービス・月次決算・内部統制・監査。象徴として使えるモチーフ: 会計上は、相殺後、三つ、星印、晴れの日の傘。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #8a6d3b。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 7, "ch07". The core of this episode: 黒字なのに、現金がない。三枚の表がつながり、三社の経理が一つになる。 Subject matter: 財務, シェアードサービス, 月次決算, 内部統制, 監査. Motifs that can be used symbolically: 会計上は, 相殺後, 三つ, 星印, 晴れの日の傘. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #8a6d3b.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch08

- **ファイル**: `site/img/covers/ch08.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第8話「ch08」 何でも入る箱は、何を入れたか忘れる——ERP か、八つ目の箱か

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第8話「ch08」の表紙。この話の芯は「何でも入る箱は、何を入れたか忘れる——ERP か、八つ目の箱か」。扱う題材は ERP・生産管理・Fit to Standard・原価計算・統制と証跡。象徴として使えるモチーフ: 何でも入る箱、六秒、からあげ棒、体温、ハコデン。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #7a5c9e。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 8, "ch08". The core of this episode: 何でも入る箱は、何を入れたか忘れる——ERP か、八つ目の箱か Subject matter: ERP, 生産管理, Fit to Standard, 原価計算, 統制と証跡. Motifs that can be used symbolically: 何でも入る箱, 六秒, からあげ棒, 体温, ハコデン. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #7a5c9e.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch09

- **ファイル**: `site/img/covers/ch09.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第9話「ch09」 作ることには終わりがある。運用には、終わりがない。

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第9話「ch09」の表紙。この話の芯は「作ることには終わりがある。運用には、終わりがない。」。扱う題材は 運用保守・ITSM・インシデント管理・変更管理・SRE。象徴として使えるモチーフ: 四つの札、一つの窓口、見ます、今、買っていいか、お問い合わせありがとうございます。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #c0392b。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 9, "ch09". The core of this episode: 作ることには終わりがある。運用には、終わりがない。 Subject matter: 運用保守, ITSM, インシデント管理, 変更管理, SRE. Motifs that can be used symbolically: 四つの札, 一つの窓口, 見ます, 今、買っていいか, お問い合わせありがとうございます. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #c0392b.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 表紙 ch10

- **ファイル**: `site/img/covers/ch10.jpg`
- **形**: 縦長 2:3（1200×1800 以上）
- **誰・何**: 第10話「ch10」 システムは全部動いていた。それでも、靴は一足も出なかった

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

第10話「ch10」の表紙。この話の芯は「システムは全部動いていた。それでも、靴は一足も出なかった」。扱う題材は BCP・事業継続・DR・BIA・訓練。象徴として使えるモチーフ: 二週間分の靴、付箋とプレート、保険、祈り、四つ。舞台は日本の中小企業のオフィス・倉庫・工場のいずれか。基調色は #3b7fa5。

**表紙だけは色を使う**（単行本のカバーにあたる。巻頭の白黒とは別物）。縦長 2:3（1200×1800 以上）。題名の文字は描かない（アプリ側で重ねないため、絵だけで成立させる）。人物を描く場合は顔を寄りすぎない引きで、誰か特定できない程度に。基調色は指定の1色に寄せ、上下に余白の効いた静かな構図にする。肖像と同じく、線がはっきりした落ち着いた画風にする。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Cover art for episode 10, "ch10". The core of this episode: システムは全部動いていた。それでも、靴は一足も出なかった Subject matter: BCP, 事業継続, DR, BIA, 訓練. Motifs that can be used symbolically: 二週間分の靴, 付箋とプレート, 保険, 祈り, 四つ. Setting: the office, warehouse, or factory of a small Japanese company. Base color: #3b7fa5.

COVERS USE COLOR (they correspond to a hardcover's dust jacket, unlike the black-and-white front matter). Portrait 2:3 (1200x1800 or larger). Do not render any title text — the app does not overlay text, so the image must work on its own. If people appear, keep them at a distance so no individual is identifiable. Anchor the palette to the specified base color. Quiet composition with generous vertical breathing room. Keep the same clear-lined, restrained illustration sensibility as the portraits.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 rino

- **ファイル**: `site/img/characters/rino.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 佐伯 梨乃（さえき りの）／株式会社ヤマビコ ・ 経営企画室 ・ 経営企画室長（第7話〜）
- 「先月の売上は？」に一つの数字で答えられなかった入社二年目。三年かけて、会社の数字と仕組みを一本に通していく。
- **年齢**: 20代半ば　**性別**: 女性 — 提案（原稿に記載なし）
- **見分けどころ**: 外ハネのミディアムボブ＋社員証のストラップ

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

20代半ばの日本人女性。黒髪のミディアムボブ、毛先が少し外に跳ね、前髪は眉の上で切り揃えてある。髪はベタ塗りに細い線でつやを入れる。細面、目は大きめ、眉が少し寄っている。白いブラウス（線だけで、ほぼ白く抜く）の上に中間の濃さのカーディガン。首から社員証のストラップが一本、まっすぐ下がっている。胸の高さに小さなメモ帳を持ち、角だけが見えている。まだ自信はないが引かない、生真面目な表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her mid-20s. Black medium bob, ends flicked slightly outward, fringe cut straight above the eyebrows. Hair filled solid black with fine lines for sheen. Slender face, fairly large eyes, brows slightly knitted. White blouse (rendered almost entirely as white paper with outlines only) under a mid-tone cardigan. A single employee-ID lanyard hangs straight down from her neck. Holding a small notepad at chest height, only its corner visible. Earnest expression — not yet confident, but not backing down.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 akaumi

- **ファイル**: `site/img/characters/akaumi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 赤海 慧（あかうみ けい）／社外 ・ 夜座コンサルティング ・ シニアコンサルタント
- ヤマビコ四階の小部屋に常駐する外部の技術者。振り向かずに答え、褒めるときだけ、からあげ棒を差し出す。
- **年齢**: 30代半ば　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 無精髭＋目の下の隈＋顔の横のからあげ棒

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

30代半ばの日本人男性。伸びて無造作に散った黒髪、耳が半分隠れる長さ。無精髭を細かい短線で描く。目の下の隈をハッチングではっきり出す。痩せ型で頬がこけ、頬骨の下に影の線が入る。濃いパーカー（いちばん濃い階調。フードの縁が肩に見える）。顔のすぐ横に、串に刺したからあげ棒を一本、垂直に持っている。表情はほぼ無く、目つきだけが鋭い。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his mid-30s. Overgrown, unkempt black hair long enough to half-cover the ears. Stubble drawn with fine short strokes. Pronounced under-eye shadows built from hatching. Lean, hollow-cheeked, with shadow lines beneath the cheekbones. Dark hoodie (the darkest tone in the cast; the hood's edge visible at the shoulders). Holding a single food skewer vertically right beside his face. Almost no expression; only the gaze is sharp.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 hayase

- **ファイル**: `site/img/characters/hayase.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 早瀬（はやせ）／株式会社ヤマビコ ・ 経営企画室 → 受注システム担当
- 「当たりましたか」が口癖の新人。英語をそのまま訳しただけのとき、なぜかよく当たる。
- **年齢**: 20代前半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: きっちりした短髪＋ネクタイの結び目＋挙げかけた手

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

20代前半の日本人男性、新入社員。黒髪の短髪を几帳面に整え、生え際と分け目がはっきりしている。細身で丸みのある輪郭、肌は影をほとんど入れず白く残す。真新しい白いシャツ（ほぼ白抜き）に細いネクタイ。結び目が首の下にきちんと見える。片手を軽く挙げ、指先が肩の高さにある。目を見開いた、まっすぐで屈託のない表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his early 20s, a new hire. Neatly groomed short black hair with a clearly defined hairline and part. Slim, softly rounded jaw; the skin left almost entirely white with minimal shading. Brand-new white shirt (left as white paper) with a slim tie, its knot clearly visible below the throat. One hand raised slightly, fingertips at shoulder height. Wide-open eyes, direct and untroubled.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 mikami

- **ファイル**: `site/img/characters/mikami.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 三上 剛（みかみ つよし）／株式会社ヤマビコ ・ 営業部 ・ 営業部長
- 資料を見ずに、こめかみを叩いて数字を答える営業部長。名前が付くと機嫌がよくなる。
- **年齢**: 50代前半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 太い首＋開いた襟＋こめかみを叩く人差し指

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

50代前半の日本人男性、営業部長。短く刈った髪、こめかみと生え際に白髪を細い白抜きの線で示す。角張った顔、太い首、恰幅がよく肩幅が広い。白いワイシャツ（白抜き）の襟を開き、第一ボタンを外し、ネクタイは緩んで斜めに垂れている。袖はまくってある。人差し指を自分のこめかみに当てて軽く叩く仕草。口を開けて笑う、声の大きそうな自信満々の表情。目尻に太い笑い皺。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his early 50s, a sales director. Close-cropped hair, grey at the temples and hairline indicated by fine white gaps in the ink. Square face, thick neck, heavy build with broad shoulders. White dress shirt (left white) with the collar open, top button undone, tie loosened and hanging askew. Sleeves rolled up. Index finger tapping his own temple. Mouth open in a laugh, loud and supremely confident. Heavy crow's feet.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 okochi

- **ファイル**: `site/img/characters/okochi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 大河内（おおこうち）／株式会社ヤマビコ ・ 社長
- 例え話が例えになっていない社長。それでも半分くらいは、なぜか当たってしまう。
- **年齢**: 60代前半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 白髪のオールバック＋広い額＋肩の高さのコーヒーカップ

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

60代前半の日本人男性、中小企業の社長。白髪を後ろに撫でつけたオールバック。髪はベタ塗りにせず、細い線の束だけで描いて白さを出す。額が広く、生え際が後退している。柔らかい丸顔、目尻に深い笑い皺を三本ずつ。中間の濃さのジャケットに、ノーネクタイの白シャツ。肩の高さに取っ手付きのコーヒーカップを持っている。人懐こく、少し無責任そうな笑顔。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his early 60s, president of a small company. White hair swept straight back. Render the hair with thin line bundles only, no solid fill, so it reads as white. High forehead with a receding hairline. Soft round face, three deep laugh lines at each eye. Mid-tone jacket over an open-collar white shirt. Holding a handled coffee cup at shoulder height. Genial, faintly irresponsible smile.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 okazaki

- **ファイル**: `site/img/characters/okazaki.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 岡崎（おかざき）／株式会社ヤマビコ ・ 総務・情報システム
- 総務と情シスを兼ねる人。「わかりました」は本当にわかっていて、本当にやる。
- **年齢**: 30代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 七三分け＋胸ポケットのボールペン三本

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

30代後半の日本人。総務と情シスを兼ねる、目立たない人。黒髪をきちんと七三に分け、耳がすっきり出ている。特徴の少ない穏やかな顔立ち、表情の線は最小限。中間の濃さのシャツ、胸ポケットにボールペンが三本、頭を揃えて挿さっている（これがいちばんの目印）。控えめに口の端だけで微笑む。言いにくいことを言う前に息を吸った顔。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese person in their late 30s, handling both general affairs and IT. Black hair in a neat side part, ears fully exposed. Unremarkable, calm features drawn with minimal expression lines. Mid-tone shirt with three ballpoint pens lined up in the breast pocket, caps level — this is the key identifying detail. A restrained smile at the corner of the mouth only. The face of someone who has just drawn breath to say something awkward.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 tachibana

- **ファイル**: `site/img/characters/tachibana.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 橘（たちばな）／株式会社ヤマビコ ・ 経理部 → シェアードサービスセンター ・ SSC長（第7話〜）
- 「会計上は」が口癖の経理。眼鏡を押し上げたら、それは戦闘態勢の合図。
- **年齢**: 30代後半　**性別**: 女性 — 提案（原稿に記載なし）
- **見分けどころ**: 後ろでまとめた髪＋細い楕円の銀縁眼鏡＋眼鏡を押し上げる指

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

30代後半の日本人女性、経理。黒髪を後ろできっちりまとめ、額と耳が完全に出ている。髪はベタ塗り。細い楕円のフレームの眼鏡（線一本ぶんの細さで描く）。輪郭も目つきもシャープで、頬に余分な肉がない。白シャツの上に濃いベスト（濃い階調をクロスハッチで作る）。人差し指と中指を揃えて眼鏡のブリッジを押し上げている。感情を出さない、理詰めで隙のない表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her late 30s, an accountant. Black hair pulled back tightly, forehead and ears fully exposed. Hair filled solid black. Thin oval-framed glasses drawn with a single-width line. Sharp jaw and sharp eyes, no softness in the cheeks. White shirt under a dark vest (the dark tone built from cross-hatching). Index and middle fingers together, pushing the bridge of her glasses up. Unemotional, airtight, logical.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 shimura

- **ファイル**: `site/img/characters/shimura.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 志村（しむら）／株式会社ヤマビコ ・ 商品部
- 商品のことなら何でも知っていて、何でも話す。靴紐の話は、三十分のうち二十分。
- **年齢**: 40代前半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: もじゃっとしたくせ毛＋首にかけた靴紐

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

40代前半の日本人男性、商品部。黒いくせ毛がもじゃっと広がり、輪郭が丸い雲のような形になっている。日に焼けた肌をまばらなハッチングで示す。人の良さそうな丸い目。中間の濃さのフリースベストの下にチェックのシャツ（チェックは細い格子線で示す）。首に登山靴の丸紐を一本、両端を垂らしてかけている。今まさに長い話を始めようとしている、嬉しそうに口を開いた表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his early 40s, product department. Black frizzy hair spreading out so the silhouette reads as a round cloud. Tanned skin suggested by sparse hatching. Kind round eyes. Mid-tone fleece vest over a checked shirt (the check indicated with a fine grid of lines). A round hiking bootlace draped around his neck with both ends hanging. Mouth already open, delighted, about to launch into a long story.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 takanashi

- **ファイル**: `site/img/characters/takanashi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 高梨（たかなし）／株式会社ヤマビコ ・ EC・API 開発 ・ エンジニア
- 気弱そうに見えて、コードを書いているときだけ別人になるエンジニア。
- **年齢**: 30代前半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 目にかかる長い前髪＋八の字の眉

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

30代前半の日本人男性、エンジニア。黒髪の前髪が長く、目の上にかかって片目が半分隠れている。痩せ型で色白、肌の影はほとんど入れない。中間の濃さのパーカーの下に黒いTシャツ（襟元だけが濃い）。眉の内側を下げた八の字、口は小さく結ぶ。何も起きていないのに謝りそうな顔。少しうつむき加減だが、目線はこちらへ上げている。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his early 30s, a software engineer. Long black fringe falling over the eyes, half-hiding one of them. Thin, pale, with almost no shading on the skin. Mid-tone hoodie over a black T-shirt (only the neckline dark). Eyebrows angled down at the inner ends, mouth held small. The face of someone about to apologize though nothing has gone wrong. Head slightly lowered, eyes raised to the viewer.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 morita

- **ファイル**: `site/img/characters/morita.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 森田（もりた）／株式会社ヤマビコ ・ マーケティング部
- 「見たほうが早い」と言ってノートパソコンを開き、そのたびに電池が切れる。
- **年齢**: 30代半ば　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 軽く立てた短髪＋つまみ上げた充電ケーブル

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

30代半ばの日本人男性、マーケティング。短髪を軽く立てて毛先が散っている。髪はベタ塗りにせず線を重ねて明るめに描く。細身で頬の線がすっきりしている。明るい階調のカジュアルジャケット（ほぼ白抜き）に白いインナー。肩の高さに、細い充電ケーブルを一本つまんで垂らして持ち上げている。眉を上げて口角を曲げた、困りながら笑っている表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his mid-30s, marketing. Short hair lightly spiked, tips scattered. Draw the hair with layered lines rather than solid fill so it reads light. Slim, with a clean cheek line. Light-toned casual jacket (left nearly white) over a white tee. Pinching a thin charging cable and holding it up at shoulder height, the cable hanging free. Eyebrows raised, mouth crooked — laughing while visibly troubled.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 tanaka

- **ファイル**: `site/img/characters/tanaka.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 田中（たなか）／株式会社ヤマビコ ・ 営業部（第1話の終わりに定年退職）
- 二十年ぶん、五か所のデータを一人で突き合わせてきた「売上管理_最新_v37_修正版.xlsx」の人。
- **年齢**: 50代後半　**性別**: 女性 — 提案（原稿に記載なし。語尾を伸ばす話し方と「高梨くん」の呼び方から）
- **見分けどころ**: 短いパーマの白髪＋鼻先まで下げた老眼鏡＋湯呑み

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

50代後半の日本人女性、営業部のベテラン。短いパーマ髪を、細かく巻いた線の連なりで描く。白髪なのでベタ塗りは使わず、線を疎にして白く残す。老眼鏡を鼻先まで下げてかけ、レンズの上から相手を見ている（これがいちばんの目印）。目尻と口元に細かい皺。中間の濃さのカーディガン。胸の高さに湯呑みを両手で包むように持つ。照れくさそうに目を細めた、穏やかで満足そうな表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her late 50s, a veteran of the sales department. Short permed hair drawn as a chain of tight curled strokes. Since the hair is grey, use no solid fill — keep the strokes sparse so it reads white. Reading glasses slipped down to the tip of her nose, looking at the viewer over the top of the lenses — this is the key identifying detail. Fine wrinkles at the eyes and mouth. Mid-tone cardigan. Holding a teacup at chest height, cupped in both hands. Eyes crinkled, bashful, calm and quietly satisfied.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kiriyama

- **ファイル**: `site/img/characters/kiriyama.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 桐山（きりやま）／株式会社ヤマビコ ・ 開発
- 表紙に「赤海語録」と書いたノートを持ち歩く開発者。深夜二時には、何も書かない。
- **年齢**: 20代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 跳ねたくせ毛＋太い黒縁の丸眼鏡＋構えたノートとペン

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

20代後半の日本人男性、開発者。黒いくせ毛が数か所で跳ねている。太い黒縁の**丸い**眼鏡（線を二重にして太さを出す）。無地の黒いTシャツ（濃い階調、首元は丸首）。胸の高さに大学ノートを開いて構え、もう片手にペンを持ち、今から書き留めようとしている。目が好奇心で見開かれ、口元が少し笑っている。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his late 20s, a developer. Black curly hair sticking out in several places. Thick black-rimmed ROUND glasses (doubled lines to give weight). Plain black crew-neck T-shirt (dark tone). Holding an open notebook at chest height with a pen in the other hand, about to write something down. Eyes wide with curiosity, a small smile at the mouth.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 sato

- **ファイル**: `site/img/characters/sato.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 佐藤（さとう）／ヤマビコグループ ・ 埼玉倉庫 → ヤマビコロジ ・ 社長（第7話〜）
- 倉庫の人。「それ、請求書に載ります？」と唐突に聞き、やがてグループ会社の社長になる。
- **年齢**: 40代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 角張った頭の短い刈り込み＋作業着の立ち襟＋差し出した名刺

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

40代後半の日本人男性、物流倉庫の責任者。短く刈った黒髪で、頭の輪郭が角張って見える。日に焼けた肌を斜線のハッチングで示し、他の人物より濃い。骨太で健康的な顔立ち。濃い階調の作業着の上衣、立ち襟の内側から白いTシャツがのぞく。胸の高さに名刺を一枚、両手で正面に差し出している。まっすぐで飾らない、少し硬い真面目な表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his late 40s, head of a distribution warehouse. Closely cropped black hair giving the skull a squared silhouette. Tanned skin indicated by diagonal hatching, darker than the rest of the cast. Solid, healthy features. Dark-toned work jacket with a stand collar, a white tee showing at the neck. Offering a business card with both hands, held forward at chest height. Direct, unadorned, slightly stiff and earnest.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 yanagi

- **ファイル**: `site/img/characters/yanagi.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 柳（やなぎ）／ヤマビコグループ ・ ライズ・フットウェア 長野工場 ・ 工場長
- 六秒で答える工場長。言いにくいことも、地震の日も、六秒。
- **年齢**: 五十代　**性別**: 男性 — 原文明記（五十代の男性）
- **見分けどころ**: 白髪の角刈り＋真一文字の口＋胸の高さの古い電卓

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

五十代の日本人男性、靴工場の工場長。白髪の混じった短い角刈りで、頭頂が平らに見える。髪は線を疎にして白く残す。四角い顔に深い縦皺が二本、口の両脇に入る。日に焼けた肌。中間の濃さの作業着に襟付きのインナー、胸に工場名のない無地のネームプレート。口を真一文字に結んでいる。胸の高さに、角の丸い古いソーラー電卓を一つ持つ。余計なことを言わない、必要なだけ見返す静かな目。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his 50s, manager of a shoe factory. Short crew cut greying throughout, the crown reading flat. Keep the hair strokes sparse so it reads white. Square face with two deep vertical creases flanking the mouth. Weathered skin. Mid-tone work uniform over a collared inner shirt, with a blank name plate on the chest. Mouth set in a straight line. Holding an old solar calculator with rounded corners at chest height. Quiet eyes that look back exactly as much as needed and no more.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kumagai

- **ファイル**: `site/img/characters/kumagai.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 熊谷（くまがい）／ヤマビコグループ ・ ライズ・フットウェア 経理 → シェアードサービスセンター
- 六十三歳。紙の伝票を持って新幹線で来る。「一円も、間違えてない」
- **年齢**: 63歳　**性別**: 男性 — 原文明記（六十三歳の男性）
- **見分けどころ**: 白髪の七三＋アームカバー＋胸に抱えた伝票の束

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

63歳の日本人男性、工場の経理。薄くなった白髪を七三に整える。髪は線を疎にして白く残す。痩せた頬に深い影のハッチング。細い銀縁の**丸い**眼鏡（線一本ぶんの細さ）。白いワイシャツの上に濃い事務用ベスト、前腕に黒いアームカバー（これがいちばんの目印）。胸に紙の伝票の束を両腕で大事そうに抱えている。姿勢を正した、誇りと少しの寂しさが同居した表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man aged 63, factory accountant. Thinning white hair in a neat side part; keep the strokes sparse so it reads white. Gaunt cheeks with deep hatched shadows. Thin silver-rimmed ROUND glasses drawn with a single-width line. White dress shirt under a dark office vest, with black sleeve protectors on the forearms — the key identifying detail. Clutching a bundle of paper vouchers to his chest with both arms, as if precious. Posture straightened; pride and a trace of loneliness together.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kawabe

- **ファイル**: `site/img/characters/kawabe.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 川辺（かわべ）／社外 ・ オーダーリンク社（受注 SaaS） ・ 導入担当
- 充電器を四本持ってくる SaaS の導入担当。営業スマイルなのに、目が笑っていない。
- **年齢**: 三十代　**性別**: 女性 — 原文明記（三十代の女性）
- **見分けどころ**: 低いまとめ髪＋横に流した前髪＋目の笑っていない営業スマイル

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

三十代の日本人女性、SaaS ベンダーの導入担当。黒髪を襟足の低い位置できっちりまとめ、前髪を横に流している。髪はベタ塗りにつやの白線。整った顔立ちで、輪郭も眉も左右の対称がきれい。濃い階調のスーツの襟と、白いインナーのコントラストがはっきりしている。口角を正確に上げた完璧な営業スマイル。**ただし目はまったく笑っておらず、下まぶたが動いていない。** そこが分かるよう、目の周りだけ線を硬く引く。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her 30s, implementation lead at a SaaS vendor. Black hair gathered into a low bun at the nape, fringe swept to one side. Hair filled solid black with white sheen lines. Neat, symmetrical features — jaw and brows evenly matched. Strong contrast between the dark-toned suit lapels and the white blouse. A perfect sales smile with the corners of the mouth precisely raised. HOWEVER, THE EYES ARE NOT SMILING AT ALL — the lower lids do not move. Draw the lines around the eyes harder than elsewhere so this reads.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 sanada

- **ファイル**: `site/img/characters/sanada.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 真田（さなだ）／社外 ・ 社F（生産管理専業パッケージ） ・ 導入担当
- 「四十社、全部そうやりました」と数で語り、無理な要求はそのまま断る。
- **年齢**: 40代前半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 角刈り＋まったく動かない表情＋無地のネクタイ

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

40代前半の日本人男性、生産管理パッケージの導入担当。黒髪の角刈りに近い短髪で、髪の輪郭が直線的。地味で頑丈そうな骨格。中間の濃さの飾り気のないスーツ、白シャツ、柄のない無地のネクタイ。眉も口も水平で、表情がまったく動かない。断るときも同じ顔。まっすぐな視線。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his early 40s, implementation lead for a production-control package. Black hair in a near crew cut with a straight-edged silhouette. Plain, sturdy bone structure. Mid-tone, unadorned suit, white shirt, a completely plain tie. Brows and mouth both horizontal; the expression does not move at all — the same face he wears when refusing a request. Level gaze.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 nishimura

- **ファイル**: `site/img/characters/nishimura.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 西村（にしむら）／株式会社ヤマビコ ・ サービスデスク（一次対応）
- 小部屋に入るたび「お問い合わせありがとうございます」と言ってしまう。八年の癖。
- **年齢**: 20代後半　**性別**: 女性 — 提案（原稿に記載なし）
- **見分けどころ**: ヘッドセットのマイクアーム（唯一の装備）＋ショートボブ

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

20代後半の日本人女性、サービスデスク。黒髪のショートボブ、毛先が顎の線で内に入る。髪はベタ塗り。**細いヘッドセットを着け、マイクのアームが頬に沿って口元の横まで伸びている**（25人でこの人だけ。いちばんの目印）。明るい階調のシャツ、襟は小さい。感じのよい、よく通る声が想像できる自然な微笑み。丁寧で機敏な印象。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her late 20s, service desk. Short black bob, ends turning inward at the jawline. Hair filled solid black. SHE WEARS A SLIM HEADSET WITH THE BOOM MIC RUNNING ALONG HER CHEEK TO THE CORNER OF HER MOUTH — she is the only one of the 25 with this, and it is the key identifying detail. Light-toned shirt with a small collar. A natural, pleasant smile from which a clear carrying voice can be imagined. Polite and quick.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 ono

- **ファイル**: `site/img/characters/ono.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 小野（おの）／社外 ・ 監査法人 ・ 公認会計士
- 監査法人の会計士。持っている言葉は「証跡」と「統制」の二つ。
- **年齢**: 30代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 太い黒縁の角眼鏡＋最も濃いスーツ＋動かない口元

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

30代後半の日本人男性、公認会計士。黒髪をきっちり整え、乱れが一本もない。太い黒縁の**角ばった**眼鏡（線を二重にして太さを出す。丸眼鏡の桐山・熊谷と形で区別する）。細面で表情がまったく動かない。**25人でいちばん濃い階調のスーツ**（クロスハッチを密に重ねる）、白シャツ、地味なネクタイ。口を閉じたまま相手を見ている。硬質で静かな印象。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his late 30s, a certified public accountant. Black hair perfectly groomed, not a strand loose. Thick black-rimmed RECTANGULAR glasses (doubled lines for weight; the angular shape distinguishes him from the round-glassed Kiriyama and Kumagai). Narrow face, entirely immobile expression. THE DARKEST SUIT OF THE 25 (dense layered cross-hatching), white shirt, sober tie. Watching the viewer with his mouth closed. Hard-edged and quiet.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 nomura

- **ファイル**: `site/img/characters/nomura.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 野村（のむら）／ヤマビコグループ ・ ヤマビコロジ 経理（パート）→ シェアードサービスセンター
- 「会計上は」を復唱するようになった SSC のパート。付けなくていい場面も、わかってきた。
- **年齢**: 40代後半　**性別**: 女性 — 提案（原稿に記載なし）
- **見分けどころ**: 肩で切り揃えた直毛を片耳にかける＋明るい事務ベスト

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

40代後半の日本人女性、経理事務。黒髪を肩の線でまっすぐ切り揃え、片side だけ耳にかけている（片耳だけ出ているのが目印）。髪はベタ塗り。柔らかい輪郭、目尻がやや下がっている。明るい階調の事務用ベストに白いブラウス、襟は丸い。落ち着いた、少し控えめな微笑み。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her late 40s, accounting clerk. Black hair cut straight at the shoulders, tucked behind one ear only — the exposed single ear is the identifying detail. Hair filled solid black. Soft jawline, outer corners of the eyes slightly downturned. Light-toned office vest over a white blouse with a rounded collar. A settled, slightly reserved smile.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 yoshida

- **ファイル**: `site/img/characters/yoshida.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 吉田（よしだ）／株式会社ヤマビコ ・ 営業事務（パート）
- 顧客コードは覚えられない。「山岳会の名前で探せないと、困ります」
- **年齢**: 40代後半　**性別**: 女性 — 提案（原稿に記載なし）
- **見分けどころ**: 後ろで一つに束ねた髪＋後れ毛＋困り眉

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

40代後半の日本人女性、営業事務のパート。黒髪を後ろで一つに束ね、こめかみに後れ毛が数本落ちている（束ねた髪が首の横から少し見える）。髪はベタ塗り。眉の内側を少し下げ、口を横に結んだ、困っているが不機嫌ではない表情。明るい階調の事務用ベストに白いブラウス。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her late 40s, part-time sales clerk. Black hair tied back in a single bunch, with a few loose strands falling at the temples; the tied hair is just visible past the side of the neck. Hair filled solid black. Inner ends of the eyebrows slightly lowered, mouth set sideways — troubled but not displeased. Light-toned office vest over a white blouse.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 ogawa

- **ファイル**: `site/img/characters/ogawa.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 小川（おがわ）／株式会社ヤマビコ ・ 営業事務（パート）
- 「その FAX、まだ取ってあります。見ますか」
- **年齢**: 50代前半　**性別**: 女性 — 提案（原稿に記載なし）
- **見分けどころ**: 白髪混じりの短いパーマ＋胸の高さの紙の綴り

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

50代前半の日本人女性、営業事務のパート。短いパーマ髪に白髪が混じり、線を疎にして明るく描く（田中より巻きが緩い）。ふっくらした輪郭。明るい階調の事務服、襟は角ばっている。胸の高さに、薄い紙の綴りを一束、片手で持っている。悪びれない、ごく自然な表情。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese woman in her early 50s, part-time sales clerk. Short permed hair with grey mixed through, drawn with sparse strokes so it reads light (looser curl than Tanaka's). Fuller jawline. Light-toned office uniform with a squared collar. Holding a thin bound stack of paper in one hand at chest height. An entirely unselfconscious, natural expression.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 kaicho

- **ファイル**: `site/img/characters/kaicho.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 会長（かいちょう）／社外 ・ 杉並山岳会 ・ 会長
- 杉並山岳会の会長。法人の顧客として、注文の向こう側に名前が出る。
- **年齢**: 60代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 白い顎髭（25人で唯一）＋深く日に焼けた顔

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

60代後半の日本人男性、山岳会の会長。短い白髪と、**短く刈り込んだ白い顎髭**（顎髭があるのは25人でこの人だけ。いちばんの目印）。髪も髭も線を疎にして白く残す。深く日に焼けた顔をハッチングで濃く出し、目尻の皺が放射状に深い。中間の濃さのフリースジャケット、襟が高く立っている。豪快で人望のありそうな笑顔。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his late 60s, chairman of a mountaineering club. Short white hair and A CLOSELY TRIMMED WHITE BEARD — he is the only one of the 25 with a beard, and it is the key identifying detail. Keep both hair and beard sparse in stroke so they read white. Deeply weathered face built up with hatching, with deep radiating crow's feet. Mid-tone fleece jacket with a high standing collar. A broad, well-liked, hearty smile.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 shoken_senior

- **ファイル**: `site/img/characters/shoken_senior.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 証券会社の年上のほう（読み未設定）／社外 ・ 主幹事候補の証券会社 引受審査部
- 引受審査部。ERP の会社名より、三十ページの説明書のほうが読みやすいと正直に言う。
- **年齢**: 40代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: こめかみの白髪＋濃いスーツ＋値踏みする穏やかな目

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

40代後半の日本人男性、証券会社の引受審査部。髪をきちんと整え、こめかみだけ白髪を白抜きの線で示す。年齢相応の額の横皺。濃い階調のスーツに控えめなネクタイ（小野より一段薄く、柄がある）。相手の話を静かに聞いている、穏やかだが値踏みする目。わずかに口角が上がりかけている。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his late 40s, underwriting review at a securities firm. Neatly groomed hair with grey at the temples indicated by white gaps in the ink. Age-appropriate horizontal lines on the forehead. Dark-toned suit with a restrained patterned tie (one step lighter than Ono's, and not plain). Listening quietly — calm eyes that are nonetheless appraising. The corner of his mouth just beginning to lift.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

---

## 肖像 shoken_junior

- **ファイル**: `site/img/characters/shoken_junior.jpg`
- **形**: 正方形 1:1（1024×1024 以上・円形に切り抜いて使う）
- **誰・何**: 証券会社の年下のほう（読み未設定）／社外 ・ 主幹事候補の証券会社 引受審査部
- 引受審査部。三上の「SAP。強い」には、答えなかった。
- **年齢**: 20代後半　**性別**: 男性 — 提案（原稿に記載なし）
- **見分けどころ**: 若さと硬い無表情＋細いネクタイ

<details><summary>日本語プロンプト（貼り付け用）</summary>

```text
単行本の巻頭に載る登場人物紹介の挿絵。白と黒だけのペン画。色は一切使わない（モノクロ／グレースケール）。細く均一なペンの線で輪郭と髪を描き、陰影は斜線のハッチングとクロスハッチで作る。網点・スクリーントーン・写真的なぼかしは使わない。ベタ塗りは髪と濃い服の一部だけにとどめ、顔には使わない。紙に黒インクで刷った線に見えること。落ち着いた文芸書の挿絵の品格で、劇画にもアニメ絵にもしない。25人すべてを同じペンの太さ・同じハッチングの密度・同じ描き込み量で揃える。

20代後半の日本人男性、証券会社の若手。短く整えた黒髪、髪はベタ塗り。若く張りのある肌で影の線がほとんど無い。濃い階調のスーツ、白シャツ、細いネクタイ。表情をまったく変えない硬い顔で、緊張が少し出ている。

正方形 1:1（1024×1024 以上）。バストアップ。正面から 15 度以内のわずかな斜め。こちらを見ている。頭頂の上に画面の 10 パーセントほど余白を残し、目の高さを上から 40 パーセントあたりに置く。肩の線が下端にわずかにかかる。背景は紙の白のまま（room・家具・小物・模様・枠線・飾り罫・文字を描かない）。**画像は円形に切り抜いて表示するので、四隅には何も置かない。** 小物は顔のすぐ横か、肩から胸の高さに小さく添える。**色が使えないので、髪のかたち・眼鏡のかたち・髭・襟のかたち・服の明るさ（白／中間／濃い）で区別を付ける。** 44 ピクセルまで縮めても誰か分かること。

色を使わない（部分的な差し色も禁止）。文字・ロゴ・透かし・署名・枠線を入れない。背景に室内や風景を描かない。網点やスクリーントーンを貼らない。極端なあおりや俯瞰、横顔、後ろ姿にしない。手で顔を隠さない。実在の人物に似せない。過度な美化（全員を若く整った顔にする）をしない。年齢と職種が見た目に出ていること。
```

</details>

<details><summary>English prompt (for Midjourney / SD など英語が得意な生成器)</summary>

```text
A character-introduction illustration of the kind printed in the front matter of a Japanese hardcover novel. Black-and-white pen-and-ink drawing only — no color whatsoever (monochrome / grayscale). Thin, even pen lines for the contours and hair; shading built from parallel hatching and cross-hatching. No halftone dots, no screentone, no photographic blur. Solid black fills only in parts of the hair and dark clothing, never on the face. It must read as black ink printed on paper. The restrained dignity of literary-book illustration — neither gekiga nor anime. All 25 portraits must share identical pen weight, hatching density, and level of detail.

Japanese man in his late 20s, a junior at a securities firm. Short neat black hair, filled solid. Young, taut skin with almost no shading lines. Dark-toned suit, white shirt, slim tie. A stiff face that does not change at all, with a trace of tension showing.

Square 1:1 (1024x1024 or larger). Head-and-shoulders bust. Facing the viewer, within 15 degrees of frontal. Leave about 10% headroom above the top of the head; place the eyes at roughly 40% from the top. Shoulders just touch the bottom edge. Background: the white of the paper, left plain — no rooms, furniture, objects, patterns, frames, decorative rules, or text. IMPORTANT: the image will be cropped to a circle, so keep all four corners empty. Place any prop right beside the face or at shoulder-to-chest height. SINCE COLOR IS UNAVAILABLE, distinguish characters by hair shape, glasses shape, facial hair, collar shape, and the tonal value of the clothing (white / mid-grey / dark). The character must remain identifiable when scaled down to 44 pixels.

No color at all, not even as an accent. No text, logos, watermarks, signatures, or frames. No interior or landscape background. No halftone or screentone. No extreme low/high angle, profile, or back view. Do not cover the face with hands. Do not resemble any real person. Avoid over-idealizing — do not make everyone young and conventionally attractive. Age and occupation should read from the appearance.
```

</details>

