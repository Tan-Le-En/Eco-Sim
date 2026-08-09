/**
 * ECO//SIM — City map (20×20 grid)
 * Style: Deep Ocean Console — the map is rendered as an instrument tile-grid
 * on a chart-paper card, with per-cell tooltips and animated zone shifts
 * driven by simulation state (mangrove growth, coastal development, flooding).
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { buildCityMap, CELL_COLORS, CELL_LABELS, MapCell } from "@/lib/sim/cityMap";
import { Controls, END_YEAR, Indicators } from "@/lib/sim/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CityMapProps {
  controls: Controls;
  indicators: Indicators | null;
  year: number;
  className?: string;
}

const staticMap = buildCityMap();

function cellColor(cell: MapCell, controls: Controls, indicators: Indicators | null, t: number): string {
  const rollout = Math.min(1, t / 10);
  if (cell.type === "mangrove") {
    // restoration thickens the mangrove belt (brighter green)
    const boost = (controls.mangroveRestoration / 30) * rollout;
    return boost > 0.3 ? "#10b981" : CELL_COLORS.mangrove;
  }
  if (cell.type === "beach" || cell.type === "residentialLow") {
    // coastal development paves over the fringe: sand → slate grey
    if ((controls.coastalDevelopment / 30) * rollout > 0.5) return "#94a3b8";
  }
  if (cell.type === "wetland") {
    const loss = (controls.coastalDevelopment / 30) * rollout;
    if (loss > 0.4) return "#78716c";
  }
  if (indicators && cell.type === "residentialLow" && indicators.floodResilience < 45 && t > 10) {
    // low-income coastal settlement under flood stress
    return "#b45309";
  }
  return CELL_COLORS[cell.type];
}

export default function CityMap({ controls, indicators, year, className }: CityMapProps) {
  const t = year - 2026;
  const [hovered, setHovered] = useState<MapCell | null>(null);

  const rows = useMemo(() => staticMap, []);

  return (
    <div className={className}>
      <div className="panel-label mb-2">
        Nusa Bay · 20 × 20 district grid · fictional educational model
      </div>
      <div className="grid-paper relative rounded-md border border-border p-2 sm:p-3 overflow-hidden">
        <div className="flex gap-2 sm:gap-3">
          <div
            className="grid gap-[2px] flex-1"
            style={{ gridTemplateColumns: `repeat(20, minmax(0, 1fr))` }}
          >
            {rows.flatMap((row, y) =>
              row.map((cell, x) => (
                <Tooltip key={cell.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      aria-label={`${CELL_LABELS[cell.type]} at ${cell.x}, ${cell.y}`}
                      className="aspect-square rounded-[2px] border border-black/20 transition-colors duration-500"
                      style={{ backgroundColor: cellColor(cell, controls, indicators, t) }}
                      onHoverStart={() => setHovered(cell)}
                      onHoverEnd={() => setHovered(null)}
                      whileHover={{ scale: 1.35, zIndex: 20 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="font-data text-[11px] max-w-[220px]"
                    sideOffset={8}
                  >
                    <div className="font-semibold">{CELL_LABELS[cell.type]}</div>
                    <div className="opacity-70 mt-1">
                      elev {cell.elevationM} m ·{" "}
                      {cell.population > 0
                        ? `pop ~${cell.population.toLocaleString()}`
                        : "uninhabited"}{" "}
                      · flood exposure {(cell.floodExposure * 100).toFixed(0)}%
                    </div>
                  </TooltipContent>
                </Tooltip>
              )),
            )}
          </div>
          {/* Legend */}
          <div className="hidden lg:flex flex-col gap-1.5 justify-center pl-1 min-w-[110px]">
            {(
              [
                ["urbanCore", "City core"],
                ["residential", "Residential"],
                ["residentialLow", "Low-income"],
                ["highIncome", "High-income"],
                ["industrial", "Industry"],
                ["mangrove", "Mangroves"],
                ["wetland", "Wetlands"],
                ["agriculture", "Farmland"],
                ["river", "River"],
                ["ocean", "Sea"],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-[2px] border border-black/25 shrink-0"
                  style={{ backgroundColor: CELL_COLORS[k] }}
                />
                <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Compass tick marks on bottom edge */}
        <div className="flex justify-between px-2 mt-1.5">
          {["W", "", "", "N", "", "", "", "E"].map((l, i) => (
            <span key={i} className="font-data text-[9px] text-muted-foreground/60">
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="font-data text-[10px] text-muted-foreground mt-1.5 flex items-center gap-2 flex-wrap">
        <span className="status-chip">Educational model · simplified assumption</span>
        {hovered && (
          <span className="text-teal-signal">
            {CELL_LABELS[hovered.type]} — {(hovered.biodiversityValue * 100).toFixed(0)}%
            biodiversity value
          </span>
        )}
      </div>
    </div>
  );
}
