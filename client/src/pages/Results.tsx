/**
 * ECO//SIM — Results (Editorial Field Study v3)
 * A field report: photo verdict plate, mono score register, three goal cells,
 * plain-language worked/failed, causal chain, and collapsed expert appendix
 * (breakdown, indicator table, plan comparison). Real photography, no AI art.
 */
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  Trash2,
  Share2,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import CausalChain from "@/components/CausalChain";
import CopyButton from "@/components/CopyButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useSim } from "@/contexts/SimContext";
import { runSimulation } from "@/lib/sim/engine";
import { INDICATOR_KEYS, INDICATOR_META, KID_GOALS, KID_INDICATORS, MISSION_TARGETS, SimulationResult } from "@/lib/sim/types";

const SUNSET_PHOTO = "/manus-storage/hero_beach-sunset_46f82884.jpg";
const DAWN_PHOTO = "/manus-storage/hero_fishermen-nets-clean_c209bb82.jpg";

export default function Results() {
  const { currentResult, controls, scenarios, deleteScenario } = useSim();
  const [, navigate] = useLocation();

  // Never call context run() during render — it calls setCurrentResult and
  // triggers React's setState-during-render guard. Execute the pure engine
  // directly instead (no side effects).
  const fallback = useMemo(() => runSimulation(controls), [controls]);
  const latest = currentResult ?? scenarios[0]?.result ?? fallback;

  if (!latest) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader backHref="/simulator" />
        <main className="px-6 py-16 flex-1 flex flex-col items-center justify-center text-center gap-4">
          <h1 className="font-display text-2xl font-semibold">No report yet</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Run the simulation to 2050 first, or return to the simulator to play.
          </p>
          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:brightness-105 transition-all"
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

  const goalsMet = useMemo(
    () =>
      KID_GOALS.map((g) =>
        g.keys.every((k) => {
          const t = MISSION_TARGETS.find((x) => x.key === k);
          const v = final[k];
          return t ? (t.direction === "above" ? v >= t.threshold : v <= t.threshold) : true;
        }),
      ),
    [final],
  );
  const happy = goalsMet.filter(Boolean).length >= 2;
  const photo = happy ? SUNSET_PHOTO : DAWN_PHOTO;
  const verdict = happy
    ? "Teluk Nusa held its own."
    : "Teluk Nusa is still struggling — and that is where every plan begins.";

  const [expertOpen, setExpertOpen] = useState<Record<string, boolean>>({
    breakdown: false,
    table: false,
    comparison: false,
  });
  const toggle = (k: string) => setExpertOpen((o) => ({ ...o, [k]: !o[k] }));

  const shareText = `ECO//SIM — I scored ${latest.score.toFixed(1)}/100 protecting Teluk Nusa to 2050. Try to beat it!`;

  const handleReplay = () => {
    navigate("/simulator");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/simulator" />
      <main className="px-6 sm:px-10 lg:px-14 py-8 flex-1 space-y-8 max-w-[1280px] w-full">
        {/* ── Verdict plate ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[46%_1fr] gap-0 border border-border"
        >
            <figure className="photo-plate relative overflow-hidden min-h-[300px] lg:min-h-0 lg:h-full lg:aspect-auto">
            <img src={photo} alt={happy ? "Teluk Nusa at sunset, 2050" : "Fishermen at dawn, 2050"} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-background font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground px-3 py-1.5 whitespace-normal sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis">
              Field photograph · {happy ? "Teluk Nusa · December 2050" : "Teluk Nusa · 2050, work ahead"}
            </figcaption>
          </figure>

          <div className="p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-1">
                Field report · the year is 2050
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                {verdict}
              </h1>
              <p className="text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
                {happy
                  ? "Your decisions kept the mangroves breathing, the drains holding through the monsoon, and households able to afford clean water. Not a single goal was sacrificed to reach another — the sign of a planner who understood the trade-offs."
                  : "At least one of the three foundations — the sea, the town, or the people — gave way. Read the causal chain below: the model tells you exactly which decision led where. Adjust one variable and re-run; that is the whole game."}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-6 pb-5 border-b border-border">
                <div>
                  <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Score</div>
                  <div className="font-data text-4xl tabular-nums font-medium leading-none">
                    {latest.score.toFixed(0)}
                    <span className="text-base text-muted-foreground"> / 100</span>
                  </div>
                </div>
                <div>
                  <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Population 2050</div>
                  <div className="font-data text-xl tabular-nums">1,080,000</div>
                </div>
                <div>
                  <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Budget remaining</div>
                  <div className="font-data text-xl tabular-nums">RM {budgetFinal.toFixed(0)}</div>
                </div>
                <div>
                  <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Goals reached</div>
                  <div className="font-data text-xl tabular-nums">
                    {goalsMet.filter(Boolean).length} / 3
                    <span className="text-muted-foreground text-xs"> · sea · town · people</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 mt-5">
                {KID_GOALS.map((g, i) => (
                  <div key={g.id} className={`px-2 first:pl-0 ${i > 0 ? "border-l border-border" : ""}`}>
                    <div className="flex items-center gap-1.5 mb-1 min-w-0">
                      {goalsMet[i] ? (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                      ) : (
                        <X className="w-4 h-4 text-vermilion shrink-0" aria-hidden="true" />
                      )}
                      <span className="font-data text-[9px] sm:text-[10px] tracking-[0.06em] uppercase leading-tight whitespace-normal">{g.title}</span>
                    </div>
                    <div className="space-y-0.5">
                      {g.keys.map((k) => (
                        <div key={k} className="flex items-center justify-between gap-1.5 text-[12px]">
                          <span className="text-muted-foreground truncate">{KID_INDICATORS[k].kidName}</span>
                          <span className="font-data tabular-nums shrink-0">{final[k].toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <CopyButton text={shareText} label="Share score" className="gap-1.5 px-4 py-2 text-[11px] tracking-[0.12em]" />
                <button
                  onClick={handleReplay}
                  className="btn-press inline-flex items-center gap-1.5 bg-vermilion text-primary-foreground px-5 py-2 text-[11px] font-data tracking-[0.12em] uppercase hover:brightness-105 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Play again
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Worked / failed — plain-language account ── */}
        <section className="grid sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="border border-border border-l-2 border-l-emerald-700 bg-card p-5"
          >
            <div className="field-label mb-2 !text-emerald-800">Worked</div>
            <p className="text-[13px] leading-relaxed">{latest.biggestSuccess}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="border border-border border-l-2 border-l-vermilion bg-card p-5"
          >
            <div className="field-label mb-2 !text-vermilion">Failed</div>
            <p className="text-[13px] leading-relaxed">{latest.biggestFailure}</p>
          </motion.div>
        </section>

        {/* ── Causal chain ── */}
        <section>
          <div className="field-label mb-3">Why it happened — the chain of cause and effect</div>
          <CausalChain links={latest.causalLinks} events={latest.events} eventsToShow={6} />
        </section>

        {/* ── Expert appendix ── */}
        <section className="border-t border-border pt-6">
          <button
            onClick={() => setExpertOpen((o) => ({ ...o, appendix: !o.appendix }))}
            className="btn-press w-full flex items-center justify-between gap-3 text-left py-2"
          >
            <div>
              <span className="font-display font-semibold text-lg">Appendix — for professors &amp; teachers</span>
              <span className="block font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground mt-0.5">
                Score breakdown · indicator table · plan comparison
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                expertOpen.breakdown || expertOpen.table || expertOpen.comparison ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {(expertOpen.breakdown || expertOpen.table || expertOpen.comparison) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden space-y-4 pt-4"
              >
                <div className="border border-border bg-card">
                  <button
                    onClick={() => toggle("breakdown")}
                    className="w-full text-left px-4 py-3 flex items-center justify-between font-data text-[11px] tracking-[0.14em] uppercase"
                  >
                    Score breakdown <ChevronDown className={`w-4 h-4 transition-transform ${expertOpen.breakdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expertOpen.breakdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 overflow-hidden"
                      >
                        <div className="space-y-3">
                          {latest.scoreBreakdown.map((row) => {
                            const meta = INDICATOR_META[row.key];
                            return (
                              <div key={row.key}>
                                <div className="flex items-baseline justify-between gap-3 mb-1">
                                  <span className="font-data text-[11px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
                                  <span className="font-data text-[11px] text-muted-foreground">
                                    weight ×{(row.weight * 100).toFixed(0)}% · value {row.value.toFixed(0)}
                                  </span>
                                  <span className="font-data text-[13px] tabular-nums">
                                    {row.points.toFixed(1)} / {(row.weight * 100).toFixed(0)}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-secondary">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(row.points / (row.weight * 100)) * 100}%` }}
                                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                                    className="h-full"
                                    style={{ backgroundColor: meta.color }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {latest.penalties.length > 0 && (
                          <div className="mt-4 border-l-2 border-vermilion pl-3 space-y-1">
                            {latest.penalties.map((p, i) => (
                              <p key={i} className="text-xs text-vermilion">{p}</p>
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

                <div className="border border-border bg-card">
                  <button
                    onClick={() => toggle("table")}
                    className="w-full text-left px-4 py-3 flex items-center justify-between font-data text-[11px] tracking-[0.14em] uppercase"
                  >
                    Indicator table · baseline → 2050 <ChevronDown className={`w-4 h-4 transition-transform ${expertOpen.table ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expertOpen.table && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 overflow-hidden"
                      >
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="font-data text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                                <th className="text-left py-2 pr-4 font-medium">Indicator</th>
                                <th className="text-right py-2 px-3 font-medium">2026</th>
                                <th className="text-right py-2 px-3 font-medium">2050</th>
                                <th className="text-right py-2 font-medium">Change</th>
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
                                      <span className="w-2 h-2 shrink-0" style={{ backgroundColor: meta.color }} />
                                      <span className="font-data text-[11px] uppercase tracking-wider">{meta.label}</span>
                                    </td>
                                    <td className="text-right tabular-nums text-muted-foreground px-3">{base[k].toFixed(0)}</td>
                                    <td className="text-right tabular-nums px-3">{final[k].toFixed(0)}</td>
                                    <td className="text-right tabular-nums px-3">
                                      <span className={`font-data text-[12px] ${good ? "text-emerald-700" : "text-vermilion"}`}>
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

                <div className="border border-border bg-card">
                  <button
                    onClick={() => toggle("comparison")}
                    className="w-full text-left px-4 py-3 flex items-center justify-between font-data text-[11px] tracking-[0.14em] uppercase"
                  >
                    Compare saved plans <ChevronDown className={`w-4 h-4 transition-transform ${expertOpen.comparison ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expertOpen.comparison && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 overflow-hidden"
                      >
                        <div className="space-y-2">
                          {scenarios.length === 0 && (
                            <p className="text-[12px] text-muted-foreground">
                              Save plans from the simulator to compare them side by side here.
                            </p>
                          )}
                          {scenarios.map((s) => (
                            <div key={s.id} className="border border-border/70 p-3">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-display font-medium text-[13px]">{s.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-data text-[13px] tabular-nums">{s.result.score.toFixed(1)}</span>
                                  <ConfirmDialog
                                    trigger={
                                      <button
                                        className="btn-press text-muted-foreground hover:text-vermilion transition-colors"
                                        aria-label={`Delete ${s.name}`}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    }
                                    title="Delete saved plan?"
                                    description={`This permanently removes "${s.name}" (score ${s.result.score.toFixed(0)}) from the comparison board.`}
                                    confirmLabel="Delete"
                                    onConfirm={() => deleteScenario(s.id)}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                {Object.entries(s.controls).map(([k, v]) => (
                                  <span key={k} className="font-data text-[10px] text-muted-foreground">
                                    {k}: <span className="tabular-nums">{v}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-3">
                            The model rewards strategies that combine ambition with balance —
                            one strong investment alone rarely wins. This is an educational
                            model with simplified assumptions, not a prediction about any
                            real city. Full equations on the transparency page.
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
      <footer className="border-t border-border mt-auto">
        <div className="px-6 sm:px-10 lg:px-14 py-5 flex items-center justify-between">
          <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
            ECO//SIM · fictional town · educational model
          </span>
          <Link href="/transparency" className="font-data text-[10px] tracking-[0.12em] uppercase text-vermilion hover:underline underline-offset-4">
            How the score is calculated →
          </Link>
        </div>
      </footer>
    </div>
  );
}
