"use client";

import { Download, ExternalLink, Github } from "lucide-react";
import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";

function yamlLine(key: string, value?: string | string[]) {
  if (value == null) return null;
  const v = Array.isArray(value) ? value.join(", ") : value;
  if (!v) return null;
  return `${key}: ${JSON.stringify(v)}`;
}

/** Reconstruct the install-ready artifact file (site-only keys stripped). */
function buildFile(item: ContentItem): string | null {
  const lines: (string | null)[] = ["---"];
  if (item.type === "agent") {
    lines.push(
      yamlLine("name", item.slug),
      yamlLine("description", item.description),
      `model: ${item.model}`,
      item.color ? `color: ${item.color}` : null,
      yamlLine("tools", item.tools),
    );
  } else if (item.type === "skill") {
    lines.push(
      yamlLine("name", item.slug),
      yamlLine("description", item.description),
      yamlLine("allowed-tools", item.allowedTools),
      item.version ? `version: ${item.version}` : null,
    );
  } else if (item.type === "command") {
    lines.push(
      yamlLine("description", item.description),
      item.argumentHint ? yamlLine("argument-hint", item.argumentHint) : null,
      yamlLine("allowed-tools", item.allowedTools),
      item.model ? `model: ${item.model}` : null,
    );
  } else {
    return null;
  }
  lines.push("---", "", item.body ?? "");
  return lines.filter((l) => l !== null).join("\n");
}

function downloadHref(content: string) {
  return `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`;
}

export function InstallActions({ item }: { item: ContentItem }) {
  const def = contentTypes[item.type];

  if (item.type === "tool") {
    return (
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
    );
  }

  if (item.type === "guide") return null;

  const file = buildFile(item);
  if (!file) return null;
  const filename =
    item.type === "skill" ? `${item.slug}/SKILL.md` : `${item.slug}.md`;

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
