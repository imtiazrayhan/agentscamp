---
title: "9 Best Claude Skills for Onboarding to a New Codebase"
description: "Claude skills and commands for getting productive in an unfamiliar repo: settings audits, dev containers, CLAUDE.md, diagrams, code explanations, data-flow traces, and git history."
author: "Imtiaz Rayhan"
date: "2026-11-16"
reviewed: 2026-11-22
color: "green"
depth: standard
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["claude-skills", "onboarding", "codebase", "claude-md", "git", "best-of"]
seoTitle: "9 Best Claude Skills for Onboarding to a New Codebase"
seoDescription: "The best Claude skills for learning an unfamiliar codebase: dev containers, CLAUDE.md, architecture diagrams, /explain-code, data-flow traces, and git blame."
keywords: ["claude skills for onboarding", "understand a new codebase with claude code", "claude code unfamiliar codebase", "explain code claude command", "claude md for a new repo", "codebase onboarding ai"]
summary: "On a new repo, audit its Claude settings with claude-settings-auditor, set up the environment with devcontainer-designer, and write a CLAUDE.md with agent-memory-designer. Map it with architecture-diagram-generator, read code with /explain-code and /trace-data-flow, ask why with git-blame-investigator, and leave a guide with onboarding-guide-writer."
keyTakeaways:
  - "Read a cloned repo's .claude/settings.json, .mcp.json, and hook scripts before the first session; claude-settings-auditor reports what you would be trusting."
  - "Get a working environment and accurate commands before reading code: version drift and wrong test commands waste more onboarding time than unfamiliar logic."
  - "Ask for one diagram per question and one explanation per symbol; a container map, one sequence diagram, and /explain-code on the entry point beat a tour of every folder."
  - "Before deleting code that looks pointless, find the commit that introduced it; git-blame-investigator sees past formatting and rename commits."
  - "None of these picks edits application code; the ones that write produce configuration, documentation, or diagrams for you to review."
faq:
  - q: "How do I use Claude Code to understand a new codebase?"
    a: "Work from the outside in. Run architecture-diagram-generator for a container view of the services and who calls whom, then /explain-code on the main entry point and /trace-data-flow on one important field. When a line looks strange, git-blame-investigator finds the commit and pull request that explain it. Before any of that, make sure the project runs and has an accurate CLAUDE.md."
  - q: "Should I write a CLAUDE.md for a repo I just joined?"
    a: "Yes, if it has none or the existing one is stale. agent-memory-designer reads the manifest and CI config for the real build, test, and lint commands, writes a five-line architecture map and the non-obvious gotchas, and cuts anything transient, secret, or derivable from the code. Personal preferences go in your user-level ~/.claude/CLAUDE.md, not the shared project file."
  - q: "What does /explain-code do that a plain question does not?"
    a: "It always reads the actual source first, lists candidates and asks when a symbol matches several definitions, and returns a fixed structure: a two- or three-sentence summary, an execution-order walkthrough, an inputs and outputs table covering side effects and errors, and edge cases. It never edits code and says when it is unsure how something behaves."
  - q: "Is it safe to open a cloned repo with Claude Code?"
    a: "Check first. A repository can carry a .claude/settings.json with broad permission allows, an .mcp.json that starts servers, and hook scripts that run shell commands. claude-settings-auditor computes the effective configuration across every settings layer and reports risky rules, hooks, and MCP servers with a safer replacement for each, without changing files unless you ask."
  - q: "The repo has AGENTS.md or Cursor rules but no CLAUDE.md. What should I do?"
    a: "Use instruction-file-migrator to convert the existing file into CLAUDE.md with the same wording, keeping always-on rules separate from path-scoped ones and listing every rule that has no one-to-one equivalent. If there is no instruction file at all, agent-memory-designer writes one from the repository."
sources:
  - title: "Common workflows"
    url: "https://code.claude.com/docs/en/common-workflows"
    publisher: "Anthropic"
  - title: "How Claude remembers your project"
    url: "https://code.claude.com/docs/en/memory"
    publisher: "Anthropic"
  - title: "Settings files and precedence"
    url: "https://code.claude.com/docs/en/settings"
    publisher: "Anthropic"
  - title: "Dev Container metadata reference"
    url: "https://containers.dev/implementors/json_reference/"
    publisher: "Development Containers"
  - title: "git-blame Documentation"
    url: "https://git-scm.com/docs/git-blame"
    publisher: "Git"
  - title: "git-log Documentation"
    url: "https://git-scm.com/docs/git-log"
    publisher: "Git"
  - title: "About Mermaid"
    url: "https://mermaid.js.org/intro/"
    publisher: "Mermaid"
related: ["skill:claude-settings-auditor", "skill:devcontainer-designer", "skill:agent-memory-designer", "skill:architecture-diagram-generator", "command:explain-code", "command:trace-data-flow", "skill:git-blame-investigator", "skill:monorepo-boundary-auditor", "skill:onboarding-guide-writer", "skill:instruction-file-migrator", "agent:context-engineer", "agent:documentation-engineer", "guide:claude-md-best-practices", "guide:best-claude-skills-for-git", "guide:best-claude-skills-for-documentation", "guide:how-to-install-claude-skills", "glossary:claude-md"]
---

The best Claude skills for onboarding to a new codebase answer the questions a newcomer asks in order: is it safe to open, can I run it, what are the real commands, how do the pieces fit, what does this code do, where does this value go, and why is this line here. Asking Claude to "explain the repo" in one prompt gets you a tour of folder names. Asking each of those questions with the right skill gets you evidence: a verified environment, a diagram drawn from the code, and explanations that cite files and commits.

The nine picks below follow a first day in an unfamiliar repository. Seven are skills and two are slash commands. None of them edits application code; the ones that write produce configuration, documentation, or diagrams you review before committing.

## The summary table

| Pick | Type | Question it answers | Writes files? |
| --- | --- | --- | --- |
| [claude-settings-auditor](/skills/workflow/claude-settings-auditor) | Skill | What does this repo's Claude config allow? | No, proposes a diff |
| [devcontainer-designer](/skills/workflow/devcontainer-designer) | Skill | How do I get a working environment? | Config files only |
| [agent-memory-designer](/skills/workflow/agent-memory-designer) | Skill | What are the real commands and rules? | A CLAUDE.md draft |
| [architecture-diagram-generator](/skills/docs/architecture-diagram-generator) | Skill | How do the pieces fit? | Mermaid diagrams |
| [/explain-code](/commands/docs/explain-code) | Command | What does this file or function do? | No |
| [/trace-data-flow](/commands/analyze/trace-data-flow) | Command | Where does this value come from and go? | No |
| [git-blame-investigator](/skills/git/git-blame-investigator) | Skill | Why does this line exist? | At most an ignore-revs file and its git config |
| [monorepo-boundary-auditor](/skills/workflow/monorepo-boundary-auditor) | Skill | Which package may depend on which? | No |
| [onboarding-guide-writer](/skills/docs/onboarding-guide-writer) | Skill | How does the next person get started? | A contributor guide |

## 1. claude-settings-auditor: check what you are trusting

A cloned repository can bring its own `.claude/settings.json`, an `.mcp.json`, and hook scripts. [claude-settings-auditor](/skills/workflow/claude-settings-auditor) reads every settings layer (user, project, local, and managed), applies precedence and the deny, ask, allow order, and reports the effective configuration: permissions, active hooks by event, MCP servers by scope, and toggles such as `defaultMode` and `enableAllProjectMcpServers`. It flags blanket allows like a bare `Bash`, missing deny rules for `.env` files and credentials, `bypassPermissions` as a default outside a container, hook scripts it has actually read, and rules that can never match.

Findings come with the file, the line, and an exact replacement rule, plus a corrected settings diff it does not apply unless you ask. Its advice for a team file fits a newcomer well: suggest fixes to the checked-in settings as a pull request, and keep personal loosening in `settings.local.json`. [Claude Code settings and permissions](/guides/configuration/claude-code-settings-permissions) explains the layers, and the [MCP development roundup](/guides/skills/best-claude-skills-for-mcp-development) covers deeper reviews of the repo's MCP servers.

## 2. devcontainer-designer: one command to a working environment

[devcontainer-designer](/skills/workflow/devcontainer-designer) reads the files that pin the runtime (`.nvmrc`, `engines`, `.python-version`, `go.mod`, `.tool-versions`, `rust-toolchain.toml`) and the lockfile that names the package manager, then greps `.env.example`, config, and compose files for the services the app expects, such as a database, a cache, or a queue. It writes a `devcontainer.json`, plus a Dockerfile or `docker-compose.yml` when needed, with every image pinned to the version the repository targets rather than `:latest`.

Services come up together with named data volumes and service-hostname connection strings, the package manager's cache survives rebuilds, and a `postCreateCommand` installs dependencies and runs setup so the project works on first open. Secrets are injected from your host environment and never baked into the image. If the real problem is unpinned dependencies with no lockfile, the skill says to fix that first. It writes config files only; it does not build images or start containers.

## 3. agent-memory-designer: a CLAUDE.md with the real commands

[agent-memory-designer](/skills/workflow/agent-memory-designer) reads the build manifest and the CI workflow to find the commands CI actually runs, so the memory never says `npm test` when the script is `npm run test:unit`. It maps the architecture in five lines or fewer (entry points, the directories that matter, and the one layering rule that breaks the build if violated) and mines READMEs, CI steps, and comments for gotchas you cannot infer at a glance, such as a generated file that must be regenerated or a test that needs a running service.

Every candidate fact is sorted into keep or cut: stable commands, conventions, and hard rules stay; transient task state, secrets, and anything derivable from the code go. Repo facts go in the project `CLAUDE.md`, personal habits in `~/.claude/CLAUDE.md`, and machine-local notes in `CLAUDE.local.md`. The result is a draft of about 50 lines or fewer with a note on what will make it go stale. If the repository already has an AGENTS.md or Cursor rules instead, [instruction-file-migrator](/skills/workflow/instruction-file-migrator) converts them while keeping the wording and reporting every rule that does not map one-to-one. [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) covers what belongs in the file.

## 4. architecture-diagram-generator: the map, drawn from the code

[architecture-diagram-generator](/skills/docs/architecture-diagram-generator) lists onboarding as its first use case. Ask for a container view first: it globs for entry points, `docker-compose.yml`, Terraform and Kubernetes manifests, and workspace configs, greps for HTTP clients, queue and topic names, and `*_URL` environment variables, and draws only the services and edges it found, labeled with the real protocol and with external systems marked as a trust boundary.

Then ask for a sequence diagram of the one flow you need to change, such as checkout or login, including its error branches. The skill splits a container view that grows past about a dozen nodes into a map and a zoom-in, and it captions every diagram with what it does not show, which tells you where to look next.

## 5. /explain-code: one file or function at a time

[/explain-code](/commands/docs/explain-code) takes a file path, a symbol, or a line range. For a symbol it searches for the definition; if several match, it lists the candidates and asks instead of guessing. It reads the actual source before writing a word, then returns a short summary, a walkthrough in execution order, an inputs and outputs table covering return values, side effects, and errors, and a list of edge cases and gotchas.

It uses the project's own names, matches depth to complexity, says plainly when it is unsure how something behaves, and never edits the code. If it spots a bug, the bug goes in the gotchas section. Start with the entry point the diagram identified, then work inward.

## 6. /trace-data-flow: follow a value from source to sink

[/trace-data-flow](/commands/analyze/trace-data-flow) follows one value, such as a request field, a config key, a database column, or an event property, through the codebase. It builds the alias set first, because the same value is often spelled `shipping_address` in the column, `shippingAddress` in the model, and something else in the JSON, then finds every source, every validation, transform, and rename, and every sink: persistence, outbound calls, and logs.

The result is a directed flow map where every hop carries a `file:line` citation and the value's type at that point, followed by tagged observations such as validation gaps, unit or type mismatches, and sensitive data written to logs. It is read-only and reconstructs the flow from source, not from a live trace. For a newcomer it is the fastest way to learn the layers a request crosses.

## 7. git-blame-investigator: why the code is the way it is

[git-blame-investigator](/skills/git/git-blame-investigator) answers the question `git blame` cannot: why a line exists. It blames the exact range with `-w` and `-C -C -M` to follow moved code, re-blames past formatting and rename commits with `--ignore-rev`, reads the full commit message, diff, and pull request, and uses `git log -L` and the pickaxe (`-S`, `-G`) to see when a value or call first appeared. When behavior changed and the culprit is not obvious, it uses `git bisect`.

It ends with a verdict tied to a commit: safe to remove, do not touch, or needs a test first. It never concludes "safe to remove" without having found the original intent, which is the right rule for anyone new to a codebase. The [git skills roundup](/guides/skills/best-claude-skills-for-git) covers the rest of the history toolkit.

## 8. monorepo-boundary-auditor: which package may depend on which

In a monorepo, the folder tree says little about the rules. [monorepo-boundary-auditor](/skills/workflow/monorepo-boundary-auditor) reads the workspace configuration, package manifests, path aliases, and ownership files, builds the dependency graph from both declared dependencies and real imports, and infers the intended layers. It reports deep imports into another package's internals, dependency cycles, packages with no owner, and build tasks that miss dependencies.

For a newcomer the inventory alone is worth it: every package with its layer, owner, entry point, and dependencies, plus a dependency graph or Mermaid diagram. It only reads; the repair plan it proposes is for the maintainers.

## 9. onboarding-guide-writer: leave the trail for the next person

[onboarding-guide-writer](/skills/docs/onboarding-guide-writer) reconstructs the golden path from clone to a first verified change using only commands that exist in the manifest and CI configuration, and flags any step with no backing script rather than inventing one. It lists prerequisites with pinned versions, says which environment variables need a value from a teammate, and ends the path with a small reversible change and the command that proves it worked.

Around that it adds a one-screen architecture orientation with the three to five things that surprise newcomers, the real branch, commit, and CI conventions, and troubleshooting written as symptom then fix. Run it at the end of your first week: you have just collected every gotcha it asks for, and the result is a `CONTRIBUTING.md` or `docs/onboarding.md` the next person can follow.

## Agents that pair with them

Two agents help when the questions get larger. The [context-engineer](/agents/meta-orchestration/context-engineer) agent decides what an agent should always carry in context versus look up on demand, which matters once your CLAUDE.md starts growing past a screen; it reads only and returns include, exclude, retrieve, and compact decisions with a token budget. The [documentation-engineer](/agents/developer-tools/documentation-engineer) agent writes and audits READMEs, how-to guides, API references, and runbooks where every claim traces to code, config, or a command, and it is the right follow-up when the onboarding guide reveals docs that have drifted.

## Recommended onboarding stack

Install the first-day set into the repository you are joining:

```bash
npx agentscamp add skills/claude-settings-auditor
npx agentscamp add skills/agent-memory-designer
npx agentscamp add skills/architecture-diagram-generator
npx agentscamp add commands/explain-code
npx agentscamp add commands/trace-data-flow
npx agentscamp add skills/git-blame-investigator
```

Add the environment and hand-off pieces once you are past the first read:

```bash
npx agentscamp add skills/devcontainer-designer
npx agentscamp add skills/onboarding-guide-writer
```

Each command installs into the current project's `.claude/` directory; add `-g` to install into `~/.claude/` so the set follows you to the next repository. Manual copying, plugins, and team distribution are covered in [how to install Claude skills](/guides/skills/how-to-install-claude-skills).

The settings auditor is the one worth installing with `-g`, so it is already available the next time you clone something. Run it on a fresh clone before you start working in it.

## Continue exploring

- [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) — What belongs in project memory and what to leave out.
- [9 Best Claude Skills for Git](/guides/skills/best-claude-skills-for-git) — Commits, undo, PR descriptions, rebasing, conflicts, blame, and changelogs.
- [7 Best Claude Skills for Documentation](/guides/skills/best-claude-skills-for-documentation) — READMEs, OpenAPI docs, runbooks, onboarding guides, ADRs, and diagrams.
- [9 Best Claude Skills for System Design](/guides/skills/best-claude-skills-for-system-design) — Specs, design docs, ADRs, diagrams, threat models, and migrations.
- [How to install Claude skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
