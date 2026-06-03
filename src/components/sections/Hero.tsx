"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export interface BootLine {
  label: string;
  count: number;
}

const CMD = "agentscamp init";

export function Hero({ lines, total }: { lines: BootLine[]; total: number }) {
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setTyped(CMD);
      setRevealed(lines.length);
      setReady(true);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    CMD.split("").forEach((_, i) => {
      timers.push(setTimeout(() => setTyped(CMD.slice(0, i + 1)), 300 + i * 55));
    });
    const afterCmd = 300 + CMD.length * 55 + 280;
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), afterCmd + i * 240));
    });
    timers.push(
      setTimeout(() => setReady(true), afterCmd + lines.length * 240 + 200),
    );
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  const typing = typed.length < CMD.length;

  return (
    <section className="relative overflow-hidden rounded-md border border-border bg-card px-6 py-10 sm:px-10 sm:py-14">
      <div
        aria-hidden
        className="grid-pattern pointer-events-none absolute inset-0"
      />
      <div className="relative">
        {/* boot sequence */}
        <div className="font-mono text-sm leading-relaxed sm:text-base">
          <div className="text-muted-foreground">
            <span className="text-primary text-glow">~/agentscamp</span>
            <span className="mx-1.5">$</span>
            <span className="text-foreground">{typed}</span>
            {typing && <span className="cursor-blink text-primary">▍</span>}
          </div>
          <div className="mt-1.5 space-y-0.5">
            {lines.slice(0, revealed).map((l) => (
              <div
                key={l.label}
                className="flex max-w-xs justify-between text-muted-foreground"
              >
                <span>
                  <span className="text-primary">{">"}</span> loading {l.label}
                </span>
                <span className="text-primary">[ {l.count} ok ]</span>
              </div>
            ))}
            {ready && (
              <div className="text-foreground">
                <span className="text-primary">{">"}</span> ready{" "}
                <span className="cursor-blink text-primary">▍</span>
              </div>
            )}
          </div>
        </div>

        {/* headline — always full contrast (no fade) */}
        <div className="mt-9">
          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Stop wiring up AI by hand.
            <br />
            <span className="text-primary text-glow">Copy. Paste. Ship.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            A curated hub of agents, skills, guides, tools &amp; commands for
            building with AI coding agents — drop-in ready and format-validated.
          </p>
          <Link
            href="/search"
            className="mt-7 inline-flex w-full max-w-md items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/60"
          >
            <Search className="size-4" />
            <span className="text-primary">$</span>
            <span className="flex-1 text-left">search {total} resources</span>
            <kbd className="hidden rounded-sm border border-border bg-muted px-1.5 text-[11px] sm:inline">
              ⌘K
            </kbd>
          </Link>
        </div>
      </div>
    </section>
  );
}
