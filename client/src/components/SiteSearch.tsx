/**
 * ECO//SIM — Site search (Editorial Field Study v3 + v7 production layer)
 * A flat editorial command palette: fuzzy-match pages and common questions,
 * keyboard-first (Cmd/Ctrl+K), zero radius, mono labels.
 *
 * UIUX pro Max command palette:
 * - Larger touch-target field (~44px)
 * - Result count banner ("N results match 'q'")
 * - Conditional clear button (×) that restores the full result set
 * - Leading magnifier; trailing ⌘K shortcut hint when empty
 * - Arrow up/down to highlight, Enter to accept, Esc to close
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, Compass, FileText, HelpCircle, X } from "lucide-react";
import { NAV } from "@/components/SiteHeader";

interface Entry {
  kind: "page" | "question";
  label: string;
  hint: string;
  href?: string;
  id?: string;
  keywords: string[];
}

const QUESTIONS = [
  {
    label: "How is the score calculated?",
    hint: "Seven registers, published weights",
    faqId: "score",
  },
  {
    label: "Why can't I reach 100?",
    hint: "The economy trade-off caps scores near 77",
    faqId: "perfect",
  },
  {
    label: "What are the mission targets?",
    hint: "Five thresholds you must hit by 2050",
    faqId: "targets",
  },
  {
    label: "What happens when the budget runs out?",
    hint: "Projects stall and approval drops",
    faqId: "budget",
  },
  {
    label: "Is Teluk Nusa a real town?",
    hint: "Fictional town, real Malaysian photographs",
    faqId: "real",
  },
  {
    label: "Can a child play this?",
    hint: "Plain-language dials, rigorous numbers",
    faqId: "kids",
  },
  {
    label: "How can teachers use this?",
    hint: "Save up to four plans and compare them",
    faqId: "teachers",
  },
  {
    label: "Does it work on a phone?",
    hint: "Mobile-first single-column simulator",
    faqId: "phone",
  },
  {
    label: "Is there a dark mode?",
    hint: "Sun/moon toggle in the header",
    faqId: "dark",
  },
];

function buildIndex(): Entry[] {
  const pages: Entry[] = NAV.map(n => ({
    kind: "page" as const,
    label: n.label,
    hint:
      n.href === "/"
        ? "The field study — one million people, twenty-five years"
        : n.href === "/briefing"
          ? "Mission briefing — keep Teluk Nusa alive for 25 years"
          : n.href === "/story"
            ? "Story mode — five chapters on the town that speaks"
            : n.href === "/simulator"
              ? "The cockpit — eight decisions, seven registers, 2026–2050"
              : n.href === "/transparency"
                ? "Every equation published — rules-based, not a forecast"
                : "Common questions — honest answers",
    href: n.href,
    keywords: [n.label.toLowerCase(), n.href],
  }));

  const faqs: Entry[] = QUESTIONS.map(q => ({
    kind: "question" as const,
    label: q.label,
    hint: q.hint,
    href: `/faq#${q.faqId}`,
    id: q.faqId,
    keywords: [q.label.toLowerCase(), q.hint.toLowerCase(), q.faqId],
  }));

  return [...pages, ...faqs];
}

/** Naive fuzzy: entry matches if every query word is a substring of any keyword */
function matches(entry: Entry, q: string): boolean {
  if (!q.trim()) return false;
  const words = q.toLowerCase().split(/\s+/);
  return words.every(w => entry.keywords.some(k => k.includes(w)));
}

export default function SiteSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(
    () => (open ? index.filter(e => matches(e, query)) : []),
    [index, query, open]
  );

  const go = (entry: Entry) => {
    onOpenChange(false);
    setHighlighted(-1);
    if (entry.href) navigate(entry.href);
  };

  const clear = () => {
    setQuery("");
    setHighlighted(-1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Palette-level keyboard navigation while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted(h => Math.min(h + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted(h => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlighted >= 0) go(results[highlighted]);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, highlighted]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlighted(-1);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none border-border p-0 overflow-hidden">
        <DialogTitle className="sr-only">Search the field study</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search
            className="w-4 h-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setHighlighted(-1);
            }}
            placeholder="Search pages & questions…"
            className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-muted-foreground py-2 sm:py-2.5"
            aria-label="Search"
            autoComplete="off"
          />
          {query.trim() ? (
            <button
              onClick={clear}
              className="btn-press p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Clear search"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="font-data text-[10px] tracking-wider uppercase text-muted-foreground border border-border px-1.5 py-0.5 hidden sm:block">
              ⌘K
            </span>
          )}
        </div>

        {query.trim() && (
          <div className="px-4 py-2 text-left">
            <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} match “
              {query}”
            </span>
          </div>
        )}

        <div className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
              {query.trim()
                ? "No matches found"
                : "Start typing to search the study"}
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.kind}-${r.label}`}
                onClick={() => go(r)}
                className={`btn-press w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/60 last:border-0 ${
                  highlighted === i ? "bg-muted" : ""
                }`}
              >
                {r.kind === "page" ? (
                  <Compass
                    className="w-4 h-4 text-vermilion shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <HelpCircle
                    className="w-4 h-4 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate">
                    {r.label}
                  </span>
                  <span className="block font-data text-[10px] tracking-wider uppercase text-muted-foreground truncate mt-0.5">
                    {r.hint}
                  </span>
                </span>
                {r.kind === "page" && (
                  <FileText
                    className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
