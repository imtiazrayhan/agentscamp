---
title: "Multimodal RAG over PDFs, Scans & Charts: Two Approaches That Actually Work"
description: "RAG over visual documents — PDFs, scans, charts — where text-only extraction loses tables and layout. Parse-then-text vs embed-the-page-image, with trade-offs."
author: "AgentsCamp"
color: "green"
topics: ["multimodal-ai", "rag-retrieval"]
tags: ["multimodal-rag", "pdf", "vlm", "ocr", "embeddings", "retrieval"]
related:
  - "guide:vlm-ocr-documents"
  - "guide:how-rag-works"
  - "skill:chunking-strategy-optimizer"
  - "skill:multimodal-document-extractor"
  - "glossary:vision-language-model"
featured: false
date: 2026-06-17
summary: "Text-only PDF extraction silently drops tables, figures, and layout. Two approaches fix this: parse to clean markdown with a layout/OCR model then run normal text RAG, or embed page images with vision embeddings and retrieve regions. Parse-then-text is cheaper and more debuggable; embed-the-image wins on dense visuals you can't reliably transcribe."
keyTakeaways:
  - "Naive PDF→text loses tables, reading order, figures, and chart values — the information your users actually ask about."
  - "Two viable paths: (1) parse to structured markdown with a layout/VLM model, then standard text RAG; (2) embed page images directly with multimodal embeddings."
  - "Default to parse-then-text: it's cheaper, debuggable, and reuses your text retrieval stack. Reach for image embeddings only when transcription is unreliable."
  - "Chunk by page or layout region, never by raw character count — preserve table and figure boundaries."
  - "At generation, pass the cropped image for visual questions and extracted text for factual lookups; passing both costs tokens and can confuse the model."
  - "Evaluate retrieval with page-level and region-level labels, not just final answer correctness."
faq:
  - q: "Should I parse PDFs to text or embed the page images?"
    a: "Start with parse-to-markdown plus standard text RAG — it's cheaper, debuggable, and reuses your existing stack. Switch to or add image embeddings only when transcription is unreliable: dense tables, handwriting, complex charts, or mixed-language scans where OCR drops critical values."
  - q: "Do I need a vector database for multimodal RAG?"
    a: "Yes, the same way you do for text RAG. Image-embedding approaches store one or more vectors per page or region; parse-then-text approaches store text-chunk vectors. The retrieval index is unchanged — only what you embed differs."
  - q: "How do I handle charts and figures that have no extractable text?"
    a: "Caption them with a vision-language model at ingestion (describe the chart, its axes, and the trend), embed the caption alongside the cropped image, and store the crop so you can pass it to the generation model when that region is retrieved."
howtoSteps:
  - name: "Inventory document types and failure modes"
    text: "Sample your real corpus. Flag pages with tables, multi-column layout, charts, handwriting, or scans. These are where text-only extraction fails and where you'll spend your effort."
  - name: "Choose an ingestion path per document class"
    text: "Use parse-to-markdown for born-digital and clean scans; use page-image embedding for dense visuals, complex tables, or unreliable OCR. You can mix paths within one corpus."
  - name: "Extract with layout preservation"
    text: "Run a layout-aware OCR or VLM that emits markdown with tables as tables and reading order intact. Crop figures and caption them with a VLM. Keep page and bounding-box metadata."
  - name: "Chunk by page or layout region"
    text: "Split on page or section boundaries, never raw character counts. Keep each table and figure whole. Attach source page, region, and the image crop to each chunk."
  - name: "Embed and index"
    text: "Embed text chunks with a text model, or page/region images with a multimodal model, into your vector database with the metadata. Store the original crops for generation."
  - name: "Retrieve, then pass the right modality to the model"
    text: "Retrieve top-k chunks or regions. Pass extracted text for factual lookups and the cropped image for visual questions. Cite the page so users can verify."
  - name: "Evaluate at the retrieval layer"
    text: "Label queries with the correct page and region. Measure recall@k and region precision separately from final answer quality so you know whether failures are retrieval or generation."
---

**Text-only PDF extraction silently drops the information your users ask about — tables collapse into word soup, reading order scrambles across columns, and charts vanish entirely — so RAG over visual documents needs an ingestion pipeline that preserves layout and, sometimes, the pixels themselves.** This guide covers the two approaches that work in production and when each is worth the cost.

## Why naive PDF→text loses information

Run a typical `pdf-to-text` extractor and you get a stream of characters with no structure. The damage is specific:

- **Tables flatten.** Row and column relationships are gone; a financial table becomes an unordered list of numbers no model can re-associate.
- **Reading order scrambles.** Multi-column layouts, sidebars, and footnotes interleave. The model reads a sentence that never existed.
- **Figures and charts disappear.** A bar chart carries no extractable text. Its values — the thing the page exists to communicate — are simply absent.
- **Scans return nothing.** Image-only PDFs have no text layer at all without OCR.

If your corpus is born-digital prose (clean reports, docs, contracts), text extraction may be fine. The moment tables, charts, or scans appear, you need something better. See [VLMs for OCR & document extraction](/guides/vision/vlm-ocr-documents) for the extraction layer this builds on.

## The two approaches

### Approach 1: Parse to structured text, then do normal RAG

Use a layout-aware OCR engine or a [vision-language model](/glossary/vision-language-model) to convert each page into clean **markdown** — tables stay as tables, headings stay as headings, reading order is correct. Open-source converters like [Docling](/tools/docling) and [Marker](/tools/marker) handle this locally, while hosted parsers like [LlamaParse](/tools/llamaparse) and [Reducto](/tools/reducto) trade cost for higher accuracy on dense tables and figures. Then run a standard text [RAG pipeline](/guides/concepts/how-rag-works): chunk, embed, retrieve.

This is the right default. It is cheaper at query time (text [embeddings](/glossary/embedding) are small and fast), debuggable (you can read exactly what got indexed), and it reuses your existing [vector database](/glossary/vector-database) and retrieval stack. The [multimodal-document-extractor skill](/skills/data/multimodal-document-extractor) automates the schema-driven version of this.

The failure mode: extraction errors are now baked in. If the VLM misreads a digit in a table, no downstream retrieval can recover it. Spot-check transcription quality on your hardest pages before trusting it.

### Approach 2: Embed the page images directly

Skip transcription. Embed each page image (or cropped region) with a **multimodal embedding model**, store the vectors, and at query time retrieve the image regions whose embeddings best match the query embedding. The model that answers sees the actual pixels.

This wins where transcription is unreliable: dense numeric tables, handwriting, low-quality scans, mixed-language documents, and charts whose meaning lives in the geometry. It also sidesteps the brittle parse step entirely.

The costs are real: multimodal embeddings are larger and slower, the index is bigger, you cannot eyeball what was indexed, and passing images to the generation model burns far more tokens than text. Treat it as the specialist tool, not the default.

## Handling tables and figures

Regardless of approach, treat these as first-class objects at ingestion:

- **Tables:** Extract structure (markdown or HTML tables), not flattened text. Keep each table as a single, intact chunk. If a table is too large, split by row groups with the header repeated.
- **Figures and charts:** Crop the region and **caption it with a VLM** — describe what it shows, the axes, and the trend. Embed the caption (text RAG) or the crop (image RAG), and store the crop so you can hand it to the generation model when that region is retrieved.

## Chunking visual documents

The cardinal rule of [chunking strategy](/skills/data/chunking-strategy-optimizer) applies harder here: **never split by raw character count.** Split on natural boundaries:

- By **page** — the simplest unit, and the one users cite.
- By **layout region** — heading + its body, a whole table, a figure + caption.

Attach metadata to every chunk: source page number, bounding box, document ID, and (for image RAG) the path to the cropped image. That metadata is what lets you cite sources and pass the right artifact to the model.

## Multimodal vs text embeddings: the trade-off

| | Text embeddings (parse-then-text) | Multimodal embeddings (embed image) |
|---|---|---|
| Query cost | Low | Higher |
| Index size | Small | Large |
| Debuggability | High — read the text | Low — opaque vectors |
| Robust to bad OCR | No | Yes |
| Dense visuals/charts | Weak | Strong |

A pragmatic hybrid: parse-then-text for the whole corpus, plus image embeddings only for pages flagged as visually dense. You get a cheap, debuggable baseline and a fallback for the hard pages.

## Passing retrieved content to the generation model

Match the modality to the question:

- **Factual lookups** ("what was Q3 revenue?") → pass the **extracted text**. It's cheaper and the model reads numbers reliably from clean markdown.
- **Visual questions** ("which region of this diagram is the bottleneck?") → pass the **cropped image**.

Avoid reflexively passing both. Sending image + text for every chunk multiplies token cost and can actually degrade answers by giving the model conflicting or redundant context. Always include the page citation so users can verify.

## Evaluating multimodal retrieval

Final answer accuracy hides where failures originate. Evaluate the retrieval layer directly:

- Build a labeled set of queries → correct **page and region**.
- Measure **recall@k** and region precision separately from answer quality.
- When an answer is wrong, check first whether the right region was even retrieved. Retrieval misses and generation misses need different fixes.

## When it's worth the extra cost

Multimodal RAG adds real complexity — VLM extraction, image storage, larger indexes, higher token bills. Reach for it only when text-only RAG demonstrably fails on your corpus: when users ask about tables, charts, scanned forms, or layout, and a text-only baseline can't answer. Start with parse-then-text, measure where it breaks, and add image embeddings surgically on the document classes that need them.

## Numbered procedure

1. **Inventory document types and failure modes.** Sample your real corpus; flag pages with tables, multi-column layout, charts, handwriting, or scans.
2. **Choose an ingestion path per document class.** Parse-to-markdown for clean docs; page-image embedding for dense visuals or unreliable OCR. Mixing is fine.
3. **Extract with layout preservation.** Emit markdown with intact tables and reading order; crop and caption figures; keep page and bounding-box metadata.
4. **Chunk by page or layout region.** Never by character count. Keep tables and figures whole; attach source metadata and image crops.
5. **Embed and index.** Text chunks via a text model, or page/region images via a multimodal model, into your vector database with metadata.
6. **Retrieve, then pass the right modality.** Text for factual lookups, cropped image for visual questions; always cite the page.
7. **Evaluate at the retrieval layer.** Label correct page and region; measure recall@k and region precision separately from answer quality.