/**
 * ECO//SIM — Shared site footer (Editorial Field Study v11)
 * One consistent footer across every page: attribution line, last-updated
 * date, and legal links (privacy notice, terms of use).
 */
import { Link } from "wouter";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto" data-no-print="true">
      <div className="px-6 sm:px-10 lg:px-14 py-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
          ECO//SIM · Teluk Nusa · an open educational model, not real-world advice
        </span>
        <nav className="flex items-center gap-4" aria-label="Legal">
          <Link
            href="/privacy"
            className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors"
          >
            Terms
          </Link>
          <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            © 2026 · Last updated · Aug 18, 2026
          </span>
        </nav>
      </div>
    </footer>
  );
}
