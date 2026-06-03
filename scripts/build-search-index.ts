/**
 * Emits public/search-index.json from the REAL loaders (no parallel parser ->
 * no drift). Lightweight display records only (no body). The client builds a
 * FlexSearch index from these at runtime on /search and in the command palette.
 */
import fs from "node:fs";
import path from "node:path";
import { buildSearchRecords } from "../src/lib/content/index";

const records = buildSearchRecords();
const outDir = path.join(process.cwd(), "public");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "search-index.json");
fs.writeFileSync(outFile, JSON.stringify(records));
console.log(`Wrote ${records.length} records -> ${path.relative(process.cwd(), outFile)}`);
