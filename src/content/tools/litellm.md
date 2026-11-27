---
name: "LiteLLM"
title: "LiteLLM"
description: "LiteLLM is an open-source Python SDK and self-hosted AI gateway that calls 100+ LLM providers in the OpenAI format, with keys, budgets and fallbacks."
url: "https://www.litellm.ai"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/BerriAI/litellm"
license: "MIT"
sameAs: ["https://github.com/BerriAI/litellm", "https://docs.litellm.ai"]
color: "blue"
topics: ["llm-app-dev", "devops-infra"]
audience: ["ai-engineers"]
tags: ["gateway", "proxy", "multi-provider", "open-source", "python"]
featured: false
alternativeTo: ["openrouter", "vercel-ai-sdk", "portkey"]
summary: "LiteLLM, from BerriAI, calls 100+ LLM providers through one OpenAI-format interface. Use the MIT-licensed Python SDK in-process, or run the proxy as a self-hosted gateway on port 4000 with virtual keys, budgets, fallbacks and spend tracking. Self-hosting is free; Enterprise adds SSO, audit logs and support on a quoted annual license."
related: ["tool:openrouter", "guide:calling-any-model-gateways", "guide:llm-gateways-compared", "skill:provider-fallback-wrapper", "tool:vercel-ai-sdk"]
faq:
  - q: "Is LiteLLM free?"
    a: "The SDK and the gateway are free to self-host, including in production, and you pay your model providers directly. As of November 2026, LiteLLM's pricing page lists Open Source at $0 and Enterprise as an annual license quoted by sales, sized to gateway request capacity, deployment architecture and support needs, never per token. A 30-day Enterprise trial key is available."
  - q: "What does LiteLLM Enterprise add?"
    a: "A license key on the same gateway image turns on SSO and SCIM, JWT/OIDC auth, audit logs with retention policies, secret-manager integrations, organization and team admin roles, tag-based budgets and a support channel with optional 24/7 SLAs. The docs say SSO is free for up to 5 users. Several built-in guardrail callbacks, including hide_secrets and llmguard_moderations, also need the license."
  - q: "LiteLLM vs OpenRouter?"
    a: "Both put many models behind one OpenAI-compatible interface. LiteLLM is software you run, so provider keys, logs and policies stay in your infrastructure and you carry the operations. OpenRouter is a hosted gateway with one key and one bill. The LiteLLM vs OpenRouter comparison covers the trade in detail."
  - q: "Was LiteLLM affected by a supply-chain attack?"
    a: "Yes. LiteLLM's security update says PyPI packages litellm 1.82.7 and 1.82.8 were malicious, live for about 40 minutes on March 24, 2026, and carried a credential stealer; the official Docker image was not affected, and v1.83.0 was the first release from a rebuilt pipeline. Pin versions and check anything installed that day."
---

LiteLLM is an open-source AI gateway from BerriAI (Y Combinator W23) that gives you one interface to 100+ LLM providers, including OpenAI, Anthropic, Gemini, Bedrock and Azure, using the OpenAI request format. It comes in two forms: a **Python SDK** you import, and a **proxy server** (the AI Gateway) you deploy as a shared service. The repository has about 64,000 GitHub stars as of November 2026, and the current release is v1.111.0, published to PyPI on November 25, 2026.

The SDK suits one app that wants to switch models without switching client libraries. The proxy is for platform teams that want one place to hold provider keys, hand out scoped keys, cap spend and reroute traffic when a provider fails.

## Highlights

- **One format, many providers.** The same `completion()` call reaches any provider by changing the model string, written as `provider/model-id`. The gateway exposes `/chat/completions`, `/responses`, `/embeddings`, `/images`, `/audio`, `/batches`, `/rerank` and Anthropic-style `/messages`.
- **Virtual keys.** Apps and teammates get a gateway key instead of a raw provider key. Each key can carry its own budget, rate limits and model allowlist, and spend is tracked per key, user and team.
- **Fallbacks and retries.** Three fallback types: `fallbacks` for general errors such as rate limits, `context_window_fallbacks` and `content_policy_fallbacks`. Set them in config or per request.
- **Admin UI.** Served at `/ui` on the gateway for adding models, creating keys, viewing spend and testing in a playground.
- **MCP and A2A.** The gateway can front MCP servers (clients connect at `/mcp/`) and A2A agents, so tool and agent access goes through the same keys and logs.
- **Observability hooks.** Request and response logging, Prometheus metrics and Slack alerting for provider errors, slow requests and budget crossings.

## In an AI-assisted workflow

The SDK, with real model ids:

```python
# pip install litellm   (Python 3.10+)
from litellm import completion

messages = [{"role": "user", "content": "Summarize this diff in one line."}]

# keys are read from OPENAI_API_KEY and ANTHROPIC_API_KEY
a = completion(model="openai/gpt-6.2-sol", messages=messages)
b = completion(model="anthropic/claude-sonnet-5-5", messages=messages)
print(b.choices[0].message.content)
```

The gateway, from a config file and the official image:

```yaml
# litellm_config.yaml
model_list:
  - model_name: sol
    litellm_params:
      model: openai/gpt-6.2-sol
      api_key: os.environ/OPENAI_API_KEY
  - model_name: sonnet
    litellm_params:
      model: anthropic/claude-sonnet-5-5
      api_key: os.environ/ANTHROPIC_API_KEY

litellm_settings:
  fallbacks: [{"sol": ["sonnet"]}]
```

```bash
export LITELLM_MASTER_KEY="sk-<paste-a-long-random-key>"
docker run \
  -v "$PWD/litellm_config.yaml:/app/config.yaml:ro" \
  -e OPENAI_API_KEY -e ANTHROPIC_API_KEY -e LITELLM_MASTER_KEY \
  -p 127.0.0.1:4000:4000 \
  docker.litellm.ai/berriai/litellm:latest \
  --config /app/config.yaml

curl http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "sol", "messages": [{"role": "user", "content": "Say hello."}]}'
```

Any OpenAI SDK works against it by setting `base_url` to `http://localhost:4000`. Without Docker, `uv tool install 'litellm[proxy]'` then `litellm --config litellm_config.yaml` starts the same server. For the full setup with PostgreSQL and the Admin UI, the docs ship a `docker-compose.quickstart.yml`.

> [!WARNING]
> The config-file mode above has no database, and the docs are explicit about what that costs: virtual keys fail with `No connected db.` and `max_budget` is not enforced, so the gateway keeps serving past the limit with no error. Run Postgres before you rely on budgets.

## Pricing

As of November 2026, LiteLLM's pricing page lists two plans. **Open Source** is $0, self-hosted, and includes the provider coverage, virtual keys, users and teams, spend tracking, budgets and rate limits, fallbacks, logging and Prometheus metrics. **Enterprise** is "Talk to sales": an annual license sized to your gateway request capacity, deployment architecture and support needs, not billed per token. It adds SSO and SCIM, OIDC/JWT auth, audit logs, secret managers with key rotation, org and team admins, a multi-region control plane and support SLAs, with air-gapped deployment available. There is a 30-day Enterprise trial key, and you can buy through the AWS and Azure marketplaces. Because you bring your own provider keys, model usage is billed by each provider directly.

## Good to know

**Licence.** The repository is MIT except the `litellm/enterprise/` directory, which has its own commercial license. Enterprise features are gated by a `LITELLM_LICENSE` key on the same image.

**It is infrastructure you operate.** Every model call depends on the gateway being up. The production checklist starts load testing at 1 vCPU and 4 GB of memory per worker, recommends one Uvicorn worker per pod on Kubernetes, and calls for Redis 7.0 or newer as soon as you run more than one instance. Monitor the gateway from outside, because a stopped gateway cannot alert on itself.

**Guard two keys.** `LITELLM_MASTER_KEY` authorizes every admin call and is the default Admin UI password. `LITELLM_SALT_KEY` encrypts provider keys stored in the database and has no in-place rotation: change it and every stored credential becomes unreadable until re-entered.

**Pin releases.** LiteLLM ships often, and in March 2026 two malicious versions (1.82.7 and 1.82.8) reached PyPI for about 40 minutes before being quarantined. The official Docker image was not affected. The docs now tell you to pin a tested release tag or image digest before production instead of `latest`.

**Fallbacks across providers lose reasoning state.** A fallback target on another provider cannot decrypt the encrypted reasoning items or thinking blocks from earlier turns, so it reasons fresh.

LiteLLM publishes a figure of 8 ms P95 gateway latency at 1,000 requests per second; that is the vendor's own benchmark, so measure on your hardware.

If you would rather not run a gateway, [OpenRouter](/tools/openrouter) is the hosted equivalent with one key and one bill ([LiteLLM vs OpenRouter](/guides/comparisons/litellm-vs-openrouter) walks through the choice). [Portkey](/tools/portkey) is another gateway with a hosted control plane and built-in guardrails. In a TypeScript app that only needs provider switching in code, the [Vercel AI SDK](/tools/vercel-ai-sdk) does that without a separate service. [LLM gateways compared](/guides/advanced/llm-gateways-compared) and [Calling Any Model](/guides/concepts/calling-any-model-gateways) cover the pattern.
