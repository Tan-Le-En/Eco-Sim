/**
 * ECO//SIM — City map (20×20 tile grid, Editorial Field Study v3)
 * Flat square cells on a white plate, hairline rules, field label,
 * mono legend. Cells respond to controls: mangroves thicken, coastline paves.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { buildCityMap, CELL_COLORS, CELL_LABELS, MapCell } from "@/lib/sim/cityMap";
import { Controls, Indicators } from "@/lib/sim/types";
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

const LEGEND: [keyof typeof CELL_COLORS, string][] = [
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
];

function cellColor(cell: MapCell, controls: Controls, indicators: Indicators | null, t: number): string {
  const rollout = Math.min(1, t / 10);
  if (cell.type === "mangrove") {
    const boost = (controls.mangroveRestoration / 30) * rollout;
    return boost > 0.3 ? "#2f7a48" : CELL_COLORS.mangrove;
  }
  if (cell.type === "beach" || cell.type === "residentialLow") {
    if ((controls.coastalDevelopment / 30) * rollout > 0.5) return "#b99a6b";
  }
  if (cell.type === "wetland") {
    const loss = (controls.coastalDevelopment / 30) * rollout;
    if (loss > 0.4) return "#a8946a";
  }
  if (indicators && cell.type === "residentialLow" && indicators.floodResilience < 45 && t > 10) {
    return "#c96b42";
  }
  return CELL_COLORS[cell.type];
}

export default function CityMap({ controls, indicators, year, className }: CityMapProps) {
  const t = year - 2026;
  const [hovered, setHovered] = useState<MapCell | null>(null);

  const rows = useMemo(() => staticMap, []);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="field-label">
          Teluk Nusa — town survey · {year}
        </span>
        {hovered && (
          <span className="font-data text-[11px] tracking-[0.08em] uppercase text-muted-foreground truncate">
            {CELL_LABELS[hovered.type]} · elev {hovered.elevationM} m
            {hovered.population > 0 ? ` · pop ~${hovered.population.toLocaleString()}` : ""}
          </span>
        )}
      </div>
      <div className="border border-border bg-card p-3">
        <div className="flex gap-3">
          <div
            className="grid gap-[2px] flex-1"
            style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
          >
            {rows.flatMap((row, y) =>
              row.map((cell) => (
                <Tooltip key={cell.id}>
                  <TooltipTrigger asChild>
                    <motion.button
                      aria-label={`${CELL_LABELS[cell.type]} at ${cell.x}, ${cell.y}`}
                      className="aspect-square border border-border/40 transition-colors duration-500"
                      style={{ backgroundColor: cellColor(cell, controls, indicators, t) }}
                      onHoverStart={() => setHovered(cell)}
                      onHoverEnd={() => setHovered(null)}
                      whileHover={{ scale: 1.5, zIndex: 20, borderColor: "#1C1A16" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="font-data text-[11px] max-w-[220px] bg-card text-card-foreground border-border"
                    sideOffset={8}
                  >
                    <div className="font-semibold font-display">{CELL_LABELS[cell.type]}</div>
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
          <div className="hidden lg:flex flex-col gap-[7px] justify-center pl-1 min-w-[124px]">
            {LEGEND.map(([k, label]) => (
              <div key={k} className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 border border-border/70 shrink-0"
                  style={{ backgroundColor: CELL_COLORS[k] }}
                />
                <span className="text-[11px] font-data text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between px-1 mt-1.5">
          {["W", "", "", "N", "", "", "", "E"].map((l, i) => (
            <span key={i} className="font-data text-[9px] text-muted-foreground/60 tracking-[0.2em]">
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1.5">
        <span className="status-chip">Fictional town · educational model</span>
      </div>
    </div>
  );
}
