#!/usr/bin/env node
import { parseArgs, type Flags } from "./args";
import { installItem, resolveScope } from "./install";
import {
  loadManifest,
  packageVersion,
  type ItemType,
  type ManifestItem,
} from "./manifest";
import { c, CliError, printHelp } from "./output";
import { normalizeType, resolveRef } from "./resolve";
import { searchItems } from "./search";

const PLURAL: Record<ItemType, string> = {
  agent: "agents",
  skill: "skills",
  command: "commands",
};

function requireNode20(): void {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 20) {
    console.error(
      `agentscamp requires Node.js >= 20 (you are running ${process.versions.node}).`,
    );
    process.exit(1);
  }
}

function cmdAdd(refs: string[], flags: Flags): number {
  if (refs.length === 0) {
    throw new CliError("Nothing to add — usage: agentscamp add <type>/<slug> [...more]");
  }
  const scope = resolveScope(flags);
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

  let written = 0;
  let skipped = 0;
  let failed = 0;
  for (const r of resolutions) {
    if (r.kind !== "ok") continue;
    const result = installItem(r.item, { scope, force: flags.force });
    if (result.status === "written") {
      written++;
      console.log(c.green("✓ ") + `${r.item.id} ${c.dim("→")} ${result.dest}`);
    } else if (result.status === "exists") {
      skipped++;
      console.log(
        c.yellow("• ") +
          `${r.item.id} already installed at ${result.dest} ${c.dim("(use --force to overwrite)")}`,
      );
    } else {
      failed++;
      console.error(c.red("✗ ") + `${r.item.id}: ${result.message}`);
    }
  }
  const summary = [`${written} installed`];
  if (skipped) summary.push(`${skipped} already present`);
  if (failed) summary.push(`${failed} failed`);
  console.log(c.dim(summary.join(", ")));
  return failed > 0 ? 1 : 0;
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
  console.log(c.dim(`\nInstall with: npx agentscamp add <id>`));
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

function main(argv: string[]): number {
  requireNode20();
  const { command, positionals, flags } = parseArgs(argv);

  if (flags.version) {
    console.log(packageVersion());
    return 0;
  }
  if (flags.help || !command) {
    printHelp(packageVersion());
    return 0;
  }

  switch (command) {
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
        `Unknown command "${command}" — commands: add, list, search, info (see --help)`,
      );
  }
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (e) {
  if (e instanceof CliError) {
    console.error(c.red("✗ ") + e.message);
    process.exitCode = 1;
  } else {
    throw e;
  }
}
