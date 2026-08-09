/**
 * ECO//SIM — Mission briefing
 * Style: Deep Ocean Console — dossier-style mission card: city profile table,
 * challenges, budget, success conditions. All values labelled fictional.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle2, Wallet } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import {
  BASELINE,
  INDICATOR_KEYS,
  INDICATOR_META,
  MISSION_TARGETS,
} from "@/lib/sim/types";

const PROFILE_ROWS: { label: string; value: string }[] = [
  { label: "Population", value: "1,000,000" },
  { label: "Simulation window", value: "2026 – 2050" },
  { label: "Electricity demand", value: "8,000 GWh / year" },
  { label: "Fossil electricity share", value: "70%" },
  { label: "Renewable share", value: "30%" },
  { label: "Forest & mangrove coverage", value: "18% of mapped area" },
  { label: "Urbanized land", value: "52%" },
  { label: "Annual rainfall", value: "2,400 mm" },
  { label: "Water demand", value: "210 million m³ / year" },
  { label: "Recycling rate", value: "18%" },
  { label: "Private vehicle trips", value: "68% of motorized trips" },
  { label: "Coastal flood exposure", value: "Moderate" },
];

const CHALLENGES = [
  { title: "Rising emissions", body: "70% of power still comes from fossil fuels, and the grid is growing with the population." },
  { title: "Water stress", body: "Demand is closing in on reliable supply; drought years are already appearing in the record." },
  { title: "Habitat loss", body: "The mangrove belt and wetlands are shrinking under development and pollution." },
  { title: "Flood exposure", body: "Low-income coastal districts sit meters above a rising sea with limited protection." },
];

export default function Briefing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container py-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="panel-label mb-2">Mission dossier · fictional educational model</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Protect <span className="text-teal-signal">Nusa Bay</span> until 2050
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mb-8">
            You are the city's decision-maker. The simulation starts at the 2026
            baseline below. Your choices across eight policy areas will shape
            seven indicators over 25 simulated years. Every value here is a
            simplified fictional assumption — nothing about a real city.
          </p>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
            {/* City profile */}
            <div className="grid-paper tick-edge bg-card/60 border border-border rounded-md p-5">
              <div className="panel-label mb-4">City profile · 2026 baseline</div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {PROFILE_ROWS.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-1.5">
                    <span className="font-data text-[11px] uppercase tracking-wider text-muted-foreground">
                      {r.label}
                    </span>
                    <span className="font-data text-sm tabular-nums">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="status-chip mt-4 inline-block">
                Source: ECO//SIM educational model · simplified assumption
              </div>
            </div>

            {/* Challenges */}
            <div className="space-y-4">
              <div className="panel-label">Current challenges</div>
              {CHALLENGES.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  className="border-l-2 border-coral-risk/60 bg-card/60 border border-border rounded-r-md p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-warn" />
                    <h3 className="font-display font-semibold">{c.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Budget + targets */}
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 mb-8">
            <div className="tick-edge bg-card/60 border border-border rounded-md p-5">
              <div className="panel-label mb-3">Available budget</div>
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-6 h-6 text-teal-signal" />
                <span className="font-data text-4xl font-semibold text-teal-signal tabular-nums">
                  100
                </span>
                <span className="font-data text-xs text-muted-foreground uppercase">budget units</span>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                Every policy consumes funds as the years run. If the budget
                reaches zero, projects stall and public approval drops.
              </p>
            </div>

            <div className="tick-edge bg-card/60 border border-border rounded-md p-5">
              <div className="panel-label mb-3">Mission success conditions · 2050</div>
              <div className="space-y-2">
                {MISSION_TARGETS.map((t) => {
                  const meta = INDICATOR_META[t.key];
                  return (
                    <div key={t.key} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: meta.color }} />
                      <span className="font-data text-[12px] uppercase tracking-wider flex-1">
                        {meta.label}
                      </span>
                      <span className="font-data text-sm tabular-nums">
                        {t.direction === "above" ? ">" : "<"} {t.threshold}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-life shrink-0" />
                  <span className="font-data text-[12px] uppercase tracking-wider flex-1">
                    Budget remaining
                  </span>
                  <span className="font-data text-sm tabular-nums">&gt; 0</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-snug">
                Targets are teaching goals, not pass/fail judgment — the scorecard
                at the end explains exactly how your plan performed.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/simulator"
              className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-6 py-3 hover:brightness-110 transition-all"
            >
              Enter the simulator <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/transparency"
              className="btn-press inline-flex items-center gap-2 border border-border rounded-md px-5 py-3 font-data text-[12px] uppercase tracking-wider hover:bg-secondary transition-colors"
            >
              Read the model assumptions first
            </Link>
          </div>
        </motion.div>
      </main>
      <footer className="border-t border-border mt-auto">
        <div className="container py-5 flex items-center justify-between">
          <span className="font-data text-[11px] text-muted-foreground">
            Baseline indicators: biodiversity {BASELINE.biodiversity}/100 · water stress {BASELINE.waterStress}/100 · approval {BASELINE.publicApproval}/100
          </span>
          <span className="status-chip">Fictional baseline · not real data</span>
        </div>
      </footer>
    </div>
  );
}
