---
term: "GraphRAG"
description: "GraphRAG is retrieval-augmented generation over an LLM-built knowledge graph and community summaries, built for questions about a whole corpus."
date: 2026-11-09
topics: ["rag-retrieval"]
audience: ["ai-engineers", "developers"]
tags: ["graphrag", "knowledge-graph", "rag", "retrieval", "query-focused-summarization"]
related: ["guide:graph-rag", "glossary:rag", "glossary:agentic-rag", "skill:graphrag-scaffolder", "glossary:vector-database"]
faq:
  - q: "Who created GraphRAG?"
    a: "Microsoft Research introduced it in the April 2024 paper From Local to Global: A Graph RAG Approach to Query-Focused Summarization (arXiv 2404.16130) by Darren Edge and nine co-authors. The microsoft/graphrag repository is the MIT-licensed reference implementation; its README says the code is a demonstration and not an officially supported Microsoft offering."
  - q: "Is Microsoft's GraphRAG still actively developed?"
    a: "No. Since August 14, 2026 the README has said the project is largely in maintenance mode and won't accept new PRs or implement new features, with bug fixes and dependency updates as appropriate. The latest release we found was v3.3.0, published October 8, 2026, so treat it as a stable reference implementation rather than a fast-moving product."
  - q: "What is the difference between local and global search in GraphRAG?"
    a: "Local search combines entities from the knowledge graph with text chunks from the raw documents, which suits questions about specific entities. Global search runs map-reduce over all the community reports, which the docs call resource-intensive but often good for questions about the dataset as a whole. The query engine also offers DRIFT search, which adds community information to local search, and a basic vector RAG mode for comparison."
summary: "GraphRAG is retrieval-augmented generation in which an LLM builds a knowledge graph of entities from your documents, groups related entities into communities, and pre-writes a summary of each. Corpus-wide questions are answered from those summaries. Microsoft Research introduced it in 2024; its reference repo has been in maintenance mode since August 2026."
---

**GraphRAG is a form of [retrieval-augmented generation](/glossary/rag) in which an LLM first turns a document collection into a knowledge graph of entities and relationships, then pre-writes summaries of clusters of related entities, so the system can answer questions about a whole corpus and not only questions that match a single passage.**

The term comes from Microsoft Research's paper "From Local to Global: A Graph RAG Approach to Query-Focused Summarization" (arXiv 2404.16130, April 2024). It starts from a gap in ordinary RAG, which "fails on global questions directed at an entire text corpus, such as 'What are the main themes in the dataset?'" because those are summarization tasks, not lookups. The index is built in two stages: derive an entity knowledge graph from the source documents, then "pregenerate community summaries for all groups of closely related entities." The reference implementation finds those communities with the Hierarchical Leiden algorithm. At query time each community summary produces a partial answer, and the partial answers are summarized again into the final response. On global sensemaking questions over datasets of about one million tokens, the authors report substantial gains over a conventional RAG baseline in the comprehensiveness and diversity of answers.

The open-source `microsoft/graphrag` project (MIT) exposes this as query methods: local search for specific entities, global search over community reports, DRIFT search, and a basic vector RAG mode for comparison. Its README warns that indexing "can be an expensive operation" and advises starting small. Since August 2026 it has described the project as largely in maintenance mode.

The mechanism, the costs and the query shapes where a graph pays are covered in [GraphRAG Explained](/guides/concepts/graph-rag), and the [graphrag-scaffolder](/skills/data/graphrag-scaffolder) skill sets up a measured experiment. GraphRAG changes what you retrieve over; [agentic RAG](/glossary/agentic-rag) changes how retrieval is driven, and the two combine.
