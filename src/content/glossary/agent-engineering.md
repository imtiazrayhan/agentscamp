---
term: "Agent Engineering"
description: "Agent engineering is the discipline of building reliable AI agents — designing the tools, context, guardrails, evals, and recovery paths around the model."
date: 2026-06-11
topics: ["ai-agents-systems"]
tags: ["agent-engineering", "agents", "reliability", "engineering"]
related: ["agentic-ai", "production-tool-calling", "agent-reliability-reviewer", "write-llm-evals", "multi-agent-orchestration", "agent-frameworks-2026"]
faq:
  - q: "How is agent engineering different from prompt engineering?"
    a: "Scope. Prompt engineering optimizes what you say to the model; agent engineering designs the system around it — which tools exist and how they're described, what enters context when, what's allowed without approval, how failures feed back, and how quality is measured. In a production agent, the prompt is one component among many, and rarely the one that fails."
  - q: "What does an agent engineer actually work on?"
    a: "The harness: tool design and error handling, context and memory management, permissioning and guardrails, eval suites that measure end-to-end task success, observability over multi-step runs, and cost/latency budgets. The model is mostly a given; the reliability is built around it."
---

**Agent engineering is the emerging discipline of making AI agents work reliably in production — the design of everything around the model: tools, context, permissions, evaluation, and failure recovery.**

The term took hold as 2026's successor to "prompt engineering," marking a real shift in where the work lives. A capable model is table stakes; whether an [agent](/glossary/ai-agent) ships comes down to harness quality — [tools that fail informatively](/guides/concepts/production-tool-calling), context that stays signal-dense, [guardrails](/glossary/guardrails) and [human gates](/glossary/human-in-the-loop) where stakes demand them, [evals](/guides/evaluation/write-llm-evals) that measure task completion rather than vibes, and observability over runs that span dozens of steps.

Its body of practice is accumulating fast — [framework trade-offs](/guides/concepts/agent-frameworks-2026), [orchestration patterns](/guides/advanced/multi-agent-orchestration), reliability review ([the checklist, as an agent](/agents/meta-orchestration/agent-reliability-reviewer)) — and the role is increasingly a job title: the person who owns why the agent failed at step 14, and who makes step 14 impossible to fail that way again.
