---
name: "AssemblyAI"
description: "Speech AI platform: promptable Universal-3 Pro STT, a flat-rate Voice Agent API, and speech understanding — summarization, sentiment, PII redaction."
date: 2026-06-11
url: "https://www.assemblyai.com"
pricing: "freemium"
category: "voice"
os: ["Web"]
color: "blue"
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["stt", "speech-to-text", "voice", "api", "transcription"]
featured: false
alternativeTo: ["deepgram", "whisper", "cartesia"]
sameAs:
  - "https://github.com/AssemblyAI"
  - "https://www.linkedin.com/company/assemblyai"
related: ["guide:best-stt-apis-2026", "guide:realtime-voice-apis", "tool:deepgram", "tool:whisper", "tool:cartesia", "guide:build-a-voice-agent"]
summary: "AssemblyAI packages speech intelligence as one API: the Universal STT family — topped by Universal-3 Pro (February 2026), a promptable speech model you steer with natural-language context and keyterms — streaming for voice agents, a flat-rate Voice Agent API bundling STT+LLM+TTS over one WebSocket, and understanding layers. Freemium with signup credits, then per-hour usage."
faq:
  - q: "What's special about Universal-3 Pro?"
    a: "It's promptable — a speech language model you steer with context: tell it the domain, feed keyterms (vendor-cited +45% accuracy on domain terms), and it adapts — plus audio tagging, disfluency capture, and code-switching. That contextual steering is the line between 'transcription' and 'transcription that knows what your call is about.'"
  - q: "What is the Voice Agent API?"
    a: "A full speech-to-speech pipeline over a single WebSocket (April 2026): STT, your chosen LLM, TTS, server-side turn detection, interruption handling, and JSON-Schema tool calling — at a flat hourly rate that bundles the whole loop. It collapses the assemble-five-vendors voice stack into one connection."
  - q: "How does AssemblyAI pricing work?"
    a: "Free credits at signup (no card), then usage: per-hour rates by model for pre-recorded and streaming, with intelligence add-ons (PII redaction, speaker ID, etc.) stacking per hour. One gotcha worth designing around: streaming bills on session duration, not audio duration — idle WebSockets cost money."
---

AssemblyAI's bet is that transcription is the *floor*, not the product: the value sits in **speech understanding** — and increasingly in owning the whole voice-agent loop. Its 2026 lineup runs from promptable STT to a one-WebSocket agent pipeline.

## Highlights

- **Universal-3 Pro** (Feb 2026) — promptable STT: steer with natural-language context and keyterms, capture disfluencies, handle code-switching; six native languages with routing to 99+.
- **Streaming STT** — the realtime tier voice agents and live captions build on.
- **Voice Agent API** (Apr 2026) — STT + LLM + TTS + turn detection + interruptions + tool calling over one WebSocket, flat-rate per hour.
- **Speech understanding** — summarization, sentiment, entities, topics, speaker labels/identification, translation across 89 languages.
- **Guardrails** — PII redaction, profanity filtering, and moderation in 50+ languages: the compliance layer audio pipelines need.
- **LLM Gateway** — route understanding workloads across GPT/Claude/Gemini with caching, keeping the audio and reasoning bills in one place.

## In an AI-assisted workflow

Sign up, take the key, POST files or open a WebSocket — Python/JS SDKs cover both. In [voice-agent stacks](/guides/voice/build-a-voice-agent) it's either the best-in-class STT component or, via the Voice Agent API, the whole pipeline; in data work, it's the "turn 10,000 calls into queryable, redacted, summarized records" machine.

> [!WARNING]
> Two billing edges: streaming meters **session time** (close idle connections), and the legacy best/nano model tiers are deprecated — new integrations should target the Universal family.

## Good to know

Hosted and proprietary, with a genuinely useful free-credit start. Against the field: [Deepgram](/tools/deepgram) competes hardest on enterprise streaming, [Whisper](/tools/whisper) is the self-host baseline, [Cartesia Ink](/tools/cartesia) the latency-first newcomer — the decision table is [Best Speech-to-Text APIs in 2026](/guides/voice/best-stt-apis-2026).
