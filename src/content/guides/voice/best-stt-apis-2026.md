---
title: "Best Speech-to-Text APIs in 2026"
description: "The STT field, honestly ranked — Deepgram and AssemblyAI's hosted duel, Whisper as the open baseline, Cartesia Ink for latency — and how to pick by workload."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["multimodal-ai", "mlops-ai-infra"]
tags: ["stt", "speech-to-text", "voice", "best-of", "comparison"]
featured: false
summary: "Four answers cover STT in 2026: Deepgram (streaming-first enterprise workhorse), AssemblyAI (promptable Universal-3 Pro plus the understanding stack — summaries, sentiment, PII), Whisper (the open-weights baseline for self-hosting via faster-whisper/whisper.cpp), and Cartesia Ink (the latency newcomer with model-native turn detection). Pick by workload."
keyTakeaways:
  - "STT split into workloads: realtime streaming (agents, captions), batch + understanding (calls, meetings, compliance), and self-hosted (privacy, unit cost) — each has a different winner."
  - "Deepgram and AssemblyAI are the hosted duel: Deepgram's identity is streaming speed at enterprise scale; AssemblyAI's is the intelligence layer — promptable transcription plus summaries, sentiment, speaker ID, and redaction."
  - "Whisper stays the open baseline: MIT weights, huge ecosystem, but no new generation since turbo — hosted models now beat it on accuracy and features when audio can leave your perimeter."
  - "Cartesia Ink is the one to watch for agents: turn detection native to the model removes a whole pipeline component."
  - "Benchmark WER on YOUR audio — accents, jargon, phone-line quality — and watch billing models: one vendor meters streaming by session time, not audio time."
faq:
  - q: "What's the most accurate speech-to-text API?"
    a: "On clean English benchmarks the hosted leaders cluster tightly; on YOUR audio they diverge — domain terms, accents, and noise decide it. AssemblyAI's promptable Universal-3 Pro takes a real lead when you can feed it context and keyterms (vendor-cited +45% on domain terms); Deepgram counters with streaming performance. Run both on fifty representative clips before believing anyone's chart."
  - q: "Is Whisper good enough to skip the APIs?"
    a: "For privacy-bound, cost-sensitive, or offline workloads — yes, via faster-whisper or whisper.cpp, with VAD to manage its silence-hallucination habit. You give up streaming-grade latency, diarization, and the understanding layers, and accept a model frozen at the turbo generation. It's the right floor, not the frontier."
  - q: "Which STT should a voice agent use?"
    a: "A streaming model with great time-to-first-token and solid endpointing: Deepgram and AssemblyAI's streaming tiers are the proven picks, with Cartesia Ink the latency-first newcomer whose native turn detection simplifies the pipeline. If you'd rather not assemble at all, the bundles (AssemblyAI's Voice Agent API, LiveKit Inference, Vapi) make STT a dropdown."
related: ["deepgram", "assemblyai", "whisper", "cartesia", "best-tts-apis-2026", "realtime-voice-apis", "build-a-voice-agent"]
---

Speech-to-text stopped being one product: **realtime streaming** (agents, captions), **batch with understanding** (every call center's analytics), and **self-hosted** (privacy and unit economics) reward different engines. The 2026 field maps cleanly onto those workloads.

## The short list

| Engine | Pick it for | Shape |
| --- | --- | --- |
| [Deepgram](/tools/deepgram) | Realtime streaming at scale | Hosted, streaming-first |
| [AssemblyAI](/tools/assemblyai) | Accuracy + the understanding stack | Hosted, promptable |
| [Whisper](/tools/whisper) | Self-hosting, privacy, batch cost | Open weights (MIT) |
| [Cartesia](/tools/cartesia) (Ink) | Agent latency, native turn detection | Hosted, realtime specialist |

## The picks, by workload

**Realtime agents → [Deepgram](/tools/deepgram) or Ink.** Deepgram built its identity on streaming: low latency, robust endpointing, enterprise scale, with Aura TTS alongside for one-vendor stacks. [Cartesia Ink](/tools/cartesia) is the 2026 challenger — streaming STT with **turn detection emitted by the model itself** (no external VAD), which deletes one of the [voice pipeline's](/guides/voice/build-a-voice-agent) trickiest components; it's English-first at launch.

**Batch + understanding → [AssemblyAI](/tools/assemblyai).** Universal-3 Pro's *promptability* — steer transcription with context and keyterms — is the accuracy story of 2026, and the platform around it (summarization, sentiment, speaker ID, translation, PII redaction in 50+ languages) turns audio archives into queryable, compliant data. When transcription is the input to analysis, this stack is the shortcut.

**Self-hosted → [Whisper](/tools/whisper).** MIT weights, ~99 languages, and an ecosystem (faster-whisper, whisper.cpp) that runs it from datacenter to laptop. The honest 2026 status: no new generation since turbo, so hosted models lead on accuracy and features — but nothing touches it when audio can't leave your infrastructure or volume makes per-hour pricing sting.

## How to actually choose

Three checks beat any leaderboard. **WER on your audio**: fifty representative clips — your accents, your jargon, your phone-line quality — through each candidate; the published-benchmark winner loses on somebody's domain every week. **Latency where it counts**: for agents, measure streaming time-to-first-token and endpointing behavior from your region, p95 not median. **The billing fine print**: AssemblyAI streams bill by *session* time (idle sockets cost), Whisper bills in GPU-hours and engineering, add-ons stack per hour everywhere. The output half of the conversation is [Best TTS APIs](/guides/voice/best-tts-apis-2026); the architecture that consumes both is [Realtime Voice Agents](/guides/voice/realtime-voice-apis).
