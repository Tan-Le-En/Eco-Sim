/**
 * ECO//SIM — Briefing (Kampung Coast v2)
 * Style: warm picture-book storytelling. Story first, numbers tucked in an
 * expandable "for grown-ups" panel so a child reads the mission in seconds.
 */
import { Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Sun, Fish, Umbrella } from "lucide-react";
import {
  BASELINE,
  INDICATOR_KEYS,
  INDICATOR_META,
  KID_GOALS,
  MISSION_TARGETS,
} from "@/lib/sim/types";

const PAKALI = "/manus-storage/pakali_3bdfa8db.png";
const TOWN = "/manus-storage/kampung-hero_6340e8df.png";

const CHALLENGES = [
  { icon: Sun, title: "The sky is getting smoky", kid: "Most of our electricity comes from burning fuel." },
  { icon: Umbrella, title: "The monsoon is getting stronger", kid: "Houses by the sea are in danger of floods." },
  { icon: Fish, title: "The fish are fewer", kid: "Too many boats, and the mangroves are disappearing." },
  { icon: Sun, title: "Some taps are running dry", kid: "We need more water than we can always find." },
];

export default function Briefing() {
  const [showNumbers, setShowNumbers] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container py-8 sm:py-12 flex-1">
        <Link
          href="/"
          className="btn-press inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground mb-6"
        >
          ← Home
        </Link>

        {/* Story intro with Pak Ali */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="grid lg:grid-cols-[auto_1fr] gap-8 items-start soft-card p-6 sm:p-8 mb-8"
        >
          <img
            src={PAKALI}
            alt="Pak Ali, the old fisherman of Teluk Nusa"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto"
          />
          <div>
            <div className="panel-label mb-3">Your mission briefing</div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              <span className="text-teal-signal">Pak Ali</span> says: take care
              of my town.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-4">
              <strong className="text-foreground">Teluk Nusa</strong> is a
              friendly little town by the sea in Malaysia — one million people,
              a busy fishing bay, and a forest of mangroves that guards the
              shore. But the town is in trouble, and the mayor has asked{" "}
              <em>you</em> to be in charge.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl">
              You get <strong className="text-teal-signal">RM 100 every year</strong> to
              spend on the town. The game runs from <strong>2026 to 2050</strong>.
              Keep three big things healthy, and the town wins.
            </p>
          </div>
        </motion.section>

        {/* The 3 big goals — traffic lights */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8"
        >
          <div className="panel-label mb-4">Your three big goals (the traffic lights)</div>
          <div className="grid sm:grid-cols-3 gap-4">
            {KID_GOALS.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                className="soft-card p-5 text-center"
              >
                <div className="flex justify-center gap-1.5 mb-3">
                  {["bg-emerald-life", "bg-amber-warn", "bg-coral-risk"].map((c, j) => (
                    <span key={j} className={`w-7 h-7 rounded-full border-2 border-white shadow ${c}`} />
                  ))}
                </div>
                <div className="font-display font-bold text-lg mb-1">{g.title}</div>
                <div className="font-data text-[11px] text-muted-foreground mb-2">{g.bm}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {g.keys
                    .map((k) => INDICATOR_META[k].label)
                    .join(" · ")}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Four challenges the town faces */}
        <section className="mb-8">
          <div className="panel-label mb-4">What's wrong right now</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CHALLENGES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="soft-card p-5 flex gap-4 items-start"
              >
                <span className="w-12 h-12 rounded-2xl bg-coral-risk/10 flex items-center justify-center shrink-0">
                  <c.icon className="w-6 h-6 text-coral-risk" aria-hidden="true" />
                </span>
                <div>
                  <div className="font-display font-bold mb-1">{c.title}</div>
                  <p className="text-sm text-muted-foreground leading-snug">{c.kid}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Town snapshot image */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <img
            src={TOWN}
            alt="Teluk Nusa town illustration"
            className="rounded-3xl border-4 border-white shadow-xl w-full max-h-72 object-cover object-top"
          />
        </motion.section>

        {/* Expert numbers, tucked away */}
        <section className="mb-8">
          <button
            onClick={() => setShowNumbers((v) => !v)}
            className="btn-press w-full soft-card p-5 flex items-center justify-between gap-3 text-left"
          >
            <div>
              <div className="font-display font-bold">The real numbers (for teachers & professors)</div>
              <div className="text-sm text-muted-foreground">
                Optional: the 2026 baseline data behind the story
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${showNumbers ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {showNumbers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="soft-card p-6 mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {[
                    ["Population", BASELINE.population.toLocaleString()],
                    ["Simulation window", "2026 – 2050"],
                    ["Electricity demand", "8,000 GWh / year"],
                    ["Fossil electricity share", "70%"],
                    ["Renewable share", "30%"],
                    ["Forest & mangrove coverage", "18% of mapped area"],
                    ["Urbanized land", "52%"],
                    ["Annual rainfall", "2,400 mm"],
                    ["Water demand", "210 million m³ / year"],
                    ["Recycling rate", "18%"],
                    ["Private vehicle trips", "68% of motorized trips"],
                    ["Coastal flood exposure", "Moderate"],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-1.5">
                      <span className="font-data text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
                      <span className="font-data text-sm tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="sm:col-span-2 mt-3">
                    <span className="status-chip">Fictional baseline · educational model · not real data</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display text-lg font-bold rounded-full px-8 py-4 hover:brightness-105 transition-all shadow-lg shadow-teal-signal/25"
          >
            Start playing! <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/transparency"
            className="btn-press inline-flex items-center gap-2 border-2 border-border rounded-full px-6 py-3.5 font-bold text-sm hover:bg-secondary transition-colors"
          >
            See the maths behind it
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 mt-auto">
        <div className="container py-5 text-center">
          <span className="font-data text-[11px] text-muted-foreground">
            ECO//SIM · fictional town · educational game
          </span>
        </div>
      </footer>
    </div>
  );
}
