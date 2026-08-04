---
term: "Vibe Coding"
description: "Vibe coding is building software by describing intent in natural language and letting an AI agent write the code, judging results by behavior."
date: 2026-06-11
topics: ["workflow-prompting"]
tags: ["vibe-coding", "ai-coding", "agents", "workflow"]
related: ["guide:what-is-claude-code", "guide:cursor-vs-claude-code-vs-copilot-vs-windsurf-2026", "guide:prompt-patterns", "glossary:ai-agent", "glossary:agentic-ai"]
faq:
  - q: "Who coined the term vibe coding?"
    a: "Andrej Karpathy popularized it in early 2025, describing a style of building where you 'fully give in to the vibes' — prompting an AI for code, accepting its output, and steering by running the result rather than reviewing every diff."
  - q: "Is vibe coding bad practice?"
    a: "It depends entirely on the stakes. For prototypes, internal tools, and exploration, it's a legitimate speed multiplier. For production systems, unreviewed AI code accumulates risk — security holes, hidden assumptions, unmaintainable structure — so professional workflows keep human review, tests, and permission guardrails in the loop even when the AI writes most of the code."
---

**Vibe coding is a style of software development where you describe what you want in natural language, let an AI coding agent generate the implementation, and evaluate the result by how it behaves — running it, clicking through it — rather than by reading every line of code.**

The term was popularized by Andrej Karpathy in early 2025 and named something real: with agentic tools like [Claude Code](/tools/claude-code), [Cursor](/tools/cursor), and [v0](/tools/v0), the bottleneck shifted from writing code to specifying intent and verifying outcomes. By 2026, surveys put AI-generated code at roughly half of all new code at many companies, and "which agent fits your workflow" replaced "should we use AI" as the practical question.

The distinction that matters is stakes. Vibe coding shines where iteration speed beats rigor — prototypes, personal tools, UI exploration. It bites where unreviewed code carries real risk: anything handling money, auth, or other people's data. Professional agentic workflows split the difference — the AI writes most of the code, but tests, [permission guardrails](/guides/configuration/claude-code-settings-permissions), and human review of the diff stay in the loop.

For the disciplined version of this workflow, start with [What Is Claude Code?](/guides/getting-started/what-is-claude-code) and [Prompt Patterns for Coding Agents](/guides/prompting/prompt-patterns).
