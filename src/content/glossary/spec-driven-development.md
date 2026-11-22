---
term: "Spec-Driven Development (SDD)"
description: "Spec-driven development is a way of building with AI coding agents where a written spec, not the prompt or the code, is the source of truth for the work."
date: 2026-11-18
topics: ["workflow-prompting", "ai-agents-systems"]
audience: ["developers"]
tags: ["spec-driven-development", "sdd", "spec-kit", "kiro", "ai-coding-agents"]
related: ["guide:spec-driven-development", "tool:spec-kit", "tool:kiro", "guide:best-spec-driven-development-tools-2026", "glossary:vibe-coding", "command:plan-feature"]
faq:
  - q: "Is spec-driven development just writing a detailed prompt?"
    a: "No. A prompt is used once and scrolls away; a spec is a file kept in the repo, reviewed, versioned and re-read by new sessions. Spec-driven tools also split the work into reviewed stages, so you approve requirements and a plan before any code exists. GitHub's Spec Kit launch post described the shift as moving from 'code is the source of truth' to 'intent is the source of truth.'"
  - q: "What files does a spec-driven workflow produce?"
    a: "It depends on the tool. Kiro generates requirements.md (or bugfix.md for bugs), design.md and tasks.md, and writes requirements in EARS notation: WHEN [condition/event] THE SYSTEM SHALL [expected behavior]. GitHub Spec Kit produces spec.md, plan.md and tasks.md through its specify, plan and tasks steps; in Claude Code those steps install as skills you invoke as /speckit-specify, /speckit-plan and so on."
  - q: "What do spec-first, spec-anchored and spec-as-source mean?"
    a: "They are three levels of commitment described in an analysis on Martin Fowler's site. Spec-first means a spec is written before the task and used during AI-assisted work. Spec-anchored means the spec is kept after the task is complete. Spec-as-source means the spec is the main source file over time, and humans edit only the spec."
summary: "Spec-driven development (SDD) is a workflow for AI coding agents: you write a specification of what to build and why, review a plan and task list derived from it, and the agent implements against those files. GitHub's Spec Kit and Kiro are built around it. The spec lives in the repo, so every session and teammate works from the same intent."
---

**Spec-driven development (SDD) is a way of working with AI coding agents in which a written specification, not the conversation or the code, is the primary artifact: you describe what to build and why, review a plan and task list derived from it, and the agent implements against those files.**

GitHub framed the idea when it released [Spec Kit](/tools/spec-kit) in September 2025, describing specs "not as static documents, but as living, executable artifacts that evolve with the project," and the shift as moving from "code is the source of truth" to "intent is the source of truth." Spec Kit's core steps run constitution, specify, plan, tasks and implement, plus a converge step that assesses the implementation against the artifacts and appends remaining work. Optional clarify, analyze and checklist steps act as gates. The specify step captures the what and the why, leaving the tech stack for the plan.

[Kiro](/tools/kiro) takes a similar route with three files per spec: `requirements.md` written in EARS notation (`WHEN [condition/event] THE SYSTEM SHALL [expected behavior]`), `design.md`, and `tasks.md`.

An analysis on Martin Fowler's site separates three levels of commitment. Spec-first writes the spec before the task. Spec-anchored keeps it after the task is done. Spec-as-source makes the spec the main file humans edit.

SDD is the counterpart to [vibe coding](/glossary/vibe-coding): steering moves upstream, where fixing a sentence in a spec is cheaper than fixing a diff. The workflow and when it pays are in [Spec-Driven Development with AI Agents](/guides/workflow/spec-driven-development), and the toolkits are compared in [Best Spec-Driven Development Tools in 2026](/guides/comparisons/best-spec-driven-development-tools-2026).
