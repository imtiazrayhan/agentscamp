---
term: "Cursor Rules"
description: "Cursor rules are persistent instructions for Cursor's AI agent: project rules as .cursor/rules/*.mdc files with frontmatter, plus User Rules and Team Rules."
date: 2026-10-14
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["cursor-rules", "cursor", "instructions", "coding-agents", "configuration"]
related: ["tool:cursor", "glossary:agents-md", "glossary:claude-md", "guide:agents-md-vs-claude-md-vs-cursor-rules", "guide:claude-code-vs-cursor", "skill:instruction-file-migrator", "command:convert-rules"]
faq:
  - q: "What are the four Cursor rule types?"
    a: "Always Apply (included in every chat session), Apply Intelligently (the agent decides from the rule's description), Apply to Specific Files (a glob pattern matches a file in context), and Apply Manually (only when you @-mention the rule). They map to the alwaysApply, description and globs frontmatter fields, and they used to be called Always, Agent Requested, Auto Attached and Manual."
  - q: "Is .cursorrules deprecated?"
    a: "The current Cursor docs no longer mention .cursorrules at all. The last documented wording, from July 2025, said it was still supported but deprecated in favor of Project Rules. No primary source states that reading it was removed, so migrate to .cursor/rules or AGENTS.md rather than relying on it."
  - q: "Should I use Cursor rules or AGENTS.md?"
    a: "Cursor's own docs position AGENTS.md as the alternative for straightforward cases: a plain Markdown file with no metadata, read from the project root and subdirectories. Use .mdc project rules when you need glob scoping, manual @-mention rules, or the agent to decide relevance from a description."
summary: "Cursor rules are persistent instructions for Cursor's agent. Project rules are .cursor/rules/*.mdc files with frontmatter, applied as Always Apply, Apply Intelligently, Apply to Specific Files or Apply Manually; User Rules are personal, Team Rules are enforced from the dashboard. Cursor also reads AGENTS.md; .cursorrules has left the docs."
---

**Cursor rules are the persistent instructions that [Cursor](/tools/cursor) includes in its agent's context, written as project rule files, personal User Rules, or organization-wide Team Rules.**

Project rules "live in `.cursor/rules` as `.mdc` files and are version-controlled." The extension is not optional; a plain `.md` file in that directory is ignored because it lacks the frontmatter the rules system reads. That frontmatter has three fields, `description`, `globs` and `alwaysApply`, and the type dropdown in the editor sets them for you. The four types are **Always Apply** (every session), **Apply Intelligently** (the agent reads the description and pulls the rule in when relevant), **Apply to Specific Files** (a glob matches a file in context) and **Apply Manually** (only when `@`-mentioned). Older docs called these Always, Agent Requested, Auto Attached and Manual. When a rule applies, its content goes at the start of the model context, and a file mention inside it such as `@migration-template.sql` tells the agent where to look rather than inlining the file.

User Rules are global preferences set under Customize → Rules. Team Rules are free-form text created in the Team or Enterprise dashboard, with glob support and an enforce switch that prevents members from disabling them; precedence runs Team Rules, then Project Rules, then User Rules.

Two things have changed. The legacy `.cursorrules` file and nested `.cursor/rules` directories have dropped out of the documentation, and `/Generate Cursor Rules` was removed in Cursor 2.0 in favor of `/create-rule`. Meanwhile Cursor reads [AGENTS.md](/glossary/agents-md) in the project root and subdirectories as the plain-Markdown alternative, with more specific nested files taking precedence. It does not mention [CLAUDE.md](/glossary/claude-md), which is why teams that pair Cursor with Claude Code tend to converge on AGENTS.md; the [instruction-file comparison](/guides/configuration/agents-md-vs-claude-md-vs-cursor-rules) and [Claude Code vs Cursor](/guides/comparisons/claude-code-vs-cursor) cover that decision, and the [instruction-file-migrator](/skills/workflow/instruction-file-migrator) skill converts between formats.
