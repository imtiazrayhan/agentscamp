---
title: "How to Build a Voice Agent: The STT → LLM → TTS Pipeline"
description: "How to build a real-time voice agent: the STT → LLM → TTS pipeline, the latency budget that makes or breaks it, and how to wire each stage."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["mlops-ai-infra", "llm-app-dev"]
tags: ["voice", "speech-to-text", "text-to-speech", "real-time", "agents"]
featured: false
summary: "A voice agent is a real-time loop: speech-to-text transcribes the user, an LLM picks the reply, and text-to-speech speaks it back. What separates a usable agent from a frustrating one is the latency budget — every stage adds delay, and the round trip must feel conversational. This guide covers the pipeline, the providers per stage, turn-taking, and engineering the latency."
keyTakeaways:
  - "A voice agent is a real-time STT → LLM → TTS loop: transcribe speech, reason over the text, speak the reply — usually wired together by an orchestration framework."
  - "Latency is the product. Each stage adds delay; the felt round trip must be conversational (roughly sub-second to first audio) or users talk over it and give up."
  - "Stream everything — partial transcripts, streamed LLM tokens, and streaming TTS — so audio starts before the full reply is generated; never let one stage fully finish before the next begins."
  - "Turn-taking is the hard part: voice-activity detection, endpointing, and barge-in (letting the user interrupt) matter as much as model quality."
  - "Use specialized providers per stage — e.g. Deepgram for STT, an LLM via your gateway, ElevenLabs or Deepgram Aura for TTS — and a framework like Pipecat to orchestrate the real-time pipeline."
howtoSteps:
  - name: "Capture and transcribe the user (STT)"
    text: "Stream microphone audio to a streaming speech-to-text service (e.g. Deepgram). Use interim/partial transcripts so you can react early, and voice-activity detection plus endpointing to decide when the user has actually finished speaking — getting endpointing right is half the battle."
  - name: "Decide the reply (LLM)"
    text: "Send the finalized transcript to an LLM and stream the tokens back. Keep the prompt and context tight — every input token is latency here — and route the call through your gateway so you can right-size the model and add fallback. This is the text middle of the loop."
  - name: "Speak the reply (TTS)"
    text: "Feed the streaming LLM tokens into a streaming text-to-speech service (e.g. ElevenLabs or Deepgram Aura) so audio begins playing before the full reply is generated. Time-to-first-byte of the TTS dominates perceived responsiveness, so prefer low-latency voices/models."
  - name: "Orchestrate the pipeline"
    text: "Use a real-time framework like Pipecat to manage the pipeline, the audio transport (WebRTC/WebSocket), and the streaming hand-offs between STT, LLM, and TTS. Building this plumbing by hand is where most projects stall; a framework gives you the composable loop and the integrations."
  - name: "Handle turn-taking and interruptions"
    text: "Implement barge-in: when the user starts talking, stop the TTS playback and the in-flight LLM call immediately. Tune VAD and endpointing so the agent doesn't cut users off or sit awkwardly silent. Natural turn-taking is what makes an agent feel human, not the voice quality alone."
  - name: "Budget and measure latency end to end"
    text: "Measure mouth-to-ear latency (user stops speaking → first audio of the reply) and per-stage time-to-first-byte. Target a conversational round trip, then optimize the slowest stage — streaming, a faster TTS voice, a smaller model, or co-located services usually move it most."
faq:
  - q: "How does a voice agent work?"
    a: "A voice agent runs a real-time loop with three stages. First, speech-to-text (STT) transcribes the user's spoken audio into text, ideally streaming partial results as they speak. Second, an LLM takes that transcript (plus conversation history) and generates a reply, streamed token by token. Third, text-to-speech (TTS) converts the reply into audio and plays it back. A framework usually orchestrates these stages and the audio transport, and the whole loop has to complete fast enough to feel like a conversation rather than a walkie-talkie exchange."
  - q: "What's the hardest part of building a voice agent?"
    a: "Latency and turn-taking, not model quality. Each stage (STT, LLM, TTS) adds delay, and if the total mouth-to-ear time is too long the conversation feels broken — users interrupt, repeat themselves, or give up. On top of that, the agent has to know when the user has finished speaking (endpointing), detect speech (VAD), and let the user interrupt it mid-reply (barge-in). Getting that interaction model right is harder than picking a good LLM, and it's why teams reach for a framework that handles the real-time streaming and turn-taking for them."
  - q: "What latency do I need for a natural voice agent?"
    a: "As a rule of thumb, aim for the agent to start replying within roughly a second of the user finishing. Natural conversation has gaps of only a couple hundred milliseconds, and once the silence stretches much past a second the exchange starts to feel broken — people repeat themselves, interrupt, or give up. That budget has to cover endpointing (deciding the user stopped), the LLM's time-to-first-token, and the TTS's time-to-first-byte combined. The main levers are streaming every stage (so audio starts before the reply is complete), using low-latency STT/TTS models, keeping the LLM prompt small and the model right-sized, and minimizing network hops between services."
  - q: "Should I use one provider or separate STT/LLM/TTS providers?"
    a: "Both work. Single-vendor voice-agent APIs (Deepgram's Voice Agent API, ElevenLabs' conversational agents, and others) bundle the stages for the simplest setup and tightly-tuned latency. Composing best-of-breed providers per stage — for example a specialized STT, your own choice of LLM via a gateway, and a premium TTS voice — gives you more control over quality, cost, and model choice at the price of orchestrating the pipeline yourself (which is exactly what a framework like Pipecat is for). Start bundled to validate the experience, then unbundle the stage that's holding you back."
  - q: "Do I need a framework like Pipecat?"
    a: "Not strictly, but it saves enormous effort. The hard parts of a voice agent — real-time audio transport, streaming hand-offs between STT/LLM/TTS, turn-taking, and barge-in — are generic plumbing you'd otherwise build and debug yourself. An open-source framework like Pipecat provides that composable real-time pipeline plus integrations with dozens of STT/LLM/TTS providers, so you focus on the agent's behavior instead of the streaming infrastructure. For a quick prototype against a single bundled provider you can skip it; for anything custom or production-grade it's usually worth it."
related: ["voice-agent-engineer", "pipecat", "deepgram", "elevenlabs", "calling-any-model-gateways", "llm-cost-latency-engineering", "self-host-vs-api-llm"]
---

A voice agent sounds simple — the user talks, the agent talks back — but under the hood it's a **real-time pipeline** with three stages and an unforgiving latency budget. Speech-to-text turns the user's audio into text, an LLM decides the reply, and text-to-speech speaks it. Get the architecture right and it feels like a conversation; get the latency wrong and it feels like a bad phone call. This guide walks the pipeline and the engineering that actually makes it work.

## The pipeline: STT → LLM → TTS

Three stages, in a loop, ideally all streaming:

- **Speech-to-text (STT)** — transcribe the incoming audio, streaming partial results. A specialized provider like [Deepgram](/tools/deepgram) gives you low-latency streaming transcription with voice-activity detection and endpointing.
- **LLM** — take the transcript (plus history) and generate the reply, streamed token by token. This is an ordinary LLM call — route it through your gateway so you can right-size the model and add fallback (see [Calling Any Model](/guides/concepts/calling-any-model-gateways)).
- **Text-to-speech (TTS)** — turn the reply into audio as the tokens arrive, so playback starts before the reply is finished. [ElevenLabs](/tools/elevenlabs) and Deepgram's Aura are common choices.

The non-negotiable principle: **stream everything**. If you wait for STT to fully finish before calling the LLM, then wait for the whole LLM reply before starting TTS, the delays stack into something unusable. Overlap the stages.

## Latency is the product

> [!WARNING]
> The single biggest determinant of whether a voice agent feels good is **mouth-to-ear latency** — the time from the user finishing to the first audio of the reply. Natural conversation has gaps of only a couple hundred milliseconds, so a round trip much past a second starts to feel broken — and that budget has to cover endpointing, the LLM's time-to-first-token, and the TTS's time-to-first-byte *combined*. Optimize the round trip, not any single stage in isolation.

The levers, in rough order of impact: stream every stage; use low-latency STT/TTS models; keep the LLM prompt tight and the model right-sized (the [llm-cost-latency-engineering](/guides/advanced/llm-cost-latency-engineering) playbook applies directly); and minimize network hops between services.

## Turn-taking: the part everyone underestimates

A natural conversation isn't just fast — it has rhythm. Three mechanics matter as much as model quality:

- **Voice-activity detection (VAD)** — knowing when the user is speaking versus silent.
- **Endpointing** — deciding the user has actually *finished*, not just paused. Too eager and you cut them off; too patient and the agent feels slow.
- **Barge-in** — when the user starts talking while the agent is speaking, immediately stop the TTS and the in-flight LLM call. Without barge-in, the agent steamrolls the user and the illusion breaks.

## Orchestrate it with a framework

Building real-time audio transport, streaming hand-offs, and turn-taking by hand is where most voice projects stall. An open-source framework like [Pipecat](/tools/pipecat) gives you the composable STT → LLM → TTS pipeline, WebRTC/WebSocket transports, and integrations with dozens of providers — so you build the agent's behavior, not the plumbing. You can prototype against a single bundled voice-agent API first, then unbundle the stage that's limiting you.

## Putting it together

Stream STT with good endpointing → stream the LLM through your gateway → stream TTS so audio starts early → orchestrate with a framework → add barge-in and tune turn-taking → budget and measure mouth-to-ear latency, then fix the slowest stage. The [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) builds and tunes this loop end-to-end. For the model side — whether to call a hosted API or self-host — see [Self-Host vs API](/guides/mlops/self-host-vs-api-llm).
