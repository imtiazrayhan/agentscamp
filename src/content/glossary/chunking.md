---
term: "Chunking"
description: "Chunking splits documents into retrievable pieces before embedding — the RAG design decision that quietly determines retrieval quality."
date: 2026-06-12
topics: ["rag-retrieval"]
tags: ["chunking", "rag", "ingestion", "retrieval"]
related: ["rag", "embedding", "how-rag-works", "chunking-strategy-optimizer", "chonkie", "rag-debugging-checklist"]
faq:
  - q: "What chunk size should I use?"
    a: "Start around 300–800 tokens with 10–15% overlap and measure — but the real answer is shape, not size: chunks should be self-contained units of meaning (a section, a complete thought), which is why structure-aware splitting (headings, paragraphs) beats fixed-size slicing on most corpora. The right size is whatever your retrieval evals say it is."
  - q: "Why does chunking matter so much?"
    a: "Because chunks are what gets embedded and retrieved — a fact severed mid-thought across two chunks is invisible to retrieval, and a chunk stuffed with three topics embeds as mush. Bad chunking caps the whole pipeline: no embedding model or reranker can recover what the splitter destroyed."
---

**Chunking is splitting documents into pieces — the units that get [embedded](/glossary/embedding), indexed, and retrieved — and it's the most underestimated decision in any [RAG](/glossary/rag) pipeline.**

The constraint is structural: retrieval returns *chunks*, so each one must stand alone as evidence. Split mid-thought and the answer exists in your corpus but in no retrievable unit (the classic silent failure on [the debugging checklist](/guides/troubleshooting/rag-debugging-checklist)); merge too much and the chunk's embedding averages across topics, matching everything weakly. The craft balances coherence (complete semantic units), context (overlap so boundary-spanning facts survive), and granularity (focused enough to embed sharply).

The strategy ladder: **fixed-size** (baseline, structure-blind), **recursive/structure-aware** (split on headings → paragraphs → sentences — the sane default), **semantic** (boundary detection by embedding shift — expensive, occasionally worth it), and **document-aware** (tables, code blocks kept intact — where parsers and libraries like [Chonkie](/tools/chonkie) earn their keep). Whatever the choice, treat it empirically: chunking is a parameter your retrieval evals tune, which is exactly the experiment the [chunking-strategy-optimizer](/skills/data/chunking-strategy-optimizer) skill runs. The full pipeline context lives in [How RAG Actually Works](/guides/concepts/how-rag-works).
