import { getContentByType, getByTopic } from "@/lib/content";
import { contentTypes, topicBySlug } from "@/lib/content/registry";
import { titleCaseLabel } from "@/lib/format";
import type { Crumb } from "./jsonld";
import type {
  ContentItem,
  ContentTypeId,
  GuideItem,
  ToolItem,
} from "@/lib/content/types";

/** Facets with fewer than this many items are generated but kept out of the index. */
const MIN_INDEXABLE = 2;

/**
 * Templated copy for the category / topic landing pages, so a new category needs
 * ZERO hand-written copy (it just appears). Optional per-collection overrides can
 * be added here later without touching the route files.
 */

const CATEGORY_OVERRIDES: Record<string, string> = {
  // `${type}/${category}`: "custom intro description"
};

const TOPIC_OVERRIDES: Record<string, string> = {
  // `${topicSlug}`: "custom intro description"
};

export interface Collection {
  title: string;
  description: string;
  items: ContentItem[];
  crumbs: Crumb[];
  noindex?: boolean;
}

const tools = () => getContentByType<ToolItem>("tool");

export function categoryCollection(
  type: ContentTypeId,
  category: string,
): Collection | null {
  const def = contentTypes[type];
  const items = getContentByType(type).filter((i) => i.category === category);
  if (!items.length) return null;
  const label = titleCaseLabel(category);
  const title = `${label} ${def.label}`;
  const description =
    CATEGORY_OVERRIDES[`${type}/${category}`] ??
    `Explore ${items.length} curated ${label.toLowerCase()} ${def.label.toLowerCase()} for building with AI coding agents — what each one does, when to use it, and how to add it to your workflow.`;
  return {
    title,
    description,
    items,
    crumbs: [
      { label: "Home", href: "/" },
      { label: def.label, href: def.basePath },
      { label },
    ],
  };
}

export function topicCollection(slug: string): Collection | null {
  const topic = topicBySlug.get(slug);
  if (!topic) return null;
  const items = getByTopic(slug);
  if (!items.length) return null;
  const description =
    TOPIC_OVERRIDES[slug] ??
    `Agents, skills, guides, tools, and commands for ${topic.label.toLowerCase()} — ${items.length} curated resources for building with AI coding agents.`;
  return {
    title: `${topic.label} — AI Agents, Skills & Tools`,
    description,
    items,
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Topics", href: "/topics" },
      { label: topic.label },
    ],
  };
}

// --- tool facets ---

const toolsCrumb: Crumb = { label: "Tools", href: "/tools" };

export function toolCategoryCollection(category: string): Collection | null {
  const items = tools().filter((t) => t.category === category);
  if (!items.length) return null;
  const label = titleCaseLabel(category);
  return {
    title: `${label} Tools`,
    description: `${items.length} curated ${label.toLowerCase()} tools for AI coding — compare what each one does, how it's priced, and where it fits in an AI-assisted development stack.`,
    items,
    crumbs: [{ label: "Home", href: "/" }, toolsCrumb, { label }],
    noindex: items.length < MIN_INDEXABLE,
  };
}

export function toolPricingCollection(pricing: string): Collection | null {
  const items = tools().filter((t) => t.pricing === pricing);
  if (!items.length) return null;
  const label = titleCaseLabel(pricing);
  return {
    title: `${label} AI Coding Tools`,
    description: `${label} AI coding tools — ${items.length} curated editors, agents, CLIs, and MCP servers with notes on what each does best and how it fits your development stack.`,
    items,
    crumbs: [{ label: "Home", href: "/" }, toolsCrumb, { label }],
    noindex: items.length < MIN_INDEXABLE,
  };
}

export function toolAlternativesCollection(
  slug: string,
): (Collection & { tool: ToolItem; items: ToolItem[] }) | null {
  const all = tools();
  const tool = all.find((t) => t.slug === slug);
  if (!tool) return null;
  const seen = new Set<string>([slug]);
  const alts: ToolItem[] = [];
  for (const t of all) {
    if (seen.has(t.slug)) continue;
    const related =
      t.alternativeTo.includes(slug) ||
      tool.alternativeTo.includes(t.slug);
    if (related) {
      alts.push(t);
      seen.add(t.slug);
    }
  }
  // Direct alternatives (listed in tool.alternativeTo) before reverse matches;
  // same category first within each. Stable sort keeps loader order for ties.
  const rank = (t: ToolItem) =>
    (tool.alternativeTo.includes(t.slug) ? 0 : 2) +
    (t.category === tool.category ? 0 : 1);
  alts.sort((a, b) => rank(a) - rank(b));
  return {
    tool,
    title: `${tool.title} Alternatives`,
    description: `${alts.length} alternatives to ${tool.title} — free and paid AI coding tools covering similar jobs, with pricing and standout strengths.`,
    items: alts,
    crumbs: [
      { label: "Home", href: "/" },
      toolsCrumb,
      { label: tool.title, href: tool.href },
      { label: "Alternatives" },
    ],
    noindex: alts.length < MIN_INDEXABLE,
  };
}

/**
 * Comparison guides that cover both the tool and an alternative, keyed by the
 * alternative's slug, tightest head-to-head first. Kept separate from
 * toolAlternativesCollection so the sitemap and tool detail pages never load
 * every guide just to count alternatives.
 */
export function comparisonGuidesByAlt(
  tool: ToolItem,
  alts: ToolItem[],
): Map<string, GuideItem[]> {
  const toolRefs = (g: GuideItem) =>
    g.related.filter((r) => r.startsWith("tool:")).length;
  const guides = getContentByType<GuideItem>("guide").filter(
    (g) =>
      g.tags.includes("comparison") && g.related.includes(`tool:${tool.slug}`),
  );
  const byAlt = new Map<string, GuideItem[]>();
  for (const alt of alts) {
    // Fewest tools compared first (pairwise before roundups), then guides
    // whose slug names this alternative.
    const rank = (g: GuideItem) =>
      toolRefs(g) * 2 + (g.slug.includes(alt.slug) ? 0 : 1);
    const matches = guides
      .filter((g) => g.related.includes(`tool:${alt.slug}`))
      .sort((a, b) => rank(a) - rank(b));
    if (matches.length) byAlt.set(alt.slug, matches);
  }
  return byAlt;
}
