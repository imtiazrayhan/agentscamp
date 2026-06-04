"use client";

import { ChevronRight, Download, ExternalLink, FileText, Github } from "lucide-react";
import type { AgentItem, ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { buildArtifact, artifactFilename } from "@/lib/seo/artifact";
import { AGENT_EXPORT_FORMATS } from "@/lib/export/agent-formats";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";

function downloadHref(content: string) {
  return `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`;
}

/**
 * "Export for other tools" — turn a Claude Code subagent into another tool's real
 * config file (GitHub Copilot full-fidelity; Cursor/Cline/Windsurf/Continue as
 * prompt-only rules, labeled). Download links point at the static /export routes
 * (so they're crawlable / LLM-fetchable); Copy uses the same generator client-side.
 */
function AgentExport({ item }: { item: AgentItem }) {
  return (
    <details className="group rounded-lg border border-border">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
        Export for other tools
      </summary>
      <ul className="space-y-3 border-t border-border px-3 py-3">
        {AGENT_EXPORT_FORMATS.map((f) => (
          <li
            key={f.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{f.label}</span>
                <span className="text-xs text-muted-foreground">
                  {f.fidelity === "full"
                    ? "Full fidelity"
                    : `Prompt as rule — no ${f.drops}`}
                </span>
              </div>
              <code className="font-mono text-xs text-muted-foreground">
                {f.installPath.replace("<slug>", item.slug)}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                getText={() => f.build(item)}
                label="Copy"
                copiedLabel="Copied!"
              />
              <a
                href={`${item.href}.${f.routeExt}`}
                download={f.saveAs(item.slug)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Download className="size-3.5" /> Download
              </a>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** "View as Markdown" — the page's clean .md twin, handy for humans and LLMs/agents. */
function MarkdownLink({ item }: { item: ContentItem }) {
  return (
    <a
      href={`${item.href}.md`}
      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
    >
      <FileText className="size-3.5" /> View as Markdown
    </a>
  );
}

export function InstallActions({ item }: { item: ContentItem }) {
  const def = contentTypes[item.type];

  if (item.type === "tool") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Visit website <ExternalLink className="size-4" />
            </a>
          </Button>
          {item.repo && (
            <Button asChild variant="outline">
              <a href={item.repo} target="_blank" rel="noopener noreferrer">
                <Github className="size-4" /> Source
              </a>
            </Button>
          )}
        </div>
        <MarkdownLink item={item} />
      </div>
    );
  }

  if (item.type === "guide") {
    return <MarkdownLink item={item} />;
  }

  const file = buildArtifact(item);
  if (!file) return null;
  const filename = artifactFilename(item);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <CopyButton
          text={file}
          label={`Copy ${def.singular.toLowerCase()} file`}
          copiedLabel="Copied!"
          className="h-10 px-4"
        />
        <Button asChild variant="outline">
          <a href={downloadHref(file)} download={filename.replace("/", "-")}>
            <Download className="size-4" /> Download
          </a>
        </Button>
        <MarkdownLink item={item} />
      </div>
      {def.installPath && (
        <p className="text-xs text-muted-foreground">
          Install to{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono">
            {def.installPath.replace("<slug>", item.slug)}
          </code>
        </p>
      )}
      {item.type === "agent" && <AgentExport item={item} />}
      {item.type === "skill" && item.multiFile && (
        <p className="text-xs text-muted-foreground">
          This skill references additional resource files — see its source for
          the full bundle.
        </p>
      )}
    </div>
  );
}
