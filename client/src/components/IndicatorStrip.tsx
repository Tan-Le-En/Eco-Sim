/**
 * ECO//SIM — Indicator strip (Kampung Coast v2)
 * Kid layer: friendly names + one-line stories + colored meter. Expert: the
 * exact number, sparkline trace, and baseline dashed line remain visible.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Leaf,
  Droplets,
  Umbrella,
  HeartPulse,
  Briefcase,
  Scale,
  RotateCcw,
} from "lucide-react";
import {
  INDICATOR_KEYS,
  INDICATOR_META,
  KID_INDICATORS,
  Indicators,
} from "@/lib/sim/types";

const ICONS = {
  climatePressure: Cloud,
  biodiversity: Leaf,
  waterSecurity: Droplets,
  floodResilience: Umbrella,
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
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
      {INDICATOR_KEYS.map((k, i) => {
        const meta = INDICATOR_META[k];
        const kid = KID_INDICATORS[k];
        const Icon = ICONS[k];
        const value = indicators[k];
        const baselineVal = baseline[k];
        const delta = value - baselineVal;
        const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
        const isGoodNow = meta.higherIsBetter ? value >= 60 : value <= 45;
        const sparkValues = history.map((h) => h.indicators[k]).concat(value).slice(-25);
        const isOpen = openKey === k;
        return (
          <motion.button
            key={k}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => setOpenKey(isOpen ? null : k)}
            aria-label={`${kid.kidName}: ${value.toFixed(0)}. ${isOpen ? "Close story" : "Tap for the story"}`}
            className={`soft-card p-3 text-left relative overflow-hidden transition-all ${isOpen ? "ring-2 ring-teal-signal/40" : "hover:ring-1 hover:ring-teal-signal/25"}`}
          >
            {/* Happy/sad mood dot */}
            <span
              className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: isGoodNow ? "#3fa466" : good ? "#e8a33d" : "#d05a4a" }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-4 h-4" style={{ color: meta.color }} aria-hidden="true" />
              <span className="font-display text-[13px] font-bold leading-tight">{kid.kidName}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <motion.span
                key={value}
                className="font-display text-xl font-extrabold tabular-nums"
                style={{ color: meta.color }}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {value.toFixed(0)}
              </motion.span>
              <span
                className={`font-data text-[10px] tabular-nums font-bold ${good ? "text-emerald-life" : "text-coral-risk"}`}
              >
                {delta === 0 ? "same" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
              </span>
            </div>
            {/* Colored meter bar */}
            <div className="w-full h-1.5 rounded-full bg-secondary mt-1 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: meta.color }}
                animate={{ width: `${Math.max(3, Math.min(100, value))}%` }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
            <svg
              viewBox="0 0 100 22"
              className="w-full h-4 mt-1"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={sparkPath(sparkValues, 100, 22)}
                fill="none"
                stroke={meta.color}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
              {sparkValues.length > 0 && (
                <circle cx="100" cy={22 - (sparkValues[sparkValues.length - 1] / 100) * 22} r="2" fill={meta.color} opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.25;0.9" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <line
                x1="0" x2="100"
                y1={22 - (baselineVal / 100) * 22}
                y2={22 - (baselineVal / 100) * 22}
                stroke="currentColor"
                strokeDasharray="2 2"
                opacity="0.25"
              />
            </svg>
            {/* Kid story — appears on tap */}
            <motion.div
              initial={false}
              animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-1.5 text-[11px] leading-snug">
                <p className="text-foreground font-semibold">{isOpen ? (isGoodNow ? kid.happy : kid.sad) : kid.kidStory}</p>
                <p className="text-muted-foreground font-data text-[10px] mt-1 uppercase tracking-wider">{kid.bm}</p>
                <p className="text-muted-foreground font-data text-[9px] mt-1">{meta.meaning} · start: {baselineVal.toFixed(0)}</p>
              </div>
            </motion.div>
            <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              <RotateCcw className="w-2.5 h-2.5" aria-hidden="true" />
              tap for the story
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
