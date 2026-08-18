/**
 * ECO//SIM — Cookie banner (Editorial Field Study v3 + v7 production layer)
 * Simple, honest, and dismissible. Only controls optional analytics cookies.
 * Choice persists in localStorage; banner never returns after a decision.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const KEY = "cookie-consent";

export function hasConsent(): boolean {
  return localStorage.getItem(KEY) === "accepted";
}

export default function CookieBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(KEY) === null) {
      const t = setTimeout(() => setShown(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (choice: "accepted" | "declined") => {
    localStorage.setItem(KEY, choice);
    setShown(false);
  };

  if (!shown) return null;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground border-t border-border dark:bg-[oklch(0.2_0.012_75)] dark:border-border"
      data-no-print="true"
      role="dialog"
      aria-label="Cookie notice"
    >
      <div className="px-6 sm:px-10 py-4 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-[13px] leading-relaxed">
          <span className="font-data text-[10px] tracking-[0.16em] uppercase block mb-1 text-secondary-foreground/70 dark:text-[oklch(0.62_0.01_80)]">
            Field note · cookies
          </span>
          Your plan choices and theme are stored only on your device. Enabling
          analytics lets this study improve — declining changes nothing about
          your experience.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => decide("accepted")}
            className="btn-press bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:brightness-105 transition-all"
          >
            Allow analytics
          </button>
          <button
            onClick={() => decide("declined")}
            className="btn-press border border-current/40 font-data text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:bg-primary-foreground/10 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </motion.div>
  );
}
