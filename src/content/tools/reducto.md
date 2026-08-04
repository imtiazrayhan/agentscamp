---
name: "Reducto"
title: "Reducto"
description: "High-accuracy document ingestion API — parsing, agentic OCR, table and figure extraction, and splitting that turns messy PDFs into LLM-ready data for RAG."
url: "https://reducto.ai"
date: 2026-06-19
pricing: "freemium"
category: "platform"
sameAs: ["https://github.com/reductoai", "https://docs.reducto.ai"]
color: "blue"
topics: ["rag-retrieval", "data-ml"]
tags: ["document-parsing", "ocr", "rag", "data-extraction", "pdf"]
featured: false
alternativeTo: ["llamaparse", "unstructured", "docling", "marker"]
summary: "Reducto is a hosted document ingestion API for production RAG and document pipelines. It parses PDFs, images, spreadsheets, and slides into LLM-ready data — combining specialized OCR with vision-language models for accurate tables, figures, and layout — plus Extract, Split, and Edit APIs and bounding-box citations for traceability."
related: ["guide:how-rag-works", "skill:multimodal-document-extractor", "guide:multimodal-rag-images-pdfs", "skill:chunking-strategy-optimizer"]
faq:
  - q: "What is Reducto?"
    a: "Reducto is a hosted document ingestion platform for AI teams. Its Parse API turns PDFs, images, spreadsheets, and slides into LLM-ready structured data — capturing layout, reading order, tables, and figures — and it adds Extract (schema-based data extraction), Split (separating multi-document files), and Edit APIs. It's aimed at production RAG and document pipelines where accuracy on complex or financial documents matters."
  - q: "Is Reducto free?"
    a: "Reducto is freemium: a free tier with included credits, then usage-based paid plans (Standard and Growth) and an Enterprise tier for VPC/on-prem deployment, custom SLAs, and security agreements like ZDR and BAAs. The product is a closed-source hosted API, though Reducto publishes open-source client SDKs (Python, Node, Go) under Apache-2.0."
  - q: "How do I use Reducto?"
    a: "Sign up for an API key and call the REST API directly or via the official Python, Node, or Go SDK. Submit a document to the Parse API to get back structured, chunked output with bounding-box citations, or use Extract to pull fields against a schema. The parsed output drops into a retrieval pipeline or vector store for RAG."
---

Reducto is a **high-accuracy document ingestion API** built for production RAG and document pipelines. Its core Parse API reads PDFs, images, spreadsheets, slides, scanned pages, and handwritten content, returning LLM-ready structured output that preserves layout, reading order, tables, and figures. Around parsing, it offers **Extract** (schema-based field extraction), **Split** (separating multi-document files into individual units), and **Edit** APIs.

What sets Reducto apart is its accuracy on complex and financial documents. Rather than relying on OCR alone, it combines specialized OCR with **vision-language models** in a multi-pass, self-correcting "agentic OCR" approach that catches and fixes recognition errors — which is where template-based or single-pass tools tend to fall apart on dense tables, multi-column layouts, and statements.

It is a **closed-source hosted API**, not a library you self-host (though it offers on-prem and VPC deployment on its enterprise tier). Reducto publishes open-source client SDKs for Python, Node, and Go under Apache-2.0, but the parsing engine itself runs as a managed service.

## Highlights

- **Agentic OCR** — a multi-pass, self-correcting OCR + VLM pipeline that improves robustness on previously unseen, messy documents.
- **Complex table and figure extraction** — strong handling of dense financial statements, multi-column layouts, and figures.
- **Bounding-box citations** — output includes source coordinates, so retrieved chunks stay traceable back to the original page.
- **Full ingestion suite** — Parse, Extract, Split, and Edit across 30+ file types and many languages, through one API.

## Good to know

Reducto is freemium: a free tier with included credits, usage-based Standard and Growth plans, and an Enterprise tier adding VPC/on-prem deployment, custom SLAs, and security commitments (SOC 2, HIPAA, zero data retention, BAAs). It's most useful when document parsing is the accuracy bottleneck in a RAG pipeline — pair it with [how RAG works](/guides/concepts/how-rag-works) for the surrounding retrieval design and a [chunking strategy optimizer](/skills/data/chunking-strategy-optimizer) for tuning the chunks it produces.
