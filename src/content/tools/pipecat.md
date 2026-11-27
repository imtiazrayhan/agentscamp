---
name: "Pipecat"
title: "Pipecat"
description: "An open-source Python framework for real-time voice and multimodal conversational AI — it orchestrates streaming STT, LLM, and TTS into composable pipelines."
url: "https://pipecat.ai"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "voice"
repo: "https://github.com/pipecat-ai/pipecat"
license: "BSD-2-Clause"
os: ["Linux", "macOS", "Windows"]
sameAs: ["https://github.com/pipecat-ai/pipecat", "https://docs.pipecat.ai"]
color: "blue"
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["voice", "real-time", "framework", "open-source", "python"]
featured: false
alternativeTo: ["livekit", "vapi"]
summary: "Pipecat is a BSD-2-Clause Python framework for real-time voice and multimodal agents, maintained by Daily and its community. You assemble a pipeline of processors (transport in, speech-to-text, LLM, text-to-speech, transport out) and Pipecat moves audio and text between them as frames. The framework is free; you pay the providers you plug in."
related: ["guide:build-a-voice-agent", "guide:realtime-voice-apis", "agent:voice-agent-engineer", "tool:livekit", "tool:vapi", "tool:deepgram", "tool:elevenlabs"]
faq:
  - q: "Is Pipecat free?"
    a: "Yes. The framework is open source under BSD-2-Clause and you can run it anywhere Python runs. You pay the STT, LLM and TTS providers you connect, plus your own hosting. Pipecat Cloud, the managed deployment service run by Daily, is a separate service with its own pricing."
  - q: "How do I start a Pipecat project?"
    a: "Install uv, then run uv tool install \"pipecat-ai[cli]\" and pipecat init quickstart. The CLI scaffolds a bot; uv sync installs dependencies and uv run bot.py starts it locally. To add Pipecat to an existing project, use uv add pipecat-ai and add extras for the services you use."
  - q: "Which Python versions does Pipecat support?"
    a: "Python 3.11 through 3.14. The README says Python 3.15 is not supported yet because onnxruntime publishes no wheels for it, and suggests pinning with uv python pin 3.14."
  - q: "Pipecat vs LiveKit Agents?"
    a: "Both are open-source frameworks for building the agent yourself. Pipecat is Python-only and transport-agnostic: it can run over Daily, a plain WebSocket, its own SmallWebRTCTransport, or LiveKit. LiveKit Agents supports Python and Node.js and is tied to LiveKit's own WebRTC server, which you self-host or rent as LiveKit Cloud."
---

Pipecat is an open-source Python framework for **real-time voice and multimodal conversational AI**, maintained by Daily and its community. It handles the generic, hard part of a [voice agent](/guides/voice/build-a-voice-agent): moving audio and text between streaming speech-to-text, an LLM and text-to-speech, managing the transport, and handling turn-taking and interruptions. You write the agent's behavior and choose the providers.

The repository is BSD-2-Clause licensed and had about 17.5k GitHub stars as of November 2026. The latest release is v1.17.0, from November 22, 2026.

## Highlights

- **Pipelines of processors.** A pipeline is an ordered list of processors. Data flows through it as frames (audio, text, control signals), so swapping a provider means replacing one element.
- **Many services.** Integrations for speech-to-text (AssemblyAI, Deepgram, Cartesia, ElevenLabs and more), LLMs (Anthropic, OpenAI, AWS, Azure, Cerebras and more), text-to-speech, and speech-to-speech models such as OpenAI Realtime, Gemini Live and AWS Nova Sonic.
- **Transports.** Daily (WebRTC), FastAPI WebSocket, LiveKit (WebRTC) and SmallWebRTCTransport, plus serializers for Twilio, Telnyx, Plivo, Exotel and Genesys telephony.
- **Pipecat Flows.** Built-in support for structured conversations with predefined or dynamic paths and state, including flows defined in YAML.
- **Multi-agent.** Each pipeline is an agent; compose them with handoffs, parallel fan-out or sidecar workers, in one process or distributed.
- **Client SDKs and RTVI.** Official client SDKs talk to a bot over the RTVI (Real-Time Voice Interaction) protocol, which is enabled by default.
- **Tooling.** A CLI that scaffolds and deploys projects, the Whisker pipeline debugger, the Tail terminal dashboard, and OpenTelemetry and Sentry hooks.

## In an AI-assisted workflow

Start a project with the CLI:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh    # uv is required
uv tool install "pipecat-ai[cli]"
pipecat init quickstart
uv sync && uv run bot.py
```

The generated bot builds three services and wires them into a pipeline. This is the shape of it, trimmed from Pipecat's quickstart (the full version also passes voice and model settings):

```python
import os

from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.openai.responses.llm import OpenAIResponsesLLMService

stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))
llm = OpenAIResponsesLLMService(api_key=os.getenv("OPENAI_API_KEY"))
tts = CartesiaTTSService(api_key=os.getenv("CARTESIA_API_KEY"))

pipeline = Pipeline([
    transport.input(),     # audio from the browser or phone
    stt,                   # speech-to-text
    user_aggregator,       # add the user's message to the context
    llm,                   # language model
    tts,                   # text-to-speech
    transport.output(),    # audio back to the caller
    assistant_aggregator,  # add the bot's reply to the context
])
```

The `transport` and the two aggregators come from the scaffolded `bot.py`; the aggregators keep the conversation history, and the user aggregator carries the Silero voice-activity detector. Order matters: audio must be transcribed before the LLM sees it, and text synthesized before it is played.

Pipecat also publishes [Claude Code](/tools/claude-code) skills for scaffolding and deploying bots. Add them with `claude plugin marketplace add pipecat-ai/skills`.

> [!TIP]
> Pipecat pays off when you want a different vendor per stage, for example [Deepgram](/tools/deepgram) for STT, your own LLM behind a gateway, and [ElevenLabs](/tools/elevenlabs) for TTS, while keeping one turn-taking and interruption model. For a single-vendor prototype, a bundled voice-agent API gets you talking faster.

## Good to know

- **You run it.** Pipecat is a library, so hosting, scaling and monitoring are yours. Pipecat Cloud (signup is at pipecat.daily.co) takes that on: `pcc-deploy.toml` describes the build and the CLI deploys it without a container registry.
- **Extras are opt-in.** `uv add pipecat-ai` installs only the core. Add an extra per service with `uv add "pipecat-ai[option,...]"`; `pip install` works too.
- **Python only**, 3.11 through 3.14.
- **Release pace is fast.** The project reached 1.17 in November 2026. Pin the version and read the changelog when you upgrade.
- **Latency is the sum of your choices.** The framework adds little; the round trip depends on the STT, LLM and TTS providers and where you host relative to them.

Compared with the alternatives: [LiveKit](/tools/livekit) Agents is the closest open-source rival, adding Node.js support and its own WebRTC server and cloud. [Vapi](/tools/vapi) is a hosted platform where an assistant is configuration plus a phone number, at a per-minute platform fee, with no pipeline code to maintain. The [voice-agent-engineer](/agents/data-ai/voice-agent-engineer) agent can build and tune a Pipecat pipeline, and [Realtime Voice Agents](/guides/voice/realtime-voice-apis) compares the build and buy routes.
