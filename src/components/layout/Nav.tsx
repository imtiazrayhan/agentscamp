import Link from "next/link";
import { getCountsByType, getByAudience, audiences } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/search/SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { buildNav } from "./nav-items";

export function Nav() {
  const counts = getCountsByType();
  const roleCounts = Object.fromEntries(
    audiences.map((a) => [a.slug, getByAudience(a.slug).length]),
  );
  const items = buildNav(counts, roleCounts);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex items-center gap-3 py-3">
        <Link href="/" aria-label="AgentsCamp home" className="text-base">
          <Logo />
        </Link>

        <NavLinks items={items} />

        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          <MobileNav items={items} />
        </div>
      </Container>
    </header>
  );
}
