---
name: "Gong"
description: "Gong records and analyses every customer conversation across an org, deriving deal risk, forecast and coaching signals, and publishes three read-only MCP tools."
seoDescription: "Gong for sales teams: why we publish no price, what the platform fee changes, and how its three read-only MCP tools connect to Claude as a custom connector."
date: 2026-09-10
url: "https://www.gong.io/"
pricing: "enterprise"
category: "sales"
color: "orange"
os: ["Web", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["gong", "revenue-intelligence", "conversation-intelligence", "mcp", "forecasting"]
featured: false
alternativeTo: ["fireflies"]
sameAs: ["https://www.gong.io/pricing", "https://mcp.gong.io/mcp"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "tool:fireflies", "tool:outreach", "tool:nooks", "glossary:revenue-intelligence", "glossary:conversation-intelligence"]
keywords: ["Gong", "Gong pricing", "Gong MCP server", "revenue intelligence", "conversation intelligence", "Gong Agents"]
summary: "Gong is a revenue-intelligence platform that records and analyses every customer conversation across an organisation and turns them into deal-risk, forecast and coaching signals, with Gong Agents writing back to the CRM. We publish no price for it, because Gong publishes none. Its MCP server is live at mcp.gong.io/mcp and exposes exactly three read-only tools."
faq:
  - q: "How much does Gong cost?"
    a: "We do not know, and neither does any page that tells you. Gong's pricing page carries no dollar figures and no tier names, only that licences are priced per user plus a platform fee based on the number of users supported. There is no free tier and no self-serve trial. The ranges you will find elsewhere come from third-party procurement databases, not from Gong."
  - q: "Why will you not repeat the per-seat figures other sites publish?"
    a: "Because they are resold contract data from procurement aggregators, not vendor-published prices, and they cannot be verified against any Gong source. On this site a price is only published when the vendor publishes it and we can date it. For Gong that means no number at all, including the platform fee and the seat minimum."
  - q: "Can I connect Gong to Claude?"
    a: "Yes, but as a custom connector rather than from the directory. Gong runs its own MCP server at https://mcp.gong.io/mcp, published its MCP documentation on 27 August 2026 and maintains a Claude MCP Client page of its own. Gong is not listed in Anthropic's Connectors Directory, so you add the endpoint yourself."
  - q: "What can the Gong MCP server actually do?"
    a: "Three things, all read-only: ask_account, ask_deal and generate_brief. That is the whole surface. It is available on any Gong plan, which is unusually generous, though Gong notes you also need a Claude plan that supports custom remote MCP connectors — Pro, Max, Team or Enterprise. You cannot write back to Gong through it and you cannot pull raw transcripts wholesale."
---

Gong sits at the org level rather than the rep level. It records and analyses customer conversations across every team touching revenue, then derives the second-order signals that make it a system of record for how deals are actually going: risk on a specific opportunity, forecast roll-up, coaching gaps by rep. Gong Agents write conclusions back into the CRM, which is what separates it from a meeting recorder.

Gong is private, has not been acquired, and said on 12 May 2026 that its growth accelerated to over 55% year over year in its most recent quarter, the tenth straight quarter of accelerating growth.

## We publish no price for Gong

Gong's own pricing page carries zero dollar figures and zero tier names. It says only that licences are priced per user, and that there is a platform fee based on the number of users supported. There is no free tier and no self-serve trial.

Third-party procurement databases circulate per-seat ranges, platform-fee ranges and a seat minimum. Those numbers are resold contract data. They are not published by Gong, they cannot be checked against any Gong source, and contract terms vary enough between customers that quoting a range as if it were a price is misleading. So this page has no number on it — and any page that gives you one should tell you where it came from.

What you can plan around is the shape of the bill. It is two-part: a per-user licence **plus** a platform fee that scales with the number of users supported. That second component is the trap. A per-seat rate negotiated down looks like a win right up until the platform fee is recalculated against a headcount that includes people who never log in but whose calls are recorded. Ask for both components in writing, and ask specifically what "users supported" counts.

## Can a Claude user connect it?

Yes, with the narrowest surface in this set — and it is the one tool here that is **not** in Anthropic's Connectors Directory, so you add it as a custom connector.

Gong runs its own MCP server at `https://mcp.gong.io/mcp`, published its MCP documentation on 27 August 2026, and maintains a "Claude MCP Client" page of its own, which is more than most vendors do. The server exposes exactly three tools, all read-only:

- `ask_account` — questions scoped to an account
- `ask_deal` — questions scoped to an opportunity
- `generate_brief` — a prepared summary

It is available on any Gong plan, which is unusual — though Gong's own Claude page adds a gate on the other side: you need a Claude plan that supports custom remote MCP connectors, which it lists as Pro, Max, Team or Enterprise. But understand the design: this is a question-answering surface over Gong's own analysis, not an export pipe. You cannot write back, and you cannot pull the transcript corpus out to reason over it yourself. If your plan was to have Claude read a quarter of calls and find patterns Gong's models did not surface, this endpoint will not do it.

That constraint is defensible for recorded-conversation data, and it is worth reading alongside how the rest of the category handles access — [Claude for sales teams](/guides/sales/claude-for-sales-teams) walks through connecting each one and what each will and will not hand over.

## Where it fits against the alternatives

Gong is the [revenue intelligence](/glossary/revenue-intelligence) purchase: whole-org coverage, forecast and coaching, bought by a VP with a budget. If what you actually need is [conversation intelligence](/glossary/conversation-intelligence) — the recording, the transcript, the searchable notes, the CRM write-back — [Fireflies](/tools/fireflies) does that for a published per-seat price and a far cheaper start. The gap between them is analysis across an organisation versus capture within a meeting, and plenty of teams buy the cheaper one first and never need the other.

If your problem is execution rather than analysis, [Outreach](/tools/outreach) owns the rep's outbound workflow and [Nooks](/tools/nooks) owns the dialer. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup sets all four against each other.
