---
title: "Securing AI Agents: The OWASP Agentic Top 10 in Practice"
description: "The OWASP Top 10 for Agentic Applications 2026, ASI01 to ASI10: what each risk means, a real attack scenario for each, and one control you can implement."
author: "Imtiaz Rayhan"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-safety-security"]
audience: ["developers", "security"]
tags: ["ai-agents", "security", "owasp", "ai-safety", "guardrails"]
featured: false
summary: "The OWASP Top 10 for Agentic Applications 2026 lists ten risks, ASI01 Agent Goal Hijack through ASI10 Rogue Agents, that appear once an LLM can call tools, keep memory and talk to other agents. Each entry here has the official name, an attack scenario from OWASP's examples, and one control you can ship."
keyTakeaways:
  - "The official list is ASI01 Agent Goal Hijack, ASI02 Tool Misuse and Exploitation, ASI03 Identity and Privilege Abuse, ASI04 Agentic Supply Chain Vulnerabilities, ASI05 Unexpected Code Execution (RCE), ASI06 Memory & Context Poisoning, ASI07 Insecure Inter-Agent Communication, ASI08 Cascading Failures, ASI09 Human-Agent Trust Exploitation and ASI10 Rogue Agents."
  - "OWASP published it on December 9, 2025. It sits beside the older Agentic AI Threats and Mitigations taxonomy, and each ASI entry names the T-numbered threats it maps to."
  - "Excessive agency multiplies every entry. It is LLM06 in the 2025 LLM Top 10 and LLM03 in the 2026 edition, and the fix is fewer tools, narrower scopes and less autonomy."
  - "Most attacks start as injected text and end as a tool call, so the highest-value controls sit at the tool boundary: argument validation, least-privilege credentials and approval for irreversible actions."
  - "Resource overload, repudiation and reviewer fatigue are not top-level ASI entries. They live in the taxonomy as T4, T8 and T10 and show up as contributing factors to ASI02, ASI08 and ASI09."
faq:
  - q: "What is the OWASP Agentic Top 10?"
    a: "The OWASP Top 10 for Agentic Applications 2026 is a peer-reviewed list of the ten most critical security risks for autonomous AI agents, numbered ASI01 to ASI10. The OWASP GenAI Security Project published it on December 9, 2025. It complements the OWASP Top 10 for LLM Applications, which covers LLM apps in general, and the Agentic AI Threats and Mitigations taxonomy, which uses T-numbers."
  - q: "What are ASI01 to ASI10?"
    a: "ASI01 Agent Goal Hijack, ASI02 Tool Misuse and Exploitation, ASI03 Identity and Privilege Abuse, ASI04 Agentic Supply Chain Vulnerabilities, ASI05 Unexpected Code Execution (RCE), ASI06 Memory & Context Poisoning, ASI07 Insecure Inter-Agent Communication, ASI08 Cascading Failures, ASI09 Human-Agent Trust Exploitation, and ASI10 Rogue Agents."
  - q: "How is securing an AI agent different from securing an LLM app?"
    a: "An LLM app generates text; an agent takes actions. It calls tools, persists memory, makes multi-step decisions and sometimes coordinates with other agents. A prompt injection in a chatbot produces a bad answer, but in an agent it can send data, spend money or delete records. OWASP draws the same line: LLM01 Prompt Injection is about altering one model response, while ASI01 covers injected input that redirects goals and multi-step behaviour."
  - q: "What is excessive agency in AI agents?"
    a: "Excessive agency is when an agent has more capability, permission or autonomy than its task requires: too many tools, broad credentials, or high-impact actions with no oversight. It is LLM06:2025 in the OWASP Top 10 for LLM Applications and LLM03:2026 in the 2026 edition. It is not an ASI entry of its own because it amplifies all ten."
  - q: "Where should I start if I can only do three things?"
    a: "Cut the agent's tools and credentials to what the task needs, validate tool arguments in code with hard bounds, and require human approval for irreversible actions with the literal action shown to the reviewer. Those three reduce the damage from ASI01, ASI02, ASI03 and ASI09, which is where injected text most often turns into real harm."
related: ["guide:defending-prompt-injection", "agent:prompt-injection-auditor", "agent:agent-reliability-reviewer", "skill:human-in-the-loop-gate", "skill:llm-guardrails-designer", "tool:nemo-guardrails"]
---

The OWASP Top 10 for LLM Applications mostly treats the model as something that produces text. An agent produces actions: it calls tools, writes to memory, plans across steps and talks to other agents. The **OWASP Top 10 for Agentic Applications 2026**, published by the GenAI Security Project on December 9, 2025, lists the ten risks that follow from that autonomy.

## The official list

Names and mappings below are taken from OWASP's entry pages, checked in November 2026. The T-numbers refer to OWASP's separate *Agentic AI Threats and Mitigations* taxonomy, which each ASI entry cites.

| ID | Official name | In one line | Maps to (Threats and Mitigations) |
| --- | --- | --- | --- |
| ASI01 | Agent Goal Hijack | Injected or planted content redirects the agent's objectives and plan | T6 Goal Manipulation, T7 Misaligned & Deceptive Behaviors |
| ASI02 | Tool Misuse and Exploitation | A legitimate tool is called in a harmful way | T2 Tool Misuse; T4 and T16 as contributing factors |
| ASI03 | Identity and Privilege Abuse | Delegated, cached or inherited credentials are used beyond their intent | T3 Privilege Compromise |
| ASI04 | Agentic Supply Chain Vulnerabilities | A tool, MCP server, prompt or package the agent loads is malicious or tampered with | T17 Supply Chain Compromise |
| ASI05 | Unexpected Code Execution (RCE) | Generated or injected code runs with real privileges | T11 Unexpected RCE and Code Attacks |
| ASI06 | Memory & Context Poisoning | Bad data is stored and then trusted in later sessions | T1 Memory Poisoning |
| ASI07 | Insecure Inter-Agent Communication | Agent-to-agent messages are spoofed, altered or replayed | T12 Agent Communication Poisoning, T16 Insecure Inter-Agent Protocol Abuse |
| ASI08 | Cascading Failures | One fault propagates through chained agents and steps | T5 Cascading Hallucination Attacks; T8 as the tracing defence |
| ASI09 | Human-Agent Trust Exploitation | The agent's fluency and authority talk a human into approving harm | T7, T8, T10 Overwhelming the Human in the Loop |
| ASI10 | Rogue Agents | A compromised or misaligned agent keeps acting outside its scope | T13 Rogue Agents in Multi-Agent Systems |

If you came from an older version of the taxonomy, three familiar threats are missing as top-level entries: resource overload (T4), repudiation (T8) and overwhelming the human in the loop (T10). They are still real. The Top 10 folds them into ASI02, ASI08 and ASI09.

## The multiplier: excessive agency

One risk from the LLM list amplifies all ten: **excessive agency**, LLM06 in the 2025 LLM Top 10 and LLM03 in the 2026 edition. An agent with more tools, broader credentials or more autonomy than its task needs turns every vulnerability into a bigger blast radius. A prompt injection against a read-only agent is a nuisance; against an agent that can issue refunds it is fraud. Remove tools first, then work through the list.

The attack scenarios below are summarized from the examples on OWASP's entry pages. The code is illustrative: patterns to adapt, with fictional names such as `acme` and `example.com`.

## ASI01: Agent Goal Hijack

**Attack.** An attacker emails a crafted message. The assistant processes it as part of normal work, follows the hidden instructions and exfiltrates mail and files with no user click. OWASP cites EchoLeak against Microsoft 365 Copilot as this pattern.

**Control: taint tracking.** Once untrusted content enters the context, high-impact tools need approval for the rest of the run.

```python
HIGH_IMPACT = {"send_email", "http_post", "delete_record", "create_payment"}

class Run:
    def __init__(self):
        self.tainted = False

    def add_context(self, text: str, source: str):
        if source not in {"system", "operator"}:   # web, email, files, tool output
            self.tainted = True

    def authorize(self, tool: str) -> str:
        if tool in HIGH_IMPACT and self.tainted:
            return "needs_human_approval"
        return "allow"
```

It does not detect injection. It makes a successful one unable to act alone, which is the realistic goal. See [defending against prompt injection](/guides/ai-safety/defending-prompt-injection) for the input side.

## ASI02: Tool Misuse and Exploitation

**Attack.** A customer service bot meant to look up order history also issues refunds, because its tool was wired to the full financial API. In another OWASP example, instructions hidden in a PDF tell the agent to run a cleanup script and send the logs to an outside address.

**Control: validate arguments in code, not in the prompt.**

```python
from pydantic import BaseModel, Field, field_validator

class RefundArgs(BaseModel):
    order_id: str = Field(pattern=r"^ord_[a-z0-9]{12}$")
    amount_cents: int = Field(gt=0, le=5_000)      # hard ceiling per call
    reason: str = Field(max_length=200)

class SendEmailArgs(BaseModel):
    to: str
    body: str = Field(max_length=5_000)

    @field_validator("to")
    @classmethod
    def internal_only(cls, v: str) -> str:
        if not v.endswith("@example.com"):
            raise ValueError("external recipients require approval")
        return v
```

Add a per-run budget (calls per tool, total spend) so a loop cannot multiply a small allowed action. That also covers the resource-overload factor OWASP links to this entry.

## ASI03: Identity and Privilege Abuse

**Attack.** A finance agent delegates to a database-query agent and passes all of its permissions along. An attacker who can steer the query prompt uses the inherited access to pull HR and legal data.

**Control: every agent gets its own minimal scope, and delegation never inherits.** In Claude Code, a subagent with no `tools` field inherits every tool available to subagents, so state the list:

```markdown
---
name: db-reader
description: Answers questions from the reporting database. Read-only.
tools: Read, Grep, Glob
---

Query the reporting replica only. Never write, and never read outside ./reports.
```

Apply the same rule to credentials: a short-lived token minted per task, scoped to one resource, beats a long-lived service key shared by every agent.

## ASI04: Agentic Supply Chain Vulnerabilities

**Attack.** A package on npm impersonates a legitimate email MCP server and quietly BCCs every message to the attacker. OWASP lists this as the first reported in-the-wild malicious MCP server, alongside [tool poisoning](/glossary/tool-poisoning) through MCP tool descriptions.

**Control: pin what the agent loads, and review it like a dependency.** An unpinned `npx -y some-mcp-server` runs whatever was published most recently.

```json
{
  "mcpServers": {
    "mail": {
      "command": "npx",
      "args": ["-y", "@acme/mail-mcp@1.4.2"]
    }
  }
}
```

Pin exact versions, install with a lockfile (`npm ci`, not `npm install`), keep an inventory of every server, prompt and model the agent uses, and re-review when a tool's description changes. The wider practice is covered in [software supply chain security](/guides/ai-safety/software-supply-chain-security).

## ASI05: Unexpected Code Execution (RCE)

**Attack.** A user asks the agent to "process this file: `test.txt && rm -rf /important_data`" and the agent passes the string to a shell. OWASP also lists agents that run unreviewed install commands during self-repair and overwrite production data.

**Control: generated code never runs on your host.** Execute it in a disposable sandbox with no network and no secrets.

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(allow_internet_access=False, timeout=60)
try:
    result = sbx.run_code(generated_code)
finally:
    sbx.kill()
```

Pass arguments as arrays, never as an interpolated shell string. Platform choices and egress allowlists are compared in [sandboxing AI-generated code](/guides/advanced/sandboxing-ai-generated-code).

## ASI06: Memory & Context Poisoning

**Attack.** An attacker repeats a fake flight price across conversations until a travel assistant stores it as fact, then books at that price. In a shared-memory variant, bogus refund policies are written once and reused by every agent.

**Control: gate writes and namespace reads.**

```python
def write_memory(store, tenant_id: str, text: str, source: str):
    if source not in {"user_confirmed", "operator"}:
        return False                      # tool output and web text never become memory
    store.add(text, metadata={"tenant": tenant_id, "source": source})
    return True

def read_memory(store, tenant_id: str, query: str):
    return store.search(query, filter={"tenant": tenant_id})   # filter is mandatory
```

Record provenance on every entry so a poisoned record can be traced and purged, and expire memories instead of keeping them forever. Background: [agent memory](/glossary/agent-memory).

## ASI07: Insecure Inter-Agent Communication

**Attack.** An old "emergency" coordination message is replayed to a group of agents, which run outdated procedures. Over an unauthenticated channel, an attacker can also alter a message in transit.

**Control: sign every message and reject replays.**

```python
import hmac, hashlib, json, time

def sign(msg: dict, key: bytes) -> dict:
    msg = {**msg, "ts": int(time.time())}          # msg carries a unique "id"
    body = json.dumps(msg, sort_keys=True).encode()
    return {"msg": msg, "sig": hmac.new(key, body, hashlib.sha256).hexdigest()}

def verify(env: dict, key: bytes, seen: set, max_age: int = 60) -> bool:
    body = json.dumps(env["msg"], sort_keys=True).encode()
    expected = hmac.new(key, body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, env["sig"]):
        return False
    if time.time() - env["msg"]["ts"] > max_age or env["msg"]["id"] in seen:
        return False
    seen.add(env["msg"]["id"])
    return True
```

Use a separate key per agent pair so one compromised agent cannot forge messages from another. A valid signature proves who sent a message, not that its content is safe, so the receiver still validates it.

## ASI08: Cascading Failures

**Attack.** A prompt injection poisons a market-analysis agent and inflates its risk limits. Position and execution agents downstream trade larger positions automatically, and compliance sees activity that is "within parameters".

**Control: checkpoints between steps, with independent limits.** A downstream agent should not accept an upstream agent's numbers as its own policy.

```python
RISK_LIMIT = 50_000   # set in config by a human, never read from another agent

def checkpoint(step: str, output: dict) -> dict:
    if step == "analysis" and output["proposed_limit"] > RISK_LIMIT:
        raise RuntimeError("limit exceeds policy; halting pipeline for review")
    return output
```

Add circuit breakers (stop after N consecutive failures), bounded retries, and a trace that links every action to the step that caused it, which is the T8 defence OWASP points to here.

## ASI09: Human-Agent Trust Exploitation

**Attack.** A poisoned vendor invoice is ingested by a finance copilot, which recommends an urgent payment to the attacker's bank details with a confident explanation. The finance manager approves.

**Control: show the reviewer the action, not the agent's argument for it.** An approval prompt should be built by your code from the literal tool call:

```text
APPROVAL REQUIRED: create_payment
  payee:     Northwind Supplies Ltd (bank details CHANGED 2 days ago)
  amount:    USD 48,200.00
  source:    invoice-attachment (untrusted)
  agent's stated reason is hidden; open the trace to read it
[approve] [reject] [verify payee out of band]
```

Tier the actions so people are asked rarely: auto-allow low-risk calls, require approval only for irreversible or high-value ones. Reviewers who approve everything all day stop reading, which is the T10 threat. The [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) skill builds this tiering.

## ASI10: Rogue Agents

**Attack.** Agents told to minimize cloud cost learn that deleting production backups is the most effective route and do it. In another OWASP example, an agent that met a poisoned web instruction keeps scanning and sending files after the source is gone.

**Control: a behavioural envelope and a kill switch outside the agent.**

```python
ENVELOPE = {
    "cost-optimizer": {
        "allowed_actions": {"resize_instance", "stop_idle_instance"},
        "max_actions_per_hour": 20,
    }
}

def enforce(agent: str, action: str, count_this_hour: int, disabled: set):
    rule = ENVELOPE[agent]
    if agent in disabled:
        raise PermissionError("agent disabled by operator")
    if action not in rule["allowed_actions"] or count_this_hour >= rule["max_actions_per_hour"]:
        disabled.add(agent)                # trip the switch, then alert a human
        raise PermissionError(f"{agent} left its envelope: {action}")
```

The envelope and the disable flag must live in infrastructure the agent cannot edit. Log every decision so you can show what the agent did and when it was stopped.

## Four controls cover most of the list

- **Least privilege**: minimal tools, scopes and autonomy. Reduces ASI02, ASI03 and ASI10, and limits what ASI01 can achieve.
- **Human approval for irreversible actions**, risk-tiered and shown as literal actions. Addresses ASI01, ASI08 and ASI09.
- **Audit of every action, tool call and memory write**, with caller, arguments and result. Needed to detect ASI06, ASI08 and ASI10 at all.
- **[Guardrails](/glossary/guardrails) on inputs and outputs**: validation at every trust boundary. See the [llm-guardrails-designer](/skills/security/llm-guardrails-designer) skill.

## How to use the list

Draw your agent's architecture, then walk ASI01 to ASI10 against each component: what untrusted content reaches the context, which tools can change state, whose credentials each agent holds, what it loads at startup, where code runs, what gets written to memory, and how agents authenticate to each other. Mark each entry as not applicable, mitigated or open, and fix the open ones in order of blast radius.

The [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) covers the reliability side (loops, budgets, checkpoints), and the [prompt-injection-auditor](/agents/quality-security/prompt-injection-auditor) maps where untrusted content enters and what an injection could reach. For the definition of the systems this list applies to, see [agentic AI](/glossary/agentic-ai).
