/**
 * One-time (idempotent) backfill of `audience: ["developers"]` onto the
 * engineering library.
 *
 * Role paths are curated entry points. The four non-developer roles were tagged
 * by hand when they shipped, and every non-engineering category came out 100%
 * tagged — so the remaining untagged items are, without exception, engineering
 * content. That makes the rule a single line: if a file has no `audience`, it
 * belongs to `developers`. Files that already declare one are never touched, so
 * this cannot clobber a multi-role tag.
 *
 * The line is inserted textually after `topics:` (skipping any block-sequence
 * continuation lines) to keep the diff minimal and avoid gray-matter
 * re-serialization churn, matching scripts/backfill-dates.ts.
 *
 *   npx tsx scripts/backfill-audience.ts            # write
 *   npx tsx scripts/backfill-audience.ts --dry-run  # preview only
 */
import fs from "node:fs";
import path from "node:path";

const dryRun = process.argv.includes("--dry-run");
const ROOT = path.join(process.cwd(), "src", "content");

function listMarkdown(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full));
    else if (entry.name.endsWith(".md") && entry.name !== "README.md")
      out.push(full);
  }
  return out;
}

let written = 0;
let skipped = 0;
const noAnchor: string[] = [];

for (const file of listMarkdown(ROOT)) {
  const raw = fs.readFileSync(file, "utf8");
  const end = raw.indexOf("\n---", 4);
  if (!raw.startsWith("---\n") || end === -1) {
    noAnchor.push(file);
    continue;
  }
  const lines = raw.slice(4, end).split("\n");

  if (lines.some((l) => /^audience:\s*\S/.test(l))) {
    skipped++;
    continue;
  }

  const at = lines.findIndex((l) => /^topics:/.test(l));
  if (at === -1) {
    noAnchor.push(file);
    continue;
  }
  // A few files write topics as a block sequence; insert after its last item.
  let insert = at + 1;
  while (insert < lines.length && /^\s+-\s/.test(lines[insert])) insert++;
  lines.splice(insert, 0, 'audience: ["developers"]');

  if (!dryRun) {
    fs.writeFileSync(file, "---\n" + lines.join("\n") + raw.slice(end));
  }
  written++;
}

console.log(
  `${dryRun ? "[dry-run] " : ""}tagged ${written} file(s) as developers; ${skipped} already had an audience`,
);
if (noAnchor.length) {
  console.log(`no topics: anchor in ${noAnchor.length} file(s):`);
  for (const f of noAnchor) console.log("  " + path.relative(process.cwd(), f));
}
