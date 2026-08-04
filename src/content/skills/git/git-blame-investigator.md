---
name: "git-blame-investigator"
title: "Git Blame Investigator"
description: "Reconstruct why a line of code exists from Git history — find the originating commit, read its message and full diff for intent, and see through reformatting/rename commits with ignore-revs and the pickaxe — before you change or delete it. Use when a line looks wrong or pointless and you want to remove it, when tracing a regression to its commit, or when onboarding to unfamiliar code."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["review-qa"]
related: ["skill:dead-code-finder", "skill:conventional-commits", "skill:onboarding-guide-writer"]
featured: false
summary: "git blame names a person, not a reason. This skill does code archaeology: it finds the real originating commit (past reformatting/rename noise via ignore-revs and the pickaxe), reads the message and diff for intent, traces regressions with log -L and bisect, and returns a verdict on whether the code is safe to change."
faq:
  - q: "Why does git blame point at a commit that just reformatted the file?"
    a: "blame attributes a line to the last commit that touched its text — a whitespace, Prettier, or rename commit counts. Use git blame --ignore-rev <sha> (or a .git-blame-ignore-revs file) and the pickaxe (-S/-G) to find the commit that introduced the logic, not the one that reindented it."
  - q: "How do I follow a line's history across a file rename or a big refactor?"
    a: "Use git log --follow <path> for renames, git blame -C -C -M to detect moved/copied lines from other files, and git log -L to track a specific line range even as it migrates within the file."
---

`git blame` tells you *who* last touched a line, which is almost never the question you actually have. The real question — "why is this here, and what breaks if I remove it?" — lives in the commit *message*, the surrounding diff, and the PR that shipped it. This skill does code archaeology: it walks from a suspicious line back to the commit that introduced the *logic* (not the one that reindented it), reads the intent, and returns a verdict on whether the code is a dead artifact or a Chesterton's fence guarding a bug you can't see.

## When to use this skill
- A line looks redundant, wrong, or pointless and you're about to delete or "simplify" it.
- You're tracing a regression and need the exact commit that changed the behavior.
- You're onboarding to unfamiliar code and need to reconstruct *why* it was written this way.
- A workaround, magic constant, or odd conditional has no comment explaining it.
- blame keeps pointing at a formatting, rename, or merge commit that obviously isn't the real author.

## Instructions
1. **Locate the line precisely, then blame with context.** Run `git blame -L <start>,<end> <path>` on the suspicious range (not the whole file) and note the commit SHA, not the author name. Add `-w` to ignore whitespace-only changes and `-C -C -M` to follow lines that were moved or copied in from other files — without these, blame stops at the refactor that relocated the code and you lose its true origin.
2. **Distrust the first SHA — it's usually noise.** If the blamed commit is a Prettier run, a lint autofix, a mass rename, or a "merge branch" commit, it did not author the logic. Re-blame ignoring it: `git blame --ignore-rev <sha> -L <start>,<end> <path>`. If the repo has recurring reformatting commits, list them in a `.git-blame-ignore-revs` file and set `git config blame.ignoreRevsFile .git-blame-ignore-revs` so every blame sees through them automatically.
3. **Read the intent, not just the patch.** Once you have the real commit, run `git show <sha>` to read the *full* commit message and the *entire* diff — not only the line you care about. Then find the PR with `git log --merges --ancestry-path <sha>..HEAD -- <path>` or `gh pr list --search <sha>` and read the PR description and review discussion. The "why" is in prose far more often than in code.
4. **Track the exact line or string through time with line-history and the pickaxe.** For a moving target use `git log -L <start>,<end>:<path>` to see every commit that changed that line range, in order, with diffs. To find when a specific string, identifier, or value *entered or left* the codebase, use the pickaxe: `git log -S '<exact-string>' -- <path>` (changes in the count of that string) or `git log -G '<regex>' -- <path>` (any diff line matching the regex). `-S` answers "when did this magic number / flag / call site appear or disappear?" in seconds.
5. **Follow the code across moves and renames.** A file rename or extraction silently truncates history. Use `git log --follow -- <path>` to span renames, and when logic was hoisted into a new file, use blame's `-C -C -C` (copy detection across the whole tree, even unmodified files) to find where it was lifted from. Confirm the trail is unbroken before drawing conclusions — a gap means the real origin is in a pre-rename path.
6. **Trace a regression to its commit, by bisection if needed.** First try `git log --oneline -- <path>` plus `git log -L` to spot an obvious culprit. If the offending change isn't obvious, run `git bisect`: `git bisect start`, `git bisect bad` (current), `git bisect good <known-good-sha>`, then test each checkout (script it with `git bisect run <test-cmd>` for an exact, automated answer). Bisect finds the precise breaking commit even across hundreds of revisions.
7. **Reconstruct the decision from the neighborhood.** Read the commits immediately before and after the originating one (`git log --oneline <sha>~3..<sha> -- <path>` plus the linked issue) to see what problem the change was solving. A line that looks pointless in isolation often makes sense as one half of a fix — the other half being the bug it prevents.
8. **Render a verdict tied to evidence.** Conclude with one of: *safe to remove* (origin found, the problem it solved no longer exists — cite the commit/issue), *do not touch* (it guards a known bug or invariant — cite the commit), or *needs a test first* (intent is plausible but unverified — name the behavior to lock down before changing). Never conclude "safe to remove" without having found and read the originating intent.

> [!WARNING]
> blame's first answer is almost always a formatting or rename commit that hides the real author. If you act on it without `--ignore-rev` and the pickaxe, you will attribute the code to the wrong change and reason about the wrong intent.

> [!WARNING]
> Deleting code whose original purpose you haven't found is the single most common way regressions get reintroduced. "I don't see why this is here" is a reason to investigate, never a license to remove.

## Output
A short investigation report containing: (1) the **originating commit(s)** — SHA, message, and the intent reconstructed from the diff and PR; (2) the **line/string history** — the ordered list of commits that introduced, moved, or altered the code (from `log -L` / `-S`), with the rename or refactor boundaries it crossed; and (3) a **verdict** — *safe to change/remove*, *do not touch*, or *needs a test first* — each justified by the cited commit or issue. All claims trace to a SHA the reader can re-run.