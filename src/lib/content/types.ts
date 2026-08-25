import type { z } from "zod";
import type {
  agentFrontmatter,
  skillFrontmatter,
  guideFrontmatter,
  toolFrontmatter,
  commandFrontmatter,
  glossaryFrontmatter,
  claudeColor,
} from "./schemas";

export type ContentTypeId =
  | "agent"
  | "skill"
  | "guide"
  | "tool"
  | "command"
  | "glossary";

// Per-type accent colors (brand palette). Applied at the component level via
// getColorClasses(type) — NOT by swapping CSS --primary per route.
export type Accent =
  | "coral"
  | "turquoise"
  | "mint"
  | "amber"
  | "violet"
  | "sky";

export type ClaudeColor = z.infer<typeof claudeColor>;

// Raw (validated) frontmatter shapes, derived from the zod schemas.
export type AgentFrontmatter = z.infer<typeof agentFrontmatter>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatter>;
export type GuideFrontmatter = z.infer<typeof guideFrontmatter>;
export type ToolFrontmatter = z.infer<typeof toolFrontmatter>;
export type CommandFrontmatter = z.infer<typeof commandFrontmatter>;
export type GlossaryFrontmatter = z.infer<typeof glossaryFrontmatter>;

/**
 * The common shape every card / search hit / nav iteration relies on.
 * `body` (raw markdown) is present on detail loads but omitted from the search
 * index. `date`/`updated` are ISO strings once normalized for serialization.
 */
export interface FaqEntry {
  q: string;
  a: string;
}

export interface HowtoStep {
  name: string;
  text: string;
}

export interface SourceEntry {
  title: string;
  url: string;
  publisher: string;
}

export interface BaseContentItem {
  type: ContentTypeId;
  slug: string;
  category: string;
  title: string;
  description: string;
  color?: ClaudeColor;
  tags: string[];
  topics: string[];
  featured: boolean;
  related: string[];
  date?: string;
  updated?: string;
  href: string;
  body?: string;
  // SEO/AEO/GEO (optional; defaulted arrays so they are always present)
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  image?: string;
  summary?: string;
  keyTakeaways: string[];
  faq: FaqEntry[];
}

export interface AgentItem extends BaseContentItem {
  type: "agent";
  model: "haiku" | "sonnet" | "opus" | "inherit";
  tools?: string[];
}

export interface SkillItem extends BaseContentItem {
  type: "skill";
  allowedTools?: string[];
  userInvocable?: boolean;
  version?: string;
  resources?: { path: string; kind: string }[];
  multiFile: boolean;
}

export interface GuideItem extends BaseContentItem {
  type: "guide";
  author?: string;
  depth: "standard" | "cornerstone";
  sources: SourceEntry[];
  readingTime: number;
  wordCount: number;
  howtoSteps: HowtoStep[];
}

export interface ToolItem extends BaseContentItem {
  type: "tool";
  url: string;
  pricing: "free" | "freemium" | "paid" | "open-source" | "enterprise";
  logo?: string;
  repo?: string;
  os: ("Web" | "macOS" | "Windows" | "Linux" | "iOS" | "Android")[];
  alternativeTo: string[];
  license?: string;
  sameAs: string[];
}

export interface CommandItem extends BaseContentItem {
  type: "command";
  argumentHint?: string;
  allowedTools?: string[];
  model?: "haiku" | "sonnet" | "opus" | "inherit";
}

export interface GlossaryItem extends BaseContentItem {
  type: "glossary";
  /** The canonical term being defined (also used as the page title). */
  term: string;
}

export type ContentItem =
  | AgentItem
  | SkillItem
  | GuideItem
  | ToolItem
  | CommandItem
  | GlossaryItem;

// Lightweight record shipped in the static search index (no body).
export interface SearchRecord {
  id: string;
  type: ContentTypeId;
  title: string;
  description: string;
  accent: Accent;
  href: string;
  tags: string[];
  topics: string[];
}
