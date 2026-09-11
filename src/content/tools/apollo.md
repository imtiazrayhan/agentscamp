---
name: "Apollo"
description: "Apollo pairs a 240M+ contact database with outbound sequencing in one seat, and its MCP server is the most agentic thing about it."
seoDescription: "Apollo for sales teams: two vendor sources disagree on pricing as of September 2026, the credit cap behind unlimited, and the mcp.apollo.io connector."
date: 2026-09-10
url: "https://www.apollo.io/"
pricing: "freemium"
category: "sales"
color: "orange"
os: ["Web", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["apollo", "lead-enrichment", "sales-engagement", "mcp", "prospecting"]
featured: false
alternativeTo: ["clay", "zoominfo", "unify"]
sameAs: ["https://www.apollo.io/pricing", "https://www.apollo.io/insights/apollo-vs-zoominfo"]
related: ["guide:clay-vs-apollo", "guide:best-ai-sales-tools-2026", "guide:claude-for-sales-teams", "tool:clay", "tool:zoominfo", "tool:unify", "glossary:lead-enrichment", "glossary:sales-engagement-platform"]
keywords: ["Apollo.io", "Apollo pricing", "Apollo MCP server", "B2B contact database", "sales engagement"]
summary: "Apollo puts a B2B database of 240M+ contacts and 30M+ companies, and the sequencing to act on it, behind one seat. Its AI is assistive rather than autonomous: an assistant, call summaries and AI Research inside deterministic sequences. The genuinely agentic surface is its MCP server at mcp.apollo.io/mcp, whose connector listing exposes 13 tools. Apollo acquired Pocus in March 2026."
faq:
  - q: "How much does Apollo cost?"
    a: "Two Apollo sources disagree and we publish both. As of September 2026 the JSON-LD embedded in Apollo's own pricing page lists Free at 0 dollars, Basic at 49 and Professional at 99 with a billing increment of Monthly, while Apollo's comparison page dated 13 May 2026 quotes annual rates of Free 0, Basic 49 per user per month, Professional 79 and Organization 119, with a three-seat minimum. The two reconcile only if 49, 79 and 119 are annual and 99 is Professional billed monthly. Apollo does not say so, so we publish no monthly Basic or Organization rate."
  - q: "Is Apollo's unlimited plan really unlimited?"
    a: "No. Apollo's fair-use language caps it at the lesser of dollars paid divided by 0.025 or one million credits per account per year. As of September 2026 that means a 5,000-dollar annual contract tops out at 200,000 credits. It is a generous ceiling, but it is a ceiling, and it scales with spend rather than with need."
  - q: "Can I connect Apollo to Claude?"
    a: "Yes. Apollo publishes an MCP endpoint at https://mcp.apollo.io/mcp with OAuth authentication, and its Connectors Directory listing is dated February 2026 and registers 13 tools, while Apollo's documentation describes more than 50. One gotcha catches people immediately: free accounts registered on a personal email address cannot use the search and enrichment actions at all."
  - q: "Does Apollo have an AI agent?"
    a: "Not in the autonomous sense. Apollo ships an AI Assistant, AI call summaries and AI Research, all of which are assistive features inside deterministic sequencing rather than an agent that decides and acts on its own. The most agentic thing you can do with Apollo is let someone else's agent drive it through the MCP server."
---

Apollo is the database and the outbound machine in one subscription: more than 240 million contacts, filters to slice them, and sequences, a dialer and an inbox to work them. For a small team, that bundling is the entire pitch. You do not buy data from one vendor and engagement from another.

Its acquisition of Pocus landed in March 2026, dated on both Apollo's and Pocus's own announcements.

## The AI story is the weakest here, and that is fine

Apollo ships an AI Assistant, AI call summaries and AI Research. All three are assistive features sitting inside deterministic sequencing: they draft, summarise and suggest, but the sequence logic is still rules you wrote. Nothing here decides on its own to open a new play. Compared with [Unify](/tools/unify)'s signal-triggered plays or Clay's Claygent, Apollo is the least agentic product in this set.

The interesting inversion is that its most agentic surface is the one it does not market: the MCP server, which lets your agent drive Apollo rather than Apollo running an agent for you.

## Can a Claude user connect it?

Yes. The endpoint is `https://mcp.apollo.io/mcp` and authentication is OAuth. Apollo's Connectors Directory listing is dated February 2026 and registers 13 tools; Apollo's documentation describes more than 50. Those are different numbers from different sources, and any page quoting one without saying which is guessing — we cite the directory count when we say 13 and Apollo's docs when we say 50-plus. We make no claim about Apollo's verification status. Anthropic's directory does mark some connectors verified, but its own page says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change" — so a badge is not an assurance worth repeating.

One gotcha stops evaluations dead: **free accounts registered on a personal email domain cannot use the search or enrichment actions**. If you are testing the connector on a Gmail signup, the tools will list and then refuse to do the only work you wanted them for.

Anthropic also ships a partner-built Apollo plugin as part of its knowledge-work plugins, which is a different install path from the connector; the [knowledge-work plugins guide](/guides/getting-started/claude-knowledge-work-plugins) explains how those are packaged, and [Claude for sales teams](/guides/sales/claude-for-sales-teams) covers which one to reach for.

## Pricing: two vendor sources, one page

Apollo is the only tool in this set where the vendor contradicts itself, so we print both readings rather than pick a winner.

As of September 2026 the JSON-LD embedded in Apollo's own pricing page lists Free at $0, Basic at $49 and Professional at $99, with a billing increment of "Monthly". As of September 2026 Apollo's comparison page, dated 13 May 2026, quotes annual pricing instead: Free $0, Basic $49 per user per month, Professional $79 and Organization $119, with a three-seat minimum.

The two readings reconcile only if the $49, $79 and $119 figures published as of September 2026 are annual rates and the $99 is Professional billed monthly. Apollo never states that, so the monthly Basic and Organization rates are unverified and we do not publish them. Get them in writing before you sign.

Then read the fair-use text, because "unlimited" has a number attached. As of September 2026 Apollo's fair-use text caps it at the lesser of dollars paid divided by $0.025, or one million credits per account per year. As of September 2026 that makes a $5,000 annual contract a 200,000-credit contract. Credits are a separate currency from seats, which puts Apollo in the same category as [Clay](/tools/clay) and [ZoomInfo](/tools/zoominfo): the seat price is not the bill.

## Where it fits

Apollo is the value pick when one team needs data and execution together and nobody is going to maintain a waterfall. If your enrichment problem is really a routing problem across many vendors, [Clay](/tools/clay) is the better shape, and [Clay vs Apollo](/guides/comparisons/clay-vs-apollo) works through the trade. If procurement wants an incumbent dataset, ZoomInfo is the alternative. As a [sales engagement platform](/glossary/sales-engagement-platform) Apollo is deliberately mid-market; the [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup places it against the enterprise options.
