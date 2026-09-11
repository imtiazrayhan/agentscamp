import {
  Bot,
  Sparkles,
  BookOpen,
  Wrench,
  TerminalSquare,
  Library,
  type LucideIcon,
} from "lucide-react";
import type { Accent, ContentTypeId } from "./types";
import { basePaths } from "./paths";

/**
 * Client-SAFE registry: metadata only (no fs, no loaders), so client components
 * (Nav, cards, search) can import it. Data loading lives in index.ts (server).
 * All generic UI iterates `contentTypeList` instead of hardcoding the types.
 */

export type InstallKind =
  | "file" // copy/download a single .md (agents)
  | "skill-dir" // SKILL.md (+ optional resources)
  | "command" // slash command file
  | "mcp" // `claude mcp add ...`
  | "external" // external link (tools)
  | "none"; // not installable (guides)

export interface ContentTypeDef {
  id: ContentTypeId;
  label: string; // "Agents"
  singular: string; // "Agent"
  basePath: string; // "/agents"
  icon: LucideIcon;
  accent: Accent;
  tagline: string;
  description: string;
  install: InstallKind;
  installPath?: string; // e.g. ~/.claude/agents/<slug>.md
}

export const contentTypes: Record<ContentTypeId, ContentTypeDef> = {
  agent: {
    id: "agent",
    label: "Agents",
    singular: "Agent",
    basePath: basePaths.agent,
    icon: Bot,
    accent: "coral",
    tagline: "Specialized subagents for focused work",
    description:
      "Drop-in Claude Code subagents with focused system prompts — code review, debugging, architecture, and more.",
    install: "file",
    installPath: "~/.claude/agents/<slug>.md",
  },
  skill: {
    id: "skill",
    label: "Skills",
    singular: "Skill",
    basePath: basePaths.skill,
    icon: Sparkles,
    accent: "turquoise",
    tagline: "Reusable capabilities Claude loads on demand",
    description:
      "Packaged SKILL.md capabilities that extend Claude with on-demand expertise.",
    install: "skill-dir",
    installPath: "~/.claude/skills/<slug>/SKILL.md",
  },
  guide: {
    id: "guide",
    label: "Guides",
    singular: "Guide",
    basePath: basePaths.guide,
    icon: BookOpen,
    accent: "mint",
    tagline: "Tutorials and deep-dives",
    description:
      "Long-form guides and tutorials for building with AI coding agents.",
    install: "none",
  },
  tool: {
    id: "tool",
    label: "Tools",
    singular: "Tool",
    basePath: basePaths.tool,
    icon: Wrench,
    accent: "amber",
    tagline: "The AI tooling directory",
    description:
      "A curated directory of AI coding tools, editors, agents, and MCP servers.",
    install: "external",
  },
  command: {
    id: "command",
    label: "Commands",
    singular: "Command",
    basePath: basePaths.command,
    icon: TerminalSquare,
    accent: "violet",
    tagline: "Slash commands for Claude Code",
    description:
      "Reusable slash commands that automate repeatable workflows in Claude Code.",
    install: "command",
    installPath: "~/.claude/commands/<slug>.md",
  },
  glossary: {
    id: "glossary",
    label: "Glossary",
    singular: "Term",
    basePath: basePaths.glossary,
    icon: Library,
    accent: "sky",
    tagline: "AI terms, defined precisely",
    description:
      "Plain-language definitions of the AI and LLM-engineering terms you'll meet across the hub — answer-first, with the deeper guide linked.",
    install: "none",
  },
};

// Content-first order: editorial types lead, installables follow. Drives nav,
// footer, homepage bento, palette groups, and llms.txt sections.
export const contentTypeList: ContentTypeDef[] = [
  contentTypes.guide,
  contentTypes.tool,
  contentTypes.glossary,
  contentTypes.agent,
  contentTypes.skill,
  contentTypes.command,
];

// Shared cross-type taxonomy. A topic should ship as a pill only once >=2 items
// span >=2 types (enforced editorially / via validation).
export interface TopicDef {
  slug: string;
  label: string;
}

export const topics: TopicDef[] = [
  { slug: "coding-languages", label: "Coding & Languages" },
  { slug: "review-qa", label: "Review & QA" },
  { slug: "devops-infra", label: "DevOps & Infra" },
  { slug: "data-ml", label: "Data & ML" },
  { slug: "architecture", label: "Architecture" },
  { slug: "workflow-prompting", label: "Workflow & Prompting" },
  // Everything-AI expansion (content roadmap). A topic surfaces only once it has
  // content (getByTopic > 0), so these are inert until their clusters land.
  { slug: "rag-retrieval", label: "RAG & Retrieval" },
  { slug: "llm-evals", label: "LLM Evals" },
  { slug: "ai-agents-systems", label: "AI Agents & Systems" },
  { slug: "llm-app-dev", label: "LLM App Dev" },
  { slug: "mlops-ai-infra", label: "MLOps & AI Infra" },
  { slug: "ai-safety-security", label: "AI Safety & Security" },
  // Phase 2 (content-roadmap-phase2.md): MCP earns its own pill with the Wave 5
  // server-directory cluster; existing MCP items dual-tag mcp + architecture.
  { slug: "mcp", label: "MCP" },
  // Promoted in Wave 7 with the voice/vision depth cluster (was deferred in
  // Phase 1, riding mlops-ai-infra until it earned the pill).
  { slug: "multimodal-ai", label: "Voice & Multimodal" },
  // Role-path expansion (2026-09): work done WITH AI outside engineering —
  // founders, marketers, designers, analysts. Inert until that content lands.
  { slug: "ai-at-work", label: "AI at Work" },
];

export const topicBySlug = new Map(topics.map((t) => [t.slug, t]));

// Audience paths (/for/<role>): curated entry points per reader role, NOT
// exhaustive filters. An item joins a role path via frontmatter `audience: [...]`
// (validated against these slugs); `startHere` is the ordered opening sequence
// of typed IDs rendered at the top of the role page (each must also carry the
// tag — enforced by validate-content). A role renders only once it has items,
// exactly like topics.
export interface AudienceDef {
  slug: string;
  label: string;
  /** ≤160 chars — doubles as the meta description and the card copy. */
  description: string;
  /** Overrides the derived "AI for <label>" page title where that reads badly. */
  title?: string;
  startHere: string[];
}

export const audiences: AudienceDef[] = [
  {
    slug: "developers",
    label: "Developers",
    description:
      "Claude Code, coding agents, skills, MCP, and the engineering guides, tools, and installables that make AI-assisted development actually ship.",
    startHere: [
      "guide:what-is-claude-code",
      "guide:installing-claude-code",
      "guide:claude-md-best-practices",
      "guide:what-are-claude-skills",
      "guide:claude-code-hooks",
    ],
  },
  {
    slug: "ai-engineers",
    label: "AI engineers",
    description:
      "Building with LLMs, not just coding with them: RAG, evals, agents, inference, and the SDKs, skills, and subagents that get AI features to production.",
    title: "AI engineering",
    startHere: [
      "guide:ai-engineer-roadmap-2026",
      "guide:getting-started-with-agents",
      "guide:how-rag-works",
      "guide:write-llm-evals",
      "guide:deploying-llms-to-production",
    ],
  },
  {
    slug: "devops",
    label: "DevOps & platform engineers",
    description:
      "Claude Code in CI, sandboxed agents, SLOs and incident response — the infrastructure agents, skills, and commands that keep AI-assisted delivery boring.",
    startHere: [
      "guide:claude-code-ci-github-actions",
      "guide:sandboxing-ai-generated-code",
      "guide:slo-error-budget-guide",
      "skill:github-actions-optimizer",
      "agent:sre-engineer",
    ],
  },
  {
    slug: "security",
    label: "Security & AI safety",
    description:
      "Prompt injection, the agentic OWASP top 10, red-teaming, and the auditing skills and agents that make AI-assisted and AI-powered work safe to ship.",
    startHere: [
      "guide:defending-prompt-injection",
      "guide:owasp-agentic-top-10",
      "guide:sandboxing-ai-generated-code",
      "guide:red-teaming-llm-applications",
      "guide:data-privacy-for-llm-apps",
    ],
  },
  {
    slug: "sales",
    label: "Sales & revenue teams",
    description:
      "Claude for sales work: the official sales plugin, prospect research you can actually source, CRM and deliverability audits, and which tools connect to Claude.",
    startHere: [
      "guide:claude-for-sales-teams",
      "guide:claude-sales-plugin-guide",
      "guide:research-prospects-with-claude",
      "guide:best-ai-sales-tools-2026",
      "guide:which-claude-plan-for-sales-teams",
    ],
  },
  {
    slug: "founders",
    label: "Founders & non-technical builders",
    description:
      "Build and run a product without an engineering team: Claude Code in plain language, AI app builders, automation, and which Claude plan to pay for.",
    startHere: [
      "guide:claude-code-for-non-developers",
      "guide:claude-for-founders",
      "guide:build-an-mvp-with-claude-code",
      "guide:best-ai-tools-for-founders-2026",
      "guide:which-claude-plan-for-founders",
    ],
  },
  {
    slug: "marketers",
    label: "Marketers & content teams",
    description:
      "Claude for marketing and content work: brand-voice skills, research workflows, the official marketing plugin, and the AI writing tools worth paying for.",
    startHere: [
      "guide:claude-code-for-marketers",
      "guide:claude-for-marketing-teams",
      "guide:brand-voice-with-claude-skills",
      "guide:best-ai-tools-for-marketers-2026",
      "guide:which-claude-plan-for-marketers",
    ],
  },
  {
    slug: "designers",
    label: "Designers",
    description:
      "Claude Design, Figma-to-code with Claude Code, design-system upkeep, and the AI design and image tools that fit a working designer's stack.",
    startHere: [
      "guide:claude-design-guide",
      "guide:claude-code-for-designers",
      "guide:figma-to-code-with-claude",
      "guide:best-ai-tools-for-designers-2026",
      "guide:which-claude-plan-for-designers",
    ],
  },
  {
    slug: "analysts",
    label: "Data & analytics teams",
    description:
      "Claude for data analysis: Claude for Excel, text-to-SQL, notebooks with Claude Code, checking AI analyses, and the analytics tools that hold up.",
    startHere: [
      "guide:claude-for-data-analysis",
      "guide:claude-for-excel-guide",
      "guide:claude-code-for-data-analysts",
      "guide:best-ai-tools-for-data-analysts-2026",
      "guide:which-claude-plan-for-data-analysts",
    ],
  },
];

export const audienceBySlug = new Map(audiences.map((a) => [a.slug, a]));
