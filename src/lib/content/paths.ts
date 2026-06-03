import type { ContentTypeId } from "./types";

export const basePaths: Record<ContentTypeId, string> = {
  agent: "/agents",
  skill: "/skills",
  guide: "/guides",
  tool: "/tools",
  command: "/commands",
};

/**
 * The single URL constructor. Tools use a flat /tools/[slug] space (tag-faceted,
 * DB-bound later); every other type uses /[base]/[category]/[slug].
 */
export function hrefFor(
  type: ContentTypeId,
  category: string,
  slug: string,
): string {
  if (type === "tool") return `${basePaths.tool}/${slug}`;
  return `${basePaths[type]}/${category}/${slug}`;
}
