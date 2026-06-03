import Link from "next/link";
import { contentTypeList } from "@/lib/content/registry";
import { Logo } from "@/components/brand/Logo";
import { SearchBar } from "@/components/search/SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function Nav() {
  const links = contentTypeList.map((d) => ({ label: d.label, href: d.basePath }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" aria-label="AgentsCamp home" className="text-[15px]">
          <Logo blink />
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm px-2.5 py-1.5 font-mono text-sm lowercase text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
