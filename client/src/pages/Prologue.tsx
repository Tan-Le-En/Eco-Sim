/**
 * ECO//SIM — Prologue (hidden cut-scene storybook)
 *
 * A sequential storybook shown before the simulator. Five chapters walk the
 * visitor through Teluk Nusa as it is today, then the briefing: mission,
 * goals, challenges, and the 2026 datum. Ends with a CTA to start the
 * simulation.
 *
 * Not linked from the header, mobile drawer, or site search — reachable only
 * at /prologue by direct URL.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import PageMeta from "@/components/PageMeta";
import SiteFooter from "@/components/SiteFooter";
import FadeImg from "@/components/FadeImg";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { KID_GOALS, INDICATOR_META, BASELINE } from "@/lib/sim/types";

const PHOTOS = {
  riverVillage: "/storage/stilt-houses-real_4d70b8ec.jpg",
  mangroveRoots: "/storage/mangrove-roots-real_fc3e4c78.jpg",
  fishingCoast: "/storage/fishermen-net-cast-real_a6fc104d.jpg",
  mangroveAerial: "/storage/merbok-mangrove-real_ccdd2def.jpg",
  workingJetty: "/storage/clan-jetties-aerial-real_f756af5d.jpg",
};

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
    voice: "When the river rises, our village rises with it.",
    title: "A town that lives on the water",
    lesson:
      "Built beside the sea and river: homes, markets, roads. Also the biggest risk. Sea rises a little. Rain comes heavier.",
    photo: PHOTOS.riverVillage,
    alt: "Colourful boats moored in a calm Malaysian river village",
    cap: "River village, fictional Teluk Nusa",
    fig: "Fig. 01",
    connects:
      "Connects to: Building by the Beach · Safe From Flood · Plant Trees & Mangroves",
  },
  {
    n: "02",
    voice: "My grandmother said the mangroves were a wall. We cut them down. Now waves knock at the door.",
    title: "The wall we cut down",
    lesson:
      "Mangrove roots hold soil, slow waves, shelter baby fish. Clear them: more flooding, fewer fish. Plant them: both recover.",
    photo: PHOTOS.mangroveRoots,
    alt: "Mangrove prop roots tangled on a tidal flat",
    cap: "Mangrove roots on a tidal flat",
    fig: "Fig. 02",
    connects:
      "Connects to: Plant Trees & Mangroves · Nature & Animals · How Much We Fish",
  },
  {
    n: "03",
    voice: "I leave before the sun. Some days the nets are heavy. Some days I bring home stories.",
    title: "The nets that come home lighter",
    lesson:
      "The sea only gives what it has. Catch too many today and there are fewer fish tomorrow. The hardest dial.",
    photo: PHOTOS.fishingCoast,
    alt: "Fishing boats on the coast at first light",
    cap: "The fishing coast, first light",
    fig: "Fig. 03",
    connects: "Connects to: How Much We Fish · Nature & Animals · Good Life",
  },
  {
    n: "04",
    voice: "Where the green ends, the roofs begin.",
    title: "The whole town from above",
    lesson:
      "One dial pulls every thread: roads, smoke, air, rain, river, floors. That is why we watch seven registers.",
    photo: PHOTOS.mangroveAerial,
    alt: "Aerial view of mangrove forest meeting coastal development",
    cap: "Aerial view of the coast",
    fig: "Fig. 04",
    connects: "Connects to: every dial · every indicator",
  },
];

const CHALLENGES: [string, string][] = [
  ["Smoke", "Most power burns fuel."],
  ["Monsoon", "Storms threaten seafront homes."],
  ["Fewer fish", "Too many boats. Mangroves shrink."],
  ["Dry taps", "Demand grows faster than supply."],
];

const DATUM: [string, string][] = [
  ["Population", BASELINE.population.toLocaleString()],
  ["Window", "2026 – 2050"],
  ["Electricity demand", "8,000 GWh / year"],
  ["Fossil share", "70%"],
  ["Renewable share", "30%"],
  ["Forest & mangroves", "18% of mapped area"],
  ["Urbanized land", "52%"],
  ["Annual rainfall", "2,400 mm"],
  ["Water demand", "210 million m³ / year"],
  ["Recycling", "18%"],
  ["Private vehicles", "68% of motorized trips"],
  ["Flood exposure", "Moderate"],
];

export default function Prologue() {
  const [location] = useLocation();
  const [chapter, setChapter] = useState(0);
  const total = CHAPTERS.length + 1; // +1 for the briefing chapter
  const last = chapter === total - 1;
  const c = last ? null : CHAPTERS[chapter];

  // Close menu / reset chapter on route change
  useEffect(() => {
    setChapter(0);
  }, [location]);

  const next = () => setChapter((v) => Math.min(v + 1, total - 1));
  const prev = () => setChapter((v) => Math.max(v - 1, 0));

  // Keyboard: ← / → step through chapters
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const progressPct = Math.round(((chapter + 1) / total) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageMeta
        title="ECO//SIM — Prologue · meet Teluk Nusa before you govern"
        description="A cut-scene storybook of Teluk Nusa: five chapters on the town, its mangrove shield, and the people you decide for. Then the briefing."
      />
      <SiteHeader backHref="/" />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {/* Chapter progress */}
        <div className="px-6 sm:px-10 lg:px-14 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              Chapter {chapter + 1} of {total}
            </span>
            <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground tabular-nums">
              {progressPct}%
            </span>
          </div>
          <div className="h-1 bg-secondary">
            <div
              className="h-full bg-vermilion transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Story chapters */}
        {!last && (
          <AnimatePresence mode="wait">
            <motion.section
              key={chapter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="px-6 sm:px-10 lg:px-14 py-10 grid lg:grid-cols-[1fr_1.15fr] gap-0 min-w-0"
            >
              <div className="px-6 sm:px-10 lg:px-14 py-10 lg:py-14 lg:border-r border-border min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-data text-vermilion text-base">{c!.n}</span>
                </div>
                <blockquote className="font-display italic text-xl sm:text-2xl leading-snug border-l-2 border-vermilion pl-5 mb-6">
                  {c!.voice}
                </blockquote>
                <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-tight mb-4">
                  {c!.title}
                </h2>
                <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-xl">
                  {c!.lesson}
                </p>
                <div className="mt-6">
                  <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                    {c!.connects}
                  </span>
                </div>
              </div>
              <figure className="photo-plate overflow-hidden m-6 sm:m-8 lg:m-8 flex flex-col justify-center">
                <FadeImg src={c!.photo} alt={c!.alt} className="h-full min-h-56 w-full object-cover" />
                <figcaption className="plate-caption">
                  <span>{c!.cap}</span>
                  <span>{c!.fig}</span>
                </figcaption>
              </figure>
            </motion.section>
          </AnimatePresence>
        )}

        {/* Briefing chapter — mission, goals, challenges, datum */}
        {last && (
          <section className="px-6 sm:px-10 lg:px-14 py-10 grid lg:grid-cols-[1.2fr_1fr] gap-12">
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-data text-vermilion text-base">05</span>
              </div>
              <h1 className="font-display font-semibold tracking-tight leading-[0.98] text-[clamp(2.4rem,5.5vw,4.2rem)] mb-6">
                Teluk Nusa is yours.
                <br />
                <span className="text-vermilion">Keep it alive</span> for 25 years.
              </h1>
              <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-xl mb-8">
                One million people. <strong className="text-foreground">100 budget points for all 25 years</strong> — energy,
                buses, trees, water, housing. Keep three registers healthy throughout.
              </p>

              {/* Three registers */}
              <div className="space-y-0 divide-y divide-border border-t border-border mb-8">
                {KID_GOALS.map((g, i) => (
                  <div key={g.id} className="py-4 flex items-baseline gap-5">
                    <span className="font-data text-vermilion text-sm w-6">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <div className="font-display font-semibold text-xl">{g.title}</div>
                      <div className="font-data text-[11px] tracking-[0.08em] uppercase text-muted-foreground mt-1">
                        {g.keys.map((k) => INDICATOR_META[k].label).join(" · ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Challenges */}
              <div>
                <div className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-4">
                  Challenges ahead
                </div>
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                  {CHALLENGES.map((entry, i) => (
                    <div key={entry[0]} className="border-l-2 border-vermilion pl-4">
                      <div className="font-data text-[11px] tracking-[0.14em] uppercase text-vermilion mb-0.5">
                        {entry[0]}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{entry[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <figure className="photo-plate overflow-hidden mb-6">
                <FadeImg src={PHOTOS.workingJetty} alt="Clan jetty houses on stilts over the sea" className="h-56 w-full object-cover object-top" />
                <figcaption className="plate-caption">
                  <span>Where your town lives · clan jetty</span>
                  <span>Fig. 05</span>
                </figcaption>
              </figure>

              <div className="border border-border bg-card divide-y divide-border/60">
                {DATUM.map(([label, value]) => (
                  <div key={label} className="px-4 py-2 flex items-baseline justify-between gap-3">
                    <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-data text-[13px] tabular-nums">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Chapter navigation */}
        <div className="px-6 sm:px-10 lg:px-14 py-6 border-t border-border flex items-center justify-between">
          {chapter > 0 && (
            <button
              onClick={prev}
              className="btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          )}
          {!last ? (
            <button
              onClick={next}
              className="btn btn-primary px-8 py-4 text-[15px]"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link href="/briefing" className="btn btn-outline px-6 py-3 text-[13px]">
                Mission briefing
              </Link>
              <Link href="/simulator" className="btn btn-primary px-8 py-4 text-[15px]">
                Start the simulation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
