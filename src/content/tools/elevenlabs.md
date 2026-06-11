---
name: "ElevenLabs"
title: "ElevenLabs"
description: "A voice-AI platform for high-quality text-to-speech, voice cloning, dubbing, and real-time conversational agents, via API."
url: "https://elevenlabs.io"
date: 2026-06-04
pricing: "freemium"
category: "platform"
sameAs: ["https://elevenlabs.io/docs"]
color: "pink"
os: ["Web"]
topics: ["mlops-ai-infra"]
tags: ["text-to-speech", "voice", "tts", "conversational-ai", "api"]
featured: false
alternativeTo: ["deepgram"]
summary: "ElevenLabs is a voice-AI platform best known for state-of-the-art text-to-speech: natural, expressive voices in many languages, plus voice cloning, dubbing, sound effects, and a speech-to-text model. It also offers conversational AI agents, and everything is available via API under one credit-based plan — a common choice for the TTS (or the whole voice) stage of a voice agent."
related: ["build-a-voice-agent", "deepgram", "pipecat", "voice-agent-engineer"]
faq:
  - q: "What is ElevenLabs?"
    a: "ElevenLabs is a voice-AI platform best known for state-of-the-art text-to-speech: natural, expressive voices in 70+ languages, with low-latency Flash and Turbo models built for real-time use. Around that core it offers voice cloning, dubbing, sound effects, music, a speech-to-text model (Scribe), and conversational AI agents — all accessible via API under one credit system."
  - q: "How much does ElevenLabs cost?"
    a: "ElevenLabs is freemium: a free tier (with attribution and limited credits) and paid Creator, Pro, Scale, and Enterprise tiers priced in credits, where credits map to characters of TTS, minutes of speech-to-text, and minutes of agent conversation."
  - q: "ElevenLabs vs Deepgram?"
    a: "In a voice-agent pipeline, ElevenLabs is most often the TTS stage — the voice your agent speaks with — while Deepgram is the usual comparison for the speech-to-text side. ElevenLabs' bundled conversational-agent product can also cover the whole STT, LLM, and TTS loop when you want the simplest path."
---

ElevenLabs is a voice-AI platform whose core strength is **text-to-speech** — among the most natural and expressive synthetic voices available, across many languages, with low-latency models (Flash, Turbo) built for real-time use. Around that it has grown a full voice suite: voice cloning, dubbing, sound effects, music, a speech-to-text model (Scribe), and **conversational AI agents** — all accessible via API and billed under one credit system.

For building a [voice agent](/guides/voice/build-a-voice-agent), it's most often the **TTS** stage — the voice your agent speaks with — though its bundled conversational-agent product can cover the whole STT → LLM → TTS loop when you want the simplest path.

## Highlights

- **State-of-the-art TTS** — natural, expressive voices in 70+ languages, with low-latency Flash/Turbo models for real-time agents.
- **Voice cloning** — instant clones from a short sample, or high-fidelity professional voice cloning.
- **Conversational AI agents** — build real-time voice agents with built-in STT, LLM, and TTS.
- **Dubbing, sound effects & music** — translate and re-voice audio/video, generate effects and music.
- **One API, one credit system** — TTS billed per character; speech-to-text per minute; agents per minute.

## In an AI-assisted workflow

```python
# stream TTS audio so playback can start before the full reply is generated
from elevenlabs.client import ElevenLabs
client = ElevenLabs()  # reads ELEVENLABS_API_KEY
audio = client.text_to_speech.stream(voice_id="...", model_id="eleven_flash_v2_5", text=reply)
```

> [!TIP]
> For voice agents, latency beats fidelity: prefer the low-latency models (Flash/Turbo) and stream the audio so it begins playing as the LLM's tokens arrive — time-to-first-byte is what users feel.

## Good to know

ElevenLabs is a commercial platform with a **freemium** plan: a free tier (with attribution and limited credits) and paid tiers (Creator, Pro, Scale, Enterprise) priced in credits, where credits map to characters of TTS, minutes of speech-to-text, and minutes of agent conversation. It's a hosted API — your text/audio passes through it — so factor in availability and data handling. For the speech-to-text side of a voice agent, compare [Deepgram](/tools/deepgram); to orchestrate a custom pipeline, [Pipecat](/tools/pipecat).
