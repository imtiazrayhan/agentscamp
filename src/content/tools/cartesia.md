---
name: "Cartesia"
description: "Real-time voice AI: Sonic 3.6 streaming text-to-speech in 44 languages, Ink 2 speech-to-text with built-in turn detection, and hosted Managed Agents."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.cartesia.ai"
pricing: "freemium"
category: "voice"
os: ["Web"]
color: "purple"
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["tts", "stt", "voice", "realtime", "voice-agents"]
featured: false
alternativeTo: ["elevenlabs", "deepgram", "vapi"]
sameAs:
  - "https://github.com/cartesia-ai"
  - "https://x.com/cartesia"
  - "https://www.linkedin.com/company/cartesia-ai/"
related: ["guide:best-tts-apis-2026", "guide:best-stt-apis-2026", "guide:realtime-voice-apis", "tool:elevenlabs", "tool:deepgram", "guide:build-a-voice-agent"]
summary: "Cartesia builds real-time voice models. Sonic 3.6 is streaming text-to-speech in 44 languages, Ink 2 is streaming speech-to-text with built-in turn detection, and Managed Agents hosts whole voice agents billed per minute. The free plan is non-commercial; a commercial license starts on Pro. Hosting for older Line SDK agents ends January 1, 2027."
faq:
  - q: "How much does Cartesia cost?"
    a: "As of November 2026, cartesia.ai/pricing lists Free at $0 with 20K credits a month, Pro at $5 with 100K credits, Startup at $49 with 1.25M credits, Scale at $299 with 8M credits, and custom Enterprise pricing. Sonic uses about 1 credit per character and Ink 2 uses 3 credits per second of audio. Managed Agents are billed separately, as of November 2026 at $0.03 per minute plus $0.014 per minute on a Cartesia-provided phone number, not counting LLM usage."
  - q: "Can I use Cartesia's free plan commercially?"
    a: "No. The pricing page lists the commercial use license as a Pro feature, so anything you ship to customers needs at least the $5 Pro plan as of November 2026. Professional voice cloning starts on Startup, with 2 clone slots there and 4 on Scale."
  - q: "What happened to Cartesia Line?"
    a: "The code-first Line SDK has been replaced by Managed Agents, which you configure in the Playground or through the API instead of deploying Python. Cartesia's migration guide says it stops hosting Line SDK agents on January 1, 2027; agents built in the Playground without custom code were migrated automatically."
  - q: "What makes Cartesia different from ElevenLabs?"
    a: "Focus. Cartesia sells a small set of models built for live conversation: one TTS family, one STT family, and an agent host. ElevenLabs has a much wider catalog that also covers dubbing, music, sound effects and long-form narration. Pick Cartesia when time to first audio in an agent matters most, and ElevenLabs when you need range across audio tasks."
---

Cartesia is an AI lab that builds real-time voice models, founded by researchers behind the state-space model line of work. Its product is deliberately narrow: **Sonic** for text-to-speech, **Ink** for speech-to-text, and **Managed Agents** to run both inside a hosted voice agent. Everything is tuned for live conversation, where the delay before the first audio decides how natural an agent feels.

## Highlights

- **Sonic 3.6** (`sonic-3.6`). Streaming text-to-speech with native support for 44 languages; Cartesia says it streams the first byte of audio in about 90 ms. The current stable snapshot is `sonic-3.6-2026-08-27`. It varies pacing and intonation from the transcript alone and reads confirmation codes and heteronyms without preprocessing.
- **Ink 2** (`ink-2`). Streaming speech-to-text released October 13, 2026 for English, French, Hindi, Japanese and Spanish. Turn detection is built in: the model sends `turn.start`, `turn.update`, `turn.eager_end`, `turn.resume` and `turn.end` events, so you do not run a separate voice-activity detector.
- **`ink-preview`.** A 44-language STT model with word timestamps, language detection and up to 500 keyterms, in preview as of November 2026.
- **Managed Agents.** Hosted voice agents that handle listening, turn-taking, interruptions, tool calls and knowledge retrieval around the LLM you choose. Build one in the Playground or through the API, then connect it over WebSocket or a phone number.
- **Voice cloning.** Instant cloning, plus professional voice clones on the Startup plan and above; training a professional clone is free and its speech bills at the normal rate.
- **Separate concurrency pools.** TTS, STT and agents each have their own limit, so a burst in one does not starve the others.

## In an AI-assisted workflow

Create an API key in the Playground, export it as `CARTESIA_API_KEY`, and install the SDK with `pip install 'cartesia[websockets]'`. This is the core of Cartesia's realtime TTS quickstart: it pushes text in pieces, the way LLM tokens arrive, and reads audio chunks back:

```python
import os
from cartesia import Cartesia

client = Cartesia(api_key=os.getenv("CARTESIA_API_KEY"))

with client.tts.websocket_connect() as connection:
    ctx = connection.context(
        model_id="sonic-3.6",
        voice="f786b574-daa5-4673-aa0c-cbe3e8534c02",
        output_format={"container": "raw", "encoding": "pcm_f32le", "sample_rate": 44100},
    )
    for part in ["Hi there! ", "Welcome to ", "Cartesia Sonic."]:
        ctx.push(part)
    ctx.no_more_inputs()

    with open("out.pcm", "wb") as out:
        for response in ctx.receive():
            if response.type == "chunk" and response.audio:
                out.write(response.audio)
            elif response.type == "done":
                break
```

In a [voice-agent pipeline](/guides/voice/build-a-voice-agent), Sonic usually takes the TTS slot and Ink 2 the STT slot; both have plugins for [LiveKit](/tools/livekit) and [Pipecat](/tools/pipecat), and Pipecat's quickstart bot uses Cartesia for speech by default.

> [!NOTE]
> Pin a dated snapshot such as `sonic-3.6-2026-08-27` in production if you run your own evals. The bare `sonic-3.6` ID moves to each new stable snapshot, and `sonic-preview` is a beta model that can change without notice as of November 2026.

## Pricing

As of November 2026, cartesia.ai/pricing lists five plans. Each includes monthly credits for the speech models and the same dollar amount again as prepaid agent usage:

| Plan | Price per month | Credits per month | Notable limits |
| --- | --- | --- | --- |
| Free | $0 | 20K | Non-commercial; $1 of agent usage |
| Pro | $5 | 100K | Commercial use license |
| Startup | $49 | 1.25M | Professional voice cloning, 2 slots |
| Scale | $299 | 8M | 4 professional clone slots |
| Enterprise | Custom | Custom | Custom concurrency and terms |

As of November 2026, Sonic costs about 1 credit per character (roughly 750 to 800 credits per minute of audio), and Ink 2 costs 3 credits per second of audio, which Cartesia works out to $0.39 per hour on Scale. Managed Agents are billed in dollars, not credits: $0.03 per minute of call as of November 2026, down from $0.06, plus $0.014 per minute on a Cartesia-provided phone number, with LLM tokens charged on top. Unused credits roll over up to twice the monthly allotment, and paid plans can enable overages (as of November 2026, $65 per 1M credits on Pro, $45 on Startup and $38 on Scale).

## Good to know

- **Line SDK sunset.** If you deployed a code-first Line agent, Cartesia stops hosting it on January 1, 2027. The migration guide maps prompts, models, voices and tools to Managed Agents.
- **STT bills for silence.** Ink charges for audio duration even when no transcript is produced, so close idle streams.
- **Ink 2 language coverage is narrow.** Five languages on the stable model; the 44-language model is still a preview as of November 2026.
- **Latency figures are the vendor's.** The 90 ms number is Cartesia's own measurement of model output, before your network and telephony hops.
- **Hosted and proprietary.** The GitHub organization holds SDKs, not model weights. Cartesia states it is SOC 2 Type II certified.

Against the field: [ElevenLabs](/tools/elevenlabs) has the wider catalog (dubbing, music, speech-to-speech). [Deepgram](/tools/deepgram) pairs Flux STT, which also has model-native turn detection, with its own Flux TTS and bills per minute or per character instead of credits. [Vapi](/tools/vapi) is the alternative to Managed Agents when you want to mix vendors for each stage. See [Best TTS APIs](/guides/voice/best-tts-apis-2026) and [Best STT APIs](/guides/voice/best-stt-apis-2026) for the side-by-side tables.
