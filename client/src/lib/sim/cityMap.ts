/**
 * ECO//SIM — City map (20×20 grid)
 * Style note: generated deterministic zone map of fictional Nusa Bay.
 * Coastline on the EASTERN side (x = 19), river crossing the city,
 * wetlands + mangrove belt along the coast, urban core in the center-west,
 * industrial zone north, low-income settlement south, agricultural edge west.
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
  const coastX = 19;
  const r = riverY(x);

  // Ocean: easternmost columns beyond coast
  if (x >= 18 && y > 14) return "ocean";
  if (x >= 19) return "ocean";

  // River band (±0.9 around river path)
  if (Math.abs(y - r) < 0.9) return "river";

  // Mangrove belt: between coast and land, south-eastern wetland zone
  if (x >= 16 && y >= 11 && y <= 15) return "mangrove";
  if (x >= 15 && y >= 12 && y <= 14) return "mangrove";

  // Wetlands: southeast lowlands near the river mouth
  if (x >= 13 && y >= 10 && y <= 16) return "wetland";

  // Beach: coastal fringe
  if (x >= 17) return "beach";

  // Forest: northwest corner
  if (x <= 3 && y <= 4) return "forest";
  if (x <= 4 && y <= 6 && x + y <= 9) return "forest";

  // Agricultural edge: western strip and far north
  if (x <= 2) return "agriculture";
  if (y === 0 && x >= 4 && x <= 14) return "agriculture";

  // Industrial zone: northeast
  if (x >= 10 && x <= 14 && y <= 3) return "industrial";
  if (x >= 15 && y <= 4) return "industrial";

  // Urban core: center-west
  if (x >= 5 && x <= 9 && y >= 6 && y <= 10) return "urbanCore";

  // High-income district: north-central, higher elevation
  if (x >= 7 && x <= 11 && y >= 3 && y <= 5) return "highIncome";

  // Low-income settlement: southern coastal edge (highest flood exposure)
  if (y >= 16) return "residentialLow";
  if (x >= 13 && y >= 15) return "residentialLow";

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
  ocean: "#0c2440",
  river: "#164e63",
  mangrove: "#065f46",
  wetland: "#14532d",
  beach: "#b8a068",
  forest: "#15803d",
  park: "#4ade80",
  urbanCore: "#f59e0b",
  residential: "#334155",
  residentialLow: "#475569",
  highIncome: "#8b5cf6",
  industrial: "#64748b",
  agriculture: "#a3b54a",
};

export const CELL_LABELS: Record<CellType, string> = {
  ocean: "Sea",
  river: "River",
  mangrove: "Mangrove",
  wetland: "Wetlands",
  beach: "Coastline",
  forest: "Forest",
  park: "Park",
  urbanCore: "City core",
  residential: "Residential",
  residentialLow: "Low-income",
  highIncome: "High-income",
  industrial: "Industry",
  agriculture: "Farmland",
};
