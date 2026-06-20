---
name: "Claude Code"
description: "Anthropic’s official agentic coding tool that runs in the terminal, IDE, and web."
date: 2026-06-03
url: "https://claude.com/product/claude-code"
pricing: "paid"
category: "cli"
color: "orange"
topics: ["workflow-prompting"]
tags: ["cli", "agent", "anthropic"]
featured: true
alternativeTo: ["codex-cli", "aider", "gemini-cli", "cursor", "amp"]
summary: "Claude Code is Anthropic's official agentic coding tool for the terminal, IDE (VS Code, JetBrains), and web. It works as an agent rather than autocomplete: it reads your codebase, plans changes, edits files, runs commands, and iterates against test or build feedback. Extensible via MCP servers, slash commands, subagents, and hooks; requires a paid plan."
faq:
  - q: "What is Claude Code?"
    a: "Claude Code is Anthropic's official agentic coding tool. Rather than acting as an autocomplete, it operates as an agent: it reads your codebase, plans changes, edits files, runs commands, and iterates against test or build feedback. It runs in your terminal, integrates with IDEs like VS Code and JetBrains, and is also available on the web."
  - q: "How much does Claude Code cost?"
    a: "Claude Code requires a paid plan — either a Claude Pro/Max subscription or Anthropic API usage. Because it can run commands and modify files, review its proposed changes before committing, and use a version-controlled branch when granting broader autonomy."
  - q: "How do I install Claude Code?"
    a: "Install it globally with npm install -g @anthropic-ai/claude-code, then run claude from your project root. A CLAUDE.md file lets you encode build commands, architecture notes, and conventions so each session starts with shared context."
---

Claude Code is Anthropic's official agentic coding tool. It runs in your terminal, integrates with IDEs like VS Code and JetBrains, and is also available on the web. Rather than acting as an autocomplete, it operates as an agent: it reads your codebase, plans changes, edits files, runs commands, and iterates against test or build feedback.

It is aimed at developers who want an assistant that works directly inside an existing project with full repository context, instead of copy-pasting snippets into a chat window.

## Highlights

- Runs in the terminal, in IDE extensions, and on the web
- Agentic workflow: searches, edits files, runs commands, and self-corrects from output
- Repository-aware context, with project conventions captured in a `CLAUDE.md` file
- Extensible via MCP servers, custom slash commands, subagents, and hooks
- Git-native: can stage, commit, and open pull requests on request

## How it fits an AI-assisted workflow

Install and start it from a project root:

```bash
npm install -g @anthropic-ai/claude-code
cd your-project
claude
```

Treat it as a pair working in your repo: describe a task, review the diff it proposes, and let it run tests before you commit. A `CLAUDE.md` file lets you encode build commands, architecture notes, and conventions so each session starts with shared context.

## Good to know

> [!NOTE]
> Claude Code requires a paid plan (Claude Pro/Max subscription or Anthropic API usage). Because it can run commands and modify files, review its proposed changes before committing, and use a version-controlled branch when granting broader autonomy.
