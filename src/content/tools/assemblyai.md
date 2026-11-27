---
name: "AssemblyAI"
description: "Speech AI API: AssemblyAI-STT-3.7 speech-to-text for recorded, live and voice-agent audio, a streaming TTS model, and speech understanding add-ons."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.assemblyai.com"
pricing: "freemium"
category: "voice"
os: ["Web"]
color: "blue"
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["stt", "speech-to-text", "voice", "api", "transcription"]
featured: false
alternativeTo: ["deepgram", "whisper", "cartesia"]
sameAs:
  - "https://github.com/AssemblyAI"
  - "https://www.linkedin.com/company/assemblyai"
related: ["guide:best-stt-apis-2026", "guide:realtime-voice-apis", "tool:deepgram", "tool:whisper", "tool:cartesia", "guide:build-a-voice-agent"]
summary: "AssemblyAI is a hosted speech API. In November 2026 it replaced its Universal-3 line with AssemblyAI-STT-3.7, sold as three models: one for recorded audio, one for live transcription, and one tuned for voice agents. It also offers streaming text-to-speech, a Voice Agent API, and add-ons such as PII redaction. Billing is per hour, with a free tier."
faq:
  - q: "How much does AssemblyAI cost?"
    a: "As of November 2026, AssemblyAI's pricing page lists AssemblyAI-STT-3.7 at $0.21 per hour and Universal-2 at $0.15 per hour for recorded audio, AssemblyAI-STT-3.7-Realtime at $0.30 per hour, and AssemblyAI-STT-3.7-Realtime-Agent at $0.45 per hour. Add-ons such as speaker diarization are charged on top. The free tier needs no credit card and covers up to 185 hours of pre-recorded or 333 hours of streaming transcription."
  - q: "What happened to Universal-3 Pro?"
    a: "It is deprecated. AssemblyAI's model status page marks universal-3-pro and universal-3-5-pro as deprecated on November 17, 2026, replaced by assemblyai-stt-3-7. The streaming versions of Universal-3.5 Pro and Universal-Streaming retire on February 1, 2027. From December 8, 2026, existing accounts that do not set speech_models default to assemblyai-stt-3-7."
  - q: "Which AssemblyAI model should a voice agent use?"
    a: "AssemblyAI-STT-3.7-Realtime-Agent. It adds turn detection and a Voice Focus option for a second talker near the microphone, and AssemblyAI reports a final transcript 86 ms after speech ends. The cheaper AssemblyAI-STT-3.7-Realtime is built for meetings and captions and does not do turn-taking."
  - q: "How many languages does AssemblyAI support?"
    a: "AssemblyAI-STT-3.7 covers 32 languages with automatic language detection and code switching. For the rest, list both models as speech_models: [\"assemblyai-stt-3-7\", \"universal-2\"]; Universal-2 brings the total to 99, and the response field speech_model_used tells you which model ran."
---

AssemblyAI is a hosted speech API whose core product is speech-to-text. In November 2026 it replaced the Universal-3 line with **AssemblyAI-STT-3.7**, split into three models by use: recorded audio, live conversation, and conversation with a voice agent. Around that it sells a streaming text-to-speech model, a Voice Agent API, and speech-understanding add-ons, all on one API key.

## Highlights

- **AssemblyAI-STT-3.7** (`assemblyai-stt-3-7`). The pre-recorded model: 32 languages with automatic language detection and code switching, plain-language prompting, up to 1,000 keyterms, and a new speaker diarization model.
- **Universal-2.** The older pre-recorded model stays available for its 99 languages and lower price.
- **AssemblyAI-STT-3.7-Realtime.** Streaming transcription for meetings, calls and captions, with speaker labels that are final when a turn ends.
- **AssemblyAI-STT-3.7-Realtime-Agent.** The streaming model for voice agents, with turn detection, keyterm prompting, context carryover, and Voice Focus to isolate the primary speaker.
- **Sync and Dictation APIs.** Sync returns a transcript for up to 20 minutes of audio in one HTTP call; Dictation returns cleaned-up, send-ready text for voice typing.
- **AssemblyAI-TTS-1.** Streaming text-to-speech in six languages (English, Spanish, German, French, Italian, Portuguese) with voice cloning and per-word timestamps. AssemblyAI cites about 90 ms to first audio.
- **Voice Agent API.** A hosted agent you configure once and deploy to a browser, your app, or a Twilio phone number over SIP.
- **Speech understanding and guardrails.** Summarization, speaker identification, sentiment, entity and topic detection, translation, PII redaction for text and audio, profanity filtering, and content moderation, each billed as an add-on.
- **LLM Gateway.** One endpoint for running OpenAI, Anthropic, Google and open-weight models over your transcripts. It is not covered by the SDK; call its HTTP API.

## In an AI-assisted workflow

Create an account, copy the API key, and install the SDK (`pip install assemblyai` or `npm install assemblyai`). This transcribes a hosted file with speaker labels:

```python
import os
from assemblyai.prerecorded.v2 import Transcriber, TranscriptionConfig

transcriber = Transcriber(api_key=os.environ["ASSEMBLYAI_API_KEY"])
config = TranscriptionConfig(speech_models=["assemblyai-stt-3-7"], speaker_labels=True)
transcript = transcriber.transcribe("https://assembly.ai/wildfires.mp3", config=config)

for utterance in transcript.utterances:
    print(f"Speaker {utterance.speaker}: {utterance.text}")
```

Without an SDK, the same job is `POST https://api.assemblyai.com/v2/transcript` with your key in the `authorization` header (no `Bearer` prefix), then polling `GET /v2/transcript/{id}` until `status` is `completed`.

In a [voice-agent stack](/guides/voice/build-a-voice-agent), AssemblyAI is usually the speech-to-text stage: its docs include integrations for [LiveKit](/tools/livekit) and [Pipecat](/tools/pipecat), and LiveKit's own quickstart agent uses `assemblyai/assemblyai-stt-3-7-realtime-agent`. In batch work, it turns a backlog of calls into diarized, redacted, summarized records.

> [!WARNING]
> Streaming is billed per hour of **session duration**, the time the WebSocket stays open, not per hour of audio sent. Close idle connections. And when you move from Universal-3.5 Pro, two defaults change: there is no automatic fallback to Universal-2 unless you list it, and `disfluencies` and `format_text` both default to `true`.

## Pricing

As of November 2026, AssemblyAI's pricing page lists these pay-as-you-go rates:

| Product | Rate |
| --- | --- |
| AssemblyAI-STT-3.7 (pre-recorded) | $0.21 per hour |
| Universal-2 (pre-recorded) | $0.15 per hour |
| AssemblyAI-STT-3.7-Realtime | $0.30 per hour |
| AssemblyAI-STT-3.7-Realtime-Agent | $0.45 per hour |
| Sync API | $0.30 per hour |
| Dictation API | $0.62 per hour |
| AssemblyAI-TTS-1 | $15 per 1M characters |

Add-ons are charged on top, as of November 2026: on recorded audio, speaker diarization is $0.02 per hour, prompting and keyterms prompting are $0.05 per hour each on STT-3.7 (keyterms are included on Universal-2), PII text redaction is $0.08 per hour and summarization starts at $0.02 per hour. On streaming, as of November 2026, diarization and PII text redaction are $0.12 per hour each, and Medical Mode is $0.15 per hour on either kind of audio.

The free tier, as of November 2026, needs no credit card and includes up to 185 hours of pre-recorded transcription and up to 333 hours of streaming. Free accounts can open 5 new streaming connections a minute; pay-as-you-go starts at 100 a minute and scales automatically. The pricing page does not list a rate for the Voice Agent API, so confirm that in the dashboard before you plan around it.

## Good to know

- **Hosted by default.** Audio leaves your network. AssemblyAI lists a self-hosted deployment option for enterprises, and EU processing for text-to-speech at the same price.
- **Fast model turnover.** Universal-3 Pro and Universal-3.5 Pro were both deprecated on November 17, 2026, the day STT-3.7 became the default for new accounts. Pin `speech_models` explicitly and watch the model status page instead of relying on account defaults.
- **Benchmarks are the vendor's.** The accuracy and latency figures AssemblyAI publishes for STT-3.7 come from its own harness. Test on your own audio, with your accents and noise.
- **Veterinary Mode** is in beta as of November 2026.

Against the field: [Deepgram](/tools/deepgram) is the closest hosted rival, with Flux for voice agents and Nova-3 for general transcription billed per minute. [Whisper](/tools/whisper) is the open-weights option when audio cannot leave your infrastructure. [Cartesia](/tools/cartesia) pairs its Ink streaming STT with Sonic TTS for latency-first agents. The decision table is in [Best Speech-to-Text APIs in 2026](/guides/voice/best-stt-apis-2026).
