/**
 * ECO//SIM — Simulator cockpit
 * Style: Deep Ocean Console — asymmetric three-band console:
 * header strip (year readout + budget) / map left + policy dials right /
 * indicator strip + chart + causal feed below. Animated 2026→2050 playback
 * with speed controls (1yr / 5yr / to 2050).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, FastForward, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import CityMap from "@/components/CityMap";
import ControlPanel from "@/components/ControlPanel";
import IndicatorStrip from "@/components/IndicatorStrip";
import TimelineChart, { ChartRow } from "@/components/TimelineChart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSim } from "@/contexts/SimContext";
import { runSimulation } from "@/lib/sim/engine";
import { INDICATOR_KEYS, INDICATOR_META } from "@/lib/sim/types";

export default function Simulator() {
  const { controls, setControl, resetControls, run, saveScenario } = useSim();
  const [, navigate] = useLocation();

  const [previewResult, setPreviewResult] = useState<ReturnType<typeof runSimulation> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [displayYear, setDisplayYear] = useState(2026);
  const [speed, setSpeed] = useState<1 | 5 | 25>(25);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preview recomputes instantly as sliders move (deterministic, cheap)
  useEffect(() => {
    const r = runSimulation(controls);
    setPreviewResult(r);
  }, [controls]);

  // Playback loop
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const step = speed === 25 ? 1 : speed;
    intervalRef.current = setInterval(() => {
      setDisplayYear((y) => {
        const next = Math.min(2050, y + step);
        if (next >= 2050) {
          setPlaying(false);
          return 2050;
        }
        return next;
      });
    }, 420);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speed]);

  // Auto-play on Run
  const handleRun = () => {
    setDisplayYear(2026);
    setPlaying(true);
    toast("Simulation started", {
      description: "Watching 2026 → 2050 unfold. Adjust speed or jump to results anytime.",
    });
  };

  const handleStop = () => setPlaying(false);

  const handleFinishEarly = () => {
    setPlaying(false);
    setDisplayYear(2050);
  };

  const indicatorsAtDisplay = useMemo(() => {
    if (!previewResult) return null;
    const y = previewResult.years.find((yr) => yr.year === displayYear) ?? previewResult.years[previewResult.years.length - 1];
    return y.indicators;
  }, [previewResult, displayYear]);

  const chartData: ChartRow[] = useMemo(() => {
    if (!previewResult) return [];
    const slice = previewResult.years.filter((y) => y.year <= displayYear);
    return slice.map((y) => {
      const row: ChartRow = { year: y.year };
      for (const k of INDICATOR_KEYS) row[k] = y.indicators[k];
      return row;
    });
  }, [previewResult, displayYear]);

  const historyForSparklines = useMemo(() => {
    if (!previewResult) return [];
    return previewResult.years
      .filter((y) => y.year < displayYear)
      .slice(-12)
      .map((y) => ({ indicators: y.indicators }));
  }, [previewResult, displayYear]);

  const finished = displayYear >= 2050 && previewResult;

  const handleSave = () => {
    if (!saveName.trim()) {
      toast.error("Name your scenario first");
      return;
    }
    saveScenario(saveName.trim());
    setSaveOpen(false);
    setSaveName("");
    toast.success("Scenario saved", { description: "You can compare up to 4 strategies on the results screen." });
  };

  const runningBudget = useMemo(() => {
    if (!previewResult) return 100;
    const y = previewResult.years.find((yr) => yr.year === displayYear) ?? previewResult.years[previewResult.years.length - 1];
    return y.budgetRemaining;
  }, [previewResult, displayYear]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/briefing" />

      {/* Header strip: year readout + budget + run controls */}
      <div className="border-b border-border bg-secondary/40">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-2.5">
          <div className="flex items-center gap-4">
            <div>
              <div className="font-data text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Simulation year
              </div>
              <div className="font-data text-2xl font-semibold text-teal-signal tabular-nums leading-none animate-pulse-glow">
                {displayYear}
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-data text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Budget remaining
              </div>
              <div
                className={`font-data text-2xl font-semibold tabular-nums leading-none ${
                  runningBudget < 20 ? "text-coral-risk" : runningBudget < 40 ? "text-amber-warn" : "text-emerald-life"
                }`}
              >
                {runningBudget.toFixed(0)}
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <div className="font-data text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Population
              </div>
              <div className="font-data text-lg font-medium tabular-nums leading-none">
                {(previewResult?.years.find((y) => y.year === displayYear)?.population ?? 1_000_000).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!playing ? (
              <button
                onClick={handleRun}
                className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-5 py-2 hover:brightness-110 transition-all"
              >
                <Play className="w-4 h-4" /> {displayYear > 2026 ? "Re-run 2026–2050" : "Run simulation"}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="btn-press inline-flex items-center gap-2 border border-border bg-card rounded-md px-4 py-2 font-data text-xs uppercase tracking-wider hover:bg-secondary transition-colors"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            )}
            <button
              onClick={handleFinishEarly}
              disabled={!playing}
              className="btn-press inline-flex items-center gap-1.5 border border-border bg-card rounded-md px-3 py-2 font-data text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
              title="Jump to 2050"
            >
              <FastForward className="w-3.5 h-3.5" /> To 2050
            </button>

            <div className="flex border border-border rounded-md overflow-hidden" role="group" aria-label="Playback speed">
              {([1, 5, 25] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`btn-press px-2.5 py-2 font-data text-[10px] uppercase tracking-wider transition-colors ${
                    speed === s ? "bg-teal-signal/20 text-teal-signal" : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                  title={s === 25 ? "Run to 2050 (1 year steps)" : s === 5 ? "5-year steps" : "1-year steps"}
                >
                  {s === 25 ? "RUN" : `+${s}y`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container py-6 flex-1 grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: map + indicators + chart + causal */}
        <div className="space-y-5 min-w-0">
          <CityMap controls={controls} indicators={indicatorsAtDisplay} year={displayYear} />

          <AnimatePresence mode="wait">
            {indicatorsAtDisplay && (
              <motion.div
                key={displayYear}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div className="panel-label mb-2">
                  Live indicators · baseline {INDICATOR_KEYS[0] === "climatePressure" ? "dashed line" : ""} 2026
                </div>
                <IndicatorStrip
                  indicators={indicatorsAtDisplay}
                  baseline={previewResult!.baselineYear.indicators}
                  history={historyForSparklines}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <div className="panel-label mb-2">Trajectory · {chartData[0]?.year ?? 2026} – {displayYear}</div>
            <TimelineChart data={chartData} />
          </div>

          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="tick-edge bg-card/70 border border-teal-signal/40 rounded-md p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-data text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Simulation complete · 2050
                  </div>
                  <div className="font-display text-2xl font-bold mt-0.5">
                    Final score: <span className="text-teal-signal">{previewResult!.score.toFixed(1)} / 100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="btn-press" onClick={() => setSaveOpen(true)}>
                    <Save className="w-4 h-4 mr-1" /> Save scenario
                  </Button>
                  <Button
                    className="btn-press bg-teal-signal text-primary-foreground hover:bg-teal-signal/90"
                    onClick={() => {
                      run();
                      navigate("/results");
                    }}
                  >
                    Open results <SkipForward className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="border-l-2 border-emerald-life pl-3">
                  <div className="font-data text-[10px] uppercase tracking-wider text-emerald-life mb-1">Biggest success</div>
                  {previewResult!.biggestSuccess}
                </div>
                <div className="border-l-2 border-coral-risk pl-3">
                  <div className="font-data text-[10px] uppercase tracking-wider text-coral-risk mb-1">Unintended consequence</div>
                  {previewResult!.biggestFailure}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: policy console */}
        <aside className="lg:sticky lg:top-20 lg:self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          <div className="panel-label mb-2">Policy console · 8 controls</div>
          <ControlPanel controls={controls} onChange={setControl} onReset={resetControls} />
          <div className="mt-4 rounded-md border border-border bg-card/60 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
                Quick retry loop
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Change a few sliders, hit Run again, and compare against your
              saved scenarios. There is no perfect answer — find the trade-offs.
            </p>
          </div>
        </aside>
      </main>

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle className="font-display">Save this scenario</DialogTitle>
            <DialogDescription className="text-sm">
              Save your policy mix to compare up to 4 strategies side-by-side
              on the results screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. Green growth, coastal caution"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="font-data"
            />
            <Button onClick={handleSave} className="btn-press bg-teal-signal text-primary-foreground hover:bg-teal-signal/90">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
