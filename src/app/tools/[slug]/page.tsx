import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentByType, getItem, getRelated } from "@/lib/content";
import { DetailView } from "@/components/content/DetailView";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getContentByType("tool").map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem("tool", "", slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: item.href },
    openGraph: { title: item.title, description: item.description, type: "article" },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getItem("tool", "", slug);
  if (!item) notFound();
  return <DetailView item={item} related={getRelated(item)} />;
}
