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
    note: "Driven by emissions, transport mode share, urban greening, and equity in service access. Health is the most 'averaged' indicator: it rewards a balanced city.",
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
      <SiteHeader backHref="/" />
      <main className="container py-10 flex-1 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="field-label mb-2">For teachers, students & professors</div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            How this game <span className="text-vermilion">actually works</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            A child can play ECO//SIM without reading this page. But if you want
            to see the machinery: the equations, the variables, the score
            weights, everything is published here. If you cannot see how a
            simulation decides its outcomes, it can't teach you anything real.
          </p>

          {/* Equations */}
          <section className="mb-12">
            <div className="field-label mb-3">01 · Published equations</div>
            <div className="space-y-3">
              {EQUATIONS.map((eq, i) => (
                <motion.div
                  key={eq.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="soft-card p-4"
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
                    <h3 className="font-display font-medium text-sm">{eq.title}</h3>
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
            <div className="field-label mb-3">02 · Variables &amp; units</div>
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
            <div className="field-label mb-3">03 · Score weights, the same for everyone</div>
            <div className="soft-card p-5 space-y-3">
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
                  <div className="h-1.5 bg-secondary">
                    <div className="h-full" style={{ width: `${(weight as number) * 100}%`, backgroundColor: color as string }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Penalties: flood resilience below 35 or water security below 35 in any year
                subtracts 8 points; a fishery collapse subtracts 5.
              </p>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12">
            <div className="field-label mb-3">05 · Where the real science lives</div>
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
                    <h3 className="font-display font-medium text-sm">{s.where}</h3>
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
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Limits */}
          <section className="mb-12">
            <div className="field-label mb-3">04 · What this model does <em>not</em> do</div>
            <div className="space-y-3">
              {LIMITS.map((lim, i) => (
                <div key={i} className="border border-border border-l-2 border-l-vermilion bg-card pl-4 py-2.5">
                  <p className="text-[12px] leading-relaxed">{lim}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="border border-vermilion/40 bg-card p-5 mb-4">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-vermilion shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold mb-1">Honest-use notice</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ECO//SIM is an educational simulation of a completely fictional city
                  (Nusa Bay) with illustrative constants. Nothing here is a
                  real-world forecast, a planning recommendation, or scientific
                  evidence about any actual coastal city. Use it to start
                  conversations about connected systems, not to make decisions.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/simulator"
            className="btn-press inline-flex items-center gap-2 bg-vermilion text-primary-foreground font-data text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:brightness-105 transition-all"
          >
            Back to the simulator <ArrowRight className="w-3.5 h-3.5" />
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
