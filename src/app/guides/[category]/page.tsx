import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryParams } from "@/lib/seo/params";
import { categoryCollection } from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return categoryParams("guide");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category } = await params;
  const c = categoryCollection("guide", category);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/guides/${category}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { category } = await params;
  const c = categoryCollection("guide", category);
  if (!c) notFound();
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/guides/${category}`}
      items={c.items}
      crumbs={c.crumbs}
    />
  );
}
