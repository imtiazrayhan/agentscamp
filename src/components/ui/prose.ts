/**
 * The single prose recipe for rendered Markdown. Previously three divergent
 * strings (Markdown.tsx, about, how-to-use) disagreed on measure and link
 * styling. Width is deliberately NOT set here — the surrounding column owns the
 * reading measure, so long-form and short-form pages can differ.
 *
 * Heading sizes and rhythm are stated rather than inherited. The typography
 * plugin sizes headings in `em`, which compounds against the article's own
 * 18px base and left the in-article scale drifting away from the h1/h2/h3 the
 * rest of the site uses. These pin it to the same steps: 24 for h2, 20 for h3,
 * and a top margin roughly twice the bottom one so a heading groups with the
 * text it introduces rather than floating between two blocks.
 */
export const proseClasses = [
  "prose prose-stone max-w-none dark:prose-invert",
  "prose-headings:scroll-mt-24 prose-headings:tracking-tight",
  "prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:font-bold",
  "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-semibold",
  "prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-base prose-h4:font-semibold",
  // prose-stone sets --tw-prose-pre-code to a LIGHT grey because it expects a
  // DARK pre background. Stripping that background — as this line used to,
  // with bg-transparent — left light text on a light page: any <pre> written
  // directly in JSX rendered at roughly 1.1:1 and was effectively invisible.
  // Markdown blocks never showed it because rehype-pretty-code paints every
  // token, so only the hand-written ones were affected.
  // Styling pre correctly here fixes the class of bug rather than the instance;
  // Pre.tsx matches these values for the copy-enabled markdown blocks.
  "prose-pre:rounded-lg prose-pre:border-0 prose-pre:bg-card",
  "prose-pre:p-4 prose-pre:text-sm prose-pre:text-foreground",
  "prose-a:text-primary prose-a:font-medium prose-a:underline-offset-2",
  "prose-code:before:content-none prose-code:after:content-none",
  "prose-blockquote:border-l-primary prose-blockquote:not-italic",
  "prose-img:rounded-lg",
].join(" ");
