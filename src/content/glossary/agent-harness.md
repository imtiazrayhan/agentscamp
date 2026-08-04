---
term: "Agent Harness"
description: "An agent harness is the system around the model that makes it an agent — the loop, tools, context management, permissions, and recovery machinery."
date: 2026-06-12
topics: ["ai-agents-systems"]
tags: ["harness", "agents", "infrastructure", "agent-engineering"]
related: ["glossary:agent-engineering", "glossary:ai-agent", "guide:what-is-claude-code", "guide:claude-agent-sdk-tutorial", "guide:agent-frameworks-2026", "guide:claude-code-vs-opencode"]
faq:
  - q: "What's the difference between the model and the harness?"
    a: "The model decides; the harness is everything that lets deciding become doing — the execution loop, tool definitions and dispatch, context assembly and compaction, permissions, error feedback, retries, and state. Two products on the same model can perform wildly differently: that gap is harness quality."
  - q: "Why did 'harness' become a 2026 term of art?"
    a: "Because benchmarks and practice both started isolating it: the same model scores differently across coding harnesses, agent products compete on harness engineering (Terminal-Bench explicitly ranks model+harness pairs), and labs now co-train models against their own harnesses. Once the model is a commodity choice, the harness is the product."
---

**An agent harness is everything around the model that turns it into a working agent: the execution loop, tool definitions, context management, permissions, error handling, and recovery — the machinery that converts model decisions into safe, observed actions.**

The term sharpened as the industry learned that **model quality and agent quality are different axes**. A harness determines what the model sees each turn (context assembly, [compaction](/guides/configuration/claude-code-memory-context), memory), what it can do ([tools](/guides/concepts/production-tool-calling) and their schemas), what it may do ([permissions](/guides/configuration/claude-code-settings-permissions) and gates), and how failures feed back (errors as observations, retries, loop detection). Identical models in different harnesses produce visibly different agents — which is why coding-agent comparisons increasingly evaluate model+harness pairs, and why [Claude Code](/guides/getting-started/what-is-claude-code)'s edge is co-tuning both sides.

The word now anchors real decisions: *adopt a harness* (Claude Code, OpenCode, Letta Code — [the comparison axis](/guides/comparisons/claude-code-vs-opencode)), *build on one* (the [Claude Agent SDK](/guides/advanced/claude-agent-sdk-tutorial) is "the harness as a library"), or *assemble your own* from [frameworks](/guides/concepts/agent-frameworks-2026). And it names the discipline around it: [agent engineering](/glossary/agent-engineering) is, in one phrase, harness engineering.
