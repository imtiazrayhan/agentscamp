---
name: "Whisper"
description: "OpenAI's open-weights speech-to-text — the MIT-licensed multilingual model family that made self-hosted transcription a default, with a huge ecosystem."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://github.com/openai/whisper"
pricing: "open-source"
category: "voice"
repo: "https://github.com/openai/whisper"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["stt", "speech-to-text", "open-source", "local", "transcription"]
featured: false
alternativeTo: ["assemblyai", "deepgram"]
sameAs:
  - "https://github.com/openai/whisper"
  - "https://arxiv.org/abs/2212.04356"
related: ["guide:best-stt-apis-2026", "tool:assemblyai", "tool:deepgram", "tool:llama-cpp", "glossary:quantization", "guide:build-a-voice-agent"]
summary: "Whisper is OpenAI's open-weights speech-to-text model family, MIT-licensed for both code and weights. It transcribes 100 languages and translates speech to English, in six sizes from tiny to large, with turbo as the fast default. Production use mostly runs via faster-whisper or whisper.cpp. OpenAI's hosted whisper-1 model shuts down on February 26, 2027."
faq:
  - q: "Is Whisper still maintained in 2026?"
    a: "The open-source repository still exists and had about 113.7k GitHub stars as of November 2026, but its last tagged release is v20250625 from June 2025 and the newest weights are large-v3-turbo from September 2024. Active development has moved to the community runtimes: whisper.cpp shipped v1.9.6 in November 2026."
  - q: "Is OpenAI shutting down the Whisper API?"
    a: "The hosted model, yes. OpenAI's speech-to-text guide says whisper-1, gpt-4o-transcribe, gpt-4o-mini-transcribe and the /v1/audio/translations endpoint are deprecated and shut down on February 26, 2027, and recommends gpt-transcribe for new work. The open-source weights are unaffected: you can keep running them yourself indefinitely."
  - q: "Which Whisper model size should I use?"
    a: "Start with turbo. It is an optimized large-v3 with 809M parameters, about 6 GB of VRAM and roughly 8x the speed of large. Drop to small or base on constrained hardware, and use medium or large for translation, because turbo was not trained for it and returns the original language even with --task translate."
  - q: "What are Whisper's known weaknesses?"
    a: "The model card warns that output may include text that was never spoken, and that the architecture is prone to repetitive text. Accuracy varies widely by language. The reference implementation processes audio in 30-second windows and has no streaming mode, speaker diarization or turn detection; those come from other tools layered on top."
---

Whisper is the model that made self-hosted [speech-to-text](/glossary/speech-to-text) a default choice. OpenAI released it in September 2022 with open weights and an MIT license, and it held up on real-world audio well enough that a whole ecosystem grew around it. It is still the baseline other speech models are measured against, though the newest weights date from 2024 and hosted models have since added features it lacks.

## Highlights

- **100 languages.** Multilingual transcription, spoken-language identification, and translation of speech into English. Accuracy varies widely by language; the README publishes per-language error rates for large-v3.
- **Six sizes.** tiny (39M parameters, about 1 GB of VRAM), base (74M), small (244M), medium (769M), large (1,550M, about 10 GB) and turbo (809M, about 6 GB). English-only `.en` variants exist for the four smallest and tend to do better at tiny and base.
- **turbo.** An optimized large-v3 released in September 2024, about 8x faster than large with a small accuracy loss. It is the CLI default.
- **MIT for code and weights.** No usage fee and no restrictions on commercial use; your only cost is compute.
- **faster-whisper.** A CTranslate2 reimplementation that its README says is up to 4 times faster than the original at the same accuracy with less memory, plus 8-bit quantization. About 27.1k GitHub stars as of November 2026.
- **whisper.cpp.** A C/C++ port with first-class Apple Silicon support (Metal and Core ML), Vulkan, and integer [quantization](/glossary/quantization). About 55.6k GitHub stars as of November 2026.

## In an AI-assisted workflow

The reference implementation needs Python and `ffmpeg`:

```bash
pip install -U openai-whisper          # requires ffmpeg on your PATH
whisper meeting.mp3 --model turbo
whisper interview.wav --model medium --language Japanese --task translate
```

From Python:

```python
import whisper

model = whisper.load_model("turbo")
result = model.transcribe("meeting.mp3")
print(result["text"])
```

For a server, most teams use faster-whisper instead (`pip install faster-whisper`):

```python
from faster_whisper import WhisperModel

model = WhisperModel("large-v3", device="cuda", compute_type="float16")
# on CPU: WhisperModel("large-v3", device="cpu", compute_type="int8")

segments, info = model.transcribe("meeting.mp3", beam_size=5)
print(f"Detected language: {info.language}")
for segment in segments:  # a generator: transcription runs as you iterate
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
```

Typical uses are private transcription where audio must not leave your infrastructure, large batch jobs where per-hour API pricing adds up, and the STT stage of a self-hosted [voice agent](/guides/voice/build-a-voice-agent), usually through whisper.cpp on-device or faster-whisper on a modest GPU.

> [!WARNING]
> Design around the failure modes. Put voice-activity detection in front so silence never reaches the model, since that is where invented text tends to appear. Chunk long audio deliberately around the 30-second window. And do not expect streaming or speaker labels from Whisper itself.

## Good to know

- **The hosted API is being retired.** OpenAI's `whisper-1` is deprecated with a shutdown date of February 26, 2027, and OpenAI points new integrations at `gpt-transcribe`, a closed model. If you call `whisper-1` today, plan a migration or move to self-hosting. OpenAI's transcription endpoint accepts files up to 25 MB.
- **The reference repository is quiet.** Its last tagged release is v20250625 (June 2025), and the README states compatibility with Python 3.8 to 3.11. The community runtimes are where fixes and hardware support land.
- **turbo does not translate.** Use medium or large for speech-to-English translation.
- **No built-in extras.** Diarization, streaming and turn detection need additional libraries or a hosted API.
- **Parameter counts differ slightly by source.** The README lists turbo at 809M parameters and the model card at 798M.

When audio can leave your perimeter, hosted models now beat raw Whisper on features: [AssemblyAI](/tools/assemblyai) offers its STT-3.7 models with diarization, prompting and an agent-tuned streaming model, and [Deepgram](/tools/deepgram) offers Nova-3 for general transcription and Flux for voice agents with built-in turn detection, both billed by usage. Whisper remains the answer when you need the weights on your own hardware, at no licence cost. The decision between the open baseline and hosted specialists is mapped in [Best Speech-to-Text APIs in 2026](/guides/voice/best-stt-apis-2026).
