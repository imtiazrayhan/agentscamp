---
title: "Which Claude Plan Should a Sales Team Pay For?"
description: "Which Claude surface a sales team needs — Cowork for the plugin, Projects for account context, connectors, Claude Code for ops — and where the numbers live."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "plans", "sales", "cowork", "projects", "connectors"]
featured: false
seoTitle: "Which Claude Plan Should a Sales Team Pay For? (2026)"
seoDescription: "Cowork, Projects, connectors, seats, or Claude Code: match what a sales team needs to a Claude surface, then check the plans page for the current numbers."
keywords: ["claude plan for sales teams", "claude plan sales", "claude cowork sales", "claude team plan sales", "which claude plan"]
summary: "Decide by surface first, then look up the tier. Cowork runs the sales plugin, Projects hold account context, connectors reach your CRM, and Claude Code is for the ops person who owns the data. Once you know which surfaces you need, the plans comparison page carries the current figures; this page deliberately carries none."
keyTakeaways:
  - "Pick the surface before the tier. A sales team's requirements resolve to four things — the plugin, account context, connectors, and an ops seat — and each one points at a specific Claude surface."
  - "The sales plugin is Anthropic's, free, and file-based; it is primarily designed for Cowork and also works in Claude Code, so 'which plan opens Cowork' is usually the first real question."
  - "Connector cost is not only a Claude question. Outreach requires an active licensed seat plus the Amplify add-on before its MCP server works at all, so the vendor side of the bill can gate the Claude side."
  - "The ops person needs a different surface from the reps, and anything running unattended belongs on API credits rather than competing with a human's session."
  - "Every figure lives on one page, maintained against Anthropic's own pricing and support docs. This guide routes you there rather than repeating numbers that move."
sources:
  - title: "knowledge-work-plugins (the sales plugin: hosts, install, settings)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Claude plugins directory"
    url: "https://claude.com/plugins"
    publisher: "Anthropic"
  - title: "Outreach"
    url: "https://www.outreach.ai/"
    publisher: "Outreach"
faq:
  - q: "What does a sales team actually need a paid Claude plan for?"
    a: "Four things, in this order: running Anthropic's sales plugin in Cowork, keeping account and product context in a Project so every rep works from the same material, connecting the CRM and enrichment tools, and giving the revenue ops owner a surface where work becomes files rather than chat. Which tiers open which of those, and what each costs, is on our plans comparison page — that is the single page we keep current."
  - q: "Does everyone on the team need the same plan?"
    a: "Rarely. Reps and the ops owner use Claude differently: reps live in a chat surface with account context and connectors, while ops wants a terminal, files, and permissions they can put in version control. Team plans exist precisely so you can mix seat types under one bill and one admin, and unattended jobs are better funded with API credits than with anyone's individual session. Match seat to job, then price it."
  - q: "Is the sales plugin included, or is it an extra purchase?"
    a: "It is Anthropic's own, published under Apache-2.0, and it is markdown and JSON with no code and no infrastructure. You install it from claude.com/plugins in Cowork, or with two CLI commands in Claude Code. What you pay for is the Claude plan that opens the surface you run it on, not the plugin."
  - q: "Do connectors cost extra?"
    a: "Sometimes, and the charge is often on the vendor's side rather than Anthropic's. Outreach's MCP server, for example, requires you to be an active, licensed seat with the Amplify add-on package enabled — so the connector is gated by a purchase in Outreach, not in Claude. Before you size a Claude plan around connectors, confirm that each vendor's own licensing lets your team use the server at all."
related: ["guide:claude-for-sales-teams", "guide:claude-plans-compared-2026", "guide:choosing-the-right-model", "guide:claude-cowork-guide", "guide:claude-code-for-revenue-ops", "guide:claude-sales-plugin-guide", "tool:claude", "tool:claude-cowork"]
---

This page has no prices on it, on purpose. Figures move often enough that any number written into a role guide is wrong within a quarter, so we keep exactly one page current instead: [Claude plans compared (2026)](/guides/getting-started/claude-plans-compared-2026). What this page does is the part that page cannot — translate what a sales team needs into which Claude surface provides it, so that when you reach the numbers you already know what you are buying.

Work through the four requirements below, note which surfaces you need, then read the figures once.

## 1. Running the sales plugin

Anthropic publishes a free `sales` plugin in its knowledge-work plugins repository: nine skills covering account research, call prep, call summaries, competitive battlecards, sales asset creation, daily briefings, outreach drafting, forecasting and pipeline review. It is Apache-2.0 licensed, and it is markdown and JSON — as the repository puts it, "no code, no infrastructure, no build steps."

Anthropic's own README says the plugin is "primarily designed for Cowork ... though it also works in Claude Code." For a sales team, that means **[Cowork](/tools/claude-cowork) is the default answer**. Reps install it from claude.com/plugins and get the skills in an agentic desktop surface built for exactly this kind of document-and-context work. If Cowork is new to you, start with [what Claude Cowork is](/guides/getting-started/claude-cowork-guide), and the per-skill breakdown is in [the sales plugin guide](/guides/sales/claude-sales-plugin-guide).

**So the first question for the plans page is: which tier opens Cowork?**

One detail while you are deciding: the plugin reads a small `settings.local.json` that you create — name, title, company, quota, value props, competitors. In Claude Code it lives in the plugin's own directory; in Cowork it lives in a shared folder. That is the reason Cowork suits a team: one maintained context file rather than nine reps each configuring their own.

## 2. Account and product context

The plugin supplies the workflow. It does not supply your positioning, your objection handling, your case studies, or the last twelve months of notes on an account. That is what Projects are for: a persistent context container every conversation starts from, so a rep prepping a call is not re-pasting the same product brief for the fortieth time.

The requirement is not "a Project" but "a *shared* Project." One person maintaining the context and everyone else working from it is a different feature from everyone keeping private ones — and it is usually what pushes a team from individual subscriptions to a team plan.

**Question for the plans page: which tier allows shared Projects with edit rights, and how many?**

## 3. Connectors

A sales team's Claude is much more useful attached to the CRM, the enrichment platform and the meeting recorder than it is standing alone — the plugin's skills are explicitly written to run standalone and improve when connected.

Two cost questions hide here, and only one of them is Anthropic's.

The Claude side: connectors are token-intensive, so a team that leaves a CRM and an enrichment tool connected all day will consume more of its usage than one that does not. Factor that into which tier you pick.

The vendor side: some connectors are gated by the vendor's own licensing. [Outreach](/tools/outreach) is the clearest example — its documentation states you "must be an active, licensed seat ... and have the Amplify add-on package enabled" to use the MCP server. No Claude plan changes that. Confirm each vendor lets your team connect before you size the Claude side of the bill.

The gate can run both ways. A connector you add yourself, rather than install from Anthropic's directory, needs a Claude plan that supports custom remote MCP connectors — [Gong](/tools/gong) documents that requirement as Pro, Max, Team or Enterprise. If any vendor on your list is outside the directory, that rules the free tier out on its own.

**Question for the plans page: which tier includes the connectors you need, and where is the admin control over them?**

## 4. Seats, admin, and the ops person

Two different jobs, two different answers.

**Reps** want a chat surface, the plugin, the shared Project, and the connectors. They want it administered by somebody else. A team plan is what makes that possible: one bill, central administration, permissions, and shared context — plus per-member usage so one person's heavy afternoon does not drain everyone else's.

**Revenue ops** wants something different. The person who owns CRM data and the GTM stack works in files: a CRM export to audit, an MCP server to wire, a permissions file to commit, an audit to re-run next quarter and diff. That is [Claude Code](/tools/claude-code), and the full workflow is in [Claude Code for revenue ops](/guides/sales/claude-code-for-revenue-ops).

And anything **unattended** — a nightly hygiene check over an export, a scheduled report — should not compete with a human's session at all. Fund those with API credits through the Console and pay per token. It is the same conclusion every role path on this site reaches, and it is cheaper than buying a bigger seat for a robot.

**Question for the plans page: what does a team plan require in seat count, what does admin cover, and how do API credits differ from a subscription?**

## Then pick the model, separately

Model choice is not a plan decision, and sales teams overspend by defaulting to the largest model for everything. Match the tier to the task: the fastest model for bulk work like tagging accounts, deduplicating a list or summarising a batch of notes; the middle model for most drafting, call prep and research; the top model for the deal review that decides a forecast or the message going to an executive buyer.

Current model names, where each one sits, and any plan-gated exceptions are in [choosing the right model](/guides/getting-started/choosing-the-right-model).

## The short answer

Reps need Cowork, a shared Project, and connectors. Ops needs Claude Code. Unattended work needs API credits. Nobody needs the biggest model all day.

Take that list to [Claude plans compared (2026)](/guides/getting-started/claude-plans-compared-2026) and the tier picks itself. The rest of the stack — which skills reps actually use, which vendors are worth connecting, and how the whole thing fits together — is in [Claude for sales teams](/guides/sales/claude-for-sales-teams), and the surface tour for anyone not yet paying anything is [Claude](/tools/claude) itself.
