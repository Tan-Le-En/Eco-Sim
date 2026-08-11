# v3 screenshot findings

Pages render well overall. Editorial look lands: Home hero, Briefing, Simulator, Results, Transparency all in Newsreader/Public Sans/Plex Mono, real photos, vermilion accent, hairlines, no rounded cards.

Issues to fix:
1. Results "goals reached 0/3" fine (baseline run) but the photo-plate figcaption overlaps a big mono number "1,2755"? On the verdict plate, the caption bar shows "...2755" overflow — actually budget "RM 0" followed by caption text overlapping photo edge. Look: caption says "FIELD PHOTOGRAPH · TELUK NUSA · 2050, WORK AHEAD...1,2755" — the budget 1,2755 number leaked into caption? No: "RM 0" then caption. The caption is absolute positioned bottom-0 and extends past figure (number 1,2755 shows at right of caption — probably the "Budget remaining RM 1,2755"? Actually budget shown is 0. The "1,2755" is the budget remaining for the BASELINE fallback? It appears on right edge of figure below photo. Likely figcaption width overflows figure boundary. Fix: caption inside figure with right-0, and overflow hidden — figure has overflow-hidden already but caption is absolute inside; the leaked text is to the RIGHT of the figure? Screenshot shows number just right of caption inside plate area at figure bottom-right. Fix by removing min-h constraint? Simpler: give figcaption bg-background fully opaque + truncate whitespace-nowrap max-w-full.
2. Simulator: TownMood dots show first two dots filled but labels say goals; sea register shows 1 black + 2 empty squares — fine. Budget "RM 100" fine.
3. Results verdict photo alt good.
4. Overall: good. After fixing caption overflow, checkpoint + deliver.
