/**
 * ECO//SIM — Indicator strip
 * Style: Deep Ocean Console — ECG-style pulse-line sparklines, mono readouts,
 * color + icon coding (never color-only per accessibility spec §4.3).
 */
import { motion } from "framer-motion";
import {
  Cloud,
  Leaf,
  Droplets,
  Waves,
  HeartPulse,
  Briefcase,
  Scale,
} from "lucide-react";
import { INDICATOR_KEYS, INDICATOR_META, Indicators } from "@/lib/sim/types";

const ICONS = {
  climatePressure: Cloud,
  biodiversity: Leaf,
  waterSecurity: Droplets,
  floodResilience: Waves,
  publicHealth: HeartPulse,
  economicWellbeing: Briefcase,
  equity: Scale,
} as const;

interface IndicatorStripProps {
  indicators: Indicators;
  baseline: Indicators;
  history: { indicators: Indicators }[];
  compact?: boolean;
}

function sparkPath(values: number[], width: number, height: number): string {
  if (values.length < 2) return "";
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / 100) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function IndicatorStrip({ indicators, baseline, history, compact }: IndicatorStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
      {INDICATOR_KEYS.map((k, i) => {
        const meta = INDICATOR_META[k];
        const Icon = ICONS[k];
        const value = indicators[k];
        const baselineVal = baseline[k];
        const delta = value - baselineVal;
        const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
        const sparkValues = history.map((h) => h.indicators[k]).concat(value).slice(-25);
        return (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="tick-edge bg-card/70 border border-border rounded-md p-2.5 relative overflow-hidden group"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon
                className="w-3.5 h-3.5"
                style={{ color: meta.color }}
                aria-hidden="true"
              />
              <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground leading-none whitespace-normal">
                {meta.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <motion.span
                key={value}
                className="font-data text-lg font-semibold tabular-nums"
                style={{ color: meta.color }}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {value.toFixed(0)}
              </motion.span>
              <span
                className={`font-data text-[10px] tabular-nums ${good ? "text-emerald-life" : "text-coral-risk"}`}
              >
                {delta === 0 ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
              </span>
            </div>
            <svg
              viewBox={`0 0 100 28`}
              className="w-full h-6 mt-1"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={sparkPath(sparkValues, 100, 28)}
                fill="none"
                stroke={meta.color}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
              {/* vital-sign pulse ticks at the last value */}
              {sparkValues.length > 0 && (
                <>
                  <line x1="92" x2="92" y1="4" y2="12" stroke={meta.color} strokeWidth="1.4" opacity="0.5" />
                  <line x1="95" x2="95" y1="16" y2="24" stroke={meta.color} strokeWidth="1.4" opacity="0.5" />
                  <circle cx="98" cy="14" r="1.6" fill={meta.color} opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.25;0.9" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              {/* baseline reference line */}
              <line
                x1="0"
                x2="100"
                y1={28 - (baselineVal / 100) * 28}
                y2={28 - (baselineVal / 100) * 28}
                stroke="currentColor"
                strokeDasharray="2 2"
                opacity="0.25"
              />
            </svg>
            {!compact && (
              <div className="font-data text-[9px] text-muted-foreground/70 mt-0.5 leading-relaxed">
                {meta.meaning}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
