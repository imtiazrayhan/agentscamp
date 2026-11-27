---
name: "Figma MCP"
title: "Figma MCP"
description: "Figma's official MCP server — structured design context, variables, screenshots, and Code Connect mappings for agents, plus write-back to the canvas."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://developers.figma.com/docs/figma-mcp-server/"
pricing: "freemium"
category: "mcp"
os: ["Web", "macOS", "Windows"]
color: "pink"
topics: ["mcp"]
tags: ["mcp", "figma", "design", "design-to-code", "frontend"]
featured: false
sameAs:
  - "https://www.figma.com/blog/introducing-figma-mcp-server/"
  - "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server"
  - "https://github.com/figma/mcp-server-guide"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:claude-code-plugins", "agent:frontend-developer", "agent:react-specialist", "command:new-component"]
alternativeTo: ["lovable", "bolt"]
summary: "Figma's official MCP server gives agents the structure of a design rather than a picture of it: layout, components, variables and Code Connect mappings to your real components. The hosted remote server at mcp.figma.com/mcp also writes back to the canvas. Read calls are rate-limited by plan and seat, from 20 a month on Starter to 600 a day on Enterprise."
faq:
  - q: "What does the Figma MCP server give a coding agent?"
    a: "Structured design data instead of pixels. get_design_context returns design context and code for a layer or selection, get_variable_defs lists the variables and styles it uses, get_screenshot adds the visual, get_metadata gives a lightweight XML outline, and the Code Connect tools map Figma components to components in your codebase so generated UI reuses them. On the remote server, use_figma and generate_figma_design write content back to Figma."
  - q: "How do I connect Figma to Claude Code?"
    a: "Figma recommends its plugin, which bundles the server settings and Figma's skills: claude plugin install figma@claude-plugins-official, then restart Claude Code and sign in from the /plugin manager. To add only the server, run claude mcp add --transport http figma https://mcp.figma.com/mcp, start a new session, type /mcp, select figma and choose Authenticate."
  - q: "Is the Figma MCP server free?"
    a: "It works on every plan, with limits. Figma's rate-limit table allows up to 20 read tool calls a month on the Starter plan and on View or Collab seats, up to 200 a day for Full or Dev seats on Professional and Organization, and up to 600 a day on Enterprise. Write to canvas is free during its beta period as of November 2026, and Figma says it will eventually become a usage-based paid feature."
  - q: "Remote server or desktop server?"
    a: "Use the remote server unless you have a specific reason not to. Figma calls it the recommended option with the broadest feature set, and write to canvas, comments and library search are remote-only. The desktop server runs through the Figma desktop app at http://127.0.0.1:3845/mcp, needs a Dev or Full seat on a paid plan, and can work from your current selection. Figma for Government supports the desktop server only."
audience: ["designers"]
---

Design-to-code used to mean screenshotting a frame and hoping. Figma's official MCP server replaces the screenshot with the design's structure: an agent reads the layout, components, variants and variables directly, checks which Figma components already map to code, and builds against your design system. On the remote server it can also go the other way and write native Figma content back to the canvas.

It is made by Figma and aimed at product teams that already design in Figma and code with an agent such as [Claude Code](/tools/claude-code), Cursor or VS Code. Only clients listed in Figma's MCP catalog can connect.

## Highlights

- **`get_design_context`.** The main read tool. It returns design context and code for a layer or selection in Figma Design or Figma Make files.
- **`get_variable_defs`.** Lists the variables and styles a selection uses, so colors, spacing and type come out as your tokens instead of hard-coded values.
- **`get_metadata`.** A lightweight XML outline (layer IDs, names, types, positions, sizes) for very large designs, so the agent can request full context only for the parts it needs.
- **Code Connect tools.** `get_code_connect_map`, `add_code_connect_map` and `search_design_system` link Figma components to real code components, so the agent reuses your `Button` instead of inventing markup.
- **Write to canvas (remote only).** `use_figma` creates, edits and inspects content in Figma Design, FigJam and Figma Slides. `generate_figma_design` turns live web UI into design layers, `html_to_figma` converts an HTML document, and `generate_diagram` builds a FigJam diagram from a description or Mermaid syntax.
- **Comments and assets (remote only).** `get_comments` reads feedback threads, and `download_assets` pulls exports and source images.
- **Two servers.** The hosted remote server at `https://mcp.figma.com/mcp`, and a desktop server at `http://127.0.0.1:3845/mcp` that you enable from Dev Mode in the Figma desktop app.
- **Skills.** Figma publishes skills that tell the agent which tools to use in which order. Figma says to install them if you plan to write to the canvas.

## In an AI-assisted workflow

Install the plugin, or add the remote server by hand:

```bash
# recommended: plugin with the MCP server settings and Figma's skills
claude plugin install figma@claude-plugins-official

# or the server only (add --scope user to use it in every project)
claude mcp add --transport http figma https://mcp.figma.com/mcp
# then in a new session: /mcp, select figma, Authenticate
```

Reading a design is link-based. In Figma, right-click a frame or layer, choose **Copy link to selection**, and paste it into your prompt. The client does not open the link; it extracts the node ID the server needs.

```text
Implement this frame as a React component using our existing design
system components: <Figma link to selection>
```

Writing works from a prompt too. Figma's own examples include "Capture the UI of my app homepage as frames in <Figma file URL>" and "Create a flowchart for the user authentication flow using the Figma MCP generate_diagram tool."

> [!TIP]
> Large selections return too much. Have the agent call `get_metadata` first for an outline, then `get_design_context` on the specific nodes you are implementing. The server also provides one MCP prompt, `create_design_system_rules`, which writes a rules file describing your codebase and design system for the agent to follow.

## Pricing

There is no separate charge for the MCP server as of November 2026; access depends on your Figma plan and seat, and read tools are rate-limited. Figma's table gives View and Collab seats on any plan, and the Starter plan, up to 20 tool calls per month. Full and Dev seats get up to 200 per day on Professional (10 per minute) and Organization (15 per minute), and up to 600 per day on Enterprise (20 per minute). Tools that write to Figma files, such as `generate_figma_design` and `create_new_file`, are exempt from those limits.

Some tools spend Figma AI credits instead: `generate_image`, `generate_vector_illustration` and `send_prompt`. Write to canvas is "free during the beta period and will eventually become a usage-based paid feature", in Figma's words, and it was still in that beta as of November 2026. Figma also notes it "may change rate limits at any time."

## Good to know

- **Hosted and closed.** The server is run by Figma. The `figma/mcp-server-guide` GitHub repository is a usage guide and plugin source, not the server implementation.
- **Client allowlist.** Clients not in Figma's MCP catalog cannot connect; developers of new clients join a waitlist.
- **Seat gating on writes.** Writing outside your drafts needs a Full seat, and the desktop server needs a Dev or Full seat on a paid plan.
- **Twenty calls a month is a trial.** On Starter or a View seat, a single component build can use several read calls, so plan on a Dev or Full seat for regular use.
- **`use_figma` cannot add new images.** It works with images already in the file; new ones go through `upload_assets`.
- **File access still applies.** The agent can only reach files your account can open. `whoami` shows the signed-in email, plans and seats when a permission error is confusing.

The main community alternative is **Framelink** (`figma-developer-mcp`, MIT-licensed), a local server that reads designs through a Figma personal access token and simplifies the API response before handing it to the model. It only reads designs and needs a Figma access token, but it has no client allowlist. If you would rather skip the design file, [Figma Make](/tools/figma-make) and [v0](/tools/v0) generate working UI from a prompt, and [Lovable](/tools/lovable) builds whole apps that way.

For a setup walkthrough, follow [Figma to Code with Claude Code and the Figma MCP Server](/guides/design/figma-to-code-with-claude) and [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup), or see [The Best MCP Servers in 2026](/guides/mcp/best-mcp-servers-2026).
