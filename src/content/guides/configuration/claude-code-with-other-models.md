---
title: "Use Claude Code with Other Models: Gateways, Bedrock, and Third-Party Endpoints"
seoTitle: "Claude Code with Other Models: Providers, Gateways, Endpoints"
description: "Claude Code with other models: what Anthropic supports (Bedrock, Agent Platform, Foundry, gateways), the model env vars, and third-party endpoint setups."
author: "Imtiaz Rayhan"
date: 2026-11-12
reviewed: 2026-11-22
color: "green"
depth: standard
topics: ["workflow-prompting", "llm-app-dev"]
audience: ["developers", "ai-engineers"]
tags: ["claude-code", "llm-gateway", "bedrock", "vertex-ai", "model-config", "anthropic-base-url"]
keywords: ["Claude Code other models", "Claude Code ANTHROPIC_BASE_URL", "Claude Code Bedrock", "Claude Code Vertex AI", "Claude Code LLM gateway", "Claude Code Ollama", "Claude Code DeepSeek"]
summary: "Anthropic supports Claude Code only with Claude models: on its API, Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, or an LLM gateway serving Claude. DeepSeek, Kimi, Z.ai, Alibaba, MiniMax, OpenRouter and Ollama document their own Anthropic-compatible setups via ANTHROPIC_BASE_URL. Those can work, but Anthropic doesn't support them."
keyTakeaways:
  - "Anthropic \"doesn't support routing Claude Code to non-Claude models through any gateway.\" Every non-Claude setup on this page is documented by its provider, not by Anthropic."
  - "The supported routes are the Anthropic API, Amazon Bedrock, Google Cloud's Agent Platform (formerly Vertex AI), Microsoft Foundry, Claude Platform on AWS, and LLM gateways that serve Claude models."
  - "Model aliases resolve differently by provider: on Bedrock and Agent Platform, sonnet means Sonnet 4.5, not Sonnet 5.5. Pin ANTHROPIC_DEFAULT_*_MODEL when the exact model matters."
  - "ANTHROPIC_BASE_URL changes where requests go, not which model answers. Third-party endpoints also need every model variable and CLAUDE_CODE_SUBAGENT_MODEL set, or background tasks and subagents request IDs the endpoint can't serve."
  - "Each provider documents its own gaps: DeepSeek ignores cache_control, Ollama has no prompt caching or token counting, MiniMax thinking can't be turned off. Check the list before you depend on a feature."
  - "Verify any setup with /status, keep credentials out of a committed .claude/settings.json, and remember that a settings-file env block overrides your shell exports."
howtoSteps:
  - name: "Decide which kind of route you need"
    text: "If you want Claude models from another provider or through your company's gateway, use the routes Anthropic documents. If you want a non-Claude model, you are following the provider's own setup, which Anthropic doesn't support."
  - name: "Set the provider switch or base URL"
    text: "Set CLAUDE_CODE_USE_BEDROCK, CLAUDE_CODE_USE_VERTEX or CLAUDE_CODE_USE_FOUNDRY for a cloud provider, or ANTHROPIC_BASE_URL for a gateway or Anthropic-compatible endpoint."
  - name: "Supply the credential outside committed files"
    text: "Use ANTHROPIC_AUTH_TOKEN (sent as a Bearer token), ANTHROPIC_API_KEY (sent as x-api-key) or an apiKeyHelper, and never put them in a checked-in .claude/settings.json."
  - name: "Pin every model variable"
    text: "Set ANTHROPIC_MODEL, ANTHROPIC_DEFAULT_OPUS_MODEL, ANTHROPIC_DEFAULT_SONNET_MODEL, ANTHROPIC_DEFAULT_HAIKU_MODEL and CLAUDE_CODE_SUBAGENT_MODEL so background work and subagents use a model the endpoint serves."
  - name: "Match the context and compaction window"
    text: "For a model Claude Code doesn't recognize, set CLAUDE_CODE_MAX_CONTEXT_TOKENS and CLAUDE_CODE_AUTO_COMPACT_WINDOW to what the provider documents, since unknown IDs are assumed to have a 1M-token window."
  - name: "Verify with /status"
    text: "Start a session and run /status. It should show the Anthropic base URL line and an Auth token or API key line that match what you configured."
faq:
  - q: "Can Claude Code use non-Claude models?"
    a: "Technically, many providers document it, but Anthropic doesn't support it. The gateway docs say Anthropic \"doesn't support routing Claude Code to non-Claude models through any gateway.\" DeepSeek, Moonshot's Kimi, Z.ai, Alibaba Cloud, MiniMax, OpenRouter and Ollama each publish their own Anthropic-compatible setup, with their own documented limitations."
  - q: "Does setting ANTHROPIC_BASE_URL change which model Claude Code uses?"
    a: "No. Anthropic's model docs say \"ANTHROPIC_BASE_URL changes where requests are sent, not which model answers them.\" The model comes from /model, --model, ANTHROPIC_MODEL, the model setting or ANTHROPIC_DEFAULT_MODEL, in that order, and from the ANTHROPIC_DEFAULT_*_MODEL variables that decide what each alias means."
  - q: "How do I use Claude Code with Amazon Bedrock or Vertex AI?"
    a: "Set the provider switch: CLAUDE_CODE_USE_BEDROCK for Amazon Bedrock, or CLAUDE_CODE_USE_VERTEX for Google Cloud's Agent Platform, which Anthropic notes was formerly Vertex AI. A provider switch takes priority over API keys, auth tokens and a /login subscription. Aliases resolve to different models there, so pin ANTHROPIC_DEFAULT_*_MODEL when you need a specific version."
  - q: "Can I run Claude Code with Ollama or a local model?"
    a: "Ollama documents it: run ollama launch claude, or set ANTHROPIC_BASE_URL to http://localhost:11434 with ANTHROPIC_AUTH_TOKEN=ollama and an empty ANTHROPIC_API_KEY, then pass --model. Ollama says local models need a 64k+ context window and lists unsupported features, including prompt caching and the Batches API. Anthropic doesn't support this setup."
  - q: "Does my Claude subscription apply when I route through a gateway?"
    a: "Not once you add a gateway credential. Anthropic's docs say that with a gateway credential, the subscription's usage limits don't apply and usage is billed per token to whoever owns the credential. Setting only ANTHROPIC_BASE_URL, without a gateway credential, doesn't replace the subscription."
sources:
  - title: "Other LLM gateways"
    url: "https://code.claude.com/docs/en/llm-gateway"
    publisher: "Anthropic"
  - title: "Connect Claude Code to an LLM gateway"
    url: "https://code.claude.com/docs/en/llm-gateway-connect"
    publisher: "Anthropic"
  - title: "LLM gateway protocol"
    url: "https://code.claude.com/docs/en/llm-gateway-protocol"
    publisher: "Anthropic"
  - title: "Model configuration"
    url: "https://code.claude.com/docs/en/model-config"
    publisher: "Anthropic"
  - title: "Environment variables"
    url: "https://code.claude.com/docs/en/env-vars"
    publisher: "Anthropic"
  - title: "Feature availability by provider"
    url: "https://code.claude.com/docs/en/feature-availability"
    publisher: "Anthropic"
  - title: "Claude Code Quickstart"
    url: "https://docs.litellm.ai/docs/tutorials/claude_responses_api"
    publisher: "LiteLLM"
  - title: "Claude Code integration"
    url: "https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code"
    publisher: "DeepSeek"
  - title: "Using the Anthropic API"
    url: "https://api-docs.deepseek.com/guides/anthropic_api/"
    publisher: "DeepSeek"
  - title: "Use Kimi in Claude Code"
    url: "https://platform.kimi.ai/docs/guide/claude-code-kimi"
    publisher: "Moonshot AI"
  - title: "Claude Code with the GLM Coding Plan"
    url: "https://docs.z.ai/devpack/tool/claude"
    publisher: "Z.ai"
  - title: "Use Claude Code with Model Studio"
    url: "https://www.alibabacloud.com/help/en/model-studio/claude-code"
    publisher: "Alibaba Cloud"
  - title: "Claude Code with MiniMax"
    url: "https://platform.minimax.io/docs/m-plan/claude-code"
    publisher: "MiniMax"
  - title: "Claude Code integration"
    url: "https://openrouter.ai/docs/cookbook/coding-agents/claude-code-integration"
    publisher: "OpenRouter"
  - title: "Claude Code"
    url: "https://docs.ollama.com/integrations/claude-code"
    publisher: "Ollama"
  - title: "Anthropic compatibility"
    url: "https://docs.ollama.com/api/anthropic-compatibility"
    publisher: "Ollama"
related: ["tool:claude-code", "guide:llm-gateways-compared", "glossary:ai-gateway", "tool:litellm", "tool:openrouter", "tool:ollama", "tool:deepseek", "guide:claude-code-headless-mode", "guide:choosing-the-right-model"]
---

Start with Anthropic's own position, because it shapes everything else on this page. The gateway docs say: "Any gateway that exposes a supported API format works. Anthropic doesn't endorse, maintain, or audit third-party gateway products, and doesn't support routing Claude Code to non-Claude models through any gateway."

So "using [Claude Code](/tools/claude-code) with other models" covers two different things:

1. **Claude models from another provider**: Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, Claude Platform on AWS, or an LLM gateway in front of any of them. Anthropic documents and supports these.
2. **Non-Claude models behind an Anthropic-compatible endpoint**: DeepSeek, Kimi, GLM, Qwen, MiniMax, or local models through Ollama. The providers document these setups. Anthropic doesn't support them.

One sentence from the model docs explains why the second group needs more than a URL: "`ANTHROPIC_BASE_URL` changes where requests are sent, not which model answers them." Everything below reflects Anthropic's docs and the provider pages as of November 2026.

## Supported routes and provider-documented routes

| Route | How you switch | Who documents it | Supported by Anthropic |
| --- | --- | --- | --- |
| Anthropic API or Claude subscription | Default, `ANTHROPIC_API_KEY` or `/login` | Anthropic | Yes |
| Amazon Bedrock | `CLAUDE_CODE_USE_BEDROCK` | Anthropic | Yes |
| Google Cloud's Agent Platform (formerly Vertex AI) | `CLAUDE_CODE_USE_VERTEX` | Anthropic | Yes |
| Microsoft Foundry | `CLAUDE_CODE_USE_FOUNDRY` | Anthropic | Yes |
| LLM gateway serving Claude models | `ANTHROPIC_BASE_URL` | Anthropic (protocol) and the gateway vendor | Claude Code side, yes; the gateway product isn't endorsed or audited |
| Endpoint serving non-Claude models | `ANTHROPIC_BASE_URL` plus model variables | The provider | No |

## Cloud providers

Each provider has its own switch. The verbatim meanings from the environment-variable reference:

| Variable | Meaning |
| --- | --- |
| `CLAUDE_CODE_USE_BEDROCK` | "Use Amazon Bedrock" |
| `CLAUDE_CODE_USE_VERTEX` | "Use Google Cloud's Agent Platform" (the variable kept its Vertex name) |
| `CLAUDE_CODE_USE_FOUNDRY` | "Use Microsoft Foundry" |
| `CLAUDE_CODE_USE_ANTHROPIC_AWS` | "Use Claude Platform on AWS" |
| `CLAUDE_CODE_USE_ANTHROPIC_GOOGLE_CLOUD` | "Use Claude Models on Google Cloud (Anthropic managed)" |
| `CLAUDE_CODE_USE_MANTLE` | "Use the Amazon Bedrock Mantle endpoint" |

A provider switch sits at the top of Claude Code's credential order, above `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY` and a `/login` subscription. The catch is that model aliases don't mean the same model everywhere:

| Provider | `opus` | `sonnet` | `haiku` |
| --- | --- | --- | --- |
| Anthropic API | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
| Claude Platform on AWS | Opus 5.5 | Sonnet 4.6 | Haiku 4.5 |
| Bedrock, Agent Platform | Opus 5.5 | Sonnet 4.5 | Haiku 4.5 |
| Microsoft Foundry | Opus 4.6 | Sonnet 4.5 | Haiku 4.5 |

The fourth alias, `fable`, resolves to Fable 5.2 (Fable 5 in Claude apps gateway sessions). If your team moves between providers, pin each alias with `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL` and `ANTHROPIC_DEFAULT_FABLE_MODEL`. To put a gateway in front of a cloud provider, override `ANTHROPIC_BEDROCK_BASE_URL` or `ANTHROPIC_VERTEX_BASE_URL`; `CLAUDE_CODE_SKIP_BEDROCK_AUTH` skips AWS authentication "for example, when using an LLM gateway." The `_SUPPORTED_CAPABILITIES` variables, such as `ANTHROPIC_DEFAULT_OPUS_MODEL_SUPPORTED_CAPABILITIES`, apply only with Bedrock, Vertex, Foundry or Mantle: "They have no effect behind an `ANTHROPIC_BASE_URL` gateway."

## LLM gateways in front of Claude

If your company runs an [AI gateway](/glossary/ai-gateway) in front of Claude, point Claude Code at it with `ANTHROPIC_BASE_URL` ("Override the API endpoint to route requests through a proxy or gateway") plus a credential. The docs spell out the headers: "`ANTHROPIC_AUTH_TOKEN` in `Authorization: Bearer`, `ANTHROPIC_API_KEY` in `x-api-key`, and `apiKeyHelper` in both."

[LiteLLM's](/tools/litellm) Claude Code Quickstart proxies Claude models this way:

```bash
litellm --config /path/to/config.yaml   # serves on http://0.0.0.0:4000
export ANTHROPIC_BASE_URL="http://0.0.0.0:4000"
export ANTHROPIC_AUTH_TOKEN="$LITELLM_KEY"
```

Things that change once a gateway is involved:

- **Billing.** "Setting only that variable, without a gateway credential, doesn't replace the subscription." With a gateway credential, "the subscription's usage limits don't apply" and usage is "billed per token to whoever owns the credential."
- **Upkeep.** "Claude Code adds capabilities with each release, and a gateway that doesn't forward them breaks the corresponding features." If a gateway rejects requests with an `Unexpected value(s)` or `Extra inputs are not permitted` error, set `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` to strip pre-release request headers.
- **Model picker.** `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` fills `/model` from the gateway's `/v1/models` endpoint (off by default). `ANTHROPIC_CUSTOM_MODEL_OPTION` adds one custom entry, and Claude Code skips validation for that ID.
- **MCP tool search** is on by default behind a gateway from v2.1.304, and from v2.1.305 Claude Code retries without it after a `400` or `422`.
- **Timeouts.** `API_TIMEOUT_MS` defaults to 600000 (10 minutes); the docs suggest raising it when routing through a proxy.
- **Enforcement.** A managed `allowedProviders: ["customEndpoint"]` setting (v2.1.285 or later) locks a machine to the gateway.

The [LLM gateways comparison](/guides/advanced/llm-gateways-compared) covers choosing the gateway itself.

## The model environment variables

| Variable | What it controls |
| --- | --- |
| `ANTHROPIC_MODEL` | "Name of the model setting to use" |
| `ANTHROPIC_DEFAULT_MODEL` | "Model that new sessions start on by default" (v2.1.236 or later) |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | What `opus` resolves to, and what `opusplan` uses in Plan Mode |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | What `sonnet` resolves to, and what `opusplan` uses outside Plan Mode |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | What `haiku` resolves to, "also used for background functionality" |
| `ANTHROPIC_DEFAULT_FABLE_MODEL` | "The model to use for `fable`" |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Default model for subagents, agent team teammates and workflow agents with no other assignment |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | The context window Claude Code assumes, for models whose real window doesn't match their name |
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | When auto-compaction starts, as a token count of `100000` or more |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Output cap; for an unrecognized ID the default is 32000 and the cap 128000 |

`ANTHROPIC_SMALL_FAST_MODEL` still appears in older setups, but it "is deprecated in favor of `ANTHROPIC_DEFAULT_HAIKU_MODEL`." The selection order is `/model`, then `--model`, then `ANTHROPIC_MODEL`, then the `model` setting, then `ANTHROPIC_DEFAULT_MODEL`.

Two rules catch people out. First, "When both a shell export and a settings-file `env` block set the same variable, the settings-file value applies," so an old `env` block silently wins over your terminal. Keep credentials out of a committed `.claude/settings.json`. Second, Claude Code "assumes a 1M token context window by default since v2.1.323" for model IDs it doesn't recognize. If the real window is different, set `CLAUDE_CODE_MAX_CONTEXT_TOKENS`; the docs also list a `[1m]` suffix and `modelOverrides` as ways to set it.

## Third-party endpoints: what each provider documents

> [!WARNING]
> Everything in this section is the provider's own setup, as its documentation described it in November 2026. Anthropic doesn't support any of it. Model names and mappings change often, and none of this page's examples include API keys.

Across these pages the setup follows one shape (our summary, not a vendor's): set `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`, blank `ANTHROPIC_API_KEY` when the provider says to, pin every `ANTHROPIC_DEFAULT_*_MODEL` plus `CLAUDE_CODE_SUBAGENT_MODEL` so background tasks and subagents don't ask for a Claude ID the endpoint can't serve, set the compaction window, and check `/status`. Ollama's manual setup shows the minimum:

```bash
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
claude --model qwen3.5
```

### DeepSeek

Base URL `https://api.deepseek.com/anthropic`. [DeepSeek's](/tools/deepseek) snippet points `ANTHROPIC_MODEL`, all three alias variables and `CLAUDE_CODE_SUBAGENT_MODEL` at `deepseek-flash` (with a `[1m]` suffix everywhere except the `haiku` and subagent entries), and sets `CLAUDE_CODE_EFFORT_LEVEL=max` and `CLAUDE_CODE_AUTO_COMPACT_WINDOW=786432`. Requests for `claude-opus` models map to `deepseek-v4-pro`; `claude-sonnet` and `claude-haiku` map to `deepseek-flash`. Documented gaps: `cache_control` and `mcp_servers` are ignored, adaptive thinking is treated as enabled and `budget_tokens` is ignored, `deepseek-v4-pro` replaces images with `[Unsupported Image]`, and `redacted_thinking`, `code_execution_tool_result` and `mcp_tool_use` aren't supported. Web search works through DeepSeek's own server tool.

### Kimi (Moonshot AI)

The docs moved to platform.kimi.ai; the API base stays `https://api.moonshot.ai/anthropic`. The setup goes in the `env` block of `~/.claude/settings.json` and sets `ANTHROPIC_MODEL`, every alias variable including `ANTHROPIC_DEFAULT_FABLE_MODEL`, and `CLAUDE_CODE_SUBAGENT_MODEL` to `kimi-k3[1m]`, with a compaction window of 1000000 and effort `max`. Two notes from Moonshot: "Configuring only some of the variables makes the corresponding scenarios fail silently," and "K3 always reasons and enables Preserved Thinking."

### Z.ai (GLM Coding Plan)

Base URL `https://api.z.ai/api/anthropic`. The manual JSON maps `haiku` to `glm-5.3-flash[1m]` and `sonnet` and `opus` to `glm-5.3[1m]`, sets the context and compaction windows to 1000000, raises `API_TIMEOUT_MS` to 3000000, and turns off nonessential traffic and telemetry. `npx @z_ai/coding-helper` automates it. The page's prose summary of the default mapping disagrees with its JSON; follow the JSON.

### Alibaba Cloud Model Studio (Qwen)

Alibaba lists a base URL per plan: Token Plan `https://token-plan.ap-southeast-1.maas.aliyuncs.com/apps/anthropic`, pay-as-you-go `https://{WorkspaceId}.ap-southeast-1.maas.aliyuncs.com/apps/anthropic`, and Coding Plan `https://coding-intl.dashscope.aliyuncs.com/apps/anthropic`. Model names differ by plan: the pay-as-you-go example uses `qwen3.7-max` with `qwen3.6-flash` for `haiku`, the Coding Plan example uses `qwen3.7-plus` throughout, and the Token Plan example sets `ANTHROPIC_MODEL="auto"` with `CLAUDE_CODE_MAX_CONTEXT_TOKENS="983616"`.

### MiniMax

Base URL `https://api.minimax.io/anthropic`, with `MiniMax-M3.1-Flash[1m]` for `ANTHROPIC_MODEL` and all three alias variables, a compaction window of 524288, and effort `max`. "Thinking is always enabled for MiniMax-M3.1-Flash and cannot be disabled"; `MAX_THINKING_TOKENS=0` has no effect.

### OpenRouter

Base URL `https://openrouter.ai/api`, with the auth token taken from `$OPENROUTER_API_KEY` and `ANTHROPIC_API_KEY=""` ("Must be explicitly empty"). [OpenRouter's](/tools/openrouter) example pins `ANTHROPIC_DEFAULT_OPUS_MODEL="~anthropic/claude-opus-latest[1m]"`, which keeps you on Claude. Its caveats: "Claude Code with OpenRouter is only guaranteed to work with the Anthropic first-party provider," and "Claude Code is optimized for Anthropic models and may not work correctly with other providers." Run `/logout` once if you were logged in, and don't rely on a `.env` file, because "The native Claude Code installer does not read standard `.env` files."

### Ollama

[Ollama](/tools/ollama) has a one-liner, `ollama launch claude`, besides the manual setup above. For Ollama's cloud, use `ANTHROPIC_BASE_URL=https://ollama.com` with the token from `$OLLAMA_API_KEY`. Its CI example is `ollama launch claude --model gemma4:cloud --yes -- -p "how does this repository work?"`, which pairs with [headless mode](/guides/configuration/claude-code-headless-mode). For local models, "set a 64k+ context window." Not supported: `/v1/messages/count_tokens`, prompt caching, the Batches API, citations and PDF support. (Ollama's compatibility page lists `tool_choice` both as a supported request field and as unsupported, so test it before relying on it.) Extended thinking has "Basic support; `budget_tokens` accepted but not enforced," and on the cloud, "Hosted WebSearch and advanced tool controls are not fully supported."

## What changes when the model isn't Claude

- **Commit trailer.** Since v2.1.251 the default trailer is `Co-Authored-By: Claude Code` when the active model isn't a recognized Claude model.
- **Remote Control and voice.** Remote Control is disabled when `ANTHROPIC_BASE_URL` points at a host other than `api.anthropic.com`. Remote Control and voice dictation are also unavailable while `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN` or an `apiKeyHelper` is active.
- **Request shape.** Over the Anthropic-format path, an unrecognized model ID receives "everything current Claude models accept… including adaptive reasoning, effort, and context management." Whether the endpoint honors those fields is up to the provider, which is what the limitation lists above describe.
- **Support.** Problems on these setups go to the provider.

When it breaks, run `/status` first. If the base URL and credential lines look right, check whether a settings-file `env` block is overriding your exports, whether every alias variable is set, and whether the context window matches the model. Picking between Claude models is its own question; [choosing the right model](/guides/getting-started/choosing-the-right-model) covers it.
