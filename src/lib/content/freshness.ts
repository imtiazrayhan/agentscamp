import type { ContentItem } from "./types";

/**
 * Which pages go stale, and when they are due.
 *
 * Tier 1 is NOT derivable: all eight money pages have a year in the title, and
 * so do 56 other guides. It is an editorial judgement and is declared in
 * frontmatter. Everything else IS derivable and is computed here, so no
 * derivable fact is ever written to disk where it can drift.
 *
 * Shared by scripts/validate-content.ts (the build gate) and
 * scripts/freshness-report.ts (the queue) so the two cannot disagree.
 */

export type FreshnessTier = "tier1" | "tier2" | "tools" | "none";

/**
 * All reader-visible prose, with code stripped. Two details are load-bearing:
 * prices live in frontmatter FAQ answers as well as the body (browserbase
 * states its whole price list there), and stripping code is what keeps
 * pgvector's `$1` SQL placeholder from reading as a price.
 */
export function prose(item: ContentItem): string {
  return [
    item.body ?? "",
    item.summary ?? "",
    item.description,
    ...item.keyTakeaways,
    ...item.faq.flatMap((f) => [f.q, f.a]),
  ]
    .join("\n")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
}

export const PRICE = /\$[0-9]/;

/**
 * Both house conventions: tools stamp "as of September 2026", guides stamp
 * "Verified July 1, 2026". Vague forms ("as of early 2026") match too and are
 * reported separately.
 */
export const AS_OF =
  /(as of|verified|last reviewed)[^.\n]{0,24}\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|early|mid|late|q[1-4])[a-z]*[^.\n]{0,14}\b20\d\d/i;

/** An as-of date with no month — a queue item, not a defect. */
export const VAGUE_AS_OF = /(as of|verified)\s+(early|mid|late|q[1-4])[^.\n]{0,6}20\d\d/i;

/** Product-maturity words whose truth expires. */
export const MATURITY = /\b(beta|research preview|public preview|early access|waitlist)\b/i;

export function tierOf(item: ContentItem): FreshnessTier {
  if (item.freshness === "exempt") return "none";
  if (item.freshness === "tier1") return "tier1";
  if (item.type === "guide") {
    if (/\b20\d\d\b/.test(item.title) || item.category === "comparisons")
      return "tier2";
    return "none";
  }
  // A tool is perishable when it makes a price claim, not merely because its
  // `pricing` enum says paid — 48 paid tools quote no figure at all.
  if (item.type === "tool" && PRICE.test(prose(item))) return "tools";
  return "none";
}

/** Days between refreshes for each tier. */
export function cadenceDays(tier: FreshnessTier): number {
  if (tier === "tier1") return 30;
  if (tier === "tier2" || tier === "tools") return 133; // the 110-item pool at 25/run
  return Infinity;
}

/**
 * When this page was last verified. Falls back through the weaker signals.
 *
 * Deliberately not backfilled from in-prose as-of dates: of the 74 items that
 * carry a parseable one, 72 already agree with `updated ?? date`, and the two
 * that differ cite a SOURCE's date rather than a verification date, so writing
 * them into `reviewed` would report those pages as staler than they are.
 * `reviewed` is set going forward, by the refresh run itself.
 */
export function reviewClock(item: ContentItem): string | undefined {
  return item.reviewed ?? item.updated ?? item.date;
}

export function daysOverdue(item: ContentItem, today: Date): number {
  const tier = tierOf(item);
  const cadence = cadenceDays(tier);
  if (!Number.isFinite(cadence)) return 0;
  const clock = reviewClock(item);
  if (!clock) return Number.MAX_SAFE_INTEGER; // never verified — head of the queue
  const age = Math.floor(
    (today.getTime() - new Date(clock).getTime()) / 86_400_000,
  );
  return Math.max(0, age - cadence);
}
