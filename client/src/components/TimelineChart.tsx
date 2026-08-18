/**
 * ECO//SIM — Timeline chart (Editorial Field Study v3)
 * Chart-paper aesthetic: flat white plate, hairline grid, mono tick labels,
 * flat legend toggles with strikethrough. Traces use the semantic ink colors.
 */
import { useState } from "react";
import type { TooltipProps } from "recharts";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { INDICATOR_KEYS, INDICATOR_META, KID_INDICATORS, Indicators } from "@/lib/sim/types";

export interface ChartRow {
  year: number;
  [key: string]: number;
}

interface TimelineChartProps {
  data: ChartRow[];
  className?: string;
  highlightKeys?: (keyof Indicators)[];
}

const TICK = { fontFamily: "IBM Plex Mono", fontSize: 10, fontWeight: 400, fill: "oklch(0.45 0.02 65)" };

/**
 * Custom tooltip: shows indicator values at the hovered year plus a plain-language
 * hint about what changed since 2026. "What changed?" at a glance.
 */
function CausalTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0 || !label) return null;
  const year = label as unknown as number;
  const baseRow = payload[0]?.payload as ChartRow;

  return (
    <div className="bg-popover border border-border p-3 max-w-xs">
      <div className="font-data text-[10px] tracking-[0.14em] uppercase text-vermilion mb-1.5">
        Year {year} · what changed
      </div>
      <div className="space-y-0.5">
        {payload.map((entry) => {
          const key = entry.dataKey as string;
          const kidName = KID_INDICATORS[key as keyof Indicators]?.kidName ?? key;
          const current = typeof entry.value === "number" ? entry.value : 0;
          const delta = current - 50; // 2026 baseline is 50 for all indicators
          const dir = delta > 0 ? "↑" : delta < 0 ? "↓" : "—";
          const color =
            Math.abs(delta) > 15
              ? delta > 0
                ? "text-emerald-700"
                : "text-vermilion"
              : "text-muted-foreground";
          return (
            <div key={key} className="flex items-baseline justify-between gap-3 text-[11px]">
              <span className="font-data text-[10px] truncate">{kidName}</span>
              <span className="font-data text-[11px] tabular-nums">
                <span className={color}>{dir}</span>{" "}
                {current.toFixed(0)}
                {Math.abs(delta) > 5 && (
                  <span className="text-[9px] text-muted-foreground ml-1">({delta > 0 ? "+" : ""}{delta.toFixed(0)})</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      {year > 2026 && (
        <p className="mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
          Arrows show how far each indicator has moved from the 2026 starting point.
          The model is deterministic; your controls drive every change.
        </p>
      )}
    </div>
  );
}

export default function TimelineChart({ data, className, highlightKeys }: TimelineChartProps) {
  const keys = highlightKeys ?? INDICATOR_KEYS;
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setHidden((h) => ({ ...h, [k]: !h[k] }));

  return (
    <div className={`border border-border bg-card p-3 ${className ?? ""}`}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="oklch(0.235 0.015 65 / 0.1)" strokeDasharray="1 3" />
          <XAxis
            dataKey="year"
            tick={TICK}
            ticks={[2026, 2030, 2035, 2040, 2045, 2050]}
            stroke="oklch(0.235 0.015 65 / 0.35)"
          />
          <YAxis
            domain={[0, 100]}
            tick={TICK}
            ticks={[0, 25, 50, 75, 100]}
            stroke="oklch(0.235 0.015 65 / 0.35)"
          />
          <Tooltip content={<CausalTooltip />} cursor={{ stroke: "oklch(0.45 0.02 65 / 0.3)", strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ paddingTop: 8 }}
            formatter={(value) => (
              <button
                type="button"
                onClick={() => toggle(value as string)}
                className="hover:opacity-70 transition-opacity"
                aria-pressed={!hidden[value as string]}
              >
                <span
                  style={{
                    fontFamily: "IBM Plex Mono",
                    fontSize: 10,
                    fontWeight: 500,
                    color: "oklch(0.35 0.02 65)",
                    textDecoration: hidden[value as string] ? "line-through" : "none",
                    opacity: hidden[value as string] ? 0.45 : 1,
                  }}
                >
                  {KID_INDICATORS[value as keyof Indicators]?.kidName ?? value}
                </span>
              </button>
            )}
          />
          <ReferenceLine y={50} stroke="oklch(0.235 0.015 65 / 0.18)" strokeDasharray="3 4" />
          {keys.map((k) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={INDICATOR_META[k].color}
              strokeWidth={1.6}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              hide={hidden[k as string]}
              animationDuration={400}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-1">
        <span className="status-chip">Fictional town · educational model · not a forecast</span>
      </div>
    </div>
  );
}
