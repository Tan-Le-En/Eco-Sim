/**
 * ECO//SIM — Language Toggle
 * A compact 3-option switch: EN / BM / 中文.
 * Editorial Field Study style: border, no radius, mono labels.
 */
import { useLang, LANGUAGES, type Language } from "@/contexts/LanguageContext";

export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`flex items-center border border-border bg-card ${className ?? ""}`}>
      {LANGUAGES.map((l, i) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`btn-press font-data text-[10px] tracking-[0.08em] uppercase px-2.5 py-1.5 transition-colors ${
            i > 0 ? "border-l border-border" : ""
          } ${
            lang === l.code
              ? "bg-vermilion text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          title={l.native}
        >
          {l.code === "en" ? "EN" : l.code === "bm" ? "BM" : "中文"}
        </button>
      ))}
    </div>
  );
}
