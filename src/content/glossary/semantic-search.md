---
term: "Semantic Search"
description: "Semantic search retrieves results by meaning rather than keyword overlap — embedding queries and documents in one vector space and matching by similarity."
summary: "Semantic search embeds your corpus offline and the query at runtime, then returns nearest neighbors in that shared vector space, so users never have to guess a document's vocabulary. The flip side is exact tokens like error codes and SKUs, which is why mature systems add keyword search and a reranker."
date: 2026-06-11
topics: ["rag-retrieval"]
audience: ["ai-engineers"]
tags: ["search", "embeddings", "retrieval", "rag"]
related: ["guide:hybrid-search-reranking", "glossary:embedding", "glossary:vector-database", "glossary:reranking", "glossary:rag"]
faq:
  - q: "How is semantic search different from keyword search?"
    a: "Keyword (lexical) search matches the words themselves — great for exact identifiers, brittle for paraphrases. Semantic search matches meaning via embeddings, so 'laptop won't turn on' finds 'computer fails to boot.' The trade flips for exact strings: error codes and product SKUs are where keyword search still wins."
  - q: "Why do production systems combine both?"
    a: "Because their failure modes are complementary. Hybrid search runs lexical (BM25) and semantic retrieval together and merges the results, catching both the exact-match cases embeddings fuzz over and the paraphrases keywords miss — usually followed by a reranker to sort the merged pool precisely."
---

**Semantic search retrieves documents by meaning instead of word overlap: queries and documents are mapped into the same [embedding](/glossary/embedding) space, and relevance becomes vector similarity.**

The mechanism is simple once embeddings exist — embed the corpus offline into a [vector database](/glossary/vector-database), embed the query at runtime, return the nearest neighbors. The payoff is robustness to phrasing: users don't need to guess the document's vocabulary. The cost is the flip side: semantic search can miss **exact tokens** — error codes, function names, SKUs — that old-fashioned keyword search nails, and it inherits whatever blind spots the embedding model has in your domain.

That's why mature retrieval is rarely semantic-only. **Hybrid search** pairs BM25 keyword retrieval with vector search, and a [reranker](/glossary/reranking) re-sorts the merged candidates — recall from breadth, precision from the reranker. The full pattern, with when each piece earns its place, is in [Hybrid Search & Reranking](/guides/concepts/hybrid-search-reranking).
