/**
 * Build-time content gate. Runs the REAL loaders (which zod-validate every
 * frontmatter), then checks cross-cutting invariants. Exits non-zero on failure
 * so `npm run build` fails loudly on bad content.
 */
import {
  loadAgents,
  loadSkills,
  loadGuides,
  loadTools,
  loadCommands,
} from "../src/lib/content/loaders";
import type { ContentItem } from "../src/lib/content/types";

let errors = 0;
const err = (m: string) => {
  console.error("  ✗ " + m);
  errors++;
};

function run() {
  const groups: Record<string, ContentItem[]> = {};
  try {
    groups.agent = loadAgents();
    groups.skill = loadSkills();
    groups.guide = loadGuides();
    groups.tool = loadTools();
    groups.command = loadCommands();
  } catch (e) {
    err((e as Error).message);
    return;
  }

  const all = Object.values(groups).flat();
  const slugs = new Map<string, string>();

  for (const [type, items] of Object.entries(groups)) {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.slug)) err(`duplicate ${type} slug: ${item.slug}`);
      seen.add(item.slug);
      slugs.set(item.slug, item.href);
      if (!item.href || !item.href.startsWith("/"))
        err(`bad href for ${type}/${item.slug}: ${item.href}`);
    }
    console.log(`  ✓ ${type}: ${items.length}`);
  }

  // related refs are advisory (warn only)
  for (const item of all) {
    for (const ref of item.related) {
      if (!slugs.has(ref))
        console.warn(`  ! ${item.type}/${item.slug} -> unknown related: ${ref}`);
    }
  }

  console.log(`  total: ${all.length}`);
}

console.log("Validating content...");
run();
if (errors > 0) {
  console.error(`\nContent validation FAILED with ${errors} error(s).`);
  process.exit(1);
}
console.log("Content valid.\n");
