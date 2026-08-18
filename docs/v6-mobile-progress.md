# v6 mobile polish — progress state

## Fixed already
1. Results goal-cell overlap on 375px — whitespace-normal + text-[9px] sm:text-[10px] in Results.tsx (grid-cols-3 goal cells now wrap cleanly).
2. Watermarked photos removed site-wide. Clean replacement: real-fishermen-nets-clean_bda00363.jpg (fishermen with nets at dawn, clean, 1600x1067). Now used in:
   - Home.tsx NETS, Briefing.tsx PHOTO (FIG.02), Results.tsx DAWN_PHOTO, Simulator.tsx DAWN_PHOTO.
   - Briefing PHOTO also got object-cover object-top.
3. TownMood simulator cells acceptable (wrap at 375px is fine).

## Remaining TODO
- Home hero mobile: nav row ("Story mode | Transparency | Enter the field") wraps to 2 lines at 375px — acceptable but ugly; consider hiding "Transparency" behind "More" or stacking with reduced text size. LOW priority, minor.
- Verify all 4 pages at 375 again after fixes (/results, /story, /, /briefing).
- Check 768px tablet: home hero right photo plate, simulator layout. (Already fine per earlier shots; simulator map aspect-ratio fix done in v5.)
- TypeScript check + checkpoint.

## Screenshot observations (latest 375px captures, pre-fix shown)
- /results: goals cells now 3-column non-overlapping (verified in last shot — CLEAN & CALM SEA / SAFE & HEALTHY TOWN / FAIR FOR EVERYONE all show without overlap). Verdict photo STILL showed old watermarked image BEFORE DAWN_PHOTO swap; re-verify now.
- /story: clean, fine.
- /: hero nav wraps to 2 lines; otherwise fine. FIG.03 fishermen plate now clean image.

## Notes
- Clean nets image source: search result 8 (6000x4000 unwatermarked fishermen nets dawn), saved /home/ubuntu/webdev-static-assets/real-fishermen-nets-clean.jpg, uploaded -> /storage/real-fishermen-nets-clean_bda00363.jpg
- Old watermarked files: real-fishermen-dawn.jpg and real-fishermen-nets.jpg in /home/ubuntu/webdev-static-assets/ (390x280, shutterstock watermark).

## Final 375px verification (post-fix)
All four pages verified at 375x812 (full-page):
- / : Hero header stacks cleanly (logo + field label row, then wrapped nav row). Three cards render with photos and captions. CTA band fine. No overlaps.
- /results: Verdict photo now CLEAN nets image (no watermark). Goal cells 3-col no overlap. Whole page readable.
- /briefing: Clean nets photo FIG.02 renders well on mobile. Goals register, challenges, CTA all fine.
- /simulator: Year/Budget/Mission chip top bar stacks; map renders illustrated geography at 375px; all 8 controls visible (08 Factories Working visible); trajectory chart renders. Single-column stack good.

Remaining minor (accepted): TownMood titles wrap to 2 lines on phone (acceptable, small).
Next: TypeScript check, checkpoint, deliver.
