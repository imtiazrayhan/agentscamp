---
title: "Figma to Code with Claude Code and the Figma MCP Server"
description: "Connect Figma's MCP server to Claude Code and turn a selected frame into a component that uses your real design tokens and your existing components."
seoTitle: "Figma to Code with Claude Code and the Figma MCP Server"
seoDescription: "Wire Figma's MCP server into Claude Code, then turn one selected frame into on-system code: get_design_context, get_variable_defs, tokens, and a review pass."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "multimodal-ai", "mcp"]
audience: ["designers"]
tags: ["figma", "mcp", "design-to-code", "claude-code", "design-tokens", "frontend"]
featured: true
keywords: ["Figma to code Claude Code", "Figma MCP server Claude", "design to code AI", "get_design_context", "Figma design tokens"]
summary: "Figma's MCP server hands Claude Code the design's structure instead of pixels: get_metadata to find the node, get_design_context to read it, get_variable_defs for the variables, and Code Connect to map Figma components to yours. Add the remote server with one claude mcp add command, then aim it at one frame at a time."
keyTakeaways:
  - "Two servers: the remote one at mcp.figma.com/mcp works on all seats and plans; the desktop one at 127.0.0.1:3845 needs a Dev or Full seat on a paid plan."
  - "One command connects it: claude mcp add --transport http figma https://mcp.figma.com/mcp, then /mcp inside a session to authenticate."
  - "Call get_metadata first for a sparse node map, then get_design_context on just the node you are building. Whole-page selections waste context and lower quality."
  - "Your CLAUDE.md is what makes the output on-system: framework, component folder, token file, and a rule that raw hex and px values are not allowed."
  - "get_variable_defs returns the variables behind the frame, so tokens come from Figma rather than being reverse-engineered from a screenshot."
  - "Figma reads structure, not intent. Hover, focus, empty and error states, and breakpoints still have to be stated in the prompt."
howtoSteps:
  - name: "Pick the server and check your seat"
    text: "Use the remote server at https://mcp.figma.com/mcp unless you have a reason not to; Figma recommends it and it works on all seats and plans. The desktop server runs inside the Figma desktop app at http://127.0.0.1:3845/mcp, serves whatever you have selected, and requires a Dev or Full seat on a paid plan. To enable it, open a Design file in the desktop app, press Shift+D for Dev Mode, and click Enable desktop MCP server in the MCP server section of the inspect panel."
  - name: "Connect it to Claude Code"
    text: "Run claude mcp add --transport http figma https://mcp.figma.com/mcp in your project, or add --scope user to make it available in every project. Start a session, type /mcp, select figma, and choose Authenticate to complete the OAuth flow in the browser. For the desktop server the command is claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp."
  - name: "Write your conventions into CLAUDE.md"
    text: "Add a UI conventions section to the project's CLAUDE.md: the framework and styling approach, the folder where components live, the token file, the rule that components reuse existing primitives before creating new ones, and the rule that no raw hex or pixel value may appear in a component. This file is loaded at the start of every session and is the difference between generic markup and code that matches your repo."
  - name: "Aim at one frame"
    text: "Select a single component or screen frame in Figma, or copy its link. In the prompt, tell Claude to call get_metadata first for the sparse node map and then get_design_context only on the node you are implementing. Selecting a whole page floods the context window and lowers output quality."
  - name: "Prompt for the component, not for a copy"
    text: "Name the target file path, the primitives to reuse, and the states the frame cannot show: hover, focus, disabled, loading, empty, error, and the breakpoints you support. Ask Claude to map every color and spacing value to an existing token and to list any value that has no token rather than hardcoding it."
  - name: "Pull the variables as tokens"
    text: "Ask for get_variable_defs on the frame or the foundations page and write the result to a file in the repo. Run the design-token-extractor skill or the design-tokens command over it to produce a diff against your token file: variables missing from code, values that drifted, and tokens no longer present in Figma. Fix the token layer before touching the component."
  - name: "Review the built screen"
    text: "Run the component in your dev server, take a screenshot, and run the critique-screen command over it against the original frame. It returns a numbered list covering hierarchy, spacing, states, contrast, and target sizes. Fix the items that are real; ignore the ones that are stylistic disagreements with your design."
  - name: "Commit the code, the tokens, and the frame link"
    text: "Commit the component, any new tokens, and a line in the component file or its spec recording the Figma node URL it came from. That link is what makes the next drift check possible; without it, nobody can tell which frame the code is supposed to match."
faq:
  - q: "What does the Figma MCP server give Claude Code that a screenshot does not?"
    a: "Structure. A screenshot is a flat raster, so the model has to infer hierarchy, spacing, and component boundaries from pixels. The MCP server returns the design's actual data: get_metadata gives a sparse outline of nodes with their IDs, names, types, and positions, get_design_context converts layers into code, get_variable_defs returns the variables and styles behind the frame, and the Code Connect tools map Figma components to the components in your repo. The result is code that reuses your system instead of lookalike markup."
  - q: "Which Figma plan and seat do I need?"
    a: "The remote server at mcp.figma.com/mcp is available on all seats and plans according to Figma's documentation. The desktop server, which runs inside the Figma desktop app and serves your live selection, requires a Dev or Full seat on a paid plan. Figma states that writing to the canvas is free during the beta period and will eventually become a usage-based paid feature, so treat the write tools as subject to change."
  - q: "Remote server or desktop server?"
    a: "Remote, in almost every case. Figma's own documentation says it provides the local desktop version for specific organization and enterprise use cases but strongly recommends the remote version, which also carries tools the desktop one does not, including download_assets, the design system search tools, and the write-back tools. Reach for the desktop server when policy keeps you off the hosted endpoint or when you specifically want the agent to read whatever is selected in the open file."
  - q: "Why does the generated code ignore my design system?"
    a: "Because nothing told it about your design system. The server reports what the frame contains, not what your repo prefers. Three fixes, in order of impact: put the framework, component folder, and token file in CLAUDE.md; set up Code Connect so Figma components resolve to your real components; and name the files to imitate in the prompt. Asking Claude to list values that have no matching token, rather than inventing one, catches the rest."
  - q: "Can I use this if the design only exists as an image?"
    a: "Yes, but it is a different workflow with different limits, covered in the screenshot-to-code guide. A vision model reads the image and produces a first draft that you refine conversationally. Use it when the design lives only as a picture; use the MCP server whenever you have the file, because the structure a screenshot throws away is exactly what makes the output on-system."
related: ["guide:claude-design-guide", "guide:claude-code-for-designers", "guide:maintain-a-design-system-with-claude-code", "guide:screenshot-to-code-with-ai", "tool:figma-mcp", "skill:design-token-extractor", "command:critique-screen", "glossary:design-to-code"]
sources:
  - title: "Figma MCP server: tools and prompts"
    url: "https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/"
    publisher: "Figma"
  - title: "Set up the remote Figma MCP server"
    url: "https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/"
    publisher: "Figma"
  - title: "Set up the desktop server (using desktop app)"
    url: "https://developers.figma.com/docs/figma-mcp-server/local-server-installation/"
    publisher: "Figma"
  - title: "Guide to the Figma MCP server"
    url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server"
    publisher: "Figma"
---

Figma's MCP server is the difference between an agent guessing at your design and an agent reading it. Instead of pixels it hands Claude Code the node tree, the variables behind every color and spacing value, and the mapping from Figma components to the components already in your repo. This guide connects it, points it at one frame, and walks the frame to a committed component that uses your tokens.

It assumes you have Claude Code running. If you do not, start with [Claude Code for designers](/guides/design/claude-code-for-designers), and the wider picture of Claude in a design practice is in the pillar, [Claude for design work](/guides/design/claude-design-guide). The term itself is in the glossary under [design-to-code](/glossary/design-to-code).

## Two servers, one decision

Figma ships the MCP server in two forms, and picking the wrong one wastes an afternoon.

| | Remote server | Desktop server |
|---|---|---|
| Address | `https://mcp.figma.com/mcp` | `http://127.0.0.1:3845/mcp` |
| Needs the desktop app | No | Yes |
| Seat and plan | All seats and plans | Dev or Full seat, paid plans |
| Reads | Files you can access, by link | Your live selection in the open file |
| Extra tools | `download_assets`, design system search, write-back to canvas | — |

Figma's documentation is direct about the choice: it provides the desktop version for specific organization and enterprise use cases but strongly recommends the remote one. Start there. Turn to the desktop server if your organization keeps you off the hosted endpoint, or if you want the agent tied to whatever is selected in the file in front of you.

To turn the desktop server on: open a Design file in the Figma desktop app, press `Shift + D` (or use the toolbar) to enter Dev Mode, find the MCP server section in the inspect panel, and click **Enable desktop MCP server**.

> [!NOTE]
> Only clients listed in Figma's MCP Catalog can connect to the server. Claude Code is one of them, alongside VS Code, Cursor, Xcode, and Codex.

## Connect it to Claude Code

One command from your project root:

```bash
# remote (recommended)
claude mcp add --transport http figma https://mcp.figma.com/mcp

# available in every project instead of just this one
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp

# desktop server, with the Figma app running
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

Start a session, type `/mcp`, pick **figma**, and choose **Authenticate**. A browser tab opens, you approve access, and the tools appear. If MCP setup in general is new, [Setting up MCP servers in Claude Code](/guides/mcp/claude-code-mcp-setup) covers scopes and troubleshooting; the server itself is profiled on the [Figma MCP](/tools/figma-mcp) tool page.

## Teach the repo its own conventions

This is the step that decides whether the output is usable. The server describes the design; nothing in it describes your codebase. `CLAUDE.md` at the project root is loaded at the start of every session, so that is where the conventions go:

```markdown
## UI conventions

- React with TypeScript, Tailwind for styling. No CSS modules, no styled-components.
- Primitives live in `src/components/ui/`. Check that folder before creating anything.
- Colors and spacing come from the token classes in `src/styles/tokens.css`.
  A raw hex or a raw px value in a component is a bug.
- Every interactive element needs a visible focus style and an accessible name.
- One component per file, named export, props typed, no `any`.
```

Keep it short. Anthropic's guidance is to target under 200 lines per `CLAUDE.md`, because long files consume context and lower adherence; [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) goes deeper. Figma also exposes a `create_design_system_rules` prompt that generates a rules file for aligning generated code with your design system, which is a reasonable starting draft to edit rather than a finished policy.

## Aim at one frame, not the whole file

Select a single component or screen frame, or copy its link from Figma. Then be explicit about the read order in your prompt:

```text
Use the figma MCP server on my current selection, the "Pricing card" frame.
Call get_metadata first, then get_design_context on that card node only.
```

`get_metadata` returns a sparse outline of layer IDs, names, types, and positions. It is cheap, and it lets Claude request context for exactly the node you are building. Handing over a whole page instead fills the context window with sibling frames you are not implementing, and quality drops with it.

## The prompt that produces on-system code

A frame cannot show hover, focus, loading, empty, or error. It shows one state at one width. Say the rest:

```text
Build the selection as src/components/ui/PricingCard.tsx, following the UI
conventions in CLAUDE.md. Reuse Button and Badge from src/components/ui.
Map every color, spacing, and radius value to an existing token class; if a
value has no token, list it at the end instead of hardcoding it.
Include hover, focus-visible, and disabled states for the CTA, and a loading
state for the price while it fetches. Support the sm and lg breakpoints only.
```

The "list it instead of hardcoding it" instruction is worth more than any other line. It converts silent invention into a short report you can act on, and that report is usually the first honest inventory of where design and code have drifted.

If Code Connect is set up in your Figma organization, the `get_code_connect_map` tool resolves node IDs to real code components, and `add_code_connect_map` records new mappings as you build them. Mapped components stop the agent from re-implementing a button that already exists.

## Pull the variables as tokens

`get_variable_defs` returns the variables and styles behind a selection: colors, spacing, typography. That is the honest route to tokens, and it is the reason design-to-code from the file beats design-to-code from an image.

```text
Call get_variable_defs on the "Foundations / Color" page and write the raw
result to design/figma-variables.json. Then compare it with
src/styles/tokens.css and list three groups: variables in Figma with no token
in code, tokens whose values differ, and tokens in code that Figma no longer
defines. Do not edit either file yet.
```

Hand that file to the [design-token-extractor](/skills/design/design-token-extractor) skill to normalize it into a named token set, or run the [design-tokens](/commands/design/design-tokens) command to regenerate your token file from it. Fix the token layer first; a component built on drifted tokens inherits the drift. Definitions are in the glossary under [design tokens](/glossary/design-tokens).

## Review, then commit

Run the component, screenshot it, and run [critique-screen](/commands/design/critique-screen) over the screenshot with the original frame alongside. You get a numbered list covering hierarchy, spacing, state coverage, contrast, and target sizes. Accept what is real, reject what is a stylistic disagreement, and re-prompt for the fixes rather than hand-patching.

Then commit the component, any new tokens, and the Figma node URL the code came from, in a comment or in the component's spec file. That URL is the thread that makes future drift checks possible, and it is the input to [maintaining a design system with Claude Code](/guides/design/maintain-a-design-system-with-claude-code).

## When there is no file

Sometimes the design is a screenshot in a Slack thread. That path works too, with different limits: the model infers structure it cannot see, so the output is a first draft rather than a faithful build. [Screenshot-to-code](/guides/vision/screenshot-to-code-with-ai) covers how to prompt for it and where it bites. Use the MCP server whenever the file exists, because the structure a screenshot discards is precisely the part you were trying to preserve.

If your team wants the review, handoff, and UX-writing side of this in one install, Anthropic ships a plugin for it: see [Anthropic's design plugin](/guides/design/claude-design-plugin-guide).
