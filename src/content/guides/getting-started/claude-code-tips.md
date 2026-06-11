---
title: "25 Claude Code Tips, Shortcuts, and Power Features"
description: "The 25 highest-leverage Claude Code tips — keyboard shortcuts, bash and memory shortcuts, session commands, model tricks, and the power features most people miss."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "tips", "shortcuts", "productivity", "getting-started"]
featured: false
summary: "The Claude Code features that compound: Esc to interrupt and double-Esc to rewind a message, ! for direct shell commands, @ to reference files, # to save memories, Shift+Tab to cycle permission modes, /compact with instructions, /resume to reattach sessions, piping into claude -p, and custom slash commands with $ARGUMENTS. 25 tips, each one sentence of setup and one habit to keep."
keyTakeaways:
  - "The input prefixes are the biggest unlock: ! runs shell directly, @ references files, # saves to memory, / runs commands — four characters that remove most friction."
  - "Esc interrupts without killing the session; double-Esc jumps back to edit an earlier message — course-correct instead of riding out a bad turn."
  - "Shift+Tab cycles permission modes (default → acceptEdits → plan) — plan mode before big changes is the cheapest insurance there is."
  - "Sessions are durable: --continue reattaches the last one per directory, /resume picks from history, /rewind undoes a wrong turn."
  - "Claude Code is a Unix citizen — pipe logs in (cat err.log | claude -p \"explain\"), script it with -p, and wire it into CI."
faq:
  - q: "How do I interrupt Claude Code without losing the session?"
    a: "Press Esc once — Claude stops mid-action and waits for new direction; the session and context stay intact. Press Esc twice to jump back to a previous message, edit it, and rerun from there."
  - q: "How do I run a shell command inside Claude Code?"
    a: "Prefix it with ! — e.g. !git status or !npm test. The command runs directly and its output lands in the conversation as context, which is usually exactly what you wanted the next prompt to know."
  - q: "How do I resume a previous Claude Code session?"
    a: "claude --continue reattaches the most recent session in the current directory; claude --resume (or /resume in-session) opens a picker of past sessions. Sessions are per-directory, so each project — and each git worktree — keeps its own history."
  - q: "How do I make Claude Code think harder on a problem?"
    a: "Include 'ultrathink' in the prompt for maximum reasoning on that turn, or toggle extended thinking for the session (Option+T on macOS, Alt+T elsewhere). Watch the reasoning with Ctrl+O if you want to see the work."
related: ["installing-claude-code", "what-is-claude-code", "claude-code-memory-context", "claude-code-settings-permissions", "claude-code-hooks", "claude-code-mcp-setup", "parallel-claude-code-worktrees", "prompt-patterns"]
---

Claude Code rewards depth: the default chat loop works on day one, but the operators who get 10x from it are using a different toolset — prefixes, modes, session surgery, and a few flags. Here are the 25 tips that pay off most, grouped by what they speed up.

## Input: the four prefixes

**1. `!` runs shell directly.** `!npm test` executes immediately and puts the output in context — no asking, no narration. The fastest way to feed Claude the ground truth before your next ask.

**2. `@` references files.** `Refactor @src/auth/session.ts to use the new client` attaches the file. `@` a directory for its listing; mention several files in one message to scope a task precisely.

**3. `#` saves a memory.** `# this repo uses pnpm, never npm` persists the fact to [memory](/guides/configuration/claude-code-memory-context) instead of dying with the session.

**4. `/` is the command palette.** Everything below with a slash is discoverable by typing `/` — and your own [custom commands](#automation-make-it-yours) join the list.

## Flow control

**5. `Esc` interrupts.** Claude stops mid-action; context survives. Watching it head somewhere wrong for 30 seconds and waiting politely is the most common wasted minute in agentic coding.

**6. Double-`Esc` rewinds the conversation.** Jump back to a previous message, edit it, rerun from there — fix the *prompt* instead of patching its consequences.

**7. `/rewind` undoes a wrong turn.** Roll code and conversation back to a checkpoint when an approach failed. Cheaper than asking the agent to un-dig its hole.

**8. Queue your next message.** You can keep typing while Claude works — queued messages deliver when the current step finishes. Batch your guidance instead of waiting at the spinner.

**9. `Shift+Tab` cycles permission modes.** `default → acceptEdits → plan` without touching settings. Trust rising? acceptEdits. Stakes rising? plan.

**10. Plan mode before big changes.** In [plan mode](/guides/configuration/claude-code-settings-permissions) Claude explores read-only and proposes; nothing is edited until you approve. The cheapest insurance in the product.

## Sessions

**11. `claude --continue` reattaches.** The most recent session in this directory, instantly. `/resume` opens the picker when you need an older one.

**12. Sessions are per-directory.** Each project — and each [git worktree](/guides/advanced/parallel-claude-code-worktrees) — keeps its own history. That's the mechanism behind clean parallel sessions.

**13. `/clear` between unrelated tasks.** Stale context degrades output quality and costs tokens. Clear freely — the old session stays reachable via `/resume`.

**14. `/compact` with instructions.** Don't wait for auto-compaction: at a milestone, `/compact keep the failing tests and the migration plan` compresses on *your* terms.

**15. `/context` shows the bill.** A visual map of what's consuming the window — usually the moment you discover three MCP servers you stopped using.

**16. `/export` and `/copy`.** Export the transcript to a file, or copy the last response — for the PR description, the ticket, the teammate who asked "what did it do?"

## Models and thinking

**17. Switch models per task.** `/model` mid-session: Opus-tier for the gnarly design, Sonnet for the long middle, Haiku for the mechanical sweep. See [Choosing the Right Model](/guides/getting-started/choosing-the-right-model).

**18. `opusplan` splits the difference.** Plan with Opus, execute with Sonnet — strong thinking where it matters, efficiency where it doesn't.

**19. "ultrathink" for the hard one.** Include it in a prompt to max out reasoning on that turn; toggle extended thinking session-wide with `Option+T` / `Alt+T`, and view the reasoning with `Ctrl+O`.

**20. Paste images.** Screenshots of broken UI, error dialogs, whiteboard diagrams — paste straight into the prompt (`Ctrl+V`; some terminals vary). A screenshot of the bug beats three sentences about it.

## Automation: make it yours

**21. Custom slash commands.** A Markdown file in `.claude/commands/` becomes `/your-command`; `$ARGUMENTS` interpolates what you pass. Any prompt you've typed twice deserves the third time to be one word — steal ideas from the [commands directory](/commands).

**22. Pipe into headless mode.** `cat error.log | claude -p "find the root cause"` — Claude Code as a Unix filter. `-p` is also the [CI entry point](/guides/advanced/claude-code-ci-github-actions), with JSON output when scripts consume the answer.

**23. Hooks make rules deterministic.** Format-after-edit, block-protected-paths, notify-when-waiting — [hooks](/guides/configuration/claude-code-hooks) run every time, no model memory required.

**24. `/statusline` and `/output-style`.** Put model, branch, and context usage in your status bar; tune output verbosity to taste. Small, but you look at it all day.

**25. `/doctor` first, then debug.** Installation weirdness, version drift, broken MCP connections — `/doctor` diagnoses the boring causes before you burn time on interesting theories. Its sibling `/usage` shows spend and plan limits before the invoice does.

> [!TIP]
> Don't adopt 25 habits at once. Take three — `!` for shell, `Esc` to interrupt, `/clear` between tasks — and add the rest as the friction they remove starts to itch. When something breaks instead of merely chafing, the [troubleshooting guide](/guides/troubleshooting/claude-code-troubleshooting) is the companion piece.
