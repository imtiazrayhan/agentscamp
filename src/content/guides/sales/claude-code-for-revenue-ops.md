---
title: "Claude Code for Revenue Ops: Connectors, CRM Audits, and the Fine Print"
description: "Running Anthropic's sales plugin in Claude Code: wiring MCP connectors, auditing a CRM export, and the vendor terms that decide what you may connect."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["revenue-ops", "claude-code", "mcp", "crm", "connectors", "governance"]
featured: false
seoTitle: "Claude Code for Revenue Ops: MCP Connectors and CRM Audits (2026)"
seoDescription: "Claude Code for revenue ops: install the sales plugin, add Close, ZoomInfo and Outreach MCP servers, audit a CRM CSV, and read the licensing fine print."
keywords: ["claude code revenue ops", "crm mcp server", "close mcp claude", "zoominfo mcp", "sales ops claude code"]
summary: "Run Anthropic's sales plugin in Claude Code when you own the data rather than the deal. Add vendor MCP servers with claude mcp add, audit CRM exports as files instead of live writes, and read the terms first: ZoomInfo bars using MCP-accessed data for model training, and Outreach requires a licensed seat plus the Amplify add-on."
keyTakeaways:
  - "The sales plugin is the same nine markdown skills in both hosts; Claude Code is the better one for ops because the work is files, diffs, and repeatable runs rather than a chat you cannot re-execute."
  - "Close publishes the exact wiring command — claude mcp add --scope user --transport http close https://mcp.close.com/mcp — and a catalogue of 117 tools behind it, 34 of them destructive. Scope and approval policy are your job, not the vendor's."
  - "ZoomInfo contractually prohibits using MCP-accessed data for AI model training and requires training to be disabled in your client before you connect. That is a procurement fact, not a setting you discover later."
  - "Outreach's MCP requires an active licensed seat plus the Amplify add-on package enabled, and Gong's exposes only three read-only tools — connector availability is not the same as connector usefulness."
  - "Audit CRM data as an exported CSV rather than over a live write-capable connector: it is read-only by construction, reproducible, diffable, and it keeps the blast radius at zero."
sources:
  - title: "knowledge-work-plugins (the sales plugin, its skills and .mcp.json)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Close"
    url: "https://close.com/"
    publisher: "Close"
  - title: "ZoomInfo"
    url: "https://www.zoominfo.com"
    publisher: "ZoomInfo"
  - title: "Outreach"
    url: "https://www.outreach.ai/"
    publisher: "Outreach"
  - title: "Gong"
    url: "https://www.gong.io/"
    publisher: "Gong"
faq:
  - q: "Should revenue ops run the sales plugin in Claude Code or in Cowork?"
    a: "Both work — Anthropic's own README says the plugin is 'primarily designed for Cowork ... though it also works in Claude Code.' The skills are identical because they are plain markdown. Pick Claude Code when the output is an artifact you want to keep: an audit that must be re-runnable next quarter, a script, a file you can diff and commit. Pick Cowork for the rep-facing work — call prep, battlecards, the daily briefing — where a chat surface is the point. The only documented behavioural difference is where the plugin's user-created settings.local.json lives."
  - q: "How do I add a CRM MCP server to Claude Code?"
    a: "With claude mcp add, choosing a transport and a scope. Close publishes the literal command in its own docs: claude mcp add --scope user --transport http close https://mcp.close.com/mcp. Most sales vendors ship remote HTTP servers with OAuth, so there is no API key to paste and no process to run — you authorise in a browser and the token lives in your client. Use --scope user for something you personally use across projects and a project scope for something the whole repo should share. The general mechanics are in our guide to adding MCP servers to Claude Code."
  - q: "Is it safe to give Claude write access to the CRM?"
    a: "It is a decision to make deliberately, per scope, not a yes or no. Close's catalogue alone lists 117 tools split into three scopes — 67 read, 16 safe-write, 34 destructive — which is a reasonable model to copy even where the vendor does not offer it: grant read by default, require an explicit approval step for anything that writes, and do not grant destructive scopes to an interactive session at all. Bulk field updates belong in a reviewed export-and-import, not in a conversation."
  - q: "Can we use data pulled through a vendor MCP server to train or fine-tune a model?"
    a: "Check the contract before you assume. ZoomInfo explicitly prohibits using MCP-accessed data for AI model training and requires you to disable training in your client before connecting. Other vendors' terms differ. Because an MCP connector makes third-party data flow into a general-purpose client, the governing document is the data provider's agreement, not your model provider's — which is why this belongs to revenue ops rather than to whoever installed the connector."
related: ["guide:claude-for-sales-teams", "guide:claude-sales-plugin-guide", "skill:crm-export-auditor", "command:audit-crm", "agent:sales-engineer", "guide:data-privacy-for-llm-apps", "guide:human-in-the-loop-ai-workflows", "guide:claude-code-mcp-setup", "tool:close"]
---

Most writing about AI in sales is aimed at the rep. This one is aimed at whoever owns the CRM data and the GTM stack — the person who gets asked "can we connect Claude to Close?" and has to answer a question with contract, scope and blast-radius parts to it.

The short version: the sales plugin runs fine in Claude Code, most of the vendors in this category now ship a first-party MCP server, and the interesting work is not the wiring. It is deciding what may be connected, with what scope, under whose terms.

## Why Claude Code rather than Cowork

Anthropic's own framing is that the plugin is "primarily designed for Cowork ... though it also works in Claude Code," and the skills are identical in both because they are plain markdown with no code, no build step and no bundled assets. So the choice is about the shape of your work, not about features.

Cowork wins for the rep-facing loop: call prep before a meeting, a battlecard, the morning briefing. [Claude Code](/tools/claude-code) wins for ops, for three concrete reasons.

**The output is a file.** An audit that lives in a chat cannot be re-run in October and diffed against September. One that writes `audit-2026-09.md` into a repo can.

**You can commit the inputs.** The plugin reads a user-created `settings.local.json` — your name, title, company, quota, value props, competitors. In Claude Code it sits at `sales/.claude/settings.local.json`, which means it is a reviewable file rather than a preference someone set once in a desktop app. (In Cowork it lives in a shared folder instead; that location difference is the only behavioural difference Anthropic documents between the hosts.)

**Permissions are explicit.** Claude Code's settings and permission model gives you a place to write down what an agent may do, ahead of time, in a file you can put in version control.

Install is the same two commands documented in the repository root:

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

The per-skill walkthrough of what you get is in [the sales plugin guide](/guides/sales/claude-sales-plugin-guide).

## Wiring the connectors

The plugin's `.mcp.json` declares fourteen HTTP servers — Slack, HubSpot, Close, Monday, Clay, ZoomInfo, Notion, Atlassian, Fireflies, Apollo, Outreach, Similarweb, and placeholder entries for Gmail and Google Calendar whose URLs are deliberately empty. The mapping in the plugin's own connector doc is by *category*, not by vendor: whichever CRM you connect fills the CRM slot, whichever enrichment tool you connect fills the enrichment slot. That is a genuinely good design decision, and it means your job is to decide which vendor occupies each slot.

Outside the plugin, you add servers with `claude mcp add`. [Close](/tools/close) publishes the literal command in its documentation, which is the cleanest example in the category:

```bash
claude mcp add --scope user --transport http close https://mcp.close.com/mcp
```

Three things in that one line are worth naming, because they generalise. `--transport http` means this is a remote server: nothing runs on your machine, and authentication is OAuth in a browser rather than an API key in a config file. `--scope user` puts it in your personal config across every project; a project scope shares it with everyone who checks out the repo, which is what you want for a team-standard connector and not what you want for a personal sandbox. And the name — `close` — is what the model sees, so keep it boring and predictable.

The general mechanics, including how the scopes resolve and how to check what is actually loaded, are in [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup); [MCP](/glossary/model-context-protocol) itself is the glossary entry.

## Read the fine print before you connect

This is the part that belongs to revenue ops and to nobody else, because connecting a data vendor to a general-purpose AI client moves third-party data into a system the vendor's contract has opinions about.

**[ZoomInfo](/tools/zoominfo)** is the sharpest case. It contractually prohibits using MCP-accessed data for AI model training, and requires you to disable training in your client before you connect at all. That is a configuration precondition and a contractual one at the same time. ZoomInfo also ships an official Claude Code plugin (`claude plugin install zoominfo@claude-plugins-official`) alongside its server at `https://mcp.zoominfo.com/mcp`, which is listed in Anthropic's connector directory with twenty-one tools — the most Claude-specific documentation of any vendor here.

**[Outreach](/tools/outreach)** gates access at the licence layer. Its documentation states that to use the MCP server you "must be an active, licensed seat ... and have the Amplify add-on package enabled." A connector you cannot use without an add-on your company has not bought is a procurement item, not an integration task.

**[Gong](/tools/gong)** is the opposite failure mode: available on any Gong plan (though Gong requires a Claude plan supporting custom remote MCP connectors — Pro, Max, Team or Enterprise), but exposing only three read-only tools — `ask_account`, `ask_deal` and `generate_brief`. It is also not in Anthropic's connector directory, so it goes in as a custom connector at `https://mcp.gong.io/mcp`. Three read-only tools is a perfectly good integration for asking questions about a deal, and a bad one if you expected to build a pipeline job on it. Availability is not usefulness.

**Close** publishes the fullest surface: a catalogue of 117 tools across three scopes — 67 read, 16 safe-write, 34 destructive (our count of its list; Close publishes no total, and Anthropic's directory lists 55). Copy that mental model even where the vendor does not offer the scopes: read by default, writes behind an explicit approval, destructive operations never granted to an interactive session. That approval boundary is the subject of [human-in-the-loop AI workflows](/guides/workflow/human-in-the-loop-ai-workflows), and it matters more here than in most places, because a mistaken bulk update to opportunity records is not something you notice in the diff.

One more thing worth stating plainly: do not tell your security reviewer that a connector is "verified by Anthropic". The directory does mark some connectors verified, but the page carrying that mark also says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change". A listing is a starting point for your own review, not a substitute for it.

## Audit the CRM as a file, not as a live connection

The highest-value thing revenue ops can do with Claude has nothing to do with connectors. It is data quality, and the safest way to run it is on an export.

Export the objects you care about to CSV, then have Claude audit the file: duplicate accounts and contacts, opportunities with close dates in the past, records missing required fields, deals with exactly one contact on them, and owner assignments that no longer match anyone employed here. Our [CRM export auditor](/skills/sales/crm-export-auditor) is that pass written down, and [`/audit-crm`](/commands/sales/audit-crm) is the one-line runner.

Working on the export instead of the live connector buys four things. It is read-only by construction — there is no write scope to misconfigure. It is reproducible, because the file is the input and you can re-run the identical audit next quarter. It is diffable, so "did hygiene improve" becomes a question with an answer. And it keeps the data-handling question local: a CSV of customer records is exactly the kind of file [data privacy for LLM apps](/guides/ai-safety/data-privacy-for-llm-apps) is about, so redact what does not need to be in context and delete the export when the audit is done.

The output should be a remediation list, not a score. Sorted by object, with the record IDs, ready to hand back to whoever owns the field.

## The technical asks that reach the rep

The other job that lands on this desk is the prospect's technical questions: the security questionnaire, the SSO requirement, the "does it integrate with our warehouse" ask, the SLA redline. Reps escalate these because they cannot answer them, and they arrive with no separation between what ships today and what would need engineering.

Our [sales engineer agent](/agents/sales/sales-engineer) does that triage — it reads the prospect's technical requirements and splits them into supported today, supported with configuration, on the roadmap, and needs a scoping conversation. For the questionnaire itself, the [security questionnaire responder](/skills/sales/security-questionnaire-responder) drafts answers from your own documentation and marks each one sourced or needs-review, which is the right default: a questionnaire answer that nobody checked is a contractual statement nobody checked.

## The short list

Run the plugin in Claude Code when the output is an artifact. Wire connectors with `claude mcp add`, name them boringly, and pick the scope deliberately. Read the vendor's terms before the integration, not after — ZoomInfo's training prohibition and Outreach's licensing gate are both discoverable in ten minutes and both expensive to find late. Audit data as files. Keep destructive scopes away from interactive sessions.

The rest of the sales surface — which skills reps actually use, which tools are worth connecting, and which Claude surface each role should open — is mapped in [Claude for sales teams](/guides/sales/claude-for-sales-teams).
