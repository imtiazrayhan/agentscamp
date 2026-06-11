import { loaders, loadAllByType } from "./loaders";
import { contentTypes } from "./registry";
import { flatTypes } from "./paths";
import type {
  ContentItem,
  ContentTypeId,
  SearchRecord,
} from "./types";

/**
 * Server-only data access. Imports the fs-backed loaders, so never import this
 * from a client component (use ./registry + ./paths for client-safe metadata).
 */

let _cache: ContentItem[] | null = null;

export function getAllContent(): ContentItem[] {
  if (_cache) return _cache;
  const byType = loadAllByType();
  _cache = Object.values(byType).flat();
  return _cache;
}

export function getContentByType<T extends ContentItem = ContentItem>(
  type: ContentTypeId,
): T[] {
  return loaders[type]() as T[];
}

export function getItem(
  type: ContentTypeId,
  category: string,
  slug: string,
): ContentItem | undefined {
  return getContentByType(type).find(
    (i) =>
      i.slug === slug && (flatTypes.has(type) || i.category === category),
  );
}

export function getCountsByType(): Record<ContentTypeId, number> {
  const byType = loadAllByType();
  return {
    agent: byType.agent.length,
    skill: byType.skill.length,
    guide: byType.guide.length,
    tool: byType.tool.length,
    command: byType.command.length,
    glossary: byType.glossary.length,
  };
}

export function getFeatured(type?: ContentTypeId, limit = 6): ContentItem[] {
  const pool = type ? getContentByType(type) : getAllContent();
  const featured = pool.filter((i) => i.featured);
  return (featured.length ? featured : pool).slice(0, limit);
}

/** Newest items across all types (by date, falling back to undefined-last). */
export function getNewest(limit = 8): ContentItem[] {
  return [...getAllContent()]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, limit);
}

/** Categories (with counts) within a single content type. */
export function getCategories(
  type: ContentTypeId,
): { slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of getContentByType(type)) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}

/** All content tagged with a given cross-type topic slug (newest-ish order kept stable). */
export function getByTopic(topic: string): ContentItem[] {
  return getAllContent().filter((i) => i.topics.includes(topic));
}

/** Most recent ISO date across a set of items (for landing-page lastmod). */
export function latestDate(items: ContentItem[]): string | undefined {
  let max: string | undefined;
  for (const i of items) {
    const d = i.updated ?? i.date;
    if (d && (!max || d > max)) max = d;
  }
  return max;
}

/** Resolve an item's `related` slug refs into real items, both directions. */
export function getRelated(item: ContentItem): ContentItem[] {
  const all = getAllContent();
  const out = new Map<string, ContentItem>();
  for (const ref of item.related) {
    const found = all.find((i) => i.slug === ref);
    if (found && found.href !== item.href) out.set(found.href, found);
  }
  for (const other of all) {
    if (other.href !== item.href && other.related.includes(item.slug)) {
      out.set(other.href, other);
    }
  }
  return [...out.values()];
}

/** Lightweight records for the static search index (no body). */
export function buildSearchRecords(): SearchRecord[] {
  return getAllContent().map((i) => ({
    id: i.href,
    type: i.type,
    title: i.title,
    description: i.description,
    accent: contentTypes[i.type].accent,
    href: i.href,
    tags: i.tags,
    topics: i.topics,
  }));
}

export { contentTypes, contentTypeList, topics } from "./registry";
