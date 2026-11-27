---
name: "Continue"
description: "An open-source IDE extension for building custom AI coding assistants."
seoDescription: "Continue is an open-source coding agent for VS Code, JetBrains and the CLI. Acquired by Cursor in 2026; the Apache-2.0 repo is read-only at v2.0.0."
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://continue.dev"
pricing: "open-source"
category: "extension"
repo: "https://github.com/continuedev/continue"
license: "Apache-2.0"
color: "blue"
topics: ["coding-languages"]
audience: ["developers"]
related: ["tool:cursor", "tool:cline", "tool:github-copilot", "guide:cursor-vs-claude-code-vs-copilot-vs-windsurf-2026", "guide:best-local-llm-tools-2026"]
tags: ["vscode", "jetbrains", "open-source"]
alternativeTo: ["cody", "tabnine", "github-copilot", "cline"]
summary: "Continue was acquired by Cursor, and continue.dev now shows a farewell notice in place of a product site. The Apache-2.0 repository is public but read-only, with 2.0.0 (June 19, 2026) as the final release of the VS Code extension, JetBrains plugin and cn CLI. That release removed telemetry and sign-in, so it runs only on models you configure yourself."
faq:
  - q: "Is Continue still maintained?"
    a: "No. continue.dev states that Continue was acquired by Cursor, and the repository README says it is no longer actively maintained and is read-only for all users. The final stable release is 2.0.0, published June 19, 2026. The only later commits, in July 2026, moved the docs site and removed its sign-in link."
  - q: "Can I still install and use Continue?"
    a: "Yes, as unmaintained software. The final 2.0.0 builds of the VS Code extension, the JetBrains plugin and the cn CLI are linked from the repository, and the docs remain at docs.continue.dev. The team recommends the CLI over the JetBrains plugin. Nobody will patch it for new editor versions or model API changes."
  - q: "What changed in the final 2.0.0 release?"
    a: "According to the README, the team removed anonymous telemetry, pulled out authentication, and fixed bugs. In practice that means there is no Continue account or hosted service behind it any more: you point config.yaml at a provider key or a local model."
  - q: "What should I use instead of Continue?"
    a: "For an open-source agent in VS Code with your own keys, Cline and Kilo Code are maintained. For local autocomplete and chat you can keep Continue's final release pointed at Ollama, accepting that it is frozen. Cursor, which acquired Continue, is a closed-source editor with its own subscription."
---

> [!WARNING]
> **Continue was acquired by Cursor.** continue.dev now carries a farewell notice: the company says its "open-source codebase remains freely available as a foundation for others." The repository README states it "is no longer actively maintained and is read-only for all users," and the last stable release is 2.0.0 from June 19, 2026. Read this page as a record of what Continue does, and choose something maintained if you are starting today.

Continue is an open-source coding assistant from Continue Dev, Inc., shipped as a VS Code extension, a JetBrains plugin and a terminal CLI called `cn`. Its premise was that the editor integration and the model should be separate choices: Continue supplied chat, edit, autocomplete and agent modes, and you supplied the model, hosted or local. The repository is Apache-2.0 and had about 36,600 GitHub stars as of November 2026.

## Highlights

These describe the final 2.0.0 release.

- **Four modes.** Agent mode works on development tasks with tool use, Chat answers questions about code, Edit modifies a selection without leaving the file, and Autocomplete suggests code inline as you type.
- **`cn` CLI.** A terminal agent that edits files and runs commands, with a headless mode (`cn -p "your prompt"`) that runs to completion and prints to stdout for scripts, CI and git hooks.
- **Configuration as a file.** Assistants are defined in `config.yaml`: models with roles (`chat`, `edit`, `apply`, `autocomplete`), context providers, rules, prompts and MCP servers. The file can be committed and shared.
- **Any provider.** Hosted APIs such as OpenAI, Anthropic and Mistral, local runtimes such as Ollama, or any OpenAI-compatible endpoint through `apiBase`.
- **No telemetry, no login.** The final release removed anonymous telemetry and authentication.

## In an AI-assisted workflow

Install the CLI with the script from the docs, then check it:

```bash
curl -fsSL https://raw.githubusercontent.com/continuedev/continue/main/extensions/cli/scripts/install.sh | bash
cn --version
cn -p "Explain what src/server.ts does"
```

A `config.yaml` that pairs a chat model with a separate autocomplete model, following the reference docs:

```yaml
name: My Config
version: 1.0.0
schema: v1
models:
  - name: GPT-4o
    provider: openai
    model: gpt-4o
    roles:
      - chat
      - edit
      - apply
  - name: Codestral
    provider: mistral
    model: codestral-latest
    roles:
      - autocomplete
```

Swap `provider` for `ollama` and a model you have pulled to keep everything on your machine; [Best Tools for Running LLMs Locally](/guides/comparisons/best-local-llm-tools-2026) covers the runtimes.

## Good to know

Continue is free and Apache-2.0, and you pay only for the model access you configure. The cost of using it now is maintenance risk. The reference docs still show older model ids in their examples and the CLI quickstart still mentions a Continue account, which the final release removed, so expect the documentation to drift from reality. Editor updates can break an unmaintained extension at any time.

The licence does allow forks, and the team says it hopes the codebase serves as a foundation for others, but no successor project is named in the README.

If you are choosing today: [Cline](/tools/cline) is the closest maintained open-source agent with bring-your-own-key and per-step approval; [Kilo Code](/tools/kilo-code) adds inline autocomplete and a model gateway; [Tabnine](/tools/tabnine) is a commercial assistant aimed at teams. [Cursor](/tools/cursor), Continue's acquirer, is a closed-source editor. See [Best GitHub Copilot Alternatives](/guides/comparisons/best-github-copilot-alternatives-2026) or [Continue alternatives](/tools/continue/alternatives).
