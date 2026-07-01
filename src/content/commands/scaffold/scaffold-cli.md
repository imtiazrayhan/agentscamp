---
description: "Scaffold a new subcommand for an existing CLI (or a minimal new CLI) in the project's language — flag/argument parsing, --help text, input validation, and correct exit codes — matching the framework and conventions already in use."
date: 2026-07-01
argument-hint: "<the command to add — e.g. 'a `sync` subcommand that pulls remote config'>"
allowed-tools: "Read, Write, Glob, Grep, Edit"
title: "Scaffold CLI Command"
color: "purple"
topics: ["coding-languages"]
related: ["new-component", "scaffold-github-action", "cli-tooling-engineer"]
featured: false
summary: "A slash command that adds a well-formed subcommand to a project's CLI: it detects the existing framework (Commander/oclif, argparse/Click/Typer, Cobra, clap) and entry point, then generates a command wired into the parser with typed argument and flag parsing, a --help description, validation that fails to stderr with a non-zero exit code, and stdout kept for real output."
---

Add a new subcommand to the project's existing CLI — parsed, validated, documented in `--help`, and returning correct exit codes — using the framework already in the codebase. Good CLI ergonomics are the point: errors to stderr, results to stdout, non-zero exit on failure.

## Scope

Interpret `$ARGUMENTS` as the command to add — its name and what it should do (e.g. *"a `sync` subcommand that pulls remote config and writes it locally, with a `--dry-run` flag"*).

If `$ARGUMENTS` is empty, ask what command to add and what it should do. Don't invent a command nobody requested.

> [!NOTE]
> Match the CLI framework and conventions already in use. Do not add a new argument-parsing library when the project already has one — a Commander project gets a Commander command, a Click project gets a Click command.

## Step 1 — Detect the CLI and its conventions

Find the entry point and how subcommands are registered:

```bash
rg -n "\"bin\"" package.json                     # JS/TS entry
rg -n "commander|yargs|oclif|clipanion" package.json
rg -n "argparse|click|typer|add_parser|@app\.command" -g "*.py"
rg -n "cobra\.Command|spf13/cobra|clap::" -g "*.go" -g "*.rs"
```

Read one existing subcommand to copy its structure: where files live, how the command attaches to the root parser, how flags and help are declared, and how the project reports errors and exits.

## Step 2 — Define the command surface

Before writing code, pin down the interface:

- **Name** and one-line description (for `--help`).
- **Positional arguments** — which are required, their types.
- **Flags/options** — long/short names, types, defaults, and which are booleans vs. value-taking. Include a `--json` option if the CLI has a machine-output convention.
- **Exit behavior** — what counts as success vs. each failure mode.

## Step 3 — Generate the command

Create the command file/handler and wire it into the parser the same way sibling commands are wired. Declare the arguments and flags through the framework (so `--help` and validation come for free) rather than reading `argv` by hand. Keep the business logic in a small, testable function separate from the parsing layer.

## Step 4 — Validate inputs and set exit codes

- Validate arguments early; on bad input, print a clear message to **stderr** and exit non-zero (conventionally `2` for usage errors).
- Reserve **stdout** for the command's real output so it stays pipe-friendly; respect `--json` if present.
- Return `0` on success and a non-zero code on failure. Don't print stack traces as the user-facing error.
- If the CLI honors `NO_COLOR`/TTY detection, follow the existing helper rather than hard-coding ANSI codes.

## Step 5 — Test and document

- If the CLI has a test pattern, add a test for the happy path and at least one error/exit-code path.
- Update `--help`/usage and the README or command list if the project maintains one.

## Step 6 — Verify

Run the command through its own surface:

```bash
<cli> <command> --help        # help text renders, flags listed
<cli> <command> <good args>   # success path, exit 0
<cli> <command> <bad args>    # error to stderr, non-zero exit
echo "exit: $?"
```

## Report

Summarize concisely:

- **Command** — name, arguments, and flags added.
- **Wiring** — the framework used and where the command registers into the parser.
- **Ergonomics** — exit codes, stderr-vs-stdout split, and any `--json`/color handling.
- **Tests/docs** — what was added or updated.
- **Verification** — the `--help`, success, and error invocations run and their exit codes.
