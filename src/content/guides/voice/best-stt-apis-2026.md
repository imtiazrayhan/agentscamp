---
title: "Best Speech-to-Text APIs in 2026"
description: "The STT field, honestly ranked — Deepgram and AssemblyAI's hosted duel, Whisper as the open baseline, Cartesia Ink for latency — and how to pick by workload."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["multimodal-ai", "mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["stt", "speech-to-text", "voice", "best-of", "comparison"]
featured: false
summary: "Four answers cover STT in 2026: Deepgram (streaming-first enterprise workhorse), AssemblyAI (promptable AssemblyAI-STT-3.7 plus the understanding stack — summaries, sentiment, PII), Whisper (the open-weights baseline for self-hosting via faster-whisper/whisper.cpp), and Cartesia Ink (the latency newcomer with model-native turn detection). Pick by workload."
keyTakeaways:
  - "STT split into workloads: realtime streaming (agents, captions), batch + understanding (calls, meetings, compliance), and self-hosted (privacy, unit cost) — each has a different winner."
  - "Deepgram and AssemblyAI are the hosted duel: Deepgram's identity is streaming speed at enterprise scale; AssemblyAI's is the intelligence layer — promptable transcription plus summaries, sentiment, speaker ID, and redaction."
  - "Whisper stays the open baseline: MIT weights, huge ecosystem, but no new generation since turbo — hosted models now beat it on accuracy and features when audio can leave your perimeter."
  - "Cartesia Ink is the one to watch for agents: turn detection native to the model removes a whole pipeline component."
  - "Benchmark WER on YOUR audio — accents, jargon, phone-line quality — and watch billing models: one vendor meters streaming by session time, not audio time."
faq:
  - q: "What's the most accurate speech-to-text API?"
    a: "On clean English benchmarks the hosted leaders cluster tightly; on YOUR audio they diverge — domain terms, accents, and noise decide it. AssemblyAI-STT-3.7, which replaced the Universal-3 line in November 2026, takes a prompt describing the audio plus a keyterms list, and that helps most on domain terms; Deepgram counters with streaming performance. Run both on fifty representative clips before believing anyone's chart."
  - q: "Is Whisper good enough to skip the APIs?"
    a: "For privacy-bound, cost-sensitive, or offline workloads — yes, via faster-whisper or whisper.cpp, with VAD to manage its silence-hallucination habit. You give up streaming-grade latency, diarization, and the understanding layers, and accept a model frozen at the turbo generation. It's the right floor, not the frontier."
  - q: "Which STT should a voice agent use?"
    a: "A streaming model with great time-to-first-token and solid endpointing: Deepgram and AssemblyAI's streaming tiers are the proven picks, with Cartesia Ink the latency-first newcomer whose native turn detection simplifies the pipeline. If you'd rather not assemble at all, the bundles (AssemblyAI's Voice Agent API, LiveKit Inference, Vapi) make STT a dropdown."
related: ["tool:deepgram", "tool:assemblyai", "tool:whisper", "tool:cartesia", "guide:best-tts-apis-2026", "guide:realtime-voice-apis", "guide:build-a-voice-agent"]
---

[Speech-to-text](/glossary/speech-to-text) stopped being one product: **realtime streaming** (agents, captions), **batch with understanding** (every call center's analytics), and **self-hosted** (privacy and unit economics) reward different engines. The 2026 field maps cleanly onto those workloads.

## The short list

| Engine | Pick it for | Shape |
| --- | --- | --- |
| [Deepgram](/tools/deepgram) | Realtime streaming at scale | Hosted, streaming-first |
| [AssemblyAI](/tools/assemblyai) | Accuracy + the understanding stack | Hosted, promptable |
| [Whisper](/tools/whisper) | Self-hosting, privacy, batch cost | Open weights (MIT) |
| [Cartesia](/tools/cartesia) (Ink) | Agent latency, native turn detection | Hosted, realtime specialist |

## The picks, by workload

**Realtime agents → [Deepgram](/tools/deepgram) or Ink.** Deepgram built its identity on streaming: low latency, robust endpointing, enterprise scale, with Flux TTS alongside for one-vendor stacks; its Flux STT model now does turn detection in the model as well. [Cartesia Ink](/tools/cartesia) is the 2026 challenger — streaming STT with **turn detection emitted by the model itself** (no external VAD), which deletes one of the [voice pipeline's](/guides/voice/build-a-voice-agent) trickiest components; the stable Ink 2 model covers English, French, Hindi, Japanese and Spanish.

**Batch + understanding → [AssemblyAI](/tools/assemblyai).** *Promptability* — steering transcription with context and keyterms — is the accuracy story of 2026 and carries over to AssemblyAI-STT-3.7, the model that replaced Universal-3 Pro on November 17, 2026, and the platform around it (summarization, sentiment, speaker ID, translation, PII redaction in 50+ languages) turns audio archives into queryable, compliant data. When transcription is the input to analysis, this stack is the shortcut.

**Self-hosted → [Whisper](/tools/whisper).** MIT weights, ~99 languages, and an ecosystem (faster-whisper, whisper.cpp) that runs it from datacenter to laptop. The honest 2026 status: no new generation since turbo, so hosted models lead on accuracy and features — but nothing touches it when audio can't leave your infrastructure or volume makes per-hour pricing sting.

## Streaming vs batch: different architectures, different failure modes

Picking the right API starts with separating **streaming** from **batch** pipelines:

- **Streaming STT** sends 20–100ms audio frames over a persistent WebSocket and receives *interim* hypotheses followed by *final* utterances. Here, **endpointing** (deciding when a speaker finished a thought versus paused to breathe) matters as much as word error rate (WER). Aggressive endpointing cuts users off mid-sentence; conservative endpointing adds awkward half-second silences to every turn.
- **Batch STT** uploads a finished recording (or URL) and optimizes for accuracy, speaker diarization, punctuation, and downstream intelligence (summaries, topics, compliance redaction). Latency is measured in seconds-per-hour-of-audio rather than milliseconds, so you can afford heavier models and second-pass alignment.

## Accuracy levers that actually move WER

Most teams blame the base model when the real accuracy gains sit in audio prep and configuration:

- **Domain vocabulary and keyterm prompting:** product names, medical/legal jargon, and customer names cause a disproportionate share of painful errors. Promptable models (such as AssemblyAI-STT-3.7) and keyterm boosting features often cut domain-specific errors far more than switching base providers.
- **Telephony vs wideband audio:** 8kHz narrowband phone calls with background noise behave completely differently from clean 48kHz podcast mics. Always pass the native encoding without redundant lossy re-compression, and verify whether your provider offers a dedicated telephony acoustic model.
- **Speaker diarization on overlapping speech:** cross-talk in sales calls and support recordings is where diarization breaks down. If you have dual-channel (stereo) call recordings — agent on channel 0, customer on channel 1 — use **multichannel transcription** instead of mono diarization; it eliminates speaker-attribution errors completely.

## Self-hosting Whisper: the real trade-offs

Running `faster-whisper` or `whisper.cpp` looks cheap on paper, so account for the operational checklist upfront:

- **Voice Activity Detection (VAD) is mandatory:** raw Whisper famously hallucinates repeated phrases ("Thank you for watching", subtitles) during silent stretches. Always run Silero VAD or WebRTC VAD ahead of inference.
- **GPU utilization vs latency:** batching long recordings maximizes GPU utilization for archive jobs, whereas realtime streaming requires dedicated capacity that sits idle during off-peak hours.
- **Diarization is a separate pipeline:** Whisper does not identify speakers natively; you will need a companion model (such as pyannote) and alignment logic if you need speaker labels.

## How to actually choose

Choosing a transcription engine is the beginning of a caption workflow. After generating a track, [review AI captions against the recording](/guides/voice/review-ai-captions-before-publishing) to check words, speaker changes, meaningful sounds and timing in the final media cut; a parser alone cannot settle those questions.

Three checks beat any leaderboard. **WER on your audio**: fifty representative clips — your accents, your jargon, your phone-line quality — through each candidate; the published-benchmark winner loses on somebody's domain every week. **Latency where it counts**: for agents, measure streaming time-to-first-token and endpointing behavior from your region, p95 not median. **The billing fine print**: AssemblyAI streams bill by *session* time (idle sockets cost), Whisper bills in GPU-hours and engineering, add-ons stack per hour everywhere. The output half of the conversation is [Best TTS APIs](/guides/voice/best-tts-apis-2026); the architecture that consumes both is [Realtime Voice Agents](/guides/voice/realtime-voice-apis).
