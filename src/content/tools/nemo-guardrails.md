---
name: "NeMo Guardrails"
title: "NeMo Guardrails"
description: "NVIDIA's Apache-2.0 library for input, output and tool-call guardrails on LLM apps and agents. Version 0.25.0 deprecates LLMRails and the Colang runtimes."
url: "https://github.com/NVIDIA-NeMo/Guardrails"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/NVIDIA-NeMo/Guardrails"
license: "Apache-2.0"
sameAs: ["https://github.com/NVIDIA-NeMo/Guardrails", "https://docs.nvidia.com/nemo/guardrails/latest/index.html"]
os: ["Linux", "macOS", "Windows"]
color: "green"
topics: ["ai-safety-security"]
audience: ["ai-engineers", "security"]
tags: ["guardrails", "safety", "llm", "open-source"]
featured: false
related: ["skill:llm-guardrails-designer", "tool:llm-guard", "guide:defending-prompt-injection", "guide:owasp-agentic-top-10"]
alternativeTo: ["llm-guard", "portkey"]
summary: "NeMo Guardrails is NVIDIA's Apache-2.0 Python library for policy checks on LLM apps and agents: input and output rails plus tool-call and tool-result rails, declared in config.yml and run in check mode, proxy mode or as a server. Version 0.25.0 (November 2026) deprecates the LLMRails engine and both Colang runtimes in favor of Guardrails and IORails."
faq:
  - q: "Is Colang deprecated in NeMo Guardrails?"
    a: "Yes. The 0.25.0 migration guide says the release deprecates the LLMRails engine and the Colang 1.0 and Colang 2.x runtimes, with removal planned no earlier than 0.27.0. The replacement IORails engine reads Colang 1.0 configurations but does not run their dialog flows, and it will not support Colang 2.x. NVIDIA's guidance is to move dialog-flow logic into input and output rails."
  - q: "Is NeMo Guardrails free?"
    a: "Yes. The library is Apache-2.0 and free to run. Costs come from the models your rails call: an LLM self-check or a safety model is an extra inference per request, whether you host it or call an endpoint. The README notes that NVIDIA Build endpoints are for evaluation and testing only, not production."
  - q: "How much latency does NeMo Guardrails add?"
    a: "NVIDIA's README benchmark, run with mock models on an Apple M4 laptop, shows the server adding a median of 11 to 17 ms per request on the IORails engine across concurrency 1 to 128, against 39 to 430 ms on LLMRails. That excludes the guardrail models' own inference time, which usually dominates."
  - q: "Does NeMo Guardrails send telemetry?"
    a: "Yes, by default. The README says the library sends anonymous usage telemetry that excludes prompts, completions, model names, credentials and endpoints. Set NEMO_GUARDRAILS_NO_USAGE_STATS=1 to opt out."
---

NeMo Guardrails is NVIDIA's open-source library for applying programmable safety and security checks to LLM applications and agents. You declare a policy in configuration, and the library runs **rails** at fixed points: on the user's input, on the model's output, on a tool call before it executes, and on a tool result before the model reads it. It is Apache-2.0, has about 7,600 GitHub stars as of November 2026, and the current release is 0.25.0 (November 19, 2026), which requires Python 3.11 to 3.13.

If you knew this project as "the Colang one", read the next paragraph first. Version 0.25.0 deprecates the `LLMRails` engine and both Colang runtimes. The replacement is the `Guardrails` class running the `IORails` engine, which is built around input, output and tool rails and does not run Colang dialog flows. Removal of the old engine is planned no earlier than 0.27.0, and until then it keeps working.

## Highlights

- **Tool rails for agents.** Validate tool names and argument schemas before execution, apply per-tool policies, and check tool results before they go back to the model. These run on IORails only.
- **Two integration modes.** In *check mode* your app keeps its own model and agent loop and asks the library for a verdict (`check_async()` in Python or `POST /v1/checks` on the server). In *proxy mode* you route model requests through it (`generate_async()`, `stream_async()`, or `POST /v1/chat/completions`).
- **Deterministic and model-backed checks together.** Local regex and CEL expression rules cost almost nothing; safety models and LLM self-checks catch what patterns cannot.
- **A guardrail catalog.** Content safety, topic control, jailbreak detection, injection detection (code, SQL, template and XSS patterns in output), PII detection and masking, fact-checking and hallucination checks, language detection, and third-party moderation services.
- **NVIDIA safety models.** Configs and guides for Nemotron 3.5 Content Safety, Nemotron Content Safety Reasoning 4B and Llama 3.1 Nemotron Safety Guard 8B V3.
- **Hooks for coding agents.** A hooks server checks a coding assistant's tool calls before they run.

## In an AI-assisted workflow

The README quickstart needs no model or API key. It blocks an agent's refund tool call when the amount exceeds a limit, using a CEL rule:

```python
# pip install "nemoguardrails[cel]"
import asyncio, json
from nemoguardrails import Guardrails, RailsConfig
from nemoguardrails.rails.llm.options import RailStatus, RailType

config = RailsConfig.from_content(yaml_content="""
models: []
rails:
  tool_call:
    flows: [tool call validation]
    per_tool:
      issue_refund: [cel check tool call]
  config:
    cel:
      tool_call:
        issue_refund:
          expressions: ["args.amount > 500"]
""")

TOOLS = [{"type": "function", "function": {
    "name": "issue_refund",
    "parameters": {"type": "object",
                   "properties": {"amount": {"type": "number", "minimum": 0}},
                   "required": ["amount"], "additionalProperties": False}}}]

async def main():
    async with Guardrails(config, require_iorails=True) as rails:
        call = {"role": "assistant", "tool_calls": [{
            "id": "call_1", "type": "function",
            "function": {"name": "issue_refund",
                         "arguments": json.dumps({"amount": 5000})}}]}
        result = await rails.check_async(
            [call], rail_types=[RailType.TOOL_CALL], tools=TOOLS)
        print(result.status.value)          # blocked
        if result.status != RailStatus.PASSED:
            print(result.rail)              # cel check tool call

asyncio.run(main())
```

Your application executes the tool only when the check passes. The same call shape checks user input and model output: pass `user` or `assistant` messages and the library picks input or output rails from the roles.

Work out which rails you need before configuring any, with the [llm-guardrails-designer](/skills/security/llm-guardrails-designer) skill, and map them to the risks in the [OWASP Agentic Top 10](/guides/ai-safety/owasp-agentic-top-10).

> [!WARNING]
> With output streaming on, the default `stream_first: true` delivers chunks to the user before checking them. Set `rails.output.streaming.stream_first: false` if a blocked response must never reach the screen.

## Good to know

**Migration is real work if you used Colang.** `Guardrails(config)` reads the same `config.yml`, but dialog flows (`define flow`, `define user`) are ignored on IORails, and a Colang 2.x configuration has no replacement runtime at all. Topic restrictions move to an input rail such as topic control. Existing code that constructs `LLMRails` now emits an `LLMRailsRemovalWarning`.

**Rail support differs by engine and integration.** Tool rails are IORails only, and the gateway server's built-in profiles do not support tool content. Check the rail engine support table before designing around a feature.

**Every model-backed rail costs an inference.** Latency and cost depend on what you configure. NVIDIA's own benchmark puts the library's overhead on IORails at a median of 11 to 17 ms, but that is measured with mock models; a real content-safety model adds its own response time on input and again on output.

**Telemetry is on by default.** It is anonymous and excludes prompts and completions; `NEMO_GUARDRAILS_NO_USAGE_STATS=1` turns it off. Separately, any hosted guardrail endpoint you configure receives the content it checks.

**Guardrails reduce risk; they do not remove it.** A classifier misses some attacks. Keep least-privilege tool access and human approval for high-impact actions, as [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection) describes, and test the policy with the library's evaluation tools or NVIDIA's garak scanner.

Against the alternatives: [LLM Guard](/tools/llm-guard) offered a similar set of input and output scanners as a plain Python library, but its repository was archived in July 2026 and is unmaintained. If your traffic already runs through a gateway, [Portkey](/tools/portkey) and [LiteLLM](/tools/litellm) attach guardrails at that layer, which saves a service but gives you less control over tool-call policy. To attack your own setup before someone else does, use [promptfoo](/tools/promptfoo)'s red-team mode.
