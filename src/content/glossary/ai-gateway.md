---
term: "AI Gateway (LLM Gateway)"
seoTitle: "What Is an AI Gateway (LLM Gateway)?"
description: "An AI gateway is a proxy between your apps and model providers that centralizes keys, routing, fallback, caching, rate limits, logging and cost tracking."
date: 2026-11-13
topics: ["llm-app-dev", "mlops-ai-infra"]
audience: ["developers", "ai-engineers", "devops"]
tags: ["ai-gateway", "llm-gateway", "routing", "fallback", "cost-control"]
related: ["guide:llm-gateways-compared", "guide:calling-any-model-gateways", "glossary:model-routing", "tool:portkey", "tool:litellm", "glossary:mcp-gateway"]
faq:
  - q: "Is an AI gateway the same as an LLM gateway?"
    a: "Mostly, yes. Vendors use both names for a proxy that sits between applications and model providers. AI gateway is turning into the broader term as products add agent traffic: AWS describes Amazon Bedrock AgentCore Gateway as a fully managed AI gateway that connects agents to tools, to other agents and to large language models."
  - q: "What does an AI gateway actually do?"
    a: "The features vendors list overlap heavily. Cloudflare AI Gateway names analytics, logging, caching, rate limiting, request retries and model fallback. Vercel AI Gateway names centralized credentials, request logs, cost tracking, budgets, prompt caching and provider failover. LiteLLM adds guardrails and load balancing behind an OpenAI-format API for 100+ LLM APIs."
  - q: "How is an AI gateway different from an MCP gateway?"
    a: "An AI gateway governs calls from your application to models. An MCP gateway governs calls from agents to the tools that MCP servers expose: it puts many servers behind one endpoint and applies authentication, tool allowlists and audit logging there. Some vendors offer both, such as Portkey, which documents an MCP gateway alongside its LLM gateway."
summary: "An AI gateway, also called an LLM gateway, is a proxy layer between your applications and model providers. Apps call the gateway instead of each provider, and it handles credentials, routing, retries and fallback, caching, rate limits, logging, cost tracking and budgets. Examples include LiteLLM, Portkey, Cloudflare AI Gateway, Vercel AI Gateway and Kong."
---

**An AI gateway, also called an LLM gateway, is a proxy between your applications and one or more model providers, so every model call passes through one layer that handles credentials, routing, reliability, caching, logging and cost control.**

Vendors define it by what it centralizes. Cloudflare's AI Gateway offers "visibility and control over your AI apps" through analytics and logging, plus "caching, rate limiting, as well as request retries, model fallback, and more." Vercel describes its gateway as a way to "centralize credentials, request logs, cost tracking, budgets, prompt caching, and provider failover." Open-source projects make the same pitch: [LiteLLM](/tools/litellm) says it can "Call 100+ LLM APIs in OpenAI (or native) format with cost tracking, guardrails, load balancing, and logging," and [Portkey](/tools/portkey) says its gateway routes to 1,600+ LLMs with integrated guardrails. Kong calls itself "The API and AI Gateway."

The benefit is that policy lives in one layer instead of every service. Swapping a model becomes a configuration change, an outage at one provider can fall back to another, and one dashboard shows what each team spends. That layer is also the natural home for [model routing](/glossary/model-routing).

The category is widening. AWS describes Amazon Bedrock AgentCore Gateway as a fully managed AI gateway that connects agents "to tools, to other agents, and to large language models," and Palo Alto Networks, which completed its acquisition of Portkey in May 2026, made it the core AI gateway for Prisma AIRS. Agent-to-tool traffic over MCP has its own variant, the [MCP gateway](/glossary/mcp-gateway).

For a side-by-side of Portkey, LiteLLM and Helicone, see [LLM Gateways Compared](/guides/advanced/llm-gateways-compared). For choosing between a unified SDK, a self-hosted proxy and a hosted router, see [Calling Any Model](/guides/concepts/calling-any-model-gateways).
