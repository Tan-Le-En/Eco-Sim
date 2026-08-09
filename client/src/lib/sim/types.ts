/**
 * ECO//SIM — Simulation model types
 * Style: "Deep Ocean Console" — precise, instrument-like data vocabulary.
 * All values are fictional educational-model values, never real-world forecasts.
 */

/** The 8 user-controlled policy levers (values in their natural units). */
export interface Controls {
  /** Renewable electricity share target, 0–100 % */
  renewableElectricity: number;
  /** Public transport investment, 0–100 budget units */
  publicTransport: number;
  /** Urban tree & mangrove restoration, 0–30 % additional coverage */
  mangroveRestoration: number;
  /** Coastal development expansion, 0–30 % */
  coastalDevelopment: number;
  /** Water efficiency improvement, 0–60 % */
  waterEfficiency: number;
  /** Waste & recycling rate, 0–60 % */
  wasteRecycling: number;
  /** Fishing pressure, 0–100 % */
  fishingPressure: number;
  /** Industrial activity, 0–100 % */
  industrialActivity: number;
}

export const DEFAULT_CONTROLS: Controls = {
  renewableElectricity: 30,
  publicTransport: 10,
  mangroveRestoration: 0,
  coastalDevelopment: 10,
  waterEfficiency: 10,
  wasteRecycling: 20,
  fishingPressure: 60,
  industrialActivity: 55,
};

/** The 7 output indicators (0–100 scale; climate pressure: lower is better). */
export interface Indicators {
  climatePressure: number; // lower is better
  biodiversity: number;
  waterSecurity: number;
  floodResilience: number;
  publicHealth: number;
  economicWellbeing: number;
  equity: number;
}

export const INDICATOR_KEYS: (keyof Indicators)[] = [
  "climatePressure",
  "biodiversity",
  "waterSecurity",
  "floodResilience",
  "publicHealth",
  "economicWellbeing",
  "equity",
];

export interface IndicatorMeta {
  key: keyof Indicators;
  label: string;
  meaning: string;
  higherIsBetter: boolean;
  color: string; // chart/brand color
}

export const INDICATOR_META: Record<keyof Indicators, IndicatorMeta> = {
  climatePressure: {
    key: "climatePressure",
    label: "Climate pressure",
    meaning: "Emissions and warming contribution",
    higherIsBetter: false,
    color: "#f87171", // coral red
  },
  biodiversity: {
    key: "biodiversity",
    label: "Biodiversity",
    meaning: "Habitat and ecosystem health",
    higherIsBetter: true,
    color: "#34d399", // emerald
  },
  waterSecurity: {
    key: "waterSecurity",
    label: "Water security",
    meaning: "Ability to meet demand",
    higherIsBetter: true,
    color: "#2dd4bf", // teal
  },
  floodResilience: {
    key: "floodResilience",
    label: "Flood resilience",
    meaning: "Protection from coastal and rainfall flooding",
    higherIsBetter: true,
    color: "#60a5fa", // blue
  },
  publicHealth: {
    key: "publicHealth",
    label: "Public health",
    meaning: "Heat, pollution, and service access",
    higherIsBetter: true,
    color: "#fbbf24", // amber
  },
  economicWellbeing: {
    key: "economicWellbeing",
    label: "Economic wellbeing",
    meaning: "Jobs, productivity, and affordability",
    higherIsBetter: true,
    color: "#a78bfa", // violet
  },
  equity: {
    key: "equity",
    label: "Equity",
    meaning: "Whether benefits and risks are fairly distributed",
    higherIsBetter: true,
    color: "#f472b6", // pink
  },
};

/** Fictional city baseline, 2026. Spec §2.1. */
export const BASELINE = {
  population: 1_000_000,
  startYear: 2026,
  endYear: 2050,
  electricityDemandGWh: 8000,
  fossilShare: 0.7,
  renewableShare: 0.3,
  greenCoverage: 0.18, // forest + mangrove coverage
  urbanizedLand: 0.52,
  annualRainfallMm: 2400,
  annualWaterDemandMillionM3: 210,
  recyclingRate: 0.18,
  privateVehicleShare: 0.68,
  floodExposure: "Moderate" as const,
  biodiversity: 62,
  waterStress: 42,
  publicApproval: 55,
  budgetUnits: 100,
};

/** Mission success conditions used by the scorecard. */
export const MISSION_TARGETS: { key: keyof Indicators; threshold: number; direction: "above" | "below" }[] = [
  { key: "climatePressure", threshold: 45, direction: "below" },
  { key: "biodiversity", threshold: 70, direction: "above" },
  { key: "waterSecurity", threshold: 60, direction: "above" },
  { key: "floodResilience", threshold: 65, direction: "above" },
  { key: "equity", threshold: 60, direction: "above" },
];

export const START_YEAR = 2026;
export const END_YEAR = 2050;

export type SimEvent = {
  year: number;
  type: string;
  severity: "info" | "warning" | "critical";
  message: string;
};

export type CausalLink = {
  cause: string;
  effect: string;
  direction: "positive" | "negative";
  strength: number; // 0–1
};

export type SimulationResult = {
  id: string;
  controls: Controls;
  baselineYear: { year: number; indicators: Indicators; population: number; emissionsMtco2e: number };
  years: { year: number; indicators: Indicators; population: number; emissionsMtco2e: number; budgetRemaining: number }[];
  events: SimEvent[];
  causalLinks: CausalLink[];
  score: number; // 0–100 weighted composite
  scoreBreakdown: { key: keyof Indicators; value: number; weight: number; points: number }[];
  penalties: string[];
  biggestSuccess: string;
  biggestFailure: string;
};

export type SavedScenario = {
  id: string;
  name: string;
  dateLabel: string;
  controls: Controls;
  result: SimulationResult;
};
