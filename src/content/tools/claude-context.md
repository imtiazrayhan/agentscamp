---
name: "Claude Context"
title: "Claude Context"
seoTitle: "Claude Context MCP: Semantic Code Search for Claude Code"
description: "Zilliz's MIT-licensed MCP server that indexes your codebase into Milvus or Zilliz Cloud and gives your agent hybrid semantic code search."
date: "2026-09-11"
url: "https://github.com/zilliztech/claude-context"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/zilliztech/claude-context"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "code-search", "semantic-search", "vector-database", "embeddings"]
featured: false
sameAs:
  - "https://www.npmjs.com/package/@zilliz/claude-context-mcp"
related: ["tool:serena", "tool:milvus", "tool:repomix", "guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:hybrid-search-reranking"]
alternativeTo: ["serena", "claude-code", "repomix"]
summary: "Claude Context is Zilliz's MIT-licensed MCP server for semantic code search. It indexes your repository into Milvus or Zilliz Cloud using AST-based chunking, then answers natural-language queries with hybrid BM25 and dense-vector search through four tools. It runs locally over stdio and needs Node.js 20+, an embedding provider, and a vector database."
faq:
  - q: "What does Claude Context add to Claude Code?"
    a: "Meaning-based code search backed by a persistent vector index of your repo. Instead of grepping for exact strings, you ask for something like functions that handle user authentication, and the agent pulls matching code through the search_code tool."
  - q: "How do I add Claude Context to Claude Code?"
    a: "Run claude mcp add claude-context -e OPENAI_API_KEY=sk-your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-public-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx @zilliz/claude-context-mcp@latest with your own values, then prompt 'Index this codebase'. Other embedding providers are selected with the EMBEDDING_PROVIDER environment variable."
  - q: "Is Claude Context free?"
    a: "The software is MIT and free. Running it costs whatever your embedding API and vector database cost, or nothing extra with local Ollama embeddings and a self-hosted Milvus; Zilliz Cloud also advertises a free vector database option."
---

**Claude Context** is Zilliz's open-source MCP server for **semantic code search**: it indexes your whole repository into a vector database and lets the agent ask for code by meaning ("find functions that handle user authentication") instead of reading directories or grepping for exact strings. It earns its setup cost on large codebases where [Claude Code](/tools/claude-code) keeps missing the relevant files. On a small repo, an embedding provider plus a vector database is more infrastructure than the problem needs.

## Highlights

- **Hybrid retrieval** — BM25 keyword scoring plus dense-vector similarity, so both exact identifiers and plain-language descriptions can match.
- **Four tools** — `index_codebase`, `search_code`, `clear_index`, and `get_indexing_status`.
- **Incremental re-indexing** — Merkle trees track what changed, so only modified files are re-indexed.
- **AST-based chunking** — code is split along its syntax tree, with automatic fallback to a character-based LangChain splitter.
- **Pluggable embeddings and storage** — OpenAI, VoyageAI, Gemini, or local Ollama for embeddings, and [Milvus](/tools/milvus) or Zilliz Cloud for the index.
- **14 languages out of the box** — TypeScript, JavaScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Scala, and Markdown; add more extensions with `CUSTOM_EXTENSIONS`.

## In an AI-assisted workflow

The README's Claude Code command uses OpenAI embeddings and a Zilliz Cloud database:

```bash
claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=your-zilliz-cloud-public-endpoint \
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -- npx @zilliz/claude-context-mcp@latest
```

Then drive it with the README's own prompts:

```text
Index this codebase
Check the indexing status
Find functions that handle user authentication
```

To keep embeddings on your machine, the MCP package README shows a local Ollama setup, which "allows you to run embeddings locally without sending data to external services":

```json
{
  "mcpServers": {
    "claude-context": {
      "command": "npx",
      "args": ["-y", "@zilliz/claude-context-mcp@latest"],
      "env": {
        "EMBEDDING_PROVIDER": "Ollama",
        "EMBEDDING_MODEL": "nomic-embed-text",
        "OLLAMA_HOST": "http://127.0.0.1:11434",
        "EMBEDDING_DIMENSION": "768",
        "MILVUS_TOKEN": "your-zilliz-cloud-api-key"
      }
    }
  }
}
```

For background on how keyword and vector retrieval combine, and where a reranker fits, see our guide to [hybrid search and reranking](/guides/concepts/hybrid-search-reranking).

> [!TIP]
> Indexing is an explicit step. Ask for "Index this codebase" once per repo, and check the indexing status before you trust search results on a large codebase; later re-indexing only processes the files that changed.

## How it compares

[Serena](/tools/serena) is the closest alternative, and the choice is about mechanism: Claude Context finds code by meaning through embeddings and hybrid search but has no editing tools and needs an embedding provider plus a vector database, while Serena uses language-server symbol knowledge (find symbols and references, symbol-level edits, renames) with no vector database at all. [Context7](/tools/context7) solves a different problem, serving third-party library docs rather than indexing your own repository, so the two stack well. [Repomix](/tools/repomix) is the low-infrastructure option when you'd rather hand the agent a whole-repo snapshot than query a persistent index.

## Good to know

Claude Context is MIT licensed and maintained by Zilliz, with about 12.5k GitHub stars as of September 2026. It needs Node.js 20 or newer (the README says `>= 20.0.0`), an embedding provider, and Milvus or Zilliz Cloud; Docker isn't required. It's stdio only, with no hosted endpoint. The npm package `@zilliz/claude-context-mcp` was last published in June 2026 (v0.1.15), and the repo's last commit landed in July 2026; there are no GitHub Releases, and its git tags stop at v0.1.11 (April 2026). The same engine also ships as a VS Code extension, Semantic Code Search, and as `@zilliz/claude-context-core` for direct use.

Zilliz reports roughly 40% fewer tokens at equivalent retrieval quality, from its own evaluation. Two caveats: unless you use Ollama, your code goes to whichever embedding API you configure, and the README doesn't spell out Zilliz Cloud's free-tier limits. For setup scopes and passing env vars, see [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup), and for what else to install, [the best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026).
