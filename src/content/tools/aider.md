---
name: "Aider"
description: "Open-source terminal AI pair programmer that edits files in your Git repo and auto-commits each change, working with Claude, GPT, and other models you bring."
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://aider.chat"
pricing: "open-source"
category: "cli"
repo: "https://github.com/Aider-AI/aider"
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
sameAs: ["https://github.com/Aider-AI/aider", "https://pypi.org/project/aider-chat/"]
color: "purple"
topics: ["coding-languages"]
audience: ["developers"]
related: ["guide:aider-vs-claude-code", "tool:claude-code", "tool:cline", "guide:testing-ai-generated-code", "glossary:vibe-coding"]
tags: ["cli", "open-source"]
alternativeTo: ["codex-cli", "claude-code", "gemini-cli", "cline", "continue"]
summary: "Aider is a free, Apache-2.0 terminal tool for AI pair programming. Run it inside a Git repository, describe a change, and it edits the files and commits each change, so /undo or git revert takes anything back. You bring an API key for Claude, GPT, DeepSeek or a local model. Releases have slowed: the latest on PyPI is 0.86.2, from February 2026."
faq:
  - q: "Is Aider free?"
    a: "Yes. Aider is open source under the Apache-2.0 license and has no paid tier or account. You supply your own model API key, so the cost is whatever your provider charges for tokens; with a local model served by Ollama or LM Studio the cost is your hardware."
  - q: "How do I install Aider?"
    a: "The documented quick start is python -m pip install aider-install, then aider-install, which puts Aider in its own Python environment. There are also one-line installers (curl -LsSf https://aider.chat/install.sh | sh on Mac and Linux) and uv or pipx installs of the aider-chat package. Then cd into your project and run aider --model sonnet --api-key anthropic=<key>."
  - q: "Is Aider still maintained?"
    a: "The repository is still receiving changes, but tagged releases have slowed. As of November 2026 the latest version on PyPI is 0.86.2, uploaded in February 2026, and the release history lists newer model support, including Claude 4.5 and 4.6 and GPT-5.1 through 5.4 settings, under an unreleased main branch. You can still use a newer model by passing its full provider/model name."
  - q: "Can Aider use local models?"
    a: "Yes. Aider's docs cover Ollama, LM Studio and any OpenAI-compatible endpoint. For Ollama, pull a model, start the server with a larger context window (the docs use OLLAMA_CONTEXT_LENGTH=8192 ollama serve), then run aider --model ollama_chat/<model>. The docs recommend the ollama_chat/ prefix over ollama/."
---

Aider is an open-source command-line tool for AI pair programming. You run it inside a Git repository, describe the change you want, and Aider edits the files on disk and commits each change with a descriptive message. It is free under the Apache-2.0 license, has no account or hosted service, and works with whichever model you bring a key for.

It suits developers who want a small, transparent tool in the loop: you decide which files are in the chat, you read each diff, and Git is the undo button. It is not an autonomous agent that plans a long task and runs unattended.

## Highlights

- **Git-native edits.** Whenever Aider edits a file it commits the change. If a file already has uncommitted work, Aider commits that first so your edits and its edits stay separate. `/undo` discards its last commit and `/diff` shows changes since your last message.
- **Repository map.** Aider builds a map of the whole codebase so the model knows about code outside the files you added. `/add` puts files in the chat for editing, `/read-only` adds reference files, and `/drop` frees context.
- **Chat modes.** `code` edits files, `ask` discusses code without changing it, and `architect` has one model propose a change while a second editor model turns it into file edits. Switch per message with `/ask` or `/architect`, or start with `--architect`.
- **Bring any model.** The docs list OpenAI, Anthropic, Gemini, DeepSeek, xAI, Groq, OpenRouter, GitHub Copilot, Bedrock, Vertex AI, Azure, Ollama, LM Studio and any OpenAI-compatible API.
- **Lint and test loop.** Aider can run your linter and test suite after each change and feed failures back to the model; `/test` and `/run` do the same on demand.
- **Other inputs.** Images and web pages as context, voice input with `/voice`, a watch mode that acts on comments you leave in your editor, and copy/paste helpers for working through a model's web chat.

## How it fits a workflow

```bash
python -m pip install aider-install
aider-install

cd /to/your/project
aider --model sonnet --api-key anthropic=<key>
```

A typical session:

```text
> /add src/billing/invoice.py tests/test_invoice.py
> Round line totals half-up to 2 decimals and add a test for 0.005
  (Aider edits both files and commits)
> /test pytest tests/test_invoice.py
> /undo        # if you do not like the result
```

Add only the files that need to change; the repository map covers the rest, and a smaller chat keeps token costs down. `/tokens` reports what the current context costs.

## Good to know

- **Cost.** There is nothing to buy from Aider. You pay your model provider per token, or nothing beyond hardware with a local model.
- **Release pace.** As of November 2026 the latest version on PyPI is 0.86.2 (February 2026) and the latest GitHub release is v0.86.0 (August 2025). Newer model aliases and settings are listed in the release history under an unreleased main branch, and the README still names Claude 3.7 Sonnet and o3-mini as the models it works best with. If you need those newer defaults, install from the repository's main branch or pass a full model name.
- **Python.** The PyPI package requires Python 3.10 to 3.12. The `aider-install` and one-line installers fetch a separate Python 3.12 if you need one.
- **Scope.** Aider is a chat loop around your working tree. It has no sandbox, no background or cloud agents and no pull request bot, and commands you run through `/run` or `/test` use your own permissions.
- **Popularity.** About 50,000 GitHub stars as of November 2026.

Against the alternatives: [Claude Code](/tools/claude-code) is the more autonomous terminal agent, with subagents, hooks and MCP, but it is tied to Anthropic's models and plans; [Aider vs Claude Code](/guides/comparisons/aider-vs-claude-code) goes through the trade-off. [Codex CLI](/tools/codex-cli) is OpenAI's open-source terminal agent. [Cline](/tools/cline) is an open-source, bring-your-own-key agent that lives in VS Code instead of the terminal. See the wider field in [AI Coding Agents in 2026](/guides/prompting/ai-coding-agents-cli-2026), or browse [Aider alternatives](/tools/aider/alternatives).
