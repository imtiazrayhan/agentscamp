---
name: "Pipecat"
title: "Pipecat"
description: "An open-source Python framework for real-time voice and multimodal conversational AI — it orchestrates streaming STT, LLM, and TTS into composable pipelines."
url: "https://pipecat.ai"
date: 2026-06-04
pricing: "open-source"
category: "voice"
repo: "https://github.com/pipecat-ai/pipecat"
license: "BSD-2-Clause"
os: ["Linux", "macOS", "Windows"]
sameAs: ["https://github.com/pipecat-ai/pipecat", "https://docs.pipecat.ai"]
color: "blue"
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["voice", "real-time", "framework", "open-source", "python"]
featured: false
alternativeTo: []
summary: "Pipecat is an open-source Python framework for building real-time voice and multimodal conversational agents. It orchestrates the streaming STT → LLM → TTS loop, the audio transport (WebRTC/WebSocket), and turn-taking into composable pipelines, with integrations across dozens of speech and model providers — so you build the agent's behavior instead of the real-time plumbing."
related: ["build-a-voice-agent", "voice-agent-engineer", "deepgram", "elevenlabs"]
faq:
  - q: "What is Pipecat?"
    a: "Pipecat is an open-source Python framework for real-time voice and multimodal conversational AI. It orchestrates the streaming STT → LLM → TTS loop, manages WebRTC/WebSocket audio transports, and handles turn-taking, interruptions, and voice-activity detection as composable pipelines — so you build the agent's behavior rather than the real-time plumbing."
  - q: "Is Pipecat free?"
    a: "Yes — open source under BSD-2-Clause. You pay the underlying STT/LLM/TTS providers for usage, and you run the framework yourself, locally or in the cloud."
  - q: "Which providers does Pipecat work with?"
    a: "Dozens of STT/LLM/TTS providers, including Deepgram, ElevenLabs, OpenAI, and Anthropic. Each pipeline stage's provider can be swapped without rewriting the loop — that's the point: mix best-of-breed services per stage and keep control over latency, cost, and model choice."
---

Pipecat is an open-source Python framework for **real-time voice and multimodal conversational AI**. It solves the hard, generic part of a [voice agent](/guides/voice/build-a-voice-agent): orchestrating the streaming STT → LLM → TTS loop, managing the audio transport, and handling turn-taking — all as composable pipelines. You assemble a pipeline from provider-backed components and Pipecat runs the real-time hand-offs, so you focus on the agent's behavior rather than the streaming infrastructure.

It's aimed at developers building custom voice agents who want best-of-breed providers per stage instead of a single bundled API — and the control over latency, cost, and model choice that brings.

## Highlights

- **Composable real-time pipeline** — wire streaming STT, LLM, and TTS into one low-latency loop.
- **Broad integrations** — works with dozens of STT/LLM/TTS providers (Deepgram, ElevenLabs, OpenAI, Anthropic, and many more).
- **Transports built in** — WebRTC and WebSocket for browser, phone, and app audio.
- **Turn-taking & interruptions** — voice-activity detection, endpointing, and barge-in handled in the framework.
- **Single or multi-agent** — compose one agent or coordinate several with handoff and parallel processing.

## In an AI-assisted workflow

```python
# a Pipecat pipeline wires the streaming stages into one real-time loop
from pipecat.pipeline.pipeline import Pipeline
pipeline = Pipeline([transport.input(), stt, llm, tts, transport.output()])
```

Swap any stage's provider without rewriting the loop — the pipeline structure stays the same.

> [!TIP]
> Pipecat shines when you want to mix providers — e.g. Deepgram for STT, your own LLM via a gateway, and ElevenLabs for TTS — and still get tuned turn-taking and barge-in for free. For a single-vendor prototype, a bundled voice-agent API is faster to start.

## Good to know

Pipecat is open source (BSD-2-Clause) and free; you pay the underlying STT/LLM/TTS providers for usage. It's a Python framework you run yourself (locally or in the cloud), with WebRTC/WebSocket transports for getting audio in and out. To pick the providers it orchestrates, compare [Deepgram](/tools/deepgram) (STT) and [ElevenLabs](/tools/elevenlabs) (TTS); the [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) builds and tunes the whole pipeline.
