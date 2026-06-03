"use client";

import { Download, ExternalLink, FileText, Github } from "lucide-react";
import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { buildArtifact, artifactFilename } from "@/lib/seo/artifact";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";

function downloadHref(content: string) {
  return `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`;
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
      {item.type === "skill" && item.multiFile && (
        <p className="text-xs text-muted-foreground">
          This skill references additional resource files — see its source for
          the full bundle.
        </p>
      )}
    </div>
  );
}
