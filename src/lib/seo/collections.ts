import { getContentByType, getByTopic } from "@/lib/content";
import { contentTypes, topicBySlug } from "@/lib/content/registry";
import { titleCaseLabel } from "@/lib/format";
import type { Crumb } from "./jsonld";
import type {
  ContentItem,
  ContentTypeId,
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
    `A curated collection of ${items.length} ${label.toLowerCase()} ${def.label.toLowerCase()} for building with AI coding agents.`;
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
    description: `AI coding tools in the ${label.toLowerCase()} category — ${items.length} curated for building with AI coding agents.`,
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
    description: `${label} AI coding tools, editors, agents, and MCP servers — ${items.length} curated.`,
    items,
    crumbs: [{ label: "Home", href: "/" }, toolsCrumb, { label }],
    noindex: items.length < MIN_INDEXABLE,
  };
}

export function toolAlternativesCollection(slug: string): Collection | null {
  const all = tools();
  const tool = all.find((t) => t.slug === slug);
  if (!tool) return null;
  const seen = new Set<string>([slug]);
  const alts: ToolItem[] = [];
  for (const t of all) {
    if (seen.has(t.slug)) continue;
    const related =
      t.category === tool.category ||
      t.alternativeTo.includes(slug) ||
      tool.alternativeTo.includes(t.slug);
    if (related) {
      alts.push(t);
      seen.add(t.slug);
    }
  }
  return {
    title: `${tool.title} Alternatives`,
    description: `${alts.length} alternatives to ${tool.title} — comparable AI coding tools for building with AI agents.`,
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
