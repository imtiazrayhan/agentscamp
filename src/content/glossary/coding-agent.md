---
term: "Coding Agent"
description: "An AI coding agent is a tool that takes a software task and works through it on its own: reading the codebase, editing files, running commands and tests."
date: 2026-10-05
topics: ["ai-agents-systems", "coding-languages"]
audience: ["developers", "founders"]
tags: ["coding-agent", "ai-agents", "claude-code", "agentic-coding", "developer-tools"]
related: ["guide:ai-coding-agents-cli-2026", "tool:claude-code", "glossary:agentic-ai", "glossary:vibe-coding", "glossary:agents-md", "tool:cursor", "tool:codex-cli", "guide:what-is-claude-code"]
faq:
  - q: "How is a coding agent different from autocomplete or an AI chat?"
    a: "Autocomplete predicts the next few tokens where your cursor is; you stay in control of every keystroke. A chat assistant answers questions and drafts code you paste in. A coding agent takes a task, reads the repository itself, decides which files to change, runs commands and tests, reads the results, and keeps going until the task is done or it needs your input."
  - q: "Where do coding agents run?"
    a: "In the terminal (Claude Code, Codex CLI, Gemini CLI), inside an editor (Cursor's agent, the Claude Code VS Code extension, Copilot in VS Code), in the cloud attached to a repository (Copilot's cloud agent, Codex cloud tasks), and in CI pipelines. The same agent often runs in several of these surfaces with shared instruction files."
  - q: "How do you control what a coding agent does?"
    a: "Through permission modes and approvals for file edits and shell commands, instruction files such as AGENTS.md or CLAUDE.md that set conventions and boundaries, hooks or sandboxes that enforce hard rules mechanically, and review of the resulting diff before it merges."
summary: "An AI coding agent is software that completes a programming task autonomously: it reads the codebase, plans, edits files, runs commands and tests, reads the output and iterates until done. That loop separates it from autocomplete, which predicts tokens, and chat, which only drafts. Examples: Claude Code, Codex CLI, Gemini CLI, Cursor's agent."
---

**An AI coding agent is a program that takes a software task in plain language and works through it on its own: reading the codebase, forming a plan, editing files, running build and test commands, reading what came back, and iterating until the task is done or a human is needed.** The defining feature is the loop, not the model. A chat assistant generates text once; an agent acts, observes, and acts again.

The loop separates the three ways developers use AI for code. **Autocomplete** predicts the next tokens at the cursor; the developer types, accepts or rejects, and stays in control of every line. **Chat assistants** answer questions and draft code that the developer pastes in and runs. A **coding agent** owns the task end to end: it decides which files matter, makes the edits, runs the tests, reads the failure, fixes it, and reports back with a diff. It is [agentic AI](/glossary/agentic-ai) applied to a repository; the same act-observe-act loop pointed at the web is an [agentic browser](/glossary/agentic-browser).

Coding agents run in several places. Terminal agents such as [Claude Code](/tools/claude-code), [Codex CLI](/tools/codex-cli) and Gemini CLI live in the shell. Editor agents such as [Cursor](/tools/cursor)'s add visual diffs and plan review. Cloud agents attach to a repository and open pull requests. [The open-source and CLI coding agents guide](/guides/prompting/ai-coding-agents-cli-2026) compares the terminal tier.

Because an agent runs commands, control matters more than it does for a chat window. Permission modes decide which edits and shell commands need approval; instruction files such as [AGENTS.md](/glossary/agents-md) and CLAUDE.md carry conventions, commands and boundaries into every session; hooks and sandboxes enforce rules the model might forget; connected MCP servers need vetting against [tool poisoning](/glossary/tool-poisoning); and the diff still gets reviewed before it merges. Accepting an agent's output without reading the code is [vibe coding](/glossary/vibe-coding), with its own trade-offs. [What is Claude Code](/guides/getting-started/what-is-claude-code) shows one agent's loop.
