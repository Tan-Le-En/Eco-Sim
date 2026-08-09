/**
 * ECO//SIM — Results screen
 * Style: Deep Ocean Console — scorecard with transparent weighted breakdown,
 * scenario comparison (up to 4 saved strategies), causal feed, retry loop.
 */
import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Share2,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import SiteHeader from "@/components/SiteHeader";
import CausalChain from "@/components/CausalChain";
import { useSim } from "@/contexts/SimContext";
import { ChartRow } from "@/components/TimelineChart";
import { INDICATOR_KEYS, INDICATOR_META, MISSION_TARGETS, SimulationResult } from "@/lib/sim/types";

const SLIDER_LABELS: Record<string, string> = {
  renewableElectricity: "Renewables",
  publicTransport: "Public transit",
  mangroveRestoration: "Mangroves",
  coastalDevelopment: "Coastal dev.",
  waterEfficiency: "Water eff.",
  wasteRecycling: "Recycling",
  fishingPressure: "Fishing",
  industrialActivity: "Industry",
};

export default function Results() {
  const { currentResult, scenarios, deleteScenario, run, controls } = useSim();
  const [, navigate] = useLocation();

  // The results page is read-only, so if there is no completed run in this
  // session, compute the result for the current (saved) controls so
  // bookmarked results always show something meaningful.
  const latest =
    currentResult ??
    scenarios[0]?.result ??
    run();

  if (!latest) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader backHref="/simulator" />
        <main className="container py-16 flex-1 flex flex-col items-center justify-center text-center gap-4">
          <h1 className="font-display text-2xl font-bold">No simulation results yet</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Run the simulation to 2050 first, or use the simulator to explore.
          </p>
          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-5 py-2.5 hover:brightness-110 transition-all"
          >
            Go to simulator <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </main>
      </div>
    );
  }

  const base = latest.baselineYear.indicators;
  const final = latest.years[latest.years.length - 1].indicators;
  const budgetFinal = latest.years[latest.years.length - 1].budgetRemaining;

  const comparisonData: (ChartRow & { scenario?: string })[] = useMemo(() => {
    const rows = latest.years.map((y) => {
      const row: ChartRow = { year: y.year };
      for (const k of INDICATOR_KEYS) row[k] = y.indicators[k];
      return row;
    });
    for (const s of scenarios) {
      s.result.years.forEach((y, i) => {
        if (rows[i]) rows[i][`score_${s.id}`] = y.indicators.equity;
      });
    }
    return rows;
  }, [latest, scenarios]);

  const handleShare = async () => {
    const score = latest.score.toFixed(1);
    const text = `ECO//SIM — I scored ${score}/100 protecting Nusa Bay to 2050. Try to beat it: eco-simulator simulation for coastal sustainability.`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Result summary copied to clipboard");
    } catch {
      toast.error("Could not copy — your browser blocked clipboard access");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/simulator" />
      <main className="container py-8 flex-1 space-y-8">
        {/* Score header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid-paper tick-edge border border-border rounded-md p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="panel-label mb-2">Mission report · 2050 · educational simulation</div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                Final score: <span className="text-teal-signal">{latest.score.toFixed(1)}</span>
                <span className="text-muted-foreground text-lg font-medium"> / 100</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-2 max-w-xl">
                Nusa Bay reaches 2050 with a population of{" "}
                <span className="font-data">{latest.years[latest.years.length - 1].population.toLocaleString()}</span> and{" "}
                <span className="font-data">{budgetFinal.toFixed(0)} budget units</span> remaining.
                Here is exactly what your policy mix did — the good, the bad, and the unintended.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="btn-press inline-flex items-center gap-1.5 border border-border bg-card rounded-md px-3.5 py-2 font-data text-[11px] uppercase tracking-wider hover:bg-secondary transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share result
              </button>
              <Link
                href="/simulator"
                className="btn-press inline-flex items-center gap-1.5 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-4 py-2 text-sm hover:brightness-110 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try again
              </Link>
            </div>
          </div>

          {/* Mission targets */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {MISSION_TARGETS.map((t) => {
              const meta = INDICATOR_META[t.key];
              const val = final[t.key];
              const passed = t.direction === "above" ? val >= t.threshold : val <= t.threshold;
              return (
                <div key={t.key} className="border border-border rounded-md p-3 bg-background/40">
                  <div className="flex items-center gap-1.5 mb-1">
                    {passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-life" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-coral-risk" />
                    )}
                    <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-data text-lg font-semibold tabular-nums" style={{ color: meta.color }}>
                      {val.toFixed(0)}
                    </span>
                    <span className="font-data text-[10px] text-muted-foreground">
                      target {t.direction === "above" ? ">" : "<"} {t.threshold}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="border border-border rounded-md p-3 bg-background/40">
              <div className="flex items-center gap-1.5 mb-1">
                {budgetFinal > 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-life" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-coral-risk" />
                )}
                <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
                  Budget remaining
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-data text-lg font-semibold tabular-nums text-teal-signal">
                  {budgetFinal.toFixed(0)}
                </span>
                <span className="font-data text-[10px] text-muted-foreground">target &gt; 0</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Score breakdown (transparent weights) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="grid-paper tick-edge border border-border rounded-md p-5">
              <div className="panel-label mb-4">Transparent score breakdown · how 100 points are made</div>
              <div className="space-y-3">
                {latest.scoreBreakdown.map((row) => {
                  const meta = INDICATOR_META[row.key];
                  return (
                    <div key={row.key}>
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <span className="font-data text-[11px] uppercase tracking-wider text-muted-foreground">
                          {meta.label}
                        </span>
                        <span className="font-data text-xs text-muted-foreground">
                          weight ×{(row.weight * 100).toFixed(0)}% · value {row.value.toFixed(0)}
                        </span>
                        <span className="font-data text-sm font-semibold tabular-nums">
                          {row.points.toFixed(1)} / {(row.weight * 100).toFixed(0)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.points / (row.weight * 100)}%` }}
                          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {latest.penalties.length > 0 && (
                <div className="mt-4 border-l-2 border-coral-risk pl-3 space-y-1">
                  {latest.penalties.map((p, i) => (
                    <p key={i} className="text-xs text-coral-risk">{p}</p>
                  ))}
                </div>
              )}
              <div className="status-chip mt-4 inline-block">
                Scoring weights fixed &amp; published · same rules for everyone
              </div>
            </div>

            {/* Scenario comparison chart */}
            <div className="border border-border rounded-md p-5">
              <div className="panel-label mb-2">
                Strategy comparison · equity trend
              </div>
              {scenarios.length > 0 ? (
                <div className="grid-paper rounded-md p-2 border border-border">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={comparisonData}>
                      <CartesianGrid stroke="oklch(1 0 0 / 0.06)" strokeDasharray="2 3" />
                      <XAxis
                        dataKey="year"
                        tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "oklch(0.68 0.03 230)" }}
                        ticks={[2026, 2035, 2045, 2050]}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "oklch(0.68 0.03 230)" }}
                        ticks={[0, 50, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.21 0.04 250)",
                          border: "1px solid oklch(0.33 0.04 245)",
                          borderRadius: 8,
                          fontFamily: "IBM Plex Mono",
                          fontSize: 11,
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === "equity") return [value.toFixed(1), "Current strategy"];
                          const s = scenarios.find((x) => x.id === name.replace("score_", ""));
                          return [value.toFixed(1), s?.name ?? name];
                        }}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend
                        formatter={(value) => {
                          if (value === "equity") return <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10 }}>Current</span>;
                          const s = scenarios.find((x) => x.id === value.replace("score_", ""));
                          return <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10 }}>{s?.name ?? value}</span>;
                        }}
                      />
                      <Line type="monotone" dataKey="equity" stroke="#f472b6" strokeWidth={2} dot={false} name="Current" />
                      {scenarios.map((s, i) => (
                        <Line
                          key={s.id}
                          type="monotone"
                          dataKey={`score_${s.id}`}
                          stroke={["#2dd4bf", "#a78bfa", "#fbbf24", "#60a5fa"][i % 4]}
                          strokeWidth={1.5}
                          strokeDasharray="5 4"
                          dot={false}
                          name={s.id}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="border border-dashed border-border rounded-md p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    No saved scenarios yet. Save a strategy in the simulator to compare
                    side-by-side here.
                  </p>
                  <Link
                    href="/simulator"
                    className="btn-press inline-flex items-center gap-1.5 font-data text-[11px] uppercase tracking-wider border border-border rounded-md px-3.5 py-2 hover:bg-secondary transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Build another strategy
                  </Link>
                </div>
              )}
            </div>

            {/* What changed per indicator */}
            <div className="grid-paper tick-edge border border-border rounded-md p-5">
              <div className="panel-label mb-4">What changed · baseline → 2050</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="font-data text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="text-left py-2 pr-4 font-medium">Indicator</th>
                      <th className="text-right py-2 px-3 font-medium">2026 baseline</th>
                      <th className="text-right py-2 px-3 font-medium">2050 result</th>
                      <th className="text-right py-2 font-medium">Δ vs baseline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDICATOR_KEYS.map((k) => {
                      const meta = INDICATOR_META[k];
                      const delta = final[k] - base[k];
                      const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
                      return (
                        <tr key={k} className="border-b border-border/40">
                          <td className="py-2.5 pr-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                            <span className="font-data text-[11px] uppercase tracking-wider">{meta.label}</span>
                          </td>
                          <td className="text-right font-data tabular-nums text-muted-foreground px-3">{base[k].toFixed(0)}</td>
                          <td className="text-right font-data tabular-nums font-medium px-3">{final[k].toFixed(0)}</td>
                          <td className="text-right font-data tabular-nums px-3">
                            <span className={`inline-flex items-center gap-1 ${good ? "text-emerald-life" : "text-coral-risk"}`}>
                              {good ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Right column: causal feed + saved scenarios */}
          <div className="space-y-5">
            <CausalChain links={latest.causalLinks} events={latest.events} eventsToShow={6} />

            <div className="tick-edge bg-card/60 border border-border rounded-md p-4 space-y-3">
              <div className="panel-label">Saved strategies · {scenarios.length}/4</div>
              {scenarios.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Save up to 4 strategies from the simulator to compare them here.
                </p>
              )}
              {scenarios.map((s) => (
                <div key={s.id} className="border border-border rounded-md p-3 bg-background/40">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-display font-semibold text-sm">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-data text-xs text-teal-signal tabular-nums">{s.result.score.toFixed(1)}</span>
                      <button
                        onClick={() => deleteScenario(s.id)}
                        className="text-muted-foreground hover:text-coral-risk transition-colors"
                        aria-label={`Delete ${s.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                    {Object.entries(s.controls).map(([k, v]) => (
                      <span key={k} className="font-data text-[9px] text-muted-foreground">
                        {SLIDER_LABELS[k] ?? k}: <span className="tabular-nums">{v}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-border bg-card/60 p-4">
              <div className="panel-label mb-2">Why this matters · learning note</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The model rewards strategies that combine ambition with
                balance — one strong investment alone rarely wins. Notice what
                improved when you didn't expect it to; that is the simulation
                teaching you about connected systems. This is an educational
                model with simplified assumptions, not a prediction about any
                real city.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-border mt-auto">
        <div className="container py-5 flex items-center justify-between">
          <span className="font-data text-[11px] text-muted-foreground">
            ECO//SIM · scorecard weights &amp; equations are public on the transparency page
          </span>
          <Link
            href="/transparency"
            className="font-data text-[11px] text-teal-signal hover:underline underline-offset-4"
          >
            How the score is calculated
          </Link>
        </div>
      </footer>
    </div>
  );
}
