/**
 * One-time (idempotent) backfill of `date:` into content frontmatter.
 *
 * Build-time git-mtime is unreliable on Vercel (shallow clone -> wrong/empty
 * dates), so instead we resolve each file's FIRST-commit date from full local
 * history once and commit it. After this, `date` is author-supplied for new
 * files (enforced by validate-content.ts). `updated` stays author-maintained.
 *
 * The date line is inserted textually (right after `description:`) to keep the
 * diff minimal and avoid gray-matter re-serialization churn. Files that already
 * have a `date:` are left untouched.
 *
 *   npx tsx scripts/backfill-dates.ts            # write
 *   npx tsx scripts/backfill-dates.ts --dry-run  # preview only
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

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

/** Oldest commit (author) date for a file, ISO yyyy-mm-dd, or undefined. */
function firstCommitDate(file: string): string | undefined {
  const tries = [
    ["log", "--diff-filter=A", "--follow", "--format=%aI", "--", file],
    ["log", "--format=%aI", "--", file],
  ];
  for (const args of tries) {
    try {
      const out = execFileSync("git", args, { encoding: "utf8" }).trim();
      if (!out) continue;
      const lines = out.split("\n").filter(Boolean);
      const oldest = lines[lines.length - 1];
      if (oldest) return oldest.slice(0, 10);
    } catch {
      /* not a repo / no history — fall through */
    }
  }
  return undefined;
}

function hasDate(frontmatter: string): boolean {
  return /^date:\s*\S/m.test(frontmatter);
}

let written = 0;
let skipped = 0;
let missing = 0;

for (const file of listMarkdown(ROOT)) {
  const raw = fs.readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---/.exec(raw);
  if (!m) {
    console.warn(`  ! no frontmatter: ${path.relative(process.cwd(), file)}`);
    continue;
  }
  if (hasDate(m[1])) {
    skipped++;
    continue;
  }
  const date = firstCommitDate(file);
  if (!date) {
    missing++;
    console.warn(`  ! no git date: ${path.relative(process.cwd(), file)}`);
    continue;
  }

  const fm = m[1];
  const dateLine = `date: ${date}`;
  let newFm: string;
  if (/^description:.*$/m.test(fm)) {
    newFm = fm.replace(/^(description:.*)$/m, `$1\n${dateLine}`);
  } else {
    newFm = `${fm}\n${dateLine}`;
  }
  const next = raw.replace(m[1], newFm);

  if (dryRun) {
    console.log(`  + ${path.relative(process.cwd(), file)} -> ${date}`);
  } else {
    fs.writeFileSync(file, next);
  }
  written++;
}

console.log(
  `\n${dryRun ? "[dry-run] " : ""}backfill: ${written} dated, ${skipped} already had a date, ${missing} unresolved.`,
);
