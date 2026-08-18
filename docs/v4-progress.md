# v4 progress state (phase 20-22)

## Done (phase 20 — performance)
- CityMap.tsx rewritten: single SVG with 400 <rect> + CSS fill transitions; pointer-based hover overlay (6% cell outline); removed 400 motion buttons + Tooltip. Header shows hover cell info inline (no tooltip).
- Simulator.tsx: RAF playback loop (110ms/frame fast, 420/step ms normal), steps = Math.floor(elapsed/interval) so frames never queue; fullResult = useMemo(runSimulation(controls)) single precompute; chartData sampled to max 14 points; removed AnimatePresence + motion.div (used gridTemplateRows collapse for register stories; btn-press remains).
- IndicatorStrip.tsx: removed framer-motion imports entirely; CSS grid-templateRows expand + opacity transition.

## Remaining work
- Phase 21 spacing fixes: Results verdict caption (currently caption sits under white strip below photo — check figure structure in Results.tsx), "CITY IS SAFE & HEALT..." truncation (shorten label or increase width), Transparency score-weight bars overlapping label text (check weights section CSS), Briefing bottom whitespace (add third photo plate or datum expanded), Simulator map header ELEV label overflow check (fixed? header now inline flex; fine).
- Phase 22 photos + story mode:
  - Photo paths in docs/v4-photos.md (new: real-clan-jetty_cc25bfaa, real-jetty-town_ecd78f2c, real-monsoon-sea_1fb07f26, real-storm-beach_b8463a69, real-langkawi-boats_1bd7b85d, real-mangrove-roots_1515d591, real-mangrove-forest_9da87f9c, real-river-village_b342ee6a; all /storage/...)
  - Add photo strip to Home closing ("the bay") with langkawi-boats; Briefing add clan-jetty or storm-beach plate; Simulator TownMood or goal-zone photos small plates; Results add montage photos per goal; Transparency add methodology photos.
  - Story mode: new route /story with Story page (create client/src/pages/Story.tsx, register in App.tsx routes, link from Home + SiteHeader nav?). 4 chapters with full-bleed photos, serif kid-voice narration (Pak Ali), a simple preset control per chapter, ends with "Enter the town" -> navigate /simulator with controls applied via SimContext (setControl).
- Verify: screenshots all pages, tsc, console logs, playback at 60fps via browser.
- Checkpoint, deliver with 2-3 suggestions.

## Design tokens (v3 index.css, still valid)
- bg: paper cream oklch(0.965 0.012 84.4), ink text oklch(0.24 0.02 80), vermilion accent oklch(0.55 0.16 35), emerald-700 oklch(0.5 0.11 155), classes: field-label, font-display (Newsreader), font-data (Public Sans), btn-press, status-chip, photo-plate (figure w/ caption overlay bottom), hairline borders.
- Apple/Google/Meta/Nielsen guideline notes in docs/v4-guidelines.md; audit in docs/v4-audit.md.
