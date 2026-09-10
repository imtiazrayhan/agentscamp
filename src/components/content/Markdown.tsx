import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";
import type { ComponentProps, ReactNode } from "react";
import { Pre } from "./Pre";
import { proseClasses } from "@/components/ui/prose";
import { cn } from "@/lib/utils";

/**
 * Server Component markdown renderer. Async unified pipeline (so Shiki can run at
 * build time) -> React elements, mapping <pre> to a copy-enabled client block and
 * external links to safe anchors. Used for agents, skills, guides, commands.
 */

function Anchor({ href, children, ...props }: ComponentProps<"a">) {
  const external = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

/** Wide tables scroll inside the column rather than widening the reading measure. */
function Table({ children, ...props }: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto">
      <table {...props} className="my-0">
        {children}
      </table>
    </div>
  );
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkAlert)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    properties: { className: ["heading-anchor"] },
  })
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark" },
    keepBackground: false,
  })
  .use(rehypeReact, {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
      a: Anchor,
      pre: Pre as unknown as (props: ComponentProps<"pre">) => ReactNode,
      table: Table,
    },
  } as Parameters<typeof rehypeReact>[0]);

export async function Markdown({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const file = await processor.process(source);
  return (
    <div
      className={cn(proseClasses, className)}
    >
      {file.result as ReactNode}
    </div>
  );
}
