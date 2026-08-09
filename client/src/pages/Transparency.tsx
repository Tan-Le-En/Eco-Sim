/**
 * ECO//SIM — Scientific transparency page
 * Style: Deep Ocean Console — documentation dossier: published equations,
 * variable tables, units, score weights, and explicit model limits.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Scale, Ban, FileText } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const EQUATIONS = [
  {
    title: "Population growth",
    formula: "P(t+1) = P(t) × (1 + r),  r = 0.012",
    note: "Plus a migration bonus when industrial activity pulls workers into the city. The growth rate r is fixed, not controlled.",
  },
  {
    title: "Renewable share of the grid",
    formula: "R(t) = R₀ + (target − R₀) × min(1, t / 10)",
    note: "The grid transitions over a 10-year rollout window toward your target share, held back slightly by heavy industry.",
  },
  {
    title: "Emissions accounting",
    formula: "E = E_ele + E_transport + E_industry + E_waste",
    note: "Each sector has an emission factor (kg CO2e per unit of activity). Climate pressure aggregates total emissions against the city's fictional 2026 baseline of ~8 Mt CO2e.",
  },
  {
    title: "Water balance",
    formula: "security = supply − demand(fishing, industry, households) × efficiency",
    note: "Supply also varies with rainfall. Drought years (2034, 2043 in this model) and low efficiency can tip the city into water stress.",
  },
  {
    title: "Flood resilience",
    formula: "resilience = natural defences(mangroves, wetlands) + investment − exposure(development, sea-level drift)",
    note: "Mangrove restoration adds coastal buffering; coastal development erodes it. Sea level rises slowly over the whole period.",
  },
  {
    title: "Biodiversity",
    formula: "B(t+1) = B(t) + habitat gain − habitat loss − pollution loss",
    note: "Mangroves, wetlands, and riparian corridors add habitat. Coastal development, runoff, and overfishing remove it. Ecosystems recover slowly and degrade fast.",
  },
  {
    title: "Public health",
    formula: "health = f(air quality, water quality, heat exposure, service access)",
    note: "Driven by emissions, transport mode share, urban greening, and equity in service access. Health is the most 'averaged' indicator — it rewards a balanced city.",
  },
  {
    title: "Equity",
    formula: "equity = equal distribution of benefits − unequal exposure to flood & heat risk",
    note: "Benefits of your policies are shared; exposure stays concentrated in low-income coastal districts unless transit, health, and housing policies address it.",
  },
  {
    title: "Overall score",
    formula: "score = Σ weight_i × value_i − penalties",
    note: "Weights: climate 0.20, biodiversity 0.15, water 0.15, flood resilience 0.10, health 0.15, economy 0.15, equity 0.10. Penalties apply for collapsed systems (flood resilience or water below 35, fishery collapse).",
  },
];

const VARIABLES = [
  ["renewableElectricity", "Renewable electricity target", "0–100 %", "grid emissions, energy cost"],
  ["publicTransport", "Public transport investment", "0–100 units", "traffic emissions, equity, air quality"],
  ["mangroveRestoration", "Mangrove & tree restoration", "0–30 %", "flood buffering, biodiversity, cooling"],
  ["coastalDevelopment", "Coastal development expansion", "0–30 %", "housing & jobs vs. flood exposure & habitat"],
  ["waterEfficiency", "Water efficiency improvement", "0–60 %", "water stress, energy use"],
  ["wasteRecycling", "Recycling & waste management", "0–60 %", "river & ocean pollution, biodiversity"],
  ["fishingPressure", "Fishing pressure", "0–100 %", "fish stocks, food security, fisher income"],
  ["industrialActivity", "Industrial activity", "0–100 %", "jobs & output vs. emissions & water use"],
];

const LIMITS = [
  "This model is deliberately simplified. Real cities involve thousands of interacting factors — politics, markets, culture, global trade — that are not represented here.",
  "Constants (growth rates, emission factors, thresholds) are illustrative values chosen for teaching, not measured estimates for any real place.",
  "The simulation is deterministic: the same inputs always produce the same outputs. It contains no random forecasting; weather variation is a fixed, published pattern.",
  "Relationships are intentionally linear-ish to make trade-offs legible. Real ecosystems have tipping points that this model smooths over.",
  "The score is a teaching device. No real policy decision should be made from it; treat it as a discussion starter about connected systems.",
];

export default function Transparency() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader backHref="/" />
      <main className="container py-10 flex-1 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="panel-label mb-2">Open science · public documentation</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            How ECO//SIM <span className="text-teal-signal">actually works</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Everything on this page is published deliberately. If you can't see
            how a simulation decides its outcomes, it can't teach you anything
            real. Below are the equations, the variables, the score weights —
            and just as important, the things the model gets wrong.
          </p>

          {/* Equations */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-teal-signal" />
              <h2 className="font-display text-xl font-bold">Published equations</h2>
            </div>
            <div className="space-y-3">
              {EQUATIONS.map((eq, i) => (
                <motion.div
                  key={eq.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="tick-edge bg-card/60 border border-border rounded-md p-4"
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
                    <h3 className="font-display font-semibold text-sm">{eq.title}</h3>
                    <code className="font-data text-xs text-teal-signal bg-secondary/60 border border-border rounded px-2 py-0.5">
                      {eq.formula}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{eq.note}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Variables */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-violet-policy" />
              <h2 className="font-display text-xl font-bold">Variables &amp; units</h2>
            </div>
            <div className="overflow-x-auto border border-border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-data text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/50 border-b border-border">
                    <th className="text-left py-2.5 px-4 font-medium">Control</th>
                    <th className="text-left py-2.5 px-4 font-medium">Description</th>
                    <th className="text-left py-2.5 px-4 font-medium">Range</th>
                    <th className="text-left py-2.5 px-4 font-medium">Main effects</th>
                  </tr>
                </thead>
                <tbody>
                  {VARIABLES.map((v) => (
                    <tr key={v[0]} className="border-b border-border/40 last:border-0">
                      <td className="py-2 px-4 font-data text-[11px]">{v[0]}</td>
                      <td className="py-2 px-4">{v[1]}</td>
                      <td className="py-2 px-4 font-data text-[11px] tabular-nums">{v[2]}</td>
                      <td className="py-2 px-4 text-xs text-muted-foreground">{v[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Score weights */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-amber-warn" />
              <h2 className="font-display text-xl font-bold">Score weights — the same for everyone</h2>
            </div>
            <div className="grid-paper tick-edge border border-border rounded-md p-5 space-y-3">
              {[
                ["Climate pressure", 0.20, "#f87171"],
                ["Biodiversity", 0.15, "#34d399"],
                ["Water security", 0.15, "#2dd4bf"],
                ["Public health", 0.15, "#fbbf24"],
                ["Economic wellbeing", 0.15, "#a78bfa"],
                ["Flood resilience", 0.10, "#60a5fa"],
                ["Equity", 0.10, "#f472b6"],
              ].map(([label, weight, color]) => (
                <div key={label as string}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-data text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
                    <span className="font-data text-xs tabular-nums">{(weight as number * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(weight as number) * 100}%`, backgroundColor: color as string }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Penalties: flood resilience below 35 or water security below 35 in any year
                subtracts 8 points; a fishery collapse subtracts 5.
              </p>
            </div>
          </section>

          {/* Limits */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-5 h-5 text-coral-risk" />
              <h2 className="font-display text-xl font-bold">What this model does <em>not</em> do</h2>
            </div>
            <div className="space-y-3">
              {LIMITS.map((lim, i) => (
                <div key={i} className="border-l-2 border-coral-risk/50 bg-card/60 border border-border rounded-r-md pl-4 py-3">
                  <p className="text-sm leading-relaxed">{lim}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="border border-teal-signal/30 bg-teal-signal/5 rounded-md p-5 mb-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-teal-signal shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold mb-1">Honest-use notice</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ECO//SIM is an educational simulation of a completely fictional city
                  (Nusa Bay) with illustrative constants. Nothing here is a
                  real-world forecast, a planning recommendation, or scientific
                  evidence about any actual coastal city. Use it to start
                  conversations about connected systems — not to make decisions.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-teal-signal text-primary-foreground font-display font-semibold rounded-md px-5 py-2.5 hover:brightness-110 transition-all"
          >
            Back to the simulator <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>
      <footer className="border-t border-border mt-auto">
        <div className="container py-5">
          <span className="font-data text-[11px] text-muted-foreground">
            ECO//SIM · educational simulation · all values fictional and published above
          </span>
        </div>
      </footer>
    </div>
  );
}
