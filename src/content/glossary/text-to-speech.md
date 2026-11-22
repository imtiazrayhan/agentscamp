---
term: "Text-to-Speech (TTS)"
description: "Text-to-speech (TTS) turns written text into spoken audio: the engine expands numbers and symbols into words, then generates a voice that reads them."
date: 2026-11-14
topics: ["multimodal-ai", "llm-app-dev"]
audience: ["developers", "ai-engineers", "marketers"]
tags: ["text-to-speech", "tts", "speech-synthesis", "ssml", "voice"]
related: ["guide:best-tts-apis-2026", "tool:elevenlabs", "glossary:speech-to-text", "glossary:voice-cloning", "guide:build-a-voice-agent", "glossary:multimodal-ai"]
faq:
  - q: "What is SSML?"
    a: "Speech Synthesis Markup Language, a W3C Recommendation (version 1.1, September 2010). It is an XML-based markup that gives a standard way to control aspects of speech such as pronunciation, volume, pitch and rate, with elements like break, sub and phoneme. Support varies by engine: SSML does not standardize the values of its say-as element, and ElevenLabs' Eleven v4 and Eleven v3 models do not support SSML break tags."
  - q: "What is text normalization in TTS?"
    a: "Turning written forms into the words a voice should say. The SSML specification's example is that '$200' may be spoken as 'two hundred dollars', and '1/2' as 'half', 'January second', 'February first' or 'one of two'. ElevenLabs enables normalization by default for all its TTS models but notes that smaller models can misread figures, so spelling out phone numbers, currencies, dates and URLs in the script is the safer habit."
  - q: "Which TTS API should I use?"
    a: "It depends on the job. Produced audio such as narration, video voiceover and dubbing rewards expressiveness and voice range, while voice agents reward how quickly the first audio arrives. Run your own scripts through two or three candidates before committing; our TTS API comparison sorts the main options by those two uses."
summary: "Text-to-speech (TTS) converts written text into spoken audio. The engine normalizes the text, expanding numbers, dates and symbols into words, then synthesizes a voice whose pronunciation, pace and pauses can be steered with SSML or vendor controls. Support differs: ElevenLabs' Eleven v4 does not accept SSML. TTS powers narration, dubbing and voice agents."
---

**Text-to-speech (TTS) is the conversion of written text into spoken audio by a synthesis engine, which works out how the text should be read and then generates a voice that reads it.**

Two steps matter in practice. The first is text normalization: turning written forms into words. The W3C's SSML 1.1 specification gives the classic example that "$200" may be spoken as "two hundred dollars," and that "1/2" could be "half," "January second," "February first" or "one of two." ElevenLabs enables normalization by default for all its TTS models, yet its own guidance warns that smaller models struggle with phone numbers, currencies, dates and URLs, so production scripts often spell those out.

The second is control. SSML, whose version 1.1 became a W3C Recommendation in September 2010, is an XML markup meant to provide "a standard way to control aspects of speech such as pronunciation, volume, pitch, rate, etc." It has elements for pauses (`break`), substitutions (`sub`) and phonetic spellings (`phoneme`). Engines implement it unevenly. SSML does not enumerate the values `say-as` accepts, and ElevenLabs' newest model, Eleven v4, does not support SSML at all; it takes IPA pronunciations between slashes and bracketed audio tags such as `[whispers]` instead.

TTS creates new speech, unlike [speech enhancement](/glossary/speech-enhancement), which cleans up an existing recording. It serves both produced audio, such as narration and dubbing, and live voice agents, where [speech-to-text](/glossary/speech-to-text) hears the user and TTS speaks the reply, as covered in [Build a Voice Agent](/guides/voice/build-a-voice-agent). A [cloned voice](/glossary/voice-cloning) is one more voice a TTS engine can speak in. The engines are compared in [Best Text-to-Speech APIs in 2026](/guides/voice/best-tts-apis-2026), and [ElevenLabs](/tools/elevenlabs) has its own page.
