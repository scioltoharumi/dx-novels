/**
 * 肖像の部品（髪・襟・小物・年齢の皺）。25人ぶんを手で描くと必ずばらけるので、
 * 型を用意して人物ごとに選ぶ。見分けどころは meta/art.json の tell に対応させる。
 *
 * 髪の塗り方は3段階。これが年齢差のいちばん効く手がかりになる。
 *   solid … 黒髪（ベタ）
 *   grey  … 白髪混じり（輪郭＋やや多めの筋）
 *   white … 白髪（輪郭＋少しの筋）
 */
import { ink, blob, round, inset } from "./penlib.mjs";

export const INK = "#141210";
export const PAPER = "#f7f4ed";

/* ================= 髪の塗り ================= */
/** 髪の塊。fill に応じて、ベタ／輪郭のみ／輪郭＋筋 を描き分ける */
export function mass(pts, bulge, fill = "solid", strands = []) {
  const outer = blob(pts, { bulge });
  if (fill === "solid") return `<path d="${outer}" fill="${INK}"/>`;
  // 白髪・白髪混じりは「輪郭＋筋」で描く。抜きすぎると頭が薄く見えるので、
  // 内側の抜きは浅く、筋は多めに入れる（grey は white より濃い）
  const depth = fill === "grey" ? 5 : 6;
  const innerPts = inset(pts, depth);
  const innerB = Array.isArray(bulge) ? bulge.map(b => b * 0.82) : bulge * 0.82;
  const w = fill === "grey" ? 5.2 : 4;
  const strandInk = strands.map(s => ink(s, { w, profile: "both" })).join(" ");
  // grey は筋のあいだにもう一本細い線を足して密度を上げる
  const extra = fill === "grey"
    ? strands.map(s => ink(s.map(([x, y]) => [x + 9, y + 4]), { w: 3, profile: "both" })).join(" ")
    : "";
  return `<path d="${outer}" fill="${INK}"/>
    <path d="${blob(innerPts, { bulge: innerB })}" fill="${PAPER}"/>
    ${strandInk ? `<path d="${strandInk} ${extra}" fill="${INK}"/>` : ""}`;
}

/** 髪型。どれも { back, front, shine } を返す。X=中心, C=頭頂, T=こめかみ幅 */
export const HAIR = {
  /** 外ハネのボブ（梨乃） */
  bob: (g, f = "solid") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 54], [X + 62, 70], [X + T + 16, 132], [X + T + 14, 210], [X + T + 22, 292],
        [X + 74, 282], [X + 68, 212], [X + 62, 152], [X, 132],
        [X - 62, 152], [X - 68, 212], [X - 74, 282], [X - T - 22, 292],
        [X - T - 14, 210], [X - T - 16, 132], [X - 62, 70],
      ], [12, 12, 8, 5, -9, 7, 7, 10, 10, 7, 7, -9, 5, 8, 12, 12], f,
        [[[X - 60, 170], [X - 66, 230], [X - 62, 270]], [[X + 60, 170], [X + 66, 230], [X + 62, 270]]]),
      front: mass([
        [X, 66], [X + 68, 104], [X + 82, 182], [X + 62, 202], [X + 56, 152], [X + 28, 132],
        [X - 2, 162], [X - 32, 134], [X - 58, 154], [X - 62, 200], [X - 82, 180], [X - 68, 104],
      ], [13, 8, -4, 5, -6, -7, -7, -7, -6, 5, -4, 8], f,
        [[[X - 40, 112], [X - 54, 150], [X - 58, 186]]]),
      shine: f === "solid" ? blob([[X - 44, 106], [X - 14, 96], [X - 20, 118], [X - 50, 130]], { bulge: 4 }) : null,
    };
  },

  /** 伸びて散らかった短髪（赤海） */
  mess: (g, f = "solid") => {
    const X = g.cx;
    return {
      back: mass([
        [X - 24, 50], [X + 12, 60], [X + 40, 46], [X + 66, 64], [X + 92, 58], [X + 102, 112],
        [X + 92, 160], [X + 100, 218], [X + 78, 206], [X + 72, 160], [X + 64, 132], [X, 120],
        [X - 64, 132], [X - 72, 160], [X - 78, 206], [X - 100, 218], [X - 92, 160], [X - 102, 112],
        [X - 90, 56], [X - 60, 68],
      ], [-8, -8, -8, -8, 6, -6, -5, 5, 5, 7, 7, 5, 5, -5, -6, 6, -8, -8, -8, -8], f,
        [[[X - 70, 130], [X - 80, 170], [X - 82, 200]], [[X + 70, 130], [X + 80, 170], [X + 82, 200]]]),
      front: mass([
        [X, 66], [X + 62, 98], [X + 84, 176], [X + 70, 208], [X + 58, 164], [X + 34, 144],
        [X + 12, 180], [X - 14, 146], [X - 40, 178], [X - 60, 152], [X - 76, 202], [X - 86, 168],
        [X - 62, 98],
      ], [11, 7, -5, 4, -8, -10, -10, -10, -8, -8, 4, -5, 7], f, []),
      shine: null,
    };
  },

  /** 後ろでまとめた髪。束が首の右へ（橘・川辺） */
  pulled: (g, f = "solid", bun = 1) => {
    const X = g.cx;
    return {
      back: mass([
        [X, 62], [X + 62, 84], [X + 78, 150], [X + 80, 186], [X + 96 * bun, 212], [X + 100 * bun, 262],
        [X + 84 * bun, 284], [X + 70 * bun, 268], [X + 78, 226], [X + 64, 198], [X + 62, 152], [X, 132],
        [X - 62, 152], [X - 64, 198], [X - 78, 186], [X - 78, 150], [X - 62, 84],
      ], [11, 8, 3, -5, -7, -6, 5, 6, 5, 3, 6, 6, 3, -5, 3, 8], f,
        [[[X - 44, 150], [X - 58, 172], [X - 62, 188]], [[X + 44, 150], [X + 58, 172], [X + 62, 188]]]),
      front: mass([
        [X, 72], [X + 62, 100], [X + 74, 158], [X + 56, 146], [X + 30, 132], [X, 140],
        [X - 30, 132], [X - 56, 146], [X - 74, 158], [X - 62, 100],
      ], [11, 4, -3, -5, -3, -3, -5, -3, 4, 11], f, []),
      shine: f === "solid" ? blob([[X - 40, 98], [X - 4, 88], [X - 10, 104], [X - 44, 116]], { bulge: 3 }) : null,
    };
  },

  /** きっちり短髪。variant で前髪を変える（0=横に流す / 1=角刈り / 2=標準） */
  crew: (g, f = "solid", variant = 2) => {
    const X = g.cx, T = g.temple;
    const front = {
      // 分け目から斜めに流す（早瀬）
      0: [[[X - 24, 72], [X + 56, 96], [X + 72, 154], [X + 52, 142], [X + 34, 120], [X - 2, 132],
           [X - 34, 146], [X - 62, 156], [X - 72, 146], [X - 56, 90]],
          [9, 4, -3, -4, -5, -5, -4, -3, 5, 10]],
      // 角刈り。生え際が直線的（佐藤・真田）
      1: [[[X, 78], [X + 60, 102], [X + 68, 146], [X + 48, 136], [X + 20, 126], [X - 10, 128],
           [X - 40, 126], [X - 62, 138], [X - 68, 146], [X - 60, 102]],
          [4, 2, -2, -2, -2, -2, -2, -2, 2, 4]],
      2: [[[X, 74], [X + 58, 100], [X + 70, 152], [X + 50, 140], [X + 22, 128], [X - 8, 134],
           [X - 36, 128], [X - 60, 142], [X - 70, 152], [X - 58, 100]],
          [10, 4, -3, -5, -4, -4, -4, -3, 4, 10]],
    }[variant];
    return {
      back: mass([
        [X, 66], [X + 56, 80], [X + T + 6, 138], [X + T + 4, 196], [X + T - 8, 190],
        [X + T - 12, 146], [X + 52, 126], [X, 116],
        [X - 52, 126], [X - T + 12, 146], [X - T + 8, 190], [X - T - 4, 196], [X - T - 6, 138], [X - 56, 80],
      ], [10, 8, 3, -5, 4, 5, 5, 5, 5, 4, -5, 3, 8, 10], f,
        [[[X - 40, 128], [X - 58, 150], [X - 64, 176]], [[X + 40, 128], [X + 58, 150], [X + 64, 176]],
         [[X - 12, 122], [X - 20, 142], [X - 18, 162]], [[X + 16, 122], [X + 24, 142], [X + 22, 162]]]),
      front: mass(front[0], front[1], f, f === "solid" ? [] :
        [[[X - 30, 100], [X - 46, 124], [X - 54, 144]], [[X + 30, 100], [X + 46, 124], [X + 54, 144]]]),
      shine: null,
    };
  },

  /** 七三分け（岡崎・熊谷・小野・証券の年上） */
  part: (g, f = "solid", slick = 0) => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 64], [X + 58, 80], [X + T + 6, 142], [X + T + 2, 200], [X + T - 10, 194],
        [X + T - 14, 150], [X + 54, 128], [X, 118],
        [X - 54, 128], [X - T + 14, 150], [X - T + 10, 194], [X - T - 2, 200], [X - T - 6, 142], [X - 58, 80],
      ], [10, 8, 3, -5, 4, 5, 5, 5, 5, 4, -5, 3, 8, 10], f,
        [[[X - 42, 126], [X - 60, 152], [X - 66, 180]], [[X + 42, 126], [X + 60, 152], [X + 66, 180]]]),
      front: mass([
        [X - 18, 72], [X + 56, 96], [X + 72, 156], [X + 52, 144], [X + 30, 124], [X - 4, 130],
        [X - 40, 140], [X - 66, 158], [X - 72, 150], [X - 56, 92],
      ], [10 - slick * 3, 4, -3, -4, -4, -4, -3, 4, 6, 10], f, []),
      shine: f === "solid" && slick ? blob([[X + 6, 92], [X + 44, 100], [X + 38, 116], [X + 2, 108]], { bulge: 3 }) : null,
    };
  },

  /** 撫でつけた白髪、額が広い（大河内） */
  slickBack: (g, f = "white") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 78], [X + 54, 92], [X + T + 4, 150], [X + T, 202], [X + T - 12, 196],
        [X + T - 16, 156], [X + 50, 140], [X, 132],
        [X - 50, 140], [X - T + 16, 156], [X - T + 12, 196], [X - T, 202], [X - T - 4, 150], [X - 54, 92],
      ], [9, 7, 3, -4, 4, 4, 4, 4, 4, 4, -4, 3, 7, 9], f,
        [[[X - 30, 96], [X - 54, 124], [X - 66, 158]], [[X, 90], [X - 26, 122], [X - 38, 156]],
         [[X + 30, 96], [X + 54, 124], [X + 66, 158]], [[X + 2, 90], [X + 26, 122], [X + 38, 156]]]),
      front: null, shine: null,
    };
  },

  /** 頭頂が薄く、こめかみと後ろに残る（三上）。顔の輪郭より外へ出さないと消えてしまう */
  thinTop: (g, f = "grey") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 86], [X + 52, 98], [X + T + 16, 156], [X + T + 14, 212], [X + T - 2, 206],
        [X + T - 8, 162], [X + 44, 146], [X, 140],
        [X - 44, 146], [X - T + 8, 162], [X - T + 2, 206], [X - T - 14, 212], [X - T - 16, 156], [X - 52, 98],
      ], [7, 6, 4, -4, 5, 5, 5, 5, 5, 5, -4, 4, 6, 7], f,
        [[[X - 48, 112], [X - 70, 146], [X - 80, 182]], [[X + 48, 112], [X + 70, 146], [X + 80, 182]],
         [[X - 16, 104], [X - 30, 130], [X - 36, 152]], [[X + 20, 104], [X + 34, 130], [X + 40, 152]]]),
      front: null, shine: null,
    };
  },

  /** 短いパーマ（田中・小川） */
  perm: (g, f = "white", curl = 1) => {
    const X = g.cx, T = g.temple;
    const pts = [];
    const N = 9, R = T + 20;
    for (let i = 0; i <= N; i++) {
      const a = Math.PI + i / N * Math.PI;
      const rr = R + (i % 2 ? -8 : 8) * curl;
      pts.push([X + rr * Math.cos(a), 176 + (rr * 0.82) * Math.sin(a)]);
    }
    pts.push([X + T - 6, 206], [X + T - 14, 160], [X + 44, 140], [X, 134],
      [X - 44, 140], [X - T + 14, 160], [X - T + 6, 206]);
    const bg = pts.map((_, i) => i <= N ? (i % 2 ? -9 : 9) * curl : 4);
    // 白髪は輪郭だけだと薄くなりすぎる。巻いた筋を多めに入れて量を出す
    const strands = [];
    for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i + 0.5) / 7 * Math.PI, R = T + 6;
      const [sx, sy] = [X + R * Math.cos(a), 176 + R * 0.82 * Math.sin(a)];
      strands.push([[sx, sy], [sx * 0.5 + X * 0.5, sy + 26], [sx * 0.3 + X * 0.7, sy + 48]]);
    }
    return { back: mass(pts, bg, f, strands), front: null, shine: null };
  },

  /** 前髪が目にかかる（高梨） */
  fringe: (g, f = "solid") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 62], [X + 56, 78], [X + T + 10, 140], [X + T + 6, 214], [X + T - 8, 208],
        [X + T - 12, 150], [X + 54, 126], [X, 116],
        [X - 54, 126], [X - T + 12, 150], [X - T + 8, 208], [X - T - 6, 214], [X - T - 10, 140], [X - 56, 78],
      ], [10, 8, 4, -5, 4, 5, 5, 5, 5, 4, -5, 4, 8, 10], f, []),
      front: mass([
        [X, 70], [X + 60, 98], [X + 76, 190], [X + 56, 206], [X + 46, 158], [X + 14, 196],
        [X - 16, 152], [X - 46, 198], [X - 62, 160], [X - 76, 196], [X - 72, 110],
      ], [11, 6, -4, 4, -9, -9, -9, -9, -6, 4, 8], f, []),
      shine: null,
    };
  },

  /** 立てた短髪（森田） */
  spiky: (g, f = "solid") => {
    const X = g.cx;
    return {
      back: mass([
        [X - 40, 56], [X - 12, 74], [X + 14, 52], [X + 42, 74], [X + 70, 60], [X + 88, 116],
        [X + 80, 168], [X + 88, 210], [X + 68, 202], [X + 62, 156], [X + 50, 130], [X, 120],
        [X - 50, 130], [X - 62, 156], [X - 68, 202], [X - 88, 210], [X - 80, 168], [X - 88, 116],
        [X - 70, 60],
      ], [-8, -8, -8, -8, 5, -5, -4, 4, 4, 5, 5, 5, 5, -4, -5, 5, -8, -8, -8], f, []),
      front: mass([
        [X, 68], [X + 56, 96], [X + 70, 154], [X + 50, 142], [X + 26, 122], [X - 6, 132],
        [X - 38, 124], [X - 62, 144], [X - 72, 152], [X - 56, 96],
      ], [10, 4, -3, -5, -5, -5, -4, -3, 4, 10], f, []),
      shine: null,
    };
  },

  /** もじゃっとした量の多いくせ毛（志村） */
  fluffy: (g, f = "solid") => {
    const X = g.cx;
    return {
      back: mass([
        [X, 48], [X + 46, 60], [X + 86, 74], [X + 106, 124], [X + 96, 170], [X + 106, 216],
        [X + 80, 206], [X + 72, 162], [X + 62, 130], [X, 118],
        [X - 62, 130], [X - 72, 162], [X - 80, 206], [X - 106, 216], [X - 96, 170], [X - 106, 124],
        [X - 86, 74], [X - 46, 60],
      ], [16, 16, 14, -10, -8, 6, 6, 7, 7, 7, 7, 6, 6, -8, -10, 14, 16, 16], f, []),
      front: mass([
        [X, 62], [X + 64, 94], [X + 84, 172], [X + 64, 190], [X + 56, 148], [X + 26, 126],
        [X + 2, 158], [X - 26, 128], [X - 54, 150], [X - 64, 192], [X - 84, 170], [X - 64, 94],
      ], [14, 10, -5, 6, -8, -9, -9, -9, -8, 6, -5, 10], f, []),
      shine: null,
    };
  },

  /** 跳ねたくせ毛（桐山） */
  curly: (g, f = "solid") => {
    const X = g.cx;
    return {
      back: mass([
        [X - 30, 54], [X + 6, 66], [X + 34, 50], [X + 64, 70], [X + 90, 66], [X + 98, 120],
        [X + 88, 166], [X + 96, 212], [X + 74, 202], [X + 68, 158], [X + 58, 130], [X, 118],
        [X - 58, 130], [X - 68, 158], [X - 74, 202], [X - 96, 212], [X - 88, 166], [X - 98, 120],
        [X - 88, 62], [X - 60, 72],
      ], [-9, -9, -9, -9, 6, -6, -5, 5, 5, 6, 6, 5, 5, -5, -6, 6, -9, -9, -9, -9], f, []),
      front: mass([
        [X, 64], [X + 60, 94], [X + 78, 168], [X + 58, 186], [X + 48, 146], [X + 20, 124],
        [X - 4, 160], [X - 30, 126], [X - 56, 152], [X - 70, 188], [X - 82, 160], [X - 62, 94],
      ], [12, 8, -5, 5, -8, -9, -9, -9, -8, 5, -5, 8], f, []),
      shine: null,
    };
  },

  /** 肩で切り揃えた直毛。片耳を出す（野村） */
  shoulder: (g, f = "solid") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 58], [X + 60, 76], [X + T + 12, 140], [X + T + 10, 232], [X + T + 14, 300],
        [X + 74, 292], [X + 70, 218], [X + 62, 148], [X, 128],
        [X - 62, 148], [X - 66, 200], [X - T - 4, 236], [X - T - 12, 300],
        [X - T - 10, 216], [X - T - 14, 140], [X - 60, 76],
      ], [11, 9, 4, 3, -8, 6, 6, 9, 9, 5, 4, -8, 4, 4, 9, 11], f,
        [[[X + 62, 168], [X + 70, 226], [X + 68, 276]]]),
      front: mass([
        [X, 66], [X + 64, 100], [X + 78, 168], [X + 58, 150], [X + 30, 130], [X - 4, 136],
        [X - 38, 128], [X - 64, 146], [X - 78, 166], [X - 64, 100],
      ], [11, 5, -3, -5, -4, -4, -4, -3, 5, 11], f, []),
      shine: f === "solid" ? blob([[X - 44, 102], [X - 8, 92], [X - 14, 108], [X - 48, 120]], { bulge: 3 }) : null,
    };
  },

  /** 後ろで一つに束ねる。後れ毛（吉田） */
  tied: (g, f = "solid") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 60], [X + 60, 80], [X + T + 6, 146], [X + T + 2, 196], [X + T + 18, 226],
        [X + T + 10, 282], [X + T - 8, 274], [X + T + 2, 230], [X + T - 12, 200],
        [X + 60, 150], [X, 130], [X - 60, 150], [X - T + 12, 200], [X - T - 2, 196], [X - T - 6, 146], [X - 60, 80],
      ], [11, 8, 3, -6, -6, 6, 6, 6, 4, 6, 6, 4, -6, 3, 8, 11], f, []),
      front: mass([
        [X, 68], [X + 62, 98], [X + 76, 162], [X + 56, 148], [X + 28, 130], [X - 6, 138],
        [X - 40, 130], [X - 62, 148], [X - 76, 160], [X - 62, 98],
      ], [11, 5, -3, -5, -4, -4, -4, -3, 5, 11], f,
        [[[X - 68, 158], [X - 74, 186], [X - 70, 210]]]),
      shine: f === "solid" ? blob([[X - 42, 100], [X - 8, 90], [X - 14, 106], [X - 46, 118]], { bulge: 3 }) : null,
    };
  },

  /** ショートボブ（西村） */
  shortBob: (g, f = "solid") => {
    const X = g.cx, T = g.temple;
    return {
      back: mass([
        [X, 58], [X + 60, 76], [X + T + 12, 138], [X + T + 10, 216], [X + T - 2, 246],
        [X + 72, 238], [X + 70, 190], [X + 62, 144], [X, 126],
        [X - 62, 144], [X - 70, 190], [X - 72, 238], [X - T + 2, 246], [X - T - 10, 216], [X - T - 12, 138], [X - 60, 76],
      ], [11, 9, 5, -4, 6, 6, 8, 9, 9, 8, 6, 6, -4, 5, 9, 11], f, []),
      front: mass([
        [X, 66], [X + 64, 100], [X + 78, 172], [X + 58, 158], [X + 30, 130], [X - 4, 138],
        [X - 38, 130], [X - 64, 152], [X - 78, 170], [X - 64, 100],
      ], [11, 6, -4, -5, -5, -5, -4, -4, 6, 11], f, []),
      shine: f === "solid" ? blob([[X - 44, 102], [X - 10, 92], [X - 16, 108], [X - 48, 120]], { bulge: 3 }) : null,
    };
  },

  /** 短い白髪。顎髭とあわせて（会長） */
  shortWhite: (g, f = "white") => HAIR.crew(g, f),
};

/* ================= 襟 ================= */
const bodyOf = g => round([
  [g.cx, g.neckY - 6], [g.cx + 150, g.neckY + 26], [g.cx + 200, 512],
  [g.cx, 512], [g.cx - 200, 512], [g.cx - 150, g.neckY + 26],
], { tension: 0.4 });

const TONE = {
  light: [],
  mid: [{ angle: 46, gap: 14, w: 3.2 }],
  dark: [{ angle: 46, gap: 10, w: 3 }, { angle: -46, gap: 11, w: 2.6 }],
  darkest: [{ angle: 46, gap: 8, w: 3 }, { angle: -46, gap: 8, w: 2.8 }],
};

/** V に開いた襟＋前立て（カーディガン） */
export const COLLAR = {
  cardigan: (g, tone = "mid") => ({
    tone: TONE[tone],
    region: `${bodyOf(g)} ${round([[g.cx, g.neckY + 108], [g.cx + 74, g.neckY - 4], [g.cx + 92, 512], [g.cx - 92, 512], [g.cx - 74, g.neckY - 4]], { tension: 0.3 })}`,
    lines: `<path d="${ink([[g.cx - 76, g.neckY - 4], [g.cx - 34, g.neckY + 58], [g.cx - 8, g.neckY + 106]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 76, g.neckY - 4], [g.cx + 34, g.neckY + 58], [g.cx + 8, g.neckY + 106]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 8, g.neckY + 106], [g.cx - 8, 512]], { w: 6, profile: "head" })}"/>
      <path d="${ink([[g.cx + 8, g.neckY + 106], [g.cx + 8, 512]], { w: 6, profile: "head" })}"/>`,
  }),

  /** 丸首（パーカー・T シャツ） */
  crewNeck: (g, tone = "dark", hood = 1) => ({
    tone: TONE[tone],
    lines: (hood ? `<path d="${ink([[g.cx - 112, g.neckY + 18], [g.cx, g.neckY + 78], [g.cx + 112, g.neckY + 18]], { w: 10, profile: "mid" })}"/>` : "") +
      `<path d="${ink([[g.cx - 74, g.neckY - 6], [g.cx, g.neckY + 44], [g.cx + 74, g.neckY - 6]], { w: 8, profile: "mid" })}"/>` +
      (hood ? `<path d="${ink([[g.cx - 20, g.neckY + 80], [g.cx - 26, 512]], { w: 6, profile: "head" })}"/>
        <path d="${ink([[g.cx + 20, g.neckY + 80], [g.cx + 26, 512]], { w: 6, profile: "head" })}"/>` : ""),
  }),

  /** ベスト＋白シャツの V（橘・事務ベスト） */
  vest: (g, tone = "dark") => ({
    tone: TONE[tone],
    region: `${bodyOf(g)} ${round([[g.cx, g.neckY + 96], [g.cx + 64, g.neckY - 4], [g.cx + 92, 512], [g.cx - 92, 512], [g.cx - 64, g.neckY - 4]], { tension: 0.3 })}`,
    lines: `<path d="${ink([[g.cx - 64, g.neckY - 4], [g.cx - 30, g.neckY + 52], [g.cx, g.neckY + 30]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 64, g.neckY - 4], [g.cx + 30, g.neckY + 52], [g.cx, g.neckY + 30]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 30, g.neckY + 52], [g.cx, g.neckY + 98], [g.cx + 30, g.neckY + 52]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx, g.neckY + 30], [g.cx, g.neckY + 96]], { w: 5.5, profile: "mid" })}"/>`,
  }),

  /** 開襟のワイシャツ（三上） */
  open: (g, tone = "light") => ({
    tone: TONE[tone],
    lines: `<path d="${ink([[g.cx - 72, g.neckY - 6], [g.cx - 44, g.neckY + 40], [g.cx - 14, g.neckY + 78]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 72, g.neckY - 6], [g.cx + 44, g.neckY + 40], [g.cx + 14, g.neckY + 78]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 72, g.neckY - 6], [g.cx - 104, g.neckY + 30], [g.cx - 86, g.neckY + 62]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 72, g.neckY - 6], [g.cx + 104, g.neckY + 30], [g.cx + 86, g.neckY + 62]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx, g.neckY + 82], [g.cx, 512]], { w: 5, profile: "head" })}"/>`,
  }),

  /** 背広の下襟。tie があればネクタイを足す */
  lapel: (g, tone = "dark", tie = 1, tiePattern = 0) => ({
    tone: TONE[tone],
    region: `${bodyOf(g)} ${round([[g.cx, g.neckY + 96], [g.cx + 58, g.neckY - 6], [g.cx + 96, 512], [g.cx - 96, 512], [g.cx - 58, g.neckY - 6]], { tension: 0.28 })}`,
    lines: `<path d="${ink([[g.cx - 60, g.neckY - 6], [g.cx - 34, g.neckY + 46], [g.cx - 4, g.neckY + 96]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 60, g.neckY - 6], [g.cx + 34, g.neckY + 46], [g.cx + 4, g.neckY + 96]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 60, g.neckY - 6], [g.cx - 96, g.neckY + 34], [g.cx - 78, g.neckY + 74]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 60, g.neckY - 6], [g.cx + 96, g.neckY + 34], [g.cx + 78, g.neckY + 74]], { w: 8, profile: "mid" })}"/>
      ${tie ? `<path d="${blob([[g.cx, g.neckY + 12], [g.cx + 17, g.neckY + 30], [g.cx + 13, 512], [g.cx - 13, 512], [g.cx - 17, g.neckY + 30]], { bulge: 2 })}" fill="${INK}"/>
        ${tiePattern ? `<path d="${[[60, 92], [100, 132], [140, 172]].map(([a, b]) =>
          ink([[g.cx - 15, g.neckY + a], [g.cx + 15, g.neckY + b]], { w: 4, profile: "both" })).join(" ")}" fill="${PAPER}"/>` : ""}` : ""}`,
  }),

  /** 立ち襟の作業着 */
  stand: (g, tone = "dark") => ({
    tone: TONE[tone],
    region: `${bodyOf(g)} ${round([[g.cx, g.neckY + 58], [g.cx + 46, g.neckY - 8], [g.cx + 62, g.neckY + 20], [g.cx, g.neckY + 86], [g.cx - 62, g.neckY + 20], [g.cx - 46, g.neckY - 8]], { tension: 0.3 })}`,
    lines: `<path d="${ink([[g.cx - 78, g.neckY - 10], [g.cx - 46, g.neckY + 18], [g.cx - 22, g.neckY + 54]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 78, g.neckY - 10], [g.cx + 46, g.neckY + 18], [g.cx + 22, g.neckY + 54]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 22, g.neckY + 54], [g.cx, g.neckY + 74], [g.cx + 22, g.neckY + 54]], { w: 7, profile: "mid" })}"/>
      <path d="${ink([[g.cx, g.neckY + 76], [g.cx, 512]], { w: 5.5, profile: "head" })}"/>`,
  }),

  /** 襟の高いフリース */
  fleece: (g, tone = "mid") => ({
    tone: TONE[tone],
    lines: `<path d="${ink([[g.cx - 84, g.neckY - 14], [g.cx - 50, g.neckY + 24], [g.cx - 16, g.neckY + 52]], { w: 10, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 84, g.neckY - 14], [g.cx + 50, g.neckY + 24], [g.cx + 16, g.neckY + 52]], { w: 10, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 16, g.neckY + 52], [g.cx - 16, 512]], { w: 6, profile: "head" })}"/>
      <path d="${ink([[g.cx + 16, g.neckY + 52], [g.cx + 16, 512]], { w: 6, profile: "head" })}"/>
      <path d="${[[-60, 40], [-40, 76], [56, 44], [38, 80]].map(([a, b]) =>
        ink([[g.cx + a, g.neckY + b], [g.cx + a * 0.82, g.neckY + b + 26]], { w: 3.4, profile: "both" })).join(" ")}"/>`,
  }),
};

/* ================= 年齢の皺 ================= */
export function wrinkles(g, level = "none", o = {}) {
  if (level === "none") return "";
  const X = g.cx, out = [];
  const many = level === "heavy", some = level !== "light";
  // 額の横皺（前髪で隠れない人だけ）
  if (o.forehead) {
    const ys = many ? [g.browY - 34, g.browY - 22, g.browY - 12] : [g.browY - 28, g.browY - 17];
    for (const y of ys) out.push(ink([[X - 46, y + 3], [X, y], [X + 46, y + 3]], { w: 3.6, profile: "both" }));
  }
  // ほうれい線
  if (some) for (const s of [-1, 1])
    out.push(ink([[X + s * 22, g.noseY - 2], [X + s * 34, g.mouthY - 16], [X + s * 30, g.mouthY + 6]],
      { w: many ? 5 : 4, profile: "both" }));
  // 目尻
  for (const s of [-1, 1]) {
    out.push(ink([[X + s * (g.eyeX + 22), g.eyeY - 4], [X + s * (g.eyeX + 34), g.eyeY - 10]], { w: 3.4, profile: "tail" }));
    if (some) out.push(ink([[X + s * (g.eyeX + 22), g.eyeY + 4], [X + s * (g.eyeX + 34), g.eyeY + 6]], { w: 3, profile: "tail" }));
    if (many) out.push(ink([[X + s * (g.eyeX + 21), g.eyeY + 12], [X + s * (g.eyeX + 32), g.eyeY + 18]], { w: 2.8, profile: "tail" }));
  }
  // 目の下のたるみ
  if (many) for (const s of [-1, 1])
    out.push(ink([[X + s * (g.eyeX + 16), g.eyeY + 20], [X + s * g.eyeX, g.eyeY + 26], [X + s * (g.eyeX - 16), g.eyeY + 21]], { w: 3.2, profile: "both" }));
  return `<path d="${out.join(" ")}"/>`;
}

export { bodyOf, TONE };
