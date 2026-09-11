---
title: "Claude for Sales Teams: The Surface Map"
description: "Which Claude surface a sales team should actually open: Anthropic's free sales plugin, claude.ai Projects, Cowork, Claude Code, and MCP connectors."
author: "Imtiaz Rayhan"
date: 2026-09-10
reviewed: 2026-09-10
color: "blue"
depth: cornerstone
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "sales-plugin", "connectors", "mcp", "crm", "cowork"]
featured: true
seoTitle: "Claude for Sales Teams: Which Surface for Which Job"
seoDescription: "A developer's surface map for sales teams: Anthropic's free sales plugin, claude.ai Projects, Cowork, Claude Code, and the connectors that make them real."
keywords: ["claude for sales teams", "anthropic sales plugin", "claude sales skills", "sales mcp connectors", "claude crm connector"]
summary: "Start with Anthropic's free, Apache-2.0 sales plugin: nine skills, no code, no vendor lock-in. Then pick a surface by job. Projects hold shared context, Cowork works folders and recurring briefs, Claude Code handles exports and audits, and connectors are the only way Claude reaches your CRM's ground truth. Everything else is a guess you have to check."
keyTakeaways:
  - "Anthropic ships a free, Apache-2.0 sales plugin with nine skills and no code. Most teams should exhaust it before buying an AI-SDR product."
  - "The plugin is tool-agnostic on purpose: its connector map uses category placeholders like ~~CRM and ~~email, so whatever you connect fills the slot."
  - "Claude is strong at research, prep, summarising, drafting and auditing. It cannot see your pipeline without a connector, and it will not source a claim it invented."
  - "Six of the ten leading sales tools we surveyed sell AI on a meter wholly separate from seats, and others meter usage on top of a seat price. The seat price is not the bill."
  - "The plugin's own README is stale in several places, including a Commands table for things that are now skills. Read the repo tree, not the README."
  - "Every model-written personalization claim needs a source before it goes out. That check is mechanical, so give it to a skill instead of a human's memory."
sources:
  - title: "knowledge-work-plugins: sales"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/sales"
    publisher: "Anthropic"
  - title: "knowledge-work-plugins"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Clay connector"
    url: "https://claude.com/connectors/clay"
    publisher: "Anthropic"
  - title: "Unify connector"
    url: "https://claude.com/connectors/unify"
    publisher: "Anthropic"
  - title: "Clay pricing"
    url: "https://www.clay.com/pricing"
    publisher: "Clay"
  - title: "Attio pricing"
    url: "https://attio.com/pricing"
    publisher: "Attio"
  - title: "Apollo pricing"
    url: "https://www.apollo.io/pricing"
    publisher: "Apollo"
  - title: "Outreach pricing"
    url: "https://www.outreach.ai/pricing"
    publisher: "Outreach"
  - title: "Fireflies pricing"
    url: "https://fireflies.ai/pricing"
    publisher: "Fireflies"
  - title: "GTM.AI pricing"
    url: "https://gtm.ai/pricing"
    publisher: "ZoomInfo"
  - title: "Gong pricing"
    url: "https://www.gong.io/pricing"
    publisher: "Gong"
  - title: "Close pricing"
    url: "https://close.com/pricing"
    publisher: "Close"
faq:
  - q: "Do we need to buy an AI SDR tool to use Claude for sales?"
    a: "No, and you should not start there. Anthropic publishes a sales plugin in its knowledge-work-plugins repository under Apache-2.0 with nine skills covering account research, call prep, call summaries, competitive battlecards, asset creation, daily briefings, outreach drafting, forecasting and pipeline review. It is markdown and JSON only, with no code and no build step, and every skill runs standalone on your own input plus web search. Exhaust that before you evaluate a paid product, because it tells you which jobs Claude is actually good at in your motion and which need a data vendor behind them."
  - q: "Which Claude surface should a sales team use day to day?"
    a: "Split it by where the work lives. claude.ai Projects for context every rep should share, such as positioning, objection handling and past-deal notes. Claude Cowork for jobs that span a folder or run on a schedule, such as a Monday briefing or a batch of call notes. Claude Code for anything that touches a file repeatedly, such as auditing a CRM export or checking a hundred drafts against a rule. Connectors sit under all three and are the only way Claude reads live records."
  - q: "Can Claude see our CRM?"
    a: "Only through a connector, which is an MCP integration you install and authorize. Without one, Claude has no access to your pipeline, your account history or your contacts, and anything it says about them is inference from what you pasted in. All ten sales tools we surveyed ship a first-party MCP server, and nine carry a listing in Anthropic's connectors directory, so the connection usually exists. What varies enormously is how much of the product each server exposes."
  - q: "Is it safe to send a Claude-drafted cold email as written?"
    a: "Not without a source check. The failure mode is not bad prose, it is a confident personalization detail that is wrong: a funding round that did not happen, a job title that changed, a product the prospect does not sell. Anthropic's draft-outreach skill researches before it writes and reports which sources it used, but reporting a source is not the same as having verified one. Run every draft through a claim check before it leaves, and treat any unsourced specific as a deletion, not a rewrite."
related: ["guide:claude-sales-plugin-guide", "guide:research-prospects-with-claude", "guide:claude-code-for-revenue-ops", "guide:claude-skills-for-sales", "guide:which-claude-plan-for-sales-teams", "guide:best-ai-sales-tools-2026", "tool:claude", "tool:claude-cowork", "tool:claude-code"]
---

Most "AI for sales" advice is written by someone selling AI for sales. This one is written by a developer who read the source: Anthropic's sales plugin as it exists in the git tree, the MCP servers ten sales vendors actually ship, and the pricing pages behind them. The useful question is not whether Claude can help a sales team. It is which Claude surface you open for which job, what has to be connected before the answer is real, and where the model quietly stops being trustworthy.

There are five surfaces in play: [claude.ai](/tools/claude) with Projects, [Claude Cowork](/tools/claude-cowork), [Claude Code](/tools/claude-code), Anthropic's free sales plugin, and MCP connectors. They are not competitors. They are different shapes of the same model, and picking wrong is the most common way a team concludes "AI didn't work for us."

## The one-table version: which surface for which job

| Job | Open | Why this surface |
|---|---|---|
| Keep positioning, objection handling and past deals available to every chat | [claude.ai](/tools/claude) Projects | Project knowledge and instructions apply to every chat inside |
| Research an account, prep a call, draft outreach, build a battlecard | The [sales plugin](/guides/sales/claude-sales-plugin-guide) | Nine skills that already encode the structure of those outputs |
| Turn a folder of call notes, transcripts or PDFs into a summary or tracker | [Claude Cowork](/tools/claude-cowork) | Works in folders and desktop apps you choose, and can run on a schedule |
| Audit a CRM export, check a hundred drafts, reformat a data file | [Claude Code](/tools/claude-code) | Edits files and runs commands; see [Claude Code for revenue ops](/guides/sales/claude-code-for-revenue-ops) |
| Read live records: accounts, deals, calls, contacts | A connector | MCP is the only path to your systems' ground truth |
| Decide which paid tool, if any, to add | [Best AI sales tools](/guides/comparisons/best-ai-sales-tools-2026) | Ten vendors, dated prices, and which ones Claude can actually reach |

The rest of this guide is the reasoning behind each row, and one buyer trap that deserves its own section.

## Start with Anthropic's free sales plugin, not a paid AI-SDR product

This is the recommendation most posts on this topic will not give you, because there is no affiliate revenue in it.

Anthropic publishes [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) under Apache-2.0. The sales plugin lives at the repository root as `sales/`, and its manifest reports version 1.3.0. It contains nine skills and nothing else: no `commands/` directory, no `agents/` directory, no scripts, no executables, no bundled assets. The root README describes the design in one line worth quoting, because it explains why the thing is safe to try: "Every component is file-based, markdown and JSON, no code, no infrastructure, no build steps."

Installing it is two commands in Claude Code, in the form the root README documents:

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

In Cowork you install from the plugin directory at claude.com instead. One caution before you copy anything: `sales/README.md` shows a different, pluralised command form that contradicts the root README, and we have not run either, so treat the two-step form above as the documented path and the other as stale text in the repo. If you have never installed a plugin, [installing Claude Code](/guides/getting-started/installing-claude-code) and [how to install Claude Skills](/guides/skills/how-to-install-claude-skills) cover the mechanics.

The reason to start here is not that it is free. It is that it is diagnostic. Nine skills, each of which produces a specific artifact, will tell you within a week which parts of your motion Claude genuinely accelerates and which parts need a data vendor underneath. Buying a seat-plus-credits product first inverts that: you learn what the vendor's workflow does, not what your team needs.

### What the nine skills actually produce

Skills are not prompts with a nicer name. Each one is a procedure with a defined output shape, which is why the results are consistent across reps who write nothing alike. Anthropic's set covers:

- **account-research** builds a company or person profile: what they do, recent news, hiring signals, key people, and a sources list. Richer when a [lead enrichment](/glossary/lead-enrichment) vendor or your CRM is connected.
- **call-prep** produces a pre-call brief: account snapshot, attendees, prior history, an agenda, discovery questions, and likely objections.
- **call-summary** takes pasted notes or a transcript and returns a structured summary, action items, and a draft follow-up email.
- **competitive-intelligence** researches competitors and writes a self-contained interactive HTML battlecard with a comparison matrix.
- **create-an-asset** is the largest skill in the plugin, a seven-phase workflow producing a landing page, deck, one-pager or animated demo as self-contained HTML.
- **daily-briefing** returns a morning brief: the single top priority, the numbers, meetings, pipeline alerts, suggested actions.
- **draft-outreach** researches a prospect first, then drafts a personalized email plus a LinkedIn variant, the rationale for the angle, and a follow-up sequence.
- **forecast** produces a weighted forecast with best, likely and worst cases, commit versus upside, and gap analysis.
- **pipeline-review** scores pipeline health out of 100 and returns priority actions, risk flags, hygiene issues, and deals to drop.

Three of those (call-summary, forecast, pipeline-review) were slash commands until Anthropic migrated commands to skills across every plugin in March 2026, and they still carry the residue: a slash-style heading, a `## Usage` block, and `$ARGUMENTS`. That is cosmetic, not broken, but it is why the plugin's own README still shows a "Commands" table for things that are skills, and why its "Skills" table lists six when there are nine. Read the repository tree, not the README. The per-skill mechanics, including where each one fails, are in the [sales plugin deep dive](/guides/sales/claude-sales-plugin-guide), and the wider catalogue of role plugins is in [Anthropic's knowledge-work plugins](/guides/getting-started/claude-knowledge-work-plugins).

### Why the plugin is deliberately tool-agnostic

This is the design decision that makes the plugin worth adopting even if you later buy something.

The plugin's `CONNECTORS.md` maps skills to category placeholders rather than products: `~~CRM`, `~~email`, `~~data enrichment`, `~~conversation intelligence`, `~~sales engagement`. Whatever you connect in a category fills the slot. In practice only two skills, call-summary and draft-outreach, carry a literal `~~` token in their body (draft-outreach ends a step with `[Draft created - check ~~email]`); the other seven describe their connectors in prose. But the intent is consistent across all nine, and it is the right intent: the skill describes the job, your connector supplies the system.

That means switching CRMs does not invalidate your prompts. It means a team on [Attio](/tools/attio) and a team on [Close](/tools/close) run the same call-prep skill. And it means the plugin composes with whatever you already pay for, which is not true of a product whose whole value proposition is its own database.

The plugin's `.mcp.json` declares fourteen HTTP servers, including Slack, HubSpot, Close, Monday, Clay, ZoomInfo, Notion, Atlassian, Fireflies, Apollo, Outreach and Similarweb. Two caveats you will not find in the docs: the Gmail and Google Calendar entries have deliberately empty URLs and are placeholders, so do not plan around them; and Microsoft 365 was removed from the sales manifest in June 2026 as a broken entry, even though `CONNECTORS.md` and the root README still list it. If you need a Microsoft 365 path today, treat it as unsupported here.

One more piece of configuration that the repo does not contain: the plugin looks for a `settings.local.json` holding your name, title, company, quota, value props and competitors. You create it. Its location is the only documented behavioural difference between hosts, which is a useful signal in itself about how similar the two surfaces are.

## claude.ai Projects: where the shared context lives

The plugin gives you procedures. Projects give you the facts those procedures reason over.

A Project is a workspace with its own chat history, a knowledge base, and instructions that apply to every chat inside it. For a sales team that is where positioning, the objection library, security and compliance answers, pricing rules, and a handful of genuinely good past emails belong. Every chat in that project starts with all of it, which is what stops nine reps from writing nine different descriptions of the same product.

Put the non-negotiables in the project instructions rather than the knowledge base, because instructions are applied rather than retrieved: naming rules, claims you are not allowed to make, the "no statistic without a source" rule, the competitor names you may and may not mention. On Team and Enterprise plans a project can be shared with view or edit rights, so one person owns it and everyone else works from it. Which plan gets you what is covered in [which Claude plan for sales teams](/guides/sales/which-claude-plan-for-sales-teams) and, in more general terms, [Claude plans compared](/guides/getting-started/claude-plans-compared-2026).

Skills upload into Projects too, so a rep on claude.ai gets the same procedures as a rep in Claude Code without touching a terminal.

## Cowork and Claude Code do different jobs

Anthropic's framing for the whole plugin collection is "Built for Claude Cowork, also compatible with Claude Code," and the sales plugin's own README calls it "primarily designed for Cowork... though it also works in Claude Code." That is accurate, and it is also not the whole decision.

Use [Cowork](/guides/getting-started/claude-cowork-guide) when the deliverable is a document and the input is a folder or an app you already use. A week of call notes into a summary. A folder of transcripts into a themes tracker. A morning briefing that runs on a schedule without you asking. Cowork works across folders and desktop apps you choose, which is the shape most sales work actually has.

Use [Claude Code](/guides/getting-started/what-is-claude-code) when the input is a file that will need the same treatment again next month. A CRM export with 12,000 rows and a duplicate problem. Two hundred outbound drafts that all need the same compliance check. A quarterly data hygiene pass. Claude Code edits files, runs commands, and leaves a repeatable artifact behind, which is the difference between doing the job and owning the job. That whole track, including the parts a rev-ops person can run without being a developer, is in [Claude Code for revenue ops](/guides/sales/claude-code-for-revenue-ops).

The mistake to avoid is using Claude Code as a chat window because someone on the team is technical. If the output is a document, Cowork is less friction and produces a better artifact.

## Connectors turn a guess into a lookup

Everything above runs on what you tell Claude. A connector is what lets it read your systems directly, and it is the single biggest jump in output quality available to a sales team.

Connectors are [MCP](/glossary/model-context-protocol) integrations: a server the vendor runs, an OAuth handshake, and a set of tools the model may call. This is what [grounding](/glossary/grounding) means in practice for sales work. Without a connector, "what happened on this account last quarter" is an inference. With one, it is a lookup.

All ten sales tools we surveyed for [the roundup](/guides/comparisons/best-ai-sales-tools-2026) ship a first-party MCP server, and nine carry a listing in Anthropic's connectors directory. Gong is the exception: it publishes its own endpoint and its own Claude setup page, but you add it as a custom connector. What varies is how much of the product the server actually exposes, and that variance is enormous:

- **[Close](/tools/close)** has the deepest surface in the set: a catalogue of 117 tools split across read, safe-write and destructive scopes, with the install command published in its own documentation. If you want Claude to genuinely operate a CRM rather than read it, this is the reference implementation.
- **[Attio](/tools/attio)** exposes 21 tools in the directory listing while its documentation describes more, uses OAuth rather than API keys, auto-approves reads and confirms writes, and named Claude Desktop, claude.ai and Claude Code as clients. Its April 2026 changelog also lets you set Claude Opus 4.7 as the default model inside Ask Attio, which is the tightest Claude integration any CRM in the set offers.
- **[ZoomInfo](/tools/zoominfo)** has the strongest Claude story of the data vendors: a directory listing with 21 tools plus an official Claude Code plugin installable as `zoominfo@claude-plugins-official`, with client guides for Claude Code, claude.ai, Claude Desktop and Cowork. Read its terms before you connect: ZoomInfo contractually prohibits using MCP-accessed data for AI model training and requires you to disable training in your client first.
- **[Gong](/tools/gong)** is the interesting counter-example. It runs its own MCP server and publishes a Claude MCP client page, but it is not in Anthropic's directory, so you add it as a custom connector. It exposes exactly three read-only tools: ask_account, ask_deal, generate_brief. That is a deliberate, narrow surface for [revenue intelligence](/glossary/revenue-intelligence), not a limitation to complain about.
- **[Outreach](/tools/outreach)** has a licensing gate worth reading before you plan around it: its documentation says you "must be an active, licensed seat" and "have the Amplify add-on package enabled."
- **[Fireflies](/tools/fireflies)** is listed with three tools in the directory (get_user, get_transcript, get_transcripts) while its docs describe a broader surface. It publishes its own walkthrough for connecting meeting data to Claude, which tells you where the vendor thinks the value is.
- **[Clay](/tools/clay)**, **[Apollo](/tools/apollo)**, **[Unify](/tools/unify)** and **[Nooks](/tools/nooks)** all have directory listings too, with Unify's the largest of the four at 50 tools. If you are choosing between the first two on enrichment, [Clay vs Apollo](/guides/comparisons/clay-vs-apollo) is the direct comparison.

Two accuracy notes that matter more than they sound. First, tool counts in Anthropic's directory and in a vendor's own docs frequently disagree, sometimes by a factor of two. Always say which source a number came from. Second, never repeat a claim that a connector is "verified by Anthropic". The directory does mark some connectors verified, but the same page says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change".

If your CRM is HubSpot rather than one of the above, [HubSpot Breeze](/tools/hubspot-breeze) is the vendor's own AI layer and HubSpot is one of the fourteen servers the sales plugin already declares. And for the research half of the job, general-purpose web tooling like [Exa](/tools/exa) or [Firecrawl](/tools/firecrawl) is often a better answer than a sales-specific database; [getting web data into AI agents](/guides/concepts/web-data-for-ai-agents) covers that trade-off.

## What Claude does well here, and where it fails

Being specific about this is the whole point of a page like this.

**It is genuinely good at:** reading a large amount of unstructured text and returning a structured artifact. Call notes into action items. A transcript into a summary. Ten tabs of research into an account profile with sources. A competitor's site into a battlecard. A messy export into a list of the fourteen records that are broken. Drafting a first version of anything, quickly, in a voice you have given it examples of. Auditing: checking a hundred things against a rule is exactly the shape of work where a model beats a tired human, because the human's error rate climbs and the model's does not.

**It fails, predictably, at:**

- **Anything that needs your CRM's ground truth without a connector.** Ask about pipeline coverage with nothing connected and you will get a plausible answer built from whatever you pasted. It will not say "I cannot see this." Assume that the absence of a connector means the absence of facts.
- **Any claim about a prospect it cannot source.** This is the [hallucination](/glossary/hallucination) surface that actually costs you deals, because it does not look like a hallucination. It looks like a specific, confident, personalized detail. A funding round that never closed. A title from two jobs ago. A product line the company sold off.
- **Arithmetic over your numbers when the numbers arrived as prose.** If a forecast came in as a paragraph rather than a table, check the totals.
- **Knowing what changed yesterday.** Three of the vendors on every page-one "best AI sales tools" listicle changed ownership during 2026 and are still listed as independent. A model trained before that will confidently tell you the same thing.
- **Judging whether an answer is defensible to a customer.** It will happily draft a security questionnaire response it has no basis for. That is what the [sales-engineer agent](/agents/sales/sales-engineer) exists to separate: what ships today versus what needs engineering.

None of this argues against using it. It argues for a verification step that is mechanical rather than a matter of individual diligence, which is the last section.

## The buyer trap: six of these ten tools meter AI separately from seats

If you take one purchasing fact from this page, take this one. Across the ten sales tools we priced from vendor pages, **six meter AI usage separately from seats**: [Clay](/tools/clay), [Attio](/tools/attio), [Apollo](/tools/apollo), [Outreach](/tools/outreach), [Fireflies](/tools/fireflies) and [ZoomInfo](/tools/zoominfo). All figures below were read from each vendor's own pricing page as of September 2026, and none of the per-unit numbers are restated here on purpose: prices move, and the [roundup](/guides/comparisons/best-ai-sales-tools-2026) carries them with dates.

The shape of the trap differs by vendor, which is why "check the seat price" is not a defence:

- **Clay** has no per-seat charge at all and two separate meters, actions and credits, that scale independently. You can exhaust one with the other untouched, and the published credit ladder tops out roughly eleven times higher than the entry tier. The advertised entry price is a floor, not a price.
- **Attio** sells seats for the CRM, but its agents draw from a separate workspace credit pool sold in add-on rungs. Its mid tier is also hard-capped at ten seats, so growing past ten forces a jump in per-seat cost on headcount alone.
- **Apollo** advertises unlimited usage that its own fair-use terms cap contractually, computed from your contract value. Its pricing page and its own comparison page also disagree about which tiers are annual and which are monthly, so get the billing period in writing.
- **Outreach** publishes no dollar figures at all. Its four tiers are differentiated only by AI-credit allocation, and it describes its own model as a combination of seat-based and consumption-based pricing.
- **Fireflies** advertises unlimited transcription, with a footnote saying AI Skills, the personal assistant and voice agents require AI credits, which are a separate currency from the seat.
- **ZoomInfo** splits into two products that must never be conflated: a self-serve GTM.AI offering with published per-credit pricing and no seat fees, and a core sales platform whose pricing page blocks automated clients entirely and for which every circulating figure is third-party.

Three more have no clean seat price to check at all. **Gong** publishes zero dollar figures and describes a per-user licence plus a platform fee that scales with the number of users supported, so the negotiated per-seat rate is not the bill. **Nooks** is contact-sales only, with no tiers, no figures and no listed trial. **Close** and **Unify** are the two cleanest self-serve stories in the set, and even Close meters telephony, its Call Assistant add-on and AI credits on top of the subscription, which is worth knowing because the AI calling agent that justifies the purchase is also the feature that drives variable spend.

The practical rule: before you sign, ask for a modelled bill at your expected AI usage, not your seat count. And notice how much of the trap disappears when the AI layer is Claude, which you already pay for, and the vendor is supplying data through a connector rather than intelligence through a credit meter. That is the structural argument for the plugin-plus-connector approach, and it is the reason a term like [AI SDR](/glossary/ai-sdr) deserves more scrutiny than it usually gets.

## Verification habits: never send a claim you cannot source

A model that drafts is a productivity gain. A model that drafts unverified specifics is a liability with a good hit rate. The fix is not "be careful." The fix is a check that runs every time, on every draft, without depending on anyone's attention.

Anthropic's draft-outreach skill is well designed here: it researches before it writes, it reports which sources it used, and it explicitly refuses to send generic outreach. But reporting a source is not verifying one, and the skill's job ends at the draft. So we built the complement, which is the check before send:

- **[outreach-claim-checker](/skills/sales/outreach-claim-checker)** takes a drafted email and pulls out every factual claim about the prospect, then tells you which ones are sourced and which are not. Unsourced specifics get deleted, not rewritten. Run it as [`/check-outreach`](/commands/sales/check-outreach).
- **[cold-email-deliverability-auditor](/skills/sales/cold-email-deliverability-auditor)** is the purely technical half nothing in the plugin touches: SPF, DKIM and DMARC records, domain warmup, list hygiene, and a spam-trigger scan. Perfect personalization does not help from a domain that is not authenticated.
- **[crm-export-auditor](/skills/sales/crm-export-auditor)** audits a CRM CSV for duplicates, stale close dates, missing required fields and single-threaded deals. Anthropic's pipeline-review analyses pipeline health; this checks whether the data underneath it is worth analysing. Run it as [`/audit-crm`](/commands/sales/audit-crm).
- **[security-questionnaire-responder](/skills/sales/security-questionnaire-responder)** drafts answers to a prospect's security questionnaire from your own documentation and marks each answer as sourced or needs-review. The marking is the whole feature.

The full set, plus how it composes with the plugin's nine, is in [Claude skills for sales](/guides/sales/claude-skills-for-sales). If you want to understand the underlying mechanism first, [what are Claude Skills](/guides/skills/what-are-claude-skills) is the primer.

Two habits complete the picture. First, keep a human approving anything that leaves your domain or writes to a system of record. Anthropic's own connector design encodes this: Attio auto-approves reads and confirms writes, and Close separates safe-write from destructive scopes. That pattern is worth copying wherever you build; [human-in-the-loop AI workflows](/guides/workflow/human-in-the-loop-ai-workflows) covers the approval-gate design. Second, when an [AI agent](/glossary/ai-agent) writes to your CRM, log what it wrote. Every autonomous write you cannot reconstruct later is a data quality incident waiting to be discovered by a forecast.

## A first week that costs nothing

A sequence that produces evidence rather than opinions:

1. **Install the sales plugin** and create your `settings.local.json` with company, role, quota, value props and competitors. Nothing else works well without it.
2. **Run account-research and call-prep on three real accounts** with no connectors attached. This is your baseline: what Claude produces from public web data plus what you tell it.
3. **Connect one system, ideally your CRM or your call recorder.** Run the same three accounts again. The delta between run two and run three is the honest measure of what a connector is worth to you, and it is usually large enough to settle the argument.
4. **Run draft-outreach, then run the claim check on the output.** Count the unsourced specifics. That number is your risk exposure per rep per week, and it is the number that tells you whether the check should be mandatory.
5. **Point Claude Code at last quarter's CRM export** and run the audit. This is the job that most reliably surprises people, because the data is always worse than anyone expects.
6. **Only then** open [the tool roundup](/guides/comparisons/best-ai-sales-tools-2026), knowing which gaps are real.

Steps two and three together are also the fastest way to learn [prospect research mechanics](/guides/sales/research-prospects-with-claude), which is the highest-volume job in the whole list.

## The honest limits

A few things this guide will not pretend.

The plugin is not a product. It has no support contract, no roadmap you can influence, and its own documentation is demonstrably out of date in at least five places. That is the ordinary cost of Apache-2.0 software, and it is a fair trade for zero dollars and no lock-in, but go in knowing it.

Connectors are not equal, and the good ones are not evenly distributed. If your stack is Close, Attio or ZoomInfo, Claude reaches deep into it. If your stack is something with a thin server or none, the ceiling is lower and no amount of prompting raises it.

Salesforce shops have a live question worth tracking rather than acting on: Claude is being integrated into Agentforce, including a Salesforce plugin with prebuilt sales skills, but as of September 2026 that work is pilot-only with open beta expected, not generally available. Do not plan a quarter around it yet.

And the largest limit is the one nobody can engineer away. Claude will make your team faster at research, prep, summarising, drafting and auditing. It will not make a bad message good, and a personalization engine pointed at the wrong list simply produces wrong messages faster. The tooling is the easy half. Use the time it gives back on the half it cannot touch. Pair this with [prompting techniques](/guides/prompting/prompting-techniques-2026) if you want your team's outputs to get more consistent, and [data privacy for LLM apps](/guides/ai-safety/data-privacy-for-llm-apps) before you point any of this at customer data. Two more terms worth knowing before you sit in a vendor demo: [conversation intelligence](/glossary/conversation-intelligence) and [sales engagement platform](/glossary/sales-engagement-platform), both of which mean narrower things than the pitch implies.
