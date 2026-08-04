---
name: "human-in-the-loop-gate"
description: "Add a human approval checkpoint to an agent so it pauses before a risky or irreversible action (spending money, deleting data, sending messages, merging code) and resumes only after a human approves. Use when an agent acts autonomously on consequential operations."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "pink"
date: 2026-06-03
topics: ["ai-agents-systems"]
related: ["command:add-human-approval", "agent:agent-reliability-reviewer", "guide:production-tool-calling", "guide:agent-frameworks-2026"]
featured: false
summary: "Autonomy is great until an agent does something irreversible. This skill inserts a human-in-the-loop gate: classify which actions are consequential, interrupt the agent before them with the proposed action and its context, and resume (or abort) based on the human's decision — durably, so a restart doesn't lose state."
---

An agent that can act autonomously will eventually try to do something you'd want to stop — spend money, delete a record, email a customer, force-push to main. A human-in-the-loop (HITL) gate makes consequential actions **require approval** without turning the whole agent into a manual tool. This skill adds that gate cleanly.

## When to use this skill

- An agent performs irreversible or costly actions (payments, deletions, deploys, outbound messages, merges).
- You're moving an agent from a trusted sandbox toward production or real-user traffic.
- A compliance or safety requirement mandates a human checkpoint before certain operations.

## Instructions

1. **Classify actions by consequence.** Separate reversible/cheap actions (read a file, search) the agent may do freely from consequential ones (write to prod, spend, send, delete) that require approval. Gate only the latter — gating everything destroys the point of an agent.
2. **Interrupt before the action, not after.** At the gate, pause the agent and surface the **proposed action plus its context**: exactly what it will do, the arguments, and why. The human approves, edits, or rejects.
3. **Make the pause durable.** Persist agent state at the interrupt (checkpoint) so approval can come seconds or hours later, and a process restart doesn't lose the run. Frameworks like [LangGraph](/tools/langgraph) provide interrupt/resume primitives; for others, persist state explicitly.
4. **Handle all three outcomes.** Approve → resume from the checkpoint. Edit → resume with the modified action. Reject → abort safely (no partial side effects) and record the reason.
5. **Fail safe and audit.** Default to *not acting* on timeout or ambiguity, and log every gated decision (action, context, who approved, outcome) for accountability.
6. **Right-size the friction.** Too many prompts and humans rubber-stamp; too few and risky actions slip through. Gate by genuine blast radius, and consider thresholds (e.g. approve refunds over $X).

> [!WARNING]
> A gate that fires on everything trains humans to approve blindly — which is worse than no gate, because it looks safe. Gate only genuinely consequential actions, and show enough context to make a real decision.

> [!NOTE]
> The gate must be enforced where the action executes (the tool layer), not just requested in the prompt. A prompt instruction to "ask first" is a suggestion; a code-level interrupt is a guarantee.

## Output

A working approval gate: the action-consequence classification, the interrupt/resume implementation with durable state, the approve/edit/reject handling, fail-safe defaults, and an audit log of decisions.
