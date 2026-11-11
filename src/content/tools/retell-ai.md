---
name: "Retell AI"
title: "Retell AI"
description: "A hosted voice-agent platform for phone, web and chat agents with a drag-and-drop flow builder, simulation testing, per-minute pricing and a custom-LLM hook."
seoDescription: "Retell AI in October 2026: per-minute prices, GPT and Claude model choice, custom LLM over WebSocket, MCP both ways, and how it compares with Vapi and Bland AI."
date: 2026-10-10
url: "https://www.retellai.com"
pricing: "paid"
category: "voice"
os: ["Web"]
color: "orange"
topics: ["multimodal-ai", "ai-agents-systems"]
audience: ["ai-engineers", "founders"]
tags: ["retell-ai", "voice-agents", "telephony", "phone-agents", "mcp", "custom-llm"]
featured: false
alternativeTo: ["vapi", "bland-ai", "livekit"]
sameAs:
  - "https://docs.retellai.com"
  - "https://github.com/RetellAI"
  - "https://www.npmjs.com/package/retell-sdk"
  - "https://x.com/retellai"
related: ["tool:vapi", "tool:bland-ai", "tool:livekit", "tool:pipecat", "guide:best-voice-agent-platforms-2026", "guide:build-a-voice-agent", "agent:voice-agent-engineer"]
keywords: ["Retell AI", "Retell AI pricing", "Retell vs Vapi", "Retell vs Bland", "AI phone agent platform", "Retell custom LLM"]
summary: "Retell AI is a hosted platform for inbound and outbound phone, web and SMS/chat agents: a drag-and-drop conversation-flow builder, simulation and batch testing, QA on production calls, and a per-agent choice of GPT, Claude, Gemini or speech-to-speech models. Pay-as-you-go runs $0.07 to $0.31 per minute as of October 2026, with Enterprise on custom pricing."
faq:
  - q: "How much does Retell AI cost?"
    a: "As of October 2026 the pricing page lists Pay-as-you-go at $0.07 to $0.31 per minute with 20 concurrent calls included, and Enterprise at custom pricing with no cap on concurrent calls. The homepage FAQ, as of October 2026, puts it the same way: $0.07 to $0.31 per minute depending on models, voice and add-ons, no annual contract, no per-resolution charge, and chat agents from $0.002 per message. New accounts get $10 in free credits and 20 free concurrent calls as of October 2026."
  - q: "Retell AI vs Vapi?"
    a: "Both are hosted, provider-agnostic orchestration layers with per-minute platform fees, model and voice pass-through, and custom-LLM hooks. Retell leans toward operations teams: a no-code flow builder, a built-in CRM, QA on up to 100 percent of calls and outbound campaigns. Vapi leans developer and config-as-code, with a CLI and assistants kept as files in git. Retell's custom LLM is a WebSocket protocol; Vapi's is any OpenAI-compatible endpoint."
  - q: "Can Retell use Claude or my own LLM?"
    a: "Yes to both. The model dropdown lists Claude 5 Sonnet, Claude 4.6 Sonnet and Claude 4.5 Sonnet alongside the GPT 5.x line and Gemini 3.5 Flash, grouped into versatile, fast and speech-to-speech, with the per-minute price next to each. For your own model, Retell opens one WebSocket per call to your llm_websocket_url and your server generates each reply while Retell handles telephony, transcription and turn-taking. The trade-off: the LLM playground cannot test a custom LLM agent, and simulation and batch testing reject them."
  - q: "Does Retell AI support MCP?"
    a: "In both directions. A single- or multi-prompt agent can connect to a remote MCP server and call its tools during a live call, and conversation flows have an MCP node. Separately, Retell's own MCP server lets you build voice agents from MCP-capable clients such as Cursor, Claude Desktop, Claude Code and Codex-style tools, and a Retell AI connector lets you build, edit, deploy, test and analyze agents from a conversation with Claude."
---

Retell AI is the voice-agent platform built for the people who run phone operations rather than the people who write pipelines. You design the conversation on a drag-and-drop canvas, pick a model and a voice, attach a number, and the platform handles telephony, transcription, turn-taking and the production tooling around a call: live monitoring, campaigns, QA and regression tests built from real calls. Developers get SDKs, a custom-LLM WebSocket and MCP, but the center of gravity is the operations team.

It is a proprietary SaaS; the GitHub organisation holds open SDKs and demos rather than the platform, and there is no version number to track, only a changelog.

## Highlights

- **Flow builder.** "Design every step of the conversation on a drag-and-drop canvas. Add functions, integrations, call transfers, DTMF, SMS, and custom logic."
- **Testing.** "Manually test changes, simulate thousands of scenarios, and turn real production calls into regression tests"; Conductor (July 2026) simulates proposed changes before they ship.
- **Model choice.** Models grouped into versatile, fast and cost-efficient, and speech-to-speech, with GPT, Claude and Gemini options and the per-minute price shown next to each.
- **Contact-center features.** IVR detection and digit pressing, live listen-in and takeover, outbound campaigns with pacing, retries and voicemail handling, a built-in CRM, and an AI QA Analyst that can review up to 100 percent of calls.
- **Telephony.** Retell numbers, Twilio and Vonage, or any telephony system through SIP trunking; web calls in the browser; SMS and chat agents.
- **Compliance.** HIPAA compliant, GDPR compliant, SOC 2 Type 1 and Type 2 certified, per the docs.
- **Turn-taking and latency.** The vendor claims a proprietary turn-taking model and roughly 600 ms latency; we did not measure either.

## In an AI-assisted workflow

```bash
npm i retell-sdk                          # Node 18.10+
pip install retell-sdk                    # Python 3.9+
npm install retell-client-js-sdk@latest   # browser web calls
```

The faster route for many teams is to skip the dashboard and let a coding agent do the clicking. Retell's MCP server works from Cursor, Claude Desktop, Claude Code and Codex-style tools, and the Retell AI connector lets you sign in with your Retell login and build, edit, deploy, test and analyze agents from a conversation with Claude. A fictional example of the kind of request that fits:

```text
Example prompt (illustrative):
"Create an inbound agent for a dental clinic: greet callers, book or
reschedule appointments through the booking tool, transfer billing
questions to extension 204, and send an SMS confirmation."
```

During a call, the agent itself can reach out to a remote MCP server for tools, so the same pattern serves both building and running. The [voice agent pipeline](/guides/voice/build-a-voice-agent) guide explains what Retell is doing on your behalf between STT, LLM and TTS; the [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) agent builds the self-hosted version.

> [!WARNING]
> Custom-LLM agents lose the testing tools: the LLM playground cannot test them, and simulation and batch testing reject them. If regression testing is why you chose Retell, keep the model inside Retell's list or budget for testing your WebSocket server yourself. Reference servers exist for Node.js (OpenAI, Azure OpenAI, OpenRouter) and Python (OpenAI, Claude).

> [!NOTE]
> Two different per-minute numbers appear on the pricing page: the headline bundle range and a component table that starts from the voice-infrastructure line and adds model, voice, telephony and add-ons. Quote whichever matches your configuration; they are not the same figure.

## Good to know

**Pricing, from retellai.com/pricing.** Pay-as-you-go is $0.07 to $0.31 per minute with 20 concurrent calls included, and Enterprise is custom pricing with no cap on concurrent calls, as of October 2026. In the component table, as of October 2026, Retell Voice Infra is $0.055 per minute; Retell platform voices, Cartesia voices and OpenAI voices are $0.015 per minute; ElevenLabs Flash is $0.040 per minute and ElevenLabs Multilingual v2 is $0.06 per minute. LLM rows, as of October 2026 and named exactly as the vendor prints them, include "GPT 5.6 Terra" and "Claude 5 Sonnet" at $0.064 per minute, "GPT 5.5" at $0.16 per minute, "GPT 4.1" at $0.045 per minute and "Claude 5.5 Haiku" at $0.0032 per minute, with speech-to-speech "GPT Realtime 2.1" at $0.38 per minute and "GPT Realtime mini" at $0.07 per minute. Telephony through Retell is $0.015 per minute as of October 2026, with no charge for SIP trunking or custom telephony. Add-ons as of October 2026: knowledge base at $0.005 per minute, batch calls at $0.005 per dial, AI quality assurance at $0.10 per minute after the first 100 minutes free, SMS at $0.01 per message, phone numbers at $2.00 per month, and concurrency at $8.00 per active call per month beyond the first 20. Signup brings $10 in free credits as of October 2026.

**2026 changelog.** January: AI QA Analyst, custom alert notifications. February: agent guardrails, webhook testing, auto-failover, billing transparency. March: a ChatGPT app for launching agents, dynamic voice speed, A/B testing. May: Agent Versioning 2.0, granular multilingual, custom voicemail. June: live call monitoring, custom dashboards, built-in CRM, a Colloquial model and Expressive mode. July: Conductor. August: Retell Workflows, with GPT-5.6 and GPT Realtime 2.1 in the agent builder. Funding and revenue figures for 2026 are third-party only, so we do not state them.

Against the alternatives: [Vapi](/tools/vapi) is the developer-first twin, config-as-code with any OpenAI-compatible LLM; [Bland AI](/tools/bland-ai) runs its own speech and language models behind one bundled per-minute rate, with custom models reserved for enterprise; [LiveKit](/tools/livekit) is the Apache-2.0 framework plus cloud you code against when you want full control. The [best voice agent platforms](/guides/comparisons/best-voice-agent-platforms-2026) roundup places all of them side by side.
