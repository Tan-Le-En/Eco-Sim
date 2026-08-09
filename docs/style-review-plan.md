# Style review — one holistic pass

Accepted amendments:
- Data panels must contain measured value, target/baseline, causal annotation, or plotted trace (no decorative grid alone) — simulator trajectory chart at 2026 shows empty big box; indicators need baseline refs + deltas (already have deltas, add baseline dashed note).
- Indicators = signature vital-sign system: consistent colored pulse/sparkline motif. Add ECG-style pulse mini-line to each indicator card + consistent delta chip.
- Nusa Bay imagery treated as evidence under study: add coordinate grid/crosshair annotation overlay to hero image.
- Simulator hierarchy: year readout mission-critical (keep glow), map central specimen (keep), add live-year annotation, trajectory with 2026 baseline line even at year 1.

Implementation plan:
1. IndicatorStrip: add pulsing colored sparkline path per card (SVG), delta chip beside value, keep baseline dashed concept (label ok).
2. CityMap: add subtle coordinate ticks/crosshair overlay (already has W/N/E labels; add corner crosshair + year stamp).
3. Hero (Home): overlay SVG grid + corner brackets + "SPECIMEN NUSA BAY · 06°12'S" annotation frame on hero image.
4. TimelineChart: always render baseline dashed line for climate pressure at 45? Keep simpler: show all indicators; add horizontal baseline rule for first year.
5. Results: event feed already dense; add baseline value to indicator rows in "what changed" table.
