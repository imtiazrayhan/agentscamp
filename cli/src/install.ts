import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import type { Flags } from "./args";
import type { ManifestItem } from "./manifest";
import { readContentFile } from "./manifest";
import { CliError } from "./output";

export type Scope = "project" | "global";

/** Default install target when neither --global nor --project is passed. */
export const DEFAULT_SCOPE: Scope = "project";

export function resolveScope(flags: Flags): Scope {
  if (flags.global && flags.project) {
    throw new CliError("Pass either --global or --project, not both.");
  }
  if (flags.global) return "global";
  if (flags.project) return "project";
  return DEFAULT_SCOPE;
}

export function installRoot(scope: Scope): string {
  return scope === "global"
    ? path.join(homedir(), ".claude")
    : path.resolve(process.cwd(), ".claude");
}

export interface InstallResult {
  item: ManifestItem;
  dest: string;
  status: "written" | "exists" | "error";
  message?: string;
}

export function installItem(
  item: ManifestItem,
  opts: { scope: Scope; force: boolean },
): InstallResult {
  const dest = path.join(installRoot(opts.scope), ...item.installAs.split("/"));
  try {
    if (existsSync(dest) && !opts.force) return { item, dest, status: "exists" };
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, readContentFile(item));
    return { item, dest, status: "written" };
  } catch (e) {
    return {
      item,
      dest,
      status: "error",
      message: e instanceof Error ? e.message : String(e),
    };
  }
}
