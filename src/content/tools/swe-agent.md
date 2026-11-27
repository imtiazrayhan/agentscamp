---
name: "SWE-agent"
description: "Open-source autonomous coding agent from Princeton/Stanford that turns an LLM into a software engineer to fix real GitHub issues."
url: "https://swe-agent.com"
pricing: open-source
category: agent
repo: "https://github.com/SWE-agent/SWE-agent"
related: ["tool:openhands", "tool:devin", "tool:amp"]
license: "MIT"
os:
  - macOS
  - Linux
  - Windows
alternativeTo:
  - "openhands"
  - "devin"
  - "aider"
sameAs:
  - "https://github.com/SWE-agent/SWE-agent"
  - "https://github.com/SWE-agent"
topics:
  - ai-agents-systems
  - llm-evals
audience: ["developers", "ai-engineers"]
tags:
  - autonomous-agent
  - swe-bench
  - github-issues
  - open-source
  - research
color: blue
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
featured: false
summary: "SWE-agent is a free, MIT-licensed coding agent from Princeton and Stanford researchers that points an LLM of your choice at a GitHub issue and returns a patch. It introduced the agent-computer interface (ACI). Its maintainers now recommend the simpler mini-swe-agent for most uses, and SWE-agent's last release, v1.1.0, dates from May 2025."
faq:
  - q: "Is SWE-agent free?"
    a: "Yes. SWE-agent and mini-swe-agent are MIT-licensed and free to run. You supply your own model API key, so the cost is model usage. The documented hello-world command caps that with --agent.model.per_instance_cost_limit, set to 2.00 dollars in the example."
  - q: "Should I use SWE-agent or mini-swe-agent?"
    a: "The maintainers say to treat mini-swe-agent as the default: it is the quick local command-line tool, has a very simple control flow, and is the better base for fine-tuning or reinforcement learning because it does not tie you to one scaffold. They suggest SWE-agent only if you want to experiment with different tool sets, each with its own interface, or with different history processors."
  - q: "Who built SWE-agent?"
    a: "It is an academic project started at Princeton University by John Yang, Carlos E. Jimenez, Alexander Wettig, Kilian Lieret, Shunyu Yao, Karthik Narasimhan and Ofir Press, and is maintained by researchers from Princeton and Stanford. The paper, on agent-computer interfaces, was published at NeurIPS 2024. The same group built the SWE-bench benchmark."
  - q: "How does SWE-agent relate to SWE-bench?"
    a: "SWE-bench is the benchmark of real GitHub issues; SWE-agent is an agent evaluated on it. The link is now tighter for mini-swe-agent: the SWE-bench site's bash-only leaderboard runs every model through mini-swe-agent, so the scaffold stays fixed and only the model changes."
---

**SWE-agent is an open-source, MIT-licensed coding agent from researchers at Princeton and Stanford that takes a GitHub issue, drives a language model of your choice through the repository, and returns a patch.** It is a command-line research tool, not a product: no account, no hosted service, and you bring your own model API key.

Read the status before you install it. The README opens with a warning that most development effort is now on **mini-swe-agent**, "which has superseded SWE-agent", and the maintainers' "general recommendation is to use mini-SWE-agent instead of SWE-agent going forward." SWE-agent's latest release is v1.1.0, published in May 2025.

## Highlights

- **The agent-computer interface (ACI).** SWE-agent's research contribution, published at NeurIPS 2024: give the model a purpose-built set of commands and feedback formats for viewing, searching and editing code instead of a raw shell. The whole agent is governed by a single YAML config file.
- **Issue in, patch out.** `sweagent run` works on one problem statement, such as a GitHub issue URL; `sweagent run-batch` works through a list, which is how you benchmark on [SWE-bench](/glossary/swe-bench).
- **Any model.** The docs' examples use Claude Sonnet 4 and GPT-4o, and keys are read from environment variables or a `.env` file.
- **Docker by default.** Code runs in a Docker container; the docs also describe running the code evaluation in the cloud if you cannot use Docker.
- **More than bug fixing.** The docs cover custom tasks and coding challenges. EnIGMA is a mode for capture-the-flag security challenges; the README asks you to use SWE-agent 0.7 for it while it is updated for 1.0.
- **mini-swe-agent.** The successor is about 100 lines of Python for the agent class, uses bash as its only tool, and runs each action as an independent `subprocess.run` call with a linear message history. Its README reports more than 74% on SWE-bench Verified.

## In an AI-assisted workflow

SWE-agent installs from source, and the docs' first example fixes a syntax error in a test repository:

```bash
git clone https://github.com/SWE-agent/SWE-agent.git
cd SWE-agent
python -m pip install --upgrade pip && pip install --editable .

export ANTHROPIC_API_KEY=<your key>
# model name as written in the SWE-agent docs; substitute a current model id
sweagent run \
  --agent.model.name=claude-sonnet-4-20250514 \
  --agent.model.per_instance_cost_limit=2.00 \
  --env.repo.github_url=https://github.com/SWE-agent/test-repo \
  --problem_statement.github_url=https://github.com/SWE-agent/test-repo/issues/1
```

The run writes a trajectory file recording every model message and command, which is the artifact researchers analyze. For the tool the maintainers now recommend, the path is shorter:

```bash
pip install mini-swe-agent
mini    # interactive CLI in the current directory
# or run it once without installing: uvx mini-swe-agent
```

> [!WARNING]
> mini-swe-agent's default local environment executes the model's bash commands directly on your machine. Run it in a throwaway directory, or use its Docker, Podman, Apptainer or Bubblewrap environments for anything you care about.

## Good to know

- **Licence and cost.** Both projects are MIT-licensed. There is nothing to buy; you pay your model provider.
- **Activity.** As of November 2026, SWE-agent has about 20,900 GitHub stars and mini-swe-agent about 10,100. mini-swe-agent's current release is v2.4.6, from July 2026, and v2 has a migration guide for v1 users.
- **Benchmark claims age fast.** The README's "state of the art on SWE-bench among open-source projects" line dates from the SWE-agent 1.0 launch in February 2025. Check the [SWE-bench](https://www.swebench.com/) leaderboards for current numbers rather than quoting a README.
- **What it is not.** There is no IDE integration, no pull request bot and no team features. You get a patch and a trajectory, and wiring that into a workflow is your job.

Against the alternatives: [OpenHands](/tools/openhands) is the open-source choice when you want a UI, parallel conversations and scheduled automations around the agent. [Devin](/tools/devin) is a closed, hosted commercial agent. [Aider](/tools/aider) is an interactive terminal pair programmer that commits each edit to Git, built for a developer in the loop instead of unattended issue solving. See how these fit together in [AI Coding Agents in 2026](/guides/prompting/ai-coding-agents-cli-2026), or browse [SWE-agent alternatives](/tools/swe-agent/alternatives).
