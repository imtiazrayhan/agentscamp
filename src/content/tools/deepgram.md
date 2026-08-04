---
name: "Deepgram"
title: "Deepgram"
description: "A voice-AI platform with fast, accurate speech-to-text (Nova) and low-latency text-to-speech (Aura), plus a bundled Voice Agent API."
url: "https://deepgram.com"
date: 2026-06-04
pricing: "freemium"
category: "voice"
sameAs: ["https://developers.deepgram.com"]
color: "green"
os: ["Web"]
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["speech-to-text", "text-to-speech", "voice", "stt", "api"]
featured: false
alternativeTo: ["elevenlabs"]
summary: "Deepgram is a voice-AI platform centered on fast, accurate speech-to-text (its Nova models, with streaming, diarization, and 45+ languages) and low-latency text-to-speech (Aura). It also offers a bundled Voice Agent API that combines STT, an LLM, and TTS. It's a common choice for the transcription stage of a voice agent, and a single-vendor option for the whole loop."
related: ["guide:build-a-voice-agent", "tool:elevenlabs", "tool:pipecat", "agent:voice-agent-engineer"]
faq:
  - q: "What is Deepgram?"
    a: "Deepgram is a voice-AI platform centered on speech-to-text: its Nova models offer fast, accurate streaming transcription across 45+ languages with speaker diarization, smart formatting, and keyterm prompting. It pairs that with Aura, a text-to-speech engine tuned for very low time-to-first-byte, and a Voice Agent API that wires STT, an LLM, and TTS into one real-time endpoint."
  - q: "How much does Deepgram cost?"
    a: "Deepgram is freemium: free credits to start, then usage-based pay-as-you-go — STT billed per minute, Aura TTS per character, and the Voice Agent API per hour — plus enterprise plans."
  - q: "Deepgram vs ElevenLabs?"
    a: "In a voice-agent pipeline, Deepgram is most often the speech-to-text stage, while ElevenLabs is the usual comparison for the text-to-speech side. Both also offer a bundled path for the whole STT, LLM, and TTS loop; to compose a custom pipeline across vendors, Pipecat is the orchestration option."
---

Deepgram is a voice-AI platform whose core strength is **speech-to-text** — its Nova models offer fast, accurate streaming transcription across 45+ languages, with speaker diarization, smart formatting, and keyterm prompting. It pairs that with **text-to-speech** (Aura, tuned for very low time-to-first-byte) and a bundled **Voice Agent API** that wires STT, an LLM, and TTS into one real-time endpoint.

For building a [voice agent](/guides/voice/build-a-voice-agent), Deepgram is most often the **STT** stage — turning the user's speech into text with the low latency the loop demands — and increasingly a single-vendor option for the entire pipeline via its Voice Agent API.

## Highlights

- **Streaming speech-to-text (Nova)** — low-latency, accurate transcription with interim results, diarization, and 45+ languages.
- **Low-latency text-to-speech (Aura)** — sub-200ms time-to-first-byte voices built for real-time agents.
- **Voice Agent API** — a bundled STT + LLM + TTS endpoint for building voice agents fast.
- **Real-time features** — voice-activity detection, endpointing, smart formatting, and keyterm prompting.
- **Usage-based API** — STT billed per minute, TTS per character, the agent API per hour.

## In an AI-assisted workflow

```python
# stream microphone audio to Nova and consume interim transcripts for low-latency endpointing
from deepgram import DeepgramClient
dg = DeepgramClient()  # reads DEEPGRAM_API_KEY
# open a streaming connection, send audio chunks, receive partial + final transcripts
```

> [!TIP]
> For voice agents, lean on interim transcripts and tuned endpointing rather than waiting for a final transcript — reacting early to "the user has stopped" is what keeps the round trip conversational.

## Good to know

Deepgram is a commercial platform with a **freemium** model: free credits to start, then usage-based pay-as-you-go (STT per minute, Aura TTS per character, the Voice Agent API per hour) plus enterprise plans. It's a hosted API, so factor in availability and that audio passes through it. For the text-to-speech side, compare [ElevenLabs](/tools/elevenlabs); to compose a custom STT → LLM → TTS pipeline, see [Pipecat](/tools/pipecat).
