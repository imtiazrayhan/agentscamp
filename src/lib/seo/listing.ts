import type { ContentTypeId, FaqEntry } from "@/lib/content/types";

/**
 * Editorial SEO/AEO copy for the five type-listing pages (/agents, /skills,
 * /guides, /tools, /commands). Kept server-side (imported only by the listing
 * page routes + the server-rendered TypeListing) so the keyword/FAQ prose never
 * ships in the client `registry` bundle.
 *
 * - seoTitle:       keyword-led <title> (root layout appends "— AgentsCamp").
 * - seoDescription: meta description; `{count}` is replaced with the live count.
 * - intro:          on-page explainer under the H1 — extractable "what is X"
 *                   answer copy for AI answer engines (AEO/GEO).
 * - faq:            visible Q&A that also emits FAQPage JSON-LD (AEO/GEO).
 */
export interface ListingSeo {
  seoTitle: string;
  seoDescription: string;
  intro: string;
  faq: FaqEntry[];
}

export const listingSeo: Record<ContentTypeId, ListingSeo> = {
  agent: {
    seoTitle: "Claude Code Subagents",
    seoDescription:
      "Browse {count} free, copy-paste Claude Code subagents — code review, debugging, testing, architecture, and more. Install in seconds into ~/.claude/agents.",
    intro:
      "Agents (subagents) are specialized Claude Code assistants, each with its own focused system prompt and isolated context window. Claude Code delegates matching work to them automatically, or you can invoke one explicitly. Every agent below is a plain Markdown file you can copy or download straight into ~/.claude/agents.",
    faq: [
      {
        q: "What is a Claude Code agent?",
        a: "A Claude Code agent (or subagent) is a specialized assistant defined by a Markdown file with a focused system prompt and its own isolated context window. Claude Code delegates matching tasks to it automatically, or you can invoke it by name.",
      },
      {
        q: "How do I install an agent?",
        a: "Copy or download the agent's Markdown file to ~/.claude/agents/<name>.md for all your projects, or .claude/agents/<name>.md inside a single project. Claude Code picks it up automatically — no restart required.",
      },
      {
        q: "Are these agents free?",
        a: "Yes. Every agent on AgentsCamp is free to copy, download, and use. They are open Markdown files with no signup or API key required.",
      },
      {
        q: "When should I use an agent instead of a skill or slash command?",
        a: "Use an agent when you want delegated, multi-step work to run in its own context window, such as a code review or a debugging pass. Use a skill for on-demand expertise loaded into the main conversation, and a slash command for a quick reusable prompt you trigger with /name.",
      },
      {
        q: "Do these agents work outside Claude Code?",
        a: "Agents follow Claude Code's subagent file format, so they install directly into Claude Code. The system prompts inside them can also be adapted for other agent frameworks.",
      },
    ],
  },
  skill: {
    seoTitle: "Claude Code Skills (Agent Skills)",
    seoDescription:
      "Browse {count} free Claude Code Skills — packaged SKILL.md capabilities Claude loads on demand. Copy-paste install into ~/.claude/skills.",
    intro:
      "Skills are packaged capabilities Claude loads on demand. Each is a SKILL.md file — optionally bundled with scripts and resources — that Claude reads only when it's relevant, via progressive disclosure, so it adds expertise without permanently filling your context window.",
    faq: [
      {
        q: "What is a Claude Code skill?",
        a: "A skill is a reusable capability packaged as a SKILL.md file plus optional supporting files. Claude loads it on demand — only when the task calls for it — so it extends Claude with specialized expertise without bloating every conversation.",
      },
      {
        q: "How do I install a skill?",
        a: "Save the skill to ~/.claude/skills/<name>/SKILL.md for all your projects, or .claude/skills/<name>/SKILL.md inside a single project. Multi-file skills keep their resources in the same folder. Claude loads it automatically when relevant.",
      },
      {
        q: "How are skills different from agents?",
        a: "Skills load on demand into your main conversation to add expertise, using progressive disclosure. Agents run as separate subagents with their own isolated context window. Use a skill for know-how, an agent for delegated work.",
      },
      {
        q: "What is progressive disclosure?",
        a: "Progressive disclosure means Claude only reads a skill's full instructions when the current task matches it. The skill's short description is always visible; its detailed body loads just-in-time, keeping your context lean.",
      },
      {
        q: "Are these skills free?",
        a: "Yes. Every skill on AgentsCamp is free to copy, download, and install. They are open files with no signup required.",
      },
    ],
  },
  guide: {
    seoTitle: "Guides for Building with AI Coding Agents",
    seoDescription:
      "{count} in-depth guides and tutorials for building with Claude Code and AI coding agents — subagents, skills, MCP, prompting, and workflows.",
    intro:
      "Long-form tutorials and deep-dives on building with AI coding agents. From first principles to advanced workflows, learn how to design agents, write skills, wire up MCP servers, and ship faster with Claude Code.",
    faq: [
      {
        q: "Who are these guides for?",
        a: "Developers building with AI coding agents — whether you're just starting with Claude Code or designing production agent workflows. Each guide is self-contained and practical.",
      },
      {
        q: "Are the guides free to read?",
        a: "Yes. Every guide on AgentsCamp is free to read, with no paywall and no signup.",
      },
      {
        q: "Where should I start?",
        a: "If you're new, begin with the getting-started guides on agents and skills, then move into MCP, prompting, and workflow deep-dives as you grow more comfortable.",
      },
      {
        q: "How often are the guides updated?",
        a: "Guides are revised as Claude Code and the surrounding tooling evolve. Each guide shows its publish and last-updated dates.",
      },
    ],
  },
  tool: {
    seoTitle: "AI Coding Tools Directory",
    seoDescription:
      "A curated directory of {count} AI coding tools — editors, CLIs, agents, MCP servers, and SDKs for AI-assisted development. Compare features, pricing, and alternatives.",
    intro:
      "A curated directory of tools for AI-assisted development: AI code editors, CLI agents, MCP servers, model and agent SDKs, and supporting infrastructure. Each entry links to the official site and source, with pricing and alternatives so you can compare at a glance.",
    faq: [
      {
        q: "What kinds of tools are listed?",
        a: "AI code editors and IDEs, command-line coding agents, MCP servers, model and agent SDKs, and supporting infrastructure for AI-assisted development. Each tool links to its official site and source.",
      },
      {
        q: "Is the directory free to use?",
        a: "Yes. Browsing AgentsCamp's tools directory is completely free. Individual tools have their own pricing, which we label as free, freemium, or paid where known.",
      },
      {
        q: "How are tools chosen?",
        a: "Tools are curated for relevance to building with AI coding agents. Listings link to official sources and are not paid placements.",
      },
      {
        q: "How do I find alternatives to a tool?",
        a: "Each tool page lists related alternatives, and you can browse by category or pricing to compare similar options side by side.",
      },
    ],
  },
  command: {
    seoTitle: "Claude Code Slash Commands",
    seoDescription:
      "Browse {count} free Claude Code slash commands — reusable prompts you trigger with /name to automate repeatable workflows. Copy-paste install into ~/.claude/commands.",
    intro:
      "Slash commands are reusable prompts you invoke with /name. Each is a Markdown file you drop into ~/.claude/commands — automate repeatable workflows like reviews, commits, and refactors with a single keystroke.",
    faq: [
      {
        q: "What is a Claude Code slash command?",
        a: "A slash command is a reusable prompt saved as a Markdown file and invoked with /name in Claude Code. It expands into instructions Claude follows, optionally using arguments via $ARGUMENTS.",
      },
      {
        q: "How do I install a slash command?",
        a: "Save the command to ~/.claude/commands/<name>.md for all your projects, or .claude/commands/<name>.md inside a single project. Then type /<name> in Claude Code to run it.",
      },
      {
        q: "Can commands take arguments?",
        a: "Yes. Reference $ARGUMENTS in the command body and anything you type after the command name is substituted in, so one command can handle many inputs.",
      },
      {
        q: "Are these commands free?",
        a: "Yes. Every slash command on AgentsCamp is free to copy, download, and install, with no signup required.",
      },
      {
        q: "How is a command different from an agent?",
        a: "A slash command is a prompt you trigger manually with /name in your main conversation. An agent is a subagent with its own context window that Claude can delegate to automatically. Commands are quick and explicit; agents are autonomous and isolated.",
      },
    ],
  },
};

/** Meta description with the live item count interpolated. */
export function listingDescription(type: ContentTypeId, count: number): string {
  return listingSeo[type].seoDescription.replace("{count}", String(count));
}
