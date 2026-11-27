---
title: "ChatGPT Projects vs Claude Projects for Teams"
description: "ChatGPT Projects vs Claude Projects compared on plan availability, file limits, sharing roles, memory, and connected sources, with a shared-brief template."
seoTitle: "ChatGPT Projects vs Claude Projects for Teams"
seoDescription: "Compare ChatGPT Projects and Claude Projects for teams: plans, file limits, sharing roles, memory behaviour, and a reusable project brief."
author: "Imtiaz Rayhan"
date: 2026-10-06
updated: 2026-11-27
reviewed: 2026-11-27
depth: "standard"
color: "blue"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers", "sales", "designers", "analysts"]
tags: ["comparison", "chatgpt", "claude", "projects", "team-collaboration"]
featured: false
keywords: ["ChatGPT Projects vs Claude Projects", "shared AI projects", "AI project instructions"]
summary: "ChatGPT Projects can be shared on every plan, including Free, but cap uploads at 5 to 40 files per project. Claude Projects share only on Team and Enterprise plans, and paid plans expand project knowledge up to 10x through retrieval. Pick ChatGPT for mixed or external groups, Claude for one organization with many documents."
keyTakeaways:
  - "Sharing is the biggest gap: ChatGPT lets Free, Go, Plus and Pro users invite collaborators, while Claude project sharing needs a Team or Enterprise plan."
  - "ChatGPT limits files per project (5 on Free, 25 on Go and Plus, 40 on Pro, Business, Enterprise and Edu). Claude limits knowledge by context window, and paid plans switch to retrieval for up to 10x more."
  - "Both have two roles. ChatGPT: chat or edit, plus the owner. Claude: can view (which includes chatting) or can edit."
  - "A shared ChatGPT project is locked to project-only memory. A Claude project has its own memory and also uses your account memory unless you turn that off."
  - "Whichever you choose, keep changing facts in maintained source files, not in instructions, and test access from a teammate's account before rollout."
faq:
  - q: "Can I share a project on a free plan?"
    a: "In ChatGPT, yes: project sharing is available on Free, Go, Plus, Pro, Business, Enterprise and Edu, with up to 5 collaborators when the owner is on Free. In Claude, no: free accounts can create up to five projects, but sharing a project with other people requires a Team or Enterprise plan."
  - q: "How many files can a project hold?"
    a: "ChatGPT counts files: 5 per project on Free, 25 on Go and Plus, and 40 on Pro, Business, Enterprise and Edu, with at most 10 uploaded at once. Claude does not publish a file count. Its limit is the context window, and on paid plans a project that approaches it switches to retrieval (RAG) mode, which Anthropic says expands capacity by up to 10x."
  - q: "Do Claude project chats automatically share everything said in other chats?"
    a: "No. Anthropic's help center says context is not shared across chats within a project unless the information is added to the project knowledge base. Each project does have its own memory, which Claude uses alongside your account memory, but an approved decision should still go into project knowledge so every colleague sees the same record."
  - q: "How should I check a shared AI project before inviting the whole team?"
    a: "Ask one teammate to open the project with the access they will really have and start a fresh chat. Check that the answer cites the approved version of a document, keeps conditions attached to commitments, says when a fact is missing, and exposes only the material that teammate should see."
  - q: "What should go in AI project instructions?"
    a: "The task, audience, approved source list, output format, what to do when sources conflict, and who reviews the result. Keep prices, dates, commitments and other changing facts in source documents you can update. In ChatGPT, project instructions override your global custom instructions inside that project."
related: ["tool:chatgpt", "tool:claude", "guide:claude-vs-chatgpt-for-writing", "guide:claude-for-founders", "guide:claude-for-marketing-teams", "guide:human-in-the-loop-ai-workflows"]
sources:
  - title: "Projects in ChatGPT"
    url: "https://help.openai.com/en/articles/10169521-projects-in-chatgpt"
    publisher: "OpenAI"
  - title: "Projects and chats"
    url: "https://learn.chatgpt.com/docs/projects"
    publisher: "OpenAI"
  - title: "Manage ChatGPT Space and shared pages"
    url: "https://learn.chatgpt.com/docs/enterprise/chatgpt-space"
    publisher: "OpenAI"
  - title: "What are projects?"
    url: "https://support.claude.com/en/articles/9517075-what-are-projects"
    publisher: "Anthropic"
  - title: "How can I create and manage projects?"
    url: "https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects"
    publisher: "Anthropic"
  - title: "Retrieval augmented generation (RAG) for projects"
    url: "https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects"
    publisher: "Anthropic"
---

Both products put chats, files and instructions in one workspace so a colleague can continue work without your conversation history. They differ on who can share, how much a project holds, and what memory does once other people join.

## The short answer

- **Your group includes people outside one paid workspace** (clients, contractors, a mix of free and paid accounts): **ChatGPT Projects**. Sharing works on every plan.
- **Your team is on Claude Team or Enterprise and has a large reference set**: **Claude Projects**. Knowledge scales by retrieval, not by file count.
- **You are on an individual Claude plan and need to share**: you can't. Use ChatGPT, or move to Claude Team.
- **You want project context sealed off from personal memory**: ChatGPT does this automatically for shared projects. In Claude you turn off "Use account memory" per project.

## Feature comparison

Taken from OpenAI's and Anthropic's help centers in November 2026. This covers Claude's existing chat Projects; see the note on the new version below.

| | ChatGPT Projects | Claude Projects |
| --- | --- | --- |
| Plans that include projects | Signed-in users, subject to plan and workspace settings | All plans, including Free |
| Number of projects | Unlimited | Free accounts: maximum of five. No limit stated for paid plans |
| Plans that can share a project | Free, Go, Plus, Pro, Business, Enterprise, Edu | Team and Enterprise only |
| Roles | Owner, edit, chat | Can edit, can view (view includes chatting) |
| Who can change instructions and files | Owner and edit members | Can-edit members |
| Collaborator limit | 5 on Free, 10 on Go and Plus, 100 on Pro and in workspaces | Not stated |
| Link sharing | "Only those invited" or "Anyone with a link"; workspace link on Business, Enterprise, Edu | Specific members by email, or organization-wide |
| File capacity | 5 files per project on Free, 25 on Go and Plus, 40 on Pro, Business, Enterprise, Edu; 10 per upload | Bounded by the context window; paid plans switch to RAG for up to 10x more |
| Connected sources | Google Drive files and folders and Slack channels, added by link to a private project | Not covered in the project articles we checked |
| Instructions | Project instructions override global custom instructions | Project instructions apply to every chat in the project |
| Memory | Default or project-only; shared projects are always project-only | Each project has its own memory, plus account memory unless you turn it off |
| Admin control | Role-based permissions for creating and sharing projects | Owners can turn off project sharing; Enterprise can do it per role |

## What the differences mean for a team

**Sharing.** ChatGPT's model is closer to a shared document: the owner invites people, picks chat or edit access, and can open the project to anyone with the link. The collaborator cap follows the owner's plan. Claude's model is organizational: a project is private, shared with named members, or visible to the whole organization, and none of that exists below the Team plan. For an agency working with clients, that alone usually decides it.

**Capacity.** ChatGPT's file counts are low. Forty files is the ceiling even on Enterprise, so a team with a long policy library has to merge documents or use connected Google Drive folders, which have a separate limit. Note that the Google Drive app does not sync content in advance when used inside a project. Claude has no file count; the constraint is total content. On Pro, Max, Ultra, Team and Enterprise, a project that nears the context window switches to retrieval automatically and shows an indicator. The trade-off is that in RAG mode Claude searches for relevant passages and no longer reads every document on every turn, so a question that depends on a detail in an unretrieved file can miss it. Free Claude accounts do not get RAG.

**Memory and leakage.** When you share a ChatGPT project it is set to project-only memory and cannot be switched back: chats can reference other chats in the same project, but not a member's saved memories or conversations elsewhere. That is a sensible default for group work. Personal files from your Space are also removed from the project's sources when you share it, while files uploaded directly stay. In Claude, a project chat uses the project's memory together with your own account memory, and Anthropic states that context is not shared across chats in a project unless it is added to project knowledge. In practice: in both tools, a decision that matters should be saved as a source, not left in a chat. ChatGPT has an "Add to project sources" action on a response for this.

**Governance.** Both let workspace owners restrict sharing. ChatGPT Enterprise adds a "Share projects" permission that also controls who can open a project shared with them, and exposes project data to its Compliance API. Claude owners can turn off project sharing, and existing shares stay in place when they do.

> [!NOTE]
> Anthropic is rolling out a new version of projects, in beta as of November 2026, starting with Claude Code for selected Pro, Max and Ultra subscribers. In it a project is one conversation that Claude splits into parallel threads. Anthropic says chat, Cowork, Team and Enterprise will follow. If your team is on Team or Enterprise, the table above describes what you have today.

## Where each one loses

**ChatGPT Projects**

- Low file ceilings on every plan.
- Project-only memory is forced on shared projects, so a member's useful personal context never applies there.
- Slack and Google Drive links can only be added to a private project.
- "Anyone with a link" lets any logged-in ChatGPT user join, which is easy to leave on by mistake.

**Claude Projects**

- No sharing on Free, Pro, Max or Ultra.
- Free accounts are capped at five projects and have no RAG expansion.
- Capacity is described relative to the context window, so you cannot plan against a published number.
- The project model is changing, and individual plans are being moved to the new version first.

## Decide with one test

If both tools are approved where you work, the comparison above narrows the choice and a short pilot settles it. Build the same small project in each and have a colleague, not the owner, run one task.

### The brief

Start with four short files, not every historical document. The example is a fictional software company, Acme, preparing customer onboarding material.

| File | Its job | Maintained by |
| --- | --- | --- |
| `team-brief.md` | Task, audience, deliverables, review process | Onboarding lead |
| `approved-facts.md` | Current product commitments and their conditions | Delivery owner |
| `decision-log.md` | Approved changes, dates, approvers, superseded choices | Onboarding lead |
| `source-register.csv` | Source IDs, versions, owners, and what each is authoritative for | Document coordinator |

A register row might read `S2, approved-facts.md, 2026-10-01, delivery owner, onboarding commitments`. The last field tells the assistant and the reviewer which source governs a claim when two disagree. If your files do disagree, resolve that with the [document research workflow](/guides/workflow/ai-document-research-with-citations) first; if a change came from a call, the [meeting notes workflow](/guides/workflow/ai-meeting-notes-action-items) separates a decision from a proposal.

### The instructions

Instructions describe behaviour. Facts live in the files. Paste this into the project instructions field in either product:

```text
Team task: draft customer onboarding material.
Audience: new customer admins, unfamiliar with our internal terms.
Evidence: use sources listed in source-register.csv for factual claims.
Precedence: follow the authoritative-for field for each claim type.
If that does not resolve a conflict, show both versions and name
the document owner who needs to clarify.

Cite source ID and section beside product commitments.
If a claim, owner, or deadline is missing, write "Not established".
Do not turn a target or conditional statement into a promise.
Keep suggestions separate from approved facts.

Output: draft answer, evidence references, questions for review.
Reviewer: onboarding lead. The answer is a draft until reviewed.
```

### The teammate check

Include an outdated sales draft next to the approved policy, then have the colleague ask in a fresh chat: "What can we promise about onboarding, and who owns the customer access-list request?" The owner of that request is deliberately not recorded anywhere.

| Check | Passing evidence |
| --- | --- |
| Source access | The teammate can open the document used for the commitment |
| Version choice | The answer uses the current policy and flags the old draft |
| Qualifiers | The prerequisite condition stays attached to the commitment |
| Missing information | The answer says the request owner is not established |
| Review effort | The reviewer finds the supporting section without reading every chat |

Record which tool passed which row, and how long setup took. We have not run this pilot ourselves, and one good answer proves little; the handoff to a second person is the part that predicts whether the project will work for a team. For a standing approval process, see [human-in-the-loop AI workflows](/guides/workflow/human-in-the-loop-ai-workflows).

## When something fails

| Problem | Fix |
| --- | --- |
| A colleague cannot open a cited source | Check the file's location and their role, then repeat the teammate check. In ChatGPT, confirm it was not a personal Space file removed at sharing |
| The answer uses a stale commitment | Mark the old document superseded in the register, or remove it |
| A decision exists only in a chat | Have its owner approve it and save it to the decision log or project sources |
| Instructions contradict a source | Take the fact out of the instructions and fix the authority rule |
| Claude misses a detail in a large project | The project may be in RAG mode; name the document in your question or trim the knowledge base |

Assign one owner to the register and review it when policy changes. A project is ready for wider use when a teammate can open the evidence, produce the draft and say what still needs approval. If your decision is about writing quality and not collaboration, the [Claude vs ChatGPT writing guide](/guides/comparisons/claude-vs-chatgpt-for-writing) covers that job.
