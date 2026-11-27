---
name: "Unstructured"
title: "Unstructured"
description: "Document preprocessing for LLMs: an Apache-2.0 Python library plus the hosted Transform API and MCP server and Pipelines ETL, billed per page."
url: "https://unstructured.io"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
repo: "https://github.com/Unstructured-IO/unstructured"
license: "Apache-2.0"
sameAs: ["https://github.com/Unstructured-IO/unstructured", "https://docs.unstructured.io"]
color: "cyan"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["rag", "document-processing", "etl", "preprocessing", "ocr"]
featured: false
alternativeTo: ["llamaparse", "reducto", "docling", "marker"]
summary: "Unstructured turns PDFs, Office files, HTML, images and email into clean text and typed elements for RAG. The Apache-2.0 Python library runs locally and stays free. The hosted side is Transform (a Parse and Extract API with an MCP server), Pipelines (connector-based ETL) and Foundation, billed per page from a prepaid balance with $150 of free credit."
related: ["guide:how-rag-works", "guide:best-rag-frameworks-2026", "skill:chunking-strategy-optimizer", "skill:multimodal-document-extractor", "guide:multimodal-rag-images-pdfs"]
faq:
  - q: "Is Unstructured free?"
    a: "The open-source library is: it is Apache-2.0 and its README says it \"is, and will stay, completely free.\" The hosted products are paid from a prepaid balance. As of November 2026 the Personal plan starts with a one-time $150 credit and no card, and processing costs $0.010 a page on the default Balanced strategy or $0.015 a page on Best."
  - q: "What is Unstructured Transform?"
    a: "Transform is the hosted API Unstructured now leads with. Parse turns a document into Markdown or typed elements, and Extract pulls fields against a JSON Schema, reusing a completed Parse if you pass its ID. It has Python and TypeScript SDKs and an MCP server at https://mcp.transform.unstructured.io for Claude Code, Cursor, Codex and other clients."
  - q: "Should I use the open-source library or the hosted API?"
    a: "Use the library when documents must stay on your machines or when clean digital files are most of your input. Use Transform when tables and scans matter: Unstructured's own README reports table cell content accuracy of 0.866 for Transform's Best strategy against 0.426 for the library, on its benchmarks. Those are vendor figures on different page sets, so test on your documents."
  - q: "What file types does Unstructured handle?"
    a: "The library partitions PDFs, HTML, Word, PowerPoint, spreadsheets, images, email, plain text and more through one partition function, with extras installed per format. Transform's API also accepts audio and video. Transform's limit is 100 MB per document through the web app and API, and 50 MB per file through MCP clients."
---

[Unstructured](https://unstructured.io) is a **document preprocessing layer for LLMs**. Real source data (PDFs, Word and PowerPoint files, spreadsheets, scans, email) is messy, and feeding it raw into a RAG pipeline produces poor retrieval. Unstructured turns each file into clean text and typed elements such as Title, NarrativeText, Table and ListItem that chunking and embedding can rely on.

It comes in two forms, and the balance between them has shifted. The **open-source library** (`unstructured`, Apache-2.0) runs locally and remains free. The **hosted products** are where the company now puts its newest models: **Transform**, a Parse and Extract API with an MCP server; **Pipelines**, connector-based ETL from sources into vector stores and warehouses; and **Foundation**, an enterprise search product. As of November 2026, Unstructured's own guidance for AI agents says it no longer actively promotes the open-source library, the Ingest library or the older partition endpoint, which tells you where development effort is going.

## Highlights

- **One entry point for many formats.** In the library, `partition(filename=...)` detects the file type and routes it to the right parser.
- **Typed elements.** Output keeps structure (titles, tables, list items) so you can chunk by section instead of by character count.
- **Transform Parse and Extract.** Parse returns Markdown or elements with confidence scores; Extract returns fields that match your JSON Schema. Parse once and pass the ID to Extract to avoid processing a file twice.
- **Transform MCP server.** Point a coding agent at local files and get partitioned, chunked output back, with setup guides for about 30 clients and frameworks.
- **Strategies by price.** Balanced is the default and Best targets hard layouts and dense tables; the legacy Fast, Hi-Res and VLM strategies are still priced.
- **Audio and video.** The Transform API also transcribes audio and video files, billed per minute.
- **Deployment options.** SaaS for every plan; a dedicated instance, in-VPC on AWS, Azure or GCP, and bare metal on the Business plan.

## In an AI-assisted workflow

**Local, open source.** Plain text, HTML, XML, JSON and email need no extras; other formats need the matching extra and, for PDFs and images, the `poppler` and `tesseract` system packages.

```bash
pip install "unstructured[all-docs]"   # or just: pip install unstructured
```

```python
from unstructured.partition.auto import partition

elements = partition(filename="example-docs/eml/fake-email.eml")
print("\n\n".join([str(el) for el in elements]))
```

**Hosted, Transform.** The Python SDK needs Python 3.12 or newer and reads `UNSTRUCTURED_API_KEY` from the environment:

```bash
uv venv .venv
uv pip install --python .venv/bin/python "unstructured-transform-client>=0.18.18"
export UNSTRUCTURED_API_KEY="your-api-key"
```

```python
from unstructured_transform_client import TransformClient

with TransformClient(timeout_seconds=960) as client:
    result = client.parse.run(input="document.pdf")
    print(result)   # a completed result carries the parsed text in `markdown`
```

**From Claude Code.** Add the Transform MCP server, then sign in:

```bash
claude mcp add --transport http --scope user unstructured-transform https://mcp.transform.unstructured.io
claude mcp login unstructured-transform
```

## Pricing

Everything hosted draws from a prepaid balance; Unstructured says nothing is billed after the fact. As of November 2026 the pricing page lists three plans: **Personal** (a one-time $150 credit, no card, top up from $50), **Team** (shared workspace, unlimited seats and role-based access, no free credit, balance from $50) and **Business** (custom pricing, SSO, dedicated or in-VPC deployment).

Rates, as of November 2026:

| What you process | Strategy | Rate |
| --- | --- | --- |
| Documents and images | Balanced (default) | $0.010 per page |
| Documents and images | Best | $0.015 per page |
| Documents and images | Fast (legacy, text only) | $0.002 per page |
| Documents and images | Hi-Res (legacy) | $0.020 per page |
| Documents and images | VLM (legacy) | $0.030 per page |
| Audio | | $0.015 per minute |
| Video | | $0.045 per minute, plus the audio rate when it has sound |

## Good to know

- **The library and the API are different quality tiers.** The README's own comparison puts Transform well ahead of the library on tables and text accuracy. Budget for that gap if your documents are scans or table-heavy.
- **Local installs are heavy.** `all-docs` pulls in OCR and layout models plus system dependencies. Unstructured publishes a Docker image if you would rather not manage them.
- **Hosted results expire.** Uploaded files sit in temporary storage for 24 hours, and Transform does not publish a fixed retention period for parsed results. Store the output you need.
- **Some limits are unpublished.** The Transform docs state no public values for request rate or concurrent jobs, so load-test before you plan a bulk backfill.
- **The Transform SDK is young.** It requires Python 3.12 or newer and a recent client version, which can clash with older projects.

Alternatives: [Reducto](/tools/reducto) and [LlamaParse](/tools/llamaparse) are hosted parsers that compete with Transform on accuracy for complex documents. [Docling](/tools/docling) and [Marker](/tools/marker) are open-source parsers to compare against the `unstructured` library when everything must run locally. Unstructured is the one with both a free local library and connector-based pipelines. It sits at the start of a RAG stack: see [how RAG works](/guides/concepts/how-rag-works) and [best RAG frameworks 2026](/guides/comparisons/best-rag-frameworks-2026), and tune the chunks with the [chunking strategy optimizer](/skills/data/chunking-strategy-optimizer).
