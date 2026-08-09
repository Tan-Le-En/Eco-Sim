# V2 screenshot findings (Kampung Coast)

All 5 pages render in the light theme — big win. Issues to fix:

1. **Simulator**: baseline "Climate pressure" shows 101 (out of range meter). The indicator value must be clamped visually; check engine baseline value ~100. Fix meter width to min/max and allow >100 display but cap bar. Also "Sea & Air 45 same" is fine.
2. **Simulator**: chart on initial state shows near-empty single vertical column — fine, it's pre-run.
3. **Simulator**: ControlPanel sliders render small circles (thumb ok). "LESS ← → MORE" row shows "less ← → more" fine.
4. **Results**: "0/3 goals reached" but "Teluk Nusa is happy!" — inconsistent. Baseline run: budget=0, water fell. Fix verdict threshold or goalsMet calculation; also "The sea is clean..." text contradicts 0/3. Use score>=58 AND goals; or show truthful mood text based on goals. Also "RM 0 left in the bank" shown with "happy" — needs truthful logic.
5. **Results**: causal chain empty-ish grid paper; events section says "+ 6 more events" collapsed but shows budget exhausted repeated (eventsToShow=6). Acceptable.
6. **Results**: "Clean Water 83" green but "City is safe & healthy" goal failed — because Healthy People 48 (<60) and Safe From Flood 61. OK.
7. **Transparency**: renders fine.
8. **Home**: good. Nav on Home shows only "Briefing/Play!" (SiteHeader not used there — Home has own header). Fine.
9. Indicator card widths: 7 cols ok on desktop.

Fix priority: clamp indicator values 0-100 in engine or display; fix results verdict consistency.
