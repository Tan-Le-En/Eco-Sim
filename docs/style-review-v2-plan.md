# Style review pass plan (Kampung Coast v2)

Accepted changes (one build pass):

1. **Simulator hierarchy**: Add a "town mood" header band — big mood face + one kid sentence ("Teluk Nusa is feeling fine today" / "Teluk Nusa is worried") + 3 mini traffic lights BEFORE the map. This makes the first read mood → goals → numbers. Keep map below but reframe as "Teluk Nusa play-board" with a wave/compass frame and Malaysian shoreline cues.
2. **City Map identity**: add a wave-shaped top edge (beach), monsoon cloud motif, boat marker, bigger rounded cells, section names in BM (Pantai, Bakau line) rendered with soft gradient shoreline strip; keep legend.
3. **Results**: already leads with mood portrait+verdict. Enhance: dynamic mood image (happy vs sad already), add a mood summary line above score. Keep expert layer collapsed in "The deep stuff".
4. **Brand cues**: add a hand-drawn wave separator component with batik-pattern accent used between sections; teal slash in wordmark. Add small doodle icons (fish, mangrove, boat) as recurring tokens in footer and section dividers.
5. **Indicator cards on simulator**: keep but add traffic-light dot per card (green/amber/red threshold) — this merges the traffic-light language into the live readout.
6. **Append brief amendments** to ideas.md under "## Style Decisions".

Implementation order:
- index.css: add wave separator + batik border utilities + traffic-light dot colors.
- components/WaveDivider.tsx (new).
- components/CityMap.tsx: shoreline frame, boat/mosque markers, rounded cells already.
- components/IndicatorStrip.tsx: add threshold dot + mood sentence.
- pages/Simulator.tsx: mood band header.
- ideas.md: append decisions.
