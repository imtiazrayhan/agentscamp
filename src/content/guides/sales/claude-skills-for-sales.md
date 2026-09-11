---
title: "Claude Skills for Sales: The Set Worth Installing"
description: "The Claude skills a sales team should install: Anthropic's nine official ones, plus four of ours that verify and audit what the official set writes."
seoTitle: "Claude Skills for Sales: The Curated Set Worth Installing"
seoDescription: "A curated set of Claude skills for sales — Anthropic's nine official skills plus four verification skills, two commands and an agent, with install steps."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "skills", "commands", "agents", "outreach"]
featured: false
keywords: ["Claude skills for sales", "sales SKILL.md", "cold email deliverability skill", "CRM audit skill", "security questionnaire Claude"]
summary: "Install Anthropic's sales plugin first — nine skills that research, prep, draft and review. Then add the four we wrote, which do the jobs it skips: checking every personalization claim in a draft before it sends, auditing cold-email deliverability, auditing a CRM export for bad data, and answering security questionnaires from your own docs."
keyTakeaways:
  - "Anthropic's nine sales skills cover research, call prep, drafting, competitive work and pipeline analysis. They are free, Apache-2.0, and the right starting point — install them before anything of ours."
  - "Our four deliberately do not clone them. Theirs research, prep, draft and review; ours verify and audit, which is the half a developer byline can actually add."
  - "outreach-claim-checker pairs with draft-outreach: one writes the personalized claim, the other checks it against a source before you hit send."
  - "crm-export-auditor pairs with pipeline-review: pipeline-review grades deal health, the auditor grades the data that grade rests on."
  - "Nothing in Anthropic's plugin touches email deliverability or security questionnaires. Those are the two gaps cold-email-deliverability-auditor and security-questionnaire-responder fill."
  - "All of it is the same portable SKILL.md format: a ZIP upload on claude.ai, a folder in .claude/skills for Claude Code, or a plugin install in Cowork."
faq:
  - q: "Should I install Anthropic's sales plugin or these skills?"
    a: "Both, in that order. Anthropic's sales plugin gives you nine skills that generate work — research briefs, call prep, outreach drafts, forecasts, pipeline reviews. Our four check work: claims in a draft, deliverability of the domain sending it, quality of the CRM export a review rests on, and answers to a security questionnaire. Installing ours without the plugin leaves you with auditors and nothing to audit."
  - q: "Do these skills need a CRM or an MCP connector?"
    a: "No. All four are pure Markdown procedures that run on what you give them — a pasted email draft, your DNS records, a CSV export, your own security documentation. Connectors make Anthropic's plugin better; ours are deliberately file-and-paste so they work identically on claude.ai, in Claude Code, and in Cowork."
  - q: "How do I install a Claude skill on claude.ai?"
    a: "Zip the skill folder so SKILL.md sits at its root, upload it under Settings, Customize, Skills, and make sure code execution is enabled under Settings, Capabilities. Surfaces do not sync — a skill uploaded to claude.ai does not appear in Claude Code or the API, so install it separately in each place you work."
  - q: "What is the difference between the skills, the commands and the agent here?"
    a: "A skill is a procedure Claude loads on its own when your task matches its description. A command is an explicit slash-invocation you type when you want that procedure right now. An agent is a separate subagent with its own context window and toolset, used for work that would otherwise flood your main session. check-outreach and audit-crm are thin runners for two of the skills; sales-engineer is a subagent for prospect technical asks."
related: ["guide:claude-for-sales-teams", "guide:claude-sales-plugin-guide", "guide:how-to-install-claude-skills", "guide:what-are-claude-skills", "guide:skills-vs-agents-vs-commands", "skill:outreach-claim-checker", "skill:crm-export-auditor", "command:check-outreach", "agent:sales-engineer"]
sources:
  - title: "anthropics/knowledge-work-plugins — the sales plugin directory"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/sales"
    publisher: "Anthropic"
  - title: "Extend Claude with skills (Claude Code documentation)"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "Agent Skills overview"
    url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
    publisher: "Anthropic"
  - title: "RFC 7489: Domain-based Message Authentication, Reporting, and Conformance (DMARC)"
    url: "https://datatracker.ietf.org/doc/html/rfc7489"
    publisher: "IETF"
---

A sales team asking "which Claude skills should we install?" has two answers, and the order matters. Install Anthropic's nine first — they are free, Apache-2.0, and better than anything we would write to compete with them. Then add four of ours, which exist because they do a different job: **Anthropic's skills produce work, ours check it.**

This page is the curated set. For the pillar view of Claude across a sales org, start at [Claude for sales teams](/guides/sales/claude-for-sales-teams). For a per-skill breakdown of Anthropic's nine — what each produces, what it needs connected, where it falls down — read [Inside Anthropic's sales plugin](/guides/sales/claude-sales-plugin-guide).

## Start with Anthropic's nine

The `sales` plugin in `anthropics/knowledge-work-plugins` ships nine skills and nothing else — no commands, no subagents:

| Skill | The job |
|---|---|
| `account-research` | Company and person dossier before outreach |
| `call-prep` | Pre-call brief: attendees, history, agenda, likely objections |
| `call-summary` | Notes or transcript in, structured summary and follow-up email out |
| `competitive-intelligence` | Researches competitors, writes a self-contained HTML battlecard |
| `create-an-asset` | Landing page, deck, one-pager or workflow demo as one HTML file |
| `daily-briefing` | Morning brief: #1 priority, meetings, pipeline alerts |
| `draft-outreach` | Researches a prospect, then drafts a personalized email and LinkedIn variant |
| `forecast` | Weighted forecast, commit versus upside, gap analysis |
| `pipeline-review` | Pipeline health score, risk flags, hygiene issues, deals to drop |

Every one runs standalone; connectors deepen them rather than gate them. Install the plugin, use it for a fortnight, and only then decide what is missing.

## Why we did not clone them

The obvious set of sales skills to publish — a prospect researcher, a battlecard builder, a discovery-call prepper, an outreach writer, a deal-review checklist — is exactly the set Anthropic already ships. Publishing near-duplicates would fail our own rule that a skill's description must not apply to any other skill in the library, and it would be worse than the free official version.

So the four below sit beside the plugin rather than on top of it. Every one covers something no skill in the plugin touches: **verification and data quality**, which is where a developer's habits are worth more than a sales playbook.

## The four we added

### outreach-claim-checker

[outreach-claim-checker](/skills/sales/outreach-claim-checker) takes a drafted email and checks every personalization claim in it before it sends. It pulls each factual assertion out of the draft — the funding round, the job posting, the product launch, the "I saw you moved to X" — and asks what source supports it and how current that source is, marking each one sourced, unsourced, contradicted or stale and returning a send, fix or hold verdict for the email.

This is the direct complement to `draft-outreach`, which researches and writes but never re-checks. Its own configuration block treats proof points as fill-in-the-blank, so an unsupplied one comes out proof-point-shaped rather than true. One skill writes; the other reads it back adversarially.

### cold-email-deliverability-auditor

[cold-email-deliverability-auditor](/skills/sales/cold-email-deliverability-auditor) is the one with no counterpart in the plugin at all. It walks SPF, DKIM and [DMARC](https://datatracker.ietf.org/doc/html/rfc7489) records, domain and mailbox warmup, list hygiene, and the content patterns that trip spam filters — then tells you which findings actually block delivery and which are cosmetic.

It is here because a perfectly personalized email that lands in spam is a wasted research budget. This is infrastructure work, and it is the kind of thing a sales team reasonably does not know to check until reply rates collapse.

### crm-export-auditor

[crm-export-auditor](/skills/sales/crm-export-auditor) takes a CRM CSV and audits it for duplicate records, close dates that have already passed or were pushed repeatedly, missing required fields, and single-threaded deals with exactly one contact attached.

It pairs with `pipeline-review`, which analyses pipeline health — but health analysis grades what is in the export and cannot tell you the export is unreliable. Run the auditor first; a forecast built on duplicates and stale dates is confidently wrong, which is worse than obviously wrong.

### security-questionnaire-responder

[security-questionnaire-responder](/skills/sales/security-questionnaire-responder) drafts answers to a prospect's security questionnaire from your own documentation and tags every row: sourced, with the document and section it came from; partial, where the documents answer part of the question and the boundary is stated outright; not applicable, but only when a document establishes why; or needs-review, where nothing supports an answer. A control that appears in no document is left blank rather than asserted.

That tagging is the whole design. A security questionnaire is the one sales document where a plausible-sounding wrong answer creates real liability, so the skill is built to refuse to guess quietly. It also routes anything touching contractual terms, breach-notification windows, data residency or roadmap dates to Legal or Security by name, and cites the SOC 2 rather than pasting it.

## Two commands and one agent

Skills fire on their own when a task matches. Sometimes you want to invoke one explicitly, and sometimes the work belongs in its own context window.

- [/check-outreach](/commands/sales/check-outreach) — a thin runner for `outreach-claim-checker`. Point it at a draft when you want the claim check now rather than hoping Claude routes to it.
- [/audit-crm](/commands/sales/audit-crm) — the same for `crm-export-auditor`. Useful as a standing step before every pipeline review.
- [sales-engineer](/agents/sales/sales-engineer) — a subagent for a prospect's technical asks: security questionnaires, integration requirements, SLA language. It separates what your product does today from what would need engineering work, so an account executive can answer without over-promising. It runs as an agent rather than a skill because that review reads a lot of material you do not want in your main session.

If the distinction between the three formats is still fuzzy, [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) is the short version.

## Installing them

All of this is the same portable [SKILL.md](/guides/skills/what-are-claude-skills) format, and it installs three ways:

- **claude.ai** — zip the skill folder with `SKILL.md` at its root, upload under Settings, Customize, Skills, and enable code execution under Settings, Capabilities. This is the route for reps who never open a terminal.
- **Claude Code** — copy the folder to `.claude/skills/<name>/SKILL.md` in a repo (shared with everyone who clones it) or `~/.claude/skills/` (follows you everywhere). Commands go in `.claude/commands/`, agents in `.claude/agents/`. No restart needed.
- **Cowork** — install Anthropic's plugin from the plugin directory, and add ours as files in the same skills location Cowork reads.

Full detail, including the CLI route and team distribution, is in [How to install Claude skills](/guides/skills/how-to-install-claude-skills). Note that surfaces do not sync: a skill uploaded to claude.ai will not appear in Claude Code, so install it wherever you actually work.

## A sensible order

Run the plugin's skills to make things, and ours to check them. In practice that is: `account-research` then `draft-outreach` then `/check-outreach` before anything sends; `crm-export-auditor` on the export before `pipeline-review` or `forecast` touches it; the deliverability audit once per sending domain and again whenever reply rates drop; and `sales-engineer` the moment a prospect's questions turn technical.
