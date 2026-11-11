---
term: "CLAUDE.md"
description: "CLAUDE.md is Claude Code's Markdown instruction file, loaded at the start of every session to give Claude persistent project, user or organization guidance."
date: 2026-10-13
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["claude-md", "claude-code", "instructions", "memory", "configuration"]
related: ["guide:claude-md-best-practices", "guide:claude-code-memory-context", "guide:agents-md-vs-claude-md-vs-cursor-rules", "glossary:agents-md", "glossary:cursor-rules", "tool:claude-code", "guide:claude-code-hooks"]
faq:
  - q: "Where does Claude Code look for CLAUDE.md?"
    a: "In load order: a managed policy file deployed by your organization, ~/.claude/CLAUDE.md for all your projects, ./CLAUDE.md or ./.claude/CLAUDE.md for the project, and ./CLAUDE.local.md for personal notes. Files in the working directory and every directory above it load at launch and are concatenated; files in subdirectories load when Claude reads or edits a file there."
  - q: "What is the difference between CLAUDE.md and AGENTS.md?"
    a: "CLAUDE.md is Claude Code's native file, with @path imports and path-scoped .claude/rules. AGENTS.md is the cross-tool format read by Codex, Cursor, Copilot and others. Since v2.1.277, Claude Code reads AGENTS.md on its own when no CLAUDE.md exists in or above the working directory; otherwise it reads only the CLAUDE.md files."
  - q: "Does Claude Code always follow CLAUDE.md?"
    a: "No. Anthropic's docs say the content is delivered as a user message after the system prompt and that Claude treats it as context, not enforced configuration. Rules that must hold every time belong in a PreToolUse hook; CLAUDE.md is for conventions, commands and judgment calls."
summary: "CLAUDE.md is the Markdown file Claude Code reads at the start of every session for persistent instructions: commands, conventions and project gotchas. It has managed, user, project and local scopes, concatenated root-down, supports @path imports and path-scoped .claude/rules, and is context Claude tries to follow, not enforced configuration."
---

**CLAUDE.md is the Markdown instruction file that [Claude Code](/tools/claude-code) loads at the start of every session so that project conventions, commands and constraints survive from one conversation to the next.** Anthropic's documentation page for it is titled "How Claude remembers your project."

The file exists at four scopes, loaded from broadest to most specific: a managed policy file an organization deploys, `~/.claude/CLAUDE.md` for everything you work on, `./CLAUDE.md` or `./.claude/CLAUDE.md` for the project (committed and shared), and `./CLAUDE.local.md` for personal notes kept out of git. Claude Code reads the working directory and every directory above it at launch and concatenates what it finds, ordered from the filesystem root down, so the file closest to where you launched is read last. Files in subdirectories load on demand once Claude reads or edits something there.

Two mechanisms extend it. An `@path/to/file` line imports another file at launch, up to four hops deep; a path wrapped in backticks is left alone. And `.claude/rules/*.md` holds rule files that either load at launch or, with a `paths:` glob in their frontmatter, only when Claude touches a matching file. The docs warn that files over 200 lines may reduce adherence.

The limit worth remembering is that CLAUDE.md is advice, not enforcement. Its content arrives "as a user message after the system prompt," and Claude "treats them as context, not enforced configuration." Anything that must happen every time, such as blocking edits to a path, belongs in a [hook](/guides/configuration/claude-code-hooks). Since Claude Code v2.1.277 the tool also reads [AGENTS.md](/glossary/agents-md) natively when no CLAUDE.md exists above the working directory, which matters for repositories shared with [Cursor](/glossary/cursor-rules) or Codex; the [instruction-file comparison](/guides/configuration/agents-md-vs-claude-md-vs-cursor-rules) covers that choice. [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) covers what to write in it, and [memory and context](/guides/configuration/claude-code-memory-context) covers how it loads alongside auto memory.
