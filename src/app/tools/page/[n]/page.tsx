import type { Metadata } from "next";
import {
  TypeListing,
  listingPageMetadata,
  listingPageParams,
} from "@/components/content/TypeListing";

type Params = Promise<{ n: string }>;

// Pages 2..n of /tools; page 1 is /tools itself.
export const dynamicParams = false;

export function generateStaticParams() {
  return listingPageParams("tool");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { n } = await params;
  return listingPageMetadata("tool", Number(n));
}

export default async function Page({ params }: { params: Params }) {
  const { n } = await params;
  return <TypeListing type="tool" page={Number(n)} />;
}
