/**
 * ECO//SIM — global simulation state
 * Deep Ocean Console: single source of truth shared by briefing, simulator,
 * and results screens. Stored in localStorage so a retry/comparison loop
 * survives page navigation (no accounts required per spec).
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  Controls,
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

function loadPersisted(): { controls: Controls; scenarios: SavedScenario[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        controls: { ...DEFAULT_CONTROLS, ...parsed?.controls },
        scenarios: Array.isArray(parsed?.scenarios) ? parsed.scenarios : [],
      };
    }
  } catch {
    /* ignore */
  }
  return { controls: { ...DEFAULT_CONTROLS }, scenarios: [] };
}

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [controls, setControls] = useState<Controls>(() => loadPersisted().controls);
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => loadPersisted().scenarios);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [playbackYear, setPlaybackYear] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ controls, scenarios }));
  }, [controls, scenarios]);

  const setControl = useCallback((k: keyof Controls, v: number) => {
    setControls((prev) => ({ ...prev, [k]: v }));
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
        name,
        dateLabel: new Date().toLocaleDateString(),
        controls: { ...result.controls },
        result,
      };
      setScenarios((prev) => [saved, ...prev].slice(0, 4));
    },
    [run],
  );

  const deleteScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <SimContext.Provider
      value={{
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
      }}
    >
      {children}
    </SimContext.Provider>
  );
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be used within SimProvider");
  return ctx;
}
