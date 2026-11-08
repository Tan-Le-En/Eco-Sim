/**
 * ECO//SIM — City map (20×20 tile grid, Editorial Field Study v4)
 * PERFORMANCE: single <svg> with 400 <rect> elements updated via inline
 * styles + CSS transitions. Hover state stores cell indices (never layout
 * reads) and only updates when the hovered cell changes, so scanning the
 * map stays at 60fps while dragging sliders or running years.
 *
 * HONESTY (v4): the base layer is a real photograph, so the hover readout
 * reports only overlay *semantics* — what the tint means for the town
 * ("Mangrove restored — less surge, more fish"). No invented elevations or
 * population figures, which the photo cannot support.
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

// Overlay semantics — one line each, no invented data.
const TAG_LOW_WATER = "Low water — drought risk";
const TAG_MANGROVE = "Mangrove restored — less surge, more fish";
const TAG_COAST = "Coast built over — habitat loss";
const TAG_WETLAND = "Wetland filled — buffering drops";
const TAG_FLOOD = "Flood-prone kampung — protect first";

// Swatches shown in the legend. One per fill the overlays can paint,
// so the legend never lies about what is on screen.
const OVERLAY_LEGEND: [string, string][] = [
  ["rgba(185,145,100,0.65)", "Low water — drought"],
  ["rgba(34,120,60,0.55)", "Mangrove restored"],
  ["rgba(185,154,107,0.6)", "Coast built over"],
  ["rgba(201,107,66,0.55)", "Flood-prone kampung"],
];

/** Overlay fill + hover tag for one cell. Fills match the legend exactly. */
function overlayFor(
  cell: MapCell,
  controls: Controls,
  indicators: Indicators | null,
  t: number
): { fill: string; tag?: string } {
  const rollout = Math.min(1, t / 10);
  const isLate = t > 18; // near 2050: overlays deepen for the consequence reveal
  const intensity = isLate ? 0.75 : 0.55;

  // River corridor: the photograph already shows the water — no tint while
  // it is healthy. Only the drought excursion gets painted (muddy low water).
  if (cell.type === "river") {
    if (indicators && indicators.waterSecurity < 45) {
      return { fill: "rgba(185,145,100,0.65)", tag: TAG_LOW_WATER };
    }
    return { fill: "transparent" };
  }

  // Flood consequence takes precedence on kampung cells: the stakes outrank the build
  if (
    indicators &&
    cell.type === "residentialLow" &&
    indicators.floodResilience < 45 &&
    t > 10
  ) {
    return { fill: `rgba(201,107,66,${isLate ? 0.7 : 0.55})`, tag: TAG_FLOOD };
  }

  // Mangrove restoration: green overlay grows with investment
  if (cell.type === "mangrove") {
    const boost = (controls.mangroveRestoration / 30) * rollout;
    if (boost > 0.3) {
      return {
        fill: `rgba(34,120,60,${boost > 0.7 && isLate ? 0.7 : intensity})`,
        tag: TAG_MANGROVE,
      };
    }
  }

  // Coastal development: built-over tint shares one color for beach, kampung, wetland
  if (cell.type === "beach" || cell.type === "residentialLow") {
    if ((controls.coastalDevelopment / 30) * rollout > 0.5) {
      return {
        fill: `rgba(185,154,107,${isLate ? 0.7 : 0.6})`,
        tag: TAG_COAST,
      };
    }
  }
  if (cell.type === "wetland") {
    if ((controls.coastalDevelopment / 30) * rollout > 0.4) {
      return {
        fill: `rgba(185,154,107,${isLate ? 0.65 : 0.55})`,
        tag: TAG_WETLAND,
      };
    }
  }

  return { fill: "transparent" };
}

interface HoverInfo {
  cell: MapCell;
  col: number;
  row: number;
}

export default function CityMap({
  controls,
  indicators,
  year,
  className,
}: CityMapProps) {
  const t = year - 2026;
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const hoverCell = useRef<string | null>(null);
  // Grid geometry + tint fills + tags are recomputed only when the inputs
  // change (never per pointer move).
  const cells = useMemo(() => {
    const out: {
      key: string;
      x: number;
      y: number;
      fill: string;
      tag?: string;
    }[] = [];
    const tags = new Map<string, string | undefined>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = staticMap[r][c];
        const { fill, tag } = overlayFor(cell, controls, indicators, t);
        out.push({
          key: cell.id,
          x: (c / COLS) * 100,
          y: (r / ROWS) * 100,
          fill,
          tag,
        });
        tags.set(cell.id, tag);
      }
    }
    return out;
  }, [controls, indicators, t]);
  const tagsById = useMemo(() => {
    const m = new Map<string, string | undefined>();
    for (const c of cells) m.set(c.key, c.tag);
    return m;
  }, [cells]);

  const cellWidth = 100 / COLS;
  const cellHeight = 100 / ROWS;

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
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
  }, []);

  const onLeave = useCallback(() => {
    hoverCell.current = null;
    setHover(null);
  }, []);

  // Hover readout: what the overlay says about this cell — never fabricated
  // numbers the photograph can't support.
  const hoverText = hover
    ? (tagsById.get(hover.cell.id) ?? CELL_LABELS[hover.cell.type])
    : "Pointer over map to survey";

  return (
    <div className={`${className ?? ""} w-full`}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
          Town Survey
        </span>
        <span className="font-data text-[11px] tracking-[0.08em] uppercase text-muted-foreground truncate hidden sm:block">
          {hoverText}
        </span>
      </div>
      <div className="border border-border bg-card p-1.5 overflow-hidden">
        {/* Stage locked to the photo's native 4:3 aspect (the file is 1920×1440):
            object-cover then shows the whole picture at every size, so a grid
            cell always refers to the same place on the map. */}
        <div
          className="relative select-none w-full aspect-[4/3] bg-[oklch(0.88_0.02_80)] dark:bg-[oklch(0.25_0.015_75)]"
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
            {cells.map(r => (
              <rect
                key={r.key}
                x={r.x}
                y={r.y}
                width={cellWidth}
                height={cellHeight}
                fill={r.fill}
                style={{ transition: "fill 120ms ease" }}
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
      {/* Overlay legend — exactly the fills the overlays can paint */}
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        {OVERLAY_LEGEND.map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 shrink-0 border border-border/40"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="font-data text-[10px] tracking-[0.08em] uppercase text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
