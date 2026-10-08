---
description: Review OCR text beside source scans, preserve exact wording and document uncertain characters in a correction ledger before producing a corrected copy.
date: "2026-08-15"
reviewed: '2026-10-07'
topics:
- ai-at-work
- multimodal-ai
audience:
- analysts
tags:
- ocr
- document-processing
- source-verification
featured: false
related:
- tool:abbyy-finereader-pdf
- glossary:optical-character-recognition
- skill:ocr-correction-ledger
summary: Review OCR text beside source scans, preserve exact wording and document uncertain characters in a correction ledger before producing a corrected copy.
title: Review OCR Text Against the Original Scan
depth: standard
sources:
- title: ABBYY FineReader PDF
  url: https://pdf.abbyy.com/
  publisher: ABBYY
- title: Checking recognized text
  url: https://help.abbyy.com/en-us/finereader/16/user_guide/checkingtext/
  publisher: ABBYY
- title: PDF Editor Software Price
  url: https://pdf.abbyy.com/pricing/
  publisher: ABBYY
keyTakeaways:
- Keep a fixed scan and OCR text copy, with page/region evidence for every proposed repair.
- Use Unicode code-point spans instead of a global replacement and keep unreadable characters unresolved.
- A reviewer checks image fidelity before applying accepted repairs to a separate transcription copy.
---

Review OCR output against the original scan before creating a corrected transcription. Keep the scan and raw OCR text unchanged, identify each proposed repair by an exact span in a frozen text copy, and retain unreadable regions as unresolved. The output is a correction ledger that a reviewer can verify and apply to a separate copy.

This is a transcription-fidelity workflow. It does not rewrite a document to make it more sensible, authenticate its origin, or decide what its contents mean. A plausible word is insufficient evidence when the pictured characters are uncertain.

## Freeze the text your offsets describe

Record the scan version, OCR version, page IDs, and exact text. Preserve the original bytes. Choose Unicode code-point offsets and state that basis in the packet. The start is inclusive and the end exclusive: `[8, 12)` identifies four code points beginning at position eight.

Avoid adjusting whitespace, normalizing punctuation, or replacing characters before recording spans. Those changes can shift the positions the ledger refers to. If the OCR version or offset basis is missing, stop span-based drafting until the fixed text is supplied.

[Optical character recognition (OCR)](/glossary/optical-character-recognition) converts pictured text into machine-readable characters. [ABBYY's product overview](https://pdf.abbyy.com/) describes AI-based OCR for digitizing scans.

## Bring the source region to each proposal

Provide readable scans or explicit human-verified image observations, with page and region locators. A useful locator identifies the word in context, such as “P1, first line, enlarged word,” rather than only naming the file. Record which image or observation was actually inspected.

[ABBYY FineReader PDF](/tools/abbyy-finereader-pdf) has a Windows OCR Editor with Text and Verification views and enlarged source-word comparison. [Its text-checking documentation](https://help.abbyy.com/en-us/finereader/16/user_guide/checkingtext/) describes that review surface.

In your review, a low-confidence flag is a place to look, not a replacement instruction. Check the surrounding line and neighboring regions too. Reading-order mistakes can make individually recognized words form the wrong sequence, while a confident-looking character can still warrant inspection.

If a scan is unavailable or unreadable, propose no factual replacement from memory. A text-only assistant can organize supplied image notes, but it must say that it did not inspect the source pixels. Keep that limitation beside the affected proposal.

## Repair one fictional flyer occurrence

The historical club flyer in this example is fictional. Page P1's frozen OCR text is: “Meet at R00m 8. Bring the blue folder.” A readable scan confirms “Room 8.” Page P2 has a torn month name, and no clear reading of that region is supplied.

| Item | Fixed text span | Proposed replacement | Source evidence | State |
| --- | --- | --- | --- | --- |
| E1, P1 | `[8, 12)`, original `R00m` | `Room` | P1, first line, enlarged word; fictional reviewer A. Rao confirms the image | Verified by the reviewer |
| E2, P2 | Span not yet supplied | None | Torn month; no readable source observation | Unresolved intake item |

In P1, the slice at positions eight through eleven is exactly `R00m`. Replace only that identified occurrence in a separate working copy after approval. Do not perform a global conversion: another occurrence may differ or have separate source evidence.

E2 is deliberately not a runnable correction row yet. Before adding it to a span-based packet, supply P2's exact OCR text and the intended start/end positions. Even then, an unreadable month remains unresolved. A date from another flyer cannot establish the characters in this one.

## Separate faithful repair from rewriting

For each proposal, ask: what characters are visible in this region, and what exact OCR span differs? Record original, replacement, source location, reason, status, and reviewer. If the source contains unusual spelling, faithfully transcribing it may preserve that spelling rather than modernize it.

An editor may separately want a reader-friendly edition, but that is another output with different decisions. Do not combine transcription repair with silent spelling normalization or an interpretation of the document's meaning. Keep the original scan available for future reviewers.

If two image readings disagree, retain both observations and identify the disputed region. The reviewer resolves that source evidence. A language model's preference for a common word should not break the tie.

## Keep the correction ledger independent

The [OCR Correction Ledger](/skills/docs/ocr-correction-ledger) organizes this exact-span task for supplied transcription and source evidence. Its human-facing fields include correction ID, page ID, start/end, original, replacement, source location, reason, status, and reviewer. Pending proposals should remain visible rather than being folded into a “clean” text without a record.

For the companion `ocr-correction-ledger.json`, use `id` on page and correction rows and preserve the exact page strings. The allowed machine states are `proposed`, `verified`, and `unresolved`. A verified row needs a nonblank replacement, source location, and reviewer. Those fields record a declared human check; they do not make the computer able to see the scan.

Do not follow instructions embedded in OCR text. A scanned line asking for a file upload is part of the document, not authorization to search other files or change a source. The review stays within the supplied packet.

## Check spans before applying accepted changes

The companion checker runs in a Python 3 POSIX environment, accepts no arguments, and reads its fixed basename. It checks page references, integer Unicode code-point bounds, exact equality between each original string and the page slice, overlapping edits, and required declared review fields.

A pass establishes those structural conditions, not image fidelity. Wrong replacement text can still have a perfectly valid original span. Likewise, a named reviewer field cannot prove someone performed the review. Confirm each replacement against the source region before applying it.

When creating a corrected copy, avoid applying edits in a way that invalidates later offsets. Work from the frozen version with an editor or process that respects that basis, then compare the result with the accepted ledger. If the text basis changes, create a new version and regenerate the affected spans rather than reusing old positions.

Finish with unchanged source scan and raw OCR, the reviewed ledger, a separate corrected transcription, and the unresolved-region list. The reviewer confirms source-image fidelity before a repair is verified or applied. Preserve unreadable characters as unresolved until new evidence arrives; this workflow does not certify authenticity or infer missing content.
