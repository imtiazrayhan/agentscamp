---
name: "Attio"
description: "Attio is a developer-extensible CRM with a user-defined data model, agents that research and act on records, and a live MCP endpoint for Claude."
seoDescription: "Attio for sales teams: seat prices and credit add-ons as of September 2026, Ask Attio on Claude Opus 4.7, and the mcp.attio.com endpoint explained."
date: 2026-09-10
url: "https://attio.com/"
pricing: "freemium"
category: "sales"
color: "orange"
os: ["Web", "macOS", "iOS"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["attio", "crm", "mcp", "ai-agents", "revenue-ops"]
featured: false
alternativeTo: ["close", "hubspot-breeze"]
sameAs: ["https://attio.com/pricing", "https://mcp.attio.com/mcp"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "guide:claude-code-for-revenue-ops", "tool:close", "tool:hubspot-breeze", "tool:clay", "glossary:lead-enrichment", "glossary:model-context-protocol"]
keywords: ["Attio", "Attio CRM", "Ask Attio", "Attio MCP", "Attio pricing", "Attio research agent"]
summary: "Attio is a CRM with a data model you define yourself, built so agents can read and write records continuously. Ask Attio, Research Agent, Web Agent and Custom Agents run on a workspace credit pool sold separately from seats. Its MCP endpoint is public at mcp.attio.com/mcp, uses OAuth rather than API keys, and its connector listing exposes 23 tools."
faq:
  - q: "How do I connect Attio to Claude?"
    a: "Attio publishes a live MCP endpoint at https://mcp.attio.com/mcp. Authentication is OAuth, with no API keys to mint or rotate, and Attio names Claude Desktop and claude.ai among its supported clients, alongside a generic path for other MCP clients. In Attio's own permission model reads are auto-approved while writes ask for confirmation, which is the behaviour you want before an agent touches a CRM record."
  - q: "How many tools does the Attio MCP server expose?"
    a: "It depends which source you read, so cite one. The Anthropic Connectors Directory listing, added February 2026, renders 23 tools; Attio's own MCP documentation lists 41 across ten sections. Directory counts and vendor docs disagree across this whole category, so cite the one you mean."
  - q: "Does Attio run on Claude?"
    a: "Partly, and by your choice. Attio's changelog entry of 16 April 2026 reads: Claude Opus 4.7: Choose Claude Opus 4.7 as your default model in Ask Attio. That makes the model selection explicit rather than hidden behind a vendor abstraction, which is unusual among CRMs."
  - q: "What does Attio cost?"
    a: "As of September 2026 Attio lists Free at 0 dollars for up to three seats, Plus at 44 dollars per user per month billed monthly or 35 billed annually and capped at ten seats, Pro at 99 monthly or 79 annually with unlimited seats, and an annual-only custom Enterprise tier, with a 14-day Pro trial. Agent work draws on workspace credits sold separately: as of September 2026 the add-on ladder starts at 5,000 credits for 85 dollars a month, or 70 annually."
---

Attio is a CRM whose data model you define. Objects, attributes and relationships are yours to shape rather than a fixed contact-company-deal schema you bend around, and the platform is built so that software, not only people, keeps records current. That shows up in the product surface: Ask Attio for conversational querying, a Research Agent and a Web Agent that go and find things, Custom Agents you scope yourself, and Workflows to run them on a trigger. Inconvo's team joined Attio on 9 July 2026; neither company used the word acquisition, and Attio described the founders as joining its engineering team.

## Can a Claude user connect it?

Yes, and this is the best-documented CRM connection in the set after [Close](/tools/close). Attio publishes an MCP endpoint at `https://mcp.attio.com/mcp`. Authentication is OAuth, so there are no API keys to mint, store or rotate, and Attio's setup docs cover Claude Desktop and claude.ai by name, with a generic path for other MCP clients. Reads are auto-approved and writes require confirmation, which is the correct default when the tool on the other end can overwrite a deal record.

On tool counts, name your source. The Connectors Directory listing added February 2026 renders 23 tools; Attio's own MCP docs list 41 across ten sections. Both are first-party in some sense and they do not agree, so a page that quotes one number without saying where it came from is guessing. We also make no claim about Attio's verification badge. Anthropic's directory does mark some connectors verified, but its own page says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change" — so a badge is not an assurance worth repeating.

The Claude hook that matters most is in the changelog rather than the connector. Attio's 16 April 2026 entry reads: "Claude Opus 4.7: Choose Claude Opus 4.7 as your default model in Ask Attio." Being able to pick the model behind your CRM's assistant is rare, and it means the answers you get in Attio and the answers you get in Claude come from the same place. [Claude for sales teams](/guides/sales/claude-for-sales-teams) covers how to set that connection up once and reuse it.

## The seat price is not the bill

As of September 2026 Attio lists Free at $0 for up to three seats, Plus at $44 per user per month billed monthly or $35 billed annually with a hard cap of ten seats, Pro at $99 monthly or $79 annually with unlimited seats, and an annual-only custom Enterprise tier, with a 14-day Pro trial.

Seats buy the CRM. The agents draw on a separate workspace credit pool, and that is the line item teams miss. As of September 2026 the credit add-ons start at 5,000 workspace credits for $85 per month ($70 annually) and climb through rungs at $150/$120, $330/$260 and $595/$475. Run a Research Agent across every new account and you are spending from that pool, not from your seat licences.

Model the seat cap too. As of September 2026, hiring an eleventh person forces Plus to Pro, taking the annual per-seat rate from $35 to $79 — a 2.26x jump bought by headcount alone, with no change in what the product does. Plan the move deliberately rather than discovering it mid-quarter.

## Where it fits against the alternatives

Attio is for teams that treat the CRM as a system of record they will extend with code and agents. If your team is a small high-velocity phone operation, [Close](/tools/close) bundles the dialer and inbox into the CRM and documents a far larger MCP surface. If you already run marketing in the same suite, [HubSpot Breeze](/tools/hubspot-breeze) keeps agents and content in one place. And Attio is a destination rather than a source: [Clay](/tools/clay) is where the [lead enrichment](/glossary/lead-enrichment) happens before records land here.

Attio's connector is a good first thing to wire up because it exercises the whole [MCP](/glossary/model-context-protocol) path — OAuth, read approval, write confirmation — against data you can verify by eye. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup compares it with the rest of the set.
