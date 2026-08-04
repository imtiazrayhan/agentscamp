---
name: "Cloudflare MCP"
title: "Cloudflare MCP"
description: "Cloudflare's official MCP servers — a Code Mode server covering 2,500 API endpoints in ~1k tokens, plus hosted servers for docs, Workers, and observability."
date: 2026-06-11
url: "https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/"
pricing: "free"
category: "mcp"
repo: "https://github.com/cloudflare/mcp-server-cloudflare"
license: "Apache-2.0"
os: ["Web"]
color: "orange"
topics: ["mcp"]
tags: ["mcp", "cloudflare", "workers", "devops", "infrastructure"]
featured: false
sameAs:
  - "https://github.com/cloudflare/mcp-server-cloudflare"
  - "https://github.com/cloudflare/mcp"
  - "https://blog.cloudflare.com/code-mode-mcp/"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:claude-code-plugins", "agent:devops-engineer", "agent:cloud-architect", "guide:deploy-remote-mcp-server"]
alternativeTo: ["github-mcp-server", "supabase-mcp", "sentry-mcp", "stripe-mcp"]
summary: "Cloudflare ships two kinds of official MCP servers, all hosted: 16 domain servers (docs, Workers bindings and builds, observability, browser rendering, Radar, and more at <name>.mcp.cloudflare.com/mcp) and the newer Code Mode server at mcp.cloudflare.com/mcp, which exposes the entire 2,500-endpoint Cloudflare API in about 1k tokens by letting the agent write code against the API spec server-side."
faq:
  - q: "How do I add Cloudflare's MCP servers to Claude Code?"
    a: "The official path is the plugin: /plugin marketplace add cloudflare/skills then /plugin install cloudflare@cloudflare — it registers the Code Mode API server plus Cloudflare skills. Individual hosted servers also add directly, e.g. claude mcp add --transport http cf-docs https://docs.mcp.cloudflare.com/mcp, with OAuth on connect."
  - q: "What is Cloudflare's Code Mode MCP server?"
    a: "A token-efficiency design: instead of loading thousands of per-endpoint tool schemas (~244k tokens), the server exposes the full 2,500-endpoint Cloudflare API in roughly 1k tokens by having the agent write code against the API spec, executed server-side. Append ?codemode=false if you want classic per-endpoint tools instead."
  - q: "Which Cloudflare MCP server should I start with?"
    a: "The docs server (docs.mcp.cloudflare.com/mcp) for grounded Cloudflare answers, observability for debugging Workers, and the Code Mode server when an agent needs broad API coverage — domain servers give typed, guided tools; Code Mode gives breadth."
---

Cloudflare's MCP lineup is the most architecturally interesting of the official vendor servers — two complementary designs. The **domain servers** (16 of them, each hosted at `<name>.mcp.cloudflare.com/mcp`) give typed, guided tools for one area: docs, Workers bindings and builds, observability, browser rendering, Logpush, AI Gateway, Radar, and more. The **Code Mode server** flips the model: the entire 2,500-endpoint Cloudflare API in ~1k tokens of context, because the agent writes code against the API spec — executed server-side — instead of loading a tool schema per endpoint.

## Highlights

- **Code Mode breadth** — `mcp.cloudflare.com/mcp` covers the whole API at a fraction of the context cost; `?codemode=false` restores per-endpoint tools when you want them.
- **Domain servers for depth** — Documentation, Workers Bindings, Workers Builds, Observability, Browser Rendering, AI Gateway, Audit Logs, DNS Analytics, Radar, AutoRAG, and more.
- **All hosted, OAuth on connect** — or a Cloudflare API token as a Bearer header for automation.
- **First-class Claude Code packaging** — the `cloudflare/skills` marketplace installs the server *and* skills in one `/plugin install`.
- **Open source** — both repos are Apache-2.0, useful as reference implementations for [remote MCP servers](/guides/mcp/deploy-remote-mcp-server) generally.

## In an AI-assisted workflow

```bash
/plugin marketplace add cloudflare/skills
/plugin install cloudflare@cloudflare
# then:
# > Why are p99s spiking on the api-gateway Worker since yesterday's deploy?
# > Check observability and the build history.
```

The debugging loop is the killer app: observability data, build logs, and current docs in one place, so the agent diagnoses against telemetry instead of theory.

> [!TIP]
> Mind the context budget with domain servers — the observability server in particular can chain many tool calls on a broad question (Cloudflare's own troubleshooting note). Scope questions tightly, or lean on Code Mode, which was built to keep context small.

## Good to know

Connecting is free with a Cloudflare account; some underlying features need a paid Workers plan. SSE endpoints are deprecated in favor of `/mcp` Streamable HTTP. API tokens used for headless auth need at least "Account Resources: Read", and tokens with IP-address filtering aren't supported. The Code Mode design is worth studying even if you don't use Cloudflare — it's the strongest public answer yet to MCP tool-schema bloat.
