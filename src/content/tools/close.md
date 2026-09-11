---
name: "Close"
description: "Close is an all-in-one CRM for high-velocity inside sales that bundles calling, SMS and email into the record, plus Chloe, an autonomous voice agent."
seoDescription: "Close for sales teams: per-user prices as of September 2026, what Chloe the voice agent does, and the 99-tool MCP server with a documented install command."
date: 2026-09-10
url: "https://close.com/"
pricing: "paid"
category: "sales"
color: "orange"
os: ["Web", "macOS", "Windows", "Linux", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["close", "crm", "inside-sales", "mcp", "voice-agents"]
featured: false
alternativeTo: ["attio", "hubspot-breeze"]
sameAs: ["https://close.com/pricing", "https://mcp.close.com/mcp"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "guide:claude-code-for-revenue-ops", "tool:attio", "tool:hubspot-breeze", "tool:nooks", "glossary:sales-engagement-platform", "glossary:model-context-protocol"]
keywords: ["Close CRM", "Close pricing", "Close MCP server", "Chloe voice agent", "inside sales CRM"]
summary: "Close is a CRM for small, high-velocity inside-sales teams that puts the phone, SMS and email inside the record instead of alongside it. Chloe, launched 3 June 2026, is a genuine autonomous voice agent that calls and qualifies leads. Close also ships the best-documented MCP server in this category: a catalogue of 117 tools across three scopes, with the install command published in its own docs."
faq:
  - q: "How do I add the Close MCP server to Claude Code?"
    a: "Close publishes the command itself: claude mcp add --scope user --transport http close https://mcp.close.com/mcp. That is the vendor's own documented line, not one we reconstructed, which makes Close the easiest connection to verify in this category."
  - q: "What does Close cost?"
    a: "As of September 2026 Close lists per-user monthly pricing at annual and monthly rates respectively: Solo at 9 or 19 dollars (one user, 10,000 leads), Essentials at 35 or 49, Growth at 99 or 109, and Scale at 139 or 149, with a 14-day trial that does not ask for a card. Add-ons meter on top: as of September 2026 Call Assistant is 50 dollars a month per organization plus 0.02 per minute, and phone lines start at 1 dollar per line per month."
  - q: "What is Chloe?"
    a: "Chloe is Close's voice agent, launched 3 June 2026. Close describes it as calling leads, qualifying prospects through real conversations, and booking meetings while updating your CRM. Unlike most sales AI features, it acts without a human in the loop for each call, which is exactly why it deserves scoped testing before you point it at a live list."
  - q: "How many tools does the Close MCP server expose?"
    a: "Close publishes no total of its own. Its tool catalogue lists 117, split by risk across three scopes: 67 read (mcp.read), 16 safe-write (mcp.write_safe) and 34 destructive (mcp.write_destructive) — that count is ours, from its list. Anthropic's connector directory lists 55. Either way it is the widest first-party MCP surface in this set, and the scope split is the point: higher scopes include everything below them, so grant read first and widen only once you have watched what the agent actually calls."
---

Close is built for the team that lives on the phone. It is a CRM, but the dialer, SMS and email are inside the record rather than integrated alongside it, which removes the tab-switching that eats an inside-sales day. That focus is why it competes with [Attio](/tools/attio) on shape rather than on features: Attio is a data model you extend, Close is a workflow you adopt.

Chloe, launched 3 June 2026, is the part that is genuinely autonomous. Close describes it as an agent that "calls leads, qualifies prospects through real conversations, and can book meetings while updating your CRM." Most AI in this category drafts and summarises; this one dials. Close is still shipping against it — the changelog carries an entry dated 10 September 2026.

## Can a Claude user connect it?

Yes, and Close is the reference implementation for the whole category. All ten tools we cover here ship a first-party MCP server; nine are listed in Anthropic's Connectors Directory, and Close's listing dates to November 2025. But the reason to start here is the documentation: Close publishes the literal install command.

```bash
claude mcp add --scope user --transport http close https://mcp.close.com/mcp
```

That is Close's own line, copied from its docs, not a command we reconstructed from an endpoint URL. Close's tool catalogue lists 117 tools across three scopes — 67 read (`mcp.read`), 16 safe-write (`mcp.write_safe`) and 34 destructive (`mcp.write_destructive`) — though Close publishes no total itself; that is our count of its list. Anthropic's connector directory lists 55. Higher scopes include everything below them, so a destructive-scope client sees all 117.

Take the scope split seriously. Thirty-four destructive tools is a lot of ways for an agent to be wrong about a lead record, and the sensible sequence is: grant read only, work for a week, look at which tools Claude actually reached for, then widen. [Claude for sales teams](/guides/sales/claude-for-sales-teams) covers that staged approach across connectors, and it applies more here than anywhere else in the set simply because the surface is bigger. This is also the cleanest place to learn how [MCP](/glossary/model-context-protocol) scoping behaves before you point it at something you cannot undo.

## What it costs, and what meters on top

As of September 2026 Close lists per-user monthly pricing, annual rate first: Solo at $9 or $19 monthly (one user, 10,000 leads), Essentials at $35 or $49, Growth at $99 or $109, and Scale at $139 or $149. There is a 14-day trial and it does not ask for a card.

The sticker is not the running cost. As of September 2026 Call Assistant is a $50 per month add-on, charged per organization rather than per seat, plus $0.02 per minute, and phone lines start at $1 per line per month. Telephony, Call Assistant and AI credits all meter on top of the seat.

The uncomfortable part is that the variable spend rides on the feature you bought the product for. Chloe is a calling agent, so every conversation it has is minutes on the meter. Before you scale it, run a bounded test — a fixed list, a capped call window — and price the result per booked meeting rather than per seat. That is a very different budgeting exercise from a CRM subscription, and it is the same one [Nooks](/tools/nooks) buyers face with parallel dialling.

## Where it fits against the alternatives

Close is the buy when the team is small, the motion is phone-first and nobody is going to configure a platform. If you need a CRM you will extend with your own objects and agent workflows, Attio is the better fit. If sales and marketing share a suite, [HubSpot Breeze](/tools/hubspot-breeze) keeps them in one system.

As a [sales engagement platform](/glossary/sales-engagement-platform) Close is unusual in owning the CRM as well, which means fewer sync failures and one fewer vendor to date-check each renewal. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup lines it up against the enterprise execution stack.
