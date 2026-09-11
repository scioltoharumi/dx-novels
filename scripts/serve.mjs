/**
 * ローカル確認用の静的サーバー（依存ゼロ）。site/dist を配信する。
 *   node scripts/serve.mjs [port]     既定 8000
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DIST } from "./build.mjs";

const port = Number(process.argv[2] || 8000);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = path.normalize(path.join(DIST, p));
  if (!f.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(f);
    res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found: " + p);
  }
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}/`));
