import type { Metadata } from "next";
import {
  TypeListing,
  listingPageMetadata,
  listingPageParams,
} from "@/components/content/TypeListing";

type Params = Promise<{ n: string }>;

// Pages 2..n of /commands; page 1 is /commands itself.
export const dynamicParams = false;

export function generateStaticParams() {
  return listingPageParams("command");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { n } = await params;
  return listingPageMetadata("command", Number(n));
}

export default async function Page({ params }: { params: Params }) {
  const { n } = await params;
  return <TypeListing type="command" page={Number(n)} />;
}
