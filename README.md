# ECO//SIM — Teluk Nusa Coastal City 2050

> **An interactive field study of coastal resilience (2026–2050).**
> _"Change one thing, watch everything change. Simple enough for a child; rigorous enough for a climate researcher."_

---

## What this is

**ECO//SIM** is an educational web simulation of **Teluk Nusa**, a fictional coastal town on the Strait of Malacca. You govern it for 25 years (2026–2050) with **eight policy dials**, a **100-point budget that must last the whole quarter-century**, and seven registers to keep standing: climate pressure, biodiversity, water security, flood resilience, public health, economic wellbeing, and equity.

It is a teaching model, not a forecast. Every constant is illustrative; every equation is published on the in-app Transparency page. The photographs are real Malaysian coasts; the town is invented.

Live: **https://ecosim2050.vercel.app**

---

## Pages

| Route | What it does |
|-------|--------------|
| `/` | Landing — three plans computed live by the real engine, plus a numbered field triptych |
| `/simulator` | The 25-year cockpit: year reel, eight dials, budget, survey map, indicators, trajectory |
| `/results` | 2050 score, worked/failed account, causal chain, saved-plan comparison |
| `/story` | "What happened to Teluk Nusa" — personalised narrative from your actual run |
| `/transparency` | Every equation, published weights, model limits, and the science behind them |
| `/faq` | Frequently asked questions |
| `/privacy` / `/terms` | Legal |

---

## Key features

- **25-year simulator (`/simulator`)** — year reel, deterministic engine, fixed weather pattern (drought years 2034 & 2043, flood-year rainfall 2037 & 2047), 20×20 survey map, trajectory chart.
- **Eight policy dials** (0–100 % or capped sub-ranges):
  1. Renewable electricity target — grid emissions and energy cost.
  2. Public transport investment — emissions, air quality, equity.
  3. Mangrove & tree restoration — flood buffering, biodiversity, cooling.
  4. Coastal development expansion — housing & jobs vs. flood exposure and habitat loss.
  5. Water efficiency — water stress and flood resilience.
  6. Recycling & waste management — river and ocean pollution.
  7. Fishing pressure — fish stocks and fisher income.
  8. Industrial activity — jobs & treasury revenue vs. emissions, health, and water use.
- **Budget with real teeth** — 100 points in total for 2026–2050; industry pays in 1–6 points a year; every policy spends. When it runs out, maintenance frays.
- **Results report (`/results`)** — 2050 score, worked/failed account, causal chain, technical appendix, and up to four saved plans compared side by side (stored locally on the device).
- **Story mode (`/story`)** — five plain-language chapters before play, or "what happened to Teluk Nusa" built from your actual run after it.
- **Full transparency (`/transparency`)** — every equation, published weights, model limits, and the real published science each relationship loosely follows.
- **Design system** — documentary-editorial layout, light "paper" and dark "archive" modes, Newsreader / Public Sans / IBM Plex Mono typography, zero border radius, print stylesheet.
- **Accessibility** — skip-to-content link on every page, labelled landmarks, `aria-expanded` disclosures, `prefers-reduced-motion` honored throughout, keyboard year-stepping (`←` `→` space) in the simulator.

---

## How the score works (engine truth)

Seven registers are judged once, in 2050, by fixed weights:

| Register           | Weight | Direction        |
| ------------------ | ------ | ---------------- |
| Climate pressure   | 0.20   | lower is better  |
| Biodiversity       | 0.15   | higher is better |
| Water security     | 0.15   | higher is better |
| Flood resilience   | 0.15   | higher is better |
| Public health      | 0.15   | higher is better |
| Economic wellbeing | 0.10   | higher is better |
| Equity             | 0.10   | higher is better |

Final-year penalties only: biodiversity below 30 −10 points, water security below 25 −8, equity below 35 −6. Mission targets by 2050: climate pressure ≤ 45, biodiversity ≥ 70, water ≥ 60, flood resilience ≥ 65, equity ≥ 60. Trade-offs mean scores cap somewhere below 100 — that is the lesson, not a bug.

---

## Technology stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Routing & state**: Wouter, React Context (no store library)
- **Animation & icons**: Framer Motion (reduced-motion aware), Lucide React
- **Charts**: Recharts
- **UI primitives**: Radix UI + Shadcn-style components (only the eight in use)
- **Build**: Vite 7 (single-page static build → `dist/public`)
- **Deployment**: Vercel — static site + one serverless function (`api/storage.js`) that serves `/storage/:key` images from a presigned-backend when configured

There is no application server; the production artifact is a static bundle plus the one storage function.

### Color-role tokens (index.css v4)

| Token                       | Role                              | Where it is allowed                                                |
| --------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `--vermilion`               | brand slash, alarms, primary CTA  | primary buttons, critical data                                     |
| `--interactive`             | teal (hue 205) — interaction only | links, focus rings, sliders, checkboxes, scrubber — **never data** |
| `--ok` / `--warn` / `--bad` | data verdicts                     | indicator deltas, event severity, target status                    |
| `--muted-foreground`        | secondary text                    | labels, captions ≥ 4.5:1 contrast                                  |

Rule of thumb: interactive teal marks _things you can act on_; ok/warn/bad mark _what the town did_. Mixing the two is a bug.

---

## Getting started

### Prerequisites

- **Node.js** 20.11 or newer
- **pnpm** 10 (or npm — the lockfile ships for pnpm; npm works fine)

### Install & run

```bash
git clone https://github.com/Tan-Le-En/Eco-Sim.git
cd Eco-Sim
pnpm install

# development server → http://localhost:3000
pnpm dev

# type-check (strict, no emit)
pnpm check

# production build → dist/public
pnpm build

# preview the production build
pnpm preview
```

### Project structure

```
Eco-Sim/
├── api/
│   └── storage.js              # Vercel function: /storage/:key → presigned URL
├── client/
│   ├── index.html              # Entry HTML, pre-paint theme script, static social tags
│   ├── public/                 # robots.txt, sitemap.xml, committed storage images
│   └── src/
│       ├── components/         # CityMap, TimelineChart, IndicatorStrip, header/search, …
│       ├── contexts/           # SimContext (state + persistence), ThemeContext (light/dark)
│       ├── hooks/              # useComposition (IME guard)
│       ├── lib/
│       │   ├── sim/            # engine.ts (the model), cityMap.ts, types.ts
│       │   ├── utm.ts          # local-only first-touch attribution record
│       │   └── utils.ts
│       ├── pages/              # Home, Prologue, Simulator, Results, Story, Transparency, FAQ, legal
│       ├── App.tsx             # Router, page transitions, scroll restoration
│       └── index.css           # Design tokens and editorial components
├── vercel.json                 # SPA rewrites + /storage route, build = npm run build
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Honesty notes

- Teluk Nusa is fictional. No number here is measured data for any real place.
- The simulation is deterministic: same dials in, same 25 years out.
- The site collects nothing. Plans, theme, and preferences live in your browser's local storage; the optional-analytics banner stores your answer and nothing else today.
- The score is a discussion starter, not policy advice.

## License

[MIT](LICENSE)
