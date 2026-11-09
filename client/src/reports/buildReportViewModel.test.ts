import { describe, expect, it } from "vitest";
import { buildReportViewModel } from "./buildReportViewModel";
import type { SimulationResult } from "@/lib/sim/types";
import { INDICATOR_KEYS } from "@/lib/sim/types";

function makeResult(overrides: Partial<SimulationResult> = {}): SimulationResult {
  const indicators = {
    climatePressure: 62,
    biodiversity: 56,
    waterSecurity: 65,
    floodResilience: 60,
    publicHealth: 60,
    economicWellbeing: 52,
    equity: 44,
  };
  const baseline = {
    climatePressure: 50,
    biodiversity: 72,
    waterSecurity: 58,
    floodResilience: 66,
    publicHealth: 60,
    economicWellbeing: 52,
    equity: 55,
  };
  const scoreBreakdown = INDICATOR_KEYS.map(key => ({
    key,
    value: (indicators as any)[key],
    weight:
      key === "publicHealth" ? 0.1 : key === "economicWellbeing" || key === "equity" || key === "climatePressure" || key === "biodiversity" || key === "waterSecurity" || key === "floodResilience" ? 0.15 : 0.1,
    points: 5,
  }));
  return {
    id: "sim_TEST01",
    controls: {
      renewableElectricity: 60,
      publicTransport: 45,
      mangroveRestoration: 15,
      coastalDevelopment: 20,
      waterEfficiency: 30,
      wasteRecycling: 30,
      fishingPressure: 70,
      industrialActivity: 65,
    },
    baselineYear: { year: 2026, indicators: baseline, population: 1000000, emissionsMtco2e: 8 },
    years: [{ year: 2050, indicators, population: 1523285, emissionsMtco2e: 7, budgetRemaining: 0 }],
    events: [],
    causalLinks: [],
    score: 53.3,
    scoreBreakdown,
    penalties: [],
    biggestSuccess: "SUCCESS TEXT",
    biggestFailure: "FAIL TEXT",
    ...overrides,
  };
}

describe("buildReportViewModel", () => {
  it("enforces exactly-one-true rules for indicator change and target status", () => {
    const vm = buildReportViewModel(makeResult(), "Ada");
    expect(vm.indicators).toHaveLength(7);
    for (const ind of vm.indicators) {
      const changeFlags = [ind.ind_improved, ind.ind_worsened, ind.ind_neutral].filter(Boolean);
      expect(changeFlags).toHaveLength(1);
      const targetFlags = [ind.ind_target_met, ind.ind_target_missed, ind.ind_target_na].filter(Boolean);
      expect(targetFlags).toHaveLength(1);
    }
  });

  it("treats climatePressure decrease as improved (higherIsBetter false)", () => {
    const vm = buildReportViewModel(
      makeResult({
        baselineYear: {
          year: 2026,
          indicators: {
            climatePressure: 70,
            biodiversity: 72,
            waterSecurity: 58,
            floodResilience: 66,
            publicHealth: 60,
            economicWellbeing: 52,
            equity: 55,
          },
          population: 1000000,
          emissionsMtco2e: 8,
        },
        years: [
          {
            year: 2050,
            indicators: {
              climatePressure: 40,
              biodiversity: 72,
              waterSecurity: 58,
              floodResilience: 66,
              publicHealth: 60,
              economicWellbeing: 52,
              equity: 55,
            },
            population: 1523285,
            emissionsMtco2e: 7,
            budgetRemaining: 0,
          },
        ],
      }),
      "Ada"
    );
    const climate = vm.indicators.find(i => i.ind_label === "Climate pressure");
    expect(climate?.ind_improved).toBe(true);
    expect(climate?.ind_worsened).toBe(false);
    expect(climate?.ind_neutral).toBe(false);
  });

  it("marks publicHealth and economicWellbeing targets as n/a", () => {
    const vm = buildReportViewModel(makeResult(), "Ada");
    const ph = vm.indicators.find(i => i.ind_label === "Public health");
    const econ = vm.indicators.find(i => i.ind_label === "Economic wellbeing");
    expect(ph?.ind_target_na).toBe(true);
    expect(ph?.ind_target_met).toBe(false);
    expect(ph?.ind_target_missed).toBe(false);
    expect(econ?.ind_target_na).toBe(true);
  });

  it("handles empty name and long names and empty penalties", () => {
    const empty = buildReportViewModel(makeResult({ penalties: [] }), "");
    expect(empty.recipient_name).toBe("Anonymous participant");
    expect(empty.recipient_name_class).toBe("long"); // "Anonymous participant" = 21 chars
    expect(empty.penalties).toEqual([]);

    const short = buildReportViewModel(makeResult(), "Ada");
    expect(short.recipient_name_class).toBe("");

    const long = buildReportViewModel(
      makeResult(),
      "A very very long participant name over sixteen"
    );
    expect(long.recipient_name_class).toBe("xlong");

    const xlong = buildReportViewModel(
      makeResult(),
      "This participant name is definitely more than thirty characters"
    );
    expect(xlong.recipient_name_class).toBe("xlong");
  });
});
