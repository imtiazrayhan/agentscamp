---
name: "avatar-video-script-writer"
title: "Avatar Video Script Writer"
description: "Write a scene-by-scene script for an AI avatar video tool such as HeyGen or Synthesia: spoken lines kept inside the tool's per-scene limits (HeyGen's script import caps a segment, which becomes one scene, at 1,000 characters; Synthesia caps a scene's script at 5 minutes), pauses and pronunciation set with that tool's own controls, on-screen text, B-roll notes, and a localization-ready version. It starts with a consent check and will not script a real person's likeness or voice without documented consent. Use when turning a brief, document, or slide deck into an avatar video script."
version: "1.0.0"
allowed-tools: "Read, Write"
user-invocable: true
color: "cyan"
date: 2026-11-16
topics: ["multimodal-ai", "ai-at-work"]
audience: ["marketers", "designers", "sales"]
tags: ["claude", "ai-avatar", "video-script", "heygen", "synthesia", "localization", "marketers"]
featured: false
related: ["glossary:ai-avatar", "tool:heygen", "tool:synthesia", "skill:tts-script-preparer", "guide:best-ai-avatar-video-generators-2026", "glossary:voice-cloning", "skill:content-repurposer", "skill:localization-glossary-builder", "tool:descript"]
seoDescription: "A Claude skill that writes avatar video scripts for HeyGen or Synthesia: per-scene limits, native pause and pronunciation controls, B-roll, and a consent check."
summary: "This skill turns a brief, document, or deck into a scene-by-scene script for an AI avatar tool such as HeyGen or Synthesia. Spoken lines fit each tool's scene limits, pauses and pronunciation use its own controls, and on-screen text, B-roll notes, and a translation sheet come with it. It will not script a real person's likeness or voice without consent."
---

An [AI avatar](/glossary/ai-avatar) reads exactly what you give it, scene by scene, in the voice and face you pick. Scripts written for a human presenter break in avatar tools: scenes run past the tool's limits, operator notes get read aloud, a product name comes out wrong in every take, and a translated version no longer fits its scene. This skill writes for the tool. It plans scenes, keeps each one inside the target tool's documented limits, sets pauses and pronunciation with that tool's own controls (not SSML), and keeps directions out of the spoken column. It also produces a translation sheet so the localized versions start from clean source text. Before any of that, it checks whose face and voice the video uses, because the vendors' policies require consent and so does basic decency.

## When to use this skill

- A training module, product update, or sales video will be produced in HeyGen, Synthesia, or a similar avatar tool.
- A slide deck or document needs to become a narrated avatar video.
- A script will be localized into several languages and must survive translation.
- Someone asks for a video "with our CEO's avatar" and you need to know whether that is allowed.

## When NOT to use this skill

- Voiceover only, with no avatar on screen: the [tts-script-preparer](/skills/marketing/tts-script-preparer) skill.
- A short social video a human will film: the [content-repurposer](/skills/marketing/content-repurposer) skill writes that script.
- Choosing a tool: [the best AI avatar video generators](/guides/comparisons/best-ai-avatar-video-generators-2026) compares them.

## Instructions

1. **Check consent first.** Ask which avatar and voice the video uses:
   - **A stock avatar:** fine. Synthesia's stock avatars are built "from either real actor performances or AI-generated identities", and using one needs no consent process from you.
   - **A custom avatar or cloned voice of a real person** (the user, a colleague, an executive, a customer): require the person's name, where the consent record lives (the vendor's consent recording, a signed release), and its scope. HeyGen's moderation policy requires "the explicit consent of the individual being represented" and has that person record their own consent video. Synthesia requires a live consent recording by the same person shown in the photo, and "Consent videos must be recorded live and cannot be uploaded." For voices, HeyGen allows cloning another person's voice "only with their prior, explicit and informed permission", bars cloning anyone under 18, and requires its written approval for celebrity, public-figure, and political-candidate voices. ElevenLabs allows a Professional Voice Clone of your own voice only.
   - **A gap in the vendor's check:** HeyGen "runs no consent check and keeps no consent record for a photo avatar", and Enterprise accounts with an indemnity agreement can skip its consent flow. The skill still requires documented consent in those cases.

   If consent is not documented, stop and offer a stock avatar. Never write lines that put words in a real person's mouth they have not approved, imply an endorsement, or impersonate anyone. If the video could fall under the EU AI Act's "deep fake" definition (content that "resembles existing persons" and "would falsely appear to a person to be authentic or truthful"), Article 50(4) has required deployers to disclose it since 2 August 2026: add a visible disclosure line and flag it for the user's legal review.

2. **Pin the production target.** Tool and editor or API; avatar; voice and, for HeyGen API videos, the voice engine (`heygen_voice`, an ElevenLabs model such as `eleven_v4`, or another listed engine); target length; source language and target languages; whether the script will be imported, pasted, or sent to an API. Check the user's plan for maximum video length.

3. **Plan the scenes.** One idea per scene, in a table with columns Scene, Purpose, Spoken script, Directions (pauses, pronunciation, avatar and layout), On-screen text, and B-roll / visuals. Open with the point, not a greeting. Estimate duration from length (ElevenLabs sizes its character limits at roughly 1,000 characters per minute of audio), and confirm with the tool's preview.

4. **Keep every scene inside the tool's limits.** Print the character count after each spoken line.
   - **HeyGen Studio script import:** "Maximum 1,000 characters per segment", and one segment becomes one scene.
   - **HeyGen TTS API** (when generating audio separately): 1 to 10,000 characters of plain prose.
   - **Synthesia:** "The maximum duration of the script for each scene is 5 minutes." Each hard return starts a new paragraph with its own speaker, voice, and speed settings.
   - Leave headroom below each limit so a translated scene still fits.

5. **Set pauses and pronunciation with the tool's own controls.** Write them in the Directions column for the editor operator, never in the Spoken script column, unless the target is an API that takes them as text.
   - **HeyGen Studio:** the Pause button inserts half-second pauses, adjustable in 0.5-second steps; a scene containing only a pause separates sections. Punctuation shapes delivery: commas give short breaks, periods longer ones with a downward inflection, hyphens separate syllables. Fix a word with double-click, then Pronunciation ("AI" as "a-eye"); for project-wide terms use the Brand Glossary, whose `pronunciation` entries work with every voice and whose `ipa` entries work with HeyGen Voice, ElevenLabs, and Cartesia voices. Pronunciations change the audio only; captions keep the original spelling.
   - **HeyGen TTS API:** professional voices on `heygen-voice-1` accept `<break time="0.5s"/>` up to 5 seconds; instant voices return `400` for a `<break>`, so use the `[pause]` audio tag. Single-word IPA uses `<pron ipa="/…/">word</pron>` on public and instant voices only; professional voices take no IPA, so respell the word.
   - **Synthesia:** pauses are inserted with the Pause button or right-click, 0.1 s to 99 s (default 1 s), so write `[PAUSE 1.5s]` in Directions. Pronunciation uses Type Pronunciation with a respelling ("sin-THEE-zhuh") or the IPA option, saved to the workspace Glossary; it needs remastered voices on the `Synthesia Express-Voice` variant. Synthesia reads text literally, so spell out numbers, symbols, and abbreviations in the spoken line ("222" as "two hundred and twenty-two", "mg" as "milligrams"). Speed is per paragraph, 0.8× to 1.2×.
   - For number and acronym normalization in detail, apply the [tts-script-preparer](/skills/marketing/tts-script-preparer) procedure to the Spoken script column.

6. **Write for the avatar, not around it.** Short sentences, one claim each. HeyGen's Avatar 6 "understands what is being said and gestures to match, including pointing, counting, and directional motion", so spoken cues like "three steps" or "on the left" do more than gesture markup. Synthesia's manual gestures (`Nod`, `Head Yes`, `Head No`, `Eyebrows Up`) are "a legacy feature only available for non-expressive avatars"; use them only if the chosen avatar supports them.

7. **Write on-screen text and B-roll notes.** On-screen text: a few words per scene, numbers as digits even when the spoken line spells them out. B-roll: what to show, where it comes from (screen recording, stock, generated, product footage), and which scene needs a figure on screen. Add nothing the brief does not support; mark any claim that needs a source as `[SOURCE NEEDED]`.

8. **Make the localization-ready version.** Rewrite idioms, puns, and culture-bound references in plain terms; keep one language per HeyGen script (HeyGen advises against mixing languages), or assign a voice per paragraph in Synthesia when a scene must mix them. Produce a translation sheet: scene, source line, character limit for the translated line, terms to keep untranslated, pronunciation notes, and on-screen text to translate. Hand terminology to the [localization-glossary-builder](/skills/marketing/localization-glossary-builder) skill before translation starts.

> [!WARNING]
> A missing consent record is a stop, not a note. Scripting a colleague's digital twin or a cloned executive voice without their documented consent goes against HeyGen's moderation policy and Synthesia's consent requirements, and it can mislead viewers. Offer a stock avatar and keep going.

> [!NOTE]
> Directions in the spoken column get read aloud. Keep `[PAUSE]`, pronunciation notes, and avatar directions in their own column unless the target API takes them as text, and even then use only the syntax the tool documents.

## Output

One Markdown document with: the consent check result, the production target, the scene table with character counts, the localization-ready script, the translation sheet, and a checklist of directions the editor operator must apply by hand.

## Example

Excerpt for a fictional "Acme Cloud" onboarding video in HeyGen Studio, stock avatar:

```markdown
Consent: stock avatar, no real person's likeness or voice. OK.

| Scene | Spoken script (chars) | Directions | On-screen text | B-roll |
| --- | --- | --- | --- | --- |
| 1 | Acme Cloud keeps your team's files in one place. Here is how to set it up in three steps. (88) | Pause 0.5 s after "place". Brand Glossary: Acme = "AK-mee" | Set up in 3 steps | Product dashboard, wide |
| 2 | First, invite your team from the Members page. (47) | none | Step 1: Invite | Screen recording: Members page |
| 3 | (pause scene) | Pause-only scene, 1 s | | Logo |

Translation sheet
| Scene | Source line | Max chars | Keep untranslated | Notes |
| --- | --- | --- | --- | --- |
| 1 | Acme Cloud keeps your team's files in one place... | 1,000 | Acme Cloud | "AK-mee" in every language |
```

For voice-only work the [voice cloning](/glossary/voice-cloning) entry explains what the vendors' consent rules cover; [HeyGen](/tools/heygen) and [Synthesia](/tools/synthesia) have their own tool pages.
