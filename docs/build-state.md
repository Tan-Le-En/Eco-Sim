# ECO//SIM build state (internal notes)

## Key facts
- Spec file: /home/ubuntu/upload/pasted_content.txt (full ECO//SIM MVP spec; also read fully).
- Project: /home/ubuntu/ecosim-coastal-city-2050 (web-static, React19+Vite+Tailwind4+shadcn).
- Dev server preview URL: https://3000-i2o71mkqbcvwhh7m9nzx5-1b799f2e.sg1.Storage.computer
- Generated image URLs (use as-is):
  - Hero city: /storage/ecosim-hero-city_bff58f05.png
  - Landing bg: /storage/ecosim-landing-bg_c20bb61d.png
  - Logo (transparent): /storage/ecosim-logo_8c68d962.png

## Files built so far
- client/src/lib/sim/types.ts — Controls (8), Indicators (7), BASELINE, MISSION_TARGETS, SavedScenario, SimulationResult
- client/src/lib/sim/cityMap.ts — buildCityMap() 20x20, CELL_COLORS, CELL_LABELS
- client/src/lib/sim/engine.ts — runSimulation(), computeCausalLinks(), explainOutcome(), scoreResult() — calibrated, deterministic (validated in docs/engine-validation.md)
- client/src/contexts/SimContext.tsx — SimProvider (localStorage key ecosim:v1), run/save/deleteScenario
- client/src/components/SiteHeader.tsx, CityMap.tsx, ControlPanel.tsx (SLIDER_DEFS), IndicatorStrip.tsx, TimelineChart.tsx, CausalChain.tsx
- client/src/pages/Home.tsx, Briefing.tsx, Simulator.tsx
- client/src/App.tsx routes: /, /briefing, /simulator, /results, /transparency
- client/src/index.css — Deep Ocean Console tokens (teal signal, emerald, amber, coral, violet; panel-label, grid-paper, status-chip, tick-edge, btn-press)

## Remaining TODO
1. pages/Results.tsx — scorecard (transparent weights), line chart of scenario comparison, biggest success/failure, causal chain, retry + compare with saved scenarios (up to 4), share button (copy URL/result text)
2. pages/Transparency.tsx — open assumptions: equations, variables, units, limitations, disclaimer
3. Wire SimProvider in App.tsx (import + wrap Router)
4. Screenshot pass + style review, checkpoint, deliver

## Engine calibration results (docs/engine-validation.md)
Baseline 2026: emissions 6.65 Mt, CP 44.7, BD 58.4, WS 100(clamp), FR 75, PH 47.2, EW 71.5, EQ 57.5, score 59.8 default.
Green strategy → 67.9; Heavy industry → 50.0. All spec trade-off directions verified.

## Design: Deep Ocean Console (see ideas.md)
Fonts: Space Grotesk (display), IBM Plex Mono (data), IBM Plex Sans (body). Dark navy oklch(0.17 0.035 250) bg. Teal signal accent.
