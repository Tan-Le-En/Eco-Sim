/**
 * ECO//SIM — City map (20×20 grid)
 * v5: the zone grid is no longer drawn by formulas — it is a transcription
 * of the ACTUAL illustrated map photo, painted cell-by-cell in the internal
 * annotation lab (/map-lab) and transcribed verbatim below. Rows run
 * top→bottom, columns left→right; one letter per cell:
 *   O sea/bay  R river  W wetlands  M mangrove  B beach/sand
 *   H houses   U town core  V villas  K kampung  I industry
 *   G fields   T forest
 * Geography per the annotated photo: forest hill along the north from the
 * west edge; industrial docks top-right; residential band below them;
 * orange-roof town core in the center, threaded by the Sungai Nusa, which
 * enters from the WEST edge and exits southeast through wetlands/mangrove
 * into the bay; kampung on the southern sand spit; mangrove headland
 * reaching the water in the southeast; agricultural flanks and sand flats
 * in the southwest (the drawn compass/legend insets are left alone).
 * All values are fictional educational-model assumptions.
 */

export type CellType =
  | "ocean"
  | "mangrove"
  | "wetland"
  | "river"
  | "beach"
  | "urbanCore"
  | "residential"
  | "residentialLow"
  | "highIncome"
  | "industrial"
  | "agriculture"
  | "forest";

export interface MapCell {
  id: string;
  x: number;
  y: number;
  type: CellType;
  elevationM: number;
  population: number;
  incomeGroup: "low" | "mid" | "high";
  greenCover: number;
  imperviousSurface: number;
  floodExposure: number;
  biodiversityValue: number;
}

const GRID = 20;

/**
 * The annotated map, transcribed verbatim from the /map-lab export
 * (verified: 20 rows × 20 columns, no empty cells). This is the single
 * source of truth for what is where in Teluk Nusa.
 */
export const ANNOTATED_ROWS: string[] = [
  /* r00 */ "TTTTTTTTBBBBBBOOOOOO",
  /* r01 */ "TTTTTTTTHHHHBOOOOOOO",
  /* r02 */ "TTTTTTTTHHHIIOOOOOOO",
  /* r03 */ "TTTTTTTTHHHIIIIOOOOO",
  /* r04 */ "TTTTTTTHHHHIIIIIOOOO",
  /* r05 */ "TTTTTTUUUHHIIBOOOOOO",
  /* r06 */ "TTTTTUUUUUHWBBOOOOOO",
  /* r07 */ "RGTTUUUUUUWWBOOOOOOO",
  /* r08 */ "GRGGUUUUUUWWBOOOOOOO",
  /* r09 */ "GGRRRRUUUUWWBBOOOOOO",
  /* r10 */ "GGGGGRRRURRWWBBOOOOO",
  /* r11 */ "GGGGGURRRRMRWWBOOOOO",
  /* r12 */ "GGGGGUUUUMMMRRROOOOO",
  /* r13 */ "BBGGGGUUKKMMMMMMOOOO",
  /* r14 */ "BBBBGKKKKKKMMMMMOOOO",
  /* r15 */ "BBBBBKKKKKKKMMMMMOOO",
  /* r16 */ "BBBBBKKOOOOOKMMMMOOO",
  /* r17 */ "BBBBBBOOOOOOOOMMMMOO",
  /* r18 */ "BBBBBOOOOOOOOOOOOOOO",
  /* r19 */ "BBBBBOOOOOOOOOOOOOOO",
];

/** Export letter → zone type (mirror of the palette in /map-lab). */
const TYPE_BY_LETTER: Record<string, CellType> = {
  O: "ocean",
  R: "river",
  W: "wetland",
  M: "mangrove",
  B: "beach",
  H: "residential",
  U: "urbanCore",
  V: "highIncome",
  K: "residentialLow",
  I: "industrial",
  G: "agriculture",
  T: "forest",
};

/** Parsed once at module load: CELL_TYPES[row][col]. */
const CELL_TYPES: CellType[][] = ANNOTATED_ROWS.map((row) =>
  row
    .split("")
    .map((letter) => TYPE_BY_LETTER[letter] ?? "residential"),
);

// Deterministic pseudo-random for stable map layout (simple LCG)
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** The annotated photo is the truth: a cell simply is what was painted. */
function cellTypeFor(x: number, y: number): CellType {
  return CELL_TYPES[y][x];
}

function elevationFor(x: number, y: number, type: CellType): number {
  if (type === "ocean") return -4;
  if (type === "beach") return 1.2;
  if (type === "mangrove" || type === "wetland") return 0.9;
  if (type === "river") return 0.2;
  // general rise toward north-west
  return Math.min(12, 0.8 + (19 - x) * 0.18 + (19 - y) * 0.15);
}

function floodExposureFor(_x: number, _y: number, type: CellType): number {
  if (type === "ocean") return 0;
  if (type === "river") return 0.5;
  if (type === "mangrove" || type === "wetland") return 0.8;
  if (type === "beach") return 0.75;
  if (type === "residentialLow") return 0.82;
  if (type === "residential") return 0.5;
  if (type === "urbanCore") return 0.35;
  if (type === "industrial") return 0.4;
  return 0.1;
}

function biodiversityFor(type: CellType): number {
  switch (type) {
    case "ocean":
      return 0.25;
    case "mangrove":
      return 0.92;
    case "wetland":
      return 0.8;
    case "forest":
      return 0.95;
    case "river":
      return 0.55;
    case "agriculture":
      return 0.2;
    case "beach":
      return 0.35;
    case "urbanCore":
      return 0.08;
    case "industrial":
      return 0.05;
    case "residential":
      return 0.15;
    case "residentialLow":
      return 0.12;
    case "highIncome":
      return 0.2;
  }
}

/** Build the full 20×20 map with deterministic noise. */
export function buildCityMap(): MapCell[][] {
  const rng = makeRng(2050);
  const grid: MapCell[][] = [];
  for (let y = 0; y < GRID; y++) {
    const row: MapCell[] = [];
    for (let x = 0; x < GRID; x++) {
      const type = cellTypeFor(x, y);
      const noise = rng() * 0.3 - 0.15;
      row.push({
        id: `cell_${String(x).padStart(2, "0")}_${String(y).padStart(2, "0")}`,
        x,
        y,
        type,
        elevationM: Number((elevationFor(x, y, type) + noise * 0.4).toFixed(1)),
        population: populationFor(type, x, y),
        incomeGroup:
          type === "residentialLow" ? "low" : type === "highIncome" ? "high" : "mid",
        greenCover: greenCoverFor(type, rng),
        imperviousSurface: imperviousFor(type),
        floodExposure: Number(floodExposureFor(x, y, type).toFixed(2)),
        biodiversityValue: Number(biodiversityFor(type).toFixed(2)),
      });
    }
    grid.push(row);
  }
  return grid;
}

function populationFor(type: CellType, x: number, y: number): number {
  switch (type) {
    case "urbanCore":
      return 12000;
    case "residential":
      return 7000 + ((x * 7 + y * 13) % 5000);
    case "residentialLow":
      return 8500;
    case "highIncome":
      return 4500;
    case "industrial":
      return 600;
    case "agriculture":
      return 900;
    default:
      return 0;
  }
}

function greenCoverFor(type: CellType, rng: () => number): number {
  switch (type) {
    case "forest":
    case "mangrove":
      return 0.9;
    case "wetland":
      return 0.7;
    case "agriculture":
      return 0.75;
    case "beach":
      return 0.3;
    case "river":
      return 0;
    case "ocean":
      return 0;
    case "urbanCore":
      return 0.08;
    case "residential":
      return 0.12 + rng() * 0.1;
    case "residentialLow":
      return 0.06 + rng() * 0.06;
    case "highIncome":
      return 0.35 + rng() * 0.1;
    case "industrial":
      return 0.03;
  }
}

function imperviousFor(type: CellType): number {
  switch (type) {
    case "urbanCore":
      return 0.85;
    case "residential":
      return 0.7;
    case "residentialLow":
      return 0.78;
    case "highIncome":
      return 0.5;
    case "industrial":
      return 0.9;
    case "agriculture":
      return 0.1;
    case "forest":
    case "mangrove":
    case "wetland":
      return 0.0;
    case "river":
    case "ocean":
      return 0.0;
    case "beach":
      return 0.05;
  }
}

export const CELL_COLORS: Record<CellType, string> = {
  ocean: "#2f9dbf",
  river: "#5bb8d6",
  mangrove: "#3fa466",
  wetland: "#7cc58f",
  beach: "#f0dba3",
  forest: "#2f8f52",
  urbanCore: "#e8864a",
  residential: "#c9a87e",
  residentialLow: "#d9a05c",
  highIncome: "#b79ad4",
  industrial: "#93a3b8",
  agriculture: "#c5d46a",
};

export const CELL_LABELS: Record<CellType, string> = {
  ocean: "Laut (Sea)",
  river: "Sungai Nusa (River)",
  mangrove: "Bakau (Mangrove)",
  wetland: "Wetlands",
  beach: "Pantai (Beach)",
  forest: "Hutan (Forest)",
  urbanCore: "Pusat bandar (City core)",
  residential: "Houses",
  residentialLow: "Kampung houses",
  highIncome: "Taman houses",
  industrial: "Kilang (Factory)",
  agriculture: "Kebun (Farmland)",
};
