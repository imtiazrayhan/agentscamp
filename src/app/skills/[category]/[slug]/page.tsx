import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentByType, getItem, getRelated } from "@/lib/content";
import { DetailView } from "@/components/content/DetailView";

type Params = Promise<{ category: string; slug: string }>;

export function generateStaticParams() {
  return getContentByType("skill").map((i) => ({
    category: i.category,
    slug: i.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const item = getItem("skill", category, slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: item.href },
    openGraph: { title: item.title, description: item.description, type: "article" },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { category, slug } = await params;
  const item = getItem("skill", category, slug);
  if (!item) notFound();
  return <DetailView item={item} related={getRelated(item)} />;
}
