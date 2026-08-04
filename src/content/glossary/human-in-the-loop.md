---
term: "Human-in-the-Loop (HITL)"
description: "Human-in-the-loop design inserts human judgment at decisive points in an AI workflow — approving actions, resolving ambiguity, owning the irreversible steps."
date: 2026-06-11
topics: ["ai-agents-systems"]
tags: ["hitl", "agents", "safety", "workflow"]
related: ["skill:human-in-the-loop-gate", "command:add-human-approval", "glossary:agentic-ai", "guide:claude-code-settings-permissions", "agent:agent-reliability-reviewer"]
faq:
  - q: "Where should the human be in the loop?"
    a: "At the points where errors are expensive or irreversible: before deploys, payments, deletions, and external sends; when the agent's confidence is low or inputs are ambiguous; and at plan-approval time for large changes. Everywhere else, approval friction just trains people to click yes — gate the decisive moments, automate the rest."
  - q: "Does human-in-the-loop defeat the point of agents?"
    a: "No — it's what makes real autonomy shippable. A well-placed gate converts 'we can't let an agent do this' into 'the agent does 95% and a human owns the 5% that matters.' The failure mode to avoid is rubber-stamping: too many low-stakes approvals and the human stops reading them, which is worse than fewer, sharper gates."
---

**Human-in-the-loop (HITL) is the design principle of placing human judgment at chosen points inside an automated AI workflow — the agent executes, but designated decisions wait for a person.**

It's the practical answer to the autonomy question: not *whether* to trust an [agent](/glossary/ai-agent), but *which steps* require a human's signature. Good HITL design is surgical — gates at the irreversible (deploy, pay, delete, send), the ambiguous (low confidence, conflicting inputs), and the consequential (plan approval before a large change), with everything routine left to run. The anti-pattern is blanket approval prompts, which produce click-through fatigue and *less* real oversight than a few sharp gates.

Mechanically, gates range from interactive prompts (Claude Code's [permission system](/guides/configuration/claude-code-settings-permissions) is HITL built into the harness) to asynchronous approval steps in pipelines — pause, notify, resume on sign-off. Adding one to an agent is packaged work: the [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) skill designs the checkpoint, and the [add-human-approval](/commands/scaffold/add-human-approval) command scaffolds it.
