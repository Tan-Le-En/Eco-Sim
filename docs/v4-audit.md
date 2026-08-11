# v4 audit findings (from full-page screenshots)

## Simulations
Simulator screenshot shows a bug: map cells render as large squares with WHITE GAPS/labels; during the full-page screenshot (animated entrance), cells show stray numbers "12 13 14..." — actually each cell's coordinate label is bleeding through (elevation/label text) and map header row "TELUK NUSA — TOWN SURVEY" header is OK. The grid itself looks broken in full-page mode: cells appear as big colored blocks with visible coordinate text printed on them, legend text overlaps cells ("Pusat bandar / Houses / Kampung houses..."). The live viewport mode (earlier screenshots) showed correct grid. Root: framer-motion AnimatePresence stagger animates each cell's children; coordinate tooltip text rendered inside cells visible in capture. The numbers (12,13,14...) are cell coordinate labels rendered for the tooltip — should only appear on hover but are visible. Check CityMap rendering.

## Spacing/positioning issues
1. Simulator: "ELEV 0.2 M" text in map header gets cut off ("SUNGAI (RIVER) · ELEV 0.2 M" ok but right side clipped by controls column). Map label overflow.
2. Simulator: legend sits right of grid but items overlap nothing—actually in full-page shot legend text overlaps grid cells (purple legend text over cells). Probably legend positioned absolute with top too low.
3. Results: verdict photo figure — bottom caption bar shows a thin white strip below image then caption underneath as separate band; caption should overlay image bottom. Also "GOALS REACHED 0/3" fine. "City is safe & healthy" header truncated ("CITY IS SAFE & HEALT...") due to fixed width — give it more width or shorter label.
4. Results: "Share score" / "Play again" fine.
5. Home: good overall; the three photo plates good. Hero photo caption fine.
6. Briefing: good. Photo plates fine. Right column images end, then empty space — could add photo strip or the datum table (accordion) — empty whitespace below "READ THIS PAGE, THEN GO GOVERN". Could move challenges section up.
7. Transparency: very thin width, centered narrow col — fine but could be 2-col for large screens; currently single centered 800px column. Also score weights bars overlap text (bar sits behind label row?). Bars render over the label lines: "CLIMATE PRESSURE" text overlapped by red bar. Fix: put bar under each label row properly (block layout, not overlap).
8. Simulator map header: "SUNGAI (RIVER) · ELEV 0.2 M" — the elevation label is fine but the whole header bar is tight.

## Performance
1. CityMap uses 400 <button> with hover tooltip + possible framer-motion; big repaint each tick. Replace with a single SVG grid (rects) that updates via props; tooltip via pointer coords.
2. Playback uses setInterval w/ setState per year; fine but UI updates each year; ensure no heavy layout thrash. Consider batching: step N years per frame at fast speed.
3. TimelineChart (Recharts) re-renders whole chart each tick; could throttle with useMemo'd data.

## Photo inventory (already uploaded)
- real-beach-sunset_7c0d4a16.jpg (sunset beach)
- real-fishermen-dawn_e6a0536d.jpg (fishermen dawn)
- home: kuala kedah stilt boats (home hero right half — inline? check src)
- briefing: fishermen dawn + mangrove river
- home plates: clan jetty illustration? (penang-jetty), mangrove river langkawi, fishermen hauling nets

Need more photos: town street, school/hospital (people), fishing boats closeup, monsoon storm sea, coral reef/sea life, mosque/pasar, river kampong, school children (avoid identifiable faces? use wide shots), market.

## Story mode plan
New route /story: 4 chapters, cinematic full-screen photo + large serif text (kid voice, Pak Ali), one policy decision per chapter shown as a simple choice that jumps to preset controls, then continue playing. Chapters: 1) The Bay We Inherited (intro + baseline state), 2) The Monsoon Year (flood event), 3) The Mangrove Comeback (hope), 4) Your Town, 2050 (endings). Each chapter: full-bleed real photo, caption, big quote, "Continue" — after chapter 4 lands in simulator with those controls pre-set.
