/**
 * ECO//SIM — Timeline chart (2026–2050)
 * Style: Deep Ocean Console — Recharts line chart on chart-paper card,
 * mono axis ticks, indicator color coding.
 */
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
import { INDICATOR_KEYS, INDICATOR_META, Indicators } from "@/lib/sim/types";

export interface ChartRow {
  year: number;
  [key: string]: number;
}

interface TimelineChartProps {
  data: ChartRow[];
  className?: string;
  playbackYear?: number | null;
  highlightKeys?: (keyof Indicators)[];
}

export default function TimelineChart({ data, className, highlightKeys }: TimelineChartProps) {
  const keys = highlightKeys ?? INDICATOR_KEYS;
  return (
    <div className={`grid-paper border border-border rounded-md p-3 ${className ?? ""}`}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 0.06)" strokeDasharray="2 3" />
          <XAxis
            dataKey="year"
            tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "oklch(0.68 0.03 230)" }}
            ticks={[2026, 2030, 2035, 2040, 2045, 2050]}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "oklch(0.68 0.03 230)" }}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.21 0.04 250)",
              border: "1px solid oklch(0.33 0.04 245)",
              borderRadius: 8,
              fontFamily: "IBM Plex Mono",
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}`,
              INDICATOR_META[name as keyof Indicators]?.label ?? name,
            ]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10 }}>
                {INDICATOR_META[value as keyof Indicators]?.label ?? value}
              </span>
            )}
          />
          <ReferenceLine y={50} stroke="oklch(1 0 0 / 0.15)" strokeDasharray="4 4" />
          {keys.map((k) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={INDICATOR_META[k].color}
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              animationDuration={400}
            />
          ))}
          {/* 2026 baseline reference markers on every trace */}
          {data.length > 0 &&
            keys.map((k) => (
              <ReferenceLine
                key={`bl_${k}`}
                x={2026}
                stroke="oklch(1 0 0 / 0.10)"
                strokeDasharray="3 4"
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="font-data text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
        <span className="status-chip">Educational model · not a real-world forecast</span>
      </div>
    </div>
  );
}
