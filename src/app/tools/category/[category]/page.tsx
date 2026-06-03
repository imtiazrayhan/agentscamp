import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolCategoryParams } from "@/lib/seo/params";
import { toolCategoryCollection } from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return toolCategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category } = await params;
  const c = toolCategoryCollection(category);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/tools/category/${category}`,
    noindex: c.noindex,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { category } = await params;
  const c = toolCategoryCollection(category);
  if (!c) notFound();
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/tools/category/${category}`}
      items={c.items}
      crumbs={c.crumbs}
    />
  );
}
