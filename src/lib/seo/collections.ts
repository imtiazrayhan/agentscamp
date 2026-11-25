import {
  getAllContent,
  getContentByType,
  getByTopic,
  getByAudience,
} from "@/lib/content";
import {
  contentTypes,
  contentTypeList,
  topicBySlug,
  audienceBySlug,
  type ContentTypeDef,
} from "@/lib/content/registry";
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
 * Most items a role path shows per type. Role pages are curated entry points,
 * not indexes — every group already links to the full listing. A no-op for the
 * four hand-curated roles (largest group is 25); it exists so `developers`,
 * which carries the whole engineering library, stays a readable page.
 */
const GROUP_CAP = 30;

/**
 * Templated copy for the category / topic landing pages, so a new category needs
 * ZERO hand-written copy (it just appears). Optional per-collection overrides can
 * be added here later without touching the route files.
 */

const CATEGORY_OVERRIDES: Record<string, string> = {
  // `${type}/${category}`: "custom intro description"
  "guide/founders":
    "Guides for founders and non-technical builders: Claude Code in plain language, AI app builders, automating operations, and choosing a Claude plan.",
  "guide/marketing":
    "Guides for marketers and content teams: Claude for marketing work, brand-voice skills, research workflows, and the AI tools worth paying for.",
  "guide/design":
    "Guides for designers: Claude Design, Figma-to-code with Claude Code, design-system upkeep, and the AI design tools that fit a working stack.",
  "guide/analytics":
    "Guides for data and analytics teams: Claude for Excel, text-to-SQL, notebooks with Claude Code, and checking an AI analysis before trusting it.",
  "guide/sales":
    "Guides for sales and revenue teams: Claude for sales, the official sales plugin, sourced prospect research, and the AI sales tools worth paying for.",
  "guide/comparisons":
    "Side-by-side AI tool comparisons and roundups — coding agents, models, RAG parsers, search APIs, and work tools compared on trade-offs and real fit.",
  "guide/deals":
    "Verified discounts, free tiers, and promo programs for AI tools, coding agents, and developer platforms — updated as offers change.",
  "skill/product":
    "Skills for founders and product people — PRDs, scope cuts, interview synthesis, competitor teardowns — that run on claude.ai, Claude Code, and Cowork.",
  "skill/marketing":
    "Skills for marketers — brand voice, briefs, repurposing, landing pages, email sequences — that run on claude.ai, Claude Code, and Cowork.",
  "skill/design":
    "Skills for designers — briefs, critiques, tokens, component specs, UX copy — that run on claude.ai, Claude Code, and Cowork.",
  "skill/analytics":
    "Skills for analysts — dataset first looks, chart choice, analysis memos, SQL explanations, spreadsheet audits — that run on claude.ai, Claude Code, and Cowork.",
  "skill/sales":
    "Skills for sales and revenue teams — prospect research, account briefs, CRM hygiene, and outreach checks — that run on claude.ai, Claude Code, and Cowork.",
  "command/product":
    "Slash commands for product work in Claude Code: draft a PRD from rough notes, cut it to an MVP scope, and validate an interview scorecard before it is used.",
  "command/marketing":
    "Slash commands for marketing work in Claude Code: repurpose content, check a draft against your brand voice.",
  "command/design":
    "Slash commands for design work in Claude Code: critique a UI screenshot against a fixed checklist, and extract design tokens from a stylesheet or theme.",
  "command/analytics":
    "Slash commands for analytics work in Claude Code: profile a new dataset, write a precise metric definition, and count labeled feedback with code.",
  "command/sales":
    "Slash commands for sales work in Claude Code: research an account, audit outreach copy, and check deliverability before a sequence goes live.",
  "agent/product":
    "Subagents for founders: a technical co-founder that reviews AI-built apps for the risks that bite non-technical owners.",
  "agent/marketing":
    "Subagents for marketers: an editor that fixes voice and flags every unsourced claim, an SEO reviewer, and reviewers for captions, translations, and speech.",
  "agent/design":
    "Subagents for designers: a design-systems librarian that keeps tokens, components, and Figma in sync.",
  "agent/analytics":
    "Subagents for analysts: a reviewer that checks an analysis for methodological errors before it ships.",
  "agent/sales":
    "Subagents for sales teams: research and review agents that check prospect facts, CRM notes, and outbound drafts before anything reaches a buyer.",
};

const TOPIC_OVERRIDES: Record<string, string> = {
  // `${topicSlug}`: "custom intro description" (110-160 chars)
  "coding-languages":
    "Guides, agents, skills, tools, and commands for AI-assisted coding — language specialists, editors, and workflows for shipping software with AI agents.",
  "review-qa":
    "AI code review, testing, debugging, and QA resources — guides, skills, subagents, and tools for catching bugs and raising test coverage before merge.",
  "devops-infra":
    "DevOps, CI/CD, containers, and platform engineering with AI — guides, skills, and agents for GitHub Actions, sandboxing, observability, and reliable deploys.",
  "data-ml":
    "Data engineering, analytics, SQL, and machine learning resources — guides, tools, and skills for notebooks, data pipelines, and trustworthy AI analysis.",
  architecture:
    "System design, refactoring, API design, and software architecture with AI — guides, skills, and subagents for keeping complex codebases maintainable.",
  "workflow-prompting":
    "Prompt engineering, context management, CLAUDE.md setup, and AI workflows — guides, skills, and commands for getting reliable output from LLMs.",
  "rag-retrieval":
    "Retrieval-augmented generation (RAG), embeddings, chunking, vector databases, and document parsing — guides, tools, and skills for grounded AI apps.",
  "llm-evals":
    "LLM evaluation, benchmarks, hallucination testing, and observability — guides, tools, and skills for measuring model quality before shipping to users.",
  "ai-agents-systems":
    "Designing and running AI agent systems — tool use, orchestration, subagents, sandboxing, and production frameworks across guides, tools, and skills.",
  "llm-app-dev":
    "Building production LLM applications — structured outputs, provider fallbacks, caching, streaming, and SDKs covered across guides, tools, and skills.",
  "mlops-ai-infra":
    "LLM inference providers, GPU hosting, fine-tuning, and AI infrastructure — guides, tools, and comparisons for serving models fast and affordably.",
  "ai-safety-security":
    "AI security, prompt injection defense, guardrails, PII redaction, and safe agent execution — guides, skills, and auditing agents for production teams.",
  mcp:
    "Model Context Protocol (MCP) servers, clients, setup guides, and build patterns — connect Claude Code, Cursor, and AI agents to external tools and data.",
  "multimodal-ai":
    "Voice AI, speech-to-text, text-to-speech, vision models, and multimodal document extraction — guides, API comparisons, and tools for audio and visual AI.",
  "ai-at-work":
    "Practical AI for founders, marketers, designers, sales, and analysts — guides, tool comparisons, and ready-to-use skills for everyday non-engineering work.",
};

// Tool categories outside the developer stack (role-path expansion) get their
// own intro; the default template below assumes an AI-coding stack.
const TOOL_CATEGORY_OVERRIDES: Record<string, (n: number) => string> = {
  // category: (count) => "custom intro description"
  assistant: (n) =>
    `${n} general-purpose AI assistants compared for everyday work — plans, what each unlocks, and which fits founders, marketers, designers, and analysts.`,
  "app-builder": (n) =>
    `${n} AI app builders that turn a prompt into a working app — who each one suits, how it's priced, and when to hand the code to Claude Code.`,
  automation: (n) =>
    `${n} AI automation and agent platforms for running operations without engineers — triggers, approvals, pricing models, and where each fits.`,
  design: (n) =>
    `${n} AI design tools for prototypes, decks, images, and design systems — what each makes, how it's priced, and where it fits a designer's stack.`,
  marketing: (n) =>
    `${n} AI marketing and content tools — writing, SEO, decks, video — compared on what each does, how it's priced, and where it fits a content workflow.`,
  analytics: (n) =>
    `${n} AI analytics tools — notebooks, text-to-SQL, chat-first analysis — compared on what each does, how it's priced, and where it fits an analyst's stack.`,
  browser: (n) =>
    `${n} AI browsers with built-in assistants and agent modes — what each can do on a page, how memory and privacy work, and which fits everyday work.`,
  sales: (n) =>
    `${n} AI sales and revenue tools — prospecting, enrichment, conversation intelligence, and outbound workflows — compared on pricing and fit.`,
  voice: (n) =>
    `${n} AI voice, speech-to-text, and text-to-speech tools and APIs — latency, voice quality, pricing models, and where each fits in production.`,
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
    (type === "guide"
      ? `Explore ${items.length} practical ${label.toLowerCase()} guides on AgentsCamp — clear explanations, trade-offs, and hands-on workflows for working with AI.`
      : `Explore ${items.length} curated ${label.toLowerCase()} ${def.label.toLowerCase()} for building with AI coding agents — what each one does, when to use it, and how to add it to your workflow.`);
  return {
    title,
    description,
    items,
    crumbs: [
      { label: "Home", href: "/" },
      { label: def.label, href: def.basePath },
      { label },
    ],
    noindex: items.length < MIN_INDEXABLE,
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

// --- audience paths (/for/<role>) ---

export interface AudienceGroup {
  def: ContentTypeDef;
  items: ContentItem[];
  /** Total before GROUP_CAP, so the heading count stays honest. */
  total: number;
}

/**
 * A role path is curated, not exhaustive: the registry's `startHere` sequence
 * opens the page, then every other item tagged `audience: [role]` follows,
 * grouped by type in contentTypeList order (featured first, then newest).
 * `items` is the flattened page order so JSON-LD and the visible page agree.
 */
export function audienceCollection(
  slug: string,
): (Collection & { startHere: ContentItem[]; groups: AudienceGroup[] }) | null {
  const def = audienceBySlug.get(slug);
  if (!def) return null;
  const byId = new Map(getAllContent().map((i) => [`${i.type}:${i.slug}`, i]));
  const startHere = def.startHere
    .map((id) => byId.get(id))
    .filter((i): i is ContentItem => Boolean(i));
  const opened = new Set(startHere.map((i) => i.href));
  const rest = getByAudience(slug).filter((i) => !opened.has(i.href));
  const groups: AudienceGroup[] = contentTypeList
    .map((typeDef) => {
      const sorted = rest
        .filter((i) => i.type === typeDef.id)
        .sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            (b.date ?? "").localeCompare(a.date ?? "") ||
            a.title.localeCompare(b.title),
        );
      return {
        def: typeDef,
        items: sorted.slice(0, GROUP_CAP),
        total: sorted.length,
      };
    })
    .filter((g) => g.items.length > 0);
  const items = [...startHere, ...groups.flatMap((g) => g.items)];
  if (!items.length) return null;
  return {
    title: def.title ?? `AI for ${def.label}`,
    description: def.description,
    items,
    startHere,
    groups,
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Start here", href: "/for" },
      { label: def.label },
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
    description:
      TOOL_CATEGORY_OVERRIDES[category]?.(items.length) ??
      `${items.length} curated ${label.toLowerCase()} tools for AI coding — compare what each one does, how it's priced, and where it fits in an AI-assisted development stack.`,
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
    title: `${label} AI Tools`,
    description: `${label} AI tools — ${items.length} curated assistants, coding agents, MCP servers, design, marketing, and data tools with notes on strengths and fit.`,
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
    description: `${alts.length} alternatives to ${tool.title} — free and paid AI tools covering similar jobs, with pricing, trade-offs, and standout strengths.`,
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
