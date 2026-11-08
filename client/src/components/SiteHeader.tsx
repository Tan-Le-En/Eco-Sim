/**
 * ECO//SIM — site header (Editorial Field Study v4 + v7 production layer)
 * Sticky top bar with backdrop blur, scroll progress, hamburger mobile menu
 * (animated slide-down drawer), dark-mode toggle, and site-search entry.
 * Editorial discipline: hairlines, mono labels, zero radius.
 *
 * IA spine (v4): the nav mirrors the visitor's flow —
 *   01 Story → 02 Briefing → 03 Simulator → 04 Report (state-aware)
 * then the quieter trust layer: Transparency, FAQ.
 * Flow items read as foreground; reference items sit back in muted.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSim } from "@/contexts/SimContext";
import SiteSearch from "@/components/SiteSearch";

export const NAV: { href: string; label: string; tier: "flow" | "ref" }[] = [
  { href: "/story", label: "Story", tier: "flow" },
  { href: "/briefing", label: "Briefing", tier: "flow" },
  { href: "/simulator", label: "Simulator", tier: "flow" },
  { href: "/results", label: "Report", tier: "flow" },
  { href: "/transparency", label: "Transparency", tier: "ref" },
  { href: "/faq", label: "FAQ", tier: "ref" },
];

export default function SiteHeader({ backHref, bare }: { backHref?: string; bare?: boolean }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { currentResult } = useSim();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the mobile drawer on route change (single-screen habit)
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock scroll while the drawer is open — restore whatever was set before.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Keyboard: Escape closes the drawer (listener only while open)
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // In bare/immersive mode the search palette stays unmounted so its
  // Cmd/Ctrl+K listener can't interrupt reel keyboard controls.
  const showSearch = !bare;
  const dark = theme === "dark";

  return (
    <header
      className={
        bare
          ? "w-full border-b border-border bg-white dark:bg-background"
          : "sticky top-0 z-50 bg-background/92 backdrop-blur-md border-b border-border"
      }
      data-no-print="true"
    >
      <div
        className={
          bare
            ? "flex items-center justify-between h-16 px-4 sm:px-6 lg:px-10 w-max whitespace-nowrap"
            : "flex items-center justify-between h-16 px-6 sm:px-10 lg:px-14"
        }
      >
        <Link href="/" className="font-display italic font-semibold text-xl tracking-tight whitespace-nowrap">
          ECO<span className="text-vermilion">//</span>SIM
        </Link>

        {/* Desktop nav — flow first, trust layer last, numbered like a field report */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {backHref && (
            <Link
              href={backHref}
              className="btn-press flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-border px-3 py-2 hover:border-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          )}
          {NAV.map((n, i) => {
            const active = location === n.href;
            const muted = n.tier === "ref";
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 transition-colors border border-transparent ${
                  active
                    ? "bg-secondary text-secondary-foreground dark:bg-[oklch(0.24_0.012_75)]"
                    : muted
                      ? "text-muted-foreground hover:text-foreground hover:border-border"
                      : "text-foreground hover:border-border hover:bg-secondary/60"
                }`}
              >
                <span className={active ? "text-vermilion" : "text-muted-foreground/80"}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {n.label}
                {n.href === "/results" && (
                  <span
                    aria-hidden="true"
                    className={`inline-block w-1.5 h-1.5 ml-0.5 ${currentResult ? "bg-vermilion" : "border border-muted-foreground/60"}`}
                  />
                )}
              </Link>
            );
          })}
          {showSearch && (
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-transparent hover:border-border hover:text-foreground px-3 py-2 transition-colors"
              aria-label="Search the field study"
              title="Search (Cmd/Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Search</span>
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="btn-press inline-flex items-center font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-transparent hover:border-border hover:text-foreground px-3 py-2 transition-colors"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          {showSearch && (
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-press inline-flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search the field study"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="btn-press inline-flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-press inline-flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — full-width slide-down, editorial hairlines */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="px-6 py-4 flex flex-col divide-y divide-border" aria-label="Primary">
              {NAV.map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={location === n.href ? "page" : undefined}
                  className={`btn-press py-3.5 flex items-center gap-3 justify-between font-data text-[12px] tracking-[0.14em] uppercase ${
                    location === n.href ? "text-vermilion" : n.tier === "ref" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={location === n.href ? "text-vermilion" : "text-muted-foreground/80"}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {n.label}
                    {n.href === "/results" && currentResult && (
                      <span aria-hidden="true" className="inline-block w-1.5 h-1.5 bg-vermilion" />
                    )}
                  </span>
                  <span className={`inline-block w-1.5 h-1.5 ${location === n.href ? "bg-vermilion" : "bg-border"}`} />
                </Link>
              ))}
              {backHref && (
                <Link
                  href={backHref}
                  className="btn-press py-3.5 flex items-center gap-2 font-data text-[12px] tracking-[0.14em] uppercase text-muted-foreground"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {showSearch && <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />}
    </header>
  );
}
