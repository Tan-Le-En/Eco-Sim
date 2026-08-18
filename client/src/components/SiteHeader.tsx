/**
 * ECO//SIM — site header (Editorial Field Study v3 + v7 production layer)
 * Sticky top bar with backdrop blur, scroll progress, hamburger mobile menu
 * (animated slide-down drawer), dark-mode toggle, and site-search entry.
 * Editorial discipline: hairlines, mono labels, zero radius.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import SiteSearch from "@/components/SiteSearch";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/briefing", label: "Briefing" },
  { href: "/story", label: "Story" },
  { href: "/simulator", label: "Simulator" },
  { href: "/transparency", label: "Transparency" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader({ backHref, bare }: { backHref?: string; bare?: boolean }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the mobile drawer on route change (single-screen habit)
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Keyboard: Escape closes the drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 bg-background/92 backdrop-blur-md border-b border-border" data-no-print="true">
      <div className="px-6 sm:px-10 lg:px-14 flex items-center justify-between h-13">
        <Link href="/" className="font-display italic font-semibold text-xl tracking-tight whitespace-nowrap">
          ECO<span className="text-vermilion">//</span>SIM
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {backHref && (
            <Link
              href={backHref}
              className="btn-press flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-border px-3 py-2 hover:border-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
          )}
          {(bare ? NAV.filter((n) => n.href !== "/") : NAV).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`btn-press inline-flex font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 transition-colors ${
                location === n.href
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            className="btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-transparent hover:border-border hover:text-foreground px-3 py-2 transition-colors"
            aria-label="Open site search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
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
          <button
            onClick={() => setSearchOpen(true)}
            className="btn-press inline-flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open site search"
          >
            <Search className="w-4 h-4" />
          </button>
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
            <nav className="px-6 py-4 flex flex-col divide-y divide-border">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`btn-press py-3.5 flex items-center justify-between font-data text-[12px] tracking-[0.14em] uppercase ${
                    location === n.href ? "text-vermilion" : "text-foreground"
                  }`}
                >
                  {n.label}
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

      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
