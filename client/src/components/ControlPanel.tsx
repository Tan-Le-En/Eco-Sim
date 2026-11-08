/**
 * ECO//SIM — Policy control panel (Editorial Field Study v3)
 * Flat ledger of eight decisions: numbered rows, hairline rules, mono values,
 * trade-off notes kept as two short annotated lines. Controls stay compact so
 * the whole cockpit fits one viewport.
 */
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Sun,
  Bus,
  TreePine,
  Building2,
  Waves,
  Recycle,
  Fish,
  Factory,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { CONTROL_RANGES, Controls, KID_CONTROLS } from "@/lib/sim/types";

export type ControlKey = keyof Controls;

/* Icon table (v4): one icon per concept across the whole site. Water
   efficiency takes Waves — Droplets belongs to the waterSecurity register. */
const ICONS: Record<ControlKey, LucideIcon> = {
  renewableElectricity: Sun,
  publicTransport: Bus,
  mangroveRestoration: TreePine,
  coastalDevelopment: Building2,
  waterEfficiency: Waves,
  wasteRecycling: Recycle,
  fishingPressure: Fish,
  industrialActivity: Factory,
};

const UNIT_LABEL: Record<ControlKey, string> = {
  renewableElectricity: "% grid target",
  publicTransport: "invest. level",
  mangroveRestoration: "% area",
  coastalDevelopment: "% expansion",
  waterEfficiency: "% saved",
  wasteRecycling: "% sorted",
  fishingPressure: "% intensity",
  industrialActivity: "% output",
};

interface ControlPanelProps {
  controls: Controls;
  onChange: (k: ControlKey, v: number) => void;
  onReset: () => void;
}

export default function ControlPanel({
  controls,
  onChange,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="border border-border bg-card divide-y divide-border/60">
      {(Object.keys(KID_CONTROLS) as ControlKey[]).map((key, idx) => {
        const kid = KID_CONTROLS[key];
        const r = CONTROL_RANGES[key];
        const value = controls[key];
        const Ico = ICONS[key];
        return (
          <div key={key} className="px-4 py-3">
            <div className="flex items-baseline gap-3">
              <span className="font-data text-vermilion text-[11px] tabular-nums w-4 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <Ico
                className="w-4 h-4 text-foreground/70 shrink-0"
                aria-hidden={true}
              />
              <span className="flex-1 min-w-0">
                <span className="font-display font-semibold text-[14px] leading-tight block truncate">
                  {kid.kidName}
                </span>
                <span className="font-data text-[10px] text-muted-foreground block mt-0.5 truncate">
                  {kid.bm} · {UNIT_LABEL[key]}
                </span>
              </span>
              <span className="font-data text-[12px] tabular-nums font-medium w-16 text-right whitespace-nowrap">
                {value}
                <span className="text-muted-foreground font-normal text-[11px]">
                  /{r.max}
                </span>
              </span>
            </div>
            <Slider
              aria-label={kid.kidName}
              value={[value]}
              min={r.min}
              max={r.max}
              step={1}
              onValueChange={([v]) => onChange(key, v)}
              className="mt-2"
            />
            <div className="mt-1.5 space-y-0.5">
              <div className="flex items-start gap-2 text-[11px] leading-snug">
                <span className="font-data text-ok font-bold text-[10px] tracking-wider uppercase pt-px shrink-0">
                  +
                </span>
                <span className="text-muted-foreground">
                  {kid.goodWhenMore}
                </span>
              </div>
              <div className="flex items-start gap-2 text-[11px] leading-snug">
                <span className="font-data text-vermilion font-bold text-[10px] tracking-wider uppercase pt-px shrink-0">
                  −
                </span>
                <span className="text-muted-foreground">{kid.badWhenMore}</span>
              </div>
            </div>
          </div>
        );
      })}
      <div className="px-4 py-2.5">
        <ConfirmDialog
          trigger={
            <button className="btn-press w-full font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border border-border py-2 px-3 hover:border-foreground hover:text-foreground transition-colors">
              Reset all to baseline
            </button>
          }
          title="Reset every dial?"
          description="All eight decisions return to the 2026 baseline. Any unsaved choices are lost."
          confirmLabel="Reset"
          onConfirm={onReset}
        />
      </div>
    </div>
  );
}
