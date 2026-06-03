"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CommandPalette } from "./CommandPalette";

/**
 * Owns the single global command-palette instance and its open state, plus the
 * site-wide ⌘K / Ctrl-K shortcut. Any client component can trigger the palette
 * via `useCommandPalette()` — that's the only search entry point (there is no
 * dedicated /search page). Mounted once in the root layout.
 */
const PaletteContext = createContext<{ open: () => void } | null>(null);

export function useCommandPalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within <SearchProvider>");
  }
  return ctx;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PaletteContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </PaletteContext.Provider>
  );
}
