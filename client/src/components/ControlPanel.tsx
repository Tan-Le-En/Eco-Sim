/**
 * ECO//SIM — Policy control panel (Editorial Field Study v3)
 * Flat ledger of eight decisions: numbered rows, hairline rules, mono values,
 * trade-off notes kept as two short annotated lines. Controls stay compact so
 * the whole cockpit fits one viewport.
 */
import {
  Sun,
  Bus,
  TreePine,
  Building2,
  Droplets,
  Recycle,
  Fish,
  Factory,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Controls, KID_CONTROLS } from "@/lib/sim/types";

export type ControlKey = keyof Controls;

const SLIDER_RANGES: Record<ControlKey, { min: number; max: number; step: number; defaultVal: number }> = {
  renewableElectricity: { min: 0, max: 100, step: 5, defaultVal: 30 },
  publicTransport: { min: 0, max: 100, step: 5, defaultVal: 10 },
  mangroveRestoration: { min: 0, max: 30, step: 1, defaultVal: 0 },
  coastalDevelopment: { min: 0, max: 30, step: 1, defaultVal: 10 },
  waterEfficiency: { min: 0, max: 60, step: 5, defaultVal: 10 },
  wasteRecycling: { min: 0, max: 60, step: 5, defaultVal: 20 },
  fishingPressure: { min: 0, max: 100, step: 5, defaultVal: 60 },
  industrialActivity: { min: 0, max: 100, step: 5, defaultVal: 55 },
};

const ICONS: Record<ControlKey, LucideIcon> = {
  renewableElectricity: Sun,
  publicTransport: Bus,
  mangroveRestoration: TreePine,
  coastalDevelopment: Building2,
  waterEfficiency: Droplets,
  wasteRecycling: Recycle,
  fishingPressure: Fish,
  industrialActivity: Factory,
};

const UNIT_LABEL: Record<ControlKey, string> = {
  renewableElectricity: "% clean power",
  publicTransport: "% bus share",
  mangroveRestoration: "restored",
  coastalDevelopment: "new buildings",
  waterEfficiency: "% saved",
  wasteRecycling: "% sorted",
  fishingPressure: "boats at sea",
  industrialActivity: "factory output",
};

interface ControlPanelProps {
  controls: Controls;
  onChange: (k: ControlKey, v: number) => void;
  onReset: () => void;
}

export default function ControlPanel({ controls, onChange, onReset }: ControlPanelProps) {
  return (
    <div className="border border-border bg-card divide-y divide-border/60">
      {(Object.keys(KID_CONTROLS) as ControlKey[]).map((key, idx) => {
        const kid = KID_CONTROLS[key];
        const r = SLIDER_RANGES[key];
        const value = controls[key];
        const pct = Math.round((value / r.max) * 100);
        const Ico = ICONS[key];
        return (
          <div key={key} className="px-4 py-3">
            <div className="flex items-baseline gap-3">
              <span className="font-data text-vermilion text-[11px] tabular-nums w-4 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <Ico className="w-4 h-4 text-foreground/70 shrink-0" aria-hidden={true} />
              <span className="flex-1">
                <span className="font-display font-semibold text-[14px] leading-tight">{kid.kidName}</span>
                <span className="font-data text-[10px] text-muted-foreground block mt-0.5">{kid.bm}</span>
              </span>
              <span className="font-data text-[12px] tabular-nums font-medium w-20 text-right whitespace-nowrap">
                {pct}%
                <span className="text-muted-foreground font-normal">/ {r.defaultVal}%</span>
              </span>
            </div>
            <Slider
              aria-label={kid.kidName}
              value={[value]}
              min={r.min}
              max={r.max}
              step={r.step}
              onValueChange={([v]) => onChange(key, v)}
              className="mt-2"
            />
            <div className="mt-1.5 space-y-0.5">
              <div className="flex items-start gap-2 text-[11px] leading-snug">
                <span className="font-data text-emerald-700 font-bold text-[10px] tracking-wider uppercase pt-px shrink-0">+</span>
                <span className="text-foreground/80">{kid.goodWhenMore}</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] leading-snug">
                <span className="font-data text-vermilion font-bold text-[10px] tracking-wider uppercase pt-px shrink-0">−</span>
                <span className="text-muted-foreground">{kid.badWhenMore}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="px-4 py-2.5">
        <button
          onClick={onReset}
          className="btn-press w-full font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-border py-2 px-3 hover:border-foreground hover:text-foreground transition-colors"
        >
          Reset all to baseline
        </button>
      </div>
    </div>
  );
}
