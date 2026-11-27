---
name: "Vapi"
description: "The API-first voice-agent platform — assemble phone and web agents from any STT/LLM/TTS mix, with telephony, squads, and tool calling handled for you."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://vapi.ai"
pricing: "paid"
category: "voice"
os: ["Web"]
color: "orange"
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["voice-agents", "telephony", "platform", "api"]
featured: false
alternativeTo: ["livekit", "pipecat", "cartesia"]
sameAs:
  - "https://x.com/vaboratory"
  - "https://www.linkedin.com/company/vapi-ai"
  - "https://github.com/VapiAI"
related: ["guide:realtime-voice-apis", "guide:build-a-voice-agent", "tool:livekit", "tool:pipecat", "tool:cartesia", "tool:assemblyai"]
summary: "Vapi is a hosted platform for voice agents. You define an Assistant (prompt, model, voice, tools), attach a phone number or embed it in a web app, and Vapi runs the call: orchestration, turn-taking, interruptions and telephony. You choose the transcriber, LLM and voice providers, pay their costs with no markup, and pay Vapi a per-minute hosting fee on top."
faq:
  - q: "How does Vapi pricing work?"
    a: "In layers. As of November 2026, vapi.ai/pricing lists Vapi hosting at $0.05 per minute, prepaid, with transcriber, model and voice costs passed through at provider rates, and $5 of free credits to start. Optional Success Packages add support and higher limits; the package prices are in the pricing table on this page."
  - q: "How many concurrent calls can I run on Vapi?"
    a: "As of November 2026, 4 concurrent calls with no Success Package, 10 on Core and 30 on Pro, with more available on Premier. Extra call lines are a paid add-on on any package."
  - q: "What are Squads?"
    a: "Squads are Vapi's way to split a call across several specialized Assistants. Each member handles one job, such as triage, scheduling or billing, and a handoff tool transfers the caller to another member while passing along the conversation history and variables you choose."
  - q: "Vapi or LiveKit?"
    a: "Buy or build. Vapi gets a phone agent live quickly with no media infrastructure to run, and charges a platform fee for each minute. LiveKit gives you an open-source WebRTC server and agents framework to assemble yourself, which takes engineering time but gives more control and removes the platform fee if you self-host."
---

Vapi is a hosted developer platform for voice agents that make and receive phone calls or run inside web and mobile apps. The unit of work is an **Assistant**: a system prompt, an LLM, a transcriber, a voice, and a set of tools. Attach a phone number and it takes calls. Turn-taking, interruptions, telephony and latency tuning are the platform's job.

## Highlights

- **Assistants by dashboard, API or CLI.** Create and edit them in the dashboard, through the REST API and server SDKs, or with the `vapi` CLI. Assistants are versioned, and you can compare versions by call volume and metrics.
- **Your choice of providers.** Pick the transcriber, model and voice from a catalog that includes Deepgram, AssemblyAI, OpenAI, Anthropic and ElevenLabs; provider costs pass through without markup.
- **Squads.** Several Assistants on one call, with handoffs that carry context between them.
- **Tools during the call.** Assistants call your APIs mid-conversation for lookups, bookings and tickets, and use built-in tools such as hang-up and handoff.
- **Telephony and web.** Inbound and outbound calls on Vapi numbers or your own SIP, plus web and mobile SDKs for in-app voice.
- **Testing.** Voice simulations and evals run scripted calls against an Assistant before real callers reach it.
- **Config as code.** A GitOps workflow manages assistants, squads, tools, simulations and evals as files you review and deploy.

## In an AI-assisted workflow

Install the CLI or a server SDK:

```bash
curl -sSL https://vapi.ai/install.sh | bash   # CLI
vapi login
vapi assistant create

pip install vapi_server_sdk                   # or: npm install @vapi-ai/server-sdk
```

Creating an Assistant from Python, as in Vapi's phone quickstart:

```python
import os
from vapi import Vapi

client = Vapi(token=os.getenv("VAPI_API_KEY"))

assistant = client.assistants.create(
    name="Customer Support Assistant",
    model={
        "provider": "openai",
        "model": "gpt-6-luna",
        "messages": [{"role": "system", "content": "You are Alex, a customer service voice assistant for Acme."}],
    },
    voice={"provider": "11labs", "voiceId": "cgSgspJ2msm6clMCkdW9"},
    first_message="Hi, this is Alex from Acme support. How can I help you today?",
)
print(assistant.id)
```

Then attach a phone number in the dashboard, or with `POST https://api.vapi.ai/phone-number`, and call it. Vapi is the reference "buy" option in the [realtime voice stack decision](/guides/voice/realtime-voice-apis), and a reasonable prototyping layer even for teams that later [build on LiveKit](/tools/livekit).

> [!WARNING]
> Model the full per-minute cost before you commit. The hosting fee, transcriber, LLM and voice all bill per minute, and the LLM line swings widely with the model you choose: as of November 2026, Vapi's own calculator puts 1,000 minutes with Deepgram, OpenAI and ElevenLabs at $82 to $129 a month depending on the OpenAI model.

## Pricing

As of November 2026, vapi.ai/pricing lists usage billing plus optional Success Packages:

| Package | Price | Concurrent calls | Included Vapi numbers | Raw data retention |
| --- | --- | --- | --- | --- |
| None (usage only) | $0.05 per minute hosting, $5 free credits | 4 | 1 | 14 days |
| Core | $29 per month | 10 | 5 | 30 days |
| Pro | 10% of hosting fee, $999 per month minimum | 30 | 10 | 180 days |
| Premier | Custom | Custom | Custom | Custom |

Every package pays the same per-minute hosting fee and passes provider costs through at cost. As of November 2026, add-ons are $2,000 a month for HIPAA compliance, $10 per extra concurrent line per month, and $20 per extra organization per month. Core includes zero data retention, Pro adds role-based access and a 99% uptime SLA, and Premier adds SSO, a 99.9% SLA and dedicated SIP.

## Good to know

- **Latency claims vary by page.** Vapi's docs cite sub-600 ms response times and its homepage an average under 500 ms. Both are vendor figures, and your result depends on the providers you select.
- **Scale claims are company-stated.** The homepage counts 1 billion calls supported and more than 1 million developers as of November 2026.
- **Proprietary platform.** The SDKs are on GitHub, but the orchestration layer is not open source.
- **Unit economics.** At high volume the per-minute hosting fee is the cost that a self-built stack removes. That is the trade for not running media infrastructure.

Compared with the alternatives: [LiveKit](/tools/livekit) and [Pipecat](/tools/pipecat) are the open-source frameworks for building the same thing yourself. [Cartesia](/tools/cartesia)'s Managed Agents is a hosted alternative built on Cartesia's own speech models. Among hosted rivals, [Retell AI](/tools/retell-ai) and [Bland AI](/tools/bland-ai) are compared in the [voice agent platforms roundup](/guides/comparisons/best-voice-agent-platforms-2026).
