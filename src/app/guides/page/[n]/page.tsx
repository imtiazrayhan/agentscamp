import type { Metadata } from "next";
import {
  TypeListing,
  listingPageMetadata,
  listingPageParams,
} from "@/components/content/TypeListing";

type Params = Promise<{ n: string }>;

// Pages 2..n of /guides; page 1 is /guides itself.
export const dynamicParams = false;

export function generateStaticParams() {
  return listingPageParams("guide");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { n } = await params;
  return listingPageMetadata("guide", Number(n));
}

export default async function Page({ params }: { params: Params }) {
  const { n } = await params;
  return <TypeListing type="guide" page={Number(n)} />;
}
