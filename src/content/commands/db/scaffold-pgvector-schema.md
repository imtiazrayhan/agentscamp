---
description: "Scaffold a production-ready pgvector schema and HNSW index for a corpus — matching the project's migration tooling, distance metric, and embedding dimensions."
argument-hint: "<table/corpus name and embedding dimensions, or a description of the data>"
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
model: "sonnet"
title: "Scaffold a pgvector Schema & HNSW Index"
color: "blue"
date: 2026-06-04
topics: ["data-ml", "rag-retrieval"]
related: ["pgvector", "best-vector-database-2026", "embedding-index-tuner", "vector-search-engineer"]
featured: false
summary: "Turn 'I need vectors in Postgres' into a correct, migration-managed schema. This command scaffolds a pgvector table, the right vector dimension and distance operator class, an HNSW index, and a filtered similarity query — using the project's existing migration tool, not hand-run DDL."
---

## Scope

Treat `$ARGUMENTS` as the corpus to store: a table/collection name, the embedding dimensions (and ideally the embedding model, so the distance metric is correct), and any metadata fields you'll filter on. If the dimensions or model aren't given, ask — guessing the vector size is the one thing you cannot paper over later.

Goal: produce a **migration-managed** pgvector schema and index that's correct on the first apply — right dimension, right operator class, indexed filter columns — not ad-hoc `CREATE TABLE` run by hand.

> [!NOTE]
> This scaffolds the schema; it does not embed your data. Embedding and ingestion are a separate step (see [pgvector](/tools/pgvector) and the [vector-search-engineer](/agents/data-ai/vector-search-engineer)).

## Step 1 — Detect the project's conventions

Before writing any SQL, find how this project manages schema: look for a migrations directory and tool (e.g. Prisma, Drizzle, Alembic, Flyway, golang-migrate, Rails, Knex) and match its file naming and format. Confirm Postgres is the database and check whether `vector` is already enabled. Never hand-write DDL out of band when a migration tool owns the schema — generate a migration in the project's format.

## Step 2 — Enable the extension

Add `CREATE EXTENSION IF NOT EXISTS vector;` as the first step of the migration (or confirm it's already enabled, including on the managed provider if there is one — most require enabling it explicitly).

## Step 3 — Define the table and vector column

Create the table (or alter an existing one) with a `vector(N)` column where **N is the embedding model's exact output dimension**. Include the content/reference columns and the metadata columns you'll filter on. State the dimension and model in a comment so the next person knows what produced these vectors.

## Step 4 — Choose the operator class to match the metric

Pick the index operator class to match the embedding model's distance metric — `vector_cosine_ops` for cosine (most common), `vector_l2_ops` for Euclidean, `vector_ip_ops` for inner product. A mismatch here silently degrades recall, so state the assumption explicitly.

## Step 5 — Create the HNSW index (and filter indexes)

Add an HNSW index on the vector column with the chosen operator class, and **B-tree indexes on the metadata columns you filter on** so filtered search doesn't fall back to a scan. Leave HNSW `m` / `ef_construction` at sensible defaults but note that they're tunable — point to the [Embedding Index Tuner](/skills/database/embedding-index-tuner) for fitting them to a recall target.

## Step 6 — Emit a sample query and the apply command

Provide a parameterized nearest-neighbour query with a metadata `WHERE` clause and an `ORDER BY embedding <=> $1 LIMIT 20` (over-retrieve, then rerank), and tell the user the exact command to apply the migration with their project's migration tool. Remind them that building the index on a large existing table should use `CREATE INDEX CONCURRENTLY` to avoid locking writes.

> [!WARNING]
> Get the **dimension** and **operator class** right before any data is loaded. Changing the vector dimension later means re-creating the column and re-embedding the whole corpus; changing the metric means re-building the index. Both are far cheaper to decide now than to migrate later.
