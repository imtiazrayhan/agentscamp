---
title: "Claude Code Checkpoints: How /rewind Works and What It Can't Undo"
seoTitle: "Claude Code Checkpoints and /rewind: What Gets Restored"
description: "How Claude Code checkpoints work: what /rewind restores, the rewind menu's actions, what isn't tracked, how long snapshots last, and where git fits in."
author: "Imtiaz Rayhan"
date: 2026-11-19
reviewed: 2026-11-22
color: "green"
depth: standard
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["claude-code", "checkpoints", "rewind", "undo", "git"]
keywords: ["Claude Code checkpoints", "Claude Code rewind", "Claude Code undo", "Claude Code /rewind", "Claude Code restore code", "Claude Code checkpoint vs git"]
summary: "Claude Code creates a checkpoint for every prompt that starts a turn and tracks the edits its file-editing tools make. Run /rewind (or /undo, /checkpoint, or Esc twice) to restore code, the conversation, or both, or to summarize part of the session. Files only Bash touched, most subagent edits and outside changes aren't tracked, so keep git for real history."
keyTakeaways:
  - "Every prompt that starts a turn creates a checkpoint, and Claude Code tracks every change its file-editing tools make."
  - "Open the rewind menu with /rewind, its aliases /undo and /checkpoint, or Esc twice on an empty prompt. It can restore code and conversation, either one alone, or summarize part of the session."
  - "Bash is partly tracked: once Claude has edited a file with its file tools, /rewind also undoes later Bash changes to that file. A file only Bash touched isn't tracked."
  - "Subagent edits usually aren't captured, and neither are your own edits outside Claude Code or edits from other sessions, unless they touch files the current session also changed."
  - "Snapshots are kept for the 100 most recent checkpoints in a session, survive a resume, and are deleted about 30 days after the session last saved one unless you raise cleanupPeriodDays."
  - "Checkpoints are session-level recovery, not version control. Commit to git at milestones, and use /branch or --fork-session to explore an alternative without rewinding."
howtoSteps:
  - name: "Open the rewind menu"
    text: "Run /rewind, /undo or /checkpoint, or press Esc twice with the prompt input empty. In vim mode, press Esc twice from NORMAL mode."
  - name: "Pick the checkpoint"
    text: "Select the message you want to go back to. Each prompt that started a turn is a checkpoint."
  - name: "Choose what to restore"
    text: "Pick Restore code and conversation, Restore conversation, or Restore code, or one of the two Summarize actions to compress part of the conversation without touching files. Code options appear only when that checkpoint has tracked file changes."
  - name: "Check what was skipped"
    text: "Run git status or git diff. Files that only Bash changed, most subagent edits, outside edits and symlinked or hard-linked files are not restored."
  - name: "Commit what you keep"
    text: "Once the code is where you want it, commit it to git, because checkpoints are capped at 100 per session and deleted by the retention sweep."
faq:
  - q: "Does /rewind undo Bash commands in Claude Code?"
    a: "Partly. Once Claude has edited a file with its file-editing tools in your conversation, /rewind also undoes changes that Bash commands make to that file afterward. A file that only Bash commands changed isn't tracked and stays as it is, so check git status after a rewind if Claude ran scripts or generators."
  - q: "How long does Claude Code keep checkpoints?"
    a: "Claude Code keeps file snapshots for the 100 most recent checkpoints in a session. Checkpoints are saved with the conversation, so /rewind still works after you resume. A retention sweep deletes a session's snapshots by default about 30 days after the session last saved one; raise the cleanupPeriodDays setting (default 30) to keep them longer."
  - q: "Is /undo the same as /rewind?"
    a: "Yes. /undo became an alias for /rewind in v2.1.108, and /checkpoint is another alias. Pressing Esc twice with an empty prompt opens the same rewind menu; if the prompt has text in it, double Esc clears the text instead."
  - q: "Do Claude Code checkpoints replace git?"
    a: "No. Anthropic's docs say checkpoints are designed for quick, session-level recovery and that you should keep using version control such as Git for permanent history and collaboration. Checkpoints only track Claude's file edits in one session, are capped at 100 per session, and expire with the retention sweep."
  - q: "Are subagent edits included in checkpoints?"
    a: "Usually not. The docs say Claude Code usually doesn't capture subagent edits in your session's checkpoints; a foreground forked skill is the exception. Rewinding restores only the files Claude had already edited in your conversation, so review subagent changes with git instead."
sources:
  - title: "Checkpointing"
    url: "https://code.claude.com/docs/en/checkpointing"
    publisher: "Anthropic"
  - title: "Commands reference"
    url: "https://code.claude.com/docs/en/commands"
    publisher: "Anthropic"
  - title: "Settings reference"
    url: "https://code.claude.com/docs/en/settings-reference"
    publisher: "Anthropic"
  - title: "Environment variables"
    url: "https://code.claude.com/docs/en/env-vars"
    publisher: "Anthropic"
  - title: "File checkpointing in the Agent SDK"
    url: "https://code.claude.com/docs/en/agent-sdk/file-checkpointing"
    publisher: "Anthropic"
  - title: "Use Claude Code in VS Code"
    url: "https://code.claude.com/docs/en/vs-code"
    publisher: "Anthropic"
  - title: "Feature availability by provider"
    url: "https://code.claude.com/docs/en/feature-availability"
    publisher: "Anthropic"
  - title: "Claude Code changelog"
    url: "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
    publisher: "Anthropic"
related: ["guide:claude-code-tips", "guide:parallel-claude-code-worktrees", "guide:claude-code-subagents", "guide:claude-code-headless-mode", "guide:claude-code-vscode-extension", "guide:claude-code-slash-commands", "guide:claude-code-memory-context", "tool:claude-code"]
---

Checkpoints are [Claude Code's](/tools/claude-code) undo. Anthropic's "Checkpointing" page puts it in one line: "Claude Code automatically tracks Claude's file edits as you work." When an approach goes wrong, you rewind to an earlier prompt instead of asking the agent to dig itself back out.

The feature arrived in v2.0.0 on September 29, 2025, as "/rewind a conversation to undo code changes." As of November 2026 it has more to it: two aliases, five actions in the menu, and partial tracking of Bash changes. The [Claude Code tips](/guides/getting-started/claude-code-tips) page gives the one-line version; this guide covers what is restored, what isn't, and how long snapshots last.

## What a checkpoint captures

Two rules from the docs define the feature:

- "Every prompt you send that starts a turn creates a new checkpoint."
- "Claude Code tracks all changes made by its file editing tools."

Bash sits in between. "Once Claude has edited a file with its file editing tools in your conversation, `/rewind` undoes changes that Bash commands make to that file afterward. A file that only Bash commands changed isn't tracked and stays as it is." If Claude edits `config.ts` and later runs a script that rewrites it, a rewind covers both changes. A file that a generator created through Bash isn't covered.

Messages you send while Claude is mid-turn can appear in the menu marked "No code restore." Checkpoints are listed among the features available on every provider, so they aren't limited to the Anthropic API.

## Opening the rewind menu

"Run `/rewind`, or press `Esc` twice when the prompt input is empty, to open the rewind menu." If the input has text in it, "double `Esc` clears it instead of opening the menu." In vim mode, press Esc twice from NORMAL mode. `/undo` (added in v2.1.108) and `/checkpoint` are aliases for `/rewind`.

If you ran `/clear` earlier in the same Claude Code process and want to get back to what came before, the menu shows a `/resume <session-id> (previous session)` entry for the earlier session.

## The rewind actions

Pick a message, then one of these:

| Action | Files | Conversation |
| --- | --- | --- |
| Restore code and conversation | Reverted to the checkpoint | Rewound to the selected message |
| Restore conversation | Unchanged | Rewound to the selected message |
| Restore code | Reverted to the checkpoint | Unchanged |
| Summarize from here | Unchanged | Compressed into a summary |
| Summarize up to here | Unchanged | Compressed into a summary |
| Never mind | Unchanged | Unchanged |

"The two code restore options appear only when the selected checkpoint has tracked file changes to revert." After you restore the conversation, "the original prompt from the selected message is restored into the input field," so you can fix the prompt and send it again instead of patching the result. The Summarize actions work "like a targeted `/compact`" and don't change files; "Summarize up to here" arrived in v2.1.141.

How to choose:

- **The approach was wrong from a given prompt.** Restore code and conversation, then edit the prompt that sent things sideways.
- **The code is fine but the discussion went off track.** Restore conversation, which keeps the files as they are.
- **The plan was right but the edits weren't.** Restore code and keep the conversation, so Claude still knows what you agreed.
- **The session is long but nothing is broken.** Use a Summarize action to free context. The [memory and context guide](/guides/configuration/claude-code-memory-context) covers when compaction helps.

## What checkpoints don't track

Assume these are not restored:

- **Files that only Bash changed**, as described above.
- **Most subagent edits.** "Claude Code usually doesn't capture those edits in your session's checkpoints." A foreground forked skill is the exception. Otherwise "rewinding restores only the files Claude had already edited in your conversation." The [subagents reference](/guides/configuration/claude-code-subagents) covers when work is delegated.
- **Your edits and other sessions' edits.** "Manual changes you make to files outside of Claude Code and edits from other concurrent sessions are normally not captured, unless they happen to modify the same files as the current session."
- **Symlinked and hard-linked files.** "Checkpointing doesn't rewind symlinked or hard-linked files." You'll see a warning such as `Restored the code, but skipped N files`.

Checkpoints cover local file edits only. They don't reverse what a command did elsewhere, such as pushing a branch or calling an API. Run `git status` after any rewind in a session where Claude used Bash or subagents.

## A rewind, step by step

A fictional session shows how those rules combine. In your first prompt you ask Claude to add rate limiting to `api/server.ts`. It edits the file with its edit tool, then runs a formatter through Bash that rewrites the same file. In your second prompt you ask for a database migration. Claude runs a generator through Bash, which creates `migrations/0042_rate_limits.sql`, and hands test-writing to a subagent, which adds `tests/rate_limit.test.ts`.

You decide the whole approach is wrong, open `/rewind`, select the first prompt, and choose Restore code and conversation. Here is what happens:

- **`api/server.ts` goes back to its original state**, including the formatter's rewrite, because Claude had edited the file with its file tools before Bash touched it.
- **`migrations/0042_rate_limits.sql` stays.** Only Bash created it, so it was never tracked.
- **`tests/rate_limit.test.ts` most likely stays**, because subagent edits usually aren't captured.
- **Your first prompt returns to the input field**, ready to rewrite.

`git status` now shows the two leftover files, and you delete them by hand. That cleanup step is the habit to build: a rewind restores what Claude's own file tools touched, and git shows you everything else.

## How long checkpoints last

- **Per session:** "Claude Code keeps file snapshots for the 100 most recent checkpoints in a session."
- **Across resumes:** "Claude Code saves checkpoints with the conversation, so you can still run `/rewind` after you resume a session."
- **On disk:** "Claude Code deletes a session's file snapshots in the retention sweep, by default about 30 days after the session last saved one… To keep snapshots longer, set `cleanupPeriodDays`." That setting defaults to `30`.

A long session can push early checkpoints past the 100 limit, and the sweep removes old sessions' snapshots on its own. Commit anything you want to keep.

## Checkpoints and git

The docs draw the line: "Checkpoints are designed for quick, session-level recovery. For permanent version history and collaboration, continue using version control, such as Git."

| | Checkpoints | Git commits |
| --- | --- | --- |
| Created | Automatically, per prompt that starts a turn | When you commit |
| Covers | Claude's file-tool edits (and later Bash edits to those files) | Whatever you stage |
| Lifetime | 100 per session; swept about 30 days after the last save | Permanent until you rewrite history |
| Collaboration | Not the job; the docs point to Git for it | Yes, when you push |

The working rhythm is to let checkpoints handle undo inside a task and commit at each point you'd be sorry to lose. To try a different direction without throwing away the current one, branch the conversation instead of rewinding: `/branch`, or `claude --continue --fork-session` from the shell. To run alternatives side by side on separate copies of the code, use [parallel git worktrees](/guides/advanced/parallel-claude-code-worktrees).

## Turning checkpoints off

Code checkpoints are on by default. Turn them off with the `fileCheckpointingEnabled` setting, shown in `/config` as "Rewind code (checkpoints)", or set `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING=1`, after which "the `/rewind` command will not be able to restore code changes."

## Why didn't /rewind restore my file?

Work through the causes in this order:

1. **The code options were missing from the menu.** They appear only when the selected checkpoint has tracked file changes. If Claude only ran commands during that turn, there is nothing to restore.
2. **Only Bash changed the file.** Files that Claude never edited with its file tools aren't tracked.
3. **A subagent made the change.** Subagent edits usually aren't in your session's checkpoints.
4. **You or another session edited it.** Outside edits are normally not captured unless they hit files the current session also changed.
5. **It's a symlink or hard link.** Look for the `Restored the code, but skipped N files` warning.
6. **The snapshot is gone.** Only the 100 most recent checkpoints keep file snapshots, and the retention sweep removes them about 30 days after the session last saved one.
7. **Checkpointing is off.** Check `fileCheckpointingEnabled` and `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING`.

In every one of these cases, a git commit from before the task is the fallback.

## VS Code, the Agent SDK and headless runs

The [VS Code extension](/guides/getting-started/claude-code-vscode-extension) offers the same idea as three message actions: "Fork conversation from here", "Rewind code to here", and "Fork conversation and rewind code".

In the Agent SDK, file checkpointing is an option (`enableFileCheckpointing`) with a `rewindFiles()` method. From the CLI, the docs show a hidden flag for a [headless](/guides/configuration/claude-code-headless-mode) session:

```bash
CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING=true claude -p --resume <session-id> --rewind-files <checkpoint-uuid>
```

"The `--rewind-files` flag doesn't appear in `claude --help` output," so use the documented form exactly.
