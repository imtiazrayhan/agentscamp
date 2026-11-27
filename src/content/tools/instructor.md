---
name: "Instructor"
title: "Instructor"
description: "A Python library that returns validated Pydantic objects from LLM calls, with validation retries and streaming, across OpenAI, Anthropic, Google and more."
url: "https://python.useinstructor.com"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/567-labs/instructor"
license: "MIT"
sameAs: ["https://github.com/567-labs/instructor"]
color: "purple"
topics: ["llm-app-dev"]
audience: ["ai-engineers"]
tags: ["structured-output", "pydantic", "validation", "open-source", "python"]
featured: false
alternativeTo: ["baml", "vercel-ai-sdk"]
summary: "Instructor is an MIT-licensed Python library that turns an LLM call into a typed function. You pass a Pydantic model as response_model, and it requests that shape from the provider, validates the reply and can retry with the validation error. One from_provider call covers OpenAI, Anthropic, Google, Ollama and about two dozen other integrations."
related: ["tool:baml", "guide:structured-output-2026", "skill:llm-output-schema-generator", "tool:vercel-ai-sdk"]
faq:
  - q: "How do I install and use Instructor?"
    a: "Run pip install instructor (Python 3.10 or later), then create a client with instructor.from_provider and a provider/model string, such as the README's instructor.from_provider(\"anthropic/claude-haiku-5-5\"). Call client.chat.completions.create with response_model set to your Pydantic class and a messages list. The return value is an instance of that class, already validated."
  - q: "Which providers does Instructor support?"
    a: "The docs list integrations for OpenAI (Chat Completions and Responses), Anthropic, Google (GenAI and Vertex), Azure, Bedrock, Mistral, Cohere, Groq, Cerebras, Fireworks, Together, DeepSeek, xAI, Perplexity, OpenRouter, LiteLLM, Databricks, Writer, SambaNova and Anyscale, plus local models through Ollama and llama-cpp-python."
  - q: "Does Instructor retry automatically?"
    a: "It retries validation failures when you set max_retries on the call; the patching docs list the default as 0. With max_retries=2, Instructor makes the first attempt plus at most two retries, feeding the Pydantic error back to the model each time. If attempts run out it raises InstructorRetryException. These are separate from the provider SDK's own transport retries."
  - q: "Is there a TypeScript version of Instructor?"
    a: "Yes, the README links ports for TypeScript, Ruby, Go, Elixir and Rust. They are separate projects with their own release schedules: the npm package @instructor-ai/instructor was last published in January 2025 (version 1.7.0), while the Python library released 1.18.0 in November 2026. For TypeScript, also compare the Vercel AI SDK."
---

Instructor makes structured output from LLMs feel like calling a typed function. You define the shape you want as a Pydantic model, pass it as `response_model`, and Instructor asks the model for those fields, parses the response into your type and **validates** it. If validation fails, it can **retry** with the error fed back to the model. The library is MIT-licensed; the latest release is 1.18.0, published on November 26, 2026, and the repository has about 14,100 GitHub stars as of November 2026.

It suits developers who want data, not prose, from an LLM (extraction, classification, form-filling) without hand-writing JSON parsing and retry loops. It builds on each provider's native tool calling or structured-output mode, so it stays a thin layer over the SDK you already use.

## Highlights

- **Types as the schema.** A Pydantic `BaseModel` is the contract, including nested models, lists, enums and field validators. No hand-written JSON Schema.
- **One entry point.** `instructor.from_provider("provider/model")` returns a client with the same `chat.completions.create` call for every provider. Async clients are supported.
- **Validation retries.** `max_retries=3` re-asks the model with the Pydantic error message. Pass a Tenacity `Retrying` policy for backoff and custom stop conditions.
- **Modes.** Tool calling is the default for OpenAI, Anthropic and Google (`Mode.TOOLS`), with `Mode.JSON` as a fallback for models without tool support, such as some local models served by Ollama.
- **Streaming.** `response_model=Partial[User]` with `stream=True` yields the object as fields fill in; iterables stream a list of records one at a time.
- **Ports.** Sibling libraries exist for TypeScript, Ruby, Go, Elixir and Rust.

## In an AI-assisted workflow

```bash
pip install instructor      # or: uv add instructor
export ANTHROPIC_API_KEY=your-api-key
```

```python
import instructor
from pydantic import BaseModel, Field, field_validator


class User(BaseModel):
    name: str
    age: int = Field(description="Age in years")

    @field_validator("age")
    @classmethod
    def age_is_plausible(cls, v: int) -> int:
        if not 0 <= v <= 130:
            raise ValueError("age must be between 0 and 130")
        return v


client = instructor.from_provider("anthropic/claude-haiku-5-5")

user = client.chat.completions.create(
    response_model=User,
    max_tokens=1024,
    max_retries=2,  # first attempt plus up to two validation retries
    messages=[{"role": "user", "content": "John is 25 years old"}],
)

print(user)  # User(name='John', age=25)
```

The model string comes from Instructor's README; swap in `openai/...`, `google/...` or `ollama/llama3.2` and the rest of the code stays the same.

> [!TIP]
> Let your types do the prompting: a well-named model with field descriptions and constraints (enums, ranges) often beats paragraphs of instructions for getting the exact structure you want.

## Good to know

Instructor is free and open source (MIT); you pay your model provider for tokens. Where it fails or costs you:

- **Retries multiply spend.** Each validation retry is a full extra LLM call with the error appended. A strict validator on a weak model can burn three calls and still raise `InstructorRetryException`, so catch it and decide what to do with the record.
- **Validation is not truth.** A response can satisfy the schema and still be wrong: a plausible but invented date passes a `date` field. Validate semantics yourself where it matters.
- **Schema limits are the provider's.** Deep nesting, large unions and long enums behave differently per provider and mode. Test the schema against the model you will ship with.
- **It is not an agent framework.** The maintainers' own README says to use Instructor for extraction and reach for [Pydantic AI](/tools/pydantic-ai) when you need agent runs.

For a cross-language, schema-first approach with its own DSL and generated clients, compare [BAML](/tools/baml). For a TypeScript-native app toolkit that also does structured output, see the [Vercel AI SDK](/tools/vercel-ai-sdk). For optimizing the prompts behind an extraction pipeline against a metric, see [DSPy](/tools/dspy). Background on the techniques: [Structured Output vs JSON Mode vs Function Calling](/guides/concepts/structured-output-2026).
