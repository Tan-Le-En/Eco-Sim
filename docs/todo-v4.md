# v4 todo — fast, well-positioned, photo-rich, award-worthy

## Phase 18 — Audit
- [ ] Profile playback: CityMap re-renders all 400 cells per tick; 400 separate framer-motion buttons = slow & glitchy
- [ ] Screenshot audit: find spacing/positioning bugs per page (home, briefing, simulator, results, transparency)
- [ ] Check bundle: framer-motion overkill; heavy images lazy-load

## Phase 19 — Research & photos
- [ ] Search GitHub: performance/UX repos (e.g. Google Lighthouse perf, Material 3, Apple HIG summaries)
- [ ] Search Apple HIG, Material Design 3, Meta design guidelines key points
- [ ] Collect 6-8 additional real photos: mangroves, Penang clan jetty, Kuala Kedah, fishermen sunset, tropical town street, river, school, hospital
- [ ] Upload all via manus-upload-file --webdev

## Phase 20 — Performance
- [ ] CityMap: single SVG or canvas OR memoized grid with diff-based updates; no 400 buttons with motion
- [ ] Playback: requestAnimationFrame loop, batched state updates (1 tick/frame), skip-to-year fast jump
- [ ] Slider changes: debounce recompute; indicators use CSS transition not re-render
- [ ] Indicator sparklines: memoized, tiny SVG
- [ ] Images: lazy, responsive, preloaded hero only
- [ ] Remove framer-motion from hot paths; keep for page entrance only

## Phase 21 — Spacing/positioning
- [ ] Simulator: fix map label overlap (numbers printed over cells), legend overlapping grid, header button overflow
- [ ] Results: caption/figure overflow fix verification; goal cells alignment; events list width
- [ ] Home: hero photo ratio on various sizes; footer spacing
- [ ] Briefing: photo placement and text column balance
- [ ] Consistent 12pt baseline grid, section padding uniform

## Phase 22 — Photo richness + story mode
- [ ] Briefing: 3-photo strip with captions (fishermen, mangroves, stilt houses)
- [ ] Simulator: photo band or zone portraits for each goal (sea/town/people) — small captioned plates
- [ ] Results: photo montage per goal + final verdict photo with date/location caption
- [ ] Transparency: real photos in methodology (what we measured)
- [ ] Story mode: 3-4 scripted narrative chapters told with photos (e.g. "The Flood of '39", "The Mangrove Comeback") playable as guided scenarios with Pak Ali narration — kid voice, real photos, ends with lesson

## Phase 23 — Verify & deliver
- [ ] tsc clean, no console errors, playback smooth at 60fps
- [ ] Screenshots all pages; fix residuals
- [ ] Checkpoint + deliver with next-step suggestions
