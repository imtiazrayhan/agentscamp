---
title: "Add Image Understanding to Your App"
description: "A practical guide to sending images to a vision model and getting reliable, structured results: base64 vs URL, resolution, prompting, cost, and errors."
author: "AgentsCamp"
date: 2026-06-20
color: "blue"
topics: ["multimodal-ai", "llm-app-dev"]
tags: ["vision", "multimodal", "image-understanding", "structured-output", "prompting"]
featured: false
summary: "Send images as base64 or a URL, control resolution to manage cost, and prompt the model to read what's there rather than guess. The reliability move is the same everywhere: constrain output to a schema, verify the fields that matter, and let the model answer UNKNOWN instead of fabricating."
keyTakeaways:
  - "Use base64 (or a provider Files API) for private/local images; use a URL only when the model's servers can reach it publicly. Authenticated, expiring, or localhost URLs will fail."
  - "Resolution is the main cost and latency lever. Providers downscale large images and bill by visual tokens — pre-resize and crop to what the model actually needs."
  - "The content field is an array: you can interleave multiple images and text. Label each image in the prompt so the model knows which is which."
  - "Don't trust a parsed result — verify totals, IDs, and dates against the source. VLMs produce confident, well-formatted output even when they mis-read a value."
  - "Force structured output against a schema and explicitly allow UNKNOWN, so the model abstains on illegible fields instead of hallucinating a plausible one."
howtoSteps:
  - name: "Choose how to pass the image"
    text: "Base64-encode local or private images inline; use a public URL only when the provider's servers can fetch it. For images reused across calls, upload once via the Files API and reference the file id."
  - name: "Right-size resolution before you send"
    text: "Downscale and crop to the smallest size where the relevant detail is still legible. Providers resize oversized images anyway and bill by visual tokens, so sending a 4K screenshot wastes money and latency for no accuracy gain."
  - name: "Interleave images and text in the content array"
    text: "Put each image as its own content block and reference them by position or label in the prompt ('Image 1 is the front of the ID, Image 2 is the back') so the model attributes detail to the right image."
  - name: "Prompt for accurate reading, not plausible guessing"
    text: "Tell the model to transcribe only what is visible, ask for evidence ('quote the line you read it from'), and instruct it to return UNKNOWN for anything illegible or absent rather than inferring."
  - name: "Constrain output to a schema"
    text: "Use the provider's structured-output mode with an explicit schema (fields, types, enums, and a null/UNKNOWN option per field). Validate the parsed result before it enters your system."
  - name: "Verify the fields that matter"
    text: "Re-check high-stakes values — totals, account numbers, dates — against the source or a second pass, and route low-confidence or UNKNOWN results to human review."
  - name: "Control cost and latency"
    text: "Lower resolution, send fewer images per call, cache stable prompt prefixes, and pick the smallest model that clears your accuracy bar on a representative sample."
faq:
  - q: "Should I send images as base64 or a URL?"
    a: "Use base64 for anything local or private — the image data travels inside your request, so the model never needs network access to it. Use a URL only when the image is publicly reachable by the provider's servers at request time; authenticated links, expiring signed URLs, and localhost will fail because the provider can't fetch them. If you reuse the same image across many calls, upload it once through the provider's Files API and reference it by id to avoid re-encoding and to keep request payloads small. Base64 is the safe default for app backends processing user uploads."
  - q: "How do I stop a vision model from hallucinating values?"
    a: "Two moves together. First, prompt for grounded reading: tell the model to transcribe only what is visible, to quote the text it read a value from, and to return UNKNOWN (or null) for anything illegible, cropped, or absent rather than guessing. Second, constrain the output to a schema with an explicit null/UNKNOWN option on every field, so abstaining is a valid, structured answer instead of a parsing failure. Then verify the fields that matter — totals, IDs, dates — against the source. A VLM will produce confident, well-formatted output even when it mis-read a digit, so 'it parsed' is not 'it's correct.'"
  - q: "How does image resolution affect cost and accuracy?"
    a: "Vision models bill images by visual tokens, which scale with pixels, and they downscale anything larger than their native limit before processing — so a 4K image and a downscaled version of it can cost the same and convey the same detail. More resolution helps only up to the point where the relevant text or detail is legible; beyond that you pay more for nothing. The practical rule: crop to the region you care about and downscale to the smallest size where that region is still readable. Sending oversized images is the most common avoidable cost in vision apps."
  - q: "Can I send multiple images in one request?"
    a: "Yes. The message content is an array, so you can interleave several image blocks with text and the model reasons over them jointly — useful for comparing a before/after, the front and back of a document, or a sequence of frames. Providers cap the number of images per request and the total request size, and every image adds tokens, latency, and cost. Label each image in your prompt ('Image 1…', 'Image 2…') so the model attributes details to the correct one, and don't pad a request with images the task doesn't need."
  - q: "Is vision provider-specific, or does the same approach work everywhere?"
    a: "The mechanics differ slightly — Claude, GPT, and Gemini each have their own way of passing images, controlling resolution, and a Files API for reuse — but the reliability pattern is identical across all of them: pass the image (base64 for private), right-size resolution, prompt for grounded reading with an UNKNOWN escape hatch, force structured output against a schema, and verify critical fields. Build your app around that pattern and switching providers is a thin adapter, not a rewrite."
related: ["skill:multimodal-document-extractor", "skill:llm-output-schema-generator", "guide:vlm-ocr-documents", "guide:structured-output-2026", "guide:choosing-the-right-model", "guide:vision-language-models-compared-2026"]
---

Adding image understanding to an app is mostly a solved problem now — the frontier models from Anthropic, OpenAI, and Google all take images natively, and the call looks almost identical to a text call. The hard part isn't sending the image; it's getting an answer you can act on. A vision-language model will happily return a confident, well-formatted total that's off by a digit. This guide is the practical path: how to pass images, how to control resolution and cost, and — the part that actually matters — how to prompt and structure output so the model **reads what's there instead of guessing**.

The mechanics below are provider-neutral but accurate for Claude, GPT, and Gemini vision. Where the providers differ, it's in the wire format, not the strategy.

## Passing images: base64 vs URL vs Files API

Every provider accepts an image one of three ways, and the choice is about reachability, not preference.

- **Base64** embeds the encoded image directly in your request. This is the right default for an app backend: it works for local files and private user uploads because the data is *in* the request — the model never needs to fetch anything.
- **URL** has the provider's servers fetch the image at request time. That only works for **publicly reachable** images. Authenticated URLs, expiring signed S3 links, and `localhost` all fail, because the provider can't see them. If the image is private, base64 it.
- **Files API** lets you upload an image once and reference it by id across many calls. Use it when you reuse the same image repeatedly, or when many/large images would blow past request-size limits — referencing by id keeps the payload small and skips re-encoding.

All three providers support the common web formats (JPEG, PNG, GIF, WebP). Animated formats are read as a single frame, not the animation. PDFs are a related case — Claude and Gemini can take a PDF directly and rasterize the pages server-side, while with other stacks you convert pages to images yourself first; either way each page becomes an image and is billed and resized like one.

One subtlety worth knowing: when a provider fetches a URL, that fetch happens on *their* network at request time, so it adds latency and a failure mode you don't control. Base64 trades a larger request payload for a fetch you've already done and can retry locally. For an app serving user uploads, that trade almost always favors base64.

## Multiple images and resolution trade-offs

The message content is an **array**, not a string — you interleave image blocks and text in any order, and the model reasons over them jointly. That's how you do before/after comparisons, front-and-back of an ID, or a short sequence of frames. Two rules:

1. **Label your images in the prompt.** "Image 1 is the receipt, Image 2 is the corresponding bank line." Without labels the model can blur details across images.
2. **Don't over-send.** Each provider caps images per request and total request size, and every image costs tokens and latency. More images is not more context if half of them are irrelevant.

Resolution is the single biggest lever you control. Models tokenize images by area (Claude, for instance, charges roughly one visual token per 28×28-pixel patch; GPT tiles high-detail images into 512px tiles; Gemini exposes an explicit `media_resolution` setting) — and crucially, **they downscale anything above their native resolution before processing**. The consequence is unintuitive but freeing: a 4K screenshot and a downscaled copy of it often cost the same *and* convey the same detail, because the extra pixels are thrown away. So:

> **Crop to the region you care about, then downscale to the smallest size where that region is still legible.** Sending raw 4K images is the most common avoidable cost in a vision app — you pay for pixels the model discards.

The flip side: don't starve the model. If the task is reading small text or a dense table, too-aggressive downscaling makes the text unreadable and accuracy collapses. Pre-resize deliberately and inspect what you're actually sending.

## Prompting for accurate reading, not hallucination

This is where vision apps live or die. A VLM is a generative model; given a blurry digit, its instinct is to produce a *plausible* one. You counter that with the prompt:

- **Transcribe, don't infer.** Tell it explicitly to report only what is visible and to never guess values it can't read.
- **Ask for evidence.** "For each field, quote the exact text you read it from." This both improves accuracy and gives you something to audit.
- **Give it an out.** Instruct the model to return `UNKNOWN` (or `null`) for any field that is illegible, cropped, or absent. An honest abstention is worth far more than a confident fabrication — **"say UNKNOWN rather than guess" is the single most valuable line in a vision prompt.**
- **Be specific about format.** If you need coordinates or bounding boxes, ask for absolute pixel coordinates and state the format; models are unreliable with vague or normalized coordinate requests.

## Getting structured output you can trust

Prose answers are unparseable and invite rambling. For anything that feeds your system, force the model into a schema.

Define the exact fields, types, and enums you want, with a `null`/`UNKNOWN` option on **every** field so abstaining is a valid structured answer rather than a parse failure. Then use the provider's structured-output / JSON mode so the response conforms, and validate it before it goes anywhere. Generate the schema from an example with the [llm-output-schema-generator](/skills/api/llm-output-schema-generator) skill, and see [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026) for how the providers' modes differ.

The end-to-end loop — schema, VLM extraction, field verification — is packaged in the [multimodal-document-extractor](/skills/data/multimodal-document-extractor) skill. For document- and OCR-specific tactics (tables, scans, handwriting, when a dedicated parser beats a VLM), see [Using VLMs for OCR and Documents](/guides/vision/vlm-ocr-documents).

The critical step structured output does *not* give you for free is **verification**. JSON that parses is not data that's correct. For high-stakes fields — totals, account numbers, dates — re-check the value against the source (or a second pass), and route any `UNKNOWN` or low-confidence result to human review. Treat the model as a fast first reader, not a final authority.

A few verification patterns earn their keep in production. **Cross-field arithmetic**: if you extract line items and a total, sum the items and flag any mismatch — a wrong digit usually breaks the math. **Second-pass agreement**: for the highest-stakes fields, run the extraction twice (or with two models) and only auto-accept when both agree, escalating disagreements. **Format and checksum validation**: account numbers, IBANs, and dates often have a checkable structure, so a regex or checksum catches mis-reads the model is blind to. None of these is exotic; they're the difference between a demo and something you'd let touch real money.

## Controlling cost and latency

Vision tokens add up fast — a single high-resolution page can cost more than a long text prompt. The levers, in order of impact:

- **Resolution.** Covered above; this is your biggest win. Downscale and crop ruthlessly.
- **Fewer images per call.** Send only what the task needs.
- **Smaller model.** Many vision tasks (reading a clear label, classifying a photo) don't need a frontier model. Pick the cheapest model that clears your accuracy bar on a representative sample — see [Choosing the Right Model](/guides/getting-started/choosing-the-right-model), and [Vision Language Models Compared](/guides/vision/vision-language-models-compared-2026) for how the current options stack up.
- **Prompt caching.** Keep the stable parts of your prompt (system instructions, schema, few-shot examples) at the front so they can be cached across calls; put the variable image and question at the end.

## Error and uncertainty handling

Two failure classes, handled separately. **Hard errors** — unsupported format, oversized request, a URL the provider couldn't fetch — return API errors; validate image size and format before you send, and fall back to base64 if a URL fetch fails. **Soft errors** are worse because they look like success: the model returns clean, schema-valid JSON with a wrong value. Your defenses are the ones above — the `UNKNOWN` escape hatch, evidence quotes, and source verification of critical fields — plus a confidence threshold that sends anything uncertain to a human. Design for the soft case from day one; it's the one that ships bad data quietly.

## Continue exploring

- [Screenshot-to-Code: Building UIs from Images with AI](/guides/vision/screenshot-to-code-with-ai) — Turn a screenshot, mockup, or Figma frame into working frontend code with AI vision models — the realistic workflow, the right tools, and the honest pitfalls.
