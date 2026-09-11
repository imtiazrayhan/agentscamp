---
name: "cold-email-deliverability-auditor"
description: "Audit a cold email program's sending setup and message body against the things that decide whether mail reaches an inbox: SPF, DKIM and DMARC records with their alignment and policy, the DNS lookup limit, a separate sending domain versus the primary corporate one, domain age and warmup state, list hygiene with bounce and complaint exposure, spam-trigger language, link and image ratio, unsubscribe presence, and the volume ramp per mailbox. Findings come back by severity with the concrete fix and the order to apply them. Use when a sending domain is new, replies have collapsed, or nobody has checked the DNS records, the list, and the copy in the same sitting."
version: "1.0.0"
color: "orange"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "cold-email", "deliverability", "dmarc"]
featured: false
related: ["skill:outreach-claim-checker", "guide:claude-skills-for-sales", "guide:claude-for-sales-teams", "guide:claude-code-for-revenue-ops", "skill:email-sequence-drafter", "tool:outreach", "tool:apollo", "glossary:sales-engagement-platform"]
seoDescription: "A Claude skill that audits cold email deliverability: SPF, DKIM, DMARC alignment, domain warmup, list hygiene, spam triggers, unsubscribe, volume ramp."
summary: "Paste your SPF, DKIM and DMARC records, your sending stats, and one real email, and this skill audits the whole path to the inbox: authentication and alignment, sending-domain separation, domain age and warmup, bounce and complaint exposure, spam-trigger language, links and images, unsubscribe, and volume ramp. Findings come back by severity with the fix and the order to apply them."
---

Perfect personalization does not help from a domain that is not authenticated. Nothing in Anthropic's [sales plugin](https://github.com/anthropics/knowledge-work-plugins) touches the technical side of sending, and neither does most sales tooling — the sequencer sends what you give it and reports opens. This skill audits the layer underneath: the DNS records that prove you are you, the domain you send from, the list you send to, and the message itself. It works from text you paste, so it runs anywhere Claude does; pair it with [outreach-claim-checker](/skills/sales/outreach-claim-checker), which checks whether the email is true, once you know it will arrive.

## When to use this skill

- You are about to start sending from a new domain or a new set of mailboxes.
- Reply rates fell off a cliff and nothing about the copy changed.
- Mail lands in Promotions or Spam for some recipients and Inbox for others.
- You inherited a sending setup and have never seen its DNS records.
- Your provider or a prospect's IT team bounced messages with a DMARC or SPF error you cannot read.
- Before a volume increase, a domain migration, or moving cold outbound off the primary corporate domain.

> [!NOTE]
> This skill reads what you paste. It does not query DNS, log into a mailbox, or test-send. Ask your ESP or a DNS lookup for the raw records and paste them in. Every threshold below is a default this skill applies so its output is consistent; where your provider publishes its own numbers, say so and those win. Two thresholds are not ours: Google's published Email sender guidelines require authentication for every sender and, above 5,000 messages a day to Gmail accounts, SPF and DKIM and DMARC, one-click unsubscribe, and a spam-complaint rate kept under 0.3%. RFC 7208 caps SPF at 10 DNS lookups.

## Inputs to ask for

Ask for all of these in one message; audit what arrives and mark the rest "not supplied" rather than guessing.

1. The sending domain and the primary company domain.
2. The SPF TXT record, the DKIM record for each selector in use, the DMARC TXT record, and the MX record.
3. The date the sending domain was registered, and the date it started sending.
4. Sending platform, number of mailboxes, and messages per mailbox per day for the last four weeks.
5. Hard bounce rate, soft bounce rate, and spam-complaint rate over the same period.
6. Where the list came from, when it was last verified, and whether it is verified at send time.
7. One real email exactly as sent — subject, body, signature, links, images, footer.
8. Whether open tracking, click tracking, or a custom tracking domain is on.

## Instructions

1. **Establish the setup.** Restate the domain, mailbox count, daily volume, and program age in four lines so the reader can confirm you are auditing the right thing. Note anything not supplied.
2. **Check authentication.** For each record, report what it says, then what it means.
   - **SPF**: exactly one SPF record for the domain (two is a permanent error); every sending platform present in it; count the DNS lookups against the limit of 10; the qualifier at the end (`-all` fail, `~all` softfail, `+all` is a hole).
   - **DKIM**: a published key per selector, the signing domain, and the key length. 1024-bit is weak; 2048-bit is the current default.
   - **DMARC**: the policy (`p=none`, `quarantine`, `reject`), any `sp=`, the percentage, and whether `rua=` reporting goes somewhere a human reads.
   - **Alignment**: DMARC passes only when a passing SPF or DKIM domain aligns with the visible From domain. Check the envelope-from and the DKIM `d=` against the From. Platforms that send on your behalf without a custom return-path break SPF alignment silently.
3. **Check domain strategy.** Cold outbound sent from the primary corporate domain puts payroll, invoices, and password resets behind the same reputation. Flag it. A dedicated domain should be a plausible variant of the brand, have a working MX and a redirect to the main site, and carry its own DMARC.
4. **Check age and warmup.** Compute the domain's age from registration and from first send. Domains younger than 30 days sending at full volume are the single most common cause of a program that never worked. Report the ramp actually observed week over week and flag any increase greater than roughly double the prior week, or a first week above 20 messages per mailbox per day.
5. **Check list hygiene.** Apply these defaults: hard bounces at or above 5% is critical, 2 to 5% is high, under 2% is acceptable but worth watching; spam complaints at or above 0.3% is critical against Google's published threshold, and 0.1% is the number to aim at. Flag any list that was scraped, purchased, or has not been verified in 90 days, and any send with no verification step between export and send. Note whether role addresses (info@, sales@, support@) and known spam traps patterns (long-dead domains, catch-all-only domains) were filtered.
6. **Check the message.** Read the pasted email and mark:
   - **Language**: guarantee-and-urgency phrasing, all-caps words, exclamation stacking, money symbols in the subject, "free", "act now", "risk-free", and the subject line length.
   - **Structure**: total links, whether any is a link shortener, image count and the image-to-text ratio, whether the email is a single image, and whether a plain-text alternative exists.
   - **Tracking**: an open-tracking pixel and click-rewriting on cold mail, and whether tracking runs on a custom subdomain of the sending domain or on the vendor's shared domain.
   - **Footer**: a working unsubscribe or opt-out path and a physical address. One-click unsubscribe (`List-Unsubscribe` with `List-Unsubscribe-Post`) is required for bulk senders under Google's guidelines and is worth having below the threshold too.
   - **Identity**: whether the From name and address match a real person with a real mailbox that can receive replies.
7. **Assign severity.** Deterministic, first match wins:
   - **Critical** — no SPF, no DKIM, no DMARC record, SPF over the lookup limit, two SPF records, `+all`, cold sending from the primary domain, bounces at or above 5%, complaints at or above 0.3%, or no unsubscribe path.
   - **High** — DMARC alignment failing, `p=none` with no plan to enforce, a domain under 30 days at full volume, a ramp jump over 2x, an unverified or purchased list, or a single-image email.
   - **Medium** — 1024-bit DKIM, no `rua` reporting, shared tracking domain, more than two links, spam-trigger language, no plain-text alternative.
   - **Low** — subject length, formatting, signature bloat.
8. **Order the fixes.** Authentication first, then domain strategy, then list, then volume, then copy. Say which fixes take effect on the next send and which need DNS propagation or a warmup period before the effect is visible. Do not recommend raising volume in the same pass as a reputation fix; one change at a time, or you cannot tell what worked.
9. **Say what you could not check.** Reputation with a specific mailbox provider, whether a domain is on a blocklist, and actual inbox placement are all live lookups. Name them as the next steps outside this skill rather than implying the audit covered them.

## Output

1. **Setup summary** — domain, mailboxes, volume, program age, what was not supplied.
2. **Findings table** — severity, area (authentication, domain, warmup, list, message), what was found, why it matters, and the exact fix, including the literal record to publish where the fix is a DNS change.
3. **Fix order** — a numbered sequence with the wait time attached to each step.
4. **Re-check list** — what to re-measure after each fix, and when.
5. **Out of scope** — the live checks this audit could not perform.

## Example

An excerpt from an audit of a two-week-old sending domain:

```markdown
| Sev | Area | Finding | Fix |
|---|---|---|---|
| Critical | Auth | Two SPF TXT records on the domain — a permerror, so SPF never passes | Merge into one record with both include: mechanisms |
| Critical | Domain | Cold sequences sending from the primary corporate domain | Move to a dedicated domain; warm it before cutover |
| High | Warmup | 14 days old, already at 120/mailbox/day | Drop to 20/day, add ~50% per week |
| High | List | 2,400 rows exported in March, never re-verified | Verify at send time; expect 6-9% to drop |
| Medium | Message | 6 links, 2 of them shortened | One link, no shorteners |

Order: SPF (48h to propagate and confirm) → DMARC rua → domain move →
list verification → volume reset → copy. Re-measure bounces after send 1.
```

Once the path to the inbox is sound, the content still has to be true — that is [outreach-claim-checker](/skills/sales/outreach-claim-checker), run from [/check-outreach](/commands/sales/check-outreach). Sequencers like [Outreach](/tools/outreach) and [Apollo](/tools/apollo) control the sending side of this (see [sales engagement platform](/glossary/sales-engagement-platform)); the whole installable set is listed in [Claude skills for sales](/guides/sales/claude-skills-for-sales), and [Claude for sales teams](/guides/sales/claude-for-sales-teams) is where this fits in the wider workflow. For the writing itself, [email-sequence-drafter](/skills/marketing/email-sequence-drafter) drafts the sequence this audit then checks.
