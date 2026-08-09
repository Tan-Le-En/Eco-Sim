/**
 * ECO//SIM — Policy control panel (8 sliders)
 * Style: Deep Ocean Console — instrument dials. Each slider shows current
 * value, min/max, unit, live impact arrows, and a short explanation.
 * Trade-offs are never hidden (spec §2.2).
 */
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Controls } from "@/lib/sim/types";

export type ControlKey = keyof Controls;

interface SliderDef {
  key: ControlKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  explanation: string;
  plus: string[]; // expected positive impacts
  minus: string[]; // expected negative impacts
  budgetCost?: number; // rough budget drain per 100 units
}

export const SLIDER_DEFS: SliderDef[] = [
  {
    key: "renewableElectricity",
    label: "Renewable electricity",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
    defaultVal: 30,
    explanation: "Transition the grid from fossil fuels toward solar, wind, and hydro.",
    plus: ["emissions", "air quality"],
    minus: ["upfront cost", "grid upgrades"],
    budgetCost: 14,
  },
  {
    key: "publicTransport",
    label: "Public transport investment",
    unit: "budget units",
    min: 0,
    max: 100,
    step: 5,
    defaultVal: 10,
    explanation: "Metro, buses, and bike lanes that pull people out of cars and motorcycles.",
    plus: ["transport emissions", "mobility", "equity"],
    minus: ["public funds", "construction"],
    budgetCost: 12,
  },
  {
    key: "mangroveRestoration",
    label: "Tree & mangrove restoration",
    unit: "% extra coverage",
    min: 0,
    max: 30,
    step: 1,
    defaultVal: 0,
    explanation: "Replant mangroves along the coast and trees across the city.",
    plus: ["flood protection", "biodiversity", "carbon storage", "cooling"],
    minus: ["available development land", "maintenance cost"],
    budgetCost: 9,
  },
  {
    key: "coastalDevelopment",
    label: "Coastal development",
    unit: "% expansion",
    min: 0,
    max: 30,
    step: 1,
    defaultVal: 10,
    explanation: "Build housing and economy on the coastal fringe — the most exposed land.",
    plus: ["housing", "short-term economy"],
    minus: ["flood exposure", "habitat loss", "infrastructure demand"],
    budgetCost: 5,
  },
  {
    key: "waterEfficiency",
    label: "Water efficiency",
    unit: "% improvement",
    min: 0,
    max: 60,
    step: 5,
    defaultVal: 10,
    explanation: "Fix leaks, recycle wastewater, and fit efficient fixtures city-wide.",
    plus: ["water resilience", "supply pressure"],
    minus: ["initial cost"],
    budgetCost: 8,
  },
  {
    key: "wasteRecycling",
    label: "Waste & recycling",
    unit: "% recycling rate",
    min: 0,
    max: 60,
    step: 5,
    defaultVal: 20,
    explanation: "Sort, recycle, and stop plastic leaking into rivers and the ocean.",
    plus: ["river & ocean health", "biodiversity", "some jobs"],
    minus: ["collection cost"],
    budgetCost: 6,
  },
  {
    key: "fishingPressure",
    label: "Fishing pressure",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
    defaultVal: 60,
    explanation: "How intensively the bay's fish stocks are harvested each year.",
    plus: ["short-term food", "fisher incomes"],
    minus: ["fish-stock health", "long-term food security"],
  },
  {
    key: "industrialActivity",
    label: "Industrial activity",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
    defaultVal: 55,
    explanation: "Factories and plants: jobs and output, but also energy, water, and pollution.",
    plus: ["jobs", "economic output"],
    minus: ["emissions", "water use", "pollution"],
  },
];

interface ControlPanelProps {
  controls: Controls;
  onChange: (k: ControlKey, v: number) => void;
  onReset: () => void;
}

export default function ControlPanel({ controls, onChange, onReset }: ControlPanelProps) {
  return (
    <div className="space-y-4">
      {SLIDER_DEFS.map((def) => {
        const value = controls[def.key];
        return (
          <div key={def.key} className="tick-edge bg-card/60 border border-border rounded-md p-3.5">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="font-display text-sm font-semibold">{def.label}</span>
              <span className="font-data text-sm text-teal-signal font-medium tabular-nums">
                {value}
                <span className="text-muted-foreground text-xs ml-0.5">{def.unit}</span>
              </span>
            </div>
            <Slider
              aria-label={def.label}
              value={[value]}
              min={def.min}
              max={def.max}
              step={def.step}
              onValueChange={([v]) => onChange(def.key, v)}
              className="mb-2"
            />
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-data text-[10px] text-muted-foreground uppercase tracking-wider">
                {def.min} – {def.max} {def.unit}
              </span>
              <div className="flex items-center gap-0.5">
                <span className="status-chip !border-0 !px-1">{def.defaultVal} baseline</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-snug mb-1.5">{def.explanation}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {def.plus.map((p) => (
                <span key={"p" + p} className="flex items-center gap-1 text-[11px] text-emerald-life">
                  <ArrowUp className="w-3 h-3" /> {p}
                </span>
              ))}
              {def.minus.map((m) => (
                <span key={"m" + m} className="flex items-center gap-1 text-[11px] text-amber-warn">
                  <ArrowDown className="w-3 h-3" /> {m}
                </span>
              ))}
              {def.plus.length === 0 && def.minus.length === 0 && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Minus className="w-3 h-3" /> direct trade-off
                </span>
              )}
            </div>
          </div>
        );
      })}
      <button
        onClick={onReset}
        className="btn-press w-full font-data text-[11px] uppercase tracking-widest text-muted-foreground border border-border rounded-md py-2 hover:bg-secondary hover:text-foreground transition-colors"
      >
        Reset all to baseline
      </button>
    </div>
  );
}
