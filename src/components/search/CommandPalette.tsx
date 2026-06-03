"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { CornerDownLeft } from "lucide-react";
import { useSearch } from "./useSearch";
import { contentTypeList } from "@/lib/content/registry";
import type { SearchRecord } from "@/lib/content/types";

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] leading-none text-muted-foreground">
        {keys}
      </kbd>
      <span>{label}</span>
    </span>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { ready, search } = useSearch(open);
  const results = search(query);

  function go(href: string) {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  const byType = contentTypeList
    .map((def) => ({ def, items: results.filter((r) => r.type === def.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search AgentsCamp"
      shouldFilter={false}
      overlayClassName="search-overlay-in fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      className="search-box-in fixed inset-x-0 top-[12vh] z-50 mx-auto flex max-h-[76vh] w-[92vw] max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-black/40 ring-1 ring-primary/10"
    >
      <Dialog.Title className="sr-only">Search AgentsCamp</Dialog.Title>

      {/* prompt-styled input row */}
      <div className="flex items-center gap-2.5 border-b border-border px-4">
        <span className="font-mono text-sm text-primary text-glow" aria-hidden>
          $
        </span>
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="search agents, skills, guides, tools, commands…"
          className="h-14 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground sm:inline">
          esc
        </kbd>
      </div>

      <Command.List className="min-h-0 flex-1 overflow-y-auto p-2">
        {!query && (
          <div className="px-3 py-12 text-center font-mono text-sm text-muted-foreground">
            <span className="text-primary">{">"}</span>{" "}
            {ready ? "type to search the hub" : "building search index"}
            <span className="cursor-blink ml-0.5 text-primary" aria-hidden>
              ▍
            </span>
          </div>
        )}

        {query && results.length === 0 && (
          <Command.Empty className="px-3 py-12 text-center font-mono text-sm text-muted-foreground">
            <span className="text-primary">{">"}</span> no matches for “{query}”
          </Command.Empty>
        )}

        {byType.map(({ def, items }) => {
          const Icon = def.icon;
          return (
            <Command.Group
              key={def.id}
              heading={
                <>
                  <Icon className="size-3.5 text-primary/70" aria-hidden />
                  <span>{def.label}</span>
                  <span className="ml-auto rounded border border-border px-1.5 text-[10px] tabular-nums text-muted-foreground">
                    {items.length}
                  </span>
                </>
              }
              className="mb-1 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:gap-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {items.map((r: SearchRecord) => (
                <Command.Item
                  key={r.href}
                  value={r.href}
                  onSelect={() => go(r.href)}
                  className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground data-[selected=true]:bg-secondary"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-primary transition-colors group-data-[selected=true]:border-primary/40">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.description}
                    </span>
                  </span>
                  <CornerDownLeft
                    className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-data-[selected=true]:opacity-100"
                    aria-hidden
                  />
                </Command.Item>
              ))}
            </Command.Group>
          );
        })}
      </Command.List>

      {/* keyboard-hint footer bar */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="text-primary">$</span>
          <span>
            {query
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "agentscamp/search"}
          </span>
        </span>
        <span className="hidden items-center gap-3 sm:flex">
          <Hint keys="↑↓" label="navigate" />
          <Hint keys="↵" label="open" />
          <Hint keys="esc" label="close" />
        </span>
      </div>
    </Command.Dialog>
  );
}
