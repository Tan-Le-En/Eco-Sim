# V3 redesign state (Editorial Field Study)

## Done
- Research: docs/research-antislop.md (Alan West dev.to 4 fixes; UI/UX Pro Max guidelines)
- Real photos collected + uploaded (10 files, see ideas.md inventory):
  - hero: /storage/real-kampung-boats_57e6e432.jpg
  - /storage/real-kelantan-jetty_3efeb546.jpg (briefing plate)
  - /storage/real-penang-jetty_a82ca28d.jpg (results/landing)
  - /storage/real-mangrove-aerial_deefef09.jpg (nature)
  - /storage/real-mangrove-river_4e88bc33.jpg (water)
  - /storage/real-fishermen-nets_6fb1be29.jpg (controls)
  - /storage/real-fishermen-dawn_e6a0536d.jpg (results mood)
  - /storage/real-beach-sunset_7c0d4a16.jpg (CTA/footer)
  - /storage/real-kuala-kedah_6538ea79.jpg, /storage/real-kuala-kedah2_6ae7337f.jpg (backup)
- index.css rewritten (v3): paper #F4F1EA-ish, ink, vermilion accent oklch(0.55 0.16 35), deepsea oklch(0.42 0.06 195), zero radius, Newsreader/Public Sans/IBM Plex Mono, paper-grain, field-label, photo-plate, plate-caption, status-chip classes.
- ideas.md v3 written with full direction.

## Still to do
- index.html: swap fonts to Newsreader + Public Sans (keep IBM Plex Mono), update title/meta.
- App.tsx: keep light defaultTheme.
- Remove references to old AI images in code: /storage/kampung-hero_6340e8df.png, /storage/kampung-bg_d67dbfd0.png, /storage/pakali_3bdfa8db.png, /storage/city-happy_12950284.png, /storage/city-sad_01d243a3.png, /storage/ecosim-logo_8c68d962.png. Replace logo with typographic ECO//SIM (no icon).
- Rewrite pages (single-screen):
  - Home.tsx: full-viewport hero (real photo, asymmetric: headline left-offset, photo right-bleed), field labels 01/02, photo plates, minimal bands.
  - Briefing.tsx: compact one-screen report.
  - Simulator.tsx: one viewport grid — year/budget + playback bar top; left map; right controls compact list; indicators as horizontal readout row; chart minimal. REMOVE vertical scrolling (h-screen overflow hidden, inner scroll only inside control panel if needed).
  - Results.tsx: one-screen scorecard + photo plate + causal explanation.
  - Transparency.tsx: editorial layout (already okay, restyle only).
  - SiteHeader.tsx: typographic wordmark, thin borders.
  - Delete WaveDivider.tsx usage, TownMood.tsx images (mood portrait via photo plates or plain text verdict).
  - IndicatorStrip: flat labels, mono, hairlines; sparklines optional minimal.
  - ControlPanel: flat compact rows with field labels, hairline rules; keep slider UX.
  - TimelineChart: flat, hairline grid, vermilion/deepsea traces.
  - CityMap: keep grid but flat square cells (remove rounded-[30%], wave header), keep BM labels.
- Keep engine (lib/sim) untouched.
- Copy: documentary voice "Twenty-five years. One million people. Seven things to protect." etc.

## Old asset paths to remove
ecosim-hero-city.png, ecosim-landing-bg.png (from v1, likely unused now), kampung-hero_6340e8df.png, kampung-bg_d67dbfd0.png, pakali_3bdfa8db.png, city-happy_12950284.png, city-sad_01d243a3.png, ecosim-logo_8c68d962.png.

## Checkpoint policy
One checkpoint at the end. Current stable checkpoint: 4d612a2c.

## Progress update (phase 16)
- index.html: fonts Newsreader/Public Sans/IBM Plex Mono; SVG favicon inline; title updated.
- index.css: v3 theme complete (paper/ink/vermilion/deepsea, zero radius, field-label/plate-caption/photo-plate/status-chip/paper-grain/reveal-up/btn-press).
- Home.tsx: rewritten v3 (hero grid: left typographic + right bleeding photo HERO=real-kampung-boats; triptych FIELD plates with JETTY/MANGROVE/NETS photos; CTA band).
- Briefing.tsx: rewritten v3 single-screen (mission left, photo+datum right, registers numbered, hairline challenges). TS error from tuple destructuring fixed by explicit entry[0]/entry[1].
- Still to rewrite: Simulator.tsx (single viewport: top bar year+budget+play, grid [1fr 380px]; uses SiteHeader, CityMap, ControlPanel, IndicatorStrip, TownMood, TimelineChart, save Dialog; images HAPPY/SAD AI images must be replaced); Results.tsx (story-first, expert deep section; mood photos AI); SiteHeader.tsx (wordmark + nav, backHref prop; teal refs); ControlPanel.tsx (rounded-full, teal refs; kid-friendly labels exist); IndicatorStrip.tsx (grid 7 cards w/ sparklines, open story; round dot, meter bars); TimelineChart.tsx; CityMap.tsx (rounded cells, wave header, BM labels); TownMood.tsx (mood images happy/sad AI, traffic lights goals); Transparency.tsx (restyle only).
- Component API notes: IndicatorStrip props {indicators, baseline, history, compact?}; TownMood props {indicators, year}; TimelineChart props {data: ChartRow[]}; CityMap props {controls, indicators, year}; ControlPanel props {controls, onChange, onReset}. useSim hook: {controls, setControl, resetControls, run, saveScenario, currentResult, scenarios}.
- Engine types: INDICATOR_KEYS, INDICATOR_META (label, color, meaning, higherIsBetter), KID_INDICATORS (kidName, kidStory, happy, sad, bm), KID_GOALS (id, title, bm, keys[]), MISSION_TARGETS, BASELINE, runSimulation(controls) returns {years[{year, indicators, budgetRemaining}], baselineYear, score, biggestSuccess, biggestFailure, scoreBreakdown, explanations[{type, causes}], scenarioCompare}.
- AI images to remove: /storage/city-happy_12950284.png, /storage/city-sad_01d243a3.png, /storage/pakali_3bdfa8db.png, /storage/kampung-hero_6340e8df.png, /storage/kampung-bg_d67dbfd0.png, /storage/ecosim-logo_8c68d962.png.
- Old AI asset URLs still referenced in Home/SiteHeader/CityMap/TownMood need grep search to find all.

## Component rewrite progress (phase 16, continued)
DONE v3: index.html, index.css, Home.tsx, Briefing.tsx, Simulator.tsx, SiteHeader.tsx, TownMood.tsx (mood band flat, no AI images), CityMap.tsx (flat tiles), ControlPanel.tsx (ledger rows), IndicatorStrip.tsx (hairline register), TimelineChart.tsx (mono ticks, flat).
TODO: Results.tsx (story-first, replace HAPPY/SAD AI images with real photos FINISH_PHOTO=real-beach-sunset_7c0d4a16.jpg, DAWN_PHOTO=real-fishermen-dawn_e6a0536d.jpg, flat editorial style: verdict plate w/ photo + mono numbers + flat goal register; causal chain section; expert collapse with breakdown bars; plan comparison). Then Transparency.tsx restyle (flat editorial, keep equations + teacher framing). Then WaveDivider.tsx can be deleted (no longer used after Home rewrite? verify grep). Verify: grep "panel-label\|soft-card\|teal-signal" across client/src — should be zero. Check index.css has all tokens used: vermilion, emerald-700?, status-chip, field-label, photo-plate, plate-caption, paper-grain, btn-press, font-data/font-display classes. Note: used text-emerald-700 in IndicatorStrip/CityMap — verify token exists in index.css, else change to deepsea or add token.
Simulator v3 details: instrument bar (year mono, budget RM, play/pause/to2050/speed 1y/5y/Fast), main grid lg:[1fr_360px], TownMood→CityMap→IndicatorStrip→TimelineChart→finish card (photo plate FINISH_PHOTO if score>=58 else DAWN_PHOTO, worked/failed columns). CausalChain component unchanged at client/src/components/CausalChain.tsx.
Results.tsx current structure to preserve: fallback ref run(), verdict (happy via goalsMet>=2), share copy, traffic-light goals, success/failure cards, CausalChain links+events eventsToShow=6, expert collapse (breakdown bars w/ weights, indicator table baseline→2050, scenario comparison).
After pages: screenshot verify all pages, typecheck, checkpoint (one only), deliver.
