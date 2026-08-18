# ECO//SIM — Design Direction v3: "Editorial Field Study"

## User feedback driving this version
"Stop using AI images — use real photos. Make everything less AI. Apply anti-AI design principles and UI/UX Pro Max guidelines. Design it to be international and award-winning. Better explanations. Less scrolling — things should fit on screen."

## Research inputs (see docs/research-antislop.md)
Anti-slop: custom palette (no Tailwind defaults), asymmetric grid layouts that break the centered-card grammar, one component vocabulary (no rounded-2xl/shadow reflex — thin borders + contrast instead), concrete human copy, real photography, distinctive typography (never Inter).
UI/UX Pro Max: contrast ≥4.5:1, 44×44 touch targets, motion with meaning (subtle 250–350ms stagger), zero-radius-or-consistent-radius discipline, no emojis, paper noise texture, hairlines, mono uppercase labels, single accent only.
Award signals (Awwwards): oversized typographic hero, editorial numbering, generous intentional whitespace, full-bleed photography, strong grid with asymmetric breaks, motion that reveals.

## CHANGED direction: "Editorial Field Study" — international, human, photographic

**Design Movement**: Contemporary editorial / international documentary style — think National Geographic field-expedition report crossed with a modern Swiss-editorial magazine (like Pentagram's The New York Times redesign). Real photography does the emotional work; typography does the structural work; data is set like specimen labels.

**Core Principles**:
1. **Photography is truth** — real photographs of Malaysian coastal life, full-bleed, uncropped-away borders. Never again AI illustrations.
2. **One screen, one decision** — every page is designed as a single viewport decision surface; scrolling is the exception.
3. **Editorial asymmetry** — offset grids, bleeding images, overlapping caption blocks; no centered stacked card rows.
4. **Discipline over decoration** — zero border radius everywhere, hairline borders instead of shadows, paper grain texture, one accent color (Malaysian vermilion / sea teal — single).

**Color Philosophy** (custom, not default Tailwind): warm paper `#F4F1EA` base, deep ink `#1C1A16`, single accent **vermilion `#C84A2E`** (Malaysian terracotta roofs / fishermen's lifebuoys — unmistakably human, not AI-blue), supporting **deep sea `#1F4B45`** for data only. No purple gradients, no indigo.

**Layout Paradigm**: Full-viewport hero with oversized serif headline left-offset over full-bleed photograph. Pages are structured as field-report sheets: numbered sections (01/02/03), hairline rules, margin labels in mono. Simulator is one viewport: year/budget + map left, controls + readouts right, no scrolling.

**Signature Elements**:
1. **Field-number labels** — "SECTION 01 — THE TOWN" in mono uppercase with hairline underlines.
2. **Photo + caption plates** — real photographs framed with a caption strip (date/place/data) like a documentary plate.
3. **Single vermilion thread** — one accent used for all interactive and key data moments; everything else ink/paper.

**Interaction Philosophy**: Quiet and precise. Hovers reveal hairlines; presses are instant (160ms, scale 0.97); no bouncy animations. Data updates with restrained number morphs.

**Animation**: Stagger 30ms per item, 250–350ms, ease power1.out. Reveal-up 12px only. Respect prefers-reduced-motion.

**Typography System**:
- Display: **Newsreader** (editorial serif, optical sizes) — headlines, oversized.
- Body: **Public Sans** — government-document warmth, highly readable.
- Data/labels: **IBM Plex Mono** — specimen labels, micro-copy.
- Hierarchy: giant serif headline > mono field labels > small public-sans body.

**Brand Essence**: "ECO//SIM — A Field Study of a Town." An international educational simulation grounded in real Malaysian coastal life. Adjectives: documentary, precise, humane.

**Brand Voice**: Documentary narration — specific, concrete, numbers, no empowerment-speak. Examples: "Twenty-five years. One million people. Seven things to protect." / "Year 2026. The town is yours."

**Wordmark & Logo**: ECO//SIM set in Newsreader italic with the twin slash in vermilion. No cartoon icon.

**Signature Brand Color**: Vermilion `#C84A2E`.

## Single-screen constraints (hard rule)
- Landing: hero fills the viewport; everything below the fold is one band max.
- Briefing: fits one screen (1024px+); on mobile it stacks but stays compact.
- Simulator: everything in one viewport on desktop — grid: year bar / map / indicators / controls; only playback expands.
- Results: one-screen scorecard layout.

## Imagery inventory (real photos, uploaded)
- /storage/real-kampung-boats_57e6e432.jpg — boats & stilt houses, Kuala Kedah (hero)
- /storage/real-kelantan-jetty_3efeb546.jpg — Kelantan jetty market (briefing plate)
- /storage/real-penang-jetty_a82ca28d.jpg — Penang clan jetty (landing plate / results)
- /storage/real-mangrove-aerial_deefef09.jpg — mangrove aerial (nature section)
- /storage/real-mangrove-river_4e88bc33.jpg — mangrove river (water section)
- /storage/real-fishermen-nets_6fb1be29.jpg — fishermen pulling nets (controls storytelling)
- /storage/real-fishermen-dawn_e6a0536d.jpg — fishermen at dawn (results mood)
- /storage/real-beach-sunset_7c0d4a16.jpg — sunset beach (CTA/footer)
- /storage/real-kuala-kedah_6538ea79.jpg — Kuala Kedah waterfront (backup)
- /storage/real-kuala-kedah2_6ae7337f.jpg — Kuala Kedah coast (backup)
