---
name: "LlamaIndex"
description: "The data framework for LLM apps — ingestion, indexing, query engines, and document agents — now centered on document processing with LlamaParse and LlamaCloud."
date: 2026-06-11
url: "https://www.llamaindex.ai"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/run-llama/llama_index"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "pink"
topics: ["rag-retrieval"]
tags: ["rag", "data-framework", "documents", "python", "llm"]
featured: false
alternativeTo: ["langchain"]
sameAs:
  - "https://github.com/run-llama/llama_index"
  - "https://developers.llamaindex.ai"
  - "https://pypi.org/project/llama-index/"
related: ["guide:langchain-vs-llamaindex", "guide:how-rag-works", "tool:langchain", "skill:chunking-strategy-optimizer", "guide:vlm-ocr-documents", "skill:multimodal-document-extractor"]
summary: "LlamaIndex (MIT, ~50k stars) is the data-first framework: connectors and ingestion pipelines, indexes and query engines for RAG, agents over documents, and event-driven Workflows for orchestration. The company's 2026 center of gravity is document processing — LlamaParse's agentic OCR for 50+ file types and the LlamaCloud parse/extract/index platform."
faq:
  - q: "What is LlamaIndex best at?"
    a: "Everything between your documents and the model: connectors for files/APIs/databases, chunking and indexing strategies, query engines that compose retrieval with synthesis, and document agents. If your application's hard problem is 'our knowledge lives in messy files,' LlamaIndex's abstractions map to it more directly than general agent frameworks."
  - q: "What are LlamaParse and LlamaCloud?"
    a: "The commercial layer, and increasingly the headline: LlamaParse is agentic OCR/parsing for complex documents (tables, layouts, handwriting, 50+ formats); LlamaCloud wraps parse/extract/index as managed pipelines with a credit-based freemium (a free monthly tier, then paid plans). The open-source framework remains MIT and free."
  - q: "Why is LlamaIndex still version 0.x?"
    a: "Deliberate policy — no 1.0 has shipped, and minor versions can carry breaking changes, so pin your versions. The project is very active (frequent releases; Workflows split into its own package); 0.x signals API philosophy, not abandonment."
---

LlamaIndex answered a different question than the agent frameworks: not "how do I orchestrate a model" but **"how do I get my data to it well."** That data-first identity — ingestion, indexing, retrieval, synthesis — made it the canonical [RAG](/glossary/rag) framework, and by 2026 it sharpened further: the leading platform for *document* intelligence specifically.

## Highlights

- **Connectors and pipelines** — ingest from files, APIs, and databases (the LlamaHub ecosystem), with the chunking/transform machinery RAG lives on.
- **Indexes and query engines** — vector, keyword, summary, and graph indexes behind query engines that compose retrieval with answer synthesis.
- **Document agents** — multi-step agents over your corpus: routing across indexes, comparing documents, iterating on retrieval.
- **Workflows** — event-driven, async-first orchestration (now its own package), the recommended backbone for non-trivial apps.
- **LlamaParse** — agentic OCR that handles what breaks naive parsers: complex tables, layouts, handwriting, 50+ file types, with tiered quality/cost modes.
- **LlamaCloud** — managed parse/extract/index pipelines when you'd rather consume document processing than operate it.

## In an AI-assisted workflow

```bash
pip install llama-index      # TS: npm install llamaindex
# index = VectorStoreIndex.from_documents(SimpleDirectoryReader("docs").load_data())
# index.as_query_engine().query("…")
```

The five-liner above is still the fastest credible RAG bootstrap in Python — and the on-ramp to the deeper machinery when [chunking](/skills/data/chunking-strategy-optimizer) and retrieval quality start mattering.

> [!NOTE]
> Version policy: deliberately 0.x — pin versions, expect movement between minors. And the company's attention visibly tilts toward the paid document platform (the docs landing leads with LlamaParse); the framework is healthy, but the commercial story is documents.

## Good to know

MIT, ~50k stars, Python flagship with a TypeScript sibling. The eternal confusion — "LlamaIndex or LangChain?" — is a category error worth untangling properly: [LangChain vs LlamaIndex](/guides/comparisons/langchain-vs-llamaindex). For the document-understanding wave it's riding, see [VLMs for OCR and Documents](/guides/vision/vlm-ocr-documents).
