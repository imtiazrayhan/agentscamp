---
name: "Figma MCP"
title: "Figma MCP"
description: "Figma's official MCP server — structured design context, variables, screenshots, and Code Connect mappings for agents, plus write-back to the canvas."
date: 2026-06-11
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
summary: "Figma's official MCP server hands agents what a screenshot can't: the structured truth of a design — component hierarchy, auto-layout, variants, design tokens via get_variable_defs, and Code Connect mappings to your real components. The hosted remote (mcp.figma.com) works on all plans and can even write designs back to the canvas; a desktop variant serves your live selection."
faq:
  - q: "What does the Figma MCP server give a coding agent?"
    a: "Structured design data instead of pixels: get_design_context returns a framework-aware representation of the selected frame (layout, components, variants), get_variable_defs returns the design tokens, get_screenshot adds the visual, and Code Connect tools map Figma components to your actual code components — so generated UI uses your design system, not lookalike markup."
  - q: "How do I connect Figma to Claude Code?"
    a: "The preferred path is the official plugin: claude plugin install figma@claude-plugins-official (it bundles the MCP server plus skills). Manual: claude mcp add --transport http figma https://mcp.figma.com/mcp, then authenticate via /mcp. For your live selection in the desktop app, enable the MCP server in Dev Mode and add http://127.0.0.1:3845/mcp."
  - q: "Is the Figma MCP server free?"
    a: "It's free during the beta period, with Figma signaling it will eventually become a usage-based paid feature. The remote server works on all seats and plans; the desktop (Dev Mode) server requires a Dev or Full seat on a paid plan."
---

Design-to-code used to mean screenshotting a frame and hoping. Figma's official MCP server replaces that with the design's **structured truth**: agents read the component hierarchy, auto-layout rules, variants, and design tokens directly — and on the remote server, can even write designs back to the canvas.

## Highlights

- **`get_design_context`** — a framework-aware structured representation of a frame or selection; the core tool that turns "make this" into faithful code.
- **Design tokens via `get_variable_defs`** — colors, spacing, and typography come out as the variables your design system defines, not hard-coded hexes.
- **Code Connect mapping** — tools that link Figma components to your real code components, so the agent reuses `<Button variant="primary">` instead of inventing markup.
- **Write-back (remote)** — `use_figma` and `generate_figma_design` create and edit designs on the canvas, including turning live UI into editable layers.
- **Two servers** — hosted remote (`mcp.figma.com/mcp`, OAuth, all plans) and a desktop server (`127.0.0.1:3845/mcp`) that serves whatever you've selected in the open file.

## In an AI-assisted workflow

```bash
# preferred: the official plugin (MCP server + agent skills)
claude plugin install figma@claude-plugins-official

# or manual remote:
claude mcp add --transport http figma https://mcp.figma.com/mcp
# then in a session: /mcp → figma → Authenticate
```

Paste a Figma frame URL (or select a frame in the desktop app) and ask for the component: the agent pulls structure and tokens, checks Code Connect for existing components, and builds against your system.

> [!TIP]
> Large selections blow up context. Figma's own guidance: call `get_metadata` first for a sparse node map, then request `get_design_context` for the specific nodes you're implementing.

## Good to know

The server is hosted and closed-source (the GitHub presence is a usage guide, not the implementation), free during beta with usage-based pricing signposted, and only clients in Figma's MCP Catalog may connect — Claude Code is among them. The popular community alternative, **Framelink** (`figma-developer-mcp`, MIT), reads designs via a Figma REST token with no seat requirements — read-only, but a fine fallback if the official server's plan gating bites.
