import type { Metadata } from "next";
import Link from "next/link";
import { getContentByType, latestDate } from "@/lib/content";
import { contentTypes } from "@/lib/content/registry";
import { collectionGraph, jsonLdHtml } from "@/lib/seo/jsonld";
import {
  LISTING_PAGE_SIZE,
  listingPageCount,
  listingSeo,
} from "@/lib/seo/listing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listingPageHref } from "@/lib/content/paths";
import { titleCaseLabel } from "@/lib/format";
import { Breadcrumbs } from "./Breadcrumbs";
import { ListingView, type SortKey } from "./ListingView";
import { toCard } from "@/lib/content/card";
import { FaqSection } from "./FaqSection";
import type { ContentTypeId, ToolItem } from "@/lib/content/types";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageHeader } from "./PageHeader";

// Category facets become indexable (and so worth crawl-linking) at >=2 items,
// matching MIN_INDEXABLE in lib/seo/collections.
const MIN_LINKABLE = 2;

/**
 * Guides are a feed, so they lead with the newest. The catalog types were
 * previously rendered in `fs.readdirSync` order — effectively arbitrary — so
 * they default to A–Z, which a returning visitor can predict.
 */
const SORTS: Record<ContentTypeId, { options: SortKey[]; default: SortKey }> = {
  guide: { options: ["newest", "title", "reading-time"], default: "newest" },
  tool: { options: ["title", "newest"], default: "title" },
  agent: { options: ["title", "newest"], default: "title" },
  skill: { options: ["title", "newest"], default: "title" },
  command: { options: ["title", "newest"], default: "title" },
  glossary: { options: ["title"], default: "title" },
};

function sortForListing<T extends { title: string; date?: string; updated?: string }>(
  items: T[],
  sort: SortKey,
): T[] {
  if (sort === "title") {
    return [...items].sort((a, b) => a.title.localeCompare(b.title));
  }
  return [...items].sort(
    (a, b) =>
      (b.updated ?? b.date ?? "").localeCompare(a.updated ?? a.date ?? "") ||
      a.title.localeCompare(b.title),
  );
}

const SORT_PHRASE: Record<SortKey, string> = {
  newest: "newest first",
  title: "A–Z",
  "reading-time": "quickest read first",
};

/** Static params for /[base]/page/[n] — pages 2..n (page 1 is the listing). */
export function listingPageParams(type: ContentTypeId): { n: string }[] {
  const pages = listingPageCount(getContentByType(type).length);
  return Array.from({ length: pages - 1 }, (_, i) => ({ n: String(i + 2) }));
}

/** Metadata for listing page `page` (>= 2): self-canonical, never the page-1 copy. */
export function listingPageMetadata(type: ContentTypeId, page: number): Metadata {
  const def = contentTypes[type];
  const count = getContentByType(type).length;
  const pages = listingPageCount(count);
  return buildPageMetadata({
    title: `${listingSeo[type].seoTitle}, Page ${page}`,
    description: `Page ${page} of ${pages} of AgentsCamp's ${count} ${def.label.toLowerCase()}, ${SORT_PHRASE[SORTS[type].default]}. ${def.description}`,
    path: listingPageHref(def.basePath, page),
    ...(type === "guide" ? { feed: "/guides/feed.xml" } : {}),
  });
}

export function TypeListing({
  type,
  page = 1,
}: {
  type: ContentTypeId;
  /** 1 = the listing itself; >= 2 renders /[base]/page/[n]. */
  page?: number;
}) {
  const def = contentTypes[type];
  const seo = listingSeo[type];
  const sortConfig = SORTS[type];
  const first = page === 1;
  // Sort ONCE, then feed the same order to both collectionGraph and the grid —
  // the ItemList positions previously described the raw loader order while the
  // page rendered something else.
  const all = sortForListing(getContentByType(type), sortConfig.default);
  // Project to the card DTO: these cross into a client component, so anything
  // left on them (faq, sources, howtoSteps, summary…) ships to every visitor.
  const items = all.map(toCard);

  // Real <a> links to indexable category landing pages — internal-linking /
  // crawl depth the client-side filter toggles can't provide.
  const counts = new Map<string, number>();
  for (const it of all) counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
  const categoryLinks = [...counts.entries()]
    .filter(([, n]) => n >= MIN_LINKABLE)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([cat, n]) => ({
      label: titleCaseLabel(cat),
      count: n,
      href: type === "tool" ? `/tools/category/${cat}` : `${def.basePath}/${cat}`,
    }));
  const pricingCounts = new Map<string, number>();
  if (type === "tool") {
    for (const tool of all as ToolItem[]) {
      pricingCounts.set(tool.pricing, (pricingCounts.get(tool.pricing) ?? 0) + 1);
    }
  }
  const pricingLinks = [...pricingCounts.entries()]
    .filter(([, n]) => n >= MIN_LINKABLE)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([pricing, n]) => ({
      label: titleCaseLabel(pricing),
      count: n,
      href: `/tools/pricing/${pricing}`,
    }));

  // Page 1 describes the whole list (and carries the FAQ); page n describes
  // only the cards it renders.
  const slice = first
    ? all
    : all.slice((page - 1) * LISTING_PAGE_SIZE, page * LISTING_PAGE_SIZE);
  const crumbs = first
    ? [{ label: "Home", href: "/" }, { label: def.label }]
    : [
        { label: "Home", href: "/" },
        { label: def.label, href: def.basePath },
        { label: `Page ${page}` },
      ];
  const graph = collectionGraph({
    path: listingPageHref(def.basePath, page),
    name: first ? seo.seoTitle : `${seo.seoTitle}, Page ${page}`,
    description: def.description,
    items: slice,
    crumbs,
    lastModified: latestDate(slice),
    ...(first ? { faq: seo.faq } : {}),
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(graph) }}
      />
      <Breadcrumbs items={crumbs} />
      <PageHeader
        title={first ? def.label : `${def.label}, page ${page}`}
        lead={def.description}
      >
        {/* Answer-engine explainer copy — kept, but set apart so the header
            stops reading as two stacked grey paragraphs. Page 1 only. */}
        {first && (
          <p className="measure mt-4 text-base leading-relaxed text-muted-foreground">
            {seo.intro}
          </p>
        )}
        {first && seo.startHere && (
          <p className="mt-4 text-sm">
            New here? Start with{" "}
            <Link
              href={seo.startHere.href}
              className="font-medium text-primary hover:underline"
            >
              {seo.startHere.label}
            </Link>
          </p>
        )}
        {categoryLinks.length > 1 && (
          <nav className="mt-6" aria-label={`Browse ${def.label} by category`}>
            <Eyebrow as="h2" className="mb-3">
              Browse by category
            </Eyebrow>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {categoryLinks.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="inline-flex items-baseline gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="underline-offset-4 hover:underline">
                      {c.label}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {c.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {pricingLinks.length > 1 && (
          <nav className="mt-4" aria-label="Browse Tools by pricing">
            <Eyebrow as="h2" className="mb-3">
              Browse by pricing
            </Eyebrow>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {pricingLinks.map((pricing) => (
                <li key={pricing.href}>
                  <Link
                    href={pricing.href}
                    className="inline-flex items-baseline gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="underline-offset-4 hover:underline">
                      {pricing.label}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {pricing.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHeader>
      <ListingView
        items={items}
        pageSize={LISTING_PAGE_SIZE}
        sorts={sortConfig.options}
        defaultSort={sortConfig.default}
        initialPage={page}
        basePath={def.basePath}
      />
      {first && <FaqSection faq={seo.faq} />}
    </div>
  );
}
