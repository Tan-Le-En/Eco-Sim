/**
 * ECO//SIM — City map (20×20 grid)
 * Style note: generated deterministic zone map of fictional Nusa Bay.
 * Geography matches the illustrated field map: SEA on the EAST forming a
 * protected bay (teluk) curving into the south; MANGROVE belt hugging the
 * southeast shore; RIVER flowing west→east through the middle and emptying
 * into the bay, WETLANDS around the mouth; URBAN CORE center-west;
 * INDUSTRIAL zone north near the docks; KAMPUNG (low-income) houses on the
 * southern coast; FARMLAND far west; FOREST hill rising in the northwest.
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
  | "forest"
  | "park";

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

// Deterministic pseudo-random for stable map layout (simple LCG)
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** River path: x from 0..19, river y-center per column (wavy, crosses the city). */
function riverY(x: number): number {
  return 6 + 4 * Math.sin((x / 19) * Math.PI * 1.6 + 0.5) + 0.4 * Math.sin(x * 2.3);
}

function cellTypeFor(x: number, y: number): CellType {
  const r = riverY(x);

  // ── Sea: the bay curves into the southeast corner ──
  const seaEdge = 16 + 3 * Math.sin(((y - 11) / 9) * Math.PI * 0.5 + 0.9); // curves landward below y=11
  if (y >= 11 && x >= seaEdge) return "ocean";
  if (x >= 19 && y <= 10) return "ocean"; // open water north-east

  // ── Beach: coastal fringe on land side of the sea ──
  if (y >= 11 && x === Math.max(0, Math.floor(seaEdge) - 1)) return "beach";
  if (x >= 18 && y >= 4 && y <= 10) return "beach"; // north-east beach

  // ── River band (±0.9 around river path) ──
  if (Math.abs(y - r) < 0.9) return "river";

  // ── Wetlands: lowlands around the river mouth ──
  if (x >= 12 && y >= 9 && y <= 14 && x < seaEdge - 2) return "wetland";
  if (x >= 11 && y >= 11 && y <= 13) return "wetland";

  // ── Mangrove belt: hugging the southeast shore ──
  if (x >= 13 && y >= 12 && y <= 15 && x < seaEdge) return "mangrove";
  if (x >= 12 && (y === 13 || y === 14)) return "mangrove";

  // ── Forest hill: northwest corner, rising elevation ──
  if (x <= 3 && y <= 4) return "forest";
  if (x <= 4 && y <= 6 && x + y <= 9) return "forest";
  if (x === 5 && y <= 3) return "forest";

  // ── Farmland: western strip and northern fields ──
  if (x <= 2) return "agriculture";
  if (y === 0 && x >= 4 && x <= 14) return "agriculture";
  if (x === 3 && y === 0) return "agriculture";

  // ── Industrial zone: northeast near the docks ──
  if (x >= 11 && x <= 15 && y <= 3) return "industrial";
  if (x >= 16 && y <= 3) return "industrial";

  // ── Urban core: center-west ──
  if (x >= 5 && x <= 9 && y >= 6 && y <= 10) return "urbanCore";

  // ── Upscale district: north-central, higher ground ──
  if (x >= 7 && x <= 11 && y >= 3 && y <= 5) return "highIncome";

  // ── Kampung settlement: southern coastal edge (highest flood exposure) ──
  if (y >= 17) return "residentialLow";
  if (x >= 14 && y >= 15) return "residentialLow";

  // Residential fills the rest
  return "residential";
}

function elevationFor(x: number, y: number, type: CellType): number {
  if (type === "ocean") return -4;
  if (type === "beach") return 1.2;
  if (type === "mangrove" || type === "wetland") return 0.9;
  if (type === "river") return 0.2;
  // general rise toward north-west
  return Math.min(12, 0.8 + (19 - x) * 0.18 + (19 - y) * 0.15);
}

function floodExposureFor(x: number, y: number, type: CellType): number {
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
    case "park":
      return 0.6;
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
    case "park":
      return 0;
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
    case "park":
      return 0.85;
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
    case "park":
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
  park: "#8fd48f",
  urbanCore: "#e8864a",
  residential: "#c9a87e",
  residentialLow: "#d9a05c",
  highIncome: "#b79ad4",
  industrial: "#93a3b8",
  agriculture: "#c5d46a",
};

export const CELL_LABELS: Record<CellType, string> = {
  ocean: "Laut (Sea)",
  river: "Sungai (River)",
  mangrove: "Bakau (Mangrove)",
  wetland: "Wetlands",
  beach: "Pantai (Beach)",
  forest: "Hutan (Forest)",
  park: "Park",
  urbanCore: "Pusat bandar (City core)",
  residential: "Houses",
  residentialLow: "Kampung houses",
  highIncome: "Taman houses",
  industrial: "Kilang (Factory)",
  agriculture: "Kebun (Farmland)",
};
