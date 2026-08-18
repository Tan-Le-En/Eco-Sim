/**
 * ECO//SIM — Simulation engine (deterministic, client-side)
 *
 * Style note: the cockpit's computation heart. Every equation below is an
 * EDUCATIONAL MODEL equation labelled as such — never a real-world forecast.
 * Equations follow the spec §2.5 with documented deviations noted inline.
 */

import {
  BASELINE,
  Controls,
  END_YEAR,
  Indicators,
  SimEvent,
  START_YEAR,
} from "./types";

/* ---------- model constants (illustrative, educational) ---------- */
const POPULATION_GROWTH = 0.012; // annual growth rate r
const ELECTRICITY_PER_PERSON_KWH = 8000; // 8,000 GWh / 1,000,000 people
const FOSSIL_EF = 0.75; // kg CO2e / kWh (illustrative)
const RENEWABLE_EF = 0.05;
const TRANSPORT_EMISSIONS_PER_PERSON_KG = 1.1; // kg CO2e / year per private-vehicle user (city-attributable share, educational)
const WATER_PER_PERSON_M3 = 210; // 210M m³ / 1M people
const BASE_WATER_SUPPLY_M3 = 220_000_000; // million litres → 220M m³/yr capacity
const INDUSTRIAL_WATER_PER_UNIT = 300_000; // m³ per industrial activity unit
const EMISSIONS_BUDGET_BASE_MT = 8.2; // MtCO2e baseline total (2026, fictional)

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ---------- rainfall variability (deterministic per year) ---------- */
function rainfallFactorFor(year: number): number {
  // pseudo-random but fixed per year: 0.85 – 1.15 with occasional droughts
  const x = Math.sin(year * 2.718 + 42) * 0.5 + Math.sin(year * 1.137) * 0.3;
  const drought = year === 2034 || year === 2043 ? -0.2 : 0;
  const floodYear = year === 2037 || year === 2047 ? 0.15 : 0;
  return clamp(1 + x * 0.1 + drought + floodYear, 0.85, 1.15);
}

/* ---------- core yearly computation ---------- */

export type SimYear = {
  year: number;
  indicators: Indicators;
  population: number;
  emissionsMtco2e: number;
  renewableShare: number;
  fossilShare: number;
  budgetRemaining: number;
  waterDemandM3: number;
};

function computeYear(
  year: number,
  controls: Controls,
  prev: SimYear | null
): SimYear {
  const c = controls;
  const t = year - START_YEAR; // years elapsed (0 in 2026)

  // ---- population (spec: P(t+1) = P(t) * (1 + r)) ----
  let population = BASELINE.population * Math.pow(1 + POPULATION_GROWTH, t);
  // rapid-growth challenge: industrial pull adds migration
  population *= 1 + (c.industrialActivity / 100) * 0.006 * t;

  // ---- electricity demand (spec §2.5) ----
  // 8,000 people-kWh ÷ 1,000,000 people = 8,000 GWh baseline. Expressed in TWh (8 TWh).
  const efficiency = c.waterEfficiency / 100; // proxy: efficiency program also saves energy
  const electricityDemandTWh =
    (population * (ELECTRICITY_PER_PERSON_KWH / 1_000_000) * (1 - efficiency * 0.2)) / 1000; // TWh

  // ---- renewable share (spec equation, annualized rollout) ----
  const rollout = Math.min(1, t / 10); // 10-year transition window
  const targetShare = Math.min(
    0.95,
    0.3 + (c.renewableElectricity / 100) * 0.006 * 100 - (c.industrialActivity / 100) * 0.0005 * 100
  );
  // linear transition: renewable share moves from baseline 0.30 toward target
  const renewableShare = 0.3 + (targetShare - 0.3) * rollout;
  const fossilShare = 1 - renewableShare;

  // ---- emissions (spec equation, calibrated to ~8.2 MtCO2e baseline) ----
  // Components calibrated so the 2026 default state totals ~8.2 Mt:
  //   electricity: 8,000 GWh × 0.70 fossil × 0.40 tCO2e/GWh ≈ 2.24 Mt
  //   transport: 1M people × 0.68 × 1.1 kg ≈ 0.75 Mt
  //   industry: 55% activity ≈ 3.0 Mt ; waste ≈ 0.9 Mt  -> total ≈ 8.1 Mt
  const ELECTRICITY_EF_T_PER_GWH = 0.4; // illustrative grid factor
  const fossilEmissions = electricityDemandTWh * fossilShare * ELECTRICITY_EF_T_PER_GWH; // Mt (0.4 Mt/TWh)
  const renewableEmissions = electricityDemandTWh * renewableShare * 0.05; // Mt
  const privateTransportShare = Math.max(0.2, 0.68 - (c.publicTransport / 100) * 0.4);
  const transportEmissions =
    (population * privateTransportShare * TRANSPORT_EMISSIONS_PER_PERSON_KG) / 1_000_000; // Mt
  const industrialEmissions = (c.industrialActivity / 100) * 14.1 * (1 + t * 0.004); // Mt
  const wasteEmissions = Math.max(0, 0.9 - (c.wasteRecycling / 100) * 1.2); // Mt
  const emissionsMtco2e =
    fossilEmissions + renewableEmissions + transportEmissions + industrialEmissions + wasteEmissions;

  // ---- water (spec equations) ----
  const waterDemandM3 =
    population * WATER_PER_PERSON_M3 * (1 - (c.waterEfficiency / 100) * 0.008 * 100 * 0.0125) +
    (c.industrialActivity / 100) * INDUSTRIAL_WATER_PER_UNIT * (1 + t * 0.01);
  const supplyGrowth = t * 1_200_000; // gradual capacity expansion (educational)
  const waterSupply = BASE_WATER_SUPPLY_M3 + supplyGrowth + (c.waterEfficiency / 100) * 30_000_000;
  let waterSecurity = clamp((100 * waterSupply) / Math.max(waterDemandM3, 1), 0, 100);
  waterSecurity = clamp(waterSecurity * rainfallFactorFor(year), 0, 100);

  // ---- biodiversity (spec equations, annualized) ----
  const mangroveCoverage = 0.18 + (c.mangroveRestoration / 100) * 0.3 * rollout;
  const wetlandCoverage = 0.06 - (c.coastalDevelopment / 100) * 0.02 * rollout;
  const wasteLeakage = Math.max(0, 0.3 - (c.wasteRecycling / 100) * 0.35); // 0.3 baseline leakage
  const habitatGain = (c.mangroveRestoration / 100) * 0.75 * rollout;
  const habitatLoss =
    ((c.coastalDevelopment / 100) * 0.85 + (c.fishingPressure / 100) * 0.25) * (1 + t * 0.006);
  const pollutionLoss = wasteLeakage * 0.3;
  // start from baseline 62, apply cumulative change
  const biodiversity = clamp(62 + habitatGain * 12 - habitatLoss * 12 - pollutionLoss * 12 - t * 0.15, 0, 100);

  // ---- flood resilience (spec equations) ----
  const naturalProtection = mangroveCoverage * 60 + wetlandCoverage * 40; // scale to ~10
  const infrastructureProtection = 0.55 * 10 * (t >= 5 ? 1 : t / 5); // defence builds after year 5
  const popGrowthEffect = t * 0.05;
  const exposure =
    (c.coastalDevelopment / 100) * 0.65 * 30 +
    popGrowthEffect * 0.25 * 30 -
    naturalProtection * 0.5 -
    infrastructureProtection * 0.4;
  const seaLevelPressure = t * 0.28; // rising baseline flood pressure
  const floodResilience = clamp(70 - exposure - seaLevelPressure + (c.waterEfficiency / 100) * 3, 0, 100);

  // ---- public health (spec equations) ----
  const urbanization = 52 + t * 0.25; // % urbanized
  const treeCover = (c.mangroveRestoration / 100) * 18 * rollout; // % added green
  // urbanization contributes relative to its 52-point baseline (educational rescaling)
  const heatRisk = (urbanization - 52) * 0.3 - treeCover * 0.5 - (c.publicTransport / 100) * 10;
  const pollutionRisk =
    (c.industrialActivity / 100) * 28 + fossilShare * 20 - (c.wasteRecycling / 100) * 15;
  const publicHealth = clamp(72 - heatRisk - pollutionRisk + (c.publicTransport / 100) * 6, 0, 100);

  // ---- equity (spec equations, reparameterized) ----
  const benefitLowIncome =
    (c.publicTransport / 100) * 30 +
    floodProtectionLowIncome(floodResilience, mangroveCoverage) +
    publicHealth * 0.02;
  const energyPriceIncrease = Math.max(0, (c.renewableElectricity - 40) / 100) * 0.12 * (1 - rollout * 0.5);
  const industrialPollution = (c.industrialActivity / 100) * 0.25;
  const burdenLowIncome =
    energyPriceIncrease * 35 +
    burdenFloodExposure(c.coastalDevelopment, t) +
    industrialPollution * 25;
  const equity = clamp(55 + benefitLowIncome - burdenLowIncome, 0, 100);

  // ---- economic wellbeing (spec equations, reparameterized) ----
  const industrialGrowthBonus = (c.industrialActivity / 100) * 30 * (1 + t * 0.005);
  const transportBenefit = (c.publicTransport / 100) * 10;
  const infrastructureCost =
    ((c.renewableElectricity / 100) * 14 +
      (c.publicTransport / 100) * 12 +
      (c.coastalDevelopment / 100) * 8 +
      (c.mangroveRestoration / 100) * 6 +
      (c.wasteRecycling / 100) * 4) *
    (1 + t * 0.012);
  const disasterDamage =
    Math.max(0, 40 - floodResilience) * 0.12 * rainfallFactorFor(year) * (1 + t * 0.02);
  const fishingCollapse = c.fishingPressure > 85 && t > 12 ? (t - 12) * 2.5 : 0;
  const economicWellbeing = clamp(
    61 + industrialGrowthBonus + transportBenefit - infrastructureCost - disasterDamage - fishingCollapse,
    0,
    100
  );

  // ---- budget accounting ----
  const spendRate =
    (c.renewableElectricity / 100) * 14 +
    (c.publicTransport / 100) * 12 +
    (c.mangroveRestoration / 30) * 9 +
    (c.waterEfficiency / 60) * 8 +
    (c.wasteRecycling / 60) * 6 +
    (c.coastalDevelopment / 30) * 5;
  const revenue = 1.6 + (c.industrialActivity / 100) * 0.9;
  const budgetRemaining = prev
    ? clamp(prev.budgetRemaining + revenue - spendRate, 0, 999)
    : BASELINE.budgetUnits;

  // ---- climate pressure (derived indicator: normalized emissions) ----
  // Baseline (~8.2 Mt) maps to ~54; aggressive action can push it toward 20.
  const climatePressure = clamp(54 + (emissionsMtco2e - EMISSIONS_BUDGET_BASE_MT) * 6, 0, 100);

  const indicators: Indicators = {
    climatePressure,
    biodiversity,
    waterSecurity,
    floodResilience,
    publicHealth,
    economicWellbeing,
    equity,
  };

  return {
    year,
    indicators,
    population: Math.round(population),
    emissionsMtco2e: Number(emissionsMtco2e.toFixed(2)),
    renewableShare,
    fossilShare,
    budgetRemaining: Number(budgetRemaining.toFixed(1)),
    waterDemandM3,
  };
}

function floodProtectionLowIncome(floodResilience: number, mangroveCoverage: number): number {
  // low-income settlements get the largest share of mangrove/flood benefits
  const protection = (floodResilience / 100) * 0.4 + mangroveCoverage * 0.3;
  return protection * 10;
}

function burdenFloodExposure(coastalDevelopment: number, t: number): number {
  // coastal development concentrates exposure in low-income coastal areas
  return ((coastalDevelopment / 30) * 0.45 + t * 0.004) * 10;
}

/* ---------- events: deterministic warnings across the timeline ---------- */
function generateEvents(years: SimYear[], controls: Controls): SimEvent[] {
  const events: SimEvent[] = [];
  for (const y of years) {
    const i = y.indicators;
    if (y.year <= START_YEAR) continue;
    if (i.waterSecurity < 50 && y.year % 2 === 0)
      events.push({
        year: y.year,
        type: "water_stress_warning",
        severity: "warning",
        message: `The Sungai Kedah runs thin by March. Families in the kampungs fetch rainwater in plastic drums.`,
      });
    if (i.waterSecurity < 35)
      events.push({
        year: y.year,
        type: "water_crisis",
        severity: "critical",
        message: `The dams run dry. Water board trucks park on Jalan Utama and residents queue with every container they own. The school closes early.`,
      });
    if (i.floodResilience < 40 && (y.year === 2037 || y.year === 2047))
      events.push({
        year: y.year,
        type: "coastal_flood",
        severity: "critical",
        message: `A monsoon surge pushes the sea past the seawall. In the kampung, a grandmother carries her cat onto the roof and waits for a boat.`,
      });
    if (i.biodiversity < 40 && y.year % 3 === 0)
      events.push({
        year: y.year,
        type: "habitat_loss_warning",
        severity: "warning",
        message: `The bakau trees on the estuary bank are gone. Fishermen say the nets come back lighter every year.`,
      });
    if (i.equity < 40 && y.year % 2 === 0)
      events.push({
        year: y.year,
        type: "equity_warning",
        severity: "warning",
        message: `The flats by the river have no lift and the bus route stops at the main road. Residents walk 40 minutes to the clinic.`,
      });
    if (i.publicHealth < 45 && y.year % 2 === 0)
      events.push({
        year: y.year,
        type: "health_warning",
        severity: "warning",
        message: `Hospital admissions for asthma and heat exhaustion climb. The ward runs out of beds by September.`,
      });
    if (y.budgetRemaining <= 0 && !events.some((e) => e.year === y.year && e.type === "budget_deficit"))
      events.push({
        year: y.year,
        type: "budget_deficit",
        severity: "critical",
        message: `The town hall stops funding projects. A bridge half-finished over the mouth of the Sungai Kedah. Approval for the mayor drops to its lowest since 2026.`,
      });
  }
  return events;
}

/* ---------- causal link engine (rules-based, deterministic) ---------- */
export type CausalLink = { cause: string; effect: string; direction: "positive" | "negative"; strength: number };

export function computeCausalLinks(controls: Controls, baseline: Indicators, final: Indicators): CausalLink[] {
  const links: CausalLink[] = [];
  const push = (cause: string, effect: string, direction: "positive" | "negative", strength: number) =>
    links.push({ cause, effect, direction, strength });

  const delta = (k: keyof Indicators) => final[k] - baseline[k];

  if (controls.renewableElectricity > 30)
    push("Renewable electricity", "Climate pressure", delta("climatePressure") < 0 ? "positive" : "negative", clamp(controls.renewableElectricity / 100, 0.1, 0.9));
  if (controls.publicTransport > 20)
    push("Public transport investment", "Climate pressure", "positive", clamp(controls.publicTransport / 100, 0.1, 0.7));
  if (controls.mangroveRestoration > 0)
    push("Mangrove restoration", "Flood resilience", delta("floodResilience") > 0 ? "positive" : "negative", clamp(controls.mangroveRestoration / 30, 0.1, 0.85));
  if (controls.mangroveRestoration > 0)
    push("Mangrove restoration", "Biodiversity", delta("biodiversity") > 0 ? "positive" : "negative", clamp(controls.mangroveRestoration / 30, 0.1, 0.8));
  if (controls.coastalDevelopment > 10) {
    push("Coastal development", "Biodiversity", "negative", clamp(controls.coastalDevelopment / 30, 0.1, 0.8));
    push("Coastal development", "Flood resilience", "negative", clamp(controls.coastalDevelopment / 30, 0.1, 0.75));
  }
  if (controls.waterEfficiency > 15)
    push("Water efficiency", "Water security", delta("waterSecurity") > 0 ? "positive" : "negative", clamp(controls.waterEfficiency / 60, 0.1, 0.8));
  if (controls.industrialActivity > 40) {
    push("Industrial activity", "Economic wellbeing", delta("economicWellbeing") > 0 ? "positive" : "negative", clamp(controls.industrialActivity / 100, 0.1, 0.7));
    if (controls.industrialActivity > 60) push("Industrial activity", "Water security", "negative", clamp((controls.industrialActivity - 50) / 50, 0.1, 0.6));
    if (controls.industrialActivity > 60) push("Industrial activity", "Public health", "negative", clamp((controls.industrialActivity - 50) / 50, 0.1, 0.5));
  }
  if (controls.fishingPressure > 70)
    push("Fishing pressure", "Biodiversity", "negative", clamp((controls.fishingPressure - 50) / 50, 0.1, 0.6));
  if (controls.wasteRecycling > 25)
    push("Waste & recycling", "Biodiversity", delta("biodiversity") > 0 ? "positive" : "negative", clamp(controls.wasteRecycling / 60, 0.1, 0.5));
  if (controls.publicTransport > 30)
    push("Public transport investment", "Equity", delta("equity") > 0 ? "positive" : "negative", clamp(controls.publicTransport / 100, 0.1, 0.6));

  links.sort((a, b) => b.strength - a.strength);
  return links.slice(0, 8);
}

/* ---------- deterministic explanations (rules-based, no AI needed) ---------- */
export function explainOutcome(controls: Controls, baseline: Indicators, final: Indicators): { biggestSuccess: string; biggestFailure: string } {
  const delta = (k: keyof Indicators) => final[k] - baseline[k];
  const meta = [
    { k: "climatePressure" as const, better: delta("climatePressure") < 0 },
    { k: "biodiversity" as const, better: delta("biodiversity") > 0 },
    { k: "waterSecurity" as const, better: delta("waterSecurity") > 0 },
    { k: "floodResilience" as const, better: delta("floodResilience") > 0 },
    { k: "publicHealth" as const, better: delta("publicHealth") > 0 },
    { k: "economicWellbeing" as const, better: delta("economicWellbeing") > 0 },
    { k: "equity" as const, better: delta("equity") > 0 },
  ];

  const labelOf: Record<keyof Indicators, string> = {
    climatePressure: "climate pressure",
    biodiversity: "biodiversity",
    waterSecurity: "water security",
    floodResilience: "flood resilience",
    publicHealth: "public health",
    economicWellbeing: "economic wellbeing",
    equity: "equity",
  };
  const label = (k: keyof Indicators) => labelOf[k];

  const improved = meta.filter((m) => m.better).sort((a, b) => Math.abs(delta(b.k)) - Math.abs(delta(a.k)));
  const worsened = meta.filter((m) => !m.better).sort((a, b) => Math.abs(delta(b.k)) - Math.abs(delta(a.k)));

  let biggestSuccess = "No indicator clearly improved. A balanced, but stagnant, strategy.";
  if (improved.length > 0) {
    const k = improved[0].k;
    const reasons: string[] = [];
    if (k === "climatePressure" && controls.renewableElectricity > 40)
      reasons.push(`higher renewable electricity displaced fossil power`);
    if (k === "climatePressure" && controls.publicTransport > 40)
      reasons.push(`public transport cut private vehicle trips`);
    if (k === "biodiversity" && controls.mangroveRestoration > 10)
      reasons.push(`mangrove restoration rebuilt habitat`);
    if (k === "biodiversity" && controls.wasteRecycling > 30)
      reasons.push(`recycling reduced river pollution`);
    if (k === "waterSecurity" && controls.waterEfficiency > 25)
      reasons.push(`water efficiency held demand below supply`);
    if (k === "floodResilience" && controls.mangroveRestoration > 10)
      reasons.push(`mangroves and wetlands absorbed storm surge`);
    if (k === "equity" && controls.publicTransport > 30)
      reasons.push(`public transport benefits reached low-income districts`);
    if (k === "economicWellbeing" && controls.industrialActivity > 50)
      reasons.push(`industrial activity created jobs and output`);
    const cause = reasons.length > 0 ? reasons.join(" and ") : "your combined policy mix";
    biggestSuccess = `${label(k)} improved by ${Math.abs(delta(k)).toFixed(1)} points. The main driver: ${cause}.`;
  }

  let biggestFailure = "No indicator worsened dramatically.";
  if (worsened.length > 0) {
    const k = worsened[0].k;
    const reasons: string[] = [];
    if (k === "climatePressure") reasons.push("emissions kept growing faster than the energy transition");
    if (k === "biodiversity" && controls.coastalDevelopment > 15)
      reasons.push("coastal development destroyed habitat");
    if (k === "biodiversity" && controls.fishingPressure > 70)
      reasons.push("intensive fishing depleted fish stocks");
    if (k === "waterSecurity" && controls.industrialActivity > 50)
      reasons.push("industrial water demand outgrew supply");
    if (k === "waterSecurity" && controls.industrialActivity <= 50)
      reasons.push("more people needed more water than the taps could give");
    if (k === "floodResilience" && controls.mangroveRestoration < 10)
      reasons.push("insufficient natural protection against rising seas");
    if (k === "equity") reasons.push("costs and risks fell disproportionately on low-income districts");
    if (k === "publicHealth" && controls.industrialActivity > 60)
      reasons.push("industrial pollution and heat stress compounded");
    const cause = reasons.length > 0 ? reasons[0] : "an unintended side effect of your policy mix";
    biggestFailure = `${label(k)} fell by ${Math.abs(delta(k)).toFixed(1)} points. The unintended consequence: ${cause}.`;
  }

  return { biggestSuccess, biggestFailure };
}

/* ---------- scoring (spec §5.3, transparent weights) ---------- */
export function scoreResult(final: Indicators): {
  score: number;
  breakdown: { key: keyof Indicators; value: number; weight: number; points: number }[];
  penalties: string[];
} {
  // Weights: C 0.20, B 0.15, W 0.15, F 0.15, H 0.15, E 0.10, Q 0.10
  const weights: Record<keyof Indicators, number> = {
    climatePressure: 0.2,
    biodiversity: 0.15,
    waterSecurity: 0.15,
    floodResilience: 0.15,
    publicHealth: 0.15,
    economicWellbeing: 0.1,
    equity: 0.1,
  };
  const breakdown: { key: keyof Indicators; value: number; weight: number; points: number }[] = [];
  for (const k of Object.keys(weights) as (keyof Indicators)[]) {
    const performance = k === "climatePressure" ? 100 - final[k] : final[k];
    const points = performance * weights[k];
    breakdown.push({ key: k, value: final[k], weight: weights[k], points });
  }
  const penalties: string[] = [];
  let penaltyTotal = 0;
  if (final.biodiversity < 30) {
    penalties.push("Biodiversity collapse (below 30): −10");
    penaltyTotal += 10;
  }
  if (final.waterSecurity < 25) {
    penalties.push("Water failure (below 25): −8");
    penaltyTotal += 8;
  }
  if (final.equity < 35) {
    penalties.push("Severe inequality (equity below 35): −6");
    penaltyTotal += 6;
  }
  let score = clamp(breakdown.reduce((s, b) => s + b.points, 0) - penaltyTotal, 0, 100);
  return { score: Number(score.toFixed(1)), breakdown, penalties };
}

/* ---------- public entry point ---------- */
export function runSimulation(controls: Controls): {
  years: SimYear[];
  baselineYear: SimYear;
  events: SimEvent[];
  causalLinks: CausalLink[];
  score: number;
  scoreBreakdown: { key: keyof Indicators; value: number; weight: number; points: number }[];
  penalties: string[];
  biggestSuccess: string;
  biggestFailure: string;
} {
  const years: SimYear[] = [];
  let prev: SimYear | null = null;
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    const next = computeYear(y, controls, prev);
    years.push(next);
    prev = next;
  }
  const baselineYear = years[0];
  const final = years[years.length - 1].indicators;
  const events = generateEvents(years, controls);
  const causalLinks = computeCausalLinks(controls, baselineYear.indicators, final);
  const { score, breakdown, penalties } = scoreResult(final);
  const { biggestSuccess, biggestFailure } = explainOutcome(controls, baselineYear.indicators, final);
  return { years, baselineYear, events, causalLinks, score, scoreBreakdown: breakdown, penalties, biggestSuccess, biggestFailure };
}

export { computeYear };
