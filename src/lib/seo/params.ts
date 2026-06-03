import {
  getContentByType,
  getCategories,
  getByTopic,
  topics,
} from "@/lib/content";
import type { ContentTypeId, ToolItem } from "@/lib/content/types";

/**
 * One source of truth for static-param shapes, shared by each `page.tsx` and its
 * colocated `opengraph-image.tsx` so they can never drift (a mismatch silently
 * drops per-item OG images at build time).
 */

/** {category, slug} for the categorized detail routes (agents/skills/guides/commands). */
export function categorizedParams(type: ContentTypeId) {
  return getContentByType(type).map((i) => ({
    category: i.category,
    slug: i.slug,
  }));
}

/** {slug} for the flat tool detail route. */
export function toolParams() {
  return getContentByType("tool").map((i) => ({ slug: i.slug }));
}

/** {category} for the category landing routes. */
export function categoryParams(type: ContentTypeId) {
  return getCategories(type).map((c) => ({ category: c.slug }));
}

/** {slug} for the cross-type topic landing routes (only topics with content). */
export function topicParams() {
  return topics
    .filter((t) => getByTopic(t.slug).length > 0)
    .map((t) => ({ slug: t.slug }));
}

/** {category} for the tool category facet. */
export function toolCategoryParams() {
  return getCategories("tool").map((c) => ({ category: c.slug }));
}

/** {pricing} for the tool pricing facet (only pricings actually present). */
export function toolPricingParams() {
  const present = new Set(
    getContentByType<ToolItem>("tool").map((t) => t.pricing),
  );
  return [...present].map((pricing) => ({ pricing }));
}
