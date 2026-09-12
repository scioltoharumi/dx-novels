/**
 * トップの背景に敷くキービジュアルを SVG で描く。
 *
 *   npm run key   → site/img/key.svg
 *
 * 描くのは「四階の小部屋の夜」。物語のほとんどがここで説明される場所。
 *   壁に貼った最初の図（五角形にならない星）／机の上の開いたノート／湯呑み／
 *   三枚のモニター／空の串が立った缶／窓の外の神田の夜景
 *
 * 背景は塗らない。トップでは暗い地の上に重ねて薄く敷くので、
 * 透過のまま淡い線だけを置くと、地のグラデーションが透けて馴染む。
 * 線は肖像と同じく「塗りのリボン」で描く（scripts/penlib.mjs）。
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ink, blob, round } from "./penlib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "site", "img");
const W = 1920, H = 1080;
const LINE = "#e9e3d6";   // 淡いインク。暗い地に重ねる前提

const L = (pts, w = 5, profile = "mid", o = {}) => ink(pts, { w, profile, ...o });
const box = (x, y, w, h, lw = 5) => L([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]], lw, "flat", { tension: 0.02 });

const P = [];
const add = (d, opacity = 1) => P.push(opacity === 1 ? `<path d="${d}"/>` : `<path d="${d}" opacity="${opacity}"/>`);

/* ---- 机。画面を横切る一本が絵の背骨になる ---- */
add(L([[-40, 836], [520, 826], [1180, 816], [1960, 802]], 7, "belly"));
add(L([[-40, 872], [600, 862], [1300, 850], [1960, 838]], 3.5, "mid"), 0.5);

/* ---- 壁に貼った最初の図。五角形にならない星と、四角と矢印。
       トップでは見出しが左に乗るので、絵の要素はすべて右half に寄せる ---- */
(() => {
  const x = 1466, y = 146, w = 242, h = 240;
  add(box(x, y, w, h, 4.5), 0.85);
  // 箱と矢印（データが流れていく図）
  const cells = [[x + 30, y + 46], [x + 148, y + 46], [x + 30, y + 152], [x + 148, y + 152]];
  for (const [bx, by] of cells) add(box(bx, by, 88, 52, 3.6), 0.8);
  add(L([[x + 118, y + 72], [x + 148, y + 72]], 3.6, "head"), 0.8);
  add(L([[x + 118, y + 178], [x + 148, y + 178]], 3.6, "head"), 0.8);
  add(L([[x + 74, y + 98], [x + 74, y + 152]], 3.6, "head"), 0.8);
  add(L([[x + 192, y + 98], [x + 192, y + 152]], 3.6, "head"), 0.8);
  // 星。五角形になっていない
  const star = [[x + 214, y + 208], [x + 226, y + 232], [x + 252, y + 236], [x + 234, y + 252], [x + 240, y + 228]];
  add(L([...star, star[0]], 3.4, "flat", { tension: 0.1 }), 0.75);
})();

/* ---- 机の上、モニターの手前：開いたノートと湯呑み ---- */
(() => {
  const cy = 836, x0 = 812;
  // 開いたノート（見開き）
  add(L([[x0, cy + 20], [x0 + 138, cy - 12], [x0 + 274, cy + 16]], 5, "mid"));
  add(L([[x0, cy + 20], [x0 + 8, cy + 44], [x0 + 138, cy + 14], [x0 + 268, cy + 40], [x0 + 274, cy + 16]], 4, "flat", { tension: 0.3 }), 0.9);
  add(L([[x0 + 138, cy - 12], [x0 + 138, cy + 14]], 3.6, "mid"), 0.8);
  for (let i = 0; i < 3; i++) {
    add(L([[x0 + 24 + i * 3, cy + i * 9], [x0 + 120, cy - 8 + i * 9]], 2.8, "both"), 0.55);
    add(L([[x0 + 156, cy - 8 + i * 9], [x0 + 252 - i * 3, cy + i * 9]], 2.8, "both"), 0.55);
  }
  // ペン
  add(L([[x0 + 296, cy + 34], [x0 + 384, cy + 4]], 5, "tail"), 0.8);
  // 湯呑み
  const tx = 1242, ty = 764;
  add(L([[tx, ty], [tx + 58, ty], [tx + 50, ty + 56], [tx + 8, ty + 56], [tx, ty]], 4.6, "flat", { tension: 0.06 }), 0.9);
  add(L([[tx + 8, ty + 12], [tx + 29, ty + 16], [tx + 50, ty + 12]], 3.2, "both"), 0.7);
})();

/* ---- 中央：三枚のモニター ---- */
(() => {
  const screens = [
    { x: 726, y: 436, w: 244, h: 182, skew: 14 },
    { x: 990, y: 410, w: 300, h: 208, skew: 0 },
    { x: 1310, y: 436, w: 244, h: 182, skew: -14 },
  ];
  for (const s of screens) {
    const { x, y, w, h, skew } = s;
    // 枠。奥行きを出すため上辺を skew ぶん傾ける
    const p = [[x + Math.max(0, skew), y + Math.abs(skew) * 0.2], [x + w + Math.min(0, skew), y],
      [x + w, y + h], [x, y + h - Math.abs(skew) * 0.2]];
    add(L([...p, p[0]], 5.5, "flat", { tension: 0.04 }));
    // 画面の中の文字の行
    const rows = 7, iw = w - 44;
    for (let i = 0; i < rows; i++) {
      const yy = y + 30 + i * ((h - 54) / (rows - 1));
      const len = iw * [0.82, 0.54, 0.7, 0.38, 0.64, 0.46, 0.28][i % 7];
      add(L([[x + 22, yy], [x + 22 + len, yy - skew * 0.05]], 3.2, "both"), 0.42 + (i % 2) * 0.12);
    }
    // 支柱と台
    add(L([[x + w / 2, y + h], [x + w / 2, y + h + 46]], 5, "mid"), 0.9);
    add(L([[x + w / 2 - 44, y + h + 50], [x + w / 2 + 44, y + h + 50]], 5, "both"), 0.9);
  }
})();

/* ---- 右：空の串が立った缶 ---- */
(() => {
  const x = 1636, y = 706, w = 88, h = 104;
  add(L([[x, y], [x + w, y], [x + w - 5, y + h], [x + 5, y + h], [x, y]], 5, "flat", { tension: 0.05 }));
  add(L([[x + 4, y + 9], [x + w / 2, y + 15], [x + w - 4, y + 9]], 3.4, "both"), 0.7);
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1) - 0.5);
    const bx = x + w / 2 + t * (w * 0.5);
    add(L([[bx, y + 12], [bx + t * 46, y - 96 - Math.abs(t) * -28], [bx + t * 84, y - 176 + Math.abs(t) * 34]],
      3.6, "tail"), 0.78);
  }
})();

/* ---- 右端：窓と、神田の夜景 ---- */
(() => {
  const x = 1742, y = 128, w = 250, h = 452;
  add(box(x, y, w, h, 6), 0.9);
  add(L([[x + w / 2, y], [x + w / 2, y + h]], 4, "mid"), 0.75);
  add(L([[x, y + h * 0.46], [x + w, y + h * 0.46]], 4, "mid"), 0.75);
  // ビルの影と、いくつか灯った窓
  const towers = [[x + 14, 300, 58], [x + 78, 244, 44], [x + 128, 330, 52], [x + 186, 268, 62]];
  for (const [bx, top, bw] of towers) {
    add(L([[bx, y + h], [bx, top], [bx + bw, top], [bx + bw, y + h]], 4, "flat", { tension: 0.02 }), 0.55);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) {
      if ((r + c + bw) % 3) continue;
      const wx = bx + 10 + c * (bw - 26), wy = top + 26 + r * 44;
      if (wy > y + h - 24) continue;
      add(box(wx, wy, 13, 17, 2.6), 0.7);
    }
  }
})();

/* ---- 左下：椅子の背。人は描かない。見出しより下なので邪魔にならない ---- */
add(L([[96, 1080], [108, 962], [246, 948], [262, 1080]], 6, "mid", { tension: 0.35 }), 0.45);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"
  role="img" aria-label="四階の小部屋の夜">
<title>四階の小部屋</title>
<g fill="${LINE}" stroke="none">
${P.join("\n")}
</g></svg>`;

export async function generate() {
  await mkdir(OUT, { recursive: true });
  const f = path.join(OUT, "key.svg");
  await writeFile(f, svg, "utf8");
  console.log(`キービジュアル ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB → ${path.relative(ROOT, f)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await generate();
