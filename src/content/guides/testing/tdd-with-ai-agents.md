---
title: "TDD with AI Agents: Red-Green as an Agent Loop"
description: "Test-driven development found its killer app: agents. How write-the-test-first turns AI coding into a verifiable loop, and the workflow that makes it stick."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["review-qa", "workflow-prompting"]
tags: ["tdd", "testing", "agents", "workflow"]
featured: false
summary: "TDD and agents are a natural fit because the agentic loop needs exactly what TDD provides: a machine-checkable definition of done. The workflow — human (or agent, then human-reviewed) writes the failing test; agent implements until green without touching the test; refactor with the net in place — converts 'did the AI get it right?' from a reading problem into a running problem."
keyTakeaways:
  - "Agents made TDD's economics flip: the discipline's old cost (writing tests first feels slow) collapses when an agent drafts the tests and another makes them pass."
  - "A failing test is the perfect agent prompt — unambiguous, self-verifying, and immune to the agent declaring victory early."
  - "The cardinal rule is test immutability during implementation: the agent makes the test pass, never edits it to pass — enforce it in instructions or hooks."
  - "Red-green-refactor maps cleanly onto agent ergonomics: red (review the spec-as-test), green (agent iterates against failure output), refactor (agent cleans up under the net)."
  - "TDD doesn't suit everything — exploration and UI taste resist it — but for behavior with a definable contract, it's the highest-trust agent workflow there is."
faq:
  - q: "Why does TDD work so well with AI agents?"
    a: "Because the agent loop runs on verifiable feedback, and a failing test is the cleanest feedback that exists: run, read the failure, edit, repeat — no human judging each iteration. It also kills the two classic agent failure modes at once: premature success claims (the suite disagrees) and specification drift (the test IS the spec, in executable form)."
  - q: "Who writes the test — me or the agent?"
    a: "Either, with one constant: a human reviews the test. Practical default — agent drafts tests from the requirement (breadth is its strength), you edit the assertions until they encode what you actually mean, THEN implementation starts (ideally a fresh session, so the implementer pursues the test rather than its own earlier guesses)."
  - q: "How do I stop the agent from just changing the test?"
    a: "State it as a hard rule in the task ('make this pass; the test file is read-only'), and enforce mechanically where stakes warrant: a PreToolUse hook or permission rule denying edits to the test path during the task. If the agent believes the test itself is wrong, the instruction is to STOP and say so — that disagreement is exactly what you want surfaced."
  - q: "Does this replace normal code review?"
    a: "It narrows it productively. Green suite = the contract holds, so review stops re-deriving correctness and spends on what tests can't see: security, performance, design, scope creep. Tests buy trust in behavior; review buys trust in everything else."
related: ["testing-ai-generated-code", "write-tests", "fix-failing-test", "test-scaffolder", "claude-code-hooks", "what-is-claude-code", "spec-driven-development"]
---

Test-driven development spent twenty years as the discipline everyone praised and few sustained — the upfront cost kept losing to deadline gravity. Then agents arrived and inverted the economics: **the agentic loop needs a machine-checkable goal, and TDD is a machine for producing exactly those.** The old chore became the highest-trust way to direct an AI.

## Why the fit is structural

An [agent](/guides/getting-started/what-is-claude-code) works by acting, observing, and iterating. Give it a vague goal ("add retry logic") and the loop has no honest termination — it stops when output *looks* done. Give it a **failing test** and everything snaps into place:

- The goal is unambiguous: make this red turn green.
- Feedback is free: every run's failure output tells the agent what to fix next — no human in the inner loop.
- Victory is checkable: the agent can't talk its way past a red suite.
- The spec survives: requirements live in an executable file, not scrollback — kin to [spec-driven development](/guides/workflow/spec-driven-development), at function scale.

## The workflow

**Red — author the contract.** Write the failing test, or better: have the agent *draft* tests from the requirement and edit the assertions until they say what you mean ([write-tests](/commands/testing/write-tests) / [test-scaffolder](/skills/testing/test-scaffolder) start this). Your review effort lands here, on twenty readable lines — this is the step where thinking happens.

**Green — turn the agent loose.** Fresh session ideally, with the rule stated plainly: *make `retry.test.ts` pass; the test file is read-only; if you believe the test is wrong, stop and explain.* The agent runs the suite, reads failures, edits, repeats — the [fix-failing-test](/commands/testing/fix-failing-test) loop pointed at tests-as-spec. For stakes, make immutability mechanical: a [hook or permission rule](/guides/configuration/claude-code-hooks) denying edits to the test path during the task converts a polite request into physics.

**Refactor — clean under the net.** With green as the invariant, ask for the cleanup pass: naming, duplication, structure. The suite catches regressions instantly, which is precisely the condition under which agent refactoring is safe.

> [!WARNING]
> The one corruption to guard against absolutely: an agent "fixing" the test to match buggy code. It's rare with clear instructions, catastrophic when missed, and trivially prevented — diff review always shows test files, and hooks can forbid the edit outright. Test immutability during implementation is the whole game's integrity.

## Where TDD-with-agents isn't the tool

Honesty clause: TDD presumes you can state the contract first. **Exploration** (you don't know what you want yet — [vibe-code](/guides/prompting/vibe-coding-guide) the spike, then TDD the real build), **UI taste** (the test is your eyes), and **glue with trivial logic** all resist it. The heuristic: if you can finish the sentence "done means…" with something checkable, lead with the test; if you can't, that sentence is the work — go find it first.

For the wider verification stack around this loop — reviewing agent-written tests, the self-grading trap, what tests can't see — continue with [How to Test AI-Generated Code](/guides/testing/testing-ai-generated-code).
