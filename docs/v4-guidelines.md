# v4 design guideline research (sources)

## Google — Material 3 Expressive (design.google/library/expressive-material-design-google-research)
- Expressive design makes you feel something: color, shape, size, motion, containment used to draw attention to what matters.
- 46 studies, 18,000+ participants; preference up to 87% for expressive design (esp. 18–24).
- Usability finding: key UI elements spotted up to 4x faster when the primary action is LARGE, PROXIMATE to where the hand is, and uses a distinctive (secondary) color. (Send button above keyboard case.)
- Erases age effects: older users spot elements as fast as young in expressive designs.
- Context matters: never break established interaction paradigms (lists, labels) for flair — functionality first.
- Apply to us: make "RUN SIMULATION" bigger/warm, place playback controls prominent; keep familiar list/grid patterns; expressive photo storytelling OK.

## Apple — Human Interface Guidelines (developer.apple.com/design/human-interface-guidelines)
- Core principles: Clarity (legible, precise), Deference (content foremost, chrome stays quiet), Depth (visual hierarchy, motion conveys meaning), Familiarity (patterns people know).
- Layout: consistency of margins; typography sets hierarchy; color communicates; motion aids understanding of spatial relationships.
- Apply to us: deference = let photos and the map be the content, quiet chrome; motion must convey state (playback), never decorate; consistent margins across pages.

## Meta (developers.meta.com/horizon/design/)
- Immersive/comfort: reduce cognitive load, clear focus, spatial consistency. Apply: single focal point per screen.

## Nielsen's 10 heuristics (ixdf.org article, rooted in Apple/Google/Adobe practices)
1. Visibility of system status — playback year/budget always visible (we do this; strengthen with progress).
2. Match system & real world — plain language (done), photography of real Malaysia (done).
3. User control & freedom — pause, reset, undo (add reset-confirm).
4. Consistency & standards — icon/term consistency.
5. Error prevention — slider constraints, budget warnings before exhaustion.
6. Recognition rather than recall — show current values, goals on-screen.
7. Flexibility & efficiency — speed controls (done), keyboard shortcuts.
8. Aesthetic & minimalist — one focal point, no clutter.
9. Recognize/diagnose/recover from errors — plain failure messages (done).
10. Help & documentation — transparency page (done).

## Anti-AI-slop recap (from docs/research-antislop.md)
- Real photography, imperfect textures, asymmetric layout, opinionated serif+mono typography, hairlines over shadows, editorial captions.

## v4 execution decisions
- Photos become the spine: hero, briefing (3 plates), simulator goal zone plates (3 small captioned photos), results verdict photo + goal montage, transparency methodology photos.
- Performance: SVG city map (single element), RAF playback loop 1–2 years/frame, useMemo'd chart data, slider onChange debounced via CSS transition for values.
- Spacing: 12pt/24pt grid, uniform section padding (py-16), fix legend overlap, goal header truncation, transparency score-bars overlap.
- Story mode route /story: 4 chapters, full-bleed photo + big serif copy, Pak Ali voice, choices preset controls, ends jumping to simulator.
