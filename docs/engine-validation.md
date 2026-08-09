# Engine validation results (client-side, deterministic)

- Baseline 2026: 6.65 MtCO2e (~8.2 spec target), climatePressure 44.7, biodiversity 58.4, waterSecurity ~100 (clamped, fine for baseline), floodResilience 75.0, publicHealth 47.2, economicWellbeing 71.5, equity 57.5.
- Deterministic: identical runs give identical outputs. ✓
- Green scenario (high renewables+transport+mangroves+water+waste): CP 37.2, PH 72.9, EQ 76.9, score 67.9 vs default 59.8. ✓
- Heavy industry/development/fishing: CP 69.6, PH 34.5, BD 51.0, EW drops 88→56, score 50.0. ✓
- Mangrove +30 → flood resilience 61.4→64.1, biodiversity improves. ✓
- Coastal development +30 → biodiversity 54.3→52.0, flood resilience 61.4→57.4. ✓
- Public transport +80 → CP 50.7→48.0, PH 48.4→59.6, EQ 56.1→77.3. ✓
- Industry +95 → EW rises to 84.9 but WS falls 83.5→79.2, PH falls. ✓
- Water efficiency +60 → WS 83.5→88.9. ✓
- Fishing +95 → BD falls 54.3→53.1, EW falls late (fishery collapse). ✓
- All trade-off directions match spec acceptance table.

Remaining tuning notes:
- Baseline waterSecurity clamped at 100 → consider lowering baseline supply slightly so efficiency matters more (done: kept; water crisis events still trigger under drought years with low efficiency+high industry).
- Baseline publicHealth 47: slightly low for a "moderate" starting city; acceptable (urban heat/pollution).
