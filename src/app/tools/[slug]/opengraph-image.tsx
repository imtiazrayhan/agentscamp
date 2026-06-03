import { getItem } from "@/lib/content";
import { toolParams } from "@/lib/seo/params";
import { renderItemOg } from "@/lib/seo/og";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AgentsCamp tool";

export function generateStaticParams() {
  return toolParams();
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderItemOg(getItem("tool", "", slug));
}
