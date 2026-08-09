# Rework state — Kampung Coast v2 (simple-but-hard + Malaysian culture)

## Asset URLs (generated, use exactly as-is)
- Hero village scene: /manus-storage/kampung-hero_6340e8df.png (4:3)
- Light pattern bg: /manus-storage/kampung-bg_d67dbfd0.png (16:9)
- Happy town: /manus-storage/city-happy_12950284.png (16:9)
- Sad/storm town: /manus-storage/city-sad_01d243a3.png (16:9)
- Pak Ali narrator: /manus-storage/pakali_3bdfa8db.png (1:1)
- Old logo (still used in nav/footer): /manus-storage/ecosim-logo_8c68d962.png

## Completed
- ideas.md rewritten with Kampung Coast direction (light warm theme, kid layer + expert layer)
- docs/todo-rework.md exists
- index.css: fully rewritten — warm cream bg, Baloo 2 (display) / Nunito (body) / IBM Plex Mono (expert), .soft-card, .panel-label friendly, .status-chip rounded, .grid-paper light, .float-gentle animation; removed dark console tokens except expert panels
- index.html: fonts swapped, title "Jom Selamatkan Bandar Pantai!", meta description localized
- types.ts: KID_INDICATORS (7 with kidName/bm/kidStory/icon/happy/sad), KID_CONTROLS (8 with kidName/bm/kidStory/icon/goodWhenMore/badWhenMore), KID_GOALS (3 traffic-light goals: sea, city, people)
- Home.tsx rewritten: picture-book hero, 7 vital chips, 4 easy steps, Pak Ali quote, honesty chips, warm footer

## Progress (Kampung Coast rewrite)
- DONE: index.css (light theme), index.html fonts/meta, types.ts KID_* data, Home.tsx, Briefing.tsx, CityMap.tsx (soft palette + BM labels), ControlPanel.tsx (kid names, stories, trade-offs, LucideIcon fixed), IndicatorStrip.tsx (kid names, meter bar, tap-for-story, mood dot)
- TODO next: SiteHeader.tsx (light theme — it's dark console style; currently used by Simulator/Results/Transparency; Home & Briefing built own headers), Simulator.tsx (kid-friendly rewrite: big year readout, friendly labels, finished card w/ mood scene happy/sad images, "Kenapa?"), TimelineChart.tsx (light axes/grid), Results.tsx (story-first: mood scene + sentence, 3 traffic lights, Kenapa plain + expert toggle), Transparency.tsx (light styling + teacher/prof framing), App.tsx defaultTheme must be light.
- Then: screenshots (/, /simulator baseline run, /results, mobile), checkpoint, deliver.

## Remaining
1. Briefing.tsx: rewrite — story with Pak Ali, 4 illustrated steps, 3 goals as traffic lights, budget RM100/yr, mission targets as simple badges. Keep Back/Play nav.
2. SiteHeader.tsx: adapt (dark console header) — needs light theme treatment; pages use it.
3. Simulator.tsx: kid-friendly rewrite — big map (rounded, softer), KID_CONTROLS tooltips, live indicator strip using KID_INDICATORS (kid names + happy/sad), playback, keep engine; Results link at end.
4. ControlPanel.tsx: rework slider labels to kid names + goodWhenMore/badWhenMore; consider emoji-free icon arrows.
5. CityMap.tsx: friendlier palette/rounded cells, legend kid names.
6. IndicatorStrip.tsx: kid names instead of "Climate pressure", bigger faces.
7. Results.tsx: story-first — big mood scene (happy/sad town image) + one sentence, 3 traffic-light goal cards, kid explanation, "expert view" toggle showing score breakdown + equations-style detail + saved compare.
8. Transparency.tsx: keep but style light; mention it's for teachers/professors.
9. App.tsx: ThemeProvider defaultTheme must be "light" (currently may be light already).
10. TimelineChart.tsx: light theme colors for grid/axes.
11. Test baseline + extreme runs; mobile screenshot; checkpoint; deliver.

## Engine (DO NOT TOUCH)
- client/src/lib/sim/engine.ts — deterministic 25-year sim, runSimulation(controls), calibrated baseline ~8.2 Mt emissions, budget, events, causal links, score/100. Untouched.
- SimContext persists controls + scenarios in localStorage key "ecosim:v1".

## Notes
- Vite error lines in devserver log about Results/Transparency missing are stale (14:10/14:11, before pages were created) — not current issues.
- tscheck currently clean (0 errors).
- Checkpoint v1 delivered earlier: 49453718 (dark console version). New checkpoint should be at end.
- User wants: see-and-understand, Malaysian culture, simple-but-hard (5-year-old + professor).
