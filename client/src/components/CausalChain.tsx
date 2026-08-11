/**
 * ECO//SIM — Causal chain (Editorial Field Study v3)
 * Flat field notes: mono year stamps, hairline severity rules,
 * plain cause → effect lines with flat strength bars.
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { CausalLink, SimEvent } from "@/lib/sim/types";

interface CausalChainProps {
  links: CausalLink[];
  events: SimEvent[];
  eventsToShow?: number;
}

const SEVERITY_BORDER: Record<SimEvent["severity"], string> = {
  info: "border-border",
  warning: "border-vermilion/60",
  critical: "border-vermilion",
};

const SEVERITY_TEXT: Record<SimEvent["severity"], string> = {
  info: "text-muted-foreground",
  warning: "text-vermilion/80",
  critical: "text-vermilion",
};

export default function CausalChain({ links, events, eventsToShow = 5 }: CausalChainProps) {
  return (
    <div className="border border-border bg-card divide-y divide-border/50">
      {events.length > 0 && (
        <div className="px-4 py-3">
          <div className="font-data text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
            Events during the run
          </div>
          {events.slice(0, eventsToShow).map((e, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 border-l-2 pl-2.5 py-1 ${SEVERITY_BORDER[e.severity]}`}
            >
              <span className="font-data text-[11px] tabular-nums whitespace-nowrap pt-px">{e.year}</span>
              <span className={`text-[12px] leading-snug ${SEVERITY_TEXT[e.severity]}`}>
                {e.severity !== "info" && (
                  <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />
                )}
                {e.message}
              </span>
            </div>
          ))}
          {events.length > eventsToShow && (
            <div className="font-data text-[10px] text-muted-foreground mt-1">
              + {events.length - eventsToShow} more events omitted
            </div>
          )}
        </div>
      )}

      {links.length > 0 && (
        <div className="px-4 py-3">
          <div className="font-data text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
            Strongest causal links · deterministic model
          </div>
          {links.map((l, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[12px] py-1">
              <span className="font-data text-[11px] text-foreground/80 shrink-0">{l.cause}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span
                className={`font-data text-[11px] shrink-0 ${l.direction === "positive" ? "text-emerald-700" : "text-vermilion"}`}
              >
                {l.effect}
              </span>
              <div className="flex-1 h-1 bg-secondary max-w-[90px]">
                <div
                  className={`h-full ${l.direction === "positive" ? "bg-emerald-700" : "bg-vermilion"}`}
                  style={{ width: `${l.strength * 100}%` }}
                />
              </div>
              <span className="font-data text-[10px] text-muted-foreground tabular-nums">
                {(l.strength * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-2">
        <span className="status-chip">Rules-based · certainty: educational model, not a forecast</span>
      </div>
    </div>
  );
}
