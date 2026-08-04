---
term: "System Prompt"
description: "The system prompt is the standing instruction layer an LLM receives before user input — defining its role, rules, tools, and tone for the whole conversation."
date: 2026-06-11
topics: ["workflow-prompting"]
tags: ["prompting", "system-prompt", "llm", "configuration"]
related: ["guide:prompt-patterns", "guide:prompting-techniques-2026", "guide:writing-a-custom-agent", "guide:claude-md-best-practices", "glossary:prompt-injection"]
faq:
  - q: "How is a system prompt different from a user prompt?"
    a: "Role and persistence. The system prompt is set by the developer, applies to the entire conversation, and carries the durable rules: who the model is, what it may do, how it should answer. User prompts are the per-turn requests evaluated under those rules. Models are trained to weight system instructions above conflicting user input — that hierarchy is also what injection attacks try to break."
  - q: "What belongs in a system prompt?"
    a: "What must hold on every turn and can't be inferred: the role, hard constraints and refusals, output format, tool-use policy, and the domain context that shapes everything. What doesn't: task-specific details (per-turn), knowledge the model already has, and walls of edge-case advice that dilute the rules that matter."
---

**A system prompt is the instruction layer a language model receives before any user input — the standing definition of its role, rules, capabilities, and tone that governs every turn of the conversation.**

Chat-trained models distinguish message *roles*: system instructions outrank user messages when they conflict, which is what makes the system prompt the right home for invariants — "you are a code reviewer," "never fabricate citations," "output JSON matching this schema." Every serious LLM product is substantially *made of* its system prompt; the same base model becomes a different product under different standing instructions.

Two crafts follow. Writing them well is a discipline of economy — clear role, few load-bearing rules, no generic filler — the same discipline as a [subagent's prompt body](/guides/getting-started/writing-a-custom-agent), and in agentic tools the system layer extends into files like [CLAUDE.md](/guides/configuration/claude-md-best-practices). Defending them matters because the role hierarchy is soft: [prompt injection](/glossary/prompt-injection) is precisely the attempt to make untrusted text outrank the system layer, which is why real guarantees live in architecture, not wording.
