---
name: "Reducto"
title: "Reducto"
description: "A hosted document API that parses PDFs, scans, spreadsheets and slides into LLM-ready chunks with bounding boxes, plus Extract, Split, Classify and Edit."
url: "https://reducto.ai"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
sameAs: ["https://github.com/reductoai", "https://docs.reducto.ai"]
color: "blue"
topics: ["rag-retrieval", "data-ml"]
audience: ["ai-engineers"]
tags: ["document-parsing", "ocr", "rag", "data-extraction", "pdf"]
featured: false
alternativeTo: ["llamaparse", "unstructured", "docling", "marker"]
summary: "Reducto is a hosted document processing API for RAG and document pipelines. Its Parse endpoint turns PDFs, images, spreadsheets and slides into chunked text, tables and figures with a bounding box on every block, and Extract, Split, Classify and Edit build on it. It is closed source and billed per page, with free starting credit."
related: ["guide:how-rag-works", "skill:multimodal-document-extractor", "guide:multimodal-rag-images-pdfs", "skill:chunking-strategy-optimizer"]
faq:
  - q: "How much does Reducto cost?"
    a: "As of November 2026 the Standard plan is pay-as-you-go with $150 in free usage, then per 1,000 pages: $10 for r-1 Parse, $1 for r-1 mini Parse, $20 for Extract or Split, $40 for Deep Extract or Deep Split, $7.50 for Classify, and $60 for Edit ($15 for pre-filled pages). Growth and Enterprise are custom-priced with volume discounts."
  - q: "What is the difference between r-1 and r-1 mini?"
    a: "Both are Reducto's own parsing models, selected with settings.model. r-1 reads each full page in one pass and returns text, tables, figures, layout, reading order and formatting with a bounding box per block. r-1 mini is the low-cost option at a tenth of the per-page price. Reducto's docs say Parse defaults to r-1 from December 7, 2026, and that you set model to legacy to keep the older pipeline."
  - q: "Can I self-host Reducto?"
    a: "Not as open source. The parsing engine is a managed service; VPC and on-prem deployments are part of the Enterprise plan. What Reducto publishes openly are client SDKs for Python, Node.js and Go, a CLI and an MCP server."
  - q: "Does Reducto have an MCP server?"
    a: "Yes. A hosted server runs at https://mcp.reducto.ai/mcp with a bearer API key, and a local one installs in Claude Code with claude mcp add -s user reducto -- uvx mcp-server-reducto. Its tools include parse_document, extract_data, split_document, classify_document, edit_document and upload_file. Reducto's docs suggest the local server for local files and the hosted one for public URLs."
---

[Reducto](https://reducto.ai) is a **hosted document processing API** for production RAG and document pipelines. Its Parse endpoint reads PDFs, scans, images, spreadsheets and slides and returns chunked text, tables and figures in reading order, with a bounding box on every block so an answer can point back to the page. Around Parse sit **Extract** (fields into JSON against a schema), **Split** (named page-range sections), **Classify** (route a document by type) and **Edit** (fill forms, modify PDFs and DOCX).

The pitch is accuracy on documents that break simpler parsers: dense financial tables, multi-column layouts, scans. As of November 2026 the current parsing model is **r-1**, which reads each full page in one pass, with a cheaper **r-1 mini** beside it. Reducto is a closed-source managed service; the engine is not something you download.

## Highlights

- **r-1 and r-1 mini.** Set `settings.model` to `"r-1"` or `"r-1-mini"` on Parse, Extract and Split requests. Reducto's docs say Parse defaults to r-1 from December 7, 2026, with `"legacy"` available to keep the older pipeline. r-1 requires the V3 API.
- **Bounding boxes and confidence.** Each block in a chunk carries its type, page coordinates and a confidence value, which is what makes citations and human review practical.
- **Wide format support.** PDF, common image formats including TIFF and HEIC, DOCX and PPTX, spreadsheets (XLSX, CSV) and text formats such as HTML; the pricing page counts 30+ file types.
- **Extract, Split, Classify, Edit.** Schema-based extraction, section splitting, natural-language classification and form filling on the same API.
- **Three ways in besides REST.** SDKs for Python, Node.js and Go, a CLI (`reducto parse ./documents` writes a `.parse.md` next to each file), and an MCP server.
- **Reducto Studio.** A web workspace for building and publishing parse, extract, split and edit pipelines, with up to 5 seats on the Standard plan.
- **Office SDK.** Packages for opening, editing and rendering Word and PowerPoint files inside your own app, billed per session.

## In an AI-assisted workflow

Create a key in [Reducto Studio](https://studio.reducto.ai), export it, and install the SDK (Python 3.8+):

```bash
export REDUCTO_API_KEY="your-api-key"
pip install reductoai      # or: npm install reductoai
```

Upload a file and parse it with r-1, following Reducto's quickstart:

```python
from pathlib import Path
from reducto import Reducto

client = Reducto()  # reads REDUCTO_API_KEY

upload = client.upload(file=Path("statement.pdf"))
result = client.parse.run(input=upload.file_id, settings={"model": "r-1"})

print(f"Processed {result.usage.num_pages} pages")
for chunk in result.result.chunks:
    print(chunk.content)
    for block in chunk.blocks:
        if block.type == "Table":
            print(f"Found table on page {block.bbox.page}")
```

`chunk.content` is what you embed and index; keep `block.bbox` alongside it in your vector store's metadata so a retrieved chunk can be traced to a region of the source page. For coding agents, the MCP server exposes the same operations as tools:

```bash
uvx mcp-server-reducto --login
claude mcp add -s user reducto -- uvx mcp-server-reducto
```

## Pricing

As of November 2026, Reducto's pricing page lists three plans. **Standard** is pay-as-you-go and starts with $150 in free usage; **Growth** and **Enterprise** are custom-priced.

Standard rates per 1,000 pages, as of November 2026:

| Endpoint | Price per 1,000 pages |
| --- | --- |
| r-1 Parse | $10 |
| r-1 mini Parse | $1 |
| Extract | $20 |
| Deep Extract | $40 |
| Split | $20 |
| Deep Split | $40 |
| Classify | $7.50 |
| Edit | $60, or $15 for pre-filled pages |

Growth adds volume discounts, a zero-data-retention agreement, a Business Associate Agreement, EU and AU data residency endpoints and higher rate limits. Enterprise adds VPC and on-prem deployment, SSO and SAML, role-based access control, and custom SLAs. As of November 2026 the Office SDK is $0.10 per session, a session being one document open for up to 60 minutes.

## Good to know

- **Extract and Split can bill Parse too.** Reducto's credit docs say that if you do not pass an existing parse ID, an Extract or Split request also incurs Parse usage. Parse once and reuse the ID.
- **Compliance terms sit on higher tiers.** Reducto's site says it is SOC 2 and HIPAA compliant, but the zero-data-retention agreement and BAA are listed under Growth, not Standard.
- **Your documents leave your network** unless you buy the Enterprise VPC or on-prem deployment.
- **Uploads are temporary.** Files uploaded through the MCP server's `upload_file` tool sit in temporary storage with a 24-hour TTL, and job IDs expire, so persist the output you need.

Alternatives: [LlamaParse](/tools/llamaparse) is the closest hosted competitor and fits naturally if you already use LlamaIndex. [Unstructured](/tools/unstructured) has an Apache-2.0 library you can run yourself plus a hosted platform with source and destination connectors. [Docling](/tools/docling) and [Marker](/tools/marker) are open-source parsers for teams that must keep documents on their own machines. Reducto earns its per-page price when parsing accuracy is the bottleneck in the pipeline. For the retrieval design around it see [how RAG works](/guides/concepts/how-rag-works), and tune the chunks it returns with the [chunking strategy optimizer](/skills/data/chunking-strategy-optimizer).
