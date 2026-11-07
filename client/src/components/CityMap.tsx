/**
 * ECO//SIM — City map (20×20 tile grid, Editorial Field Study v3)
 * PERFORMANCE: single <svg> with 400 <rect> elements updated via inline
 * styles + CSS transitions. Hover state stores cell indices (never layout
 * reads) and only updates when the hovered cell changes, so scanning the
 * map stays at 60fps while dragging sliders or running years.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import { buildCityMap, CELL_LABELS, MapCell } from "@/lib/sim/cityMap";
import { Controls, Indicators } from "@/lib/sim/types";

const ILLUSTRATED_MAP = "/storage/teluk-nusa-map-illustrated_e05d6285.png";

interface CityMapProps {
  controls: Controls;
  indicators: Indicators | null;
  year: number;
  className?: string;
}

const staticMap = buildCityMap();
const COLS = staticMap[0].length;
const ROWS = staticMap.length;

// Colored swatches shown on the illustrated base map. The fills match the
// default-intensity colors returned by overlayTint so the legend doesn't lie.
const OVERLAY_LEGEND: [string, string][] = [
  ["rgba(47,157,191,0.65)", "Sungai Kedah (River)"],
  ["rgba(34,120,60,0.55)", "Mangrove restored"],
  ["rgba(185,154,107,0.6)", "Coast built over"],
  ["rgba(201,107,66,0.55)", "Flood-prone kampung"],
];

/** Overlay tint for the illustrated base map: near-transparent so the map
 *  shows through, with colored tints only where the data changes something. */
function overlayTint(cell: MapCell, controls: Controls, indicators: Indicators | null, t: number): string {
  const rollout = Math.min(1, t / 10);
  const isLate = t > 18; // near 2050: overlays become more dramatic for the consequence reveal
  const intensity = isLate ? 0.75 : 0.55;

  // River corridor: Sungai Kedah
  if (cell.type === "river") {
    if (indicators && indicators.waterSecurity < 45) {
      return "rgba(185,145,100,0.65)"; // dry / muddy in drought
    }
    return "rgba(47,157,191,0.65)"; // clear river water
  }

  // Mangrove restoration: green overlay grows with investment
  if (cell.type === "mangrove") {
    const boost = (controls.mangroveRestoration / 30) * rollout;
    if (boost > 0.3) return `rgba(34,120,60,${boost > 0.7 && isLate ? 0.7 : intensity})`;
  }

  // Coastal development: brown overlay shows built-over coast
  if (cell.type === "beach" || cell.type === "residentialLow") {
    if ((controls.coastalDevelopment / 30) * rollout > 0.5) return `rgba(185,154,107,${isLate ? 0.7 : 0.6})`;
  }
  if (cell.type === "wetland") {
    if ((controls.coastalDevelopment / 30) * rollout > 0.4) return `rgba(168,148,106,${isLate ? 0.65 : 0.55})`;
  }

  // Flood consequence: orange-red overlay on low-resilience areas near 2050
  if (indicators && cell.type === "residentialLow" && indicators.floodResilience < 45 && t > 10) {
    return `rgba(201,107,66,${isLate ? 0.7 : 0.55})`;
  }
  return "transparent";
}

interface HoverInfo {
  cell: MapCell;
  col: number;
  row: number;
}

export default function CityMap({ controls, indicators, year, className }: CityMapProps) {
  const t = year - 2026;
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const hoverCell = useRef<string | null>(null);
  // Grid geometry + tint fills are recomputed only when the inputs change
  // (never per pointer move).
  const cells = useMemo(() => {
    const out: { key: string; x: number; y: number; cell: MapCell; fill: string }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = staticMap[r][c];
        out.push({
          key: cell.id,
          x: (c / COLS) * 100,
          y: (r / ROWS) * 100,
          cell,
          fill: overlayTint(cell, controls, indicators, t),
        });
      }
    }
    return out;
  }, [controls, indicators, t]);

  const cellWidth = 100 / COLS;
  const cellHeight = 100 / ROWS;

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const c = Math.min(COLS - 1, Math.max(0, Math.floor(px * COLS)));
      const r = Math.min(ROWS - 1, Math.max(0, Math.floor(py * ROWS)));
      const cell = staticMap[r][c];
      if (hoverCell.current === cell.id) return; // same cell: no state churn
      hoverCell.current = cell.id;
      setHover({ cell, col: c, row: r });
    },
    [],
  );

  const onLeave = useCallback(() => {
    hoverCell.current = null;
    setHover(null);
  }, []);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
          Town Survey · {year}
        </span>
        <span className="font-data text-[11px] tracking-[0.08em] uppercase text-muted-foreground truncate hidden sm:block">
          {hover
            ? `${CELL_LABELS[hover.cell.type]} · elev ${hover.cell.elevationM} m${hover.cell.population > 0 ? ` · pop ~${hover.cell.population.toLocaleString()}` : ""}`
            : "Pointer over map to survey"}
        </span>
      </div>
      <div className="border border-border bg-card p-1.5 overflow-hidden">
        <div
          className="relative select-none aspect-[4/3] min-h-[180px] bg-[oklch(0.88_0.02_80)] dark:bg-[oklch(0.25_0.015_75)]"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          {/* Base layer: illustrated field map of Teluk Nusa */}
          <img
            src={ILLUSTRATED_MAP}
            alt="Aerial photograph of Teluk Nusa — estuary, coastal settlement, and forest"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ background: "oklch(0.88 0.02 80)" }}
          />
          {/* Data layer: zone overlay tints driven by controls & indicators */}
          <svg
            viewBox={`0 0 100 100`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            role="img"
            aria-label="Town data overlay on the map of fictional Teluk Nusa"
          >
            {cells.map((r) => (
              <rect
                key={r.key}
                x={r.x + cellWidth * 0.04}
                y={r.y + cellHeight * 0.04}
                width={cellWidth * 0.92}
                height={cellHeight * 0.92}
                fill={r.fill}
                style={{ transition: "fill 500ms ease" }}
              />
            ))}
          </svg>
          {/* Hover indicator: thin outline cell, positioned from stored indices */}
          {hover && (
            <div
              className="pointer-events-none absolute border border-foreground/80 bg-foreground/10"
              style={{
                width: `${cellWidth}%`,
                height: `${cellHeight}%`,
                left: `${(hover.col / COLS) * 100}%`,
                top: `${(hover.row / ROWS) * 100}%`,
              }}
            />
          )}
        </div>
      </div>
      {/* Overlay legend */}
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        {OVERLAY_LEGEND.map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 shrink-0 border border-border/40" style={{ backgroundColor: color }} aria-hidden="true" />
            <span className="font-data text-[10px] tracking-[0.08em] uppercase text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
