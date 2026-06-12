const useColor =
  process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== "dumb";

function paint(code: number): (s: string) => string {
  return (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
}

export const c = {
  bold: paint(1),
  dim: paint(2),
  red: paint(31),
  green: paint(32),
  yellow: paint(33),
  cyan: paint(36),
};

/** Expected user-facing failure: printed as a clean one-liner, no stack trace. */
export class CliError extends Error {}

export function printHelp(version: string): void {
  console.log(
    `
${c.bold("agentscamp")} v${version} — install AgentsCamp agents, skills & slash commands into Claude Code

${c.bold("Usage")}
  npx agentscamp <command> [args] [flags]

${c.bold("Commands")}
  add <id...>       Install one or more items (e.g. agents/prompt-engineer)
  list [type]       List everything, or one type (agents | skills | commands)
  search <query>    Search by name, title, topic, or description
  info <id>         Show details and install paths for an item

${c.bold("Flags")}
  -g, --global      Install to ~/.claude/ (default: ./.claude/ in the current project)
      --project     Install to ./.claude/ explicitly
  -f, --force       Overwrite existing files
  -h, --help        Show this help
  -v, --version     Show version

${c.bold("Examples")}
  npx agentscamp add agents/prompt-engineer
  npx agentscamp add skills/dependency-audit commands/plan-feature -g
  npx agentscamp search "code review"

Browse everything with full docs at ${c.cyan("https://agentscamp.com")}
`.trim() + "\n",
  );
}
