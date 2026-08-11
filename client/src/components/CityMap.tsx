/**
 * ECO//SIM — City map (20×20 tile grid, Editorial Field Study v3)
 * PERFORMANCE: single <svg> with 400 <rect> elements updated via inline
 * styles + CSS transitions. No 400 framer-motion buttons, no per-cell
 * React components. Tooltip tracks pointer position in a single overlay.
 * This keeps playback at 60fps while dragging sliders or running years.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import { buildCityMap, CELL_COLORS, CELL_LABELS, MapCell } from "@/lib/sim/cityMap";
import { Controls, Indicators } from "@/lib/sim/types";

interface CityMapProps {
  controls: Controls;
  indicators: Indicators | null;
  year: number;
  className?: string;
}

const staticMap = buildCityMap();
const SIZE = 20;
const COLS = staticMap[0].length;
const ROWS = staticMap.length;

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

interface HoverInfo {
  x: number;
  y: number;
  cell: MapCell;
}

export default function CityMap({ controls, indicators, year, className }: CityMapProps) {
  const t = year - 2026;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);

  // Pre-compute rects once; colors come from CSS custom updates only.
  const rects = useMemo(() => {
    const out: { key: string; x: number; y: number; cell: MapCell }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = staticMap[r][c];
        out.push({
          key: cell.id,
          x: (c / COLS) * 100,
          y: (r / ROWS) * 100,
          cell,
        });
      }
    }
    return out;
  }, []);

  const cellWidth = 100 / COLS;
  const cellHeight = 100 / ROWS;

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const c = Math.min(COLS - 1, Math.max(0, Math.floor(px * COLS)));
    const r = Math.min(ROWS - 1, Math.max(0, Math.floor(py * ROWS)));
    const cell = staticMap[r][c];
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, cell });
  }, []);

  const onLeave = useCallback(() => setHover(null), []);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="field-label">
          Teluk Nusa — town survey · {year}
        </span>
        <span className="font-data text-[11px] tracking-[0.08em] uppercase text-muted-foreground truncate hidden sm:block">
          {hover ? `${CELL_LABELS[hover.cell.type]} · elev ${hover.cell.elevationM} m${hover.cell.population > 0 ? ` · pop ~${hover.cell.population.toLocaleString()}` : ""}` : "Move the pointer over the town"}
        </span>
      </div>
      <div className="border border-border bg-card p-3">
        <div className="flex gap-3">
          <div
            ref={containerRef}
            className="relative flex-1 select-none"
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            <svg
              viewBox={`0 0 100 100`}
              preserveAspectRatio="none"
              className="w-full h-auto block"
              role="img"
              aria-label="Town map of fictional Teluk Nusa"
            >
              {rects.map((r) => (
                <rect
                  key={r.key}
                  x={r.x + cellWidth * 0.04}
                  y={r.y + cellHeight * 0.04}
                  width={cellWidth * 0.92}
                  height={cellHeight * 0.92}
                  fill={cellColor(r.cell, controls, indicators, t)}
                  style={{ transition: "fill 500ms ease" }}
                />
              ))}
            </svg>
            {/* Hover indicator: thin outline cell */}
            {hover && (
              <div
                className="pointer-events-none absolute w-[6%] h-[6%] border border-foreground/80 bg-foreground/10"
                style={{
                  left: `${((hover.x / containerRef.current!.getBoundingClientRect().width) * 100 / cellWidth) * cellWidth}%`,
                  top: `${((hover.y / containerRef.current!.getBoundingClientRect().height) * 100 / cellHeight) * cellHeight}%`,
                }}
              />
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
