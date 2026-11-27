---
title: "Claude Code vs Gemini CLI: Which Terminal Agent (2026)"
description: "Claude Code vs Gemini CLI vs Antigravity CLI: who can still use each one, install commands, MCP config, models and the free tier, checked in November 2026."
author: "Imtiaz Rayhan"
date: 2026-06-17
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
tags: ["comparison", "versus", "claude-code", "gemini-cli", "antigravity-cli", "cli-agents"]
featured: false
seoTitle: "Claude Code vs Gemini CLI vs Antigravity CLI (2026)"
summary: "For individuals the real choice is now Claude Code or Antigravity CLI. Gemini CLI stopped serving free and Google AI Pro/Ultra accounts on June 18, 2026 and is maintained for Gemini Code Assist enterprise licences. Claude Code needs a paid plan; Antigravity CLI has a free tier but is closed source."
keyTakeaways:
  - "Gemini CLI is still open source (Apache-2.0, TypeScript) and still shipping releases, but Google's README now scopes it to Gemini Code Assist Standard/Enterprise licences plus legacy paid API and Vertex keys."
  - "Antigravity CLI (`agy`) is where Google sends free, Google AI Pro and Ultra users. It has a free plan with a weekly quota, no bring-your-own-key option, and no published source code."
  - "Claude Code has no free tier: it needs a Pro, Max, Ultra, Team, Enterprise or Console account, or a cloud provider such as Bedrock. Aliases resolve to Opus 5.5, Sonnet 5.5 and Haiku 5.5 on the Anthropic API."
  - "All three speak MCP, but the config lives in different files: `.mcp.json` for Claude Code, `settings.json` for Gemini CLI, `mcp_config.json` for Antigravity CLI."
  - "Google says Gemini CLI is not tuned for the Gemini 4 series, so the newest Google models are an Antigravity feature, not a Gemini CLI one."
faq:
  - q: "Is Gemini CLI being shut down in 2026?"
    a: "Not shut down, but narrowed. Google announced the change on May 19, 2026, and on June 18, 2026 Gemini CLI stopped serving free users and Google AI Pro and Ultra subscribers. The repository is still active under Apache-2.0, and the README describes the tool as maintained for Gemini Code Assist Standard and Enterprise licences, with legacy paid API and Vertex keys still accepted."
  - q: "Is Antigravity CLI open source like Gemini CLI?"
    a: "No. The public google-antigravity/antigravity-cli repository holds a README, a changelog and examples, with no licence file and no source tree, and GitHub reports no licence for it. Gemini CLI remains Apache-2.0. If forking or auditing the agent matters to you, that is the main thing you lose in the move."
  - q: "Can I use Claude models inside Antigravity CLI?"
    a: "On some plans. Antigravity's pricing page lists Claude Sonnet 5.5 and Claude Opus 5.5 for paid Google AI Pro and Ultra subscribers and for Google Cloud customers whose administrator opts in. You get the model without Claude Code's harness: no CLAUDE.md, no Claude Code hooks or subagents."
  - q: "Do my Gemini CLI extensions and GEMINI.md files carry over to Antigravity CLI?"
    a: "Mostly. Antigravity CLI reads GEMINI.md and AGENTS.md unchanged, and `agy plugin import gemini` converts extensions into plugins, turning legacy commands into skills. Workspace skills move from `.gemini/skills/` to `.agents/skills/`, and MCP servers move out of `settings.json` into `mcp_config.json`, where remote servers use the `serverUrl` key."
related: ["tool:claude-code", "tool:gemini-cli", "guide:claude-code-vs-codex-cli", "guide:claude-code-vs-opencode", "guide:ai-coding-agents-cli-2026", "guide:claude-code-mcp-setup", "tool:antigravity"]
audience: ["developers"]
sources:
  - title: "An important update: Transitioning Gemini CLI to Antigravity CLI"
    url: "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/"
    publisher: "Google"
  - title: "Gemini CLI README"
    url: "https://github.com/google-gemini/gemini-cli"
    publisher: "Google"
  - title: "Google Antigravity pricing"
    url: "https://antigravity.google/pricing"
    publisher: "Google"
  - title: "Migrating from Gemini CLI"
    url: "https://antigravity.google/docs/cli/gcli-migration"
    publisher: "Google"
  - title: "Antigravity CLI README"
    url: "https://github.com/google-antigravity/antigravity-cli"
    publisher: "Google"
  - title: "Claude Code setup"
    url: "https://code.claude.com/docs/en/setup"
    publisher: "Anthropic"
  - title: "Claude Code model configuration"
    url: "https://code.claude.com/docs/en/model-config"
    publisher: "Anthropic"
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    publisher: "Anthropic"
---

"Claude Code vs Gemini CLI" used to be a two-way choice. Since June 18, 2026 it is a three-way one, because Google moved every individual user of [Gemini CLI](/tools/gemini-cli) to a different product, [Antigravity](/tools/antigravity) CLI, and kept Gemini CLI for enterprise licences. Which comparison applies to you depends on how you would sign in.

## The short answer

- **You pay for a Claude plan, or want the agent your team standardizes on**: [Claude Code](/tools/claude-code).
- **You want Google's models on a personal account, including a free tier**: Antigravity CLI. Gemini CLI will not serve you.
- **Your company holds Gemini Code Assist Standard or Enterprise licences**: Gemini CLI still works unchanged, and it is the only one of the three you can fork.
- **You need to bring your own key to a Google terminal agent**: Gemini CLI accepts a paid Gemini API key or Vertex key. Antigravity's plans page says bring-your-own-key is not supported.

## Who can use what

| Sign-in | Claude Code | Gemini CLI | Antigravity CLI |
| --- | --- | --- | --- |
| Free personal account | No | No (ended June 18, 2026) | Yes, weekly quota |
| Consumer subscription | Pro, Max, Ultra | No (Google AI Pro/Ultra moved to Antigravity) | Google AI Pro, Ultra |
| Pay-per-token API key | Console account | Paid Gemini API key, Vertex | Not supported |
| Team or enterprise | Team, Enterprise, Bedrock, Google Cloud, Foundry | Gemini Code Assist Standard/Enterprise | Gemini Enterprise via Google Cloud |

Anthropic's setup page is blunt about the first row: "The free claude.ai plan does not include Claude Code access." Google's own README for Gemini CLI now opens with a status box that says "No free tier or Google AI plans."

## The three tools as they stand

**Claude Code** is Anthropic's terminal agent, also available in VS Code, JetBrains, a desktop app and the browser. It is proprietary: the public GitHub repository carries an "All rights reserved" notice, not an open-source licence. On the Anthropic API the `opus`, `sonnet` and `haiku` aliases resolve to Opus 5.5, Sonnet 5.5 and Haiku 5.5, and `/model fable` selects Fable 5.2 for long autonomous tasks. Sonnet 5.5 has a native 1M-token [context window](/glossary/context-window). The extension surface is the widest of the three: `CLAUDE.md` memory, [MCP servers](/guides/mcp/claude-code-mcp-setup), [subagents](/glossary/subagent), hooks, skills and plugins.

**Gemini CLI** is Apache-2.0 TypeScript with about 109,000 GitHub stars as of November 2026, and it is not abandoned: v0.71.1 shipped on November 24, 2026. What changed is its audience. The README calls it "an open-source terminal agent maintained for enterprise Gemini Code Assist workflows on Google Cloud" and warns that it is "not tuned for the Gemini 4 series." It keeps `GEMINI.md` context files, [MCP](/glossary/model-context-protocol), checkpointing and an extension gallery.

**Antigravity CLI** (`agy`) is the terminal front end to Google's Antigravity agent platform and shares its agent engine and settings with the Antigravity desktop app. Google's announcement says it is built in Go and admits there "won't be 1:1 feature parity right out of the gate," while keeping Agent Skills, hooks, subagents and extensions (renamed plugins). The free plan includes Gemini 4 Hydrogen with a quota refreshed weekly; paid Google AI Pro and Ultra plans get quotas refreshed every five hours plus Gemini 4 Neon, Carbon and Argon. By default Google collects interaction data from the CLI to improve the product, with an opt-out in settings.

## Install and first run

```bash
# Claude Code (macOS, Linux, WSL)
curl -fsSL https://claude.ai/install.sh | bash
claude

# Gemini CLI (Node.js), with a paid API key
npm install -g @google/gemini-cli
export GEMINI_API_KEY="YOUR_API_KEY"
gemini

# Antigravity CLI (macOS, Linux)
curl -fsSL https://antigravity.google/cli/install.sh | bash
agy
```

All three have a one-shot mode for scripts: `claude -p "..."` and `agy -p "..."` each print a response and exit, and the Gemini CLI README lists non-interactive runs for workflow automation.

## The same MCP server in each

Adding one stdio MCP server shows how the config models differ.

Claude Code, in a project-level `.mcp.json` (or with `claude mcp add`):

```json
{
  "mcpServers": {
    "example": {
      "command": "npx",
      "args": ["-y", "@example/mcp-server"]
    }
  }
}
```

Gemini CLI nests the same block inside `~/.gemini/settings.json` and adds per-server options such as `timeout` and `trust`:

```json
{
  "mcpServers": {
    "example": {
      "command": "npx",
      "args": ["-y", "@example/mcp-server"],
      "timeout": 30000,
      "trust": false
    }
  }
}
```

Antigravity CLI moves servers into their own file, `~/.gemini/config/mcp_config.json` globally or `.agents/mcp_config.json` per workspace. Remote servers use `serverUrl` where Gemini CLI used `url` or `httpUrl`:

```json
{
  "mcpServers": {
    "remote-example": {
      "serverUrl": "https://mcp.example.com/sse"
    }
  }
}
```

Remote servers in Claude Code are one command: `claude mcp add --transport http notion https://mcp.notion.com/mcp`.

## Dimension by dimension

| | Claude Code | Gemini CLI | Antigravity CLI |
| --- | --- | --- | --- |
| Maker | Anthropic | Google | Google |
| Licence | Proprietary | Apache-2.0 | Proprietary, no source published |
| Built in | Native binary (npm package optional) | TypeScript on Node.js | Go |
| Models | Claude only: Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.2 | Gemini via API key, Vertex or Code Assist; not tuned for Gemini 4 | Gemini 4 family; Claude Sonnet 5.5 and Opus 5.5 on paid plans |
| Free tier | None | None | Yes, weekly quota |
| Bring your own key | Console key, Bedrock, Google Cloud, Foundry | Yes | No |
| Project instructions | `CLAUDE.md` | `GEMINI.md` | `GEMINI.md` and `AGENTS.md` |
| Packaged extensions | Plugins, skills | Extensions (`gemini extensions install <repo-url>`) | Plugins (`agy plugin import gemini` converts extensions) |
| Workspace skills path | `.claude/skills/` | `.gemini/skills/` | `.agents/skills/` |
| MCP config | `.mcp.json`, `claude mcp add` | `settings.json` | `mcp_config.json` |

## Where each one loses

**Claude Code** costs money from the first prompt and runs only Claude models. If you want to switch providers per task, look at [OpenCode](/guides/comparisons/claude-code-vs-opencode) instead.

**Gemini CLI** is a narrowing target. Google points individuals elsewhere, says the harness is not tuned for its newest model generation, and tells people not to benchmark Gemini models with it. Choosing it today is a decision to stay on an enterprise licence or a paid key, in exchange for an Apache-2.0 codebase you can read and fork.

**Antigravity CLI** is closed and tied to your Google account's quota. There is no bring-your-own-key path for extra capacity, the migration guide still routes some configuration through `~/.gemini/` paths, and Google itself says parity with Gemini CLI is incomplete. Free and Google AI Plus accounts get Gemini 4 Hydrogen, not Neon or Carbon.

## How to choose

Start from the account you already have. A Claude subscription or Console key makes Claude Code the obvious pick, and its hooks, permission rules and subagents are what you want when a team has to encode policy rather than rely on prompts. A personal Google account with no budget points to Antigravity CLI, the only one of the three with a free agent loop. A Google Cloud organization with Code Assist licences can stay on Gemini CLI and keep an open-source agent, or trial Antigravity through a Cloud project.

If you are migrating off Gemini CLI as an individual, run `agy` once in a directory that has your old configuration: first launch offers to convert extensions and settings, and your `GEMINI.md` files keep working as they are. Budget an hour to move MCP servers and re-test any custom commands, which become skills.

For the wider field, including agents that are not tied to one model vendor, see [the CLI agents roundup](/guides/prompting/ai-coding-agents-cli-2026). If your alternative is OpenAI's terminal agent, read [Claude Code vs Codex CLI](/guides/comparisons/claude-code-vs-codex-cli).
