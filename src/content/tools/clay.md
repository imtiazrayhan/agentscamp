---
name: "Clay"
description: "Clay is a GTM data workbench where every table column runs an enrichment step, with Claygent research agents and a Claude connector listing seven tools."
seoDescription: "Clay for sales teams: the dual-meter credit model priced as of September 2026, what Claygent actually does, and the Claude connector's seven tools."
date: 2026-09-10
url: "https://www.clay.com/"
pricing: "freemium"
category: "sales"
color: "orange"
os: ["Web"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["clay", "lead-enrichment", "gtm", "mcp", "data-orchestration"]
featured: false
alternativeTo: ["apollo", "zoominfo", "unify"]
sameAs: ["https://www.clay.com/pricing", "https://claude.com/connectors/clay"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "guide:clay-vs-apollo", "tool:apollo", "tool:unify", "tool:zoominfo", "glossary:lead-enrichment", "glossary:ai-sdr"]
keywords: ["Clay", "Claygent", "Clay pricing", "Clay MCP", "waterfall enrichment", "GTM data orchestration"]
summary: "Clay is a data-orchestration workbench: a table where each column runs an enrichment step, waterfalling across 150-plus vendors by Clay's pricing page, 200-plus by its docs, under one bill. Claygent browses live pages and returns any field you describe in plain language. Clay charges no per-seat fee; it meters actions and credits separately, and its Claude connector listing exposes seven tools."
faq:
  - q: "Does Clay charge per seat?"
    a: "No. Clay has no per-seat charge; it meters two separate currencies, actions and credits. As of September 2026 the published plans are Free at 0 dollars (500 actions and 100 credits a month, tables capped at 200 rows), Launch at 167 dollars a month billed annually or 185 billed monthly, Growth at 446 dollars a month billed annually or 495 billed monthly, and a custom Enterprise tier, with a 14-day trial on paid plans."
  - q: "Can I connect Clay to Claude?"
    a: "Yes. Clay has a listing in Anthropic's Connectors Directory dated January 2026, and that directory listing exposes seven tools. Connecting grants 500 free credits. Clay does not publish the endpoint in its own docs, but Anthropic does: the connector page lists it under a Connector URL field, and Anthropic's sales-plugin manifest declares it. The endpoint is https://api.clay.com/v3/mcp. The connector flow is still the easier path."
  - q: "What is Claygent?"
    a: "Claygent is Clay's research agent. Instead of mapping a field to a fixed vendor attribute, you describe the field in plain language and Claygent browses live pages to fill it. That makes it useful for facts no enrichment provider sells, such as whether a company publishes a security whitepaper or which billing model its pricing page uses."
  - q: "Is the Clay MCP server listed on public MCP directories the same Clay?"
    a: "Often not. An entry titled Official Clay MCP Server circulates on third-party MCP directories, and it belongs to clay.earth, a personal CRM from a different company. Wiring it up authenticates you into the wrong product. Use the Clay connector listing at claude.com/connectors/clay instead."
---

Clay is a table, and that is the whole idea. Each row is an account or a person; each column is a step that runs against that row: find the domain, find the VP of Engineering, check whether they are hiring, pull the last funding round. Clay brokers the data vendors underneath and waterfalls between them — its pricing page says 150-plus, its documentation says 200-plus, and we quote both because Clay does — trying provider one and falling through to provider two when it misses, all billed through a single account instead of ten contracts.

Claygent is the part that is genuinely an agent. You describe a field in plain language and it browses live pages to fill it. That makes Clay less a database than a research runtime, which is why it tends to sit next to Claude in a workflow rather than being replaced by it.

## Can a Claude user connect it?

Yes. Clay has a listing in Anthropic's Connectors Directory dated January 2026, and that listing exposes seven tools. That number is the directory's; vendor documentation across this category routinely describes a wider surface than the directory registers, so it is worth naming your source whenever you quote a tool count. Connecting grants 500 free credits.

Two gotchas are specific to Clay:

- **Clay does not publish the endpoint; Anthropic does.** It appears in two first-party places: the connector page at `claude.com/connectors/clay` lists it under "Connector URL", and Anthropic's sales-plugin manifest declares it. The endpoint is `https://api.clay.com/v3/mcp`. The connector flow is still the easier path, and it grants 500 free credits. The one to avoid is the "Official Clay MCP Server" listed on third-party MCP indexes — that belongs to clay.earth, a personal CRM from a different company.
- **The "Official Clay MCP Server" on third-party MCP directories is a different company.** That listing belongs to clay.earth, a personal CRM. The names collide; the products do not.

Once connected, the useful pattern is not "ask Claude to enrich a list." It is asking Claude to interrogate a table you already built: which rows failed enrichment and why, which columns are burning credits for a field you never use, which accounts changed since the last run. [Claude for sales teams](/guides/sales/claude-for-sales-teams) walks through that setup once for every tool in this category.

## What it costs, and why the sticker is a floor

As of September 2026 Clay publishes Free at $0 (500 actions and 100 credits a month, with tables capped at 200 rows), Launch at $167 per month billed annually or $185 billed monthly, Growth at $446 per month billed annually or $495 billed monthly, and a custom Enterprise tier, with a 14-day trial on paid plans.

The split underneath matters more than the headline. As of September 2026 the $167 Launch price is $54 of actions plus $113 of credits, and the $446 Growth price is $185 plus $261. Those two meters drain independently: a workflow heavy on Claygent research can exhaust credits while actions sit unused, and topping one up does nothing for the other.

The pricing toggle is also not a simple annual-monthly switch. Moving along the credit ladder changes the volume included as well as the price, so two teams quoting "Launch" may not be quoting the same plan. As of September 2026 the published Launch credit ladder runs up to $1,913 per month, which makes $167 a starting rung rather than a price. Model your expected volume before you commit; there is no seat count to anchor the estimate on.

## Where it fits against the alternatives

Clay is the tool you buy when your enrichment problem is a routing problem: many vendors, uneven coverage, one bill. If instead you want one vendor's dataset plus the sequencing to act on it, [Apollo](/tools/apollo) is the cheaper single-seat answer, and the [Clay vs Apollo comparison](/guides/comparisons/clay-vs-apollo) puts the two side by side. If your trigger is a real-time signal rather than a list you already have, [Unify](/tools/unify) sells flat per-seat plays instead of dual meters. If you need a contact database your legal team already has a contract with, [ZoomInfo](/tools/zoominfo) is the incumbent.

Clay is a [lead enrichment](/glossary/lead-enrichment) engine before it is an AI product, and it is worth buying on that basis; Claygent is the multiplier, not the reason. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup covers where each of these lands.
