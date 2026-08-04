---
name: "Cartesia"
description: "Real-time voice AI on state-space models — Sonic streaming TTS, Ink STT with native turn detection, and Line, a code-first voice-agent platform."
date: 2026-06-11
url: "https://www.cartesia.ai"
pricing: "freemium"
category: "voice"
os: ["Web"]
color: "purple"
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["tts", "stt", "voice", "realtime", "voice-agents"]
featured: false
alternativeTo: ["elevenlabs", "deepgram", "vapi"]
sameAs:
  - "https://github.com/cartesia-ai"
  - "https://x.com/cartesia"
  - "https://www.linkedin.com/company/cartesia-ai/"
related: ["guide:best-tts-apis-2026", "guide:best-stt-apis-2026", "guide:realtime-voice-apis", "tool:elevenlabs", "tool:deepgram", "guide:build-a-voice-agent"]
summary: "Cartesia builds voice AI on state-space models: Sonic streaming TTS — vendor-claimed sub-100ms model latency, 42 languages, emotion controls — Ink streaming STT with turn detection native to the model, and Line, a code-first platform for deploying voice agents with hosted infra, telephony, and evals. Freemium credits; commercial use starts at the low-cost Pro tier."
faq:
  - q: "What makes Cartesia different from ElevenLabs?"
    a: "Architecture and posture. Cartesia's models are state-space (SSM/Mamba lineage — its founders created the architecture), built for streaming-first, low-latency realtime voice; ElevenLabs leads on voice variety, expressiveness, and its broader audio product surface. For interactive agents where every millisecond of latency is conversational quality, Cartesia is the specialist; for produced audio and voice breadth, ElevenLabs."
  - q: "What is Cartesia Line?"
    a: "Their voice-agent platform (GA August 2025): code-first SDK and CLI with one-command deploys, hosted infrastructure, phone numbers and SIP (beta), call recording and transcripts, latency metrics, and LLM-as-judge evals — defaulting to Sonic + Ink, so the whole loop runs on Cartesia's stack at per-minute pricing."
  - q: "Is there a free tier?"
    a: "Yes — monthly free credits covering meaningful testing, but it's non-commercial: a commercial-use license starts at the inexpensive Pro plan, which also unlocks instant voice cloning. Credits meter both TTS and STT (TTS burns them several times faster)."
---

Cartesia is the latency specialist of voice AI — founded by the creators of the state-space model architecture, and betting that **conversation-grade voice is a realtime systems problem**. Its stack covers both directions (Sonic out, Ink in) and, with Line, the agent platform that runs them.

## Highlights

- **Sonic TTS** — streaming-first synthesis with vendor-claimed sub-100ms model latency; Sonic 3.5 (May 2026) spans 42 languages with emotion and laughter controls.
- **Ink STT** — streaming transcription with **turn detection native to the model** (turn-start/turn-end events, no external VAD), plus careful handling of phone numbers, emails, and IDs; Ink-2 launched May 2026 (English-first).
- **Line** — the voice-agent platform: SDK/CLI with one-command deploys, hosted infra, provisioned phone numbers, recordings/transcripts, latency dashboards, and built-in evals.
- **Voice cloning** — instant (Pro) and professional tiers.
- **SSM pedigree** — the architecture bet (efficient streaming inference) is the product's whole thesis.

## In an AI-assisted workflow

Sign up, take an API key, and stream over WebSocket — or let Line own the loop. In a [voice-agent pipeline](/guides/voice/build-a-voice-agent), Cartesia typically slots in as the TTS (and now STT) where time-to-first-audio defines how human the agent feels; native turn detection removes one of the pipeline's trickiest components.

> [!NOTE]
> Plan mechanics worth knowing: the free tier is **non-commercial** (commercial use starts at Pro), credits meter TTS ~6× faster than STT, and the older T2A API was deprecated in March 2026 — build against the current endpoints.

## Good to know

$64M Series A led by Kleiner Perkins (March 2025); a larger late-2025 raise is third-party-reported but not vendor-confirmed, so we don't state it. Hosted/proprietary (the GitHub org carries SDKs). Against the field — [ElevenLabs](/tools/elevenlabs)' breadth, [Deepgram](/tools/deepgram)'s enterprise STT, [Vapi](/tools/vapi) as the assemble-don't-build alternative to Line — see [Best TTS APIs](/guides/voice/best-tts-apis-2026) and [Best STT APIs](/guides/voice/best-stt-apis-2026).
