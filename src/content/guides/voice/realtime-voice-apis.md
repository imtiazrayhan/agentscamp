---
title: "Realtime Voice Agents: Build on LiveKit, Buy Vapi, or Pipeline with Pipecat"
description: "The three ways to ship a realtime voice agent in 2026 — open infrastructure, managed platform, or OSS pipeline — and how speech-to-speech models fit in."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["multimodal-ai", "ai-agents-systems"]
tags: ["voice-agents", "realtime", "comparison", "webrtc"]
featured: false
summary: "Three postures cover realtime voice in 2026: build on LiveKit (open WebRTC infra + agents framework + telephony — maximum control), assemble with Pipecat (the OSS pipeline framework for custom STT→LLM→TTS flows), or buy Vapi (assistants live in an afternoon at a per-minute platform fee). Speech-to-speech realtime models slot into all three rather than replacing them."
keyTakeaways:
  - "The decision is posture, not features: own the infrastructure (LiveKit), own the pipeline logic (Pipecat), or own neither and ship today (Vapi)."
  - "Latency budgets rule everything: a natural turn is well under a second total, split across STT, LLM time-to-first-token, and TTS time-to-first-audio — every architecture choice is a withdrawal from that budget."
  - "Turn detection is the hidden boss: knowing when the user finished talking — LiveKit open-sourced a semantic model for it, Cartesia's Ink emits it natively, platforms bundle it."
  - "Speech-to-speech models (realtime APIs) compress the pipeline but not the system — transport, telephony, tools, and interruptions still need a home, which is why they run INSIDE these stacks."
  - "Economics flip with scale: per-minute platforms are unbeatable to start and expensive at volume; self-built stacks invert that curve."
faq:
  - q: "Should I use a speech-to-speech model or the STT→LLM→TTS pipeline?"
    a: "Increasingly both exist in the same system. Realtime speech-to-speech models give the most natural turn-taking and lowest conversational latency; the classic pipeline gives model choice per stage, easier tool-calling control, and cheaper economics. The frameworks treat it as a config choice — LiveKit Agents and Pipecat run either; Vapi abstracts it — so the architecture decision (build/assemble/buy) matters more than the model topology."
  - q: "What does a production voice agent actually consist of?"
    a: "Transport (WebRTC or telephony), speech recognition with endpointing, turn detection, the agent brain (LLM + tools + memory), speech synthesis, and interruption handling — plus observability over all of it. The model calls are the easy 30%; the realtime systems engineering is why platforms and frameworks exist."
  - q: "What does Cartesia Line change?"
    a: "It's a fourth posture: vertically integrated. Line runs Cartesia's own Sonic TTS and Ink STT in a hosted agent platform with per-minute pricing — competing with Vapi on convenience while owning the models. Compelling if Cartesia's latency thesis is your priority; the trade is provider flexibility."
related: ["tool:livekit", "tool:vapi", "tool:pipecat", "tool:cartesia", "guide:build-a-voice-agent", "guide:best-tts-apis-2026", "guide:best-stt-apis-2026", "agent:voice-agent-engineer"]
---

Voice agents crossed the production threshold — a billion-plus calls on the major platforms — and the tooling sorted into three honest postures. The question isn't which is "best"; it's **how much of the realtime stack you want to own**.

## The short list

| Posture | Tool | You own | You get |
| --- | --- | --- | --- |
| **Build** | [LiveKit](/tools/livekit) | Infra + pipeline | Open source, max control, scale economics |
| **Assemble** | [Pipecat](/tools/pipecat) | Pipeline logic | OSS framework, provider freedom |
| **Buy** | [Vapi](/tools/vapi) | Config | Live agents in an afternoon, per-minute fee |

## The three postures

**Build on [LiveKit](/tools/livekit)** when voice is core product. The Apache-2.0 WebRTC server plus the Agents framework covers transport, the STT→LLM→TTS pipeline *or* realtime speech-to-speech models, an open-sourced semantic turn-detection model, and Telephony 1.0 (SIP, transfers, scale) — with LiveKit Cloud as the managed escape hatch. The credential is hard to argue with: per LiveKit, ChatGPT's Voice Mode runs on this stack. Cost: real engineering; payoff: control and unit economics that improve with volume.

**Assemble with [Pipecat](/tools/pipecat)** when the pipeline *is* your differentiation. The open-source Python framework composes voice flows from interchangeable pieces — any [STT](/guides/voice/best-stt-apis-2026), any LLM, any [TTS](/guides/voice/best-tts-apis-2026), custom logic between stages — without also adopting a media-server worldview. It pairs naturally with LiveKit or other transports underneath.

**Buy [Vapi](/tools/vapi)** when shipping beats owning. Assistant = prompt + model + voice + tools; attach a number; live. Turn-taking (vendor-claimed sub-600ms), interruptions, telephony, and multi-agent Squads come managed, at a platform fee per minute plus model costs (BYO keys pass through at cost). The 2026 traction — a $50M Series B, Amazon Ring routing all inbound calls through it — says the buy side is no toy. ([Cartesia Line](/tools/cartesia) plays the same posture, vertically integrated on Cartesia's models.)

## What actually decides quality

Whatever posture you pick, the same three system properties make or break the agent. **The latency budget**: a natural conversational turn is well under a second — STT endpointing + LLM time-to-first-token + TTS time-to-first-audio, measured p95, decides whether the agent feels human or like hold music. **Turn detection**: knowing when the user *finished* (versus paused) is the hardest perceptual problem in the stack — LiveKit's open semantic model, Ink's native turn events, and platform bundles are all answers to it. **Interruption handling**: users barge in; the agent must stop talking, cheaply discard in-flight generation, and listen — a transport-and-state problem no model solves alone.

Start by posture (own infra / own pipeline / own nothing), prototype on the buy side if speed matters, and revisit the build math when minutes get expensive. The component-level walkthrough — models, prompts, and the pipeline's failure modes — is [How to Build a Voice Agent](/guides/voice/build-a-voice-agent), and the [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) agent owns exactly this build.
