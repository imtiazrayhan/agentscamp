---
title: "Codex config.toml: Settings, Precedence, and Safe Defaults"
description: "Configure OpenAI Codex with config.toml — user and project scopes, precedence, sandbox and approvals, MCP, subagents, profiles, and safe defaults."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["codex", "config-toml", "configuration", "sandbox", "openai"]
featured: true
summary: "Codex uses config.toml for operational behavior: models, reasoning, sandboxing, approvals, MCP servers, subagents, and feature flags. Put personal defaults in ~/.codex/config.toml and trusted repository settings in .codex/config.toml. More specific project files and one-off CLI flags override broader defaults, while managed requirements can constrain what users are allowed to select."
keyTakeaways:
  - "Use config.toml for runtime settings; use AGENTS.md for repository instructions and skills for conditional workflows."
  - "Personal defaults live in ~/.codex/config.toml; trusted projects can add .codex/config.toml files with closer directories taking precedence."
  - "CLI overrides win for one run, then project config, profile config, user config, system config, and built-in defaults."
  - "Sandbox mode controls technical access; approval policy controls when Codex must pause and ask."
  - "Start with a small config, change one layer at a time, and inspect active settings before debugging agent behavior."
faq:
  - q: "Where is the Codex config.toml file?"
    a: "The user-level file is ~/.codex/config.toml by default. A trusted repository can add .codex/config.toml at the project root or in a more specific subdirectory. The CLI and IDE extension share these configuration layers."
  - q: "What is the difference between config.toml and AGENTS.md?"
    a: "config.toml controls runtime behavior such as sandboxing, approvals, model defaults, MCP servers, and subagents. AGENTS.md provides natural-language repository guidance such as architecture, commands, conventions, and verification expectations."
  - q: "Which Codex setting wins when the same option appears more than once?"
    a: "From highest to lowest precedence: CLI and --config overrides, project .codex/config.toml files from the root toward the working directory, the selected profile, user config, system config, and built-in defaults. Managed requirements may still forbid certain values."
  - q: "Should a team commit .codex/config.toml?"
    a: "Yes when the repository needs shared operational defaults, such as a project MCP server or scoped sandbox behavior. Codex loads project configuration only for trusted projects, and credentials should stay in environment variables or OAuth rather than the committed file."
related: ["guide:codex-agents-md", "guide:codex-mcp-setup", "guide:codex-subagents", "guide:openai-codex-guide", "tool:codex-cli", "guide:sandboxing-ai-generated-code"]
howtoSteps:
  - name: "Separate instructions from settings"
    text: "Keep repository conventions in AGENTS.md and put only runtime behavior such as permissions, models, integrations, and subagents in config.toml."
  - name: "Create the smallest user config"
    text: "Add only the defaults you intend to change in ~/.codex/config.toml; omit settings when built-in behavior is acceptable."
  - name: "Add project settings deliberately"
    text: "Commit .codex/config.toml only for trusted-repository behavior the team should share, with no embedded secrets."
  - name: "Verify precedence"
    text: "Check the current directory, selected profile, CLI overrides, and managed requirements before assuming Codex ignored a setting."
  - name: "Test the boundary"
    text: "Run a harmless read and a workspace edit to confirm the sandbox and approval behavior match the intended configuration."
---

**`config.toml` is the operational control plane for Codex.** It sets defaults for models, reasoning effort, sandboxing, approvals, MCP servers, subagents, feature flags, shell behavior, and other runtime choices. It does not replace [`AGENTS.md`](/guides/configuration/codex-agents-md), which tells the agent how your repository works, or a [skill](/guides/skills/codex-skills-guide), which teaches a conditional workflow.

The useful split is simple:

- “Run this command before finishing” → `AGENTS.md`
- “Use workspace-scoped filesystem access” → `config.toml`
- “Follow these seven steps when preparing a release” → skill
- “For this task only, do not change the API” → prompt

## Configuration scopes

Personal defaults live in:

```text
~/.codex/config.toml
```

A trusted project can add one or more:

```text
repo/.codex/config.toml
repo/services/payments/.codex/config.toml
```

Project settings are useful when an integration, permission boundary, or subagent setup belongs to the repository rather than one developer. Codex skips project `.codex/` layers for repositories marked untrusted; user and system configuration still apply.

The CLI and IDE extension share the same configuration layers. In the desktop app, **Settings → Configuration → Open config.toml** opens the user file.

## Precedence: which value wins?

Codex resolves the same setting from most specific to broadest:

1. CLI flags and `--config` overrides for this invocation.
2. Project `.codex/config.toml` files, from repository root toward the current working directory; the closest wins.
3. The selected profile file, such as `~/.codex/review.config.toml`.
4. User config at `~/.codex/config.toml`.
5. System config at `/etc/codex/config.toml` on Unix, when present.
6. Built-in defaults.

Managed environments can also enforce constraints through `requirements.toml`. A user value can win normal precedence and still be rejected because the organization disallows that mode.

When behavior surprises you, inspect the current directory and every active layer before changing the file again. Most “Codex ignored my setting” problems are actually a closer project file, a selected profile, a CLI override, an untrusted project, or an administrator constraint.

## A practical starter config

Keep the first version small:

```toml
# ~/.codex/config.toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"
model_reasoning_effort = "medium"

[agents]
enabled = true
max_concurrent_threads_per_session = 4
```

This establishes an ordinary local-development boundary without pinning every option Codex supports. Omitted settings continue to receive product defaults and updates.

Avoid copying a giant sample configuration wholesale. Every explicit line becomes a setting you own, and stale lines make later troubleshooting harder.

## Sandbox and approvals are separate

These controls answer different questions:

- **Sandbox mode:** What can a generated command technically access?
- **Approval policy:** When must Codex stop and ask before attempting an action?

`read-only` is useful for audits, explanations, and planning. `workspace-write` supports normal implementation while keeping writes scoped to the workspace. Broader access should follow from a task that actually needs it, not from frustration with one denied command.

Approval settings do not create access the sandbox forbids. Conversely, a broad sandbox with no approval prompts removes both the technical and human checkpoints. Configure the pair as one risk decision and test it with harmless operations before trusting it on unattended work.

## Project settings and secrets

A committed project config is a good place for a shared [MCP server](/guides/mcp/codex-mcp-setup), agent concurrency cap, or project-specific hook. It is a bad place for tokens.

```toml
# .codex/config.toml
[mcp_servers.internal_docs]
url = "https://mcp.example.com/docs"
bearer_token_env_var = "INTERNAL_DOCS_TOKEN"
enabled_tools = ["search", "fetch"]
default_tools_approval_mode = "prompt"
```

The file names the environment variable; it does not contain the credential. Remote servers that support OAuth can use `codex mcp login <name>` instead.

## Profiles for deliberate mode switches

Profiles are useful when you have a small number of coherent operating modes: a fast read-only review, an implementation session, or a high-effort architecture pass. Keep the base config boring and put only the differences in the profile file.

```toml
# ~/.codex/review.config.toml
sandbox_mode = "read-only"
model_reasoning_effort = "high"
```

Select it with `--profile review`. A profile should describe a job, not become a second dumping ground for unrelated preferences.

## Configure subagents centrally, specialize locally

Global multi-agent controls live under `[agents]`:

```toml
[agents]
enabled = true
max_concurrent_threads_per_session = 4
default_subagent_reasoning_effort = "medium"
```

Individual custom-agent files under `.codex/agents/` or `~/.codex/agents/` can then override model, reasoning, sandboxing, MCP, and skills for one role. See the [Codex subagents guide](/guides/advanced/codex-subagents) for safe decomposition patterns.

## Debug configuration systematically

When a setting seems ineffective:

1. Confirm the client and version you are actually running.
2. Confirm the current working directory and whether the project is trusted.
3. Remove one-off CLI flags and check the selected profile.
4. Look for a closer `.codex/config.toml`.
5. Check managed requirements if this is an organization-controlled machine.
6. Restart the client when the affected feature loads configuration only at startup.

Change one layer, rerun one small test, and keep the result. Editing three configs at once turns precedence into guesswork.

> [!TIP]
> Explicit configuration should encode intent, not fear. If you cannot explain why a setting differs from the default and what test proves it works, leave it out.

Official reference: [Codex config basics](https://learn.chatgpt.com/docs/config-file/config-basic) and the [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).
