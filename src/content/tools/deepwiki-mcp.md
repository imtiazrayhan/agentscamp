---
name: "DeepWiki MCP"
title: "DeepWiki MCP"
seoTitle: "DeepWiki MCP: Free Q&A Over Any Public GitHub Repo"
description: "Cognition's free, no-auth remote MCP server for DeepWiki: generated wikis and grounded Q&A for any public GitHub repository, from inside your agent."
date: "2026-09-11"
url: "https://docs.devin.ai/work-with-devin/deepwiki-mcp"
pricing: "free"
category: "mcp"
os: ["Web"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "github", "documentation", "code-understanding", "remote-mcp"]
featured: false
sameAs:
  - "https://deepwiki.com"
related: ["tool:gitmcp", "tool:context7", "tool:devin", "guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "command:add-mcp-server"]
alternativeTo: ["context7", "gitmcp", "github-mcp-server"]
summary: "DeepWiki MCP is Cognition's free, remote, no-authentication MCP server for public GitHub repos. Its three tools let an agent list a repo's wiki topics, read DeepWiki's generated documentation, and ask questions that return a context-grounded AI answer. It's a proprietary hosted service; private repos go through the separate Devin MCP with a Devin API key."
faq:
  - q: "What does DeepWiki MCP add to Claude Code?"
    a: "Architecture-level context on other people's repositories, such as your dependencies or an unfamiliar open-source project, through DeepWiki's generated wikis and an ask_question tool. There's nothing to clone or index locally."
  - q: "How do I add DeepWiki MCP to Claude Code?"
    a: "Run the command from Devin's docs: claude mcp add -s user -t http deepwiki https://mcp.deepwiki.com/mcp. The -s user flag makes it available in every project, and no API key is needed."
  - q: "Is DeepWiki MCP free?"
    a: "Yes for public repositories: Cognition describes it as a free, remote, no-authentication-required service. Private repositories need a Devin account and API key, used through the separate Devin MCP server."
---

**DeepWiki MCP** is Cognition's free, remote, no-authentication MCP server that gives an agent **repository-level understanding of any public GitHub repo**: it can browse the wiki DeepWiki generated for that repo, or ask a question and get back a grounded, AI-generated answer. Use it to understand how an unfamiliar dependency or open-source project is put together, not to pull snippets of API reference. There's nothing to install and no key to manage, but it's closed source and limited to public repos unless you move to the Devin MCP.

## Highlights

- **Free and keyless** — Devin's docs call it "a free, remote, no-authentication-required service that provides access to public repositories."
- **Three tools** — `read_wiki_structure` lists a repo's documentation topics, `read_wiki_contents` returns that documentation, and `ask_question` answers any question about the repo.
- **Answers, not files** — `ask_question` returns an "AI-powered, context-grounded response," so the agent gets an explanation instead of raw source to read.
- **Streamable HTTP** — `https://mcp.deepwiki.com/mcp` is the recommended endpoint; the legacy SSE endpoint at `/sse` is being deprecated as of September 2026.
- **An upgrade path for private code** — the [Devin](/tools/devin) MCP at `mcp.devin.ai` serves public and private repos with a Devin API key, and its `ask_question` can cover up to 10 repositories at once.
- **Backed by DeepWiki** — the same wikis are browsable at deepwiki.com, which bills itself as Deep Research for GitHub, powered by Devin.

## In an AI-assisted workflow

The [Claude Code](/tools/claude-code) command comes straight from Devin's docs and adds the server at user scope over HTTP:

```bash
claude mcp add -s user -t http deepwiki https://mcp.deepwiki.com/mcp
```

Most other clients take the standard `url` field:

```json
{
  "mcpServers": {
    "deepwiki": {
      "url": "https://mcp.deepwiki.com/mcp"
    }
  }
}
```

Then point the agent at a repo by its GitHub name:

```text
Ask DeepWiki how tokio-rs/axum structures its middleware, then sketch our auth layer to match.
Read the wiki structure for the repo behind this dependency and summarize the sections on configuration.
```

It's most useful at the start of a task, before the agent reads any code, because a wiki overview tells it where to look. For what user scope means next to local and project scope, see [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

> [!TIP]
> If DeepWiki's tools never show up in a client, check the config field name first. Cognition's docs warn that Devin Desktop uses `serverUrl` while most other clients use `url`, and that the wrong field name makes the client silently ignore the server.

## How it compares

[Context7](/tools/context7) returns snippets from a library-docs index; DeepWiki works at the repository level, handing back a generated wiki or a server-side AI answer, with no key and no documented quota. [GitMCP](/tools/gitmcp) is the closest free sibling: it gives the agent a repo's own docs plus code search, where DeepWiki answers from its generated wiki. DeepWiki is also an option for read-only repo understanding when you'd rather not issue the token that the [GitHub MCP server](/tools/github-mcp-server) needs. [Serena](/tools/serena) is a different tool altogether: it works on your local working tree with symbol-level retrieval and editing, while DeepWiki works from repos hosted on GitHub.

## Good to know

DeepWiki MCP is built and run by Cognition, the makers of Devin, and Cognition's blog announced it in May 2025. It's a proprietary hosted service with no public source repo or license, so there's nothing to self-host and nothing runs locally. The live server reported version 2.14.3 in September 2026.

Rate limits and uptime commitments aren't documented, so keep a fallback before you make it part of an automated pipeline. The server's own instructions also mention private-mode tools, such as `generate_wiki` and `list_available_repos`, that aren't available on the public endpoint. Private repositories require a Devin account and API key, so check Devin's plans before you rely on that path. For more servers in the same category, see [the best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026).
