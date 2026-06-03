import { z } from "zod";

/**
 * Zod schemas are the SINGLE SOURCE OF TRUTH for all content frontmatter.
 * TS types are derived via z.infer (see types.ts). These are validated both at
 * load time (loaders.ts) and at build time (scripts/validate-content.ts), so a
 * malformed frontmatter field fails the build loudly.
 *
 * For Agents / Skills / Slash Commands the frontmatter mirrors the REAL
 * on-disk Claude Code artifact format so the files are directly installable
 * (copy into .claude/agents, .claude/skills, .claude/commands). Extra site-only
 * keys (topics, tags, featured, related, ...) are ignored by Claude Code.
 */

// Claude Code's subagent `color` enum (keep agent files valid).
export const claudeColor = z.enum([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "cyan",
]);

export const modelEnum = z.enum(["haiku", "sonnet", "opus", "inherit"]);

export const pricingEnum = z.enum([
  "free",
  "freemium",
  "paid",
  "open-source",
  "enterprise",
]);

// Accept a comma string OR a YAML array for tool lists (both are valid on disk).
const toolList = z.union([z.string(), z.array(z.string())]);

// Site-only fields shared by every content type.
const siteFields = {
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  related: z.array(z.string()).default([]),
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
};

export const agentFrontmatter = z
  .object({
    name: z.string(),
    description: z.string(),
    model: modelEnum.default("sonnet"),
    color: claudeColor.optional(),
    tools: toolList.optional(),
    title: z.string().optional(),
    ...siteFields,
  })
  .strict();

export const skillFrontmatter = z
  .object({
    name: z.string(),
    description: z.string(),
    "allowed-tools": toolList.optional(),
    "user-invocable": z.boolean().optional(),
    version: z.string().optional(),
    resources: z
      .array(z.object({ path: z.string(), kind: z.string() }))
      .optional(),
    multiFile: z.boolean().default(false),
    color: claudeColor.optional(),
    title: z.string().optional(),
    ...siteFields,
  })
  .strict();

export const guideFrontmatter = z
  .object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    color: claudeColor.optional(),
    ...siteFields,
  })
  .strict();

export const toolFrontmatter = z
  .object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    pricing: pricingEnum,
    category: z.string(),
    logo: z.string().optional(),
    repo: z.string().url().optional(),
    color: claudeColor.optional(),
    title: z.string().optional(),
    ...siteFields,
  })
  .strict();

export const commandFrontmatter = z
  .object({
    description: z.string(),
    "argument-hint": z.string().optional(),
    "allowed-tools": toolList.optional(),
    model: modelEnum.optional(),
    title: z.string().optional(),
    color: claudeColor.optional(),
    ...siteFields,
  })
  .strict();

export const frontmatterByType = {
  agent: agentFrontmatter,
  skill: skillFrontmatter,
  guide: guideFrontmatter,
  tool: toolFrontmatter,
  command: commandFrontmatter,
} as const;
