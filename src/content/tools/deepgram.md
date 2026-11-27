---
name: "Deepgram"
title: "Deepgram"
description: "Voice AI platform: Nova-3 and Flux speech-to-text, Flux TTS and Aura-2 text-to-speech, and a bundled Voice Agent API, billed by usage with a free credit."
url: "https://deepgram.com"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "freemium"
category: "voice"
sameAs: ["https://developers.deepgram.com"]
color: "green"
os: ["Web"]
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["speech-to-text", "text-to-speech", "voice", "stt", "api"]
featured: false
alternativeTo: ["assemblyai", "whisper", "elevenlabs", "cartesia"]
summary: "Deepgram is a hosted voice AI platform. Nova-3 is its general speech-to-text model for batch and streaming audio, and Flux STT is a streaming model with built-in turn detection for voice agents. Flux TTS and Aura-2 cover text-to-speech, and a Voice Agent API bundles STT, an LLM and TTS at one per-minute rate. New accounts start with a free usage credit."
related: ["guide:build-a-voice-agent", "guide:best-stt-apis-2026", "tool:assemblyai", "tool:whisper", "tool:elevenlabs", "tool:pipecat", "agent:voice-agent-engineer"]
faq:
  - q: "How much does Deepgram cost?"
    a: "As of November 2026, Deepgram's pricing page lists pay-as-you-go streaming speech-to-text at $0.0048 per minute for Nova-3 monolingual and $0.0065 per minute for Flux STT English, both marked as promotional rates, with Aura-2 text-to-speech at $0.030 per 1,000 characters and the standard Voice Agent API at $0.075 per minute. New accounts get a free credit with no card and no expiry; the amount is in the pricing section below."
  - q: "What is the difference between Flux STT and Nova-3?"
    a: "Flux STT is streaming-only and built for voice agents: it emits start-of-turn, end-of-turn and eager end-of-turn events from the model itself, runs on the /v2/listen endpoint, and covers English plus a 10-language multilingual model. Nova-3 is the general model on /v1/listen for meetings, captions, call analytics and pre-recorded audio, with far more languages but no turn detection."
  - q: "Can Deepgram be self-hosted?"
    a: "Yes, on the Enterprise plan. Deepgram's pricing FAQ says self-hosted containers run in your own VPC or on-premises hardware and require NVIDIA GPUs. For hosted use with EU data residency there is a dedicated endpoint, api.eu.deepgram.com."
  - q: "Deepgram vs AssemblyAI vs Whisper?"
    a: "Deepgram and AssemblyAI are hosted rivals with similar scope: a general STT model, an agent-tuned streaming model, TTS and a voice agent API. Deepgram bills per minute and offers self-hosting on Enterprise; AssemblyAI bills per hour of audio or session. Whisper is the open-weights option you run yourself, with no native streaming or diarization."
---

Deepgram is a hosted voice AI platform that started with **speech-to-text** and now covers the whole voice loop. It has two current STT models: **Nova-3** for general transcription in batch or streaming, and **Flux STT**, a streaming model with turn detection built into the model for voice agents. On the output side it offers **Flux TTS** and **Aura-2**, and a **Voice Agent API** wires STT, an LLM and TTS into one WebSocket.

For a [voice agent](/guides/voice/build-a-voice-agent), Deepgram is most often the STT stage, and its bundled agent API is an option when you want one vendor for the entire pipeline.

## Highlights

- **Nova-3** (`nova-3`). General-purpose STT on `/v1/listen` for pre-recorded and live audio, with speaker diarization, smart formatting, keyterm prompting, redaction, and a multilingual mode (`language=multi`) for code-switched speech. `nova-3-medical` and `nova-3-pharma` are domain variants.
- **Flux STT** (`flux-general-en`, `flux-general-multi`). Streaming STT on `/v2/listen` that reports `EndOfTurn` and `EagerEndOfTurn` events itself, so you do not bolt on a separate voice-activity detector. The multilingual model covers English, Spanish, French, German, Hindi, Russian, Portuguese, Japanese, Italian and Dutch.
- **Flux TTS.** Deepgram's recommended text-to-speech model, served on `/v2/speak` over WebSocket or REST. On barge-in, its `Interrupt` message reports the text the user actually heard.
- **Aura-2.** The previous-generation TTS on `/v1/speak`, with voices in seven languages and a lower price.
- **Voice Agent API.** One connection for listening, thinking and speaking, with tiers for bringing your own LLM or TTS.
- **Audio intelligence.** Summarization, topic detection, sentiment and intent recognition, billed per token on top of transcription.
- **Nova-2** remains for languages Nova-3 does not cover yet and for filler-word detection.

## In an AI-assisted workflow

Transcribe a file with one request:

```bash
curl --request POST \
  --header "Authorization: Token $DEEPGRAM_API_KEY" \
  --header "Content-Type: audio/wav" \
  --data-binary @call.wav \
  --url "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true"
```

For a voice agent, stream to Flux with the Python SDK (`pip install deepgram-sdk`). This is cut down from Deepgram's Flux quickstart; it reads 16 kHz, 16-bit mono PCM from a file in 80 ms chunks, the chunk size the docs recommend:

```python
import asyncio
from deepgram import AsyncDeepgramClient
from deepgram.core.events import EventType

async def main():
    client = AsyncDeepgramClient()  # reads DEEPGRAM_API_KEY
    async with client.listen.v2.connect(
        model="flux-general-en", encoding="linear16", sample_rate="16000"
    ) as connection:
        def on_message(message):
            if getattr(message, "transcript", None):
                print(message.transcript)

        connection.on(EventType.MESSAGE, on_message)
        listener = asyncio.create_task(connection.start_listening())

        with open("caller.pcm", "rb") as audio:
            while chunk := audio.read(2560):  # 80 ms at 16 kHz linear16
                await connection._send(chunk)
                await asyncio.sleep(0.08)

        await asyncio.wait_for(listener, timeout=10)

asyncio.run(main())
```

Transcripts arrive as `TurnInfo` messages. Act on the `EndOfTurn` event to hand the transcript to your LLM. If you set `eager_eot_threshold`, Flux also sends `EagerEndOfTurn`, so you can start the LLM call early, and `TurnResumed` when the speaker carries on and the draft should be cancelled. Deepgram's docs warn that this speculative mode can raise LLM calls by 50 to 70%.

> [!TIP]
> The default `eot_threshold` of 0.7 suits most agents. Raise it if the agent cuts people off, and lower `eot_timeout_ms` (default 5,000) if it waits too long after trailing silence.

## Pricing

As of November 2026, Deepgram's pricing page lists three plans: Pay as you go, with a $200 free credit that needs no card and does not expire; Growth, from $4,000 a year in prepaid credits for up to 20% off; and Enterprise, with custom pricing. Pay-as-you-go rates as of November 2026:

| Product | Rate |
| --- | --- |
| Nova-3 monolingual, streaming | $0.0048 per minute (promotional; was $0.0077) |
| Nova-3 multilingual, streaming | $0.0058 per minute (promotional; was $0.0092) |
| Flux STT English | $0.0065 per minute (promotional; was $0.0077) |
| Flux STT Multilingual | $0.0078 per minute |
| Flux TTS | $0.045 per 1,000 characters |
| Aura-2 | $0.030 per 1,000 characters |
| Voice Agent API, standard | $0.075 per minute |
| Voice Agent API, your own LLM and TTS | $0.050 per minute |

Speech-to-text is billed per second with no rounding up, and multichannel audio is billed for the total duration across channels. As of November 2026, streaming add-ons cost extra: $0.0020 per minute each for redaction and speaker diarization, and $0.0013 per minute for keyterm prompting; smart formatting is included. The Voice Agent API is billed on WebSocket connection time. Pay as you go allows 150 concurrent streaming STT connections.

## Good to know

- **Two endpoints, two behaviors.** Flux needs `/v2/listen`; pointing it at `/v1/listen` fails. Flux does not handle pre-recorded audio, meeting transcription or call analytics, so most teams end up using both models.
- **Promotional rates move.** Several STT prices above are marked as promotions on the pricing page. Model your costs on the struck-through rates if you need a conservative number.
- **Hosted by default.** Audio passes through Deepgram unless you buy the Enterprise self-hosted option. Deepgram lists SOC 2 Type 2, GDPR with an EU endpoint, and HIPAA with a BAA for Enterprise customers.
- **Vendor benchmarks.** Accuracy claims in the docs compare Deepgram against unnamed competitors. Test with your own audio.

Compared with the alternatives: [AssemblyAI](/tools/assemblyai) is the nearest hosted competitor, with its STT-3.7 models for recorded, live and agent audio and a larger set of understanding add-ons. [Whisper](/tools/whisper) is free and runs on your own hardware, but has no native streaming, turn detection or diarization. For text-to-speech, compare [ElevenLabs](/tools/elevenlabs), which has the broader audio product range, and [Cartesia](/tools/cartesia), which competes on latency. To combine vendors in one agent, use [Pipecat](/tools/pipecat) or LiveKit Agents; the STT field is compared in [Best Speech-to-Text APIs in 2026](/guides/voice/best-stt-apis-2026).
