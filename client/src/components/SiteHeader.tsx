/**
 * ECO//SIM — site header (Editorial Field Study v3)
 * Typographic wordmark only, mono uppercase nav, hairline border.
 */
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/briefing", label: "Briefing" },
  { href: "/simulator", label: "Simulator" },
  { href: "/transparency", label: "Transparency" },
];

export default function SiteHeader({ backHref }: { backHref?: string }) {
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="px-6 sm:px-10 lg:px-14 flex items-center justify-between h-13">
        <Link href="/" className="font-display italic font-semibold text-xl tracking-tight whitespace-nowrap">
          ECO<span className="text-vermilion">//</span>SIM
        </Link>
        <nav className="flex items-center gap-1">
          {backHref && (
            <Link
              href={backHref}
              className="btn-press flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-border px-3 py-2 hover:border-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          )}
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`btn-press hidden sm:inline-flex font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 transition-colors ${
                location === n.href
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
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
