/**
 * ECO//SIM — Map annotation lab (internal tool, not linked from the nav)
 *
 * Purpose: the 20×20 zone grid in cityMap.ts claims things the actual
 * illustrated map contradicts (e.g. the river is drawn where the photograph
 * shows houses). This page overlays the REAL map photo with the same 20×20
 * grid the cockpit uses, and lets the user paint what each cell actually
 * contains. The export is fed back to the developer, who rebuilds the grid.
 *
 * Access by URL only: /map-lab
 */
import { useCallback, useMemo, useRef, useState } from "react";
import PageMeta from "@/components/PageMeta";
import { buildCityMap, type CellType } from "@/lib/sim/cityMap";

const MAP_IMAGE = "/storage/teluk-nusa-map-illustrated_e05d6285.png";
const SIZE = 20; // rows & cols, matching cityMap.ts GRID

/** CellType → single export letter (the annotation format). */
const LETTERS_BY_TYPE: Record<CellType, string> = {
  ocean: "O",
  river: "R",
  wetland: "W",
  mangrove: "M",
  beach: "B",
  residential: "H",
  urbanCore: "U",
  highIncome: "V",
  residentialLow: "K",
  industrial: "I",
  agriculture: "G",
  forest: "T",
};

interface PaletteEntry {
  letter: string;
  name: string;
  hint: string;
  color: string;
}

const PALETTE: PaletteEntry[] = [
  { letter: "R", name: "River", hint: "the water channel", color: "#3aa5d8" },
  { letter: "O", name: "Sea / bay", hint: "open water", color: "#1a6da8" },
  { letter: "W", name: "Wetland / marsh", hint: "marshy green flats", color: "#8aa54a" },
  { letter: "M", name: "Mangrove", hint: "dense wetland trees", color: "#1e6e3c" },
  { letter: "B", name: "Beach / sand", hint: "bare sand", color: "#e3c67e" },
  { letter: "H", name: "Houses", hint: "normal housing", color: "#b06a3b" },
  { letter: "U", name: "Town core", hint: "dense center, shops, hall", color: "#c85028" },
  { letter: "V", name: "Villas", hint: "purple roofs, upscale", color: "#7a5aa8" },
  { letter: "K", name: "Kampung", hint: "small / stilt houses", color: "#d89050" },
  { letter: "I", name: "Industry", hint: "warehouses, docks, cranes", color: "#6b6e78" },
  { letter: "G", name: "Fields", hint: "farmland, paddies", color: "#c2c86a" },
  { letter: "T", name: "Forest", hint: "dense trees", color: "#1f5c2e" },
  { letter: ".", name: "Clear", hint: "leave undrawn", color: "transparent" },
];

/**
 * Starting point: the developer's reading of the photograph. The river enters
 * from the WEST edge (rows 8-11 south of the red-roof core), industry at the
 * top-right docks, orange-roof core in the middle, kampung on the southern
 * spit, mangrove headland in the southeast. Fix whatever is wrong — the tool
 * starts from this draft, not from square one.
 */
const DRAFT: string[] = [
  /* r00 */ "TTTTTGGHHHIIIBOOOOOO",
  /* r01 */ "TTTTTGGHHHIIIBBOOOOO",
  /* r02 */ "TTTTTGHVVVVIIBOOOOOO",
  /* r03 */ "TTTTGGHVVVVIIBBOOOOO",
  /* r04 */ "TTGGGHHHVVVGBBOOOOOO",
  /* r05 */ "GGGGUUUUUUGGBBOOOOOO",
  /* r06 */ "GGGUUUUUUUGWBBOOOOOO",
  /* r07 */ "GGGGUUUUUUGGGBBOOOOO",
  /* r08 */ "GRRRGGUUUUUWWBOOOOOO",
  /* r09 */ "RRRRUUUUUUWWWBOOOOOO",
  /* r10 */ "GGGRRRRRRRRWBBOOOOOO",
  /* r11 */ "GGGGRRRRRRWWWBOOOOOO",
  /* r12 */ "GGGGHHHHHWWWWOOOOOOO",
  /* r13 */ "GGGGHHHHHHWWMOOOOOOO",
  /* r14 */ "GGGGKKKKKKWMMOOOOOOO",
  /* r15 */ "GGGGKKKKKKKMMMOOOOOO",
  /* r16 */ "GGGGKKKKKKKMMMOOOOOO",
  /* r17 */ "GGGGKKKKKKKKMMOOOOOO",
  /* r18 */ "GGGGGOOOOOOOMMMOOOOO",
  /* r19 */ "GGGGGOOOOOOOMMOOOOOO",
];

const BLANK = (): string[] => Array.from({ length: SIZE }, () => ".".repeat(SIZE));

function lettersFromLiveGrid(): string[] {
  return buildCityMap().map((row) => row.map((cell) => LETTERS_BY_TYPE[cell.type]).join(""));
}

export default function MapLab() {
  const [rows, setRows] = useState<string[]>(DRAFT);
  const [brush, setBrush] = useState("R");
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const painting = useRef(false);

  const liveGrid = useMemo(() => lettersFromLiveGrid(), []);

  const paint = useCallback(
    (r: number, c: number) => {
      setRows((prev) => {
        if (prev[r][c] === brush) return prev;
        const row = prev[r].split("");
        row[c] = brush;
        const next = [...prev];
        next[r] = row.join("");
        return next;
      });
    },
    [brush],
  );

  const cellFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const c = Math.min(SIZE - 1, Math.max(0, Math.floor(((e.clientX - box.left) / box.width) * SIZE)));
    const r = Math.min(SIZE - 1, Math.max(0, Math.floor(((e.clientY - box.top) / box.height) * SIZE)));
    return { r, c };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    painting.current = true;
    const { r, c } = cellFromEvent(e);
    paint(r, c);
    setHover({ r, c });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { r, c } = cellFromEvent(e);
    setHover({ r, c });
    if (painting.current) paint(r, c);
  };

  const endPaint = () => {
    painting.current = false;
  };

  const copyForDev = async () => {
    try {
      await navigator.clipboard.writeText(rows.join("\n"));
    } catch {
      /* clipboard refused — the textarea below is selectable as fallback */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const paletteName = (letter: string): string =>
    PALETTE.find((p) => p.letter === letter)?.name ?? letter;

  const exportText = useMemo(() => rows.join("\n"), [rows]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageMeta title="ECO//SIM — map lab" description="Internal: annotate the real map photo for the town grid." />
      <div className="max-w-[1050px] mx-auto px-6 py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight">
            Map lab <span className="text-vermilion">·</span> grid annotation
          </h1>
          <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            internal · not part of the study
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-2xl">
          The cockpit's 20×20 grid is drawn from code, and the code disagrees with the
          photograph. Paint what each cell <em>actually</em> shows, then press{" "}
          <span className="font-data">Copy annotation</span> and paste the result back to the
          developer. Rows run <span className="font-data">00–19</span> top to bottom, columns{" "}
          <span className="font-data">00–19</span> left to right. Each cell is 5% of the image.
          Ignore the drawn compass and legend insets in the bottom-left. It starts from the
          developer's draft — only fix the wrong cells.
        </p>

        {/* Palette */}
        <div className="mt-5 border border-border bg-card">
          <div className="px-4 py-2 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              Brush — pick a type, then draw on the photo (click or drag)
            </span>
            <span className="font-data text-[11px] text-muted-foreground">
              painting: <span className="text-foreground font-semibold">{paletteName(brush)}</span>
              {hover && (
                <>
                  {" · "}
                  <span className="font-data tabular-nums">
                    R{String(hover.r).padStart(2, "0")} C{String(hover.c).padStart(2, "0")}
                  </span>
                  {" — cell is "}
                  <span className="font-data tabular-nums">{rows[hover.r][hover.c] === "." ? "empty" : paletteName(rows[hover.r][hover.c])}</span>
                </>
              )}
            </span>
          </div>
          <div className="p-3 flex flex-wrap gap-1.5">
            {PALETTE.map((p) => (
              <button
                key={p.letter}
                onClick={() => setBrush(p.letter)}
                className={`btn-press inline-flex items-center gap-2 border px-2.5 py-1.5 text-left transition-colors ${
                  brush === p.letter ? "border-vermilion bg-secondary" : "border-border hover:border-foreground/40"
                }`}
                title={p.hint}
              >
                <span
                  className="inline-block w-3.5 h-3.5 shrink-0 border border-border/40"
                  style={{ backgroundColor: p.color === "transparent" ? "transparent" : p.color, opacity: 0.85 }}
                  aria-hidden="true"
                />
                <span className="font-data text-[11px] font-semibold tabular-nums w-3">{p.letter}</span>
                <span className="text-[12px] leading-tight">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stage: the real photo + the same 20×20 cell geometry the cockpit uses */}
        <div
          className="relative aspect-[4/3] w-full select-none border border-border bg-card mt-4 cursor-crosshair touch-none overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPaint}
          onPointerCancel={endPaint}
        >
          <img
            src={MAP_IMAGE}
            alt="Illustrated field map of fictional Teluk Nusa"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          {/* Painted cells + grid hairlines */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {rows.map((row, r) =>
              row.split("").map((letter, c) => {
                const entry = PALETTE.find((p) => p.letter === letter);
                if (!entry || entry.color === "transparent") return null;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={(c / SIZE) * 100}
                    y={(r / SIZE) * 100}
                    width={100 / SIZE}
                    height={100 / SIZE}
                    fill={entry.color}
                    opacity={0.55}
                  />
                );
              }),
            )}
            {Array.from({ length: SIZE - 1 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={((i + 1) / SIZE) * 100}
                y1={0}
                x2={((i + 1) / SIZE) * 100}
                y2={100}
                stroke="rgba(0,0,0,0.45)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {Array.from({ length: SIZE - 1 }, (_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={((i + 1) / SIZE) * 100}
                x2={100}
                y2={((i + 1) / SIZE) * 100}
                stroke="rgba(0,0,0,0.45)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {/* Hover outline */}
          {hover && (
            <div
              className="pointer-events-none absolute border-2 border-white/90 outline outline-1 outline-black/50"
              style={{
                width: `${100 / SIZE}%`,
                height: `${100 / SIZE}%`,
                left: `${(hover.c / SIZE) * 100}%`,
                top: `${(hover.r / SIZE) * 100}%`,
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button onClick={copyForDev} className="btn btn-primary">
            {copied ? "Copied ✓" : "Copy annotation"}
          </button>
          <button onClick={() => setRows(DRAFT)} className="btn btn-quiet">
            Back to the developer's draft
          </button>
          <button onClick={() => setRows(liveGrid)} className="btn btn-quiet">
            Load the live site's grid
          </button>
          <button onClick={() => setRows(BLANK())} className="btn btn-quiet">
            Wipe blank
          </button>
        </div>

        {/* Export */}
        <div className="mt-4">
          <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-1.5">
            Annotation (20 rows × 20 columns) — paste everything below back
          </div>
          <textarea
            value={exportText}
            readOnly
            rows={SIZE}
            className="w-full font-data text-[12px] leading-snug tabular-nums bg-card border border-border p-3 outline-none focus:border-ring"
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      </div>
    </div>
  );
}
