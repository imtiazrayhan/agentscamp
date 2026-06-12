---
title: "Why Your Agent Loops: Debugging AI Agents"
description: "The recurring agent failure modes — loops, premature victory, tool misuse, context poisoning, scope creep — diagnosed by their signatures, with fixes."
author: "AgentsCamp"
date: 2026-06-12
color: "green"
topics: ["ai-agents-systems"]
tags: ["agents", "debugging", "troubleshooting", "reliability"]
featured: false
summary: "Agent failures are systematic, not random. Loops mean the agent can't perceive progress — fix the feedback. Premature 'done' means no verifiable success signal (make completion checkable). Tool misuse means routing-by-description failed (sharpen names and descriptions). Context poisoning means an early wrong fact keeps steering (checkpoint and restart clean). Diagnose by signature; fix the class."
keyTakeaways:
  - "Read the trace before theorizing: almost every agent bug is visible in the transcript as a specific signature — the same tool call repeating, a wrong assumption echoing, a success claim with no check behind it."
  - "Loops = broken feedback: the agent can't tell its action failed or can't tell it succeeded. Fix what the tool returns (informative errors, changed-state confirmation), then add turn caps as the backstop."
  - "Premature victory = no verification step: agents are optimistic by training. 'Done means this command passes' converts hope into a checkable condition."
  - "Tool misuse = routing failure: vague names/descriptions make the model pick wrong. Disjoint descriptions with use-when/not-when lines fix most of it without touching the model."
  - "Context poisoning compounds: one early wrong fact gets restated until it's load-bearing. Don't argue with a poisoned context — checkpoint, clear, restart with the correction up front."
faq:
  - q: "Why does my agent repeat the same action over and over?"
    a: "It can't perceive progress. Either the action fails identically each time and the error gives no new information (fix: tools return specific, actionable errors — 'file not found: src/auth.ts' beats 'error'), or the action succeeds but nothing in the observation confirms it (fix: tools confirm changed state). Add a loop detector — same tool + same args twice → forced strategy change — and a hard turn cap as the final backstop."
  - q: "Why does my agent say it's done when it isn't?"
    a: "Nothing in its loop requires proof. Models are trained to be helpful and conclusive, so absent a verification step they declare success on plausible-looking work. Make completion executable: 'done means npm test exits 0', 'done means the endpoint returns 200'. For fuzzy tasks, a separate verifier (fresh-context critic) judging against the original requirements catches what self-assessment won't."
  - q: "Why does my agent use the wrong tool?"
    a: "Tool choice is semantic matching against names and descriptions — overlapping or vague ones make the model guess. Make each tool's purpose disjoint and explicit ('use for X; NOT for Y'), name with verb-object precision, and when two tools genuinely overlap, remove one. If it ignores tools entirely and answers from memory, instruct verification-first behavior explicitly."
  - q: "How do I debug a long agent run that went sideways?"
    a: "Find the divergence point, not the crash point: walk the trace to the first step where an assumption went wrong — everything after is usually faithful execution of that mistake. Then fix the class (the tool output, the missing constraint, the ambiguous instruction) and rerun from a checkpoint before the divergence rather than patching downstream symptoms."
related: ["agent-reliability-reviewer", "production-tool-calling", "agent-engineering", "claude-code-troubleshooting", "write-llm-evals", "multi-agent-orchestration", "effective-tool-use"]
---

Agent failures look chaotic — forty turns of confident wrongness — but they're systematic underneath. A handful of failure modes account for nearly everything, each with a recognizable **signature in the trace** and a fix at the *class* level. Debugging agents is mostly learning to read those signatures. (This page covers agents you're *building*; for Claude Code product issues, see [its troubleshooting guide](/guides/troubleshooting/claude-code-troubleshooting).)

## The loop

**Signature:** the same tool call (or trivial variations) repeating; token spend climbing; no state change. **Cause:** broken feedback — the agent either can't tell the action failed (uninformative errors) or can't tell it succeeded (no confirmation in the observation), so its policy never updates. **Fix, in order:** make tools return *informative, differentiated* errors and *changed-state confirmation* ([the tool-calling discipline](/guides/concepts/production-tool-calling)); add loop detection (identical call twice → inject "this approach is failing, change strategy"); cap turns as the backstop, treating the cap as a failed run to diagnose, not retry blindly.

## Premature victory

**Signature:** "I've successfully…" over work that doesn't compile, a test never run, a file never written. **Cause:** no verifiable completion condition — optimism fills the vacuum. **Fix:** define done as something executable and *require the agent to run it* before concluding ("done = `npm test` exits 0"). For tasks without a natural check, bolt one on: a [fresh-context critic](/guides/advanced/multi-agent-orchestration) judging output against the original ask catches the self-grading bias.

## Tool misuse

**Signature:** right intention, wrong tool — or tools ignored in favor of training-data guesses. **Cause:** routing happens by matching intent against tool names/descriptions; overlap and vagueness break it. **Fix:** [disjoint, use-when/not-when descriptions](/guides/prompting/effective-tool-use), verb-object names, fewer overlapping tools. The test: read only your tool list — if *you* couldn't route correctly from it, the model can't.

## Context poisoning

**Signature:** an early wrong fact ("the DB is MySQL") restated turn after turn, surviving corrections, steering everything. **Cause:** transformer attention treats repeated context as established truth; corrections compete with N restatements. **Fix:** don't argue — **restart**. Checkpoint before long runs, and on poisoning, clear and relaunch with the correction stated *first*. Prevention: pass constraints explicitly at task start (subagents inherit nothing), and persist ground truth to files the agent re-reads rather than trusting conversational memory.

## Scope creep and the silent extras

**Signature:** the task done — plus a refactor nobody asked for, three "improved" files, a new dependency. **Cause:** helpfulness bias plus visible-but-irrelevant context. **Fix:** explicit boundaries in the task ("change only X; do not touch Y"), [permission rules](/guides/configuration/claude-code-settings-permissions) that make out-of-scope edits impossible, and diff review that treats unrequested changes as defects regardless of quality.

## Make it stay fixed

Single-run fixes decay; the durable loop is: **trace → classify → fix the class → encode the lesson** — the tool description sharpened, the constraint added to the standing prompt, the verification step made mandatory, the [eval case](/guides/evaluation/write-llm-evals) added so the regression is caught next time. That discipline — failure modes as a checklist applied *before* production — is exactly what the [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) automates.
