import type { SimulationResult, Controls } from "@/lib/sim/types";
import {
  CONTROL_RANGES,
  INDICATOR_KEYS,
  INDICATOR_META,
  KID_CONTROLS,
  KID_GOALS,
  KID_INDICATORS,
  MISSION_TARGETS,
} from "@/lib/sim/types";

export interface ReportGoal {
  goal_title: string;
  goal_bm: string;
  goal_met: boolean;
}

export interface ReportIndicator {
  ind_label: string;
  ind_kid_name: string;
  ind_meaning: string;
  ind_baseline: number;
  ind_final: number;
  ind_delta: string;
  ind_improved: boolean;
  ind_worsened: boolean;
  ind_neutral: boolean;
  ind_target: string;
  ind_target_met: boolean;
  ind_target_missed: boolean;
  ind_target_na: boolean;
  ind_weight: string;
  ind_points: string;
  ind_max_points: number;
}

export interface ReportControl {
  ctl_label: string;
  ctl_story: string;
  ctl_value: number;
  ctl_unit: string;
  ctl_range: string;
}

export interface ReportPenalty {
  penalty_text: string;
}

export interface ReportCausalLink {
  causal_text: string;
}

export interface ReportViewModel {
  report_title: string;
  report_subtitle: string;
  report_id: string;
  recipient_name: string;
  recipient_name_class: string;
  issued_date: string;
  issued_iso: string;
  run_place: string;
  run_window: string;
  run_baseline_year: number;
  run_final_year: number;
  score_display: number;
  score_max: number;
  verdict: string;
  verdict_subtext: string;
  goals_met: number;
  goals_total: number;
  goals_display: string;
  population_2050: string;
  budget_remaining: string;
  worked: string;
  failed: string;
  disclaimer: string;
  simulator_url: string;
  goals: ReportGoal[];
  indicators: ReportIndicator[];
  breakdown_subtotal: string;
  penalty_total: string;
  penalties: ReportPenalty[];
  controls: ReportControl[];
  causal_links: ReportCausalLink[];
  events_count: number;
}

const CONTROL_UNITS: Record<keyof Controls, string> = {
  renewableElectricity: "%",
  publicTransport: "budget units",
  mangroveRestoration: "% additional",
  coastalDevelopment: "%",
  waterEfficiency: "%",
  wasteRecycling: "%",
  fishingPressure: "%",
  industrialActivity: "%",
};

const CONTROL_ORDER: (keyof Controls)[] = [
  "renewableElectricity",
  "publicTransport",
  "mangroveRestoration",
  "coastalDevelopment",
  "waterEfficiency",
  "wasteRecycling",
  "fishingPressure",
  "industrialActivity",
];

export function computeGoalsMet(result: SimulationResult): boolean[] {
  const last = result.years[result.years.length - 1];
  if (!last) return KID_GOALS.map(() => false);
  const final = last.indicators;
  return KID_GOALS.map(g =>
    g.keys.every(k => {
      const t = MISSION_TARGETS.find(x => x.key === k);
      if (!t) return true;
      const v = final[k];
      return t.direction === "above" ? v >= t.threshold : v <= t.threshold;
    })
  );
}

function safeNum(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function formatPenaltyTotal(result: SimulationResult): string {
  const texts = Array.isArray(result.penalties) ? result.penalties : [];
  let total = 0;
  for (const text of texts) {
    const m = /−\s*(\d+(?:\.\d+)?)|-\s*(\d+(?:\.\d+)?)/.exec(text);
    if (m) total += Number(m[1] ?? m[2] ?? 0);
  }
  return total.toFixed(1);
}

function causalText(link: SimulationResult["causalLinks"][number]): string {
  if (!link) return "";
  const cause = String(link.cause ?? "").trim();
  const effect = String(link.effect ?? "").trim();
  if (!cause || !effect) return "";
  const dir =
    link.direction === "negative" ? "weakened/reduced" : "strengthened";
  const pct = Math.round(safeNum(link.strength, 0) * 100);
  return `${cause} ${dir} ${effect}${pct > 0 ? ` (strength ${pct}%)` : ""}.`;
}

export function buildReportViewModel(
  result: SimulationResult,
  recipientName: string
): ReportViewModel {
  const name = (recipientName ?? "").trim() || "Anonymous participant";
  const recipient_name_class =
    name.length > 30 ? "xlong" : name.length > 16 ? "long" : "";

  const lastYear = result.years?.[result.years.length - 1];
  const base = result.baselineYear?.indicators ?? ({} as Record<string, number>);
  const final = lastYear?.indicators ?? ({} as Record<string, number>);

  const goalsMetArr = computeGoalsMet(result);
  const goals_met = goalsMetArr.filter(Boolean).length;
  const goals_total = KID_GOALS.length;

  const scoreValue = safeNum(result.score, 0);
  const verdict =
    goals_met >= 2 ? "Teluk Nusa held its own." : "Teluk Nusa struggled.";
  const verdict_subtext =
    goals_met >= 2
      ? "Sea, water, and fairness protected to 2050."
      : "A threshold broke. See what caused it below.";

  const issued = new Date();
  const issued_date = issued.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const issued_iso = issued.toISOString();

  const breakdownByKey = new Map(
    (Array.isArray(result.scoreBreakdown) ? result.scoreBreakdown : []).map(
      b => [b.key, b]
    )
  );

  const indicators: ReportIndicator[] = INDICATOR_KEYS.map(k => {
    const meta = INDICATOR_META[k];
    const kid = KID_INDICATORS[k];
    const b = Math.round(safeNum((base as any)[k], 0));
    const f = Math.round(safeNum((final as any)[k], 0));
    const deltaRaw = f - b;
    const ind_delta =
      deltaRaw === 0
        ? "+0.0"
        : `${deltaRaw > 0 ? "+" : ""}${deltaRaw.toFixed(1)}`;
    const goodMove = meta.higherIsBetter ? deltaRaw > 0 : deltaRaw < 0;
    const badMove = meta.higherIsBetter ? deltaRaw < 0 : deltaRaw > 0;

    const t = MISSION_TARGETS.find(x => x.key === k);
    const ind_target = t
      ? `${t.direction === "above" ? "≥" : "≤"} ${t.threshold}`
      : "No hard target";
    const met =
      t &&
      (t.direction === "above"
        ? safeNum((final as any)[k], 0) >= t.threshold
        : safeNum((final as any)[k], 0) <= t.threshold);

    const bd = breakdownByKey.get(k);
    const weight = safeNum(bd?.weight, 0);
    const points = safeNum(bd?.points, 0);

    return {
      ind_label: meta?.label ?? "",
      ind_kid_name: kid?.kidName ?? "",
      ind_meaning: meta?.meaning ?? "",
      ind_baseline: b,
      ind_final: f,
      ind_delta,
      ind_improved: goodMove,
      ind_worsened: badMove,
      ind_neutral: deltaRaw === 0,
      ind_target,
      ind_target_met: Boolean(t && met),
      ind_target_missed: Boolean(t && !met),
      ind_target_na: !t,
      ind_weight: `${Math.round(weight * 100)}%`,
      ind_points: points.toFixed(1),
      ind_max_points: Math.round(weight * 100),
    };
  });

  const breakdown_subtotal = indicators
    .reduce((s, i) => s + Number(i.ind_points || 0), 0)
    .toFixed(1);

  const controls: ReportControl[] = CONTROL_ORDER.map(k => {
    const kid = KID_CONTROLS[k];
    const range = CONTROL_RANGES[k];
    return {
      ctl_label: kid?.kidName ?? "",
      ctl_story: kid?.kidStory ?? "",
      ctl_value: Math.round(safeNum(result.controls?.[k], 0)),
      ctl_unit: CONTROL_UNITS[k],
      ctl_range: `${range.min}–${range.max}`,
    };
  });

  const penalties: ReportPenalty[] = (
    Array.isArray(result.penalties) ? result.penalties : []
  ).map(p => ({ penalty_text: String(p ?? "") }));

  const causal_links: ReportCausalLink[] = (
    Array.isArray(result.causalLinks) ? result.causalLinks : []
  )
    .slice(0, 8)
    .map(link => ({ causal_text: causalText(link) }))
    .filter(c => c.causal_text);

  const pop = safeNum(lastYear?.population, 0);
  const budget = safeNum(lastYear?.budgetRemaining, 0);

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://ecosim2050.vercel.app";

  return {
    report_title: "ECO//SIM · Teluk Nusa 2050 Field Report",
    report_subtitle: "An open learning model, not a forecast.",
    report_id: String(result.id ?? ""),
    recipient_name: name,
    recipient_name_class,
    issued_date,
    issued_iso,
    run_place: "Teluk Nusa",
    run_window: "25 years",
    run_baseline_year: safeNum(result.baselineYear?.year, 2026),
    run_final_year: safeNum(lastYear?.year, 2050),
    score_display: Math.round(scoreValue),
    score_max: 100,
    verdict,
    verdict_subtext,
    goals_met,
    goals_total,
    goals_display: `${goals_met} / ${goals_total}`,
    population_2050: pop ? pop.toLocaleString("en-US") : "",
    budget_remaining: `${Math.round(budget)} pts`,
    worked: String(result.biggestSuccess ?? ""),
    failed: String(result.biggestFailure ?? ""),
    disclaimer:
      "Educational simulation of a fictional city (Teluk Nusa) with illustrative constants. Not a real-world forecast, planning recommendation, or scientific evidence.",
    simulator_url: `${origin}/simulator`,
    goals: KID_GOALS.map((g, i) => ({
      goal_title: g.title,
      goal_bm: g.bm ?? "",
      goal_met: Boolean(goalsMetArr[i]),
    })),
    indicators,
    breakdown_subtotal,
    penalty_total: formatPenaltyTotal(result),
    penalties,
    controls,
    causal_links,
    events_count: Array.isArray(result.events) ? result.events.length : 0,
  };
}
