const http = require("http");
const fs = require("fs");
const path = require("path");
const root = __dirname;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
};
const PORT = 8799;
http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(root, p);
    if (!f.startsWith(root)) { res.writeHead(403); res.end("no"); return; }
    fs.readFile(f, (e, d) => {
      if (e) { res.writeHead(404); res.end("not found"); return; }
      res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(d);
    });
  })
  .listen(PORT, () => console.log("MathsZone lab serving " + root + " on http://localhost:" + PORT));
