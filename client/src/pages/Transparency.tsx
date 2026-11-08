/**
 * ECO//SIM — Scientific transparency page
 * Style: documentation dossier: published equations, variable tables, units,
 * score weights, and explicit model limits. Every number here mirrors
 * engine.ts — update both together.
 */
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import SiteFooter from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { INDICATOR_META, Indicators } from "@/lib/sim/types";

const EQUATIONS = [
  {
    title: "Population growth",
    formula: "P(t+1) = P(t) × (1 + r),  r = 0.012",
    note: "Fixed growth plus a small migration bonus when industry is busy.",
  },
  {
    title: "Renewable share of the grid",
    formula: "R(t) = R₀ + (target − R₀) × min(1, t / 10)",
    note: "10-year rollout toward your target, held back by heavy industry.",
  },
  {
    title: "Emissions accounting",
    formula: "E = E_ele + E_transport + E_industry + E_waste",
    note: "Four sectors summed, vs an ~8 Mt CO2e baseline in 2026.",
  },
  {
    title: "Water balance",
    formula: "security = 100 × supply ÷ demand, then × rainfall factor",
    note: "Demand = residents + industry (water efficiency trims both; efficiency also expands supply). Supply grows slowly. Drought years: 2034 and 2043.",
  },
  {
    title: "Flood resilience",
    formula: "resilience = 70 − exposureCoast − seaLevelDrift + mangroveShelter + waterEfficiencyBonus",
    note: "Development opens the coastline. Mangroves and wetlands shelter it. Early infrastructure only builds after year five.",
  },
  {
    title: "Biodiversity",
    formula: "B(t) = 62 + habitatGain × 12 − habitatLoss × 12 − pollutionLoss × 12 − drain × t",
    note: "Habitat from mangroves; loss from coastal building and overfishing; pollution from waste. Recovers slowly, degrades fast.",
  },
  {
    title: "Public health",
    formula: "health = 72 − heatRisk − pollutionRisk + transitBonus",
    note: "Heat rises with urbanisation, falls with tree cover and transit. Pollution follows industry, fossil power, and waste.",
  },
  {
    title: "Equity",
    formula: "equity = 55 + benefitsKampung − burdensKampung",
    note: "Benefits: transit, flood protection, health. Burdens: pricier renewables during rollout, coastal flood exposure, industrial pollution on the same shore.",
  },
  {
    title: "Economic wellbeing",
    formula: "wellbeing = 61 + industrialOutput + transitBenefit − infrastructureCost − disasterDamage − overfishingCollapse",
    note: "Industry pays the town; everything else costs it. A collapsed fishery (pressure above 85 from year 2038) drains it.",
  },
  {
    title: "Treasury",
    formula: "balance(t+1) = balance(t) + revenue − spend,  revenue = 1 + industry% × 5",
    note: "You start with 100 budget points in 2026 — the pot for all 25 years, not per year. Revenue only walks in when factories work: 1–6 pts/yr.",
  },
  {
    title: "Overall score",
    formula: "score = Σ weight_i × value_i(2050) − penalties",
    note: "Climate pressure counts inverted (100 − value). Weights: climate 0.20, biodiversity 0.15, water 0.15, flood 0.15, health 0.15, economy 0.10, equity 0.10.",
  },
];

const VARIABLES = [
  ["renewableElectricity", "Renewable electricity target", "0–100 %", "grid emissions, energy cost"],
  ["publicTransport", "Public transport investment", "0–100 units", "traffic emissions, equity, air quality"],
  ["mangroveRestoration", "Mangrove & tree restoration", "0–30 %", "flood buffering, biodiversity, cooling"],
  ["coastalDevelopment", "Coastal development expansion", "0–30 %", "housing & jobs vs. flood exposure & habitat"],
  ["waterEfficiency", "Water efficiency improvement", "0–60 %", "water stress, flood resilience"],
  ["wasteRecycling", "Recycling & waste management", "0–60 %", "river & ocean pollution, biodiversity"],
  ["fishingPressure", "Fishing pressure", "0–100 %", "fish stocks, biodiversity, fisher income"],
  ["industrialActivity", "Industrial activity", "0–100 %", "jobs & revenue vs. emissions & water use"],
];

/* Engine truth (engine.ts scoreResult): C 0.20, B 0.15, W 0.15, F 0.15,
   H 0.15, E 0.10, Q 0.10 — sums to 1.00. */
const WEIGHTS: [keyof Indicators, number][] = [
  ["climatePressure", 0.20],
  ["biodiversity", 0.15],
  ["waterSecurity", 0.15],
  ["floodResilience", 0.15],
  ["publicHealth", 0.15],
  ["economicWellbeing", 0.10],
  ["equity", 0.10],
];

/* Real-world grounding: the numbers in this educational model are loosely
 * calibrated against published science. These sources are listed so teachers
 * can go deeper. The model's constants are still illustrative, not measured. */
const SOURCES = [
  {
    name: "IPCC AR6, Working Group I, Ch. 9: Ocean, Cryosphere and Sea Level Change",
    where: "Sea level rise",
    detail:
      "The model drifts the baseline sea level upward over 2026–2050, loosely against published global-mean projections of roughly 0.3 to 0.6 m by 2100 under mid-range emissions, plus local effects in Southeast Asia.",
    url: "https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9/",
  },
  {
    name: "IPCC AR6, Working Group II: Southeast Asia",
    where: "Coastal flooding and monsoon rainfall",
    detail:
      "Coastal flooding risk and heavier rainfall in this model follow the direction of AR6 findings for Southeast Asia, not specific national forecasts.",
    url: "https://www.ipcc.ch/report/ar6/wg2/",
  },
  {
    name: "Department of Environment Malaysia (DOE), National Inventory Report",
    where: "Emissions accounting",
    detail:
      "The sector breakdown of emissions (power, transport, industry, waste) mirrors the structure of national greenhouse gas inventories, with simplified factors for teaching.",
    url: "https://www.doe.gov.my/",
  },
  {
    name: "Forest Research Institute Malaysia (FRIM) and MARDI mangrove studies",
    where: "Mangroves as flood and habitat buffers",
    detail:
      "The link between mangrove cover, wave attenuation, fish nursery habitat, and flood resilience follows the direction of published Malaysian mangrove research.",
    url: "https://www.frim.gov.my/",
  },
  {
    name: "FAO, The State of World Fisheries and Aquaculture",
    where: "Fishing pressure and stock recovery",
    detail:
      "The rule that overfishing today reduces tomorrow's catch, and that reduced pressure allows recovery, is the basic dynamics of fisheries science.",
    url: "https://www.fao.org/fishery/sofia",
  },
];

const LIMITS = [
  "This model is deliberately simplified. Real cities involve thousands of interacting factors (politics, markets, culture, global trade) that are not represented here.",
  "Constants (growth rates, emission factors, thresholds) are illustrative values chosen for teaching, not measured estimates for any real place.",
  "The simulation is deterministic: the same inputs always produce the same outputs. It contains no random forecasting; weather variation is a fixed, published pattern.",
  "Relationships are intentionally linear-ish to make trade-offs legible. Real ecosystems have tipping points that this model smooths over.",
  "The score is a teaching device. No real policy decision should be made from it; treat it as a discussion starter about connected systems.",
];

export default function Transparency() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta
        title="ECO//SIM — Transparency · every equation, published"
        description="The full mathematics: equations, weights, assumptions, limits, and the real science the model is calibrated to."
      />
      <SiteHeader backHref="/" />
      <main id="main" tabIndex={-1} className="container py-10 flex-1 max-w-5xl outline-none">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-2">For teachers, students & professors</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            How this game <span className="text-vermilion">actually works</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Play without this page. Read this page to see the machinery.
          </p>

          {/* Equations */}
          <section className="mb-12">
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-3">01 · Published equations</div>
            <div className="space-y-3">
              {EQUATIONS.map((eq, i) => (
                <motion.div
                  key={eq.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.04, 0.16) }}
                  className="soft-card p-4"
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
                    <h2 className="font-display font-medium text-sm">{eq.title}</h2>
                    <code className="font-data text-[11px] text-vermilion bg-secondary px-2 py-0.5 border border-border">
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
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-3">02 · Variables &amp; units</div>
            <div className="overflow-x-auto border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-data text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
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
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-3">03 · Score weights, the same for everyone</div>
            <div className="soft-card p-5 space-y-3">
              {WEIGHTS.map(([key, weight]) => {
                const meta = INDICATOR_META[key];
                return (
                  <div key={key}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-data text-[11px] uppercase tracking-wider text-muted-foreground">{meta.label}</span>
                      <span className="font-data text-xs tabular-nums">{(weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary">
                      <div className="h-full" style={{ width: `${weight * 100}%`, backgroundColor: meta.color }} />
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground pt-2">
                Judged once, in the final year (2050): biodiversity below 30 subtracts 10
                points; water security below 25 subtracts 8; equity below 35 subtracts 6.
                These are the only penalties.
              </p>
            </div>
          </section>

          {/* Limits */}
          <section className="mb-12">
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-3">04 · What this model does not do</div>
            <div className="space-y-3">
              {LIMITS.map((lim, i) => (
                <div key={i} className="border border-border border-l-2 border-l-vermilion bg-card pl-4 py-2.5">
                  <p className="text-[12px] leading-relaxed">{lim}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12">
            <div className="font-data text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-3">05 · Where the real science lives</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              Teluk Nusa is fictional and every constant above is illustrative.
              But the direction of each relationship is borrowed from real
              research. These are the published sources the model loosely
              follows, so you can read the original.
            </p>
            <div className="space-y-2">
              {SOURCES.map((s, i) => (
                <div key={i} className="soft-card p-4">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
                    <h2 className="font-display font-medium text-sm">{s.where}</h2>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-data text-[10px] tracking-[0.1em] uppercase text-vermilion hover:underline"
                    >
                      Read the source
                    </a>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug mb-1.5">{s.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="border border-vermilion/40 bg-card p-5 mb-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-vermilion shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display font-semibold mb-1">Honest-use notice</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ECO//SIM is an educational simulation of a completely fictional city
                  (Teluk Nusa) with illustrative constants. Nothing here is a
                  real-world forecast, a planning recommendation, or scientific
                  evidence about any actual coastal city. Use it to start
                  conversations about connected systems, not to make decisions.
                </p>
              </div>
            </div>
          </div>

          <Link href="/simulator" className="btn btn-primary">
            Back to the simulator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  );
}
