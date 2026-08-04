---
term: "AGENTS.md"
description: "AGENTS.md is a versioned instruction file that tells coding agents how to work in a repository — including commands, conventions, boundaries, and checks."
date: 2026-08-04
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["agents-md", "codex", "instructions", "coding-agents", "configuration"]
related: ["guide:codex-agents-md", "guide:openai-codex-guide", "glossary:agent-skills", "glossary:system-prompt", "glossary:context-engineering"]
faq:
  - q: "What does AGENTS.md do?"
    a: "It gives coding agents durable repository context before they work: important paths, setup and verification commands, engineering constraints, and definitions of done. Because the file is committed with the code, the team can review and update the instructions like any other project artifact."
  - q: "Is AGENTS.md only for OpenAI Codex?"
    a: "No. Codex has documented support for layered AGENTS.md files, but AGENTS.md is an open convention used by multiple coding agents. Exact discovery and precedence rules can differ by tool, so keep portable instructions plain and verify behavior in each client."
---

**`AGENTS.md` is a plain-Markdown instruction file that tells coding agents how to work in a repository.** It typically records the project map, build and test commands, coding conventions, safety boundaries, and the checks that define a finished change.

Unlike a task prompt, `AGENTS.md` is durable and versioned with the code. Unlike a [skill](/glossary/agent-skills), it is always-on guidance rather than a procedure loaded for one recognizable workflow. That makes it the right home for facts such as “generated clients are never edited directly” or “changes under this service must run this test command.”

OpenAI Codex supports layered discovery. It can read personal guidance from the Codex home directory, then combine project files from the repository root toward the current working directory. A closer file takes precedence when guidance conflicts, and `AGENTS.override.md` can replace `AGENTS.md` within the same directory. This lets a monorepo define broad rules once while giving a mobile app, infrastructure tree, or service a narrower local contract.

Useful instructions are concrete and observable: exact paths, copyable commands, explicit do-not rules, and change-specific verification. Generic requests to “follow best practices” or “test thoroughly” consume context without telling the agent what action to take.

The [full AGENTS.md guide](/guides/configuration/codex-agents-md) includes a starter template, discovery order, scoping examples, and a verification workflow.
