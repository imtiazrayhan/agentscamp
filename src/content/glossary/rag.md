---
term: "RAG (Retrieval-Augmented Generation)"
description: "RAG retrieves relevant documents from your own data and injects them into an LLM's prompt at query time, grounding answers in facts the model wasn't trained on."
date: 2026-06-11
topics: ["rag-retrieval"]
tags: ["rag", "retrieval", "llm", "grounding"]
related: ["how-rag-works", "hybrid-search-reranking", "embedding", "vector-database", "hallucination", "rag-pipeline-engineer"]
faq:
  - q: "What problem does RAG solve?"
    a: "Models only know their training data — nothing about your codebase, your docs, or anything after their cutoff. RAG closes that gap at query time by fetching the relevant slice of your data and putting it in the prompt, which grounds answers in real sources and sharply reduces hallucination on private or fresh information."
  - q: "Is RAG the same as fine-tuning?"
    a: "No. RAG supplies knowledge at query time without changing the model; fine-tuning changes the model's weights to teach behavior or style. Knowledge that changes often belongs in RAG; durable behavior belongs in fine-tuning — and many production systems use both."
---

**RAG (retrieval-augmented generation) is the technique of fetching relevant documents from your own data and inserting them into a language model's prompt at query time, so the model answers from retrieved facts instead of training-data memory alone.**

The pipeline has two halves. Offline, your documents are split into chunks, converted to [embeddings](/glossary/embedding), and stored in a [vector database](/glossary/vector-database). Online, the user's question is embedded the same way, the most similar chunks are retrieved (often refined by [reranking](/glossary/reranking)), and those chunks are placed in the prompt alongside the question. The model then generates an answer grounded in what was retrieved.

RAG became the default architecture for "chat with your data" because it solves the two things models can't do alone: know **private** information and know **current** information — without the cost of retraining. Its quality ceiling is retrieval quality: if the right chunk isn't fetched, the best model still answers wrong, which is why most RAG engineering effort goes into chunking, search, and reranking rather than the model call.

For the full pipeline, stage by stage, see [How RAG Actually Works](/guides/concepts/how-rag-works).
