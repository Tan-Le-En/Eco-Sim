/**
 * ECO//SIM — Landing page
 * Style: Deep Ocean Console — split hero over bathymetric background,
 * mission-briefing voice, no generic filler. Promise: "Change one thing.
 * See everything change."
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  ShieldQuestion,
  FlaskConical,
  GraduationCap,
  Eye,
  RefreshCw,
  GitCompareArrows,
  Lightbulb,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const LOGO = "/manus-storage/ecosim-logo_8c68d962.png";
const HERO = "/manus-storage/ecosim-hero-city_bff58f05.png";
const BG = "/manus-storage/ecosim-landing-bg_c20bb61d.png";

const HOW_IT_WORKS = [
  {
    icon: Eye,
    title: "See the city",
    body: "Nusa Bay: one million people on an exposed coast. Emissions rising, water stressed, habitats shrinking, floods coming.",
  },
  {
    icon: RefreshCw,
    title: "Set your policies",
    body: "Eight levers: energy, transport, mangroves, coastal development, water, waste, fishing, and industry. Every trade-off is shown.",
  },
  {
    icon: PlayIcon,
    title: "Run to 2050",
    body: "Watch 25 years unfold: indicators move, events surface, and your decisions echo in ways you didn't expect.",
  },
  {
    icon: Lightbulb,
    title: "Learn the why",
    body: "A causal feed explains what drove each change. Compare strategies, find unintended consequences, try again.",
  },
];

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, oklch(0.17 0.035 250 / 0.96), oklch(0.17 0.035 250 / 0.72), oklch(0.17 0.035 250 / 0.35)), url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="panel-label mb-5">
              Educational simulation · fictional city · 2026 – 2050
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] mb-5">
              Nusa Bay has <span className="text-teal-signal">25 years</span>.
              <br />
              Every decision you make echoes.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              Change one thing. See everything change. Manage a coastal city of
              one million people — energy, transport, water, land, waste, and
              ecosystems — and watch the consequences propagate across climate,
              biodiversity, flood risk, health, cost, and equity.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/briefing"
                className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-6 py-3 hover:brightness-110 transition-all"
              >
                Take command — start the 2026 briefing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how"
                className="btn-press inline-flex items-center gap-2 border border-border text-foreground rounded-md px-5 py-3 font-data text-[12px] uppercase tracking-wider hover:bg-secondary transition-colors"
              >
                <Compass className="w-4 h-4" /> How it works
              </a>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <ShieldQuestion className="w-4 h-4 text-muted-foreground" />
              <Link
                href="/transparency"
                className="font-data text-[11px] text-muted-foreground hover:text-teal-signal underline-offset-4 hover:underline"
              >
                Scientific transparency — open assumptions &amp; model limits
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <img
              src={HERO}
              alt="Illustrated aerial view of the fictional coastal city Nusa Bay"
              className="rounded-lg border border-border shadow-2xl w-full"
            />
            {/* evidence framing: corner brackets + specimen annotation */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <span className="absolute -top-1 -left-1 w-10 h-10 border-t-2 border-l-2 border-teal-signal/80 rounded-tl-sm" />
              <span className="absolute -top-1 -right-1 w-10 h-10 border-t-2 border-r-2 border-teal-signal/80 rounded-tr-sm" />
              <span className="absolute -bottom-1 -left-1 w-10 h-10 border-b-2 border-l-2 border-teal-signal/80 rounded-bl-sm" />
              <span className="absolute -bottom-1 -right-1 w-10 h-10 border-b-2 border-r-2 border-teal-signal/80 rounded-br-sm" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-teal-signal/15 rounded" />
            <div className="absolute -top-2.5 left-4 right-4 bg-card/95 backdrop-blur border border-border rounded-md px-3 py-1.5 flex items-center justify-between gap-2">
              <span className="font-data text-[10px] uppercase tracking-wider text-teal-signal">
                Specimen 001 · Nusa Bay · coastal megacity under study
              </span>
              <img src={LOGO} alt="" className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-3 left-4 right-4 bg-card/95 backdrop-blur border border-border rounded-md px-3 py-2 flex items-center justify-between gap-2">
              <span className="font-data text-[10px] uppercase tracking-wider text-muted-foreground">
                Mission: protect Nusa Bay until 2050
              </span>
              <span className="font-data text-[10px] text-teal-signal tabular-nums">45.6 km² · 20×20 grid</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border">
        <div className="container py-16">
          <div className="panel-label mb-2">Briefing · four steps</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8">
            How the simulation works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="tick-edge bg-card/60 border border-border rounded-md p-5"
              >
                <item.icon className="w-5 h-5 text-teal-signal mb-3" />
                <h3 className="font-display font-semibold mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-snug">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + credibility */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container py-16 grid lg:grid-cols-2 gap-10">
          <div>
            <div className="panel-label mb-2">Who this is for</div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Built for learners who want to <span className="text-teal-signal">think in systems</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              ECO//SIM is an educational simulation for students, teachers,
              environmental clubs, and competition judges. It doesn't tell you
              what sustainability means — it lets you experiment, fail, and
              discover why connected systems behave the way they do.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Students 13–22", "Teachers", "STEM & geography", "Climate clubs", "Competition judges"].map(
                (t) => (
                  <span key={t} className="status-chip">{t}</span>
                ),
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="tick-edge bg-card/60 border border-border rounded-md p-5">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-teal-signal shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold mb-1">A learning model, not a forecast</h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Every number on this site comes from a simplified,
                    transparent educational model. It illustrates real
                    relationships — emissions, water, habitat, flood risk — but
                    it does not predict the future of any real city.
                  </p>
                </div>
              </div>
            </div>
            <div className="tick-edge bg-card/60 border border-border rounded-md p-5">
              <div className="flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-violet-policy shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold mb-1">Open assumptions</h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Equations, variables, and limits are published on the{" "}
                    <Link href="/transparency" className="text-teal-signal underline underline-offset-4">
                      transparency page
                    </Link>
                    . Know exactly what the model assumes — and what it ignores.
                  </p>
                </div>
              </div>
            </div>
            <div className="tick-edge bg-card/60 border border-border rounded-md p-5">
              <div className="flex items-start gap-3">
                <GitCompareArrows className="w-5 h-5 text-amber-warn shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold mb-1">There is no perfect answer</h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Every strategy trades something off. The point is not to
                    find a magic solution — it's to learn how to make better
                    decisions in a connected system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold">
              Ready to protect a city?
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              The clock starts in 2026. The budget is 100 units. The coast is waiting.
            </p>
          </div>
          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-6 py-3 hover:brightness-110 transition-all"
          >
            Start the challenge <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border mt-auto">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-data text-[11px] text-muted-foreground">
            ECO//SIM · Coastal City 2050 · educational simulation
          </span>
          <span className="status-chip">Not a real-world forecast</span>
        </div>
      </footer>
    </div>
  );
}
