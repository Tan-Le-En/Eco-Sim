/**
 * ECO//SIM — Landing page (Kampung Coast v2)
 * Style: warm Malaysian daylight picture-book. One glance = one story:
 * big illustrated town + one friendly sentence + one big button.
 * Kid layer on top; expert links tucked away below.
 */
import { Link } from "wouter";
import WaveDivider from "@/components/WaveDivider";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sun,
  Fish,
  Umbrella,
  HeartPulse,
  Leaf,
  Droplets,
  Scale,
  GraduationCap,
  Landmark,
} from "lucide-react";

const HERO = "/manus-storage/kampung-hero_6340e8df.png";
const BG = "/manus-storage/kampung-bg_d67dbfd0.png";
const PAKALI = "/manus-storage/pakali_3bdfa8db.png";

const STEPS = [
  {
    icon: Landmark,
    title: "Meet your town",
    kid: "This is Teluk Nusa — your town by the sea.",
  },
  {
    icon: Sun,
    title: "Make your choices",
    kid: "Want more buses? More trees? Less fishing? You decide!",
  },
  {
    icon: Fish,
    title: "Watch what happens",
    kid: "See your town in 2050 — happy or in trouble?",
  },
  {
    icon: GraduationCap,
    title: "Learn the why",
    kid: "Tap anything to learn why it changed. Try again!",
  },
];

const VITALS = [
  { icon: Sun, name: "Sea & Air", bm: "Laut & Udara", color: "text-coral-risk" },
  { icon: Leaf, name: "Nature", bm: "Alam", color: "text-emerald-life" },
  { icon: Droplets, name: "Water", bm: "Air Bersih", color: "text-teal-signal" },
  { icon: Umbrella, name: "No Flood", bm: "Tak Banjir", color: "text-chart-3" },
  { icon: HeartPulse, name: "Healthy", bm: "Sihat", color: "text-amber-warn" },
  { icon: Landmark, name: "Good Life", bm: "Selesa", color: "text-violet-policy" },
  { icon: Scale, name: "Fair", bm: "Adil", color: "text-pink-400" },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top nav */}
      <header className="border-b border-border/60 bg-background/85 backdrop-blur sticky top-0 z-40">
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/manus-storage/ecosim-logo_8c68d962.png" alt="ECO//SIM logo" className="w-9 h-9 rounded-lg" />
            <span className="font-display text-xl font-bold tracking-tight">
              ECO<span className="text-teal-signal">//</span>SIM
            </span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/briefing"
              className="btn-press rounded-full px-4 py-2 text-sm font-bold text-secondary-foreground hover:bg-secondary transition-colors"
            >
              Briefing
            </Link>
            <Link
              href="/simulator"
              className="btn-press rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-bold hover:brightness-105 transition-all"
            >
              Play!
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero: one glance, one story */}
      <section className="container py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="panel-label mb-4">A game about your town · Teluk Nusa, Malaysia · 2026 – 2050</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5">
              Your town needs you.{" "}
              <span className="text-teal-signal">Jom!</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mb-8">
              You are the boss of a small Malaysian town by the sea. You have
              25 years to keep the sea clean, the people healthy, and everyone
              treated fair. Every choice you make changes the town — and there
              is no easy answer.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                href="/briefing"
                className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display text-lg font-bold rounded-full px-8 py-4 hover:brightness-105 transition-all shadow-lg shadow-teal-signal/25"
              >
                Start the game <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/transparency"
                className="btn-press inline-flex items-center gap-2 border-2 border-border text-foreground rounded-full px-6 py-4 font-bold text-sm hover:bg-secondary transition-colors"
              >
                For teachers & professors
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Simple enough for a 5-year-old. Deep enough for a professor.
              Everything you see comes from open maths —{" "}
              <Link href="/transparency" className="text-teal-signal font-bold underline underline-offset-4">
                see the equations
              </Link>
              .
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="relative float-gentle"
          >
            <img
              src={HERO}
              alt="Illustrated view of Teluk Nusa, the fictional Malaysian coastal town"
              className="rounded-3xl border-4 border-white shadow-2xl w-full"
            />
            <div className="absolute -bottom-4 left-6 right-6 bg-card rounded-2xl border border-border px-5 py-3 flex items-center justify-between gap-3 shadow-lg">
              <span className="font-display font-bold text-sm">
                🏘️ Teluk Nusa · one million people · your town
              </span>
              <span className="font-data text-xs text-teal-signal whitespace-nowrap">2026 → 2050</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The 7 things you care about — as big friendly chips */}
      <section className="border-t border-border/60 bg-white/50">
        <div className="container py-12">
          <div className="panel-label mb-5">The 7 things that matter most</div>
          <p className="text-base sm:text-lg max-w-2xl mb-8 text-muted-foreground">
            You don't need to read anything to play. Just keep these seven
            things healthy — like taking care of a garden you love.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {VITALS.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="soft-card p-4 text-center"
              >
                <v.icon className={`w-8 h-8 mx-auto mb-2 ${v.color}`} aria-hidden="true" />
                <div className="font-display font-bold text-sm">{v.name}</div>
                <div className="font-data text-[10px] text-muted-foreground mt-0.5">{v.bm}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider tone="cream" />

      {/* How it works: 4 big illustrated steps */}
      <section className="border-t border-border/60">
        <div className="container py-14">
          <div className="panel-label mb-4">How to play</div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-10">
            Four easy steps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="soft-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-11 h-11 rounded-2xl bg-teal-signal/12 flex items-center justify-center">
                    <s.icon className="w-6 h-6 text-teal-signal" aria-hidden="true" />
                  </span>
                  <span className="font-display font-extrabold text-2xl text-teal-signal">{i + 1}</span>
                </div>
                <div className="font-display font-bold text-lg mb-1.5">{s.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.kid}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pak Ali narrator + honesty */}
      <section className="bg-white/50">
        <div className="container py-14 grid lg:grid-cols-[auto_1fr] gap-8 items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            src={PAKALI}
            alt="Pak Ali, the friendly old fisherman of Teluk Nusa"
            className="w-44 h-44 rounded-full border-4 border-white shadow-xl mx-auto"
          />
          <div>
            <div className="panel-label mb-3">Meet Pak Ali · your town's oldest fisherman</div>
            <blockquote className="font-display text-2xl font-bold leading-snug mb-4">
              "When I was young, the bay was full of fish. Now my net comes up
              lighter every year. Young boss — can you fix my town?"
            </blockquote>
            <p className="text-muted-foreground max-w-2xl text-sm sm:text-base mb-5">
              Teluk Nusa is a made-up town, but its problems are real ones
              faced by coastal towns all over Malaysia and the world: rising
              seas, fewer fish, dirty water, floods when the monsoon comes.
              This game helps you feel how one choice echoes through all of
              them.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="status-chip">A learning model · not a forecast</span>
              <span className="status-chip">Open maths · see the transparency page</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="">
        <div className="container py-14 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">
            Ready to be the boss of Teluk Nusa?
          </h2>
          <p className="text-muted-foreground mb-7">
            The year is 2026. You have RM 100 to spend each year. The monsoon is coming.
          </p>
          <Link
            href="/briefing"
            className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display text-lg font-bold rounded-full px-10 py-4 hover:brightness-105 transition-all shadow-lg shadow-teal-signal/25"
          >
            Yes, let's go! <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 mt-auto">
        <div className="container py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="font-data text-xs">ECO//SIM · Teluk Nusa · educational game · not real-world advice</span>
          <span className="font-display text-xs font-bold">Sayang bumi kita 💚</span>
        </div>
      </footer>
    </div>
  );
}
