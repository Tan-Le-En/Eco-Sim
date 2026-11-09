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
import {
  Play,
  Pause,
  FastForward,
  Save,
  Lightbulb,
  Coins,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { goalsMetCount } from "@/components/TownMood";
import {
  MISSION_TARGETS,
  INDICATOR_META,
  KID_INDICATORS,
} from "@/lib/sim/types";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import CityMap from "@/components/CityMap";
import ControlPanel from "@/components/ControlPanel";
import IndicatorStrip from "@/components/IndicatorStrip";
import TownMood from "@/components/TownMood";
import TimelineChart, { ChartRow } from "@/components/TimelineChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSim } from "@/contexts/SimContext";
import { runSimulation } from "@/lib/sim/engine";
import { INDICATOR_KEYS } from "@/lib/sim/types";

const FINISH_PHOTO = "/storage/fishermen-dawn-nets-real_81f6e009.jpeg";
const DAWN_PHOTO = "/storage/fishermen-net-cast-real_a6fc104d.jpg";

export default function Simulator() {
  const { controls, setControl, resetControls, run, saveScenario } = useSim();
  const [, navigate] = useLocation();

  const [previewResult, setPreviewResult] = useState<ReturnType<
    typeof runSimulation
  > | null>(null);
  const [playing, setPlaying] = useState(false);
  const [displayYear, setDisplayYear] = useState(2026);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [pauseOnEvents, setPauseOnEvents] = useState(true);
  const [reelOpen, setReelOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [missionOpen, setMissionOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Reel focus trap: the overlay is a dialog, so Tab must stay inside and
  // focus must return to whoever opened it.
  const reelRef = useRef<HTMLDivElement | null>(null);
  const exitReelRef = useRef<HTMLButtonElement | null>(null);
  const prevReelFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

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

  const hasEventAt = (year: number) =>
    (eventsByYear.get(year)?.length ?? 0) > 0;

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

  // Playback: cockpit = slow (2s/yr). Reel = turbo fast-forward (0.11s/yr), a
  // brief hold on story years, then straight back to blasting through years.
  useEffect(() => {
    if (!playing) return;
    const isEvent =
      hasEventAt(displayYear) || displayYear === 2026 || displayYear === 2050;
    let interval: number;
    if (reelOpen) {
      interval = isEvent
        ? speed === 2
          ? 1500
          : 2300
        : speed === 2
          ? 110
          : 190;
    } else {
      const base = speed === 2 ? 1100 : 2000;
      interval = isEvent ? base + 900 : base;
    }
    timerRef.current = setTimeout(() => {
      setDisplayYear(y => {
        const next = y + 1;
        if (next >= 2050) {
          setPlaying(false);
          if (!reelOpen)
            toast("2050 reached. Open the full account on Results.");
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
    // Run = open the reel: it autoblasts to 2050, holding a beat on story years.
    setSpeed(2);
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
  // While the reel is open, Tab is trapped inside the overlay (dialog discipline).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.key === "Escape" && reelOpen) {
        e.preventDefault();
        setPlaying(false);
        setReelOpen(false);
        return;
      }
      if (e.key === "Tab" && reelOpen && reelRef.current) {
        const nodes = reelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (nodes.length === 0) return;
        const first = nodes[0]!;
        const last = nodes[nodes.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBy(-1);
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayYear, pauseOnEvents, eventsByYear, reelOpen, playing]);

  // Reel focus: move focus into the dialog on open, hand it back on close.
  useEffect(() => {
    if (reelOpen) {
      prevReelFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      exitReelRef.current?.focus();
    } else if (prevReelFocus.current) {
      prevReelFocus.current.focus();
      prevReelFocus.current = null;
    }
  }, [reelOpen]);

  // Reel open: lock scroll so the film stays centred.
  useEffect(() => {
    if (!reelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [reelOpen]);

  // Reel autoplay: open = play (no Play press needed).
  useEffect(() => {
    if (reelOpen && displayYear < 2050 && !playing) setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reelOpen]);

  // One toggle for reel + keyboard: pause anywhere, resume or replay at 2050.
  const togglePlay = () => {
    if (!playing && displayYear >= 2050) {
      setDisplayYear(2026);
      setPlaying(true);
      return;
    }
    setPlaying(p => !p);
  };

  const indicatorsAtDisplay = useMemo(() => {
    if (!previewResult) return null;
    const y =
      previewResult.years.find(yr => yr.year === displayYear) ??
      previewResult.years[previewResult.years.length - 1];
    return y.indicators;
  }, [previewResult, displayYear]);

  // Sampled chart data: at most ~14 points regardless of elapsed years,
  // so Recharts never re-lays-out hundreds of points mid-playback.
  const chartData: ChartRow[] = useMemo(() => {
    if (!previewResult) return [];
    const slice = previewResult.years.filter(y => y.year <= displayYear);
    if (slice.length <= 14) {
      return slice.map(y => {
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
      .filter(y => y.year < displayYear)
      .slice(-12)
      .map(y => ({ indicators: y.indicators }));
  }, [previewResult, displayYear]);

  const finished = displayYear >= 2050 && previewResult;

  const handleSave = () => {
    if (savedFlash) return;
    if (!saveName.trim()) {
      toast.error("Give your plan a name first");
      return;
    }
    const ok = saveScenario(saveName.trim());
    if (ok) {
      // "Saved ✓" morph on the button, dialog closes a beat later.
      setSavedFlash(true);
      window.setTimeout(() => {
        setSavedFlash(false);
        setSaveOpen(false);
        setSaveName("");
      }, 700);
      toast.success("Plan saved", {
        description: "Compare up to 4 plans on the results screen.",
      });
    } else {
      // Storage refused the write — say so, never fake success.
      setSaveOpen(false);
      setSaveName("");
      toast.error(
        "This browser is blocking storage — the plan lives only for this session.",
        {
          duration: 6000,
        }
      );
    }
  };

  const runningBudget = useMemo(() => {
    if (!previewResult) return 100;
    const y =
      previewResult.years.find(yr => yr.year === displayYear) ??
      previewResult.years[previewResult.years.length - 1];
    return y.budgetRemaining;
  }, [previewResult, displayYear]);

  const yearRow = useMemo(() => {
    if (!previewResult) return null;
    return (
      previewResult.years.find(yr => yr.year === displayYear) ??
      previewResult.years[previewResult.years.length - 1]
    );
  }, [previewResult, displayYear]);

  const prevRow = useMemo(() => {
    if (!previewResult || !yearRow) return null;
    return previewResult.years.find(yr => yr.year === displayYear - 1) ?? null;
  }, [previewResult, displayYear, yearRow]);

  const yearMovers = useMemo(() => {
    if (!yearRow || !prevRow) return [];
    return INDICATOR_KEYS.map(k => {
      const delta = yearRow.indicators[k] - prevRow.indicators[k];
      const meta = INDICATOR_META[k];
      const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
      return { key: k, delta, good, abs: Math.abs(delta) };
    })
      .filter(m => m.abs >= 0.3)
      .sort((a, b) => b.abs - a.abs)
      .slice(0, 3);
  }, [yearRow, prevRow]);

  const eventsHere = useMemo(
    () => eventsByYear.get(displayYear) ?? [],
    [eventsByYear, displayYear]
  );
  const eventsSoFar = useMemo(
    () => fullResult.events.filter(e => e.year <= displayYear),
    [fullResult, displayYear]
  );
  const progressPct = Math.round(((displayYear - 2026) / 24) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM — The simulator · govern Teluk Nusa 2026–2050"
        description="Eight dials. 25 years. Step one year at a time."
      />
      <SiteHeader backHref="/story" />

      {/* ── Instrument bar: year · budget · mission target ── */}
      <div className="border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <div>
              <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                Year
              </div>
              <div
                className="font-data text-3xl tabular-nums font-medium leading-tight"
                style={{ transition: "opacity 200ms ease" }}
              >
                {displayYear}
              </div>
            </div>
            {/* Mission chip: the clear goal, always visible. Tap to open the
                target list — hover was unreachable on touch devices. */}
            <button
              type="button"
              onClick={() => setMissionOpen(true)}
              aria-haspopup="dialog"
              className="btn-press flex items-center gap-2 border border-border bg-card px-3 py-1.5 hover:border-vermilion/60 transition-colors text-left"
              title="Your five targets — tap for details"
            >
              <span className="font-data text-[10px] tracking-[0.14em] uppercase text-vermilion font-semibold whitespace-nowrap">
                Mission
              </span>
              <span className="font-data text-[11px] tabular-nums whitespace-nowrap">
                {indicatorsAtDisplay ? goalsMetCount(indicatorsAtDisplay) : 0} /
                5 targets
              </span>
            </button>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Coins
                className="w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <div className="font-data text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                  Budget
                </div>
                <div
                  className={`font-data text-xl tabular-nums leading-tight ${
                    runningBudget < 20
                      ? "text-vermilion"
                      : runningBudget < 40
                        ? "text-warn"
                        : "text-foreground"
                  }`}
                >
                  {runningBudget.toFixed(0)} pts
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Step first: one year at a time */}
            <div
              className="flex border border-border"
              role="group"
              aria-label="Step through years"
            >
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
                className="btn btn-primary"
                title="Run to 2050 with story pauses (Space)"
              >
                <Play className="w-3.5 h-3.5" />{" "}
                {displayYear > 2026 && displayYear < 2050
                  ? `Play from ${displayYear}`
                  : displayYear >= 2050
                    ? "Restart"
                    : "Play"}
              </button>
            ) : (
              <button onClick={handleStop} className="btn btn-outline">
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
            <div
              className="flex border border-border"
              role="group"
              aria-label="Playback speed"
            >
              {([1, 2] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`btn-press px-2.5 py-2 font-data text-[10px] tracking-wider uppercase transition-colors ${
                    speed === s
                      ? s === 1
                        ? "bg-accent text-accent-foreground"
                        : "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={
                    s === 1 ? "Film speed: ~2s per year" : "Brisk: ~1s per year"
                  }
                >
                  {s === 1 ? "Slow" : "Brisk"}
                </button>
              ))}
            </div>
            <label
              className="inline-flex items-center gap-1.5 py-2 font-data text-[10px] tracking-wider uppercase text-muted-foreground cursor-pointer select-none"
              title="Pause automatically when an event happens"
            >
              <input
                type="checkbox"
                checked={pauseOnEvents}
                onChange={e => setPauseOnEvents(e.target.checked)}
                className="accent-interactive w-3.5 h-3.5 shrink-0"
              />
              Pause on events
            </label>
          </div>
        </div>
      </div>

      <main
        id="main"
        tabIndex={-1}
        className="flex-1 px-4 sm:px-6 lg:px-8 py-3 grid lg:grid-cols-[1fr_340px] gap-4 max-w-[1500px] w-full outline-none"
      >
        {/* Left: mood → map → indicators → trajectory. Normal flow: a clipped
            instrument is a worse crime than a scroll on short laptops. */}
        <div className="space-y-3 min-w-0">
          {indicatorsAtDisplay && (
            <TownMood indicators={indicatorsAtDisplay} year={displayYear} />
          )}

          {/* This year — digest + what happened */}
          <div className="border border-border bg-card">
            <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-border/60">
              <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                Year {displayYear - 2026 + 1} of 25
              </span>
              <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground tabular-nums">
                {progressPct}% · {eventsSoFar.length} events so far
              </span>
            </div>
            <div
              className="h-1 bg-secondary"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Run progress"
            >
              <div
                className="h-full bg-vermilion transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="px-4 py-2.5 text-[12px] leading-snug">
              {displayYear === 2026 ? (
                <p className="text-muted-foreground">
                  Baseline year. Press{" "}
                  <strong className="text-foreground">Next</strong> or{" "}
                  <strong className="text-foreground">Play</strong> to step
                  through 2027. Arrow keys work too.
                </p>
              ) : (
                <>
                  {eventsHere.length > 0 ? (
                    <div className="space-y-1.5">
                      {eventsHere.map((e, i) => (
                        <p
                          key={i}
                          className={
                            e.severity === "critical"
                              ? "text-vermilion font-medium"
                              : e.severity === "warning"
                                ? "text-warn font-medium"
                                : "text-ok font-medium"
                          }
                        >
                          {e.severity !== "info" && (
                            <AlertTriangle
                              className="w-3 h-3 inline mr-1 -mt-0.5"
                              aria-hidden="true"
                            />
                          )}
                          <span className="font-data text-[10px] tracking-[0.12em] uppercase opacity-70 mr-1.5">
                            {e.severity}
                          </span>
                          {e.message}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      A quiet year. No event. The town drifts a little.
                    </p>
                  )}
                  {yearMovers.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {yearMovers.map(m => (
                        <motion.span
                          key={`${displayYear}:${m.key}`}
                          initial={reduced ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className={`inline-flex items-center gap-1 border px-1.5 py-0.5 font-data text-[10px] tabular-nums ${m.good ? "border-ok/40 text-ok" : "border-vermilion/40 text-vermilion"}`}
                        >
                          {KID_INDICATORS[m.key].kidName}{" "}
                          {m.delta > 0 ? "+" : ""}
                          {m.delta.toFixed(1)}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            {eventsSoFar.length > 0 && (
              <div className="px-4 py-2 border-t border-border/60 max-h-28 overflow-y-auto">
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-1">
                  Events so far
                </div>
                <div className="space-y-1">
                  {eventsSoFar.slice(-5).map((e, i) => (
                    <div
                      key={i}
                      className="flex items-baseline gap-2 text-[11px]"
                    >
                      <span className="font-data tabular-nums text-muted-foreground w-8 shrink-0">
                        {e.year}
                      </span>
                      <span
                        className={
                          e.severity === "critical"
                            ? "text-vermilion"
                            : e.severity === "info"
                              ? "text-ok"
                              : "text-muted-foreground"
                        }
                      >
                        {e.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CityMap
            controls={controls}
            indicators={indicatorsAtDisplay}
            year={displayYear}
          />

          {indicatorsAtDisplay && (
            <div className="shrink-0">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                  Registers
                </span>
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

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                Trajectory
              </span>
              <div className="flex items-center gap-2">
                <span className="font-data text-[10px] uppercase text-muted-foreground">
                  Scrub year:
                </span>
                <input
                  type="range"
                  min={2026}
                  max={2050}
                  value={displayYear}
                  onChange={e => {
                    setPlaying(false);
                    setDisplayYear(Number(e.target.value));
                  }}
                  className="w-24 sm:w-32 h-1.5 accent-interactive bg-secondary rounded-none cursor-pointer"
                  aria-label="Timeline year scrubber"
                />
                <span className="font-data text-[11px] tabular-nums font-semibold text-foreground w-10 text-right">
                  {displayYear}
                </span>
              </div>
            </div>
            {/* Fixed chart box: the only overflow-hidden region — content never clips silently */}
            <TimelineChart
              data={chartData}
              className="h-[260px] sm:h-[300px] overflow-hidden"
            />
          </div>

          {finished && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 border border-border bg-card">
              <figure className="photo-plate overflow-hidden relative">
                <img
                  src={moodPhoto(previewResult!.score)}
                  alt={moodPhotoAlt(previewResult!.score)}
                  loading="lazy"
                  decoding="async"
                  className="h-40 w-full object-cover animate-in fade-in duration-700"
                />
                {/* Weather event overlay: appears based on score */}
                {previewResult!.score < 58 && (
                  <div className="absolute inset-0 mood-overlay-struggle pointer-events-none animate-in fade-in duration-700 delay-300" />
                )}
                {previewResult!.score >= 58 && (
                  <div className="absolute inset-0 mood-overlay-hope pointer-events-none animate-in fade-in duration-700 delay-300" />
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
                      <span
                        className={
                          previewResult!.score >= 58
                            ? "text-ok"
                            : "text-vermilion"
                        }
                      >
                        {previewResult!.score.toFixed(0)} / 100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-outline"
                      onClick={() => setSaveOpen(true)}
                    >
                      <Save className="w-3.5 h-3.5" /> Save plan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        run();
                        navigate("/results");
                      }}
                    >
                      Full account <FastForward className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-[13px] leading-relaxed">
                  <div className="border-l-2 border-ok pl-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Lightbulb
                        className="w-3.5 h-3.5 text-ok"
                        aria-hidden="true"
                      />
                      <span className="font-data text-[10px] uppercase tracking-wider text-ok font-bold">
                        Worked
                      </span>
                    </div>
                    {previewResult!.biggestSuccess}
                  </div>
                  <div className="border-l-2 border-vermilion pl-3">
                    <div className="font-data text-[10px] uppercase tracking-wider text-vermilion font-bold mb-0.5">
                      Failed
                    </div>
                    {previewResult!.biggestFailure}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: decision ledger — sticky with its own scroll; the page scrolls,
            never silently clips. max-h assumes only the sticky header above. */}
        <aside className="lg:sticky lg:top-14 lg:self-start lg:max-h-[calc(100vh-3.5rem)] lg:overflow-y-auto pr-1 pb-2 shrink-0">
          <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1">
            Policy · 2026 – 2050
          </div>
          <ControlPanel
            controls={controls}
            onChange={setControl}
            onReset={resetControls}
          />
          <div className="mt-3 px-1">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Turn a dial. Step a year. Watch what changed.
            </p>
          </div>
          <div className="mt-3 text-center">
            <Link
              href="/transparency"
              className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-vermilion transition-colors"
            >
              How the model works →
            </Link>
          </div>
        </aside>
      </main>

      {/* ── Year Reel: autoplay turbo — year dead-centre, story cut right below ── */}
      <AnimatePresence>
        {reelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-background flex flex-col select-none"
            role="dialog"
            aria-label="Year reel: watch Teluk Nusa from 2026 to 2050"
            onClick={togglePlay}
            ref={reelRef}
          >
            {/* Plain map, washed out */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <img
                src="/storage/teluk-nusa-map-illustrated_e05d6285.png"
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-background/70" />
            </div>

            {/* Top hairline progress */}
            <div
              className="absolute top-0 inset-x-0 h-[3px] z-10 bg-border"
              aria-hidden="true"
            >
              <div
                className="h-full bg-vermilion transition-[width] duration-200 ease-linear"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Floating chrome: label left, speed + exit right */}
            <div
              className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3"
              onClick={e => e.stopPropagation()}
            >
              <span className="font-data text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
                Teluk Nusa
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSpeed(speed === 1 ? 2 : 1)}
                  className="btn-press font-data text-[10px] tracking-wider uppercase border border-border px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Toggle speed: Fast / Turbo"
                >
                  {speed === 2 ? "Turbo" : "Fast"}
                </button>
                <button
                  ref={exitReelRef}
                  onClick={() => {
                    setPlaying(false);
                    setReelOpen(false);
                  }}
                  className="btn-press inline-flex items-center gap-1.5 font-data text-[10px] tracking-wider uppercase border border-border px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title="Exit to cockpit (Esc)"
                >
                  <X className="w-3.5 h-3.5" /> Exit
                </button>
              </div>
            </div>

            {/* Centre stage: rolling year exactly at screen centre, story below it */}
            <div className="relative flex-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <OdometerYear year={displayYear} large />
                  <div className="absolute left-1/2 top-full -translate-x-1/2 mt-5 w-[min(36rem,92vw)]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={displayYear}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="text-center px-2"
                      >
                        {displayYear === 2026 ? (
                          <>
                            <p className="font-display italic text-2xl sm:text-3xl leading-snug">
                              The town begins.
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              One million people. 100 points to spend.
                            </p>
                          </>
                        ) : eventsHere.length > 0 ? (
                          <div className="space-y-1">
                            {eventsHere.map((e, i) => (
                              <p
                                key={i}
                                className={`font-display italic text-2xl sm:text-3xl leading-tight ${e.severity === "info" ? "text-ok" : e.severity === "critical" ? "text-vermilion" : "text-foreground"}`}
                              >
                                {e.message}
                              </p>
                            ))}
                          </div>
                        ) : displayYear === 2050 ? (
                          <>
                            <p className="font-display italic text-2xl sm:text-3xl leading-tight">
                              2050. The record closes.
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {previewResult
                                ? `${previewResult.biggestSuccess} ${previewResult.biggestFailure}`
                                : "The town has spoken."}
                            </p>
                          </>
                        ) : (
                          <p className="font-display italic text-lg sm:text-xl leading-snug text-muted-foreground">
                            {quietLine(displayYear)}
                          </p>
                        )}
                        {eventsHere.length > 0 && yearMovers.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
                            {yearMovers.map(m => (
                              <span
                                key={m.key}
                                className={`inline-flex items-center gap-1 border px-2 py-1 font-data text-[11px] tabular-nums ${m.good ? "border-ok/40 text-ok" : "border-vermilion/50 text-vermilion"}`}
                              >
                                {KID_INDICATORS[m.key].kidName}{" "}
                                {m.delta > 0 ? "+" : ""}
                                {m.delta.toFixed(1)}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mt-2 font-data text-[11px] tracking-[0.1em] uppercase text-muted-foreground tabular-nums">
                          {yearRow
                            ? `Budget ${yearRow.budgetRemaining.toFixed(0)} pts · Pop ${yearRow.population.toLocaleString()}`
                            : ""}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport: Back · Play/Pause · Next · Skip/Full account */}
            <div
              className="relative z-10 px-4 sm:px-6 py-3 border-t border-border bg-background/80 backdrop-blur flex flex-wrap items-center justify-center gap-2"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => stepBy(-1)}
                disabled={displayYear <= 2026}
                className="btn-press inline-flex items-center gap-1 border border-border px-3.5 py-2 font-data text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Previous year (←)"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={togglePlay}
                className="btn btn-primary"
                title="Play / pause (Space, or tap anywhere)"
              >
                {playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {playing ? "Pause" : displayYear >= 2050 ? "Replay" : "Play"}
              </button>
              <button
                onClick={() => stepBy(1)}
                disabled={displayYear >= 2050}
                className="btn-press inline-flex items-center gap-1 border border-border px-3.5 py-2 font-data text-[11px] tracking-wider uppercase hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                title="Next year (→)"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
              {displayYear >= 2050 ? (
                <button
                  onClick={() => {
                    run();
                    setPlaying(false);
                    setReelOpen(false);
                    navigate("/results");
                  }}
                  className="btn btn-outline"
                >
                  Full account <FastForward className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPlaying(false);
                    setDisplayYear(2050);
                  }}
                  className="btn-press inline-flex items-center gap-1.5 px-2.5 py-2 font-data text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                  title="Skip to 2050"
                >
                  <FastForward className="w-3.5 h-3.5" /> Skip
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
              Name your decision set to compare up to 4 plans on the results
              screen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="e.g. Green coast, light industry"
              onKeyDown={e => e.key === "Enter" && handleSave()}
              className="font-data rounded-none"
            />
            <button onClick={handleSave} className="btn btn-primary shrink-0">
              {savedFlash ? "Saved ✓" : "Save"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mission targets: tap-to-open, touch + keyboard reachable (was hover-only) */}
      <Dialog open={missionOpen} onOpenChange={setMissionOpen}>
        <DialogContent className="bg-popover rounded-none border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">
              Your five targets by 2050
            </DialogTitle>
            <DialogDescription className="text-sm">
              Where Teluk Nusa stands right now, {displayYear}. Reach all five
              for the full mission.
            </DialogDescription>
          </DialogHeader>
          <ul className="divide-y divide-border/60 text-[13px]">
            {MISSION_TARGETS.map(m => {
              const value = indicatorsAtDisplay
                ? indicatorsAtDisplay[m.key]
                : null;
              const met =
                value !== null &&
                (m.direction === "above"
                  ? value >= m.threshold
                  : value <= m.threshold);
              return (
                <li
                  key={m.key}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span>{missionLabel(m.key)}</span>
                  <span className="flex items-center gap-2.5 font-data text-[12px] tabular-nums">
                    <span className={met ? "text-ok" : "text-muted-foreground"}>
                      {value !== null ? value.toFixed(0) : "—"}{" "}
                      {m.direction === "above" ? "≥" : "≤"} {m.threshold}
                    </span>
                    {met ? (
                      <Check
                        className="w-3.5 h-3.5 text-ok"
                        aria-label="target met"
                      />
                    ) : (
                      <span
                        className="w-3.5 text-center text-border"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
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
    : "Fisherman casting a net at first light. The town still needs help.";
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

function OdometerYear({
  year,
  large = false,
}: {
  year: number;
  large?: boolean;
}) {
  const digits = String(year).padStart(4, "0").split("");
  const reduced = useReducedMotion();
  return (
    <div className="flex items-center gap-1" aria-label={`Year ${year}`}>
      {digits.map((d, i) => (
        <RollingDigit
          key={i}
          digit={d}
          delay={i * 0.015}
          large={large}
          reduced={reduced ?? false}
        />
      ))}
    </div>
  );
}

function RollingDigit({
  digit,
  delay = 0,
  large = false,
  reduced = false,
}: {
  digit: string;
  delay?: number;
  large?: boolean;
  reduced?: boolean;
}) {
  const n = Number(digit) || 0;
  // Reduced motion honored: a motion-sensitive user gets the digit, no roll.
  if (reduced) {
    return (
      <span
        className={`inline-block font-display font-semibold tabular-nums text-foreground ${large ? "text-8xl sm:text-9xl leading-[1.1em]" : "text-2xl leading-[1.1em]"}`}
        aria-hidden="true"
      >
        {digit}
      </span>
    );
  }
  return (
    <span
      className="inline-block overflow-hidden leading-none"
      aria-hidden="true"
    >
      <span
        className={`block overflow-hidden font-display font-semibold tabular-nums text-foreground ${large ? "h-[1.1em] text-8xl sm:text-9xl leading-[1.1em]" : "h-[1.1em] text-2xl leading-[1.1em]"}`}
      >
        <motion.span
          className="block will-change-transform"
          animate={{ y: `-${n * 1.1}em` }}
          transition={{ duration: 0.22, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "11em" }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => (
            <span
              key={v}
              className="block h-[1.1em] leading-[1.1em] text-center"
            >
              {v}
            </span>
          ))}
        </motion.span>
      </span>
    </span>
  );
}
