# v5 progress notes

## Done
- 1% slider steps (ControlPanel.tsx SLIDER_RANGES step: 1 everywhere).
- Mission chip added to simulator instrument bar (Mission · N/5 targets live) using goalsMetCount from TownMood.
- Routing: root "/" already = Home (no redirect exists; user's preview just deep-linked to /simulator). No change needed.

## Remaining
1. Responsive simulator across phone/tablet/desktop/large: main grid lg:grid-cols-[1fr_360px] px-6; on mobile stack column (aside below). Already stacks. Verify at 375/768/1280/1600. Consider making whole cockpit fit single screen on desktop (h-screen overflow hidden inner scroll) — risky, keep as-is but reduce gaps on mobile.
2. Three goal cards' images align: these are in Home? No — "three cards images aligned" refers to Simulator TownMood? TownMood has no images. Home FIELD plates have images with h-44 same height — check alignment on large screens: figures have mb-10 + photo-plate; images share h-44 → aligned. Verify screenshot.
3. Real map: user wants actual map with squares accommodated to it. Plan: generate a stylized illustrated top-down map of Teluk Nusa (Malaysian coastal town, bay topography) and use it as the visual base in CityMap: overlay zone highlights (SVG rects/paths driven by engine data) ON TOP of the illustration. Approach: use generated map image as background (`<img>` with object-cover inside the map plate), keep hover grid for data. Simpler & robust: draw SVG overlay rects on top of the image with low alpha tints; keep existing interaction.
4. Also add mission targets explanation (tooltip/list of the 5 targets) near mission chip — add dialog or hover list of target names.

## Map implementation (done)
- Generated illustrated map: /manus-storage/teluk-nusa-map-illustrated_e05d6285.png (4:3, reserved URL, no text on it — but check if text rendered; the prompt said no words; it's an image so verify visually).
- CityMap.tsx now layers: absolute-positioned <img> base (object-cover) + SVG overlay of transparent/colored tints (overlayTint() added). cellColor() unchanged but unused now — could delete; kept for hover tooltips? No, hover shows CELL_LABELS only. cellColor is now dead code; remove cellColor fn + rects.fill usage already switched to overlayTint.
- cityMap.ts geography rewritten: bay curves into southeast (seaEdge = 16+3*sin), wetlands around river mouth, mangroves SE shore, urban core center-west, industrial NE, kampung south (y>=17), forest NW, farmland west. CELL_COLORS/CELL_LABELS unchanged.
- Added OVERLAY_LEGEND in CityMap (3 tint swatches) — NOT yet rendered in JSX; plan to show under the map plate or next to legend.
- Also compass strip at bottom still renders ["W","","","N","","","","E"] — keep but consider adding rose label.

## Still TODO
- Verify illustrated map image rendered (no placeholder); check image for stray text/watermarks; fix if needed.
- Remove dead cellColor function.
- Render OVERLAY_LEGEND small in CityMap.
- Mobile audit: verify simulator 375/768; make legend hidden on small screens (lg only).
- Mission targets explainer: add hover tooltip to Mission chip listing 5 targets (use shadcn tooltip).
- Simulator responsive: lg main grid gap-5 fine; mobile stacking fine — just verify.
- Home three cards images alignment check on desktop screenshot.
- Checkpoint + deliver: mention homepage default is working (user preview deep-linked), explain.

## Key files
- client/src/pages/Simulator.tsx (instrument bar, layout)
- client/src/components/CityMap.tsx + lib/sim/cityMap.ts (map logic, CELL_COLORS, types)
- client/src/components/ControlPanel.tsx (sliders)
- client/src/components/TownMood.tsx (goals)
