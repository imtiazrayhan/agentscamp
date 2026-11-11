---
name: "Bland AI"
title: "Bland AI"
description: "Enterprise voice-AI platform for phone, SMS and web agents that runs on its own speech and language models, bills one per-minute rate and ships an MCP server."
seoDescription: "Bland AI in October 2026: Start and Build per-minute prices, the own-models pitch, Norm, the November migration deadline, MCP, and Vapi and Retell comparisons."
date: 2026-10-10
url: "https://www.bland.ai"
pricing: "paid"
category: "voice"
os: ["Web"]
color: "orange"
topics: ["multimodal-ai", "ai-agents-systems"]
audience: ["ai-engineers", "founders", "sales"]
tags: ["bland-ai", "voice-agents", "phone-agents", "enterprise", "mcp", "telephony"]
featured: false
alternativeTo: ["vapi", "retell-ai"]
sameAs:
  - "https://docs.bland.ai"
  - "https://www.npmjs.com/package/bland-cli"
  - "https://www.npmjs.com/package/@blandsdk/client"
  - "https://x.com/usebland"
related: ["tool:vapi", "tool:retell-ai", "tool:livekit", "guide:best-voice-agent-platforms-2026", "guide:realtime-voice-apis", "agent:voice-agent-engineer"]
keywords: ["Bland AI", "Bland AI pricing", "Bland vs Vapi", "Bland vs Retell", "enterprise voice AI", "Bland MCP server"]
summary: "Bland is an enterprise voice-AI platform for phone, SMS and web agents on its own speech and language models, billed at one per-minute rate: Start at $0.14 per minute with no platform fee and Build at $0.12 per minute plus $299 per month as of October 2026, Enterprise custom. Norm builds agents from a prompt; an MCP server opens it to Claude Code."
faq:
  - q: "How much does Bland AI cost?"
    a: "As of October 2026 the pricing page lists Start at $0.14 per minute with a $0 platform fee and no card required (10 concurrent calls, 100 calls per day, 10 knowledge bases), Build at $0.12 per minute plus a $299 per month platform fee (50 concurrent calls, 2,000 calls per day, 50 knowledge bases), and Enterprise at custom pricing contracted to your volume. The per-minute rate includes the LLM with no token charges, real-time transcription and premium voices; telephony is billed separately at pass-through cost on your carrier or Bland's. Transfer minutes are $0.05 on Start and $0.04 on Build as of October 2026."
  - q: "Bland AI vs Vapi?"
    a: "Vapi is a bring-your-own-models orchestrator: OpenAI, Anthropic or Google LLMs, ElevenLabs or Deepgram voices, any OpenAI-compatible custom LLM, with a platform fee plus pass-through costs and a developer, GitOps posture. Bland runs its own STT, LLM and TTS, prices a single per-minute rate per plan, and sells to regulated enterprises with dedicated infrastructure and forward-deployed engineers."
  - q: "Can I use Claude or my own LLM with Bland?"
    a: "Not by default. Bland's pitch is that it is the only voice AI that runs entirely on its own models, and custom or fine-tuned models are an enterprise conversation rather than a self-serve setting (the custom-LLM docs page returned a 404 when we checked). Where Claude does fit is on the building side: the Bland MCP server signs in with Bland via OAuth from ChatGPT, Claude and Claude Code, so a coding agent can build, test and inspect agents."
  - q: "What changed with the new Bland dashboard?"
    a: "On 2026-10-13 Bland introduced a new dashboard and agent builder: instead of building pathways or personas, you build a single agent with dev, staging and production environments, versions and branches. Pathways do not go away, but Bland says all production pathways and personas must be migrated to the new agent builder by November 15, and the docs carry a banner about the transition."
---

Bland sells voice agents to the companies that cannot afford a bad call. Its homepage puts it bluntly: "Bland automates the calls where a single misstep can mean a lawsuit or a patient in danger", and claims "230+ regulated companies run on Bland". The technical bet behind that positioning is vertical integration. Where most platforms stitch together a speech-to-text vendor, an LLM and a text-to-speech vendor, Bland describes itself as "the only voice AI that runs entirely on its own models", so one team owns every layer and one per-minute rate covers the models.

It is a proprietary SaaS with no public repository for the platform; the open pieces are the `bland-cli` and `@blandsdk/client` npm packages. There is no version number, and as of October 2026 the docs carry a banner that "Bland is getting a major upgrade" while users transition to the new agent builder.

## Highlights

- **Own models, end to end.** In-house STT, LLM ("Built and run by one team") and TTS, with 40+ languages supported natively and real-time translation in 23 of them.
- **One rate per plan.** The per-minute price includes the language model with no token charges, real-time transcription and premium voices.
- **Norm.** "You describe what you want in plain English, and Norm builds, edits, tests, and debugs your agents for you"; it generates the prompt, the agent, pathways, validation conditions and extraction rules.
- **Bland Agents.** The October 2026 builder: an org-scoped agent with dev, staging and production environments, versions and branches, driven by an Agents API at `/v2/agents`.
- **Enterprise infrastructure.** Every enterprise customer runs on isolated, dedicated compute and containers, with versioned Agent Releases adopted on the customer's schedule, on-prem or VPC options and forward-deployed engineers.
- **Compliance.** SOC 2 Type I and II, HIPAA with a signed BAA, GDPR with a DPA, PCI DSS self-attested, FedRAMP 20x Class A and ISO 27001, per the pricing FAQ.
- **Channels.** Bland numbers, your Twilio or SIP trunks, SMS, a web chat widget, and iMessage on Enterprise.

## In an AI-assisted workflow

```bash
npm install -g bland-cli          # or: npx bland-cli  (Node 18+)
bland auth login --device
bland mcp                         # local stdio MCP server for your coding agent
npm install @blandsdk/client      # embed a voice agent in React, vanilla JS or Node
```

The MCP server is the developer story. Over Streamable HTTP at `https://api.bland.ai/v1/mcp`, or locally through `bland mcp`, it lets any AI agent "place and inspect calls, send texts, build and validate pathways, manage agents, query analytics, run evals, and search the Bland docs", authenticated by OAuth sign-in from ChatGPT, Claude and Claude Code or by API key, with a limit of 120 requests per minute per organisation. The `build_pathway` and `edit_pathway` prompts show up as slash commands in clients that support them, and a Norm plugin (`norm@bland`) brings the same build, migrate, validate and test loop into a coding agent. A fictional example of the kind of request the server is built for:

```text
Example prompt (illustrative):
"Build a renewal-reminder agent that calls policyholders 30 days before
expiry, confirms their mailing address, and hands off to a licensed agent
if they ask about coverage changes. Validate it and run the evals."
```

For what the platform is doing under the hood, read the [realtime voice agents](/guides/voice/realtime-voice-apis) guide; the [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) agent is the build-side counterpart.

> [!WARNING]
> If you already run Bland pathways or personas in production, the dashboard-v2 announcement of 2026-10-13 sets a deadline: everything must be migrated to the new agent builder by November 15. Plan the migration before adding features.

> [!NOTE]
> The homepage FAQ says one per-minute rate covers the LLM, STT, TTS and telephony; the pricing page says telephony is billed separately at pass-through cost on your carrier or Bland's. We go with the pricing page.

## Good to know

**Pricing, from bland.ai/pricing.** Start is $0.14 per minute with a $0 platform fee, no card required, 10 concurrent calls, 100 calls per day and 10 knowledge bases, plus two credits and an inbound number the page values at $15 per month, as of October 2026. Build is $0.12 per minute plus a $299 per month platform fee, with 50 concurrent calls, 2,000 calls per day and 50 knowledge bases, as of October 2026. Enterprise is custom, contracted to your volume, with concurrency sized to the account, on-prem or VPC deployment, a forward-deployed engineer, BAA, SSO and data residency. Transfer minutes cost $0.05 on Start and $0.04 on Build as of October 2026. All plans list a 99.9 percent uptime SLA, and many advanced features (warm transfers, guardrails, SMS and web chat, citations, BAA, SSO) are Enterprise-only. Bland's billing docs also describe a Scale plan and note that plan-based pricing replaced a flat rate on 2025-12-05; Scale is not on the public pricing page, so we do not quote it.

**2026 timeline.** March: Norm launched, "the first AI assistant that builds production-ready voice agents from a prompt". June: a Series C of an additional 50 million dollars from Scale, Emergence, HubSpot, Dell Technologies Capital, Upfront and others, which Bland says takes it past 100 million dollars raised in under three years; the lead investor is not stated in Bland's post. October: the new dashboard and agent builder (13th) and a post on why Bland builds its own voice models (15th).

Against the alternatives: [Vapi](/tools/vapi) and [Retell AI](/tools/retell-ai) are model-agnostic orchestrators where you pick GPT, Claude or Gemini and see every cost itemised; Retell's custom LLM is self-serve over WebSocket and Vapi's is any OpenAI-compatible endpoint, while Bland's is enterprise-only. All three now offer MCP servers for coding agents. Choose Bland when a regulated buyer wants one vendor accountable for every layer and dedicated infrastructure; choose Vapi or Retell when model choice and itemised pricing matter more. The [best voice agent platforms](/guides/comparisons/best-voice-agent-platforms-2026) roundup draws those lines across seven platforms.
