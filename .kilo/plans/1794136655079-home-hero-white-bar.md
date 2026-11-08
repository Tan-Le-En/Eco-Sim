# Plan: Home hero fit + white bar + header/moonlight reposition

## Goal
- Hero section fits within viewport (no scroll on desktop).
- Bare SiteHeader bar on Home hero is solid white and spans to the theme toggle.
- Header/moonlight backdrop sits above the hero photo, extended over the light-switch toggle (not just top).

## Affected files
- `client/src/pages/Home.tsx` — hero section height/padding.
- `client/src/components/SiteHeader.tsx` — bare mode styling.

## Changes
1. Home hero: change `min-h-screen` to `h-screen` (or `max-h-screen overflow-hidden`) and reduce vertical padding (`py-8 lg:py-10` → `py-4 lg:py-6`) so content fits without scroll.
2. Bare header: `bg-background/92` → `bg-white` (light) with dark variant; inner container widen to reach toggle; extend bar over toggle region.
3. Move moonlight/backdrop above hero photo: adjust z-index/positioning so backdrop sits above photo but below content; extend over toggle.

## Validation
- `npm run typecheck` / `npm run lint` if available.
- Visual check desktop 1440px no scroll on hero.
