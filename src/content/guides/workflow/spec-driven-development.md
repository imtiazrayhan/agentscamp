---
title: "Spec-Driven Development with AI Agents"
description: "Write the spec, let the agent implement against it — the SDD workflow (spec → plan → tasks → implement), when it beats prompt-and-iterate, and the tooling."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["spec-driven", "sdd", "workflow", "agents", "planning"]
featured: false
summary: "Spec-driven development inverts vibe coding: instead of steering an agent with corrective prompts, you invest in a written specification — requirements, constraints, acceptance criteria — and the agent implements against it, typically through a spec → plan → tasks → implement pipeline. It pays on substantial features and team settings; it's overhead for true exploration."
keyTakeaways:
  - "The core inversion: corrections move upstream — fixing a sentence in a spec is cheaper than redirecting an agent mid-implementation, and infinitely cheaper than refactoring accepted code."
  - "The canonical pipeline is spec → plan → tasks → implement, each an artifact you review — small, readable checkpoints instead of one giant diff."
  - "Specs make agent work parallelizable and team-legible: tasks with acceptance criteria can fan out to multiple agents/sessions and survive context resets."
  - "Use SDD for features with real surface area, integrations, and anything multiple sessions or people will touch; skip it for spikes and exploration where the spec would be fiction."
  - "The spec is living documentation: when behavior questions arise later, the answer exists in prose — the artifact vibe coding never leaves behind."
faq:
  - q: "What is spec-driven development for AI agents?"
    a: "A workflow where the primary artifact you author is a specification — what to build, constraints, acceptance criteria — and the agent derives the implementation from it, usually via reviewed intermediate stages (technical plan, then task list, then code). You review small textual artifacts at each gate instead of steering live and reviewing one massive diff."
  - q: "How is this different from just writing a detailed prompt?"
    a: "Persistence, structure, and gates. A prompt is consumed once and lost to the scrollback; a spec is a file — versioned, refined, re-fed to fresh sessions, readable by teammates. And the staged pipeline inserts review where it's cheap: you approve the plan before code exists, so wrong directions die as paragraphs."
  - q: "What is Spec Kit?"
    a: "GitHub's open-source toolkit (September 2025) that productized the workflow: a CLI plus slash commands — specify, plan, tasks, implement — that work inside Claude Code, Copilot, Cursor, and other agents, with a 'constitution' file carrying project principles into every stage. It standardized the spec → plan → tasks → implement shape most teams now use."
  - q: "Does SDD slow you down?"
    a: "On small or exploratory work, yes — writing a spec for a spike is theater. On substantial features it's usually net-faster: the hour of spec writing replaces the day of corrective prompting and rework, parallelizes across agents, and prevents the architecture drift that costs the most later. The honest rule: spec when the work outlives the session."
related: ["tool:spec-kit", "guide:vibe-coding-guide", "command:plan-feature", "command:breakdown-task", "guide:building-multi-step-workflows", "guide:claude-code-memory-context", "skill:adr-writer"]
---

The second generation of agentic-coding wisdom is converging on something almost embarrassingly traditional: **write down what you want before building it.** Spec-driven development (SDD) is that discipline rebuilt for agents — where the spec isn't bureaucracy, it's the *program you write in English*, and the agent is its compiler.

## The inversion

[Vibe coding](/guides/prompting/vibe-coding-guide) steers downstream: prompt, inspect behavior, correct, repeat — every correction spent *after* implementation exists. SDD moves the steering upstream, where it's cheap. The workflow that emerged as canonical — popularized by GitHub's [Spec Kit](/tools/spec-kit) — runs in reviewed stages:

1. **Specify.** Author the spec: the problem, requirements, constraints, *acceptance criteria*. This is the thinking; expect it to be the hard part.
2. **Plan.** The agent derives a technical plan — architecture, components, trade-offs — and you review *that*, killing wrong directions while they're still paragraphs.
3. **Tasks.** The plan decomposes into discrete tasks with checkable outcomes — each sized for a focused session, each independently verifiable.
4. **Implement.** Agents execute tasks against the spec, with tests embodying the acceptance criteria. Review arrives as small, purposeful diffs traceable to requirements.

Each stage gate is the same trick: **review text before code, small before large.** A flawed assumption caught in the plan costs a sentence; caught in the diff, a day.

## Why agents specifically reward this

- **Context is fragile; files aren't.** Sessions compact, reset, and end — a spec on disk re-anchors any session, any agent, any teammate. It's the antidote to "the agent forgot what we agreed" ([the memory mechanics](/guides/configuration/claude-code-memory-context)).
- **Parallelism needs contracts.** Fan tasks out to [parallel sessions](/guides/advanced/parallel-claude-code-worktrees) or multiple agents and the spec is what keeps their outputs composable — shared intent, explicit interfaces.
- **Acceptance criteria become tests.** The spec's "done means…" lines translate directly into the verification that makes accepting agent code safe.
- **The artifact outlives the change.** Six months later, "why does it behave this way?" has a written answer. Vibe coding leaves behavior; SDD leaves *intent*.

## When to spec — and when not to

SDD earns its overhead on **work that outlives the session**: features with real surface area, integrations with contracts, team codebases, anything multiple agents will touch. It's the wrong tool for **exploration** — spikes, prototypes, "what would this feel like" — where the honest spec doesn't exist yet and writing one is fiction. The mature loop uses both: *vibe to discover, spec to build.* Prototype freely; when the throwaway proves the idea, write the spec the prototype taught you, and let agents build the real one against it.

> [!TIP]
> Already inside Claude Code, the lightweight on-ramp is built in: [plan mode](/guides/configuration/claude-code-settings-permissions) plus the [plan-feature](/commands/plan/plan-feature) and [breakdown-task](/commands/plan/breakdown-task) commands give you spec→plan→tasks ergonomics for medium work without adopting a full toolkit; [Spec Kit](/tools/spec-kit) adds the standardized pipeline and constitution when the team wants the whole discipline.

The deeper point survives any particular tool: as implementation gets cheaper, **specification becomes the engineering**. The teams getting the most from agents in 2026 aren't the best prompters — they're the best at saying precisely what they want and proving they got it.
