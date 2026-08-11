/**
 * ECO//SIM — Indicator register (Editorial Field Study v3)
 * Flat cells on hairline grid: mono value + delta, ink sparkline with baseline
 * tick, tap to open the plain-language story. No rounded meters, no emojis.
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

export default function IndicatorStrip({ indicators, baseline, history }: IndicatorStripProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="border border-border bg-card divide-y divide-border/50">
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => setOpenKey(isOpen ? null : k)}
            aria-label={`${kid.kidName}: ${value.toFixed(0)}. ${isOpen ? "Close story" : "Tap for the story"}`}
            className={`w-full text-left px-3.5 py-2.5 transition-colors ${isOpen ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" style={{ color: meta.color }} aria-hidden="true" />
              <span className="font-data text-[11px] tracking-[0.06em] uppercase w-28 sm:w-36 shrink-0">{kid.kidName}</span>
              <motion.span
                key={value}
                className="font-data text-[15px] tabular-nums font-semibold w-8 text-right"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {value.toFixed(0)}
              </motion.span>
              <span
                className={`font-data text-[11px] tabular-nums w-11 text-right ${good ? "text-emerald-700" : "text-vermilion"}`}
              >
                {delta === 0 ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
              </span>
              <svg viewBox="0 0 100 22" className="w-20 sm:w-28 h-4 shrink-0 ml-auto" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d={sparkPath(sparkValues, 100, 22)}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
                <line
                  x1="0" x2="100"
                  y1={22 - (baselineVal / 100) * 22}
                  y2={22 - (baselineVal / 100) * 22}
                  stroke="currentColor"
                  strokeDasharray="2 2"
                  opacity="0.2"
                />
              </svg>
              <span
                className={`inline-block w-2 h-2 shrink-0 ${isGoodNow ? "bg-emerald-700" : "bg-vermilion"}`}
                aria-hidden="true"
              />
            </div>
            <motion.div
              initial={false}
              animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 text-[12px] leading-relaxed max-w-xl">
                <p className="text-foreground font-medium">{isGoodNow ? kid.happy : kid.sad}</p>
                <p className="text-muted-foreground font-data text-[10px] mt-1 uppercase tracking-wider">{kid.bm}</p>
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
