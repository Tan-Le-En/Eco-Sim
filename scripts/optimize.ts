/**
 * Find the control setup that maximises the score in the ECO//SIM engine.
 * Strategy: 200 random restarts + coordinate hill-climb (1-point steps),
 * ~30-60k sims total — seconds instead of hours.
 */
import { runSimulation } from "../client/src/lib/sim/engine";
import { DEFAULT_CONTROLS, Controls } from "../client/src/lib/sim/types";

type CK = keyof Controls;

const KEYS: CK[] = [
  "renewableElectricity",
  "publicTransport",
  "mangroveRestoration",
  "coastalDevelopment",
  "waterEfficiency",
  "wasteRecycling",
  "fishingPressure",
  "industrialActivity",
];

const MAX: Record<CK, number> = {
  renewableElectricity: 100,
  publicTransport: 100,
  mangroveRestoration: 30,
  coastalDevelopment: 30,
  waterEfficiency: 60,
  wasteRecycling: 60,
  fishingPressure: 100,
  industrialActivity: 100,
};

function clamp(v: number, k: CK) {
  return Math.min(MAX[k], Math.max(0, Math.round(v)));
}

let simCount = 0;
function scoreOf(controls: Controls) {
  simCount++;
  return runSimulation(controls).score;
}

function hillClimb(start: Controls): { controls: Controls; score: number } {
  let cur = { ...start };
  let curScore = scoreOf(cur);
  let improved = true;
  while (improved) {
    improved = false;
    for (const k of KEYS) {
      for (const d of [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) {
        const cand = { ...cur, [k]: clamp(cur[k] + d, k) };
        if (cand[k] === cur[k]) continue;
        const s = scoreOf(cand);
        if (s > curScore) {
          cur = cand;
          curScore = s;
          improved = true;
        }
      }
    }
  }
  return { controls: cur, score: curScore };
}

let globalBest = { controls: { ...DEFAULT_CONTROLS }, score: -1 };

// Random restarts
for (let i = 0; i < 200; i++) {
  const start = { ...DEFAULT_CONTROLS } as Controls;
  for (const k of KEYS) start[k] = Math.floor(Math.random() * (MAX[k] + 1));
  const r = hillClimb(start);
  if (r.score > globalBest.score) globalBest = r;
}

// Also hill-climb from baseline and a few hand-picked points
for (const start of [{ ...DEFAULT_CONTROLS } as Controls,
  { ...DEFAULT_CONTROLS, renewableElectricity: 80, publicTransport: 60, mangroveRestoration: 30, coastalDevelopment: 5, fishingPressure: 30, industrialActivity: 30 } as Controls]) {
  const r = hillClimb(start);
  if (r.score > globalBest.score) globalBest = r;
}

console.log(`sims run: ${simCount}; best score = ${globalBest.score.toFixed(1)}`);
console.log(JSON.stringify(globalBest.controls, null, 1));

const final = runSimulation(globalBest.controls);
console.log("scoreBreakdown:");
for (const b of final.scoreBreakdown) console.log(`  ${b.key}: value=${b.value.toFixed(1)} weight=${b.weight} points=${b.points.toFixed(1)}`);
console.log("penalties:", final.penalties);
console.log("biggestSuccess:", final.biggestSuccess);
console.log("biggestFailure:", final.biggestFailure);
const y2050 = final.years[final.years.length - 1];
console.log("2050 indicators:", JSON.stringify(y2050.indicators));
console.log("2050 budget:", y2050.budgetRemaining.toFixed(1), "pop:", y2050.population.toLocaleString());
