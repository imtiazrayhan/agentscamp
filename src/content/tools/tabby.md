---
name: "Tabby"
description: "Self-hosted, open-source AI coding assistant by TabbyML — run your own completion and chat models on your infrastructure, with IDE extensions."
url: "https://www.tabbyml.com/"
pricing: "open-source"
category: "extension"
repo: "https://github.com/TabbyML/tabby"
related: ["tabnine", "continue", "github-copilot"]
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
alternativeTo: ["github-copilot", "continue", "cody"]
sameAs:
  - "https://github.com/TabbyML/tabby"
  - "https://tabby.tabbyml.com/docs/welcome/"
topics: ["coding-languages"]
tags: ["self-hosted", "code-completion", "open-source", "copilot-alternative", "on-premises"]
color: "purple"
date: 2026-06-17
featured: false
summary: "Tabby is a self-hosted, open-source AI coding assistant and GitHub Copilot alternative. Run code completion and chat models on your own infrastructure, with extensions for VS Code, JetBrains, and Vim. The core is Apache-2.0; a free Community tier covers up to 5 users, with paid Team and Enterprise tiers."
faq:
  - q: "Is Tabby open source?"
    a: "Yes. The core of Tabby is licensed under Apache-2.0; enterprise-edition code under the repository's ee/ directory has separate licensing terms. The free Community tier supports up to 5 users."
  - q: "How is Tabby different from GitHub Copilot?"
    a: "Tabby is self-hosted, so completion and chat models run on your own infrastructure rather than a vendor cloud. It is self-contained (no external DBMS required), supports consumer-grade GPUs, and exposes an OpenAPI interface for integration."
  - q: "Which editors does Tabby support?"
    a: "Tabby ships IDE/editor extensions for VS Code, JetBrains IDEs (IntelliJ), and Vim, connecting to a self-hosted Tabby server typically deployed via Docker."
---

**Tabby is a self-hosted, open-source AI coding assistant that lets teams run their own code-completion and chat models on private infrastructure as an alternative to GitHub Copilot.**

Built by TabbyML, Tabby is designed to be self-contained: it requires no external DBMS or cloud service and supports consumer-grade GPUs, making it practical to deploy on a single machine or internal server (Docker is the primary install path). It exposes an OpenAPI interface so it can be wired into existing developer infrastructure, including cloud IDEs.

Developers interact with Tabby through editor extensions for VS Code, JetBrains IDEs (IntelliJ), and Vim, which connect to the self-hosted server for inline completion, chat, and context-aware answers. A team-oriented "Answer Engine" indexes repositories and related sources (including GitLab merge requests) so the assistant can draw on internal knowledge.

Tabby is aimed at teams and organizations that want Copilot-style assistance but need to keep code and prompts on their own infrastructure for privacy, compliance, or cost reasons. Compared with **GitHub Copilot**, which is a hosted SaaS product, Tabby is self-hosted and open source. Compared with **Continue** and **Cody**, which also offer open-source editor assistants and various model backends, Tabby differentiates by shipping its own self-hostable server and model-serving stack rather than primarily acting as a client to third-party model providers.

Licensing is split: the bulk of the codebase is Apache-2.0, while enterprise-edition code under the repository's `ee/` directory carries separate terms. Pricing follows a free Community tier (up to 5 users) with paid Team and Enterprise tiers for larger deployments and added administration, security, and support features.