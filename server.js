const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8878);
const HOST = process.env.HOST || "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8"
};

function resolveRequest(url) {
  const pathname = decodeURIComponent(url.split("?")[0]);
  const route = pathname === "/" ? "/index.html" : pathname;
  const file = path.normalize(path.join(ROOT, route));
  if (!file.startsWith(ROOT)) return null;
  return file;
}

const server = http.createServer((req, res) => {
  const file = resolveRequest(req.url || "/");
  if (!file) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Physics lab book: http://${HOST}:${PORT}/`);
});
