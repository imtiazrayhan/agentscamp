---
title: "Which Claude Plan (and Model) Should a Founder Pay For?"
description: "A decision guide by situation: solo pre-product, an MVP build with Claude Code, ops with Cowork, or a small team. Plan names and model choice, no prices."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["claude", "plans", "pricing", "founders", "claude-code", "cowork"]
featured: false
seoTitle: "Which Claude Plan Should a Founder Pay For? (2026)"
seoDescription: "Pro, Max 5x, Max 20x, Team, or API credits: which Claude plan fits a solo founder, an MVP build, Cowork-driven ops, or a small team, and which model to pick."
keywords: ["which claude plan", "claude plan for founders", "claude pro vs max", "claude team plan startup", "claude code plan"]
summary: "Start on Pro: it includes Claude Code and Cowork and covers a solo founder who is mostly thinking and writing. Move to Max 5x when an MVP build with Claude Code hits the five-hour session limit more than occasionally, and to Max 20x when Claude Code runs most of the day. Go to Team when two people need shared billing. Put scheduled jobs on API credits."
keyTakeaways:
  - "Every paid plan includes Claude Code and Cowork; the tiers differ in usage per five-hour session and per week, not in which surfaces you can open."
  - "Usage is one pool: Anthropic says activity across claude.ai, Claude Code, and Claude Desktop counts against one limit, reset every five hours with a weekly cap."
  - "Solo pre-product: Pro. Building an MVP with Claude Code: Max 5x, then 20x if limits keep hitting. Two or more people: Team, with Premium seats for heavy users."
  - "Scheduled and automated jobs belong on API credits through the Claude Console, where you pay per use instead of against a session limit."
  - "Pick the model per task: fastest for triage and bulk work, middle for most building and writing, top for hard questions. A bigger plan buys hours, not models, with Anthropic's plan-gated Fable model the one exception."
sources:
  - title: "Use Claude Code with your Pro or Max plan"
    url: "https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan"
    publisher: "Anthropic"
  - title: "How do usage and length limits work?"
    url: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work"
    publisher: "Anthropic"
  - title: "What is the Max plan?"
    url: "https://support.claude.com/en/articles/11049741-what-is-the-max-plan"
    publisher: "Anthropic"
  - title: "What is the Pro plan?"
    url: "https://support.claude.com/en/articles/8325606-what-is-the-pro-plan"
    publisher: "Anthropic"
  - title: "What is the Team plan?"
    url: "https://support.claude.com/en/articles/9266767-what-is-the-team-plan"
    publisher: "Anthropic"
faq:
  - q: "Does the free plan include Claude Code?"
    a: "No. Anthropic's quickstart requires a Pro, Max, Team, or Enterprise subscription, a Claude Console account with API credits, or access through a cloud provider. Skills and basic chat are available on Free, but the agent surfaces are not."
  - q: "Should a solo founder start on Pro or Max?"
    a: "Pro, unless you already know Claude Code will run for hours a day. Pro includes Claude Code and Cowork; the difference is how much usage you get per five-hour session. Anthropic's own upgrade guidance is to move to Max 5x when you consistently hit limits, and to Max 20x when 5x is not enough."
  - q: "Is the Team plan worth it for a two-person startup?"
    a: "It is worth it when you need shared billing and admin, or when one person needs a Premium seat for heavy Claude Code use while the other needs a Standard seat. The Team plan requires at least two members and applies usage limits per member, not to the team as a whole. Two Pro accounts are simpler if you do not need any of that."
  - q: "Which Claude model should a founder use?"
    a: "Match it to the task rather than the plan. Use the fastest, cheapest model for classification and bulk rewrites, the middle model for most building and writing, and the top model only for the hard question where quality matters more than speed. Our model guide covers the current lineup; your plan affects how much you can use, not which task each model suits."
related: ["guide:claude-code-for-non-developers", "guide:claude-plans-compared-2026", "guide:choosing-the-right-model", "guide:llm-api-pricing-2026", "guide:claude-for-founders", "tool:claude"]
---

The plan question is simpler than the pricing page makes it look, because every paid Claude plan opens the same doors. Pro, Max, and Team all include Claude Code and Cowork; what changes is how much you can do per five-hour session and per week. So the decision is really a usage forecast. This guide walks it by situation, names the plan, and points to the pages that hold the actual numbers, which move too often to repeat here.

## How limits actually work

Two facts from Anthropic's support docs shape everything below. First, usage is one pool: "your usage of all different Claude product surfaces (claude.ai, Claude Code, Claude Desktop) counts towards the same usage limit." A long Claude Code afternoon means less chat that evening. Second, the pool refills in two rhythms. The session-based allowance resets every five hours, and a separate weekly limit sits on top, applied across all models, with a fixed reset time per account.

What burns usage fastest is also documented: long conversations (especially ones that trigger automatic context management), tool-heavy work such as web search and connectors, larger models, and higher effort settings. Claude Code sessions over many files are the heaviest thing most founders do. If you hit a wall, the options are to wait for the reset, buy extra usage credits, or move the heavy work to the API.

The plan tiers are multipliers on that pool. Pro is the base. Max 5x gives "five times more usage per session than the Pro plan"; Max 20x gives twenty times. On Team, Standard seats get 1.25x Pro and Premium seats 6.25x Pro, with limits per member rather than shared. Those multipliers are the whole difference between the tiers as of September 2026, and the dollar figures behind them are in [Claude plans compared (2026)](/guides/getting-started/claude-plans-compared-2026).

## By situation

### Solo, pre-product, mostly thinking and writing

**Pro.** You are using [claude.ai](/tools/claude) with Projects for the deck, the customer research, and the drafts, trying Claude Code on the [three starter tasks](/guides/founders/claude-code-for-non-developers), and running the occasional Cowork job over a folder. Pro includes all of it. Anthropic's own advice is to upgrade to Max 5x when you "consistently hit limits," which at this stage you will not.

### Building an MVP with Claude Code

**Max 5x, then 20x if you keep hitting the ceiling.** A real build is different: a Claude Code session that reads a codebase, edits a dozen files, runs the app, and iterates on your feedback is the most usage-intensive thing on the list, and a founder building daily hits the Pro session limit early and often. Anthropic's support article on Claude Code frames the upgrade path exactly this way: Max 5x for "larger repositories," Max 20x if you "consistently hit limits" on 5x. Start at 5x and let the reset warnings tell you whether you need 20x. The build workflow itself is in [Build an MVP with Claude Code](/guides/founders/build-an-mvp-with-claude-code).

### Running ops with Cowork

**Pro, or Max 5x if the runs are daily and large.** Cowork jobs, such as summarizing a folder of contracts, producing a weekly report from exports, or filling in a system through the built-in browser, are usually shorter and more bounded than a coding session. Pro covers a few per day. If you have scheduled runs firing every morning across large folders, the weekly limit is what you will feel, and Max 5x buys the headroom. The surface itself is covered in [Claude for Founders: Which Claude Product for Which Job](/guides/founders/claude-for-founders).

### A small team

**Team, with Premium seats for the heavy users.** Once two or more people need Claude, the Team plan gives you one bill, admin controls, and per-member limits so nobody's marathon drains a colleague. It requires at least two members. The seat split matters: give a Premium seat (6.25x Pro) to whoever runs Claude Code most of the day, and Standard seats (1.25x Pro) to everyone using it for writing and chat. Both seat types include Claude Code and Cowork. If all you want is two accounts and no shared admin, two Pro subscriptions are simpler.

### Anything scheduled or automated

**API credits, through the Claude Console.** A nightly data job, a Claude Code routine that triages support tickets, an agent you built to run unattended: these should not compete with your own session limit. Claude Code logs into a Console account with prepaid credits, and you pay per token used rather than against a five-hour window. The per-token rates by model are in [LLM API pricing (2026)](/guides/advanced/llm-api-pricing-2026); the practical rule is that the API is right when the job runs without you, and a subscription is right when you are in the loop.

## Picking a model

Every plan lets you choose the model, and founders overspend by defaulting to the largest. Anthropic ships a family with three tiers: a fast, inexpensive model, a balanced middle model, and a top model for the hardest work. Match the tier to the task:

| Task | Tier | Why |
|---|---|---|
| Sorting, tagging, bulk rewrites, first drafts of routine email | Fastest | Speed and low usage matter more than nuance |
| Most Claude Code building, PRDs, investor updates, research synthesis | Middle | The default for real work; the best quality-per-usage ratio |
| Architecture decisions, a hard financial model, an analysis you will bet on | Top | Quality is the point; use it for the question, not the whole session |

The current names and where each one sits are in [Choosing the right model](/guides/getting-started/choosing-the-right-model). The important point for the plan decision is that model choice is mostly independent of plan: every paid plan gets Opus, so you do not need Max to use the top everyday model, you need Max to use it for hours. The one exception is Anthropic's Fable model, which the pricing page gates by plan (usage credits on Pro, capped on Max, absent on Team, included on Enterprise); the [plans comparison](/guides/getting-started/claude-plans-compared-2026) has the current table.

## The short answer

Start on Pro. Upgrade to Max 5x the week you are building with Claude Code every day and see the session limit twice. Go to 20x only when 5x keeps running out. Switch to Team when a second person needs a seat and you want one bill. Push anything that runs without you onto API credits. Choose the model per task. The numbers behind all of it live in [Claude plans compared (2026)](/guides/getting-started/claude-plans-compared-2026), and the rest of the founder toolkit is at the [founders hub](/for/founders).
