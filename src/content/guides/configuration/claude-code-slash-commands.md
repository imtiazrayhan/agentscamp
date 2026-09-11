---
title: "Claude Code Slash Commands: The Built-in List and How to Write Your Own"
seoTitle: "Claude Code Slash Commands: Built-in List + Custom Commands"
description: "Claude Code's built-in slash commands grouped by job, and how to write your own as skills: file format, frontmatter, arguments, and plugin namespacing."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["claude-code", "slash-commands", "custom-commands", "skills", "configuration"]
summary: "Slash commands are shortcuts you type at the Claude Code prompt. Built-ins such as /compact, /model and /permissions control the session; custom commands are skills you trigger by name. Legacy .claude/commands/*.md files still work, but .claude/skills/<name>/SKILL.md is canonical, and disable-model-invocation: true makes it run only when you type it."
keyTakeaways:
  - "Type / or run /help to see every command your version supports; built-ins change between releases, so treat any published list as highlights."
  - "Custom commands merged into skills: .claude/commands/*.md still works as a legacy path, but .claude/skills/<name>/SKILL.md is canonical and runs as /<name>."
  - "A slash command is a skill with disable-model-invocation: true, so Claude never loads it on its own and it runs only when you type it."
  - "Arguments arrive through placeholders: one for the whole argument string, zero-based positional ones, or named ones declared in an arguments field."
  - "Plugin commands are always namespaced as /plugin-name:skill-name, so two plugins can ship the same command name without colliding."
  - "Promote a command to an auto-loading skill when Claude should apply it unprompted, and to a subagent when its output floods your context."
faq:
  - q: "What are slash commands in Claude Code?"
    a: "Slash commands are shortcuts you type at the prompt, starting with a forward slash. Built-in commands such as /clear, /compact and /model control the session, and custom commands are skills you trigger by name. Type / to see every command available in your version."
  - q: "How do I create a custom slash command in Claude Code?"
    a: "Create .claude/skills/<name>/SKILL.md in your project, or ~/.claude/skills/<name>/SKILL.md for every project, with YAML frontmatter and a Markdown body. Add disable-model-invocation: true so it runs only when you type /<name>. Legacy .claude/commands/<name>.md files still work too."
  - q: "Do .claude/commands files still work?"
    a: "Yes. Custom commands have been merged into skills, and .claude/commands/*.md files still work as a legacy path. The canonical location is now .claude/skills/<name>/SKILL.md, which also lets a command bundle supporting files next to it."
  - q: "How do I pass arguments to a Claude Code slash command?"
    a: "Type them after the command name. In the body, $ARGUMENTS expands to everything you typed, zero-based positional placeholders pick out single arguments, and names declared in an arguments frontmatter field expand to the matching position. Values follow shell-style quoting."
  - q: "How do I see all Claude Code commands?"
    a: "Type / at the prompt to open the command menu, and keep typing to filter it; Tab completes the name. /help lists every available command for the version you are running, including your custom skills."
  - q: "Can Claude run my slash commands on its own?"
    a: "Claude can load a skill whenever its description matches the task. Add disable-model-invocation: true to the frontmatter and only you can trigger it; set user-invocable: false for the opposite, a skill that only Claude can load."
sources:
  - title: "Claude Code commands reference"
    url: "https://code.claude.com/docs/en/commands"
    publisher: "Anthropic"
  - title: "Extend Claude with skills"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "Claude Code plugins"
    url: "https://code.claude.com/docs/en/plugins"
    publisher: "Anthropic"
  - title: "Claude Code quickstart"
    url: "https://code.claude.com/docs/en/quickstart"
    publisher: "Anthropic"
related: ["guide:skills-vs-agents-vs-commands", "command:create-slash-command", "guide:claude-code-plugins", "guide:claude-code-hooks", "guide:claude-code-skills-best-practices", "command:review-pr", "tool:claude-code", "guide:claude-code-tips"]
---

Slash commands are shortcuts you type at the [Claude Code](/tools/claude-code) prompt. Built-ins such as `/compact`, `/model` and `/permissions` control the session, and custom commands are skills you trigger by name. To write your own today, create `.claude/skills/<name>/SKILL.md` with `disable-model-invocation: true` and type `/<name>`; legacy `.claude/commands/*.md` files still work.

## What slash commands are

There are three kinds:

- **Built-in commands** ship with Claude Code and control the session, settings and account.
- **Custom commands** are skills you invoke by name. They can come from your project, from your home directory, or from a legacy `.claude/commands/` file.
- **Plugin commands** arrive with an installed plugin and are namespaced as `/plugin-name:skill-name`.

Type `/` at the prompt to open the menu, keep typing to filter it, and press Tab to complete a name. `/help` lists every available command, including your custom skills. The set changes between releases, so the menu on your machine beats any published list, this one included.

## Built-in commands worth knowing

These are highlights from Anthropic's commands reference, grouped by job. The list isn't complete, and commands change between releases; type `/` or run `/help` to see every command on your version. Square brackets mark optional arguments and angle brackets mark required ones.

| Job | Command | What it does |
|---|---|---|
| Session and context | `/clear [name]` | Start a fresh conversation |
| | `/compact [instructions]` | Free up context by summarizing |
| | `/context [all]` | Visualize context usage |
| | `/resume` | Return to an earlier conversation |
| | `/rewind` | Roll back code and conversation to a checkpoint |
| | `/btw [question]` | Ask a side question without affecting history |
| | `/branch [name]` | Branch the conversation to try another direction |
| | `/export [filename]` | Export the conversation as text |
| | `/copy [N]` | Copy assistant responses to the clipboard |
| | `/exit` | Exit Claude Code (or press Ctrl+D) |
| Model and planning | `/model [model]` | Switch models |
| | `/effort [level]` | Adjust reasoning depth: low to max, ultracode or auto |
| | `/plan [description]` | Enter plan mode for large changes |
| Config and permissions | `/config [key=value]` | Open settings, or set one directly |
| | `/permissions` | Configure tool access rules |
| | `/theme`, `/color [color]`, `/keybindings` | Appearance and shortcuts |
| Project and memory | `/init` | Initialize the project with a CLAUDE.md |
| | `/memory` | Edit and manage CLAUDE.md files |
| Tools, MCP and plugins | `/mcp` | Set up MCP server connections |
| | `/reload-plugins` | Reload plugins without restarting |
| Review | `/diff` | Review working-tree changes |
| | `/code-review [level] [--fix]` | Review the diff for bugs and cleanups |
| | `/security-review` | Check for vulnerabilities |
| Parallel and background | `/batch <instruction>` | Split a large change into parallel units |
| | `/background [prompt]` | Detach the session as a background agent |
| | `/fork [prompt]` | Copy the conversation into a new background session |
| | `/loop [interval] [prompt]` | Run a prompt on a schedule |
| Research and design | `/deep-research <question>` | Fan out web searches with cited sources |
| | `/design [brief]`, `/dataviz [request]` | UI mockups; chart and dashboard guidance |
| Account and diagnostics | `/login`, `/logout` | Manage authentication |
| | `/usage` | Check token and cost usage |
| | `/doctor` | Run setup diagnostics |
| | `/debug [description]` | Enable debug logging |
| | `/feedback`, `/bug` | Report an issue |
| | `/help` | List available commands and skills |

A few of these pay off on day one:
- `/clear` between unrelated tasks.
- `/compact` with instructions about what to keep, when context runs long.
- `/rewind` when an edit goes wrong, because it rolls back code and conversation together.

[Managing memory and context](/guides/configuration/claude-code-memory-context) covers `/compact`, `/context` and `/memory` in depth. [Settings and permissions](/guides/configuration/claude-code-settings-permissions) explains what `/permissions` edits.

## Custom commands are skills now

Custom commands have been merged into skills. `.claude/commands/*.md` files still work as a legacy path, but `.claude/skills/<name>/SKILL.md` is canonical, and every skill can be invoked as `/<name>`. What makes a skill behave like a classic slash command is one frontmatter line, `disable-model-invocation: true`, which stops Claude from loading it on its own.

| Where | Path | Invoked as |
|---|---|---|
| Project skill (canonical) | `.claude/skills/<name>/SKILL.md` | `/<name>` |
| Personal skill | `~/.claude/skills/<name>/SKILL.md` | `/<name>` |
| Project command (legacy) | `.claude/commands/<name>.md` | `/<name>` |
| Personal command (legacy) | `~/.claude/commands/<name>.md` | `/<name>` |
| Plugin | The plugin's `skills/` directory | `/plugin-name:skill-name` |

Project locations are committed and shared with your team; personal ones follow you into every repo. The command name comes from a different place in each format:
- A legacy command's name comes from its filename.
- A skill's command comes from its directory name. The `name` field only sets the label shown in skill listings, except in a plugin skill, where it replaces the command's last segment.

Monorepos can also keep `.claude/skills/` directories further down the tree.

For new work, write skills. A skill is a folder, so it can bundle scripts and templates next to `SKILL.md`. If you later want a command to auto-load, you delete one line instead of moving files.

## Anatomy of a command file

A command is YAML frontmatter plus a Markdown body. The frontmatter controls how it's invoked, and the body is the prompt Claude receives when you run it.

```markdown
---
name: pr-summary
description: Summarize the diff against a base branch as a PR description.
argument-hint: [base-branch]
disable-model-invocation: true
allowed-tools: Bash(git *) Read
---

Summarize the changes on this branch against $0.

1. Run git diff $0...HEAD and read the changed files.
2. Write an imperative title and a body with Summary and Test plan sections.
3. Don't push or open anything; print the draft.
```

Save that as `.claude/skills/pr-summary/SKILL.md` and run `/pr-summary main`. The body runs in your main conversation, as if you had pasted it, unless you set `context: fork`.

The frontmatter fields that shape invocation:

| Field | What it does |
|---|---|
| `name` | Display name in skill listings; defaults to the directory name, which sets the command except in plugin skills |
| `description` | What it does; Claude uses it to decide when to load the skill |
| `disable-model-invocation` | `true` means only you can invoke it |
| `user-invocable` | `false` means only Claude can invoke it |
| `allowed-tools` | Pre-approves tools for the turn that runs it |
| `argument-hint` | Shows the expected arguments in autocomplete |
| `arguments` | Names positional arguments for `$name` placeholders |
| `paths` | Glob patterns that limit when the skill activates |
| `context` | `fork` runs it in an isolated subagent context |
| `agent` | Which subagent type runs a forked skill, such as `Explore` |
| `background` | For forks; defaults to `true`, set `false` to get the result in the same turn |

The spellings are exact. The names use hyphens, not underscores (`disable-model-invocation`, `user-invocable`), and `context: fork` takes the literal value `fork`.

The legacy format is the same idea in a single file. A `.claude/commands/<name>.md` file takes its name from the filename, has optional frontmatter, and a body that reads `$ARGUMENTS`:

```markdown
---
description: Review a pull request and list findings by severity.
argument-hint: [PR number]
allowed-tools: Bash(gh *) Read
---

Review pull request #$ARGUMENTS. Run gh pr diff $ARGUMENTS, then list blockers, should-fix items and nits with file:line for each.
```

To convert it, move the file to `.claude/skills/<name>/SKILL.md` and add `disable-model-invocation: true`.

## Passing arguments

Whatever you type after the command name becomes arguments:

- `$ARGUMENTS` expands to the whole argument string as typed.
- `$0`, `$1` and so on pick out single arguments, counting from zero.
- Values follow shell-style quoting, so `/my-skill "hello world" second` puts `hello world` in `$0` and `second` in `$1`.
- An index with no matching argument is left in the text untouched.

Named arguments read better once there are two or more. Declare them in frontmatter and use them by name:

```yaml
---
argument-hint: [issue] [branch]
arguments: [issue, branch]
disable-model-invocation: true
---

Fix issue $issue on branch $branch.
```

Names map to positions in order, so `$issue` takes the first argument and `$branch` the second. Named and positional placeholders differ in a few ways:
- A named argument with nothing passed expands to an empty string, while a positional one is left untouched.
- To write a literal dollar sign, escape it with a backslash, as in `\$1.00`.
- A single-argument hint such as `argument-hint: [base-branch]` still lands in `$0`.

Always tell the body what to do when no argument arrives. The commands in our library ask one focused question instead of guessing.

## Run shell commands before Claude sees the prompt

A skill can inject live data before Claude reads it. Put `` !`git diff HEAD` `` in the body and the command runs when the skill loads. Its output replaces the placeholder, so Claude starts from the current diff instead of spending a turn fetching it. For multi-line commands, use a fenced code block marked with `!`.

Three substitutions help a skill find its surroundings:
- `${CLAUDE_SKILL_DIR}` is the skill's own directory, which is useful for bundled scripts.
- `${CLAUDE_PROJECT_DIR}` is the project root.
- `${CLAUDE_SESSION_ID}` is the current session.

Injected commands run on your machine as you, so read them before adopting someone else's command. The [skills security checklist](/guides/ai-safety/are-claude-skills-safe) lists what to look for.

## Project vs personal commands, and namespacing

Put a command in the project when the team should share it and it depends on the repo, such as build steps, review checklists or release flows. Put it in `~/.claude/skills/` when it's your own habit and works anywhere.

Plugins solve the naming-collision problem, because plugin skills are always namespaced as `/plugin-name:skill-name`:
- A plugin named `my-plugin` with a skill `hello` runs as `/my-plugin:hello`, so two plugins can both ship a `review` command.
- The prefix comes from the `name` field in `plugin.json`.
- A plugin can still carry a legacy `commands/` directory, but `skills/` is canonical.

After editing a plugin, `/reload-plugins` picks up the change without a restart. [Claude Code plugins](/guides/configuration/claude-code-plugins) covers building and installing them. MCP servers are managed separately through `/mcp`; see [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

## Letting Claude invoke commands, and turning that off

By default a skill works both ways: you can type it, and Claude can load it through the Skill tool whenever its `description` matches the task. Two frontmatter flags split those paths:

| Frontmatter | You can type `/name` | Claude can load it |
|---|---|---|
| Neither flag | Yes | Yes, when the description matches |
| `disable-model-invocation: true` | Yes | No |
| `user-invocable: false` | No | Yes |

`disable-model-invocation: true` is the right default for anything with side effects, such as committing, pushing, deploying or opening PRs, because you decide when it runs. It has one cost: a subagent can't preload such a skill through its `skills` field, because preloading counts as model invocation.

To change a skill's behavior without editing its file, add `skillOverrides` to `.claude/settings.json`:

```json
{
  "skillOverrides": {
    "my-skill": "off",
    "another-skill": "user-invocable-only"
  }
}
```

## Five ready-made commands from our library

If you'd rather start from working examples, these AgentsCamp commands cover loops most developers repeat daily. Each page shows the full file:

1. **[Review PR](/commands/review/review-pr)**, run as `/review-pr [PR number]`, reviews a pull request end to end. It:
   - pulls metadata, diff and CI status through `gh`;
   - checks out the branch and evaluates correctness, security and style against the PR's stated goal;
   - tags each finding blocker, should-fix or nit, with `file:line` and a fix;
   - ends with a verdict and never merges.
2. **[Commit](/commands/git/commit)** inspects status, diffs and recent log. It stages only the files that belong to one logical change and writes a Conventional Commits message with an imperative subject of 72 characters or fewer. It flags secrets instead of staging them, and never pushes unless asked.
3. **[Create PR](/commands/git/create-pr)**, run as `/create-pr [base branch or notes]`, opens a pull request. It confirms the base branch, pushes if needed, and writes a title and a body with summary, changes, testing and risk. It opens the PR through `gh` and reports the URL, without merging.
4. **[Fix Failing Test](/commands/testing/fix-failing-test)**, run as `/fix-failing-test [test name or path]`, reproduces the failure and traces it to the code under test. Before editing, it states whether the test or the code is wrong. Then it applies the smallest fix to the correct side and reruns the suite, never weakening an assertion.
5. **[Explain Error](/commands/analyze/explain-error)** takes an error message or stack trace. It finds the first in-repo frame, names the root cause one level below the message, and confirms it with read-only checks. It reports a specific fix, or ranked candidates, and changes no files.

Copy a file from its page, or install from the terminal. The command below installs into your project's `.claude/` directory by default; add `-g` to install into `~/.claude/`.

```bash
npx agentscamp add commands/review-pr
```

To build your own, [Create Slash Command](/commands/workflow/create-slash-command) scaffolds a new command file from a one-line description.

## When a command should become a skill or a subagent

Commands are the manual end of Claude Code's extension model. These signals say it's time to move:

| Signal | Move to |
|---|---|
| You type the same prompt every day | Keep it a command with `disable-model-invocation: true` |
| Claude should apply it without being asked | An auto-loading skill: drop the flag, sharpen `description`, add `paths` |
| Its intermediate output floods your context | A [subagent](/glossary/subagent), or `context: fork` on the skill |
| It must happen every time, no exceptions | A [hook](/guides/configuration/claude-code-hooks), which runs deterministically |

The deciding questions are who pulls the trigger and whether the work needs its own context window. [Skills vs agents vs commands](/guides/skills/skills-vs-agents-vs-commands) works through that decision with examples. When you are ready, [Create Skill](/commands/workflow/create-skill) and [Create Subagent](/commands/workflow/create-subagent) scaffold the next step.

## Next steps

Start with one command for the prompt you retype most. Commit it under `.claude/skills/`, and add an `argument-hint` so teammates can see how to call it. Then:

- Read [Claude Code skills best practices](/guides/skills/claude-code-skills-best-practices) for descriptions and bodies that hold up as the library grows.
- Use [Claude skills not working?](/guides/troubleshooting/claude-skills-not-working) when a command doesn't appear in the menu.
- Browse [25 Claude Code tips](/guides/getting-started/claude-code-tips) for the shortcuts around the command menu.
