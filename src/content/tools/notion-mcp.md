---
name: "Notion MCP"
title: "Notion MCP"
description: "Notion's hosted MCP server — search the workspace, fetch and create pages and databases, and manage comments through Markdown-optimized agent tools."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://developers.notion.com/docs/mcp"
pricing: "freemium"
category: "mcp"
os: ["Web"]
color: "yellow"
topics: ["mcp"]
tags: ["mcp", "notion", "docs", "knowledge-base", "workspace"]
featured: false
sameAs:
  - "https://developers.notion.com/docs/get-started-with-mcp"
  - "https://www.notion.com/blog/notions-hosted-mcp-server-an-inside-look"
  - "https://github.com/makenotion/notion-mcp-server"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "skill:adr-writer", "skill:readme-generator", "tool:linear-mcp", "guide:govern-mcp-servers"]
alternativeTo: ["linear-mcp", "slack-mcp", "context7", "github-mcp-server"]
summary: "Notion MCP is Notion's hosted server at mcp.notion.com/mcp. An agent can search the workspace, read and edit pages in Markdown, manage databases, comments, files and calendars, and use Notion Skills. It works on every plan through OAuth; MCP tokens, connected-source search and unlimited SQL queries need Business or Enterprise."
faq:
  - q: "How do I connect Notion to Claude Code?"
    a: "Run claude mcp add --transport http notion https://mcp.notion.com/mcp, then run /mcp in Claude Code and follow the OAuth flow. Add --scope user to make it available in every project or --scope project to share it through .mcp.json. Notion also publishes a Claude Code plugin (makenotion/claude-code-notion-plugin) that adds the server, Skills and slash commands."
  - q: "Can I use Notion MCP without a browser sign-in?"
    a: "Yes, on Business and Enterprise plans. A workspace owner creates an MCP token with New MCP token in the Developer portal, and the client sends it as a bearer token to https://mcp.notion.com/mcp. Enterprise workspaces that use SAML SSO can also use enterprise-managed authorization, where the identity provider grants access without a consent screen."
  - q: "Is Notion MCP free?"
    a: "Notion's docs say it works on every plan. Plan-dependent parts are MCP tokens (Business and Enterprise), notion-connector-search over connected apps (Business or Enterprise with Notion AI), unlimited SQL in notion-query-data-sources (Business or Enterprise with Notion AI; other plans get a limited allowance), some search filters, and request limits, which are higher on Business and Enterprise."
  - q: "What happened to the open-source Notion MCP server?"
    a: "It still exists at makenotion/notion-mcp-server under the MIT license, but its README says it is no longer actively maintained or supported and that Notion may sunset the repository. It authenticates with an integration token and you run it yourself. Notion recommends the hosted server for most users."
audience: ["sales", "founders", "marketers"]
---

Notion MCP lets an agent read and write your team's Notion workspace: specs, runbooks, decision docs, meeting notes, task databases. The agent searches for the page it needs mid-task, reads it as Markdown, and files its own output back where the team will find it.

Notion builds and hosts the server at `https://mcp.notion.com/mcp`. It grew a lot during 2026. The tool list in Notion's docs now runs to about 70 entries as of November 2026, covering search, pages, databases, comments and suggested edits, files, calendars, Skills, Custom Agents and personal memories. It suits any team whose written context lives in Notion, technical or not.

## Highlights

- **Search and fetch.** `notion-search` searches Notion on every plan, and `notion-fetch` opens a page, database or connected-source result by URL.
- **Pages in Markdown.** `notion-create-pages`, `notion-update-page`, `notion-move-pages` and `notion-duplicate-page` read and write pages as Markdown, which Notion says returns results in far fewer tokens than its older API-derived tools.
- **Databases.** `notion-create-database`, `notion-create-view` and `notion-query-data-sources`, which reads a saved view or runs SQL. `notion-query-multiple-data-sources` combines several, on Business or Enterprise with Notion AI.
- **Review-friendly edits.** `notion-create-suggested-edit` proposes a change that does nothing until someone accepts it, and `notion-get-version-changes` shows whether an edit came from a person, AI or an MCP client. `notion-restore-version` rolls a page back.
- **Connected sources.** `notion-connector-search` finds content in connected apps such as Slack and Google Drive. To update Jira itself, add the [Atlassian MCP Server](/tools/atlassian-mcp).
- **Files.** `notion-create-file-upload` uploads images and other files up to 20 MiB.
- **Skills, agents and memory.** Save reusable instructions as Notion Skills, hand work to Custom Agents, and store preferences with personal memories that another client on the same account can recall.
- **`notion-get-tool-access`.** Reports which tools and parameters your plan allows, so the agent can check before it calls.

## In an AI-assisted workflow

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
# then, in Claude Code: /mcp and follow the OAuth flow
```

After that, `/context` in Claude Code shows how many tokens the Notion server's tools take up in your session. A typical prompt uses docs as input and writes a decision back:

```text
Find our API versioning policy in Notion and apply it to this new
endpoint. When done, add a decision note to the "API decisions" page
as a suggested edit so I can review it.
```

The agent grounds its work in what the team has written down, then leaves a durable record instead of a chat transcript. When another teammate takes over, the [AI project-handoff workflow](/guides/workflow/ai-project-handoff) helps preserve the source files, decisions and unresolved work. For company knowledge spread across many systems, [Glean](/tools/glean) is an enterprise search option to evaluate.

> [!TIP]
> The agent acts with your permissions. Keep retrieval tools friction-free and put `ask` [permission rules](/guides/configuration/claude-code-settings-permissions) on write tools such as `mcp__notion__notion-update-page` and `mcp__notion__notion-delete-pages` while you build trust. Asking for suggested edits rather than direct edits is another safe default, though working with suggested edits requires a Business or Enterprise plan.

## Good to know

- **Plans.** Notion MCP "works on every plan", but only workspace members can connect; guests are refused. MCP tokens, connected-source search, unlimited SQL queries, several search filters and `notion-query-meeting-notes` depend on Business or Enterprise, in most cases with Notion AI. On a lower plan, unavailable search filters are dropped and the result says so.
- **Rate limits.** Every tool call counts toward Notion's standard API request limits. The server retries once if the wait is 2 seconds or less and otherwise returns a `rate_limited` tool error with `retry_after_seconds`. Ask the agent to reduce parallel calls.
- **Tool count.** Dozens of tool schemas take context. Check `/context`, and disable tools you do not use if your client supports it.
- **Admin controls.** On Enterprise, workspace owners can approve which AI apps may connect through Notion MCP and block the rest. Notion states that MCP does not bypass Notion permissions.
- **OpenAI clients differ.** In ChatGPT and other OpenAI clients, `notion-search` and `notion-fetch` appear as `search` and `fetch`.
- **Sensitive content.** Whatever the agent fetches goes to the AI app you connected, so treat workspace content like any other context you send to a model. The [governance guide](/guides/mcp/govern-mcp-servers) covers the habits that apply.

The self-hosted alternative is Notion's own open-source `makenotion/notion-mcp-server` (MIT), which uses an integration token, but its README says it is no longer actively maintained and may be sunset. Among neighbouring servers, [Linear MCP](/tools/linear-mcp) is the better fit when work is tracked as issues rather than documents, the [Atlassian MCP Server](/tools/atlassian-mcp) covers Confluence and Jira, and [Context7](/tools/context7) serves public library documentation rather than your own workspace.
