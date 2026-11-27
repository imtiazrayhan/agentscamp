---
description: Automatic captioning uses speech recognition to turn a video or audio track into timed on-screen text, as a draft that still needs human correction.
date: "2026-09-02"
updated: '2026-11-27'
reviewed: '2026-11-27'
topics:
- ai-at-work
- multimodal-ai
audience:
- marketers
tags:
- video
- transcription
- quality-assurance
featured: false
related:
- guide:review-ai-captions-before-publishing
- tool:veed
- agent:caption-reviewer
- glossary:speech-to-text
summary: Automatic captioning runs speech recognition over a media file or live stream, attaches timestamps to the words and groups them into timed cues, usually saved as SRT or WebVTT. The draft is fast and cheap but mishears names, drops small words like "not" and omits sounds, so it needs a human pass before publishing.
term: Automatic captioning
seoTitle: "What Is Automatic Captioning?"
faq:
  - q: "What is the difference between captions, subtitles and a transcript?"
    a: "Captions are timed text in the same language as the audio and include speaker labels and meaningful sounds, for viewers who cannot hear it. Subtitles translate dialogue for viewers who can hear but do not know the language. A transcript is the full text without the cue-by-cue timing needed for display."
  - q: "What is the difference between SRT and WebVTT?"
    a: "Both are plain-text cue files. SRT numbers each cue and writes times as 00:00:12,000 with a comma. WebVTT starts with a WEBVTT header, uses a period (00:00:12.000) and adds positioning and styling options; it is the format the HTML track element expects."
  - q: "Are automatic captions enough for accessibility?"
    a: "Not unedited. W3C's guidance says automatically generated captions do not meet user needs or accessibility requirements unless they are confirmed to be fully accurate, and that they usually need significant editing. Use them as the starting draft."
  - q: "How is caption accuracy measured?"
    a: "Usually by word error rate: substitutions plus deletions plus insertions, divided by the number of words in a correct reference transcript. WER treats every word equally, so a low score can still hide a dropped 'not' or a wrong name."
---

**Automatic captioning uses [speech recognition](/glossary/speech-to-text) to turn the audio of a video, podcast or live stream into timed text that appears in sync with the media.** The output is a draft caption track: fast to produce and usually close, but not checked by anyone.

## How it works

1. **Recognise.** A speech-to-text model such as [Whisper](/tools/whisper) transcribes the audio and returns a start and end time for each word or phrase.
2. **Segment.** The words are grouped into cues: short blocks of one or two lines, split at pauses and sentence boundaries and held on screen long enough to read.
3. **Label (optional).** Speaker diarisation tags who is talking; some systems also mark sounds such as music or applause.
4. **Export.** The cues are saved as a sidecar file or burned into the picture. Captions the viewer can turn off are *closed*; captions that are part of the image are *open*.

A WebVTT cue looks like this:

```text
WEBVTT

00:00:12.000 --> 00:00:14.500
We did not open the gate.
```

The same cue in SRT has a sequence number above it and a comma in the timestamps (`00:00:12,000 --> 00:00:14,500`).

## Recorded versus live

For recorded media the model sees the whole file, can use later context to fix earlier words, and the result can be edited before anyone watches. Live captioning has to commit to words within a second or two, so it lags the speaker, revises text on screen and makes more errors. A live track posted later as a recording should be corrected first.

## Typical errors

- **Dropped or swapped small words.** "We did open the gate" for "We did not open the gate" is fluent, correctly timed and means the opposite.
- **Names and jargon.** Product names, people and acronyms the model has rarely seen come out as similar-sounding common words.
- **Homophones and numbers.** "Fifteen" and "fifty", "their" and "there".
- **Speaker changes.** Two people merged into one cue, or overlapping speech lost.
- **Missing non-speech sound.** A doorbell or off-screen laugh that matters to the scene is not captioned at all.
- **Timing and segmentation.** Cues that break mid-phrase or flash by too quickly.

Accuracy is reported as word error rate (WER), which varies widely with audio quality, accents, crosstalk and vocabulary. A file-format validator will catch a malformed timestamp or overlapping cues; only someone listening can catch the missing "not". [W3C's caption guidance](https://www.w3.org/WAI/media/av/captions/) makes the same point: automatic captions are a starting point and need editing for accuracy.

## Captions, subtitles and transcripts

Captions carry speech plus meaningful sound in the language of the audio. Subtitles are a translation of the dialogue. A transcript is the words as a document, which helps search and reading but does not replace synchronised captions on video.

## In practice

Generate the draft, then review it against the final cut: listen for negations, names and numbers, add speaker labels and sounds, and check the result in the player you will publish to. Re-run the review if the edit changes, since timings belong to one cut. The [caption-review guide](/guides/voice/review-ai-captions-before-publishing) lays out that pass, editors such as [VEED](/tools/veed) generate subtitles with editable text and timing, and the [Caption Reviewer](/agents/marketing/caption-reviewer) agent compares caption text and timing with a listener's notes and flags uncertain words, missing speaker or sound cues and timing conflicts, without claiming to have heard audio it was not given.
