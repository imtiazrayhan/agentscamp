---
title: "Claude Code Usage Limits Explained: Five-Hour Windows, Weekly Caps, and How to Stretch Them"
seoTitle: "Claude Code Usage Limits: Five-Hour Windows, Weekly Caps, Fixes"
description: "How Claude Code usage limits work: the five-hour session limit, weekly caps, what counts toward usage, /usage, usage credits, and eight ways to use less."
seoDescription: "Claude Code usage limits explained: the five-hour session window, weekly caps, the May 2026 doubling, what burns usage, usage credits, and how to use less."
author: "Imtiaz Rayhan"
date: 2026-10-10
color: "green"
depth: standard
topics: ["workflow-prompting"]
audience: ["developers", "founders"]
tags: ["claude-code", "usage-limits", "rate-limits", "plans", "usage-credits"]
keywords: ["Claude Code usage limits", "Claude Code weekly limit", "Claude Code five hour limit", "Claude Code usage credits", "Claude Code hit limit fast"]
summary: "Claude Code draws on your Claude plan's shared limits: a session limit that resets every five hours and a weekly limit that resets at a fixed time assigned to your account, shared with claude.ai and IDE use. Anthropic doubled Claude Code's five-hour limits on May 6, 2026. Long sessions, Opus and subagents drain it fastest; /usage shows why."
keyTakeaways:
  - "Paid plans have two limit types: a session limit that resets every five hours and a weekly limit that resets at a fixed, per-account time. Claude Code, claude.ai, Desktop and IDE use all count against the same pool."
  - "Allowances are only published as multiples of Pro's per-session allowance (Max 5x and 20x, Team Standard 1.25x, Premium 6.25x); no help page states absolute message or hour figures, and the May 6, 2026 doubling made older numbers stale."
  - "Usage climbs because every turn re-sends the whole conversation and project context. A one-line question in an all-day session still pays for the whole history, and /compact is itself a large request."
  - "Run /usage (aliases /cost and /stats) for plan bars, attribution by skill, subagent, plugin and MCP server, and recommendations; /status is the Settings status tab."
  - "When you hit a limit: wait for the reset, use a limit reset if one is offered, switch model family if it is an Opus or Sonnet family limit, or turn on usage credits to continue at API rates."
  - "An API key bypasses plan limits entirely, but it bills every token to your Console or cloud account with no hard stop, and the wrap-up allowance and /usage-credits do not apply."
faq:
  - q: "Does Claude Code have a weekly limit?"
    a: "Yes. Anthropic's help center says both Pro and Max plans have a five-hour session limit and a weekly limit, shared across Claude and Claude Code; Team seats have a weekly limit per member, and Max plans add a separate weekly limit for Fable models. The weekly limit resets at a fixed day and time assigned to your account, which you can see under Settings > Usage on claude.ai."
  - q: "Why did I hit my Claude Code limit so fast?"
    a: "Usually one of four things: a long session, because Claude Code sends the full conversation with every request and even cached history still draws usage; Opus on routine work, which costs several times more per turn than Sonnet; subagents, workflows or agent teams, each of which sends its own requests (agent teams use roughly 7x more tokens when teammates run in plan mode); or a cache miss after a break, which reprocesses your whole context. Run /usage and read the attribution and recommendations rows to see which one it was."
  - q: "Can I use an API key instead of my Claude plan in Claude Code?"
    a: "Yes, but understand the trade. If ANTHROPIC_API_KEY is set, Claude Code uses it instead of your subscription and bills usage at API rates to your Console or cloud account; there is no usage cap and no hard stop. The wrap-up allowance does not apply with an API key, and /usage-credits is unavailable. To go back to plan limits, run claude logout and claude login with only your plan credentials."
  - q: "What is the difference between /usage and /status in Claude Code?"
    a: "/usage shows session cost, plan usage limits and activity stats, with a breakdown of what counts against your plan limits on Pro, Max, Team and Enterprise; /cost and /stats are aliases. /status opens the Settings interface on the Status tab, which shows version, model, account and connectivity. An older help-center article still points to /status for monitoring allocation; the Claude Code docs put the usage bars under /usage."
  - q: "What are usage credits in Claude Code?"
    a: "Usage credits, formerly called extra usage, let paid-plan users keep working after a limit by switching to consumption-based pricing at standard API rates. Enable them under Settings > Usage on claude.ai and prepay funds; in Claude Code, run /usage-credits after signing in with your subscription. They are billed separately from the subscription, stop at your monthly spend limit, and do not change when your limits reset."
sources:
  - title: "How do usage and length limits work?"
    url: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work"
    publisher: "Anthropic"
  - title: "Use Claude Code with your Pro or Max plan"
    url: "https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan"
    publisher: "Anthropic"
  - title: "What is the Max plan?"
    url: "https://support.claude.com/en/articles/11049741-what-is-the-max-plan"
    publisher: "Anthropic"
  - title: "What is the Team plan?"
    url: "https://support.claude.com/en/articles/9266767-what-is-the-team-plan"
    publisher: "Anthropic"
  - title: "Use Claude Code with your Team or Enterprise plan"
    url: "https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan"
    publisher: "Anthropic"
  - title: "Claude Code Wrap-Up Allowance"
    url: "https://support.claude.com/en/articles/17040437-claude-code-wrap-up-allowance"
    publisher: "Anthropic"
  - title: "What is a limit reset?"
    url: "https://support.claude.com/en/articles/17007452-what-is-a-limit-reset"
    publisher: "Anthropic"
  - title: "Manage usage credits for paid Claude plans"
    url: "https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans"
    publisher: "Anthropic"
  - title: "Models, usage, and limits in Claude Code"
    url: "https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code"
    publisher: "Anthropic"
  - title: "Claude Fable models on your plan"
    url: "https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan"
    publisher: "Anthropic"
  - title: "Higher usage limits for Claude and a compute deal with SpaceX"
    url: "https://www.anthropic.com/news/higher-limits-spacex"
    publisher: "Anthropic"
  - title: "Manage costs effectively (Claude Code docs)"
    url: "https://code.claude.com/docs/en/costs"
    publisher: "Anthropic"
related: ["guide:claude-plans-compared-2026", "guide:context-engineering", "guide:claude-code-memory-context", "guide:choosing-the-right-model", "tool:claude-code", "guide:claude-code-troubleshooting", "guide:claude-code-vscode-extension", "guide:claude-code-tips", "guide:claude-code-slash-commands"]
---

[Claude Code](/tools/claude-code) does not have limits of its own. It draws on your Claude plan's shared pool, which Anthropic's help center describes in one sentence: "Paid plans have two types of usage limits: a session limit that resets every five hours, and weekly limits that reset once every week." claude.ai, Desktop, Claude Code and the IDE extensions all draw on that pool. The fastest ways to run out are long sessions, Opus on routine work, and subagents. For what each plan costs, see [Claude plans compared](/guides/getting-started/claude-plans-compared-2026); this page quotes no prices.

## How the limits work

Two windows run at once:

- **The five-hour session limit.** It resets every five hours. For Claude Code specifically, the help center says: "Both Pro and Max plans have a five-hour session limit and a weekly limit. Max plans also have a separate weekly limit for Fable. These limits are shared across Claude and Claude Code, meaning all activity in both tools counts against the same limits."
- **The weekly limit.** It "applies across all models" and resets "at a fixed time each week that is assigned to your account. Your reset day and time stay the same regardless of when you start using Claude or when your subscription begins, and you receive your full weekly allowance each cycle." The next reset time is shown under Settings > Usage on claude.ai.

Three more rules matter. IDE usage counts toward the same limits, so the [VS Code extension](/guides/getting-started/claude-code-vscode-extension) is not a separate pool. Anthropic reserves discretionary caps: usage may be limited "in other ways, such as weekly and monthly caps or model and feature usage, at our discretion." And Fable has its own rules: on Max and Premium seats up to 50% of weekly usage can go to Fable models, which draw from the regular weekly limit and use it faster; on Pro and Standard seats Fable runs on usage credits.

## What each plan gets

Anthropic publishes allowances only as multiples of the Pro plan's per-session allowance, never as absolute message or hour counts:

| Plan | Per-session allowance | Weekly limit |
| --- | --- | --- |
| Pro | Baseline | Yes, across all models |
| Max 5x | Five times Pro's | Yes, plus a separate Fable weekly limit |
| Max 20x | Twenty times Pro's | Yes, plus a separate Fable weekly limit |
| Team Standard seat | 1.25 times Pro's | Yes, per member |
| Team Premium seat | 6.25 times Pro's | Yes, per member |
| Enterprise, usage-based | No per-seat limits | Billed at API rates |

Claude Code is included with every Team seat (Standard seats since January 16, 2026; Premium seats, introduced August 20, 2025, carry more usage). Team limits are per member, not pooled. On seat-based Enterprise, each member draws from a per-seat allowance on the same windows. Any figure quoting messages per five hours is unverifiable from current help pages, and the next section is why it is also stale.

## The May 2026 doubling

On May 6, 2026, Anthropic announced three changes effective the same day: "we're doubling Claude Code's five-hour rate limits for Pro, Max, Team, and seat-based Enterprise plans"; "we're removing the peak hours limit reduction on Claude Code for Pro and Max accounts"; and higher API rate limits for Opus models. Any mental model from 2025 is off by a factor of two.

## What counts toward usage

Anthropic lists conversation length and complexity, the features you use, the model and the effort level as the inputs. For Claude Code, four dominate.

**Conversation length.** "Every turn sends three things to the model: The conversation so far, every previous message in this session. Project context, your CLAUDE.md and any files Claude has read. Your new prompt. Of these, the first item grows the fastest." The docs spell out the consequence: "With prompt caching, Claude Code re-reads that history at the cached token rate, so a one-line question in a session that has been open all day still draws usage for the whole conversation." Two related costs: the first message after a break longer than the cache lifetime misses the cache and reprocesses the full context, and "`/compact` reads the conversation it summarizes, so compacting a large context is itself a large request. When you want a fresh start instead of continuity, `/clear` costs nothing." Length degrades answers as well as budgets; see [context rot](/glossary/context-rot).

**Model choice.** "Opus costs several times more per turn than Sonnet, and Sonnet more than Haiku. Spending Opus on routine work is the fastest way to drain a daily limit." `/model opusplan` builds the sensible split in, using Opus for planning and Sonnet for execution.

**Subagents, workflows and agent teams.** "The subagent's own requests still draw on your usage," and every agent a workflow spawns adds its own. The extreme case: "Agent teams use approximately 7x more tokens than standard sessions when teammates run in plan mode."

**Effort level and tool results.** Higher effort costs more per turn, and each batch of tool results is another request.

## Check where it went: /usage, /status, Settings > Usage

In Claude Code, `/usage` shows "session cost, plan usage limits, and activity stats," and on a Pro, Max, Team or Enterprise plan adds a breakdown of what counts against your limits. `/cost` and `/stats` are aliases. The breakdown has **Attribution** (usage attributed to skills, subagents, plugins and individual MCP servers), **Recommendations** (changes that lower your usage) and **Loops**; press `d` or `w` to switch between 24 hours and 7 days. The figures are approximate and local to the machine. The Session block's dollar figures are for API users; subscribers should read the plan bars.

`/status` is different: it opens the Settings interface on the Status tab with version, model, account and connectivity. One older help-center article still says to monitor allocation with `/status`; the Claude Code docs put the bars under `/usage`. Since August 2026 (v2.1.234), Claude Code also continues your session automatically when a limit resets; turn it off in `/config` under "Continue automatically at usage limit."

## When you hit a limit

Claude Code warns first, with a message such as "You've used 85% of your session limit · resets 3:45pm," then blocks requests until the reset time shown. Four things can happen next:

1. **Check which limit it is.** Session and weekly limits are shared across all models, so switching models does not help. "You've hit your Opus limit" or "your Sonnet limit" applies only to that model family, so switching outside the family with `/model` keeps you working.
2. **The wrap-up allowance may finish the step.** If you reach the five-hour limit mid-response, Claude Code "may keep working briefly so it can finish the step in progress instead of stopping mid-step," showing "Usage limit reached · wrapping up." The allowance is small and capped, counts toward the weekly limit, applies only to a response already in progress, needs v2.1.277 or later with a Claude account (Pro, Max or a Team Premium seat; not an API key), works once per weekly period on Pro and each five-hour window on Max, and as of October 2026 is still rolling out gradually.
3. **Use a limit reset if one is offered.** Limit resets "are given occasionally to eligible plans" and set a session or weekly limit back to full. The "Reset for free" button is not shown in Claude Code or on mobile; use a browser or Desktop, and because limits are shared, the reset covers Claude Code too.
4. **Turn on usage credits.** See the next section.

Upgrading applies the new plan's limits right away.

## Usage credits

What Anthropic used to call extra usage is now **usage credits**. The help center: "Instead of being blocked when you reach one of your plan's limits, you can switch to consumption-based pricing at standard API rates and continue your work without interruption." They are charged separately from the subscription, stop at your monthly spend limit, and do not change reset timing. Enable them under Settings > Usage on claude.ai and add funds; in Claude Code, run `/usage-credits` after signing in through `/login` (unavailable with API-key authentication). On Team and seat-based Enterprise they pause for the month once a member hits their spend limit. One trap: the monthly API credits bundled with Max plans cannot be used in Claude Code.

## Can you use an API key instead?

Yes. "If you have an ANTHROPIC_API_KEY environment variable set on your system, Claude Code will use this API key for authentication instead of your Claude subscription," and usage is billed at API rates. There is no cap and no hard stop; the docs tell API-key users to watch `/cost` and the Console or cloud dashboard instead. The wrap-up allowance does not apply and `/usage-credits` is unavailable. To switch back, run `claude logout` and `claude login` with only your plan credentials.

## Eight ways to use less

1. **Match the model to the task.** Sonnet for most coding, Opus for architecture and multi-step reasoning, `/model opusplan` for both. [Choosing the right model](/guides/getting-started/choosing-the-right-model) has the longer version.
2. **Start fresh between tasks.** `/clear` costs nothing; carrying an all-day history into an unrelated task bills that history every turn.
3. **Compact on purpose.** `/compact` is a large request on a large context. Do it once at a natural checkpoint, with instructions on what to keep.
4. **Scope the context.** `@`-mention the two to four files the task touches instead of having Claude read a directory. [Context engineering](/guides/prompting/context-engineering) explains why: every addition is a withdrawal from a budget, re-spent on every turn.
5. **Keep CLAUDE.md short.** Project context is re-sent every turn too. [Claude Code memory and context](/guides/configuration/claude-code-memory-context) covers what belongs in the file and what should load on demand.
6. **Spend subagents and agent teams deliberately.** They multiply requests; the attribution table in `/usage` shows their share.
7. **Lower the effort level for simple work.** Effort level is one of the inputs Anthropic lists, and routine edits rarely need the maximum.
8. **Avoid the cold resume.** After a long break, a one-line follow-up in a huge session misses the cache and reprocesses everything. Ask it in a new session.

If you still hit the wall daily after all that, the answer is the plan tier, not the technique; [Claude plans compared](/guides/getting-started/claude-plans-compared-2026) lays out what each tier buys. For other limit-related errors, see [Claude Code troubleshooting](/guides/troubleshooting/claude-code-troubleshooting).
