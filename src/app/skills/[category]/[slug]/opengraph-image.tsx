import { getItem } from "@/lib/content";
import { categorizedParams } from "@/lib/seo/params";
import { renderItemOg } from "@/lib/seo/og";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AgentsCamp skill";

export function generateStaticParams() {
  return categorizedParams("skill");
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  return renderItemOg(getItem("skill", category, slug));
}
