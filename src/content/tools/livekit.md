---
name: "LiveKit"
description: "Open-source realtime infrastructure: a WebRTC server plus the LiveKit Agents framework for production voice AI, with turn detection, telephony, and a cloud."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://livekit.com"
pricing: "freemium"
category: "voice"
repo: "https://github.com/livekit/livekit"
license: "Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mlops-ai-infra", "multimodal-ai"]
audience: ["ai-engineers"]
tags: ["webrtc", "voice-agents", "realtime", "open-source", "telephony"]
featured: false
alternativeTo: ["pipecat", "vapi"]
sameAs:
  - "https://github.com/livekit"
  - "https://docs.livekit.io"
  - "https://x.com/livekit"
related: ["guide:realtime-voice-apis", "guide:build-a-voice-agent", "tool:pipecat", "tool:vapi", "tool:cartesia", "tool:deepgram"]
summary: "LiveKit is an open-source platform for realtime voice and video agents. An Apache-2.0 WebRTC server carries the media, and the LiveKit Agents framework for Python and Node.js wires STT, LLM and TTS models or a speech-to-speech model into an agent with turn detection and SIP telephony. Self-host it, or use LiveKit Cloud, which has a free Build plan."
faq:
  - q: "How much does LiveKit Cloud cost?"
    a: "As of November 2026, livekit.com/pricing lists Build at $0 a month with 1,000 agent session minutes, 5 concurrent sessions and no credit card; Ship from $50 a month with 5,000 minutes, then $0.01 per minute; Scale from $500 a month with 50,000 minutes, then $0.01 per minute; and custom Enterprise pricing. Model usage through LiveKit Inference is billed separately against included credits. Self-hosting the open-source server and agents framework costs nothing in licence fees."
  - q: "Is LiveKit the server or the agents framework?"
    a: "Both, in layers. livekit/livekit is the WebRTC server (an SFU) that routes audio, video and data between participants. livekit/agents is the framework for writing the agent that joins a room as a participant, with plugins for STT, LLM and TTS providers. Every client, agent and phone call joins a room and publishes or subscribes to tracks."
  - q: "Does ChatGPT's voice mode run on LiveKit?"
    a: "LiveKit says so: its homepage states that OpenAI built ChatGPT's Advanced Voice on LiveKit Cloud. That is the vendor's own customer claim, and it refers to the transport layer, not the model."
  - q: "LiveKit vs Vapi: build or buy?"
    a: "LiveKit is infrastructure you write code against: you choose models, own the agent logic, and can self-host. Vapi is a hosted product where an assistant is configuration plus a phone number, with a per-minute platform fee. Teams with engineers and volume tend to build on LiveKit; teams that need a phone agent this week tend to start on Vapi."
---

LiveKit is an open-source platform for building realtime voice, video and physical AI agents on WebRTC. It began as a media server and added the agent layer as voice AI took off. Its best-known deployment is one the company advertises itself: LiveKit's homepage says OpenAI built ChatGPT's Advanced Voice on LiveKit Cloud.

Both main repositories are Apache-2.0. As of November 2026, the server had about 22.4k GitHub stars (latest release v1.13.11, October 2026) and the agents framework about 15.4k (livekit-agents 1.9.0, November 2026).

## Highlights

- **WebRTC server.** An SFU that routes realtime audio, video and data, with client and server SDKs for web, Swift, Android, Flutter, React Native, Unity, Python, Node.js, Rust, C++ and ESP32.
- **LiveKit Agents.** The framework, in Python and Node.js, for agents that join a room as a participant. Use a pipeline of separate STT, LLM and TTS models or a single realtime speech-to-speech model, with tool calling and handoffs between agents.
- **Turn detection.** A multimodal detector that reads the agent's last message and the user's audio, in 14 languages. The full `v1` model runs on LiveKit Inference; `v1-mini` runs locally on CPU, free in any context, at roughly 310 to 340 MB of memory per loaded copy.
- **Telephony.** SIP trunks for inbound and outbound calls, DTMF, cold transfers and agent-assisted warm transfers. LiveKit Phone Numbers sells US local and toll-free numbers on LiveKit Cloud.
- **LiveKit Inference.** One API key for STT, LLM, TTS and realtime models from providers including OpenAI, Google, AssemblyAI, Deepgram, Cartesia, Fish Audio and Inworld, so a prototype needs no separate provider accounts.
- **LiveKit Cloud.** Managed hosting for the server and for agents, with deployment, rollback, session observability and agent simulations.

## In an AI-assisted workflow

The quickstart goes from nothing to a talking agent with the CLI. On macOS (Linux uses `curl -sSL https://get.livekit.io/cli | bash`):

```bash
brew install livekit-cli
lk cloud auth                                              # sign in to LiveKit Cloud
lk agent init my-agent --template agent-starter-python     # needs uv installed
cd my-agent && lk agent dev                                # prints an Agent Console link to talk to it
lk agent create                                            # build and deploy to LiveKit Cloud
```

The session at the center of the starter agent looks like this, using LiveKit Inference so no provider keys are needed:

```python
from livekit.agents import AgentSession, TurnHandlingOptions, inference

session = AgentSession(
    stt=inference.STT(model="assemblyai/assemblyai-stt-3-7-realtime-agent"),
    llm=inference.LLM(model="google/gemma-4-31b-it"),
    tts=inference.TTS(model="fishaudio/s2.1-pro", voice="fa4c9eb3dccc4806b382b40d61c6b10a"),
    turn_handling=TurnHandlingOptions(turn_detection=inference.TurnDetector()),
)
```

To use your own provider accounts, install plugins (`pip install "livekit-agents[openai,deepgram,cartesia]"`) and swap in `deepgram.STT(...)`, `openai.LLM(...)` and `cartesia.TTS(...)`. `lk skills install --global` adds LiveKit's skills to a coding agent such as Claude Code, and the docs are served over an MCP server at `https://docs.livekit.io/mcp`.

In the [voice-agent pipeline](/guides/voice/build-a-voice-agent), you bring the models and LiveKit owns transport, turn-taking and telephony, the parts that tend to fail when a demo meets real networks.

> [!NOTE]
> Pin the agents framework version. The text-only turn detector is deprecated and slated for removal in version 2.0 of the SDK, and the `provider` pinning option in LiveKit Inference stops working on March 1, 2027.

## Pricing

As of November 2026, livekit.com/pricing lists these LiveKit Cloud plans:

| Plan | Price | Agent session minutes | Concurrent agent sessions | Inference credits |
| --- | --- | --- | --- | --- |
| Build | $0 per month, no card | 1,000 included | 5 | $2.50 |
| Ship | From $50 per month | 5,000 included, then $0.01 per minute | 20 | $5 |
| Scale | From $500 per month | 50,000 included, then $0.01 per minute | Starts at 50, up to 600 | $50 |
| Enterprise | Custom | Custom | Custom | Custom |

Agent session minutes cover hosting the agent. Model usage through LiveKit Inference, telephony minutes and observability are metered on top; the pricing page's calculator is the quickest way to see an all-in per-minute figure for your model mix. Build includes one free phone number, and HIPAA and region pinning start at Scale.

## Good to know

- **Self-hosting is free but not effortless.** You run the server, TURN, scaling and agent orchestration yourself, which is what Cloud's minutes pay for. LiveKit Phone Numbers and the full `v1` turn detector are Cloud features.
- **Requirements move quickly.** The Node.js quickstart asks for Node 24 or later and pnpm 10; the Python path uses uv.
- **Cost is layered.** A cloud-hosted agent pays for session minutes plus STT, LLM and TTS usage plus telephony. Estimate the total, not the headline rate.
- **It is a framework, not a product.** There is no dashboard-only path to a finished phone agent; someone has to write and maintain the agent code.

Compared with the alternatives: [Pipecat](/tools/pipecat) is the other open-source agent framework, Python-only and BSD-licensed, and it can use LiveKit as its transport. [Vapi](/tools/vapi) is the hosted option where an assistant is configuration, not code. [Cartesia](/tools/cartesia)'s Managed Agents is a single-vendor hosted alternative. The build-or-buy trade-offs are laid out in [Realtime Voice Agents](/guides/voice/realtime-voice-apis).
