---
name: "tts-script-preparer"
title: "TTS Script Preparer"
description: "Prepare a script for text-to-speech on a named engine: expand numbers, dates, currencies, units, URLs, and acronyms into the words the voice should say; add pronunciation fixes in the form that engine accepts (IPA, phoneme tags, pronunciation dictionaries, glossary entries, or plain respelling); and mark pauses with syntax the engine supports. It asks for the target engine, model, and voice type first and never assumes SSML. Returns the prepared script plus a change log of every edit. Use before generating a voiceover with ElevenLabs, HeyGen, Synthesia, or another TTS engine, or when a voice keeps misreading numbers and names."
version: "1.0.0"
allowed-tools: "Read, Write"
user-invocable: true
color: "cyan"
date: 2026-11-10
topics: ["multimodal-ai", "ai-at-work"]
audience: ["marketers", "developers"]
tags: ["claude", "text-to-speech", "voiceover", "ssml", "pronunciation", "marketers"]
featured: false
related: ["glossary:text-to-speech", "tool:elevenlabs", "tool:heygen", "tool:synthesia", "skill:avatar-video-script-writer", "guide:best-tts-apis-2026", "skill:localization-glossary-builder", "skill:brand-voice-profiler"]
seoDescription: "A Claude skill that prepares a script for text-to-speech: normalized numbers and dates, engine-specific pronunciation and pauses, and a log of every edit."
summary: "Give this skill a script and the target TTS engine and it rewrites the text so the voice says what you mean: numbers, dates, currencies, URLs, and acronyms spelled out, pronunciation fixes in the form that engine accepts, and pauses only in syntax it supports. It never assumes SSML, since some models reject break tags. Returns the script and a change log."
---

[Text-to-speech](/glossary/text-to-speech) engines read what you write, and they disagree about how. The W3C's SSML 1.1 standard defines `break`, `say-as`, `phoneme`, and `sub`, but it does not even fix the values `say-as` accepts ("SSML only specifies the say-as element ... It does not enumerate the possible values"), and several current engines reject markup outright. ElevenLabs documents that "Eleven v4 and Eleven v3 do not support SSML break tags". HeyGen's TTS API returns `400 invalid_parameter` for a `<break>` tag on an instant voice, including every Turbo request. So this skill starts by asking which engine, model, and voice will read the script, then rewrites the text for that target: normalized numbers and abbreviations, pronunciation fixes in the engine's own mechanism, and pauses only where the engine can take them. Every edit goes into a change log so a reviewer can check it before anyone pays for a render.

## When to use this skill

- A voiceover script is final and about to go to a TTS engine or an avatar video tool.
- A generated voice keeps misreading prices, dates, product names, or acronyms.
- The same script will be voiced on more than one engine and needs a version for each.
- You are moving a script from an engine that took SSML to one that does not.

## When NOT to use this skill

- Writing the script itself, scenes and all, for an avatar video: the [avatar-video-script-writer](/skills/marketing/avatar-video-script-writer) skill (it calls this procedure for its spoken lines).
- Translating the script. Build the term list first with the [localization-glossary-builder](/skills/marketing/localization-glossary-builder) skill, then prepare each translated script separately.
- Choosing an engine: [the best TTS APIs](/guides/voice/best-tts-apis-2026) compares them.

## Instructions

1. **Ask for the target before touching the text.** Engine and model (for ElevenLabs, the model ID such as `eleven_v4`), voice type (HeyGen professional or instant voice; a Synthesia voice and whether it is a remastered Express-Voice), the surface (an editor UI where pauses are buttons, or an API where they are text), and the locale for dates and numbers. If the user does not know, prepare an engine-neutral version: plain text with no markup of any kind, and say so in the report.

2. **Look up what the target accepts.** Use only the mechanisms in this table; if the target is not listed, ask for its documentation rather than guessing:

   | Target | Pauses | Pronunciation | Limits and notes |
   | --- | --- | --- | --- |
   | ElevenLabs Eleven v4 (`eleven_v4`) | No SSML. Dashes (`-` or `--`) for short pauses, ellipses (`...`) for hesitation; ElevenLabs notes these "are less consistent" | IPA between slashes inside the text, `"/ˌbaɪoʊˈkemɪstri/"`, with primary (ˈ) and secondary (ˌ) stress marks | 100,000-character limit. Audio tags such as `[whispers]`, `[sighs]`, `[excited]`; prefer descriptive tags (`[low, gravelly voice]`) because a tag can be read as a sound-effect request |
   | ElevenLabs Eleven v3 | No SSML break tags; same alternatives as v4 | Pronunciation dictionary (below) where your surface applies it; otherwise respell in plain text | 5,000-character limit; audio tags as in v4 |
   | ElevenLabs, other models | `<break time="1.5s" />`, up to 3 seconds; too many break tags in one generation "can cause instability" | Pronunciation dictionary; phoneme tags only on `eleven_flash_v2`, one word per tag: `<phoneme alphabet="cmu-arpabet" ph="M AE1 D IH0 S AH0 N">Madison</phoneme>` | Multilingual v2: 10,000 characters; Flash v2.5: 40,000. Smaller models normalize poorly, so expand everything in step 3 |
   | ElevenLabs pronunciation dictionary | — | Upload TXT or `.PLS`; alias rule `<lexeme><grapheme>UN</grapheme><alias>United Nations</alias></lexeme>`. Matching is case-sensitive and only the first replacement is used | Applies in ElevenCreative Studio, Dubbing Studio, and the API |
   | HeyGen TTS API, professional voice on `heygen-voice-1` | `<break time="0.5s"/>`, up to 5 seconds each. No other SSML | No IPA: HeyGen applies `<pron>` and `pronunciation_dictionary` to public and instant voices only, so respell in plain text | `text` is 1 to 10,000 characters of plain prose. Language is a lowercase ISO 639-1 base code; a regional tag such as `en-US` returns `400` |
   | HeyGen TTS API, public or instant voice (every Turbo request) | `<break>` returns `400 invalid_parameter`. Use the audio tag `[pause]` | One word: `<pron ipa="/ʃɪˈvɔːn/">Siobhan</pron>`. Many words: `pronunciation_dictionary`, up to 100 terms, each IPA value between slashes. Works on `heygen-voice-1` and `heygen-voice-1-turbo`, not Turbo Free | Tags are English words in square brackets even in other languages; no closing tags like `[/happy]`. Span tags (`[warm]`, `[calm]`) do not carry past a chunk of about 233 characters, so repeat them |
   | HeyGen Studio editor | Pause button: each pause is half a second, adjustable in 0.5-second steps; a pause-only scene between sections. Commas give shorter breaks, periods longer ones with a downward inflection | Double-click a word, then Pronunciation (per instance, for example "AI" as "a-eye"); Brand Glossary for the whole project | Script import: 1,000 characters per segment, one segment per scene. Avoid mixing languages in one script |
   | Synthesia Studio | Pause button or right-click, 0.1 s to 99 s (default 1 s); not typed markup | Type Pronunciation with a respelling ("sin-THEE-zhuh"), or the IPA option; save to the workspace Glossary. Needs remastered voices on the `Synthesia Express-Voice` variant | Reads text literally. Speed per paragraph, 0.8× to 1.2×. Script per scene up to 5 minutes |
   | Any other engine | SSML only if its docs say so: `<break time="250ms"/>` or `strength` from `none` to `x-strong` | SSML `<sub alias="...">` and `<phoneme ph="...">` only if documented; `say-as` values differ by vendor | Default to plain text |

3. **Normalize the text.** Spell out anything the voice could read two ways. Engines normalize by default (ElevenLabs enables it for all TTS models), but smaller models get it wrong: ElevenLabs' own example is Flash v2.5 reading "$1,000,000" as "one thousand thousand dollars". Write the words yourself:
   - **Currency:** "$45.67" → "forty-five dollars and sixty-seven cents".
   - **Phone numbers:** "123-456-7890" → "one two three, four five six, seven eight nine zero".
   - **Dates:** locale decides. "01/02/2023" is "January second, twenty twenty-three" in the US and "the first of February, twenty twenty-three" elsewhere. Ask if the locale is unclear; never guess an ISO date like "2024-01-01".
   - **Years and times:** "2012" → "twenty twelve"; decide from context whether "01:18" is a clock time or a duration ("one minute and eighteen seconds").
   - **Percentages, units, fractions:** "100%" → "one hundred percent"; "mg" → "milligrams"; "3/8" → "three eighths of an inch" when it is a measurement.
   - **Abbreviations:** "Dr." → "Doctor"; "St." → "Street", except in names such as "St. Patrick".
   - **URLs:** "example.com/docs" → "example dot com slash docs".
   - **Acronyms:** decide letters or word for each one, and write it that way (or put it in the engine's dictionary): "AWS" as "a-double you-s", "UN" as "United Nations".

4. **Fix pronunciation in the engine's own mechanism.** List every name, brand, and term of art. For each, choose the mechanism from step 2: a dictionary or glossary entry for terms that recur, inline IPA or a respelling for one-offs. Prefer dictionary and glossary entries when captions come from the script: HeyGen notes that pronunciations "change the audio only; captions and subtitles keep the original spelling", whereas a respelling typed into the script shows up in the captions. Mark every IPA string or respelling you proposed for a name you could not verify as "proposed, confirm by listening".

5. **Add pauses only where meaning needs them.** After a headline, between sections, before a key number, after a question. Use the target's syntax from step 2. Do not stack break tags, and do not put markup into a script bound for an engine that rejects it.

6. **Split for limits and language.** Keep each chunk under the target's limit, cutting at paragraph ends. One language per script for HeyGen; Synthesia can mix languages by assigning different voices to paragraphs. Speed is a setting, not text: ElevenLabs accepts 0.7 to 1.2, Synthesia 0.8× to 1.2× per paragraph.

7. **Write the change log.** One row per edit: line, original, prepared text, reason, mechanism. Add a "listen for" list of the edits most likely to need a second take; Synthesia notes its voices are non-deterministic, so a regenerate can change a reading.

> [!WARNING]
> Never send SSML to a target that has not documented it. A `<break>` tag is unsupported on ElevenLabs Eleven v4 and v3 and returns a `400` error on HeyGen instant voices. When the target is unknown, the safe output is plain text with words spelled out.

> [!NOTE]
> Keep the original script next to the prepared one. On-screen text, captions, and the published transcript should usually show "$45.67", not "forty-five dollars and sixty-seven cents".

## Output

The prepared script, in one block per chunk with the target named at the top, followed by the change log table and the "listen for" list.

## Example

Target: HeyGen TTS API, professional voice on `heygen-voice-1`, locale en (US).

```markdown
### Prepared script
Acme Cloud now costs forty-five dollars and sixty-seven cents a month. <break time="0.5s"/>
Call one two three, four five six, seven eight nine zero, or visit acme dot example slash pricing.
Ask for shih-VAWN on the a-double you-s team.

### Change log
| Line | Original | Prepared | Reason | Mechanism |
| --- | --- | --- | --- | --- |
| 1 | $45.67/mo | forty-five dollars and sixty-seven cents a month | currency | spelled out |
| 1 | (none) | <break time="0.5s"/> | pause before contact details | professional-voice break tag |
| 2 | acme.example/pricing | acme dot example slash pricing | URL | spelled out |
| 3 | Siobhan | shih-VAWN | name | respelling, since professional voices take no IPA (proposed, confirm by listening) |
| 3 | AWS | a-double you-s | acronym read as letters | respelling (captions use the original script) |

### Listen for
- "Siobhan" (proposed respelling)
```

For the same script on an instant HeyGen voice, the skill would swap the break tag for `[pause]` and the respelling for `<pron ipa="/ʃɪˈvɔːn/">Siobhan</pron>`; for ElevenLabs Eleven v4, it would remove the tag and use a dash. The [brand-voice-profiler](/skills/marketing/brand-voice-profiler) skill keeps the wording on brand before this step; [ElevenLabs](/tools/elevenlabs), [HeyGen](/tools/heygen), and [Synthesia](/tools/synthesia) have their own pages.
