/**
 * ECO//SIM — Landing (Editorial Field Study v3)
 * Documentary-editorial: full-viewport asymmetric hero with real photography,
 * field-numbered sections, hairline rules, zero radius, single vermilion accent.
 * Single screen on desktop — hero fills the viewport, one band below.
 */

import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import PageMeta from "@/components/PageMeta";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sun, Moon } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import FadeImg from "@/components/FadeImg";
import { goalsMetCount } from "@/components/TownMood";
import { runSimulation } from "@/lib/sim/engine";
import { Controls, DEFAULT_CONTROLS } from "@/lib/sim/types";
import { useTheme } from "@/contexts/ThemeContext";

const HERO = "/storage/kuala-kedah-hd_dfd13b90.jpg";
const JETTY = "/storage/stilt-houses-real_4d70b8ec.jpg";
const MANGROVE = "/storage/merbok-mangrove-real_ccdd2def.jpg";
const NETS = "/storage/fishermen-dawn-nets-real_81f6e009.jpeg";
const LANGKAWI = "/storage/clan-jetties-aerial-real_f756af5d.jpg";

/**
 * Specimen bench: three preset plans run through the REAL engine at build of
 * the page. If the engine changes, these numbers change with it — a live
 * specimen, not a screenshot that can go stale.
 */
const BENCH_PRESETS: {
  key: string;
  name: string;
  blurb: string;
  controls: Partial<Controls>;
}[] = [
  {
    key: "forest",
    name: "Forest & transit",
    blurb: "Trees and buses first",
    controls: {
      renewableElectricity: 70,
      publicTransport: 55,
      mangroveRestoration: 20,
      coastalDevelopment: 0,
      waterEfficiency: 40,
      wasteRecycling: 45,
      fishingPressure: 30,
      industrialActivity: 20,
    },
  },
  {
    key: "middle",
    name: "Middle course",
    blurb: "A bit of everything",
    controls: {
      renewableElectricity: 45,
      publicTransport: 25,
      mangroveRestoration: 10,
      coastalDevelopment: 10,
      waterEfficiency: 20,
      wasteRecycling: 30,
      fishingPressure: 55,
      industrialActivity: 50,
    },
  },
  {
    key: "industrial",
    name: "Industrial coast",
    blurb: "Jobs first, worry later",
    controls: {
      renewableElectricity: 10,
      publicTransport: 5,
      mangroveRestoration: 0,
      coastalDevelopment: 25,
      waterEfficiency: 5,
      wasteRecycling: 10,
      fishingPressure: 85,
      industrialActivity: 95,
    },
  },
];

const BENCH = BENCH_PRESETS.map(p => {
  const result = runSimulation({ ...DEFAULT_CONTROLS, ...p.controls });
  const finalYear = result.years[result.years.length - 1];
  return {
    ...p,
    score: result.score,
    targets: finalYear ? goalsMetCount(finalYear.indicators) : 0,
    // Score ≥ 58 reads as a town holding on: show what worked, else what broke.
    verdict: result.score >= 58 ? result.biggestSuccess : result.biggestFailure,
    happy: result.score >= 58,
  };
});

const FIELD = [
  {
    n: "01",
    k: "Meet your town",
    t: "A fictional town on the Strait of Malacca. Real photos, real problems. These are the people you decide for.",
    img: JETTY,
    cap: "Clan jetty, Penang. Houses over the sea.",
  },
  {
    n: "02",
    k: "Change one thing. Watch the town.",
    t: "Eight dials, 25 years, seven registers to protect. Move one dial. The whole town responds.",
    img: MANGROVE,
    cap: "Mangrove river, Langkawi. Nature's sea wall.",
  },
  {
    n: "03",
    k: "Try again.",
    t: "No perfect plan. Only trade-offs. Every run tells you why. Then try a different one.",
    img: NETS,
    cap: "Fishermen at dawn, Kuala Kedah",
  },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  // Sticky mobile CTA: once the hero scrolls out of view, offer the main action
  // from the bottom of the screen on small devices.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const el = document.getElementById("home-hero");
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setPastHero(rect.bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = theme === "dark";

  return (
    <>
      <PageMeta
        title="ECO//SIM — A Field Study of a Coastal Town, 2026–2050"
        description="Change one thing, watch everything change. An interactive field study of Teluk Nusa, a fictional Malaysian coastal town: simple enough for a child, rigorous enough for a professor."
      />
      <div
        className={
          `min-h-screen flex flex-col bg-background` +
          (pastHero ? ` pb-[72px] md:pb-0` : ``)
        }
      >
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 flex flex-col outline-none"
        >
          {/* ────────────── Full-viewport editorial hero ────────────── */}
          <section
            id="home-hero"
            className="relative flex-1 grid lg:grid-cols-[1.1fr_1fr] h-[92vh]"
          >
            {/* Left: typographic hero, offset */}
            <div className="relative flex flex-col justify-between px-4 sm:px-6 lg:px-10 py-4 lg:py-6">
              <SiteHeader />

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="max-w-xl"
              >
                <h1 className="font-display font-semibold tracking-tight text-[clamp(3rem,7.5vw,6.5rem)] leading-[1.02]">
                  <span className="block mb-2 sm:mb-3">One million</span>
                  <span className="block mb-2 sm:mb-3">people.</span>
                  <span className="block">
                    Twenty-five <span className="text-vermilion">years.</span>
                  </span>
                </h1>
                <p className="mt-8 sm:mt-10 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground">
                  Govern Teluk Nusa, 2026 to 2050. Keep the sea clean, the water
                  flowing, and people treated fairly.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/simulator"
                    className="btn btn-primary px-8 py-4 text-[15px]"
                  >
                    Start governing <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/story"
                    className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground border-b border-border pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
                  >
                    Read the story first
                  </Link>
                </div>
              </motion.div>

              <footer className="pt-5 border-t border-border">
                <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                  An open learning model, not a forecast
                </span>
              </footer>
            </div>

            {/* Right: bleeding photograph plate */}
            <div className="relative min-h-[42vh] lg:min-h-0">
              <FadeImg
                eager
                src={HERO}
                alt="Aerial photograph of Kuala Kedah estuary showing the river mouth, coastal settlement, and breakwater"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <button
                onClick={toggleTheme}
                className="absolute bottom-4 right-4 btn-press inline-flex items-center justify-center w-11 h-11 rounded-full bg-background/92 backdrop-blur-md text-foreground border border-border transition-colors hover:border-foreground"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                title={dark ? "Light mode" : "Dark mode"}
              >
                {dark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </section>

          {/* ────────────── Specimen bench: the real engine, three preset plans ────────────── */}
          <section
            className="border-t border-border"
            aria-label="Three preset plans, computed live"
          >
            <div className="px-6 sm:px-10 lg:px-14 py-12">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight">
                  Three plans, run for you.
                </h2>
                <p className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground max-w-sm">
                  Computed live by the same engine you will govern with — not a
                  screenshot.
                </p>
              </div>
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border border-border bg-card">
                {BENCH.map(b => (
                  <article
                    key={b.key}
                    className="px-5 sm:px-6 py-5 flex flex-col gap-2.5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display italic font-semibold text-xl">
                        {b.name}
                      </h3>
                      <span
                        className={`font-data text-2xl tabular-nums font-medium leading-none ${b.happy ? "text-ok" : "text-vermilion"}`}
                      >
                        {b.score.toFixed(0)}
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {" "}
                          /100
                        </span>
                      </span>
                    </div>
                    <p className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                      {b.blurb} · {b.targets} / 5 mission targets
                    </p>
                    <p className="text-[13px] leading-snug text-muted-foreground">
                      {b.verdict}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ────────────── Three numbered field plates (editorial triptych) ────────────── */}
          <section className="border-t border-border">
            <div className="grid lg:grid-cols-[1fr_auto] items-end px-6 sm:px-10 lg:px-14 pt-12 pb-8">
              <div>
                <h2 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight">
                  One town. Eight dials. Twenty-five years.
                </h2>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-t border-border">
              {FIELD.map((f, i) => (
                <motion.div
                  key={f.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: Math.min(i * 0.08, 0.16),
                    duration: 0.45,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <div className="px-6 sm:px-10 pt-8 pb-4">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-data text-vermilion text-sm font-semibold tracking-wider">
                        {f.n}
                      </span>
                      <span className="font-display italic font-semibold text-xl">
                        {f.k}
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground max-w-sm">
                      {f.t}
                    </p>
                  </div>
                  <figure className="mx-6 sm:mx-10 mb-10 photo-plate overflow-hidden">
                    <FadeImg
                      src={f.img}
                      alt={f.cap}
                      className="h-52 w-full object-cover"
                    />
                    <figcaption className="plate-caption">{f.cap}</figcaption>
                  </figure>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ────────────── CTA band: quote + closing photograph + actions ────────────── */}
          <section className="border-t border-border">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="px-6 sm:px-10 lg:px-14 py-14 grid lg:grid-cols-[1.3fr_1fr_auto] items-center gap-8"
            >
              <div>
                <p className="font-display italic text-xl sm:text-2xl max-w-xl">
                  “When I was young, the bay was full of fish. Can you keep it
                  that way?”
                </p>
                <p className="mt-3 font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                  What a fisherman in Teluk Nusa actually wants to know
                </p>
              </div>
              <figure className="photo-plate overflow-hidden hidden md:block">
                <FadeImg
                  src={LANGKAWI}
                  alt="Aerial view of stilt house village on the coast, Penang"
                  className="h-52 w-full object-cover"
                />
                <figcaption className="plate-caption">
                  <span>Coastal settlement, Penang</span>
                  <span>Fig. 02</span>
                </figcaption>
              </figure>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/simulator"
                  className="btn btn-primary px-8 py-4 text-[15px]"
                >
                  Start governing <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/briefing" className="btn btn-outline">
                  Mission briefing
                </Link>
                <Link href="/faq" className="btn btn-quiet">
                  FAQ
                </Link>
              </div>
            </motion.div>
          </section>
        </main>

        <SiteFooter />
      </div>

      {/* Sticky mobile CTA bar — appears once the hero has scrolled away */}
      {pastHero && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
          <Link
            href="/simulator"
            className="btn btn-primary flex-1 justify-center"
          >
            Start governing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/briefing" className="btn btn-quiet">
            Briefing
          </Link>
        </div>
      )}
    </>
  );
}
