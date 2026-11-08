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
    voice:
      "My grandmother said the mangroves were a wall. We cut them down. Now waves knock at the door.",
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
    voice:
      "I leave before the sun. Some days the nets are heavy. Some days I bring home stories.",
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

  const next = () => setChapter(v => Math.min(v + 1, total - 1));
  const prev = () => setChapter(v => Math.max(v - 1, 0));

  // Keyboard: ← / → step through chapters
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const progressPct = Math.round(((chapter + 1) / total) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background lg:h-screen lg:overflow-hidden">
      <PageMeta
        title="ECO//SIM — Prologue · meet Teluk Nusa before you govern"
        description="A cut-scene storybook of Teluk Nusa: five chapters on the town, its mangrove shield, and the people you decide for. Then the briefing."
      />
      <SiteHeader backHref="/" />

      <main
        id="main"
        tabIndex={-1}
        className="flex-1 min-h-0 flex flex-col outline-none lg:overflow-hidden"
      >
        {/* Chapter progress */}
        <div className="shrink-0 px-4 sm:px-8 lg:px-10 py-2 border-b border-border/60">
          <div className="flex items-center justify-between gap-4 mb-1.5">
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

        <div className="flex-1 min-h-0 lg:overflow-hidden">
          {/* Story chapters */}
          {!last && c && (
            <AnimatePresence mode="wait">
              <motion.section
                key={chapter}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                className="h-full px-4 sm:px-8 lg:px-10 py-3 lg:py-4 grid lg:grid-cols-[1fr_1.05fr] gap-3 lg:gap-6 min-w-0 items-center"
              >
                <div className="lg:pr-6 lg:border-r border-border min-w-0 flex flex-col justify-center">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-data text-vermilion text-sm">
                      {c.n}
                    </span>
                  </div>
                  <blockquote className="font-display italic text-lg sm:text-xl lg:text-[1.35rem] leading-snug border-l-2 border-vermilion pl-4 mb-3">
                    {c.voice}
                  </blockquote>
                  <h2 className="font-display font-semibold text-xl sm:text-2xl lg:text-[1.75rem] tracking-tight mb-2">
                    {c.title}
                  </h2>
                  <p className="text-[13px] sm:text-sm leading-relaxed text-muted-foreground max-w-xl">
                    {c.lesson}
                  </p>
                  <div className="mt-2.5">
                    <span className="font-data text-[10px] tracking-[0.14em] uppercase text-muted-foreground leading-snug">
                      {c.connects}
                    </span>
                  </div>
                </div>
                <figure className="photo-plate overflow-hidden flex flex-col justify-center min-h-0 max-h-[48vh] lg:max-h-full">
                  <FadeImg
                    src={c.photo}
                    alt={c.alt}
                    className="h-full min-h-[160px] lg:min-h-0 w-full object-cover"
                  />
                  <figcaption className="plate-caption shrink-0">
                    <span>{c.cap}</span>
                    <span>{c.fig}</span>
                  </figcaption>
                </figure>
              </motion.section>
            </AnimatePresence>
          )}

          {/* Briefing chapter — mission, goals, challenges, datum */}
          {last && (
            <section className="h-full px-4 sm:px-8 lg:px-10 py-3 lg:py-4 grid lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-6 items-start lg:items-center min-h-0 lg:overflow-hidden">
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-data text-vermilion text-sm">05</span>
                </div>
                <h1 className="font-display font-semibold tracking-tight leading-[1] text-[clamp(1.75rem,3.2vw,2.75rem)] mb-2">
                  Teluk Nusa is yours.{" "}
                  <span className="text-vermilion">Keep it alive</span> for 25
                  years.
                </h1>
                <p className="text-[13px] leading-snug text-muted-foreground max-w-xl mb-3">
                  One million people.{" "}
                  <strong className="text-foreground">
                    100 budget points for all 25 years
                  </strong>{" "}
                  — energy, buses, trees, water, housing. Keep three registers
                  healthy.
                </p>

                {/* Three registers */}
                <div className="space-y-0 divide-y divide-border border-y border-border mb-3">
                  {KID_GOALS.map((g, i) => (
                    <div
                      key={g.id}
                      className="py-1.5 flex items-baseline gap-3"
                    >
                      <span className="font-data text-vermilion text-[11px] w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-[15px] leading-tight">
                          {g.title}
                        </div>
                        <div className="font-data text-[9px] tracking-[0.06em] uppercase text-muted-foreground mt-0.5 leading-snug">
                          {g.keys.map(k => INDICATOR_META[k].label).join(" · ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenges */}
                <div>
                  <div className="font-data text-[9px] tracking-[0.14em] uppercase text-muted-foreground mb-1.5">
                    Challenges ahead
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {CHALLENGES.map(entry => (
                      <div
                        key={entry[0]}
                        className="border-l-2 border-vermilion pl-2.5"
                      >
                        <div className="font-data text-[10px] tracking-[0.12em] uppercase text-vermilion leading-none mb-0.5">
                          {entry[0]}
                        </div>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {entry[1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center min-h-0 gap-2">
                <figure className="photo-plate overflow-hidden shrink-0 hidden sm:block">
                  <FadeImg
                    src={PHOTOS.workingJetty}
                    alt="Clan jetty houses on stilts over the sea"
                    className="h-24 lg:h-28 w-full object-cover object-top"
                  />
                  <figcaption className="plate-caption py-1">
                    <span>Clan jetty</span>
                    <span>Fig. 05</span>
                  </figcaption>
                </figure>

                <div className="border border-border bg-card grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 divide-y divide-border/60 min-h-0">
                  {DATUM.map(([label, value]) => (
                    <div
                      key={label}
                      className="px-2.5 py-1 flex items-baseline justify-between gap-2"
                    >
                      <span className="font-data text-[9px] tracking-[0.1em] uppercase text-muted-foreground leading-tight">
                        {label}
                      </span>
                      <span className="font-data text-[11px] tabular-nums leading-tight text-right shrink-0">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Chapter navigation */}
        <div className="shrink-0 px-4 sm:px-8 lg:px-10 py-2.5 border-t border-border flex items-center justify-between gap-3 bg-background">
          {chapter > 0 ? (
            <button
              onClick={prev}
              className="btn-press inline-flex items-center gap-1.5 font-data text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          ) : (
            <span />
          )}
          {!last ? (
            <button
              onClick={next}
              className="btn btn-primary px-6 py-2.5 text-[14px]"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              <Link
                href="/briefing"
                className="btn btn-outline px-4 py-2 text-[12px]"
              >
                Mission briefing
              </Link>
              <Link
                href="/simulator"
                className="btn btn-primary px-5 py-2.5 text-[14px]"
              >
                Start the simulation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <div className="hidden lg:block shrink-0">
        <SiteFooter />
      </div>
      <div className="lg:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
