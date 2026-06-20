---
name: "Unstructured"
title: "Unstructured"
description: "Open-source library plus hosted Platform/API that turns messy documents — PDF, HTML, docx, images, email — into clean, chunked JSON for LLMs and RAG."
url: "https://unstructured.io"
date: 2026-06-19
pricing: "freemium"
category: "platform"
repo: "https://github.com/Unstructured-IO/unstructured"
license: "Apache-2.0"
sameAs: ["https://github.com/Unstructured-IO/unstructured", "https://docs.unstructured.io"]
color: "cyan"
topics: ["rag-retrieval", "data-ml"]
tags: ["rag", "document-processing", "etl", "preprocessing", "ocr"]
featured: false
alternativeTo: ["llamaparse", "reducto", "docling", "marker"]
summary: "Unstructured preprocesses messy documents — PDF, HTML, docx, images, email — into clean, chunked JSON ready for LLMs and RAG. It ships as an Apache-2.0 Python library and a hosted Platform/API with source and destination connectors, partitioning files into typed elements, then enriching, chunking, and embedding them as an ingestion ETL layer."
related: ["how-rag-works", "best-rag-frameworks-2026", "chunking-strategy-optimizer", "multimodal-document-extractor", "multimodal-rag-images-pdfs"]
faq:
  - q: "What is Unstructured?"
    a: "Unstructured is a document preprocessing and ETL layer for LLMs. It partitions messy files — PDFs (digital and scanned), HTML, DOCX, PPTX, XLSX, images, EML/MSG email, and dozens of other formats — into clean, typed elements like Title, NarrativeText, and Table, then chunks and serializes them into JSON ready for RAG and other LLM pipelines."
  - q: "Is Unstructured free?"
    a: "It's freemium. The core library is open source under Apache-2.0 and free to self-host. The hosted Platform/API adds connectors, enrichment, embedding, and managed pipelines on a usage-based model with a free tier, plus paid usage and enterprise (dedicated/VPC) options."
  - q: "How do I use Unstructured?"
    a: "Install the open-source `unstructured` Python package and call `partition` to convert a file into elements locally, or use the hosted Platform/API to wire source connectors, processing workflows, and destination connectors (vector stores, warehouses) without managing infrastructure yourself."
---

Unstructured is a **document preprocessing and ETL layer for LLMs**. Real-world source data — PDFs, HTML, Word and PowerPoint files, spreadsheets, scanned images, and email — is messy and inconsistent, and feeding it raw into a RAG pipeline produces poor retrieval. Unstructured partitions each file into typed elements (Title, NarrativeText, Table, ListItem, and more), applies OCR and layout detection where needed, and emits clean, structured JSON that downstream chunking and embedding can rely on.

It comes in two forms. The **open-source library** (`unstructured`, Apache-2.0) runs locally and handles partitioning across dozens of file types through a single `partition` entry point. The **hosted Platform/API** layers on source and destination connectors, enrichment, chunking, and embedding, so teams can build continuous ingestion pipelines from data sources into vector databases and warehouses without operating the infrastructure.

## Highlights

- **Many file types** — one pipeline for PDF (digital and scanned), HTML, DOCX, PPTX, XLSX, CSV, images, EML/MSG, EPUB, Markdown, and more.
- **OSS + Platform/API** — Apache-2.0 library for local use, plus a managed API with connectors and workflows.
- **RAG-ready output** — partition into typed elements, then chunk (e.g. by title) and serialize to JSON tuned for retrieval.
- **Connectors** — source and destination integrations for vector stores and data platforms like Pinecone, Weaviate, Databricks, Snowflake, and MongoDB.

## Good to know

Unstructured is freemium: the core library is free and self-hostable under Apache-2.0, while the hosted Platform/API is usage-based with a free tier and enterprise (dedicated/VPC) options. It sits at the start of a RAG stack — see [how RAG works](/guides/foundations/how-rag-works) and [best RAG frameworks 2026](/guides/foundations/best-rag-frameworks-2026) for where ingestion fits, and pair it with a [chunking strategy optimizer](/skills/rag-knowledge/chunking-strategy-optimizer) once documents are parsed.
