---
title: "AI Coding Statistics 2026: The Numbers That Are Actually Sourced"
description: "How much code AI writes, who uses the tools, and what it does to quality — every statistic dated and traced to its primary source, updated on a cadence."
author: "Imtiaz Rayhan"
date: 2026-07-01
freshness: "tier1"
updated: 2026-11-25
reviewed: 2026-11-25
color: "green"
topics: ["coding-languages", "ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["statistics", "ai-coding", "data", "adoption", "research"]
featured: true
summary: "The sourced numbers, November 2026: Stack Overflow's 2026 survey shows 80%+ daily AI tool use with coding agents (66%) passing chatbots (63%); GitHub Octoverse 2026 puts 40%+ of formal PRs as agent-started; Google reports 75% of new code is AI-generated; Copilot hit 50M users; SpaceX closed its $60B Cursor deal; and DORA 2026 plus the METR RCT show ROI depends on verification."
keyTakeaways:
  - "The code-share headline: Google reports 75% of its new code is AI-generated and engineer-approved (April 2026, up from ~25% in late 2024); GitHub Octoverse 2026 reports over 40% of formal pull requests now start with an AI agent."
  - "Daily usage is now the norm: Stack Overflow's 2026 Developer Survey shows >80% of developers using AI tools daily (~73% coding assistants/agents daily), with 31% of daily AI users spending 4+ hours/day."
  - "Agents surpassed chatbots in 2026: Stack Overflow 2026 shows coding assistants and agents (66%) overtaking general-purpose chatbots (63%) for the first time, with 67% generating code in familiar areas and 61% debugging — yet only 20% trust AI for production ops."
  - "The productivity evidence remains nuanced: DORA 2026 frames AI as an organizational amplifier with a real J-curve verification tax before ROI shows up; the METR RCT found experienced devs 19% slower on early-2025 tools while believing they were faster."
  - "Review — not writing — is the new bottleneck: trust lags adoption, GitClear measured rising code duplication across 623M changes, and LinearB benchmarks show AI-generated PRs waiting longer in human review queues."
  - "The category's biggest deal closed in August 2026: SpaceX completed its all-stock acquisition of Cursor (Anysphere) on August 14, 2026 at a $60B implied equity value, per its SEC 8-K."
faq:
  - q: "What percentage of code is written by AI in 2026?"
    a: "The best-sourced datapoint: Google's CEO stated in April 2026 that 75% of the company's new code is AI-generated and approved by engineers — up from 'more than 25%' in late 2024 and 'well over 30%' in early 2025. Microsoft reported 20–30% in April 2025. Industry-wide there's no single credible figure; one external analysis cited by Anthropic put Claude Code alone at ~4% of all public GitHub commits by February 2026."
  - q: "Does AI actually make developers faster?"
    a: "The honest answer is contested. Self-reports say yes (>80% in DORA 2025 perceive productivity gains; 69% of agent users in Stack Overflow's survey). The one randomized controlled trial — METR, July 2025 — found experienced open-source developers 19% slower with early-2025 tools on real tasks, while believing they were ~20% faster (METR's February 2026 follow-up on newer tools found point estimates tilting toward a modest speedup, but the confidence intervals cross zero and METR calls it only very weak evidence). DORA's org-level data found AI adoption associated with higher delivery throughput but lower stability. Perception, task type, and skill clearly mediate; treat blanket productivity claims skeptically."
  - q: "What's the most popular AI coding tool in 2026?"
    a: "By the Pragmatic Engineer survey (906 engineers, early 2026, senior-skewed): Claude Code is both most-used and most-loved (46% 'most loved' vs Cursor's 19% and Copilot's 9%). By raw scale, GitHub Copilot's 50M users (Microsoft, July 2026; its last disclosed paid count was 4.7M in January) remain the biggest footprint, and OpenAI's Codex reported 5M+ weekly active users in June 2026 — its product lead posted 25M 'active users' on August 31, a looser metric. Different metrics crown different tools — usage breadth, paid depth, and developer preference are three different races."
  - q: "Where do these numbers come from?"
    a: "Every statistic on this page carries its source, date, and a quality label — primary (the organization's own announcement or data), survey (named methodology), or reported (credible press citing a primary). Widely-circulated numbers we could not trace to a credible source are deliberately omitted."
related: ["guide:claude-vs-gpt-vs-gemini-coding", "guide:vibe-coding-guide", "guide:ai-coding-agents-cli-2026", "guide:best-claude-code-agents-skills", "guide:mcp-ecosystem-statistics", "guide:ai-engineer-roadmap-2026", "guide:testing-ai-generated-code"]
---

AI-coding statistics are mostly laundered guesses — numbers that trace to an SEO listicle citing another listicle. This page is the opposite: **every figure below is dated, sourced, and labeled** (primary / survey / reported), verified November 25, 2026, and refreshed on a cadence. Numbers we couldn't trace are omitted.

## How much code does AI write?

- **75% of new code at Google** is AI-generated and engineer-approved — Sundar Pichai, Cloud Next, **April 2026** *(primary)*. The trajectory: >25% (Oct 2024) → "more than 30%" (Apr 2025) → ~50% (fall 2025) → 75%.
- **Over 40% of formal GitHub pull requests** now start with an AI agent rather than a human opening the first draft — **GitHub Octoverse 2026**, **fall 2026** *(primary)*, accelerating past Microsoft's July 2026 figure of 1 in 3 PRs involving an agent.
- **20–30% of code in Microsoft's repos** "written by software" — Satya Nadella, **April 2025** *(reported)*.
- **~4% of all public GitHub commits** authored by Claude Code, per an external analysis cited in Anthropic's Series G announcement, **February 2026** *(primary, second-hand analysis)*.
- Context for scale: GitHub logged **nearly 1 billion commits in 2025** (+25% YoY), with **1.1M+ public repos importing an LLM SDK** (+178% YoY) — Octoverse, **October 2025** *(primary)*; Octoverse **2026** kept TypeScript #1 overall with Rust surging over 160%.

## Who's using the tools

- **Over 80% of developers** use AI tools in daily work (~73% using coding assistants or agents daily), and **31% of daily AI users spend 4+ hours/day** with them — **Stack Overflow Developer Survey 2026** *(survey)*. For the first time, **coding assistants and agents (66%) surpassed general-purpose chatbots (63%)**. Usage stays concentrated close to the code: **67%** generate code in familiar areas and **61%** debug with AI, while only **20%** trust AI to deploy or operate production systems. (Baseline from SO 2025: 84% using or planning AI tools, 51% daily, 46% distrusting accuracy, 66% frustrated by "almost right" answers.)
- **90%** of tech professionals use AI at work (+14 pts YoY), median **2 hours/day** with AI — DORA, ~5,000 surveyed, **September 2025** *(survey)*; DORA's **2026** guidance shifted focus from raw adoption to measuring net ROI after verification rework.
- **85%** regularly use AI tools; 68% expect AI proficiency to become a job requirement — JetBrains State of the Developer Ecosystem, 24,534 devs, **October 2025** *(survey)*.
- **Agents specifically:** 31% of developers used AI agents in 2025 (SO 2025); by early 2026, **55%** of engineers used agents regularly — 63.5% among staff+ — Pragmatic Engineer survey, 906 respondents *(survey; self-selected, senior-skewed sample)*; and Stack Overflow 2026 confirmed agents/coding assistants overtaking standalone chat.
- **Multi-model switching is standard:** platform telemetry in 2026 shows over **60%** of active power users switching across multiple model families depending on whether the task is planning, drafting, or debugging. The [verification stack](/guides/testing/testing-ai-generated-code) exists because trust still lags speed.

## The tool race, by sourced metric

- **Preference:** Claude Code ranked **most-used and most-loved** (46% most-loved, vs Cursor 19%, Copilot 9%) — Pragmatic Engineer, **March 2026** *(survey)*.
- **Benchmarks:** vendor leaderboard claims (SWE-bench Verified, Terminal-Bench, Arena) are a separate race with their own harness, version and staleness caveats; [LLM Benchmarks Explained](/guides/evaluation/llm-benchmarks-explained-2026) says which number means what.
- **Scale:** GitHub Copilot reached **50M users** (Microsoft FY26 Q4 earnings, **July 29, 2026**, *primary*), up from 20M a year earlier; the last disclosed paid figure is **4.7M subscribers**, +75% YoY (January 2026) — the two are not like-for-like. The same call put GitHub at 225M users with **1 in 3 pull requests involving an agent**; ~80% of new GitHub users adopt Copilot in week one (Octoverse, *primary*). Google's Antigravity passed **2.4M weekly active users** (Alphabet Q2 call, July 22, 2026, *primary*).
- **Revenue:** Claude Code hit **$1B run-rate six months after GA** (December 2025) and **>$2.5B by February 2026**, with enterprise over half of it — Anthropic *(primary; no Claude Code breakout since)*. Cursor's annualized revenue climbed from **$2B (February)** to **$3B (late April)** — Bloomberg — to **~$4B (early June 2026)** — Forbes *(reported)*; SpaceX announced its acquisition of Cursor (Anysphere) on June 16 and **closed it on August 14, 2026**, issuing 389.3M Class A shares at a **$60.0B implied equity value** *(primary, SEC 8-K)*. OpenAI's Codex passed **5M weekly active users** (June 2, 2026, *primary*); its product lead posted **25M "active users"** on August 31 *(primary, exec social post — no time window stated, includes non-developer knowledge workers)*.
- **The builders:** Lovable confirmed **$500M ARR** as of June 2026 (up from $400M in February) and raised a **$400M Series C at a $13.3B valuation** on August 12, 2026 *(reported, company-confirmed / primary)*; Bolt went **$0→$20M ARR in two months** post-launch *(reported, founder on record)*.

## What it does to productivity and quality

The honest section. **For:** DORA 2025 found AI adoption *positively associated with delivery throughput* for the first time (a reversal from 2024), and >80% of practitioners perceive productivity gains *(survey)*. **The 2026 nuance:** DORA's **2026** research and ROI guidance explicitly frames AI as an **organizational amplifier** — magnifying strong CI/testing practices while exposing weak ones — and warns teams to budget for a "J-curve" verification tax before net ROI appears *(primary)*. **Against:** the METR randomized controlled trial — the only RCT on experienced developers and real tasks — measured them **19% slower** with early-2025 tools, while they believed they were ~20% faster (**July 2025**, *primary*; a **February 2026** follow-up on late-2025 tools found point estimates tilting toward a modest speedup, but with confidence intervals crossing zero — METR calls it only very weak evidence). **Quality & review bottleneck:** GitClear's analyses — 211M changed lines through 2024, and a June 2026 follow-up over 623M changes — find code duplication rising sharply in the AI era (block duplication up 81% from 2023 to 2026 year-to-date; refactoring down to 3.8% of changes) *(primary, vendor research — affiliation disclosed)*; LinearB's 2026 benchmarks show AI-generated PRs waiting longer in human review queues, shifting the bottleneck from code generation to code review.

The synthesis this page stands behind: **adoption is real and enormous; measured productivity is conditional** — on task, skill, and above all on the [verification practices](/guides/workflow/ai-code-review-workflow) that separate speed from [slop](/glossary/ai-slop).

## Continue exploring

- [Augment Code](/tools/augment-code) — AI coding assistant built for large, real-world codebases — a Context Engine that indexes the whole repo, with agents, chat, and completions in IDEs and a CLI.
- [Trae](/tools/trae) — Trae is an AI-native IDE from ByteDance — a VS Code-style editor with a built-in Builder agent and an autonomous SOLO mode that writes code across a project.
