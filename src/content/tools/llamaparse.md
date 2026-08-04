---
name: "LlamaParse"
title: "LlamaParse"
description: "Hosted document-parsing API from LlamaIndex that turns complex PDFs — tables, charts, figures, handwriting — into clean, LLM-ready Markdown for RAG."
url: "https://www.llamaindex.ai/llamaparse"
date: 2026-06-19
pricing: "freemium"
category: "platform"
repo: "https://github.com/run-llama/llama_cloud_services"
os: ["Web"]
color: "purple"
topics: ["rag-retrieval", "llm-app-dev"]
tags: ["document-parsing", "pdf", "rag", "ocr", "tables", "llamaindex"]
featured: false
sameAs:
  - "https://github.com/run-llama/llama_cloud_services"
  - "https://docs.cloud.llamaindex.ai/llamaparse"
  - "https://cloud.llamaindex.ai"
alternativeTo: ["unstructured", "reducto", "docling", "marker"]
related: ["guide:how-rag-works", "guide:best-rag-frameworks-2026", "guide:multimodal-rag-images-pdfs", "skill:chunking-strategy-optimizer", "skill:multimodal-document-extractor"]
summary: "LlamaParse is LlamaIndex's hosted parsing API that converts messy documents — PDFs with tables, charts, figures, and handwriting — into clean, structured Markdown for RAG. It is layout-aware, supports 90+ formats and 100+ languages, offers multiple cost-vs-accuracy modes up to agentic multimodal parsing, and plugs straight into LlamaIndex ingestion."
faq:
  - q: "What is LlamaParse?"
    a: "LlamaParse is a hosted document-parsing API from LlamaIndex (part of LlamaCloud). You upload a file via the web UI, REST API, or Python/TypeScript SDK and it returns clean Markdown or structured text — preserving tables, headings, and reading order — so the output is ready to chunk, embed, and retrieve in a RAG pipeline."
  - q: "Is LlamaParse free?"
    a: "It is freemium. New accounts get a monthly free credit allowance (enough for thousands of pages), after which parsing is metered in credits. Cost per page depends on the mode you pick — fast text extraction is cheapest, while agentic multimodal parsing costs more per page but handles the hardest layouts."
  - q: "How is LlamaParse different from plain PDF text extraction?"
    a: "Naive extractors flatten complex layouts — they scramble multi-column text and turn tables into unaligned token soup. LlamaParse is layout-aware and offers multimodal modes that screenshot each page and reconstruct its structure with a vision model, so embedded tables, charts, and figures survive as usable Markdown instead of garbage."
---

LlamaParse is the document-ingestion service from **LlamaIndex**, built to solve the unglamorous but decisive first step of RAG: getting clean, structured text out of messy source files. It is a **hosted API** (part of LlamaCloud) — you send a PDF, PowerPoint, Word doc, spreadsheet, or image and get back **LLM-ready Markdown** that preserves headings, reading order, and (crucially) tables.

The differentiator is **complex-PDF and table accuracy**. Ordinary text extraction scrambles multi-column pages and collapses tables into unaligned tokens that wreck retrieval downstream. LlamaParse is layout-aware and offers a range of parsing modes that trade cost against accuracy — from fast text-only extraction up to **agentic, multimodal parsing** that screenshots each page and uses a vision model to reconstruct its structure. It supports 90+ file types and 100+ languages.

Because it is made by LlamaIndex, it drops directly into the broader **LlamaIndex ingestion pipeline** — parse, then chunk, embed, and index — but the Markdown it returns is framework-agnostic and works just as well feeding LangChain, a raw vector store, or any other stack. The parsing service itself is proprietary and hosted; the official SDK clients are open-source.

Pricing is **freemium**: new accounts get a monthly free credit allowance, then usage is metered in credits, with cost per page scaling by the mode you choose. Pair it with a deliberate [chunking strategy](/skills/data/chunking-strategy-optimizer) and read [how RAG works](/guides/concepts/how-rag-works) to see where parsing fits in the pipeline.
