import { getItem } from "@/lib/content";
import { glossaryParams } from "@/lib/seo/params";
import { renderItemOg } from "@/lib/seo/og";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AgentsCamp glossary term";

export function generateStaticParams() {
  return glossaryParams();
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderItemOg(getItem("glossary", "", slug));
}
