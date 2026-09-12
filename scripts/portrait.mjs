/**
 * 肖像を SVG の線画として組み立てる（試作。まずは3人）。
 *
 *   node scripts/portrait.mjs   → site/img/characters/<id>.svg を書き出す
 *
 * 単行本の巻頭の白黒ページに寄せた線画。ペンで描いた絵にはならないが、
 *   - 25人の絵柄が構造として完全に揃う
 *   - 44px でも 128px でも劣化しない（1枚 数KB）
 *   - 骨格・髪・襟・小物を数値で持てるので、あとから一部だけ直せる
 * という利点がある。
 *
 * 円形に切り抜かれる前提なので、四隅には何も置かない。
 * 小さく表示したときは線ではなく「髪と服の黒い塊」が効くので、髪はベタ塗りにしている。
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "site", "img", "characters");

const W = 512;                 // 画面の一辺。円の中心は (256,256)、半径 256
const INK = "#17150f";
const PAPER = "#f7f4ed";       // サイトの肖像の下地と同じ色
const n = v => Math.round(v * 10) / 10;

/** 全員に共通の基準。人物ごとに geom で上書きして骨格を変える */
const BASE = {
  cx: 256,
  topY: 80,        // 頭蓋の上
  chinY: 322,      // 顎
  halfW: 86,       // 頬のいちばん広いところ
  jawW: 56,        // 顎の幅
  cheek: 52,       // 頬の張り（大きいほど丸顔）
  eyeY: 205,       // 目の高さ。上から 40%
  eyeX: 40,
  eyeW: 23, eyeH: 13,
  browY: 170, browW: 29, browWeight: 4.6, browTilt: 0,
  noseY: 246,
  mouthY: 278,
  neckW: 50,
  neckY: 384,
};

/* ---------- 骨格 ---------- */
const midY = g => (g.topY + g.chinY) / 2;

/** 顔の輪郭。頭蓋から頬、顎へ */
const facePath = g => {
  const m = midY(g);
  return `M ${g.cx - g.halfW} ${m - 30}
  C ${g.cx - g.halfW} ${g.topY + 22}, ${g.cx - g.halfW * 0.6} ${g.topY}, ${g.cx} ${g.topY}
  C ${g.cx + g.halfW * 0.6} ${g.topY}, ${g.cx + g.halfW} ${g.topY + 22}, ${g.cx + g.halfW} ${m - 30}
  C ${g.cx + g.halfW} ${m + g.cheek}, ${g.cx + g.jawW} ${g.chinY - 38}, ${g.cx} ${g.chinY}
  C ${g.cx - g.jawW} ${g.chinY - 38}, ${g.cx - g.halfW} ${m + g.cheek}, ${g.cx - g.halfW} ${m - 30} Z`;
};

/** 首と肩 */
const bodyPath = g => `M ${g.cx - 196} 512
  C ${g.cx - 188} ${g.neckY + 44}, ${g.cx - 142} ${g.neckY + 6}, ${g.cx - 62} ${g.neckY}
  L ${g.cx + 62} ${g.neckY}
  C ${g.cx + 142} ${g.neckY + 6}, ${g.cx + 188} ${g.neckY + 44}, ${g.cx + 196} 512 Z`;

const neckLines = g => `<path d="M ${g.cx - g.neckW} ${g.chinY - 18} C ${g.cx - g.neckW + 2} ${g.chinY + 34}, ${g.cx - g.neckW - 2} ${g.chinY + 50}, ${g.cx - 62} ${g.neckY}" stroke-width="4.6"/>
  <path d="M ${g.cx + g.neckW} ${g.chinY - 18} C ${g.cx + g.neckW - 2} ${g.chinY + 34}, ${g.cx + g.neckW + 2} ${g.chinY + 50}, ${g.cx + 62} ${g.neckY}" stroke-width="4.6"/>`;

/* ---------- 顔の部品 ---------- */
function eye(g, x) {
  const { eyeY: y, eyeW: w, eyeH: h, eyeDroop: d = 0 } = g;
  return `<path d="M ${n(x - w)} ${n(y + 3 + d)} C ${n(x - w * 0.5)} ${n(y - h)}, ${n(x + w * 0.5)} ${n(y - h)}, ${n(x + w)} ${n(y + d * 0.4)}" stroke-width="5.2"/>
    <path d="M ${n(x - w * 0.76)} ${n(y + 5 + d)} C ${n(x - w * 0.35)} ${n(y + h * 0.66)}, ${n(x + w * 0.35)} ${n(y + h * 0.66)}, ${n(x + w * 0.8)} ${n(y + 3 + d * 0.4)}" stroke-width="2.2"/>
    <circle cx="${n(x)}" cy="${n(y + h * 0.15 + d * 0.5)}" r="${n(h * 0.56)}" fill="${INK}" stroke="none"/>`;
}
function brow(g, x, side) {
  const y = g.browY, t = g.browTilt, L = g.browW;
  return `<path d="M ${n(x - side * L)} ${n(y + t)} C ${n(x - side * 8)} ${n(y - 7 + t * 0.3)}, ${n(x + side * 10)} ${n(y - 5)}, ${n(x + side * L)} ${n(y + 2)}" stroke-width="${g.browWeight}"/>`;
}
const nose = g => `<path d="M ${g.cx - 8} ${g.noseY - 28} C ${g.cx - 14} ${g.noseY - 4}, ${g.cx - 11} ${g.noseY + 4}, ${g.cx + 4} ${g.noseY + 3}" stroke-width="3.2"/>`;

/** 斜線のハッチング。region の中だけに線を引く */
let hatchId = 0;
function hatch(region, { angle = 42, gap = 11, width = 2.6 } = {}) {
  const id = `h${++hatchId}`;
  const rad = angle * Math.PI / 180, dx = Math.cos(rad), dy = Math.sin(rad), L = 700;
  const lines = [];
  for (let i = -60; i < 60; i++) {
    const px = -dy * i * gap + 256, py = dx * i * gap + 256;
    lines.push(`M ${n(px - dx * L)} ${n(py - dy * L)} L ${n(px + dx * L)} ${n(py + dy * L)}`);
  }
  return { def: `<clipPath id="${id}"><path d="${region}"/></clipPath>`,
    use: `<g clip-path="url(#${id})" stroke-width="${width}"><path d="${lines.join(" ")}"/></g>` };
}

/** 眼鏡。shape は oval / round / square */
function glasses(g, shape, weight) {
  const w = weight === "thick" ? 6.5 : 3.2;
  const y = g.eyeY + 1, x = g.eyeX + 2;
  const lens = cx => shape === "square"
    ? `<rect x="${n(cx - 35)}" y="${n(y - 25)}" width="70" height="48" rx="6"/>`
    : shape === "round" ? `<circle cx="${n(cx)}" cy="${n(y - 1)}" r="31"/>`
      : `<ellipse cx="${n(cx)}" cy="${n(y - 1)}" rx="35" ry="22"/>`;
  return `<g stroke-width="${w}" fill="none">${lens(g.cx - x)}${lens(g.cx + x)}
    <path d="M ${n(g.cx - x + 35)} ${n(y - 3)} L ${n(g.cx + x - 35)} ${n(y - 3)}"/>
    <path d="M ${n(g.cx - x - 35)} ${n(y - 6)} L ${n(g.cx - g.halfW - 1)} ${n(y - 13)}"/>
    <path d="M ${n(g.cx + x + 35)} ${n(y - 6)} L ${n(g.cx + g.halfW + 1)} ${n(y - 13)}"/></g>`;
}

/* ---------- 襟 ---------- */
const collar = {
  cardigan: g => ({
    tone: "mid",
    region: `${bodyPath(g)} M ${g.cx - 62} ${g.neckY} L ${g.cx} ${g.neckY + 96} L ${g.cx + 62} ${g.neckY} Z`,
    lines: `<path d="M ${g.cx - 62} ${g.neckY} L ${g.cx - 6} ${g.neckY + 100}" stroke-width="5"/>
      <path d="M ${g.cx + 62} ${g.neckY} L ${g.cx + 6} ${g.neckY + 100}" stroke-width="5"/>
      <path d="M ${g.cx - 6} ${g.neckY + 100} L ${g.cx - 6} 512" stroke-width="4"/>
      <path d="M ${g.cx + 6} ${g.neckY + 100} L ${g.cx + 6} 512" stroke-width="4"/>`,
  }),
  hoodie: g => ({
    tone: "dark",
    region: `${bodyPath(g)} M ${g.cx - 66} ${g.neckY} C ${g.cx - 34} ${g.neckY + 46}, ${g.cx + 34} ${g.neckY + 46}, ${g.cx + 66} ${g.neckY} Z`,
    lines: `<path d="M ${g.cx - 100} ${g.neckY + 20} C ${g.cx - 60} ${g.neckY + 72}, ${g.cx + 60} ${g.neckY + 72}, ${g.cx + 100} ${g.neckY + 20}" stroke-width="5.5"/>
      <path d="M ${g.cx - 66} ${g.neckY} C ${g.cx - 34} ${g.neckY + 46}, ${g.cx + 34} ${g.neckY + 46}, ${g.cx + 66} ${g.neckY}" stroke-width="4.4"/>
      <path d="M ${g.cx - 16} ${g.neckY + 74} L ${g.cx - 22} 512" stroke-width="3.2"/>
      <path d="M ${g.cx + 16} ${g.neckY + 74} L ${g.cx + 22} 512" stroke-width="3.2"/>`,
  }),
  vest: g => ({
    tone: "dark",
    region: `${bodyPath(g)} M ${g.cx - 58} ${g.neckY} L ${g.cx} ${g.neckY + 86} L ${g.cx + 58} ${g.neckY} Z`,
    lines: `<path d="M ${g.cx - 58} ${g.neckY} L ${g.cx - 28} ${g.neckY + 52} L ${g.cx} ${g.neckY + 28}" stroke-width="4.6"/>
      <path d="M ${g.cx + 58} ${g.neckY} L ${g.cx + 28} ${g.neckY + 52} L ${g.cx} ${g.neckY + 28}" stroke-width="4.6"/>
      <path d="M ${g.cx} ${g.neckY + 28} L ${g.cx} ${g.neckY + 90}" stroke-width="3.8"/>
      <path d="M ${g.cx - 28} ${g.neckY + 52} L ${g.cx} ${g.neckY + 90} L ${g.cx + 28} ${g.neckY + 52}" stroke-width="4.6"/>`,
  }),
};
const TONE = {
  light: [],
  mid: [{ angle: 42, gap: 13, width: 2.4 }],
  dark: [{ angle: 42, gap: 10, width: 2.6 }, { angle: -42, gap: 12, width: 2.2 }],
  darkest: [{ angle: 42, gap: 8, width: 2.8 }, { angle: -42, gap: 8, width: 2.6 }],
};

/* ---------- 組み立て ---------- */
function build(c) {
  hatchId = 0;
  const g = { ...BASE, ...(c.geom || {}) };
  const defs = [], L = [];
  const add = h => { defs.push(h.def); return h.use; };
  const cloth = c.cloth(g);

  L.push(`<path d="${bodyPath(g)}" fill="${PAPER}" stroke="none"/>`);
  L.push(...(TONE[cloth.tone] || []).map(o => add(hatch(cloth.region, o))));
  L.push(`<g fill="none">${cloth.lines}</g>`, `<g fill="none">${neckLines(g)}</g>`);

  if (c.hair.back) L.push(`<path d="${c.hair.back}" fill="${INK}" stroke="${INK}" stroke-width="3"/>`);
  L.push(`<path d="${facePath(g)}" fill="${PAPER}" stroke="${INK}" stroke-width="6.2"/>`);
  if (c.ears) {
    const m = midY(g);
    L.push(`<path d="M ${g.cx - g.halfW + 3} ${m - 4} C ${g.cx - g.halfW - 17} ${m - 14}, ${g.cx - g.halfW - 17} ${m + 26}, ${g.cx - g.halfW + 5} ${m + 26}" stroke-width="4"/>
      <path d="M ${g.cx + g.halfW - 3} ${m - 4} C ${g.cx + g.halfW + 17} ${m - 14}, ${g.cx + g.halfW + 17} ${m + 26}, ${g.cx + g.halfW - 5} ${m + 26}" stroke-width="4"/>`);
  }
  if (c.hair.front) L.push(`<path d="${c.hair.front}" fill="${INK}" stroke="${INK}" stroke-width="3"/>`);
  if (c.hair.extra) L.push(c.hair.extra);
  if (c.hair.strokes) L.push(`<g fill="none" stroke="${PAPER}" stroke-width="2.6">${c.hair.strokes}</g>`);

  L.push(eye(g, g.cx - g.eyeX), eye(g, g.cx + g.eyeX), brow(g, g.cx - g.eyeX, -1), brow(g, g.cx + g.eyeX, 1), nose(g), c.mouth(g));
  if (c.hatches) for (const h of c.hatches(g)) L.push(add(hatch(h.region, h.opts)));
  if (c.faceExtra) L.push(`<g fill="none">${c.faceExtra(g)}</g>`);
  if (c.glasses) L.push(glasses(g, c.glasses.shape, c.glasses.weight));
  if (c.props) L.push(`<g fill="none">${c.props(g)}</g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="${c.name}">
<title>${c.name}</title><defs>${defs.join("")}</defs>
<rect width="${W}" height="${W}" fill="${PAPER}"/>
<g stroke="${INK}" fill="none" stroke-linecap="round" stroke-linejoin="round">
${L.join("\n")}
</g></svg>`;
}

/* ---------- 人物 ---------- */
const CHARS = [
  {
    id: "rino", name: "佐伯 梨乃", ears: false,
    // 20代半ば。細面、外ハネのミディアムボブ＋前髪
    geom: { halfW: 82, jawW: 50, cheek: 46, eyeW: 24, eyeH: 15, browWeight: 4.2, browTilt: 3, browW: 27 },
    hair: {
      back: `M 144 296 C 124 188, 146 50, 256 46 C 366 50, 388 188, 368 296
             C 378 318, 354 334, 338 314 C 350 234, 350 150, 256 144
             C 162 150, 162 234, 174 314 C 158 334, 134 318, 144 296 Z`,
      // 前髪。頭頂は必ず顔の輪郭の上端（topY）より上から始める。下げると隙間が白い帯になる
      front: `M 168 152 C 176 106, 214 64, 256 64 C 300 64, 340 106, 346 154
              C 338 178, 328 188, 318 192 C 314 162, 294 142, 266 142
              C 230 142, 200 160, 186 194 C 176 188, 172 172, 168 152 Z`,
      // 髪のつや。生え際ではなく、髪の塊の内側に置く（生え際に置くとヘアバンドに見える）
      strokes: `<path d="M 184 214 C 178 250, 178 280, 182 302"/>
        <path d="M 330 216 C 336 252, 336 282, 332 304"/>`,
    },
    mouth: g => `<path d="M ${g.cx - 19} ${g.mouthY} C ${g.cx - 6} ${g.mouthY + 6}, ${g.cx + 6} ${g.mouthY + 6}, ${g.cx + 19} ${g.mouthY - 1}" stroke-width="4.2"/>`,
    cloth: collar.cardigan,
    props: g => `<path d="M ${g.cx - 44} ${g.neckY + 8} L ${g.cx - 14} ${g.neckY + 118}" stroke-width="4"/>
      <path d="M ${g.cx + 44} ${g.neckY + 8} L ${g.cx + 14} ${g.neckY + 118}" stroke-width="4"/>
      <g transform="rotate(-10 368 456)">
        <path d="M 334 412 L 404 412 L 404 502 L 334 502 Z" fill="${PAPER}" stroke="${INK}" stroke-width="4.4"/>
        <path d="M 346 432 L 392 432 M 346 452 L 392 452 M 346 472 L 380 472" stroke-width="2.4"/>
      </g>`,
  },
  {
    id: "akaumi", name: "赤海 慧", ears: false,
    // 30代半ば。四角い顎、重い眉、伸びた短髪。頬がこけている
    geom: { halfW: 90, jawW: 70, cheek: 60, chinY: 330, eyeW: 22, eyeH: 11, eyeDroop: 2,
      browY: 176, browWeight: 6.4, browTilt: -5, browW: 32, mouthY: 284, noseY: 250 },
    hair: {
      // 頭を覆う塊。耳のあたりまでで、肩には落ちない。上の輪郭をぎざつかせる
      back: `M 148 232 C 132 150, 146 44, 200 30 C 216 44, 232 30, 248 22
             C 260 40, 274 28, 290 34 C 306 24, 322 40, 338 34
             C 380 58, 386 152, 366 232 C 358 200, 348 170, 336 148
             L 178 148 C 166 170, 156 200, 148 232 Z`,
      front: `M 164 196 C 170 112, 206 60, 256 60 C 310 60, 346 114, 350 200
              C 336 168, 322 150, 306 142 C 286 166, 250 172, 226 158
              C 206 168, 186 180, 176 206 C 172 204, 166 200, 164 196 Z`,
    },
    mouth: g => `<path d="M ${g.cx - 23} ${g.mouthY + 1} L ${g.cx + 23} ${g.mouthY}" stroke-width="4.6"/>`,
    // 無精髭。顎の輪郭に沿った細い帯と、鼻の下の小さな帯に分ける（塊にするとマスクに見える）
    hatches: g => [
      { region: `M ${g.cx - 76} ${g.mouthY - 6} C ${g.cx - 68} ${g.chinY - 18}, ${g.cx - 36} ${g.chinY + 4}, ${g.cx} ${g.chinY + 2}
                 C ${g.cx + 36} ${g.chinY + 4}, ${g.cx + 68} ${g.chinY - 18}, ${g.cx + 76} ${g.mouthY - 6}
                 C ${g.cx + 62} ${g.mouthY + 8}, ${g.cx + 34} ${g.chinY - 20}, ${g.cx} ${g.chinY - 22}
                 C ${g.cx - 34} ${g.chinY - 20}, ${g.cx - 62} ${g.mouthY + 8}, ${g.cx - 76} ${g.mouthY - 6} Z`,
        opts: { angle: 82, gap: 6, width: 1.7 } },
      { region: `M ${g.cx - 26} ${g.mouthY - 20} C ${g.cx - 12} ${g.mouthY - 26}, ${g.cx + 12} ${g.mouthY - 26}, ${g.cx + 26} ${g.mouthY - 20}
                 L ${g.cx + 22} ${g.mouthY - 7} C ${g.cx + 10} ${g.mouthY - 12}, ${g.cx - 10} ${g.mouthY - 12}, ${g.cx - 22} ${g.mouthY - 7} Z`,
        opts: { angle: 82, gap: 6, width: 1.7 } },
    ],
    faceExtra: g => `<path d="M ${g.cx - 62} ${g.eyeY + 20} L ${g.cx - 24} ${g.eyeY + 22}" stroke-width="2.4"/>
      <path d="M ${g.cx - 58} ${g.eyeY + 30} L ${g.cx - 28} ${g.eyeY + 31}" stroke-width="2"/>
      <path d="M ${g.cx + 62} ${g.eyeY + 20} L ${g.cx + 24} ${g.eyeY + 22}" stroke-width="2.4"/>
      <path d="M ${g.cx + 58} ${g.eyeY + 30} L ${g.cx + 28} ${g.eyeY + 31}" stroke-width="2"/>
      <path d="M ${g.cx - 66} ${midY(g) + 38} C ${g.cx - 58} ${midY(g) + 68}, ${g.cx - 52} ${midY(g) + 84}, ${g.cx - 48} ${midY(g) + 96}" stroke-width="2.4"/>
      <path d="M ${g.cx + 66} ${midY(g) + 38} C ${g.cx + 58} ${midY(g) + 68}, ${g.cx + 52} ${midY(g) + 84}, ${g.cx + 48} ${midY(g) + 96}" stroke-width="2.4"/>`,
    cloth: collar.hoodie,
    props: g => `<g transform="rotate(7 408 252)">
        <path d="M 408 348 L 408 182" stroke-width="5"/>
        <path d="M 408 152 C 430 152, 432 176, 430 190 C 428 204, 388 204, 386 190 C 384 176, 386 152, 408 152 Z" fill="${PAPER}" stroke="${INK}" stroke-width="4.4"/>
        <path d="M 408 206 C 430 206, 432 228, 430 240 C 428 254, 388 254, 386 240 C 384 228, 386 206, 408 206 Z" fill="${PAPER}" stroke="${INK}" stroke-width="4.4"/>
        <path d="M 408 258 C 430 258, 432 280, 430 292 C 428 306, 388 306, 386 292 C 384 280, 386 258, 408 258 Z" fill="${PAPER}" stroke="${INK}" stroke-width="4.4"/>
        <path d="M 396 166 C 402 172, 412 170, 418 164 M 396 220 C 402 226, 412 224, 418 218 M 396 272 C 402 278, 412 276, 418 270" stroke-width="2.2"/>
      </g>`,
  },
  {
    id: "tachibana", name: "橘", ears: true,
    // 30代後半。細い輪郭、後ろでまとめた髪で額と耳が出る。細い楕円の眼鏡
    geom: { halfW: 80, jawW: 48, cheek: 42, eyeW: 22, eyeH: 11, browY: 166, browWeight: 3.8, browTilt: -3, browW: 28 },
    hair: {
      // 頭に沿う薄い塊。耳より上で終わる
      back: `M 160 196 C 150 92, 196 42, 256 40 C 316 42, 362 92, 352 196
             C 348 176, 344 160, 340 150 L 172 150 C 168 160, 164 176, 160 196 Z`,
      front: `M 170 168 C 176 104, 210 60, 256 60 C 302 60, 336 104, 342 168
              C 330 136, 298 120, 256 120 C 214 120, 182 136, 170 168 Z`,
      // まとめ髪。後頭部でくくった束が首の横からのぞく
      extra: `<path d="M 352 172 C 372 190, 384 218, 380 250 C 376 276, 362 290, 348 288" fill="${INK}" stroke="${INK}" stroke-width="3"/>`,
    },
    mouth: g => `<path d="M ${g.cx - 18} ${g.mouthY} L ${g.cx + 18} ${g.mouthY - 1}" stroke-width="4"/>`,
    glasses: { shape: "oval", weight: "thin" },
    cloth: collar.vest,
  },
];

export async function generate() {
  await mkdir(OUT, { recursive: true });
  const made = [];
  for (const c of CHARS) {
    const svg = build(c);
    await writeFile(path.join(OUT, `${c.id}.svg`), svg, "utf8");
    made.push({ id: c.id, name: c.name, bytes: Buffer.byteLength(svg) });
  }
  for (const m of made) console.log(`  ${m.id.padEnd(11)} ${m.name.padEnd(8)} ${(m.bytes / 1024).toFixed(1)} KB`);
  console.log(`${made.length} 枚を ${path.relative(ROOT, OUT)} に書き出しました`);
  return made;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await generate();
