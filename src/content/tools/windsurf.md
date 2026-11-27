---
name: "Devin Desktop (formerly Windsurf)"
title: "Devin Desktop (formerly Windsurf)"
description: "An agentic IDE — formerly Windsurf, now Devin Desktop from Cognition AI — with flows that take multi-step actions across your codebase."
seoTitle: "Devin Desktop (formerly Windsurf): What Changed, Pricing, Alternatives"
seoDescription: "Windsurf is now Devin Desktop from Cognition AI. What the June 2026 rebrand changed, how Devin Local replaced Cascade, its pricing, and the best alternatives."
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://devin.ai/desktop"
pricing: "freemium"
category: "ide"
color: "cyan"
topics: ["coding-languages"]
tags: ["ide", "editor"]
alternativeTo: ["cursor", "antigravity", "void", "zed", "github-copilot"]
summary: "Devin Desktop is the new name for the Windsurf editor, rebranded by Cognition AI on June 2, 2026. Its local agent, Devin Local, replaced Cascade, and an Agent Command Center for local, cloud and third-party ACP agents is now the main view. As of November 2026 plans run from Free at $0 to Pro at $20 and Max at $200 a month."
faq:
  - q: "What is Devin Desktop (formerly Windsurf)?"
    a: "Devin Desktop is the new name for the Windsurf IDE. Cognition AI, maker of the Devin coding agent, renamed it on June 2, 2026 and delivered the change as a regular over-the-air update. Cognition's FAQ describes it as the same IDE and editor with the same features, unified under the Devin brand, with the Agent Command Center as the primary view and the classic editor still fully accessible."
  - q: "What happened to Cascade?"
    a: "Cascade is now the legacy agent. Cognition's docs say Devin Desktop no longer starts new Cascade conversations, no longer opens old ones, and the agent selector no longer offers it. New conversations start with Devin Local, which shares its agent harness with the Devin CLI. In the Windsurf JetBrains plugin, which is in maintenance mode, Cognition recommends switching to Devin over ACP."
  - q: "Is Devin Desktop free?"
    a: "There is a free plan. As of November 2026 Cognition's pricing page lists Free at $0 with a light quota to code with agents, limited model availability, unlimited inline edits and unlimited Tab completions. Pro costs $20 per month and Max $200 per month as of November 2026, and Teams is a flat $80 per month for up to 100 users."
  - q: "Do my Windsurf rules, settings and the surf command still work?"
    a: "Yes. Settings are ported automatically, the legacy .windsurfrules file and .windsurf/rules/ directory are still read, and .devin/rules/ is the preferred location that takes precedence. The surf shell command has been replaced by devin-desktop, which you install from the command palette, and the old surf and windsurf commands still ship for backward compatibility."
audience: ["developers"]
related: ["tool:devin", "tool:cursor", "tool:claude-code", "guide:vibe-coding-guide", "glossary:agentic-ai"]
---

Devin Desktop is the editor that used to be called Windsurf. Cognition AI, maker of the [Devin](/tools/devin) coding agent, acquired Windsurf in 2025 and renamed the standalone editor on June 2, 2026, folding it into one product line with Devin Cloud, the Devin CLI and Devin Review. Cognition's FAQ says it is "the same IDE, same editor, and has the same features", and that nothing was removed.

What did change is the front door. The **Agent Command Center**, a board of every agent session you are running, is now the primary view, with the full editor behind it. The built-in agent is **Devin Local**, which replaced Cascade. And through the Agent Client Protocol (ACP) you can run other vendors' agents in the same window. It is aimed at developers who want an editor organized around supervising several agents, not only around typing with an assistant.

## Highlights

- **Devin Local.** The primary local agent, sharing its harness with the Devin CLI. It supports subagents (behind a toggle labelled Preview as of November 2026), OS-level sandboxing with filesystem isolation and network filtering, git worktrees, and allow, ask and deny permission rules.
- **Five modes.** Code, Smart, Ask, Plan and Bypass Permissions, switched from the selector or by typing `/code`, `/smart`, `/ask`, `/plan` or `/bypass`.
- **Agent Command Center.** One view of local and cloud sessions, with states such as working, waiting for CI and PR ready.
- **ACP agents.** Run Codex CLI, Claude Agent, OpenCode, Junie, Gemini CLI or a custom agent inside the editor. Billing for those is between you and the agent's provider.
- **Cloud handoff.** Delegate a task to Devin, the cloud agent, and review its pull requests without leaving the editor. Cloud agents need a paid plan.
- **Editor features.** Tab completions, Command (`Cmd/Ctrl+I`) for inline edits, Fast Context for code retrieval, DeepWiki explanations of symbols, Codemaps and Quick Review.
- **Customization.** Rules, skills, plugins, MCP servers and hooks, with `AGENTS.md` support and import of `.cursor/rules`.
- **Familiar base.** You can import VS Code or Cursor settings at onboarding, and extensions come from Open VSX.

## How it fits an AI-assisted workflow

A typical loop: open the project, describe a change, let Devin Local plan and edit across files in Code mode, then review the diff. For a larger change, start in Plan mode so the agent explores read-only and writes a plan for you to approve first.

Install the shell command from the command palette (**Shell Command: Install 'devin-desktop' command in PATH**), then:

```bash
# open the current project in Devin Desktop
devin-desktop .
```

A rule file keeps the agent consistent across sessions. Directory rules live in `.devin/rules/` as Markdown files. An illustrative example:

```text
.devin/rules/testing.md
----------------------
Run the unit tests for any package you change before reporting done.
Never edit files under migrations/ without asking first.
```

> [!NOTE]
> In Code mode the agent auto-approves edits inside the workspace, and Bypass Permissions auto-approves every tool call unless your organization's policy says otherwise. Review diffs before accepting them in repositories with production or shared code, and set deny rules for commands you never want run.

## Pricing

Plans changed after the rebrand, so older Windsurf price lists no longer apply. As of November 2026 Cognition's pricing page lists Free at $0 with a light agent quota, limited model availability, unlimited inline edits and unlimited Tab completions. Pro costs $20 per month as of November 2026 and adds higher quotas, full model availability including frontier models, free use of Cognition's SWE-2 model, cloud agents (Devin Cloud) and the option to buy extra usage at API pricing. Max costs $200 per month as of November 2026, with significantly higher quotas and Devin Bots.

For teams, as of November 2026 Teams is a flat $80 per month for up to 100 users with shared on-demand credits, SAML/OIDC SSO and centralized billing, and Enterprise is priced by sales. Paid plans carry a usage allowance that refreshes daily and weekly, and the cost of a message varies with the model, task size and reasoning required.

## Good to know

- **Platforms.** macOS (Apple Silicon and Intel), Windows 10 64-bit on x64 or arm64, and Linux with glibc 2.28 or newer, with apt and rpm repositories.
- **It is a separate editor.** Adopting it means switching IDEs, not adding an extension to the one you have.
- **JetBrains.** The Windsurf JetBrains plugin keeps its name but is in maintenance mode, and Cognition warns that newer JetBrains IDE releases can break it.
- **Naming is mid-transition.** Doc URLs and settings paths still say Windsurf or Codeium in places, and the app reads both old and new file paths.
- **Third-party agents on Enterprise.** ACP agents are available on Free, Pro, Max and Teams; on Enterprise they are off by default until an admin has them enabled.
- **Restricted Mode.** Every agent is unavailable while a workspace is open in Restricted Mode.

Among alternatives, [Cursor](/tools/cursor) is the closest match, another VS Code-based editor with in-editor agents. [Google Antigravity](/tools/antigravity) shares the agent-manager idea and is built around Gemini. [Zed](/tools/zed) is the pick if editor speed matters most, and [Claude Code](/tools/claude-code) if you would rather keep your current editor and run the agent in a terminal.

Read [Cursor vs Windsurf (Devin Desktop)](/guides/comparisons/cursor-vs-windsurf) and [Cursor vs Claude Code vs GitHub Copilot vs Windsurf](/guides/prompting/cursor-vs-claude-code-vs-copilot-vs-windsurf-2026) for side-by-side trade-offs, or browse [Windsurf alternatives](/tools/windsurf/alternatives).
