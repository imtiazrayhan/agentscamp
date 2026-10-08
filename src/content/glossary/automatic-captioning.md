---
description: Automatic captioning uses speech recognition to produce timed text for media; human review checks meaning, speaker cues and meaningful sounds.
date: "2026-09-02"
reviewed: '2026-10-07'
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
summary: Automatic captioning uses speech recognition to produce timed text for media; human review checks meaning, speaker cues and meaningful sounds.
term: Automatic captioning
---

**Automatic captioning uses speech recognition to create timed text for recorded or live media.** Captions convey speech and meaningful non-speech sound in sync with the media. Automatic output needs checking and correction because even a missing word can change meaning. [W3C's caption guidance](https://www.w3.org/WAI/media/av/captions/) explains that review need and distinguishes open captions, which stay visible, from closed captions, which viewers can toggle.

The immediate output is a draft track. Its timestamps may be valid while its words are wrong. In the fictional community-garden video, a draft says “We did open the gate,” while a human listener records “We did not open the gate.” Both sentences are fluent, but they describe opposite actions. The missing negation cannot be repaired through syntax checking.

The [caption-review workflow](/guides/voice/review-ai-captions-before-publishing) freezes the media cut, preserves original cues, and records proposed repairs with listening evidence. An editing tool such as [VEED](/tools/veed) can sit within that process, but the reviewed track is specific to the cut that was checked.

A transcript gives words without necessarily providing a usable timed caption presentation. A broad multimodal capability also does not establish that a particular agent can hear the media. The [Caption Reviewer](/agents/marketing/caption-reviewer) must describe the evidence it actually received and leave unheard words unresolved when only text is available.

Keep auditory review and file checking separate. A cue parser can identify a malformed timestamp or an overlap. A listener determines whether Mira's name, the negation, and the gate sound match the recording. Playback in the delivery player checks how the repaired cues appear. No single structural pass substitutes for those decisions.
