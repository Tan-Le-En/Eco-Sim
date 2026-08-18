# v10 — Anti-AI-slop redesign: "true, intuitive, fun"

## Research (phase 1)
- [ ] Search "anti AI slop design guidelines", "anti AI slop manifesto", "anti slop UI UX"
- [ ] Read 2-3 concrete guideline sources; extract actionable rules
- [ ] Audit every page for current slop hallmarks

## Copy voice (phase 2)
- [ ] Remove em-dash heavy AI voice, emoji, "Discover", "Dive into", "Unlock", "Welcome"
- [ ] Remove "Simple enough for a child. Rigorous enough for a professor." tagline? (check)
- [ ] Rewrite home hero, CTAs, footers, all page intros in plain human editorial voice
- [ ] Remove "postcard from 2050", "send us a postcard" — cringey
- [ ] Shorten overly theatrical copy ("the town speaks", "You're the new boss? Good.") — keep warmth but less performative

## Visual slop removal (phase 2)
- [ ] Remove any purple gradients, blobs, glassmorphism misuse
- [ ] Remove generic AI-generated-looking illustrations if any remain (illustrated map = ok? it's stylized but clearly illustrative — keep, it's a map)
- [ ] Check for rainbow/gradient borders, emoji, excessive icons

## Intuitiveness + truth (phase 3)
- [ ] Make the simulator self-explanatory: goal visible, one paragraph "how to play"
- [ ] Ground numbers in real Malaysian data (sea level rise mm/yr, mangrove carbon, etc.) — link transparency to real sources
- [ ] Results copy: plain, factual, no cheerleading

## Verify (phase 4)
- [ ] Screenshot all pages, mobile + desktop
- [ ] Checkpoint + deliver

## Research findings (sources)
1. https://github.com/nexu-io/open-design/blob/main/craft/anti-ai-slop.md — "seven cardinal sins": indigo accent, trust gradients, emoji icons, serif mismatch, rounded card + colored left border, invented metrics, filler copy. Soft: AI template section sequence, placeholder CDNs, raw hex >12, accent overuse. Polish: blob/wave SVGs, perfect symmetry.
2. https://impeccable.style/slop — 64 patterns. Relevant copy rules: em-dash overuse (>2 in body = AI tell), marketing buzzwords, aphoristic cadence ("Not a feature. A platform." repeated pattern), theater framing ("killed the X theater"). Typography: kicker/eyebrow labels above headings = borrowed authority, oversized full-sentence hero headlines, crushed tracking, Inter/Geist/Instrument overused. Color: cream/beige palette = "tasteful default" AI surface, radial glow halos, gradient text. Layout: tiny numbered section labels imitating editorial structure, hero metric layouts, identical card grids, monotonous spacing, nested cards. Imagery: shape-assembled illustrations. Motion: pulsing dots, marquee, bounce easing, image hover transform.

## Site audit — slop hallmarks found in ECO//SIM (apply fixes)
### Copy (highest priority — "most cringey thing I've ever seen")
- [ ] Em-dash overuse EVERYWHERE (hero, story chapter voices, results, footer) → replace with commas/colons/periods
- [ ] Aphoristic cadence: "Simple enough for a child. Rigorous enough for a professor." / "There is no perfect choice, only trade-offs." / "The closer we build to the water, the more the town must defend itself" pattern — reduce repetition of manufactured contrasts
- [ ] "send us a postcard from 2050" theater framing → cut
- [ ] Story voices are performative roleplay ("You're the new boss? Good...") → rewrite plainer, respectful, still warm
- [ ] "the town speaks", "Field note", "Field desk" — keep a FEW but fewer; currently overused as eyebrow labels everywhere
- [ ] Footer: "fictional town · educational model" ok; keep.
- [ ] "A FIELD STUDY · FICTIONAL MALAYSIAN COASTAL TOWN · 2026–2050" eyebrow → fold into copy or drop
- [ ] "One million people. Twenty-five years." — ok as short punchy hero; keep.
### Layout/typography
- [ ] Tiny numbered section labels (01/02/03 beside every heading) → reduce; keep in Story chapter numbers (they're structural), remove elsewhere where decorative
- [ ] paper-grain noise + cream bg = cream-palette default → slightly cool the background? It's deliberate field-notebook, keep but consider tone
- [ ] Hero eyebrow label above display headline → fold into body copy
### Motion
- [ ] motion sections with whileInView fade+14px on EVERY block → too much ambient animation; reduce to entrance-only, fewer elements
### Truth grounding
- [ ] Transparency page: link equations to real sources (IPCC sea level, DOE Malaysia, FRIM mangrove) — make numbers defensible

## STATE (save before compaction)
Research done (see top of file). Audit done: em-dash counts per file: Briefing 3, Faq 12, Home 13, Results 11, Simulator 5, Story 16, Transparency 9, SiteHeader 2, ControlPanel 1, TownMood 2, types.ts 9. No postcard/theater found besides Story (grep matched Story — actually "postcard" string IS in Story.tsx line ~173). "Simple enough for a child. Rigorous enough for a professor." at Home.tsx:78.

## Copy rewrite plan — per file
### Home.tsx (DONE: plan)
- Line 57 field-label eyebrow → drop (hero eyebrow = AI tell)
- Line 66-68 hero para: remove em-dashes: "You govern Teluk Nusa, a small town on the Malaysian coast, from 2026 to 2050. Keep the sea alive, the water clean, and treat people fairly. That is the whole job, and it has no easy answer."
- Line 78 aphorism → replace with plain line: "Built for children. Tested against real models." or drop; replace with "All equations published. No black boxes."
- Line 164 quote "The bay was full of fish when I was young. Young boss — can you fix my town?" → real quote style: "When I was young the bay was full of fish. Can you keep it that way?"
- Line 162 field-label "The year is 2026" → drop
- group-hover:scale-[1.02] image hover transform → remove (slop motion tell)
### Story.tsx
- Chapter voices: keep quotes but shorten, remove em-dashes, make plain & dignified (real fishermen speak simply)
- "Young boss" roleplay → cut; ch05: replace "You're the new boss? Good..." with plain intro to budget
- Closing band: remove "send us a postcard from 2050" → "Try your first plan in the simulator."
- Chapter n numbers 01-05 KEEP (structural, not decorative)
### Results.tsx — remove em-dashes in verdict + goal descriptions; verdict copy plain/factual
### Simulator.tsx — mission chip copy plain; remove em-dashes
### Faq.tsx (12 em-dashes) — rewrite answers plain
### Briefing.tsx — plain mission copy
### Transparency.tsx — plain, add real-source citations (IPCC AR6, DOE Malaysia, FRIM) in notes
### types.ts — goal texts plain, no em-dash

## Voice principles (from research)
- No em-dashes in body copy (comma/colon/period instead)
- No manufactured-contrast aphorisms stacked repeatedly
- No "theater" framing, no roleplay, no "send us a postcard"
- Short honest sentences; specific verbs
- Keep warmth: Malaysian plain speech, respectful
