---
name: "Cohere Rerank"
title: "Cohere Rerank"
description: "A hosted reranking API that reorders retrieved passages by true relevance to a query."
seoDescription: "Cohere Rerank is a hosted reranking API that reorders retrieved passages by true relevance to a query — a drop-in precision boost for RAG and search."
url: "https://cohere.com/rerank"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
sameAs: ["https://docs.cohere.com/docs/rerank-overview"]
color: "blue"
topics: ["rag-retrieval"]
audience: ["ai-engineers"]
tags: ["reranking", "rag", "api", "search"]
featured: false
alternativeTo: ["voyage-ai"]
summary: "Cohere Rerank takes a query plus a list of retrieved passages and returns them sorted by relevance, each with a score. The current generation is Rerank 5, in Pro and Fast tiers with a 32,768-token context and 100+ languages. It runs on Cohere's API, on cloud marketplaces such as Azure AI Foundry and Amazon SageMaker, or in a private deployment."
related: ["guide:hybrid-search-reranking", "tool:voyage-ai", "tool:qdrant", "agent:retrieval-engineer", "command:benchmark-rerankers"]
faq:
  - q: "What is Cohere Rerank?"
    a: "Cohere Rerank is a reranking model family served through an API: you give it a query and a list of candidate passages from your vector or keyword search, and it returns them reordered by relevance, each with a score. It sits on top of an existing search system and needs no re-indexing."
  - q: "What is the latest Cohere Rerank model?"
    a: "Rerank 5, per Cohere's model docs as of November 2026. It comes as rerank-v5.0-pro, for the highest ranking quality on complex queries and long documents, and rerank-v5.0-fast, for low-latency and high-throughput work. Both have a 32,768-token context, return calibrated scores between 0 and 1, and support Context Focus. Cohere lists rerank-v4.0 as the previous generation, and rerank-v3.5 remains available with a 4k context."
  - q: "How much does Cohere Rerank cost?"
    a: "As of November 2026, Cohere's pricing page lists Rerank 5 Fast at $0.02 and Rerank 5 Pro at $0.05 per 1M tokens. Calls from a trial API key are free but rate limited to 10 requests a minute and barred from production or commercial use; a production key is pay-as-you-go at 1,000 requests a minute."
  - q: "Can I run Cohere Rerank outside Cohere's API?"
    a: "Yes. Cohere's docs list Rerank 5 on Azure AI Foundry and Amazon SageMaker, and rerank-v3.5 on Amazon Bedrock and Oracle OCI Generative AI. Cohere also sells private deployments in your own VPC or on-premises, and Model Vault, a dedicated managed environment priced per GPU hour. The model weights are proprietary, so there is no free self-hosted option."
---

Cohere Rerank is a **reranking** model family served through an API: you give it a query and a list of candidate passages (from your vector or keyword search), and it returns them reordered by relevance, each with a score. Where the bi-encoder embeddings used for first-stage retrieval score a query and a passage separately, a reranker reads them together, so it judges relevance more accurately at the cost of one model pass per candidate.

It is aimed at teams whose retrieval recall is fine but whose top results are noisy. Adding a rerank step after first-stage retrieval is one of the highest-leverage, lowest-effort upgrades to a RAG pipeline: over-retrieve broadly, then let the reranker surface the few passages that answer the question.

## Highlights

- **Rerank 5, in two tiers.** `rerank-v5.0-pro` (about 2B parameters) targets complex, reasoning-heavy queries and long or domain-specific documents. `rerank-v5.0-fast` (about 500M) targets high-volume search and agent loops. Both share one endpoint and request format.
- **Long context.** 32,768 tokens for query and document combined, against 4k for `rerank-v3.5`. Long documents are truncated to `max_tokens_per_doc`, which defaults to 4,096.
- **Calibrated scores.** Each result carries a score between 0 and 1 that Cohere says is calibrated, so one threshold can hold across queries and domains. That lets a pipeline decide to search again or answer "I don't know".
- **Context Focus.** Add `relevant_spans` to a Rerank 5 request and each result also returns the most relevant passages inside the document, with character offsets, so you can send only those to the LLM. It is off by default and available through the Cohere API.
- **Multilingual and semi-structured.** 100+ languages; pass JSON, tables or records as YAML strings.
- **Drop-in after any retriever.** Vector, keyword or hybrid, with no re-indexing. One request can carry up to 10,000 documents.

## In an AI-assisted workflow

The standard pattern is retrieve-wide, rerank-narrow:

```python
import cohere
co = cohere.ClientV2()  # reads CO_API_KEY

# candidates = top-50 passages from your vector DB (e.g. Qdrant)
result = co.rerank(
    model="rerank-v5.0-fast",   # or "rerank-v5.0-pro" for the highest quality
    query=question,
    documents=candidates,
    top_n=5,
)
top_passages = [candidates[r.index] for r in result.results if r.relevance_score > 0.3]
```

The 0.3 cut-off is a placeholder: pick a threshold from your own labeled queries.

> [!TIP]
> The win comes from over-retrieving first. Pull 25–50 candidates from your retriever, then rerank down to the 3–5 you put in the prompt, and measure the lift with [Benchmark Rerankers](/commands/review/benchmark-rerankers).

## Pricing

As of November 2026, Cohere's pricing page lists Rerank 5 Fast at $0.02 per 1M tokens and Rerank 5 Pro at $0.05 per 1M tokens. The same page's FAQ still defines a "search unit" (one query with up to 100 documents, with documents over 500 tokens split into chunks that each count as a document), which is how earlier Rerank models were metered, so confirm which basis applies to the model you call.

A trial API key is created with every account and its calls are free, but trial keys are limited to 10 Rerank requests a minute and may not be used for production or commercial purposes. Production keys are pay-as-you-go, with a limit of 1,000 Rerank requests a minute, and are billed monthly or when the balance reaches $250.

## Good to know

**Deployment options.** Besides Cohere's own API, the docs list Rerank 5 on Azure AI Foundry and Amazon SageMaker, and `rerank-v3.5` on Amazon Bedrock and Oracle OCI Generative AI. For data-residency needs, Cohere offers private deployment in a VPC or on-premises and Model Vault, a dedicated managed environment billed per GPU hour. The weights are proprietary; you cannot download and run Rerank for free.

**Limits Cohere states for Rerank 5.** Text only. No instructions that change how relevance is judged. Context Focus works best on targeted queries; tables, forms and code split less cleanly than prose.

**Cost and latency scale with what you send.** Every candidate is a model pass, and token-based pricing means long passages cost more than short ones. Rerank the top 25 to 50, not the top 1,000, and cap `max_tokens_per_doc` if your chunks are long.

**Older model ids still work.** `rerank-v4.0-pro`, `rerank-v4.0-fast`, `rerank-v3.5`, `rerank-english-v3.0` and `rerank-multilingual-v3.0` remain in the model list, but Cohere recommends Rerank 5 for new projects.

**Alternatives.** [Voyage AI](/tools/voyage-ai), now part of MongoDB, offers comparable hosted rerankers alongside its embeddings and is the usual head-to-head. If you need a reranker you can run on your own hardware at no licence cost, an open-weight cross-encoder served yourself is the other route, at the price of operating it. [Hybrid search and reranking](/guides/concepts/hybrid-search-reranking) explains where the step fits, and [retrieval-engineer](/agents/data-ai/retrieval-engineer) can wire it into an existing pipeline.
