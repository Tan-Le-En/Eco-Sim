/**
 * ECO//SIM — Share/copy button (Editorial Field Study)
 * Prefers the Web Share API when available; falls back to clipboard copy.
 * Used for "Share score" on the report.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Share2 } from "lucide-react";

export default function CopyButton({
  text,
  label = "Copy",
  shareTitle,
  className = "",
}: {
  text: string;
  label?: string;
  shareTitle?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  const handleAction = async () => {
    try {
      if (
        shareTitle &&
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        try {
          await navigator.share({ title: shareTitle, text });
          setDone(true);
          setTimeout(() => setDone(false), 2200);
          return;
        } catch (e) {
          // User cancelled share sheet — not an error; fall through to copy.
          if (e instanceof Error && e.name === "AbortError") return;
        }
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setDone(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setDone(false), 2200);
    } catch {
      toast.error("Could not share — try copying the text manually");
    }
  };

  const canNativeShare =
    shareTitle &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  return (
    <button
      onClick={handleAction}
      className={`btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors ${className}`}
      aria-label={done ? "Shared" : label}
      title={canNativeShare ? "Share score" : "Copy score to clipboard"}
    >
      {done ? (
        <Check className="w-3.5 h-3.5 text-ok" />
      ) : canNativeShare ? (
        <Share2 className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {done ? "Shared" : label}
    </button>
  );
}
