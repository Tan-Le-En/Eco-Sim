/**
 * ECO//SIM — Simulator (Editorial Field Study v3)
 * One viewport: top instrument bar (year · budget · transport), left column
 * (mood band → town survey map → indicators), right ledger (8 decisions),
 * bottom trajectory strip. Flat plates, hairline rules, mono numerals.
 * Engine untouched.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Play, Pause, FastForward, Save, Lightbulb, Coins } from "lucide-react";
import { goalsMetCount } from "@/components/TownMood";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MISSION_TARGETS } from "@/lib/sim/types";
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

const FINISH_PHOTO = "/manus-storage/fishermen-dawn-nets-real_81f6e009.jpeg";
const DAWN_PHOTO = "/manus-storage/fishermen-net-cast-real_a6fc104d.jpg";

export default function Simulator() {
  const { controls, setControl, resetControls, run, saveScenario } = useSim();
  const [, navigate] = useLocation();

  const [previewResult, setPreviewResult] = useState<ReturnType<typeof runSimulation> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [displayYear, setDisplayYear] = useState(2026);
  const [speed, setSpeed] = useState<1 | 5 | 25>(25);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const [lastTick, setLastTick] = useState(0);

  // Keep refs in sync with state for the animation loop.
  playingRef.current = playing;
  speedRef.current = speed;

  // Precompute the full simulation once per controls change; every other
  // read is a plain array lookup (no re-run).
  const fullResult = useMemo(() => runSimulation(controls), [controls]);

  useEffect(() => {
    setPreviewResult(fullResult);
  }, [fullResult]);

  // RAF-driven playback: steps years at a fixed wall-clock cadence, so "Fast"
  // advances several years per frame and the UI never queues up.
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!playing) return;
    let last = performance.now();
    const loop = (now: number) => {
      if (!playingRef.current) return;
      // Slower playback: 1y = 300ms per step, 5y = 250ms/step, Fast(25y) = 80ms/step
      const interval = speedRef.current === 25 ? 80 : speedRef.current === 5 ? 250 : 300;
      const elapsed = now - last;
      if (elapsed >= interval) {
        const steps = Math.floor(elapsed / interval);
        setLastTick((t) => t + 1);
        setDisplayYear((y) => {
          const next = Math.min(2050, y + steps * speedRef.current);
          if (next >= 2050) {
            setPlaying(false);
            return 2050;
          }
          return next;
        });
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  // Suppress unused warning — lastTick forces re-render cadence during play.
  void lastTick;

  const handleRun = () => {
    setDisplayYear(2026);
    setPlaying(true);
    toast("Simulation started", { description: "Teluk Nusa runs from 2026 to 2050." });
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

  // Sampled chart data: at most ~14 points regardless of elapsed years,
  // so Recharts never re-lays-out hundreds of points mid-playback.
  const chartData: ChartRow[] = useMemo(() => {
    if (!previewResult) return [];
    const slice = previewResult.years.filter((y) => y.year <= displayYear);
    if (slice.length <= 14) {
      return slice.map((y) => {
        const row: ChartRow = { year: y.year };
        for (const k of INDICATOR_KEYS) row[k] = y.indicators[k];
        return row;
      });
    }
    const step = (slice.length - 1) / 13;
    const rows: ChartRow[] = [];
    for (let i = 0; i < 14; i++) {
      const y = slice[Math.round(i * step)];
      const row: ChartRow = { year: y.year };
      for (const k of INDICATOR_KEYS) row[k] = y.indicators[k];
      rows.push(row);
    }
    return rows;
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
      toast.error("Give your plan a name first");
      return;
    }
    saveScenario(saveName.trim());
    setSaveOpen(false);
    setSaveName("");
    toast.success("Plan saved", { description: "Compare up to 4 plans on the results screen." });
  };

  const runningBudget = useMemo(() => {
    if (!previewResult) return 100;
    const y = previewResult.years.find((yr) => yr.year === displayYear) ?? previewResult.years[previewResult.years.length - 1];
    return y.budgetRemaining;
  }, [previewResult, displayYear]);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <PageMeta
        title="ECO//SIM — The simulator · govern Teluk Nusa 2026–2050"
        description="Move the eight policy dials and run 25 years. Watch the sea, the town, and the people respond. Every equation published."
      />
      <SiteHeader backHref="/briefing" />

      {/* ── Instrument bar: year · budget · mission target ── */}
      <div className="border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <div>
              <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">Year</div>
              <div
                className="font-data text-3xl tabular-nums font-medium leading-tight"
                style={{ transition: "opacity 200ms ease" }}
              >
                {displayYear}
              </div>
            </div>
            {/* Mission chip: the clear goal, always visible while playing */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 border border-border bg-card px-3 py-1.5 cursor-help hover:border-vermilion/60 transition-colors">
                  <span className="font-data text-[10px] tracking-[0.14em] uppercase text-vermilion font-semibold whitespace-nowrap">
                    Mission
                  </span>
                  <span className="font-data text-[11px] tabular-nums whitespace-nowrap">
                    {indicatorsAtDisplay ? goalsMetCount(indicatorsAtDisplay) : 0} / 5 targets
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="rounded-none border-border max-w-xs" side="bottom">
                <p className="font-data text-[11px] leading-relaxed">
                  <span className="font-bold uppercase tracking-wider text-vermilion">Your 5 targets by 2050:</span>
                  {MISSION_TARGETS.map((m) => (
                    <span key={m.key} className="block">
                      · {missionLabel(m.key)} {m.direction === "above" ? "≥ " + m.threshold : "≤ " + m.threshold}
                    </span>
                  ))}
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">Budget</div>
                <div
                  className={`font-data text-xl tabular-nums leading-tight ${
                    runningBudget < 20 ? "text-vermilion" : runningBudget < 40 ? "text-vermilion/70" : "text-foreground"
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
                className="btn-press inline-flex items-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:brightness-105 transition-all"
              >
                <Play className="w-3.5 h-3.5" /> {displayYear > 2026 ? "Re-run 2026–2050" : "Run simulation"}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="btn-press inline-flex items-center gap-2 border border-foreground px-4 py-2.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                <Pause className="w-3 h-3" /> Pause
              </button>
            )}
            <button
              onClick={handleFinishEarly}
              disabled={!playing}
              className="btn-press inline-flex items-center gap-1.5 border border-border px-3 py-2.5 font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
              title="Jump to 2050"
            >
              <FastForward className="w-3 h-3" /> To 2050
            </button>
            <div className="flex border border-border" role="group" aria-label="Playback speed">
              {([1, 5, 25] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`btn-press px-2.5 py-2 font-data text-[10px] tracking-wider uppercase transition-colors ${
                    speed === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === 25 ? "Fast" : `${s}y`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-3 grid lg:grid-cols-[1fr_340px] gap-4 max-w-[1500px] w-full h-[calc(100vh-8.5rem)] overflow-hidden">
        {/* Left: mood → map → indicators → trajectory */}
        <div className="space-y-3 min-w-0 flex flex-col overflow-hidden">
          {indicatorsAtDisplay && <TownMood indicators={indicatorsAtDisplay} year={displayYear} />}
          <CityMap controls={controls} indicators={indicatorsAtDisplay} year={displayYear} />

          {indicatorsAtDisplay && (
            <div className="shrink-0">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">Registers · {displayYear}</span>
                <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground hidden sm:block">
                  tap a row for the plain-language reading
                </span>
              </div>
              <IndicatorStrip
                indicators={indicatorsAtDisplay}
                baseline={previewResult!.baselineYear.indicators}
                history={historyForSparklines}
              />
            </div>
          )}

          <div className="flex-1 min-h-0">
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1">Trajectory · {chartData[0]?.year ?? 2026} – {displayYear}</div>
            <div className="h-full">
              <TimelineChart data={chartData} className="h-full flex flex-col" />
            </div>
          </div>

          {finished && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 border border-border bg-card">
              <figure className="photo-plate overflow-hidden relative">
                <img
                  src={moodPhoto(previewResult!.score)}
                  alt={moodPhotoAlt(previewResult!.score)}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-full object-cover animate-in zoom-in-50 duration-1000"
                />
                {/* Weather event overlay: appears based on score */}
                {previewResult!.score < 58 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(185,154,107,0.4)] via-transparent to-[rgba(201,107,66,0.25)] pointer-events-none animate-in fade-in duration-700 delay-300" />
                )}
                {previewResult!.score >= 58 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(47,122,72,0.3)] via-transparent to-[rgba(100,180,140,0.15)] pointer-events-none animate-in fade-in duration-700 delay-300" />
                )}
              </figure>
              <div className="px-5 py-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                      The year is 2050. Field work complete.
                    </div>
                    <div className="font-display text-2xl font-semibold tracking-tight mt-0.5">
                      Verdict:{" "}
                      <span className={previewResult!.score >= 58 ? "text-emerald-700" : "text-vermilion"}>
                        {previewResult!.score.toFixed(0)} / 100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="btn-press rounded-none border-border" onClick={() => setSaveOpen(true)}>
                      <Save className="w-3.5 h-3.5 mr-1" /> Save plan
                    </Button>
                    <Button
                      className="btn-press rounded-none bg-vermilion text-primary-foreground hover:bg-vermilion/90"
                      onClick={() => {
                        run();
                        navigate("/results");
                      }}
                    >
                      Full account <FastForward className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-[13px] leading-relaxed">
                  <div className="border-l-2 border-emerald-700 pl-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      <span className="font-data text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Worked</span>
                    </div>
                    {previewResult!.biggestSuccess}
                  </div>
                  <div className="border-l-2 border-vermilion pl-3">
                    <div className="font-data text-[10px] uppercase tracking-wider text-vermilion font-bold mb-0.5">Failed</div>
                    {previewResult!.biggestFailure}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: decision ledger */}
        <aside className="lg:sticky lg:top-14 lg:self-start lg:h-[calc(100vh-8.5rem)] lg:overflow-y-auto pr-1 pb-2 shrink-0">
          <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1">Decisions · each year</div>
          <ControlPanel controls={controls} onChange={setControl} onReset={resetControls} />
          <div className="mt-3 px-1">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Adjust the ledger, re-run the simulation, observe what changed.
              The model has no perfect answer. Only trade-offs.
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link href="/transparency" className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-vermilion transition-colors">
              How the model works →
            </Link>
          </div>
        </aside>
      </main>

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="bg-popover rounded-none border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Save this plan</DialogTitle>
            <DialogDescription className="text-sm">
              Name your decision set to compare up to 4 plans on the results screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. Green coast, light industry"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="font-data rounded-none"
            />
            <Button onClick={handleSave} className="btn-press rounded-none bg-vermilion text-primary-foreground hover:bg-vermilion/90">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function missionLabel(key: string): string {
  const labels: Record<string, string> = {
    climatePressure: "Air & sea pressure",
    biodiversity: "Nature alive",
    waterSecurity: "Clean water in taps",
    floodResilience: "Flood-safe homes",
    equity: "Fair for everyone",
  };
  return labels[key] ?? key;
}

function moodPhoto(score: number): string {
  return score >= 58 ? FINISH_PHOTO : DAWN_PHOTO;
}

function moodPhotoAlt(score: number): string {
  return score >= 58
    ? "Fishermen with nets at dawn, Kuala Kedah. The town is alive."
    : "Fisherman casting net at dusk. The town still needs help.";
}
