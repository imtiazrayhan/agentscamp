import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolPricingParams } from "@/lib/seo/params";
import { toolPricingCollection } from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";

type Params = Promise<{ pricing: string }>;

export function generateStaticParams() {
  return toolPricingParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { pricing } = await params;
  const c = toolPricingCollection(pricing);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/tools/pricing/${pricing}`,
    noindex: c.noindex,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { pricing } = await params;
  const c = toolPricingCollection(pricing);
  if (!c) notFound();
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/tools/pricing/${pricing}`}
      items={c.items}
      crumbs={c.crumbs}
    />
  );
}
