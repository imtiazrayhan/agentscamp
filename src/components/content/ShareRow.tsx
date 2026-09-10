"use client";

import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { CopyButton } from "./CopyButton";

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Share links for a guide — text labels only, no third-party scripts. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const links = [
    {
      method: "x",
      label: "Share on X",
      href: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${u}&via=${site.twitter.slice(1)}`,
    },
    {
      method: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
  ];
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6">
      <span className="font-mono text-xs text-muted-foreground">share</span>
      {links.map((l) => (
        <a
          key={l.method}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track("share", { method: l.method, content_type: "guide", item_id: url })
          }
          className={btn}
        >
          {l.label}
        </a>
      ))}
      <CopyButton
        text={url}
        label="Copy link"
        copiedLabel="Link copied"
        eventLabel="share:copy_link"
      />
    </div>
  );
}
