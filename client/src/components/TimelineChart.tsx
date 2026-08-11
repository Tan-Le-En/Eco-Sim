/**
 * ECO//SIM — Timeline chart (Editorial Field Study v3)
 * Chart-paper aesthetic: flat white plate, hairline grid, mono tick labels,
 * flat legend toggles with strikethrough. Traces use the semantic ink colors.
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

const TICK = { fontFamily: "IBM Plex Mono", fontSize: 10, fontWeight: 400, fill: "oklch(0.45 0.02 65)" };

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
          <Tooltip
            contentStyle={{
              background: "oklch(0.99 0.008 80)",
              border: "1px solid oklch(0.85 0.015 80)",
              borderRadius: 0,
              fontFamily: "IBM Plex Mono",
              fontSize: 11,
              boxShadow: "none",
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
