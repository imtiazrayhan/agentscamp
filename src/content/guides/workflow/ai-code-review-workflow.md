---
title: "An AI Code Review Workflow That Actually Catches Bugs"
description: "Layer the review stack — self-review, AI reviewers, tests, and a human pass focused on what machines miss — into a workflow tuned for AI-written code."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["review-qa"]
tags: ["code-review", "workflow", "ai-review", "quality"]
featured: false
summary: "Review is now a stack, not a person: the authoring agent self-reviews against a checklist, an AI reviewer (bot or fresh subagent) sweeps the diff with repo context, tests gate behavior in CI, and the human pass concentrates on intent, security, design, and scope. Each layer catches what the previous can't; the failure mode is layers that all check the same thing."
keyTakeaways:
  - "Design by failure mode, not redundancy: self-review catches slips, AI review catches contextual bugs and convention drift, tests pin behavior, humans own intent/security/design."
  - "The fresh-context rule is load-bearing — the reviewing agent must not inherit the author's reasoning, or it inherits the author's blind spots and rubber-stamps."
  - "Calibrate the bots on noise: an AI reviewer your team has learned to scroll past is negative value; tune rules and severity until comments are mostly worth reading."
  - "Route human attention by blast radius — auth, money, data, and migrations get interrogation; mechanical changes get the bots plus a skim."
  - "Close the loop: review findings flow back to the agent that wrote the code, and recurring findings become rules (CLAUDE.md, hooks, reviewer config) so the same bug can't keep arriving."
faq:
  - q: "What does a good AI-era review workflow look like?"
    a: "Four layers, cheapest first: (1) the authoring agent self-reviews its diff against an explicit checklist; (2) an AI reviewer with repo context (a PR bot like CodeRabbit/Greptile/Qodo, or a fresh code-reviewer subagent) comments; (3) CI runs the test gate; (4) a human reviews what machines can't judge — should this exist, is it safe, will we maintain it. Findings route back to the authoring agent to fix."
  - q: "Do AI reviewers actually catch real bugs?"
    a: "Yes — particularly contextual ones: the caller you forgot, the convention this file violates, the unhandled error path, the contract drift between modules. Their blind spots are intent (solving the wrong problem fluently) and taste. Treat them as tireless mid-level reviewers: high recall on mechanical and contextual issues, zero authority on whether the change is right."
  - q: "How do we stop ignoring the bot's comments?"
    a: "Treat noise as a config bug. Tune severity thresholds, encode your standards as rules (most tools take plain-English rules; several read CLAUDE.md), and prune comment classes the team consistently rejects. The metric that matters is comment acceptance rate — if it's low, fix the reviewer before blaming the team."
  - q: "Where do humans add value if bots and tests pass?"
    a: "Exactly where green can lie: security that functions correctly, architecture and extensibility, performance under real load, privacy/compliance, and scope — code that does more than asked. Plus the only question no machine owns: is this the right change at all?"
related: ["best-ai-code-review-tools-2026", "code-reviewer", "review-pr", "testing-ai-generated-code", "multi-agent-orchestration", "claude-code-hooks", "greptile"]
---

When agents write most of a diff, "get a human to read it" stops being a review strategy — there's too much code and too little human. The teams holding quality steady didn't lower the bar; they **rebuilt review as a stack**, each layer catching what the others structurally can't.

## The four layers

**1. Author self-review (free, immediate).** Before anything ships, the authoring agent reviews its own diff against an explicit checklist — error handling, edge cases, no scope creep, conventions followed. This catches the slips, not the blind spots (the author rationalized those into existence), but it's zero-cost filtration that keeps the next layers signal-rich. Encode it in the task prompt or a [skill](/guides/skills/writing-your-first-skill); enforce mechanics (format, lint) with [hooks](/guides/configuration/claude-code-hooks) so they're not review topics at all.

**2. AI review with fresh context (the workhorse).** A reviewer that did *not* watch the code get written sweeps the diff with repo-wide context: a PR bot — [Greptile](/tools/greptile) for codebase-deep bug hunting, [Qodo](/tools/qodo) for rule governance, CodeRabbit for ergonomics ([the comparison](/guides/comparisons/best-ai-code-review-tools-2026)) — or, inside the session, a [code-reviewer subagent](/agents/quality-security/code-reviewer) given *only the diff and the requirements*. The fresh-context rule is the whole trick: inherit the author's reasoning and you've built an expensive rubber stamp ([the critic pattern](/guides/advanced/multi-agent-orchestration)).

**3. The test gate (behavior, pinned).** CI runs the suite that defines done — ideally written *before* the implementation ([the contract model](/guides/testing/testing-ai-generated-code)). Green means the promised behavior holds; review layers above stop re-litigating it.

**4. The human pass (judgment, concentrated).** With correctness largely machine-verified, human attention goes where machines are blind: **security that works** (injection with correct output), **design and extensibility** (the month-six bill), **performance under load**, **scope** (did it do more than asked?), and the unautomatable question — *should this change exist?* Route by blast radius: auth, money, data, and migrations get interrogation; mechanical sweeps get a skim over the bots' verdicts ([review-pr](/commands/review/review-pr) encodes the rubric).

## Making the stack actually work

- **Tune for acceptance rate.** An AI reviewer the team scrolls past is negative value — it trains comment-blindness that bleeds onto real findings. Prune noisy comment classes, set severities, and encode standards as rules (several tools read your `CLAUDE.md` directly).
- **Close the loop to the author.** Findings should flow back to the agent that wrote the code — bots like Greptile hand off to Claude Code directly, and in-session critics return structured verdicts the author iterates on. Review that ends in a human typing fixes wastes the whole architecture.
- **Compile recurring findings into prevention.** The third time any reviewer flags the same pattern, it stops being a comment and becomes a rule — CLAUDE.md convention, a hook that blocks it, a reviewer rule that auto-enforces. The stack's job is to shrink its own workload.
- **Keep one honest metric:** escaped defects (bugs found after merge). If it rises while dashboards stay green, a layer is checking the wrong thing — usually layers 1–2 duplicating each other while security and scope go unwatched.

The destination isn't "AI reviews AI" theater — it's a pipeline where each verifier is placed against the failure mode it actually catches, and human judgment, the scarcest input, is spent only where it's irreplaceable.
