---
name: "BAML"
title: "BAML"
description: "A language for type-safe LLM functions: define prompt and schema in .baml files, generate clients for Python, TypeScript, Go and more, and parse messy output."
url: "https://www.boundaryml.com"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/BoundaryML/baml"
license: "Apache-2.0"
sameAs: ["https://github.com/BoundaryML/baml", "https://docs.boundaryml.com"]
color: "green"
topics: ["llm-app-dev"]
audience: ["ai-engineers"]
tags: ["structured-output", "type-safe", "dsl", "open-source"]
featured: false
alternativeTo: ["instructor"]
summary: "BAML, from Boundary, is a small language for defining LLM functions with typed inputs and outputs. You write the prompt and schema in .baml files, run baml-cli generate, and call the function from Python, TypeScript, Go, Ruby, Rust or Elixir. Its parser coerces imperfect model output into your types. It is Apache-2.0 and free."
related: ["tool:instructor", "guide:structured-output-2026", "skill:llm-output-schema-generator"]
faq:
  - q: "Which languages can call BAML functions?"
    a: "The v0 docs have install guides for Python, TypeScript, Go, Ruby, Rust and Elixir, each with a generated client. Any other language can call BAML through a REST API served by baml-cli serve. In Python, the types you declare in .baml files become Pydantic models."
  - q: "How do I install BAML?"
    a: "For Python, run pip install baml-py, then baml-cli init to create a baml_src directory, then baml-cli generate to produce the baml_client module. For TypeScript, npm install @boundaryml/baml and npx baml-cli init. As of November 2026 the current release of both packages is 0.226.3, and baml-py needs Python 3.10 or later."
  - q: "What is the difference between BAML v0 and BAML v1?"
    a: "BAML v0 is the DSL that the baml-py and @boundaryml/baml packages install, and what most existing tutorials describe. Boundary's docs now call it the legacy DSL. BAML v1 is a separate, fuller programming language for agents, in public beta as of November 2026, installed with brew install baml. The two have different documentation, so confirm which one a guide targets."
  - q: "Is BAML free?"
    a: "Yes. The repository is Apache-2.0 and there is no paid tier for the language or the generated clients. You pay your model provider for tokens."
---

BAML, made by Boundary (BoundaryML), takes a different route to structured LLM output: instead of a library inside one language, it is a small **language of its own**. You define an LLM function, with its prompt, typed inputs and typed output, in a `.baml` file, and a code generator produces a **type-safe client** for your application language. Its **schema-aligned parsing** coerces the almost-JSON that models often emit into the types you declared.

It suits teams that want LLM calls to be version-controlled, tested artifacts shared across services, and it is most useful when more than one language consumes the same prompts. The repository has about 9,600 GitHub stars as of November 2026.

## Highlights

- **Typed LLM functions.** A function declares parameters, a return type, a client and a Jinja prompt. Types include `string`, `int`, `float`, `bool`, arrays, maps, literal unions and your own classes.
- **Generated clients.** `baml-cli generate` writes a `baml_client` package for Python (Pydantic models), TypeScript, Go, Ruby, Rust or Elixir. `baml-cli serve` exposes the same functions over REST for anything else.
- **Schema-aligned parsing.** The parser works on the model's text output, so it does not depend on a provider's JSON mode or tool-calling API, and it handles partial output for streaming.
- **Client shorthand.** A client can be a string such as `"openai/gpt-5-mini"` or a named `client<llm>` block with retries and fallbacks.
- **Editor tooling.** Extensions for VS Code, Cursor, JetBrains IDEs and Zed give syntax highlighting, prompt previews and a testing playground, and regenerate the client when you save.
- **Tests in the language.** `baml-cli test` runs test cases declared next to the functions.

## In an AI-assisted workflow

Install the runtime and scaffold a project (Python shown; TypeScript uses `npm install @boundaryml/baml` and `npx baml-cli init`):

```bash
pip install baml-py
baml-cli init        # creates baml_src/ with starter files and a generator block
```

Define a function in `baml_src/`:

```baml
class User {
  name string
  age int
}

function ExtractUser(text: string) -> User {
  client "openai/gpt-5-mini"
  prompt #"
    Extract the user from: {{ text }}

    {{ ctx.output_format }}
  "#
}
```

Generate the client and call it:

```bash
baml-cli generate    # writes baml_client/
```

```python
from baml_client.sync_client import b
from baml_client.types import User

user: User = b.ExtractUser("Maria is 34 and lives in Lisbon.")
print(user.name, user.age)
```

`{{ ctx.output_format }}` is where BAML injects the schema instructions for the return type, and `b.stream.ExtractUser(...)` yields partial objects while the model is still writing.

> [!TIP]
> Point your coding assistant at the right docs before it writes BAML. Boundary's docs site carries a notice that it documents v0 and that v1 is a separate language, and an assistant that mixes the two will produce files that do not compile.

## Good to know

**The build step is the real cost.** Every change to a `.baml` file needs `baml-cli generate` before your application sees it. The editor extension runs it on save, but CI needs it too, and you must decide whether to commit `baml_client/` or generate it in the build. The `version` in the generator block has to match the installed runtime, so upgrading `baml-py` means updating that line and regenerating.

**Two BAMLs exist as of November 2026.** The packages above install v0 (currently 0.226.3), which Boundary's docs now label the legacy DSL. BAML v1 is a broader programming language for agents, with its own type system, tests and standard library, in public beta as of November 2026 and installed with `brew install baml`. Boundary has not, in the pages checked for this review, published an end date for v0; if you are starting a long-lived project, read the v1 docs before you commit.

**It is one more language.** Teammates have to learn the syntax, and prompts move out of the application code where some engineers expect to find them. For a single Python or TypeScript service, that overhead may not pay for itself.

Compared with the alternatives: [Instructor](/tools/instructor) keeps everything in your application code with Pydantic models and is lighter for one language; [Pydantic AI](/tools/pydantic-ai) gives typed outputs inside a Python agent framework; the [Vercel AI SDK](/tools/vercel-ai-sdk) does schema-validated object generation for TypeScript. BAML is the one built for sharing a single prompt definition across several languages. [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026) explains when typed output is worth the setup.
