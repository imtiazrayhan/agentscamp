---
name: "Tabby"
description: "Self-hosted, open-source AI coding assistant by TabbyML: run completion and chat models on your own hardware. Development has stalled since early 2026."
url: "https://www.tabbyml.com/"
pricing: "open-source"
category: "extension"
repo: "https://github.com/TabbyML/tabby"
related: ["tool:tabnine", "tool:continue", "tool:github-copilot"]
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
alternativeTo: ["github-copilot", "continue", "cody"]
sameAs:
  - "https://github.com/TabbyML/tabby"
  - "https://tabby.tabbyml.com/docs/welcome/"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["self-hosted", "code-completion", "open-source", "copilot-alternative", "on-premises"]
color: "purple"
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
featured: false
summary: "Tabby is a self-hosted AI coding assistant from TabbyML: a single server that runs completion and chat models on your own hardware, with extensions for VS Code, IntelliJ-platform IDEs and Vim/Neovim. The core is Apache-2.0 and the free Community licence covers 5 seats. As of November 2026 it looks dormant: the last release is v0.32.0 from January 2026."
faq:
  - q: "Is Tabby still maintained?"
    a: "It looks dormant. As of November 2026 the last stable release is v0.32.0 from January 25, 2026, the last commit to the main branch is from June 30, 2026, and the VS Code extension on the Marketplace was last updated on April 30, 2025. The repository is not archived and the docs are still online, but tabbyml.com no longer presents Tabby."
  - q: "How much does Tabby cost?"
    a: "The Community licence is free. Tabby's docs describe three tiers, Community, Team and Enterprise, with the last two paid, and the source code caps Community at 5 seats and Team at 50. As of November 2026 TabbyML publishes no prices: the old pricing URL redirects to a company homepage that does not mention Tabby."
  - q: "Is Tabby fully open source?"
    a: "Mostly. The LICENSE file puts everything outside the ee/ directory under Apache-2.0, while the ee/ directory, which holds the web server, admin UI and licence checks, is under a separate licence in ee/LICENSE. GitHub therefore reports the repo's licence as unclassified."
  - q: "What hardware does Tabby need?"
    a: "The README says it supports consumer-grade GPUs, and the Docker quick start runs with --gpus all and --device cuda on an NVIDIA card with the NVIDIA Container Toolkit installed. The example pairs the small StarCoder-1B completion model with Qwen2-1.5B-Instruct for chat; larger models need more VRAM."
---

**Tabby is a self-hosted AI coding assistant from TabbyML, described in its README as an open-source and on-premises alternative to GitHub Copilot.** You run one server on your own machine or cluster, it serves a completion model and a chat model, and editor extensions connect to it. No code or prompts leave your network unless you configure an external model.

> [!WARNING]
> As of November 2026 Tabby shows little sign of active development. The last release is v0.32.0 (January 25, 2026), the main branch has had no commits since June 30, 2026, and tabbyml.com now advertises an agent-improvement service with no mention of Tabby. TabbyML's active repository is Pochi, a separate coding agent. Evaluate Tabby as software you would maintain yourself.

The repository had about 34,000 GitHub stars as of November 2026.

## Highlights

- **Self-contained server.** No external database or cloud service is required; state lives in the mounted data directory.
- **Your models.** Completion and chat models are chosen with `--model` and `--chat-model` from Tabby's model registry. The docs name CodeLlama, StarCoder and CodeGen among the compatible coding models.
- **Consumer GPUs.** Built to run on consumer-grade GPUs, with CUDA support through Docker.
- **OpenAPI interface.** The server exposes a documented HTTP API so you can wire it into a cloud IDE or internal tooling.
- **Answer Engine.** Introduced in v0.13.0 as a knowledge engine for internal engineering teams; v0.30 added GitLab merge requests as context, and v0.29 added ingesting your own documentation through REST APIs.
- **Editor extensions.** The docs cover VS Code (Visual Studio Marketplace and Open VSX), the IntelliJ Platform, and Vim/Neovim.

## In an AI-assisted workflow

The quickest start is the Docker command from the README, on a machine with an NVIDIA GPU and the NVIDIA Container Toolkit:

```bash
docker run -it \
  --gpus all -p 8080:8080 -v $HOME/.tabby:/data \
  tabbyml/tabby \
  serve --model StarCoder-1B --device cuda --chat-model Qwen2-1.5B-Instruct
```

Once it is running, the server is at `http://localhost:8080`; install the editor extension and point it at that URL. On systems with SELinux enabled, the docs say to add `:Z` to the volume mount.

## Pricing

Tabby's docs list three licence tiers: Community, which is free for anyone, and Team and Enterprise, which are paid and unlock additional features. The licence code in the repository caps Community at 5 seats and Team at 50, with Enterprise uncapped. A paid licence is a key you paste into the Subscription page of the admin UI.

As of November 2026 no prices are published. The former pricing page redirects to TabbyML's homepage, which has only a contact link, so ask TabbyML directly whether Team and Enterprise licences are still sold before planning around them.

## Good to know

Licensing is split. Code outside `ee/` is Apache-2.0; the `ee/` directory, which includes the web server and admin UI that most deployments use, has its own terms in `ee/LICENSE`.

Running your own inference means you own capacity planning, model updates and uptime. The small default models are fast but well behind hosted frontier models on quality, and bigger models need bigger GPUs.

The stalled release cadence is the main risk: the VS Code extension has not been updated since April 2025, so editor changes may break it with no fix coming.

For maintained alternatives, [Tabnine](/tools/tabnine) is a commercial assistant aimed at teams, [GitHub Copilot](/tools/github-copilot) is the hosted default, and [Cline](/tools/cline) can be pointed at a model you serve yourself with [Ollama](/tools/ollama) or [vLLM](/tools/vllm). [Continue](/tools/continue), often paired with local models, is itself frozen after its acquisition by Cursor. See [Best GitHub Copilot Alternatives](/guides/comparisons/best-github-copilot-alternatives-2026) or browse [Tabby alternatives](/tools/tabby/alternatives).
