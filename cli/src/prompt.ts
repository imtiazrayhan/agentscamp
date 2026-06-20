// Zero-dependency TTY prompts (single-select + grouped multi-select), built on
// raw-mode stdin so the package keeps its no-runtime-dependency guarantee.
//
// Invariants that keep the redraw correct:
//  - Every rendered row is truncated to the terminal width, so nothing wraps
//    (a wrapped row would desync the cursor-up math and corrupt the frame).
//  - The frame is a fixed number of logical lines per render; we move up that
//    many lines and clear-down before drawing the next one.
import { c } from "./output";

const out = process.stdout;

/** Both ends must be a TTY for raw-mode prompting to work. */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

type Key =
  | "up"
  | "down"
  | "left"
  | "right"
  | "enter"
  | "space"
  | "esc"
  | "ctrl-c"
  | "a"
  | "q"
  | "home"
  | "end"
  | "other";

function parseKey(s: string): Key {
  if (s === "\x03") return "ctrl-c";
  if (s === "\r" || s === "\n") return "enter";
  if (s === "\x1b[A") return "up";
  if (s === "\x1b[B") return "down";
  if (s === "\x1b[C") return "right";
  if (s === "\x1b[D") return "left";
  if (s === "\x1b[H" || s === "\x1b[1~") return "home";
  if (s === "\x1b[F" || s === "\x1b[4~") return "end";
  if (s === " ") return "space";
  if (s === "\x1b") return "esc";
  const l = s.toLowerCase();
  if (l === "k") return "up";
  if (l === "j") return "down";
  if (l === "a") return "a";
  if (l === "q") return "q";
  return "other";
}

const HIDE = "\x1b[?25l";
const SHOW = "\x1b[?25h";

function termWidth(): number {
  return Math.max(20, out.columns || 80);
}

/** Trim `s` to `max` visible chars, adding an ellipsis when cut. */
function clip(s: string, max: number): string {
  if (max <= 0) return "";
  if (s.length <= max) return s;
  if (max === 1) return "…";
  return s.slice(0, max - 1) + "…";
}

/**
 * Shared raw-mode driver: hides the cursor, streams keys to `onKey`, and
 * repaints whenever `onKey` returns "render". onKey returns "done" to finish.
 * Handles the fixed-frame redraw and always restores the terminal on exit.
 */
function run(
  frame: () => string,
  onKey: (key: Key) => "render" | "done" | "ignore",
): Promise<void> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    let lastHeight = 0;

    function moveToFrameTop(): void {
      if (lastHeight > 0) {
        out.write("\r");
        if (lastHeight > 1) out.write(`\x1b[${lastHeight - 1}A`);
        out.write("\x1b[J");
      }
    }

    function render(): void {
      const f = frame();
      moveToFrameTop();
      out.write(f);
      lastHeight = f.split("\n").length;
    }

    function cleanup(): void {
      stdin.removeListener("data", onData);
      if (stdin.isTTY) stdin.setRawMode(false);
      stdin.pause();
      moveToFrameTop(); // erase the interactive frame; caller prints a summary
      out.write(SHOW);
    }

    function onData(chunk: string): void {
      const key = parseKey(String(chunk));
      if (key === "ctrl-c") {
        cleanup();
        out.write(c.dim("Cancelled.") + "\n");
        process.exit(130);
      }
      const action = onKey(key);
      if (action === "done") {
        cleanup();
        resolve();
      } else if (action === "render") {
        render();
      }
    }

    out.write(HIDE);
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.on("data", onData);
    render();
  });
}

export interface Choice {
  label: string;
  hint?: string;
  value: string;
}

/** Arrow-key single-select. Resolves the chosen value, or null if cancelled. */
export async function selectOne(
  message: string,
  choices: Choice[],
): Promise<string | null> {
  let cursor = 0;
  let cancelled = false;
  const help = c.dim("(↑/↓ move · ⏎ select · esc cancel)");

  function frame(): string {
    const width = termWidth();
    const lines = [`${c.bold(message)}  ${help}`];
    for (let i = 0; i < choices.length; i++) {
      const ch = choices[i];
      const active = i === cursor;
      const ptr = active ? c.cyan("❯") : " ";
      const hintLen = ch.hint ? ch.hint.length + 2 : 0;
      const label = clip(ch.label, width - 2 - hintLen);
      const labelC = active ? c.cyan(label) : label;
      const hint = ch.hint ? "  " + c.dim(ch.hint) : "";
      lines.push(`${ptr} ${labelC}${hint}`);
    }
    return lines.join("\n");
  }

  await run(frame, (key) => {
    switch (key) {
      case "up":
        cursor = (cursor - 1 + choices.length) % choices.length;
        return "render";
      case "down":
        cursor = (cursor + 1) % choices.length;
        return "render";
      case "home":
        cursor = 0;
        return "render";
      case "end":
        cursor = choices.length - 1;
        return "render";
      case "enter":
        return "done";
      case "esc":
      case "q":
        cancelled = true;
        return "done";
      default:
        return "ignore";
    }
  });

  return cancelled ? null : choices[cursor].value;
}

export type MultiEntry =
  | { kind: "header"; label: string }
  | { kind: "item"; id: string; label: string; hint?: string };

/**
 * Grouped multi-select with a scrolling viewport. `header` entries are visual
 * separators (not selectable); navigation skips them. Resolves the selected
 * ids, or null if cancelled.
 */
export async function multiSelect(
  message: string,
  entries: MultiEntry[],
): Promise<string[] | null> {
  const itemPositions = entries
    .map((e, i) => (e.kind === "item" ? i : -1))
    .filter((i) => i >= 0);
  if (itemPositions.length === 0) return [];

  const selected = new Set<string>();
  let ci = 0; // index into itemPositions
  let top = 0; // first visible entry index
  let cancelled = false;

  const viewH = Math.min(entries.length, Math.max(4, (out.rows || 24) - 5));

  function cursorEntry(): number {
    return itemPositions[ci];
  }

  function clampWindow(): void {
    const cur = cursorEntry();
    if (cur < top) top = cur;
    else if (cur >= top + viewH) top = cur - viewH + 1;
    top = Math.max(0, Math.min(top, Math.max(0, entries.length - viewH)));
  }

  function rowFor(entry: MultiEntry, gi: number, width: number): string {
    if (entry.kind === "header") {
      return c.dim("  " + clip(entry.label, width - 2));
    }
    const active = gi === cursorEntry();
    const ptr = active ? c.cyan("❯") : " ";
    const box = selected.has(entry.id) ? c.green("◉") : c.dim("◯");
    const used = 4; // ptr + space + box + space
    const hintLen = entry.hint ? entry.hint.length + 2 : 0;
    const name = clip(entry.label, width - used - hintLen);
    const nameC = active ? c.cyan(name) : name;
    const room = width - used - name.length - 2;
    const hint = entry.hint && room > 4 ? "  " + c.dim(clip(entry.hint, room)) : "";
    return `${ptr} ${box} ${nameC}${hint}`;
  }

  function frame(): string {
    clampWindow();
    const width = termWidth();
    const lines: string[] = [
      `${c.bold(message)}  ${c.dim(`(${selected.size} selected)`)}`,
    ];
    lines.push(
      top > 0 ? c.dim(`  ↑ ${top} more above`) : "",
    );
    for (let row = 0; row < viewH; row++) {
      const gi = top + row;
      lines.push(gi < entries.length ? rowFor(entries[gi], gi, width) : "");
    }
    const below = entries.length - (top + viewH);
    lines.push(below > 0 ? c.dim(`  ↓ ${below} more below`) : "");
    lines.push(
      c.dim("space toggle · a all/none · ↑/↓ move · ⏎ confirm · esc cancel"),
    );
    return lines.join("\n");
  }

  function move(delta: number): void {
    ci = (ci + delta + itemPositions.length) % itemPositions.length;
  }

  await run(frame, (key) => {
    switch (key) {
      case "up":
        move(-1);
        return "render";
      case "down":
        move(1);
        return "render";
      case "home":
        ci = 0;
        return "render";
      case "end":
        ci = itemPositions.length - 1;
        return "render";
      case "space": {
        const e = entries[cursorEntry()];
        if (e.kind === "item") {
          if (selected.has(e.id)) selected.delete(e.id);
          else selected.add(e.id);
        }
        return "render";
      }
      case "a": {
        const allIds = itemPositions.map((p) => (entries[p] as { id: string }).id);
        if (selected.size === allIds.length) selected.clear();
        else for (const id of allIds) selected.add(id);
        return "render";
      }
      case "enter":
        return "done";
      case "esc":
      case "q":
        cancelled = true;
        return "done";
      default:
        return "ignore";
    }
  });

  if (cancelled) return null;
  // Preserve catalog order rather than click order.
  return itemPositions
    .map((p) => (entries[p] as { id: string }).id)
    .filter((id) => selected.has(id));
}
