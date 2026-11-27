---
name: "LlamaParse"
title: "LlamaParse"
description: "LlamaIndex's hosted document platform: Parse turns PDFs, scans and Office files into Markdown or JSON across four tiers, with Extract, Classify and Split."
url: "https://www.llamaindex.ai/llamaparse"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
repo: "https://github.com/run-llama/llama-parse-py"
os: ["Web"]
color: "purple"
topics: ["rag-retrieval", "llm-app-dev"]
tags: ["document-parsing", "pdf", "rag", "ocr", "tables", "llamaindex"]
featured: false
sameAs:
  - "https://github.com/run-llama/llama-parse-py"
  - "https://developers.llamaindex.ai/llamaparse/parse/"
  - "https://cloud.llamaindex.ai"
alternativeTo: ["unstructured", "reducto", "docling", "marker"]
related: ["guide:how-rag-works", "guide:best-rag-frameworks-2026", "guide:multimodal-rag-images-pdfs", "skill:chunking-strategy-optimizer", "skill:multimodal-document-extractor"]
summary: "LlamaParse is LlamaIndex's hosted document-processing platform. Its Parse product converts PDFs, scans, Office files and images into Markdown, text or JSON, keeping tables and reading order, in four tiers from Fast to Agentic Plus. Extract, Classify and Split sit beside it. Every account gets 10,000 free credits a month, and a page costs 1 to 25 credits."
faq:
  - q: "Is LlamaParse open source?"
    a: "No. LlamaIndex's pricing FAQ calls LlamaParse its commercial platform for parsing and extracting documents. The SDK clients are open source (the Python SDK repository is MIT-licensed), and LlamaIndex points to LiteParse, its local parser for simpler documents that needs no API key, if you need open source. The LlamaIndex framework is a separate project that you do not need in order to use LlamaParse."
  - q: "Is LlamaParse the same as LlamaCloud?"
    a: "Yes. LlamaParse is the new name for the platform previously called LlamaCloud, and the name still appears in SDK package names such as llama-cloud, in the LLAMA_CLOUD_API_KEY variable and in older docs. The earlier llama-parse and llama-cloud-services packages are deprecated in favour of the current SDKs."
  - q: "How many credits does a page cost?"
    a: "It depends on the parse tier: 1 credit per page for Fast, 3 for Cost-effective, 10 for Agentic and 25 for Agentic Plus. Layout extraction adds 3 credits per page on any tier, and Extract adds its own per-page credits on top of the parse tier. Re-parsing a file whose result is still cached costs nothing."
  - q: "Where does LlamaParse run, and what happens to my documents?"
    a: "The default is managed SaaS in a US or EU region, where data is encrypted in transit and at rest and cached results are deleted after 48 hours; you can turn caching off. Enterprise customers can instead use single-tenant SaaS, their own cloud on AWS, Azure or Google Cloud, or an on-premises deployment. LlamaIndex reports a SOC 2 Type II report and offers HIPAA-compliant processing with a BAA on Enterprise."
audience: ["ai-engineers", "analysts"]
---

[LlamaParse](https://www.llamaindex.ai/llamaparse) is the document-processing platform from LlamaIndex, and the name of its best-known product, Parse. Parse solves the unglamorous first step of [RAG](/guides/concepts/how-rag-works): getting clean, structured text out of messy files. You upload a PDF, scan, slide deck, spreadsheet or image and get back Markdown, plain text or JSON in which tables, headings and reading order survive. It is a hosted, proprietary service with open-source SDK clients. The platform was previously called LlamaCloud.

## Highlights

- **Four parse tiers.** Fast, Cost-effective, Agentic and Agentic Plus trade cost against accuracy, from plain text extraction up to model-driven parsing of the hardest layouts. A Cost-Optimizer option is included on every plan.
- **Built for difficult pages.** Table, chart and graph extraction, image understanding with inline images in the Markdown, and layout detection with bounding boxes. LlamaIndex says Parse uses generative models for end-to-end document understanding and that the `cost_effective` and `agentic` tiers run on its own OCRia-1 model.
- **Wide input and output range.** 130+ file formats including PDF, Office documents, spreadsheets and images, 80+ languages, and output as Markdown, text, per-page JSON, XLSX, HTML tables or an annotated PDF.
- **More than parsing.** Extract returns structured data against a schema with citations and confidence scores, Classify sorts documents by rule, and Split divides them.
- **SDKs in several languages.** Python (`llama-cloud`), TypeScript (`@llamaindex/llama-cloud`), Go and Java, plus a CLI, a REST API and a web UI.
- **MCP server.** `https://mcp.llamaindex.ai/mcp` exposes the platform to MCP clients with an API key.

## In an AI-assisted workflow

Create an API key at cloud.llamaindex.ai, export it, and parse a file:

```bash
export LLAMA_CLOUD_API_KEY="llx-..."
pip install "llama-cloud>=2.8"
```

```python
from llama_cloud import LlamaCloud

client = LlamaCloud()  # reads LLAMA_CLOUD_API_KEY from the environment

file = client.files.create(file="./attention_is_all_you_need.pdf", purpose="parse")
result = client.parsing.parse(
    file_id=file.id,
    tier="agentic",
    version="latest",
    expand=["markdown"],
)

print(result.markdown.pages[0].markdown)
```

`client.parsing.parse()` blocks until the job finishes; `AsyncLlamaCloud` is the async equivalent. The Markdown it returns is framework-agnostic, so it feeds LlamaIndex, LangChain or a plain vector store equally well. What you do next matters as much as the parse: pair it with a deliberate [chunking strategy](/skills/data/chunking-strategy-optimizer), and for documents where figures carry the meaning, read [multimodal RAG over images and PDFs](/guides/vision/multimodal-rag-images-pdfs).

> [!TIP]
> Start on the cheapest tier that reads your documents correctly. Run a sample of your worst pages through Fast and Agentic, compare the tables, and only pay for Agentic Plus on the document types that need it. At 25 credits a page it costs 25 times what Fast does.

## Pricing

As of November 2026, llamaindex.ai/pricing lists a Pay-as-you-go plan at $0 a month with 10,000 free credits every month and $1.50 per 1,000 credits after that, a Pro plan at $500 a month with 400,000 credits a month and $1.25 per 1,000 after, and a custom Enterprise plan with volume discounts.

In page terms, as of November 2026 on Pay-as-you-go, 1,000 pages cost $1.50 on Fast, $4.50 on Cost-effective, $15.00 on Agentic and $37.50 on Agentic Plus. The free allowance therefore covers 10,000 Fast pages or 400 Agentic Plus pages a month. Monthly credits reset and do not carry over, and when the balance reaches zero new jobs pause until you buy a credit pack or enable auto-reload.

## Good to know

Limits to plan around: Pay-as-you-go runs 5 concurrent parse jobs, Pro 20 and Enterprise 100, and Pay-as-you-go accounts get one project. Documents are processed on LlamaIndex's infrastructure unless you buy an Enterprise deployment in your own cloud or on-premises, which rules the standard service out for some regulated data. HIPAA processing, SSO and single-tenant hosting are Enterprise-only.

If you are following an older tutorial, check the package name. Current code uses `llama-cloud` and `client.parsing`; the `llama-parse` and `llama-cloud-services` packages are deprecated.

Against the alternatives: [Docling](/tools/docling) and [Marker](/tools/marker) are open-source parsers you run yourself, which keeps documents on your own hardware and costs compute instead of credits. [Unstructured](/tools/unstructured) offers an open-source library alongside a hosted pipeline product. [Reducto](/tools/reducto) is the closest hosted competitor on high-accuracy parsing. [Best document parsers for RAG](/guides/comparisons/best-document-parsers-for-rag-2026) compares them.
