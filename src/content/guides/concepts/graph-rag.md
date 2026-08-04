---
title: "GraphRAG Explained: When Knowledge Graphs Beat Vector Search"
description: "What GraphRAG is, how graph-based retrieval differs from vector RAG, the query shapes where it wins, and the honest costs before you build one."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["rag-retrieval"]
tags: ["graphrag", "knowledge-graph", "rag", "retrieval"]
featured: true
summary: "GraphRAG augments retrieval with a knowledge graph: entities and relationships extracted from your corpus, traversed at query time. Vector RAG answers 'find passages like this'; GraphRAG answers 'connect these things' — multi-hop questions, whole-corpus summaries, relationship queries. The cost is real: graph extraction is expensive and quality-critical."
keyTakeaways:
  - "Vector RAG retrieves by similarity and fails on questions whose answer spans many documents or requires hops — no single chunk resembles the question."
  - "GraphRAG builds a knowledge graph (entities, relationships, often community summaries) at index time, then retrieves by traversal: find the entity, walk its connections, collect evidence."
  - "Its sweet spots: multi-hop questions, 'global' questions about an entire corpus, and relationship-first domains (orgs, codebases, investigations, compliance)."
  - "Its costs: LLM-powered extraction over the whole corpus (expensive, repeated on updates), graph quality as a new failure surface, and added infrastructure."
  - "The pragmatic pattern is hybrid: vector search for needle-in-haystack, graph traversal for connect-the-dots — route by query shape rather than betting the pipeline on one."
faq:
  - q: "What is GraphRAG in simple terms?"
    a: "RAG where retrieval walks a knowledge graph instead of (or alongside) searching by vector similarity. At index time, an LLM extracts entities and relationships from your documents into a graph; at query time the system finds relevant entities and traverses their connections to assemble evidence — letting it answer questions that span multiple documents and hops."
  - q: "When does GraphRAG beat normal vector RAG?"
    a: "On connection-shaped questions: 'How is supplier X exposed to the regulation that affected customer Y?' requires chaining facts no single passage contains. Also on global questions ('what are the main themes across these 10,000 reports?'), which graph community summaries answer and top-k chunks structurally can't. For ordinary 'find the passage' lookups, vector RAG remains simpler, cheaper, and as good."
  - q: "Why isn't everyone using GraphRAG?"
    a: "Because the index is expensive and fragile: building it means LLM extraction over the entire corpus (a real bill), keeping it current means re-extraction on updates, and every extraction error becomes a retrieval error downstream. Teams that adopt it successfully have query patterns that genuinely need traversal — not just enthusiasm for graphs."
  - q: "Do I need a graph database for GraphRAG?"
    a: "Not necessarily. Microsoft's reference GraphRAG implementation works over parquet files; modest graphs fit in memory or even Postgres. Dedicated graph databases earn their place at scale or when you want graph query languages and ops — the concept doesn't require one on day one."
related: ["guide:how-rag-works", "guide:agentic-rag", "guide:rag-vs-long-context", "glossary:rag", "guide:hybrid-search-reranking", "skill:graphrag-scaffolder", "glossary:vector-database"]
---

Vector [RAG](/glossary/rag) has a structural blind spot: it retrieves passages that *resemble the question*. Ask something whose answer is **assembled from connections** — across documents, through relationships, over the whole corpus — and no chunk resembles the question, so retrieval returns fragments and the model improvises. **GraphRAG** is the fix for exactly that class of question: retrieval over a knowledge graph instead of a similarity index.

## The mechanism

GraphRAG moves the hard work to **index time**. An LLM pass over the corpus extracts *entities* (people, systems, companies, concepts) and *relationships* (X supplies Y, A depends on B), building a knowledge graph; most implementations — Microsoft's reference one popularized the pattern — also cluster the graph into communities and write **community summaries** at several levels, giving the corpus a hierarchical map.

Query time then has two new moves unavailable to vector search:

- **Local traversal** — resolve the question's entities, walk their neighborhoods (1–3 hops), and assemble the connected evidence: the multi-hop answer path.
- **Global summarization** — answer corpus-level questions ("dominant failure modes across all incident reports?") from community summaries rather than top-k chunks, which is the only honest way to "retrieve" something whose answer is *everywhere*.

## Where it wins — and loses

**Wins:** multi-hop questions (the chain `A→B→C` exists in three documents, none containing the question's vocabulary); global/thematic questions; relationship-first domains — org knowledge, codebases and their dependency structure, investigations, compliance webs. In these, vector RAG's failure isn't marginal, it's categorical.

**Loses:** cost and fragility. Index construction is LLM extraction over everything — a real bill, repeated as documents change. Extraction quality becomes load-bearing: a missed relationship is a silently unanswerable question; a hallucinated one is worse. And you've added an index type to operate. For needle-in-haystack lookups — most queries in most products — plain [vector retrieval with reranking](/guides/concepts/hybrid-search-reranking) stays simpler and equally good.

> [!TIP]
> Route, don't bet. The mature pattern is hybrid: classify incoming queries by shape (lookup vs connection vs global) and send each to the cheap index that answers it. GraphRAG as *a* retriever, not *the* pipeline.

## Building one without regret

1. **Audit your failed queries first.** GraphRAG is justified by a corpus of questions vector RAG demonstrably fumbles — multi-hop and global ones. No such corpus, no project.
2. **Scope the ontology.** Extract the few entity/relationship types your questions actually traverse; "extract everything" balloons cost and noise.
3. **Start with the reference shape** — extraction → graph → communities → summaries — on a corpus slice; measure answer quality against your failure set before indexing everything. The [graphrag-scaffolder](/skills/data/graphrag-scaffolder) skill stands up exactly this experiment.
4. **Plan the update path.** Incremental re-extraction on changed documents is the difference between a system and a demo.
5. **Keep the vector index.** You'll still want it for the lookup-shaped majority; the win is the router.

GraphRAG is the most substantive extension of the RAG pattern since [reranking](/glossary/reranking) — and the most oversold. The test is your queries: if their answers live in connections, the graph pays; if they live in passages, you already have the right architecture — see [How RAG Actually Works](/guides/concepts/how-rag-works) and, for the other 2026 evolution of the pattern, [Agentic RAG](/guides/concepts/agentic-rag).
