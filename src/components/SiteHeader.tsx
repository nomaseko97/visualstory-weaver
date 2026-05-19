import { Link } from "@tanstack/react-router";
import { BookOpenText } from "lucide-react";

const NAV = [
  { to: "/explore", label: "Explore" },
  { to: "/create", label: "Create" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_18px_oklch(0.55_0.25_295/0.55)]">
            <BookOpenText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl tracking-wider text-foreground">
            VISUALREADS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-1.5 text-sm font-semibold text-foreground bg-white/10" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/create"
          className="neon-cta font-display text-sm tracking-[0.18em]"
        >
          START CREATING
        </Link>
      </div>
    </header>
  );
}
