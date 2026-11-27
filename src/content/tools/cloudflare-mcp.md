---
name: "Cloudflare MCP"
title: "Cloudflare MCP"
description: "Cloudflare's official MCP servers — a Code Mode server covering 2,500 API endpoints in ~1k tokens, plus hosted product servers for docs, containers and browser."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/"
pricing: "free"
category: "mcp"
repo: "https://github.com/cloudflare/mcp-server-cloudflare"
license: "Apache-2.0"
os: ["Web"]
color: "orange"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "cloudflare", "workers", "devops", "infrastructure"]
featured: false
sameAs:
  - "https://github.com/cloudflare/mcp-server-cloudflare"
  - "https://github.com/cloudflare/mcp"
  - "https://blog.cloudflare.com/code-mode-mcp/"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:claude-code-plugins", "agent:devops-engineer", "agent:cloud-architect", "guide:deploy-remote-mcp-server"]
alternativeTo: ["github-mcp-server", "supabase-mcp", "sentry-mcp"]
summary: "Cloudflare's main MCP server, at mcp.cloudflare.com/mcp, covers the whole Cloudflare API (over 2,500 endpoints) in about 1,000 tokens: the agent writes JavaScript against the API spec and the code runs server-side. Cloudflare recommends it for most uses and keeps a few product servers (docs, containers, Browser Run); ten older ones are deprecated."
faq:
  - q: "How do I add Cloudflare's MCP server to Claude Code?"
    a: "Cloudflare's documented path is the plugin: /plugin marketplace add cloudflare/skills, then /plugin install cloudflare@cloudflare. It registers the main Cloudflare API server and installs Cloudflare's skills. To add only the server, point Claude Code at the URL with claude mcp add --transport http cloudflare https://mcp.cloudflare.com/mcp and approve the OAuth prompt, where you choose which permissions to grant."
  - q: "What is Cloudflare's Code Mode MCP server?"
    a: "A design that keeps tool definitions out of the context window. Instead of one tool per endpoint, the server gives the agent a search tool to query the OpenAPI spec and an execute tool to call the API, both by writing JavaScript that runs in an isolated Dynamic Worker sandbox. Cloudflare puts the cost at about 1,000 tokens, against roughly 244,000 for per-endpoint tools with minimal schemas and about 1.17 million with full schemas."
  - q: "What happened to the observability, Workers Bindings and Radar servers?"
    a: "They are deprecated. The mcp-server-cloudflare README lists ten servers under Deprecated servers, including AI Gateway, Audit Logs, AutoRAG, DNS Analytics, GraphQL, Logpush, Observability, Radar, Workers Bindings and Workers Builds, with a request to migrate to the Cloudflare API server. The old /sse URLs are retired too and answer with 410 Gone."
  - q: "Can I use an API token instead of OAuth?"
    a: "Yes. For CI or automation, create a Cloudflare API token with the permissions you need and send it as a bearer token in the Authorization header. User tokens and account tokens both work. Account tokens need the Account Resources: Read permission so the server can detect your account ID, and tokens with Client IP Address Filtering are not supported."
---

Cloudflare publishes official MCP servers that let an agent read and change what is in your Cloudflare account: Workers, DNS, R2, D1, Zero Trust and the rest. All of them are hosted by Cloudflare and reached over Streamable HTTP at a `/mcp` URL, so there is nothing to install or run locally.

The lineup changed during 2026. The **Cloudflare API MCP server** at `https://mcp.cloudflare.com/mcp` is now, in the docs' words, "the only MCP server you need to work with Cloudflare", and the older one-server-per-product approach has been cut back. It is a fit for developers and platform teams already on Cloudflare who want an agent to inspect or operate their account, and it is worth studying even if you are not, as a public answer to MCP tool-schema bloat.

## Highlights

- **The whole API in about 1,000 tokens.** The API server covers over 2,500 endpoints using the Code Mode pattern. The agent writes JavaScript against a typed representation of the OpenAPI spec, and the code runs in an isolated Dynamic Worker sandbox.
- **Four tools.** `search` queries `spec.paths` to find endpoints, `execute` calls `cloudflare.request()`, `docs` searches Cloudflare's developer documentation, and `whoami` returns the user or account the connection is authenticated as.
- **Capped results.** In Code Mode each `search` and `execute` result is cut at about 6,000 tokens, with cuts marked `--- TRUNCATED ---`. Pass `truncate: false` when the result goes to a file rather than into the conversation.
- **GraphQL Analytics included.** Analytics queries go through the same `execute` tool, so there is no separate analytics server to add.
- **Per-endpoint tools on request.** Appending `?codemode=false` registers a tool for each API method (about 3,000) for clients that run their own code mode. Cloudflare warns this raises the cost to roughly 244,000 tokens.
- **Product servers.** The docs list six optional ones: Documentation (`docs.mcp.cloudflare.com/mcp`), Container, Browser Run, Digital Experience Monitoring, Cloudflare One CASB and Agents SDK Documentation.
- **Open source.** Both `cloudflare/mcp` and `cloudflare/mcp-server-cloudflare` are Apache-2.0, useful as reference implementations for [remote MCP servers](/guides/mcp/deploy-remote-mcp-server).

## In an AI-assisted workflow

In Claude Code, the plugin installs the API server and Cloudflare's skills (Wrangler, Durable Objects, Agents SDK, Workers best practices and more) together:

```text
/plugin marketplace add cloudflare/skills
/plugin install cloudflare@cloudflare
```

Any other MCP client takes the URL directly:

```json
{
  "mcpServers": {
    "cloudflare-api": {
      "type": "http",
      "url": "https://mcp.cloudflare.com/mcp"
    }
  }
}
```

On first connect you are redirected to Cloudflare to authorize over OAuth and pick the permissions the agent gets. The README's own example prompts show the level to work at: "List all my Workers", "Create a KV namespace called 'my-cache'", "Add an A record for api.example.com pointing to 192.0.2.1". Behind each one the agent first searches the spec, then executes a call like this:

```javascript
execute({
  code: `async () => {
    const response = await cloudflare.request({
      method: "GET",
      path: \`/accounts/\${accountId}/workers/scripts\`
    });
    return response.result;
  }`,
  account_id: "your-account-id",
});
```

> [!WARNING]
> `execute` can call any endpoint your grant allows, including ones that delete DNS records or Workers. Grant only the permissions the task needs at the OAuth screen, and use a narrowly scoped API token for automation. If a call needs a scope the connection lacks, the server asks the client to re-authorize with that scope added.

## Good to know

Connecting is free with a Cloudflare account. The README notes that "some features may require a paid Cloudflare Workers plan", so what the agent can do tracks what your account can do.

Trade-offs to weigh:

- **Deprecations.** Ten product servers are deprecated in favor of the API server: AI Gateway, Audit Logs, AutoRAG, DNS Analytics, GraphQL, Logpush, Observability, Radar, Workers Bindings and Workers Builds. If your config still points at one of them, plan the move.
- **SSE is gone.** The retired `/sse` URLs return `410 Gone` with a message naming the `/mcp` URL.
- **Code, not typed tools.** Code Mode depends on the model writing correct JavaScript against a large spec. The remaining product servers exist for cases where you want purpose-built, typed tools for one area, such as Browser Run or containers.
- **Token rules.** Account tokens need Account Resources: Read, and tokens with Client IP Address Filtering are not supported.
- **Hosted only.** There is no local stdio option for the API server; you connect to Cloudflare's endpoint.

Cloudflare's server is not interchangeable with other vendors' servers, since each one fronts its own platform, but the design choices differ in ways that matter when you pick a stack. The [Supabase MCP server](/tools/supabase-mcp) exposes typed tools for a Postgres-centered backend, the [GitHub MCP server](/tools/github-mcp-server) does the same for repositories and pull requests, and [Sentry MCP](/tools/sentry-mcp) covers production errors. Many setups pair one of those with Cloudflare's server rather than choosing between them. For the general mechanics of adding remote servers, see [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup).
