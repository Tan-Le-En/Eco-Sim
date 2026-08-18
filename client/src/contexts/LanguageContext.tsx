/**
 * ECO//SIM — Language Context
 * Manages EN / Bahasa Malaysia / 中文 switching.
 * Persists to localStorage. Default: EN.
 */
import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Language = "en" | "bm" | "zh";

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "bm", label: "Bahasa Malaysia", native: "Bahasa Malaysia" },
  { code: "zh", label: "Chinese", native: "中文" },
];

interface LangState {
  lang: Language;
  setLang: (l: Language) => void;
}

const LangContext = createContext<LangState | null>(null);
const STORAGE_KEY = "ecosim:lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "bm" || stored === "zh") return stored;
    } catch { /* ignore */ }
    return "en";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
