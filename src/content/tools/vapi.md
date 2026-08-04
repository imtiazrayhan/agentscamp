---
name: "Vapi"
description: "The API-first voice-agent platform — assemble phone and web agents from any STT/LLM/TTS mix, with telephony, squads, and tool calling handled for you."
date: 2026-06-11
url: "https://vapi.ai"
pricing: "paid"
category: "voice"
os: ["Web"]
color: "orange"
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["voice-agents", "telephony", "platform", "api"]
featured: false
alternativeTo: ["livekit", "pipecat", "cartesia"]
sameAs:
  - "https://x.com/vaboratory"
  - "https://www.linkedin.com/company/vapi-ai"
  - "https://github.com/VapiAI"
related: ["guide:realtime-voice-apis", "guide:build-a-voice-agent", "tool:livekit", "tool:pipecat", "tool:cartesia", "tool:assemblyai"]
summary: "Vapi is the buy side of voice agents: define an Assistant (prompt, model, voice, tools), attach a phone number, and you're live — the platform owns orchestration, turn-taking (vendor-claimed sub-600ms responses), interruptions, telephony, and multi-assistant Squads with context handoffs. Bring any STT/LLM/TTS providers (at cost with your own keys) plus a per-minute platform fee."
faq:
  - q: "How does Vapi pricing actually work?"
    a: "Layered usage: a platform fee per call minute, with model costs passed through at provider rates — or at zero markup if you bring your own API keys — and telephony billed by the carrier. So the headline per-minute number is the orchestration fee, not the all-in cost; BYO keys keep the model side transparent. Compliance (HIPAA, zero-data-retention) are paid add-ons, and the entry plan caps concurrent calls."
  - q: "What are Squads?"
    a: "Vapi's multi-agent primitive: several Assistants with defined handoffs that preserve conversation context — the receptionist that warm-transfers to the billing specialist, as config. It's the platform expression of the orchestration patterns you'd otherwise build."
  - q: "Vapi or LiveKit?"
    a: "Buy versus build. Vapi gets a production phone agent live in an afternoon and charges per minute for the privilege; LiveKit gives you the open-source stack (transport, agents framework, telephony) to assemble yourself — more control and better unit economics at scale, for real engineering investment. Many teams prototype on Vapi and revisit at volume."
---

Vapi is what "just give me a working voice agent" looks like as a product: an API where an **Assistant** — prompt, model, voice, tools — plus a phone number equals a live agent, with the genuinely hard parts (turn-taking, interruptions, telephony, latency engineering) as someone else's problem.

## Highlights

- **Assistants in minutes** — dashboard or API: configure prompt/model/voice/tools, attach a number, take calls.
- **Provider freedom** — mix OpenAI, Anthropic, Google, Deepgram, ElevenLabs and more; bring your own keys and model costs pass through unmarked.
- **Conversational mechanics handled** — vendor-claimed sub-600ms responses with natural turn-taking and interruption handling.
- **Squads** — multi-assistant workflows with context-preserving handoffs.
- **Tool calling mid-call** — agents hit your APIs during conversations: lookups, bookings, tickets.
- **Telephony native** — inbound/outbound numbers, BYO carrier, plus web and mobile SDK calls.

## In an AI-assisted workflow

The five-minute path: create an Assistant in the dashboard, wire a tool to your backend, attach a number, call it. Vapi is the reference "buy" option in the [realtime voice stack decision](/guides/voice/realtime-voice-apis) — and a sane prototyping layer even for teams that later [build on LiveKit](/tools/livekit).

> [!WARNING]
> Cost-model the real number: platform fee + model costs + telephony compounds per minute, and compliance add-ons (HIPAA, ZDR) are priced for enterprises. High-volume economics eventually argue for the build side — that's the trade, not a flaw.

## Good to know

Proprietary platform; SDKs on GitHub. Momentum is real: a **$50M Series B led by Peak XV** (May 2026, with M12 and Kleiner Perkins; ~$500M valuation per TechCrunch), company-stated 1M+ developers and a billion-plus calls — with TechCrunch reporting Amazon Ring routes all inbound calls through it. The full build-vs-buy map, including [Pipecat](/tools/pipecat)'s OSS pipeline and [Cartesia Line](/tools/cartesia): [Realtime Voice Agents](/guides/voice/realtime-voice-apis).
