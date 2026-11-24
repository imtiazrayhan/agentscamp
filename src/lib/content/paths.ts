import type { ContentTypeId } from "./types";

export const basePaths: Record<ContentTypeId, string> = {
  agent: "/agents",
  skill: "/skills",
  guide: "/guides",
  tool: "/tools",
  command: "/commands",
  glossary: "/glossary",
};

/** Types with a flat /[base]/[slug] URL space (no category segment). */
export const flatTypes: ReadonlySet<ContentTypeId> = new Set([
  "tool",
  "glossary",
]);

/**
 * The single URL constructor. Tools and glossary terms use a flat
 * /[base]/[slug] space; every other type uses /[base]/[category]/[slug].
 */
export function hrefFor(
  type: ContentTypeId,
  category: string,
  slug: string,
): string {
  if (flatTypes.has(type)) return `${basePaths[type]}/${slug}`;
  return `${basePaths[type]}/${category}/${slug}`;
}

/** Listing page `n` of a type: page 1 is the bare listing, the rest /[base]/page/[n]. */
export function listingPageHref(basePath: string, n: number): string {
  return n <= 1 ? basePath : `${basePath}/page/${n}`;
}
