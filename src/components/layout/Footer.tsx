import Link from "next/link";
import { contentTypeList } from "@/lib/content/registry";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-mono font-semibold"
          >
            <span className="text-primary">▍</span>
            {site.name.toLowerCase()}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {site.description}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Browse</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {contentTypeList.map((d) => (
              <li key={d.id}>
                <Link href={d.basePath} className="hover:text-foreground">
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/how-to-use" className="hover:text-foreground">
                How to use
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-foreground">
                Search
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="hover:text-foreground">
                Sitemap
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">About</h3>
          <p className="text-sm text-muted-foreground">{site.tagline}</p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2026 {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
