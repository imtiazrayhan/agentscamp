---
title: "How to Summarize an Email Thread with AI and Draft a Reply"
description: "Use AI to reconstruct a long email thread, distinguish current decisions from old requests, identify open questions, and draft a reply for review."
seoTitle: "Summarize an Email Thread with AI and Draft a Reply"
seoDescription: "Summarize a long email thread with AI, separate current decisions from old requests, and draft a reply with a reusable prompt and review checklist."
author: "Imtiaz Rayhan"
date: 2026-10-06
reviewed: 2026-10-06
depth: "standard"
color: "orange"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers", "sales", "analysts"]
tags: ["email", "outlook", "thread-summary", "reply-drafting"]
featured: false
keywords: ["summarize email thread with AI", "AI email summary prompt", "draft reply to long email thread"]
summary: "Before drafting an AI email reply, rebuild the thread's chronology and separate current instructions, superseded requests and open questions. Verify the latest commitments against the original messages, then draft only what you are authorized to say and review the recipients before sending."
keyTakeaways:
  - "Keep message dates and authors so quoted old requests stay in context."
  - "Treat an explicit revision differently from a newer unrelated message."
  - "Supply attachments separately when their contents matter."
  - "Review commitments and recipients before sending the draft."
howtoSteps:
  - name: "Prepare the thread"
    text: "Supply approved messages with authors, dates and message IDs, and identify any missing attachments or side conversations."
  - name: "Reconstruct the current state"
    text: "Ask for a chronology, current instructions, superseded requests and unresolved questions with message references."
  - name: "Check the evidence"
    text: "Open messages supporting each commitment and verify whether later messages explicitly revise them."
  - name: "Draft and review the reply"
    text: "State the reply goal and permitted commitments, then check the draft, recipients and attachment details before sending."
faq:
  - q: "Can I summarize an email thread without connecting my inbox?"
    a: "Use an approved assistant with a supplied copy of the relevant messages. Preserve dates, authors and references, include needed attachments, and label any missing parts of the conversation."
  - q: "Does the latest email always replace earlier instructions?"
    a: "No. Look for an explicit revision, confirmation or authority rule. A newer message can discuss another topic or quote an older request without approving it. Keep uncertain changes unresolved."
  - q: "Why is Draft with Copilot unavailable for a plain-text email?"
    a: "Microsoft says Draft with Copilot in new Outlook and Outlook on the web does not support plain-text composition. Check the HTML composition setting and contact IT if access is still missing."
related: ["tool:microsoft-copilot", "tool:chatgpt", "guide:best-ai-writing-tools-2026", "guide:ai-meeting-notes-action-items", "guide:ai-document-research-with-citations"]
sources:
  - title: "Summarize an email thread with Copilot in Outlook"
    url: "https://support.microsoft.com/en-us/outlook/copilot-pages/summarize-an-email-thread-with-copilot-in-outlook"
    publisher: "Microsoft"
  - title: "Draft an email message with Copilot in Outlook"
    url: "https://support.microsoft.com/en-us/outlook/copilot-pages/draft-an-email-message-with-copilot-in-outlook"
    publisher: "Microsoft"
  - title: "Get started with ChatGPT Work"
    url: "https://learn.chatgpt.com/docs/get-started-with-work"
    publisher: "OpenAI"
---

To summarize an email thread with AI and draft a useful reply, first establish what is still requested. Reconstruct the chronology, separate current instructions from superseded requests, and identify open questions. Verify those rows against the original messages before asking for a draft. The reply should confirm only what you are authorized to confirm and ask about what remains unresolved.

A short narrative summary is often insufficient for this job. It may mention both an old quantity and its replacement without explaining which governs the reply. Use a current-state table alongside the chronology, then draft from the verified table. This makes the evidence and the remaining uncertainty easier to inspect.

## Choose a route and prepare the evidence

Copilot in Outlook can summarize the chosen thread; numbered citations may navigate to corresponding messages. New Outlook and the web also offer separate PDF, PowerPoint and Word attachment summaries. [Microsoft's thread-summary documentation](https://support.microsoft.com/en-us/outlook/copilot-pages/summarize-an-email-thread-with-copilot-in-outlook).

Alternatively, supply approved copies to an available assistant. ChatGPT Chat suits questions and short drafts; Work uses available files and approved tools for larger deliverables. [ChatGPT Work documentation](https://learn.chatgpt.com/docs/get-started-with-work). Choose the route your organization permits for the material involved. A supplied-thread workflow does not require a claim that the assistant can see your inbox.

Preserve each message's author, date, time zone when relevant, and a stable reference such as M1 or M2. Keep original text distinct from quoted history. Remove duplicated quote blocks only if you retain the underlying original messages and their provenance. A sentence repeated inside a newer email is still an older sentence unless the new author explicitly adopts or revises it.

Include the reply goal and the sender's authority. Identify missing attachments, side conversations and messages from another branch. If an invoice matters, supply its approved contents separately or leave its terms unknown. A filename or “attached” line establishes that a sender mentioned a file, not that its contents were read.

## Worked example: a catering conversation

The following event-catering thread, people and dates are fictional. This is a worked example of reasoning about messages, not a tested product response. The messages concern an October 16 event at a community venue:

| ID | Date / author | Relevant content |
| --- | --- | --- |
| M1 | October 1 / Maya, organizer | Requests 60 boxed lunches for October 16 and asks for an invoice. |
| M2 | October 2 / Leo, caterer | Offers 60 lunches, asks for the vegetarian count, and says the invoice will follow. |
| M3 | October 4 / Maya | Explicitly revises the order to 48 lunches and requests eight vegetarian meals. |
| M4 | October 5 / Leo | Confirms 48 lunches including eight vegetarian meals and attaches an invoice. |
| M5 | October 6 / Priya, venue | Asks which delivery entrance will be used and quotes M1's old request for 60 lunches. |

The invoice contents are not supplied. No message establishes a payment deadline, deposit or approved delivery entrance. The eight vegetarian meals are included in the total of 48; they are not an additional eight. M5 does not revive the old quantity merely by quoting it.

Extract the current state explicitly:

| Item | Current state | Evidence | Superseded evidence | Condition / open question |
| --- | --- | --- | --- | --- |
| Meal count | 48 total, including eight vegetarian | M3 revision; M4 confirmation | M1 and M2's 60-lunch quantity | No further quantity change supplied. |
| Event date | October 16 | M1; no supplied revision | None | Delivery time is not established. |
| Entrance | Unresolved | M5 question | None | Venue must identify the entrance. |
| Invoice | Attachment mentioned; contents unavailable | M4 | M2's “forthcoming” status | Obtain and review the actual invoice. |
| Payment | No established terms or commitment | None in supplied messages | None | Do not infer a deposit or promise a payment date. |

The latest timestamp is useful for chronology, but it does not determine authority. M3 explicitly changes the quantity and M4 confirms it. M5 asks about another subject. When there is no explicit resolution—for example, two people propose conflicting entrances—keep the issue open and ask the responsible owner.

## Extract first, then verify

Use a first prompt that postpones drafting:

```text
Use only the supplied messages. First return a chronology with message IDs.
Then return Current instructions, Superseded requests, Commitments and
Open questions, with message references and any conditions for each row.
Distinguish original messages from quoted history. A later date alone
does not override an earlier instruction. Do not infer attachment contents,
owners, deadlines or payment terms. Do not draft a reply yet.
```

Open the messages behind every commitment that could affect the reply. For the fictional thread, read M3 and M4 to verify both the total and the word “including.” Read M5 to confirm that the entrance is a question, not an instruction. A reference is a pointer for the reviewer; it is not proof that the extracted statement is right.

If references are absent, assign message IDs to the supplied copy and request a revised table. If a needed branch is missing, obtain it through an approved route before resolving the disputed point. The [document research workflow](/guides/workflow/ai-document-research-with-citations) provides a broader method for checking claims against source passages.

## Draft within the sender's authority

In the fictional example, Maya may confirm the meal count and ask about the entrance and invoice. She is not authorized to approve payment or promise venue access. State that boundary separately from the thread summary:

```text
Draft a reply from Maya using the verified current-state table.
Label it Draft. Confirm 48 lunches total, including eight vegetarian.
Ask Priya to identify the delivery entrance and any access instructions.
Ask Leo to resend the invoice for separate review because its contents
are not included in this source pack.
Do not approve payment, promise a payment date or confirm venue access.
Return the text for review. Do not send or modify the inbox.
```

An illustrative reply is:

> **Draft — October 16 lunch delivery**
>
> Hi Leo and Priya,
>
> Confirming our order for October 16: 48 boxed lunches in total, including eight vegetarian meals, as revised and confirmed in our October 4–5 messages.
>
> Priya, could you confirm which entrance the delivery should use and any access instructions? That detail is still open.
>
> Leo, please resend the invoice so we can review its terms separately.
>
> Thanks, Maya

This draft deliberately leaves payment and access unresolved. It avoids repeating the old 60-lunch quantity, which could create a fresh ambiguity. Do not describe the invoice as approved or the order as paid when the evidence establishes neither.

Check whether both recipients need the same reply. In this fictional case, the quantity and entrance coordination may be relevant to both, while later financial details may warrant a separate message. Inspect actual addresses, copied recipients and quoted private content before using reply all; the thread's existing recipient list is not a substitute for that decision.

Copilot's drafting interfaces support revisions before review and sending. In new Outlook or the web, Draft with Copilot requires HTML rather than plain-text composition; missing access goes to IT. [Microsoft's email-drafting documentation](https://support.microsoft.com/en-us/outlook/copilot-pages/draft-an-email-message-with-copilot-in-outlook). Review remains necessary regardless of how you obtain the text. Prompt instructions describe the intended boundary; they do not technically enforce it.

## Review the draft and repair the specific problem

Read the draft beside the current-state table. Check quantities, inclusions, negations, dates and conditions. “Including eight” and “plus eight” are different commitments. “Could you confirm?” and “we confirm” assign responsibility differently. Remove invented owners and deadlines instead of making the message sound more complete.

Check attachment names and contents separately, and avoid forwarding sensitive quoted material that is unnecessary for the reply. Confirm the sender is authorized to make each promise, then review the actual recipients. Sending is a separate action from producing text.

| Problem | Repair |
| --- | --- |
| Old quantity returns in the summary | Inspect the explicit revision and its confirmation; mark quoted history as superseded. |
| Two messages seem to conflict | Obtain the missing branch or ask the owner; retain uncertainty until resolved. |
| No usable message references | Assign IDs and request evidence pointers for each row. |
| Attachment terms are invented | Review the attachment separately or leave its terms unknown. |
| Draft with Copilot is unavailable in new Outlook or the web | Check HTML composition and workspace access with IT. |
| The draft invents an owner or deadline | Remove it or ask for an authorized assignment. |
| A confident reply exceeds the evidence | Return to the verified table and narrow the permitted confirmations. |

For another form of conversation evidence, see [meeting notes and action items](/guides/workflow/ai-meeting-notes-action-items). For broader writing-tool choices, use [AI writing tools compared](/guides/comparisons/best-ai-writing-tools-2026). In an existing thread, the immediate job is to preserve the current agreement and make the next unresolved question easy to answer.
