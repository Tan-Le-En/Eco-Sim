# v15 Progress State

## User complaints (current task)
1. Cookie banner - verify it's working (it IS wired in App.tsx, localStorage check at 900ms delay)
2. HD photos - the map photo looks blurry/bad quality at full size. Need a MUCH higher resolution aerial.
3. Pop-up positioning - tooltips/overlays look misaligned, need to fix positioning
4. Story mode needs feeling - rebuild as emotional narrative that reflects simulation outcomes, not static panels

## Best map candidates found
- Index 3 (aMefGXFEnWes.jpg, 800x450): "Aerial Drone View of River Estuary and Seascape with Rural Settlement in Sedili Kecil, Johor, Malaysia" - good, shows river meeting sea with green vegetation and houses
- Index 4 (HNV0x2ChH4T0.jpg, 716x900): "Aerial Drone View of a River with Rural Settlement in Sedili Kecil" - portrait, winding river
- From earlier: merbok-mangrove-real (already uploaded, decent but maybe not HD enough for full map)
- The current map photo: /storage/teluk-nusa-map-real_042467eb.jpg (Kuala Kedah aerial) - user says it looks bad/blurry

## Current images in use
- CityMap + Home HERO: /storage/teluk-nusa-map-real_042467eb.jpg (needs HD upgrade)
- Story plates, Briefing plates: stilt-houses, mangrove-roots, fishermen-net-cast, fishermen-dawn-nets, merbok-mangrove, clan-jetties-aerial

## HD Map decision
- Best candidate: real-kuala-kedah2.jpg (1440x780, 113KB) - decent resolution, already uploaded as /storage/teluk-nusa-map-real_042467eb.jpg OR similar
- real-jetty-town.jpg is 2600x1950 but it's a close-up of boats/stilts, not an aerial map view
- real-monsoon-sea.jpg is 2048x1365 but it's ocean/waves
- Strategy: use real-kuala-kedah2.jpg (1440px wide) as the map instead, or upscale/recompress the current map photo at higher quality
- Actually check what the current map URL resolves to and swap for a crisper version

## TODO
1. Swap map image to higher-res version (real-kuala-kedah2 at 1440x780 or find better)
2. Fix tooltip/pop-up positioning
3. Rebuild Story mode as emotional narrative
4. Verify cookie banner
5. Checkpoint
