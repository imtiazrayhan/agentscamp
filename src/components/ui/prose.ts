/**
 * The single prose recipe for rendered Markdown. Previously three divergent
 * strings (Markdown.tsx, about, how-to-use) disagreed on measure and link
 * styling. Width is deliberately NOT set here — the surrounding column owns the
 * reading measure, so long-form and short-form pages can differ.
 */
export const proseClasses = [
  "prose prose-stone max-w-none dark:prose-invert",
  "prose-headings:scroll-mt-24 prose-headings:tracking-tight",
  "prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0",
  "prose-a:text-primary prose-a:font-medium prose-a:underline-offset-2",
  "prose-code:before:content-none prose-code:after:content-none",
  "prose-img:rounded-lg",
].join(" ");
