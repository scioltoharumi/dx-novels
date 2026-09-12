/**
 * 肖像を SVG のペン画として組み立てる（試作。まずは3人）。
 *
 *   npm run portrait   → site/img/characters/<id>.svg
 *
 * 線はすべて「塗りのリボン」で描く（scripts/penlib.mjs）。SVG の stroke は幅が一定で、
 * どう描いても図形記号に見えるため使わない。入りと抜きのある線にすることで、
 * Gペンで引いた漫画の線に近づける。
 *
 * 円形に切り抜かれる前提なので四隅には何も置かない。
 * 小さく表示したときは線より「髪の黒い塊」が効くので、髪はベタで、房の先を尖らせる。
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ink, blob, round } from "./penlib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "site", "img", "characters");

const W = 512;
const INK = "#141210";
const PAPER = "#f7f4ed";

/* ================= 共通の骨格 ================= */
const BASE = {
  cx: 256,
  crown: 94,      // 頭蓋の上端
  chin: 322,      // 顎先
  temple: 80,     // こめかみの張り出し
  cheek: 74,      // 頬骨の幅
  jaw: 48,        // 顎の幅
  eyeY: 206,
  eyeX: 42,
  eyeW: 38, eyeH: 23,   // 漫画の目。実物より大きめ
  irisR: 12,
  browY: 168, browW: 31,
  noseY: 248,
  mouthY: 282,
  neckY: 372,     // 肩のはじまり。低いと首が長く見える
};

/** 顔の輪郭。こめかみ→頬骨→顎。左右対称に作る */
function faceShape(g) {
  const { cx, crown, chin, temple, cheek, jaw } = g;
  return round([
    [cx, crown],
    [cx + temple, crown + 46],
    [cx + cheek, 232],
    [cx + jaw + 10, 292],
    [cx, chin],
    [cx - jaw - 10, 292],
    [cx - cheek, 232],
    [cx - temple, crown + 46],
  ], { tension: 0.55 });
}

/** 顎の輪郭線（右半分・左半分を別々に、抜きのある線で） */
function jawLines(g) {
  const { cx, crown, chin, temple, cheek, jaw } = g;
  const side = s => ink([
    [cx + s * temple, crown + 50],
    [cx + s * cheek, 232],
    [cx + s * (jaw + 8), 288],
    [cx + s * 10, chin - 3],
  ], { w: 11, profile: "belly", shift: 0.14 });
  return side(1) + " " + side(-1);
}

/* ================= 目 ================= */
/**
 * 漫画の目。上まぶたを太い抜きのある線で、瞳はベタ、ハイライトは紙の色で抜く。
 *   tilt  つり目（正）／たれ目（負）
 *   open  まぶたの開き（1 が標準）
 */
function eye(g, side, o = {}) {
  const { tilt = 0, open = 1, lash = 1, lidW = 13, irisScale = 1 } = o;
  const x = g.cx + side * g.eyeX, y = g.eyeY;
  const w = g.eyeW, h = g.eyeH * open;
  const out = [];

  // 上まぶた。目頭から目尻へ、途中がいちばん太い
  out.push(`<path d="${ink([
    [x - side * w * 0.52, y + 4 - tilt * 0.5],
    [x - side * w * 0.15, y - h * 0.52],
    [x + side * w * 0.24, y - h * 0.46 - tilt * 0.4],
    [x + side * w * 0.52, y - 2 - tilt],
  ], { w: lidW, profile: "belly", shift: -0.1 })}"/>`);

  // まつげ（目尻に短く跳ねる）
  if (lash) out.push(`<path d="${ink([
    [x + side * w * 0.4, y - h * 0.34 - tilt * 0.7],
    [x + side * w * 0.62, y - h * 0.52 - tilt * 1.1],
  ], { w: 7 * lash, profile: "tail" })}"/>`);

  // 瞳。上まぶたに少しかぶる
  const ir = g.irisR * irisScale;
  out.push(`<ellipse cx="${x}" cy="${y + 2}" rx="${ir}" ry="${ir * 1.18}" fill="${INK}"/>`);
  out.push(`<circle cx="${x - side * ir * 0.34}" cy="${y - ir * 0.42}" r="${ir * 0.36}" fill="${PAPER}"/>`);

  // 下まぶた。細く短く
  out.push(`<path d="${ink([
    [x - side * w * 0.36, y + h * 0.5],
    [x + side * w * 0.1, y + h * 0.62],
    [x + side * w * 0.42, y + h * 0.42],
  ], { w: 4.6, profile: "both" })}"/>`);
  return out.join("");
}

function brow(g, side, o = {}) {
  const { tilt = 0, w = 13, arch = 10 } = o;
  const x = g.cx + side * g.eyeX;
  return `<path d="${ink([
    [x - side * g.browW * 0.92, g.browY + tilt + 4],
    [x - side * g.browW * 0.2, g.browY - arch * 0.5 + tilt * 0.4],
    [x + side * g.browW * 0.5, g.browY - arch],
    [x + side * g.browW, g.browY - arch * 0.3],
  ], { w, profile: "tail", shift: -0.14 })}"/>`;
}

const nose = (g, o = {}) => `<path d="${ink([
  [g.cx - 6, g.noseY - 26],
  [g.cx - 13, g.noseY - 4],
  [g.cx - 2, g.noseY + 3],
], { w: o.w ?? 6.5, profile: "head" })}"/>`;

/** 口。curve 正で笑う、負で不機嫌。open で開く */
function mouth(g, o = {}) {
  const { curve = 0, w = 7, len = 22, open = 0 } = o;
  const y = g.mouthY;
  const line = `<path d="${ink([
    [g.cx - len, y - curve * 0.3],
    [g.cx, y + curve],
    [g.cx + len, y - curve * 0.3],
  ], { w, profile: "both" })}"/>`;
  if (!open) return line;
  return line + `<path d="${round([[g.cx - len * 0.8, y + 2], [g.cx, y + open], [g.cx + len * 0.8, y + 2]])}" fill="${INK}"/>`;
}

/* ================= ハッチング ================= */
let hid = 0;
function hatch(region, { angle = 44, gap = 11, w = 3.4, profile = "both" } = {}) {
  const id = `h${++hid}`;
  const rad = angle * Math.PI / 180, dx = Math.cos(rad), dy = Math.sin(rad), L = 620;
  const paths = [];
  for (let i = -46; i < 46; i++) {
    const px = -dy * i * gap + 256, py = dx * i * gap + 256;
    paths.push(ink([[px - dx * L, py - dy * L], [px, py], [px + dx * L, py + dy * L]], { w, profile, per: 4 }));
  }
  return { def: `<clipPath id="${id}"><path d="${region}"/></clipPath>`,
    use: `<g clip-path="url(#${id})"><path d="${paths.join(" ")}"/></g>` };
}

/* ================= 体 ================= */
const bodyShape = g => round([
  [g.cx, g.neckY - 6], [g.cx + 150, g.neckY + 26], [g.cx + 200, 512],
  [g.cx, 512], [g.cx - 200, 512], [g.cx - 150, g.neckY + 26],
], { tension: 0.4 });

const neckLines = g => {
  const s = side => ink([
    [g.cx + side * 42, g.chin - 22],
    [g.cx + side * 45, g.chin + 20],
    [g.cx + side * 56, g.neckY - 2],
  ], { w: 7, profile: "mid" });
  return `<path d="${s(1)}"/><path d="${s(-1)}"/>`;
};

/** 顎の下の影。漫画で顔を立体に見せる要 */
const jawShadow = g => `<path d="${round([
  [g.cx - 46, g.chin - 20], [g.cx, g.chin + 4], [g.cx + 46, g.chin - 20],
  [g.cx + 40, g.chin + 12], [g.cx, g.chin + 26], [g.cx - 40, g.chin + 12],
], { tension: 0.4 })}" fill="${INK}" opacity="0.14"/>`;

/* ================= 組み立て ================= */
function build(c) {
  hid = 0;
  const g = { ...BASE, ...(c.geom || {}) };
  const defs = [], L = [];
  const add = h => { defs.push(h.def); return h.use; };
  const cl = c.cloth(g);

  L.push(`<path d="${bodyShape(g)}" fill="${PAPER}"/>`);
  for (const o of cl.tone || []) L.push(add(hatch(cl.region ?? bodyShape(g), o)));
  L.push(`<g fill="${INK}">${cl.lines}</g>`);
  L.push(`<g fill="${INK}">${neckLines(g)}</g>`);

  if (c.hairBack) L.push(`<path d="${c.hairBack(g)}" fill="${INK}"/>`);
  L.push(`<path d="${faceShape(g)}" fill="${PAPER}"/>`);
  if (c.ears) {
    const e = side => ink([
      [g.cx + side * (g.temple - 2), 214],
      [g.cx + side * (g.temple + 15), 226],
      [g.cx + side * (g.temple - 4), 254],
    ], { w: 6, profile: "both" });
    L.push(`<g fill="${INK}"><path d="${e(1)}"/><path d="${e(-1)}"/></g>`);
  }
  L.push(`<g fill="${INK}">${jawLines(g)}</g>`);
  L.push(jawShadow(g));
  if (c.hairFront) L.push(`<path d="${c.hairFront(g)}" fill="${INK}"/>`);
  if (c.hairShine) L.push(`<path d="${c.hairShine(g)}" fill="${PAPER}"/>`);

  L.push(`<g fill="${INK}">`,
    eye(g, -1, c.eye), eye(g, 1, c.eye),
    brow(g, -1, c.brow), brow(g, 1, c.brow),
    nose(g, c.nose), mouth(g, c.mouth), `</g>`);

  if (c.hatches) for (const h of c.hatches(g)) L.push(add(hatch(h.region, h.opts)));
  if (c.extra) L.push(`<g fill="${INK}">${c.extra(g)}</g>`);
  if (c.glasses) L.push(c.glasses(g));
  if (c.props) L.push(`<g fill="${INK}">${c.props(g)}</g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${c.name}">
<title>${c.name}</title><defs>${defs.join("")}</defs>
<rect width="${W}" height="${W}" fill="${PAPER}"/>
<g fill="${INK}" stroke="none" fill-rule="nonzero">
${L.join("\n")}
</g></svg>`;
}

/* ================= 襟 ================= */
const cloth = {
  cardigan: g => ({
    tone: [{ angle: 46, gap: 14, w: 3.2 }],
    region: `${bodyShape(g)} ${round([[g.cx, g.neckY + 108], [g.cx + 74, g.neckY - 4], [g.cx + 92, 512], [g.cx - 92, 512], [g.cx - 74, g.neckY - 4]], { tension: 0.3 })}`,
    lines: `<path d="${ink([[g.cx - 76, g.neckY - 4], [g.cx - 34, g.neckY + 58], [g.cx - 8, g.neckY + 106]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 76, g.neckY - 4], [g.cx + 34, g.neckY + 58], [g.cx + 8, g.neckY + 106]], { w: 9, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 8, g.neckY + 106], [g.cx - 8, 512]], { w: 6, profile: "head" })}"/>
      <path d="${ink([[g.cx + 8, g.neckY + 106], [g.cx + 8, 512]], { w: 6, profile: "head" })}"/>`,
  }),
  hoodie: g => ({
    tone: [{ angle: 46, gap: 9, w: 3 }, { angle: -46, gap: 10, w: 2.6 }],
    lines: `<path d="${ink([[g.cx - 112, g.neckY + 18], [g.cx, g.neckY + 78], [g.cx + 112, g.neckY + 18]], { w: 10, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 74, g.neckY - 6], [g.cx, g.neckY + 44], [g.cx + 74, g.neckY - 6]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 20, g.neckY + 80], [g.cx - 26, 512]], { w: 6, profile: "head" })}"/>
      <path d="${ink([[g.cx + 20, g.neckY + 80], [g.cx + 26, 512]], { w: 6, profile: "head" })}"/>`,
  }),
  vest: g => ({
    tone: [{ angle: 46, gap: 10, w: 3 }, { angle: -46, gap: 11, w: 2.6 }],
    region: `${bodyShape(g)} ${round([[g.cx, g.neckY + 96], [g.cx + 64, g.neckY - 4], [g.cx + 92, 512], [g.cx - 92, 512], [g.cx - 64, g.neckY - 4]], { tension: 0.3 })}`,
    lines: `<path d="${ink([[g.cx - 64, g.neckY - 4], [g.cx - 30, g.neckY + 52], [g.cx, g.neckY + 30]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 64, g.neckY - 4], [g.cx + 30, g.neckY + 52], [g.cx, g.neckY + 30]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx - 30, g.neckY + 52], [g.cx, g.neckY + 98], [g.cx + 30, g.neckY + 52]], { w: 8, profile: "mid" })}"/>
      <path d="${ink([[g.cx, g.neckY + 30], [g.cx, g.neckY + 96]], { w: 5.5, profile: "mid" })}"/>`,
  }),
};

/* ================= 人物 ================= */
const CHARS = [
  {
    id: "rino", name: "佐伯 梨乃", ears: false,
    geom: { temple: 78, cheek: 72, jaw: 45, chin: 318, eyeW: 39, eyeH: 25, irisR: 12.5, browY: 166 },
    // 外ハネのボブ。顔の輪郭から出すぎないよう、左右は 100px 以内に収める
    hairBack: g => blob([
      [256, 54], [318, 70], [350, 132], [348, 210], [356, 292], [330, 282],
      [324, 212], [318, 152], [256, 132], [194, 152], [188, 212], [182, 282],
      [156, 292], [164, 210], [162, 132], [194, 70],
    ], { bulge: [12, 12, 8, 5, -9, 7, 7, 10, 10, 7, 7, -9, 5, 8, 12, 12] }),
    // 前髪。中央で軽く分かれ、目の少し上まで下りる
    hairFront: g => blob([
      [256, 66], [324, 104], [338, 182], [318, 202], [312, 152], [284, 132],
      [254, 162], [224, 134], [198, 154], [194, 200], [174, 180], [188, 104],
    ], { bulge: [13, 8, -4, 5, -6, -7, -7, -7, -6, 5, -4, 8] }),
    hairShine: g => blob([[212, 106], [242, 96], [236, 118], [206, 130]], { bulge: 4 }),
    eye: { tilt: 2, lidW: 13, lash: 1.1 },
    brow: { tilt: 3, w: 8, arch: 8 },
    mouth: { curve: 6, w: 6, len: 18 },
    cloth: cloth.cardigan,
    props: g => `<path d="${ink([[g.cx - 50, g.neckY + 4], [g.cx - 30, g.neckY + 70], [g.cx - 14, g.neckY + 116]], { w: 6, profile: "mid" })}"/>
      <path d="${ink([[g.cx + 50, g.neckY + 4], [g.cx + 30, g.neckY + 70], [g.cx + 14, g.neckY + 116]], { w: 6, profile: "mid" })}"/>
      <g transform="rotate(-10 372 456)">
        <path d="${round([[338, 412], [406, 412], [406, 504], [338, 504]], { tension: 0.05 })}" fill="${PAPER}"/>
        <path d="${ink([[338, 412], [406, 412], [406, 504], [338, 504], [338, 412]], { w: 6, profile: "flat", tension: 0.05 })}"/>
        <path d="${ink([[350, 436], [394, 436]], { w: 4, profile: "both" })}"/>
        <path d="${ink([[350, 458], [394, 458]], { w: 4, profile: "both" })}"/>
        <path d="${ink([[350, 480], [382, 480]], { w: 4, profile: "both" })}"/>
      </g>`,
  },
  {
    id: "akaumi", name: "赤海 慧", ears: false,
    geom: { temple: 84, cheek: 78, jaw: 58, chin: 330, crown: 96, eyeW: 36, eyeH: 17, irisR: 10,
      browY: 174, browW: 33, noseY: 252, mouthY: 290 },
    // 伸びて散らかった短髪。房を尖らせるが、顔から出すぎないように
    hairBack: g => blob([
      [232, 50], [268, 60], [296, 46], [322, 64], [348, 58], [358, 112],
      [348, 160], [356, 218], [334, 206], [328, 160], [320, 132], [256, 120],
      [192, 132], [184, 160], [178, 206], [156, 218], [164, 160], [154, 112],
      [166, 56], [196, 68],
    ], { bulge: [-8, -8, -8, -8, 6, -6, -5, 5, 5, 7, 7, 5, 5, -5, -6, 6, -8, -8, -8, -8] }),
    hairFront: g => blob([
      [256, 66], [318, 98], [340, 176], [326, 208], [314, 164], [290, 140],
      [268, 178], [242, 142], [216, 176], [196, 148], [180, 202], [170, 168],
      [194, 98],
    ], { bulge: [11, 7, -5, 4, -8, -10, -10, -10, -8, -8, 4, -5, 7] }),
    eye: { tilt: 5, open: 0.9, lidW: 12, lash: 0, irisScale: 0.95 },
    brow: { tilt: -5, w: 12, arch: 4 },
    nose: { w: 7 },
    mouth: { curve: -2, w: 6.5, len: 23 },
    // 無精髭。顎の輪郭に沿った細い帯と、鼻の下の小さな帯
    hatches: g => [
      { region: round([
          [g.cx - 72, g.mouthY - 4], [g.cx - 48, g.chin - 12], [g.cx, g.chin - 2], [g.cx + 48, g.chin - 12],
          [g.cx + 72, g.mouthY - 4], [g.cx + 52, g.mouthY + 10], [g.cx, g.chin - 26], [g.cx - 52, g.mouthY + 10],
        ], { tension: 0.32 }), opts: { angle: 80, gap: 6, w: 2.2, profile: "both" } },
      { region: round([[g.cx - 24, g.mouthY - 20], [g.cx, g.mouthY - 26], [g.cx + 24, g.mouthY - 20],
          [g.cx + 18, g.mouthY - 8], [g.cx, g.mouthY - 13], [g.cx - 18, g.mouthY - 8]], { tension: 0.3 }),
        opts: { angle: 80, gap: 5.5, w: 2, profile: "both" } },
    ],
    extra: g => {
      const bag = side => ink([
        [g.cx + side * 64, g.eyeY + 22], [g.cx + side * 40, g.eyeY + 30], [g.cx + side * 22, g.eyeY + 26],
      ], { w: 5, profile: "both" }) + " " + ink([
        [g.cx + side * 58, g.eyeY + 36], [g.cx + side * 34, g.eyeY + 41],
      ], { w: 3.6, profile: "both" });
      const cheekLine = side => ink([
        [g.cx + side * 70, 250], [g.cx + side * 62, 286], [g.cx + side * 56, 306],
      ], { w: 4.4, profile: "both" });
      return `<path d="${bag(1)}"/><path d="${bag(-1)}"/><path d="${cheekLine(1)}"/><path d="${cheekLine(-1)}"/>`;
    },
    cloth: cloth.hoodie,
    props: g => `<g transform="rotate(7 410 254)">
        <path d="${ink([[410, 352], [410, 300], [410, 186]], { w: 7, profile: "mid" })}"/>
        <path d="${round([[410, 150], [434, 176], [410, 202], [386, 176]], { tension: 0.6 })}" fill="${PAPER}"/>
        <path d="${ink([[410, 150], [434, 176], [410, 202], [386, 176], [410, 150]], { w: 6, profile: "flat", tension: 0.6 })}"/>
        <path d="${round([[410, 208], [434, 234], [410, 260], [386, 234]], { tension: 0.6 })}" fill="${PAPER}"/>
        <path d="${ink([[410, 208], [434, 234], [410, 260], [386, 234], [410, 208]], { w: 6, profile: "flat", tension: 0.6 })}"/>
        <path d="${round([[410, 266], [434, 292], [410, 318], [386, 292]], { tension: 0.6 })}" fill="${PAPER}"/>
        <path d="${ink([[410, 266], [434, 292], [410, 318], [386, 292], [410, 266]], { w: 6, profile: "flat", tension: 0.6 })}"/>
      </g>`,
  },
  {
    id: "tachibana", name: "橘", ears: true,
    geom: { temple: 76, cheek: 70, jaw: 43, chin: 316, eyeW: 36, eyeH: 19, irisR: 10.5, browY: 164, browW: 30 },
    // 後ろでまとめた髪。頭に沿わせ、束は首の右横へ短く垂らす
    hairBack: g => blob([
      [256, 62], [318, 84], [334, 150], [336, 186], [352, 212], [356, 262],
      [340, 284], [326, 268], [334, 226], [320, 198], [318, 152], [256, 132],
      [194, 152], [192, 198], [178, 186], [178, 150], [194, 84],
    ], { bulge: [11, 8, 3, -5, -7, -6, 5, 6, 5, 3, 6, 6, 3, -5, 3, 8] }),
    // まとめ髪なので前髪はなく、生え際だけ。中央をわずかに下げて富士額にする
    hairFront: g => blob([
      [256, 72], [318, 100], [330, 158], [312, 146], [286, 132], [256, 140],
      [226, 132], [200, 146], [182, 158], [194, 100],
    ], { bulge: [11, 4, -3, -5, -3, -3, -5, -3, 4, 11] }),
    hairShine: g => blob([[216, 98], [252, 88], [246, 104], [212, 116]], { bulge: 3 }),
    eye: { tilt: 6, open: 0.86, lidW: 11, lash: 0.8, irisScale: 0.95 },
    brow: { tilt: -3, w: 7, arch: 6 },
    mouth: { curve: -1, w: 5.5, len: 17 },
    glasses: g => {
      const y = g.eyeY - 1, x = g.eyeX + 3;
      const lens = cx => round([[cx, y - 23], [cx + 37, y], [cx, y + 23], [cx - 37, y]], { tension: 0.62 });
      const rim = cx => ink([[cx, y - 23], [cx + 37, y], [cx, y + 23], [cx - 37, y], [cx, y - 23]], { w: 5, profile: "flat", tension: 0.62 });
      return `<g fill="${INK}">
        <path d="${rim(g.cx - x)}"/><path d="${rim(g.cx + x)}"/>
        <path d="${ink([[g.cx - x + 37, y - 4], [g.cx, y - 9], [g.cx + x - 37, y - 4]], { w: 5, profile: "mid" })}"/>
        <path d="${ink([[g.cx - x - 37, y - 5], [g.cx - g.temple - 2, y - 14]], { w: 5, profile: "tail" })}"/>
        <path d="${ink([[g.cx + x + 37, y - 5], [g.cx + g.temple + 2, y - 14]], { w: 5, profile: "tail" })}"/>
        <path d="${blob([[g.cx - x - 24, y - 14], [g.cx - x - 4, y - 19], [g.cx - x - 10, y - 6], [g.cx - x - 28, y - 2]], { bulge: 2 })}" fill="${PAPER}" opacity=".9"/>
        <path d="${blob([[g.cx + x - 28, y - 14], [g.cx + x - 8, y - 19], [g.cx + x - 14, y - 6], [g.cx + x - 32, y - 2]], { bulge: 2 })}" fill="${PAPER}" opacity=".9"/>
      </g>`;
    },
    cloth: cloth.vest,
  },
];

export async function generate() {
  await mkdir(OUT, { recursive: true });
  for (const c of CHARS) {
    const svg = build(c);
    await writeFile(path.join(OUT, `${c.id}.svg`), svg, "utf8");
    console.log(`  ${c.id.padEnd(11)} ${c.name.padEnd(8)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
  }
  console.log(`${CHARS.length} 枚を ${path.relative(ROOT, OUT)} に書き出しました`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await generate();
