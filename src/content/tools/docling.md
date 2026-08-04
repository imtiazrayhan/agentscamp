---
name: "Docling"
title: "Docling"
description: "Open-source Python library that parses PDFs, DOCX, PPTX, HTML, and images into structured Markdown and JSON with layout, tables, and reading order for RAG."
url: "https://docling-project.github.io/docling/"
date: 2026-06-19
pricing: "open-source"
category: "sdk"
repo: "https://github.com/docling-project/docling"
license: "MIT"
sameAs: ["https://github.com/docling-project/docling", "https://pypi.org/project/docling/"]
color: "green"
topics: ["rag-retrieval", "data-ml"]
tags: ["document-processing", "pdf", "rag", "ocr", "parsing"]
featured: false
alternativeTo: ["marker", "unstructured", "llamaparse", "reducto"]
summary: "Docling is an open-source (MIT) Python library, started at IBM Research and now an LF AI & Data project, that converts PDFs, DOCX, PPTX, XLSX, HTML, and images into structured Markdown and JSON. It understands page layout, reading order, table structure, formulas, and code, runs locally, and plugs into LangChain, LlamaIndex, Crew AI, and Haystack for RAG."
related: ["guide:how-rag-works", "guide:multimodal-rag-images-pdfs", "guide:vlm-ocr-documents", "guide:best-rag-frameworks-2026", "skill:multimodal-document-extractor"]
faq:
  - q: "What is Docling?"
    a: "Docling is an open-source Python library for document parsing. It converts PDFs, DOCX, PPTX, XLSX, HTML, EPUB, and images into a unified DoclingDocument and exports clean Markdown or lossless JSON, capturing page layout, reading order, table structure, formulas, and code so the output is ready for retrieval-augmented generation (RAG) and other LLM pipelines."
  - q: "Is Docling free?"
    a: "Yes. Docling is fully open source under the MIT license and free to self-host. It was started by IBM Research's AI for knowledge team in Zurich and is now hosted as an LF AI & Data Foundation project. There is no paid tier — you install and run it yourself, on your own hardware."
  - q: "How do I use Docling?"
    a: "Install the `docling` package from PyPI (`pip install docling`) and convert a file with the `DocumentConverter` API, exporting the result to Markdown or JSON. Because it runs locally your documents stay in your environment, and it offers ready-made integrations with LangChain, LlamaIndex, Crew AI, and Haystack, plus an optional MCP server."
---

Docling is an **open-source Python library for document parsing**, built to get real-world documents ready for generative AI. It converts PDFs, DOCX, PPTX, XLSX, HTML, EPUB, and images into a unified `DoclingDocument` and exports clean **Markdown** or **lossless JSON**, making messy source files usable as context for RAG and other LLM pipelines.

What sets it apart is **deep document understanding rather than naive text extraction**. Docling parses page layout, reading order, and table structure, and recognizes formulas, code blocks, and images — so the structure of a document survives conversion instead of collapsing into a flat blob of text. It includes OCR for scanned PDFs and images, and can use compact vision-language models (such as IBM's Granite-Docling) for end-to-end document conversion.

It runs **locally**, which means sensitive documents never leave your environment — a key difference from hosted parsing APIs. Docling also ships **plug-and-play integrations** with LangChain, LlamaIndex, Crew AI, and Haystack, plus an MCP server, so it slots directly into existing agent and retrieval stacks.

## Good to know

Docling is MIT-licensed and free to self-host. It was started by IBM Research's AI for knowledge team in Zurich and is now an [LF AI & Data Foundation](https://lfaidata.foundation/) project. It sits at the ingestion layer of a RAG stack — see [how RAG works](/guides/concepts/how-rag-works) and [best RAG frameworks 2026](/guides/comparisons/best-rag-frameworks-2026) for where parsing fits, and pair it with a [multimodal document extractor](/skills/data/multimodal-document-extractor) when documents demand vision-language understanding.
