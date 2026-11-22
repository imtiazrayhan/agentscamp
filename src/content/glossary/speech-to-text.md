---
term: "Speech-to-Text (STT)"
description: "Speech-to-text (STT), or automatic speech recognition, converts spoken audio into written text, often with timestamps and speaker labels, in batch or live."
date: 2026-11-14
topics: ["multimodal-ai", "llm-app-dev"]
audience: ["developers", "ai-engineers", "analysts"]
tags: ["speech-to-text", "stt", "asr", "transcription", "whisper"]
related: ["guide:best-stt-apis-2026", "tool:whisper", "glossary:automatic-captioning", "glossary:text-to-speech", "tool:deepgram", "guide:build-a-voice-agent"]
faq:
  - q: "Is speech-to-text the same as ASR?"
    a: "Yes, for practical purposes. Automatic speech recognition (ASR) is the research name for the task, and speech-to-text is the usual product name. Both mean turning spoken audio into written text; transcription is the output."
  - q: "How is speech-to-text accuracy measured?"
    a: "Usually by word error rate (WER) against a reference transcript, where lower is better, often on public test sets such as FLEURS. Vendors tend to report relative gains: ElevenLabs, for example, says Scribe v3 makes 27% fewer word errors than Scribe v2 on FLEURS. Test candidates on your own audio, because a benchmark figure does not tell you how an engine handles your speakers and vocabulary."
  - q: "Is a transcript the same as captions?"
    a: "No. A transcript is the words. Captions are timed text that also convey meaningful non-speech sound and stay in sync with the media. Automatic captioning starts from speech-to-text output, but the draft still needs human review, because one missed word can reverse the meaning of a sentence."
summary: "Speech-to-text (STT), also called automatic speech recognition (ASR), converts spoken audio into written text. Modern engines add word-level timestamps, speaker diarization and custom vocabulary, on recorded files or live streams. OpenAI's Whisper, trained on 680,000 hours of multilingual audio, set the open baseline. Accuracy is measured as word error rate."
---

**Speech-to-text (STT), also called automatic speech recognition (ASR), is the conversion of spoken audio into written text by a model that listens to a recording or a live stream and outputs a transcript.**

The modern baseline came from OpenAI's Whisper paper (Radford et al., arXiv 2212.04356, December 2022), which studied systems "trained simply to predict large amounts of transcripts of audio on the internet." Scaled to 680,000 hours of multilingual and multitask supervision, the resulting models "generalize well to standard benchmarks." [Whisper](/tools/whisper) remains the open-weights reference point for self-hosting.

Commercial engines compete on what surrounds the words. ElevenLabs, for example, says its STT API turns "spoken audio into text with state of the art accuracy across 90+ languages," and lists speaker diarization for up to 32 speakers, keyterm prompting for up to 1,000 terms and word-level timestamps for its Scribe v3 model, with a separate Scribe v3 Live model for real time. Those features map to two workloads. Batch transcription of recordings needs timestamps, speaker labels and clean input for analysis. Streaming needs low latency, because a [voice agent](/guides/voice/build-a-voice-agent) cannot reply until it has heard the user. Accuracy is usually reported as word error rate, so test candidates on your own audio rather than trusting a headline number.

STT is the input half of a voice pipeline, and [text-to-speech](/glossary/text-to-speech) is the output half. A transcript is not yet a caption: [automatic captioning](/glossary/automatic-captioning) adds timing and non-speech sound, and the draft still needs human review. Engines are ranked by workload in [Best Speech-to-Text APIs in 2026](/guides/voice/best-stt-apis-2026).
