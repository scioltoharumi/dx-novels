/**
 * 肖像を SVG のペン画として組み立てる（全25人）。
 *
 *   npm run portrait   → site/img/characters/<id>.svg
 *
 * 線はすべて「塗りのリボン」で描く（scripts/penlib.mjs）。SVG の stroke は幅が一定で、
 * どう描いても図形記号に見えるため使わない。入りと抜きのある線にすることで、
 * ペンで引いた漫画の線に近づける。
 *
 * 髪型・襟・皺は scripts/portrait-parts.mjs の型から選ぶ。25人を個別に描くと必ず
 * ばらけるので、骨格と部品の組み合わせだけを人物ごとに決める。
 * 誰がどう見分けられるかは meta/art.json の tell と対応させている。
 *
 * 円形に切り抜かれる前提なので四隅には何も置かない。
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ink, blob, round } from "./penlib.mjs";
import { INK, PAPER, HAIR, COLLAR, wrinkles } from "./portrait-parts.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "site", "img", "characters");
const W = 512;

/* ================= 骨格 ================= */
const BASE = {
  cx: 256, crown: 94, chin: 322,
  temple: 80, cheek: 74, jaw: 48,
  eyeY: 206, eyeX: 42, eyeW: 38, eyeH: 23, irisR: 12,
  browY: 168, browW: 31,
  noseY: 248, mouthY: 282, neckY: 372,
};

const faceShape = g => round([
  [g.cx, g.crown],
  [g.cx + g.temple, g.crown + 46], [g.cx + g.cheek, 232], [g.cx + g.jaw + 10, 292], [g.cx, g.chin],
  [g.cx - g.jaw - 10, 292], [g.cx - g.cheek, 232], [g.cx - g.temple, g.crown + 46],
], { tension: 0.55 });

const jawLines = g => {
  const side = s => ink([
    [g.cx + s * g.temple, g.crown + 50], [g.cx + s * g.cheek, 232],
    [g.cx + s * (g.jaw + 8), 288], [g.cx + s * 10, g.chin - 3],
  ], { w: 11, profile: "belly", shift: 0.14 });
  return side(1) + " " + side(-1);
};

const bodyShape = g => round([
  [g.cx, g.neckY - 6], [g.cx + 150, g.neckY + 26], [g.cx + 200, 512],
  [g.cx, 512], [g.cx - 200, 512], [g.cx - 150, g.neckY + 26],
], { tension: 0.4 });

const neckLines = g => {
  const s = side => ink([
    [g.cx + side * 42, g.chin - 22], [g.cx + side * 45, g.chin + 20], [g.cx + side * 56, g.neckY - 2],
  ], { w: 7, profile: "mid" });
  return `<path d="${s(1)}"/><path d="${s(-1)}"/>`;
};

const jawShadow = g => `<path d="${round([
  [g.cx - 46, g.chin - 20], [g.cx, g.chin + 4], [g.cx + 46, g.chin - 20],
  [g.cx + 40, g.chin + 12], [g.cx, g.chin + 26], [g.cx - 40, g.chin + 12],
], { tension: 0.4 })}" fill="${INK}" opacity="0.14"/>`;

/* ================= 顔の部品 ================= */
function eye(g, side, o = {}) {
  const { tilt = 0, open = 1, lash = 1, lidW = 13, irisScale = 1 } = o;
  const x = g.cx + side * g.eyeX, y = g.eyeY, w = g.eyeW, h = g.eyeH * open;
  const out = [`<path d="${ink([
    [x - side * w * 0.52, y + 4 - tilt * 0.5], [x - side * w * 0.15, y - h * 0.52],
    [x + side * w * 0.24, y - h * 0.46 - tilt * 0.4], [x + side * w * 0.52, y - 2 - tilt],
  ], { w: lidW, profile: "belly", shift: -0.1 })}"/>`];
  if (lash) out.push(`<path d="${ink([
    [x + side * w * 0.4, y - h * 0.34 - tilt * 0.7], [x + side * w * 0.62, y - h * 0.52 - tilt * 1.1],
  ], { w: 7 * lash, profile: "tail" })}"/>`);
  const ir = g.irisR * irisScale;
  out.push(`<ellipse cx="${x}" cy="${y + 2}" rx="${ir}" ry="${ir * 1.18}" fill="${INK}"/>`);
  out.push(`<circle cx="${x - side * ir * 0.34}" cy="${y - ir * 0.42}" r="${ir * 0.36}" fill="${PAPER}"/>`);
  out.push(`<path d="${ink([
    [x - side * w * 0.36, y + h * 0.5], [x + side * w * 0.1, y + h * 0.62], [x + side * w * 0.42, y + h * 0.42],
  ], { w: 4.6, profile: "both" })}"/>`);
  return out.join("");
}

const brow = (g, side, o = {}) => {
  const { tilt = 0, w = 11, arch = 8 } = o, x = g.cx + side * g.eyeX;
  return `<path d="${ink([
    [x - side * g.browW * 0.92, g.browY + tilt + 4], [x - side * g.browW * 0.2, g.browY - arch * 0.5 + tilt * 0.4],
    [x + side * g.browW * 0.5, g.browY - arch], [x + side * g.browW, g.browY - arch * 0.3],
  ], { w, profile: "tail", shift: -0.14 })}"/>`;
};

const nose = (g, o = {}) => `<path d="${ink([
  [g.cx - 6, g.noseY - 26], [g.cx - 13, g.noseY - 4], [g.cx - 2, g.noseY + 3],
], { w: o.w ?? 6.5, profile: "head" })}"/>`;

function mouth(g, o = {}) {
  const { curve = 0, w = 6.5, len = 20, open = 0 } = o, y = g.mouthY;
  const line = `<path d="${ink([[g.cx - len, y - curve * 0.3], [g.cx, y + curve], [g.cx + len, y - curve * 0.3]],
    { w, profile: "both" })}"/>`;
  if (!open) return line;
  return `<path d="${round([[g.cx - len * 0.78, y - 1], [g.cx, y + open], [g.cx + len * 0.78, y - 1]], { tension: 0.4 })}" fill="${INK}"/>` + line;
}

/* ================= ハッチング ================= */
let hid = 0;
function hatch(region, { angle = 44, gap = 11, w = 3.4, profile = "both" } = {}) {
  const id = `h${++hid}`;
  const rad = angle * Math.PI / 180, dx = Math.cos(rad), dy = Math.sin(rad), L = 600;
  const paths = [];
  for (let i = -42; i < 42; i++) {
    const px = -dy * i * gap + 256, py = dx * i * gap + 256;
    paths.push(ink([[px - dx * L, py - dy * L], [px, py], [px + dx * L, py + dy * L]],
      { w, profile, per: 2, prec: 0 }));
  }
  return { def: `<clipPath id="${id}"><path d="${region}"/></clipPath>`,
    use: `<g clip-path="url(#${id})"><path d="${paths.join(" ")}"/></g>` };
}

/* ================= 眼鏡・髭・ヘッドセット ================= */
function glasses(g, shape = "oval", weight = "thin", drop = 0) {
  const wt = weight === "thick" ? 7 : 4.6;
  const y = g.eyeY - 1 + drop, x = g.eyeX + 3;
  const pts = cx => shape === "square"
    ? [[cx - 36, y - 21], [cx + 36, y - 21], [cx + 36, y + 21], [cx - 36, y + 21]]
    : shape === "round"
      ? [[cx, y - 31], [cx + 31, y], [cx, y + 31], [cx - 31, y]]
      : [[cx, y - 22], [cx + 36, y], [cx, y + 22], [cx - 36, y]];
  const t = shape === "square" ? 0.06 : 0.62;
  const rim = cx => ink([...pts(cx), pts(cx)[0]], { w: wt, profile: "flat", tension: t });
  const glass = cx => round(pts(cx), { tension: t });
  const half = shape === "round" ? 31 : 36;
  return `<g fill="${INK}">
    <path d="${glass(g.cx - x)}" fill="${PAPER}" opacity=".55"/><path d="${glass(g.cx + x)}" fill="${PAPER}" opacity=".55"/>
    <path d="${rim(g.cx - x)}"/><path d="${rim(g.cx + x)}"/>
    <path d="${ink([[g.cx - x + half, y - 4], [g.cx, y - 9], [g.cx + x - half, y - 4]], { w: wt * 0.9, profile: "mid" })}"/>
    <path d="${ink([[g.cx - x - half, y - 5], [g.cx - g.temple - 2, y - 14]], { w: wt * 0.9, profile: "tail" })}"/>
    <path d="${ink([[g.cx + x + half, y - 5], [g.cx + g.temple + 2, y - 14]], { w: wt * 0.9, profile: "tail" })}"/>
  </g>`;
}

/** 顎髭（白）。会長だけ */
const chinBeard = g => {
  const pts = [[g.cx - 52, g.mouthY - 6], [g.cx - 40, g.chin + 6], [g.cx, g.chin + 26], [g.cx + 40, g.chin + 6],
    [g.cx + 52, g.mouthY - 6], [g.cx + 26, g.mouthY + 4], [g.cx, g.mouthY + 12], [g.cx - 26, g.mouthY + 4]];
  return `<path d="${blob(pts, { bulge: 6 })}" fill="${PAPER}"/>
    <path d="${ink([...pts, pts[0]], { w: 5.5, profile: "flat", tension: 0.4 })}" fill="${INK}"/>
    <path d="${[[-30, 0], [-10, 8], [12, 8], [32, 0]].map(([a, b]) =>
      ink([[g.cx + a, g.mouthY + 6 + b], [g.cx + a * 0.85, g.chin + 8]], { w: 3.4, profile: "tail" })).join(" ")}" fill="${INK}"/>`;
};

const headset = g => `<g fill="${INK}">
  <path d="${ink([[g.cx - g.temple - 8, g.eyeY - 18], [g.cx, g.crown - 14], [g.cx + g.temple + 8, g.eyeY - 18]], { w: 8, profile: "mid" })}"/>
  <path d="${blob([[g.cx + g.temple + 2, g.eyeY - 2], [g.cx + g.temple + 20, g.eyeY + 6],
    [g.cx + g.temple + 14, g.eyeY + 30], [g.cx + g.temple - 4, g.eyeY + 22]], { bulge: 3 })}"/>
  <path d="${ink([[g.cx + g.temple + 8, g.eyeY + 28], [g.cx + g.cheek - 4, g.mouthY - 10], [g.cx + 30, g.mouthY + 2]], { w: 5, profile: "mid" })}"/>
  <ellipse cx="${g.cx + 26}" cy="${g.mouthY + 4}" rx="9" ry="6"/>
</g>`;

/* ================= 小物 ================= */
const P = {
  /** 胸の高さの長方形（メモ帳・ノート・紙束・名刺） */
  card: (x, y, w, h, rot, lines = 3) => `<g transform="rotate(${rot} ${x} ${y})">
    <path d="${round([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], { tension: 0.05 })}" fill="${PAPER}"/>
    <path d="${ink([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2], [x - w / 2, y - h / 2]], { w: 6, profile: "flat", tension: 0.05 })}"/>
    ${Array.from({ length: lines }, (_, i) => `<path d="${ink([
      [x - w / 2 + 12, y - h / 2 + 20 + i * 20], [x + w / 2 - (i === lines - 1 ? 26 : 12), y - h / 2 + 20 + i * 20],
    ], { w: 4, profile: "both" })}"/>`).join("")}
  </g>`,
  lanyard: g => `<path d="${ink([[g.cx - 50, g.neckY + 4], [g.cx - 30, g.neckY + 70], [g.cx - 14, g.neckY + 116]], { w: 6, profile: "mid" })}"/>
    <path d="${ink([[g.cx + 50, g.neckY + 4], [g.cx + 30, g.neckY + 70], [g.cx + 14, g.neckY + 116]], { w: 6, profile: "mid" })}"/>`,
  /** 顔の横の串。赤海 */
  skewer: () => `<g transform="rotate(7 410 254)">
    <path d="${ink([[410, 352], [410, 300], [410, 186]], { w: 7, profile: "mid" })}"/>
    ${[150, 208, 266].map(y => `<path d="${round([[410, y], [434, y + 26], [410, y + 52], [386, y + 26]], { tension: 0.6 })}" fill="${PAPER}"/>
      <path d="${ink([[410, y], [434, y + 26], [410, y + 52], [386, y + 26], [410, y]], { w: 6, profile: "flat", tension: 0.6 })}"/>`).join("")}
  </g>`,
  /** こめかみを叩く指。三上。握った手から人差し指だけを伸ばす */
  temple: g => {
    const x = g.cx + g.temple + 2, y = g.eyeY - 10;
    const finger = [[x - 4, y], [x + 26, y + 10], [x + 30, y + 26], [x + 4, y + 20]];
    const fist = [[x + 22, y + 14], [x + 62, y + 22], [x + 70, y + 76], [x + 26, y + 70]];
    return `<path d="${blob(fist, { bulge: 8 })}" fill="${PAPER}"/>
      <path d="${ink([...fist, fist[0]], { w: 6.5, profile: "flat", tension: 0.45 })}"/>
      <path d="${blob(finger, { bulge: 4 })}" fill="${PAPER}"/>
      <path d="${ink([...finger, finger[0]], { w: 6.5, profile: "flat", tension: 0.35 })}"/>
      <path d="${ink([[x + 34, y + 40], [x + 62, y + 44]], { w: 4, profile: "both" })}"/>
      <path d="${ink([[x + 33, y + 56], [x + 62, y + 60]], { w: 4, profile: "both" })}"/>`;
  },
  /** 肩の高さのコーヒーカップ。大河内 */
  cup: g => {
    const x = g.cx + 128, y = g.neckY + 52;
    return `<path d="${round([[x - 30, y - 26], [x + 30, y - 26], [x + 24, y + 30], [x - 24, y + 30]], { tension: 0.12 })}" fill="${PAPER}"/>
      <path d="${ink([[x - 30, y - 26], [x + 30, y - 26], [x + 24, y + 30], [x - 24, y + 30], [x - 30, y - 26]], { w: 6.5, profile: "flat", tension: 0.12 })}"/>
      <path d="${ink([[x + 28, y - 14], [x + 50, y - 4], [x + 30, y + 12]], { w: 6, profile: "mid" })}"/>
      <path d="${ink([[x - 24, y - 14], [x, y - 10], [x + 24, y - 14]], { w: 4, profile: "both" })}"/>`;
  },
  /** 胸ポケットのボールペン3本。岡崎 */
  pens: g => {
    const x = g.cx + 74, y = g.neckY + 74;
    return `<path d="${round([[x - 34, y], [x + 34, y], [x + 34, y + 54], [x - 34, y + 54]], { tension: 0.05 })}" fill="${PAPER}"/>
      <path d="${ink([[x - 34, y], [x + 34, y], [x + 34, y + 54], [x - 34, y + 54], [x - 34, y]], { w: 5.5, profile: "flat", tension: 0.05 })}"/>
      ${[-20, 0, 20].map(dx => `<path d="${ink([[x + dx, y - 26], [x + dx, y + 12]], { w: 7, profile: "flat" })}"/>`).join("")}`;
  },
  /** 首にかけた靴紐。志村 */
  lace: g => `<path d="${ink([[g.cx - 58, g.neckY + 2], [g.cx - 46, g.neckY + 66], [g.cx - 58, g.neckY + 124]], { w: 6, profile: "mid" })}"/>
    <path d="${ink([[g.cx + 58, g.neckY + 2], [g.cx + 46, g.neckY + 66], [g.cx + 58, g.neckY + 124]], { w: 6, profile: "mid" })}"/>
    <ellipse cx="${g.cx - 58}" cy="${g.neckY + 128}" rx="7" ry="5" fill="${INK}"/>
    <ellipse cx="${g.cx + 58}" cy="${g.neckY + 128}" rx="7" ry="5" fill="${INK}"/>`,
  /** 湯呑み。田中 */
  teacup: g => {
    const x = g.cx + 116, y = g.neckY + 64;
    return `<path d="${round([[x - 26, y - 20], [x + 26, y - 20], [x + 20, y + 26], [x - 20, y + 26]], { tension: 0.12 })}" fill="${PAPER}"/>
      <path d="${ink([[x - 26, y - 20], [x + 26, y - 20], [x + 20, y + 26], [x - 20, y + 26], [x - 26, y - 20]], { w: 6, profile: "flat", tension: 0.12 })}"/>
      <path d="${ink([[x - 20, y - 10], [x, y - 6], [x + 20, y - 10]], { w: 4, profile: "both" })}"/>`;
  },
  /** 古い電卓。柳 */
  calc: g => {
    const x = g.cx + 108, y = g.neckY + 76;
    return `<path d="${round([[x - 34, y - 30], [x + 34, y - 30], [x + 34, y + 34], [x - 34, y + 34]], { tension: 0.08 })}" fill="${PAPER}"/>
      <path d="${ink([[x - 34, y - 30], [x + 34, y - 30], [x + 34, y + 34], [x - 34, y + 34], [x - 34, y - 30]], { w: 6, profile: "flat", tension: 0.08 })}"/>
      <path d="${ink([[x - 24, y - 18], [x + 24, y - 18]], { w: 8, profile: "flat" })}"/>
      ${[0, 1, 2].map(r => [0, 1, 2].map(c =>
        `<circle cx="${x - 18 + c * 18}" cy="${y + 2 + r * 12}" r="3.4" fill="${INK}"/>`).join("")).join("")}`;
  },
  /** 胸に抱えた伝票の束＋アームカバー。熊谷 */
  vouchers: g => `${P.card(g.cx, g.neckY + 96, 120, 76, -4, 3)}
    <path d="${ink([[g.cx - 104, g.neckY + 60], [g.cx - 74, g.neckY + 96], [g.cx - 62, g.neckY + 130]], { w: 12, profile: "mid" })}" fill="${INK}"/>
    <path d="${ink([[g.cx + 104, g.neckY + 60], [g.cx + 74, g.neckY + 96], [g.cx + 62, g.neckY + 130]], { w: 12, profile: "mid" })}" fill="${INK}"/>`,
  /** 充電ケーブル。森田 */
  cable: g => {
    const x = g.cx + 112, y = g.neckY + 28;
    return `<path d="${ink([[x, y], [x + 20, y + 40], [x - 6, y + 74], [x + 22, y + 108], [x + 4, y + 140]], { w: 6, profile: "mid" })}"/>
      <path d="${round([[x - 10, y - 14], [x + 12, y - 14], [x + 12, y + 4], [x - 10, y + 4]], { tension: 0.05 })}" fill="${INK}"/>`;
  },
};

/* ================= 組み立て ================= */
function build(c) {
  hid = 0;
  const g = { ...BASE, ...(c.geom || {}) };
  const defs = [], L = [];
  const add = h => { defs.push(h.def); return h.use; };
  const cl = c.cloth(g);
  const hair = c.hair ? c.hair(g) : {};

  L.push(`<path d="${bodyShape(g)}" fill="${PAPER}"/>`);
  for (const o of cl.tone || []) L.push(add(hatch(cl.region ?? bodyShape(g), o)));
  L.push(`<g fill="${INK}">${cl.lines}</g>`);
  L.push(`<g fill="${INK}">${neckLines(g)}</g>`);

  if (hair.back) L.push(hair.back);
  L.push(`<path d="${faceShape(g)}" fill="${PAPER}"/>`);
  if (c.ears) {
    const e = side => ink([
      [g.cx + side * (g.temple - 2), 214], [g.cx + side * (g.temple + 15), 226], [g.cx + side * (g.temple - 4), 254],
    ], { w: 6, profile: "both" });
    L.push(`<g fill="${INK}"><path d="${e(1)}"/><path d="${e(-1)}"/></g>`);
  }
  L.push(`<g fill="${INK}">${jawLines(g)}</g>`, jawShadow(g));
  if (hair.front) L.push(hair.front);
  if (hair.shine) L.push(`<path d="${hair.shine}" fill="${PAPER}"/>`);

  L.push(`<g fill="${INK}">`, eye(g, -1, c.eye), eye(g, 1, c.eye),
    brow(g, -1, c.brow), brow(g, 1, c.brow), nose(g, c.nose), mouth(g, c.mouth),
    wrinkles(g, c.wrinkle, { forehead: c.forehead }), `</g>`);

  if (c.hatches) for (const h of c.hatches(g)) L.push(add(hatch(h.region, h.opts)));
  if (c.extra) L.push(`<g fill="${INK}">${c.extra(g)}</g>`);
  if (c.beard) L.push(c.beard(g));
  if (c.glasses) L.push(glasses(g, c.glasses.shape, c.glasses.weight, c.glasses.drop || 0));
  if (c.headset) L.push(headset(g));
  if (c.props) L.push(`<g fill="${INK}">${c.props(g)}</g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${c.name}">
<title>${c.name}</title><defs>${defs.join("")}</defs>
<rect width="${W}" height="${W}" fill="${PAPER}"/>
<g fill="${INK}" stroke="none">
${L.join("\n")}
</g></svg>`;
}

/* ================= 無精髭（赤海） ================= */
const stubble = g => [
  { region: round([
      [g.cx - 72, g.mouthY - 4], [g.cx - 48, g.chin - 12], [g.cx, g.chin - 2], [g.cx + 48, g.chin - 12],
      [g.cx + 72, g.mouthY - 4], [g.cx + 52, g.mouthY + 10], [g.cx, g.chin - 26], [g.cx - 52, g.mouthY + 10],
    ], { tension: 0.32 }), opts: { angle: 80, gap: 6, w: 2.2, profile: "both" } },
  { region: round([[g.cx - 24, g.mouthY - 20], [g.cx, g.mouthY - 26], [g.cx + 24, g.mouthY - 20],
      [g.cx + 18, g.mouthY - 8], [g.cx, g.mouthY - 13], [g.cx - 18, g.mouthY - 8]], { tension: 0.3 }),
    opts: { angle: 80, gap: 5.5, w: 2, profile: "both" } },
];

/* 骨格の型 */
const BODY = {
  slimYoung: { temple: 77, cheek: 71, jaw: 44, chin: 317, eyeW: 38, eyeH: 24 },
  slim:      { temple: 78, cheek: 72, jaw: 45, chin: 318, eyeW: 37, eyeH: 21 },
  adult:     { temple: 84, cheek: 78, jaw: 56, chin: 328, eyeW: 36, eyeH: 18, browY: 172, noseY: 252, mouthY: 288 },
  heavy:     { temple: 90, cheek: 86, jaw: 70, chin: 334, eyeW: 35, eyeH: 17, browY: 174, noseY: 254, mouthY: 292 },
  gaunt:     { temple: 80, cheek: 72, jaw: 50, chin: 328, eyeW: 34, eyeH: 16, browY: 172, noseY: 252, mouthY: 288 },
  round:     { temple: 84, cheek: 80, jaw: 60, chin: 324, eyeW: 37, eyeH: 20, browY: 170, noseY: 250, mouthY: 286 },
};

/* ================= 25人 ================= */
const CHARS = [
  { id: "rino", name: "佐伯 梨乃", geom: BODY.slimYoung, hair: g => HAIR.bob(g),
    eye: { tilt: 2, lidW: 13, lash: 1.1 }, brow: { tilt: 3, w: 8, arch: 8 }, mouth: { curve: 6, w: 6, len: 18 },
    wrinkle: "none", cloth: g => COLLAR.cardigan(g, "mid"),
    props: g => P.lanyard(g) + P.card(372, 456, 68, 92, -10, 3) },

  { id: "akaumi", name: "赤海 慧", geom: { ...BODY.adult, crown: 96 }, hair: g => HAIR.mess(g),
    eye: { tilt: 5, open: 0.9, lidW: 12, lash: 0, irisScale: 0.95 }, brow: { tilt: -5, w: 12, arch: 4 },
    nose: { w: 7 }, mouth: { curve: -2, w: 6.5, len: 23 }, wrinkle: "light",
    hatches: stubble,
    extra: g => [[-1], [1]].map(([s]) => ink([[g.cx + s * 64, g.eyeY + 22], [g.cx + s * 40, g.eyeY + 30], [g.cx + s * 22, g.eyeY + 26]], { w: 5, profile: "both" })
      + " " + ink([[g.cx + s * 58, g.eyeY + 36], [g.cx + s * 34, g.eyeY + 41]], { w: 3.6, profile: "both" })).map(d => `<path d="${d}"/>`).join(""),
    cloth: g => COLLAR.crewNeck(g, "dark", 1), props: () => P.skewer() },

  { id: "hayase", name: "早瀬", geom: BODY.slimYoung, hair: g => HAIR.crew(g, "solid", 0),
    eye: { tilt: 0, open: 1.08, lidW: 12, lash: 0.5 }, brow: { tilt: 2, w: 9, arch: 9 },
    mouth: { curve: 7, w: 6, len: 18, open: 9 }, wrinkle: "none",
    cloth: g => COLLAR.lapel(g, "light", 1) },

  { id: "mikami", name: "三上 剛", geom: BODY.heavy, hair: g => HAIR.part(g, "grey"),
    eye: { tilt: 3, open: 0.86, lidW: 13, lash: 0 }, brow: { tilt: -4, w: 13, arch: 6 },
    nose: { w: 8 }, mouth: { curve: 10, w: 7, len: 26, open: 14 }, wrinkle: "heavy", forehead: true,
    cloth: g => COLLAR.open(g, "light") },

  { id: "okochi", name: "大河内", geom: BODY.round, hair: g => HAIR.slickBack(g, "white"),
    eye: { tilt: -2, open: 0.8, lidW: 11, lash: 0 }, brow: { tilt: -1, w: 10, arch: 10 },
    mouth: { curve: 9, w: 6.5, len: 22, open: 8 }, wrinkle: "heavy", forehead: true,
    cloth: g => COLLAR.lapel(g, "mid", 0), props: g => P.cup(g) },

  { id: "okazaki", name: "岡崎", geom: BODY.slim, hair: g => HAIR.part(g),
    eye: { tilt: 0, open: 0.92, lidW: 11, lash: 0 }, brow: { tilt: 1, w: 9, arch: 6 },
    mouth: { curve: 3, w: 5.5, len: 17 }, wrinkle: "light",
    cloth: g => COLLAR.open(g, "mid"), props: g => P.pens(g) },

  { id: "tachibana", name: "橘", geom: { ...BODY.slim, temple: 76, cheek: 70, jaw: 43, chin: 316, browY: 164, browW: 30 },
    ears: true, hair: g => HAIR.pulled(g, "solid", 1),
    eye: { tilt: 6, open: 0.86, lidW: 11, lash: 0.8, irisScale: 0.95 }, brow: { tilt: -3, w: 7, arch: 6 },
    mouth: { curve: -1, w: 5.5, len: 17 }, wrinkle: "light",
    glasses: { shape: "oval", weight: "thin" }, cloth: g => COLLAR.vest(g, "dark") },

  { id: "shimura", name: "志村", geom: BODY.round, hair: g => HAIR.fluffy(g),
    eye: { tilt: -3, open: 1.02, lidW: 12, lash: 0 }, brow: { tilt: 2, w: 11, arch: 9 },
    mouth: { curve: 8, w: 6.5, len: 23, open: 15 }, wrinkle: "light",
    cloth: g => COLLAR.fleece(g, "mid"), props: g => P.lace(g) },

  { id: "takanashi", name: "高梨", geom: BODY.slim, hair: g => HAIR.fringe(g),
    eye: { tilt: -4, open: 0.9, lidW: 11, lash: 0 }, brow: { tilt: 7, w: 9, arch: 3 },
    mouth: { curve: -3, w: 5.5, len: 15 }, wrinkle: "none",
    cloth: g => COLLAR.crewNeck(g, "mid", 1) },

  { id: "morita", name: "森田", geom: BODY.slim, hair: g => HAIR.spiky(g),
    eye: { tilt: 1, open: 0.94, lidW: 11, lash: 0 }, brow: { tilt: -6, w: 10, arch: 11 },
    mouth: { curve: 5, w: 6, len: 20 }, wrinkle: "none",
    cloth: g => COLLAR.open(g, "light"), props: g => P.cable(g) },

  { id: "tanaka", name: "田中", geom: BODY.round, hair: g => HAIR.perm(g, "white", 1),
    eye: { tilt: -4, open: 0.74, lidW: 10, lash: 0.4 }, brow: { tilt: 1, w: 8, arch: 7 },
    mouth: { curve: 7, w: 6, len: 19 }, wrinkle: "heavy",
    glasses: { shape: "oval", weight: "thin", drop: 16 },
    cloth: g => COLLAR.cardigan(g, "mid"), props: g => P.teacup(g) },

  { id: "kiriyama", name: "桐山", geom: BODY.slimYoung, hair: g => HAIR.curly(g),
    eye: { tilt: 0, open: 1.06, lidW: 11, lash: 0 }, brow: { tilt: -2, w: 10, arch: 10 },
    mouth: { curve: 5, w: 5.5, len: 17 }, wrinkle: "none",
    glasses: { shape: "round", weight: "thick" },
    cloth: g => COLLAR.crewNeck(g, "darkest", 0), props: g => P.card(g.cx + 6, g.neckY + 104, 116, 74, -5, 3) },

  { id: "sato", name: "佐藤", geom: BODY.adult, hair: g => HAIR.crew(g, "solid", 1),
    eye: { tilt: 1, open: 0.9, lidW: 12, lash: 0 }, brow: { tilt: -2, w: 12, arch: 6 },
    nose: { w: 7.5 }, mouth: { curve: 2, w: 6.5, len: 21 }, wrinkle: "light",
    extra: g => [[-1], [1]].map(([s]) => ink([[g.cx + s * 66, 244], [g.cx + s * 58, 272], [g.cx + s * 52, 292]],
      { w: 4, profile: "both" })).map(d => `<path d="${d}"/>`).join(""),
    cloth: g => COLLAR.stand(g, "dark"), props: g => P.card(g.cx + 8, g.neckY + 106, 108, 62, -6, 2) },

  { id: "yanagi", name: "柳", geom: BODY.adult, hair: g => HAIR.crew(g, "white", 1),
    eye: { tilt: 2, open: 0.76, lidW: 12, lash: 0 }, brow: { tilt: -3, w: 11, arch: 4 },
    mouth: { curve: 0, w: 7, len: 24 }, wrinkle: "heavy", forehead: true,
    cloth: g => COLLAR.stand(g, "mid"), props: g => P.calc(g) },

  { id: "kumagai", name: "熊谷", geom: BODY.gaunt, hair: g => HAIR.part(g, "white"),
    eye: { tilt: -3, open: 0.74, lidW: 10, lash: 0 }, brow: { tilt: 2, w: 8, arch: 5 },
    mouth: { curve: 1, w: 6, len: 20 }, wrinkle: "heavy", forehead: true,
    glasses: { shape: "round", weight: "thin" },
    cloth: g => COLLAR.vest(g, "dark"), props: g => P.vouchers(g) },

  { id: "kawabe", name: "川辺", geom: { ...BODY.slim, temple: 76, cheek: 70, jaw: 43, chin: 316 },
    hair: g => HAIR.pulled(g, "solid", 0.82),
    eye: { tilt: 4, open: 0.88, lidW: 12, lash: 1 }, brow: { tilt: -1, w: 8, arch: 9 },
    mouth: { curve: 8, w: 6, len: 20 }, wrinkle: "none",
    cloth: g => COLLAR.lapel(g, "dark", 0) },

  { id: "sanada", name: "真田", geom: BODY.adult, hair: g => HAIR.crew(g, "solid", 1),
    eye: { tilt: 0, open: 0.84, lidW: 12, lash: 0 }, brow: { tilt: 0, w: 12, arch: 2 },
    mouth: { curve: 0, w: 6.5, len: 22 }, wrinkle: "light",
    cloth: g => COLLAR.lapel(g, "mid", 1) },

  { id: "nishimura", name: "西村", geom: BODY.slimYoung, hair: g => HAIR.shortBob(g),
    eye: { tilt: 1, open: 1.02, lidW: 12, lash: 1 }, brow: { tilt: 0, w: 8, arch: 9 },
    mouth: { curve: 7, w: 6, len: 19 }, wrinkle: "none",
    headset: true, cloth: g => COLLAR.open(g, "light") },

  { id: "ono", name: "小野", geom: BODY.slim, hair: g => HAIR.part(g, "solid", 1),
    eye: { tilt: 2, open: 0.8, lidW: 11, lash: 0 }, brow: { tilt: 0, w: 10, arch: 3 },
    mouth: { curve: 0, w: 6, len: 19 }, wrinkle: "light",
    glasses: { shape: "square", weight: "thick" }, cloth: g => COLLAR.lapel(g, "darkest", 1) },

  { id: "nomura", name: "野村", geom: BODY.slim, ears: true, hair: g => HAIR.shoulder(g),
    eye: { tilt: -3, open: 0.94, lidW: 11, lash: 0.9 }, brow: { tilt: 2, w: 7, arch: 8 },
    mouth: { curve: 5, w: 5.5, len: 18 }, wrinkle: "light",
    cloth: g => COLLAR.vest(g, "light") },

  { id: "yoshida", name: "吉田", geom: BODY.slim, hair: g => HAIR.tied(g),
    eye: { tilt: -2, open: 0.9, lidW: 11, lash: 0.9 }, brow: { tilt: 6, w: 7, arch: 4 },
    mouth: { curve: -2, w: 5.5, len: 17 }, wrinkle: "light",
    cloth: g => COLLAR.vest(g, "light") },

  { id: "ogawa", name: "小川", geom: BODY.round, hair: g => HAIR.perm(g, "grey", 0.7),
    eye: { tilt: -2, open: 0.88, lidW: 11, lash: 0.7 }, brow: { tilt: 1, w: 8, arch: 7 },
    mouth: { curve: 3, w: 5.5, len: 18 }, wrinkle: "light",
    cloth: g => COLLAR.vest(g, "light"), props: g => P.card(g.cx + 4, g.neckY + 100, 112, 68, -7, 3) },

  { id: "kaicho", name: "会長", geom: BODY.adult, hair: g => HAIR.shortWhite(g, "white"),
    eye: { tilt: -2, open: 0.78, lidW: 12, lash: 0 }, brow: { tilt: -1, w: 12, arch: 8 },
    nose: { w: 7.5 }, mouth: { curve: 9, w: 7, len: 24, open: 12 }, wrinkle: "heavy", forehead: true,
    beard: chinBeard,
    extra: g => [[-1], [1]].map(([s]) => ink([[g.cx + s * 68, 236], [g.cx + s * 60, 264], [g.cx + s * 54, 282]],
      { w: 4, profile: "both" })).map(d => `<path d="${d}"/>`).join(""),
    cloth: g => COLLAR.fleece(g, "mid") },

  { id: "shoken_senior", name: "証券会社の年上のほう", geom: BODY.adult, hair: g => HAIR.part(g, "grey"),
    eye: { tilt: 0, open: 0.82, lidW: 11, lash: 0 }, brow: { tilt: -1, w: 10, arch: 5 },
    mouth: { curve: 4, w: 6, len: 20 }, wrinkle: "heavy", forehead: true,
    cloth: g => COLLAR.lapel(g, "dark", 1, 1) },

  { id: "shoken_junior", name: "証券会社の年下のほう", geom: BODY.slim, hair: g => HAIR.crew(g),
    eye: { tilt: 1, open: 0.86, lidW: 11, lash: 0 }, brow: { tilt: 0, w: 9, arch: 3 },
    mouth: { curve: 0, w: 5.5, len: 18 }, wrinkle: "none",
    cloth: g => COLLAR.lapel(g, "dark", 1) },
];

export async function generate() {
  await mkdir(OUT, { recursive: true });
  let total = 0;
  for (const c of CHARS) {
    const svg = build(c);
    await writeFile(path.join(OUT, `${c.id}.svg`), svg, "utf8");
    const kb = Buffer.byteLength(svg) / 1024; total += kb;
    console.log(`  ${c.id.padEnd(14)} ${c.name.padEnd(12)} ${kb.toFixed(1)} KB`);
  }
  console.log(`${CHARS.length} 枚・合計 ${total.toFixed(0)} KB を ${path.relative(ROOT, OUT)} に書き出しました`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await generate();
