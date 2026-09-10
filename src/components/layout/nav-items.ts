import { contentTypes, audiences, type ContentTypeDef } from "@/lib/content/registry";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  count?: number;
  children?: NavItem[];
}

/**
 * The site's navigation IA, built from the registry so nav, mobile nav and
 * footer can never drift from the content types and role paths that exist.
 *
 * Editorial types (guides, tools, glossary — 492 of 748 items) are top level.
 * The three installables are grouped under one Claude Code menu: they are a
 * sub-product, not peers of Guides, and flattening them told a marketer that
 * "Commands" mattered as much as "Guides".
 */
export function buildNav(
  counts: Record<string, number>,
  roleCounts: Record<string, number>,
): NavItem[] {
  const typeItem = (def: ContentTypeDef): NavItem => ({
    label: def.label,
    href: def.basePath,
    description: def.tagline,
    count: counts[def.id],
  });

  return [
    {
      label: "Start here",
      href: "/for",
      children: audiences
        .filter((a) => (roleCounts[a.slug] ?? 0) > 0)
        .map((a) => ({
          label: a.label,
          href: `/for/${a.slug}`,
          count: roleCounts[a.slug],
        })),
    },
    typeItem(contentTypes.guide),
    typeItem(contentTypes.tool),
    typeItem(contentTypes.glossary),
    {
      label: "For Claude Code",
      href: "/how-to-use",
      children: [
        typeItem(contentTypes.agent),
        typeItem(contentTypes.skill),
        typeItem(contentTypes.command),
        { label: "How to use", href: "/how-to-use", description: "Install and use them" },
      ],
    },
    { label: "Topics", href: "/topics" },
  ];
}
