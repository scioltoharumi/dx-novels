/**
 * ペン画のための描画部品。
 *
 * 肝は「線に強弱をつける」こと。SVG の stroke は幅が一定なので、どう描いても均一な線になり、
 * 図形記号に見えてしまう。そこで **線を塗りのリボンとして作る**。中心線に沿って太さを変えた
 * 閉じた形を生成すれば、Gペンのように入りと抜きのある線になる。
 * （考え方の出どころ: 木月すみよし「IllustratorでまんがみたいなSVGのファイルを作る」の
 *   アートブラシで線幅を変える手法を、SVG の塗りで再現している）
 *
 * 使い方:
 *   ink([[x,y],[x,y],...], { w: 9, profile: "both" })   点を通る滑らかな線を、両端が尖った線で
 *   blob([[x,y],...], { bulge: 18 })                    角が尖った塊（髪の房）
 */

/* ---------- ベジェ ---------- */
const B = (p, t) => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
          a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
};
const dB = (p, t) => {
  const u = 1 - t, a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
  return [a * (p[1][0] - p[0][0]) + b * (p[2][0] - p[1][0]) + c * (p[3][0] - p[2][0]),
          a * (p[1][1] - p[0][1]) + b * (p[2][1] - p[1][1]) + c * (p[3][1] - p[2][1])];
};

/** 点列を通る滑らかな3次ベジェの連なりにする（Catmull-Rom → Bezier） */
function through(pts, closed = false, tension = 0.5) {
  const P = pts.slice();
  if (closed) P.unshift(pts[pts.length - 1]), P.push(pts[0], pts[1]);
  else P.unshift(pts[0]), P.push(pts[pts.length - 1]);
  const segs = [];
  for (let i = 1; i + 2 < P.length; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    segs.push([p1,
      [p1[0] + (p2[0] - p0[0]) / 6 * tension * 2, p1[1] + (p2[1] - p0[1]) / 6 * tension * 2],
      [p2[0] - (p3[0] - p1[0]) / 6 * tension * 2, p2[1] - (p3[1] - p1[1]) / 6 * tension * 2],
      p2]);
  }
  return segs;
}

/** 太さの分布。t は線全体を 0→1 で見たときの位置 */
const PROFILE = {
  both: (t, k = 0.62) => Math.pow(Math.sin(Math.PI * t), k),          // 入りも抜きも尖る
  tail: (t, k = 0.75) => Math.pow(1 - t, k),                          // 太く入って抜く
  head: (t, k = 0.75) => Math.pow(t, k),                              // 細く入って太く終わる
  mid:  t => 0.38 + 0.62 * Math.sin(Math.PI * t),                     // 端も少し残す
  belly:t => 0.30 + 0.70 * Math.pow(Math.sin(Math.PI * t), 0.45),     // 中央が長く太い
  flat: () => 1,
};

const r1 = v => Math.round(v * 10) / 10;

/**
 * 点列を通る、太さの変わる線を「塗りの形」として返す。
 *   w       いちばん太いところの幅
 *   profile PROFILE の名前
 *   shift   太さの山を前後にずらす（-0.3〜0.3）。手の運びの癖が出る
 */
export function ink(pts, { w = 8, profile = "both", shift = 0, per = 10, tension = 0.5 } = {}) {
  const segs = through(pts, false, tension);
  const f = PROFILE[profile] || PROFILE.both;
  const N = segs.length * per;
  const L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const g = i / N;
    const si = Math.min(segs.length - 1, Math.floor(g * segs.length));
    const t = g * segs.length - si;
    const [x, y] = B(segs[si], t);
    let [dx, dy] = dB(segs[si], t);
    const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
    let u = g + shift * Math.sin(Math.PI * g);
    u = Math.max(0, Math.min(1, u));
    const hw = w * f(u) / 2;
    L.push([x - dy * hw, y + dx * hw]);
    R.push([x + dy * hw, y - dx * hw]);
  }
  const d = [`M ${r1(L[0][0])} ${r1(L[0][1])}`];
  for (let i = 1; i < L.length; i++) d.push(`L ${r1(L[i][0])} ${r1(L[i][1])}`);
  for (let i = R.length - 1; i >= 0; i--) d.push(`L ${r1(R[i][0])} ${r1(R[i][1])}`);
  d.push("Z");
  return d.join(" ");
}

/** 角が尖ったまま膨らむ閉じた形。髪の房や影の塊に使う。
 *  bulge は各辺の膨らみ（配列で辺ごとに変えられる。負で凹む） */
export function blob(pts, { bulge = 14 } = {}) {
  const n = pts.length, d = [`M ${r1(pts[0][0])} ${r1(pts[0][1])}`];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const bg = Array.isArray(bulge) ? (bulge[i] ?? 0) : bulge;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const m = Math.hypot(dx, dy) || 1;
    d.push(`Q ${r1(mx - dy / m * bg)} ${r1(my + dx / m * bg)} ${r1(b[0])} ${r1(b[1])}`);
  }
  d.push("Z");
  return d.join(" ");
}

/** 滑らかな閉じた形（頬や瞳など、角のないもの） */
export function round(pts, { tension = 0.5 } = {}) {
  const segs = through(pts, true, tension);
  const d = [`M ${r1(segs[0][0][0])} ${r1(segs[0][0][1])}`];
  for (const s of segs) d.push(`C ${r1(s[1][0])} ${r1(s[1][1])}, ${r1(s[2][0])} ${r1(s[2][1])}, ${r1(s[3][0])} ${r1(s[3][1])}`);
  d.push("Z");
  return d.join(" ");
}

/** 中心線を返す（ハッチングの clip などに使いたいとき用） */
export { through, B, dB };
