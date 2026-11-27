---
name: "Marker"
title: "Marker"
description: "Open-source pipeline that converts PDFs, images, and Office docs into clean Markdown, JSON, or HTML fast, with optional LLM assist for tables and equations."
url: "https://www.datalab.to"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/datalab-to/marker"
license: "Apache-2.0"
sameAs: ["https://github.com/datalab-to/marker", "https://documentation.datalab.to"]
color: "orange"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["pdf", "markdown", "ocr", "document-conversion", "rag"]
featured: false
alternativeTo: ["docling", "unstructured", "llamaparse", "reducto"]
summary: "Marker is an open-source Python pipeline from Datalab that converts PDFs, images, PPTX, DOCX, XLSX, HTML, and EPUB into clean Markdown, JSON, or HTML. It runs locally on GPU, CPU, or Apple MPS, preserves tables, equations, and code, and can optionally call an LLM for accuracy-critical pages."
related: ["guide:how-rag-works", "guide:multimodal-rag-images-pdfs", "guide:vlm-ocr-documents", "skill:chunking-strategy-optimizer"]
faq:
  - q: "What is Marker?"
    a: "Marker is an open-source document-conversion pipeline from Datalab. It turns PDFs, images, and Office formats into clean Markdown, JSON, or HTML, preserving tables, equations, forms, and code while stripping headers, footers, and other clutter. It builds on the Surya OCR and layout models and runs on your own hardware."
  - q: "Is Marker free?"
    a: "The Marker code is open source under Apache-2.0 and free to use, including commercially. Its model weights use a modified AI Pubs Open Rail-M license that is free for research and personal use, and free commercially only for organizations under $5 million in both prior-year revenue and total funding; it also bars use by companies offering a product that competes with Datalab's. Commercial self-hosting beyond those limits requires a license, and Datalab also offers a hosted API (with one-time free credit) running its higher-accuracy Chandra model."
  - q: "How do I use Marker?"
    a: "Install the marker-pdf package, then run marker_single on a file or marker on a folder to emit Markdown, JSON, or HTML. It uses GPU, CPU, or Apple MPS automatically. Add the --use_llm flag to route tricky tables, inline math, and form fields through an LLM such as Gemini, Claude, or a local Ollama model for higher accuracy."
  - q: "Which Marker mode should I use?"
    a: "Marker picks a default by device: balanced on a GPU and fast on CPU or Apple MPS. Use no_ocr for bulk born-digital PDFs where speed matters most, fast for laptops, CI, and CPU containers, balanced for mixed production documents with tables, math, and scans, and vllm when accuracy on degraded scans, handwriting, or dense equations matters more than throughput."
---

Marker is an **open-source pipeline from Datalab** that converts documents into clean, structured text. It accepts PDFs, images, PPTX, DOCX, XLSX, HTML, and EPUB and outputs Markdown, JSON, chunks, or HTML, which makes it a common ingestion step for RAG pipelines and LLM workflows that need readable text out of messy source documents. It runs on your own hardware, so documents never leave it unless you opt into an LLM pass.

## Highlights

- **Structure, not just text.** Marker formats tables, forms, equations, inline math, links, references, and code blocks, extracts images, and removes page furniture such as headers and footers.
- **Four conversion modes.** `--mode no_ocr` reads the embedded PDF text layer with no OCR calls. `fast` (the default on CPU and Apple MPS) adds in-process ONNX layout and OCR with no model server. `balanced` (the default on GPU) keeps clean prose pages on CPU and routes equations, complex tables, non-Latin scripts, and scans to a vision-language model. `vllm` runs that model on every page.
- **Datalab's own models.** Layout and reading order come from Indra ONNX models, and OCR in the GPU modes comes from Surya 2.5, a 0.69B-parameter VLM. Marker starts the inference server itself on first use: vLLM in Docker on NVIDIA GPUs, llama.cpp elsewhere.
- **Optional LLM pass.** `--use_llm` merges tables across pages, cleans inline math, and extracts form values. It works with Gemini, Claude, OpenAI-compatible endpoints, Azure, Vertex, OpenRouter, or a local Ollama model, and defaults to `gemini-3.5-flash`.
- **Batch conversion.** `marker /folder` converts a directory with a worker pool that shares one inference server; `--skip_existing` resumes a run, and `--num_chunks` with `--chunk_idx` shards a file list across machines.
- **Built for agents and services.** `--stdout` pipes output straight into a shell pipeline, `--install_skill` writes a `SKILL.md` for coding agents, and `marker_server` exposes conversion over HTTP.

## In an AI-assisted workflow

Marker needs Python 3.10 or later and PyTorch:

```bash
pip install marker-pdf            # PDFs and images
pip install "marker-pdf[full]"    # adds PPTX, DOCX, XLSX, HTML, EPUB

marker_single report.pdf --output_format markdown --output_dir out
marker ./contracts --output_dir out --skip_existing   # whole folder, resumable
```

Or call it from Python inside an ingestion job:

```python
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

converter = PdfConverter(artifact_dict=create_model_dict())
rendered = converter("report.pdf")
text, _, images = text_from_rendered(rendered)
```

For RAG, convert first and chunk second: Markdown keeps headings and tables intact, so a chunker can split on structure instead of character counts. `--output_format chunks` returns pre-split blocks, and `--page_range "0,5-10"` limits a run to the pages you need. Compare Marker against hosted and open-source parsers in [Best Document Parsers for RAG in 2026](/guides/comparisons/best-document-parsers-for-rag-2026), and see [Multimodal RAG over PDFs, Scans & Charts](/guides/vision/multimodal-rag-images-pdfs) for where a parser fits in the pipeline.

## Pricing

The Marker code is **Apache-2.0** and free to use, including commercially. The model weights are under a modified AI Pubs Open Rail-M license: free for research and personal use, and free commercially only if, as of November 2026, your organization is under $5 million in both prior-year gross revenue and total funding raised. Above either line you need a commercial license from Datalab, and the license bars use by anyone offering a product or service that competes with Datalab's.

Datalab also sells a hosted API that runs its Chandra model and others. As of November 2026 its pricing page lists a Free tier with up to $20 of one-time credit ($10 at signup and $10 more after adding a card, on a work email), Launch at $25 a month, and Team at $400 a month, with usage on every plan billed at flat per-processor rates per 1,000 pages.

## Good to know

**The GPU modes have real prerequisites.** `balanced` and `vllm` on NVIDIA need Docker plus the NVIDIA Container Toolkit; on CPU or Apple Silicon you need the `llama-server` binary from llama.cpp. `fast` and `no_ocr` need neither.

**Speed and accuracy trade against each other.** In Datalab's own benchmark tables (README, November 2026), `no_ocr` sustains 57.0 pages per second but scores 42.4 on OmniParseBench, `fast` reaches 23.6 pages per second at 78.6, `balanced` 16.9 at 80.5, and `vllm` 4.5 at 85.9. These are vendor-run numbers, so test on your own documents. `no_ocr` skips equations and scanned pages entirely.

**`--use_llm` sends page content to a third party** unless you point it at Ollama, and it adds per-page model cost.

**It moves quickly.** The latest release is v2.2.0, published November 12, 2026, and the repository has about 41,000 GitHub stars as of November 2026. Flags and defaults have changed between major versions, so pin a version in production.

Among alternatives, [Docling](/tools/docling) is the MIT-licensed open-source alternative, [Unstructured](/tools/unstructured) covers more file types and connectors with a managed platform, and [LlamaParse](/tools/llamaparse) and [Reducto](/tools/reducto) are hosted APIs for teams that would rather not run models. More in [Marker alternatives](/tools/marker/alternatives).
