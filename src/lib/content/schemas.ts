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

// A single answer-first / FAQ entry (AEO). Rendered visibly AND marked up, so
// there is never hidden-only structured data (a manual-action risk).
export const faqEntry = z.object({ q: z.string(), a: z.string() });
// A single procedural step (HowTo, AEO). Likewise rendered + marked up.
export const howtoStep = z.object({ name: z.string(), text: z.string() });

export const osEnum = z.enum([
  "Web",
  "macOS",
  "Windows",
  "Linux",
  "iOS",
  "Android",
]);

// Site-only fields shared by every content type. Everything is optional /
// defaulted so all existing files keep validating; new SEO/AEO/GEO keys are
// ignored by Claude Code when an artifact is installed (and stripped from the
// copy-paste artifact by buildArtifact), so files stay installable.
const siteFields = {
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  related: z.array(z.string()).default([]),
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),

  // --- SEO/AEO/GEO additions (optional escape hatches; templates cover the rest) ---
  seoTitle: z.string().max(70).optional(), // override the <title> (template still appends brand)
  seoDescription: z.string().max(160).optional(), // override the meta/OG description
  keywords: z.array(z.string()).default([]), // feeds JSON-LD keywords ONLY (never <meta keywords>)
  image: z.string().optional(), // custom OG image path (else one is generated)
  summary: z.string().max(400).optional(), // answer-first lead: visible <p> AND JSON-LD abstract AND llms.txt
  keyTakeaways: z.array(z.string()).max(7).default([]),
  faq: z.array(faqEntry).default([]),
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
    howtoSteps: z.array(howtoStep).default([]), // procedural guides -> HowTo (AEO)
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
    // Type-specific, truthful structured-data fields (entity/AEO, not rich-result bait).
    os: z.array(osEnum).default([]), // SoftwareApplication.operatingSystem
    alternativeTo: z.array(z.string()).default([]), // powers /tools/[slug]/alternatives + "X alternative" intent
    license: z.string().optional(), // CreativeWork.license (e.g. "Apache-2.0")
    sameAs: z.array(z.string().url()).default([]), // authoritative profiles for the tool
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

// Glossary terms are short, definitional AEO pages (DefinedTerm in JSON-LD).
// `term` is the canonical display term; `description` is the one-line
// definition used for SERP/meta. Body = the full 150–300 word entry.
export const glossaryFrontmatter = z
  .object({
    term: z.string(),
    description: z.string(),
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
  glossary: glossaryFrontmatter,
} as const;
