---
term: "Agent Skills"
description: "Agent Skills are reusable procedures packaged as folders with a SKILL.md file — loaded by an AI agent on demand when a task matches, now an open standard."
date: 2026-07-18
topics: ["ai-agents-systems", "workflow-prompting"]
tags: ["skills", "skill-md", "claude-code", "agent-skills", "open-standard"]
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:writing-your-first-skill", "guide:skills-vs-agents-vs-commands", "glossary:context-window", "glossary:system-prompt"]
faq:
  - q: "What is the difference between Agent Skills and Claude Skills?"
    a: "Same thing, two scopes. 'Claude Skills' is the everyday name for the feature across Claude Code, claude.ai, and the Claude API; 'Agent Skills' is the format's formal name — and since December 2025, an open standard (agentskills.io) that non-Claude tools like GitHub Copilot, Cursor, and Gemini CLI also implement."
  - q: "Why not just put the instructions in the system prompt?"
    a: "Cost and scale. System-prompt instructions are paid for in every request whether relevant or not. A skill costs only its name and description at rest — the body loads when a task matches, and bundled files later still. That progressive disclosure is what lets an agent carry dozens of procedures affordably."
---

**Agent Skills are reusable procedures packaged as a folder containing a SKILL.md file — YAML frontmatter that tells the agent when the skill applies, plus a Markdown body of instructions it follows once loaded.**

The design solves the standing tension between capability and [context](/glossary/context-window): an agent that carries every procedure in its [system prompt](/glossary/system-prompt) pays for all of them on every request. Skills invert that with progressive disclosure — at session start only each skill's name and description load; the full body loads when a task matches; bundled scripts and references load only when the instructions reach for them. The description doubles as the routing signal, which is why writing it well is [most of the craft](/guides/skills/claude-code-skills-best-practices).

Skills began as a Claude Code feature and became a portable format: the same SKILL.md runs on claude.ai, on the Claude API via `/v1/skills` and code execution, and — since Anthropic published Agent Skills as an open standard in December 2025 — in dozens of third-party tools. The [full guide](/guides/skills/what-are-claude-skills) covers the concept; the [SKILL.md reference](/guides/skills/skill-md-reference) documents every field.
