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
import { Play, Pause, FastForward, Save, Lightbulb, Coins, ChevronLeft, ChevronRight, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { goalsMetCount } from "@/components/TownMood";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MISSION_TARGETS, INDICATOR_META, KID_INDICATORS } from "@/lib/sim/types";
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

const FINISH_PHOTO = "/storage/fishermen-dawn-nets-real_81f6e009.jpeg";
const DAWN_PHOTO = "/storage/fishermen-net-cast-real_a6fc104d.jpg";

export default function Simulator() {
  const { controls, setControl, resetControls, run, saveScenario } = useSim();
  const [, navigate] = useLocation();

  const [previewResult, setPreviewResult] = useState<ReturnType<typeof runSimulation> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [displayYear, setDisplayYear] = useState(2026);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [pauseOnEvents, setPauseOnEvents] = useState(true);
  const [reelOpen, setReelOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Precompute the full simulation once per controls change; every other
  // read is a plain array lookup (no re-run).
  const fullResult = useMemo(() => runSimulation(controls), [controls]);

  useEffect(() => {
    setPreviewResult(fullResult);
  }, [fullResult]);

  const eventsByYear = useMemo(() => {
    const m = new Map<number, typeof fullResult.events>();
    for (const e of fullResult.events) {
      const list = m.get(e.year) ?? [];
      list.push(e);
      m.set(e.year, list);
    }
    return m;
  }, [fullResult]);

  const hasEventAt = (year: number) => (eventsByYear.get(year)?.length ?? 0) > 0;

  const stepTo = (year: number) => {
    const clamped = Math.min(2050, Math.max(2026, year));
    setDisplayYear(clamped);
    if (pauseOnEvents && playing && clamped < 2050 && hasEventAt(clamped)) {
      setPlaying(false);
    }
  };

  const stepBy = (delta: number) => {
    setPlaying(false);
    stepTo(displayYear + delta);
  };

  // Playback: cockpit = slow (2s/yr). Reel = fast-forward (0.28s/yr) then
  // pause on story years so the story can be read.
  useEffect(() => {
    if (!playing) return;
    const isEvent = hasEventAt(displayYear);
    let interval: number;
    if (reelOpen) {
      interval = isEvent ? (speed === 2 ? 2200 : 3400) : speed === 2 ? 180 : 300;
    } else {
      const base = speed === 2 ? 1100 : 2000;
      interval = isEvent ? base + 900 : base;
    }
    timerRef.current = setTimeout(() => {
      setDisplayYear((y) => {
        const next = y + 1;
        if (next >= 2050) {
          setPlaying(false);
          if (!reelOpen) toast("2050 reached. Open the full account on Results.");
          return 2050;
        }
        if (pauseOnEvents && !reelOpen && hasEventAt(next)) {
          queueMicrotask(() => setPlaying(false));
        }
        return next;
      });
    }, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, speed, pauseOnEvents, eventsByYear, displayYear, reelOpen]);

  const handleRun = () => {
    // Run = open the reel screen. Slow, centred, one year at a time.
    if (displayYear >= 2050) setDisplayYear(2026);
    setReelOpen(true);
    setPlaying(true);
  };

  const handleStop = () => setPlaying(false);
  const handleFinishEarly = () => {
    setPlaying(false);
    setDisplayYear(2050);
  };

  // Keyboard: ← / → step, space play-pause, Esc close reel (when not typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "Escape" && reelOpen) { e.preventDefault(); setPlaying(false); setReelOpen(false); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayYear, pauseOnEvents, eventsByYear, reelOpen]);

  // Reel open: lock scroll so the film stays centred.
  useEffect(() => {
    if (!reelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [reelOpen]);

  // Reel autoplay: open = play (no Play press needed).
  useEffect(() => {
    if (reelOpen && displayYear < 2050 && !playing) setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reelOpen]);

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

  const yearRow = useMemo(() => {
    if (!previewResult) return null;
    return previewResult.years.find((yr) => yr.year === displayYear) ?? previewResult.years[previewResult.years.length - 1];
  }, [previewResult, displayYear]);

  const prevRow = useMemo(() => {
    if (!previewResult || !yearRow) return null;
    return previewResult.years.find((yr) => yr.year === displayYear - 1) ?? null;
  }, [previewResult, displayYear, yearRow]);

  const yearMovers = useMemo(() => {
    if (!yearRow || !prevRow) return [];
    return INDICATOR_KEYS
      .map((k) => {
        const delta = yearRow.indicators[k] - prevRow.indicators[k];
        const meta = INDICATOR_META[k];
        const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
        return { key: k, delta, good, abs: Math.abs(delta) };
      })
      .filter((m) => m.abs >= 0.3)
      .sort((a, b) => b.abs - a.abs)
      .slice(0, 3);
  }, [yearRow, prevRow]);

  const eventsHere = useMemo(() => eventsByYear.get(displayYear) ?? [], [eventsByYear, displayYear]);
  const eventsSoFar = useMemo(
    () => fullResult.events.filter((e) => e.year <= displayYear),
    [fullResult, displayYear],
  );
  const progressPct = Math.round(((displayYear - 2026) / 24) * 100);

  // Reel feed: one item per year for the scrolling story list.
  const feed = useMemo(() => {
    const years = fullResult.years;
    return years.map((row, idx) => {
      const prev = idx > 0 ? years[idx - 1] : null;
      const evts = eventsByYear.get(row.year) ?? [];
      const movers = prev
        ? INDICATOR_KEYS
            .map((k) => {
              const delta = row.indicators[k] - prev.indicators[k];
              const meta = INDICATOR_META[k];
              const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
              return { key: k, delta, good, abs: Math.abs(delta) };
            })
            .filter((m) => m.abs >= 0.3)
            .sort((a, b) => b.abs - a.abs)
            .slice(0, 3)
        : [];
      return { year: row.year, row, events: evts, movers };
    });
  }, [fullResult, eventsByYear]);

  const reelScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the feed so the current year stays centred.
  useEffect(() => {
    if (!reelOpen) return;
    const el = reelScrollRef.current?.querySelector<HTMLElement>(`[data-reel-year="${displayYear}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [displayYear, reelOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <PageMeta
        title="ECO//SIM — The simulator · govern Teluk Nusa 2026–2050"
        description="Eight dials. 25 years. Step one year at a time."
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
                  {runningBudget.toFixed(0)} pts
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Step first: one year at a time */}
            <div className="flex border border-border" role="group" aria-label="Step through years">
              <button
                onClick={() => stepBy(-1)}
                disabled={displayYear <= 2026}
                className="btn-press inline-flex items-center gap-1 px-3 py-2.5 font-data text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Back 1 year (←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => stepBy(1)}
                disabled={displayYear >= 2050}
                className="btn-press inline-flex items-center gap-1 border-l border-border px-3 py-2.5 font-data text-[10px] tracking-wider uppercase hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Next year (→)"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {!playing ? (
              <button
                onClick={handleRun}
                className="btn-press inline-flex items-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:brightness-105 transition-all"
              >
                <Play className="w-3.5 h-3.5" /> {displayYear > 2026 && displayYear < 2050 ? `Play from ${displayYear}` : displayYear >= 2050 ? "Restart" : "Play"}
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
              disabled={displayYear >= 2050}
              className="btn-press inline-flex items-center gap-1.5 border border-border px-3 py-2.5 font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
              title="Jump to 2050"
            >
              <FastForward className="w-3 h-3" /> To 2050
            </button>
            <div className="flex border border-border" role="group" aria-label="Playback speed">
              {([1, 2] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`btn-press px-2.5 py-2 font-data text-[10px] tracking-wider uppercase transition-colors ${
                    speed === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={s === 1 ? "Film speed: ~2s per year" : "Brisk: ~1s per year"}
                >
                  {s === 1 ? "Slow" : "Brisk"}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-1.5 font-data text-[10px] tracking-wider uppercase text-muted-foreground cursor-pointer select-none" title="Pause automatically when an event happens">
              <input
                type="checkbox"
                checked={pauseOnEvents}
                onChange={(e) => setPauseOnEvents(e.target.checked)}
                className="accent-vermilion w-3.5 h-3.5"
              />
              Pause on events
            </label>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-3 grid lg:grid-cols-[1fr_340px] gap-4 max-w-[1500px] w-full lg:h-[calc(100vh-8.5rem)] lg:overflow-hidden overflow-y-auto">
        {/* Left: mood → map → indicators → trajectory */}
        <div className="space-y-3 min-w-0 flex flex-col lg:overflow-hidden">
          {indicatorsAtDisplay && <TownMood indicators={indicatorsAtDisplay} year={displayYear} />}

          {/* This year — digest + what happened */}
          <div className="border border-border bg-card">
            <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-border/60">
              <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                {displayYear} — Year {displayYear - 2026 + 1} of 25
              </span>
              <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground tabular-nums">
                {progressPct}% · {eventsSoFar.length} events so far
              </span>
            </div>
            <div className="h-1 bg-secondary" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Run progress">
              <div className="h-full bg-vermilion transition-[width] duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="px-4 py-2.5 text-[12px] leading-snug">
              {displayYear === 2026 ? (
                <p className="text-muted-foreground">Baseline year. Press <strong className="text-foreground">Next</strong> or <strong className="text-foreground">Play</strong> to step through 2027. Arrow keys work too.</p>
              ) : (
                <>
                  {eventsHere.length > 0 ? (
                    <div className="space-y-1.5">
                      {eventsHere.map((e, i) => (
                        <p key={i} className={e.severity === "critical" ? "text-vermilion font-medium" : e.severity === "warning" ? "text-foreground" : "text-emerald-700 font-medium"}>
                          <AlertTriangle className={`w-3 h-3 inline mr-1 -mt-0.5 ${e.severity === "info" ? "hidden" : ""}`} aria-hidden="true" />
                          <span className="font-data text-[10px] tracking-[0.12em] uppercase opacity-70 mr-1.5">{e.severity}</span>{e.message}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">A quiet year. No event. The town drifts a little.</p>
                  )}
                  {yearMovers.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {yearMovers.map((m) => (
                        <span key={m.key} className={`inline-flex items-center gap-1 border px-1.5 py-0.5 font-data text-[10px] tabular-nums ${m.good ? "border-emerald-700/40 text-emerald-700" : "border-vermilion/40 text-vermilion"}`}>
                          {KID_INDICATORS[m.key].kidName} {m.delta > 0 ? "+" : ""}{m.delta.toFixed(1)}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            {eventsSoFar.length > 0 && (
              <div className="px-4 py-2 border-t border-border/60 max-h-28 overflow-y-auto">
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-1">Events so far</div>
                <div className="space-y-1">
                  {eventsSoFar.slice(-5).map((e, i) => (
                    <div key={i} className="flex items-baseline gap-2 text-[11px]">
                      <span className="font-data tabular-nums text-muted-foreground w-8 shrink-0">{e.year}</span>
                      <span className={e.severity === "critical" ? "text-vermilion" : e.severity === "info" ? "text-emerald-700" : "text-foreground/80"}>{e.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                Trajectory · {chartData[0]?.year ?? 2026} – {displayYear}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-data text-[10px] uppercase text-muted-foreground">Scrub year:</span>
                <input
                  type="range"
                  min={2026}
                  max={2050}
                  value={displayYear}
                  onChange={(e) => {
                    setPlaying(false);
                    setDisplayYear(Number(e.target.value));
                  }}
                  className="w-24 sm:w-32 h-1.5 accent-vermilion bg-secondary rounded-none cursor-pointer"
                  aria-label="Timeline year scrubber"
                />
                <span className="font-data text-[11px] tabular-nums font-semibold text-foreground w-10 text-right">{displayYear}</span>
              </div>
            </div>
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
          <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1">Policy · 2026 – 2050</div>
          <ControlPanel controls={controls} onChange={setControl} onReset={resetControls} />
          <div className="mt-3 px-1">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Turn a dial. Step a year. Watch what changed.
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link href="/transparency" className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-vermilion transition-colors">
              How the model works →
            </Link>
          </div>
        </aside>
      </main>

      {/* ── Year Reel: slow cinematic replay ── */}
      <AnimatePresence>
        {reelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
            role="dialog"
            aria-label="Year reel: watch Teluk Nusa from 2026 to 2050"
          >
            {/* Plain map background — just the map, no overlays or text */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
              <img
                src="/storage/teluk-nusa-map-illustrated_e05d6285.png"
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-white/55" />
            </div>

            {/* Sticky header */}
            <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b-2 border-foreground/80 bg-white dark:bg-card shadow-sm">
              <span className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                Teluk Nusa · the years
              </span>
              <div className="text-right">
                <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground tabular-nums">
                  Year {displayYear - 2026 + 1} of 25 · {progressPct}%
                </div>
                <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                  {playing ? (eventsHere.length > 0 ? "Story — reading" : "Fast-forward") : "Paused"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpeed(speed === 1 ? 2 : 1)}
                  className="btn-press font-data text-[10px] tracking-wider uppercase border border-border bg-white px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Toggle speed"
                >
                  {speed === 1 ? "Slow FF" : "Brisk FF"}
                </button>
                <button
                  onClick={() => { setPlaying(false); setReelOpen(false); }}
                  className="btn-press inline-flex items-center gap-1.5 font-data text-[10px] tracking-wider uppercase border border-border bg-white px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Exit to cockpit (Esc)"
                >
                  <X className="w-3.5 h-3.5" /> Exit
                </button>
              </div>
            </div>

            {/* Centre stage: rolling year + story, autoplay */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-6 overflow-y-auto">
              <OdometerYear year={displayYear} large />
              <div className="mt-2 font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                {playing ? (eventsHere.length > 0 ? "Story year — read it" : "Fast-forwarding…") : "Paused"}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayYear}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 flex flex-col items-center text-center max-w-xl w-full"
                >
                  <div className="bg-white dark:bg-card border-2 border-foreground/80 shadow-sm px-5 py-4 w-full">
                    {displayYear === 2026 ? (
                      <>
                        <p className="font-display italic text-2xl sm:text-3xl leading-snug">The town begins.</p>
                        <p className="mt-1.5 text-sm text-muted-foreground">One million people. 100 points a year. Watch the years roll.</p>
                      </>
                    ) : (
                      <>
                        {eventsHere.length > 0 ? (
                          <div className="space-y-1.5">
                            {eventsHere.map((e, i) => (
                              <p key={i} className={`font-display italic text-2xl sm:text-3xl leading-tight ${e.severity === "info" ? "text-emerald-800" : e.severity === "critical" ? "text-vermilion" : "text-foreground"}`}>
                                {e.message}
                              </p>
                            ))}
                          </div>
                        ) : displayYear === 2050 ? (
                          <>
                            <p className="font-display italic text-2xl sm:text-3xl leading-tight">2050. The record closes.</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">{previewResult ? `${previewResult.biggestSuccess} ${previewResult.biggestFailure}` : "The town has spoken."}</p>
                          </>
                        ) : (
                          <p className="font-display italic text-2xl sm:text-3xl leading-tight">{quietLine(displayYear)}</p>
                        )}
                        {yearMovers.length > 0 && (
                          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                            {yearMovers.map((m) => (
                              <span key={m.key} className={`inline-flex items-center gap-1 border px-2 py-1 font-data text-[11px] tabular-nums ${m.good ? "border-emerald-700/50 text-emerald-800" : "border-vermilion/50 text-vermilion"}`}>
                                {KID_INDICATORS[m.key].kidName} {m.delta > 0 ? "+" : ""}{m.delta.toFixed(1)}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 font-data text-[11px] tracking-[0.1em] uppercase text-muted-foreground tabular-nums">
                          {yearRow ? `Budget ${yearRow.budgetRemaining.toFixed(0)} pts · Pop ${yearRow.population.toLocaleString()}` : ""}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="w-full max-w-md mt-5">
                <div className="h-1 bg-secondary" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Reel progress">
                  <div className="h-full bg-vermilion transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground tabular-nums">
                  <span>2026</span><span>{progressPct}%</span><span>2050</span>
                </div>
              </div>
            </div>

            {/* Legacy scroll feed removed — centred stage above replaces it */}
            <div ref={reelScrollRef} className="hidden" aria-hidden="true">
              <div className="mx-auto max-w-md w-full space-y-3 pb-10">
                <p className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground text-center font-semibold">
                  Fast-forward until a story year. Story pauses. Then fast-forward again.
                </p>
                {feed.map((item) => {
                  const isActive = item.year === displayYear;
                  const isPast = item.year < displayYear;
                  const isFuture = item.year > displayYear;
                  const hasStory = item.events.length > 0 || item.year === 2026 || item.year === 2050;
                  return (
                    <motion.div
                      key={item.year}
                      data-reel-year={item.year}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className={`bg-white dark:bg-card border-2 shadow-sm px-4 py-3.5 transition-all duration-300 ${
                        isActive
                          ? item.events.some((e) => e.severity === "critical")
                            ? "border-vermilion scale-[1.02]"
                            : item.events.some((e) => e.severity === "info")
                              ? "border-emerald-700 scale-[1.02]"
                              : "border-foreground scale-[1.02]"
                          : isPast
                            ? "border-border opacity-80"
                            : "border-border bg-white/70 opacity-40"
                      }`}
                      role="article"
                      aria-label={`Year ${item.year}`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className={`font-data text-xl tabular-nums font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.year}
                        </span>
                        <span className={`font-data text-[10px] tracking-[0.12em] uppercase tabular-nums ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          Budget {item.row.budgetRemaining.toFixed(0)} · Pop {item.row.population.toLocaleString()}
                        </span>
                      </div>
                      {isFuture ? (
                        <p className="mt-1 text-sm text-muted-foreground">…</p>
                      ) : item.year === 2026 ? (
                        <p className="mt-1 text-[15px] leading-snug font-medium text-foreground">The town begins. One million people, 100 points a year.</p>
                      ) : hasStory ? (
                        <div className="mt-1.5 space-y-1.5">
                          {item.events.map((e, i) => (
                            <p key={i} className={`text-[15px] leading-snug font-semibold ${e.severity === "info" ? "text-emerald-800" : e.severity === "critical" ? "text-vermilion" : "text-foreground"}`}>
                              {e.message}
                            </p>
                          ))}
                          {item.year === 2050 && previewResult && (
                            <p className="text-sm text-muted-foreground leading-snug">{previewResult.biggestSuccess} {previewResult.biggestFailure}</p>
                          )}
                          {item.movers.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.movers.map((m) => (
                                <span key={m.key} className={`inline-flex items-center gap-1 border px-1.5 py-0.5 font-data text-[10px] tabular-nums ${m.good ? "border-emerald-700/50 text-emerald-800" : "border-vermilion/50 text-vermilion"}`}>
                                  {KID_INDICATORS[m.key].kidName} {m.delta > 0 ? "+" : ""}{m.delta.toFixed(1)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm leading-snug text-muted-foreground">{quietLine(item.year)}</p>
                      )}
                      {isActive && (
                        <div className="mt-2 font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                          {eventsHere.length > 0 ? "Story year — pausing to read" : "Fast-forwarding…"}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Reel transport */}
            <div className="relative px-4 sm:px-6 py-3 border-t-2 border-foreground/80 bg-white dark:bg-card flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => stepBy(-1)}
                disabled={displayYear <= 2026}
                className="btn-press inline-flex items-center gap-1 border border-border px-4 py-2.5 font-data text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Previous year (←)"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (!playing && displayYear >= 2050) { setDisplayYear(2026); setPlaying(true); }
                  else setPlaying((p) => !p);
                }}
                className="btn-press inline-flex items-center gap-2 bg-vermilion text-primary-foreground px-6 py-2.5 font-data text-[11px] tracking-[0.14em] uppercase hover:brightness-105 transition-all"
                title="Play / pause (Space)"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {playing ? "Pause" : displayYear >= 2050 ? "Replay" : "Play"}
              </button>
              <button
                onClick={() => stepBy(1)}
                disabled={displayYear >= 2050}
                className="btn-press inline-flex items-center gap-1 border border-border px-4 py-2.5 font-data text-[11px] tracking-wider uppercase hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Next year (→)"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
              {displayYear >= 2050 ? (
                <button
                  onClick={() => { run(); setPlaying(false); setReelOpen(false); navigate("/results"); }}
                  className="btn-press inline-flex items-center gap-2 border border-foreground px-4 py-2.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  Full account <FastForward className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => { setPlaying(false); setDisplayYear(2050); }}
                  className="btn-press hidden sm:inline-flex items-center gap-1.5 px-3 py-2.5 font-data text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FastForward className="w-3.5 h-3.5" /> To 2050
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

function quietLine(year: number): string {
  const lines = [
    "A quiet year. The town drifts a little.",
    "No headlines. Pipes run, boats go out.",
    "Ordinary days. Small gains, small losses.",
    "The ledger moves a notch. Life goes on.",
    "Calm water. The town keeps its balance.",
    "Nothing breaks. Nothing soars. It holds.",
  ];
  return lines[year % lines.length]!;
}

function OdometerYear({ year, large = false }: { year: number; large?: boolean }) {
  const digits = String(year).padStart(4, "0").split("");
  return (
    <div className="flex items-center gap-1" aria-label={`Year ${year}`}>
      {digits.map((d, i) => (
        <RollingDigit key={i} digit={d} delay={i * 0.03} large={large} />
      ))}
    </div>
  );
}

function RollingDigit({ digit, delay = 0, large = false }: { digit: string; delay?: number; large?: boolean }) {
  const n = Number(digit) || 0;
  return (
    <span
      className="inline-block overflow-hidden leading-none"
      aria-hidden="true"
    >
      <span className={`block overflow-hidden font-display font-semibold tabular-nums text-foreground ${large ? "h-[1.1em] text-8xl sm:text-9xl leading-[1.1em]" : "h-[1.1em] text-2xl leading-[1.1em]"}`}>
        <motion.span
          className="block will-change-transform"
          animate={{ y: `-${n * 1.1}em` }}
          transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "11em" }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
            <span key={v} className="block h-[1.1em] leading-[1.1em] text-center">
              {v}
            </span>
          ))}
        </motion.span>
      </span>
    </span>
  );
}
