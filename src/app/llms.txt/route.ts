import { buildLlmsIndex } from "@/lib/seo/llms";

// Pure SSG: render once at build time, like feed.xml.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
