/**
 * ECO//SIM — Results (Kampung Coast v2)
 * Story first: big mood scene + one sentence verdict + 3 traffic lights.
 * Depth hidden in expandable "for teachers" panels (breakdown, table, comparison).
 */
import { useMemo, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Share2,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import CausalChain from "@/components/CausalChain";
import { useSim } from "@/contexts/SimContext";
import { INDICATOR_KEYS, INDICATOR_META, KID_GOALS, KID_INDICATORS, MISSION_TARGETS, SimulationResult } from "@/lib/sim/types";

const HAPPY = "/manus-storage/city-happy_12950284.png";
const SAD = "/manus-storage/city-sad_01d243a3.png";

export default function Results() {
  const { currentResult, scenarios, deleteScenario, run } = useSim();
  const [, navigate] = useLocation();

  // Lazy fallback: if nothing has been run yet, compute once (deterministic)
  // and keep it stable across renders — no setState during render.
  const fallbackRef = useRef<SimulationResult | null>(null);
  const latest = currentResult ?? scenarios[0]?.result ?? (fallbackRef.current ??= run());

  if (!latest) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader backHref="/simulator" />
        <main className="container py-16 flex-1 flex flex-col items-center justify-center text-center gap-4">
          <h1 className="font-display text-2xl font-bold">No story yet</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Run the simulation to 2050 first, or jump into the simulator to play.
          </p>
          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-bold rounded-full px-6 py-3 hover:brightness-105 transition-all"
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
  const moodScore = useMemo(() => {
    const keys = Object.keys(final) as (keyof typeof final)[];
    return keys.reduce((a, k) => a + final[k], 0) / keys.length;
  }, [final]);
  // How many of the 3 big goals are green
  const goalsMet = useMemo(() => KID_GOALS.map((g) => g.keys.every((k) => {
    const t = MISSION_TARGETS.find((x) => x.key === k);
    const v = final[k];
    return t ? (t.direction === "above" ? v >= t.threshold : v <= t.threshold) : true;
  })), [final]);

  // Verdict = goals reached, not a raw average — so the story always matches
  // the traffic lights.
  const happy = goalsMet.filter(Boolean).length >= 2;

  const [expertOpen, setExpertOpen] = useState<Record<string, boolean>>({
    breakdown: false,
    table: false,
    comparison: false,
  });

  const toggle = (k: string) => setExpertOpen((o) => ({ ...o, [k]: !o[k] }));

  const handleShare = async () => {
    const score = latest.score.toFixed(1);
    const text = `ECO//SIM — I scored ${score}/100 protecting Teluk Nusa to 2050. Try to beat it!`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Result copied!");
    } catch {
      toast.error("Could not copy — clipboard blocked");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/simulator" />
      <main className="container py-8 flex-1 space-y-8">
        {/* Verdict — the story in one picture */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="soft-card p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-6">
            <img
              src={happy ? HAPPY : SAD}
              alt={happy ? "A happy Teluk Nusa in 2050" : "A troubled Teluk Nusa in 2050"}
              className="w-56 h-32 object-cover object-top rounded-2xl border-4 border-white shadow-xl"
            />
            <div className="flex-1 min-w-[240px]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                The year is 2050
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
                {happy ? "Teluk Nusa is happy!" : "Teluk Nusa is having a hard time."}
              </h1>
              <p className="text-base text-muted-foreground mt-2 max-w-xl leading-relaxed">
                {happy
                  ? "The sea is clean, the town is safe from floods, and the people are proud of their home. Pak Ali smiles every morning at the bay."
                  : "Some parts of the town are hurting — the sea, the floods, or the people. That's okay: every great city planner fails a few times before they get it right."}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="font-display text-3xl font-extrabold text-teal-signal tabular-nums">
                  {latest.score.toFixed(0)}<span className="text-lg text-muted-foreground font-bold"> / 100</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-sm">
                  <div className="font-bold text-foreground tabular-nums">1,080,000 people</div>
                  <div className="text-muted-foreground">RM {budgetFinal.toFixed(0)} left in the bank</div>
                </div>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <div className="hidden sm:block text-sm">
                  <div className="font-bold text-foreground">{goalsMet.filter(Boolean).length}/3 goals reached</div>
                  <div className="text-muted-foreground">sea · town · people</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={handleShare}
                  className="btn-press inline-flex items-center gap-1.5 border border-border bg-card rounded-full px-4 py-2 text-xs font-bold hover:bg-secondary transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share my score
                </button>
                <Link
                  href="/simulator"
                  className="btn-press inline-flex items-center gap-1.5 bg-teal-signal text-primary-foreground font-display font-bold rounded-full px-5 py-2 text-sm hover:brightness-105 transition-all shadow-md shadow-teal-signal/25"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Play again
                </Link>
              </div>
            </div>
          </div>

          {/* The 3 big goals as traffic lights */}
          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            {KID_GOALS.map((g, i) => (
              <div key={g.id} className="soft-card p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  {goalsMet[i] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-life" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-5 h-5 text-coral-risk" aria-hidden="true" />
                  )}
                  <span className="font-display font-bold">{g.title}</span>
                </div>
                <div className="font-data text-[10px] text-muted-foreground mb-1.5">{g.bm}</div>
                <div className="space-y-1">
                  {g.keys.map((k) => (
                    <div key={k} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground font-semibold">{KID_INDICATORS[k].kidName}</span>
                      <span className="font-display font-extrabold tabular-nums" style={{ color: INDICATOR_META[k].color }}>
                        {final[k].toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What went well / what went wrong — the plain story */}
        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="soft-card p-5 border-l-4 border-emerald-life"
          >
            <div className="font-display font-bold text-lg text-emerald-life mb-2">What went well</div>
            <p className="text-sm leading-relaxed">{latest.biggestSuccess}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="soft-card p-5 border-l-4 border-coral-risk"
          >
            <div className="font-display font-bold text-lg text-coral-risk mb-2">Oh no — what went wrong</div>
            <p className="text-sm leading-relaxed">{latest.biggestFailure}</p>
          </motion.div>
        </div>

        {/* Causal chain — "Kenapa? Because..." */}
        <div>
          <div className="panel-label mb-2">Kenapa? — because...</div>
          <CausalChain links={latest.causalLinks} events={latest.events} eventsToShow={6} />
        </div>

        {/* Expert section — collapsed by default */}
        <section className="space-y-3">
          <button
            onClick={() => toggle("expert")}
            className="btn-press w-full soft-card p-4 flex items-center justify-between gap-3 text-left"
          >
            <div>
              <div className="font-display font-bold">The deep stuff — for professors & teachers</div>
              <div className="text-sm text-muted-foreground">
                Full scoring breakdown, indicator table, and plan comparison
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${expertOpen.breakdown || expertOpen.table || expertOpen.comparison ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {(expertOpen.breakdown || expertOpen.table || expertOpen.comparison) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden space-y-4"
              >
                <div className="soft-card p-5">
                  <button onClick={() => toggle("breakdown")} className="w-full text-left font-display font-bold mb-3 flex items-center justify-between">
                    Score breakdown <ChevronDown className={`w-4 h-4 transition-transform ${expertOpen.breakdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expertOpen.breakdown && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <div className="space-y-3">
                          {latest.scoreBreakdown.map((row) => {
                            const meta = INDICATOR_META[row.key];
                            return (
                              <div key={row.key}>
                                <div className="flex items-baseline justify-between gap-3 mb-1">
                                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">{meta.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    weight ×{(row.weight * 100).toFixed(0)}% · value {row.value.toFixed(0)}
                                  </span>
                                  <span className="text-sm font-bold tabular-nums">
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
                          Scoring weights fixed &amp; published on the transparency page
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="soft-card p-5">
                  <button onClick={() => toggle("table")} className="w-full text-left font-display font-bold mb-3 flex items-center justify-between">
                    Indicator table · baseline → 2050 <ChevronDown className={`w-4 h-4 transition-transform ${expertOpen.table ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expertOpen.table && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                                <th className="text-left py-2 pr-4 font-bold">Indicator</th>
                                <th className="text-right py-2 px-3 font-bold">2026</th>
                                <th className="text-right py-2 px-3 font-bold">2050</th>
                                <th className="text-right py-2 font-bold">Change</th>
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
                                      <span className="text-[11px] uppercase tracking-wider font-bold">{meta.label}</span>
                                    </td>
                                    <td className="text-right tabular-nums text-muted-foreground px-3">{base[k].toFixed(0)}</td>
                                    <td className="text-right tabular-nums font-bold px-3">{final[k].toFixed(0)}</td>
                                    <td className="text-right tabular-nums px-3">
                                      <span className={`inline-flex items-center gap-1 font-bold ${good ? "text-emerald-life" : "text-coral-risk"}`}>
                                        {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="soft-card p-5">
                  <button onClick={() => toggle("comparison")} className="w-full text-left font-display font-bold mb-3 flex items-center justify-between">
                    Compare your plans <ChevronDown className={`w-4 h-4 transition-transform ${expertOpen.comparison ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expertOpen.comparison && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <div className="space-y-2">
                          {scenarios.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              Save plans from the simulator to compare them side by side here.
                            </p>
                          )}
                          {scenarios.map((s) => (
                            <div key={s.id} className="soft-card p-3">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-display font-bold text-sm">{s.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-display text-teal-signal font-extrabold tabular-nums">{s.result.score.toFixed(1)}</span>
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
                                  <span key={k} className="text-[10px] text-muted-foreground">
                                    {k}: <span className="tabular-nums font-bold">{v}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                            The model rewards strategies that combine ambition with balance —
                            one strong investment alone rarely wins. This is an educational
                            model with simplified assumptions, not a prediction about any
                            real city. Full equations: transparency page.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <footer className="border-t border-border/60 mt-auto">
        <div className="container py-5 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            ECO//SIM · a fictional town · an educational game
          </span>
          <Link href="/transparency" className="text-[11px] text-teal-signal font-bold hover:underline underline-offset-4">
            How the score is calculated →
          </Link>
        </div>
      </footer>
    </div>
  );
}
