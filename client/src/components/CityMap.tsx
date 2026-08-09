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
    return boost > 0.3 ? "#2f8f52" : CELL_COLORS.mangrove;
  }
  if (cell.type === "beach" || cell.type === "residentialLow") {
    // coastal development paves over the fringe: sand → slate grey
    if ((controls.coastalDevelopment / 30) * rollout > 0.5) return "#c9a87e";
  }
  if (cell.type === "wetland") {
    const loss = (controls.coastalDevelopment / 30) * rollout;
    if (loss > 0.4) return "#b8a478";
  }
  if (indicators && cell.type === "residentialLow" && indicators.floodResilience < 45 && t > 10) {
    // low-income coastal settlement under flood stress
    return "#d0784a";
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
        Teluk Nusa · your town map · tap a square to explore
      </div>
      <div className="soft-card relative p-2 sm:p-3 overflow-hidden rounded-3xl">
        {/* picture-book wave & beach header — the sea meets the sand */}
        <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden pointer-events-none" aria-hidden>
          <svg viewBox="0 0 400 32" className="w-full h-8" preserveAspectRatio="none">
            <path d="M0,14 C40,6 90,24 140,14 C190,4 230,26 290,14 C330,7 370,22 400,12 L400,0 L0,0 Z" fill="var(--teal-signal, oklch(0.55 0.1 210))" opacity="0.22" />
            <path d="M0,20 C60,10 110,30 170,19 C230,8 280,28 340,17 C370,12 390,20 400,16 L400,0 L0,0 Z" fill="var(--teal-signal, oklch(0.55 0.1 210))" opacity="0.32" />
            <rect x="0" y="24" width="400" height="8" fill="var(--amber-warn, oklch(0.75 0.15 75))" opacity="0.28" />
          </svg>
        </div>
        {/* little boat riding the header wave */}
        <div className="absolute top-3 right-10 pointer-events-none hidden sm:block" aria-hidden>
          <svg width="34" height="22" viewBox="0 0 46 26">
            <path d="M0,12 L46,12 L38,22 L8,22 Z" fill="var(--teal-signal)" />
            <line x1="23" y1="12" x2="23" y2="3" stroke="var(--teal-signal)" strokeWidth="2" strokeLinecap="round" />
            <path d="M23,3 Q33,7 23,11" fill="none" stroke="var(--teal-signal)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex gap-2 sm:gap-3 mt-6">
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
                      className="aspect-square rounded-[30%] border border-white/40 transition-colors duration-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]"
                      style={{ backgroundColor: cellColor(cell, controls, indicators, t) }}
                      onHoverStart={() => setHovered(cell)}
                      onHoverEnd={() => setHovered(null)}
                      whileHover={{ scale: 1.4, zIndex: 20 }}
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
          <div className="hidden lg:flex flex-col gap-1.5 justify-center pl-1 min-w-[120px]">
            {(
              [
                ["urbanCore", "Pusat bandar"],
                ["residential", "Houses"],
                ["residentialLow", "Kampung houses"],
                ["highIncome", "Taman houses"],
                ["industrial", "Kilang"],
                ["mangrove", "Bakau"],
                ["wetland", "Wetlands"],
                ["agriculture", "Kebun"],
                ["forest", "Hutan"],
                ["river", "Sungai"],
                ["ocean", "Laut"],
                ["beach", "Pantai"],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-[4px] border border-white/60 shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]"
                  style={{ backgroundColor: CELL_COLORS[k] }}
                />
                <span className="text-xs font-bold text-foreground">{label}</span>
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
      <div className="flex items-center gap-2 flex-wrap mt-1.5">
        <span className="status-chip">Fictional town · educational game</span>
        {hovered && (
          <span className="text-teal-signal font-bold text-sm">
            {CELL_LABELS[hovered.type]} · nature value {(hovered.biodiversityValue * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
}
