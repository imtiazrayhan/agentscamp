---
name: "LlamaIndex"
description: "LlamaIndex is an MIT-licensed Python framework for RAG and agents over your data, from the company whose main product is now the LlamaParse platform."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.llamaindex.ai"
pricing: "open-source"
category: "sdk"
repo: "https://github.com/run-llama/llama_index"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "pink"
topics: ["rag-retrieval"]
audience: ["ai-engineers"]
tags: ["rag", "data-framework", "documents", "python", "llm"]
featured: false
alternativeTo: ["langchain"]
sameAs:
  - "https://github.com/run-llama/llama_index"
  - "https://developers.llamaindex.ai"
  - "https://pypi.org/project/llama-index/"
related: ["guide:langchain-vs-llamaindex", "guide:how-rag-works", "tool:langchain", "skill:chunking-strategy-optimizer", "guide:vlm-ocr-documents", "skill:multimodal-document-extractor"]
summary: "LlamaIndex is an open-source (MIT) Python framework for RAG and agents: data connectors, indexes, query engines, agents and event-driven Workflows, with 300+ integration packages. The company now says its primary focus is LlamaParse, the paid document platform formerly called LlamaCloud, and the TypeScript port is deprecated."
faq:
  - q: "Is LlamaIndex still maintained?"
    a: "Yes, with a caveat. The Python framework keeps shipping (v0.14.26 went to PyPI on November 13, 2026), but the repository README says the company's primary focus has shifted to LlamaParse, with the framework kept available as an open toolkit. LlamaIndex.TS, the TypeScript port, is marked deprecated and no longer maintained."
  - q: "How much does LlamaParse cost?"
    a: "As of November 2026, LlamaIndex's pricing page lists Pay-as-you-go at $0 a month with 10,000 free credits monthly, then $1.50 per 1,000 credits; Pro at $500 a month with 400,000 credits, then $1.25 per 1,000; and Enterprise on custom pricing. A parsed page costs 1 credit on the Fast tier, 3 on Cost-effective, 10 on Agentic and 25 on Agentic Plus. The framework itself is free."
  - q: "Are LlamaCloud and LlamaParse the same thing?"
    a: "Yes. LlamaIndex's pricing FAQ says LlamaParse is the new name for the platform previously called LlamaCloud. The old name survives in SDK package names such as llama-cloud, the LLAMA_CLOUD_API_KEY variable and older docs. The platform groups Parse, Extract, Classify, Split and Index."
  - q: "Why is LlamaIndex still version 0.x?"
    a: "No 1.0 has shipped, and a 0.x number means minor releases can carry breaking changes. Pin llama-index and llama-index-core to the same version, and pin each integration package you add, because integrations are versioned separately from core."
---

LlamaIndex is an open-source Python framework for connecting LLMs to your own data. It was the first widely used toolkit built around [RAG](/glossary/rag): load documents, split and embed them, index them, then retrieve and synthesize an answer. It has since grown agents and an event-driven orchestration layer. The repository is MIT-licensed with about 53,000 GitHub stars as of November 2026, and the current release is v0.14.26 (November 13, 2026), which needs Python 3.11 or newer.

Read the project's own status note before you adopt it. The README now says the company's primary focus has shifted to **LlamaParse**, its commercial document parsing and extraction platform, and that the framework remains "available as an open toolkit". The docs describe it as "our original open-source toolkit for RAG and agents". It still ships releases, but it is no longer where the company's attention goes.

## Highlights

- **Data connectors.** Readers for files, APIs and databases, starting with `SimpleDirectoryReader` for a local folder. The README counts over 300 integration packages for LLMs, embedding models and vector stores.
- **Indexes and query engines.** `VectorStoreIndex` and a property graph index, among others, behind query engines and chat engines that combine retrieval with answer synthesis. Retrievers, node postprocessors (rerankers) and response synthesizers can each be swapped.
- **Agents.** `FunctionAgent` and `AgentWorkflow` run tool-calling agents; a query engine is one tool among others, which is how the starter tutorial builds an agent over documents.
- **Workflows.** Event-driven, async multi-step processes with branching, retries and human-in-the-loop steps. They ship as a separate package, `llama-index-workflows`, with minimal dependencies, and can be served as a REST API.
- **Two install shapes.** `llama-index` is a starter bundle of core plus common integrations. `llama-index-core` plus hand-picked packages such as `llama-index-llms-ollama` keeps the dependency tree small.
- **LlamaParse hand-off.** The built-in readers are fine for clean text. For scans, tables and slide decks, the docs route you to LlamaParse (hosted, paid beyond the free credits) or LiteParse (open-source, local).

## In an AI-assisted workflow

The shortest working RAG pipeline, from the README:

```python
# pip install llama-index     (reads OPENAI_API_KEY by default)
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)

query_engine = index.as_query_engine()
print(query_engine.query("What does the contract say about termination?"))

index.storage_context.persist()   # writes ./storage; in-memory otherwise
```

Imports tell you where code lives: `llama_index.core.*` is the core package, anything else (`llama_index.llms.openai`, `llama_index.embeddings.huggingface`) is an integration you installed separately. To run without a hosted API, set `Settings.llm` and `Settings.embed_model` to local models, as the docs' local-models tutorial does with Ollama and a Hugging Face embedding model.

That five-line version uses default chunking and top-k retrieval, which is where answer quality usually stalls. The next steps are a deliberate [chunking strategy](/skills/data/chunking-strategy-optimizer), a reranker, and an eval set to tell whether either helped.

> [!NOTE]
> Data is stored in memory unless you call `persist()` or configure a vector store. A prototype that re-embeds the corpus on every start is the most common first surprise on the bill.

## Pricing

The framework is free under MIT; you pay your model and embedding providers.

LlamaParse is separate and credit-metered. As of November 2026, LlamaIndex's pricing page lists **Pay-as-you-go** at $0 a month with 10,000 free credits every month, then $1.50 per 1,000 credits; **Pro** at $500 a month with 400,000 credits, then $1.25 per 1,000; and **Enterprise** on custom pricing with SSO, HIPAA processing with a BAA, and single-tenant or on-premises deployment. Credits per parsed page depend on the tier: Fast 1, Cost-effective 3, Agentic 10, Agentic Plus 25, and layout extraction adds 3 per page. Re-parsing a cached file costs nothing, and unused monthly credits do not carry over. See the [LlamaParse](/tools/llamaparse) page for the parser itself.

## Good to know

**TypeScript is gone.** The LlamaIndex.TS repository carries a deprecation notice saying the project is no longer maintained. The `llamaindex` npm package still installs, but new TypeScript projects should pick something else, such as the [Vercel AI SDK](/tools/vercel-ai-sdk) or [Mastra](/tools/mastra).

**Naming is in flux.** LlamaCloud was renamed LlamaParse, so "LlamaParse" now means both the parser and the whole platform, while packages and environment variables still say `llama-cloud` and `LLAMA_CLOUD_API_KEY`. Older tutorials use the previous names.

**Abstractions cost you visibility.** A query engine hides the prompt, the retrieval call and the synthesis step. That is fast to start with and slower to debug; turn on tracing early or drop to the retriever and synthesizer APIs when you need control.

**0.x versioning.** Minor releases can break APIs, and older examples that import straight from `llama_index` instead of `llama_index.core` predate the current package layout.

Against the alternatives: [LangChain](/tools/langchain) has the larger ecosystem and, with LangGraph, a stronger agent-orchestration story, while LlamaIndex has the deeper retrieval abstractions ([LangChain vs LlamaIndex](/guides/comparisons/langchain-vs-llamaindex) works through it). [Pydantic AI](/tools/pydantic-ai) is the leaner choice if you want typed agents and will wire retrieval yourself. If your real problem is parsing rather than orchestration, [Docling](/tools/docling) and [Unstructured](/tools/unstructured) are open-source parsers that feed any framework. For the document-understanding background, see [VLMs for OCR and Documents](/guides/vision/vlm-ocr-documents).
