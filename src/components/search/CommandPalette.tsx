"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Compass, CornerDownLeft, Search as SearchIcon } from "lucide-react";
import { useSearch } from "./useSearch";
import { audiences, contentTypeList } from "@/lib/content/registry";
import type { SearchRecord } from "@/lib/content/types";

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs leading-none text-muted-foreground">
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

  // Role paths are five registry entries, not indexed records, so they match
  // instantly — before the search index has even finished loading.
  const q = query.trim().toLowerCase();
  const roleHits = q
    ? audiences.filter(
        (a) => a.slug.includes(q) || a.label.toLowerCase().includes(q),
      )
    : [];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search AgentsCamp"
      shouldFilter={false}
      overlayClassName="search-overlay-in fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      className="search-box-in fixed inset-x-0 top-[12vh] z-50 mx-auto flex max-h-[76vh] w-[92vw] max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-modal"
    >
      <Dialog.Title className="sr-only">Search AgentsCamp</Dialog.Title>

      {/* prompt-styled input row */}
      <div className="flex items-center gap-2 border-b border-border px-4">
        <SearchIcon className="size-[18px] shrink-0 text-muted-foreground" aria-hidden />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search guides, tools, glossary, agents, skills, commands…"
          className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs leading-none text-muted-foreground sm:inline">
          esc
        </kbd>
      </div>

      <Command.List className="min-h-0 flex-1 overflow-y-auto p-2">
        {!query && (
          <div className="px-3 py-12 text-center text-sm text-muted-foreground">
            {ready ? "Start typing to search the hub" : "Building search index…"}
          </div>
        )}

        {roleHits.length > 0 && (
          <Command.Group
            heading={
              <>
                <Compass className="size-3.5 text-primary" aria-hidden />
                <span>Start here</span>
              </>
            }
            className="mb-1 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:gap-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {roleHits.map((a) => (
              <Command.Item
                key={a.slug}
                value={`/for/${a.slug}`}
                onSelect={() => go(`/for/${a.slug}`)}
                className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground data-[selected=true]:bg-secondary"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Compass className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{a.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {a.description}
                  </span>
                </span>
                <CornerDownLeft
                  className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-data-[selected=true]:opacity-100"
                  aria-hidden
                />
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {query && results.length === 0 && roleHits.length === 0 && (
          <Command.Empty className="px-3 py-12 text-center">
            <p className="font-semibold">No matches for “{query}”</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Try a shorter word, or open the full search.
            </p>
            <Command.Item
              value={`search-all-${query}`}
              onSelect={() => go(`/search?q=${encodeURIComponent(query)}`)}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover data-[selected=true]:bg-primary-hover"
            >
              Search everything
              <CornerDownLeft className="size-3.5" aria-hidden />
            </Command.Item>
          </Command.Empty>
        )}

        {byType.map(({ def, items }) => {
          const Icon = def.icon;
          return (
            <Command.Group
              key={def.id}
              heading={
                <>
                  <Icon className="size-3.5 text-primary" aria-hidden />
                  <span>{def.label}</span>
                  <span className="ml-auto rounded-md bg-secondary px-1.5 text-xs tabular-nums text-muted-foreground">
                    {items.length}
                  </span>
                </>
              }
              className="mb-1 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:gap-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {items.map((r: SearchRecord) => (
                <Command.Item
                  key={r.href}
                  value={r.href}
                  onSelect={() => go(r.href)}
                  className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-foreground data-[selected=true]:bg-secondary"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
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
        {query && (
          <Command.Item
            key="see-all"
            value="__see_all__"
            onSelect={() => {
              onOpenChange(false);
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground data-[selected=true]:bg-secondary data-[selected=true]:text-foreground"
          >
            <SearchIcon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              See all results for &ldquo;{query}&rdquo;
            </span>
            <CornerDownLeft
              className="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity group-data-[selected=true]:opacity-100"
              aria-hidden
            />
          </Command.Item>
        )}
      </Command.List>

      {/* keyboard-hint footer bar */}
      <div className="flex items-center justify-between border-t border-border bg-secondary px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          {query
            ? `${results.length + roleHits.length} result${results.length + roleHits.length === 1 ? "" : "s"}`
            : "Search AgentsCamp"}
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
