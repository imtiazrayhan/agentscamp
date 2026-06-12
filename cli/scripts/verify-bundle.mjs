// Prepublish gate: refuse to publish a tarball whose bundled content or build
// output is missing or inconsistent. Runs after cli:build in prepublishOnly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(msg) {
  console.error(`verify-bundle: ${msg}`);
  process.exit(1);
}

const manifestPath = path.join(root, "content", "manifest.json");
if (!fs.existsSync(manifestPath)) {
  fail("content/manifest.json missing — run `npm run cli:build` from the repo root");
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (e) {
  fail(`content/manifest.json unparsable: ${e.message}`);
}

const { counts, items } = manifest;
let total = 0;
for (const [plural, count] of Object.entries(counts)) {
  if (!Number.isInteger(count) || count <= 0) fail(`counts.${plural} is ${count}`);
  const dir = path.join(root, "content", plural);
  const onDisk = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).length
    : 0;
  if (onDisk !== count) fail(`${plural}: manifest says ${count}, found ${onDisk} .md files on disk`);
  total += count;
}
if (!Array.isArray(items) || items.length !== total) {
  fail(`items length ${items?.length} != sum of counts ${total}`);
}
for (const item of items) {
  if (!fs.existsSync(path.join(root, "content", item.file))) {
    fail(`missing content file ${item.file}`);
  }
}

const distPath = path.join(root, "dist", "index.js");
if (!fs.existsSync(distPath)) fail("dist/index.js missing — run the build first");
if (!fs.readFileSync(distPath, "utf8").startsWith("#!")) fail("dist/index.js missing shebang");

console.log(`verify-bundle: OK (${items.length} items, dist present)`);
