# Mobile audit v6 (375px full-page)

## Home (/)
- Hero: H1 "One million people. Twenty-five years." — words wrap mid-line ("people." alone on line 2? acceptable). Header nav wraps oddly: "ECOSIM STORY MODE TRANSPARENCY" row wraps with ENTER THE FIELD dropping below. Hero field-label ok.
- Hero nav buttons stack on 2 lines — fine, but "ENTER THE FIELD" black button full-width second row looks awkward next to 2 small buttons. Could use icon-only or keep. Minor.
- FIELD plates on mobile: image captions wrap to 2 lines ("WALKWAYS OVER THE SEA" wraps) — acceptable.
- CTA band: fine.
- ISSUE: hero H1 line "Twenty-five" is last part of "One million people. Twenty-five years." — wraps as "people." then "Twenty-five" then "years." — okay.
- Header: logo text slightly cut at left edge ("ECOSIM" appears merged). Check padding — logo Link has items-baseline gap-1, seems fine.

## Story (/story)
- Chapters read fine. Chapter header "Five chapters. No numbers..." wraps; italic "No numbers" ok.
- Bottom dark band: text fine.
- OK.

## Briefing (/briefing)
- Title wraps: "Teluk Nusa is yours. Keep it alive for 25 years." — fine.
- Issue: FIG.02 plate caption shows "shutterstock.com - 2472422755" — WATERMARK/URL VISIBLE in the image! The fishermen nets photo is the licensed watermark version. MUST replace.
- Issue: "WHAT'S WRONG IN 2026" — the four items have very tight left borders; the label (SMOKE) and text ok.
- Datum accordion at bottom fine.
- Replace FIG.02 image (real-fishermen-nets_6fb1be29.jpg?) with non-watermarked version (real-beach-sunset_d533ecf5.jpg is used in Results; or monsoon sea).

## Simulator (/simulator)
- Instrument bar wraps to 3 lines (Year, Mission, Budget all stacked) — ok.
- Map fine (4:3 aspect, visible).
- Registers ok; trajectory chart ok.
- Controls panel stacked at bottom; fine.
- TownMood 3 goal cells titles wrap ("CLEAN & CALM SEA" two lines) — acceptable but could shrink font.

## Results (/results) — to check
## Transparency (/transparency) — to check

## Fixes TODO
1. Replace Briefing FIG.02 watermarked image.
2. Simulator mobile polish: pin instrument bar? Not needed. Reduce TownMood cell title font on mobile.
3. Home hero nav: consider stacking nav in drawer? Minimal — keep but ensure contrast/spacing.
4. Verify Results + Transparency mobile.
5. Check 768px tablet briefly.

## Results (/results) 375px — CRITICAL
- GOALS REACHED row: three goal labels OVERLAP ("CLEAN & CALM SEA / SAFE & HEALTHY TOWN / FAIR FOR EVERYONE" rendered on top of each other). Need flex-wrap + smaller text on mobile.
- Verdict photo plate fine.
- Events list fine. Causal links fine.

## Transparency (/transparency) 375px
- Page renders fully, readable. Fine. No overlap seen.

## Fix priorities
1. Results goal cells overlap on mobile — highest priority.
2. Briefing FIG.02 watermarked image — replace with non-watermarked photo.
3. Simulator TownMood goal titles wrap to 2 lines — shrink to text-[9px]/[10px] on mobile.
4. Home hero nav acceptable; keep.
