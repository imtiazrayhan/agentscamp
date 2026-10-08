---
description: Optical character recognition converts text pictured in a scan or image into machine-readable characters; recognition output still needs source checks.
date: "2026-08-26"
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
- guide:review-ocr-text-against-scans
- tool:abbyy-finereader-pdf
- agent:ocr-fidelity-reviewer
summary: Optical character recognition converts text pictured in a scan or image into machine-readable characters; recognition output still needs source checks.
term: Optical character recognition (OCR)
---

**Optical character recognition, or OCR, converts text pictured in an image or scan into machine-readable characters.** The recognized text can support search or editing, while checking it against the image remains a separate action. [ABBYY's OCR overview](https://pdf.abbyy.com/) describes that digitization task.

OCR output should be treated as a transcription to inspect, not a proof of what every source character says. In the fictional club flyer, a page reads “Meet at R00m 8. Bring the blue folder.” A reviewer checks the enlarged source region and confirms “Room 8.” The correction replaces only `R00m` at Unicode code-point span `[8, 12)` in the frozen text copy. A torn month on another page remains unresolved because its characters cannot be read.

The [OCR-review workflow](/guides/vision/review-ocr-text-against-scans) preserves the raw text and records each proposed repair separately. A tool such as [ABBYY FineReader PDF](/tools/abbyy-finereader-pdf) can be part of the recognition-and-review process. Keep each accepted change connected to the actual page region, rather than treating all similar-looking strings as the same error.

A vision-language model describes a broader capability to work with images and language. OCR names the narrower character-conversion task. Interpreting a document's meaning, inferring a missing word, and modernizing its spelling are different jobs from faithfully recording the pictured text.

The [OCR Fidelity Reviewer](/agents/analytics/ocr-fidelity-reviewer) organizes supplied transcription and source evidence. A structural checker can confirm that a correction's original string matches the stated text slice and does not overlap another edit. It cannot determine the replacement from the image. A human reviewer confirms that evidence before a correction is verified or applied to a separate copy, keeping unreadable regions visible.
