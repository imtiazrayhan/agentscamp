---
title: "How to Research a Prospect with Claude (and Verify It Before You Send)"
description: "A step-by-step prospect research workflow in Claude: run account-research standalone, add an enrichment connector, draft the email, then verify every claim."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["prospect-research", "claude", "sales-plugin", "enrichment", "outreach", "verification"]
featured: false
seoTitle: "How to Research a Prospect with Claude: Step-by-Step (2026)"
seoDescription: "Research prospects with Claude step by step: the sales plugin's account-research skill, enrichment connectors, draft-outreach, and a pre-send claim check."
keywords: ["research prospects with claude", "claude account research", "ai prospect research", "claude draft outreach", "sales research workflow"]
summary: "Run the sales plugin's account-research skill first with nothing connected: it works on web search alone. Add an enrichment connector for verified contact data, draft with draft-outreach, then run a claim check before anything sends. A personalization claim the model cannot source is the one that loses the deal."
keyTakeaways:
  - "account-research works with zero connectors — its own description says it is standalone on web search and only 'supercharged' when you add enrichment or a CRM — so run it bare first and see what the open web already gives you."
  - "Treat the first output as a hypothesis with a source list, not a brief. The four failure modes that actually cost deals are stale pages, two people with the same name, an inferred job change, and a funding event that was never announced."
  - "An enrichment connector changes what is verifiable, not how much text you get: the skill's own synthesis step prioritises enrichment data over web results because it is more accurate."
  - "draft-outreach always researches before it writes and returns the rationale table alongside the email — that table is the list of claims you have to check."
  - "The last step is the whole workflow: run a claim check before anything sends, and delete or rewrite any line whose source you cannot open."
sources:
  - title: "knowledge-work-plugins (the sales plugin and its nine skills)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Clay connector directory listing"
    url: "https://claude.com/connectors/clay"
    publisher: "Anthropic"
  - title: "Apollo"
    url: "https://www.apollo.io/"
    publisher: "Apollo"
  - title: "ZoomInfo"
    url: "https://www.zoominfo.com"
    publisher: "ZoomInfo"
howtoSteps:
  - name: "Install the sales plugin"
    text: "In Claude Code, run claude plugin marketplace add anthropics/knowledge-work-plugins then claude plugin install sales@knowledge-work-plugins. In Cowork, install it from claude.com/plugins. The plugin is file-based markdown and JSON — there is nothing to build or host."
  - name: "Run account-research with nothing connected"
    text: "Ask for the research in plain language: 'research acme.com' or 'look up Jane Smith, VP Sales at Acme'. The skill runs a fixed set of web searches — company, news, funding, careers, LinkedIn, product, customers — and returns a profile with a Sources list at the bottom. Read that list first."
  - name: "Interrogate the output before you trust it"
    text: "Ask Claude which claims came from a page it opened and which were inferred, and make it restate the date on every news item. Anything about a person's current title, a funding round, or a tech stack needs a URL you can open yourself."
  - name: "Add an enrichment connector and rerun"
    text: "Connect Clay, Apollo or ZoomInfo, then run the same research again. The skill's own synthesis step prioritises enrichment data over web results because it is more accurate, and the output gains verified contact details, an org chart, precise headcount and a tech stack section that the standalone run cannot produce."
  - name: "Close the remaining gaps deliberately"
    text: "For anything neither web search nor enrichment settled — a pricing page, a docs site, a changelog — run a scoped crawl or search API pass rather than asking the model to remember. Feed the extracted text back as context and keep the URL next to it."
  - name: "Draft with draft-outreach"
    text: "Hand the research to draft-outreach ('draft outreach to Jane Smith at Acme'). It researches first by design, then returns an email with subject-line alternatives, a LinkedIn connection request under 300 characters, a follow-up sequence, and a table explaining what each element was based on."
  - name: "Run the claim check before anything sends"
    text: "Take every factual line in the draft — the funding round, the new hire, the migration, the job title — and check each against a source you can open. Rewrite or delete anything that fails. This is the step that separates a personalized email from a guess."
  - name: "Send, and keep the source list with the record"
    text: "Paste the verified source list into the CRM activity or the deal note. When the prospect replies three weeks later asking where you heard something, you have the URL, and the next rep on the account inherits it."
faq:
  - q: "Do I need Clay, Apollo or ZoomInfo to research prospects with Claude?"
    a: "No. The sales plugin's account-research skill is explicitly standalone: its description says it 'works standalone with web search, supercharged when you connect enrichment tools or your CRM.' Web search alone gets you the company overview, recent news, hiring signals and the leadership team. What enrichment buys is verified contact details, a complete org chart, precise headcount and a tech stack — the fields you cannot reliably read off the open web. Start bare, and add a connector when you find yourself guessing at the same field every time."
  - q: "Why does Claude sometimes get a prospect's job title wrong?"
    a: "Three reasons, and they are all retrieval problems rather than reasoning problems. The page it read is old and nobody updated it. Two people share the name and the model merged them. Or the model saw a promotion announcement and inferred a current title that was never stated. All three look identical in the output — a confident sentence with no visible seam — which is why the fix is a source you can open, not a better prompt."
  - q: "What is the fastest way to catch a hallucinated funding round?"
    a: "Ask for the announcement URL and the date in the same breath as the claim, then open it. Funding events are the most common invented detail in prospect research because they are so heavily written about that plausible-sounding rounds are easy to assemble from adjacent facts. If there is no press release, no investor post and no dated coverage, the round does not go in the email."
  - q: "Can Claude send the outreach for me?"
    a: "Only if you have connected an email tool, and it is worth being deliberate about that. draft-outreach produces a draft and, where email is connected, can create it in your inbox — but the plugin's own design is draft-then-you-send. Keep it that way until the claim check is a habit. An unverified claim that stayed in a draft costs you nothing; the same claim in a sent message is the one the prospect remembers."
related: ["guide:claude-for-sales-teams", "guide:claude-sales-plugin-guide", "skill:outreach-claim-checker", "command:check-outreach", "skill:web-research-pipeline", "tool:clay", "tool:apollo", "glossary:grounding", "glossary:hallucination"]
---

Prospect research is the place where AI help is most obviously useful and most quietly dangerous. Useful, because an account brief is mostly retrieval and synthesis, and a model with web search does that faster than you do. Dangerous, because the one line that makes an email feel personal — the round they raised, the title they just took, the platform they are migrating off — is exactly the line most likely to have been inferred rather than read.

A wrong personalization claim does not land as a small error. It lands as evidence that nobody actually looked. That is why this workflow has four passes rather than one: research with nothing connected, research with enrichment, draft, and verify. The last pass is the one this site cares about most.

This walkthrough uses Anthropic's [sales plugin](/guides/sales/claude-sales-plugin-guide), which is nine skills of plain markdown — no code, no infrastructure. If you have not installed it, the catalog guide to [Anthropic's knowledge-work plugins](/guides/getting-started/claude-knowledge-work-plugins) covers the marketplace step; the two commands are `claude plugin marketplace add anthropics/knowledge-work-plugins` and `claude plugin install sales@knowledge-work-plugins`, or an install from claude.com/plugins if you are in Cowork.

## 1. Run account-research with nothing connected

Start bare. The skill is built for it — its own description reads "Research a company or person and get actionable sales intel. Works standalone with web search, supercharged when you connect enrichment tools or your CRM."

Trigger it the way the skill says to: `research acme.com`, or `look up Jane Smith, VP Sales at Acme`. (Anthropic's repository README also describes plugin skills surfacing as namespaced commands like `/sales:account-research`; that README is demonstrably stale on adjacent facts, so treat the plain-language trigger as the reliable path.)

What comes back is a structured profile: a quick take, a company table, recent news, hiring signals, key people with talking points, qualification signals split into positive and concerning, a recommended entry point, and — the part most people skip — a **Sources** list. The skill runs a fixed set of searches to build it: the company, its news, its funding, its careers page, the person's LinkedIn, the product, and the customers.

Read the sources list first. Everything downstream depends on it.

## 2. Read the output as a hypothesis

The output is formatted like a report, which makes it feel settled. It is not. Four failure modes account for nearly every prospect-research mistake worth worrying about, and all four produce fluent sentences.

**Stale web data.** The team page has not been touched in two years; the pricing page in the index predates the repackaging. Nothing in the output tells you a page was old unless you ask for dates, so ask for dates.

**Two people, one name.** Person research is where this bites. A common name plus a common title merges two careers into one biography, and the resulting person is plausible and does not exist. Anchor every person lookup to a company and, where you have it, a LinkedIn URL.

**Inferred job changes.** The model reads "excited to be joining Acme" from eighteen months ago and reports a current title. It may be right. It is an inference either way, and the prospect knows their own title better than you do.

**Funding events that never happened.** Funding is written about so heavily that a model can assemble a convincing round from adjacent facts — an investor in the space, a stage that fits the headcount, a month that fits the news cycle. This is the classic [hallucination](/glossary/hallucination) failure: a well-formed claim with nothing behind it.

The defence for all four is [grounding](/glossary/grounding) — every claim tied to a retrieved source you can open. So make the demand explicit in your follow-up prompt: *for each claim in the profile, tell me whether it came from a page you opened or from inference, and give me the URL and the date.* The claims that survive that question are the ones you can build an email on.

## 3. Add an enrichment connector and rerun

Now connect one of the enrichment platforms and run the same research again. [Clay](/tools/clay) is listed in Anthropic's connector directory with seven tools; [Apollo](/tools/apollo) exposes an OAuth MCP server at `https://mcp.apollo.io/mcp` and is listed with thirteen tools, though its own docs describe a wider surface; [ZoomInfo](/tools/zoominfo) is listed with twenty-one tools and also ships an official Claude Code plugin. All three are declared connectors in the sales plugin's own manifest, so the skill knows how to use them.

What changes is narrower than the marketing suggests, and more valuable. The prose does not get better. What you gain is a set of fields that are *verifiable by construction* rather than scraped: verified email and phone, a complete org chart, a precise headcount, funding history with named investors, and a tech stack section that simply does not appear in a standalone run. The skill's synthesis step is explicit about the hierarchy — it prioritises enrichment data over web results because it is more accurate.

Two practical notes. Apollo blocks search and enrichment actions for free accounts registered on a personal email address, so a trial on your Gmail will look broken when it is working as designed. And ZoomInfo requires you to disable model training in your client before you connect, and contractually prohibits using MCP-accessed data for AI model training — a term your revenue ops owner should read before anyone connects it, covered in [Claude Code for revenue ops](/guides/sales/claude-code-for-revenue-ops).

## 4. Close the remaining gaps on purpose

There will still be gaps: a docs site the search did not surface, a changelog that answers the "are they actually building this" question, a pricing page that tells you which tier they are on. Do not ask the model to recall these. Fetch them.

The [web research pipeline skill](/skills/data/web-research-pipeline) is the disciplined version of this — plan the queries, fetch, extract, keep the citation attached to the extract. For the fetching itself, [Firecrawl](/tools/firecrawl) turns a URL or a site section into clean markdown, and [Exa](/tools/exa) is better when you know the shape of what you want but not the address. Either way the rule is the same: the extracted text and its URL travel together into the context, so the claim and its source never get separated.

## 5. Draft with draft-outreach

With the research in hand, hand it to `draft-outreach` — "draft outreach to Jane Smith at Acme". The skill researches before it writes by design; its description says it "never sends generic outreach."

What comes back is not just an email. You get a subject line plus alternatives, a LinkedIn connection request under 300 characters and a follow-up message for after they accept, a three-touch follow-up sequence, and a **Why This Approach** table mapping each element — opening, hook, proof, call to action — to the research finding behind it.

That table is the most useful artifact in the whole run, because it is your claim inventory. Every row is a factual assertion you are about to make to a stranger.

## 6. Check every claim before anything sends

This is the step the workflow exists for. Take the draft and the rationale table, and check each factual line against a source you can open: the funding round, the new VP, the migration, the job title, the customer logo, the headcount. Our [outreach claim checker](/skills/sales/outreach-claim-checker) does exactly this pass — it walks the personalization claims in a drafted message, marks each one sourced or unverifiable, and flags what should not ship. The [check-outreach command](/commands/sales/check-outreach) is the one-line runner for it.

Three rules make the pass fast:

1. **No source, no claim.** If you cannot open a page that says it, rewrite the line to something you can stand behind, or cut it. A slightly less personal email beats a confidently wrong one every time.
2. **Dates are claims too.** "Recently raised" and "just launched" assert timing. Check the timing.
3. **Titles get verified last and hardest**, because they are both the most common personalization hook and the most commonly inferred field.

## 7. Keep the sources with the record

When the check passes, paste the verified source list into the CRM activity alongside the sent message. It pays twice: when the prospect replies asking where you saw something, and when the next rep on the account inherits the research instead of redoing it.

## Where this fits

This is one workflow out of several a sales team runs on Claude; the map of the rest — call prep, pipeline review, battlecards, and which surface to run them in — is in [Claude for sales teams](/guides/sales/claude-for-sales-teams). If you are still choosing the enrichment platform, the comparison is in [the best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026).

The workflow is boring on purpose. Research bare, research enriched, draft, verify. Only the last step is unusual, and only because most teams skip it.
