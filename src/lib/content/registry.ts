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

export const contentTypeList: ContentTypeDef[] = [
  contentTypes.agent,
  contentTypes.skill,
  contentTypes.guide,
  contentTypes.tool,
  contentTypes.command,
  contentTypes.glossary,
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
];

export const topicBySlug = new Map(topics.map((t) => [t.slug, t]));
