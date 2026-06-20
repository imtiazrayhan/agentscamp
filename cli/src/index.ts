#!/usr/bin/env node
import { homedir } from "node:os";
import { parseArgs, type Flags } from "./args";
import { installItem, installRoot, resolveScope, type Scope } from "./install";
import {
  loadManifest,
  packageVersion,
  type ItemType,
  type ManifestItem,
} from "./manifest";
import { c, CliError, printHelp } from "./output";
import {
  isInteractive,
  multiSelect,
  selectOne,
  type MultiEntry,
} from "./prompt";
import { normalizeType, resolveRef } from "./resolve";
import { searchItems } from "./search";

const PLURAL: Record<ItemType, string> = {
  agent: "agents",
  skill: "skills",
  command: "commands",
};

const SINGULAR: Record<ItemType, string> = {
  agent: "agent",
  skill: "skill",
  command: "command",
};

const TYPE_ORDER: ItemType[] = ["agent", "skill", "command"];

function requireNode20(): void {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) {
    console.error(
      `agentscamp requires Node.js >= 20 (you are running ${process.versions.node}).`,
    );
    process.exit(1);
  }
}

/** Render an absolute path with the home dir collapsed to ~ for readability. */
function tilde(p: string): string {
  const home = homedir();
  return p === home || p.startsWith(home + "/") ? "~" + p.slice(home.length) : p;
}

/**
 * Install a batch and report. `verbose` prints a line per item (good for the
 * handful that `add` installs); the compact mode prints a per-type tally (good
 * for bulk installs of dozens of items). Errors are always shown individually.
 */
function installItems(
  items: ManifestItem[],
  scope: Scope,
  force: boolean,
  opts: { verbose: boolean },
): number {
  if (items.length === 0) {
    console.log(c.dim("Nothing to install."));
    return 0;
  }
  const root = installRoot(scope);
  if (!opts.verbose) {
    console.log(
      c.dim(`Installing ${items.length} items into ${tilde(root)} …`),
    );
  }

  let written = 0;
  let skipped = 0;
  let failed = 0;
  const writtenByType: Record<ItemType, number> = { agent: 0, skill: 0, command: 0 };

  for (const item of items) {
    const result = installItem(item, { scope, force });
    if (result.status === "written") {
      written++;
      writtenByType[item.type]++;
      if (opts.verbose) {
        console.log(c.green("✓ ") + `${item.id} ${c.dim("→")} ${result.dest}`);
      }
    } else if (result.status === "exists") {
      skipped++;
      if (opts.verbose) {
        console.log(
          c.yellow("• ") +
            `${item.id} already installed at ${result.dest} ${c.dim("(use --force to overwrite)")}`,
        );
      }
    } else {
      failed++;
      console.error(c.red("✗ ") + `${item.id}: ${result.message}`);
    }
  }

  if (!opts.verbose && written > 0) {
    const parts = TYPE_ORDER.filter((t) => writtenByType[t] > 0).map(
      (t) => `${writtenByType[t]} ${writtenByType[t] === 1 ? SINGULAR[t] : PLURAL[t]}`,
    );
    console.log(c.green("✓ ") + `${parts.join(", ")} installed`);
  }

  const summary = [`${written} installed`];
  if (skipped) summary.push(`${skipped} already present`);
  if (failed) summary.push(`${failed} failed`);
  console.log(c.dim(`${summary.join(", ")} · ${tilde(root)}`));
  return failed > 0 ? 1 : 0;
}

function cmdAdd(refs: string[], flags: Flags): number {
  if (refs.length === 0) {
    throw new CliError(
      "Nothing to add — usage: agentscamp add <type>/<slug> [...more] (or: agentscamp install)",
    );
  }
  const scope = resolveScope(flags, "project");
  const { items } = loadManifest();

  // Resolve every ref before installing anything, so one typo doesn't
  // half-install a batch.
  const resolutions = refs.map((ref) => resolveRef(ref, items));
  let resolutionFailed = false;
  for (const r of resolutions) {
    if (r.kind === "ok") continue;
    resolutionFailed = true;
    if (r.kind === "bad-type") {
      console.error(
        c.red("✗ ") + `"${r.ref}": unknown type "${r.typeSeg}" — use agents/, skills/ or commands/`,
      );
    } else if (r.kind === "ambiguous") {
      console.error(c.red("✗ ") + `"${r.ref}" matches multiple items — be specific:`);
      for (const cand of r.candidates) console.error(`    ${cand.id}`);
    } else {
      console.error(c.red("✗ ") + `"${r.ref}" not found — try: npx agentscamp search ${r.ref}`);
    }
  }
  if (resolutionFailed) return 1;

  const chosen = resolutions.flatMap((r) => (r.kind === "ok" ? [r.item] : []));
  return installItems(chosen, scope, flags.force, { verbose: true });
}

/** Build the grouped entry list (type headers + items) for the picker. */
function pickerEntries(items: ManifestItem[]): MultiEntry[] {
  const entries: MultiEntry[] = [];
  for (const t of TYPE_ORDER) {
    const list = items.filter((i) => i.type === t);
    if (list.length === 0) continue;
    entries.push({ kind: "header", label: `${PLURAL[t]} (${list.length})` });
    for (const i of list) {
      entries.push({ kind: "item", id: i.id, label: i.id, hint: i.title });
    }
  }
  return entries;
}

async function interactiveInstall(
  items: ManifestItem[],
  scope: Scope,
  force: boolean,
): Promise<number> {
  const count = (t: ItemType) => items.filter((i) => i.type === t).length;
  const choice = await selectOne("What do you want to install?", [
    { value: "all", label: "Everything", hint: `${items.length} items` },
    { value: "agent", label: "Agents only", hint: String(count("agent")) },
    { value: "skill", label: "Skills only", hint: String(count("skill")) },
    { value: "command", label: "Commands only", hint: String(count("command")) },
    { value: "pick", label: "Pick individual items…" },
    { value: "cancel", label: "Cancel" },
  ]);

  if (choice === null || choice === "cancel") {
    console.log(c.dim("Nothing installed."));
    return 0;
  }

  let chosen: ManifestItem[];
  if (choice === "all") {
    chosen = items;
  } else if (choice === "pick") {
    const ids = await multiSelect("Select items to install", pickerEntries(items));
    if (ids === null) {
      console.log(c.dim("Nothing installed."));
      return 0;
    }
    if (ids.length === 0) {
      console.log(c.dim("No items selected — nothing installed."));
      return 0;
    }
    const idSet = new Set(ids);
    chosen = items.filter((i) => idSet.has(i.id));
  } else {
    chosen = items.filter((i) => i.type === choice);
  }

  return installItems(chosen, scope, force, { verbose: chosen.length <= 12 });
}

function cmdInstall(positionals: string[], flags: Flags): number | Promise<number> {
  const scope = resolveScope(flags, "global");
  const { items } = loadManifest();

  if (flags.all) {
    return installItems(items, scope, flags.force, { verbose: false });
  }

  if (positionals.length > 0) {
    const types: ItemType[] = [];
    for (const p of positionals) {
      const t = normalizeType(p.toLowerCase());
      if (!t) {
        throw new CliError(
          `"${p}" is not a type — use agents, skills or commands ` +
            `(to install one item: agentscamp add ${p})`,
        );
      }
      if (!types.includes(t)) types.push(t);
    }
    const chosen = items.filter((i) => types.includes(i.type));
    return installItems(chosen, scope, flags.force, { verbose: false });
  }

  if (isInteractive()) {
    return interactiveInstall(items, scope, flags.force);
  }

  throw new CliError(
    "install needs a target in a non-interactive shell — " +
      "try: agentscamp install --all (or: agents | skills | commands)",
  );
}

function cmdList(typeArg: string | undefined): number {
  const { items } = loadManifest();
  let types: ItemType[];
  if (typeArg) {
    const t = normalizeType(typeArg.toLowerCase());
    if (!t) throw new CliError(`Unknown type "${typeArg}" — use agents, skills or commands`);
    types = [t];
  } else {
    types = ["agent", "skill", "command"];
  }

  for (const t of types) {
    const list = items.filter((i) => i.type === t);
    console.log(`\n${c.bold(PLURAL[t])} ${c.dim(`(${list.length})`)}`);
    const pad = list.length ? Math.max(...list.map((i) => i.id.length)) + 2 : 0;
    const byCategory = new Map<string, ManifestItem[]>();
    for (const i of list) {
      const members = byCategory.get(i.category) ?? [];
      members.push(i);
      byCategory.set(i.category, members);
    }
    for (const [category, members] of [...byCategory.entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      console.log(`  ${c.cyan(category)}`);
      for (const i of members) {
        console.log(`    ${i.id.padEnd(pad)}${c.dim(i.title)}`);
      }
    }
  }
  console.log(c.dim(`\nInstall everything: npx agentscamp --all   ·   one item: npx agentscamp add <id>`));
  return 0;
}

function cmdSearch(query: string): number {
  if (!query.trim()) throw new CliError("Usage: agentscamp search <query>");
  const { items } = loadManifest();
  const hits = searchItems(query, items);
  if (hits.length === 0) {
    console.log(`No matches for "${query}" — browse everything at https://agentscamp.com`);
    return 1;
  }
  const pad = Math.max(...hits.map((i) => i.id.length)) + 2;
  for (const hit of hits) {
    const desc =
      hit.description.length > 80 ? `${hit.description.slice(0, 77)}...` : hit.description;
    console.log(`${hit.id.padEnd(pad)}${c.dim(desc)}`);
  }
  console.log(
    c.dim(`\n${hits.length} result${hits.length === 1 ? "" : "s"} — install with: npx agentscamp add <id>`),
  );
  return 0;
}

function cmdInfo(ref: string | undefined): number {
  if (!ref) throw new CliError("Usage: agentscamp info <type>/<slug>");
  const { items } = loadManifest();
  const res = resolveRef(ref, items);
  if (res.kind === "bad-type") {
    throw new CliError(`Unknown type "${res.typeSeg}" — use agents/, skills/ or commands/`);
  }
  if (res.kind === "ambiguous") {
    throw new CliError(
      `"${ref}" matches multiple items: ${res.candidates.map((i) => i.id).join(", ")}`,
    );
  }
  if (res.kind === "not-found") {
    throw new CliError(`"${ref}" not found — try: npx agentscamp search ${ref}`);
  }
  const item = res.item;
  console.log(`\n${c.bold(item.title)} ${c.dim(`(${item.id})`)}`);
  console.log(
    c.dim(`${item.type} · ${item.category}${item.model ? ` · model: ${item.model}` : ""}`),
  );
  console.log(`\n${item.description}\n`);
  if (item.topics.length) console.log(`${c.bold("topics")}   ${item.topics.join(", ")}`);
  console.log(`${c.bold("project")}  ./.claude/${item.installAs}`);
  console.log(`${c.bold("global")}   ~/.claude/${item.installAs}`);
  console.log(`${c.bold("web")}      ${c.cyan(item.url)}`);
  console.log(`\nInstall: ${c.cyan(`npx agentscamp add ${item.id}`)}\n`);
  return 0;
}

async function main(argv: string[]): Promise<number> {
  requireNode20();
  const { command, positionals, flags } = parseArgs(argv);

  if (flags.version) {
    console.log(packageVersion());
    return 0;
  }
  if (flags.help) {
    printHelp(packageVersion());
    return 0;
  }

  // No subcommand = the front door. `--all` installs the whole catalog; an
  // interactive terminal gets the picker; anything else (pipes, CI) sees help.
  if (!command) {
    if (flags.all || isInteractive()) return cmdInstall([], flags);
    printHelp(packageVersion());
    return 0;
  }

  switch (command) {
    case "install":
    case "i":
      return cmdInstall(positionals, flags);
    case "add":
      return cmdAdd(positionals, flags);
    case "list":
      return cmdList(positionals[0]);
    case "search":
      return cmdSearch(positionals.join(" "));
    case "info":
      return cmdInfo(positionals[0]);
    default:
      throw new CliError(
        `Unknown command "${command}" — commands: install, add, list, search, info (see --help)`,
      );
  }
}

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((e) => {
    if (e instanceof CliError) {
      console.error(c.red("✗ ") + e.message);
      process.exitCode = 1;
    } else {
      throw e;
    }
  });
