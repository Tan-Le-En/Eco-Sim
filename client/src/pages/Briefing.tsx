/**
 * ECO//SIM — Briefing (Editorial Field Study v3)
 * A single-screen field briefing: mission statement left, datum plate right,
 * three goals as a numbered register, challenges as a hairline list.
 * Real photography, flat hairline rules, mono specimen labels.
 */
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BASELINE, KID_GOALS, INDICATOR_META } from "@/lib/sim/types";

const PHOTO = "/manus-storage/hero_fishermen-nets-clean_c209bb82.jpg";
const RIVER = "/manus-storage/mangrove-river_a2d59747.jpg";
const JETTY = "/manus-storage/clan-jetty_7ac07e27.jpg";

const CHALLENGES: [string, string][] = [
  ["Smoke", "Most electricity comes from burning fuel."],
  ["Monsoon", "Stronger storms put seafront homes at risk."],
  ["Fewer fish", "Too many boats; the mangroves are shrinking."],
  ["Dry taps", "Water demand is growing faster than supply."],
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

export default function Briefing() {
  const [showNumbers, setShowNumbers] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <PageMeta
        title="ECO//SIM — Mission briefing · keep the town alive for 25 years"
        description="Your mission: govern a fictional Malaysian coastal town from 2026 to 2050. RM 100 a year, eight decisions, seven vital signs."
      />
      <SiteHeader />

      <main className="flex-1 px-6 sm:px-10 lg:px-14 py-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 max-w-[1400px]">
        {/* ── Left: mission ── */}
        <div className="flex flex-col">
          <div className="field-label mb-6">Mission briefing · Section 00</div>
          <h1 className="font-display font-semibold tracking-tight leading-[0.98] text-[clamp(2.4rem,5.5vw,4.2rem)]">
            Teluk Nusa is yours.
            <br />
            <em className="text-vermilion">Keep it alive</em> for 25 years.
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            One million people live in this fictional Malaysian town. You
            receive <strong className="text-foreground">RM 100 every year</strong> to
            spend on it: energy, buses, trees, mangroves, water, housing. Every
            year from 2026 to 2050, the town responds. You win by keeping three
            registers healthy; you lose by neglecting any one of them.
          </p>

          {/* The three registers */}
          <div className="mt-10 space-y-0 divide-y divide-border border-t border-border">
            {KID_GOALS.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="py-4 flex items-baseline gap-5"
              >
                <span className="font-data text-vermilion text-sm w-6">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <div className="font-display font-semibold text-xl">{g.title}</div>
                  <div className="font-data text-[11px] tracking-[0.08em] uppercase text-muted-foreground mt-1">
                    {g.keys.map((k) => INDICATOR_META[k].label).join(" · ")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Challenges: hairline list */}
          <div className="mt-10">
            <div className="field-label mb-4">What's wrong in 2026</div>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {CHALLENGES.map((entry, i) => (
                <motion.div
                  key={entry[0]}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-l-2 border-vermilion pl-4"
                >
                  <div className="font-data text-[11px] tracking-[0.14em] uppercase text-vermilion mb-0.5">{entry[0]}</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{entry[1]}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/simulator"
              className="btn-press inline-flex items-center gap-3 bg-vermilion text-primary-foreground font-display italic text-lg px-8 py-3.5 hover:brightness-105 transition-all"
            >
              Begin the study <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/transparency"
              className="btn-press inline-flex items-center border border-foreground px-6 py-3.5 font-data text-[11px] tracking-[0.14em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              The equations
            </Link>
          </div>
        </div>

        {/* ── Right: datum plate + optional numbers ── */}
        <div className="flex flex-col gap-6">
          <figure className="photo-plate overflow-hidden">
            <img src={PHOTO} alt="Malaysian fishermen at dawn" className="h-64 w-full object-cover object-top" loading="lazy" />
            <figcaption className="plate-caption">
              <span>Fishermen at dawn, East Coast</span>
              <span>Fig. 02</span>
            </figcaption>
          </figure>

          <figure className="photo-plate overflow-hidden hidden lg:block">
            <img src={RIVER} alt="Mangrove river in Langkawi" className="h-40 w-full" loading="lazy" />
            <figcaption className="plate-caption">
              <span>Mangrove river, Kilim Geopark</span>
              <span>Fig. 03</span>
            </figcaption>
          </figure>

          <figure className="photo-plate overflow-hidden hidden lg:block">
            <img src={JETTY} alt="Clan jetty houses on stilts over the sea" className="h-40 w-full object-cover" loading="lazy" />
            <figcaption className="plate-caption">
              <span>Where your town lives · clan jetty</span>
              <span>Fig. 04</span>
            </figcaption>
          </figure>

          {/* The datum — expandable */}
          <button
            onClick={() => setShowNumbers((v) => !v)}
            className="btn-press border border-border bg-card px-5 py-4 flex items-center justify-between gap-3 text-left"
          >
            <span className="font-data text-[11px] tracking-[0.14em] uppercase">
              {showNumbers ? "Close" : "Open"} the 2026 datum
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showNumbers ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {showNumbers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="border border-border bg-card divide-y divide-border/60">
                  {DATUM.map(([label, value]) => (
                    <div key={label} className="px-4 py-2 flex items-baseline justify-between gap-3">
                      <span className="font-data text-[10px] tracking-[0.12em] uppercase text-muted-foreground">{label}</span>
                      <span className="font-data text-[13px] tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="px-4 py-2.5">
                    <span className="status-chip">Fictional baseline · not real data</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="font-data text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            Read this page, then go govern.
          </span>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
