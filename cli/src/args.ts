import { CliError } from "./output";

export interface Flags {
  global: boolean;
  project: boolean;
  force: boolean;
  help: boolean;
  version: boolean;
}

export interface Parsed {
  command?: string;
  positionals: string[];
  flags: Flags;
}

const FLAG_MAP: Record<string, keyof Flags> = {
  "-g": "global",
  "--global": "global",
  "--project": "project",
  "-f": "force",
  "--force": "force",
  "-h": "help",
  "--help": "help",
  "-v": "version",
  "--version": "version",
};

export function parseArgs(argv: string[]): Parsed {
  const flags: Flags = {
    global: false,
    project: false,
    force: false,
    help: false,
    version: false,
  };
  const positionals: string[] = [];
  let command: string | undefined;

  for (const arg of argv) {
    if (arg.startsWith("-")) {
      const key = FLAG_MAP[arg];
      if (!key) throw new CliError(`Unknown flag ${arg} (see --help)`);
      flags[key] = true;
    } else if (command === undefined) {
      command = arg;
    } else {
      positionals.push(arg);
    }
  }
  return { command, positionals, flags };
}
