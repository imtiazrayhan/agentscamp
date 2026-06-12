---
name: "multimodal-document-extractor"
description: "Extract structured data from documents and images with a vision-language model — define the target schema, prompt the VLM to fill it from the page (invoices, forms, receipts, statements, IDs), and verify critical fields against the source. Use when you need reliable structured output from messy, varied, or scanned documents that defeat template-based OCR."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["multimodal-ai", "data-ml"]
related: ["vlm-ocr-documents", "qwen3-vl", "structured-output-2026", "llm-output-schema-generator", "llm-evaluation-engineer"]
featured: false
summary: "Turn documents and images into structured data with a vision-language model: define the schema, have the VLM read the page (layout, tables, handwriting) and fill it, then verify the values that matter against the source. Handles the messy, varied documents that defeat template OCR — invoices, forms, receipts, IDs — with faithfulness checks so a hallucinated total or ID is caught, not shipped."
---

Extract structured data from documents and images using a vision-language model, the right way: schema-first, with verification on the fields that matter. VLMs are powerful at reading messy, varied documents that template OCR can't handle — but they can also confidently mis-read an exact value, so this skill pairs extraction with the faithfulness checks that make the output trustworthy.

## When to use this skill

- Pulling structured fields from documents that vary in layout — invoices, receipts, forms, statements, contracts, IDs.
- Scanned, photographed, or handwritten documents where template/positional OCR is brittle.
- You need the result as structured data (a schema) for a database or downstream system, not as free text.

## When NOT to use this skill

- Clean, fixed-format printed text at scale where deterministic OCR is cheaper and sufficient — use traditional OCR.
- General document Q&A or summarization with no structured-output requirement — a plain VLM call is enough.

## Instructions

1. **Define the target schema first.** Specify the exact fields, types, and enums you need, each with a clear description (e.g. `total: number`, `currency: enum`, `line_items: [{description, qty, unit_price}]`). The schema is the contract; design it before prompting. The [llm-output-schema-generator](/skills/api/llm-output-schema-generator) can draft it from a sample.
2. **Pick the model.** Choose an open-weights VLM ([Qwen3-VL](/tools/qwen3-vl)) for self-hosting, privacy, or cost at volume, or a proprietary VLM for maximum capability — decide on measured accuracy for *your* document type, not a benchmark.
3. **Extract with structured output.** Send the page image(s) and prompt the model to fill the schema using the provider's structured-output/JSON mode, so the result conforms instead of being free-form text you parse. See [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).
4. **Handle multi-page and large documents.** Split long documents into pages or logical sections, extract per section, and merge — keeping the page reference for each field so values can be traced back.
5. **Verify the fields that matter.** This is the step that makes it production-grade: cross-check critical values (totals, dates, IDs, amounts) against the source — a second pass, a checksum/arithmetic validation (line items sum to the total), or a traditional OCR comparison. A VLM's confident output is not proof.
6. **Confidence and human review.** Capture or estimate per-field confidence and route low-confidence or failed-validation pages to human review rather than silently committing a guess.
7. **Measure accuracy on real documents.** Evaluate field-level accuracy on a representative, labeled sample (including the hard cases — bad scans, edge formats) before trusting the extractor in production, and hand the eval to the [llm-evaluation-engineer](/agents/data-ai/llm-evaluation-engineer).

> [!WARNING]
> VLMs can hallucinate or transpose an exact value while the surrounding text is perfect — a `$1,240.00` read as `$1,420.00`, a digit dropped from an ID. For anything financial, legal, or identity-related, treat extracted values as unverified until checked against the source. The schema guarantees the *shape*, not the *truth*.

> [!NOTE]
> Prefer arithmetic and cross-field validation where the document gives it to you for free — line items should sum to the subtotal, subtotal plus tax to the total, dates should be plausible. These catch mis-reads no confidence score will.

## Output

A working extractor: the target schema, the VLM extraction call with structured output, multi-page handling, the verification/validation step for critical fields, confidence-based routing to human review, and a field-level accuracy measurement on a representative sample — so the structured data is both well-formed and faithful to the source.
