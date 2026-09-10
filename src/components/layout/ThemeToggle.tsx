"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

/**
 * Three-state cycle: system -> light -> dark -> system.
 *
 * Reads `theme`, not `resolvedTheme` — `resolvedTheme` collapses to light/dark
 * and so cannot represent "follow the OS", which is now the default.
 */
const ORDER = ["system", "light", "dark"] as const;
const LABEL = { system: "system", light: "light", dark: "dark" } as const;
const ICON = { system: Monitor, light: Sun, dark: Moon };

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted && theme && theme in LABEL ? theme : "system") as
    | "system"
    | "light"
    | "dark";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = ICON[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABEL[current]}. Switch to ${LABEL[next]}.`}
      title={`Theme: ${LABEL[current]}`}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <Icon className="size-4" />
    </button>
  );
}
