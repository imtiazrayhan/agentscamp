---
name: "Chonkie"
title: "Chonkie"
description: "A lightweight, fast chunking library for RAG with many splitting strategies in one API."
seoDescription: "Chonkie is an MIT-licensed chunking library for RAG: token, sentence, recursive, semantic, code and late chunkers, pipelines and vector DB export."
url: "https://chonkie.ai"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/feyninc/chonkie"
license: "MIT"
sameAs: ["https://github.com/feyninc/chonkie", "https://docs.chonkie.ai"]
color: "green"
topics: ["rag-retrieval"]
audience: ["ai-engineers"]
tags: ["chunking", "rag", "python", "open-source"]
featured: false
alternativeTo: ["langchain", "llamaindex"]
summary: "Chonkie is an MIT-licensed Python and JavaScript library that splits documents into retrieval-ready chunks. It puts ten-plus chunkers behind one interface, from token windows to semantic, code-aware and LLM-driven splitting, and its Pipeline API can embed chunks and export them to a vector database. The base install is small; heavier chunkers are extras."
related: ["skill:chunking-strategy-optimizer", "guide:how-rag-works", "agent:rag-pipeline-engineer", "tool:qdrant"]
faq:
  - q: "Which Chonkie chunker should I use?"
    a: "Chonkie's own guide says to start with RecursiveChunker, its best general default. Use CodeChunker for source code, TableChunker for Markdown or HTML tables, FastChunker when throughput matters more than boundaries, and SemanticChunker (or NeuralChunker if you have no embedding model) when you need chunks grouped by topic."
  - q: "How do I install Chonkie?"
    a: "pip install chonkie gives the basic chunkers and needs Python 3.10 or later. Extras add the rest: chonkie[semantic] for SemanticChunker, chonkie[code] for CodeChunker, chonkie[neural] for NeuralChunker, chonkie[genie] for the LLM-based SlumberChunker, or chonkie[all] for everything. JavaScript users install @chonkiejs/core."
  - q: "Is Chonkie faster than LangChain's and LlamaIndex's splitters?"
    a: "In Chonkie's own benchmark on 100,000 Wikipedia articles, yes: recursive chunking took 1 minute 19 seconds against 2 minutes 45 seconds for LangChain, and token chunking took 58 seconds against 1 minute 10 seconds for LangChain and 50 minutes for LlamaIndex. The numbers are vendor-run, so repeat the test on your own corpus if speed decides the choice."
  - q: "Does Chonkie only do chunking?"
    a: "No longer. It still centres on chunking, but it also has chefs that parse Markdown, tables and PDFs, refineries that add overlap or embeddings, and handshakes that write chunks to stores such as Qdrant, Pinecone, pgvector, Weaviate, Chroma and Milvus. It does not do retrieval or generation."
---

Chonkie is an open-source **chunking** library for RAG, published for Python and JavaScript under the MIT license. Chunking, splitting documents into the passages you embed and retrieve, sets the ceiling on retrieval quality, and Chonkie puts the common strategies behind one interface so you can swap them without rewriting your pipeline. The latest release is v1.7.0 (July 2026), and the repository has about 4,900 GitHub stars as of November 2026.

It suits engineers who want good splitters without adopting a whole RAG framework to get them.

## Highlights

The chunkers, and when Chonkie's docs say to use each:

| Chunker | How it splits | Use it for |
| --- | --- | --- |
| `TokenChunker` | Fixed-size token windows with overlap | Strict token budgets |
| `SentenceChunker` | At sentence boundaries | Simple prose |
| `RecursiveChunker` | Hierarchically, by customizable rules, with recipes such as `markdown` | General default for structured documents |
| `SemanticChunker` | Groups sentences by embedding similarity | Topic-coherent chunks |
| `NeuralChunker` | A fine-tuned BERT model detects topic shifts | Topic splits with no embedding model |
| `LateChunker` | Embeds the whole text first, then splits (late chunking) | Higher recall |
| `CodeChunker` | By AST structure, using Tree-sitter | Source code |
| `TableChunker` | By rows, keeping headers | Markdown and HTML tables |
| `FastChunker` | SIMD-accelerated byte-size splitting | Maximum throughput |
| `SlumberChunker` | An LLM chooses the split points | Best chunk quality, at the price of LLM calls |

Around them:

- **Pipeline API.** Chain chunkers and refineries, run sync or async, and get a document with its chunks back.
- **Refineries and handshakes.** Add overlap context or embeddings to chunks, then export to Chroma, Elasticsearch, LanceDB, Milvus, MongoDB, pgvector, Pinecone, Qdrant, Turbopuffer or Weaviate.
- **Self-hosted REST server.** `uvicorn chonkie.api.main:app` serves every chunker over HTTP for non-Python stacks.
- **Multilingual.** The README lists out-of-the-box support for 56 languages.

## In an AI-assisted workflow

```bash
pip install chonkie                 # basic chunkers
pip install "chonkie[semantic]"     # adds SemanticChunker; use [all] for everything
```

```python
from chonkie import RecursiveChunker

chunker = RecursiveChunker.from_recipe("markdown", lang="en")
chunks = chunker(document_text)

for chunk in chunks:
    print(chunk.token_count, chunk.text[:60])
```

A pipeline that chunks, adds overlap and embeds in one pass (from the README):

```python
from chonkie import Pipeline

pipe = (
    Pipeline()
    .chunk_with("recursive", tokenizer="gpt2", chunk_size=2048, recipe="markdown")
    .chunk_with("semantic", chunk_size=512)
    .refine_with("overlap", context_size=128)
    .refine_with("embeddings", embedding_model="sentence-transformers/all-MiniLM-L6-v2")
)
doc = pipe.run(texts=document_text)
```

> [!TIP]
> There is no universal best chunk size; it depends on your documents and embedding model. Try a few strategies and measure retrieval quality. The [Chunking Strategy Optimizer](/skills/data/chunking-strategy-optimizer) skill runs that sweep against a fixed eval set. Note that `RecursiveChunker` defaults to a `character` tokenizer and a `chunk_size` of 2,048, so pass your embedding model's tokenizer if you are sizing chunks in tokens.

## Good to know

**Size and speed, by Chonkie's own numbers.** The README gives a wheel size of 505 KB and an installed size of 49 MB for the base package, against 80 to 171 MB for the alternatives it measured. In its benchmark on 100,000 Wikipedia articles, recursive chunking took 1 minute 19 seconds against 2 minutes 45 seconds for LangChain, and sentence chunking took 59 seconds against 3 minutes 59 seconds for LlamaIndex. These are vendor-run results and do not carry over once you add the heavier extras: semantic and neural chunking pull in embedding or BERT models, and semantic chunking of the same corpus took about 14 minutes.

**Versus the framework splitters.** [LangChain](/tools/langchain)'s text splitters and [LlamaIndex](/tools/llamaindex)'s node parsers are the obvious substitutes, and if you already build on one of those frameworks its splitter plugs straight into its own document and retriever classes with no conversion. Chonkie is the better fit when you want chunking without the framework, need a strategy the framework lacks (its benchmark notes LangChain had no sentence chunker and LlamaIndex no recursive one), or care about install size in a serverless function. For PDFs and scanned documents, pair it with a parser such as [Docling](/tools/docling) or [Unstructured](/tools/unstructured); Chonkie's own chefs cover Markdown and tables, and extract PDF text through LiteParse or Mistral OCR.

**Limits.** Chonkie stops at ingestion. You still need a retriever and a store such as [Qdrant](/tools/qdrant), and `SlumberChunker` calls an LLM while it chunks, which costs money on large corpora. The company also offers a hosted version, but the open-source library does not need it. See [How RAG Actually Works](/guides/concepts/how-rag-works) for where chunking sits in the pipeline.
