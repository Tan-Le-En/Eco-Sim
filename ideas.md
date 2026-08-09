# ECO//SIM: Coastal City 2050 — Design Brainstorm

## Project brief
A browser-based educational environmental simulation. The user manages the fictional coastal city **Nusa Bay** (1M people) from 2026 to 2050, tuning 8 policy controls and observing consequences across 7 indicators. Core promise: *"Change one thing. See everything change."*
Audience: students 13–22, teachers, competition judges. Must feel serious but approachable, credible and transparent (educational-model labels everywhere).

---

## Three candidate directions

### 1. "Deep Ocean Console"
Dark-navy mission-control aesthetic with teal/glow accents — a dashboard-as-command-center vibe.
Probability: 0.07

### 2. "Field Cartographer"
Warm paper-map aesthetic: cream/parchment background, ink linework, atlas typography — the simulation styled like an old explorer's atlas crossed with a modern science journal.
Probability: 0.04

### 3. "Mangrove Brutalism"
Light utilitarian style: stark grid, oversized monospace data labels, raw concrete grey + mangrove green, Swiss-report functionalism that treats the city like a specimen under study.
Probability: 0.02

---

## CHOSEN: "Deep Ocean Console" (with scientific-journal rigor)

The spec itself suggests deep navy background + teal water + green biodiversity + amber warning + red risk + purple policy. The dark console aesthetic best supports: data-dense simulation UI, glowing indicator reads, "mission briefing" narrative framing, and the serious-but-approachable tone for a student audience. It also makes the city map and animated chart lines visually dramatic.

**Design Movement**: Scientific dashboard / "mission control" vernacular — inspired by climate-monitoring consoles (NASA Earthdata) and editorial data journalism (FT/The Pudding), with a subtle retro-instrument feel (tick marks, LED-style reads, hairline grids).

**Core Principles**:
1. **Data is the hero** — every surface communicates measured values; decoration only exists to serve readability.
2. **Transparent credibility** — every number carries a status label ("educational model", "simplified assumption"); honesty is a visual feature (muted caption chips, dotted borders).
3. **One screen, one tension** — the simulator is a single dense cockpit: map left, controls right, results below; no hidden nav layers.
4. **Consequence is visible** — change one slider and the whole dashboard should visibly respond (indicator arrows, color shifts, chart motion).

**Color Philosophy**: Deep ocean navy (#0a1628 family, oklch ~0.16) as the sea the city lives in; teal for water systems (the city's lifeblood); emerald green for living systems; amber for warnings, coral-red for risk, violet for policy/AI narration. Light panels only as *data cards* floating on the dark sea — white data chips read like instrument panels. Green is never automatically "good": equity/budget warnings keep amber even in positive frames.

**Layout Paradigm**: Asymmetric cockpit — a tall hero landing (split: narrative left / living city illustration right), then the simulator as a three-band console: (1) header strip with year readout + budget, (2) main band = city map (left, ~55%) + policy console (right, ~45% scrollable), (3) results band = 7 indicator gauges + timeline chart + causal feed. Not a centered marketing page; a working instrument.

**Signature Elements**:
1. **Hairline grid + tick marks** — every card edge carries subtle 1px gridlines and millimeter tick ornaments, like chart paper.
2. **Status chips** — small dotted-outline chips ("EDUCATIONAL MODEL · SIMPLIFIED ASSUMPTION") on every data panel.
3. **Pulse-line indicator strips** — the 7 indicators render as live sparkline strips (like an ECG), not just numbers.

**Interaction Philosophy**: Sliders feel like instrument dials — instant feedback, value chips update in real time, predicted-impact arrows (+/−) appear live next to affected indicators. Run triggers an animated year-counter that walks 2026→2050 with indicators tweening and event warnings surfacing as alert cards. Speed controls: 1-yr step / 5-yr step / run-to-2050.

**Animation**: Framer Motion for panel entrances (staggered 40–60ms, translateY 12px, ease-out cubic-bezier(0.23,1,0.32,1)). Year playback: numbers count up/down per year with spring tweens (≤200ms). Sliders: 150ms value-chip pop. Indicator cards flash a 300ms tint when they change direction. Respect prefers-reduced-motion.

**Typography System**:
- Display/headlines: **Space Grotesk** (700/600) — technical, slightly characterful.
- Data/labels: **IBM Plex Mono** — all readouts, slider values, status chips, tick numerals.
- Body: **IBM Plex Sans** (400/500).
Hierarchy: mono uppercase micro-labels (11px, tracking 0.12em) above every panel; display for mission titles; sans for explanations.

**Brand Essence**: "ECO//SIM — the decision lab for the climate generation." For students who want to *see* systems thinking. Adjectives: rigorous, vivid, honest.

**Brand Voice**: Mission-briefing imperative + plain-language honesty. No marketing fluff.
- Example headline: "Nusa Bay has 25 years. Every decision you make echoes."
- Example CTA: "Take command — start the 2026 briefing"
- Status microcopy: "These numbers are an educational model, not a forecast."

**Wordmark & Logo**: "ECO//SIM" set in Space Grotesk 700 with the double-slash rendered in teal as the brand mark; logo glyph = a stylized wave-over-grid square (generated, transparent PNG).

**Signature Brand Color**: **Teal signal #14b8a6-family (oklch 0.72 0.13 190)** — the "life-line teal" that appears in the wordmark slash, active indicators, and the pulsing year readout.

## Page map
1. `/` Landing — hero, one-sentence promise, start challenge, how-it-works, transparency link.
2. `/briefing` Mission briefing — city profile, challenges, budget, success conditions.
3. `/simulator` The cockpit — map + 8 policy sliders + 7 live indicators + run.
4. `/results` Scorecard, line chart, biggest success, biggest unintended consequence, deterministic causal explanation, retry, compare scenarios.
5. `/transparency` Model assumptions & equations (open-science page).

## Simulation model (deterministic, client-side, transparent)
- 8 controls: renewable electricity %, public transport investment, mangrove/tree restoration %, coastal development %, water efficiency %, waste/recycling %, fishing pressure %, industrial activity %.
- 7 indicators: climate pressure, biodiversity, water security, flood resilience, public health, economic wellbeing, equity.
- Yearly simulation 2026–2050 following the spec's educational equations (population growth, emissions, transport, water, biodiversity, flood, health, equity, economy), plus budget accounting, rainfall variability, and seeded events.
- Baseline + up to 3 saved scenarios for comparison; deterministic causal-link engine (rule-based explanations).
## Style Decisions
- Every major data panel must contain either a measured value, target/baseline reference, causal annotation, or plotted trace; no large console surface should exist as decorative grid alone.
- The seven indicators are the product's signature visual system: each appears as a city "vital sign" with a consistent colored pulse/sparkline motif (ECG ticks + pulsing endpoint dot) across simulator, results, and summaries.
- Nusa Bay imagery is always treated as evidence under study — framed with corner brackets, grid outlines, and specimen/coordinate annotations — rather than standalone cinematic scenery.
- The trajectory chart always shows a 2026 baseline reference line so every playback state can be read against the starting point.
