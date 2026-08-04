---
name: "LiveKit"
description: "Open-source realtime infrastructure — a WebRTC server plus the LiveKit Agents framework for production voice AI, with turn detection, telephony, and cloud."
date: 2026-06-11
url: "https://livekit.com"
pricing: "freemium"
category: "voice"
repo: "https://github.com/livekit/livekit"
license: "Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["webrtc", "voice-agents", "realtime", "open-source", "telephony"]
featured: false
alternativeTo: ["pipecat", "vapi"]
sameAs:
  - "https://github.com/livekit"
  - "https://docs.livekit.io"
  - "https://x.com/livekit"
related: ["guide:realtime-voice-apis", "guide:build-a-voice-agent", "tool:pipecat", "tool:vapi", "tool:cartesia", "tool:deepgram"]
summary: "LiveKit is the open-source realtime stack voice AI standardized on: an Apache-2.0 WebRTC server plus the LiveKit Agents framework (Python/Node) wiring STT→LLM→TTS or speech-to-speech models, with an open multilingual turn-detection model, full telephony (SIP, DTMF, transfers), and LiveKit Cloud as the managed network. Self-host free; cloud freemium with metered minutes."
faq:
  - q: "What exactly is LiveKit — the server or the agents framework?"
    a: "Both, layered: livekit/livekit is the WebRTC SFU (the media transport), and livekit/agents is the framework for building voice agents on top — pluggable STT/LLM/TTS providers or realtime speech-to-speech models, turn detection, interruptions, telephony. Self-host both for free, or run on LiveKit Cloud and pay metered minutes."
  - q: "Does ChatGPT's voice mode really run on LiveKit?"
    a: "Per LiveKit's own blog: yes — OpenAI integrates a LiveKit client SDK in the ChatGPT app, with calls connecting over LiveKit Cloud, alongside an announced partnership around the Realtime API. It's vendor-attributed (phrase it that way), but it's the strongest production credential in the category."
  - q: "LiveKit vs Vapi — build or buy?"
    a: "LiveKit is infrastructure you assemble: maximum control, open source, your provider choices, real engineering investment. Vapi is the managed assembly: an API where agents exist in minutes at a platform fee per minute. Teams with realtime engineering appetite (or scale economics) build on LiveKit; teams shipping voice features fast buy Vapi."
---

LiveKit became voice AI's load-bearing infrastructure the unglamorous way: by being the open-source WebRTC stack that worked, then building the agent layer the moment voice agents needed one. The credential says it all — **ChatGPT's Voice Mode runs over LiveKit**, per LiveKit's own announcements.

## Highlights

- **The WebRTC core** — an Apache-2.0 SFU for low-latency audio/video at scale; self-host anywhere, in Go.
- **LiveKit Agents** — the framework (Python and Node) for production voice agents: pluggable STT/LLM/TTS pipelines *or* realtime speech-to-speech models, with interruption handling built in.
- **Open turn detection** — a multilingual semantic turn-detection model (13 languages, ~25ms CPU inference) — the hardest part of natural conversation, open-sourced.
- **Telephony 1.0** — SIP, DTMF, transfers, thousands of concurrent calls: the phone-system half most stacks bolt on late.
- **LiveKit Inference** — one interface routing STT/LLM/TTS across providers ([Cartesia](/tools/cartesia), [Deepgram](/tools/deepgram), and friends plug in).
- **Cloud when you want it** — serverless agent deployment, observability (session replays, traces), a real free tier, metered minutes beyond.

## In an AI-assisted workflow

```bash
pip install "livekit-agents[openai,silero,deepgram,cartesia,turn-detector]"
# define an Agent with your STT/LLM/TTS mix (or a realtime model) and deploy —
# self-hosted server or LiveKit Cloud
```

It's the substrate under the [voice-agent pipeline](/guides/voice/build-a-voice-agent): you bring the models, LiveKit owns transport, turns, and telephony — the parts that make demos fall over in production.

> [!NOTE]
> Use livekit.com (the .io domain redirects), and pin agent-framework versions — the 1.0 redesign retired pre-1.0 patterns and the cadence stays brisk. Self-hosting is genuinely free but re-creates what Cloud meters (TURN, scaling, orchestration).

## Good to know

Apache-2.0 throughout (~19k/11k stars across server/agents), with a $45M Series B (April 2025) and a **$100M Series C at a $1B valuation** (Index Ventures, January 2026) — agents downloads topped a million a month. The build-vs-buy line against [Vapi](/tools/vapi) and the OSS-pipeline comparison with [Pipecat](/tools/pipecat) are drawn in [Realtime Voice Agents](/guides/voice/realtime-voice-apis).
