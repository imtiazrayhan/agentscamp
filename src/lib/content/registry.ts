import {
  Bot,
  Sparkles,
  BookOpen,
  Wrench,
  TerminalSquare,
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
};

export const contentTypeList: ContentTypeDef[] = [
  contentTypes.agent,
  contentTypes.skill,
  contentTypes.guide,
  contentTypes.tool,
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
];

export const topicBySlug = new Map(topics.map((t) => [t.slug, t]));
