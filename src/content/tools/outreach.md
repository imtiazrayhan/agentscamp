---
name: "Outreach"
description: "Outreach is a sales-execution platform that owns the outbound rep's whole workflow, repackaged around agents including Outreach Omni and Agent Studio."
seoDescription: "Outreach for sales teams: why no dollar figures are published as of September 2026, the Amplify credit tiers, and the licensed-seat gate on its MCP server."
date: 2026-09-10
url: "https://www.outreach.ai/"
pricing: "enterprise"
category: "sales"
color: "orange"
os: ["Web", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["outreach", "sales-engagement", "mcp", "ai-agents", "outbound"]
featured: false
alternativeTo: ["close", "apollo", "nooks"]
sameAs: ["https://www.outreach.ai/pricing", "https://developers.outreach.io/"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "tool:close", "tool:apollo", "tool:nooks", "tool:gong", "glossary:sales-engagement-platform", "glossary:ai-sdr"]
keywords: ["Outreach", "Outreach.ai", "Outreach Omni", "Outreach MCP server", "Amplify AI credits", "sales execution platform"]
summary: "Outreach owns the outbound rep's workflow end to end: sequences, dialer, call recording through Kaia, deal management and forecasting, now repackaged around agents such as Outreach Omni and Agent Studio. It publishes no dollar figures at all, only four Amplify tiers separated by AI-credit allocation. Its MCP endpoint is live but gated behind a licensed seat plus the Amplify add-on."
faq:
  - q: "Is the correct URL outreach.io or outreach.ai?"
    a: "Outreach.ai. The old outreach.io domain now issues a permanent redirect to outreach.ai, so any link or citation still pointing at the .io site is redirecting. The developer documentation is the exception and stayed on developers.outreach.io, and the MCP endpoint itself is still served from the .io domain."
  - q: "How much does Outreach cost?"
    a: "Outreach publishes no dollar figures. As of September 2026 its pricing page lists four Amplify tiers differentiated only by AI-credit allocation - Essentials at 10,000 credits, Core at 25,000, Plus at 50,000 and Pro at 100,000 - each marked Request pricing. Outreach describes the model as a combination of seat-based pricing and consumption-based pricing powered by AI credits. Any per-seat figure you find elsewhere is unverified."
  - q: "Can I connect Outreach to Claude?"
    a: "Yes, with a licence gate. Outreach has a Connectors Directory listing dated February 2026 registering 15 tools, while its documentation describes 32. The endpoint is https://api.outreach.io/mcp/ over Streamable HTTP with OAuth 2.1, PKCE and dynamic client registration. Outreach's docs state that you must be an active, licensed seat and have the Amplify add-on package enabled."
  - q: "Is Outreach actually agentic or is it AI branding?"
    a: "Genuinely agentic, unusually for this category. Outreach Omni launched on 27 April 2026 as a universal conversational agent, alongside Agent Studio for building your own, plus a Meeting Prep Agent, a Research Agent, a Deal Agent and Smart Kaia Coach. The trade is that agent actions consume the same AI credits your tier allocates."
---

Outreach is the platform version of an outbound team's day. Sequences, the dialer, call recording and analysis through Kaia, deal management, forecasting: it wants the whole workflow, not a slice of it. In 2026 the entire surface was repackaged around agents, and unlike most vendors making that claim, Outreach shipped real ones — Outreach Omni, a universal conversational agent launched on 27 April 2026, plus Agent Studio, a Meeting Prep Agent, a Research Agent, a Deal Agent and Smart Kaia Coach.

**Note the domain.** Outreach's site now lives at outreach.ai; the old outreach.io address issues a permanent redirect. The developer documentation stayed behind on developers.outreach.io, and so did the API host — which matters in the next section, because the MCP endpoint is still on .io.

## Can a Claude user connect it?

Yes, but you have to clear a licensing gate first, and it is the strictest in this set.

Outreach has a listing in Anthropic's Connectors Directory dated February 2026, and that listing registers 15 tools. Outreach's own documentation describes 32. Those are two first-party sources that disagree, so cite the one you mean; when we say 15 we mean the directory, and when we say 32 we mean the docs. We make no claim about its verification badge. Anthropic's directory does mark some connectors verified, but its own page says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change" — so a badge is not an assurance worth repeating.

The endpoint is `https://api.outreach.io/mcp/`, served over Streamable HTTP with OAuth 2.1, PKCE and dynamic client registration — a modern, correctly specified setup that will just work in Claude Code once you are entitled to use it. Entitlement is the catch. Outreach's documentation states that you "must be an active, licensed seat... and have the Amplify add-on package enabled."

In practice that means an evaluation account will not do, a shared service login will not do, and if your org bought Outreach without the Amplify add-on, the connector is not available to you at any price you can look up. Confirm the add-on before you plan work around this connection. [Claude for sales teams](/guides/sales/claude-for-sales-teams) covers what to check on each connector before you build a workflow on it.

## Pricing: no anchor, in either direction

As of September 2026, Outreach's pricing page carries no dollar figures at all. It lists four Amplify tiers, and the only stated difference between them is the AI-credit allocation: Essentials at 10,000, Core at 25,000, Plus at 50,000 and Pro at 100,000, each marked "Request pricing."

Outreach does describe the model, and the description is the useful part: "a combination of seat-based pricing and consumption-based pricing powered by AI credits." That is double metering. You pay per seat and you pay per agent action, and neither has a public anchor. Any per-seat number circulating on comparison sites is unverified, and we publish none.

The buying consequence is concrete: negotiate the credit allocation as hard as the seat rate, and ask what an Omni conversation, a Research Agent run and a Meeting Prep Agent run each consume. A tier defined purely by credits is a tier whose value you cannot compare until you know the burn rate.

## Where it fits against the alternatives

Outreach is an enterprise purchase for teams whose outbound motion is the business. If your team is smaller and phone-first, [Close](/tools/close) gives you the CRM and the dialer with published prices. If you want the database and the sequencing in one cheap seat, [Apollo](/tools/apollo) is the mid-market answer. If the bottleneck is connect rate rather than orchestration, [Nooks](/tools/nooks) attacks the dialing itself, and [Gong](/tools/gong) sits alongside all of them as the analysis layer.

Outreach is the most complete [sales engagement platform](/glossary/sales-engagement-platform) here and the closest thing in the set to a working [AI SDR](/glossary/ai-sdr) that a real enterprise has deployed. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup weighs that against the missing price anchor.
