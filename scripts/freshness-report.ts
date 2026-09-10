/**
 * What is due for a freshness pass.
 *
 * The scheduled runner and its slash command are local-only by owner rule, so
 * the durable half of the program — which pages are in scope and which are
 * overdue — lives here, in git, and is what the runner consumes.
 *
 *   npm run freshness                 # human-readable, grouped by tier
 *   npm run freshness -- --json       # machine-readable queue for the runner
 *   npm run freshness -- --limit 25   # cap the derived queue (default 25)
 *   npm run freshness -- --check-urls # opt-in network pass for renames/sunsets
 *
 * Always exits 0. It is a reporter; the gate lives in validate-content.ts,
 * which is the only thing that runs on every build.
 */
import { loadAllByType } from "../src/lib/content/loaders";
import {
  prose,
  tierOf,
  reviewClock,
  daysOverdue,
  cadenceDays,
  PRICE,
  AS_OF,
  VAGUE_AS_OF,
  MATURITY,
  type FreshnessTier,
} from "../src/lib/content/freshness";
import type { ContentItem } from "../src/lib/content/types";

const asJson = process.argv.includes("--json");
const checkUrls = process.argv.includes("--check-urls");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg !== -1 ? Number(process.argv[limitArg + 1]) : 25;

const today = new Date();
const all: ContentItem[] = Object.values(loadAllByType()).flat();
const id = (i: ContentItem) => `${i.type}/${i.slug}`;

const inTier = (t: FreshnessTier) =>
  all
    .filter((i) => tierOf(i) === t)
    // Stalest first: stateless, deterministic, and it front-loads the pages
    // that carry no verification date at all.
    .sort((a, b) => (reviewClock(a) ?? "").localeCompare(reviewClock(b) ?? ""));

const tier1 = inTier("tier1");
const derived = [...inTier("tools"), ...inTier("tier2")].sort((a, b) =>
  (reviewClock(a) ?? "").localeCompare(reviewClock(b) ?? ""),
);

const hygiene = {
  missingAsOf: [] as string[],
  vagueAsOf: [] as string[],
  undatedMaturity: [] as string[],
};
for (const i of all) {
  if (i.type !== "tool" && i.type !== "guide") continue;
  const p = prose(i);
  if (PRICE.test(p) && !AS_OF.test(p)) hygiene.missingAsOf.push(id(i));
  else if (VAGUE_AS_OF.test(p)) hygiene.vagueAsOf.push(id(i));
  if (MATURITY.test(p) && !AS_OF.test(p)) hygiene.undatedMaturity.push(id(i));
}

async function urlIssues(): Promise<string[]> {
  const out: string[] = [];
  const tools = all.filter((i) => i.type === "tool");
  for (const t of tools) {
    for (const field of ["url", "repo"] as const) {
      const target = (t as unknown as Record<string, string>)[field];
      if (!target) continue;
      try {
        const res = await fetch(target, { method: "HEAD", redirect: "follow" });
        if (!res.ok) out.push(`${id(t)} ${field} -> HTTP ${res.status}`);
        else if (new URL(res.url).host !== new URL(target).host)
          out.push(`${id(t)} ${field} -> redirects to ${new URL(res.url).host}`);
      } catch {
        out.push(`${id(t)} ${field} -> unreachable`);
      }
    }
  }
  return out;
}

function line(i: ContentItem): string {
  const over = daysOverdue(i, today);
  const clock = reviewClock(i) ?? "never";
  const flag = over === Number.MAX_SAFE_INTEGER ? "never verified" : `${over}d over`;
  return `  ${id(i).padEnd(46)} ${clock.padEnd(12)} ${over > 0 ? flag : "ok"}`;
}

async function main() {
  const urls = checkUrls ? await urlIssues() : [];

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          generated: today.toISOString().slice(0, 10),
          tiers: {
            tier1: tier1.map(id),
            queue: derived.slice(0, LIMIT).map(id),
            derivedPool: derived.length,
          },
          hygiene,
          ...(checkUrls ? { urlIssues: urls } : {}),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`Freshness report — ${today.toISOString().slice(0, 10)}\n`);
  console.log(`Tier 1 (declared, every ${cadenceDays("tier1")}d) — ${tier1.length}`);
  tier1.forEach((i) => console.log(line(i)));
  console.log(
    `\nDerived pool — ${derived.length} (priced tools + year-titled/comparison guides)`,
  );
  console.log(`Next ${Math.min(LIMIT, derived.length)}, stalest first:`);
  derived.slice(0, LIMIT).forEach((i) => console.log(line(i)));

  console.log(`\nHygiene`);
  console.log(`  price with no as-of date:   ${hygiene.missingAsOf.length}`);
  hygiene.missingAsOf.forEach((s) => console.log(`    ${s}`));
  console.log(`  vague as-of (no month):     ${hygiene.vagueAsOf.length}`);
  hygiene.vagueAsOf.forEach((s) => console.log(`    ${s}`));
  console.log(`  undated maturity claim:     ${hygiene.undatedMaturity.length}`);
  if (checkUrls) {
    console.log(`\nURL issues — ${urls.length}`);
    urls.forEach((u) => console.log(`  ${u}`));
  }
}

main();
