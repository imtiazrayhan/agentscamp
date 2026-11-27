---
name: "promptfoo"
title: "promptfoo"
description: "An open-source CLI for testing, comparing, and red-teaming LLM prompts, models, and apps."
seoDescription: "promptfoo is an open-source, MIT-licensed CLI, now part of OpenAI, for testing, comparing and red-teaming LLM prompts, models and apps from a YAML config."
url: "https://www.promptfoo.dev"
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "open-source"
category: "evaluation"
repo: "https://github.com/promptfoo/promptfoo"
license: "MIT"
sameAs: ["https://github.com/promptfoo/promptfoo", "https://www.promptfoo.dev/docs"]
color: "red"
topics: ["llm-evals", "ai-safety-security"]
audience: ["ai-engineers"]
tags: ["evals", "testing", "red-teaming", "security", "open-source", "cli"]
featured: false
alternativeTo: ["deepeval"]
summary: "promptfoo is an MIT-licensed CLI for evaluating LLM prompts and models from a YAML config, with a red-teaming mode that generates attacks such as prompt injections and jailbreaks against your app. Evals run locally and drop into CI. The company joined OpenAI in March 2026 and says the tool stays open source; paid editions add team features."
related: ["guide:best-llm-eval-tools-2026", "tool:deepeval", "agent:llm-evaluation-engineer", "guide:defending-prompt-injection", "command:red-team-llm"]
faq:
  - q: "Is promptfoo free?"
    a: "The CLI is open source under the MIT license, and the pricing page calls the Community edition free forever, with up to 10,000 red-team probes a month at no charge as of November 2026. Enterprise and On-Premise editions are custom-priced and add team sharing, continuous monitoring, SSO and dashboards. Model-graded assertions and red-team attack generation call an LLM, so you also pay your provider for tokens."
  - q: "Is promptfoo owned by OpenAI?"
    a: "Yes. Promptfoo announced on March 9, 2026 that it was joining OpenAI. The announcement and the README both say promptfoo remains open source and MIT licensed, and the tool still tests models from Anthropic, Google, Azure, Bedrock, Ollama and other providers. If vendor independence of your eval tooling matters to you, that ownership is worth knowing."
  - q: "How do I run promptfoo?"
    a: "Run npx promptfoo@latest init --example getting-started to create a promptfooconfig.yaml with prompts, providers and tests, set your provider key, then run npx promptfoo@latest eval and npx promptfoo@latest view to open the results matrix. You can also install it with npm install -g promptfoo, brew install promptfoo or pip install promptfoo. The docs list Node.js 22.22.0 or later as the prerequisite."
  - q: "promptfoo vs DeepEval?"
    a: "promptfoo is configured in YAML and run from a CLI, works with any language, and has a built-in red-teaming mode. DeepEval is a Python framework where evals are pytest-style test functions with a large set of ready-made metrics. Pick promptfoo for side-by-side prompt and model comparisons and security scanning, and DeepEval when your team wants evals written and versioned as Python tests."
---

promptfoo is an open-source command-line tool for evaluating LLM outputs. You declare prompts, providers and test cases in a YAML file, and it runs every prompt against every model and shows the results in a side-by-side matrix, so you can see which combination passes your assertions. A second mode, **red teaming**, generates adversarial inputs to probe an application for prompt injection, jailbreaks and data leaks.

The company behind it announced on March 9, 2026 that it was joining OpenAI. The README states that promptfoo "remains open source and MIT licensed". It suits engineers who want evals as a fast, config-driven step in the terminal and CI instead of a hosted platform.

## Highlights

- **Matrix evals.** Prompts × providers × test cases, viewed in a local web UI with `promptfoo view` or exported as JSON and HTML.
- **Declarative assertions.** Deterministic checks such as `contains`, `icontains`, `is-json`, `cost` and `latency`; model-graded checks such as `llm-rubric` and `g-eval`; and custom `javascript`, `python` or `ruby` functions.
- **Many providers.** The docs list 60+ providers, including OpenAI, Anthropic, Google, Azure, Bedrock and local models through Ollama, plus custom Python and JavaScript code.
- **Red teaming.** `promptfoo redteam setup` opens a UI where you describe the target, choose plugins and attack strategies, then `redteam run` executes the scan and `redteam report` shows the findings. Attacks include direct and indirect prompt injection, jailbreaks, PII leaks, business-rule violations and insecure tool use in agents.
- **Local by default.** The README says evals run entirely on your machine and your prompts do not leave it, apart from the calls to the model providers you configure.
- **CI and code scanning.** Runs headlessly in GitHub Actions, GitLab and Jenkins, and a code-scanning feature reviews pull requests for LLM-related security issues.

## In an AI-assisted workflow

```yaml
# promptfooconfig.yaml
prompts:
  - 'Convert the following English text to {{language}}: {{input}}'
providers:
  - openai:gpt-6-sol
  - openai:gpt-6-luna
tests:
  - vars:
      language: French
      input: Hello world
    assert:
      - type: contains
        value: 'Bonjour le monde'
  - vars:
      language: Spanish
      input: Where is the library?
    assert:
      - type: llm-rubric
        value: 'Is a natural Spanish translation of the input'
```

```bash
export OPENAI_API_KEY=sk-abc123
npx promptfoo@latest eval
npx promptfoo@latest view
```

The provider ids above are the ones in promptfoo's getting-started guide as of November 2026; swap in whichever models you are comparing. In CI, the documented pattern is to write results to a file and gate on the failure count:

```bash
npx promptfoo@latest eval -c promptfooconfig.yaml -o results.json
FAILURES=$(jq '.results.stats.failures' results.json)
[ "$FAILURES" -gt 0 ] && exit 1
```

> [!TIP]
> Use the two modes for different questions. The eval matrix answers "which prompt and model is best for my cases?" The red-team scan answers "how does my deployed app fail under attack?" and belongs before launch and after any change to tools or system prompts. See [defending against prompt injection](/guides/ai-safety/defending-prompt-injection) for what to do with the findings.

## Good to know

- **Pricing.** As of November 2026 the Community edition is free and includes up to 10,000 red-team probes a month. Enterprise (team sharing, continuous monitoring, SSO, centralized dashboards) and On-Premise (deployment on your infrastructure with full data isolation) are custom-priced.
- **Ownership.** Being part of OpenAI does not change the licence, but it is context when you use the tool to compare OpenAI models against competitors. The tests and assertions are yours and visible in the config, which is the practical safeguard.
- **Requirements and version.** Node.js 22.22.0 or later. The npm package is at 0.126.0 as of November 2026, and the project has about 27,800 GitHub stars.
- **Cost of model-graded checks.** `llm-rubric` and red-team generation call an LLM for each test, so large matrices multiply quickly. Results are cached, and deterministic assertions are free.
- **Limits.** It scores outputs you define cases for. It is not a tracing or production-monitoring platform, and the team dashboards live in the paid editions.

Against the alternatives: [DeepEval](/tools/deepeval) puts evals in Python as pytest-style tests with ready-made RAG and agent metrics. [RAGAS](/tools/ragas) is a focused library of RAG metrics. [Braintrust](/tools/braintrust) is a hosted platform that adds experiment history, a playground and production tracing. For the broader landscape, see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
