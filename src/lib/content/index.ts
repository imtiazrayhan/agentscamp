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

const contentId = (item: ContentItem) => `${item.type}:${item.slug}`;

/**
 * Resolve typed related refs in both directions, then rank the candidates.
 * Direct editorial choices beat backlinks; shared taxonomy breaks ties. The
 * type-aware fill prevents a large guide cluster from crowding every other
 * useful resource type out of the module.
 */
export function getRelated(item: ContentItem, limit = 8): ContentItem[] {
  const all = getAllContent();
  const byId = new Map(all.map((i) => [contentId(i), i]));
  type RelatedCandidate = {
    item: ContentItem;
    direct: boolean;
    reverse: boolean;
  };
  const candidates = new Map<string, RelatedCandidate>();

  for (const ref of item.related) {
    const found = byId.get(ref);
    if (found && found.href !== item.href) {
      candidates.set(found.href, { item: found, direct: true, reverse: false });
    }
  }

  const id = contentId(item);
  for (const other of all) {
    if (other.href !== item.href && other.related.includes(id)) {
      const current = candidates.get(other.href);
      candidates.set(other.href, {
        item: other,
        direct: current?.direct ?? false,
        reverse: true,
      });
    }
  }

  const score = (candidate: RelatedCandidate) => {
    const sharedTopics = candidate.item.topics.filter((t) =>
      item.topics.includes(t),
    ).length;
    const sharedTags = candidate.item.tags.filter((t) =>
      item.tags.includes(t),
    ).length;
    return (
      (candidate.direct ? 100 : 0) +
      (candidate.reverse ? 40 : 0) +
      sharedTopics * 10 +
      sharedTags * 3 +
      (candidate.item.type !== item.type ? 2 : 0)
    );
  };

  const ranked = [...candidates.values()].sort(
    (a, b) =>
      score(b) - score(a) ||
      a.item.title.localeCompare(b.item.title),
  );
  if (ranked.length <= limit) return ranked.map((c) => c.item);

  const selected: typeof ranked = [];
  const selectedHrefs = new Set<string>();
  const perType = new Map<ContentTypeId, number>();
  for (const candidate of ranked) {
    const count = perType.get(candidate.item.type) ?? 0;
    if (count >= 3) continue;
    selected.push(candidate);
    selectedHrefs.add(candidate.item.href);
    perType.set(candidate.item.type, count + 1);
    if (selected.length === limit) break;
  }
  for (const candidate of ranked) {
    if (selected.length === limit) break;
    if (!selectedHrefs.has(candidate.item.href)) selected.push(candidate);
  }
  return selected.map((c) => c.item);
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
