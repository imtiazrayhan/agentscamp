import type { MetadataRoute } from "next";
import {
  getAllContent,
  getContentByType,
  getCategories,
  getByTopic,
  latestDate,
  contentTypeList,
  topics,
} from "@/lib/content";
import { toolAlternativesCollection } from "@/lib/seo/collections";
import { site } from "@/lib/site";

/**
 * Indexable HTML pages only. lastModified is derived from real content dates
 * (updated ?? date) — never build-time `now`, which would churn every deploy and
 * train crawlers to ignore it. The Markdown twins (/raw, /*.md) and llms.txt are
 * intentionally excluded (noindex / non-canonical).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, lastModified?: string) =>
    entries.push({
      url: `${site.url}${path}`,
      ...(lastModified ? { lastModified } : {}),
    });

  const all = getAllContent();
  add("", latestDate(all));
  add("/how-to-use");
  add("/topics", latestDate(all));

  // Type listing pages.
  for (const def of contentTypeList) {
    add(def.basePath, latestDate(getContentByType(def.id)));
  }

  // Category landings for the categorized types.
  for (const def of contentTypeList) {
    if (def.id === "tool") continue;
    for (const c of getCategories(def.id)) {
      const items = getContentByType(def.id).filter(
        (i) => i.category === c.slug,
      );
      add(`${def.basePath}/${c.slug}`, latestDate(items));
    }
  }

  // Cross-type topic landings.
  for (const t of topics) {
    const items = getByTopic(t.slug);
    if (items.length) add(`/topics/${t.slug}`, latestDate(items));
  }

  // Tool facets (only indexable ones, >= 2 items).
  for (const c of getCategories("tool")) {
    if (c.count < 2) continue;
    const items = getContentByType("tool").filter((i) => i.category === c.slug);
    add(`/tools/category/${c.slug}`, latestDate(items));
  }
  const byPricing = new Map<string, ReturnType<typeof getContentByType>>();
  for (const t of getContentByType("tool")) {
    const arr = byPricing.get((t as { pricing: string }).pricing) ?? [];
    arr.push(t);
    byPricing.set((t as { pricing: string }).pricing, arr);
  }
  for (const [pricing, items] of byPricing) {
    if (items.length >= 2) add(`/tools/pricing/${pricing}`, latestDate(items));
  }

  // Indexable tool "alternatives" pages (>= 2 alternatives).
  for (const t of getContentByType("tool")) {
    const c = toolAlternativesCollection(t.slug);
    if (c && !c.noindex) add(`${t.href}/alternatives`, latestDate(c.items));
  }

  // Content detail pages.
  for (const i of all) add(i.href, i.updated ?? i.date);

  return entries;
}
