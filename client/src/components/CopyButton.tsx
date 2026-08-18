/**
 * ECO//SIM — Copy button (Editorial Field Study v3 + v7 production layer)
 * One-line shared copy affordance: "Copy → Copied" state flip with Check icon
 * and toast confirmation. Fallback for older browsers without clipboard API.
 */
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
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
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Copy failed — try selecting the text manually");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-[0.14em] uppercase px-3 py-2 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors ${className}`}
      aria-label={copied ? "Copied" : `${label} to clipboard`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}
