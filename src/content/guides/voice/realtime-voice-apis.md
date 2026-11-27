---
title: "Realtime Voice Agents: Build on LiveKit, Buy Vapi, or Pipeline with Pipecat"
seoTitle: "Realtime Voice Agents: LiveKit vs Vapi vs Pipecat"
description: "The three ways to ship a realtime voice agent in 2026 — open infrastructure, managed platform, or OSS pipeline — and how speech-to-speech models fit in."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["multimodal-ai", "ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["voice-agents", "realtime", "comparison", "webrtc"]
featured: false
summary: "Buy Vapi to have a phone agent answering calls today, configured through an API. Build on LiveKit when voice is the product and you want open-source WebRTC, telephony and an agent framework you can self-host. Use Pipecat when the pipeline logic is your differentiation. The managed platform costs more per minute; the open stacks cost engineering time."
keyTakeaways:
  - "The decision is posture, not features: own the infrastructure (LiveKit), own the pipeline logic (Pipecat), or own neither and ship today (Vapi)."
  - "Voice-to-voice latency is a sum of five stages: transport, transcription, endpointing, model time to first token, and speech synthesis time to first audio. Measure each one; the total alone tells you nothing about what to fix."
  - "Endpointing is the stage vendors leave out of headline latency numbers and the one that most changes how a call feels. LiveKit and Pipecat both ship a model-based turn detector; Vapi exposes it as speech configuration."
  - "Speech-to-speech models collapse three stages into one but still need transport, telephony, tools and interruption handling, so they run inside these stacks."
  - "All three bill per minute for the platform and pass model costs through separately. As of November 2026, Vapi's list hosting fee is about five times the per-minute agent fee on LiveKit Cloud or Pipecat Cloud."
faq:
  - q: "Should I use a speech-to-speech model or the STT→LLM→TTS pipeline?"
    a: "Both run on all three stacks. A speech-to-speech model removes the transcription and synthesis hops and tends to give the most natural turn-taking. The cascaded pipeline lets you choose a model per stage, makes tool calling and transcripts easier to control, and is usually cheaper per minute. In LiveKit Agents the switch is replacing the stt, llm and tts arguments with a single RealtimeModel."
  - q: "What does a production voice agent actually consist of?"
    a: "Transport (WebRTC or telephony), speech recognition, turn detection, the agent brain (LLM, tools, memory), speech synthesis, and interruption handling, plus observability over all of it. The model calls are the easy part. The realtime systems work around them is why platforms and frameworks exist."
  - q: "Can I combine them?"
    a: "Yes. Pipecat ships a LiveKitTransport, so a Pipecat pipeline can run over LiveKit's WebRTC infrastructure, and Daily's WebRTC transport is the default on Pipecat Cloud. Vapi accepts your own provider keys and custom LLM endpoints, so you can keep its telephony and orchestration while owning the model."
  - q: "Where does Cartesia fit?"
    a: "It is a fourth posture: vertically integrated. Cartesia runs hosted voice agents on its own Sonic speech synthesis and Ink transcription models, billed per minute. It competes with Vapi on convenience while owning the speech models. The trade is provider flexibility."
related: ["tool:livekit", "tool:vapi", "tool:pipecat", "tool:cartesia", "guide:build-a-voice-agent", "guide:best-tts-apis-2026", "guide:best-stt-apis-2026", "agent:voice-agent-engineer"]
---

There are three ways to ship a realtime voice agent, and they differ in **how much of the stack you own**. Buy [Vapi](/tools/vapi) if you need a phone agent live this week. Build on [LiveKit](/tools/livekit) if voice is your product and you want infrastructure you can self-host. Assemble with [Pipecat](/tools/pipecat) if your edge is what happens between the speech models.

## Side by side

Checked against each vendor's site, docs and repository in November 2026.

| | [LiveKit](/tools/livekit) | [Pipecat](/tools/pipecat) | [Vapi](/tools/vapi) |
| --- | --- | --- | --- |
| Posture | Build: infrastructure and agent framework | Assemble: pipeline framework | Buy: managed platform |
| Licence | Apache-2.0 (media server and Agents framework) | BSD-2-Clause | Proprietary, hosted |
| Agent code in | Python or Node.js | Python 3.11 to 3.14 | JSON config over REST, SDKs, or the dashboard |
| Hosting | Self-host, or LiveKit Cloud | Self-host, or Pipecat Cloud (run by Daily) | Vapi only |
| Transport | Its own WebRTC server | Pluggable: Daily WebRTC, SmallWebRTC, WebSocket, LiveKit | Managed |
| Telephony | SIP trunks, dispatch rules, US phone numbers on LiveKit Cloud | Through transports and providers (Daily PSTN and SIP, Twilio, Plivo) | Bundled Vapi numbers and SIP |
| Turn detection | `TurnDetector`, a multimodal model; `v1-mini` runs locally on CPU | Smart Turn v3, open source, weights bundled with Pipecat | Managed endpointing, tuned through speech configuration |
| Speech-to-speech | `inference.RealtimeModel(...)` in place of STT, LLM and TTS | Provider services in the same pipeline | OpenAI Realtime models as an assistant option |
| You operate | Agent workers, plus servers if self-hosting | The bot process and its deployment | Nothing; you configure |
| Platform billing | Monthly plan with included minutes, then per agent-session minute | Per active agent minute, by compute size | Per-minute hosting fee, optional support package |

## Build on LiveKit

LiveKit is an open-source WebRTC server plus an Agents framework, with LiveKit Cloud as the managed option. The quickstart scaffolds a project with `lk agent init my-agent --template agent-starter-python` and runs it with `lk agent dev`. The core of the generated agent is short:

```python
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentServer, AgentSession, Agent, inference, TurnHandlingOptions

load_dotenv(".env.local")
server = AgentServer()

@server.rtc_session(agent_name="my-agent")
async def my_agent(ctx: agents.JobContext):
    session = AgentSession(
        stt=inference.STT(model="assemblyai/assemblyai-stt-3-7-realtime-agent"),
        llm=inference.LLM(model="google/gemma-4-31b-it"),
        tts=inference.TTS(model="fishaudio/s2.1-pro", voice="fa4c9eb3dccc4806b382b40d61c6b10a"),
        turn_handling=TurnHandlingOptions(turn_detection=inference.TurnDetector()),
    )
    await session.start(room=ctx.room, agent=Agent(instructions="You are a helpful voice assistant."))

if __name__ == "__main__":
    agents.cli.run_app(server)
```

The `inference.*` calls route through LiveKit Inference, so the starter needs no provider keys. Telephony is part of the platform: a caller becomes a SIP participant in a room, and trunks and dispatch rules connect your SIP provider. Per LiveKit, OpenAI built ChatGPT's Advanced Voice on LiveKit Cloud.

**Where it loses.** You write and run a real service. Self-hosting means operating media servers and scaling agent workers yourself. One SIP gap to know: LiveKit's supported-features table lists SIP registration (REGISTER) as not supported. And the full `v1` turn detector is served through LiveKit Inference; self-hosted agents get a development allowance and then fall back to the local `v1-mini` model or pay per request, depending on plan.

## Assemble with Pipecat

Pipecat is an open-source Python framework that treats a voice agent as a pipeline of processors passing frames. Install the CLI with `uv tool install "pipecat-ai[cli]"`, scaffold with `pipecat init quickstart`, and run `uv run bot.py`. The pipeline is the whole idea:

```python
pipeline = Pipeline([
    transport.input(),     # Receive audio from browser
    stt,                   # Speech-to-text (Deepgram)
    user_aggregator,       # Add user message to context
    llm,                   # Language model (OpenAI)
    tts,                   # Text-to-speech (Cartesia)
    transport.output(),    # Send audio back to browser
    assistant_aggregator,  # Add bot response to context
])
```

Each stage is a swappable service, so changing [STT](/guides/voice/best-stt-apis-2026) or [TTS](/guides/voice/best-tts-apis-2026) vendor is a one-line change, and you can insert your own processor anywhere: a redaction step before the LLM, a custom router after it. Turn detection is the open-source Smart Turn model, with weights bundled. `pipecat cloud deploy` pushes the bot to Pipecat Cloud if you don't want to host it.

**Where it loses.** Pipecat is not a media server and has no phone network of its own. You pick a transport and a telephony provider and you hold separate accounts with each speech and model vendor. It is Python only on the server side, and every stage you add is a stage you must measure.

## Buy Vapi

A Vapi assistant is a JSON object: model, voice, transcriber, first message, tools. Create one with a single request, attach a phone number, and it takes calls:

```bash
curl -X POST "https://api.vapi.ai/assistant" \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Customer Support Assistant",
    "model": {
      "provider": "openai",
      "model": "gpt-6-luna",
      "messages": [{ "role": "system", "content": "You are Alex, a support voice assistant for Acme." }]
    },
    "voice": { "provider": "11labs", "voiceId": "cgSgspJ2msm6clMCkdW9" },
    "firstMessage": "Hi, this is Alex from Acme support. How can I help?"
  }'
```

Turn-taking, interruptions, telephony, call transfer between assistants (squads and the handoff tool), simulations and per-turn latency metrics come managed. You can bring your own provider keys, in which case the provider bills you directly. Vapi's homepage claims under 500 ms average latency and a billion calls supported, and quotes Amazon Ring as running all of its inbound call volume through the platform.

**Where it loses.** You cannot self-host it, and what you can change is what the config exposes. Concurrency is a plan limit: the usage-only tier includes 4 concurrent calls as of November 2026, with more sold per line. And the per-minute platform fee is the highest of the three.

## The latency budget

Vapi's docs give the cleanest breakdown of voice-to-voice latency, and it applies to every stack here. After the caller stops speaking, five stages run in sequence:

| Stage | What happens | What moves it |
| --- | --- | --- |
| 1. Transport | Caller audio reaches your servers | Region placement, WebRTC versus a PSTN hop |
| 2. Transcription | STT finalizes the last words | Streaming STT choice |
| 3. Endpointing | The system decides the turn is over | Turn detector quality and silence thresholds |
| 4. Model response | Time to first token | Model size, prompt length, retrieval before the call |
| 5. Speech synthesis | Time to first audio | TTS choice and how much text you buffer first |

Add the return trip to the caller and you have the gap the user hears. Three things to take from this:

- **Headline numbers usually skip stages.** Vapi states that its displayed latency total excludes endpointing and transport, and that endpointing can account for a meaningful share of the delay. Compare figures only when they cover the same stages.
- **The model is often the largest single component.** Vapi's docs say time to first token is often the biggest part, and larger models are slower to start. A smaller model with a better prompt often beats a larger one on the phone.
- **Endpointing is a trade, not a minimum.** Cut the wait too far and the agent talks over people who paused to think. LiveKit's docs show a text-only detector committing a turn at 2.76 s and 4.88 s into an utterance that actually ended at 6.4 s. That is why LiveKit and Pipecat both ship a model-based turn detector, and why Vapi has a speech configuration page for tuning when the assistant starts and stops talking.

Log per-stage timings for every turn (Vapi records them as `turnLatencies`; Pipecat's `enable_metrics=True` and LiveKit's session metrics do the same job) and look at the slow tail, not the average.

## The cost model

Every option has the same three meters; they differ in who runs each one.

| Meter | LiveKit Cloud | Pipecat Cloud | Vapi |
| --- | --- | --- | --- |
| Platform | Per agent-session minute, after plan allotments | Per active agent minute by compute size; always-on reserved agents bill at a lower rate | Per-minute hosting fee |
| Models (STT, LLM, TTS) | LiveKit Inference per-minute rates, or your own provider keys | Billed by each provider directly | Provider cost with no markup, or your own keys |
| Telephony | Per minute, with a free number on the entry plan | Billed by the telephony provider; 1:1 voice over Daily WebRTC is free on Pipecat Cloud | Included for Vapi numbers and SIP in the calculator |

As of November 2026, list prices put Vapi's hosting fee at about five times the per-minute agent fee on LiveKit Cloud or on Pipecat Cloud's smallest agent size. In Vapi's own calculator, with its default Deepgram, OpenAI and ElevenLabs stack at 1,000 minutes a month, the hosting fee is roughly 40 to 60 percent of the estimated bill. Model costs are similar everywhere because you can bring the same providers to each. Exact rates are on the [Vapi](/tools/vapi), [LiveKit](/tools/livekit) and [Pipecat](/tools/pipecat) pages.

So the break-even is simple arithmetic you can run with your own numbers:

```text
monthly_premium    = minutes_per_month x (buy_platform_fee - build_platform_fee)
monthly_build_cost = engineer_hours_per_month x loaded_hourly_rate (+ servers if self-hosting)

Stay on the bought platform while monthly_premium < monthly_build_cost.
```

Two cautions. Self-hosting LiveKit or Pipecat removes the platform meter and replaces it with servers and on-call time, which is rarely cheaper below sustained high volume. And the premium buys things that are easy to under-count when you build: concurrency management, call recording and retention, simulations, and someone else's pager.

## How to choose

- **A phone agent for support or outbound, no realtime team:** Vapi. Revisit when the monthly premium above exceeds what an engineer costs you.
- **Voice inside your own app, with video, screen share or many participants:** LiveKit. It is the only one of the three that is also a general WebRTC platform.
- **Unusual pipeline logic** (custom processors, parallel models, your own routing between stages): Pipecat.
- **Data residency or air-gapped deployment:** LiveKit or Pipecat self-hosted. Vapi cannot be self-hosted.
- **You can't decide:** prototype the conversation on Vapi to learn what the agent must say and do, then port the prompt and tools when volume justifies it. Prompts and tool schemas move between stacks; telephony config and turn-taking tuning do not.

[Cartesia](/tools/cartesia) is the vertically integrated alternative to Vapi if its speech models are the reason you are choosing. For the component-level build, see [How to Build a Voice Agent](/guides/voice/build-a-voice-agent); the [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) agent handles pipeline latency and turn-taking work in an existing codebase.
