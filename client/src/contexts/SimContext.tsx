/**
 * ECO//SIM — global simulation state
 * Deep Ocean Console: single source of truth shared by briefing, simulator,
 * and results screens. Stored in localStorage so a retry/comparison loop
 * survives page navigation (no accounts required per spec).
 *
 * Everything read back from storage is validated and clamped: corrupt,
 * missing, or tampered values never reach the engine (a NaN slider would
 * poison every indicator).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Controls,
  CONTROL_RANGES,
  DEFAULT_CONTROLS,
  SavedScenario,
  SimulationResult,
} from "@/lib/sim/types";
import { runSimulation } from "@/lib/sim/engine";

interface SimState {
  controls: Controls;
  setControl: (k: keyof Controls, v: number) => void;
  resetControls: () => void;
  currentResult: SimulationResult | null;
  run: () => SimulationResult;
  saveScenario: (name: string) => void;
  deleteScenario: (id: string) => void;
  scenarios: SavedScenario[];
  playbackYear: number | null; // null = not playing
  setPlaybackYear: (y: number | null) => void;
}

const SimContext = createContext<SimState | null>(null);

const STORAGE_KEY = "ecosim:v1";
const MAX_SAVED_SCENARIOS = 4;

const CONTROL_KEYS = Object.keys(DEFAULT_CONTROLS) as (keyof Controls)[];

/** Coerce unknown data into a valid, in-range Controls object. */
function sanitizeControls(input: unknown): Controls {
  const src =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const out = { ...DEFAULT_CONTROLS };
  for (const key of CONTROL_KEYS) {
    const { min, max } = CONTROL_RANGES[key];
    const value = Number(src[key]);
    if (Number.isFinite(value)) {
      out[key] = Math.min(max, Math.max(min, value));
    }
  }
  return out;
}

/** Keep only scenario entries whose shape we can safely render. */
function sanitizeScenarios(input: unknown): SavedScenario[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (s): s is SavedScenario =>
        typeof s === "object" &&
        s !== null &&
        typeof (s as SavedScenario).id === "string" &&
        typeof (s as SavedScenario).name === "string" &&
        Array.isArray((s as SavedScenario).result?.years),
    )
    .slice(0, MAX_SAVED_SCENARIOS)
    .map((s) => ({ ...s, controls: sanitizeControls(s.controls) }));
}

function loadPersisted(): { controls: Controls; scenarios: SavedScenario[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        controls: sanitizeControls(parsed?.controls),
        scenarios: sanitizeScenarios(parsed?.scenarios),
      };
    }
  } catch {
    /* corrupted or unavailable storage — start fresh */
  }
  return { controls: { ...DEFAULT_CONTROLS }, scenarios: [] };
}

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [persisted] = useState(loadPersisted);
  const [controls, setControls] = useState<Controls>(persisted.controls);
  const [scenarios, setScenarios] = useState<SavedScenario[]>(persisted.scenarios);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [playbackYear, setPlaybackYear] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ controls, scenarios }));
    } catch {
      /* storage may be unavailable (private mode, quota) — persistence is best-effort */
    }
  }, [controls, scenarios]);

  const setControl = useCallback((k: keyof Controls, v: number) => {
    // Clamp incoming values so no stray number can move a slider out of range.
    const range = CONTROL_RANGES[k];
    const safe = Math.min(range.max, Math.max(range.min, Number(v)));
    if (!Number.isFinite(safe)) return;
    setControls((prev) => ({ ...prev, [k]: safe }));
  }, []);

  const resetControls = useCallback(() => setControls({ ...DEFAULT_CONTROLS }), []);

  const run = useCallback(() => {
    const r = runSimulation(controls);
    const result: SimulationResult = {
      id: `sim_${Date.now().toString(36)}`,
      controls: { ...controls },
      baselineYear: {
        year: r.baselineYear.year,
        indicators: { ...r.baselineYear.indicators },
        population: r.baselineYear.population,
        emissionsMtco2e: r.baselineYear.emissionsMtco2e,
      },
      years: r.years.map((y) => ({
        year: y.year,
        indicators: { ...y.indicators },
        population: y.population,
        emissionsMtco2e: y.emissionsMtco2e,
        budgetRemaining: y.budgetRemaining,
      })),
      events: r.events,
      causalLinks: r.causalLinks,
      score: r.score,
      scoreBreakdown: r.scoreBreakdown,
      penalties: r.penalties,
      biggestSuccess: r.biggestSuccess,
      biggestFailure: r.biggestFailure,
    };
    setCurrentResult(result);
    return result;
  }, [controls]);

  const saveScenario = useCallback(
    (name: string) => {
      const result = run();
      const saved: SavedScenario = {
        id: result.id,
        name: name.trim() || "Untitled plan",
        dateLabel: new Date().toLocaleDateString(),
        controls: { ...result.controls },
        result,
      };
      setScenarios((prev) => [saved, ...prev].slice(0, MAX_SAVED_SCENARIOS));
    },
    [run],
  );

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const value = useMemo<SimState>(
    () => ({
      controls,
      setControl,
      resetControls,
      currentResult,
      run,
      saveScenario,
      deleteScenario,
      scenarios,
      playbackYear,
      setPlaybackYear,
    }),
    [controls, currentResult, scenarios, playbackYear, setControl, resetControls, run, saveScenario, deleteScenario],
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be used within SimProvider");
  return ctx;
}
