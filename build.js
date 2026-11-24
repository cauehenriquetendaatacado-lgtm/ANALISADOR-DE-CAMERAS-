// Render build step: reads the passwords from environment variables and
// writes dist/index.html containing only their SHA-256 hashes (never the passwords).
const fs = require("fs");
const crypto = require("crypto");

const need = ["ADMIN_PASSWORD", "CAUE_PASSWORD"];
const missing = need.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing environment variable(s): " + missing.join(", ") + ". Set them in Render > Environment.");
  process.exit(1);
}

const hash = (user, pass) => crypto.createHash("sha256").update(user + ":" + pass).digest("hex");
let html = fs.readFileSync("index.html", "utf8");

const sub = (re, h) => {
  if (!re.test(html)) { console.error("Could not find the user entry in index.html"); process.exit(1); }
  html = html.replace(re, (_, a, b) => a + h + b);
};
sub(/(admin:\{hash:")[0-9a-f]{64}(")/, hash("admin", process.env.ADMIN_PASSWORD));
sub(/(caue:\{hash:")[0-9a-f]{64}(")/, hash("caue", process.env.CAUE_PASSWORD));

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);
console.log("Built dist/index.html with passwords from environment variables.");
