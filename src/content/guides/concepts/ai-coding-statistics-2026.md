---
title: "AI Coding Statistics 2026: The Numbers That Are Actually Sourced"
description: "How much code AI writes, who uses the tools, and what it does to quality — every statistic dated and traced to its primary source, updated on a cadence."
author: "AgentsCamp"
date: 2026-07-01
color: "green"
topics: ["coding-languages", "ai-agents-systems"]
tags: ["statistics", "ai-coding", "data", "adoption", "research"]
featured: true
summary: "The sourced numbers, July 2026: Google says 75% of new code is AI-generated; 84% of developers use or plan AI tools, 51% daily (Stack Overflow); Claude Code passed $2.5B run-rate; SpaceX announced a $60B all-stock deal to acquire Cursor (June 16, closing Q3); and the METR RCT found experienced devs 19% slower. Every figure dated and traced to a primary source."
keyTakeaways:
  - "The code-share headline: Google reports 75% of its new code is AI-generated and engineer-approved (April 2026, up from ~25% in late 2024); Microsoft reported 20–30% a year earlier."
  - "Adoption is near-saturation: 84% of developers use or plan AI tools (Stack Overflow, 49k respondents), 90% of tech professionals use AI at work (DORA), 85% regularly (JetBrains) — the question moved from whether to how."
  - "Agents crossed the chasm in 2025–26: 31% of developers used them (SO 2025), 55% of engineers regularly (Pragmatic Engineer 2026, senior-skewed sample), with Claude Code the most-used and most-loved tool in that survey."
  - "The productivity evidence is genuinely mixed: DORA 2025 found AI adoption finally correlating with delivery throughput (but still hurting stability); the METR RCT found experienced devs 19% SLOWER while believing they were faster."
  - "Trust lags usage: 46% of developers distrust AI output accuracy (up from 31% in 2024); the top frustration is AI answers that are 'almost right, but not quite' (66%), with debugging AI-generated code close behind (45%)."
  - "The category's biggest deal yet: on June 16, 2026 SpaceX announced a definitive agreement to acquire Cursor (Anysphere) in a $60B all-stock deal, expected to close Q3 2026."
faq:
  - q: "What percentage of code is written by AI in 2026?"
    a: "The best-sourced datapoint: Google's CEO stated in April 2026 that 75% of the company's new code is AI-generated and approved by engineers — up from 'more than 25%' in late 2024 and 'well over 30%' in early 2025. Microsoft reported 20–30% in April 2025. Industry-wide there's no single credible figure; one external analysis cited by Anthropic put Claude Code alone at ~4% of all public GitHub commits by February 2026."
  - q: "Does AI actually make developers faster?"
    a: "The honest answer is contested. Self-reports say yes (>80% in DORA 2025 perceive productivity gains; 69% of agent users in Stack Overflow's survey). The one randomized controlled trial — METR, July 2025 — found experienced open-source developers 19% slower with early-2025 tools on real tasks, while believing they were ~20% faster (METR's February 2026 follow-up on newer tools found the slowdown had flipped to a modest speedup, but labels it only weak evidence). DORA's org-level data found AI adoption associated with higher delivery throughput but lower stability. Perception, task type, and skill clearly mediate; treat blanket productivity claims skeptically."
  - q: "What's the most popular AI coding tool in 2026?"
    a: "By the Pragmatic Engineer survey (906 engineers, early 2026, senior-skewed): Claude Code is both most-used and most-loved (46% 'most loved' vs Cursor's 19% and Copilot's 9%). By raw scale, GitHub Copilot's 20M+ all-time users and 4.7M paid subscribers remain the biggest footprint, and OpenAI's Codex reported 4M+ weekly developers in April 2026. Different metrics crown different tools — usage breadth, paid depth, and developer preference are three different races."
  - q: "Where do these numbers come from?"
    a: "Every statistic on this page carries its source, date, and a quality label — primary (the organization's own announcement or data), survey (named methodology), or reported (credible press citing a primary). Widely-circulated numbers we could not trace to a credible source are deliberately omitted."
related: ["guide:claude-vs-gpt-vs-gemini-coding", "guide:vibe-coding-guide", "guide:ai-coding-agents-cli-2026", "guide:best-claude-code-agents-skills", "guide:mcp-ecosystem-statistics", "guide:ai-engineer-roadmap-2026", "guide:testing-ai-generated-code"]
---

AI-coding statistics are mostly laundered guesses — numbers that trace to an SEO listicle citing another listicle. This page is the opposite: **every figure below is dated, sourced, and labeled** (primary / survey / reported), verified July 1, 2026, and refreshed on a cadence. Numbers we couldn't trace are omitted.

## How much code does AI write?

- **75% of new code at Google** is AI-generated and engineer-approved — Sundar Pichai, Cloud Next, **April 2026** *(primary)*. The trajectory: >25% (Oct 2024) → "more than 30%" (Apr 2025) → ~50% (fall 2025) → 75%.
- **20–30% of code in Microsoft's repos** "written by software" — Satya Nadella, **April 2025** *(reported)*.
- **~4% of all public GitHub commits** authored by Claude Code, per an external analysis cited in Anthropic's Series G announcement, **February 2026** *(primary, second-hand analysis)*.
- Context for scale: GitHub logged **nearly 1 billion commits in 2025** (+25% YoY), with **1.1M+ public repos importing an LLM SDK** (+178% YoY) — Octoverse, **October 2025** *(primary)*.

## Who's using the tools

- **84%** of developers use or plan to use AI tools (76% in 2024); **51%** of professional developers use them **daily** — Stack Overflow Developer Survey, 49,000+ respondents, **July 2025** *(survey)*.
- **90%** of tech professionals use AI at work (+14 pts YoY), median **2 hours/day** with AI — DORA, ~5,000 surveyed, **September 2025** *(survey)*.
- **85%** regularly use AI tools; 68% expect AI proficiency to become a job requirement — JetBrains State of the Developer Ecosystem, 24,534 devs, **October 2025** *(survey)*.
- **Agents specifically:** 31% of developers used AI agents in 2025 (SO); by early 2026, **55%** of engineers used agents regularly — 63.5% among staff+ — Pragmatic Engineer survey, 906 respondents, *(survey; self-selected, senior-skewed sample)*.
- **Trust lags:** 46% distrust AI output accuracy (31% in 2024); the top frustration is AI output that's "almost right, but not quite" (66%), with time spent **debugging AI-generated code** close behind (45%) — SO 2025. The [verification stack](/guides/testing/testing-ai-generated-code) exists for a reason.

## The tool race, by sourced metric

- **Preference:** Claude Code ranked **most-used and most-loved** (46% most-loved, vs Cursor 19%, Copilot 9%) — Pragmatic Engineer, **March 2026** *(survey)*.
- **Scale:** GitHub Copilot crossed **20M all-time users** (July 2025) and **4.7M paid subscribers**, +75% YoY (January 2026) *(reported, Microsoft earnings)*; ~80% of new GitHub users adopt Copilot in week one (Octoverse, *primary*).
- **Revenue:** Claude Code hit **$1B run-rate six months after GA** (December 2025) and **>$2.5B by February 2026**, with enterprise over half of it — Anthropic *(primary)*. Cursor's annualized revenue climbed from **$2B (February)** to **$3B (late April)** to **~$4B (early June 2026)** — Bloomberg/TechCrunch/Dealroom *(reported)*; on **June 16, 2026** SpaceX announced a definitive agreement to acquire Cursor (Anysphere) in a **$60B all-stock** deal, expected to close Q3 2026 *(reported, deal announced)*. OpenAI's Codex claimed **4M+ weekly developers** (April 2026, *primary*).
- **The builders:** Lovable confirmed **$400M ARR with 146 employees** (February 2026, after $100M added in a single month) *(reported, company-confirmed)*; Bolt went **$0→$20M ARR in two months** post-launch *(reported, founder on record)*.

## What it does to productivity and quality

The honest section. **For:** DORA 2025 found AI adoption *positively associated with delivery throughput* for the first time (a reversal from 2024), and >80% of practitioners perceive productivity gains *(survey)*. **Against:** the METR randomized controlled trial — the only RCT on experienced developers and real tasks — measured them **19% slower** with early-2025 tools, while they believed they were ~20% faster (**July 2025**, *primary*; a **February 2026** follow-up on late-2025 tools found the effect had flipped to a modest speedup, though METR calls it only weak evidence). **Quality:** GitClear's analysis of 211M changed lines found code duplication rising sharply in the AI era (copy/paste up, refactoring down through 2024) *(primary, vendor research — affiliation disclosed)*; DORA still finds AI adoption *negatively* associated with delivery stability.

The synthesis this page stands behind: **adoption is real and enormous; measured productivity is conditional** — on task, skill, and above all on the [verification practices](/guides/workflow/ai-code-review-workflow) that separate speed from [slop](/glossary/ai-slop).

## Continue exploring

- [Augment Code](/tools/augment-code) — AI coding assistant built for large, real-world codebases — a Context Engine that indexes the whole repo, with agents, chat, and completions in IDEs and a CLI.
- [Trae](/tools/trae) — Trae is an AI-native IDE from ByteDance — a VS Code-style editor with a built-in Builder agent and an autonomous SOLO mode that writes code across a project.
