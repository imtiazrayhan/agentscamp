---
title: "Inside Anthropic's Sales Plugin for Claude: All Nine Skills"
description: "A per-skill breakdown of Anthropic's sales plugin for Claude: what each of the nine skills produces, how you trigger it, and where it falls down."
seoTitle: "Anthropic's Claude Sales Plugin: All Nine Skills, Explained"
seoDescription: "Anthropic's sales plugin for Claude, skill by skill: what all nine produce, what needs a connector, and why its own README undercounts them at six."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "plugins", "cowork", "skills", "connectors"]
featured: false
keywords: ["Claude sales plugin", "Anthropic sales plugin", "knowledge-work-plugins sales", "call-prep skill", "pipeline-review Claude"]
summary: "Anthropic's sales plugin ships nine Markdown skills — no commands, no agents — under Apache-2.0. Seven output text; competitive-intelligence and create-an-asset each write a self-contained HTML file. All nine run standalone, and connectors only deepen them. Its own README is stale, tabling six skills and calling three of them commands."
keyTakeaways:
  - "The plugin is nine skills and nothing else: no commands/ folder, no agents/ folder, version 1.3.0, Apache-2.0. It lives at the repository root as sales/, not plugins/sales."
  - "The plugin README is out of date: it tables six skills when nine ship, and still calls call-summary, forecast and pipeline-review commands. Separately, CONNECTORS.md and the root README still list a Microsoft 365 connector deleted from the manifest in June 2026."
  - "Every skill runs standalone. Four reach for web search (account-research, draft-outreach, competitive-intelligence, call-prep); the other five work on whatever you paste or upload."
  - "Two skills write files rather than text: competitive-intelligence emits an interactive HTML battlecard, and create-an-asset emits a landing page, deck, one-pager or workflow demo. Both are self-contained HTML."
  - ".mcp.json declares 14 MCP connectors, but gmail and google calendar ship with empty URLs — they are placeholders, not working integrations."
  - "The plugin reads a settings.local.json that you create yourself (name, title, company, quota, value props, competitors). It is not in the repo, and its location differs between Claude Code and Cowork."
faq:
  - q: "How many skills are in Anthropic's sales plugin?"
    a: "Nine: account-research, call-prep, call-summary, competitive-intelligence, create-an-asset, daily-briefing, draft-outreach, forecast, and pipeline-review. The plugin's own README tables only six, which is a documentation lag rather than a packaging difference — all nine SKILL.md folders are in the repository."
  - q: "How do I install the sales plugin in Claude Code?"
    a: "The root README of anthropics/knowledge-work-plugins gives two commands: claude plugin marketplace add anthropics/knowledge-work-plugins, then claude plugin install sales@knowledge-work-plugins. In Cowork, install it from the plugin directory instead. Note that the sales plugin's own README shows a different, older-looking command form; the root README's version is the one to use."
  - q: "Do I need a CRM connected for the sales plugin to work?"
    a: "No. Every one of the nine skills is written to run standalone. forecast and pipeline-review take a CSV export or a pasted list of deals, call-summary takes pasted notes or a transcript, and the research skills fall back to web search. A connected CRM removes the copy-paste step and adds history you cannot get from the public web, but nothing in the plugin refuses to run without one."
  - q: "Are call-summary, forecast and pipeline-review slash commands?"
    a: "Not any more. Commit 2d6f7e22 on 13 March 2026 migrated commands to skills across all the knowledge-work plugins. Those three still carry the residue — a heading like # /forecast, a ## Usage block, a $ARGUMENTS line, and an argument-hint field — but they are skills, and the plugin ships no commands/ directory at all."
related: ["guide:claude-knowledge-work-plugins", "guide:claude-for-sales-teams", "guide:claude-skills-for-sales", "guide:claude-cowork-guide", "tool:claude-cowork", "tool:claude-code", "glossary:agent-skills", "glossary:model-context-protocol"]
sources:
  - title: "anthropics/knowledge-work-plugins — the sales plugin directory"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/sales"
    publisher: "Anthropic"
  - title: "anthropics/knowledge-work-plugins (root README and marketplace.json)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Create plugins (Claude Code documentation)"
    url: "https://code.claude.com/docs/en/plugins"
    publisher: "Anthropic"
  - title: "Use plugins in Claude"
    url: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"
    publisher: "Anthropic"
---

Anthropic's `sales` plugin is nine Markdown files in a folder. No code, no build step, no commands, no subagents. This is the per-skill walkthrough: what each produces, how to set it off, what it needs connected, where it fails.

For the catalog view — every role plugin in the repo, install routes, how to fork one — read [Anthropic's Knowledge-Work Plugins: Every Role Plugin, Explained](/guides/getting-started/claude-knowledge-work-plugins). **This page goes deeper on one of them.** If you are earlier than either, start at [Claude for sales teams](/guides/sales/claude-for-sales-teams).

## What is actually in the folder

```
sales/
├── .claude-plugin/plugin.json   # name: sales, version 1.3.0
├── .mcp.json                    # 14 connector definitions
├── CONNECTORS.md
├── LICENSE                      # clean Apache-2.0
├── README.md
└── skills/                      # nine skills — no commands/, no agents/
```

The plugin sits at the repository **root** as `sales/`; there is no `plugins/` directory and that path 404s. No SKILL.md sets `allowed-tools`, `model` or `version`, and no shell or Python appears in the nine bodies — the root README's claim holds: "Every component is file-based — markdown and JSON, no code, no infrastructure, no build steps."

## Installing it

From the repository's root README:

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

In [Claude Cowork](/tools/claude-cowork), install from the plugin directory instead.

**A conflict worth flagging.** The plugin's own README gives a different command — `claude plugins add knowledge-work-plugins/sales` — plural verb, different shape, contradicting the root README. Nobody has run either, so we will not say which the CLI accepts; use the root README's two-step, which matches the documented CLI. The root README separately claims skills surface as namespaced slash commands such as `/sales:call-prep`; that is its claim, not something we tested.

## The three skills that used to be commands

Commit `2d6f7e22` (13 March 2026, "Migrate commands to skills across all plugins") moved `call-summary`, `forecast` and `pipeline-review` out of a `commands/` folder into `skills/`. The migration left fingerprints: all three still open with a heading like `# /forecast`, still carry a `## Usage` block, still contain a `$ARGUMENTS` line and an `@$1` file reference, and are the only three with an `argument-hint` field. Read that as history — nothing documents how a host substitutes `$ARGUMENTS` when a skill fires conversationally. Just paste your CSV or notes and say what you want.

## The nine skills

### account-research

A research dossier: Quick Take, company profile table, recent news each with a "why it matters for your outreach" line, hiring signals, per-person talking points, qualification signals split into positive / concerns / unknown, and discovery questions. Trigger with "research [company]" or "intel on [prospect]". Standalone it runs seven named web searches; enrichment adds verified emails, org chart and tech stack, a CRM adds prior-relationship history.

**Where it falls down:** those last two sections go blank without the tools, and the synthesis step tells Claude to "prioritize enrichment data over web (more accurate)" — unconnected, everything is public-web inference. Its Related Skills list points at a `prospecting` skill the plugin does not ship.

### call-prep

A pre-call brief: account snapshot, attendees with background and role-in-deal, history, a five-item agenda tailored to meeting type, five discovery questions, and an objections table. Trigger with "prep me for my call with [company]"; it needs company and meeting type. Connected, it pulls from CRM, email, chat, transcripts and calendar.

**Where it falls down:** it varies output across discovery, demo, negotiation and QBR but has no notion of your sales process, so the agenda stays generic until you feed it your own. Its closing section says to run `call-follow-up` — not one of the nine; the shipped equivalent is `call-summary`.

### call-summary

Two artifacts from one paste: an internal summary (discussion points, priorities, objections, competitive intel, an owner/action/due table) and a customer-facing follow-up email. Feed it rough notes, a transcript, or a description. Connected, it pulls the recording from [Fireflies](/tools/fireflies) or [Gong](/tools/gong), logs the activity to the CRM, and creates the draft in your inbox.

**Where it falls down:** for a long call you are pasting a lot of text, and it cannot check what it was told. Its best part is the email style section, which bans Markdown in customer-facing drafts — "Write in plain text that looks natural in any email client".

### competitive-intelligence

This one produces a file, not a message: a **self-contained HTML battlecard** with a comparison matrix and a clickable tab per competitor (profile, recent releases, where they win versus where you win, pricing, talk tracks, objections, landmine questions). It saves as `[YourCompany]-battlecard-[date].html`, after eight searches per competitor across up to five.

**Where it falls down:** the pricing intelligence is scraped from the public web and lands in the HTML undated — how a battlecard goes quietly wrong. The skill's own answer is cadence: monthly refresh, immediate after a competitor announcement.

### create-an-asset

The other file-writer, and the largest skill at roughly 25 KB. It produces a deliverable in one of four formats — interactive landing page, deck-style slides, one-pager, or animated workflow demo — again as self-contained HTML ("No external dependencies (except Google Fonts)"), named `[ProspectName]-[format]-[date].html`. It is the only skill with its own `README.md` and `QUICKREF.md`, and runs a Phase 0–7 workflow.

**Where it falls down:** Phase 0 infers your employer from your email domain, which misfires for consultants and generic domains. Expect real back-and-forth before you get a file — its gate ("Before building any asset, always ask clarifying questions") is right, and why this is not a ten-second skill.

### daily-briefing

A morning brief: one #1 Priority with reasoning, a numbers row, today's meetings with one-line context and a prep action each, pipeline alerts, email priorities, and three suggested actions. Trigger with "morning briefing" or "what's on my plate today"; there is a quick mode and an end-of-day mode too.

**Where it falls down:** this degrades most without connectors — unconnected you are typing your own day into a chat box, and the numbers table is skipped. Its prioritisation rule is hard-coded: `If meeting with >$50K deal today → prep that`. Like `call-prep`, it points at the missing `call-follow-up`.

### draft-outreach

A research summary naming the hook, an email draft with two alternative subject lines, a LinkedIn connection request under 300 characters plus a follow-up, a table mapping each element back to the research finding behind it, and an optional Day 3 / Day 7 / Day 14 sequence. Research always runs first — it "never sends generic outreach" — and its hook priority order is worth stealing: trigger event, mutual connection, their content, company initiative, role-based pain last.

**Where it falls down:** the personalisation is only as true as the research, and nothing verifies a claim before it sends. Its configuration block treats proof points as fill-in-the-blank (`[Customer 1]: [Result]`), so absent real ones the model produces something proof-point-shaped — the gap [outreach-claim-checker](/skills/sales/outreach-claim-checker) exists to close.

### forecast

A weighted forecast: quota, closed to date, open pipeline, gap and coverage ratio, then best/likely/worst scenarios, pipeline by stage, a commit-versus-upside split with a reason per deal, risk flags, and a gap analysis naming which deal to accelerate. Feed it a CRM CSV (name, amount, stage, close date at minimum) or a pasted deal list, plus your quota and period end.

**Where it falls down:** the stage probabilities are defaults published in the file — 80% negotiation, 60% proposal, 40% evaluation, 20% discovery, 10% prospecting — as is the coverage heuristic ("3x pipeline coverage is healthy. Below 2x is risky"). Reasonable, not yours. Only a connected CRM uses your real win rates.

### pipeline-review

A Pipeline Health Score out of 100 from four 25-point dimensions (stage progression, activity recency, close-date accuracy, contact coverage), then three ranked priority actions, a close-this-week / this-month / nurture matrix, risk flags for stale deals at 14+ days and deals stuck 30+ days in stage, and a list to consider killing. Its ranking weights are published and adjustable by asking: close date 30%, deal size 25%, stage 20%, activity 15%, risk 10%.

**Where it falls down:** it grades what is in the export. It will not tell you that export is unreliable — duplicate accounts, missing fields, an amount column in three formats. That is [crm-export-auditor](/skills/sales/crm-export-auditor)'s job.

## The 14 connectors, and the two that are not real

`.mcp.json` declares fourteen HTTP MCP servers: Slack, HubSpot, [Close](/tools/close), Monday, [Clay](/tools/clay), [ZoomInfo](/tools/zoominfo), Notion, Atlassian, [Fireflies](/tools/fireflies), [Apollo](/tools/apollo), [Outreach](/tools/outreach), Similarweb, Google Calendar and Gmail.

**Gmail and Google Calendar ship with empty URLs**, deliberately cleared in commit `3b505c10` (21 April 2026). They are placeholders — do not plan a workflow around either. **Microsoft 365 is not a sales connector**: removed in commit `181c4f6f` (2 June 2026), message "Remove broken Microsoft 365 http entries from role plugin manifests". Both `CONNECTORS.md` and the root README still list it.

`CONNECTORS.md` is also where the tool-agnostic design shows. It maps skills to double-tilde placeholder categories — `~~CRM`, `~~email`, `~~data enrichment`, `~~conversation intelligence`, `~~sales engagement` — so whatever you connect in a category fills the slot and no skill hard-codes a vendor. The convention is half-applied: only `call-summary` and `draft-outreach` contain an actual `~~` token. A stray `~~email` in an output is that placeholder leaking. On the connector layer, see [MCP (Model Context Protocol)](/glossary/model-context-protocol).

## The settings file you write yourself

Several skills expect a `settings.local.json` holding your name, title, company, quota, value props and competitor list. **It is not in the repository** — you create it, at `sales/.claude/settings.local.json` in [Claude Code](/tools/claude-code) or a shared folder in Cowork. Without it, `competitive-intelligence` and `create-an-asset` re-interview you every run.

## The README problem

Four things in the plugin's own docs no longer match the code:

1. **`sales/README.md` tables six skills.** Nine ship.
2. **It still has a "Commands" section** listing `/call-summary`, `/forecast` and `/pipeline-review` — migrated to skills in March 2026, and there is no `commands/` directory.
3. **Its install command contradicts the root README's.** Use the two-step above.
4. **It and `CONNECTORS.md` both still advertise Microsoft 365**, deleted from the manifest as broken in June 2026.

The root README drifts too: its structure diagram still shows `commands/` for every plugin, and its sales connector column omits Monday, Apollo, Outreach and Similarweb while including Microsoft 365. None of this is a reason to skip the plugin — the skills are current and well written. Read `skills/`, not the prose.

## Cowork or Claude Code

Both, with a stated preference — the sales README calls it "primarily designed for Cowork, Anthropic's agentic desktop application — though it also works in Claude Code." The only behavioural difference documented is where `settings.local.json` lives. If your reps are not in a terminal, [Cowork](/guides/getting-started/claude-cowork-guide) is the host; if you are wiring this into repos, Claude Code is.

## Where the plugin stops

Nine skills cover research, prep, drafting, asset creation and pipeline analysis. They do not check whether a personalised claim is true, audit whether your domain can deliver mail, audit the CRM export the analysis rests on, or answer a security questionnaire. Those four gaps are what [Claude skills for sales](/guides/sales/claude-skills-for-sales) covers.
