---
name: "LLM Guard"
title: "LLM Guard"
description: "LLM Guard is Protect AI's MIT-licensed library of input and output scanners for LLM apps. The project was archived in July 2026 and is unmaintained."
url: "https://protectai.github.io/llm-guard"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/protectai/llm-guard"
license: "MIT"
sameAs: ["https://github.com/protectai/llm-guard", "https://pypi.org/project/llm-guard/"]
os: ["Linux", "macOS", "Windows"]
color: "blue"
topics: ["ai-safety-security"]
audience: ["ai-engineers", "security"]
tags: ["guardrails", "security", "pii", "prompt-injection", "open-source"]
featured: false
related: ["tool:nemo-guardrails", "skill:llm-guardrails-designer", "skill:prompt-pii-redactor", "guide:defending-prompt-injection", "tool:promptfoo"]
alternativeTo: ["nemo-guardrails", "portkey"]
summary: "LLM Guard is an MIT-licensed Python library of 15 input and 21 output scanners for LLM apps, covering prompt injection, PII anonymization, secrets and toxicity. Protect AI archived the repository in July 2026, so the code and its Hugging Face models are unmaintained; the last PyPI release is 0.3.16 from May 2025. New projects should pick a maintained one."
faq:
  - q: "Is LLM Guard still maintained?"
    a: "No. The repository README opens with a notice that the project has been archived and that it and its associated Hugging Face models are no longer under active development or maintained. The archiving commit is dated July 8, 2026, and the last release on PyPI is 0.3.16 from May 19, 2025."
  - q: "Can I still use LLM Guard?"
    a: "Yes, technically. It is MIT-licensed, pip install llm-guard still works, and the scanners run locally. But nobody is fixing bugs, updating dependencies or retraining the detection models, and the package metadata limits it to Python 3.10 through 3.12. For a prompt-injection detector, a model that stops being retrained loses ground as attacks change."
  - q: "Who owns LLM Guard?"
    a: "Protect AI built it, and Palo Alto Networks completed its acquisition of Protect AI on July 22, 2025, saying the team and technology would become part of its Prisma AIRS AI security platform. The old protectai.com/llm-guard product page now returns a Palo Alto Networks 404."
  - q: "What should I use instead of LLM Guard?"
    a: "For programmable rails with built-in jailbreak and content-safety checks, NeMo Guardrails is maintained by NVIDIA under Apache-2.0. For PII masking at the gateway, LiteLLM's open-source guardrail framework includes Presidio. Gateways such as Portkey bundle guardrails with routing. Whatever you choose, test it with a red-team tool such as promptfoo."
---

LLM Guard is an open-source security toolkit for LLM applications from **Protect AI**: a Python library of **input and output scanners** that you chain around a model call. Input scanners sanitize or reject a prompt before the model sees it; output scanners check the response before your app trusts it.

> [!WARNING]
> **LLM Guard is archived.** The repository README states that the project and its associated models on Hugging Face "are no longer under active development or maintained". The archiving commit landed on July 8, 2026, and the last PyPI release, 0.3.16, is from May 19, 2025. Treat the rest of this page as documentation for an unmaintained library.

Protect AI was acquired by Palo Alto Networks, which completed the deal on July 22, 2025 and folded the team into its Prisma AIRS platform. The repository has about 3,200 GitHub stars as of November 2026 and stays available under the MIT license.

## Highlights

- **15 input scanners.** `Anonymize`, `BanCode`, `BanCompetitors`, `BanSubstrings`, `BanTopics`, `Code`, `Gibberish`, `InvisibleText`, `Language`, `PromptInjection`, `Regex`, `Secrets`, `Sentiment`, `TokenLimit` and `Toxicity`.
- **21 output scanners.** Among them `Deanonymize`, `Sensitive`, `NoRefusal`, `Relevance`, `FactualConsistency`, `MaliciousURLs`, `URLReachability`, `JSON`, `Bias` and `LanguageSame`.
- **One return shape.** Every scanner returns the sanitized text, a valid/invalid flag and a risk score, so you can block, log or pass through per scanner.
- **Reversible PII masking.** `Anonymize` replaces detected entities with placeholders and stores the originals in a `Vault`; `Deanonymize` restores them in the model's response.
- **Runs locally.** Scanners execute in your process, several of them using classifier models downloaded from Hugging Face, so scanned text does not leave your environment. The docs also describe deploying it as an API service.

## In an AI-assisted workflow

The quickstart pattern from the docs, scanning the prompt on the way in and the response on the way out:

```python
# pip install llm-guard
from llm_guard import scan_prompt, scan_output
from llm_guard.input_scanners import Anonymize, PromptInjection, TokenLimit, Toxicity
from llm_guard.output_scanners import Deanonymize, NoRefusal, Relevance, Sensitive
from llm_guard.vault import Vault

vault = Vault()
input_scanners = [Anonymize(vault), Toxicity(), TokenLimit(), PromptInjection()]
output_scanners = [Deanonymize(vault), NoRefusal(), Relevance(), Sensitive()]

sanitized_prompt, results_valid, results_score = scan_prompt(input_scanners, prompt)
if not all(results_valid.values()):
    raise ValueError(f"Prompt blocked: {results_score}")

response_text = call_your_model(sanitized_prompt)  # your own function

sanitized_response, results_valid, results_score = scan_output(
    output_scanners, sanitized_prompt, response_text
)
```

Scanners run in the order you pass them, and `fail_fast=True` stops at the first invalid result to cut latency. The reversible masking is the same pattern as the [prompt-pii-redactor](/skills/security/prompt-pii-redactor) skill, which you can use to build it without the dependency.

## Good to know

**Unmaintained means the detectors age.** Prompt-injection and toxicity scanners are classifiers trained on the attacks known when they were built. With no retraining, new jailbreak styles go undetected, and nobody will patch a vulnerable dependency in the library itself.

**Version ceiling.** PyPI metadata for 0.3.16 requires Python 3.10 or newer and below 3.13, so it will not install on Python 3.13 or later.

**Latency adds up.** Each model-based scanner is another inference on every request. Chain only what you need, and put cheap checks (`TokenLimit`, `Regex`, `BanSubstrings`) first.

**Scanners were never a full defense.** Even when maintained, a classifier catches a share of attacks, not all of them. Limit what the model can do with least-privilege tools and human approval for high-impact actions, as [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection) lays out.

**If you already run it,** pin the version and the model revisions, mirror the Hugging Face models you depend on, and plan a migration. Design the replacement layer with the [llm-guardrails-designer](/skills/security/llm-guardrails-designer) skill.

For a maintained alternative, [NeMo Guardrails](/tools/nemo-guardrails) from NVIDIA covers input, output, dialog and retrieval rails and plugs in third-party detectors. If your calls already pass through a gateway, [LiteLLM](/tools/litellm) ships Presidio PII masking in its open-source guardrail framework, and [Portkey](/tools/portkey) bundles guardrails with routing. Use [promptfoo](/tools/promptfoo) to red-team whichever layer you end up with.
