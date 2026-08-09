/**
 * ECO//SIM — Timeline chart (Kampung Coast v2)
 * Light soft card, kid-friendly legend names (Bahasa gloss), warm axes.
 */
import { useState } from "react";
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

export default function TimelineChart({ data, className, highlightKeys }: TimelineChartProps) {
  const keys = highlightKeys ?? INDICATOR_KEYS;
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const toggle = (k: string) => setHidden((h) => ({ ...h, [k]: !h[k] }));

  return (
    <div className={`soft-card p-3 ${className ?? ""}`}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="oklch(0.235 0.015 65 / 0.08)" strokeDasharray="2 3" />
          <XAxis
            dataKey="year"
            tick={{ fontFamily: "Nunito", fontSize: 11, fontWeight: 700, fill: "oklch(0.45 0.02 65)" }}
            ticks={[2026, 2030, 2035, 2040, 2045, 2050]}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontFamily: "Nunito", fontSize: 11, fontWeight: 700, fill: "oklch(0.45 0.02 65)" }}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.99 0.008 80)",
              border: "1px solid oklch(0.9 0.02 65)",
              borderRadius: 12,
              fontFamily: "Nunito",
              fontSize: 12,
              boxShadow: "0 4px 16px oklch(0.235 0.015 65 / 0.12)",
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}`,
              KID_INDICATORS[name as keyof Indicators]?.kidName ?? name,
            ]}
            labelFormatter={(label) => `Year ${label}`}
          />
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
                    fontFamily: "Nunito",
                    fontSize: 11,
                    fontWeight: 700,
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
          <ReferenceLine y={50} stroke="oklch(0.235 0.015 65 / 0.12)" strokeDasharray="4 4" />
          {keys.map((k) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={INDICATOR_META[k].color}
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 0 }}
              hide={hidden[k as string]}
              animationDuration={400}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
        <span className="status-chip">Fictional town · educational game · not a real forecast</span>
      </div>
    </div>
  );
}
