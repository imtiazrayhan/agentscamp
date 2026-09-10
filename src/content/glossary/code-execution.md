---
term: "Code Execution (Code Interpreter)"
description: "Code execution lets an AI assistant write and run real code in a sandbox, so numbers, files, and charts come from a computation rather than an estimate."
date: 2026-09-10
topics: ["ai-at-work", "llm-app-dev"]
audience: ["analysts"]
tags: ["code-execution", "code-interpreter", "sandbox", "data", "analysts"]
related: ["tool:claude", "tool:chatgpt", "guide:claude-for-data-analysis", "guide:chatgpt-vs-claude-for-data-analysis", "glossary:ai-agent", "glossary:hallucination"]
summary: "Code execution, also called code interpreter, is the capability that lets an assistant write and run code in a sandboxed container instead of reasoning about numbers in text. It is the single feature that separates real analysis from a plausible-looking answer, and the container is isolated from your systems with its outbound network tightly controlled."
faq:
  - q: "Why does code execution reduce wrong answers?"
    a: "Because the arithmetic stops being a prediction. A model asked to sum a column in prose is producing text that resembles a total; a model that writes and runs the code is producing the total. Anthropic's framing when it introduced the feature was that results become mathematically precise and reproducible rather than estimated."
  - q: "Does the sandbox have internet access?"
    a: "It depends on the product. OpenAI documents that its analysis environment cannot make external web requests, and Anthropic's API code execution container has internet access completely disabled, so only pre-installed libraries are available. In the Claude apps it is a setting rather than a fixed property: network egress is on by default for Free, Pro, and Max and off by default for Team and Enterprise, where an owner chooses between no network, package managers only, package managers plus named domains, or all domains. In none of them does the sandbox go looking for data you did not supply."
  - q: "Is code execution the same as an agent?"
    a: "No. Code execution is one tool an assistant can call. An agent is the loop around it: deciding what to do, calling tools, checking results, and continuing. Most useful analysis agents lean on code execution heavily, but running code is a capability rather than an architecture."
---

**Code execution, often called code interpreter, is the capability that lets an AI assistant write real code and run it in a sandboxed container, then use the output in its answer.** For anyone working with data, it is the line between analysis and plausible-sounding text.

The mechanics are consistent across products. You upload a file, the model writes code, a container runs it, and the results come back as tables, charts, or files. [ChatGPT](/tools/chatgpt) runs Python in a stateful notebook session where variables persist between turns. [Claude](/tools/claude) runs code in an isolated container and can turn the result into a real `.xlsx`, `.docx`, `.pptx`, or PDF, with a documented ceiling of 30MB per file for uploads and downloads. Neither sandbox browses on your behalf, which is a safety property rather than a limitation: any data you want analyzed has to be uploaded or connected first. OpenAI's environment cannot make external web requests at all; Claude's API container has internet access completely disabled, while in the Claude apps outbound network egress is a capability setting, on by default for Free, Pro, and Max and off by default for Team and Enterprise.

The practical consequence for an analyst is that the code is the audit trail. When an assistant hands you a number, the question worth asking is whether it ran something. If it did, read the code, check the filters, and the answer becomes verifiable in the same way a colleague's notebook is. If it did not, treat the number as a [hallucination](/glossary/hallucination) risk regardless of how confident it sounds.

The workflow built on it is [Claude for data analysis](/guides/analytics/claude-for-data-analysis), and the two big assistants are compared in [ChatGPT vs Claude for data analysis](/guides/comparisons/chatgpt-vs-claude-for-data-analysis). For how a model decides to call this tool at all, see [AI agent](/glossary/ai-agent).
