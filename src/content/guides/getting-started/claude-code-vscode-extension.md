---
title: "Claude Code in VS Code: The Extension, Setup, and What It Adds"
seoTitle: "Claude Code VS Code Extension: Setup, Features, CLI Differences"
description: "Install the Claude Code VS Code extension, see what it adds over the terminal CLI (inline diffs, plan review, @-mentions, checkpoints), requirements, and fixes."
seoDescription: "Claude Code in VS Code, explained: install the anthropic.claude-code extension, what it adds over the CLI, requirements, JetBrains status, and common fixes."
author: "Imtiaz Rayhan"
date: 2026-10-06
color: "green"
depth: standard
topics: ["workflow-prompting", "coding-languages"]
audience: ["developers"]
tags: ["claude-code", "vs-code", "extension", "ide", "setup"]
keywords: ["Claude Code VS Code extension", "Claude Code in VS Code", "install Claude Code VS Code", "Claude Code extension vs CLI", "Claude Code JetBrains plugin"]
summary: "The Claude Code VS Code extension adds a graphical panel with inline diffs, plan review, @-mentions with line ranges, checkpoints and session tabs. It bundles a private CLI but does not install the claude command; the terminal CLI is a separate install and both share history. Needs VS Code 1.94.0+ and a paid Claude plan or Console account."
keyTakeaways:
  - "The extension is a native graphical panel for Claude Code and, per Anthropic's docs, the recommended way to use Claude Code in VS Code; its version number equals the Claude Code version it bundles."
  - "Installing it does not put claude on your PATH. The chat panel uses a bundled private CLI; running claude in the integrated terminal needs the standalone install, and the two share conversation history."
  - "What you gain over the terminal: side-by-side diffs with per-change accept and reject, plans opened as editable Markdown, @-mentions with line ranges, checkpoints with rewind, session history and tabs."
  - "What stays CLI-only: the full command and skill set, the ! Bash shortcut, and tab completion. Open the integrated terminal and run claude when you need them."
  - "Requirements: VS Code 1.94.0 or later and a paid Claude plan or a Claude Console account; no API key. The extension does not work in Restricted Mode."
  - "JetBrains IDEs use a separate plugin that runs the CLI in the IDE terminal and does not bundle it, so you install both pieces."
howtoSteps:
  - name: "Check the requirements"
    text: "You need VS Code 1.94.0 or later and an Anthropic account: any paid Claude subscription (Pro, Max, Team or Enterprise) or a Claude Console account. No API key is required. Open the folder in a trusted workspace, because the extension does not work in Restricted Mode."
  - name: "Install the extension"
    text: "Press Cmd+Shift+X on Mac or Ctrl+Shift+X on Windows and Linux to open the Extensions view, search for Claude Code, and click Install. The listing is Claude Code for VS Code by Anthropic, ID anthropic.claude-code. In Cursor, the same extension installs from the cursor:extension/anthropic.claude-code link."
  - name: "Open the panel and sign in"
    text: "Click the Spark icon in the editor toolbar or the Activity Bar, or press Cmd+Esc (Ctrl+Esc on Windows and Linux). Sign in with your Claude account when prompted. Drag the panel to the right sidebar, the left sidebar or an editor tab, or set the preferredLocation extension setting."
  - name: "Choose a permission mode"
    text: "Use the mode indicator in the prompt box. Auto lets a classifier review most actions, Manual asks before file edits and most shell commands, Plan makes Claude describe the work and wait for approval, and Edit automatically applies edits without asking. With Claude Code v2.1.283 or later, Auto is the built-in starting mode."
  - name: "Give Claude context"
    text: "Claude sees your selected text and the open file automatically. Type @ followed by a file or folder name to attach it, or select lines and press Option+K (Alt+K) to insert a reference such as @file.ts#5-10. Use @terminal:name to include terminal output."
  - name: "Review changes and rewind when needed"
    text: "In Manual mode each edit opens as a side-by-side diff with Accept this change and Reject this change buttons under each change. Hover over any message to reveal the rewind button if you want to fork the conversation, rewind the code, or both."
  - name: "Add the CLI if you need CLI-only features"
    text: "Install the standalone CLI separately, then press Ctrl+` (Cmd+` on Mac) to open the integrated terminal and run claude. The CLI connects to VS Code for diff viewing and diagnostics, and claude --resume continues a conversation you started in the panel."
faq:
  - q: "Does the Claude Code VS Code extension install the claude command?"
    a: "No. The extension bundles a private copy of the CLI for its chat panel, but typing claude in a terminal requires the standalone CLI install. Once both are installed they share the same conversation history, so you can continue a panel conversation in the terminal with claude --resume."
  - q: "What does the VS Code extension do that the terminal does not?"
    a: "It shows proposed edits as side-by-side diffs you can accept or reject one change at a time, opens plans as a full Markdown document you can comment on before approving, lets you @-mention files with line ranges from your selection, keeps a searchable session history with tabs, supports checkpoints with rewind, and opens an Account and usage dialog with /usage. The CLI keeps the full command and skill set, the ! Bash shortcut and tab completion."
  - q: "What are the requirements for the Claude Code extension?"
    a: "VS Code 1.94.0 or later, plus an Anthropic account: any paid Claude subscription (Pro, Max, Team or Enterprise) or a Claude Console account. No API key is needed. The extension does not work in VS Code's Restricted Mode, so trust the workspace first."
  - q: "Is the VS Code extension still in beta as of October 2026?"
    a: "Anthropic announced the native extension as a beta on September 29, 2025, and as of October 2026 no separate general-availability announcement has been published; the current docs carry no beta label and call the extension the recommended way to use Claude Code in VS Code."
  - q: "Is there a Claude Code plugin for JetBrains IDEs?"
    a: "Yes. A dedicated plugin supports IntelliJ IDEA, PyCharm, Android Studio, WebStorm, PhpStorm and GoLand. Unlike the VS Code extension it does not bundle the CLI: it runs the claude command in the IDE's integrated terminal and adds diff viewing, selection sharing and file-reference shortcuts, so you install the CLI and the plugin."
sources:
  - title: "Use Claude Code in VS Code"
    url: "https://code.claude.com/docs/en/vs-code"
    publisher: "Anthropic"
  - title: "JetBrains IDEs"
    url: "https://code.claude.com/docs/en/jetbrains"
    publisher: "Anthropic"
  - title: "Platforms and integrations"
    url: "https://code.claude.com/docs/en/platforms"
    publisher: "Anthropic"
  - title: "Claude Code for VS Code (Marketplace listing)"
    url: "https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code"
    publisher: "Visual Studio Marketplace"
  - title: "Enabling Claude Code to work more autonomously"
    url: "https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously"
    publisher: "Anthropic"
  - title: "Claude Code CHANGELOG"
    url: "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md"
    publisher: "Anthropic (GitHub)"
  - title: "Use Claude Code with your Pro or Max plan"
    url: "https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan"
    publisher: "Anthropic"
related: ["guide:installing-claude-code", "guide:claude-code-tips", "guide:claude-code-settings-permissions", "guide:claude-code-troubleshooting", "tool:claude-code", "tool:cursor", "guide:claude-code-vs-cursor", "guide:update-claude-code", "guide:claude-code-usage-limits", "guide:claude-code-slash-commands"]
---

The [Claude Code](/tools/claude-code) VS Code extension puts Claude Code in a graphical panel inside your editor: side-by-side diffs you accept or reject change by change, plans you can comment on before any code moves, `@`-mentions that attach a file or a selected line range, checkpoints you can rewind to, and a usage dialog. Anthropic's docs call it "the recommended way to use Claude Code in VS Code." It bundles a private copy of the CLI, so the panel works without a separate install, but it does not put `claude` on your PATH. The terminal CLI is still its own install, and the two share conversation history.

## What the extension is

On the Marketplace the listing is "Claude Code for VS Code", published by Anthropic, with the ID `anthropic.claude-code`. Its version number is not arbitrary: it is the Claude Code version the extension bundles. If the docs say a feature needs Claude Code v2.1.286 or later, you need extension version 2.1.286 or later, and the Extensions view shows which one you have.

Anthropic announced the native extension as a beta on September 29, 2025, together with Claude Code 2.0 and checkpoints; as of October 2026 there has been no separate general-availability announcement, but the current docs carry no beta label and describe the extension as the recommended way to use Claude Code in VS Code.

Throughout VS Code, a Spark icon marks Claude Code. It appears in the editor toolbar (top right, only while a file is open), in the Activity Bar (always), and as **✻ Claude Code** in the status bar, which works even with no file open.

## Requirements and install

You need **VS Code 1.94.0 or later** and an Anthropic account: any paid Claude subscription (Pro, Max, Team or Enterprise) or a Claude Console account. No API key is required. The extension does not work in Restricted Mode, so trust the workspace first.

Install from the Extensions view (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` on Windows and Linux), search for "Claude Code", and click **Install**. The docs also give direct links: `vscode:extension/anthropic.claude-code` for VS Code and `cursor:extension/anthropic.claude-code` for Cursor. Then open the panel with the Spark icon or `Cmd+Esc` (`Ctrl+Esc`), sign in, and drag the panel wherever you want it: the secondary sidebar on the right, the primary sidebar on the left, or an editor tab. The `preferredLocation` setting (default `panel`) controls where new sessions open.

The panel needs none of the CLI setup; [Installing Claude Code](/guides/getting-started/installing-claude-code) covers that side when you want it.

## What the extension adds over the terminal

**Diffs you can review change by change.** In Manual mode, when Claude wants to edit a file it shows a side-by-side comparison of the original and the proposed change and asks for permission. You can accept, reject, or tell Claude what to do instead. **Accept this change** and **Reject this change** buttons under each hunk let you review one change at a time (Claude Code v2.1.275 or later); a diff with more than 100 changes opens without the per-change buttons.

**Plan review.** In Plan mode, Claude describes what it will do and waits. VS Code opens the plan as a full Markdown document where you add inline comments before Claude starts. You can also type `/plan` in the prompt box (v2.1.280 or later).

**Permission modes in the prompt box.** The mode indicator offers **Auto** (a classifier reviews most actions instead of asking you), **Manual** (Claude asks before file edits and most shell commands), **Plan**, and **Edit automatically** (edits without asking). With v2.1.283 or later, Auto is the built-in starting mode; on earlier versions it was only on Pro, Max and Team plans. The underlying rules are the same ones the CLI uses, covered in [settings and permissions](/guides/configuration/claude-code-settings-permissions).

**Selection and @-mentions.** Claude automatically sees your selected text and which file you have open, even with nothing selected; the prompt box shows the file's name. Press `Option+K` (`Alt+K`) to insert a reference like `@file.ts#5-10` for the selection. Typing `@` followed by a file or folder name attaches it, with fuzzy matching, and `@terminal:name` includes a terminal's output. If you only want the selection and not the whole open file, turn off the **Attach Open File** setting (v2.1.271 or later).

**Checkpoints and rewind.** The extension tracks Claude's file edits. Hover over any message to reveal the rewind button and pick **Fork conversation from here**, **Rewind code to here**, or **Fork conversation and rewind code**.

**Sessions, history and tabs.** The **Session history** button at the top of the panel searches past conversations by keyword or browses them by time. **Open in New Tab** or **Open in New Window** starts parallel conversations, each with its own context. A small colored dot on the Spark icon reports status: blue means a permission request is waiting, orange means Claude finished while the tab was hidden.

**Usage, in the panel.** `/usage` opens the Account & usage dialog with your signed-in account and, on a claude.ai plan, bars for the current session and the week with the time until each resets, plus attribution tables showing how much usage came from each skill, subagent, plugin and MCP server. How those limits work is its own topic: see [Claude Code usage limits explained](/guides/getting-started/claude-code-usage-limits).

## What stays CLI-only

The docs are explicit that "some features are only available in the CLI." Their comparison:

| Feature | CLI | Extension |
| --- | --- | --- |
| Commands and skills | All | Subset (type `/` to see what is available) |
| MCP server config | Yes | Yes |
| Checkpoints | Yes | Yes |
| `!` Bash shortcut | Yes | No |
| Tab completion | Yes | No |

When you need a CLI-only feature, press `` Ctrl+` `` (`` Cmd+` `` on Mac) to open the integrated terminal and run `claude`. The CLI automatically integrates with the IDE for diff viewing and diagnostic sharing; from an external terminal, run `/ide` inside Claude Code to connect it to VS Code.

## How the extension relates to the CLI

Three facts save the most confusion:

- **Installing the extension does not install `claude`.** The docs say it directly: "Installing the extension does not put `claude` on your shell PATH. The extension bundles a private copy of the CLI for its chat panel, but typing `claude` in a terminal requires the standalone CLI install."
- **They share history and settings.** To continue an extension conversation in the terminal, run `claude --resume`. Claude Code settings in `~/.claude/settings.json` are shared between the two. Opening the same conversation in two places shows a warning that using it in both can mix up its messages.
- **The CLI reinstalls the extension.** Running `claude` in a VS Code integrated terminal reinstalls the extension automatically. To keep it uninstalled, turn off **Auto-install IDE extension** in `/config`, set `autoInstallIdeExtension` to `false`, or set `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL=1`.

The extension updates through VS Code; [How to update Claude Code](/guides/getting-started/update-claude-code) covers the CLI side.

## Keyboard shortcuts

| Action | Mac | Windows / Linux |
| --- | --- | --- |
| Toggle focus between editor and Claude | `Cmd+Esc` | `Ctrl+Esc` |
| Open in new tab | `Cmd+Shift+Esc` | `Ctrl+Shift+Esc` |
| Insert @-mention reference for the selection | `Option+K` | `Alt+K` |
| Reopen closed session | `Cmd+Shift+T` | `Ctrl+Shift+T` |
| Toggle Focus view | `Ctrl+Option+F` | `Ctrl+Alt+F` |
| New conversation (opt-in via `enableNewConversationShortcut`) | `Cmd+N` | `Ctrl+N` |

More terminal-side shortcuts and habits are in [25 Claude Code tips](/guides/getting-started/claude-code-tips).

## Cursor, other forks, and JetBrains

The same extension installs in [Cursor](/tools/cursor) through the direct link above, and in other VS Code forks such as Devin Desktop or Kiro from their Extensions view or from the Open VSX registry. For editors that cannot install it, the docs' answer is the CLI in the editor's integrated terminal. Anthropic's help center confirms that a Pro or Max plan covers Claude Code in VS Code, Cursor and other VS Code forks, and in JetBrains IDEs, and that IDE usage counts toward the same shared usage limits. For Cursor's own agent against Claude Code, [Claude Code vs Cursor](/guides/comparisons/claude-code-vs-cursor) is the comparison.

JetBrains is different architecture. A dedicated plugin supports IntelliJ IDEA, PyCharm, Android Studio, WebStorm, PhpStorm and GoLand, and "runs the `claude` command in your IDE's integrated terminal and connects to it. It does not bundle its own copy of the CLI, so install both pieces." It adds `Cmd+Esc` (`Ctrl+Esc`) quick launch, opens Claude's changes in the IDE diff viewer, shares the current selection or tab, inserts file references such as `@src/auth.ts#L1-99` with `Cmd+Option+K` (`Alt+Ctrl+K`), and shares diagnostics. One security note from the docs: in `acceptEdits` mode Claude may be able to modify IDE configuration files that the IDE executes automatically.

## What changed in 2026

Dates are the GitHub release dates of the Claude Code version that shipped each change:

- **June 12 (v2.1.174):** usage attribution in the `/usage` dialog, with cache misses, long context, subagents and per-skill, agent, plugin and MCP breakdowns over the last 24 hours or 7 days.
- **August 12 (v2.1.229):** session groups in the Activity Bar sessions list.
- **September 14 (v2.1.271):** the Attach Open File setting and Active and status filters in the sessions list.
- **September 17 (v2.1.274 and v2.1.275):** Memory and Instructions entries in the Customize menu, including editing CLAUDE.md files from the panel; per-change Accept and Reject in diffs; viewing, editing and deleting saved memories in the Memory dialog.
- **September 22 (v2.1.280):** `/plan` typed in the prompt box.
- **September 25 (v2.1.283):** Auto becomes the built-in starting permission mode.

## Troubleshooting

**`Cmd+Esc` does nothing on macOS Tahoe.** The system Game Overlay shortcut is bound to `Cmd+Esc` by default and intercepts the keypress before VS Code sees it. Clear it under System Settings > Keyboard > Keyboard Shortcuts > Game Controllers, or rebind the "Claude Code: Focus input" command in VS Code.

**`claude: command not found` in the integrated terminal.** Expected. The extension does not install the CLI; follow [Installing Claude Code](/guides/getting-started/installing-claude-code) and open a new terminal.

**A documented feature or slash command is missing.** Compare your extension version with the Claude Code version the docs name for it and update in the Extensions view; if `/` does not list the command, it is CLI-only.

**"This conversation is still open somewhere else."** You have the same conversation open in the panel and the terminal. Close one before continuing, or messages can get mixed up.

**The extension keeps coming back after you uninstall it.** Running `claude` in the integrated terminal reinstalls it; disable Auto-install IDE extension in `/config` or set `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL=1`.

For problems that are not extension-specific, from auth loops to context-limit errors and MCP servers that will not start, see [Claude Code troubleshooting](/guides/troubleshooting/claude-code-troubleshooting).
