/**
 * ECO//SIM — Policy control panel (Kampung Coast v2)
 * Kid layer first: friendly names, one-line stories, plain trade-off lines
 * ("More of X → less of Y"). Expert numbers stay in the small print.
 */
import {
  ArrowDown,
  ArrowUp,
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
  renewableElectricity: "clean power",
  publicTransport: "bus money",
  mangroveRestoration: "more trees",
  coastalDevelopment: "new buildings",
  waterEfficiency: "water saved",
  wasteRecycling: "rubbish sorted",
  fishingPressure: "fishing a lot",
  industrialActivity: "factories busy",
};

interface ControlPanelProps {
  controls: Controls;
  onChange: (k: ControlKey, v: number) => void;
  onReset: () => void;
}

export default function ControlPanel({ controls, onChange, onReset }: ControlPanelProps) {
  return (
    <div className="space-y-3.5">
      {(Object.keys(KID_CONTROLS) as ControlKey[]).map((key) => {
        const kid = KID_CONTROLS[key];
        const r = SLIDER_RANGES[key];
        const value = controls[key];
        const pct = Math.round((value / r.max) * 100);
        return (
          <div key={key} className="soft-card p-4">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-9 h-9 rounded-xl bg-teal-signal/12 flex items-center justify-center shrink-0">
                {
                  (() => {
                    const Ico = ICONS[key];
                    return <Ico className="w-[18px] h-[18px] text-teal-signal" aria-hidden={true} />;
                  })()
                }
              </span>
              <div className="flex-1">
                <div className="font-display font-bold text-[15px] leading-tight">{kid.kidName}</div>
                <div className="font-data text-[10px] text-muted-foreground">{kid.bm}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-extrabold text-teal-signal leading-none tabular-nums">{pct}%</div>
                <div className="font-data text-[10px] text-muted-foreground leading-tight mt-0.5">{UNIT_LABEL[key]}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-snug mb-2">{kid.kidStory}</p>
            <Slider
              aria-label={kid.kidName}
              value={[value]}
              min={r.min}
              max={r.max}
              step={r.step}
              onValueChange={([v]) => onChange(key, v)}
              className="mb-1.5"
            />
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted-foreground font-bold uppercase tracking-wider">
                less ← → more
              </span>
              <span className="status-chip !border-0 !px-1">start: {r.defaultVal}</span>
            </div>
            {/* Plain-language trade-offs: what gets better / what gets harder */}
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-start gap-1.5 text-xs">
                <ArrowUp className="w-3.5 h-3.5 text-emerald-life shrink-0 mt-0.5" />
                <span className="text-foreground font-semibold">{kid.goodWhenMore}</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs">
                <ArrowDown className="w-3.5 h-3.5 text-amber-warn shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-semibold">{kid.badWhenMore}</span>
              </div>
            </div>
          </div>
        );
      })}
      <button
        onClick={onReset}
        className="btn-press w-full text-xs font-bold text-muted-foreground border border-border rounded-full py-2 hover:bg-secondary hover:text-foreground transition-colors"
      >
        Start over — back to the beginning
      </button>
    </div>
  );
}
