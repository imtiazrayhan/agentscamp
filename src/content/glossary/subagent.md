---
term: "Subagent"
description: "A subagent is a specialist agent a primary agent delegates to — running in its own context window with its own prompt and tools, returning only a summary."
date: 2026-06-11
topics: ["workflow-prompting"]
tags: ["subagents", "claude-code", "delegation", "agents"]
related: ["guide:getting-started-with-agents", "guide:writing-a-custom-agent", "guide:multi-agent-orchestration", "agent:agent-architect", "glossary:context-window"]
faq:
  - q: "Why use a subagent instead of one bigger prompt?"
    a: "Context isolation. The subagent's noisy work — reading forty files, running a test suite — happens in its own window, and only the distilled result returns to the parent. The main conversation stays sharp, the specialist gets a focused system prompt, and a restricted toolset makes it safer than widening the main agent."
  - q: "How do subagents work in Claude Code?"
    a: "Each is a Markdown file in .claude/agents/ (or ~/.claude/agents/): frontmatter with a name, a description that acts as the routing signal, optional model and tools restrictions, then a system-prompt body. Claude delegates automatically when a task matches the description, or you invoke one by name in plain language."
---

**A subagent is an agent invoked by another agent: a specialist with its own context window, system prompt, and (usually restricted) toolset, which does a delegated job and returns a clean summary to its parent.**

The mechanism buys three things a single thread can't. **Isolation** — a log-trawling investigation burns tokens in the subagent's [context](/glossary/context-window), not yours. **Specialization** — a focused prompt ("you review diffs for security issues; nothing else") outperforms a generalist on its niche. **Safety** — a reviewer with read-only tools physically can't edit code. Those properties make subagents the building block of every [multi-agent pattern](/guides/advanced/multi-agent-orchestration): fan-out, pipelines, orchestrator-worker, and fresh-eyes critics.

In Claude Code they're first-class and file-defined — a Markdown file whose `description` doubles as the delegation router ([getting started](/guides/getting-started/getting-started-with-agents), [writing a good one](/guides/getting-started/writing-a-custom-agent)) — and the hub's [agents directory](/agents) is a library of ready-made ones. The discipline that keeps them useful: one nameable job per agent, and remember they start blank — every constraint must be passed in, because a subagent sees nothing of the parent's conversation.
