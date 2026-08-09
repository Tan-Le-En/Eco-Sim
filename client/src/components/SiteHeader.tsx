/**
 * ECO//SIM — site header (Kampung Coast v2)
 * Style: warm light theme, rounded pill nav, friendlier labels.
 */
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO = "/manus-storage/ecosim-logo_8c68d962.png";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/briefing", label: "Story" },
  { href: "/simulator", label: "Play" },
  { href: "/transparency", label: "For teachers" },
];

export default function SiteHeader({ backHref }: { backHref?: string }) {
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <img src={LOGO} alt="ECO//SIM logo" className="w-8 h-8" />
          <span className="font-display font-extrabold text-lg tracking-tight">
            ECO<span className="text-teal-signal">·</span>SIM
            <span className="ml-2 font-data text-[10px] font-bold text-muted-foreground hidden md:inline-block">
              Jom Selamatkan Bandar Pantai!
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1.5">
          {backHref && (
            <Link
              href={backHref}
              className="btn-press flex items-center gap-1.5 text-xs font-bold text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          )}
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`btn-press hidden sm:inline-flex text-xs font-bold rounded-full px-4 py-1.5 transition-colors ${
                location === n.href
                  ? "bg-teal-signal text-primary-foreground shadow-md shadow-teal-signal/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
