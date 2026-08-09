/**
 * ECO//SIM — Causal chain feed
 * Style: Deep Ocean Console — deterministic, rules-based explanation layer
 * (spec §3.5). Each link renders as cause → effect with strength bar.
 * Never implies real-world forecasting; every item is an educational model.
 */
import { ArrowRight, AlertTriangle } from "lucide-react";
import { CausalLink, SimEvent } from "@/lib/sim/types";

interface CausalChainProps {
  links: CausalLink[];
  events: SimEvent[];
  eventsToShow?: number;
}

const SEVERITY_STYLE: Record<SimEvent["severity"], string> = {
  info: "border-teal-signal/40 text-teal-signal",
  warning: "border-amber-warn/50 text-amber-warn",
  critical: "border-coral-risk/60 text-coral-risk",
};

export default function CausalChain({ links, events, eventsToShow = 5 }: CausalChainProps) {
  return (
    <div className="grid-paper border border-border rounded-md p-3 space-y-3">
      <div className="panel-label">Causal feed · what changed &amp; why</div>

      {events.length > 0 && (
        <div className="space-y-1.5">
          <div className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
            Events during simulation
          </div>
          {events.slice(0, eventsToShow).map((e, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 border-l-2 pl-2 py-1 ${SEVERITY_STYLE[e.severity]}`}
            >
              <span className="font-data text-[11px] font-semibold whitespace-nowrap">
                {e.year}
              </span>
              <span className="text-xs leading-snug">
                {e.severity === "warning" || e.severity === "critical" ? (
                  <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />
                ) : null}
                {e.message}
              </span>
            </div>
          ))}
          {events.length > eventsToShow && (
            <div className="font-data text-[10px] text-muted-foreground">
              + {events.length - eventsToShow} more events
            </div>
          )}
        </div>
      )}

      {links.length > 0 && (
        <div className="space-y-2">
          <div className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
            Strongest causal links (educational model)
          </div>
          {links.map((l, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="font-data text-[11px] text-violet-policy shrink-0">{l.cause}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span
                className={`font-data text-[11px] shrink-0 ${l.direction === "positive" ? "text-emerald-life" : "text-coral-risk"}`}
              >
                {l.effect}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden max-w-[90px]">
                <div
                  className={`h-full rounded-full ${l.direction === "positive" ? "bg-emerald-life" : "bg-coral-risk"}`}
                  style={{ width: `${l.strength * 100}%` }}
                />
              </div>
              <span className="font-data text-[10px] text-muted-foreground">
                {(l.strength * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="status-chip inline-block">
        Rules-based explanation · certainty: educational_model
      </div>
    </div>
  );
}
