---
title: "Claude for Data Analysis: The Complete 2026 Guide"
description: "The four surfaces where Claude touches data, what the code execution sandbox really is, how an AI analysis fails silently, and the checks that catch it."
author: "Imtiaz Rayhan"
date: 2026-09-10
updated: 2026-09-10
depth: cornerstone
color: "green"
topics: ["ai-at-work", "data-ml", "coding-languages"]
audience: ["analysts"]
tags: ["claude", "data-analysis", "code-execution", "excel", "sql", "analytics", "claude-code", "cowork"]
featured: true
seoTitle: "Claude for Data Analysis: The Complete 2026 Guide"
seoDescription: "Claude for data analysis in 2026: chat, Excel, Claude Code, or Cowork, what the code execution sandbox is, its limits, failure modes, and how to verify results."
keywords: ["claude for data analysis", "claude code execution", "ai data analysis", "claude for excel analysis", "claude data analyst"]
summary: "Claude runs code on your data in a sandboxed container, and that capability shows up in four products with four shapes: chat for a one-off CSV, Claude for Excel for a workbook, Claude Code for analysis that repeats, and Cowork for scheduled reporting. Which to open, what the sandbox can and cannot do, how an analysis fails, and how to check it."
keyTakeaways:
  - "Pick the surface by what the output has to be: an answer (chat), an edited workbook (Excel), a script you can rerun (Claude Code), or a report on a schedule (Cowork)."
  - "Code execution is available on every Claude plan and runs in an isolated container; the file limit is 30 MB per file for uploads and downloads."
  - "Network access inside the sandbox is on by default for Free, Pro, and Max, and off by default for Team and Enterprise, where admins can whitelist domains."
  - "The dangerous failures are silent: a filter that dropped rows nobody counted, a join that fanned out, a number restated in prose after the code ran."
  - "Verify by re-deriving one number by hand, asking for row counts at every step, and reading the code rather than the summary paragraph."
  - "Claude for Excel is generally available on Pro, Max, Team, and Enterprise, and Anthropic does not recommend it for audit-critical calculations without verification."
sources:
  - title: "Create and edit files with Claude"
    url: "https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude"
    publisher: "Anthropic"
  - title: "Code execution tool"
    url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool"
    publisher: "Anthropic"
  - title: "Use Claude for Excel"
    url: "https://claude.com/docs/office-agents/excel"
    publisher: "Anthropic"
  - title: "Claude Code overview"
    url: "https://code.claude.com/docs/en/overview"
    publisher: "Anthropic"
  - title: "Get started with Claude Cowork"
    url: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork"
    publisher: "Anthropic"
  - title: "Data plugin (anthropics/knowledge-work-plugins)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/data"
    publisher: "Anthropic"
  - title: "Anthropic Economic Index report: Cadences"
    url: "https://www.anthropic.com/research/economic-index-june-2026-report"
    publisher: "Anthropic"
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
faq:
  - q: "Can Claude actually analyze data, or does it just describe it?"
    a: "It runs code. Claude writes Python, executes it in an isolated container, and reports what came back. That is the difference between a model guessing at a mean and a model computing one. The risk moves from arithmetic to method: the code runs correctly on the wrong filter, the wrong join, or a column it silently coerced to text."
  - q: "How large a file can I upload for analysis?"
    a: "Anthropic's help center gives a maximum of 30 MB per file for both uploads and downloads in the code execution environment. PDFs larger than that can be processed through the computing environment without loading them into the context window. For anything bigger, or for data that lives in a warehouse, use Claude Code against a local file or a database connection instead of uploading."
  - q: "Does the analysis sandbox have internet access?"
    a: "It depends on the surface and the plan. In the claude.ai code execution environment, network access is enabled by default on Free, Pro, and Max, and disabled by default on Team and Enterprise, where an admin chooses between no network, package managers only, package managers plus whitelisted domains, or all domains. The API's code execution container has internet access completely disabled, so only its pre-installed libraries are available."
  - q: "Should an analyst use Claude Code or just the chat window?"
    a: "Chat when you want an answer once. Claude Code when the same question will be asked again, when the data is too large or too sensitive to upload, or when the output should be a query and a script that a colleague can read. Claude Code leaves the work behind; chat leaves a conversation behind."
  - q: "Is Claude for Excel safe for client deliverables?"
    a: "Anthropic's own documentation says it is not recommended for final client deliverables without human review, for audit-critical calculations without verification, or for models containing highly sensitive or regulated data without proper controls. Treat its edits the way you would treat a junior analyst's: useful, fast, and checked before they leave the building."
related: ["guide:claude-for-excel-guide", "guide:claude-code-for-data-analysts", "guide:check-an-ai-data-analysis", "guide:text-to-sql-with-claude", "guide:claude-skills-for-data-analysts", "guide:which-claude-plan-for-data-analysts", "tool:claude-for-excel", "tool:claude-code"]
---

Claude can run code on your data. That one capability, a sandboxed Python environment attached to a chat window, is what separates a model that describes a dataset from a tool that computes over one, and it shows up in four Anthropic products with four different shapes. This guide is the mechanics from a developer's side of the desk: which surface to open for which job, what the sandbox can and cannot do, the ways an analysis fails quietly, and the habits that catch it before a number reaches a slide.

## The four surfaces, and when each one wins

One subscription, four places Claude will touch your data. The choice is not about capability, because all four run code. It is about what has to exist when you are done.

| The job | Open | What you get back |
|---|---|---|
| One CSV, one question, an answer today | [claude.ai](/tools/claude) chat | An answer plus the code that produced it |
| A workbook or financial model you have to change | [Claude for Excel](/tools/claude-for-excel) | Edits in place, with cell-level citations |
| An analysis that will be asked for again | [Claude Code](/tools/claude-code) | A script, a query, and a git history |
| A recurring report over a folder or connected apps | [Claude Cowork](/tools/claude-cowork) | A finished document, on a schedule |

Those surfaces get used differently in practice, not just in theory. Anthropic's Economic Index report *Cadences*, published June 26, 2026 on usage between April 10 and June 10, 2026, found that data and spreadsheet conversations ran at higher autonomy in chat and Cowork (3.09 on a 1 to 5 scale) than in Claude Code (2.74), and that the chat side leaned toward financial modeling and dashboard design while Claude Code leaned toward structured extraction and tagging against precise specifications. People delegate more when the task is exploratory and specify more when the output has to be exact. That is a reasonable instinct to keep.

If you want the shortest possible version of this decision: does anyone need to run this again? If yes, it belongs in Claude Code or Cowork. If no, chat or Excel is faster.

## What the analysis tool actually is

When Claude "analyzes" an upload, it is writing code and executing it in an isolated container, then reading the output back. Anthropic's help center calls the feature code execution and file creation, and says it "is available to all Claude users (Free, Pro, Max, Team, and Enterprise) on the web, Claude Desktop, and Claude Mobile." It is enabled by default on every plan, with the toggle at Settings then Capabilities on Free, Pro, and Max, and at Organization settings then Capabilities on Team and Enterprise, where an owner can disable it. The name for the general pattern is [code execution](/glossary/code-execution), and the product category that has grown around it is the [AI data analyst](/glossary/ai-data-analyst).

Four properties matter to your work:

- **The file ceiling is 30 MB.** Anthropic's documentation states "the maximum file size is 30MB per file for both uploads and downloads." PDFs over that limit can still be processed through the computing environment without being loaded into the context window.
- **The container is isolated and per-user.** Sandboxes are never shared between users, and tasks have duration limits so a runaway loop cannot run forever.
- **Network access is a setting, not a guarantee.** In the claude.ai environment it is enabled by default for Free, Pro, and Max and disabled by default for Team and Enterprise, where an admin picks between no network, package managers only, package managers plus whitelisted domains, or all domains.
- **The published container spec is generous.** For the API version of the tool, Anthropic documents Python 3.11 on Linux, 5 GiB of RAM, 5 GiB of workspace storage, one CPU, and no internet access at all, with pandas, numpy, scipy, scikit-learn, statsmodels, matplotlib, seaborn, pyarrow, and openpyxl pre-installed, plus command-line sqlite and ripgrep. That is a real analysis environment, not a toy.

Two smaller facts save time later. File creation uses more of your usage allowance than plain chat, and it can eat into the conversation's context window, so a long session over many files degrades. And on Free, Pro, and Max, conversations containing code execution artifacts cannot be publicly shared, which rules out "just send them the chat link" as a delivery method.

## Surface 1: chat, for the one-off CSV

Upload the file, then constrain the first prompt. The failure mode of an open-ended "analyze this" is a tidy summary of the wrong thing. Ask for the shape of the data before you ask for a conclusion:

```text
Load this CSV. Before any analysis, report: row count, column names with
dtypes, null counts per column, and the number of distinct values in every
column with fewer than 50 distinct values. Show me the code you ran and the
raw output. Do not summarize or interpret yet.
```

That first pass is a habit worth automating. The [dataset-first-look](/skills/analytics/dataset-first-look) skill does exactly this as a repeatable procedure, and [/first-look](/commands/analytics/first-look) is the Claude Code slash command version. Once you know the shape, ask one question at a time and read the code before the prose. When it is time to pick a chart, [chart-chooser](/skills/analytics/chart-chooser) forces the choice to follow the data type rather than the aesthetic. Talking to your data this way is what vendors now market as [conversational analytics](/glossary/conversational-analytics), and the honest version of it is exactly this loop: constrain, execute, read the code.

## Surface 2: Claude for Excel, for the workbook you inherited

Claude for Excel is an add-in, generally available to Pro, Max, Team, and Enterprise plans, that puts Claude in a sidebar inside the workbook. Its distinguishing feature for an analyst is citations: ask how a number was derived and the answer cites specific cells you can click to navigate to. It updates values while keeping formula relationships intact, traces `#REF!` and `#DIV/0` errors to a root cause, populates templates, and performs native operations like sorting, filtering, and pivot tables.

It also has hard edges. Data tables and macros or VBA are unsupported. It does not run on Excel 2016 or 2019 perpetual licenses, on iPad, or on Android. Anthropic warns that it is not recommended for final client deliverables without human review or for audit-critical calculations without verification. The install steps, the exact supported builds, the overwrite behavior, and the review discipline to apply before anything ships are in [Claude for Excel: What It Does, Where It Fails, How to Use It](/guides/analytics/claude-for-excel-guide). The auditing counterpart for formulas you did not write is [spreadsheet-formula-auditor](/skills/analytics/spreadsheet-formula-auditor).

## Surface 3: Claude Code, for analysis that repeats

Anthropic describes [Claude Code](/tools/claude-code) as "an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools." Point it at a folder of data instead of a repo and the description still holds. Three things change compared to chat: the data never leaves your machine unless you send it somewhere, there is no 30 MB ceiling because nothing is uploaded, and the artifact is a file. The notebook, the query, and the transformation script stay in the folder, so next quarter is one command rather than one conversation.

This is also where warehouse work happens. Claude Code reaches a database through MCP servers, either a Postgres server like [Postgres MCP Pro](/tools/postgres-mcp) or your warehouse vendor's own. Getting from a question to correct SQL is its own discipline, covered in [Text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude); the term itself is [text-to-SQL](/glossary/text-to-sql), and the reason production systems get it right more often than a raw model does is usually a [semantic layer](/glossary/semantic-layer) that pins down what "active customer" means before the model guesses. Writing those definitions down is what [/define-metric](/commands/analytics/define-metric) is for, and [sql-explainer](/skills/analytics/sql-explainer) reads a query somebody else wrote and tells you what it actually returns. The setup, the CLAUDE.md for a data folder, and five workflows are in [Claude Code for Data Analysts](/guides/analytics/claude-code-for-data-analysts).

Anthropic also ships an open-source data plugin in its `knowledge-work-plugins` repository. As of September 2026 the folder holds ten skills (`analyze`, `explore-data`, `write-query`, `create-viz`, `build-dashboard`, `validate-data`, `sql-queries`, `data-visualization`, `statistical-analysis`, `data-context-extractor`) and no commands directory, though its README still describes six commands and six skills. Its `.mcp.json` names connectors for warehouses, BI tools, and notebooks. What each piece does and where it overlaps with your own skills is in [Anthropic's Data Plugin: A Guide](/guides/analytics/claude-data-plugin-guide).

## Surface 4: Cowork, for the report nobody wants to run

[Cowork](/tools/claude-cowork) is the agent mode of the Claude app for work that is not code. You point it at a folder, it reads and writes files there, and it can run on a schedule. Anthropic's help center is explicit that "scheduled tasks run in the cloud, so they don't need your computer to be awake or the desktop app open," and you set one up by typing `/schedule` in a session. For an analyst that maps to one specific job: the recurring report assembled from a folder of exports plus a few connected apps. Pair it with [analysis-memo-writer](/skills/analytics/analysis-memo-writer) so the output is a memo with a stated method and stated caveats rather than a wall of charts.

## How an AI analysis fails

None of the failures below look like errors. They look like answers.

**Silent filtering.** A `dropna()`, a date parse that failed on 3% of rows, a merge that quietly discarded unmatched keys. The number is computed correctly on a population you did not authorize.

**Numbers restated in prose.** The code returns 41,882. The summary paragraph says "roughly 42,000 customers, up 8% year over year," and the 8% was never computed. This is ordinary [hallucination](/glossary/hallucination) wearing an analyst's clothes, and it is why the code block matters more than the paragraph under it.

**Wrong joins.** A one-to-many join that fans out and doubles your revenue total is the single most expensive mistake in this list, and the totals often still look plausible.

**Sampling and dtype assumptions.** `head(1000)` used for speed and never widened. An ID column read as a float, losing leading zeros. A currency column parsed as text so the sum silently concatenated.

**Chart choices that flatter.** A truncated axis, a pie chart of eleven categories, a dual axis implying a correlation nobody tested.

For a second pass on any of these, [analysis-reviewer](/agents/analytics/analysis-reviewer) is a subagent whose whole job is to read an analysis and report what was assumed rather than shown.

## The verification habits that catch it

Four habits cover most of the risk, and none of them require you to trust the model.

1. **Demand row counts at every step.** Ask for the count before and after each filter, merge, and dedupe, printed by the code, not asserted in prose. A join that changes your row count unexpectedly is the tell.
2. **Re-derive one number by hand.** Pick a single cell of the result and compute it yourself from the raw data. If it matches, the pipeline is probably sound. If it does not, stop.
3. **Read the code, not the summary.** Every claim in the prose should map to a line you can see. Anything that does not was generated, not computed.
4. **Make it state its assumptions.** "List every assumption you made about this data, including anything you dropped, coerced, or inferred" catches more than any other single prompt.

The long-form checklist, including what to ask before you send an analysis to anyone else, is [How to Check an AI Data Analysis](/guides/analytics/check-an-ai-data-analysis). Run it before the memo, not after the meeting.

## Privacy: what actually leaves your machine

Chat and Cowork upload your data to Anthropic's servers to run it. Claude Code reads local files locally, but anything it sends into a prompt goes to the API, and any MCP server you connect sees whatever it is asked to query. Claude for Excel is the interesting middle case: inputs and outputs are deleted on the backend within 30 days, chat history is stored locally in your browser via IndexedDB rather than on Anthropic's servers, and the add-in does not inherit an organization's custom retention settings, nor does its activity appear in Enterprise audit logs.

There is a second exposure that analysts underrate. A spreadsheet or CSV from outside your company is untrusted input, and Anthropic warns that files from external sources "can contain hidden instructions that manipulate the add-in into extracting data, modifying records, or performing destructive actions." That is [prompt injection](/glossary/prompt-injection) delivered through a vendor file. Treat downloaded templates and client data dumps as hostile until reviewed. The full treatment of what to send, what to keep local, and how to reason about retention is in [Data Privacy for LLM Apps](/guides/ai-safety/data-privacy-for-llm-apps).

## Where Claude sits next to the analytics tools

Claude is a general model with a code sandbox, not a BI product, and several tools compete on being purpose-built. [Julius](/tools/julius) wraps the same upload-and-analyze loop in an analyst-shaped interface. [Hex](/tools/hex) and [Deepnote](/tools/deepnote) are notebooks with AI built into the cell. [Databricks Genie](/tools/databricks-genie) and [ThoughtSpot Spotter](/tools/thoughtspot-spotter) sit on a governed semantic model so business users can ask questions without writing SQL. [PandasAI](/tools/pandasai) and [Vanna](/tools/vanna) are open-source libraries for putting natural language in front of a dataframe or a warehouse in your own application.

The trade is governance versus generality. A tool built on your semantic layer will answer "what was churn last month" more reliably than a chat window will. A chat window will do the odd one-off nobody modeled. Most analysts end up with both. The full field is ranked in [Best AI Tools for Data Analysts (2026)](/guides/comparisons/best-ai-tools-for-data-analysts-2026), the query layer specifically in [Best Text-to-SQL Tools (2026)](/guides/comparisons/best-text-to-sql-tools-2026), and the head-to-head most people actually want is [ChatGPT vs Claude for Data Analysis](/guides/comparisons/chatgpt-vs-claude-for-data-analysis).

## Plans, models, and context

Code execution is on every plan including Free, which means you can test the whole workflow before paying. Claude for Excel needs Pro, Max, Team, or Enterprise. Claude Code and Cowork need a paid plan. Beyond that the tiers buy usage, not features, and usage is one shared pool across chat, Claude Code, Cowork, and the Office add-ins. Context matters more for analysts than for most roles, because a wide schema plus a long session plus generated files fills a window quickly. Which tier fits occasional CSV work versus daily modeling versus a warehouse workflow is in [Which Claude Plan (and Model) Should a Data Analyst Pay For?](/guides/analytics/which-claude-plan-for-data-analysts), and the current prices live on [Claude plans compared (2026)](/guides/getting-started/claude-plans-compared-2026).

## Where to start this week

Take the analysis you ran last month and run it again in the surface that matches its shape. If it was a one-off, do it in chat with the constrained first prompt above. If it repeats, do it in Claude Code and keep the script. Then install the five skills from [Claude Skills for Data Analysts](/guides/analytics/claude-skills-for-data-analysts), starting with the first-look one, because every other workflow gets safer once the shape of the data is established before the conclusion is. Everything on this site for your role is collected at the [analysts hub](/for/analysts).
