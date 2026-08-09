# ECO//SIM — Design Direction (v2: "Kampung Coast")

## User feedback driving this version
"Too complicated — you look at it and it's hard to understand. I want to see it and understand. Based in Malaysian culture. Simple but hard: a 5-year-old understands everything, a professor of environmental technology still applauds it."

## CHANGED direction: "Kampung Coast" — warm, instant, Malaysian

**Design Movement**: Warm Malaysian daylight modernism — the visual language of a beautifully illustrated children's picture book of the Malay coast (kampung houses on stilts, fishing boats, mangroves, monsoon skies), crossed with the honest rigor of a science exhibit at the Petronas Science Centre. Think "Puspakar illustration meets National Geographic Kids Malaysia".

**Core Principles**:
1. **One glance, one story** — every screen answers "is the city happy or not?" in under 2 seconds: a big friendly face/city portrait, three traffic lights, zero reading required.
2. **Kid words up front, professor words below** — layering: children's plain language on top ("the sea is angry"), expandable expert layer underneath (numbers, equations, weights).
3. **Malaysian everywhere** — warm cream/sand/sea palette, local names and references (Nusa Bay = "Teluk Nusa", kampung, nelayan, monsoon, kedai, durian economics), Bahasa Malaysia sprinkle words used naturally (sayang, bagus, waspada).
4. **Still hard, still honest** — the engine from v1 is untouched: 8 sliders, 7 indicators, 25-year simulation, scoring, causal links. Complexity is hidden behind "Tap to learn why" affordances, never removed.

**Color Philosophy** (light theme now — instantly readable by children): warm cream paper background (like a picture book), deep sea-teal for the ocean, lush mangrove green for nature, sunny amber for warnings, coral for danger, warm terracotta accents. Dark mode console look is GONE for the main flow; kept only as an optional "expert night mode" on the transparency page.

**Layout Paradigm**: Picture-book hero (huge illustrated coastal scene + 1 sentence). Then one-screen simulator shaped like a game: big friendly map in the middle, sliders as simple "more/less" toggles with icons, giant animated "city happiness" result. No data walls.

**Signature Elements**:
1. **The City Face** — Nusa Bay shown as a living illustrated scene that visibly changes mood (sunny/smiling → stormy/sad) as indicators shift.
2. **Traffic-light goal cards** — three big circles (green/amber/red) for the kid's goals: sea clean, city safe, everyone happy.
3. **"Kenapa?" (Why?) taps** — every number has a tappable why that opens plain-language explanation first, expert numbers below.

**Interaction Philosophy**: Big targets, no small text. Sliders with live emoji-free icon arrows (fish icon moves, water icon moves). Instant color feedback. A friendly narrator voice in copy ("Pak Ali the fisherman says…").

**Animation**: Soft and bouncy for child delight (springy entrances 300ms, gentle floating clouds), but charts animate precisely for the expert. Respect reduced motion.

**Typography System**:
- Display: **Baloo 2** (rounded, friendly, Malay-web standard) — headlines and big numbers.
- Body/explanation: **Nunito** — warm, highly readable.
- Expert data: **IBM Plex Mono** — only inside "expert view" panels.
Hierarchy: one giant friendly sentence > big icon numbers > tiny expert footnote.

**Brand Essence**: "ECO//SIM — Permainan Bandar Pantai." A game you play with your town. Kid-friendly warmth, Malaysian soul, professor-grade honesty underneath. Adjectives: warm, playful, true.

**Brand Voice**: Like a kind teacher who is also a scientist. Short sentences. Local warmth.
- Example headline: "Bandar kamu perlukan kamu." (Your town needs you.)
- Example CTA: "Main! Let's protect Teluk Nusa"
- Narrator: "Pak Ali, our old fisherman, says the fish are fewer every year…"

**Logo**: same ECO//SIM wordmark kept for continuity, but now on cream with teal slash.

## Engine (unchanged, kept from v1)
- 8 controls, 7 indicators, yearly 2026–2050 deterministic simulation, budget, events, causal links, score/100, saved scenarios.
- Re-label indicators for kid layer; keep original keys in code.

Kid-friendly indicator names (EN first, BM beside):
- climatePressure → "Sea & Air" (Laut & Udara) — heat/smoke/warming
- biodiversity → "Nature & Animals" (Alam & Haiwan)
- waterSecurity → "Clean Water" (Air Bersih)
- floodResilience → "Safe From Flood" (Selamat Dari Banjir)
- publicHealth → "Healthy People" (Orang Sihat)
- economicWellbeing → "Good Life" (Kehidupan Selesa)
- equity → "Fair For All" (Adil Untuk Semua)

Kid-friendly control names:
- Renewable electricity → "Clean power" (solar/wind instead of smoke)
- Public transport → "Buses & trains"
- Tree & mangrove restoration → "Plant trees & mangroves"
- Coastal development → "Building near the beach"
- Water efficiency → "Saving water"
- Waste & recycling → "Sorting rubbish"
- Fishing pressure → "How much we fish"
- Industrial activity → "Factories working"
## Style Decisions

- Every main gameplay/results screen begins with the same hierarchy: **living Teluk Nusa mood portrait first, three traffic-light goals second, expert numbers third**. Implemented as the TownMood band (Simulator) and mood portrait + traffic lights on Results.
- The simulator map reads as a **picture-book coastal play-board of Teluk Nusa**: rounded organic cells, wave-and-beach header strip with a little boat token, compass marks, BM labels (Bakau, Kampung, Kilang).
- Expert material lives in a distinct **"science exhibit" layer**: IBM Plex Mono / chart-grid language and "Kenapa?" framing only after the child-friendly explanation has answered what happened.
- Signature motif: hand-drawn wave divider with boat token (WaveDivider), teal slash in the ECO//SIM wordmark, recurring Malaysian tokens (fish, mangrove, monsoon) as section accents.
