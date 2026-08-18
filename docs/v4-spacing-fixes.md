# v4 spacing fixes (fresh audit, 14:17 → status 14:35)

1. DONE — Results verdict photo plate: updated SUNSET/DAWN_PHOTO paths to re-uploaded hashes (d533ecf5 / 28f5a3e4); fixed collapsed figure column; photo now renders edge-to-edge with flush caption strip.
2. DONE — Results goal headers: shortened titles ("Clean & calm sea", "Safe & healthy town", "Fair for everyone") + whitespace-nowrap; no more truncation/wrap.
3. DONE — Transparency score weights: verified stacked label row + bar row (no absolute overlay). Page is fine.
4. DONE — Control 08 (Industrial Activity) renders: verified 8 rows, aside scrollHeight 1127 > clientHeight; changed aside to lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto with pb-4 for reliable scroll.
5. DONE — Control header value wrap: widened to w-20, whitespace-nowrap, removed space after "/".
6. DONE — Briefing right column: added FIG.04 clan-jetty plate, river figure h-64→h-40; column now fills page end-to-end.
7. DONE — All storage paths verified (HTTP 206 + ff d8 ff JPEG magic) across client/src.
8. Home page verified clean: hero photo-plate caption flush, three-column "how the study works" fine, quote band + 2 CTAs fine.
9. Remaining (next phase): add langkawi-boats photo plate to Home bottom band; Story Mode layer; mobile responsive pass; story/photo integration on Results goal montage.

## Remaining next_steps from previous session
- Home bottom band: add langkawi boats photo plate between quote and CTAs (or closing band)
- Story mode layer implementation
- Mobile responsive audit (briefing/simulator/results on 375px)
