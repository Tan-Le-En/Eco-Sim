/**
 * ECO//SIM — Story Mode (Editorial Field Study v4, rebuilt)
 *
 * Two modes:
 *   1. If the user has run the simulator: "What happened to Teluk Nusa."
 *      A personalised narrative built from the actual SimulationResult:
 *      events, causal links, biggest success/failure, indicator deltas.
 *      The town tells you what your choices did over 25 years.
 *
 *   2. If the user has NOT run the simulator: "The town as it is today."
 *      The five-chapter illustrated walk (sea, mangroves, nets, the whole
 *      town, the keys) so a child understands before touching a dial.
 */
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import SiteFooter from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { ArrowRight, Undo2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { useSim } from "@/contexts/SimContext";
import {
  INDICATOR_KEYS,
  INDICATOR_META,
  KID_INDICATORS,
  KID_CONTROLS,
  SimEvent,
  SimulationResult,
} from "@/lib/sim/types";

const PHOTOS = {
  riverVillage: "/storage/stilt-houses-real_4d70b8ec.jpg",
  mangroveRoots: "/storage/mangrove-roots-real_fc3e4c78.jpg",
  fishingCoast: "/storage/fishermen-net-cast-real_a6fc104d.jpg",
  mangroveAerial: "/storage/merbok-mangrove-real_ccdd2def.jpg",
  workingJetty: "/storage/clan-jetties-aerial-real_f756af5d.jpg",
};

/* ── Chapter definitions for the "before you play" mode ── */

interface Chapter {
  n: string;
  voice: string;
  title: string;
  lesson: string;
  photo: string;
  alt: string;
  cap: string;
  fig: string;
  connects: string;
}

const CHAPTERS: Chapter[] = [
  {
    n: "01",
    voice:
      "When the river rises, our village rises with it. Some years the water comes back down. It did not come back down the year of my wedding.",
    title: "A town that lives on the water",
    lesson:
      "Most of Teluk Nusa was built beside the sea and the river: homes, markets, roads. That is also the town's biggest risk. The sea rises a little every year, and the rain comes heavier. Building closer to the water means building more of the town's defence.",
    photo: PHOTOS.riverVillage,
    alt: "Colourful boats moored in a calm Malaysian river village",
    cap: "River village, fictional Teluk Nusa",
    fig: "Fig. 01",
    connects:
      "Connects to: Building by the Beach · Safe From Flood · Plant Trees & Mangroves",
  },
  {
    n: "02",
    voice:
      "My grandmother said the mangroves were a wall. We cut most of them down. Now the waves knock at the door.",
    title: "The wall we cut down",
    lesson:
      "Mangroves grow in salt water. Their roots hold the soil, slow the waves, and give baby fish a place to hide. Clear them to build, and flooding gets worse while the fish count falls. Plant them back, and both recover. Slowly, but for sure.",
    photo: PHOTOS.mangroveRoots,
    alt: "Mangrove prop roots tangled on a tidal flat",
    cap: "Mangrove roots on a tidal flat",
    fig: "Fig. 02",
    connects:
      "Connects to: Plant Trees & Mangroves · Nature & Animals · How Much We Fish",
  },
  {
    n: "03",
    voice:
      "I leave before the sun. Some days the nets are heavy. Some days I bring home stories instead.",
    title: "The nets that come home lighter",
    lesson:
      "Fishing feeds this town: boats, markets, dinners. The sea only gives what it has. Catch too many fish today and there are fewer parents to make babies tomorrow. The dial called How Much We Fish is the hardest one. Take less now and the sea rewards you for years. Take more now and the sea goes quiet.",
    photo: PHOTOS.fishingCoast,
    alt: "Fishing boats on the coast at dusk",
    cap: "The fishing coast, dusk",
    fig: "Fig. 03",
    connects: "Connects to: How Much We Fish · Nature & Animals · Good Life",
  },
  {
    n: "04",
    voice:
      "From up here you can see the bargain the town made: where the green ends, the roofs begin.",
    title: "The whole town from above",
    lesson:
      "Everything here is connected. The roads bring smoke, the smoke changes the air, the air changes the rain, the rain fills the river, and the river decides whose floor gets wet. One dial pulls on every thread. That is why we watch seven things at once, not just one.",
    photo: PHOTOS.mangroveAerial,
    alt: "Aerial view of mangrove forest meeting coastal development",
    cap: "Aerial view of the coast",
    fig: "Fig. 04",
    connects: "Connects to: every dial · every indicator",
  },
  {
    n: "05",
    voice:
      "The old boss always said there was no money. You have RM 100 a year. Don't spend it on what looks good. Spend it on what lasts.",
    title: "The town hands you the keys",
    lesson:
      "You start in 2026 with RM 100 a year, which is not much. That is the whole game: choose where the money goes, then live with the answer for 25 years. The town will tell you what worked and what did not. Fail safely here, and you will learn something that holds in the real world.",
    photo: PHOTOS.workingJetty,
    alt: "Clan jetty — houses and work over the water",
    cap: "Life and work on the jetty",
    fig: "Fig. 05",
    connects: "Connects to: the simulator · the whole study",
  },
];

/* ── After-the-simulation story pieces ── */

function yearRange(years: SimulationResult["years"]): string {
  const first = years[0]?.year ?? 2026;
  const last = years[years.length - 1]?.year ?? 2050;
  return `${first} to ${last}`;
}

function classifyRun(r: SimulationResult): { tone: "hope" | "struggle" | "balance" | "loss"; label: string } {
  if (r.score >= 65) return { tone: "hope", label: "The town is better off" };
  if (r.score >= 45) return { tone: "balance", label: "The town held, but barely" };
  if (r.score >= 30) return { tone: "struggle", label: "The town struggled" };
  return { tone: "loss", label: "The town lost ground" };
}

function toneColor(tone: string): string {
  switch (tone) {
    case "hope":
      return "text-emerald-700";
    case "balance":
      return "text-amber-700";
    case "struggle":
      return "text-vermilion";
    default:
      return "text-vermilion";
  }
}

function eventEmoji(type: string): string {
  if (type.includes("flood")) return "Flood";
  if (type.includes("water")) return "Water";
  if (type.includes("habitat") || type.includes("biodiversity")) return "Nature";
  if (type.includes("equity")) return "People";
  if (type.includes("health")) return "Health";
  if (type.includes("budget")) return "Money";
  return "Event";
}

function eventSeverityColor(sev: string): string {
  if (sev === "critical") return "border-l-vermilion";
  return "border-l-amber-500";
}

/* ── The "What Happened" page ── */

function WhatHappened({ result }: { result: SimulationResult }) {
  const classification = classifyRun(result);
  const range = yearRange(result.years);
  const baseline = result.baselineYear.indicators;
  const finalYear = result.years[result.years.length - 1];
  const final = finalYear.indicators;

  // Find indicators that moved significantly
  const movers = INDICATOR_KEYS.map((k) => {
    const delta = final[k] - baseline[k];
    const kid = KID_INDICATORS[k];
    const meta = INDICATOR_META[k];
    const good = meta.higherIsBetter ? delta >= 0 : delta <= 0;
    return { key: k, kid, delta, good, abs: Math.abs(delta) };
  })
    .filter((m) => m.abs > 8)
    .sort((a, b) => b.abs - a.abs);

  // Find the biggest causal chains
  const topLinks = result.causalLinks.slice(0, 3);

  // Events grouped by decade
  const decadeEvents: { label: string; events: SimEvent[] }[] = [];
  const byDecade = new Map<number, SimEvent[]>();
  for (const e of result.events) {
    const d = Math.floor((e.year - 2026) / 5) * 5 + 2026;
    if (!byDecade.has(d)) byDecade.set(d, []);
    byDecade.get(d)!.push(e);
  }
  for (const [d, evts] of Array.from(byDecade.entries()).sort((a, b) => a[0] - b[0])) {
    decadeEvents.push({ label: `${d}`, events: evts.slice(0, 4) });
  }

  // Controls that were pushed hard
  const controls = Object.entries(result.controls)
    .filter(([, v]) => v > 15)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key, val]) => ({ key, val, kid: KID_CONTROLS[key as keyof typeof KID_CONTROLS] }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM — What happened to Teluk Nusa"
        description={`The story of Teluk Nusa from ${range}. ${classification.label}: score ${result.score.toFixed(0)} out of 100.`}
      />
      <SiteHeader backHref="/simulator" />

      <main className="flex-1">
        {/* Masthead: the verdict as a story opener */}
        <section className="px-6 sm:px-10 lg:px-14 pt-12 pb-10 border-b border-border">
          <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-4">
            {range} · {result.events.length} events recorded
          </div>
          <h1 className="font-display font-semibold tracking-tight leading-[1.02] text-[clamp(2rem,4.5vw,3.6rem)] max-w-3xl">
            Over twenty-five years,{" "}
            <span className={toneColor(classification.tone)}>{classification.label.toLowerCase()}.</span>{" "}
            Here is what the town remembers.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            This story is built from your actual run. Every event below really
            happened in the model. Every number below is what your dials
            produced.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-data text-[11px] tracking-[0.12em] uppercase px-4 py-2 border border-border bg-card">
              Score {result.score.toFixed(0)} / 100
            </span>
            <Link
              href="/simulator"
              className="btn-press inline-flex items-center gap-2 font-data text-[10px] tracking-[0.14em] uppercase text-vermilion hover:text-vermilion/70 transition-colors"
            >
              <Undo2 className="w-3 h-3" /> Try a different path
            </Link>
          </div>
        </section>

        {/* Chapter 0: what you chose */}
        {controls.length > 0 && (
          <section className="px-6 sm:px-10 lg:px-14 py-10 border-b border-border">
            <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight mb-6">
              What you spent the town's money on
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              {controls.map((c) => (
                <div key={c.key} className="border border-border bg-card px-4 py-3">
                  <div className="font-data text-[11px] tracking-[0.06em] uppercase mb-1">{c.kid.kidName}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-data text-2xl tabular-nums font-semibold">{c.val}</span>
                    <span className="font-data text-[9px] tracking-[0.12em] uppercase text-muted-foreground">of 100</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chapter 1: the turning points (events) */}
        {decadeEvents.length > 0 && (
          <section className="px-6 sm:px-10 lg:px-14 py-10 border-b border-border">
            <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight mb-6">
              The years the town remembers
            </h2>
            <div className="max-w-2xl divide-y divide-border">
              {decadeEvents.map((dec) => (
                <div key={dec.label} className="py-4">
                  <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-3">
                    Around {dec.label}
                  </div>
                  <div className="space-y-2">
                    {dec.events.map((e, i) => (
                      <div key={i} className={`border-l-2 ${eventSeverityColor(e.severity)} pl-4 py-1`}>
                        <p className="text-sm leading-relaxed">
                          <span className="font-data text-[10px] tracking-[0.08em] uppercase text-muted-foreground mr-2">
                            {e.year}
                          </span>
                          {eventEmoji(e.type)}: {e.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chapter 2: the chains */}
        {topLinks.length > 0 && (
          <section className="px-6 sm:px-10 lg:px-14 py-10 border-b border-border">
            <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight mb-6">
              What caused what
            </h2>
            <div className="max-w-2xl divide-y divide-border">
              {topLinks.map((link, i) => (
                <div key={i} className="py-4 flex items-baseline gap-4">
                  <span className="font-data text-[11px] tracking-[0.06em] uppercase w-40 shrink-0">{link.cause}</span>
                  <span className={`text-lg ${link.direction === "positive" ? "text-emerald-700" : "text-vermilion"}`}>
                    {link.direction === "positive" ? "built up" : "pulled down"}
                  </span>
                  <span className="font-data text-[11px] tracking-[0.06em] uppercase">{link.effect}</span>
                  <span className="font-data text-[10px] tabular-nums text-muted-foreground ml-auto">
                    {Math.round(link.strength * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chapter 3: what moved */}
        {movers.length > 0 && (
          <section className="px-6 sm:px-10 lg:px-14 py-10 border-b border-border">
            <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight mb-6">
              What changed most
            </h2>
            <div className="max-w-2xl divide-y divide-border">
              {movers.slice(0, 5).map((m) => (
                <div key={m.key} className="py-3 flex items-baseline gap-4">
                  <span className="font-data text-[11px] tracking-[0.06em] uppercase w-32 shrink-0">{m.kid.kidName}</span>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="font-data text-[12px] tabular-nums text-muted-foreground">{baseline[m.key].toFixed(0)}</span>
                    <div className="flex-1 h-px bg-border relative">
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 ${m.good ? "bg-emerald-700" : "bg-vermilion"}`}
                        style={{ left: `${final[m.key]}%` }}
                      />
                    </div>
                    <span className="font-data text-[12px] tabular-nums">{final[m.key].toFixed(0)}</span>
                  </div>
                  <span className={`font-data text-[11px] tabular-nums ${m.good ? "text-emerald-700" : "text-vermilion"}`}>
                    {m.delta > 0 ? "+" : ""}{m.delta.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chapter 4: the big success and failure */}
        <section className="px-6 sm:px-10 lg:px-14 py-10">
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            <div className="border border-border bg-card p-5">
              <div className="font-data text-[10px] tracking-[0.14em] uppercase text-emerald-700 mb-3">
                What worked
              </div>
              <p className="text-sm leading-relaxed">{result.biggestSuccess}</p>
            </div>
            <div className="border border-border bg-card p-5">
              <div className="font-data text-[10px] tracking-[0.14em] uppercase text-vermilion mb-3">
                What went wrong
              </div>
              <p className="text-sm leading-relaxed">{result.biggestFailure}</p>
            </div>
          </div>
        </section>

        {/* Closing band */}
        <section className="border-t border-border bg-secondary text-secondary-foreground dark:bg-[oklch(0.12_0.01_75)] dark:border-border">
          <div className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.4fr_auto] items-center gap-8">
            <div>
              <div className="font-data text-[11px] tracking-[0.14em] uppercase text-secondary-foreground/60 dark:text-[oklch(0.62_0.01_80)] mb-3">
                End of the record
              </div>
              <p className="font-display italic text-xl sm:text-2xl max-w-xl leading-snug">
                The town remembers everything. Try again with different
                choices, and see which path it remembers better.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/simulator"
                className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-110 transition-all"
              >
                Run again <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="btn-press inline-flex items-center border border-current/40 px-6 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-primary-foreground/10 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── The "Before you play" chapters page ── */

function Chapters() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM — Five Chapters of Teluk Nusa · the story"
        description="Walk through Teluk Nusa as it is today: five chapters about a town that lives on the water, its mangrove shield, and the people you decide for."
      />
      <SiteHeader backHref="/" />

      <main className="flex-1">
        {/* Chapter masthead */}
        <section className="px-6 sm:px-10 lg:px-14 pt-12 pb-10 border-b border-border">
          <h1 className="font-display font-semibold tracking-tight leading-[0.98] text-[clamp(2.4rem,5.5vw,4.2rem)] max-w-3xl">
            Five chapters. <em className="text-vermilion">No numbers.</em> The
            town tells you what is wrong.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Before you touch a dial, walk through Teluk Nusa as it is today.
            Listen to the people. When you run the simulation afterward, you
            will already know why each decision matters.
          </p>
        </section>

        {/* Chapters */}
        <div className="divide-y divide-border">
          {CHAPTERS.map((c, i) => (
            <motion.section
              key={c.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="grid lg:grid-cols-[1fr_1.15fr] gap-0 min-w-0 group"
            >
              {/* Voice + lesson */}
              <div className="px-6 sm:px-10 lg:px-14 py-10 lg:py-14 lg:border-r border-border min-w-0">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-data text-vermilion text-base">{c.n}</span>
                </div>
                <blockquote className="font-display italic text-xl sm:text-2xl leading-snug border-l-2 border-vermilion pl-5 mb-6">
                  {c.voice}
                </blockquote>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight mb-4">{c.title}</h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-xl">{c.lesson}</p>
                <div className="mt-6">
                  <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground/70">{c.connects}</span>
                </div>
              </div>
              {/* Photo plate */}
              <figure className="photo-plate overflow-hidden m-6 sm:m-8 lg:m-8 group cursor-pointer">
                <img src={c.photo} alt={c.alt} className="h-full min-h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" loading="lazy" />
                <figcaption className="plate-caption">
                  <span>{c.cap}</span>
                  <span>{c.fig}</span>
                </figcaption>
              </figure>
            </motion.section>
          ))}
        </div>

        {/* Closing band */}
        <section className="border-t border-border bg-secondary text-secondary-foreground dark:bg-[oklch(0.12_0.01_75)] dark:border-border">
          <div className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.4fr_auto] items-center gap-8">
            <div>
              <div className="font-data text-[11px] tracking-[0.14em] uppercase text-secondary-foreground/60 dark:text-[oklch(0.62_0.01_80)] mb-3">
                End of story
              </div>
              <p className="font-display italic text-xl sm:text-2xl max-w-xl leading-snug">
                You have met the town. Now spend twenty-five years trying to
                keep it standing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/simulator"
                className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-110 transition-all"
              >
                Start the simulation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/briefing"
                className="btn-press inline-flex items-center border border-current/40 px-6 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-primary-foreground/10 transition-colors"
              >
                Mission briefing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Router: pick the right mode ── */

export default function Story() {
  const { currentResult } = useSim();

  if (currentResult) {
    return <WhatHappened result={currentResult} />;
  }
  return <Chapters />;
}
