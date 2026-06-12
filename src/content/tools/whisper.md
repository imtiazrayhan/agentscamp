---
name: "Whisper"
description: "OpenAI's open-weights speech-to-text — the MIT-licensed multilingual model family that made self-hosted transcription a default, with a huge ecosystem."
date: 2026-06-11
url: "https://github.com/openai/whisper"
pricing: "open-source"
category: "voice"
repo: "https://github.com/openai/whisper"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["mlops-ai-infra", "multimodal-ai"]
tags: ["stt", "speech-to-text", "open-source", "local", "transcription"]
featured: false
alternativeTo: ["assemblyai", "deepgram"]
sameAs:
  - "https://github.com/openai/whisper"
  - "https://arxiv.org/abs/2212.04356"
related: ["best-stt-apis-2026", "assemblyai", "deepgram", "llama-cpp", "quantization", "build-a-voice-agent"]
summary: "Whisper (OpenAI, MIT, ~102k stars) is the open-weights STT baseline: multilingual transcription across ~99 languages, speech-to-English translation, six model sizes from tiny (runs anywhere) to large, with turbo — an 8x-faster large-v3 — as the practical default. Production deployments mostly run it through faster-whisper or whisper.cpp; hosted Whisper is offered by many APIs."
faq:
  - q: "Is Whisper still the best open STT in 2026?"
    a: "It's the default, which is different from the best at everything. Nothing open matches its combination of multilingual breadth, robustness, ecosystem (faster-whisper, whisper.cpp, countless integrations), and MIT licensing — but OpenAI hasn't shipped a new generation since turbo (late 2024), and hosted models now beat it on accuracy, streaming, and features. Self-hosting, privacy, and cost still make Whisper the workhorse."
  - q: "Which Whisper model size should I use?"
    a: "turbo, usually — it's the optimized large-v3 decoder at roughly 8x the speed with minimal accuracy loss (~6GB VRAM). Drop to small/base for edge devices; use large when squeezing the last accuracy points; note turbo doesn't do translation — for speech-to-English from other languages you need the non-turbo models."
  - q: "What are Whisper's known weaknesses?"
    a: "Hallucination on silence and noise (the model card says outputs may include text never spoken — notorious in quiet segments), repetition loops, uneven accuracy on low-resource languages and accents, 30-second windowing with no native streaming, and no built-in diarization. Production stacks add VAD, run via faster-whisper/whisper.cpp, and layer diarization separately."
---

Whisper is the model that democratized speech-to-text: open weights, MIT license, and robustness that held up outside the lab. Three-plus years on, it remains the **self-hosted baseline** the whole category is measured against — less because it's unbeatable than because it's *everywhere*, free, and good.

## Highlights

- **Genuinely multilingual** — transcription across ~99 languages (accuracy varies with resource level), plus speech-to-English translation and language ID.
- **Six sizes, one family** — tiny (39M, runs on anything) through large (1.5B); **turbo** packs large-v3 quality at ~8× speed in ~6GB VRAM.
- **The ecosystem is the product** — faster-whisper (CTranslate2, ~23k stars) and whisper.cpp (ggml/Apple-Silicon-native, ~50k stars) are how production actually runs it; pipelines, GUIs, and integrations are innumerable.
- **MIT everything** — weights and code; the only bill is compute.
- **Hosted when you want it** — OpenAI and many providers serve Whisper-family inference if self-hosting isn't the point.

## In an AI-assisted workflow

```bash
pip install -U openai-whisper        # needs ffmpeg
whisper meeting.mp3 --model turbo
```

The classic agent-era uses: private transcription pipelines (audio never leaves your infra), batch processing where per-hour API pricing would sting, and the STT layer of self-hosted [voice agents](/guides/voice/build-a-voice-agent) — usually via whisper.cpp on-device or faster-whisper on a modest GPU.

> [!WARNING]
> Design around the failure modes: add VAD so silence never reaches the model (hallucination lives there), chunk long audio deliberately (30-second windows), and don't expect native streaming or diarization — those are ecosystem add-ons.

## Good to know

The repo stays maintained but the frontier moved hosted: [AssemblyAI](/tools/assemblyai)'s promptable Universal-3 and [Deepgram](/tools/deepgram)'s streaming stack beat raw Whisper on accuracy and features when the audio can leave your perimeter. The honest decision — open baseline vs hosted specialists — is mapped in [Best Speech-to-Text APIs in 2026](/guides/voice/best-stt-apis-2026).
