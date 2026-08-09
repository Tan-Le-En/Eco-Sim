/**
 * ECO//SIM — Simulator (Kampung Coast v2)
 * Style: warm picture-book cockpit. Big friendly year readout, "How is the
 * town feeling?" indicators, story-first finish card. Engine untouched.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, FastForward, Save, RotateCcw, Lightbulb, Coins } from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import CityMap from "@/components/CityMap";
import ControlPanel from "@/components/ControlPanel";
import IndicatorStrip from "@/components/IndicatorStrip";
import TownMood from "@/components/TownMood";
import TimelineChart, { ChartRow } from "@/components/TimelineChart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSim } from "@/contexts/SimContext";
import { runSimulation } from "@/lib/sim/engine";
import { INDICATOR_KEYS } from "@/lib/sim/types";

const HAPPY = "/manus-storage/city-happy_12950284.png";
const SAD = "/manus-storage/city-sad_01d243a3.png";

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

  useEffect(() => {
    const r = runSimulation(controls);
    setPreviewResult(r);
  }, [controls]);

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

  const handleRun = () => {
    setDisplayYear(2026);
    setPlaying(true);
    toast("Simulation started!", { description: "Watch Teluk Nusa grow from 2026 to 2050." });
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

  // Overall town mood at finish: average of the 7 indicators
  const moodScore = useMemo(() => {
    if (!finished || !previewResult) return 50;
    const last = previewResult.years[previewResult.years.length - 1];
    const keys = Object.keys(last.indicators) as (keyof typeof last.indicators)[];
    return keys.reduce((a, k) => a + last.indicators[k], 0) / keys.length;
  }, [finished, previewResult]);

  const handleSave = () => {
    if (!saveName.trim()) {
      toast.error("Give your plan a name first");
      return;
    }
    saveScenario(saveName.trim());
    setSaveOpen(false);
    setSaveName("");
    toast.success("Plan saved!", { description: "You can compare up to 4 plans on the results screen." });
  };

  const runningBudget = useMemo(() => {
    if (!previewResult) return 100;
    const y = previewResult.years.find((yr) => yr.year === displayYear) ?? previewResult.years[previewResult.years.length - 1];
    return y.budgetRemaining;
  }, [previewResult, displayYear]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/briefing" />

      {/* Friendly header strip: year + money + play controls */}
      <div className="border-b border-border/60 bg-secondary/30">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">The year is</div>
              <motion.div
                key={displayYear}
                initial={{ scale: 0.92, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="font-display text-4xl font-extrabold text-teal-signal leading-none tabular-nums"
              >
                {displayYear}
              </motion.div>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-warn" aria-hidden="true" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Money left</div>
                <div
                  className={`font-display text-2xl font-extrabold leading-none tabular-nums ${
                    runningBudget < 20 ? "text-coral-risk" : runningBudget < 40 ? "text-amber-warn" : "text-emerald-life"
                  }`}
                >
                  RM {runningBudget.toFixed(0)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!playing ? (
              <button
                onClick={handleRun}
                className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-bold rounded-full px-6 py-2.5 hover:brightness-105 transition-all shadow-md shadow-teal-signal/25"
              >
                <Play className="w-4 h-4" /> {displayYear > 2026 ? "Run again 2026–2050" : "Run the story!"}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="btn-press inline-flex items-center gap-2 border border-border bg-card rounded-full px-4 py-2.5 text-xs font-bold hover:bg-secondary transition-colors"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            )}
            <button
              onClick={handleFinishEarly}
              disabled={!playing}
              className="btn-press inline-flex items-center gap-1.5 border border-border bg-card rounded-full px-3.5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
              title="Jump to 2050"
            >
              <FastForward className="w-3.5 h-3.5" /> To 2050
            </button>

            <div className="flex border border-border rounded-full overflow-hidden" role="group" aria-label="Playback speed">
              {([1, 5, 25] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`btn-press px-3 py-2 text-[11px] font-bold transition-colors ${
                    speed === s ? "bg-teal-signal/15 text-teal-signal" : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                  title={s === 25 ? "Fast" : s === 5 ? "5-year steps" : "1-year steps, slow"}
                >
                  {s === 25 ? "Fast" : `Slow (${s}y)`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container py-6 flex-1 grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: map + indicators + chart + finish */}
        <div className="space-y-5 min-w-0">
          {/* One-glance layer: living mood portrait → three traffic lights */}
          {indicatorsAtDisplay && <TownMood indicators={indicatorsAtDisplay} year={displayYear} />}

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
                  How is the town feeling? · {displayYear}
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
            <div className="panel-label mb-2">The story so far · {chartData[0]?.year ?? 2026} – {displayYear}</div>
            <TimelineChart data={chartData} />
          </div>

          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="soft-card p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={moodScore >= 58 ? HAPPY : SAD}
                  alt={moodScore >= 58 ? "A happy Teluk Nusa" : "A troubled Teluk Nusa"}
                  className="w-40 h-24 object-cover object-top rounded-2xl border-4 border-white shadow-md"
                />
                <div className="flex-1 min-w-[200px]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    The year is 2050 — your story is finished
                  </div>
                  <div className="font-display text-2xl font-extrabold mt-0.5">
                    Town happiness: <span className="text-teal-signal">{previewResult!.score.toFixed(0)} / 100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">
                    {moodScore >= 58
                      ? "Teluk Nusa is happy! The sea is clean, the town is safe, and the people are proud."
                      : "Teluk Nusa is struggling. Some things went wrong — see why, and try a different plan!"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="btn-press" onClick={() => setSaveOpen(true)}>
                    <Save className="w-4 h-4 mr-1" /> Save plan
                  </Button>
                  <Button
                    className="btn-press bg-teal-signal text-primary-foreground hover:bg-teal-signal/90"
                    onClick={() => {
                      run();
                      navigate("/results");
                    }}
                  >
                    See the full story <FastForward className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="border-l-4 border-emerald-life pl-3 bg-emerald-life/10 rounded-r-lg py-2 pr-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-life" aria-hidden="true" />
                    <span className="text-[10px] uppercase tracking-wider text-emerald-life font-bold">What went well</span>
                  </div>
                  {previewResult!.biggestSuccess}
                </div>
                <div className="border-l-4 border-coral-risk pl-3 bg-coral-risk/10 rounded-r-lg py-2 pr-3">
                  <div className="text-[10px] uppercase tracking-wider text-coral-risk font-bold mb-1">Oh no — what went wrong</div>
                  {previewResult!.biggestFailure}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: policy controls */}
        <aside className="lg:sticky lg:top-20 lg:self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          <div className="panel-label mb-2">
            Your 8 choices · every year
          </div>
          <ControlPanel controls={controls} onChange={setControl} onReset={resetControls} />
          <div className="mt-4 soft-card p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Try again?
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Move a few sliders, press Run again, and see what changes. There
              is no perfect answer — that's what makes it fun.
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link href="/transparency" className="text-xs font-bold text-muted-foreground hover:text-teal-signal transition-colors">
              How does this game work? (for teachers) →
            </Link>
          </div>
        </aside>
      </main>

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle className="font-display">Save this plan</DialogTitle>
            <DialogDescription className="text-sm">
              Give your choices a name so you can compare up to 4 plans side by
              side on the results screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. Green future, careful coast"
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
