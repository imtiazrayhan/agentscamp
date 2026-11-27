---
name: "ElevenLabs"
title: "ElevenLabs"
description: "A voice AI platform for text-to-speech (Eleven v4), voice cloning, Scribe speech-to-text, dubbing, music, and real-time conversational agents, via API."
url: "https://elevenlabs.io"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "freemium"
category: "voice"
sameAs: ["https://elevenlabs.io/docs"]
color: "pink"
os: ["Web"]
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["text-to-speech", "voice", "tts", "conversational-ai", "api"]
featured: false
alternativeTo: ["cartesia", "deepgram"]
summary: "ElevenLabs is a voice AI platform best known for text-to-speech. Eleven v4 and v4 Turbo are its current flagship voices in 90+ languages, with Flash v2.5 as the cheap low-latency option. It also sells Scribe speech-to-text, voice cloning, dubbing, music, and ElevenAgents for conversational agents. The API is billed per unit; app plans use credits."
related: ["guide:build-a-voice-agent", "guide:best-tts-apis-2026", "tool:cartesia", "tool:deepgram", "tool:pipecat", "agent:voice-agent-engineer"]
faq:
  - q: "How much does the ElevenLabs API cost?"
    a: "As of November 2026, elevenlabs.io/pricing/api lists text-to-speech at $0.08 per 1,000 characters for Eleven v4, v3 and Multilingual v2, and $0.04 per 1,000 characters for v4 Turbo, v3 Conversational and Flash. On the same page as of November 2026, Scribe v3 speech-to-text is $0.20 per hour ($0.22 for Scribe v3 Live), and the agent Speech Engine is $0.08 per minute. Prices exclude taxes."
  - q: "Which ElevenLabs model should I use for a voice agent?"
    a: "ElevenLabs' model guide recommends eleven_v4_turbo for real-time conversation, with a median model latency of about 100 ms, and lists eleven_flash_v2_5 as the lower-cost alternative across 32 languages. Use eleven_v4 or eleven_multilingual_v2 for narration and long-form audio where latency matters less."
  - q: "Are the Turbo v2.5 models still available?"
    a: "They work but are listed as deprecated. The docs describe eleven_turbo_v2_5 and eleven_turbo_v2 as first-generation low-latency models outclassed by Flash, and functionally equivalent to eleven_flash_v2_5 and eleven_flash_v2 apart from higher latency. New code should use Flash v2.5 or v4 Turbo."
  - q: "Is there a free ElevenLabs plan?"
    a: "Yes. As of November 2026 the Free plan is $0 with 10,000 credits a month, where text-to-speech uses 1 credit per character. The commercial license and instant voice cloning are listed from the Starter plan up, so the free plan is for evaluation and personal use."
audience: ["ai-engineers", "marketers"]
---

ElevenLabs is a voice AI platform whose core strength is **[text-to-speech](/glossary/text-to-speech)**. Its current flagship models are **Eleven v4** and **v4 Turbo**, both in 90+ languages, with the older Flash v2.5 kept as the low-cost, low-latency choice. Around that it has built a full audio suite: voice cloning, Scribe speech-to-text, dubbing, music, sound effects, a voice changer, and **ElevenAgents** for real-time conversational agents.

For a [voice agent](/guides/voice/build-a-voice-agent), it is most often the TTS stage, the voice your agent speaks with. ElevenAgents can also run the whole loop when you want one vendor.

## Highlights

- **Eleven v4** (`eleven_v4`). The most expressive model, with audio tags for fine control, multi-speaker dialogue, and a 100,000-character request limit.
- **Eleven v4 Turbo** (`eleven_v4_turbo`). The real-time version, which ElevenLabs recommends for agents; the docs give a median model latency of about 100 ms, excluding network time.
- **Flash v2.5** (`eleven_flash_v2_5`). The cheaper low-latency model in 32 languages, with a 40,000-character limit.
- **Scribe v3 and Scribe v3 Live.** Speech-to-text for recorded and streaming audio in 90+ languages, with diarization for up to 32 speakers, keyterm prompting and entity detection.
- **[Voice cloning](/glossary/voice-cloning).** Instant clones from a short sample, and professional voice cloning on the Creator plan and above.
- **ElevenAgents.** Conversational agents with telephony, tools and workflows. Two speech-to-speech configurations, Realtime v1 Mini and Max, bundle recognition, turn-taking, an LLM and a voice, and are also exposed through an OpenAI Realtime-compatible API.
- **Creative tools.** Dubbing, Eleven Music, sound effects, Voice Isolator and Voice Changer, in the app and the API.

## In an AI-assisted workflow

Install the SDK with `pip install elevenlabs` (or `npm install @elevenlabs/elevenlabs-js`) and set `ELEVENLABS_API_KEY`. Streaming lets playback start before the full reply has been synthesized:

```python
from elevenlabs.client import ElevenLabs

elevenlabs = ElevenLabs()  # reads ELEVENLABS_API_KEY

audio_stream = elevenlabs.text_to_speech.stream(
    text="Your order shipped this morning and should arrive on Thursday.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",  # "George"; browse others in the voice library
    model_id="eleven_v4_turbo",
)

with open("reply.mp3", "wb") as f:
    for chunk in audio_stream:
        if isinstance(chunk, bytes):
            f.write(chunk)
```

Use `text_to_speech.convert(...)` with `model_id="eleven_v4"` when you want a finished file for narration instead.

> [!TIP]
> In a voice agent, time to first audio matters more than maximum fidelity. Pick a real-time model (`eleven_v4_turbo` or `eleven_flash_v2_5`), stream the audio, and send text to the TTS as the LLM produces it instead of waiting for the whole reply.

## Pricing

ElevenLabs prices the API per unit and the app by subscription credits. As of November 2026, elevenlabs.io/pricing/api lists:

| API product | Rate |
| --- | --- |
| Eleven v4, v3, Multilingual v2 | $0.08 per 1,000 characters |
| Eleven v4 Turbo, v3 Conversational, Flash | $0.04 per 1,000 characters |
| Scribe v3 / Scribe v2 | $0.20 per hour |
| Scribe v3 Live / Scribe v2 Realtime | $0.22 per hour |
| Speech Engine (agents) | $0.08 per minute |
| Realtime v1 Mini / Max (speech to speech) | $0.08 per minute plus LLM usage |

Subscription plans, as of November 2026 at regular monthly prices: Free is $0 with 10,000 credits a month, Starter is $6 with 30,000, Creator is $22 with 121,000, Pro is $99 with 600,000, Scale is $299 with 1.8M credits and 3 seats, Business is $990 with 6M credits and 10 seats, and Enterprise is custom. Text-to-speech uses 1 credit per character and speech-to-text uses 330 credits per minute. The pricing page was showing temporary Black Friday discounts when checked on November 27, 2026, which are not reflected in these figures; see [AI video and voice Black Friday deals](/guides/deals/ai-video-voice-black-friday-deals) for the seasonal offers.

## Good to know

- **Commercial use starts at Starter.** The commercial license is listed from the Starter plan, not Free.
- **Character limits differ by model.** 100,000 characters per request on v4, 40,000 on Flash v2.5, and only 5,000 on v3, so long-form jobs on v3 need chunking.
- **Deprecations.** `eleven_turbo_v2_5` and `eleven_turbo_v2` are listed as deprecated in favor of Flash, and `eleven_text_to_sound_v2` will be removed on March 1, 2027.
- **Hosted API.** Your text and audio pass through ElevenLabs. BAAs for HIPAA customers and custom data-processing terms are Enterprise features.
- **Latency numbers are medians from the vendor** and exclude your application and network time.

Compared with the alternatives: [Cartesia](/tools/cartesia) is the narrower, latency-first rival, with Sonic 3.6 TTS, Ink speech-to-text and little else. [Deepgram](/tools/deepgram) is best known for speech-to-text and sells Flux TTS and Aura-2 per character alongside it. To mix ElevenLabs voices with another vendor's STT and your own LLM, orchestrate the pipeline with [Pipecat](/tools/pipecat). The TTS field is compared in [Best TTS APIs](/guides/voice/best-tts-apis-2026).
