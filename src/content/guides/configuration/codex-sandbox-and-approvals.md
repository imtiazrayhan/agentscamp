---
title: "Codex CLI Sandbox and Approvals in 2026: Auto-Approve, Full Access, Web Search"
seoTitle: "Codex CLI Sandbox & Approvals (2026): Auto-Approve, Web Access"
description: "Set Codex CLI's approval policy and sandbox mode: auto-approve without --full-auto, safe full access, network access, web search, profiles, and fixes."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["workflow-prompting", "ai-agents-systems"]
audience: ["developers", "security"]
tags: ["codex", "codex-cli", "sandbox", "approvals", "security", "configuration"]
summary: "Codex CLI has two independent dials: the approval policy (on-request, never, or granular) sets when it asks, and the sandbox (read-only, workspace-write, danger-full-access) sets what commands can touch. --full-auto is gone as of codex-cli 0.154.0; use --approve-for-me for reviewed auto-approval, and set network_access = true for command networking."
keyTakeaways:
  - "Approvals and sandbox are separate dials: the approval policy decides when Codex asks, and the sandbox decides what its commands can technically reach."
  - "Only on-request and never are valid for the -a flag. untrusted was retired on August 20, 2026 and now stops Codex from starting; on-failure is read as on-request."
  - "--full-auto is rejected by codex-cli 0.154.0. Use --approve-for-me for automatic review, or --sandbox workspace-write with codex exec."
  - "Network is off by default. Turn it on for workspace-write with network_access = true under [sandbox_workspace_write]."
  - "Web search is separate from network access: it defaults to cached, --search makes it live for one interactive run, and full access switches it to live."
  - "Keep --dangerously-bypass-approvals-and-sandbox (alias --yolo) for containers and VMs you can throw away."
howtoSteps:
  - name: "Check what is active"
    text: "Start codex in the project and run /status to see the approval policy and writable roots, or /debug-config to see which config layer set each value."
  - name: "Pick the approval policy"
    text: "Use on-request for interactive work and never for unattended runs. Pass --approve-for-me, or set approvals_reviewer to auto_review, to let a reviewer model answer the prompts."
  - name: "Pick the sandbox mode"
    text: "Use read-only for reviews, workspace-write for everyday coding, and danger-full-access only inside a container or VM that already isolates Codex."
  - name: "Open the network only when the task needs it"
    text: "Set network_access = true under [sandbox_workspace_write] in ~/.codex/config.toml, or pass --config sandbox_workspace_write.network_access=true for a single run."
  - name: "Choose a web search mode"
    text: "Leave web_search at cached, pass --search for live results in one interactive session, or set it to disabled to remove the tool."
  - name: "Save the combination as a profile"
    text: "Put the settings as top-level keys in ~/.codex/<name>.config.toml and select them with --profile <name>. Profile tables inside config.toml have been ignored since 0.134.0."
  - name: "Verify with harmless actions"
    text: "Ask Codex to write a scratch file and fetch a URL, and confirm each one succeeds or is blocked the way you intended before trusting the setup with real work."
faq:
  - q: "How do I make Codex CLI auto-approve commands?"
    a: "Run codex --approve-for-me. It keeps the workspace-write sandbox and on-request approvals but routes eligible approval requests to an automatic reviewer, which approves or denies each one; after a denial, Codex looks for a safer path or stops to ask you. Setting the approval policy to never removes prompts entirely, and anything the sandbox blocks goes straight back to the model as a failure."
  - q: "Does codex --full-auto still work?"
    a: "No. codex-cli 0.154.0 (September 2026) rejects --full-auto on both codex and codex exec with an unexpected-argument error, even though some OpenAI doc pages still describe it as a deprecated flag that only warns. Use --sandbox workspace-write --ask-for-approval on-request interactively, or codex exec --sandbox workspace-write in scripts."
  - q: "How do I give Codex CLI web access?"
    a: "There are two switches. For commands such as curl or package installs, set network_access = true under [sandbox_workspace_write]. For the model's own web search, pass --search for live results in an interactive session, or set web_search to live in your config."
  - q: "What is the default sandbox in Codex CLI?"
    a: "It depends on folder trust. A folder with no trust decision starts read-only, and a trusted folder gets workspace-write with on-request approvals; network access is off in both. codex exec starts read-only unless you pass --sandbox or your config sets sandbox_mode."
  - q: "Can codex exec ask for approval?"
    a: "No. codex exec fixes the approval policy at never, rejects the -a flag, and returns failures to the model instead of pausing. Grant the access the job needs up front with --sandbox, or pass --approve-for-me to route approval requests to the automatic reviewer."
sources:
  - title: "Agent approvals and security"
    url: "https://learn.chatgpt.com/docs/agent-approvals-security"
    publisher: "OpenAI"
  - title: "Sandbox"
    url: "https://learn.chatgpt.com/docs/sandboxing"
    publisher: "OpenAI"
  - title: "Configuration reference"
    url: "https://learn.chatgpt.com/docs/config-file/config-reference"
    publisher: "OpenAI"
  - title: "Advanced configuration"
    url: "https://learn.chatgpt.com/docs/config-file/config-advanced"
    publisher: "OpenAI"
  - title: "Non-interactive mode"
    url: "https://learn.chatgpt.com/docs/non-interactive-mode"
    publisher: "OpenAI"
  - title: "Web search"
    url: "https://learn.chatgpt.com/docs/web-search"
    publisher: "OpenAI"
  - title: "Auto-review"
    url: "https://learn.chatgpt.com/docs/sandboxing/auto-review"
    publisher: "OpenAI"
  - title: "openai/codex releases"
    url: "https://github.com/openai/codex/releases"
    publisher: "OpenAI on GitHub"
related: ["tool:codex-cli", "guide:codex-config-toml", "guide:codex-troubleshooting", "guide:codex-agents-md", "guide:codex-mcp-setup", "guide:claude-code-vs-codex-cli", "guide:claude-code-settings-permissions", "guide:sandboxing-ai-generated-code"]
---

[Codex CLI](/tools/codex-cli) gives you two separate dials: the **approval policy** decides when Codex stops to ask, and the **sandbox mode** decides what its commands can technically reach. For hands-off local coding today, run `codex --approve-for-me` (workspace-write plus automatic approval review), because `--full-auto` no longer exists. Keep full access for a container or VM you can throw away.

> [!NOTE]
> Everything below reflects codex-cli 0.154.0 (released September 9, 2026) and OpenAI's current docs, which moved from developers.openai.com to learn.chatgpt.com. Flags change often, so `codex --help` is the final word on what your build accepts.

## The two dials: approvals and sandbox

You can combine the two freely: OpenAI's docs note that `-a never` works with every `--sandbox` mode, so turning prompts off doesn't widen access on its own. The sandbox covers everything Codex spawns, so `git`, package managers and test runners inherit the same boundary as its file edits.

To see what's active, run `/status` inside a session; it shows the model, approval policy and writable roots. `/debug-config` shows which config layer, and which admin requirement, set each value.

### Approval policies

| Policy | What it does | Where you set it |
|---|---|---|
| `on-request` | Works inside the sandbox, asks to go beyond it | `-a` or config |
| `never` | Never asks; failures go straight back to the model | `-a` or config |
| `{ granular = { ... } }` | Chosen prompt types stay interactive; the rest are auto-rejected | Config only |
| `on-failure` | Deprecated; read as `on-request` | Config only |
| `untrusted` | Retired in 0.149.0 (August 20, 2026); Codex refuses to start | Remove it |

The `-a` / `--ask-for-approval` flag accepts only `on-request` and `never`, and only interactive `codex` has it. A separate key, `approvals_reviewer`, decides who answers prompts: `"user"` (the default) or `"auto_review"`, a reviewer model. Auto-review only matters when approvals are interactive, and its extra model calls can add to your Codex usage.

The granular form covers five prompt types: sandbox approvals, execpolicy-rule prompts, MCP prompts, `request_permissions` prompts and skill-script approvals. A type set to `false` is rejected without being shown to you. This is the docs' example, commented out:

```toml
# approval_policy = { granular = {
#   sandbox_approval = true,
#   rules = true,
#   mcp_elicitations = true,
#   request_permissions = false,
#   skill_approval = false
# } }
```

### Sandbox modes

| Mode | What commands can do | Network |
|---|---|---|
| `read-only` | Read files; edits and commands need approval | Off |
| `workspace-write` | Read, edit the workspace, run routine commands | Off unless enabled |
| `danger-full-access` | Anything; no filesystem or network boundary | On |

In `workspace-write`, the workspace is the current directory plus these writable roots:
- temporary directories such as `/tmp` and `$TMPDIR`;
- extra roots listed in `writable_roots`;
- any `--add-dir` paths.

Three paths stay read-only, recursively, inside every writable root: `.git`, `.agents` and `.codex`. That is why `git commit` can still trigger an approval prompt in an otherwise hands-off session.

### How each OS enforces the sandbox

| Platform | Mechanism | Watch for |
|---|---|---|
| macOS | Seatbelt, via `sandbox-exec` | Works out of the box |
| Linux | `bwrap` plus `seccomp` | Install bubblewrap first |
| WSL2 | The Linux sandbox | WSL1 unsupported since 0.115 (March 2026) |
| Windows | `elevated` or `unelevated` sandbox | Prefer `elevated` |
| Docker | The Linux sandbox, if the container allows it | Blocked namespaces or seccomp break it |

On Linux, install bubblewrap before the first run:

```bash
sudo apt install bubblewrap
sudo dnf install bubblewrap
```

Codex uses the first `bwrap` on `PATH`, or a bundled helper that needs unprivileged user namespaces. On Ubuntu 24.04, load the `bwrap-userns-restrict` AppArmor profile. Landlock survives only as the deprecated `use_legacy_landlock` feature, off by default.

On native Windows, pick the mode in config:

```toml
[windows]
sandbox = "unelevated" # or "elevated"
# sandbox_private_desktop = true  # default; set false only for compatibility
```

`elevated` is the stronger mode, with dedicated lower-privilege sandbox users and firewall rules. `unelevated` is a weaker fallback that runs commands with a restricted token derived from your own user.

### What you get by default

The defaults depend on whether the folder has a trust decision:

| Folder state | Default sandbox | Default approvals |
|---|---|---|
| No trust decision yet | `read-only` | `on-request` |
| Trusted | `workspace-write` | `on-request` |
| Marked `trust_level = "untrusted"` | `workspace-write` | Commands need approval unless an exec-policy rule allows them |

Other defaults to know:
- **On launch**, Codex recommends Auto for version-controlled folders and `read-only` otherwise. It may stay read-only until you trust the folder through the onboarding prompt or `/permissions`.
- **Native Windows** falls back to `read-only` when the Windows sandbox is disabled.
- **`codex exec`** starts read-only unless you pass `--sandbox`, or your config sets `sandbox_mode`.

## Presets in the /permissions picker

Inside a session, `/permissions` ("choose what Codex is allowed to do") switches between presets:

| Label in 0.154.0 | Sandbox | Approvals | Reviewer |
|---|---|---|---|
| Ask for approval | `workspace-write` | `on-request` | You |
| Approve for me | `workspace-write` | `on-request` | Auto-review |
| Full Access | `danger-full-access` | `never` | You |
| Read Only | `read-only` | `on-request` | You |

OpenAI's docs still call the first preset **Auto**. The 0.154.0 TUI labels it *Ask for approval*, as the desktop app and IDE menus do. The picker also lists any custom permission profiles you define. Codex 0.154.0 has no `/approvals` command, so older instructions that mention it now point to `/permissions`.

## Auto-approve and full access after --full-auto

### What happened to --full-auto

Tutorials that use `codex --full-auto` or `codex exec --full-auto` are out of date as of codex-cli 0.154.0 (September 2026). Both now fail with `error: unexpected argument '--full-auto' found`.
- The `codex exec` flag was removed in 0.147.0 on August 7, 2026. The release note says to use `--sandbox workspace-write` instead.
- Some OpenAI doc pages still say the flag only prints a deprecation warning. The binary disagrees.

### The flags that exist today

| You want | Run | Result |
|---|---|---|
| The old full-auto feel, interactive | `--sandbox workspace-write --ask-for-approval on-request` | The Auto preset |
| Auto-approval with a safety check | `--approve-for-me` | Reviewer answers prompts |
| No prompts, still sandboxed | `--sandbox workspace-write --ask-for-approval never` | Blocked actions fail back to the model |
| The old `codex exec --full-auto` | `codex exec --sandbox workspace-write "<task>"` | Edits, never asks |
| No sandbox, no prompts | `--dangerously-bypass-approvals-and-sandbox` | Full access, `never` |

```bash
codex --sandbox workspace-write --ask-for-approval on-request
codex --sandbox workspace-write --ask-for-approval on-request -c approvals_reviewer=auto_review
codex --approve-for-me
```

`--approve-for-me` (hidden alias `--not-so-yolo`) arrived in 0.147.0. It sets three values at once: `approval_policy = "on-request"`, `approvals_reviewer = "auto_review"` and `sandbox_mode = "workspace-write"`. For that reason it conflicts with `--sandbox` and with the bypass flag. It also works on `codex exec`. Headless runs normally hard-code approvals to `never`, but switch to review when the reviewer is `auto_review`. Auto-review decides prompts only; it never moves the sandbox boundary.

> [!WARNING]
> `--dangerously-bypass-approvals-and-sandbox` (hidden alias `--yolo`) sets approvals to `never` and the sandbox to `danger-full-access`, on both `codex` and `codex exec`. The flag's own help text says "EXTREMELY DANGEROUS. Intended solely for running in environments that are externally sandboxed." OpenAI's docs say to avoid it unless you are inside a dedicated sandbox VM.
>
> Under full access:
> - Codex can edit files outside the project and reach the internet without asking.
> - Web search switches to live.
> - Full Access has skipped Guardian reviews for confirmation-only actions since 0.153.0 (September 3, 2026).
>
> Never point it at a machine holding credentials or data you care about.

## Turn on network access in workspace-write

By default the agent runs with network access off, in `read-only` and `workspace-write` alike. To let commands such as `npm install` or `curl` reach the internet, add this to `~/.codex/config.toml`:

```toml
[sandbox_workspace_write]
network_access = true
```

For a single run:

```bash
codex --config sandbox_workspace_write.network_access=true
```

The `[sandbox_workspace_write]` table has four keys, and it only applies when `sandbox_mode = "workspace-write"`:

| Key | Default | Effect |
|---|---|---|
| `network_access` | `false` | Allow outbound network inside the sandbox |
| `writable_roots` | `[]` | Extra writable directories beyond the workspace |
| `exclude_tmpdir_env_var` | `false` | Drop `$TMPDIR` from writable roots |
| `exclude_slash_tmp` | `false` | Drop `/tmp` from writable roots |

To check a setting without spending a model turn, `codex sandbox` runs a single command under the sandbox:

```bash
codex sandbox -- /usr/bin/curl -sS -m 8 https://example.com
```

On macOS with 0.154.0, what that probe does depends on the sandbox:
- In a fresh folder, it fails with `Could not resolve host`.
- With `-c 'sandbox_mode="workspace-write"' -c 'sandbox_workspace_write.network_access=true'` added before the `--`, it returns HTTP 200.

The docs still show `codex sandbox macos …`, but 0.154.0 doesn't accept that form. The Linux and Windows forms of the helper aren't covered here.

To restrict where commands can connect, use the optional network proxy. It is experimental and off by default, and it never grants access on its own:

```bash
codex \
  -c 'features.network_proxy=true' \
  -c 'sandbox_workspace_write.network_access=true'
```

Its domain rules are allowlist-first, and a `deny` rule always wins. It filters only commands inside the sandbox, not web search, MCP connections or Codex's own model traffic.

**Permission profiles**, in beta as of September 2026, are a newer way to express the same settings. The built-ins are `:read-only`, `:workspace` and `:danger-full-access`, selected with `default_permissions`, and network is set with `enabled = true` under `[permissions.<name>.network]`. Don't mix them with `sandbox_mode`: if `sandbox_mode` or `--sandbox` appears anywhere, Codex uses the older settings.

Codex cloud is configured separately. It blocks internet access during the agent phase by default, while setup scripts keep it. You turn access on per environment, with an optional domain allowlist and HTTP methods limited to `GET`, `HEAD` and `OPTIONS`.

## Enable web search

Web search is a hosted tool for the model, separate from command networking. It can stay available with network access off, and the proxy's domain rules don't apply to it. It has been on by default for local CLI and IDE tasks since January 28, 2026, controlled by the top-level `web_search` key:

| `web_search` | What the model gets |
|---|---|
| `"cached"` (default) | Results from an OpenAI-maintained index, no live fetching |
| `"indexed"` | External access only when gated by the search index |
| `"live"` | Unrestricted live retrieval |
| `"disabled"` | No search tool |

```toml
web_search = "cached"  # default; serves results from the web search cache
# web_search = "indexed" # gate external web access through the search index
# web_search = "live"  # fetch the most recent data from the web (same as --search)
# web_search = "disabled"
```

For live results in one interactive session:

```bash
codex --search "Summarize the latest release notes for this dependency"
```

`--search` exists only on interactive `codex`, and `codex exec --search` is an error. For headless runs, set `web_search = "live"` in config, or in a profile file that you select with `--profile`.

Two more rules apply:
- **Full access flips search to live.** The docs say `--yolo` and other full-access settings default to live. The 0.154.0 source goes further: under full access only `"disabled"` or `"indexed"` survive, and even an explicit `"cached"` is upgraded.
- **Results can be narrowed.** `tools.web_search` accepts `context_size`, `allowed_domains` and `location`, and admins can restrict modes with `allowed_web_search_modes`.

The cached mode exists for safety as much as speed. It reduces exposure to prompt injection from live pages, but you should still treat every result as untrusted input. See [defending against prompt injection](/guides/ai-safety/defending-prompt-injection).

## Recipes by scenario

### Read-only review of an unfamiliar repo

```bash
codex --sandbox read-only --ask-for-approval on-request
```

Leave an unknown repo untrusted. Untrusted projects skip the project's `.codex/` config, hooks and rules. Since 0.150.0 (August 26, 2026) they also skip its `AGENTS.md`, so a hostile repo can't load its own instructions into Codex.

### Everyday coding

Use the Auto preset (`--sandbox workspace-write --ask-for-approval on-request`), and switch to `--approve-for-me` when prompts slow you down. When Codex needs a sibling directory, add it with `--add-dir <DIR>`. OpenAI's CLI docs recommend that over forcing `danger-full-access`.

### CI with codex exec

```bash
codex exec --sandbox workspace-write "<task>"
```

`codex exec` never pauses for approval: a blocked action fails and the model sees the error, so grant the access the job needs up front. On clean runners, `--skip-git-repo-check`, `--ignore-user-config` and `--ignore-rules` drop the Git-repo requirement, the user config and execpolicy `.rules` files. Searches appear as `web_search` items in `codex exec --json` output. For scheduled work, see [Codex automations](/guides/workflow/codex-automations).

### A disposable container with full access

```bash
codex exec --sandbox danger-full-access "<task>"
```

OpenAI's docs limit this to controlled environments such as an isolated CI runner or container. If Docker blocks the namespace or `seccomp` operations the Linux sandbox needs, let the container provide the isolation and run `danger-full-access` inside it. For Dev Containers, OpenAI ships a reference secure config with bubblewrap and firewall-based outbound controls:

```bash
devcontainer up --workspace-folder . --config .devcontainer/devcontainer.secure.json
```

The docs warn that with full access inside the container, "a malicious project can exfiltrate anything available inside the devcontainer, including Codex credentials". Use the pattern only with trusted repositories. For the wider sandbox landscape, see [sandboxing AI-generated code](/guides/advanced/sandboxing-ai-generated-code) and the [Dev Container Designer](/skills/workflow/devcontainer-designer) skill.

## Profiles and per-project trust

In Codex 0.134.0 and later (May 26, 2026), `--profile` no longer reads `[profiles.<name>]` tables from `config.toml`, and the top-level `profile = "..."` selector is gone. Each profile is now its own file with top-level keys:

```toml
# ~/.codex/full_auto.config.toml
approval_policy = "on-request"
sandbox_mode    = "workspace-write"
```

```toml
# ~/.codex/readonly_quiet.config.toml
approval_policy = "never"
sandbox_mode    = "read-only"
```

Select one with `codex --profile full_auto` or `-p full_auto`; the name is only a label and doesn't bring back the removed flag. A profile layers above your base user config and below project config and CLI flags, and a project's `.codex/config.toml` can't select one.

To force stricter approvals for one project, mark it untrusted in your user-level config:

```toml
[projects."/path/to/project"]
trust_level = "untrusted"
```

That also disables the project's local config. Trust has tightened through 2026:
- Since 0.147.0, Codex requires explicit trust for unfamiliar local projects.
- Since 0.154.0, it avoids running workspace-controlled helpers before trust is established.

Precedence runs from highest to lowest:
1. CLI flags and `--config`.
2. Project `.codex/config.toml` files (trusted projects only; the closest file wins).
3. Profile files.
4. `~/.codex/config.toml`.
5. Cloud-managed defaults for your signed-in workspace.
6. `/etc/codex/config.toml`.
7. Built-in defaults.

Even then, a managed `requirements.toml` can forbid `approval_policy = "never"` or `danger-full-access`. The [config.toml guide](/guides/configuration/codex-config-toml) covers the file itself; [AGENTS.md for Codex](/guides/configuration/codex-agents-md) covers the instructions layer.

## Troubleshooting blocked writes, network and prompts

### Writes fail with "Operation not permitted"

You're in `read-only`, usually because the folder has no trust decision. You have two options:
- trust it through `/permissions`;
- start with `--sandbox workspace-write`.

If the target is outside the workspace, add it with `--add-dir` or `writable_roots` rather than jumping to full access. Writes under `.git`, `.codex` or `.agents` are blocked by design.

### Network requests fail

`Could not resolve host` inside the sandbox means network access is off. Set `network_access = true` as shown above. The proxy feature alone never opens the network.

On Linux, confirm bubblewrap is installed, and on Ubuntu 24.04 load the AppArmor profile. In Docker, the container may be blocking the sandbox itself.

### Codex asks before every command

Check `/status` for the approval policy and writable roots. The usual causes are:
- The project is marked `trust_level = "untrusted"`, so commands need approval unless an exec-policy rule allows them.
- You're in `read-only`.
- A command touches a protected path.

Switch to the Auto preset or `--approve-for-me`.

### Startup and flag errors

| Error | Fix |
|---|---|
| `approval_policy = "untrusted" is no longer supported` | Delete the line; use `on-request` or project `trust_level` |
| `unexpected argument '--full-auto'` | Use the replacements in the flags table |
| `unexpected argument '-a'` on `codex exec` | Remove it; exec already uses `never` |
| `unexpected argument '--search'` on `codex exec` | Set `web_search` in config or a profile |
| Profile settings ignored | Move `[profiles.<name>]` into `~/.codex/<name>.config.toml` |

For failures beyond permissions, work through [Codex troubleshooting](/guides/troubleshooting/codex-troubleshooting).

## Next steps

Start with the Auto preset, add `--approve-for-me` once you trust the reviewer, and save the pair as a profile file. Then:
- [Codex MCP setup](/guides/mcp/codex-mcp-setup) for MCP tool approvals, and [Codex subagents](/guides/advanced/codex-subagents), which inherit the parent's sandbox and approvals.
- [Claude Code settings and permissions](/guides/configuration/claude-code-settings-permissions) for the equivalent model in Claude Code, and [Claude Code vs Codex CLI](/guides/comparisons/claude-code-vs-codex-cli) for the two side by side.
