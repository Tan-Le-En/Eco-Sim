/**
 * ECO//SIM — site header
 * Style: Deep Ocean Console — wordmark with teal double-slash, mono nav.
 */
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO = "/manus-storage/ecosim-logo_8c68d962.png";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/briefing", label: "Briefing" },
  { href: "/simulator", label: "Simulator" },
  { href: "/transparency", label: "Transparency" },
];

export default function SiteHeader({ backHref }: { backHref?: string }) {
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <img src={LOGO} alt="ECO//SIM logo" className="w-8 h-8" />
          <span className="font-display font-bold text-lg tracking-tight">
            ECO<span className="text-teal-signal">//</span>SIM
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {backHref && (
            <Link
              href={backHref}
              className="btn-press flex items-center gap-1.5 font-data text-[11px] uppercase tracking-wider text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          )}
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`btn-press hidden sm:inline-flex font-data text-[11px] uppercase tracking-wider rounded-md px-3 py-1.5 transition-colors ${
                location === n.href
                  ? "bg-teal-signal/15 text-teal-signal border border-teal-signal/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
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
