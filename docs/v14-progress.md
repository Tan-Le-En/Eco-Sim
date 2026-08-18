# v14 Progress State

## Done
- Removed FloatingContact (field desk) from App.tsx and deleted component file
- Replaced ALL AI-generated images with real photography:
  - CityMap base: `/storage/teluk-nusa-map-real_042467eb.jpg` (Kuala Kedah aerial)
  - Home HERO: same as map (aerial estuary)
  - Home JETTY: `/storage/stilt-houses-real_4d70b8ec.jpg`
  - Home MANGROVE: `/storage/merbok-mangrove-real_ccdd2def.jpg`
  - Home NETS: `/storage/fishermen-dawn-nets-real_81f6e009.jpeg`
  - Home LANGKAWI: `/storage/clan-jetties-aerial-real_f756af5d.jpg`
  - Briefing PHOTO: `/storage/fishermen-net-cast-real_a6fc104d.jpg`
  - Briefing RIVER: merbok mangrove
  - Briefing JETTY: clan jetties aerial
  - Story riverVillage: stilt houses
  - Story mangroveRoots: `/storage/mangrove-roots-real_fc3e4c78.jpg`
  - Story fishingCoast: fishermen net cast
  - Story mangroveAerial: merbok mangrove
  - Story workingJetty: clan jetties aerial
  - Simulator FINISH_PHOTO: fishermen dawn nets
  - Simulator DAWN_PHOTO: fishermen net cast
  - Results SUNSET_PHOTO: fishermen dawn nets
  - Results DAWN_PHOTO: fishermen net cast

## Consequence reveal (partially done)
- CityMap: zoom effect at year >= 2050 (scale 1.05 with 800ms transition)
- CityMap: enhanced overlay intensity near 2050 (isLate flag)
- Simulator: verdict photo has animate-in zoom-in-50 + weather overlay gradient

## TODO
- TimelineChart tooltip: add "what changed?" tooltip on hover showing causal chain for a specific year
- Verify compile
- Checkpoint
