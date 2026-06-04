---
description: "Scaffold a human-in-the-loop approval gate into an agent so it pauses before a consequential action and resumes after approval."
argument-hint: "<the action/tool to gate, or the agent file>"
allowed-tools: "Read, Grep, Glob, Edit, Write"
model: "sonnet"
title: "Add Human Approval Step"
color: "purple"
date: 2026-06-03
topics: ["ai-agents-systems"]
related: ["human-in-the-loop-gate", "agent-reliability-reviewer", "production-tool-calling"]
featured: false
summary: "Wraps a consequential agent action in an approval gate: the agent pauses with the proposed action and context, a human approves/edits/rejects, and it resumes from a durable checkpoint. Scaffolds the interrupt, the three outcome paths, fail-safe defaults, and an audit log."
---

## Scope

Treat `$ARGUMENTS` as the action to gate (e.g. "the refund tool", "the deploy step") or the agent file to modify. Restate what you're gating in one sentence, and confirm it is genuinely consequential — gating cheap, reversible actions adds friction without value.

Goal: insert a human approval checkpoint so the agent **cannot perform the action until a human approves**, enforced at the execution layer (not merely requested in the prompt).

> [!NOTE]
> Enforce the gate where the tool runs, not in the system prompt. A prompt instruction to "ask first" is a suggestion the model can skip; a code-level interrupt is a guarantee.

## Step 1 — Locate the action and the runtime

Find where the consequential action executes (the tool/function call) and identify the agent framework. If it provides interrupt/resume primitives (e.g. [LangGraph](/tools/langgraph)), use them; otherwise scaffold an explicit pause-persist-resume around the call.

## Step 2 — Interrupt before the action

Before the action runs, surface the **proposed action + arguments + context** (what, with what inputs, and why) and pause. Persist agent state at this point so approval can arrive later and survive a restart.

## Step 3 — Handle approve / edit / reject

- **Approve** → resume from the checkpoint and execute.
- **Edit** → resume with the human-modified arguments.
- **Reject** → abort with no partial side effects; record the reason.

## Step 4 — Fail safe and audit

Default to **not acting** on timeout or ambiguity. Log every gated decision (action, context, approver, outcome) for accountability.

## Step 5 — Verify

Show the diff and walk through the three paths. Confirm the action is unreachable without passing the gate, and that a rejected/aborted run leaves no partial effects.

> [!WARNING]
> Don't gate everything — blanket approval prompts train humans to rubber-stamp. Gate by real blast radius (money, data loss, outbound comms, deploys). Pairs with the [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) skill for the design rationale.
