---
term: "Voice Cloning"
description: "Voice cloning builds a synthetic copy of a specific person's voice from recorded samples, so a text-to-speech engine can speak any script in that voice."
date: 2026-11-16
topics: ["multimodal-ai", "ai-safety-security"]
audience: ["marketers", "developers", "designers"]
tags: ["voice-cloning", "tts", "synthetic-voice", "consent", "deepfake"]
related: ["tool:elevenlabs", "glossary:text-to-speech", "guide:best-tts-apis-2026", "glossary:ai-avatar", "tool:heygen"]
faq:
  - q: "What is the difference between instant and professional voice cloning?"
    a: "ElevenLabs and HeyGen both offer two tiers. An instant clone is made quickly from short audio; HeyGen's comes from one recording and is ready in seconds. A professional clone trains on much more audio: ElevenLabs calls it professional-grade cloning with extended training audio and requires a Creator plan or above, and HeyGen asks for 20+ minutes of recordings, with each professional voice needing a purchased slot."
  - q: "Can I clone someone else's voice?"
    a: "Only with their permission, and on some products not at all. ElevenLabs' Professional Voice Cloning is limited to your own voice: 'Even with their consent, you cannot clone someone else's voice,' and voice-captcha technology verifies the samples are yours. Its Instant Voice Cloning instead asks you to confirm you have the right and consent to clone the voice. HeyGen allows cloning another person's voice only with their prior, explicit and informed permission, bans cloning anyone under 18, and requires its prior written approval for celebrity, public-figure and political-candidate voices."
  - q: "Is a cloned voice a deep fake under the EU AI Act?"
    a: "It can be. The Act's definition of a deep fake covers AI-generated or manipulated audio that 'resembles existing persons, objects, places, entities or events and would falsely appear to a person to be authentic or truthful.' From 2 August 2026, Article 50(4) requires deployers of an AI system that generates or manipulates deep fake content to disclose that the content has been artificially generated or manipulated. HeyGen's policy separately bans using a voice for deceptive impersonation, fraud, false endorsement or to defeat voice authentication."
summary: "Voice cloning builds a synthetic model of a specific person's voice from recordings so a text-to-speech engine can say anything in that voice. Instant clones use short samples; professional clones train on more audio. Vendors gate it with consent: ElevenLabs limits professional clones to your own voice; HeyGen requires explicit permission for others."
---

**Voice cloning is the creation of a synthetic version of a specific person's voice from recorded samples, so that a [text-to-speech](/glossary/text-to-speech) engine can speak any new script in that voice.**

Vendors split it into two tiers. [ElevenLabs](/tools/elevenlabs) describes Instant Voice Cloning as cloning "a voice from short audio samples," and Professional Voice Cloning as generating "professional-grade voice clones with extended training audio." [HeyGen](/tools/heygen) makes an instant clone "from one recording" and a professional clone "from 20+ minutes of recordings." HeyGen's digital twins also clone a voice automatically from the training footage, which is how an [AI avatar](/glossary/ai-avatar) speaks in its subject's own voice. Clones can cross languages: ElevenLabs says Eleven v4 speaks fluently in a target language "rather than carrying over the reference voice's accent."

The main uses are narration and video translation. HeyGen translates videos "with voice cloning and lip-sync," and Synthesia's AI dubbing replaces the voiceover "while preserving the speaker's own voice."

Because a convincing clone can impersonate someone, consent is the core safeguard, and vendors spell it out. ElevenLabs allows Professional Voice Clones of your own voice only, checked with voice-captcha technology: "Even with their consent, you cannot clone someone else's voice." For instant clones you confirm you have "the right and consent to clone the voice," and ElevenLabs says all generated audio "can be instantly traced back to the user responsible for the generation." HeyGen permits cloning another person's voice "only with their prior, explicit and informed permission," bans cloning anyone under 18, requires its prior written approval for celebrity, public-figure and political-candidate voices, and prohibits use "for deceptive impersonation, fraud, false endorsement or to defeat voice authentication."

TTS engines that support cloning are compared in [Best Text-to-Speech APIs in 2026](/guides/voice/best-tts-apis-2026).
