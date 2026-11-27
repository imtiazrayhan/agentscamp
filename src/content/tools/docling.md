---
name: "Docling"
title: "Docling"
description: "Open-source Python library that parses PDFs, DOCX, PPTX, HTML, and images into structured Markdown and JSON with layout, tables, and reading order for RAG."
url: "https://docling-project.github.io/docling/"
date: 2026-06-19
updated: 2026-11-27
reviewed: 2026-11-27
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
summary: "Docling is an MIT-licensed Python library that converts PDFs, Office files, HTML, images and audio into structured Markdown or JSON, keeping layout, reading order, tables, formulas and code. It runs locally, was started at IBM Research Zurich, is hosted by the LF AI & Data Foundation, and integrates with LangChain, LlamaIndex, Crew AI and Haystack."
related: ["guide:how-rag-works", "guide:multimodal-rag-images-pdfs", "guide:vlm-ocr-documents", "guide:best-rag-frameworks-2026", "skill:multimodal-document-extractor"]
faq:
  - q: "What is Docling?"
    a: "Docling is an open-source Python library for document parsing. It converts PDFs, DOCX, PPTX, XLSX, HTML, EPUB, and images into a unified DoclingDocument and exports clean Markdown or lossless JSON, capturing page layout, reading order, table structure, formulas, and code so the output is ready for retrieval-augmented generation (RAG) and other LLM pipelines."
  - q: "Is Docling free?"
    a: "Yes. Docling is fully open source under the MIT license and free to self-host. It was started by IBM Research's AI for knowledge team in Zurich and is now hosted as an LF AI & Data Foundation project. There is no paid tier — you install and run it yourself, on your own hardware."
  - q: "How do I use Docling?"
    a: "Run pip install docling (Python 3.10 or higher), then either call the CLI, for example docling https://arxiv.org/pdf/2206.01062, which writes a Markdown file to the current directory, or use DocumentConverter().convert(source) in Python and export the result with export_to_markdown(). Conversion runs locally, so documents stay in your environment."
  - q: "Does Docling need a GPU?"
    a: "No. Docling's models run on PyTorch and work on CPU; the install docs show a CPU-only PyTorch install for Linux. A GPU or Apple Silicon speeds up layout, table and vision-language models on large batches. Intel Macs need an older pinned PyTorch (2.2.2), because newer PyTorch releases no longer ship wheels for them."
audience: ["ai-engineers", "analysts"]
---

Docling is an **open-source Python library for document parsing**, built to get real-world documents ready for generative AI. It converts PDFs, DOCX, PPTX, XLSX, HTML, EPUB, images and more into a unified `DoclingDocument` and exports clean **Markdown** or **lossless JSON**, making messy source files usable as context for RAG and other LLM pipelines. The latest release is 2.154.0, published on November 26, 2026, and the repository has about 71,100 GitHub stars as of November 2026.

What sets it apart is **document understanding in place of plain text extraction**. Docling parses page layout, reading order, and table structure, and recognizes formulas, code blocks, and images, so the structure of a document survives conversion. It includes OCR for scanned PDFs and images, and can use compact vision-language models (such as IBM's Granite-Docling) for end-to-end document conversion.

It runs **locally**, including in air-gapped environments, so sensitive documents never leave your machine. That is the main difference from hosted parsing APIs.

## Highlights

- **Wide format coverage.** PDF, DOCX, PPTX, XLSX, HTML, EPUB, Apple Pages, Numbers and Keynote, OpenDocument files, email (EML, MSG), calendar files, LaTeX, plain text, and images such as PNG, TIFF and JPEG.
- **Audio and video.** WAV and MP3 are transcribed with speech-recognition models, and video files (MP4, AVI, MOV, MKV, WebM) are parsed into a transcript plus representative keyframes.
- **Structured exports.** Markdown, HTML, DocTags and lossless JSON from one `DoclingDocument`.
- **Domain schemas.** Parsers for USPTO patents, JATS articles and XBRL financial reports.
- **Chart understanding.** Bar charts, pie charts and line plots can be converted into tables or code with descriptions.
- **Integrations.** Plug-ins for LangChain, LlamaIndex, Crew AI and Haystack, an MCP server (`docling-mcp`), and `docling-serve` to run it as an API service.

## In an AI-assisted workflow

```bash
pip install docling
docling https://arxiv.org/pdf/2206.01062      # writes a .md file to the current directory
```

```python
from docling.document_converter import DocumentConverter

source = "https://arxiv.org/pdf/2408.09869"  # a local path or a URL
converter = DocumentConverter()
result = converter.convert(source)
print(result.document.export_to_markdown())
```

To hand parsing to an agent, add the MCP server to a client's config:

```json
{
  "mcpServers": {
    "docling": {
      "command": "uvx",
      "args": ["--from=docling-mcp", "docling-mcp-server"]
    }
  }
}
```

To switch the whole pipeline to a vision-language model, pass `--vlm-model granite_docling` on the CLI.

## Good to know

Docling is MIT-licensed and free to self-host; the models it downloads carry their own licences. It was started by the AI for knowledge team at IBM Research Zurich and is now an [LF AI & Data Foundation](https://lfaidata.foundation/) project. It needs Python 3.10 or higher (3.9 support ended in version 2.70.0) and runs on macOS, Linux and Windows, on x86_64 and arm64.

The trade-offs follow from running locally. Docling depends on PyTorch and downloads model weights, so the install is heavy next to a hosted API client, and throughput on large batches depends on your hardware. Releases are frequent, so pin a version in production pipelines and re-check output quality when you upgrade.

Among alternatives, [Marker](/tools/marker) is another local PDF-to-Markdown converter, [Unstructured](/tools/unstructured) covers many formats with an element-based output and a hosted option, and [LlamaParse](/tools/llamaparse) and [Reducto](/tools/reducto) are hosted parsing APIs for teams that would sooner pay per use than run models. [Best Document Parsers for RAG](/guides/comparisons/best-document-parsers-for-rag-2026) compares them. Docling sits at the ingestion layer of a RAG stack: see [how RAG works](/guides/concepts/how-rag-works) and [best RAG frameworks 2026](/guides/comparisons/best-rag-frameworks-2026) for where parsing fits, and pair it with a [multimodal document extractor](/skills/data/multimodal-document-extractor) when documents demand vision-language understanding.
