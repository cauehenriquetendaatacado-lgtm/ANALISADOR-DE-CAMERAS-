// Servidor estático mínimo: serve dist/index.html (gerado pelo build.js) na porta do Render.
const http = require("http");
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "dist", "index.html");
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); return res.end("dist/index.html não encontrado. O build.js rodou?"); }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(port, () => console.log("Camera Health no ar na porta " + port));
