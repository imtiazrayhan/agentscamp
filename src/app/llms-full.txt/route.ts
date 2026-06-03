import { buildLlmsFull } from "@/lib/seo/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFull(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
