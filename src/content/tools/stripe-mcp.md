---
name: "Stripe MCP"
title: "Stripe MCP"
description: "Stripe's official MCP server — customers, invoices, payment links, subscriptions, refunds, and docs search for agents, hosted at mcp.stripe.com."
date: 2026-06-11
url: "https://docs.stripe.com/mcp"
pricing: "free"
category: "mcp"
repo: "https://github.com/stripe/ai"
license: "MIT"
os: ["Web", "macOS", "Windows", "Linux"]
color: "purple"
topics: ["mcp"]
tags: ["mcp", "stripe", "payments", "billing", "api"]
featured: false
sameAs:
  - "https://github.com/stripe/ai"
  - "https://docs.stripe.com/agents"
  - "https://www.npmjs.com/package/@stripe/mcp"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "backend-developer", "api-architect", "claude-code-settings-permissions"]
summary: "Stripe's official MCP server — hosted at mcp.stripe.com with OAuth, or local via npx @stripe/mcp — lets agents work the Stripe API: create and list customers, products, prices, and invoices, generate payment links, manage subscriptions and refunds, handle disputes, and search Stripe's documentation. Tool availability follows your key's permissions, so a restricted key is the safety mechanism."
faq:
  - q: "How do I add the Stripe MCP server to Claude Code?"
    a: "Hosted: claude mcp add --transport http stripe https://mcp.stripe.com/ then complete OAuth via /mcp. Local: npx -y @stripe/mcp --api-key=YOUR_STRIPE_SECRET_KEY — but prefer a Restricted API Key (rk_...) over a full secret key, since the key's permissions determine which tools the agent gets."
  - q: "What can agents do through Stripe MCP?"
    a: "The day-to-day Stripe surface: account info and balance; create/list customers, products, prices, coupons; create and finalize invoices; payment links; list payment intents; refunds; list/update/cancel subscriptions; dispute handling; plus search_stripe_documentation and resource search/fetch for grounding answers in current Stripe docs."
  - q: "Is the Stripe MCP server safe to use on a live account?"
    a: "The control is the key: a Restricted API Key scoped to read-only (or to specific resources) caps the blast radius regardless of what the model attempts — tool availability literally follows the key's permissions. Start in test mode, use RAKs in live mode, and put ask rules on money-moving tools."
---

Stripe MCP puts the payments stack within the agent's reach — both halves of it. The **knowledge half**: `search_stripe_documentation` grounds integration work in current Stripe docs instead of training-data memory. The **operations half**: customers, invoices, payment links, subscriptions, refunds, and disputes become tools, with your API key's permissions as the hard boundary.

## Highlights

- **The working Stripe surface** — create/list customers, products, prices, coupons, invoices (and finalize them), payment links; list payment intents; refunds; subscription list/update/cancel; dispute handling.
- **Docs search built in** — `search_stripe_documentation` plus resource search/fetch, so the agent integrating Stripe reads today's API docs.
- **Permissions follow the key** — tool availability is derived from the key's grants; a read-only Restricted API Key yields a read-only server, mechanically.
- **Hosted or local** — OAuth at `mcp.stripe.com`, or stdio via `npx -y @stripe/mcp` with a key.
- **Part of a bigger toolkit** — the `stripe/ai` repo (renamed from `agent-toolkit`) also ships agent-framework adapters and a usage-based-billing SDK for AI products.

## In an AI-assisted workflow

```bash
claude mcp add --transport http stripe https://mcp.stripe.com/
# /mcp → stripe → Authenticate, then:
# > Build the upgrade flow: create a "Pro Annual" price, generate a payment
# > link, and check the docs for the right webhook events to handle
```

The integration-building loop is the sweet spot: the agent consults the docs tool while wiring your code, then exercises the API in test mode to verify its own work.

> [!WARNING]
> These tools move money. Develop against test mode; in live mode, authenticate with a **Restricted API Key** scoped to what the workflow needs, and add `ask` [permission rules](/guides/configuration/claude-code-settings-permissions) on mutating tools (`mcp__stripe__create_refund` and friends). The key's scope — not the prompt — is the real safety boundary.

## Good to know

The server and toolkit are MIT-licensed and free; standard Stripe processing fees apply to transactions, not to the tooling. The GitHub home is `stripe/ai` (the old `stripe/agent-toolkit` URL redirects), which also hosts the `@stripe/agent-toolkit` adapters for OpenAI Agents SDK, LangChain, CrewAI, and Vercel AI SDK if you're building agents outside Claude Code.
