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

/* ------------------------------------------------------------------
 * KID LAYER (Kampung Coast v2) — simple-but-hard
 * Friendly names, one-word plain meanings, icons, and a single
 * "why it matters" sentence a child understands. The professor layer
 * (labels/meanings above + published equations) stays untouched.
 * ------------------------------------------------------------------ */

export interface KidIndicatorMeta {
  key: keyof Indicators;
  /** Big friendly name a child reads first */
  kidName: string;
  /** Bahasa Malaysia term used as flavor */
  bm: string;
  /** One-line story: what a child should picture */
  kidStory: string;
  /** Plain icon name (lucide): Sea, Fish, Droplets, Waves, HeartPulse, Briefcase, Scale */
  icon: string;
  /** Happy version of the world vs sad version, kid language */
  happy: string;
  sad: string;
}

export const KID_INDICATORS: Record<keyof Indicators, KidIndicatorMeta> = {
  climatePressure: {
    key: "climatePressure",
    kidName: "Sea & Air",
    bm: "Laut & Udara",
    kidStory: "The sky and the sea getting hotter from smoke.",
    icon: "Sun",
    happy: "Clear skies, cool breeze",
    sad: "Smoky, hot, stormy days",
  },
  biodiversity: {
    key: "biodiversity",
    kidName: "Nature & Animals",
    bm: "Alam & Haiwan",
    kidStory: "How many birds, fish, and trees are happy here.",
    icon: "Leaf",
    happy: "Birds singing, fish jumping",
    sad: "Quiet forest, empty sea",
  },
  waterSecurity: {
    key: "waterSecurity",
    kidName: "Clean Water",
    bm: "Air Bersih",
    kidStory: "Is there enough clean water for everyone's taps?",
    icon: "Droplets",
    happy: "Water flows at every tap",
    sad: "Taps running dry",
  },
  floodResilience: {
    key: "floodResilience",
    kidName: "Safe From Flood",
    bm: "Selamat Dari Banjir",
    kidStory: "When the monsoon rain comes, are the houses safe?",
    icon: "Umbrella",
    happy: "Rain falls, homes stay dry",
    sad: "Water on the roads and floors",
  },
  publicHealth: {
    key: "publicHealth",
    kidName: "Healthy People",
    bm: "Orang Sihat",
    kidStory: "Do people stay healthy and not get sick?",
    icon: "HeartPulse",
    happy: "Everyone is strong and well",
    sad: "More coughs, more doctors' visits",
  },
  economicWellbeing: {
    key: "economicWellbeing",
    kidName: "Good Life",
    bm: "Kehidupan Selesa",
    kidStory: "Can families earn enough for food, school, and fun?",
    icon: "Briefcase",
    happy: "Jobs for everyone, good food on the table",
    sad: "No jobs, prices too high",
  },
  equity: {
    key: "equity",
    kidName: "Fair For All",
    bm: "Adil Untuk Semua",
    kidStory: "Does everybody get a fair share — rich and poor alike?",
    icon: "Scale",
    happy: "Everyone is treated fairly",
    sad: "Some have plenty, some have little",
  },
};

/* Kid layer for the 8 controls. */
export interface KidControlMeta {
  key: keyof Controls;
  kidName: string;
  bm: string;
  kidStory: string;
  icon: string; // lucide icon name
  /** What goes up when you push this more */
  goodWhenMore: string;
  /** What gets worse when you push this more */
  badWhenMore: string;
}

export const KID_CONTROLS: Record<keyof Controls, KidControlMeta> = {
  renewableElectricity: {
    key: "renewableElectricity",
    kidName: "Clean Power",
    bm: "Tenaga Bersih",
    kidStory: "Make electricity from sun and wind instead of smoke.",
    icon: "Sun",
    goodWhenMore: "Less smoke in the sky",
    badWhenMore: "Costs more at the start",
  },
  publicTransport: {
    key: "publicTransport",
    kidName: "Buses & Trains",
    bm: "Bas & Kereta Api",
    kidStory: "Big buses and trains so fewer cars crowd the roads.",
    icon: "Bus",
    goodWhenMore: "Less traffic, cleaner air, fairer for everyone",
    badWhenMore: "Spends our town's money",
  },
  mangroveRestoration: {
    key: "mangroveRestoration",
    kidName: "Plant Trees & Mangroves",
    bm: "Tanam Pokok & Bakau",
    kidStory: "Plant mangroves by the sea — nature's flood wall!",
    icon: "TreePine",
    goodWhenMore: "Less flooding, more fish and birds",
    badWhenMore: "Takes up land we could build on",
  },
  coastalDevelopment: {
    key: "coastalDevelopment",
    kidName: "Building by the Beach",
    bm: "Bina di Tepi Pantai",
    kidStory: "Build new homes and shops near the water.",
    icon: "Building2",
    goodWhenMore: "More homes, more money jobs",
    badWhenMore: "More flood danger, less nature",
  },
  waterEfficiency: {
    key: "waterEfficiency",
    kidName: "Saving Water",
    bm: "Jimat Air",
    kidStory: "Fix leaky pipes and reuse water — every drop counts.",
    icon: "Droplets",
    goodWhenMore: "Water lasts through dry months",
    badWhenMore: "Costs money to fix the pipes",
  },
  wasteRecycling: {
    key: "wasteRecycling",
    kidName: "Sorting Rubbish",
    bm: "Kitar Semula",
    kidStory: "Sort rubbish so it can be used again — not thrown in the sea.",
    icon: "Recycle",
    goodWhenMore: "Cleaner river and beach, happy fish",
    badWhenMore: "Takes work and costs a little",
  },
  fishingPressure: {
    key: "fishingPressure",
    kidName: "How Much We Fish",
    bm: "Menjala Ikan",
    kidStory: "Catch more fish today — but leave enough to come back tomorrow.",
    icon: "Fish",
    goodWhenMore: "More fish on the table now",
    badWhenMore: "Fewer fish every year after",
  },
  industrialActivity: {
    key: "industrialActivity",
    kidName: "Factories Working",
    bm: "Kilang",
    kidStory: "Factories make jobs and things — but use power and water.",
    icon: "Factory",
    goodWhenMore: "More jobs, more money for the town",
    badWhenMore: "More smoke, dirtier water",
  },
};

/* The three big kid goals shown as traffic lights on the results screen. */
export const KID_GOALS: { id: string; title: string; bm: string; keys: (keyof Indicators)[] }[] = [
  { id: "sea", title: "Sea is clean & calm", bm: "Laut bersih & tenang", keys: ["climatePressure", "biodiversity", "floodResilience"] },
  { id: "city", title: "City is safe & healthy", bm: "Bandar selamat & sihat", keys: ["waterSecurity", "publicHealth", "floodResilience"] },
  { id: "people", title: "Everyone is treated fair", bm: "Semua orang dapat adil", keys: ["economicWellbeing", "equity"] },
];
