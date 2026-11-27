---
title: "Best LLM & RAG Evaluation Tools in 2026: DeepEval vs RAGAS vs LangSmith vs Phoenix vs promptfoo"
seoTitle: "Best LLM & RAG Eval Tools in 2026: DeepEval vs RAGAS vs LangSmith"
description: "A decision guide to the LLM eval landscape — code-first frameworks vs. eval-and-observability platforms, open-source vs. hosted, and which fits your stack."
author: "Imtiaz Rayhan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["llm-evals"]
audience: ["ai-engineers"]
tags: ["evals", "comparison", "rag", "observability", "tools"]
featured: true
summary: "Pick one code-first framework for the CI gate and one platform for production traces. DeepEval (pytest, Python) and promptfoo (YAML, CLI) gate merges; Ragas supplies RAG metrics. Langfuse and Phoenix are free to self-host; LangSmith and Braintrust are hosted with free tiers. A seven-tool table and two runnable examples are below."
keyTakeaways:
  - "Two categories: code-first eval frameworks (DeepEval, promptfoo, Ragas) and eval + observability platforms (LangSmith, Langfuse, Phoenix, Braintrust)."
  - "DeepEval is pytest-style Python and fails the test run through assert_test; promptfoo is a YAML-driven CLI whose eval command exits with code 100 when a test fails."
  - "Ragas is a metrics library, not a runner or a tracer: use it for context precision, context recall and faithfulness, inside whatever harness gates your CI."
  - "Licences differ in ways that matter: DeepEval and Ragas are Apache-2.0, promptfoo is MIT (and now part of OpenAI), Langfuse is MIT outside its ee folders, Phoenix is Elastic License 2.0."
  - "Only Langfuse and Phoenix can be fully self-hosted for free; LangSmith reserves self-hosting for Enterprise and Braintrust offers bring-your-own-cloud."
faq:
  - q: "What is the best LLM evaluation tool in 2026?"
    a: "It depends on what you're evaluating and where. For a code-first CI gate, DeepEval (Python/pytest) and promptfoo (YAML/CLI) lead; for RAG-specific metrics, Ragas. For production tracing plus online evals, Langfuse and Arize Phoenix (self-hostable) or LangSmith and Braintrust (hosted). Most teams use one framework for offline evals and one platform for observability."
  - q: "What's the difference between an eval framework and an observability platform?"
    a: "An eval framework (DeepEval, promptfoo, Ragas) scores outputs against a dataset, usually offline and in CI — it answers 'is this version better?' An observability platform (LangSmith, Langfuse, Phoenix, Braintrust) traces real runs and scores live traffic — it answers 'what is happening in production and why?' They're complementary: the framework gates merges, the platform watches production."
  - q: "Which LLM eval tools are open-source?"
    a: "DeepEval (Apache-2.0), Ragas (Apache-2.0), promptfoo (MIT), and Langfuse (MIT; its ee folders are commercially licensed) are open-source and self-hostable. Arize Phoenix is free to self-host but source-available under the Elastic License 2.0, not OSI open source. LangSmith and Braintrust are commercial platforms with free tiers, hosted by default: LangSmith lists self-hosted and hybrid deployment on its Enterprise plan, and Braintrust offers a bring-your-own-cloud data plane."
  - q: "Should I use RAGAS or DeepEval for a RAG system?"
    a: "Use both, or Ragas if you must pick one for RAG. Ragas is purpose-built for RAG with metrics that separate retrieval failures from generation failures (context precision/recall vs. faithfulness). DeepEval is a broader framework that also includes RAG metrics plus general and agent metrics, with a pytest-style API. Many teams run Ragas metrics inside a DeepEval or CI harness."
  - q: "Is promptfoo still open source after joining OpenAI?"
    a: "Yes. The promptfoo repository states that promptfoo is now part of OpenAI and remains open source and MIT licensed, and its pricing page still lists a free Community edition that runs locally or self-hosted. If vendor neutrality matters to you, note the ownership when you use it to compare OpenAI models against competitors, and keep your test configs in your own repository."
sources:
  - title: "DeepEval 5-min Quickstart"
    url: "https://deepeval.com/docs/getting-started"
    publisher: "Confident AI"
  - title: "promptfoo command line reference (exit codes)"
    url: "https://www.promptfoo.dev/docs/usage/command-line/"
    publisher: "promptfoo"
  - title: "promptfoo repository (MIT, part of OpenAI)"
    url: "https://github.com/promptfoo/promptfoo"
    publisher: "promptfoo"
  - title: "Ragas: list of available metrics"
    url: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/"
    publisher: "Ragas"
  - title: "Arize Phoenix LICENSE (Elastic License 2.0)"
    url: "https://github.com/Arize-ai/phoenix/blob/main/LICENSE"
    publisher: "Arize AI"
  - title: "Langfuse LICENSE file"
    url: "https://github.com/langfuse/langfuse/blob/main/LICENSE"
    publisher: "Langfuse"
  - title: "Self-host Langfuse"
    url: "https://langfuse.com/self-hosting"
    publisher: "Langfuse"
  - title: "LangSmith plans and pricing"
    url: "https://www.langchain.com/pricing"
    publisher: "LangChain"
  - title: "Braintrust pricing"
    url: "https://www.braintrust.dev/pricing"
    publisher: "Braintrust"
  - title: "Self-hosting Braintrust (legacy data plane, BYOC)"
    url: "https://docs.braintrust.dev/admin/self-hosting"
    publisher: "Braintrust"
related: ["tool:deepeval", "tool:ragas", "tool:langsmith", "tool:arize-phoenix", "tool:braintrust", "tool:langfuse", "tool:promptfoo", "guide:write-llm-evals", "agent:llm-evaluation-engineer"]
---

Once you've decided to [write evals](/guides/evaluation/write-llm-evals), the next question is what to build them on. The landscape looks crowded, but it splits into **two categories**, and the right answer for most teams is one tool from each: a framework that gates merges and a platform that watches production.

## The two categories

1. **Code-first eval frameworks** — libraries you run locally and in CI to score outputs against a dataset. Offline, version-controlled, regression-gating. **DeepEval, promptfoo, Ragas.**
2. **Eval + observability platforms** — hosted or self-hosted services that trace production runs, score live traffic, and manage datasets and prompts. **LangSmith, Langfuse, Arize Phoenix, Braintrust.**

The framework answers *"is this version better?"* before you ship. The platform answers *"what is happening in production, and why?"* after you ship.

## The seven tools side by side

Licences, hosting and free tiers checked against each vendor's repository and pricing page in November 2026. Dollar prices live on the linked tool pages.

| Tool | Type | Licence | Self-host | Free tier | RAG metrics | CI gate | Tracing |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [DeepEval](/tools/deepeval) | Python framework (pytest plugin) | Apache-2.0 | Runs locally; optional Confident AI cloud | Framework free; Confident AI free plan has 2 seats and 5 test runs a week | Built in, plus agent and multi-turn metrics | `deepeval test run` fails like pytest | Eval-time tracing; production monitoring via Confident AI |
| [promptfoo](/tools/promptfoo) | Node CLI, YAML config | MIT (part of OpenAI) | Runs locally or self-hosted | Community edition free; red teaming capped at 10k probes a month | Context recall, relevance and faithfulness assertions | `promptfoo eval` exits `100` on any failed test | Not for production (local web viewer for results) |
| [Ragas](/tools/ragas) | Python metrics library | Apache-2.0 | Runs locally | Free | Its core job: context precision, context recall, faithfulness, response relevancy, noise sensitivity | Bring your own runner | No |
| [Langfuse](/tools/langfuse) | Platform | MIT, except `ee` folders | Yes: Docker Compose or Kubernetes (Helm) | Cloud Hobby plan: 50k units a month | LLM-as-judge evaluators on traces and datasets | Dataset experiments through the SDK | Yes |
| [Arize Phoenix](/tools/arize-phoenix) | Platform | Elastic License 2.0 | Yes, free | Self-hosted Phoenix is free; managed Arize AX Free has 25k spans a month | Evaluators and experiments | Experiments from code | Yes (OpenInference instrumentation) |
| [LangSmith](/tools/langsmith) | Platform | Commercial | Enterprise plan only (self-hosted or hybrid) | Developer plan: 1 seat, 5k base traces a month | Evaluators on datasets and live traces | Experiments from the SDK | Yes |
| [Braintrust](/tools/braintrust) | Platform | Commercial | Bring-your-own-cloud data plane | Starter plan: 1 GB processed data and 10k scores a month | Scorers (LLM judge, code) | Experiments from the SDK | Yes |

Two things in that table change faster than the rest: free-tier allowances and who owns what. The promptfoo repository now opens with the notice that "Promptfoo is now part of OpenAI" and "remains open source and MIT licensed", and Ragas has moved its repository to the `vibrantlabsai` GitHub organization (the old `explodinggradients/ragas` URL redirects).

## Code-first frameworks

### DeepEval: evals as pytest tests

[DeepEval](/tools/deepeval) plugs into pytest, so an eval is a test function and a regression is a failed test. Install it with `pip install -U deepeval`, then write a test. This one is from the DeepEval quickstart, with the outputs shortened:

```python
# test_example.py
from deepeval import assert_test
from deepeval.test_case import LLMTestCase, SingleTurnParams
from deepeval.metrics import GEval

def test_correctness():
    correctness_metric = GEval(
        name="Correctness",
        criteria="Determine if the 'actual output' is correct based on the 'expected output'.",
        evaluation_params=[SingleTurnParams.ACTUAL_OUTPUT, SingleTurnParams.EXPECTED_OUTPUT],
        threshold=0.5,
    )
    test_case = LLMTestCase(
        input="I have a persistent cough and fever. Should I be worried?",
        actual_output="It could be a viral infection. See a doctor if it doesn't improve in a few days.",  # your app's output
        expected_output="It may be a mild viral infection or something more serious. Seek medical attention if symptoms worsen or persist.",
    )
    assert_test(test_case, [correctness_metric])
```

Run it with `deepeval test run test_example.py`. `GEval` is an LLM-as-judge metric, so it needs a judge model: the quickstart has you set `OPENAI_API_KEY` or configure another provider. Everything runs locally; `deepeval login` is only needed if you want results in Confident AI. Version 4.3.6 was the current PyPI release on November 25, 2026.

**Where it loses:** it is Python-only, most of its metrics call a judge model (so a full run costs tokens and is not perfectly repeatable), and the hosted dashboard is a separate commercial product.

### promptfoo: a YAML matrix and a CLI

[promptfoo](/tools/promptfoo) declares prompts, providers and assertions in `promptfooconfig.yaml` and runs every combination. Start from the bundled example with `npx promptfoo@latest init --example getting-started`, or write the config yourself:

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
      - type: icontains
        value: 'Dónde está la biblioteca'
```

`npx promptfoo@latest eval` runs it and `npx promptfoo@latest view` opens the comparison table. For CI, the documented behaviour is that `eval` returns exit code `100` when at least one test case fails or the pass rate is below `PROMPTFOO_PASS_RATE_THRESHOLD`, and `1` for any other error, so a plain workflow step is already a gate. There is also an official GitHub Action, `promptfoo/promptfoo-action@v1`, that comments a before/after link on pull requests touching your prompts.

**Where it loses:** `contains`-style assertions are brittle on free-form output, so real suites lean on model-graded assertions and pay for them; the tool is a Node CLI even when your app is Python; and it is now owned by one of the model vendors you may be comparing.

### Ragas: the RAG metrics

[Ragas](/tools/ragas) is a metrics library. Its retrieval-augmented generation set separates retrieval failures (context precision, context recall, noise sensitivity) from generation failures (faithfulness, response relevancy), and it also ships agent metrics such as tool call accuracy and agent goal accuracy. Install with `pip install ragas`; version 0.4.4 was current on PyPI in November 2026.

**Where it loses:** it has no test runner, no tracing and no dashboard. You call the metrics from your own script, pytest, or one of the tools above.

> [!NOTE]
> These aren't mutually exclusive. It's common to run Ragas metrics inside a DeepEval or CI harness, or to use promptfoo for model and prompt selection and DeepEval for the regression suite. The two frameworks are compared head-to-head in [DeepEval vs RAGAS](/guides/comparisons/deepeval-vs-ragas).

## Eval + observability platforms

- **[Langfuse](/tools/langfuse)** — tracing, evals, prompt management and metrics. MIT licensed apart from its `ee` folders, and self-hostable with Docker Compose for testing or Kubernetes (Helm) for production; some add-on features need a licence key. Loses when you don't want to operate its storage stack yourself, in which case you are comparing its cloud plans with everyone else's.
- **[Arize Phoenix](/tools/arize-phoenix)** — local-first tracing, evaluation and experiments built on OpenInference instrumentation. Free to self-host, but under the Elastic License 2.0, which is source-available rather than open source: you cannot offer it to others as a managed service. The managed product is Arize AX.
- **[LangSmith](/tools/langsmith)** — LangChain's hosted platform for tracing, datasets and online evals. The free Developer plan is a single seat, base traces are retained for 14 days and extended traces for 180, and self-hosted or hybrid deployment is listed only under Enterprise. Loses on data control for small teams.
- **[Braintrust](/tools/braintrust)** — hosted evals, playground and production logging. Its Starter and Pro plans do not limit users, projects or experiments; billing is by processed data and scores. Braintrust's docs now describe the customer-run data plane as legacy and point new organizations to bring-your-own-cloud, so there is no fully self-contained install.

[Langfuse vs LangSmith](/guides/comparisons/langfuse-vs-langsmith) and the wider [LLM observability comparison](/guides/comparisons/best-llm-observability-tools-2026) go deeper on this half.

## How to choose

The table answers "what does each tool do". These questions decide between tools that both qualify:

- **Can traces leave your network?** If no, the platform shortlist is Langfuse or Phoenix self-hosted. If your legal team also requires an OSI-approved licence, it is Langfuse.
- **What language is the app in?** Python teams get the least friction from DeepEval, because evals sit next to unit tests. Polyglot or TypeScript teams usually prefer promptfoo, since the config is language-neutral.
- **Is the main question "which model or prompt?" or "did we regress?"** A side-by-side matrix across providers is promptfoo's native shape. A growing regression suite with per-metric thresholds is DeepEval's.
- **Is the system RAG?** Add Ragas metrics, or use the RAG metrics in DeepEval or promptfoo if you want one dependency.
- **Do you need security testing?** promptfoo includes red teaming for prompt injection and jailbreaks; the free edition caps it at 10k probes a month.
- **How many people need a seat?** Seat-priced plans (LangSmith) and usage-priced plans (Langfuse, Braintrust) diverge quickly as a team grows. Check the tool pages for current figures.

The common 2026 setup is still one framework in CI and one platform on production, with real failures from traces copied back into the offline dataset.

> [!TIP]
> Don't start by choosing a tool. Start by [building a dataset and a baseline](/guides/evaluation/write-llm-evals) — the method matters more than the framework, and every tool here implements the same underlying loop.

For handing the build off, the [llm-evaluation-engineer](/agents/data-ai/llm-evaluation-engineer) owns the offline suite and the [llm-observability-engineer](/agents/data-ai/llm-observability-engineer) owns production tracing and online evals.
