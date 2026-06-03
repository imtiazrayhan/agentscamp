import type { z } from "zod";
import type {
  agentFrontmatter,
  skillFrontmatter,
  guideFrontmatter,
  toolFrontmatter,
  commandFrontmatter,
  claudeColor,
} from "./schemas";

export type ContentTypeId = "agent" | "skill" | "guide" | "tool" | "command";

// Per-type accent colors (brand palette). Applied at the component level via
// getColorClasses(type) — NOT by swapping CSS --primary per route.
export type Accent = "coral" | "turquoise" | "mint" | "amber" | "violet";

export type ClaudeColor = z.infer<typeof claudeColor>;

// Raw (validated) frontmatter shapes, derived from the zod schemas.
export type AgentFrontmatter = z.infer<typeof agentFrontmatter>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatter>;
export type GuideFrontmatter = z.infer<typeof guideFrontmatter>;
export type ToolFrontmatter = z.infer<typeof toolFrontmatter>;
export type CommandFrontmatter = z.infer<typeof commandFrontmatter>;

/**
 * The common shape every card / search hit / nav iteration relies on.
 * `body` (raw markdown) is present on detail loads but omitted from the search
 * index. `date`/`updated` are ISO strings once normalized for serialization.
 */
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
  readingTime: number;
}

export interface ToolItem extends BaseContentItem {
  type: "tool";
  url: string;
  pricing: "free" | "freemium" | "paid" | "open-source" | "enterprise";
  logo?: string;
  repo?: string;
}

export interface CommandItem extends BaseContentItem {
  type: "command";
  argumentHint?: string;
  allowedTools?: string[];
  model?: "haiku" | "sonnet" | "opus" | "inherit";
}

export type ContentItem =
  | AgentItem
  | SkillItem
  | GuideItem
  | ToolItem
  | CommandItem;

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
