---
title: "Why RAG Fails: A Debugging Checklist"
description: "A diagnostic checklist for broken RAG — localize the failure to ingestion, retrieval, ranking, or generation, and apply the fix that matches, in order."
author: "AgentsCamp"
date: 2026-06-12
color: "green"
topics: ["rag-retrieval"]
tags: ["rag", "debugging", "troubleshooting", "retrieval"]
featured: false
summary: "Debug RAG by localizing, not guessing: for a failing query, check whether the answer exists in the corpus (ingestion), was retrieved in the top-50 (retrieval), ranked into the context (ranking), and was used faithfully (generation). Each stage has distinct fixes, and fixing the wrong stage wastes weeks. The checklist runs the stages in order."
keyTakeaways:
  - "One failing query, four suspects: ingestion (answer not indexed), retrieval (not in candidates), ranking (in candidates, not in context), generation (in context, not in answer). Localize before fixing."
  - "The two commands that localize: search your raw chunks for the answer text (ingestion check), then inspect the actual retrieved set for the failing query (retrieval/ranking check). Most teams skip both and tune blindly."
  - "Ingestion failures hide best: parsing dropped the table, chunking severed the answer mid-thought, or the document never made it in. If the answer isn't in any chunk, no retriever can save you."
  - "Retrieval misses split by type: vocabulary mismatch wants hybrid search (BM25 + vectors); semantic misses want better embeddings or query rewriting; 'in top-50 but not top-5' wants a reranker."
  - "Generation failures need grounding discipline: answer-from-context-only instructions, 'say you don't know' as an allowed move, and citations so unfaithfulness is visible."
faq:
  - q: "My RAG system hallucinates — where do I start?"
    a: "Establish whether it's hallucination or retrieval failure wearing its costume: inspect what was actually retrieved for the failing query. If the right content wasn't in the context, the model improvised over a gap — that's a retrieval problem (most 'hallucination' is). If the right content WAS there and the answer still contradicts it, that's faithfulness — tighten grounding instructions, lower temperature, require citations."
  - q: "Retrieval returns irrelevant chunks — what's wrong?"
    a: "Check in order: (1) chunking — are chunks coherent units, or mid-sentence fragments that embed poorly? (2) query-document mismatch — user phrasing vs document vocabulary often needs hybrid search or query rewriting; (3) embedding fit — generic embeddings on specialized jargon underperform (test a domain-stronger model on a sample); (4) missing filters — retrieval across tenants/versions pollutes results metadata filtering would fix."
  - q: "When do I need a reranker vs better retrieval?"
    a: "Measure recall@50 on your failing queries. Right answer usually present in the top-50 but absent from the top-5 → reranking converts that recall into precision. Right answer absent from the top-50 entirely → no reranker can help; fix retrieval first (hybrid search, embeddings, chunking)."
related: ["how-rag-works", "hybrid-search-reranking", "agentic-rag", "chunking-strategy-optimizer", "embedding-set-inspector", "benchmark-rerankers", "write-llm-evals"]
---

RAG fails in four places, and the fixes don't transfer: weeks of prompt-tuning can't repair a chunking bug, and a new embedding model can't fix answers your parser never indexed. The discipline is **localize first** — walk a failing query through the stages, in order, and fix where it actually broke. ([How RAG Actually Works](/guides/concepts/how-rag-works) covers the healthy pipeline; this is the page for when it isn't.)

## Step 0: Build the failure set

Collect 10–20 real failing queries with the *expected* answers and, ideally, the source passages that contain them. Debugging one anecdote produces anecdotal fixes; a set reveals which stage dominates — and becomes your regression suite when fixes land ([the eval discipline](/guides/evaluation/write-llm-evals)).

## Step 1: Is the answer in the corpus at all? (Ingestion)

Text-search your *indexed chunks* — not the source documents — for the expected answer. Misses here are silent and common: the parser dropped the table or PDF page, the document never entered the pipeline, or **chunking severed the answer** so no single chunk contains the complete thought. Fixes: repair parsing (tables and PDFs are the usual victims — [VLM-based extraction](/guides/vision/vlm-ocr-documents) for the hostile ones), revisit [chunk boundaries and overlap](/skills/data/chunking-strategy-optimizer), verify ingestion coverage. **If the answer isn't in any chunk, stop — no downstream fix applies.**

## Step 2: Does retrieval find it? (Recall)

Run the failing query, inspect the top-50 candidates. The answer-bearing chunk absent? Classify the miss: **vocabulary mismatch** (user says "laptop won't boot", docs say "system initialization failure") → add [hybrid search](/guides/concepts/hybrid-search-reranking) (BM25 catches exact terms) and/or query rewriting; **semantic miss** (embedding doesn't capture domain meaning) → [inspect the embedding set](/skills/data/embedding-set-inspector), trial a stronger/domain-fit model on a sample; **filter problems** → missing metadata filters pollute, wrong ones exclude. Multi-hop questions failing here are a *shape* problem — single-shot retrieval can't express them; that's [agentic RAG](/guides/concepts/agentic-rag) or [GraphRAG](/guides/concepts/graph-rag) territory, not tuning.

## Step 3: Does it rank into the context? (Precision)

In the top-50 but below your top-k cutoff? That's the textbook [reranking](/glossary/reranking) case — convert recall you have into precision you need ([benchmark it](/commands/review/benchmark-rerankers) on your queries before and after). Also check the cheap fixes: a too-small k (modern context windows afford generous candidate sets — [the long-context dividend](/guides/concepts/rag-vs-long-context)), and duplicate near-identical chunks crowding out diversity (dedupe at index time).

## Step 4: Does the model use it? (Faithfulness)

Answer-bearing context delivered, answer still wrong — now and only now is it a generation problem. The grounding kit: instructions to answer *only* from provided context, with "the context doesn't contain this" as an explicitly allowed (and tested) response; required citations, so unfaithfulness becomes visible and checkable; temperature down for factual QA; and faithfulness metrics in your eval suite so regressions surface as numbers, not anecdotes.

> [!TIP]
> Print the stage tally from your failure set. In practice most teams find a heavy skew — often the majority failing at Steps 1–2 while engineering attention goes to Step 4's prompts. The checklist's whole value is spending effort where the failures actually are.
