---
name: "Marker"
title: "Marker"
description: "Open-source pipeline that converts PDFs, images, and Office docs into clean Markdown, JSON, or HTML fast, with optional LLM assist for tables and equations."
url: "https://www.datalab.to"
date: 2026-06-19
pricing: "open-source"
category: "sdk"
repo: "https://github.com/datalab-to/marker"
license: "GPL-3.0"
sameAs: ["https://github.com/datalab-to/marker", "https://documentation.datalab.to"]
color: "orange"
topics: ["rag-retrieval", "data-ml"]
tags: ["pdf", "markdown", "ocr", "document-conversion", "rag"]
featured: false
alternativeTo: ["docling", "unstructured", "llamaparse", "reducto"]
summary: "Marker is an open-source Python pipeline from Datalab that converts PDFs, images, PPTX, DOCX, XLSX, HTML, and EPUB into clean Markdown, JSON, or HTML. It runs locally on GPU, CPU, or Apple MPS, preserves tables, equations, and code, and can optionally call an LLM for accuracy-critical pages."
related: ["how-rag-works", "multimodal-rag-images-pdfs", "vlm-ocr-documents", "chunking-strategy-optimizer"]
faq:
  - q: "What is Marker?"
    a: "Marker is an open-source document-conversion pipeline from Datalab. It turns PDFs, images, and Office formats into clean Markdown, JSON, or HTML, preserving tables, equations, forms, and code while stripping headers, footers, and other clutter. It builds on the Surya OCR and layout models and runs on your own hardware."
  - q: "Is Marker free?"
    a: "The Marker code is open source under GPL-3.0 and free to run yourself; its model weights use a modified AI Pubs Open Rail-M license that covers research, personal use, and smaller companies. Commercial self-hosting beyond those limits requires a license, and Datalab also offers a hosted API (with free starter credits) running its higher-accuracy Chandra model."
  - q: "How do I use Marker?"
    a: "Install the marker-pdf package, then run marker_single on a file or marker on a folder to emit Markdown, JSON, or HTML. It uses GPU, CPU, or Apple MPS automatically. Add the --use_llm flag to route tricky tables, inline math, and form fields through an LLM such as Gemini, Claude, or a local Ollama model for higher accuracy."
---

Marker is an **open-source pipeline from Datalab** that converts documents into clean, structured text. It accepts PDFs, images, PPTX, DOCX, XLSX, HTML, and EPUB and outputs Markdown, JSON, chunks, or HTML, making it a common ingestion step for RAG pipelines and LLM workflows that need readable text out of messy source documents.

Under the hood Marker builds on Datalab's **Surya OCR, layout, and table-recognition models**, so it preserves tables, equations, inline math, links, references, and code blocks while removing page furniture like headers and footers. It is designed to run **locally on GPU, CPU, or Apple MPS**, which keeps documents on your own hardware and makes it predictable for batch conversion at scale.

For accuracy-critical pages, an optional `--use_llm` flag layers a language model on top of the deterministic pipeline to handle harder cases such as merging tables across page boundaries, cleaning inline math, and extracting form values. The flag works with hosted models like Gemini and Claude or a local Ollama model, so you can trade cost for accuracy only where it matters.

The Marker code is licensed under **GPL-3.0**, with model weights under a modified AI Pubs Open Rail-M license that is free for research, personal use, and smaller companies; broader commercial self-hosting requires a license. Datalab also runs a managed API platform built on its newer Chandra OCR model for teams that prefer a hosted, higher-accuracy option over self-hosting.
